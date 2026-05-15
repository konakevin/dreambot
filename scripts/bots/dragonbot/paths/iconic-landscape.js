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
    phenomenon: 'ICONIC_LANDSCAPE_PHENOMENON',
  },
};
