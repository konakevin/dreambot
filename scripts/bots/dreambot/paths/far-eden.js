/**
 * DreamBot far-eden path — scene-as-hero HAPPY fantasy ALIEN WORLD (2026-06-28).
 *
 * The brief (Kevin): original, beautiful, ALLURING fantasy alien worlds —
 * "brochure shots of alien worlds" you wish you could visit. Deliberately steered
 * AWAY from sci-fi's default dark/serious/ominous register: these are JOYFUL
 * paradise vistas, bright and inviting and full of gentle life. NOT copies of any
 * reference set. NO character; the otherworldly landscape itself is the hero.
 * DreamBot is a wildcard bot, so this path is NOT bound to the chibi identity.
 *
 * Built the playbook way off the dreamscape scene-as-hero shape (NOT the painterly
 * dream-spires lineage): the LOOK is held constant (own medium) while the `world`
 * axis goes WIDE across 12 original alien biomes. AXIS-CLEAN: world owns BIOME,
 * cosmic_sky owns the OVERHEAD celestial wonder (the signature axis), flora owns
 * plant-life (×2), palette owns COLOR, atmosphere owns LIGHT+AIR; terrain_glow /
 * life_accent / wonder_structure / dream_event are independent gated layers.
 *
 * THIS variant (far-eden) = the HYPERREAL cinematic medium (dreambot_eden_hyperreal).
 * Its sibling `far-eden-soft` shares this archetype + the SAME eden_* pools and the
 * same look-neutral template, differing ONLY in medium (painterly). Kevin approved
 * BOTH looks (2026-06-28), so both ship as permanent paths.
 *
 * Config (index.js): code-only medium (no DB row) + flux-1.1 pair model roll
 * (flux-dev + flux-2 family ruled out); excluded from the look-rotation; skips
 * chaos + two-pass-polish; on the flat posting rotation.
 *
 * Archetype + template: DREAMBOT_FAR_EDEN (archetypes.js + archetype-templates.js).
 */

module.exports = {
  archetype: 'DREAMBOT_FAR_EDEN',
  pools: {
    world: 'EDEN_WORLD',
    cosmic_sky: 'EDEN_COSMIC_SKY',
    flora: 'EDEN_FLORA',
    palette: 'EDEN_PALETTE',
    atmosphere: 'EDEN_ATMOSPHERE',
    // independent conditional layers (see archetype.conditionalLayers)
    terrain_glow: 'EDEN_TERRAIN_GLOW', // ~50% gate
    life_accent: 'EDEN_LIFE_ACCENT', // ~28% gate
    wonder_structure: 'EDEN_WONDER_STRUCTURE', // ~30% gate
    dream_event: 'EDEN_DREAM_EVENT', // ~30% gate
  },
};
