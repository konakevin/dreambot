#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/venusbot/seeds/internal_exposure.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} INTERNAL EXPOSURE descriptions — the "see inside her" element on a cyborg woman. Each describes a specific place / manner where her internal mechanical anatomy is visible. Mix small-window reveals and dominant-translucent variants.

Each entry: 18-35 words. Specific about LOCATION and WHAT'S VISIBLE inside.

━━━ TWO CATEGORIES TO MIX ━━━

**Small-window reveals** (maintenance-panel style):
- Hinged hatch on cheek/forehead/temple revealing gears + LEDs
- Transparent observation window at temple showing circuit board + data streams
- Service seam along jaw open showing fiber-optic nerve cables
- Collar port open with wisp of plasma + fiber filaments
- Open ear housing showing resonance chambers + wire bundles
- Glass window in neck showing vertebrae servo rotations
- Eye socket with visible iris aperture servos

**Whole-torso / dominant reveals** (Ex Machina / Alita aesthetic):
- Full torso translucent polymer — mechanical structure + glowing core visible softly
- Chest + abdomen clear with internal gears + fiber-optic vines glowing from inside
- Whole-body subtle translucency with inner-light-through-skin quality
- Sternum-to-navel transparent panel showing full inner workings as soft dreamy reveal
- Upper body museum-display translucent with internal light washing outward
- Back translucent with visible spine-mechanism + cable-bundle architecture

━━━ RULES ━━━
- Describe QUALITY of the reveal (subtle / dominant / soft / surgical / luminous / murky-beautiful)
- The internal light is visible THROUGH — never a surface effect
- No ribs screaming — subtle, dreamy, elegant

━━━ BANNED ━━━
- "posing" language
- "fireworks" / "sparks" (that's surface effect, not internal)
- Generic "her insides show" — always specific zone + material + what's visible

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  maxTokens: 4000,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
