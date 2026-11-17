// Side profile from a photo: pixel outline points → vehicle mm, through a camera fitted with fit-photo-camera.mjs.
// Usage: node tools/trace-profile.mjs tools/profile-traces/<slug>.json
// Each group of points lies on a known vertical plane y (mm): 0 for the nose and tail tips, the crown's silhouette a little
// beyond the centre line (the camera looks down), the sill at the body side. Output: [x, z] per group, then all of them as
// one polygon in the order given (go round the outline), ready to clean up into car.js body.ghost / aero flow.profile.
// Read pixel coordinates off node tools/photo-grid.mjs crops.
import { readFileSync } from "node:fs";
import { camera } from "./camera.mjs";

const cfg = JSON.parse(readFileSync(process.argv[2], "utf8")), cam = camera(cfg.cam, cfg.image), all = [];
for (const g of cfg.groups) {
  const pts = g.px.map(p => { const [x, , z] = cam.onPlaneY(p, g.y); return [Math.round(x), Math.round(z + (cfg.dz ?? 0))]; });
  all.push(...pts); console.log(`${g.name.padEnd(28)} ${JSON.stringify(pts)}`);
}
console.log(`\npolygon (${all.length} points):\n${JSON.stringify(all)}`);
