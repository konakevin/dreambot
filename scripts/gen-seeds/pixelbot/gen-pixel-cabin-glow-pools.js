#!/usr/bin/env node
/**
 * PixelBot pixel-cabin-glow — bespoke pools (PIXELBOT_SCENES_PLAN.md §3.2).
 * ONE dwelling lit from inside, in its landscape, at dusk or night. The window
 * glow is the money-shot. 9 pools, axis-clean, positive-only. MVP 25 each;
 * --scale appends to production size.
 * Run: node scripts/gen-seeds/pixelbot/gen-pixel-cabin-glow-pools.js [--only slot] [--scale]
 */
const { generatePool } = require('../../lib/seedGenHelper');
const DIR = 'scripts/bots/pixelbot/seeds/';
const SCALE = process.argv.includes('--scale');
const only = (() => { const i = process.argv.indexOf('--only'); return i >= 0 ? process.argv[i + 1] : null; })();
const FMT = `Format every entry exactly as 'CAPS TITLE: body' (a short capitalised title, a colon, then the body). Return ONLY a JSON array of strings.`;
const CLEAN = `POSITIVE ONLY: describe what is there; write no negations, no "no", no "never", no "without".`;

const POOLS = {
  dwelling_place: { mvp: 25, scale: 200, prompt: (n) => `You are writing ${n} STORYBOOK-DWELLING descriptions for PixelBot's pixel-cabin-glow path: ONE whimsical, charming, slightly magical little dwelling standing in its landscape, the hero of an old-school pixel-art painting (think the cottages of classic 16-bit adventure games: chunky, rounded, a bit exaggerated, instantly lovable). Each entry describes the BUILDING (its playful shape, roof, chimney, door, windows, one or two charming details) and the LAND it sits in. 30 to 50 words.

THE BAR: cute over cozy over realistic. Rounded exaggerated shapes: a roof like a pulled-down hat, a fat squat cottage, a tall thin house leaning slightly, a crooked chimney with a bend in it, a too-big round door, tiny round windows, shingles like fish scales, a mushroom-cap roof, a lantern on a bent post, a little plank bridge, a stone well with a tiny roof, a weathervane shaped like a fish or a fox. A LITTLE MAGIC is welcome as a detail (glowing moss on the steps, a few glowing mushrooms by the wall, a garden of oversized flowers, a mailbox shaped like a bird), always small and charming.

MASSING: every entry NAMES its shape so no two read alike (a squat single gable / twin gables / a long low crooked ridgeline / an L-shaped wing / a hat-shaped roof / a round stone hut / a stilt house / a leaning tower-house / a treehouse on a platform / a hillside burrow with a round door). Towers appear at most once.

VARIETY MANDATE, distribute the ${n} across: 5 SNOW (a fat little cabin drifted to its round windows, a snow-hatted stone hut, a lodge with icicle fringe), 5 FOREST (a crooked cottage in a mushroom clearing, a treehouse with a rope ladder, a moss-roofed cabin among giant oaks), 3 COAST OR CLIFF (a stubby lighthouse-house with a crooked lamp room, a stilt hut over the tide flats, a round stone cottage on a headland), 3 MOUNTAIN (a tiny hut on a ridge, a farmhouse with a bell tower in an alpine meadow), 3 MEADOW (a windmill cottage, a shepherd's wagon, a mill with a big wheel by a stream), 2 DESERT (a rounded adobe house with a blue door, a stone homestead among candy-striped rocks), 2 TROPICAL (a bamboo stilt house by a river, a palm-hat hut on a beach), 2 LAKE OR MARSH (a boathouse on pilings with a lantern, a reed-thatched round house on the shore).

AXIS-CLEAN: the entry names the BUILDING and the LAND only. Light, time of day, weather, snowfall, mist, sky, stars, and people belong to other axes and are absent here. Windows are named as windows, plain.
NAMES: describe the place; famous regions, landmarks, franchises, and characters are absent.
${CLEAN}
Examples: "FAT SNOW CABIN WITH A HAT ROOF: a squat little log cabin with a roof pulled down like a knitted hat, snow to its two round windows, a crooked stovepipe with a bend in it, a bent lantern post by the door, a frozen creek and spruce behind"; "CROOKED COTTAGE IN THE MUSHROOM CLEARING: a tall thin cottage leaning slightly, fish-scale shingles, a chimney that bends twice, a too-big round door, a ring of oversized toadstools around the yard, giant oaks closing the clearing"; "WINDMILL COTTAGE IN THE MEADOW: a fat round stone cottage with a windmill cap, four patched sails, a little plank bridge over a brook, a stone well with its own tiny roof, wildflowers to the door".
${FMT}` },

  dusk_night_light: { mvp: 25, scale: 100, prompt: (n) => `You are writing ${n} LIGHT descriptions for PixelBot's pixel-cabin-glow path: the base ambient light of an EVENING or NIGHT landscape painting. Every entry is after sunset. Each entry stacks TIME + DIRECTION + COLOUR OF THE AMBIENT LIGHT + HOW SHADOWS FALL. 15 to 30 words.

VARIETY MANDATE: 5 blue hour (indigo and violet ambient, a last warm band low in the west), 5 deep night under a high moon (cool silver light, hard-edged blue shadows), 4 last afterglow (the sun just gone, rose-orange ambient fading upward to blue), 3 starry moonless night (very dim blue-black ambient, forms read as silhouette), 3 aurora-lit night (a faint green wash from above, soft double shadows), 3 overcast snow night (the land glowing pale from snow, a flat dim grey-blue ambient), 2 storm-lit night (dim, with brief flat flashes lighting the land).
AXIS-CLEAN: ambient light only. Snowfall, mist, fog, clouds, stars, and the moon's SHAPE belong to other axes and are absent here (the moon may be named only as the light source). Window light belongs to another axis and is absent here.
${CLEAN}
Examples: "BLUE HOUR: deep indigo ambient light from the whole sky, one last band of apricot low in the west, shadows soft and merging into the dusk"; "HIGH MOON: cool silver light from straight overhead, snow and roofs pale, shadows short and sharp-edged and deep blue".
${FMT}` },

  air: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} AIR descriptions for PixelBot's pixel-cabin-glow path: what the AIR itself is doing around a dwelling at night. 12 to 25 words.

