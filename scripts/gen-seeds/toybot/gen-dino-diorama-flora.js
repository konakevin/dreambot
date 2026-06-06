#!/usr/bin/env node
/**
 * DINO_DIORAMA_FLORA — lush sculpted-clay plant life + set
 * decoration packed at every depth. Crazy clay trees, giant ferns,
 * twisted vines, towering mushrooms, fallen logs, reeds, flowering
 * plants — the foliage that makes the diorama feel overgrown +
 * busy + richly decorated.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/dino_diorama_flora.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} LUSH CLAY FLORA + SET-DECORATION entries for ToyBot dino-diorama — sculpted-clay plant life at every depth that makes the world feel overgrown, busy, and richly decorated. Each entry is one sentence, 25-40 words, naming 3-4 specific clay plants/flora details.

━━━ THE BAR ━━━
Every entry names 3-4 clay plant types in one sentence — distributed across foreground, midground, and distance. The clay material is named explicitly. The flora is varied and stacked so no two zones look the same. The world MUST feel LUSH, never sparse.

━━━ EXAMPLE PHRASINGS (mirror this register) ━━━
"Towering clay redwood trunks loom over squat clay cycads, while tangled clay vines drape between them and tiny clay mushroom clusters dot a mossy clay log below."
"Giant clay tree-ferns arch overhead, flanked by bulbous polka-dot clay pods on thick stalks, with clay cattails and a flat clay lily-pad floating on sculpted clay water."
"Gnarled twisted clay trees grip crumbling clay boulders, clay hanging moss drips between branches, and curly spiral clay fronds push up from the clay soil in dense clusters."
"Drooping clay willows trail long thin clay tendrils, fat clay toadstools with spotted caps rise beneath, and a lumpy clay rock-arch frames a patch of stubby clay shrubs."

━━━ VARIETY MANDATE (distribute across these plant categories) ━━━
- ~4 PREHISTORIC TREES (clay tree-ferns, clay cycads, clay ginkgoes, clay redwoods, clay araucarias, clay magnolias, clay petrified-wood snags, clay calamites)
- ~3 GIANT FERNS (giant clay tree-ferns, clay seed ferns, clay scrambling ferns, clay fiddleheads, clay royal ferns, clay tropical ferns)
- ~3 VINES / TENDRILS (twisted clay vines, clay liana, clay creeper vines, clay hanging vines, clay strangler vines)
- ~3 MUSHROOMS / FUNGI (giant clay toadstools, clay puffballs, clay coral-mushroom clusters, clay bracket-fungi on logs, clay mycelium ridges, clay glowing mushrooms)
- ~3 GROUND COVER / MOSSES (clay moss carpets, clay club-moss patches, clay liverwort flats, clay lichen patches, clay clover spreads)
- ~3 EXOTIC ALIEN PLANTS (bulbous polka-dot pods, balloon-blossom clay flowers, alien tendrils, glowing clay bulbs, dimpled swollen-stem plants, spiked clay bromeliads)
- ~2 WATER PLANTS (clay water lilies, clay cattails, clay reeds, clay horsetails, clay floating pads)
- ~2 FALLEN LOGS / FOREST DEBRIS (fallen mossy clay logs, hollow clay trunks, scattered clay branches, decomposing clay stumps)
- ~2 FLOWERS / BLOOMS (clay magnolia flowers, clay primitive blossoms, clay wildflower clusters, clay bromeliads)
- ~1 BOULDERS / ROCKY SET-DRESS (clay rock-arches, clay boulder piles, clay rocky outcrops, clay rock-caves)
- ~1 BAMBOO / GROVE (clay bamboo grove, clay cane forest, clay grass-stand grove)
- ~1 ROOT SYSTEMS / BUTTRESSES (twisted clay roots snaking, exposed clay buttress roots, clay tendril roots gripping stone)

━━━ BANS ━━━
- NO single-plant entries — pack 3-4 plant types per sentence.
- NO dinosaurs / animals — flora axis is plants + set-dressing only.
- NO modern plants (palm-trees-with-coconuts unless prehistoric-coded, no grass-lawn).
- NO photoreal nature — every plant element is HANDMADE CLAY (name the clay).
- NO repeating the exact same 3-plant combination across entries.
- NO sparse "a single fern" — flora MUST feel LUSH and packed.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
