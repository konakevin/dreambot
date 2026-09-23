#!/usr/bin/env node
/**
 * PixelBot floating-market-canal — bespoke pools (PIXELBOT_SCENES_PLAN.md §3.x
 * shape, built off pixel-harbor (the water sibling) and ice-cavern (the most
 * recent hardened recipe set)). A canal market town where THE MARKET IS BOATS:
 * dense, inhabited, trade and life as the subject, the JRPG town-at-dusk money
 * shot. The gap it fills: every PixelBot SCENE path is a vista, a ruin, a
 * cavern, a shoreline, a calm harbour, a forge, an empty wet street or one lit
 * dwelling. Nothing in the scene lane is a DENSE INHABITED COMMERCIAL place.
 * (`cozy-rpg-town` is inhabited but it is an IN-GAME gameplay-screenshot path on
 * the old `pixels` medium, and it is a LAND town.)
 *
 * ── THE TWO FAILURES THIS PATH WILL DRIFT TOWARD, AND THE LEVERS ─────────────
 *
 * DRIFT 1 — THE RECEDING CANAL CORRIDOR (playbook lesson 17). A canal is a
 * LINEAR FEATURE, and a path staged on one renders as a channel vanishing dead
 * up the middle with the subject tiled to the vanishing point. FaeBot
 * acorn-boat-regatta got 6 of 6 corridors, and rewriting all eight camera
 * vantages to look ACROSS the water did NOT fix it. What fixes it is the ToyBot
 * CONCRETE-BUT-CROPPED form applied to the SETTING: name the SURFACE filling the
 * frame, put its far edge as a BAND along one border, and run the feature's
 * LENGTH out of frame on both sides. So every `canal_town` entry and every
 * `camera` entry here carries the CROSSWISE LAW below, and it is also the
 * template's first rule and output-order item 1 — a receding corridor cannot
 * exist in a frame where the canal runs left edge to right edge.
 *
 * DRIFT 2 — A MARKET IS A TEXT MAGNET. Stalls mean awnings, and awnings mean
 * lettering (playbook lessons 1, 2, 12). Lesson 12 is the operative one: a
 * surface whose SHAPE is itself a text prior (sign, signboard, banner, price
 * board, placard, poster, label, tag, menu, chalkboard, scroll, map, paper,
 * book, ledger, plaque) CANNOT be safely described, because writing "blank"
 * does not subtract while naming the noun adds. So the noun is DELETED from
 * every layer here, including from the template (this path deliberately does
 * NOT use the shared `PICTORIAL_BLOCK`, which names sign / poster / banner).
 * The positive replacement is the GOODS LAW: a stall says what it sells with
 * its CARGO, piled in plain sight. That is also the clever version — a fruit
 * barge riding low under melons is a better picture than any sign.
 *
 * Standing hazards this file is written against (each cost real renders):
 *  - TEXT PRIOR IN SYNONYMS: mark|marks|marking|glyph|sigil|stamped|engraved|
 *    etched|inscri|script|characters|plaque|sign|banner|label|board|numeral|price.
 *  - LIGHT AS AN OBJECT: shaft / column / beam / ribbon / ring / halo / curtain
 *    render solid objects; a reflection written as a RIBBON or BAR renders a bar.
 *  - "facet" IS A LOW-POLY PRIOR: water and glass described by facets render a
 *    fully smooth vector illustration.
 *  - EVEN COUNTS MIRROR: a row of identical boats is the dullness failure AND
 *    the tiling failure at once. Odd counts, every hull a different silhouette.
 *  - A LIFE ENTRY WITH NO SIZE WORD RENDERS HERO-SCALE.
 *  - ANIMAL VOCABULARY LIVES IN EXACTLY ONE AXIS (`canal_life`).
 *
 * 9 pools, axis-clean, positive-only. MVP 25 each; --scale appends to production
 * size. `camera` is HAND-AUTHORED (playbook: Sonnet-generated camera pools leak
 * time-of-day / light / terrain / hero-type / posture verbs) and written verbatim.
 *
 * Run: node scripts/gen-seeds/pixelbot/gen-floating-market-canal-pools.js [--only slot] [--scale]
 */
const fs = require('fs');
const { generatePool } = require('../../lib/seedGenHelper');
const DIR = 'scripts/bots/pixelbot/seeds/';
const SCALE = process.argv.includes('--scale');
const only = (() => { const i = process.argv.indexOf('--only'); return i >= 0 ? process.argv[i + 1] : null; })();

const FMT = `Format every entry exactly as 'CAPS TITLE: body' (a short capitalised title, a colon, then the body). Return ONLY a JSON array of strings.`;
const CLEAN = `POSITIVE ONLY: describe what is there; write no negations, no "no", no "never", no "without".`;

const BAR = `THE BAR (this outranks everything except the laws below): playful, adventurous, vivid, beautiful, clever. This is the splash screen of a game a player wants to play. Two acceptable outcomes for every entry: show something a person has never seen, or take something familiar and redress it as something more interesting. Ask of every entry "is this the obvious version of this idea, or the surprising one" and write the surprising one. VIVID IS LITERAL: saturated committed colour and dramatic light, never muted, washed out or tasteful-grey. CLEVER means ONE charm detail the eye finds on second look that makes it that scene and no other. ADVENTUROUS beats static: something is happening. A clean, correct, sober entry is a failure here.`;

const TONE = `TONE: whimsical, warm-hearted, busy and a little magical throughout. This is a canal market town a player is delighted to arrive in: lantern light, steam, painted hulls, impossible piles of goods, storybook rooflines. Grime, squalor, poverty, misery, decay, dread, horror, combat, weapons, war, blood and monsters are absent from every entry; the words for them are absent too. Documentary realism, travel photography and geographic realism are absent: this is a game's painted scene, not a photograph.`;

