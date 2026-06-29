/**
 * DreamBot pulp-femme path (2026-06-29) — the female star of the shared retro pulp
 * sci-fi COMEDY universe (sibling of pulp-hero). The character is decomposed into
 * independent trait axes (being + hair_color + femme_hairstyle + femme_outfit +
 * femme_pose) over a shared retro spacescape (world) + cosmic backdrop (sky), with a
 * ~70%-gated wild-prop sight-gag. Female traits are FEMALE-ONLY pools so no
 * androgynous wording bleeds across. Shared PULP_MEDIUM; excluded from the
 * look-rotation; flux-1.1 pair; skips chaos + two-pass-polish.
 */
module.exports = {
  archetype: 'DREAMBOT_PULP_FEMME',
  pools: {
    being: 'PULP_BEING',
    hair_color: 'PULP_HAIR_COLOR',
    femme_hairstyle: 'PULP_FEMME_HAIRSTYLE',
    femme_outfit: 'PULP_FEMME_OUTFIT',
    femme_pose: 'PULP_FEMME_POSE',
    world: 'PULP_WORLD',
    sky: 'PULP_SKY',
    lighting: 'PULP_LIGHTING',
    shot: 'PULP_SHOT',
    prop: 'PULP_PROP', // ~70% gated conditional layer
    gag: 'PULP_GAG', // ~70% gated conditional layer
  },
};
