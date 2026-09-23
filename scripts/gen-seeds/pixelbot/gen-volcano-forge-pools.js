#!/usr/bin/env node
/**
 * PixelBot volcano-forge — bespoke pools (PIXELBOT_SCENES_PLAN.md §3.x shape,
 * modelled on §3.12 pixel-ruins). A volcanic forge INTERIOR: the dwarven
 * smithy / forge hall a classic game paints for its title screen. The
 * furnace-and-anvil HEART is the hero at 40 to 60 percent of the frame, the
 * working gear is the second read, and the hall's vault layers away above it.
 * Money-shot: fire_event (the ONE light event the fire is doing right now).
 *
 * The path's whole risk is GRIM INDUSTRIAL REALISM (a foundry photograph, a
 * hellish Mordor pit). Every recipe therefore carries the WONDER tone mandate
 * and the hero pool mandates ONE MAGICAL CHARM DETAIL per entry — that is what
 * makes it read as a game's forge instead of a factory.
 *
 * 10 pools, axis-clean, positive-only. MVP 25 each; --scale appends to
 * production size. `camera` is HAND-AUTHORED (playbook: Sonnet-generated camera
 * pools leak time-of-day / light / terrain / hero-type / posture verbs into
 * every entry) and is written verbatim by this script, no Sonnet call.
 *
 * Run: node scripts/gen-seeds/pixelbot/gen-volcano-forge-pools.js [--only slot] [--scale]
 */
const fs = require('fs');
const { generatePool } = require('../../lib/seedGenHelper');
const DIR = 'scripts/bots/pixelbot/seeds/';
const SCALE = process.argv.includes('--scale');
const only = (() => { const i = process.argv.indexOf('--only'); return i >= 0 ? process.argv[i + 1] : null; })();

const FMT = `Format every entry exactly as 'CAPS TITLE: body' (a short capitalised title, a colon, then the body). Return ONLY a JSON array of strings.`;
const CLEAN = `POSITIVE ONLY: describe what is there; write no negations, no "no", no "never", no "without".`;
const WONDER = `TONE: warm, wondrous, and whimsical throughout. This is the proud working forge a classic game paints for its title screen, a place of craft and a little magic, hot and bright and inviting. Industrial grime, factory and foundry language, hellish and demonic imagery, dread, war, battle, weapons being used, bones, gore, ruin, and misery are absent from every entry; the words for them are absent too.`;
const NAMES = `NAMES: describe everything in plain visual terms. The names of real places, real mountains, real companies, myths, gods, games, films, and franchises are absent from every entry.`;
const CARVING = `CARVINGS: stone or metal that carries imagery is described as "worn pictorial reliefs" plus the SHAPE carved (a carved flame, a hammer, a sun, a coiled serpent, a spread-winged bird, an anvil, a mountain, a round moon face). This exact wording is the only safe form and it renders clean. Writing, letters, numbers, runic text, inscriptions, plaques, tablets, scrolls, maps, ledgers, gauges, dials, and price boards are absent. The words MARK, MARKS, MARKINGS, GLYPH, SIGIL, STAMPED, ENGRAVED, ETCHED, SCRIPT, and CHARACTERS are absent too: every one of them renders as pseudo-lettering (a "glowing anvil ringed with softly glowing marks" rendered rune-like gibberish across the anvil, its dais and the walls, 2026-09-23). A glowing carved shape is written as "a worn pictorial relief of a carved flame that glows softly from within the iron".`;
const PLAIN = `PLAIN SURFACES: every banner, shield, crate, sack, barrel, cloth, and flat iron face is described as plain and unmarked, or as carrying one simple pictorial symbol.`;
const IRREGULAR = `IRREGULARITY: every arrangement is uneven and off-centre. Arches spring at different heights, the floor steps down unevenly, stairs climb one corner, timbers sag, the gear is scattered where it was last used. Matched pairs flanking the hero, mirrored halves, and tidy rows of identical objects are absent. COUNTS: where several like pieces stand together the count is ODD and one of them is set apart (three bellows of different sizes with the smallest hooked well away from the others). A single stair, pillar, or hoist sits to ONE side of the frame.`;
const LIGHTOBJ = `LIGHT IS LIGHT, never an object: light spills, pours, washes, slants, lies across, climbs, dapples, glows, catches, edges. The words shaft, column, pillar, bar, beam, wedge, ribbon, cone, ring, coin, disc, and halo are absent when describing light.`;
const PIXELMAT = `PIXEL MATERIALS: crystal, glass, obsidian, and ice are described as having chunky stepped sides that catch the light in flat bands. The words facet, faceted, polygon, polygonal, smooth, glossy, and mirror-finish are absent.`;
const NOSTEAM = `MACHINERY REGISTER: the gear of this forge is stone, timber, iron, leather, rope, chain, and water. Brass instruments, pressure gauges, dials, clockwork, gears-as-decoration, pistons, boilers, rivet-studded plate, and steampunk goggles belong to another bot and are absent.`;
const GUARD = `REGISTER GUARD: this is a forge at WORK, not a battle arena, not a lava dungeon, not a ruin. Dragons, knights, monsters, bosses, combat, and adventuring parties are absent. A small fire lizard or salamander is the only creature this world keeps, and it belongs to a different axis.`;

