#!/usr/bin/env node
/**
 * PixelBot pixel-ruins — bespoke pools (PIXELBOT_SCENES_PLAN.md §3.12).
 * Ancient ruins reclaimed by nature, calm and beautiful: the ruin is the hero
 * at 40 to 60 percent of the frame, nature climbing it is the second read,
 * serene and romantic, never grim. Money-shot: light_shaft (the one light event
 * inside or through the ruin). 10 pools, axis-clean, positive-only. MVP 25 each;
 * --scale appends to production size.
 * Run: node scripts/gen-seeds/pixelbot/gen-pixel-ruins-pools.js [--only slot] [--scale]
 */
const { generatePool } = require('../../lib/seedGenHelper');
const DIR = 'scripts/bots/pixelbot/seeds/';
const SCALE = process.argv.includes('--scale');
const only = (() => { const i = process.argv.indexOf('--only'); return i >= 0 ? process.argv[i + 1] : null; })();
const FMT = `Format every entry exactly as 'CAPS TITLE: body' (a short capitalised title, a colon, then the body). Return ONLY a JSON array of strings.`;
const CLEAN = `POSITIVE ONLY: describe what is there; write no negations, no "no", no "never", no "without".`;
const SERENE = `TONE: serene and romantic throughout. This is beautiful decay in a gentle green world, the calm lovely ruin a classic game paints for its title screen. Gloom, dread, horror, battle, bones, and rot are absent from every entry; the words for them are absent too.`;
const NAMES = `NAMES: describe each place in plain visual terms. The names of famous real-world ruins, temples, countries, regions, and franchises are absent from every entry.`;
const CARVING = `CARVINGS: stone that carries imagery is described as "worn pictorial reliefs" plus the SHAPE carved (a carved sun, a coiled serpent, a leaping fish, a many-petalled flower, a spread-winged bird, a round moon face). Writing, letters, inscriptions, tablets, scrolls, and maps are absent.`;
const IRREGULAR = `IRREGULARITY: every stone arrangement is uneven and scattered. Pillars lean and stand at different heights, arches are half-fallen, stairs are off-centre, fallen drums lie tumbled at angles, the path wanders. Rows of matching upright stones, mirrored halves, and tidy formations are absent. COUNTS: where several like elements stand together the count is ODD and one of them is set apart (three columns of different heights with one leaning well out of true and a fourth broken to a stump). A single tree, stair, or pillar sits to ONE side of the frame; matched pairs flanking the hero are absent. INTERIORS: when the hero is an interior space, ONE off-centre mass carries it (a broken end wall, a roof slab fallen and leaning, a stair climbing a surviving corner, a tree standing in the middle of the floor), the space is seen across a corner, and the surviving uprights are few, of very different heights, and clustered to one side. Halls seen straight down their long axis with matching uprights ranked on both sides are absent.`;
const LIGHTOBJ = `LIGHT IS LIGHT, never an object: light spills, pours, slants, lies across, washes, dapples, glows, catches. The words shaft, column, pillar, bar, beam, wedge, and ribbon are absent when describing light.`;

