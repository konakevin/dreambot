#!/usr/bin/env node
/**
 * Generate the BrickBot `balloon-festival` axis pools using Sonnet.
 *
 * Own gen script (NOT recipes bolted into the 5.8k-line shared
 * gen-brickbot-pool.js, and NOT into gen-brickbot-airfield-pools.js) so this
 * path build never contends with another agent on a shared file.
 * Infrastructure (signatureOf / dedupe / target-loop / numbered-list parse /
 * timestamped backup) mirrors gen-brickbot-airfield-pools.js verbatim so pool
 * files come out byte-compatible.
 *
 * Per `feedback_each_path_bespoke_not_cloned`: every recipe here is
 * balloon-festival-bespoke. Canon: LEGO Creator/Ideas hot-air balloon builds,
 * classic LEGO Town fairground, the Bricklink AFOL "Lowell sphere" /
 * curved-slope envelope community, and real mass-ascension balloon fiestas.
 *
 * ⚠️ TRAP ZERO, AND IT OUTRANKS THE OTHER THREE: never write "envelope" for
 *    the bag — write "hot-air balloon". Measured in round 0: prompts
 *    containing "balloon" rendered the fleet 1/1, prompts containing only
 *    "envelope" rendered it 0/5, and two of those five came back as a carpet
 *    of LITERAL PAPER MAIL ENVELOPES. See NOUN_LAW below.
 *
 * THE THREE TRAPS THESE RECIPES EXIST TO DEFEAT (playbook lessons 1/2/12/13/
 * 14/17/22/24/25/26):
 *
 *   1. A BALLOON ENVELOPE IS A HUGE BLANK CURVED SURFACE — the strongest
 *      lettering magnet available, because real balloons carry sponsor logos
 *      and that is Flux's prior. Defeated by lesson 14's MERGE: the anti-text
 *      form ITSELF carries the interest. An envelope is identified by its
 *      PATTERN (broad vertical gore stripes in two saturated colours,
 *      concentric chevron bands, a two-colour chequerboard, a crown-to-skirt
 *      gradient in brick rows, a contrasting crown ring) or by its SHAPE (a
 *      bee, a dragon head, a teapot, an owl, a rocket) — never by a marking.
 *      Stated in the SEED (lesson 13: a surface named in a seed is clean 9/9)
 *      AND in the template's required OUTPUT ORDER (lesson 22: a law appended
 *      to a seed tail reaches ~20% of prompts; the output order takes it to
 *      100%). Text-SHAPED objects (signs, boards, banners, pennants, flags,
 *      scoreboards) are DELETED from every layer, never described (lesson 12).
 *
 *   2. SCALE AND COUNT — a low count is the giant-object generator
 *      (lesson 13), and a shape word in an object's NAME becomes the shape on
 *      screen (lesson 25). So the fleet's count floor is TWO DOZEN, stated as
 *      a number in every fleet entry, with the height spread named (nearest
 *      huge, farthest specks) and a ruler WELDED to the scene (the minifigure
 *      crowd on the ground, a balloon's own basket rim, a trailer wheel).
 *      Massing words that render as one impossible object — tower, column,
 *      stack, pyramid, wall, arch — are banned for the fleet.
 *
 *   3. THE CORRIDOR — a launch field is a flat linear stage, and a line of
 *      similar objects tiles to a vanishing point (lessons 17/24). Defeated by
 *      the CROSSWISE LAW in all three places that reach Flux: the template's
 *      first rule, every launch_field seed, and output-order item 1 — the
 *      field crosses the picture from the left edge to the right edge, the far
 *      treeline is a BAND across the middle, both ends run out of frame, and
 *      the balloons sit at genuinely different HEIGHTS rather than in a row.
 *
 * Two structural decisions worth knowing before editing a recipe:
 *   • Every `festival_moment` entry must be stageable ON or JUST ABOVE the
 *     launch field, because a moment that brings its OWN VENUE renders as two
 *     places at once (measured on airfield-biplanes). Fixed structurally in
 *     the recipe rather than with a template compatibility clause — a prose
 *     clause loses to a pool pick every time.
 *   • There is NO separate palette axis. Colour on this path comes from the
 *     envelopes, so a palette pool would CONTRADICT the rolled fleet ("teal
 *     and rust" over a magenta/lime/orange fleet). Time-of-day + direction +
 *     colour story are fused into `festival_light`, which also buys back a
 *     slot of first-third word budget (lessons 18/21).
 *
 * Usage:
 *   node scripts/gen-brickbot-balloon-pools.js --pool brickbot_balloon_fleet --target 25
 *   node scripts/gen-brickbot-balloon-pools.js --pool brickbot_balloon_light --count 25
 *
 * Output: scripts/bots/brickbot/seeds/<pool>.json
 *
 * NOTE: brickbot_balloon_camera_framing is deliberately NOT here — camera
 * pools are HAND-AUTHORED. Sonnet-generated camera pools leak their sibling
 * axes (time of day, weather, terrain, posture verbs) by default, and on a
 * LEGO-photography bot an AXIAL or PLAN-VIEW camera entry is a hard-fail
 * GENERATOR that out-votes every anti-symmetry mandate in the template
 * (airfield-biplanes, four batches, every hard fail traced to 3 of 25 camera
 * entries). The fix is purging entries, not strengthening the mandate.
 */

const fs = require('fs');
const path = require('path');
const { SONNET } = require('./lib/models');

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
// the three traps above cannot drift apart between pools.
// ─────────────────────────────────────────────────────────────

