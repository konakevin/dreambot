#!/usr/bin/env node
/**
 * PixelBot pixel-vista — bespoke pools (PIXELBOT_SCENES_PLAN.md §3.8).
 * A great natural landform as the HERO of a pixel-art PAINTING (no character).
 * 9 pools. Every recipe is axis-clean + positive-only. MVP total 25; scale
 * later with --scale (append). Run: node scripts/gen-seeds/pixelbot/gen-pixel-vista-pools.js [--only slot] [--scale]
 */
const { generatePool } = require('../../lib/seedGenHelper');
const DIR = 'scripts/bots/pixelbot/seeds/';
const SCALE = process.argv.includes('--scale');
const only = (() => { const i = process.argv.indexOf('--only'); return i >= 0 ? process.argv[i + 1] : null; })();
const FMT = `Format every entry exactly as 'CAPS TITLE: body' (a short capitalised title, a colon, then the body). Return ONLY a JSON array of strings.`;
const CLEAN = `POSITIVE ONLY: describe what is there; write no negations, no "no", no "never", no "without".`;

const POOLS = {
  landform: { mvp: 25, scale: 200, prompt: (n) => `You are writing ${n} LANDFORM descriptions for PixelBot's pixel-vista path: a great natural landform as the HERO of a pixel-art painting. Each entry is ONE specific landform described as GEOLOGY + SHAPE + SCALE + TERRAIN: what it is made of, how it is shaped, how big it reads, what grows on it. 30 to 50 words.

THE BAR: a place so grand a person stops scrolling, the kind of vista that fills a wall. Specific and believable: real rock, real landforms (hanging valleys, arêtes, sea stacks, mesas, ice shelves, dune seas, terraced hills, braided rivers).

VARIETY MANDATE, distribute the ${n} across: 4 MOUNTAINS (granite spires, a glaciated massif, a volcanic cone, a knife-edge ridge), 3 CANYONS (a slot canyon, a layered red canyon, a river gorge), 4 FJORDS OR SEA CLIFFS, 3 DESERTS (a dune sea, a salt flat, badlands), 2 VOLCANIC (a black lava coast, a caldera lake), 2 ARCTIC OR GLACIAL (an ice shelf edge, a glacier tongue), 4 HILLS OR VALLEYS (terraced, rolling, a river valley, a highland plateau), 3 ISLANDS OR LAKES.

AXIS-CLEAN: the entry names the LAND and what grows on it only. Light, time of day, weather, clouds, sky, animals, people, and buildings all belong to other axes and are absent here.
NAMES: describe the geology; a famous viewpoint, park, or landmark name is absent (a broad region as flavour is fine: "a northern fjord coast").
FOREST FORMS: trees stand at irregular spacing, uneven girth, some leaning, scattered across slopes.
${CLEAN}
Examples: "GLACIER-CARVED GRANITE VALLEY: a U-shaped valley of pale grey granite walls three thousand feet high, hanging side-valleys spilling ribbon waterfalls, a braided river across the flat green floor, scattered old pines leaning on the lower slopes"; "RED SLOT CANYON: a narrow winding canyon of rust and cream sandstone, walls sculpted into smooth waves and ribs, a strip of pale sand along the floor, the walls leaning together far overhead"; "BASALT SEA STACKS: three black columnar basalt stacks standing off a black-sand beach, their tops capped with wind-cropped grass, surf boiling white around their feet".
${FMT}` },

  light: { mvp: 25, scale: 100, prompt: (n) => `You are writing ${n} LIGHT descriptions for PixelBot's pixel-vista path: the base ambient light of a landscape painting. Each entry stacks TIME OF DAY + DIRECTION + COLOUR OF THE LIGHT + HOW SHADOWS FALL. 15 to 30 words.

VARIETY MANDATE: 5 dawn or first light, 5 late golden light, 4 clear midday, 4 soft overcast, 4 blue hour or dusk, 3 moonlight.
AXIS-CLEAN: light only. Fog, rain, clouds, god-rays, rainbows, and landform nouns belong to other axes and are absent here.
${CLEAN}
Examples: "FIRST LIGHT FROM THE EAST: low pink-gold sun raking in from the right, long violet shadows, the high faces lit while the low ground stays dim"; "OVERCAST PEARL: even silver daylight from a bright grey sky, shadows soft and almost absent, colours calm and true"; "BLUE HOUR: the sun just gone, cool indigo light from the whole sky, one last warm glow on the western edge".
${FMT}` },

  air: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} AIR descriptions for PixelBot's pixel-vista path: what the AIR itself is doing in a landscape painting. 12 to 25 words.

