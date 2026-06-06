#!/usr/bin/env node
/**
 * MECH_SKYSHIPS_COMPOSITION — sky-vertigo camera angles for MechBot
 * mech-skyships path. Predatory blade-silhouette skyships in dramatic
 * aerial-vertigo framings. ~45-60 word descriptions.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/mech_skyships_composition.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} COMPOSITION entries for MechBot's mech-skyships path — sky-vertigo camera angles for a predatory blade-silhouette skyship subject. Title-caps prefix THEN " — " separator THEN 45-60 word camera-composition description with explicit vertigo / scale / atmosphere details.

━━━ THE BAR ━━━
Every entry is ONE camera composition setting up the skyship in dramatic AERIAL VERTIGO. Names the camera POSITION + the skyship's relationship to environment (ground / cloud-deck / mountain-pass / megacity / storm-wall / cliff-face / open-sky). Vertigo cues: scale relationships, motion blur, vanishing-point depth, banking-angle, altitude-cue. NOT modern-aircraft references — predatory blade-skyships.

━━━ EXAMPLE PHRASINGS (mirror this register exactly) ━━━
"WORM'S-EYE FROM GROUND — camera flat against scorched concrete looking straight up as the skyship's blade-hull eclipses the entire upper frame, exhaust-cone venting white plasma, a silhouetted figure sprinting below barely clears the shadow's leading edge."
"OVER-THE-WING POV — camera locked on the port blade-wing's leading edge as the skyship screams toward a burning target-spire, wing dominating the lower frame in riveted black steel, horizon tilting forty degrees, cloud-deck scrolling beneath at terrifying speed."
"COCKPIT-CANOPY PURSUIT — looking through scratched forward canopy at a fleeing skyship banking left through a storm-wall, reticle glowing amber at frame-center, instrument-haze reflected on the glass, lightning illuminating the target's contrail half a second ahead."
"MOUNTAIN-PASS THREADING — skyship banking hard through a granite choke-point, snow-capped peaks filling both vertical edges of frame, blade-wings clearing rock faces by meters, contrails curling into the pass behind, altitude-marker altimeter spinning wildly at frame-corner."

━━━ VARIETY MANDATE (distribute across these vertigo-composition categories) ━━━

- ~4 GROUND POV (worm's-eye / from-cliff-edge / scorched-ground looking up / village-rooftop POV / desert-floor straight up / mid-battlefield ground POV / harbor-deck POV / refugee-column POV)
- ~3 ATMOSPHERIC PIERCE (through-cloud-layer break / breaking-through storm-wall / piercing-mist / cracking sound-barrier with vapor-cone / dropping-out-of-cloud / climbing-into-sun / piercing-aurora)
- ~3 PURSUIT / TRACK (cockpit-canopy pursuit / chase-cam from second skyship / following-from-behind / matched-velocity parallel / wing-tip pursuit / breakaway-turn pursuit / corkscrew pursuit)
- ~3 GOD'S-EYE / HIGH (god's-eye from higher altitude / satellite-style overhead / orbital-view / cliff-summit looking down / mountaintop POV / spire-rooftop looking down / above-fleet looking down)
- ~3 ENVIRONMENT-THREADING (mountain-pass threading / canyon-thread / urban-canyon between skyscrapers / sea-stack threading / cliff-face threading / sky-bridge threading / pylon-array threading / ice-spire threading)
- ~3 LOW-PASS (low-pass over megacity / strafing-low over refugee column / hugging-terrain over rolling hills / wave-skimming low / dust-cloud kicking up / debris-trail behind / shockwave through rooftops)
- ~3 BANKING-TURN (sharp-bank dropping into dive / corkscrew climb-out / hard left-bank silhouette / right-bank revealing belly / wing-over reversal / split-S maneuver / immelmann turn / barrel-roll mid-frame)
- ~3 CHEEK-TO-CHEEK / PARALLEL (matched-velocity beside / formation-flying with wingman / paired-skyships in formation / fleet-spread far / lead-ship and follower / breakaway from formation)
- ~3 DRAMATIC SILHOUETTE (against rising sun / against setting sun / against lightning-flash / against blood-moon / against nebula-sky / against eclipse / against burning city / against typhoon-wall)
- ~2 SCALE-PROVER (skyship eclipsing distant city / dwarfing mountain ridge below / shadow falling across hundreds of rooftops / silhouette across the sun / passing over fleet of insignificant smaller ships)

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- TITLE PREFIX is 2-4 WORDS IN ALL-CAPS-HYPHENATED, then " — " separator (em-dash), then description.
- ALWAYS specify CAMERA POSITION / angle.
- ALWAYS include a vertigo / scale / atmospheric cue (banking-angle / altitude / motion-blur / cloud-scrolling).
- ALWAYS reference the skyship explicitly ("the skyship", "the blade-hull", "the contrail").
- Body is 45-60 words.

━━━ BANS ━━━
- NO modern military references (no jet / helicopter / aircraft-carrier / dreadnought / battleship language).
- NO box-shaped warships — these are PREDATORY BLADE silhouettes.
- NO ground-only or hangar-only — composition is AERIAL.
- NO photoreal-photographer name-drops.
- NO repeating the exact same camera angle.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
