#!/usr/bin/env node
/**
 * PixelBot pixel-fantasy-vista — bespoke pools (PIXELBOT_SCENES_PLAN.md §3.6).
 * A fantasy place you'd want to visit, painted in pixels: the Final Fantasy
 * title-screen vista. The LANDMARK (built or magical) is the hero at 40 to 60
 * percent of the frame; wonder_light is the money-shot. Sibling pixel-vista
 * owns natural landforms; this path owns landmarks. 9 pools, axis-clean,
 * positive-only, curated against DULL entries. MVP 25 each; --scale appends.
 * Run: node scripts/gen-seeds/pixelbot/gen-pixel-fantasy-vista-pools.js [--only slot] [--scale]
 */
const { generatePool } = require('../../lib/seedGenHelper');
const DIR = 'scripts/bots/pixelbot/seeds/';
const SCALE = process.argv.includes('--scale');
const only = (() => { const i = process.argv.indexOf('--only'); return i >= 0 ? process.argv[i + 1] : null; })();
const FMT = `Format every entry exactly as 'CAPS TITLE: body' (a short capitalised title, a colon, then the body). Return ONLY a JSON array of strings.`;
const CLEAN = `POSITIVE ONLY: describe what is there; write no negations, no "no", no "never", no "without". Name what IS present.`;
const TONE = `TONE: inviting, bright, wondrous, a place you'd want to visit. Every entry is cheerful storybook fantasy with a little magic in it.`;

