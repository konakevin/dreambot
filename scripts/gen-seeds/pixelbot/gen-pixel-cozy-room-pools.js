#!/usr/bin/env node
/**
 * PixelBot pixel-cozy-room — bespoke pools (PIXELBOT_SCENES_PLAN.md §3.3).
 * An interior with a view; the room is the whole world. ONE window is the
 * light source and the outside is glimpsed through it as part of the very same
 * unbroken shot. Money-shot: window_view. objects picked twice. Any person is
 * small, seated, turned away. 8 pools, axis-clean + positive-only. MVP 25.
 * Run: node scripts/gen-seeds/pixelbot/gen-pixel-cozy-room-pools.js [--only slot] [--scale]
 */
const { generatePool } = require('../../lib/seedGenHelper');
const DIR = 'scripts/bots/pixelbot/seeds/';
const SCALE = process.argv.includes('--scale');
const only = (() => { const i = process.argv.indexOf('--only'); return i >= 0 ? process.argv[i + 1] : null; })();
const FMT = `Format every entry exactly as 'CAPS TITLE: body' (a short capitalised title, a colon, then the body). Return ONLY a JSON array of strings.`;
const CLEAN = `POSITIVE ONLY: describe what is there; write no negations, no "no", no "never", no "without".`;

const POOLS = {
  room: { mvp: 25, scale: 200, prompt: (n) => `You are writing ${n} ROOM descriptions for PixelBot's pixel-cozy-room path: a small, charming, slightly MAGICAL storybook interior, the kind of whimsical retro pixel-art room that makes people say "I want to live in that little room." Old-school game charm and picture-book warmth: crooked beams, a bed piled too high with patchwork quilts, a teapot that seems to be smiling, a wonky leaning bookshelf, a round window, mismatched patchwork everything, a mushroom-shaped lamp, plants growing a little too happily, strings of fairy lights, a cauldron-sized mug, a tiny door that goes nowhere, a kettle with a curl of steam. Playful, cozy, a touch enchanted. Each entry is ONE room described as ARCHITECTURE + FURNITURE + charming clutter + WHERE ITS ONE WINDOW SITS (the room's single window, its light source). 30 to 50 words.

THE BAR: a room from a beloved cozy game or a storybook, never a real-estate photograph, never a serious designer interior. Slightly wonky proportions are GOOD. Every room has at least two charming, playful, or gently magical details.

VARIETY MANDATE, distribute the ${n} across: 4 ATTIC BEDROOMS under crooked eaves (a round window, a bed heaped with too many quilts), 4 KITCHENS (a fat black stove like a friendly cauldron, a wall of teapots, cloth-topped jars of impossibly colourful jam), 3 READING NOOKS (a bed built into a bookshelf, a window seat drowning in cushions), 3 TINY ARTIST STUDIOS (a painter's tower room, paint jars in candy colours), 2 TEA ROOMS with a wonky pedestal table, 3 BURROW OR CABIN ROOMS (round doors, log walls, a stove with a bent chimney), 2 LIGHTHOUSE OR TOWER ROOMS (curved walls, a porthole), 2 SLEEPER-TRAIN CABINS (a bunk, a fold-down table, the window beside it), 2 TREEHOUSE OR GREENHOUSE ROOMS (branches through the wall, plants everywhere).

AXIS-CLEAN: the ROOM only. Light and time of day, what is seen through the window, loose props, animals, and people all belong to other axes and are absent here. The window is named as an opening and its placement (a round window in the slope above the bed, a wide window beside the sink), and what lies beyond it is left for another axis.
WALLS: walls hold wordless pictures, hanging herbs, patchwork textiles, or nothing; clocks, signs, boards, maps, and any lettering are absent.
${CLEAN}
Examples: "CROOKED ATTIC BEDROOM: a tiny room under crooked eaves, a brass bed heaped with six mismatched patchwork quilts, a mushroom-shaped lamp on a stool, a wonky shelf of teacups, a round window set in the slope right above the pillow"; "CAULDRON KITCHEN: a snug kitchen with a fat black stove like a friendly cauldron, shelves of cloth-topped jam jars in candy colours, a wall of mismatched teapots, a striped rag rug, one wide window above the deep stone sink".
${FMT}` },

  window_view: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} WINDOW-VIEW descriptions for PixelBot's pixel-cozy-room path: what is seen THROUGH the room's one window, the money shot. 15 to 30 words. Each view is written as part of the very same continuous shot as the room, the way a real camera captures a room with its view: the glass, and beyond it, the world.

