/**
 * ToyBot bath-toy-flotilla (2026-09-22, SHADOW) — function-form, self-contained, mirroring
 * snow-globe-world's shape (loads its own seed JSONs; zero pools.js / archetypes.js touch).
 *
 * WHY THIS PATH. Audited all 27 ToyBot builders: every single one photographs toys on a DRY
 * surface — a shelf, a table, a board, a diorama floor, a stage, or sealed inside a globe. There
 * is no WATER path, and nothing in the roster is built on a comic mismatch of SCALE. This adds
 * both. The premise: the bath is an OCEAN, the toys are a FLEET, and it is shot like a maritime
 * epic from down at the waterline. The delight is the gap between the heroic treatment and the
 * fact that it is six inches of bathwater, so the toys are played COMPLETELY STRAIGHT as vessels
 * and crew — the comedy is the viewer's, never in the words.
 *
 * Axes: FLEET (the hero, leads) + LANDMARK (the one cropped bath edge — the container knob) +
 * LIGHT (owns the palette) + SEA STATE (the money shot) + MOMENT (story beat, 0.75 gate) +
 * SEA LIFE (other toys as wildlife, 0.5 gate). Hand-authored vantages inline.
 *
 * FIVE load-bearing decisions, each from a measured lesson:
 *
 * FOUR ROUNDS RUN (6 shadow renders each, 24 total, 0 errors). Scores: R1 2.5 -> R2 2.1 -> R3 3.0
 * -> R4 2.75. SHIPPED STATE IS R3, plus two repairs that measured clean. Best render of the build is
 * R3 #2 at 4.0: a grey submarine breaching in foam in front of a duck squadron, shot at the
 * waterline with the enamel slope filling the top half. NOT a pass; the residual is named at the
 * bottom of this header.
 *
 * 1. THE CONTAINER KNOB HAS A FOURTH POSITION THIS PATH HAD TO FIND, AND CAMERA WORDS ARE NOT IT.
 *    Playbook lesson 11 (measured on ToyBot snow-globe-world) says name the container plainly, say
 *    WHERE IN THE FRAME it sits, give the CROP as the counter-anchor. That is necessary here but not
 *    sufficient, because a snow globe and a bathtub differ in one decisive way: the snow-globe
 *    camera was PRESSED TO THE GLASS, so its crop and its camera were the same instruction, while a
 *    bathtub has an overwhelming shot-from-ABOVE prior that the crop does nothing about.
 *      - R1 used lesson 17's wording ("the water surface filling the whole frame and running off all
 *        four edges"). On a low-horizon path that clause IS a top-down instruction: a frame that is
 *        all water surface with no horizon is an overhead shot. 5 of 6 looked down into a tub.
 *      - R2 made the bath's rim the sea HORIZON and hoisted the whole spec to output-order position
 *        1. The clause then reached 6 of 6 prompts, up from 1 of 6 -- and flux STILL shot from above
 *        in 6 of 6. Camera words lose, exactly as lesson 3 says.
 *      - R3 named instead the two SURFACES THAT CANNOT EXIST IN A SHOT FROM ABOVE: every hull CUT BY
 *        THE WATERLINE with the water climbing it in a meniscus, and the bath's own enamel side
 *        curving up behind the fleet and cropped out of frame. That is what brought the camera down.
 *    So the generalised rule: for a container whose prior includes a standard viewing HEIGHT, the
 *    crop is not enough -- name a surface that is only visible from the height you want.
 *
 * 2. "ENAMEL WALL" IS A TILED-BATHROOM GENERATOR; "ENAMEL SIDE CURVING UP" IS NOT. R3 said "the
 *    bath's INNER ENAMEL WALL rises as a smooth white cliff" and one render answered with a fully
 *    tiled bathroom wall -- a large vertical white surface behind a bath IS a tiled wall to flux, and
 *    the template's own "no tiles" cannot negate it. Deleting the noun (lesson 12's move) fixed it:
 *    "the bath's own enamel side CURVING UP, a bare smooth white slope" was 0 of 6 on tiles.
 *
 * 3. THE FIRST-THIRD BUDGET IS ZERO-SUM, AND THIS PATH PROVED IT TWICE. Measured position of the
 *    first vessel noun: R1 word 97 (35% in), R2 word 183 (60% in), R3 word 10. R2 bought its framing
 *    by spending the hero's attention window and its content collapsed to generic duck piles; R4
 *    bought a matte finish the same way and its non-duck vessels rendered in only 3 of 6. With six
 *    axes and roughly 90 words of first-third budget, framing, material and fleet cannot all be paid
 *    for in the prefix. The material therefore lives in the SEEDS (every flotilla entry names its own
 *    mould seam, bite-dents, sun-fade and worn patch) plus ONE short template clause, never up front.
 *
 * 4. THE CAMERA IS HAND-AUTHORED HERE AND THE PATH DOES NOT CONSUME `sharedDNA.camera`. Lesson 4 of
 *    the snow-globe build: when the camera IS the path, a shared camera pool is a hijack, not a
 *    variety source. ToyBot's CAMERA_FRAMING is dry-surface centric ("drone-overhead establishing
 *    shot of the full kitchen counter") and an overhead shot of this scene is the exact failure mode.
 *    None of the six vantages is AXIAL either, because an axial camera on a line of similar hulls
 *    tiles them to a vanishing point (the acorn-boat-regatta corridor -- it still showed up in 3 of 6
 *    R1 renders from formation wording alone, which is why "in a column" and "single file" were
 *    purged from the fleet pool). `sharedDNA.scenePalette` is deliberately not consumed: ToyBot's
 *    200-entry palette pool would out-vote `sea_light`, this path's only defence against a white
 *    bathroom rendering grey.
 *
 * 5. THE CROSS-AXIS CONFLICT IS FILTERED STRUCTURALLY, NOT ASKED FOR IN PROSE. The snow-globe
 *    residual is explicit: a prose compatibility clause loses to a pool pick every time, and the fix
 *    is to tag and filter. The real conflict here is water state vs story beat -- "dead flat mirror
 *    calm" against "running before a breaking crest" is a contradiction no wording survives. The sea
 *    state is classified calm / rough / either by keyword, the moment pool by what it requires, and
 *    an incompatible moment is filtered out (and dropped entirely rather than forced). The first
 *    local dry run proved a ban-list too leaky and it became an allow-list; 0 conflicts in 40 dry
 *    combinations after.
 *
 * 6. TEXT PRIORS: a bath toy is a BRANDED object and a boat is the strongest hull-name prior in the
 *    fleet, so the plain-surface clause sits inside the required OUTPUT ORDER (lesson 2) AND inside
 *    the seeds (lesson 13). Every object whose SHAPE is itself text is DELETED rather than described
 *    (lesson 12): foam alphabet letters, foam numbers, bath books, thermometers, graduated measuring
 *    cups, numbered stacking cups, bottles, tubes, jars, tins. Result: 0 lettering in 24 renders.
 *
 * 7. ULTRA IS PINNED OUT on measured evidence -- 4 renders across R1/R2, 4 framing failures (shot the
 *    tub from outside every time, duplicated the tap once, produced both lowest-scoring frames).
 *    Same standing-exclusion class as lesson 6, with a camera height as the condition.
 *
 * RESIDUAL, and the ONE lever to pull next: the toys render FACTORY-FRESH AND GLOSSY in most frames
 * against "scuffed sun-faded well-chewed" present in every one of the 24 prompts -- adjectives lose
 * to the rubber-duck PRODUCT prior. R4 showed the counter-prior that works is a FINISH stated as a
 * surface ("gone matte and chalky, no shine left on it") and a named material tradition, ToyBot's own
 * Stage-O form that took tin-toy-parade to 4.9 -- but R4 bought it with prefix words and lost the
 * fleet. The next lever is therefore to spend the WORDS somewhere free: put the matte/chalky finish
 * into the FLEET SEEDS' own opening noun phrase, per entry, where lesson 13 says it sticks 9/9,
 * rather than into the prefix or the template. The 8-word anti-gloss clause now in the fleet block is
 * carried over from R4, where it worked on the vessels -- it has NOT been measured at R3 prefix
 * length. Second residual: the palette still reads pale cyan in roughly half the frames because
 * bathwater plus white enamel is a strong cool prior that `sea_light` reaches the prompt and loses
 * to; one fleet entry ("a dozen cobalt plastic fish") is monochrome by construction and produced the
 * build's one fully blue-on-blue frame, so it wants a second colour.
 */

