#!/usr/bin/env node
/**
 * PixelBot castle-town-gate — bespoke pools (PIXELBOT_SCENES_PLAN.md §3.x shape,
 * built off floating-market-canal, the most recently hardened recipe set on this
 * bot). THE GREAT GATEHOUSE OF A CLASSIC-JRPG CASTLE TOWN, SEEN FROM OUTSIDE AS
 * A TRAVELLER ARRIVES — the "you have reached the town" splash screen.
 *
 * ── THE GAP (audited in code, not assumed) ──────────────────────────────────
 * All fourteen SCENE paths put the viewer either INSIDE a place (cozy-room,
 * ice-cavern, volcano-forge), at a DISTANCE from one (vista, fantasy-vista,
 * skyward, shoreline, harbor, cool-rides, cabin-glow), or already WITHIN its
 * streets (rain-street, floating-market-canal, ruins). None of them is a
 * THRESHOLD: the moment before you go in, with the thing between you and the
 * place filling the frame. The nearest neighbours, checked entry by entry:
 *   - `pixel-fantasy-vista` landmark pool: 48 castle entries, 9 naming a
 *     gatehouse — but every one is a DISTANT landmark on a crag/island/lake,
 *     the gatehouse a detail inside a wide vista.
 *   - `cozy-rpg-town` locale pool: 16 entries ARE literal castle gatehouses
 *     with a raised portcullis — but that path is an IN-GAME gameplay
 *     screenshot on the old `pixels` medium with chaos ON, and a gate locale
 *     rolls about 1 in 14. It is also saturated with the exact text magnets
 *     this path deletes ("heraldic banners", "kingdom banners", "paired stone
 *     banners carved in relief").
 *   - `pixel-ruins` owns RUINED, abandoned, overgrown stone. This gate is
 *     INTACT, WORKING, CARED FOR and full of people, which is the whole
 *     differentiator.
 *
 * ── THE FIVE FAILURES THIS PATH WILL DRIFT TOWARD, AND WHERE EACH LEVER LIVES
 *
 * DRIFT 1 — TEXT AND HERALDRY. A gate is the fleet's single densest text magnet:
 * banners, crests, notice boards, town names, guild signs. Per playbook lesson
 * 12 a surface whose SHAPE is itself a text prior cannot be safely described
 * ("blank" does not subtract, naming the noun adds), and per lesson 27 deleting
 * the noun is NOT enough when the setting carries the prior — an ABSENCE gets
 * backfilled. So: the noun class is DELETED from every layer (this path
 * deliberately does NOT use the shared `PICTORIAL_BLOCK`, which names sign,
 * poster and banner), AND the space it leaves is FILLED positively by the
 * `wall_life` axis. The identity of the gate is then carried by lesson 36's
 * POSITION-COLOUR-COUNT LAW: the colour of the cloth, how many towers, how many
 * lamps lit, the iron gate raised or lowered, the shape of the roof, a carved
 * animal as a SCULPTURE IN THE ROUND. Nothing is ever a flat panel bearing
 * anything.
 *
 * DRIFT 2 — THE APPROACH-ROAD CORRIDOR (lessons 17, 24, 29). A road to a gate is
 * the purest vanishing-point instruction there is. The measured fix is the
 * CROSSWISE LAW applied to the SETTING, and its bridge corollary: a road, like a
 * bridge, must cross to somewhere, so naming one tells Flux the picture runs
 * inward. Hence `CROSSWISE` below: the wall runs left edge to right edge, the
 * ground is a near BAND, any road/causeway/drawbridge enters from ONE SIDE EDGE
 * and runs back out of it cropped, and the arch's inside is ONE SHALLOW space.
 * Stated in the hero seeds, every camera entry, template rule 1 and
 * output-order item 1. Lesson 29's sweep (`converg|vanishing|apex|recedes
 * away`) runs on the HERO and TOWN_ABOVE pools, not just the camera pool.
 *
 * DRIFT 3 — SCALE (lessons 13, 25). A low count is the giant-object generator, a
 * shape word in an object's name becomes the shape on screen, and a ruler must
 * be IN FRAME and WELDED to a larger structure. Plus the 2026-09-23 correction:
 * grant NO subject a detail exemption — "detail on the nearest one or two only"
 * IS the inflator. So `SIZE` requires a dozen-plus figures at graded distance,
 * every one a small clean sprite shape including the nearest, and a ruler welded
 * to the gate's own courses / hinge / cart wheel.
 *
 * DRIFT 4 — THE JARGON TRAP (lesson 28). Castle vocabulary is a minefield of
 * correct terms that a layperson pictures as a different object, and Flux
 * renders that other object CONFIDENTLY: curtain (a fabric curtain), keep (the
 * verb), bailey (a surname), ward (a hospital ward), crown (a king's crown),
 * apron (a cooking apron), throat (a body part), murder hole (violence),
 * machicolation / merlon / embrasure / barbican / postern / arrow loop (no prior
 * at all → nearest centroid). All banned in `JARGON`, each with the plain
 * replacement written out. `portcullis` is KEPT but always glossed with the
 * layperson's words ("a heavy iron lattice gate"), which is the shape of the
 * measured BrickBot fix (one occurrence of "balloon" beside "envelope" was the
 * entire difference).
 *
 * DRIFT 5 — GRIM. A gate invites siege, weapons, war and dread, which is
 * GothBot's and DragonBot's lane and fails Kevin's motto outright. `TONE` and
 * `WELCOME` make this a warm arrival: guards are doing friendly things and are
 * never armed, and the whole picture is the moment a traveller is glad to see.
 *
 * Standing hazards this file is written against (each cost real renders):
 *  - LIGHT AS AN OBJECT: shaft / column / beam / ribbon / ring / halo / curtain
 *    render solid objects. `LIGHTOBJ`.
 *  - "facet" IS A LOW-POLY PRIOR: stone described by facets renders a fully
 *    smooth vector illustration. `PIXELMAT`.
 *  - EVEN COUNTS MIRROR: two flanking towers of equal height is the dead-symmetry
 *    failure. Odd counts, one member plainly set apart. `IRREGULAR`.
 *  - A CLOCK FACE SHIPS NUMERALS however it is worded (lesson 12): clock, dial,
 *    gauge and sundial are deleted, never described.
 *  - A LIFE ENTRY WITH NO SIZE WORD RENDERS HERO-SCALE.
 *  - ANIMALS SPLIT ON A RULE: `travellers` may name PACK and RIDDEN beasts
 *    (part of a traveller's silhouette, never the hero); `gate_life` is the only
 *    axis that names a FREE creature. Two axes both supplying a free animal
 *    renders both of them competing with the hero.
 *
 * CHARM has no axis of its own on purpose. The first-third budget is zero-sum
 * (lesson 34) and an eleventh output-order item would push a working rule out,
 * so charm is required INSIDE three axes that already run on every render —
 * `gatehouse` (one made thing per entry), `wall_life` (the whole axis is charm),
 * and `arrival_moment` (the story beat). This is the proven shape on this bot
 * (floating-market-canal's canal_town recipe).
 *
 * 10 pools, axis-clean, positive-only. MVP 25 each; --scale appends to
 * production size. `camera` is HAND-AUTHORED (playbook: Sonnet-generated camera
 * pools leak time-of-day / light / terrain / hero-type / posture verbs) and
 * written verbatim below.
 *
 * Run: node scripts/gen-seeds/pixelbot/gen-castle-town-gate-pools.js [--only slot] [--scale]
 */
const fs = require('fs');
const { generatePool } = require('../../lib/seedGenHelper');
const DIR = 'scripts/bots/pixelbot/seeds/';
const SCALE = process.argv.includes('--scale');
const only = (() => { const i = process.argv.indexOf('--only'); return i >= 0 ? process.argv[i + 1] : null; })();

const FMT = `Format every entry exactly as 'CAPS TITLE: body' (a short capitalised title, a colon, then the body). Return ONLY a JSON array of strings.`;
const CLEAN = `POSITIVE ONLY: describe what is there; write no negations, no "no", no "never", no "without".`;

const BAR = `THE BAR (this outranks everything except the laws below): playful, adventurous, vivid, beautiful, clever. This is the splash screen a classic game shows when the player finally reaches the great city, and the player should want to walk in. Two acceptable outcomes for every entry: show something a person has never seen, or take something familiar and redress it as something more interesting. Ask of every entry "is this the obvious version of this idea, or the surprising one" and write the surprising one. VIVID IS LITERAL: saturated committed colour and dramatic light, never muted, washed out or tasteful-grey. CLEVER means ONE charm detail the eye finds on second look that makes it that gate and no other. ADVENTUROUS beats static: something is happening. A clean, correct, sober entry is a failure here — "a grey stone castle gate with a road leading up to it" is exactly the picture this pool exists to avoid.`;

