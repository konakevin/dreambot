#!/usr/bin/env node
/**
 * PixelBot pixel-cool-rides — bespoke pools (PIXELBOT_SCENES_PLAN.md §3.5).
 * ONE cool old machine at rest or cruising through a beautiful place, as the
 * splash-screen pixel scene a classic game shows on its title screen. The ride
 * is the hero at mid-distance; the route (road, track, river, flight line) is
 * the lead line and the money-shot. Painted, never raced. 9 pools, axis-clean,
 * positive-only, morphological rides only (no makes or models). MVP 25 each;
 * --scale appends to production size.
 * Run: node scripts/gen-seeds/pixelbot/gen-pixel-cool-rides-pools.js [--only slot] [--scale]
 */
const { generatePool } = require('../../lib/seedGenHelper');
const DIR = 'scripts/bots/pixelbot/seeds/';
const SCALE = process.argv.includes('--scale');
const only = (() => { const i = process.argv.indexOf('--only'); return i >= 0 ? process.argv[i + 1] : null; })();
const FMT = `Format every entry exactly as 'CAPS TITLE: body' (a short capitalised title, a colon, then the body). Return ONLY a JSON array of strings.`;
const CLEAN = `POSITIVE ONLY: describe what is there; write no negations, no "no", no "never", no "without".`;

