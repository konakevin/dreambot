/**
 * ToyBot sand-toy-beachworks (2026-09-23, SHADOW) — function-form, self-contained, mirroring
 * bath-toy-flotilla's and snow-globe-world's shape (loads its own seed JSONs; zero pools.js /
 * archetypes.js / archetype-templates.js touch, which is the right choice in a shared tree).
 *
 * WHY THIS PATH. Audited all 34 ToyBot builders and the gap is real on three axes at once.
 * (a) MATERIAL: every existing path's material is MANUFACTURED — clay, vinyl, tin, wood, printed
 * card, plush, die-cast, plastic. Not one is a natural granular material. (b) SUBJECT: not one path
 * is about BUILDING something; they photograph finished toys. (c) INVERSION: this is the only path
 * where the toys are the TOOLS and the thing they made is the hero. Coverage check: "sandcastle"
 * appears 7 times across the whole bot and every one is a prop inside somebody else's scene
 * (plush-storytelling, shortcake-scenes, claymation-story-beats); "beach" exists only as a
 * background setting in the shared staging / landscape pools (58 hits in toy-landscapes locations,
 * which is a real-world-spot pool). So neither sand, nor building, nor the inversion existed.
 *
 * THE DULL FAILURE THIS IS BUILT AGAINST. A sandcastle photographed from standing height on an open
 * beach is the snapshot everybody already has on their phone. The delight is treating a knee-high
 * pile of packed sand as a FEAT OF CIVIL ENGINEERING — a dam, a fortress, a canal system with water
 * running in it — shot with total gravity from down among it, with the bucket that cast every turret
 * lying sand-caked in the corner of the frame.
 *
 * THREE ROUNDS RUN (6 shadow renders each, 18 total, 0 errors, all flux-1.1-pro). R0 2.5 → R1 2.8
 * → R2 3.5. SHIPPED STATE IS R2. Best render of the build is R2 #3 at ~3.9: a cathedral-scale sand
 * fortress crossing the frame with a wet moat at its base and a hot-orange plastic bucket close in
 * the near corner, so the picture says "all of this came out of that". NOT a pass; the residual is
 * named at the bottom of this header.
 *
 * WHAT EACH ROUND MEASURED, one variable each:
 *   R0 — baseline. Corridor 5/6, beach crowd 1/6 (blurred sunbathers behind the wall), a tool
 *        visible 1/6, saturated colour 0/6, text 0/6. The toys were in 6 of 6 prompts and in 1 of 6
 *        pictures.
 *   R1 — THE CROSSWISE LAW (lesson 24), stated in the prefix, the framing block, the output order,
 *        the six vantages and 13 reworded pool entries. Beach crowd 1/6 → 0/6 and the round rose to
 *        2.8, but the corridor held at 5/6 with the law present in 6 of 6 emitted prompts and ZERO
 *        recession words anywhere in them. Per lesson 53 that distribution (spread, not
 *        concentrated, with the words present) means the feature's own prior is winning and the
 *        remaining fix is structural, not another clause.
 *   R2 — THE TOOL HOISTED INTO THE PREFIX, additively, nothing removed. This is the sharpest
 *        measurement of the build and it confirms lesson 43 plus the newest correction (the cheapest
 *        lever on something that will not render is the PREFIX, not the output order):
 *
 *          round  first TOOL noun in the emitted prompt   tool rendered
 *          R1     39%, 39%, 44%, 59%, 81%, 81%            1 of 6
 *          R2      5%,  5%,  5%,  5%,  5%,  6%            6 of 6
 *
 *        And it carried VIVID with it for free: a saturated primary-plastic colour went 0/6 → 4/6,
 *        because the one bright object in a frame of neutral sand is the bucket. Corridor also eased
 *        3/6 as the near bucket gives the frame a foreground anchor. Across all 18 renders: text 0,
 *        readable lettering 0, humans 0 (after R1), Sonnet refusals 0.
 *
 * Axes: WORKS (the built structure, the hero — leads the prompt) + MOMENT (the beat, actor named,
 * 0.8 gate) + WATER (the moat / the canals / the tide, the money shot) + LIGHT (owns the palette) +
 * TOOLS (the bucket and the shovel, finish stated as a SURFACE) + LIFE (a gull, a crab, tracks or a
 * toy garrison, 0.55 gate). Hand-authored vantages inline. Charm is a LAW inside works / tools /
 * moment rather than a seventh axis, on word budget.
 *
 * ── SEVEN LOAD-BEARING DECISIONS, EACH FROM A MEASURED LESSON ─────────────────────────────────
 *
 * 1. THE CONTAINER KNOB IN ITS BEACH FORM, AND THE CROP IS NOT ENOUGH. Playbook lesson 11 says a
 *    container is specified CONCRETE BUT CROPPED — name it plainly, say where in the frame it sits,
 *    give the crop as the counter-anchor. Necessary here and not sufficient, because a beach carries
 *    the same standard-viewing-HEIGHT prior a bathtub does, and the sibling bath path measured that
 *    exactly: its camera clause reached 6 of 6 prompts and flux still shot from above in 6 of 6
 *    (lesson 21). Camera words lose. So this path names TWO SURFACES THAT CANNOT EXIST IN A SHOT
 *    FROM ABOVE, in the prefix AND in output-order item 1: (a) the near wall's WET CUT FACE rising
 *    straight out of the bottom of the frame, cropped by both side edges, and (b) the tallest towers
 *    BREAKING THE LINE of the bright water behind them — nothing stands against the sky in a
 *    top-down shot. The sea is ONE band on a single border, never a horizon across the frame
 *    (`horizon` is purged from every pool; it is the snapshot's own signature).
 *
 * 2. THE FINISH IS A SURFACE IN THE SEEDS, NEVER AN ADJECTIVE AND NEVER IN THE PREFIX. This is the
 *    sibling's named-but-unspent lever and it is built in from round 0. bath-toy-flotilla put
 *    "scuffed sun-faded well-chewed" in ALL 24 of its prompts and the toys still came back
 *    factory-fresh and glossy, because adjectives lose to the moulded-plastic product prior; and its
 *    R4 fix bought the finish with PREFIX words and lost the hero's variety instead (first-vessel
 *    noun at 60% of the prompt vs 4%). So every `tools` entry OPENS on a named surface state, in its
 *    own first noun phrase, where lesson 13 measures a named surface sticking 9/9 — "gone matte and
 *    chalky with no shine left on it anywhere", "faded to pale salmon on its sun side only", "with
 *    sand ground permanently into every moulded seam", "the gloss scoured right off one flank" —
 *    rotated across the pool so no two entries lean on the same one. The prefix carries none of it.
 *
 * 3. THE LIGHT LAW LIVES IN THE PREFIX BECAUSE IT COSTS NOTHING IN VARIETY. The sibling's second
 *    residual was a pale-cyan palette in half its frames: bathwater plus white enamel is a strong
 *    cool prior that its light axis reached the prompt and lost to. A beach at midday is the same
 *    class of prior — bleached and low-contrast — and it is the VIVID half of the bar. Since the law
 *    is IDENTICAL on every render (low raking sun, every ridge's shadow long, wet sand near-black
 *    against pale dry sand) it is free to put in the prefix, where lesson 43 measures content at
 *    5-10% of the prompt rendering 6 of 6. The `sand_light` axis then owns the COLOURS, and every
 *    entry must pit two named colours against each other with at least one saturated. That is
 *    lesson 21's constructive half: each law goes in the layer where it is cheapest.
 *
 * 4. THE PREFIX CARRIES AN ACTIVE VERB. Measured this run on another path: adding a verb in front of
 *    the subject clause — additively, nothing removed — took a beat that would not render from 0 of
 *    12 to 6 of 6, and a prefix describing a static pose gets you a static pose. So the prefix says
 *    "sand giving way or water filling right now", which is compatible with every roll in the moment
 *    pool and pre-loads the beat before Sonnet's text begins. It backs up output-order item 2.
 *
 * 5. THE ACTOR IS NAMED AND IS NEVER A PERSON. A named action with no named actor renders the body
 *    part alone, measured twice in the 33-path run (a giant disembodied hand and forearm). A bucket
 *    mid-pour with no hand is exactly that trap, and a real person on a beach is decision 1's
 *    failure. So this path is deliberately figureless of PEOPLE while staying full of cast: every
 *    `moment` entry opens on its actor and the actor is the water, a named part of the structure, a
 *    beach animal, or a tool as the agent of its own result ("the upturned bucket stands beside the
 *    perfect turret it has just left behind"). Toy figures ARE allowed and are ~2 in 5 of the `life`
 *    pool, because ToyBot is not a no-humans bot (Stage-O lesson 4) and a plastic soldier holding a
 *    sand rampart against the incoming tide is the path's own joke played completely straight. Every
 *    toy is "it", never "he" or "his" — a pronoun is the fastest way to turn a moulded figure into a
 *    real person.
 *
 * 6. THE TEXT PRIOR IS SEVERE AND THE ANSWER IS AREA, NOT WORDING. A bucket and a shovel are BRANDED
 *    objects with moulded lettering, and a sand mould is nothing but embossed text. MangaBot
 *    game-center-arcade measured the limit of describing surfaces safely (lesson 51): filling one
 *    surface MIGRATES the lettering to the nearest unfilled strip, so the rate barely moves while
 *    prominence falls as the available area shrinks — and CROP is itself a text lever (lesson 52),
 *    because a receding rank of objects shows many labelled faces while a cropped near one shows
 *    two. So: the count of visible plastic faces stays LOW (one tool per entry, two at most, never a
 *    rank), every entry crops / turns away / buries part of it, the whole MOULD class is DELETED
 *    rather than described (lesson 12 — only its RESULT is allowed, a turret cast from a bucket), and
 *    THE SAND IS THE POSITIVE FILL: "a crust of drying sand up one side", "wet sand packed into the
 *    ribs under its rim". That one clause is simultaneously the anti-text fill, the anti-gloss finish
 *    and the charm — lessons 14 and 26 merged, where the anti-text form has to carry the interest
 *    itself. It sits inside the required OUTPUT ORDER, because a law that must appear on every render
 *    reaches ~20% of prompts from a seed tail and 100% from the order (lesson 22).
 *
 * 7. THE JARGON AUDIT RAN ON THE TITLE FIRST (lesson 47) AND THE TITLE FAILED. "BEACHWORKS" reads to
 *    a layperson — and to CLIP — as industrial dockworks or roadworks, and as a compound trade name
 *    it is a text prior on the one path whose hardest defect is lettering. It is therefore an
 *    INTERNAL key only: the word "works" appears in no layer that reaches Flux. Banned with it, each
 *    because a layperson pictures something else: `mould` (mildew), `spade` (the playing-card suit —
 *    "shovel" throughout), `bank` (a savings bank), `channel` (a TV channel), `revetment` (no prior
 *    at all, the KODAMA trap), `keep` (the verb), `bailey` (a surname), `sluice`, `berm`,
 *    `crenellation`. A first-draft sweep then caught Sonnet re-deriving `berm` and `banks` anyway,
 *    which is lesson 41 confirmed at MVP-25 — the ban in the recipe is a nudge, the sweep on the
 *    output is the control.
 *
 * 8. THE CROSS-AXIS CONFLICT IS FILTERED STRUCTURALLY, NOT ASKED FOR IN PROSE. The snow-globe
 *    residual is explicit: a prose compatibility clause loses to a pool pick every time. The real
 *    conflict here is WATER STATE against BEAT — "the moat stands dead flat, brimming exactly to its
 *    lip" against "the water breaches the dam and races the length of the canal" is a contradiction
 *    no wording survives. So the water pool is classified still / moving / either by keyword, the
 *    moment pool by what it requires, and an incompatible moment is DROPPED rather than forced (a
 *    dead-calm moat with a gull standing in the top court is a strong frame on its own). Classifying
 *    by keyword rather than a hand-tagged column means a regenerated pool is classified too.
 *
 * ── RESIDUALS, AND THE ONE LEVER TO PULL NEXT ─────────────────────────────────────────────────
 * 1. THE TOYS STILL RENDER FACTORY-FRESH AND GLOSSY, 6 of 6 — the sibling's residual, inherited, and
 *    now with its cause MEASURED rather than guessed. The finish IS stated as a surface in every
 *    seed's own opening noun phrase (decision 2, the sibling's named lever, built in from round 0),
 *    and it still loses, because the surface clause lands at 86-91% of the emitted prompt or is
 *    dropped altogether — lesson 43's dead zone, the same place the tool sat before R2 moved it. So
 *    the seed-level lever was necessary and is not sufficient: the finish needs the same treatment
 *    the object just got. THE NEXT LEVER IS THEREFORE THE PREFIX'S OWN BUCKET CLAUSE — it currently
 *    reads "a plastic bucket cropped close in the near corner of the frame"; make it "a plastic
 *    bucket gone matte and chalky with no shine left on it, cropped close in the near corner of the
 *    frame". Six words, additively, in the 5% band that just took the object 1/6 → 6/6. Watch the
 *    sibling's trap while doing it: its R4 bought the finish with prefix words and lost its hero's
 *    variety, so the finish goes on the PREFIX'S OWN bucket only and the seeds keep theirs.
 * 2. THE CORRIDOR, 3 of 6 — eased from 5/6 but not solved, and the law is not the problem: it sits in
 *    6 of 6 emitted prompts with zero recession words alongside it. In R1 and R2 the corridor is
 *    built by the WATERWAY, not the wall — every corridor frame has a canal or moat running away up
 *    the middle, and the crosswise clause attaches to the wall. The next lever is to extend it to the
 *    water, in the same three layers: the prefix's "walls and canals" becomes "walls and a canal
 *    crossing it from side to side", the water axis states "the canal crosses the picture from the
 *    left edge to the right edge, both ends running out of frame" (the exact form lesson 24 measured
 *    at 2/5 → 0/5 and held 0 of 20), and output-order item 3 says the same. If that still leaves it,
 *    lesson 33 applies — a correctly ordered, seed-reinforced element that renders wrong is a MODEL
 *    fact, and ToyBot's two-model lock means that becomes Kevin's call, not a prompt round.
 * 3. NO LEGIBLE STORY BEAT in any of the 18 frames, despite the beat sitting at output-order item 2
 *    and an active verb in the prefix. The beats that actually rolled were the quiet ones (paw
 *    prints, a shrimp turning, a shell pressed in) rather than the dramatic ones (a breach, a
 *    collapse), which reads like recency-picker luck at 25 entries against a 6-render round rather
 *    than a defect — but it is unmeasured either way. Cheapest probe: weight the water-arriving and
 *    structure-failing families up, or run one batch with the moment gate at 1.0.
 * 4. The emitted prompt medians 303 words against a stated 95-125 cap, i.e. ~2.5x. Lesson 18's
 *    refinement says a cap that already exists is not the lever — deleting template prose and
 *    output-order items is. Worth doing only because it would move the finish clause up the prompt,
 *    which is residual 1's lever by another route.
 *
 * MODEL: flux-1.1-pro ONLY, ultra pinned out from round 0 — and this is inherited measurement, not a
 * fresh guess. The sibling bath path put 4 renders through ultra on a path whose identity is a CAMERA
 * HEIGHT and got 4 framing failures (shot the tub from outside every time, plus both of the build's
 * lowest-scoring frames), which extended lesson 6's standing exclusion from a lighting condition to a
 * camera-height condition. This path's identity is the same kind of condition, so spending 3 of every
 * 6 renders on an arm already measured on the same condition would be a waste of the round (and
 * lesson 42 says a 3-per-arm split hands you a confident wrong verdict anyway).
 */

