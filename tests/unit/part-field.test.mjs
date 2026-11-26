// Component airflow files (lib/model/part-field.js): the grid's orientation and byte format on a small asymmetric fixture,
// then every exported part a stop points at: manifest, bytes, and guides that agree with the air around them.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { centre, corners, encode, decode, quantize, dequantize, problems, SOLID } from "../../lib/model/part-field.js";
import { loadCars } from "./helpers.mjs";

const root = new URL("../../", import.meta.url);
const fixture = plane => ({ plane, originMm: [100, 20, 30], cellMm: 10, width: 3, height: 2, quantity: "speed-over-inlet", range: [-1, 1], cases: { a: { lines: [], guides: [] } } });

test("part field: cell centres run against x along a row and up the plane down the rows, from the first cell's centre", () => {
  const xz = fixture("xz"), xy = fixture("xy");
  assert.deepEqual(centre(xz, 0, 0), [100, 20, 30]);
  assert.deepEqual(centre(xz, 2, 0), [80, 20, 30], "a column further is 10 mm further back");
  assert.deepEqual(centre(xz, 0, 1), [100, 20, 40], "a row further is 10 mm higher");
  assert.deepEqual(centre(xy, 0, 1), [100, 30, 30], "on a plan view a row further is 10 mm further left");
  assert.deepEqual(corners(xz), [[105, 20, 25], [75, 20, 25], [105, 20, 45], [75, 20, 45]], "outer edges half a cell beyond the centres");
  assert.deepEqual(corners(xy)[3], [75, 35, 30]);
});

test("part field: bytes are row-major from the bottom; the range's ends map to 0 and 254; 255 is solid, never a value", () => {
  const f = fixture("xz");
  // An asymmetric pattern: value = x/100 − (z − 30)/20 (front-low corner largest), solid at the rear top cell.
  const bytes = encode(f, (x, y, z) => (x === 80 && z === 40 ? null : x / 100 - (z - 30) / 20));
  assert.equal(bytes.length, 6);
  assert.deepEqual([...bytes], [quantize(1, f.range), quantize(0.9, f.range), quantize(0.8, f.range), quantize(0.5, f.range), quantize(0.4, f.range), SOLID]);
  assert.equal(quantize(-1, f.range), 0); assert.equal(quantize(1, f.range), 254); assert.equal(quantize(7, f.range), 254); assert.equal(quantize(-7, f.range), 0);
  assert.equal(dequantize(0, f.range), -1); assert.equal(dequantize(254, f.range), 1); assert.equal(dequantize(SOLID, f.range), null);
  const d = decode(f, bytes);
  assert.ok(Math.abs(d.at(0, 0) - 1) < 0.01 && Math.abs(d.at(2, 0) - 0.8) < 0.01 && Math.abs(d.at(0, 1) - 0.5) < 0.01);
  assert.equal(d.at(2, 1), null); assert.ok(d.solid(2, 1) && !d.solid(1, 1));
  assert.throws(() => decode(f, bytes.subarray(1)), /5 bytes, want 6/);
});

test("part field: a manifest's problems name what is wrong", () => {
  assert.deepEqual(problems(fixture("xz"), ["a"]), []);
  assert.deepEqual(problems(fixture("xz"), ["a", "b"]), ["cases a ≠ a,b"]);
  assert.deepEqual(problems({ ...fixture("yz"), range: [1, 0] }, ["a"]), ["plane yz", "range"]);
  const f = fixture("xy"); f.cases.a.guides = [{ kind: "arrow", points: [[0, 0, 0]] }];
  assert.deepEqual(problems(f, ["a"]), ["a: guides"]);
});

// Every exported part: the stop's case ids, the files and their sizes, and lessons the air itself carries.
const parts = (await loadCars()).flatMap(car => car.components.filter(c => c.subsystem === "race-aero").map(c => ({ car, c })));
test("every component tunnel a stop shows has its files", () => assert.ok(parts.length >= 4, `${parts.length} parts`));
for (const { car, c } of parts) {
  test(`${car.slug} ${c.id}: field, cases and guides agree with the air`, () => {
    const dir = new URL(c.params.data, root), ids = c.params.cases.map(k => k.id);
    assert.ok(ids.includes(c.params.start), "starts on one of its cases");
    const f = JSON.parse(readFileSync(new URL("field.json", dir)));
    assert.deepEqual(problems(f, ids), []);
    const cells = Object.fromEntries(ids.map(id => {
      assert.ok(existsSync(new URL(`${id}.bin`, dir)), `${id}.bin`);
      return [id, decode(f, new Uint8Array(readFileSync(new URL(`${id}.bin`, dir))))];
    }));
    const near = (id, p, r) => {   // fluid values within r cells of point p (on the plane)
      const out = [];
      for (let b = 0; b < f.height; b++) for (let a = 0; a < f.width; a++) {
        const q = centre(f, a, b), v = cells[id].at(a, b);
        if (v != null && Math.hypot(q[0] - p[0], q[1] - p[1], q[2] - p[2]) <= r * f.cellMm) out.push(v);
      }
      return out;
    };
    const mean = a => a.reduce((s, v) => s + v, 0) / a.length;
    for (const id of ids) {
      for (const g of f.cases[id].guides) {
        const [p0, p1] = g.points;
        if (g.kind === "arrow" && f.quantity === "vertical-speed-over-inlet") {
          const around = near(id, p0, 2.5); assert.ok(around.length >= 4, `${id}: air around the arrow`);
          assert.equal(Math.sign(p1[2] - p0[2]), Math.sign(mean(around)), `${id}: the arrow tips the way the air moves (mean ${mean(around).toFixed(3)})`);
        }
        if (g.below != null) {   // a line marking where the field is below a threshold: inside below, just beyond it above
          const v = near(id, p0.map((x, k) => (x + p1[k]) / 2), 0.75);
          assert.ok(v.length && mean(v) < g.below, `${id}: the marked band is slow (${mean(v)?.toFixed(2)})`);
        }
      }
    }
    if (ids.length > 1) {   // the air itself changes between the cases, not only the bodywork
      let changed = 0;
      for (let b = 0; b < f.height; b++) for (let a = 0; a < f.width; a++) {
        const u = cells[ids[0]].at(a, b), v = cells[ids[1]].at(a, b);
        if (u != null && v != null && Math.abs(u - v) > 0.1 * (f.range[1] - f.range[0])) changed++;
      }
      assert.ok(changed >= 4, `${changed} air cells change by a tenth of the scale`);
    }
  });
}
