#!/usr/bin/env node
/**
 * EarthBot beach-night — LIGHT SOURCE axis (the hero).
 *
 * NATURAL light only — moon / stars / Milky Way variations. NO
 * human-built lights (tiki, lantern, paper, lighthouse). NO sci-fi
 * triggers (bioluminescent / phosphorescent / glowing waves).
 *
 * R0 = 50.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/beach_night_light_source.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (n) => `You are writing ${n} LIGHT SOURCE entries for EarthBot beach-night. Each entry describes ONE natural night-light source — the HERO of the frame. ONLY natural sources: moonlight (full / crescent / copper / low / overhead), starlight, Milky Way. NO human-built lights (tiki / lantern / paper / lighthouse / bonfire / dock light).

━━━ THE BAR — NATURAL NIGHT LIGHT AS HERO ━━━

The light is the emotional center of the frame. It illuminates the tropical beach scene below. Awe-inspiring, warm, magical — never cold ominous.

━━━ ABSOLUTELY BANNED ━━━

- "Tiki torches" / "torches" / "torchlight"
- "Lantern" / "hurricane lantern" / "paper lantern"
- "Lighthouse beam" / "beacon"
- "Bonfire" / "fire pit" / "campfire"
- "Dock lights" / "boardwalk lanterns"
- "Bioluminescent" / "phosphorescent" / "luminescent"
- "Glowing waves" / "electric-blue surf"
- "Single beam" / "single shaft" / "single column of light"
- "Cathedral-scale godray" / "godray"
- Sci-fi / fantasy / magical glow

━━━ OUTPUT FORMAT — JSON STRINGS ━━━

Output a JSON array of STRINGS. Each string is one light-source description, 14-26 words.

━━━ LIGHT SOURCE TYPES (rotate aggressively) ━━━

FULL MOON:
- A massive full moon hanging low above the horizon, casting silver light across the entire frame
- A bright full moon overhead, silver light pooling on the calm tropical water below
- A full moon rising at the deep horizon, silver-white path across the still tropical water
- A high full moon near zenith, silver light flooding the entire frame

CRESCENT MOON:
- A thin crescent moon low at the horizon, faint silver light at the upper edge
- A crescent moon hanging in the upper frame, faint cool silver glow across the scene

COPPER / WARM MOON:
- A copper-orange harvest moon rising at the horizon, warm amber-silver light across the water
- A low copper moon casting warm silver-amber path across the calm tropical lagoon
- A blood-red lunar-eclipse moon hanging deep in the sky, faint rust-red light across the scene

MILKY WAY:
- The Milky Way arcing dense across the upper sky, scattered starlight illuminating the tropical scene below
- The Milky Way's central bulge bright in the upper frame, a river of stars across the sky
- A bright Milky Way band crossing the sky overhead, the scene lit by collective starlight

STARLIGHT (Milky Way not visible, but dense stars):
- A sky packed with bright stars across the tropical scene, faint collective starlight on the foreground
- Dense starlight overhead with the dark sky packed edge-to-edge with bright stars, faint cool light below

NEW-MOON / MOONLESS:
- A moonless sky overhead with constellation-clear stars, dark with only faint star-light reaching the foreground

━━━ EXAMPLES ━━━

✓ "A massive full moon hanging low above the horizon, casting silver light across the entire frame"

✓ "The Milky Way arcing dense across the upper sky, scattered starlight illuminating the tropical scene below"

✓ "A copper-orange harvest moon rising at the horizon, warm amber-silver light across the calm water"

✓ "A bright full moon overhead near zenith, silver light flooding the tropical scene below"

✓ "A thin crescent moon low at the horizon, faint silver light at the upper edge of the frame"

✓ "A high full moon casting silver-white reflective path across the calm tropical lagoon"

✓ "A bright Milky Way central bulge in the upper frame, scattered starlight illuminating the foreground"

✓ "A blood-red lunar-eclipse moon hanging deep in the sky, faint rust-red light across the scene"

✓ "Dense starlight overhead with constellation-clear sky packed edge-to-edge with bright stars"

✗ BAD — torches: "Tiki torches casting amber light" (BANNED — natural only)
✗ BAD — bonfire: "A bonfire on the beach casting warm light" (BANNED)
✗ BAD — bioluminescent: "Soft bioluminescent glow rising from the surf" (BANNED — sci-fi)
✗ BAD — single beam: "A single moonbeam piercing through clouds" (BANNED — use "moon casting silver light")

━━━ LIGHT SOURCE DISTRIBUTION ━━━

- ~35% full moon
- ~15% crescent moon
- ~15% copper/warm moon (harvest / low / lunar-eclipse)
- ~25% Milky Way
- ~10% starlight alone (Milky Way not specifically called out)

━━━ OUTPUT ━━━

JSON array of ${n} STRINGS. Natural light source only. No preamble, no markdown, no JSON keys — just strings.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