const POOLS = {
  landmark: { mvp: 25, scale: 200, prompt: (n) => `You are writing ${n} FANTASY-LANDMARK descriptions for PixelBot's pixel-fantasy-vista path: ONE built or magical landmark standing in its place, the hero of an old-school pixel-art splash screen (the pretty vista a classic 16-bit RPG shows on its title screen: the fantasy world you'd want to visit). Each entry describes the LANDMARK (its storybook shape, its impossible or magical element, one charm detail) and the PLACE it stands in (the land around and beneath it). 30 to 50 words.

THE BAR: wondrous over grand over realistic. Rounded, exaggerated, storybook shapes that read in two seconds: a tower that leans and spirals, an island that drifts with waterfalls pouring off its underside, a tree so large a village sits in its boughs, a castle with too many slender turrets and pennants, a mushroom the size of a house. Every entry carries the IMPOSSIBLE or MAGICAL element that makes it fantasy (it floats, it glows, it is far too large, it grows from crystal, a bridge runs to it through the clouds) plus ONE charm detail (a crooked chimney, a rope bridge, a tiny lit window, a windmill on a ledge, a bell in an arch, a rowboat tied to a root). Detail is rich: the landmark has parts you can point to.
${TONE} A dull entry is a plain building on a plain hill; every landmark here is a wonder.

VARIETY MANDATE, distribute the ${n} across: 3 FLOATING ISLANDS (drifting slowly, waterfalls trailing off their undersides into mist, a cottage or a grove on top, roots and vines hanging beneath), 3 TOWER OR SPIRE (a wizard's tower spiralling up a sea stack, a leaning bell spire on a hilltop, a slender tower with a glass crown among clouds), 3 GIANT TREE (a tree the size of a mountain with a village in its branches, rope bridges between boughs, lanterns hung on roots), 3 CRYSTAL OR CAVERN (a cavern mouth grown with giant glowing crystals, a valley of crystal spires, a grotto with a lake and crystal ceiling), 3 CASTLE (a castle with slender turrets over a lake, a castle on a crag with a waterfall through its arches, a castle of pale stone on an island), 2 SKY CREATURE (a great gentle sky whale drifting slowly over hills with a village on its back, a giant slow tortoise carrying a hill town), 3 GLOWING FOREST (a forest of house-sized mushrooms glowing softly, a grove of luminous trees around a pool, a hollow with glowing flowers), 3 RUINS RECLAIMED (a broken arch bright with flowering vines, a sunken temple with a lake in its courtyard, a ruined bridge overgrown and sunlit), 2 CLOUD CITY (a bridge climbing to a town built on a cloud bank, white towers standing on cloud with a stair of light).

SHAPE WORDS: floating things DRIFT, TRAIL waterfalls, and hang roots; sky creatures DRIFT SLOWLY; light is a glow; openings are an ARCH or a gateway of light. Surfaces show worn pictorial reliefs, plain coloured banners, a pictorial crest; every window is a plain lit or dark window.
AXIS-CLEAN: the entry names the LANDMARK and its PLACE only. Light, time of day, weather, sky, stars, the moon, mist, and people belong to other axes and are absent here (a glow that is part of the landmark itself, like glowing crystals or glowing mushrooms, is allowed). Crystals are chunky, stepped, pixel-sided blocks of colour.
LANE: this path owns built or magical LANDMARKS; plain mountains, canyons, fjords, and dunes belong to a sibling path. Creatures and knights are never the subject: the LANDMARK is the hero.
NAMES: describe the place; famous franchises, named fantasy realms, and real landmarks are absent.
${CLEAN}
Examples: "THE DRIFTING ORCHARD ISLE: a small island drifting slowly above a green valley, an apple orchard and one round cottage on its top, three waterfalls trailing off its underside into mist, thick roots hanging below, a rope ladder dangling from its edge toward the meadow"; "WIZARD'S SPIRAL ON THE SEA STACK: a tall tower coiling up a sea stack like a corkscrew, a glass-domed room at its crown, a crooked chimney puffing, a rope bridge to the cliff, waves ringing the rock in white lace, gulls' nests on the ledges"; "THE MUSHROOM HOLLOW: a forest of house-sized mushrooms with softly glowing caps in coral and cream, a stream winding between their fat stems, a little plank walkway from cap to cap, ferns and glowing blue flowers filling the hollow".
${FMT}` },

  wonder_light: { mvp: 25, scale: 100, prompt: (n) => `You are writing ${n} WONDER-LIGHT descriptions for PixelBot's pixel-fantasy-vista path: the MONEY SHOT, ONE glowing magical phenomenon happening at or on the landmark that makes the scene wondrous. 20 to 35 words. Each entry is ONE phenomenon, described as a glow, a soft shaft, a patch, a path of glitter, a soft fan of rays, or a slow swarm of small lights.

THE BAR: the thing you'd screenshot. Glowing waterfalls, a lantern swarm rising slowly, bioluminescent flora, moonlight pooling on the landmark, sunrise light through an arch, glowing windows in a tower, fireflies drifting in thousands, a glowing pool, crystals lit from within, a soft aurora glow reflected on water. Rich and specific: name what the glow touches.
${TONE} Wonder, never doom.

VARIETY MANDATE, distribute the ${n} across: 5 GLOWING WATER (a waterfall lit from within, a pool glowing pale aqua, a river of soft light, glitter on a lake), 5 SMALL LIGHTS (a swarm of paper lanterns rising slowly, thousands of fireflies drifting, glowing seeds floating, tiny lights in a giant tree), 4 GLOWING FLORA (luminous mushroom caps, glowing blossoms, a grove lit by its own leaves, glowing moss on stone), 3 GLOWING CRYSTAL OR STONE (crystals lit from within, a glowing gateway of light in an arch, worn pictorial reliefs glowing softly with plain light), 4 SUN OR MOON ON THE LANDMARK (dawn light pouring through an arch as a soft fan of rays, the first sun on the highest turret, moonlight pooling silver on terraces, a warm glow on the tower crown), 4 LIT WINDOWS AND HEARTHS (hundreds of tiny warm windows in a cliff city, one glowing window at the top of the tower, lantern light on a rope bridge, hearth glow in the tree village).
LIGHT IS LIGHT: a glow, a soft shaft, a patch, a pool of light, a path of glitter, a soft fan of rays, a slow swarm of lights. Lanterns rise SLOWLY; fireflies DRIFT; glitter LIES on the water. Crystals are chunky, stepped, pixel-sided blocks of colour.
AXIS-CLEAN: the ONE glowing phenomenon only. The sky's own features (moon shape, stars, aurora curtains, clouds), the ambient time of day, weather, and people belong to other axes and are absent here. The landmark is referred to generically ("the landmark", "the tower", "the falls") so the glow fits whichever landmark rolled.
${CLEAN}
Examples: "FALLS LIT FROM WITHIN: the great waterfall glowing pale aqua from inside, its spray a soft haze of light, the pool beneath glowing softly and lighting the rocks around it"; "LANTERN RISE: hundreds of paper lanterns rising slowly from the landmark, a warm drifting swarm of small golden lights climbing gently into the air, their glow warming the stone below"; "DAWN THROUGH THE ARCH: the first sun pouring through the great arch as a soft fan of golden rays, lighting the mist inside it and laying a warm patch of light across the water".
${FMT}` },

  sky: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} SKY descriptions for PixelBot's pixel-fantasy-vista path: the OVERHEAD layer of a classic splash-screen pixel scene. The sky is pixel art's signature: a graded, banded, dithered sky with ONE feature is the default. 18 to 30 words. EVERY entry carries exactly one feature.

