#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/samurai_landscape_setting.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} LANDSCAPE SETTING entries for a MangaBot samurai-era keyframe. Each entry is the WORLD — the natural / historical-Japan landscape that wraps the scene. Decoupled from any specific character action.

Each entry: 12-22 words. ONE specific historical-Japan landscape.

VARIETY across these biomes:
- Bamboo groves (towering green-and-cream culms, dappled light, mossy floor)
- Cherry-blossom valleys (pink-petal hillsides, drifting blossom-rain)
- Snowy mountain passes (deep drifts, dark pine, ridges in distance)
- Misty river gorges (jade water, stone shrines on banks, fog)
- Autumn maple forests (crimson + gold canopy, leaf-strewn paths)
- Coastal cliffs (storm-grey ocean, weathered shrines, gull-cry air)
- Edo street outskirts (wooden shopfronts, paper-lantern strings, dust)
- Castle moat / fortified hill (stone walls, water-lily moat, pine-clad slopes)
- Temple courtyards (gravel-raked Zen yards, stone lanterns, mossy walls)
- Battlefield aftermath (banner-strewn fields, smoke, broken pikes — NOT gore)
- Wisteria-vine lanes (lavender-purple draped pergolas, soft light)
- Iris-pond gardens (purple-iris beds, koi-pond, arched wooden bridge)
- Mount-Fuji vistas (snow-capped distant cone, rolling foothills)
- Pine-tree headlands (gnarled black-pines on rocky cliffs)
- Rice-paddy terraces at dawn (stepped emerald paddies, mist-pooled valleys)

DO write:
- Towering bamboo grove with dappled sun-shaft and mossy stone floor
- Pink cherry-blossom valley with drifting petal-rain and a stream below
- Snowy mountain pass with deep drifts and dark-green pine silhouettes
- Misty jade-river gorge with stone shrine on the bank and fog hanging low
- Crimson-and-gold autumn maple forest, leaf-strewn path winding through

DO NOT write:
- Architectural anchors (separate axis — pagoda / castle / temple etc.)
- Specific characters (separate axis)
- Atmosphere effects (separate axis — petals/rain/snow drift drift)
- Modern landscape elements (telephone poles, power lines, paved roads)
- Specific named locations (Mount Hiei specific places — keep landscape generic + Japan-coded)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
