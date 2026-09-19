/**
 * PixelBot pixel-cool-rides — ONE cool old machine at rest or cruising through
 * a beautiful place, as the splash-screen pixel scene a classic game paints on
 * its title screen (PIXELBOT_SCENES_PLAN.md §3.5). The ride is the hero at
 * mid-distance in profile or three-quarter; the route (road, track, river,
 * flight line) recedes as the lead line and is the money-shot. Painted, never
 * raced (retro-racing owns the chase camera and the race). Pools: 9 bespoke
 * (seeds/pixelbot_pixel_cool_rides_*.json). Function-form; scene wiring derives
 * from index.js SCENE_PATHS.
 */
const blocks = require('../shared-blocks');
const scene = require('../scenePaths');

const SLOTS = ['ride', 'route_line', 'sky', 'light', 'air', 'life', 'moment', 'camera', 'palette'];
const P = scene.loadScenePools('pixel_cool_rides', SLOTS);

const builder = ({ sharedDNA, vibeDirective, picker }) => {
  const ride = scene.pick(picker, P, 'ride', 'rides_ride');
  const route = scene.pick(picker, P, 'route_line', 'rides_route');
  const sky = scene.pick(picker, P, 'sky', 'rides_sky');
  const light = scene.pick(picker, P, 'light', 'rides_light');
  const air = scene.pick(picker, P, 'air', 'rides_air');
  const camera = scene.pick(picker, P, 'camera', 'rides_camera');
  const palette = scene.pick(picker, P, 'palette', 'rides_palette');
  const life = scene.gated(picker, P, 'life', 'rides_life', 0.6);
  const moment = scene.gated(picker, P, 'moment', 'rides_moment', 0.35);

  return `${blocks.PIXEL_LOOK_OVERRIDE(sharedDNA)}You are writing a PIXEL-ART PAINTING of one cool old machine at rest or cruising gently through a beautiful place, for PixelBot: a boxy old motorcycle on a coast road, a camper van at an overlook, a steam train on a trestle, a biplane over patchwork fields. Painted, never raced. The ride is a charming storybook-rounded machine, the place is its co-star, and the road, track, river, or flight line recedes as the lead line that carries the eye. Charming and a little magical, the way a classic game paints its title screen, never a realistic vehicle photo.

${blocks.SCENE_REGISTER_BLOCK}
${blocks.ONE_HERO_BLOCK} Here the hero is the RIDE named below, SMALL at mid-distance, at most a third of the frame's height, in profile or three-quarter view, with the landscape open around it; it is cruising gently or parked, and the lead line of the route runs on past it into the distance. Its painted panels are plain single colours with a simple stripe; its boards and plates are blank painted panels.

━━━ CAMERA ━━━
${camera}

━━━ THE RIDE (the hero) ━━━
${ride}

━━━ THE ROUTE AND ITS PLACE (the lead line, the money shot) ━━━
${route}
The ride uses this line in its own way: wheels on the road, a train on rails laid along the same line, a tram on its track, a seaplane resting on the water or just above it, a plane or a balloon in the air above the line.

━━━ LIGHT ━━━
${light}

━━━ SKY ━━━
${sky}

━━━ AIR ━━━
${air}
${life ? `\n━━━ SMALL LIFE (an accent, never the hero) ━━━\n${life}\n${blocks.TINY_LIFE_BLOCK}\n` : ''}${moment ? `\n━━━ A PASSING MOMENT ━━━\n${moment}\nIf the moment names a part the ride lacks (a funnel, a float, a balloon), give it the ride's own equivalent or let it go.\n` : ''}
━━━ PALETTE ━━━
${palette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

If the LIGHT, the SKY, and the MOMENT disagree physically (a moon under a noon sun, stars at midday), keep the LIGHT and adjust the others to fit it; one sun or one moon, never both. The sky carries at most ONE special feature. Snow and frost appear only where the place is cold; over a warm place the same air is a soft haze. The ride's lamp is the one warm note. ${blocks.PICTORIAL_BLOCK}

${blocks.SCENE_STRUCTURE('[the pixel-art style words] [the ride small at mid-distance on its route, seen from the camera] [the place and the lead line] [the light] [the sky and the air] [small life if any] [the passing moment if any] [the palette]')}`;
};

builder.vibes = ['nostalgic', 'cinematic', 'epic', 'ethereal', 'whimsical'];
module.exports = builder;
