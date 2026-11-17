// After one visit with signal every stop works with no network (Chromium: Playwright's SW support is reliable there).
import { test, expect } from "@playwright/test";
import tour from "../../stops/tour.js";

test("one visit stores the whole tour; another stop then opens offline", async ({ page, context }) => {
  await page.goto("./?sw=1");   // service worker is skipped on localhost unless asked for
  await expect(page.locator("#status")).toContainText("Ready offline", { timeout: 30_000 });
  await context.setOffline(true);
  const slug = tour.at(-1).slug;
  await page.goto(`stop.html?s=${slug}&sw=1&debug`);
  await page.waitForFunction(() => window.__tour?.stats.frames > 5, null, { timeout: 20_000 });
  await page.goto("./?sw=1");
  await expect(page.locator('a[href^="stop.html?s="]')).toHaveCount(tour.length);
  await page.goto("teaser.html?sw=1");
  await expect(page.locator('a[href^="stop.html?s="]')).toHaveCount(3);
});
