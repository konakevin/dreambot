/**
 * FarmBot — tropical-stream-crossing (Phase 4: Tropical Farm, 2026-09-09 —
 * 8th and final tropical path).
 *
 * Place-led (the stream crossing is the hero, always named first — per the
 * ⭐ CROSS-CUTTING maxTokens lesson in FARMBOT_PATH_BUILD_STATE.md: Sonnet's
 * brief-writing call uses a fixed maxTokens and drops/thins content late in
 * a dense brief, so the bespoke place block goes first, ahead of even the
 * character block). Uses the path-bespoke TROPICAL_STREAM_CROSSING_PLACE
 * pool (required directly from its JSON — NOT added to pools.js, see
 * gen-tropical-stream-crossing-place-pool.js) as the setting anchor, same
 * pattern as banana-grove-path.js / coconut-palm-grove.js / etc.
 *
 * RENAMED from "jungle stream crossing" (Kevin, verbatim, non-negotiable):
 * "the important thing is that it still feels like a charming FARM since
 * this is FarmBot, just a tropical farm." A small, gentle freshwater stream
 * at the EDGE of the tropical farm, crossed by a hand-built wooden plank
 * bridge or a line of flat stepping stones, banked by tropical
 * farm-adjacent plantings (never wild riverbank jungle). This must NOT read
 * as a jungle trek, wilderness river crossing, or adventure/exploration
 * scene — it's a quiet, tended corner of a working tropical farm that
 * happens to have water running through it. The bespoke place pool's own
 * generator already bans jungle/rainforest/wild/untamed/wilderness/
 * overgrown/adventure/expedition/trek vocabulary at the source (see
 * gen-tropical-stream-crossing-place-pool.js); this path's own closing
 * description reinforces the same cultivated/tended framing positively
 * (never by naming "jungle" to negate it — Flux doesn't process negation,
 * CLAUDE.md).
 *
 * SKIPS the shared SEASON pool entirely (Phase 4 instruction — a tropical
 * climate doesn't fit FarmBot's 4-season framework) AND skips the shared
 * WEATHER_ATMOSPHERE pool too (same as coconut-palm-grove.js and
 * pineapple-field-afternoon.js — its entries are temperate-seasonal and
 * would be setting-incompatible; the bespoke place pool already carries its
 * own warm/humid tropical light and time-of-day directly in every entry).
 *
 * ACTIVITY has no stream-crossing/farm-water-tending entries (checked
 * directly against farmbot_activity.json — its farm/chore entries are
 * strawberries, ponies, chickens, eggs, laundry; nothing about a stream
 * crossing, a water wheel, or rinsing produce at a washing-stone), so this
 * path uses its own small path-local STREAM_CROSSING_ACTIVITIES set, same
 * pattern as coconut-palm-grove.js's COCONUT_GROVE_ACTIVITIES and
 * banana-grove-path.js's BANANA_GROVE_ACTIVITIES.
 *
 * CHARACTER_ARCHETYPE: manually filtered (not a bare byTags — see the
 * tropical-flower-garden.js documented byTags/"ANY" gotcha, where
 * filterByTags(['farm','leisure']) let the ENTIRE pool through, including
 * bakery/café/shopkeeper/weaver/potter/carpenter/innkeeper archetypes whose
 * props are a physical mismatch here). UNLIKE tropical-flower-garden.js,
 * this filter deliberately KEEPS the fisher archetypes (market/leisure
 * tagged) — a fisher genuinely fits a stream crossing scene (the brief's
 * own "fishing basket left on the bank" touch), so only the bakery/café/
 * shopkeeper/weaver/potter/carpenter/innkeeper-flavored entries are
 * excluded. 67/116 archetypes survive.
 *
 * CAMERA_COMPOSITION is manually filtered (untagged pool) to drop
 * farmhouse/barn/village/cottage/hedgerow/cozy-interior framings (physical-
 * setting mismatch for an open stream crossing) PLUS every phrasing of the
 * "character tiny/dwarfed/sky-dominating/sweeping/rolling within a
 * landscape" bug (CLAUDE.md-documented re-pollution from the pool's
 * 20→120 scale-up — filtered broadly on all of those keywords, not just
 * "rolling").
 *
 * "Sometimes no human" rule (2026-09-09 standardization): includeCharacter
 * = Math.random() < 0.6 exactly, matching every other path. No-character
 * branch uses the new pools.pickPureSceneLife() helper (guaranteed ambient
 * life — dragonflies/butterflies/a small bird are especially fitting near
 * water — instead of a bare animal-chance roll that could come back bare).
 *
 * ROUND-1 FIX — animal/ambient content was silently dropping (2/2
 * no-character renders came back with ZERO living presence despite
 * pickPureSceneLife guaranteeing a non-null pick). Root cause: this path's
 * hero block is unusually dense (place pool entry + a farm-edge-touches
 * reinforcement paragraph listing 5 specific props), and the template
 * originally put the animal/ambient section dead LAST (after CAMERA) — by
 * the time Sonnet's fixed-maxTokens brief-writing call reached it, the
 * budget was already spent describing the crossing itself. Same root
 * mechanism as the documented rainy-farmhouse-morning/barn-interior
 * maxTokens lesson, just triggered by an unusually rich PLACE block instead
 * of a rich CHARACTER/ANIMAL block. Fixed by moving the animal/ambient-life
 * section to right after the hero paragraph (before even THE CHARACTER),
 * in BOTH branches — since Kevin's ambient-life requirement is specifically
 * about guaranteeing this survives to the final render, it earns the same
 * "most essential, put it first" treatment as the place block itself.
 * Verified via round 2 (see build report).
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Path-bespoke pool — required directly, NOT added to pools.js (shared file,
// other agents may be editing it concurrently). See:
// scripts/gen-seeds/farmbot/gen-tropical-stream-crossing-place-pool.js
const TROPICAL_STREAM_CROSSING_PLACE = require('../seeds/farmbot_tropical_stream_crossing_place.json');

// Manual archetype filter — see header note above. Excludes occupation
// archetypes carrying props/tools genuinely incompatible with a stream
// crossing: bakery/café serving props (flour, dough-cutter, tray, teacup,
// dish towel), a shopkeeper's ledger/measuring tape, a weaver's
// shuttle/loom, a potter's clay-smudged apron/kiln, a carpenter's tool
// belt/saw/chisel, an innkeeper's bell/mug charm. DELIBERATELY does NOT
// exclude fisher archetypes — a fisher fits this setting naturally (the
// brief's own "fishing basket left on the bank" touch).
const ARCHETYPE_INCOMPATIBLE =
  /\b(baker|café|cafe|coffee|dish towel|teacup|tray|shopkeeper|measuring tape|ledger|weaver|shuttle|loom|potter|clay[- ]smudged?|kiln|carpenter|tool belt|\bsaw\b|chisel|innkeeper|tavern|\binn\b|bell charm|mug charm|coin charm)\b/i;
const STREAM_CROSSING_ARCHETYPES = pools
  .filterByTags(pools.CHARACTER_ARCHETYPE, ['farm', 'leisure'])
  .filter((e) => !ARCHETYPE_INCOMPATIBLE.test(e.description));

// Replicates pools.pickCharacter()'s combining logic (archetype + gender-
// matched hairstyle + hair color + eye color + skin tone) but sources the
// archetype from the pre-filtered STREAM_CROSSING_ARCHETYPES above instead
// of the raw pool — see header note. Uses only pools.js's exported pieces,
// no pools.js edit.
function pickStreamCrossingCharacter(picker, axisPrefix) {
  const archetype = picker.pickWithRecency(STREAM_CROSSING_ARCHETYPES, `${axisPrefix}_archetype`);
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
// genuine stream-crossing/farm-water-tending actions) since the shared
// ACTIVITY pool has no content that fits this setting. Every entry
// reinforces the cultivated, hand-tended, small-scale farm energy (never a
// wild-exploration pose), only used when a character is present.
const STREAM_CROSSING_ACTIVITIES = [
  'Stepping carefully from one flat stepping stone to the next, arms held loosely out for balance, midway across the shallow stream.',
  'Crouching at the flat washing-stone beside the bank, rinsing a handful of freshly picked produce in the cool moving water.',
  'Crossing the wooden plank bridge with one hand trailing lightly along the rope handrail, unhurried and at ease.',
  'Kneeling at the water\'s edge to lift a woven fishing basket, checking the morning\'s catch before setting it back on the bank.',
  'Steadying the wooden water wheel with one hand, clearing a few caught leaves from its paddles as it turns.',
  'Pinning a damp garment to the laundry line strung near the bank, the stream murmuring quietly just behind.',
  'Balancing barefoot on the near stepping stone, leaning down to trail fingertips through the cool passing current.',
  'Carrying a full basket across the plank bridge, footsteps unhurried on the weathered boards, garden rows waiting just beyond.',
];

module.exports = ({ sharedDNA, picker }) => {
  // "Sometimes no human" rule (2026-09-09 standardization) — exactly 0.6.
  const includeCharacter = Math.random() < 0.6;

  const crossing = picker.pickWithRecency(TROPICAL_STREAM_CROSSING_PLACE, 'stream_crossing_place');

  const character = includeCharacter
    ? pickStreamCrossingCharacter(picker, 'stream_crossing_character')
    : null;

  // Only meaningful when a character is present — see
  // STREAM_CROSSING_ACTIVITIES note above.
  const activity = includeCharacter
    ? picker.pickWithRecency(STREAM_CROSSING_ACTIVITIES, 'stream_crossing_activity')
    : null;

  // Manual content filter (CAMERA_COMPOSITION is untagged): drops
  // farmhouse/barn/village/cottage/hedgerow/cozy-interior framings
  // (physical-setting mismatch for an open stream crossing) PLUS every
  // phrasing of the "character tiny/dwarfed within a sweeping/sky-
  // dominating/rolling landscape" bug (CLAUDE.md hard rule — filter
  // broadly, not just one keyword).
  const CAMERA_INCOMPATIBLE =
    /\b(farmhouse|barn|village|rooftops?|cottages?|hedgerows?|cosy interior|cozy interior|interior|tiny|dwarfed|sky dominating|sweeping|rolling)\b/i;
  const camera = picker.pickWithRecency(
    pools.CAMERA_COMPOSITION.filter((e) => !CAMERA_INCOMPATIBLE.test(e)),
    'stream_crossing_camera'
  );

  // Animal pool: low/medium density, excluding indoor/cottage-flavored
  // entries that are a physical-setting mismatch for an open-air stream
  // crossing — same pattern as every other tropical path.
  const animalPool = pools.ANIMAL_COMPANIONS.filter(
    (e) =>
      (e.tags.includes('low') || e.tags.includes('medium')) &&
      !/cottage|farmhouse|windowsill|mudroom/i.test(e.description)
  ).map((e) => e.description);

  // REQUIRED (2026-09-09): guarantee ambient life in the no-character
  // branch — a no-character render should never come back bare. Dragonflies/
  // butterflies/a small bird from AMBIENT_LIFE are especially fitting near
  // water. With-character branch keeps the existing animal-chance roll
  // unchanged (a human already anchors the scene as inhabited).
  const animalChance = includeCharacter ? 0.4 : 0.75;
  const animal = includeCharacter
    ? Math.random() < animalChance
      ? picker.pickWithRecency(animalPool, 'stream_crossing_animal')
      : null
    : pools.pickPureSceneLife(picker, {
        animalPool,
        animalChance,
        ambientTags: ['outdoor'],
        axisPrefix: 'stream_crossing',
      });

  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'stream_crossing_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE STREAM CROSSING (the hero of the shot) ━━━
${crossing}
This is a small, gentle stream at the edge of a real, cultivated tropical
farm, lightly tended by a family or small crew — never a wild jungle
riverbank or an unexplored wilderness.
${
  animal
    ? `\n━━━ LIVING PRESENCE IN THE SCENE (always include this) ━━━\n${animal}\n`
    : ''
}${character ? `\n━━━ THE CHARACTER ━━━\n${character}\n` : ''}
${activity ? `━━━ WHAT'S HAPPENING ━━━\n${activity}\n\n` : ''}━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  character
    ? `a small, tended stream crossing on a working farm, NOT a jungle trek.
The character crosses or pauses right at the water's edge, close and
present, a figure IN the scene, never a distant tiny speck.`
    : `no human figure anywhere in the frame — a small, tended stream
crossing on a working farm, NOT a jungle trek, carried by the stream
itself and whatever wildlife shares it, never a bare or empty
composition.`
} no text, no words, no watermarks, gallery quality`;
};
