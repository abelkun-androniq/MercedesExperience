# Mobile visitor experience

## Can I enter the right room?

### Takeaway

The November 18 proposal’s two biggest navigation requests have shipped. A return journey from a stop still loses the selected room.

### Cited findings

- In local WebKit with iPhone 15 emulation (393 × 659 CSS pixels), “Find your room” put the bottom of the room picker at y=366 and the first gallery at y=398. Tapping Legend 6 reached the correct heading in English and Hungarian. The route rendered 46 cards. The highlights opened three named stories. [Index](../../index.html) · [Route rendering](../../lib/app/index.js)
- On a normal stop, the header’s “Tour route” goes to ./, even after entering from Legend 6. A visitor looking for a different car in the same room lands back at the introduction. Browser Back is a workaround for direct arrivals from the route. Link the normal header to the existing room fragment. Keep the highlights return path. [Header](../../stop.html) · [Routing](../../lib/app/shell.js)
- In the picker, Collection 4 looks as certain as every other floor assignment. The room heading only qualifies the level after the visitor jumps. Use the existing level qualification at the decision point until the placement is verified. [Picker and heading](../../lib/app/index.js)

### Inferences

- Validate by starting from a shared SLK stop link and reaching its neighboring gallery cards in one tap.

### Gaps

- Emulation does not establish wayfinding success in Stuttgart.

## Can I operate the exhibit while reading?

### Takeaway

The roof gives visitors a concrete action, visible progression and a way to keep the illustration in view.

### Cited findings

- Opening the SLK roof changed the live state to “Opening” in English and “Nyílik” in Hungarian. The pinned stage was 223 px tall on the phone. Four phases fitted without document overflow in both languages. Hungarian also fitted on a landscape iPad Pro 11 profile (1194 × 834). [Roof controls](../../subsystems/vario-roof.js) · [Story](../../lib/app/story.js)
- The Gullwing’s lower-sill selection survived an English/Hungarian switch in both directions. The corresponding experiment remained selected after reload. This check sampled the immediate post-switch readout before animation had settled, so it does not establish the final stiffness value. [State restoration](../../lib/app/story.js)
- The stage now mounts the identifying photo before loading Three.js. Remaining copy issue: the background step describes the returning image as the “museum photo” for every car, including the explicitly identified SLK reference image. Use “Back at the car” or a neutral “photo” in this shared sentence. [Stage](../../lib/app/viewer.js) · [Shared background copy](../../lib/app/story.js) · [SLK data](../../stops/slk/car.js)

### Inferences

- This fixes specific issues from the prior review. Do not repeat “add room jump”, “show the photo first” or “add three highlights” as new work. [Earlier review](../../docs/visitor-experience-proposal.md)

### Gaps

- Reduced motion was enabled for these scripted walks. There was no physical-device, airplane-mode, VoiceOver or German interaction test in this pass.

## Can I discover the closer look?

### Takeaway

Some part pictures double as a full-size comparison. Its affordance is weakest on touch screens.

### Cited findings

- The real-part photo is a button with a descriptive accessible name and a desktop zoom cursor. Its visible figure caption starts “In real life”. A tap swaps the image and live model. Scrolling the figure away restores the normal arrangement. The existing visible swap instruction is for swapping back. [Story interaction](../../lib/app/story.js) · [Styles](../../lib/app/theme.css)

### Inferences

- Add a small visible “Enlarge part photo” affordance on eligible pictures. In a first-use test, ask someone to inspect the real part closely without first teaching the gesture.

### Gaps

- This discoverability judgment comes from implementation inspection. No observed participant missed the control in this review.
