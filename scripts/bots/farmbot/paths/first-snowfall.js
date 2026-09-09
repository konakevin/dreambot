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
  // Kevin (2026-09-09): not every render needs a human — a pure snowy scene
  // (animal tracks, a robin on a fence, a snow-covered barn) is just as
  // on-brand. ~30% of the time skip the character and boost animal odds.
  const includeCharacter = Math.random() < 0.6;

  const character = includeCharacter
    ? pools.pickCharacter(picker, ['ANY', 'farm', 'leisure'], 'snow_character')
    : null;
  // ACTIVITY entries are phrased as human actions with an implied subject —
  // only meaningful when a character is present.
  const activity = includeCharacter
    ? picker.pickWithRecency(pools.byTags(pools.ACTIVITY, ['chore', 'leisure']), 'snow_activity')
    : null;
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
  const animalChance = includeCharacter ? 0.4 : 0.7;
  const animalPool = pools.byTags(pools.ANIMAL_COMPANIONS, ['low', 'medium']);
  const animal = includeCharacter
    ? Math.random() < animalChance
      ? picker.pickWithRecency(animalPool, 'snow_animal')
      : null
    : pools.pickPureSceneLife(picker, {
        animalPool,
        animalChance,
        // 'winter' opts into the season-locked winter-only entries (they
        // don't carry 'outdoor' so a plain ['outdoor'] filter never pulls
        // them in on non-winter paths); excludeAmbientTags then strips the
        // warm-season entries ('outdoor' alone would otherwise still match
        // the bees/butterflies/cherry-blossom entries too).
        ambientTags: ['outdoor', 'winter'],
        excludeAmbientTags: ['warm'],
        axisPrefix: 'snow',
      });
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'snow_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}${character ? `━━━ THE CHARACTER ━━━\n${character}\n\n` : ''}${activity ? `━━━ WHAT'S HAPPENING ━━━\n${activity}\n\n` : ''}━━━ THE SETTING (the first snowfall of the year) ━━━
${props}
${season}
${weather}
${animal ? `\n━━━ ANIMAL COMPANY ━━━\n${animal}\n` : ''}
━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  character
    ? `render a cozy, delighted first-snowfall moment — soft snow only, never a
storm or blizzard, the character and the setting rendered with equal
loving richness, never a bare or empty composition. Every face in the
frame, human and animal alike, stays clearly separate and fully legible.`
    : `no human figure anywhere in the frame — this is a cozy, delighted
first-snowfall moment carried entirely by the setting and whatever
animal life is in it — soft snow only, never a storm or blizzard, never
a bare or empty composition.${animal ? ' Any animal present reads as a real, naturally distinct creature with open air around it; any small insect, bird, or floating detail (petals, dust motes, fireflies) stays simple and unposed, with no invented face or cartoon expression.' : ''}`
} no text, no words, no watermarks, gallery quality`;
};
