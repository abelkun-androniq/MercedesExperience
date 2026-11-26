// Every stop on the route loads, renders and animates, and scrolling its story sets what the stage shows, on each emulated
// device.
import { test, expect } from "@playwright/test";
import tour, { teaser } from "../../stops/tour.js";
import { watchErrors, stepsOf, shown, precomputed } from "./helpers.mjs";
import { roomId } from "../../lib/app/route.js";

const cars = await Promise.all(tour.map(async s => (await import(`../../stops/${s.slug}/car.js`)).default));

for (const car of cars) {
  test(`${car.slug}: the story's steps set the stage, readouts move`, async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto(`stop.html?s=${car.slug}&debug`);
    await page.waitForFunction(() => window.__tour?.stories[0].frames() > 10, null, { timeout: 20_000 });
    await expect(page.locator(".step")).toHaveCount(car.components.length + 2);

    const pinned = new Set();
    for (const [k, want] of stepsOf(car).entries()) {
      const step = page.locator(".step").nth(k);
      await step.evaluate(s => s.scrollIntoView({ block: "center" }));
      await expect.poll(() => shown(page)).toEqual({ step: k, state: want });
      await expect(page.locator(".stage img")).toBeVisible({ visible: want.view === "photo" });
      if (k === 0 || k > car.components.length) continue;   // intro and background: no component cards
      pinned.add(await page.locator(".stage").evaluate(s => Math.round(s.getBoundingClientRect().top)));
      await expect.poll(() => page.evaluate(() => window.__tour.stories[0].triangles())).toBeGreaterThan(0);
      const comp = car.components.find(c => c.id === want.comp);
      if (comp.subsystem === "race-aero") { await precomputed(step, comp); continue; }   // precomputed airflow: no readouts
      const readouts = () => step.locator(`.panel[data-comp="${want.comp}"] output`).allTextContents();
      const before = await readouts();
      expect(before.length).toBeGreaterThan(0);
      await expect.poll(readouts, { timeout: 15_000 }).not.toEqual(before);
    }
    expect(pinned.size, "stage stays put through the component steps").toBe(1);

    const fit = await page.evaluate(() => ({ scrollW: document.documentElement.scrollWidth, w: innerWidth, h: innerHeight, stage: document.querySelector(".stage").getBoundingClientRect().height }));
    expect(fit.scrollW, "no horizontal scroll").toBeLessThanOrEqual(fit.w);
    expect(fit.stage, "stage fits the viewport height").toBeLessThanOrEqual(fit.h);
    expect(errors).toEqual([]);
  });
}

test("index lists every stop in walking order", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto("./");
  const links = page.locator('main a[href^="stop.html?s="]');   // the stop cards; the hero's invitation links into one story
  await expect(links).toHaveCount(tour.length);
  expect(await links.evaluateAll(as => as.map(a => new URL(a.href).searchParams.get("s")))).toEqual(tour.map(s => s.slug));
  expect(errors).toEqual([]);
});

test("index: room jump links reach their rooms; highlights and back again", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto("./");
  const jumps = page.locator(".jump a");
  await expect(jumps).toHaveCount(new Set(tour.map(s => `${s.room} ${s.level}`)).size);
  for (const href of await jumps.evaluateAll(as => as.map(a => a.getAttribute("href")))) await expect(page.locator(href)).toHaveClass("room");
  await page.locator('.jump a[href="#room-legend-6"]').click();
  await expect(page.locator("#room-legend-6 h2")).toBeInViewport();
  await page.getByRole("link", { name: "Three highlights" }).click();
  await expect(page).toHaveURL(/teaser\.html$/);
  await expect(page.getByRole("link", { name: "See the full route" })).toHaveAttribute("href", "./#jump");
  expect(errors).toEqual([]);
});

