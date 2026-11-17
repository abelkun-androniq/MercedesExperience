// Page shell for every stop: stop.html?s=<slug>[&r=teaser]. Builds the page from stops/tour.js + stops/<slug>/car.js, loads
// each component's subsystem, and owns the Component/View switches, photo view, car outline, ghost body and frame loop.
// With r=teaser (links from teaser.html) prev/next, the stop count and the back link stay within the teaser.
import tour, { teaser } from "../../stops/tour.js";
import { registerOffline } from "./offline.js";
import { t, loadCar, localizePage, missing } from "./i18n.js";
import { h, link } from "./dom.js";
import { stageElement, mountViewer, caveats } from "./viewer.js";

const params = new URLSearchParams(location.search);
const slug = params.get("s");
const teaserStops = tour.filter(s => teaser.includes(s.slug));
const inTeaser = params.get("r") === "teaser" && teaserStops.some(s => s.slug === slug);
const route = inTeaser ? teaserStops : tour;
const idx = route.findIndex(s => s.slug === slug);   // validated before any dynamic import
const app = document.getElementById("app");

const seg = (key, label, items, cur) => h("div", { class: "seg-group", "data-key": key }, h("span", { class: "seg-label" }, label),
  h("span", { class: "seg", role: "group", "aria-label": label }, items.map(([v, text]) => h("button", { type: "button", "data-v": v, "aria-pressed": String(v === cur) }, text))));

localizePage();
registerOffline();
if (inTeaser) Object.assign(document.getElementById("back"), { href: "teaser.html", textContent: t("← Highlights") });
if (idx < 0) {
  document.title = t("Stop not found · Museum tour");
  app.replaceChildren(h("h1", {}, t("Stop not found")), h("p", {}, t("This QR code or link does not match a stop on the tour."), " ", link("./", t("Open the tour route"))));
} else {
  main().catch(err => {
    console.error(err);
    const stage = document.getElementById("stage");
    (stage ?? app).append(h("p", { class: "fail" }, t("The 3D view could not load. Check your connection and reload the page; after one visit with signal it also works offline.")));
  });
}

async function main() {
  const stop = route[idx];
  const car = await loadCar(stop.slug);
  document.title = t("{0} · Museum tour", car.name);
  const state = { comp: car.components[0].id, view: "model", outline: false };

  // ---------- page ----------
  const prev = route[idx - 1], next = route[idx + 1], here = s => `stop.html?s=${s.slug}${inTeaser ? "&r=teaser" : ""}`;
  const nameOf = async s => (s ? (await loadCar(s.slug)).name : null);
  const [prevName, nextName] = await Promise.all([nameOf(prev), nameOf(next)]);
  const photo = car.photo;
  const stageEl = stageElement(car); stageEl.id = "stage";
  const side = h("div", { class: "side" });
  const outlineBtn = h("button", { type: "button", class: "outline", "aria-pressed": "false", "data-only": "photo" }, t("Car outline"));
  const toolbar = h("div", { class: "toolbar" },
    car.components.length > 1 ? seg("comp", t("Component"), car.components.map(c => [c.id, c.label]), state.comp) : null,
    photo ? seg("view", t("View"), [["model", t("3D model")], ["photo", t("Museum photo")]], state.view) : null,
    photo ? outlineBtn : null);
  document.getElementById("where").textContent = t("Stop {0} of {1} · {2} · Level {3}", idx + 1, route.length, t(stop.room), stop.level);
  app.replaceChildren(
    h("header", {}, h("div", { class: "eyebrow" }, car.eyebrow), h("h1", {}, car.title), h("p", { class: "lede" }, car.lede)),
    toolbar,
    h("section", { class: "viewer", "aria-label": t("Interactive component viewer") }, stageEl, side),
    h("nav", { class: "pager", "aria-label": t("Previous and next stop") },
      prev ? link(here(prev), `← ${prevName}`) : h("span"), next ? link(here(next), `${nextName} →`) : h("span")),
    h("footer", {}, ...caveats(car),
      h("p", { class: "note" }, t("Unofficial private tour notes, not affiliated with Mercedes-Benz. 3D: three.js (MIT). Mechanisms are original code from illustrative hardpoints."))));

  // ---------- 3D ----------
  const viewer = await mountViewer(car, stageEl, () => side);
  if (car.note) side.append(h("p", { class: "note" }, car.note));

  // The switches show one component's cards, and the cards (or widgets) marked for the current view only.
  function layout(resetOrbit = true) {
    const onPhoto = state.view === "photo";
    document.querySelectorAll("[data-comp]").forEach(el => (el.hidden = el.dataset.comp !== state.comp));
    document.querySelectorAll("[data-only]").forEach(el => { if (!el.closest("[data-comp]")?.hidden) el.hidden = (el.dataset.only === "photo") !== onPhoto; });
    outlineBtn.setAttribute("aria-pressed", String(state.outline));
    viewer.show(state, resetOrbit);
  }
  toolbar.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    if (b === outlineBtn) { state.outline = !state.outline; return layout(false); }
    const group = b.closest(".seg-group"), key = group.dataset.key;
    state[key] = b.dataset.v;
    group.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    layout();
  });

  layout();
  viewer.start();
  if (params.has("debug")) window.__tour = { state, stats: viewer.stage.stats, info: () => viewer.stage.renderer.info.render, missing: () => [...missing], ready: true };
}