const works = require('../seeds/toybot_sand_works.json');
const moments = require('../seeds/toybot_sand_moment.json');
const waters = require('../seeds/toybot_sand_water.json');
const lights = require('../seeds/toybot_sand_light.json');
const tools = require('../seeds/toybot_sand_tools.json');
const life = require('../seeds/toybot_sand_life.json');

// HAND-AUTHORED, never generated (decision 1). ToyBot's shared CAMERA_FRAMING pool is dry-surface
// and figure centric ("drone-overhead establishing shot of the full kitchen counter") and an
// overhead shot of this scene is the exact failure mode — when the camera IS the path, a shared
// camera axis is a hijack, not a variety source (snow-globe lesson 4). All six are the same shot,
// the camera down on the sand among the structure, varied only in height and in which way the
// structure falls away. NONE of them looks down a line of turrets, because an axial camera on a rank
// of similar objects tiles them to a vanishing point (the acorn-boat-regatta corridor) — every one
// is crosswise, per lesson 24.
// R1 REWRITE — every vantage is now explicitly CROSSWISE. R0 measured the corridor in 5 of 6
// renders, and two of the six originals were axial by construction: "in the bottom of the canal
// itself, its two cut sides rising out of the frame on both sides" is a stand-in-the-corridor
// instruction, and "the rest of the structure spread away toward the other" is a recession. Both
// produced the round's two worst frames (a dead-centre slot canyon and a pebble road running to a
// vanishing point). Lesson 53's test says purge a CONCENTRATED class rather than add words, and
// this class concentrates perfectly: the camera pool is six hand-written entries and two of them
// were the instruction.
const SAND_LEVEL_VANTAGES = [
  'down on the sand in among the structure, the near wall crossing the picture from the left edge to the right edge with both its ends cropped, its wet cut face filling the lower half of the frame',
  'down on the sand, the near wall running from one side edge of the frame to the other and the towers ranged abreast along its top, all of them cropped at both sides',
  'down on the sand and off to one side, the nearest turret close and large at one edge of the frame and the wall running level from it straight out of the opposite edge',
  'down on the sand very low indeed, the wet floor of the moat lying bright right across the bottom of the frame from side to side and the wall rising straight up out of it',
  'down on the sand a little back from the outer wall, so the wall crosses the picture edge to edge and the towers behind it show only their tops above its crest',
  'down on the sand close in under the tallest tower from a little off to its side, so it stands tall against the bright water band with its wet flank filling one side of the frame and the wall running out of the other',
];

