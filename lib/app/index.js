// Route page: the stops grouped by room in walking order as photo cards, plus offline status. index.html lists the whole
// tour; teaser.html (data-route="teaser" on #route) only the teaser stops, and their links keep &r=teaser so the stop pages
// page between those. Car configs are pure data, so this imports them without loading three.js.
import tour, { teaser } from "../../stops/tour.js";
import { registerOffline } from "./offline.js";
import { t, loadCar, localizePage } from "./i18n.js";

localizePage();
const status = document.getElementById("status");
registerOffline(function show(kind, s) {
  status.textContent = {
    ready: t("Ready offline ✓ — every stop is stored on this device."),
    partial: t("Storing the tour for offline use… ({0} of {1} files)", s?.cached ?? 0, s?.total ?? "?"),
    dev: t("Offline mode is off on this development server (add ?sw=1 to a built copy to test it)."),
    unsupported: t("This browser cannot store the tour offline; keep a signal."),
    error: t("Offline storage failed; the tour still works with a signal. Reload to retry."),
  }[kind];
  status.classList.toggle("ready", kind === "ready");
  if (kind === "partial") setTimeout(() => registerOffline(show), 1500);
});

const route = document.getElementById("route");
const isTeaser = route.dataset.route === "teaser";
const stops = isTeaser ? tour.filter(s => teaser.includes(s.slug)) : tour;
const cars = await Promise.all(stops.map(s => loadCar(s.slug)));
const rooms = [];
stops.forEach((s, i) => {
  const key = `${s.room} · Level ${s.level}`;
  if (rooms.at(-1)?.key !== key) rooms.push({ key, name: s.room, level: s.level, stops: [] });
  rooms.at(-1).stops.push({ s, car: cars[i], n: i + 1 });
});

const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
route.replaceChildren(...rooms.map(room => {
  const li = el("li", "room"), head = el("div", "room-head"), count = room.stops.length;
  head.append(el("h2", null, t(room.name)), el("span", null, count === 1 ? t("Level {0} · 1 stop", room.level) : t("Level {0} · {1} stops", room.level, count)));
  const ul = el("ul", "stops");
  for (const { s, car, n } of room.stops) {
    const a = document.createElement("a"); a.href = `stop.html?s=${s.slug}${isTeaser ? "&r=teaser" : ""}`;
    if (car.photo) {   // decorative inside the link: the car's name is the link text
      const img = Object.assign(document.createElement("img"), { src: `stops/${s.slug}/${car.photo.src}`, alt: "", width: car.photo.w, height: car.photo.h, loading: "lazy", decoding: "async" });
      const pic = el("div", "pic"); pic.append(img); a.append(pic);
    }
    const pill = el("span", "pill primary", car.components.map(c => c.label).join(" · "));
    const arrow = el("i", null, "›"); arrow.setAttribute("aria-hidden", "true"); pill.append(arrow);
    const text = el("div", "text");
    text.append(el("small", null, t("Stop {0} · {1}", n, car.year)), el("b", null, car.name), el("p", null, car.summary), pill);
    a.append(text);
    const item = el("li", "stop"); item.append(a); ul.append(item);
  }
  li.append(head, ul);
  return li;
}));

// Photo credits from the car data, so the line stays true as stops are added.
const credits = [...new Set(cars.filter(c => c.photo).map(c => `${c.photo.credit.author} (${c.photo.credit.license})`))];
document.getElementById("credits").textContent = t("Photos via Wikimedia Commons: {0}; each stop links its photo's source.", credits.join(", "));