// ─────────────────────────────────────────────────────────────────────────────
// HAND-AUTHORED camera pool (25). Every entry: where the CAMERA sits + what
// fills the frame + an ANGLE (playbook, ruins R2→R3: an architectural hero
// framed only by distance and position renders square-on and mirrored). The
// hero is referred to only as "the forge" so each framing fits any forge. No
// posture verbs, no time of day, no light, no air, no hero type.
// ─────────────────────────────────────────────────────────────────────────────
const CAMERA = [
  'ACROSS THE HALL FLOOR: camera at eye level out on the open floor, the forge set three-quarters away so one wall recedes into the picture, gear scattered near.',
  'FROM THE CORNER OF THE FLOOR: camera low in a corner of the hall, the forge across the diagonal, the far wall falling away to one side.',
  'OFF THE ANVIL DAIS: camera at floor level a few strides off the dais, the forge turned three-quarters, the hall opening out behind it.',
  'PAST THE NEAR PILLAR: camera at eye level with one stone pillar closing the near edge, the forge three-quarters on beyond it.',
  'FROM THE COOL END: camera at eye level at the hall\'s quiet end, the forge glowing three-quarters away down the floor, depth stacked between.',
  'BESIDE THE ORE CHUTE: camera at eye level at the foot of a stone chute, the forge angled away across the floor, one wall running off to the side.',
  'IN THE ARCHED DOORWAY: camera standing in a wide stone doorway, its jambs framing the near edges, the forge three-quarters on inside.',
  'THROUGH THE SIDE ARCH: camera just outside a side arch looking in at an angle, the forge set deep and turned, the hall widening past it.',
  'AT THE TOP OF THE ENTRY STAIR: camera at the head of a short stair inside the entry, looking down and across at the forge below.',
  'UNDER THE LINTEL: camera close under a heavy stone lintel, the forge beyond it three-quarters on, the vault hidden by the lintel\'s edge.',
  'FROM THE THRESHOLD GAP: camera in a broken gap in the hall\'s wall, the forge angled away inside, rubble closing the near edge.',
  'FROM THE HIGH GALLERY: camera up on a timber gallery looking down across the forge at an angle, the floor and its gear laid out below.',
  'OVER THE STAIR RAIL: camera on a stone stair partway up the wall, the forge below and turned, the rail\'s uneven posts crossing the near edge.',
  'FROM THE LEDGE ABOVE: camera on a stone ledge high on one side, the forge three-quarters below, the hall\'s depth running away past it.',
  'DOWN FROM THE CATWALK: camera on a plank catwalk under the roof, the forge far below at an angle, everything foreshortened.',
  'LOW AMONG THE GEAR: camera set low among the working gear in the near foreground, the forge rising three-quarters on beyond it.',
  'BEHIND THE QUENCH TROUGH: camera low behind a long stone trough, its lip closing the near edge, the forge angled away past it.',
  'AT THE CART\'S WHEEL: camera down at the height of a cart wheel in the foreground, the forge three-quarters on and large beyond.',
  'BEHIND THE STACKED STOCK: camera low behind a heap of stock in the near corner, the forge turned away above and past it.',
  'FROM THE FLOOR CHANNEL: camera set low beside a channel cut in the floor, the channel leading the eye at an angle to the forge.',
  'BACK TOWARD THE BRIGHT MOUTH: camera deep in the hall looking back at the forge and the wide opening beyond it, one wall receding.',
  'FROM THE DARK END: camera far back where the hall runs out, the forge small and three-quarters on with the whole floor between.',
  'PAST THE HANGING CHAIN: camera at eye level with a chain hanging close in the near edge, the forge turned three-quarters well beyond it.',
  'ALONG THE HALL\'S LENGTH: camera set to one side of the hall\'s long axis so that wall recedes hard, the forge sitting off-centre in it.',
  'ALONG THE SHAFT LINE: camera at eye level under the long timber shaft that runs the hall, the forge off to one side and turned away.',
];

