/**
 * FarmBot — pineapple-field-afternoon (Phase 4: Tropical Farm, 2026-09-09).
 *
 * Section 16 example archetype, tropical variant. Place-led (the pineapple
 * field is the hero, always named first — put FIRST in the template per the
 * ⭐ CROSS-CUTTING maxTokens lesson in FARMBOT_PATH_BUILD_STATE.md: Sonnet's
 * brief-writing call uses a fixed maxTokens and drops/thins content late in
 * a dense brief). Uses the path-bespoke PINEAPPLE_FIELD_PLACE pool (required
 * directly from its JSON — NOT added to pools.js, see
 * gen-pineapple-field-place-pool.js) as the setting anchor, same pattern as
 * orchard-afternoon.js uses ORCHARD_AFTERNOON_PLACE.
 *
 * CRITICAL CREATIVE CONSTRAINT (Kevin, verbatim): this must still feel like
 * a charming FARM, just tropical — a small, cultivated, row-planted field a
 * family or small crew tends by hand. NOT a wild jungle, NOT rainforest-
 * exploration. The bespoke pool itself already bakes this in hard (see its
 * gen script), and the closing description below reinforces it once more.
 *
 * Per Kevin's Phase 4 direction: SKIPS the shared SEASON pool entirely (a
 * tropical climate doesn't fit FarmBot's 4-season framework) AND skips the
 * shared WEATHER_ATMOSPHERE pool (its entries are temperate-seasonal —
 * spring drizzle, autumn haze, winter snow — any of which would contradict
 * a tropical field). The bespoke place pool carries its own warm/humid
 * tropical-afternoon atmosphere directly in every entry instead, the same
 * "don't duplicate an axis another pool already owns" principle
 * orchard-afternoon.js documents for its own golden-afternoon light.
 *
 * ACTIVITY has no tropical-appropriate chore+farm entries (checked directly
 * against farmbot_activity.json — its farm/chore entries are strawberries,
 * ponies, chickens, eggs, laundry; nothing pineapple/tropical-harvest
 * flavored), so this path uses its own small path-local HARVEST_ANCHOR set,
 * same pattern as spring-planting-day.js's PLANTING_ANCHOR.
 *
 * CHARACTER_ARCHETYPE has no dedicated tropical archetype — per the Phase 4
 * coordination note (a concurrent agent is scaling shared pools right now),
 * this path reuses existing farm/leisure archetypes only via
 * pools.pickCharacter(), same as every other path.
 *
 * ANIMAL_COMPANIONS and CAMERA_COMPOSITION are manually filtered (not
 * byTags) to drop entries with a physical-setting mismatch for an open
 * tropical field — cottage/farmhouse/windowsill/mudroom animal settings, and
 * farmhouse-window/barn-doorway/cozy-interior/village-street/village-rooftop
 * camera framings, plus the two "character tiny within a sweeping rolling
 * landscape" camera entries (the woodland-walk lesson: this phrasing risks
 * dissolving a bespoke hero setting into a generic open landscape, which
 * here would also risk reading as more "wild" than "cultivated field").
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Path-bespoke pool — required directly, NOT added to pools.js (shared file,
// a concurrent agent is scaling other shared pools right now). See:
// scripts/gen-seeds/farmbot/gen-pineapple-field-place-pool.js
const PINEAPPLE_FIELD_PLACE = require('../seeds/farmbot_pineapple_field_place.json');

// Small path-local anchor set (not a shared pool — no other path needs
// this) so a with-character render is always unmistakably a HARVEST scene,
// same pattern as spring-planting-day.js's PLANTING_ANCHOR. The shared
// ACTIVITY pool has no pineapple/tropical-harvest entry to draw from.
const HARVEST_ANCHOR = [
  'Reaching carefully between the spiky leaves to twist a ripe golden pineapple free of its crown, setting it gently into a woven harvest basket.',
  'Kneeling beside a low row to lift a heavy ripe pineapple with both hands, easing it free before laying it down among others in a half-full woven basket.',
  'Carrying a full woven harvest basket down the row with both arms, pausing to inspect one more golden-amber fruit still on its plant.',
  'Crouching low between two rows, turning a ripe pineapple gently to check its color before cutting it free and adding it to the basket at hand.',
];

module.exports = ({ sharedDNA, picker }) => {
  // Kevin (2026-09-09): "sometimes no human" rule — a pure pineapple-field
  // still-life (rows, ripe fruit, basket, sun hat) is just as on-brand as a
  // person harvesting. ~65% chance of a character.
  const includeCharacter = Math.random() < 0.6;

  const field = picker.pickWithRecency(PINEAPPLE_FIELD_PLACE, 'pineapple_field_place');

  const character = includeCharacter
    ? pools.pickCharacter(picker, ['farm', 'leisure'], 'pineapple_field_character')
    : null;

  // Only meaningful when a character is present — see HARVEST_ANCHOR note
  // above for why this is a path-local set rather than the shared ACTIVITY
  // pool.
  const activity = includeCharacter
    ? picker.pickWithRecency(HARVEST_ANCHOR, 'pineapple_field_activity')
    : null;

  // Manual content filter (not byTags — CAMERA_COMPOSITION is untagged
  // anyway): drops indoor/village-scale framings that are a physical-setting
  // mismatch for an open tropical field, PLUS the "character tiny/small/
  // dwarfed within a sweeping landscape" framing that risks dissolving the
  // bespoke hero setting into a generic open landscape (the woodland-walk
  // lesson) — which here would also read as more "wild" than "cultivated."
  const camera = picker.pickWithRecency(
    pools.CAMERA_COMPOSITION.filter(
      (e) =>
        !/village|rooftop|interior|farmhouse window|barn doorway/i.test(e) &&
        !/\b(character|figure)\b.{0,60}?\b(tiny|small|dwarfed)\b/i.test(e)
    ),
    'pineapple_field_camera'
  );

  const animalChance = includeCharacter ? 0.4 : 0.75;
  const animalPool = pools.ANIMAL_COMPANIONS.filter(
    (e) =>
      (e.tags.includes('low') || e.tags.includes('medium')) &&
      !/cottage|farmhouse|windowsill|mudroom/i.test(e.description)
  ).map((e) => e.description);
  const animal = includeCharacter
    ? Math.random() < animalChance
      ? picker.pickWithRecency(animalPool, 'pineapple_field_animal')
      : null
    : pools.pickPureSceneLife(picker, {
        animalPool,
        animalChance,
        ambientTags: ['outdoor'],
        axisPrefix: 'pineapple_field',
      });
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'pineapple_field_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE PINEAPPLE FIELD (the hero of the shot) ━━━
${field}
${character ? `\n━━━ THE CHARACTER ━━━\n${character}\n` : ''}
${activity ? `━━━ WHAT'S HAPPENING ━━━\n${activity}\n\n` : ''}━━━ CAMERA ━━━
${camera}
${animal ? `\n━━━ ANIMAL COMPANY ━━━\n${animal}\n` : ''}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  character
    ? `render a warm, unhurried tropical harvest-afternoon moment — this is a
small, cultivated, hand-tended pineapple farm field, NOT a wild jungle or
rainforest, with the field, the character, and every ripe pineapple rendered
with equal loving richness, never a bare or empty composition. Every face in
the frame, human and animal alike, stays clearly separate and fully
legible.`
    : `no human figure anywhere in the frame — this is a warm, unhurried
tropical harvest-afternoon still-life moment carried entirely by the neat
rows of a small, cultivated, hand-tended pineapple field (NOT a wild jungle
or rainforest) and whatever wildlife shares it, every ripe pineapple
rendered with equal loving richness, never a bare or empty composition.${animal ? ' Any animal present reads as a real, naturally distinct creature with open air around it; any small insect, bird, or floating detail (petals, dust motes, fireflies) stays simple and unposed, with no invented face or cartoon expression.' : ''}`
} no text, no words, no watermarks, gallery quality`;
};
