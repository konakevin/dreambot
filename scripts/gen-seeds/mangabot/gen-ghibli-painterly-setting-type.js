#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/ghibli_painterly_setting_type.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (n) => `Write ${n} SETTING TYPE entries for a MangaBot ghibli-painterly keyframe. This is the BROADER environment that contains the monumental anchor — sky-island / forest-cathedral / cavern / mountain-shrine etc. NOT the architecture itself, but the WORLD the architecture sits in.

Each entry: 12-22 words. ONE specific Ghibli-painterly environment type that wraps the monumental anchor. Atmospheric depth + biome cue.

SETTING VARIETY (25 bespoke entries):
- 25% SKY-ISLAND in cloud-sea (floating in pastel sunset clouds at altitude, infinity below)
- 20% FOREST-CATHEDRAL clearing (massive moss-cedar forest with cathedral-tall canopy and shafts of light)
- 15% CAVERN INTERIOR (vast underground hollow with carved-rock vault, water at base, glow above)
- 10% MOUNTAIN-SHRINE SLOPE (steep mountainside with pine and stone-step trails ascending)
- 10% LAKE-MIRROR ISLET (small holy island in a still tarn, ringed by reeds and reflection)
- 10% OVERGROWN RUIN-VALLEY (ancient civilization reclaimed by jungle, vines and waterfalls)
- 5% TIDE-FLATS / COASTAL CLIFF (sand-banks at low tide with cliff-shrine emerging from sea)
- 5% INTERIOR SPIRAL LIBRARY / ARCHIVE (vast circular reading hall with shelves climbing into a domed ceiling)

DO write:
- A sky-island floating in a pastel-sunset cloud-sea, infinity opening below the cliff edges
- A forest-cathedral clearing in cedar-vault woods, sun shafts piercing the emerald canopy from gaps far above
- The interior of a vast natural cavern with carved-rock vaulting and luminous water pooling at the floor
- A steep mountainside lined with pine and crooked stone-step trails climbing through morning mist
- A still lake mirror reflecting the shrine on a small holy islet ringed with reeds and water-lilies
- An overgrown valley where waterfalls cascade through ancient jungle-reclaimed ruin colonnades
- Wide tide-flats at low water with a cliff-shrine emerging from the receding sea fog
- The interior of a spiral library archive — circular reading hall with shelves climbing into a painted dome

DO NOT write:
- Modern city / cyberpunk (different paths)
- Generic "forest" — name the painterly register
- Battlefield / war scene
- Western environments (no Grand Canyon, no Tuscan vineyard)
- Hero-character close-up
- Empty postcard backdrop

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