const POOLS = {
  forge: { mvp: 25, scale: 200, prompt: (n) => `You are writing ${n} FORGE descriptions for PixelBot's volcano-forge path: ONE volcanic forge interior, the hall a classic 16-bit RPG paints on its title screen when you reach the mountain smithy. Each entry names the BUILT HALL (its shape, its furnace, one or two specific built features) and WHERE INSIDE THE MOUNTAIN it sits. 30 to 50 words.

THE BAR: this is the picture a person stops scrolling for. Storied, specific, proud, warm. Chunky readable shapes a pixel artist would love to draw: a huge arched furnace mouth breathing orange, a broad anvil on a stone dais, heavy timber gantries, a bridge of black stone over a glowing channel, stairs cut into the rock, a chimney throat climbing out of sight.

EVERY ENTRY CARRIES ONE MAGICAL CHARM DETAIL that makes it that forge and no other, and it is a made or carved or magical THING, never a living creature: a great glowing heart-crystal set in the furnace's throat with chunky stepped sides burning from within, an anvil carrying a worn pictorial relief of a carved flame that glows softly from within the iron, a finished blade hanging by itself in the air above the anvil drinking the light, a stone face carved over the furnace so its open jaw is the fire door, a hammer that hangs in the air on its own, a pale warm egg nested in the coal bed, a bellows worked by a carved stone arm, a lantern of trapped fire swinging on a chain, a shrine niche with a carved flame and three lit candles, a cracked dark bell in an arch glowing along its crack, a stair of floating stone steps, a carved serpent spout dripping molten light into a stone bowl.

${IRREGULAR}
${CARVING}
${PIXELMAT}

VARIETY MANDATE, distribute the ${n} across: 5 DWARVEN GREAT FORGE (a vaulted stone hall cut into the mountain, one huge arched furnace mouth, a broad anvil on a stone dais, heavy timber-and-iron gantries overhead), 4 LAVA-FED SMITHY (a forge built over a bright molten channel running through its floor, stone sluice gates, a low bridge of black stone across it), 3 CALDERA LEDGE WORKSHOP (a workshop on a wide stone ledge inside the mountain's open crater, the glowing throat far below, a roof of timber and hide), 3 TOWER FORGE (a tall narrow forge stacked in levels up a chimney of stone, a stair winding one wall, the furnace at the bottom), 3 CAVE FORGE BY A STEAMING POOL (a low rough cave forge beside a still hot pool, stalactites of uneven length overhead, a worn stone floor), 3 OBSIDIAN GLASS FORGE (a hall of black glassy volcanic stone with chunky stepped sides that throw the fire back in flat bands), 2 OPEN-SIDED FORGE ON THE MOUNTAIN'S FLANK (a forge hall high on the volcano's shoulder, open through wide arches to the air), 2 BELLOWS AND WATER-WHEEL HOUSE (the great bellows house beside the furnace, its timber wheel in a race of dark water).

AXIS-CLEAN: the entry names the BUILT HALL, its furnace, its anvil, and its charm detail only. The movable working gear (bellows, crucibles, hoists, carts, troughs, grindstones) belongs to the machinery axis; the one fire event, the ambient light, the ceiling, smoke and steam, people and creatures belong to other axes and are absent here.
${WONDER}
${GUARD}
${NAMES}
ANTI-DULLNESS: a bare stone room, a plain square furnace, or a tidy line of matching pillars is too plain to use. Every entry has shape, a charm detail, and something the eye can climb.
${CLEAN}
Examples: "GREAT FORGE WITH THE HEART-CRYSTAL: a vaulted stone hall cut deep into the mountain, one huge arched furnace mouth breathing orange at its far end, a broad anvil on a stone dais set off to one side, timber gantries crossing above at uneven heights, a great glowing heart-crystal set in the furnace's throat with chunky stepped sides burning from within"; "MOLTEN CHANNEL SMITHY WITH THE FLOATING HAMMER: a low stone smithy built astride a bright molten channel that runs across its floor, a black stone bridge over it set off-centre, three stone sluice gates of different sizes along one edge, and a heavy hammer hanging by itself in the air above the anvil"; "OBSIDIAN HALL WITH THE CARVED SERPENT SPOUT: a hall of black glassy volcanic stone whose chunky stepped sides throw the fire back in flat bands, a wide arched furnace low in one wall, a stair cut into the rock climbing one corner, a carved serpent spout dripping molten light into a worn stone bowl".
${FMT}` },

  machinery: { mvp: 25, scale: 200, prompt: (n) => `You are writing ${n} WORKING-GEAR descriptions for PixelBot's volcano-forge path: the MOVABLE MACHINERY of a mountain forge. This is the second read of the picture, the gear that makes the hall a working place. 20 to 40 words. Each entry describes working gear and nothing else.

THE BAR: specific and tactile, the way a pixel artist draws it: a leather bellows the size of a rowboat with its timber arms up, a wooden wheel turning in a race of dark water, a crucible cradled in an iron ring on a swing arm, a chain hoist hanging from a beam with one great hook, a barrow tipped where it was left.

VARIETY MANDATE, distribute the ${n} across: 5 BELLOWS (a great leather bellows the size of a rowboat with its timber arms raised, three bellows of different sizes with the smallest hooked well away from the others, a bellows linked by a leather strap to a shaft in the wall, a small hand bellows leaning against the stone), 4 WATER-WHEEL AND SHAFTS (a wooden wheel turning slowly in a race of dark water, a long timber shaft running the hall's length with leather straps hanging off it, a cluster of wooden cogs of different sizes in a timber cradle), 4 CRUCIBLES AND MOULDS (a crucible cradled in an iron ring on a swing arm, a long-handled ladle resting across a stone lip, a bed of sand moulds pressed in rough shapes, a tipping cradle standing over a mould bed), 4 CHAINS AND HOISTS (a chain hoist hanging from a timber beam with one great hook, a counterweight of stacked stone hanging on a rope, a set of chains at uneven lengths hooked to a ring, a timber crane arm swung out over the floor), 4 ORE CARTS AND CHUTES (a small iron-bound cart tipped at the foot of a stone ramp, a chute of black stone spilling broken ore into a heap, a barrow half full and left where it stood, a stack of split timber and a wicker basket of charcoal), 4 QUENCH TROUGHS AND STONES (a long stone trough of dark water with its plank lid pushed aside, a great grindstone on a timber frame with its treadle, a rack of tongs and hammers at uneven lengths with one hung apart, a low stone bench worn smooth with punches and chisels scattered on it).

AXIS-CLEAN: the movable working gear only. The hall's own stone, its furnace, and its anvil belong to the forge axis; the one fire event, the ambient light, the ceiling, smoke and steam, people and creatures belong to other axes and are absent here.
${NOSTEAM}
${PLAIN}
${IRREGULAR}
${WONDER}
${GUARD}
${CLEAN}
Examples: "THE ROWBOAT BELLOWS: a leather bellows the size of a rowboat wedged against the stone, its timber arms raised high, brass-free iron bands strapping its ribs, its nozzle sunk into the wall at an angle"; "WHEEL IN THE DARK RACE: a wooden wheel turning slowly in a race of dark water cut through the floor, its paddles dripping, a long timber shaft running off it down the hall with leather straps hanging loose"; "TIPPED CART AT THE RAMP'S FOOT: a small iron-bound cart tipped on its side at the foot of a stone ramp, broken ore spilled in a heap around it, a wicker basket of charcoal set apart nearby".
${FMT}` },

  fire_event: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} FIRE-EVENT descriptions for PixelBot's volcano-forge path: the MONEY SHOT, the ONE beautiful thing the forge's fire is doing right now. 15 to 30 words.

