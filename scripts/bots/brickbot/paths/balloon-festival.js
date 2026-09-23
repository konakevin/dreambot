/**
 * BrickBot balloon-festival — the MASS ASCENSION path (2026-09-23).
 *
 * A hot-air balloon festival built entirely in brick: two dozen or more
 * balloons rising off a mown plate-mosaic field at every height, each one
 * identified by its PATTERN or by its SHAPE, a minifigure crowd on the grass
 * as the ruler that makes them read as enormous.
 *
 * ── ⚠️ NEVER WRITE "ENVELOPE" FOR THE BAG. IT IS THE ONE THING THAT KILLS
 *    THIS PATH, AND IT IS MEASURED ────────────────────────────────────────
 * "Envelope" is what a balloonist calls the fabric bag, and it is a
 * catastrophic prompt token: Flux's prior for the word is a PAPER MAIL
 * ENVELOPE. Round 0 shipped with the ballooning jargon throughout (152
 * "envelope" tokens across the pools against 13 "balloon" tokens) and the six
 * stored prompts split perfectly against their six renders:
 *
 *   "balloon" appears ≥1×  →  1 of 1 rendered the fleet (that render scored 4.3)
 *   "balloon" appears 0×   →  0 of 5 rendered a single balloon
 *
 * and two of those five rendered a CARPET OF LITERAL PAPER ENVELOPES with the
 * shaped balloon sitting on the ground as a brick sculpture beside them — an
 * owl in a mountain of mail, and a castle turret with two knights in it. So
 * this is not ambiguity, it is a confident wrong prior, and one occurrence of
 * the right word was the whole difference. Pools and template now carry 0
 * "envelope" tokens and every fleet entry leads with "hot-air balloons"
 * (plain "balloon" alone still has a party-balloon prior, which this bot's own
 * theme-park pools carry 67 tokens of). If a future reword reintroduces the
 * word, the path renders stationery.
 *
 * ── THE GAP (verified against the live roster, not assumed) ───────────────
 * BrickBot's 18 active paths are space / pirates / fantasy-castle / forest /
 * aquatic / winter / landscape / lego-landscapes / theme-park / western /
 * mech / macro-display / girly / crazy-islands / lego-city / lego-trains /
 * haunted-brick / airfield-biplanes. Two findings:
 *   • The "no crowd-event register" thesis is only HALF right — `theme-park`
 *     is already a crowd path (105 attraction entries, 42 crowd_action). But
 *     its subject is a RIDE: a fixed machine bolted to the ground.
 *   • The real gap is that NOTHING ON THIS BOT PUTS ITS MASS IN THE SKY. Every
 *     path's hero sits on the ground or in a room. `airfield-biplanes` flies,
 *     but its hero is ONE machine. And no path's subject is a mass of colour:
 *     "balloon" appears 25× in theme_park_scene_life and 42× in
 *     theme_park_crowd_action, every one a party balloon, while hot-air
 *     balloons exist only as tiny background accents (3 in airfield_field_event,
 *     1 in landscape_scale_prover). A sky full of saturated colour is a picture
 *     this bot has never taken.
 *
 * ── AXES: 8 always-on + 1 conditional ────────────────────────────────────
 *   • balloon_fleet   — ★ THE MONEY SHOT. The massed sky. Leads the prompt,
 *                       because the fleet IS the hero mass of this path.
 *   • hero_balloon    — the one near envelope, huge in frame. THE CLEVER AXIS:
 *                       about half are SHAPED (a bee, a dragon head, a teapot,
 *                       an owl, a carp, a mushroom). Always carries its basket
 *                       with minifigures in it — that basket is the ruler.
 *   • festival_moment — the story beat, sits at OUTPUT-ORDER POSITION 3 and
 *                       always names its ACTOR as a whole figure.
 *   • launch_field    — the all-brick stage, carrying the CROSSWISE LAW.
 *   • ground_crowd    — the scale ruler: many small figures, height pinned
 *                       against something welded to the scene.
 *   • festival_light  — ★ owns time of day + light direction + the colour of
 *                       the AIR. There is deliberately NO palette axis (see
 *                       the gen script header): colour here comes from the
 *                       envelopes, so a palette pool would contradict the
 *                       rolled fleet, and fusing the two buys back a slot of
 *                       first-third word budget.
 *   • build_technique — THE ANTI-PHOTOREAL LEVER (same role water_build_technique
 *                       / snow_ice_build_technique play on BrickBot's other
 *                       drift-prone paths). An envelope is a huge smooth curved
 *                       fabric surface, which is exactly what photoreal-drifts.
 *   • camera_framing  — HAND-AUTHORED, off-axis by construction. On a LEGO-
 *                       photography bot an AXIAL or PLAN-VIEW camera entry is a
 *                       hard-fail GENERATOR that out-votes every anti-symmetry
 *                       mandate in the template (airfield-biplanes: every hard
 *                       fail across four batches traced to 3 of 25 entries).
 *                       The fix is purging entries, so this pool has none.
 *   • festival_event  — 50%-gated environmental beat. OBJECTS, AIR AND ANIMALS
 *                       ONLY, so it can never compete with festival_moment for
 *                       the render's one human story beat.
 *
 * ── THE THREE TRAPS, and where each law lives ────────────────────────────
 *  1. A BALLOON ENVELOPE IS THE STRONGEST LETTERING MAGNET AVAILABLE — a huge
 *     blank curved surface, and real balloons carry sponsor logos, so that is
 *     the model's prior. Beaten by merging the anti-text rule and the make-it-
 *     vivid rule into ONE clause (an envelope is identified by its PATTERN or
 *     its SHAPE, panels smooth unmarked brick carrying only colour), placed in
 *     the required OUTPUT ORDER (a law appended to seed tails reaches ~20% of
 *     prompts; the output order takes it to 100%) AND inside the seeds (a
 *     surface named in a seed is clean 9/9; named only in a template it is a
 *     coin flip). Text-SHAPED objects — signs, boards, banners, pennants,
 *     flags — are DELETED from every layer, never described.
 *  2. SCALE AND COUNT — a low count is the giant-object generator, so the
 *     fleet's floor is TWO DOZEN stated as a number, with the height spread
 *     named and a ruler WELDED to the scene (the crowd, the basket rim, a
 *     trailer wheel). Massing words that render as one impossible object
 *     (tower / column / stack / pyramid / arch) are banned for the fleet.
 *  3. THE CORRIDOR — a launch field is a flat linear stage, and a flat linear
 *     stage tiles copies to a vanishing point. Beaten by the CROSSWISE LAW in
 *     all three places that reach Flux: template rule 1, every launch_field
 *     seed, and output-order item 1.
 *
 * ── WIDE SUBJECT → DEEP-FOCUS PREFIX (decided on measurement) ────────────
 * This path REQUIRES the `promptPrefixByPath` deep-focus string. BrickBot's
 * `photography` medium fragment contains "natural bokeh", and airfield-biplanes
 * measured what happens without the override: 4 of 6 first-batch renders
 * collapsed to a hero-on-bokeh product shot with the setting an unreadable
 * smear, while the brick signal held on all 6 anyway. A smeared or sparse sky
 * deletes this path's entire identity, so the prefix is not optional here. The
 * tilt-shift the prefix trades away is Flux's "everything is brick" signal, so
 * the template's brick block names every drift surface (turf, mist, cloud,
 * water, foliage, the envelope itself) as a named part.
 *
 * ── FILE SHAPE ───────────────────────────────────────────────────────────
 * Deliberately a FUNCTION path, not the declarative `{archetype, pools}` shape
 * the bot's other axis paths use. A declarative path resolves its pools through
 * `bot.poolByName` → `pools.js`, and its template through `archetype-templates.js`
 * — three shared single-writer files. This path loads its own seeds and carries
 * its own template, so merging it touches ONLY index.js.
 *
 * Pools: scripts/bots/brickbot/seeds/brickbot_balloon_*.json (9 × 25, MVP).
 * Gen:   scripts/gen-brickbot-balloon-pools.js (8 recipes; camera hand-authored).
 */

