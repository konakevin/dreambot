/**
 * BrickBot archaeology-dig — the EXCAVATION path (2026-09-23).
 *
 * A LEGO dig site: a trench cut open across a green field, its wall showing
 * the ground in colour-banded brick courses, and ONE enormous thing standing
 * up out of the floor — a rib you could walk a minifigure under, a colossal
 * LEGO brick with studs the size of tabletops, a golden minifigure head the
 * size of a hut — with a crew of minifigures working around it with hand
 * brushes.
 *
 * ── ⚠️ THE PARTIAL REVEAL IS WRITTEN AS SOMETHING PRESENT. THIS IS THE ONE
 *    THING THAT KILLS THIS PATH, AND IT IS MEASURED ────────────────────────
 * The gift of an excavation is that something huge is still in the ground and
 * the viewer's own mind finishes it. That is a SUBTRACTIVE description of a
 * thing the model wants to render whole, and playbook lesson 58 measures
 * subtraction as unachievable by description. One authored clause carried an
 * additive half and a subtractive half, in the SAME sentence, at the SAME
 * position, in the SAME prompts:
 *
 *   "woolly cuffs still at the ankles"   (ADDITIVE)    → 6 of 6, every round
 *   "no fluff on the body anywhere"      (SUBTRACTIVE) → 1 of 6
 *
 * So this path never says "mostly buried". It uses lesson 58's three-part
 * recipe, and all three parts are in the seeds AND in the required output
 * order:
 *   1. the exposed piece's SHAPE stated in its own terms as a complete
 *      readable object ("a single smooth arch rising twice a minifigure
 *      height, wide enough to walk two figures under");
 *   2. SOMETHING THE MODEL CAN PUT ON IT — the hat-and-socks trick, which
 *      absorbs the urge to render more of the thing (a brush laid along its
 *      ridge, a plank walkway across it, a rope sling under it, a bucket
 *      hooked over it);
 *   3. ODD-ONE-OUT AGAINST A NAMED MAJORITY, where the majority is the
 *      TRENCH FLOOR and the floor is a POSITIVE object: the flat plates run
 *      right up to it and CONTINUE PAST IT on both sides as one unbroken
 *      surface. That is the additive way to say the rest is in the ground.
 * Plus amber-forest's ATTACHMENT law — every find OPENS by naming what holds
 * it (welded into the floor plates, sunk into the ochre band, set into the
 * wall with roots grown across it), because a mass with air all round it
 * renders as a polished museum specimen on a plinth.
 * If a future reword reintroduces "mostly buried" / "partly exposed" / "the
 * rest is still underground", the model renders the whole animal.
 *
 * ── THE GAP (verified against the live roster, not assumed) ───────────────
 * BrickBot's 20 paths are space / pirates / fantasy-castle / forest / aquatic
 * / winter / landscape / lego-landscapes / theme-park / western / mech /
 * macro-display / girly / crazy-islands / lego-city / lego-trains /
 * haunted-brick / lego-masters / airfield-biplanes / balloon-festival.
 * Grepping the 200+ seed files for dig vocabulary: 128 "trench" tokens are
 * an OCEAN trench (aquatic) or a canyon (western camera), 107 "strata" are
 * geology in `landscape_terrain_build_technique`, and the ~20 genuine
 * archaeology mentions are single scattered entries inside OTHER paths' pools
 * (a "mech excavation site" in `mech_setting`, a sifting station in
 * `macro_display_scenes`, tomb-raider beats in `pirates_scene_type`). No path
 * on this bot is a dig, and — the real point — NO PATH ON THIS BOT LOOKS INTO
 * A HOLE. Every hero sits on the ground, in a room, or in the sky.
 *
 * ── THE DIFFERENTIATOR: EXCAVATION AS A VERTICAL CUT ─────────────────────
 * The three paths that crowd this one are `western` (arid ground),
 * `macro-display` (close-up brick) and `lego-landscapes`. What none of them
 * can show is a VERTICAL SLICE THROUGH THE GROUND: the trench wall in
 * colour-banded brick courses, string lines pegged across the pit, spoil
 * heaps, canvas, a ladder down. The hero is the cut face and the half-exposed
 * find. Explicitly NOT a museum display (that is `macro-display`'s territory)
 * and NOT a desert vista (that is `western`'s).
 *
 * ── AXES: 8 always-on + 1 conditional ────────────────────────────────────
 *   • find      — ★ THE MONEY SHOT. The partial reveal. Leads the prompt.
 *   • cut       — the vertical slice: the banded courses, the way down, the
 *                 floor and the lip. THE DIFFERENTIATOR, and the axis that
 *                 carries the CROSSWISE LAW (a trench is a LINEAR feature,
 *                 which is a measured receding-corridor generator).
 *   • moment    — the story beat, at output-order position 3, always naming
 *                 its ACTOR as a whole figure (a named action with no named
 *                 actor renders a giant disembodied hand and forearm).
 *   • camp      — the surface kit. THE HIGHEST-TEXT-RISK AXIS, so it is built
 *                 out of ROUNDED IRREGULAR things by construction (baskets,
 *                 barrels, buckets, round sieves, sacks, coils of rope, a
 *                 tipped barrow) and every piece is named as CARRYING
 *                 something. Crates, boards, trays and labels are DELETED
 *                 from every layer, never described.
 *   • crew      — the scale ruler: several small figures, heights pinned to
 *                 something welded to the scene, gathered to ONE side.
 *   • light     — ★ owns time of day + light direction + shadow + the colour
 *                 of the AIR. There is deliberately NO palette axis: colour
 *                 here comes from the cut's own bands, so a palette pool
 *                 would contradict the rolled cut, and fusing the two buys
 *                 back a slot of first-third word budget.
 *   • build     — THE ANTI-PHOTOREAL LEVER (the role water_build_technique /
 *                 snow_ice_build_technique / terrain_build_technique play on
 *                 BrickBot's other drift-prone paths). This path's hero IS
 *                 GROUND, and on this bot the GROUND is what photoreal-drifts
 *                 while the hero holds (measured on airfield-biplanes).
 *   • camera    — HAND-AUTHORED, off-axis by construction. On a LEGO-
 *                 photography bot an AXIAL or PLAN-VIEW camera entry is a
 *                 hard-fail GENERATOR that out-votes every anti-symmetry
 *                 mandate in the template (airfield-biplanes: every hard fail
 *                 across four batches traced to 3 of 25 entries). The fix is
 *                 purging entries, so this pool has none — and no entry puts
 *                 the camera ON something the find could be, and none uses a
 *                 posture verb.
 *   • event     — 50%-gated environmental beat. OBJECTS, AIR AND ANIMALS
 *                 ONLY, so it can never compete with `moment` for the
 *                 render's one human story beat.
 *
 * ── TEXT, THE PATH'S HARDEST FAILURE ─────────────────────────────────────
 * A dig is the densest label-magnet subject on the bot: site signs, notice
 * boards, stencilled crates, finds labels, numbered flag markers, graduated
 * measuring rods, clipboards, plan drawings. The dividing line is whether an
 * object's SHAPE IS ALREADY A SIGN — a flat bounded rectangle is one and no
 * wording makes it safe, while a curved or irregular surface is not. So every
 * sign-shaped noun is deleted from every layer AND the space it leaves is
 * filled positively with rounded kit, because "plain" and "blank" are
 * negations the model cannot use and an undescribed surface is exactly what
 * gets lettering backfilled onto it. Crop carries the rest: the cut face
 * fills the near frame instead of a receding rank of pit squares, because a
 * receding rank shows many text-bearing faces and a cropped near wall shows
 * two.
 *
 * ── WIDE SUBJECT → DEEP-FOCUS PREFIX (decided on measurement) ────────────
 * This path REQUIRES the `promptPrefixByPath` deep-focus string. BrickBot's
 * `photography` medium fragment is 27 words and contains "natural bokeh", and
 * airfield-biplanes measured what happens without the override: 4 of 6
 * first-batch renders collapsed to a hero-on-bokeh product shot with the
 * setting an unreadable smear, while the brick signal held on all 6 anyway.
 * Here the smeared thing would be the CUT FACE — the path's entire
 * differentiator — so the prefix is not optional. The tilt-shift the prefix
 * trades away is Flux's "everything is brick" signal, so the template's brick
 * block names every drift surface (soil, spoil, dust, turf, canvas, roots,
 * water) as a named part.
 *
 * ── FILE SHAPE ───────────────────────────────────────────────────────────
 * Deliberately a FUNCTION path, not the declarative `{archetype, pools}`
 * shape the bot's older axis paths use. A declarative path resolves its pools
 * through `bot.poolByName` → `pools.js` and its template through
 * `archetype-templates.js` — three shared single-writer files. This path
 * loads its own seeds and carries its own template, so merging it touches
 * ONLY index.js.
 *
 * Pools: scripts/bots/brickbot/seeds/brickbot_dig_*.json (9 × 25, MVP).
 * Gen:   scripts/gen-seeds/brickbot/gen-archaeology-dig-pools.js
 *        (8 recipes; the camera pool is hand-authored).
 */

