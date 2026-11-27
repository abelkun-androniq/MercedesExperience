# Mercedes-Benz Museum technical tour

Static GitHub Pages site: one page per exhibit showing its mechanism working (three.js), offline after one visit, for
iPhone/iPad Safari (iOS 16.4+, import maps). No bundler: native ES modules; `tools/build.mjs` only stamps the service worker.

## Map
- `index.html` route (lib/app/index.js) · `stop.html?s=<slug>[&r=teaser]` one stop as a scroll story (lib/app/shell.js;
  r=teaser pages among the teaser stops and links back to teaser.html): the car's stage pins while its steps (intro on the
  photo, one per component with its cards, background with the outline) scroll past and set what it shows ·
  `teaser.html` the three `teaser` stops' stories one after another (lib/app/teaser.js, own manifest) · `sw.js` offline
  cache (new root files also go in tools/build.mjs ENTRIES)
- `stops/tour.js` route order, room, level, `check` ("room" or "level": not yet confirmed on site, shown as a qualifier),
  and `teaser` (slugs): single source for order and prev/next ·
  `stops/<slug>/car.js` pure data (+ photo.jpg) · `parts/` real-life photos of mechanisms the exhibits hide (component `real`; shared
  between stops)
- `lib/model/` pure maths, Node-tested: linkage (multi-link closure), quarter-car (ride), engine (N-cylinder slider-crank,
  timing, diesel, shaking forces, gas-torque pulses), torsion (crankshaft twist: centre or end take-off), blower, valvetrain (spring float, desmo), steering (double-pivot trapezoid, centre pivot, twin steered
  axles), differential (one axle; traction: open, limited-slip (`bias`) or locked with one wheel on mud; traction4: four-wheel drive with locks or brake traction control), gearbox (sliding
  gears), aero (drag, top speed), truss (space frame twist), crash, air-spring (levelling: air, or a motor-wound torsion
  bar), wankel, cooling (+ ice tank: melt, warm, boil), belt (two-speed flat-belt drive, hill climbing), hoist (car-transporter deck: cylinder, pulley
  block, cables), flow (2-D lattice-Boltzmann wind tunnel: D2Q9 + Smagorinsky, moving road, drag split), abs (tyre slip
  curves, braking with and without ABS), rollover (tip angle, rolling pendulum, roll-bar timing), hydraulics (gas
  accumulator, pump, cylinders), climate (cabin heat balance), portal (portal-axle clearance), roof (folding hardtop), pitstop (wheel-change phases, a stuck nut), ev (torque vectoring in a bend; energy
  battery → wheels, regen limit), turbo (boost → air, power, shaft work and speed), fuelcell (cell voltage curve, stack and
  auxiliary power, hydrogen and water), axles (rigid and swing axle kinematics, roll centre, roll and jacking in a bend, a rough
  road), part-field (component airflow files:
  one plane grid per part, cases with paths and guides)
- `lib/scene/` stage (renderer, cameras, lights, theme tokens, loop), helpers, ghost-body, road, wind-tunnel (CFD view of
  `flow` on the centre plane: speed/pressure/swirl field, body section, smoke streaklines; `--cfd-*` tokens)