${LIGHTOBJ} Write the light by what it DOES to whatever is nearest: "the light climbing the walls as it falls", "everything nearest edged in gold", "the stone under it washed rose". PLACE-AGNOSTIC: name the DETAIL KIND, never a specific surface this forge might not have. Write "whatever stands nearest catches the glare along its top edges, deep shadow pooling behind it", never "the hull planking" or "the tent canvas".

VARIETY MANDATE, distribute the ${n} across: 5 A CRUCIBLE POUR (a thread of molten gold falling from a tipped crucible into the mould bed, the light climbing the walls as it falls, everything nearest edged in gold), 5 SPARKS (a fountain of sparks leaping off the anvil and drifting up into the dark, sparks skittering out across the floor and going out one by one, a slow shower of sparks falling past the near edge), 5 A QUENCH (a blade going down into the trough and a soft white burst of steam blooming up around it, the water glowing from within for a moment, the whole near air gone pale), 4 THE FURNACE MOUTH OPENING (the fire door swung wide and orange light washing out low across the floor, the far wall suddenly warm to the waist and dark above), 3 A GLOWING WORKPIECE (a bar drawn out white-hot and lying across the anvil, its light pooling on the stone beneath it and fading out into the room), 3 MOLTEN FLOW (molten rock creeping bright along a channel and lighting everything above it from below, the highest stone still cool and deep).

