// After one visit with signal every stop works with no network (Chromium: Playwright's SW support is reliable there).
import { test, expect } from "@playwright/test";
import tour from "../../stops/tour.js";
import { precomputed } from "./helpers.mjs";

test("one visit stores the whole tour; another stop then opens offline", async ({ page, context }) => {
  await page.goto("./?sw=1");   // service worker is skipped on localhost unless asked for
  await expect(page.locator("#status")).toContainText("Ready offline", { timeout: 30_000 });
  await context.setOffline(true);
  const slug = tour.at(-1).slug;
  await page.goto(`stop.html?s=${slug}&sw=1&debug`);
  await page.waitForFunction(() => window.__tour?.stories[0].frames() > 5, null, { timeout: 20_000 });
  // The precomputed airflow steps, cold, with no network: each loads its fields and switches case.
  for (const slug of ["190e-evo2", "w196r"]) {
    const car = (await import(`../../stops/${slug}/car.js`)).default;
    await page.goto(`stop.html?s=${slug}&sw=1&debug`);
    await page.waitForFunction(() => window.__tour?.stories[0].frames() > 5, null, { timeout: 20_000 });
    for (const [k, comp] of car.components.entries()) {
      if (comp.subsystem !== "race-aero") continue;
      const step = page.locator(".step").nth(k + 1);
      await step.evaluate(s => s.scrollIntoView({ block: "center" }));
      await precomputed(step, comp);
    }
  }
  await page.goto("./?sw=1");
  await expect(page.locator('a[href^="stop.html?s="]')).toHaveCount(tour.length);
  await page.goto("teaser.html?sw=1");
  await expect(page.locator('a[href^="stop.html?s="]')).toHaveCount(3);
});
