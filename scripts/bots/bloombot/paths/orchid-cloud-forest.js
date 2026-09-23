/**
 * BloomBot orchid-cloud-forest path (2026-09-23) — BloomBot's FIRST path where
 * nothing in the picture is planted in the ground, and its first path staged
 * INSIDE weather rather than under it.
 *
 * THE SOUL OF THE PATH:
 *   A soaking tropical mountain forest standing inside the cloud. Every flower
 *   in frame is an orchid or a bromeliad rooted in a pad of moss ON BARK — on a
 *   limb, on a trunk, on the flank of a fallen trunk — holding on with its own
 *   pale roots. The cloud stands in the air BETWEEN THE TRUNKS at the camera's
 *   own height, thick enough that the second tree back has gone soft and the
 *   fourth is gone entirely. Behind and above everything is a wall of dripping
 *   green running up out of the top of the frame: no sky, no canopy, no horizon.
 *   Water is beaded on every leaf and petal. And against all that wet near-black
 *   green, ONE saturated colour is loud.
 *
 * WHY IT EXISTS (the gap, audited before a line was written): this is the
 *   highest-overlap path in BloomBot's queue. It collides with THREE live paths
 *   — `tropical-paradise` (dense jungle floral scene, ground beds and canopy
 *   shafts, "the sky clean and clear"; 56 of its 200 setting entries already
 *   carry moss / mist / bromeliad / epiphyte words and ONE is literally
 *   "CLOUD-FOREST WATERFALL WITH HANGING ORCHIDS"), `tropical-grove` (giant
 *   Dr-Seuss tropical mega-blooms on volcanic / lagoon / beach ground) and
 *   `conservatory` (glass-and-iron interior, overgrown). A ground bed of
 *   tropical flowers under palms is ALREADY THIS BOT, three times over.
 *   So the differentiator is not "tropical" and not "misty" — it is TWO
 *   structural facts that none of those three can produce:
 *     (1) EVERY FLOWER GROWS ON WOOD. The forest floor is not in the picture.
 *     (2) THE CLOUD IS A VISIBLE VOLUME AT EYE LEVEL, and it IS the background.
 *   If a render could be mistaken for `tropical-paradise`, it failed.
 *
 * FUNCTION-FORM + SELF-CONTAINED (the ToyBot Stage-O / FaeBot apothecary
 *   pattern, and the shape the sibling `alpine-wildflower-meadow` proved on this
 *   bot at 4.67): this file loads its own six seed JSONs and inlines its whole
 *   brief. It touches NO shared bot file — no pools.js entry, no archetypes.js
 *   entry, no archetype-templates.js entry. Registration is a handful of lines
 *   in index.js (see the REGISTRATION block at the bottom of this file).
 *
 *   Function-form also buys the single most important thing this path needs:
 *   index.js's `buildBrief` prepends the bot-wide LUSH_HERO_MANDATE ("blooms
 *   FILL the frame … dominating 60%+ … any setting is ONLY a backdrop … pack
 *   the frame edge-to-edge") to DECLARATIVE paths only. That mandate is a
 *   carpet-of-flowers instruction and it would erase the bark, the cloud and
 *   the wet green wall this path exists to show. A function path receives only
 *   the rolled LOOK REGISTER override, which is what we want.
 *
 * 6 AXES (5 always-on + 1 gated at 0.55):
 *   perch         HERO — the wet woody near surface everything rides on. Always
 *                 a FEATURE of a tree too big to fit in frame, never a whole
 *                 detachable object, and always WOOD (lesson 35).
 *   orchid_cast   ★ which species, in their REAL prior colours, and exactly how
 *                 they grip the wood
 *   cloud_state   ★ the money-shot axis: what the cloud is DOING in the frame,
 *                 at eye level, and what it does to whatever is behind it
 *   forest_light  ★ owns the entire palette; two named colours, and a source
 *                 that can physically exist inside this place (lesson 30)
 *   cloud_life    (0.55 gate) ONE whole cloud-forest animal, size welded to the
 *                 limb it is on, and NO detail exemption
 *   charm         one clever detail the eye finds on second look — and the axis
 *                 where the WATER lives
 *
 * DELIBERATELY NOT CONSUMED — sharedDNA.palette / .roster / .lighting.
 *   BloomBot's flower engine rolls a colour theme and a species roster, and even
 *   at biome='tropical' that roster is a garden/jungle cast picked for ground
 *   beds; injecting it here would put bedding flowers on the branches and would
 *   fight `forest_light` for the palette (the axis-clean law). `orchid_cast`
 *   owns species and colour; `forest_light` owns the palette. sharedDNA's
 *   `lookRegister` IS used — index.js injects it automatically.
 *
 * THE SIX TRAPS THIS PATH IS BUILT AGAINST (all playbook-documented):
 *   1. THE JARGON TRAP (lesson 28, the BrickBot "envelope"). Orchid botany is
 *      the worst minefield in the fleet: `lip` and `throat` render a MOUTH on
 *      the flower, `eye` an EYEBALL, `column` an architectural column (and that
 *      prior is live on this very bot via `conservatory`), `spur` a cowboy spur,
 *      `spike` a metal spike, `slipper` a shoe, `sheath` a knife sheath, `crown`
 *      a king's crown, `tank` a military tank, `rosette` a prize ribbon, `beard`
 *      a human beard. Common names are worse: "moth orchid" → a moth, "dancing
 *      lady" → a lady, "spider orchid" → a spider, "tulip orchid" → a tulip,
 *      "eyelash viper" → an eyelash, "GLASS frog" → actual glass, "staghorn
 *      fern" → antlers. All banned in the recipe though every one is correct;
 *      attachment is described with VERBS instead. `epiphyte` is banned for the
 *      opposite reason — no layperson prior at all, so it buys nothing.
 *   2. THE JUNGLE FLOOR — the collision itself. Per lessons 26/27 an absence
 *      gets backfilled, so the rule is never "no soil": the bottom of the frame
 *      is POSITIVELY filled with more wet bark, hanging moss, dripping fern and
 *      standing cloud, so there is nowhere a flower bed could be.
 *   3. OPEN SKY. Flux's tropical prior ships blue sky and palms, and BloomBot's
 *      own bot-wide PROMPT_SUFFIX literally asks for "the sky clean and clear"
 *      (dropped for this path — see promptSuffixByPath in the registration).
 *      Positive fill again: the background IS cloud plus a wall of wet green.
 *   4. THE CORRIDOR (lessons 17 / 24 / 29). A limb, a fallen trunk and a slope
 *      are all linear features. Every one runs ACROSS the picture with its ends
 *      out of frame; `converging`, `vanishing point`, `apex`, `tunnel`, `avenue`
 *      and `single point` are banned from every pool, the hero one included —
 *      and that ban earned its keep: the sweep caught the hero pool authoring
 *      "standing water … catching nothing but wet grey sky", which is exactly
 *      lesson 29's shape (a rule-breaking element written into the one pool the
 *      ground rule cannot reach).
 *   5. THE SCALE TRAP (lesson 13 + its 2026-09-23 correction). A low count is
 *      the giant-creature generator, so butterflies are always "a dozen or
 *      more". A ruler must be welded to something big and fixed IN frame whose
 *      own size is set by the tree — the limb's thickness, the trunk's width,
 *      the moss pad's length — never an off-camera thumb and never a
 *      free-floating object that would inflate with it. And NO SUBJECT GETS A
 *      DETAIL EXEMPTION: the reason is stated in the template so it survives
 *      editing. A pigeon-sized hummingbird ruins the frame.
 *   6. THE TASTEFUL GREY MONOCHROME (the motto). A cloud forest's own prior is a
 *      muted misty green-grey, which is clean, competent and forgettable — the
 *      exact miss the bar names. Beaten by the VIVID LAW in every pool recipe
 *      AND by naming the loud saturated colour inside the required output order,
 *      because a rule that must land on every render has to be in the order
 *      (lesson 22: a law on 25 of 25 seed tails reached 1 of 5 prompts).
 *
 * CROSS-AXIS RESOLUTIONS (found by the local brief dry-run, lesson 16 — no axis
 *   exempted from its own probe):
 *   - a perch that is an UNDERSIDE vs a cast that sits "along the top of the
 *     limb" → THE PERCH WINS; the cast goes wherever this wood offers a hold.
 *   - a `forest_light` roll naming an outdoor sun vs the enclosed-cloud premise
 *     → the recipe requires every light source to be renderable HERE (lesson
 *     30), and the sweep caught and fixed two entries that had put the forest
 *     FLOOR in frame to give the light somewhere to land.
 *   - `charm` is creature-free by recipe so a gated animal is never doubled.
 */