THE BAR: every sky is a picture on its own. Wide dithered colour bands stepping up from the horizon, a big soft round moon, cotton cloud puffs rim-lit at their edges, a scatter of sharp pixel stars, a soft galaxy arc, a gentle aurora curtain, a soft glowing halo of light around the sun, one great soft cloud shaped like a sleeping animal.
ANTI-DULLNESS: a blank sky, a flat overcast sheet, a clear empty dome, and a featureless expanse are absent. Every entry names its feature and its colour banding.
${TONE}

VARIETY MANDATE, distribute the ${n} across: 5 CANDY DITHERED BANDS (the sky stepped in wide dithered bands of colour from horizon to crown, in different colour runs: peach to lilac, mint to cobalt, rose to gold, apricot to indigo, cream to sky blue), 4 A BIG SOFT MOON (a huge round moon filling a quarter of the sky, cream, pale gold, or blush, with soft dithered seas), 4 COTTON CLOUD PUFFS (rounded scoops and puffs drifting, rim-lit, bases flat and tidy, generous graded sky between them), 3 STARS (a scatter of sharp pixel stars, a few bright four-point stars twinkling over a deep dithered vault), 2 GALAXY ARC (a broad soft arc of dusted starlight sweeping over a deep sky), 3 AURORA CURTAIN (a soft rippling curtain hanging high, folds banded in two gentle colours), 2 SUN HALO (a soft glowing halo of light around a small warm sun in a graded sky, a few thin feathered clouds lit at their edges), 2 ONE GREAT SOFT CLOUD (one enormous soft rounded cloud with a long gentle back or curled into a plump heap, rim-lit, alone in a banded sky).
CLOUD WORDS: clouds are soft, rounded, feathered, draped, drifting puffs and scoops. The moon is a huge soft round moon.
AXIS-CLEAN: overhead only. Time of day, the ambient light colour on the land, the landmark, the ground, weather in the air, and people belong to other axes and are absent here.
${CLEAN}
Examples: "PEACH-TO-LILAC BANDS: a sky stepped in wide dithered bands from a warm peach horizon through rose and lilac to a deep violet crown, two small cotton puffs resting in the middle band"; "BIG BLUSH MOON: a huge round moon filling a quarter of the sky, dithered in soft blush and cream with pale grey seas, a faint soft halo of light around it and a few sharp pixel stars beyond"; "GALAXY ARC: a broad soft arc of dusted starlight sweeping overhead through a deep dithered vault, sharp pixel stars scattered around it, its edges feathered in pale bands".
${FMT}` },

  light: { mvp: 25, scale: 100, prompt: (n) => `You are writing ${n} LIGHT descriptions for PixelBot's pixel-fantasy-vista path: the ambient light over a fantasy vista, TIME OF DAY + DIRECTION + COLOUR OF THE LIGHT + HOW SHADOWS FALL. 15 to 30 words.

THE BAR: deliberate, coloured light that makes a pixel palette sing. Golden low sun raking across from one side, rose dawn light from behind the landmark, warm afternoon sun from high left with crisp short shadows and saturated colour, lilac twilight with a last warm band, silver moonlight from above with deep blue shadows.
ANTI-DULLNESS: bleached flat overhead light and grey featureless light are absent; every entry names a direction and a colour for both the light and the shadows.
${TONE} Bright and inviting even at night: moonlit entries are luminous, the land clearly visible in cool colour.