const fs = require('fs');
const path = require('path');

const SEEDS = path.join(__dirname, '..', 'seeds');
const load = (name) => JSON.parse(fs.readFileSync(path.join(SEEDS, `${name}.json`), 'utf8'));

const POOLS = {
  find: load('brickbot_dig_find'),
  cut: load('brickbot_dig_cut'),
  moment: load('brickbot_dig_moment'),
  camp: load('brickbot_dig_camp'),
  crew: load('brickbot_dig_crew'),
  light: load('brickbot_dig_light'),
  build: load('brickbot_dig_build'),
  camera: load('brickbot_dig_camera_framing'),
  event: load('brickbot_dig_event'),
};

const EVENT_GATE = 0.5;

// ── CROSS-AXIS COMPATIBILITY, ENFORCED STRUCTURALLY ──────────────────────
// A prose compatibility clause in a template loses to a pool pick every time
// (measured on a sibling path: a harbour rowboat launched in a desert against
// an explicit "adapt or drop the moment" block). The documented fix is to
// require the thing a pick needs and filter against what actually rolled — a
// filter cannot be paraphrased away.
//
// What genuinely couples here, counted against the real pools rather than
// guessed: the WAY DOWN varies (a brick ladder in 6 of 25 cut entries, a
// plank ramp in 7, a knotted rope in 6, cut steps in 3), and WATER is in only
// 9 of 25 — while five `moment` entries and two `crew` entries name the
// ladder, and one of each stands in the water. Those are size rulers and
// staged actions, so an absent referent means the model must INVENT the
// object, and an invented object inflates.
//
// ⚠️ Each rule's LEFT regex is coupled to the literal wording of the pools —
// a reword that breaks the match silently disables the filter, which is why
// the phrases are quoted in the comments. Equipment the actor brings with
// them (a technic tripod, a hose, a pump described inside the moment itself)
// is deliberately NOT filtered: it is self-supplying, unlike a ruler.
const STAGE_NEEDS = [
  // "halfway up the ladder", "heads barely reaching the third ladder rung"
  [/\bladder\b/i, /\bladder\b/i],
  // "standing in ankle-deep trans-blue plates bailing with a bucket"
  [/trans-blue|ankle-deep|bailing|half-flooded/i, /trans-blue|water|flooded|oozing|pooled|puddle/i],
  // "tipping a barrow of loose studs", "the barrow's wheel hub"
  [/\bbarrow\b/i, /\bbarrow\b|handcart|wheelbarrow/i],
  // "shorter than the barrel beside them", "pouring water from a barrel dipper"
  [/\bbarrel\b/i, /\bbarrel\b/i],
  // "huddled around a kettle on a brick fire"
  [/\bkettle\b/i, /\bkettle\b/i],
  // "shorter than the stacked sieve tower leaning against the cut face"
  [/sieve tower|stacked sieve|tower of round sieves/i, /sieve/i],
  // "all of them shorter than the tent ridge sagging above their heads"
  [/tent ridge|\btent\b/i, /\btent\b|tarpaulin|lean-to|canopy/i],
  // "shorter than the round pump body rising beside them" — a RULER, so it
  // needs the pump present, unlike the moment's own self-supplied pump.
  [/pump body|\bpump\b/i, /\bpump\b|generator/i],
];

