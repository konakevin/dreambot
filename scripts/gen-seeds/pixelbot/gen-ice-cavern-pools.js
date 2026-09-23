#!/usr/bin/env node
/**
 * PixelBot ice-cavern — bespoke pools (PIXELBOT_SCENES_PLAN.md §3.x shape,
 * modelled on §3.12 pixel-ruins and built directly off volcano-forge, the
 * sibling INTERIOR that passed 4.75). A vast ice cavern INTERIOR: the glittering
 * blue chamber a classic game paints for its title screen. The cavern's own
 * defining mass is the hero at 40 to 60 percent of the frame, the ice
 * architecture is the second read, and the vault layers away above it.
 * Money-shot: frozen_feature (what is held IN or BEHIND the ice, with the light
 * coming through it).
 *
 * The path's whole risk, which Kevin flagged himself, is A PRETTY BLUE GEOLOGY
 * PHOTOGRAPH: a real ice cave is a stock-photo cliché, cold and empty and
 * indistinguishable from EarthBot's lane. Every recipe therefore carries the
 * WONDER tone mandate, the hero pool mandates ONE MAGICAL CHARM DETAIL per
 * entry, the money-shot axis IS the magic (something frozen inside the ice that
 * the light comes through), and the palette pool mandates a WARM COUNTER-LIGHT
 * in every entry so the frame is never a monochrome blue wash.
 *
 * Standing hazards this file is written against (playbook, each cost renders):
 *  - TEXT PRIOR IN SYNONYMS: frozen runes / ice carvings are the genre cliché
 *    here, and mark|marks|glyph|sigil|stamped|engraved|etched|inscri|script all
 *    render pseudo-lettering. Only the pictorial-relief form is allowed.
 *  - "facet" IS A LOW-POLY PRIOR: ice and crystal described by facets render a
 *    fully smooth vector illustration. Chunky stepped pixel sides only.
 *  - LIGHT AS AN OBJECT: shaft / column / beam / ribbon / ring / halo render
 *    solid objects. A crevasse light is "daylight coming down through a crack
 *    overhead and lying bright across the floor".
 *  - EVEN COUNTS MIRROR: icicle ranks are a mirror-magnet; odd counts, one set
 *    apart.
 *  - ENCLOSURE: the rolled LOOK (Ultima tile, HD voxel) replaces an interior
 *    with a void unless the ENCLOSING SURFACES are named in the hero entry.
 *
 * 10 pools, axis-clean, positive-only. MVP 25 each; --scale appends to
 * production size. `camera` is HAND-AUTHORED (playbook: Sonnet-generated camera
 * pools leak time-of-day / light / terrain / hero-type / posture verbs into
 * every entry) and is written verbatim by this script, no Sonnet call.
 *
 * Run: node scripts/gen-seeds/pixelbot/gen-ice-cavern-pools.js [--only slot] [--scale]
 */
const fs = require('fs');
const { generatePool } = require('../../lib/seedGenHelper');
const DIR = 'scripts/bots/pixelbot/seeds/';
const SCALE = process.argv.includes('--scale');
const only = (() => { const i = process.argv.indexOf('--only'); return i >= 0 ? process.argv[i + 1] : null; })();

