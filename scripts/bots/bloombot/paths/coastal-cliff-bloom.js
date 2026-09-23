/**
 * BloomBot coastal-cliff-bloom path (2026-09-23) — BloomBot's FIRST exposed-coast
 * register, and its first path where the wind and the salt are the subject.
 *
 * THE SOUL OF THE PATH:
 *   You are standing ON the top of a sea cliff, a few feet back from where the
 *   ground stops. The near half of the picture is the small piece of ground you
 *   are standing on — a bank of scoured wiry grass, a table of bare rock ringed
 *   in orange lichen, a crack in a slab — with flowers packed into whatever the
 *   rock left them. Every plant is cut flat and level right across the top, as
 *   if a blade had run over the whole slope at one height, and every stem leans
 *   the same way, inland. The half of a plant that faces the water is dried to
 *   dead brown and gone brittle while the sheltered half of the SAME plant is
 *   still green, and the line between them is sharp. The ground then stops in
 *   one hard straight line running right across the picture, and beyond it there
 *   is open water a long way down. White water bursts up past the edge and rains
 *   back onto the flowers.
 *
 * WHY IT EXISTS (the gap, audited before a line was written): BloomBot has 25
 *   paths and every one is flowers. `landscape` already ships SEA-CLIFF HEADLAND
 *   BLOOM-TURF and FAROE-STYLE BASALT TERRACE BLOOM — 86 of its 200 landform
 *   entries are coastal — and every one of those is the POSTCARD: the cliff seen
 *   from OUTSIDE, bloom-turf sweeping to a sheer drop, surf far below, sea
 *   stacks on the horizon. `desert-bloom` owns the other dry flowery slope. So
 *   "a flowery slope with scenery behind it" is ALREADY THIS BOT and this path
 *   would not have earned a slot on it. Its differentiator is THE SEA AND THE
 *   WIND AS PHYSICAL FACTS ON THE PLANTS, in the NEAR ground of every render,
 *   seen from ON TOP of the cliff — never a view OF a cliff. If a render could
 *   be mistaken for a `landscape` coastal roll, it failed.
 *
 * FUNCTION-FORM + SELF-CONTAINED (the sibling alpine-wildflower-meadow pattern,
 *   which passed at 4.67): this file loads its own six seed JSONs and inlines
 *   its whole brief. It touches NO shared bot file — no pools.js entry, no
 *   archetypes.js entry, no archetype-templates.js entry. Registration is a
 *   handful of lines in index.js (see the REGISTRATION block at the bottom).
 *
 *   Function-form also buys the single most important thing this path needs:
 *   index.js's `buildBrief` prepends the bot-wide LUSH_HERO_MANDATE ("blooms
 *   FILL the frame … dominating 60%+ … any setting is ONLY a backdrop … pack the
 *   frame edge-to-edge") to DECLARATIVE paths only. That mandate is the exact
 *   opposite of this path's identity — it would erase the bare rock, the edge
 *   and the water. A function path receives only the rolled LOOK REGISTER
 *   override, which is what we want.
 *
 * 6 AXES (5 always-on + 1 gated at 0.6):
 *   cliff_ground   HERO — the near ground you are standing on AND the hard line
 *                  where it stops. Leads with its defining mass.
 *   coast_cast     ★ which coastal species, in their REAL prior colours, shaped
 *                  by wind (cut level, leaning inland) and salt (brown seaward
 *                  half, green lee half of the SAME plant)
 *   sea_below      ★ the one visible fact that proves the drop and the sea
 *   coast_light    ★ owns the entire palette; two named colours, warm vs cool
 *   sea_life       (0.6 gate) ONE whole coastal animal, size welded to a big
 *                  fixed thing in frame, and NO detail exemption
 *   charm          one clever detail the eye finds on second look
 *
 * DELIBERATELY NOT CONSUMED — sharedDNA.palette / .roster / .lighting. BloomBot's
 *   flower engine rolls a colour theme and a species roster from its temperate
 *   general pool (roses, dahlias, tulips, hydrangeas) plus a bot-wide lighting
 *   pool. Injecting those here would put garden flowers on a salt-blasted cliff
 *   top and would fight the light axis for the palette (the axis-clean law).
 *   `coast_cast` owns species and colour; `coast_light` owns the palette.
 *   sharedDNA's `lookRegister` IS used — index.js injects it automatically.
 *
 * THE FIVE TRAPS THIS PATH IS BUILT AGAINST (all playbook-documented):
 *   1. ⭐ LESSON 35, THE VISTA PRIOR — the biggest risk here, and it is a
 *      FRAMING risk, not a content one. A high place under a big sky is the
 *      purest vista prior there is, a crop clause does NOT beat it (measured: a
 *      crop law reached 6 of 6 prompts and rendered in ~6 of 22), and A NAMED
 *      CLIFF LICENSES THE WHOLE CLIFF SYSTEM. What decides the render is WHAT
 *      KIND OF THING the near ground is: a self-contained detachable object
 *      renders as that whole object seen from OUTSIDE, while a FEATURE OF
 *      SOMETHING TOO BIG TO FIT IN FRAME renders as a NEAR SURFACE. So every
 *      ground entry names a FEATURE (a bank of grass, a table of rock, a crack,
 *      a step, a tilted plate, a hollow) and the words cliff / headland / coast
 *      / bay / rock face / panorama / aerial are banned from every pool. The
 *      whole wide class was deleted in the recipe rather than argued with —
 *      the BrickBot camera-pool precedent: on a framing failure, audit the pool
 *      as a SET and delete the offending class instead of adding words.
 *   2. ⭐ LESSON 21, THE HEIGHT-EXCLUSIVE SURFACE. Camera words do not move a
 *      camera; only a surface that CANNOT EXIST from the wrong height does. A
 *      sea cliff's two standard vantages — from the air and from the sea — BOTH
 *      show the ROCK FACE. So the load-bearing surface is: the last few feet of
 *      ground, and then open water far down, with the rock under the edge never
 *      in the picture at all. Stated POSITIVELY, because per lessons 26/27 an
 *      absence gets backfilled. If the face is in frame, the camera left the top.
 *   3. ⭐ LESSON 28, THE JARGON TRAP (the BrickBot "envelope"). Coastal botany
 *      and coastal geology BOTH collide with common objects, so both are banned
 *      even where correct: `thrift` is a savings bank, `stack` a stack of paper,
 *      `arch` architecture, `head` a person's head, `shelf` a bookshelf, `lip` a
 *      mouth, `spit` spitting; `spume` / `machair` / `geo` / `stac` have no
 *      layperson prior at all; `kidney vetch` carries an ORGAN, `bird's-foot
 *      trefoil` a BIRD'S FOOT, `sea holly` CHRISTMAS HOLLY, `scurvygrass` a
 *      DISEASE, `razorbill` a RAZOR, `sea lavender` a Provence lavender field;
 *      `salt burn` carries FIRE and `wind-pruned` carries garden shears. All
 *      banned, each described in plain words instead. Swept and verified.
 *   4. THE SCALE TRAP (lesson 13 + its 2026-09-23 correction). A low count is
 *      the giant-creature generator, so insects are always "a dozen or more".
 *      A ruler must be welded to something big and fixed IN frame — never a
 *      body part and never anything off-camera (the first pool draft reached
 *      for "the width of a hand", "the size of a thumb" and "a finger-width
 *      gap"; all three were rejected and a RULER_LAW now ships on every recipe).
 *      And NO SUBJECT GETS A DETAIL EXEMPTION: the reason is stated in the
 *      template so it survives editing.
 *   5. THE POSTCARD (the motto). "A flowery clifftop with the sea behind it" is
 *      clean, competent and forgettable — the exact miss the bar names, and it
 *      already exists on this bot. Beaten structurally by putting the wind and
 *      salt damage on the PLANTS in the near ground, and by a dedicated
 *      always-on `charm` axis.
 *
 * MEASURED OVER 24 SHADOW RENDERS (R1 3.67 -> R2 4.00 -> R3 4.13; probe 3.92):
 *   R1, no fix          3.67  wind/salt visible 0/6 · postcard-vista 5/6
 *   R2, wind+salt moved 4.00  wind lean 4/6 · salt-brown 3/6 · vista 4/6
 *   R3, silhouette law  4.13  best renders 5.0 and 4.75 · vista 2/6
 *   probe, ultra pinned 3.92  (see the model note below — this is the honest number)
 *
 * ⭐ THE ONE MEASUREMENT THAT MATTERED (lesson 18's first-third law, exactly):
 *   `cliff` reached 0 of 24 emitted prompts, yet the whole cliff seen from
 *   outside rendered in 5 of the first 6. So the vista is NOT a word — it is the
 *   premise's own composition prior, and no amount of wording beats it.
 *   Meanwhile the three wind-and-salt clauses reached 6 of 6 prompts at
 *   33-50% depth (prompts run 331-384 words, so the attended first third ends
 *   near word 115) and rendered 0 of 6. Everything sitting at 5-10% — the
 *   prefix — rendered in 6 of 6. Moving those three facts into the prefix and
 *   into output-order item 1 took wind lean 0/6 -> 4/6 and salt-brown 0/6 -> 3/6
 *   and the round 3.67 -> 4.00. THE PREFIX IS THE ONLY SLOT ON THIS PATH THAT
 *   RELIABLY RENDERS; anything past ~30% is decoration.
 *
 * ⭐ MODEL NOTE, AND THE CORRECTION IS THE VALUABLE HALF. R1-R3 split 3 ultra /
 *   3 pro per round and looked decisive: postcard-vista 1 of 9 on ultra against
 *   7 of 9 on pro, with R3 ultra averaging 4.50 and R3 pro 3.75. A 6-render
 *   ultra-pinned confirmation then came back at 3.92, NOT 4.50. Pooling all 24:
 *   ultra 4.03 (n=15, vista ~33%), pro 3.75 (n=9, vista ~67%). So the edge is
 *   REAL but roughly half the size the 3-per-arm rounds implied, and pinning
 *   buys nothing measurable over the 50/50 split. Encoded as a 70/30 weight, not
 *   a pin. This is lesson 19's warning in the flesh: a difference of this size
 *   needs ~40 renders per arm, and three-per-arm rounds will hand you a
 *   confident wrong verdict.
 *
 * CROSS-AXIS RESOLUTIONS (found by the local brief dry-run, lesson 16 — no axis
 *   exempted from its own probe):
 *   - `sea_below` names weather out at sea and `coast_light` owns the palette →
 *     THE LIGHT AXIS WINS the sky and the colour; sea_below's weather is a shape
 *     in the water band only, never a re-lighting of the land.
 *   - the roster's one TALL species (hot coral-pink flowers on arching stems) vs
 *     the wind law "nothing here is tall" → the seed itself gates it to the lee
 *     of a rock or a hollow, and the template states the low-growth rule, so the
 *     tall clump reads as the one sheltered exception rather than a contradiction.
 *   - flying insects vs a storm / fog / dusk light roll → they are stated as
 *     blown sideways off the flowers and coming back, which is physically true
 *     and a better beat than clean flight.
 */