const TONE = `TONE: warm, welcoming, busy and a little magical. This is the front door of a thriving storybook city at the end of a long road: lamplight, smoke from a hundred chimneys, bright painted timber, flowers in the wall, carts and travellers, a guard who waves you through. Grime, squalor, poverty, misery, decay, ruin, abandonment, dread and horror are absent from every entry, and the words for them are absent too. Documentary realism, travel photography and geographic realism are absent: this is a game's painted scene, not a photograph.`;

const WELCOME = `NO SIEGE, NO WEAPONS, NO WAR. This gate is open for business. Guards are present and they are doing warm, ordinary, faintly comic things: waving a cart through, lighting the lamps with a long pole, leaning on the wall with a mug, bending to pat a dog, carrying a sleeping child's basket, plainly pretending not to notice a stuck wagon. Battle, siege, combat, weapons, swords, spears, pikes, halberds, bows, arrows, armour, cannon, catapults, blood, corpses, skulls, war, monsters, skeletons, dragons and knights are absent from every entry, and the words for them are absent too. A guard's coat is bright and plain; a guard's job here is to open the gate.`;

const NAMES = `NAMES: describe everything in plain visual terms. The names of real places, real cities, real countries, real castles, real companies, myths, gods, games, films and franchises are absent from every entry (so no Carcassonne, no Rothenburg, no York, no Kyoto, no Minas Tirith, no Hyrule, and no other real or borrowed name). Real-world ethnic and national labels are absent too; this is its own invented world.`;

// ── DRIFT 2: the load-bearing geometry ───────────────────────────────────────
const CROSSWISE = `THE CROSSWISE LAW, and it is the single most important thing in this pool. A road running up to a gate is the purest "everything vanishes to a point in the middle" instruction there is, so the frame is built to make that impossible:
 (a) THE WALL AND ITS GATEHOUSE RUN ACROSS THE PICTURE FROM THE LEFT EDGE TO THE RIGHT EDGE. Their stone fills the middle band of the frame from side to side. Both ends of the wall run out of frame, one past the left edge and one past the right edge, so no end of the wall is visible and nothing narrows away toward a far point.
 (b) THE GROUND IN FRONT OF IT IS A NEAR BAND CROSSING THE PICTURE LEFT TO RIGHT — trodden earth, wet cobbles, grass, snow, sand — filling the lower third of the frame and running out of frame on both sides.
 (c) THE GATEHOUSE MASS STANDS OFF-CENTRE IN THAT WALL AND IS TURNED THREE-QUARTERS TO THE CAMERA, so one of its flanks recedes a little into the picture and the weight of the composition sits plainly to one side.
 (d) ANY ROAD, TRACK, CAUSEWAY, BRIDGE OR DRAWBRIDGE ENTERS FROM ONE SIDE EDGE OF THE PICTURE AND RUNS BACK OUT OF THAT SAME EDGE, cropped, so it passes ACROSS the front of the gate rather than leading into it. A drawbridge is best of all when it is hauled up flat against the wall.
 (e) THE ARCHWAY'S INSIDE IS ONE SHALLOW SPACE. What shows in the opening is the bars of the heavy iron lattice gate, or one small bright cobbled yard immediately behind it, or deep warm shadow with a single lamp burning in it.
Write this geometry into the entry in those terms: "the wall crossing the picture from the left edge to the right edge", "its stone running out of frame on both sides", "the ground a wide band across the bottom of the frame", "the gatehouse off to one side and turned three-quarters". Absent from every entry: a road leading away from the viewer toward the gate, a tunnel or passage receding through the wall, a lit far opening at the end of a passage, a wall running away to a far point, a line of figures or carts one behind another into the distance, anything converging, any apex or shared point, any vanishing point.`;

// ── DRIFT 1: delete the noun class, then fill the space; identity by
//    POSITION, COLOUR and COUNT (playbook lessons 12, 27, 36) ───────────────
const NOMARK = `THE POSITION-COLOUR-COUNT LAW — this is how the gate says who it is, and it is also the clever version. A great gate wants to announce itself, and in this world it does that only with PHYSICAL FACTS about real solid objects:
 COLOUR — long strips of bright cloth hung from poles on the towers, named by their colours and shown twisting or edge-on in the wind so none of them presents a flat face to the camera ("three long strips of cloth in scarlet, saffron and jade, twisting edge-on in the wind"). The colours ARE the announcement.
 COUNT — how many towers (an odd number, one of them plainly taller or fatter than the others), how many lamps are burning and how many are still dark, how many arches, how many steps.
 POSITION — the heavy iron lattice gate half-raised and stopped, the two great timber doors standing wide open flat against the wall, a small low door cut into one of the big doors and that small one open, a lamp lit on one side of the arch only, the drawbridge hauled up flat.
 SHAPE — the roof's own silhouette (a steep tiled cone with a little hat on top, a wide roof pulled low like a hat, a fat onion dome in green copper, a stepped flat top, a row of square stone teeth along the top).
 A CARVED HEAD JUTTING OUT OF THE STONE, never a flat panel and never a whole animal — a fat stone lion's head jutting right out over the arch with real moss growing in its open mouth, a stone bear's head as broad as a cart wheel jutting out of the wall with a muzzle worn smooth by luck-rubbing, a stone owl's head the size of a barrel with lichen across its brow, a stone fish's head spitting a thread of water, a carved wooden dragon-headed beam end. MEASURED, AND THIS IS THE WHOLE RULE: a carved HEAD or a carved PART growing straight out of the wall's own stone holds every time, while a WHOLE carved animal standing on a bracket, a gatepost, a plinth or a parapet renders as a LIVE animal at hero scale, or gets duplicated into a matched pair flanking the arch, which is the dead-symmetry failure. At most ONE carved head in an entry, and it sits plainly OFF the arch's centre line, never squared up above the middle of it.
TEXT IS ABSENT, AND THE OBJECT CLASS IS DELETED RATHER THAN DESCRIBED. Writing, letters, numbers, town names and lettering are absent. So are the objects whose very SHAPE is a text prior or a device prior, and their NAMES are absent from the entry too: BANNER, PENNANT, FLAG, STANDARD, HERALDRY, HERALDIC, CREST, COAT OF ARMS, ARMS, DEVICE, EMBLEM, SIGIL, INSIGNIA, BADGE, SHIELD, SIGN, SIGNBOARD, SIGNPOST, BOARD, NOTICE, PLACARD, PLAQUE, PLATE, POSTER, SCROLL, PROCLAMATION, LABEL, TAG, MAP, PAPER, LETTER, SEAL, MOTTO, INSCRIPTION, MILESTONE, CLOCK, CLOCK TOWER, DIAL, GAUGE, SUNDIAL, WEATHERVANE, COMPASS. Also absent: MARK, MARKS, MARKING, GLYPH, SIGIL, RUNE, STAMPED, ENGRAVED, ETCHED, INSCRIBED, SCRIPT, CHARACTERS, NUMERAL. Cloth is a safe and welcome surface; a flat rectangular panel facing the camera is what invents lettering and it never appears. A carved stone animal is safe because it is a solid shape, not a picture of one.`;

// ── Lesson 26 + 27: the wall is mostly one enormous flat surface, and the
//    surface nothing describes is the one that grows pseudo-lettering. Done
//    right this is the best set dressing in the path, not a tax. ───────────
const WALLCARRY = `THE WALL LAW: every entry names WHAT THE BIG STONE FACES CARRY, and it is something worth looking at. A gate is mostly one enormous wall, so a stone face that nothing describes is exactly where pseudo-lettering appears — and the space directly ABOVE THE ARCH is the most inviting empty rectangle in the whole picture, so it always has a real solid thing on it. The wall is always FULL and never flat. Things a wall carries: ivy gone right up to the parapet in one lopsided sheet; a row of round paper lanterns strung along under the arch; window boxes crammed with flowers at uneven heights; firewood stacked to a figure's shoulder with a cat asleep on top; a wooden stair zigzagging up the outside of the tower; a spout high up pouring a bright thread of rainwater down into a stone trough; hanging bundles of drying herbs and onions; a straw beehive tucked in a niche; nets, baskets and copper pans on iron hooks; the great wheel and rope that lifts the iron gate; snow heaped on every ledge with icicles hanging under them; a whole crooked tree grown out of a crack high up; birds' nests crammed into every narrow slit window; one great bronze bell hung in the arch; a brazier burning low in a niche with a kettle beside it; a small low door cut into the big door standing open with warm light spilling out of it; a long row of boot-scrapers and hooks worn shiny by use.
NAME THE WALL'S OWN CONSTRUCTION TOO, positively and in pixel terms: "great blocks of honey-coloured stone in uneven courses, each face stepping into shadow through two or three flat dithered bands, every edge a hard pixel step". A global pixel lock does not reach the one huge smooth object in a frame, so the wall's own material is always named.`;

