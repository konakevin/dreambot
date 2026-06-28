/**
 * DreamBot far-eden-soft path — the PAINTERLY sibling of far-eden (2026-06-28).
 *
 * Identical to far-eden in every way (same DREAMBOT_FAR_EDEN archetype, same
 * eden_* pools, same look-neutral template) EXCEPT the medium: this variant locks
 * the PAINTERLY medium (dreambot_eden_painterly) while far-eden locks the HYPERREAL
 * one. Kevin approved BOTH looks (2026-06-28), so this ships as a permanent sibling
 * path alongside far-eden — the painterly half of the alien-world feed.
 *
 * See paths/far-eden.js for the full path doc.
 */

module.exports = {
  archetype: 'DREAMBOT_FAR_EDEN',
  pools: {
    world: 'EDEN_WORLD',
    cosmic_sky: 'EDEN_COSMIC_SKY',
    flora: 'EDEN_FLORA',
    palette: 'EDEN_PALETTE',
    atmosphere: 'EDEN_ATMOSPHERE',
    terrain_glow: 'EDEN_TERRAIN_GLOW', // ~50% gate
    life_accent: 'EDEN_LIFE_ACCENT', // ~28% gate
    wonder_structure: 'EDEN_WONDER_STRUCTURE', // ~30% gate
    dream_event: 'EDEN_DREAM_EVENT', // ~30% gate
  },
};