const flotillas = require('../seeds/toybot_bath_flotilla.json');
const seaStates = require('../seeds/toybot_bath_sea_state.json');
const voyageMoments = require('../seeds/toybot_bath_voyage_moment.json');
const landmarks = require('../seeds/toybot_bath_landmark.json');
const seaLights = require('../seeds/toybot_bath_sea_light.json');
const seaLife = require('../seeds/toybot_bath_sea_life.json');

// HAND-AUTHORED, never generated (see decision 2). All six are the same shot — the camera down at
// the waterline, the water filling the frame — varied only in height and in which way the fleet
// falls away. Hero-agnostic, no posture, no time of day, and none of them looks straight down the
// fleet's line, because an axial camera on a line of similar objects tiles them to a vanishing
// point (the acorn-boat-regatta corridor).
const WATERLINE_VANTAGES = [
  'on the water among the toys, the fleet strung out wide across the frame and the bare enamel slope curving up behind them',
  'on the water with the nearest foam huge and soft across the bottom of the frame, the fleet crisp just behind it',
  'on the water and off to one side, the leading vessel close and large at one edge and the rest of the fleet spread away toward the other',
  'on the water close in on the leading vessel from a little off its bow, so it stands tall with the bare enamel slope curving up behind its shoulder',
  'on the water in the trough between two crests, the crest line stacked across the upper half of the frame',
  'on the water and slightly wide, every vessel from the nearest hull to the farthest readable across the frame',
];