// ── DRIFT 3: scale, with NO detail exemption ────────────────────────────────
const SIZE = `THE SIZE LAW. The picture's whole sense of scale comes from the figures, so there are MANY of them — a dozen or more — spread at clearly DIFFERENT distances: some near, some at mid-distance, some tiny right at the wall's foot. EVERY ONE of them is a small clean pixel-sprite shape, and NO figure is given more detail than any other, INCLUDING THE NEAREST. The one you describe most is the one that comes out biggest, so faces, clothing detail and anatomy are absent for every figure; they are known by their SILHOUETTE and by what they are DOING. Figures are described by their action and their outline, never by age, gender or nationality.
EVERY ENTRY WELDS A RULER TO THE GATE'S OWN STRUCTURE, in these terms: "each figure about as tall as three of the wall's own stone courses", "the arch rising about eight figures high", "a figure reaching only to the bottom hinge of the great door", "the cart's wheel standing as high as a figure's shoulder". A size adjective on its own ("tiny", "small", "no bigger than") buys nothing, and a free-floating comparison inflates along with the thing it measures — the ruler must be a part of the gatehouse or of a cart that is itself measured against it.
Bare skin, bathing and swimming are absent; everyone is dressed in plain bright working clothes and travelling cloaks.`;

const JARGON = `THE PLAIN-WORDS LAW (this has cost real renders on this fleet). Castle vocabulary is full of correct terms that an ordinary reader pictures as a completely different object, and the picture then renders that other object confidently. So these words are absent from every entry, and the plain replacement is written instead:
 CURTAIN (of a wall) → "the long wall", "the wall running out of frame". Never the word curtain, which is a fabric curtain.
 KEEP (the tower) → "the great square tower standing behind the wall".
 BAILEY, WARD → "the cobbled yard inside the gate".
 CROWN (of a tower) → "the top of the tower".
 APRON → "the paved ground in front of the gate".
 THROAT, MOUTH (of the passage) → "the archway", "the opening".
 MURDER HOLE, ARROW LOOP, ARROW SLIT → "a tall narrow slot in the stone", "narrow slit windows".
 MACHICOLATION, MERLON, EMBRASURE, CORBEL, BARBICAN, POSTERN, SALLY PORT, CHEMIN DE RONDE → plain description: "a row of square stone teeth along the top", "a small low door cut into the big one", "a walkway along the top of the wall".
 CRENELLATED, CRENELLATION → "a row of square stone teeth along the top".
PORTCULLIS is allowed and is always written together with the ordinary words for it, in this shape: "a heavy iron lattice gate, its portcullis bars half-raised". Never the bare word on its own. MOAT, DRAWBRIDGE, TOWER, ARCH, PARAPET, BATTLEMENT and GATEHOUSE are all plain enough to use freely.`;

const IRREGULAR = `IRREGULARITY: every arrangement is uneven and off-centre. Rooflines step up and down in uneven jumps, towers differ plainly in height and girth, things lie where they were left, carts sit at different angles. Matched pairs flanking the centre, mirrored halves, a symmetrical face squared up to the camera, and tidy rows of identical objects are absent. COUNTS: where several like things appear the count is ODD and one of them is set apart or differs plainly (three towers of three different heights, the smallest well off to one side; five lamps with two of them still dark). Two equal towers flanking a central arch is the single worst arrangement in this pool.`;

const PIXELMAT = `PIXEL MATERIALS: stone, timber, iron, tile, glass, snow and water are described with CHUNKY STEPPED SIDES and flat bands of colour a pixel artist would place by hand: "flat stepped bands of honey stone", "chunky stepped pixel edges", "hard pixel steps", "blocky stacked roof tiles", "each face stepping into shadow through three flat dithered bands". The words facet, faceted, polygon, polygonal, smooth, glossy, mirror-finish, photorealistic, hyper-real, bokeh and depth-of-field are absent, because they render a fully smooth image with no pixel structure.`;

const LIGHTOBJ = `LIGHT IS LIGHT, never an object: light spills, pours, washes, slants, lies across, climbs, dapples, glows, catches, edges, doubles, scatters. The words shaft, column, pillar, bar, beam, wedge, ribbon, cone, ring, coin, disc, halo and curtain are absent when describing light or a reflection. A reflection is written as "broken into flat pixel bands on the wet cobbles", "a scatter of glitter in the puddles", "the lamp doubled and wobbling in the water below it".`;

const GUARD = `REGISTER GUARD: this is the great gate of a living, working, cared-for storybook city, seen from OUTSIDE, close up, as a traveller arrives. A ruined, abandoned, overgrown stone ruin belongs to another path, and so does a distant castle seen small across a lake or on a crag, and so does a gameplay screenshot with menus, a tile grid and health bars. Gothic dread and haunted castles belong to another bot; dragons, knights and epic-fantasy relics belong to another bot; brick-built castles belong to another bot. Cars, wires, aerials, plastic, corrugated sheet, machinery, engines and any modern object are absent. Cyberpunk, neon, steampunk brass and gears are absent.`;

const SIMILE = `SIMILES: a BUILT thing may be described by a likeness, because that is this bot's charm and it renders beautifully ("a steep tiled roof pulled low over the top like a hat", "a carved beam-end shaped like a curling fish"). A NATURAL form never is: roots, cracks, trees, moss, clouds, smoke, snow and water are described in their own terms, because a borrowed likeness on a natural form renders the literal object (roots "like fingers" renders fingers, a cloud "like a whale" renders a whale). The words "like fingers", "like a hand", "like claws", "like teeth" and "like bones" are absent everywhere.`

const SMOKEPLUME = `SMOKE AND STEAM ARE PLUMES, NEVER COLUMNS. Smoke and steam stand, lift, pour up, lean, thin and pool, and they are written as a plume, a thread, a soft stack or a drift. The words column, pillar, tower, bar, ribbon, wall and shaft are absent when describing smoke, steam, mist or light, because each of them renders a solid object of that shape.`

const AXISNOTE = (mine, others) => `AXIS-CLEAN: the entry describes ${mine} and nothing else. ${others} belong to other axes and are absent here.`;

// SLIM law variants for the BEAT axis. The first generation of `arrival_moment`
// carried the full NOMARK identity menu and the full SIZE paragraph, and Sonnet
// read them as CONTENT REQUIREMENTS: every beat came back also describing the
// towers, the cloth colours, the lamp count and the carved lion, i.e. it
// duplicated `gatehouse` and `wall_life`, ran 30-50 words against a 16-34 ask,
// and could contradict whatever gatehouse actually rolled (a beat naming three
// towers against a single-mass hero). A law that must appear on every render
// belongs in the template's OUTPUT ORDER (playbook lesson 22), not stuffed into
// every axis recipe — so this axis gets only the two clauses it actually needs.
const ACTOR = `NAME THE ACTOR AS A WHOLE FIGURE. A named action with no named actor renders a giant disembodied hand or arm; this has cost real renders twice. So write "a small sprite figure in a wide hat", "two small figures at the near cart", "a guard with a long pole", never "a hand held out" or "an arm raised". Every figure is a small clean pixel-sprite shape known by its silhouette and its action, never by a face, clothing detail, anatomy, age, gender or nationality, and no figure in the beat is described in more detail than any other. Bare skin, bathing and swimming are absent; everyone is dressed.`;

const NOTEXT_SHORT = `TEXT IS ABSENT AND THE OBJECT CLASS IS DELETED RATHER THAN DESCRIBED. Writing, letters, numbers, town names and lettering are absent, and so are the objects whose SHAPE is a text or device prior, whose NAMES are absent from the entry too: BANNER, PENNANT, FLAG, STANDARD, HERALDRY, CREST, COAT OF ARMS, EMBLEM, SIGIL, INSIGNIA, BADGE, SHIELD, SIGN, SIGNBOARD, BOARD, NOTICE, PLACARD, PLAQUE, POSTER, SCROLL, PROCLAMATION, LABEL, TAG, MAP, PAPER, LETTER, SEAL, MOTTO, INSCRIPTION, MILESTONE, CLOCK, DIAL, GAUGE, SUNDIAL, WEATHERVANE, COMPASS, MARK, MARKING, GLYPH, RUNE, STAMPED, ENGRAVED, ETCHED, SCRIPT, CHARACTERS, NUMERAL.`;

