#!/usr/bin/env node
/**
 * PixelBot pixel-rain-street — bespoke pools (PIXELBOT_SCENES_PLAN.md §3.4).
 * Old-town streets after rain, lit by windows and old street lamps, as the
 * pretty pixel-art scene a classic game shows on its splash screen. ONE focal
 * element (a tram, a lit window, a bridge, a lamp post) is the hero; the street
 * recedes into depth; the wet pavement carries the light. Money-shot:
 * pavement_reflection. Always dusk or night, always wet. 9 pools, axis-clean,
 * positive-only. MVP 25 each; --scale appends to production size.
 *
 * Text priors are this path's number one risk: every recipe crowds out
 * commerce and label nouns with pictorial, blank, or lit-window nouns.
 * Run: node scripts/gen-seeds/pixelbot/gen-pixel-rain-street-pools.js [--only slot] [--scale]
 */
const { generatePool } = require('../../lib/seedGenHelper');
const DIR = 'scripts/bots/pixelbot/seeds/';
const SCALE = process.argv.includes('--scale');
const only = (() => { const i = process.argv.indexOf('--only'); return i >= 0 ? process.argv[i + 1] : null; })();
const FMT = `Format every entry exactly as 'CAPS TITLE: body' (a short capitalised title, a colon, then the body). Return ONLY a JSON array of strings.`;
const CLEAN = `POSITIVE ONLY: describe what is there; write no negations, no "no", no "never", no "without".`;
// R1 hardening (2026-09-19): a "painted boot emblem" legitimised a hanging BOARD and Flux's old-town
// prior then added a second board and lettered it. Pictorial charm is now a hung or carved OBJECT,
// never a board, emblem, or plaque; "cobbler" (a commerce noun) is out.
const WORDLESS = `WORDLESS SURFACES: this is pixel art and lettering is its number one flaw, so every surface is described by what it SHOWS, and every pictorial charm is a solid hung or carved OBJECT: a big wooden pretzel hanging on a bracket over the bakehouse door, a wooden boot hung on an iron bracket, an iron key hung over a doorway, a carved wooden fish on a pier, a striped pole, a weathervane shaped like a fish. Walls show shutters, flower boxes, ivy, lanterns, and lit windows. Buildings are named as cottages, houses, bakehouses, an arcade, a station canopy. The words shop, store, cafe, market, cobbler, sign, board, emblem, plaque, poster, menu, label, newspaper, chalkboard, clock face, number plate, and route board are absent from every entry, and carved faces are absent (a carved face renders large and uncanny).`;

const POOLS = {
  street: { mvp: 25, scale: 200, prompt: (n) => `You are writing ${n} STREET descriptions for PixelBot's pixel-rain-street path: an OLD-TOWN street at dusk or night, the hero of a whimsical, richly detailed pixel-art painting in the register of a classic game's splash screen (think the pretty town scene a 16-bit RPG paints on its title screen). Each entry names ONE focal element as the HERO first (a tram, a lit bakehouse window, a stone bridge, a lamp post, a lantern-hung arcade, a station canopy) and then the street receding into depth behind it: its surface (cobbles, flagstones, worn stone steps, brick), its buildings (their storybook shapes), and ONE charm detail. 30 to 50 words.

THE BAR: charming, nostalgic, a little magical, richly detailed, old-town only. Storybook shapes everywhere: crooked gables leaning toward each other, a round glowing window under a pointed roof, a corner turret with a hat-shaped roof, a chimney with a bend in it, a tiny balcony with flower boxes, a lamp post that leans, a lantern with a coloured glass shade, a striped awning, a spiral stone stair, an arch with ivy over its keystone, a weathervane shaped like a fish. Buildings are stone, timber-framed, plaster, and brick, small and old; vehicles appear as old rounded silhouettes only (a plain cream tram with a single round headlamp, a small rounded old car, a bicycle against a wall) or are absent. Old street lamps and lit windows are the only light sources named as objects. ANTI-DULL RULE (Kevin 2026-09-19, "too simplistic and quite frankly BORING" on a flat row of equal shapes): every entry carries ONE charm detail, and the hero is one specific thing, never a row of equal fronts.

VARIETY MANDATE, distribute the ${n} across: 5 COBBLED LANES (a narrow lane curving away between crooked timber-framed houses; the hero is a lamp post, a lit round window, an archway, a corner lantern), 4 CANAL-SIDE STREETS (a street along a canal with tall narrow houses, a small humped bridge, moored punts; the hero is the bridge, a lantern-lit doorway, a lit window doubled below), 3 HILLSIDE STAIRS (a stone stair climbing between houses with a lamp at each landing; the hero is the stair itself or the lamp at the top), 3 COVERED ARCADES (a vaulted stone arcade with lanterns hung under every arch, the street visible beyond; the hero is the arcade), 3 TRAM STOPS (a plain cream tram with one round headlamp waiting at a small stop with a curved iron shelter; the hero is the tram), 3 BAKEHOUSE CORNERS (a corner bakehouse with a lit round window and a big wooden pretzel hanging on a bracket over the door, loaves in the window; the hero is the window), 2 STONE BRIDGES (an old arched bridge over a river or canal, a lamp at each end, houses beyond; the hero is the bridge), 2 STATION FORECOURTS (a small old station with a round window in its gable and lanterns under its canopy, an empty wet forecourt in front; the hero is the canopy).

SETTINGS: most are a European old town or a coastal village; at most two are a lantern-lit wooden old quarter with plain round lanterns glowing a solid colour and latticed wooden fronts. Describe the street, never a real city by name.
${WORDLESS}
AXIS-CLEAN: the entry names the hero, the street, its buildings, and its charm detail only. A window may be called lit; the colour, direction, and reach of any light, the wetness of the ground, the rain, the sky, animals, and people belong to other axes and are absent here.
${CLEAN}
Examples: "LEANING LAMP POST IN THE COBBLED LANE: an old iron lamp post leaning slightly at the bend of a narrow cobbled lane, crooked timber-framed houses tilting toward each other above it, a round lit window under the nearest gable, the lane curving away into deeper houses behind"; "HUMPED BRIDGE ON THE CANAL STREET: a small humped stone bridge with a lantern on each parapet crossing a narrow canal, tall thin houses with stepped gables standing along the water, two moored punts, a lit doorway with a striped awning at the far end"; "BAKEHOUSE WINDOW ON THE CORNER: a corner bakehouse with a big round lit window full of loaves, a big wooden pretzel hanging on a bracket over its door, the cobbled street forking away either side of it between old plaster houses with crooked shutters".
${FMT}` },

  pavement_reflection: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} PAVEMENT-REFLECTION descriptions for PixelBot's pixel-rain-street path: the MONEY SHOT, what the WET GROUND does with the light of the street. Pixel art's signature detail. 15 to 30 words.

