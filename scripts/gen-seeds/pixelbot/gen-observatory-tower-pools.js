#!/usr/bin/env node
/**
 * PixelBot observatory-tower — bespoke pools (PIXELBOT_SCENES_PLAN.md §3.x shape,
 * built off castle-town-gate, the most recently hardened recipe set on this bot).
 * THE INSIDE OF AN ASTRONOMER'S TOWER IN A CLASSIC-JRPG WORLD: the great brass
 * telescope standing on the boards, the dome's long slot cranked open on real
 * night sky.
 *
 * ── THE GAP (audited entry by entry in the seeds, not assumed) ───────────────
 * PixelBot has 15 scene paths. Three are interiors — `volcano-forge` (a MASS of
 * fire and iron), `ice-cavern` (a MASS of ice) and `pixel-cozy-room` (a nest).
 * Nothing on the bot is about KNOWLEDGE or INSTRUMENTS, and nothing is an
 * interior that OPENS TO THE SKY. The nearest neighbours, checked in the pools:
 *   - `classic-jrpg` has literal observatory-deck locales ("observatory deck,
 *     scholar hero mid-stride adjusting massive telescope pointed skyward,
 *     constellation-chart spread on table") — but it is an IN-GAME gameplay
 *     screenshot on the old `pixels` medium with chaos ON, and it is saturated
 *     with the exact "constellation-chart / star-charts" text magnets this path
 *     deletes. `cozy-rpg-town` and `pixel-horror` (a shattered telescope, a
 *     broken astrolabe) are the same story in other registers.
 *   - `pixel-cozy-room` is the REAL collision and the pool proves it: 200 room
 *     entries include four STARGAZER ATTIC / STARGAZER LOFT entries with "a
 *     copper telescope propped on a three-legged stool" and "a round window cut
 *     into the roof slope", plus ~30 curved TOWER rooms with porthole windows.
 *     In every one the telescope is a PROP in a quilt-and-teapot nest and the
 *     opening is a closed window. Here the instrument is the HERO MASS, the
 *     opening is a SLOT STANDING OPEN with weather coming in, and the register
 *     is a working room of brass and timber. So this file BANS cozy-room's
 *     signature nouns outright (bed, quilt, patchwork, teapot, cushion, fairy
 *     lights, mushroom lamp, paint jars, easel) — see `SIBLING`.
 *   - `pixel-haunted-house` (seasonal) owns the observatory-topped haunted
 *     house from OUTSIDE; GothBot owns dread; StarBot owns space itself.
 *
 * ── THE FOUR DRIFTS, AND WHERE EACH LEVER LIVES ─────────────────────────────
 *
 * DRIFT 1 — TEXT. An observatory is the fleet's single highest text-risk
 * subject: star charts, almanacs, dials, graduated scales, labelled globes,
 * open books. Per lesson 12 a surface whose SHAPE is itself a text prior cannot
 * be described safely, only removed; per lesson 23 even the fleet's standard
 * "one small painted picture" move invents a signboard where the substrate is
 * not guaranteed visible; per lesson 27 deleting the noun is not enough because
 * an ABSENCE gets backfilled. So the noun class is DELETED from every layer
 * (this path deliberately does NOT use the shared `PICTORIAL_BLOCK`, which names
 * sign, poster and banner, and it never uses the "worn pictorial relief" formula
 * either — that formula is safe on stone and was a measured LIABILITY on ice),
 * and the space it leaves is FILLED by `room_dressing` and by lesson 36's
 * POSITION-COLOUR-COUNT LAW, which held 0 text in 26 renders on exactly this
 * subject on FaeBot. Information appears ONLY as the position, the colour or the
 * count of real solid objects: pins in the wall's own curving plaster, beads
 * slid up taut wires, pebbles laid out on the boards, holes pricked in a hide
 * held to the lamp, the sky doubled in a bowl of water. See `NOMARK`, `NOTEXT`.
 *   ⭐ ONE DELIBERATE DEPARTURE FROM THE BRIEF: no CORK BOARD and no PIN BOARD.
 *   Lesson 27's dividing line is whether the object's SHAPE is already a sign,
 *   and a flat rectangular panel fixed to a wall is exactly that. A tower's wall
 *   is CURVED, which structurally cannot read as a rectangle — so every pinned
 *   thing goes into the room's own curving plaster or into a beam, with the
 *   wall's curve reading behind it.
 *
 * DRIFT 2 — THE INTERIOR CAN VANISH (lesson 3, measured on this bot). The
 * Ultima-tile and HD-voxel looks carry an isometric-diorama prior that replaces
 * an enclosing room with a void or open sky, and camera words do not fix it —
 * NAMING THE ENCLOSING SURFACES does, and per ice-cavern you must also name
 * WHAT THEY ARE MADE OF. Here masonry is correct and wanted, so the enclosure is
 * named freely and materially: a curved stone or plastered wall cropped by both
 * frame edges, wide timber floorboards crossing the bottom, a dome of curved
 * timber ribs and boards overhead with ONE long slot open in it. Stated in every
 * `tower_room` seed, every `camera` entry, the template's first rule and
 * output-order item 2. The slot is also the only opening, written per lesson 10
 * as one camera seeing one continuous space (never two zones), which is what
 * beats the split-panel render.
 *
 * DRIFT 3 — FLAT LIGHT (lesson 30). An "outdoor sky" light entry on an interior
 * path is a flat-daylight generator: the room cannot show a midday sun, so Flux
 * renders flat ambient light and the palette goes pale. Every `lamp_light` entry
 * names a source that EXISTS IN THE ROOM and says WHAT ITS LIGHT LANDS ON. The
 * win condition is warm lamplight against the cold night coming in the slot, so
 * every entry commits a warm in-room source and the slot supplies the cool
 * counter — which is also ice-cavern's measured anti-monochrome lever (a warm
 * accent attached to the light put one in 15 of 15 renders).
 *
 * DRIFT 4 — THE JARGON TRAP (lesson 28). Astronomy vocabulary collides badly
 * with common objects and Flux renders the other object CONFIDENTLY: eyepiece,
 * mount (a documented fleet offender, and a horse to a layperson), tube,
 * objective, finder, declination, meridian, transit, armillary, orrery,
 * quadrant, azimuth, zenith, ephemeris. All banned in `JARGON` with the plain
 * replacement written out. TELESCOPE is KEPT and used freely, because it is the
 * layperson's word and its prior is correct — that is the shape of the measured
 * BrickBot fix, where one occurrence of "balloon" beside "envelope" was the
 * entire difference. The ring machine (an orrery) survives as an OBJECT
 * described in plain words and only inside `room_dressing`.
 *
 * Standing hazards this file is written against (each cost real renders on this
 * bot): light as an OBJECT (shaft / column / beam / ribbon / ring / halo);
 * "facet" as a low-poly prior; EVEN counts rendering a mirrored composition; a
 * life entry with no size word rendering hero-scale; two axes both supplying an
 * animal rendering both (so animals live ONLY in `room_dressing`); a camera
 * entry standing ON something the hero can roll; a camera entry describing a
 * narrow aperture rendering a peephole vignette; a posture verb in a camera
 * entry rendering a PERSON in that posture; a natural form described by a
 * likeness rendering the literal object.
 *
 * ── STRUCTURE, AND TWO DESIGNED DEPARTURES FROM THE SUGGESTED SPINE ─────────
 * HERO = `instrument`, not `tower_room`. ice-cavern's open residual is that a
 * hero pool naming CHAMBERS is all negative space, so four of five renders had
 * no readable hero and a dead upper half; volcano-forge works because its hero
 * is a MASS standing in a room. The telescope is the mass. `tower_room` is
 * therefore the ENCLOSURE axis, and output-order item 2 names the room FIRST and
 * the instrument as standing in it — volcano-forge's proven wording, which held
 * a readable hero AND an enclosed frame.
 * NO separate `air` axis and NO separate `charm` axis. The first-third budget is
 * zero-sum (lesson 34) and the shortest-prompt paths on this bot are the
 * best-scoring ones (volcano-forge 229 median PASS, cozy-room 217 PASS, against
 * ice-cavern 276 CLOSE and castle-town-gate 299 with late content lost at the
 * top end). On an interior the air's source IS the slot, so air facts live in
 * `sky_slot` and `lamp_light`; charm is REQUIRED inside `instrument`,
 * `reading_tool`, `room_dressing` and `observer_moment`. `sky_slot` takes the
 * freed slot as the money-shot axis, because the open dome is the path identity.
 *
 * 8 generated pools + 1 hand-authored (`camera`), axis-clean, positive-only.
 * MVP 25 each; --scale appends to production size.
 *
 * Run: node scripts/gen-seeds/pixelbot/gen-observatory-tower-pools.js [--only slot] [--scale]
 */