const fs = require('fs');
const path = require('path');

const SEEDS = path.join(__dirname, '..', 'seeds');
const load = (name) => JSON.parse(fs.readFileSync(path.join(SEEDS, `${name}.json`), 'utf8'));

const POOLS = {
  fleet: load('brickbot_balloon_fleet'),
  hero: load('brickbot_balloon_hero'),
  moment: load('brickbot_balloon_moment'),
  field: load('brickbot_balloon_field'),
  crowd: load('brickbot_balloon_crowd'),
  light: load('brickbot_balloon_light'),
  build: load('brickbot_balloon_build'),
  camera: load('brickbot_balloon_camera_framing'),
  event: load('brickbot_balloon_event'),
};

const EVENT_GATE = 0.5;

// ── CROSS-AXIS COMPATIBILITY, ENFORCED STRUCTURALLY ──────────────────────
// A prose compatibility clause in a template loses to a pool pick every time
// (measured: a harbour rowboat launched in a desert against an explicit "adapt
// or drop the moment" block). The documented fix is to require the setting a
// pick needs and filter against what actually rolled — a filter cannot be
// paraphrased away. A local brief dry-run caught the live case before any
// render was spent: "a farmer mid-shout at an envelope settling into his
// HEDGEROW while brick COWS bolt" rolled against a SAVANNA floor with acacia.
// Each rule is [what the pick implies, what the rolled stage must supply].
const MOMENT_NEEDS = [
  [
    /hedgerow|\bhedge\b/i,
    /hedgerow|\bhedge\b|meadow|pasture|field|lane|dale|moor|stubble|vineyard|orchard|paddock|park|fen/i,
  ],
  [
    /\boaks?\b|\btrees?\b|branches|treeline|copse/i,
    /oak|tree|forest|poplar|cypress|willow|\bfir\b|blossom|orchard|treeline|karst|acacia|park|copse|wood|hedgerow/i,
  ],
  [
    /\bcows?\b|cattle|livestock|\bsheep\b|\bgoats?\b/i,
    /meadow|pasture|farm|dale|moor|stubble|vineyard|orchard|paddock|fen|savanna|clearing|valley/i,
  ],
  [
    /\bpond\b|lagoon|\bpuddles?\b|\bstream\b/i,
    /water|lake|\bsea\b|trans-blue|\bfen\b|paddy|broads|shore|coast|river|lagoon|caldera/i,
  ],
];
// A camera that can only exist while a balloon is still slack needs the fleet
// or the hero to actually be in that state. ⚠️ These two regexes are coupled to
// the literal wording of camera entries #5 and #16 — a pool reword that breaks
// the match silently disables the filter, which is why the wording is quoted
// here: "From inside a half-inflated balloon" / "behind a folded-up balloon on
// the grass".
const CAMERA_NEEDS = [
  [
    /half-inflated balloon|folded-up balloon on the grass/i,
    /half-?inflat|part-?swollen|slack|swelling|flat on the grass|lie flat|sleeves|being inflated|crouch on the grass|pale and slack/i,
  ],
];

