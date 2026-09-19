/**
 * PixelBot pixel-harbor — boats, water, and the places built beside them, as a
 * pixel-art PAINTING (PIXELBOT_SCENES_PLAN.md §3.1). ONE boat or waterside
 * structure is the hero at mid-distance; water fills a third to half of the
 * frame; a far shore or horizon gives depth. Money-shot: the reflection.
 * Pools: 9 bespoke (seeds/pixelbot_pixel_harbor_*.json). Function-form; scene
 * wiring derives from index.js SCENE_PATHS.
 */
const blocks = require('../shared-blocks');
const scene = require('../scenePaths');

const SLOTS = ['place', 'light', 'air', 'reflection', 'sky', 'life', 'moment', 'camera', 'palette'];
const P = scene.loadScenePools('pixel_harbor', SLOTS);

const builder = ({ sharedDNA, vibeDirective, picker }) => {
  const place = scene.pick(picker, P, 'place', 'harbor_place');
  const light = scene.pick(picker, P, 'light', 'harbor_light');
  const air = scene.pick(picker, P, 'air', 'harbor_air');
  const reflection = scene.pick(picker, P, 'reflection', 'harbor_reflection');
  const sky = scene.pick(picker, P, 'sky', 'harbor_sky');
  const camera = scene.pick(picker, P, 'camera', 'harbor_camera');
  const palette = scene.pick(picker, P, 'palette', 'harbor_palette');
  const life = scene.gated(picker, P, 'life', 'harbor_life', 0.6);
  const moment = scene.gated(picker, P, 'moment', 'harbor_moment', 0.35);

  return `${blocks.PIXEL_LOOK_OVERRIDE(sharedDNA)}You are writing a PIXEL-ART PAINTING of a small, old, hand-built waterside place for PixelBot: boats, water, and the places built beside them. Charming, playful, a little magical, with old-school game charm: storybook shapes, a glowing lantern or window, a big soft moon or candy sky bands are welcome. Sweet and cozy, never serious or documentary. There is no character as the subject.

${blocks.SCENE_REGISTER_BLOCK}
${blocks.ONE_HERO_BLOCK} Here the hero is the ONE boat or waterside structure named below, at mid-distance; the water fills a third to half of the frame; a far shore or the horizon gives depth. Hulls are plain painted wood, unmarked. The water holds small old-world boats only.

━━━ THE HERO AND ITS PLACE ━━━
${place}

━━━ CAMERA ━━━
${camera}

━━━ LIGHT ━━━
${light}

━━━ THE REFLECTION (the money shot) ━━━
${reflection}

━━━ SKY ━━━
${sky}

━━━ AIR ━━━
${air}
${life ? `\n━━━ SMALL LIFE (an accent, never the hero) ━━━\n${life}\n${blocks.TINY_LIFE_BLOCK}\n` : ''}${moment ? `\n━━━ A PASSING MOMENT ━━━\n${moment}\n` : ''}
━━━ PALETTE ━━━
${palette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

If any two of the LIGHT, the REFLECTION, and the SKY disagree physically (a moon path under a noon sun, a sunset band at midday, stars in daylight), keep the LIGHT and adjust the other two to fit it, and choose one sun or one moon, never both. If the AIR or the MOMENT names snow, frost, or a flurry and the place is tropical (palms, turquoise water, a thatched roof), keep the place and change the air to a warm haze instead. ${blocks.PICTORIAL_BLOCK}

${blocks.SCENE_STRUCTURE('[the pixel-art style words] [the hero and its place seen from the camera] [the light and the reflection on the water] [the sky and the air] [small life if any] [the passing moment if any] [the palette]')}`;
};

builder.vibes = ['whimsical', 'enchanted', 'nostalgic'];
module.exports = builder;
