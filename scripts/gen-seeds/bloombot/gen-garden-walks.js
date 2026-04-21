#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/garden_walks.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} GARDEN-WALK SCENE descriptions for BloomBot's garden-walk path — walkable outdoor flower spaces DIALED TO 10× (physics-defying density, more blooms than should exist). Paths, trails, hedge tunnels, arches, meadows — all OVERTAKEN by flowers. Not dramatic-backdrop (that's landscape path). Not interior (cozy). Walkable-scale OUTDOOR beauty cranked to maximum.

Each entry: 15-30 words. Names the walkable space + the absurd floral density.

━━━ CATEGORIES ━━━
- Stone paths engulfed in blooms spilling over every edge
- Forest trails where every branch drips with climbing flowers
- Hedge tunnels densely draped with climbing roses
- Rose-covered arbor walks
- Wildflower meadow trails at eye-level
- Cottage garden pathways with flowers tumbling from every border
- Wisteria pergola tunnels with cascading purple curtains
- Moss-lined forest paths with flowers erupting from every tree
- Japanese temple garden walks with cherry blossom blizzards
- Italian villa terrace gardens cascading with hanging blooms
- French chateau formal gardens but every hedge explodes with flowers
- English cottage garden paths through overflowing borders
- Desert bloom paths with wildflowers taking over dunes
- Alpine meadow trails carpeted in impossible density
- Japanese iris paths along water edges
- Redwood trails with ferns + impossible flower density at every root
- Bamboo + orchid paths with vertical bloom walls
- Mountain stream paths with wildflowers lining every stone
- Lavender field pathways
- Cherry blossom avenues
- Sunflower field narrow paths towering overhead
- Tropical greenhouse paths (outdoor-feeling despite glass) dripping orchids
- Ancient stone steps carpeted in moss + wildflowers
- Mediterranean village cobblestone paths with bougainvillea avalanche
- Rope-bridge paths over canyon with vines in full bloom
- Amish farm path lined with sunflower walls
- Tulip-field pathways stretching horizon to horizon
- Ruined castle gardens with wildflowers reclaiming every stone
- Walled-garden doorways peeking through into bloom-stuffed spaces

━━━ RULES ━━━
- Walkable / intimate scale (you could step into it)
- OUTDOOR
- Flower density must be DIALED — more than realistic
- Focus on the path / trail / arch / space (the setting)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