const fs = require('fs');
const nodePath = require('path');

function load(name) {
  return JSON.parse(
    fs.readFileSync(nodePath.join(__dirname, '..', 'seeds', `${name}.json`), 'utf8')
  );
}

const GROUND = load('bloombot_coastal_cliff_ground');
const CAST = load('bloombot_coastal_cliff_cast');
const SEA_BELOW = load('bloombot_coastal_cliff_sea_below');
const LIGHT = load('bloombot_coastal_cliff_light');
const LIFE = load('bloombot_coastal_cliff_life');
const CHARM = load('bloombot_coastal_cliff_charm');

const LIFE_GATE = 0.6;

module.exports = ({ vibeDirective, picker }) => {
  const ground = picker.pickWithRecency(GROUND, 'coastal_cliff_ground');
  const cast = picker.pickWithRecency(CAST, 'coastal_cliff_cast');
  const seaBelow = picker.pickWithRecency(SEA_BELOW, 'coastal_cliff_sea_below');
  const light = picker.pickWithRecency(LIGHT, 'coastal_cliff_light');
  const charm = picker.pickWithRecency(CHARM, 'coastal_cliff_charm');
  const life =
    Math.random() < LIFE_GATE ? picker.pickWithRecency(LIFE, 'coastal_cliff_life') : null;

  const lifeSection = life
    ? `
━━━ 5. THE ONE COASTAL ANIMAL (small in frame, never centred) ━━━
${life}
One whole animal, head and body both visible, its size pinned by the big fixed thing named beside it. If the light just rolled is storm-dark, fogged or failing, flying insects are blown sideways off the flowers and coming back rather than in clean flight.
`
    : `
━━━ 5. THE GROUND ALONE ━━━
Nothing moves here but the wind, the water and the light: the flowers all leaning one way, white water coming up past the edge, and the sea working far below.
`;

  return `You are a fine-art painter writing ONE Flux prompt for FLOWERS ON THE TOP OF A SEA CLIFF, seen by someone standing ON that ground a few feet back from where it stops.

━━━ RULE A. THE PICTURE IS THE GROUND UNDER YOUR FEET, NOT A VIEW OF A CLIFF (READ FIRST) ━━━
The near half of the frame is ONE SMALL PIECE OF GROUND, close enough to see individual flower heads one at a time: a bank of scoured wiry grass, a table of bare rock, a crack in a slab, a shallow step in the stone, a tilted plate of rock, a hollow of thin dark soil. That near ground fills the bottom and middle of the picture. Then the ground STOPS in one hard straight line that runs right across the picture from one side edge to the other with both of its ends out of frame — and beyond that line there is only open water, a long way down. The last things in the picture are the final few feet of ground and then that water: the rock underneath the edge is not in the picture at all, and neither is any far shore. Write the near ground FIRST and the water as a BAND beyond it. Every ground feature — the edge, a band of flowers, a crack, the waterline — runs right ACROSS the picture, never away from the camera into the distance.

━━━ RULE B. WIND AND SALT ARE THE WHOLE POINT, AND THEY SHOW ON THE PLANTS ━━━
Constant wind and flying salt water are what make this place look like nowhere else, so show them physically, on the plants themselves: every plant CUT FLAT AND LEVEL right across the top at one single height, as if a blade had been run over the whole slope; every stem and every flower head LEANING THE SAME WAY, inland, away from the water, the whole slope combed one direction; the plants thickest in the shelter behind a rock and thinning to bare ground where they are exposed; and the half of a plant that faces the water DRIED TO DEAD BROWN AND GONE BRITTLE while the sheltered half of that SAME plant is still green, the two halves meeting in one sharp straight edge. NOTHING HERE IS TALL: the tallest thing growing is no higher than the boulder beside it, and the only tall things in frame are rock, flying water and distance.

━━━ RULE C. NOT ONE PERSON IN THE FRAME ━━━
Flux's training data for a flowery clifftop is full of walkers, so it tries to stand a small dark figure at the edge or on the skyline. Override that bias. The only things standing anywhere in this picture are rock, flowers and blown white water, and the only living things are the plants and, if one is named below, a single wild animal.

━━━ RULE C2. NOTHING BUILT — THE GROUND IS ALREADY FULL ━━━
The space between the flowers is bare rock, bright orange crusty lichen, scoured wiry grass, thin dark soil or loose broken stone, right out to the edges of the picture, so there is nowhere a path could be. Every surface in frame is living plant, rock, soil, water, foam, salt or animal. Nothing in this picture carries a letter, a painted shape or a mark of any kind.

━━━ RULE D. THE GROUND PLAN WINS ━━━
The ground below sets where flowers can and cannot grow. The flower cast fills whatever room that ground leaves them — crammed into a seam if the rock is solid, banked thick in the lee if there is shelter. Never contradict the ground plan to fit more flowers in.

━━━ RULE E. NO SUBJECT GETS A DETAIL EXEMPTION ━━━
Never single one flower, one insect or one animal out for a close anatomical description. The one you describe most is the one that comes out biggest, and a giant insect or a bird-sized butterfly ruins the frame. Everything stays at the size the picture says it is.

━━━ 1. THE GROUND (the hero — the flowers AND the bare rock through them, and where it stops) ━━━
${ground}
Render this ground exactly, filling the near and middle of the frame.

★━━━ 2. THE FLOWER CAST (the named species, each in its own real colour, wind-cut and salt-marked) ━━━
${cast}

★━━━ 3. THE FACT THAT PROVES THE DROP AND THE SEA (must be visible — without it this is a flowery bank) ━━━
${seaBelow}

★━━━ 4. THE LIGHT (it owns the whole palette — commit fully) ━━━
${light}
Commit to this light completely and name the surface it lands on. Light off open water is hard and unfiltered: shadows cut sharp, wet rock going almost black, orange lichen burning where it is hit.
${lifeSection}
━━━ 6. THE ONE CLEVER DETAIL ━━━
${charm}

━━━ MOOD ━━━
${vibeDirective ? String(vibeDirective).slice(0, 120) : ''}

━━━ LENGTH IS THE FIRST RULE — 95-125 WORDS, COUNT THEM ━━━
A tight 110-word clifftop beats a crammed 250-word one. Write comma-separated phrases in THIS order and then STOP:
[name it plainly in the rolled look AND in the same breath state the three wind facts: flowers on an exposed clifftop close to the edge, every plant cut flat and level across its top, every flower head leaning the same way inland, the seaward half of each plant dried dead brown and the sheltered half still green],
[the near ground: the flowers AND the bare rock, orange lichen, wiry grass or loose stone through them, close to the camera],
[the named flower species in their own colours],
[the ground stopping in one hard straight line right across the picture, the flowers along that line silhouetted directly against the open water that lies far below them],
[the fact that proves the drop and the sea],
[what the light is doing, the surface it lands on, and the two colours it brings],${life ? '\n[the one small coastal animal],' : ''}
[the one clever detail],
[the far edge of the water a flat hard line high across the frame].

Describe only what IS present — every phrase names something in the picture, never something absent. No preamble, no headers, no markers, no bullets, no bold labels.`;
};