VARIETY MANDATE: 5 rain on the glass with a blurred world beyond, 4 snow falling past the window, 4 distant lights (a town below, a harbor, a far city glow), 3 a sunset or dawn sky, 3 a forest or garden right outside, 3 the sea or a lake, 3 rooftops and chimneys.
AXIS-CLEAN: the view only. Room contents, lamps, props, animals, and people belong to other axes and are absent here.
${CLEAN}
Examples: "RAIN ON THE GLASS: fat raindrops sliding down the panes, the street lamps beyond smeared into soft warm blurs in the dusk"; "SNOW PAST THE WINDOW: thick flakes drifting slowly past the glass, a white garden and a dark fir line softening in the falling snow beyond".
${FMT}` },

  room_light: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} ROOM-LIGHT descriptions for PixelBot's pixel-cozy-room path: the light INSIDE the room and how it falls. Each entry names the SOURCE + its COLOUR + where it lands + how the window light meets it. 15 to 30 words.

VARIETY MANDATE: 5 a lamp (a desk lamp, a paper shade, a floor lamp pooling light on a rug), 4 candlelight or a lantern, 4 daylight through the window (morning through thin curtains, overcast grey daylight, low afternoon sun laying a bright shape on the floor), 4 firelight or a stove's glow, 3 string lights or fairy lights, 3 moonlight through the window with one small warm light inside, 2 the soft glow of a small dark-faced screen.
AXIS-CLEAN: light only. Props and furniture are named only as what the light lands on; the view outside, animals, and people are absent here. Light is described as glow, pools, wash, and soft edges, never as an object.
${CLEAN}
Examples: "DESK LAMP POOL: a warm amber pool from a green-shaded desk lamp on the table, the rest of the room falling into soft brown shadow, cool blue window light along the far wall"; "STOVE GLOW: orange firelight flickering from the stove door across the floorboards, warm on the near chair, the window a cool grey rectangle".
${FMT}` },

  objects: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} OBJECT descriptions for PixelBot's pixel-cozy-room path: one loose cozy prop that lives in the room (two are picked per render). 10 to 20 words. Every object is pictorial and text-free.

