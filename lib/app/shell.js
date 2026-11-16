// Page shell for every stop: stop.html?s=<slug>. Builds the page from stops/tour.js + stops/<slug>/car.js, loads each
// component's subsystem, and owns the Component/View switches, photo view, car outline, ghost body and frame loop.
import tour from "../../stops/tour.js";
import { createPanel } from "./panel.js";
import { registerOffline } from "./offline.js";

const params = new URLSearchParams(location.search);
const slug = params.get("s");
const idx = tour.findIndex(t => t.slug === slug);   // validated before any dynamic import
const app = document.getElementById("app");

function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) if (v != null && v !== false) el.setAttribute(k, v === true ? "" : v);
  for (const k of kids.flat()) if (k != null) el.append(k);
  return el;
}
const link = (href, text) => h("a", { href, target: href.startsWith("http") ? "_blank" : null, rel: href.startsWith("http") ? "noopener" : null }, text);
const seg = (label, items, cur) => h("div", { class: "seg-group" }, h("span", { class: "seg-label" }, label),
  h("span", { class: "seg", role: "group", "aria-label": label }, items.map(([v, text]) => h("button", { type: "button", "data-v": v, "aria-pressed": String(v === cur) }, text))));

registerOffline();
if (idx < 0) {
  document.title = "Stop not found · Museum tour";
  app.replaceChildren(h("h1", {}, "Stop not found"), h("p", {}, "This QR code or link does not match a stop on the tour. ", link("./", "Open the tour route")));
} else {
  main().catch(err => {
    console.error(err);
    const stage = document.getElementById("stage");
    (stage ?? app).append(h("p", { class: "fail" }, "The 3D view could not load. Check your connection and reload the page; after one visit with signal it also works offline."));
  });
}

async function main() {
  const stop = tour[idx];
  const car = (await import(`../../stops/${stop.slug}/car.js`)).default;
  const base = `stops/${stop.slug}/`;
  document.title = `${car.name} · Museum tour`;
  const state = { comp: car.components[0].id, view: "model", outline: false };
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- page ----------
  const prev = tour[idx - 1], next = tour[idx + 1];
  const nameOf = async s => (s ? (await import(`../../stops/${s.slug}/car.js`)).default.name : null);
  const [prevName, nextName] = await Promise.all([nameOf(prev), nameOf(next)]);
  const photo = car.photo;
  const img = photo ? h("img", { src: base + photo.src, alt: photo.alt, width: photo.w, height: photo.h, hidden: true }) : null;
  const credit = photo ? h("div", { class: "credit", hidden: true }, "Photo: ", link(photo.credit.url, photo.credit.author), `, ${photo.credit.license}`) : null;
  const hint = h("div", { class: "hint" }, "drag to orbit · pinch to zoom");
  const stageEl = h("div", { class: "stage", id: "stage", style: photo ? `--aspect:${photo.w}/${photo.h};--ar:${(photo.w / photo.h).toFixed(4)}` : null }, img, hint, credit);
  const side = h("div", { class: "side" });
  const outlineBtn = h("button", { type: "button", class: "outline", "aria-pressed": "false", "data-only": "photo" }, "Car outline");
  const toolbar = h("div", { class: "toolbar" },
    car.components.length > 1 ? seg("Component", car.components.map(c => [c.id, c.label]), state.comp) : null,
    photo ? seg("View", [["model", "3D model"], ["photo", "Museum photo"]], state.view) : null,
    photo ? outlineBtn : null);
  app.replaceChildren(
    h("nav", { class: "crumbs" }, link("./", "← Tour route"), h("span", {}, `Stop ${idx + 1} of ${tour.length} · ${stop.room} · Level ${stop.level}`)),
    h("header", {}, h("div", { class: "eyebrow" }, car.eyebrow), h("h1", {}, car.title), h("p", { class: "lede" }, car.lede)),
    toolbar,
    h("section", { class: "viewer", "aria-label": "Interactive component viewer" }, stageEl, side),
    h("nav", { class: "pager", "aria-label": "Previous and next stop" },
      prev ? link(`stop.html?s=${prev.slug}`, `← ${prevName}`) : h("span"), next ? link(`stop.html?s=${next.slug}`, `${nextName} →`) : h("span")),
    h("footer", {},
      car.unverified?.length ? h("details", {}, h("summary", {}, "Illustrative, not verified"), h("ul", {}, car.unverified.map(u => h("li", {}, u)))) : null,
      car.sources?.length ? h("details", {}, h("summary", {}, "Sources"), h("ul", {}, car.sources.map(s => h("li", {}, link(s.url, s.label))))) : null,
      h("p", { class: "note" }, "Unofficial private tour notes, not affiliated with Mercedes-Benz. 3D: three.js (MIT). Mechanisms are original code from illustrative hardpoints.")));

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
    const inst = mod.create({ stage, carRoot, frame: car.frame, ride: car.ride, panel, reducedMotion }, comp.params);
    panel([{ label: "What to say at the car", items: [{ list: comp.talk }] }]);
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
    const group = b.closest(".seg-group"), key = group.querySelector(".seg-label").textContent === "View" ? "view" : "comp";
    state[key] = b.dataset.v;
    group.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    layout();
  });

  layout();
  stage.start(dt => {
    carRoot.position.set(0, 0, 0); carRoot.rotation.set(0, 0, 0);
    instances.get(state.comp).update(dt, { onPhoto: state.view === "photo" });
  });
  if (params.has("debug")) window.__tour = { state, stats: stage.stats, info: () => stage.renderer.info.render, ready: true };
}