- `lib/app/` shell, teaser, story (scroll stories: shared by shell and teaser), viewer (one car's stage, subsystems,
  photo view and loop: one per story), panel
  (declarative widgets, API in its header; `detail: true` on a card or widget moves it under the step's disclosure when
  the component has `more`), dom (`h`, `link`), offline, index, route (room fragment ids, placement qualifiers), theme.css (look after
  mercedes-benz.com: black bar/hero, white page, condensed serif, black photo cards, pills), fonts/ (Instrument Serif, OFL;
  latin + latin-ext for ő/ű), lang.js (head script: saved EN/HU/DE choice or browser language → `<html lang>`), i18n.js
  (`t`, `num`, `loadCar`, `localizePage`, `LANGS`), i18n/hu.js and i18n/de.js (UI catalogs keyed by the English text; German
  rooms use the museum's names, Mythos 1–7 and Collection 1–4)
- `subsystems/<id>.js` one mechanism each (params documented in each file's header): linkage-suspension, inline-engine,
  roots-blower, desmo-valvetrain, steering, differential, gearbox, radiator, aero, space-frame, crumple-zone,
  air-suspension, wankel, belt-drive, hoist, abs, rollover, comfort-hydraulics, cabin-climate, portal-axle,
  four-wheel-drive, twin-steer, vario-roof, pit-stop, electric-drive (`mode`: bend or energy), turbo (`presets` of boost),
  fuel-cell, ice-cooling, dual-axis-steering (DAS toe from above), measuring-car (quarter-car over a bump, signal down a cable to a
  recorder), axle-compare (rigid, swing and the car's own multi-link from behind: bump, bend, rough road; springs and
  dampers), differential ("Step by step" follows the drive from the propeller shaft to the wheels), race-aero (one part's airflow computed offline by tools/cfd/part.mjs: a field slice through the part,
  mean-flow paths with arrowheads and the guides of its lesson per case; case buttons, Follow the air, Pause airflow). inline-engine also draws V engines (`leans`: one bank per lean angle,
  opposite cylinders sharing a crankpin) and twin ignition (`plugs: 2`), four valves (`valves: 4`), rocker arms (`rockers`), a side exhaust valve on a tappet
  (`sideExhaust`), a time-to-fill card (`breathe`), shaking-force arrows (`balance`), a crank-torque trace (`pulses`) and a
  crankshaft-twist card (`torsion`); radiator runs every cooling type side by side from one start (`start`, `load`); crumple-zone can carry an engine block that
  slides under the floor (`engine`)
- `tools/` build, vendor-three, camera (shared pinhole maths), fit-photo-camera (+ photo-fits/*.json), trace-profile
  (+ profile-traces/*.json: side-photo pixels → mm profile), photo-grid (crop + pixel grid + projected profile overlay, PNG
  via Playwright; `--bright` for dark cars), stop-shot (stage screenshot + fps + page errors; needs `npm run serve`), cfd/ (offline
  lattice-Boltzmann tunnels. Whole-car Evo II: mesh → geometry (cases) → lbm3d (D3Q19, worker threads) → run; `all.sh` runs
  every case on two grids, about 70 min; export.mjs summarises them into the ignored out/whole-car/. Component close-ups:
  `node tools/cfd/part.mjs <wing|splitter|w196-wheel|evo-arch> <reference|solve|export>` (wing: crop of the whole-car runs;
  splitter: 2-D nose section; front corners: 3-D, solids in corner.mjs) → stops/<slug>/cfd/<part>/, run records in
  tools/cfd/results/ (checked in); volume.mjs reads raw runs. The Sketchfab mesh evo2.glb is CC BY-NC and stays local,
  git-ignored) · `docs/TOUR-POC.md` (model maths §6), `docs/research.md`
- `vendor/three/` is generated by `npm run vendor -- <version>`: never read or edit it.

## Conventions
- Vehicle frame: mm in configs, metres in the scene; x forward, y left, z up; origin per car in `frame.origin`. z = 0 is
  axle height for the first six cars, the ground for the rest: each car.js header says which.
- Camber − = top inboard · toe + = toe-in · travel + = bump · steer + = left.
- Colours only through CSS tokens (`stage.bind`, `stage.tokenMat`, `var(--…)` in SVG): never hard-code theme colours.
  `--band`/`--card` are the fixed-black areas (header bar, index hero, stop cards) and stay dark in both themes.
- Illustrative numbers get a comment in car.js and a line in `unverified` (the page shows it). Sources go in `sources`.
- Panel DOM is built with textContent only; widget ids must be unique within a component.
- English is the source; Hungarian and German are complete and tested (a new language: `LANGS` in i18n.js and lang.js, a
  button in each page's `.langs`, i18n/<lang>.js, stops/<slug>/<lang>.js; tests take it from `LANGS`). UI text: `t("English literal", ...args)` with `{0}` placeholders
  (never a variable or template as the key; whole phrases, as Hungarian case endings differ), static HTML: `data-i18n`.
  Logic never compares displayed text: keep English keys/ids and map them to `t(...)` for display. Readout numbers pass
  through `num` (decimal comma). Car text: `stops/<slug>/hu.js` and `de.js`, car.js's shape with only the text fields (list in
  tests/unit/helpers.mjs `TEXT`), null keeps the original; sources and credits stay untranslated.

## Contracts
- car.js: `{ slug, title, name, year, summary, question?, eyebrow, lede, look?, takeaway?, frame?, ride?, orbit?, sun?,
  body?: { ghost }, photo?: { …, caption? }, components: [{ id, label, subsystem, view: { pos, target }, ghost?: { fill, edge },
  params, talk, prompt?, answer?, more?, real? }], note, unverified, sources }`. `question` replaces the summary on the index
  card; `look`/`takeaway` open and close the story at the car; a component with `prompt` shows prompt → key controls →
  `answer`, and `more` names the disclosure holding the detail widgets and the facts (piloted on 300sl, slk, 540k). `real:
  { src: "parts/<x>.jpg", w, h, alt, caption, credit }` shows the part in real life after the answer, only where the
  exhibit hides it (under the body or bonnet): any car's, ~800 px wide, free licence, caption saying whose it is.
- Subsystem: `export function create(ctx, params)` with ctx `{ stage, carRoot, frame, ride, panel, reducedMotion, t }`, returns
  `{ layout({ active, onPhoto }), update(dt, { onPhoto }) }`. lib/app/viewer.js owns photo view, outline, ghost body and
  the loop (the story's step at the reading line chooses what it shows; a car without a photo shows its model), and
  resets carRoot's pose each frame before calling the active component's `update`.

## Recipes
- Add a stop: entry in `stops/tour.js` + `stops/<slug>/car.js` (copy the closest sibling). Photo (every stop has one): 1200 px
  wide, CC licence with credit, camera fitted with `node tools/fit-photo-camera.mjs tools/photo-fits/<slug>.json` (wheel
  centres and tyre bottoms first; `focalPrior` when the points are nearly flat). Trace `body.ghost` from the photo so Car
  outline lines up. Subsystems fade their own opaque wheels and keep the body still when `onPhoto`. Tests find it via tour.js.
  Add `stops/<slug>/hu.js` and `de.js` (npm test lists missing text fields) and, for a new room, its name in both
  `lib/app/i18n/` catalogs.
- Add a mechanism: `lib/model/<x>.js` + `tests/unit/<x>.test.mjs` first, then `subsystems/<x>.js`.
- Wind tunnel for an aero stop (every aero stop has one; Blitzen-Benz is the worked example; a shape may carry its own `profile`):
  find a near-square side photo (Commons) → `tools/photo-fits/<slug>-side.json` (wheel hubs, tyre tops/bottoms/fronts/rears;
  `focalPrior` as the points are coplanar) → read outline pixels off `node tools/photo-grid.mjs <photo> <out.png> x0 y0 x1 y1
  3 10` → `tools/profile-traces/<slug>.json` (each group on its plane y) → `node tools/trace-profile.mjs` → clean up into
  `body.ghost` (silhouette) and the aero component's `flow.profile` (centre-plane section: round sharp noses, which separate
  at this low Reynolds number; add a driver for open cars) → check both with `photo-grid --overlay` on the stop photo →
  `npm test` (flow tests run every `flow` config for stability). Keep the tunnel near 16k cells (iPhone budget).
- Upgrade three.js: `npm run vendor -- <version>` (a release at least two weeks old), then `npm test && npm run e2e`.

## Commands
- `npm test` unit tests (models, configs, translations) · `npm run e2e` Playwright: WebKit iPhone/iPad × 4 (Hungarian and German
  passes on iPhone only) and Chromium offline (builds first)
- `npm run serve` dev server on :8765 (tools/serve.py: Cache-Control no-cache, so edits show on a plain reload; service
  worker off on localhost unless `?sw=1`) · `?debug` exposes `window.__tour`
- `npm run build` → `_site/` · deploy: push to main; `.github/workflows/pages.yml` tests, then deploys.

## Real-device checklist (iPhone and iPad Safari, from the Pages URL)
Portrait and landscape · light and dark · EN/HU/DE switch · stop pages and teaser: each stage stays pinned while its steps scroll · orbit, pinch, sliders · photo overlay lines up with Car outline on · airplane mode
after one visit: index → every stop · Add to Home Screen, launch offline · iPad Split View · Low Power Mode still animates at
true speed · Web Inspector over USB shows no errors. LAN (`http://<mac-ip>:8765`) checks layout only: service workers need HTTPS.

## Open
- Confirm on site: rooms and levels in tour.js (Collection 4 on level 4 is a guess; the 220 S stands in Legend 5 beside the 300 measuring car, per a 2022 museum text); which 540 K
  is shown (Cabriolet B photo vs the 1938 Streamliner); which W 111 variant (the 2013 photo is a 1964 220 S); whether the
  Victoria stop's car is the Vis-à-Vis of the photo; whether the Popemobile has diff locks.
- The 260 D photo fit rests on both right road wheels (the rear one dark), the lamps and an estimated roof height (RMS 20 px);
  its outline is traced (tools/profile-traces/260d.json); the boot end is hidden in the photo. Also approximate: the
  Marie motorboat (no wheels: hull ends and propeller, assumed hull heights) and the W 196 R (wheel points nearly in a
  line, focal length pinned near 650 px). The hoist on the 1624 transporter is one plausible layout: the museum names
  the principle (central hydraulics, cables, pulley blocks) but not cylinders, sizes or heights.
- Still unsourced: 260 D compression ratio (20.5 : 1), Simplex gear count and ratios, Blitzen-Benz valve gear, Marie's
  bore and stroke (the 1886 motor-carriage engine assumed), OM 57 compression ratio, Blue Wonder and W 196 R drag figures,
  Milnes-Daimler gearing.
- Rooms to confirm for the stops added from docs/research.md: L 6500, Blue Wonder and 1624 in Collection 2 (research:
  L 6500 in Legend 3); Milnes-Daimler bus in Collection 1 (a Daimler Truck release says so; research: Legend 2); 190 SL in
  Collection 4, the Gallery of Names (research: Legend 4; since 2017 it is astronaut David Scott's 1959 car, while the
  2013 photo shows the car before it); 500 SLC and W 196 R in Legend 7. Bus year 1907 (museum sources) vs 1904 (research).
  Whether the Reitwagen replica is on show or on loan; whether the 500 SLC is the 1980 Bandama winner. The O 302 is a
  replica of the 1974 team bus (Daimler Truck, 2022), whose photos show it in Collection 4; tour.js keeps Collection 1
  with `check: "room"`.
- Stops added from research_pt2.md (20): rooms follow its galleries (buses Collection 1, lorries 2, helpers 3, celebrities
  4) and eras; all to confirm on site, as is Collection 3 on level 5. All have their photo (fetched through Chrome after
  scripted downloads met HTTP 429). Fits rest on the near wheels plus assumed lamp, star and plate positions (each fit's
  `frame` says which): RMS 5–34 px; roughest the Ponton, 300, 600, LO 1112, the A-Class (a tilted phone photo, kept
  portrait so its principal point stays central). The Daimler carriage is seen from the front right (its near axle is
  the front one; an earlier fit had the axles swapped and the outline turned): RMS 14 px. Their `body.ghost`
  outlines are still sketched, not traced: wheels line up on the photos, bodies only roughly (trace per the recipe); the
  SLK's is traced (tools/profile-traces/slk.json). Photos not from the museum floor: SLS (outside the museum), G-Class
  “Otto” (the 2019–20 G-Class exhibition), SLK (a public-domain street photo: no free photo of the museum's SLK was found
  on Commons or Flickr CC, Nov 2026; the yellow SLK 230 of the 2025 Youngtimer exhibition is on all-rights-reserved
  Flickr photos only). The Ponton stop shows a 1955 180 (research names the 220); the R 129 of Legend 6 is told with Princess
  Diana's 500 SL; the 540 K Streamliner is the existing 540k stop. Illustrative throughout: LP 333 axle spacings, Unimog
  portal sizes, O 302 heat balance, 600 hydraulic sizes, ABS and rollover parameters (each car.js `unverified`).
- Wind-tunnel sections: Blitzen-Benz is traced. Approximate: 540 K Cabriolet B and Blue Wonder (ghost outlines plus a few
  centre-line points on 3/4 photos); sketched: the 540 K Streamliner, the racing car on the Blue Wonder's deck and the boxy
  truck. A side photo per the recipe would firm them up.
- Airflow close-ups (race-aero; Evo II wing, splitter, wheel arch; W 196 R front wheel): for understanding, not engineering.
  An expert review (research_notes/Museum airflow claim review/) set the rules: claim a sign only when, per grid, the 95 %
  interval over one-flow-through batches lies on one side of zero, the same side on both grids, and a larger tunnel moves
  it less than the effect (`gate` in part.mjs; records in tools/cfd/results/). Wing: a crop of the archived whole-car runs;
  only the change is claimed (the flap tips the air up by about 13° and 8° on the two grids; the angles themselves depend
  on the box). Splitter: display only. Its face samples sit ahead of the retracted lip, and the short 2-D tunnel (body
  through the outlet, ~25 % blockage, inlet fixing ρ and u) has a floating pressure level and a slowly filling underbody
  channel; a load sign needs a velocity inlet with free density, a pressure outlet, a sponge, a finite section whose flows
  rejoin, and force summed on the wetted faces (open). Corners: still tyres 48 mm above the road. W 196 R: the claim is the
  wake behind the bare tyre; the streamliner's body fills that patch, and the air beside the car does not settle (the
  enclosed body runs out through the outlet). Evo arch: one state, a path of the mean flow, not attributed to the flare.
- Stops added from reports/Missing museum tour cars.md: W12 (pit stop; hangs on the wall behind the pit-stop rig, Legend 7),
  SLS AMG Electric Drive (Legend 6), NECAR 1 (`check: "room"`: photographed in the museum, room not named), C 9 (Legend 7),
  W11 (`check: "room"`: placed in Legend 7 in December 2024), W 125 record car (Legend 7, the banked curve), and the 300
  measuring car as a step of the 220 S. Photos: W12 and W11 are race and test photos, not the museum floor. Fits RMS 4–28 px
  (roughest the W 125, whose wheels hide in fairings, and NECAR, which rests on assumed lamp, star and roof corners: front
  overhang ~1,150, rear ~590 read off the photo); outlines sketched. Illustrative: W12 phase times, SLS ED weight split,
  tyre stiffness and regen limit, C 9 qualifying boost and turbo efficiencies, NECAR cell curve, W 125 heat load and ice
  mass, W11 toe angles and linkage, measuring-car sensor and recorder. Left out: MP4-13, W07, T 80.
- Not added from docs/research.md: the Vision R 320 CDI (its exhibition has ended) and the Vision Mercedes-Maybach 6
  (never shown at the museum).
- The original single-file PoC pages are in git history at commit 468cc29 (`museum-tour-poc/`).