const fs = require('fs');
const nodePath = require('path');

function load(name) {
  return JSON.parse(
    fs.readFileSync(nodePath.join(__dirname, '..', 'seeds', `${name}.json`), 'utf8')
  );
}

const PERCH = load('bloombot_orchid_cloud_forest_perch');
const ORCHID_CAST = load('bloombot_orchid_cloud_forest_orchid_cast');
const CLOUD_STATE = load('bloombot_orchid_cloud_forest_cloud_state');
const LIGHT = load('bloombot_orchid_cloud_forest_light');
const CLOUD_LIFE = load('bloombot_orchid_cloud_forest_cloud_life');
const CHARM = load('bloombot_orchid_cloud_forest_charm');

const CLOUD_LIFE_GATE = 0.55;

module.exports = ({ vibeDirective, picker }) => {
  const perch = picker.pickWithRecency(PERCH, 'orchid_cloud_forest_perch');
  const orchidCast = picker.pickWithRecency(ORCHID_CAST, 'orchid_cloud_forest_orchid_cast');
  const cloudState = picker.pickWithRecency(CLOUD_STATE, 'orchid_cloud_forest_cloud_state');
  const light = picker.pickWithRecency(LIGHT, 'orchid_cloud_forest_light');
  const charm = picker.pickWithRecency(CHARM, 'orchid_cloud_forest_charm');
  const cloudLife =
    Math.random() < CLOUD_LIFE_GATE
      ? picker.pickWithRecency(CLOUD_LIFE, 'orchid_cloud_forest_cloud_life')
      : null;

  const lifeSection = cloudLife
    ? `
━━━ 5. THE ONE CLOUD-FOREST ANIMAL (small in frame, never centred) ━━━
${cloudLife}
One whole animal, head and body both visible — or, where the entry names a mass of butterflies, that whole mass. Its size is pinned by the limb, trunk or moss pad named beside it, and nothing about it is described more closely than the flowers are.
`
    : `
━━━ 5. THE FOREST ALONE ━━━
Nothing moves here but the water and the mist: water running off the moss and the mist drifting between the trunks.
`;

  return `You are a fine-art painter writing ONE Flux prompt for an ORCHID CLOUD FOREST — a soaking tropical mountain forest standing inside thick white mist, where the flowers grow on the trees instead of in the ground.

━━━ RULE A. EVERY FLOWER GROWS ON WET WOOD, CLOSE TO THE CAMERA (READ FIRST) ━━━
This is NOT a jungle floor and NOT a bed of tropical flowers. One big piece of soaking mossy TREE fills the near half of the picture — a limb, a trunk flank, a fork, the flank of a fallen trunk — and every flower in the frame is rooted in a pad of moss ON THAT WOOD, holding on with its own pale roots spread flat over the bark. The forest floor is simply not in this picture: the bottom of the frame is full of more wet bark, hanging moss, dripping fern and standing white mist, so there is nowhere a flower bed could be. The near wood runs ACROSS the picture from one side edge to the other with both of its ends out of frame; never a limb, trunk or stream running away into the distance.

━━━ RULE B. THICK WHITE MIST FILLS THE AIR BETWEEN THE TRUNKS, AND EVERY GAP IS FULL OF MORE FOREST ━━━
Write MIST, never cloud. The air itself is thick white mist standing BETWEEN the tree trunks at the camera's own height — mist you are standing inside, so thick that the near limb is razor sharp, the second trunk back has gone soft, the third is a pale grey shape and the fourth has dissolved into white. The mist is what the background of this picture is MADE OF.
And every gap between the near trunks is FULL: more wet mossy trunks stand in it, hanging moss and dripping fern hang across it, and all of that goes soft and then disappears into the white. There is no empty opening anywhere in this picture, no bright gap, no puffy white shape in the distance, no green hillside seen across a valley, and nothing overhead but more wet green running up out of the top of the frame. The canopy is far above and never in shot.

━━━ RULE C. NOT ONE PERSON, AND NOTHING BUILT — THE FRAME IS ALREADY FULL ━━━
Flux's cloud-forest training data is eco-tourism, so it tries to add a walkway, a handrail, a rope bridge, a small figure in a rain jacket, and little tags on the plants. Override that. Every surface in this picture is living plant, wet bark, soaking moss, running water, standing white mist or animal, right out to all four edges. The only flat surfaces anywhere in frame are LEAVES and flower faces, and every plant holds itself onto the wood with its own roots.

━━━ RULE D. THE WOOD WINS ━━━
The near wood above decides where flowers can and cannot sit. The flower cast goes wherever THAT piece of wood offers a hold — crowded along the top if it is a limb top, hanging straight down if it is an underside, spilling out of the fork if it is a fork. Never contradict the wood to fit more flowers in.

━━━ RULE E. SAY THE COLOUR BEFORE YOU SAY THE SPECIES ━━━
Measured over 12 renders: an orchid genus name does not carry its colour. "Stanhopea orchid, heavy waxy cream flowers" rendered pink; so did a green cymbidium and a lemon-yellow maxillaria, because a specialist orchid name collapses to Flux's generic pink orchid even with the colour word right beside it. So write the COLOUR WORD FIRST, then the plain shape, and put the species name last or leave it out: "dozens of tiny bright egg-yellow flowers, each a flat little star, packed along the bark", never "Maxillaria orchid with egg-yellow flowers". Whatever colour the cast section names is the colour that must be in the picture.

━━━ RULE F. NO SUBJECT GETS A DETAIL EXEMPTION ━━━
Never single one flower, one bird or one animal out for a close anatomical description. The one you describe most is the one that comes out biggest, and a pigeon-sized hummingbird ruins the frame. Everything stays at the size the picture says it is.

━━━ 1. THE NEAR WOOD (the hero — the wet mossy tree everything rides on) ━━━
${perch}
Render this wood exactly, filling the near half of the frame.

★━━━ 2. THE FLOWER CAST (lead with the COLOUR, not the species name — see the colour rule below) ━━━
${orchidCast}

★━━━ 3. WHAT THE MIST IS DOING (must be visible as thick white air between the trunks) ━━━
${cloudState}

★━━━ 4. THE LIGHT (it owns the whole palette — commit fully) ━━━
${light}
Commit to this light completely and name the wet surface it lands on. Against all this near-black green and soaked brown bark, ONE colour is saturated and LOUD — name it plainly.
${lifeSection}
━━━ 6. THE ONE CLEVER DETAIL ━━━
${charm}

━━━ MOOD ━━━
${vibeDirective ? String(vibeDirective).slice(0, 120) : ''}

━━━ LENGTH IS THE FIRST RULE — 95-125 WORDS, COUNT THEM ━━━
A tight 110-word forest beats a crammed 250-word one. Write comma-separated phrases in THIS order and then STOP:
[name it plainly in the rolled look — for example "a soaking misty tropical mountain forest"],
[the near wet mossy wood, close to the camera, its ends running out of frame both sides],
[the orchids NAMED BY COLOUR AND SHAPE FIRST — say the colour word before anything else, then the flower's shape, then its species name if at all — rooted in moss on that wood, their pale roots spread flat over the bark],
[thick white mist standing in the air between the trunks at the camera's own height, more wet mossy trunks and hanging moss standing in every gap behind it and going soft and then gone in the white],
[what the light is doing, the wet surface it lands on, and the two colours it brings — one of them loud and saturated],${cloudLife ? '\n[the one small cloud-forest animal],' : ''}
[the one clever detail],
[water beaded on every leaf and petal, and behind everything a wall of dripping green plants running up out of the top of the frame].

Describe only what IS present — every phrase names something in the picture, never something absent. No preamble, no headers, no markers, no bullets, no bold labels.`;
};

