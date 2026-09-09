/**
 * FarmBot — orchard-afternoon (Phase 2, 2026-09-09).
 *
 * Section 16 example archetype. Place-led (the fruit orchard is the hero,
 * always named first) — season implied by the path name (golden afternoon
 * fruit-picking light) but not hard-locked to a SEASON pool pick, since the
 * bespoke ORCHARD_AFTERNOON_PLACE pool already carries the time-of-day/light
 * itself; a SEASON pick would risk contradicting it (see the look-register
 * hue-lock lesson in FARMBOT_PATH_BUILD_STATE.md — don't duplicate an axis
 * another pool already owns). Uses the path-bespoke ORCHARD_AFTERNOON_PLACE
 * pool (required directly from its JSON — NOT added to pools.js, see
 * gen-orchard-afternoon-place-pool.js) as the setting anchor, same pattern
 * as summer-evening-by-the-pond.js uses POND_PLACE and harvest-festival.js
 * uses HARVEST_FESTIVAL_PLACE.
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Path-bespoke pool — required directly, NOT added to pools.js (shared file,
// other agents may be editing it concurrently). See:
// scripts/gen-seeds/farmbot/gen-orchard-afternoon-place-pool.js
const ORCHARD_AFTERNOON_PLACE = require('../seeds/farmbot_orchard_afternoon_place.json');

module.exports = ({ sharedDNA, picker }) => {
  // Kevin (2026-09-09): "sometimes no human" rule — a pure orchard still-life
  // (fruit, ladders, baskets, dappled light) is just as on-brand as a person
  // fruit-picking. ~65% chance of a character.
  const includeCharacter = Math.random() < 0.6;

  const character = includeCharacter
    ? pools.pickCharacter(picker, ['farm', 'leisure'], 'orchard_afternoon_character')
    : null;

  const place = picker.pickWithRecency(ORCHARD_AFTERNOON_PLACE, 'orchard_afternoon_place');

  // ACTIVITY entries are phrased as human actions with an implied subject —
  // only meaningful when a character is present. NOTE: manual filter, not
  // byTags — byTags(ACTIVITY, ['chore','farm','leisure']) leaks the 18
  // ['chore','bakery']-tagged dough-kneading/baking entries in, because
  // 'chore' itself is a shared tag between farm-chore and bakery-chore
  // entries (round 1 QA caught a "kneading bread dough in the orchard"
  // render this way — see FARMBOT_PATH_BUILD_STATE.md). Filter to entries
  // tagged 'farm' or 'leisure' only, which naturally excludes every
  // bakery-only entry.
  const activity = includeCharacter
    ? picker.pickWithRecency(
        pools.ACTIVITY.filter((e) => e.tags.includes('farm') || e.tags.includes('leisure')).map((e) => e.description),
        'orchard_afternoon_activity'
      )
    : null;

  // Excludes spring (blossom season, not ripe-fruit season) and winter
  // (snow) — both would contradict the bespoke place pool's ripe fruit
  // hanging on the trees. summer/autumn cover real fruit-picking season.
  const weather = picker.pickWithRecency(
    pools.byTags(pools.WEATHER_ATMOSPHERE, ['summer', 'autumn', 'ANY']),
    'orchard_afternoon_weather'
  );
  const camera = picker.pickWithRecency(pools.CAMERA_COMPOSITION, 'orchard_afternoon_camera');

  const animalChance = includeCharacter ? 0.45 : 0.8;
  const animalPool = pools.byTags(pools.ANIMAL_COMPANIONS, ['low', 'medium']);
  const animal = includeCharacter
    ? Math.random() < animalChance
      ? picker.pickWithRecency(animalPool, 'orchard_afternoon_animal')
      : null
    : pools.pickPureSceneLife(picker, {
        animalPool,
        animalChance,
        ambientTags: ['outdoor'],
        axisPrefix: 'orchard_afternoon',
      });
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'orchard_afternoon_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE ORCHARD (the hero of the shot) ━━━
${place}
${character ? `\n━━━ THE CHARACTER ━━━\n${character}\n` : ''}
${activity ? `━━━ WHAT'S HAPPENING ━━━\n${activity}\n\n` : ''}━━━ ATMOSPHERE ━━━
${weather}
${animal ? `\n━━━ ANIMAL COMPANY ━━━\n${animal}\n` : ''}
━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  character
    ? `render a warm, unhurried golden-afternoon orchard moment — the orchard,
the character, and every piece of just-picked fruit rendered with equal
loving richness, never a bare or empty composition. Every face in the
frame, human and animal alike, stays clearly separate and fully legible.`
    : `no human figure anywhere in the frame — this is a warm, unhurried
golden-afternoon orchard still-life moment carried entirely by the fruit
trees, the ladders, the baskets of just-picked fruit, and whatever wildlife
shares it, every detail rendered with equal loving richness, never a bare
or empty composition.${animal ? ' Any animal present reads as a real, naturally distinct creature with open air around it; any small insect, bird, or floating detail (petals, dust motes, fireflies) stays simple and unposed, with no invented face or cartoon expression.' : ''}`
} no text, no words, no watermarks, gallery quality`;
};