const NOUN_LAW = `⚠️⚠️ CALL IT A HOT-AIR BALLOON, NEVER AN "ENVELOPE". This is the single most important rule in this file and it is measured, not theoretical. "Envelope" is the correct ballooning term for the fabric bag and it is a CATASTROPHIC prompt token: the image model's prior for the word is a PAPER MAIL ENVELOPE. Round 0 of this path was written in the jargon and the six stored prompts split perfectly against their six renders — the one prompt containing the word "balloon" rendered a sky of forty balloons, and the five that said only "envelope" rendered ZERO balloons, two of them a literal carpet of paper mail envelopes with a brick owl and a brick castle turret sitting in it.

So: the first mention in every entry is "hot-air balloon" or "hot-air balloons" (plain "balloon" alone still carries a PARTY-balloon prior). Later mentions in the same entry may say "balloon" or "the balloon's panels". NEVER write "envelope", "envelopes", "the envelope's", "envelope panels", "envelope mouth" or "envelope sleeve" — say "balloon", "the balloon's panels", "the balloon's mouth", "a folded-up balloon". BANNED WORD: envelope.`;

const BRICK_LAW = `⚠️ EVERYTHING IS LEGO BRICK. A balloon envelope is built from stacked rings of curved slope bricks stepping in toward a big dish element at the crown, its gore seams visible as rows of studs and macaroni-brick edges; the basket is a lattice of brown bricks with bar-and-clip corner uprights; the burner is a trans-orange flame element above a chrome cylinder; load tapes are taut bar-and-clip runs. Grass is a green plate mosaic with moulded tuft elements, mist is trans-white plates lying low, cloud is white cloud-slope bricks, water is trans-blue plates, foliage is moulded plant elements. Every figure is a LEGO minifigure with C-shaped hands and a printed face. BANNED WORDS: photoreal, photorealistic, CGI, rendered, lifelike, real nylon, ripstop, real fabric, silk, scale-model, aged patina photograph, hyperreal.`;

const NO_TEXT_LAW = `⚠️ NO READABLE TEXT ANYWHERE — this is the path's hardest failure, and a balloon envelope is the single biggest blank curved surface in the whole fleet, so it is the strongest lettering magnet there is. Real balloons carry sponsor logos, which means lettering is exactly what the image model expects. So an envelope is identified by ONE of these and nothing else:
  • its PATTERN — broad vertical gore stripes in two alternating saturated colours, concentric chevron or zigzag bands, a two-colour chequerboard, a colour gradient from crown to skirt built in stepped brick rows, plain smooth single-colour brick with a contrasting crown ring, a spiral of two colours winding up to the crown, a flame-tongue skirt in a third colour;
  • or its SHAPE — the whole envelope built as an object or a creature (a bee, a dragon head, a teapot, an owl, a rocket, a fish, a cupcake, a cat's head, a castle turret, a watermelon slice, a snail, a penguin, a toucan, a crown, a hot-dog, a mushroom).
Say IN THE ENTRY that the panels are smooth unmarked brick carrying only their colour and their pattern. Name the plain surface for EVERY text-prone thing the entry mentions, independently — envelope panels, the basket sides, gas cylinders, the chase-trailer flank, the crown ring, a wicker hamper.
BANNED WORDS, and they are banned even in a sentence that says there are none of them: text, lettering, letters, word, words, number, numbers, numeral, digit, sponsor, logo, brand, label, name, nameplate, sign, signage, signboard, placard, notice, board, chalkboard, clipboard, scoreboard, timetable, banner, bunting, pennant, flag, standard, streamer with writing, slogan, decal, sticker, stencil, mark, marks, marking, markings, glyph, sigil, monogram, insignia, crest, coat of arms, emblem, roundel, stamped, engraved, etched, inscribed, inscription, script, characters, writing, plaque, poster, map, chart, paper, ticket, price, clock face, compass rose, weathervane, sundial.`;

const SCALE_LAW = `⚠️ SCALE AND COUNT — the second hardest failure. A LOW COUNT IS THE GIANT-OBJECT GENERATOR: the image model gives each named subject a share of the frame, so "three balloons" means three impossibly huge balloons. A mass reads correctly and a handful never does. So: TWO DOZEN OR MORE, said as a number in the entry ("two dozen", "thirty-odd", "forty or more"), never "several", never "a few", never "a handful".
And the HEIGHT SPREAD is what makes the mass read as depth instead of wallpaper: the nearest envelope is huge and cropped by the frame, the middle ones are whole and readable, the farthest are bright specks high and small. Say so.
A size cue only works if the ruler is WELDED to something whose own size is fixed — the minifigure crowd standing on the grass, a balloon's own basket rim with figures in it, a trailer wheel, the burner frame. A free-floating comparison inflates along with the thing it is measuring.
MASSING WORDS BANNED for the fleet, because each one renders as ONE impossible object instead of many: tower, column, stack, stacked, pyramid, wall, arch, ribbon, chain, spire, pillar, heap, pile, cluster tight enough to touch. And banned because they generate a receding corridor that tiles copies to a vanishing point: row, rows, line, lines, queue, avenue, corridor, procession, receding, vanishing point, single file, evenly spaced, in formation.`;

const CROSSWISE_LAW = `⚠️ THE FIELD CROSSES THE PICTURE — the third hardest failure. A launch field is a flat linear stage and a flat linear stage renders as a corridor running dead up the middle with the subject tiled to a vanishing point. The form that beats it, measured: the mown field CROSSES THE PICTURE FROM THE LEFT EDGE TO THE RIGHT EDGE, its grass filling the near part of the frame, the far treeline or ridge or hedgerow a BAND ACROSS THE MIDDLE of the frame, and BOTH ENDS OF THE FIELD RUNNING OUT OF FRAME. State that shape in the entry. A corridor cannot exist in that frame.`;

const ASYMMETRY_LAW = `⚠️ NEVER EVEN-COUNT OR MIRRORED PHRASING. "a crewman on each side", "hedges on both sides", "two figures shoulder to shoulder", "one at either end" each render as a mirror-symmetric composition, which is a failed render on this bot. Write everything one-sided and unbalanced: "one crewman hauling at the near corner, another further back down the flank", "a hedgerow closing the left side only".`;