VARIETY MANDATE: 4 a steaming kettle or teapot with a cup, 4 stacks or shelves of books with blank spines, 3 a record player or an old radio with a dark dial, 3 trailing houseplants and pots, 3 a quilt or blanket thrown over a chair, 3 art supplies (a jar of brushes, a half-finished canvas of colour), 3 a wooden toy or a chess board mid-game, 2 a guitar or a ukulele leaning in a corner.
${CLEAN}
Examples: "STEAMING KETTLE: a copper kettle on the stove with a thin curl of steam, a chipped blue mug waiting beside it"; "BOOK STACK: a leaning stack of well-read books with blank cloth spines, a pair of reading glasses resting on top".
${FMT}` },

  life: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} LIFE descriptions for PixelBot's pixel-cozy-room path: a small living presence in the room. 10 to 22 words. It is small in the frame and never the subject.

VARIETY MANDATE: 6 a cat (curled on the sill, asleep on the quilt, watching the rain), 4 a dog asleep on the rug or by the stove, 4 a bird outside the glass or a goldfish bowl inside, 4 ONE small figure seen from behind, seated and turned toward the window or a book, only the back of their head and shoulders showing, small in the frame, 3 a mouse or a hamster in a corner, 4 a sleeping fox, rabbit, or hedgehog curled in a basket.
Any person is small, seated, and turned away; faces are absent.
${CLEAN}
Examples: "CAT ON THE SILL: a tabby cat curled on the windowsill, tail tucked, watching the rain"; "READER FROM BEHIND: one small figure seated in the far chair with their back to us, a book open, only their shoulders and hair showing".
${FMT}` },

  moment: { mvp: 25, scale: 50, prompt: (n) => `You are writing ${n} MOMENT descriptions for PixelBot's pixel-cozy-room path: a small passing event inside or just outside the room. 10 to 22 words.

VARIETY MANDATE: 5 rain beginning or thickening on the glass, 4 tea steam or a kettle plume rising, 4 a lamp flickering on or a candle guttering, 4 snow thickening outside, 3 a curtain lifting in a breeze, 3 a sunbeam sliding across the floor, 2 a moth circling a lamp.
Everything is described as light, air, water, or living things in motion, never as an object.
${CLEAN}
Examples: "RAIN THICKENING: the drizzle on the glass turning to a steady rain, drops racing each other down the panes"; "SUNBEAM SLIDING: a single warm sunbeam creeping across the floorboards toward the rug".
${FMT}` },

  camera: { mvp: 25, scale: 25, prompt: (n) => `You are writing ${n} CAMERA framings for PixelBot's pixel-cozy-room path: painterly interior framings for a pixel-art painting of a small room with one window. 10 to 22 words: the camera position plus what dominates the frame. The whole room and its window are in frame in every framing, room and view captured as ONE continuous shot.

VARIETY MANDATE: 6 eye level from the doorway, 5 seated height beside the window, 5 a corner three-quarter view taking in two walls and the window, 4 low from the floor looking across the rug toward the window, 5 from the far wall looking toward the window with the room between.
Framings are room-agnostic (they say "the room", "the window", "the far wall", never a kitchen or a bedroom). Close-ups, detail shots, first-person hands, and split or paneled views are absent.
${CLEAN}
Examples: "FROM THE DOORWAY: eye level in the open doorway, the whole room laid out ahead, the window centred on the far wall glowing"; "CORNER THREE-QUARTER: from a corner, two walls meeting at the window, the furniture stepping back in depth".
${FMT}` },

  palette: { mvp: 25, scale: 40, prompt: (n) => `You are writing ${n} PALETTE harmonies for PixelBot's pixel-cozy-room path: a named harmony of 3 to 5 colours for a limited-palette pixel-art painting of a cozy interior. 10 to 20 words, colour and light words ONLY (nouns of things and places are absent). Every harmony ends with one colour that lives only in the brightest highlights, written exactly as "<colour> only in the brightest highlights".

VARIETY MANDATE: 8 warm interior harmonies (amber, honey, walnut, cream, terracotta), 6 warm-inside cool-outside harmonies (amber and honey against slate blue and teal), 5 soft muted harmonies (dusty rose, sage, oatmeal, faded denim), 3 night harmonies (indigo, plum, charcoal with one warm glow), 3 rainy-day harmonies (grey-green, pewter, moss, a warm lamp tone).
${CLEAN}
Examples: "HONEY AND SLATE: honey amber, warm cream, walnut brown, slate blue, pale gold only in the brightest highlights"; "RAINY AFTERNOON: grey-green, pewter, moss, soft oatmeal, warm apricot only in the brightest highlights".
${FMT}` },
};

(async () => {
  for (const [slot, cfg] of Object.entries(POOLS)) {
    if (only && only !== slot) continue;
    await generatePool({ outPath: `${DIR}pixelbot_pixel_cozy_room_${slot}.json`, total: SCALE ? cfg.scale : cfg.mvp, append: SCALE, batch: 25, maxTokens: 8000, metaPrompt: cfg.prompt });
  }
})().catch((e) => { console.error(e); process.exit(1); });
