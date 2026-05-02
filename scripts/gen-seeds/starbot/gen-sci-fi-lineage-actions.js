#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/sci_fi_lineage_actions.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} RACE-FLAVORED MOTION-FIRST action entries for StarBot's female-explorer and male-explorer paths. Each entry is a SHORT phrase (10-22 words) describing a SIGNATURE MID-MOTION gesture / body-position that lets a sci-fi lineage's flavor SHINE while exploring.

CRITICAL — ABSOLUTELY NO SEATED / SITTING / KNEELING-STILL / MEDITATION / EYES-CLOSED / LEANING-BACK / CURLED-UP / RESTING poses. The character is ALWAYS in motion or caught mid-action while exploring.

CRITICAL — NO FRANCHISE NAMES. NEVER write "Vulcan", "Klingon", "Mandalorian", "Spartan", "Twi'lek", "Jedi", "Sith", "Aeldari", "Sororitas", "Mentat", "Tal Shiar", "Sin'dorei", or any specific franchise reference. Describe the gesture GENERICALLY — anchored in race anatomy (lekku-stroke while striding, montral-tilt while looking up, T-visor-helmet-on while walking) but NEVER named.

CRITICAL — LOCATION-AGNOSTIC. Describe ONLY the body, gesture, prop in hand, expression — anchored in lineage anatomy.

ABSOLUTELY NO BATTLE / NO COMBAT / NO violence.

━━━ ACTION SPREAD (enforce variety across ${n}) ━━━

HEAD-APPENDAGE LINEAGE — MID-MOTION (5-6):
- striding forward with one hand brushing a long curving head-tendril back over the shoulder, eyes ahead on the horizon
- walking with the striped white-and-skin-toned head montrals catching the light, head turned to look at something passing
- mid-stride pulling a long queue-braid forward over the shoulder, gear-pack swaying with the gait
- walking cautiously with fingertips brushing one of the small ringed-skull horns, head tilted in concentration
- mid-step glancing at a holographic projection from a wrist-device, the geometric facial tattoo catching light at the cheekbone
- striding with the long forehead-mantle catching wind, body angled forward, weight committed

POINTED-EAR / ELF-CODED — MID-MOTION (4-5):
- mid-stride with one hand briefly pressing fingers together in a momentary gesture, the other on a sheathed weapon at the hip
- walking with a cool gait befitting an ancient lineage, cape catching the alien wind, eyes scanning the horizon
- pausing mid-stride to tuck a strand of pale-platinum hair behind a long pointed ear, the other hand still raised
- striding forward with one hand mid-cast — a faint glowing rune trailing behind the gesture
- traversing rocky ground with all-motion confidence, pointed ears catching ambient light

DISTINCTIVE-CRANIUM — MID-MOTION (3):
- mid-stride with one hand briefly running through a long warrior-mane, head turned slightly
- walking with antennae tilting toward something off-frame, head subtly turning to follow the source
- striding forward with the bone-crest crown silhouetted against the sky, robes flowing with the motion

ARMORED ICONIC SILHOUETTES — MID-MOTION (4):
- mid-stride pulling on a T-visor helmet with one hand, the other still adjusting an armor-strap, body in motion
- walking forward in heavy power-armor with the AI-glow at the temples, helmet under one arm, eyes scanning the terrain
- striding through dense fog with the burnished-steel plate catching ambient light, jetpack visible at the back
- mid-step adjusting a stillsuit nose-tube while striding through the alien atmosphere, hood-cape catching wind

CYBER / AUGMENTED — MID-MOTION (3-4):
- mid-stride flexing chrome prosthetic-arm fingers experimentally, eyes briefly going to the readouts at the wrist
- walking with the subdermal LED-tracery catching motion-blur faintly along the spine, pace confident
- striding forward with one hand raising a holographic readout from a wrist data-jack, the other on a sidearm
- mid-step adjusting a smartlink at the temple with two fingertips, body still in forward motion

ARTIFICIAL / SYNTH — MID-MOTION (2):
- striding forward with too much precision, every limb perfectly aligned, gaze locked unblinking on the horizon
- mid-step pausing for a half-second as if running a brief internal scan, head tilted slightly, then continuing the stride

HOODED / CULTURAL — MID-MOTION (1-2):
- striding through alien fog with the deep cowl casting the face in shadow, hand on a holstered weapon, weight forward
- moving with a controlled prana-bindu precision through alien terrain, robes flowing with each measured step

━━━ RULES ━━━
- ABSOLUTELY NO sitting / kneeling-still / cross-legged / lying / eyes-closed / meditation / curled-up
- Every entry is MID-MOTION — striding, walking, traversing, reaching, looking-up — while expressing race anatomy
- ABSOLUTELY NO franchise names — describe gesture GENERICALLY anchored in race anatomy
- 10-22 words — terse and purely about the FIGURE
- LOCATION-AGNOSTIC — never name a location
- The action must REVEAL the race anatomy via gesture (head-tendril stroke for head-tendril race, montral tilt for montral race, T-visor-helmet-on for armored mercenary race)
- Suitable for BOTH male and female explorers
- ABSOLUTELY NO battle / combat / weapon-IN-USE / violence
- Body weight shifted, captured mid-action — exploring, alert, capable

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering. NO seated poses, NO franchise names.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