const NAMES = `NAMES: describe everything in plain visual terms. The names of real places, real cities, real rivers, real canals, real countries, real companies, myths, gods, games, films and franchises are absent from every entry (so no Venice, Bangkok, Amsterdam, Suzhou, Xochimilco, Kerala, Kashmir, Hoi An, or any other real name). Real-world ethnic and national labels are absent too; this is its own invented world.`;

// ── DRIFT 1: the load-bearing law ────────────────────────────────────────────
const CROSSWISE = `THE CROSSWISE LAW, and it is the single most important thing in this pool: THE CANAL CROSSES THE PICTURE FROM THE LEFT EDGE TO THE RIGHT EDGE. Its open water surface fills the lower half to two thirds of the frame, wide and flat and near. The far bank is a BAND across the upper part of the picture, its buildings standing shoulder to shoulder ACROSS the frame. Both ends of the canal run out of the frame, one past the left edge and one past the right edge, so the whole length a viewer can see is wide open water rather than a channel narrowing away. Write this geometry into the entry in those terms: "the canal crossing the picture left to right", "its open water filling the near half of the frame", "the far bank a band of crowded buildings along the top", "the water running out of frame on both sides". A channel that recedes toward a far vanishing point, a lane of water leading the eye away, a queue of boats lined up one behind another into the distance, and a street of water disappearing between the buildings are all absent.`;

// ── DRIFT 2: the delete-the-noun law + its positive replacement ──────────────
const GOODSLAW = `THE GOODS LAW (this is how a stall says what it sells, and it is the clever version): a boat-stall is identified by its CARGO, piled in plain sight and shaping the boat's whole silhouette — melons heaped until the hull rides low, a wall of stacked bamboo steamer baskets, flowers doubling the boat's outline, a mast of hanging birdcages, glazed pots nested in straw, coils of dyed rope, lacquered bowls in towers, a whole roof of drying chillies. The GOODS are the picture. A boat may also carry ONE painted picture directly on its own plain hull planking (a fish, a melon, a flower, a lantern, a crescent moon, a leaping carp), or one real object hung up as its mark (a single big fish-shaped paper lantern, a bundle of dried herbs, a wooden bird on a pole, a string of glass floats).

TEXT IS ABSENT, AND THE OBJECT CLASS IS DELETED RATHER THAN DESCRIBED. Writing, letters, numbers, prices and lettering are absent. So are the objects whose very SHAPE is a text prior, and their names are absent from the entry too: SIGN, SIGNBOARD, SIGNPOST, BOARD, PRICE BOARD, CHALKBOARD, PLACARD, PLAQUE, NOTICE, POSTER, BANNER, PENNANT, LABEL, TAG, TICKET, MENU, SCROLL, MAP, PAPER, NOTE, LETTER, BOOK, LEDGER, NEWSPAPER. Also absent: MARK, MARKS, MARKINGS, GLYPH, SIGIL, RUNE, STAMPED, ENGRAVED, ETCHED, INSCRIBED, SCRIPT, CHARACTERS, EMBLEM, CREST, COAT OF ARMS, WEATHERVANE, COMPASS, SUNDIAL — every one of them renders pseudo-lettering. Awnings and canopies ARE welcome and are described as plain or STRIPED or patterned CLOTH: "a striped orange awning", "a patched blue canopy", "a faded green cloth stretched on bamboo". Cloth is safe; a board is not.`;

// THE WALL LAW (added after R1, 2026-09-23). R1's three text failures were ALL unprompted
// backfill onto the quay-side wall faces between the stalls — the one surface class no pool
// described. Playbook lesson 2 plus MangaBot lesson 13: a surface named NOWHERE is ~0% clean,
// and "plain" stated only in a template block is a coin flip, because "blank" is a negation
// CLIP cannot use. Per lesson 14 the anti-text form has to carry the interest itself, so the
// wall gets something worth looking at rather than an absence — which also gives the far-bank
// band the texture and jut it needs (R1 #1 rendered as a flat frieze of equal houses).
const WALLLAW = `THE WALL LAW: every entry names what the WALL FACES BETWEEN THE STALLS carry, and it is something worth looking at: stacked crates and a coil of rope on a peg, a climbing vine gone up to the eaves, potted plants on brackets at uneven heights, shutters thrown back, drying bundles and a low brazier, baskets stacked to shoulder height, big glazed water jars on iron hooks, hanks of dyed yarn, a rough timber stair going up, a wooden bench with nets heaped beside it. This clause is load-bearing: a flat wall face that no entry describes is the surface Flux backfills a hanging shop board with pseudo-lettering onto, and it is also what makes the far bank read as a flat frieze instead of a lived-in terrace.`;

const PLAIN = `SURFACES CARRY SOMETHING, NEVER AN ABSENCE (R1 evidence): a sack is coarse undyed jute with its neck tied in bright dyed cord; a crate is rough slatted timber with straw showing between the boards; a cloth is plain or striped or patterned weave; a shutter is painted one flat colour and thrown back; a hull side is plain painted timber. A surface whose only description is that it is blank or plain still grows pseudo-lettering, because CLIP cannot use an absence — give the surface a real thing instead. A boat's identity comes from its CARGO, so no painted symbol is applied to any hull: R1 proved that a painted picture needs a flat panel, and Flux invents a hanging board to supply one.`;

const FIGURES = `PEOPLE ARE SMALL PIXEL SPRITES, and that is what makes this a game's scene rather than a photograph. A handful of figures at boat scale, each busy with exactly one thing, all of them out at mid-distance or further, seen from behind or side-on, their faces too small to read. Say the size in the entry ("a small sprite figure", "tiny at the far end", "small and side-on"). Figures are described by what they are DOING, never by age, gender or nationality. A close figure, a portrait, a readable face, a crowd, a throng, a mass of people, and a bustling press of bodies are absent. Swimming, bathing and bare skin are absent; everyone is clothed in plain bright working clothes.`;

