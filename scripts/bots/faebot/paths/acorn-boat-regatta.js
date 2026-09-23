/**
 * FaeBot acorn-boat-regatta path (2026-09-22) — FaeBot's FIRST ACTION path,
 * its first SPORT, and its first path staged ON water.
 *
 * THE SOUL OF THE PATH:
 *   A boat RACE on beautiful woodland water, crewed by forest creatures and grown fae in hand-made craft
 *   they made out of found things — an acorn-cap tub, a walnut shell under a
 *   petal sail, a curl of birch bark, a folded-leaf punt, a reed outrigger.
 *   Five or more hulls on the water at once, mid-race, strung across the
 *   channel, with something going wrong or being won RIGHT NOW: a capsize
 *   with the fae hauling their own hull back over, two boats grinding round a
 *   bend, one shooting a little rapid nose-down in the spray. The course is a
 *   designed thing — a start of two leaning bulrushes, gates of bent twig, a
 *   tethered rowanberry at the turn, a garland of clover at the end, a row of
 *   pebbles moved along a twig to keep the count. Fae lean out too far from
 *   the bank, dragonflies fly escort, a frog watches the turn. The scale is
 *   legible because the woodland proves it: a pebble is a boulder, a fallen
 *   leaf bridges the channel, a bulrush stands taller than any mast.
 *
 * WHY IT EXISTS (the gap, audited across all 25 FaeBot paths):
 *   FaeBot is ~9 character/portrait paths, ~8 settlement/architecture paths,
 *   4 crowd paths (3 goblin-market + fairy-swarm), 1 vista, 1 court, 1
 *   frost-court, 1 spirit-beasts and 1 interior. Every one of them is a
 *   STATIC subject: a figure posed, a place surveyed, a market browsed. FaeBot
 *   has no ACTION register at all, no sport, no contest, and no path where
 *   WATER is the stage rather than scenery. fairy-swarm is the nearest analog
 *   and its events are crafts and ceremonies (raising a maypole, lighting
 *   lanterns), not a race with speed, spray and stakes. This path is the only
 *   FaeBot picture where something can go WRONG.
 *
 * FUNCTION-FORM + SELF-CONTAINED (the ToyBot Stage-O / mushroom-apothecary
 *   pattern): this file loads its own seven seed JSONs and inlines its whole
 *   brief plus its hand-authored vantage array. It touches no shared bot file
 *   — no pools.js entry, no archetypes.js entry, no archetype-templates.js
 *   entry. Registration is the block at the bottom of this file.
 *
 * 8 AXES (6 always-on + 1 gated bank at 0.7 + 1 hand-authored vantage):
 *   - boat_fleet       4-6 hulls per entry, each a found thing. HERO, leads.
 *   - race_moment      ★ THE MONEY SHOT: the racing incident, one shared
 *                      event opened with an active verb + 2-3 sub-actions on
 *                      DIFFERENT boats.
 *   - racers           GROUP-level cast: 2-3 distinct leads + a varied field
 *                      (the fairy-swarm fae_troupe pattern).
 *   - stream_course    the ARENA: the channel crossing the frame, its two
 *                      unlike banks, the water visibly doing something.
 *   - course_furniture the course as a DESIGNED thing, all fae-made.
 *   - water_light      ★ owns the whole palette: light on moving water.
 *   - bankside         (0.7 gate) spectators, escorts, animals watching.
 *   - vantage          HAND-AUTHORED, inline below, audited as a SET.
 *
 * THE FIVE TRAPS THIS PATH IS BUILT AGAINST (all playbook-documented):
 *   1. THE MODERN-PRIOR NOUN TRAP (fairy-swarm, and the biggest risk here by
 *      far). An event noun whose most famous image is modern or human-scale
 *      BEATS every fae qualifier around it — "wedding" rendered a full-size
 *      modern bride with fairies as decoration. "Regatta" is exactly that
 *      noun, and so are trophy, finish line, flag, buoy, crew, captain,
 *      umpire and scoreboard. So the word REGATTA NEVER APPEARS IN A PROMPT
 *      (it lives only in the path key), every office is named by its ACTION
 *      instead of its title (a frog watching the turn, never an umpire), and
 *      the template's fae-craft law is positive: everything in frame was made
 *      by hand from what the woodland gave.
 *   2. THE SINGLE-HERO COLLAPSE. fairy-swarm's fix is three layers and all
 *      three are here: (a) race_moment seeds open with an active verb naming
 *      ONE shared event plus 2-3 sub-actions on DIFFERENT boats, and the
 *      fleet axis names 4-6 hulls per entry, so the plural lives in the POOL;
 *      (b) the composition lock is the template's FIRST rule; (c) a PLURAL
 *      promptPrefixByPath anchor (see the registration block).
 *      Face-mush control: the 2-3 nearest fae have fully detailed faces,
 *      farther ones stay readable little figures.
 *   3. HUMAN-SCALE COLLAPSE. "Boats on a stream" with no scale anchor renders
 *      full-size rowing boats. Every fleet / course / stream seed carries a
 *      NATURAL-OBJECT scale prover and the template asks for one by name in
 *      the output order.
 *   4. READABLE TEXT (lesson 13 — a surface named in a SEED is clean; named
 *      only in the template it is a coin flip). Sails, hull sides and
 *      anything strung across the water are this path's text magnets, so each
 *      is given a PICTURE in the seeds themselves (a leaf's own veins, a
 *      petal's streak, a moth-wing eyespot, one small painted crescent) and
 *      the clause also sits INSIDE the template's required output order,
 *      because Sonnet writes only what it is told to write. Nothing is ever
 *      called "blank" — a negation CLIP cannot use.
 *   5. UNSTATED FIGURES (lesson 14). A race is a human-activity prior, so
 *      every render says what the racers ARE: slender palm-sized fae in
 *      petal-silk and leaf-cloth with full beautiful faces, real eyes, real
 *      hair, pointed ears and visible wings (the KODAMA law) — including on
 *      the no-bankside branch, which is written as a POSITIVE state of the
 *      bank (the fae-cottage / apothecary negation-echo lesson).
 *
 * VANTAGE AUDIT (the BrickBot SYMMETRY LAW + the ice-cavern camera lessons).
 *   The camera array is hand-authored, never generated, and was audited as a
 *   SET against four hard-fail generators: no axial entry looking along the
 *   channel, no plan/overhead view, no camera standing ON the hero (the hero
 *   is the FIELD, so no vantage sits on a racing hull), and no narrow aperture
 *   or surround (frame-edge foreground is a near EDGE down ONE side, never a
 *   border all the way round — that renders a peephole vignette). All eight
 *   were REWRITTEN after R0 to look ACROSS the water rather than along it,
 *   because the first set still produced corridors: see the round log below.
 *
 * ROUND LOG (4 rounds × 6 shadow renders, all judged against Kevin's motto).
 *   R0 avg ~2.6 — the prefix said "racing together DOWN A WOODLAND STREAM"
 *     and 5 of 6 came back as a channel RECEDING DEAD UP THE MIDDLE with an
 *     infinite tiled queue of identical boats to the vanishing point, all of
 *     them full-size wooden dinghies rather than nutshells. Ultra also signed
 *     one render (readable text) → pinned out.
 *   R1 avg ~2.7 — ONE VARIABLE: the prefix rewritten to lead with the
 *     found-object hulls. That WORKED (5 of 6 rendered real acorn-cap /
 *     petal / bark-curl hulls at legible fae scale) and the corridor survived
 *     all 6. One stock-photo WATERMARK URL appeared (see residuals).
 *   R2 avg ~2.65 — ONE VARIABLE: the ToyBot "concrete but cropped" fix — the
 *     water FILLS the frame and the far bank is only a BAND along the top, so
 *     the corridor geometry cannot exist. Corridor broken in 2 of 6, and the
 *     best render of the build to that point (6 boats abreast, vivid) came
 *     from it. But 3 of 6 lost the fae entirely.
 *   R3 avg ~3.07 — ONE VARIABLE: prompt LENGTH. R2's stored `ai_prompt`s ran
 *     456-669 words against a 120-150 cap with EVERY element present, so
 *     flux-1.1-pro was rendering the first third (frame + hulls) and ignoring
 *     the cast, the incident and the course furniture. Brief compressed
 *     8049 → 4023 chars, output order 12 → 8 items, cap 95-120. Emitted
 *     prompts fell to ~180 words of Sonnet text and the frame law held in 4
 *     of 6 (best render 3.9: five hulls abreast in real white spray).
 *
 * RESIDUAL (the blocking defect, and the next lever):
 *   THE CAST. In 5 of 6 R3 renders the fae came back as UNCLOTHED, WINGLESS,
 *   FACELESS CHERUB DOLLS, and in 1 of 6 they were absent altogether — even
 *   though every render's prompt says "palm-sized fae in petal-silk tunics and
 *   woven-grass jerkins, pointed ears, real hair, iridescent wings, faces
 *   detailed on the nearest". This is the KODAMA law in a new costume: the
 *   words "tiny" and "palm-sized" put Flux's nearest centroid for a small
 *   winged humanoid at a NAKED PUTTO, and at 1-2% of frame there is no
 *   resolution for cloth anyway. NEXT LEVER (one variable, unrendered): give
 *   the picture a BIG NEAR BOAT — the nearest hull filling the lower third
 *   with two fae painted large — and replace "palm-sized"/"tiny" on the FIGURE
 *   with adult proportions ("slender grown fae, long-limbed, the size of a
 *   mouse"). Keep the five-abreast lock for the rest of the field.
 *   Second residual: the hand-made course furniture and the bankside crowd
 *   have rendered 0 times in 24 renders — they are last in the output order
 *   and still being dropped.
 *
 * Config: FaeBot's default medium (painted_fantasy_novel); modelByPath pins
 *   flux-1.1-pro ONLY (ultra measured out in R0 — it signs its work, and a
 *   signature is readable text). chaos + sensoryAnchors are off bot-wide.
 *   twoPassPolish MUST skip this path: the frame law, the five-abreast lock
 *   and the fae-craft law are all load-bearing and Haiku compression strips
 *   them. nudityCheck MUST include this path — it fired and re-rolled once in
 *   R1 (BARE), and the residual above is why. sharedDNA.colorPalette is
 *   deliberately unused: water_light owns the palette, and a fixed vibe
 *   colour-cast would override the rolled light.
 */

