/**
 * PixelBot floating-market-canal — a canal market town where THE MARKET IS
 * BOATS, painted as the scene a classic game shows on its title screen. The gap
 * it fills: every one of PixelBot's thirteen SCENE paths is a vista, a fantasy
 * landmark, a ruin, a cavern, a forge, a shoreline, a sky, a calm one-boat
 * harbour, an empty wet night street, one lit dwelling or one cosy room. The
 * scene lane has no DENSE INHABITED COMMERCIAL place at all — trade and life as
 * the subject is a whole JRPG splash-screen register it does not own.
 * (`cozy-rpg-town` is inhabited, but it is an IN-GAME gameplay-screenshot path
 * on the old `pixels` medium, and it is a LAND town.)
 *
 * TWO DRIFTS, AND WHERE EACH LEVER LIVES:
 *
 *  (1) THE RECEDING CANAL CORRIDOR (playbook lesson 17). A path staged on a
 *      linear feature renders as a channel vanishing up the middle with the
 *      subject tiled to the vanishing point, and rewriting the camera pool is
 *      NOT enough (FaeBot acorn-boat-regatta: 6 of 6 corridors survived exactly
 *      that fix). What works is CONCRETE BUT CROPPED applied to the SETTING. So
 *      THE CROSSWISE LAW — the canal crosses the picture left edge to right
 *      edge, its open water fills the near half, the far bank is a BAND along
 *      the top, both ends run out of frame — is stated in THREE places that
 *      reach Flux: this template's first rule, every `canal_town` seed entry,
 *      and OUTPUT-ORDER ITEM 2. A receding corridor cannot exist in that frame.
 *
 *  (2) A MARKET IS A TEXT MAGNET. Per lesson 12, a surface whose SHAPE is
 *      itself a text prior cannot be safely described, so the noun is DELETED
 *      from every layer rather than described as blank. This path therefore does
 *      NOT use the shared `PICTORIAL_BLOCK` — that block names sign, poster and
 *      banner, and on a market path naming them is the summons (the SteamBot
 *      brass-glasshouse corollary: when a text residual survives a clean path,
 *      it came from the shared constants). The positive replacement is the GOODS
 *      LAW: a stall says what it sells with its CARGO, and the cargo shapes the
 *      boat's whole silhouette. Awnings are striped or plain CLOTH; a boat's
 *      identity is its CARGO and nothing else — R0 proved that a painted symbol on a hull
 *      is itself a SIGNBOARD GENERATOR here, because Flux has to invent a flat panel to
 *      paint it on, and it invented a hanging board with two pseudo-numerals on it. The
 *      clause was deleted from the template, the output order and all 8 seeds that had it;
 *      the four renders WITHOUT it were clean. Per lesson 13 the law lives
 *      in the SEED ENTRIES **and** inside the required OUTPUT ORDER, because the
 *      order gets a clause into the prompt and the seed is what makes it stick.
 *
 * Hero: the town's own DEFINING BUILT MASS standing on the far bank, with the
 * boat-stalls crowding the water in front of it. Money-shot: `market_boats`,
 * three or four stalls each with a different silhouette and a different cargo —
 * without that axis the picture is a pretty canal with houses on it.
 * `market_moment` runs on EVERY render (the bar: adventurous beats static).
 * Pools: 9 bespoke (seeds/pixelbot_floating_market_canal_*.json); `camera` is
 * hand-authored. Function-form; scene wiring derives from index.js SCENE_PATHS.
 */
const blocks = require('../shared-blocks');
const scene = require('../scenePaths');

const SLOTS = ['canal_town', 'market_boats', 'market_moment', 'canal_life', 'town_light', 'upper_town', 'air', 'camera', 'palette'];
const P = scene.loadScenePools('floating_market_canal', SLOTS);

