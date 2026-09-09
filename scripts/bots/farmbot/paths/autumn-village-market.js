/**
 * FarmBot — autumn-village-market (Phase 1 pilot, rebuild 2026-09-08).
 *
 * Section 16 example archetype. Village-life-heavy: leans on
 * CHARACTER_ARCHETYPE (market-tagged, 2 picks) + FOOD_AND_BAKING +
 * WORLD_DETAIL_PROPS, season LOCKED to autumn. See FARMBOT_CREATIVE_DIRECTION.md.
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

module.exports = ({ sharedDNA, picker }) => {
  const characterA = pools.pickCharacter(picker, ['market'], 'market_character_a');
  const characterB = pools.pickCharacter(picker, ['market'], 'market_character_b');
  const food = picker.pickWithRecency(
    pools.byTags(pools.FOOD_AND_BAKING, ['market']),
    'market_food'
  );
  const activity = picker.pickWithRecency(
    pools.byTags(pools.ACTIVITY, ['chore', 'market', 'leisure']),
    'market_activity'
  );
  const props = picker.pickWithRecency(
    pools.byTags(pools.WORLD_DETAIL_PROPS, ['outdoor', 'market']),
    'market_props'
  );
  const season = picker.pickWithRecency(
    pools.byTags(pools.SEASON, ['autumn']),
    'market_season'
  );
  const weather = picker.pickWithRecency(
    pools.byTags(pools.WEATHER_ATMOSPHERE, ['autumn']),
    'market_weather'
  );
  const camera = picker.pickWithRecency(pools.CAMERA_COMPOSITION, 'market_camera');
  const animal =
    Math.random() < 0.35
      ? picker.pickWithRecency(pools.byTags(pools.ANIMAL_COMPANIONS, ['low']), 'market_animal')
      : null;
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'market_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE VILLAGERS ━━━
${characterA}
${characterB}

━━━ THE MARKET GOODS ━━━
${food}

━━━ WHAT'S HAPPENING ━━━
${activity}

━━━ THE SETTING (autumn village market) ━━━
${props}
${season}
${weather}
${animal ? `\n━━━ AN ANIMAL WANDERING THROUGH ━━━\n${animal}\n` : ''}
━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
render a colorful, bustling-but-never-stressful autumn market moment, every
villager warm and approachable, the setting rendered just as lovingly and
richly detailed as the subjects. Every face in the frame, human and animal
alike, stays clearly separate and fully legible — each face keeps its own
open space with a visible gap of air between it and any other face, so
every expression reads clean and unambiguous. no text, no words, no
watermarks, gallery quality`;
};
