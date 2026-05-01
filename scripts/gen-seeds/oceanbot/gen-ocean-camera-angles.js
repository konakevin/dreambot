#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/ocean_camera_angles.json',
  total: 50,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} CAMERA ANGLE / FRAMING directives for OceanBot's underwater scenes. Each entry is one specific cinematic camera position the renderer must use for that shot. The goal is RADICAL framing variety — break the "straight-on default" trap.

Each entry: 12-22 words. ONE specific camera position + framing instruction.

━━━ ANGLE TYPES (mix broadly across all entries) ━━━
1. **LOOKING UP** — camera at depth pointing toward the surface, subjects silhouetted against god-rays from above
2. **TOP-DOWN / OVERHEAD** — drone-style or surface-aerial pointing straight down, scene sprawling beneath
3. **WORM'S EYE FROM SEAFLOOR** — camera at the sediment looking up across the scene at low angle
4. **EXTREME LOW DUTCH** — camera tilted hard to one side, dramatic asymmetric horizon, subject looming
5. **THROUGH-SOMETHING** — framing through a kelp curtain / coral arch / cave mouth / porthole / ribcage / school of fish / sea-fan canopy in foreground
6. **POV SWIMMING** — first-person diver-style perspective swimming toward subject (no diver visible — just the framing)
7. **SILHOUETTE-AGAINST-LIGHT** — subject as dark silhouette with light source directly behind
8. **DRAMATIC PULL-BACK WIDE** — extreme wide-angle showing massive scale, subject small but central
9. **TIGHT MACRO ON DETAIL** — uncomfortably close on a single texture / eye / scale / surface detail
10. **THREE-QUARTER FRONT** — subject angled toward viewer at 30-45 degrees, dynamic
11. **DEAD SIDE PROFILE** — pure side-view, subject moving across the frame
12. **BEHIND-THE-SUBJECT** — over-the-shoulder of creature/ship, looking at what they see
13. **SPLIT-LEVEL HALF-OVER-HALF-UNDER** — Aquatech-style split-level showing surface above + underwater below
14. **DISTANT HORIZON SILHOUETTE** — subject barely visible at horizon line, atmosphere doing all the work
15. **DRAMATIC FOREGROUND ELEMENT** — strong foreground element (coral, kelp blade, jellyfish, treasure-chest corner) framing the deeper scene
16. **VOLUMETRIC GOD-RAY COMPOSITION** — composition built around shafts of light cutting through the water, subject in beam
17. **EXTREME-LOW THREE-QUARTER REAR** — looking up and back from below + behind the subject
18. **DRONE-CIRCLE PARALLAX** — camera mid-arc around subject, sense of orbital motion
19. **SUBMERGED CRANE-DOWN** — high-angle descending shot, surface fading above
20. **BENEATH-AN-OVERHANG** — camera positioned beneath a kelp cathedral / ice ceiling / cliff overhang looking out

━━━ RULES ━━━
- 12-22 words per entry
- Be SPECIFIC about position + lens + composition — not "underwater shot"
- Feature dramatic perspective tricks: foreshortening, foreground elements, silhouette, god-rays-through-frame
- Mix angles broadly — every entry should be visibly distinct from others
- Reference cinematic vocab where useful: Aquatech split, Dutch angle, drone-arc, POV, three-quarter
- NO instructions about subject ("show a dragon") — angles only

━━━ EXAMPLES (DO NOT REUSE — invent your own) ━━━
- "Worm's-eye view from the seafloor: camera at sand level, scene towering above, god-rays cutting diagonal across the frame"
- "Drone overhead pointing straight down, scene sprawling beneath in concentric layers, subject centered with extreme top-down framing"
- "Looking up from twenty meters depth toward the surface: subjects silhouetted as dark cutouts against turquoise god-ray ceiling"
- "POV-swimming: camera moving forward as if the viewer is approaching the scene, low to mid-water position, subject filling middle-ground"
- "Through a kelp curtain in extreme foreground, blurred fronds framing the deeper scene in razor-sharp focus beyond"
- "Aquatech split-level: top half storm-tossed surface, bottom half placid undersea, horizon line cutting across frame"
- "Extreme low Dutch angle from sea floor, horizon tilted twenty degrees, subject looming massive in upper third"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
