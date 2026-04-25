#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/dragon_types.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} DRAGON descriptions for DragonBot. Each entry describes a SPECIFIC traditional winged dragon AND the action it is engaged in. 15-30 words. Do NOT describe settings or environments — those come from a separate pool.

━━━ DRAGON TYPE: TRADITIONAL WINGED ONLY ━━━
ALL dragons are TRADITIONAL HIGH-FANTASY WINGED DRAGONS:
- Four legs + two wings (classic western dragon anatomy)
- Massive, powerful, ancient creatures with WINGS
- BANNED TYPES: NO serpentine/snake dragons, NO eastern/Asian dragons, NO wingless dragons, NO sea serpents, NO feathered serpents, NO worm/wyrm without wings. Every dragon MUST have wings.

━━━ TWO-PART STRUCTURE: DRAGON + ACTION ━━━
Each entry has exactly two parts:
1. THE DRAGON: scale color, distinctive features (horn shape, scars, eye color, wing membrane detail, weathering, age). Make each visually unique.
2. THE ACTION: what it's doing RIGHT NOW — a dynamic freeze-frame moment.

━━━ DEDUP: DRAGON APPEARANCE ━━━
No two entries should share the same primary scale color + body build. Vary broadly:
- COLORS: obsidian, crimson, emerald, sapphire, gold, silver, bronze, ivory, amber, copper, iron-grey, midnight-blue, ash-white, blood-red, jade, rust, cobalt, amethyst, bone-white, coal-black, malachite, pewter, burnt-orange, glacial-blue, forest-green, molten-gold, storm-grey, wine-red
- BUILDS: massive armored tank, lean predator, ancient cathedral-sized elder, young aggressive hunter, scarred veteran, frost-rimed colossus, volcanic behemoth
- FEATURES: cracked horns, blind milky eye, missing scale patches, moss in old wounds, battle scars across flanks, torn wing edges healed ragged, chipped fangs, barnacle-crusted underbelly

━━━ DEDUP: ACTION/POSE ━━━
No two entries should have the same action verb. Spread across these categories and NEVER repeat:
- BREATH ATTACKS: breathing fire across, exhaling frost over, spewing molten slag, releasing lightning arc, vomiting emerald flame
- COMBAT: clawing at rival, biting through, slamming tail against, rearing back to strike, grappling mid-air with
- REST: sleeping curled on, basking with wings spread, resting head on forepaws with one eye open, stretching after sleep, yawning revealing rows of teeth
- FEEDING: tearing into, drinking deeply from, crunching bones of, swallowing whole
- TERRITORIAL: roaring from atop, bellowing challenge across, marking territory with claw-gouges, spreading wings in threat display
- MOVEMENT: climbing sheer cliff face, launching from ledge, landing heavily with dust erupting, prowling low through, stalking through, wading chest-deep through
- SUBTLE: preening wing membranes, scratching horn against rock, shaking rain from wings, sniffing the wind, watching with ancient patience

━━━ RULES ━━━
- EVERY entry must have wings mentioned or implied
- NO settings/environments — just the dragon and its action
- NO humans
- NO named IP dragons
- NEVER cute, NEVER cartoony, NEVER clean/smooth/plastic
- Each dragon should feel ANCIENT and WEATHERED — scars, chips, moss, age

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
