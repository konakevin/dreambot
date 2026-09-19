#!/usr/bin/env node
/**
 * PixelBot pixel-shoreline — bespoke pools (PIXELBOT_SCENES_PLAN.md §3.10).
 * The edge of the sea by day: ONE coastal landform or structure as the hero of
 * a whimsical pixel-art painting, the water's edge always in frame, the water
 * showing wave structure. Money-shot = sun_on_water. 9 pools, axis-clean,
 * positive-only. MVP 25 each; --scale appends to production size.
 * Run: node scripts/gen-seeds/pixelbot/gen-pixel-shoreline-pools.js [--only slot] [--scale]
 */
const { generatePool } = require('../../lib/seedGenHelper');
const DIR = 'scripts/bots/pixelbot/seeds/';
const SCALE = process.argv.includes('--scale');
const only = (() => { const i = process.argv.indexOf('--only'); return i >= 0 ? process.argv[i + 1] : null; })();
const FMT = `Format every entry exactly as 'CAPS TITLE: body' (a short capitalised title, a colon, then the body). Return ONLY a JSON array of strings.`;
const CLEAN = `POSITIVE ONLY: describe what is there; write no negations, no "no", no "never", no "without".`;
const PLACENAMES = `NAMES: describe the geology and the shapes. Real beaches, coasts, islands, countries, regions, franchises, and characters are absent; every entry is an invented storybook coast.`;