const POOLS = {
  ride: { mvp: 25, scale: 100, prompt: (n) => `You are writing ${n} RIDE descriptions for PixelBot's pixel-cool-rides path: ONE charming old machine, the hero of an old-school splash-screen pixel painting (the cool vehicle a classic 16-bit game paints on its title screen: storybook-rounded, a little exaggerated, instantly lovable). Each entry describes the MACHINE only: its era silhouette, its colour, ONE lamp it carries, ONE charm detail, and whether it is cruising gently or parked. 30 to 50 words.

THE BAR: charming over cool over realistic. Storybook shapes: a bulbous rounded nose, a boxy tall cab, fat tyres, big spoked wheels, a long hood with a round headlamp, a stubby boiler with a tall funnel, a fat striped balloon envelope, slipper-shaped floats, a curved roof like a loaf. The machine is painted in one or two cheerful colours with a simple painted stripe; it is a pixel-art toy of a vehicle, never a product render. Every entry names ONE LAMP on the machine as a plain object (a round headlamp, a brass lantern hung from the sidecar, a burner flame under the balloon, a nose light, a bell-shaped lamp on the tram) and ONE charm detail (a sidecar shaped like a little boat, a rolled canvas and a kettle tied to the roof rack, a curly brass whistle, a spare wheel strapped to the tailgate, a tiny pennant on a whip aerial, a cowcatcher like a comb, a polka-dot balloon envelope, a wicker basket with sandbags, a propeller with rounded blades).

ERA BY SILHOUETTE ONLY: the machine is described by its shape words (boxy, rounded, long-hood, round headlamp, spoked, riveted, tall funnel, wooden slats, canvas roof); makers, brands, model names, badges, and numbers are absent. Every painted panel is a plain single colour or a simple stripe; boards and plates are blank painted panels; the tram's destination board is a plain blank panel; the van's side carries a single painted stripe. TEXT-SAFE SURFACES, SAID IN EVERY ENTRY (R0 lesson: a locomotive tender rendered gold gibberish lettering because the entry said nothing about its sides): every steam engine names "its tender and cab sides plain <colour> with one painted stripe" (and the carriage side plain), every plane and seaplane names "a plain <colour> fuselage and a plain rounded tail fin", every tram names its blank destination panel, every van or camper names its plain side with one stripe, and every WHEELED machine (motorcycle, scooter, sidecar rig, van, camper, caravan, snowmobile, dune buggy) says "its front and rear panels plain painted with one small round pictorial emblem and blank unmarked plates" (R1 lesson: a camper van rendered a number plate with gibberish letters).

VARIETY MANDATE, distribute the ${n} across: 5 MOTORCYCLE (a boxy 1970s touring bike with a round headlamp; a low-slung bike with a boat-shaped sidecar; a pastel scooter with a round mirror; a fat-tyred trail bike with a tiny rack; a sidecar rig with a canvas hood), 4 CAMPER OR VAN (a loaf-roofed camper with a striped awning; a boxy van with a roof rack piled with canvas and a lantern; a rounded caravan towed by a stubby car; a tall tin camper with a little chimney), 4 STEAM TRAIN (a stubby tank engine with a tall funnel and one carriage; a green engine with a cowcatcher and a brass bell; a little red engine with a fat boiler; a narrow-gauge engine with a wooden cab), 3 SMALL PLANE (a two-wing biplane with rounded wingtips; a fat-bodied propeller plane with a round nose; a high-wing light plane with fat tyres), 3 TRAM OR TROLLEY (a rounded cream-and-green tram with a bell lamp; a boxy wooden trolley with a curved roof; a little cable car with an open balcony), 2 HOT-AIR BALLOON (a candy-striped envelope with a wicker basket; a polka-dot envelope with a burner flame), 2 SEAPLANE (a fat-bodied floatplane on slipper floats; a small biplane on floats), 2 SNOW OR DUNE MACHINE (a rounded snowmobile with a round headlamp and a sled behind; a boxy dune buggy with fat tyres and a roll cage).

STATE: the machine is cruising gently along or parked at rest (its kickstand down, its engine ticking, its basket resting); it is painted, never raced.
AXIS-CLEAN: the entry names the MACHINE only. The place, the road or water, the light, the time of day, the weather, the sky, riders, and animals belong to other axes and are absent here. The lamp is named as an object; its glow belongs to another axis.
${CLEAN}
Examples: "BOXY TOURING MOTORCYCLE: a boxy 1970s touring motorcycle in deep cherry red with a big round chrome headlamp, a long padded saddle, spoked wheels, a canvas roll and a tin kettle strapped to the rear rack, cruising gently along"; "LOAF-ROOF CAMPER VAN: a rounded camper van in mint green with a cream loaf-shaped roof, one round headlamp each side, a striped awning rolled above the side door, a spare wheel strapped to the tailgate, parked at rest"; "STUBBY TANK ENGINE: a stubby green tank engine with a tall black funnel, a fat riveted boiler, a brass bell and one round headlamp on the smokebox, a cowcatcher like a comb, one little red carriage behind, puffing gently along".
${FMT}` },

  route_line: { mvp: 25, scale: 200, prompt: (n) => `You are writing ${n} ROUTE-AND-PLACE descriptions for PixelBot's pixel-cool-rides path: the MONEY SHOT, a beautiful storybook place with ONE lead line running through it and receding into the distance (a road, a track, a river, a lane of water, a flight line over fields). This is the landscape of a classic game's splash screen: whimsical, a little magical, rounded exaggerated landforms, richly detailed, never a realistic geography. Each entry names the PLACE, the LEAD LINE and how it recedes, and ONE storybook feature. 30 to 50 words.

THE BAR: the lead line is the composition. Every entry says where the line starts near the viewer and where it vanishes: switchbacks stacking up a mountainside, a coast road hugging a cliff above a bay, a trestle bridge striding across a gorge, a ridge road running along the spine of rounded hills, a river bending twice through a valley, a lakeshore track, a steep cobbled lane climbing a hill town, a farm road between patchwork fields. Landforms are storybook: rounded hills like loaves, candy-striped rock bands, an oversized rounded mountain, a bay curved like a bowl, hills stacked like cushions. Every entry carries ONE storybook feature: a stone arch bridge, a stubby lighthouse on the point, a village of round-roofed houses, a windmill with four fat sails, a waterfall beside the bend, a castle with a single round tower on the ridge, a giant mushroom-capped tree, a tiny station house with a bell, a covered bridge, a stone tunnel mouth with a keystone, a pier with a lantern post.

VARIETY MANDATE, distribute the ${n} across: 4 COAST OR CLIFF ROAD (a road carved along a cliff above a curved bay, a causeway across a shallow lagoon), 4 MOUNTAIN SWITCHBACKS (a road stacking up a rounded mountainside in tight hairpins, a pass road between snowy peaks), 4 RAIL LINE (a wooden trestle bridge across a gorge, a stone viaduct of round arches across a valley, a track curving along a lake shore, a track winding up through terraced hills), 3 RIDGE ROAD (a road along the spine of rounded hills, a high moor road with a cairn), 3 HILL-TOWN LANE (a steep cobbled lane climbing between tall narrow pastel houses, a tram track up a hill between gardens), 3 WATER LANE (a river bending twice through a green valley, a long lake with a landing lane of calm water, a fjord between rounded green walls), 2 PATCHWORK FIELDS (a valley of patchwork fields with a straight farm road and hedgerows, a rolling quilt of fields with a grass runway between them), 2 SNOW OR DUNE TRACK (a track along a snowy ridge above a frozen lake, a sand track between rounded dunes to an oasis).

AXIS-CLEAN: the entry names the place, the lead line, and the storybook feature only. The ride itself, light, time of day, weather, mist, clouds, sky, people, and animals belong to other axes and are absent here. Famous landmarks, regions, and franchises are absent; describe the place.
${CLEAN}
Examples: "CLIFF ROAD ABOVE THE BOWL BAY: a coast road hugging a candy-striped cliff, curving from the near foreground around a bay shaped like a bowl, turquoise shallows below, a stubby white lighthouse on the far point where the road vanishes"; "TRESTLE ACROSS THE GORGE: a tall wooden trestle bridge striding across a deep green gorge on stilt legs, the track running from the near bank to a tunnel mouth in the far cliff, a waterfall threading the gorge floor below"; "SWITCHBACKS UP THE LOAF MOUNTAIN: a road stacking up a rounded mountainside in five tight hairpins, meadows between the bends, a tiny stone hut with a bell at the top where the road crests, a valley of patchwork fields spread far below".
${FMT}` },

  sky: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} SKY descriptions for PixelBot's pixel-cool-rides path: the sky layer over a classic game's splash-screen pixel scene, overhead form and colour ONLY. The sky is pixel art's signature, so every entry is a graded, banded, dithered sky that carries ONE feature. 15 to 28 words.