test("index: “Find your room” and a fresh ./#jump both bring the room picker into view", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto("./");
  await expect(page.locator(".jump a").first()).toBeVisible();
  await page.getByRole("link", { name: "Find your room" }).click();
  await expect(page.locator("#jump-title")).toBeInViewport();
  await expect(page.locator(".jump a").first()).toBeInViewport();
  await page.goto("about:blank");
  await page.goto("./#jump");
  await expect(page.locator(".jump a").first()).toBeInViewport();
  await expect(page.locator("#jump-title")).toBeInViewport();
  expect(errors).toEqual([]);
});

const roofSteps = {
  en: [["Unlatch", "Boot lid up", "Roof folds back", "Boot lid down"], ["Boot lid up", "Roof folds forward", "Boot lid down", "Latch"]],
  hu: [["Reteszoldás", "Fedél nyílik", "A tető hátrahajlik", "Fedél zárul"], ["Fedél nyílik", "A tető előrehajlik", "Fedél zárul", "Reteszelés"]],
  de: [["Entriegeln", "Deckel auf", "Dach klappt nach hinten", "Deckel zu"], ["Deckel auf", "Dach klappt nach vorn", "Deckel zu", "Verriegeln"]],
};
for (const lang of Object.keys(roofSteps)) {
  test(`SLK roof steps (${lang}): every label fits its cell and names the movement in either direction`, async ({ page }) => {
    const errors = watchErrors(page);
    await page.addInitScript(l => localStorage.setItem("tour-lang", l), lang);
    await page.goto("stop.html?s=slk&debug");
    await page.waitForFunction(() => window.__tour?.stories[0].frames() > 2, null, { timeout: 20_000 });
    const step = page.locator(".step").nth(1);
    await step.evaluate(s => s.scrollIntoView({ block: "center" }));
    const cells = step.locator(".cyls .cyl");
    await expect(cells).toHaveCount(4);
    const labels = () => cells.locator("b").allTextContents();
    const overflowing = () => cells.evaluateAll(cs => cs.filter(c => c.scrollWidth > c.clientWidth).map(c => c.firstChild.textContent));
    const buttons = step.locator(".row").first().locator("button");
    await buttons.nth(0).click();   // Open the roof
    expect(await labels()).toEqual(roofSteps[lang][0]);
    expect(await overflowing()).toEqual([]);
    await buttons.nth(1).click();   // Close the roof
    await expect.poll(labels).toEqual(roofSteps[lang][1]);
    expect(await overflowing()).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("switching language keeps the experiment: the 300 SL's lowered frame stays chosen and in view", async ({ page }) => {
  const errors = watchErrors(page);
  await page.addInitScript(() => { if (!localStorage.getItem("tour-lang")) localStorage.setItem("tour-lang", "en"); });
  await page.goto("stop.html?s=300sl&debug");
  await page.waitForFunction(() => window.__tour?.stories[0].frames() > 2, null, { timeout: 20_000 });
  await page.locator(".step").nth(1).evaluate(s => s.scrollIntoView({ block: "center" }));
  await expect.poll(() => shown(page)).toMatchObject({ step: 1, state: { comp: "frame" } });
  await page.getByRole("button", { name: "Lower sill for conventional doors" }).click();
  for (const [to, lower] of [["Magyar", "Alacsony küszöb hagyományos ajtóhoz"], ["English", "Lower sill for conventional doors"]]) {
    await page.getByRole("button", { name: to }).click();
    await page.waitForFunction(() => window.__tour?.stories[0].frames() > 2, null, { timeout: 20_000 });
    const button = page.getByRole("button", { name: lower });
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(button).toBeInViewport();
    await expect.poll(() => shown(page)).toMatchObject({ step: 1, state: { comp: "frame" } });
  }
  expect(errors).toEqual([]);
});

test("the stop's photo, credit and introduction show even when 3D cannot load", async ({ page }) => {
  await page.route(/vendor\/three\//, r => r.abort());
  await page.goto("stop.html?s=slk");
  await expect(page.locator(".story-stage .fail")).toBeVisible();
  await expect(page.locator(".stage img")).toBeVisible();
  await expect(page.locator(".stage .credit")).toBeVisible();
  await expect(page.locator(".stage .caption")).toHaveText("Reference photo of the same generation, not the museum's car");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator(".step .look").first()).toBeVisible();
});

test("a real-part photo swaps places with the stage; a tap on the 3D view or scrolling away swaps them back", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto("stop.html?s=540k&debug");
  await page.waitForFunction(() => window.__tour?.stories[0].frames() > 2, null, { timeout: 20_000 });
  const swapped = () => page.evaluate(() => window.__tour.stories[0].swapped());
  const pane = page.locator(".story-stage"), fig = page.locator("figure.real").first();
  // The photo just below the pinned stage, as a visitor sees it before tapping.
  await page.evaluate(() => scrollBy(0, document.querySelector("figure.real").getBoundingClientRect().top - document.querySelector(".story-stage").getBoundingClientRect().height - 20));
  const height = (await pane.boundingBox()).height;

  await fig.locator(".real-open").click();
  expect(await swapped()).toBe(true);
  await expect(pane.locator(".real-open img")).toBeVisible();
  await expect(fig.locator(".stage canvas")).toBeVisible();
  expect((await pane.boundingBox()).height, "the pinned area keeps its size").toBeCloseTo(height, 0);

  const box = await fig.locator(".stage").boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  expect(await swapped()).toBe(false);
  await expect(pane.locator(".stage canvas")).toBeVisible();

  await fig.locator(".real-open").click();
  await pane.locator(".real-open").click();   // the big photo swaps back too
  expect(await swapped()).toBe(false);

  await fig.locator(".real-open").click();
  await page.evaluate(() => scrollBy(0, 2 * innerHeight));
  await expect.poll(swapped).toBe(false);
  await expect(pane.locator(":scope > .stage")).toHaveCount(1);
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
  await page.goto("teaser.html?debug");
  await page.waitForLoadState("networkidle");   // leaving mid-load aborts imports
  const links = page.locator('a[href^="stop.html?s="]');
  await expect(links).toHaveCount(3);
  expect(await links.evaluateAll(as => as.map(a => a.getAttribute("href")))).toEqual(order.map(href));

  for (const [i, slug] of order.entries()) {
    await page.goto(`${href(slug)}&debug`);
    await page.waitForFunction(() => window.__tour?.stories[0].frames() > 5, null, { timeout: 20_000 });   // leaving mid-load aborts imports
    await expect(page.locator("#where")).toContainText(`Stop ${i + 1} of 3`);
    await expect(page.getByRole("link", { name: "← Highlights" })).toHaveAttribute("href", "teaser.html");
    const pager = await page.locator(".pager a").evaluateAll(as => as.map(a => a.getAttribute("href")));
    expect(pager).toEqual([order[i - 1], order[i + 1]].filter(Boolean).map(href));
  }

  const other = tour.find(s => !teaser.includes(s.slug));   // not a teaser stop: the full tour's paging
  await page.goto(`stop.html?s=${other.slug}&r=teaser&debug`);
  await page.waitForFunction(() => window.__tour?.stories[0].frames() > 5, null, { timeout: 20_000 });
  await expect(page.locator("#where")).toContainText(`of ${tour.length}`);
  await expect(page.getByRole("link", { name: "← Tour route" })).toHaveAttribute("href", `./#${roomId(other.room)}`);   // back to its room on the route
  expect(errors).toEqual([]);
});

test("teaser: each car's stage stays pinned while its steps scroll past and set what it shows", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto("teaser.html?debug");
  await page.waitForFunction(() => window.__tour?.ready, null, { timeout: 30_000 });
  const frames = () => page.evaluate(() => window.__tour.stories.map(s => s.frames()));

  for (const [i, car] of cars.filter(c => teaser.includes(c.slug)).entries()) {
    const el = page.locator(".story").nth(i), steps = stepsOf(car);
    await expect(el.locator(".step")).toHaveCount(steps.length);
    const pinned = new Set();
    for (const [k, want] of steps.entries()) {
      await el.locator(".step").nth(k).evaluate(s => s.scrollIntoView({ block: "center" }));
      await expect.poll(() => shown(page, i)).toEqual({ step: k, state: want });
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
