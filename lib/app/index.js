// Tour index: the route grouped by room in walking order, plus offline status. Car configs are pure data, so this
// imports them without loading three.js.
import tour from "../../stops/tour.js";
import { registerOffline } from "./offline.js";

const status = document.getElementById("status");
registerOffline(function show(kind, s) {
  status.textContent = {
    ready: "Ready offline ✓ — every stop is stored on this device.",
    partial: `Storing the tour for offline use… (${s?.cached ?? 0} of ${s?.total ?? "?"} files)`,
    dev: "Offline mode is off on this development server (add ?sw=1 to a built copy to test it).",
    unsupported: "This browser cannot store the tour offline; keep a signal.",
    error: "Offline storage failed; the tour still works with a signal. Reload to retry.",
  }[kind];
  status.classList.toggle("ready", kind === "ready");
  if (kind === "partial") setTimeout(() => registerOffline(show), 1500);
});

const cars = await Promise.all(tour.map(async s => (await import(`../../stops/${s.slug}/car.js`)).default));
const rooms = [];
tour.forEach((s, i) => {
  const key = `${s.room} · Level ${s.level}`;
  if (rooms.at(-1)?.key !== key) rooms.push({ key, stops: [] });
  rooms.at(-1).stops.push({ s, car: cars[i], n: i + 1 });
});

const route = document.getElementById("route");
route.replaceChildren(...rooms.map(room => {
  const li = document.createElement("li"); li.className = "room";
  const h2 = document.createElement("h2"); h2.textContent = room.key;
  const ul = document.createElement("ul"); ul.className = "stops";
  for (const { s, car, n } of room.stops) {
    const a = document.createElement("a"); a.href = `stop.html?s=${s.slug}`;
    const small = document.createElement("small"); small.textContent = `Stop ${n} · ${car.year} · ${car.components.map(c => c.label).join(" · ")}`;
    const b = document.createElement("b"); b.textContent = car.name;
    const span = document.createElement("span"); span.textContent = car.summary;
    a.append(small, b, span);
    const item = document.createElement("li"); item.className = "stop"; item.append(a); ul.append(item);
  }
  li.append(h2, ul);
  return li;
}));
