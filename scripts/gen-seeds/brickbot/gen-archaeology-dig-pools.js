#!/usr/bin/env node
/**
 * Generate the BrickBot `archaeology-dig` axis pools using Sonnet.
 *
 * Own gen script (NOT recipes bolted into the 5.8k-line shared
 * gen-brickbot-pool.js, and NOT into gen-brickbot-balloon-pools.js /
 * gen-brickbot-airfield-pools.js) so this path build never contends with
 * another agent on a shared file. Infrastructure (signatureOf / dedupe /
 * target-loop / numbered-list parse / timestamped backup) mirrors
 * gen-brickbot-balloon-pools.js verbatim so the pool files come out
 * byte-compatible with the rest of the bot.
 *
 * Per `feedback_each_path_bespoke_not_cloned`: every recipe here is
 * archaeology-dig-bespoke. Canon: LEGO Adventurers / Johnny Thunder
 * expedition digs, LEGO Dino / Jurassic dig-site sets, LEGO Ideas and
 * Bricklink AFOL "cutaway ground" MOCs that build soil as stacked colour
 * courses, and real open-trench excavation.
 *
 * ── THE PREMISE, AND WHY IT IS A HARD BUILD ──────────────────────────────
 * The gift of an excavation is the PARTIAL REVEAL: something huge is still
 * in the ground and the viewer's mind finishes it. That is a SUBTRACTIVE
 * description of a thing the model wants to render whole, which playbook
 * lesson 58 measures as unachievable by description:
 *
 *     "woolly cuffs still at the ankles"   (ADDITIVE)    → 6 of 6 every round
 *     "no fluff on the body anywhere"      (SUBTRACTIVE) → 1 of 6
 *
 * same sentence, same position, same prompts. So REVEAL_LAW below never
 * asks for absence. It uses lesson 58's three-part recipe — a shape stated
 * in its own terms, something the model can put ON the exposed part, and
 * odd-one-out framing against a named majority (here the majority is the
 * UNBROKEN trench floor, which is a positive object) — plus amber-forest's
 * ATTACHMENT law, because a mass with air all round it renders as a museum
 * specimen on a plinth.
 *
 * ── THE FOUR TRAPS THESE RECIPES EXIST TO DEFEAT ─────────────────────────
 *
 *   1. TEXT. A dig is the densest label-magnet subject on the bot: site
 *      signs, notice boards, crate stencils, finds labels, tags, numbered
 *      flag markers, graduated measuring rods, clipboards, plan drawings.
 *      Lesson 27's dividing line is whether the object's SHAPE is already a
 *      sign — a flat bounded rectangle is; a curved or irregular surface is
 *      not (lesson 57: pinned objects moved onto curving plaster gave 0 text
 *      in 15 renders). So every sign-shaped noun is DELETED from every
 *      layer (lesson 12) and the space it left is filled POSITIVELY with
 *      rounded, irregular kit (lesson 27's composed fix): wicker baskets,
 *      barrels, buckets, round sieves, canvas sacks, coiled rope, a tipped
 *      barrow. Lesson 51 says filling a surface MIGRATES lettering to the
 *      nearest remaining strip, so lesson 52's crop is carried too — the cut
 *      face fills the near frame instead of a receding rank of pit squares.
 *
 *   2. THE CORRIDOR. A trench is a LINEAR FEATURE, which lessons 17/24
 *      measure as a receding-corridor-with-a-tiled-subject generator, and
 *      purging the axial camera entries is NOT enough. So the CROSSWISE LAW
 *      rides in all three places that reach Flux: the template's rule 1,
 *      every `dig_cut` seed, and output-order item 1.
 *
 *   3. PHOTOREAL GROUND. airfield-biplanes measured that on a BrickBot
 *      vehicle path the hero reads as brick from R0 while the GROUND drifts
 *      photoreal. This path's hero IS ground, so `build` is the load-bearing
 *      anti-photoreal axis and every recipe names soil, spoil, dust, canvas
 *      and roots as LEGO parts.
 *
 *   4. THE JARGON TRAP (lessons 28/47/64). Archaeology's own correct
 *      vocabulary collides badly with common objects: "section" (a document
 *      section), "context" (abstract), "feature" (abstract), "spit" (a
 *      roasting spit), "matrix" (a film), "datum"/"scale bar" (numbers),
 *      "staff"/"levelling staff" (a person / a graduated rod), "plan" (a
 *      drawing), "finds tray" (a flat panel). All banned in JARGON_LAW, and
 *      checked against BrickBot's OWN wrapper too (lesson 64): the bot
 *      prefix already ships "plates", "tiles", "slopes" and "studs" as LEGO
 *      parts, which is consistent, but "board" and "sheet" are not used
 *      anywhere in this path for that reason.
 *
 * Two structural decisions worth knowing before editing a recipe:
 *   • There is NO separate palette axis. Colour on this path comes from the
 *     CUT — the banded courses of the trench wall are the colour story — so
 *     a palette pool would contradict the rolled cut ("teal and rust" over
 *     an ochre/charcoal/cream wall). Time of day + direction + air colour +
 *     the one warm accent are fused into `dig_light`, which also buys back a
 *     slot of first-third word budget (lessons 18/21/34). Same call, same
 *     reasoning, as balloon-festival.
 *   • Every `dig_moment` entry must be stageable IN or AT THE LIP OF the
 *     trench with nothing but the find and hand tools, because a moment that
 *     brings its OWN VENUE renders as two places at once (measured on
 *     airfield-biplanes). Fixed structurally in the recipe rather than with a
 *     template compatibility clause — a prose clause loses to a pool pick
 *     every time.
 *
 * Usage:
 *   node scripts/gen-seeds/brickbot/gen-archaeology-dig-pools.js --pool brickbot_dig_find --target 25
 *   node scripts/gen-seeds/brickbot/gen-archaeology-dig-pools.js --pool brickbot_dig_light --count 25
 *
 * Output: scripts/bots/brickbot/seeds/<pool>.json
 *
 * NOTE: brickbot_dig_camera_framing is deliberately NOT here — camera pools
 * are HAND-AUTHORED. Sonnet-generated camera pools leak their sibling axes
 * (time of day, weather, terrain, the hero's type, posture verbs) by default,
 * and on a LEGO-photography bot an AXIAL or PLAN-VIEW camera entry is a
 * hard-fail GENERATOR that out-votes every anti-symmetry mandate in the
 * template (airfield-biplanes: across four batches EVERY hard fail traced to
 * 3 of 25 camera entries). The fix is purging entries, not strengthening the
 * mandate, so that pool has none by construction.
 */

const fs = require('fs');
const path = require('path');
const { SONNET } = require('../../lib/models');

