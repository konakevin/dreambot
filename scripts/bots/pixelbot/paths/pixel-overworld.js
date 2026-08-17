/**
 * PixelBot pixel-overworld (Stage K3, SHADOW) — the classic 16-bit JRPG world-MAP
 * screen. Top-down tile continents, tiny walled towns, mountain ranges, forests as
 * tile clusters, a ship sprite on tile sea, cloud shadows. Camera: STRAIGHT top-down
 * world-map view. map_features pickN:2; traveler_sprite tiny map-scale; 40%-gated
 * map_event. Chunky terrain tile-grid must read. NO UI/menus/labels/text.
 */

module.exports = {
  archetype: 'PIXELBOT_PIXEL_OVERWORLD',
  pools: {
    map_region: 'PIXELBOT_PIXEL_OVERWORLD_MAP_REGION',
    map_features: 'PIXELBOT_PIXEL_OVERWORLD_MAP_FEATURES',
    traveler_sprite: 'PIXELBOT_PIXEL_OVERWORLD_TRAVELER_SPRITE',
    map_event: 'PIXELBOT_PIXEL_OVERWORLD_MAP_EVENT',
  },
};
