#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/dreamscape_contexts.json',
  total: 200,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} DREAMSCAPE CONTEXT descriptions for BloomBot's dreamscape path — surreal EARTHLY flower scenes where flowers reclaim / consume / erupt from / grow inside unexpected human-made or natural objects. Magical-realism, Magritte-esque, flowers-take-over-the-world energy.

NOT otherworldly / cosmic (that's separate path). NOT realistic (that's landscape / cozy / garden-walk). The magic here is the IMPOSSIBLE CONTEXT where flowers bloom — but the context is recognizable earthly stuff (pianos, cathedrals, harps, clocks, teacups, typewriters, etc.).

Each entry: 18-35 words. Names the impossible context + the floral takeover.

━━━ CATEGORIES ━━━
- Grand piano in a field being completely consumed by roses
- Abandoned cathedral with flowers reclaiming every pew, altar, stained-glass
- Sunken ship on ocean floor blooming with coral-flower hybrids
- Ancient clockwork machinery erupting with living flowers between gears
- Harp with flowers growing up every string
- Crumbling library with books opening into bouquets
- Victorian staircase with flowers spiraling up the banister
- Abandoned subway car with wildflowers reclaiming every seat
- Grand ballroom chandelier dripping with hanging blooms
- Old biplane wreck in jungle, vines and flowers consuming the frame
- Marble statue in garden, flowers climbing up its body
- Antique typewriter on a desk with flowers emerging between keys
- Ornate teapot with an impossible bouquet spilling out
- Broken mirror with flowers growing from each crack
- Abandoned train station platform flooded with meadow flowers
- Pipe organ with flowers erupting from every pipe
- Vintage car reclaimed by nature, bouquets through the windows
- Cathedral floor paved with living flowers instead of stones
- Sleeping giant's open hand filled with a lush meadow
- Grandfather clock with vines blooming from the face + pendulum
- Bookshelf where every book spine has flowers growing out
- Wishing-well with flowers blooming up from the depths
- Victorian birdcage with flowers spilling through bars
- Ancient well reclaimed with flowers climbing down inside
- Chess board with flower blooms for each piece
- Carousel horse covered in cascading blooms
- Music box open with flowers dancing from inside
- Old steamer trunk burst open with flowers spilling out
- Treasure chest overflowing with blooms instead of gold
- Street lamp post with climbing-flower vines twining up
- Abandoned greenhouse reclaimed by wildflowers through broken glass
- Violin with flowers growing between strings
- Chandelier crystal-by-crystal replaced by tiny blooms

━━━ RULES ━━━
- Earthly context (not alien / not cosmic / not pure-nature)
- Flowers are the magical takeover element
- Beauty first, surrealism second — always gorgeous
- NOT dramatic nature backdrops (that's landscape)
- NOT gentle garden paths (that's garden-walk)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  maxTokens: 4000,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
