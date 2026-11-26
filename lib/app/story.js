// Scroll stories, shared by stop.html (shell.js: one car) and teaser.html (teaser.js: the teaser cars). Scrolled to, a car's
// stage (museum photo / 3-D model) pins, above the steps on a phone held upright and beside them otherwise, and only the
// steps move on: the introduction over the museum photo (with car.look, the one thing to find on the exhibit), one step
// per component in 3D, then background back on the photo with the car outline (car.takeaway first). A component step reads
// as one experiment: its prompt, the mechanism's key cards, its answer, a photo of the real part where the exhibit hides it
// (component.real), then the rest under a disclosure named by component.more (panel.js `detail`); without `more` its cards
// and technical facts follow in order. The step at the reading line sets what the stage shows; only stages on screen run
// their frame loop. Tapping a real-part photo swaps it with the stage, for a close look; tapping either again, or scrolling
// the photo's place out of view, swaps them back. Each component step has the id <slug>-<component id>: a link to
// stop.html?s=<slug>#<slug>-<id> opens that experiment at the reading line.
import { t, keepOnSwitch, resumed } from "./i18n.js";
import { h, link } from "./dom.js";
import { stageElement, mountViewer, caveats } from "./viewer.js";

// A step is its content and what the stage shows while it is at the reading line.
const step = (state, ...kids) => ({ state, el: h("section", { class: "step" }, kids) });
// What to look at on the real car, before the model and after it.
const look = (label, text) => (text ? h("p", { class: "look" }, h("b", {}, label), " ", text) : null);

// The mechanism in real life (component.real): a photo of the same kind of part, for one this exhibit hides.
// Its picture is a button that swaps it with the stage (story's `swap`), and says so on the picture. r.mark { x, y, r (photo
// px), token } rings the part the model draws in that colour; the ring scales with the picture (object-fit: contain = meet).
const ring = m => h("svg:svg", { class: "real-mark", viewBox: `0 0 ${m.w} ${m.h}`, preserveAspectRatio: "xMidYMid meet", "aria-hidden": "true", style: `--mark: var(${m.token})` },
  h("svg:circle", { cx: m.x, cy: m.y, r: m.r }));
const real = r => (r ? h("figure", { class: "real" },
  h("div", { class: "real-media", "data-back": t("Tap the 3D view to swap back"), "data-open": t("Enlarge part photo") },
    h("button", { type: "button", class: "real-open", "aria-label": t("Show this photo large, in place of the 3D view") },
      h("img", { src: r.src, alt: r.alt, width: r.w, height: r.h, loading: "lazy", decoding: "async" }), r.mark ? ring({ ...r.mark, w: r.w, h: r.h }) : null)),
  h("figcaption", {}, h("b", {}, t("In real life:")), " ", r.caption, " ",
    h("span", { class: "credit" }, t("Photo:"), " ", link(r.credit.url, r.credit.author), `, ${r.credit.license}`))) : null);

// A component's step, with the elements its panel cards go into.
function compStep(c, slug) {
  const main = h("div", { class: "cards" }), detail = c.more ? h("div", { class: "cards" }) : main;
  const st = step({ comp: c.id, view: "model", outline: false }, h("h3", {}, c.label),
    c.prompt ? h("p", { class: "prompt" }, c.prompt) : null, main, c.answer ? h("p", { class: "answer" }, c.answer) : null,
    real(c.real), c.more ? h("details", { class: "more" }, h("summary", {}, c.more), detail) : null);
  st.el.id = `${slug}-${c.id}`;
  return { ...st, slots: { main, detail } };
}

