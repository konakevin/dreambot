/**
 * StarBot gas-giant-skies (Stage L2, SHADOW) — INSIDE a gas giant's atmosphere.
 * Continental-scale cloud formations, floating harvester platforms/cities, an
 * Earth-sized storm on the horizon, lightning below the cloud deck. Self-lit
 * (atmo_light is the atmosphere's own depth-light). CLOUD-native vocabulary only
 * (never canyon/cliff/mountain). Uses the bot default starbot_hyperreal medium.
 * 5 bespoke slots + 35%-gated atmo_event.
 */

module.exports = {
  archetype: 'GAS_GIANT_SKIES',
  pools: {
    cloudscape: 'GAS_GIANT_SKIES_CLOUDSCAPE',
    float_presence: 'GAS_GIANT_SKIES_FLOAT_PRESENCE',
    storm_titan: 'GAS_GIANT_SKIES_STORM_TITAN',
    atmo_light: 'GAS_GIANT_SKIES_ATMO_LIGHT',
    sky_above: 'GAS_GIANT_SKIES_SKY_ABOVE',
    atmo_event: 'GAS_GIANT_SKIES_ATMO_EVENT',
  },
};