// ─────────────────────────────────────────────────────────────────────────────
// HAND-AUTHORED camera pool (25). Every entry: where the CAMERA sits + what
// fills the frame + the CROSSWISE geometry + an ANGLE. Written verbatim because
// Sonnet-generated camera pools leak time of day, light, weather, terrain, the
// hero's type and posture verbs. Rules applied to all 25:
//  - hero-agnostic: only "the gatehouse" / "the wall" / "the town", never a
//    specific massing (which would fight the rolled hero).
//  - the gatehouse is always OFF-CENTRE and TURNED THREE-QUARTERS so one flank
//    recedes: an architectural hero needs an ANGLE word or Flux faces it
//    square-on and mirrors it (pixel-ruins R2 → R3).
//  - never looking down a road at the arch, never from inside the passage, and
//    never with the arch centred: all three are corridor generators.
//  - never standing ON something the hero pool can roll (ice-cavern R0 #4 put
//    the camera on the arch and the hero left the frame).
//  - never a narrow aperture or a surround: that draws a dark border all round
//    the frame (a peephole vignette). Frame-edge foreground is a near EDGE only.
//  - no posture verbs (lying / sprawled / perched / kneeling / crouching /
//    seated / leaning): a camera describing the VIEWER's posture renders a
//    PERSON in that posture.
// ─────────────────────────────────────────────────────────────────────────────
const CAMERA = [
  'FROM THE OPEN GROUND, THREE-QUARTERS: camera at eye level out on the open ground before the wall, the wall crossing the whole picture from the left edge to the right edge and running out of frame both sides, the gatehouse set well off to one side and turned three-quarters so one flank recedes into the picture.',
  'LOW ON THE TRODDEN GROUND: camera set low, a knee above the ground, the near ground a wide band across the bottom of the frame, the wall and its gatehouse standing across the middle of the picture, the gatehouse off-centre and angled.',
  'PAST THE NEAR CART WHEEL: camera at eye level with one tall cart wheel closing the near lower corner, the wall crossing the picture beyond it from edge to edge, the gatehouse three-quarters on and off to the far side.',
  'FROM THE LOW RISE, LOOKING DOWN A LITTLE: camera one storey above the ground on a low rise off to one side, looking down slightly across the band of ground, the wall running out of frame both ways with the gatehouse angled to the near side.',
  'ALONG THE FOOT OF THE WALL: camera at eye level close in against the wall on one side, the stone running away along the frame edge to the gatehouse standing off-centre and turned, the ground crossing below it.',
  'PAST THE LEANING GATEPOST: camera at eye level with one old leaning timber post closing the near left, the wall crossing the picture past it and out of frame right, the gatehouse angled beyond.',
  'ACROSS THE MOAT WATER: camera at eye level on the outer bank, flat water crossing the lower third of the frame from edge to edge, the wall standing in a band above it and the gatehouse turned three-quarters to one side.',
  'OVER THE NEAR MARKET STALLS: camera at eye level just above a huddle of low stalls on the near ground, the wall crossing the picture beyond them, the gatehouse off-centre and angled.',
  'FROM THE ORCHARD EDGE: camera at eye level at the edge of the trees on the near side, a few near trunks cropping one frame edge, the wall crossing wide and open beyond them with the gatehouse angled off to one side.',
  'FROM THE WAGON BED: camera at cart-bed height out on the ground, the near load cropping the bottom corner, the wall crossing the whole picture, the gatehouse three-quarters on to the far side.',
  'BESIDE THE WATER TROUGH: camera at eye level with a stone trough closing the near right, the ground band crossing in front of the wall, the gatehouse standing off-centre and turned.',
  'FROM THE FAR BANK, SQUARE ACROSS: camera at eye level a good way out, the wall a long band crossing the whole width of the picture and running out of frame both sides, the gatehouse plainly to one side of centre and angled.',
  'THREE-QUARTERS FROM THE ROAD\'S SIDE: camera at eye level standing to one side of the ground the road crosses, the road entering the frame at one side edge and running back out of it, the wall crossing behind, the gatehouse turned.',
  'OVER THE LOW WALL: camera at eye level with the top of a low field wall cropping the bottom edge, the open ground and the great wall crossing the picture above it, the gatehouse angled off to one side.',
  'FROM THE BRIDGE\'S NEAR END, SIDELONG: camera at eye level at the near end of a short crossing, looking sidelong so the crossing runs out of one frame edge, the wall crossing the picture and the gatehouse angled beyond it.',
  'PAST THE STACKED BARRELS: camera at eye level with a stack of plain barrels closing the near left, the wall crossing the picture past them from edge to edge, the gatehouse three-quarters on.',
  'FROM THE UPPER FIELD: camera two storeys above the ground on a slope off to one side, looking down across the band of ground onto the wall, the gatehouse set off-centre and turned so one flank recedes.',
  'UNDER THE ROADSIDE TREE: camera at eye level with one branch and a few leaves cropping the top near corner, the wall and gatehouse crossing the open picture below, the gatehouse angled to one side.',
  'BESIDE THE NEAR LAMP POST: camera at eye level with an iron lamp post closing the near right edge, the ground crossing the bottom of the frame, the wall running out of frame both sides with the gatehouse angled off-centre.',
  'FROM THE TILTED GROUND: camera at eye level where the ground runs slightly downhill across the frame, so the wall\'s line sits at a small angle, the gatehouse turned three-quarters and off to one side.',
  'OVER THE QUEUE\'S SHOULDERS, FROM THE SIDE: camera at eye level to one side of a loose scatter of travellers on the ground, seeing them side-on across the frame with the wall crossing behind them and the gatehouse angled.',
  'PAST THE NEAR HAYSTACK: camera at eye level with a rounded haystack closing the near left corner, the wall crossing the picture beyond it, the gatehouse three-quarters on to the far side.',
  'FROM THE STREAM\'S EDGE: camera set low at a shallow stream crossing the near ground from edge to edge, the wall standing in a band above it, the gatehouse off-centre and turned.',
  'ALONG THE OUTER TERRACE: camera at eye level on a paved terrace that runs across the frame in front of the wall, the paving crossing the bottom third, the wall above it edge to edge, the gatehouse angled to one side.',
  'FROM THE SNOWFIELD: camera set low on open ground with the near surface a wide band across the bottom of the frame, the wall crossing the whole picture above it and the gatehouse turned three-quarters well off centre.',
];

