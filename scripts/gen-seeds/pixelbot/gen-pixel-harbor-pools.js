#!/usr/bin/env node
/**
 * PixelBot pixel-harbor — bespoke pools (PIXELBOT_SCENES_PLAN.md §3.1).
 * Boats, water, and the places built beside them: ONE boat or waterside
 * structure as the hero of a pixel-art PAINTING; water fills a third to half
 * of the frame. Money-shot = the reflection. 9 pools, axis-clean, positive-only.
 * Run: node scripts/gen-seeds/pixelbot/gen-pixel-harbor-pools.js [--only slot] [--scale]
 */
const { generatePool } = require('../../lib/seedGenHelper');
const DIR = 'scripts/bots/pixelbot/seeds/';
const SCALE = process.argv.includes('--scale');
const only = (() => { const i = process.argv.indexOf('--only'); return i >= 0 ? process.argv[i + 1] : null; })();
const FMT = `Format every entry exactly as 'CAPS TITLE: body' (a short capitalised title, a colon, then the body). Return ONLY a JSON array of strings.`;
const CLEAN = `POSITIVE ONLY: describe what is there; write no negations, no "no", no "never", no "without".`;

const POOLS = {
  place: { mvp: 25, scale: 200, prompt: (n) => `You are writing ${n} PLACE descriptions for PixelBot's pixel-harbor path: ONE boat or ONE waterside structure as the HERO of a WHIMSICAL, storybook pixel-art painting, with the water it lives on always in frame. Each entry names the hero (a specific boat type or waterside structure) and its place: SHAPE + COLOUR + a CHARM DETAIL + what surrounds it. 30 to 50 words.

THE BAR: charming, playful, a little magical, old-school game charm. Think storybook shapes: a crooked little lighthouse with a striped tower, a round-windowed houseboat with a smoking chimney, a rowboat with a lantern on a pole, a tiny windmill on the quay, a boathouse with a heart-shaped window, a lighthouse keeper's cottage with a red door, a pier that curls like a tail, a fishing hut on stilts with a crooked roof, a sleepy ferry with a striped awning, a canoe with a tiny flag. Every entry carries at least ONE charm detail. Cozy and sweet, never serious, never documentary, never industrial.

VARIETY MANDATE, distribute the ${n} across: 5 LAKESIDE DOCKS (a little rowboat, a skiff, a canoe at a wonky wooden dock), 4 STORYBOOK FISHING HARBOURS (tiny colourful boats, crooked cottages stacked up a hill), 3 LIGHTHOUSE POINTS (a striped or crooked lighthouse on a rock, a keeper's cottage), 3 RIVER LANDINGS OR FERRIES (a sleepy ferry, a punt under a willow, a landing stage with a lantern), 3 MISTY LAKE CANOES (a lone canoe on open water with a charm detail), 3 TINY MARINAS (a few little sailboats with coloured sails at wooden fingers), 2 CANAL HOUSEBOATS (a round-windowed narrowboat, a barge with flower boxes), 2 TROPICAL PIERS (a palm-trunk pier with a thatched hut, an outrigger with a tiny sail).

NAME THE BOAT TYPE every time. Hulls are plain painted wood in a cheerful colour, unmarked; every board is blank. Colour words are welcome here (a red door, a blue hull, a yellow lantern).
AXIS-CLEAN: the entry names the hero, its shape and colour, its charm detail, and its place only. Light, time of day, weather, clouds, sky, reflections, animals, and people belong to other axes and are absent here.
${CLEAN}
Examples: "RED ROWBOAT AT THE WONKY DOCK: a cheerful red-painted rowboat tied to a slightly wonky plank dock on a small round lake, a brass lantern hung from a pole at its bow, a coil of rope on the boards, a tiny blue cabin with a crooked chimney among the pines behind"; "CROOKED STRIPED LIGHTHOUSE: a short red-and-white striped lighthouse leaning ever so slightly on a round rock point, a keeper's cottage with a green door beside it, a little dory hauled up on the shingle, a curl of stone wall"; "HOUSEBOAT WITH ROUND WINDOWS: a plum-coloured narrowboat home with three round brass-rimmed windows and a stovepipe chimney, moored under a willow on a quiet canal, flower boxes along its roof, a tiny gangplank to the towpath".
${FMT}` },

  light: { mvp: 25, scale: 100, prompt: (n) => `You are writing ${n} LIGHT descriptions for PixelBot's pixel-harbor path: the base ambient light of a waterside painting. Each entry stacks TIME OF DAY + DIRECTION + COLOUR OF THE LIGHT + HOW SHADOWS FALL. 15 to 30 words.

VARIETY MANDATE: 5 dawn or first light, 5 late golden evening light, 5 blue hour or dusk, 4 moonlight, 3 soft overcast silver, 3 clear midday.
AXIS-CLEAN: light only. Fog, rain, clouds, reflections, and the boats or buildings belong to other axes and are absent here.
${CLEAN}
Examples: "GOLDEN EVENING FROM THE WEST: low warm sun from the left, long amber shadows across the planks, every edge rimmed in gold"; "BLUE HOUR: the sun just gone, cool indigo light from the whole sky, one last warm band along the western edge, shadows soft and blue".
${FMT}` },

  air: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} AIR descriptions for PixelBot's pixel-harbor path: what the AIR itself is doing over the water. 12 to 25 words.

