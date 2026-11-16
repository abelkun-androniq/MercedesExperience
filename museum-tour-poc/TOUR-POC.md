# Mercedes-Benz Museum technical tour — proof of concept and handoff

This is the handoff document from the proof-of-concept session. It is written so a Claude Code CLI session can start planning and building visualisations for more cars without the original conversation. Read it top to bottom once. After that, §6 (models), §7 (photo overlay) and §11 (backlog) are the working sections.

**Suggested first prompt for the CLI session:**
> Read `TOUR-POC.md` and the two pages in `poc/`. Then plan the move to a GitHub Pages repo with shared modules (§9, §10), and propose the next three cars and their subsystems from §8. Don't write code until I approve the plan.

---

## 1. Goal and audience

- **Who:** a vehicle engineer guiding a small group of friends, all car people, through the Mercedes-Benz Museum in Stuttgart. The engineer is the "technical guy" and explains mechanisms at the cars.
- **What:** at selected cars, a phone shows the mechanism *working*. Ideally it's placed over a photo of that same exhibit, so people can see where the part sits under the bodywork.
- **Format decided so far:** printed cards with a QR code, one static web page per stop, and no app to install. AR is optional and comes later.
- **Constraints:**
  - It has to work on friends' iPhones in Safari.
  - Mobile signal in the building may be patchy, so the pages should work offline after one visit.
  - Exhibits rotate, so check which cars are on display before finalising stops.

## 2. Decisions made and why

| Decision | Reason |
|---|---|
| Web pages + QR cards rather than a native AR app | Nothing to install. Works on any phone. Covers about 80 % of the effect for about 10 % of the effort. |
| No live AR registration onto the real car | Museum cars sit behind barriers, with reflective paint, dim light and crowds. ARKit object detection and Vuforia Model Targets are fragile there. |
| Fitted **museum photo overlay** instead | Gives the "X-ray of this exact car" effect reliably. It uses a public CC BY photo of the actual exhibit and a camera fitted to it (§7). |
| Mechanisms **simulated**, not keyframed | Suspension is solved from link lengths and driven by a quarter-car model. Engine and blower are kinematic. The numbers on screen (camber, toe, load, boost) are consistent and can be explained at the car. |
| Mechanisms built in code from hardpoints, not from downloaded CAD | Free CAD of the exact Mercedes parts mostly doesn't exist (§8). Simple rods, arms and rotors read better at phone size than dense CAD meshes. |
| three.js 0.128.0, plain `<script>` tags, single HTML file per car | Simplest thing that runs as a Claude artifact. Needs restructuring for scale (§10). |
| Optional later: tabletop AR through `<model-viewer>` + USDZ / AR Quick Look | Puts the model on the floor or on the card next to the car. No app needed. Animations must be baked. |

## 3. What's in this folder

```
TOUR-POC.md                     ← this document
poc/190e.html                   ← PoC page 1: 190 E (W201): five-link rear axle + M102 engine
poc/540k.html                   ← PoC page 2: 540 K: double-wishbone front suspension + Roots supercharger
poc/photo-190e.jpg              ← museum photo (Valder137, CC BY 2.0), 1200×803
poc/photo-540k.jpg              ← museum photo (Valder137, CC BY 2.0), 1200×803
tools/fit-photo-camera.mjs      ← camera fit from 3D↔2D correspondences (Node, no dependencies)
tools/photo-fits/190e.json      ← correspondences that reproduce the 190 page's PHOTO_CAM exactly
tools/photo-fits/540k.json      ← correspondences that reproduce the 540 K page's PHOTO_CAM exactly
```