VARIETY MANDATE, distribute the ${n} across: 5 SUNRISE (low warm light from behind or beside the landmark, rose-gold ambient, long soft lilac shadows), 3 SOFT MORNING (gentle warm light from low right or left, clear pastel ambient, soft shadows), 4 BRIGHT WARM DAY (a high warm sun from one side, saturated colour everywhere, crisp short shadows in cool blue, the light clean and cheerful), 5 GOLDEN HOUR (low amber light raking from one side, warm rims on every edge, long violet shadows), 4 TWILIGHT (the sun just gone, lilac and rose ambient from the west fading to blue, soft merging shadows), 4 MOONLIT NIGHT (cool silver light from high above, the land pale and clearly visible, deep blue hard-edged shadows).
AXIS-CLEAN: ambient light only. Clouds, stars, the moon's shape, aurora, mist, weather, the landmark, and the wonder-light phenomenon belong to other axes and are absent here (the sun or moon may be named only as the light source).
${CLEAN}
Examples: "ROSE SUNRISE FROM BEHIND: low rose-gold sun rising behind the landmark, its edges rimmed in warm light, the land in soft lilac shadow with a warm glow creeping across the foreground"; "HIGH WARM SUN: a bright warm sun high on the left, colours saturated and clean, shadows short and crisp in cool blue, every surface cheerful and clear".
${FMT}` },

  air: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} AIR descriptions for PixelBot's pixel-fantasy-vista path: what the AIR itself is doing around a fantasy landmark. 12 to 25 words.

VARIETY MANDATE, distribute the ${n} across: 5 CLEAR SPARKLING AIR (crystal clear to the far horizon, a sparkle of tiny motes in the light, still and bright), 4 SOFT GOLDEN HAZE (a soft warm haze thickening with distance so the far layers fade pale), 5 MIST (soft mist rising from the falls, a low mist lying in the valley, thin mist wreathing the landmark's base, mist thinning to clear air above), 4 DRIFTING SEEDS OR PETALS (dandelion seeds drifting slowly, blossom petals floating down gently, glowing spores drifting like slow snow), 3 THIN CLOUD WISPS (soft wisps of cloud passing gently at the landmark's height, feathered and slow), 2 WARM SHIMMER (a gentle heat shimmer over the sunlit ground, the far edges softly wavering), 2 COOL FROST SPARKLE (crisp cold air with a fine glitter of frost drifting, still and clear).
MOTION IS GENTLE: seeds DRIFT, petals FLOAT DOWN, mist RISES SOFTLY and THINS, wisps PASS SLOWLY. Everything is soft and slow.
AXIS-CLEAN: air only. Light and time words, clouds overhead, stars, the landmark, the wonder-light, and animals belong to other axes and are absent here.
${TONE}
${CLEAN}
Examples: "MIST FROM THE FALLS: a soft white mist rising gently from the base of the falls, wreathing the lower rocks and thinning to clear bright air above"; "DANDELION DRIFT: hundreds of dandelion seeds drifting slowly through the air, catching the light as tiny soft sparks, the far distance clear".
${FMT}` },

  life: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} TINY-LIFE descriptions for PixelBot's pixel-fantasy-vista path: a small living presence in a fantasy vista, a scale-prover, never the hero. 10 to 22 words. Everything is TINY in the frame, a few pixels tall, far away.