// Camera entries only ever reference the cut face, the floor, the find, the
// lip, the crew and the turf — all guaranteed present — except these three.
const CAMERA_NEEDS = [
  [/\bladder\b/i, /\bladder\b/i], // "Camera set beside the ladder at mid-height"
  [/\bbarrow\b/i, /\bbarrow\b|handcart|wheelbarrow/i], // "behind a tipped barrow"
  [/round sieves/i, /sieve/i], // "behind a stack of round sieves"
];

// ── ONE ANIMAL PER RENDER ────────────────────────────────────────────────
// Four axes can supply an animal (camp 2/25, moment 2/25, crew 1/25, event
// 10/25), and two axes that can both supply an animal will render both — a
// carved owl in one axis plus a live owl in another gave two owls competing
// with the hero on another bot. The animals are good delight content, so the
// budget is enforced at ROLL TIME rather than purged from the pools. First
// claim wins in roll order (camp → moment → crew → event), and the event is
// simply dropped if it cannot find an animal-free pick — it is 50%-gated
// anyway, so dropping it is free.
const ANIMAL =
  /\b(dog|dogs|chicken|chickens|goat|goats|sheep|crow|crows|badger|badgers|cat|cats|bird|birds|horse|donkey|mole|mole-hill|molehill|cow|cows|cattle|rabbit|fox)\b/i;

