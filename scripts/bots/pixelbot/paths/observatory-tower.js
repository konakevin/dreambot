/**
 * PixelBot observatory-tower — THE INSIDE OF AN ASTRONOMER'S TOWER IN A
 * CLASSIC-JRPG WORLD: the great brass telescope standing on the boards, the
 * dome's long slot cranked open on real night sky. PixelBot's fourth interior
 * and its first path about KNOWLEDGE, INSTRUMENTS or an interior that opens to
 * the sky.
 *
 * THE GAP (audited in the seed pools, not assumed): of 15 scene paths only
 * three are interiors — volcano-forge (a MASS of fire and iron), ice-cavern (a
 * MASS of ice) and pixel-cozy-room (a nest). The real collision is cozy-room,
 * whose 200-entry room pool contains four STARGAZER ATTIC / LOFT entries with
 * "a copper telescope propped on a three-legged stool" plus ~30 curved TOWER
 * rooms with porthole windows — but there the telescope is a PROP in a
 * quilt-and-teapot nest and the opening is a closed window. Here the instrument
 * is the HERO MASS, the opening is a SLOT STANDING OPEN with weather coming in,
 * and the register is brass, iron, timber and rope (the gen script BANS
 * cozy-room's signature nouns outright). `classic-jrpg` and `cozy-rpg-town`
 * have literal observatory-deck locales but are IN-GAME gameplay-screenshot
 * paths on the old `pixels` medium with chaos ON, saturated with the exact
 * "constellation-chart / star-charts" text magnets this path deletes.
 * `pixel-haunted-house` owns the observatory-topped haunted house from outside;
 * GothBot owns dread; StarBot owns space itself.
 *
 * FOUR DRIFTS, AND WHERE EACH LEVER LIVES:
 *
 *  (1) TEXT — this is the highest text-risk subject on the fleet. Per lesson 12
 *      a surface whose SHAPE is itself a text prior cannot be described safely,
 *      per lesson 23 even the fleet's "one small painted picture" move invents a
 *      signboard where the substrate is not guaranteed visible, and per lesson 27
 *      deleting the noun is not enough because an ABSENCE gets backfilled. So the
 *      whole noun class (chart, map, book, page, dial, scale, globe, plaque...)
 *      is DELETED from every layer — this path deliberately does NOT use the
 *      shared `PICTORIAL_BLOCK`, which names sign, poster and banner, and it
 *      never uses the "worn pictorial relief" formula, which is safe on exterior
 *      stone and was a measured LIABILITY indoors on ice-cavern. The space is
 *      then FILLED by `room_dressing` plus lesson 36's POSITION-COLOUR-COUNT
 *      LAW (0 text in 26 renders on exactly this subject on FaeBot), which sits
 *      in the required OUTPUT ORDER at item 6, not appended to seed tails.
 *      ⭐ ONE DEPARTURE FROM THE ORIGINAL SPEC: no cork board and no pin board.
 *      Lesson 27's dividing line is whether the object's SHAPE is already a
 *      sign, and a flat rectangle fixed to a wall is exactly that. A tower's
 *      wall CURVES and cannot read as a rectangle, so everything pinned goes
 *      into the room's own curving plaster with the curve reading behind it.
 *
 *  (2) THE INTERIOR CAN VANISH (lesson 3, measured on this bot). Ultima-tile and
 *      HD-voxel carry an isometric-diorama prior that replaces an enclosing room
 *      with a void; camera words do not fix it, naming the enclosing surfaces
 *      does, and per ice-cavern you must also name WHAT THEY ARE MADE OF. Here
 *      masonry is correct and wanted, so the enclosure is named freely and
 *      materially in FOUR places that reach Flux: this template's first rule, the
 *      hero block, all 25 `camera` entries, and output-order item 2. The slot is
 *      the only opening, written per lesson 10 as one camera seeing one
 *      continuous space, which is what beats the split-panel render.
 *
 *  (3) FLAT LIGHT (lesson 30). An "outdoor sky" light entry on an interior path
 *      is a flat-daylight generator. Every `lamp_light` entry names a source that
 *      EXISTS IN THE ROOM and says what its light lands on; the cold counter
 *      comes from `sky_slot`, which is always-on. The warm-accent-attached-to-
 *      the-light requirement is ice-cavern's measured anti-monochrome lever
 *      (one warm accent in 15 of 15 renders).
 *
 *  (4) THE JARGON TRAP (lesson 28). eyepiece / mount / tube / objective / finder
 *      / declination / armillary / orrery / quadrant all render the layperson's
 *      other object. Banned at the recipe with plain replacements. TELESCOPE is
 *      KEPT and used freely because it is the layperson's word and its prior is
 *      correct — the shape of the measured BrickBot balloon/envelope fix.
 *
 * TWO DESIGNED DEPARTURES FROM THE SUGGESTED AXIS SPINE, both defended by
 * measurement:
 *  - HERO = `instrument`, not `tower_room`. ice-cavern's open residual is that a
 *    hero pool naming CHAMBERS is all negative space (4 of 5 renders had no
 *    readable hero and a dead upper half); volcano-forge works because its hero
 *    is a MASS standing in a room. The telescope is the mass. Output-order item 2
 *    still names the ROOM first and the instrument as standing in it, which is
 *    volcano-forge's proven wording — the enclosure leads, the mass is possessive
 *    to it, and the hero POOL leads with the mass.
 *  - NO separate `air` axis and NO separate `charm` axis. The first-third budget
 *    is zero-sum (lesson 34) and on this bot the two best-scoring paths are the
 *    two shortest-prompt paths (volcano-forge 229 emitted median, PASS;
 *    cozy-room 217, PASS) against ice-cavern 276 (CLOSE) and castle-town-gate
 *    299 (which lost late content at the top end). On an interior the air's
 *    source IS the slot, so air facts live in `sky_slot` and `lamp_light`; charm
 *    is REQUIRED inside `instrument`, `tower_room`, `reading_tool`,
 *    `room_dressing` and `observer_moment`. `sky_slot` takes the freed axis
 *    because the open dome is the path identity.
 *
 * `observer_moment` sits at OUTPUT-ORDER POSITION 3 with its ACTOR NAMED —
 * floating-market-canal's residual was exactly this axis sitting at position 4
 * and being paraphrased into scenery, and a named action with no named actor
 * renders a disembodied limb (measured twice). Its recipe carries neither the
 * identity law nor the size law (lesson 40).
 *
 * MODEL PIN, declared on the builder so the in-memory wrapper honours it from
 * round 0: the flux-2 family only. flux-dev and flux-1.1-pro-ultra are excluded
 * on this bot on evidence measured independently on volcano-forge, ice-cavern,
 * floating-market-canal and castle-town-gate — they return fully SMOOTH
 * paintings with no pixel structure, ultra stamps a gibberish signature (a hard
 * TEXT fail on the roster's highest text-risk subject) and flux-dev drops late
 * content. A lamplit night interior is also a CONDITION-identity path, which is
 * ultra's standing failure class.
 *
 * RESERVE LEVER, NOT SPENT AT ROUND 0: the shared `PAINTING_MEDIUM` fragment
 * (32 words at prompt position 36) says "layered depth to the horizon", which is
 * an exterior mandate sitting in the attended first third of an interior path
 * (lesson 37). It is NOT replaced here, because volcano-forge and ice-cavern
 * rendered 0 diorama-in-a-void in 15 renders under that same fragment — so the
 * measured evidence says it is not the binding constraint, and lesson 34 says
 * not to spend a lever on a trap that is already held. If the enclosure fails in
 * round 0, a path-own code-only medium in `mediumStyles` is the single variable.
 *
 * Pools: 9 bespoke (seeds/pixelbot_observatory_tower_*.json); `camera` is
 * hand-authored. Function-form; scene wiring derives from index.js SCENE_PATHS.
 */