THE BAR: every sky has a feature. A dithered gradient sky stepped in wide colour bands, a big soft oversized moon, plump cotton cloud puffs, a field of sharp pixel stars, a galaxy arc, an aurora curtain, a soft sun halo of rings, a rainbow band. The sky is never a plain flat expanse.

VARIETY MANDATE, distribute the ${n} across: 5 DITHERED COLOUR BANDS (a sky stepped in clean bands from a warm horizon band to a deep crown, one or two small puffs resting in a band), 4 OVERSIZED MOON (a huge soft moon filling a quarter of the sky, dithered in cream with soft grey seas and a thin halo band), 4 COTTON CLOUD PUFFS (plump rounded cloud puffs like scoops, rim-lit by a lighter pixel edge, graded sky between them), 3 STAR FIELD (a deep dithered vault dusted with sharp pixel stars and a few brighter four-point stars), 2 GALAXY ARC (a broad soft arc of dusted starlight sweeping overhead), 2 AURORA CURTAIN (a soft rippling curtain in two gentle colours hanging high), 3 SUN HALO (a big soft low sun wrapped in rings of dithered colour bands, a few small puffs beside it), 2 RAINBOW BAND (a wide soft rainbow arc of clean colour bands across a graded sky).

AXIS-CLEAN: overhead form and colour only. Time-of-day words, the land, the ride, weather at ground level, mist, and light on the ground belong to other axes and are absent here. Clouds are soft moist puffs that rest, drift, and drape; the moon and sun are soft glowing shapes in the sky.
${CLEAN}
Examples: "CANDY BANDED SKY: a sky stepped in wide dithered bands of colour, each band a clean shade from the horizon up to the crown, two small cotton clouds resting in the middle band"; "BIG SOFT MOON: a huge round moon filling a quarter of the sky, dithered in pale cream with soft grey seas, a thin halo band around it and a few sharp pixel stars beyond"; "SUN HALO RINGS: a big soft low sun wrapped in three rings of dithered colour bands, apricot to rose to lilac, one plump puff resting beside it".
${FMT}` },

  light: { mvp: 25, scale: 100, prompt: (n) => `You are writing ${n} LIGHT descriptions for PixelBot's pixel-cool-rides path: the ambient light over a splash-screen pixel scene of a machine in a landscape. Each entry stacks TIME + DIRECTION + COLOUR OF THE AMBIENT LIGHT + HOW SHADOWS FALL. 15 to 30 words.

THE BAR: deliberate, coloured, directional light. Every entry names a direction and a colour and says what the shadows do. Light is a glow, a soft shaft, a warm patch, a path of glitter, a rim of light along an edge; it is always described as light, never as a solid object.