VARIETY MANDATE: 6 mist or fog (lake mist at the surface, a thick fog bank, thin morning haze, sea fog rolling in), 6 crisp clear air in different flavours (cold clear, warm still, washed clean after rain, salty clear with a breeze), 4 drizzle or thin rain veils, 3 sea spray and wind over the water, 3 falling snow or a light flurry, 3 chimney woodsmoke drifting low.
AXIS-CLEAN: air only. Light and time words, clouds and sky, reflections, and the hero belong to other axes and are absent here.
${CLEAN}
Examples: "LAKE MIST AT THE SURFACE: a thin white mist lying on the still water, thickest over the deep middle, the far shore fading into it"; "WASHED CLEAN AFTER RAIN: cool clear air, every rope and plank sharp, the far hills crisp".
${FMT}` },

  reflection: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} REFLECTION descriptions for PixelBot's pixel-harbor path: the MONEY SHOT, what the water does with the light. Pixel art's signature detail. 15 to 30 words.

VARIETY MANDATE: 5 a lantern or window glow doubled in still water, 5 a rippled band of sunset colour across the water, 4 a long soft moon path laid on the water, 4 warm window light smeared on wet planks and the water beside them, 4 the hero mirrored almost perfectly in glassy water, 3 dappled broken ripples scattering the light into pixel sparks.
Every entry describes LIGHT ON WATER as light: a glow, a band, a path, a streak, a mirror, a scatter. Light is soft and horizontal on the water surface.
AXIS-CLEAN: the reflection only. The base light, the weather, and the hero's description belong to other axes and are absent here.
${CLEAN}
Examples: "LANTERN DOUBLED: a single amber lantern glow doubled in the still water beneath it, its reflection trembling gently at the edges"; "SUNSET BAND: a wide rippled band of orange and rose laid across the water from the horizon, breaking into short bright dashes near the shore".
${FMT}` },

  sky: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} SKY descriptions for PixelBot's pixel-harbor path: the sky layer only, cloud forms and the character of the sky over water. 12 to 25 words.