const FMT = `Format every entry exactly as 'CAPS TITLE: body' (a short capitalised title, a colon, then the body). Return ONLY a JSON array of strings.`;
const CLEAN = `POSITIVE ONLY: describe what is there; write no negations, no "no", no "never", no "without".`;
const WONDER = `TONE: whimsical, wondrous, warm-hearted and a little magical throughout. This is the glittering ice chamber a classic game paints for its title screen, a place a player is delighted to walk into: playful, beautiful, full of things to find. A geology photograph, a documentary ice cave, survival, cold misery, dread, horror, bones, gore, ruin, war, and monsters are absent from every entry; the words for them are absent too.`;
const NAMES = `NAMES: describe everything in plain visual terms. The names of real places, real glaciers, real mountains, real caves, real companies, myths, gods, games, films, and franchises are absent from every entry.`;
const CARVING = `CHARM DETAIL: every entry carries ONE detail that could only exist IN ICE, and nothing that implies a carved or built surface. Use things like a column of bubbles frozen in place, a fossil fern held deep in the clear ice, a hairline crack refrozen into a white feather, meltwater beaded along an icicle tip, a band of trapped grit reading as a dark stratum, one pane gone lens-clear so the chamber beyond bends through it, a fist-sized pocket of ancient air silver against the blue, old footprints refrozen into the floor.\n\nCARVED IMAGERY IS ABSENT, and this is a REVERSAL of what works elsewhere: the wording \"a worn pictorial relief of a carved SHAPE\" is proven safe 15/15 on pixel-ruins STONE, but on ICE it rendered a large centred heraldic emblem AND built itself a masonry wall to be carved into, dragging the room off ice entirely. It caused both sub-4 renders in this path's final round. Reliefs, emblems, plaques, crests and engraved shapes are absent here.\n\nTEXT IS ABSENT: writing, letters, numbers, runes, runic text, inscriptions, plaques, tablets, scrolls, maps, ledgers, notes, paper, books, signboards and price boards are absent. The words MARK, MARKS, MARKINGS, GLYPH, SIGIL, STAMPED, ENGRAVED, ETCHED, SCRIPT, CHARACTERS, WEATHERVANE, COMPASS, SUNDIAL, CREST and EMBLEM are absent too: every one of them renders as pseudo-lettering.`;
const PLAIN = `PLAIN SURFACES: every banner, crate, sack, cloth, hull, door, and flat panel is described as plain and unmarked, or as carrying one simple pictorial symbol.`;
const IRREGULAR = `IRREGULARITY: every arrangement is uneven and off-centre. The floor steps down unevenly, a ledge climbs one corner, icicles hang at very different lengths, layers in the ice sag and bend, things lie where they were left. Matched pairs flanking the hero, mirrored halves, and tidy rows of identical objects are absent. COUNTS: where several like pieces stand together the count is ODD and one of them is set apart (three ice spires of different heights with the smallest standing well away from the others). A single stair, pillar, or opening sits to ONE side of the frame.`;
const LIGHTOBJ = `LIGHT IS LIGHT, never an object: light spills, pours, washes, slants, lies across, climbs, dapples, ripples, glows, catches, edges, comes down through, reaches. The words shaft, column, pillar, bar, beam, wedge, ribbon, cone, ring, coin, disc, halo, and curtain are absent when describing light. Daylight entering from above is written as "daylight coming down through a crack overhead and lying bright across the floor".`;
const PIXELMAT = `PIXEL MATERIALS: ice, clear ice, glass, and water are described as having CHUNKY STEPPED SIDES and flat bands of colour that a pixel artist would place by hand: "chunky stepped pixel sides", "flat bands of blue", "hard pixel edges", "stepped blocky shelves". The words facet, faceted, polygon, polygonal, smooth, glossy, mirror-finish, photorealistic, and hyper-real are absent, because they render a fully smooth vector illustration with no pixel structure.`;
const GEMGUARD = `MATERIAL GUARD: everything here is ICE, snow, frost, meltwater, and the plain stone under it. Gemstone vocabulary belongs to another path and is absent: amethyst, geode, quartz, gem, jewel, sapphire-as-a-stone, and crystal-as-a-mineral. "A great glowing mass of pale blue ice" is right; "an amethyst crystal" is not. Lava, fire pits, forges, machinery, brass, gauges, gears, pistons, and steampunk gear belong to other paths and are absent.`;
const CONTINUOUS = `CLEAR ICE IS ALWAYS PART OF A CONTINUOUS MASS, never a discrete transparent object. Anything held in the ice is BURIED DEEP INSIDE the cavern's own wall or floor, with that ice reading above it, below it and on both sides of it, seen through a great thickness of it. A clear volume described with its own edges, or a clear thing standing free in the room, renders as a glass display case or an aquarium tank (measured on three of five R0 renders, 2026-09-23). The words glass floor, pane, case, block of ice, slab of clear ice, tank, and display are absent; write \"the clear floor ice\" and \"buried deep inside the wall\". And the word HEART is absent: it is a SHAPE prior and renders a floating cut heart-shaped gem. Write \"a great glowing mass of pale blue ice\" or \"a deep glow burning far back inside the wall\".`;

const GUARD = `REGISTER GUARD: this is an ice cavern to WONDER at from INSIDE it, not a dungeon, not a battle arena, not a survival story, not a documentary cave. Dragons, knights, monsters, bosses, combat, adventuring parties, skeletons, and frozen corpses are absent. The camera is always INSIDE the chamber: a cavern mouth seen from outside in a hillside belongs to another path.`;

