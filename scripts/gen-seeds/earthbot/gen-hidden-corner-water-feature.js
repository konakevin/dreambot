#!/usr/bin/env node
/**
 * EarthBot hidden-corner — WATER FEATURE axis.
 *
 * Water content woven into the intimate scene. Most hidden corners have
 * water — still pool, gentle trickle, dripping rock, small waterfall.
 * Some have no visible water — damp moss / wet stones only.
 *
 * R0 = 50.
 */
const fs = require('fs');
const { generatePool } = require('../../lib/seedGenHelper');

const outPath = 'scripts/bots/earthbot/seeds/hidden_corner_water_feature.json';
// Append mode — scale R0 50-entry pool to 200.

generatePool({
  outPath,
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} WATER FEATURE entries for EarthBot hidden-corner. Each entry names ONE water element in the intimate hidden-corner scene — a small still pool, gentle trickle, dripping rock, small waterfall, dew-only no-flowing-water option, etc. Real Earth ONLY.

━━━ THE BAR — INTIMATE WATER ELEMENT ━━━

Small-scale water at intimate scale — NOT a wide river / lake / ocean horizon. Mossy creek trickle, still pool with reflection, drip seeping from rock, small unmapped waterfall cascade, lily-pad pond edge, dew-only damp scene.

━━━ OUTPUT FORMAT — JSON OBJECTS ━━━

{ "description": "<water feature, 14-25 words>" }

Bare strings acceptable.

━━━ WATER FEATURE TYPES ━━━

- STILL POOL — mirror-smooth surface reflecting overhead foliage / light
- GENTLE TRICKLE — slow water flowing over mossy stones with small ripples
- DRIPPING ROCK — water seeping from a wet rock face with droplets caught mid-fall
- SMALL WATERFALL — single-tier cascade dropping 3-6 feet into a mossy basin
- LILY-PAD POND EDGE — quiet still water with floating lily leaves and reflections
- DAMP MOSS SCENE (no flowing water) — wet moss + dew + glistening surfaces only
- SPRING SEEP — wet rock seep where water emerges and trickles over moss
- TIDE POOL — calm rocky-coast pool with sea-water reflecting overhead light
- BUBBLING SOURCE — small spring where water emerges with gentle surface motion
- MIST-WET STONES — water present as fog-mist coating every surface, no flow

━━━ EXAMPLES ━━━

✓ { "description": "A mirror-still pool at the basin floor reflecting the mossy walls and dappled light above in mirror-clean detail" }

✓ { "description": "Gentle stream water trickling slowly over moss-cushioned stones, small ripples breaking the surface where the flow catches" }

✓ { "description": "Water droplets seeping continuously from a wet rock face above, caught mid-fall in the dappled light, splashing into a small mossy basin below" }

✓ { "description": "Single-tier waterfall dropping six feet over fern-fringed stone into a mossy basin pool with dancing ripples and spray-spread mist" }

✓ { "description": "Damp moss-coated scene with dew clinging to every surface, no flowing water visible — just glistening wet textures throughout" }

━━━ ABSOLUTELY BANNED ━━━

- Wide river / lake / ocean horizon (this is INTIMATE)
- Bioluminescent water / glowing water / aurora-cyan
- Frozen / ice / glacier (legacy hidden-corner drifted ice; intimate-pocket is warmer biomes)
- Sci-fi / fantasy / impossible-reflection / impossible-angle
- Architecture-adjacent water (fountain / pool / aqueduct)
- "Fire" as a noun

━━━ OUTPUT ━━━

JSON array of ${n} entries. ONE water feature per entry. Real-Earth intimate scale. No preamble, no markdown.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