const PIXELMAT = `PIXEL MATERIALS: water, glass, lacquer, tile and metal are described with CHUNKY STEPPED SIDES and flat bands of colour a pixel artist would place by hand: "flat bands of jade water", "chunky stepped pixel edges", "hard pixel steps", "blocky stacked tiles", "the reflection broken into flat pixel bands". The words facet, faceted, polygon, polygonal, smooth, glossy, mirror-finish, photorealistic, hyper-real, bokeh and depth-of-field are absent, because they render a fully smooth image with no pixel structure.`;

const LIGHTOBJ = `LIGHT IS LIGHT, never an object: light spills, pours, washes, slants, lies across, climbs, dapples, ripples, glows, catches, edges, doubles, scatters. The words shaft, column, pillar, bar, beam, wedge, ribbon, cone, ring, coin, disc, halo and curtain are absent when describing light or a reflection. A reflection is written as "broken into flat pixel bands across the water", "a scatter of glitter on the ripples", "the lantern doubled and wobbling below it".`;

const IRREGULAR = `IRREGULARITY: every arrangement is uneven and off-centre. Boats sit at different angles and different distances, some overlapping, one turned across the others. Rooflines step up and down. Things lie where they were left. Matched pairs flanking the centre, mirrored halves, and tidy rows of identical objects are absent. COUNTS: where several like things appear the count is ODD and one of them is set apart or differs plainly (three boats of three completely different silhouettes, the smallest well off to one side). A queue of identical hulls is the worst possible arrangement in this pool.`;

const GUARD = `REGISTER GUARD: this is a water MARKET seen as a painted game scene. A small calm one-boat fishing harbour belongs to another path, and so does an empty wet night street, and so does a gameplay screenshot with menus and a tile grid. Sea creatures as the subject belong to another path: fish here are goods or small river life. Food with cartoon faces belongs to another path: produce here is plain and real. Cargo ships, cranes, container docks, motorboats, outboard engines, cars, wires, aerials, plastic, corrugated sheet and any modern machinery are absent. Cyberpunk, neon, steampunk brass, gears, dragons, knights and skeletons are absent.`;

const AXISNOTE = (mine, others) => `AXIS-CLEAN: the entry describes ${mine} and nothing else. ${others} belong to other axes and are absent here.`;

// ─────────────────────────────────────────────────────────────────────────────
// HAND-AUTHORED camera pool (25). Every entry: where the CAMERA sits + what
// fills the frame + the CROSSWISE geometry + an angle. Hero-agnostic (referred
// to only as "the market" / "the canal" / "the town"), always looking ACROSS the
// water, never down the canal's length, never from a bridge (bridges are a
// signature element that must stay IN frame), never a narrow aperture (a peephole
// camera draws a dark border all round), and never a posture verb (a camera entry
// describing the VIEWER's posture renders a PERSON in that posture).
// ─────────────────────────────────────────────────────────────────────────────
const CAMERA = [
  'FROM THE NEAR QUAY, ACROSS: camera at eye level on the near quay edge, the open canal crossing the whole picture left to right in front of it, the far bank a band of crowded buildings along the top, the water running out of frame both sides.',
  'LOW AT THE WATERLINE: camera set low a hand above the water on the near side, flat jade water filling the lower two thirds and crossing the frame, the far bank stacked along the top edge.',
  'FROM A MOORED HULL: camera at gunwale height in a boat tied on the near side, the market spread across the picture left to right beyond it, one near hull cropping the bottom corner.',
  'OFF THE WET STEPS: camera at the foot of a flight of water steps on the near bank, the canal opening out across the frame, the far bank a band above it, one step cropping the near edge.',
  'BETWEEN TWO NEAR HULLS: camera at eye level with a hull closing each lower corner, the canal wide open across the middle of the picture between them, the far bank along the top.',
  'FROM THE BALCONY, ACROSS: camera up one storey on a near balcony, looking down across the canal that crosses the picture left to right, the market boats laid out on it and the far bank along the top.',
  'FROM THE UPPER WINDOW: camera at an open upper window on the near side, the canal crossing below and filling the near half, the far rooflines stepping along the top of the frame.',
  'OVER THE LOADED DECK: camera just above a loaded deck on the near side, its cargo cropping the bottom edge, the open canal and the market crossing the picture beyond it.',
  'PAST THE MOORING POST: camera at eye level with one leaning mooring post closing the near left, the canal running across and out of frame on both sides beyond it.',
  'FROM THE SIDE-CANAL MOUTH: camera at the corner where a narrow side channel meets the main water, the main canal crossing the picture left to right and wide open, the far bank above.',
  'ACROSS THE WIDE BASIN: camera on the near edge of a basin where the canal widens, the water filling the lower two thirds and reaching both frame edges, the town banked along the top.',
  'FROM THE WASHING PLATFORM: camera low on a plank platform out over the water, the canal crossing the frame all the way across, the far bank stacked along the upper edge.',
  'BEHIND THE CANOPY POLE: camera low with one bamboo canopy pole and its cloth edge closing the near left, the market crossing the picture wide beyond it.',
  'THREE-QUARTERS ALONG THE FAR BANK: camera on the near side with the far bank set three-quarters away so its band of buildings recedes slightly to one side, the canal still crossing the whole picture.',
  'FROM THE LOW SLIPWAY: camera at water level on a stone slipway on the near bank, the flat water crossing the frame and running out both sides, the market on it at mid-distance.',
  'UNDER THE NEAR AWNING: camera at eye level with the edge of a cloth awning cropping the top near corner, the canal and the market open across the rest of the picture.',
  'FROM THE TILTED DECK: camera on a slightly heeled deck on the near side so the horizon of rooflines sits at a small angle, the canal crossing the frame below it.',
  'PAST THE STACKED CRATES: camera at eye level with a stack of plain crates closing the near right, the open canal crossing the picture past them, the far bank a band above.',
  'FROM THE TURNING POOL: camera on the near edge where the canal turns and widens, the near water wide and flat across the whole frame, the town band along the top.',
  'PAST THE LEANING LADDER: camera at eye level with an old timber ladder leaning at the near left edge, the canal crossing the picture past it and out of frame right.',
  'OVER THE NEAR BASKETS: camera low over baskets set on the near stones, the canal crossing the frame beyond them and the market laid out across it.',
  'FROM THE FERRY THWART: camera at seated height on a small ferry out on the water, the market crossing the picture on both sides of it, the far bank along the top.',
  'HIGH IN THE TALL DOORWAY: camera in a tall waterside doorway one storey up on the near side, looking out and down across the canal that crosses the frame below.',
  'ALONG THE NEAR MOORINGS: camera at eye level with two near hulls at the lower right set at an angle, the canal opening wide across the rest of the picture.',
  'FROM THE STONE PARAPET: camera resting height at a low stone parapet on the near bank, the canal crossing the whole width of the picture, the town stacked in a band above it.',
];

