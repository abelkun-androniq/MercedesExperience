// One stop's working view, shared by stop.html (shell.js) and teaser.html (teaser.js): the stage element over the museum
// photo, the ghost body, one subsystem per component with its panel cards and talking points, and the frame loop. The page
// chooses what is shown (the Component/View switches on a stop page, the scroll position on the teaser) and calls show().
import { createPanel } from "./panel.js";
import { h, link } from "./dom.js";
import { t } from "./i18n.js";

// The stage element alone, so a page can lay itself out before three.js loads. It keeps the photo's aspect and shows the
// photo, its credit and caption (how closely it matches the exhibit) at once: they identify the car even if 3D never loads.
export function stageElement(car) {
  const photo = car.photo;
  return h("div", { class: "stage", style: photo ? `--aspect:${photo.w}/${photo.h};--ar:${(photo.w / photo.h).toFixed(4)}` : null },
    photo ? h("img", { src: `stops/${car.slug}/${photo.src}`, alt: photo.alt, width: photo.w, height: photo.h }) : null,
    h("div", { class: "hint", hidden: !!photo }, t("drag to orbit · pinch to zoom")),
    photo?.caption ? h("div", { class: "caption" }, photo.caption) : null,
    photo ? h("div", { class: "credit" }, t("Photo:"), " ", link(photo.credit.url, photo.credit.author), `, ${photo.credit.license}`) : null);
}

// The car's caveats and sources as two collapsed lists (empty ones left out).
export const caveats = car => [
  car.unverified?.length ? h("details", {}, h("summary", {}, t("Illustrative, not verified")), h("ul", {}, car.unverified.map(u => h("li", {}, u)))) : null,
  car.sources?.length ? h("details", {}, h("summary", {}, t("Sources")), h("ul", {}, car.sources.map(s => h("li", {}, link(s.url, s.label))))) : null,
];

// Loads three.js and the car's subsystems into stageEl (from stageElement). cardsFor(comp) gives { main, detail }: the
// elements that take that component's panel cards and its depth (panel.js `detail`; the same element keeps cards whole). show({ comp, view: "model" | "photo", outline }, resetOrbit) sets what the stage shows (a car
// without a photo shows its model instead); call it before start(). stop() pauses the loop. stage is exposed for ?debug (stats, renderer).
// settings() gives what the visitor set on each component's panel, restore(settings) replays it (panel.js state/restore).
export async function mountViewer(car, stageEl, cardsFor) {
  const [{ createStage }, { buildGhost }] = await Promise.all([import("../scene/stage.js"), import("../scene/ghost-body.js")]);
  const img = stageEl.querySelector("img"), hint = stageEl.querySelector(".hint");
  const onPhotoOnly = [img, ...stageEl.querySelectorAll(".credit, .caption")].filter(Boolean);
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stage = createStage(stageEl, car);
  const carRoot = new stage.THREE.Group(); stage.scene.add(carRoot);
  const ghost = buildGhost(car.body?.ghost); carRoot.add(ghost.group);
  stage.onTheme(({ onPhoto }) => { const c = onPhoto ? new stage.THREE.Color(0xffffff) : stage.color("--fg"); ghost.fill.color.copy(c); ghost.edge.color.copy(c); });

  const instances = new Map(), panels = new Map();
  for (const comp of car.components) {
    if (!/^[a-z0-9-]+$/.test(comp.subsystem)) throw new Error(`bad subsystem id ${comp.subsystem}`);
    const mod = await import(`../../subsystems/${comp.subsystem}.js`);
    const slots = cardsFor(comp), panel = createPanel(slots.main, comp.id, `${car.slug}-${comp.id}`, slots.detail);
    const inst = mod.create({ stage, carRoot, frame: car.frame, ride: car.ride, panel, reducedMotion, t }, comp.params);
    panels.set(comp.id, panel([{ label: t("Technical facts about the car"), detail: true, items: [{ list: comp.talk }] }]));
    instances.set(comp.id, inst);
  }

  let shown = null;
  function show(state, resetOrbit = true) {
    shown = { ...state, view: car.photo ? state.view : "model" };
    const onPhoto = shown.view === "photo", comp = car.components.find(c => c.id === shown.comp);
    for (const el of onPhotoOnly) el.hidden = !onPhoto;
    hint.hidden = onPhoto;
    ghost.group.visible = onPhoto ? shown.outline : (comp.ghost?.fill ?? 0) + (comp.ghost?.edge ?? 0) > 0;
    ghost.fill.opacity = onPhoto ? 0 : comp.ghost?.fill ?? 0.06;
    ghost.edge.opacity = onPhoto ? 0.7 : comp.ghost?.edge ?? 0.5;
    for (const [id, inst] of instances) inst.layout?.({ active: id === shown.comp, onPhoto });
    stage.setPhotoView(onPhoto);
    if (!onPhoto && resetOrbit) stage.setOrbit(comp.view);
  }
  // ?debug: where a vehicle-frame point (mm) lands on the canvas, in CSS pixels from its top left.
  const project = p => {
    const v = new stage.THREE.Vector3(p[0] / 1000, p[1] / 1000, p[2] / 1000).project(shown.view === "photo" && stage.photoCam ? stage.photoCam : stage.cam), r = stage.renderer.domElement.getBoundingClientRect();
    return [r.left + (v.x + 1) / 2 * r.width, r.top + (1 - v.y) / 2 * r.height];
  };
  return {
    show, stage, project,
    get state() { return shown; },
    settings: () => Object.fromEntries([...panels].map(([id, ui]) => [id, ui.state()]).filter(([, s]) => s.length)),
    restore: settings => { for (const [id, s] of Object.entries(settings ?? {})) panels.get(id)?.restore(s); },
    stop: stage.stop,
    start() {
      stage.start(dt => {
        carRoot.position.set(0, 0, 0); carRoot.rotation.set(0, 0, 0);
        instances.get(shown.comp).update(dt, { onPhoto: shown.view === "photo" });
      });
    },
  };
}
