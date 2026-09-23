#!/usr/bin/env node
/**
 * Generate the FaeBot `star-charting` axis pools using Sonnet.
 *
 * Own gen script (NOT recipes bolted into the 9.7k-line shared
 * gen-faebot-pool.js) so this path build never contends with another agent on
 * that file — the acorn-boat-regatta / BrickBot airfield precedent.
 * Infrastructure (signatureOf / dedupe / target-loop / numbered-list parse /
 * timestamped backup) is lifted verbatim from gen-faebot-regatta-pools.js so
 * the pool files come out byte-compatible with every other seed JSON.
 *
 * THE PATH: fae who read the night sky from a high place, and the text-free
 * pictorial instruments they read it with. FaeBot's first KNOWLEDGE register
 * and its first path where the SKY is the hero rather than the backdrop.
 *
 * THE THREE TRAPS THESE RECIPES EXIST TO DEFEAT, plus one nobody named:
 *
 *   1. A NIGHT PATH RENDERS DIM AND MUDDY. The single biggest risk. The cure
 *      is not "make it brighter" — it is the VIVID LAW in the sky pool (ONE
 *      committed dramatic event, TWO named saturated colours, never a "dark"
 *      word) paired with the WARM-LIGHT axis, which is the measured
 *      anti-monochrome lever (a warm accent against the cold put one in 15 of
 *      15 renders on PixelBot ice-cavern). Every warm-light entry names the
 *      SURFACE it warms, because light is a glow / patch / pool / streak ON a
 *      real thing (apothecary lesson).
 *
 *   2. CHARTS, INSTRUMENTS AND MAPS ARE THE HIGHEST TEXT RISK IN THE FLEET. A
 *      surface whose SHAPE is itself a text prior — a chart, a page, a dial, a
 *      scroll, a plaque — CANNOT be safely described, because writing "blank"
 *      does not subtract while naming the noun adds (playbook lesson 12). So
 *      the noun class is DELETED from every layer, and this path's bespoke
 *      replacement is stronger than the fleet's usual "one small painted
 *      picture" move — which lesson 23 measured as a signboard generator
 *      whenever its substrate is not guaranteed visible:
 *
 *        ⭐ THE POSITION-COLOUR-COUNT LAW. Every instrument on this path shows
 *        what it knows through the POSITION, the COLOUR or the COUNT of real
 *        physical objects — pins, threads, beads, pebbles, pricked holes,
 *        rings, seeds, water. Never through a picture, a symbol or a mark.
 *
 *      And per lesson 26 the anti-text form must ITSELF carry the interest: a
 *      pad of moss crowded with forty pins and the coloured threads strung
 *      between them is not a "blank board", it is the most interesting object
 *      in the frame.
 *
 *   3. "TINY" ON A HUMANOID IS A NAKED-PUTTO PRIOR. acorn-boat-regatta (same
 *      bot, same run) got 5 of 6 renders as nude wingless cherub dolls from
 *      exactly this: the nearest famous image for "tiny winged person" is a
 *      naked baby cherub, and at 1-2% of frame there is no resolution for
 *      cloth anyway. This path is the designed test of the fix that build
 *      identified and never got to run: ONE fae LARGE and NEAR, ADULT
 *      proportions stated as body plan, a real designed COSTUME, wings and
 *      ears named, and the words tiny / palm-sized / little / doll / child
 *      banned from the figure entirely.
 *
 *   4. THE TRAP NOBODY NAMED — A HIGH PLACE UNDER A BIG SKY IS THE PUREST
 *      VISTA PRIOR IN THE WHOLE FANTASY-ILLUSTRATION CANON. "Small cloaked
 *      figure on a crag under stars" is the most-trained fantasy book cover
 *      there is, and FaeBot's own shared-blocks.js header records that exact
 *      failure by name. If it fires, the fae is 1% of frame and trap 3 follows
 *      automatically. So the vantage pool is written CLOSE AND CROPPED from
 *      the start (the ToyBot concrete-but-cropped form, playbook 11/17/21
 *      applied to the PERCH): the perch's own surface fills the near frame,
 *      its rim runs out of frame, the drop below is only a BAND, the sky is
 *      open above. A panorama cannot exist in that frame.
 *
 * CROSS-AXIS DESIGN NOTE (playbook lesson 16 — a prose compatibility clause
 *   loses to a pool pick, so make it structural): the POSE pool is written
 *   VENUE-NEUTRAL and TOOL-NEUTRAL. A pose may refer only to the fae's own
 *   body, the perch's flat surface, its rim or edge, the drop beyond it, the
 *   sky, and "the work" as an unnamed thing in her hands or in front of her.
 *   Since every vantage supplies a surface + a rim + a drop + open sky by
 *   construction, every pose is valid against every vantage and every tool
 *   without needing a tag filter.
 *
 * DELIBERATE DEPARTURES FROM THE BRIEF, both recorded:
 *   • NO spider-web instrument. The brief suggested a dew-beaded web as a
 *     reading grid. FaeBot's own pools do use "spider-silk" (it is NOT a
 *     FaeBot-wide ban — that ban is documented for the CUTE bots, playbook
 *     line 4133), but a web in frame invites Flux to render the spider, and a
 *     large spider on a beauty-first fae path fails the motto. Replaced with
 *     a fae-MADE net of dew-strung grass stems, which is better storytelling
 *     anyway.
 *   • NO word "orrery", and no astrolabe / sextant / quadrant / sundial /
 *     compass / telescope / spyglass anywhere. Each of those is either a disc
 *     covered in engraved scales (maximal text prior) or a brass human-scale
 *     machine (modern-prior noun + scale disaster). The orrery survives as
 *     what it physically IS: nested carved rings hung with coloured beads.
 *
 * Usage:
 *   node scripts/gen-faebot-starchart-pools.js --pool faebot_starchart_sky_event --target 25
 *   node scripts/gen-faebot-starchart-pools.js --pool faebot_starchart_reading_tool --count 25
 *
 * Output: scripts/bots/faebot/seeds/<pool>.json
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
// SHARED LAWS — repeated verbatim into every recipe so the four traps cannot
// drift apart between pools. The pool dominates the brief, so a law that
// lives only in the template reaches Flux on a coin flip (playbook lesson 13).
// ─────────────────────────────────────────────────────────────

const DELIGHT_LAW = `⚠️ THE BAR — PLAYFUL, ADVENTUROUS, VIVID, BEAUTIFUL, CLEVER. This is DreamBot: the render exists to DELIGHT. An entry that is correct, clean and SOBER is a MISS, not a pass. Every entry must either show something a viewer has NEVER SEEN, or take the obvious version and REDRESS it as something more interesting. Ask of every entry: is this the obvious version of this idea, or the surprising one? Write the surprising one. "Fairies looking up at stars" is the obvious version and it is banned.

⚠️ ONE CHARM DETAIL PER ENTRY — one small clever thing the eye finds on second look, specific to THAT entry and no other (a moth asleep on the work with its wings still open, one bead knocked loose and rolling, a snail crossing the whole night's work, a dewdrop gone milky with cold, a beetle recruited to hold a thread down). Never a generic flourish.

⚠️ VIVID IS LITERAL — saturated committed colour, even at night. Emerald, teal, violet, magenta, indigo, gold, apricot, rose, turquoise, ember-orange. Never muted, never washed-out, never tasteful-grey, and NEVER the words dark, black, dim, gloomy, murky, shadowy, faint or pale-grey. Night here is LUMINOUS.

⚠️ ADVENTUROUS BEATS STATIC — mid-action over posed, always. Somebody is reaching, leaning, hanging, pointing, running back with something, or has just got it wrong. Comedy is welcome: these are clever people working at two in the morning up a tree.`;

const FAE_CRAFT_LAW = `⚠️ THE FAE-CRAFT LAW. This is a timeless fae world, centuries before our own. EVERY object and garment is fae-made from what the woodland gave: twig, leaf, petal, bark, acorn, nutshell, moss, lichen, grass cord, reed, seed, pine resin, beeswax, feather, down, dew, river pebble, snail shell, thorn, cork bark, fish scale, amber.

⚠️ FOR FINE STRANDS, use milkweed floss, dandelion-down, a hair-fine grass fibre, a split reed fibre or a thread of moss-cord. The words spider, spider-silk, spiderweb, cobweb, gossamer and web are set aside on THIS path: a web in frame invites Flux to render the spider, and a large spider on a beauty-first fae path fails the bar. (FaeBot's other pools do use spider-silk; this is a path-scoped choice, not a bot-wide ban.)

⚠️ THE MODERN-NOUN TEST — apply it to EVERY noun you write: what is the most famous image of this word? If that image is modern, scientific, industrial or human-scale, the word is BANNED and you recast the thing in fae-craft terms. This is not a style preference: a modern noun overrides every fae qualifier around it and Flux renders the modern thing at full human size.
  • BANNED INSTRUMENTS, no exceptions: telescope · spyglass · binoculars · microscope · observatory · planetarium · astrolabe · sextant · quadrant · armillary sphere · orrery · sundial · compass · compass rose · protractor · dividers · calipers · ruler · measuring tape · dial · gauge · clock · clockwork · brass fitting · tripod · eyepiece · pendulum · abacus · slide rule · globe on a stand · lens ground from glass · goggles · spectacles.
  • BANNED RECORD-KEEPING, no exceptions: chart · star chart · map · atlas · diagram · plan · plot · table · graph · scale (as a graduated scale) · calendar · almanac · page · book · tome · ledger · journal · notebook · scroll · parchment · vellum · slate · tablet · plaque · placard · sign · signboard · notice · poster · label · tag · nameplate · banner · pen · quill · ink · pencil · chalk · stylus · brush for writing.
  • RECAST INSTEAD, and these are the proven forms: what is known is held as the POSITION of pins and threads on a pad of moss · the HEIGHT of beads on upright grass cords · the COUNT of pebbles laid out on a stone · pinpricks of light coming through a pierced leaf · a whole sky doubled in a cupped dish of still water · nested carved rings hung with one coloured bead each, turned by hand · knots along a grass cord, one for each night.
  • NAME THE ACTION, NEVER THE OFFICE. A fae pushing a pin into the moss where a star stood — never an astronomer, a scientist, a scholar or a cartographer.`;

const NO_TEXT_LAW = `⚠️ NO READABLE TEXT ANYWHERE, AND ON THIS PATH THAT MEANS DELETING A WHOLE CLASS OF OBJECT. Flux renders lettering as gibberish and gibberish is a hard fail. A surface whose SHAPE is itself a writing surface — a chart, a page, a dial, a scroll, a plaque, a sign, a label — cannot be made safe by describing it, because calling a thing "blank" or "plain" is a negation CLIP cannot use while naming the noun puts the shape in the picture. So those objects do not exist in this world at all. There is nothing in the fae's hands that a viewer could mistake for something written on.

⭐ THE POSITION-COLOUR-COUNT LAW (the replacement, and it is load-bearing). Everything the fae know is shown by the POSITION, the COLOUR or the COUNT of real physical objects. A star is a brass pin pushed into moss, a bead threaded on a grass cord, a pebble laid on a stone, a pinprick through a leaf, a bright point doubled in water, a seed tied to a carved ring. A pattern is the SHAPE the threads make between the pins. A brightness is how TALL the pin stands or how BIG the bead is. A count is how MANY pebbles are in the row. Nothing is ever a picture of a thing, a symbol, a mark, or a shape that stands for something else.

  BANNED WORDS: text · lettering · letters · letter · word · words · writing · written · handwriting · inscription · inscribed · script · character · characters · mark · marks · marking · markings · marked · marker · markers · glyph · sigil · rune · runic · symbol · symbolic · stamped · engraved · etched · notched · scored · scratched into · notation · note · notes · annotated · number · numeral · digit · figure (meaning a numeral) · title · name · named on · naming · labelling · recording · records · panel · panels · drawn on · painted picture · painted symbol · pictogram · emblem · heraldic · crest · slate · quill.
  Also BANNED as VERBS, because the verb echoes into the render prompt as readily as the noun: to mark · to label · to name · to record · to inscribe · to note. Say SHOWS, HOLDS, STANDS AT, SITS AT, CARRIES or BELONGS TO instead.
  Every flat panel in an entry must positively CARRY something instead: a pad of moss carries its pins and threads · a stone carries its row of pebbles · a bark slab carries a hoop of bent willow lashed to it · a plain surface is furred with lichen, beaded with dew, or crowded with the work itself. A flat surface that nothing describes is the one Flux covers in pseudo-lettering, so leave none.`;

const FIGURE_LAW = `⚠️ EVERY FIGURE IS AN ADULT FAE, AND YOU MUST SAY SO — this is the hardest rule here and it has already cost this bot a whole path. An unstated small winged figure renders as a NAKED BABY CHERUB, because that is the nearest famous image, and words like "tiny" and "palm-sized" are what summon it. So:
  • ADULT PROPORTIONS, stated as BODY PLAN, never as an age word: long-limbed, slender, narrow-shouldered, a long neck, an adult's long legs, a grown face with real cheekbones and a real jaw. Roughly half the entries are women and half men, carried by the pronoun and by hair, build and face.
  • FULLY CLOTHED, in a real designed COSTUME that a costume designer made for a cold night up high — layered, tailored, built to stand out. Everyday plainness is a failed entry. Quilted moss-velvet coats, hooded capes of overlapping lichen, jerkins of soft bark and stitched leaf, long wound scarves of milkweed floss, fingerless mitts of woven down, high boots of shaped bark, collars and cuffs of owl-down, belts of plaited grass hung with the tools of the work. Colour is saturated and chosen: plum, teal, ember-orange, moss-green, cream, indigo.
  • ALWAYS: pointed ears, real hair described by colour and how it is worn, and WINGS named by their colour and texture (moth-furred, dragonfly-clear, veined like a leaf, dusted like a wing scale).
  • NEVER these words: tiny · little · palm-sized · thumb-sized · doll · doll-like · child · childlike · baby · infant · toddler · cherub · putto · chubby · plump · round-faced · bare · nude · naked · topless · unclothed · wingless.
  • SCALE is proven by ONE ruler that is welded to something larger in the same frame — the perch's own rim, a single acorn beside her, one of her own pins, a leaf she is standing on. Never an off-camera comparison like a thumbnail or a mouse: an off-camera ruler buys nothing and a free-floating one inflates instead.
  Animals in frame are ONE whole recognisable real creature each — a moth, an owl, a hedgehog, a beetle, a snail, a bat, a dormouse, a glow-worm — with real animal anatomy, never standing on two legs, never dressed, never given a human face.`;

const POSITIVE_LAW = `⚠️ POSITIVE PHRASING ONLY. Describe what IS present. The words "no", "not", "without", "never", "nothing", "lacking", "empty of" and "free of" must not appear anywhere in an entry — a negation is echoed straight into the render prompt and CLIP cannot negate it.

⚠️ ONE AXIS PER POOL. Stay strictly inside this axis. Do not describe the palette or what the light is doing unless this pool IS a light pool. Do not name a camera position, a lens, a viewer or a shot.`;

// ─────────────────────────────────────────────────────────────
// POOL RECIPES — star-charting (8 axes, all generated)
// ─────────────────────────────────────────────────────────────

const POOL_RECIPES = {
  // ════════════════════════════════════════════════════════
  // ★ SKY EVENT — THE MONEY-SHOT AXIS. Owns the whole palette
  // and is the entire defence against trap 1 (a dim, muddy
  // night render). ONE committed dramatic event per entry, TWO
  // named saturated colours, zero "dark" vocabulary.
  // ════════════════════════════════════════════════════════
  faebot_starchart_sky_event: {
    format: 'simple',
    theme: `FAEBOT STAR-CHARTING — THE SKY EVENT. Each entry is ONE dramatic thing the night sky is doing, 26-42 words. This is the money shot of the picture and it owns the entire palette: the sky must be the most COLOURFUL thing in the frame, never the darkest.

THE VIVID LAW (load-bearing, this pool exists for it). Night renders muddy unless the colour is committed, so every entry:
  (a) commits to ONE dramatic event and paints it fully — never two events hedged together,
  (b) names TWO saturated colours by name, and they must genuinely differ (emerald against violet, apricot against indigo, magenta against turquoise, rose-gold against ink-blue),
  (c) says what the sky's structure IS — curtains, a band, a river, a wall, a cone, rings, a rain of streaks, a single huge disc — so it has a readable shape rather than a wash,
  (d) uses only LUMINOUS night vocabulary. The words dark, black, dim, gloomy, murky, shadowy, faint and pale-grey are banned. Night here is a saturated deep indigo and violet that GLOWS,
  (e) uses NO real-world proper name for anything in the sky. Jupiter, Saturn, Orion, the Pleiades and every other real name drags a photographic astronomy prior into a painted fae picture. Say "a wandering star", "a bright pair", "a crowded cluster", "a group of seven",
  (f) never compares the sky to a LANDSCAPE or a SEASCAPE. "Crested like real ocean surf" renders an ocean; "like a river" and "like a road" render those too. Compare the sky only to light, cloth, dust, sparks, embers, sugar, smoke, frost or glass.

THE EVENT MENU — draw on these and invent well beyond them: a green-and-violet aurora hanging in vertical curtains that ripple · the Milky Way as a dense banded river of gold and blue-white split by its own dust lanes · a comet low over the treetops with a split tail, one arm pale green and one rose · a meteor shower with a dozen streaks crossing at once · a moon just risen, huge and apricot, with its seas showing · a moon high and small in a ring of coloured halo light · two bright planets a finger apart like a pair of lamps · one red star and one blue star side by side · a far storm walling up on one side lit from inside by lightning while the stars stay clear overhead · noctilucent cloud in electric-blue ribbons very high up · a star cluster spilled thick like sugar · the pale cone of light that stands up from where the sun went · a moon in eclipse gone deep copper · a sky so thick with stars the gaps between them are the pattern · one enormous falling star with a trail that stays · the whole sky drifting with luminous pollen so the stars have company · a wandering star that has moved since last night, caught mid-crossing between two bright ones · shells of colour around the moon through ice cloud · a long slow satellite of a firefly swarm rising to meet the real stars.

${DELIGHT_LAW}

${POSITIVE_LAW}
This pool owns the SKY ONLY. Do not describe the ground, the perch, the trees, the fae, their tools, their lamp, or any figure. Do not mention what anybody is doing about it.`,
    touchpoints: [
      'A green-and-violet aurora standing in vertical curtains right across the sky, the emerald hem rippling low enough to seem catchable and the violet running up into deep saturated indigo above, one whole fold pulsing brighter than the rest.',
      'The Milky Way overhead as a dense banded river of gold and blue-white, split lengthwise by its own dust lanes, so thick with stars that the dark lanes read as the pattern, one small rose-coloured star burning alone off to the side.',
      'A comet sitting low over the treetops with a split tail, one arm pale green and one dusty rose, both leaning back across a quarter of the sky, its head a hard bright point with a turquoise haze around it.',
      'A moon just up and enormous, apricot-orange and flattened at the bottom, its seas plainly showing, still low enough to be tangled in the highest branches, the sky around it going peach then violet then deep indigo.',
      'A far storm walled up along one side in towers of cloud lit magenta from inside by its own lightning, while directly overhead the sky stays clear indigo and crowded with gold stars, the two weathers meeting in a hard bright seam.',
      'A meteor shower at its peak, nine or ten streaks crossing the frame at once in white and green, all leaning out of one point high up, the deep violet between them crowded with steady stars.',
    ],
    instructions: `Each entry is ONE sky event in 26-42 words. MANDATORY — (a) ONE committed dramatic event, (b) TWO named saturated colours that genuinely differ, (c) the sky's readable STRUCTURE (curtains / band / wall / rings / streaks / disc / cone), (d) luminous vocabulary only, zero "dark" words, (e) one clever charm detail. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // ★ READING TOOL — THE CLEVER AXIS, and the whole answer to
  // trap 2. Every instrument shows what it knows through the
  // POSITION, COLOUR or COUNT of physical objects. Nothing here
  // is a picture, a symbol or a mark, and no object in the pool
  // has the SHAPE of a writing surface.
  // ════════════════════════════════════════════════════════
  faebot_starchart_reading_tool: {
    format: 'simple',
    theme: `FAEBOT STAR-CHARTING — THE THING THEY READ THE SKY WITH. Each entry is ONE fae-made instrument, in use, 30-46 words. This is the cleverest axis in the path and the reason the path exists: nobody has seen these objects before, because they are not the brass instruments of our world.

${NO_TEXT_LAW}

THE INSTRUMENT MENU — every one of these is pictorial, dimensional and shows what it knows as POSITION, COLOUR or COUNT. Draw on them and invent well beyond them, in the same material language:
  • a pad of deep green moss crowded with brass-bright pins, coloured threads strung taut between them so the thread pattern itself is the shape of a constellation, a fresh pin held ready in her teeth
  • upright grass cords in a row, each with one bead slid to a different height, read by crouching until they all line up with the real stars behind them
  • a broad leaf held up to the moon with holes pricked through it, the moonlight coming through as a scatter of bright points
  • a shallow cupped dish of still water set on the flat, the whole sky doubled on its surface so the stars are underfoot
  • river pebbles laid out on a mossy stone, one pebble for each star, the bigger the pebble the brighter the star
  • a cage of nested carved-wood rings, each hung with one coloured seed for a wandering star, turned by hand so the seeds swing round each other
  • a net of grass stems strung between two twigs and beaded all over with dew, held up so the drops sit over the stars and count them out
  • a hollow reed to look down that shuts out every star but one
  • a hoop of bent willow with a single seed hung on a thread at its centre, held out at arm's length as a plumb-sight
  • a grass cord knotted once for every night since the comet came, the newest knot still loose
  • glow-worms coaxed one at a time onto a black cushion of moss until they stand in the same pattern as the sky
  • a slab of soft cork bark with long thorns pushed in at different depths, tall for the bright ones
  • a sheet of clear pond ice with holes melted through it by a warmed pin, held up against the sky
  • a dewdrop held in a ring of bent grass and looked through, one star swelling huge in it
  • a spiral of snail shells laid out from the middle of a flat stone outward
  • two seeds on a single thread, slid apart until they match the gap between two stars, then carried carefully down
  • a shallow tray of fine black sand with pebbles pressed into it, the dents holding their places overnight
  • a broad pale mushroom gill-plate laid flat with luminous seeds set along the ridges
  • a fan of stiff feathers, one feather shaft for each bright star of a group, spread to match their spacing
  • a floating cork disc on the water dish with one pin upright in it, turning slowly to follow

VARIETY LAW — across the pool, the instruments must differ in HOW they work (pinning, threading, stacking, pricking, reflecting, counting, sighting through, matching a gap, holding a pattern overnight) and in MATERIAL (moss, bark, water, ice, leaf, grass cord, pebble, shell, seed, dew, living light, feather, thorn, carved wood). At most two entries in the whole pool may use pins-and-thread.

${DELIGHT_LAW}

${FAE_CRAFT_LAW}

${FIGURE_LAW}
A figure appears here only as a pair of hands and a held pose using the instrument — one line at most, because another pool owns the fae herself.

${POSITIVE_LAW}
This pool owns the INSTRUMENT ONLY. Do not describe the sky event, the perch, the lamp, the weather, the palette or the fae's clothing.`,
    touchpoints: [
      'A pad of deep moss crowded with forty brass-bright pins, coloured threads strung taut between them in a hard-edged pattern that is itself the shape of the group overhead, one thread gone slack where a pin has pulled, a fresh pin held ready between her lips.',
      'A row of eleven upright grass cords pegged into the moss, each with one polished bead slid to its own height, read by dropping her cheek to the ground until every bead sits exactly on its own star, the tallest cord bowing slightly under its bead.',
      'A broad leaf held up flat against the moon with dozens of holes pricked through it, the moonlight coming through in a scatter of hard bright points on her upturned face, one hole plugged again with a crumb of resin because it was pricked wrong.',
      'A shallow cupped dish of still water set down on the flat stone with the entire sky doubled on its surface, the stars lying underfoot, one petal drifting across the reflection and blotting out three of them at once.',
      'A cage of five nested carved-wood rings hung one inside another, each carrying a single coloured seed for a wandering star, turned by hand so the seeds swing past each other, the outermost ring mended in two places with grass cord.',
      'Glow-worms coaxed one at a time onto a black cushion of moss until they stand in the same pattern as the group overhead, two of them already wandering out of place and a third being carried back on a leaf.',
    ],
    instructions: `Each entry is ONE fae-made reading instrument in use, in 30-46 words. MANDATORY — (a) what it physically IS and what it is made of, (b) HOW it shows what it knows, as POSITION, COLOUR or COUNT of real objects, (c) it is in use right now, (d) one clever charm detail. Nothing is ever a picture, a symbol or a mark. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // VANTAGE — the high place as a STAGE, written CLOSE AND
  // CROPPED. This is the whole defence against trap 4 (the
  // vista prior). Lesson 4 also applies INSIDE a seed: every
  // entry LEADS with the perch's defining mass.
  // ════════════════════════════════════════════════════════
  faebot_starchart_vantage: {
    format: 'simple',
    theme: `FAEBOT STAR-CHARTING — THE HIGH PERCH THEY WORK FROM. Each entry is ONE high place in a great forest, 32-46 words. It is a STAGE with a floor, not a view.

⭐ THE PART-OF-SOMETHING-BIGGER LAW (rewritten after 12 measured renders — read this, it is the whole recipe). A high place under a big sky is the most over-trained composition in fantasy illustration, and stating a crop does NOT beat it: 12 renders all carried "fills the near frame, rim running out of frame both sides" in the prompt and 10 of them still came back as a wide landscape with the perch small in the middle of it. What decided every single one was WHAT KIND OF THING the perch was:

  • A perch that is a SELF-CONTAINED, DETACHABLE OBJECT whose whole outline could be drawn — a bird's nest, a seed case, a mushroom with its stalk, a boulder, a crag, a floating island — rendered as THAT OBJECT ENTIRE, seen from outside and below, with the fae shrunk to a passenger on top of it. Every one of the worst renders was one of these.
  • A perch that is PART OF A LARGER BODY and CANNOT be seen whole — a fork where a limb splits, a knot of exposed roots, a burl on a trunk, a hollow in a fallen giant's flank — rendered as a near surface with the fae large on it. The best render of the whole build was a beech fork.

  ⭐ AND THE PARENT MUST BE WOODY. Measured over 18 renders: every perch whose parent structure was ROCK — a cliff face, a boulder, a standing stone, an overhang — rendered as a LANDSCAPE, because a named cliff gives the picture permission to show the whole cliff system and a cliff system is a panorama. Every perch whose parent was a TRUNK, a LIMB, a ROOT MASS, a BANK OF ROOTS or a FALLEN TRUNK rendered as a near surface. So the parent named in every entry is WOOD: a trunk going up out of the frame, two great limbs running out of frame, a root buttress climbing out of frame, a fallen trunk running out of frame both ways, leaves closing over one side. Stone may appear only as a SMALL THING ON the perch — a pebble, a flat step, a chip of quartz in the moss — and is never the parent.

So every entry must obey all four of these:
  (a) OPEN with the perch's defining mass and material, and say its own surface FILLS THE NEAR PART OF THE PICTURE,
  (b) NAME THE PARENT STRUCTURE IT BELONGS TO, and say that parent RISES OUT OF THE FRAME — the trunk going up out of the top, the cliff face running out of one side, the bank climbing out of frame, the fallen trunk running out of frame both ways. The perch is a feature of something too big to fit,
  (c) describe the surface's TEXTURE at hand's reach, in detail nobody could see from across a valley — gill-ridges you could count, lichen in rosettes the size of a fingernail, bark furrows deep enough to put a hand into, grit and dropped needles, frost crusting one edge, a rain-pool in a hollow,
  (d) the drop beyond it is ONE THIN BAND along a border, and open sky above.

  BANNED, because every one renders the whole object or a landscape: vista · panorama · sweeping view · overlook · valley below · receding ridgelines · layered hills · the world spread out below · miles of forest · horizon line across the middle · aerial · bird's-eye · a free-standing nest · a seed case seen whole · a mushroom with its stalk showing · a boulder seen whole · a crag seen from across anything · a floating island · a pinnacle · a spire of rock · a cliff · a cliff face · a cliff ledge · a rock overhang · a standing stone · a canted slab · a cleft between boulders · a chalk face · ANY perch whose parent structure is stone.

THE PERCH MENU — every one of these is part of something bigger. Draw on them and invent well beyond them, in the same register: a wide fork where an oak limb splits, the trunk going up out of frame · a knot of high roots where the bank has washed out from under them · a horizontal bough with a saddle of moss on it and the canopy closing over one side · a broad burl swelling out of a trunk · the crotch where three great branches meet · the split in a lightning-opened trunk with its walls standing either side · a mossy step in a root buttress · a landing on a stair of exposed roots · a shelf of loose bark on a dead standing pine · a hollow in the flank of a fallen giant, the trunk running out of frame both ways · a wide branch-junction deep inside the canopy · a natural arch of root with one end out of frame · a long burl running along a beech trunk like a bench · the broad top of a mushroom cap seen ONLY as its own surface underfoot, the stalk out of frame below and the cap running out of frame on three sides · a bracket fungus with the trunk filling one whole side of the picture and rising out of the top.

${DELIGHT_LAW}

${FAE_CRAFT_LAW}
If any fae-made thing appears on the perch it is small and fixed in place: a peg driven into a crack, a loop of grass cord tied to a stem as a handhold, a little wind-break of propped bark, three flat stones set as a step, a bundle of spare twigs lashed to a branch.

${NO_TEXT_LAW}

${POSITIVE_LAW}
This pool owns the PERCH ONLY. Do not describe the sky event, the light, the palette, the weather, the fae, their instruments or their lamp.`,
    touchpoints: [
      'A wide grey fork where an oak limb splits fills the near picture, the great trunk going up out of the top of the frame behind it, bark furrows deep enough to put a hand into and a saddle of moss worn flat in the middle, both branches running out of frame left and right, one thin band of misted treetops far below.',
      'A shelf of loose bark lifting away from a dead standing pine, the silver trunk filling the right side of the picture and rising out of the top, the bark shelf underfoot crusted with lichen rosettes and dropped needles and holding one rain-pool in a hollow, a thin band of black fir tops far below.',
      'A knot of high roots where the bank has washed out from under them, the bank climbing out of frame behind, the roots woven into a floor of arm-thick coils packed with grit and old leaves, a loop of grass cord tied to one root as a handhold at the lip, one thin band of canopy below.',
      'A hollow worn in the flank of a fallen giant, the trunk running out of frame both ways so only this stretch of it shows, the wood inside soft and fibrous and furred with emerald moss, frost crusting the lower rim, a thin band of ferns far below.',
      'The broad top of a mushroom cap seen as its own surface underfoot, the cap running out of frame on three sides with the stalk out of sight below it, the skin faintly ribbed and beaded with cold dew and one gill-ridge showing at the cropped edge, a thin band of treetops beyond.',
      "A broad burl swelling out of a trunk like a step, the trunk filling the left side of the picture and rising out of the top, the burl's top a whorl of knotted grain polished smooth from use, three flat stones set as a step onto it, a thin band of moonlit leaves below.",
    ],
    instructions: `Each entry is ONE high perch in 32-46 words. MANDATORY — (a) OPEN with the perch's defining mass and material and say its surface fills the near part of the picture, (b) NAME THE PARENT STRUCTURE and say it rises out of the frame, (c) the surface texture described at hand's reach, (d) the drop below as ONE thin band, open sky above, (e) one clever charm detail. The parent structure is always WOOD — a trunk, a limb, a root mass, a bank of roots, a fallen trunk — never stone. Zero panorama words, and never a perch whose whole outline could be drawn. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // ASTRONOMER — the ONE fae who is LARGE and NEAR. The whole
  // defence against trap 3. Appearance + costume only; the POSE
  // is a separate axis so an action entry can never dictate a
  // garment (the SteamBot captain-coat lock).
  // ════════════════════════════════════════════════════════
  faebot_starchart_astronomer: {
    format: 'simple',
    theme: `FAEBOT STAR-CHARTING — THE ONE FAE PAINTED LARGE AND NEAR. Each entry is ONE adult fae, described as appearance and COSTUME only, 34-50 words. This figure is painted big in the foreground at full detail, so every word of cloth and hair and face actually renders.

${FIGURE_LAW}

COSTUME LAW (this is the axis where the costume designer earns the fee). It is a cold clear night high up in a forest, which is the best possible excuse for real wardrobe. Every entry dresses its fae in a LAYERED, TAILORED, INVENTED outfit built to stand out — an outer layer, something at the throat, something on the hands or feet, and one thing hung at the belt or over the shoulder that belongs to the work. Materials: quilted moss-velvet, overlapping lichen scales, soft stitched bark, felted down, woven grass, spun milkweed floss, oiled leaf-cloth, moth-wing panels, owl-down trim, fish-scale sequins, beetle-shell buttons, plaited-grass cord, amber toggles. Colour is saturated and deliberately chosen: plum, teal, ember-orange, moss-green, indigo, cream, rust, gold. Everyday plainness is a FAILED entry.

VARIETY LAW — across the pool vary: build (rangy, compact, broad-shouldered, willowy), hair (colour, and how it is worn for working at night — pinned up out of the way, braided down, cropped, wound in a cloth, tied back with a cord), face (cheekbones, jaw, brows, a long nose, a wide mouth, laugh-lines), wing type (moth-furred, dragonfly-clear, leaf-veined, scale-dusted, narrow and swift, broad and soft) and silhouette of the outfit (long coat, short jerkin, hooded cape, wrapped shawl, sleeveless over layers). Roughly half women, half men. Skin tones range across the fae's own natural palette — warm umber, birch-pale, russet, olive-fair, deep bronze, ash-fair — described as tone only, never by any real-world nationality.

${DELIGHT_LAW}

${FAE_CRAFT_LAW}

${NO_TEXT_LAW}
Nothing on the costume carries a picture or a symbol: a garment is made interesting by its CUT, its LAYERS, its COLOUR, its trim and its texture.

${POSITIVE_LAW}
This pool owns the FAE'S APPEARANCE AND COSTUME ONLY. Do not describe what she is doing, her pose, her instrument, the perch, the sky, the light or the palette of the scene.`,
    touchpoints: [
      'A rangy grown fae with a long jaw and heavy dark brows, ash-blond hair cropped short and pushed back off his forehead, pointed ears, moth-furred wings in soft grey and cream folded high behind him, in a quilted moss-velvet coat the colour of plum with a deep collar of owl-down and fingerless mitts of felted grey down, a coil of grass cord at his belt.',
      'A willowy grown fae, long-necked and narrow-shouldered with high cheekbones and a wide mouth, warm umber skin, copper hair braided tight down her back and wound with cord, pointed ears, dragonfly-clear wings shot with teal, wearing a sleeveless ember-orange jerkin of soft stitched bark over a long cream underlayer, high boots of shaped bark, a soft pouch of pins slung across her chest.',
      'A compact grown fae with a broad flat nose and deep laugh-lines, birch-pale skin, russet hair wound up in a teal cloth to keep it out of the way, pointed ears, leaf-veined wings in rust and gold, in a hooded cape of overlapping lichen scales over an indigo tunic, plaited-grass belt, a spare hoop of bent willow worn over one shoulder.',
      'A broad-shouldered grown fae with a strong straight nose and a short beard, deep bronze skin, black hair tied back with a grass cord, pointed ears, scale-dusted wings in bronze and green, wearing a long oiled leaf-cloth coat over a quilted gold gilet fastened with amber toggles, sleeves pushed up past the elbow, a flat stone hung at his hip on a thong.',
      'A tall grown fae with a fine-boned face and a small chin, olive-fair skin, silver-white hair pinned up in a loose knot with three thorns, pointed ears, narrow swift wings clear as glass with plum-dark veins, in a wrapped shawl-coat of spun milkweed floss over a teal bodice stitched with fish-scale sequins, footless leggings of woven grass.',
      'A slight grown fae with a long nose and steady grey eyes, ash-fair skin, mousy hair cut bluntly at the jaw and tucked behind her ears, pointed ears, broad soft wings furred like a moth in cream and rust, in a short double-breasted jerkin of stitched bark dyed deep teal with beetle-shell buttons, a long rust scarf wound twice at the throat, down-lined cuffs.',
    ],
    instructions: `Each entry is ONE adult fae in 34-50 words, appearance and costume only. MANDATORY — (a) adult body plan stated physically, (b) face, (c) hair colour and how it is worn, (d) pointed ears, (e) wings by colour and texture, (f) a layered tailored invented costume in saturated named colours with one thing of the work at the belt or shoulder, (g) one ruler welded to something in frame OR omit the ruler entirely rather than use an off-camera one. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // SIGHTING POSE — the PLAYFUL axis. Written VENUE-NEUTRAL and
  // TOOL-NEUTRAL on purpose so every pose is compatible with
  // every vantage and every instrument without a tag filter
  // (playbook lesson 16: a prose compatibility clause loses to
  // a pool pick, so make it structural).
  // ════════════════════════════════════════════════════════
  faebot_starchart_sighting_pose: {
    format: 'simple',
    theme: `FAEBOT STAR-CHARTING — WHAT HER BODY IS DOING RIGHT NOW. Each entry is ONE pose, mid-action, 18-32 words. This is the PLAYFUL axis: it is what stops the picture being a person standing and looking up, which is the dullest version of this idea and is banned.

⭐ THE NEUTRALITY LAW (load-bearing — it is what makes every pose fit every scene). A pose may refer ONLY to: the fae's own body and limbs, the perch's flat surface, the perch's rim or edge, the drop beyond it, the sky, and "the work" as an unnamed thing in her hands or set down in front of her. It must NEVER name a specific instrument, a material, a place, water, a branch, a mushroom, a rock, a garment, a light, or another figure — those all belong to other axes, and naming one here would contradict whatever those axes rolled.

THE POSE MENU — draw on these and invent well beyond them: flat on her back on the surface with one arm straight up, sighting along a held twig · hanging upside down by the knees from the rim to get the line she wants · crouched with her cheek almost on the surface and one eye shut · leaning right out over the drop, one hand gripping the edge · balanced on one foot at the very rim with both arms out · sitting cross-legged with her chin on her fists, plainly stuck · asleep face-down across the work with one hand still on it · up on tiptoe with both arms reaching straight overhead · flat on her stomach with her chin on her hands and her feet in the air behind her · walking slowly backwards with one eye fixed straight up · spun half round mid-step and pointing hard at something new · curled on her side with one eye close to the work · both hands cupped round one eye to shut everything else out · stretched full length along the edge with her head out over nothing · sitting bolt upright with her mouth open, caught by something that has just happened · arms folded, glaring straight up at one spot · half risen on her knees with one hand up for quiet · lying with her feet up and her head hanging right back off the edge, looking straight up · kneeling and reaching far out across the work with her whole weight on one hand · squatting with her arms wrapped round her knees and her head tipped all the way back · one knee up on the rim mid-climb, still looking up instead of where she is going · sprawled on her back laughing with both arms flung wide · pressed flat with only her head and one hand up over the rim.

${DELIGHT_LAW}
For this pool specifically: the body must be doing something a viewer can read instantly and would not have thought of. A figure simply standing and gazing upward is a FAILED entry. Comedy, effort, awkwardness and total absorption are all welcome.

${POSITIVE_LAW}
This pool owns the BODY ONLY.`,
    touchpoints: [
      'Flat on her back on the surface with one arm straight up and one eye shut, sighting along a held twig, the other hand groping blindly sideways for the work.',
      'Hanging upside down by the knees from the rim, arms dangling, hair hanging straight down, head tipped back to get exactly the line she wants.',
      'Leaning right out over the drop with one hand clamped on the edge and her whole body counterweighted back, head craned round and up.',
      'Asleep face-down across the work with one hand still resting on it, one wing folded and the other still half open, entirely out.',
      'Spun half round mid-step with her weight on one heel, pointing hard straight up with a whole arm, mouth open mid-shout.',
      'Sitting cross-legged with her chin on both fists and her brows down, staring at the work, plainly and completely stuck.',
    ],
    instructions: `Each entry is ONE mid-action pose in 18-32 words. MANDATORY — (a) body and limbs only, (b) refers to nothing but her own body, the surface, the rim, the drop, the sky and "the work", (c) instantly readable and not the obvious version, (d) mid-action, never posed. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // WARM LIGHT — the practical light, and the measured
  // anti-monochrome lever (a warm accent against a cold scene
  // landed 15/15 on PixelBot ice-cavern). The conceit that
  // makes it CLEVER: astronomers protect their night sight, so
  // the light is always hooded, shaded, turned low, set behind
  // or gone red.
  // ════════════════════════════════════════════════════════
  faebot_starchart_warm_light: {
    format: 'simple',
    theme: `FAEBOT STAR-CHARTING — THE ONE WARM LITTLE LIGHT. Each entry is ONE small fae-made working light and the surface it warms, 22-36 words. Its job in the picture is to be the ONE warm thing against a cold saturated sky, which is the whole difference between a luminous night render and a muddy one.

THE SHIELDED-LIGHT LAW (and it is the clever bit). Anyone who reads the sky guards their night sight, so this light is never a blazing lantern held high. It is always hooded, shaded, turned down, set low, set BEHIND the work, dipped in a cup, filtered through something red, or carried in a cupped hand. Say HOW it is being kept out of her eyes: a leaf bent over it as a hood, a curl of bark propped in front of it, set down behind her so only the rim of a wing catches it, sunk into a hollow in the surface, a lid slid half across, wrapped in a rose petal so it comes out red, held under a cupped palm so only the fingers glow.

THE NAMED-SURFACE LAW — light is a glow, a patch, a pool, a streak, a rim or a dapple ON a real thing, never a free-floating mood. Every entry must name exactly what the light lands on and what colour it makes it: a shoulder and the side of a jaw, the edge of a wing, the near rim of the surface, a row of upright cords, wet moss going gold, a dish of water, one cheek and the underside of a chin, cold fingers, a heap of spare twigs.

THE LIGHT MENU — draw on these and invent well beyond them: a firefly shut in a walnut shell with a leaf bent over it · a fat glow-worm on a twig laid down in a hollow · a stub of beeswax in a curl of bark propped as a shield · a bracket fungus on the trunk behind her glowing honey-warm on its own · a little pot of ember-moss with its lid slid half across · a hollowed rose-hip with a wick, so the light comes out red · a hot stone lifted from a fire and wrapped in leaves, glowing at its seams · a handful of luminous seeds in a cupped palm · a bead of amber warmed until it shines from inside · a candle in a snail shell set down in a crack · three glow-worms in a folded leaf packet held under her chin · a dish of oil burning a single low flame sunk into a rain-pool hollow · an ember carried in a nutshell and blown on.

${DELIGHT_LAW}

${FAE_CRAFT_LAW}

${NO_TEXT_LAW}

${POSITIVE_LAW}
This pool owns the WARM WORKING LIGHT ONLY. Do not describe the sky, the moon, the stars, the perch's shape, the fae's costume, her pose or her instrument beyond the one surface the light lands on.`,
    touchpoints: [
      'A firefly shut in a walnut shell with a broad leaf bent over it as a hood, set down low behind the work so it throws a warm apricot rim along one shoulder and the near edge of the surface and leaves her eyes to the sky.',
      'A stub of beeswax burning in a curl of birch bark propped up as a shield, the flame kept on the far side of it so only a narrow gold stripe falls across the wet moss and the backs of her fingers.',
      'A hollowed rose-hip with a floss wick, its light coming out through the red skin so everything close to it goes ember-orange — one cheek, the underside of her chin, and the fine hairs along a folded wing.',
      'A bracket fungus on the trunk behind her glowing honey-warm all by itself, putting a soft gold edge down the whole length of her back and one wing and leaving the front of her cool.',
      'A little clay pot of ember-moss with its lid slid half across, sunk into a hollow in the surface so the glow comes up from below and lights the row of upright cords from underneath in warm orange.',
      'A handful of luminous seeds held in a cupped palm with the fingers closed over them, so only the gaps between her fingers leak gold and her knuckles glow pink from the inside.',
    ],
    instructions: `Each entry is ONE small warm working light in 22-36 words. MANDATORY — (a) what the light physically IS, in fae-craft material, (b) HOW it is hooded, shaded, lowered, reddened or set behind so it spares her night sight, (c) the exact SURFACE it lands on and the warm colour it makes it, (d) one clever charm detail. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // COMPANY — (0.6 gate) the other fae, smaller and further
  // back. This is where the comedy lives. The near fae stays
  // the hero, so these are explicitly smaller and behind.
  // ════════════════════════════════════════════════════════
  faebot_starchart_company: {
    format: 'simple',
    theme: `FAEBOT STAR-CHARTING — THE OTHERS, SMALLER AND FURTHER BACK. Each entry is ONE small group or one companion beyond the near fae, 24-40 words. The near fae stays the hero of the picture, so everything here is SMALLER and set BEHIND or further along.

THE HERO-PROTECTION LAW — every entry states that these are smaller and further off than the near fae: further along the same surface, back at the rim, out on the branch behind, down the slope, already on the next perch, coming up from below. Two or three of them at most, or one animal. They must be doing something the eye reads as a second little story inside the picture.

${DELIGHT_LAW}
For this pool specifically, COMEDY IS THE POINT and it is what will make a viewer smile at the second thing they notice. Draw on these and invent well beyond them: a whole line of them along the rim with all their work put down, just watching the sky · one fast asleep in a heap with a thread still wound round a finger · a moth the size of a dog landed squarely on the work while everybody waits politely for it to leave · two of them arguing across a pad, both pointing at different stars · one halfway up a stem with a pin held in her teeth · one flat on the moss having plainly given up · one running back in with a fresh dewdrop cupped in both hands, going carefully · one counting on her fingers and losing count · two holding a third by the ankles so she can reach out over the drop · one wrapped in a blanket with only a nose showing, still working · an owl on a branch above watching them all with total contempt · a hedgehog asleep against the pad being used as a windbreak · one who has climbed higher than everyone else purely to be higher · two sharing a hot drink out of one acorn cup and not looking at the sky at all · one trying to get a beetle to stay still and hold a thread down · a small crowd all turned the wrong way, looking at something behind them.

${FIGURE_LAW}
These figures are further off, so their faces stay readable but simple, while their clothes, ears and wings still read clearly — layered fae-craft cloth in saturated colour, pointed ears, wings visible.

${FAE_CRAFT_LAW}

${NO_TEXT_LAW}

${POSITIVE_LAW}
This pool owns THE OTHER FIGURES ONLY. Do not describe the sky, the light, the palette, the perch's shape or the near fae herself.`,
    touchpoints: [
      'Further along the same surface, a whole line of them sitting in a row along the rim with every scrap of their work put down beside them, all heads tipped back at once, one still holding a pin she has forgotten about.',
      'Back at the rim, two of them arguing hard across a moss pad, each pointing up at a different star with a whole arm, while a third sits between them with her chin in her hands waiting for it to end.',
      'Out on the branch behind, a moth the size of a dog has landed squarely across their work and folded its wings, and three of them stand a polite distance off with their arms folded, waiting for it to be finished.',
      'Down the slope a little, one of them fast asleep in a heap of quilted plum cloth with a coloured thread still wound twice round one finger, and another crouched over her deciding whether to wake her.',
      'Two of them further back holding a third by both ankles so she can lean right out past the rim with both arms free, all three of them talking at once, the middle one not really holding on.',
      'On the next perch across, one who has climbed higher than anybody needed to, standing on the very top of it with her hands on her hips, entirely pleased with herself, her teal cape blowing sideways.',
    ],
    instructions: `Each entry is ONE small group or companion in 24-40 words. MANDATORY — (a) stated as smaller and further off than the near fae, (b) two or three figures at most, or one whole animal, (c) a second little story the eye reads on second look, (d) their clothes, ears and wings named. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // AIR — axis-clean atmosphere. Short entries: it sits last in
  // the output order and the regatta measured last-position
  // items rendering rarely, so nothing load-bearing lives here.
  // ════════════════════════════════════════════════════════
  faebot_starchart_air: {
    format: 'simple',
    theme: `FAEBOT STAR-CHARTING — WHAT THE NIGHT AIR IS DOING. Each entry is ONE short observation about the air itself, 12-24 words. Nothing else.

THE MENU — draw on these and invent well beyond them: mist lying in the hollow far below like spilled milk · air so still that a thread of smoke stands straight up · one cold gust combing all the moss flat at once · frost beginning to crust the rim in little needles · luminous pollen drifting slowly upward through the whole frame · a slow fall of birch seeds turning as they go · a column of midges dancing in one place · one big moth crossing at speed · dew beading so heavily that everything is sequinned · a fine rain of ash-light drifting from nowhere · breath showing in the cold · the air so clear it seems to have been washed · a single feather coming down end over end · thistledown going past sideways in a hurry · the smoke of a wick bending flat and then standing up again · a faint warm updraught coming off the trunk.

${DELIGHT_LAW}
One clever charm detail even in twelve words.

${POSITIVE_LAW}
This pool owns THE AIR ONLY. Do not describe the sky event, the stars, the moon, the light, the perch, the fae or any object.`,
    touchpoints: [
      'Air so still that a thread of smoke stands straight up for a foot before it loses its nerve and spreads.',
      'Mist lying far below in the hollow like spilled milk, with the tops of the tallest firs standing up out of it.',
      'Luminous pollen drifting slowly upward through the whole picture, going the wrong way, unhurried.',
      'Frost beginning at the rim in little upright needles, spreading inward a hair at a time.',
      'One cold gust combing every stem of moss flat at once and then letting it all spring back up.',
      'Dew beading so heavily on everything that the whole surface is sequinned and the work has to be blotted.',
    ],
    instructions: `Each entry is ONE short observation about the night air in 12-24 words, with one clever detail. Nothing but the air. Output a NUMBERED list, one entry per line, no internal newlines.`,
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
  'still',
  'against',
  'picture',
  'frame',
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
  const outPath = path.resolve(`scripts/bots/faebot/seeds/${POOL}.json`);
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
