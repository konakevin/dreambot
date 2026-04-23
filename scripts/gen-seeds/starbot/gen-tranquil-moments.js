#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/tranquil_moments.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} ROBOT MOMENT descriptions for StarBot's robot-moment path — a solo robot doing something INTERESTING in a visually compelling setting. NOT just sitting/reading/watching. The robot should be DOING something that makes for a striking image.

Each entry: 10-20 words. One specific action + setting.

━━━ CATEGORIES (spread evenly — VARIETY is critical) ━━━
ACTIVE + PURPOSEFUL (~35%):
- Repairing its own damaged arm amid battle aftermath wreckage
- Building a cairn of alien stones on windswept cliff edge
- Welding a sculpture from salvaged ship parts in workshop shower of sparks
- Planting a flag on an uncharted alien mountain summit
- Constructing a shelter from wreckage on a hostile alien surface
- Soldering circuit boards by lamplight, sparks illuminating focused optics
- Hand-forging a blade at a glowing anvil, hammer raised mid-strike
- Assembling a radio telescope from junk in a desert canyon

EXPLORATION + DISCOVERY (~25%):
- Descending into bioluminescent alien cave, headlamp cutting through crystal formations
- Wading through shallow alien ocean, examining glowing organisms in cupped hands
- Standing at edge of impossible alien canyon, mapping the depths with scanning beam
- Navigating dense alien jungle, machete-arm clearing vines, exotic birds scattering
- Entering ancient alien temple, dust motes swirling in beam from cracked ceiling
- Climbing volcanic ridge, silhouetted against lava flow, taking geological readings

EMOTIONAL + POIGNANT (~20%):
- Standing in rain on empty battlefield, holding fallen comrade's dog tags
- Watching its own reflection in still alien lake, touching its own face
- Sitting alone at a table set for two, candle burning low
- Playing piano in bombed-out concert hall, ceiling open to stars
- Kneeling in field of alien flowers, carefully pressing one into a book
- Writing a message in the sand of an alien beach at sunset

DRAMATIC + CINEMATIC (~20%):
- Silhouetted on rooftop of alien city, surveying sprawl below at dawn
- Walking through sandstorm on desert planet, cloak whipping, eyes glowing through dust
- Standing guard at ancient doorway, weapon ready, alien aurora overhead
- Emerging from crashed ship wreckage, one eye flickering, landscape stretching to horizon
- Perched on ship hull in space, tethered, performing external repair with stars behind

━━━ RULES ━━━
- Robot is SOLO — poignant juxtaposition of machine doing meaningful things
- Actions should be BODY-SHAPING — poses that make compelling images (reaching, kneeling, climbing, hammering), NOT passive (sitting, watching, reading)
- Settings should be VISUALLY RICH — alien worlds, dramatic environments, interesting light
- NO boring domestic scenes (sitting in chair, drinking tea, reading book)
- Each should make you think "that would be an amazing painting"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
