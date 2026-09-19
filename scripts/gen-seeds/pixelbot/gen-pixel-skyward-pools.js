#!/usr/bin/env node
/**
 * PixelBot pixel-skyward — bespoke pools (PIXELBOT_SCENES_PLAN.md §3.11).
 * Things that float or fly over a landscape. ONE vessel is the hero in the upper
 * middle; the sky is 50 to 70 percent of the frame as a banded dithered gradient;
 * the land below is the base layer. Money-shot: sky_bands. 9 pools, axis-clean,
 * positive-only. MVP 25 each; --scale appends to production size.
 * Run: node scripts/gen-seeds/pixelbot/gen-pixel-skyward-pools.js [--only slot] [--scale]
 */
const { generatePool } = require('../../lib/seedGenHelper');
const DIR = 'scripts/bots/pixelbot/seeds/';
const SCALE = process.argv.includes('--scale');
const only = (() => { const i = process.argv.indexOf('--only'); return i >= 0 ? process.argv[i + 1] : null; })();
const FMT = `Format every entry exactly as 'CAPS TITLE: body' (a short capitalised title, a colon, then the body). Return ONLY a JSON array of strings.`;
const CLEAN = `POSITIVE ONLY: describe what is there; write no negations, no "no", no "never", no "without".`;
const SOFT = `MATERIALS ARE SOFT AND MOVING: an envelope is stitched cloth that billows, swells, and rounds out; a vessel drifts, rises, sinks, leans, sails, and sways on the air. Words for rigid hardware and for stillness in the air (disc, saucer, plate, orb, metallic, hovering, suspended, motionless) are absent everywhere.`;
const PLAIN = `PLAIN SURFACES, STATED POSITIVELY: envelopes are plain striped, panelled, checkered, or patterned cloth; a gondola is plain varnished wicker or bare timber; a pennant is one solid colour. At most ONE painted pictorial charm per entry (a crescent moon, a sun face, a star, a fish, a bird, a leaf) and it is a simple painted shape.`;

