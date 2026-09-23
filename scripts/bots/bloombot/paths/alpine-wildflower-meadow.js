/**
 * BloomBot alpine-wildflower-meadow path (2026-09-23) — BloomBot's FIRST
 * high-altitude register, and its first path where the ground is not all flowers.
 *
 * THE SOUL OF THE PATH:
 *   A wildflower meadow at the snowline, thousands of feet above the last trees.
 *   Bare broken rock and loose stone come up THROUGH the flowers. A patch of old
 *   snow lies in the meadow with flowers in full bloom along its melting edge.
 *   The plants grow flat and tight to the ground because that is what wind and
 *   altitude do to a plant. A snowfield or a blue glacier tongue stands above the
 *   flower line and the forest ends in a ragged edge far below. The light is thin
 *   and hard, the shadows are cut sharp, and you can see three ranges deep.
 *
 * WHY IT EXISTS (the gap, audited before a line was written): BloomBot has 24
 *   live paths and every single one is flowers. `flower-fields` owns the
 *   cultivated geometric mega-field, `landscape` owns the wild flower carpet,
 *   `garden-walk` and `flower-grove` own the rest of the open expanse. So "a
 *   meadow of flowers with mountains behind it" is ALREADY THIS BOT and this path
 *   would not have earned a slot. Its differentiator is ALTITUDE AS A PHYSICAL
 *   FACT, in the NEAR ground of every render — rock, scree, old snow, meltwater,
 *   ground-hugging growth, an ice field above and a tree line ending below — not
 *   as a backdrop. If a render could be mistaken for `flower-fields`, it failed.
 *
 * FUNCTION-FORM + SELF-CONTAINED (the ToyBot Stage-O / FaeBot apothecary pattern):
 *   this file loads its own six seed JSONs and inlines its whole brief. It touches
 *   NO shared bot file — no pools.js entry, no archetypes.js entry, no
 *   archetype-templates.js entry. Registration is a handful of lines in index.js
 *   (see the REGISTRATION block at the bottom of this file).
 *
 *   Function-form also buys the single most important thing this path needs:
 *   index.js's `buildBrief` prepends the bot-wide LUSH_HERO_MANDATE ("blooms FILL
 *   the frame … dominating 60%+ … any setting is ONLY a backdrop … pack the frame
 *   edge-to-edge") to DECLARATIVE paths only. That mandate is the exact opposite
 *   of this path's identity — it would erase the rock and the snow. A function
 *   path receives only the rolled LOOK REGISTER override, which is what we want.
 *
 * 6 AXES (5 always-on + 1 gated at 0.6):
 *   meadow_ground   HERO — the stage: the flowers AND the rock / snow / meltwater
 *                   breaking up through them. Leads with its defining mass.
 *   flower_cast     ★ which alpine species, in their REAL prior colours, growing
 *                   the way altitude makes them grow
 *   altitude_fact   ★ the one visible thing that proves height
 *   mountain_light  ★ owns the entire palette; two named colours, warm against cool
 *   high_life       (0.6 gate) ONE whole high-altitude animal, size welded to a
 *                   big fixed thing in frame, and NO detail exemption
 *   charm           one clever detail the eye finds on second look
 *
 * DELIBERATELY NOT CONSUMED — sharedDNA.palette / .roster / .lighting. BloomBot's
 *   flower engine rolls a colour theme and a species roster from its temperate
 *   general pool (roses, dahlias, tulips, hydrangeas) and a bot-wide lighting
 *   pool. Injecting those here would put garden flowers above the tree line and
 *   would fight the light axis for the palette (the axis-clean law). `flower_cast`
 *   owns species and colour; `mountain_light` owns the palette. sharedDNA's
 *   `lookRegister` IS used — index.js injects it automatically.
 *
 * THE FIVE TRAPS THIS PATH IS BUILT AGAINST (all playbook-documented):
 *   1. THE JARGON TRAP (lesson 28, the BrickBot "envelope"). Alpine botany's own
 *      correct words are confident WRONG pictures: `cushion plant` renders a sofa
 *      cushion, `rosette` a prize ribbon, `alpenrose` a rose, `harebell` a hare,
 *      `crowfoot` a crow, and `col` / `tarn` / `moraine` / `bract` have no
 *      layperson prior at all. All banned in the recipe; growth habit is described
 *      with VERBS and plain shapes instead. Swept and verified.
 *   2. HUMAN-BUILT FEATURES (EarthBot lesson 8). Flux's alpine training data is
 *      saturated with hiking trails, trail markers, alpine huts, cable cars and
 *      SUMMIT CROSSES. Per lessons 26/27 an absence gets backfilled, so the rule
 *      is not "no trail" — the ground between the flowers is POSITIVELY filled
 *      with bare rock, loose stone, old snow and running meltwater out to the
 *      frame edges, so there is nowhere a path could be.
 *   3. THE SCALE TRAP (lesson 13 + its 2026-09-23 correction). A low count is the
 *      giant-creature generator, so insects are always "twenty or more". A ruler
 *      must be welded to something big and fixed in frame (the snow patch, the
 *      rock face) — never an off-camera thumb. And NO SUBJECT GETS A DETAIL
 *      EXEMPTION: the reason is stated in the template so it survives editing.
 *   4. THE POSTCARD (the motto). "A meadow with mountains behind it" is clean,
 *      competent and forgettable — the exact miss the bar names. Beaten
 *      structurally by putting the altitude facts in the NEAR ground and by a
 *      dedicated always-on `charm` axis.
 *   5. THE CORRIDOR (lessons 17 / 24 / 29). Ground features run ACROSS the picture
 *      from side edge to side edge with their ends out of frame; `converging`,
 *      `vanishing point` and `apex` are banned from every pool, the hero one
 *      included (lesson 29: a vanishing point can be authored into a hero entry
 *      where the ground rule cannot reach it).
 *
 * CROSS-AXIS RESOLUTIONS (found by the local brief dry-run, lesson 16 — no axis
 *   exempted from its own probe):
 *   - a crack-only ground plan vs a single-species flood in the cast → THE GROUND
 *     PLAN WINS; the flowers go wherever this ground leaves room for them.
 *   - flying insects vs a cold / storm / dusk light roll → they settle onto the
 *     flowers instead of flying. Physically true, and a better beat.
 */

