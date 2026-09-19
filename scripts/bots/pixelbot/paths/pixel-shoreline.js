/**
 * PixelBot pixel-shoreline — the edge of the sea by day (PIXELBOT_SCENES_PLAN.md
 * §3.10). ONE coastal landform or small coastal structure is the hero; the
 * water's edge is always in frame and the water shows wave structure; the
 * horizon sits deliberately low or high. Wild and unbuilt, and still richly
 * detailed and layered. Money-shot: sun_on_water. Pools: 9 bespoke
 * (seeds/pixelbot_pixel_shoreline_*.json). Function-form; scene wiring derives
 * from index.js SCENE_PATHS.
 */
const blocks = require('../shared-blocks');
const scene = require('../scenePaths');

const SLOTS = ['place', 'sun_on_water', 'light', 'sky', 'air', 'life', 'moment', 'camera', 'palette'];
const P = scene.loadScenePools('pixel_shoreline', SLOTS);

const builder = ({ sharedDNA, vibeDirective, picker }) => {
  const place = scene.pick(picker, P, 'place', 'shoreline_place');
  const sunOnWater = scene.pick(picker, P, 'sun_on_water', 'shoreline_sun_on_water');
  const light = scene.pick(picker, P, 'light', 'shoreline_light');
  const sky = scene.pick(picker, P, 'sky', 'shoreline_sky');
  const air = scene.pick(picker, P, 'air', 'shoreline_air');
  const camera = scene.pick(picker, P, 'camera', 'shoreline_camera');
  const palette = scene.pick(picker, P, 'palette', 'shoreline_palette');
  const life = scene.gated(picker, P, 'life', 'shoreline_life', 0.6);
  const moment = scene.gated(picker, P, 'moment', 'shoreline_moment', 0.35);

  return `${blocks.PIXEL_LOOK_OVERRIDE(sharedDNA)}You are writing a WHIMSICAL PIXEL-ART PAINTING of the edge of the sea by day for PixelBot: a wild, unbuilt storybook coast with old-school game-world charm, the kind of shoreline an old RPG paints for its title screen. The coast IS the picture.

${blocks.SCENE_REGISTER_BLOCK}
${blocks.ONE_HERO_BLOCK} Here the hero is the COASTAL LANDFORM OR STRUCTURE at mid-distance. The horizon sits deliberately LOW (a big sky over a shallow strip of sea) or deliberately HIGH (a great sweep of sand, rock, or water), and the water's edge is always in the frame. The sea always shows structure: swell lines, foam lines, a feathering crest, a sheet of water sliding back over sand.

WILD AND UNBUILT, AND STILL RICHLY DETAILED: the coast is unspoilt, and it is layered and full of things to read. A NEAR layer at the water's edge with real texture (ribbed wet sand holding a sheen, a pitted rock shelf, a pebble bank, silvered boardwalk planks, a kelp line), the HERO in the middle, and a FAR layer stepping away into haze. Driftwood, sea grass, barnacled rock, weathered rope, and scattered shells make it feel real; one charm detail makes it lovable.

━━━ THE COAST (the hero) ━━━
${place}

━━━ CAMERA ━━━
${camera}

━━━ LIGHT ━━━
${light}

━━━ THE SUN ON THE WATER (the money shot) ━━━
${sunOnWater}

━━━ SKY ━━━
${sky}

━━━ AIR ━━━
${air}
${life ? `\n━━━ A CHARM DETAIL (tiny, never the hero) ━━━\n${life}\n${blocks.TINY_LIFE_BLOCK} Any figure is small, far down the beach, turned away, and dressed for wind and salt in a windbreaker, a raincoat, or a sun hat.\n` : ''}${moment ? `\n━━━ A PASSING MOMENT ━━━\n${moment}\n` : ''}
━━━ PALETTE ━━━
${palette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

The sky carries at most ONE special feature, counting whatever the PASSING MOMENT and the SUN ON THE WATER already bring (a big soft moon, a halo, a far squall line, a rainbow): when the moment already carries one, the sky stays a clean banded gradient with cloud. Choose one sun or one moon. If the LIGHT and the SKY disagree physically (a bright glitter path under a heavy grey ceiling, a moon at noon), keep the LIGHT and adjust the sky to fit it. Spray and haze are soft and hang in the air; foam is lines and flecks; light on the water stays broken into flecks and dashes or spread as a soft sheen. ${blocks.PICTORIAL_BLOCK} This is a pixel painting rather than a photograph, and any sea creature stays tiny inside a tide pool.

${blocks.SCENE_STRUCTURE('[the pixel-art style words] [the coast seen from the camera] [the light] [the sun on the water] [the sky and the air] [tiny life if any] [the passing moment if any] [the palette]')}`;
};

builder.vibes = ['nostalgic', 'cinematic', 'ethereal', 'whimsical'];
module.exports = builder;
