/**
 * BrickBot lego-city — modern LEGO City life MOC (Stage B1). Fire-station callout,
 * construction, modular downtown, harbor, police, market. Full 10-axis stack
 * (clone of space, with vehicle_class ~50% City vehicle / ~50% no-vehicle street).
 * register ~85% LEGO City heritage. Anti-photoreal brick mandate (asphalt/glass/
 * water = brick parts). Wide-establishing deep-focus. NEVER Star Wars, no logos/text.
 */

module.exports = {
  archetype: 'BRICKBOT_LEGO_CITY',
  pools: {
    scene_type: 'BRICKBOT_LEGO_CITY_SCENE_TYPE',
    minifig_action: 'BRICKBOT_LEGO_CITY_MINIFIG_ACTION',
    build_technique: 'BRICKBOT_LEGO_CITY_BUILD_TECHNIQUE',
    camera_framing: 'BRICKBOT_LEGO_CITY_CAMERA_FRAMING',
    vehicle_class: 'BRICKBOT_LEGO_CITY_VEHICLE_CLASS',
    register: 'BRICKBOT_LEGO_CITY_REGISTER',
    scene_props: 'BRICKBOT_LEGO_CITY_SCENE_PROPS',
    lighting: 'BRICKBOT_LEGO_CITY_LIGHTING',
    palette: 'BRICKBOT_LEGO_CITY_PALETTE',
    city_event: 'BRICKBOT_LEGO_CITY_CITY_EVENT',
  },
};
