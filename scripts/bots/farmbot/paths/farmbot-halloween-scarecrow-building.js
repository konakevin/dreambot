/**
 * FarmBot — SEASONAL path: farmbot-halloween-scarecrow-building.
 *
 * ⚠️ ARCHITECTURALLY DIFFERENT from FarmBot's 29 normal-rotation paths — this
 * is a SEASONAL path, drawn ONLY during Halloween's calendar window via the
 * fleet-wide seasonal mechanism (scripts/lib/botSeasonal.js), from a SEPARATE
 * array (bot.seasonalPaths.halloween) that must NEVER be mixed into the
 * normal bot.paths[] rotation (that would make it fire in July too — see
 * botSeasonal.js's own header note). This file is required directly by the
 * path-builder registry the same as any other path — only the REGISTRATION
 * differs (see the exact index.js lines to add, noted at the bottom of this
 * file and reported back to the orchestrator).
 *
 * CONCEPT: a charming moment of BUILDING/DRESSING a friendly Halloween
 * scarecrow for the season — stuffing straw into old clothes, a character (or
 * a no-character still-life) working on a half-finished or freshly-finished
 * scarecrow with a cheerful painted/stitched face (button eyes, a stitched
 * smile — never sinister), a small pumpkin-topped or straw hat, an autumn
 * field setting. Playful family-friendly Halloween only, matching the whole
 * fleet's Halloween content and FarmBot's own hard identity ("never dark,
 * gritty, harsh, or realistic") — this scarecrow reads as ADORABLE and
 * friendly, plush-toy-cute, never sinister/menacing/uncanny.
 *
 * Genuinely distinct from two existing paths that already have scarecrow
 * imagery as passive BACKGROUND decor (checked both before writing):
 *   - farmbot_harvest_festival_place.json includes "a cheerful patchwork
 *     scarecrow standing watch" as ONE possible background element in a wide
 *     community-festival scene (hay-bale mazes, corn-maze archways, bonfires).
 *   - farmbot_vegetable_garden_place.json can include a "leaning scarecrow in
 *     patched clothes watching over a row" as ONE possible background element
 *     in an established, ripe, leafy vegetable patch.
 *   Neither treats the scarecrow as the HERO or shows it under construction —
 *   both are passive, already-standing background dressing in a wide scene
 *   about something else. This path's whole premise is the ACT of building/
 *   dressing the scarecrow itself as a dedicated, intimate moment — the
 *   opposite framing (hero close-in construction vs. background decor).
 *
 * AXES (5, all bespoke — no shared SEASON pool, see ATMOSPHERE note below):
 *   1. SCARECROW    (always, HERO — read first)  — the scarecrow's own build
 *                                                    stage/construction/face,
 *                                                    120-entry bespoke pool.
 *   2. SETTING       (always)                     — the quiet outdoor spot,
 *                                                    120-entry bespoke pool.
 *   3. DECOR         (always)                     — one small Halloween touch
 *                                                    nearby, 120-entry pool.
 *   4. ATMOSPHERE    (always) MONEY SHOT           — the exact autumn light,
 *                                                    120-entry bespoke pool
 *                                                    (mixed warm/cool by
 *                                                    design — see the
 *                                                    hue-freedom lesson in
 *                                                    FARMBOT_PATH_BUILD_STATE.md).
 *   5. BUILDING_ACTION (~60% conditional, only     — path-local (not a
 *      with a character present)                    generated pool — same
 *                                                    pattern as
 *                                                    spring-planting-day.js's
 *                                                    PLANTING_ANCHOR /
 *                                                    garden-vegetable-patch-
 *                                                    tending.js's
 *                                                    TENDING_ACTIVITIES — a
 *                                                    small fixed set so the
 *                                                    "what's happening"
 *                                                    section is always
 *                                                    legibly about BUILDING
 *                                                    the scarecrow, never a
 *                                                    generic off-topic chore/
 *                                                    leisure pose from the
 *                                                    shared ACTIVITY pool.
 *
 * ⭐ CRITICAL SAFETY CONSTRAINT — occupational/anatomy-confusion trap (same
 * root-cause class as the documented "horse keeper" bug, where an animal-name
 * token sitting directly adjacent to a person-noun made Flux render a
 * human-animal hybrid): every BUILDING_ACTION line keeps "the scarecrow['s
 * part]" strictly as the grammatical OBJECT of the human's action verb, never
 * the reverse, and the scarecrow's own bespoke pool (see its gen script)
 * independently states the scarecrow's head/face is inert straw-and-fabric
 * construction on every single entry. The template below states this
 * separation TWICE — once right after the SCARECROW block (positive register,
 * matching the established shared-blocks.js pattern), and once more in the
 * closing reinforcement paragraph — mirroring chibi-halloween-cozy.js's own
 * "said twice" precedent for its analogous human-leak risk.
 *
 * Character archetype: manually filtered to STRICTLY 'farm'-tagged entries
 * (pools.CHARACTER_ARCHETYPE.filter, NOT pools.pickCharacter's byTags/ANY-
 * passthrough — the documented gotcha: 'farm'/'leisure' tags are often a
 * no-op since most archetypes carry 'ANY') to avoid an occupational-prop
 * mismatch (a baker's dough-cutter, a shopkeeper's ledger, a potter's
 * clay-smudged apron) showing up on someone stuffing straw into a scarecrow.
 * 30 farm-tagged archetypes survive (13 female / 17 male) — gardener,
 * shepherd, generic farm girl/boy, settled-traveler — all plausible hands
 * for this activity, plenty of variety for MVP-and-beyond depth.
 *
 * CAMERA_COMPOSITION manually filtered (same documented re-pollution risk as
 * every other bespoke-pool FarmBot path — the shared 109-entry pool still
 * carries extensive un-filtered-out "tiny"/"dwarfed"/"sweeping" dwarfing
 * language from before the source-level fix, plus interior/village framings
 * incompatible with an open autumn field): drops dwarfing language, back-
 * facing framings, and interior/village-only framings (farmhouse window, barn
 * doorway, cozy interior, village street, rooftops) that don't fit an
 * open-air field/yard scarecrow scene. 51/109 survive — wide establishing,
 * medium framing, intimate close-up, soft foreground foliage, low-angle —
 * plenty of variety.
 *
 * ATMOSPHERE deliberately carries the seasonal light signal directly (same
 * reasoning as orchard-afternoon/garden-vegetable/tropical paths for skipping
 * the shared SEASON pool — its entries each describe a different whole
 * competing landscape) — and is explicitly instructed at generation time to
 * mix warm and cool/overcast light roughly evenly, learning proactively from
 * the documented "always sunny" bug found on 4/8 tropical bespoke pools that
 * were each their path's ONLY atmosphere source.
 *
 * "Sometimes no human" rule (Kevin 2026-09-09, standardized 60/40 fleet-wide):
 * includeCharacter = Math.random() < 0.6. On a no-character roll: the scene
 * is just the half-finished/freshly-finished scarecrow itself in the field,
 * guaranteed ambient life via pools.pickPureSceneLife (never a bare/lifeless
 * composition) — still just as charming, no human needed. The "no human
 * figure" cast-determining sentence is front-loaded (position 2, right after
 * the hero SCARECROW block) per the documented ⭐ papaya-guava-orchard lesson:
 * losing that declaration late in a dense brief doesn't just thin the scene,
 * it can flip the render's correctness (an uninvited character appearing).
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Path-bespoke pools — required directly, NOT added to pools.js (shared
// file, other agents may be editing it concurrently). See:
// scripts/gen-seeds/farmbot/gen-halloween-scarecrow-building-*-pool.js
const SCARECROW = require('../seeds/farmbot_halloween_scarecrow_building_scarecrow.json');
const SETTING = require('../seeds/farmbot_halloween_scarecrow_building_setting.json');
const DECOR = require('../seeds/farmbot_halloween_scarecrow_building_decor.json');
const ATMOSPHERE = require('../seeds/farmbot_halloween_scarecrow_building_atmosphere.json');

// Manual STRICT archetype filter — see header note above (byTags/ANY-
// passthrough gotcha). Only genuine farm-tagged archetypes, never the OR-
// match that would let bakery/market/artisan prop mismatches through.
const SCARECROW_ARCHETYPES = pools.CHARACTER_ARCHETYPE.filter((e) => e.tags.includes('farm'));

// Replicates pools.pickCharacter()'s combining logic (archetype + gender-
// matched hairstyle + hair color + eye color + skin tone) but sources the
// archetype from the pre-filtered SCARECROW_ARCHETYPES above instead of the
// raw pool — see header note. Uses only pools.js's exported pieces, no
// pools.js edit.
function pickScarecrowCharacter(picker, axisPrefix) {
  const archetype = picker.pickWithRecency(SCARECROW_ARCHETYPES, `${axisPrefix}_archetype`);
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

// Path-local (not a shared pool — no other path needs this) building-action
// set, gerund-phrased with an implied human subject (matches the shared
// ACTIVITY pool's own convention) — only used when a character is present.
// ⭐ SAFETY: every line keeps "the scarecrow['s part]" strictly as the
// grammatical OBJECT of the human's action, never the subject, and never
// describes the scarecrow's head/face as anything but its own construction —
// see the header's occupational-anatomy-confusion note.
const BUILDING_ACTIONS = [
  'Kneeling to press double handfuls of golden straw into the scarecrow’s sagging trouser leg, packing it firm and round.',
  'Reaching up to settle the scarecrow’s floppy straw hat over its burlap head, tugging the brim into a jaunty tilt.',
  'Threading a needle to stitch one more curved smile onto the scarecrow’s round fabric face, pulling the black thread taut.',
  'Looping a length of rope twice around the scarecrow’s straw-stuffed waist, cinching it snug over the patched overalls.',
  'Buttoning a faded flannel shirt closed over the scarecrow’s straw-packed chest, smoothing the fabric flat with both hands.',
  'Tying off the last handful of straw poking from the scarecrow’s cuff, tucking the loose ends neatly out of sight.',
  'Propping the finished scarecrow upright against its wooden crossbar post, giving one padded shoulder a satisfied pat.',
  'Perching a small round pumpkin topped with a tiny knit hat onto the scarecrow’s shoulders, tilting it just so.',
  'Sewing a round button eye onto the scarecrow’s fabric face with a careful, patient stitch.',
  'Fluffing loose straw at the scarecrow’s collar so it spills out in a cheerful golden tuft.',
  'Lifting an armful of fresh straw from a woven basket to top off the scarecrow’s half-stuffed sleeve.',
  'Tucking a small corn-husk flower into the buttonhole of the scarecrow’s patched shirt as a final finishing touch.',
];

// Manual CAMERA_COMPOSITION filter (untagged shared pool) — drops dwarfing
// language (documented re-pollution risk, still present in the un-filtered
// source JSON), back-facing framings, and interior/village-only framings
// that don't fit an open-air autumn field/yard scene. See header note.
const CAMERA_INCOMPATIBLE =
  /\btiny\b|dwarf|small within|small against|sweeping|sky dominating|over-the-shoulder|from behind|rear view|back turned|facing away|walking away|farmhouse window|barn doorway|cozy interior|cosy interior|interior composition|village street|\bvillage\b|rooftops?/i;
const SCARECROW_CAMERA = pools.CAMERA_COMPOSITION.filter((e) => !CAMERA_INCOMPATIBLE.test(e));

// Manual ANIMAL_COMPANIONS filter — excludes cottage-window/windowsill/
// cottage-garden/kitchen-garden entries incompatible with an open field/
// farmyard setting (same class of physical-setting-mismatch lesson as
// tropical-flower-garden.js).
const ANIMAL_INCOMPATIBLE = /windowsill|cottage|farmhouse|mudroom|\bkitchen\b/i;
const SCARECROW_ANIMALS = pools.ANIMAL_COMPANIONS.filter(
  (e) => (e.tags.includes('low') || e.tags.includes('medium')) && !ANIMAL_INCOMPATIBLE.test(e.description)
).map((e) => e.description);

module.exports = ({ sharedDNA, picker }) => {
  // QA-only overrides (inert in production — nothing sets these env vars
  // during a normal bot run): force the no-character+animal branch for a
  // focused re-verification batch. Mirrors seasonal-festival.js's own
  // SEASONAL_FESTIVAL_FORCE_CONCEPT pattern for exactly this purpose.
  const forceNoCharacter = process.env.SCARECROW_FORCE_NO_CHARACTER === '1';
  const forceAnimal = process.env.SCARECROW_FORCE_ANIMAL === '1';

  // "Sometimes no human" rule, standardized 60/40 fleet-wide (2026-09-09).
  const includeCharacter = forceNoCharacter ? false : Math.random() < 0.6;

  const scarecrow = picker.pickWithRecency(SCARECROW, 'scarecrow_building_scarecrow');
  const setting = picker.pickWithRecency(SETTING, 'scarecrow_building_setting');
  const decor = picker.pickWithRecency(DECOR, 'scarecrow_building_decor');
  const atmosphere = picker.pickWithRecency(ATMOSPHERE, 'scarecrow_building_atmosphere');
  const camera = picker.pickWithRecency(SCARECROW_CAMERA, 'scarecrow_building_camera');

  const character = includeCharacter ? pickScarecrowCharacter(picker, 'scarecrow_building_character') : null;
  const action = includeCharacter
    ? picker.pickWithRecency(BUILDING_ACTIONS, 'scarecrow_building_action')
    : null;

  const animalChance = includeCharacter ? 0.35 : forceAnimal ? 1 : 0.7;
  const animal = includeCharacter
    ? Math.random() < animalChance
      ? picker.pickWithRecency(SCARECROW_ANIMALS, 'scarecrow_building_animal')
      : null
    : pools.pickPureSceneLife(picker, {
        animalPool: SCARECROW_ANIMALS,
        animalChance,
        ambientTags: ['outdoor'],
        axisPrefix: 'scarecrow_building',
      });

  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.byTags(pools.GENTLE_MAGIC, ['ANY', 'autumn']), 'scarecrow_building_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE SCARECROW (the hero of the shot — read first, required) ━━━
${scarecrow}
This is a friendly, adorable, plush-toy-cute handmade Halloween scarecrow —
its straw-stuffed head and stitched, button-eyed face belong ENTIRELY to the
scarecrow itself, an inanimate handmade object, never any part of a human
character's own head, face, or body. The scarecrow described above is the
required, essential subject of this image, not optional background mood — its
straw-stuffed shape, hat, and stitched face must actually appear, fully and
clearly visible, rendered in as much loving detail as any character in the
frame.

${
  character
    ? `━━━ THE CHARACTER (building/dressing the scarecrow) ━━━\n${character}\nThe character's own face stays clearly visible and legible toward camera — the button-eyed, stitched-smile face belongs to the scarecrow they're working on, never to them. Both the scarecrow (above) and the character must be clearly, fully visible together in the same frame.\n\n`
    : `━━━ THE CAST ━━━\nNo human figure anywhere. The scarecrow above is the required hero and must clearly, fully appear exactly as described. It is the one and only thing in this whole scene built from straw, patched fabric, or a hat — any animal sharing the scene (below) is simply an ordinary real creature, exactly its own natural species, with its own plain natural fur, feathers, or skin and its own natural everyday behavior, going about its day nearby.\n\n`
}${animal ? `━━━ ANIMAL COMPANY (required to actually appear, not just background mood — an ordinary real creature in its own plain natural body, simply present and going about its own everyday business nearby) ━━━\n${animal}\n\n` : ''}${action ? `━━━ WHAT'S HAPPENING ━━━\n${action}\n\n` : ''}━━━ THE SETTING ━━━
${setting}

━━━ ONE HALLOWEEN TOUCH (a single small, contained detail near the scarecrow — never a wide festival, market, or village scene) ━━━
${decor}

━━━ THE LIGHT ━━━
${atmosphere}

━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  character
    ? `render a warm, playful, family-friendly Halloween scarecrow-building
moment — cheerful and cozy throughout, never dark, gritty, scary, or
sinister. The straw-stuffed scarecrow itself MUST be clearly, fully visible
in the finished image, standing prominently in the frame right alongside the
character — it is never omitted, cropped away, or reduced to an unseen
mention just because a character is also present. The scarecrow and the
character are rendered with equal loving richness, never a bare or empty
composition. Every face in the frame, human and animal alike, stays clearly
separate and fully legible — and the scarecrow's own button-eyed,
stitched-smile face reads unmistakably as handmade straw-and-fabric
construction, never as anyone's real anatomy.`
    : `no human figure anywhere in the frame — this is a warm, playful,
family-friendly Halloween moment carried entirely by the charming scarecrow
itself (freshly finished or still mid-build, both equally charming), which
MUST be clearly, fully visible and remain the unambiguous center of the
image — never omitted, replaced, or reduced to an unseen background mention.
Everything else in the scene (setting, decor, light, and any animal present)
stays a supporting detail, never a competing wide festival or village scene.
The scarecrow's button-eyed, stitched-smile face reads unmistakably as
handmade straw-and-fabric construction, cheerful and friendly, never
sinister.${animal ? ' Any animal present reads as an ordinary real creature, exactly its own natural species, in its own plain natural fur or feathers, with open air around it, simply going about its own everyday business nearby — the scarecrow remains the only figure in the frame wearing straw, patched fabric, or a hat. Any small insect, bird, or floating detail (drifting leaves, dust motes, fireflies) stays simple and unposed, with no invented face or cartoon expression drawn onto anything except the scarecrow itself.' : ''}`
} no text, no words, no watermarks, gallery quality`;
};
