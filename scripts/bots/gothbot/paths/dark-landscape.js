/**
 * GothBot dark-landscape path — declarative form (2026-05-15).
 *
 * First GothBot path migrated to the bespoke axis system. Pure gothic
 * landscape — Castlevania / Bloodborne / Crimson-Peak / Berserk visual
 * lineage. NO characters. Movie-poster wide-vista compositions.
 *
 * Path-bespoke pools (5 × 30 MVP):
 *   - biome: GOTHBOT_DARK_LANDSCAPE_BIOME
 *   - architecture: GOTHBOT_DARK_LANDSCAPE_ARCHITECTURE
 *   - phenomenon: GOTHBOT_DARK_LANDSCAPE_PHENOMENON (80%-gated)
 *   - surprise_element: GOTHBOT_DARK_LANDSCAPE_SURPRISE_ELEMENT
 *   - sky_layer: GOTHBOT_DARK_LANDSCAPE_SKY
 *
 * Universal: LIGHTING + ATMOSPHERES (existing GothBot pools — these are
 * already GothBot-bespoke). NO shared code or pools with DragonBot.
 *
 * Pre-refactor file preserved at paths/legacy/dark-landscape.js.
 */

module.exports = {
  archetype: 'GOTHBOT_DARK_LANDSCAPE',
  pools: {
    biome: 'GOTHBOT_DARK_LANDSCAPE_BIOME',
    architecture: 'GOTHBOT_DARK_LANDSCAPE_ARCHITECTURE',
    phenomenon: 'GOTHBOT_DARK_LANDSCAPE_PHENOMENON',
    surprise_element: 'GOTHBOT_DARK_LANDSCAPE_SURPRISE_ELEMENT',
    sky_layer: 'GOTHBOT_DARK_LANDSCAPE_SKY',
  },
};
