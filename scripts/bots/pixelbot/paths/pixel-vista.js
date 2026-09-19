/**
 * PixelBot pixel-vista — a great natural landform as the hero of a pixel-art
 * PAINTING (PIXELBOT_SCENES_PLAN.md §3.8). Replaces epic-vista at ship time.
 * No character. Landform 60-70% of frame; scale-provers tiny and deep; no
 * near-foreground prop. Money-shot: the light moment. Pools: 9 bespoke
 * (seeds/pixelbot_pixel_vista_*.json). Function-form; scene wiring derives
 * from index.js SCENE_PATHS.
 */
const blocks = require('../shared-blocks');
const scene = require('../scenePaths');

const SLOTS = ['landform', 'light', 'air', 'light_moment', 'sky', 'life', 'moment', 'camera', 'palette'];
const P = scene.loadScenePools('pixel_vista', SLOTS);

const builder = ({ sharedDNA, vibeDirective, picker }) => {
  const landform = scene.pick(picker, P, 'landform', 'vista_landform');
  const light = scene.pick(picker, P, 'light', 'vista_light');
  const air = scene.pick(picker, P, 'air', 'vista_air');
  const lightMoment = scene.pick(picker, P, 'light_moment', 'vista_light_moment');
  const sky = scene.pick(picker, P, 'sky', 'vista_sky');
  const camera = scene.pick(picker, P, 'camera', 'vista_camera');
  const palette = scene.pick(picker, P, 'palette', 'vista_palette');
  const life = scene.gated(picker, P, 'life', 'vista_life', 0.6);
  const moment = scene.gated(picker, P, 'moment', 'vista_moment', 0.35);

  return `${blocks.PIXEL_LOOK_OVERRIDE(sharedDNA)}You are writing a PIXEL-ART PAINTING of a great natural landform for PixelBot: a place so grand people stop scrolling. The landform IS the picture. There is no character.

${blocks.SCENE_REGISTER_BLOCK}
${blocks.ONE_HERO_BLOCK} Here the hero is the LANDFORM: it fills 60 to 70 percent of the frame, scale-provers stay tiny and deep, and the near foreground stays simple so nothing competes with it.

━━━ THE LANDFORM (the hero) ━━━
${landform}

━━━ CAMERA ━━━
${camera}

━━━ LIGHT ━━━
${light}

━━━ THE LIGHT MOMENT (the money shot) ━━━
${lightMoment}

━━━ SKY ━━━
${sky}

━━━ AIR ━━━
${air}
${life ? `\n━━━ TINY LIFE (a scale-prover, never the hero) ━━━\n${life}\n${blocks.TINY_LIFE_BLOCK}\n` : ''}${moment ? `\n━━━ A PASSING MOMENT ━━━\n${moment}\n` : ''}
━━━ PALETTE ━━━
${palette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

If any two of the LIGHT, the LIGHT MOMENT, and the SKY disagree physically (moonlight with a sunshaft, stars with daylight, a moonrise at noon), keep the LIGHT MOMENT and adjust the other two to fit it, and choose one sun or one moon, never both. Restrained truth beats a forced impossibility. ${blocks.PICTORIAL_BLOCK}

${blocks.SCENE_STRUCTURE('[the pixel-art style words] [the landform seen from the camera] [the light and the light moment] [the sky and the air] [tiny life if any] [the passing moment if any] [the palette]')}`;
};

builder.vibes = ['epic', 'ethereal', 'cinematic', 'nostalgic'];
module.exports = builder;
