// Every stop on the route is wired up: config present, subsystems resolve, photos and credits exist, talk points written.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { tour, loadCars } from "./helpers.mjs";

const root = new URL("../../", import.meta.url);
const exists = p => existsSync(new URL(p, root));
const cars = await loadCars();

test("tour slugs are unique, safe and match their config", () => {
  assert.equal(new Set(tour.map(s => s.slug)).size, tour.length);
  tour.forEach((s, i) => {
    assert.match(s.slug, /^[a-z0-9-]+$/);
    assert.equal(cars[i].slug, s.slug);
    assert.ok(s.room && Number.isInteger(s.level), `${s.slug}: room and level`);
  });
});

for (const car of cars) {
  test(`${car.slug}: text, components and sources`, () => {
    for (const k of ["title", "name", "summary", "eyebrow", "lede", "note"]) assert.ok(car[k], `${k} missing`);
    assert.ok(Number.isInteger(car.year));
    assert.ok(car.components.length > 0);
    assert.equal(new Set(car.components.map(c => c.id)).size, car.components.length, "component ids unique");
    for (const c of car.components) {
      assert.match(c.subsystem, /^[a-z0-9-]+$/);
      assert.ok(exists(`subsystems/${c.subsystem}.js`), `subsystems/${c.subsystem}.js`);
      assert.ok(c.label && c.view?.pos?.length === 3 && c.view?.target?.length === 3, `${c.id}: label and view`);
      assert.ok(c.talk?.length > 0 && c.talk.every(t => t.length > 20), `${c.id}: talk points`);
    }
    assert.ok(Array.isArray(car.unverified) && Array.isArray(car.sources));
    for (const s of car.sources) assert.match(s.url, /^https:\/\//);
  });

  if (car.photo) test(`${car.slug}: photo, camera fit and credit`, () => {
    assert.ok(exists(`stops/${car.slug}/${car.photo.src}`), "photo file");
    assert.ok(car.photo.w > 0 && car.photo.h > 0 && car.photo.alt);
    assert.ok(["c", "yaw", "pitch", "roll", "f"].every(k => k in car.photo.cam));
    assert.ok(car.photo.credit?.author && car.photo.credit.license && car.photo.credit.url);
  });
}
