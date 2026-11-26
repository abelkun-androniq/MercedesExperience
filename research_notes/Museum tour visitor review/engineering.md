# Engineering, explanation and visual discovery

## Where does the visitor get to reason like an engineer?

### Takeaway

Across the 46 routed stops, 64 component entries use 24 subsystem types. Nineteen entries declare a prompt, 17 an answer and 18 a real-part illustration. These counts measure use of the story template. Some other entries guide the visitor through panel labels or explanatory paragraphs. Counts were obtained by importing every routed English car module at d868721. [Route](../../stops/tour.js) · [Story rendering](../../lib/app/story.js)

### Cited findings

- The 300 SL asks why its doors hinge at the roof. Switching to a low-sided frame reduces calculated stiffness to roughly a third in this model. It turns a feature visitors can see across the room into a structural experiment. [300 SL](../../stops/300sl/car.js)
- The LP 333 already lets visitors steer or fix the second front axle and watch its tyres scrub. Its readouts include turning radius, separate wheel angles and degrees of slip. Its component omits the dedicated prompt and answer fields. [Truck](../../stops/lp333/car.js) · [Controls](../../subsystems/twin-steer.js)

### Inferences

- First copy pass: open the LP 333 experiment with “Hold the first axle at 20°. What happens to the second pair of tyres when you fix them straight?” Follow the experiment with a sentence linking the sideways drag to the wheels' turning centre. Success means a visitor can point to the affected wheels and explain why they scrub.

### Gaps

- A template count cannot establish comprehension. Validate with a first-time visitor before extending prompts across all 64 entries.

## Which claims could visitors misread?

### Takeaway

The tour distinguishes illustrative geometry and calculated results in detailed notes. A visitor who reads only the answer can still leave with more certainty than the model supports.

### Cited findings

- The Evo II wing answer gives about 34 kg of extra rear-axle load at 200 km/h and 9 kW extra drag power. It names the whole-car model, but only later explains that grid refinement changes the size of the effect. The nose and arch experiments already limit their claims to visible flow where stronger comparisons are unavailable. [Evo II wing, nose and arch](../../stops/190e-evo2/car.js)
- The 300 SLR invites visitors to raise rpm until a spring valve floats. A moving cursor ties the lift graph to the mechanism. The answer qualifies the spring threshold as illustrative but says the desmo valve follows at “any speed”; that follows from the model imposing the cam motion on that valve. [Car text](../../stops/300slr/car.js) · [Simulation display](../../subsystems/desmo-valvetrain.js)

### Inferences

- Give the Evo wing's repeatable direction of change first. Put load and power beside the coarse-grid caveat under wind-tunnel details. For the SLR, “The second cam pulls the valve shut throughout the speed range shown” preserves the discovery and bounds the claim.

### Gaps

- This was a source-level review of the teaching sequence. It does not establish the accuracy of historic race-car settings.

## Where is the wow already built?

### Takeaway

Let visitors discover one detail they could tell another person beside the car. Three existing interactions already do that.

### Cited findings

- The 300 SL balance experiment lets visitors step 30° through crank rotation and see how mirrored piston pairs cancel shaking forces. The Evo II wheel-arch tracer follows air starting in line with the tyre as it deflects out past the door. The SLR pairs an animated closing rocker with a tappable real Ducati rocker photo and clearly identifies the donor mechanism. [300 SL balance](../../stops/300sl/car.js) · [Evolution II trace](../../stops/190e-evo2/car.js) · [SLR rocker](../../stops/300slr/car.js) · [Photo swap](../../lib/app/story.js)
- The ready-made three-stop teaser omits the Evo II, the final stop in the full route. [Route and teaser](../../stops/tour.js)

### Inferences

- A low-cost featured link to “Follow the air around a racing tyre” could bring that last-stop reveal to the route entrance. Keep the teaser's three-stop promise intact. For visual polish, use the existing camera/colour pairing to briefly pick out the closing fork in the SLR photo and model when the visitor swaps views. Provide a stationary marker for reduced motion. The check is whether someone can point to the part that closes the valve in both views.

### Gaps

- The proposed highlights and featured link are design ideas. Their effect on task completion needs a visitor test.
