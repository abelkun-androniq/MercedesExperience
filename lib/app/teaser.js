// Teaser page (teaser.html): the teaser stops as scroll stories. Scrolled to, a car's stage (museum photo / 3-D model)
// pins, above the steps on a phone held upright and beside them otherwise, and only the steps move on: the introduction
// over the museum photo, one step per component with its cards (controls, legend, talking points) in 3D, then background
// back on the photo with the car outline. The step at the reading line sets what the stage shows; only stages on screen
// run their frame loop. Each story links its stop page with &r=teaser, so the stop pages page between these stops.
import tour, { teaser } from "../../stops/tour.js";
import { showOfflineStatus } from "./offline.js";
import { t, loadCar, localizePage, missing } from "./i18n.js";
import { h } from "./dom.js";
import { stageElement, mountViewer, caveats } from "./viewer.js";

localizePage();
showOfflineStatus(document.getElementById("status"));
const cars = await Promise.all(tour.filter(s => teaser.includes(s.slug)).map(s => loadCar(s.slug)));
const credits = [...new Set(cars.filter(c => c.photo).map(c => `${c.photo.credit.author} (${c.photo.credit.license})`))];
document.getElementById("credits").textContent = t("Photos via Wikimedia Commons: {0}; each stop links its photo's source.", credits.join(", "));

// A step is its content and what the stage shows while it is at the reading line.
const step = (state, ...kids) => ({ state, el: h("section", { class: "step" }, kids) });
const stories = cars.map(car => {
  const first = car.components[0].id;
  const comps = car.components.map(c => step({ comp: c.id, view: "model", outline: false }, h("h3", {}, c.label)));
  const steps = [
    step({ comp: first, view: "photo", outline: false }, h("div", { class: "eyebrow" }, car.eyebrow), h("h2", {}, car.title), h("p", { class: "lede" }, car.lede)),
    ...comps,
    step({ comp: first, view: "photo", outline: true }, h("footer", {}, h("h3", {}, t("Background")),
      h("p", {}, t("Back on the museum photo: the mechanism where it sits, inside the car's outline.")),
      car.note ? h("p", {}, car.note) : null, ...caveats(car),
      h("a", { class: "pill primary", href: `stop.html?s=${car.slug}&r=teaser` }, t("Open this stop on its own page")))),
  ];
  steps[0].el.classList.add("on");
  const stageEl = stageElement(car);
  const el = h("article", { class: "story", "aria-label": car.name }, h("div", { class: "story-stage" }, stageEl), h("div", { class: "steps" }, steps.map(s => s.el)));
  return { car, el, stageEl, steps, comps, at: 0, viewer: null };
});
document.getElementById("cars").replaceChildren(...stories.map(s => s.el));

await Promise.all(stories.map(async s => {
  try {
    s.viewer = await mountViewer(s.car, s.stageEl, comp => s.comps[s.car.components.indexOf(comp)].el);
    s.viewer.show(s.steps[0].state);
  } catch (err) {
    console.error(err);
    s.stageEl.append(h("p", { class: "fail" }, t("The 3D view could not load. Check your connection and reload the page; after one visit with signal it also works offline.")));
  }
}));

// The reading line: halfway down the screen beside the pinned stage, or halfway down the part it leaves free below it.
// The last step whose top has passed the line is the one shown.
function pick() {
  for (const s of stories) {
    const pane = s.stageEl.parentElement.getBoundingClientRect(), beside = s.steps[0].el.getBoundingClientRect().left >= pane.right;
    const line = beside ? innerHeight / 2 : (pane.bottom + innerHeight) / 2;
    let at = 0;
    s.steps.forEach((st, i) => { if (st.el.getBoundingClientRect().top < line) at = i; });
    if (at === s.at) continue;
    const before = s.steps[s.at].state;
    s.at = at;
    s.steps.forEach((st, i) => st.el.classList.toggle("on", i === at));
    if (s.viewer && s.steps[at].state !== before) s.viewer.show(s.steps[at].state);
  }
}
let queued = false;
const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; pick(); }); } };
addEventListener("scroll", schedule, { passive: true });
addEventListener("resize", schedule);
pick();

// Only stages on screen animate: three scenes at once, one of them a live wind tunnel, would be too much for a phone.
const onScreen = new IntersectionObserver(entries => {
  for (const e of entries) { const v = stories.find(s => s.stageEl === e.target).viewer; if (e.isIntersecting) v.start(); else v.stop(); }
});
for (const s of stories) if (s.viewer) onScreen.observe(s.stageEl);

if (new URLSearchParams(location.search).has("debug")) {
  window.__tour = {
    stories: stories.map(s => ({ slug: s.car.slug, step: () => s.at, state: () => s.viewer?.state, frames: () => s.viewer?.stage.stats.frames ?? 0 })),
    missing: () => [...missing], ready: true,
  };
}
