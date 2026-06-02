/**
 * DragonBot iconic-landscape path — declarative form (2026-05-14).
 *
 * Merger of legacy wow-landscape + lotr-landscape into a single
 * stylized-fantasy-biome path. Blended Tolkien-mythic-grandeur +
 * Blizzard-hand-painted-stylized concept art. Pure landscape, no
 * characters. Saturated theatrical painted aesthetic distinct from
 * the realistic-coded main `landscape` path.
 *
 * Path-bespoke pools (3 × 30 MVP):
 *   - biome: ICONIC_BIOME (iconic archetypal fantasy biomes)
 *   - sky_layer: ICONIC_LANDSCAPE_SKY (saturated theatrical skies)
 *   - phenomenon: ICONIC_LANDSCAPE_PHENOMENON (60%-gated mag/atmo event)
 *
 * Legacy wow-landscape.js + lotr-landscape.js preserved under
 * paths/legacy/ for historical reference.
 */

module.exports = {
  archetype: 'ICONIC_LANDSCAPE',
  pools: {
    biome: 'ICONIC_BIOME',
    sky_layer: 'ICONIC_LANDSCAPE_SKY',
    // NEW (2026-06-01 PREMIUM-TIER enrichment 3 → 8 bespoke):
    mythic_tradition: 'ICONIC_LANDSCAPE_MYTHIC_TRADITION', // ALWAYS-ON — painter lineage
    legendary_landmark: 'ICONIC_LANDSCAPE_LEGENDARY_LANDMARK', // 50%-gated
    mood_atmosphere: 'ICONIC_LANDSCAPE_MOOD_ATMOSPHERE', // 50%-gated
    heraldic_color: 'ICONIC_LANDSCAPE_HERALDIC_COLOR', // 50%-gated
    signature_creature: 'ICONIC_LANDSCAPE_SIGNATURE_CREATURE', // 50%-gated
    // Conditional 60%-gated drama (existing):
    phenomenon: 'ICONIC_LANDSCAPE_PHENOMENON',
  },
};
