#!/usr/bin/env node
/**
 * FarmBot — cozy_inn_interior_place bespoke pool ("Cozy Inn Interior" path).
 *
 * Path-bespoke (not a shared cross-path pool) — this path's own signature
 * hero-setting axis, same pattern as POND_PLACE, VILLAGE_STREET_PLACE,
 * WOODLAND_WALK_PLACE, etc. The warm common room of a small village inn —
 * a crackling hearth, worn wooden tables and mismatched chairs, hanging
 * dried herbs/mugs, a well-loved rug, maybe a cat by the fire.
 *
 * WORLD_DETAIL_PROPS' 15 `indoor`-tagged entries were checked first (per
 * CLAUDE.md hard rule to reuse before building bespoke) and rejected as a
 * base: every one of them reads as a PRIVATE farmhouse cottage kitchen (a
 * single rocking chair + quilt, a lone reading nook, a spinning wheel in a
 * sunlit corner) — intimate, one-family-scale, and already exactly the
 * territory rainy-farmhouse-morning.js occupies. This path needs a
 * genuinely different physical + social register: a PUBLIC gathering room
 * built for many patrons at once — multiple worn tables, ROWS of mismatched
 * chairs/benches, a big communal hearth (not a single-family stove), a
 * hanging rack of tankards/mugs for many guests, barrels of cider/ale, a
 * serving counter — larger in scale and furnished for strangers passing
 * through, not a family's own kitchen. Hence the bespoke pool.
 *
 * DELIBERATE DISTINCTION from rainy-farmhouse-morning (also a warm-hearth
 * indoor mood path — see that file's header): different furniture (a room
 * full of worn tables/mismatched chairs/benches vs. one rocking chair and a
 * window seat), different scale (a room meant to seat many vs. a single
 * cozy nook), different social feel (a public inn common room strangers pass
 * through vs. a private family farmhouse kitchen). No teacup shelves, no
 * spinning wheel, no reading nook — those stay rainy-farmhouse-morning's.
 *
 * Same implied-crowd-language ban baked in as gen-village-street-place-pool.js
 * (this is a PLACE pool — zero people, not even implied ones; the character
 * layer is a separate pickCharacter() pick composed at render time in the
 * path file) plus an explicit ban on readable text (menu boards, chalk
 * signs, tavern-name signage) and on metaphorical light language (the
 * "coins of light" trap documented in FARMBOT_PATH_BUILD_STATE.md — use
 * literal "pools"/"patches"/"glow" language for light instead).
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_cozy_inn_interior_place.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct COZY VILLAGE INN COMMON ROOM descriptions for a
warm, storybook countryside bot — the warm common room of a small village inn as a rich, living
little world of its own, entirely through its physical details. The room itself (or a piece of it
— the hearth corner, a row of tables, the serving counter) is ALWAYS the grammatical subject named
FIRST in the sentence.

CRITICAL — this is a PUBLIC GATHERING ROOM, built to seat many travelers and villagers at once —
NOT a single family's private farmhouse kitchen (that belongs to a different scene; avoid a lone
rocking chair, a single reading nook, or a spinning wheel — those read as one-family-scale, not
communal). Lean into COMMON-ROOM hero imagery at a larger, public scale: a big stone or brick
hearth with a crackling fire (large enough to warm a whole room, sometimes with a black iron
cauldron or kettle swinging on an arm), several worn wooden tables of different shapes and sizes
each ringed by mismatched chairs, stools, or benches, a hanging rack or low beam strung with rows
of pewter or copper mugs and tankards, thick bundles of dried herbs and braided garlic hanging from
the ceiling beams, a well-loved patterned rug worn thin with a soft-faded design in the well-trodden
middle, a long wooden serving counter or bar with a row of barrels or casks stacked behind or beside
it, low smoke-darkened ceiling beams strung with lanterns or candle sconces, a broad stone or
flagstone floor partly covered by the rug, a wide window with thick shutters (open or closed) and
deep sills, a well-worn wooden staircase curving up toward guest rooms above, a coat rack or row of
pegs hung with travel cloaks and hats, a chalkboard-free mantel cluttered with small trinkets and a
tarnished candlestick, a game of dice or a half-finished round of cards left on a table, a cat
curled asleep on a warm hearthstone or windowsill, a broom leaning in a corner, a basket of kindling
by the hearth. Vary time of day (a quiet sunlit late morning, a warm golden afternoon, a lamplit
evening glow, a hushed pre-dawn hush before the room fills), which lush details lead, and camera
angle (a wide view across the whole room, close on the hearth corner, close on one table-and-chairs
corner, looking toward the serving counter).

CRITICAL — do NOT describe any metaphorical or figurative language for light that names a literal
object other than light itself (e.g. never "coins of light," "ribbons of gold," "petals of
firelight") — Flux renders these literally. Use plain, literal light language instead: "pools of
warm light," "a soft amber glow," "patches of firelight," "the fire's warm glow spilling across."

CRITICAL — do NOT describe a cluster of similar round/small objects (mugs, stones, barrels) with
individual per-object action verbs (never "each mug catching the light" or "every stone glowing").
Describe such clusters holistically as one group instead ("a row of mugs catching the firelight,"
"the barrels standing shoulder to shoulder").

CRITICAL — this is a PLACE description with NO people in it at all, not even implied ones. Do
NOT mention: figures, crowd, patrons, guests, travelers, riders, children, kids, bystanders,
onlookers, laughter, faces, hands, someone/anyone doing something, footprints (implies a walker
just left), or any other word implying a person is present or was recently present.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["A wide stone hearth dominates one end of the room, its crackling fire throwing a soft amber glow across a cluster of worn wooden tables ringed by mismatched chairs, a row of pewter mugs hanging from a low beam above.", "A long wooden serving counter runs along one wall, a row of squat wooden casks stacked behind it, thick bundles of dried herbs and braided garlic swaying gently from the smoke-darkened beam overhead in the lamplit evening glow."]

🚫 STRICT BANS: NO named people/characters, NO implied people (figures/crowd/patrons/guests/
travelers/riders/children/kids/bystanders/onlookers/laughter/faces/hands/footprints), NO readable
text/signage/menu boards/chalk signs/tavern-name boards/price tags/lettering/numbers of any kind,
NO brand names, NO photographer/camera-brand names, NO bare/empty room lacking hearth/table/beam
detail, NO metaphorical light-as-object language ("coins of light," "ribbons of gold" — literal
light language only), NO per-object personified action on clusters of round objects, NO single-
family-kitchen imagery (a lone rocking chair, a single reading nook, a spinning wheel — this is a
communal public room, not a private farmhouse kitchen).

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
