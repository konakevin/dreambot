#!/usr/bin/env node
/**
 * Generate the FaeBot `acorn-boat-regatta` axis pools using Sonnet.
 *
 * Own gen script (NOT recipes bolted into the 9.7k-line shared
 * gen-faebot-pool.js) so this path build never contends with another agent on
 * that file — the BrickBot airfield-biplanes precedent. Infrastructure
 * (signatureOf / dedupe / target-loop / numbered-list parse / timestamped
 * backup) mirrors gen-brickbot-airfield-pools.js verbatim so the pool files
 * come out byte-compatible with every other seed JSON.
 *
 * THE PATH: a boat RACE down a woodland stream, run by palm-sized fae in tiny
 * craft they made out of found things — an acorn-cap hull, a walnut shell with
 * a leaf sail, a curl of birch bark, a folded-leaf punt, a petal coracle.
 * FaeBot's first ACTION path and its first path staged ON water.
 *
 * FIVE hard traps these recipes exist to defeat (all playbook-documented):
 *   1. THE MODERN-PRIOR NOUN TRAP (fairy-swarm, the big one). An event noun
 *      whose most famous image is modern or human-scale BEATS every fae
 *      qualifier around it — "wedding" rendered a full-size modern bride.
 *      "Regatta", "trophy", "finish line", "flag", "buoy", "crew", "captain",
 *      "umpire" and "scoreboard" are all that noun. So: the word regatta never
 *      appears in a seed, every office is named by its ACTION instead of its
 *      TITLE (a frog keeping the count, never an umpire), and every object,
 *      garment and ceremony is fae-made of found natural material.
 *   2. THE SINGLE-HERO COLLAPSE. fairy-swarm's fix is three layers and all
 *      three are here: (a) the race_moment seeds OPEN with an active verb
 *      naming ONE shared event plus 2-3 sub-actions on DIFFERENT boats,
 *      (b) the template's first rule is a composition lock, (c) a PLURAL
 *      promptPrefixByPath anchor. The fleet axis names 4-6 hulls per entry so
 *      the plural is in the pool, not only in the template.
 *   3. HUMAN-SCALE COLLAPSE. "Boats on a stream" with no scale anchor renders
 *      full-size rowing boats. Every fleet / course / stream entry therefore
 *      carries a NATURAL-OBJECT scale prover: a drifting oak leaf as wide as
 *      three boats, one river pebble standing over the fleet like a boulder,
 *      a bulrush taller than any mast.
 *   4. READABLE TEXT (playbook lesson 13: a surface named in a SEED is clean;
 *      named only in the template it is a coin flip). Sails, hulls and any
 *      hung banner are the strongest text magnets on this path, so each one is
 *      given a PICTURE in the seed itself — a leaf's own veins, a moth-wing
 *      eyespot, one small painted crescent — never "blank" (calling a thing
 *      blank is a negation CLIP cannot use).
 *   5. UNSTATED FIGURES (lesson 14). A race is a human-activity prior, so
 *      every axis that can carry a figure says what the figure IS: a slender
 *      palm-sized fae in petal-silk and leaf-cloth with a full beautiful face,
 *      real eyes, real hair, pointed ears and visible wings (the KODAMA law).
 *
 * Usage:
 *   node scripts/gen-faebot-regatta-pools.js --pool faebot_regatta_race_moment --target 25
 *   node scripts/gen-faebot-regatta-pools.js --pool faebot_regatta_boat_fleet --count 25
 *
 * Output: scripts/bots/faebot/seeds/<pool>.json
 *
 * NOTE: the path's VANTAGE axis is deliberately NOT here — a path whose
 * identity is motion across water must hand-author its own camera positions
 * (ToyBot snow-globe lesson), and they live inline in
 * scripts/bots/faebot/paths/acorn-boat-regatta.js so they can be audited as a
 * SET. One axial "straight down the channel" entry is a hard-fail generator
 * (the BrickBot SYMMETRY LAW).
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
// SHARED LAWS — repeated verbatim into every recipe so the five traps above
// cannot drift apart between pools. The pool dominates the brief, so a law
// that lives only in the template reaches Flux on a coin flip (lesson 13).
// ─────────────────────────────────────────────────────────────

const DELIGHT_LAW = `⚠️ THE BAR — PLAYFUL, ADVENTUROUS, VIVID, BEAUTIFUL, CLEVER. This is DreamBot: the render exists to DELIGHT. An entry that is correct, clean and SOBER is a MISS, not a pass. Every entry must either show something a viewer has NEVER SEEN, or take the obvious version and REDRESS it as something more interesting. Ask of every entry: is this the obvious version of this idea, or the surprising one? Write the surprising one.

⚠️ ONE CHARM DETAIL PER ENTRY — one small clever thing the eye finds on second look, specific to THAT entry and no other (a snail keeping pace along the bank and winning, a boot-shaped seed-pod bailed out with an acorn cap, a mouse towed in a walnut shell as ballast, a beetle stowed away under a thwart, a dandelion seed used as a spare sail). Never a generic flourish.

⚠️ VIVID IS LITERAL — saturated committed colour. Petal sails in scarlet, plum, marigold, cream; hulls in copper, moss-green, berry-red; light hitting water hard. Never muted, never washed-out, never tasteful-grey.

⚠️ ADVENTUROUS BEATS STATIC — mid-race over posed-and-pretty, always. Speed, spray, a hull tipping, a gust snatching a sail, a near-miss at a rock. A single boat sitting prettily on flat water is a FAILED entry. Comedy is welcome: this is a race, and racers are ridiculous.`;

const FAE_CRAFT_LAW = `⚠️ THE FAE-CRAFT LAW (the single most important rule here). This is a timeless fae world, centuries before our own. EVERY object, garment and ceremony is fae-made from what the woodland gave: acorn caps, walnut and hazelnut shells, birch bark, folded leaves, flower petals, reeds, grass cord, pine resin, twig, moss, dew, seed-pods, feathers, snail shells.

⚠️ THE MODERN-NOUN TEST — apply it to EVERY noun you write: what is the most famous image of this word? If that image is modern, sporting or human-scale, the word is BANNED and you recast the thing in fae-craft terms. This is not a style preference: a modern event-noun overrides every fairy qualifier around it and Flux renders the modern thing at full human size.
  • BANNED, no exceptions: regatta · yacht · sailboat · dinghy · kayak · canoe hull of moulded plastic · motorboat · trophy · cup (as a prize) · medal · podium · finish line · flag · checkered · chequered · buoy · lane · lane marker · starting pistol · whistle · stopwatch · clock · megaphone · scoreboard · score · points · number · numeral · jersey · life jacket · captain · skipper · cox · coxswain · crew (as a noun) · commodore · umpire · referee · judge · marshal · official · grandstand · bleachers · club · championship · trials · heat sheet · bunting with writing · sponsor · logo · dock · marina · pier of sawn planks · rope of nylon · canvas of sailcloth.
  • RECAST INSTEAD, and these are the proven forms: the prize is a woven clover wreath or a polished river pebble carried home · the start is two bulrush stems leaning in over the water · the gates are arches of bent twig pegged into the bed · the run's end is a strand of dandelion-down or a garland of linked clover strung between two reeds · the turn is marked by a tethered rowanberry bobbing on a grass line · the count is kept by pebbles moved one at a time along a twig · the start is called by one thump on an acorn-cap drum or a struck dewdrop chime.
  • NAME THE ACTION, NEVER THE OFFICE. A fat frog sitting steady on a lily pad watching the turn — never an umpire. A heron standing over the far bend — never an official. A fae leaning far out with a pebble in each hand to count the boats through — never a judge.

⚠️ NEVER WRITE THESE WORDS: spider, spider-silk, spiderweb, cobweb, gossamer. A hard FaeBot ban. When you need a fine strand, use dandelion-down, milkweed floss, a thread of grass, a split reed fibre, a hair-thin root, a strand of moss-cord.`;

const SCALE_LAW = `⚠️ THE SCALE LAW — this is a REAL woodland stream seen at FAE scale, and if you do not prove it the picture renders as full-size human rowing boats. Each entry must carry ONE concrete NATURAL-OBJECT scale prover, worked into the description rather than stated as a fact: a fallen oak leaf drifting past as wide as three boats · one river pebble standing over the fleet like a grey boulder · a single bulrush rising taller than any mast · a strand of watercress crossing the channel like a low bridge · a mayfly the size of a rowing fae · one acorn cup shipping enough water to swamp a hull · a fern frond overhanging the whole field like a roof. The boat IS the shell, the cap, the curl of bark or the folded leaf — never a shrunken copy of a real boat.`;

const NO_TEXT_LAW = `⚠️ NO READABLE TEXT ANYWHERE — Flux renders lettering as gibberish and gibberish is a hard fail. On this path the text magnets are SAILS, HULL SIDES and anything HUNG ACROSS THE WATER, so each of those gets a PICTURE of its own in the entry rather than being called blank (calling a thing blank is a negation, which CLIP cannot use):
  • a sail is a whole leaf showing its own veins · a flower petal with its natural streak of darker colour · a shed moth wing with its eyespot · a fan of birch bark with its own dark lenticel dashes · a broad petal with one small painted crescent, dot, spiral or sprig on it and nothing else.
  • a hull side is smooth shell, plain bark or plain waxed leaf carrying at most one painted band of colour, one painted dot, or one tied sprig of dried flower under a grass lashing.
  • anything strung over the water is a natural thing, not a written one: linked clover heads, hung leaf triangles, threaded berries, a strand of dandelion-down, a plait of grass.
  BANNED WORDS: text, lettering, letters, word, words, writing, written, handwriting, inscription, inscribed, script, character, characters, mark, marks, marking, markings, glyph, sigil, rune, runic, stamped, engraved, etched, embroidered name, plaque, placard, sign, signboard, notice, poster, banner slogan, label, tag with writing, name, nameplate, chart, map, page, book, ledger, number, numeral, digit.`;

const FIGURE_LAW = `⚠️ EVERY FIGURE IS FAE, AND YOU MUST SAY SO. An unstated figure renders as the genre's default, which here is a modern human. So wherever a figure appears in your entry it is a SLENDER PALM-SIZED FAE with a full beautiful face, real eyes, real hair, pointed ears, visible insect-thin wings, and covering fae-craft garments of petal-silk, leaf-cloth, woven grass or moss-velvet. Never bald, never round-white-headed, never dot-eyed, never faceless, never a body fused into bark, never a bare chest. Animals in frame are ONE whole recognisable real creature each — a frog, a newt, a dragonfly, a water-vole, a kingfisher, a snail, a duckling — with real animal anatomy, never standing on two legs, never dressed, never given a human face.`;

const POSITIVE_LAW = `⚠️ POSITIVE PHRASING ONLY. Describe what IS present. The words "no", "not", "without", "never", "empty of" and "free of" must not appear anywhere in an entry — a negation is echoed straight into the render prompt and CLIP cannot negate it.

⚠️ ONE AXIS PER POOL. Stay strictly inside this axis. Do not describe the time of day, the weather, the palette or what the light is doing unless this pool IS the light pool. Do not name a camera position, a lens, a viewer or a shot.`;

// ─────────────────────────────────────────────────────────────
// POOL RECIPES — acorn-boat-regatta (7 gen'd axes; vantage hand-authored)
// ─────────────────────────────────────────────────────────────

const POOL_RECIPES = {
  // ════════════════════════════════════════════════════════
  // ★ RACE MOMENT — THE SIGNATURE MONEY-SHOT AXIS. The racing
  // incident. Layer (a) of the fairy-swarm anti-single-hero fix:
  // OPEN with an active verb naming ONE shared event, then 2-3
  // sub-actions on DIFFERENT boats so the crowd is distributed
  // in the seed and not only in the template.
  // ════════════════════════════════════════════════════════
  faebot_regatta_race_moment: {
    format: 'simple',
    theme: `FAEBOT ACORN-BOAT RACE — THE RACING INCIDENT. Each entry is ONE moment in the middle of a fae boat race down a woodland stream, 34-52 words. This is the money shot of the whole picture: the thing that makes a viewer see a RACE rather than a pretty boat on water.

STRUCTURE LAW (load-bearing, never break it) — every entry OPENS with an active verb naming ONE shared event the whole field is caught up in, then names TWO OR THREE more things happening on DIFFERENT boats at the same time, spread across the water. Example shape: "Piling up at the rock gate — two hulls locked together side-on while a third slips through the gap outside them, a fourth backing off hard with its oars braced, petal sails still coming on behind." At least FOUR boats are implied in every entry. One boat alone is a FAILED entry.

${DELIGHT_LAW}

THE INCIDENT MENU — draw on these and invent well beyond them: a capsize with the fae hauling their own hull back over by its grass lines · two hulls bumping and grinding round the inside of a bend · one boat shooting a little rapid nose-down in the spray · a leaf sail caught broadside by a gust and heeling its boat right over on its side · a boat pulling clear through a bright shaft of light while the rest labour in the shade · a pile-up at a pebble with three hulls stacked against it · a bailing emergency, an acorn cap flinging water over the side while the boat still races · a hull holed and going down by the bow with its neighbours swerving wide · a shell boat spun stern-first in an eddy and rowed frantically round again · an overtake right under the bank with a sail brushing the reeds · two boats lashing together to shoot a chute as one and coming apart at the bottom · a tow going wrong, the line snapping and both boats surging apart · a launch from the bank, hulls shoved off into the current in a ragged line · a wave from a passing duckling swamping the middle of the field · a boat riding a leaf like a surf-board over the low weir of a fallen twig · a mid-race repair, resin and a patch of bark slapped on while the others come up · the last stretch, two hulls dead level and a third closing under them · a sail unbent and being re-hung at full speed from the mast of a twig · a boat cutting the corner through a patch of watercress and dragging half of it along · a sudden downstream squall of blown petals blinding the leaders · a stowaway beetle making the lightest boat the fastest · a hull built too tall rolling right over the first time it turns across the flow · a paddle snapped clean and the fae rowing on with a leaf held in both hands.

${FAE_CRAFT_LAW}

${SCALE_LAW}

${NO_TEXT_LAW}

${FIGURE_LAW}

${POSITIVE_LAW}
This pool owns the ACTION only. Do not describe the stream's shape, the bank, the light, the palette, the spectators or what the boats are made of beyond the one or two words needed to tell them apart.`,
    touchpoints: [
      'Piling up at the pebble gate — two acorn hulls locked together broadside while a third squeezes through the gap outside them, a fourth shoved off the stone by a fae with both feet braced on it, petal sails still coming on hard behind.',
      'Capsized on the bend — three fae hauling their walnut shell back upright by its grass lines, one already bailing with an acorn cap, while two more boats swerve wide around the wreck and a fourth cuts inside through the reeds to steal the lead.',
      'Shooting the chute nose-down in white spray — the leading bark canoe half buried in it, two fae flat on their faces in the bow, a second hull dropping in behind them, a third holding above the lip with its oars back, the rest strung out waiting their turn.',
      'A gust taking the whole field broadside — one leaf sail flattened until its hull lies over on its side, a fae out along the windward edge as counterweight, another boat spilling its petal sail loose on purpose, two more rowing bare-masted straight through it.',
      'Swamped mid-stream by the wake of a passing duckling — two boats awash to the thwarts and bailing hard with cupped acorn caps, one rolling clean over, a fourth lifted right up over the wave and landing running with its petal sail cracking.',
      'Dead level in the last stretch — two shell hulls touching oars stroke for stroke, a third closing fast underneath them along the bank with its sail let right out, a fourth hull limping behind with a bark patch slapped over a split bow.',
    ],
    instructions: `Each entry is ONE racing moment in 34-52 words. MANDATORY, in this order: (a) open with an ACTIVE VERB naming the one shared event, (b) two or three more things happening on DIFFERENT boats, spread across the water, (c) one clever charm detail, (d) one natural-object scale prover. At least four boats implied. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // BOAT FLEET — the craft themselves. FOUR TO SIX hulls per
  // entry so the plural lives in the pool. Every hull is a found
  // thing; every sail and hull side carries its own PICTURE
  // (lesson 13 — a surface named in a seed is clean).
  // ════════════════════════════════════════════════════════
  faebot_regatta_boat_fleet: {
    format: 'simple',
    theme: `FAEBOT ACORN-BOAT RACE — THE FLEET. Each entry describes FOUR TO SIX tiny hand-made racing craft on the water together, 38-56 words. These are the boats a viewer wants to pick a favourite from.

FOUND-THING LAW (load-bearing) — every hull IS a found natural object, not a shrunken copy of a real boat: an acorn cap · a whole acorn split lengthwise · a walnut shell · a hazelnut shell · a curl of birch bark · a folded leaf punt · a flower-petal coracle · a hollow reed · two reeds lashed as an outrigger · a pea-pod skiff · a snail shell · a seed-pod with a pointed bow · a curl of bark with a chestnut-case bow · half a gourd · a bracket-fungus raft · a cupped magnolia leaf. Rigs are as scrappy: a twig mast, a grass-cord stay, a leaf or petal sail, an oar of a split reed or a flat seed, a rudder of bark, a keel weighted with one pebble.

VARIETY LAW — inside a single entry the four to six boats must differ in HULL MATERIAL, in SILHOUETTE (long and lean · fat and tubby · flat as a raft · high-sided · twin-hulled · deep and pointed) and in COLOUR, and at least two must be rigged differently from each other (one under sail, one rowed, one poled, one paddled, one towed by a harnessed dragonfly on a grass line). Name each boat's own colour.

${DELIGHT_LAW}

${FAE_CRAFT_LAW}

${SCALE_LAW}

${NO_TEXT_LAW}

${FIGURE_LAW}
Each boat carries ONE or TWO fae, named in a word or two and doing one thing — leaning out, hauling a line, at the oars, poling off a stone, flat along the bow. Keep it to a few words per boat: this pool owns the CRAFT, and another pool owns the racing incident.

${POSITIVE_LAW}
Do not describe the stream's shape, the bank, the spectators, the light or the palette of the scene as a whole — only the boats and their own colours.`,
    touchpoints: [
      'A fat acorn-cap tub painted moss-green under a scarlet petal sail, a lean birch-bark canoe with a marigold leaf sail showing its own veins, a flat bracket-fungus raft poled by two fae, a high-sided walnut shell rowed with split-reed oars, and a reed outrigger skimming outside them all, each hull smooth and plain but for one painted band of colour.',
      'Six hulls in a bunch: a plum-dark pea-pod skiff, a cream hazelnut shell with a moth-wing sail and its one eyespot, a copper-brown seed-pod with a pointed bow, a magnolia-leaf punt curled up at both ends, a snail-shell boat spiralling as it goes, and a twin-reed catamaran lashed with grass cord, its pebble keel showing through clear water.',
      'A long lean chestnut-case hull in berry-red under a broad cream petal, an acorn split lengthwise and rowed by three fae, a gourd half towed on a grass line by a harnessed dragonfly, a folded oak-leaf punt riding high and empty of ballast but for one river pebble, and a bark curl with a dandelion-down spare sail bundled in the bow.',
      'Four boats abreast: a turquoise-painted walnut shell with a sprig of dried heather lashed under its gunwale, a tall reed hull that leans, a flat raft of two bark strips pegged together, and a rose-petal coracle spinning gently, its fae leaning far out over the water with a split-reed paddle in both hands.',
      'A tubby acorn cap with a twig mast and a whole ivy leaf for a sail, a slim pointed seed-pod rowed hard, a birch-bark skiff with a painted crescent on her bow and nothing else, a flat fungus raft with a pebble lashed amidships for ballast, and a petal coracle so light it lifts clear of the water between strokes.',
      'A deep hazelnut hull under a scarlet petal, a bark canoe with dark lenticel dashes running the length of her side, a pea-pod skiff crowded with three fae in leaf-cloth, a reed outrigger with its float skipping, and a magnolia-leaf punt low in the water with an acorn cap tied ready for bailing.',
    ],
    instructions: `Each entry is FOUR TO SIX racing craft in 38-56 words. MANDATORY — (a) every hull is a found natural object, (b) hulls differ in material, silhouette AND colour, (c) at least two differ in rig, (d) every sail and hull side carries its own picture or plain surface, (e) one clever charm detail, (f) one natural-object scale prover. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // STREAM COURSE — the ARENA (playbook lesson 9: an actor path
  // needs an arena, not a vista). Bespoke to this path. Every
  // entry is OFF-AXIS by construction: the channel enters from
  // one side and leaves at another, never receding dead up the
  // middle (the BrickBot symmetry law).
  // ════════════════════════════════════════════════════════
  faebot_regatta_stream_course: {
    format: 'simple',
    theme: `FAEBOT ACORN-BOAT RACE — THE STREAM AS A RACECOURSE. Each entry is ONE stretch of woodland stream that the race is being run down, 34-52 words. This is the ARENA: a floor of moving water with a readable edge, not a landscape view.

CROOKED-CHANNEL LAW (load-bearing) — the water always enters the picture from one side and leaves by another, sweeping across the frame: round a bend under a cut bank · through a narrow gap between two stones · out of a chute into a wide still pool · over the low step of a fallen twig · splitting round an island of moss and joining again · along one deep side with a shallow gravel shelf on the other · through a flooded hollow among tree roots · down a shallow riffle broken by pebble backs. One side of the channel is always different from the other — a steep mossy cut bank one side and a low gravel spit the other, roots one side and open water the other.

${SCALE_LAW}
The scale prover matters more here than anywhere: the whole delight of this picture is a real stream read as a river. A pebble is a boulder, a fallen leaf is a raft the size of a boat, a tree root arching over is a bridge, a clump of watercress is a forest along the bank, a mayfly is a bird.

${DELIGHT_LAW}
For this pool specifically: the water itself must be DOING something the eye can read — sliding fast and glassy, breaking white over gravel, boiling in an eddy behind a stone, drawn into long oily lines above a chute, dimpled by rain, clear enough that the bright bed shows straight through.

${FAE_CRAFT_LAW}

${NO_TEXT_LAW}

${POSITIVE_LAW}
This pool owns the WATER, its bed and its banks. Do not describe the boats, the fae, the spectators, the course furniture, the light, the palette or the weather.`,
    touchpoints: [
      'A hard bend under a steep mossy cut bank, the water sliding fast and glassy on the outside and shelving away into bright gravel on the inside, one grey pebble standing up out of the middle like a boulder with a fallen oak leaf pinned against it, arching tree roots crossing overhead.',
      'A narrow gap between two stones opening out into a wide still pool, the flow drawn into long smooth lines above the gap and boiling white below it, the pool floor showing gold gravel straight through the water, a raft of fallen leaves turning slowly in the eddy along one side.',
      'A shallow riffle running diagonally across the picture, broken into a dozen small white breaks over pebble backs, a bank of watercress standing along the left like a forest and a bare gravel spit curving in from the right, the bed bright and stony under only a finger of water.',
      'The low step where a fallen twig dams the channel, water pouring over it in one smooth green tongue into froth below, a deep dark slot cut along the far bank under the roots, and a soft mud shelf printed with bird tracks sloping in from the near side.',
      'The stream splitting round a small island of moss and closing again beyond it, the left channel deep and quick and the right one shallow and stony, one whole fallen leaf bridging the narrows like a plank, grasses leaning right out over the water from the higher bank.',
      'A flooded hollow among great tree roots, the current threading between them in bright braided lines, a still backwater on one side furred with duckweed, a fern frond arching over the whole stretch like a roof, and a snail shell lying on the gravel as big as a boulder.',
    ],
    instructions: `Each entry is ONE stretch of racecourse stream in 34-52 words. MANDATORY — (a) the channel crosses the picture, entering one side and leaving another, (b) the two banks are different from each other, (c) the water is visibly DOING something, (d) one natural-object scale prover that makes it read as a river. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // COURSE FURNITURE — the course as a DESIGNED thing. This is
  // where every modern-prior noun lives (start line, flag,
  // buoy, scoreboard), so the fae-craft recast is the whole job
  // of this recipe. Named "furniture", never "marks" — "marks"
  // is a text-prior synonym (playbook lesson 1).
  // ════════════════════════════════════════════════════════
  faebot_regatta_course_furniture: {
    format: 'simple',
    theme: `FAEBOT ACORN-BOAT RACE — THE COURSE, RIGGED BY HAND. Each entry is ONE piece of fae-built race furniture standing in or over the water, 24-40 words. This is what tells a viewer the race is an EVENT somebody organised, rather than boats drifting about.

${FAE_CRAFT_LAW}
This pool is where the banned words want to creep in hardest, so say it again: the start is two bulrush stems leaning in over the water · a gate is an arch of bent twig pegged into the bed with a hanging berry at its middle · the turn is a tethered rowanberry or rose-hip bobbing on a grass line · the run's end is a garland of linked clover heads or a strand of dandelion-down strung between two reeds · the count is pebbles moved one at a time along a laid twig · the signal is one thump on an acorn-cap drum or a struck hanging dewdrop · the prize is a woven clover wreath or a polished river pebble waiting on a flat stone. Invent well beyond this list in the same material language.

${DELIGHT_LAW}
For this pool: the furniture is HAND-MADE and slightly wonky, and the wonkiness is the charm — a gate leaning because the bed was too soft, a berry hung too low so the tallest masts must duck, a twig arch mended in the middle with grass cord, a garland already half eaten, a pebble count with one pebble knocked into the water.

${SCALE_LAW}

${NO_TEXT_LAW}
Hanging things are the worst text magnet on this path. Anything strung across the water is made of a natural thing you can name: linked clover heads, threaded rowanberries, hung leaf triangles, a plait of grass, a strand of dandelion-down, a chain of apple-blossom.

${FIGURE_LAW}
A figure appears here only if the furniture needs tending — a fae kneeling on a stone to move the count pebbles, a fae astride the gate twig re-pegging it, a fae holding the drum ready.

${POSITIVE_LAW}
This pool owns the built course only. Do not describe the boats, the racing, the stream's shape, the spectators, the light or the palette.`,
    touchpoints: [
      'The start: two bulrush stems bent in over the water from either bank and tied together at the top with grass cord, a hanging dewdrop strung at the crossing ready to be struck, one stem leaning further than the other where the mud gave.',
      'A gate of two bent twigs pegged into the gravel bed with a single fat rowanberry hung at its middle, low enough that a tall twig mast has to lean under it, the peg on one side already working loose in the current.',
      'The turn, marked by a rose-hip the colour of a coal tethered on a grass line to a stone, bobbing and ducking in the flow with a bright thread of foam trailing behind it and a dragonfly using it as a perch.',
      "The run's end: a garland of linked clover heads strung between two leaning reeds a hand above the water, sagging in the middle, three of the clover heads already eaten down to their stalks by something.",
      'The count: a peeled twig laid flat along a mossy stone with nine small river pebbles ranged along it, four moved to the far end already, one sitting in the water just below where it rolled off.',
      "An acorn-cap drum lashed to a stake of hazel at the water's edge with a padded moss beater leaning against it, a fae kneeling ready beside it in petal-silk, and a spray of blown petals caught in the drumhead.",
    ],
    instructions: `Each entry is ONE piece of hand-made course furniture in 24-40 words. MANDATORY — (a) the thing itself, named in fae-craft material, (b) where it stands in or over the water, (c) one clever wonky charm detail. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // BANKSIDE — spectators, escorts and animals keeping watch.
  // Gated at 0.7 in the path file so crowd density varies.
  // Offices are named by ACTION, never by title.
  // ════════════════════════════════════════════════════════
  faebot_regatta_bankside: {
    format: 'simple',
    theme: `FAEBOT ACORN-BOAT RACE — THE BANK. Each entry is what is watching the race from the bank, the reeds and the air above the water, 26-42 words. This is the layer that turns a boat race into an OCCASION.

${FIGURE_LAW}

${FAE_CRAFT_LAW}
NAME THE ACTION, NEVER THE OFFICE — a fat frog sitting steady on a lily pad watching the turn; a heron standing over the far bend; a fae leaning out with a pebble in each hand counting the boats through; a water-vole hauled up on a root with its paws folded. Never an umpire, a judge, a marshal or an official.

${DELIGHT_LAW}
For this pool: the watchers are INVOLVED, never a polite row. They lean out too far, they shout, they run along the bank keeping level with a boat, they bet pebbles and hazelnuts on the outcome, they fall in, they hold a fern frond out to fend a hull off the stones, they cheer for the wrong boat. Dragonflies fly escort. A kingfisher watches the whole thing for its own reasons.

VARIETY LAW — across entries, vary WHERE the watchers are: on a mossy boulder in the middle of the stream · strung along a low overhanging root · up in a fern above the bank · crowded on a leaf beached on the gravel · riding the backs of frogs in the shallows · in the air above the field · out along a fallen branch that crosses the water.

${SCALE_LAW}

${NO_TEXT_LAW}

${POSITIVE_LAW}
This pool owns the watchers only. Do not describe the racing boats, the stream's shape, the course furniture, the light or the palette.`,
    touchpoints: [
      'A dozen fae crowded on a mossy boulder mid-stream in petal-silk and leaf-cloth, three leaning so far out over the drop that a fourth holds their ankles, all of them shouting at once, one fat frog sitting steady below them watching the turn.',
      'A line of fae running flat out along the low root that follows the bank, keeping level with the leading hull, one of them already in the water up to the waist and laughing, a water-vole hauled up further along with its paws folded.',
      'Four dragonflies flying escort above the field in a loose diagonal, their wings catching the spray, and up in a fern over the bank six small fae in moss-velvet betting hazelnuts and pebbles into a heaped acorn cap.',
      'Fae strung out along a fallen branch that crosses the whole channel, legs hanging over the water, one lying flat on her front reaching down with a fern frond to fend a hull off the stones, a kingfisher on the branch end watching for its own reasons.',
      "A knot of fae in leaf-cloth crowded onto a great fallen leaf beached on the gravel spit, all facing the wrong way and cheering a boat already out of the running, one small fae on a frog's back in the shallows paddling out for a closer look.",
      'A heron standing motionless over the far bend, enormous above the fleet, and along the near bank a straggle of fae in petal-silk waving both arms, one of them wringing out a soaked leaf-cloth skirt where the bank gave way under her.',
    ],
    instructions: `Each entry is ONE bankside watching layer in 26-42 words. MANDATORY — (a) where the watchers are, (b) at least two distinct things they are DOING, (c) one real animal named by its action, (d) one clever charm detail. Every fae named as a fae in fae-craft garments. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // ★ WATER LIGHT — owns the palette. Light doing work ON WATER
  // is half this path's beauty. VIVID LAW: two named colours per
  // entry. Light is a glow / patch / streak / soft shaft on a
  // real thing — never a bar, blade, column, ribbon or coin
  // (a named object renders as that literal object).
  // ════════════════════════════════════════════════════════
  faebot_regatta_water_light: {
    format: 'simple',
    theme: `FAEBOT ACORN-BOAT RACE — THE LIGHT ON THE WATER. Each entry is 28-44 words naming what the light is doing across this stretch of stream and the palette it brings. Light on moving water is half the beauty of this picture, so this axis owns the whole colour of the render.

VIVID LAW (load-bearing) — every entry names TWO colours explicitly, and at least half of all entries set a WARM light against a COOL shadow or a cool water. Saturated and committed: jade, emerald, gold, honey, amber, copper, rose, scarlet, plum, turquoise, lilac, ink-blue, pearl. A grey or muted entry is a FAILED entry.

WATER LAW — the light must be doing something specifically WATERY that the eye can read: sun through the canopy striking a wake and breaking it into bright flecks · a moving net of reflected ripple-light thrown up onto the underside of leaves and roots · spray lit from behind so it hangs as a bright dust · the bed of the stream lit gold straight through clear water so the hulls sail over their own shadows · a mirror-still pool doubling the whole fleet · reflections breaking apart under the hulls as they pass · the last sun down the length of the water turning it to copper while the banks go blue · a soft shaft coming down through the trees onto one boat and leaving the rest in green shade · a thin rain dimpling the surface with every drop ringed in light · fireflies and hung lantern-berries for an evening heat, each with its own doubled reflection.

LIGHT-IS-LIGHT LAW — light is a glow, a patch, a pool, a streak, a fleck, a soft shaft or a dappling ON a real surface. Never write light as a bar, a blade, a column, a pillar, a ribbon, a curtain, a coin or a jewel: Flux renders the named object literally, as solid.

${DELIGHT_LAW}

${POSITIVE_LAW}
This pool owns LIGHT, COLOUR and the time of day only. Do not describe the boats, the fae, the stream's shape, the bank or the racing.`,
    touchpoints: [
      'Late sun coming down the length of the water and turning it to beaten copper while both banks fall away into cool ink-blue shade, every wake breaking the copper into hundreds of bright flecks, the spray hanging lit as bright dust.',
      'Full midday overhead through a thin canopy, the stream bed lit gold straight through water so clear the hulls sail over their own hard black shadows on the gravel, the shaded reeds a deep jade against it.',
      'A moving net of reflected ripple-light thrown up onto the undersides of the leaves and roots overhanging the channel, restless honey-gold against the cool green shade, the water itself a dark turquoise where it runs deep.',
      'One soft shaft dropping through a gap in the trees onto a single patch of water in the middle distance, blazing pearl-white there, everything around it in a deep cool emerald shade, motes turning slowly in the beam of it.',
      'Evening, the sky still rose above the trees and the water holding it in long lilac and scarlet streaks, and lower down the first hung berry-lanterns and fireflies, each with its own doubled point of amber light on the surface.',
      'A thin bright rain dimpling the whole surface, every drop ringed in a small circle of light, the water a cool pewter-and-jade while the wet bank moss burns an intense saturated green in the flat silver light.',
    ],
    instructions: `Each entry is ONE light condition on the water in 28-44 words. MANDATORY — (a) the light source and time of day, (b) something specifically WATERY that the light is doing, (c) TWO named colours, at least one of them saturated. Light only ever as a glow, patch, pool, streak, fleck, dappling or soft shaft on a real surface. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // RACERS — GROUP-LEVEL cast axis (the fairy-swarm fae_troupe
  // pattern): 2-3 distinct leads sketched + a varied rest, so
  // the cast varies without one slot per fae. Also carries the
  // face-mush control: the nearest 2-3 have detailed faces.
  // ════════════════════════════════════════════════════════
  faebot_regatta_racers: {
    format: 'simple',
    theme: `FAEBOT ACORN-BOAT RACE — WHO IS RACING. Each entry is 32-48 words sketching the FIELD of fae racers as a group: TWO OR THREE distinct individuals described in a few words each, plus one phrase covering the varied rest of the field.

${FIGURE_LAW}

STRUCTURE LAW — name two or three leads by their LOOK and their RACING CHARACTER in a few words each (hair, wing, garment, one telling habit), then close with one phrase for the rest of the field that keeps them varied. The nearest two or three have fully detailed faces; the farther ones stay readable little figures. Example shape: "A lean copper-haired fae in a scarlet petal-silk tunic who sails standing up; a broad cheerful one in green leaf-cloth with moth-dust wings who rows sitting backwards and shouts advice; a very small one in woven grass steering by leaning; and behind them a scatter of fae in plum, cream and marigold, wings catching the spray."

VARIETY LAW — across the pool vary build, hair colour and length, wing kind (dragonfly-clear, moth-soft and dusted, beetle-iridescent, butterfly-patterned, birch-seed translucent), skin tone across the warm and cool human range, garment colour, and age from very young to silver-haired and still winning. Vary RACING CHARACTER too: the reckless one, the calm one who never hurries and arrives first, the one who cheats charmingly, the one who is clearly terrified, the one racing a boat far too big for them, the pair who bicker the whole way.

GARMENT LAW — every racer is COVERED, in fae-craft cloth: petal-silk, leaf-cloth, woven grass, moss-velvet, bark-fibre, a cloak of overlapping petals, a tunic of a single leaf, a sash of plaited grass, a cap of an acorn cup. Practical for water: sleeves pushed back, skirts kilted up, bare feet, a grass cord tied at the waist.

${DELIGHT_LAW}

${FAE_CRAFT_LAW}

${NO_TEXT_LAW}

${POSITIVE_LAW}
This pool owns WHO THEY ARE. Do not describe the boats, the stream, the light or the racing incident beyond one or two words of racing habit per fae.`,
    touchpoints: [
      'A lean copper-haired fae in scarlet petal-silk with dragonfly-clear wings who sails standing straight up in the bow; a broad cheerful one in green leaf-cloth and moth-dusted wings who rows sitting backwards and shouts advice at everybody; a tiny silver-haired one steering by leaning alone; and behind them a scatter in plum, cream and marigold.',
      'Two sisters with long black hair and butterfly-patterned wings who bicker the whole way down the course in matching moss-velvet; a calm dark-skinned fae in woven grass who never hurries and keeps arriving first; and a field of young fae in kilted-up leaf-cloth, sleeves pushed back, bare feet braced on their thwarts.',
      'A very small pale fae in an acorn-cup cap, plainly terrified, hanging onto her own twig mast with both arms; a heavyset older one with silver braids and beetle-iridescent wings rowing a hull far too big for him; and a loose field in petal-silk of every colour, wings catching the spray.',
      'A freckled red-haired fae in a tunic cut from one ivy leaf who cheats charmingly and grins about it; a tall grave one in plum petal-silk with birch-seed wings who sails standing and silent; a pair of small cousins sharing one paddle; and the rest of the field bright and varied behind.',
      'A golden-skinned fae with cropped white hair and moth-soft wings, sleeves pushed right back, up to the knees in her own flooded hull and still racing; a long-limbed one in bark-fibre poling from the stern; and a dozen more in leaf-cloth and woven grass strung out behind, faces lost to distance but bright with colour.',
      'A brown-skinned fae with a heavy plait and clear wings who steers with one bare foot on the rudder bar; a round-faced young one in a cloak of overlapping rose petals who has plainly never done this before; and a mixed field of fae from the very young to the silver-haired, all covered, all barefoot.',
    ],
    instructions: `Each entry sketches the FIELD in 32-48 words. MANDATORY — (a) two or three distinct fae by look and racing character, (b) one closing phrase for the varied rest, (c) every fae covered in fae-craft cloth, (d) full beautiful faces with real eyes and real hair on the nearest ones. Output a NUMBERED list, one entry per line, no internal newlines.`,
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
  'water',
  'boats',
  'boat',
  'hulls',
  'hull',
  'stream',
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
