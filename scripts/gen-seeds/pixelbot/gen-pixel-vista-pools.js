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
const WHIMSY_LAW = "WHIMSY LAW (Kevin, 2026-09-19): this is a whimsical, somewhat magical storybook world with old-school game charm, the vista an old RPG would put on its title screen. Rounded, exaggerated, charming shapes; saturated colour; a little magic. Realistic geography, documentary landscape, and grim tones are absent.";
const CLEAN = `POSITIVE ONLY: describe what is there; write no negations, no "no", no "never", no "without".`;

const POOLS = {
  landform: { mvp: 25, scale: 200, prompt: (n) => `You are writing ${n} STORYBOOK LANDFORM descriptions for PixelBot's pixel-vista path: a charming, slightly magical landform as the HERO of a whimsical pixel-art painting. Each entry is ONE landform described by SHAPE + what it is made of + what grows on it + its one charming exaggeration. 25 to 45 words.

${WHIMSY_LAW}
VARIETY MANDATE, distribute the ${n}: 5 ROLLING HILLS (candy-green, patchwork, a winding river or road between them), 4 CROOKED MOUNTAINS (a single leaning peak, a snow cap like frosting, a spiral path), 3 MUSHROOM-ROCK TOWERS OR HOODOOS (rounded caps, stacked like pancakes), 3 COAST BAYS (a crescent bay, pastel cliffs, a sea stack with a tuft of trees), 3 GLOWING WATERFALL GORGES (a waterfall that catches light like glass), 2 DUNE SEAS (soft rounded dunes in candy stripes of sand), 2 SNOWY PEAKS (frosting caps, sparkling), 3 ISLANDS IN A LAKE (a round island with one giant tree or a tiny hill village).
AXIS-CLEAN: the land and what grows on it only. Light, time, weather, sky, animals, people, and the charm detail belong to other axes. A famous place name is absent.
${CLEAN}
Examples: "CANDY-GREEN PATCHWORK HILLS: soft rounded hills quilted in bright green and gold fields, hedgerows like stitching, a winding blue river looping between them, a few puffball trees on every crest"; "THE LEANING PEAK: one tall crooked mountain leaning slightly to the left, its summit capped in snow like a dollop of frosting, a spiral path climbing its flank, wildflower meadows at its feet".
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

  light_moment: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} MAGICAL LIGHT-MOMENT descriptions for PixelBot's pixel-vista path: the ONE gently magical light event that makes the picture, the money shot. 15 to 30 words. Light is described as light (a glow, a path, a soft shaft, a sparkle), never as an object.

${WHIMSY_LAW}
VARIETY MANDATE: 5 a waterfall or river glowing softly from within, 4 a moon path laid across still water, 4 fireflies or sparkles drifting over the valley, 4 soft sunbeams fanning through a cloud gap, 3 aurora ribbons waving gently, 3 glowing mushrooms or flowers lighting a slope at dusk, 2 a slow shooting star leaving a soft trail.
AXIS-CLEAN: the light event only. The base light, the sky, and the landform belong to other axes.
${CLEAN}
Examples: "GLOWING WATERFALL: the waterfall lit softly from within, pale aqua light spilling down the rock and pooling in a glowing basin below"; "FIREFLY DRIFT: hundreds of tiny warm sparks drifting slowly up from the valley floor, each one a soft golden glow".
${FMT}` },

  sky: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} STORYBOOK SKY descriptions for PixelBot's pixel-vista path: the sky layer of a whimsical pixel-art painting, the kind of sky an old RPG paints in bands. 12 to 25 words.

