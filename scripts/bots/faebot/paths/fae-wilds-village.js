/**
 * FaeBot fae-wilds-village path (2026-06-10). Sibling of fae-castle-village,
 * but the white elven castle-village is BUILT AROUND a mandated dramatic
 * nature landscape feature (stream / canyon / waterfall / giant rocks / cliffs
 * / ancient trees), with parts joined by creative connectors (bridges, arches,
 * ropes, swings, ladders, walkways, lifts). Self-contained axes. MVP-25.
 */
module.exports = {
  archetype: 'FAEBOT_WILDS_VILLAGE',
  pools: {
    landscape_feature: 'FAEBOT_WILDS_VILLAGE_FEATURE',
    village_built: 'FAEBOT_WILDS_VILLAGE_BUILT',
    connectors: 'FAEBOT_WILDS_VILLAGE_CONNECTORS',
    inhabitants: 'FAEBOT_WILDS_VILLAGE_INHABITANTS',
    fae_lighting: 'FAEBOT_WILDS_VILLAGE_LIGHTING',
    drama: 'FAEBOT_WILDS_VILLAGE_DRAMA', // 40% gated conditional
  },
};