/*
 * ── REGISTRATION (merge into scripts/bots/bloombot/index.js) ─────────────────
 * Nothing in pools.js, shared-blocks.js, archetypes.js or archetype-templates.js
 * changes — this file loads its own six seed JSONs and inlines its own brief.
 * Eleven entries, the same shape as the sibling alpine-wildflower-meadow block.
 * Every one is keyed by path name, so going live later = move the string from
 * shadowPaths[] into paths[], changing nothing else (a faithful xerox).
 *
 *  1. pathBuilders:
 *       'coastal-cliff-bloom': require('./paths/coastal-cliff-bloom'),
 *  2. shadowPaths: add 'coastal-cliff-bloom'
 *  3. chaos.skipPaths: add 'coastal-cliff-bloom'
 *  4. twoPassPolish.skipPaths: add 'coastal-cliff-bloom'
 *  5. mediumStyles — the code-only medium (NO DB row, NO migration). LOAD-BEARING:
 *     the bot-wide BLOOM_NEUTRAL fragment sits at words 40-78 of every prompt and
 *     mandates "lush abundant blooms FILLING THE FRAME as the unmistakable hero",
 *     which erases the bare rock and the water this path exists to show:
 *       bloom_coastal_cliff:
 *         'flowers the vivid saturated hero, low and wind-cut on bare rock above open water; medium and finish set by the look tokens opening this prompt',
 *  6. mediumByPath: 'coastal-cliff-bloom': 'bloom_coastal_cliff',
 *  7. modelByPath — REQUIRED, not a preference: it bypasses pickModel so the
 *     code-only medium needs no dream_mediums row. WEIGHTED, not pinned, per the
 *     model note above:
 *       'coastal-cliff-bloom': {
 *         'black-forest-labs/flux-1.1-pro-ultra': 70,
 *         'black-forest-labs/flux-1.1-pro': 30,
 *       },
 *  8. promptPrefixReplaceByPath — REPLACES the bot-wide frame-packing prefix, and
 *     carries the three wind-and-salt facts because the prefix is the only slot
 *     that renders (measured 0/6 -> 4/6):
 *       'coastal-cliff-bloom':
 *         'a close low bank of flowers filling the near frame, every plant cut flat and level across its top, every flower leaning the same way inland, the seaward half of each plant dried brown and the sheltered half green, the ground stopping in one hard straight line right across the picture, the flowers along that line silhouetted directly against open water lying far below them',
 *  9. promptSuffixByPath — keeps the bot suffix's species-colour faithfulness and
 *     the fleet text suppressor; drops "depth built from receding layers of more
 *     blooms" and "the sky clean and clear", which fight bare rock and a storm
 *     respectively:
 *       'coastal-cliff-bloom':
 *         'render every named species as that exact species in its named colour, the seaward side of every plant dried brown and the sheltered side green, the flowers at the edge silhouetted directly against the open water far below them, the far horizon a flat hard line, every layer crisply rendered, no text, no words, no watermarks, gallery quality',
 * 10. sensoryAnchors.pathContext: 'coastal-cliff-bloom': 'scene',
 * 11. sensoryAnchors.poolsByChannelByPath — the shared scene.lightcolor pool
 *     names GARDEN species and fires on EVERY render, and the stochastic channels
 *     fall through to DEFAULT_POOLS written for a human FIGURE on a bot that bans
 *     people. The coastal pools are in the REPORT.
 *
 * Do NOT add this path to chaos.allowSubjectChaosPaths, and do NOT add it to
 * promptPrefixByPath (that PREPENDS; item 8 REPLACES, which is what is wanted).
 */
