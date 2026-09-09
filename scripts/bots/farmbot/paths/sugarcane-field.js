/**
 * FarmBot — sugarcane-field (Phase 4: Tropical Farm, 2026-09-09).
 *
 * Section 16 example archetype, tropical variant. Place-led (the sugarcane
 * field is the hero, always named first — put FIRST in the template per the
 * ⭐ CROSS-CUTTING maxTokens lesson in FARMBOT_PATH_BUILD_STATE.md: Sonnet's
 * brief-writing call uses a fixed maxTokens and drops/thins content late in
 * a dense brief). Uses the path-bespoke SUGARCANE_FIELD_PLACE pool (required
 * directly from its JSON — NOT added to pools.js, see
 * gen-sugarcane-field-place-pool.js) as the setting anchor, same pattern as
 * pineapple-field-afternoon.js/mango-orchard-harvest.js/banana-grove-path.js.
 *
 * CRITICAL CREATIVE CONSTRAINT (Kevin, verbatim): this must still feel like
 * a charming FARM, just tropical — a small, cultivated, row-planted field a
 * family or small crew tends by hand. NOT an industrial plantation, NOT
 * gritty/realistic agriculture, NOT a wild jungle. The bespoke pool already
 * bakes this in hard (see its gen script — it explicitly bans industrial/
 * plantation-labor-camp framing alongside the usual jungle/wild bans, since
 * sugarcane carries those real-world associations more than any other Phase
 * 4 crop); the closing description below reinforces cheerful, hand-tended
 * order once more, positively (never by naming "industrial" to negate it).
 *
 * SPECIAL SCALE RISK FOR THIS PATH: sugarcane grows tall — well above head
 * height — which makes "character dwarfed by towering rows" a live, easy
 * trap here specifically (more than the low pineapple field or the
 * broad-canopy orchards). The bespoke place pool keeps its own language
 * grounded (tall/upright, never "towering"/"looming"/dwarfing-scale), and
 * this path adds an explicit positive scale/proximity sentence (below, both
 * branches) so a character reads as a figure IN the field among approachable
 * rows within easy reach, never a tiny speck lost beneath an overwhelming
 * canopy — same fix woodland-walk.js and the other tropical paths already
 * apply for their own bespoke hero settings.
 *
 * Per Kevin's Phase 4 direction: SKIPS the shared SEASON pool entirely (a
 * tropical climate doesn't fit FarmBot's 4-season framework) AND skips the
 * shared WEATHER_ATMOSPHERE pool too (its entries are temperate-seasonal —
 * spring drizzle, autumn haze, winter snow — any of which would contradict
 * a tropical field, and several of its "meadow"/"hedgerow" props are also a
 * physical-setting mismatch). The bespoke place pool carries its own
 * warm/humid tropical atmosphere directly in every entry instead, same as
 * pineapple-field-afternoon.js and mango-orchard-harvest.js.
 *
 * ACTIVITY has no tropical/cane-appropriate chore+farm entries (checked
 * directly against farmbot_activity.json — its farm/chore entries are
 * laundry, pony grooming, chickens, bird feeder, strawberries; nothing
 * sugarcane-flavored), so this path uses its own small path-local
 * CANE_ACTIVITY set, same pattern as pineapple's HARVEST_ANCHOR and mango's
 * MANGO_HARVEST_ACTIVITY. Every entry describes the ACTION (cutting,
 * bundling, hauling cane) rather than labeling the character with an
 * occupational title — deliberately avoiding any "cane cutter"-shaped noun
 * phrase placed directly in front of a person-noun, the same trap family as
 * the documented "horse keeper" bug (an animal/crop name compounded directly
 * against a person-noun can get read by Flux as describing the character's
 * own body rather than their occupation).
 *
 * CHARACTER_ARCHETYPE has no dedicated tropical archetype — per the Phase 4
 * coordination note, this path reuses existing farm/leisure archetypes only
 * via pools.pickCharacter(), same as every other tropical path.
 *
 * ANIMAL_COMPANIONS and CAMERA_COMPOSITION are manually filtered (not
 * byTags) to drop entries with a physical-setting mismatch for a tall-row
 * cultivated field — cottage/farmhouse/windowsill/mudroom animal settings,
 * and farmhouse-window/barn-doorway/cozy-interior/village-street/rooftops/
 * hedgerow/cottage camera framings, PLUS every "tiny/dwarfed/small within/
 * sweeping/rolling/sky dominating" scale-dissolving camera entry — this is
 * an especially live risk here (see SPECIAL SCALE RISK note above), so the
 * filter below is deliberately broader than a single keyword, per the
 * CAMERA_COMPOSITION re-pollution lesson (a pool scale-up can reintroduce
 * dwarfing language under new phrasings beyond just "rolling").
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Path-bespoke pool — required directly, NOT added to pools.js (shared file,
// other agents may be editing it concurrently). See:
// scripts/gen-seeds/farmbot/gen-sugarcane-field-place-pool.js
const SUGARCANE_FIELD_PLACE = require('../seeds/farmbot_sugarcane_field_place.json');

// Small path-local anchor set (not a shared pool — no other path needs
// sugarcane-harvest actions), same pattern as sibling tropical paths' own
// activity arrays. Verb-led throughout — deliberately never labels the
// character with a "cane cutter"-style occupational noun phrase (the
// "horse keeper" trap family: an animal/crop name compounded directly
// against a person-noun risks Flux reading it as the character's own
// anatomy rather than their job).
const CANE_ACTIVITY = [
  'Swinging a curved cane knife in one smooth stroke to sever a stalk low at its base, then leaning it carefully against a growing bundle.',
  'Gathering a bundle of freshly cut cane lengths into both arms, carrying them steadily toward the waiting cart.',
  'Kneeling beside the cart to stack freshly cut cane in neat, even layers, lining up each pale cut end.',
  'Pushing a loaded wheelbarrow of cut cane along the well-worn dirt path, both hands steady on the worn wooden handles.',
  'Reaching up to part a few tall leaves aside, checking a cluster of stalks for the ripest ones to cut next.',
  'Tying off a bundle of cut cane with a length of twine, cinching it snug with a practiced double loop.',
  'Turning the hand crank of the roadside juice press in slow, steady strokes, feeding a length of cane through it.',
  'Wiping a forearm across a warm brow in the humid shade between two rows, pausing beside a half-loaded basket before reaching for the next stalk.',
];

module.exports = ({ sharedDNA, picker }) => {
  // Kevin (2026-09-09): "sometimes no human" rule — a pure sugarcane-field
  // still-life (rows, cart, basket, roadside stand) is just as on-brand as a
  // person tending it. ~65% chance of a character.
  const includeCharacter = Math.random() < 0.6;

  const field = picker.pickWithRecency(SUGARCANE_FIELD_PLACE, 'sugarcane_field_place');

  const character = includeCharacter
    ? pools.pickCharacter(picker, ['farm', 'leisure'], 'sugarcane_field_character')
    : null;

  // Only meaningful when a character is present — see CANE_ACTIVITY note
  // above for why this is a path-local set rather than the shared ACTIVITY
  // pool.
  const activity = includeCharacter
    ? picker.pickWithRecency(CANE_ACTIVITY, 'sugarcane_field_activity')
    : null;

  // Manual content filter (not byTags — CAMERA_COMPOSITION is untagged
  // anyway): drops indoor/village-scale framings that are a physical-setting
  // mismatch for a cultivated cane field, PLUS every scale-dissolving
  // "tiny/dwarfed/small within/sweeping/rolling/sky dominating" framing —
  // filtered broadly (not just one keyword) per the CAMERA_COMPOSITION
  // re-pollution lesson, and especially important here given this path's
  // own tall-crop dwarfing risk (see header).
  const CAMERA_INCOMPATIBLE =
    /\bbarn\b|\bfarmhouse\b|\bvillage\b|\brooftops?\b|\bcottages?\b|\bhedgerows?\b|\bcosy interior\b|\bcozy interior\b|\brolling\b|\bsweeping\b|\btiny\b|\bdwarf(ed|ing)?\b|\bsmall within\b|\bsky dominating\b/i;
  const camera = picker.pickWithRecency(
    pools.CAMERA_COMPOSITION.filter((e) => !CAMERA_INCOMPATIBLE.test(e)),
    'sugarcane_field_camera'
  );

  const animalChance = includeCharacter ? 0.4 : 0.75;
  const animalPool = pools.ANIMAL_COMPANIONS.filter(
    (e) =>
      (e.tags.includes('low') || e.tags.includes('medium')) &&
      !/cottage|farmhouse|windowsill|mudroom/i.test(e.description)
  ).map((e) => e.description);
  const animal = includeCharacter
    ? Math.random() < animalChance
      ? picker.pickWithRecency(animalPool, 'sugarcane_field_animal')
      : null
    : pools.pickPureSceneLife(picker, {
        animalPool,
        animalChance,
        ambientTags: ['outdoor'],
        axisPrefix: 'sugarcane_field',
      });
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'sugarcane_field_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE SUGARCANE FIELD (the hero of the shot) ━━━
${field}
This is a small, lovingly hand-tended tropical farm field — neat, evenly
spaced rows cared for by a family or small crew, cheerful and orderly
throughout — never an industrial plantation and never a wild, untamed space.
The cane grows tall and reaches well overhead, but anyone standing among the
rows stays close and approachable, right at hand among the nearest stalks
and leaves, a figure IN the field at a friendly human scale, never a distant
tiny speck beneath it.
${character ? `\n━━━ THE CHARACTER ━━━\n${character}\n` : ''}
${activity ? `━━━ WHAT'S HAPPENING ━━━\n${activity}\n\n` : ''}━━━ CAMERA ━━━
${camera}
${animal ? `\n━━━ ANIMAL COMPANY ━━━\n${animal}\n` : ''}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  character
    ? `render a warm, unhurried tropical-farm moment — the field, the character, and
every cane stalk and harvest prop rendered with equal loving richness, never
a bare or empty composition. The rows grow tall, but the character stands
right among them at a friendly, approachable scale, within easy reach of the
nearest stalks and leaves — a figure IN the field, not a distant tiny speck
beneath it. Every face in the frame, human and animal alike, stays clearly
separate and fully legible.`
    : `no human figure anywhere in the frame — this is a warm, unhurried
tropical-farm still-life moment carried entirely by the field's own tall
rows of cane, its dirt path, cart, baskets, and resting tools, and whatever
wildlife shares it, every detail rendered with equal loving richness, never
a bare or empty composition.${animal ? ' Any animal present reads as a real, naturally distinct creature with open air around it; any small insect, bird, or floating detail (petals, dust motes, fireflies) stays simple and unposed, with no invented face or cartoon expression.' : ''}`
} no text, no words, no watermarks, gallery quality`;
};