VARIETY MANDATE: 6 snowfall in different characters (a light flurry, fat slow flakes, a fine steady fall, wind-driven snow, snow just ending, drifting sparkle), 5 mist or fog (ground mist in the meadow, valley fog, sea fog, mist over water, a thin haze), 5 crisp clear frost (still and sharp, breath-cold, dry cold, clear after snow, clear mountain air), 4 drizzle or rain (soft drizzle, steady rain, rain easing, a wet after-rain shine), 3 wood-smoke haze (thin smoke hanging low, a smoke layer across the clearing, a drifting resin-scented haze), 2 dust or sand haze for dry places.
AXIS-CLEAN: air only. Light and time words, clouds and stars, the dwelling, and animals belong to other axes and are absent here.
${CLEAN}
Examples: "FAT SLOW FLAKES: big soft snowflakes drifting straight down through still air, settling silently on every ledge"; "GROUND MIST: a knee-high white mist lying across the meadow, thinning to clear air above".
${FMT}` },

  window_glow: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} WINDOW-GLOW descriptions for PixelBot's pixel-cabin-glow path: the MONEY SHOT, what the light from inside the dwelling DOES to the night outside it. 15 to 30 words. The glow is warm (candle, oil lamp, hearth, lantern) and it is the brightest thing in the picture.

VARIETY MANDATE: 5 amber window squares thrown out across the snow or ground, 4 an open door spilling a long wedge of gold across the path, 3 chimney smoke lit from below by a window, 3 a porch lantern or a lantern hung by the door with a small pool of light, 3 light through frost-flowered or rain-streaked glass, 2 a single candle in one window of an otherwise dark house, 3 window light doubled in wet ground, a puddle, or still water, 2 firelight flickering red-orange in the windows.
AXIS-CLEAN: the dwelling's own light only. The sky, ambient light, weather, and animals belong to other axes and are absent here. Light is described as light (a glow, a wedge, a pool, a square, a shimmer), never as an object.
${CLEAN}
Examples: "AMBER SQUARES ON SNOW: two warm window squares laid long across the drifted snow, their edges softening into the blue"; "OPEN DOOR WEDGE: the door stands open and a wedge of gold light runs down the steps and along the path, steam-bright at its source".
${FMT}` },

  sky: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} NIGHT-SKY descriptions for PixelBot's pixel-cabin-glow path: the sky layer over an evening or night scene, stars, moon, aurora, and cloud forms only. 12 to 25 words.

