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
  // Kevin (2026-09-09): not every render needs a human — a pure market
  // still-life (an early-quiet stall, animals wandering through) is just as
  // on-brand. Roll a headcount instead of always assuming two villagers.
  // Rebalanced 2026-09-09 to the bot-wide 60/40 character/pure-scene split.
  const roll = Math.random();
  const headcount = roll < 0.44 ? 2 : roll < 0.6 ? 1 : 0;

  const characterA = headcount >= 1 ? pools.pickCharacter(picker, ['market'], 'market_character_a') : null;
  const characterB = headcount >= 2 ? pools.pickCharacter(picker, ['market'], 'market_character_b') : null;
  const food = picker.pickWithRecency(
    pools.byTags(pools.FOOD_AND_BAKING, ['market']),
    'market_food'
  );
  // ACTIVITY entries are phrased as human actions with an implied subject —
  // only meaningful when at least one character is present.
  const activity =
    headcount >= 1
      ? picker.pickWithRecency(pools.byTags(pools.ACTIVITY, ['chore', 'market', 'leisure']), 'market_activity')
      : null;
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
  const animalChance = headcount === 0 ? 0.65 : 0.35;
  const animalPool = pools.byTags(pools.ANIMAL_COMPANIONS, ['low']);
  const animal =
    headcount === 0
      ? pools.pickPureSceneLife(picker, {
          animalPool,
          animalChance,
          ambientTags: ['outdoor'],
          axisPrefix: 'market',
        })
      : Math.random() < animalChance
        ? picker.pickWithRecency(animalPool, 'market_animal')
        : null;
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'market_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}${
    characterA
      ? `━━━ THE VILLAGERS ━━━\n${characterA}\n${characterB || ''}\n\n`
      : ''
  }━━━ THE MARKET GOODS ━━━
${food}

${activity ? `━━━ WHAT'S HAPPENING ━━━\n${activity}\n\n` : ''}━━━ THE SETTING (autumn village market) ━━━
${props}
${season}
${weather}
${animal ? `\n━━━ AN ANIMAL WANDERING THROUGH ━━━\n${animal}\n` : ''}
━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  characterA
    ? `render a colorful, bustling-but-never-stressful autumn market moment, every
villager warm and approachable, the setting rendered just as lovingly and
richly detailed as the subjects. Every face in the frame, human and animal
alike, stays clearly separate and fully legible — each face keeps its own
open space with a visible gap of air between it and any other face, so
every expression reads clean and unambiguous.`
    : `no human figure anywhere in the frame — this is a quiet, colorful market
still-life moment. The goods and the stalls carry the whole scene, rendered
with rich loving detail, never plain or empty.${animal ? ' Any animal present reads as a real, naturally distinct creature with open air around it; any small insect, bird, or floating detail (petals, dust motes, fireflies) stays simple and unposed, with no invented face or cartoon expression.' : ''}`
} no text, no words, no watermarks, gallery quality`;
};
