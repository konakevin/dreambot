/**
 * DragonBot landscape path ⭐ FLAGSHIP — awe-inducing fantasy vistas.
 *
 * Migrated 2026-05-14 from legacy function-based slot-pool form to
 * declarative 5-axis bespoke system. The land is the hero — NO CHARACTERS,
 * NO FIGURES. LUSH / DYNAMICALLY LIT / FULL OF LIFE / AWE-STRUCK SCALE /
 * RICH DETAIL mandate inherited from legacy template, now in the
 * DRAGONBOT_LANDSCAPE template.
 *
 * 5 path-bespoke pools (mirror of dragon-scene's 5-axis design without
 * a character-as-hero axis):
 *   - biome: LANDSCAPE_BIOME (the hero — primary biome)
 *   - architecture: LANDSCAPE_ARCHITECTURE (anchors composition)
 *   - phenomenon: LANDSCAPE_PHENOMENON (40% gated atmospheric/magical event)
 *   - surprise_element: LANDSCAPE_SURPRISE_ELEMENT (tiny secondary, NO figures)
 *   - sky_layer: LANDSCAPE_SKY (overhead atmospheric element)
 *
 * Plus universal lighting + atmosphere from bot defaults.
 */

module.exports = {
  archetype: 'DRAGONBOT_LANDSCAPE',
  pools: {
    biome: 'LANDSCAPE_BIOME',
    architecture: 'LANDSCAPE_ARCHITECTURE',
    phenomenon: 'LANDSCAPE_PHENOMENON',
    surprise_element: 'LANDSCAPE_SURPRISE_ELEMENT',
    sky_layer: 'LANDSCAPE_SKY',
    // NEW (2026-06-01 PREMIUM-TIER enrichment 5 → 10 bespoke):
    aesthetic_register: 'LANDSCAPE_AESTHETIC_REGISTER', // ALWAYS-ON painter lineage
    light_quality: 'LANDSCAPE_LIGHT_QUALITY', // 50%-gated
    signature_flora: 'LANDSCAPE_SIGNATURE_FLORA', // 50%-gated
    signature_fauna: 'LANDSCAPE_SIGNATURE_FAUNA', // 50%-gated
    magical_element: 'LANDSCAPE_MAGICAL_ELEMENT', // 50%-gated
  },
};