const POOLS = {
  canal_town: { mvp: 25, scale: 200, prompt: (n) => `You are writing ${n} CANAL-MARKET-TOWN stage descriptions for PixelBot's floating-market-canal path: a canal market town where the market IS boats, painted as the scene a classic 16-bit RPG shows on its title screen when you reach the water city. Each entry LEADS WITH THE TOWN'S DEFINING MASS (the single biggest built shape in the picture: the crowded far-bank terrace, the tiled tower, the arcade of stilt houses, the stepped water-gate, the stacked bridges, the great waterwheel tower) and then sets it on the canal. 35 to 55 words.

THE DEFINING MASS LEADS THE SENTENCE. Flux paints whatever noun is named first, so the first thing in the body is the town's biggest shape. An entry that opens with a side detail (a lantern, a cat, a basket) makes the side detail the hero and the town disappears.

${CROSSWISE}

${BAR}

CONCRETE SHAPES A PIXEL ARTIST LOVES TO DRAW: houses stacked four storeys straight out of the water on timber stilts, balconies leaning out over the canal until they nearly touch, a tiled tower with a working waterwheel turning against its foot, a stepped stone water-gate going down into the water, shutters in every colour, rooflines stepping up and down in uneven jumps, a covered arcade open to the water, laundry strung between upper windows, plants in pots on every ledge, warm lit windows.

EVERY ENTRY CARRIES ONE CHARM DETAIL that makes it that town and no other, and it is a made THING, never a live creature: a waterwheel turning against a tiled tower with its splash caught as chunky pixel spray, a bridge with a tiny lit tea-house built onto its middle, a house with a boat hoisted up under its eaves for the winter, a rope-and-pulley basket running from an upper window down to the water, a mooring post carved into a round smiling moon, a set of stone steps going down into the green water until they vanish, a lantern on a long pole leaning right out over the canal, an upper window with a whole tree growing out of it, a chimney with a little tiled hat, a door at water level opening straight onto a moored hull, a bell hung under a bridge arch, a gutter pouring a bright trickle of water down into the canal.

VARIETY MANDATE, distribute the ${n} across: 4 THE STACKED FAR-BANK TERRACE (a wall of four-storey timber-and-plaster houses standing straight out of the water shoulder to shoulder in a band across the top of the picture, balconies leaning out, every shutter a different colour), 4 THE STILT-HOUSE ARCADE (a long arcade of houses on tall timber stilts with the water running under them and a walkway threading between, the band of them crossing the frame), 3 THE TILED TOWER AND ITS WATERWHEEL (a tall tiled tower rising out of the far bank with a great wooden waterwheel turning at its foot, the town banked along the top on both sides of it), 3 THE STACKED BRIDGES (two or three bridges at different heights crossing off to ONE side of the picture with the crowded far bank behind them, the main canal still open and crossing the frame), 3 THE STEPPED WATER-GATE (a broad flight of stone steps going down into the canal under a painted gateway, the town crowding above and away on both sides), 3 THE LANTERN TERRACE AT DUSK (a long terrace of lit upper rooms above the water with lanterns strung between the balconies, the band of them running out of frame both sides), 3 THE COVERED MARKET ARCADE ON THE WATER (a long open-sided timber hall built out over the canal on piles, its roof low and wide, the town stacked behind it), 2 THE WIDE BASIN OF THE TOWN (the canal opening into a wide basin with the town wrapped round the far side of it in a band, a low island of moored boats in the middle off to one side).

${WALLLAW}
${AXISNOTE('the town, its defining built mass, its charm detail, its wall faces and the canal geometry', 'the boat-stalls and their cargo, the story beat happening now, the light, the bridges and upper-town detail, the air, animals, people and the palette')}
${IRREGULAR}
${GOODSLAW}
${PIXELMAT}
${TONE}
${GUARD}
${NAMES}
ANTI-DULLNESS: a plain stretch of water with two grey houses on it is too plain to use. Every entry has one big shape, a charm detail, colour, and something the eye can climb.
${CLEAN}
Examples: "THE STACKED TERRACE AND THE PULLEY BASKET: a wall of four-storey timber houses standing straight out of the green water shoulder to shoulder in a band across the top of the picture, balconies leaning out over the canal, shutters in coral and jade and butter, the canal crossing the whole frame left to right below them and running out of frame on both sides, and a rope-and-pulley basket running from one upper window down to the water"; "THE TILED TOWER AND ITS WHEEL: a tall tower of blue-glazed tile rising out of the far bank with a great wooden waterwheel turning at its foot and its splash caught as chunky pixel spray, the town banked in a crowded strip along the top of the picture on both sides of it, the open canal filling the near two thirds and reaching both frame edges"; "THE STEPPED WATER-GATE AND THE MOON POST: a broad flight of worn stone steps going down into the canal under a red-painted gateway, the town crowding above and away in a band on both sides, the open water crossing the picture left to right, and one mooring post carved into a round smiling moon standing at the bottom step".
${FMT}` },

  market_boats: { mvp: 25, scale: 100, prompt: (n) => `You are writing ${n} MARKET-BOAT descriptions for PixelBot's floating-market-canal path: the MONEY SHOT of the whole path, the boat-stalls that ARE the market. Each entry names THREE OR FOUR specific boat-stalls out on the water, and EVERY ONE of them has a completely different SILHOUETTE and a completely different CARGO. 40 to 60 words.

WHY THIS AXIS EXISTS: without it the picture is a pretty canal with houses on it. With it the picture is a market. These are the shapes the eye reads first after the town, so each boat must be drawable in a handful of chunky pixels and instantly different from its neighbour.

${GOODSLAW}

${BAR} Reach for the surprising boat every time. A plain rowing boat with some fruit in it is the obvious version and is unusable.

BOAT IDEAS TO DRAW FROM AND GO BEYOND (mix, never list all of these in one entry): a fruit barge riding so low under a mountain of melons that its gunwale is at the waterline; a noodle boat with steam pouring straight up out of a hatch in its little roof; a flower punt whose blooms double its whole outline in coral and white; a lantern-seller's boat glowing from inside like a paper lamp with lanterns hung the length of its mast; a boat so loaded with stacked birdcages that the cages ARE its silhouette; a tea boat with a copper kettle on a brazier and three stools; a pottery boat with glazed jars nested in straw up to the gunwales; a dye boat trailing coils of rope in eight colours; a fish boat under a fan of drying silver fish on lines; a chilli boat roofed entirely in scarlet drying peppers; a bamboo-basket boat stacked head-high in nested steamers; a sweets boat with a little glass-fronted box of coloured blocks; a paper-and-kite boat with kites on short strings above it; a herb boat hung with bundles so thick they hide its whole cabin; a tiny one-person ferry poling a single passenger between the stalls; a bathhouse boat under a striped canopy with a copper tub steaming; a candle boat with rows of small flames along a plank; a seed-and-grain boat with sacks stacked in a blocky pyramid.

ARRANGEMENT: the boats sit at different angles, different distances and different sizes, some overlapping each other, one turned broadside across the others, one small one well off to the side. ONE of the named boats is the biggest and nearest and is painted in the most detail. A queue of boats lined up one behind another into the distance is absent, and so is a row of identical hulls.

${AXISNOTE('the boat-stalls, their hulls, their canopies, their cargo and the small sprite figures working them', 'the town and its buildings, the light and the time of day, the bridges, the air, animals in the water and the palette')}
${FIGURES}
${IRREGULAR}
${PIXELMAT}
${PLAIN}
${TONE}
${GUARD}
${NAMES}
${CLEAN}
Examples: "THE MELON BARGE, THE STEAM BOAT AND THE CAGES: nearest and biggest a broad flat barge riding so low under a heaped mountain of green-and-gold melons that its gunwale sits at the waterline, a small sprite figure side-on at its stern with a pole; turned broadside beyond it a narrow noodle boat with steam pouring straight up out of a hatch in its little red roof; and off to one side a slim punt so stacked with wicker birdcages that the cages are its whole silhouette"; "THE FLOWER PUNT, THE LANTERN BOAT AND THE TEA STOOLS: a flower punt nearest, its blooms in coral and white doubling the boat's whole outline, one small figure seen from behind sorting stems; further out a lantern-seller's boat glowing from inside like a paper lamp with paper lanterns hung the length of its mast; and small and well to the side a tea boat with a copper kettle on a brazier and three little stools"; "THE CHILLI ROOF, THE POTTERY JARS AND THE FERRY: a squat boat roofed entirely in scarlet drying chillies nearest and painted in the most detail; behind it and overlapping, a pottery boat with blue-glazed jars nested in straw up to the gunwales; and a tiny one-person ferry small at the far side, a single sprite passenger seated, its wake fanning out in flat pixel bands".
${FMT}` },

  market_moment: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} MARKET-MOMENT descriptions for PixelBot's floating-market-canal path: the one small story beat happening RIGHT NOW, mid-action. This is the axis that makes the picture adventurous instead of a tableau, and it runs on every render. 15 to 32 words.

