#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/prehistoric_settings.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} PREHISTORIC SETTING descriptions for DinoBot — era-specific prehistoric landscapes.

Each entry: 15-30 words. One specific prehistoric setting.

━━━ CATEGORIES ━━━
- Cretaceous forest with giant ferns and cycads
- Jurassic coastline with volcanic peaks distant
- Carboniferous swamp with giant horsetails
- Triassic desert with dunes and rocky outcrops
- Early-Cretaceous plain with scattered conifers
- Volcanic-era highlands with lava-flows
- Amber-forest with fossilized-insects in sap
- Inland sea with pterodactyl cliffs
- Cretaceous river-delta with mudflats
- Pine-and-fern forest at dawn
- Open savanna prehistoric with distant herbivores
- Misty-valley with fog-drifting
- Primordial jungle dense-canopy
- Cretaceous lagoon with tidal flats
- Volcanic-island early-period
- Ash-covered post-eruption landscape
- Jurassic meadow with wildflowers (Cretaceous angiosperms)
- Prehistoric canyon with layered cliffs
- Redwood-size-precursors ancient forest
- Cretaceous coastline with marine-reptiles offshore
- Primordial waterfall
- Fern-glade shady
- Mossy riverbank at dawn
- Crater-lake prehistoric
- Gingko-tree grove
- Cycad-forest dense
- Horsetail-reeds swamp
- Araucaria-pine grove
- Cretaceous rainforest dense
- Paleozoic-delta muddy
- Volcanic-crater floor
- Saltflat prehistoric
- Prehistoric cliff-edge with sea-winds
- Jurassic-era island with pterosaur-colony
- Morrison-formation-style plains
- Hell-Creek-style floodplain
- Djadochta-style desert (Gobi-like)
- Lance-formation-style grassland

━━━ RULES ━━━
- Era-specific (Cretaceous / Jurassic / Triassic / Carboniferous)
- Scientifically plausible flora
- Settings where distant dinos can appear as silhouettes

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