const fs = require('fs');
const { generatePool } = require('../../lib/seedGenHelper');
const DIR = 'scripts/bots/pixelbot/seeds/';
const SCALE = process.argv.includes('--scale');
const only = (() => { const i = process.argv.indexOf('--only'); return i >= 0 ? process.argv[i + 1] : null; })();

const FMT = `Format every entry exactly as 'CAPS TITLE: body' (a short capitalised title, a colon, then the body). Return ONLY a JSON array of strings.`;
const CLEAN = `POSITIVE ONLY: describe what is there; write no negations, no "no", no "never", no "without".`;

const BAR = `THE BAR (this outranks everything except the laws below): playful, adventurous, vivid, beautiful, clever. This is the splash screen a classic game shows for the astronomer's tower, the room a player is delighted to climb all those stairs to reach. Two acceptable outcomes for every entry: show something a person has never seen, or take something familiar and redress it as something more interesting. Ask of every entry "is this the obvious version of this idea, or the surprising one" and write the surprising one. VIVID IS LITERAL: saturated committed colour and dramatic light, never muted, washed out or tasteful-grey. CLEVER means ONE charm detail the eye finds on second look that makes it that tower and no other. ADVENTUROUS beats static: something is happening. A clean, correct, sober entry is a failure here — "a stone room with a telescope pointing at a window" is exactly the picture this pool exists to avoid.`;

const TONE = `TONE: warm, wondrous, cared-for and a little magical. This is a working room at the top of a tower in a storybook world, on a clear cold night: lamplight on brass, breath in the air, a cat, a ladder, the night coming in. Grime, squalor, ruin, abandonment, cobwebs, dust-sheets, dread, horror and menace are absent from every entry, and the words for them are absent too. Documentary realism, science photography and observatory-tourism realism are absent: this is a game's painted scene, not a photograph.`;

const NAMES = `NAMES: describe everything in plain visual terms. The names of real places, real cities, real countries, real observatories, real people, real companies, constellations, planets, stars, myths, gods, games, films and franchises are absent from every entry (so no Greenwich, no Palomar, no Uraniborg, no Orion, no Cassiopeia, no Saturn, no Galileo, no Hogwarts). Real-world ethnic and national labels are absent too; this is its own invented world.`;

// ── DRIFT 2: the load-bearing geometry ───────────────────────────────────────
const ENCLOSE = `THE ENCLOSURE LAW, and it is the single most important thing in this pool. Some pixel looks carry an isometric-diorama habit that drops a room's walls and puts the scene in an open void, and camera words do nothing about it — naming the enclosing surfaces and WHAT THEY ARE MADE OF is what works. So every entry states the room as a room:
 (a) THE CURVED WALL STANDS BEHIND EVERYTHING AND RUNS DOWN BOTH SIDES OF THE FRAME, cropped by the left edge and by the right edge, so the picture is closed in on both sides. Say what it is made of: thick rough granite blocks in uneven courses, curving whitewashed plaster over stone, bright painted timber posts and braces, pale sandstone in flat stepped bands, dark slate with lime mortar.
 (b) THE FLOOR CROSSES THE BOTTOM OF THE PICTURE FROM EDGE TO EDGE. Say what it is made of: wide worn timber floorboards running round the curve, flagstones with a timber ring set into them, boards with a great round timber trapdoor in them.
 (c) THE CEILING IS A DOME AND IT CLOSES THE FRAME OVERHEAD. Say what it is made of: curved timber ribs with boards between them, green copper sheets over timber ribs seen from underneath, painted plaster between dark ribs.
 (d) ONE LONG SLOT STANDS OPEN IN THAT DOME — a tall narrow opening running up the dome's curve with the real night sky showing through it, the dome's own timber reading all the way down BOTH sides of the slot. It is the ONLY opening to the outside in the picture, and everything outside the room is seen only through it, in the same one unbroken shot.
Write the geometry in those terms: "the curved stone wall standing behind it and running out of frame on both sides", "wide timber boards crossing the bottom of the frame", "a timber-ribbed dome closing it overhead with one long slot standing open in it". Absent from every entry: open sky filling the picture, an open-air platform, a roofless room, a terrace, a wall running away to a far point, a corridor, a stair receding into the distance, two separate zones or halves, anything converging, any apex, any vanishing point, any second window or door to the outside.`;

// ── DRIFT 1: delete the noun class, then fill the space; identity by
//    POSITION, COLOUR and COUNT (playbook lessons 12, 23, 27, 36) ────────────
const NOTEXT = `TEXT IS ABSENT AND THE OBJECT CLASS IS DELETED RATHER THAN DESCRIBED. This subject is the highest text risk on the whole fleet, and "blank" and "plain" are negations a picture cannot use — writing that a surface is blank ADDS the surface. So writing of every kind is absent, and so are the objects whose SHAPE is itself a writing or a device, whose NAMES are absent from the entry too: CHART, STAR CHART, MAP, DIAGRAM, TABLE (of numbers), ALMANAC, CALENDAR, LEDGER, BOOK, TOME, VOLUME, PAGE, PAPER, SHEET (of paper), NOTE, LETTER, SCROLL, PARCHMENT, MANUSCRIPT, NOTEBOOK, JOURNAL, LOGBOOK, BOOKCASE, BOOKSHELF, BOOK SPINE, PEN, QUILL, INK, LABEL, TAG, PLAQUE, PLATE (mounted), SIGN, SIGNBOARD, BOARD (as a panel on a wall), NOTICE, POSTER, BANNER, PENNANT, FLAG, CREST, COAT OF ARMS, EMBLEM, SIGIL, INSIGNIA, GLYPH, RUNE, SYMBOL, INSCRIPTION, ENGRAVED, ETCHED, STAMPED, CARVED LETTERING, SCRIPT, CHARACTERS, NUMERAL, NUMBER, DIGIT, DIAL, DIAL FACE, GAUGE, CLOCK, CLOCK FACE, SUNDIAL, SCALE, GRADUATED, CALIBRATED, MARKED, MARKINGS, GRADUATIONS, TICKS, COMPASS, COMPASS ROSE, WEATHERVANE, GLOBE, BLACKBOARD, CHALKBOARD, SLATE (as a writing surface), ABACUS.
A CORK BOARD, A PIN BOARD and ANY FLAT RECTANGULAR PANEL FIXED TO A WALL are absent too, and this is the measured reason: a flat rectangle on a wall IS a signboard shape to a picture, and it grows writing however it is worded. A tower's wall CURVES, and a curve cannot read as a rectangle — so anything pinned, hung or fixed goes straight into the room's own CURVING plaster or stone, or into a timber beam or rib, with the wall's own curve reading behind it. Floorboards, dome boards and a plank in a wall are fine: they are planks in a structure, not panels bearing anything.
Also absent: the words paint, painted picture, painting, mural, motif and pictorial when they describe imagery on a surface, and the "worn pictorial relief of a carved shape" formula this fleet uses elsewhere. That formula is safe on exterior stone and was measured as a LIABILITY indoors, where it renders a large centred heraldic emblem and builds itself a wall to be carved into.`;

