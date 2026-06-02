#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/jungle_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (
    n
  ) => `You are writing ${n} JUNGLE-CANOPY SCENE descriptions for CuddleBot's jungle-canopy path. Adorable rainforest / tropical / canopy / jungle-stream / mangrove / cloud-forest settings where cute baby jungle creatures live. SUPER OVERLAY CUTE — Pixar / Sanrio / Studio Ghibli / Jungle-Book / Encanto aesthetic. NEVER photoreal, NEVER documentary nature.

Each entry: 15-25 words. ONE specific jungle scene with HABITAT details + cute interaction hint.

━━━ HABITAT TYPES (mix broadly across all entries) ━━━
- Canopy treehouse-cluster (cute leaf-roof huts on giant branches, vine-bridges, lantern-flowers)
- Vine-hammock dell (slung vines as nap-hammocks, hanging-flower curtains, sun-dappled clearing)
- Hot-spring grotto (steaming turquoise pool, mossy boulders, ferns, bamboo-leaf canopy)
- Jungle waterfall pool (gentle waterfall into a bright pool, mossy stones, lily-pads at edge)
- Banana-tree clearing (cluster of banana trees, fallen banana-leaves as picnic blankets)
- Bamboo grove (tall bamboo, dappled gold light, soft moss carpet)
- Cloud-forest mist scene (pearl-mist drifting between huge ferns, sun-shafts piercing)
- Mangrove root-playground (curving mangrove roots above shallow water, crab-friends)
- Treehouse village in giant ceiba (multiple hut-rooms in a single huge tree, rope-ladders, lantern-vines)
- Mossy log nursery (huge fallen log covered in moss + mushroom + pixie-cup, baby-creature den)
- Tropical lily-pond (lily-pads, lotus blossoms, dragonfly-arches, sun-glittering surface)
- Orchid-greenhouse (giant orchids forming a natural cathedral, dewdrops, butterfly-clouds)
- Jungle-floor mushroom market (giant mushrooms as stalls, fallen-leaf paths, moss-cushions)
- Vine-swing playground (long vines as swings, soft-grass landing, flower-confetti)
- Treetop tea-room (woven-leaf platform up in the canopy, leaf-cups, vine-string-lights)
- Sloth-nap mega-vine (extra-thick vine spanning the scene, flower-pillows, tiny snore-zzz)
- Jaguar-cub fern bed (fern-frond bed in the dappled understory, cool moss carpet)
- Toucan tea-party balcony (perched on a giant flower-bract, tiny tea-set, banana garland)
- Leaf-cutter-ant parade trail (column of cute ants carrying tiny leaves, jungle-floor view)
- Firefly-canopy at dusk (drifting firefly cloud, soft purple-pink twilight, lantern-flowers)

━━━ SUPER OVERLAY CUTE STYLE (every entry) ━━━
- Sun-dappled warm light filtering through giant leaves
- Warm leaf-green + sun-gold + coral-flower-pink + banana-yellow + sky-mint palette
- Mist drifting, dewdrops sparkling, butterflies fluttering
- Optional cute habitat-details (tiny lanterns hanging from vines, flower-garlands, mushroom stools, banana-leaf umbrellas)
- The scene ANTICIPATES creatures — leave room for cute pair to do something cute (nap, share, peek, swing)

━━━ ABSOLUTELY BANNED ━━━
- NO photoreal / NO documentary
- NO scary jungle / NO predator-with-teeth / NO dangerous-snake-coil
- NO realistic dirt + grime + biting-insect-swarm
- NO slasher-movie jungle / NO jungle-survival
- NO identifiable humans

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: habitat-type + key-feature + time-of-day. "Jungle clearing with vines" and "vine-clearing in jungle" are TOO SIMILAR. Vary HABITAT + LIGHT-CONDITION + UNIQUE-FEATURE across entries.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Vine-hammock dell at sun-dappled noon, slung vines as nap-hammocks, hanging-flower curtains, soft moss-carpet, butterfly garlands"
- "Hot-spring grotto in cloud-forest, steaming turquoise pool, mossy boulders, ferns dripping with dewdrops, dappled gold light"
- "Treetop tea-room platform high in the canopy, woven-leaf floor, leaf-cup and pink-petal saucer, vine-string-lights overhead"
- "Mossy log nursery on the jungle floor, huge fallen log carpeted in moss + tiny mushrooms, pixie-cup-fungus chandelier, soft fern-bed inside"
- "Banana-tree clearing at golden hour, fallen banana-leaves as picnic blankets, sun-gold light through banana-leaves, bunting of tiny flowers"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