VARIETY MANDATE, distribute the ${n} across: 5 A LONE TRAVELLER (a tiny cloaked traveller with a walking staff on the path toward the landmark, seen from behind, a speck), 3 A TINY CARAVAN (a line of three tiny wagons with a lantern, far down the road, specks), 5 BIRDS (a small flock of white birds wheeling far off, a pair of cranes crossing the water, gulls specks against the landmark), 4 A SMALL BOAT (one tiny rowboat on the lake, a small sailboat far out, a tiny ferry crossing to the landmark), 2 A DISTANT DRAGON SILHOUETTE (a tiny far dragon silhouette gliding gently beyond the landmark, a speck in the sky, gentle and remote), 3 GENTLE ANIMALS (a few tiny deer at the water's edge, tiny sheep on a far slope, a tiny fox on the path), 3 TINY VILLAGERS AT THE LANDMARK (two or three tiny figures at the foot of the landmark, specks, turned toward it).
Every entry says tiny, far, or a speck. Faces, close figures, groups larger than three, riders, and armour are absent; the figure is a scale-prover only.
${TONE}
${CLEAN}
Examples: "TINY TRAVELLER ON THE PATH: a tiny cloaked traveller with a walking staff on the winding path toward the landmark, seen from behind, a speck against the vast scene"; "FAR WHITE FLOCK: a small flock of white birds wheeling far off beside the landmark, tiny specks that prove its size".
${FMT}` },

  moment: { mvp: 25, scale: 50, prompt: (n) => `You are writing ${n} PASSING-MOMENT descriptions for PixelBot's pixel-fantasy-vista path: a small wondrous event happening in the scene right now. 10 to 22 words.

VARIETY MANDATE, distribute the ${n} across: 5 A LANTERN RELEASE (a few paper lanterns rising slowly from the landmark, warm and gentle), 3 A METEOR (one clean bright streak crossing the sky, gone in a moment), 4 A PASSING SKY-SHIP (a small wooden airship with a patched balloon drifting slowly past the landmark, far and small), 4 MIST PARTING (the mist parting softly to reveal the landmark's base, thinning gently), 3 A RAINBOW APPEARING (a soft rainbow arching gently beside the falls or the landmark), 3 A FLOCK LIFTING (a flock of small birds lifting gently from the landmark and wheeling once), 3 PETALS OR LEAVES DRIFTING DOWN (a slow fall of blossom petals or golden leaves drifting gently past).
MOTION IS GENTLE: lanterns RISE SLOWLY, mist PARTS SOFTLY, a meteor is ONE clean streak, petals DRIFT DOWN, the sky-ship DRIFTS. Everything is soft and slow.
AXIS-CLEAN: the moment only. Light and time words, the sky's fixed features, and the landmark's own description belong to other axes and are absent here.
${TONE}
${CLEAN}
Examples: "LANTERN RELEASE: a dozen warm paper lanterns rising slowly from the landmark's terraces, drifting gently upward one after another"; "ONE METEOR: a single clean bright streak crossing high above the landmark, a brief line of light".
${FMT}` },

  camera: { mvp: 25, scale: 25, prompt: (n) => `You are writing ${n} CAMERA framings for PixelBot's pixel-fantasy-vista path: splash-screen framings that keep ONE landmark as the hero at 40 to 60 percent of the frame with its place around it. 12 to 25 words: WHERE THE CAMERA SITS plus what fills the near, middle, and far of the frame. Refer to the subject only as "the landmark" so the framing fits any landmark type.

VARIETY MANDATE, distribute the ${n} across: 5 WIDE FROM THE VALLEY FLOOR (camera set low in the meadow or by the stream, the landmark rising above the middle ground, sky above), 5 FROM A CLIFF OPPOSITE (camera on a facing cliff edge, the landmark straight across a gap, a sunlit foreground shelf of rock and wildflowers), 4 FROM THE PATH BELOW LOOKING UP (camera on the winding path at the landmark's foot, tilted up so the landmark towers into the sky), 5 ACROSS A LAKE (camera at the near shore, still water in the foreground doubling the landmark, the landmark on the far shore), 4 FROM A HIGH RIDGE (camera high on a ridge, the landmark below and beyond in its whole land, the ridge's grassy crest as a foreground base), 2 THROUGH A FOREGROUND ARCH OF BRANCHES (camera under a leafy bough that frames the top of the picture, the landmark centred beyond).
THE CAMERA is a position ("camera set low at the stream's edge", "from the cliff opposite"); the foreground is named as what it IS (a sunlit shelf of rock, a meadow of wildflowers, still water, a grassy crest). Framings are wide or medium-wide.
${CLEAN}
Examples: "WIDE FROM THE VALLEY FLOOR: camera set low in the wildflower meadow, the stream winding ahead, the landmark rising huge above the middle ground, open sky above"; "ACROSS THE LAKE: camera at the near pebble shore, still water in the foreground doubling the landmark, the landmark centred on the far shore beneath a wide sky".
${FMT}` },

  palette: { mvp: 25, scale: 40, prompt: (n) => `You are writing ${n} PALETTE harmonies for PixelBot's pixel-fantasy-vista path: a named harmony of 3 to 5 colours for a limited-palette pixel-art splash screen of a wondrous fantasy place. 10 to 22 words, colour and light words ONLY (nouns of things and places are absent). Every entry ends by attaching its accent to the light, in this shape: "..., <accent> only in the brightest highlights" or "..., <accent> only in the glowing light".

VARIETY MANDATE, distribute the ${n} across: 5 SUNRISE PASTELS (peach, rose, lilac, soft gold, mint), 5 SATURATED JEWEL (emerald, sapphire, amethyst, warm gold), 5 TWILIGHT (lilac, teal, dusty rose, deep indigo, warm apricot accent), 5 MOONLIT (navy, slate blue, silver, pale violet, warm gold accent), 5 CANDY (bubblegum pink, sky blue, lemon, mint, cream).
${CLEAN}
Examples: "SUNRISE PASTEL: soft peach, rose, pale lilac, mint green, warm gold only in the brightest highlights"; "MOONLIT JEWEL: deep navy, slate blue, cool silver, pale violet, warm gold only in the glowing light".
${FMT}` },
};

(async () => {
  for (const [slot, cfg] of Object.entries(POOLS)) {
    if (only && only !== slot) continue;
    await generatePool({ outPath: `${DIR}pixelbot_pixel_fantasy_vista_${slot}.json`, total: SCALE ? cfg.scale : cfg.mvp, append: SCALE, batch: 25, maxTokens: 8000, metaPrompt: cfg.prompt });
  }
})().catch((e) => { console.error(e); process.exit(1); });
