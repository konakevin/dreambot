/**
 * FarmBot — axis pools. All seeds live in farmbot/seeds/. Regenerate any:
 *   node scripts/gen-seeds/farmbot/gen-<name>-pool.js
 *
 * Full rebuild (2026-09-08) — see FARMBOT_CREATIVE_DIRECTION.md (the spec of
 * record) and FARMBOT_PATH_BUILD_STATE.md. Shared category pools below are
 * combined per-path via tag-filtering, same mechanism proven fleet-wide
 * (YumBot's FOOD_CATALOG/TINY_COMPANIONS/DECOR_ITEMS pattern) but scoped
 * entirely to this bot's own files — no shared cross-bot registry involved.
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

/**
 * Filter a tagged pool ({tags, description}) to entries matching ANY of the
 * given allowed tags. An entry tagged "ANY" always passes. Returns the
 * ENTRY OBJECTS (tags preserved) — use this when a caller needs to inspect
 * the picked entry's tags afterward (e.g. reading gender off a picked
 * character_archetype to then filter a matching gendered hairstyle).
 */
function filterByTags(pool, allowedTags) {
  const allowed = new Set(allowedTags);
  return pool.filter((e) => e.tags.includes('ANY') || e.tags.some((t) => allowed.has(t)));
}

/**
 * Same filter, but returns plain description strings — the common case,
 * ready straight for picker.pickWithRecency when the caller never needs the
 * entry's tags again.
 */
function byTags(pool, allowedTags) {
  return filterByTags(pool, allowedTags).map((e) => e.description);
}

/**
 * Read "male"/"female" off a picked entry's tags (character_archetype
 * entries carry exactly one gender tag — see gen-character-archetype-pool.js).
 * Returns null if the entry has neither tag (shouldn't happen for
 * CHARACTER_ARCHETYPE, but callers should treat null as "match ANY").
 */
function genderOf(entry) {
  if (!entry || !Array.isArray(entry.tags)) return null;
  if (entry.tags.includes('female')) return 'female';
  if (entry.tags.includes('male')) return 'male';
  return null;
}

// Bot-wide "look register" — feeling/technique descriptors only, no named
// studios or franchises (rebuilt 2026-09-08, see FARMBOT_CREATIVE_DIRECTION.md
// section 1). Rolled per render via rollSharedDNA.
//
// HARD RULE (Kevin 2026-09-09): every entry must anchor on CHARACTER
// rendering vocabulary (linework, eyes, cel-shading, proportions) — NEVER
// time-of-day / weather / season / lighting words ("golden-hour," "twilight,"
// "moody rain," "blossom-season"). Two failures traced live via
// sharedDNA.scenePalette: "Golden-hour anime landscape illustration" and
// "Moody rain-soft anime landscape illustration" both rendered with ZERO
// anime style words in Sonnet's actual Flux prompt — their word-budget went
// to atmosphere ("richly painted... countryside," "luminous layered color")
// instead of repeating "anime" against strong character descriptors, so the
// signal got lost entirely. A THIRD entry ("Detailed anime background-art
// illustration") shared the same background/environment-first framing and
// also drifted painterly-Western on a live render — cut for the same reason
// even though it never named a time-of-day. This is ALSO a correctness bug,
// not just a style-strength one: FarmBot already has a dedicated
// WEATHER_ATMOSPHERE pool (golden morning / blue hour / misty rain / blossom
// petals / sunset / starry night, all season-tagged) that every path already
// pulls from — a look entry that independently declares "twilight" or
// "golden-hour" can directly CONTRADICT whatever time-of-day that path's own
// WEATHER_ATMOSPHERE pick already set for that render. If FarmBot ever wants
// more day/weather/lighting variety, add it to WEATHER_ATMOSPHERE (or a new
// dedicated axis) — never back into the look register.
const FARMBOT_LOOK_REGISTER = load('farmbot_look_register');

// Shared cross-path category pools (rebuild 2026-09-08) — each a tagged
// pool ({tags, description}), filtered per-path via byTags() for
// contextual relevance. See FARMBOT_CREATIVE_DIRECTION.md for the section
// each maps to.
const CHARACTER_ARCHETYPE = load('farmbot_character_archetype'); // section 3 (role/outfit/demeanor only)