const POOLS = {
  place: { mvp: 25, scale: 200, prompt: (n) => `You are writing ${n} PLACE descriptions for PixelBot's pixel-shoreline path: ONE coastal landform or ONE small coastal structure as the HERO of a WHIMSICAL, storybook pixel-art painting of the edge of the sea by day, with the water's edge always in the frame. Each entry names the hero, gives its SHAPE and COLOUR, adds one CHARM DETAIL, and says what the NEAR GROUND at the water's edge is made of. 30 to 50 words.

THE BAR: this is a wild, unbuilt coast rendered with storybook charm, the sort of coastline an old 16-bit RPG paints for its title screen. Shapes are rounded, generous, a little exaggerated: a fat blunt-topped sea stack carrying a tuft of wind-bent trees, a headland that curves away in a long smooth hook, chalk cliffs stepped in soft pastel bands, black basalt columns packed like a bundle of pencils, a pebble bank graded from fist-sized to pea-sized. Wild and unbuilt means DRIFTWOOD, SEA GRASS, BARNACLED ROCK, WEATHERED ROPE, KELP RIBBONS, and SCATTERED SHELLS, never resort furniture.
A FLAT OR A SWELL TRAIN HAS NO VERTICAL MASS OF ITS OWN: every wide-beach, flat, and surf entry names ONE standing object of real mass at mid-distance for the eye to land on (an upturned rowboat, a stout marker post, a weather-bent tree above the strandline, a driftwood shelter, a barnacled rock stack). The charm detail may be that object.

THE EMPTINESS RULE (the single biggest risk on this path): "wild and empty" means UNSPOILT, and it still has to be richly detailed and layered. Every entry gives the eye three things to read: a NEAR layer at the water's edge with real texture (ribbed wet sand holding a sheen, a rock shelf pitted with pools, a pebble bank, weathered boardwalk planks, a kelp line strung along the tideline), the HERO in the middle, and a FAR layer (a headland stepping away into haze, a line of stacks, the open sea with swell lines). A bare stretch of sand with nothing in it belongs to another path.

CHARM DETAIL, one per entry, small and lovable: a candy-striped beach hut on stilts, a weathered rowboat upturned on the sand with barnacles on its keel, a rope swing hanging from a wind-bent headland tree, a crooked wooden ladder down the cliff face, a stack of round lobster pots, a string of colourful pennants strung along the pier rail, a life ring on a post, a driftwood shelter someone built and left, a rusted anchor half-buried, a tiny whitewashed hut with a blue door on the clifftop, a cairn of balanced stones, a bell hanging from a curved post.

VARIETY MANDATE, distribute the ${n} across: 4 WIDE BEACH AT LOW TIDE (a great sheet of ribbed wet sand with the sea drawn far back, runnels and sandbars, a kelp line, one charm detail), 3 TIDE POOLS ON DARK ROCK (a shelf of black or purple-grey rock pitted with clear round pools, weed-fringed rims, limpets and anemones tiny inside), 4 CLIFFS SEEN FROM THE SHORE BELOW (pastel chalk stepped in bands, black basalt columns, red-ochre sandstone in layers, a green-topped headland with a grassy crown, always with the beach or rock platform at their feet in the near layer), 3 SURF AS THE HERO (a long peeling wall of swell with a hollow tube, a shorebreak folding over a sandbar, a train of three swell lines marching in over a reef, foam lines stacked on the sand), 3 BOARDWALK OR PIER (a low weathered plank boardwalk winding through sea grass to the sand, a small wooden pier on barnacled piles running out over the shallows, a stilt walkway around a headland), 2 GRASSY DUNES (rounded dune humps combed with marram grass, a sandy path cut between them opening onto the sea, a fence of leaning weathered posts), 2 ROCKY COVE (a horseshoe of boulders around a small pocket of sand, a gap of open sea in the cove mouth, a cave arch at one side), 2 TROPICAL LAGOON (a pale shelving flat of turquoise water inside a coral shelf, leaning palms, a fringe of coarse coral sand), 2 SEA ARCH OR STACK (a rounded arch worn through a headland with the sea running under it, or a fat storybook stack with a tuft of trees on its flat top).

AXIS-CLEAN: the entry names the hero, its shape and colour, its charm detail, and the ground at the water's edge only. Light, time of day, weather, haze, spray, clouds, sky, the sun on the water, animals, and people belong to other axes and are absent here.
THE WATER: wherever the sea appears, it shows STRUCTURE: swell lines, foam lines, a feathering crest, a sheet of water sliding back over sand. The water is named plainly (open water, a tongue of water, a sheet, a flat); a ribbon of sea renders as a solid ribbon object, so describe the water directly.
SHAPES ARE NAMED DIRECTLY (a fat blunt-topped stack, a long smooth hook of headland): a shape given as "shaped like a <thing>" renders that thing literally in the picture, so every shape is described in its own words. Colour words are welcome (turquoise, jade, slate blue, pewter).
ROCK IS NATURAL AND UNEVEN: bands sag and vary in thickness, edges are rounded by the sea, joints are softened, cracks run at angles. Rock described as stacked blocks, courses, bricks, cut faces, an even cut platform, or a keystone renders as built masonry, and masonry brings carved lettering into the picture (R1 #4: a cliff of "sandstone stacked in thick horizontal layers" rendered as a brick wall with carved glyphs across its face).
THE COAST IS WILD AND UNBUILT: the only built things are the small weathered ones listed above (a hut, a pier, a boardwalk, a ladder, a fence). Towns, hotels, pools, loungers, umbrellas, deck chairs, and sunbathers belong to another world entirely and are absent.
${PLACENAMES}
${CLEAN}
Examples: "RIBBED FLAT AT LOW TIDE: a wide sheet of ribbed wet sand holding a mirror sheen, shallow runnels braiding toward a low sandbar, a kelp line strung with shells along the tideline, a weathered rowboat upturned near the dunes, a hazy headland stepping away far off"; "BASALT COLUMN SHELF AND POOLS: a platform of hexagonal black basalt columns cut off flat, pitted with round clear pools rimmed in green weed, tiny anemones inside, a cairn of balanced stones on the seaward edge, swell lines marching in beyond"; "CANDY CHALK STEPS: soft chalk cliffs stepped in bands of cream, rose, and pale mint above a pebble bank graded fine to coarse, a crooked wooden ladder pinned to the cliff face, driftwood piled at the base, a line of smaller stacks trailing seaward".
${FMT}` },

  light: { mvp: 25, scale: 100, prompt: (n) => `You are writing ${n} LIGHT descriptions for PixelBot's pixel-shoreline path: the base ambient light over a coast by day. Each entry stacks TIME OF DAY + DIRECTION + COLOUR OF THE LIGHT + HOW SHADOWS FALL ON SAND AND ROCK. 15 to 30 words.

ANTI-DULL RULE (Kevin 2026-09-19): every entry makes the coast GLOW and the colour sing. Flat grey light, bleached white midday, washed-out haze light, and "minimal shadow" belong to a duller picture and are absent here. Even the overcast entries carry a bright warm break or a pearl glow behind the cloud that lights the water.

VARIETY MANDATE: 5 low golden sun late in the day (long warm shadows down the sand, every wet ridge rimmed in gold), 4 dawn and first light (rose and apricot from low on the horizon, cool blue still in the shadows), 4 high bright sun (hard sparkling contrast, saturated turquoise shallows, short crisp shadows, the sand warm cream), 4 pearl overcast with a bright glow behind the cloud (soft luminous light, gentle blue-grey shadows, the water silvered), 4 storm light (a dark bruised sky with one bright band of sun striking the water and the cliff face, sharp contrast between lit and shadowed rock), 4 fresh mid-morning side light (clean clear light from the side, crisp shadows under every ledge, colours saturated and cheerful).
AXIS-CLEAN: light only. Fog, spray, rain, clouds, the sky's shapes, the sun's reflection on the water, and the coast's own description belong to other axes and are absent here.
LIGHT IS LIGHT: it lies, rakes, rims, washes, and glows. Light described as a column, pillar, bar, wedge, plank, or ribbon renders as a solid object, so describe it as a glow, a rake, a rim, a wash, or a spill.
${CLEAN}
Examples: "LOW GOLDEN SIDE SUN: warm low sun raking in from the left, long amber shadows running down the wet sand, every ridge and rock edge rimmed in gold"; "STORM BAND: a dark heavy light over the land with one bright warm band of sun striking the water and the cliff face, lit rock glowing against deep shadow".
${FMT}` },

  sun_on_water: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} SUN-ON-WATER descriptions for PixelBot's pixel-shoreline path: the MONEY SHOT, what the light DOES on water, wet sand, foam, and spray. Pixel art's signature detail. 15 to 30 words.

