/**
 * PixelBot pixel-cozy-room — an interior with a view, the room is the whole
 * world (PIXELBOT_SCENES_PLAN.md §3.3). ONE window is the light source and the
 * outside is glimpsed through it as part of the very same unbroken shot.
 * Money-shot: window_view. objects picked twice. Any person small, seated,
 * turned away. Pools: 8 bespoke (seeds/pixelbot_pixel_cozy_room_*.json).
 * Function-form; scene wiring derives from index.js SCENE_PATHS.
 */
const blocks = require('../shared-blocks');
const scene = require('../scenePaths');

const SLOTS = ['room', 'window_view', 'room_light', 'objects', 'life', 'moment', 'camera', 'palette'];
const P = scene.loadScenePools('pixel_cozy_room', SLOTS);

const builder = ({ sharedDNA, vibeDirective, picker }) => {
  const room = scene.pick(picker, P, 'room', 'cozy_room_room');
  const windowView = scene.pick(picker, P, 'window_view', 'cozy_room_window_view');
  const light = scene.pick(picker, P, 'room_light', 'cozy_room_light');
  const object1 = scene.pick(picker, P, 'objects', 'cozy_room_object_1');
  const object2 = scene.pick(picker, P, 'objects', 'cozy_room_object_2');
  const camera = scene.pick(picker, P, 'camera', 'cozy_room_camera');
  const palette = scene.pick(picker, P, 'palette', 'cozy_room_palette');
  const life = scene.gated(picker, P, 'life', 'cozy_room_life', 0.6);
  const moment = scene.gated(picker, P, 'moment', 'cozy_room_moment', 0.35);

  return `${blocks.PIXEL_LOOK_OVERRIDE(sharedDNA)}You are writing the pretty interior SCENE a classic game would show on its title or loading screen: a small cozy room drawn the way an old RPG draws its inn room or a point-and-click adventure draws its interior background, with chunky furniture, a glowing lamp, and a window whose sky is banded in dithered colour. The ROOM is the whole world of the picture, and its ONE window is where the light comes from. Charming, a little magical, storybook-cluttered, never a realistic interior photograph.

${blocks.SCENE_REGISTER_BLOCK}
${blocks.ONE_HERO_BLOCK} Here the hero is the ROOM itself, seen whole, with its one window glowing inside it.

━━━ THE ROOM (the hero) ━━━
${room}

━━━ CAMERA ━━━
${camera}

━━━ THROUGH THE WINDOW (the money shot) ━━━
${windowView}
The window and what lies beyond it are captured in the very same unbroken shot as the room, the way a real camera sees a room with a view: the glass sits inside the room's wall and the world outside shows through it, one continuous picture.

━━━ THE LIGHT ━━━
${light}

━━━ TWO THINGS IN THE ROOM ━━━
${object1}
${object2}
${life ? `\n━━━ A SMALL LIVING PRESENCE ━━━\n${life}\n${blocks.TINY_LIFE_BLOCK} Any person is small, seated, and turned away, only their back and shoulders showing.\n` : ''}${moment ? `\n━━━ A PASSING MOMENT ━━━\n${moment}\n` : ''}
━━━ PALETTE ━━━
${palette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

Books have blank spines, framed pictures are wordless, screens are dark. ${blocks.PICTORIAL_BLOCK}

${blocks.SCENE_STRUCTURE('[the pixel-art style words] [the room seen from the camera, its one window in the wall] [what shows through the window, in the same shot] [the light inside] [the two things in the room] [the living presence if any] [the passing moment if any] [the palette]')}`;
};

builder.vibes = ['nostalgic', 'whimsical', 'enchanted', 'coquette'];
module.exports = builder;
