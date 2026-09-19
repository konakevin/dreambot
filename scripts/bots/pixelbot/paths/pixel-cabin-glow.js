/**
 * PixelBot pixel-cabin-glow — ONE dwelling lit from inside, in its landscape,
 * at dusk or night (PIXELBOT_SCENES_PLAN.md §3.2). The dwelling is the hero at
 * mid-distance; its lit windows are the brightest thing in the frame; the
 * landscape wraps it. Money-shot: window_glow. Always evening or night. Pools:
 * 9 bespoke (seeds/pixelbot_pixel_cabin_glow_*.json). Function-form; scene
 * wiring derives from index.js SCENE_PATHS.
 */
const blocks = require('../shared-blocks');
const scene = require('../scenePaths');

const SLOTS = ['dwelling_place', 'dusk_night_light', 'air', 'window_glow', 'sky', 'life', 'moment', 'camera', 'palette'];
const P = scene.loadScenePools('pixel_cabin_glow', SLOTS);

const builder = ({ sharedDNA, vibeDirective, picker }) => {
  const dwelling = scene.pick(picker, P, 'dwelling_place', 'cabin_dwelling');
  const light = scene.pick(picker, P, 'dusk_night_light', 'cabin_light');
  const air = scene.pick(picker, P, 'air', 'cabin_air');
  const glow = scene.pick(picker, P, 'window_glow', 'cabin_glow');
  const sky = scene.pick(picker, P, 'sky', 'cabin_sky');
  const camera = scene.pick(picker, P, 'camera', 'cabin_camera');
  const palette = scene.pick(picker, P, 'palette', 'cabin_palette');
  const life = scene.gated(picker, P, 'life', 'cabin_life', 0.6);
  const moment = scene.gated(picker, P, 'moment', 'cabin_moment', 0.35);

  return `${blocks.PIXEL_LOOK_OVERRIDE(sharedDNA)}You are writing a PIXEL-ART PAINTING of one dwelling lit from inside, standing in its landscape at dusk or night, for PixelBot: the picture that makes a person want to be inside there tonight. Charming and a little magical, never a realistic architectural study. The dwelling IS the picture.

${blocks.SCENE_REGISTER_BLOCK}
${blocks.ONE_HERO_BLOCK} Here the hero is the DWELLING at mid-distance, old and hand-built; its lit windows are the brightest thing in the whole frame, and the landscape wraps around it. It is always evening or night. The path to the door is empty and untrodden except for the light lying across it.

━━━ THE DWELLING AND ITS PLACE (the hero) ━━━
${dwelling}

━━━ CAMERA ━━━
${camera}

━━━ THE NIGHT LIGHT (the ambient light over everything) ━━━
${light}

━━━ THE WINDOW GLOW (the money shot) ━━━
${glow}

━━━ SKY ━━━
${sky}

━━━ AIR ━━━
${air}
${life ? `\n━━━ TINY LIFE (never the hero) ━━━\n${life}\n${blocks.TINY_LIFE_BLOCK}\n` : ''}${moment ? `\n━━━ A PASSING MOMENT ━━━\n${moment}\n` : ''}
━━━ PALETTE ━━━
${palette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

The sky and the land take their colour from the NIGHT LIGHT (indigo, silver, green, violet, dusk rose, grey-blue); the window glow is the ONE warm note set against that cool night, so the whole picture is never uniformly golden. If the NIGHT LIGHT and the SKY disagree physically (moonlight under a heavy cloud ceiling, aurora on an overcast night), keep the NIGHT LIGHT and adjust the sky to fit it. The sky carries at most ONE special feature (an oversized moon, or aurora, or a shooting star, or a field of stars), never a stack of them; at most one moon. ${blocks.PICTORIAL_BLOCK}

${blocks.SCENE_STRUCTURE('[the pixel-art style words] [the dwelling and its place seen from the camera] [the night light] [the window glow] [the sky and the air] [tiny life if any] [the passing moment if any] [the palette]')}`;
};

builder.vibes = ['whimsical', 'enchanted', 'nostalgic'];
module.exports = builder;
