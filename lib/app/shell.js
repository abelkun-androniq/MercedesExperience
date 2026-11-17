// Page shell for every stop: stop.html?s=<slug>[&r=teaser]. Builds the page from stops/tour.js + stops/<slug>/car.js, loads
// each component's subsystem, and owns the Component/View switches, photo view, car outline, ghost body and frame loop.
// With r=teaser (links from teaser.html) prev/next, the stop count and the back link stay within the teaser.
import tour, { teaser } from "../../stops/tour.js";
import { createPanel } from "./panel.js";
import { registerOffline } from "./offline.js";
import { t, loadCar, localizePage, missing } from "./i18n.js";

const params = new URLSearchParams(location.search);
const slug = params.get("s");
const teaserStops = tour.filter(s => teaser.includes(s.slug));
const inTeaser = params.get("r") === "teaser" && teaserStops.some(s => s.slug === slug);
const route = inTeaser ? teaserStops : tour;
const idx = route.findIndex(s => s.slug === slug);   // validated before any dynamic import
const app = document.getElementById("app");

function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) if (v != null && v !== false) el.setAttribute(k, v === true ? "" : v);
  for (const k of kids.flat()) if (k != null) el.append(k);
  return el;
}
const link = (href, text) => h("a", { href, target: href.startsWith("http") ? "_blank" : null, rel: href.startsWith("http") ? "noopener" : null }, text);
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
  const base = `stops/${stop.slug}/`;
  document.title = t("{0} · Museum tour", car.name);
  const state = { comp: car.components[0].id, view: "model", outline: false };
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- page ----------
  const prev = route[idx - 1], next = route[idx + 1], here = s => `stop.html?s=${s.slug}${inTeaser ? "&r=teaser" : ""}`;
  const nameOf = async s => (s ? (await loadCar(s.slug)).name : null);
  const [prevName, nextName] = await Promise.all([nameOf(prev), nameOf(next)]);
  const photo = car.photo;
  const img = photo ? h("img", { src: base + photo.src, alt: photo.alt, width: photo.w, height: photo.h, hidden: true }) : null;
  const credit = photo ? h("div", { class: "credit", hidden: true }, t("Photo:"), " ", link(photo.credit.url, photo.credit.author), `, ${photo.credit.license}`) : null;
  const hint = h("div", { class: "hint" }, t("drag to orbit · pinch to zoom"));
  const stageEl = h("div", { class: "stage", id: "stage", style: photo ? `--aspect:${photo.w}/${photo.h};--ar:${(photo.w / photo.h).toFixed(4)}` : null }, img, hint, credit);
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
    h("footer", {},
      car.unverified?.length ? h("details", {}, h("summary", {}, t("Illustrative, not verified")), h("ul", {}, car.unverified.map(u => h("li", {}, u)))) : null,
      car.sources?.length ? h("details", {}, h("summary", {}, t("Sources")), h("ul", {}, car.sources.map(s => h("li", {}, link(s.url, s.label))))) : null,
      h("p", { class: "note" }, t("Unofficial private tour notes, not affiliated with Mercedes-Benz. 3D: three.js (MIT). Mechanisms are original code from illustrative hardpoints."))));

  // ---------- 3D ----------
  const [{ createStage }, { buildGhost }] = await Promise.all([import("../scene/stage.js"), import("../scene/ghost-body.js")]);
  const stage = createStage(stageEl, car);
  const carRoot = new stage.THREE.Group(); stage.scene.add(carRoot);
  const ghost = buildGhost(car.body?.ghost); carRoot.add(ghost.group);
  stage.onTheme(({ onPhoto }) => { const c = onPhoto ? new stage.THREE.Color(0xffffff) : stage.color("--fg"); ghost.fill.color.copy(c); ghost.edge.color.copy(c); });

  const instances = new Map();
  for (const comp of car.components) {
    if (!/^[a-z0-9-]+$/.test(comp.subsystem)) throw new Error(`bad subsystem id ${comp.subsystem}`);
    const mod = await import(`../../subsystems/${comp.subsystem}.js`);
    const panel = createPanel(side, comp.id);
    const inst = mod.create({ stage, carRoot, frame: car.frame, ride: car.ride, panel, reducedMotion, t }, comp.params);
    panel([{ label: t("What to say at the car"), items: [{ list: comp.talk }] }]);
    instances.set(comp.id, inst);
  }
  if (car.note) side.append(h("p", { class: "note" }, car.note));

  function layout(resetOrbit = true) {
    const onPhoto = state.view === "photo", comp = car.components.find(c => c.id === state.comp);
    document.querySelectorAll("[data-comp]").forEach(el => (el.hidden = el.dataset.comp !== state.comp));
    document.querySelectorAll("[data-only]").forEach(el => { if (!el.closest("[data-comp]")?.hidden) el.hidden = (el.dataset.only === "photo") !== onPhoto; });
    if (img) { img.hidden = !onPhoto; credit.hidden = !onPhoto; }
    hint.hidden = onPhoto;
    outlineBtn.setAttribute("aria-pressed", String(state.outline));
    ghost.group.visible = onPhoto ? state.outline : (comp.ghost?.fill ?? 0) + (comp.ghost?.edge ?? 0) > 0;
    ghost.fill.opacity = onPhoto ? 0 : comp.ghost?.fill ?? 0.06;
    ghost.edge.opacity = onPhoto ? 0.7 : comp.ghost?.edge ?? 0.5;
    for (const [id, inst] of instances) inst.layout?.({ active: id === state.comp, onPhoto });
    stage.setPhotoView(onPhoto);
    if (!onPhoto && resetOrbit) stage.setOrbit(comp.view);
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
  stage.start(dt => {
    carRoot.position.set(0, 0, 0); carRoot.rotation.set(0, 0, 0);
    instances.get(state.comp).update(dt, { onPhoto: state.view === "photo" });
  });
  if (params.has("debug")) window.__tour = { state, stats: stage.stats, info: () => stage.renderer.info.render, missing: () => [...missing], ready: true };
}