// One car's story, not yet playing. title: the tag of the car's title ("h1" on its own page); more: what closes the
// background step (the teaser's link to the stop page); place: where the car stands, under the title (the teaser's).
export function story(car, { title = "h2", more = null, place = null } = {}) {
  const first = car.components[0].id;
  const comps = car.components.map(c => compStep(c, car.slug));
  const steps = [
    step({ comp: first, view: "photo", outline: false }, h("div", { class: "eyebrow" }, car.eyebrow), h(title, {}, car.title),
      place ? h("p", { class: "place" }, place) : null, h("p", { class: "lede" }, car.lede),
      look(t("At the car:"), car.look)),
    ...comps,
    step({ comp: first, view: "photo", outline: true }, look(t("Back at the car:"), car.takeaway), h("footer", {}, h("h3", {}, t("Background")),
      h("p", {}, t("Back on the photo: the mechanism where it sits, inside the car's outline.")),
      car.note ? h("p", {}, car.note) : null, ...caveats(car), more)),
  ];
  steps[0].el.classList.add("on");
  const stageEl = stageElement(car);
  const el = h("article", { class: "story", "aria-label": car.name }, h("div", { class: "story-stage" }, stageEl), h("div", { class: "steps" }, steps.map(s => s.el)));
  return { car, el, stageEl, steps, comps, at: 0, viewer: null, ...swapper(el, stageEl) };
}

// A real-part photo and the stage change places: the photo's button goes where the stage was (pinned, in the stage's box, so
// nothing below moves) and the stage
// into the photo's place in its step. One swap per story at a time. Tapping the big photo or the small stage (a tap, not an
// orbit drag or pinch) swaps back; so does check(), called on scroll, once the photo's place is out of view (above the
// pinned stage area or below the screen).
function swapper(el, stageEl) {
  let media = null;   // the .real-media now holding the stage
  const back = () => {
    if (!media) return;
    const btn = el.querySelector(".story-stage .real-open");
    btn.replaceWith(stageEl); media.append(btn); btn.removeAttribute("style");
    btn.setAttribute("aria-label", t("Show this photo large, in place of the 3D view"));
    media.classList.remove("swapped"); media = null;
  };
  const swap = m => {
    back();
    const btn = m.querySelector(".real-open");
    btn.setAttribute("style", stageEl.getAttribute("style") ?? "");   // the stage's aspect: the pinned area keeps its size
    stageEl.replaceWith(btn); m.append(stageEl);
    btn.setAttribute("aria-label", t("Put the photo back and show the 3D view"));
    m.classList.add("swapped"); media = m;
  };
  for (const btn of el.querySelectorAll(".real-open")) {
    btn.addEventListener("click", () => (btn.closest(".real-media") ? swap(btn.closest(".real-media")) : back()));
  }
  // A tap on the stage while it is small: one pointer, barely moved.
  const downs = new Map();
  stageEl.addEventListener("pointerdown", e => downs.set(e.pointerId, [e.clientX, e.clientY, downs.size === 0]));
  stageEl.addEventListener("pointercancel", e => downs.delete(e.pointerId));
  stageEl.addEventListener("pointerup", e => {
    const d = downs.get(e.pointerId); downs.delete(e.pointerId);
    if (media && d?.[2] && downs.size === 0 && Math.hypot(e.clientX - d[0], e.clientY - d[1]) < 8) back();
  });
  const check = pane => {
    if (!media) return;
    const r = media.getBoundingClientRect(), beside = r.left >= pane.right;
    if (r.bottom < (beside ? 0 : pane.bottom) || r.top > innerHeight) back();
  };
  return { swap, back, check, swapped: () => !!media };
}