const POOLS = {
  ruin: { mvp: 25, scale: 200, prompt: (n) => `You are writing ${n} RUIN descriptions for PixelBot's pixel-ruins path: ONE ancient stone ruin, reclaimed by nature, standing as the hero of a beautiful old-school pixel-art scene the way a classic 16-bit RPG paints the lost city on its title screen. Each entry names the STONE (its shape, its state, one or two specific features) and the TERRAIN it stands in. 30 to 50 words.

THE BAR: this is the picture a person stops scrolling for. Storied, specific, romantic. Chunky readable stone shapes a pixel artist would love to draw: a stepped pyramid-temple with a mouth of a doorway, a leaning half-arch, a round tower broken open into leaning fingers of stone, a broad stair climbing into green, a tumbled gateway of uneven blocks, a domed roof fallen open to the sky, a bridge of stone arches striding a valley, terraces stepping down a hillside. Every entry carries ONE CHARM DETAIL that makes it that ruin and no other: a stone frog fountain half-buried in moss, a bell still hanging in a broken arch, a tree growing straight up through a stairwell, a carved fish spout dripping into a green pool, a giant stone head tipped on its side smiling at the sky, a doorway that frames the valley beyond, a mosaic floor of chunky coloured tiles showing a sun.

${IRREGULAR}
${CARVING}

VARIETY MANDATE, distribute the ${n} across: 5 JUNGLE TEMPLE (a stepped temple in deep green, a low mossy shrine on a river bend, a stone gateway in the trees, a sunken courtyard, a carved spout house over a green pool), 3 SUNKEN CITY IN CLEAR SHALLOWS (walls and arches standing in waist-deep bright water, a stair descending into clear green, a tilted tower in a lagoon), 3 DESERT STONE PILLARS HALF IN SAND (leaning pillars of uneven height with dunes piled to their waists, a half-buried gateway, a fallen giant lying in the sand), 3 OVERGROWN CASTLE KEEP (a broken keep on a green hill, a round tower broken open, a courtyard gone to grass), 2 STONE CIRCLE ON A MOOR (tilted standing stones of uneven height on open heather, a fallen capstone on two uprights), 3 CLIFF MONASTERY (small stone buildings clinging to a cliff shelf, a stair cut into the rock face, a tiny chapel on a pinnacle), 2 FLOODED HALL (a wide open chamber with green water across its floor, its roof open in one corner), 2 TERRACES OF A LOST HILL CITY (stepped stone terraces climbing a hillside, a wandering stair between them), 2 AQUEDUCT STRIDING A VALLEY (a long line of uneven stone arches crossing a green valley, one arch fallen).

AXIS-CLEAN: the entry names the STONE and the TERRAIN only. What nature is doing to it (vines, roots, moss, water rising, sand creeping) belongs to the reclamation axis; light, time of day, weather, mist, sky, animals, and people belong to other axes and are absent here.
${SERENE}
${NAMES}
ANTI-DULLNESS: a bare wall, a plain square building, or a tidy line of matching columns is too plain to use. Every entry has shape, a charm detail, and something the eye can climb.
${CLEAN}
Examples: "STEPPED TEMPLE WITH THE FROG FOUNTAIN: a squat stepped stone temple in deep green, its wide stair climbing to a dark doorway, blocks tumbled loose along one flank, worn pictorial reliefs of a carved sun beside the door, a little stone frog fountain sitting crooked at the foot of the stair"; "TILTED TOWER IN THE LAGOON: a round stone tower leaning over bright shallow water, its top broken open into three leaning fingers of stone, a broken arch standing alone a few strides off, a stone stair running down into the clear green, small fish-shaped spouts along its base"; "HILL TERRACES WITH THE WANDERING STAIR: broad stone terraces stepping down a hillside at uneven heights, a stair wandering off-centre between them, a lopsided gateway on the middle terrace, a giant stone head tipped on its side at the bottom smiling at the sky".
${FMT}` },

  reclamation: { mvp: 25, scale: 200, prompt: (n) => `You are writing ${n} RECLAMATION descriptions for PixelBot's pixel-ruins path: what NATURE is doing to an ancient stone ruin. This is the second read of the picture, the green that makes the stone beautiful. 20 to 40 words. Each entry describes plant life, roots, water, or sand working on stone, and nothing else.

THE BAR: specific and tactile, the way a pixel artist draws it: a fat root arm gripping a block, a curtain of vines hanging over a doorway, moss furring every step in soft green pixels, a whole tree riding the top of a wall with its roots poured down the face, seagrass swaying in a flooded room, sand banked in a smooth curve against a pillar.

VARIETY MANDATE, distribute the ${n} across: 5 VINES AND CREEPERS (a hanging curtain over a doorway, cords lacing an arch, a wall stitched over in small leaves, flowering creeper spilling from a window opening, tendrils reaching across an opening), 4 ROOTS (a tree riding a wall with roots poured down it, roots gripping a block like fingers, roots lifting flagstones into gentle waves, a root arch grown through a gap), 4 MOSS LICHEN AND FERNS (moss furring every stair tread, pale lichen mapping a pillar in soft patches, ferns unrolling from cracks, a velvet green cap on a fallen drum), 3 TREES IN THE STONE (a slim tree growing straight up through a stairwell, a broad canopy resting on a roofless chamber, saplings lining a wall top like a hedge), 4 WATER (clear green water standing across a floor, seagrass and small corals on submerged blocks, a spring welling up through flagstones, a thin fall of water dropping from a broken channel into a pool), 3 SAND (dunes banked in smooth curves to a pillar's waist, sand drifted through a doorway in a fan, a floor half-buried with only the tops of blocks showing), 2 FLOWERS (wildflowers thick across a fallen terrace, blossom trees leaning over a courtyard wall).

AXIS-CLEAN: plants, roots, water, and sand on stone only. Light, weather, mist, sky, animals, people, and the ruin's own architecture beyond the surface being reclaimed belong to other axes and are absent here.
${SERENE} Growth here is healthy, lush, and gentle; the stone is being dressed in green, not eaten.
${CLEAN}
Examples: "VINE CURTAIN OVER THE DOORWAY: a heavy curtain of glossy vine hanging across a stone doorway, leaves layered in three greens, a few long tendrils swinging free of the stone"; "ROOTS POURED DOWN THE WALL: a broad tree riding the wall top, its pale roots poured down the face in thick cords that grip each block and knit into the ground"; "SEAGRASS IN THE FLOODED ROOM: clear green water across the floor, ribbons of seagrass leaning together over submerged blocks, small bright corals crusting the lower stones".
${FMT}` },

  light_shaft: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} LIGHT-EVENT descriptions for PixelBot's pixel-ruins path: the MONEY SHOT, the ONE beautiful thing the sun or the moon is doing inside or through an ancient ruin right now. 15 to 30 words.

