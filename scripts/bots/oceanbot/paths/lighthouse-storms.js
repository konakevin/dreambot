/**
 * OceanBot lighthouse-storms — ABOVE-water Jean-Guichard register (Stage J3).
 * A real weathered lighthouse taking a monster wave, the keeper's light glowing
 * warm through the spray. ~75% storm / ~25% calm-after. The light STAYS LIT (the
 * emotional core); NO keeper figure (unstated-figure law — the tower stands
 * alone); weathered-real, no fantasy. Lean 4-slot: lighthouse_scene (hero) +
 * wave_impact (money-shot) + storm_sky + camera_framing (audited).
 */

module.exports = {
  archetype: 'OCEANBOT_LIGHTHOUSE_STORMS',
  pools: {
    lighthouse_scene: 'LIGHTHOUSE_SCENES',
    wave_impact: 'LIGHTHOUSE_WAVE_IMPACT',
    storm_sky: 'LIGHTHOUSE_STORM_SKY',
    camera_framing: 'LIGHTHOUSE_CAMERA_FRAMING',
  },
};
