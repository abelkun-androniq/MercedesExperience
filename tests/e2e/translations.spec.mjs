// The translated tours (Hungarian, German): a hu-HU or de-DE browser gets its language on the first visit, no stop shows
// untranslated text, numbers use a decimal comma, and the language switch is remembered. One device is enough: smoke.spec
// covers layout on all of them.
import { test, expect } from "@playwright/test";
import tour, { teaser } from "../../stops/tour.js";
import { merge } from "../../lib/app/i18n.js";
import { watchErrors } from "./helpers.mjs";

test.beforeEach(() => test.skip(test.info().project.name !== "iphone", "one device covers the translation"));

const langs = await Promise.all([["hu", "hu-HU", "Magyar"], ["de", "de-DE", "Deutsch"]].map(async ([lang, locale, button]) => ({
  lang, locale, button,
  ui: (await import(`../../lib/app/i18n/${lang}.js`)).default,
  cars: await Promise.all(tour.map(async s =>
    merge((await import(`../../stops/${s.slug}/car.js`)).default, (await import(`../../stops/${s.slug}/${lang}.js`)).default))),
})));

for (const { lang, locale, button, ui, cars } of langs) test.describe(lang, () => {
  test.use({ locale });

  for (const car of cars) {
    test(`${car.slug} in ${lang}`, async ({ page }) => {
      const errors = watchErrors(page);
      await page.goto(`stop.html?s=${car.slug}&debug`);
      await page.waitForFunction(() => window.__tour?.stories[0].frames() > 10, null, { timeout: 20_000 });
      await expect(page.locator("html")).toHaveAttribute("lang", lang);
      await expect(page.locator("h1")).toHaveText(car.title);
      await expect(page.locator(".step h3")).toHaveText([...car.components.map(c => c.label), ui["Background"]]);

      await page.locator(".step").nth(1).evaluate(s => s.scrollIntoView({ block: "center" }));   // the first component in 3D
      await expect.poll(() => page.evaluate(() => window.__tour.stories[0].state().view)).toBe("model");
      const frames = await page.evaluate(() => window.__tour.stories[0].frames());
      await page.waitForFunction(f => window.__tour.stories[0].frames() > f + 10, frames);

      const shown = await page.locator(".panel output, .panel .badge").allTextContents();
      expect(shown.filter(s => /\d\.\d/.test(s)), "decimal comma").toEqual([]);
      expect(await page.evaluate(() => window.__tour.missing())).toEqual([]);
      expect(errors).toEqual([]);
    });
  }

  test(`index in ${lang}; the switch changes language and is remembered`, async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto("./");
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    await expect(page.locator("html")).not.toHaveClass(/translating/);
    await expect(page.locator("h1")).toHaveText(ui["Under the skin: a technical tour"]);
    await expect(page.locator(".room h2").first()).toHaveText(ui[tour[0].room]);
    await expect(page.locator(".stop b")).toHaveText(cars.map(c => c.name));
    await expect(page.getByRole("button", { name: button })).toHaveAttribute("aria-pressed", "true");

    await page.getByRole("button", { name: "English" }).click();
    await expect(page.locator("h1")).toHaveText("Under the skin: a technical tour");
    await expect(page.locator(".stop b").first()).toHaveText((await import(`../../stops/${tour[0].slug}/car.js`)).default.name);
    await expect(page.locator(".stop b")).toHaveCount(tour.length);   // leaving mid-load would abort its imports
    await page.goto(`stop.html?s=${tour[0].slug}&debug`);
    await page.waitForFunction(() => window.__tour?.stories[0].frames() > 5, null, { timeout: 20_000 });   // switching mid-load aborts imports
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("link", { name: "← Tour route" })).toBeVisible();

    await page.getByRole("button", { name: button }).click();
    await expect(page.getByRole("link", { name: ui["← Tour route"] })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test(`teaser in ${lang}`, async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto("teaser.html?debug");
    await page.waitForFunction(() => window.__tour?.ready, null, { timeout: 30_000 });
    await expect(page.locator("h1")).toHaveText(ui["Under the skin: three highlights"]);
    const teaserCars = cars.filter(c => teaser.includes(c.slug));
    await expect(page.locator(".story h2")).toHaveText(teaserCars.map(c => c.title));
    await expect(page.locator(".story h3").first()).toHaveText(teaserCars[0].components[0].label);
    const shown = await page.locator(".story .panel output").allTextContents();
    expect(shown.filter(s => /\d\.\d/.test(s)), "decimal comma").toEqual([]);
    expect(await page.evaluate(() => window.__tour.missing())).toEqual([]);
    expect(errors).toEqual([]);
  });
});
