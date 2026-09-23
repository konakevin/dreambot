/**
 * PixelBot volcano-forge — ONE volcanic forge INTERIOR, the mountain smithy a
 * classic game paints for its title screen. PixelBot's first real interior at
 * scale besides pixel-cozy-room, and its only industrial-adjacent place, so the
 * whole design fights ONE failure mode: grim industrial realism (a foundry
 * photograph). The counter-levers are (a) the tone named first, before the
 * place, (b) one MAGICAL CHARM DETAIL baked into every hero entry, and (c) the
 * condition ("a firelit interior") stated in the emitted prompt, which is what
 * kept campfire-night off flux-1.1-pro-ultra's golden-hour prior.
 *
 * Hero: the furnace-and-anvil HEART at 40 to 60 percent of the frame (a
 * pure-architecture framing renders an empty hallway — the franchise-massacre
 * lesson). Second read: the working gear. Money-shot: fire_event, the ONE light
 * event the fire is doing right now. `vault` stands in for `sky` (interior).
 * Pools: 10 bespoke (seeds/pixelbot_volcano_forge_*.json); `camera` is
 * hand-authored. Function-form; scene wiring derives from index.js SCENE_PATHS.
 */
const blocks = require('../shared-blocks');
const scene = require('../scenePaths');

const SLOTS = ['forge', 'machinery', 'fire_event', 'light', 'vault', 'air', 'life', 'moment', 'camera', 'palette'];
const P = scene.loadScenePools('volcano_forge', SLOTS);

const builder = ({ sharedDNA, vibeDirective, picker }) => {
  const forge = scene.pick(picker, P, 'forge', 'forge_forge');
  const machinery = scene.pick(picker, P, 'machinery', 'forge_machinery');
  const fireEvent = scene.pick(picker, P, 'fire_event', 'forge_fire_event');
  const light = scene.pick(picker, P, 'light', 'forge_light');
  const vault = scene.pick(picker, P, 'vault', 'forge_vault');
  const air = scene.pick(picker, P, 'air', 'forge_air');
  const camera = scene.pick(picker, P, 'camera', 'forge_camera');
  const palette = scene.pick(picker, P, 'palette', 'forge_palette');
  const life = scene.gated(picker, P, 'life', 'forge_life', 0.6);
  const moment = scene.gated(picker, P, 'moment', 'forge_moment', 0.35);

  return `${blocks.PIXEL_LOOK_OVERRIDE(sharedDNA)}You are writing a PIXEL-ART PAINTING of the inside of a volcanic forge, lit by its own fire, for PixelBot: the mountain smithy a classic game paints for its title screen, the warm bright workshop a player is glad to arrive at. Proud, wondrous, a little magical: a place of craft where something lovely is being made, never a factory and never a photograph of a foundry. The FORGE IS the picture.

${blocks.SCENE_REGISTER_BLOCK}
${blocks.ONE_HERO_BLOCK} Here the hero is the FORGE'S HEART, the furnace-and-anvil mass, filling 40 to 60 percent of the frame; the working gear around it is the second read. This is an INTERIOR scene, lit from inside by its own fire, and the hall itself ENCLOSES the picture: the hall's own stone or timber stands behind the forge and closes the frame down both sides, and its vault closes the frame overhead. The forge is standing in a room, and the room's surfaces are what it stands in.

━━━ THE FORGE AND ITS HALL (the hero) ━━━
${forge}

━━━ CAMERA ━━━
${camera}

━━━ THE WORKING GEAR (the second read) ━━━
${machinery}

━━━ THE LIGHT OVER EVERYTHING (the ambient light) ━━━
${light}

━━━ THE FIRE EVENT (the money shot) ━━━
${fireEvent}

━━━ THE VAULT OVERHEAD ━━━
${vault}

━━━ AIR ━━━
${air}
${life ? `\n━━━ TINY LIFE (never the hero) ━━━\n${life}\n${blocks.TINY_LIFE_BLOCK}\n` : ''}${moment ? `\n━━━ A PASSING MOMENT ━━━\n${moment}\n` : ''}
━━━ PALETTE ━━━
${palette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

The FIRE EVENT is the brightest thing in the picture; everything else that glows, including the charm detail and anything lit overhead, glows softly and low beneath it. The fire event happens in the ambient light described above: if the two disagree, keep the ambient light and let the fire event happen in it. When the forge's own entry already names what is over it (a canopy of timber and hide, a cave ceiling, arches open to the air), keep that and let the vault's feature show above it, beyond it, or through its opening. Name the hall's own surfaces that close the picture in: the wall of worked stone or the timber-and-stone end that stands behind the forge, the walls or arcades that run down both sides of the frame, the vault or roof overhead. Any sky, mountain, or distant land appears ONLY inside the shape of one opening, with the hall's own wall reading all the way around that opening, in the same unbroken shot. There is at most ONE special feature overhead in total, counting whatever the fire event and the passing moment already add, and one sun or one moon in the whole picture, never both. Stone and iron that carry imagery show worn pictorial reliefs of a simple shape (a flame, a hammer, a sun, a coiled serpent, a spread-winged bird, an anvil, a round moon face). ${blocks.PICTORIAL_BLOCK} Every banner, shield, crate, sack, and flat iron face is plain and unmarked. Keep the whole picture warm, wondrous, and beautiful: a proud working forge with a little magic in it, bright and inviting.

The hall is seen across a corner so one wall recedes into the picture and the weight of the composition sits off-centre, never square-on and never mirrored. ${blocks.SCENE_STRUCTURE('[the pixel-art style words] [the firelit forge hall enclosing the frame on all sides, its furnace-and-anvil heart filling much of it, seen from the camera] [the working gear around it] [the light over everything] [the fire event] [the vault closing the frame overhead, and the air] [tiny life if any] [the passing moment if any] [the palette]')}`;
};

builder.vibes = ['enchanted', 'epic', 'cinematic', 'nostalgic'];
module.exports = builder;
