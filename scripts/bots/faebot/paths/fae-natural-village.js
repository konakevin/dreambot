/**
 * FaeBot fae-natural-village path (2026-06-10). Clone of fae-wilds-village
 * (built around a mandated nature feature + creative connectors), but the
 * dwellings are made of ORGANIC, EARTHY, of-the-earth materials — carved wood,
 * giant mushrooms, huge blooming flowers, hollow logs, woven branches, gourds.
 * Weird, fun, organic. Self-contained axes. MVP-25.
 */
module.exports = {
  archetype: 'FAEBOT_NATURAL_VILLAGE',
  pools: {
    landscape_feature: 'FAEBOT_NATURAL_VILLAGE_FEATURE',
    village_built: 'FAEBOT_NATURAL_VILLAGE_BUILT',
    connectors: 'FAEBOT_NATURAL_VILLAGE_CONNECTORS',
    inhabitants: 'FAEBOT_NATURAL_VILLAGE_INHABITANTS',
    fae_lighting: 'FAEBOT_NATURAL_VILLAGE_LIGHTING',
    drama: 'FAEBOT_NATURAL_VILLAGE_DRAMA', // 40% gated conditional
  },
};