// Decision 8 — the structural cross-axis filter. Keyword classification, so a regenerated pool is
// classified too and the pools stay plain string arrays.
const WATER_STILL =
  /\b(dead flat|dead still|so still|perfectly still|motionless|standing level|stands level|brimming|glass|mirror|down to a dark stripe|drying from|sinking into the sand|perfectly clear|becalmed)\b/i;
const WATER_MOVING =
  /\b(runs fast|running fast|running dark|falling|pours|pouring|draining|drains|comes in|coming in|breaking|breaks|riding in|pushing|pushes|advancing|seeps|seeping|retreating|cutting|climbing|arriving|arrives|rising)\b/i;
// A dead-still water roll is the strict case, and the FIRST version of this filter was an
// allow-list (the form the sibling path converged on, because on a bathtub there is exactly ONE
// body of water and almost every beat disturbs it). The local dry run showed that is the wrong
// shape HERE and caught it before a single render: this structure has a moat, canals, linked pools
// AND the sea, so "the moat stands dead flat" and "the water breaches the dam and races down the
// canal" are two different bodies and not a contradiction at all. The allow-list blocked 12 of 25
// moments, four of them wrongly (a gull standing on one foot, a shovel holding a gap closed, a
// rake's grooves ending at the water, a dinosaur with water round its base). So it is a tight
// BAN-LIST instead: only a beat that acts on the WHOLE SYSTEM's water level, or on the moat
// specifically, can contradict a moat stated as dead flat or drained away.
const MOMENT_CONTRADICTS_STILL =
  /\b(breaches the dam|moat takes it|the moat has filled|filling in seconds|running backwards|arrives down two canals|meet head-on|first tongue|first reach|weeping in four places)\b/i;

