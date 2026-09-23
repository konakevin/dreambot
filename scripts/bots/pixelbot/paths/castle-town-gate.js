/**
 * PixelBot castle-town-gate — THE GREAT GATEHOUSE OF A CLASSIC-JRPG CASTLE
 * TOWN, SEEN FROM OUTSIDE AS A TRAVELLER ARRIVES. The "you have reached the
 * city" splash screen.
 *
 * THE GAP (audited entry by entry, not assumed): all fourteen scene paths put
 * the viewer INSIDE a place (cozy-room, ice-cavern, volcano-forge), at a
 * DISTANCE from one (vista, fantasy-vista, skyward, shoreline, harbor,
 * cool-rides, cabin-glow) or already WITHIN its streets (rain-street,
 * floating-market-canal, ruins). None is a THRESHOLD — the moment before you go
 * in, with the thing between you and the place filling the frame.
 * `pixel-fantasy-vista` has 48 castle entries but every one is a distant
 * landmark on a crag or a lake; `pixel-ruins` owns RUINED stone (this gate is
 * intact, working and full of people, which is the differentiator);
 * `cozy-rpg-town` has 16 literal gatehouse locales but it is an IN-GAME
 * gameplay-screenshot path on the old `pixels` medium with chaos ON, and its
 * gate entries are saturated with the exact "heraldic banners" text magnets this
 * path deletes.
 *
 * FIVE DRIFTS, AND WHERE EACH LEVER LIVES:
 *
 *  (1) TEXT AND HERALDRY — the fleet's densest text magnet. Per lesson 12 a
 *      surface whose SHAPE is a text prior cannot be safely described, and per
 *      lesson 27 deleting the noun is NOT enough when the setting carries the
 *      prior: an ABSENCE gets backfilled. So the noun class (banner, crest,
 *      board, sign, plaque, scroll, clock...) is DELETED from every layer — this
 *      path deliberately does NOT use the shared `PICTORIAL_BLOCK`, which names
 *      sign, poster and banner — AND the space it leaves is FILLED positively by
 *      the `wall_life` axis, which is required to name what stands ABOVE THE
 *      ARCH on every entry. Identity is then carried by lesson 36's
 *      POSITION-COLOUR-COUNT LAW: the colour of the cloth, how many towers, how
 *      many lamps lit, the iron gate raised or lowered, the roof's shape, a
 *      carved stone HEAD growing out of the wall. Per lesson 22 the law sits in
 *      the required OUTPUT ORDER (item 4), not appended to seed tails.
 *      ⭐ MEASURED R2 VARIABLE (10 renders across R0+R1): the carved animal must
 *      be a HEAD or a PART jutting out of the wall's own stone, off the arch's
 *      centre line, at most one per render. A WHOLE carved animal standing on a
 *      bracket, a gatepost or a parapet failed 3 of 10 — a LIVE bear sitting in
 *      an upper window, a GIANT LIVE owl on a tower bigger than a house, and TWO
 *      IDENTICAL stone bears mirrored on two gateposts (the dead-symmetry law).
 *      The HEAD form held 3 of 3 and the fish-head spout 2 of 2: a head embedded
 *      in a wall cannot read as alive and cannot become flanking statuary.
 *      ⭐ RESIDUAL AFTER R2, AND THE NEXT LEVER: a single carved head named
 *      "BESIDE the arch" still gets MIRRORED onto both sides by flux's own
 *      gate-symmetry prior — R2 #5's prompt contained exactly ONE owl-head and
 *      the render drew two, one each side. Measured split over 5 rolls that
 *      carried a head: "ABOVE the arch" 0 of 3 mirrored, "BESIDE the arch" 1 of
 *      2 mirrored, on a gatepost 1 of 1 mirrored. "Beside" invites a pair
 *      because a gate has two sides; "above" has only one place to be. So the
 *      next single variable is to move every carved head to ABOVE the arch and
 *      delete "beside" from the pools — which is the BrickBot precedent (on a
 *      framing failure, purge the offending class rather than add words).
 *
 *  (2) THE APPROACH-ROAD CORRIDOR (lessons 17, 24, 29). A road to a gate is the
 *      purest vanishing-point instruction there is. THE CROSSWISE LAW — the wall
 *      runs left edge to right edge with both ends out of frame, the ground is a
 *      near BAND, any road or bridge enters from ONE SIDE EDGE and runs back out
 *      of it cropped, and the arch's inside is ONE SHALLOW space — is stated in
 *      THREE places that reach Flux: this template's first rule, every
 *      `gatehouse` and `camera` seed, and output-order item 2.
 *
 *  (3) SCALE (lessons 13, 25 + the 2026-09-23 correction). Many small figures at
 *      graded distance, a ruler WELDED to the gate's own courses or a cart wheel,
 *      and NO subject gets a detail exemption — the one you describe most comes
 *      out biggest. Stated in the template with its reason so it survives edits.
 *
 *  (4) THE JARGON TRAP (lesson 28). Castle vocabulary is full of correct terms a
 *      layperson pictures as a different object: curtain (fabric), keep (the
 *      verb), bailey, ward (a hospital ward), crown, apron, throat, murder hole,
 *      machicolation / merlon / embrasure / barbican / postern (no prior at
 *      all). All banned at the recipe with plain replacements written out.
 *      `portcullis` is kept but always glossed ("a heavy iron lattice gate"),
 *      the shape of the measured BrickBot balloon/envelope fix.
 *
 *  (5) GRIM. A gate invites siege, weapons and dread — GothBot's and DragonBot's
 *      lane, and a motto failure. Guards are present and unarmed and doing warm
 *      faintly comic things; the whole picture is a welcome.
 *
 * Hero: the gatehouse's own DEFINING MASS standing off-centre in a wall that
 * crosses the whole picture. Money-shot: `arrival_moment` at output-order
 * position 3 with its ACTOR NAMED (a named action with no named actor renders a
 * disembodied limb — measured twice this run; floating-market-canal's residual
 * was exactly this axis sitting at position 4 and being paraphrased into
 * scenery). CHARM has no axis of its own on purpose: the first-third budget is
 * zero-sum (lesson 34), so charm is required inside `gatehouse` (one made thing
 * per entry), `wall_life` (the whole axis) and `arrival_moment`.
 * Pools: 10 bespoke (seeds/pixelbot_castle_town_gate_*.json); `camera` is
 * hand-authored. Function-form; scene wiring derives from index.js SCENE_PATHS.
 */