const NOMARK = `THE POSITION-COLOUR-COUNT LAW — this is how the room shows what it knows, and it is also the clever version. This is a room whose whole purpose is keeping track of the sky, and in this world it does that ONLY with physical facts about real solid objects:
 POSITION — where a thing sits and how high it is: a brass pin pushed into the curving plaster for each star, a wooden bead slid part-way up a taut wire, a small iron weight hanging at its own height on a cord, a pale pebble laid out on the boards in the same arrangement as the stars overhead, a pricked hole in a hide held up in front of the lamp so one point of light lands on the wall.
 COLOUR — which colour a thing is: coloured thread run between a few of the pins, beads of three different colours on three different wires, a tray of pebbles sorted rose, cream and near-black, one bead in hot marigold among twenty in bone white.
 COUNT — how many there are: an odd number, with one of them plainly set apart or a different colour. Three cords hanging and one of them knotted twice; nine pins in the plaster with one much higher than the rest; a saucer holding five pebbles and one big amber one beside it.
 DOUBLING — the sky shown by being reflected: a wide shallow bowl of still water on the boards under the slot with the stars doubled in it, a lamp doubled and wobbling in it.
Nothing is ever a picture, a mark, a symbol, a figure, a written thing or a reading surface. The thing itself, its place, its colour and how many there are carry all of it.`;

const JARGON = `THE PLAIN-WORDS LAW (this has cost real renders on this fleet). A specialist's correct vocabulary is full of words an ordinary reader pictures as a completely different object, and the picture then renders that other object confidently. So these words are absent from every entry and the plain replacement is written instead:
 EYEPIECE, OCULAR → "the narrow end you look through", "the little brass end at the bottom".
 MOUNT, MOUNTING → "the forked timber cradle it swings in", "the iron ring it turns in", "the squat stone pier it stands on". Never the word mount, which is a horse to ride.
 TUBE, BARREL, OPTICAL TUBE → "its long brass body", "the long brass length of it".
 OBJECTIVE, LENS, APERTURE, FOCAL → "the wide open end at the top", "the big glass at the top end".
 FINDER, FINDERSCOPE → "a second small telescope strapped alongside the big one".
 DECLINATION, MERIDIAN, TRANSIT, AZIMUTH, ZENITH, ALTITUDE, EQUATORIAL, ALTAZIMUTH → plain description of how it moves: "it swings up and it swings round", "the great toothed wheel that turns the whole thing".
 ARMILLARY, ORRERY, ASTROLABE, QUADRANT, SEXTANT, EPHEMERIS, SIDEREAL, OBSERVATION → plain description of the object: "nested brass rings one inside another on a turned wooden stand, small painted balls riding them", "a heavy brass disc on a chain".
 SPECULUM, REFRACTOR, REFLECTOR → "the great brass telescope".
 SHUTTER → "the long slot", "the two halves of the dome hauled apart".
TELESCOPE is allowed and is used freely: it is the ordinary word for the thing and the picture knows it. DOME, SLOT, CRANK, RUNG, LADDER, CRADLE, COUNTERWEIGHT, PULLEY, ROPE, CHAIN, SHELF, DRAWER, BRACKET, BEAM, RIB, PLASTER, FLAGSTONE and FLOORBOARD are all plain enough to use freely.`;

const SIBLING = `REGISTER GUARD — THIS IS A WORKING ROOM OF BRASS AND TIMBER, NOT A COSY NEST. A sibling path on this bot already owns the snug bedroom-under-the-eaves with a telescope propped on a stool, and it owns curved tower rooms with porthole windows. That register must not appear here, so these things are absent from every entry and their words are absent too: BED, BUNK, MATTRESS, PILLOW, QUILT, PATCHWORK, BLANKET HEAP, CUSHION, ARMCHAIR, TEAPOT, TEACUP, KETTLE, MUG COLLECTION, FAIRY LIGHTS, STRING LIGHTS, MUSHROOM LAMP, PAINT JAR, EASEL, CANVAS, SMOCK, BRAIDED RUG, PORTHOLE, WINDOW SEAT. What this room has instead: brass, iron, timber, rope, chalk-white plaster, a rolling ladder, a crank, a counterweight, drawers, shelves of turned brass things, a low working table, a brazier or an oil lamp, a bucket, a cat.
Also absent, because other paths and other bots own them: gameplay screenshots with menus, sprites in a row, a tile grid or health bars; a ruined or cobwebbed tower; a haunted house; gothic dread; steampunk brass gears, clockwork, pistons and pressure machinery; space itself — no planets, no nebulae, no galaxies, no spacecraft, no view from space. The sky through the slot is this world's own night sky: stars, at most one moon, an aurora, a comet.`;

const PIXELMAT = `PIXEL MATERIALS: brass, iron, timber, stone, plaster, glass, water and snow are described with CHUNKY STEPPED SIDES and flat bands of colour a pixel artist would place by hand: "flat stepped bands of honey brass", "each face stepping into shadow through three flat dithered bands", "hard pixel steps", "blocky stacked stone courses", "the boards' grain in hard pixel lines". The words facet, faceted, polygon, polygonal, smooth, glossy, mirror-finish, chrome, photorealistic, hyper-real, bokeh and depth-of-field are absent, because they render a fully smooth image with no pixel structure.`;

const LIGHTOBJ = `LIGHT IS LIGHT, never an object: light spills, pours, washes, slants, lies across, climbs, dapples, glows, catches, edges, doubles and scatters. The words shaft, column, pillar, bar, beam (of light), wedge, ribbon, cone, ring, coin, disc, halo and curtain are absent when describing light or a reflection. A reflection is written as "broken into flat pixel bands", "a scatter of glitter", "the lamp doubled and wobbling in the water below it".`;

const IRREGULAR = `IRREGULARITY: every arrangement is uneven and off-centre. Shelves sag, ladders lean, things lie where they were left, the brass is worn brighter in the places hands touch it. Matched pairs flanking the centre, mirrored halves, a face squared up to the camera and tidy rows of identical objects are absent. COUNTS: where several like things appear the count is ODD and one of them is plainly set apart or different (three cords with one knotted twice, five pins with one much higher, seven drawers with one standing open).`;

const SIMILE = `SIMILES: a BUILT thing may be described by a likeness, because that is this bot's charm and it renders beautifully ("a dome ribbed like an upturned basket"). A NATURAL form never is: smoke, breath, frost, snow, cloud, water and moss are described in their own terms, because a borrowed likeness on a natural form renders the literal object. The words "like fingers", "like a hand", "like claws", "like teeth" and "like bones" are absent everywhere. Vary the likeness entry to entry: reusing a likeness given here as an example counts as a duplicate.`;

// MEASURED PRE-ROUND-0, and it is the single biggest thing this file gets right.
// The first generation of these pools ran at roughly THREE TIMES the word count
// asked for — the hero pool medianed 143 words against a 35-to-50 ask — because
// Sonnet anchors on the EXAMPLES, not on the number, and every example given was
// itself 55 to 70 words long. On this bot the two best-scoring paths are also the
// two shortest-prompt paths (volcano-forge 229 median emitted words, PASS;
// pixel-cozy-room 217, PASS) against ice-cavern at 276 (CLOSE) and
// castle-town-gate at 299 (which lost its late content at the top end). So the
// cap is restated as a hard limit and every example below obeys it.
const CAP = (lo, hi) => `THE WORD COUNT IS A HARD LIMIT: ${lo} to ${hi} words of body after the title. Count them. An entry over ${hi} words is unusable however good it is, because a long prompt renders only its first third and the later axes get dropped. Say the one thing this entry is for and stop.`;