// ─────────────────────────────────────────────────────────────────────────────
// HAND-AUTHORED camera pool (25). Every entry: where the CAMERA sits + what
// fills the frame + an ANGLE (playbook, ruins R2→R3: an architectural hero
// framed only by distance and position renders square-on and mirrored). The
// hero is referred to only as "the chamber" or "the ice" so each framing fits
// any rolled cavern. The camera is always INSIDE. No posture verbs (a camera
// entry that describes the VIEWER's posture renders a PERSON in that posture),
// no time of day, no light, no air, no hero type.
// ─────────────────────────────────────────────────────────────────────────────
const CAMERA = [
  'ACROSS THE CHAMBER FLOOR: camera at eye level out on the open ice floor, the chamber set three-quarters away so one wall recedes into the picture, loose frost near.',
  'FROM THE CORNER OF THE FLOOR: camera low in a corner of the chamber, its far side across the diagonal, the opposite wall falling away to one side.',
  'OFF THE LOW SHELF: camera at floor level a few strides off a low ice shelf, the chamber turned three-quarters, its depth opening out behind.',
  'PAST THE NEAR PILLAR: camera at eye level with one thick pillar of ice closing the near edge, the chamber three-quarters on beyond it.',
  'FROM THE QUIET END: camera at eye level at the chamber\'s far quiet end, the bright end three-quarters away down the floor, depth stacked between.',
  'BESIDE THE MELTWATER LIP: camera at eye level at the scalloped lip of a pool, the chamber angled away past it, one wall running off to the side.',
  'IN THE TUNNEL MOUTH: camera standing inside a low ice tunnel where it opens out, its rounded jambs framing the near edges, the chamber three-quarters on inside.',
  'THROUGH THE SIDE ARCH: camera just inside a side arch of ice looking across at an angle, the chamber set deep and turned, its far side widening past it.',
  'AT THE TOP OF THE ICE STAIR: camera at the head of a short stair of ice steps, looking down and across at the chamber below.',
  'UNDER THE LOW ROOF: camera close under a low shoulder of ice, the chamber beyond it three-quarters on, the vault hidden by the roof\'s near edge.',
  'FROM THE CRACK IN THE WALL: camera inside a narrow cleft in the chamber\'s wall, the chamber angled away, broken ice closing the near edge.',
  'FROM THE HIGH LEDGE: camera up on an ice ledge looking down across the chamber at an angle, the floor and its shapes laid out below.',
  'OVER THE FROZEN HANDLINE: camera on a ramp partway up the wall, the chamber below and turned, an old frozen rope crossing the near edge.',
  'FROM THE SHOULDER ABOVE: camera on a shoulder of ice high on one side, the chamber three-quarters below, its depth running away past it.',
  'DOWN FROM THE ARCH: camera high on a natural arch of ice, the chamber far below at an angle, everything foreshortened.',
  'LOW AMONG THE FALLEN ICE: camera set low among broken ice in the near foreground, the chamber rising three-quarters on beyond it.',
  'BEHIND THE POOL\'S RIM: camera low behind a rimmed pool, its white lip closing the near edge, the chamber angled away past it.',
  'AT THE ICICLE TIPS: camera down at the height of the longest icicle tips in the foreground, the chamber three-quarters on and large beyond.',
  'BEHIND THE SNOW DRIFT: camera low behind a drift of powder in the near corner, the chamber turned away above and past it.',
  'ALONG THE FLOOR CRACK: camera set low beside a white crack running across the floor ice, the crack leading the eye at an angle into the chamber.',
  'BACK TOWARD THE BRIGHT END: camera deep in the chamber looking back at its bright end and the opening beyond it, one wall receding.',
  'FROM THE DARK END: camera far back where the chamber runs out, its bright side small and three-quarters on with the whole floor between.',
  'PAST THE HANGING CLUSTER: camera at eye level with a cluster of icicles hanging close in the near edge, the chamber turned three-quarters well beyond.',
  'ALONG THE CHAMBER\'S LENGTH: camera set to one side of the chamber\'s long axis so that wall recedes hard, its far end sitting off-centre in it.',
  'ALONG THE TERRACE LINE: camera at eye level at the edge of the lowest terrace, the shelves stepping away at an angle and the chamber turned off to one side.',
];

