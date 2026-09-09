/**
 * FarmBot — tropical-flower-garden (Phase 4: Tropical Farm, 2026-09-09).
 *
 * Section 16 example archetype, tropical variant. Place-led (the tropical
 * flower garden is the hero, always named first — put FIRST in the template
 * per the ⭐ CROSS-CUTTING maxTokens lesson in FARMBOT_PATH_BUILD_STATE.md:
 * Sonnet's brief-writing call uses a fixed maxTokens and drops/thins content
 * late in a dense brief). Uses the path-bespoke TROPICAL_FLOWER_GARDEN_PLACE
 * pool (required directly from its JSON — NOT added to pools.js, see
 * gen-tropical-flower-garden-place-pool.js) as the setting anchor, same
 * pattern as pineapple-field-afternoon.js / mango-orchard-harvest.js /
 * banana-grove-path.js use their own bespoke place pools.
 *
 * CRITICAL CREATIVE CONSTRAINT (Kevin, verbatim): "the important thing is
 * that it still feels like a charming FARM since this is FarmBot, just a
 * tropical farm." A charming, CULTIVATED tropical flower garden — hibiscus,
 * plumeria/frangipani, bird-of-paradise, orchids, bougainvillea — arranged
 * in a tended, personal-scale garden setting (raised beds, trellises, garden
 * paths, watering cans), NOT a wild tropical rainforest. The bespoke pool's
 * own gen script already bans jungle/rainforest/wild/untamed/wilderness/
 * overgrown language at the source; this path file's own closing description
 * reinforces the same cultivated/tended framing positively (never by naming
 * "jungle" to negate it — Flux doesn't process negation, CLAUDE.md).
 *
 * Per Phase 4 direction: SKIPS the shared SEASON pool entirely (a tropical
 * climate doesn't fit FarmBot's 4-season framework) AND skips the shared
 * WEATHER_ATMOSPHERE pool too, same as pineapple-field-afternoon.js and
 * mango-orchard-harvest.js — its entries lean on temperate-seasonal imagery
 * (rose petals, clover, cottage windows, meadows, blossom season) that would
 * be setting-incompatible with a tropical garden. The bespoke place pool
 * already carries its own warm/humid tropical light directly in every entry
 * (mist, midday sun, late-afternoon glow), so letting it own the atmosphere
 * outright avoids the "tags describe topic, not physical-setting
 * compatibility" trap documented for village-street-wandering.
 *
 * ACTIVITY: the shared pool DOES have a few flower/garden-adjacent entries
 * (a watering can over "a row of nodding flowers", arranging cut stems into
 * a vase/jug) but they're thin (4 entries total) and mostly generic-
 * temperate in flavor. Built a small path-local FLOWER_GARDEN_ACTIVITIES
 * array instead, same fallback pattern as pineapple-field-afternoon.js's
 * HARVEST_ANCHOR and mango-orchard-harvest.js's MANGO_HARVEST_ACTIVITY, so
 * every activity is unmistakably tropical-garden-tending (watering,
 * deadheading, snipping stems for a basket, tying vines to a trellis).
 *
 * CHARACTER_ARCHETYPE has no dedicated tropical-garden archetype, but the
 * existing 'farm'/'leisure'-tagged gardener entries fit perfectly as-is, and
 * the 'market'-tagged flower-seller/herbalist entries (carrying the 'ANY'
 * tag) surface too. HOWEVER — round-1 QA caught a REAL instance of the
 * documented byTags/"ANY" gotcha: `filterByTags(CHARACTER_ARCHETYPE,
 * ['farm','leisure'])` lets through the ENTIRE 116-entry pool (every single
 * entry carries either 'ANY' or 'farm'/'leisure' directly), including 12
 * bakery archetypes ("a small dough-cutter tucked neatly into" an apron —
 * verified via the actual DB `ai_prompt` on a round-1 render) plus café-
 * owner/shopkeeper/weaver/potter/carpenter/fisher/innkeeper archetypes whose
 * described props (a serving tray, a measuring tape, a potter's clay-smudged
 * apron, a fishing lure charm) are a physical/occupational mismatch for
 * someone tending a flower garden — same class as the "tags describe topic,
 * not physical-setting compatibility" lesson. Fixed with a manual archetype
 * filter (below) that excludes those occupation keywords, then a local
 * `pickGardenCharacter()` that otherwise replicates pools.pickCharacter()'s
 * combining logic exactly (archetype + gender-matched hairstyle + hair color
 * + eye color + skin tone) using pools.js's exported pieces — NOT a
 * pools.js edit. 60/116 archetypes survive (gardener, flower seller,
 * herbalist, generic farm girl/boy, shepherd, settled-traveler), plenty of
 * variety for MVP depth.
 *
 * CAMERA_COMPOSITION is manually filtered (not byTags — this pool is
 * untagged anyway) to drop entries with a physical-setting mismatch for an
 * open-air garden (village/rooftop/cottage/hedgerow/farmhouse/barn/cozy-
 * interior framings) AND the "character tiny/dwarfed in a sweeping/sky-
 * dominating landscape" framings — the CLAUDE.md-documented re-pollution
 * where the 20→120 scale-up reintroduced dwarfing language under NEW
 * phrasings beyond just "rolling" ("tiny," "dwarfed," "sky dominating,"
 * "sweeping"). Filtered broadly on all of those keywords, not just one.
 *
 * ANIMAL_COMPANIONS is filtered to low/medium density and manually excludes
 * entries assuming an indoor/windowsill/cottage/farmhouse setting — same
 * pattern as pineapple-field-afternoon.js.
 *
 * ROUND-2 FINDING (spontaneous Flux visual habit, not a prompt-text bug):
 * one no-character still-life render showed small blank plant-marker/stake
 * shapes standing in the beds even though NEITHER this path's bespoke place
 * pool NOR any template text here ever mentions a label/marker/tag/stake —
 * confirmed via the DB `ai_prompt` (zero matches for sign/marker/label/
 * stake). Flux appears to add this on its own as a generic "tended garden"
 * visual habit. No legible text/numerals appeared on them this time (unlike
 * the documented hallucinated-numerals bug), but it's the same latent
 * signage-hallucination risk family. Mitigated positively (never by naming
 * "marker"/"sign"/"stake" to ban them — Flux doesn't process negation): the
 * place-reinforcement line below now explicitly describes each bed's open
 * soil as holding "nothing but rich dark earth cradling the blooms," giving
 * Flux a concrete positive answer for what occupies that visual space
 * instead of inventing something. Re-verified clean on round 3.
 *
 * ━━━ 2026-09-09 RE-QA: cozy-composition fix (Kevin's post-launch audit) ━━━
 * Kevin personally reviewed a real render and flagged the compositional
 * register: a small, distant character standing under a huge ornamental
 * flower arch, reading as a wide landscape postcard rather than FarmBot's
 * normal close/medium character-forward framing. Root-caused with real DB
 * evidence (9 real `tropical-flower-garden` uploads, full `ai_prompt` pulled
 * — not guessed) to TWO real, confirmed mechanisms, in order of impact:
 *
 * 1. PRIMARY — the CAMERA_COMPOSITION filter below was far too permissive.
 *    The shared `farmbot_camera_composition.json` pool (109 entries) still
 *    contains ~9 literal "Wide establishing shot... vast... enormous sky"
 *    entries plus several "Low-angle view... the landscape rising grandly
 *    upward... nodding large in the near foreground" entries — the 2026-09-09
 *    "back-turned" bug-fix pass (see FARMBOT_PATH_BUILD_STATE.md) only ever
 *    purged the 11 over-the-shoulder entries from the LIVE pool (120→109)
 *    and blocked NEW dwarfing entries at the gen-script source; it never
 *    purged the dwarfing/wide-establishing entries already baked into the
 *    existing 109. This path's old blacklist regex (`tiny|dwarfed|sky
 *    dominating|sweeping|...`) only caught entries using those EXACT words —
 *    51/109 entries slipped through it uncaught, including every "Wide
 *    establishing shot" variant (no "tiny"/"dwarfed"/"sweeping" in that
 *    phrasing at all) and the "rising grandly... nodding large in the near
 *    foreground" low-angle variants. Confirmed via the real `ai_prompt` data:
 *    render `012b3d03` picked the "landscape rising grandly... nodding large
 *    in the near foreground" entry and rendered "Standing on the path
 *    mid-frame, framed by the rising garden and the grand foreground
 *    blooms, is a cozy baker..." — a small, framed-by-grandeur character,
 *    Kevin's exact complaint. Render `a769e696` picked a low-angle
 *    "sky/treetops arching large... overhead" entry and its character
 *    description got visibly thinned/truncated (see mechanism 2). FIXED:
 *    replaced the blacklist with a WHITELIST — only "Medium framing" /
 *    "Intimate close-up" / "Close intimate framing" / "Soft foreground
 *    foliage" entries survive (33/109, verified by category, zero
 *    wide-establishing or dwarfing entries among them) — every one of these
 *    is close/medium, character-forward, and garden-setting-compatible.
 * 2. COMPOUNDING — the CROSS-CUTTING maxTokens lesson (Sonnet's brief-writing
 *    call, fixed `maxTokens: 400`, content late in a dense brief gets
 *    dropped/thinned first) hits this path specifically hard whenever a
 *    verbose/establishing garden pick lands, because THE CHARACTER block
 *    sits 2nd (after the full garden paragraph) with no positive framing
 *    directive protecting it — 4 of the 5 real post-fix-archetype renders
 *    pulled show the character description visibly thinned or cut off
 *    mid-sentence before Sonnet ever reached CAMERA/ACTIVITY. FIXED: added a
 *    short, front-loaded FRAMING mandate (right after the look-register
 *    prefix, ahead of even the garden hero block — same proven pattern as
 *    `papaya-guava-orchard.js`'s CAST pointer and `barn-animal-shelter-
 *    interior.js`'s ANIMALS-first fix) stating the character (when present)
 *    is always close/medium-framed, large, and clearly the focus — cheap
 *    insurance that survives even a badly budget-starved brief — plus the
 *    same directive repeated a second time in the closing reinforcement
 *    paragraph (the proven "repeat guaranteed content" pattern from the
 *    `pickPureSceneLife` lesson).
 *
 * Also reworded 5/120 bespoke place-pool entries (indices 5, 17, 27, 48,
 * 101) that opened with "wide view"/"wide spread"/"wide, cheerful sweep"
 * establishing-shot language at the SETTING level, toward personal-scale
 * ("close-knit," "close at hand," "close-set") wording — a minor secondary
 * contributor, not the primary cause (the pool's actual arch/trellis
 * entries never use monumental words like "towering"/"massive"/"grand" —
 * scanned and confirmed clean; the tropical/flower-arch identity is fully
 * intact, only the 5 "wide"-framed openers changed).
 *
 * VERIFIED (round 1, 6 shadow-post renders, real DB `ai_prompt` + real
 * pixels inspected, not just text): direct before/after smoking-gun found —
 * pre-fix render `a769e696` (picked the old-pool "Low-angle view, ground
 * close, sky/treetops arching large overhead" entry, which the whitelist now
 * excludes) rendered EXACTLY Kevin's complaint: a tiny distant character
 * standing under a huge bougainvillea arch, framed symmetrically by two
 * palm trees — a genuine wide landscape postcard. Post-fix: 5/6 renders
 * with a character all show the character large/close/prominent in the
 * foreground both in Sonnet's own prompt text ("large and unmistakably
 * central," "filling the frame," "never distant or small against the
 * garden behind him") AND confirmed visually in the actual rendered
 * pixels; the 1 no-character render is a correctly-framed intimate close-up
 * on baby goats. Tropical identity (hibiscus/plumeria/bird-of-paradise/
 * bougainvillea/palm/garden arch) unmistakable in 5/6 renders; 1/6 leaned
 * slightly more generic-cottage in background (still mentioned bird-of-
 * paradise in its prompt) — normal per-render variance, not a pool/template
 * defect. Zero regressions on the standard bug list (negation, dark+light
 * pairing, back-turned camera, signage hallucination) — scanned + confirmed
 * clean. Signed off round 1. See FARMBOT_PATH_BUILD_STATE.md for the fuller
 * write-up if it gets folded in there.
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Path-bespoke pool — required directly, NOT added to pools.js (shared file,
// other agents may be editing it concurrently). See:
// scripts/gen-seeds/farmbot/gen-tropical-flower-garden-place-pool.js
const TROPICAL_FLOWER_GARDEN_PLACE = require('../seeds/farmbot_tropical_flower_garden_place.json');

// Manual archetype filter — see the header note above (round-1 QA finding).
// Excludes occupation archetypes carrying props/tools genuinely incompatible
// with tending a flower garden: bakery/café serving props (flour, dough-
// cutter, tray, teacup, dish towel), a shopkeeper's ledger/measuring tape, a
// weaver's shuttle/loom, a potter's clay-smudged apron/kiln, a carpenter's
// tool belt/saw, a fisher's net/lure/anchor charm, an innkeeper's bell/mug
// charm. Keeps gardener, flower-seller, herbalist, generic farm girl/boy,
// shepherd, and settled-traveler archetypes, all of which read naturally
// tending a garden.
const ARCHETYPE_INCOMPATIBLE =
  /\b(baker|café|cafe|coffee|dish towel|teacup|tray|shopkeeper|measuring tape|ledger|weaver|shuttle|loom|potter|clay[- ]smudged?|kiln|carpenter|tool belt|\bsaw\b|chisel|fisher|fishing|anchor charm|shell pendant|\blure\b|innkeeper|tavern|\binn\b|bell charm|mug charm|coin charm)\b/i;
const TROPICAL_GARDEN_ARCHETYPES = pools
  .filterByTags(pools.CHARACTER_ARCHETYPE, ['farm', 'leisure'])
  .filter((e) => !ARCHETYPE_INCOMPATIBLE.test(e.description));

// Replicates pools.pickCharacter()'s combining logic (archetype + gender-
// matched hairstyle + hair color + eye color + skin tone) but sources the
// archetype from the pre-filtered TROPICAL_GARDEN_ARCHETYPES above instead
// of the raw pool — see header note. Uses only pools.js's exported pieces,
// no pools.js edit.
function pickGardenCharacter(picker, axisPrefix) {
  const archetype = picker.pickWithRecency(TROPICAL_GARDEN_ARCHETYPES, `${axisPrefix}_archetype`);
  const gender = pools.genderOf(archetype) || 'ANY';
  const hairstyle = picker.pickWithRecency(pools.byTags(pools.HAIRSTYLE, [gender]), `${axisPrefix}_hairstyle`);
  const hairColor = picker.pickWithRecency(pools.byTags(pools.HAIR_COLOR, ['ANY']), `${axisPrefix}_hair_color`);
  const eyeColor = picker.pickWithRecency(pools.byTags(pools.EYE_COLOR, ['ANY']), `${axisPrefix}_eye_color`);
  const skinTone = picker.pickWithRecency(pools.byTags(pools.SKIN_TONE, ['ANY']), `${axisPrefix}_skin_tone`);
  return `${archetype.description}
Hair: ${hairColor} Styled: ${hairstyle}
Eyes: ${eyeColor}
Skin: ${skinTone}`;
}

// Small path-local anchor set (not a shared pool — no other path needs
// genuine tropical-flower-garden-tending actions) since the shared ACTIVITY
// pool has only a handful of thin, generic-temperate flower entries. Every
// entry reinforces cultivated, hand-tended, personal-scale garden work
// (never a wild-exploration pose), only used when a character is present.
const FLOWER_GARDEN_ACTIVITIES = [
  'Tipping a watering can in a slow steady stream over a raised bed of hibiscus, watching the water bead and run off the glossy petals.',
  'Kneeling beside a low trellis to guide a climbing stem of bougainvillea through the lattice, tying it loosely in place with a short length of twine.',
  'Snipping a few stems of plumeria with a small pair of shears, laying each one gently into a shallow woven basket at hand.',
  'Cupping a hand beneath an open bird-of-paradise bloom to steady it while pinching away a single spent flower with the other hand.',
  'Crouching along the garden path to tuck loose soil back around the base of a young orchid, patting it firm with both hands.',
  'Carrying a basket brimming with freshly cut hibiscus and bougainvillea blooms down the garden path, pausing to admire one more open flower.',
  'Coiling a garden hose back into a loose loop beside a raised bed, glancing back once at the freshly watered rows.',
  'Reaching up on tiptoe to trim a stray climbing vine back from the top rail of a garden arch, humid air warm against bare arms.',
];

module.exports = ({ sharedDNA, picker }) => {
  // Kevin (2026-09-09): "sometimes no human" rule — a pure tropical-garden
  // still-life (raised beds, trellis, watering can, open blooms) is just as
  // on-brand as a person tending it. ~65% chance of a character.
  const includeCharacter = Math.random() < 0.6;

  const garden = picker.pickWithRecency(TROPICAL_FLOWER_GARDEN_PLACE, 'tropical_flower_garden_place');

  const character = includeCharacter
    ? pickGardenCharacter(picker, 'tropical_flower_garden_character')
    : null;

  // Only meaningful when a character is present — see FLOWER_GARDEN_ACTIVITIES
  // note above for why this is a path-local set rather than the shared
  // ACTIVITY pool.
  const activity = includeCharacter
    ? picker.pickWithRecency(FLOWER_GARDEN_ACTIVITIES, 'tropical_flower_garden_activity')
    : null;

  // WHITELIST (not a blacklist) — see the 2026-09-09 RE-QA header note above.
  // The old blacklist regex only caught entries using its exact keywords and
  // let 51/109 entries slip through, including every "Wide establishing
  // shot" variant and the "landscape rising grandly... large in the near
  // foreground" low-angle variants — confirmed via real DB `ai_prompt`
  // evidence to be the primary driver of the "small distant character under
  // a huge arch" complaint. Only entries whose LEADING phrase is one of the
  // four confirmed close/medium, character-forward, garden-compatible
  // categories survive: "Medium framing", "Intimate close-up", "Close
  // intimate framing", "Soft foreground foliage" (33/109 entries). This
  // deliberately drops the entire "Wide establishing shot" and "Character
  // tiny/small/dwarfed" categories outright, plus every "Low-angle view"
  // entry (that category is a mixed bag — several explicitly say "rising
  // grandly"/"sky enormous" — not worth the risk for a path that needs to be
  // thorough about reducing wide/landscape framing).
  const CAMERA_COMPATIBLE = /^(Medium framing|Intimate close-up|Close intimate framing|Soft foreground foliage)/i;
  const camera = picker.pickWithRecency(
    pools.CAMERA_COMPOSITION.filter((e) => CAMERA_COMPATIBLE.test(e)),
    'tropical_flower_garden_camera'
  );

  const animalChance = includeCharacter ? 0.4 : 0.75;
  const animalPool = pools.ANIMAL_COMPANIONS.filter(
    (e) =>
      (e.tags.includes('low') || e.tags.includes('medium')) &&
      !/cottage|farmhouse|windowsill|mudroom/i.test(e.description)
  ).map((e) => e.description);
  const animal = includeCharacter
    ? Math.random() < animalChance
      ? picker.pickWithRecency(animalPool, 'tropical_flower_garden_animal')
      : null
    : pools.pickPureSceneLife(picker, {
        animalPool,
        animalChance,
        ambientTags: ['outdoor'],
        axisPrefix: 'tropical_flower_garden',
      });
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'tropical_flower_garden_magic')
      : null;

  // Front-loaded, short FRAMING mandate — see the 2026-09-09 RE-QA header
  // note. Placed ahead of even the garden hero block so it survives Sonnet's
  // fixed maxTokens budget regardless of how verbose the garden pick or
  // character description turn out to be (the proven pattern: barn-animal-
  // shelter-interior.js's ANIMALS-first block, papaya-guava-orchard.js's
  // CAST pointer). Kept to one short paragraph so the garden still gets
  // primary descriptive billing right after it.
  const framingMandate = character
    ? `━━━ FRAMING (essential, read first) ━━━
The camera holds close and medium on the character — they read large, warm,
and unmistakably the focus in the foreground of the shot, never a small or
distant figure dwarfed by the garden behind them.

`
    : '';

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}${framingMandate}━━━ THE TROPICAL FLOWER GARDEN (the hero of the shot) ━━━
${garden}
This is a small, cultivated, hand-tended farm garden — raised beds, a trellis
or two, a tidy path a family or small crew tends by hand — cheerful order
throughout, each bed's open soil holding nothing but rich dark earth
cradling the blooms and their leaves, bordered simply by its own wood or
stone edge, never a wild or untamed space.
${character ? `\n━━━ THE CHARACTER (close and prominent, not a distant speck) ━━━\n${character}\n` : ''}
${activity ? `━━━ WHAT'S HAPPENING ━━━\n${activity}\n\n` : ''}━━━ CAMERA ━━━
${camera}
${animal ? `\n━━━ ANIMAL COMPANY ━━━\n${animal}\n` : ''}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  character
    ? `render a warm, unhurried tropical-garden moment, framed close and
medium on the character — this is a small, cultivated, hand-tended flower
garden, NOT a wild jungle or rainforest, with the character large, clear,
and close at hand in the foreground, never a small or distant figure lost
in the garden behind them, the garden and every open bloom still rendered
with equal loving richness around them, never a bare or empty composition.
Every face in the frame, human and animal alike, stays clearly separate and
fully legible.`
    : `no human figure anywhere in the frame — this is a warm, unhurried
tropical-garden still-life moment carried entirely by the neat raised beds
and trellises of a small, cultivated, hand-tended flower garden (NOT a wild
jungle or rainforest) and whatever wildlife shares it, every open bloom
rendered with equal loving richness, never a bare or empty composition.${animal ? ' Any animal present reads as a real, naturally distinct creature with open air around it; any small insect, bird, or floating detail (petals, dust motes, fireflies) stays simple and unposed, with no invented face or cartoon expression.' : ''}`
}`;
};
