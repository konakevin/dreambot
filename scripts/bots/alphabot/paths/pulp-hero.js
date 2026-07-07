/**
 * DreamBot pulp-hero path (2026-06-29) — the male star of the shared retro pulp
 * sci-fi COMEDY universe (sibling of pulp-femme). Same decomposed-character axis
 * system (being + hair_color + hero_hairstyle + hero_outfit + hero_pose) over the
 * shared world + sky, with a ~70%-gated sight-gag. Male traits are MALE-ONLY pools
 * and the template bakes in lean/cool/masculine (never bulky, catsuit, shirtless,
 * flamboyant, effeminate, androgynous). Shared PULP_MEDIUM; excluded from the
 * look-rotation; flux-1.1 pair; skips chaos + two-pass-polish.
 */
module.exports = {
  archetype: 'DREAMBOT_PULP_HERO',
  pools: {
    being: 'PULP_BEING',
    hair_color: 'PULP_HAIR_COLOR',
    hero_hairstyle: 'PULP_HERO_HAIRSTYLE',
    hero_outfit: 'PULP_HERO_OUTFIT',
    hero_pose: 'PULP_HERO_POSE',
    world: 'PULP_WORLD',
    sky: 'PULP_SKY',
    lighting: 'PULP_LIGHTING',
    shot: 'PULP_SHOT',
    prop: 'PULP_PROP', // ~70% gated conditional layer
    gag: 'PULP_GAG', // ~70% gated conditional layer
  },
};
