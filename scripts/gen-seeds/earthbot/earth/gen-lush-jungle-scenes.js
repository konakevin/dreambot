#!/usr/bin/env node
const { generatePool } = require('../../../lib/seedGenHelper');
const { BLOWN_UP_EARTH_ENTRY_MANDATE } = require('../../../lib/blownUpSeedMandate');
generatePool({
  outPath: 'scripts/bots/earthbot/earth/seeds/lush_jungle_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} LUSH JUNGLE scenes for TravelBot — Amazon / Borneo / Costa Rica / Bali / Daintree / Hawaii rainforest, multi-tier waterfalls, hidden pools, dense canopy, vine curtains, the kind of jungle a viewer wants to step INTO. Mid-to-wide framing. No people.

Each entry: 18-28 words. One specific tropical rainforest scene with a distinct hero feature. Real Earth jungles only — no fantasy, no magic.

━━━ CATEGORIES (mix across all) ━━━
- Multi-tier waterfalls into emerald pools (Iguazu cascade tiers, Pongour stepped falls, Pearl Shoal, Plitvice tropical-tier)
- Hidden jungle waterfalls (small cascade behind ferns, thin ribbon falling into mossy bowl, twin falls in Costa Rica cloud forest)
- Amazon river bends (wide brown river curving through dense overhanging canopy, distant macaws, fallen-log bank)
- Costa Rica cloud forest (hanging Spanish moss curtains, orchids on every branch, mist through canopy, Monteverde-style)
- Borneo rainforest canopy (emergent dipterocarp giants towering 250 feet, orangutan-territory dense understory)
- Hawaii jungle valley (Wailua-style green-walled valley, ribbon waterfall, taro-pond hints, double rainbow over canopy)
- Bali rice-terrace jungle edge (stepped rice terraces meeting jungle, palm fringes, mist rising at dawn)
- Daintree rainforest (oldest jungle on Earth, fan palms, cassowary undergrowth, ribbon creek through buttress roots)
- Bromeliad-laden branches (dozens of bromeliads thick on a single horizontal limb, rainwater in their cups, frogs visible)
- Vine curtain / liana drape (massive vines coiling and hanging, parting to reveal hidden waterfall behind)
- Hidden temple ruins (Angkor / Ta Prohm strangler-fig roots over stone temple absorbed by jungle, moss-covered carvings)
- Dense canopy sun-shafts (godrays piercing canopy gap onto jungle floor, fern carpet, pollen thick in air)
- Rainforest pool with life (clear emerald pool, tropical fish visible, ferns leaning in, dragonflies skimming)
- Mist morning jungle floor (low ground-fog rolling between buttress roots, soft early light, dew on every leaf)
- Strangler fig cathedral (massive parasitic fig system creating chambered hollow, vines and roots like architecture)
- Jungle stream with dappled light (clear shallow stream over stones, light striping water, tree-frogs on leaves)
- Cenote with jungle overhang (Mexican cenote with ferns and roots dangling from rim, sunbeam piercing into pool)
- Bamboo jungle Bali (vertical green bamboo columns dense, light-shafts striping, stream cutting through)
- Toucan in foliage (vibrant toucan or macaw on jungle branch with passion-fruit vines and orchids)
- Jungle waterfall pool from above (looking down at swimmer's-paradise pool with cascade, ferns ringing, parrots in branches)

━━━ RULES ━━━
- Mid-to-wide framing — the jungle is the hero, not a single leaf or single bird
- Real-place anchoring beats generic "jungle" — specific identifiable rainforest archetype each entry
- Crank the BLOW_IT_UP elements: density, saturated greens, water features, vivid accent colors (flowers/birds/frogs/butterflies)
- Hero feature in every entry — what's the one thing that makes the viewer want to step in?
- 18-28 words — specific, tactile, layered, HUMID
- No two entries share the same hero feature
- NO PEOPLE / NO HUMANS / NO FIGURES anywhere

${BLOWN_UP_EARTH_ENTRY_MANDATE}

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