const POOLS = {
  gatehouse: { mvp: 25, scale: 200, prompt: (n) => `You are writing ${n} GATEHOUSE descriptions for PixelBot's castle-town-gate path: the great gate of a classic-JRPG castle town, seen from OUTSIDE as a traveller arrives — the "you have reached the city" scene a 16-bit RPG paints for its title screen. Each entry LEADS WITH THE GATEHOUSE'S DEFINING MASS (the single biggest built shape in the picture) and then sets it in the wall and on the ground. 35 to 55 words.

THE DEFINING MASS LEADS THE SENTENCE. Flux paints whatever noun is named first, so the first thing in the body is the gatehouse's biggest shape, named as a MASS: "a great square gatehouse of honey stone", "one fat round drum tower with the arch cut through its foot", "a tall timber-framed gate-house with a steep tiled roof pulled low over it". An entry that opens with a side detail (a lamp, a cat, a cart) makes the side detail the hero and the gate disappears.

NAME THE MASSING EXPLICITLY, because a family of similar shapes collapses into one Flux prior: a square block, a fat round drum, a tall thin needle tower, a long low range, a stepped pyramid of stone, a twin-arched mass with one arch bricked up, a gate built into the base of a cliff, a gate-house standing on stilts over water. Cap any one shape family at three entries in the ${n}.

${CROSSWISE}

${BAR}

CONCRETE SHAPES A PIXEL ARTIST LOVES TO DRAW: great blocks of stone in uneven courses; a steep tiled roof with a little hat on its ridge; three towers of three different heights, the smallest well off to one side; a row of square stone teeth along the top with one tooth missing; timber framing painted in bright colours; a walkway along the top of the wall with figures side-on along it; narrow slit windows with lit rooms behind them; a heavy iron lattice gate with its portcullis bars half-raised and stopped; two great timber doors standing wide open flat against the wall; a small low door cut into one of the big doors, standing open with warm light coming out; a drawbridge hauled up flat against the stone; a stone bridge crossing the moat and running out of one side edge of the frame.

EVERY ENTRY CARRIES ONE CHARM DETAIL that makes it that gate and no other, and it is a made or carved THING, never a live creature: a fat stone lion's head jutting right out over the arch with real moss growing in its open mouth; a stone bear crouched on one gatepost with its nose worn smooth; a great bronze bell hung in the arch on a timber yoke; the enormous wooden wheel and rope that lifts the iron gate, out in plain view on the wall's face; a spout high on the wall pouring a bright thread of rainwater down into a stone trough; a crooked tree grown straight out of a crack forty feet up; a beehive of straw tucked into a niche; one tower with a whole dovecote built onto its side; a small shrine with a bowl of flowers set into the stone beside the arch; a rope-and-basket hoist running from an upper window down to the ground; a chimney with its own tiny tiled hat; a boot-scraper worn into a groove by a century of boots; a row of copper pans hung by the little door; a stone fish spitting water into a puddle.

VARIETY MANDATE, distribute the ${n} across: 4 THE GREAT SQUARE GATEHOUSE (one big square mass of fitted stone with the arch cut through it, a steep tiled roof over the top, the wall running out of frame both sides from its flanks), 4 THE DRUM-TOWER GATE (one fat round tower with the archway cut through its foot and a conical tiled roof, a smaller drum standing well off to one side at a different height), 3 THE TIMBER-FRAMED GATE-HOUSE (a tall bright-painted timber-framed house built over the arch, its upper floors leaning out over the ground, the stone wall running out of frame from each side), 3 THE LONG LOW RANGE (a long low gate-range of stone and timber with the arch at one end of it, the town's roofs stepping up behind, the range crossing the whole picture), 3 THE CLIFF GATE (the arch and its gatehouse built straight into the foot of a great rock face, the wall running along the cliff's base and out of frame, the town's roofs showing on top), 3 THE WATER GATE (a gatehouse standing on stone piers in shallow water with the arch opening onto it, a bridge crossing the water and running out of one side edge of the frame), 3 THE TWIN-ARCHED MASS (a wide gatehouse with two arches side by side, one of them long since bricked up and grown over with ivy and used as a lean-to), 2 THE STEPPED STONE GATE (a mass of stone stepping back in three uneven stages above the arch, a walkway along each step with figures side-on along them).

${WALLCARRY}
${NOMARK}
${JARGON}
${SIMILE}
${AXISNOTE('the gatehouse, its mass, its wall, its charm detail, what its stone faces carry, and the crosswise geometry', 'the travellers and their carts, the story beat happening now, the light and the time of day, the town roofs showing above the wall, the air, animals and the palette')}
${IRREGULAR}
${PIXELMAT}
${TONE}
${WELCOME}
${GUARD}
${NAMES}
ANTI-DULLNESS: a grey stone arch in a grey stone wall is too plain to use. Every entry has one big named mass, a charm detail, real colour, and something the eye can climb.
${CLEAN}
Examples: "THE SQUARE GATEHOUSE AND THE MOSSY LION: a great square gatehouse of honey-coloured stone in uneven flat-banded courses, its wide arch off to one side of the picture and turned three-quarters, the long wall running out of frame past both of its flanks, the ground a wide band of trodden earth across the bottom, ivy up one whole flank to the square stone teeth along the top, and a fat carved stone lion's head jutting right out above the arch with real moss growing in its open mouth"; "THE DRUM TOWER AND THE GREAT WHEEL: one fat round drum tower of pale stone with the archway cut through its foot and a steep conical roof of blue tiles on top, a smaller drum standing well off to the other side and plainly shorter, the wall crossing the whole picture and running out of frame both ways, window boxes of scarlet flowers at uneven heights, and the enormous timber wheel and rope that lifts the heavy iron lattice gate mounted out in plain view on the stone"; "THE LEANING TIMBER GATE-HOUSE: a tall timber-framed gate-house painted ox-blood and cream standing over the arch, its upper floors leaning out above the ground on carved beam-ends, the stone wall running out of frame from each flank, the near ground a band of wet cobbles crossing the bottom of the frame, a crooked plum tree grown out of a crack high up, and a rope-and-basket hoist running down from one upper window".
${FMT}` },

  arrival_moment: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} ARRIVAL-MOMENT descriptions for PixelBot's castle-town-gate path: the one small story beat happening RIGHT NOW at the gate, mid-action. This is the axis that makes the picture an ARRIVAL instead of an architecture study, and it runs on every render. 16 to 34 words.

EVERY BEAT NAMES ITS ACTOR AS A WHOLE FIGURE. A named action with no named actor renders a giant disembodied hand or arm — this has cost real renders twice. So write "a small sprite figure in a wide hat", "two small figures at the near cart", "a guard with a long pole", never "a hand held out" or "an arm raised".

${BAR} ADVENTUROUS IS THE POINT HERE: something is caught mid-air, mid-lift, mid-topple, mid-wave, mid-pour. A parked, posed or merely pleasant beat is unusable.

EVERY BEAT IS READABLE IN A SILHOUETTE. It has to be legible in chunky pixels from across the open ground, so it is a big simple shape doing a big simple thing.

