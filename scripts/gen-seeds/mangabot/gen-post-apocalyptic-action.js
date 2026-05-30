#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/post_apocalyptic_action.json',
  total: 25, batch: 25, append: true,
  metaPrompt: (n) => `Write ${n} POST-APOCALYPTIC ACTION entries — CRITICAL FORWARD-FACING ONLY.

⚠️ THIS GENRE'S DEFAULT FAILURE MODE = lone-wanderer with back-to-camera looking at ruin-vista on horizon. EVERY action entry must affirmatively position the wanderer ENGAGED with a ruin-prop / tool / pet / food / map AT HAND, FACING viewer or in profile — NEVER staring at distant skyline.

Each 12-20 words. Action + body orientation + face register + interaction.

VARIETY:
- 18% MID-SCAVENGE (mid-prying-panel from rusted-machine facing camera / mid-rummage in collapsed-shelf / mid-pull-cable from junction-box / mid-siphon from old-tank)
- 14% MID-REPAIR-MAINTAIN (mid-turn-wrench on engine with focused frown / mid-strike-flint to spark / mid-thread-needle on patched jacket / mid-tighten-bolt)
- 12% MID-EAT-DRINK (mid-bite of ration-bar facing camera / mid-sip from canteen with eyes-closed pleasure / mid-spoon of tin-can-stew, steam rising)
- 10% MID-CONSULT-MAP-COMPASS (mid-trace-route on map across knee, head down / mid-check-compass in palm with finger pointing / mid-sight-spyglass at midground)
- 10% MID-TEND-PET (mid-pet-mechanical-dog with warm half-smile / mid-feed-lizard on shoulder / mid-pat-scout-drone hovering at hand)
- 8% MID-LIGHT-LANTERN (mid-strike-match for lantern with hands cupped / mid-twist-oil-knob, face golden / mid-raise-torch overhead)
- 8% MID-PLAY-INSTRUMENT (mid-blow-harmonica with cheeks puffed / mid-pluck-guitar-string fingers on fret / mid-strum-shamisen seated cross-legged)
- 6% MID-WRITE-SKETCH (mid-pencil-stroke in sketchbook open on knee / mid-mark-X on map / mid-engrave-tally into wall)
- 6% MID-MEDICAL-TEND (mid-wrap-bandage on own forearm with teeth / mid-pour-tincture into cup / mid-crush-herb in palm)
- 4% MID-WALK-WITH-PACK (mid-stride forward facing camera with pack on back / mid-step-over-rubble, three-quarter angle, focused eyes)
- 4% MID-LISTEN-RADIO (mid-tune-radio-dial held to ear with hand cupped / mid-press-earpiece with focused listening face)

DO write:
- Mid-pry-panel from rusted-vending-machine with crowbar, facing camera, focused-frown, sweat-streaked cheek
- Mid-sip from battered-canteen with eyes-closed pleasure, head tilted slightly back but face still toward viewer
- Mid-pet of mechanical-dog companion sat at side, warm half-smile turned three-quarter toward viewer
- Mid-trace-route on folded-map across knee, head down focused on paper, face visible to camera
- Mid-blow-harmonica with cheeks puffed and eyes half-closed in focus, hands cupped at mouth
- Mid-strike-match for lantern with hands cupped at chest, amber-spark catching face from below
- Mid-stride forward with bedroll on back, three-quarter angled toward viewer, determined-eyes

DO NOT — CRITICAL:
- "Looking out at ruined city" / "gazing at horizon" / "staring at vista" — back-to-camera traps
- "Standing at edge of cliff facing distant skyline" — back-to-camera trap
- "Silhouetted against sunset" — back-to-camera trap
- "Lone-figure-walking-away-from-camera" — back-to-camera trap
- "Hand-shielding-eyes-looking-into-distance" — back-to-camera trap
- Combat / brandished-weapons-firing / blood / corpses / multiple per entry

Wanderer ALWAYS engaged with ruin-prop / tool / pet / food / map AT HAND. Ruin-vista is BACKDROP, never the target of their gaze.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