const fs = require('fs');
const nodePath = require('path');

function load(name) {
  return JSON.parse(
    fs.readFileSync(nodePath.join(__dirname, '..', 'seeds', `${name}.json`), 'utf8')
  );
}

const GROUND = load('bloombot_alpine_meadow_ground');
const FLOWER_CAST = load('bloombot_alpine_meadow_flower_cast');
const ALTITUDE_FACT = load('bloombot_alpine_meadow_altitude_fact');
const LIGHT = load('bloombot_alpine_meadow_light');
const HIGH_LIFE = load('bloombot_alpine_meadow_high_life');
const CHARM = load('bloombot_alpine_meadow_charm');

const HIGH_LIFE_GATE = 0.6;

module.exports = ({ vibeDirective, picker }) => {
  const ground = picker.pickWithRecency(GROUND, 'alpine_meadow_ground');
  const flowerCast = picker.pickWithRecency(FLOWER_CAST, 'alpine_meadow_flower_cast');
  const altitudeFact = picker.pickWithRecency(ALTITUDE_FACT, 'alpine_meadow_altitude_fact');
  const light = picker.pickWithRecency(LIGHT, 'alpine_meadow_light');
  const charm = picker.pickWithRecency(CHARM, 'alpine_meadow_charm');
  const highLife =
    Math.random() < HIGH_LIFE_GATE
      ? picker.pickWithRecency(HIGH_LIFE, 'alpine_meadow_high_life')
      : null;

  const lifeSection = highLife
    ? `
━━━ 5. THE ONE HIGH-MOUNTAIN ANIMAL (small in frame, never centred) ━━━
${highLife}
One whole animal, head and body both visible, its size pinned by the big fixed thing named beside it. If the light just rolled is cold, storm-dark or failing, flying insects are settled onto the flowers rather than in the air.
`
    : `
━━━ 5. THE MEADOW ALONE ━━━
Nothing moves here but the water and the light: meltwater running over stone, and the flowers standing in it.
`;

  return `You are a fine-art painter writing ONE Flux prompt for a WILDFLOWER MEADOW AT THE SNOWLINE — a high alpine meadow thousands of feet above the last trees, where the flowers share the ground with bare rock and lying snow.

━━━ RULE A. ALTITUDE IS A PHYSICAL FACT IN THE NEAR GROUND, NOT A BACKDROP (READ FIRST) ━━━
This is NOT a meadow with mountains behind it. Height must be visible in the FRONT of the picture, close to the camera: bare grey broken rock and loose stone coming up THROUGH the flowers, a patch of old snow lying IN the meadow, clear cold meltwater running over stone. The flowers hold about half the ground and the rock, snow and water hold the other half, and BOTH are near the camera. The plants grow flat and tight against the ground, pressed low out of the constant wind, and nothing is a smooth continuous lawn. EVERY PLANT IN THIS PICTURE IS LOW: nothing growing here stands taller than the boulders it grows between, so the only tall things in frame are rock, snow and distance. Above the meadow and along both its sides the slopes carry bare rock ribs, fans of loose stone and old snow all the way to the top of the frame. Ground features run ACROSS the picture from one side edge to the other with their ends out of frame; never a line of anything running away into the distance.

━━━ RULE B. NOT ONE PERSON IN THE FRAME ━━━
Flux's training data for a high mountain meadow is full of walkers, so it tries to stand a small dark figure on a boulder in the middle distance, on the rock rib above the flowers, or far up the valley. Override that bias. Those middle-distance boulders carry nothing but old snow in their hollows and flowers in their cracks. The only things standing anywhere in this picture are rock, flowers and snow, and the only living things are the plants and, if one is named below, a single wild animal.

━━━ RULE B2. NOTHING BUILT — THE GROUND IS ALREADY FULL ━━━
The space between the flowers is bare broken rock, loose stone, old snow or running meltwater, right out to the edges of the picture, so there is nowhere a path could be. Every surface in frame is living plant, rock, snow, water or animal. Nothing in this picture carries a mark, a letter or a painted shape of any kind.

━━━ RULE C. THE GROUND PLAN WINS ━━━
The ground below sets where flowers can and cannot grow. The flower cast fills whatever room that ground leaves them — crammed into seams if the rock is solid, flooding the slope if the ground is open. Never contradict the ground plan to fit more flowers in.

━━━ RULE D. NO SUBJECT GETS A DETAIL EXEMPTION ━━━
Never single one flower, one insect or one animal out for a close anatomical description. The one you describe most is the one that comes out biggest, and a giant insect or a bird-sized butterfly ruins the frame. Everything stays at the size the picture says it is.

━━━ 1. THE GROUND (the hero — the flowers AND the rock, snow and water through them) ━━━
${ground}
Render this ground exactly, filling the near and middle of the frame.

★━━━ 2. THE FLOWER CAST (the named species, each in its own real colour, growing low) ━━━
${flowerCast}

★━━━ 3. THE FACT THAT PROVES THE HEIGHT (must be visible — without it this is just a meadow) ━━━
${altitudeFact}

★━━━ 4. THE LIGHT (it owns the whole palette — commit fully) ━━━
${light}
Commit to this light completely and name the surface it lands on. High light is thin and unfiltered: shadows cut sharp-edged, the sky darkening as it climbs, the far ranges hard-edged and each one paler than the last.
${lifeSection}
━━━ 6. THE ONE CLEVER DETAIL ━━━
${charm}

━━━ MOOD ━━━
${vibeDirective ? String(vibeDirective).slice(0, 120) : ''}

━━━ LENGTH IS THE FIRST RULE — 95-125 WORDS, COUNT THEM ━━━
A tight 110-word meadow beats a crammed 250-word one. Write comma-separated phrases in THIS order and then STOP:
[name it plainly in the rolled look — for example "a high wildflower meadow at the snowline"],
[the ground: the flowers AND the bare broken rock, loose stone, old snow and running meltwater coming up through them, close to the camera],
[the named flower species in their own colours, growing flat and tight to the ground],
[the fact that proves the height],
[what the light is doing, the surface it lands on, and the two colours it brings],${highLife ? '\n[the one small high-mountain animal],' : ''}
[the one clever detail],
[the slopes above and beside the meadow bare rock, loose stone and old snow to the top of the frame, the far ranges hard-edged and paling with distance].

Describe only what IS present — every phrase names something in the picture, never something absent. No preamble, no headers, no markers, no bullets, no bold labels.`;
};

