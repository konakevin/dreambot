/**
 * PixelBot pixel-fantasy-vista — a fantasy place you'd want to visit, painted
 * in pixels: the Final Fantasy title-screen vista (PIXELBOT_SCENES_PLAN.md
 * §3.6). ONE built or magical LANDMARK is the hero at 40 to 60 percent of the
 * frame (floating islands, a wizard's tower, a giant tree village, crystal
 * caverns, a castle over a lake, a sky whale, a glowing forest, reclaimed
 * ruins, a cloud city); tiny scale-provers prove its size. Money-shot:
 * wonder_light. Bright, inviting, wondrous. Sibling pixel-vista owns natural
 * landforms. Pools: 9 bespoke (seeds/pixelbot_pixel_fantasy_vista_*.json).
 * Function-form; scene wiring derives from index.js SCENE_PATHS.
 */
const blocks = require('../shared-blocks');
const scene = require('../scenePaths');

const SLOTS = ['landmark', 'wonder_light', 'sky', 'light', 'air', 'life', 'moment', 'camera', 'palette'];
const P = scene.loadScenePools('pixel_fantasy_vista', SLOTS);

const builder = ({ sharedDNA, vibeDirective, picker }) => {
  const landmark = scene.pick(picker, P, 'landmark', 'fantasy_vista_landmark');
  const wonder = scene.pick(picker, P, 'wonder_light', 'fantasy_vista_wonder');
  const sky = scene.pick(picker, P, 'sky', 'fantasy_vista_sky');
  const light = scene.pick(picker, P, 'light', 'fantasy_vista_light');
  const air = scene.pick(picker, P, 'air', 'fantasy_vista_air');
  const camera = scene.pick(picker, P, 'camera', 'fantasy_vista_camera');
  const palette = scene.pick(picker, P, 'palette', 'fantasy_vista_palette');
  const life = scene.gated(picker, P, 'life', 'fantasy_vista_life', 0.6);
  const moment = scene.gated(picker, P, 'moment', 'fantasy_vista_moment', 0.35);

  return `${blocks.PIXEL_LOOK_OVERRIDE(sharedDNA)}You are writing a PIXEL-ART SPLASH SCREEN of a fantasy place you'd want to visit, for PixelBot: the wondrous vista a classic RPG shows on its title screen, the world the player is about to enter. Inviting, bright, wondrous, a place you'd want to visit. The LANDMARK IS the picture.

${blocks.SCENE_REGISTER_BLOCK}
${blocks.ONE_HERO_BLOCK} Here the hero is the LANDMARK: a built or magical wonder that owns 40 to 60 percent of the frame and reads in two seconds, with its land around and beneath it; tiny scale-provers (lit windows, birds, a traveller on the path) prove how big it is. Any figure is a speck.

━━━ THE LANDMARK AND ITS PLACE (the hero) ━━━
${landmark}

━━━ CAMERA ━━━
${camera}

━━━ THE LIGHT (the ambient light over everything) ━━━
${light}

━━━ THE WONDER LIGHT (the money shot) ━━━
${wonder}

━━━ SKY ━━━
${sky}

━━━ AIR ━━━
${air}
${life ? `\n━━━ TINY LIFE (a scale-prover, never the hero) ━━━\n${life}\n${blocks.TINY_LIFE_BLOCK}\n` : ''}${moment ? `\n━━━ A PASSING MOMENT ━━━\n${moment}\n` : ''}
━━━ PALETTE ━━━
${palette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

If the LIGHT, the WONDER LIGHT, and the SKY disagree physically (a moon under a sunrise, stars in daylight), keep the LIGHT and adjust the others to fit it; choose one sun or one moon, never both. The sky carries at most ONE special feature (banded colour, or a big moon, or cloud puffs, or stars, or an aurora), never a stack of them. If the AIR or the MOMENT names a climate the landmark's place contradicts, keep the landmark's place and let the air fit it. The whole picture is inviting, bright, and wondrous, a place you'd want to visit; even a night scene is luminous and clearly visible. ${blocks.PICTORIAL_BLOCK}

${blocks.SCENE_STRUCTURE('[the pixel-art style words] [the landmark and its place seen from the camera] [the light] [the wonder light] [the sky and the air] [tiny life if any] [the passing moment if any] [the palette]')}`;
};

builder.vibes = ['enchanted', 'ethereal', 'epic', 'whimsical'];
module.exports = builder;