const POOLS = {
  cavern: { mvp: 25, scale: 200, prompt: (n) => `You are writing ${n} ICE-CAVERN descriptions for PixelBot's ice-cavern path: ONE vast ice cavern interior, the glittering blue chamber a classic 16-bit RPG paints on its title screen when you reach the frozen world. Each entry LEADS WITH THE CAVERN'S DEFINING MASS (the single biggest shape in it: the dome, the frozen fall, the chasm, the terraces, the icicle crowd) and then names where inside the ice it sits. 30 to 50 words.

THE HERO'S DEFINING MASS LEADS THE SENTENCE. Flux paints whatever noun is named first, so the first thing in the body is the chamber's biggest shape. An entry that opens with a side detail (a small pool, a rope, a lantern) makes the side detail the hero and the chamber disappears.

THE CHAMBER ENCLOSES THE PICTURE. Every entry names the ice that CLOSES THE FRAME: the wall of layered ice standing behind the hero mass, the ice running down both sides of the frame, and the vault of ice closing it overhead. This is load-bearing: an interior described without its enclosing surfaces renders as a lit shape floating in an open void.

THE BAR: this is the picture a person stops scrolling for. Storied, specific, wondrous, glittering. Chunky readable shapes a pixel artist would love to draw: a dome of blue ice curving up out of sight, a whole end wall that is a frozen waterfall standing in rounded ranks, shelves of impossibly clear water stepping down, a dark chasm with an arch of ice striding over it, a tunnel of glass-clear ice spiralling away down, a ceiling thin enough to glow.

EVERY ENTRY CARRIES ONE MAGICAL CHARM DETAIL that makes it that chamber and no other, and it is a made or frozen or magical THING, never a live creature: a great glowing mass of pale blue ice buried deep inside the wall with the wall's own ice all around it and chunky stepped sides burning softly from within, a small wooden door frozen shut in the ice with its little round window lit from behind, a lantern left burning on an ice ledge, an old rope frozen into the wall still taut, one small mitten frozen into the ice at hand height, a rising line of bubbles caught mid-rise in a clear wall, a stair of ice steps going down into deepening blue, a tiny cottage of ice with one lit window low in the far wall, a great flat key held in the clear ice, a chandelier of icicles hanging over the middle of the floor, a sleigh half-sunk in the frost floor, a little frozen tree standing whole inside the ice with its branches spread, three small footprints crossing an untouched frost floor, a pair of skates left on a stone bench, a dark bell held in the vault glowing along one crack.

${IRREGULAR}
${CARVING}
${PIXELMAT}

VARIETY MANDATE, distribute the ${n} across: 4 THE VAULTED BLUE DOME (a vast domed chamber of layered blue ice, its walls curving up and over out of sight, the layers reading like flat bands, the floor wide and worn), 4 THE FROZEN-WATERFALL HALL (a hall whose whole end wall is a frozen waterfall standing in rounded ranks like the pipes of a great organ, its own ice closing both sides), 3 THE TERRACE OF CLEAR POOLS (a chamber stepping down in shelves of impossibly clear meltwater, each shelf rimmed in scalloped white, the ice walls wrapping them), 3 THE CHASM AND ITS ICE BRIDGE (a chamber split by a deep dark chasm with a natural arch of ice striding across it, the far wall rising beyond), 3 THE SPIRALLING ICE TUNNEL (a wide tunnel of glass-clear ice turning away and down, its walls ringed in bands, glowing at its far turn), 3 THE ICICLE-CROWD CHAMBER (a low wide chamber hung everywhere with icicles at very different lengths, one far longer than the rest, the roof dipping to meet them), 3 THE THIN-CEILING CHAMBER (a broad chamber roofed by a single thin sheet of ice that glows like a paper lamp, the light coming through it from above), 2 THE CLEAR FLOOR ICE OVER DEEP WATER (a chamber floored in clear blue-black ice with white cracks reaching across it and deep water far below, its walls standing close on both sides).

AXIS-CLEAN: the entry names the CHAMBER, its defining mass, its enclosing ice, and its charm detail only. The ice's smaller architecture (icicle ranks, frozen curtains, tiered pools, bridges, stairs, spires) belongs to the ice_form axis; the frozen feature the light comes through, the ambient light, the ceiling's own features, the air, people and creatures belong to other axes and are absent here.
${WONDER}
${GEMGUARD}
${CONTINUOUS}
${GUARD}
${NAMES}
ANTI-DULLNESS: a plain blue tunnel, a bare white room, or an even cave with nothing in it is too plain to use. Every entry has one big shape, a charm detail, and something the eye can climb.
${CLEAN}
Examples: "THE BLUE DOME AND THE FROZEN HEART: a vast dome of layered blue ice curving up out of sight, its bands reading as flat stepped blue, a wall of older ice standing behind and closing both sides of the frame, the vault meeting it overhead, and a great glowing heart of pale blue ice set deep in the far wall with chunky stepped sides burning softly from within"; "THE ORGAN-PIPE FALL WITH THE LIT DOOR: a whole end wall that is a frozen waterfall standing in rounded ranks of uneven height, the chamber's own ice running down both sides of the frame and closing overhead, a worn floor stepping down toward it, and a small wooden door frozen shut low in the ice with its little round window lit from behind"; "THE CHASM BRIDGE AND THE FROZEN ROPE: a deep dark chasm splitting the chamber floor with a natural arch of ice striding across it off-centre, layered walls rising close on both sides and a low vault closing it in, and an old climbing rope frozen into the wall beside the arch, still taut".
${FMT}` },

  ice_form: { mvp: 25, scale: 200, prompt: (n) => `You are writing ${n} ICE-ARCHITECTURE descriptions for PixelBot's ice-cavern path: the SHAPES the ice itself has made inside the chamber. This is the second read of the picture, the detail that makes the chamber a place worth walking through. 20 to 40 words. Each entry describes ice shapes and nothing else.

THE BAR: specific and tactile, the way a pixel artist draws it in chunky stepped blocks: icicles at wildly different lengths with one far longer than the rest, a frozen fall hanging in soft rounded folds, three shelves of clear water stepping down with scalloped white lips, a narrow bridge of ice with one frozen rope handline, steps worn into the ice climbing a corner.

VARIETY MANDATE, distribute the ${n} across: 4 ICICLE RANKS (icicles hanging in an uneven crowd at very different lengths with one far longer standing apart, a dense cluster where the roof dips, a scatter of short stubby ones along a low ledge, a chandelier cluster hanging over the open floor), 4 FROZEN FALLS AND FOLDED CURTAINS (a frozen fall standing in rounded ranks like organ pipes of uneven height, a hanging fold of ice down one wall in soft heavy pleats, a frozen cascade stepping down in rounded shelves, a wide fold of ice half in shadow with its edges bright), 4 TIERED POOLS AND SHELVES (three shelves of impossibly clear meltwater stepping down with the lowest wide and still, a rimmed pool with a scalloped white lip, a shallow basin of blue water set into the floor off to one side, a chain of small pools of different sizes stepping away), 3 BRIDGES AND ARCHES (a natural arch of ice striding over a dark gap, a narrow ice bridge with one old frozen rope handline, a low span of ice worn thin in the middle with light coming through it), 3 STAIRS AND RAMPS (steps worn into the ice climbing one corner, a smooth ramp of ice running down to a lower floor, a set of blocky ice ledges stepping up one wall at uneven heights), 3 BANDS AND LAYERS IN THE WALLS (walls layered in flat bands of blue and white that sag and bend around a bulge, old bands running at a tilt, a wall of clear ice with white bands reaching deep into it), 2 STANDING PILLARS AND SPIRES (a thick pillar of ice standing where a fall met the floor, three ice spires of different heights with the smallest well apart from the others), 2 THE FLOOR ITSELF (a floor of clear blue-black ice with white cracks reaching across it and deep water below the clear floor ice, a frost floor of untouched powder with one drift heaped to one side).

AXIS-CLEAN: the ice's shapes only. The chamber's own defining mass, the frozen feature the light comes through, the ambient light, the vault's own features, the air, and any people or creatures belong to other axes and are absent here.
${PIXELMAT}
${IRREGULAR}
${PLAIN}
${WONDER}
${GEMGUARD}
${CONTINUOUS}
${GUARD}
${CLEAN}
Examples: "THE UNEVEN ICICLE CROWD: icicles hanging in an uneven crowd at very different lengths, one far longer than the rest and standing well apart, each one a stack of chunky stepped pixel sides catching flat bands of blue"; "THE ORGAN-PIPE FALL: a frozen fall standing in rounded ranks of uneven height like the pipes of a great organ, their stepped blocky sides pale at the front and deep blue in the hollows behind"; "THE STEPPED CLEAR POOLS: three shelves of impossibly clear meltwater stepping down, each rimmed with a scalloped white lip, the lowest wide and glassy still and set off to one side of the floor".
${FMT}` },

  frozen_feature: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} FROZEN-FEATURE descriptions for PixelBot's ice-cavern path: the MONEY SHOT, the one magical thing held IN or BEHIND the ice that the light comes through. This axis is the whole reason this path exists: without it the picture is a pretty blue empty cave, and with it the picture is a wonder. 15 to 30 words.