// A ruler has to be a DIRECT comparison to ONE object standing in the same room.
// Measured failures in the first generation: "as broad across as a dinner plate"
// (a dinner plate is not in the frame, so it buys nothing) and "as long as the
// pier is tall multiplied three times over" (a picture cannot do arithmetic).
const RULER = `SIZE IS PROVED BY A RULER WELDED TO THE ROOM. The ruler is ONE object that is standing in this same room and visible in the same frame, compared directly with no arithmetic: "as long as the room is wide", "as tall as the rolling ladder", "as thick through as the timber post beside it", "as broad as the trapdoor in the boards", "reaching two thirds of the way up the dome", "its narrow end level with the ladder's top rung". An adjective on its own ("huge", "vast", "enormous") buys nothing, a comparison to something outside the room (a dinner plate, a barrel, a cartwheel, a person's height) buys nothing, and any sum, product or multiple of two measurements is unusable.`;

// The measured law: two axes that can both supply an ANIMAL render both of them,
// competing with the hero (PixelBot campfire-night, a carved owl plus a live owl).
// The first generation of these recipes offered animal charm details in FOUR
// axes while also declaring "animals live in room_dressing only" in a fifth —
// the recipes contradicted each other, which is why sweeping the RECIPE text
// matters as much as sweeping the output.
const NOBEAST = `NO LIVING CREATURE APPEARS IN THIS ENTRY. Cat, dog, mouse, rat, bird, owl, pigeon, swallow, bat, moth, fox and every other creature are absent, and their names are absent too, because a second axis in this path owns the animal and two axes both naming one render two animals competing with the subject. A worn hollow, a groove, a dent or a print left BY something is fine, as long as nothing living is named.`;

const AXISNOTE = (mine, others) => `AXIS-CLEAN: the entry describes ${mine} and nothing else. ${others} belong to other axes and are absent here.`;

// SLIM law set for the BEAT axis (playbook lesson 40): a beat axis handed the
// path's identity law or its size law is read as CONTENT, so every beat
// re-describes the whole room, duplicates two other axes and blows its word
// budget. This axis gets only the two clauses it actually needs.
const ACTOR = `NAME THE ACTOR AS A WHOLE FIGURE. A named action with no named actor renders a giant disembodied hand or arm; this has cost real renders twice on this fleet. So write "a small sprite figure in a long coat", "a tall figure on the ladder", "two small figures on the boards", never "a hand on the brass" or "an arm raised". Every figure is a small clean pixel-sprite shape known by its silhouette and by what it is doing, never by a face, anatomy, age, gender or nationality, and no figure in the beat is described in more detail than any other, because the one you describe most is the one that comes out biggest. Bare skin, bathing and swimming are absent; everyone is dressed, and warmly.`;

const NOTEXT_SHORT = `TEXT IS ABSENT AND THE OBJECT CLASS IS DELETED RATHER THAN DESCRIBED. Writing of every kind is absent, and so are the objects whose shape is itself a writing or a device, whose names are absent too: CHART, MAP, DIAGRAM, BOOK, PAGE, PAPER, NOTE, SCROLL, PARCHMENT, LEDGER, ALMANAC, NOTEBOOK, BOOKCASE, BOOKSHELF, QUILL, PEN, INK, LABEL, TAG, PLAQUE, SIGN, BOARD (as a wall panel), POSTER, BANNER, EMBLEM, GLYPH, RUNE, SYMBOL, INSCRIPTION, NUMERAL, DIAL, GAUGE, CLOCK, SUNDIAL, SCALE, GRADUATED, COMPASS, GLOBE, CHALKBOARD.`;

// ─────────────────────────────────────────────────────────────────────────────
// HAND-AUTHORED camera pool (25). Every entry: where the CAMERA sits + what
// fills the frame + the ENCLOSURE + an ANGLE. Written verbatim because
// Sonnet-generated camera pools leak time of day, light, weather, the hero's
// type and posture verbs. Rules applied to all 25:
//  - hero-agnostic: only "the instrument" / "the room" / "the dome", never a
//    specific massing (which would fight the rolled hero).
//  - every entry states the enclosure (wall behind and down both sides, boards
//    across the bottom, the dome overhead with its slot) — an interior path's
//    camera pool is one of the three places the enclosure law must reach Flux.
//  - the instrument is always OFF-CENTRE and TURNED so it is seen at an angle:
//    an architectural or machine hero needs an ANGLE word or Flux faces it
//    square-on and mirrors it (pixel-ruins R2 → R3).
//  - never standing ON something the hero pool can roll (no camera on the
//    cradle, the pier, the beam or the ladder — ice-cavern R0 #4 put the camera
//    on the arch and the hero left the frame).
//  - never a narrow aperture, a cleft, a doorway or any surround: that draws a
//    dark border all round the frame (a peephole vignette). Frame-edge
//    foreground is a near EDGE only, on ONE side.
//  - never looking straight up the slot and never straight down the floor: both
//    delete the room.
//  - no posture verbs (lying / sprawled / perched / kneeling / crouching /
//    seated / leaning): a camera describing the VIEWER's posture renders a
//    PERSON in that posture.
// ─────────────────────────────────────────────────────────────────────────────
const CAMERA = [
  'FROM THE FLOOR, THREE-QUARTERS: camera at standing eye level out on the boards, the instrument well off to one side and turned so one flank recedes, the curved wall behind it, the ribbed dome closing the top.',
  'LOW ON THE BOARDS: camera a knee above the floor, the boards a wide band across the bottom, the instrument rising off to one side at an angle, the curved wall and dome closing the picture.',
  'ACROSS THE ROOM AT AN ANGLE: camera at eye level hard against the curved wall on one side, the room opening across the frame, the instrument off-centre and turned, the far curve cropped by the other edge.',
  'PAST THE LADDER RAIL: camera at eye level with one upright of the rolling ladder closing the near left edge, the instrument beyond it off-centre and angled, the curved wall right, the dome overhead.',
  'FROM HALF A STEP DOWN: camera at knee height at the floor\'s edge looking slightly up, so the dome and its open slot take the upper third, the instrument off to one side and turned.',
  'A LITTLE ABOVE, LOOKING DOWN THE ROOM: camera a head above standing height on one side looking down a little across the boards, the instrument angled and off-centre, the curved wall behind it, the dome cropping the top.',
  'PAST THE SHELF END: camera at eye level with the end of a timber shelf and what stands on it closing the near right, the instrument off-centre and turned beyond, the dome overhead.',
  'FROM BESIDE THE WARM SOURCE: camera at eye level back from the low warm light on the boards, the floor across the bottom, the instrument off to one side at an angle, the curved wall and ribbed dome closing the picture.',
  'ALONG THE CURVE OF THE WALL: camera at eye level with the wall\'s curve running away along one frame edge, the instrument standing out from it off-centre and turned, the dome closing the top.',
  'WELL TO ONE SIDE OF THE SLOT: camera at eye level standing to one side of the open slot rather than under it, the boards across the bottom, the instrument angled in the middle distance, the slot up in the dome.',
  'PAST THE HANGING CORDS: camera at eye level with a few cords hanging down the near edge on one side, the room open beyond them, the instrument off-centre and turned, the dome above.',
  'FROM THE TRAPDOOR\'S FAR SIDE: camera at eye level across a round timber trapdoor set in the boards, the boards crossing the bottom, the instrument beyond at an angle and off-centre, the curved wall behind.',
  'THREE-QUARTERS FROM THE DARK SIDE: camera at eye level on the room\'s unlit side, the near stone of the curved wall cropped by one edge, the lit half and the angled instrument off-centre beyond it, the dome overhead.',
  'PAST THE BANK OF DRAWERS: camera at eye level with the end of a bank of small drawers closing the near left, the instrument turned and off to the far side, the curved wall and ribbed dome closing the frame.',
  'FROM THE ROOM\'S EDGE, SIDELONG: camera at eye level just inside the room on one side looking sidelong across it, the boards running across the frame, the instrument off-centre and angled, the curved wall behind.',
  'LOW PAST THE BUCKET: camera set low with a plain bucket closing the near corner on one side, the boards crossing the frame, the instrument rising off-centre at an angle, the dome and slot above.',
  'HALFWAY UP THE ROOM: camera at the height of the ladder\'s middle out in the room\'s air on one side, the boards well below, the instrument turned and off-centre, the curved wall behind, the dome close overhead.',
  'PAST THE COUNTERWEIGHT: camera at eye level with a heavy iron shape closing the near right edge, the room opening past it, the instrument off-centre and angled, the curved wall behind, the dome above.',
  'FROM THE COLD SIDE: camera at eye level across the boards from the warm light, the floor crossing the bottom, the instrument off to one side and turned, the curved wall behind it, the open slot up in the dome.',
  'ACROSS THE LOW TABLE: camera at eye level with the near end of a low working table crossing the bottom corner on one side, the instrument angled and off-centre beyond, the curved wall and dome closing the picture.',
  'FROM THE STAIR HEAD, LOOKING IN: camera at standing eye level where the stair arrives looking in across the boards, the instrument turned and well off-centre, the curved wall behind, the dome overhead.',
  'PAST THE ROLLED BUNDLES: camera at eye level with a few rolled bundles standing in the near corner on one side, the boards crossing the frame, the instrument off-centre and angled, the ribbed dome above.',
  'WIDE FROM THE WALL, EVERYTHING IN: camera at eye level with its back to the curved wall, the whole room across the frame, the boards along the bottom, the instrument plainly to one side and turned, the dome and slot closing the top.',
  'LOW AND CLOSE TO THE BRASS: camera set low a couple of paces off so the instrument\'s brass fills one side of the frame at an angle, the boards crossing the bottom, the curved wall behind it, the slot above.',
  'FROM THE WARM CORNER: camera at eye level out of the room\'s brightest corner looking across the boards into the cooler half, the instrument off-centre and turned, the curved wall behind, the dome closing the top.',
];

