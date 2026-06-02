#!/usr/bin/env node
const { generatePool } = require('../../../lib/seedGenHelper');
const { BLOWN_UP_EARTH_ENTRY_MANDATE } = require('../../../lib/blownUpSeedMandate');
generatePool({
  outPath: 'scripts/bots/earthbot/earth/seeds/deep_forest_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (
    n
  ) => `You are writing ${n} DEEP FOREST scenes for TravelBot — old-growth temperate forest, redwood cathedrals, mossy hike-discoveries, the kind of forest a viewer wants to step INTO. Mid-to-wide framing. No people.

Each entry: 18-28 words. One specific old-growth or jungle-adjacent forest scene with a distinct hero feature. Real Earth forests only — no fantasy, no magic.

━━━ CATEGORIES (mix across all) ━━━
- Redwood / sequoia cathedrals (godrays piercing 300-foot trunks, cathedral canopy, fern-carpet floor — Sequoia NP, Redwood NP, Avenue of the Giants)
- Pacific Northwest old-growth (Hoh rainforest moss curtains, Olympic NP cedar columns, Quinault dense fern undergrowth)
- Mossy creek through old-growth (clear creek over moss-boulders, ferns leaning over water, dappled light pools)
- Hike-discovery cabin (small abandoned wood cabin overgrown with moss/ferns/vines in deep forest clearing, stone chimney, hidden trail leading to it)
- Fallen-log bridge (massive moss-covered fallen sequoia spanning a creek, hikable, ferns growing along its length)
- Hidden forest waterfall (thin tall cascade falling into a green pool surrounded by old-growth, mist rising through trunks)
- Glowing fungi discovery (bioluminescent mushrooms or bracket fungi at twilight, ferns at base, moss-trunk backdrop — real species like foxfire/jack-o'-lantern)
- Cedar/cypress grove (Japanese cedar grove with stone lantern, Yakushima ancient cedars, Bavarian alpine spruce cathedral)
- Old-growth boardwalk trail (raised plank trail snaking through giant ferns, mist, godrays, mossy trunks framing the path)
- Bamboo forest (Arashiyama-tier bamboo grove, vertical green columns to infinity, light shafts striping the path)
- Forest clearing meadow (sunlit clearing in old-growth, wildflowers in golden grass, ringed by giant trunks)
- Autumn old-growth (giant trees in autumn color — beech, maple, oak — leaf-carpet floor, low golden light)
- Mossy root cave (hollow at base of giant tree, fern-curtain entrance, soft green light inside)
- Foggy alpine forest (Bavarian/Black Forest pine forest with thick fog rolling between trunks, distant cabin glow)
- Misty jungle-edge forest (where temperate meets tropical — Costa Rica cloud forest, hanging moss, orchids on trunks)
- Riverbank old-growth (wide forest river bend with moss-trunks reaching to water, log-jam, otter slide, beaver dam)
- Hike trail vanishing point (well-worn dirt trail disappearing between giant trunks, moss-stones, fallen-log seat, distant light)
- Forest after rain (everything wet and saturated — wet bark, dripping ferns, glistening mushroom caps, mist rising from earth)
- Snow-dusted old-growth (winter cedar forest, snow on every branch, single godray through canopy, blue-shadow snow floor)
- Moss-cloak boulder field (giant glacial boulders deep in forest carpeted in 6-inch-thick moss, ferns growing from cracks)

━━━ RULES ━━━
- Mid-to-wide framing — the forest is the hero, not a single tree or single mushroom
- Real-place anchoring beats generic "forest" — specific identifiable forest archetype each entry
- Crank the BLOW_IT_UP elements: density, atmosphere, light phenomena, micro-detail
- Hero feature in every entry — what's the one thing that makes the viewer want to walk in?
- 18-28 words — specific, tactile, layered
- No two entries share the same hero feature
- NO PEOPLE / NO HUMANS / NO FIGURES anywhere

${BLOWN_UP_EARTH_ENTRY_MANDATE}

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