${BAR} ADVENTUROUS IS THE POINT HERE: something is caught mid-air, mid-throw, mid-pour, mid-topple, mid-lift. A parked, posed or merely pleasant beat is unusable.

EVERY BEAT IS READABLE IN A SILHOUETTE. It has to be legible in chunky pixels from across the canal, so it is a big simple shape doing a big simple thing.

VARIETY MANDATE, distribute the ${n} across: 5 SOMETHING IN MID-AIR (a wrapped parcel caught mid-flight over open water between two boats, both small figures reaching; a melon tossed up and hanging at the top of its arc; a coiled rope thrown and caught mid-curve between hulls; a basket swinging on a pulley line halfway down from an upper window; a hat gone off a head and skating along the water), 5 TRADE HAPPENING (a small figure leaning far out over a gunwale to hand a paper cone across to another boat; two hulls pulled side by side with goods going over in both directions; a pole pushed against a neighbour's hull to swing a boat round; a kettle tipped and pouring tea in a bright curve into a cup held out from another deck; a bundle being lowered by rope to a waiting deck), 4 A NEAR MISHAP, PLAYFUL (a stack of baskets leaning right over with a small figure grabbing for the top one; a boat tipped by a big step aboard, water coming over one gunwale, everything held; one melon escaped and bobbing away downstream with a figure pointing; an umbrella turned inside out and lifting), 4 SOMETHING ARRIVING OR LEAVING (a loaded boat pushing off with its wake fanning out in flat pixel bands; a tiny ferry poling out between the stalls; a boat sliding in under a bridge arch off to one side; a boat being poled in fast and everyone leaning to make room), 4 WATER AND STEAM MOVING (a lid lifted and steam going straight up in a bright plume; a bucket of water thrown out in a chunky pixel arc; a scrubbing brush sending suds down a hull into the canal; a great splash going up where a crate went in), 3 THE TOWN JOINING IN (a shutter flung open overhead and a bright room showing; someone leaning out over a balcony rail lowering a little basket on a string; laundry being hauled in fast along its line).

${AXISNOTE('the one thing happening right now', 'the town and its buildings, the boats and their cargo, the light, the air, animals and the palette')}
${FIGURES}
${GOODSLAW}
${TONE}
${GUARD}
${NAMES}
${CLEAN}
MOTION WORDS: things fly, arch, hang at the top of a throw, tip, lean, pour, swing, lift, push off, slide, spill, bob. Rushing, sweeping, swirling, streaming and blasting are absent, and so are ribbons, bars and columns of anything.
Examples: "THE PARCEL IN MID-AIR: a cloth-wrapped parcel caught at the top of its arc over open water between two boats, one small sprite figure side-on with an arm up, another leaning out to catch"; "THE LEANING BASKET STACK: a head-high stack of nested baskets leaning right over a gunwale with a small figure grabbing for the top one, the whole boat heeled a little"; "THE LID AND THE STEAM: a lid lifted off a steamer and a bright white plume of steam going straight up past a red roof, a small figure side-on holding the lid out to one side".
${FMT}` },

  canal_life: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} CANAL-LIFE descriptions for PixelBot's floating-market-canal path: the animals in and around the water, an accent and never the hero. 12 to 26 words. This is the ONLY axis on this path that names an animal.

EVERY ENTRY SAYS ITS SIZE OR ITS DISTANCE, because an animal entry with no size word renders at hero scale. Write "small", "tiny in the frame", "at the far side", "low in the near corner".

${BAR} Reach for the charming surprise: an animal that is plainly unbothered by the entire market is funnier and better than an animal doing nothing.

VARIETY MANDATE, distribute the ${n} across: 5 A CAT, UNBOTHERED (a small cat asleep on a pile of woven baskets on a bobbing skiff, unbothered by the whole market; a cat sitting upright on a cabin roof watching the water, small and side-on; a cat stretched along a warm tiled ledge above the water, tiny in the frame; a cat with one paw down at the gunwale reaching after something), 5 BIG BRIGHT FISH UNDER THE SURFACE (three carp the size of dogs nosing between the hulls, their bright orange shapes clear under the green water at mid-distance; a pale fish shape turning slowly under a moored boat; a scatter of small silver shapes bright below the surface; one big spotted carp holding still in the shade of a hull), 4 DUCKS AND WATER BIRDS (a line of small ducks crossing the open water between the stalls, tiny in the frame; two ducks tipped tail-up beside a hull; a long-legged bird standing on a mooring post at the far side, small and still; a small flock of white birds settled along a roof ridge), 4 PERCHED AND ROOFTOP CREATURES (a small monkey sitting on a boat's awning pole holding a stolen fruit, tiny and side-on; a green parrot small on a hanging cage; a small dog standing right at the bow of a moving boat with its ears back; a turtle on a half-sunk crate at the near side, small), 4 THINGS IN THE WATER BESIDE THE BOATS (a pair of small river otters at the far side, one on a step; a cloud of tiny fish under a stall's shadow; a water buffalo's back and horns showing at the far bank, small in the frame; a heron lifting off low across the canal, small).

${AXISNOTE('one animal presence, small and at a distance', 'the town, the boats and their cargo, the story beat, the light, the air and the palette')}
${TONE}
${GUARD}
${NAMES}
${CLEAN}
Examples: "THE CAT ON THE BASKETS: a small cat asleep on a pile of woven baskets on a bobbing skiff, plainly unbothered by the whole market around it"; "THE DOG-SIZED CARP: three carp the size of dogs nosing between the hulls at mid-distance, their bright orange shapes clear under the flat green water".
${FMT}` },

  town_light: { mvp: 25, scale: 100, prompt: (n) => `You are writing ${n} LIGHT descriptions for PixelBot's floating-market-canal path: the light over the whole canal market, and the time of day it commits to. Each entry stacks TIME OF DAY + SOURCE + DIRECTION + THE COLOUR OF THE LIGHT + WHAT THE WATER DOES WITH IT + HOW SHADOWS FALL. 20 to 36 words.

THIS AXIS OWNS THE MOOD, SO IT COMMITS. Every entry names a specific time of day and a specific colour of light. Flat, even, bleached, grey, overcast, colourless and featureless light is unusable, and so is any entry a viewer would call tasteful.

EVERY ENTRY CARRIES TWO NAMED COLOURS PITTED AGAINST EACH OTHER, one of them warm or saturated. A single warm accent against a cool field is the whole trick, and a frame in one hue reads as a flat monochrome wash. So: warm lantern gold against deep teal water, hot apricot sun against violet shadow, jade water against scarlet awnings, cool blue dusk against a hundred small warm windows.

THE WATER IS HALF THE FRAME, so every entry says what the light does on it: doubled and wobbling below each lantern, broken into flat pixel bands, a scatter of glitter on the ripples, going flat and dark in the shadow of a hull, turning to jade where the sun reaches through.

VARIETY MANDATE, distribute the ${n} across: 5 THE LANTERN-LIT DUSK (the signature of this path: blue dusk over the rooflines with a hundred small warm lanterns and lit windows coming on, every one doubled and wobbling in the dark water below it), 4 LOW GOLDEN LATE AFTERNOON (hot low sun coming down the canal from one side, the far bank half in warm gold and half in violet shadow, long shadows of the boats reaching across the water), 4 BRIGHT HIGH MORNING (clean strong morning light, awnings glowing where the sun is behind them, the water a bright saturated jade with hard-edged hull shadows, deep cool shadow under the arcades), 3 FIRST LIGHT AND MIST (early pink-and-gold light just over the rooflines with the water still pale and pearl, one warm brazier low on a deck), 3 WARM RAIN LIGHT (soft bright light under a warm grey sky, everything colour-saturated and wet, the water dimpled, lantern light already on and doubling in it), 3 NIGHT AND THE BIG MOON (deep indigo night with a big soft moon low over the rooflines, its light silver on the water, small warm lanterns burning gold against it), 3 STORM-BREAK LIGHT (a dark violet sky with one bright hot break in it lighting the far bank while the near water stays deep teal and the awnings blaze).

${AXISNOTE('the light, its time of day, its colours and what the water and the shadows do', 'the town and its buildings, the boats and their cargo, the story beat, the air, animals and the specific palette list')}
${LIGHTOBJ}
${PIXELMAT}
${TONE}
${GUARD}
${CLEAN}
Examples: "LANTERN DUSK ON THE WATER: deep blue dusk over the rooflines with a hundred small warm lanterns and lit windows coming on along the far bank, each one doubled and wobbling in flat pixel bands on the dark teal water, shadows soft and blue between the hulls"; "LOW GOLD FROM ONE SIDE: hot low late-afternoon sun coming in from one side, the far bank half in warm honey and half in violet shadow, the boats throwing long shadows right across the bright jade water, awnings glowing where the light is behind them".
${FMT}` },

  upper_town: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} UPPER-TOWN descriptions for PixelBot's floating-market-canal path: the layer ABOVE the water, which is this path's second read — the bridges, the balconies, the rooflines and everything strung between them. Shapes and structure only. 22 to 42 words.