VARIETY MANDATE: 5 a clean clear dome, 5 scattered soft cumulus, 4 high cirrus streaks, 4 a soft overcast sheet, 3 a low dark storm line far off along the horizon with a soft ragged top, 2 a night sky with a field of stars, 2 a banded gradient sky with a few small clouds.
AXIS-CLEAN: sky and clouds only. Time-of-day light words, the water, reflections, and the hero belong to other axes and are absent here. Clouds are made of moist air with soft feathered edges; they drift, drape, and build.
${CLEAN}
Examples: "SCATTERED CUMULUS: a handful of soft white puffs drifting over the water, flat bases, sunlit tops, wide blue between them"; "OVERCAST SHEET: a smooth pale grey cloud sheet across the whole sky, faintly brighter toward one side".
${FMT}` },

  life: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} TINY-LIFE descriptions for PixelBot's pixel-harbor path: a small living accent that makes the place feel lived in. It is SMALL in the frame, never the hero, never a portrait. 10 to 22 words.

VARIETY MANDATE: 5 ducks paddling in a small group, 4 gulls on posts or wheeling far off, 3 a cat curled on the dock or a crate, 3 a heron standing still in the shallows, 4 a lone fisher as a small figure at distance turned toward the water, 2 a dog waiting at the end of the dock, 2 one small figure lighting a lantern turned away, 2 a fish breaking the surface in a ring.
Every figure is small, distant, or turned away. Faces and close figures are absent.
${CLEAN}
Examples: "FOUR DUCKS: four white-and-brown ducks paddling in a loose line past the dock, small ripples trailing behind them"; "LONE FISHER: one small figure far along the shore, back to us, a rod held out over the water".
${FMT}` },

  moment: { mvp: 25, scale: 50, prompt: (n) => `You are writing ${n} PASSING-MOMENT descriptions for PixelBot's pixel-harbor path: a small event crossing the scene. 10 to 22 words.

VARIETY MANDATE: 4 a lantern just lit and glowing, 4 a boat casting off with a small wake, 4 rain just beginning to dot the water, 3 fireflies drifting over the reeds, 3 a shooting star, 3 a fish leaping with a ring of ripples, 2 a gust ruffling the water into a dark patch, 2 a curl of woodsmoke rising from a chimney.
Everything is described as light, water, weather, or living things in motion, never as objects.
${CLEAN}
Examples: "RAIN BEGINNING: the first scattered drops dotting the still water with tiny rings, the far shore softening"; "CASTING OFF: a small wooden boat pushing away from the dock, a widening V of ripples behind it".
${FMT}` },

  camera: { mvp: 25, scale: 25, prompt: (n) => `You are writing ${n} CAMERA framings for PixelBot's pixel-harbor path: painterly framings for a pixel-art painting of a waterside place. 10 to 22 words: the camera position plus what dominates the frame. Refer to the subject only as "the hero" (it may be a boat or a waterside structure) so the framing fits any hero. Every framing keeps the hero at mid-distance, water filling a third to half of the frame, and sky or far shore giving depth.

VARIETY MANDATE: 5 from the end of the dock or pier looking out, 5 from the bank across the water toward the hero, 5 slightly elevated from the hillside or the quay looking down over the water, 4 from out on the water looking toward the shore and the hero, 3 down the length of the pier or quay, 3 low at water level.
Framings are wide or medium-wide views. Close-ups, detail shots, first-person views, map views, and side-scrolling views are absent.
${CLEAN}
Examples: "FROM THE BANK ACROSS THE WATER: wide view across calm water, the hero at mid-distance on the far side, water filling the lower half, sky above"; "SLIGHTLY ELEVATED FROM THE QUAY: looking down over the harbor from the quay steps, the hero centered on the water below, the far shore closing the view".
${FMT}` },

  palette: { mvp: 25, scale: 40, prompt: (n) => `You are writing ${n} PALETTE harmonies for PixelBot's pixel-harbor path: a named harmony of 3 to 5 colours for a limited-palette pixel-art painting of a waterside place, ending with ONE colour that appears only in the brightest highlights. 10 to 22 words, colour and light words ONLY (nouns of things and places are absent).

VARIETY MANDATE: 6 warm evening harmonies (amber, rose, apricot, plum), 6 cool harmonies (teal, slate, silver, cobalt, mist grey), 5 dusky harmonies (indigo, lavender, deep blue with one warm glow), 4 fresh morning harmonies (pale gold, mint, cream, soft blue), 4 muted overcast harmonies (pearl, dove grey, sage, faint peach).
Every entry ENDS with the phrase "<colour> only in the brightest highlights".
${CLEAN}
Examples: "AMBER DUSK: deep plum, dusky rose, warm amber, soft apricot, pale gold only in the brightest highlights"; "TEAL MORNING: teal, slate blue, silver grey, cream, warm white only in the brightest highlights".
${FMT}` },
};

(async () => {
  for (const [slot, cfg] of Object.entries(POOLS)) {
    if (only && only !== slot) continue;
    await generatePool({ outPath: `${DIR}pixelbot_pixel_harbor_${slot}.json`, total: SCALE ? cfg.scale : cfg.mvp, append: SCALE, batch: 25, maxTokens: 8000, metaPrompt: cfg.prompt });
  }
})().catch((e) => { console.error(e); process.exit(1); });