VARIETY MANDATE: 5 a glitter path (the sun's light scattered on the water as thousands of tiny bright flecks and short dashes, densest near the horizon, breaking apart in the chop), 5 a wet-sand mirror (the sheen on the flat sand holding a soft doubled glow of the sky and the cliff, colour spread thin and gentle), 5 backlit surf (the light coming through the thin crest of a wave so the water glows jade and gold from inside, the lip bright as it feathers), 4 foam lines catching the light (curved lines of foam on the sand lit bright white-gold against the darker wet sand, their edges dotted and lacy), 3 light through spray (the air above the break lit into a soft bright glow, the far rocks softened inside it), 3 sparkle in the shallows (light bending in the clear shallow water into a moving net of bright lines across the pale sand bed).

LIGHT ON WATER IS LIGHT, described as flecks, dashes, a scatter, a net, a soft doubled glow, a bright lacy edge, a warm sheen. A reflection described as a ribbon, bar, band-plank, column, or sheet resting ON the water renders as a solid floating object, so keep it broken, soft, or spread. Spray is a soft bright haze that hangs and drifts; foam is lines and flecks; a wave crest feathers and thins.
AXIS-CLEAN: light on water and wet ground only. The base light's time of day, the sky's shapes, the weather, and the coast's own description belong to other axes and are absent here.
${CLEAN}
Examples: "GLITTER PATH: the sun scattered across the water in thousands of tiny bright flecks and short dashes, densest toward the horizon, breaking into separate sparks in the near chop"; "WET SAND MIRROR: the thin sheen on the flat sand holding a soft doubled glow of sky colour, gently spread and paler than the sky itself, fading where the sand dries".
${FMT}` },

  sky: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} SKY descriptions for PixelBot's pixel-shoreline path: the overhead sky layer only, its form and its colour. 12 to 25 words.

ANTI-DULL RULE (Kevin 2026-09-19, "too simplistic and quite frankly BORING" on a blank sky): EVERY entry carries a FEATURE the eye can enjoy. A plain clear dome, a featureless overcast sheet, and a flat empty sky belong to a duller picture and are absent. The sky is pixel art's signature axis.

VARIETY MANDATE: 6 candy banded dithered gradient skies (wide clean bands stepping from the horizon up to the crown, one small cloud resting in a band), 5 cotton cumulus (rounded puffs with flat bases and bright billowing tops, well spaced, rim-lit edges), 4 high cirrus fans and mare's-tails combed across the upper sky, 3 a big soft moon low and pale in a daytime sky with a faint halo ring, 3 a pearl cloud layer with soft dithered folds and one bright thinning patch where the glow comes through, 2 a far squall line low on the horizon with a soft ragged top and clear graded sky above it, 2 a sun halo or a broad soft ring of brightness in high thin cloud.
THE MOON is named plainly as a moon, big and soft and pale. The words disc, disk, plate, and saucer render as a flying saucer, so the moon is simply a moon.
AXIS-CLEAN: the sky above only. Time-of-day light words, the water, reflections, spray, the coast, and birds belong to other axes and are absent here. Clouds are moist soft masses with feathered edges; they drift, drape, build, and thin. Clouds shaped like animals or objects render as that animal or object, so clouds keep cloud shapes.
${CLEAN}
Examples: "CANDY BANDED SKY: wide dithered bands stepping from a warm band at the horizon through rose and lilac to a deep crown, one small puff resting in the middle band"; "COTTON CUMULUS PARADE: a loose procession of plump white puffs with flat level bases and bright billowing tops, wide clean blue between each one".
${FMT}` },

  air: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} AIR descriptions for PixelBot's pixel-shoreline path: what the AIR itself is doing over a coast. 12 to 25 words.