VARIETY MANDATE: 6 lamp glows doubled in the wet cobbles below them, trembling at the edges, 5 warm window glows smeared long down the wet street toward the viewer, 4 a mirror-still puddle holding a lit window or a lamp upside down, 4 the brightest light stretched into a soft dithered path of glitter along the wet stones, 3 rain-freckled puddles scattering a glow into pixel sparks, 3 the whole street surface sheened like dark glass with every light doubled in it.
Every entry describes LIGHT ON WET GROUND as light: a glow, a smear, a path, a doubling, a sheen, a scatter. The reflection lies soft and flat on the ground. It takes its colour from whatever light is in the street (the lamps, the windows, the sky above), so refer to the light generically as the lamp glow, the window glow, or the brightest light.
AXIS-CLEAN: the reflection only. The light sources themselves, the rain, the sky, and the buildings belong to other axes and are absent here.
${CLEAN}
Examples: "LAMP DOUBLED IN THE COBBLES: each lamp's warm glow doubled in the wet cobbles beneath it, the doubled glow trembling at its edges and breaking into flecks between the stones"; "WINDOW SMEAR: the window glow smeared long and soft down the wet street toward the viewer, brightest just below the window and fading into the dark stones".
${FMT}` },

  light: { mvp: 25, scale: 100, prompt: (n) => `You are writing ${n} LIGHT descriptions for PixelBot's pixel-rain-street path: the light of an OLD-TOWN street at dusk or night, lit by warm windows and old street lamps under a cool evening. Every entry is after sunset. Each entry stacks TIME + the AMBIENT colour over everything + the named LIGHT SOURCES (old street lamps, lit windows, a lantern with a coloured shade, a tram's lit interior, a bakehouse window) + their colour + how shadows fall. 15 to 30 words. ANTI-DULL RULE (Kevin 2026-09-19): every light entry makes the street glow; flat grey overcast light, bleached light, and dim mud are absent.

