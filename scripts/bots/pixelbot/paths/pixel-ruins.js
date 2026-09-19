/**
 * PixelBot pixel-ruins — ONE ancient ruin reclaimed by nature, calm and
 * beautiful (PIXELBOT_SCENES_PLAN.md §3.12). The ruin is the hero at 40 to 60
 * percent of the frame; the green climbing it is the second read; serene and
 * romantic, beautiful decay and never rot. Money-shot: light_shaft (the one
 * light event inside or through the stone). Pools: 10 bespoke
 * (seeds/pixelbot_pixel_ruins_*.json). Function-form; scene wiring derives
 * from index.js SCENE_PATHS.
 */
const blocks = require('../shared-blocks');
const scene = require('../scenePaths');

const SLOTS = ['ruin', 'reclamation', 'light_shaft', 'light', 'sky', 'air', 'life', 'moment', 'camera', 'palette'];
const P = scene.loadScenePools('pixel_ruins', SLOTS);

const builder = ({ sharedDNA, vibeDirective, picker }) => {
  const ruin = scene.pick(picker, P, 'ruin', 'ruins_ruin');
  const reclamation = scene.pick(picker, P, 'reclamation', 'ruins_reclamation');
  const lightShaft = scene.pick(picker, P, 'light_shaft', 'ruins_light_shaft');
  const light = scene.pick(picker, P, 'light', 'ruins_light');
  const sky = scene.pick(picker, P, 'sky', 'ruins_sky');
  const air = scene.pick(picker, P, 'air', 'ruins_air');
  const camera = scene.pick(picker, P, 'camera', 'ruins_camera');
  const palette = scene.pick(picker, P, 'palette', 'ruins_palette');
  const life = scene.gated(picker, P, 'life', 'ruins_life', 0.6);
  const moment = scene.gated(picker, P, 'moment', 'ruins_moment', 0.35);

  return `${blocks.PIXEL_LOOK_OVERRIDE(sharedDNA)}You are writing a PIXEL-ART PAINTING of one ancient ruin standing quiet in a green world, for PixelBot: the lost place a classic game paints for its title screen, the one a person wants to walk into. Serene and romantic, gently magical, a place at peace with the nature that has grown over it. The RUIN IS the picture.

${blocks.SCENE_REGISTER_BLOCK}
${blocks.ONE_HERO_BLOCK} Here the hero is the RUIN, filling 40 to 60 percent of the frame; what nature is doing to it is the second read; the land, water, and sky layer away behind it. The stone is worn, warm, and lovely, dressed in living green, standing in soft light and open air.

━━━ THE RUIN AND ITS PLACE (the hero) ━━━
${ruin}

━━━ CAMERA ━━━
${camera}

━━━ WHAT NATURE IS DOING TO IT (the second read) ━━━
${reclamation}

━━━ THE LIGHT OVER EVERYTHING (the ambient light) ━━━
${light}

━━━ THE LIGHT EVENT (the money shot) ━━━
${lightShaft}

━━━ SKY ━━━
${sky}

━━━ AIR ━━━
${air}
${life ? `\n━━━ TINY LIFE (never the hero) ━━━\n${life}\n${blocks.TINY_LIFE_BLOCK}\n` : ''}${moment ? `\n━━━ A PASSING MOMENT ━━━\n${moment}\n` : ''}
━━━ PALETTE ━━━
${palette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

The LIGHT EVENT belongs to the same time of day as the ambient light: if the two disagree, keep the ambient light and let the light event happen in that light. The sky carries at most ONE special feature, counting whatever the passing moment and the light event already add (one big moon, or one aurora, or one galaxy arc, or one cloud break), and there is one sun or one moon in the whole picture, never both. When the camera sits inside the ruin, the sky is visible only through the opening the camera looks through. Stone that carries imagery shows worn pictorial reliefs of a simple shape (a sun, a coiled serpent, a leaping fish, a flower, a bird, a round moon face). ${blocks.PICTORIAL_BLOCK} Keep the whole picture serene, romantic, and beautiful: worn stone dressed in healthy green, soft warm light, a calm place that has been at rest for a long time.

The ruin is turned three-quarters to the camera so one flank recedes into the picture and the weight of the composition sits off-centre, never square-on and never mirrored. ${blocks.SCENE_STRUCTURE('[the pixel-art style words] [the ruin and its place seen from the camera] [what nature is doing to it] [the light over everything] [the light event] [the sky and the air] [tiny life if any] [the passing moment if any] [the palette]')}`;
};

builder.vibes = ['enchanted', 'ethereal', 'nostalgic', 'epic'];
module.exports = builder;
