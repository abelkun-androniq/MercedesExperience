// Tour index: the route grouped by room in walking order as photo cards, plus offline status. Car configs are pure
// data, so this imports them without loading three.js.
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
  if (rooms.at(-1)?.key !== key) rooms.push({ key, name: s.room, level: s.level, stops: [] });
  rooms.at(-1).stops.push({ s, car: cars[i], n: i + 1 });
});

const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
const route = document.getElementById("route");
route.replaceChildren(...rooms.map(room => {
  const li = el("li", "room"), head = el("div", "room-head");
  head.append(el("h2", null, room.name), el("span", null, `Level ${room.level} · ${room.stops.length} ${room.stops.length === 1 ? "stop" : "stops"}`));
  const ul = el("ul", "stops");
  for (const { s, car, n } of room.stops) {
    const a = document.createElement("a"); a.href = `stop.html?s=${s.slug}`;
    if (car.photo) {   // decorative inside the link: the car's name is the link text
      const img = Object.assign(document.createElement("img"), { src: `stops/${s.slug}/${car.photo.src}`, alt: "", width: car.photo.w, height: car.photo.h, loading: "lazy", decoding: "async" });
      const pic = el("div", "pic"); pic.append(img); a.append(pic);
    }
    const pill = el("span", "pill primary", car.components.map(c => c.label).join(" · "));
    const arrow = el("i", null, "›"); arrow.setAttribute("aria-hidden", "true"); pill.append(arrow);
    const text = el("div", "text");
    text.append(el("small", null, `Stop ${n} · ${car.year}`), el("b", null, car.name), el("p", null, car.summary), pill);
    a.append(text);
    const item = el("li", "stop"); item.append(a); ul.append(item);
  }
  li.append(head, ul);
  return li;
}));

// Photo credits from the car data, so the line stays true as stops are added.
const credits = [...new Set(cars.filter(c => c.photo).map(c => `${c.photo.credit.author} (${c.photo.credit.license})`))];
document.getElementById("credits").textContent = `Photos via Wikimedia Commons: ${credits.join(", ")}; each stop links its photo's source.`;
