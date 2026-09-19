/**
 * PixelBot pixel-campfire-night — ONE small warm light under a big dark sky
 * (PIXELBOT_SCENES_PLAN.md §3.9). The warm source is the hero; the sky fills
 * the top half; everything else is silhouette or dimly revealed, and the night
 * stays VISIBLY LIT (the DinoBot lit-nocturne law: describe what the light
 * reveals). Money-shot: sky_field. Pools: 8 bespoke
 * (seeds/pixelbot_pixel_campfire_night_*.json). Function-form; scene wiring
 * derives from index.js SCENE_PATHS.
 */
const blocks = require('../shared-blocks');
const scene = require('../scenePaths');

const SLOTS = ['place', 'fire_light', 'sky_field', 'air', 'life', 'moment', 'camera', 'palette'];
const P = scene.loadScenePools('pixel_campfire_night', SLOTS);

const builder = ({ sharedDNA, vibeDirective, picker }) => {
  const place = scene.pick(picker, P, 'place', 'campfire_place');
  const fireLight = scene.pick(picker, P, 'fire_light', 'campfire_fire_light');
  const sky = scene.pick(picker, P, 'sky_field', 'campfire_sky');
  const air = scene.pick(picker, P, 'air', 'campfire_air');
  const camera = scene.pick(picker, P, 'camera', 'campfire_camera');
  const palette = scene.pick(picker, P, 'palette', 'campfire_palette');
  const life = scene.gated(picker, P, 'life', 'campfire_life', 0.6);
  const moment = scene.gated(picker, P, 'moment', 'campfire_moment', 0.35);

  return `${blocks.PIXEL_LOOK_OVERRIDE(sharedDNA)}You are writing a PIXEL-ART PAINTING of one small warm light burning in the dark under a big night sky, for PixelBot: the picture that makes a person want to walk toward that light and sit down beside it. Charming and a little magical, never a grim or frightening night. The warm light and the sky above it ARE the picture.

${blocks.SCENE_REGISTER_BLOCK}
${blocks.ONE_HERO_BLOCK} Here the hero is the ONE small warm source of light (a campfire, a lantern, a bonfire, a lamp room) sitting in its place at mid-distance, and the night sky fills roughly the TOP HALF of the frame above it. Everything else reads as a soft silhouette or is dimly revealed.

━━━ THE LIT NOCTURNE (how this night is painted) ━━━
Every scene on this path happens at NIGHT, and the prompt says so plainly: the words that name it a night scene come right after the style words and before the place, so the time of day is never left to be guessed. The night stays VISIBLY LIT. The warm light REVEALS what is near it: the grain of the wood, the moss on the stones, the weave of the canvas, the wet shine on sand or water, the timbers of the lane. Further out the land keeps its shapes in soft dim blues, greys, and greens that a viewer can still read. The picture is a lit nocturne, full of colour and readable detail everywhere, rather than a dark silhouette on black.

━━━ THE PLACE AND ITS WARM SOURCE (the hero) ━━━
${place}

━━━ CAMERA ━━━
${camera}

━━━ WHAT THE WARM LIGHT DOES (the light) ━━━
${fireLight}

━━━ THE SKY (the money shot, filling the top half) ━━━
${sky}

━━━ AIR ━━━
${air}
${life ? `\n━━━ TINY LIFE (never the hero) ━━━\n${life}\n${blocks.TINY_LIFE_BLOCK} Any person here is small, seen from behind, and turned toward the warm light; at most two of them, with a clear gap between them.\n` : ''}${moment ? `\n━━━ A PASSING MOMENT ━━━\n${moment}\n` : ''}
━━━ PALETTE ━━━
${palette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

The only lights in the whole frame are the warm source itself, its glow on what it touches, and the sky (stars, the moon, aurora, a meteor); every other surface takes its colour from the cool night. The sky carries at most ONE special feature in total, counting anything the SKY and the PASSING MOMENT each name: one big moon, or aurora, or a meteor, or a bright star field, and at most one moon in the frame. Light always has a spreading shape: a glow, a warm pool, a patch, a soft fan, a halo, a scatter of flecks across water. Sparks drift slowly upward, lanterns rise slowly, a meteor is one clean streak. ${blocks.PICTORIAL_BLOCK} Paper lanterns, canvas, and hulls are plain, or carry one simple painted shape.

${blocks.SCENE_STRUCTURE('[the pixel-art style words] [a few words naming this a night scene under a dark sky] [the place and its warm source seen from the camera] [what the warm light does and what it reveals] [the sky] [the air] [tiny life if any] [the passing moment if any] [the palette]')}`;
};

builder.vibes = ['nostalgic', 'enchanted', 'ethereal', 'nightshade'];
module.exports = builder;