// Decision 3 — the structural cross-axis filter. Classify by keyword rather than by a hand-tagged
// column so the pools stay plain string arrays (and so a regenerated pool is classified too).
const ROUGH_WATER =
  /\b(crest|crests|breaking|breaks|chop|swell|spray|flung|storm|tips over|leans hard|tilt|inclined|risen|whirlpool|churn)\b/i;
const CALM_WATER = /\b(dead flat|glass-still|mirror|motionless|calm|perfectly still|dead still)\b/i;
const MOMENT_NEEDS_CALM = /\b(mirror calm|motionless|stopped dead|perfect twin|hanging beneath)\b/i;
// A mirror calm is the strict case: almost every beat in the pool throws water about, so a calm
// roll ALLOW-LISTS rather than ban-lists. The first dry run proved a ban-list too leaky — "surfacing
// directly under the leader, water parting around both" matched no rough keyword and landed in a
// glass-still mirror. When nothing fits, the moment is dropped entirely, which is an honest outcome:
// a dead-calm sea with the fleet simply under way is a strong frame on its own.
const MOMENT_CALM_SAFE =
  /\b(mirror calm|motionless|stopped dead|perfect twin|hanging beneath|spinning slowly|faces entirely the wrong way|holding position|watching|dead still|becalmed)\b/i;

function waterClass(text) {
  const rough = ROUGH_WATER.test(text);
  const calm = CALM_WATER.test(text);
  if (rough && !calm) return 'rough';
  if (calm && !rough) return 'calm';
  return 'either';
}

function momentFits(moment, water) {
  if (water === 'calm') return MOMENT_CALM_SAFE.test(moment);
  if (water === 'rough') return !MOMENT_NEEDS_CALM.test(moment);
  return true;
}

