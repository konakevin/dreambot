/**
 * GothBot the-sanctum path — NEW path (2026-06-10).
 *
 * THE GRAND COLD GOTHIC INTERIOR IS THE HERO (80%+ of frame). gothic-architecture
 * turned INWARD — the viewer stands inside an immense gothic chamber (cathedral
 * nave / crypt of kings / catacomb ossuary / cursed library / throne hall / grand
 * stairwell / mausoleum rotunda / flooded undercroft). Distinct from cozy-goth
 * (WARM / cluttered / intimate) — this is VAST / COLD / REVERENT / awe-and-dread.
 * The LIGHT WITHIN is the signature money-shot. Castlevania / Bloodborne /
 * Crimson-Peak / Dark-Souls lineage.
 *
 * Path-bespoke pools (6 × 25 MVP), universal:[] (bot LIGHTING/ATMOSPHERES are
 * exterior-weather-coded and fight a sealed interior — the path self-lights):
 *   - interior: GOTHBOT_SANCTUM_INTERIOR (the grand chamber, hero)
 *   - detail: GOTHBOT_SANCTUM_DETAIL (pickN: 3 — ornate interior ornament)
 *   - inner_light: GOTHBOT_SANCTUM_INNER_LIGHT (the dramatic light source — money-shot)
 *   - focal_feature: GOTHBOT_SANCTUM_FOCAL_FEATURE (the centrepiece the eye lands on)
 *   - atmosphere: GOTHBOT_SANCTUM_ATMOSPHERE (volumetric haze/depth within)
 *   - accent: GOTHBOT_SANCTUM_ACCENT (70%-gated — tiny scale-prover figure / dark wildlife)
 */

module.exports = {
  archetype: 'GOTHBOT_THE_SANCTUM',
  pools: {
    interior: 'GOTHBOT_SANCTUM_INTERIOR',
    detail: 'GOTHBOT_SANCTUM_DETAIL',
    inner_light: 'GOTHBOT_SANCTUM_INNER_LIGHT',
    focal_feature: 'GOTHBOT_SANCTUM_FOCAL_FEATURE',
    atmosphere: 'GOTHBOT_SANCTUM_ATMOSPHERE',
    accent: 'GOTHBOT_SANCTUM_ACCENT',
  },
};
