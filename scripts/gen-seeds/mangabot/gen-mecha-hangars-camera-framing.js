#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/mecha_hangars_camera_framing.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (n) => `Write ${n} CAMERA-FRAMING entries for a MangaBot mecha-hangar keyframe. THIS POOL'S JOB is to enforce LOW-ANGLE HERO framings that keep the MECH at 50-80% of the frame, NEVER tiny in distance.

⚠️ HARD BAN — REJECT INSTANTLY IF: top-down view / wide-establishing landscape / Mt-Fuji-postcard / mech-tiny-in-distance / aerial-overhead-far / "epic-vista with mech in the distance" / portrait-of-pilot-face-only. The mech is the hero; framing must put it BIG in the frame.

Also REJECT: T-pose-favoring framings (dead-front-symmetrical at eye-level). Always prefer angles that read the mech's 3/4 depth + show off the loaded posture.

Each entry: 14-22 words. ONE specific framing. Always describes the camera's RELATIVE POSITION to the mech + how the mech fills the frame.

FRAMING VARIETY (all LOW-ANGLE-or-near, all MECH-FILLS-FRAME):
- LOW-ANGLE HERO at mech-foot (camera near deck, looking UP, mech fills 70% of frame, head touches top-edge)
- 3/4 VIEW at hangar-floor level (mech-torso-center, walls receding behind, three-quarter rotation)
- OVER-CREW-SHOULDER REVEAL (engineers in foreground silhouette, mech mid-frame towering over them)
- THROUGH-COCKPIT-CANOPY POV (looking out from pilot POV, mech-arms visible from inside, hangar beyond)
- BETWEEN MECH-LEGS PERSPECTIVE (hangar interior framing through massive thighs, foreshortened)
- REAR 3/4 OVER MECH'S SHOULDER (hangar interior past the shoulder, mech back-and-3/4 turned)
- KNEELING DOWN-ANGLE (camera at standing-mech-shoulder height, looking DOWN at the kneeling mech's back)
- GANTRY-CATWALK LEVEL (camera on a catwalk at chest-height, mech head + torso filling the frame)
- WORM'S-EYE EXTREME-LOW (camera under the mech's foot looking up, sole + shin filling lower frame)
- PILOT-PERSPECTIVE WIDE-CANOPY (cockpit interior in foreground, mech body silhouette beyond canopy frame)
- DUTCH-TILTED LOW-ANGLE (camera tilted, mech rising diagonally across frame, dramatic action-keyframe feel)
- THROUGH-MAINTENANCE-SCAFFOLD (foreground girders bracket the mech's torso, hangar behind)
- THROUGH-OVERHEAD-CRANE (crane cables foreground-frame the mech's head, deck below)
- DEEP-FOREGROUND ENGINEER (a single engineer at extreme-low-foreground silhouette, mech towering past)
- 3/4 ELEVATED FROM HEAD-HEIGHT (camera at mech's helmet-level on a catwalk, looking across at the head)
- AT-ANKLE LOW-WIDE (mech's foot fills lower foreground, body rising up into frame, low-angle vanishing point)
- LEANING-IN-CLOSE 3/4 (camera close to mech-torso, foreshortened, body fills 80%)
- DECK-EDGE LOW-SIDE (camera at the deck edge, side-view of mech filling vertical frame)
- LIFTED-CRANE POV (camera mid-crane-arm, looking at the mech-shoulder from a high gantry angle, mech still huge)
- LADDER-CLIMB POV (camera mid-rung of pilot-ladder, looking up at the cockpit opening)
- THROUGH-BAY-DOOR ANGLED (foreground bay-door framing the mech-silhouette from low angle, mech fills doorway)
- FROM-TECH-BACK over-shoulder (camera over a kneeling engineer's back, looking up at the mech)
- DEEP-FOREGROUND TOOL CART (a cart in extreme foreground, mech body rising past it filling frame)
- MID-CHEST LEVEL LATERAL (camera on a scaffold at mech-chest-level, lateral 3/4 framing the entire torso)
- LOW-ANGLE FROM PUDDLE (camera near a coolant-puddle at deck level, mech rising up with reflection at base)

DO write:
- Low-angle hero looking UP at the mech from the base of its foot, mech filling 70% of frame, head touching top-edge
- 3/4 view at hangar-floor level, mech-torso centered, hangar walls receding behind, three-quarter rotation
- Over-crew-shoulder reveal: engineers in foreground silhouette, mech mid-frame towering above them
- Through the cockpit canopy from pilot POV, mech-arms visible from inside, hangar interior beyond
- Between the mech's legs, hangar interior framed through massive foreshortened thighs
- Rear 3/4 over the mech's shoulder, hangar interior visible past it, mech back-and-3/4 turned away
- Kneeling down-angle: camera at standing-mech-shoulder height looking down at the kneeling mech's back

DO NOT write:
- ANY top-down view / wide-establishing landscape / mech-tiny-in-distance / aerial-overhead-far
- ANY portrait-of-pilot-face-only
- DEAD-FRONT-SYMMETRICAL at eye-level (this favors T-pose, banned)
- ANY camera framing where the mech is less than 50% of frame
- Pilot-close-up framings
- Photoreal camera specs (f-stops / mm)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
