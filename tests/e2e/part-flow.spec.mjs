// The precomputed component airflow (subsystems/race-aero.js) on the Evo II and W 196 R stops: with the camera fixed and
// the drift paused, switching case changes the picture in a patch of air outside both bodies; rapid switching, leaving and
// re-entering the step, the language switch, reduced motion and a failed download each end in the state the visitor chose.
import { test, expect } from "@playwright/test";
import { watchErrors, shown } from "./helpers.mjs";

async function open(page, slug, id) {
  const car = (await import(`../../stops/${slug}/car.js`)).default, k = car.components.findIndex(c => c.id === id) + 1;
  await page.goto(`stop.html?s=${slug}&debug`);
  await page.waitForFunction(() => window.__tour?.stories[0].frames() > 5, null, { timeout: 20_000 });
  const step = page.locator(".step").nth(k);
  await step.evaluate(s => s.scrollIntoView({ block: "center" }));
  await expect.poll(() => shown(page)).toMatchObject({ step: k, state: { comp: id, view: "model" } });
  const comp = car.components[k - 1], panel = step.locator(`.panel[data-comp="${id}"]`).first();
  return { comp, step, panel, say: panel.locator("p.note[aria-live]").first(), k };
}
const button = (panel, name) => panel.getByRole("button", { name, exact: true });

// A point in the air (mm) beside the part, outside both cases' solids and away from the guides.
for (const [slug, id, point] of [["190e-evo2", "wing", [-4060, 238, 1340]], ["w196r", "wheel", [-1100, 900, 344]]]) {
  test(`${slug} ${id}: paused, the other case changes the air itself, not only the body`, async ({ page }) => {
    const errors = watchErrors(page);
    const { comp, panel, say } = await open(page, slug, id), [a, b] = comp.params.cases;
    await expect(say).toHaveText(a.say, { timeout: 15_000 });
    await button(panel, "Pause airflow").click();
    await expect(button(panel, "Pause airflow")).toHaveAttribute("aria-pressed", "true");
    const at = () => page.evaluate(p => window.__tour.stories[0].project(p).map(Math.round), point);
    // The camera eases into the step's view; slow GPUs (CI) are still moving after the panel is ready.
    let x, y;
    await expect(async () => { const p = await at(); await page.waitForTimeout(300); expect(await at()).toEqual(p); [x, y] = p; }).toPass({ timeout: 15_000 });
    const stage = await page.locator(".story-stage .stage").boundingBox();
    expect(x > stage.x + 8 && x < stage.x + stage.width - 8 && y > stage.y + 8 && y < stage.y + stage.height - 8, "the patch is on the stage").toBe(true);
    const clip = { x: x - 6, y: y - 6, width: 12, height: 12 };
    await page.waitForTimeout(200);
    const before = await page.screenshot({ clip });
    await button(panel, b.label).click();
    await expect(say).toHaveText(b.say);
    expect(await at(), "camera unchanged").toEqual([x, y]);
    await expect.poll(async () => (await page.screenshot({ clip })).equals(before), { message: "the air in the patch looks different", timeout: 5_000 }).toBe(false);
    expect(await at(), "camera still unchanged").toEqual([x, y]);
    expect(errors).toEqual([]);
  });
}

test("Evo wing: a quick A → B → A shows A once the data is in; leaving and coming back keeps it; the language switch replays it", async ({ page }) => {
  const errors = watchErrors(page);
  await page.addInitScript(() => { if (!localStorage.getItem("tour-lang")) localStorage.setItem("tour-lang", "en"); });
  await page.route(/cfd\/wing\/.*\.bin$/, async r => { await new Promise(res => setTimeout(res, 1200)); await r.continue(); });
  const { comp, panel, say, step, k } = await open(page, "190e-evo2", "wing"), [base, flap] = comp.params.cases;
  await button(panel, flap.label).click(); await button(panel, base.label).click(); await button(panel, flap.label).click(); await button(panel, base.label).click();
  await expect(button(panel, base.label)).toHaveAttribute("aria-pressed", "true");
  await expect(button(panel, flap.label)).toHaveAttribute("aria-pressed", "false");
  await expect(say).toHaveText(base.say, { timeout: 15_000 });

  await button(panel, flap.label).click();
  await expect(say).toHaveText(flap.say);
  await page.locator(".step").nth(k + 1).evaluate(s => s.scrollIntoView({ block: "center" }));
  await expect.poll(() => shown(page)).toMatchObject({ step: k + 1 });
  await step.evaluate(s => s.scrollIntoView({ block: "center" }));
  await expect.poll(() => shown(page)).toMatchObject({ step: k, state: { comp: "wing" } });
  await expect(say).toHaveText(flap.say);

  for (const [to, label] of [["Magyar", "Szárnylap fent"], ["English", flap.label]]) {
    await page.getByRole("button", { name: to }).click();
    await page.waitForFunction(() => window.__tour?.stories[0].frames() > 2, null, { timeout: 20_000 });
    const pressed = page.locator(".step").nth(k).getByRole("button", { name: label, exact: true });
    await expect(pressed).toHaveAttribute("aria-pressed", "true");
    await expect(pressed).toBeInViewport();
  }
  expect(errors).toEqual([]);
});

test("a failed download says so and offers to try again; the photo and story stay usable", async ({ page }) => {
  let fail = true;
  await page.route(/cfd\/splitter\/.*\.bin$/, r => (fail ? r.abort() : r.continue()));
  const { comp, panel, say } = await open(page, "190e-evo2", "splitter");
  await expect(panel.getByText("The airflow could not load. Check your connection and try again.")).toBeVisible({ timeout: 15_000 });
  await expect(page.locator("h1")).toBeVisible();
  fail = false;
  await panel.getByRole("button", { name: "Try again" }).click();
  await expect(say).toHaveText(comp.params.cases[0].say, { timeout: 15_000 });
  await expect(panel.getByRole("button", { name: "Try again" })).toBeHidden();
});

test("reduced motion: the airflow starts paused; Follow the air still draws the whole path and its sentence", async ({ page }) => {
  const errors = watchErrors(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  const { comp, panel, say } = await open(page, "190e-evo2", "wheel-arch");
  await expect(button(panel, "Pause airflow")).toHaveAttribute("aria-pressed", "true");
  await expect(say).toHaveText("");
  await button(panel, "Follow the air").click();
  await expect(say).toHaveText(comp.params.cases[0].say, { timeout: 15_000 });
  expect(errors).toEqual([]);
});