const fs = require('fs');
const nodePath = require('path');

function load(name) {
  return JSON.parse(
    fs.readFileSync(nodePath.join(__dirname, '..', 'seeds', `${name}.json`), 'utf8')
  );
}

const BOAT_FLEET = load('faebot_regatta_boat_fleet');
const RACE_MOMENT = load('faebot_regatta_race_moment');
const RACERS = load('faebot_regatta_racers');
const STREAM_COURSE = load('faebot_regatta_stream_course');
const COURSE_FURNITURE = load('faebot_regatta_course_furniture');
const WATER_LIGHT = load('faebot_regatta_water_light');
const BANKSIDE = load('faebot_regatta_bankside');
const SHORE = load('faebot_regatta_shore');

const BANKSIDE_GATE = 0.7;

// HAND-AUTHORED VANTAGES — see the VANTAGE AUDIT in the header. Every entry:
// water crosses the frame (never recedes up the middle), camera low and near
// the surface, field strung diagonally, no overhead, no surround, never on a
// racing hull.
const VANTAGES = [
  'from a few inches above the water at the near bank, looking ACROSS the channel rather than along it, the fleet passing from left to right in front of the view and the far bank standing close behind them',
  'from a stone in the shallows at the edge of the field, looking across and slightly down at the boats going by, the nearest hull filling the lower left of the picture and the far bank a close green wall beyond',
  'from partway up a mossy boulder standing in the water, looking down and across the passing field, the channel running out of the picture to the right and the far bank close and full of detail',
  'from alongside the leading boat, level with its gunwale and a hand away from it, looking across the boat at the chasing field spread over the open water beyond',
  'from a low root on the outside of a bend, looking across the turn at the boats heeling through it, the bright gravel of the inside bank filling the far side of the picture',
  'from low among the reeds of the near bank, a few reed stems standing down one edge of the picture and the field crossing the open water close beyond them',
  'from a fern frond a little above the field, tilted down ACROSS the channel, the boats strung diagonally over the water with both banks in frame',
  'from the far bank at water level, looking back across the stream at the field coming past, the near bank and its overhanging grasses closing the top of the picture',
];