function readEnvFile() {
  try {
    const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}
const env = readEnvFile();
const ANTHROPIC = process.env.ANTHROPIC_API_KEY || env.ANTHROPIC_API_KEY;
if (!ANTHROPIC) {
  console.error('ANTHROPIC_API_KEY missing');
  process.exit(1);
}

const args = process.argv.slice(2);
const flag = (n, fb) => {
  const i = args.indexOf('--' + n);
  return i >= 0 ? args[i + 1] : fb;
};
const has = (n) => args.includes('--' + n);
const POOL = flag('pool', null);
const COUNT = parseInt(flag('count', '25'), 10);
const TARGET = flag('target', null) ? parseInt(flag('target', '0'), 10) : null;
const MAX_ITERATIONS = parseInt(flag('max-iter', '15'), 10);
const DRY = has('dry-run');

if (!POOL) {
  console.error('Usage: --pool <name> --count <N> [--target N] [--dry-run]');
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────
// Shared mandates repeated verbatim into every recipe. Kept as consts so
// the four traps above cannot drift apart between pools (lesson 44: a law
// omitted from one axis is the axis that breaks it).
// ─────────────────────────────────────────────────────────────

const REVEAL_LAW = `⚠️⚠️ THE PARTIAL REVEAL IS WRITTEN AS SOMETHING PRESENT, NEVER AS SOMETHING MISSING. This is the most important rule in this file and it is measured, not theoretical. An image model ADDS but it does not SUBTRACT: in a controlled test, an additive half of one sentence rendered 6 of 6 every round while the subtractive half of the SAME sentence, in the same position, in the same prompts, rendered 1 of 6. So "mostly buried", "only partly exposed", "the rest still hidden", "not yet uncovered", "the majority remains underground" DO NOT WORK, however well worded — the model renders the whole thing anyway.

What works instead, and every entry must carry all three:
  1. THE SHAPE OF THE EXPOSED PART, STATED IN ITS OWN TERMS as a complete object. Not "part of a rib" but "a single smooth arch rising twice a minifigure's height, wide enough to walk two figures under". Not "some of a wheel" but "a curved rim standing up out of the floor in a quarter-circle as tall as the ladder". Give the visible piece a clean readable silhouette a builder could photograph on its own.
  2. SOMETHING THE MODEL CAN PUT ON IT. This is what absorbs the urge to render more of the thing. A soft brush laid across its crest, a plank walkway resting over it, a rope sling looped under it, a folded canvas draped over one end, a scatter of loose tan studs still lying on its top, a bucket hooked over it, moss tufts growing along its ridge, two crew figures sitting on it eating.
  3. ODD-ONE-OUT AGAINST A NAMED MAJORITY. The majority is the TRENCH FLOOR, and the floor is a positive object: "the rest of the trench floor is one continuous unbroken surface of flat tan plates, and this is the only thing standing up out of it." Say the floor plates run right up to it and CONTINUE PAST IT on both sides as one unbroken surface — that is the additive way to say the rest is in the ground.

And every entry OPENS BY NAMING WHAT HOLDS IT. A mass with air all round it renders as a polished museum specimen on a plinth (measured: three of six renders on another path turned a hero mass into a paperweight, a geode and a display slab). So: welded into the cut face where it sits, sunk into the floor plates with the plates closing over it, set into the wall with roots grown across it, held in the ochre band halfway up the cut, resting in the floor with loose studs heaped against one flank.

BANNED PHRASINGS: mostly buried, largely buried, still buried, partly exposed, only partially, not yet uncovered, still hidden, still concealed, the rest remains, the rest is underground, unexcavated, yet to be dug, we cannot see, invisible, obscured.
ALLOWED because they name a material doing something: sunk into, set into, welded into, held in, closing over, running up to and past, heaped against, grown across.`;

const NO_TEXT_LAW = `⚠️ NO READABLE TEXT ANYWHERE — this is the path's hardest failure. A dig is the single densest label-magnet subject available: real excavations carry site signs, notice boards, numbered flag markers, finds labels, stencilled crates, graduated measuring rods, clipboards and plan drawings, and that is exactly what the image model expects.

The dividing line that is measured is whether an object's SHAPE IS ALREADY A SIGN. A flat bounded rectangle is one, and no wording makes it safe — describing it at all is a summons. A curved or irregular surface is not one, and pinned objects moved onto a curving surface gave zero text in fifteen renders.

So these nouns are DELETED, never described, never negated, never mentioned: sign, signboard, signpost, notice, noticeboard, board, blackboard, chalkboard, whiteboard, clipboard, plan, planning frame, drawing, drawing board, chart, map, label, tag, ticket, price, nameplate, plaque, placard, poster, banner, bunting, pennant, flag, standard, streamer, scoreboard, timetable, register, logbook, notebook, book, page, paper, card, envelope, stencil, decal, sticker, monogram, insignia, crest, coat of arms, emblem, roundel, glyph, sigil, rune, mark, marks, marking, markings, stamped, engraved, etched, inscribed, inscription, carved letters, script, characters, writing, lettering, letters, word, words, number, numbers, numeral, digit, measuring rod, measuring staff, ranging pole, scale bar, tape measure, ruler, gauge, dial, clock face, compass, compass rose, weathervane, sundial, crate, packing case, wooden box, tray, finds tray, flat panel, flat plate propped upright, flat slab set upright.

AND THE SPACE A DELETION LEAVES MUST BE FILLED POSITIVELY, because an undescribed or "plain" surface is exactly what gets lettering backfilled onto it (measured: all three text failures in one round were unprompted backfill onto the one surface class nothing described). So the kit on this site is ROUNDED AND IRREGULAR by construction and every piece is named as CARRYING something: wicker baskets heaped with potsherds, a wooden barrel with a dipper hooked over its rim, tin buckets, round sieves with mesh bottoms, canvas sacks slumped and half-full, coils of rope, a barrow tipped on its side with loose studs spilling from it, a folding stool, a kettle on a brick fire, a tarpaulin rumpled and sagging and weighted with stones, a rolled bundle of canvas tied with cord.
Where an entry does name a broad smooth surface — the swept floor, the cut face, a barrow's pan, a tent flank — say IN THE SAME BREATH what it is made of and what lies on it, never that it is blank, plain or empty (those are negations the model cannot use).`;

const BRICK_LAW = `⚠️ EVERYTHING IS LEGO BRICK, AND THE GROUND IS WHAT DRIFTS. This path's hero IS ground, so the brick signal has to be in the seed. Soil is stacked courses of flat plates in colour bands with the stud rows showing between them; the cut face is those courses seen edge-on; the swept trench floor is smooth tiles with a few studs left proud; spoil is a heaped cone of loose 1x1 round studs and tan cheese slopes; dust in the air is a scatter of trans-clear and tan studs; turf on the lip above is a green plate mosaic with moulded tuft elements; roots are brown flexible tubes and moulded plant elements poking from the courses; water in a low corner is trans-blue plates; canvas is a rumpled cloth element or tan plates stepped over a technic frame; rope is a run of bar-and-clip or a length of string; a bone is built from white curved slopes, arch bricks and a big dish element at the joint; tools are minifig accessory trowels, brushes and a bucket on a clip. Every figure is a LEGO minifigure with C-shaped hands and a printed face.
BANNED WORDS: photoreal, photorealistic, CGI, rendered, lifelike, real soil, real earth, real dirt, real stone, real canvas, real rope, hyperreal, scale model, diorama photograph of real materials, weathered patina photograph.`;

const CROSSWISE_LAW = `⚠️ THE TRENCH CROSSES THE PICTURE — it never runs away from the camera. A trench is a LINEAR feature, and a linear stage is measured as a receding-corridor generator that tiles its contents to a vanishing point; purging the axial camera entries alone does NOT fix it. So: the cut runs FROM THE LEFT EDGE OF THE PICTURE TO THE RIGHT EDGE, its near cut face filling the near part of the frame with the turf lip a BAND along one border, and BOTH ENDS OF THE TRENCH RUN OUT OF FRAME. Nothing lines up with the frame edges and nothing converges on a point.
BANNED: down the length of the trench, along its long axis, receding into the distance, a row of pits stepping back, a line of squares one behind another, vanishing point, converging, a single shared point, straight down the middle, directly overhead, plan view, from above looking down into it, symmetrical, mirrored, one on each side, matched pair.
Also BANNED: even counts of like things (two pegs, four posts, six baskets) — an even count of similar objects renders as a mirrored composition. Write odd counts with one member set apart: "three pegs along one side and a fourth further off", "one basket near and two more behind it".`;

const SCALE_LAW = `⚠️ SCALE IS THE JOKE, AND A RULER ONLY WORKS IF IT IS WELDED TO SOMETHING WHOSE OWN SIZE IS FIXED. The comedy of this path is a crew of minifigures with hand tools working on something the size of a bus, so the find is ENORMOUS relative to the figures — but a free-floating comparison inflates along with the thing it is measuring, and an off-camera comparison ("as big as a house") buys nothing at all. So every size cue is pinned to a thing that is IN FRAME and whose size is fixed by its parent: a minifigure standing on the trench floor, the rungs of the ladder against the cut face, the barrow's wheel, the tent's ridge, a bucket, the courses of the cut itself.
Never grant any figure a detail exemption. Every crew minifigure is a small clean readable figure at minifigure scale — none is singled out for close detail, because detail and size are the same dial and the one you describe most is the one that comes out biggest.`;

const JARGON_LAW = `⚠️ ARCHAEOLOGY'S OWN CORRECT VOCABULARY IS A TRAP — ask what a LAYPERSON pictures when they read the word, and if the answer is a different object the word is banned even though it is correct. Measured on this bot: on a sibling path the balloonist's own word for the fabric bag ("envelope") rendered a carpet of paper mail envelopes, and one occurrence of the layperson's word was the entire difference between a working render and a failed one.
BANNED JARGON, with what a layperson sees: section (a chapter), context (nothing visual), feature (nothing visual), spit (a roasting spit), matrix (a film), datum (a number), horizon (the sky line), fill (nothing visual), cut (as a NOUN on its own — say "the cut face" or "the trench wall"), baulk, sondage, test pit, small find, assemblage, stratigraphy, levelling staff, staff, level (as a noun), grid square, planning frame, quadrat, sherd (say "potsherd" or "broken pottery"), lithic, in situ.
Write in plain words a child would picture: the trench, the trench wall, the cut face, the layers, the bands, the floor of the trench, the lip, the spoil heap, the ladder, a trowel, a brush, a bucket, a basket, a sieve, a rope, a tent.`;

const DELIGHT_LAW = `⚠️ THE BAR IS DELIGHT, AND A CLEAN SOBER ENTRY IS A MISS, NOT A PASS. This app exists to add whimsy and delight: playful, adventurous, vivid, beautiful, clever. Every entry either shows something a viewer has NEVER SEEN, or takes something familiar and redresses it as something more interesting. A tidy pit with a skeleton in it is the boring failure this path is built to avoid.
So of every entry ask: is this the obvious version of this idea, or the surprising one? Ship the surprising one. VIVID IS LITERAL — saturated committed colour, never muted, washed-out or tasteful-grey. CLEVER means ONE charm detail the eye finds on second look. ADVENTUROUS beats static — a story beat over a tableau.`;

// ─────────────────────────────────────────────────────────────
// POOL RECIPES
// ─────────────────────────────────────────────────────────────

const POOL_RECIPES = {
  // ════════════════════════════════════════════════════════
  // THE FIND — ★ THE MONEY SHOT. The partial reveal. Leads the prompt.
  // Carries REVEAL_LAW in full; this is the axis the whole path lives on.
  // ════════════════════════════════════════════════════════
  brickbot_dig_find: {
    format: 'simple',
    theme: `THE FIND — the one huge thing the trench has opened up, written as a PRESENT object rather than a hidden one, 34-48 words.

This is the hero of the frame and the reason the path exists. Something enormous is in the ground, the crew has opened a piece of it, and the viewer's own mind finishes the rest. The comedy is the scale: minifigures with hand brushes working on a single exposed piece bigger than their tent.

${REVEAL_LAW}

${SCALE_LAW}

${DELIGHT_LAW}

${NO_TEXT_LAW}

${BRICK_LAW}

${JARGON_LAW}

VARIETY MANDATE — spread the 25 entries roughly like this, and make each one a DIFFERENT silhouette:
  • about ten are CREATURE parts at absurd scale: a single smooth arch of rib, a blunt jaw lying level with its teeth standing up in a row, one curved tusk, a splayed claw with three toes up, a knobbled vertebra taller than a figure, the flat pan of a shoulder blade, a coiled shell, a spread of finger bones each the length of a plank, a horn curling up out of the floor, a beak.
  • about ten are MADE THINGS at absurd scale, and this is where the path is at its best: a single colossal LEGO brick with studs the size of tables, a giant cog with three teeth clear of the floor, an enormous iron key, a huge smooth face of pale brick with one closed eye above the floor line, the prow of a ship, a robot's forearm with its finger joints open, a bell, an anchor fluke, a stepped mosaic floor of coloured tiles running out under the wall, a wheel rim standing up in a quarter circle, a giant tap, a ladder built for something far bigger than a minifigure.
  • about five are frankly IMPOSSIBLE and delightful: a fin of trans-blue plates with a row of round ports along it, a golden minifigure head the size of a hut with its printed smile above the floor, a great cog that is still slowly turning, a hatch with a wheel handle set flush into the trench floor, a stair descending INTO the floor with warm light coming up it, a huge hand of white brick with its palm open and a puddle standing in it.

Each entry states, in this order: what holds it → the readable shape of the exposed piece with its size pinned to something in frame → the one thing lying on or hooked over it → and that the trench floor around it is one unbroken surface of flat plates running right up to it and continuing past on both sides.`,
    touchpoints: [
      'Welded into the floor plates at the near end, a single smooth ivory arch of rib rises twice a minifigure height, wide enough to walk two figures under, a soft brush left lying across its crest and a coil of rope hooked over one shoulder of it; the floor runs right up to its base in unbroken flat tan plates and continues past on both sides.',
      'Sunk into the ochre band halfway up the cut face, one colossal LEGO brick sits proud of the wall with its studs the size of tabletops, a plank walkway resting across the top two studs and a tin bucket hooked on the corner, the courses of the wall closing over its far end and running on unbroken to the frame edge.',
      'Held in the floor at the wide end of the trench, a giant cog stands up in a quarter circle with three of its teeth clear of the plates, each tooth taller than the crew, a folded canvas draped over the highest one and loose tan studs heaped against the rim; the swept tile floor runs up to it and past it as one unbroken surface.',
      'Set into the dark charcoal band low in the wall, a great pale face of smooth brick shows one closed eye and a broad cheek above the floor line, as wide as the tent behind the crew, moss tufts grown along the brow and a rope sling looped under the chin; the wall courses run straight across it on both sides, unbroken.',
      'Resting in the floor across the middle of the trench, a blunt jaw lies level with its blocky white teeth standing up in a row, the longest tooth as high as a minifigure chest, a round sieve balanced on the jawline and a bucket set down beside it; the flat plate floor runs up against it and continues past on both sides.',
      'Grown across with brown flexible-tube roots where it meets the cut, a fin of trans-blue plates stands up out of the floor with a row of round ports along its edge, taller than the ladder leaning nearby, a rumpled tarpaulin weighted over its base with grey stones; the floor plates run up to it unbroken and carry on past.',
    ],
    instructions: `Each entry is 34-48 words, ONE flowing sentence (semicolons are fine), no headline prefix, no dash-separated title. What holds it, the exposed shape with its size pinned in frame, the one thing on it, and the unbroken floor running past. No camera angle, no lighting, no time of day, no palette, no weather, no crowd description, no tents or camp kit beyond the one thing lying on the find. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // THE CUT — the differentiator. EXCAVATION AS A VERTICAL CUT: the trench
  // wall in colour-banded brick courses, the string lines, the way down.
  // Carries the CROSSWISE LAW, because a trench is a linear feature.
  // ════════════════════════════════════════════════════════
  brickbot_dig_cut: {
    format: 'simple',
    theme: `THE CUT — the trench itself as a VERTICAL SLICE THROUGH THE GROUND, 30-44 words. This axis is the path's whole identity and the thing that separates it from every other path on this bot: not a desert vista, not a museum display, but a hole with a WALL, and that wall shows the ground in colour bands stacked like brick courses.

${CROSSWISE_LAW}

EVERY ENTRY MUST CARRY THREE THINGS:
  1. THE CUT FACE AND ITS BANDS. The wall of the trench is built as stacked courses of flat plates in committed colour bands with the stud rows showing between them — and the bands are IRREGULAR: no two the same thickness, none of them dead level, one sagging and pinching out to nothing along its length, another swelling, a pale seam of cream plates cutting through a dark one at an angle. Name two or three actual colours.
  2. A WAY DOWN, every time, because it doubles as the size ruler: a brick ladder leaning against the face, a plank ramp with cleats, short steps cut into one end in stacked plates, a rope with knots down to the floor.
  3. THE FLOOR AND THE LIP. The floor of the trench is swept smooth tiles with a few studs left standing proud and a low corner of trans-blue plates where water has gathered; the turf lip above is a green plate mosaic with moulded tuft elements, overhanging slightly, roots of brown flexible tube poking out of the top courses.

⚠️ DO NOT BUILD THE WALL AS MASONRY. Naming dressed stone, cut blocks, courses of ashlar, a keystone or a carved face turns the ground into a built wall, and a built wall arrives with pseudo-lettering carved across it (measured: sandstone "stacked in thick horizontal layers" rendered a brick wall with glyphs on it). The bands are SOIL — they sag, they vary, they crumble at the edge, they have stones and roots in them. BANNED: masonry, ashlar, dressed, cut blocks, keystone, mortar, pointing, brickwork wall, carved, chiselled.

⚠️ THE STRING LINES ARE A PATTERN, NOT A GRID OF SQUARES. A few taut white strings on wooden pegs cross the pit AT AN ANGLE and sag between the pegs; one square of them is open and being worked. Never a regular grid squared to camera, never numbered, never a receding rank of pits.

${NO_TEXT_LAW}

${BRICK_LAW}

${JARGON_LAW}

${DELIGHT_LAW}

VARIETY MANDATE — one each, so no two entries are the same hole: a long shallow trench across a green field · a deep narrow slot with the wall towering over the crew · a wide stepped pit with two levels of floor · a trench cut through the middle of a cobbled yard so the cobbles hang over the edge in a fringe · a cut into a hillside with the bands tilting steeply · a trench opened inside a ruined brick building with a wall footing crossing it · a cut through a sandy dune-edge with pale bands · a trench in reddish ground with charcoal streaks · a trench through a dark peaty band that oozes water · a pit under a tarpaulin canopy on poles · a trench beside a field wall with the wall's foundation showing in the face · a cut through an old rubbish layer glittering with broken pottery and bottle-glass plates · a trench with a great boulder left standing in the middle of the floor · a cut into a frozen field with a white crust on the lip · a trench through orchard ground with roots crossing the face like cables · a stepped trench going down three levels with a plank at each drop · a trench cut across an old road surface so a strip of round cobbles runs through the face · a cut where an older wall of pale plates crosses the bands at a slant · a trench in ground so full of small stones the bands read as grit · a trench half-flooded at one end with the pump hose coiled on the floor.`,
    touchpoints: [
      'The cut runs from the left edge of the picture clear to the right edge with both ends out of frame, its near face stacked in courses of tan, dark umber and one pale cream band that sags and pinches out along its length, a brick ladder leaning against it, swept tile floor below with trans-blue plates pooled in one corner and a green plate-mosaic turf lip overhanging above.',
      'A deep narrow slot crossing the picture side to side, its wall towering three minifigure heights in courses of reddish brown streaked with charcoal and a swelling grey band, knotted rope hanging to the floor, three white strings taut on wooden pegs crossing the pit at a slant and sagging between them, roots of brown flexible tube poking from the top courses.',
      'A wide stepped pit with two floors, the upper one swept tile and the lower one dark, its cut face banded in ochre, olive and a thin seam of cream plates cutting through at an angle, a plank ramp with cleats down the drop, the turf lip a green plate mosaic fringed with tuft elements and both ends of the cut running out of frame.',
      'A trench opened through a cobbled yard so a strip of round cobbles hangs over the edge in a fringe, the face below stacked in sandy and dark brown courses with one band full of small grey stones, short steps of stacked plates cut into the near end, water standing in trans-blue plates along the low side.',
      'A cut into a hillside with the bands tilting steeply across the face in umber, rust and pale grey, an older wall of pale plates crossing them at a slant halfway up, a brick ladder against the high end and the floor swept to smooth tiles with a few studs left standing proud.',
      'A long shallow trench across a green field, crossing the picture edge to edge with both ends cropped, its low face in three uneven bands of dark loam, tan and gritty grey, a knotted rope over the lip, a great boulder left standing on the tile floor and the turf above a bright green plate mosaic thick with tuft elements.',
    ],
    instructions: `Each entry is 30-44 words, ONE flowing sentence (semicolons are fine), no headline prefix, no dash-separated title. The trench crossing the picture with both ends out of frame, the cut face and its named irregular colour bands, the way down, the floor and the lip. No camera angle, no time of day, no sun, no shadow direction, no crew described, no find described, no camp kit. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // THE MOMENT — the story beat. Every entry names its ACTOR as a WHOLE
  // FIGURE (a named action with no named actor renders the body part alone,
  // measured: a giant disembodied hand and forearm), and every entry is
  // stageable IN or AT THE LIP of the trench with nothing but hand tools —
  // a moment that brings its own VENUE renders as two places at once.
  // ════════════════════════════════════════════════════════
  brickbot_dig_moment: {
    format: 'simple',
    theme: `THE MOMENT — one instant of story with its physical consequence, happening IN the trench or at its lip, 20-32 words.

⚠️ NAME THE WHOLE FIGURE DOING IT, EVERY TIME. "A trowel scraping at the floor" renders a giant disembodied hand and forearm. Write "a crew minifigure crouched on the floor scraping with a trowel". Every actor is a LEGO minifigure with C-shaped hands and a printed face.

⚠️ THE MOMENT BRINGS NO VENUE OF ITS OWN. It must be stageable on the trench floor, against the cut face, on the ladder, or on the turf lip at the edge, using only hand tools, a bucket, a basket, a sieve, a rope and a barrow. Never a shed, a lab, a museum, a truck, a road, a village, a river, a boat, a market, a kitchen, a different site. One place per frame.

⚠️ ADVENTUROUS BEATS STATIC. Something is HAPPENING and something is REACTING to it. A figure standing looking at the find is a failed entry. Use active verbs and name the consequence: what tips, what spills, what gives way, who steadies it, what everyone turns to look at.

${SCALE_LAW}

${DELIGHT_LAW}

${NO_TEXT_LAW}

${BRICK_LAW}

${JARGON_LAW}

VARIETY MANDATE — one each: a crew minifigure flat on the floor with a brush, blowing dust off a curve · two figures hauling on a rope over a technic tripod while a third steadies the load swinging under it · a figure halfway up the ladder taking a full bucket from the one below with both C-hands · a figure who has just stepped back off the floor with both arms up as a slab of the face lets go behind them · a figure sitting on the find eating from a tin while another points at what they are sitting on · a figure tipping a barrow of loose studs onto the spoil heap so the whole cone slides · a figure shaking a round sieve with a shower of studs coming through the mesh onto their own boots · a figure on hands and knees following a line of small stones out from the find with a trowel · two figures on the lip lowering a rolled bundle of canvas down on a rope while a third reaches up for it · a figure bracing a plank under the overhang as the turf lip crumbles onto their hat · a figure standing in ankle-deep trans-blue plates bailing with a bucket while another works the pump hose · a figure holding a lantern up close against the cut face while another crouches under the light with a brush · a figure who has just found something small, holding it up flat on one C-hand with three others converging on them · a figure asleep on a folded tarpaulin on the lip with a hat over their face while the work goes on below · a figure mid-slip on the ladder with one boot off the rung, the bucket already tipping · a figure chasing a brick dog that has run off with something long and white · a figure kneeling to sweep the floor with a brush while a chicken walks across the swept part behind them · a figure pouring water from a barrel dipper over a patch of the find so the colour comes up dark · a figure crouched low sighting along the floor with one C-hand flat to check it is even, another figure crouched at the far end doing the same · a figure up on the find's highest point with both arms out and the whole crew below looking up.`,
    touchpoints: [
      'A crew minifigure lying flat on the tile floor with a brush, blowing a puff of loose tan studs off a curve of the find while two others lean in over them.',
      'Two crew minifigures hauling on a rope over a technic tripod while a third steadies the load swinging under it with both C-hands, the tripod legs planted wide on the floor.',
      'A crew minifigure who has just stepped back off the floor with both arms up as a slab of plates lets go from the cut face behind them and spills across the tiles.',
      'A crew minifigure tipping a barrow of loose studs onto the spoil heap so the whole cone slides sideways and a bucket at its foot goes over.',
      'A crew minifigure sitting on the highest part of the find eating from a tin while another stands below pointing up at what they are sitting on.',
      'A crew minifigure chasing a brick dog along the trench floor as it runs off with something long and white in its jaws, a bucket knocked spinning behind them.',
    ],
    instructions: `Each entry is ONE moment, 20-32 words, a single flowing sentence, no headline prefix, no dash-separated title. Named whole figures, the active verb, and the physical consequence only — no camera angle, no lighting, no time of day, no palette, no description of the cut face's colours, no description of the find's shape. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // THE CAMP — the surface kit beside the pit. This axis carries the
  // composed anti-text fix: every sign-shaped noun deleted AND the space
  // filled positively with rounded, irregular kit that is named as CARRYING
  // something. Done right this is a set-dressing win, not a tax.
  // ════════════════════════════════════════════════════════
  brickbot_dig_camp: {
    format: 'simple',
    theme: `THE CAMP — the working clutter on the turf beside the trench, 26-38 words. Spoil heaps, a tent, and the kit. This is the axis that makes the site look WORKED IN rather than staged, and it is also the axis with the highest text risk on the whole path, so it is built out of rounded irregular things by construction.

${NO_TEXT_LAW}

EVERY ENTRY CARRIES:
  1. A SPOIL HEAP as a positive mass — a heaped cone of loose 1x1 round studs and tan cheese slopes, slumped on one side, a plank run up it with a barrow track worn in, a shovel standing in it.
  2. A SHELTER — a canvas bell tent with taut guy-lines and its door flap rolled and tied, or a tarpaulin on three poles sagging in the middle and weighted at the corners with grey stones, or a low canvas lean-to against the field wall. Canvas is always rumpled, sagging, folded or flapping — never stretched flat and square to the camera.
  3. THREE OR FOUR PIECES OF ROUNDED KIT, each named as carrying or holding something: wicker baskets heaped with broken pottery, a barrel with a dipper hooked over the rim, tin buckets nested inside each other, round sieves stacked leaning against a leg, canvas sacks slumped and half-full with their necks rolled down, a coil of rope over a peg, a barrow tipped on its side with studs spilling out of the pan, a kettle steaming on a small brick fire, a folding stool with a jacket over it, a crooked stack of round sieves, a wooden bucket of water with a brush standing in it.

⚠️ ODD COUNTS, ONE SIDE ONLY. The kit gathers to ONE side of the frame and the counts are odd with one member set apart — an even count of like objects renders as a mirrored composition.

${CROSSWISE_LAW}

${BRICK_LAW}

${JARGON_LAW}

${DELIGHT_LAW}

VARIETY MANDATE — one each: a bell tent with its flap rolled and a kettle on a brick fire outside it · a tarpaulin canopy on three poles sagging in the middle over stacked sieves · a barrow tipped on its side beside the spoil cone with studs spilling from the pan · a lean-to against an old field wall with sacks slumped along its foot · a spoil heap with a plank run up it and a shovel standing in the top · baskets of broken pottery in a crooked line along the lip · a barrel of water with a dipper and three buckets nested beside it · a folding stool with a jacket over the back and a tin mug on the grass · a technic tripod hoist over the trench with a rope and a hook swinging · a brick handcart with one wheel off its axle pin and a jack of stacked plates under it · a low brick fire ringed with grey stones and a kettle steaming on it · a rolled bundle of canvas tied with cord leaning against the tent · a hand pump with its hose coiled down into the trench · a crate-free stack of round sieves leaning against a tent pole in a lopsided tower · sacks of loose studs heaped against the spoil cone with one split and spilling · a brick dog asleep on a folded tarpaulin in the shade of the tent · a washing line of canvas strips hung edge-on and twisting in the wind · a bicycle of technic parts propped against the spoil heap · a wheelbarrow full of water with a brush and a sieve floating in it · a small brick generator with its belt running to the pump, both wrapped in a rumpled cloth.`,
    touchpoints: [
      'A heaped cone of loose tan studs slumped on one side with a plank run up it and a shovel standing in the top, a canvas bell tent behind it with its flap rolled and tied, and three wicker baskets heaped with broken pottery in a crooked line at its foot.',
      'A tarpaulin on three poles sagging in the middle and weighted at the corners with grey stones, a lopsided tower of round sieves leaning against one pole, and a barrow tipped on its side with loose studs spilling out of the pan.',
      'A spoil cone with a barrow track worn up it, a barrel of water with a dipper hooked over the rim, three tin buckets nested inside each other and a kettle steaming on a low brick fire ringed with grey stones.',
      'A canvas lean-to against an old field wall with slumped half-full sacks along its foot, a coil of rope over a peg, and a brick dog asleep on a folded tarpaulin in the shade of it.',
      'A technic tripod hoist standing over the trench lip with a rope and hook swinging under it, a spoil cone slumped beside it, and a folding stool with a jacket over the back and a tin mug on the grass.',
      'A brick handcart with one wheel off its axle pin and a jack of stacked plates under it, a hand pump beside it with its hose coiled down over the lip, and a heaped spoil cone with sacks of studs against one flank.',
    ],
    instructions: `Each entry is 26-38 words, a single flowing sentence, no headline prefix, no dash-separated title. The spoil heap, the shelter and three or four pieces of rounded kit named as carrying something — no camera angle, no lighting, no time of day, no palette, no human figures doing things, no description of the find or the cut face's colours. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // THE CREW — the scale ruler. Many small figures, heights pinned to
  // something welded to the scene, gathered to ONE side.
  // ════════════════════════════════════════════════════════
  brickbot_dig_crew: {
    format: 'simple',
    theme: `THE CREW — the minifigures on the site as the thing that PROVES THE SCALE, 18-30 words.

${SCALE_LAW}

EVERY ENTRY STATES: who they are, how many (an odd number, or a plain group word), and HOW THEIR HEIGHT IS PINNED to something in frame whose own size is fixed — a ladder rung, the barrow's wheel hub, a basket, a tent ridge, a bucket, the courses of the cut face, the find's own exposed shape. One charm detail at most.

⚠️ THEY GATHER TO ONE SIDE, unbalanced. Never one on each side, never a matched pair, never spread evenly across the frame — an even, balanced arrangement renders as a mirrored composition.

⚠️ THE CREW ARE NOT THE STORY BEAT. Another axis owns the action. This axis is presence, posture and scale: who is here, how small they are, where they are standing, what they are wearing on their heads. Keep the verbs low-key (crouched, kneeling, standing back, leaning on, sitting on the lip, huddled round, strung out along).

${NO_TEXT_LAW}

${BRICK_LAW}

${JARGON_LAW}

${DELIGHT_LAW}

VARIETY MANDATE — one each: five crew in wide-brimmed hats crouched in a row along one side of the floor, heads barely to the third ladder rung · a group of seven in overalls huddled at one end of the trench, every one shorter than a stacked sieve tower · a school party of small figures strung out along the turf lip on one side, none taller than the barrow's wheel hub · three crew and a supervising figure in a pith helmet up on the lip, all of them shorter than the tent ridge · a knot of figures leaning on the trench edge looking down, heads level with the top course of the cut · nine crew spread along one wall of the trench in ones and twos, each barely to a basket rim · a crew almost entirely turned away, all facing the cut face · two figures deep in the trench dwarfed by the wall above them and five more small on the lip above that · a crew in winter hats with breath plates, bunched on one side · a crew sitting in a row along the find itself, each one shorter than the gap between two of its studs · a pair of visiting figures in smart coats standing back from the edge while the crew work below · a crew of five with one figure carried on another's shoulders to reach the top course · a crowd of small figures pressed along one length of rope fence on the turf, all shorter than a fence post · a crew where every figure is wearing a different hat · a mixed crew of adults and small figures kneeling together at one corner of the floor · three crew asleep sitting up against the cut face in the shade of the overhang · a crew strung out up the ladder in a chain, the lowest on the floor and the highest at the lip · a crew of five with a brick dog between their legs, every figure shorter than the spoil cone behind them · a crew of seven all looking the wrong way while one small figure at the edge looks the right way · a crew in bright waterproofs standing ankle-deep in trans-blue plates, each one shorter than the pump.`,
    touchpoints: [
      'Five crew minifigures in wide-brimmed hats crouched in a row along one side of the trench floor, their heads coming barely to the third rung of the ladder above them.',
      'A group of seven in overalls huddled at one end of the trench, every figure shorter than the lopsided tower of sieves beside them, all looking down at the same spot.',
      'A school party of small minifigures strung out along the turf lip on one side only, none of them taller than the barrow wheel hub, every one leaning over to look.',
      'Two crew minifigures deep on the trench floor, dwarfed by the banded wall above them, and five more small figures gathered on the lip above that on the same side.',
      'A crew of five sitting in a row along the find itself, each one shorter than the gap between two of its studs, boots swinging clear of the floor.',
      'A crew of seven all looking the wrong way down the trench while one small figure at the near edge looks the right way, both C-hands on the lip.',
    ],
    instructions: `Each entry is 18-30 words, a single flowing sentence, no headline prefix, no dash-separated title. Who they are, how many, how their height is pinned, and at most one charm detail — no camera angle, no lighting, no palette, no active story beat, no description of the find's identity. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // THE LIGHT — time of day + direction + shadow + the colour of the AIR
  // FUSED (no separate palette axis: colour here comes from the CUT's own
  // bands, and a palette pool would contradict the rolled cut). Every entry
  // carries a WARM ACCENT against the prevailing light — a measured
  // anti-monochrome lever (one in fifteen of fifteen renders on another path).
  // ════════════════════════════════════════════════════════
  brickbot_dig_light: {
    format: 'simple',
    theme: `THE SITE LIGHT — time of day, light direction, shadow behaviour and the colour of the AIR, fused into one entry of 22-34 words.

There is no separate palette axis on this path, because the colour story comes from the banded courses of the cut face and a palette pool would contradict whatever cut was rolled. So this axis owns the AIR and the LIGHT, never the objects.

⚠️ EVERY ENTRY SAYS WHAT THE LIGHT DOES TO THE CUT FACE. A trench is a hole, and a hole with no stated light direction renders as flat grey shade with the bands washed out — which deletes the path's differentiator. So name where the sun is and what it does to the wall: rakes low across the bands so every course throws its own thin shadow, drops straight in so the floor is bright and the face is dark, throws the wall's shadow right across the floor, back-lights the dust hanging over the lip.

⚠️ EVERY ENTRY COMMITS TO A TIME OF DAY. Vague light is the single most reliable way to make a colourful scene look washed out.

⚠️ EVERY ENTRY ATTACHES ONE WARM ACCENT against the prevailing light — a hurricane lamp hung on a peg in the trench, a low sun edge on the turf lip, a small brick fire outside the tent, a warm glow inside the canvas, the sun catching one ochre band. Measured on another path: requiring a warm accent put one in fifteen of fifteen renders and it is the most reliable anti-monochrome lever there is.

⚠️ VIVID IS LITERAL. Saturated, committed, high-chroma. Never pastel-hazy, never washed-out, never tasteful-grey, never desaturated, never muted, never "dusty neutrals".

⚠️ LIGHT IS ILLUMINATION ON A NAMED SURFACE, NEVER A SOLID OBJECT. A narrow bright opening plus a dark hollow is a light-cone generator, and a light described as a shape renders that shape. BANNED: shaft, beam, ray, column, pillar, bar, ribbon, cone, wedge, curtain, sheet of light, wall of light, halo ring, pool of light as an object, "shaped like". Say what the light LANDS ON: the top two courses go gold, the swept tiles glare white, the wet plates go mirror-bright, the dust over the lip glows.

⚠️ LIGHT AND COLOUR WORDS ONLY — the grass, the sky, the air, the cut face, the floor and the canvas as surfaces the light acts on. An entry that names a tool, a basket, a figure's action or a find is injecting a second scene.

VARIETY MANDATE — one each: low dawn sun raking straight along the cut face so every course throws its own thin shadow, the air cold blue, one warm lamp still burning on a peg in the trench · hard high noon dropping straight into the trench so the floor tiles glare white and the face above is deep shadow · late golden afternoon low and warm across the turf so the top courses go gold and the floor stays cool · sunset with the whole lip rimmed orange and the trench below gone violet, a small fire warm outside the tent · blue hour with the sky deep indigo and the only warm light a glow inside the canvas · full night worked by lamplight, one hurricane lamp on a peg throwing warm light across the bands and the rest of the field black · overcast soft even light with the band colours reading at full chroma against flat pearl-grey sky, one warm window of canvas glow · a storm sky of dark slate with one break of low sun picking the ochre band out in blazing colour · after rain, clean washed light, the floor plates wet and mirror-bright, the bands saturated dark · low mist burning off with the sun coming warm and level through it over the lip · hard clear high-altitude light under a deep cobalt sky with razor shadows down the face · thin winter sun low and pale with long blue shadows across white crusted turf · dust hanging over the lip turned warm ochre by a low sun behind it · backlit into a low sun so the lip is a dark frieze and the dust above it glows · frost morning, pale rose light on the top course and deep blue in the bottom of the trench · midday under thin cloud with soft even light and one lamp left burning warm in the deep end.`,
    touchpoints: [
      'Low dawn sun raking straight along the cut face so every course throws its own thin shadow, the air a cold blue, and one hurricane lamp still burning warm on a peg down in the trench.',
      'Hard high noon dropping straight down into the trench so the swept floor tiles glare white and the banded face above stands in deep shadow, one warm fire glow outside the canvas.',
      'Sunset with the whole turf lip rimmed hot orange and the trench below gone deep violet, the ochre band catching the last of it and a small fire warm beyond the tent.',
      'Full night worked by lamplight, a single hurricane lamp on a peg throwing warm light across the bands of the face while the rest of the field stays black and the sky deep.',
      'After rain, clean washed light with no shadow direction, the floor plates wet and mirror-bright and every band reading saturated and dark, one warm glow inside the canvas.',
      'Dust hanging over the lip turned warm ochre by a low sun behind it, the cut face below in cool blue shade and the top course edged bright gold.',
    ],
    instructions: `Each entry is 22-34 words, a single flowing sentence, no headline prefix, no dash-separated title. Time of day, light direction, what the light lands on, shadow behaviour, air and sky colour, and the one warm accent only — no objects, no tools, no figures, no camera, no weather event, no story beat. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // BUILD TECHNIQUE — THE ANTI-PHOTOREAL LEVER. Same role that
  // water_build_technique / snow_ice_build_technique / terrain_build_technique
  // play on BrickBot's other drift-prone paths. This path's hero IS GROUND,
  // and ground is what photoreal-drifts on this bot, so this axis is
  // load-bearing rather than decorative.
  // ════════════════════════════════════════════════════════
  brickbot_dig_build: {
    format: 'simple',
    theme: `THE MOC BUILD TECHNIQUE — AFOL parts-usage that makes a hole in the ground unmistakably LEGO, 26-40 words. This is the load-bearing anti-photoreal lever of the path: soil, dust and canvas are exactly what drift to photoreal, and on a vehicle path on this bot the hero read as brick from the first batch while the GROUND went real — so every entry names REAL LEGO PARTS doing the work.

Each entry names the technique for the CUT FACE or the FLOOR, and for ONE other thing (the spoil heap, the dust in the air, the turf lip, the roots, the water, the canvas, the find, the tools, the ladder, the string lines). Write it as parts a builder would recognise.

Real AFOL vocabulary to draw on: the cut face as stacked courses of 1x8 and 2x4 plates in colour bands with the stud rows left showing between them · a band built from tan cheese slopes on their sides so its edge crumbles · one course of 1x2 curved slopes so a band sags · a pale seam of 1x1 plates threaded diagonally through the courses · the swept floor as smooth tiles with a scatter of studs left proud · SNOT bricks turned stud-out so a band's face reads as grit · spoil as a heaped cone of 1x1 round studs and cheese slopes over a slope-brick core · dust as loose trans-clear and tan studs scattered in the air on clear bar stalks · turf as a green plate mosaic with moulded tuft elements and a row of inverted slopes for the overhang · roots as brown flexible tubes and moulded plant elements pushed out between courses · water as layered trans-blue plates with trans-clear tiles on top · canvas as a rumpled cloth element, or tan plates stepped over a technic beam frame with the corners weighted by grey 1x1 rounds · rope as bar-and-clip runs or a length of string on eyelets · the find built from white curved slopes, arch bricks and a big dish element at the joint · a giant stud built from a 4x4 round plate on a round brick · tools as minifig accessory trowels and brushes and a bucket on a clip · the ladder as a brick ladder element with the rails showing · the string lines as white string on 1x1 round pegs.

${NO_TEXT_LAW}

${BRICK_LAW}

${JARGON_LAW}

⚠️ VISIBLE CONSTRUCTION IS THE POINT. Studs showing, plate seams showing, the colour change landing exactly on a course rather than fading, the stepping of the crumbled edge visible. A smoothly-faired wall of soil with no visible parts is a failed render.

⚠️ IRREGULAR, NOT REGULAR. A stack of identical evenly-spaced layers renders as a tapering tower of rings — a child's stacking toy. No two courses the same thickness, none of them level, one pinching out entirely along its length.

VARIETY MANDATE — one each across the cut-face and floor techniques above, pairing each with a different second element so no two entries name the same pair.`,
    touchpoints: [
      'The cut face stacked in courses of 1x8 and 2x4 plates with the stud rows left showing between the colour bands and no two courses the same thickness, the spoil beside it a heaped cone of 1x1 round studs and cheese slopes over a hidden slope-brick core.',
      'One band built from tan cheese slopes on their sides so its edge crumbles visibly over the course below, and the turf lip above a green plate mosaic with a row of inverted slopes for the overhang and moulded tuft elements along the top.',
      'A pale seam of 1x1 plates threaded diagonally through the courses so it cuts the bands at a slant, and brown flexible tubes pushed out between two courses as roots with moulded plant elements clipped to their ends.',
      'The swept floor as smooth tiles with a scatter of studs deliberately left proud, and water in the low corner layered from trans-blue plates with trans-clear tiles set on top so it reads wet.',
      'SNOT bricks turned stud-out across one band so its face reads as grit, and canvas above built as tan plates stepped over a technic beam frame with its corners weighted by grey 1x1 round bricks.',
      'The find built from white curved slopes and arch bricks over a big dish element at the joint, and loose trans-clear and tan studs scattered in the air above the floor on clear bar stalks as dust.',
    ],
    instructions: `Each entry is 26-40 words, a single flowing sentence, no headline prefix, no dash-separated title. Named LEGO parts and techniques only — no colour story beyond naming a band's colour, no lighting, no camera, no story beat, no crew. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // THE EVENT — 50%-gated secondary environmental beat. OBJECTS, AIR AND
  // ANIMALS ONLY (the moment axis owns every human actor), so the two can
  // never collide into two competing story beats.
  // ════════════════════════════════════════════════════════
  brickbot_dig_event: {
    format: 'simple',
    theme: `THE SITE EVENT — a secondary environmental beat in brick parts, 16-28 words. It amplifies the moment, never competes with it.

⚠️ OBJECTS, AIR AND ANIMALS ONLY — NO HUMAN ACTORS. The moment axis owns every human story beat; if this axis also carried a person, the render would be told to show two competing beats at once. So an event here is something the weather, the ground, an animal or a loose object does.

⚠️ IT HAPPENS IN THE TRENCH OR ON THE TURF BESIDE IT. No new venue.

⚠️ RIGID-OBJECT WORDS ARE BANNED for anything made of air, dust, light or water: never column, pillar, wall, tower, bar, ribbon, disc, sheet, beam, cone, or "shaped like". Dust is a scatter of loose tan studs. Water is a spray of trans-blue plates. Smoke is a curling trail of white cloud-slope bricks. Light is a glow spreading across a named lit surface.

${NO_TEXT_LAW}

${BRICK_LAW}

${JARGON_LAW}

${DELIGHT_LAW}

VARIETY MANDATE — one each: a gust lifting the tarpaulin off its poles and pinning it flat against the spoil cone · trans-clear rain rods slanting into the trench and beading along the top course · a brick sheep leaning over the lip chewing at a taut guy-line · a slab of plates letting go from the cut face and sliding across the floor in a spray of studs · a bucket on the tripod rope swinging wide and knocking a sieve off its stack · a brick dog down on the floor digging its own hole, studs flying back between its legs · a flock of brick crows settled in a line along the tent ridge, one with something bright in its beak · a kettle boiling over on the brick fire with a curl of white cloud-slope steam · the spoil cone slumping all at once so the plank on it slides and the shovel topples · a mole-hill of loose studs erupting in the middle of the swept floor · a chicken on top of the spoil heap scratching a shower of studs down one side · water rising fast in the low corner with trans-blue plates already over the bottom tiles · a barrow rolling away on its own down the slope of the turf with studs spilling out of the pan · frost smoke curling off the wet floor plates in the first sun · a swarm of loose trans-clear bubble elements drifting up out of a puddle in the floor · a brick badger backing out of a hole in the cut face with a mouthful of roots · a swirl of loose tan studs lifted off the spoil and carried across the trench in a low arc · one basket of broken pottery tipping off the lip and landing upside down on the floor · a brick goat up on the tent ridge with the whole tent sagging under it · a great cloud of white cloud-slope bricks rolling in low over the field wall.`,
    touchpoints: [
      'A gust lifting the tarpaulin clean off its poles and pinning it flat against the spoil cone, the grey corner stones tumbling down the slope after it.',
      'A slab of plates letting go from the cut face and sliding out across the swept floor in a wide spray of loose tan studs.',
      'A brick dog down on the trench floor digging its own hole, loose studs flying back between its legs and a bucket already knocked over behind it.',
      'A flock of brick crows settled in a line along the tent ridge, one of them with something small and bright held in its beak.',
      'A mole-hill of loose studs erupting in the middle of the swept tile floor with a scatter of grit thrown out around it.',
      'A brick goat up on the tent ridge with all four hooves planted and the whole canvas sagging visibly under it.',
    ],
    instructions: `Each entry is ONE event, 16-28 words, a single flowing sentence, no headline prefix, no dash-separated title. The event and its brick-built impact only — no human figures, no camera, no lighting condition, no palette, no description of the find. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },
};

const recipe = POOL_RECIPES[POOL];
if (!recipe) {
  console.error(
    `No recipe for pool "${POOL}". Add it to POOL_RECIPES. Available: ${Object.keys(POOL_RECIPES).join(', ')}`
  );
  process.exit(1);
}

function buildPrompt(count, recipe) {
  if (recipe.format === 'simple') {
    return `${recipe.theme}

━━━ TOUCHPOINT EXAMPLES (draw aesthetic from these — same caliber, same vocabulary register, and the SAME LENGTH: these examples obey the word cap, so match them) ━━━
${recipe.touchpoints.map((t) => '  • ' + t).join('\n')}

${recipe.instructions}

Output ${count} numbered list entries (1. ... 2. ... 3. ...). Each entry on its own single line. NO preamble, NO commentary, NO markdown fences.`;
  }
  throw new Error(`Unknown recipe.format "${recipe.format}"`);
}

async function callSonnet(prompt) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15 * 60 * 1000);
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: SONNET,
        max_tokens: 16000,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Sonnet ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const data = await res.json();
    return (data.content?.[0]?.text || '').trim();
  } finally {
    clearTimeout(timeoutId);
  }
}

function parseArray(text) {
  const body = text
    .replace(/```[a-z]*\n?/gi, '')
    .replace(/```/g, '')
    .trim();
  const lines = body.split('\n');
  const entries = [];
  let current = null;
  const numRe = /^\s*(\d+)\s*[.):\]]\s*(.+)$/;
  for (const raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const m = trimmed.match(numRe);
    if (m) {
      if (current) entries.push(current);
      current = m[2].trim();
    } else if (current) current += ' ' + trimmed;
  }
  if (current) entries.push(current);
  const cleaned = entries
    .map((e) => e.replace(/^["'`]+|["'`]+$/g, '').trim())
    .filter((e) => e.length >= 20 && e.length <= 1200);
  if (cleaned.length === 0) throw new Error('no numbered entries parsed');
  return cleaned;
}

const STOP = new Set([
  'the',
  'and',
  'with',
  'from',
  'into',
  'that',
  'this',
  'over',
  'under',
  'onto',
  'across',
  'their',
  'while',
  'every',
  'each',
  'lego',
  'brick',
  'bricks',
  'plate',
  'plates',
  'minifig',
  'minifigs',
  'minifigure',
  'minifigures',
  'trench',
  'floor',
  'studs',
  'unbroken',
  'continues',
]);

function signatureOf(entry) {
  const words = String(entry)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 4 && !STOP.has(w));
  const uniq = [...new Set(words)].slice(0, 12).sort();
  return uniq.join('|');
}

function titleOf(entry) {
  const dashIdx = String(entry).indexOf('—');
  if (dashIdx < 0) return null;
  return entry.slice(0, dashIdx).trim().toLowerCase();
}

function dedupe(entries) {
  const seenSigs = new Map();
  const seenTitles = new Map();
  const kept = [];
  const dropped = [];
  for (const e of entries) {
    if (typeof e !== 'string' || e.length < 20) continue;
    const title = titleOf(e);
    if (title && seenTitles.has(title)) {
      dropped.push({ entry: e.slice(0, 80), reason: 'title' });
      continue;
    }
    const sig = signatureOf(e);
    if (sig.length < 10) {
      if (title) seenTitles.set(title, e);
      kept.push(e);
      continue;
    }
    if (seenSigs.has(sig)) {
      dropped.push({ entry: e.slice(0, 80), reason: 'body' });
      continue;
    }
    seenSigs.set(sig, e);
    if (title) seenTitles.set(title, e);
    kept.push(e);
  }
  return { kept, dropped };
}

async function generateBatch(batchCount) {
  const t0 = Date.now();
  const text = await callSonnet(buildPrompt(batchCount, recipe));
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  let arr;
  try {
    arr = parseArray(text);
  } catch (e) {
    console.error('Parse failed:', e.message);
    console.error('First 400 chars:', text.slice(0, 400));
    return [];
  }
  console.log(`  • Sonnet returned ${arr.length} entries in ${elapsed}s`);
  return arr;
}

(async () => {
  const outPath = path.resolve(`scripts/bots/brickbot/seeds/${POOL}.json`);
  let preExisting = [];
  if (fs.existsSync(outPath)) {
    try {
      preExisting = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    } catch {}
  }
  const finalTarget = TARGET ?? preExisting.length + COUNT;
  const startCount = preExisting.length;
  console.log(
    `Pool "${POOL}": ${startCount} → ${finalTarget} (iterative gen+dedup)${DRY ? ' (dry-run)' : ''}`
  );
  let pool = [...preExisting];
  let iteration = 0;
  while (pool.length < finalTarget && iteration < MAX_ITERATIONS) {
    iteration++;
    const stillNeeded = finalTarget - pool.length;
    const batchSize = Math.min(30, Math.ceil(stillNeeded * 1.4));
    console.log(
      `\nIteration ${iteration}: pool at ${pool.length}/${finalTarget}, need ${stillNeeded} more, gen ${batchSize}`
    );
    const fresh = await generateBatch(batchSize);
    if (fresh.length === 0) {
      console.warn('  ⚠ empty Sonnet response — stopping iteration');
      break;
    }
    const within = dedupe(fresh);
    if (within.dropped.length > 0)
      console.log(`  • within-batch dedup dropped ${within.dropped.length}`);
    const existingSigs = new Set(pool.map((e) => signatureOf(e)));
    const existingTitles = new Set(pool.map((e) => titleOf(e)).filter(Boolean));
    const newUnique = within.kept.filter((e) => {
      if (existingSigs.has(signatureOf(e))) return false;
      const t = titleOf(e);
      if (t && existingTitles.has(t)) return false;
      return true;
    });
    const crossDropped = within.kept.length - newUnique.length;
    if (crossDropped > 0) console.log(`  • cross-batch dedup dropped ${crossDropped}`);
    const room = finalTarget - pool.length;
    const toAdd = newUnique.slice(0, room);
    pool = [...pool, ...toAdd];
    console.log(`  ✓ Added ${toAdd.length} unique → pool at ${pool.length}/${finalTarget}`);
    if (toAdd.length === 0 && newUnique.length === 0) {
      console.warn('  ⚠ batch added nothing — Sonnet may be exhausted on theme, stopping');
      break;
    }
  }
  console.log(
    `\n━━━ Final: ${pool.length}/${finalTarget} entries (${pool.length - startCount} new)`
  );
  if (DRY) {
    console.log('\nDry-run — not writing to disk.');
    return;
  }
  const bakPath = outPath + '.bak-' + Date.now();
  if (fs.existsSync(outPath) && preExisting.length > 0) {
    fs.copyFileSync(outPath, bakPath);
    console.log(`Backed up existing pool → ${bakPath}`);
  }
  fs.writeFileSync(outPath, JSON.stringify(pool, null, 2));
  console.log(`✓ Wrote ${pool.length} entries → ${outPath}`);
})();
