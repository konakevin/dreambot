#!/usr/bin/env node
/**
 * FarmBot — flower_shop_place bespoke pool ("Flower Shop" path).
 *
 * Path-bespoke (not a shared cross-path pool) — this path's own signature
 * hero-setting axis, same pattern as VILLAGE_STREET_PLACE (village-street-
 * wandering) and POND_PLACE (summer-evening-by-the-pond). A cozy INDOOR
 * flower shop interior — buckets of cut flowers, ribbon, a wooden counter,
 * hanging dried herb bundles, wicker baskets, glass jars, brown paper and
 * twine for wrapping — as a rich, living little world of its own. Needed
 * because WORLD_DETAIL_PROPS has no dedicated indoor-florist-shop coverage
 * (its indoor entries are bakery/farmhouse-generic; its garden/market
 * entries are all outdoor).
 *
 * Follows the woodland-walk/pond/flower-field pattern of weaving ambient
 * wildlife directly into the PLACE description itself (a small handful of
 * entries include a cat napping among the blooms) — the separate shared
 * ANIMAL_COMPANIONS layer is a distinct optional "featured animal moment"
 * on top, not a replacement for this.
 *
 * Lessons applied (per FARMBOT_PATH_BUILD_STATE.md):
 *   - metaphorical light language ("coins of light") can render as the
 *     LITERAL object — banned outright, literal phrasing only ("pools of
 *     light," "patches of light," "a warm glow").
 *   - per-object "agency" framing on a cluster of round/generic objects
 *     risks personified-face rendering under this bot's cheerful tone lock
 *     (lakeside-riverside-moment lesson) — flower heads/blooms are
 *     explicitly banned from being called "faces" or individually
 *     personified; describe clusters/buckets of blooms holistically.
 *   - this must read unmistakably as an INDOOR SHOP ROOM, not an outdoor
 *     garden or market stall — every entry anchors on interior
 *     architecture (floorboards, walls, ceiling beams, a doorway or
 *     window with panes) alongside the floral content.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_flower_shop_place.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct COZY INDOOR FLOWER SHOP descriptions for a cozy
countryside bot — the interior of a small village florist's shop as a rich, living little world
of its own, entirely through its physical details. The shop interior itself is ALWAYS the
grammatical subject named FIRST in the sentence.

CRITICAL — this is an INDOOR ROOM, not an outdoor garden, greenhouse, or market stall. Every
entry MUST anchor on interior shop architecture (worn wooden floorboards, a plaster or
wood-paneled wall, exposed ceiling beams, a doorway, a multi-paned window letting in daylight)
alongside the floral content, so it reads unmistakably as a small shop room, not the outdoors.

Lean into INDOOR-FLORIST hero imagery: galvanized metal buckets and tin pails of cut flowers
(roses, peonies, dahlias, sunflowers, tulips, wildflower bundles, sweet peas, ranunculus) lined
along the floor and on a sturdy wooden counter, spools and loops of ribbon in soft colors, brown
kraft paper and twine ready for wrapping, glass jars and vases of every shape holding smaller
arrangements, wicker baskets brimming with blooms, bundles of dried lavender or herbs hanging
from the ceiling beams or a wall hook, a weathered wooden counter or workbench scattered with
loose petals and trimmed stems, a pair of garden shears or a small watering can set to one side,
potted ferns or trailing greenery on a windowsill, a multi-paned shop window with soft daylight
slanting across the floor, an open doorway with a glimpse of the street beyond, floral wallpaper
or exposed stone on a back wall, a scatter of fallen petals on the floorboards. Vary time of day
(soft morning light, warm midday, golden late-afternoon glow), angle (looking across the whole
room, close on one counter corner, framed through the doorway), which blooms and colors dominate,
and which lush details lead. A small handful of entries (roughly 1 in 5) may include a cat
napping curled up among the flower buckets or on the counter — never more than one cat, and never
described as personified or expressive beyond simply sleeping.

CRITICAL — never describe an individual flower head, bloom, or petal as having a "face" or any
personified expression; describe buckets, bundles, and arrangements of flowers holistically as a
mass of color and shape, never any single bloom singled out with its own agency or expression.

CRITICAL — use only literal phrasing for light (a warm glow, pools of light, patches of
sunlight, a soft slant of daylight) — never metaphorical object-language for light (no "coins,"
"ribbons," or "threads" of light) since it can render as the literal object instead of light.

CRITICAL — this is a PLACE description with NO people in it at all, not even implied ones. Do
NOT mention: figures, crowd, riders, children, kids, bystanders, onlookers, laughter, faces,
hands, someone/anyone doing something, footprints (implies a walker just left), or any other word
implying a person is present or was recently present. (The one exception is the optional napping
cat described above — an animal, not a person.)

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["Galvanized metal buckets crowd the worn wooden floorboards of the little shop, each brimming
with cut peonies and garden roses in soft pinks and creams, morning light slanting through a
multi-paned window to pool across the counter's scattered petals.", "A sturdy wooden counter
scattered with trimmed stems and loose petals holds spools of pale ribbon and a roll of brown
kraft paper, bundles of dried lavender hanging from the exposed ceiling beams above, a ginger cat
curled asleep in an empty flower bucket nearby."]

🚫 STRICT BANS: NO named people/characters, NO implied people (figures/crowd/riders/children/
kids/bystanders/onlookers/laughter/faces/hands/footprints), NO readable text/signage/price
tags/labels/lettering/numbers of any kind, NO brand names, NO photographer/camera-brand names, NO
bare/empty room lacking floral/architecture detail, NO outdoor garden or greenhouse imagery (no
open sky, no garden beds, no rows of planted flowers in soil — everything is already CUT and in
buckets/vases/baskets indoors), NO market-stall-for-sale imagery (no crates, no price displays,
no outdoor awning), NO personified flower "faces" or individual bloom expressions, NO
metaphorical light-as-object language, more than one cat in a single entry, or any cat described
as doing anything other than sleeping/napping.

Output ONLY the JSON array, no preamble, no numbering.`,
  },
];

async function main() {
  for (const r of RECIPES) {
    console.log(`\n=== ${path.basename(r.outPath)} ===`);
    await generatePool(r);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
