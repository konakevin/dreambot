#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/cosmic_oracle_actions.json',
  total: 25,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} BODY-SHAPING POSE descriptions for StarBot's cosmic-oracle path — a sci-fi oracle woman in a cosmic scene. Every entry is ONE explicit body-position that FORCES a non-standing render, lead with the body-position.

Each entry: 12-22 words. ONE specific body pose + cosmic-ritual activity. The POSE leads, the activity provides context.

━━━ THE CORE RULE ━━━
FLUX'S DEFAULT is to render "sci-fi woman" as standing-centered-portrait. Every entry in this pool MUST break that default. The FIRST 5-8 words of every entry MUST describe a specific body-position that CANNOT render as "standing":
- KNEELING (at a console / at a ritual circle / on a viewport step / on observation platform)
- CROUCHED / SQUATTING (low beside a quantum-orb / low at a star-chart laid flat on the floor)
- SEATED (at a navigator's console / at a ritual-altar / on a viewport-ledge / on a meditation-mat / on the rim of a reflecting-pool of liquid-starlight)
- RECLINING (lying back on a bio-bed / propped on elbow in a ritual-chamber / draped across an observation-lounge)
- LYING (prone with hands pressed to the floor-glyph / on stomach gazing through a floor-viewport / curled on side in zero-g suspension)
- LEANING (far forward over a ritual-console / far back against an observation-rail / against a crystal-pillar / over a star-chart table)
- MID-STRIDE (walking a glowing-path across a nebula-observation deck / running along a corridor / crossing a ritual-bridge)
- REACHING (up / far forward to touch a floating-orb / both arms extended to catch drifting star-light / pulling down a floating-scroll)
- BENT (over a glowing-star-map / over a navigation-sextant / over a plasma-altar)
- TILTED / TWISTED (head thrown back to view a nebula overhead / torso twisted sharply at sudden cosmic-disturbance / shoulder-turned toward a distant pulse)
- FLOATING / HOVERING in zero-g (mid-levitation arms out / mid-spin in micro-gravity / tethered-trailing through airlock)
- CLIMBING (partway up a crystal-ladder / halfway up a ritual-spire)

NEVER lead with "she is standing" / "she stands" / "standing among" / "standing beside".

━━━ POSE + CONTEXT FORMULA ━━━
Write as: "[BODY POSITION + SPECIFIC LIMB PLACEMENT], [ACTIVITY CONTEXT]"

Rough shapes (do NOT copy literally — invent 25 DIFFERENT variations):
- "Kneeling at a glowing-glyph circle with both palms pressed flat to the deck, head bowed, whispering into a holo-sigil"
- "Reclining across a bio-crystal lounge with one arm draped overhead, floating star-chart projected across her bare midriff"
- "Seated at the rim of a reflecting-pool of liquid-starlight with both legs drawn up, arms around her knees, gazing into the surface"
- "Bent over a ritual-console carved with sigils, both hands on the controls, face lit from below by cosmic-green glow"
- "Floating tether-free in zero-g with both arms extended out wide, head tilted back, eyes closed in communion"
- "Reaching up with both arms to catch a drifting prismatic orb mid-air, back arched against starfield behind her"
- "Lying prone on the floor-glyph with chin on stacked hands, eyes closed, listening to cosmic-frequencies"
- "Climbing halfway up a crystal-pillar spiraled with glowing sigils, one hand at a carved grip, robe trailing"
- "Kneeling beside a fallen comrade-drone mechanism, hands on its dimming core, reviving it with a palm-glow"
- "Twisted at the waist looking sharply over her shoulder at a sudden shimmer in the starfield"
- "Mid-stride running along a glowing-thread-path across an observation-deck, ceremonial cloak flaring behind"
- "Seated cross-legged inside a chalk-drawn nebula-sigil ring with lit-crystal in each hand, arms outstretched"

━━━ MUST-HAVE FOR EVERY ENTRY ━━━
- FIRST 5-8 words = body position + specific limb placement
- Rest = context activity that makes the pose make sense
- 12-22 words total
- Character-agnostic (she / her — character comes from the character pool)
- Cosmic-oracle-appropriate activity (ritual / meditation / star-chart reading / quantum-orb handling / cosmic-communion / plasma-incantation / void-listening)

━━━ BANNED ━━━
- NO "standing" anywhere in the entry (except as a verb of negation)
- NO "posing" / "modeling" / "facing the camera"
- NO "she is" or "she stands" (lead with the pose directly — "Kneeling at the glowing-glyph circle...")
- NO combat / violence / weapon-drawn / blaster / laser-rifle
- NO gore / explicit blood / wounds
- NO sexual / erotic body position
- NO named IP (Atreides / Bene Gesserit / Jedi / Sith / Starfleet)
- NO location (pool handles that)
- NO lighting (pool handles that)

━━━ POSE ROTATION MANDATE ━━━
Across 25 entries, rotate aggressively — max ~3 entries per pose-family (kneeling, crouched, seated, reclining, lying, leaning, mid-stride, reaching, bent, tilted, floating, climbing). Do NOT cluster.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
