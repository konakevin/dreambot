/**
 * PixelBot pixel-skyward — ONE hand-built thing floating or flying over a
 * landscape (PIXELBOT_SCENES_PLAN.md §3.11). The vessel is the hero in the
 * UPPER MIDDLE of the frame; the sky is 50 to 70 percent of the picture as a
 * banded dithered gradient; the land below is the base layer. Money-shot:
 * sky_bands. Pools: 9 bespoke (seeds/pixelbot_pixel_skyward_*.json).
 * Function-form; scene wiring derives from index.js SCENE_PATHS.
 */
const blocks = require('../shared-blocks');
const scene = require('../scenePaths');

const SLOTS = ['vessel', 'land_below', 'sky_bands', 'light', 'air', 'life', 'moment', 'camera', 'palette'];
const P = scene.loadScenePools('pixel_skyward', SLOTS);

const builder = ({ sharedDNA, vibeDirective, picker }) => {
  const vessel = scene.pick(picker, P, 'vessel', 'skyward_vessel');
  const land = scene.pick(picker, P, 'land_below', 'skyward_land');
  const sky = scene.pick(picker, P, 'sky_bands', 'skyward_sky');
  const light = scene.pick(picker, P, 'light', 'skyward_light');
  const air = scene.pick(picker, P, 'air', 'skyward_air');
  const camera = scene.pick(picker, P, 'camera', 'skyward_camera');
  const palette = scene.pick(picker, P, 'palette', 'skyward_palette');
  const life = scene.gated(picker, P, 'life', 'skyward_life', 0.6);
  const moment = scene.gated(picker, P, 'moment', 'skyward_moment', 0.35);

  return `${blocks.PIXEL_LOOK_OVERRIDE(sharedDNA)}You are writing a PIXEL-ART PAINTING of one hand-built thing floating high over a landscape, for PixelBot: the wide-open sky picture a classic game paints on its title screen. Charming and a little magical, built from cloth, rope, wicker, paper, and timber. The VESSEL and the SKY together are the picture.

${blocks.SCENE_REGISTER_BLOCK}
${blocks.ONE_HERO_BLOCK} Here the hero is the VESSEL, set in the UPPER MIDDLE of the frame, drifting and leaning gently on the air. The SKY is the dominant field, filling roughly 50 to 70 percent of the picture as a banded dithered gradient, and the land reads as the base layer along the bottom.

━━━ THE VESSEL (the hero) ━━━
${vessel}

━━━ CAMERA ━━━
${camera}

━━━ THE SKY BANDS (the money shot) ━━━
${sky}

━━━ THE LIGHT ━━━
${light}

━━━ THE LAND BELOW (the base layer) ━━━
${land}

━━━ AIR ━━━
${air}
${life ? `\n━━━ TINY LIFE (never the hero) ━━━\n${life}\n${blocks.TINY_LIFE_BLOCK}\n` : ''}${moment ? `\n━━━ A PASSING MOMENT ━━━\n${moment}\n` : ''}
━━━ PALETTE ━━━
${palette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

The sky takes its colours from THE LIGHT: if the sky bands and the light disagree, keep the light and shift the sky's colours to sit under it, keeping its banding and its dither exactly as described. The sky carries at most ONE special feature in total, counting whatever the sky bands and the passing moment each bring (one big moon, or one aurora, or one cirrus streak, or one rainbow, or one star field, or one rain fan), and there is one sun or one moon, one of them only. The vessel is stitched cloth, rope, wicker, paper, and light timber, soft and full and leaning on the air, and its cloth is built from pixels like everything else: its stripes and panels are flat blocks of colour, each panel steps into shadow through two or three dithered bands of dots, and every edge and rope is a hard pixel step. Say this about the vessel's cloth in the prompt. ${blocks.PICTORIAL_BLOCK} The envelope, the gondola, the basket, and the pennant show plain colour, plain stripes, or one simple painted symbol.

${blocks.SCENE_STRUCTURE('[the pixel-art style words] [the vessel high in the upper middle, seen from the camera] [the banded dithered sky] [the light] [the land far below] [the air] [tiny life if any] [the passing moment if any] [the palette]')}`;
};

builder.vibes = ['ethereal', 'whimsical', 'enchanted', 'cinematic'];
module.exports = builder;
