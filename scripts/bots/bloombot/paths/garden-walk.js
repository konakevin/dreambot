/**
 * BloomBot garden-walk — declarative axis-system form (2026-05-16 migration).
 *
 * WALKABLE FLORAL PASSAGE inviting the viewer in. Symmetric portrait
 * composition mandate (archway centered, path dead-center, foreground
 * bloom-mass on each side, glowing depth-of-field at the path far end).
 *
 * Legacy compositional version preserved at paths/legacy/garden-walk.js.
 *
 * Axes (3 path-bespoke + 60%-gated phenomenon):
 *   - archway_type (200): the architectural framing entity (stone arch /
 *     pergola / iron arbor / temple ruin / branch arch / vine curtain)
 *   - path_material (100): the path surface leading dead-center
 *   - destination_glimpse (100): what lies beyond the arch
 *   - atmospheric_phenomenon (50, 60%-gated): magic-moment element
 */

module.exports = {
  archetype: 'BLOOMBOT_GARDEN_WALK',
  pools: {
    archway_type: 'BLOOMBOT_GARDEN_WALK_ARCHWAY_TYPE',
    path_material: 'BLOOMBOT_GARDEN_WALK_PATH_MATERIAL',
    destination_glimpse: 'BLOOMBOT_GARDEN_WALK_DESTINATION_GLIMPSE',
    atmospheric_phenomenon: 'BLOOMBOT_GARDEN_WALK_ATMOSPHERIC_PHENOMENON',
  },
};