module.exports = ({ vibeDirective, picker }) => {
  const fleet = picker.pickWithRecency(flotillas, 'bath_flotilla');
  const sea = picker.pickWithRecency(seaStates, 'bath_sea_state');
  const landmark = picker.pickWithRecency(landmarks, 'bath_landmark');
  const light = picker.pickWithRecency(seaLights, 'bath_sea_light');

  // 0.75 — the beat is where the joke lives, so it fires most of the time. The other ~25% are
  // pure fleet-and-sea, which is strong on its own (a line of ducks cresting a sud wave in hard
  // low light) and keeps the beat from feeling compulsory.
  let moment = null;
  if (Math.random() < 0.75) {
    const water = waterClass(sea);
    const eligible = voyageMoments.filter((m) => momentFits(m, water));
    // No fallback to the unfiltered pool on purpose — on a mirror calm an incompatible beat is
    // worse than no beat at all.
    if (eligible.length) moment = picker.pickWithRecency(eligible, 'bath_voyage_moment');
  }

  // 0.5 — an accent, not a second fleet. Off half the time so the fleet owns the frame.
  const creature = Math.random() < 0.5 ? picker.pickWithRecency(seaLife, 'bath_sea_life') : null;
  const vantage = picker.pickWithRecency(WATERLINE_VANTAGES, 'bath_vantage');
  // Trim to a word boundary — a directive cut mid-word reads as a corrupted instruction.
  const mood = vibeDirective.slice(0, 120).replace(/\s+\S*$/, '');

  return `You are a marine photographer shooting a fleet of bath toys crossing an ocean, for ToyBot. Real scuffed rubber and plastic toys in real bathwater, photographed from down at the waterline. Photoreal, cinematic, richly coloured, and played completely straight — this is a film about the sea that happens to be six inches deep, so the vessels and their crew are treated with total seriousness and nothing in the writing winks at it.

⚠️⚠️⚠️ THE FRAMING IS THE WHOLE POINT — TWO SURFACES THAT ONLY EXIST AT WATER LEVEL ⚠️⚠️⚠️
Say these two things and the camera height takes care of itself. FIRST: every hull is CUT BY THE WATERLINE, its lower half gone under, the water climbing it in a visible meniscus. SECOND: behind the fleet the bath's own enamel side CURVES UP and runs out of the top of the frame, a smooth bare white slope with nothing on it. That slope, plus one other cropped bath feature at a border, is all of the bath that reaches the picture. No room, no tiles, no window, no shelf, no towel, no person, no hand.
If the camera looks DOWN INTO a tub from above, or shows the whole tub with its far end, the render has FAILED — that is the snapshot everyone has already seen.

━━━ THE FLEET — the hero, and it opens the prompt ━━━
${fleet}
Every vessel is a well-used BATH TOY in real water: moulded hollow rubber and plastic GONE MATTE AND CHALKY with no shine left on it, a mould seam up the flank, sun-faded paint, bite-dents along the beak or fin, real water beaded on old rubber. The flanks and panels of every hull are one plain block of scuffed painted colour wearing at most ONE small simple painted shape — a stripe, a star, an anchor, a chevron, a painted eye.

━━━ THE COAST — the other cropped piece of bath, besides the rim horizon ━━━
${landmark}

━━━ THE LIGHT — it owns the palette, and it commits ━━━
${light}

━━━ THE SEA — bathwater as an ocean ━━━
${sea}
Foam and spray read per-bubble and per-drop, each one its own lit skin with its own shadow side.
${
  moment
    ? `
━━━ THE MOMENT — this is happening right now ━━━
${moment}
`
    : `
━━━ UNDER WAY ━━━
The fleet is simply making its passage: hulls riding the water, wakes spreading behind them, the voyage going on.
`
}${
    creature
      ? `
━━━ IN THE WATER WITH THEM ━━━
${creature}
`
      : ''
  }
━━━ THE CAMERA ━━━
${vantage}

━━━ MOOD ━━━
${mood}

━━━ WRITE THE FLUX PROMPT IN THIS ORDER ━━━
1. The lead vessel and its defining mass FIRST, then the rest of the fleet spread wide side to side, every hull cut by the waterline with the water climbing it — and one short clause saying every hull's flanks and panels are a plain block of scuffed painted colour wearing at most one small painted shape, because whichever surface you leave out is the one that comes back lettered.
2. The bath's own enamel side curving up behind them, bare and smooth, cropped out of the top of frame, plus the one other cropped bath feature and which border it sits on. Eight words each, no more.
3. The light: its direction, its two colours, and the one hard highlight.
4. The water, the foam and the steam, per-bubble and per-drop.${moment ? '\n5. The moment happening to the fleet.' : ''}${creature ? `\n${moment ? '6' : '5'}. The other creature in the water with them.` : ''}

Describe only what IS present — never write a negation into the prompt. No readable writing anywhere.

LENGTH IS THE LAST AND LOUDEST RULE: output ONLY the raw 95-125 word scene description, comma-separated phrases. Name the fleet, the bath edge, the light, the water and the moment, and STOP. No preamble, no titles, no headers, no markers, no bold labels, no "render as" suffixes.`;
};