module.exports = ({ vibeDirective, picker }) => {
  const fleet = picker.pickWithRecency(BOAT_FLEET, 'regatta_boat_fleet');
  const moment = picker.pickWithRecency(RACE_MOMENT, 'regatta_race_moment');
  const racers = picker.pickWithRecency(RACERS, 'regatta_racers');
  const course = picker.pickWithRecency(STREAM_COURSE, 'regatta_stream_course');
  const furniture = picker.pickWithRecency(COURSE_FURNITURE, 'regatta_course_furniture');
  const light = picker.pickWithRecency(WATER_LIGHT, 'regatta_water_light');
  const vantage = picker.pickWithRecency(VANTAGES, 'regatta_vantage');
  const shore = picker.pickWithRecency(SHORE, 'regatta_shore');
  const bankside =
    Math.random() < BANKSIDE_GATE ? picker.pickWithRecency(BANKSIDE, 'regatta_bankside') : null;

  const banksideSection = bankside
    ? `
━━━ 7. THE BANK (the race is an OCCASION — the watchers are involved) ━━━
${bankside}
`
    : `
━━━ 7. THE BANK ━━━
The banks belong to the water this stretch: leaning grasses, wet moss, a fallen leaf caught in the reeds, and the race running through with the channel to itself.
`;

  return `You are a fantasy concept-art painter writing ONE short Flux prompt for a BOAT RACE run by small woodland creatures and grown fae together, each crewing a little hand-made craft on beautiful woodland water, in FaeBot's soft painted-fantasy register (Manchess + Giancola + Bonner + Froud painted-fantasy lineage). A timeless fae world where every hull, sail and oar was made by hand from what the woodland gave.

━━━ THE FIVE LAWS OF THIS PICTURE ━━━
1. THE WATER FILLS THE FRAME. A CLOSE view onto the moving surface: water edge to edge through the whole lower and middle of the picture, the boats on it near and large, and only a BAND of far bank — wet moss, root, leaning grass — along the very TOP. The stream's length runs out of frame both sides.
2. FIVE BOATS ABREAST. At least five little boats at once, spread WIDE side by side across the near water at different angles, filling the picture's width. No single hero boat centred.
3. EACH HULL IS THE FOUND THING ITSELF — the acorn cap, the walnut shell, the curl of birch bark, the folded leaf, the petal — keeping its own shape, rim and grain, with its crew sitting down inside it. One natural thing in frame proves the scale.
4. SOMETHING IS HAPPENING, AND THE CREWS ARE DOING IT. Spray, effort, a capsize, a gust, a near-miss. EVERY BOAT CARRIES A MIXED CREW — one grown fae and one or two forest creatures TOGETHER IN THE SAME HULL, never a boat of only animals and never a boat of only fae. Each animal is a REAL animal of its kind on all fours or perched naturally, with true fur, feathers or shell. Each fae is a GROWN adult with a full beautiful face, real eyes, real hair, pointed ears and fine wings, fully dressed in fae-craft cloth covering chest and shoulders — a petal-silk tunic, a leaf-cloth smock, a woven-grass jerkin.
5. PICTURES AND VIVID COLOUR. Each sail is a whole veined leaf, a petal with its darker streak, or a moth wing with its eyespot; hull sides are smooth plain shell and bark. Saturated committed colour, painted with real brush authority, and one small clever thing the eye finds on second look.

Everything below is NOTES, longer than your prompt. Take from each only what fits.

━━━ THE FIELD OF BOATS (the hero) ━━━
${fleet}

★━━━ THE MOMENT (the money shot) ━━━
${moment}

━━━ THE RACERS (nearest two or three have detailed faces) ━━━
${racers}

━━━ THE WATER ━━━
${course}

━━━ THE HAND-MADE COURSE ━━━
${furniture}

★━━━ THE SHORE (the banks are a REAL PLACE — trees, flowers, terrain, and something living on them) ━━━
${shore}

★━━━ THE LIGHT ON THE WATER (owns the palette; light is a glow, patch, streak, fleck or dappling ON a real surface) ━━━
${light}
${banksideSection}
━━━ THE VANTAGE ━━━
Painted ${vantage}.

━━━ FAE-CRAFT WORDS ━━━
This world has its own words: a tethered berry on a grass line at the turn, the fae aboard, a fae moving pebbles along a twig to keep the count, a frog watching the turn, a clover garland strung between two reeds at the end. Use no word whose famous picture is a modern sporting event, a harbour or a machine.

━━━ MOOD ━━━
${vibeDirective ? String(vibeDirective).slice(0, 90) : ''} — colour the light and the feeling only; the race stays fast, with clear water between the boats.

━━━ LENGTH IS THE FIRST RULE — 95-120 WORDS, COUNT THEM ━━━
Your whole prompt is SHORTER than any one section above. Name each thing in three or four words and move on. Write comma-separated phrases in THIS order and then STOP:
[name it plainly with the rolled light — for example "sunlit river-bend boat race of woodland creatures"],
[the frame: a beautiful open stretch of woodland water running away into the distance, and THE SHORE ABOVE — its trees, its flowers and its terrain named from the section above, filling both banks and the far end of the view],
[the nearest boat large and close in the foreground, what it is made of and its colour],
[three or four more boats further back at different distances, each a different found hull],
[what is happening right now, across several boats],
[the crew of the nearest boat: A GROWN DRESSED FAE WITH WINGS pulling the oars AND one or two forest creatures riding in the same hull with her, each doing its own job — her face and her clothing detailed, their fur and feathers detailed],
[the sails, each a veined leaf or streaked petal, on smooth plain shell and bark hulls],
[one natural thing that proves the scale, and one piece of the hand-made course],
[what the light is doing on the water and its colour],
[soft painted-fantasy oil-brushwork].

If it will not all fit, the frame, the nearest boat, the fae AND the creatures sharing it, THE SHORE, and the light are the ones that must survive. Describe only what IS present — every phrase names something in the picture, never something absent. No preamble, no headers, no markers, no bullets, no bold labels.`;
};