${WHIMSY_LAW}
VARIETY MANDATE: 6 an OVERSIZED moon (a huge pale moon low over the land, a crescent big as a hill), 6 candy-coloured gradient BANDS (peach into lavender into teal, stacked in soft steps), 4 a field of twinkling stars with one long shooting star, 5 puffy cotton-ball clouds drifting in a friendly row, 4 a soft sun with a gentle halo or a ring of rainbow haze.
AXIS-CLEAN: sky only. Landform nouns, animals, and people are absent. Clouds are soft, round, and friendly; they drift and puff.
${CLEAN}
Examples: "OVERSIZED PALE MOON: a huge soft moon sitting low and enormous over the land, gently glowing, a few small stars around it"; "CANDY BANDS: the sky stacked in soft bands from peach at the horizon through pink and lavender to deep teal overhead".
${FMT}` },

  life: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} CHARM-DETAIL descriptions for PixelBot's pixel-vista path: one tiny charming detail that makes the landscape a storybook place, far off and small, never the hero. 10 to 22 words.

${WHIMSY_LAW}
VARIETY MANDATE: 5 a tiny cottage with a curl of chimney smoke, 4 a little windmill or water mill, 3 a lighthouse on a point, 3 a wooden bridge or a rowboat, 3 a lone tree with a swing or a lantern, 3 a few sheep or a cart on a road as specks, 2 a distant hot-air balloon, 2 a tiny campfire dot.
Every entry says tiny, small, or far off. Faces and close figures are absent. Signs are blank.
${CLEAN}
Examples: "TINY COTTAGE WITH SMOKE: a small round cottage far down the valley, one lit window, a soft curl of smoke from its chimney"; "LITTLE WINDMILL: a tiny windmill on a far hill, its sails turning slowly against the sky".
${FMT}` },

  moment: { mvp: 25, scale: 50, prompt: (n) => `You are writing ${n} PASSING-MOMENT descriptions for PixelBot's pixel-vista path: a small charming event crossing the scene. 10 to 22 words.

${WHIMSY_LAW}
VARIETY MANDATE: 5 a slow shooting star, 4 a flock of small birds lifting in a swirl, 4 a blossom blizzard or leaves swirling, 4 lanterns drifting up far off, 3 a passing rain shower with a rainbow, 3 snow beginning to fall in fat sparkly flakes, 2 a hot-air balloon drifting by.
Everything is weather, light, petals, or small living things in motion, never a large object.
${CLEAN}
Examples: "BLOSSOM BLIZZARD: a gust carrying a swirl of pink petals across the valley, bright against the far hills"; "LANTERNS RISING: a handful of tiny paper lanterns drifting up far across the water, each a warm dot".
${FMT}` },

  camera: { mvp: 25, scale: 25, prompt: (n) => `You are writing ${n} CAMERA framings for PixelBot's pixel-vista path: painterly framings for a wide pixel-art painting of a landform. 10 to 22 words: the camera position plus what dominates the frame. Every framing keeps the WHOLE landform readable with sky above it.

VARIETY MANDATE: 5 wide from a facing ridge, 4 from the valley floor looking up, 4 from the shore looking across water, 3 from a high pass or saddle, 3 along the canyon or fjord looking down its length, 3 low from a scree slope or beach with the landform towering, 3 slightly elevated from a foothill.
Framings are wide or medium-wide landscape views. Close-ups, detail shots, first-person views, map views, and side-scrolling views are absent.
${CLEAN}
Examples: "FROM THE FACING RIDGE: wide view straight across the valley, the landform filling the middle and upper frame, sky above, the near ridge as a dark base"; "ALONG THE FJORD: looking down the length of the water, cliffs converging toward the far mouth, sky in a band above".
${FMT}` },

  palette: { mvp: 25, scale: 40, prompt: (n) => `You are writing ${n} PALETTE harmonies for PixelBot's pixel-vista path: a named saturated old-school harmony of 3 to 5 colours for a whimsical limited-palette pixel-art painting, 10 to 20 words, colour and light words ONLY (nouns of things and places are absent). Every entry ends with one colour named "only in the brightest highlights".

${WHIMSY_LAW}
VARIETY MANDATE: 6 candy harmonies (pink, teal, cream), 6 sunset harmonies (orange, violet, gold), 5 mint and lavender harmonies, 4 cobalt and gold harmonies, 4 forest green and rose harmonies.
${CLEAN}
Examples: "CANDY DUSK: bubblegum pink, soft teal, warm cream, lavender, pale gold only in the brightest highlights"; "COBALT AND GOLD: deep cobalt, sky blue, warm gold, cream, white only in the brightest highlights".
${FMT}` },
};

(async () => {
  for (const [slot, cfg] of Object.entries(POOLS)) {
    if (only && only !== slot) continue;
    await generatePool({ outPath: `${DIR}pixelbot_pixel_vista_${slot}.json`, total: SCALE ? cfg.scale : cfg.mvp, append: SCALE, batch: 25, maxTokens: 8000, metaPrompt: cfg.prompt });
  }
})().catch((e) => { console.error(e); process.exit(1); });