VARIETY MANDATE: 6 salt spray haze in different characters (a soft bright mist hanging over the break, fine salt haze softening the far rocks, a gentle drifting veil above the foam), 5 sea fog (a low bank sitting offshore, fog thinning inland so the near sand stays clear, a soft grey veil swallowing the far headland), 5 crisp clear salt air (washed clean and sharp after rain, cool and bright, warm still air with every distant edge crisp), 4 wind-blown sand (a thin skin of dry sand streaming low across the beach surface, sand smoking gently off a dune crest), 3 light rain veils (a soft grey curtain of drizzle far off over the water, fine rain dimpling the shallows), 2 warm shimmer over dry sand.
MOTION IS SOFT: spray, haze, and sand hang, drift, stream low, lie low, tremble, thin, and settle. The word hovering reads as a suspended solid object, so soft air lies, hangs, or trembles instead. Air described as sheets, plumes, bursts, a swirling rush, or sweeping across renders as white streak-objects and geysers, so keep every motion soft and low.
AXIS-CLEAN: air only. Light and time-of-day words, the sky's clouds, the water's reflections, the coast, and animals belong to other axes and are absent here.
${CLEAN}
Examples: "SOFT SPRAY HAZE: a fine bright mist hanging in the air above the break, softening the rocks just beyond it, thinning quickly toward the dunes"; "OFFSHORE FOG BANK: a low grey bank of sea fog sitting out on the water, the near sand and rock staying clear and sharp".
${FMT}` },

  life: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} TINY-LIFE descriptions for PixelBot's pixel-shoreline path: a small living accent on a wild coast, small in the frame, never the hero, never a portrait. 10 to 22 words.

VARIETY MANDATE: 5 gulls (three wheeling far off, two standing on a rock, several spaced along the wet sand facing the wind), 4 a small crab or a starfish tiny inside a tide pool, 4 a dog running along the tideline with a spray of sand behind it, 4 one lone figure far down the beach, small and turned away, walking in a windbreaker and boots with a hood up, 3 a small sailboat far out on the horizon with a coloured sail, 3 an oystercatcher or a heron standing in the shallows, 2 a pair of seals resting on a far rock.
EVERY entry contains an explicit size or distance word: small, tiny, far, far off, distant, or in the distance. An animal or a figure described without one renders large enough to take the frame away from the hero (R0 #3: "a heron standing alone in ankle-deep water" rendered a hero-scale heron). Every figure is small, distant, or turned away, and is dressed for wind and salt: a windbreaker, a raincoat, a knitted hat, a sun hat, rolled trousers, boots. Faces, close figures, and groups are absent.
${CLEAN}
Examples: "LINE OF GULLS: a row of small gulls standing on the wet sand all facing the same way into the wind"; "LONE WALKER FAR OFF: one small figure far down the beach in a yellow raincoat, back to us, walking the tideline".
${FMT}` },

  moment: { mvp: 25, scale: 50, prompt: (n) => `You are writing ${n} PASSING-MOMENT descriptions for PixelBot's pixel-shoreline path: a small event crossing the scene right now. 10 to 22 words.

VARIETY MANDATE: 5 a big set wave rising and feathering along its crest as it stands up, 4 a rainbow arc standing in the mist above the break, 4 a dark squall far offshore trailing a soft grey curtain under it, 4 a flock lifting off the sand all at once, 3 a wave sheet sliding back down the sand and leaving a fresh mirror behind it, 3 the tide beginning to fill a pool over the rim of the rock, 2 a gust combing the crest of a wave backward into a bright feather.
Everything is water, light, weather, or living things in motion, described as motion and never as an object. Motion nouns like sheets, plumes, bursts, sweeping across, and a swirling rush render as white streak-objects, so describe the motion plainly with these verbs: it rises, folds, combs, pulls, slides back, lifts, drifts.
${CLEAN}
Examples: "SET WAVE STANDING UP: a big swell rising smooth and green along the reef, its crest just beginning to feather white at the top"; "SHEET SLIDING BACK: the last thin wash of a wave sliding back down the sand, leaving a fresh bright mirror behind it".
${FMT}` },

  camera: { mvp: 25, scale: 25, prompt: (n) => `You are writing ${n} CAMERA framings for PixelBot's pixel-shoreline path: painterly framings for a pixel-art painting of the edge of the sea. 10 to 22 words: WHERE THE CAMERA SITS plus what dominates the frame. Refer to the subject only as "the hero" (it may be a landform or a small coastal structure) so each framing fits any hero.

EVERY FRAMING places the horizon deliberately LOW (a big sky over a shallow strip of sea) or deliberately HIGH (a great sweep of sand, rock, or water filling most of the frame), and keeps the water's edge in the picture.
VARIETY MANDATE: 5 from the dune crest looking down and out over the beach, 4 set low at the wet sand's edge with the sheen filling the near frame, 4 from the cliff top looking down along the coast, 4 from along the pier or boardwalk looking down its length, 3 from inside the cove mouth looking out to open sea, 3 from a rock shelf above the pools looking seaward, 2 from the tideline looking down the long beach toward the hero.
Every entry names where the CAMERA is placed, and the body begins with the word "camera" followed by one of these placement words: set, set low, set back, high on, at, along, positioned at. The hero is described as set, anchored, or caught in the frame. A viewer's body posture renders a person in that posture, so postures like lying, sprawled, standing, perched, kneeling, and crouching belong elsewhere and are absent.
Framings are wide or medium-wide. Close-ups, detail shots, first-person views, map views, and side-scrolling views are absent.
${CLEAN}
Examples: "FROM THE DUNE CREST: camera high on the dune grass looking down and out, the beach sweeping away below, horizon set high"; "LOW AT THE WET SAND'S EDGE: camera set low just above the sheen, wet sand filling the near frame, the hero beyond, horizon set low under a big sky".
${FMT}` },

  palette: { mvp: 25, scale: 40, prompt: (n) => `You are writing ${n} PALETTE harmonies for PixelBot's pixel-shoreline path: a named harmony of 3 to 5 colours for a limited-palette pixel-art painting of a coast, ending with ONE colour that appears only in the brightest highlights. 10 to 22 words, colour and light words ONLY (nouns of things and places are absent).

VARIETY MANDATE: 6 warm low-sun harmonies (amber, apricot, rose, warm sand), 6 cool sea harmonies (teal, jade, slate blue, pewter, silver), 5 fresh bright harmonies (turquoise, cream, mint, clean sky blue), 4 pearl overcast harmonies (dove grey, oyster, pale lilac, soft peach), 4 storm harmonies (deep indigo, gunmetal, bruised violet with one warm break).
Every entry ENDS with the phrase "<colour> only in the brightest highlights".
${CLEAN}
Examples: "LOW SUN ON SAND: warm amber, apricot, rose, soft shadow blue, pale gold only in the brightest highlights"; "PEARL COAST: dove grey, oyster, pale lilac, cool teal, warm cream only in the brightest highlights".
${FMT}` },
};

(async () => {
  for (const [slot, cfg] of Object.entries(POOLS)) {
    if (only && only !== slot) continue;
    await generatePool({ outPath: `${DIR}pixelbot_pixel_shoreline_${slot}.json`, total: SCALE ? cfg.scale : cfg.mvp, append: SCALE, batch: 25, maxTokens: 8000, metaPrompt: cfg.prompt });
  }
})().catch((e) => { console.error(e); process.exit(1); });