const builder = ({ sharedDNA, vibeDirective, picker }) => {
  const town = scene.pick(picker, P, 'canal_town', 'fmc_canal_town');
  const boats = scene.pick(picker, P, 'market_boats', 'fmc_market_boats');
  const moment = scene.pick(picker, P, 'market_moment', 'fmc_market_moment');
  const light = scene.pick(picker, P, 'town_light', 'fmc_town_light');
  const upper = scene.pick(picker, P, 'upper_town', 'fmc_upper_town');
  const air = scene.pick(picker, P, 'air', 'fmc_air');
  const camera = scene.pick(picker, P, 'camera', 'fmc_camera');
  const palette = scene.pick(picker, P, 'palette', 'fmc_palette');
  const life = scene.gated(picker, P, 'canal_life', 'fmc_canal_life', 0.65);

  return `${blocks.PIXEL_LOOK_OVERRIDE(sharedDNA)}You are writing a PIXEL-ART PAINTING of a canal market town where THE MARKET IS BOATS, for PixelBot: the busy water city a classic game paints for its title screen, the place a player is delighted to arrive in. Playful, adventurous, vivid, beautiful, clever: lantern light and steam and painted hulls and impossible piles of goods, all at once. Never a travel photograph, never a documentary, never grim. The MARKET IS the picture, and it is full of life.

${blocks.SCENE_REGISTER_BLOCK}
${blocks.ONE_HERO_BLOCK} Here the hero is the CANAL MARKET ITSELF: the town's defining built mass standing on the far bank, with the boat-stalls crowding the open water in front of it as the second read.

THE FRAME, AND THIS IS THE FIRST THING TO GET RIGHT: THE CANAL CROSSES THE PICTURE FROM THE LEFT EDGE TO THE RIGHT EDGE. Its open, flat water fills the lower half to two thirds of the frame, wide and near. The far bank is a BAND across the upper part of the picture, its buildings standing shoulder to shoulder ACROSS the frame. Both ends of the canal run out of frame, one past the left edge and one past the right edge, so what a viewer sees is wide open water with a band of town above it. The boat-stalls are spread ACROSS that water at different distances and different angles, some overlapping, one turned broadside, never in a line one behind another.

━━━ THE CANAL MARKET TOWN (the hero) ━━━
${town}

━━━ CAMERA ━━━
${camera}

━━━ THE BOAT-STALLS (the money shot) ━━━
${boats}

━━━ WHAT IS HAPPENING RIGHT NOW ━━━
${moment}

━━━ THE LIGHT OVER EVERYTHING ━━━
${light}

━━━ THE TOWN ABOVE THE WATER (bridges, lanterns, balconies) ━━━
${upper}

━━━ AIR ━━━
${air}
${life ? `\n━━━ SMALL LIFE (an accent, never the hero) ━━━\n${life}\n${blocks.TINY_LIFE_BLOCK}\n` : ''}
━━━ PALETTE ━━━
${palette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

THE CANAL WATER IS HALF THE PICTURE AND IT IS BUILT FROM PIXELS: flat bands of colour a pixel artist placed by hand, every reflection broken into hard pixel steps, every ripple a short flat dash, every wake a fan of flat pixel bands.

A STALL SAYS WHAT IT SELLS WITH ITS GOODS, heaped in plain sight so the cargo shapes the boat's whole silhouette. Awnings and canopies are plain or striped or patterned CLOTH stretched on bamboo. A boat's hull sides are plain painted timber, and its crates, sacks, shutters and doors are plain, or painted one flat colour. Stacked cargo is MANY SMALL PIECES, two dozen or more and each one small, piled about as high as the standing figure beside it or the boat's own mast.

The people are small pixel-sprite figures at boat scale, a handful of them out at mid-distance or further, each busy with one thing, seen from behind or side-on, their faces too small to read. If the town's own entry already names its bridges, keep those and let the layer above add what hangs between them. Any bridge enters from ONE SIDE EDGE of the picture and runs back out of it, cropped, so only its near flank and the top of its arch are in frame and the water still crosses from edge to edge underneath. If the light disagrees with the air or the palette, keep the LIGHT and let the air and the colours happen inside it, with one sun or one moon in the whole picture and never both. Somewhere in the picture one warm or saturated colour burns against the cool water, exactly as the light and the palette already name it, so the frame is never one flat wash. The strip of sky above the rooflines is a banded dithered gradient of two or three colours in the light's own palette, never a flat empty field, and any moon in it is a simple flat pixel disc drawn in the same few colours as the rest of the picture. Keep it busy, bright, warm and full of small things to find.

${blocks.SCENE_STRUCTURE('[the pixel-art style words] [the canal crossing the picture left to right, its open flat water filling the near half and running out of frame on both sides, the far bank a band of crowded buildings along the top whose roofline steps and juts unevenly, the town\'s defining mass standing in it, seen from the camera] [what the wall faces between the stalls carry] [any bridge cropped by one side edge of the picture] [the boat-stalls spread across the water, what each one is piled high with in many small pieces, their hull sides plain painted timber and their canopies striped cloth] [the one thing happening right now] [the light over everything and what the water does with it] [the lanterns and balconies above] [the band of dithered gradient sky over the rooflines] [the air] [small life if any] [the palette]')}`;
};

builder.vibes = ['whimsical', 'enchanted', 'nostalgic', 'cinematic'];
module.exports = builder;
