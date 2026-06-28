/**
 * DreamBot hidden-conservatory path — scene-as-hero stained-glass GREENHOUSE
 * INTERIOR (2026-06-28).
 *
 * Reference (benmyhre "Stained Glass Greenhouses"): a lush, overgrown botanical
 * garden growing INSIDE a grand stained-glass cathedral / Victorian conservatory,
 * where sunlight pours through jewel-toned glass and SHATTERS into rainbow
 * prismatic light splashed across the plants, the path, and the air. The room
 * itself is the hero; no character. DreamBot is a wildcard bot, so this path is
 * NOT bound to the chibi identity.
 *
 * Built the playbook way off the dreamscape/far-eden scene-as-hero shape, but as
 * an INTERIOR. The mood ROLLS the full range (moody-dark ↔ bright) via the
 * atmosphere axis (Kevin's call) — the dark dramatic backdrop is load-bearing for
 * the prism-light contrast, so it's kept, but the glass + flowers + refracted
 * light stay VIVID so it reads pretty, not grim. AXIS-CLEAN: conservatory owns the
 * ARCHITECTURE, glass_palette owns the GLASS COLOR, flora owns plant-life (×2),
 * light_effect owns the PRISMATIC REFRACTION (the signature money-shot axis),
 * vantage owns the interior CAMERA, atmosphere owns LIGHT-QUALITY+MOOD+AIR;
 * water_feature / architectural_detail / ambient_life are gated layers.
 *
 * Config (index.js): own `dreambot_conservatory` photoreal-cinematic medium
 * (code-only, no DB row) + flux-1.1 pair model roll; excluded from the
 * look-rotation; skips chaos + two-pass-polish (protect the hero composition).
 *
 * Archetype + template: DREAMBOT_HIDDEN_CONSERVATORY (archetypes.js +
 * archetype-templates.js).
 */

module.exports = {
  archetype: 'DREAMBOT_HIDDEN_CONSERVATORY',
  pools: {
    conservatory: 'CONSERVATORY_ARCH',
    glass_palette: 'CONSERVATORY_GLASS',
    flora: 'CONSERVATORY_FLORA',
    light_effect: 'CONSERVATORY_LIGHT',
    vantage: 'CONSERVATORY_VANTAGE',
    atmosphere: 'CONSERVATORY_ATMOSPHERE',
    // independent conditional layers (see archetype.conditionalLayers)
    water_feature: 'CONSERVATORY_WATER', // ~35% gate
    architectural_detail: 'CONSERVATORY_DETAIL', // ~40% gate
    ambient_life: 'CONSERVATORY_LIFE', // ~22% gate
  },
};
