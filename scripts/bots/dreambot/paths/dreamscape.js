/**
 * DreamBot dreamscape path — scene-as-hero candy-fantasy world vista (2026-06-27).
 *
 * The reference (aida_ai_pro): a lush, hyper-saturated candy-colored fantasy
 * WORLD — oversized pom-pom/flower flora + whimsical fairytale architecture +
 * a reflective stream winding to a glowing twilight horizon. NO bubble-bot, NO
 * central character — the WORLD itself is the hero (rare tiny ambient creatures
 * only, gated low). DreamBot is a wildcard bot, so this path is NOT bound to the
 * chibi-creature identity or the vinyl/pixar mediums.
 *
 * Built the playbook way (axis system, scene-as-hero): the LOOK is held constant
 * (own cinematic-fantasy medium + candy palette + dreamy light) while the WORLD
 * axis goes WIDE across ~12 fantastical candy-biomes — so 200 seeds don't all
 * read as "flower stream." AXIS-CLEAN: palette owns COLOR, atmosphere owns LIGHT,
 * sky owns OVERHEAD, world owns the BIOME.
 *
 * Config (index.js): own `dreambot_dreamscape` medium (code-only, no DB row) +
 * flux-1.1-pro-ultra lock; excluded from the look-rotation; skips chaos +
 * two-pass-polish (protect the hero composition).
 *
 * Archetype + template: DREAMBOT_DREAMSCAPE (archetypes.js + archetype-templates.js).
 */

module.exports = {
  archetype: 'DREAMBOT_DREAMSCAPE',
  pools: {
    world: 'DREAMSCAPE_WORLD',
    flora: 'DREAMSCAPE_FLORA',
    foreground: 'DREAMSCAPE_FOREGROUND',
    palette: 'DREAMSCAPE_PALETTE',
    atmosphere: 'DREAMSCAPE_ATMOSPHERE',
    sky: 'DREAMSCAPE_SKY',
    // independent conditional layers (see archetype.conditionalLayers)
    whimsical_structure: 'DREAMSCAPE_STRUCTURE', // ~60% gate
    dream_event: 'DREAMSCAPE_EVENT', // ~40% gate
    tiny_creature: 'DREAMSCAPE_CREATURE', // ~22% gate
  },
};