const POOLS = {
  instrument: { mvp: 25, scale: 200, prompt: (n) => `You are writing ${n} TELESCOPE descriptions for PixelBot's observatory-tower path: the great brass telescope standing inside an astronomer's tower room in a classic-JRPG world — the scene a 16-bit RPG paints for its title screen. Each entry is THE INSTRUMENT ALONE: its mass, how it is held, how big it is, and one charm detail.

${CAP(30, 42)}

THE DEFINING MASS LEADS THE SENTENCE. A picture paints whatever noun is named first, so the first three words of the body name the telescope's biggest shape: "an enormously long brass telescope", "a short thick brass telescope", "a great brass telescope rising off a squat stone pier". An entry that opens with a side detail (a lamp, a ladder, a shelf, a chain) makes the side detail the hero and the telescope disappears.

IT IS SO BIG THE ROOM WAS CLEARLY BUILT AROUND IT. It fills much of the frame, it stands plainly OFF-CENTRE, and it is TURNED so it is seen at an angle with one side receding into the picture, never square-on to the camera.

${RULER}

HOW IT IS BUILT — pick only what fits the word count, in these plain ordinary words: a long brass body in worn honey brass; a wide open end at the top and a narrow little end at the bottom that you look through; the forked timber cradle it swings in, or the iron ring it turns in, or the squat stone pier it stands on; a heavy iron counterweight hanging off its lower end on a short arm; a great toothed iron wheel and a hand crank; ropes and iron pulleys; brass worn bright where hands have touched it for fifty years.

${JARGON}

${BAR}

EVERY ENTRY CARRIES ONE CHARM DETAIL that makes it that instrument and no other, and it is a made or worn THING: a small second telescope strapped alongside the big one with cord; a mitten forgotten over the narrow end; a coil of rope hung on the cradle's horn; a step cut into the pier and worn into a hollow by boots; a brass end cap on a short chain; the crank's handle wrapped in cloth against the cold; a little brass bell that rings when the thing swings; a dab of hot colour where somebody painted the crank; a worn hollow in the boards where the wheel has ground round and round; a rope's end bound in bright thread; a wooden wedge kicked under the cradle to stop it drifting. Vary it: reusing one given here twice counts as a duplicate.

VARIETY MANDATE, distribute the ${n} across: 5 THE GREAT LONG ONE (an enormously long brass body in a forked timber cradle, its narrow end down near the ladder's top), 4 THE FAT DRUM (a short thick brass telescope slung in a heavy iron ring that turns, its wide end huge in the frame), 4 ON THE STONE PIER (the brass body rising off one squat stone pier with the boards fitted round its foot), 4 THE COUNTERWEIGHTED BEAM (the brass body balanced across a heavy timber beam with a great iron counterweight hanging off its heel), 4 THE CRANK-AND-WHEEL RIG (a toothed iron wheel standing beside the brass body with a hand crank on it, the whole machine swinging together), 4 HUNG FROM THE DOME (the brass body slung on chains and iron pulleys from the dome's own ribs so it hangs above the boards).

${NOTEXT}
The telescope's own brass carries nothing on it but wear, warmth and colour. Its glass is dark, or a flat bright pixel highlight, or it doubles the lamp.
${NOBEAST}
${PIXELMAT}
${IRREGULAR}
${SIMILE}
${SIBLING}
${AXISNOTE('the telescope, how it is held, how big it is, and its charm detail', 'the room\'s curved wall and floor and dome and slot and their materials, the lamp and its colour, what shows through the slot, the shelves and drawers, the figures, animals and the palette — and above all the enclosure geometry, which another axis states in full and which is wasted words here')}
${TONE}
${NAMES}
${CLEAN}
Examples, and note that BOTH are inside the word limit and neither mentions the wall, the floor or the dome: "THE LONG HONEY REFRACTOR: an enormously long brass telescope in a forked timber cradle, its worn honey body in flat stepped bands reaching as far across the room as the rolling ladder is tall, one mitten forgotten over its narrow lower end"; "THE FAT DRUM IN THE IRON RING: a short thick brass telescope slung in a heavy iron ring that turns, as broad through as the trapdoor in the boards, its wide open end filling one side of the picture, a brass end cap swinging off it on a short chain".
${FMT}` },

  tower_room: { mvp: 25, scale: 200, prompt: (n) => `You are writing ${n} TOWER-ROOM descriptions for PixelBot's observatory-tower path: the room the great brass telescope stands in, at the top of a tower in a storybook world. This axis is the ENCLOSURE — it is what stops the picture becoming an open-air platform in a void — so it describes the room's own surfaces and what they are made of, and NOTHING ELSE. It is the only axis in this path that names the wall, the floor, the dome and the slot's own timber.

${CAP(24, 34)}

LEAD WITH THE ROOM'S OWN SHAPE AND MATERIAL: "a squat round room of thick rough granite", "a tall drum of curving whitewashed plaster", "a bright timber-framed loft on a stone base". Then the floor, then the dome and its open slot. Say each of the four surfaces ONCE, in three or four words each, and stop.

WHAT THIS AXIS IS FOR, AND WHAT TO LEAVE OUT. The MATERIAL of the four surfaces is the measured lever and it belongs here. The frame GEOMETRY does not: the crop wording ("running out of frame on both sides", "crossing the bottom of the frame", "cropped by both edges") is already stated in full in three other places that reach the picture, so repeating it here spends this axis's whole word budget on something already paid for, and the words are better spent on the material and the charm detail. Write "a squat round room of thick rough grey granite, wide worn floorboards, a timber-ribbed dome with one long slot open in it" — the four materials, not the four crops.

${ENCLOSE}

${BAR}

VARIETY MANDATE, distribute the ${n} across: 5 THE GRANITE DRUM (thick rough grey or honey granite blocks in uneven courses curving round, small deep-set slit windows with the stone thick around them, wide worn floorboards, a timber-ribbed dome), 4 THE WHITEWASHED DRUM (curving lime-washed plaster over stone, chalk-white and warm where the lamp reaches it, flagstones with a timber ring set into them, plaster between dark ribs overhead), 4 THE TIMBER LOFT (a bright painted timber-framed room built on a stone base, posts and braces showing, boards underfoot and boards overhead between curved ribs), 4 THE COPPER DOME ROOM (a stone drum under a green copper dome, seen from inside as curved timber ribs with copper showing at the slot's edges, boards with a great round trapdoor in them), 4 THE ROCK-CROWN ROOM (curved masonry built straight against living rock so one part of the wall is bare stone, flagstones, a low ribbed dome), 4 THE CONVERTED TOWER (a room with its old purpose still showing — a millstone set flat in the boards, a heavy bell hook still in the dome, an old grain chute closed off in the curve — now full of brass and ladders).

EVERY ENTRY CARRIES ONE CHARM DETAIL that makes it that room and no other, and it is a made or grown THING: a rolling ladder on an iron rail that runs right round the curve; a great round timber trapdoor in the boards standing open with the stair light coming up; a worn spiral of boot-hollows in the flagstones; a small stove with its pipe going up through a dome rib; frost standing in fine white lines along the inside of the dome's boards; a hook and rope for hauling things up the outside of the tower; an old mud nest in the top of the curve with nobody in it; ivy that has found its way in through the slot and gone along a rib; a groove worn in the boards where the ladder's wheels run; a bucket on a rope hanging in the trapdoor's hole. Vary it: reusing one given here twice counts as a duplicate.

${NOTEXT}
Every flat surface the entry names CARRIES a real solid object rather than standing empty, because an empty surface grows writing: a shelf holds turned brass things, a ledge holds a candle stub, the beam holds a coil of rope, a bracket holds a hanging lamp.
${NOBEAST}
${PIXELMAT}
${IRREGULAR}
${SIMILE}
${JARGON}
${SIBLING}
${AXISNOTE('the room itself — its curved wall, its floor, its dome, its slot, its charm detail', 'the telescope and its cradle, the lamp and what its light lands on, what shows through the slot, the way the room keeps track of the sky, the shelves\' contents in detail, the figures, animals and the palette')}
${TONE}
${NAMES}
${CLEAN}
Examples, both inside the word limit and neither spending words on the crop: "THE GRANITE DRUM: a squat round room of thick rough honey-granite in uneven courses, wide worn floorboards, a timber-ribbed dome with one long slot open in it, a rolling ladder on an iron rail running round the curve"; "THE MILLSTONE LOFT: a bright timber-framed room on a stone base, deep red painted posts and braces, an old millstone set flat in the boards, a low dome of ribs and boards with one long slot open up its side".
${FMT}` },

  sky_slot: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} SLOT descriptions for PixelBot's observatory-tower path: what shows through the dome's one long open slot, and what comes IN through it. This is the money shot and the reason the path exists — an interior that opens onto the real night sky — and it runs on every render.

