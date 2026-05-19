#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/heartwarming_settings.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (n) => `You are writing ${n} HEARTWARMING SETTINGS for ChibiBot — the picture-book stage where adorable creatures share heart-melting moments. The SETTING is the stage where the cuddly action happens. Each setting must feel like a frame from a different page of a beautiful storybook.

Each entry: 15-25 words. One specific setting. NO creatures (they live in a separate axis). NO time-of-day or weather (separate axes). Just the SETTING.

━━━ WHAT MAKES A GREAT ENTRY ━━━
- Concrete, picture-able, distinct (not "a cozy spot")
- Storybook geography: cottage interiors, forest hollows, meadows, treehouse rooms, fairy-ring clearings, mushroom groves, window seats, riverbanks, garden corners, stone bridges, attic nooks, kitchen tables, library reading nooks
- Specific micro-details that anchor scale and texture (mossy stones, brass lantern hooks, wildflower beds, copper teapots, hand-knit blankets, books stacked on the floor, sun-faded curtains)
- Diverse architecture: cottages, treehouses, burrows, mushroom-houses, lighthouses, gypsy wagons, cabin lofts, observatory domes, garden sheds, market stalls
- Diverse geography: forest / meadow / mountain / coast / desert oasis / arctic / jungle / fairy realm / underwater glow / cloud / sky-island / underground burrow

━━━ CATEGORY DISTRIBUTION ━━━
- 25% cozy interiors (cottage living rooms, kitchen tables, attic nooks, window seats, reading corners, fireplace hearths)
- 25% outdoor natural (forest clearings, meadow patches, riverbanks, garden corners, mossy logs, flowering hedges)
- 15% magical-realm (fairy-ring clearings, mushroom groves, glowing-pond hollows, crystal alcoves, moonlit fountains)
- 15% diverse-biome (arctic ice caves, jungle canopy nooks, desert oasis under a palm, mountain meadow, coastal tide pools)
- 10% travel/transient (tiny gypsy wagons, balloon baskets, treehouse rope-bridges, riverboat decks)
- 10% architectural-specific (lighthouses, observatories, bell towers, water mills, garden sheds, market stalls)

━━━ DEDUP DIMENSIONS ━━━
Dedup by: location type + specific micro-detail. "cottage kitchen with copper pots" and "cottage kitchen with knitted blanket on a chair" must NOT both exist — pick one and move on. "mossy forest clearing" and "moonlit fairy ring in a forest clearing" are distinct.

━━━ HARD BANS ━━━
- NO creatures or characters (separate axis)
- NO time-of-day language (separate axis — no "morning" / "evening" / "golden hour")
- NO weather (separate axis — no "rainy" / "snowy" / "sunny")
- NO human furniture-specific items (no "computer" / "phone" / "modern appliance")
- NO dark / spooky / scary undertones (no "abandoned" / "haunted" / "decrepit")

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
