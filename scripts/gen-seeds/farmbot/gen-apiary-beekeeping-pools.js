#!/usr/bin/env node
/**
 * FarmBot — apiary-beekeeping bespoke pools (6 Sonnet-seeded axes).
 *
 * The path's other 2 axes (apiary_camera, apiary_keeper_kit) are HAND-AUTHORED
 * JSON, not generated — see the path file's header for why (the camera axis is
 * this path's single biggest hard-fail generator and has to be audited as a
 * SET; the kit axis needs an exact worn-veil / veil-off ratio so FarmBot's
 * "fully legible face" rule can never be broken by a roll).
 *
 * THE PATH'S IDENTITY + THE DULL FAILURE IT EXISTS TO AVOID
 * --------------------------------------------------------
 * The obvious apiary render is a row of white boxes in a green field — instant-
 * ly boring and something everyone has already seen. Every pool below is built
 * so that render is structurally impossible: the hero is always the CRAFT AND
 * THE STRANGENESS OF BEES AT CLOSE RANGE (a drawn frame held up with capped
 * comb glowing amber-translucent, the smoker's slow white curl rolling over an
 * open hive, a swarm hanging in a plum tree like a living fruit being coaxed
 * into a box, the uncapping knife opening a frame and honey sheeting into the
 * tank, a jar of just-spun honey on the shed windowsill, hives painted in
 * mismatched sky blue / buttermilk / faded rose stacked crooked along a
 * hedgerow), and the hives are the NEAR setting just behind it.
 *
 * AXIS-CLEAN DISCIPLINE (EarthBot LESSON 4 / the 2nd look-register amendment):
 * `apiary_air` owns time-of-day, weather and the colour of light. NO other
 * pool may name a time of day, a weather, a season or a colour of light — a
 * hero entry that says "golden afternoon" directly contradicts whatever the
 * air axis rolled. (The one allowance, stated in the hero recipe: a hero entry
 * MAY say light passes THROUGH the comb or the jar, because translucency is
 * the literal subject of that shot — it still may not name when, what weather,
 * or what colour.)
 *
 * GUARDS BAKED IN AT THE SOURCE (each one is a documented, render-costing bug
 * from FARMBOT_PATH_BUILD_STATE.md / BOT_SCENE_QUALITY_PLAYBOOK.md — they are
 * in the meta-prompt text, not just applied to the generated JSON, so a future
 * append run can't reintroduce them the way the 120-scale-up reintroduced
 * "horse keeper" and "wooden plant labels"):
 *
 *  1. TEXT PRIOR, AND IT HIDES IN SYNONYMS OF "TEXT" (33-path-run lesson 1).
 *     An apiary is a label magnet — honey jars mean labels, hive fronts are
 *     flat panels, the shed door is a flat panel, crate ends are flat panels.
 *     Banned outright across every recipe: label / lettering / writing /
 *     number / numeral / mark / marks / marking / glyph / sigil / stamped /
 *     engraved / etched / inscribed / script / plaque / sign / signage /
 *     chalkboard / tally / notch-as-record. The one SAFE positive form (the
 *     FaeBot MARKING LAW, 0 text failures in 9 renders) is required instead:
 *     every jar, hive front, crate end and shed door is plain smooth unpainted
 *     timber, OR painted one flat colour, OR carries one small painted picture
 *     of a flower / a leaf / a bee shape and nothing else, OR is wax-sealed and
 *     twine-tied with a sprig under the twine.
 *  2. INSECT RENDERING. Flux makes bees either invisible or horror-movie huge,
 *     so `bee_presence` must state a CONCRETE COUNT and a CONCRETE SIZE
 *     COMPARISON in every single entry, and the bees keep true insect anatomy
 *     described positively (furry thorax, banded abdomen, clear veined wings).
 *  3. ANTI-PERSONIFICATION. FarmBot's own papaya-guava-orchard bug: with no
 *     human in frame, Sonnet generalised the look register's big-anime-eyes
 *     character language onto the FRUIT. Bees are the single highest-risk
 *     subject for that. Handled as a RECIPE BAN here (so Sonnet never writes
 *     it into a seed) plus a positive template clause — never by naming
 *     "face"/"eyes" inside pool text, which would leak the tokens.
 *  4. PER-OBJECT AGENCY ON A CLUSTER (the personified river stones). A mass of
 *     bees IS a cluster of small round-ish objects. Every entry describes the
 *     mass holistically and gives individual detail to at most the 2-3 nearest.
 *  5. DARK + LIGHT CONTRADICTORY PAIRING (the fishing-dock bug: "a dark glint
 *     of water" escalated into a glowing beam with stars cut into a daytime
 *     scene). A LIVE risk here — backlit comb, sun through mist, a glow in the
 *     spray are exactly this content class. Banned in every recipe.
 *  6. METAPHORICAL LIGHT-AS-OBJECT ("coins of light" → literal gold coins).
 *     Banned. Literal light language only.
 *  7. IMPLIED-PERSON LANGUAGE. banHumanLanguage catches man/woman/person but
 *     not figures/crowd/children/hands/onlookers — banned explicitly.
 *  8. NEGATION LEAK. Pool entries describe only what IS present; no "no X"
 *     phrasing anywhere in a seed (FarmBot's fragment goes straight to Flux
 *     and CLIP cannot negate).
 *  9. MENACE. FarmBot is cozy: no stinging, no angry or attacking bees, no
 *     fear, no protective-suit-as-hazmat register. The bees are busy, calm and
 *     gentle; the keeper is unhurried.
 * 10. SCALE. A small, personal, hand-tended farm apiary of a handful of hives
 *     — never a commercial yard of a hundred pallets, never industrial.
 *
 * Run:  node scripts/gen-seeds/farmbot/gen-apiary-beekeeping-pools.js
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

// Shared ban block — appended to every recipe so a single edit fixes all six
// and no recipe can silently drift off the guard list above.
const BANS = `🚫 STRICT BANS (every one of these is a documented, render-costing failure on this bot):
- NO readable text of ANY kind and NONE of its synonyms: no label, no lettering, no writing, no words, no numbers or numerals, no mark/marks/marking, no glyph, no sigil, no stamp or stamped, no engraving, no etching, no inscription, no script, no plaque, no sign or signage, no chalkboard, no tally or record of notches. Every jar, hive front, crate end, box side and shed door is described POSITIVELY as one of: plain smooth unpainted timber; painted one flat single colour; carrying one small painted picture of a flower, a leaf or a bee shape and nothing else; or wax-sealed and twine-tied with a small sprig tucked under the twine.
- NO metaphorical object-noun standing in for light or honey ("coins of light", "ribbons of silver", "curtain of diamonds", "scattered gems", "confetti of light") — figurative light language renders as the literal object.
- NEVER pair "dark"/"darkness"/"shadow" with a light word ("glint", "sparkle", "shimmer", "luminous", "glow") describing the SAME thing in the same phrase. Describe a shaded patch plainly, with no light word attached in the same breath.
- NO named or implied people: no figures, crowd, visitors, onlookers, bystanders, children, kids, laughter, voices, faces, hands, footprints.
- NO negation phrasing inside an entry ("no bees", "not a single..."). Describe only what IS present.
- NO menace: no stinging, no sting, no angry/agitated/attacking/swarming-at bees, no alarm, no fear, no hazard or protective-hazmat register. Calm, busy, gentle, unhurried throughout.
- NO commercial or industrial scale: no yard of a hundred hives, no pallets, no forklift, no truckload, no factory. A small, personal, hand-tended farm apiary of a handful of hives.
- NO giant or oversized bees, NO bee standing upright, NO bee holding or carrying an object, NO face or expression given to a bee, a flower, a jar or any other object.
- NO brand names, NO camera or photographer names.
- NO row of plain white boxes seen from across a field — that is the exact dull render this path exists to avoid.`;

const RECIPES = [
  // ───────────────────────────────────────────────────────────────
  // 1. ★ THE SIGNATURE MONEY-SHOT AXIS
  // ───────────────────────────────────────────────────────────────
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_apiary_hive_moment.json'),
    total: 25,
    batch: 40,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct HIVE-SIDE CRAFT MOMENTS for a cozy countryside
anime bot's beekeeping path. Each entry is ONE close-range beekeeping moment — the hero object of
the shot, named FIRST as the grammatical subject, with its own defining mass, immediately followed
by the action it is caught mid-way through.

THE BAR: this has to show people something they have never looked at closely, or something familiar
redressed as something far more interesting. A row of white boxes in a field is the FAILURE. The
delight is in getting close to the craft and the strangeness of bees. Every entry must be a moment
you would stop scrolling for.

LEAD WITH THE HERO'S DEFINING MASS. The first noun of the entry is the thing the eye lands on — the
drawn frame, the smoker, the swarm cluster, the knife, the jar, the lifted box, the skep. Never lead
with a secondary prop or a piece of the setting.

ONE CHARM DETAIL PER ENTRY — a small clever specific the eye finds on second look, and it must make
it THAT moment and no other: a hive tool worn silver-bright along one edge and wedged in a back
pocket; a chipped enamel mug standing forgotten on a hive roof; a saucer of water with a flat cork
floating in it so the bees have somewhere to stand and drink; a brick turned on its side on one lid;
a goose-feather brush hooked over the box's rim; a single wax scale stuck to the back of a thumb; a
strip of old bicycle inner tube holding a cracked frame together; a pair of gloves left inside-out
on the grass.

VARIETY MANDATE — distribute the ${n} entries across these families:
- ~4 THE DRAWN FRAME HELD UP: a frame of capped honeycomb lifted clear of the box and turned so the
  light passes through it, the sealed cells reading amber-translucent, bees walking unhurried across
  the wax.
- ~3 THE SMOKER IN USE: a tin smoker with a leather bellows, one slow white curl rolling out low
  across the open top bars of a hive, the lid tipped on its edge in the grass. NEVER give the
  smoker an open fuel door with an ember or a glow showing inside it: measured, the model
  transplants that glow onto the nearest dark aperture — which is the hive's own entrance slot —
  and renders a furnace mouth burning inside the hive. The fire is implied by the smoke alone.
- ~3 THE UNCAPPING AND THE SPIN: a warmed knife drawn down the face of a frame, the cut caps
  peeling away in a pale sheet; honey sheeting off a frame into a wide settling tank; the
  extractor's little tap running one unbroken amber thread into a wide-mouthed jar.
- ~3 THE SWARM IN THE TREE: a swarm cluster hanging from a low plum or apple branch in one dense
  living teardrop the size and shape of a rugby ball, a white sheet spread beneath it and a straw
  or timber box held up under it to coax the cluster down. ALWAYS state that the mass is made
  ENTIRELY OF LIVING BEES layered over one another, its whole surface small clinging bodies and
  folded wings — "a dense rounded mass hanging from a branch" on its own renders as a PAPERY WASP
  NEST with open cells (measured), because that is the model's prior for that shape.
- ~3 THE OPEN HIVE: a lifted honey super set down across an upturned lid, its frames standing in
  their rack; the top bars of an open brood box with the bees flowing over them like slow water.
- ~2 THE BEE-BEARD: a shaggy living bib of workers hanging down over the hive's landing board and
  front panel, hundreds of small bodies fanning together. Call it the hive's FRONT PANEL, never the
  hive's "face" — "the lower face of a hive" is ordinary beekeeping jargon for the front board, but
  under this bot's cute tone lock the model rendered it LITERALLY: big anime eyes, a blush and a
  mouth on the hive above the bee-beard (measured 2026-09-23). "The face of the comb" or "the face
  of a frame" stays safe — a flat wax surface has no front, so it never personifies (0 failures in
  18 renders). Only an object with a FRONT does this.
- ~2 THE OLD REGISTER: a domed straw skep being lifted out of its alcove in a stone wall; a hollow-
  log hive lashed upright in the fork of an old tree, its timber plug drawn out.
- ~2 THE JAR: a squat glass jar of just-spun honey standing on a shed windowsill, the light passing
  straight through it so the honey reads brilliant amber all the way down.
- ~2 THE WAX: a pale block of filtered beeswax turned out of its mould on a bench; a row of freshly
  rolled beeswax candles laid out to cool, each one still faintly ridged.
- ~1 THE BENCH WORK: a bare timber frame clamped on a bench mid-way through being strung with fine
  wire, a coil of wire and a pair of pliers at hand.

AXIS-CLEAN — CRITICAL: this pool must contain ZERO time-of-day words, ZERO weather words, ZERO
season words and ZERO colours of light (no "golden", "afternoon", "morning", "sunset", "dusk",
"misty", "rainy", "overcast", "warm light", "cool light"). A separate axis owns all of that and a
time-of-day word here directly contradicts it. You MAY say that light passes THROUGH the comb or
the jar, or that the wax reads translucent, because translucency is the literal subject of those
shots — but never say when, in what weather, or in what colour.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 30-45 words each.

Examples:
["A drawn frame of capped honeycomb is lifted clear of the box and turned so the light passes
straight through it, every sealed cell reading amber-translucent, a dozen workers walking the wax
unhurried, a hive tool worn silver-bright along one edge wedged in a back pocket.", "A tin smoker
with a patched leather bellows breathes one slow white curl low across the open top bars of a
hive, the lid tipped on its edge in the grass beside it, a chipped enamel mug standing forgotten
on the roof of the next box along.", "A swarm hangs from a low plum branch in one dense living
teardrop the size of a rugby ball, a clean white sheet spread on the grass beneath and a plain
timber box held up beneath the cluster to coax it down, a goose-feather brush hooked over its rim."]

${BANS}

Output ONLY the JSON array, no preamble, no numbering.`,
  },

  // ───────────────────────────────────────────────────────────────
  // 2. THE BEES THEMSELVES — the insect-rendering trap defeater
  //
  // ROUND-2 REWRITE (2026-09-23). The first version mandated a count and an
  // abstract size comparison ("each no bigger than a thumbnail") and 4 of 6
  // round-1 renders still came back with bees the size of small birds. The
  // measurement, from the stored ai_prompt against the pixels, is that scale
  // tracks the COUNT, not the size word: the two renders with correct bees
  // drew entries reading "about a dozen" and "eighty or more", while every
  // giant-bee render drew an entry reading three, four or nine. 16 of the 30
  // entries were under ten. Three coupled fixes, all in this recipe now:
  //   (a) a COUNT FLOOR of twelve, with a third of entries at fifty-plus —
  //       Flux gives a low-count subject more of the frame, so a low count IS
  //       the giant-bee generator;
  //   (b) the size is anchored to a NAMED OBJECT THAT IS ACTUALLY IN THE
  //       FRAME (a honeycomb cell, a wax cap, the entrance slot, a clover
  //       floret) instead of an absent thumbnail or fingernail — a comparison
  //       to something off-camera gives the model no ruler to measure by;
  //   (c) the DETAIL BUDGET is capped at the nearest one or two bees. Asking
  //       for every bee to be "fully resolved" or "as carefully drawn as the
  //       person" enlarges them, because in a diffusion model detail and size
  //       are the same dial.
  // ───────────────────────────────────────────────────────────────
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_apiary_bee_presence.json'),
    total: 25,
    batch: 40,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct HONEYBEE-PRESENCE descriptions for a cozy
countryside anime bot's beekeeping path. On this path the bees ARE the animals, and this bot's
standing rule is that animals share equal spotlight with people — so each entry has to make the
bees genuinely visible, genuinely lovely and genuinely insect, AT TRUE INSECT SCALE.

THE THREE SCALE RULES. Every entry obeys all three, without exception. They exist because renders
came back with bees the size of small birds, which is the one hard failure on this path.

RULE 1 — THE COUNT FLOOR. Never fewer than TWELVE bees. Write "about a dozen", "fifteen or so",
"twenty-odd", "about forty", "sixty or more", "a hundred or more". Roughly a third of the ${n}
entries should be at FIFTY or more. A small count is what makes the model enlarge each bee, so
three bees on a stone is forbidden however charming it sounds — write a dozen bees on that stone
instead.

RULE 2 — MEASURE THEM AGAINST SOMETHING THAT IS IN THE FRAME. Never against a thumbnail, a
fingernail, a grain of wheat or anything else the camera cannot see: an off-camera ruler gives the
model nothing to measure by. Use something physically present in a beekeeping shot, and vary which
one: "each one no longer than three honeycomb cells across", "each shorter than the hive's entrance
slot is tall", "each about as long as the frame's top bar is thick", "each narrower than one wax cap",
"each barely wider than the gap between two frames", "each shorter than one frame lug".
The ruler must REPEAT STRUCTURALLY and its own size must be fixed by the object it belongs to — a
comb cell, a wax cap, an entrance slot, a top bar, a frame lug. Do NOT measure a bee against a lone
small object such as a clover floret, a blade of grass or a nail head: a lone object has no scale
anchor of its own, so the model enlarges the RULER along with the bee (measured 2026-09-23 — a
clover-floret entry produced a fist-sized clover head and bird-sized bees).

RULE 3 — THE DETAIL BUDGET. Only the NEAREST ONE OR TWO bees get any individual description (a
furry amber-and-umber thorax, a banded abdomen, clear veined wings folded flat, six fine legs,
pollen packed in bright loaves on the hind legs). EVERY OTHER BEE IS A SMALL CLEAN SHAPE AND
NOTHING MORE — write it that way ("the rest small clean shapes scattered across the wax", "the
others no more than small dark shapes crossing the air"). Never write that every bee is fully
detailed, fully resolved, or drawn with as much care as anything else in the frame: detail and size
are the same dial, and describing forty detailed bees produces forty enormous ones.

DESCRIBE THE MASS HOLISTICALLY. Where there are many, they are one arrangement or one flow — "a
busy unhurried carpet across the wax", "one soft revolving cloud", "a loose line drawn outward".
Never give a separate action or any personality to an individual bee inside the mass.

AXIS-CLEAN — CRITICAL: ZERO time-of-day words, ZERO weather words, ZERO season words and ZERO
colours of light in this pool (no "morning", "afternoon", "dusk", "misty", "sunlit", "in the
afternoon warmth"). A separate axis owns all of that and a time word here directly contradicts
whatever it rolled — a round-2 regeneration of this very pool leaked five of them, so check for it.

VIVID — the pollen on the nearest bee is the colour lever. Real pollen loads come back in genuinely
surprising colours: brilliant orange from dandelion, slate blue-grey from phacelia, chalk white,
deep brick red, sulphur yellow, olive green. Name one concretely in roughly a third of the entries.

VARIETY MANDATE — distribute the ${n} entries across these:
- ~5 COVERING THE COMB: a carpet of bees over capped and open cells, over the wax face of a frame.
- ~4 THE LANDING BOARD: a crowd arriving and departing at the entrance, foragers touching down.
- ~4 IN THE AIR: many short dark dashes crossing the frame, a busy lane of foragers going out and
  coming back.
- ~3 LOADED WITH POLLEN: the nearest one's hind legs packed with bright loaves of it, named colour.
- ~4 ORIENTATION FLIGHT: a hundred or more young bees facing the hive and flying small widening
  loops, a whirl of small bodies hanging in the air close to the front panel.
- ~2 FANNING: a long row of workers along the landing board with abdomens tipped up and wings a
  transparent blur.
- ~2 DRINKING: a crowd gathered along the rim of a shallow saucer or over a flat wet stone.
- ~2 ON THE FLOWERS: a dozen or more working a flower head or a bank of blossom close to the frame.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-38 words each.

Examples:
["About a dozen honeybees carpet the face of the comb, each one no longer than three honeycomb
cells across, the nearest showing a furry amber thorax and clear veined wings folded flat, the rest
small clean shapes across the wax.", "A hundred or more young bees hang in the air just off the
hive's front panel in small widening loops, each shorter than the entrance slot is tall, the whole
mass one soft revolving cloud of small dark shapes.", "Twenty-odd foragers crowd the landing board
and the air above it, each no bigger than a single clover floret, the nearest one's hind legs
packed with brilliant orange pollen loaves, the others small clean shapes filing in."]

${BANS}

Output ONLY the JSON array, no preamble, no numbering.`,
  },

  // ───────────────────────────────────────────────────────────────
  // 3. THE APIARY — the stage just behind the hero
  // ───────────────────────────────────────────────────────────────
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_apiary_place.json'),
    total: 25,
    batch: 40,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct SMALL FARM APIARY settings for a cozy countryside
anime bot. The apiary is the NEAR setting standing just behind the shot's hero, close enough to
touch — never a distant row of boxes across a field. The hives or the honey room are always the
grammatical subject named FIRST.

VIVID IS LITERAL — THE PAINT IS THE COLOUR LEVER. A real farm apiary is a mismatched, cheerful,
slightly crooked thing: hives painted whatever was left in the shed. At least half the outdoor
entries must name two or three specific saturated paint colours on adjacent boxes — sky blue,
buttermilk yellow, faded rose, mint green, dusty ochre, cornflower, brick red, pale lilac, seafoam
— and let the stack sit a little out of true. Never a uniform row of plain white boxes; that is the
dull render this path exists to avoid.

ONE CHARM DETAIL PER ENTRY the eye finds on second look, specific to THAT apiary: a flat stone
weighting one lid; a spare super upended as a seat; a length of old net curtain tacked over a gap;
a boot-scraper at the gate; a cracked terracotta pot holding a bunch of feathers; a rain gauge that
has filled with petals; a coil of hose looped on a fence post; a bucket of wax scraps going soft in
the sun.

VARIETY MANDATE — distribute the ${n} entries across these:
- ~6 THE HEDGEROW STACK: three or four mismatched painted hives standing a little crooked in a row
  along a hawthorn or beech hedge, on low timber stands, grass worn to a path in front of them.
- ~4 THE FLOWERING BANK: hives set on a bank or a slope with the forage growing right up around
  their stands, under old gnarled fruit trees.
- ~3 THE BEE-BOLE WALL: a thick old stone wall with domed straw skeps sitting in arched alcoves cut
  into it, ferns in the joints, a stone slab lintel over each niche.
- ~3 THE BEE HOUSE: a small open-fronted timber shelter with a corrugated tin or shingle roof over
  three or four hives, its back wall drilled with a grid of bee-holes and stuffed with cut reed and
  hollow stems for the wild bees.
- ~3 THE HONEY ROOM (INTERIOR): the inside of a small honey shed — a hand-cranked extractor bolted
  to the floorboards, a settling tank on a stand, racks of drying frames, shelves of filled glass
  jars catching the light. CONTINUITY LAW for every interior entry, all three parts: (i) name the
  window or the open door as part of the ROOM — its sill, its frame, the jars standing on it;
  (ii) name the outside as seen THROUGH it, softer and hazier and smaller in the frame; (iii) bring
  that outside light BACK IN onto something inside — the sill, the bench edge, the floorboards, the
  nearest jars. That returning light is what makes it one unbroken shot.
- ~2 THE HOLLOW LOGS: sawn log hives lashed upright in a fork of an old tree or stood on a plinth,
  moss on their crowns, timber plugs in their tops.
- ~2 THE CART: two or three hives strapped on the bed of a small wheeled cart at the edge of a
  flowering field, chocks under the wheels.
- ~2 THE ORCHARD CORNER: hives tucked into the corner of a small orchard among long grass and
  windfall fruit, a low picket or woven hurdle fence around them.

AXIS-CLEAN — CRITICAL: ZERO time-of-day words, ZERO weather words, ZERO season words, ZERO colours
of light. A separate axis owns all of that. (An interior entry may say light comes in through the
window and falls on something — but not when, in what weather, or in what colour.)

Describe any cluster of similar small objects — a scatter of stones, a stack of empty boxes, a
bundle of reeds, a shelf of jars — HOLISTICALLY as one arrangement. Never give an individual action
or a personality to one piece inside a cluster.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 32-48 words each.

Examples:
["Four mismatched hives stand a little out of true along a clipped hawthorn hedge on low timber
stands — sky blue, buttermilk, faded rose, one plain unpainted timber — the grass worn to a bare
path in front of their entrances, a flat river stone weighting the middle lid.", "A thick old
stone wall holds four domed straw skeps in arched alcoves cut right into it, ferns growing from
the joints and a stone slab lintel over each niche, a cracked terracotta pot at its foot holding a
bunch of feathers.", "The little honey room is crowded around a hand-cranked extractor bolted to
the floorboards, a settling tank beside it on a stand and shelves of filled glass jars; light
comes in through the open half-door, its sill crowded with more jars, and lies in a band across
the nearest boards."]

${BANS}

Output ONLY the JSON array, no preamble, no numbering.`,
  },

  // ───────────────────────────────────────────────────────────────
  // 4. THE FORAGE — the "why the hives are here" line
  // ───────────────────────────────────────────────────────────────
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_apiary_forage.json'),
    total: 25,
    batch: 40,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} short FORAGE lines for a cozy countryside anime bot's
beekeeping path. Each line names the flowers or flowering trees growing in the SAME frame as the
hives, so the viewer can see at a glance WHY the hives are standing there. Short, concrete,
colour-first, and always physically adjacent to the hives — a bank, a strip, a hedge, a row, a
canopy overhead, a field just beyond the fence.

VIVID: every entry names its colour concretely and commits to it. These are real bee-forage plants
and several are surprisingly loud — say so.

VARIETY MANDATE — span these, roughly one or two each: blue borage; slate-purple phacelia; white
clover threaded through the grass; a lavender row gone violet; heather turning a low hill purple;
sunflowers leaning heavy over a fence; a lime tree in small green-cream flower overhead; crimson
field beans; apple or plum blossom in white and shell pink; a rosemary hedge in pale blue; a strip
of oilseed in flat chrome yellow beyond the hedge; bramble flower in white and blush; a cutting bed
of orange calendula and pink cosmos; blue echium spires; hawthorn hedge in dense white; buckwheat
in pinkish white; a yellow mustard strip; scarlet poppies through a cereal edge; teasel and knapweed
gone mauve; a willow in yellow-green catkins; a drift of yellow-and-brown sunflower heads left
standing; ivy in lime-green flower on a wall; sweet chestnut in cream tassels; a bed of purple
alliums gone to seed-heads; a wildflower strip in mixed yellow, white and cornflower blue.

AXIS-CLEAN — CRITICAL: ZERO time-of-day words, ZERO weather words, ZERO season words (name the
PLANT and its COLOUR, not the month), ZERO colours of light. A separate axis owns all of that.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 15-26 words each.

Examples:
["A bank of blue borage grows right up around the hive stands, its nodding star-shaped flowers
almost touching the entrances.", "A strip of oilseed in flat chrome yellow runs away beyond the
hedge, bright enough to throw colour back onto the nearest hive.", "An old lime tree stands over
the hives in small green-cream flower, its whole canopy thick with it."]

${BANS}

Output ONLY the JSON array, no preamble, no numbering.`,
  },

  // ───────────────────────────────────────────────────────────────
  // 5. KEEPER CRAFT — the human action (character branch only)
  // ───────────────────────────────────────────────────────────────
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_apiary_keeper_craft.json'),
    total: 25,
    batch: 40,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct BEEKEEPER ACTIONS for a cozy countryside anime
bot's beekeeping path. Each entry is ONE unhurried, absorbed action, written as a gerund phrase
with an implied subject (the way "Kneeling beside the bed to tie a stem to the trellis." is
written), so it can be dropped in under a character description.

CRITICAL — NO GARMENTS, EVER. This axis describes ONLY the action, the pose, the hands and the
tool being used. A separate axis owns the veil, the hat, the gloves, the apron and everything else
worn. Do not name a single item of clothing or headwear — not a veil, not a hat, not gloves, not
a suit, not an apron, not a sleeve. Naming a garment here overrides that axis and dresses every
render the same way.

ADVENTUROUS BEATS STATIC: the great majority are mid-action, caught part-way through a real piece
of handwork. Keep roughly five of the ${n} as quiet wonder beats instead — watching, looking,
holding something up to look through it — because the wonder is half the charm.

VARIETY MANDATE — distribute the ${n} entries across these:
- ~5 OPENING AND LIFTING: levering a lid free with the flat of a hive tool; easing a frame up out
  of the box by its lugs; setting a lifted honey super down across an upturned lid; sliding a frame
  back down into place; prising two propolis-stuck boxes apart.
- ~4 SMOKE AND BRUSH: squeezing two slow breaths from a smoker's bellows low across the top bars;
  feeding a handful of dry grass into a smoker's canister; sweeping bees gently off a frame face
  with a soft goose-feather brush; tipping a frame to let a knot of bees walk back down into the
  box.
- ~4 THE HONEY WORK: drawing a warmed knife down a frame's face so the caps peel away in one pale
  sheet; turning the extractor's crank steadily with the other hand flat on its lid; ladling honey
  through a strainer into a wide-mouthed jar; scraping wax scraps off a bench edge into a bucket.
- ~3 THE SWARM: holding a plain box up beneath a hanging swarm cluster and giving the branch one
  short firm shake; spreading a clean white sheet out flat on the grass below a swarm; crouching to
  watch a line of bees walk up the sheet into the box's mouth.
- ~3 THE BENCH: clamping a bare frame on a bench and threading fine wire through its holes; pressing
  a sheet of foundation down into a wired frame; painting a hive body a flat bright colour with a
  wide brush, one long even stroke at a time.
- ~2 THE SMALL KINDNESSES: floating a flat cork on a saucer of water so the bees have somewhere to
  stand; reaching up to wedge a flat stone onto a lid.
- ~5 QUIET WONDER: crouching down level with the landing board to watch the coming and going;
  holding a jar of honey up and turning it slowly to look straight through it; standing perfectly
  still with both hands lowered while bees stream past; cupping an empty piece of comb in both
  hands and looking closely into it; sitting on an upended box with elbows on knees, watching.

AXIS-CLEAN — CRITICAL: ZERO time-of-day words, ZERO weather words, ZERO season words, ZERO colours
of light, and no clothing of any kind. A separate axis owns each of those.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 20-32 words each.

Examples:
["Levering a stuck lid free with the flat of a hive tool, one hand braced flat on the box below and
the tool turning slowly until the seal gives.", "Drawing a warmed knife steadily down the face of a
frame so the cut caps peel away in one long pale sheet into the tray below.", "Crouching right down
level with the landing board, chin near the knees, watching the coming and going a few inches from
the entrance."]

${BANS}

Output ONLY the JSON array, no preamble, no numbering.`,
  },

  // ───────────────────────────────────────────────────────────────
  // 6. LIGHT & AIR — the ONLY axis that owns time / weather / hue
  // ───────────────────────────────────────────────────────────────
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_apiary_air.json'),
    total: 25,
    batch: 40,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct LIGHT-AND-AIR descriptions for a cozy countryside
anime bot's beekeeping path. This is the ONLY axis on this path that owns time of day, weather and
the colour of light — every other axis is deliberately silent on all three, so this pool carries
the whole hue range of the path by itself.

VIVID LAW: every entry names TWO specific colours, and roughly half of them pit a warm colour
against a cool one. Committed, saturated colour — never muted, never tasteful grey, never washed
out.

BALANCE MANDATE — this is load-bearing and measured after generation. A pool that skews warm makes
every render look like the same golden afternoon (a real, documented failure on this bot). Split the
${n} entries as evenly as you can across:
- ~8 WARM: low amber light raking across the hive fronts; hot honey-gold air thick over the stands;
  a deep orange late light with long blue shadow beneath the stands; flat bright noon on painted
  timber.
- ~9 COOL: blue-hour dusk with the hive paint gone dusty violet and one warm square of shed light;
  flat pearl-grey overcast with the greens gone deep and saturated; the silver-green air just after
  rain with every leaf still beaded; a cold pale dawn, the hive roofs silvered with dew and one
  roof panel clear and dark where the colony's own warmth has taken it off; a rolling white mist
  standing to knee height with the hive tops clear above it; steel-blue cloud stacked behind
  chrome-yellow forage.
- ~8 BRIGHT AND VARIED: broken cloud throwing moving patches across the hedge; fine warm rain
  falling into cool green shade; a clean high-summer blue with the air full of tiny lit specks; a
  sudden clear wash after a shower with the colours turned up.

CRITICAL — NEVER pair "dark"/"darkness"/"shadow" with a light word ("glint", "sparkle", "shimmer",
"luminous", "glow") describing the SAME thing in the same phrase. This exact pairing is a
documented trap on this bot: the brief-writer escalates it into a literal glowing beam or a patch
of night sky cut into a daytime scene. Describe a shaded area plainly and put any light word on a
DIFFERENT, separately-named thing.

CRITICAL — literal light language only. No metaphorical object standing in for light.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 20-32 words each.

Examples:
["Low amber light rakes right across the hive fronts, warming the buttermilk paint to apricot while
the grass between the stands stays a deep cool green.", "Flat pearl-grey overcast with no visible
sun at all, the greens gone deep and saturated under it and the painted timber reading chalky and
soft.", "A cold pale dawn, every hive roof silvered with dew except one clear dark panel where the
colony's own warmth has taken it off, the air a thin washed blue."]

${BANS}

Output ONLY the JSON array, no preamble, no numbering.`,
  },
];

async function main() {
  const only = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  for (const r of RECIPES) {
    const name = path.basename(r.outPath);
    if (only.length && !only.some((o) => name.includes(o))) continue;
    console.log(`\n=== ${name} ===`);
    await generatePool(r);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