EVERY ENTRY CARRIES A FEATURE. The upper band stands in for the sky in this picture, so a plain wall of houses makes the whole frame boring. Name something to look at: lanterns strung between balconies, laundry on lines, a bridge with a tiny building on it, plants spilling off every ledge, a waterwheel, a rope-and-pulley basket, a boat hoisted under the eaves, a tree growing out of an upper window, birdcages hung in a row, a tiled turret.

BRIDGES, WHEN NAMED, CROSS OFF TO ONE SIDE OF THE PICTURE at an angle, or their arch crops the frame edge, or they cross a narrow SIDE channel deeper in. A bridge squared up in the middle of the frame, and any arch centred and mirrored, are absent. Where two or three bridges appear they are at clearly DIFFERENT heights and one is much smaller.

VARIETY MANDATE, distribute the ${n} across: 4 LANTERNS AND LINES STRUNG ACROSS (paper lanterns strung in a long sag between the upper balconies of both banks, lines of them at two heights, the lowest hanging right down toward the water), 4 BALCONIES AND WHAT SPILLS OFF THEM (balconies leaning out over the canal until they nearly touch, plants spilling off every rail, a bird cage and a wet cloth hung out, a bright chair up in one corner), 4 BRIDGES AT DIFFERENT HEIGHTS (a high stone arch off to one side with a smaller timber footbridge below it, and a third tiny plank crossing deeper in; a bridge with a little tiled tea-house built onto its middle; a bridge arch cropping one frame edge with the town beyond it), 3 LAUNDRY AND WORKING LINES (laundry in flat bright blocks of colour strung between upper windows across a gap, a pulley basket running down from one of them to the water), 3 ROOFLINES AND TURRETS (rooflines stepping up and down in uneven jumps, one tiled turret standing higher than everything with a little hat on its chimney, a dovecote on a ridge), 3 THE WORKING WHEEL AND ITS GEAR (a great wooden waterwheel turning against a tiled wall with its splash caught in chunky pixel spray, a wooden chute pouring a bright trickle of water down into the canal), 2 GALLERIES AND UPPER WALKWAYS (a timber gallery running the length of the far bank one storey up with small sprite figures side-on along it, a stair coming down it to the water), 2 THINGS STORED UP HIGH (a small boat hoisted up on ropes under the eaves for the winter; stacked crates and a coil of rope on a flat upper roof beside a chimney).

