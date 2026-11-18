# Under the skin — a visitor’s review

**8/10 as a museum companion.** At the 300 SL, I could see the open doors in the photograph, cut down the frame for conventional doors, and watch it twist. That experiment gives me a reason to look back at the real car. The harder part is finding the right stop from the gallery floor and knowing which of the moving numbers deserves my attention.

I would fund two changes first. Give visitors a shortcut to the room they are standing in, and put each mechanism’s most revealing experiment beside its first control. The tour already has enough exhibits and engineering detail.

| Part of the visit | Rating | What earns or costs points |
| --- | --- | --- |
| Recognizing the car and finding its stop | 6/10 | All 46 stops have a photo, and the cards are grouped by room. On a 393 × 659 phone viewport, Legend 6 began about 32 screen heights down the index. Looking for “Gullwing” in the English card text found the SLS AMG and missed the 300 SL. |
| Learning from the exhibit | 9/10 | The pinned model stays visible while I change the frame or open the SLK roof. I can test a prediction and see the answer. On the Gullwing, the paragraph connecting the frame to the doors was below the visible screen after I tapped the comparison. |
| Choosing how deeply to explore | 7/10 | One mechanism is enough for a satisfying stop, and 34 of the 46 stops have just one. Even a single mechanism can present controls, units, a legend and several facts before I know what to watch. |
| Using the tour between galleries | 9/10 | English and Hungarian, named previous/next links and offline access make it practical to carry. After “Ready offline” appeared, I disconnected Chromium and opened a previously unvisited Evolution II stop. Its model animated. |

## What to change first

1. **Give the index two useful shortcuts.** Keep “See the route.” Add “Three highlights” beside it, linking to the existing three-car tour, and a return link from the highlights to the full route. At the start of the route, add “Jump to a room” using the 11 existing room headings and their levels. Native fragment links can do the work. Include familiar names such as “300 SL Gullwing” in card text so the browser’s Find command works too. A visitor arriving at Level 3 should be able to go straight to Legend 6 and still see the photo cards that help identify the car. [Route page](../index.html) · [Room order](../stops/tour.js) · [Highlights](../teaser.html)

2. **Give each car one memorable question.** Use the route card to pose it, the photograph to show where to look, and the first mechanism to let the visitor discover the answer. Group the remaining material by the follow-up question it answers. The proposed flow and three worked examples follow below.

3. **Make the first photograph useful immediately.** The shared story currently creates a hidden image and reveals it after the 3D viewer initializes. A rendering failure can therefore leave someone standing at the car with an error message and the identifying photo hidden. Show the existing photo, its credit and the takeaway as soon as the story appears. Keep them readable if 3D fails. Also change the index invitation to “Scroll to see where the mechanism sits” so it describes the gesture the tour actually uses. [Viewer](../lib/app/viewer.js) · [Story layout](../lib/app/story.js)

## How a visitor should move through one car

The current route card often tells the story twice. On the 300 SL, the summary explains the doors and introduces fuel injection, then the blue pill lists “Space frame · Engine.” Both lead to the same page. Inside, the visitor encounters the experiment, five readouts, a colour key and finally the facts that explain the doors. The most useful edit is to move the answer closer to the moment the visitor can see it. [Route cards](../lib/app/index.js) · [Frame controls](../subsystems/space-frame.js)

| Moment | What the visitor sees | What belongs here |
| --- | --- | --- |
| Choosing from the route | Photo, familiar car name, year and one invitation | Use the room heading for location. Make the card one link. For the 300 SL, “Mercedes-Benz 300 SL Gullwing” and “Why do its doors open upwards?” are enough to choose it. Drop the repeated list of mechanisms from the pill. |
| Standing beside the car | The photo and one thing to find on the exhibit | Give the eye a destination. “Look at the high sill beneath the open door. Imagine climbing over it.” Save the explanation for the moment the frame is visible. |
| Trying the mechanism | A short prompt, the existing control and the result it changes | Group by action. Keep a comparison with its outcome, a sequence with its active phase, or an animation with the part to watch. Keep pause or replay within reach. Use a number only when it helps the visitor see the difference. |
| Deciding whether to linger | The consequence in one sentence, followed by a clearly named disclosure | Let someone leave knowing why the feature matters. Someone who wants the evidence can open “Frame loads and stiffness” right there. Keep units, model qualifications and any essential colour key beside the result they explain. |
| Looking back at the exhibit | The existing closing photo, one observation to take back to the car, then the next-stop link | On the Gullwing, come back to the metal the passenger must step over. Keep production history, sources and detailed assumptions available in the background. |

Each moment fits within the existing scroll. On a phone, the test is whether the visitor can see the model respond and understand the result before the next swipe. A detail disclosure belongs inside its mechanism’s step so opening it keeps that mechanism on the stage. [Shared story layout](../lib/app/story.js)

### Three ways to tell the story

**SLK · One mechanism, told as a sequence.** The route card can ask “Where does a steel roof go when you open it?” On the stop photo, draw attention to the join between roof and rear window. At the model, ask “Which moves first, the boot lid or the roof?” Put “Open the roof” beside the phase indicator. As the lid rises and the two roof pieces fold together, the visitor has the answer. End with the space the owner gives up. The folded roof takes up part of the boot. Put the three angle readings and hinge colours under “How the roof folds.” Keep the reference-photo caption at the image. A visitor can enjoy this whole stop without reading an angle. [SLK story](../stops/slk/car.js) · [Roof controls](../subsystems/vario-roof.js)

