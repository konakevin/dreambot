/**
 * FarmBot — banana-grove-path (Phase 4: Tropical Farm, 2026-09-09).
 *
 * Section 16 example archetype. Place-led (the small, tended banana grove
 * is the hero, always named first) — huge distinctive paddle-shaped leaves,
 * dappled tropical light filtering through the canopy, hanging bunches of
 * bananas ready for harvest, a wheelbarrow or harvest basket, a worn dirt
 * path winding through. Uses the path-bespoke BANANA_GROVE_PLACE pool
 * (required directly from its JSON — NOT added to pools.js, see
 * gen-banana-grove-place-pool.js) as the setting anchor, same pattern as
 * orchard-afternoon.js uses ORCHARD_AFTERNOON_PLACE and woodland-walk.js
 * uses WOODLAND_WALK_PLACE.
 *
 * CRITICAL CREATIVE CONSTRAINT (Kevin, verbatim, FARMBOT_PATH_BUILD_STATE.md
 * Phase 4): "the important thing is that it still feels like a charming
 * FARM since this is FarmBot, just a tropical farm." This is a small,
 * cultivated, hand-tended plot a family or small crew works by hand — never
 * a wild jungle or rainforest-exploration scene. The bespoke place pool's
 * own generator already bans jungle/wild/untamed/overgrown vocabulary at
 * the source (see gen-banana-grove-place-pool.js); this path's own closing
 * description reinforces the same cultivated/tended framing positively
 * (never by naming "jungle" to negate it — Flux doesn't process negation,
 * CLAUDE.md).
 *
 * No SEASON pull (Phase 4 instruction, FARMBOT_PATH_BUILD_STATE.md) — a
 * tropical climate doesn't fit FarmBot's 4-season framework; the bespoke
 * place pool already carries its own warm/humid tropical atmosphere
 * directly. WEATHER_ATMOSPHERE IS pulled, but filtered to 'summer'/'ANY'
 * tags only (byTags always lets 'ANY' through regardless of requested
 * tags) — spring/autumn/winter entries would contradict a tropical grove
 * with blossom/foliage-color/snow language.
 *
 * No shared ACTIVITY reuse — checked pools.js directly (see
 * FARMBOT_PATH_BUILD_STATE.md's "tags describe topic, not physical-setting
 * compatibility" gotcha): the farm/leisure-tagged entries are all
 * temperate-farmyard-specific (hanging laundry, brushing a pony, scattering
 * chicken feed, sitting by a stream, a picnic blanket) with nothing about
 * harvesting fruit from trees. BANANA_GROVE_ACTIVITIES below is a small
 * path-local (not pool-file) set of genuine grove-tending actions instead —
 * same pattern as fishing-dock.js's FISHING_DOCK_ACTIVITIES and
 * flower-shop.js's FLOWER_SHOP_ACTIVITIES.
 *
 * CAMERA_COMPOSITION IS filtered — same reasoning as fishing-dock.js: this
 * untagged "applies universally" pool has many entries that assume a
 * physical setting a tropical grove doesn't have (farmhouse window, barn
 * doorway, village street/rooftops, cottages/hedgerows, a cozy interior) or
 * that risk the woodland-walk "hero dissolves into a generic wide-open
 * landscape" bug (character/figure rendered "tiny within" or "dwarfed by"
 * sweeping rolling fields/hills — the grove is a close, canopied place, not
 * an open vista). Filtered out below.
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Path-bespoke pool — required directly, NOT added to pools.js (shared
// file, other agents may be editing it concurrently). See:
// scripts/gen-seeds/farmbot/gen-banana-grove-place-pool.js
const BANANA_GROVE_PLACE = require('../seeds/farmbot_banana_grove_place.json');

// CAMERA_COMPOSITION entries that assume a physical setting incompatible
// with a small, canopied banana grove (farmhouse window, barn doorway,
// village street/rooftops, cottages, hedgerows, a cozy interior) or that
// risk dissolving the grove into a generic open landscape ("tiny within" /
// "dwarfed by" sweeping rolling fields/hills — see woodland-walk's
// documented scale/dissolution bug). See header.
const CAMERA_INCOMPATIBLE =
  /\bbarn\b|\bfarmhouse\b|\bvillage\b|\brooftops?\b|\bcottages?\b|\bhedgerows?\b|\bcosy interior\b|\bcozy interior\b|\brolling (fields?|hills?|landscape|scene)\b|\btiny (within|against)\b|\bdwarfed\b|\bsmall within\b|\bfigure small\b|\bcharacter small\b/i;
const BANANA_GROVE_CAMERA = pools.CAMERA_COMPOSITION.filter((c) => !CAMERA_INCOMPATIBLE.test(c));

// Small path-local anchor set (not a shared pool — no other path needs
// genuine banana-grove-tending actions) since the shared ACTIVITY pool has
// no content that fits harvesting/tending a tropical fruit grove. Every
// entry reinforces the cultivated, hand-tended, small-scale farm energy
// (never a wild-exploration pose) and doubles down on the hero pool's own
// wheelbarrow/basket/dirt-path props.
const BANANA_GROVE_ACTIVITIES = [
  'Reaching up to steady a heavy hanging bunch of bananas with one hand while trimming it free from the stalk with a small curved harvest knife, easing it down slowly toward a waiting basket.',
  'Pushing a loaded wheelbarrow of freshly cut bananas along the worn dirt path, both hands steady on the worn wooden handles.',
  'Kneeling beside a woven basket to arrange freshly cut bunches of bananas, cushioning them gently with a few broad fallen leaves.',
  'Walking slowly along the winding dirt path between the rows, one hand trailing lightly along a low broad leaf as it sways past.',
  'Coiling a length of twine around a bundle of trimmed banana leaves, tying it off with a practiced double loop.',
  'Kneeling to gather a few fallen banana leaves into a tidy pile at the base of a trunk, brushing loose soil from their pale undersides.',
  'Resting a hand against a smooth trunk while looking up at a heavy hanging bunch, gauging how many more days until it will be ready to cut.',
  'Carrying a full harvest basket balanced against one hip, stepping carefully over a root along the worn dirt path.',
];

module.exports = ({ sharedDNA, picker }) => {
  // "Sometimes no human" rule (Kevin 2026-09-09) — a pure grove still-life
  // (leaves, hanging fruit, a resting wheelbarrow, dappled light) is just as
  // on-brand as a person tending it. ~68% chance of a character.
  const includeCharacter = Math.random() < 0.6;

  const place = picker.pickWithRecency(BANANA_GROVE_PLACE, 'banana_grove_place');

  const character = includeCharacter
    ? pools.pickCharacter(picker, ['farm', 'leisure'], 'banana_grove_character')
    : null;

  // ACTIVITY-shaped entries are only meaningful when a character is
  // present (implied human subject).
  const activity = includeCharacter
    ? picker.pickWithRecency(BANANA_GROVE_ACTIVITIES, 'banana_grove_activity')
    : null;

  // Skip SEASON entirely (Phase 4 instruction) — tropical, not 4-season.
  // WEATHER_ATMOSPHERE filtered to summer/ANY only (byTags always lets ANY
  // through) so spring/autumn/winter language never contradicts the grove.
  const weather = picker.pickWithRecency(
    pools.byTags(pools.WEATHER_ATMOSPHERE, ['summer']),
    'banana_grove_weather'
  );
  const camera = picker.pickWithRecency(BANANA_GROVE_CAMERA, 'banana_grove_camera');

  const animalChance = includeCharacter ? 0.45 : 0.8;
  const animalPool = pools.byTags(pools.ANIMAL_COMPANIONS, ['low', 'medium']);
  const animal = includeCharacter
    ? Math.random() < animalChance
      ? picker.pickWithRecency(animalPool, 'banana_grove_animal')
      : null
    : pools.pickPureSceneLife(picker, {
        animalPool,
        animalChance,
        ambientTags: ['outdoor'],
        axisPrefix: 'banana_grove',
      });
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'banana_grove_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE BANANA GROVE (the hero of the shot) ━━━
${place}
The grove is a small, cultivated, hand-tended farm plot — neat rows a family
or small crew works by hand, never an unexplored wild space. The huge
paddle-shaped leaves and hanging bunches of fruit fill the frame right at
hand on every side, close enough to touch.
${character ? `\n━━━ THE CHARACTER ━━━\n${character}\n` : ''}
${activity ? `━━━ WHAT'S HAPPENING ━━━\n${activity}\n\n` : ''}━━━ ATMOSPHERE ━━━
${weather}
${animal ? `\n━━━ ANIMAL COMPANY ━━━\n${animal}\n` : ''}
━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  character
    ? `render a warm, unhurried tropical-farm moment — the grove's own leaves and
hanging fruit, the character, and every prop of the harvest rendered with
equal loving richness, never a bare or empty composition. The character
walks or works right among the rows, within easy reach of the nearest
trunks and hanging bunches — a figure IN the grove, not a distant tiny
speck beyond it. Every face in the frame, human and animal alike, stays
clearly separate and fully legible.`
    : `no human figure anywhere in the frame — this is a warm, unhurried
tropical-farm still-life moment carried entirely by the grove's own broad
leaves, hanging fruit, dirt path, and resting harvest tools, and whatever
wildlife shares it, every detail rendered with equal loving richness, never
a bare or empty composition.${animal ? ' Any animal present reads as a real, naturally distinct creature with open air around it; any small insect, bird, or floating detail (petals, dust motes, fireflies) stays simple and unposed, with no invented face or cartoon expression.' : ''}`
} no text, no words, no watermarks, gallery quality`;
};
