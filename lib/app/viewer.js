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
export async function mountViewer(car, stageEl, cardsFor) {
  const [{ createStage }, { buildGhost }] = await Promise.all([import("../scene/stage.js"), import("../scene/ghost-body.js")]);
  const img = stageEl.querySelector("img"), hint = stageEl.querySelector(".hint");
  const onPhotoOnly = [img, ...stageEl.querySelectorAll(".credit, .caption")].filter(Boolean);
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stage = createStage(stageEl, car);
  const carRoot = new stage.THREE.Group(); stage.scene.add(carRoot);
  const ghost = buildGhost(car.body?.ghost); carRoot.add(ghost.group);
  stage.onTheme(({ onPhoto }) => { const c = onPhoto ? new stage.THREE.Color(0xffffff) : stage.color("--fg"); ghost.fill.color.copy(c); ghost.edge.color.copy(c); });

  const instances = new Map();
  for (const comp of car.components) {
    if (!/^[a-z0-9-]+$/.test(comp.subsystem)) throw new Error(`bad subsystem id ${comp.subsystem}`);
    const mod = await import(`../../subsystems/${comp.subsystem}.js`);
    const slots = cardsFor(comp), panel = createPanel(slots.main, comp.id, `${car.slug}-${comp.id}`, slots.detail);
    const inst = mod.create({ stage, carRoot, frame: car.frame, ride: car.ride, panel, reducedMotion, t }, comp.params);
    panel([{ label: t("Technical facts about the car"), detail: true, items: [{ list: comp.talk }] }]);
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
  return {
    show, stage,
    get state() { return shown; },
    stop: stage.stop,
    start() {
      stage.start(dt => {
        carRoot.position.set(0, 0, 0); carRoot.rotation.set(0, 0, 0);
        instances.get(shown.comp).update(dt, { onPhoto: shown.view === "photo" });
      });
    },
  };
}