${LIGHTOBJ} Light on water is described as rippling nets, wandering bright patches, or a glowing pool; coins, discs, jewels, and other objects made of light are absent (a light named as an object renders as that object). Write it as: a soft fan of god-rays slanting down through a broken roof, sunlight spilling through an arch and lying warm across a mossy floor, light rippling off green water onto a ceiling, dust turning slowly where the light reaches, a bright patch of sun caught on one stair tread, the far end of a passage glowing gold.

VARIETY MANDATE, distribute the ${n} across: 6 THROUGH A BROKEN ROOF (a soft fan of god-rays reaching the floor, a round patch of sun on flagstones under an open dome, light falling through gaps in fallen timbers in soft dappled shapes), 5 THROUGH AN ARCH OR DOORWAY (sun pouring through an archway and lying long across the ground, the doorway glowing gold with the land beyond bright in it, low sun filling a window opening), 5 ON WATER INSIDE THE RUIN (light rippling off green water onto the stone above it, the pool glowing from within where the sun reaches, bright coins of light dancing on a submerged floor), 3 DUST AND POLLEN IN THE LIGHT (motes turning slowly where the light reaches, pollen drifting bright through the lit air), 3 A PATCH OF SUN ON STONE (one warm patch caught on a mossy stair, a lit band running along a wall top while the base stays cool), 3 GLOW AT A DISTANCE (the far end of a passage glowing gold, the top of the tallest stone still lit while the rest has gone cool, moonlight washing a courtyard silver).

AXIS-CLEAN: this one light event only. The ambient light of the whole scene, the sky, weather, plants, animals, and the architecture itself belong to other axes and are named here only as the surface the light lands on.
${SERENE} The light is warm, inviting, and lovely; it makes the place feel blessed.
${CLEAN}
Examples: "GOD-RAYS THROUGH THE BROKEN ROOF: a soft fan of god-rays slanting down through the opening, spreading as it falls, resting in a bright pool on the green floor"; "SUN POURING THROUGH THE ARCH: warm sunlight pouring through the archway and lying long and gold across the mossy flagstones, the far land bright inside the opening"; "RIPPLE LIGHT ON THE CEILING: sunlight bouncing off the green pool and rippling in slow bright nets across the stone above it".
${FMT}` },

  light: { mvp: 25, scale: 100, prompt: (n) => `You are writing ${n} AMBIENT-LIGHT descriptions for PixelBot's pixel-ruins path: the base light over the whole scene, indoors or out. Each entry stacks TIME + DIRECTION + COLOUR OF THE LIGHT + HOW SHADOWS FALL. 15 to 30 words.