The pages were published as private Claude artifacts during the PoC:
- [Raumlenker Axle Teaser](https://claude.ai/artifact/ERQry8rBTyEdQtmEBt8foT) (190, version 3)
- [540 K Kompressor Teaser](https://claude.ai/artifact/CetupK8W348SCu7oKq1obp)

The files here are the same source. To view them locally:

```bash
python3 -m http.server 8765
```

Then open `http://localhost:8765/poc/540k.html`.

## 4. The two PoC pages

Both pages have the same layout:
- A hero headline.
- Two segmented switches: **Component** (subsystem A / B) and **View** (3D model / museum photo).
- A large WebGL stage with orbit controls.
- A side panel per component with live readouts, a trace or diagram, buttons and a "What to say at the car" list.
- The proposed tour workflow at the bottom.

### 4.1 Mercedes-Benz 190 E (W201), 1984 — `poc/190e.html`
**A. Five-link rear axle ("Raumlenker").** Shown on the left rear wheel.
- The car's ghost outline drives at 25 km/h, shown 5× slower, over a 40 mm bump and then a 30 mm pothole.
- The front axle hits each one first, then the rear, so the body pitches.
- A contact patch under each tyre scales with load and turns red when the load is light.
- Readouts: travel, tyre load (% of static), camber, toe.
- A 6 s trace shows travel and load.
- Behaviour:
  - At +80 mm bump: camber −1.36°, toe +0.53° in.
  - At −80 mm: camber +0.53°, toe +0.90°.
  - Over the loop, load peaks at about 240 %. In the pothole the rear wheel briefly reaches 0 % load and leaves the road.

**B. M102 four-cylinder.**
- Moving parts: crank, conrods, pistons, an overhead camshaft at half speed, and valves lifting in time.
- Each combustion chamber is coloured by stroke, and the power stroke flashes. Firing order is 1-3-4-2.
- The block leans 15°. *Unverified, check before quoting.*
- Dimensions: bore × stroke 89 × 80.25 mm, conrod about 136 mm (plausible value).
- There's a speed slider and a row of labels showing each cylinder's stroke.

**Talking points on the page:**
- Five rods, each loaded mostly along its own axis, locate the carrier. The 190 was the first series car with this axle, in 1982.
- The load trace: grip comes from tyre load, so a flat line is the goal.
- Sprung vs. unsprung mass: the body barely moves while the wheel does the work.
- M102: one power stroke every 180° of crank. The block leans to fit under the low bonnet.

### 4.2 Mercedes-Benz 540 K (W 29), 1936–40 — `poc/540k.html`
**A. Front suspension: double wishbones and coil springs.** Shown on the left front wheel.
- The same road run as the 190.
- Readouts: travel, load, camber, and **track change** (lateral scrub at the contact patch).
- Behaviour: camber about −0.9° at +80 mm. The track changes by about −15 mm at −80 mm.
- Over the loop: travel from −28 to +36 mm, load from 0 to 210 %.

**B. Roots supercharger, engaged by a clutch.**
- Pedal slider. "Auto demo" runs a 10 s cycle with the pedal floored from 3.8 to 7.5 s. "Floor it" sets the pedal to full.
- At ≥ 98 % pedal:
  - the crank-nose multi-plate clutch closes;
  - the rotors spin up;
  - the atmospheric inlet flap shuts;
  - air particles switch from blue (bypass, through the flap into the carburettor) to orange (filter → blower → carburettor → manifold → 8 runners).
- Readouts: rotor speed (× crank), boost, full-load power (115 → 180 PS), and a boost meter.
- A 2D SVG shows the rotors from the end, with the air pockets carried round the outside of the casing.

**Talking points on the page:**
- K = Kompressor. The engine makes 115 PS on its own and 180 PS with the blower.
- The blower is only engaged at full pedal and is meant for short bursts.
- Air is blown *through* the carburettor; mixture is not sucked through the blower.
- A Roots blower doesn't compress internally: the lobes carry pockets of air to the outlet.
- In 1933 most cars still had a beam front axle on leaf springs. The 380 had parallel wishbones with coils, and the 500 K and 540 K kept them.
- Near-parallel arms keep camber almost constant but scrub the track.

## 5. Page anatomy (the pattern to reuse)

Each page is one HTML file:
- inline CSS;
- three.js r128 and `examples/js/controls/OrbitControls.js` from jsDelivr;
- a "model" `<script>` with pure functions;
- a "scene" `<script>` IIFE.

**Model script.** Contains no three.js and is fenced with comments, so it can be extracted and tested in Node:
- `// SOLVER START … // SOLVER END`: suspension closure.
- `// QUARTER-CAR START … // QUARTER-CAR END`: ride model and road profile.
- `// BLOWER START … // BLOWER END` (540 K only).

**Scene IIFE.** In order:
- renderer and cameras: `VIEWS` (orbit presets per component) and `PHOTO_CAM` (§7);
- geometry helpers: `rod(m, r)`, `place(o, a, b)` to stretch a unit cylinder between two points, `ball`, `tyre`/`wireWheel`, `helix` for coil springs, `edgesOf` for the ghost body;
- builders per subsystem: `buildSide(mirror)`, `poseAxle`/`poseSusp(travelMm)`, `poseEngine(theta)`, `poseBlower(dt)`;
- `applyColors()`, which reads CSS tokens so light and dark themes both work;
- `drawTrace()`;
- `stepRoad(realDt)`, a fixed-step integrator at DT = 0.0005 s;
- `refreshLayout()`, which shows or hides panels for the component and view;
- `frameUpdate(now)` inside a requestAnimationFrame loop.

**Conventions:**
- Vehicle frame in **mm**: x forward, y left, z up.
  - 190: origin at the **rear axle centre**, at wheel-centre height.
  - 540 K: origin at the **front axle centre**.
  - Scene units are metres (`mm()` converts), with `camera.up = (0,0,1)`.
- Sign conventions:
  - camber negative = top of wheel inboard;
  - toe positive = toe-in;
  - travel positive = bump.
- Colours are CSS custom properties on `:root`, redefined for dark mode. Link and part colours are `--l1 … --l5`; `--metal` and `--accent` are used too. Never hard-code hex values in the scene.
- `state` holds the UI state: component, view, play flags, outline, pedal and auto.
- The photo view renders with `photoCam` over an `<img>` with a transparent canvas. "Car outline" toggles the ghost body there.
- Debug hook: `window.__k` on the 540 K page. Remove it or put it behind a flag for production.

## 6. Models and math

### 6.1 Multi-link suspension closure (both cars)
- The unknowns are the carrier pose q = [tx, ty, tz, rx, ry, rz]: a translation in mm plus a rotation vector, Rodrigues `rotm`.
- Each link has a body point **b** and a carrier point **c** (stored as `cl`, relative to wheel centre W0) and a fixed length² `len2`.
- There are 6 residuals:
  - 5 residuals of the form |W0 + t + R·cl − b|² − len2;
  - 1 residual that prescribes the wheel-centre z: tz − s.
- The system is solved with Newton–Raphson using a finite-difference Jacobian and Gaussian elimination with partial pivoting (`gauss`). Each solve is warm-started from the previous pose. It closes to below 1e-10 over ±80 mm.
- A double wishbone is the same 5-link problem: each wishbone counts as 2 legs that share a ball joint, plus the track rod.
- `angles(q)` gives camber and toe from the rotated spin axis. On the 540 K it also gives the contact-point y shift (track change).
- **Hardpoints are illustrative.** They were tuned so the behaviour has the right *sign and magnitude*.

190 hardpoints (left rear, W0 = [0, 720, 0]):

| Link | body b | carrier c |
|---|---|---|
| Camber strut | [-80, 330, 150] | [-50, 640, 150] |
| Pull strut | [230, 380, 170] | [50, 640, 140] |
| Push strut | [280, 350, -60] | [70, 655, -95] |
| Spring link | [-30, 300, -90] | [-20, 665, -115] |
| Track rod | [-280, 240, -25] | [-160, 650, -35] |

540 K hardpoints (left front, W0 = [0, 757, 0], wheel radius 380):

| Link | body b | carrier c |
|---|---|---|
| Lower wishbone, front leg | [170, 330, -140] | [0, 640, -150] |
| Lower wishbone, rear leg | [-170, 330, -140] | [0, 640, -150] |
| Upper wishbone, front leg | [150, 345, 160] | [0, 630, 165] |
| Upper wishbone, rear leg | [-150, 345, 160] | [0, 630, 165] |
| Track rod | [-160, 335, -30] | [-150, 640, -35] |

**Bug fixed during the PoC:** camber had the wrong sign on both pages. After the fix, the 190 axle showed positive camber in bump, so its camber strut and track rod hardpoints were moved. If you add a car, test the sign: at +80 mm bump a typical road car should show negative camber.

### 6.2 Quarter-car ride model (both cars)
- One corner per axle, in SI units, with displacements measured from static equilibrium.
- States: zs, vs (sprung) and zu, vu (unsprung).
- Spring and damper force: fs = ks(zs−zu) + cs(vs−vu).
- Tyre force: ft = max(kt(zr−zu), −F_static). The tyre can push but never pull, so it can leave the road.
- Integrated with semi-implicit Euler at dt = 0.0005 s. Load = F_static + ft.
- Parameters:
  - 190: ms 300, mu 40, ks 24 000, cs 1 700, kt 190 000.
  - 540 K: ms 450, mu 65, ks 30 000, cs 2 000, kt 200 000.
  - Both are plausible values, not factory data.
- Road profile on a 24 m loop:
  - a 40 mm cosine bump at s = 4–4.5 m;
  - a 30 mm cosine pothole at s = 14–14.7 m.
- Speed is 25 km/h, slow motion is 0.2. The rear axle sees the profile delayed by the wheelbase (2665 mm for the 190, 3290 mm for the 540 K).
- Travel feeds the solver directly as the prescribed wheel-centre z.

### 6.3 M102 engine kinematics (190)
- Piston position: s = r cos α + √(l² − r² sin² α).
- Throws: cylinders 1 and 4 share a throw; 2 and 3 are opposite.
- Firing offsets are `OFFSET = [0, 3, 1, 2]` × 180°, which gives firing order 1-3-4-2.
- The four-stroke phase runs over 4π. The cam runs at θ/2.
- Valve lift is a sine bump over each opening window.
- Chamber colour by stroke: Power `--l1`, Exhaust `--metal`, Intake `--l4`, Compression `--l2`.

### 6.4 Supercharger (540 K)
- `BLOWER = { ratio 2.6, engageAt 0.98, tauUp 0.25 s, tauDown 0.7 s, boostMax 0.5 bar, psAtmo 115, psBoost 180 }`.
- Spin follows a first-order lag towards 1 when engaged and 0 when not.
- boost = boostMax·spin² and power = 115 + 65·spin². Both are *illustrative*.
- Rotor profile in the end view: r(φ) = c + e·sign(cos 2φ)·|cos 2φ|^0.55, with c = 0.05 and e = 0.024 (two lobes). The rotors counter-rotate with phases −A and π/2 + A.
- Air particles move along polylines by arc length.
  - Blower route: filter → bottom inlet → around the outside of each rotor → top outlet → carburettor → plenum → manifold → runner i.
  - Bypass route: through the flap → carburettor.

## 7. Museum photo overlay pipeline

1. **Pick a photo** of the actual exhibit with a usable licence. Wikimedia Commons user Valder137 shot many museum cars from a consistent front-left angle (CC BY 2.0). Save it at 1200 px wide.
2. **Estimate vehicle dimensions** in the car's frame: wheelbase, track, tyre radius, overall length, roof or windscreen height. Published spec sheets are good enough.
3. **Mark 9–12 correspondences**, each a 3D point in mm and its pixel position.
   - Best points: wheel centres, tyre bottoms and tops (these have the highest weight), the mascot or star, roof or windscreen corners, the A-pillar base, a bumper corner or lamp.
   - Spread them across the image and in depth.
4. **Run the fit:**
   ```bash
   node tools/fit-photo-camera.mjs tools/photo-fits/<car>.json
   ```
   - It solves for 7 parameters (camera position in mm, yaw, pitch, roll, focal length in px) with Levenberg–Marquardt. There's no lens distortion, and the principal point is the image centre.
   - It runs several starting positions (`seeds` × `focalSeeds`, aimed at `aimAt`).
   - The output is a `PHOTO_CAM` line to paste into the page, plus the residual for each point.
   - With few points, `rollPenalty` keeps the horizon level.
5. **Sanity-check the result:**
   - The camera height above `groundZ` should be 1.5–2.1 m.
   - The vertical field of view should be about 25–35°.
   - Then toggle "Car outline" in the page.
   - Results so far:
     - 190: camera about 1.6 m, field of view 27.3°, RMS 36 px.
     - 540 K: camera about 2.1 m, field of view 33.8°. Wheels within about 3 px, unweighted RMS 34 px. The body residuals are large because the body dimensions are estimates.
6. **Check the overlay where it matters,** at the subsystem. The front wheel area on the 540 K matched within about 15 px.

The two JSON files in `tools/photo-fits/` reproduce the cameras in the pages exactly. Use them as templates.

## 8. Car shortlist and free CAD coverage (researched in the PoC)

Free **body** models exist for all of these on Sketchfab under CC licences. Free models of the actual Mercedes **mechanisms** mostly don't exist. Generic stand-ins (GrabCAD) or building them from hardpoints in code are the realistic options.

| Car | Story | Body model | Mechanism stand-ins | Coverage |
|---|---|---|---|---|
| Benz Patent-Motorwagen (1886) | Single cylinder, horizontal flywheel, evaporative cooling, trembler-coil ignition | [Deutsches Museum scan-based, CC BY-SA](https://sketchfab.com/3d-models/47df0cb894a34d33a09361f3cb182070), [CC BY alt](https://sketchfab.com/3d-models/cf06fdb669bf4561b5e035f6221fa9e2) | [Single-cylinder IC engine](https://grabcad.com/library/single-cylinder-ic-engine), [four-stroke 572cc](https://grabcad.com/library/four-stroke-single-cylinder-572cc-engine) | ★★★★ |
| 300 SL Gullwing (W198) | Tube spaceframe → gullwing doors; Bosch mechanical direct injection; dry sump; engine canted about 50°; swing axles | [Lexyc16](https://sketchfab.com/3d-models/505241c829c540a4921533000736904e), [heynic/vecarz](https://sketchfab.com/3d-models/65edd5814c9842bb9c769388d13fa27f), [outpiston (NC)](https://sketchfab.com/3d-models/0cd238989fb04ea58beb25552a4cdb95) | No free spaceframe. Build it from tube paths. [FSAE frame](https://grabcad.com/library/fsae-space-frame-chassis-1) as a concept stand-in | ★★★ |
| W196 R (1954–55) | Straight eight, desmodromic valves, direct injection | [W196 CC BY](https://sketchfab.com/3d-models/bc9f149fce8d449a988e5039f4da97cd), [300 SLR](https://sketchfab.com/3d-models/c3764c6180494272b137748f11075fd6) | [Buick straight-8 crank](https://grabcad.com/library/1937-buick-straight-8-engine), [desmo valve set](https://grabcad.com/library/motor-cycle-engine-internal-setup-desmodromic-valve-system-piston-cam-shaft-assembly-1) | ★★★★ |
| 190 (W201) ✅ PoC | Five-link rear axle | [W201 CC BY](https://sketchfab.com/3d-models/9b2ea34482654173a7f421aab8f1b287), [front chassis scan](https://sketchfab.com/3d-models/a99a158c513d44c9a02cadc4a318fddd) | [W202-derived multilink front](https://grabcad.com/library/gswing-multilink-dgp-front-suspension-1). No free 5-link rear, so it was built in code | ★★ |
| F1 W05 Hybrid (2014) | Turbo-hybrid PU, MGU-H/MGU-K, pushrod double wishbones | [W05 CC BY](https://sketchfab.com/3d-models/4a6e8e56d3554a339ea2ce0860bf08e9) | [MGU-H](https://grabcad.com/library/mgu-h-model-motor-generator-unit-heat-f1-1), [pushrod DW](https://grabcad.com/library/pushrod-suspention-system-double-wishbone-suspension-sustem-1), [Formula E pushrod CC BY](https://sketchfab.com/3d-models/52149ab2d93548e2a06ae60b888ac66f) | ★★★★ |
| 540 K ✅ PoC | Wishbone front suspension, clutch-engaged Roots blower | Not researched yet (none used; ghost body is hand-built) | Built in code | — |

Other strong candidates from the brainstorm:
- W125 De Dion rear axle;
- W111 "Fintail" crumple zone (Barényi);
- W116 ABS (1978) and the 1981 airbag;
- A-Class elk test → ESP (1997);
- 450 SEL 6.9 hydropneumatics;
- W220 Active Body Control;
- W222 Magic Body Control road-scanning camera.

The suspension and chassis ones reuse §6.1 and §6.2 directly.

**Licences:**
- Sketchfab: follow the CC licence on each model and credit the author on the card and the page.
- GrabCAD models fall under GrabCAD's terms. They're fine for private use, but don't redistribute the files in a public repo.

## 9. Hosting: GitHub Pages

- The pages are static, so GitHub Pages works.
- **A Pages site from a private repo needs GitHub Pro** (or Team/Enterprise). Even then, **the site itself is public**; only the source stays private. Access-controlled Pages sites require Enterprise Cloud.
- An unlisted public URL is acceptable here. The photos are CC BY 2.0 with credit on the image.

**Porting checklist from the artifact version:**
- [ ] Add `<!doctype html><html lang="en"><head>…</head><body>`. Artifacts were wrapped automatically, so the pages start at `<meta charset>`.
- [ ] Add `<meta name="viewport" content="width=device-width, initial-scale=1">` to the 190 page. The 540 K page already has it.
- [ ] Remove `<meta name="claude:viewport-fit-sides">`. Keep the `env(safe-area-inset-*)` padding.
- [ ] **Vendor three.js**: copy `three.min.js` and `examples/js/controls/OrbitControls.js` at exactly 0.128.0 into `vendor/`, so the site doesn't depend on jsDelivr. Note that the `examples/js` globals were removed in r148. Upgrading means switching to ES modules and import maps; decide that in planning.
- [ ] Decide on the Google Fonts (Archivo, IBM Plex Sans/Mono): self-host them, or drop them and use the system font stacks already in the CSS. They're an outside dependency, and loading them sends visitors' requests to Google.
- [ ] Add a service worker that precaches every page, photo and vendor file, so the site works offline after one visit. Version the cache name.
- [ ] Add an `index.html` with a menu of stops (one QR code can point there) plus one QR code per stop page.
- [ ] Remove the `window.__k` debug hook, or put it behind `?debug`.
- [ ] Test on a real iPhone (Safari), in portrait and landscape, light and dark mode, and in airplane mode after the first visit.

Deploy with Settings → Pages → *Deploy from a branch* → `main` / root. The URL is `https://<user>.github.io/<repo>/`.

## 10. Proposed structure for scaling to more cars

This is a suggestion; the planning session decides. The two pages share about 70 % of their code. Pull out what's shared before adding a third car:

```
index.html
cars/<slug>/index.html          ← thin page: markup + car config + subsystem modules
cars/<slug>/photo.jpg
cars/<slug>/car.js              ← dimensions, PHOTO_CAM, VIEWS, ghost-body profile, talking points, credits
lib/kinematics/linkage.js       ← §6.1 solver (pure, Node-testable)
lib/kinematics/quarter-car.js   ← §6.2 + road profile
lib/kinematics/engine.js        ← slider-crank, firing order, valve timing (§6.3)
lib/scene/helpers.js            ← rod/place/ball/helix/tyre/wire wheel/edgesOf/pipe/polyline
lib/scene/stage.js              ← renderer, orbit cam, photo cam, theme tokens → materials, resize, loop
lib/ui/panel.css, lib/ui/controls.js   ← segmented switches, readouts, trace SVG, meters
subsystems/<name>.js            ← e.g. multilink-rear, double-wishbone-front, roots-blower, i4-engine
tools/fit-photo-camera.mjs
tests/*.test.mjs                ← node --test: closure residuals, sign conventions, quarter-car bounds
vendor/three/…
sw.js
```

**Subsystem module contract (suggestion):**
- `build(scene, ctx)` returns `{ pose(state, dt), readouts(), panel }`.
- The car config lists `[subsystemA, subsystemB]` with hardpoints and parameters.
- The page shell provides the Component/View switches, the photo view and the outline toggle.

## 11. Backlog (prioritised)

1. **Repo + hosting baseline:** do the §9 porting checklist with the two existing cars. Get it working offline and test it on a real iPhone.
2. **Extract shared modules** (§10) and add Node tests for the solver closure, camber/toe signs, the bump → negative camber check, and quarter-car load staying ≥ 0.
3. **Confirm the stops**: check the museum's current exhibit list and photo rules. Pick 3–5 more cars from §8.
4. **Next cars.** Suggested, because they reuse the most:
   - 300 SL: spaceframe built from tube paths, and the canted engine.
   - W196 R: desmodromic valve train (kinematic, like §6.3).
   - F1 W05: pushrod double wishbone (§6.1 plus a rocker) and the MGU-H energy-flow animation (like the §6.4 particles).
5. **Printed cards:** front has the car photo and three talking points; back has the QR code and credits. Make an A6 print template.
6. **Optional AR:** `<model-viewer>` with GLB/USDZ exports for tabletop AR Quick Look. Bake the animations in Blender, since USDZ can't run the live solver.
7. **Content accuracy pass:** replace illustrative values with sourced ones where they can be found (hardpoints, blower ratio, boost, M102 lean angle).

## 12. Accuracy: checked vs. illustrative

**Checked against sources (540 K):**
- 115 PS without the blower and 180 PS with it.
- A multi-plate clutch on the crank nose engages the blower at full throttle.
- The normal air inlet closes when the blower engages.
- Air is blown through the carburettor.
- The blower was intended for short bursts (one museum workshop report says about 30 s).
- The 380 of 1933 introduced parallel-wishbone coil-spring front suspension.

Sources:
- [Motor Sport, April 1937](https://www.motorsportmagazine.com/archive/article/april-1937/5/the-worlds-fastest-touring-car-2/)
- [Classic & Sports Car](https://classicandsportscar.com/node/94450)
- [Haynes Museum workshop news](https://www.haynesmuseum.org/news/workshop-news)
- [Wikipedia: Mercedes-Benz 380 (1933)](https://en.wikipedia.org/wiki/Mercedes-Benz_380_(1933))
- [Mercedes-Benz public archive: 380 (W 22)](https://mercedes-benz-publicarchive.com/marsClassic/en/instance/ko/380-W-22-1933---1934.xhtml?oid=4148)

**Well-established, but no source was saved in the PoC (190); cite before printing:**
- W201 introduced the five-link rear axle in 1982.
- The M102 is an inline four with a single overhead cam.
- Firing order 1-3-4-2 is standard for an inline four.

**Illustrative only** (the pages say so):
- all suspension hardpoints and spring, damper and tyre rates;
- the M102 conrod length and block lean;
- the 540 K blower layout, 2.6 drive ratio, 0.5 bar boost and carburettor position;
- the ghost-body outlines;
- the road profile.

## 13. Verification done in the PoC, and gaps

**Done:**
- The solver closes to below 1e-10 over ±80 mm (Node).
- Camber and toe signs and magnitudes were checked numerically after the sign fix.
- Quarter-car load and travel ranges were checked over a full road loop (Node).
- The photo-fit residuals are listed above.
- Desktop and phone-width layouts were checked in a browser, with no horizontal scroll and no console errors.

**Not done:**
- Testing on a real iPhone.
- Offline behaviour (not built yet).
- Watching the 190 animation after the hardpoint change. The browser pane was hidden, so requestAnimationFrame didn't run; it was verified numerically only.
- Performance on older phones.
- Accessibility review beyond keyboard focus styles and `aria-pressed` on toggles.

## 14. Credits

- Photos by [Valder137](https://commons.wikimedia.org/wiki/File:Mercedes-Benz_190E_1984_LSideFront_MBMuse_9June2013_(14797028608).jpg) ([540 K photo](https://commons.wikimedia.org/wiki/File:Mercedes-Benz_540K_1937_Cabriolet_B_LSideFront_MBMuse_9June2013_(14796944000).jpg)), CC BY 2.0, via Wikimedia Commons.
- 3D rendering: [three.js](https://threejs.org) r128 (MIT).
- Mechanism models in the pages are original code built from illustrative hardpoints. No third-party CAD is included.
