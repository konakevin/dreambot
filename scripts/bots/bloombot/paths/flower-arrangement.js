/**
 * BloomBot flower-arrangement path (2026-05-27 NEW).
 *
 * An ORNATE, lavishly-designed flower arrangement in a vessel (urn / vase /
 * planter / basket / bouquet) as the focal HERO, set in a lush flower-garden
 * backdrop bursting with blooms. Museum still-life / editorial-florist quality.
 * Can dial up the same wild "pop" as flower-grove via the whimsy layer, but
 * channeled INTO a beautiful arrangement (not chaos). FORM/STYLE come from the
 * pools; COLOR + species come from the flower-engine theme (sharedDNA.palette/
 * roster) so the color-spread fix applies.
 *
 * Axes (3 path-bespoke + whimsy conditional 50%-gated + universal lighting):
 *   - vessel  (the container — material + ornateness)
 *   - style   (the arrangement design / silhouette)
 *   - setting (placement + lush flower-garden backdrop)
 *   - whimsy  (50%-gated — the gorgeous surreal "pop")
 */

module.exports = {
  archetype: 'BLOOMBOT_FLOWER_ARRANGEMENT',
  pools: {
    vessel: 'BLOOMBOT_FLOWER_ARRANGEMENT_VESSEL',
    style: 'BLOOMBOT_FLOWER_ARRANGEMENT_STYLE',
    setting: 'BLOOMBOT_FLOWER_ARRANGEMENT_SETTING',
    whimsy: 'BLOOMBOT_FLOWER_ARRANGEMENT_WHIMSY',
  },
};