const REGISTER_LAW = `⚠️ TASTE REGISTER — iconic LEGO heritage reads best: LEGO Creator and LEGO Ideas hot-air balloon builds, classic LEGO Town and City fairground and festival sets, LEGO Friends bright-pastel cheer, and the Bricklink AFOL curved-slope-sphere community. Licensed pop-culture flavour is allowed and encouraged where it is more fun than the generic version (Kevin reversed the BrickBot IP ban 2026-09-22). NEVER hard-SF or modern-military photoreal registers, no jets, no drones, no cyberpunk — those photoreal-drift and kill the "everything is brick" signal. Classic-era charm over grimdark, always.`;

const DELIGHT_LAW = `⚠️ THE BAR — PLAYFUL, ADVENTUROUS, VIVID, BEAUTIFUL, CLEVER. This is DreamBot: the render exists to DELIGHT. A technically-correct entry that is sober, tidy or merely plausible is a MISS, not a pass. The failure to avoid is the travel-brochure photo: a few tasteful balloons over a tasteful field. Every entry must either show something a viewer has NEVER SEEN, or take the obvious version and REDRESS it as something more interesting. Ask of every entry: is this the obvious version or the surprising one? Write the surprising one.

⚠️ VIVID IS LITERAL AND IT IS THE WHOLE POINT OF THIS PATH. A sky full of saturated committed colour is the reason this path exists. A washed-out, pastel-hazy, tasteful-grey or sparse sky is a FAILED render. Name real saturated colours — magenta, lime, cyan, tangerine, egg-yolk yellow, hot pink, cobalt, vermilion — and commit to them.

⚠️ ONE CHARM DETAIL PER ENTRY — a small clever thing the eye discovers on second look, specific to THAT entry and no other (a dog in goggles riding in the basket, a cat asleep on the folded envelope bag, a marching-band tuba player still playing as his basket lifts, a picnic hamper left open with a chicken in it, a kid's balloon on a string tangled in the load tapes). Never a generic flourish.

⚠️ ADVENTURE AND A LITTLE COMEDY ARE WELCOME. This is a toy, and toys are played WITH: a bee-shaped envelope lifting off while a dog-shaped one is still flat on the grass being inflated; one envelope glowing from inside like a paper lantern as its burner fires at dusk; a basket of minifigures all leaning to one side to look down; a balloon caught in an oak with the crew hauling on ropes while everyone else pretends not to look; a tiny single-seat envelope dwarfed beside a cathedral-sized one; ground crew holding a half-inflated envelope open like a cave mouth with a minifigure standing inside it. Mid-action beats a parked balloon every single time.`;

// ─────────────────────────────────────────────────────────────
// POOL RECIPES — balloon-festival (8 gen'd axes; camera hand-authored)
// ─────────────────────────────────────────────────────────────