function waterClass(text) {
  const still = WATER_STILL.test(text);
  const moving = WATER_MOVING.test(text);
  if (still && !moving) return 'still';
  if (moving && !still) return 'moving';
  return 'either';
}

function momentFits(moment, water) {
  if (water === 'still') return !MOMENT_CONTRADICTS_STILL.test(moment);
  return true;
}

// ── THE SINGLE-OBJECT FILTER, also found by the dry run ───────────────────────────────────────
// Three axes can legitimately put a physical OBJECT in the frame — the tool, the beat (when the
// actor is a tool) and the inhabitant (a toy figure) — and the dry run produced a combo where the
// beat read "the upturned bucket stands beside the turret it has just surrendered" while the tools
// axis read "a postbox-red bucket sits upturned at the base of a fresh turret". Two near-identical
// buckets, which is both a duplication AND double the branded plastic faces in shot (decision 6:
// the count of manufactured faces is the text lever). Prose cannot fix this — the snow-globe build
// measured a compatibility clause losing to a pool pick every time — so it is filtered by class:
// roll the tool first, then exclude any beat naming the same class of object, then exclude any
// inhabitant naming a class the tool or the beat already used.
const OBJECT_CLASSES = [
  /\bbuckets?\b/i,
  /\bshovels?\b/i,
  /\brakes?\b/i,
  /\bsieves?\b/i,
  /\bwatering can\b/i,
  /\bspoons?\b/i,
  /\bplanks?\b/i,
  /\btwine\b/i,
  /\bpennants?\b/i,
  /\bdiggers?\b/i,
  /\bsoldiers?\b/i,
  /\bknights?\b/i,
  /\bdinosaurs?\b/i,
  /\bdivers?\b/i,
  /\bcows?\b/i,
  /\bgulls?\b/i,
  /\bcrabs?\b/i,
  /\boystercatchers?\b/i,
  /\bsandpipers?\b/i,
  /\bshrimps?\b/i,
];

