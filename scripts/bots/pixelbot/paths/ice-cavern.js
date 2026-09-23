/**
 * PixelBot ice-cavern — ONE vast ice cavern INTERIOR, the glittering blue
 * chamber a classic game paints for its title screen. PixelBot's second real
 * interior after volcano-forge, and its cold counterpart, so the design is
 * volcano-forge's shape with the three fixes that path paid for already applied:
 *
 *  (a) THE TONE IS NAMED FIRST, BEFORE THE PLACE. This path's whole risk is a
 *      pretty blue GEOLOGY PHOTOGRAPH — Kevin flagged it himself ("it needs a
 *      magical feature so it does not read as geology"), and a realistic ice
 *      cave is both a stock-photo cliché and EarthBot's lane. Wonder leads.
 *  (b) THE ENCLOSING SURFACES ARE NAMED in the hero block AND in the structure
 *      line. The Ultima-tile and HD-voxel looks carry an isometric-diorama
 *      prior that replaces an enclosing interior with a void or open sky, and
 *      camera words do not fix it — naming the ice that stands behind the hero
 *      and closes the frame down both sides and overhead does.
 *  (c) THE CONDITION IS STATED IN THE EMITTED PROMPT ("a glowing ice cavern
 *      interior, lit through its own ice"). An axis that merely implies the
 *      condition is not enough; this is what kept campfire-night off
 *      flux-1.1-pro-ultra's golden-hour prior, and ultra is pinned OUT here for
 *      the same reason (see index.js modelByPath).
 *
 * Hero: the cavern's own DEFINING MASS at 40 to 60 percent of the frame (the
 * hero seed leads with it — the first-named-noun law applies inside a seed).
 * Second read: the ice architecture. Money-shot: frozen_feature, the magical
 * thing held IN or BEHIND the ice that the light comes through, which is the
 * single axis that turns a cold empty cave into a wonder. `vault` stands in for
 * `sky` (interior). Pools: 10 bespoke (seeds/pixelbot_ice_cavern_*.json);
 * `camera` is hand-authored. Function-form; scene wiring derives from
 * index.js SCENE_PATHS.
 */
const blocks = require('../shared-blocks');
const scene = require('../scenePaths');

const SLOTS = ['cavern', 'ice_form', 'frozen_feature', 'light', 'vault', 'air', 'life', 'moment', 'camera', 'palette'];
const P = scene.loadScenePools('ice_cavern', SLOTS);