/*
 * ── REGISTRATION (merge into scripts/bots/bloombot/index.js) ─────────────────
 * Nothing in pools.js, shared-blocks.js, archetypes.js or archetype-templates.js
 * changes — this file loads its own six seed JSONs and inlines its own brief.
 * EVERY block below ALREADY EXISTS in index.js (the alpine + coastal siblings
 * created them), so this merge is pure additions — no new blocks to create.
 * Verified: all 11 edits applied to a throwaway copy of the CURRENT index.js,
 * every anchor asserted unique, then 23 assertions run against the loaded bot
 * (path resolves · shadow not live · chaos+polish skipped · prefix replaced not
 * prepended · buildBrief composes · look register injected · bot-wide
 * LUSH_HERO absent · both siblings intact · all 29 other paths still build).
 * Measured over 21 shadow renders: R1 3.92 → R2 4.13 → R3 4.42, +3 confirmation.
 *
 *  1. pathBuilders — add:
 *       'orchid-cloud-forest': require('./paths/orchid-cloud-forest'), // 2026-09-23 SHADOW
 *
 *  2. shadowPaths — append to the existing array:
 *       shadowPaths: ['alpine-wildflower-meadow', 'coastal-cliff-bloom', 'orchid-cloud-forest'],
 *
 *  3. chaos.skipPaths — add:
 *       'orchid-cloud-forest',
 *
 *  4. twoPassPolish.skipPaths — add:
 *       'orchid-cloud-forest',
 *
 *  5. mediumStyles — add the bot-only, code-only medium (NO DB row, NO migration:
 *     mediumStyles overrides the DB flux_fragment, and modelByPath below stops
 *     pickModel ever reading the absent dream_mediums.allowed_models row). This
 *     is THE load-bearing entry: the bot-wide BLOOM_NEUTRAL fragment sits at
 *     words 40-78 of every prompt, dead centre of the attended first third, and
 *     mandates "lush abundant blooms FILLING THE FRAME as the unmistakable
 *     hero" — a carpet-of-flowers instruction that would erase the bark, the
 *     mist and the wet green wall. The bot's own heroMandate escape hatch lives
 *     in the Sonnet brief and cannot reach a Flux-side fragment.
 *       bloom_cloud_forest:
 *         'orchids the vivid saturated hero, growing on wet mossy bark and branches against dark wet green and standing white mist; medium and finish set by the look tokens opening this prompt',
 *
 *  6. mediumByPath — add:
 *       'orchid-cloud-forest': 'bloom_cloud_forest',
 *
 *  7. modelByPath — add (REQUIRED, not a preference: it bypasses pickModel so
 *     the code-only medium needs no dream_mediums row). Both models 50/50 —
 *     see the MODEL NOTE at the end of this block:
 *       'orchid-cloud-forest': [
 *         'black-forest-labs/flux-1.1-pro-ultra',
 *         'black-forest-labs/flux-1.1-pro',
 *       ],
 *
 *  8. promptPrefixReplaceByPath — add. The bot-wide PROMPT_PREFIX ("abundant
 *     blooms filling the entire frame edge-to-edge … any setting is only a
 *     backdrop") is the second frame-packing mandate this path must not carry.
 *     Positive-only: this string is concatenated STRAIGHT into the Flux prompt,
 *     so a negation here is the dangerous class (playbook lesson 32):
 *       'orchid-cloud-forest':
 *         'a wet tropical cloud-forest slope, orchids and bromeliads rooted in moss on the branches and bark of the trees, thick white mist standing in the air between the trunks at eye level, more wet mossy trunks and hanging moss filling every gap behind them',
 *
 *  9. promptSuffixByPath — add. Keeps the bot suffix's load-bearing
 *     species-colour faithfulness and the fleet text suppressor; DROPS "depth
 *     built from receding layers of more blooms" (this path's depth is MIST, and
 *     receding layers is also a corridor generator) and "the sky clean and
 *     clear" (fatal — no sky is visible in this path at all):
 *       'orchid-cloud-forest':
 *         'render every named species as that exact species in its named colour, every flower in frame growing on wet mossy bark and branches, water beaded on every leaf and petal, depth built from the mist thickening between the trunks until it swallows the far trees, the near plants crisply rendered, no text, no words, no watermarks, gallery quality',
 *
 * 10. sensoryAnchors.pathContext — add:
 *       'orchid-cloud-forest': 'scene',
 *
 * 11. sensoryAnchors.poolsByChannelByPath — add. TWO reasons, both measured on
 *     the sibling path: (a) `requiredChannels: ['lightcolor']` fires on EVERY
 *     render and the shared scene.lightcolor pool names GARDEN species (rose,
 *     wisteria, tulip, magnolia, honeysuckle) — one would land on a cloud-forest
 *     branch every time, and it would also fight this path's own light axis for
 *     the palette; (b) the 1-2 stochastic channels fall through to
 *     sensoryAnchors' built-in DEFAULT_POOLS, which are written for a FIGURE
 *     ("the press of jewelry at the throat", "boots sinking into soft ground")
 *     on a bot that bans people.
 *       'orchid-cloud-forest': {
 *         lightcolor: [
 *           'light coming through one thin fern leaf so the leaf reads as lit right through',
 *           'the mist behind the near limb packed so bright the wet flowers look cut out of it',
 *           'every beaded drop on every leaf holding one hard white point of light',
 *           'one saturated colour loud against wet near-black green everywhere else',
 *           'wet bark going almost black and mirror-bright where the water runs over it',
 *           'the standing water in a bromeliad holding a small reversed picture of the branches above',
 *         ],
 *         smell: [
 *           'wet moss and rotting wood',
 *           'cold clean rain on warm bark',
 *           'air so wet it has almost no smell of its own',
 *         ],
 *         sound: [
 *           'water dripping off a hundred leaf tips at once, none of them together',
 *           'one unseen bird calling twice somewhere in the mist',
 *           'rain arriving on the canopy long before it arrives here',
 *           'the whole forest dripping steadily with no wind at all',
 *         ],
 *         touch: [
 *           'moss soaking wet and cold right through',
 *           'bark slick enough that nothing holds on it',
 *           'petals cool and waxy and beaded over',
 *         ],
 *         temperature: [
 *           'warm and soaking at the same moment',
 *           'the mist cold on the skin while the wood stays warm',
 *           'no dry surface anywhere in the frame',
 *         ],
 *         weight: [
 *           'a limb bent down under the weight of everything growing on it',
 *           'moss so waterlogged it sags away from the bark',
 *           'one drop hanging heavy off a leaf tip and not falling',
 *         ],
 *         air: [
 *           'air thick enough to see, standing still between the trunks',
 *           'mist pouring sideways through a gap fast enough to watch',
 *           'the air so full of water it is beading out onto the moss',
 *         ],
 *       },
 *
 * Do NOT add this path to chaos.allowSubjectChaosPaths, and do NOT add it to
 * promptPrefixByPath (that PREPENDS; item 8 REPLACES, which is what is wanted).
 * Going live later = move the string from shadowPaths[] into paths[], changing
 * nothing else — every entry above is keyed by path name, so the look is a
 * faithful xerox of the approved shadow batch.
 *
 * ⚠️ MODEL NOTE (playbook lessons 6 + 33). This is a CONDITION-IDENTITY path —
 * the mist is its identity the way night is campfire-night's and firelight is
 * volcano-forge's — and flux-1.1-pro-ultra is a documented standing risk on
 * exactly that class (it reverted both of those to a golden-hour exterior).
 * Probed here over 21 renders and the worry did NOT materialise: ultra rendered
 * the standing mist correctly every time, produced the two best frames of the
 * build, and SIGNED 0 OF 21 (no lettering anywhere in the batch). So no pin is
 * needed and both models stay 50/50. Judge the model from `uploads.model`,
 * never from the iter-bot log.
 */
