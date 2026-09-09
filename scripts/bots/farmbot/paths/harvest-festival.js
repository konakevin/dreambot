/**
 * FarmBot — harvest-festival (Phase 1, 2026-09-08).
 *
 * Section 16 example archetype. Place-led (the decorated harvest-festival
 * grounds are the hero, always named first) — season LOCKED to autumn since
 * it's in the path name. Uses the path-bespoke HARVEST_FESTIVAL_PLACE pool
 * (required directly from its JSON — this pool is NOT added to pools.js,
 * see gen-harvest-festival-place-pool.js) as the setting anchor, same
 * pattern as summer-evening-by-the-pond.js uses POND_PLACE.
 *
 * Kept deliberately distinct from two neighboring paths (Kevin's brief):
 *   - autumn-village-market — market-stall goods-for-sale focus. This path
 *     leans into HARVEST-SPECIFIC hero imagery instead (hay bales, corn
 *     stalks, apple orchards, a wheelbarrow overflowing with squash,
 *     scarecrows, a hay-bale maze) — the bespoke pool's own meta-prompt
 *     bans market-stall-produce-for-sale phrasing.
 *   - the future Phase-3 seasonal-festival autumn variant (lantern-festival
 *     decor). The bespoke pool's meta-prompt also bans lantern/lantern-glow
 *     language for the same reason.
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Path-bespoke pool — required directly, NOT added to pools.js (shared file,
// other agents are editing it concurrently). See:
// scripts/gen-seeds/farmbot/gen-harvest-festival-place-pool.js
const HARVEST_FESTIVAL_PLACE = require('../seeds/farmbot_harvest_festival_place.json');

module.exports = ({ sharedDNA, picker }) => {
  // Kevin (2026-09-09): "sometimes no human" rule, PLUS this is a "festival"
  // concept — allow for multiple characters occasionally to capture the
  // communal-gathering feel, without forcing a crowd every time. Mirrors
  // autumn-village-market's headcount roll. Rebalanced 2026-09-09 to the
  // bot-wide 60/40 character/pure-scene split.
  const roll = Math.random();
  const headcount = roll < 0.43 ? 1 : roll < 0.6 ? 2 : 0;

  const characterA =
    headcount >= 1 ? pools.pickCharacter(picker, ['farm', 'leisure'], 'harvest_festival_character_a') : null;
  const characterB =
    headcount >= 2 ? pools.pickCharacter(picker, ['farm', 'leisure'], 'harvest_festival_character_b') : null;

  const place = picker.pickWithRecency(HARVEST_FESTIVAL_PLACE, 'harvest_festival_place');

  // ACTIVITY entries are phrased as human actions with an implied subject —
  // only meaningful when at least one character is present.
  const activity =
    headcount >= 1
      ? picker.pickWithRecency(pools.byTags(pools.ACTIVITY, ['chore', 'farm', 'leisure']), 'harvest_festival_activity')
      : null;

  const season = picker.pickWithRecency(pools.byTags(pools.SEASON, ['autumn']), 'harvest_festival_season');
  const weather = picker.pickWithRecency(
    pools.byTags(pools.WEATHER_ATMOSPHERE, ['autumn']),
    'harvest_festival_weather'
  );
  const camera = picker.pickWithRecency(pools.CAMERA_COMPOSITION, 'harvest_festival_camera');

  const animalChance = headcount === 0 ? 0.75 : 0.4;
  const animalPool = pools.byTags(pools.ANIMAL_COMPANIONS, ['low', 'medium']);
  const animal =
    headcount === 0
      ? pools.pickPureSceneLife(picker, {
          animalPool,
          animalChance,
          ambientTags: ['outdoor'],
          axisPrefix: 'harvest_festival',
        })
      : Math.random() < animalChance
        ? picker.pickWithRecency(animalPool, 'harvest_festival_animal')
        : null;
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'harvest_festival_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE HARVEST FESTIVAL (the hero of the shot) ━━━
${place}
${
  characterA
    ? `\n━━━ THE CELEBRANTS ━━━\n${characterA}\n${characterB || ''}\n`
    : ''
}
${activity ? `━━━ WHAT'S HAPPENING ━━━\n${activity}\n\n` : ''}━━━ SEASON & ATMOSPHERE ━━━
${season}
${weather}
${animal ? `\n━━━ AN ANIMAL AT THE FESTIVAL ━━━\n${animal}\n` : ''}
━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  characterA
    ? `render a joyful, warm harvest-festival celebration moment — the celebrants
and the fully decorated harvest setting rendered with equal loving
richness, never a bare backdrop. Every face in the frame, human and animal
alike, stays clearly separate and fully legible — each face keeps its own
open space with a visible gap of air between it and any other face, so
every expression reads clean and unambiguous.`
    : `no human figure anywhere in the frame — this is a joyful, cozy
harvest-festival still-life moment, fully decorated and glowing, ready for
the celebration. The harvest setting carries the whole scene, rendered with
rich loving detail, never plain or empty.${animal ? ' Any animal present reads as a real, naturally distinct creature with open air around it; any small insect, bird, or floating detail (petals, dust motes, fireflies) stays simple and unposed, with no invented face or cartoon expression.' : ''}`
} no text, no words, no watermarks, gallery quality`;
};