const blocks = require('../shared-blocks');
const scene = require('../scenePaths');

const SLOTS = ['instrument', 'tower_room', 'sky_slot', 'reading_tool', 'observer_moment', 'room_dressing', 'lamp_light', 'camera', 'palette'];
const P = scene.loadScenePools('observatory_tower', SLOTS);

const builder = ({ sharedDNA, vibeDirective, picker }) => {
  const instrument = scene.pick(picker, P, 'instrument', 'obs_instrument');
  const room = scene.pick(picker, P, 'tower_room', 'obs_tower_room');
  const slot = scene.pick(picker, P, 'sky_slot', 'obs_sky_slot');
  const reading = scene.pick(picker, P, 'reading_tool', 'obs_reading_tool');
  const moment = scene.pick(picker, P, 'observer_moment', 'obs_observer_moment');
  const dressing = scene.pick(picker, P, 'room_dressing', 'obs_room_dressing');
  const light = scene.pick(picker, P, 'lamp_light', 'obs_lamp_light');
  const camera = scene.pick(picker, P, 'camera', 'obs_camera');
  const palette = scene.pick(picker, P, 'palette', 'obs_palette');

  return `${blocks.PIXEL_LOOK_OVERRIDE(sharedDNA)}You are writing a PIXEL-ART PAINTING of the inside of an astronomer's tower at night, lit by its own lamp and open to the stars through its dome, for PixelBot: the great brass telescope a classic game paints for its title screen, the room a player is delighted to climb all those stairs to reach. Playful, wondrous, warm and a little magical: lamplight on worn brass, breath in the cold air, a rolling ladder, a crank and a coil of rope, and the night coming straight in. Never a science photograph, never grim, never cold and empty. The LAMPLIT TOWER ROOM IS the picture.

${blocks.SCENE_REGISTER_BLOCK}
${blocks.ONE_HERO_BLOCK} Here the hero is THE GREAT BRASS TELESCOPE, filling 40 to 60 percent of the frame, standing off-centre on the floorboards of a round tower room; the room's own surfaces are the second read.

THE FRAME, AND THIS IS THE FIRST THING TO GET RIGHT: this is the INSIDE of one round tower room and the room closes the picture in on every side. Its CURVED WALL of stone or plaster stands behind the telescope and runs out of frame past both side edges. Its FLOOR of wide timber boards or flagstones crosses the bottom of the picture from edge to edge. Its DOMED CEILING of curved timber ribs and boards closes the frame overhead, with ONE NARROW SLOT open in it as the picture's only opening, so the outside is seen through it in the same one unbroken shot. The telescope stands plainly OFF-CENTRE on the floor and is turned three-quarters to the camera, so one side of it recedes into the picture and the weight of the composition sits to one side, never square-on and never mirrored.

━━━ THE GREAT BRASS TELESCOPE (the hero) ━━━
${instrument}

━━━ CAMERA ━━━
${camera}

━━━ WHAT IS HAPPENING RIGHT NOW (the money shot) ━━━
${moment}

━━━ THE TOWER ROOM ITSELF (the second read) ━━━
${room}

━━━ THE OPEN SLOT AND THE NIGHT THROUGH IT ━━━
${slot}

━━━ THE LIGHT INSIDE THE ROOM ━━━
${light}

━━━ HOW THIS ROOM KEEPS TRACK OF THE SKY ━━━
${reading}

━━━ WHAT THE SHELVES AND WALLS AND FLOOR CARRY ━━━
${dressing}

━━━ PALETTE ━━━
${palette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

THE WHOLE ROOM IS BUILT OF STONE AND TIMBER AND THAT IS SAID WHEN ITS SURFACES ARE NAMED: the curved wall great blocks of stone in uneven courses or curving lime-washed plaster, each face stepping into shadow through two or three flat dithered bands; the floor wide worn boards with their grain in hard pixel lines; the dome curved timber ribs with boards between them; every edge a hard pixel step. This is a NIGHT scene, one moon at most and never a sun, and one warm saturated colour burns against the cold exactly as the light and the palette already name it. EVERY WALL, SHELF, BEAM AND STRETCH OF FLOOR CARRIES REAL SOLID OBJECTS and no stretch of wall is left bare, because a bare wall is a dead wall; nothing flat and rectangular is fixed to a wall anywhere, and nothing is ever a picture, a symbol or a reading surface. Every figure is a small clean pixel-sprite shape, including the nearest one, and none gets more detail than any other, because the one you describe most comes out biggest. Keep it warm, bright, busy and full of small things to find.

${blocks.SCENE_STRUCTURE('[the pixel-art style words] [the round tower room, its curved wall running out of frame both sides, its timber floor across the bottom, its ribbed dome overhead, and standing off-centre on that floor and turned three-quarters, the great brass telescope filling much of the frame, seen from the camera] [the one thing happening right now and the whole figure doing it] [the dome\'s one slot open — a TALL NARROW gap with the dome\'s own timber down BOTH sides of it — the night sky through it, and whatever comes in] [what the shelves, walls, beams and floor carry, and how the room keeps track of the sky as the position, colour and count of real objects] [the warm lamp inside the room and the surfaces its light lands on] [the palette]')}`;
};

builder.vibes = ['enchanted', 'whimsical', 'ethereal', 'nostalgic'];
// See the MODEL PIN note in the header. Declared here so `scenePaths.patchInMemory`
// honours it from round 0 instead of handing the path all five SCENE_MODELS.
builder.models = {
  'black-forest-labs/flux-2-pro': 1,
  'black-forest-labs/flux-2-max': 1,
  'black-forest-labs/flux-2-flex': 1,
};
module.exports = builder;
