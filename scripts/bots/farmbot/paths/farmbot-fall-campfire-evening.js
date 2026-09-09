/**
 * FarmBot — farmbot-fall-campfire-evening (SEASONAL, Fall-general — NOT
 * Halloween-specific). Lives ONLY in bot.seasonalPaths.fall in index.js —
 * NEVER in the normal paths[] rotation (see scripts/lib/botSeasonal.js and
 * FARMBOT_PATH_BUILD_STATE.md's architecture notes). Precedent for this
 * seasonal-path shape: scripts/bots/chibibot/paths/chibi-halloween-cozy.js.
 *
 * CONCEPT: a small, intimate evening campfire on the farm in autumn — a
 * modest, cozy-scale fire (never large/blazing), roasting marshmallows,
 * wrapped in blankets, cider, string lights/lanterns nearby, fallen leaves,
 * a clear dusk/blue-hour/full-night sky. This is the bot's natural home for
 * genuine time-of-day variety since the whole concept IS an evening scene —
 * the bespoke SKY axis leans hard into dusk/blue-hour/full-night variety
 * instead of the shared SEASON/WEATHER_ATMOSPHERE pools (both skipped; a
 * temperate 4-season framing and a general daytime-leaning weather pool
 * would both fight this path's own always-evening premise, same reasoning
 * the tropical Phase-4 paths used to skip WEATHER_ATMOSPHERE).
 *
 * Distinct from the two existing normal-rotation paths that could otherwise
 * read similar:
 *   - quiet-sunset-on-the-porch — the PORCH is the hero, daytime/sunset,
 *     no fire at all.
 *   - picnic-in-the-meadow — an open-air DAYTIME picnic blanket is the hero.
 *   THIS path's hero is the CAMPFIRE ITSELF (small stone ring, contained
 *   flames, glowing embers) as the central warm-glow focal point, always at
 *   dusk/night — no other FarmBot path owns fire or night sky.
 *
 * FOUR bespoke axes (own seed files, not shared — see gen scripts under
 * scripts/gen-seeds/farmbot/gen-fall-campfire-evening-*.js):
 *   1. FIRE        (always, HERO — goes FIRST in the template per the
 *                   maxTokens content-ordering rule, botEngine.js callClaude
 *                   fixed maxTokens: 400, FARMBOT_PATH_BUILD_STATE.md)
 *   2. SKY         (always, CO-HERO — goes SECOND, immediately after fire and
 *                   BEFORE the cast block; see the maxTokens finding below)
 *                   — dusk / blue hour / full night with stars
 *   3. ACTIVITY    (character-only) — roasting marshmallows, cider, blankets
 *   4. DETAIL      (always) — surrounding camp world: seating, blankets,
 *                   cider mugs, string lights/lanterns (separate light
 *                   source from the fire), fallen leaves
 *
 * HIGH-RISK PATH for the documented dark+light contradictory-pairing bug
 * (FARMBOT_PATH_BUILD_STATE.md's fishing-dock lesson: pairing "dark"/
 * "shadow" with a light-implying word describing the SAME thing rendered as
 * a literal glowing beam/starry artifact cut into an otherwise normal
 * scene) — this path is nothing BUT fire-glow and night-sky language, so
 * every one of the 4 bespoke gen scripts bakes the ban in at the source,
 * and the generated pools were additionally scanned programmatically
 * (dark+light co-occurrence, negation, metaphorical light-as-object,
 * back-turned framing, oversized-fire language, Halloween-coded words) with
 * every real hit rewritten before this path ever rendered.
 *
 * "Sometimes no human" rule: includeCharacter = Math.random() < 0.6
 * (standardized bot-wide, FARMBOT_PATH_BUILD_STATE.md's 2026-09-09 60/40
 * change). No-character branch guarantees ambient life via
 * pools.pickPureSceneLife (excludeAmbientTags: ['winter'] — this is Fall,
 * not winter, so no snow/frost-flavored ambient entries).
 *
 * MAXTOKENS FINDING (round 1, this path): the naive fire→cast→sky ordering
 * was tested first and the real DB `ai_prompt` for every one of 5 round-1
 * renders showed Sonnet's own rewrite running out of its fixed 400-token
 * budget WHILE STILL ELABORATING the (verbose) pickCharacter() block —
 * the dedicated SKY pool text never survived into a single one of the 5
 * prompts, even though the rendered images still showed a night sky (Flux's
 * own default fill-in from ambient "night" cues elsewhere, not this path's
 * carefully-built dusk/blue-hour/full-night variety). Since the task brief
 * calls out sky variety as this path's defining, lean-into feature, SKY was
 * moved to go SECOND (right after fire, before the cast block) so both
 * declared co-heroes survive regardless of how verbose the character pick
 * turns out to be. The CAST block still comes third — per the front-loading
 * lesson (papaya-guava-orchard, barn-animal-shelter-interior) the no-
 * character branch's governing "no human figure" sentence is short (unlike
 * the long with-character pickCharacter() text) and stays forceful/
 * repeated, so pushing it one slot later (after two short axis picks, not a
 * long one) was judged an acceptable, testable risk rather than the
 * dominant one — verified clean in QA (see round notes below).
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

const FIRE = require('../seeds/farmbot_fall_campfire_evening_fire.json');
const SKY = require('../seeds/farmbot_fall_campfire_evening_sky.json');
const ACTIVITY = require('../seeds/farmbot_fall_campfire_evening_activity.json');
const DETAIL = require('../seeds/farmbot_fall_campfire_evening_detail.json');

// Shared CAMERA_COMPOSITION is untagged and carries several framings that
// don't fit this path's intimate, always-outdoor, always-night premise —
// same "even an untagged pool carries physical-setting assumptions" lesson
// as fishing-dock. Excludes: back-turned/rear-view framings (should already
// be gone from the pool per the 2026-09-09 fix, filtered again here as a
// belt-and-suspenders check), the tiny/dwarfed/sky-dominating dwarfing
// language that resurfaced during the 120-scale-up (still present in the
// pool — the fix there was documented as "each path must widen its own
// filter," not a pool-level removal — "dominant" added alongside
// "dominating" after round-2 QA on THIS path caught a "the wide luminous
// sky dominant above" entry evading the narrower "sky dominating" check by
// word form alone), and any indoor/farmhouse-window/village/barn framing
// that has no place at an outdoor evening campfire.
const CAMERA_BAD_RE =
  /tiny|dwarf|small within|sky dominat\w*|wide establishing|village|barn|rooftop|over-the-shoulder|rear view|back turned|facing away|behind them|walking away|farmhouse window|interior composition|through a window|\bvast\b/i;
const CAMPFIRE_CAMERA = pools.CAMERA_COMPOSITION.filter((e) => !CAMERA_BAD_RE.test(e));

// ANIMAL_COMPANIONS entries are written with implicit daytime staging
// ("napping in afternoon sun") that would contradict this path's always-
// evening/night setting — filter to entries with no explicit daytime words,
// same content-incompatibility class as picnic-in-the-meadow's indoor-food
// filter.
const DAYTIME_WORDS_RE = /\bsun\b|sunny|sunlight|afternoon|daylight|morning|dawn|daytime/i;
const CAMPFIRE_SAFE_ANIMALS = pools
  .byTags(pools.ANIMAL_COMPANIONS, ['low'])
  .filter((desc) => !DAYTIME_WORDS_RE.test(desc));

module.exports = ({ sharedDNA, picker }) => {
  const includeCharacter = Math.random() < 0.6;

  const fire = picker.pickWithRecency(FIRE, 'campfire_fire');
  const sky = picker.pickWithRecency(SKY, 'campfire_sky');

  const character = includeCharacter
    ? pools.pickCharacter(picker, ['ANY', 'leisure'], 'campfire_character')
    : null;
  const activity = includeCharacter
    ? picker.pickWithRecency(ACTIVITY, 'campfire_activity')
    : null;
  const detail = picker.pickWithRecency(DETAIL, 'campfire_detail');
  const camera = picker.pickWithRecency(CAMPFIRE_CAMERA, 'campfire_camera');

  const animalChance = includeCharacter ? 0.3 : 0.6;
  const animal = includeCharacter
    ? Math.random() < animalChance
      ? picker.pickWithRecency(CAMPFIRE_SAFE_ANIMALS, 'campfire_animal')
      : null
    : pools.pickPureSceneLife(picker, {
        animalPool: CAMPFIRE_SAFE_ANIMALS,
        animalChance,
        ambientTags: ['outdoor'],
        excludeAmbientTags: ['winter'],
        axisPrefix: 'campfire',
      });

  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'campfire_magic')
      : null;

  // Cast block front-loaded right after the fire hero block (papaya-guava-
  // orchard / barn-animal-shelter-interior lesson: the CAST-determining
  // sentence is essential, not decorative — losing it to the maxTokens
  // budget flips the render's correctness, not just its detail).
  const castBlock = includeCharacter
    ? `━━━ WHO'S HERE ━━━
${character}
A clear, prominent, unmistakable presence beside the fire — never distant or incidental.

`
    : `━━━ WHO'S HERE ━━━
No human figure anywhere in the frame — this is a quiet campfire still-life moment, the fire
tended and glowing but no one sitting beside it right now. It is not optional background mood —
the detail named below must actually appear in the render, clearly and visibly:
${animal}

`;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE CAMPFIRE (the hero of the shot) ━━━
${fire}

━━━ THE EVENING SKY (co-hero — this path's signature time-of-day variety) ━━━
${sky}

${castBlock}${activity ? `\n━━━ WHAT'S HAPPENING (unhurried, warmed by the fire) ━━━\n${activity}\n` : ''}
━━━ AROUND THE FIRE ━━━
${detail}
${includeCharacter && animal ? `\n━━━ A QUIET COMPANION ━━━\n${animal}\n` : ''}
━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  includeCharacter
    ? `render a warm, unhurried autumn-evening campfire moment — the character and the small,
glowing fire rendered with equal loving detail, the fire's warm glow the dominant light source
across the scene, faces and hands catching its color. Every face in the frame, human and animal
alike, stays clearly separate and fully legible.`
    : `this is a warm, unhurried autumn-evening campfire still-life, the small fire glowing quietly
on its own. The fire and its cozy surroundings carry the whole frame, rendered with rich loving
detail, the fire's warm glow the dominant light source across the scene. Any animal or ambient
life present reads as a real, naturally distinct creature with open air around it, with no
invented face or cartoon expression on anything else in the frame.`
} This stays a close, intimate evening moment held near the fire's own small circle of light —
never a distant wide landscape view. no text, no words, no watermarks, gallery quality`;
};