// Atomic appearance axes (added 2026-09-08) — combined with
// CHARACTER_ARCHETYPE at render time (via pickCharacter, below) so the cast
// doesn't collapse into "the same person every time" (the SteamBot
// homogenization-trap fix, BOT_SCENE_QUALITY_PLAYBOOK.md). HAIRSTYLE is
// gender-tagged — pickCharacter matches it to the picked archetype's gender.
// HAIR_COLOR/EYE_COLOR/SKIN_TONE are gender-neutral ("ANY" only). SKIN_TONE
// is pure visual depth + undertone — deliberately no ethnic/national labels
// anywhere in the pool.
const HAIRSTYLE = load('farmbot_hairstyle');
const HAIR_COLOR = load('farmbot_hair_color');
const EYE_COLOR = load('farmbot_eye_color');
const SKIN_TONE = load('farmbot_skin_tone');

const ANIMAL_COMPANIONS = load('farmbot_animal_companions'); // section 4
const ACTIVITY = load('farmbot_activity'); // sections 5, 9
const FOOD_AND_BAKING = load('farmbot_food_and_baking'); // section 6
const SEASON = load('farmbot_season'); // section 10
const WEATHER_ATMOSPHERE = load('farmbot_weather_atmosphere'); // section 11
const WORLD_DETAIL_PROPS = load('farmbot_world_detail_props'); // section 13
const GENTLE_MAGIC = load('farmbot_gentle_magic'); // section 14, low-weight/rare

// Plain (untagged) shared pool — framing applies universally.
const CAMERA_COMPOSITION = load('farmbot_camera_composition'); // section 15

// Path-bespoke pools (not cross-path shared) — a specific path's own
// signature hero-setting axis, plain strings.
const POND_PLACE = load('farmbot_pond_place'); // "Summer evening by the pond"

/**
 * Pick one character archetype (filtered by `archetypeTags`) PLUS a matching
 * set of atomic appearance axes — hairstyle gender-matched to the picked
 * archetype, hair color / eye color / skin tone drawn from the full natural
 * range — combined into one ready-to-drop-in description block. Fixes the
 * homogenization trap (SteamBot lesson, BOT_SCENE_QUALITY_PLAYBOOK.md):
 * without this, every rendered character reads as "the same person" (same
 * anime girl, short brown hair, every time).
 *
 * `axisPrefix` namespaces the picker's recency axes so multiple character
 * picks within one path (e.g. autumn-village-market's two villagers) don't
 * collide with each other or with another path's picks.
 *
 * Returns a multi-line string — drop it in wherever a path previously used
 * the bare archetype description.
 */
function pickCharacter(picker, archetypeTags, axisPrefix) {
  const archetype = picker.pickWithRecency(
    filterByTags(CHARACTER_ARCHETYPE, archetypeTags),
    `${axisPrefix}_archetype`
  );
  const gender = genderOf(archetype) || 'ANY';
  const hairstyle = picker.pickWithRecency(byTags(HAIRSTYLE, [gender]), `${axisPrefix}_hairstyle`);
  const hairColor = picker.pickWithRecency(byTags(HAIR_COLOR, ['ANY']), `${axisPrefix}_hair_color`);
  const eyeColor = picker.pickWithRecency(byTags(EYE_COLOR, ['ANY']), `${axisPrefix}_eye_color`);
  const skinTone = picker.pickWithRecency(byTags(SKIN_TONE, ['ANY']), `${axisPrefix}_skin_tone`);

  return `${archetype.description}
Hair: ${hairColor} Styled: ${hairstyle}
Eyes: ${eyeColor}
Skin: ${skinTone}`;
}

module.exports = {
  byTags,
  filterByTags,
  genderOf,
  pickCharacter,

  FARMBOT_LOOK_REGISTER,
  CHARACTER_ARCHETYPE,
  HAIRSTYLE,
  HAIR_COLOR,
  EYE_COLOR,
  SKIN_TONE,
  ANIMAL_COMPANIONS,
  ACTIVITY,
  FOOD_AND_BAKING,
  SEASON,
  WEATHER_ATMOSPHERE,
  WORLD_DETAIL_PROPS,
  GENTLE_MAGIC,
  CAMERA_COMPOSITION,
  POND_PLACE,
};
