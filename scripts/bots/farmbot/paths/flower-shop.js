/**
 * FarmBot — flower-shop (Phase 2, 2026-09-08).
 *
 * Section 16 example archetype. Place-led indoor-shop equivalent of
 * village-street-wandering, with cozy-bakery-afternoon's "sometimes no
 * human" counter-scene pattern. A cozy little village FLOWER SHOP interior
 * — buckets of cut flowers, ribbon, a wooden counter, hanging dried herb
 * bundles, maybe a cat napping among the blooms — is always the hero,
 * carried by a bespoke FLOWER_SHOP_PLACE pool (WORLD_DETAIL_PROPS has no
 * dedicated indoor-florist coverage — checked pools.js directly, its indoor
 * entries are all bakery/farmhouse-generic). CHARACTER_ARCHETYPE already
 * has 3 dedicated "flower seller" entries plus 5 more market-tagged
 * shopkeeper/herbalist/settled-adventurer entries — all read naturally as
 * someone who could be minding a flower shop, so the character pick uses
 * the full `market` tag rather than restricting to just the 3 literal
 * florist entries (keeps cast variety, matches village-street-wandering's
 * own market+leisure reuse).
 *
 * No shared ACTIVITY entry fits an indoor florist shop at all — the pool
 * has zero 'market' tag and every chore/farm/bakery entry assumes an
 * outdoor farmyard or a kitchen (checked pools.js directly: brushing a
 * pony, hanging laundry, kneading dough, glazing a cake — none plausible
 * behind a flower-shop counter). Rather than force an incompatible reuse
 * (the exact village-street/orchard content-vs-tag mismatch lesson),
 * FLOWER_SHOP_ACTIVITIES below is a small path-local (not pool-file) set of
 * genuine florist actions — same pattern as spring-planting-day's
 * PLANTING_ANCHOR.
 *
 * No SEASON pull — SEASON's entries are landscape-hero (meadows, lakesides,
 * orchard lanes), which would compete with/contradict the shop-interior
 * place pool, same reasoning as village-street-wandering. No
 * WORLD_DETAIL_PROPS pull either — the bespoke place pool is already a
 * complete, richly-detailed indoor setting on its own (counter, buckets,
 * ribbon, jars, herb bundles, architecture), so pulling WORLD_DETAIL_PROPS
 * on top risks reintroducing outdoor/bakery/farmhouse-specific items that
 * don't belong in a florist's shop. WEATHER_ATMOSPHERE IS pulled (full
 * pool, unfiltered, same as cozy-bakery-afternoon and village-street-
 * wandering) for light/atmosphere variety glimpsed through the shop window.
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

// Path-bespoke pool — required directly, NOT added to pools.js (shared
// file, other agents may be editing it concurrently). See:
// scripts/gen-seeds/farmbot/gen-flower-shop-place-pool.js
const FLOWER_SHOP_PLACE = require('../seeds/farmbot_flower_shop_place.json');

// Small path-local anchor set (not a shared pool — no other path needs
// genuine florist actions) since the shared ACTIVITY pool has no content
// that fits an indoor flower-shop counter at all.
const FLOWER_SHOP_ACTIVITIES = [
  'Trimming the woody ends from a handful of just-cut roses with a small pair of shears, letting each stem fall gently into a waiting bucket.',
  'Gathering loose stems into a soft, rounded bouquet, turning it slowly to check the balance of color from every side.',
  'Wrapping a finished bouquet in a sheet of brown kraft paper, folding the corners in neatly before winding a length of ribbon around the middle.',
  'Tying a neat bow of pale ribbon around a bundle of wildflowers, smoothing the loops flat with careful fingers.',
  'Sorting a fresh delivery of cut blooms by color into a row of galvanized buckets, setting each stem in with an unhurried rhythm.',
  'Arranging a cluster of ranunculus and sweet peas into a glass vase, turning it slowly to settle every stem into place.',
  'Sweeping a scatter of fallen petals from the wooden counter into a cupped palm with a small soft-bristled brush.',
  'Filling a small tin watering can before tipping a slow, careful stream over a row of potted ferns on the windowsill.',
];

module.exports = ({ sharedDNA, picker }) => {
  // Kevin (2026-09-09): "sometimes no human" rule — an empty flower shop
  // still-life with sunlight through the window is just as charming as a
  // shopkeeper minding the counter.
  const includeCharacter = Math.random() < 0.6;

  const character = includeCharacter
    ? pools.pickCharacter(picker, ['market'], 'flower_shop_character')
    : null;

  const place = picker.pickWithRecency(FLOWER_SHOP_PLACE, 'flower_shop_place');

  // ACTIVITY-shaped entries are only meaningful when a character is
  // present (implied human subject).
  const activity = includeCharacter
    ? picker.pickWithRecency(FLOWER_SHOP_ACTIVITIES, 'flower_shop_activity')
    : null;

  const weather = picker.pickWithRecency(
    pools.WEATHER_ATMOSPHERE.map((e) => e.description),
    'flower_shop_weather'
  );
  const camera = picker.pickWithRecency(pools.CAMERA_COMPOSITION, 'flower_shop_camera');
  const animalChance = includeCharacter ? 0.35 : 0.65;
  const animalPool = pools.byTags(pools.ANIMAL_COMPANIONS, ['low']);
  const animal = includeCharacter
    ? Math.random() < animalChance
      ? picker.pickWithRecency(animalPool, 'flower_shop_animal')
      : null
    : pools.pickPureSceneLife(picker, {
        animalPool,
        animalChance,
        ambientTags: ['indoor'],
        axisPrefix: 'flower_shop',
      });
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'flower_shop_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE FLOWER SHOP (the hero of the shot) ━━━
${place}
The buckets of blooms, the wooden counter, and the hanging herb bundles
fill the little room close at hand on every side — an intimate small shop
room, never a large empty hall and never mistaken for an outdoor garden or
market stall.
${character ? `\n━━━ THE SHOPKEEPER ━━━\n${character}\n` : ''}${activity ? `━━━ WHAT'S HAPPENING (unhurried, at home in the shop) ━━━\n${activity}\n\n` : ''}━━━ ATMOSPHERE ━━━
${weather}
${animal ? `\n━━━ AN ANIMAL ABOUT ━━━\n${animal}\n` : ''}
━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  character
    ? `render a cozy, charming indoor flower-shop moment — the shopkeeper and the
shop's own rich floral detail rendered with equal loving richness, never a
plain backdrop. Every face in the frame, human and animal alike, stays
clearly separate and fully legible, each keeping its own open space with a
visible gap of air between it and any other face.`
    : `no human figure anywhere in the frame — this is a cozy, charming indoor
flower-shop still-life moment. The buckets of blooms, ribbon, and wooden
counter carry the whole scene, rendered with rich loving detail, never
plain or empty.${animal ? ' Any animal present reads as a real, naturally distinct creature with open air around it; any small insect, bird, or floating detail (petals, dust motes, fireflies) stays simple and unposed, with no invented face or cartoon expression.' : ''}`
} no text, no words, no watermarks, gallery quality`;
};
