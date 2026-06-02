#!/usr/bin/env node
/**
 * EarthBot hidden-corner — ATMOSPHERE axis.
 *
 * Mood + air quality of the intimate pocket. Humid mist, post-rain
 * freshness, dry summer warmth, autumn crispness, quiet sanctuary hush.
 *
 * R0 = 50.
 */
const fs = require('fs');
const { generatePool } = require('../../lib/seedGenHelper');

const outPath = 'scripts/bots/earthbot/seeds/hidden_corner_atmosphere.json';
// Append mode — scale R0 50-entry pool to 200.

generatePool({
  outPath,
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} ATMOSPHERE entries for EarthBot hidden-corner. Each entry names ONE mood + air-quality combination that gives the intimate pocket its emotional feel. Humid mist, post-rain freshness, dry summer warmth, autumn crispness, dawn awakening, quiet sanctuary hush. Real Earth ONLY.

━━━ THE BAR — ONE MOOD + AIR-QUALITY COMBO ━━━

The atmospheric / emotional / sensory quality of the air. Humid rainforest moisture clinging to every surface, post-rain freshness with petrichor and droplets, dry summer warmth with pollen drifting, crisp autumn air with leaf-mulch scent, dawn awakening hush, sanctuary quiet.

━━━ OUTPUT FORMAT — JSON OBJECTS ━━━

{ "description": "<mood + air-quality, 16-28 words>" }

Bare strings acceptable.

━━━ ATMOSPHERE TYPES ━━━

- HUMID RAINFOREST — heavy moisture clinging to every surface, fog drifting through ferns
- POST-RAIN FRESHNESS — wet-petrichor air, dripping water everywhere, droplets glittering
- DRY SUMMER WARMTH — warm still air with pollen drifting, dust catching sidelight
- AUTUMN CRISPNESS — cool air with leaf-mulch scent, golden-amber atmospheric tone
- DAWN AWAKENING — soft mist clearing, slow rising light, hush before the morning starts
- SANCTUARY HUSH — quiet stillness, almost-silent, the secret-pocket feel
- DEW-CHILLED MORNING — cold damp air pre-sunrise, every surface coated in dew
- BLUE-HOUR STILLNESS — cool ambient depth, scene wrapped in pre-dawn quiet
- TROPICAL HUMID — warm dense moisture, lush rainforest feel
- TEMPERATE COOL — soft cool air with high humidity but not heavy

━━━ EXAMPLES ━━━

✓ { "description": "Heavy rainforest humidity clinging to every surface, drifts of warm fog moving slowly through the fern canopy and pooling in the lower corners of the scene" }

✓ { "description": "Post-rain freshness lingering in the air — petrichor scent implied, droplets dripping continuously from leaves and rocks, every surface still wet and glistening" }

✓ { "description": "Crisp autumn air with the subtle scent of leaf-mulch — cool damp atmosphere, soft amber light filtering through the canopy gaps onto the carpet of fallen leaves" }

✓ { "description": "Dawn-awakening hush — soft pale mist rising and clearing, scene wrapped in early-morning quiet, slow rising light just beginning to warm the foreground details" }

✓ { "description": "Sanctuary-quiet stillness — almost-silent, the secret-pocket feel of a place no one else has visited, soft diffuse light bathing the scene in patient warmth" }

━━━ ABSOLUTELY BANNED ━━━

- Sci-fi / fantasy / alien atmosphere
- Bioluminescent / glowing-air
- Storm / violent weather (this is INTIMATE / CALM)
- Flat / boring / lifeless atmosphere
- "Fire" as a noun
- Architecture-adjacent atmospherics

━━━ OUTPUT ━━━

JSON array of ${n} entries. ONE mood + air-quality per entry. Real-Earth, intimate, varied. No preamble, no markdown.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