VARIETY MANDATE, distribute the ${n} across: 5 GOLDEN HOUR (a low sun from one side, long warm shadows across the route), 4 DAWN (first light from behind the far hills, rose and pale gold ambient, the valley still in soft blue shadow), 4 BLUE HOUR (the sun just gone, indigo and violet ambient, one last warm band low in the west), 4 MOONLIT NIGHT (cool silver light from high up, hard-edged blue shadows, the route pale), 3 LATE AFTERNOON (warm slanting light from the side, shadows stretching and rim-light along every edge), 3 SUNSET AFTERGLOW (rose and orange ambient fading upward, the land in warm shadow, the far hills glowing), 2 SOFT MORNING (gentle side light, cool clean shadows, dew glitter).

AXIS-CLEAN: ambient light only. Weather, mist, haze, clouds, stars, the moon's shape, the machine, and the place belong to other axes and are absent here (the sun or moon may be named only as the light source).
${CLEAN}
Examples: "GOLDEN HOUR FROM THE LEFT: a low sun from the left, warm honey light raking across the route, long soft shadows stretching to the right, every edge rimmed in gold"; "HIGH MOON: cool silver light from straight overhead, the route pale and glittering, shadows short, sharp-edged and deep blue".
${FMT}` },

  air: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} AIR descriptions for PixelBot's pixel-cool-rides path: what the AIR itself is doing over a landscape with a route through it. 12 to 25 words.

VARIETY MANDATE, distribute the ${n} across: 5 crisp clear air (still and sharp, every far detail crisp, dry clean air, a cool clear breeze), 4 soft valley haze (a soft haze layering the far hills paler and paler, a warm heat shimmer over the far road), 4 mist (ground mist lying in the valley floor, sea mist softening the far point, a thin mist over the water), 3 light rain or after-rain shine (a soft drizzle, wet road shining, rain just ended and everything glistening), 3 snowfall for cold places (fat slow flakes drifting straight down, a fine steady fall, snow just ending with the air sparkling), 3 dust haze for dry places (a soft golden dust haze hanging low over the track, dry air with a faint shimmer), 3 drifting fog banks or low cloud lying in the hollows below the route.
MOTION: snow drifts and falls, mist lies and thins, haze hangs, dust hangs soft and low. Everything is soft and slow.
AXIS-CLEAN: air only. Light and time words, clouds and the sky, the ride, the place, and animals belong to other axes and are absent here.
${CLEAN}
Examples: "SOFT VALLEY HAZE: a soft haze layering the far hills paler and paler toward the horizon, the near ground crisp"; "GROUND MIST IN THE HOLLOW: a knee-high white mist lying along the valley floor below the route, thinning to clear air above".
${FMT}` },

  life: { mvp: 25, scale: 60, prompt: (n) => `You are writing ${n} TINY-LIFE descriptions for PixelBot's pixel-cool-rides path: a small living accent near a machine on its route, never the hero. 10 to 22 words. Everything is small in the frame.

VARIETY MANDATE, distribute the ${n} across: 4 a rider small on the ride, seen from behind, turned toward the road ahead (a tiny helmeted figure, a scarf trailing), 3 a dog riding along, small (in the sidecar, its head out of the van window, on the seat of the sled), 3 gulls wheeling far off or resting on posts, 3 cows or sheep at a fence beside the route, small, 3 a goat or a deer on a rock above the route, 2 horses in a paddock beside the road, far, 2 a cat on the camper step or the station bench, 2 a heron or ducks at the water's edge, 2 a small figure far off at a gate or a field edge, turned away, waving, 1 a flock of small birds lifting from a hedgerow.
Every entry says small, tiny, or far. Faces, close figures, and groups of people are absent.
${CLEAN}
Examples: "RIDER SMALL ON THE SADDLE: a tiny helmeted rider seen from behind on the ride, a scarf trailing, turned toward the road ahead"; "DOG IN THE SIDECAR: a small dog sitting up in the sidecar with its ears back, tiny in the frame".
${FMT}` },

  moment: { mvp: 25, scale: 50, prompt: (n) => `You are writing ${n} PASSING-MOMENT descriptions for PixelBot's pixel-cool-rides path: a small event happening in the scene right now, around a machine on its route. 10 to 22 words.

VARIETY MANDATE, distribute the ${n} across: 5 a soft warm headlamp glow spilling ahead onto the route, 4 a soft puff of steam or exhaust drifting up and thinning, 3 a soft dust haze hanging behind the wheels, 3 a balloon or plane just lifting clear of the ground, 3 leaves or petals drifting slowly across the route, 3 a shooting star crossing or a star twinkling brighter, 2 a soft white wake spreading gently behind floats on calm water, 2 a lantern swinging gently from its hook.
Everything is light, steam, haze, water, or drifting leaves in gentle motion; it is soft and slow, never a streak, a plume, a burst, or a swirl.
${CLEAN}
Examples: "HEADLAMP GLOW AHEAD: a soft warm headlamp glow spilling ahead onto the route, fading gently into the distance"; "STEAM PUFF: a soft round puff of white steam drifting up from the funnel and thinning slowly into the air".
${FMT}` },

  camera: { mvp: 25, scale: 25, prompt: (n) => `You are writing ${n} CAMERA framings for PixelBot's pixel-cool-rides path: painterly framings that keep ONE machine ("the ride") as the hero at mid-distance, in profile or three-quarter view, with the route receding as a lead line and the landscape sharing the frame. 10 to 22 words: where the camera sits plus what dominates the frame. Refer to the subject only as "the ride" so the framing fits a motorcycle, a van, a train, a plane, a tram, a balloon, a seaplane, or a snowmobile alike.

VARIETY MANDATE, distribute the ${n} across: 5 three-quarter view from the roadside, the ride at mid-distance, the route curving away beyond it, 5 side profile with the valley or the bay spread behind the ride, 4 slightly elevated from the ridge or hillside above, looking down at the ride on its route, 4 from the end of the bridge, the pier, or the track, the line receding to the ride and beyond, 4 camera set low at the road's shoulder or the water's edge, the ride mid-distance, the sky generous above, 3 from a bend ahead looking back along the route to the ride, the landscape closing the view.
Framings are medium-wide or wide, the camera at rest beside or above the route the way a painting is composed. The camera sits; it is named by its position only.
${CLEAN}
Examples: "THREE-QUARTER FROM THE ROADSIDE: camera at the roadside, the ride at mid-distance in three-quarter view, the route curving away beyond it into the far hills"; "SIDE PROFILE WITH THE BAY BEHIND: the ride in clean side profile at mid-distance, the bay and its far shore spread wide behind, sky filling the upper third".
${FMT}` },

  palette: { mvp: 25, scale: 40, prompt: (n) => `You are writing ${n} PALETTE harmonies for PixelBot's pixel-cool-rides path: a named harmony of 3 to 5 colours for a limited-palette splash-screen pixel scene of a machine in a landscape. 10 to 22 words, colour and light words ONLY (nouns of things and places are absent). Every entry ends by attaching one warm note to the ride's lamp, in this shape: "..., warm amber only in the lamp glow".

VARIETY MANDATE, distribute the ${n} across: 6 golden-dusk harmonies (honey, apricot, plum, dusty teal), 5 dawn-rose harmonies (rose, pale gold, lilac, soft blue), 5 cool-night harmonies (indigo, navy, silver, slate), 4 fresh-morning harmonies (mint, sky blue, cream, soft green), 3 autumn harmonies (rust, ochre, plum, olive), 2 snow harmonies (pale blue, pearl, lilac, dove grey). The warm note may vary: warm amber, candle gold, lantern yellow, hearth orange.
${CLEAN}
Examples: "HONEY DUSK: honey gold, apricot, deep plum, dusty teal, warm amber only in the lamp glow"; "INDIGO NIGHT: deep indigo, navy, cool silver, slate blue, lantern yellow only in the lamp glow".
${FMT}` },
};

(async () => {
  for (const [slot, cfg] of Object.entries(POOLS)) {
    if (only && only !== slot) continue;
    await generatePool({ outPath: `${DIR}pixelbot_pixel_cool_rides_${slot}.json`, total: SCALE ? cfg.scale : cfg.mvp, append: SCALE, batch: 25, maxTokens: 8000, metaPrompt: cfg.prompt });
  }
})().catch((e) => { console.error(e); process.exit(1); });