AXIS-CLEAN: this one fire event only. The ambient light of the whole hall, the hall's stone, the working gear, the ceiling, the air, and any people or creatures belong to other axes and are named here only as the surfaces the light lands on.
${WONDER} The light is warm, generous, and lovely; it makes the place feel blessed and alive.
${CLEAN}
Examples: "THE CRUCIBLE POUR: a bright thread of molten gold falling from a tipped crucible into the mould bed, the light climbing the walls as it falls, everything nearest edged in gold"; "SPARK FOUNTAIN OFF THE ANVIL: a fountain of orange sparks leaping off the anvil and drifting slowly up into the dark, the nearest edges picked out and flickering"; "THE QUENCH BURST: a blade going down into the trough and a soft white burst of steam blooming up around it, the water glowing from within for a moment".
${FMT}` },

  light: { mvp: 25, scale: 100, prompt: (n) => `You are writing ${n} AMBIENT-LIGHT descriptions for PixelBot's volcano-forge path: the base light over the whole forge hall. This is an INTERIOR lit mostly by its own fire. Each entry stacks SOURCE + DIRECTION + COLOUR OF THE LIGHT + HOW SHADOWS FALL. 15 to 30 words.

VARIETY MANDATE, distribute the ${n} across: 5 FIRELIGHT FROM ONE SIDE (deep orange light from low on one side, long shadows reaching away across the floor, the far side of everything gone warm brown), 4 FURNACE GLOW FROM BELOW (warm light rising from floor level so every edge is lit from underneath and the whole upper hall stays deep and soft), 4 COOL DAY MEETING THE FIRE (pale blue light falling in from an opening high up and meeting warm orange from the furnace, shadows split cool on one side and warm on the other), 3 EMBER LOW LIGHT (a dim red bed of coals as the only source, the hall in deep warm shadow with only soft red edges showing), 3 LANTERN-LIT (a few hanging lanterns making small pools of honey light with deep gentle gaps of shadow between them), 3 MOLTEN UNDERLIGHT (a low amber light lying along the floor from a molten channel, the walls washed rose to the waist and dark and cool above), 3 BLUE HOUR THROUGH THE ARCHES (deep violet evening light coming in through open arches against the hall's own warm orange, shadows merging softly at the join).

AXIS-CLEAN: ambient light only. The one fire event, the ceiling's shapes, smoke, steam, the hall's stone, the gear, and any people belong to other axes and are absent here.
${LIGHTOBJ}
${WONDER}
ANTI-DULLNESS: every entry names a SOURCE, a DIRECTION and a COLOUR and gives the shadows a character. Flat, even, bleached, grey, colourless, and featureless light is too plain to use; the light here always has heat in it or a cool jewel tone somewhere against the heat.
${CLEAN}
Examples: "FIRELIGHT FROM ONE SIDE: deep orange light raking in low from one side, long shadows reaching away across the worn floor, every far surface turning warm brown"; "COOL DAY MEETING THE FIRE: pale blue light falling from an opening high above and meeting warm orange from below, shadows split cool on one flank and warm on the other".
${FMT}` },

  vault: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} VAULT descriptions for PixelBot's volcano-forge path: the OVERHEAD layer of the forge hall, its roof and its upper architecture. Shapes and structure only. 12 to 25 words.

EVERY ENTRY CARRIES A FEATURE. Overhead is this interior's signature axis and a plain ceiling makes the whole picture boring. Each entry names something to look at: heavy ribs climbing into the dark, a carved keystone, uneven timber beams with iron straps, stalactites of different lengths, a chimney throat rimmed with warm light, a long glowing crack, a timber gallery with uneven posts, a stone stair climbing one corner, corbels carved as simple animal heads, a ragged opening showing a band of dithered sky.

VARIETY MANDATE, distribute the ${n} across: 5 STONE VAULTS AND RIBS (a high arched vault of fitted stone with heavy ribs climbing into the dark, one keystone carrying a worn pictorial relief of a carved flame, an arch springing higher on one side than the other), 4 TIMBER ROOF (a great open roof of uneven timber beams strapped with iron, boards missing in one corner, a sagging purlin held by a single post), 4 RAW CAVE ROOF (a rough ceiling of black stone with stalactites at very different lengths, one long crack glowing faintly along its length, a low shoulder of rock pushing down on one side), 4 CHIMNEY THROAT (the ceiling opening into a tall round chimney of stone that climbs out of sight, its walls soot-dark and its rim catching warm light), 3 A SLICE OF SKY THROUGH AN OPENING (a ragged opening high in the roof showing one band of dithered evening sky and a few sharp pixel stars, its edges lit), 3 GALLERIES AND WALKWAYS ABOVE (a timber gallery running high along one wall with a rail of uneven posts, a stone stair climbing to it in one corner), 2 CARVED CORBELS AND BRACKETS (stone corbels carved as simple animal heads holding the vault's ribs, one broken away to a stump).

AXIS-CLEAN: the overhead layer only — the roof, the vault, the chimney, the galleries above. The floor, the furnace, the anvil, the working gear, the light, smoke and steam, and any people belong to other axes and are absent here.
${CARVING}
${IRREGULAR}
${WONDER}
${CLEAN}
Examples: "RIBBED VAULT WITH THE CARVED KEYSTONE: a high arched stone vault, heavy ribs climbing into the dark, one keystone carrying a worn pictorial relief of a carved flame"; "CHIMNEY THROAT ABOVE: the ceiling opening into a tall round stone chimney climbing out of sight, its soot-dark walls rimmed with warm light at the lip".
${FMT}` },

  air: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} AIR descriptions for PixelBot's volcano-forge path: what the AIR itself is doing inside a hot mountain forge. 12 to 25 words.