**300 SL Gullwing · Two mechanisms, joined by the shape of the car.** Give the frame the first experiment and a natural stopping point. The engine earns its own short chapter through a second feature the visitor can see. [300 SL story](../stops/300sl/car.js)

| What appears in the scroll | Proposed visitor-facing content | Where the depth goes |
| --- | --- | --- |
| At the high sill | “What would happen if those tubes were low enough for an ordinary door?” Keep the two frame choices together, with relative stiffness directly underneath. | Under “Frame loads and stiffness,” keep wheel load, twist angle, stiffness in N·m per degree and tube force. |
| Immediately after the comparison | “With the sides cut down, this model keeps about a third of its stiffness. The tall tubes give the real car its high sill, so the doors hinge from the roof.” | Keep the simplified-model qualification with the 35% result. Put the racing-frame history with the background. |
| Moving from door to bonnet | “Now follow the bonnet towards the nose. How did a tall six-cylinder engine fit under that low line?” Show its lean in the existing model. The 45° lean to the left explains the low bonnet. | Under “Fuel injection and engine timing,” group the invitation to watch the spray with slow motion, firing order and crank/cam readings. The visitor who came for the doors can move on after the frame. |

**540 K · Three mechanisms, told as one drive.** Stage the existing chapters in driving order. **Over a bump**, watch the left front wheel rise and the tyre-load trace change. Keep the trace key beside it and tuck the wheel-angle and track-width figures under “Front suspension geometry.” **On the straight**, use “Floor it” and watch the supercharger clutch engage. The clutch state answers when the extra power arrives. Rotor speed and illustrative boost belong together under “Inside the blower.” **At speed**, hold engine power constant and compare the Cabriolet B with the 1938 Streamliner. Keep the body choice and modeled top speed together, with the wind-tunnel fields available under “Where the drag comes from.” Identify the photographed Cabriolet and the Streamliner comparison where the body choice appears. This gives each swipe a reason even for someone unfamiliar with the term *Kompressor*. [540 K story](../stops/540k/car.js) · [Blower controls](../subsystems/roots-blower.js) · [Aerodynamics controls](../subsystems/aero.js)

### Pilot the grouping before editing all 46 stops

Start with these three cars. For each component, an editor should be able to finish the sentence “When I ___, I can see ___, which matters because ___.” Move the existing control, observation and shortest accurate explanation together. Give remaining material a title a curious visitor would actually open. Translate the complete prompts into Hungarian and check their wrapping below the pinned stage. The same content should work on the car’s own page and wherever it appears in the highlights.

Use the existing panels and native disclosures. Opening a detail should preserve the selected setting, current animation state and scroll context. Reuse the live readout in its new position so a measurement updates only once. In the pilot, ask a casual visitor to explain the Gullwing doors with all details closed, then ask an enthusiast to find the twist angle without losing the selected frame. Both paths should feel complete.

## What information is missing?

**For a short visit, the missing information is where to look.** Across the tour, 59 component stories already contain 229 technical talking points. The opening question, one visible feature of the real exhibit, and the consequence for its driver or passenger have more value on the first screen than another specification. Keep generous depth for enthusiasts, especially the comparisons, sources and clearly identified model assumptions.

**For finding a car, visitors need to know how closely the photo and location match.** The SLK already has a photo, but it shows a street car in Washington, D.C. That explanation comes in the background, after the interaction. Put “Reference photo of the same generation” beside the image. For uncertain rooms, put a brief qualifier next to the room name until someone has checked the exhibit on site. Start with Collection 4 and the 220 S. A gallery check here is worth more than drawing a precise floor map from uncertain locations. [SLK photo note](../stops/slk/car.js) · [Open location questions](../AGENTS.md)

## How to decide whether the changes work

- **Try the pilot on the floor.** Ask five first-time visitors to find a car from its room sign, choose a short visit from the home page, then use the Gullwing comparison and explain the door shape in their own words. A proposed pass is four of five completing each task unaided. Watch where they look back at the car and whether anyone who wants the figures can still find them.
- **Compare on the same phone before and after.** On a physical iPhone, repeat cold opens of the route and the Gullwing under the same network conditions. Record time to usable route links, first visible photo and first working control. Compare frame times while orbiting and changing a control on the Blitzen-Benz wind tunnel. Recheck on iPad and with reduced motion, VoiceOver and Hungarian labels. Investigate any repeatable slowdown before rollout.
- **Protect offline use.** The reviewed build packaged about 9.7 MiB of uncompressed assets. The proposed shortcuts and copy can reuse the current photos and models, add zero new media requests, and keep 3D off the index’s rendering path. After “Ready offline,” repeat the room jump, highlights link and an unseen stop in airplane mode. The existing offline test is a starting point. [Build](../tools/build.mjs) · [Offline test](../tests/e2e/offline.spec.mjs)

*Review basis, 18 November 2026.* I reviewed the route and content inventory at revision `59b1e58`, walked the index, Gullwing comparison, SLK roof control, language switch and highlights in iPhone-sized WebKit, and checked offline entry in Chromium. The ratings are editorial judgments. Actual gallery locations, visitor comprehension and physical-device timing still need field checks.