const POOLS = {
  vessel: { mvp: 25, scale: 200, prompt: (n) => `You are writing ${n} FLYING-VESSEL descriptions for PixelBot's pixel-skyward path: ONE charming hand-built thing that floats or flies over a landscape, the hero of an old-school pixel-art painting (think the airships and balloons a classic 16-bit RPG paints on its title screen: rounded, storybook, a little magical, instantly lovable). Each entry describes the VESSEL: its shape and proportions, the cloth of its envelope or wing, its basket or gondola, its rigging, and one or two charming details. 30 to 50 words.

THE BAR: charming over grand over realistic. Hand-built, patched, a bit exaggerated, warm. Touchpoints to draw on: a tall rounded envelope of stitched cloth gores, wide horizontal stripes, a chequered envelope, a patched envelope with one mismatched panel, a plaited wicker basket with a rope ladder, a small varnished timber gondola slung under a long soft envelope, a bent brass-free lantern hook, a little solid-colour pennant on a line, a coil of rope over the rail, a folded canvas awning, a kite train of paper diamonds on a long string, a glider of doped fabric over a light wooden frame, a mooring rope running down to a wooden mast, sandbags on a hook, a ladder of knotted rope, a fabric wing in two bold colour panels.

ANTI-DULLNESS: every entry carries ONE charm detail the eye can enjoy (a patched envelope with a painted crescent moon, a wicker basket with a lantern on a hook, a little pennant on the gondola rail, a string of paper flags along a rope, a trailing rope with a knot at its end, a small round window in the gondola side). Rows of equal identical vessels are absent; where a group is named, ONE of them is clearly the biggest and nearest and the rest are small and far behind it.

VARIETY MANDATE, distribute the ${n} across: 5 BALLOON FESTIVAL (one big striped balloon rising closest and largest with a handful of smaller balloons small and far behind and below it), 4 LONE BALLOON (a single balloon over open country: a chequered one, a patched one, a tall narrow one, a fat rounded one), 4 CANVAS AIRSHIP (a simple long envelope of stitched canvas with a small wooden gondola slung beneath on ropes, plain cloth fins at the tail, one charming detail), 3 KITES (a long kite train of paper diamonds, a big box kite, a fish-shaped paper kite on a taut line, the string running down out of frame), 2 GLIDER (a slender wooden-framed glider with doped fabric wings and an open cockpit), 3 SKY HARBOUR (two or three canvas airships tied by rope to tall wooden mooring masts on a high rock or a hilltop platform, one of them nearest and biggest, little plank walkways), 2 COASTAL BLIMP (a soft rounded blimp of plain cloth with a small cabin slung under it), 2 PARAGLIDER (a broad fabric wing in two bold colour panels with a small seated pilot far below it on long lines).

${SOFT}
${PLAIN}
AXIS-CLEAN: the entry names the VESSEL and the things attached to it only. The land underneath, the sky, clouds, light, time of day, weather, and colour harmonies belong to other axes and are absent here.
REGISTER: everything is simple cloth, rope, wicker, paper, and timber, warm and hand-made. Brass fittings, gears, riveted iron, gun decks, uniforms, and machinery belong to other bots and are absent here.
NAMES: describe the vessel; famous places, franchises, and characters are absent.
${CLEAN}
Examples: "BIG STRIPED BALLOON LEADING THE FLIGHT: a tall rounded envelope in wide cream and crimson stripes, a painted crescent moon on one panel, a plaited wicker basket with a lantern hooked to the rail, four smaller balloons tiny and far behind it"; "PATCHED CANVAS AIRSHIP: a long soft envelope of stitched oatmeal canvas with one mismatched blue patch, plain cloth fins at the tail, a small varnished timber gondola slung on ropes, a solid green pennant at the bow"; "PAPER KITE TRAIN: a line of fifteen paper diamonds in alternating red and white climbing a taut string, each with a short ribbon tail, the string running down out of frame".
${FMT}` },

  land_below: { mvp: 25, scale: 120, prompt: (n) => `You are writing ${n} LANDSCAPE-BELOW descriptions for PixelBot's pixel-skyward path: the GROUND LAYER a flying vessel floats over, seen from a distance and read as the base of an old-school pixel-art painting. Each entry names the terrain, what is built or growing on it, and one charming storybook detail. 25 to 45 words.

THE BAR: whimsical storybook geography, tidy and readable in pixel tiles, never a realistic survey of real terrain. Touchpoints: a patchwork of tiny fields in four greens and a gold, hedgerows drawn as neat dark lines, a toy-small village with red roofs around a square, a hill town stacked up a rock with a little castle on top, a river drawn as a bright ribbon with three tiny bridges, terraced rice steps like stacked tiles, a windmill on a knoll, a round lake with one island and one tree, candy-striped desert rock in orange and rose, a lighthouse on a green headland, a forest of rounded tree-tops, orchard rows in blossom, a road winding in switchbacks, a ruined tower on a ridge, haystacks like little hats, a fishing village on stilts over a lagoon.

ANTI-DULLNESS: every entry carries at least one built or living thing the eye can find down there (a village, a bridge, a mill, a castle, a boat, a road, an orchard, a ruin). An empty green expanse on its own is absent.

VARIETY MANDATE, distribute the ${n} across: 4 PATCHWORK FARM COUNTRY, 3 HILL TOWN STACKED ON A ROCK, 3 RIVER VALLEY WITH BRIDGES, 3 DESERT ROCK COUNTRY WITH MESAS AND ARCHES, 3 COAST WITH CLIFFS AND A HEADLAND, 3 FOREST AND LAKE, 2 TERRACED HILLSIDES, 2 MOORLAND WITH STANDING STONES AND SHEEP WALLS, 1 LAGOON WITH SMALL ISLANDS, 1 SNOWY FOOTHILLS WITH A TIMBER VILLAGE.

AXIS-CLEAN: the entry names the LAND and what stands on it only. The flying vessel, the sky, clouds, light, time of day, weather, mist, and colour harmonies belong to other axes and are absent here.
NAMES: describe the land; famous regions, landmarks, franchises, and characters are absent.
${CLEAN}
Examples: "PATCHWORK FIELDS AND A RED-ROOFED VILLAGE: a quilt of small fields in four greens and one gold, hedgerows drawn as neat dark lines, a toy village of red roofs around a square with a white chapel, a dirt road curving away between them"; "HILL TOWN ON THE ROCK: a town stacked in tiers up a steep rock, pale walls and terracotta roofs, a small round castle with a flag mast at the top, switchback steps running down to an orchard at the base".
${FMT}` },

  sky_bands: { mvp: 25, scale: 120, prompt: (n) => `You are writing ${n} SKY-BAND descriptions for PixelBot's pixel-skyward path: the MONEY SHOT. The sky fills most of the frame and it is pixel art's signature surface: a DITHERED BANDED GRADIENT. Each entry describes the BANDING (how many bands, how wide, which colours step into which, from horizon up to the crown) and the DITHER (checkerboard dots, ordered Bayer speckle, a two-colour stipple where two bands meet, a fine grain at the seams), and names exactly ONE feature the eye can enjoy up there. 25 to 45 words.

THE BAR: this axis carries the picture. Every entry is a sky a person would screenshot. Touchpoints for the banding: four wide steps from warm at the horizon to deep at the crown, a dozen narrow stepped bands, two colours meeting in a wide speckled seam, a band that widens toward one side, a bright rim band sitting right on the horizon, a darker crown band with the gradient stepping down out of it, ordered dot dither stippling each transition, a checkerboard seam two pixels tall.

THE ONE FEATURE (each entry names exactly one, and it belongs to the sky itself): a huge soft moon dithered in pale cream sitting low in the bands, a thin bright crescent high in the crown band, a long feathered streak of high cirrus combed across two bands, one plump flat-based cotton cloud catching a lighter rim, a scatter of sharp four-point pixel stars in the top band, a pale dusted arc of galaxy light, a soft ring of halo around a bright point, a gentle aurora ripple folded through the upper bands, a distant soft shelf of dark cloud resting along one edge of the horizon, three small cloud puffs stepping away in a line toward the horizon. The one feature is always a SOFT SHAPE made of cloud, moon, star, halo, aurora, or dusted galaxy light; light low in the sky is a soft even glow spreading gently along the horizon and stays part of the banding (a rendered "fan", "cone", or "wedge" of light comes out as a solid spotlight, so the glow is described as a band or a soft brightening instead).

ANTI-DULLNESS: every entry states its banding AND its dither AND its one feature. A plain even wash of colour, a bleached white sky, a flat grey lid across the whole picture, and an empty featureless sky are absent from this pool.

VARIETY MANDATE, distribute the ${n} across: 6 WARM-TO-COOL GRADED (peach into rose into lilac into deep blue, apricot into teal, rose-gold into violet), 5 COOL AND CLEAN (clean cobalt stepping to pale turquoise at the horizon, deep indigo stepping to soft periwinkle, steel blue to seafoam), 4 DEEP NIGHT (navy into black with a starred crown, ink into deep teal, violet-black), 4 STORM BANDS (slate and bruise-purple steps with one brighter band of light along the horizon), 3 HIGH-CIRRUS SKIES (a wide clear graded field with combed ice streaks high across it), 3 CANDY SKIES (sherbet orange, cotton pink, mint and lilac steps).

AXIS-CLEAN: the entry describes the SKY's colours, its banding, its dither, and its one feature only. Words for time of day (dawn, sunrise, morning, noon, afternoon, evening, sunset, dusk, twilight, night) belong to the light axis and are absent here; colour alone carries the sky. The vessel, the land, mist and fog near the ground, and the palette harmony belong to other axes and are absent here.
SOFT SKY MATERIAL: clouds are soft moist masses that drape, feather, rest, spread, and thin. Words for rigid hardware and for stillness in the air (disc, saucer, plate, orb, metallic, hovering, suspended, motionless) are absent, and a cloud is never said to be shaped like a thing.
${CLEAN}
Examples: "PEACH TO LAVENDER STEPS: five wide bands stepping from warm peach at the horizon through rose and coral into a deep lavender crown, each seam stippled with a two-colour checkerboard dither, one long feathered cirrus streak combed across the upper bands"; "COBALT WITH A BIG MOON: a clean cobalt field stepping down through periwinkle to pale turquoise at the horizon, fine ordered dot dither at every seam, a huge soft moon dithered in pale cream resting low among the lower bands".
${FMT}` },

  light: { mvp: 25, scale: 100, prompt: (n) => `You are writing ${n} SKY-LIGHT descriptions for PixelBot's pixel-skyward path: the light falling on a vessel in the air and on the land far below. Each entry stacks TIME + DIRECTION + COLOUR OF THE LIGHT + HOW IT LANDS on the envelope and on the ground. 15 to 30 words.

VARIETY MANDATE: 5 first light (the sun just up, long low light from one side, warm gold on the upper curve of the envelope and long cool shadows below), 4 low golden late light, 4 bright clear mid-morning light with clean crisp shadows and rich colour, 3 afterglow just after the sun has gone (rose light from below lifting onto the envelope's underside), 3 blue hour (even indigo light, the land reading in soft silhouette), 3 moonlight (cool silver from high up, the envelope pale and the land deep blue), 3 broken storm light (dim over most of the land with one bright warm patch of sunlight reaching the ground far off).

ANTI-DULLNESS: light is always directional and coloured, and it always does something visible to the envelope and the land. Flat bleached white light, an even grey wash with no direction, and light with no colour are absent from this pool.
AXIS-CLEAN: time, direction, and colour of the light only, and what the light does to the envelope and the ground. The sky's banding and its features, clouds, mist, the vessel's own design, and the land's contents belong to other axes and are absent here.
LIGHT IS LIGHT: it glows, washes, rims, gilds, spills, catches, and pools. Light is never a column, a pillar, a bar, a wedge, a beam, or a ribbon.
${CLEAN}
Examples: "FIRST LIGHT FROM THE EAST: low gold light from one side gilding the upper curve of the envelope, the land below still cool blue with long soft shadows running away from it"; "HIGH MOONLIGHT: cool silver light from far above, the envelope pale and softly rimmed, the land deep blue and quiet, shadows short and soft".
${FMT}` },

  air: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} AIR descriptions for PixelBot's pixel-skyward path: what the AIR itself is doing between the camera, the vessel, and the land far below. 12 to 25 words.

