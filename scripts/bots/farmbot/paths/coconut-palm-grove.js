/**
 * FarmBot — coconut-palm-grove (Phase 4: Tropical Farm, 2026-09-09).
 *
 * Section 16 example archetype, tropical variant. Place-led (the coconut
 * palm grove is the hero, always named first — per the ⭐ CROSS-CUTTING
 * maxTokens lesson in FARMBOT_PATH_BUILD_STATE.md: Sonnet's brief-writing
 * call uses a fixed maxTokens and drops/thins content late in a dense brief,
 * so the bespoke place block goes first, ahead of even the character block).
 * Uses the path-bespoke COCONUT_PALM_GROVE_PLACE pool (required directly
 * from its JSON — NOT added to pools.js, see
 * gen-coconut-palm-grove-place-pool.js) as the setting anchor, same pattern
 * as pineapple-field-afternoon.js / mango-orchard-harvest.js / banana-grove-path.js.
 *
 * CRITICAL CREATIVE CONSTRAINT (Kevin, verbatim, Phase 4 kickoff): "the
 * important thing is that it still feels like a charming FARM since this is
 * FarmBot, just a tropical farm." This is a small, cultivated, neat-rowed
 * coconut palm grove a family or small crew tends by hand — NOT a wild
 * jungle, NOT a rainforest, NOT a desert-island survival scene. The bespoke
 * pool's own generator already bans jungle/wild/untamed/overgrown/desert-
 * island/survival vocabulary at the source; this path's own closing
 * description reinforces the same cultivated/tended framing positively
 * (never by naming "jungle"/"wild" to negate it — Flux doesn't process
 * negation, CLAUDE.md). Farm-appropriate touches (woven hammock,
 * wheelbarrow, husked coconuts in baskets, a machete/harvest tool resting
 * on a fence, a rustic ladder) are baked into the bespoke place pool itself.
 *
 * SKIPS the shared SEASON pool entirely (Phase 4 instruction — a tropical
 * climate doesn't fit FarmBot's 4-season framework) AND skips the shared
 * WEATHER_ATMOSPHERE pool too (same as pineapple-field-afternoon.js and
 * mango-orchard-harvest.js — its entries are temperate-seasonal and would be
 * setting-incompatible; the bespoke place pool already carries its own
 * warm/humid tropical atmosphere directly in every entry).
 *
 * ACTIVITY has no coconut-grove-appropriate chore+farm entries (checked
 * directly against farmbot_activity.json — its farm/chore entries are
 * strawberries, ponies, chickens, eggs, laundry; nothing coconut/tropical-
 * harvest flavored), so this path uses its own small path-local
 * COCONUT_GROVE_ACTIVITIES set, same pattern as pineapple-field-afternoon.js's
 * HARVEST_ANCHOR and mango-orchard-harvest.js's MANGO_HARVEST_ACTIVITY.
 *
 * CHARACTER_ARCHETYPE has no dedicated tropical archetype — per the Phase 4
 * coordination note, this path reuses existing farm/leisure archetypes only
 * via pools.pickCharacter().
 *
 * ANIMAL_COMPANIONS and CAMERA_COMPOSITION are manually filtered (not
 * byTags) to drop entries with a physical-setting mismatch for an open
 * tropical grove — cottage/farmhouse/windowsill/mudroom animal settings, and
 * farmhouse/barn/village/cottage/hedgerow/cozy-interior camera framings,
 * plus the "character tiny/dwarfed/sky-dominating/sweeping in a landscape"
 * camera entries (the woodland-walk + mango-orchard-harvest lesson: this
 * pool was recently scaled 20→120 and reintroduced dwarfing-language under
 * new phrasings beyond just "rolling" — filtered broadly here on all of
 * tiny/dwarfed/sky dominating/sweeping, not just one keyword).
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Path-bespoke pool — required directly, NOT added to pools.js (shared file,
// other agents may be editing it concurrently). See:
// scripts/gen-seeds/farmbot/gen-coconut-palm-grove-place-pool.js
const COCONUT_PALM_GROVE_PLACE = require('../seeds/farmbot_coconut_palm_grove_place.json');

// Small path-local anchor set (not a shared pool — no other path needs
// genuine coconut-grove-tending actions) since the shared ACTIVITY pool has
// no content that fits harvesting/tending a coconut grove. Every entry
// reinforces the cultivated, hand-tended, small-scale farm energy (never a
// wild-exploration pose) and doubles down on the hero pool's own
// hammock/wheelbarrow/machete/ladder/basket props.
const COCONUT_GROVE_ACTIVITIES = [
  'Steadying a rustic wooden ladder propped against a trunk, reaching up to twist a ripe coconut free from its cluster and lower it down slow and careful.',
  'Kneeling beside a woven basket to stack freshly husked coconuts one by one, setting each down with the same unhurried care.',
  'Drawing a long-handled harvest knife in a practiced motion to husk a coconut, its fibrous strips falling loose beside a growing pile.',
  'Pushing a loaded wheelbarrow of husked coconuts along the worked-soil path, both hands steady on the worn wooden handles.',
  'Resting easy in a woven rope hammock strung between two trunks, one arm trailing lazily as dappled light shifts across the ground below.',
  'Carrying a full woven basket of coconuts balanced against one hip, stepping carefully along the swept path between the rows.',
  'Coiling a spare length of rope beside the hammock posts, glancing up to gauge a heavy cluster of coconuts still ripening overhead.',
  'Wiping a forearm across a warm brow in the humid shade, pausing beside a half-filled basket before reaching for the next low cluster.',
];

module.exports = ({ sharedDNA, picker }) => {
  // Kevin (2026-09-09): "sometimes no human" rule — a pure coconut-grove
  // still-life (rows, hammock, baskets, resting tools) is just as on-brand
  // as a person tending it. ~65% chance of a character.
  const includeCharacter = Math.random() < 0.6;

  const grove = picker.pickWithRecency(COCONUT_PALM_GROVE_PLACE, 'coconut_grove_place');

  const character = includeCharacter
    ? pools.pickCharacter(picker, ['farm', 'leisure'], 'coconut_grove_character')
    : null;

  // Only meaningful when a character is present — see COCONUT_GROVE_ACTIVITIES
  // note above for why this is a path-local set rather than the shared
  // ACTIVITY pool.
  const activity = includeCharacter
    ? picker.pickWithRecency(COCONUT_GROVE_ACTIVITIES, 'coconut_grove_activity')
    : null;

  // Manual content filter (not byTags — CAMERA_COMPOSITION is untagged
  // anyway): drops indoor/village-scale framings that are a physical-setting
  // mismatch for an open tropical grove, PLUS every phrasing of "character
  // tiny/dwarfed/sky-dominating/sweeping within a landscape" — this pool was
  // recently scaled 20→120 and reintroduced dwarfing-language under NEW
  // wording beyond just "rolling" (mango-orchard-harvest's documented
  // re-pollution lesson), so filter broadly, not on one keyword.
  const camera = picker.pickWithRecency(
    pools.CAMERA_COMPOSITION.filter((e) => {
      const t = e.toLowerCase();
      return !(
        t.includes('farmhouse') ||
        t.includes('barn') ||
        t.includes('village') ||
        t.includes('rooftops') ||
        t.includes('cottage') ||
        t.includes('hedgerow') ||
        t.includes('cozy interior') ||
        t.includes('cosy interior') ||
        t.includes('interior') ||
        t.includes('rolling') ||
        t.includes('tiny') ||
        t.includes('dwarfed') ||
        t.includes('sky dominating') ||
        t.includes('sweeping')
      );
    }),
    'coconut_grove_camera'
  );

  const animalChance = includeCharacter ? 0.4 : 0.75;
  const animalPool = pools.ANIMAL_COMPANIONS.filter(
    (e) =>
      (e.tags.includes('low') || e.tags.includes('medium')) &&
      !/cottage|farmhouse|windowsill|mudroom/i.test(e.description)
  ).map((e) => e.description);
  const animal = includeCharacter
    ? Math.random() < animalChance
      ? picker.pickWithRecency(animalPool, 'coconut_grove_animal')
      : null
    : pools.pickPureSceneLife(picker, {
        animalPool,
        animalChance,
        ambientTags: ['outdoor'],
        axisPrefix: 'coconut_grove',
      });
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'coconut_grove_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE COCONUT PALM GROVE (the hero of the shot) ━━━
${grove}
This is a small, lovingly hand-tended tropical farm plot — neat rows cared
for by a family or small crew, never a wild jungle, a rainforest, or a
desert-island survival scene.
${character ? `\n━━━ THE CHARACTER ━━━\n${character}\n` : ''}
${activity ? `━━━ WHAT'S HAPPENING ━━━\n${activity}\n\n` : ''}━━━ CAMERA ━━━
${camera}
${animal ? `\n━━━ ANIMAL COMPANY ━━━\n${animal}\n` : ''}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  character
    ? `render a warm, unhurried tropical-farm moment — the grove, the character,
and every prop of the harvest (hammock, wheelbarrow, baskets of coconuts,
resting tools) rendered with equal loving richness, never a bare or empty
composition. The character works or rests right among the rows, within easy
reach of the nearest trunks — a figure IN the grove, not a distant tiny
speck beyond it. Every face in the frame, human and animal alike, stays
clearly separate and fully legible.`
    : `no human figure anywhere in the frame — this is a warm, unhurried
tropical-farm still-life moment carried entirely by the grove's own rows of
palms, hanging clusters of coconuts, and the hammock, wheelbarrow, baskets,
and resting tools scattered among them, and whatever wildlife shares it,
every detail rendered with equal loving richness, never a bare or empty
composition.${animal ? ' Any animal present reads as a real, naturally distinct creature with open air around it; any small insect, bird, or floating detail (petals, dust motes, fireflies) stays simple and unposed, with no invented face or cartoon expression.' : ''}`
} no text, no words, no watermarks, gallery quality`;
};