const POOL_RECIPES = {
  // ════════════════════════════════════════════════════════
  // FLEET — ★ THE MONEY-SHOT AXIS. The massed sky. Leads the prompt.
  // ════════════════════════════════════════════════════════
  brickbot_balloon_fleet: {
    format: 'simple',
    theme: `A MASSED FLEET OF BRICK-BUILT HOT-AIR BALLOONS — ★ the money shot and the whole reason this path exists. Each entry is ONE fleet, 40-58 words: HOW MANY (two dozen minimum, said as a number), HOW THEY ARE SPREAD IN HEIGHT AND DEPTH, and THREE OR FOUR individual envelopes picked out and identified by PATTERN or by SHAPE, in vivid saturated colour.

This axis is the hero mass of the render and it leads the prompt, so the first words of every entry are the fleet itself.

${SCALE_LAW}

${NOUN_LAW}

${NO_TEXT_LAW}

${DELIGHT_LAW}

${BRICK_LAW}

${REGISTER_LAW}

${ASYMMETRY_LAW}

VARIETY MANDATE — one entry each, spread across these fleet states: the moment of mass ascension with thirty envelopes at every height at once · a staggered launch, the first dozen already high and small while twenty more are still swelling on the grass · half the fleet still flat on the grass as long coloured sleeves while the rest stand up · a dawn launch with the lowest envelopes still shin-deep in ground mist · a dusk glow with two dozen envelopes lantern-lit from inside by their burners · a wind that has fanned forty envelopes out across the whole width of the sky at different heights · the fleet drifting low enough that the nearest baskets skim the treeline while the farthest are specks near the top of the frame · a crowded inflation field where two dozen part-swollen envelopes lean against each other like a field of enormous fruit · a cold-morning launch where every envelope is still pale and slack except six already taut and blazing with colour · a competition launch with thirty envelopes converging from all round the field toward a single point high up · a fleet where a third of the envelopes are SHAPED (a bee, a dragon head, a teapot, an owl, a rocket, a fish, a cupcake, a snail, a penguin, a hot-dog, a mushroom, a castle turret) and the rest are striped and chequered · a fleet in a narrow alpine valley stacked at every height between the pasture and the peaks · a fleet caught in a shaft of sun so eight envelopes blaze and the rest sit in shadow · a fleet over a frozen lake with the whole mass repeated in the trans-blue plate ice · a fleet so tall in the frame that the nearest envelope is cropped by three edges at once.`,
    touchpoints: [
      'Thirty-odd brick envelopes at every height at once, the nearest a huge magenta-and-lime gore-striped mass cropped by the top and left edges, a dozen whole and readable in the middle distance including a bee-shaped one with black and egg-yolk bands, and a scatter of bright specks high and small near the top of the frame, every panel smooth unmarked brick carrying only its colour.',
      'Two dozen envelopes still swelling on the grass as long slack coloured sleeves while six stand up taut behind them, a cyan-and-white chequerboard already clear of the tuft elements, a dragon-head envelope with its snout half-inflated and drooping, panels smooth unmarked brick, the whole field of them leaning one way in the breeze.',
      'Forty or more envelopes fanned out across the entire width of the sky at wildly different heights, a tangerine crown-to-skirt gradient in stepped brick rows nearest and huge, a teapot-shaped one with a curved-slope spout in the middle distance, the farthest no bigger than the minifigure crowd is tall, every panel smooth unmarked brick.',
      'At dusk, two dozen envelopes lantern-lit from inside by their burners so each glows a different saturated colour against a cobalt sky, the nearest a vast hot-pink and white spiral filling the left half of the frame, a rocket-shaped one three baskets back, panels smooth unmarked brick, the highest ones small warm dots.',
      'A crowded inflation field of two dozen part-swollen envelopes leaning against one another like a field of enormous fruit, vermilion, lime, cobalt and egg-yolk, one owl-shaped envelope with two big dish-element eyes already fully round among them, panels smooth unmarked brick, six more taut and rising beyond.',
      'Thirty envelopes in a narrow alpine valley stacked at every height between the pasture and the peaks, the nearest a cathedral-sized cobalt-and-vermilion chevron mass cropped by the frame, a tiny single-seat lime envelope no taller than the near basket beside it, panels smooth unmarked brick, the highest half-lost in the light.',
    ],
    instructions: `Each entry is ONE fleet, 40-58 words, a single flowing sentence or two, no headline prefix, no dash-separated title. Fleet massing, height spread, named envelope patterns and shapes, and the plain-panel statement only — no camera angle, no time of day beyond what the fleet state needs, no crowd, no story beat involving a named person. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // HERO BALLOON — the ONE near envelope, big in frame. The CLEVER axis:
  // roughly half are SHAPED balloons, which is where the surprise lives.
  // ════════════════════════════════════════════════════════
  brickbot_balloon_hero: {
    format: 'simple',
    theme: `THE NEAREST BALLOON — one brick-built envelope, huge and close in the frame, described so it composes with whatever fleet was rolled behind it. Each entry is 24-38 words and EVERY entry opens with the words "The nearest balloon" or "The nearest envelope".

ABOUT HALF THE ENTRIES ARE SHAPED ENVELOPES — the whole envelope built as a creature or an object. This is where the cleverness of the path lives, so make them genuinely surprising rather than the obvious ones. The other half are PATTERN envelopes: gore stripes, chevron bands, chequerboard, crown-to-skirt gradient, a contrasting crown ring, a two-colour spiral, a flame-tongue skirt.

Every entry also gives its BASKET and WHO IS IN IT — the basket with minifigures in it is the ruler that makes the envelope above it read as enormous, so it is never omitted.

${NOUN_LAW}

${NO_TEXT_LAW}

${DELIGHT_LAW}

${BRICK_LAW}

${ASYMMETRY_LAW}

VARIETY MANDATE — one entry each, spread across these: a bee with black and egg-yolk bands and two trans-clear wing plates · a dragon head with a curved-slope snout and a trans-orange flame at the mouth where the burner fires · a teapot with a macaroni-brick spout and a dish-element lid · an owl with two enormous dish eyes · a rocket with three tail fins of stacked slopes · a fat carp with overlapping plate scales · a cupcake with a swirled crown and stud sprinkles · a cat's head with two triangular ears · a castle turret with brick crenellations round the crown · a watermelon slice with black stud seeds · a snail with a spiral shell · a penguin · a toucan with an oversized curved beak · a crown with jewel-element points · a hot-dog complete with a wavy mustard stripe · a mushroom with white stud spots · broad vertical gore stripes in two alternating saturated colours · concentric chevron bands narrowing to the crown · a two-colour chequerboard · a crown-to-skirt gradient built in stepped brick rows · plain smooth single colour with a contrasting crown ring · a two-colour spiral winding to the crown · a flame-tongue skirt in a third colour · a patched envelope of mismatched salvaged panels in six colours · an envelope so tall that only its skirt and basket fit in the frame.`,
    touchpoints: [
      'The nearest balloon is a bee, its envelope banded black and egg-yolk in stacked curved slopes with two trans-clear wing plates bracketed out from the sides, panels smooth unmarked brick, three minifigures crowded into the brick-lattice basket below it and all leaning the same way.',
      'The nearest envelope is a dragon head, curved-slope snout and brick brow ridges, the burner flame element firing trans-orange right at its open mouth, panels smooth unmarked brick, one pilot minifigure in the basket with both C-hands on the burner frame and a goggled dog beside him.',
      'The nearest balloon carries broad vertical gore stripes alternating hot pink and cream, smooth unmarked brick panels with macaroni-brick gore seams, so tall that only its lower third and its basket fit the frame, four minifigures inside the basket packed shoulder to shoulder.',
      'The nearest envelope is a teapot, a macaroni-brick spout curving out one side and a dish-element lid at the crown, panels smooth unmarked brick in cobalt and white, two minifigures in the wicker-lattice basket and a picnic hamper wedged between their boots.',
      'The nearest balloon is a fat carp, overlapping plate scales in vermilion and gold down its whole length and a tail of flared slope bricks, panels smooth unmarked brick, a single minifigure in the small basket looking straight up into the envelope mouth.',
      'The nearest envelope is patched from mismatched salvaged panels in six saturated colours with a lime crown ring, every panel smooth unmarked brick, its brick-lattice basket hung low with coiled rope and three minifigures hauling on a line over the near rim.',
    ],
    instructions: `Each entry is 24-38 words, opening with "The nearest balloon" or "The nearest envelope", a single flowing sentence, no headline prefix, no dash-separated title. Envelope form, colour, plain-panel statement, basket, and who is in it only — no camera angle, no lighting, no fleet behind it, no field. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // MOMENT — the story beat. ALWAYS NAMES ITS ACTOR (a named action with no
  // named actor renders a disembodied body part). Stageable ON the field, so
  // it can never bring a second venue.
  // ════════════════════════════════════════════════════════
  brickbot_balloon_moment: {
    format: 'simple',
    theme: `THE FESTIVAL MOMENT — the frozen story beat of the render, 20-32 words. This axis sits third in the prompt and it is what makes the frame a scene instead of a postcard.

⚠️ EVERY ENTRY NAMES ITS ACTOR AS A WHOLE FIGURE. A named action with no named actor renders as a disembodied body part — a giant hand and forearm with nobody attached. So never "a rope hauled taut from the next basket"; always "a crewman minifigure hauling a rope taut". Every entry opens with the figure or figures doing the thing: "A crewman minifigure mid-…", "Two kid minifigures mid-…", "The pilot minifigure mid-…".

⚠️ EVERY MOMENT HAPPENS ON THE LAUNCH FIELD OR JUST ABOVE IT. Never invent a different venue — no duck pond, no jungle clearing, no city street, no mountain summit, no seaside jetty. A moment that arrives with its own place fights the field the render already has and the two resolve as unreadable mush. The field, its grass, its trailers, its crowd fence, its treeline and the air directly above it are the only stage.

${DELIGHT_LAW}

${ASYMMETRY_LAW}

${NOUN_LAW}

${NO_TEXT_LAW}

${BRICK_LAW}

VARIETY MANDATE — one each: a crewman minifigure mid-haul on a crown line as the envelope above him swings over · two crew minifigures mid-stretch holding a half-inflated envelope mouth open like a cave while a third stands right inside it · the pilot minifigure mid-blast on the burner with the trans-orange flame element at full length above her head · a basket of five minifigures all mid-lean to the same side to look down over the rim · a crewman minifigure mid-sprint alongside a basket that is already a stud clear of the grass, one C-hand still on the rim · two kid minifigures mid-scramble up the crowd fence to see over the heads in front · a ground-crew minifigure mid-throw of a coiled rope up to a basket lifting away · a marching-band minifigure mid-blow on a brick tuba while the basket he is standing in lifts off under him · a farmer minifigure mid-shout at a balloon settling into his hedgerow while his brick cows bolt · four crew minifigures mid-haul on ropes pulling a snagged envelope out of an oak while the crowd behind them all look pointedly the other way · a photographer minifigure mid-crouch under the near skirt aiming straight up into the envelope · a chase-trailer driver minifigure mid-reverse, leaning right out of the cab to watch a basket touch down behind him · a picnicking family of minifigures mid-startle as a basket skims the grass just past their hamper · a crewman minifigure mid-dive clear as a slack envelope collapses toward him · a dog minifigure-scale figure mid-streak down the grass after a trailing rope with its handler mid-lunge behind it · a pilot minifigure mid-hand-off of a jam jar down to a child on the grass · two crew minifigures mid-fold of a vast envelope into a long sleeve on the grass while a cat sits on the finished end · a marshal minifigure mid-wave with both C-hands raised as a basket comes down toward the grass · a balloon-shaped-like-an-owl's pilot minifigure mid-salute to the crowd from between the two dish eyes · a vendor minifigure mid-juggle of six brick apples as the crowd behind him all face the other way.`,
    touchpoints: [
      'Two crew minifigures mid-stretch holding a half-inflated envelope mouth wide open like a cave while a third stands right inside it looking up at the colour above.',
      'The pilot minifigure mid-blast on the burner, the trans-orange flame element at full length above her head and her whole envelope glowing from inside because of it.',
      'Four crew minifigures mid-haul on ropes pulling a snagged envelope down out of an oak while the crowd on the grass behind them all look pointedly the other way.',
      'A crewman minifigure mid-sprint alongside a basket already a full stud clear of the grass, one C-hand still hooked on the rim and both boots off the plates.',
      'A marching-band minifigure mid-blow on a brick tuba, still playing, in a basket that has already lifted off the grass underneath him.',
      'A farmer minifigure mid-shout at an envelope settling gently into his hedgerow while his brick cows bolt away across the tuft elements behind him.',
    ],
    instructions: `Each entry is ONE moment, 20-32 words, a single flowing sentence opening with the figure or figures doing it, no headline prefix, no dash-separated title. The beat and its physical consequence only — no camera angle, no lighting, no palette, no envelope colour, no new venue. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // FIELD — the all-brick stage. Carries the CROSSWISE LAW in every entry
  // (the law reaches Flux from three places; this is one of them).
  // ════════════════════════════════════════════════════════
  brickbot_balloon_field: {
    format: 'simple',
    theme: `THE LAUNCH FIELD — the all-brick stage the fleet rises off, 32-46 words. Each entry names WHERE the field is, states the CROSSWISE SHAPE verbatim in its own words, names ONE OR TWO pieces of field furniture identified by what is piled on or in them, and carries ONE charm detail.

${CROSSWISE_LAW}

⚠️ IDENTIFY EVERY PIECE OF FIELD FURNITURE BY WHAT IT CARRIES, NEVER BY A SIGN ON IT. A trailer is a trailer because it is stacked with folded envelope sleeves and round-brick gas cylinders. A stall is a stall because it is heaped with brick apples and a copper urn. A van is a van because a coil of rope and a wicker hamper are roped to its roof. This is how the scene stays readable with no writing anywhere in it.

⚠️ AND NAME WHAT THE FLAT SURFACES CARRY. The one surface nothing describes is the one that grows pseudo-lettering, and on a launch field that is the side of the chase trailer, the flank of the van, the gas cylinders and the crowd fence. Give each of them something real instead: a coil of rope hung on the trailer flank, a stack of wicker hampers strapped to the van side, a row of round-brick cylinders in a cradle, ivy grown up one fence post, a folded envelope sleeve draped over the rail. Every one of those surfaces is smooth unmarked brick in plain colour.

${NOUN_LAW}

${NO_TEXT_LAW}

${DELIGHT_LAW}

${BRICK_LAW}

${ASYMMETRY_LAW}

${REGISTER_LAW}

VARIETY MANDATE — one each, and every one of them still a broad flat FIELD so the fleet above it reads: a mown green plate-mosaic meadow with a dark oak hedgerow band behind · a high alpine pasture with a wall of slope-brick peaks as the band · a desert mesa floor of tan plates with a red slope-brick escarpment band · a snow-plate valley floor with a band of dark fir trees · a coastal clifftop turf with a band of trans-blue plate sea behind · a temple-ruin plain with a band of vine-covered brick stonework · a vineyard terrace with a band of trellis rows · a harvested stubble field of tan plates with a band of golden poplars · a frozen lakeshore of trans-blue plates with a band of dark forest · a city park with a band of brick skyline behind the trees · a volcanic caldera floor of dark grey plates with a band of crater rim · a river flood-meadow with a band of willows · a moorland flat of purple plant elements with a band of rounded hills · a racecourse turf with a band of white-brick rail and grandstand structure · a paddy flat of trans-blue plates and green tuft rows with a band of karst spires · an orchard clearing with a band of blossom trees · a castle water-meadow with a band of curtain wall and towers · an airfield grass strip with a band of corrugated arch hangars · a fairground field with a band of brick Ferris wheel and carousel canopy · a lavender field of purple plant elements with a band of stone farmhouse and cypress.`,
    touchpoints: [
      'A mown green plate-mosaic meadow crossing the picture from the left edge to the right edge, a dark oak hedgerow a band across the middle of the frame and both ends of the field running out of shot, a chase trailer near the left stacked with folded envelope sleeves and round-brick gas cylinders, a goat standing on its roof.',
      'A high alpine pasture crossing from edge to edge with a wall of slope-brick peaks as the band across the middle, both ends cropped, a hay wagon heaped with brick apples and a copper urn off to one side, and a cowbell hung on the near fence post with a marmot beside it.',
      'A frozen lakeshore of trans-blue plates running the full width of the frame with a band of dark fir forest across the middle and both ends out of shot, a van near the right with wicker hampers strapped up its plain flank, and one abandoned brick sledge half-buried in white plates.',
      'A temple-ruin plain of pale plates crossing the picture edge to edge, a band of vine-covered brick stonework across the middle of the frame with both ends cropped, a cradle of round-brick cylinders roped down in the near grass, and a stone idol head tipped on its side in the tuft elements.',
      'A city park of green plates crossing from one edge to the other, a band of brick skyline behind the treeline across the middle and both ends run out of frame, a cart in the near grass heaped with brick melons and a copper urn, and a kite already up on a long line.',
      'A harvested stubble field of tan plates crossing the whole width with a band of golden poplars across the middle of the frame, both ends cropped, a trailer off to one side hung with coiled rope down its smooth unmarked flank, and a scarecrow leaning right over into the near tuft elements.',
    ],
    instructions: `Each entry is ONE field, 32-46 words, a single flowing sentence, no headline prefix, no dash-separated title. Place, the crosswise shape in your own words, one or two pieces of cargo-identified furniture, and one charm detail only — no camera angle, no lighting, no time of day, no balloons, no crowd. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // CROWD — the SCALE RULER. Many small figures, height fixed against
  // something welded to the scene.
  // ════════════════════════════════════════════════════════
  brickbot_balloon_crowd: {
    format: 'simple',
    theme: `THE GROUND CROWD — the minifigure crowd on the grass, 18-30 words. Its job is structural: it is the RULER that makes the envelopes above it read as enormous, so every entry states MANY small figures and pins their height against something whose own size is fixed.

⚠️ A SIZE CUE ONLY WORKS IF THE RULER IS WELDED TO A LARGER STRUCTURE. Say the figures come barely to the basket rim, or reach the trailer's wheel hub, or stand no taller than the burner frame, or are shorter than a single gas cylinder. Never a free-floating comparison — a free-floating ruler inflates along with the thing it is measuring.

⚠️ MANY, NOT A FEW. "Two dozen spectators", "a crowd fifty deep", "a hundred figures". A low count makes each figure huge.

${ASYMMETRY_LAW}

${DELIGHT_LAW}

${NOUN_LAW}

${NO_TEXT_LAW}

${BRICK_LAW}

VARIETY MANDATE — one each: two dozen spectators packed along one side of the near grass, heads barely to the basket rim · a crowd fifty deep gathered to the left only, every figure shorter than one gas cylinder · a school party of small figures in matching caps strung out along the fence, none taller than the trailer's wheel hub · families spread over the grass on brick picnic rugs with a dog weaving between them · a marching band in red shakos massed at one corner, brick tuba above the heads · a gaggle of camera-holding figures crouched low at the near skirt, all shorter than the burner frame · ground crew in overalls scattered across the field in ones and twos, each barely to a basket rim · a queue of would-be passengers along one hedgerow, heads level with a trailer axle · a crowd with a dozen small figures riding on shoulders above it · a knot of figures round a vendor's cart heaped with brick apples, all shorter than the cart's wheel · farmers leaning on one gate in a row of flat caps with cows behind them · a crowd in winter hats with breath-plates, massed to one side only · a crowd almost entirely turned away from camera, watching the sky, hands raised · a scatter of figures flat on their backs on the grass looking straight up · a crowd holding one another's hats on in the prop-wash of a burner · children mid-chase through the legs of the crowd after a loose brick ball · a wedding party in the crowd, the whole group in white and cream · a brass-hatted mayoral figure on a brick crate above the heads · a crowd with one tall ladder in it and three figures up the rungs · a crowd of figures every one of whom is looking the wrong way.`,
    touchpoints: [
      'Two dozen spectator minifigures packed along the near grass on one side only, their heads coming barely to the basket rim above them and every figure shorter than a single gas cylinder.',
      'A school party of small minifigures in matching caps strung out along the fence, none of them taller than the chase trailer wheel hub beside them, all looking up with both C-hands raised.',
      'A crowd fifty deep massed to the left of the field, heads level with a trailer axle, and a dozen smaller figures riding on shoulders above the rest.',
      'A marching band of minifigures in red shakos bunched at one corner of the field, a brick tuba raised above the heads, every player shorter than the burner frame behind them.',
      'A scatter of minifigures lying flat on their backs on the plate-mosaic grass looking straight up, and a dog weaving between them with its lead trailing loose.',
      'A knot of minifigures round a vendor cart heaped with brick apples, all of them shorter than the cart wheel, and one child mid-chase after a loose brick ball through their legs.',
    ],
    instructions: `Each entry is ONE crowd, 18-30 words, a single flowing sentence, no headline prefix, no dash-separated title. Who they are, how many, how their height is pinned, and at most one charm detail — no camera angle, no lighting, no palette, no balloons described. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // LIGHT — time of day + direction + colour story FUSED (no separate
  // palette axis: colour here comes from the envelopes, and a palette pool
  // would contradict the rolled fleet). Every entry carries a WARM ACCENT
  // against the cool — a measured anti-monochrome lever.
  // ════════════════════════════════════════════════════════
  brickbot_balloon_light: {
    format: 'simple',
    theme: `THE FESTIVAL LIGHT — time of day, light direction, shadow behaviour and the colour story of the AIR, fused into one entry of 22-34 words.

There is no separate palette axis on this path, because the colour comes from the envelopes themselves and a palette pool would contradict whatever fleet was rolled. So this axis owns the AIR and the LIGHT, never the objects: how strong the light is, where it comes from, what it does to a translucent envelope, what the sky does, what the shadows do on the grass.

⚠️ EVERY ENTRY COMMITS TO A TIME OF DAY. Vague light is the single most reliable way to make a colourful scene look washed out.

⚠️ EVERY ENTRY ATTACHES ONE WARM ACCENT AGAINST THE PREVAILING LIGHT — a burner flame, a low sun edge, a lit envelope mouth, a warm window in the far band. Measured on another path: requiring a warm accent put one in fifteen of fifteen renders and it is the most reliable anti-monochrome lever there is. On this path the accent is free, because every balloon carries a flame.

⚠️ VIVID IS LITERAL. Saturated, committed, high-chroma. Never pastel-hazy, never washed-out, never tasteful-grey, never desaturated, never muted. A sky full of colour is the point of this path and this axis either delivers it or wrecks it.

⚠️ LIGHT AND COLOUR WORDS ONLY — no object nouns beyond the grass, the sky, the air and the envelopes as surfaces the light acts on. An entry that names a tree, a trailer, a crowd or a building is injecting a second scene.

VARIETY MANDATE — one each: low dawn sun raking in from one side, long shadows thrown right across the wet grass, the air cold blue and every envelope edge-lit gold · pre-dawn deep blue with the burners the only warm light on the whole field · high hard noon with the sun straight through the envelopes so each one glows translucent from above · late golden afternoon, warm raking side light, the grass gone amber · sunset with the whole fleet lit orange down one flank and the shadowed flanks gone violet · the blue hour with the envelopes lantern-lit from inside and the sky a deep saturated indigo · full night glow with the only light the burners, every envelope a coloured lantern · overcast soft even light with the envelope colours reading at full chroma against flat pearl-grey · a storm sky of dark slate with one shaft of sun picking out a handful of envelopes in blazing colour · after rain, clean washed light, the grass saturated green and the plates wet and mirror-bright · low mist burning off with the sun coming through it in warm bars · hard clear high-altitude light with a deep cobalt sky and razor shadows · thin winter sun low and pale with long blue shadows on white plates · dust in the air turning the light warm ochre · backlit into the sun so the envelopes are rims of fire and the crowd is a dark frieze · a rainbow band across a still-dark half of the sky with the fleet sunlit in front of it.`,
    touchpoints: [
      'Low dawn sun raking in from one side, long shadows thrown clear across the wet grass, the air a cold blue and every envelope edge-lit warm gold along one flank.',
      'Pre-dawn deep indigo over the whole field with the burners the only warm light anywhere in it, each flame throwing a short pool of orange up into its own envelope.',
      'Full night, the only light the burners, every envelope glowing from inside like a coloured paper lantern at full saturation against a black sky.',
      'A storm sky of dark slate with one shaft of low sun cutting under it and picking out a handful of envelopes in blazing high-chroma colour against the gloom.',
      'Backlit straight into a low sun so the envelopes read as rims of fire with their colour glowing through the brick, the grass in warm shadow and one flame flaring bright.',
      'Overcast soft even light with no shadow direction at all, every envelope colour reading at full chroma against flat pearl-grey sky and one burner flame the single warm note.',
    ],
    instructions: `Each entry is 22-34 words, a single flowing sentence, no headline prefix, no dash-separated title. Time of day, light direction, shadow behaviour, air and sky colour, and the one warm accent only — no objects, no camera, no weather event, no story beat. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // BUILD TECHNIQUE — THE ANTI-PHOTOREAL LEVER. Same role as
  // water_build_technique / snow_ice_build_technique on BrickBot's other
  // drift-prone paths. A balloon envelope is smooth curved fabric, which is
  // exactly what photoreal-drifts, so this axis carries the brick signal.
  // ════════════════════════════════════════════════════════
  brickbot_balloon_build: {
    format: 'simple',
    theme: `THE MOC BUILD TECHNIQUE — AFOL parts-usage that makes a hot-air balloon unmistakably LEGO, 26-40 words. This is the load-bearing anti-photoreal lever of the path: a balloon envelope is a huge smooth curved fabric surface, which is exactly what drifts to photoreal, so every entry names REAL LEGO PARTS doing the work.

Each entry names the technique for the ENVELOPE and for ONE other thing (the basket, the burner, the load tapes, the mouth, the crown, the ground, the mist, the cloud). Write it as parts a builder would recognise.

Real AFOL vocabulary to draw on: stacked rings of curved slope bricks stepping in toward the crown · a stud-out sphere with every panel bracketed outward so the curve is built from the inside · big dish elements crowning it · macaroni bricks running the gore seams · 1x2 curved slopes in alternating colour courses for the gore stripes · a plate mosaic in stepped colour bands · cheese-slope tiling for the skirt scallops · a brick-lattice basket of brown 1x2s with bar-and-clip corner uprights and a tile rim · a trans-orange flame element over a chrome cylinder and a technic-beam burner frame · taut bar-and-clip load-tape runs from crown to basket · the mouth as a ring of inverted slopes · the envelope's inflation fan as a wedge of stepped plates · turf as a green plate mosaic with moulded tuft elements · mist as trans-white plates lying low over the plates · cloud as white cloud-slope bricks · water as trans-blue plates.

${NOUN_LAW}

${NO_TEXT_LAW}

${BRICK_LAW}

⚠️ VISIBLE CONSTRUCTION IS THE POINT. Studs showing, plate seams showing, colour changes landing exactly on a brick course rather than fading, the stepping of the curve visible against the sky. A smoothly-faired envelope with no visible parts is a failed render.

VARIETY MANDATE — one each across the envelope techniques above, pairing each with a different second element so no two entries name the same pair.`,
    touchpoints: [
      'The envelope built as stacked rings of 1x2 curved slopes stepping in toward a big dish element at the crown, its gore stripes landing exactly on the brick courses, the basket a brown brick lattice with bar-and-clip uprights and a smooth tile rim.',
      'A stud-out sphere envelope with every panel bracketed outward off an internal core so the curve reads from the inside, macaroni bricks running each gore seam, and taut bar-and-clip load tapes running crown to basket.',
      'The envelope a plate mosaic in stepped colour bands with the colour change landing on a course and the stepping of the curve clearly visible against the sky, the burner a trans-orange flame element on a chrome cylinder in a technic-beam frame.',
      'Cheese-slope tiling scalloping the envelope skirt above a ring of inverted slopes at the mouth, and the turf below a green plate mosaic studded with moulded tuft elements.',
      'Concentric chevron bands built from alternating courses of curved slopes with visible stud rows between them, and trans-white plates lying low across the grass as ground mist.',
      'A crown-to-skirt gradient stepped through six brick courses with every seam showing, and white cloud-slope bricks massed behind the fleet as cloud.',
    ],
    instructions: `Each entry is 26-40 words, a single flowing sentence, no headline prefix, no dash-separated title. Named LEGO parts and techniques only — no colour story, no lighting, no camera, no story beat, no crowd. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // EVENT — 50%-gated secondary environmental beat. OBJECTS AND ANIMALS
  // ONLY (the moment axis owns the human actors), so the two can never
  // collide into two competing story beats.
  // ════════════════════════════════════════════════════════
  brickbot_balloon_event: {
    format: 'simple',
    theme: `THE FIELD EVENT — a secondary environmental beat in brick parts, 16-28 words. It amplifies the moment, never competes with it.

⚠️ OBJECTS, AIR AND ANIMALS ONLY — NO HUMAN ACTORS. The moment axis owns every human story beat; if this axis also carried a person, the render would be told to show two competing beats at once. So an event here is something the weather, the ground, an animal or a loose object does.

⚠️ RIGID-OBJECT WORDS ARE BANNED for anything made of air, smoke, light, dust or water: never column, pillar, wall, tower, bar, ribbon, disc, sheet, beam, or "shaped like". Smoke is a curling trail of white cloud-slope bricks. Dust is a scatter of tan studs. Water is a spray of trans-blue plates. Light is a glow spreading outward across a named lit surface.

${NOUN_LAW}

${NO_TEXT_LAW}

${BRICK_LAW}

${DELIGHT_LAW}

VARIETY MANDATE — one each: a gust flattening a broad fan of tuft elements across the grass and lifting a scatter of loose studs · trans-clear rain rods slanting across the field and beading along a basket rim · a flock of brick swifts scattering up through the gap between two envelopes · a runaway brick picnic hamper bouncing down the grass with red apple studs spilling ahead of it · a loose envelope sleeve ballooning up off the plates and rolling over · one envelope settling slowly into an oak with the branches bending under it · a shower of trans-pink blossom plates drifting across the whole field from an orchard row · a herd of brick cows breaking away across the far grass in a ragged spread · a trans-orange spark spitting from a burner as it catches · a kite on a long line tangling itself into a set of load tapes · a spray of trans-blue plates thrown up where a basket has clipped a pond edge · white plate-flecks sheeting up behind a basket dragging through snow plates · a brick dog streaking flat out along the grass after a trailing rope · a tarpaulin fabric element snatched up off a trailer and pinned flat against a hedgerow · a stack of round-brick gas cylinders toppling one after another across the grass · a rainbow of stacked trans-plate arcs standing against the dark half of the sky · a swarm of loose trans-clear soap bubbles drifting up through the fleet · a brick beehive knocked from a post with a scatter of yellow studs pouring out · a flock of trans-pink brick flamingos lifting off a trans-blue plate lagoon at the field edge · a brick goat up on the roof of a chase trailer with the whole thing rocking under it.`,
    touchpoints: [
      'A gust flattening a broad fan of tuft elements across the grass and lifting a loose scatter of tan studs up off the plates in a wide low arc.',
      'One envelope settling slowly into an oak, the moulded plant-element branches bending visibly under it and a shower of leaf plates coming loose below.',
      'A runaway brick picnic hamper bouncing down the grass with red apple studs spilling ahead of it and one wheel already off its axle pin.',
      'A flock of trans-pink brick flamingos lifting off a trans-blue plate lagoon at the field edge, legs still trailing and wing plates flared wide.',
      'A swarm of loose trans-clear bubble elements drifting up through the gaps between the envelopes, catching the light as they rise.',
      'A brick goat up on the roof of a chase trailer, all four hooves planted, the whole trailer rocking visibly under it.',
    ],
    instructions: `Each entry is ONE event, 16-28 words, a single flowing sentence, no headline prefix, no dash-separated title. The event and its brick-built impact only — no human figures, no camera, no lighting condition, no palette, no envelope colour. Output a NUMBERED list, one entry per line, no internal newlines.`,
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

━━━ TOUCHPOINT EXAMPLES (draw aesthetic from these — same caliber, same vocabulary register) ━━━
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
  'envelope',
  'envelopes',
  'balloon',
  'balloons',
  'nearest',
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
