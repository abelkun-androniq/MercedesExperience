// Every stop on the route loads, renders, animates, and every Component/View switch works, on each emulated device.
import { test, expect } from "@playwright/test";
import tour from "../../stops/tour.js";

const cars = await Promise.all(tour.map(async s => (await import(`../../stops/${s.slug}/car.js`)).default));

function watchErrors(page) {
  const errors = [];
  page.on("pageerror", e => errors.push(`pageerror: ${e.message}`));
  page.on("console", m => { if (m.type() === "error") errors.push(`console: ${m.text()}`); });
  return errors;
}
const readouts = (page, comp) => page.locator(`.panel[data-comp="${comp}"]:visible output`).allTextContents();

for (const car of cars) {
  test(`${car.slug}: renders, switches work, readouts move`, async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto(`stop.html?s=${car.slug}&debug`);
    await page.waitForFunction(() => window.__tour?.stats.frames > 10, null, { timeout: 20_000 });
    expect(await page.evaluate(() => window.__tour.info().triangles)).toBeGreaterThan(0);

    for (const comp of car.components) {
      if (car.components.length > 1) await page.getByRole("button", { name: comp.label, exact: true }).click();
      await expect(page.locator(`.panel[data-comp="${comp.id}"]`).first()).toBeVisible();
      for (const other of car.components.filter(c => c.id !== comp.id)) await expect(page.locator(`.panel[data-comp="${other.id}"]`).first()).toBeHidden();
      const before = await readouts(page, comp.id);
      expect(before.length).toBeGreaterThan(0);
      await expect.poll(() => readouts(page, comp.id), { timeout: 15_000 }).not.toEqual(before);
    }

    if (car.photo) {
      await page.getByRole("button", { name: "Museum photo", exact: true }).click();
      await expect(page.locator(".stage img")).toBeVisible();
      await page.getByRole("button", { name: "Car outline", exact: true }).click();
      expect(await page.evaluate(() => window.__tour.state)).toMatchObject({ view: "photo", outline: true });
      await page.getByRole("button", { name: "3D model", exact: true }).click();
    } else {
      await expect(page.getByRole("button", { name: "Museum photo" })).toHaveCount(0);
    }

    const fit = await page.evaluate(() => ({ scrollW: document.documentElement.scrollWidth, w: innerWidth, h: innerHeight, stage: document.querySelector(".stage").getBoundingClientRect().height }));
    expect(fit.scrollW, "no horizontal scroll").toBeLessThanOrEqual(fit.w);
    expect(fit.stage, "stage fits the viewport height").toBeLessThanOrEqual(fit.h);
    expect(errors).toEqual([]);
  });
}

test("index lists every stop in walking order", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto("./");
  const links = page.locator('a[href^="stop.html?s="]');
  await expect(links).toHaveCount(tour.length);
  expect(await links.evaluateAll(as => as.map(a => new URL(a.href).searchParams.get("s")))).toEqual(tour.map(s => s.slug));
  expect(errors).toEqual([]);
});

test("unknown stop shows the not-found message and loads no 3D code", async ({ page }) => {
  const three = [];
  page.on("request", r => { if (/vendor\/three|subsystems\//.test(r.url())) three.push(r.url()); });
  await page.goto("stop.html?s=../../etc");
  await expect(page.getByRole("heading", { name: "Stop not found" })).toBeVisible();
  expect(three).toEqual([]);
});
