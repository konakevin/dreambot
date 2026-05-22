/**
 * YumBot floral-garden-scene path — sister of floral-garden-cup.
 *
 * Rich kawaii multi-planter GARDEN SCENE (indoor or outdoor) — 3+ kawaii-faced
 * planters/vessels clustered together, overflowing flowers, scattered kawaii
 * treats, magical accents. Scene-type axis (50 entries) locks composition so
 * renders are full and rich, never minimal single-hero shots.
 *
 * Counterpart: floral-garden-cup = single-vessel-hero closeup composition.
 */

module.exports = {
  archetype: 'YUMBOT_FLORAL_GARDEN_SCENE',
  pools: {
    scene_type: 'FLORAL_GARDEN_SCENE_TYPE',
    vessel: 'FLORAL_VESSEL',
    overflowing_flora: 'FLORAL_OVERFLOWING_FLORA',
    tabletop_scatter: 'FLORAL_TABLETOP_SCATTER',
    frame_branches: 'FLORAL_FRAME_BRANCHES',
    palette: 'FLORAL_PALETTE',
    background: 'FLORAL_BACKGROUND',
    lighting: 'FLORAL_LIGHTING',
    night_mode: 'KAWAII_NIGHT_AUGMENT',
  },
};