VARIETY MANDATE: 6 blue hour (deep indigo or violet ambient from the sky, a last warm band low in the west, the street lamps just lit in warm amber), 5 deep night lit by old lamps (near-black blue ambient, each lamp a warm gold or soft green-gold glow with a halo in the damp, shadows pooled between them), 4 window-lit night (rows of amber windows the brightest thing, the ambient a cool slate, shadows soft), 3 last afterglow (rose-orange fading upward into blue, the first lamps coming on), 3 moon and lamps together (cool silver from above, warm lamps below, two colours of shadow), 2 coloured lantern glow (a lantern's red or green glass shade throwing a coloured halo over a small patch of the street), 2 a lit tram interior throwing warm squares across the street.
The warm light is ALWAYS attached to a source (windows, lamps, a lantern, the tram) against a cool ambient, so the picture is never uniformly golden. Light is a glow, a halo, a pool, a soft shaft, a patch, a spill; it is never a column, pillar, bar, beam, wedge, or ribbon.
AXIS-CLEAN: light only. The rain, mist, the wet ground and its reflections, clouds, stars, and the moon's shape belong to other axes and are absent here (the moon may be named only as a light source).
${CLEAN}
Examples: "BLUE HOUR, LAMPS JUST LIT: deep indigo ambient from the whole sky, one last apricot band low in the west, the old street lamps just lit in warm amber, shadows soft and blue"; "DEEP NIGHT OF OLD LAMPS: near-black blue ambient, each old street lamp a soft green-gold glow with a wide halo in the damp air, shadows pooled deep between the lamps".
${FMT}` },

  sky: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} SKY descriptions for PixelBot's pixel-rain-street path: the slice of sky seen ABOVE THE ROOFTOPS of an old-town street at dusk or night, after or during rain. The sky is pixel art's signature, so it is stepped in dithered bands and it always carries a FEATURE. 12 to 25 words.

ANTI-DULL RULE (Kevin 2026-09-19, "too simplistic and quite frankly BORING" on a blank sky): every entry carries ONE feature the eye can enjoy; a plain overcast sheet, a clear empty dome, and a featureless dark are absent. Exactly one special feature per entry.
VARIETY MANDATE: 6 banded dusk (the sky stepped in wide dithered bands, peach or rose at the roofline up through violet to deep blue, one small cloud puff resting in a band), 5 a big soft moon (huge and round above the rooftops, dithered cream with soft grey seas, a thin halo band, sometimes between two cloud edges), 5 rain-lit cloud glow (a low soft cloud ceiling with its underside tinted rose and amber in a wide soft patch above the street, dithered darker at the edges), 4 stars in a clearing sky (a ragged clearing in soft cloud showing a scatter of sharp pixel stars, three brighter four-point stars), 3 a moon halo through thin cloud (a soft round moon seen through a thin cloud veil, a wide pale halo ring around it), 2 a last dusk band under a cloud shelf (a soft dark cloud shelf overhead and one clean band of orange-rose light along the roofline beneath it).
AXIS-CLEAN: overhead form and colour only. Time-of-day light words, rain, the street, the ground, and reflections belong to other axes and are absent here. Clouds are soft moist masses that drape, thin, part, and glow; they are never stacked into heaps, towers, or walls.
${CLEAN}
Examples: "BANDED DUSK OVER THE ROOFS: the sky above the rooftops stepped in wide dithered bands from peach at the roofline through rose and violet to deep blue, one small cloud puff resting in the violet band"; "BIG SOFT MOON BETWEEN CLOUD EDGES: a huge round moon above the rooftops, dithered cream with soft grey seas and a thin halo band, two soft cloud edges parting around it".
${FMT}` },

  air: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} AIR descriptions for PixelBot's pixel-rain-street path: the STATE OF THE RAIN in an old-town street. It rained or is raining. 12 to 25 words.

