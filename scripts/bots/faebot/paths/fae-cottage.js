/**
 * FaeBot fae-cottage path (2026-07-01, Kevin cottagecore reference lock).
 *
 * ONE cozy fae dwelling — cottage / stone chapel / mill / lodge — as the
 * unmistakable hero, nestled in a wild FaeBot setting (stream / lake /
 * clearing / meadow / glen), one dominant flowering species engulfing it,
 * warm window-glow + chimney smoke against a softer scene, charming garden
 * foreground, tiny critters on a 60% gate (reuses VILLAGE_WILDLIFE). ZERO
 * humans — the life is the light in the windows.
 *
 * Reference: Kevin's hearted fae-village render (flower-drowned stone
 * chapel-cottage, amber gothic windows vs grey mist) — this path renders
 * that composition reliably instead of as a village-path lucky roll.
 * Pools MVP-25 (seed-test-then-scale).
 */
module.exports = {
  archetype: 'FAEBOT_FAE_COTTAGE',
  pools: {
    dwelling: 'FAEBOT_FAE_COTTAGE_DWELLING',
    setting: 'FAEBOT_FAE_COTTAGE_SETTING',
    overgrowth: 'FAEBOT_FAE_COTTAGE_OVERGROWTH',
    garden: 'FAEBOT_FAE_COTTAGE_GARDEN',
    cottage_lighting: 'FAEBOT_FAE_COTTAGE_LIGHTING',
    atmosphere: 'FAEBOT_FAE_COTTAGE_ATMOSPHERE',
    // conditional layer (60% gate) — little forest critters
    wildlife_accent: 'VILLAGE_WILDLIFE',
  },
};