/*
 * ── REGISTRATION (merge into scripts/bots/bloombot/index.js) ─────────────────
 * Nothing in pools.js, shared-blocks.js, archetypes.js or archetype-templates.js
 * changes — this file loads its own six seed JSONs and inlines its own brief.
 * Validated over 24 shadow renders (R1 3.54 → R2 4.13 → R3 4.13 → R4 4.67).
 *
 *  1. pathBuilders — add:
 *       'alpine-wildflower-meadow': require('./paths/alpine-wildflower-meadow'),
 *
 *  2. shadowPaths — this path only (nothing else is staged there today):
 *       shadowPaths: ['alpine-wildflower-meadow'],
 *
 *  3. chaos.skipPaths — add:
 *       'alpine-wildflower-meadow',
 *
 *  4. twoPassPolish.skipPaths — add:
 *       'alpine-wildflower-meadow',
 *
 *  5. mediumStyles — add the bot-only, code-only medium (NO DB row, NO migration:
 *     mediumStyles overrides the DB flux_fragment, and modelByPath below stops
 *     pickModel ever reading the absent dream_mediums.allowed_models row). This is
 *     THE load-bearing entry — see the note under 7.
 *       bloom_alpine_meadow:
 *         'flowers the vivid saturated hero, sharing the ground with bare broken rock and lying snow; medium and finish set by the look tokens opening this prompt',
 *
 *  6. mediumByPath — add (index.js has no mediumByPath block today, so create one):
 *       mediumByPath: {
 *         'alpine-wildflower-meadow': 'bloom_alpine_meadow',
 *       },
 *
 *  7. modelByPath — add (REQUIRED, not a preference: it bypasses pickModel so the
 *     code-only medium needs no dream_mediums row. Both models kept 50/50 —
 *     flux-1.1-pro-ultra signed 0 of 13 renders on this path, so no pin to pro):
 *       'alpine-wildflower-meadow': [
 *         'black-forest-labs/flux-1.1-pro-ultra',
 *         'black-forest-labs/flux-1.1-pro',
 *       ],
 *
 *  8. promptPrefixReplaceByPath — add. The bot-wide PROMPT_PREFIX ("abundant blooms
 *     filling the entire frame edge-to-edge … any setting is only a backdrop") is
 *     the frame-packing mandate this path must not carry:
 *       'alpine-wildflower-meadow':
 *         'a high-altitude wildflower meadow at the snowline, low tight flowers in dense clumps between bare grey broken rock and old snow lying in the meadow, a snowfield and bare peak standing above the flower line, thin hard clear mountain light',
 *
 *  9. promptSuffixByPath — add (index.js has no promptSuffixByPath block today, so
 *     create one). Keeps the bot suffix's load-bearing species-colour faithfulness
 *     and the fleet text suppressor; drops "depth built from receding layers of
 *     more blooms" and "the sky clean and clear", which fight bare rock and a
 *     storm-lit sky respectively:
 *       promptSuffixByPath: {
 *         'alpine-wildflower-meadow':
 *           'render every named species as that exact species in its named colour, bare broken rock and old snow visible between the flowers, the far ranges hard-edged and each one paler than the last, every layer crisply rendered, no text, no words, no watermarks, gallery quality',
 *       },
 *
 * 10. sensoryAnchors.pathContext — add:
 *       'alpine-wildflower-meadow': 'scene',
 *
 * 11. sensoryAnchors.poolsByChannelByPath — add (index.js has no
 *     poolsByChannelByPath block today, so create one). TWO reasons, both measured:
 *     (a) `requiredChannels: ['lightcolor']` fires on EVERY render and the shared
 *     scene.lightcolor pool names GARDEN species (rose, wisteria, tulip, magnolia,
 *     honeysuckle) — one would land above the tree line every time, and it would
 *     also fight this path's own light axis for the palette; (b) the 1-2 stochastic
 *     channels fall through to sensoryAnchors' built-in DEFAULT_POOLS, which are
 *     written for a FIGURE ("the press of jewelry at the throat", "boots sinking
 *     into soft ground", "cheeks flushed warm") on a bot that bans people.
 *       poolsByChannelByPath: {
 *         'alpine-wildflower-meadow': {
 *           lightcolor: [
 *             'light coming straight through the low petals from behind so they read as lit glass',
 *             'every shadow edge cut hard with no softness anywhere in it',
 *             'the old snow throwing light back up underneath the flowers',
 *             'one part of the slope lit and the rest of it held flat and dark',
 *             'wet stone going almost black and mirror-bright where the water runs over it',
 *             'the sky darkening steadily from the ridge line to the top of the frame',
 *           ],
 *           smell: [
 *             'cold stone and crushed flower stems',
 *             'snowmelt running over clean gravel',
 *             'thin dry air carrying almost no scent at all',
 *           ],
 *           sound: [
 *             'meltwater running somewhere under the snow',
 *             'one marmot whistle carrying right across the slope',
 *             'wind steady and unbroken over ground-low flowers',
 *             'loose stones shifting and settling downslope',
 *           ],
 *           touch: [
 *             'petals stiff and waxy in the cold',
 *             'sun hot on the stone while the air stays freezing',
 *             'grit and old granular snow underfoot',
 *           ],
 *           temperature: [
 *             'full sun and near-freezing at the same moment',
 *             'frost still holding in every shadow',
 *             'the snow patch throwing cold up out of the ground',
 *           ],
 *           weight: [
 *             'low flowers pressed flat by constant wind',
 *             'wet snow sagging off a rock edge',
 *             'stems bent under the weight of last season’s seed heads',
 *           ],
 *           air: [
 *             'air so thin the far distance stays hard-edged',
 *             'a shred of cloud dragging through the flowers',
 *             'grit lifting off the loose stone in a gust',
 *           ],
 *         },
 *       },
 *
 * Do NOT add this path to chaos.allowSubjectChaosPaths, and do NOT add it to
 * promptPrefixByPath (that PREPENDS; item 8 REPLACES, which is what is wanted).
 * Going live later = move the string from shadowPaths[] into paths[], changing
 * nothing else — every entry above is keyed by path name, so the look is a
 * faithful xerox of the approved shadow batch.
 */