VARIETY MANDATE: 6 crisp clear air in different flavours (cold and clear, dry and clear, washed clean after rain, thin high-altitude air, warm still air, clear with a light breeze), 4 mist or fog (valley mist, a low fog bank, sea fog, morning haze), 3 dust or heat haze, 3 drizzle or thin rain veils, 3 snow flurry or blowing snow, 3 sea spray or waterfall spray, 3 distant smoke haze.
AXIS-CLEAN: air only. Light and time words, clouds and sky, and landform nouns belong to other axes and are absent here.
${CLEAN}
Examples: "COLD CLEAR AIR: sharp and dry, every far ridge crisp, the distance reading in clean steps of paler tone"; "VALLEY MIST: a low white mist pooled along the valley floor, thinning as it rises, the upper slopes clear above it".
${FMT}` },

  light_moment: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} LIGHT-MOMENT descriptions for PixelBot's pixel-vista path: the ONE dramatic light EVENT that makes the picture, the money shot. 15 to 30 words.

VARIETY MANDATE: 5 alpenglow or first sun striking one peak or one rim while the rest waits in shadow, 4 a storm break with a single beam reaching the ground, 4 crepuscular rays fanning through a gap, 4 the sun low behind the landform (a backlit rim, a sunstar at its edge), 3 moonrise or moonlight laid across water or snow, 3 a sunset colour wash climbing the cliffs, 2 one clean lightning fork far off, briefly lighting the land.
AXIS-CLEAN: the event only. The base light, general weather, and the landform belong to other axes and are absent here. Light is described as light (beams, glow, a wash, a rim), never as an object.
${CLEAN}
Examples: "ALPENGLOW ON THE HIGHEST PEAK: the summit alone burning rose-orange for a minute while every lower slope waits in blue shadow"; "STORM BREAK: one wide beam of sun punching through a torn cloud and laying a bright pool of light on the valley floor".
${FMT}` },

  sky: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} SKY descriptions for PixelBot's pixel-vista path: the sky layer only, cloud forms and the character of the sky. 12 to 25 words.

