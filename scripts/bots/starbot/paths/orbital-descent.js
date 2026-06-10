/**
 * StarBot orbital-descent path (2026-06-10, NEW). A world seen from orbit —
 * the planet's curve filling the frame, terminator + city-lights, a tiny
 * craft on approach. Scene-led. Bot default starbot_hyperreal medium.
 * MVP-25 pools — seed-test-then-scale.
 */
module.exports = {
  archetype: 'ORBITAL_DESCENT',
  pools: {
    planet_type: 'ORBITAL_DESCENT_PLANET',
    surface_detail: 'ORBITAL_DESCENT_SURFACE',
    atmosphere_glow: 'ORBITAL_DESCENT_ATMOSPHERE',
    approach_craft: 'ORBITAL_DESCENT_CRAFT',
    space_backdrop: 'ORBITAL_DESCENT_BACKDROP',
    descent_event: 'ORBITAL_DESCENT_EVENT', // 40% gate
  },
};
