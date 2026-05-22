#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/ghibli_background_detail.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (n) => `Write ${n} BACKGROUND-DETAIL entries for a MangaBot ghibli-countryside keyframe. Each entry is a DEEP-DISTANCE SECONDARY DETAIL — far back, proves the world extends beyond, gives a third readable layer. Pastoral, Ghibli-coded.

Each entry: 10-20 words. ONE specific deep-distance detail.

GHIBLI-CODED DEEP-DISTANCE VARIETY:
- DISTANT FARMER (small figure working in far field)
- CATTLE GRAZING (small group of cows / goats / sheep in far meadow)
- VILLAGE ROOFTOPS (thatched-roof cluster at horizon)
- DISTANT FIGURE WALKING (small silhouette on a path far away)
- SMOKE FROM CHIMNEY (curling smoke from a distant cottage)
- BIRDS IN FLIGHT (cranes / sparrows / swallows wheeling)
- DISTANT CAT ON FENCE (small silhouette of cat on a fence-post)
- DISTANT BOAT (small fishing boat on far lake or river)
- RAINBOW AFTER RAIN (faint arc across distant sky)
- DISTANT CHILDREN PLAYING (small silhouettes running on a path)
- DEER AT TREELINE (deer just visible at the edge of distant forest)
- MOUNTAIN SILHOUETTE (layered far peaks in blue haze)
- DISTANT FLAG / LAUNDRY-LINE (white sheets billowing at distant farm)
- BUTTERFLY-CLUSTER (faint butterfly-cloud above a distant flower-patch)
- WANDERING DOG (small dog trotting along a far path)
- DISTANT WATER-WHEEL (rural mill-wheel visible at far stream)
- LANTERN-LIT WINDOW (warm-amber dot in far cottage at dusk)

DO write:
- A small distant farmer working in a far field, straw hat tilted down, weight forward on a hoe
- A small group of grazing cattle in a far meadow, brown-and-white specks against green
- A thatched-roof village cluster at the horizon, smoke curling from chimneys
- A lone distant figure walking down a path far away, single silhouette against the haze
- Curling smoke from a distant cottage chimney, rising in a slow vertical drift
- A flock of cranes wheeling in flight above the distant rice-paddies, white wings against the haze
- A small cat on a fence-post in middle-distance, tail-tip visible above grass
- A distant fishing-boat with a single lantern lit on a far lake, mirror-reflection visible
- A faint rainbow arcing across the distant sky after a recent rain shower
- A pair of distant children running on a far path, two small silhouettes laughing

DO NOT write:
- Multiple details per entry — ONE
- Foreground / midground elements (separate axes)
- Cyberpunk / urban
- Combat / dramatic
- Animals as protagonists (those are character_role / spirit_element)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
