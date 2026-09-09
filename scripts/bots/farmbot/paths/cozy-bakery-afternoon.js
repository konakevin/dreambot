/**
 * FarmBot — cozy-bakery-afternoon (Phase 1 pilot, rebuild 2026-09-08).
 *
 * Section 16 example archetype. Food-heavy: leans hard on FOOD_AND_BAKING +
 * CHARACTER_ARCHETYPE (baker-tagged), light on ANIMAL_COMPANIONS.
 * See FARMBOT_CREATIVE_DIRECTION.md.
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

module.exports = ({ sharedDNA, picker }) => {
  const character = pools.pickCharacter(picker, ['bakery'], 'bakery_character');
  const food = picker.pickWithRecency(
    pools.byTags(pools.FOOD_AND_BAKING, ['bakery']),
    'bakery_food'
  );
  const activity = picker.pickWithRecency(
    pools.byTags(pools.ACTIVITY, ['chore', 'bakery', 'leisure']),
    'bakery_activity'
  );
  const props = picker.pickWithRecency(
    pools.byTags(pools.WORLD_DETAIL_PROPS, ['indoor', 'bakery']),
    'bakery_props'
  );
  const season = picker.pickWithRecency(pools.SEASON.map((e) => e.description), 'bakery_season');
  const weather = picker.pickWithRecency(
    pools.WEATHER_ATMOSPHERE.map((e) => e.description),
    'bakery_weather'
  );
  const camera = picker.pickWithRecency(pools.CAMERA_COMPOSITION, 'bakery_camera');
  const animal =
    Math.random() < 0.35
      ? picker.pickWithRecency(pools.byTags(pools.ANIMAL_COMPANIONS, ['low']), 'bakery_animal')
      : null;
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'bakery_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE CHARACTER ━━━
${character}

━━━ THE FOOD ━━━
${food}

━━━ WHAT'S HAPPENING ━━━
${activity}

━━━ THE SETTING ━━━
${props}
${season}
${weather}
${animal ? `\n━━━ AN ANIMAL VISITOR ━━━\n${animal}\n` : ''}
━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
render a warm, inviting bakery-afternoon moment — the character, the food,
and the setting all rendered with equal loving detail, never a backdrop.
Every face in the frame, human and animal alike, stays clearly separate and
fully legible — each face keeps its own open space with a visible gap of
air between it and any other face, so every expression reads clean and
unambiguous. no text, no words, no watermarks, gallery quality`;
};
