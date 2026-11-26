// Shared by the e2e specs.
import { expect } from "@playwright/test";
export function watchErrors(page) {
  const errors = [];
  page.on("pageerror", e => errors.push(`pageerror: ${e.message}`));
  page.on("console", m => { if (m.type() === "error") errors.push(`console: ${m.text()}`); });
  return errors;
}

// What each step of a car's story (lib/app/story.js) puts on the stage: intro on the photo, one step per component in 3D,
// background on the photo with the car outline. A car without a photo shows its model instead (lib/app/viewer.js).
export const stepsOf = car => {
  const first = car.components[0].id, photo = car.photo ? "photo" : "model";
  return [{ comp: first, view: photo, outline: false }, ...car.components.map(c => ({ comp: c.id, view: "model", outline: false })), { comp: first, view: photo, outline: true }];
};

// The page's ?debug handle for story i: the step at the reading line and what the stage shows.
export const shown = (page, i = 0) => page.evaluate(i => ({ step: window.__tour.stories[i].step(), state: window.__tour.stories[i].state() }), i);

// A precomputed airflow step (subsystems/race-aero.js): its result sentence once the data is in, then the other case (or,
// for a one-case part, Follow the air) pressed and its own sentence shown. English.
export async function precomputed(step, comp) {
  const panel = step.locator(`.panel[data-comp="${comp.id}"]`).first(), say = panel.locator("p.note[aria-live]").first();
  const { cases, start, follow } = comp.params, first = cases.find(c => c.id === start);
  if (follow) {
    const b = panel.getByRole("button", { name: "Follow the air" });
    await b.click(); await expect(b).toHaveAttribute("aria-pressed", "true");
    await expect(say).toHaveText(first.say, { timeout: 15_000 });
    return;
  }
  await expect(say).toHaveText(first.say, { timeout: 15_000 });
  const other = cases.find(c => c.id !== start), b = panel.getByRole("button", { name: other.label, exact: true });
  await b.click(); await expect(b).toHaveAttribute("aria-pressed", "true");
  await expect(say).toHaveText(other.say);
}