EVERY ENTRY GLOWS, AND EVERY ENTRY IS THE BRIGHTEST THING IN THE PICTURE. The light comes THROUGH it or from WITHIN it, so it reads instantly and lifts the whole chamber. Say so in the entry: "lit from behind so it glows", "glowing softly from within the ice", "the light coming through it and lying warm across the floor".

${LIGHTOBJ}
${PIXELMAT}

VARIETY MANDATE, distribute the ${n} across: 5 A CREATURE HELD ASLEEP IN THE ICE (a great pale whale shape asleep deep in a clear wall, lit from behind so its outline glows; a stag held mid-stride in the clear ice, pale and calm; a flight of small birds caught mid-wing in a rising line inside the wall; a curled sleeping fox glowing faintly a little way in; a shoal of small silver fish held in a rising line), 4 A GLOW BURIED DEEP IN THE WALL (a great mass of pale blue ice buried deep inside the wall, ice reading above it and below it and on both sides, pulsing softly from within with chunky stepped sides; a warm gold light burning far back inside the wall ice; a soft rose glow deep under the floor ice), 4 A MADE THING HELD UPRIGHT IN THE ICE (a small wooden ship held upright in the wall with its mast whole, lit from behind; a sleigh held in the clear ice with its runners bright; a great plain wooden door standing in the ice with light coming around its edges; a lantern still burning inside the ice), 4 A WAY DOWN INTO THE BLUE (a stair of ice steps descending into deepening blue and glowing at the bottom; a tunnel of clear ice running away and bright at its far turn; a round window of clear ice in the floor showing a lit chamber far below; an archway of clear ice with warm light coming through from the other side), 4 LIGHT COMING THROUGH THE ICE ITSELF (a whole wall lit from behind so its flat bands read like the pages of a book; one thin place in the ice glowing warm like a lit paper lamp; green and violet light coming through a thin ceiling and lying across the floor; low sun coming through a wall of ice and turning the near half warm rose), 4 SMALL THINGS TRAPPED AND RISING (a rising line of bubbles caught mid-rise in a clear wall and each one lit; a scattering of golden leaves held at different depths and glowing; a slow fall of snowflakes frozen mid-air in the clear ice and each one catching the light; one frozen wave curled and held, lit from behind along its crest).

AXIS-CLEAN: this one frozen feature only. The chamber's own mass, the ice's smaller architecture, the ambient light over the whole chamber, the vault, the air, and any live people or creatures belong to other axes and are named here only as the surfaces the light lands on. A creature named here is HELD IN THE ICE and asleep, never awake and never moving.
${WONDER} The light is generous and lovely and the feeling is wonder: a player would stop and look at this.
${GEMGUARD}
${CONTINUOUS}
${GUARD}
${CLEAN}
Examples: "THE SLEEPING WHALE IN THE WALL: a great pale whale shape asleep deep inside the wall's ice with the wall reading all around it, lit from behind so its whole outline glows soft cyan across the floor"; "THE GLOW DEEP IN THE WALL: a great mass of pale blue ice buried deep inside the wall, its chunky stepped sides pulsing softly from within and washing the near ice with light"; "THE LIT DOOR IN THE ICE: a great plain wooden door standing whole in the clear ice with warm gold light coming around all four of its edges".
${FMT}` },

  light: { mvp: 25, scale: 100, prompt: (n) => `You are writing ${n} AMBIENT-LIGHT descriptions for PixelBot's ice-cavern path: the base light over the whole ice chamber. This is an INTERIOR, lit mostly by light coming THROUGH the ice. Each entry stacks SOURCE + DIRECTION + COLOUR OF THE LIGHT + HOW SHADOWS FALL. 15 to 30 words.

ONE WARM OR SATURATED COLOUR STANDS AGAINST THE COLD IN EVERY ENTRY. A single warm accent against all that blue is the whole trick of this path, and an all-blue frame reads as a flat monochrome wash. Every entry therefore names either a warm source (a lantern, a small fire, low sun, gold coming through a thin wall) or a saturated cold colour that is not plain blue (aurora green, deep violet, teal, rose).

