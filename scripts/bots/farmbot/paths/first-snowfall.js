/**
 * FarmBot — first-snowfall (Phase 1, rebuild 2026-09-08).
 *
 * Section 16 example archetype. Season LOCKED to winter (in the path
 * name). Cozy, never bleak — soft snow, warm farmhouse glow, per
 * FARMBOT_CREATIVE_DIRECTION.md section 10 (winter: "cozy... never a
 * blizzard or storm").
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

module.exports = ({ sharedDNA, picker }) => {
  const character = pools.pickCharacter(picker, ['ANY', 'farm', 'leisure'], 'snow_character');
  const activity = picker.pickWithRecency(
    pools.byTags(pools.ACTIVITY, ['chore', 'leisure']),
    'snow_activity'
  );
  const props = picker.pickWithRecency(
    pools.byTags(pools.WORLD_DETAIL_PROPS, ['outdoor', 'farmhouse', 'garden', 'indoor']),
    'snow_props'
  );
  const season = picker.pickWithRecency(
    pools.byTags(pools.SEASON, ['winter']),
    'snow_season'
  );
  const weather = picker.pickWithRecency(
    pools.byTags(pools.WEATHER_ATMOSPHERE, ['winter']),
    'snow_weather'
  );
  const camera = picker.pickWithRecency(pools.CAMERA_COMPOSITION, 'snow_camera');
  const animal =
    Math.random() < 0.4
      ? picker.pickWithRecency(pools.byTags(pools.ANIMAL_COMPANIONS, ['low', 'medium']), 'snow_animal')
      : null;
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'snow_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE CHARACTER ━━━
${character}

━━━ WHAT'S HAPPENING ━━━
${activity}

━━━ THE SETTING (the first snowfall of the year) ━━━
${props}
${season}
${weather}
${animal ? `\n━━━ ANIMAL COMPANY ━━━\n${animal}\n` : ''}
━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
render a cozy, delighted first-snowfall moment — soft snow only, never a
storm or blizzard, the character and the setting rendered with equal
loving richness, never a bare or empty composition. Every face in the
frame, human and animal alike, stays clearly separate and fully legible.
no text, no words, no watermarks, gallery quality`;
};
