#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/coquettebot/seeds/pink_nature_scenes.json',
  total: 200,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} PINK NATURE SCENE descriptions for CoquetteBot's pink-nature path — the girliest, most romantic nature imaginable. Cherry-blossom paths, pink peony fields, pastel sunsets, lavender meadows.

Each entry: 15-30 words. One specific pink/pastel nature vista.

━━━ CATEGORIES ━━━
- Cherry-blossom paths (sakura tunnels, petals raining, soft pink canopy)
- Pink peony fields (endless peonies blooming, soft pastel sunlight)
- Rose-garden golden hours (climbing roses, warm amber filtering through)
- Lavender fields with pink sky at dusk
- Pastel sunsets over pink-sanded beaches
- Magnolia-tree blossom paths in spring morning
- Pink-flamingo lake backdrops (distant water)
- Rose-valley with morning mist
- Pink-salt-flat mirror pools at dawn
- Pink hydrangea fields (huge blossom clusters, cottage paths)
- Wisteria tunnels in soft-pink variant
- Pink daisy meadows at sunrise
- Blossoming pear orchards (cream + pink)
- Peach-tree groves in spring bloom
- Mountain-top pink-alpine wildflower meadows
- Rose canyon with waterfalls (pink-stained stone + water)
- Pink-lake lotus paths
- Cherry-blossom bridges over still water
- Sakura-petal-carpeted courtyards
- Rose-draped archways in meadow gardens
- Pink-opal sunsets over ocean (meadow shore)
- Cotton-candy cloud cumulus sunsets (pink + peach)
- Camellia-bush-lined stone paths
- Pink-tinted autumn forests (rose-gold leaves)
- Pink moss carpets in enchanted glades
- Pink-rhododendron paths in hills

━━━ RULES ━━━
- Pink dominates — supporting pastels OK
- Nature as hero, no humans, no creatures
- Romantic / dreamy / soft
- Earth-plausible biology (no alien-glowing-moss — that's GlowBot)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