VARIETY MANDATE, distribute the ${n} across: 4 DAYLIGHT THROUGH THE WHOLE CEILING (cool blue-white light coming through the ice above so the chamber glows evenly, soft blue shadows, one warm patch where the ice thins), 4 ONE BRIGHT OPENING (daylight coming down through a crack overhead and lying bright across the floor, the rest of the chamber deep and blue, the lit floor washed warm), 4 A WARM SOURCE AGAINST THE COLD (honey-gold lantern light making one small warm pool against all that blue, deep soft shadows reaching away; a small fire's amber light low on one side while the ice above stays cold), 3 GLOW RISING FROM UNDER THE FLOOR (soft light rising through the floor ice so every edge is lit from beneath in pale aqua and the vault stays deep and quiet), 3 AURORA AND MOON THROUGH A THIN CEILING (green and violet light moving slowly across the ice from above, the floor washed jade; moonlight through thin ice laying silver on the floor with one warm window of light far off), 3 RIPPLING WATER LIGHT (light off the still meltwater rippling in slow bands across the walls and the vault, the ice above dappled pale aqua, the low places deep teal), 2 DEEP BLUE TWILIGHT (the low quiet end of the range, the chamber deep indigo with the palest rose highlights along the top edges), 2 LOW SUN THROUGH A THIN WALL (warm apricot light coming through one thin wall of ice and turning the whole near half rose, the far half staying cold blue, shadows split warm and cool).

AXIS-CLEAN: ambient light only. The one frozen feature, the chamber's mass, the ice's architecture, the vault's shapes, the air, and any people belong to other axes and are absent here.
${LIGHTOBJ}
${WONDER}
ANTI-DULLNESS: every entry names a SOURCE, a DIRECTION and a COLOUR and gives the shadows a character. Flat, even, bleached, grey, overcast, colourless, and featureless light is too plain to use.
${CLEAN}
Examples: "DAYLIGHT THROUGH THE CEILING ICE: cool blue-white light coming through the ice overhead so the whole chamber glows evenly, shadows soft and blue, one warm gold patch where the ice thins"; "LANTERN AGAINST THE BLUE: honey-gold lantern light making one small warm pool low on the floor, deep blue shadows reaching away from it into the chamber"; "LOW SUN THROUGH THE THIN WALL: warm apricot light coming through one thin wall of ice and turning the near half rose, the far half staying cold blue, shadows split warm on one flank and cool on the other".
${FMT}` },

  vault: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} VAULT descriptions for PixelBot's ice-cavern path: the OVERHEAD layer of the ice chamber, its roof and its upper ice. Shapes and structure only. 12 to 25 words.

EVERY ENTRY CARRIES A FEATURE. Overhead is this interior's signature axis and stands in for the sky, so a plain ceiling makes the whole picture boring. Each entry names something to look at: a long white crack reaching across the dome, icicles at wildly different lengths, a thin glowing sheet, a ragged opening showing a band of dithered sky, trapped bubbles in rising lines, golden leaves held in the ice, a high ledge with a frozen rope, a dark throat of ice climbing out of sight.

VARIETY MANDATE, distribute the ${n} across: 4 THE SMOOTH BLUE DOME (a high dome of layered blue ice with its flat bands curving over, one long white crack reaching across it and stopping), 4 THE ICICLE-HUNG ROOF (the whole roof hung with icicles at very different lengths, thickest where it dips lowest, one far longer than the rest and apart from them), 4 THE THIN LUMINOUS CEILING (a ceiling thin enough to glow like a paper lamp; a thin sheet with the pale shapes of clouds crossing above it; a thin sheet with one small bird's shadow passing over it), 3 AN OPENING TO THE SKY (a ragged round opening high in the roof showing one band of dithered sky and a few sharp pixel stars, its rim catching the light), 3 TRAPPED THINGS OVERHEAD (the vault full of trapped bubbles held in rising lines; a scattering of golden leaves held in the ceiling ice at different depths; pale snowflakes frozen mid-fall in the roof ice), 3 SCALLOPED AND RIBBED VAULT (a vault scalloped into rounded hollows of uneven size; heavy ribs of ice climbing into the dark, one springing higher than the others), 2 LEDGES AND OPENINGS ABOVE (a high ice ledge running along one wall with one old frozen rope; a smaller chamber opening high in the wall with light in it), 2 THE DARK THROAT CLIMBING AWAY (the roof narrowing into a throat of ice climbing out of sight, its rim catching the light, its walls deep blue).

AXIS-CLEAN: the overhead layer only — the roof, the dome, the throat, the ledges above. The floor, the chamber's defining mass, the ice architecture below, the frozen feature, the ambient light, the air, and any people belong to other axes and are absent here.
${CARVING}
${PIXELMAT}
${IRREGULAR}
${WONDER}
${GEMGUARD}
${CONTINUOUS}
${CLEAN}
Examples: "THE DOME AND ITS LONG CRACK: a high dome of layered blue ice, its flat bands curving over, one long white crack reaching across it and stopping short"; "THE GLOWING THIN SHEET: a ceiling of ice thin enough to glow like a lit paper lamp, the pale shapes of clouds crossing slowly above it".
${FMT}` },

  air: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} AIR descriptions for PixelBot's ice-cavern path: what the AIR itself is doing inside a cold ice chamber. 12 to 25 words.

