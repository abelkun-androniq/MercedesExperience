// The Hungarian tour: a hu-HU browser gets Hungarian on its first visit, no stop shows untranslated text, numbers use a
// decimal comma, and the EN/HU switch is remembered. One device is enough: smoke.spec covers layout on all of them.
import { test, expect } from "@playwright/test";
import tour, { teaser } from "../../stops/tour.js";
import { merge } from "../../lib/app/i18n.js";
import hu from "../../lib/app/i18n/hu.js";

const cars = await Promise.all(tour.map(async s =>
  merge((await import(`../../stops/${s.slug}/car.js`)).default, (await import(`../../stops/${s.slug}/hu.js`)).default)));

test.use({ locale: "hu-HU" });
test.beforeEach(() => test.skip(test.info().project.name !== "iphone", "one device covers the translation"));

function watchErrors(page) {
  const errors = [];
  page.on("pageerror", e => errors.push(`pageerror: ${e.message}`));
  page.on("console", m => { if (m.type() === "error") errors.push(`console: ${m.text()}`); });
  return errors;
}

for (const car of cars) {
  test(`${car.slug} in Hungarian`, async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto(`stop.html?s=${car.slug}&debug`);
    await page.waitForFunction(() => window.__tour?.stats.frames > 10, null, { timeout: 20_000 });
    await expect(page.locator("html")).toHaveAttribute("lang", "hu");
    await expect(page.locator("h1")).toHaveText(car.title);

    for (const comp of car.components) {
      if (car.components.length > 1) await page.getByRole("button", { name: comp.label, exact: true }).click();
      await expect(page.locator(`.panel[data-comp="${comp.id}"]`).first()).toBeVisible();
    }
    await page.getByRole("button", { name: hu["Museum photo"], exact: true }).click();
    await page.getByRole("button", { name: hu["Car outline"], exact: true }).click();
    expect(await page.evaluate(() => window.__tour.state)).toMatchObject({ view: "photo", outline: true });
    await page.getByRole("button", { name: hu["3D model"], exact: true }).click();

    const shown = await page.locator(".panel output, .panel .badge").allTextContents();
    expect(shown.filter(s => /\d\.\d/.test(s)), "decimal comma").toEqual([]);
    expect(await page.evaluate(() => window.__tour.missing())).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("index in Hungarian; the switch changes language and is remembered", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto("./");
  await expect(page.locator("html")).toHaveAttribute("lang", "hu");
  await expect(page.locator("html")).not.toHaveClass(/translating/);
  await expect(page.locator("h1")).toHaveText(hu["Under the skin: a technical tour"]);
  await expect(page.locator(".room h2").first()).toHaveText(hu[tour[0].room]);
  await expect(page.locator(".stop b")).toHaveText(cars.map(c => c.name));
  await expect(page.getByRole("button", { name: "Magyar" })).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "English" }).click();
  await expect(page.locator("h1")).toHaveText("Under the skin: a technical tour");
  await expect(page.locator(".stop b").first()).toHaveText((await import(`../../stops/${tour[0].slug}/car.js`)).default.name);
  await expect(page.locator(".stop b")).toHaveCount(tour.length);   // leaving mid-load would abort its imports
  await page.goto(`stop.html?s=${tour[0].slug}&debug`);
  await page.waitForFunction(() => window.__tour?.stats.frames > 5, null, { timeout: 20_000 });   // switching mid-load aborts imports
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("link", { name: "← Tour route" })).toBeVisible();

  await page.getByRole("button", { name: "Magyar" }).click();
  await expect(page.getByRole("link", { name: hu["← Tour route"] })).toBeVisible();
  expect(errors).toEqual([]);
});

test("teaser in Hungarian", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto("teaser.html?debug");
  await page.waitForFunction(() => window.__tour?.ready, null, { timeout: 30_000 });
  await expect(page.locator("h1")).toHaveText(hu["Under the skin: three highlights"]);
  const teaserCars = cars.filter(c => teaser.includes(c.slug));
  await expect(page.locator(".story h2")).toHaveText(teaserCars.map(c => c.title));
  await expect(page.locator(".story h3").first()).toHaveText(teaserCars[0].components[0].label);
  const shown = await page.locator(".story .panel output").allTextContents();
  expect(shown.filter(s => /\d\.\d/.test(s)), "decimal comma").toEqual([]);
  expect(await page.evaluate(() => window.__tour.missing())).toEqual([]);
  expect(errors).toEqual([]);
});
