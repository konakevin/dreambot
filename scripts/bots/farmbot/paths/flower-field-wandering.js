/**
 * FarmBot — flower-field-wandering (Phase 2, 2026-09-09).
 *
 * Section 16 example archetype. Place-led (the wide-open wildflower field is
 * the hero, always named first) — a pure "wandering" leisure moment, not
 * tied to any specific structure. Uses the path-bespoke FLOWER_FIELD_PLACE
 * pool (required directly from its JSON — this pool is NOT added to
 * pools.js, see gen-flower-field-place-pool.js) as the setting anchor, same
 * pattern as summer-evening-by-the-pond.js uses POND_PLACE and
 * harvest-festival.js uses HARVEST_FESTIVAL_PLACE.
 *
 * No season lock — the wildflower field itself already carries the seasonal
 * signal loosely (spring/summer bloom), so this path rolls SEASON from the
 * shared pool for extra variety instead of hard-locking it.
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Path-bespoke pool — required directly, NOT added to pools.js (shared file,
// other agents are editing it concurrently). See:
// scripts/gen-seeds/farmbot/gen-flower-field-place-pool.js
const FLOWER_FIELD_PLACE = require('../seeds/farmbot_flower_field_place.json');

module.exports = ({ sharedDNA, picker }) => {
  // Kevin (2026-09-09): "sometimes no human" rule — this path in particular
  // is a natural fit for a gorgeous pure-scene/butterfly-and-bee render, so
  // lean a bit further toward no-human than the pond path's 65%.
  const includeCharacter = Math.random() < 0.6;

  const field = picker.pickWithRecency(FLOWER_FIELD_PLACE, 'flower_field_place');
  const character = includeCharacter
    ? pools.pickCharacter(picker, ['ANY', 'leisure', 'farm'], 'flower_field_character')
    : null;
  // ACTIVITY entries are phrased as human actions with an implied subject —
  // only meaningful when a character is present.
  const activity = includeCharacter
    ? picker.pickWithRecency(pools.byTags(pools.ACTIVITY, ['leisure']), 'flower_field_activity')
    : null;
  const season = picker.pickWithRecency(
    pools.byTags(pools.SEASON, ['spring', 'summer', 'ANY']),
    'flower_field_season'
  );
  const weather = picker.pickWithRecency(
    pools.byTags(pools.WEATHER_ATMOSPHERE, ['spring', 'summer', 'ANY']),
    'flower_field_weather'
  );
  const camera = picker.pickWithRecency(pools.CAMERA_COMPOSITION, 'flower_field_camera');
  const animalChance = includeCharacter ? 0.45 : 0.8;
  const animalPool = pools.byTags(pools.ANIMAL_COMPANIONS, ['low', 'medium']);
  const animal = includeCharacter
    ? Math.random() < animalChance
      ? picker.pickWithRecency(animalPool, 'flower_field_animal')
      : null
    : pools.pickPureSceneLife(picker, {
        animalPool,
        animalChance,
        ambientTags: ['outdoor'],
        axisPrefix: 'flower_field',
      });
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'flower_field_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE FLOWER FIELD (the hero of the shot) ━━━
${field}
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
    ? `render a warm, unhurried flower-field wandering moment — the field, the
character, and every bloom and butterfly rendered with equal loving
richness, never a bare or empty composition. Every face in the frame, human
and animal alike, stays clearly separate and fully legible.`
    : `no human figure anywhere in the frame — this is a warm, unhurried
flower-field wandering moment carried entirely by the wide-open field itself
and whatever wildlife shares it, every bloom and butterfly rendered with
equal loving richness, never a bare or empty composition.${animal ? ' Any animal present reads as a real, naturally distinct creature with open air around it; any small insect, bird, or floating detail (petals, dust motes, fireflies) stays simple and unposed, with no invented face or cartoon expression.' : ''}`
} no text, no words, no watermarks, gallery quality`;
};