VARIETY MANDATE, distribute the ${n} across: 6 FROST FOG (a low layer of frost fog lying along the floor and hiding the feet of everything; fog hanging in one flat layer halfway up the chamber; a soft cold haze softening the far end to pale bands; fog pooling in the lowest corner and staying there; a thin veil of frost fog leaning toward an opening; a soft grey-blue haze layering the depth into flat steps), 5 DRIFTING ICE CRYSTALS (fine ice crystals turning slowly in the light and glittering as they pass; a slow fall of ice dust past the near edge; bright motes of ice hanging almost still in the cold air; ice dust settling soft on every ledge; a scatter of glittering crystals drifting down through the whole chamber), 5 BREATH OFF THE WATER (a soft white breath of mist standing over the open water and thinning as it lifts; mist lying low and still on a pool; a pale veil lifting off the meltwater and fading; warm mist clinging around the rim of a pool; a gentle white bloom of mist hanging over the lowest shelf), 5 CLEAR COLD AIR (the air so clear and cold that every far detail is crisp and hard-edged; a still glassy clarity with the deep end sharp; cold clean air with the far wall as sharp as the near one; the air washed clean and every band in the ice readable; a hard bright clarity all the way to the far wall), 4 SNOW COMING IN FROM ABOVE (a few flakes drifting in through the opening above and settling on the floor; a thin fall of powder coming down through a crack and lying in a small heap; loose powder lifting off a ledge and settling again; a light dust of snow drifting down through the upper dark).