const blocks = require('../shared-blocks');
const scene = require('../scenePaths');

const SLOTS = ['gatehouse', 'arrival_moment', 'travellers', 'wall_life', 'town_above', 'gate_light', 'gate_life', 'air', 'camera', 'palette'];
const P = scene.loadScenePools('castle_town_gate', SLOTS);

const builder = ({ sharedDNA, vibeDirective, picker }) => {
  const gatehouse = scene.pick(picker, P, 'gatehouse', 'ctg_gatehouse');
  const moment = scene.pick(picker, P, 'arrival_moment', 'ctg_arrival_moment');
  const travellers = scene.pick(picker, P, 'travellers', 'ctg_travellers');
  const wall = scene.pick(picker, P, 'wall_life', 'ctg_wall_life');
  const above = scene.pick(picker, P, 'town_above', 'ctg_town_above');
  const light = scene.pick(picker, P, 'gate_light', 'ctg_gate_light');
  const air = scene.pick(picker, P, 'air', 'ctg_air');
  const camera = scene.pick(picker, P, 'camera', 'ctg_camera');
  const palette = scene.pick(picker, P, 'palette', 'ctg_palette');
  const life = scene.gated(picker, P, 'gate_life', 'ctg_gate_life', 0.6);

  return `${blocks.PIXEL_LOOK_OVERRIDE(sharedDNA)}You are writing a PIXEL-ART PAINTING of the great gate of a castle town, SEEN FROM OUTSIDE ON THE OPEN GROUND AS A TRAVELLER ARRIVES, for PixelBot: the "you have reached the city" scene a classic game paints for its title screen, the front door a player is delighted to finally reach. Playful, adventurous, vivid, beautiful, clever: lamplight and chimney smoke and bright painted timber and carts and a guard who waves you through, all at once. Warm and welcoming and busy, never a siege, never grim, never a photograph.

${blocks.SCENE_REGISTER_BLOCK}
${blocks.ONE_HERO_BLOCK} Here the hero is THE GATEHOUSE MASS, filling 40 to 60 percent of the frame, standing in a wall that crosses the whole picture; the travellers on the ground in front of it are the second read.

THE FRAME, AND THIS IS THE FIRST THING TO GET RIGHT: THE WALL CROSSES THE PICTURE FROM THE LEFT EDGE TO THE RIGHT EDGE. Its stone fills the middle band of the frame from side to side, and both ends of the wall run out of frame, one past the left edge and one past the right edge, so no end of it is visible and nothing narrows away toward a far point. The ground in front of it is a wide near BAND crossing the picture left to right along the bottom third, running out of frame on both sides. The gatehouse mass stands plainly OFF-CENTRE in that wall and is turned three-quarters to the camera, so one of its flanks recedes a little into the picture. Any road, track, causeway or bridge enters from ONE SIDE EDGE of the picture and runs back out of that same edge, cropped, passing ACROSS the front of the gate. What shows in the archway is one SHALLOW space: the bars of the heavy iron lattice gate, or one small bright yard immediately behind it, or deep warm shadow with a single lamp in it.

━━━ THE GATEHOUSE (the hero) ━━━
${gatehouse}

━━━ CAMERA ━━━
${camera}

━━━ WHAT IS HAPPENING RIGHT NOW (the money shot) ━━━
${moment}

━━━ WHAT THE GREAT STONE FACES CARRY ━━━
${wall}

━━━ THE TRAVELLERS ON THE GROUND ━━━
${travellers}

━━━ THE LIGHT OVER EVERYTHING ━━━
${light}

━━━ THE TOWN ABOVE THE WALL ━━━
${above}

━━━ AIR ━━━
${air}
${life ? `\n━━━ SMALL LIFE (an accent, never the hero) ━━━\n${life}\n${blocks.TINY_LIFE_BLOCK}\n` : ''}
━━━ PALETTE ━━━
${palette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

THE WALL IS MOST OF THE PICTURE AND IT IS BUILT FROM PIXELS: great blocks of stone in uneven courses, each face stepping into shadow through two or three flat dithered bands, every ledge and every edge a hard pixel step.

THE GATE SAYS WHO IT IS WITH PHYSICAL FACTS ONLY — the COLOUR of the long cloth strips hung from its poles, twisting edge-on in the wind; HOW MANY towers it has, an odd number with one plainly taller; how many lamps are burning and how many are still dark; the iron lattice gate half-raised or the great doors flat open; the SHAPE of its roof; and at most ONE carved stone HEAD growing straight out of the wall's own stone, off to one side of the arch and never squared up above the middle of it (a whole carved animal on a bracket or a gatepost renders as a live animal or as a mirrored pair). Above the archway there is always a real solid thing, exactly as the stone faces already name it. Every flat surface in the picture carries a real object instead of being empty.

EVERY FIGURE IS A SMALL CLEAN PIXEL-SPRITE SHAPE, including the nearest one, and none of them gets more detail than any other, because the one you describe most is the one that comes out biggest. They are known by their silhouette and by what they are doing, and their size is measured against the wall's own stone courses or the great door's bottom hinge. If the light disagrees with the air or the palette, keep the LIGHT and let the air and the colours happen inside it, with one sun or one moon in the whole picture and never both. Somewhere in the picture one warm or saturated colour burns against the cool stone, exactly as the light and the palette already name it, so the frame is never one flat wash. The strip of sky above the town's roofs is a banded dithered gradient of two or three colours in the light's own palette, never a flat empty field, and any moon in it is a simple flat pixel disc drawn in the same few colours as the rest of the picture. Keep it warm, bright, busy and full of small things to find.

${blocks.SCENE_STRUCTURE('[the pixel-art style words] [the wall crossing the picture from the left edge to the right edge with both ends running out of frame, the gatehouse mass standing off-centre in it and turned three-quarters, the ground a wide near band across the bottom, all of it seen from outside on the open ground from the camera] [the one thing happening right now and the whole figures doing it] [what the great stone faces carry, and the solid thing standing above the archway] [the travellers scattered across the ground at different distances, their size measured against the wall\'s own stone courses] [the light over everything and what the stone does with it] [the town\'s roofs and towers in a band above the wall, under a banded dithered gradient sky] [the air, and small life if any] [the palette]')}`;
};

builder.vibes = ['whimsical', 'enchanted', 'nostalgic', 'epic'];
module.exports = builder;
