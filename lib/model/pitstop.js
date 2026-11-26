// A Formula 1 wheel change at one corner, as a timeline (docs/TOUR-POC.md §6). Pure: no DOM, no three.js.
// Phases run one after another: the car stops on its marks, the jacks lift it, the gun undoes the centre nut, the old wheel
// comes off the hub, the new one goes on, the gun tightens the nut, the jacks drop. Each phase { id, dur (s) }.
// stuck: the gun meets the nut at an angle, cuts its drive lugs and can no longer turn it (Monaco 2021): the stop never ends.
export const PHASES = [
  { id: "stop", dur: 0.25 }, { id: "lift", dur: 0.2 }, { id: "undo", dur: 0.3 }, { id: "off", dur: 0.35 },
  { id: "on", dur: 0.35 }, { id: "tighten", dur: 0.3 }, { id: "drop", dur: 0.25 },
];
export const total = (phases = PHASES) => phases.reduce((s, p) => s + p.dur, 0);
const smooth = u => u * u * (3 - 2 * u);

// State at time t (s from the car stopping on its marks): phase id and its progress u, the car's lift (0..1), the nut's
// turns out (0 = home, 1 = free), how far the old wheel is off the hub (0..1) and the new one from it (1..0).
export function at(t, { phases = PHASES, stuck = false } = {}) {
  let t0 = 0, i = 0;
  for (; i < phases.length - 1 && t >= t0 + phases[i].dur; i++) t0 += phases[i].dur;
  let id = phases[i].id, u = Math.min(1, Math.max(0, (t - t0) / phases[i].dur));
  if (stuck) {
    const k = phases.findIndex(p => p.id === "undo"), start = phases.slice(0, k).reduce((s, p) => s + p.dur, 0);
    if (t >= start) { id = "undo"; u = Math.min(0.15, (t - start) / phases[k].dur); }   // the nut moves a little, then no further
  }
  const before = x => phases.findIndex(p => p.id === x) < phases.findIndex(p => p.id === id), now = x => x === id;
  const part = x => (before(x) ? 1 : now(x) ? smooth(u) : 0);
  return {
    id, u,
    lift: part("lift") - part("drop"),
    nut: part("undo") - part("tighten"),
    oldOff: part("off"),
    newOff: 1 - part("on"),
    over: !stuck && t >= total(phases),
  };
}

// Track covered at speed v (m/s) in the time t (s) the car stands still: what a slow stop costs.
export const lostTrack = (t, v) => t * v;