function pickFiltered(pool, slot, picker, rules, context, blockAnimal, tries = 10) {
  let chosen = picker.pickWithRecency(pool, slot);
  for (let i = 0; i < tries; i++) {
    const missingDep = rules.some(([needs, supplies]) => needs.test(chosen) && !supplies.test(context));
    const animalClash = blockAnimal && ANIMAL.test(chosen);
    if (!missingDep && !animalClash) return chosen;
    chosen = picker.pickWithRecency(pool, slot);
  }
  return chosen; // exhausted — ship the last pick rather than fail a render
}

module.exports = function archaeologyDig({ vibeDirective, picker }) {
  const pick = (key, slot) => picker.pickWithRecency(POOLS[key], slot);

  // The STAGE rolls first, so everything that references a piece of it can be
  // filtered against what it actually supplies.
  const cut = pick('cut', 'trench_cut');
  const camp = pick('camp', 'site_camp');
  const stage = `${cut} ${camp}`;

  let animalUsed = ANIMAL.test(camp);

  const moment = pickFiltered(POOLS.moment, 'dig_moment', picker, STAGE_NEEDS, stage, animalUsed);
  animalUsed = animalUsed || ANIMAL.test(moment);

  const crew = pickFiltered(POOLS.crew, 'dig_crew', picker, STAGE_NEEDS, stage, animalUsed);
  animalUsed = animalUsed || ANIMAL.test(crew);

  const find = pick('find', 'dig_find');
  const camera = pickFiltered(POOLS.camera, 'camera_framing', picker, CAMERA_NEEDS, stage, false);
  const light = pick('light', 'dig_light');
  const build = pick('build', 'build_technique');

  let event = null;
  if (Math.random() < EVENT_GATE) {
    const candidate = pickFiltered(POOLS.event, 'dig_event', picker, [], stage, animalUsed);
    // If the budget is spent and every try still came back with an animal,
    // drop the event rather than ship two competing animals.
    if (!(animalUsed && ANIMAL.test(candidate))) event = candidate;
  }

  const eventSection = event
    ? `
━━━ SITE EVENT (a secondary beat — it amplifies the moment, it never eclipses it) ━━━
${event}
`
    : '';

  const brief = `You are a LEGO MOC photographer and AFOL convention judge writing an EXCAVATION diorama description for BrickBot. Output is ONE comma-separated phrase string for Flux. No preamble, no labels, no bullets, no ━━━ markers, no **bold**, no numbered output. Single paragraph.

━━━ THE BAR — PLAYFUL, ADVENTUROUS, VIVID, BEAUTIFUL, CLEVER ━━━
A Bricklink champion's cutaway-ground diorama at a LEGO World convention, and a frame someone would screenshot. Something is HAPPENING and something is REACTING to it. One clever charm detail the eye finds on second look. A tidy pit with a skeleton in it is the boring failure this path exists to avoid.

━━━ RULE 1 — ONE ENORMOUS THING STANDS UP OUT OF THE TRENCH FLOOR, AND THE FLOOR RUNS PAST IT UNBROKEN ━━━
The find is the hero of this frame, so it leads the prompt. Write it as something PRESENT, never as something missing: name what HOLDS it, give the exposed piece a clean readable shape stated in its own terms, and say that the trench floor of flat plates runs right up to it and CONTINUES PAST IT on both sides as one unbroken surface. That unbroken floor is how this picture says the rest of it is still in the ground. Describe only what IS present in the frame.
Its size is the joke: a crew of minifigures with hand brushes working on one piece bigger than their tent. So the CREW FIGURES ARE THE RULER and they belong in the same breath as the find — say how many of them are standing on the trench floor beside it and how many times taller than them it stands. Pin it to them first, and to the rung of the way down, the barrow wheel or a bucket second.

━━━ RULE 2 — THE TRENCH CROSSES THE PICTURE, AND ITS WALL IS THE GROUND IN COLOUR BANDS ━━━
This is the picture only this path can take: a VERTICAL SLICE THROUGH THE GROUND. The cut runs FROM THE LEFT EDGE OF THE PICTURE TO THE RIGHT EDGE with BOTH ENDS RUNNING OUT OF FRAME, its near cut face filling the near part of the frame and the green turf lip a BAND ALONG ONE BORDER. The wall of it is stacked courses of flat plates in committed colour bands with the stud rows showing between them, and the bands are irregular: every course a different thickness, none of them dead level, one sagging and pinching out to a thread along its length. Everything in the frame is off the centre line and unbalanced — the find cropped by one side, the kit gathered to one side, one figure near and another further back. This is a working hole in a field, not a museum display and not a desert vista.

━━━ EVERYTHING IS BRICK — THE GROUND ABOVE ALL ━━━
Every element is brick-built with visible studs, moulded plastic and connection seams, on a tabletop convention display. THE GROUND IS WHAT DRIFTS, so it is named as parts every time: the cut face is stacked plate courses seen edge-on, the swept trench floor is smooth tiles with a few studs left proud, spoil is a heaped cone of loose 1x1 round studs and cheese slopes, dust is a scatter of trans-clear and tan studs, turf on the lip is a green plate mosaic with moulded tuft elements, roots are brown flexible tubes pushed out between courses, water in a low corner is trans-blue plates, canvas is a rumpled cloth element or tan plates stepped over a technic frame, rope is a run of bar-and-clip. Every figure is a LEGO minifigure with C-shaped hands and a printed face.

━━━ THE FIND — THE MONEY SHOT (lead the prompt with this) ━━━
${find}

━━━ THE CUT (the all-brick stage) ━━━
${cut}

━━━ THE MOMENT — render this one instant and its physical consequence ━━━
${moment}

Motion is a frozen brick moment, never motion blur. This moment happens on the trench floor, against the cut face, on the way down, or at the lip.

━━━ THE CAMP BESIDE THE PIT ━━━
${camp}

Every piece of kit here is rounded or slumped — a basket, a barrel, a bucket, a round sieve, a sack, a coil of rope, a tipped barrow — and each one is heaped or slumped with whatever it holds.

━━━ THE CREW — this is what proves the scale ━━━
${crew}

Every crew figure is a small clean readable minifigure at minifigure scale. None is singled out for close detail, because detail and size are the same dial and the one you describe most is the one that comes out biggest.

━━━ THE MOC BUILD TECHNIQUE — render it visibly ━━━
${build}

━━━ THE CAMERA FRAMING — this drives the composition ━━━
${camera}

Please use that exact camera position and orientation, even though the LEGO-photography prior favours a centred subject square to the lens at eye level. A trench is a long straight thing, so it will try to run away from the camera down its own length: instead it crosses the picture side to side with both ends cropped. Tie the figures to the rolled angle — a low angle shows them foreshortened from below, a raised angle shows them from above, an over-the-shoulder shows them from behind, a wide shot spreads several at different depths.

━━━ LIGHT AND THE COLOUR OF THE AIR ━━━
${light}
${eventSection}
━━━ MOOD ━━━
${(vibeDirective || '').slice(0, 150)}

━━━ WRITE IT IN THIS ORDER — 115-155 WORDS ━━━
A tight scene with one clear hero beats a crammed inventory every time. Pick the details that carry THIS render and stop.
1. The camera angle, then the find: what holds it, the readable shape of the exposed piece, THE CREW FIGURES STANDING ON THE TRENCH FLOOR BESIDE IT and how many times taller than them it stands, the one thing lying on or hooked over it, and the trench floor of flat plates running right up to it and continuing past on both sides as one unbroken surface.
2. The cut face: its irregular colour bands as stacked brick courses with the stud rows showing, the way down, and the trench crossing the picture from the left edge to the right edge with the turf lip a band along one border and both ends running out of frame.
3. The moment, naming the whole figure doing it.
4. The camp beside the pit: the spoil heap, the shelter, and what the rounded kit is heaped with.
5. The build technique, visibly.
6. The light and the colour of the air.${event ? '\n7. The site event.' : ''}
Output ONLY the phrase string — one paragraph, no labels, no markers.`;

  return { brief, briefMeta: { camera, lighting: light } };
};