${WALLLAW}
${AXISNOTE('the built layer above the water, its wall faces and what hangs from it', 'the canal geometry, the boat-stalls and their cargo, the story beat, the light, the air, animals and the palette')}
${IRREGULAR}
${GOODSLAW}
${PIXELMAT}
${PLAIN}
${FIGURES}
${TONE}
${GUARD}
${NAMES}
${CLEAN}
Examples: "LANTERNS IN TWO LONG SAGS: paper lanterns strung in two long sags between the upper balconies of both banks, the lower line hanging right down toward the water and the upper one crossing higher, a few lanterns missing from the middle of it"; "THE STACKED CROSSINGS: a high stone arch off to one side of the picture with a smaller timber footbridge below it at an angle, a tiny plank crossing deeper in behind them both, and a little tiled tea-house built onto the middle of the timber one".
${FMT}` },

  air: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} AIR descriptions for PixelBot's floating-market-canal path: what the AIR itself is doing over a busy canal market. 14 to 28 words. This is the axis that gives the town-at-dusk money shot its haze.

VARIETY MANDATE, distribute the ${n} across: 6 COOKING STEAM AND SMOKE (white steam standing straight up from three different decks and thinning as it lifts; a low blue haze of cooking smoke lying along the water between the hulls; a soft plume going up past a lit window and catching the light; steam pooling under a low awning and spilling out at its edge; thin smoke leaning all one way down the canal; a warm haze hanging over the whole market and softening the far bank to flat bands), 5 LANTERN AND DUSK HAZE (the air soft and warm so every small light wears a gentle bloom; a faint golden haze thickening the depth into flat steps; the far end of the market going soft and pale while the near boats stay crisp; a dusty gold air with motes turning slowly in the lit places; the air gone rosy and soft between the lanterns), 5 CLEAN BRIGHT AIR (the air washed clean and bright so every far shutter and roof tile is crisp and hard-edged; a sharp clarity all the way to the far bank; clean air with the colours at their most saturated; a fresh brightness with every pixel edge readable; cool clean air and hard little shadows), 5 WARM RAIN AND ITS AFTER (a light warm rain dimpling the whole canal surface in fine pixel stipple with the colours going deeper; the last of a warm shower easing off and the water still ringed all over; fat slow drops landing and each making one bright ring; water running off the awning edges in bright threads; the air still wet and everything saturated, one bright break showing), 4 RIVER MIST OFF THE WATER (a low white mist lying on the water and hiding the hulls' waterlines; a soft veil lifting off the canal and fading before the rooflines; mist pooling in one corner of the basin and staying there; a pale bloom of mist standing over the open water at the far side).

${AXISNOTE('the air only', 'the town, the boats and their cargo, the story beat, the light and its colours, animals and the palette')}
MOTION: steam stands, lifts, pours up, thins and pools; smoke lies, leans and drifts; haze hangs, thickens and softens; mist lies, lifts and fades; rain dimples, stipples, lands and rings. Rushing, sweeping, swirling, streaming, blasting and billowing are absent, and so are ribbons, bars, columns and walls of anything.
${TONE}
${GUARD}
${CLEAN}
Examples: "STEAM OFF THREE DECKS: white steam standing straight up from three different decks and thinning as it lifts, the far bank going soft behind it"; "WARM RAIN STIPPLE: a light warm rain dimpling the whole canal in fine pixel stipple, every colour gone deeper, bright threads running off the awning edges".
${FMT}` },

  palette: { mvp: 25, scale: 40, prompt: (n) => `You are writing ${n} PALETTE harmonies for PixelBot's floating-market-canal path: a named harmony of 3 to 5 colours for a limited-palette pixel-art scene of a busy canal market town. 10 to 24 words, colour and light words ONLY (nouns of things, places, boats, water and buildings are absent). Every entry ends by attaching its brightest accent to the LIGHT, in this shape: "..., hot coral only in the lit places".

EVERY ENTRY IS SATURATED AND COMMITTED, and every entry pits a WARM against a COOL. Vivid is literal here: a muted, dusty, washed-out, greyed or tasteful harmony is unusable. The water half of the frame is a cool field, so the warm half has to be hot enough to sing against it.

DISTINCTNESS IS THE #1 RULE: every entry names a DIFFERENT set of colour words. Two entries may share at most ONE colour word between them. Reordering the same four colours into a new sentence counts as a duplicate and is unusable — reach for a new part of the colour vocabulary each time.

COLOUR VOCABULARY to draw from (mix freely, and invent neighbours of these): jade, emerald, viridian, sea green, mint, teal, turquoise, aqua, cyan, cerulean, cobalt, sapphire, indigo, navy, blue-black, slate, periwinkle, lilac, violet, plum, mauve, magenta, fuchsia, rose, blush, coral, salmon, vermilion, scarlet, brick red, terracotta, rust, ember orange, tangerine, apricot, peach, amber, honey, marigold, saffron, butter, cream, ivory, bone, chalk white, pearl, warm grey, umber, walnut, olive, moss, chartreuse, pistachio, charcoal, near-black.

VARIETY MANDATE, distribute the ${n} across these FAMILIES (the family names the MOOD of the harmony, not its words — choose the words yourself and vary them entry to entry): 5 JADE WATER AND HOT AWNINGS (a green-blue water field with a genuinely hot red, orange or pink living in the lit places), 5 BLUE DUSK AND LANTERN GOLD (the deep cool end carrying one small burning warm), 4 SUNSET ON THE TOWN (the hot end of the range against one deep cool shadow colour), 4 BRIGHT MORNING MARKET (the clean high-key end, saturated and fresh, with one deep accent), 4 NIGHT AND ONE SATURATED COLOUR (blue-blacks and charcoals carrying one fully saturated hue), 3 WET AND DEEP (the rain-soaked end, every colour a step deeper, with one bright highlight). The brightest accent must also vary across the pool: hot coral, scarlet, marigold, warm honey, magenta, tangerine, white-hot cream, pale rose, saffron, ember orange.
${CLEAN}
Examples: "JADE AND HOT CORAL: jade, viridian, slate, bone, hot coral only in the lit places"; "BLUE DUSK AND LANTERN GOLD: indigo, blue-black, periwinkle, dove grey, warm honey only where the lanterns burn"; "MARKET MORNING: turquoise, chartreuse, cream, terracotta, saffron only in the lit places".
${FMT}` },
};

(async () => {
  // camera is hand-authored — written verbatim, never generated.
  if (!only || only === 'camera') {
    const out = `${DIR}pixelbot_floating_market_canal_camera.json`;
    fs.writeFileSync(out, JSON.stringify(CAMERA, null, 2));
    console.log(`✍️  hand-authored ${CAMERA.length} entries → ${out}\n`);
  }
  for (const [slot, cfg] of Object.entries(POOLS)) {
    if (only && only !== slot) continue;
    await generatePool({ outPath: `${DIR}pixelbot_floating_market_canal_${slot}.json`, total: SCALE ? cfg.scale : cfg.mvp, append: SCALE, batch: 25, maxTokens: 8000, metaPrompt: cfg.prompt });
  }
})().catch((e) => { console.error(e); process.exit(1); });
