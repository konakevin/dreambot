/**
 * DragonBot castle path — declarative form (2026-05-17).
 *
 * NEW path dedicated to MAJESTIC EPIC BEAUTIFUL CASTLE VIEWS — castles are
 * 100% the focal subject, set amongst gorgeous fantasy backdrops, with
 * massive sense of scale and breathtaking cinematography. Distinct from
 * epic-moment (50/50 castle + event) — this is pure castle-as-hero.
 *
 * Aesthetic lineage: Helm's Deep / Minas Tirith / Edoras / Erebor / Anor
 * Londo / Lothric Castle / Hyrule Castle / Bowerstone establishing-shot
 * energy. Painted concept-art quality, movie-poster cinematography.
 *
 * Path-bespoke pools (5 × 25 MVP, scale to 200 once recipe locks):
 *   - castle: CASTLE_HERO (the castle as architectural subject)
 *   - biome: CASTLE_BIOME (gorgeous fantasy landscape backdrop)
 *   - sky_layer: CASTLE_SKY (dramatic atmospheric sky overhead)
 *   - scale_prover: CASTLE_SCALE_PROVER (tiny element proving scale)
 *   - phenomenon: CASTLE_PHENOMENON (40%-gated atmospheric flourish)
 */

module.exports = {
  archetype: 'DRAGONBOT_CASTLE',
  pools: {
    castle: 'CASTLE_HERO',
    biome: 'CASTLE_BIOME',
    sky_layer: 'CASTLE_SKY',
    scale_prover: 'CASTLE_SCALE_PROVER',
    phenomenon: 'CASTLE_PHENOMENON', // 40% gated conditional
  },
};
