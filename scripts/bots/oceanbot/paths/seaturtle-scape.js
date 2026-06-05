/**
 * OceanBot seaturtle-scape — axis-system declarative path.
 *
 * Sea-turtles across the full life-and-habitat span: adults gliding
 * through reefs / kelp / open ocean / shore / nesting beach, hatchlings
 * emerging from sand and rushing to the surf, juveniles in their first
 * open-ocean dive. NatGeo / BBC Blue Planet register. All 7 real
 * species (green / loggerhead / hawksbill / leatherback / olive ridley
 * / Kemp's ridley / flatback).
 *
 * NO SHIPS, NO PEOPLE, NO DIVING GEAR — the turtle is the subject,
 * the ocean is the world.
 *
 * Same lean 4-axis shape (2 path + 2 universal) as the other scenic
 * paths.
 *
 * Wires the OCEANBOT_SEATURTLE_SCAPE archetype slots to per-axis pool
 * names that resolve via bot.poolByName (scripts/bots/oceanbot/pools.js).
 */

module.exports = {
  archetype: 'OCEANBOT_SEATURTLE_SCAPE',
  pools: {
    turtle_scene: 'SEATURTLE_SCENES',
    camera_framing: 'SEATURTLE_CAMERA_FRAMING',
  },
};
