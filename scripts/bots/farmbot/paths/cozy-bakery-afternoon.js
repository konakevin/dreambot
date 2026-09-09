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
  // Kevin (2026-09-09): not every render needs a human — a pure bakery
  // still-life or an animal visitor scene is just as on-brand. ~30% of the
  // time skip the character; when that happens, boost the odds of an
  // animal visitor so the frame still feels alive rather than empty.
  const includeCharacter = Math.random() < 0.6;

  const character = includeCharacter ? pools.pickCharacter(picker, ['bakery'], 'bakery_character') : null;
  const food = picker.pickWithRecency(
    pools.byTags(pools.FOOD_AND_BAKING, ['bakery']),
    'bakery_food'
  );
  // ACTIVITY entries are phrased as human actions with an implied subject —
  // only meaningful when a character is present.
  const activity = includeCharacter
    ? picker.pickWithRecency(pools.byTags(pools.ACTIVITY, ['chore', 'bakery', 'leisure']), 'bakery_activity')
    : null;
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
  const animalChance = includeCharacter ? 0.35 : 0.65;
  const animalPool = pools.byTags(pools.ANIMAL_COMPANIONS, ['low']);
  const animal = includeCharacter
    ? Math.random() < animalChance
      ? picker.pickWithRecency(animalPool, 'bakery_animal')
      : null
    : pools.pickPureSceneLife(picker, {
        animalPool,
        animalChance,
        ambientTags: ['indoor'],
        axisPrefix: 'bakery',
      });
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'bakery_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}${character ? `━━━ THE CHARACTER ━━━\n${character}\n\n` : ''}━━━ THE FOOD ━━━
${food}

${activity ? `━━━ WHAT'S HAPPENING ━━━\n${activity}\n\n` : ''}━━━ THE SETTING ━━━
${props}
${season}
${weather}
${animal ? `\n━━━ AN ANIMAL VISITOR ━━━\n${animal}\n` : ''}
━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  character
    ? `render a warm, inviting bakery-afternoon moment — the character, the food,
and the setting all rendered with equal loving detail, never a backdrop.
Every face in the frame, human and animal alike, stays clearly separate and
fully legible — each face keeps its own open space with a visible gap of
air between it and any other face, so every expression reads clean and
unambiguous.`
    : `no human figure anywhere in the frame — this is a warm, inviting bakery
still-life moment. The food and the setting carry the whole frame, rendered
with rich loving detail, never plain or empty.${animal ? ' Any animal present reads as a real, naturally distinct creature with open air around it; any small insect, bird, or floating detail (petals, dust motes, fireflies) stays simple and unposed, with no invented face or cartoon expression.' : ''}`
} no text, no words, no watermarks, gallery quality`;
};
