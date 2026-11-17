// Every stop on the route loads, renders, animates, and every Component/View switch works, on each emulated device.
import { test, expect } from "@playwright/test";
import tour, { teaser } from "../../stops/tour.js";

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

test("teaser lists its three stops; opened from there, they page between each other", async ({ page }) => {
  const errors = watchErrors(page);
  const order = tour.filter(s => teaser.includes(s.slug)).map(s => s.slug), href = s => `stop.html?s=${s}&r=teaser`;
  await page.goto("teaser.html");
  const links = page.locator('a[href^="stop.html?s="]');
  await expect(links).toHaveCount(3);
  expect(await links.evaluateAll(as => as.map(a => a.getAttribute("href")))).toEqual(order.map(href));

  for (const [i, slug] of order.entries()) {
    await page.goto(`${href(slug)}&debug`);
    await page.waitForFunction(() => window.__tour?.stats.frames > 5, null, { timeout: 20_000 });   // leaving mid-load aborts imports
    await expect(page.locator("#where")).toContainText(`Stop ${i + 1} of 3`);
    await expect(page.getByRole("link", { name: "← Highlights" })).toHaveAttribute("href", "teaser.html");
    const pager = await page.locator(".pager a").evaluateAll(as => as.map(a => a.getAttribute("href")));
    expect(pager).toEqual([order[i - 1], order[i + 1]].filter(Boolean).map(href));
  }

  const other = tour.find(s => !teaser.includes(s.slug)).slug;   // not a teaser stop: the full tour's paging
  await page.goto(`stop.html?s=${other}&r=teaser&debug`);
  await page.waitForFunction(() => window.__tour?.stats.frames > 5, null, { timeout: 20_000 });
  await expect(page.locator("#where")).toContainText(`of ${tour.length}`);
  await expect(page.getByRole("link", { name: "← Tour route" })).toHaveAttribute("href", "./");
  expect(errors).toEqual([]);
});

test("teaser: each car's stage stays pinned while its steps scroll past and set what it shows", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto("teaser.html?debug");
  await page.waitForFunction(() => window.__tour?.ready, null, { timeout: 30_000 });
  const shown = i => page.evaluate(i => ({ step: window.__tour.stories[i].step(), state: window.__tour.stories[i].state() }), i);
  const frames = () => page.evaluate(() => window.__tour.stories.map(s => s.frames()));

  for (const [i, car] of cars.filter(c => teaser.includes(c.slug)).entries()) {
    const el = page.locator(".story").nth(i), first = car.components[0].id;
    const steps = [{ comp: first, view: "photo", outline: false }, ...car.components.map(c => ({ comp: c.id, view: "model", outline: false })), { comp: first, view: "photo", outline: true }];
    await expect(el.locator(".step")).toHaveCount(steps.length);
    const pinned = new Set();
    for (const [k, want] of steps.entries()) {
      await el.locator(".step").nth(k).evaluate(s => s.scrollIntoView({ block: "center" }));
      await expect.poll(() => shown(i)).toEqual({ step: k, state: want });
      if (want.view !== "model") continue;
      pinned.add(await el.locator(".stage").evaluate(s => Math.round(s.getBoundingClientRect().top)));
      if (k > 1) continue;   // on the first component: only this car's stage animates
      await page.waitForTimeout(300);
      const f0 = await frames(); await page.waitForTimeout(600); const f1 = await frames();
      expect(f1.map((f, j) => f > f0[j]), "animating stages").toEqual(f1.map((_, j) => j === i));
    }
    expect(pinned.size, "stage stays put through the component steps").toBe(1);
  }

  const fit = await page.evaluate(() => ({ scrollW: document.documentElement.scrollWidth, w: innerWidth, h: innerHeight, stage: document.querySelector(".story .stage").getBoundingClientRect().height }));
  expect(fit.scrollW, "no horizontal scroll").toBeLessThanOrEqual(fit.w);
  expect(fit.stage, "stage fits the viewport height").toBeLessThanOrEqual(fit.h);
  expect(errors).toEqual([]);
});