AXIS-CLEAN: the air only. The vault's shapes, the ambient light, the frozen feature, the chamber's ice, and any people belong to other axes and are absent here.
MOTION: fog lies, hangs, leans, pools and thins; mist lifts, stands and fades; ice crystals turn, drift, glitter and settle; flakes drift and settle; powder lifts and settles. Rushing, sweeping, swirling, streaming, blasting, billowing, and sheets are absent, and so are ribbons, bars, columns, and walls of anything.
${WONDER}
${CLEAN}
Examples: "FROST FOG ALONG THE FLOOR: a low layer of frost fog lying along the floor and hiding the feet of everything, the air above it clear and bright"; "GLITTERING ICE DUST: fine ice crystals turning slowly in the light and glittering as they drift past, a few settling soft on the nearest ledge".
${FMT}` },

  life: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} TINY-LIFE descriptions for PixelBot's ice-cavern path: a small living presence in a vast ice chamber, never the hero. 10 to 22 words. Everything is small and at a distance in the frame.

EVERY ENTRY SAYS SMALL, TINY, DISTANT, OR FAR, and every figure is turned away or seen from behind. An entry with no size or distance word renders at hero scale. Faces, close figures, groups, crowds, and armoured warriors are absent.

VARIETY MANDATE, distribute the ${n} across: 6 ONE SMALL FIGURE WITH A LANTERN, TURNED AWAY (one small figure far down the chamber holding a lantern, their back to us; a tiny figure on the ice stair with a lantern, turned away; a small figure at a pool's edge seen from behind; a tiny figure far off in a long coat, back to us, looking up), 5 SMALL BIRDS (a few small white birds dotted along a high ledge as tiny specks; one small bird gliding across the upper dark; a pair nesting in a high crack, tiny and easy to miss; three small birds far off on the longest icicle), 4 A SMALL ARCTIC ANIMAL FAR OFF (a small white fox picking along a far ledge, tiny in the frame; a small hare sitting still far down the floor; a little white weasel slipping along the base of the far wall), 4 SOMETHING UNDER THE CLEAR ICE (a few small silver fish tiny and far below the clear floor ice; a small seal turning slowly far below the clear floor ice; a tiny dark shape swimming far below and away), 3 TWO TINY FIGURES FAR OFF (two small figures far out on the ice bridge, small and turned away; two tiny figures at the far end with one lantern between them, backs to us), 3 A SMALL CREATURE IN THE WARM (a small round bird fluffed up on the warm stone beside the lantern, tiny; a pale moth turning slowly at the lantern glass; a small cat curled asleep on a warm ledge, small and far).
${WONDER}
${CONTINUOUS}
${GUARD}
${CLEAN}
Examples: "FIGURE WITH THE LANTERN, FAR OFF: one small figure far down the chamber holding a lantern, their back to us, tiny against the ice"; "BIRDS ON THE HIGH LEDGE: a few small white birds dotted along a high ledge as tiny specks, easy to miss".
${FMT}` },

  moment: { mvp: 25, scale: 50, prompt: (n) => `You are writing ${n} PASSING-MOMENT descriptions for PixelBot's ice-cavern path: a small lovely thing happening in the chamber right now. 10 to 22 words.

VARIETY MANDATE, distribute the ${n} across: 5 A DRIP AND A RING (a single drip falling from an icicle and landing bright; rings spreading slowly out across the still pool; one bright drop hanging at an icicle's tip and about to let go; a drip landing and the rings reaching the pool's scalloped lip), 4 LIGHT REACHING SOMETHING (the light just reaching the frozen shape in the wall and lifting it out of the dark; a warm patch of light climbing one ice step and stopping; the glow just touching the longest icicle's tip), 4 SOMETHING LETTING GO (a slab of frost sliding off a ledge and breaking soft on the floor; one long icicle just come away and lying whole on the ice; a small fall of powder letting go from the roof and settling), 4 SMALL DRIFTING THINGS (a single bright ice crystal turning over as it falls past the near edge; frost lifting off a ledge and turning slowly; one flake coming down through the whole chamber alone), 4 THE ICE SPEAKING (a new white crack reaching out across the floor ice and stopping; a thin white line running out under the clear floor; a fine web of new cracks reaching from one old one), 4 WATER AND AIR SETTLING (a bubble breaking the surface of the still pool; the mist thinning away to nothing; the pool going glassy still again; a last ring fading out across the water).

Everything is ice, water, light, frost, or small drifting things in motion. Drops fall and land, rings spread and fade, frost slides and settles, crystals turn and drift, cracks reach and stop, light climbs and fades. Rushing, sweeping, swirling, blasting, and streaks are absent.
${WONDER}
${CLEAN}
Examples: "THE DRIP AND THE RINGS: a single drip falling from an icicle and landing bright, rings spreading slowly out across the still pool"; "ONE CRYSTAL FALLING: a single bright ice crystal turning over as it falls past the near edge and going dim".
${FMT}` },

  palette: { mvp: 25, scale: 40, prompt: (n) => `You are writing ${n} PALETTE harmonies for PixelBot's ice-cavern path: a named harmony of 3 to 5 colours for a limited-palette pixel-art scene of a glowing ice cavern interior. 10 to 22 words, colour and light words ONLY (nouns of things, places, ice, and stone are absent). Every entry ends by attaching its bright accent to the LIGHT, in this shape: "..., warm gold only in the lit places".

EVERY ENTRY CARRIES ONE WARM OR SATURATED COUNTER-COLOUR AGAINST THE COLD. One warm accent against all that blue is the whole trick of this path; a harmony of four blues is a flat monochrome wash and is unusable. The accent may be warm (gold, honey, apricot, rose, coral, cream) or a saturated non-blue cold (jade, aurora green, violet, magenta).

DISTINCTNESS IS THE #1 RULE: every entry names a DIFFERENT set of colour words. Two entries may share at most ONE colour word between them. Reordering the same four colours into a new sentence counts as a duplicate and is unusable — reach for a new part of the colour vocabulary each time.

COLOUR VOCABULARY to draw from (mix freely, and invent neighbours of these): ice blue, glacier blue, pale cyan, aqua, turquoise, teal, sea green, jade, mint, seafoam, cerulean, cobalt, sapphire blue, indigo, navy, blue-black, periwinkle, lavender, lilac, violet, plum, mauve, orchid, magenta, rose, blush, coral, salmon, peach, apricot, amber, honey, butterscotch, pale gold, brass yellow, butter, cream, ivory, bone, chalk white, snow white, pearl, dove grey, warm grey, slate, steel, charcoal, near-black, walnut, umber, rust, ember orange, tangerine.

VARIETY MANDATE, distribute the ${n} across these FAMILIES (the family names the MOOD of the harmony, not its words — choose the words yourself and vary them entry to entry): 6 COLD-AND-ONE-WARM-LIGHT (the cold half of the range with one hot colour living only in the lit places), 5 DEEP JEWEL COLD (the saturated deep end, teal through violet, with a pale accent), 4 AQUA AND GOLD (the bright fresh end, a clean cold green-blue against a warm yellow), 4 NIGHT WITH AURORA COLOUR (blue-blacks and greys carrying one saturated green or violet), 3 PALE AND ROSE (the light high-key end, near-whites with a warm pink accent), 3 DUSK AND EMBER (the low quiet end, barely lit, with one small hot colour in it). The bright accent must also vary across the pool: warm gold, honey, white-hot cream, pale rose, hot apricot, jade, aurora green, warm ivory, coral.
${CLEAN}
Examples: "GLACIER AND HONEY: glacier blue, pearl, slate, blue-black, warm honey only in the lit places"; "DEEP TEAL AND ORCHID: deep teal, orchid, charcoal, seafoam, pale gold only where the light lands"; "AURORA NIGHT: navy, blue-black, dove grey, saturated jade only in the lit places".
${FMT}` },
};

(async () => {
  // camera is hand-authored — written verbatim, never generated.
  if (!only || only === 'camera') {
    const out = `${DIR}pixelbot_ice_cavern_camera.json`;
    fs.writeFileSync(out, JSON.stringify(CAMERA, null, 2));
    console.log(`✍️  hand-authored ${CAMERA.length} entries → ${out}\n`);
  }
  for (const [slot, cfg] of Object.entries(POOLS)) {
    if (only && only !== slot) continue;
    await generatePool({ outPath: `${DIR}pixelbot_ice_cavern_${slot}.json`, total: SCALE ? cfg.scale : cfg.mvp, append: SCALE, batch: 25, maxTokens: 8000, metaPrompt: cfg.prompt });
  }
})().catch((e) => { console.error(e); process.exit(1); });
