/**
 * FarmBot — animal-feeding-time (Phase 1 pilot, rebuild 2026-09-08).
 *
 * Section 16 example archetype. Animal-heavy: leans hard on ANIMAL_COMPANIONS
 * (medium/high/chaos density) + CHARACTER_ARCHETYPE, light on FOOD_AND_BAKING.
 * See FARMBOT_CREATIVE_DIRECTION.md.
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

module.exports = ({ sharedDNA, picker }) => {
  const animals = picker.pickWithRecency(
    pools.byTags(pools.ANIMAL_COMPANIONS, ['medium', 'high', 'chaos']),
    'animal_feeding_animals'
  );
  const character = pools.pickCharacter(picker, ['farm', 'animal'], 'animal_feeding_character');
  const activity = picker.pickWithRecency(
    pools.byTags(pools.ACTIVITY, ['chore', 'farm']),
    'animal_feeding_activity'
  );
  const props = picker.pickWithRecency(
    pools.byTags(pools.WORLD_DETAIL_PROPS, ['outdoor', 'farmhouse', 'garden']),
    'animal_feeding_props'
  );
  const season = picker.pickWithRecency(pools.SEASON.map((e) => e.description), 'animal_feeding_season');
  const weather = picker.pickWithRecency(
    pools.WEATHER_ATMOSPHERE.map((e) => e.description),
    'animal_feeding_weather'
  );
  const camera = picker.pickWithRecency(pools.CAMERA_COMPOSITION, 'animal_feeding_camera');
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'animal_feeding_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE CHARACTER ━━━
${character}

━━━ THE ANIMALS (gathered eagerly for feeding time) ━━━
${animals}

━━━ WHAT'S HAPPENING ━━━
${activity}

━━━ THE SETTING ━━━
${props}
${season}
${weather}

━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
render the character and the animals together, warmly interacting, both full
of personality and charm — the setting rendered just as lovingly and richly
detailed as the subjects, never a backdrop. Every face in the frame, human
and animal alike, stays clearly separate and fully legible — each face keeps
its own open space with a visible gap of air between it and any other face,
so every expression reads clean and unambiguous. no text, no words, no
watermarks, gallery quality`;
};