/*
 * ── REGISTRATION (merge into scripts/bots/faebot/index.js) ───────────────────
 *
 *  1. pathBuilders:
 *       'acorn-boat-regatta': require('./paths/acorn-boat-regatta'),
 *  2. shadowPaths — add:
 *       'acorn-boat-regatta',
 *  3. twoPassPolish.skipPaths — add:
 *       'acorn-boat-regatta',
 *  4. nudityCheck.paths — add:
 *       'acorn-boat-regatta',
 *  5. promptPrefixByPath — add (the PLURAL anchor AND the frame; layer (c) of
 *     the anti-single-hero fix. The FIRST tokens CLIP reads must be a crowd of
 *     small shells on a close water surface — the R0 version said "racing
 *     together DOWN A WOODLAND STREAM" and produced 5 of 6 receding corridors):
 *       'acorn-boat-regatta':
 *         'close-up of a woodland stream surface filling the whole frame, a crowd of tiny fae racing boats made from acorn caps, walnut shells, curls of birch bark and flower petals spread abreast across the near water, a band of mossy bank along the top edge of the picture',
 *  6. modelByPath — add (flux-1.1-pro ONLY. Ultra was measured out in R0: it
 *     signed 1 of its 3 renders with a painted signature — readable text, a
 *     hard fail — and produced 2 of the 3 worst corridor/tiling frames):
 *       'acorn-boat-regatta': ['black-forest-labs/flux-1.1-pro'],
 *
 * Nothing else is required: pools.js is untouched (this file loads its own
 * seeds), chaos + sensoryAnchors are disabled bot-wide, and the medium falls
 * through to defaultMedium `painted_fantasy_novel`. Going live later = move
 * the string from shadowPaths[] into paths[].
 */
