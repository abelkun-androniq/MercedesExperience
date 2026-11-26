// Route page (index.html): the stops grouped by room in walking order as photo cards, a jump list to the rooms (native
// fragment links; the hero's "Find your room" leads to it), plus offline status. Each card is one link: photo, familiar
// name, year and the car's question (its summary until it has one). Car configs are pure data, so this imports them without loading three.js. teaser.html has
// its own page script, teaser.js.
import tour from "../../stops/tour.js";
import { showOfflineStatus } from "./offline.js";
import { t, loadCar, localizePage } from "./i18n.js";
import { roomId, roomCaption } from "./route.js";

localizePage();
showOfflineStatus(document.getElementById("status"));

const route = document.getElementById("route");
const cars = await Promise.all(tour.map(s => loadCar(s.slug)));
const rooms = [];
tour.forEach((s, i) => {
  const key = `${s.room} · Level ${s.level}`;
  if (rooms.at(-1)?.key !== key) rooms.push({ key, id: roomId(s.room), name: s.room, level: s.level, stops: [] });
  rooms.at(-1).stops.push({ s, car: cars[i], n: i + 1 });
});

const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
const levelNote = room => (room.stops.some(({ s }) => s.check === "level") ? ` · ${t("level not yet checked")}` : "");

const jump = document.getElementById("jump");
jump.querySelector("ul").replaceChildren(...rooms.map(room => {
  const a = el("a", "pill"); a.href = `#${room.id}`;
  a.append(el("span", null, t(room.name)), el("small", null, t("Level {0}", room.level) + levelNote(room)));   // the doubt where the visitor chooses
  const li = el("li"); li.append(a); return li;
}));
jump.hidden = false;

// Signposts between the rooms for what the route has no stop for: changing exhibitions (until their end date) and the
// technology area below the last gallery. after: the room they follow.
const SIGNPOSTS = [
  { after: "Legend 6", until: "2027-04-04", title: t("On the way: Collection 5"), text: t("Changing exhibitions. Until 4 April 2027: the electric eSprinter van and eActros 600 lorry.") },
  { after: "Legend 7", title: t("After the racing curve: Level 0"), text: t("The museum's technology area, below the last gallery. No stop of this tour is there.") },
];
const today = new Date().toISOString().slice(0, 10);
const signpost = sp => { const li = el("li", "room signpost"); li.append(el("h2", null, sp.title), el("p", null, sp.text)); return li; };

route.replaceChildren(...rooms.flatMap(room => [roomItem(room), ...SIGNPOSTS.filter(sp => sp.after === room.name && !(sp.until < today)).map(signpost)]));

function roomItem(room) {
  const li = el("li", "room"), head = el("div", "room-head"), count = room.stops.length;
  li.id = room.id;
  head.append(el("h2", null, t(room.name)), el("span", null, (count === 1 ? t("Level {0} · 1 stop", room.level) : t("Level {0} · {1} stops", room.level, count)) + levelNote(room)));
  const ul = el("ul", "stops");
  for (const { s, car, n } of room.stops) {
    const a = document.createElement("a"); a.href = `stop.html?s=${s.slug}`;
    if (car.photo) {   // decorative inside the link: the car's name is the link text
      const img = Object.assign(document.createElement("img"), { src: `stops/${s.slug}/${car.photo.src}`, alt: "", width: car.photo.w, height: car.photo.h, loading: "lazy", decoding: "async" });
      const pic = el("div", "pic"); pic.append(img); a.append(pic);
    }
    const pill = el("span", "pill primary", t("See it working"));
    const arrow = el("i", null, "›"); arrow.setAttribute("aria-hidden", "true"); pill.append(arrow);
    const text = el("div", "text");
    text.append(el("small", null, t("Stop {0} · {1}", n, car.year)), el("b", null, car.name), el("p", car.question ? "question" : null, car.question ?? car.summary));
    if (car.photo?.caption) text.append(el("p", "caption", car.photo.caption));
    if (roomCaption(s)) text.append(el("p", "caption", roomCaption(s)));
    text.append(pill);
    a.append(text);
    const item = el("li", "stop"); item.append(a); ul.append(item);
  }
  li.append(head, ul);
  return li;
}

// Photo credits from the car data, so the line stays true as stops are added.
const credits = [...new Set(cars.filter(c => c.photo).map(c => `${c.photo.credit.author} (${c.photo.credit.license})`))];
document.getElementById("credits").textContent = t("Photos via Wikimedia Commons: {0}; each stop links its photo's source.", credits.join(", "));

// The room picker and the rooms exist only now: a link to one of them (index.html#jump, the highlights page's
// "See the full route", or #room-legend-6) lands here, as does a tap on "Find your room" before they were built.
const target = location.hash.slice(1);
if (target === "jump" || target.startsWith("room-")) document.getElementById(target)?.scrollIntoView();
