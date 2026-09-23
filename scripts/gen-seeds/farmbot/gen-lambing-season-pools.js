#!/usr/bin/env node
/**
 * FarmBot — lambing-season bespoke pools (5 Sonnet-seeded axes).
 *
 * The path's 6th axis (`lambing_animal`, the gated farm-animal cameo) is
 * HAND-AUTHORED JSON — see the path file's header. Do not add it here.
 *
 * ━━━ THE PATH'S IDENTITY AND THE DULL FAILURE IT EXISTS TO AVOID ━━━
 * The obvious lambing render is A CUTE WHITE LAMB STANDING IN A GREEN FIELD —
 * a greetings-card lamb, clean, symmetrical, forgettable, and something
 * everybody has already seen a thousand times. Every pool below is written so
 * that render is structurally impossible. The delight is in the WORKING SHED
 * AND THE FIRST WEEK OF A LAMB'S LIFE at close range: a ewe with twins, one
 * already up and nursing while the other is still folded flat on the straw; a
 * newborn in a cardboard box under a heat lamp with only its head and its
 * enormous ears showing; a bottle-lamb driving into the teat with its whole
 * body; a dozen lambs sprinting across wet grass at first turnout for no
 * reason at all; a lamb standing on its sleeping mother's back because she is
 * the warmest furniture in the pen; a ewe counting her own lambs with her nose
 * while one slips out behind her; steam coming off a wet newborn in cold air.
 *
 * ━━━ THE FIVE LAWS BAKED IN AT THE SOURCE ━━━
 * Each one is a documented, render-costing bug (BOT_SCENE_QUALITY_PLAYBOOK.md
 * cross-bot lessons 13/14/15/22/25/26 + FARMBOT_PATH_BUILD_STATE.md). They
 * live in the meta-prompt TEXT, not just in the generated JSON, so a future
 * append run cannot reintroduce them the way the 120-scale-up reintroduced
 * "horse keeper" and "wooden plant labels".
 *
 *  1. SMALL-ANIMAL SCALE TRACKS THE COUNT, NOT THE SIZE WORD (lesson 13,
 *     measured on this bot's own apiary path over 18 renders). "Three bees,
 *     each no bigger than a fingernail" gave BIRD-SIZED bees; "about a dozen"
 *     and "eighty or more" gave correct ones. A LOW COUNT IS THE GIANT-ANIMAL
 *     GENERATOR, because the model gives each named subject a share of frame.
 *     So: NO entry may name a lone single lamb as its whole subject. Every
 *     entry names at least TWO lambs, or one lamb stated against the ewe's own
 *     body or a named piece of the pen. And the corollary: A SIZE RULER MUST BE
 *     IN FRAME AND WELDED TO A LARGER STRUCTURE — a free-floating ruler
 *     inflates too ("no bigger than a single clover floret" produced a
 *     fist-sized clover). The legal rulers here are the ewe's knee / chest /
 *     back / flank, a hurdle's bottom or second rail, the top of a straw bale,
 *     the rim of the box, the shed doorway's height, the top of the field gate.
 *     Off-camera comparisons ("the size of a cat", "no bigger than a loaf")
 *     are banned — they buy nothing.
 *  2. A NEWBORN ANIMAL IS A CUTE-PRODUCT PRIOR, and it must be crowded out
 *     POSITIVELY, never negated. "A cute lamb" renders a clean symmetrical
 *     greetings-card lamb on white. The required positive form: a just-born
 *     lamb is WET, its wool in dark damp curls stuck flat and yellow-stained at
 *     the tips, ears outsized, legs too long for it, still folded on the straw;
 *     a day-old lamb is dry, fluffed into tight curls, and bouncing. That
 *     specificity is what makes it real AND what makes it charming.
 *  3. TEXT, AND IT HIDES IN SYNONYMS OF "TEXT" (lesson 1). A lambing shed has
 *     no obvious lettering magnet, but a hurdle rail, a pen board, a bale end,
 *     the shed door and a bucket side are all flat undescribed panels — and the
 *     surface you forget to describe is the one that gets lettering (lesson 2),
 *     while "plain" is a negation CLIP cannot use (lesson 26). Two of the
 *     genuine props of this trade ARE text generators and are deleted outright
 *     rather than described (lesson 12): a NUMBERED EAR TAG and a CHALK TALLY
 *     BOARD. The anti-text form must itself carry the interest (lesson 14), so
 *     every flat panel is named as CARRYING something real.
 *  4. A SMALL DARK APERTURE PLUS A GLOW WORD RELOCATES THE GLOW (lesson 15,
 *     measured on this bot). "The smoker's fuel door propped open" + "the
 *     faintest ember glow within" painted a FURNACE MOUTH BURNING INSIDE A
 *     BEEHIVE. A lambing shed has heat lamps and a stove, so this is a live
 *     risk. A lamp is named as a LAMP hanging in plain sight, and its light is
 *     always stated as LANDING ON a named surface. No glow ever goes INSIDE or
 *     WITHIN an opening.
 *  5. PER-OBJECT AGENCY ON A CLUSTER personifies it (the lakeside river-stones
 *     bug on this bot). A pen of lambs IS a cluster. Describe the mass
 *     holistically and give individual detail to at most the two or three
 *     nearest.
 *
 * ━━━ AXIS-CLEAN DISCIPLINE ━━━
 * `lambing_light` owns time of day, weather, season and the colour of light.
 * NO other pool may name any of the four — a hero entry that says "golden
 * afternoon" directly contradicts whatever the light axis rolled (EarthBot
 * LESSON 4 / the 2nd look-register amendment). The ONE allowance, stated in
 * the hero recipe: an entry may say that steam is RISING off a wet lamb,
 * because that is the literal subject of that shot; it still may not say when,
 * in what weather, or in what colour.
 *
 * ━━━ SCOPE FENCE ━━━
 * `sheep-shearing-day` is a separate queued path. NOTHING in these pools may
 * touch the shearing register: no shears, no clippers, no fleece being rolled,
 * no wool sack, no shearing board, no shorn sheep.
 *
 * Run:  node scripts/gen-seeds/farmbot/gen-lambing-season-pools.js
 *       node scripts/gen-seeds/farmbot/gen-lambing-season-pools.js moment light
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

// Shared ban block — appended to every recipe so one edit fixes all five and
// no recipe can silently drift off the law list in the header above.
const BANS = `🚫 STRICT BANS (every one is a documented, render-costing failure on this bot):
- NO readable text of ANY kind and NONE of its synonyms: no label, no lettering, no writing, no words, no numbers or numerals, no mark/marks/marking, no glyph, no sigil, no stamp or stamped, no engraving, no etching, no inscription, no script, no plaque, no sign or signage, no chalkboard, no chalk tally, no record of notches, no ear tag or ear tags of any kind, no tag, no clipboard, no notebook, no ledger, no written record. Instead, every flat panel — a hurdle rail, a pen board, a bale end, the shed door, a bucket side, a field gate — is described POSITIVELY as one of: plain smooth weathered timber silvered by age; painted one flat single colour; or CARRYING a real object (a coiled rope, a bucket hanging on a nail, a lamp on a hooked flex, a halter looped over the rail, a sheaf of clean straw, a leaning stack of spare hurdles, a kettle on a shelf, a folded sack).
- NO metaphorical object-noun standing in for light ("coins of light", "ribbons of gold", "curtain of diamonds", "scattered gems", "confetti of light") — figurative light language renders as the literal object.
- NEVER pair "dark"/"darkness"/"shadow" with a light word ("glint", "sparkle", "shimmer", "luminous", "glow") describing the SAME thing in the same phrase. Describe a shaded patch plainly, with no light word attached in the same breath.
- NEVER put a glow, an ember, a coal or a light INSIDE or WITHIN a small dark opening — not in a gap between boards, a slot, a crack, a vent, a stove door, a chimney, a doorway or a hole. Measured on this bot: the model transplants that glow onto the nearest dark aperture and paints a furnace burning inside it. A lamp is named as a LAMP hanging in plain sight, and its light is always described as LANDING ON a named surface (the straw, a lamb's damp curls, the rim of the box, the ewe's back).
- NO named or implied people: no figures, crowd, visitors, onlookers, bystanders, children, kids, laughter, voices, faces, hands, footprints. (The ONE exception is the shepherd-craft pool, which is explicitly written as an action with an implied subject.)
- NO negation phrasing inside an entry ("no lambs", "not a single..."). Describe only what IS present.
- NO distress and NO veterinary or medical register: no blood, no birth fluids beyond a damp coat, no death, no loss, no orphan grief, no struggle, no straining, no syringe, no needle, no gloves-and-lubricant, no assisted birth, no prolapse, no bottle-of-medicine, no thermometer. THE BIRTH ITSELF IS NEVER DEPICTED — every entry begins AFTER the lamb is already on the straw. This bot is cozy: the lambs are strong, the ewes are calm and unbothered, the work is warm and a little comic.
- NO commercial or industrial scale: no shed of eight hundred ewes, no pallets, no forklift, no gang of workers, no conveyor. A small, personal, hand-tended flock — a handful of ewes in a handful of pens.
- NO giant or oversized lambs, NO lamb standing upright on two legs, NO lamb holding or carrying an object, NO face or expression drawn onto a lamb, a ewe, a bucket or any other object. Every animal keeps its own true-to-life animal head, muzzle and eyes.
- NO LONE SINGLE LAMB as the whole subject of an entry. A single named lamb with nothing to compare it to renders at giant scale on this model. Every entry either names at least TWO lambs, or states one lamb's height against the ewe's own body or a named piece of the pen.
- NO OFF-CAMERA SIZE COMPARISON ("the size of a cat", "no bigger than a loaf", "hand-sized", "knee-high" with no knee in frame). A size comparison must name something actually IN THE FRAME and welded to a larger structure: the ewe's knee, chest, back or flank; a hurdle's bottom or second rail; the top of a straw bale; the rim of the box; the height of the shed doorway; the top of the field gate.
- NO SHEARING REGISTER AT ALL: no shears, no clippers, no fleece being rolled, no wool sack, no shearing board, no shorn or bare sheep. A separate path owns that entirely.
- NO greetings-card register: no cute lamb on a plain pale background, no ribbon, no bow, no bell, no basket of flowers, no Easter iconography, no bonnet.
- NO FORMATION OR ROW WORDING. Measured across three bots: "in a single line", "single file", "in a column", "in a row", "evenly spaced", "each progressively smaller", "one on each side", "on both sides" all render as a mirrored composition or as the subject tiled to a vanishing point. Write a group as a LOOSE UNEVEN MOB spread across the frame with one member set apart from it, and never with a symmetrical arrangement.
- NO brand names, NO camera or photographer names, NO named sheep breeds that are obscure — plain descriptive breed language only ("a blocky black-faced ewe", "a speckle-nosed ewe", "a broad cream-fleeced ewe").`;

// The scale law, stated positively, required verbatim-in-spirit by the two
// pools that carry animals. Lesson 13 and its two corollaries.
const SCALE_LAW = `⚖️ THE SCALE LAW (non-optional in every entry of this pool — this is the single most expensive failure on animal paths):
A lamb is SMALL. On this model, size tracks the COUNT, not any size word you write, and a low count is the giant-animal generator. So every entry must do BOTH of these:
  (a) NAME A REAL COUNT of lambs — "two", "three", "a pen of nine", "eleven or twelve", "a mob of fifteen" — and never a lone single lamb as the entry's whole subject.
  (b) RULE THE LAMBS against something IN FRAME that is welded to a larger structure — the ewe's own knee / chest / back / flank, a hurdle's bottom or second rail, the top of a straw bale, the rim of the box, the shed doorway's height, the top of the field gate. For example: "their backs come barely level with her knee", "the nearest one's head just clears the bottom hurdle rail", "all three together take up less of the pen than she does".
And spend the per-subject DETAIL on the nearest ONE OR TWO lambs only — describe the rest of the group holistically as a mass of small clean shapes, never as a list of individual actions. Detail and size are the same dial on this model: describing every lamb equally ENLARGES them all.`;

// The newborn-realism law — the positive crowd-out for the cute-product prior.
const NEWBORN_LAW = `🐑 THE NEWBORN LAW (the positive crowd-out for the greetings-card prior):
"A cute lamb" renders a clean symmetrical card lamb on a plain background. What makes a lamb real — and, in the same stroke, genuinely charming — is exactly how NEW it is. Use the true stages:
  • JUST BORN: the coat WET, in dark damp curls stuck flat to the body, faintly yellow-stained at the tips, the ears outsized and still folded over at the point, the legs plainly too long for it, the body still folded down on the straw.
  • A FEW HOURS OLD: dry across the back but still damp and spiky at the belly and tail, up on all four legs and swaying, the tail going like a metronome while it feeds.
  • A DAY OR TWO OLD: fully dry, fluffed into tight bright curls, the ears up, and bouncing — all four feet leaving the ground at once for no reason.
At least a third of the entries must name one of the WET or half-dry stages. This is not a grim detail; it is the specific, funny, tender truth of the thing.`;

const RECIPES = [
  // ───────────────────────────────────────────────────────────────
  // 1. ★ THE SIGNATURE MONEY-SHOT AXIS — the beat happening NOW
  // ───────────────────────────────────────────────────────────────
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_lambing_moment.json'),
    total: 25,
    batch: 40,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct LAMBING-SEASON MOMENTS for a cozy countryside anime
bot's new path. Each entry is ONE beat happening RIGHT NOW in late winter / early spring — either
inside a small working lambing shed or out in the field at the first turnout — with the animal that
is DOING it named FIRST as the grammatical subject, immediately followed by the action it is caught
mid-way through.

THE BAR: this has to be playful, adventurous, vivid, beautiful and CLEVER — something people have
never looked at closely, or something familiar redressed as far more interesting. A cute white lamb
standing in a green field is the FAILURE. Every entry must be a moment you would stop scrolling for
and want to tell somebody about.

NAME THE ACTOR. An action with no named actor renders as a disembodied body part on this model (a
cup "held out from the next deck" drew a giant floating hand). So never write "a bottle being
butted" — write "a lamb driving into the bottle with its whole body". The lambs and the ewe are the
actors in this pool.

LEAD WITH AN ACTIVE VERB AND A SHARED OBJECT, AND BAN REACTION-ONLY LANGUAGE. Measured on two bots:
"gazing at", "watching", "looking at each other", "wide-eyed at", "mouths open at", "standing
nose-to-nose", "pressed cheek to cheek" all collapse into a static figurine pose in the
brief-writing pass. Every entry must carry four things: an active verb, an implied before-and-after
moment, a body-language reaction, and a real object or event the animals are responding to.

ONE CHARM DETAIL PER ENTRY — a small clever specific the eye finds on second look, and it must make
it THAT moment and no other: a lamb with one ear still folded over at the tip; a scrap of baler
twine looped round a hurdle post and gone furry from being chewed; a lamb asleep with its chin
hooked over the bottom rail; a bootprint filled with water in the pen gateway; two lambs asleep
back to back in a pressed hollow in the straw exactly their own shape; a ewe's fleece worn shiny
where she has leaned on the same rail for a week; a bucket with a handle mended with wire; a lamb
that has got its whole head through the hurdle and cannot work out how it happened; one lamb still
wearing a dry crest of straw on its back from the night before.

VARIETY MANDATE — distribute the ${n} entries across these families. TAG each entry with its
setting:
- ~5 THE EWE WITH TWINS OR TRIPLETS (tag "shed"): one lamb already up and driving into her udder
  with its tail spinning while the second is still folded flat and damp on the straw beside her; or
  three lambs in a line along her flank; or two asleep in the dip behind her shoulder.
- ~3 THE BOX UNDER THE LAMP (tag "shed"): a cardboard box or a wooden crate set down in the corner
  of a pen with a lamp hanging over it on a hooked flex, and only the heads and the enormous ears of
  two lambs showing over the rim. Name the lamp plainly and put its light ON the straw or ON the
  lambs' curls — never a glow inside anything.
- ~3 THE BOTTLE (tag "shed"): a lamb driving into the bottle with its whole body, front feet off the
  ground, while the second lamb shoulders in from the side for its turn; a pair of lambs flanking
  one bottle from both sides at once.
- ~4 THE FIRST TURNOUT (tag "field"): a loose uneven mob of eleven or fifteen lambs going flat out
  across wet grass for no reason at all, spread wide and bunching as they wheel at the wall, one of
  them already peeled off sideways on its own; the whole batch coming through the gateway in a rush
  with the ewes shouting behind them; the first lamb out stopping dead in the open gateway with the
  rest piling into its back end.
- ~3 LAMBS AS FURNITURE (tag "shed" or "field"): a lamb standing square on its sleeping mother's
  back because she is the warmest thing in the pen, two more folded against her ribs; a heap of four
  lambs asleep on top of one another in the straw with one flat on its back, legs up.
- ~2 THE COUNT BY NOSE (tag "field"): a ewe working along her own lambs nose-first to check them
  while the third slips out behind her and stands looking pleased with itself.
- ~2 THE SHAFT OF LIGHT (tag "shed"): two lambs that have found the one bright band of light coming
  through a gap in the shed boards and are standing in it shoulder to shoulder, steam lifting off
  their backs. (Light LANDING on them — never a glow inside the gap.)
- ~2 STEAM OFF A WET NEWBORN (tag "shed"): a damp lamb up on all four legs and swaying, steam
  lifting visibly off its back in the cold air of the shed, its twin still down in the straw.
- ~1 THE HURDLE ESCAPE (tag "shed" or "field"): a lamb standing on the wrong side of the hurdle
  entirely, looking back through it at its mother and its twin.

ALSO TAG each entry "handled" or "standalone":
- "standalone" — the animals do everything; no person is implied anywhere in the sentence. AT LEAST
  ${Math.round(n * 0.7)} of the ${n} entries must be "standalone".
- "handled" — the moment genuinely needs a person in it (a bottle held, a lamb carried, a box set
  down). When you write one of these, NAME THE WHOLE FIGURE as "the shepherd" — never a bare hand,
  arm, boot or lap on its own, which renders as a floating body part.

${SCALE_LAW}

${NEWBORN_LAW}

AXIS-CLEAN — CRITICAL: this pool must contain ZERO time-of-day words, ZERO weather words, ZERO
season-naming words and ZERO colours of light (no "golden", "afternoon", "morning", "dawn",
"sunset", "dusk", "night", "misty", "rainy", "overcast", "snowy", "warm light", "cool light"). A
separate axis owns all of that and a time-of-day word here directly contradicts it. You MAY say
steam is lifting off a wet lamb, and you MAY say the grass is wet, because those are the literal
subject of those shots — but never say when, in what weather, or in what colour.

Output ONLY a JSON array of ${n} objects, each exactly {"tags": ["shed"|"field", "standalone"|"handled"], "description": "..."}.
30-42 words per description. No preamble, no numbering.

Examples:
[{"tags":["shed","standalone"],"description":"A ewe lies flat out in the straw while one lamb drives into her udder with its tail spinning, and its twin is still folded down beside her, coat in dark damp curls, one outsized ear bent over at the tip. Both backs come barely level with her knee."},
{"tags":["field","standalone"],"description":"Fifteen lambs go flat out across wet grass in one ragged line for no reason at all, wheel together at the stone wall and come straight back, the nearest pair's heads not clearing the bottom rail of the field gate they have just poured through."},
{"tags":["shed","handled"],"description":"A lamb drives into the bottle the shepherd is holding with its whole body, both front feet off the straw, while its pen-mate shoulders in from the side for a turn; a scrap of baler twine on the hurdle post has gone furry from being chewed."}]

${BANS}

Output ONLY the JSON array, no preamble, no numbering.`,
  },

  // ───────────────────────────────────────────────────────────────
  // 2. THE EWE — the co-lead, and the path's SIZE RULER
  // ───────────────────────────────────────────────────────────────
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_lambing_ewe.json'),
    total: 25,
    batch: 40,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct EWE descriptions for a cozy countryside anime bot's
lambing path. Each entry is ONE mother sheep — her mass, her colouring, her posture, her attitude to
her own lambs — and she is ALWAYS the in-frame ruler that fixes how small the lambs are.

THIS POOL DOES TWO JOBS AT ONCE AND BOTH ARE REQUIRED IN EVERY ENTRY:
  1. THE CO-LEAD. She is not a prop. She gets real character: placid, watchful, faintly long-
     suffering, dozing with her chin on the straw, chewing steadily through the whole performance,
     leaning on a rail, standing over her lambs like furniture, unbothered by anything.
  2. THE RULER. Her body is what makes the lambs read small. State a real COUNT of her lambs and
     rule their height against HER OWN BODY or against a named piece of the pen.

KEEP IT SHORT AND DENSE — these are 16-24 words each, not paragraphs. Every word earns its place.

VARIETY MANDATE across the ${n} entries:
- Vary her MASS and SILHOUETTE: blocky and deep-chested; long and rangy; broad and low; heavy in the
  belly and slow; neat and compact.
- Vary her COLOURING in plain descriptive language: black-faced with a cream fleece; speckle-nosed;
  soot-grey about the muzzle; a clean white face with dark rings round the eyes; tan-cheeked; one
  ear notched pale (a natural pale patch of colour, never a cut record of anything).
- Vary her FLEECE STATE: deep and springy; flat and travel-worn down one flank; carrying a dry wisp
  of straw across her back; rubbed shiny at one shoulder from a week of leaning on the same rail.
- Vary her POSTURE: standing square over them; lying flat out with her chin down; up on her front
  knees mid-rise; head over the hurdle rail; nose down working along her lambs; dozing with her eyes
  half shut while chaos happens on her back.
- Vary the LAMB COUNT: two, three, a single strong single with a second ewe's twin adopted onto her,
  twins of very different sizes.

${SCALE_LAW}

AXIS-CLEAN — CRITICAL: ZERO time-of-day words, ZERO weather words, ZERO season-naming words, ZERO
colours of light. A separate axis owns all of that. No "golden", "morning", "dusk", "misty",
"overcast", "warm light".

Output ONLY a JSON array of ${n} objects, each exactly {"tags": ["ANY"|"shed"|"field"], "description": "..."}.
Most should be "ANY" (a ewe works in either place). Tag "shed" only if the entry names the straw or
a pen, "field" only if it names grass or a wall. 16-24 words per description.

Examples:
[{"tags":["ANY"],"description":"A blocky black-faced ewe, deep in the chest and chewing steadily, standing square over three lambs whose backs come barely level with her knee."},
{"tags":["shed"],"description":"A long rangy ewe lies flat out in the straw, chin down, eyes half shut, while her twins together take up less of the pen than she does."},
{"tags":["ANY"],"description":"A broad cream-fleeced ewe with dark rings round her eyes, one shoulder rubbed shiny from leaning, her two lambs no taller than her flank is deep."}]

${BANS}

Output ONLY the JSON array, no preamble, no numbering.`,
  },

  // ───────────────────────────────────────────────────────────────
  // 3. THE SET DRESSING — and the text backfill's replacement
  // ───────────────────────────────────────────────────────────────
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_lambing_dressing.json'),
    total: 25,
    batch: 40,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct SET-DRESSING descriptions for a cozy countryside anime
bot's lambing path — the place immediately around the animals, close behind them. Half are the
inside of a small working lambing shed; half are a field at the first turnout.

THIS POOL HAS A SECOND, HIDDEN JOB, AND IT IS THE REASON IT EXISTS. On this model, a flat surface
that nothing describes GROWS PSEUDO-LETTERING out of nowhere — and "plain" or "blank" is a negation
the model cannot process, so writing "a blank board" summons a written one. The cure is to name what
the surfaces actually CARRY, and the anti-lettering form has to itself be the interesting thing. So
EVERY entry must name at least one REAL OBJECT sitting on, hanging from or leaning against a flat
surface. That is where the charm of this pool comes from — it is a set-dressing win, not a tax.

The legal object vocabulary (use it freely, mix it, add more of the same kind): a coiled rope on a
nail; a galvanised bucket hanging by its handle; a lamp on a hooked flex; a halter looped over a
rail; a leaning stack of spare hurdles; straw bales stacked up into the rafters; a kettle and two
mugs on a shelf; a folded heap of clean sacks; a besom broom stood in a corner; a bale of straw with
its string cut and half of it pulled apart; a wooden chair with a coat over the back of it; a
water bucket with a skin of dust on it; a pitchfork stood against the boards; a hay rack; a ring
feeder; a water trough brimming over at one corner; a field gate on a rope hinge; a gap in a stone
wall shut with a single hurdle; a hawthorn hedge just breaking bud; a puddle standing in a gateway.

TWO FURTHER REQUIREMENTS, EACH FIXING A MEASURED FAILURE:

⚑ EVERY "shed" ENTRY MUST NAME WHAT THE SHED IS BUILT OF. Measured on two other bots: an interior
whose enclosing surfaces are described only by adjective renders as a diorama floating in a void or
under open sky, and camera words do not fix it — NAMING THE ENCLOSING SURFACES AND WHAT THEY ARE
MADE OF does. So say the construction plainly: whitewashed stone gone patchy; tarred feather-edge
boarding; corrugated tin on a timber frame with the rafters showing; breeze-block to waist height
and boards above; a beam ceiling with bales stacked up into it. And say that the shed's own walls
close the frame down both sides and its roof closes it overhead.

⚑ EVERY "field" ENTRY MUST NAME ONE LATE-WINTER STRUCTURAL CUE. Measured on another bot: a
season-neutral outdoor entry lets the render drift to full summer or to snow. The legal cues are
STRUCTURAL FACTS OF THE PLACE, not statements about the weather or the hour (that is another axis's
job entirely): a bare thorn hedge with the first buds only just breaking; last year's grass still
bleached fawn with new green coming up through it; dead bracken flattened along the wall; a
mud-slick churned gateway; a frost-stiff tussock; rushes standing dead and pale in the wet corner;
bare-branched ash along the boundary. Name one, plainly, and nothing about the hour or the weather.

VARIETY MANDATE:
- ~13 tagged "shed": the inside of a small working lambing shed — pens made of hurdles tied with
  baler twine, straw ankle-deep and trodden into hollows, bales up into the rafters, a plank
  walkway, a lamp hanging on its flex, slatted boards with bright bands of light coming between
  them — with the construction named per the rule above.
- ~12 tagged "field": a small, hand-tended late-winter field — a stone wall or a thorn hedge, a
  field gate, a ring feeder with hay pulled out round it, a trough, rushes in the wet corner,
  molehills, a lane worn along the wall — with a late-winter structural cue named per the rule above.
- AT LEAST 4 of the "shed" entries must ALSO carry the CONTINUITY LAW in full, because a shed
  interior with something visible through its door or window otherwise renders as a hard-divided
  two-panel image on this model. Written as three linked parts in one sentence: (a) name the opening
  as part of the room itself — its own jamb, its sill, the hurdle propped across it, the boards
  round it; (b) name the field seen THROUGH it, softer and hazier and much smaller in the frame; and
  (c) bring that outside light BACK IN onto a named thing inside — the straw by the door, the
  nearest hurdle rail, the plank walkway, the ewe's back. That returning light is what stitches it
  into one frame. Never write "split", "panel", "divided" or "two halves" — naming them seeds them.

VIVID — this bot's palette must be richly saturated, never washed out. Name real committed colours
for the OBJECTS and SURFACES (a galvanised bucket gone chalky, a gate painted a faded blue, a green
enamel kettle, bright blue and orange baler twine at every hurdle joint, moss on the north side of
the wall, whitewash gone butter-yellow with age, iron strap hinges worn silver-bright). Colours of
LIGHT belong to another axis.

⛔ NO RUST AND NO RED-FAMILY COLOUR ON ANY METAL OR TIMBER. Measured on this path in round 2: "a
faded blue gate on a rope hinge, rust-orange hinges showing at the post" rendered as two bright wet
orange-red runs streaking down the gate post and down the crook leaning beside it, which on a
LAMBING path reads unmistakably as BLOOD. A rust word on a wet-weather farm path is a blood
generator. Banned outright: rust, rusted, rust-orange, rusty, crimson, scarlet, maroon, dark red,
deep red, oxblood. Worn iron is "worn silver-bright" or "gone chalky grey".

KEEP IT SHORT — 24-34 words each.

AXIS-CLEAN — CRITICAL: ZERO time-of-day words, ZERO weather words, ZERO season-NAMING words ("late
winter", "spring", "March", "February" are banned AS WORDS even though the structural cues above are
required), ZERO colours of light. "Bright bands of light between the boards" is allowed because it
is a structural fact of the shed; "golden morning light between the boards" is not.

Output ONLY a JSON array of ${n} objects, each exactly {"tags": ["shed"|"field"], "description": "..."}.

Examples:
[{"tags":["shed"],"description":"Whitewashed stone gone patchy closes both sides and a beam roof with bales stacked into it closes overhead; hurdle pens tied with baler twine, straw trodden into hollows, a galvanised bucket on a nail."},
{"tags":["shed"],"description":"Tarred feather-edge boarding down both sides under a corrugated tin roof, the doorway's own timber jamb framing the field small and hazy beyond, that light coming back in across the straw and the nearest hurdle rail."},
{"tags":["field"],"description":"A dry stone wall with moss thick on its north side, dead bracken flattened along its foot, one gap shut by a single hurdle, a brimming trough and a faded blue gate on a rope hinge."}]

${BANS}

Output ONLY the JSON array, no preamble, no numbering.`,
  },

  // ───────────────────────────────────────────────────────────────
  // 4. THE SHEPHERD'S CRAFT — character branch only
  // ───────────────────────────────────────────────────────────────
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_lambing_craft.json'),
    total: 25,
    batch: 40,
    append: true,
    banHumanLanguage: false,
    metaPrompt: (n) => `Generate ${n} distinct SHEPHERD ACTIONS for a cozy countryside anime bot's
lambing path. Each entry is ONE thing a person is doing, caught MID-ACTION, written as a gerund
phrase with an IMPLIED subject (the template supplies the character separately).

FORMAT: start with the verb. "Kneeling in the straw to rub a newborn dry with a fistful of clean
straw." "Walking backwards through the gateway with a lamb held low in each arm, the ewe following
nose to heel." Never start with "she" or "he" or "the farmer" — the template already names who it is.

⛔ ZERO GARMENT NOUNS. This is measured and load-bearing: an action axis that names a garment
dresses EVERY render the same way and completely overrides the separate wardrobe axis (a coat named
in an action pool put the same blue coat on every single render of another bot's path). So no coat,
jacket, overall, boiler suit, smock, apron, glove, hat, cap, scarf, boot, wellington, sleeve, cuff,
pocket. Name the ACTION and the OBJECT ACTED ON, never what the person is wearing.

MID-ACTION, NEVER PARKED. "Standing by the pen" is a miss. "Leaning right over the top rail with
both elbows to count the pen twice because the answer came out different the first time" is a hit.

THE BAR: playful, adventurous, CLEVER. Show the real craft of this — the specific, funny, competent
things a shepherd actually does, that almost nobody has ever seen. Aim there, not at "feeding a
lamb".

VARIETY MANDATE across the ${n} entries — tag each "shed", "field" or "ANY":
- ~6 THE NEWBORN CARE (shed): rubbing a damp lamb dry with a fistful of straw; setting a wet lamb
  down in a crate under the lamp and folding a sack over half the top; steering a new lamb's nose
  the last inch to the udder and then sitting back on the heels to watch it find it.
- ~5 THE BOTTLE AND THE FEED (shed): holding a bottle out at arm's length while a lamb drives into
  it with its whole body; warming a bottle against the side of the neck to test it; kneeling with
  two bottles going at once, one in each hand, with a third lamb already shouldering in.
- ~5 THE MOVING (ANY): walking backwards through a gateway with a lamb held low in each arm so the
  ewe will follow nose to heel; lifting a hurdle out of the way with one knee and a shoulder;
  carrying a whole bale in front of the chest and dropping it into the pen; shaking a bucket once so
  the whole flock turns at the sound.
- ~4 THE TURNOUT (field): swinging the field gate wide and standing well back out of the rush;
  crouching in the wet grass to watch the mob go past; walking the wall line slowly counting; sitting
  down on the top of the gate to watch the first sprint.
- ~3 THE QUIET WORK (shed): forking clean straw into a pen and treading it flat; leaning right over
  the top rail with both elbows to count the pen twice; setting a kettle on and then forgetting it
  entirely.
- ~2 THE THREE-IN-THE-MORNING WATCH (shed): dozing sitting up in a wooden chair beside the pen with
  a lamb asleep across one foot; waking with a start and counting the pen before anything else.

AXIS-CLEAN — CRITICAL: ZERO time-of-day words, ZERO weather words, ZERO season-naming words, ZERO
colours of light. (The three-in-the-morning family is a POSTURE — dozing in the chair — never a
statement about the hour or the light; write the posture, not the time.)

KEEP IT SHORT — 16-26 words each.

Output ONLY a JSON array of ${n} objects, each exactly {"tags": ["shed"|"field"|"ANY"], "description": "..."}.

Examples:
[{"tags":["shed"],"description":"Kneeling in the straw to rub a damp newborn dry with a fistful of clean straw, working along its back the wrong way on purpose."},
{"tags":["ANY"],"description":"Walking backwards through the gateway with a lamb held low in each arm so the ewe will follow nose to heel the whole way."},
{"tags":["field"],"description":"Swinging the field gate wide and stepping well back out of the rush, one hand still on the top bar as the mob pours past."}]

${BANS}

Output ONLY the JSON array, no preamble, no numbering.`,
  },

  // ───────────────────────────────────────────────────────────────
  // 5. ★ LIGHT & AIR — the ONLY axis that owns time, weather, palette
  // ───────────────────────────────────────────────────────────────
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_lambing_light.json'),
    total: 25,
    batch: 40,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct LIGHT-AND-AIR descriptions for a cozy countryside
anime bot's lambing path (late winter into early spring, a small lambing shed and a spring field).
THIS IS THE ONLY AXIS ON THE PATH THAT OWNS TIME OF DAY, WEATHER AND THE COLOUR OF LIGHT — every
other pool is deliberately silent on all three, so this axis alone sets the palette of the render.
That makes it the path's palette axis, and it has to COMMIT.

⭐ VIVID IS LITERAL AND IT IS THE BAR. Saturated, committed colour and real light drama. A muted
grey-brown frame is a MISS on this bot even when it is technically competent. So EVERY entry NAMES
TWO COMMITTED COLOURS and says what each one is ON.

⚠️ THE ONE HARD TRAP ON THIS AXIS, and it is measured on this bot: a lambing shed has heat lamps and
sometimes a stove, and A SMALL DARK OPENING PLUS A GLOW WORD RELOCATES THE GLOW — the model
transplants it onto the nearest dark aperture and paints a furnace burning inside it. So: a lamp is
named as a LAMP HANGING IN PLAIN SIGHT, and its light is ALWAYS described as LANDING ON a named
surface (the straw, a lamb's damp curls, the rim of the crate, the ewe's back, the plank walkway).
NEVER a glow inside, within, deep in or behind anything. No stove interior, no firebox, no ember.

BALANCE MANDATE — count these out deliberately, because a self-carried atmosphere axis is exactly
what produced this bot's documented "always sunny" failure on another path family:
- ~8 WARM-DOMINANT: a hanging lamp laying a hot apricot pool across the straw; low copper sun right
  down the length of the shed; a butter-yellow band of sun across a whitewashed wall.
- ~9 COOL-DOMINANT: a hard blue pre-dawn with every breath showing; flat pearl-grey overcast with
  the new grass gone deep saturated green under it; thin silver drizzle and the wall stone gone
  near-black with wet; a cold violet hour with the first green reading almost turquoise.
- ~8 WARM AGAINST COOL (the strongest family — make these genuinely dramatic): a hanging lamp's hot
  apricot pool on the straw against the cold slate blue coming in the doorway; a bright hard band of
  gold between two boards landing on a lamb's back while the rest of the shed stays a deep cool
  blue-grey; a low gold sun under a bruise-purple hail cloud, the wet grass lit acid green against
  it; sun breaking through right as a hail shower goes over, the air full of bright white grains.

ALSO: vary the AIR ITSELF — breath showing, steam lifting off wet backs, chaff and straw dust up in
a beam, hail grains bouncing, fine drizzle, still cold air with nothing moving in it, a wind pushing
the new grass all one way.

⚑ TAG each entry "shed" or "field", and THE SHED TAG HAS A HARD ENTRY REQUIREMENT. Measured on this
path in round 1: the three flattest, palest renders of the batch were all shed renders, and each one
had rolled a light entry that described an outdoor SKY or an outdoor SUN ("hard midday sun", "a
butter-yellow low sun in a clear pale-blue sky", "a cold clear dawn") — which a shed interior
physically cannot show, so the model had nothing to anchor the light to and rendered flat ambient
daylight, taking the whole palette pale. The entries that worked all named a source that is
actually IN THE FRAME. So: EVERY "shed" ENTRY MUST NAME AN IN-FRAME LIGHT SOURCE the shed itself
contains — a lamp hanging on its flex, a hurricane lantern set down on a bale, a hand torch left on
the rail, the open doorway, the open end of the shed, a gap between two wall boards, the one
translucent sheet set into the tin roof — and must say what its light LANDS ON. An outdoor sky or
sun belongs on a "field" entry only. Do NOT use an "ANY" tag on this pool at all: light is
inherently setting-specific here. Aim for roughly half and half, and do not open more than about a
third of the shed entries with the word "lamp" — vary the source.

KEEP IT SHORT — 18-28 words each.

⛔ NEVER pair "dark"/"darkness"/"shadow" with a light word ("glint", "sparkle", "shimmer",
"luminous", "glow") describing the SAME thing in the same phrase. This exact pairing is a documented
trap on this bot: the brief-writer escalates it into a literal glowing beam or a patch of night sky
cut into a daytime scene. Describe a shaded area plainly and put any light word on a DIFFERENT,
separately-named thing.

⛔ LIGHT IS NEVER A SOLID OBJECT. Measured across three bots: light called a "column", "pillar",
"shaft", "beam", "ray", "bar", "wall" or "curtain" renders as a literal solid column, pillar or
spotlight cone standing in the room. So NAME THE LIT SURFACE FIRST and let the light be what is ON
it: "the straw is laid over with a hot apricot pool", not "a shaft of apricot light falls on the
straw". A flat BAND of brightness across a named surface is the one safe shape.

⛔ Literal light language only. No metaphorical object standing in for light.

✅ STATE THE SOURCE, AND STATE THAT IT IS THE ONLY ONE. Every entry names where its light is coming
from — the hanging lamp, the open doorway, the gaps between the boards, the open sky, a hurricane
lantern set down on a bale — and reads as if that is the whole lighting of the frame. This is the
positive form of a night rule: name the real light there IS rather than the light there is not.

Output ONLY a JSON array of ${n} objects, each exactly {"tags": ["shed"|"field"|"ANY"], "description": "..."}.

Examples:
[{"tags":["shed"],"description":"A lamp hangs low on its flex and lays a hot apricot pool right across the trodden straw, while cold slate blue comes in at the open doorway behind it."},
{"tags":["field"],"description":"A low copper sun under a bruise-purple hail cloud, the wet grass lit acid green against it and every breath showing in the cold still air."},
{"tags":["ANY"],"description":"Flat pearl-grey overcast with no sun anywhere in it, every green gone deep and saturated underneath, the air cold and completely motionless."}]

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
