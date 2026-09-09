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
//
// 4TH CUT (Kevin 2026-09-09, "this look is 3D animation, we don't want it"):
// "Soft painterly cute anime illustration" — despite saying "anime" 3x
// anchored to character vocabulary (facial proportions/linework/eyes), a
// live render Kevin hearted came back unmistakably 3D-CGI (Pixar/DreamWorks-
// style glossy shading and modeled hair), traced via scenePalette to this
// exact entry. Root cause: "painterly" is a genuinely double-meaning word in
// art-style vocabulary — it describes both flat 2D gouache/watercolor art
// AND 3D-CGI rendered with painterly lighting (a term Pixar/DreamWorks
// themselves use for their own films' art direction). No amount of
// surrounding "anime"/"2D" words reliably disambiguates it. Cut outright
// rather than reworded — this word-choice risk can't be fixed by adding more
// anchoring vocabulary around it, unlike the first 3 cuts above. Cross-bot
// rule: treat "painterly" as a suspect word for any 2D-only bot's look
// register; if used, pair it explicitly with a disambiguator like "2D
// hand-painted" or "flat painted," and verify with a real render before
// trusting it.
//
// REWORDED not cut (Kevin 2026-09-09, "hearted this one becuase it's not
// anime"): "Bright flat-color cute anime illustration" rendered as a
// generic Western storybook-cartoon (thick uniform outlines, simple flat
// shading, no anime-style eyes) despite saying "anime" 4x. Root cause,
// different from the painterly case: this entry was the ONLY one of the 5
// that never mentioned EYES — every other surviving entry explicitly says
// "big sparkling anime eyes [with catchlights]," which is the single most
// anime-diagnostic visual cue Flux has to work with; without it, "flat-
// color/bold outlines/simple shapes" reads as generic flat-cartoon, not
// anime specifically. Unlike "painterly," none of this entry's words name a
// rival medium outright — so here the fix WAS reliable: added the same
// explicit big-eyes-with-catchlights clause the other 4 entries already
// have. Verified via one isolated look-matrix render: unmistakably anime
// afterward. Lesson: an entry missing eye-specific language is a warning
// sign even if it repeats "anime" plenty of times — verify every entry
// mentions eyes explicitly, not just the style-family word.
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
const AMBIENT_LIFE = load('farmbot_ambient_life'); // fallback life for pure-scene renders (2026-09-09)

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

/**
 * Guarantee SOME small living/charming presence in a PURE-SCENE (no
 * character) render — Kevin 2026-09-09: "the pure scene ones should
 * encourage animals placed into the comfy scene somehow that makes sense,
 * or butterflies, fireflies, etc, something besides just a pure nature or
 * barn scene." A no-character render should never come back as a bare,
 * lifeless landscape or empty interior.
 *
 * Tries an ANIMAL_COMPANIONS-style pick first, at `animalChance`; if that
 * roll misses (or `animalPool` is empty after a path's own filtering),
 * falls back to an AMBIENT_LIFE pick (butterflies/fireflies/bees/drifting
 * petals/etc, filtered by `ambientTags`) — NEVER returns null. Call this
 * ONLY in a path's no-character branch; the with-character branch keeps its
 * existing animal-companion logic unchanged (a human already anchors the
 * scene as inhabited).
 *
 * `animalPool` — the path's own already-tag/keyword-filtered array of
 * ANIMAL_COMPANIONS description strings (or entry objects — either is fine,
 * picker.pickWithRecency just needs an array to choose from).
 * `ambientTags` — typically ['outdoor'] or ['indoor'] matching the path's
 * setting; AMBIENT_LIFE entries tagged "ANY" always pass either way.
 *
 * `excludeAmbientTags` (optional) — drops any AMBIENT_LIFE entry that also
 * carries one of these tags, applied AFTER the ambientTags include-filter.
 * Use for season-locked paths: most AMBIENT_LIFE entries are warm-weather
 * wildlife (bees, butterflies, fireflies, cherry blossom petals — tagged
 * "warm"), which read as a real seasonal mismatch on a winter path (a round
 * 2026-09-09 `first-snowfall` test render came back with cherry blossoms
 * blooming through a snow-covered roof). A handful of "winter"-tagged
 * entries exist specifically for this (robin, snowflakes, paw prints, frost,
 * breath-fog). Pass `excludeAmbientTags: ['warm']` on any winter-locked path.
 */
function pickPureSceneLife(picker, { animalPool, animalChance, ambientTags, excludeAmbientTags, axisPrefix }) {
  if (animalPool && animalPool.length && Math.random() < animalChance) {
    return picker.pickWithRecency(animalPool, `${axisPrefix}_animal`);
  }
  let candidates = filterByTags(AMBIENT_LIFE, ambientTags);
  if (excludeAmbientTags && excludeAmbientTags.length) {
    const excluded = new Set(excludeAmbientTags);
    candidates = candidates.filter((e) => !e.tags.some((t) => excluded.has(t)));
  }
  return picker.pickWithRecency(
    candidates.map((e) => e.description),
    `${axisPrefix}_ambient`
  );
}

module.exports = {
  byTags,
  filterByTags,
  genderOf,
  pickCharacter,
  pickPureSceneLife,

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
  AMBIENT_LIFE,
  CAMERA_COMPOSITION,
  POND_PLACE,
};