VARIETY MANDATE: 5 a clean clear dome, 5 towering cumulus or stacked cloud towers, 4 high cirrus or a mackerel sky, 3 a distant storm wall or a far rain curtain, 3 a soft cloud cap draped over a summit, described as cloud (moist, feathered edges, clinging to the peak), 3 a banded gradient sky with a few small clouds, 2 a night sky with a field of stars and the Milky Way arch.
AXIS-CLEAN: sky and clouds only. Time-of-day light words and landform nouns belong to other axes and are absent here. Clouds are made of moist air with soft feathered edges; they drape, cap, stream, and build.
${CLEAN}
Examples: "TOWERING CUMULUS: great white cloud towers stacking up over the horizon, flat grey bases, sunlit crowns, small blue gaps between"; "MACKEREL SKY: a high rippled sheet of small cloud scales across most of the sky, thin enough to glow".
${FMT}` },

  life: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} TINY-LIFE descriptions for PixelBot's pixel-vista path: a small scale-prover that proves how big the landform is. 10 to 22 words. It is tiny in the frame, far away, a speck or a line of specks.

VARIETY MANDATE: 5 a flock of birds, 4 a lone tree or a thin tree line, 4 a tiny caravan or a lone walker far off on a path, 3 grazing animals as specks (mountain goats, sheep, reindeer, wild horses), 3 a single small boat on the water, 3 one eagle or hawk soaring, 3 a herd or migration seen as dots from above.
Every entry says tiny, far, or specks. Faces, close figures, and groups near the camera are absent.
${CLEAN}
Examples: "TINY CARAVAN: a line of three pack animals and a walker as specks on the switchback trail, far below the ridge"; "ONE LONE PINE: a single wind-bent pine on the near ridge, small against the enormous face beyond".
${FMT}` },

  moment: { mvp: 25, scale: 50, prompt: (n) => `You are writing ${n} PASSING-MOMENT descriptions for PixelBot's pixel-vista path: a small event or phenomenon crossing the scene. 10 to 22 words.

VARIETY MANDATE: 5 a rain curtain crossing far off, 4 a rainbow, 3 snow beginning to fall, 3 a rockfall dust plume on a far face, 3 cloud shadows racing across the land, 3 a waterfall's spray blown sideways by a gust, 2 one lightning fork far away, 2 a flock lifting all at once.
Everything is described as weather, light, water, or living things in motion, never as objects.
${CLEAN}
Examples: "CLOUD SHADOWS RACING: broad dark cloud shadows sliding fast across the sunlit hills, the land flickering light and dark"; "SPRAY BLOWN SIDEWAYS: a gust catching the waterfall and carrying its white spray out across the cliff face".
${FMT}` },

  camera: { mvp: 25, scale: 25, prompt: (n) => `You are writing ${n} CAMERA framings for PixelBot's pixel-vista path: painterly framings for a wide pixel-art painting of a landform. 10 to 22 words: the camera position plus what dominates the frame. Every framing keeps the WHOLE landform readable with sky above it.

VARIETY MANDATE: 5 wide from a facing ridge, 4 from the valley floor looking up, 4 from the shore looking across water, 3 from a high pass or saddle, 3 along the canyon or fjord looking down its length, 3 low from a scree slope or beach with the landform towering, 3 slightly elevated from a foothill.
Framings are wide or medium-wide landscape views. Close-ups, detail shots, first-person views, map views, and side-scrolling views are absent.
${CLEAN}
Examples: "FROM THE FACING RIDGE: wide view straight across the valley, the landform filling the middle and upper frame, sky above, the near ridge as a dark base"; "ALONG THE FJORD: looking down the length of the water, cliffs converging toward the far mouth, sky in a band above".
${FMT}` },

  palette: { mvp: 25, scale: 40, prompt: (n) => `You are writing ${n} PALETTE harmonies for PixelBot's pixel-vista path: a named harmony of 3 to 5 colours plus one accent for a limited-palette pixel-art painting. 10 to 20 words, colour and light words ONLY (nouns of things and places are absent).

VARIETY MANDATE: 6 warm dawn or dusk harmonies, 6 cool harmonies (slate, cobalt, silver, teal, ice), 5 earth harmonies (ochre, rust, sage, cream, umber), 4 high-contrast harmonies (deep indigo or near-black with one hot accent), 4 soft misty harmonies (pale greys, lavender, pearl, a faint warm note).
${CLEAN}
Examples: "COLD DAWN: slate blue, pale rose, dove grey, one warm amber accent"; "DESERT EARTH: ochre, rust red, sun-bleached cream, sage green, a deep umber shadow tone".
${FMT}` },
};

(async () => {
  for (const [slot, cfg] of Object.entries(POOLS)) {
    if (only && only !== slot) continue;
    await generatePool({ outPath: `${DIR}pixelbot_pixel_vista_${slot}.json`, total: SCALE ? cfg.scale : cfg.mvp, append: SCALE, batch: 25, maxTokens: 8000, metaPrompt: cfg.prompt });
  }
})().catch((e) => { console.error(e); process.exit(1); });