${CAP(16, 26)}

THE SHAPE OF THE ENTRY: the slot standing open in the dome, WHAT shows through it, and ONE thing it does inside the room. The dome's own timber reads all the way down both sides of the slot, so the sky is a tall narrow strip of night with the room around it, in one unbroken shot, never a second picture and never the whole top of the frame.

IT IS ALWAYS NIGHT. The sky in the slot is this world's own night sky, and it is beautiful and saturated, never a flat black field: a banded dithered gradient of deep blues and violets with stars in it. There is at most ONE special feature in the slot in the whole picture, and one moon at most, never a sun.

VARIETY MANDATE, distribute the ${n} across: 5 STARS IN BANDS (a tall strip of night in banded dithered blues and violets crowded with stars, the brightest of them a flat bright pixel, their cold light lying along one dome rib and one bright patch of it on the boards), 4 THE OVERSIZED MOON (a moon far too big for the slot crossing it slowly as a simple flat pixel disc, so bright the room has two lights in it and the brass takes a cold pale edge along one side), 4 THE COMET (one comet standing in the strip of night with its long soft tail leaning back, its pale light catching on the dome's boards), 4 THE AURORA (soft green and rose folds moving in the strip of night, their colour reaching in and lying faintly on the pale plaster inside the slot's mouth), 4 SNOW COMING IN (fat slow snowflakes drifting down through the open slot in flat pixel dots and settling in a thin white line along one rib and in a small drift on the boards below), 4 RAIN AND WIND COMING IN (fine rain slanting in through the slot and landing in bright rings in a bucket somebody has set exactly right, the boards dark and shining where it has got in).

${LIGHTOBJ}
${NOTEXT_SHORT}
${AXISNOTE('the slot, what shows through it, and the one thing it does inside the room', 'the telescope, the room\'s walls and floor and materials, the lamp inside the room, the shelves, the figures, animals and the palette')}
MOTION: snow drifts down, settles and lies; rain slants, lands and rings; breath fogs and thins; an aurora moves, folds and fades; a comet stands and leans. Rushing, sweeping, swirling, streaming and billowing are absent, and so are ribbons, bars, columns and walls of anything.
${SIMILE}
${TONE}
${NAMES}
${CLEAN}
Examples, both inside the word limit: "STARS IN BANDED VIOLET: the long slot open on a tall strip of banded violet night crowded with stars, one cold bright patch of it lying on the floorboards"; "FAT SLOW SNOW COMING IN: fat slow snowflakes drifting down through the open slot in flat pixel dots, settling in a thin white line along one dome rib".
${FMT}` },

  reading_tool: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} entries for PixelBot's observatory-tower path describing HOW THIS ROOM KEEPS TRACK OF THE SKY WITHOUT A SINGLE WRITTEN THING. This is the cleverest axis in the path.

${CAP(18, 28)}

${NOMARK}

${NOTEXT}

${BAR}
This axis is where the surprise lives. The obvious version of "an astronomer's records" is a chart, and a chart is the one thing this room does not contain. The surprising version is a physical object whose PLACE, COLOUR or NUMBER is the whole record, and it should make a viewer smile when they work out what it is for.

VARIETY MANDATE, distribute the ${n} across: 4 PINS IN THE CURVING PLASTER (a scatter of small brass pins pushed straight into the wall's own curving plaster, one for each star, with coloured thread run taut between a few of them, the wall's curve reading behind them), 4 BEADS ON TAUT WIRES (three or five taut brass wires strung from the boards up to a dome rib with wooden beads slid to different heights on them, the beads in two or three colours, one of them in a hot colour well above the rest), 4 PEBBLES LAID OUT (pale pebbles laid out on the bare boards or in a shallow tray of dark sand in the same arrangement as the stars overhead, one much bigger and amber, a bare hollow in the sand where one has been lifted), 4 A PRICKED HIDE HELD TO THE LAMP (a soft piece of thin hide pricked all over with small holes, hung on two pins in front of the oil lamp so a scatter of small points of light falls across the curving plaster of the far wall), 4 THE SKY DOUBLED IN WATER (a wide shallow bowl of still water set on the boards under the open slot, the strip of night and its stars doubled in it, the lamp doubled and wobbling at its rim, a dropped pebble's rings still going out), 5 HANGING CORDS AND WEIGHTS (long cords hanging from the dome's ribs, each with a small iron weight and a coloured bead at its own height, an odd number of them with one knotted twice, all of them swinging a little where the night comes in).

EVERY ENTRY CARRIES ONE CHARM DETAIL: a loose thread-end still hanging from one pin; a bead worn shiny by a thumb; a small paw-print pressed into the sand tray; one bead that has come off and lies on the floor by the wall; a saucer of spare pins beside the lamp; a thread gone slack and looping down; a pebble in a hot colour among the pale ones; a knot tied by somebody with cold hands; a thumb-smudge of soot on the bowl's rim. Vary it: reusing one given here twice counts as a duplicate.

EVERYTHING IS WRITTEN AS A PRESENT STATE, never as something that has not happened yet. The phrases "not yet", "no longer", "yet to" and "still to be" are absent, because a picture cannot render the absence of a future event: write "a small round dent in the sand where a pebble was lifted out", never "a hollow where a pebble has not yet been returned".
${NOBEAST}
${LIGHTOBJ}
${AXISNOTE('the physical way the room keeps track of the sky, and its charm detail', 'the telescope, the room\'s walls and floor and dome, the lamp itself and what its light lands on, what shows through the slot, the shelves and drawers, the figures, animals and the palette')}
${PIXELMAT}
${IRREGULAR}
${SIMILE}
${JARGON}
${SIBLING}
${TONE}
${NAMES}
${CLEAN}
Examples, both inside the word limit: "PINS AND SCARLET THREAD: nine small brass pins pushed into the wall's own curving plaster, scarlet thread run taut between four of them, one pin much higher with a loose thread-end hanging from it"; "BEADS ON THREE TAUT WIRES: three brass wires strung from the boards up to a dome rib, wooden beads slid to different heights in bone white and jade, one bead in hot marigold well above the rest".
${FMT}` },

  observer_moment: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} MOMENT descriptions for PixelBot's observatory-tower path: the one small story beat happening RIGHT NOW in the room, mid-action. This is the axis that makes the picture a NIGHT'S WORK instead of a furniture study, and it runs on every render.