function pickCompatible(pool, slot, picker, rules, context, tries = 8) {
  let chosen = picker.pickWithRecency(pool, slot);
  for (let i = 0; i < tries; i++) {
    const bad = rules.some(([needs, supplies]) => needs.test(chosen) && !supplies.test(context));
    if (!bad) return chosen;
    chosen = picker.pickWithRecency(pool, slot);
  }
  return chosen; // exhausted — ship the last pick rather than fail a render
}

module.exports = function balloonFestival({ vibeDirective, picker }) {
  const pick = (key, slot) => picker.pickWithRecency(POOLS[key], slot);

  // The stage rolls FIRST, so the moment and the camera can be filtered
  // against what it actually supplies.
  const field = pick('field', 'launch_field');
  const fleet = pick('fleet', 'balloon_fleet');
  const hero = pick('hero', 'hero_balloon');
  const moment = pickCompatible(POOLS.moment, 'festival_moment', picker, MOMENT_NEEDS, field);
  const crowd = pick('crowd', 'ground_crowd');
  const light = pick('light', 'festival_light');
  const build = pick('build', 'build_technique');
  const camera = pickCompatible(
    POOLS.camera,
    'camera_framing',
    picker,
    CAMERA_NEEDS,
    `${fleet} ${hero}`
  );
  const event = Math.random() < EVENT_GATE ? pick('event', 'festival_event') : null;

  const eventSection = event
    ? `
━━━ FIELD EVENT (a secondary beat — it amplifies the moment, it never eclipses it) ━━━
${event}
`
    : '';

  const brief = `You are a LEGO MOC photographer and AFOL convention judge writing a BALLOON FESTIVAL diorama description for BrickBot. Output is ONE comma-separated phrase string for Flux. No preamble, no labels, no bullets, no ━━━ markers, no **bold**, no numbered output. Single paragraph.

━━━ THE BAR — PLAYFUL, ADVENTUROUS, VIVID, BEAUTIFUL, CLEVER ━━━
A Bricklink champion's mass-ascension diorama at a LEGO World convention, and a frame someone would screenshot. Something is HAPPENING and something is REACTING to it. One clever charm detail the eye finds on second look. A tidy field with a few tasteful balloons over it is a failure.

━━━ RULE 1 — THE SKY FULL OF HOT-AIR BALLOONS IS THE SUBJECT, AND THE FIELD CROSSES THE PICTURE ━━━
The fleet is the hero of this frame, so it leads the prompt and it fills the sky: two dozen or more brick-built HOT-AIR BALLOONS at genuinely different HEIGHTS and distances, the nearest huge and cropped by the frame, the middle ones whole and readable, the farthest bright specks high and small. Always write the words HOT-AIR BALLOON or BALLOON for these, every single time — the balloonist's own word for the fabric bag reads as stationery to the image model, and when it appears the balloons vanish from the picture entirely. They sit above a field that CROSSES THE PICTURE FROM THE LEFT EDGE TO THE RIGHT EDGE, its grass filling the near part of the frame, its far treeline or ridge a BAND ACROSS THE MIDDLE of the frame, and both ends of the field running out of frame. Everything in the frame is off the centre line and unbalanced — the near balloon cropped by one side, the furniture gathered to one side, one figure near and another further back.

━━━ RULE 2 — A BALLOON IS KNOWN BY ITS PATTERN OR BY ITS SHAPE ━━━
This is the one rule that carries both the colour and the surfaces. Every balloon is identified by its PATTERN — broad vertical gore stripes in two alternating saturated colours, concentric chevron bands, a two-colour chequerboard, a colour gradient from crown to skirt built in stepped brick rows, a contrasting crown ring, a two-colour spiral — or by its SHAPE, the whole balloon built as a creature or an object. Its panels, the gas cylinders and the chase-trailer flank are all smooth unmarked brick carrying only their colour and their pattern, and its BASKET has something real slung over the rim: a coil of rope, a wicker hamper, two sandbags, a folded blanket, a brass horn, a dog with its paws up. Colour is saturated and committed: magenta, lime, cyan, tangerine, egg-yolk yellow, hot pink, cobalt, vermilion.

━━━ EVERYTHING IS BRICK — THE GROUND AND THE AIR INCLUDED ━━━
Every element is brick-built with visible studs, moulded plastic and connection seams, on a tabletop convention display. THE GROUND AND THE AIR ARE WHAT DRIFT, so they are named as parts every time: turf is a green plate mosaic with moulded tuft elements, mist is trans-white plates lying low, cloud is white cloud-slope bricks, water is trans-blue plates, foliage is moulded plant elements, dust is a scatter of loose studs. Every figure is a LEGO minifigure with C-shaped hands and a printed face.

━━━ THE FLEET OF HOT-AIR BALLOONS — THE MONEY SHOT (lead the prompt with this) ━━━
${fleet}

━━━ THE NEAREST BALLOON ━━━
${hero}

━━━ THE MOMENT — render this one instant and its physical consequence ━━━
${moment}

Motion is a frozen brick moment, never motion blur. This moment happens on the field below or in the air just above it.

━━━ THE LAUNCH FIELD (the all-brick stage) ━━━
${field}

━━━ THE CROWD ON THE GRASS — this is what proves the scale ━━━
${crowd}

━━━ THE MOC BUILD TECHNIQUE — render it visibly ━━━
${build}

━━━ THE CAMERA FRAMING — this drives the composition ━━━
${camera}

Please use that exact camera position and orientation, even though the LEGO-photography prior favours a centred subject square to the lens at eye level. A hot-air balloon is radially symmetric, so it will try to sit dead centre facing you: instead it sits off the centre line, turned so one flank recedes, and something crops it. Tie the figures to the rolled angle — an over-the-shoulder shows them from behind, a low angle shows them foreshortened from below, a raised angle shows them from above, a broadside shows them in profile, a wide shot spreads several at different depths.

━━━ LIGHT AND THE COLOUR OF THE AIR ━━━
${light}
${eventSection}
━━━ MOOD ━━━
${(vibeDirective || '').slice(0, 150)}

━━━ WRITE IT IN THIS ORDER — 120-170 WORDS ━━━
A tight scene with one clear hero mass beats a crammed inventory every time. Pick the details that carry THIS render and stop.
1. The camera angle, then the fleet of HOT-AIR BALLOONS: how many, spread across which heights, the nearest huge and the farthest small, above the field that crosses the picture from the left edge to the right edge with its far band across the middle and both ends running out of frame.
2. The nearest balloon — its pattern or its shape — and in the same breath that its panels, the gas cylinders and the trailer flank are smooth unmarked brick carrying only their colour and their pattern, and what its BASKET has slung over the rim.
3. The moment, naming the whole figure doing it.
4. The rest of the field: what its furniture carries, and its charm detail.
5. The crowd on the grass, and how small they are against the basket rim.
6. The build technique, visibly.
7. The light and the colour of the air.${event ? '\n8. The field event.' : ''}
Output ONLY the phrase string — one paragraph, no labels, no markers.`;

  return { brief, briefMeta: { camera, lighting: light } };
};
