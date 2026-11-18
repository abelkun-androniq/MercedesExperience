// Scroll stories, shared by stop.html (shell.js: one car) and teaser.html (teaser.js: the teaser cars). Scrolled to, a car's
// stage (museum photo / 3-D model) pins, above the steps on a phone held upright and beside them otherwise, and only the
// steps move on: the introduction over the museum photo (with car.look, the one thing to find on the exhibit), one step
// per component in 3D, then background back on the photo with the car outline (car.takeaway first). A component step reads
// as one experiment: its prompt, the mechanism's key cards, its answer, then the rest under a disclosure named by
// component.more (panel.js `detail`); without `more` its cards and technical facts follow in order. The step at the reading
// line sets what the stage shows; only stages on screen run their frame loop.
import { t } from "./i18n.js";
import { h } from "./dom.js";
import { stageElement, mountViewer, caveats } from "./viewer.js";

// A step is its content and what the stage shows while it is at the reading line.
const step = (state, ...kids) => ({ state, el: h("section", { class: "step" }, kids) });
// What to look at on the real car, before the model and after it.
const look = (label, text) => (text ? h("p", { class: "look" }, h("b", {}, label), " ", text) : null);

// A component's step, with the elements its panel cards go into.
function compStep(c) {
  const main = h("div", { class: "cards" }), detail = c.more ? h("div", { class: "cards" }) : main;
  const st = step({ comp: c.id, view: "model", outline: false }, h("h3", {}, c.label),
    c.prompt ? h("p", { class: "prompt" }, c.prompt) : null, main, c.answer ? h("p", { class: "answer" }, c.answer) : null,
    c.more ? h("details", { class: "more" }, h("summary", {}, c.more), detail) : null);
  return { ...st, slots: { main, detail } };
}

// One car's story, not yet playing. title: the tag of the car's title ("h1" on its own page); more: what closes the
// background step (the teaser's link to the stop page).
export function story(car, { title = "h2", more = null } = {}) {
  const first = car.components[0].id;
  const comps = car.components.map(compStep);
  const steps = [
    step({ comp: first, view: "photo", outline: false }, h("div", { class: "eyebrow" }, car.eyebrow), h(title, {}, car.title), h("p", { class: "lede" }, car.lede),
      look(t("At the car:"), car.look)),
    ...comps,
    step({ comp: first, view: "photo", outline: true }, look(t("Back at the car:"), car.takeaway), h("footer", {}, h("h3", {}, t("Background")),
      h("p", {}, t("Back on the museum photo: the mechanism where it sits, inside the car's outline.")),
      car.note ? h("p", {}, car.note) : null, ...caveats(car), more)),
  ];
  steps[0].el.classList.add("on");
  const stageEl = stageElement(car);
  const el = h("article", { class: "story", "aria-label": car.name }, h("div", { class: "story-stage" }, stageEl), h("div", { class: "steps" }, steps.map(s => s.el)));
  return { car, el, stageEl, steps, comps, at: 0, viewer: null };
}

// Loads the stories' 3-D views (already in the page) and lets the scroll drive them. Returns one ?debug handle per story.
export async function play(stories) {
  await Promise.all(stories.map(async s => {
    try {
      s.viewer = await mountViewer(s.car, s.stageEl, comp => s.comps[s.car.components.indexOf(comp)].slots);
      s.viewer.show(s.steps[0].state);
    } catch (err) {
      console.error(err);
      s.stageEl.after(h("p", { class: "fail" }, t("The 3D view could not load. Check your connection and reload the page; after one visit with signal it also works offline.")));
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

  // Only stages on screen animate: several scenes at once, one of them a live wind tunnel, would be too much for a phone.
  const onScreen = new IntersectionObserver(entries => {
    for (const e of entries) { const v = stories.find(s => s.stageEl === e.target).viewer; if (e.isIntersecting) v.start(); else v.stop(); }
  });
  for (const s of stories) if (s.viewer) onScreen.observe(s.stageEl);

  return stories.map(s => ({
    slug: s.car.slug, step: () => s.at, state: () => s.viewer?.state,
    frames: () => s.viewer?.stage.stats.frames ?? 0, triangles: () => s.viewer?.stage.renderer.info.render.triangles ?? 0,
  }));
}
