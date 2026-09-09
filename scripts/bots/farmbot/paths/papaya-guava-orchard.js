/**
 * FarmBot — papaya-guava-orchard (Phase 4: Tropical Farm, 2026-09-09).
 *
 * Section 16 example archetype. Place-led (the mixed papaya-and-guava
 * orchard is the hero, always named first — per the ⭐ CROSS-CUTTING
 * maxTokens lesson in FARMBOT_PATH_BUILD_STATE.md: Sonnet's brief-writing
 * call thins/drops content appearing LATE in a dense brief, so the bespoke
 * place block goes first, ahead of even the character block). Uses the
 * path-bespoke PAPAYA_GUAVA_ORCHARD_PLACE pool (required directly from its
 * JSON — NOT added to pools.js, see gen-papaya-guava-orchard-place-pool.js)
 * as the setting anchor, same pattern as mango-orchard-harvest.js /
 * pineapple-field-afternoon.js / sugarcane-field.js.
 *
 * TWO-TREE DIFFERENTIATOR from the other tropical orchard paths: the
 * bespoke pool bakes in BOTH papaya botany (tall single slender trunk,
 * fruit clustered high near the crown — genuinely hard to reach, hence the
 * bamboo picking pole with a basket/net attachment) AND guava botany
 * (shorter, bushier, multi-branched, round fruit within easy reach of a low
 * step-stool), alongside the shared harvest basket/wheelbarrow/sorting-table
 * imagery. Kevin's constraint (verbatim): "the important thing is that it
 * still feels like a charming FARM since this is FarmBot, just a tropical
 * farm" — so the pool's own meta-prompt strictly bans jungle/rainforest/
 * wild/untamed/wilderness/overgrown language, and this path file adds no
 * season/weather pick that could dilute that (see below).
 *
 * SEASON skipped entirely (Kevin's tropical-path directive — the temperate
 * 4-season framing doesn't fit a tropical climate). WEATHER_ATMOSPHERE is
 * ALSO skipped (same as mango-orchard-harvest.js/pineapple-field-afternoon.js)
 * — the bespoke PAPAYA_GUAVA_ORCHARD_PLACE pool already carries its own
 * warm/humid tropical light directly in every entry.
 *
 * ACTIVITY: the shared pool has NO tropical/orchard-appropriate entries.
 * Built a small path-local PAPAYA_GUAVA_ACTIVITY array instead (mirrors
 * mango-orchard-harvest.js's MANGO_HARVEST_ACTIVITY), covering BOTH trees
 * (pole-picking papaya from the crown, step-stool-picking guava from a low
 * branch) plus sorting-table actions.
 *
 * CHARACTER_ARCHETYPE — checked directly against farmbot_character_
 * archetype.json (116 entries): filtering by ['farm','leisure'] is a NO-OP
 * here too (67 of 116 entries carry the 'ANY' tag, which always passes
 * byTags/filterByTags regardless of requested tags — the documented
 * tropical-flower-garden.js lesson). Fixed the same way: a manual
 * ARCHETYPE_INCOMPATIBLE filter + a local pickOrchardCharacter().
 *
 * CAMERA_COMPOSITION manually filtered — excludes farmhouse-window/
 * barn-doorway/village/cottage/hedgerow/cozy-interior framings and every
 * "character tiny/dwarfed in a sweeping/rolling/sky-dominating landscape"
 * framing (the CAMERA_COMPOSITION re-pollution lesson).
 *
 * "Sometimes no human" + guaranteed ambient life (2026-09-09 standardization):
 * includeCharacter = Math.random() < 0.6. The no-character branch uses the
 * NEW pools.pickPureSceneLife() helper so a pure-scene render never comes
 * back bare.
 *
 * ⭐ TWO REAL BUGS FOUND + FIXED via round-1 QA (root-caused against the
 * actual stored `ai_prompt` for each render, not guessed from the image):
 *
 * 1. CAST-DETERMINATION TRUNCATION (new instance of the documented
 *    maxTokens:400 cross-cutting bug, but a WORSE failure mode than
 *    "missing decoration" — it silently flips the render's CORRECTNESS).
 *    Original template put the character block 2nd (right after place) but
 *    the "no human figure..." governing sentence + the guaranteed
 *    pools.pickPureSceneLife() ambient-life detail dead LAST, after camera/
 *    magic. Round-1 render `x653sq` (no-character branch) came back with
 *    Sonnet's own output cut off mid-sentence ("...layered celadon and,")
 *    — the entire "no human figure" instruction never survived to be
 *    written, and the rendered image shows an UNINVITED character (Flux
 *    defaulted toward a person anyway, primed by FARMBOT_COZY_NEUTRAL's own
 *    "any character in the frame..." language). A second render (`c3fwrq`,
 *    character branch) also truncated mid-word ("belted with a woven cord
 *    in braided och[re]") right as it was describing the character.
 *    FIXED the same way barn-animal-shelter-interior.js fixed its own
 *    "animals kept vanishing" bug: the cast-determining fact — is there a
 *    person, and (when not) the guaranteed ambient-life detail plus an
 *    anti-personification guard (see bug 2) — is now its OWN short block
 *    stated FIRST, ahead of even the place block, so it can never be
 *    truncated away. The character branch also gets a short up-front
 *    pointer (not the full block, to preserve place-as-hero) plus a
 *    strengthened closing instruction that the character must be a clear,
 *    prominent presence, not incidental — mitigating (not fully solving,
 *    see below) a second, more stochastic case (`kek9xw`) where a FULL,
 *    untruncated character description simply wasn't rendered by Flux, the
 *    same class of "generic tableau" drift the bot-paths skill's failure
 *    catalog already treats as a known low-rate stochastic risk, not fully
 *    engineerable away by prompt structure alone. Re-verify the
 *    character-drop rate in round 2 before deciding whether this needs a
 *    further structural change.
 *
 * 2. PER-OBJECT PERSONIFICATION ON A NO-CHARACTER RENDER — a NEW variant of
 *    the documented "round objects render with personified faces" bug.
 *    Round-1 `kc4rga` (no-character branch, animal roll fell back to an
 *    AMBIENT_LIFE ladybug pick) rendered EVERY papaya with a drawn cartoon
 *    face, plus round pale blob-creatures with faces in the background.
 *    Root cause, confirmed via the actual `ai_prompt`: Sonnet itself wrote
 *    "big bright sparkling cute anime eyes ON THE LADYBUGS, adorable
 *    rounded cute character proportions THROUGHOUT EVERY ELEMENT OF THE
 *    SCENE" — extending the look-register's character-eye language (meant
 *    only for an actual human character) onto the fruit/animal-life when no
 *    human was present to anchor it, the same class of Sonnet-invention
 *    risk documented for "horse keeper" (not a pool-data bug — my place
 *    pool already describes fruit clusters holistically per the standing
 *    guard). FIXED positively (never by naming "face"/"eyes" to ban them):
 *    the new front-loaded no-character CAST block explicitly states the
 *    fruit and any small creature keep their own true-to-life shape/color/
 *    texture, with the scene's charm carried entirely by linework/light/
 *    color — not by any added face or expression drawn onto an object.
 *    NOTE FOR THE ORCHESTRATOR: this risk is rooted in the SHARED
 *    FARMBOT_COZY_NEUTRAL fragment + look register (both bot-wide), so it
 *    could in principle recur on any other path's no-character branch, not
 *    just this one — flagged here as a cross-cutting lesson, not fixed at
 *    the shared-file level (out of this path's scope).
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Path-bespoke pool — required directly, NOT added to pools.js (shared
// file). See: scripts/gen-seeds/farmbot/gen-papaya-guava-orchard-place-pool.js
const PAPAYA_GUAVA_ORCHARD_PLACE = require('../seeds/farmbot_papaya_guava_orchard_place.json');

// Manual archetype filter — see the header note above (the byTags/"ANY"
// no-op lesson, same fix as tropical-flower-garden.js's pickGardenCharacter).
// Excludes occupation archetypes carrying props/tools genuinely incompatible
// with harvesting a papaya-and-guava orchard: bakery/café serving props
// (flour, dough-cutter, tray, teacup, dish towel), a shopkeeper's ledger/
// measuring tape, a weaver's shuttle/loom, a potter's clay-smudged
// apron/kiln, a carpenter's tool belt/saw, a fisher's net/lure/anchor
// charm, an innkeeper's bell/mug charm. Keeps farmer/gardener/shepherd/
// flower-seller/herbalist/generic farm girl-boy/settled-traveler
// archetypes, all of which read naturally tending an orchard.
const ARCHETYPE_INCOMPATIBLE =
  /\b(baker|café|cafe|coffee|dish towel|teacup|tray|shopkeeper|measuring tape|ledger|weaver|shuttle|loom|potter|clay[- ]smudged?|kiln|carpenter|tool belt|\bsaw\b|chisel|fisher|fishing|anchor charm|shell pendant|\blure\b|innkeeper|tavern|\binn\b|bell charm|mug charm|coin charm)\b/i;
const ORCHARD_ARCHETYPES = pools
  .filterByTags(pools.CHARACTER_ARCHETYPE, ['farm', 'leisure'])
  .filter((e) => !ARCHETYPE_INCOMPATIBLE.test(e.description));

// Replicates pools.pickCharacter()'s combining logic (archetype + gender-
// matched hairstyle + hair color + eye color + skin tone) but sources the
// archetype from the pre-filtered ORCHARD_ARCHETYPES above instead of the
// raw pool — see header note. Uses only pools.js's exported pieces, no
// pools.js edit.
function pickOrchardCharacter(picker, axisPrefix) {
  const archetype = picker.pickWithRecency(ORCHARD_ARCHETYPES, `${axisPrefix}_archetype`);
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

// Path-local activity pool (NOT a shared pools.js export — see header note).
// Covers BOTH trees so the two-tree premise reads as genuinely mixed, only
// used when a character is present.
const PAPAYA_GUAVA_ACTIVITY = [
  'Guiding a tall bamboo picking pole up into a papaya crown, easing its small basket around a ripe fruit and lowering it down slow and steady.',
  'Crouching beside a low guava tree on a wooden step-stool, reaching into the branches to give a ripe guava a gentle twist until it comes free.',
  'Standing on a low step-stool to cup a round guava in one palm, checking its color before snapping it free of the branch.',
  'Lowering a woven basket of just-picked papayas down from beside a tall trunk, easing it into open arms below before setting it in the grass.',
  'Sorting a mix of papayas and guavas at the wooden fruit-sorting table, setting each piece down by hand into its own loose pile.',
  'Wiping a forearm across a warm brow in the humid shade between the rows, pausing beside a half-filled basket before reaching for the next cluster.',
  'Carrying a full, heavy basket balanced against one hip, walking the swept path back down the row toward the wheelbarrow.',
  'Turning a just-picked papaya over in both hands near the sorting table, giving it an unhurried, careful squeeze near the stem to check it is ready.',
];

module.exports = ({ sharedDNA, picker }) => {
  // "Sometimes no human" rule, standardized bot-wide 2026-09-09: exactly
  // 0.6 (not the older 0.65-0.7 range earlier tropical paths used).
  const includeCharacter = Math.random() < 0.6;

  const place = picker.pickWithRecency(PAPAYA_GUAVA_ORCHARD_PLACE, 'papaya_guava_place');

  const character = includeCharacter ? pickOrchardCharacter(picker, 'papaya_guava_character') : null;

  const activity = includeCharacter
    ? picker.pickWithRecency(PAPAYA_GUAVA_ACTIVITY, 'papaya_guava_activity')
    : null;

  // Manual content filter (CAMERA_COMPOSITION is untagged anyway): drops
  // indoor/village-scale framings that are a physical-setting mismatch for
  // an open orchard, PLUS every "tiny/dwarfed/small within/sweeping/rolling/
  // sky dominating" scale-dissolving framing — filtered broadly per the
  // CAMERA_COMPOSITION re-pollution lesson, not just one keyword.
  const CAMERA_INCOMPATIBLE =
    /\bbarn\b|\bfarmhouse\b|\bvillage\b|\brooftops?\b|\bcottages?\b|\bhedgerows?\b|\bcosy interior\b|\bcozy interior\b|\binterior\b|\brolling\b|\bsweeping\b|\btiny\b|\bdwarfed\b|\bsmall within\b|\bsky dominating\b/i;
  const camera = picker.pickWithRecency(
    pools.CAMERA_COMPOSITION.filter((e) => !CAMERA_INCOMPATIBLE.test(e)),
    'papaya_guava_camera'
  );

  // Path's own tag-filtered animal candidate pool — low/medium density,
  // excludes indoor/cottage-only settings that don't fit an open orchard.
  const ORCHARD_ANIMAL_POOL = pools.ANIMAL_COMPANIONS.filter(
    (e) =>
      (e.tags.includes('low') || e.tags.includes('medium')) &&
      !/cottage|farmhouse|windowsill|mudroom/i.test(e.description)
  ).map((e) => e.description);

  let animal = null;
  if (includeCharacter) {
    const animalChance = 0.4;
    animal = Math.random() < animalChance ? picker.pickWithRecency(ORCHARD_ANIMAL_POOL, 'papaya_guava_animal') : null;
  } else {
    // NEW, REQUIRED (Kevin 2026-09-09): guarantee ambient life in the
    // no-character branch via the shared helper — never returns null, falls
    // back to an AMBIENT_LIFE pick (butterfly/bee/firefly/etc) if the
    // animal roll misses, so a pure-scene render never comes back bare.
    animal = pools.pickPureSceneLife(picker, {
      animalPool: ORCHARD_ANIMAL_POOL,
      animalChance: 0.75,
      ambientTags: ['outdoor'],
      axisPrefix: 'papaya_guava',
    });
  }

  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'papaya_guava_magic')
      : null;

  // ⭐ Front-loaded CAST block — see header bugs 1 & 2. Stated FIRST (ahead
  // of even the place block) so it can never be truncated away by Sonnet's
  // fixed maxTokens:400 brief-writing call, regardless of how much budget
  // the place/camera/activity description below consumes.
  const castLine = character
    ? `━━━ THE CAST (essential — read first): exactly ONE character appears in this scene, described in full below — render them as a clear, prominent, unmistakable presence, never a distant or incidental detail lost in the setting ━━━\n\n`
    : `━━━ THE CAST (essential — read first): NO human figure appears anywhere in this scene ━━━
This is a still-life orchard moment, and it is never a bare or lifeless
one. Establish this required, concrete, clearly-visible small detail of
life or atmosphere FIRST, before describing anything else in the frame — it
is not optional background mood, it must actually appear in the render:
${animal}
Every piece of fruit, and any small creature or detail present, keeps its
own true-to-life shape, color, and texture — the scene's charm comes
entirely from its warm linework, light, and color, never from any added
face or expression drawn onto an object.

`;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}${castLine}━━━ THE PAPAYA & GUAVA ORCHARD (the hero of the shot) ━━━
${place}
This is a small, lovingly hand-tended tropical farm orchard — neat, mixed
rows of tall papaya trees and shorter, bushier guava trees, cared for by a
family or small crew — never a wild jungle or untamed wilderness.
${character ? `\n━━━ THE CHARACTER ━━━\n${character}\n` : ''}
${activity ? `━━━ WHAT'S HAPPENING ━━━\n${activity}\n\n` : ''}━━━ CAMERA ━━━
${camera}
${character && animal ? `\n━━━ ANIMAL COMPANY ━━━\n${animal}\n` : ''}
${magic ? `━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  character
    ? `render a warm, unhurried tropical papaya-and-guava harvest moment — the
orchard, the character, and every piece of just-picked fruit rendered with
equal loving richness, never a bare or empty composition. The character is
a clear, prominent, unmistakable presence in the frame, never small,
distant, or lost among the trees. Every face in the frame, human and animal
alike, stays clearly separate and fully legible.`
    : `Reinforcing once more: no human figure anywhere in the frame — this is a
warm, unhurried tropical papaya-and-guava orchard still-life moment carried
entirely by the trees, the picking pole, the step-stool, the baskets of
just-picked fruit, and this small, clearly-visible detail of life or
atmosphere, which MUST actually appear in the finished render, not just be
implied: ${animal}
Every detail is rendered with equal loving richness, never a bare or empty
composition. If a small creature is present, it keeps its own natural,
true-to-life face with its own clearly legible expression and open air
around it — never an added cartoon face drawn onto any piece of fruit or
foliage.`
} no text, no words, no watermarks, gallery quality`;
};