VARIETY MANDATE: 5 a field of stars (dense, sparse, a bright band of the Milky Way, a few big stars, stars between thin cloud), 3 a thin crescent moon, 3 a full or gibbous moon, 3 aurora curtains in green and violet rippling overhead, 4 low heavy snow cloud with a faint glow, 3 a storm clearing with ragged cloud and gaps of stars, 2 high thin cloud veiling the stars, 2 a bank of cloud along the horizon under a clear top.
AXIS-CLEAN: sky only. Ambient light colour, the ground, the dwelling, and snowfall belong to other axes and are absent here. Clouds are soft moist masses that drape, spread, thin, and clear.
${CLEAN}
Examples: "DENSE STAR FIELD: a sky crowded with stars from horizon to zenith, a soft pale band of the Milky Way arcing across"; "LOW SNOW CLOUD: a flat heavy ceiling of cloud, faintly lit from below, its underside soft and even".
${FMT}` },

  life: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} TINY-LIFE descriptions for PixelBot's pixel-cabin-glow path: a small living presence at or near a dwelling at night, never the hero. 10 to 22 words. Everything is small in the frame.

VARIETY MANDATE: 4 a cat silhouetted in a lit window, 4 a dog curled or standing on the porch, 4 deer at the tree line, 3 an owl on a post or a branch, 3 a small figure at the woodpile or the door, turned away, seen from behind, small, 2 a horse in a paddock, 2 geese or ducks by the water, 2 a fox crossing the snow, 1 sheep bunched by a wall.
Every entry says small, tiny, or far. Faces, close figures, and groups are absent.
${CLEAN}
Examples: "CAT IN THE WINDOW: the small dark shape of a cat sitting in one lit window, watching the night"; "FIGURE AT THE WOODPILE: a small bundled figure at the woodpile with an armful of logs, seen from behind, turned toward the door".
${FMT}` },

  moment: { mvp: 25, scale: 50, prompt: (n) => `You are writing ${n} PASSING-MOMENT descriptions for PixelBot's pixel-cabin-glow path: a small event happening in the scene right now. 10 to 22 words.

VARIETY MANDATE: 5 the first snow of the evening beginning, 4 chimney smoke rising straight up into still air, 3 a lamp being lit and a window coming on, 3 aurora rippling brighter, 3 a shooting star crossing, 2 a gust lifting snow off the roof in a plume, 2 the door opening and light spilling out, 3 rain easing off and the eaves dripping.
Everything is weather, light, smoke, or water in motion, never an object.
${CLEAN}
Examples: "FIRST FLAKES: the first thin flakes of the evening beginning to fall, catching in the window light"; "ROOF PLUME: a gust lifting a plume of powder off the roof ridge and carrying it glittering into the dark".
${FMT}` },

  camera: { mvp: 25, scale: 25, prompt: (n) => `You are writing ${n} CAMERA framings for PixelBot's pixel-cabin-glow path: painterly framings that keep ONE dwelling as the hero at mid-distance with its landscape wrapping it. 10 to 22 words: the camera position plus what dominates the frame. Refer to the building only as "the dwelling" so the framing fits any building type.

VARIETY MANDATE: 5 from the approach path at ground level, the path empty ahead, 4 from across a frozen lake or still water with the dwelling on the far shore, 4 from the tree line looking into the clearing, 4 slightly elevated on a hillside looking down at the dwelling, 3 through falling snow with the dwelling beyond, 3 from the far bank or shore, 2 low from the meadow grass.
Framings are medium-wide or wide. Close-ups, interiors, first-person views, and overhead map views are absent.
${CLEAN}
Examples: "FROM THE APPROACH PATH: ground level, the empty path running ahead to the dwelling at mid-distance, forest rising dark behind it, sky above"; "ACROSS THE FROZEN LAKE: a wide view over the ice, the dwelling small and warm on the far shore beneath a big sky".
${FMT}` },

  palette: { mvp: 25, scale: 40, prompt: (n) => `You are writing ${n} PALETTE harmonies for PixelBot's pixel-cabin-glow path: a named harmony of 3 to 5 colours for a limited-palette pixel-art NIGHT painting, where the night is cool and the dwelling's window light is the single warm note. 10 to 22 words, colour and light words ONLY (nouns of things and places are absent). Every entry ends by attaching the warm note to the window light, in this shape: "..., warm amber only in the window light".

VARIETY MANDATE: 8 blue-hour harmonies (indigo, violet, dusk rose), 6 deep-night harmonies (navy, slate, silver, ink), 4 aurora harmonies (teal, green, violet, near-black), 4 afterglow harmonies (dusk orange fading to blue, plum, charcoal), 3 overcast-snow harmonies (pale grey-blue, dove, pearl). The warm window note may vary: warm amber, candle gold, hearth orange, lantern yellow.
${CLEAN}
Examples: "INDIGO DUSK: deep indigo, violet, dusty rose, slate blue, warm amber only in the window light"; "AURORA NIGHT: near-black, deep teal, soft green, pale violet, candle gold only in the window light".
${FMT}` },
};

(async () => {
  for (const [slot, cfg] of Object.entries(POOLS)) {
    if (only && only !== slot) continue;
    await generatePool({ outPath: `${DIR}pixelbot_pixel_cabin_glow_${slot}.json`, total: SCALE ? cfg.scale : cfg.mvp, append: SCALE, batch: 25, maxTokens: 8000, metaPrompt: cfg.prompt });
  }
})().catch((e) => { console.error(e); process.exit(1); });