VARIETY MANDATE, distribute the ${n} across: 6 SMOKE (a slow coil of dark smoke rising off the coal bed, smoke hanging in one flat layer under the roof, a thin thread of smoke leaning toward an opening, smoke pooling in the highest corner and staying there, soot-blue smoke lying along a wall, a lazy curl rising and thinning away), 5 STEAM (a soft white cloud of steam standing over the trough and thinning as it rises, steam lifting off wet stone in slow soft threads, warm steam hanging low over still water, a gentle white veil of steam softening the far end, steam clinging around the base of the gear), 5 ASH AND FLOATING EMBERS (fine grey ash drifting slowly down through the whole hall and settling on every ledge, a few bright embers floating slowly upward and going dark, ash lying soft on every flat surface, glowing motes turning slowly in the warm air, a slow fall of pale ash past the near edge), 5 HEAT SHIMMER AND GLOWING HAZE (the air over the furnace mouth wobbling so the far wall bends gently behind it, a warm orange haze filling the hall and softening the far arches, the air thick and glowing near the floor, a heat wobble along the top of everything hot, warm haze layering the depth into soft bands), 4 COOL CLEAN AIR AND DRAUGHT (clear cool air coming in low from one side so the near air is sharp and the far end stays hazy, the air washed clean and every far detail crisp, a cool draught thinning the smoke to nothing near the floor, cold clear air meeting the heat in a soft line).

