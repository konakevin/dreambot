/**
 * BrickBot lego-trains — LEGO trains through all-brick worlds MOC (Stage B2).
 * Steam/diesel/cargo/express on studded viaducts, cargo yards, mountain tunnels,
 * crossing gates, stations. Bespoke rail stack: train_consist (HERO) + trackwork
 * (MONEY-SHOT) + route_biome + station_life (mid-X minifig beat) + camera_framing
 * (MANDATORY) + build_technique + lighting + palette + gated rail_event.
 * Unmistakably BRICK (studded rolling stock, brick terrain), NEVER HO-scale realism.
 * Wide-establishing deep-focus. NEVER Star Wars, no brand names/text.
 */

module.exports = {
  archetype: 'BRICKBOT_LEGO_TRAINS',
  pools: {
    train_consist: 'BRICKBOT_LEGO_TRAINS_TRAIN_CONSIST',
    trackwork: 'BRICKBOT_LEGO_TRAINS_TRACKWORK',
    route_biome: 'BRICKBOT_LEGO_TRAINS_ROUTE_BIOME',
    station_life: 'BRICKBOT_LEGO_TRAINS_STATION_LIFE',
    camera_framing: 'BRICKBOT_LEGO_TRAINS_CAMERA_FRAMING',
    build_technique: 'BRICKBOT_LEGO_TRAINS_BUILD_TECHNIQUE',
    lighting: 'BRICKBOT_LEGO_TRAINS_LIGHTING',
    palette: 'BRICKBOT_LEGO_TRAINS_PALETTE',
    rail_event: 'BRICKBOT_LEGO_TRAINS_RAIL_EVENT',
  },
};