// Loads the stories' 3-D views (already in the page) and lets the scroll drive them. Returns one ?debug handle per story.
export async function play(stories) {
  await Promise.all(stories.map(async s => {
    try {
      s.viewer = await mountViewer(s.car, s.stageEl, comp => s.comps[s.car.components.indexOf(comp)].slots);
      s.viewer.show(s.steps[0].state);
    } catch (err) {
      console.error(err);
      s.stageEl.after(h("p", { class: "fail" }, t("The 3D view could not load. Check your connection and reload the page; once it has loaded online, it also works offline.")));
    }
  }));

  // The reading line: halfway down the screen beside the pinned stage, or halfway down the part it leaves free below it.
  // The last step whose top has passed the line is the one shown.
  function reading(s) {
    const pane = s.el.querySelector(".story-stage").getBoundingClientRect(), beside = s.steps[0].el.getBoundingClientRect().left >= pane.right;
    return { pane, line: beside ? innerHeight / 2 : (pane.bottom + innerHeight) / 2 };
  }
  function pick() {
    for (const s of stories) {
      const { pane, line } = reading(s);
      s.check(pane);
      let at = 0;
      s.steps.forEach((st, i) => { if (st.el.getBoundingClientRect().top < line) at = i; });
      if (!s.used && at > 0 && at < s.steps.length - 1) mark(s, at);
      if (at === s.at) continue;
      const before = s.steps[s.at].state;
      s.at = at;
      s.steps.forEach((st, i) => st.el.classList.toggle("on", i === at));
      if (s.viewer && s.steps[at].state !== before) s.viewer.show(s.steps[at].state);
    }
  }
  // Where the visitor last worked, kept across the language switch (a reload, made from the header at the top of the page):
  // the step of the last control used, with how far its top had passed the reading line then; until a control is used, the
  // last mechanism step at the line. The latest mark across the stories wins.
  let clock = 0, replaying = false;   // replayed settings (below) are not the visitor's
  function mark(s, k) { s.mark = { step: k, past: reading(s).line - s.steps[k].el.getBoundingClientRect().top, when: ++clock }; }
  for (const s of stories) {
    const used = e => {
      if (replaying || !e.target.closest?.(".panel button, .panel input")) return;
      const k = s.steps.findIndex(st => st.el.contains(e.target));
      if (k > 0) { s.used = true; mark(s, k); }
    };
    s.el.addEventListener("click", used); s.el.addEventListener("input", used);
  }
  // Across the switch: each story's settings and open disclosures, and that mark, so the visitor finds the same experiment
  // in the same place.
  const details = s => [...s.el.querySelectorAll("details")];
  keepOnSwitch(() => {
    const last = stories.filter(s => s.mark).sort((a, b) => b.mark.when - a.mark.when)[0];
    return {
      stories: Object.fromEntries(stories.map(s => [s.car.slug, { settings: s.viewer?.settings(), open: details(s).flatMap((d, i) => (d.open ? [i] : [])) }])),
      at: last ? { slug: last.car.slug, step: last.mark.step, past: last.mark.past, used: !!last.used } : null,
    };
  });
  const back = resumed();
  if (back) {
    for (const s of stories) {
      const kept = back.stories?.[s.car.slug];
      if (!kept) continue;
      replaying = true; s.viewer?.restore(kept.settings); replaying = false;
      const ds = details(s); for (const i of kept.open ?? []) if (ds[i]) ds[i].open = true;
    }
    const s = stories.find(x => x.car.slug === back.at?.slug), st = s?.steps[back.at.step];
    if (st) {   // step to the top first, so its story's stage is pinned and the reading line is where it will be
      st.el.scrollIntoView({ block: "start" });
      const past = Math.max(1, Math.min(back.at.past, st.el.offsetHeight - 1));
      scrollBy(0, st.el.getBoundingClientRect().top - reading(s).line + past);
      s.used = back.at.used; mark(s, back.at.step);   // a second switch keeps the same place
    }
    history.scrollRestoration = "auto";
  } else {
    // A link to one experiment (#<slug>-<component id>): its step's top just below the pinned stage (past the reading
    // line, so it is the step shown), as a visitor reads it, with its controls in view.
    const id = decodeURIComponent(location.hash.slice(1));
    const s = id ? stories.find(x => x.steps.some(st => st.el.id === id)) : null, st = s?.steps.find(x => x.el.id === id);
    if (st) {
      st.el.scrollIntoView({ block: "start" });
      const { pane } = reading(s), r = st.el.getBoundingClientRect();
      scrollBy(0, r.top - (r.left >= pane.right ? 16 : pane.bottom + 8));
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
    slug: s.car.slug, step: () => s.at, state: () => s.viewer?.state, swapped: s.swapped,
    frames: () => s.viewer?.stage.stats.frames ?? 0, project: p => s.viewer?.project(p), triangles: () => s.viewer?.stage.renderer.info.render.triangles ?? 0,
  }));
}