AXIS-CLEAN: the air only. The ceiling's shapes, the ambient light, the one fire event, the hall's stone, the gear, and any people belong to other axes and are absent here.
MOTION: smoke rises, coils, leans, hangs, curls, pools and thins; steam lifts, stands and thins; ash drifts, falls and settles; embers float and go dark; heat wobbles. Rushing, sweeping, swirling, streaming, blasting, billowing, and sheets are absent, and so are ribbons, bars, and walls of anything.
${WONDER}
${CLEAN}
Examples: "SMOKE LAYER UNDER THE ROOF: dark smoke hanging in one flat layer under the roof, the air below it clear and warm"; "STEAM OVER THE TROUGH: a soft white cloud of steam standing over the dark water and thinning gently as it rises".
${FMT}` },

  life: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} TINY-LIFE descriptions for PixelBot's volcano-forge path: a small living presence in a mountain forge, never the hero. 10 to 22 words. Everything is small and at a distance in the frame.

VARIETY MANDATE, distribute the ${n} across: 6 A SMITH AT WORK, SMALL AND TURNED AWAY (one small smith at the far anvil with their back to us and the hammer raised, a small figure leaning on the bellows arm seen from behind, a tiny smith crouched at the furnace door turned away, a small figure far off with a long ladle, their back to us), 5 A FIRE LIZARD OR SALAMANDER (a small orange salamander curled asleep in the warm coal bed, a little fire lizard sitting on a stone lip watching the flames, tiny in the frame, a small salamander sunning itself on a warm ledge far off), 4 AN APPRENTICE OR HELPER AT A DISTANCE (a small figure far off pushing a barrow along the wall, seen from behind, a tiny helper on the stair carrying a bundle, turned away), 4 CREATURES IN THE WARM (a small black cat asleep on a warm ledge, a pair of pale cave moths circling a lantern far off, a small goat picking along a high ledge, a tiny frog on a wet stone by the water), 3 FIGURES ON THE GALLERY ABOVE (two tiny figures leaning on the high gallery rail, small and far, their backs to us, one small figure at the rail looking down into the hall, turned away), 3 SMALL BIRDS UNDER THE ROOF (a few small birds dotted along a high beam as tiny specks, one small bird gliding across the upper dark, a pair nesting in a high crack).

Every entry says small, tiny, distant, or far, and every figure is turned away or seen from behind. Faces, close figures, groups of people, crowds, and armoured warriors are absent.
${WONDER}
${CLEAN}
Examples: "SMITH AT THE FAR ANVIL: one small smith at the far anvil with their back to us, hammer raised, tiny against the stone"; "SALAMANDER IN THE COAL BED: a small orange salamander curled asleep in the warm coal bed, tiny and easy to miss".
${FMT}` },

  moment: { mvp: 25, scale: 50, prompt: (n) => `You are writing ${n} PASSING-MOMENT descriptions for PixelBot's volcano-forge path: a small lovely event happening in the forge right now. 10 to 22 words.

VARIETY MANDATE, distribute the ${n} across: 5 THE HAMMER FALLING (the hammer just landing and a ring of sparks leaping off the hot bar, the hammer at the top of its lift and everything still for a beat), 4 SOMETHING LIFTED OR SET DOWN (a hook taking the weight of a glowing bar and the chain going tight, a finished blade just laid on the stone to cool, a mould lid lifted away and light spilling out), 4 THE FIRE ANSWERING (the coals settling and brightening for a moment, a log giving way and the bed of coals slumping bright, the fire door easing shut and the room going warm and dim), 4 WATER AND STEAM (rings spreading out across the quench trough, the last of the steam thinning away to nothing, a drip falling from a wet chain and landing bright), 4 SMALL DRIFTING THINGS (a single bright ember sailing slowly up into the dark, ash lifting off a ledge and turning slowly over, a feather of soot drifting down past the near edge), 4 LIGHT REACHING SOMETHING (the furnace glow just reaching the carved keystone overhead, the last of a pour's light fading off the far wall, a warm patch of light climbing one stair tread and stopping).

Everything is fire, light, metal, water, or small drifting things in motion. Embers sail and drift, sparks leap and scatter, steam thins, ash turns and settles, light climbs and fades. Rushing, sweeping, swirling, blasting, and streaks are absent.
${WONDER}
${CLEAN}
Examples: "THE HAMMER LANDING: the hammer just landing and a ring of bright sparks leaping off the hot bar"; "ONE EMBER RISING: a single bright ember sailing slowly up into the dark above the coals and going out".
${FMT}` },

  palette: { mvp: 25, scale: 40, prompt: (n) => `You are writing ${n} PALETTE harmonies for PixelBot's volcano-forge path: a named harmony of 3 to 5 colours for a limited-palette pixel-art scene of a hot stone forge lit by its own fire. 10 to 22 words, colour and light words ONLY (nouns of things, places, stone, and metal are absent). Every entry ends by attaching its bright accent to the LIGHT, in this shape: "..., bright gold only in the lit places".

DISTINCTNESS IS THE #1 RULE: every entry names a DIFFERENT set of colour words. Two entries may share at most ONE colour word between them. Reordering the same four colours into a new sentence counts as a duplicate and is unusable — reach for a new part of the colour vocabulary each time.

COLOUR VOCABULARY to draw from (mix freely, and invent neighbours of these): ember orange, tangerine, apricot, persimmon, rust, brick red, oxblood, maroon, garnet, dull crimson, rose, blush, coral, salmon, peach, honey, amber, butterscotch, mustard, ochre, brass yellow, pale gold, cream, bone, ivory, pale ash, dove grey, warm grey, taupe, umber, soot brown, walnut, bronze, copper, verdigris, muted teal, sage, olive, slate blue, steel blue, cobalt, periwinkle, indigo, violet, plum, lilac, mauve, charcoal, blue-black, coal black, near-black.

VARIETY MANDATE, distribute the ${n} across these FAMILIES (the family names the MOOD of the harmony, not its words — choose the words yourself and vary them entry to entry): 7 HOT-AND-DARK (a fire colour against deep darks and a warm neutral), 5 GOLDEN (the warm yellow half of the range, light to deep), 4 COOL-DARK WITH A FIRE ACCENT (blue-blacks and greys with one hot colour in them), 4 WARM-AGAINST-COOL (a hot colour set directly against a cool one, with a soft neutral between), 3 DIM AND DEEP (the low, quiet end, barely lit), 2 EARTH-AND-PATINA (browns, coppers, and a muted green or teal). The bright accent must also vary across the pool: bright gold, white-hot cream, honey, pale rose, pale aqua, warm ivory, hot apricot.
${CLEAN}
Examples: "EMBER AND SOOT: deep ember orange, coal black, warm grey, soot brown, bright gold only in the lit places"; "PERSIMMON AND STEEL: persimmon, steel blue, taupe, plum shadow, white-hot cream only where the light lands"; "BRONZE PATINA: bronze, umber, muted verdigris, bone, pale aqua only in the lit places".
${FMT}` },
};

(async () => {
  // camera is hand-authored — written verbatim, never generated.
  if (!only || only === 'camera') {
    const out = `${DIR}pixelbot_volcano_forge_camera.json`;
    fs.writeFileSync(out, JSON.stringify(CAMERA, null, 2));
    console.log(`✍️  hand-authored ${CAMERA.length} entries → ${out}\n`);
  }
  for (const [slot, cfg] of Object.entries(POOLS)) {
    if (only && only !== slot) continue;
    await generatePool({ outPath: `${DIR}pixelbot_volcano_forge_${slot}.json`, total: SCALE ? cfg.scale : cfg.mvp, append: SCALE, batch: 25, maxTokens: 8000, metaPrompt: cfg.prompt });
  }
})().catch((e) => { console.error(e); process.exit(1); });
