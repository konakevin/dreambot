/**
 * FaeBot flower-fairy — declarative axis-system path (2026-05-17, R4 rebuild).
 *
 * REBUILT FaeBot-native: mythic-fae-creature first (not human model),
 * candid mid-action moments (never posed), organic fae-grown attire
 * (not couture), painterly soft-moody atmosphere (matching FaeBot's
 * dryad-portrait / forest-fairy-scene aesthetic).
 *
 * Uses FaeBot's painted_fantasy_novel medium (Manchess + Giancola + Bonner
 * + Brian Froud painted-fantasy lineage) — same as other FaeBot paths.
 *
 * Axes (4 path-bespoke + 60%-gated magical_signature):
 *   - fairy_creature (30): unified mythic-fae description with stacked
 *     features (race-essence + glowing skin + elf-ears + fae-markings +
 *     hair + plant-merge + magical signature)
 *   - floral_attire (30): organic flower-woven fae-attire (color-themed,
 *     multi-species, never couture)
 *   - wings (50): dramatic flower-wings centerpiece
 *   - candid_action (30): mid-action candid moment (never posed)
 *   - magical_signature (30, 60%-gated): visible magic (pollen-glow /
 *     firefly cloud / aurora / etc.)
 */

module.exports = {
  archetype: 'FAEBOT_FLOWER_FAIRY',
  pools: {
    fairy_creature: 'FAEBOT_FLOWER_FAIRY_FAIRY_CREATURE',
    floral_attire: 'FAEBOT_FLOWER_FAIRY_FLORAL_ATTIRE',
    wings: 'FAEBOT_FLOWER_FAIRY_WINGS',
    candid_action: 'FAEBOT_FLOWER_FAIRY_CANDID_ACTION',
    magical_signature: 'FAEBOT_FLOWER_FAIRY_MAGICAL_SIGNATURE',
  },
};
