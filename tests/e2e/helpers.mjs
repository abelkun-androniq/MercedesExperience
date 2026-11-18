// Shared by the e2e specs.
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
