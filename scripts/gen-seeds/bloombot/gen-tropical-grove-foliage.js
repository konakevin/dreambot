#!/usr/bin/env node
/**
 * BLOOMBOT_TROPICAL_GROVE_FOLIAGE — supporting tropical foliage massing
 * in a Hawaiian Dr-Seuss giant-flower wonderland. Monstera leaves, fan
 * palms, banana leaves, tree-ferns, liana vines.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/bloombot_tropical_grove_foliage.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} FOLIAGE entries for BloomBot's tropical-grove path — supporting tropical foliage masses surrounding the giant flower hero. Each entry is one descriptive line, 30-50 words. NO leading CAPS NAME — flowing prose. Each names the foliage TYPE + form + scale + how it frames or supports the bloom-hero.

━━━ THE BAR ━━━
Every entry names a SPECIFIC tropical foliage type: monstera, fan palm, banana leaf, tree-fern, liana vine, bird-of-paradise leaf, philodendron, calathea, ginger leaf, taro, elephant ear, ponytail palm, traveler's palm, cycad, bromeliad, etc. Each must specify form (massed wall, towering arch, cascading curtain, dense thicket) + scale (door-sized, head-high, towering, overhead) + light interaction (backlit, dappled, glossy, deep-shade).

━━━ EXAMPLE PHRASINGS (mirror this register) ━━━
"Giant split-leaf monstera leaves clustered in a towering glossy-green wall, each fenestrated blade the size of a door, deep emerald and dramatically backlit, framing the scene with bold architectural presence"
"Towering fan-palm fronds arcing overhead in a vast layered canopy, each frond fanning wide and overlapping, casting dappled filtered light across the grove below in sweeping tropical grandeur"
"Broad banana leaves massed in a dense paddle-shaped grove, each enormous frond layered over the next in rich overlapping green, their waxy surfaces catching warm light along every ribbed midvein"
"A thicket of tree-ferns rising tall with great unfurling crowns, soft feathered fronds spiraling outward in layered tiers, crowding the midground in a dense lush press of deep tropical green"
"Long hanging liana vines draping in heavy green curtains from the canopy far above, trailing looping tendrils cascading downward in layered swags, framing the scene like a living verdant theatrical scrim"

━━━ VARIETY MANDATE (distribute across these categories) ━━━
- ~6 MONSTERA / SPLIT-LEAF (giant monstera wall, swiss-cheese-leaf canopy, fenestrated-blade mass, monstera deliciosa tower, climbing-monstera curtain, giant monstera shelf)
- ~6 FAN PALM / PINNATE (fan-palm arc, traveler's-palm fan, raphis-palm thicket, sago-palm cluster, sabal-palm overhead, washingtonia)
- ~6 BANANA / MUSA (banana-leaf paddle-mass, banana-grove thicket, dwarf-banana cluster, plantain wall, red-banana hero, banana-pup-and-trunk)
- ~5 TREE-FERN (cyathea tree-fern, dicksonia tree-fern crown, alsophila tree-fern, tree-fern thicket, koru-spiral fern-frond)
- ~5 LIANA / VINE (heavy liana curtain, climbing fig-vine, swing-rope strangler-fig, philodendron-vine drape, ivy-style hanging tendril)
- ~4 PHILODENDRON / ARACEAE (huge philodendron leaves, anthurium glossy-leaf cluster, alocasia elephant-ear, calathea zebra-striped, dieffenbachia)
- ~4 CALATHEA / PRAYER-PLANT (calathea pattern-leaves, prayer-plant mass, ctenanthe striped, maranta close-mass, jewel-orchid foliage)
- ~3 BROMELIAD (tank-bromeliad cluster, neoregelia rosette, tillandsia-air-plant chain, vriesea hero-frond)
- ~3 GINGER (ginger-leaf paddle, alpinia ginger-stalk, hedychium ginger-leaf mass, curcuma-ginger cluster)
- ~3 TARO / COLOCASIA (giant taro-leaf hero, colocasia paddle-mass, elephant-ear cluster, dasheen-leaf cluster)
- ~3 BIRD-OF-PARADISE (strelitzia-leaf cluster, traveler's-palm strelitzia-style, white-bird strelitzia tower)
- ~3 CYCAD / ANCIENT (cycad crown, sago-cycad mass, encephalartos sentinel, dioon-fern-like cluster)
- ~3 COCONUT / TROPICAL TREE (coconut-palm trunk + crown, royal-palm trunk-line, foxtail-palm cluster, queen-palm canopy)
- ~3 BAMBOO (towering bamboo grove, golden-bamboo thicket, green-bamboo wall, black-bamboo cluster)
- ~3 SUCCULENT-TROPICAL (giant agave silhouette, euphorbia candelabra, jade-tree mass, dragon-blood tree)
- ~3 ORCHID / EPIPHYTE (epiphytic orchid drape, vanda orchid cluster, dendrobium chain, cymbidium hanging-mass)
- ~3 PALM-FROND OVERHEAD (coconut frond-curve overhead, royal-palm canopy, foxtail crown-light, queen-palm dappled overhead)
- ~3 STRANGLER / ROOT-MASS (strangler-fig root-mass, banyan aerial roots, mangrove-prop-root, buttress-root tree-base)
- ~3 SMALL-LEAF DENSE (croton color-leaf wall, codiaeum striped-mass, neoregelia mass, alocasia-velvety hero)
- ~3 GIANT-LEAF SOLO (single giant gunnera, lone palm-frond hero, single alocasia-tower, single banana-paddle-leaf)

━━━ BANS ━━━
- NO photographer-name drops.
- NO sci-fi / no neon / no hologram.
- NO sterile-foliage register — these are LUSH, GLOSSY, DRAMATIC, OVERFLOWING tropical foliage.
- NO bare "green plants" — name the SPECIFIC species/type + form + scale.
- NO leading CAPS NAME — flowing prose only.

━━━ FORMAT ━━━
Each entry: 30-50 words. Flowing prose — NO leading CAPS NAME. Names species/type + form + scale + light qualifier.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