${CAP(14, 24)}

${ACTOR}

${BAR}
Something is happening, and it is warm, human and a little funny. The obvious version is a person standing still looking through a telescope; reach past that one.

DISTINCTNESS IS THE #1 RULE AFTER THE WORD COUNT: every entry is a DIFFERENT ACTION. Two entries that both amount to "figures looking up at the slot while one of them points" are duplicates however differently they are worded, and so are two entries that both amount to "a figure bent to the telescope". Name a different verb and a different object in every entry.

VARIETY MANDATE, distribute the ${n} across: 5 UP THE ROLLING LADDER (a tall figure in a long coat halfway up the rolling ladder, the oil lamp hooked on the rung below, the ladder stopped mid-roll along its rail), 4 AT THE NARROW END (a small figure in a long coat bent to the telescope's narrow little end with one arm up along the brass), 4 WORKING THE MACHINE (a figure hauling hand over hand on a rope to open the slot, or turning the great toothed wheel with both hands, or kicking a wedge under the cradle), 3 LOOKING UP TOGETHER (two small figures standing quite still on the boards with their faces turned up at the open slot), 4 THE SMALL HELPER (a very small figure in a coat plainly too big holding the lamp up as high as it can reach, or carrying an armful of pebbles across the boards with great care, or pushing pins into the plaster on tiptoe), 5 THE COMEDY OF IT (setting a bucket down exactly under the drip and standing back to check it; reaching down from the ladder for a steaming mug held up from below; asleep on the bottom rung with a mitten still on; chasing a dropped bead across the boards on hands and knees; struggling in through the trapdoor with an armful of firewood).

${NOTEXT_SHORT}
${AXISNOTE('the one thing happening right now and the whole figure or figures doing it', 'the telescope\'s construction, the room\'s walls and floor and dome, the lamp and its colour, what shows through the slot, the shelves and drawers, the palette')}
${TONE}
${NAMES}
${CLEAN}
Examples, both inside the word limit: "HALFWAY UP THE LADDER: a tall figure in a long coat halfway up the rolling ladder, the oil lamp hooked on the rung just below, the ladder stopped mid-roll"; "THE BUCKET SET EXACTLY RIGHT: a small figure setting a plain bucket down on the boards under the drip and standing back a pace to check it".
${FMT}` },

  room_dressing: { mvp: 25, scale: 100, prompt: (n) => `You are writing ${n} ROOM-DRESSING descriptions for PixelBot's observatory-tower path: WHAT THE SHELVES, THE WALLS, THE BEAMS AND THE FLOOR OF THIS ROOM CARRY. This is the most load-bearing axis in the path and it does two jobs at once — it is the anti-writing lever and it is the best set dressing in the picture.

${CAP(22, 32)}

WHY IT MATTERS, stated plainly so it survives editing: an empty or undescribed surface is exactly the surface a picture fills in with writing of its own. Naming what a surface actually CARRIES kills the writing AND makes the room worth looking at. So every entry names two or three real solid objects and where each of them sits, and stops.

${NOTEXT}

${BAR}
Everything in here is brass, iron, timber, rope, cloth, stone, water or alive. Nothing is flat, rectangular or fixed to a wall like a panel.

VARIETY MANDATE, distribute the ${n} across: 4 THE SHELF OF BRASS THINGS (a sagging timber shelf following the wall's curve, carrying turned brass cylinders standing on end, a stack of small brass cups, a coil of brass wire, a hand crank off its machine, a little brass bell), 4 THE BANK OF LITTLE DRAWERS (a tall bank of small timber drawers built against the curve, each front plain timber with one turned bone knob, the drawers grouped by the COLOUR somebody has painted them, one standing open with pale pebbles in it), 4 THE RING MACHINE AND THE HEAVY THINGS (nested brass rings one inside another on a turned wooden stand, small painted balls riding them, standing on the boards beside a heavy brass disc hung on a chain and a squat iron weight), 4 THE LADDER AND WHAT HANGS ON IT (the rolling ladder standing against the curve with an oil lamp on a hook, a coil of rope over a rung, a long coat and a scarf hung on the top rung, a pair of mittens drying), 4 THE ANIMAL (one animal, small and plainly small: a cat asleep curled on the warm boards by the brazier with its tail over its nose, a barn owl standing on a dome rib with its back to the room, a moth going round and round the lamp, a small rough dog asleep against the stove with one ear up), 5 THE TABLE AND THE FLOOR (a low timber working table carrying a candle stub in a saucer, a tin cup, a saucer of spare pins and a wide shallow bowl of still water; a plain bucket under the drip; a broom leaning in the curve; a stack of split firewood; rolled hides tied with cord standing in a barrel).

EVERY ENTRY CARRIES ONE CHARM DETAIL: a brass cup used as a candle holder and welded to the shelf with old wax; a drawer knob replaced with a carved wooden acorn; a pair of mittens stuffed in a coat pocket; a cup ring worn into the table; a feather stuck upright in a crack in the boards; one drawer that stands a finger's width open; a little dish of milk gone cold by the stove; a rope's end bound with bright thread; a single boot standing by the ladder; a candle stub burnt right down into its own puddle of wax. Vary it: reusing one given here twice counts as a duplicate.

SIZE, because a thing named with no size renders at hero scale: any animal or small object is stated small against something in the room — "no longer than one floorboard is wide", "small enough to sit in the hollow of the cradle", "about as tall as the bucket beside it".
ANIMALS LIVE IN THIS AXIS ONLY and nowhere else in the path, and at most ONE animal per entry, in the ANIMAL bucket only.
${PIXELMAT}
${IRREGULAR}
${SIMILE}
${JARGON}
${SIBLING}
${AXISNOTE('what the room\'s shelves, walls, beams, table and floor carry, and one animal at most', 'the telescope itself, the room\'s wall and floor and dome materials, the lamp and what its light lands on, what shows through the slot, the way the room keeps track of the sky, the figures and the palette')}
${TONE}
${NAMES}
${CLEAN}
A STACK IS NEVER CALLED A COLUMN, A TOWER OR A PILLAR: a shape word in an object's name becomes the shape on screen. Write "seven small brass cups stacked one on another, the top one tilted".
Examples, both inside the word limit: "THE SAGGING BRASS SHELF: a long timber shelf sagging in the middle along the wall's curve, carrying five turned brass cylinders on end and a coil of brass wire, one cup half full of old wax with a candle stub in it"; "THE CAT BY THE BRAZIER: one cat asleep curled on the warm boards beside the low brazier, no longer than two floorboards are wide, a dish of milk gone cold beside it".
${FMT}` },

  lamp_light: { mvp: 25, scale: 100, prompt: (n) => `You are writing ${n} LIGHT descriptions for PixelBot's observatory-tower path: the light inside this room on a clear cold night, and what it lands on.

${CAP(16, 26)}

THREE THINGS AND NOTHING ELSE: the burning thing, the surfaces its light reaches, and the warm colour it commits to. The COLD counter-light is another axis's job — it is named on every render already — so an entry that also describes the slot's cold light is spending its own budget on words already paid for. Name the warm source, name what it lands on, commit the colour, stop.

THE ONE RULE THAT DECIDES THIS AXIS: THE SOURCE EXISTS INSIDE THE ROOM, AND THE ENTRY SAYS WHAT ITS LIGHT LANDS ON. This is an interior on a night, so a room cannot show an outdoor sun, a dawn sky, a midday glare or an overcast day — an entry naming any of those makes the whole picture flat pale ambient daylight and the colour dies. Every entry names a real burning thing standing in the room (an oil lamp, a candle, a lantern, a brazier of coals, a small stove's open door, a handful of embers) AND the surfaces its light actually reaches (the telescope's brass, the boards' grain, the curving plaster, a coat's back, the underside of a dome rib, the dust hanging in the air, a figure's hands).

THE WHOLE TRICK OF THIS PATH, and it is measured: ONE WARM SOURCE BURNING INSIDE THE ROOM, committed to a warm saturated colour. So every entry ends by naming that colour, in this shape: "...honey and marigold everywhere it reaches".

VARIETY MANDATE, distribute the ${n} across: 5 THE OIL LAMP ON A LADDER RUNG (warm honey climbing the brass and every rung, hard little shadows pooling behind each ledge), 4 THE CANDLE STUB LOW ON THE FLOOR (light coming UP from below so the boards' grain glows and the underside of the cradle is warm), 4 THE BRAZIER OF COALS (a low red glow along the boards and up the nearest curve of the wall, breath fogging warm above it), 4 THE LANTERN HUNG FROM A DOME RIB (warm light falling down through the ribs so their shadows lie in bands across the floor), 4 THE POINTS OF LIGHT FROM A PRICKED HIDE (the lamp behind a pricked hide throwing a scatter of small bright points across the curving plaster), 4 THE LAMP AND THE COLD SLOT MEETING (a warm lamp low in the room, its colour meeting the cold pale light on the telescope's brass with a hard pixel edge between them — this is the ONLY bucket that may name the cold light at all).

${LIGHTOBJ}
${AXISNOTE('the light inside the room, its source and the surfaces it lands on', 'the telescope\'s construction, the room\'s wall and floor and dome materials, what shows through the slot, the shelves and drawers, the way the room keeps track of the sky, the figures and animals')}
${NOTEXT_SHORT}
${PIXELMAT}
${SIMILE}
${TONE}
${NAMES}
${CLEAN}
Examples, both inside the word limit: "THE LAMP ON THE RUNG: an oil lamp hooked on a ladder rung throwing warm honey up the brass and along every rung, hard little shadows behind each ledge, honey and marigold everywhere it reaches"; "THE COALS ON THE BOARDS: a low brazier glowing along the floorboards and up the nearest curve of plaster, breath fogging warm above it, deep ember orange in every lit place".
${FMT}` },

  palette: { mvp: 25, scale: 40, prompt: (n) => `You are writing ${n} PALETTE harmonies for PixelBot's observatory-tower path: a named harmony of 3 to 5 colours for a limited-palette pixel-art scene of a lamplit tower room open to a cold night sky. 10 to 22 words, colour and light words ONLY (nouns of things, rooms, stone, brass, skies and towers are absent). Every entry ends by attaching its brightest accent to the LIGHT, in this shape: "..., hot marigold only in the lit places".

EVERY ENTRY IS SATURATED AND COMMITTED, AND EVERY ENTRY PITS A WARM AGAINST A COOL. Vivid is literal here: a muted, dusty, washed-out, greyed or tasteful harmony is unusable. Great stretches of this frame are cold stone and night, so the warm accent has to be hot enough to sing against them.

DISTINCTNESS IS THE #1 RULE: every entry names a DIFFERENT set of colour words. Two entries may share at most ONE colour word between them. Reordering the same four colours into a new sentence counts as a duplicate and is unusable.

COLOUR VOCABULARY to draw from (mix freely, and invent neighbours of these): honey, amber, marigold, saffron, butter, cream, ivory, bone, chalk white, pearl, oatmeal, ochre, umber, walnut, russet, terracotta, brick red, rust, ember orange, tangerine, apricot, peach, coral, vermilion, scarlet, deep red, rose, blush, magenta, plum, mauve, lilac, violet, periwinkle, indigo, navy, blue-black, slate, pewter, teal, turquoise, aqua, cyan, cerulean, cobalt, sapphire, jade, emerald, viridian, moss, olive, charcoal, near-black.

VARIETY MANDATE, distribute the ${n} across these FAMILIES (the family names the MOOD of the harmony, not its words — choose the words yourself and vary them entry to entry): 5 LAMP GOLD AGAINST DEEP NIGHT (the warm honey range against the deepest cool, one small burning warm in the lit places), 5 EMBER AND INDIGO (the hot red-orange end against a cool blue-violet dark), 4 MOONLIGHT AND ONE HOT COLOUR (pale cool silvers and lilacs carrying one fully saturated hot hue), 4 CANDLE CREAM AND BLUE-BLACK (the high-key warm pale end against near-black, with one deep accent), 4 AURORA GREEN AND WARM BRASS (a cool green-and-rose cool side against a warm metal side), 3 FROST AND FIRELIGHT (the coldest pale end carrying one fully saturated fire hue). The brightest accent must also vary across the pool: hot marigold, scarlet, warm honey, tangerine, magenta, coral, white-hot cream, pale rose, saffron, ember orange.
${CLEAN}
Examples: "LAMP GOLD AND DEEP INDIGO: honey, ochre, indigo, bone, hot marigold only in the lit places"; "FROST AND FIRELIGHT: pearl, lilac, periwinkle, pewter, tangerine only where the lamp reaches"; "EMBER AND VIOLET: ember orange, russet, violet, cream, scarlet only in the lit places".
${FMT}` },
};

(async () => {
  // camera is hand-authored — written verbatim, never generated.
  if (!only || only === 'camera') {
    const out = `${DIR}pixelbot_observatory_tower_camera.json`;
    fs.writeFileSync(out, JSON.stringify(CAMERA, null, 2));
    console.log(`✍️  hand-authored ${CAMERA.length} entries → ${out}\n`);
  }
  for (const [slot, cfg] of Object.entries(POOLS)) {
    if (only && only !== slot) continue;
    await generatePool({ outPath: `${DIR}pixelbot_observatory_tower_${slot}.json`, total: SCALE ? cfg.scale : cfg.mvp, append: SCALE, batch: 25, maxTokens: 8000, metaPrompt: cfg.prompt });
  }
})().catch((e) => { console.error(e); process.exit(1); });