VARIETY MANDATE, distribute the ${n} across: 4 LATE GOLDEN AFTERNOON (low warm light from one side, long soft shadows), 4 EARLY MORNING (cool pale gold from low down, long gentle shadows, a fresh green cast), 3 GREEN CANOPY LIGHT (a soft green-gold light filtered through leaves, shadows dappled and moving), 3 SOFT HIGH CLOUD (an even pearl light with gentle wide shadows and colour still rich in the greens), 3 BLUE HOUR (deep blue and violet ambient after sunset, a warm band still low on one side, shadows merging softly), 3 MOONLIT NIGHT (cool silver light from above, blue shadows with clean edges, the stone pale), 3 A BREAK IN THE WEATHER (a bright clearing light sweeping one part of the scene while the rest stays cool and deep), 2 LOW GRAZING SUN (light skimming almost level along the stone so every carved edge stands out in relief).

AXIS-CLEAN: ambient light only. The one light event inside the ruin, the sky's shapes, rain, mist, plants, and animals belong to other axes and are absent here.
${LIGHTOBJ}
${SERENE}
ANTI-DULLNESS: every entry names a DIRECTION and a COLOUR and gives the shadows a character. Flat, bleached, colourless, even midday light is too plain to use; light here always has warmth or a cool jewel tone somewhere in it.
${CLEAN}
Examples: "LATE GOLDEN AFTERNOON: low honey light raking in from one side, long soft shadows stretching across the stone, greens turning warm and deep"; "HIGH MOON: cool silver light from above, the stone pale and the green gone blue, shadows short with clean hard edges".
${FMT}` },

  sky: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} SKY descriptions for PixelBot's pixel-ruins path: the OVERHEAD layer of a beautiful old-school pixel-art scene. Shapes and colours of the sky only. 12 to 25 words.

EVERY ENTRY CARRIES A FEATURE. The sky is pixel art's signature axis and a plain sky makes the whole picture boring. Each entry names something to look at: wide dithered colour bands, a huge soft moon, a scatter of cotton-puff clouds, sharp pixel stars, a pale arc of galaxy dust, a sun halo, a soft aurora curtain, high feathered streaks, a warm break in the cloud, a flight of tiny distant specks.

VARIETY MANDATE, distribute the ${n} across: 5 DITHERED COLOUR BANDS (stepped bands from horizon to crown in warm and cool graded pairs), 4 COTTON CLOUD PUFFS (rounded well-spaced puffs, rim-lit, generous sky between them), 3 BIG SOFT MOON (a large round moon low or high, pale and dithered, a faint halo ring), 3 STARS AND GALAXY (a dusting of sharp pixel stars, a soft pale arc of galaxy dust, a few brighter four-point stars), 3 HIGH FEATHERED STREAKS (thin combed cloud drawn in pale arcs across a graded blue), 3 SOFT PEARL LAYER WITH A BREAK (a gentle even cloud layer with one bright warm gap where colour shows through), 2 LOW DISTANT CLOUD BAND (a soft dark band resting along the far horizon with clear graded sky above it), 2 SOFT AURORA CURTAIN (a gentle rippling curtain high in a deep dithered sky with pixel stars showing through).

AXIS-CLEAN: the overhead sky only. Ground, stone, plants, the light event inside the ruin, rain, mist, and animals belong to other axes and are absent here. Clouds are soft moist masses that drape, spread, thin, and clear.
${SERENE}
${CLEAN}
Examples: "PEACH-TO-INDIGO BANDS: a graded sky stepped in wide dithered bands, warm apricot at the horizon rising through rose and lilac to a deep crown"; "BIG SOFT MOON: a huge round moon pale and softly dithered with a thin halo ring around it and a few sharp pixel stars beyond".
${FMT}` },

  air: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} AIR descriptions for PixelBot's pixel-ruins path: what the AIR itself is doing around an ancient ruin. 12 to 25 words.

