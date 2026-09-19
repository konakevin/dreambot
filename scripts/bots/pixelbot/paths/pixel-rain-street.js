/**
 * PixelBot pixel-rain-street — an OLD-TOWN street after rain, lit by windows
 * and old street lamps, as the pretty pixel-art scene a classic game shows on
 * its splash screen (PIXELBOT_SCENES_PLAN.md §3.4). ONE focal element (a tram,
 * a lit window, a bridge, a lamp post) is the hero; the street recedes into
 * depth; the wet pavement carries the light. Money-shot: pavement_reflection.
 * Always dusk or night, always wet. Pools: 9 bespoke
 * (seeds/pixelbot_pixel_rain_street_*.json). Function-form; scene wiring
 * derives from index.js SCENE_PATHS.
 */
const blocks = require('../shared-blocks');
const scene = require('../scenePaths');

const SLOTS = ['street', 'pavement_reflection', 'light', 'sky', 'air', 'life', 'moment', 'camera', 'palette'];
const P = scene.loadScenePools('pixel_rain_street', SLOTS);

const builder = ({ sharedDNA, vibeDirective, picker }) => {
  const street = scene.pick(picker, P, 'street', 'rain_street');
  const reflection = scene.pick(picker, P, 'pavement_reflection', 'rain_reflection');
  const light = scene.pick(picker, P, 'light', 'rain_light');
  const sky = scene.pick(picker, P, 'sky', 'rain_sky');
  const air = scene.pick(picker, P, 'air', 'rain_air');
  const camera = scene.pick(picker, P, 'camera', 'rain_camera');
  const palette = scene.pick(picker, P, 'palette', 'rain_palette');
  const life = scene.gated(picker, P, 'life', 'rain_life', 0.6);
  const moment = scene.gated(picker, P, 'moment', 'rain_moment', 0.35);

  return `${blocks.PIXEL_LOOK_OVERRIDE(sharedDNA)}You are writing a PIXEL-ART PAINTING of an old-town street after rain, lit by warm windows and old street lamps, for PixelBot: the picture that makes a person want to walk down that street tonight. Charming, nostalgic, a little magical, with old-school game charm: crooked gables, a glowing round window, a lantern with a coloured shade, wet cobbles carrying the light. The street is old stone, timber, and brick; any vehicle is a small rounded old silhouette. The street IS the picture.

${blocks.SCENE_REGISTER_BLOCK}
${blocks.ONE_HERO_BLOCK} Here the hero is the ONE focal element named below (a tram, a lit window, a bridge, a lamp post, an arcade); the street recedes into depth behind and beyond it; the wet pavement carries the light. It is always dusk or night, and the ground is always wet.

━━━ THE STREET AND ITS HERO ━━━
${street}

━━━ CAMERA ━━━
${camera}

━━━ THE LIGHT (windows and old lamps under a cool evening) ━━━
${light}

━━━ THE PAVEMENT REFLECTION (the money shot) ━━━
${reflection}

━━━ SKY (the slice above the rooftops) ━━━
${sky}

━━━ AIR (the rain) ━━━
${air}
${life ? `\n━━━ TINY LIFE (never the hero) ━━━\n${life}\n${blocks.TINY_LIFE_BLOCK}\n` : ''}${moment ? `\n━━━ A PASSING MOMENT ━━━\n${moment}\n` : ''}
━━━ PALETTE ━━━
${palette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

The night takes its colour from the LIGHT (indigo, slate, teal, violet, silver); the windows and lamps are the ONE warm note set against that cool wet night, and the pavement reflection doubles it, so the whole picture is never uniformly golden. If the LIGHT, the SKY, and the AIR disagree physically (stars under steady rain, a moon behind a full cloud ceiling), keep the LIGHT and adjust the others to fit it. At most one moon; the sky carries at most ONE special feature. Figures, if any, are at most two, small, and turned away. Every board, plate, and shopfront panel shows flat painted colour or one simple carved shape (a pretzel, a boot, a fish), and the house fronts otherwise show only shutters, flower boxes, ivy, lanterns, and lit windows; charm details hang from a bracket or a chain; windows glow warm and wordless. ${blocks.PICTORIAL_BLOCK}

${blocks.SCENE_STRUCTURE('[the pixel-art style words] [the street and its hero seen from the camera] [the light, opening with the words "at dusk" or "at night" and the ambient colour before the lamps and windows] [the pavement reflection] [the sky and the air] [tiny life if any] [the passing moment if any] [the palette]')}`;
};

builder.vibes = ['nostalgic', 'cinematic', 'enchanted', 'nightshade', 'whimsical'];
module.exports = builder;