VARIETY MANDATE: 6 valley fog and low mist (a white sea of fog filling the valley with hilltops standing out of it, ground mist lying in the field hollows, mist pooling along a river, fog thinning in patches, a soft mist layer sitting below the vessel, fog spilling over a low saddle), 6 crisp clear air (still and sharp with the far horizon crisp, dry clear air with every field edge readable, clean cold air, clear and calm, bright clear air with great depth, clear with a faint pale haze only at the far horizon), 5 soft haze (a warm dusty haze softening the far distance, a pale sea haze along the coast, a thin high veil softening everything gently, summer heat haze shimmering low over the fields, a fine golden dust haze), 4 drizzle veils (a soft grey veil of drizzle drifting across one part of the view, fine rain softening the middle distance, light drizzle blurring the far hills, a passing veil of rain with clear air beside it), 4 moving air (a steady breeze combing the grass far below, a gusty air with the vessel leaning a little, calm air with the vessel sitting level, lively air with ropes and pennants pulled taut).

AXIS-CLEAN: the air only. Sky colour, sky banding, cloud masses in the upper sky, light, time of day, the vessel's design, and the land's contents belong to other axes and are absent here.
${CLEAN}
Examples: "VALLEY FOG SEA: a level white sea of fog filling the whole valley floor with the tops of two hills standing clear out of it"; "CRISP CLEAR AIR: still sharp air with the far horizon crisp and every field edge readable to the distance".
${FMT}` },

  life: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} TINY-LIFE descriptions for PixelBot's pixel-skyward path: a small living or moving presence near a flying vessel or on the land far below, never the hero. 10 to 22 words. Everything is small in the frame.

VARIETY MANDATE: 6 birds (a loose skein of birds crossing far below the vessel, two gulls turning on the same air, a line of geese in a V far off, a single hawk circling below, a scatter of swifts low over the fields, a pair of storks going the other way), 5 a tiny figure aboard (a small figure in the basket leaning on the rail and looking out, seen from behind; a tiny pilot far below a wing on long lines; a small figure in the gondola doorway; a tiny figure waving from a mooring platform; a small figure seated in an open cockpit), 5 animals below (sheep scattered like grains of rice across a green field, cattle in a river meadow, a single horse and cart on a road, a dog running along a hedge line, goats on a terrace), 5 a second vessel far off (a small balloon far away and low, two tiny kites over a distant hill, a little glider turning far below, a small balloon just lifting from a distant field, a tiny airship at the far horizon), 4 people on the land (three tiny figures on a hill path, a small figure in a field looking up, two tiny figures on a bridge, a small boat with one figure on a river).

Every entry says small, tiny, distant, or far. Faces, close figures, and gatherings of people are absent.
${CLEAN}
Examples: "SHEEP LIKE GRAINS: sheep scattered like tiny grains of rice across a green field far below"; "FIGURE AT THE BASKET RAIL: a small figure in the basket leaning on the rail and looking out, seen from behind".
${FMT}` },

  moment: { mvp: 25, scale: 50, prompt: (n) => `You are writing ${n} PASSING-MOMENT descriptions for PixelBot's pixel-skyward path: one small thing happening in the scene right now, always in the air or on the light. 10 to 22 words.

VARIETY MANDATE: 5 a launch far below (a balloon just lifting off a field with its envelope newly rounded, a kite climbing away from a hill, a glider just released and turning, a balloon rising out of the fog, a wing lifting off a slope), 4 a burner flare (a short warm puff of light inside the envelope, briefly lighting its cloth from within, a gentle amber flare glowing up through the crown, a soft warm pulse lighting the basket and the envelope's inside), 4 rain over the land (a soft grey fan of rain falling from one small cloud onto the fields far off, a pale rain veil under a single cloud, a soft rain fan touching one distant hill), 4 a rainbow (a soft banded arc standing over the far fields, a short low arc of colour against a dark band, a faint second arc outside the first), 3 a shadow sliding (the vessel's round shadow sliding across the fields below, a cloud shadow crossing a hillside), 3 the envelope catching the light (the cloth glowing through for a moment, a ripple travelling along the envelope's side), 2 a drifting release (a handful of paper flags fluttering loose on a line, a little pennant snapping over).

MOVEMENT IS SOFT: things drift, rise, sink, lift, glow, fall, travel, and cross. Nothing sweeps, rushes, bursts, blasts, or swirls, and nothing leaves a streak or a trail behind it.
${CLEAN}
Examples: "BURNER PUFF: a short warm puff of light inside the envelope, briefly lighting its cloth from within and the basket below"; "RAIN FAN FAR OFF: a soft grey fan of rain falling from one small cloud onto the distant fields".
${FMT}` },

  camera: { mvp: 25, scale: 25, prompt: (n) => `You are writing ${n} CAMERA framings for PixelBot's pixel-skyward path: painterly framings that keep ONE flying vessel as the hero in the UPPER MIDDLE of the frame, with the sky filling most of the picture and the land reading as the base layer. 10 to 22 words: where the camera sits, and what fills the frame. Refer to the flying thing only as "the vessel" so the framing fits a balloon, an airship, a kite, or a glider.

VARIETY MANDATE: 6 from the ground far below looking up, the vessel small and high against a great sky, a strip of land along the bottom; 5 from a ridge or a hilltop at the vessel's own height, the valley falling away beneath it; 5 from another basket a little way off and slightly below, the vessel ahead and above, the land far down; 5 wide from the valley floor with the vessel high in the upper middle and the whole sky open around it; 4 from a little above and behind the vessel, looking past it and down the length of the land.

Framings are wide or medium-wide, and the sky always takes the larger share of the frame. Close-ups, framings of hands, interiors, first-person views, overhead map views, and framings that describe the viewer's body or posture are absent: every entry names where the CAMERA sits.
${CLEAN}
Examples: "FROM THE VALLEY FLOOR: camera set low on the valley floor looking up, the vessel high in the upper middle, open sky filling most of the frame"; "FROM A RIDGE AT ITS HEIGHT: camera on a ridge level with the vessel, the valley falling away below it, a wide sky beyond".
${FMT}` },

  palette: { mvp: 25, scale: 40, prompt: (n) => `You are writing ${n} PALETTE harmonies for PixelBot's pixel-skyward path: a named harmony of 3 to 5 colours for a limited-palette pixel-art painting of a sky with one vessel in it. 10 to 22 words, colour and light words ONLY (nouns of things and places are absent). Every entry ends by attaching its one bright accent to the light, in this shape: "..., one bright <colour> only in the sunlit highlights".

VARIETY MANDATE: 6 warm-graded harmonies (peach, apricot, rose, coral, cream), 5 cool clean harmonies (cobalt, periwinkle, turquoise, seafoam, pearl), 4 deep-night harmonies (navy, ink, deep teal, silver), 4 storm harmonies (slate, bruise purple, pewter, cold gold), 3 candy harmonies (sherbet orange, cotton pink, mint, lilac), 3 muted-earth harmonies for the land layer (sage, wheat, clay, dove).
The accent may vary: bright amber, warm gold, hot coral, pale cream, bright turquoise, soft rose.
${CLEAN}
Examples: "PEACH DRIFT: warm peach, rose, coral, soft lilac, deep blue, one bright amber only in the sunlit highlights"; "COBALT AND PEARL: clean cobalt, periwinkle, pale turquoise, pearl grey, one warm gold only in the sunlit highlights".
${FMT}` },
};

(async () => {
  for (const [slot, cfg] of Object.entries(POOLS)) {
    if (only && only !== slot) continue;
    await generatePool({ outPath: `${DIR}pixelbot_pixel_skyward_${slot}.json`, total: SCALE ? cfg.scale : cfg.mvp, append: SCALE, batch: 25, maxTokens: 8000, metaPrompt: cfg.prompt });
  }
})().catch((e) => { console.error(e); process.exit(1); });