VARIETY MANDATE, distribute the ${n} across: 5 THE GATE ITSELF DOING SOMETHING (the heavy iron lattice gate stopped half-raised while two small figures at the great wheel lean on the spokes; the two big timber doors being pushed wide by a small figure at each; the drawbridge coming down with a small figure at the winch; the little low door in the big door swinging open and a small figure stepping out with a lamp; the bell in the arch being rung by a small figure hauling on its rope with both arms), 5 SOMEONE STUCK, PLAYFUL (a merchant's cart wedged sideways in the archway with its load leaning, a scatter of small figures waiting behind it and one guard plainly pretending not to notice; a hay wagon a hand too tall for the arch with three small figures hauling the top sheaf off; a big load of pots slid half off a cart and a small figure diving to catch the top one; two carts nose to nose in the arch with neither backing up; a barrel escaped and rolling away across the ground with a small figure running after it), 5 LAMPS, SMOKE AND WATER (a guard with a long pole lighting the lamps along the wall, the near half lit and the far half still dark; a small figure on the wall walkway hauling a basket up on a rope; a chimney on the gatehouse catching and a fat white plume going straight up; water pouring hard out of the high wall spout after rain and splashing into the trough where two small figures are playing in it; a small figure sluicing a bucket of water across the cobbles under the arch), 5 ARRIVING AND LEAVING (a loose scatter of travellers reaching the ground in front of the gate, spread across the frame, the nearest waving up at the wall; a cart rolling out of the arch and turning away along the wall and out of one side edge; a rider on a tall long-legged flightless bird coming up to the gate, the bird's head turning to look at the camera; a small figure at the arch pointing out the way for a traveller with a pack; a whole family's cart being waved through by a guard who is also eating), 5 THE WALL JOINING IN (a shutter flung open high in the gatehouse and a bright room showing behind it; a small figure leaning over the parapet lowering a little basket on a string to someone below; laundry being hauled in fast along a line strung between two towers; a small figure on the walkway dropping a rope down to a cart; a tray of bread being handed up on a pole to a guard on the wall).

${AXISNOTE('the one thing happening right now and the whole figures doing it, in one short sentence', "the gatehouse's mass and its towers, the colours and count of its cloth strips, how many lamps burn, its carved stone animals, what its wall faces carry, the travellers standing about, the light, the town roofs above the wall, the air, free animals and the palette")}
KEEP IT SHORT AND KEEP IT TO THE BEAT. The entry is 16 to 34 words and it names ONE action and its actors, plus at most one object that action needs. It does NOT describe the gate, its towers, its cloth, its lamps or its carvings — those are other axes and naming them here contradicts whatever they rolled. ONE ruler phrase is welcome where the beat needs a scale ("the figure reaching only to the bottom hinge of the great door"), and never more than one.
${ACTOR}
${NOTEXT_SHORT}
${JARGON}
${TONE}
${WELCOME}
${GUARD}
${NAMES}
${CLEAN}
MOTION WORDS: things swing, lift, hang at the top of a throw, tip, lean, pour, wave, haul, roll, slide, spill, come down, go up. Rushing, sweeping, swirling, streaming and blasting are absent, and so are ribbons, bars and columns of anything.
Examples: "THE CART WEDGED IN THE ARCH: a merchant's cart wedged sideways in the archway with its load leaning right over, a scatter of small sprite figures waiting behind it and one guard plainly pretending not to notice"; "THE LAMPS HALF LIT: a guard with a long pole lighting the lamps along the wall, the near half of them burning gold and the far half still dark, a small figure below watching with a bundle on its back"; "THE SPOUT AFTER RAIN: water pouring hard out of the high wall spout and splashing into the stone trough below, two small figures playing in the splash and a third holding a bucket out into it".
${FMT}` },

  travellers: { mvp: 25, scale: 100, prompt: (n) => `You are writing ${n} TRAVELLER descriptions for PixelBot's castle-town-gate path: the people and carts and pack animals out on the ground in front of the gate. This axis does TWO jobs at once — it is what makes the picture an arrival, and it is the RULER that proves how big the gate is. 35 to 55 words.

EVERY ENTRY NAMES THREE OR FOUR DISTINCT SILHOUETTES and spreads them ACROSS the frame at clearly different distances. A line of figures one behind another into the distance is the worst possible arrangement here: it is the tiling failure and the corridor failure at once. They are scattered across the open ground, bunched in one place and thin in another, some overlapping, one well off to the side and tiny at the wall's foot.

${SIZE}

${BAR} Reach for the surprising traveller every time. "A man walking toward the gate" is the obvious version and is unusable.

SILHOUETTES TO DRAW FROM AND GO BEYOND (mix three or four per entry, never list all of these): a figure under a stack of woven baskets taller than itself; a hooded figure with a long walking staff and a small dog; a cart heaped with green-and-gold melons riding so low its axle nearly drags; a tall long-legged flightless bird with a saddle and bright tail plumes, led on a rein; a shaggy ox with a bell hauling a timber sledge; a figure in an enormous round flat hat leading three goats; a tinker's cart hung all over with copper pans that clank; a pair of small figures carrying one long pole with a slung bundle between them; a flock of geese driven along by a figure with a switch; a covered wagon with its hoops and its canvas patched in five colours; a figure wheeling a barrow of firewood; a low flat sledge hauled along by a figure leaning into its rope; a pilgrim in a pale cloak with a gourd at the belt; a figure carrying a birdcage as big as itself; a laden pony with panniers of cabbages; a figure pushing a handcart of bright cut flowers; a beekeeper's cart of straw hives; a little pony-trap with a bright striped hood; a figure with a tall pack-frame stacked with rolled mats; a donkey nearly invisible under bundles of firewood.

PACK AND RIDDEN ANIMALS ARE PART OF A TRAVELLER'S SILHOUETTE and belong in this axis. They are always attached to a figure, a cart or a rein, and they are always at figure scale (measured against the same ruler). Free wild creatures with nobody attached belong to another axis and are absent here.

ARRANGEMENT: the group is uneven and off-centre. Carts sit at different angles, one turned broadside. ONE of the named silhouettes is the nearest and biggest, and it is still only as tall as the ruler says — it gets no more description than the others.

${AXISNOTE('the travellers, their carts, their loads, their pack and ridden animals, their arrangement on the ground and the ruler that measures them', 'the gatehouse and its stone, the story beat happening now, the light, the town roofs above the wall, the air, free animals and the palette')}
${NOMARK}
${JARGON}
${IRREGULAR}
${PIXELMAT}
${TONE}
${WELCOME}
${GUARD}
${NAMES}
${CLEAN}
Examples: "THE MELON CART, THE BASKET TOWER AND THE BIRD: nearest and biggest a cart heaped with green-and-gold melons riding so low its axle nearly drags, its wheel standing as high as a figure's shoulder; angled away from it a small figure under a stack of woven baskets taller than itself; and well off to one side a tall long-legged flightless bird with a saddle and bright tail plumes led on a rein, each figure about as tall as three of the wall's own stone courses"; "THE GEESE, THE TINKER AND THE SLEDGE: a loose flock of geese driven across the ground by a small figure with a switch, a tinker's cart hung all over with copper pans standing at an angle behind them, and a shaggy ox hauling a timber sledge tiny right at the wall's foot, the arch rising about eight figures high above them all"; "THE PATCHED WAGON AND THE POLE-CARRIERS: a covered wagon with its hoops and its canvas patched in five colours standing broadside on the near ground, two small figures carrying one long pole with a slung bundle between them passing in front of it, a laden pony with panniers of cabbages small and well off to the side, a figure reaching only to the bottom hinge of the great door".
${FMT}` },

  wall_life: { mvp: 25, scale: 100, prompt: (n) => `You are writing ${n} WALL-LIFE descriptions for PixelBot's castle-town-gate path: WHAT THE GREAT STONE FACES CARRY. This is the most load-bearing axis in the path and it does two jobs at once — it is the anti-lettering lever and it is the best set dressing in the picture. 25 to 45 words.

${WALLCARRY}

${BAR} This axis is where the charm lives. Every entry is something a player would zoom in on.

THE SPACE DIRECTLY ABOVE THE ARCH IS NAMED IN EVERY SINGLE ENTRY, and it always has a real solid three-dimensional thing on it or hanging across it. That rectangle of stone is the most inviting empty space in the whole picture and an empty one grows pseudo-lettering. Good things to put there: a fat carved stone lion's head jutting out with moss in its open mouth; a great bronze bell on a timber yoke; a row of round paper lanterns strung right across it; a hanging bough of pine weighed down with snow and icicles; a stone owl with lichen on its shoulders; a bundle of bright drying flowers as wide as a figure; a shallow stone bowl of water with birds in it; a carved wooden beam-end shaped like a curling fish; a nest of sticks with a long-legged bird standing in it; snow heaped a foot deep along the ledge above it; a wooden hoist arm with a rope and hook swinging from it.

VARIETY MANDATE, distribute the ${n} across: 4 GREEN THINGS ON THE STONE (ivy up one whole flank in a lopsided sheet to the square stone teeth; window boxes crammed with flowers at uneven heights on every ledge; a crooked tree grown out of a crack high up with its roots spread flat across the face; moss and small ferns in every joint on the shaded side), 4 THINGS HUNG AND STACKED AGAINST IT (firewood stacked to a figure's shoulder with a cat asleep on top; nets, baskets and copper pans on iron hooks; hanging bundles of drying herbs and onions in long strings; rolled mats and a ladder leaning where they were left), 4 WATER ON THE WALL (a spout high up pouring a bright thread of rainwater down into a stone trough; two carved stone fish curled round a spout with the water coming out between them; wet dark streaks down the stone under every ledge with a bright puddle below; icicles in a ragged fringe under the walkway with the drip-marks dark below them), 4 FIRE AND LAMPS ON IT (iron lamps on brackets at uneven heights, some lit and some dark; a brazier burning low in a niche with a kettle beside it; a row of round paper lanterns strung along under the arch; narrow slit windows with a warm orange glow coming out of every one of them), 4 SMALL BUILT THINGS ADDED TO IT (a wooden stair zigzagging up the outside; a dovecote built onto one tower's side with birds going in and out; a straw beehive tucked into a niche; a rope-and-basket hoist running from an upper window down to the ground; a small shrine with a bowl of flowers set into the stone), 3 SNOW AND WEATHER ON IT (snow heaped a foot deep on every ledge and along the roof with warm light coming out of the slits beneath; a long drift banked up against the wall's foot with a shovelled path cut through it; every surface wet and dark after rain with the colours gone deep), 2 THE WORKING GEAR IN PLAIN VIEW (the enormous timber wheel and rope that lifts the heavy iron lattice gate, mounted right out on the stone face; a great counterweight of banded stone hanging in a timber frame).

${NOMARK}
${JARGON}
${SIMILE}
${AXISNOTE("the wall's own stone faces and what they carry, and the stone's own pixel construction", 'the gatehouse mass and its geometry, the travellers, the story beat, the light and the time of day, the town roofs above the wall, the air, free animals and the palette')}
${IRREGULAR}
${PIXELMAT}
${TONE}
${WELCOME}
${GUARD}
${NAMES}
${CLEAN}
Examples: "IVY AND THE MOSSY LION: ivy gone up one whole flank in a lopsided sheet right to the square stone teeth along the top, the honey stone in uneven flat-banded courses where it shows through, and above the arch a fat carved stone lion's head jutting right out with real moss growing in its open mouth"; "THE SPOUT AND THE TROUGH: a stone spout high on the wall pouring a bright thread of rainwater down into a worn stone trough at the foot, wet dark streaks in flat pixel bands down the stone beneath every ledge, copper pans on iron hooks beside the little door, and a shallow stone bowl of water above the arch with two small birds in it"; "SNOW AND THE ORANGE SLITS: snow heaped a foot deep along every ledge and the roof with icicles in a ragged fringe beneath the walkway, a warm orange glow coming out of every narrow slit window, and a hanging bough of pine weighed down with snow strung right across the stone above the arch".
${FMT}` },

  town_above: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} TOWN-ABOVE descriptions for PixelBot's castle-town-gate path: what shows OVER the wall, which is this path's payoff — the city the traveller has arrived at, glimpsed above the parapet. Shapes and structure only. 22 to 40 words.

EVERY ENTRY CARRIES A FEATURE. This band stands in for the sky in this picture, so a plain flat ridge of roofs makes the whole frame boring. Name something to look at: roofs stepping up a hill in uneven jumps; one tall tower standing higher than everything with a little hat on it; a big soft dome in green copper; smoke from a hundred chimneys with the warm light on its underside; a kite up on a string over the roofs; a great tree taller than the houses; washing strung between two upper windows in flat blocks of colour; a flock settled all along a ridge; a dovecote; a windmill's sails just showing; a rooftop garden with a figure side-on in it; the tops of two more walls stepping up behind the first.

THE TOWN STANDS IN A BAND ACROSS THE PICTURE and its roofline steps and juts unevenly. The band runs out of frame on both sides. Nothing in it converges, tapers to a point, or leads the eye away toward a far point, and no street shows running away between the buildings.

VARIETY MANDATE, distribute the ${n} across: 4 ROOFS STEPPING UP A HILL (tiled roofs climbing away behind the wall in uneven jumps, each one a different colour, the highest with a little tower on it), 4 ONE THING STANDING HIGHER (a tall slim tower with a tiled hat rising well off to one side above everything; a fat green copper dome; a windmill's sails just showing over the parapet; a great tree taller than every roof), 4 SMOKE AND CHIMNEYS (a hundred chimneys with smoke standing straight up in the cold and the warm light catching its underside; smoke all leaning one way; a fat plume from one big chimney going up past a tower), 3 THINGS UP IN THE AIR OVER THE TOWN (a kite up on a long string above the roofs; a flock of birds turning all together over one gable; a scatter of small paper lanterns rising; two flags of washing strung between upper windows in flat blocks of colour), 3 WALLS BEHIND WALLS (the tops of a second and a third wall stepping up behind the first with towers on each, each band a paler colour than the one in front), 3 ROOFTOP LIFE (a rooftop garden with pots and a small figure side-on in it; a dovecote on a ridge with birds going in and out; a row of beehives on a flat roof), 2 THE TOWN'S OWN WATER (a tall waterwheel turning against a wall behind the gate with its splash caught as chunky pixel spray; a stone aqueduct crossing behind the roofs and running out of one side edge), 2 SETTLED BIRDS (a long row of white birds settled all along one ridge; a big nest of sticks on a chimney with a long-legged bird standing in it).

${AXISNOTE('the town showing above the wall, its roofline, its towers, its smoke and what is in the air over it', 'the gatehouse mass and the wall itself, the travellers, the story beat, the light and the time of day, the colours of the light, the air, free animals on the ground and the palette')}
${NOMARK}
${JARGON}
${SIMILE}
${SMOKEPLUME}
${IRREGULAR}
${PIXELMAT}
${TONE}
${WELCOME}
${GUARD}
${NAMES}
${CLEAN}
Examples: "ROOFS UP THE HILL AND THE LITTLE TOWER: tiled roofs climbing away behind the wall in uneven jumps, each one a different flat colour of blue and rust and jade, the highest of them carrying a slim tower with a tiled hat on top, the whole band running out of frame both sides"; "A HUNDRED CHIMNEYS: a hundred chimneys standing above the parapet with their smoke going straight up in the cold air and the warm light catching its underside, the roofline stepping and jutting unevenly, one fat plume rising past a squat tower well off to one side"; "THE KITE OVER THE GABLES: steep gables crowding up behind the wall in a band with washing strung between two upper windows in flat blocks of colour, and one paper kite up on a long string high over them all".
${FMT}` },

  gate_light: { mvp: 25, scale: 100, prompt: (n) => `You are writing ${n} LIGHT descriptions for PixelBot's castle-town-gate path: the light over the whole gate and the ground in front of it, and the time of day it commits to. Each entry stacks TIME OF DAY + SOURCE + DIRECTION + THE COLOUR OF THE LIGHT + WHAT THE STONE DOES WITH IT + HOW SHADOWS FALL. 20 to 36 words.

THIS AXIS OWNS THE MOOD, SO IT COMMITS. Every entry names a specific time of day and a specific colour of light. Flat, even, bleached, grey, overcast, colourless and featureless light is unusable, and so is any entry a viewer would call tasteful.

EVERY ENTRY CARRIES TWO NAMED COLOURS PITTED AGAINST EACH OTHER, one of them warm or saturated. A single warm accent against a cool field is the whole trick, and a frame in one hue reads as a flat monochrome wash. So: warm lamp gold against deep blue dusk, hot apricot sun against violet shadow, honey stone against a bruised storm sky, cold blue snow-light against a hundred small orange windows.

THE STONE IS MOST OF THE FRAME, so every entry says what the light does ON it: raking across the courses so every block casts its own small shadow, flooding one flank in honey while the other goes deep violet, picking out the wet streaks under the ledges, going soft and blue in the arch's shadow, turning the tiles to hot copper.

VARIETY MANDATE, distribute the ${n} across: 5 LAMP-LIT DUSK (this path's signature: deep blue dusk over the roofs with the wall's iron lamps and a hundred small warm windows coming on, the arch full of warm shadow, the cobbles catching each lamp in flat pixel bands), 4 LOW GOLDEN LATE AFTERNOON (hot low sun coming in from one side, one flank of the gatehouse in warm honey and the other in violet shadow, long cart and figure shadows reaching right across the ground band), 4 BRIGHT HIGH MORNING (clean strong morning light, the stone bright and saturated, hard-edged shadows under every ledge and a deep cool shadow in the arch, the roof tiles hot), 3 FIRST LIGHT AND FROST (early pink-and-gold light just over the roofs with the ground still pale and blue, one brazier burning low and gold at the arch), 3 WARM RAIN LIGHT (soft bright light under a warm grey sky, every colour deep and wet, the cobbles dark and glossy-dark with the lamps already doubled in them), 3 SNOW-LIGHT (cold clear blue light over deep snow, the stone pale and the shadows lilac, small orange windows burning through it), 3 NIGHT AND THE BIG MOON (deep indigo night with a big soft moon low over the roofs, its light silver-blue on the snow or the stone, the gate's lamps burning gold against it), 2 STORM-BREAK LIGHT (a bruised violet sky with one bright hot break in it flooding the gatehouse while the ground stays deep teal and the roof tiles blaze), 2 MIST AT DAWN (warm gold breaking through a low mist so the wall's near flank is crisp and its far end goes soft and pale, one lamp still burning).

${AXISNOTE('the light, its time of day, its colours, and what the stone, the ground and the shadows do with it', 'the gatehouse and its mass, the travellers, the story beat, the town roofs above the wall, the air, animals and the specific palette list')}
${LIGHTOBJ}
${SMOKEPLUME}
${PIXELMAT}
${TONE}
${GUARD}
${CLEAN}
Examples: "LAMP-LIT DUSK ON THE STONE: deep blue dusk over the roofs with the wall's iron lamps and a hundred small warm windows coming on, the archway full of warm orange shadow, each lamp doubled in flat pixel bands on the wet cobbles below"; "LOW GOLD FROM ONE SIDE: hot low late-afternoon sun coming in from one side, one flank of the gatehouse flooded warm honey and the other dropped to deep violet, the carts and figures throwing long shadows right across the bright trodden ground"; "COLD BLUE SNOW-LIGHT: clear cold blue light over deep snow, the stone gone pale lilac and every shadow lilac with it, and a hundred small hot-orange windows burning through the wall's slits and the roofs above".
${FMT}` },

  gate_life: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} GATE-LIFE descriptions for PixelBot's castle-town-gate path: the free creatures in and around the gate, an accent and never the hero. 12 to 26 words. This is the ONLY axis on this path that names a FREE creature with nobody attached to it (pack and ridden animals belong to the travellers axis).

