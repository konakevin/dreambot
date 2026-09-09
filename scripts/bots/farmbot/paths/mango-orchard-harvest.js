/**
 * FarmBot — mango-orchard-harvest (Phase 4: Tropical Farm, 2026-09-09).
 *
 * Section 16 example archetype. Place-led (the mango orchard is the hero,
 * always named first — per the ⭐ CROSS-CUTTING lesson in
 * FARMBOT_PATH_BUILD_STATE.md: Sonnet's brief-writing call thins/drops
 * content appearing LATE in a dense brief, so the bespoke place block goes
 * first, ahead of even the character block). Uses the path-bespoke
 * MANGO_ORCHARD_PLACE pool (required directly from its JSON — NOT added to
 * pools.js, see gen-mango-orchard-place-pool.js) as the setting anchor, same
 * pattern as orchard-afternoon.js uses ORCHARD_AFTERNOON_PLACE.
 *
 * Tropical differentiation from orchard-afternoon (temperate apple/pear/
 * peach): the bespoke pool bakes in mango-specific botany (broad
 * dome/umbrella evergreen canopy, long glossy elliptical leaves, fruit
 * dangling in clusters from long drooping stalks) and a mango-specific
 * harvest tool (a bamboo picking pole with a net catcher bag) alongside the
 * shared ladder/basket/wheelbarrow imagery. Kevin's constraint: this must
 * read as a small, hand-tended, cultivated farm orchard — never a wild
 * jungle — so the pool's own meta-prompt strictly bans jungle/rainforest/
 * wild/untamed language; this path file adds no season/weather pick that
 * could dilute that (see below).
 *
 * SEASON skipped entirely (Kevin's tropical-path directive — the temperate
 * 4-season framing doesn't fit a tropical climate). WEATHER_ATMOSPHERE is
 * ALSO skipped here (a step further than orchard-afternoon, which does pick
 * it) — the bespoke MANGO_ORCHARD_PLACE pool already carries its own
 * warm/humid tropical light directly in every entry, and
 * farmbot_weather_atmosphere.json's entries lean on temperate-specific
 * imagery (rose petals, clover, cottage windows, meadows) that would be
 * setting-incompatible with a mango orchard — the same "tags describe
 * topic/mood, not physical-setting compatibility" trap documented for
 * village-street-wandering. Letting the place pool own the atmosphere
 * outright avoids that risk entirely.
 *
 * ACTIVITY: the shared pool has NO tropical/orchard-appropriate entries —
 * every chore+farm entry is temperate-domestic (laundry, pony grooming,
 * chickens, bird feeder) and one (picking strawberries "among the
 * strawberry plants") is directly setting-incompatible with a mango
 * orchard. Built a small path-local MANGO_HARVEST_ACTIVITY array instead
 * (mirrors the "build a path-local activity array" fallback called out for
 * this path).
 *
 * CAMERA_COMPOSITION manually filtered — excludes farmhouse-window/
 * barn-doorway/cozy-interior/village-street/rooftops framings (indoor or
 * village-scene, incompatible with an outdoor mango orchard) and the two
 * "tiny character in a sweeping rolling landscape" entries (risk of the
 * orchard dissolving into a generic open-field vista, per the
 * woodland-walk "hero of the shot losing to a generic tableau" lesson).
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Path-bespoke pool — required directly, NOT added to pools.js (shared file,
// a concurrent agent is actively scaling it). See:
// scripts/gen-seeds/farmbot/gen-mango-orchard-place-pool.js
const MANGO_ORCHARD_PLACE = require('../seeds/farmbot_mango_orchard_place.json');

// Path-local activity pool (NOT a shared pools.js export — see header note).
// Mango-harvest-specific human actions, phrased with an implied subject,
// only used when a character is present.
const MANGO_HARVEST_ACTIVITY = [
  'Reaching up on tiptoe to cup a ripe mango in one palm, giving its stem a gentle twist before it drops soft into a waiting basket.',
  'Guiding a long bamboo picking pole up into the canopy, easing its net catcher around a heavy mango and lowering it down slow and steady.',
  'Balancing partway up a wooden ladder propped against the trunk, one arm braced on a branch while the other draws a cluster of mangoes carefully closer.',
  'Turning a just-picked mango over in both hands, giving it an unhurried, careful squeeze near the stem to check it is ready.',
  'Lowering a woven basket brimming with mangoes down from a ladder rung, easing it into open arms below before setting it in the grass.',
  'Sorting freshly picked mangoes into a low wooden crate, setting each one down by hand with the same unhurried care.',
  'Wiping a forearm across a warm brow in the humid shade, pausing beside a half-filled basket before reaching for the next low-hanging cluster.',
  'Carrying a full, heavy basket of mangoes balanced against one hip, walking the swept path back down the row toward the wheelbarrow.',
];

module.exports = ({ sharedDNA, picker }) => {
  // Kevin (2026-09-09): "sometimes no human" rule — a pure mango-orchard
  // still-life (fruit, ladder, picking pole, dappled light) is just as
  // on-brand as a person harvesting. ~65% chance of a character.
  const includeCharacter = Math.random() < 0.6;

  const place = picker.pickWithRecency(MANGO_ORCHARD_PLACE, 'mango_orchard_place');

  const character = includeCharacter
    ? pools.pickCharacter(picker, ['farm', 'leisure'], 'mango_orchard_character')
    : null;

  const activity = includeCharacter
    ? picker.pickWithRecency(MANGO_HARVEST_ACTIVITY, 'mango_orchard_activity')
    : null;

  const CAMERA_COMPOSITION_ORCHARD = pools.CAMERA_COMPOSITION.filter((e) => {
    const t = e.toLowerCase();
    return !(
      t.includes('farmhouse window') ||
      t.includes('barn doorway') ||
      t.includes('village') ||
      t.includes('rooftops') ||
      t.includes('interior') ||
      t.includes('rolling') ||
      // "character tiny/dwarfed in a sweeping open landscape" framings risk
      // the woodland-walk failure mode — the bespoke orchard rows dissolving
      // into a generic open-field vista with a barely-visible speck of a
      // character, per FARMBOT_PATH_BUILD_STATE.md's "hero of the shot"
      // lesson. Excluded proactively rather than waiting for a bad render.
      t.includes('tiny') ||
      t.includes('dwarfed') ||
      t.includes('sky dominating')
    );
  });
  const camera = picker.pickWithRecency(CAMERA_COMPOSITION_ORCHARD, 'mango_orchard_camera');

  const animalChance = includeCharacter ? 0.45 : 0.8;
  const animalPool = pools.byTags(pools.ANIMAL_COMPANIONS, ['low', 'medium']);
  const animal = includeCharacter
    ? Math.random() < animalChance
      ? picker.pickWithRecency(animalPool, 'mango_orchard_animal')
      : null
    : pools.pickPureSceneLife(picker, {
        animalPool,
        animalChance,
        ambientTags: ['outdoor'],
        axisPrefix: 'mango_orchard',
      });
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'mango_orchard_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE MANGO ORCHARD (the hero of the shot) ━━━
${place}
This is a small, lovingly hand-tended tropical farm orchard — neat, evenly
spaced rows cared for by a family or small crew — never a wild jungle or
untamed wilderness.
${character ? `\n━━━ THE CHARACTER ━━━\n${character}\n` : ''}
${activity ? `━━━ WHAT'S HAPPENING ━━━\n${activity}\n\n` : ''}━━━ CAMERA ━━━
${camera}
${animal ? `\n━━━ ANIMAL COMPANY ━━━\n${animal}\n` : ''}
${magic ? `━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  character
    ? `render a warm, unhurried tropical mango-harvest moment — the orchard, the
character, and every cluster of just-picked mangoes rendered with equal
loving richness, never a bare or empty composition. Every face in the
frame, human and animal alike, stays clearly separate and fully legible.`
    : `no human figure anywhere in the frame — this is a warm, unhurried
tropical mango-orchard still-life moment carried entirely by the trees, the
ladder, the picking pole, the baskets of just-picked fruit, and whatever
wildlife shares it, every detail rendered with equal loving richness, never
a bare or empty composition.${animal ? ' Any animal present reads as a real, naturally distinct creature with open air around it; any small insect, bird, or floating detail (petals, dust motes, fireflies) stays simple and unposed, with no invented face or cartoon expression.' : ''}`
} no text, no words, no watermarks, gallery quality`;
};
