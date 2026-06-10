/**
 * StarBot derelict path — declarative form (2026-06-09, NEW).
 *
 * A drifting abandoned/dead spacecraft or station, a lone explorer's
 * flashlight beam cutting the dark — eerie awe-horror (Alien / Dead Space /
 * Event Horizon). Adds a darker tonal register. Scene-led — the dead
 * structure + the explorer's light are the hero. Bot default
 * starbot_hyperreal medium.
 *
 * Pools are MVP-25 (2026-06-09) — seed-test-then-scale per Kevin's mandate.
 */

module.exports = {
  archetype: 'DERELICT',
  pools: {
    derelict_setting: 'DERELICT_SETTING',
    decay_detail: 'DERELICT_DECAY',
    explorer_light: 'DERELICT_EXPLORER',
    ominous_reveal: 'DERELICT_REVEAL',
    light_atmosphere: 'DERELICT_ATMOSPHERE',
    // conditional layer (40% gate)
    threat_hint: 'DERELICT_THREAT',
  },
};
