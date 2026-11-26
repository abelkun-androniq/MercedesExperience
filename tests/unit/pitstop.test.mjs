// The pit-stop timeline.
import { test } from "node:test";
import assert from "node:assert/strict";
import { PHASES, total, at, lostTrack } from "../../lib/model/pitstop.js";

test("a normal stop lifts, swaps and drops the car in order", () => {
  assert.ok(Math.abs(total() - 2.0) < 1e-9);
  const s0 = at(0), mid = at(0.95), end = at(total() + 0.1);
  assert.equal(s0.id, "stop"); assert.equal(s0.lift, 0); assert.equal(s0.nut, 0); assert.equal(s0.newOff, 1);
  assert.equal(mid.id, "off"); assert.equal(mid.lift, 1); assert.equal(mid.nut, 1); assert.ok(mid.oldOff > 0 && mid.oldOff < 1);
  assert.equal(end.lift, 0); assert.equal(end.nut, 0); assert.equal(end.oldOff, 1); assert.equal(end.newOff, 0); assert.ok(end.over);
  let last = -1;   // the phases come in the listed order
  for (let t = 0; t < total(); t += 0.01) { const k = PHASES.findIndex(p => p.id === at(t).id); assert.ok(k >= last); last = k; }
});

test("a stuck nut never comes free, and the stop never ends", () => {
  for (const t of [0.8, 2, 30]) { const s = at(t, { stuck: true }); assert.equal(s.id, "undo"); assert.ok(s.nut <= 0.15); assert.equal(s.oldOff, 0); assert.ok(!s.over); }
});

test("track lost while standing", () => assert.ok(Math.abs(lostTrack(2, 300 / 3.6) - 166.67) < 0.01));
