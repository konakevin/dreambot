/**
 * OceanBot undersea-seascape — axis-system declarative path (Phase 1 stub).
 * Coral arches, kelp cathedrals, sun-shaft caustics. Biome is hero.
 *
 * Phase 1 (2026-06-01): empty pools, archetype + slot wiring only.
 * Phase 2 fills the template (in archetype-templates.js) + each pool's
 * bespoke gen script under scripts/gen-seeds/oceanbot/.
 */
module.exports = {
  archetype: 'OCEANBOT_UNDERSEA_SEASCAPE',
  pools: {
    biome_anchor: 'UNDERSEA_SEASCAPE_BIOME_ANCHOR',
    marine_life: 'UNDERSEA_SEASCAPE_MARINE_LIFE',
    submerged_structure: 'UNDERSEA_SEASCAPE_SUBMERGED_STRUCTURE',
    foreground_element: 'UNDERSEA_SEASCAPE_FOREGROUND_ELEMENT',
    caustic_light: 'UNDERSEA_SEASCAPE_CAUSTIC_LIGHT',
    water_clarity: 'UNDERSEA_SEASCAPE_WATER_CLARITY',
    weather_in_water: 'UNDERSEA_SEASCAPE_WEATHER_IN_WATER',
    depth_setting: 'UNDERSEA_SEASCAPE_DEPTH_SETTING',
    camera_framing: 'UNDERSEA_SEASCAPE_CAMERA_FRAMING',
    surprise_element: 'UNDERSEA_SEASCAPE_SURPRISE_ELEMENT',
    drama: 'UNDERSEA_SEASCAPE_DRAMA',
  },
};
