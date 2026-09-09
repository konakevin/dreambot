/**
 * FarmBot — woodland-walk (Phase 2, 2026-09-09).
 *
 * Section 16 example archetype. Place-led (the small, friendly storybook
 * woodland is the hero, always named first) — a gentle wander through
 * dappled light, a winding path, moss-covered stones, and small non-
 * threatening woodland creatures. Uses the path-bespoke WOODLAND_WALK_PLACE
 * pool (required directly from its JSON — this pool is NOT added to
 * pools.js, see gen-woodland-walk-place-pool.js) as the setting anchor, same
 * pattern as summer-evening-by-the-pond.js uses POND_PLACE and
 * flower-field-wandering.js uses FLOWER_FIELD_PLACE. Rabbits/birds/squirrels
 * are already woven directly into the bespoke place-pool text itself (same
 * pattern the pond pool uses for frogs/dragonflies) — the shared
 * ANIMAL_COMPANIONS layer below is an optional additional "featured animal
 * moment" on top, not the only source of wildlife.
 *
 * No season lock — the woodland reads well across spring/summer/autumn, so
 * SEASON + WEATHER_ATMOSPHERE are rolled from the shared pools for variety
 * (winter excluded: the place pool's own leaf-litter/fern/toadstool detail
 * would contradict a snowy WEATHER_ATMOSPHERE pick).
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Path-bespoke pool — required directly, NOT added to pools.js (shared file,
// other agents may be editing it concurrently). See:
// scripts/gen-seeds/farmbot/gen-woodland-walk-place-pool.js
const WOODLAND_WALK_PLACE = require('../seeds/farmbot_woodland_walk_place.json');

module.exports = ({ sharedDNA, picker }) => {
  // Kevin (2026-09-09): "sometimes no human" rule — this path is a natural
  // fit for a gorgeous pure-wildlife/scene render (a rabbit pausing on a
  // mossy path, a squirrel on a sunlit branch), so lean a bit further toward
  // no-human, same as flower-field-wandering.
  const includeCharacter = Math.random() < 0.6;

  const woodland = picker.pickWithRecency(WOODLAND_WALK_PLACE, 'woodland_walk_place');
  const character = includeCharacter
    ? pools.pickCharacter(picker, ['ANY', 'leisure', 'farm'], 'woodland_walk_character')
    : null;
  // ACTIVITY entries are phrased as human actions with an implied subject —
  // only meaningful when a character is present.
  const activity = includeCharacter
    ? picker.pickWithRecency(pools.byTags(pools.ACTIVITY, ['leisure']), 'woodland_walk_activity')
    : null;
  const season = picker.pickWithRecency(
    pools.byTags(pools.SEASON, ['spring', 'summer', 'autumn', 'ANY']),
    'woodland_walk_season'
  );
  const weather = picker.pickWithRecency(
    pools.byTags(pools.WEATHER_ATMOSPHERE, ['spring', 'summer', 'autumn', 'ANY']),
    'woodland_walk_weather'
  );
  const camera = picker.pickWithRecency(pools.CAMERA_COMPOSITION, 'woodland_walk_camera');
  const animalChance = includeCharacter ? 0.5 : 0.85;
  const animalPool = pools.byTags(pools.ANIMAL_COMPANIONS, ['low', 'medium']);
  const animal = includeCharacter
    ? Math.random() < animalChance
      ? picker.pickWithRecency(animalPool, 'woodland_walk_animal')
      : null
    : pools.pickPureSceneLife(picker, {
        animalPool,
        animalChance,
        ambientTags: ['outdoor'],
        axisPrefix: 'woodland_walk',
      });
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'woodland_walk_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE WOODLAND (the hero of the shot) ━━━
${woodland}
${animal ? `\n━━━ ANIMAL COMPANY (present in this render — a required, concrete, clearly-visible detail, not just background mood) ━━━\n${animal}\n` : ''}
${character ? `\n━━━ THE CHARACTER ━━━\n${character}\n` : ''}
${activity ? `━━━ WHAT'S HAPPENING ━━━\n${activity}\n\n` : ''}━━━ SEASON & ATMOSPHERE ━━━
${season}
${weather}

━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  character
    ? `render a warm, unhurried woodland-walk moment — the small, friendly
woodland, the character, and every mossy stone, leaf, and dappled patch of
light rendered with equal loving richness, never a bare or empty
composition. The trees and leafy canopy surround and fill the frame close at
hand on every side, and the character walks right among them, within easy
reach of the nearest trunks and mossy stones — a figure IN the woodland, not
a distant tiny speck in an open field or meadow beyond it. Every face in the
frame, human and animal alike, stays clearly separate and fully legible.`
    : `no human figure anywhere in the frame — this is a warm, unhurried
woodland-walk moment carried entirely by the small, friendly woodland itself
and whatever gentle creature shares it, every mossy stone, leaf, and dappled
patch of light rendered with equal loving richness, never a bare or empty
composition. The trees and leafy canopy surround and fill the frame close at
hand on every side.${animal ? ' Any animal present reads as a real, naturally distinct creature with open air around it; any small insect, bird, or floating detail (petals, dust motes, fireflies) stays simple and unposed, with no invented face or cartoon expression.' : ''}`
} no text, no words, no watermarks, gallery quality`;
};
