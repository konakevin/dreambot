/**
 * FarmBot — lakeside-riverside-moment (Phase 2, 2026-09-09).
 *
 * Section 16 example archetype. Place-led (the wide lake or flowing river is
 * the hero, always named first) — deliberately a LARGER, MORE OPEN body of
 * water than summer-evening-by-the-pond.js's small, intimate POND_PLACE.
 * Uses the path-bespoke LAKESIDE_RIVERSIDE_PLACE pool (required directly
 * from its JSON — this pool is NOT added to pools.js, see
 * gen-lakeside-riverside-place-pool.js) as the setting anchor, same pattern
 * as summer-evening-by-the-pond.js uses POND_PLACE and
 * flower-field-wandering.js uses FLOWER_FIELD_PLACE.
 *
 * No season lock — a wide lake or river reads beautifully in every season
 * (misty spring morning, glinting summer afternoon, amber autumn shoreline,
 * ice-fringed winter stillness), so this path rolls the full SEASON and
 * WEATHER_ATMOSPHERE ranges instead of restricting to a subset.
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Path-bespoke pool — required directly, NOT added to pools.js (shared file,
// other agents are editing it concurrently). See:
// scripts/gen-seeds/farmbot/gen-lakeside-riverside-place-pool.js
const LAKESIDE_RIVERSIDE_PLACE = require('../seeds/farmbot_lakeside_riverside_place.json');

module.exports = ({ sharedDNA, picker }) => {
  // "Sometimes no human" rule (Kevin 2026-09-09) — a wide, open lake or
  // river reads just as beautifully as a pure-scene shot (mist over the
  // water, a heron at the shoreline, fish rippling the surface) as it does
  // with a character present.
  const includeCharacter = Math.random() < 0.6;

  const water = picker.pickWithRecency(LAKESIDE_RIVERSIDE_PLACE, 'lakeside_riverside_place');
  const character = includeCharacter
    ? pools.pickCharacter(picker, ['ANY', 'leisure', 'farm'], 'lakeside_riverside_character')
    : null;
  // ACTIVITY entries are phrased as human actions with an implied subject —
  // only meaningful when a character is present.
  const activity = includeCharacter
    ? picker.pickWithRecency(pools.byTags(pools.ACTIVITY, ['leisure']), 'lakeside_riverside_activity')
    : null;
  const season = picker.pickWithRecency(
    pools.byTags(pools.SEASON, ['spring', 'summer', 'autumn', 'winter']),
    'lakeside_riverside_season'
  );
  const weather = picker.pickWithRecency(
    pools.byTags(pools.WEATHER_ATMOSPHERE, ['spring', 'summer', 'autumn', 'winter', 'ANY']),
    'lakeside_riverside_weather'
  );
  const camera = picker.pickWithRecency(pools.CAMERA_COMPOSITION, 'lakeside_riverside_camera');
  // Boost animal-presence odds when there's no human subject to carry the
  // frame, same pattern as pond/flower-field.
  const animalChance = includeCharacter ? 0.45 : 0.8;
  const animalPool = pools.byTags(pools.ANIMAL_COMPANIONS, ['low', 'medium']);
  const animal = includeCharacter
    ? Math.random() < animalChance
      ? picker.pickWithRecency(animalPool, 'lakeside_riverside_animal')
      : null
    : pools.pickPureSceneLife(picker, {
        animalPool,
        animalChance,
        ambientTags: ['outdoor'],
        axisPrefix: 'lakeside_riverside',
      });
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'lakeside_riverside_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE LAKE OR RIVER (the hero of the shot) ━━━
${water}
${character ? `\n━━━ THE CHARACTER ━━━\n${character}\n` : ''}
${activity ? `━━━ WHAT'S HAPPENING ━━━\n${activity}\n\n` : ''}━━━ SEASON & ATMOSPHERE ━━━
${season}
${weather}
${animal ? `\n━━━ ANIMAL COMPANY ━━━\n${animal}\n` : ''}
━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  character
    ? `render a warm, unhurried lakeside or riverside moment — the wide open
water, the character, and every detail rendered with equal loving richness,
never a bare or empty composition. Every face in the frame, human and
animal alike, stays clearly separate and fully legible.`
    : `no human figure anywhere in the frame — this is a warm, unhurried
lakeside or riverside moment carried entirely by the wide open water itself
and whatever wildlife shares it, every detail rendered with equal loving
richness, never a bare or empty composition.${animal ? ' Any animal present reads as a real, naturally distinct creature with open air around it; any small insect, bird, or floating detail (petals, dust motes, fireflies) stays simple and unposed, with no invented face or cartoon expression.' : ''}`
} no text, no words, no watermarks, gallery quality`;
};