function classesIn(text) {
  const out = new Set();
  OBJECT_CLASSES.forEach((re, i) => {
    if (re.test(text)) out.add(i);
  });
  return out;
}

function sharesClass(text, used) {
  for (const i of classesIn(text)) if (used.has(i)) return true;
  return false;
}

module.exports = ({ vibeDirective, picker }) => {
  const structure = picker.pickWithRecency(works, 'sand_works');
  const water = picker.pickWithRecency(waters, 'sand_water');
  const light = picker.pickWithRecency(lights, 'sand_light');
  const tool = picker.pickWithRecency(tools, 'sand_tools');

  // The tool is rolled FIRST so it owns its object class, and every later axis defers to it.
  const used = classesIn(tool);

  // 0.8 — on this path the beat is the difference between a feat of engineering and a pile of sand,
  // so it fires nearly always. The other ~20% are pure structure-and-water, which is strong on its
  // own (a mirror-flat moat doubling a row of turrets in hard low light) and keeps the beat from
  // feeling compulsory.
  let moment = null;
  if (Math.random() < 0.8) {
    const cls = waterClass(water);
    const eligible = moments.filter((m) => momentFits(m, cls) && !sharesClass(m, used));
    // No fallback to the unfiltered pool on purpose — on a dead-flat moat an incompatible beat is
    // worse than no beat at all, and a second bucket is worse than one.
    if (eligible.length) moment = picker.pickWithRecency(eligible, 'sand_moment');
    if (moment) classesIn(moment).forEach((i) => used.add(i));
  }

  // 0.55 — an accent and the picture's best ruler, not a second cast. Off nearly half the time so
  // the structure owns the frame.
  let inhabitant = null;
  if (Math.random() < 0.55) {
    const eligible = life.filter((l) => !sharesClass(l, used));
    if (eligible.length) inhabitant = picker.pickWithRecency(eligible, 'sand_life');
  }
  const vantage = picker.pickWithRecency(SAND_LEVEL_VANTAGES, 'sand_vantage');
  // Trim to a word boundary — a directive cut mid-word reads as a corrupted instruction.
  const mood = vibeDirective.slice(0, 120).replace(/\s+\S*$/, '');

  return `You are a documentary photographer shooting a vast half-built sandcastle as a great public work, for ToyBot. Real packed sand, real worn beach toys, real low sun, photographed from down at sand level in among it. Photoreal, cinematic, richly coloured, and played completely straight — this is a film about a feat of engineering that happens to be knee-high, so the structure and its tools are treated with total gravity and nothing in the writing winks at it.

⚠️⚠️⚠️ THE FRAMING IS THE WHOLE POINT — THREE THINGS, AND THEY DO ALL THE WORK ⚠️⚠️⚠️
Say these three and the camera takes care of itself. FIRST, CROSSWISE: the near wall CROSSES THE PICTURE FROM THE LEFT EDGE TO THE RIGHT EDGE and BOTH ITS ENDS RUN OUT OF FRAME, cropped — it never runs away from the camera, never tapers into the distance, and nothing in this picture is ranged one behind another going back. Anything long — a wall, a canal, a trench, a ramp, a spillway, a road of pebbles — lies ACROSS the frame from one side edge to the other. SECOND: that wall's WET CUT FACE rises straight out of the BOTTOM of the frame, its packed layers and shovel-grooves showing. THIRD: the tallest towers stand up against a BRIGHT BAND OF WATER lying along the TOP edge, breaking that band with their tops.
Write "band" for the sea, every time. It is a band along one border and it is never a horizon, never a shoreline stretching away, never a distant view.
If the camera looks DOWN at a sandcastle from standing height, if the structure tapers away to a far point, or if any open beach is visible past it, the render has FAILED — that is the snapshot everyone already has. No room, no towel, no deckchair, no parasol, no promenade, no pier, no crowd, no person, no hand.

━━━ THE STRUCTURE — the hero, and it opens the prompt ━━━
${structure}
${
  moment
    ? `
━━━ WHAT IS HAPPENING RIGHT NOW — and the thing doing it is named first ━━━
${moment}
`
    : `
━━━ UNDER CONSTRUCTION ━━━
The work is simply standing: the walls holding, the water lying where it was let in, the sand drying pale along the tops.
`
}
━━━ THE WATER ━━━
${water}

━━━ THE LIGHT — it owns the palette, and it commits ━━━
${light}

━━━ THE TOOLS THAT BUILT IT ━━━
${tool}
${
  inhabitant
    ? `
━━━ LIVING ON IT ━━━
${inhabitant}
`
    : ''
}
━━━ THE CAMERA ━━━
${vantage}

━━━ MOOD ━━━
${mood}

━━━ WRITE THE FLUX PROMPT IN THIS ORDER ━━━
1. The biggest sand mass and what it is made of FIRST — and in the same breath, that it CROSSES THE PICTURE FROM THE LEFT EDGE TO THE RIGHT EDGE with both ends running out of frame, its wet cut face rising out of the bottom of the frame. Then the rest of the system with its counts kept high, ranged ABREAST across the frame rather than back into the distance, and the tallest towers standing up against a bright BAND of water along the top edge.
2. What is happening right now, with the thing doing it named first.
3. The water: where it is and what its surface is doing.
4. The light: its low angle, its two colours, its one hard highlight, and what stays dark.
5. The bucket or shovel: its worn surface and where it sits in the structure — and one short clause saying its flat plastic faces are caked with drying sand, turned away, or cropped by the frame, because whichever face you leave bare is the one that comes back lettered.${inhabitant ? '\n6. The creature or figure living on it, and where it sits in the frame.' : ''}

Describe only what IS present — never write a negation into the prompt. No readable writing anywhere.

LENGTH IS THE LAST AND LOUDEST RULE: output ONLY the raw 95-125 word scene description, comma-separated phrases. Name the structure, the beat, the water, the light and the tool, and STOP. No preamble, no titles, no headers, no markers, no bold labels, no "render as" suffixes.`;
};