const builder = ({ sharedDNA, vibeDirective, picker }) => {
  const cavern = scene.pick(picker, P, 'cavern', 'ice_cavern_cavern');
  const iceForm = scene.pick(picker, P, 'ice_form', 'ice_cavern_ice_form');
  const frozenFeature = scene.pick(picker, P, 'frozen_feature', 'ice_cavern_frozen_feature');
  const light = scene.pick(picker, P, 'light', 'ice_cavern_light');
  const vault = scene.pick(picker, P, 'vault', 'ice_cavern_vault');
  const air = scene.pick(picker, P, 'air', 'ice_cavern_air');
  const camera = scene.pick(picker, P, 'camera', 'ice_cavern_camera');
  const palette = scene.pick(picker, P, 'palette', 'ice_cavern_palette');
  const life = scene.gated(picker, P, 'life', 'ice_cavern_life', 0.6);
  const moment = scene.gated(picker, P, 'moment', 'ice_cavern_moment', 0.35);

  return `${blocks.PIXEL_LOOK_OVERRIDE(sharedDNA)}You are writing a PIXEL-ART PAINTING of the inside of a glowing ice cavern, lit through its own ice, for PixelBot: the glittering blue chamber a classic game paints for its title screen, the wonder a player is delighted to walk into. Whimsical, magical, beautiful: a place where something impossible is held in the ice and the light comes through it. Never a geology photograph, never a documentary ice cave, never cold and empty. The ICE CHAMBER IS the picture.

${blocks.SCENE_REGISTER_BLOCK}
${blocks.ONE_HERO_BLOCK} Here the hero is THE BIGGEST STANDING MASS OF ICE IN THE CHAMBER: the one thing in it with real height and weight, drawn from what the chamber's own entry names (its frozen waterfall, its great pillar, its rank of icicles, its arch, its stepped terrace front, its glowing wall). It STANDS UP in the middle distance and fills 40 to 60 percent of the frame, so the eye lands on a solid object of ice and not on empty space; the rest of the chamber's ice is the second read. That mass is banded ice all the way through, pale blue and white layers running on through it, its edges rounded, every edge a hard pixel step. This is an INTERIOR scene, lit from inside the ice itself, and the chamber ENCLOSES the picture: the cavern's own ice stands behind that mass and closes the frame down both sides, and its vault of ice closes the frame overhead. The hero is standing in a room of ice, and the room's surfaces are what it stands in.

━━━ THE ICE CHAMBER (the hero) ━━━
${cavern}

━━━ CAMERA ━━━
${camera}

━━━ THE ICE ARCHITECTURE (the second read) ━━━
${iceForm}

━━━ THE LIGHT OVER EVERYTHING (the ambient light) ━━━
${light}

━━━ THE FROZEN FEATURE (the money shot) ━━━
${frozenFeature}

━━━ THE VAULT OVERHEAD ━━━
${vault}

━━━ AIR ━━━
${air}
${life ? `\n━━━ TINY LIFE (never the hero) ━━━\n${life}\n${blocks.TINY_LIFE_BLOCK}\n` : ''}${moment ? `\n━━━ A PASSING MOMENT ━━━\n${moment}\n` : ''}
━━━ PALETTE ━━━
${palette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

The FROZEN FEATURE is the brightest thing in the picture and the light comes through it; everything else that glows, including the charm detail and anything lit overhead, glows softly and low beneath it. The frozen feature happens in the ambient light described above: if the two disagree, keep the ambient light and let the frozen feature glow inside it. A creature named in the frozen feature is HELD IN THE ICE and asleep, and it is then the only creature in the picture: any tiny life reads as one small figure turned away, a bird, or simply is not there. When the chamber's own entry already names what is over it (a thin glowing ceiling, a dome, a low roof), keep that and let the vault's feature show above it, beyond it, or through it. Name the cavern's own surfaces that close the picture in: the wall of layered ice that stands behind the hero mass, the ice that runs down both sides of the frame, the vault or roof of ice overhead. Somewhere in the picture ONE warm or saturated colour stands against all that cold, exactly as the light and the palette already name it, so the frame is never one flat wash of blue. Any sky, aurora, moon, or distant land appears ONLY through one opening or through the thin ice of the vault, with the cavern's own ice reading all the way around it, in the same unbroken shot. There is at most ONE special feature overhead in total, counting whatever the frozen feature and the passing moment already add, and one sun or one moon in the whole picture, never both. Ice, water, and glass are built from chunky stepped pixel sides that catch the light in flat bands. Ice that carries imagery shows a worn pictorial relief of one simple shape (a star, a leaf, a fish, a spread-winged bird, a round moon face, a key) that glows softly from within the ice. ${blocks.PICTORIAL_BLOCK} Every door, hull, crate, cloth, and flat panel is plain and unmarked. Keep the whole picture bright, wondrous, and beautiful: a glittering ice chamber with real magic held in it, inviting and alive.

THE WHOLE ROOM IS BUILT OF ICE, and this is the one thing to get right, so say what its surfaces are made of when you name them: the walls, the floor and the vault are all pale blue and white ice in flat stepped bands, old layers sagging and bending as they run through the wall, white cracks reaching across the floor, every edge a hard pixel step, the hollows and the deep places turning teal and indigo, and the whole room glowing faintly because the light travels inside the ice itself. Every arch, stair, bridge, ledge, shelf and rib in here is a shape the ice itself has made: banded ice all the way through, its layers running on through it, its edges rounded and wet. And the frozen feature is buried DEEP INSIDE that same continuous wall, seen through a great thickness of it, with the wall's own ice reading above it, below it and on both sides of it, so it is part of the wall the room is made of.

The chamber is seen across a corner so one wall recedes into the picture and the weight of the composition sits off-centre, never square-on and never mirrored. ${blocks.SCENE_STRUCTURE('[the pixel-art style words] [the glowing ice cavern interior, its walls and floor and vault all built of pale blue banded ice, enclosing the frame on all sides, and standing up in the middle distance the biggest MASS of ice in the chamber filling much of the frame, seen from the camera] [the ice architecture around it] [the light over everything] [the frozen feature buried deep inside the continuous ice of the wall] [the vault of ice closing the frame overhead, and the air] [tiny life if any] [the passing moment if any] [the palette]')}`;
};

builder.vibes = ['enchanted', 'ethereal', 'whimsical', 'epic'];
module.exports = builder;