VARIETY MANDATE, distribute the ${n} across: 6 MIST (a low mist lying between the stones, a valley mist below a cliff, mist rising off warm water, a thin veil among trees, mist thinning to clear air above, morning mist caught in the green), 5 HUMID HAZE (a warm green haze softening the far trees, heavy still jungle air, a soft golden haze over the valley, sea haze pale along the shallows, air thick and glowing near the ground), 5 DUST AND POLLEN (fine dust hanging still and golden, pollen drifting slowly, sand smoke streaming off a dune crest, dust settling after a stone has shifted), 5 DRIZZLE AND RAIN (a soft drizzle falling in fine dithered lines, steady rain in fine even lines, rain easing to a few last drops, a warm shower falling through sunlight), 4 AFTER THE RAIN (every stone wet and shining, water beading and dripping from leaves, steam lifting off warm stone, the air washed and clear with far detail sharp).

AXIS-CLEAN: air only. The sky's shapes, the ambient light, the ruin, plants, and animals belong to other axes and are absent here.
MOTION: rain falls in fine even dithered lines, mist lies and drifts and thins, dust turns and settles, steam lifts. Rushing, sweeping, swirling, and sheets are absent.
${SERENE}
${CLEAN}
Examples: "LOW MIST BETWEEN THE STONES: a soft knee-high mist lying between the fallen stones, thinning to clear bright air above"; "WARM GREEN HAZE: a humid golden-green haze softening the far trees into gentle layers, the near air clear".
${FMT}` },

  life: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} TINY-LIFE descriptions for PixelBot's pixel-ruins path: a small living presence in or near an ancient ruin, never the hero. 10 to 22 words. Everything is small and at a distance in the frame.

VARIETY MANDATE, distribute the ${n} across: 5 BIRDS (a pair nesting in a broken arch, a white bird standing in the shallows, small birds dotted along a wall top, a hawk circling far above, a bright bird on a hanging vine), 4 A FOX OR A CAT (a small fox trotting along a wall top, a fox curled in a sunlit corner, a cat picking its way over fallen stones), 3 MONKEYS (two small monkeys sitting on a high ledge, one hanging from a vine, a small group crossing a wall far off), 4 DEER AND GRAZERS (a deer standing small in a green courtyard, two deer at the tree line, goats high on a cliff ledge, a deer drinking at a pool), 4 A SINGLE TINY TRAVELLER (one small figure far along the path with a pack, seen from behind, tiny against the stone, a small figure sitting far off on a step looking out, a tiny figure at the water's edge, turned away), 3 WATER LIFE (a turtle on a submerged block, bright fish threading a flooded room, a heron standing still in the shallows), 2 INSECTS (butterflies drifting over a sunlit terrace, fireflies rising among the stones).

Every entry says small, tiny, distant, or far, and every figure is turned away or seen from behind. Faces, close figures, groups of people, explorers, and adventurers are absent.
${SERENE}
${CLEAN}
Examples: "PAIR NESTING IN THE BROKEN ARCH: two small birds at a nest tucked in the broken arch, one just landing, both tiny in the frame"; "TINY TRAVELLER ON THE PATH: one small figure far along the path with a pack on their back, seen from behind, tiny against the stone".
${FMT}` },

  moment: { mvp: 25, scale: 50, prompt: (n) => `You are writing ${n} PASSING-MOMENT descriptions for PixelBot's pixel-ruins path: a small lovely event happening in the scene right now. 10 to 22 words.

VARIETY MANDATE, distribute the ${n} across: 5 RAIN BEGINNING OR ENDING (the first drops darkening the stone, rain easing and the eaves beginning to drip, a warm shower falling through sunlight), 4 A FLOCK LEAVING (a flock bursting from the tower top and scattering, small birds lifting off a wall one after another), 4 PETALS AND LEAVES (blossom petals drifting down across the stair, leaves turning slowly down through the still air, seeds floating bright in the light), 4 THE SUN REACHING SOMETHING (the low sun just reaching the inside of the arch, the last light touching the tallest stone, the sun slipping behind the ruin and edging it in gold), 3 WATER MOVING (rings spreading across the still pool, a thin fall picking up and glittering, a wave washing gently through a sunken doorway), 3 MIST MOVING (mist lifting off the valley to show the stone, a soft mist rolling gently through the courtyard), 2 FIRST STARS OR FIREFLIES (the first stars coming out over the stone, fireflies beginning to rise among the ferns).

Everything is weather, light, water, or small drifting things in motion. Petals drift and turn, a flock bursts and scatters, rain falls in fine lines, mist lifts. Rushing, swirling, sweeping, and streaks are absent.
${SERENE}
${CLEAN}
Examples: "FIRST DROPS: the first fat drops of rain darkening the stone one spot at a time, rings starting on the pool"; "FLOCK LEAVING THE TOWER: a flock bursting from the tower top and scattering wide across the sky in small dark specks".
${FMT}` },

  camera: { mvp: 25, scale: 25, prompt: (n) => `You are writing ${n} CAMERA framings for PixelBot's pixel-ruins path: painterly framings that keep ONE ancient ruin as the hero filling 40 to 60 percent of the frame with its green surroundings layered around it. 10 to 22 words: where the CAMERA SITS plus what fills the frame. Refer to the hero only as "the ruin" so each framing fits any ruin.

VARIETY MANDATE, distribute the ${n} across: 6 FROM THE APPROACH (camera at ground level on the wandering path, the ruin rising ahead at mid-distance), 5 FROM INSIDE LOOKING OUT (camera inside the ruin looking out through an archway or a broken opening to the bright land beyond), 4 FROM A TERRACE OR SLOPE ABOVE (camera raised on a terrace or hillside looking down across the ruin into the valley), 4 FROM ACROSS THE WATER (camera on the far bank or out on a lagoon, the ruin standing beyond a wide foreground of water), 4 LOW AMONG THE FALLEN STONES (camera set low among tumbled blocks in the foreground, the ruin rising beyond them), 2 THROUGH THE GREEN (camera behind hanging vines or a fern in the near foreground, the ruin clear beyond).

Every framing is medium-wide or wide with layered depth: a near edge, the ruin in the middle, land and sky beyond. Close-ups, detail macros, interiors that hide the ruin, first-person views, overhead map views, and side-scrolling game views are absent. Every entry names where the CAMERA sits; postures of a viewer belong nowhere here.
${CLEAN}
Examples: "FROM THE APPROACH PATH: camera at ground level on the wandering path, the ruin rising ahead at mid-distance, green closing in on both sides"; "CAMERA LOW AMONG THE FALLEN STONES: camera set low among tumbled mossy blocks in the near foreground, the ruin rising large beyond them, sky above".
${FMT}` },

  palette: { mvp: 25, scale: 40, prompt: (n) => `You are writing ${n} PALETTE harmonies for PixelBot's pixel-ruins path: a named harmony of 3 to 5 colours for a limited-palette pixel-art scene of ancient stone dressed in green. 10 to 22 words, colour and light words ONLY (nouns of things, places, plants, and stone are absent). Every entry ends by attaching its bright accent to the LIGHT, in this shape: "..., warm gold only in the lit places".

VARIETY MANDATE, distribute the ${n} across: 7 GREEN-AND-STONE harmonies (deep jungle green, moss green, warm grey, sand), 5 WATER harmonies (jade, aqua, pale turquoise, soft sand, deep teal), 4 GOLDEN-HOUR harmonies (honey, amber, warm rose, deep green shadow), 4 COOL-EVENING harmonies (indigo, violet, slate, silver), 3 DESERT harmonies (warm ochre, pale sand, dusty rose, soft shadow blue), 2 MIST harmonies (pale sage, dove grey, soft pearl, muted green). The bright accent may vary: warm gold, honey, pale cream, soft rose, bright jade.
${CLEAN}
Examples: "JADE AND WARM STONE: deep jade, moss green, warm grey, pale sand, honey gold only in the lit places"; "VIOLET EVENING: indigo, violet, slate blue, soft silver, pale cream only where the light lands".
${FMT}` },
};

(async () => {
  for (const [slot, cfg] of Object.entries(POOLS)) {
    if (only && only !== slot) continue;
    await generatePool({ outPath: `${DIR}pixelbot_pixel_ruins_${slot}.json`, total: SCALE ? cfg.scale : cfg.mvp, append: SCALE, batch: 25, maxTokens: 8000, metaPrompt: cfg.prompt });
  }
})().catch((e) => { console.error(e); process.exit(1); });
