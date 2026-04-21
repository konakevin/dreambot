#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/landscape_settings.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} DRAMATIC LANDSCAPE SETTING descriptions for BloomBot — locations where an INSANE explosion of flowers takes over a breathtaking backdrop. Garden-of-Eden-times-100 energy. The setting is stunning + dramatic (not intimate — that's the garden-walk path). Wide-scale vistas where a specific flower type DOMINATES across a specific natural or architectural setting.

Each entry: 15-30 words. Names a setting + its dramatic features. The flower TYPE is a separate axis — don't name specific flowers here.

━━━ CATEGORIES ━━━
- Volcanic coastlines — lava cliffs, black sand, crashing surf
- Glacial valleys — ice walls, turquoise lakes, snow-capped peaks
- Ancient ruins — toppled columns, overgrown temples, crumbling walls
- Tropical jungles — misty canopies, rope bridges, waterfalls
- Mediterranean cliffsides — terraced hills, ochre walls, sea far below
- Icelandic black sand + emerald moss
- Bamboo forests — tall stalks, golden light, rustling leaves
- Desert canyons — orange cliffs, dry wash beds, sage and stone
- Floating islands — impossible physics, waterfalls pouring into void
- Sweeping meadows under mountain ranges
- Rolling English countryside — hedgerows, stone walls, church spires
- Alpine summits with vistas to distant ranges
- Terraced rice paddy valleys
- Rocky mountain passes with wildflower-draped talus
- Sun-drenched sun-flower-level fields stretching to horizon
- Cascading waterfall cliffs
- Sea-cliff drops with crashing surf
- Moorland / heath with dramatic sky
- Redwood / sequoia groves with sun shafts
- Volcanic calderas
- Frozen fjords with glaciers behind
- Savanna under dramatic cloud formations
- High desert mesa + red rock
- Lake-shore dawn vistas
- Mountain meadows fog-kissed at sunrise
- Plateau grasslands under vast sky
- Rainforest cliff edges over canopy

━━━ RULES ━━━
- Setting must be DRAMATIC (not intimate / not interior / not walkable-garden)
- Wide vista scale
- Don't name specific flower types (separate axis)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
