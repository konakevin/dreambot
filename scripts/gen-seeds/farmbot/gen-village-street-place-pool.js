#!/usr/bin/env node
/**
 * FarmBot — village_street_place bespoke pool ("Village Street Wandering" path).
 *
 * Path-bespoke (not a shared cross-path pool) — this path's own signature
 * hero-setting axis, same pattern as POND_PLACE (summer-evening-by-the-pond),
 * FLOWER_FIELD_PLACE (flower-field-wandering), and HARVEST_FESTIVAL_PLACE
 * (harvest-festival). A charming village STREET as the hero — cobblestones,
 * flower boxes on windowsills, shop fronts, lampposts, doorways, the street
 * and its atmosphere itself, never the goods for sale.
 *
 * Kept deliberately distinct from two neighboring paths per Kevin's brief:
 *   - autumn-village-market (market-stall GOODS for sale — baskets of
 *     produce, crates, bunting over a shopping display) — this pool is NOT
 *     about goods laid out to buy, no stalls, no produce crates, no baskets
 *     of wares.
 *   - the old discarded market-town-square pool (townsfolk baked directly
 *     into the place description, Gemini-locked for signage risk) — not
 *     reused; this pool follows the current rebuild's architecture where the
 *     PLACE pool stays 100% people-free and the character layer is a
 *     separate pickCharacter() pick composed at render time.
 * This pool leans into STREET-AND-ATMOSPHERE hero imagery instead: worn
 * cobblestones, terracotta flower boxes crowding windowsills, half-timbered
 * or stone shop-front facades with glass-paned windows and striped awnings
 * (closed shutters or plain glass — never a display of goods), wrought-iron
 * lampposts, ivy climbing a wall, a cat dozing on a sunny stoop, a narrow
 * side-alley branching off, a low stone well or small fountain, window
 * boxes, a bicycle leaning against a wall, hanging flower baskets from
 * lamp-brackets, weathered wooden doors.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_village_street_place.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct CHARMING VILLAGE STREET descriptions for a cozy
countryside bot — a quiet cobblestone village street as a rich, living little world of its own,
entirely through its physical details. The street itself (or a stretch of it — cobblestones, a
lane, a corner) is ALWAYS the grammatical subject named FIRST in the sentence.

CRITICAL — this is about the STREET AND ITS ATMOSPHERE as the hero, walking THROUGH the village,
never about a market stall or goods laid out to buy. Lean into STREET-LEVEL hero imagery: worn,
uneven cobblestones (sometimes damp, sometimes sun-warmed), terracotta or weathered wooden flower
boxes crowding every windowsill and spilling trailing blooms, stone or half-timbered shop-front
facades with small glass-paned windows and striped or plain canvas awnings, wrought-iron lampposts
(unlit or glowing warm at dusk), ivy or climbing roses scaling a wall, a cat dozing on a sun-warmed
stoop or windowsill, a narrow side-alley or archway branching off the main lane, a low stone well
or small trickling fountain at a corner, hanging flower baskets swinging from lamp-brackets or
wall-brackets, a weathered wooden door with old iron hardware, a bicycle leaning against a wall, a
row of chimney pots against the sky, a puddle reflecting the street after rain. Vary time of day
(soft morning light, warm midday, golden late-afternoon, lamplit dusk), weather, angle (looking
down the length of the street, close on one cottage-and-doorway corner, an alley opening off the
main lane), and which lush details lead.

CRITICAL — this is about the STREET ITSELF, not a shop's wares. Do NOT describe: a market stall,
a display of goods for sale, crates or baskets of produce, price displays, a shopkeeper's counter,
or anything framed as merchandise. Shop fronts are architecture only — describe facades, windows,
doors, and awnings, never what is being sold inside or displayed outside.

CRITICAL — this is a PLACE description with NO people in it at all, not even implied ones. Do
NOT mention: figures, crowd, riders, children, kids, bystanders, onlookers, laughter, faces,
hands, someone/anyone doing something, footprints (implies a walker just left), or any other word
implying a person is present or was recently present.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["Worn cobblestones wind past a row of stone cottages, terracotta flower boxes crowding every windowsill and spilling cascades of pink geraniums, a wrought-iron lamppost standing unlit at the corner in the soft morning light.", "A narrow side-alley opens off the main lane between two half-timbered shop fronts, ivy climbing one whitewashed wall, a striped canvas awning rolled out over a small glass-paned window, a cat curled asleep on the sun-warmed stoop below."]

🚫 STRICT BANS: NO named people/characters, NO implied people (figures/crowd/riders/children/
kids/bystanders/onlookers/laughter/faces/hands/footprints), NO readable text/signage/shop-name
boards/price tags/lettering/numbers of any kind, NO brand names, NO photographer/camera-brand
names, NO bare/empty street lacking flower-box/architecture/cobblestone detail, NO market stalls
or goods-for-sale displays (produce crates, baskets of wares, price boards — that belongs to a
different scene), NO festival bunting, strung paper lanterns, or celebration decor (that belongs
to a different scene) — a single unlit or warmly-lit everyday lamppost is fine, festive string
lights are not.

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