VARIETY MANDATE: 6 fine drizzle (hanging in the air, fine dithered specks catching the light, softening the far end of the street), 5 rain easing (the last thin lines of rain, drops still dripping from eaves and lamp brackets, the air clearing), 5 mist after rain (a soft mist rising off the wet stones, thickening toward the far end, every glow wearing a soft halo), 4 steady rain (rain falling in fine straight dithered lines, dotting every puddle with rings, dripping from every edge), 3 fine rain haze (the whole street softened by a fine rain haze so each light wears a halo), 2 the last drops (the rain over, a few last drops falling from the eaves, the air washed clean and clear).
Rain falls in fine dithered lines or drops, drizzle hangs, mist rises and softens; the air moves gently. The rain is never in sheets, curtains, plumes, or sweeping gusts.
AXIS-CLEAN: the rain state only. Light and time words, the sky and clouds, the wet ground and its reflections, the buildings, and people belong to other axes and are absent here.
${CLEAN}
Examples: "FINE DRIZZLE HANGING: a fine drizzle hanging in the air, tiny dithered specks catching every glow, the far end of the street softened"; "RAIN EASING: the rain thinning to its last fine lines, drops still dripping from the eaves and the lamp brackets, the air clearing".
${FMT}` },

  life: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} TINY-LIFE descriptions for PixelBot's pixel-rain-street path: a small living presence in an old-town street at night, never the hero. 10 to 22 words. Everything is small in the frame, far off, or turned away, and there are at most two figures.

VARIETY MANDATE: 6 a single figure under an umbrella far down the street, small, seen from behind, walking away, 5 a cat sheltering under an awning or sitting on a lit windowsill, 3 a cyclist far off pedalling away with a small rear lamp, 3 a dog waiting by a lit doorway, 2 a small rounded old bus far off at the end of the street, its windows glowing, 2 pigeons huddled on a ledge under an arch, 2 a small figure on a short ladder lighting a lamp, turned away, 2 a small figure closing wooden shutters, seen from behind.
Every entry says small, tiny, far, or from behind. Faces, close figures, and groups are absent.
${CLEAN}
Examples: "UMBRELLA FIGURE FAR DOWN THE STREET: one small figure under a round umbrella far down the street, seen from behind, walking away into the glow"; "CAT UNDER THE AWNING: a small cat sitting dry under a striped awning, watching the wet street".
${FMT}` },

  moment: { mvp: 25, scale: 50, prompt: (n) => `You are writing ${n} PASSING-MOMENT descriptions for PixelBot's pixel-rain-street path: a small event happening in an old-town street right now, at night, in or after rain. 10 to 22 words.

VARIETY MANDATE: 4 a plain cream tram passing with its windows glowing and its single round headlamp lit, 4 a street lamp flickering on, its glow blooming, 4 rain easing to mist and the last drops falling, 3 wooden shutters being drawn closed on a lit window, 3 a soft curl of steam rising from a bakehouse vent, 3 a puddle rippling in rings from the last drops, 2 an umbrella folding shut under a doorway, 2 a cat shaking the rain from its fur under an arch.
Everything is light, weather, water, or a small living thing in motion, described as motion, never as a solid object.
${CLEAN}
Examples: "TRAM PASSING: a plain cream tram gliding past with its windows glowing warm and its single round headlamp lit, a soft hiss of wet rails"; "LAMP FLICKERING ON: one old street lamp flickering awake, its glow blooming out over the wet stones".
${FMT}` },

  camera: { mvp: 25, scale: 25, prompt: (n) => `You are writing ${n} CAMERA framings for PixelBot's pixel-rain-street path: painterly framings that keep ONE focal element as the hero with the street receding into depth behind it. 10 to 22 words: where the CAMERA sits plus what dominates the frame. Refer to the subject only as "the hero" and the setting only as "the street" so the framing fits any street type. Every entry names where the camera SITS (at eye level, set low near the wet stones, from a slight rise), never a person's posture.

VARIETY MANDATE: 6 down the street at eye level, the street receding to the hero at mid-distance, 5 from a slight rise at the near end (the top of a few steps or the crown of a bridge) looking down the length of the street, 4 from under a near overhang or arch, its edge framing the street and the hero beyond, 4 from across an open wet stretch (a canal, a forecourt, a small square) toward the hero on the far side, 3 from a corner looking diagonally down the street with the hero in the middle distance, 3 set low near the wet stones, the ground filling the lower third and the hero above it.
Framings are wide or medium-wide, at or near eye level. Close-ups, detail shots, first-person views, map views, and side-scrolling views are absent.
${CLEAN}
Examples: "DOWN THE STREET AT EYE LEVEL: camera at eye level in the middle of the street, the street receding to the hero at mid-distance, buildings closing in on both sides, a slice of sky above"; "FROM UNDER THE NEAR ARCH: camera set under a near stone arch, its dark curve framing the street beyond and the hero glowing at mid-distance".
${FMT}` },

  palette: { mvp: 25, scale: 40, prompt: (n) => `You are writing ${n} PALETTE harmonies for PixelBot's pixel-rain-street path: a named harmony of 3 to 5 colours for a limited-palette pixel-art painting of a WET OLD-TOWN STREET AT NIGHT, where the night is cool and the windows and lamps are the single warm note. 10 to 22 words, colour and light words ONLY (nouns of things and places are absent). Every entry ends by attaching the warm note to the light, in this shape: "..., warm amber only in the window and lamp glow".

VARIETY MANDATE: 8 blue-hour harmonies (indigo, violet, slate, dusk rose), 6 deep-night harmonies (navy, ink, teal-black, silver), 5 afterglow harmonies (plum, rose, dusky orange fading to blue), 3 green-gaslight harmonies (deep teal, jade, midnight blue), 3 misty pearl harmonies (pearl, dove grey, lilac, soft blue). The warm note may vary: warm amber, candle gold, lantern yellow, honey orange.
${CLEAN}
Examples: "INDIGO WET NIGHT: deep indigo, violet, slate blue, dusty rose, warm amber only in the window and lamp glow"; "GASLIGHT TEAL: deep teal, jade, midnight blue, silver, lantern yellow only in the window and lamp glow".
${FMT}` },
};

(async () => {
  for (const [slot, cfg] of Object.entries(POOLS)) {
    if (only && only !== slot) continue;
    await generatePool({ outPath: `${DIR}pixelbot_pixel_rain_street_${slot}.json`, total: SCALE ? cfg.scale : cfg.mvp, append: SCALE, batch: 25, maxTokens: 8000, metaPrompt: cfg.prompt });
  }
})().catch((e) => { console.error(e); process.exit(1); });