EVERY ENTRY SAYS ITS SIZE OR ITS DISTANCE, because an animal entry with no size word renders at hero scale. Write "small", "tiny in the frame", "small and side-on", "at the far side".

EVERY ENTRY'S PERCH IS SOMETHING EVERY GATE HAS — the archway's shadow, the wall's foot, the stone teeth along the top, the trodden ground, a step, a slit window, a lamp bracket, a trough, a cart's tail, a roof ridge, the moat water. A perch that only some gates have contradicts whatever gate rolled.

${BAR} Reach for the charming surprise: a creature that is plainly unbothered by the entire arrival is funnier and better than a creature doing nothing.

VARIETY MANDATE, distribute the ${n} across: 5 A CAT, UNBOTHERED (a small cat sitting dead centre in the shadow of the great opening, plainly unbothered by the whole arrival; a small cat asleep on a sunny stone at the wall's foot; a cat stretched along a warm ledge above the arch, tiny in the frame; a small cat sitting upright on a cart's tail watching the gate; a cat with one paw down a drain hole cut low in the wall), 5 BIRDS ON THE STONE (a long row of small white birds settled all along the square stone teeth; two fat pigeons small on a lamp bracket; a nest of sticks crammed into a slit window with a small head showing; a flock lifting off the parapet all together, small against the roofs; a long-legged bird standing on one leg on the roof ridge, small and still), 4 DOGS AND SMALL BEASTS ON THE GROUND (a small dog flat out asleep in the exact middle of the way through; a scruffy dog small and side-on trotting along the wall's foot with something in its mouth; three small ducks crossing the trodden ground in a wobbly line; a goat small and side-on up on the drift against the wall eating something it should not), 4 THINGS IN AND AT THE WATER (three big bright carp holding still in the moat water at mid-distance, their shapes clear below the surface; two small ducks tipped tail-up beside the stone; a heron lifting off low across the water, small; a turtle small on a stone at the water's edge), 3 HIGH AND HIDDEN (a small fox sitting up on the wall's walkway at the far end, tiny in the frame; a small striped cat halfway up the outside stair; a family of small swifts turning round one tower, each a dash).

${AXISNOTE('one free animal presence, small and at a distance, on a perch every gate has', 'the gatehouse and its stone, the travellers and their pack animals, the story beat, the light, the town above the wall, the air and the palette')}
${SIMILE}
${TONE}
${WELCOME}
${GUARD}
${NAMES}
${CLEAN}
Examples: "THE CAT IN THE OPENING: a small cat sitting dead centre in the shadow of the great opening, plainly unbothered by the whole arrival going on around it"; "THE ROW ON THE TEETH: a long row of small white birds settled all along the square stone teeth at the top of the wall, each one a few pixels"; "THE DOG IN THE WAY: a small dog flat out asleep in the exact middle of the way through, side-on and tiny against the stone".
${FMT}` },

  air: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} AIR descriptions for PixelBot's castle-town-gate path: what the AIR itself is doing over the ground in front of a great city gate. 14 to 28 words. This is the axis that gives the arrival its depth and haze.

VARIETY MANDATE, distribute the ${n} across: 6 DUST AND SMOKE OFF THE GROUND (a low warm dust hanging over the trodden ground where the carts have passed and softening the wall's far end; a fat plume of chimney smoke standing straight up past the roofs; a low blue haze of cooking smoke lying along the wall's foot; dust motes turning slowly in the lit places; thin smoke leaning all one way over the roofs; a warm haze hanging over the whole arrival and softening the town above to flat bands), 5 LAMP AND DUSK HAZE (the air soft and warm so every lamp wears a gentle bloom; a faint golden haze thickening the depth into flat steps; the far end of the wall going soft and pale while the near stone stays crisp; a dusty gold air with the light sitting in it; the air gone rosy and soft between the lamps), 5 CLEAN BRIGHT AIR (the air washed clean and bright so every far roof tile and window slit is crisp and hard-edged; a sharp clarity all the way along the wall; clean air with the colours at their most saturated; a fresh brightness with every pixel edge readable; cold clean air and hard little shadows), 5 RAIN AND ITS AFTER (a light warm rain stippling the cobbles in fine pixel dots with the colours going deeper; the last of a shower easing off and the puddles still ringed all over; fat slow drops landing and each making one bright ring; water running off the ledges in bright threads; the air still wet and everything saturated, one bright break showing), 4 SNOW AND MIST (fat slow snowflakes coming down in flat pixel dots and settling on every ledge; a low white mist lying on the ground and hiding the wall's foot; a soft veil lifting off the water and fading before the parapet; fine dry snow lying in the joints of the stone and along every ledge).

${AXISNOTE('the air only', 'the gatehouse and its stone, the travellers, the story beat, the light and its colours, the town above the wall, animals and the palette')}
${SMOKEPLUME}
MOTION: steam and smoke stand, lift, pour up, thin and pool; smoke lies, leans and drifts; haze hangs, thickens and softens; mist lies, lifts and fades; rain stipples, dimples, lands and rings; snow drifts down, settles and lies. Rushing, sweeping, swirling, streaming, blasting and billowing are absent, and so are ribbons, bars, columns and walls of anything.
${TONE}
${GUARD}
${CLEAN}
Examples: "CART DUST ON THE GROUND: a low warm dust hanging over the trodden ground where the carts have passed, the far end of the wall going soft behind it"; "FAT SLOW SNOW: fat slow snowflakes coming down in flat pixel dots and settling along every ledge and in the joints of the stone".
${FMT}` },

  palette: { mvp: 25, scale: 40, prompt: (n) => `You are writing ${n} PALETTE harmonies for PixelBot's castle-town-gate path: a named harmony of 3 to 5 colours for a limited-palette pixel-art scene of a great city gate at the end of a long road. 10 to 24 words, colour and light words ONLY (nouns of things, places, stone, walls, ground and towns are absent). Every entry ends by attaching its brightest accent to the LIGHT, in this shape: "..., hot marigold only in the lit places".

EVERY ENTRY IS SATURATED AND COMMITTED, and every entry pits a WARM against a COOL. Vivid is literal here: a muted, dusty, washed-out, greyed or tasteful harmony is unusable. Great stretches of the frame are stone and ground, so the accent has to be hot enough to sing against them.

DISTINCTNESS IS THE #1 RULE: every entry names a DIFFERENT set of colour words. Two entries may share at most ONE colour word between them. Reordering the same four colours into a new sentence counts as a duplicate and is unusable — reach for a new part of the colour vocabulary each time.

COLOUR VOCABULARY to draw from (mix freely, and invent neighbours of these): honey, amber, marigold, saffron, butter, cream, ivory, bone, chalk white, pearl, oatmeal, sand, ochre, umber, walnut, russet, terracotta, brick red, rust, ember orange, tangerine, apricot, peach, coral, salmon, vermilion, scarlet, deep red, rose, blush, magenta, fuchsia, plum, mauve, lilac, violet, periwinkle, indigo, navy, blue-black, slate, pewter, teal, turquoise, aqua, cyan, cerulean, cobalt, sapphire, jade, emerald, viridian, moss, olive, chartreuse, pistachio, mint, charcoal, near-black.

VARIETY MANDATE, distribute the ${n} across these FAMILIES (the family names the MOOD of the harmony, not its words — choose the words yourself and vary them entry to entry): 5 HONEY STONE AND BLUE DUSK (the warm stone range against a deep cool sky, with one small burning warm in the lit places), 5 SUNSET ON THE WALL (the hot end of the range against one deep cool shadow colour), 4 BRIGHT MORNING ARRIVAL (the clean high-key end, saturated and fresh, with one deep accent), 4 SNOW AND ONE HOT WINDOW COLOUR (pale cools and lilacs carrying one fully saturated hot hue), 4 NIGHT AND ONE SATURATED COLOUR (blue-blacks and charcoals carrying one fully saturated hue), 3 WET AND DEEP (the rain-soaked end, every colour a step deeper, with one bright highlight). The brightest accent must also vary across the pool: hot marigold, scarlet, warm honey, tangerine, magenta, coral, white-hot cream, pale rose, saffron, ember orange.
${CLEAN}
Examples: "HONEY AND BLUE DUSK: honey, ochre, indigo, pearl, hot marigold only in the lit places"; "SNOW AND ONE HOT WINDOW: pearl, lilac, periwinkle, pewter, tangerine only where the windows burn"; "WET MORNING ARRIVAL: teal, chartreuse, cream, russet, scarlet only in the lit places".
${FMT}` },
};

(async () => {
  // camera is hand-authored — written verbatim, never generated.
  if (!only || only === 'camera') {
    const out = `${DIR}pixelbot_castle_town_gate_camera.json`;
    fs.writeFileSync(out, JSON.stringify(CAMERA, null, 2));
    console.log(`✍️  hand-authored ${CAMERA.length} entries → ${out}\n`);
  }
  for (const [slot, cfg] of Object.entries(POOLS)) {
    if (only && only !== slot) continue;
    await generatePool({ outPath: `${DIR}pixelbot_castle_town_gate_${slot}.json`, total: SCALE ? cfg.scale : cfg.mvp, append: SCALE, batch: 25, maxTokens: 8000, metaPrompt: cfg.prompt });
  }
})().catch((e) => { console.error(e); process.exit(1); });
