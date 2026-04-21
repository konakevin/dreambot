#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/titanbot/seeds/cozy_mythic_settings.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} COZY MYTHIC SETTING descriptions for TitanBot's cozy-mythic path — warm quiet mythic pockets. Inhabited cultural spaces + natural mythic-nature. Pantheon diversity. Peripheral mythic creatures at REST welcome.

Each entry: 15-30 words. One specific cozy mythic setting.

━━━ INHABITED CULTURAL SPACES ━━━
- Greek symposium (wine-filled cups, reclining-couches, warm amphorae, candlelight)
- Norse longhouse (hearth-fire blazing, mead-benches, fur-draped, wooden-carved)
- Japanese tea-house (tatami, low-table with cha, shoji-doors, garden-view)
- Aztec stone-bath (warm subterranean pool, jade-mosaic walls)
- Celtic druid-cottage (herb-bundles, oaken rafters, peat-fire, sheep nearby)
- Hindu temple-kitchen (spice-racks, brass pots, incense, amma-figure blessings)
- African communal-hearth (sunlit courtyard with cooking-pot, storyteller-seat)
- Egyptian scribe-study (papyrus-scrolls, ink-pots, oil-lamp, cat nearby)
- Chinese immortal-garden (rockery, pond with koi, bamboo, scholar-stone)
- Mesopotamian reed-hut (date-palm leaves, honey-jars, copper-vessels)
- Viking bathhouse (steaming hot-tub, wooden walls, fur towels)
- Greek olive-grove with shepherd-hut in background
- Shinto tea-ceremony chamber with kettle steaming
- Incan stone-oven kitchen with warm bread baking
- Slavic izba cottage with baba-yaga aesthetic warm-fire
- Mayan royal-chamber with warm-sun-through-latticed-stone
- Buddhist temple-alcove with meditation-cushion warm-candle
- Polynesian thatched-hut with ocean-view warm-light
- Native American tipi interior with hearth-fire and pelts

━━━ NATURAL MYTHIC-NATURE ━━━
- Sacred grove (ancient oak-circle with ribbon-offerings, dappled light)
- Kami-meadow (Shinto sacred meadow with small shrine, peaceful light)
- Fox-spirit oak (ancient tree with fox-shrine, foxes visible at rest)
- Sleeping-dragon-cave (cave-mouth with sleeping dragon visible, warm glow)
- Nymph-pool (forest-pool in moss-grove, ethereal mist)
- Druid-cauldron clearing (cauldron steaming in forest clearing, warm fire)
- Spirit-deer grazing meadow (fae-deer in sun-meadow)
- Fairy-mound at dusk (celtic mound with tiny-lights emerging)
- Orisha-river bend (peaceful riverbank with offering-calabashes)
- Naga-serpent-pond (pond with multi-hooded naga at rest on rock)
- Kirin-meadow (Chinese chimera-unicorn grazing peacefully)
- Kitsune-cave with nine-tails curled sleeping, foxfire-flames
- Hanuman-monkeys at rest in banyan tree
- Fae-glen with tiny-spirits at tea around mushroom
- Ash-tree Yggdrasil-roots with squirrel Ratatoskr visible
- Apollo's-laurel grove with golden light
- Elysian field of asphodel quiet
- Takamagahara rice-paddy terrace at golden hour
- Aztec sacred-ceiba tree with parrots
- Inuit polar-bear-spirit napping on ice-floe

━━━ RULES ━━━
- Warm + quiet + peaceful — never dramatic
- Mix inhabited cultural spaces + natural with peripheral creatures at rest
- Pantheon diversity

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
