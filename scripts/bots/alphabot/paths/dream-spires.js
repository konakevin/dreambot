/**
 * DreamBot dream-spires path — scene-as-hero whimsical fairytale TOWER-CITY
 * (2026-06-27).
 *
 * Reference (relmseeker "Seuss-inspired" set): an impossible whimsical tower-city
 * of absurdly tall, slender, TWISTING candy-pastel spiral towers — stacked round
 * golden-lit windows + balconies, chimney-pots puffing steam, winding external
 * staircases + arched skywalk-bridges, flowering potted railings, under pastel
 * golden-hour / dusk skies with hazy depth to a horizon of more spires. NO
 * character; the WHIMSICAL TOWER-CITY itself is the hero. DreamBot is a wildcard
 * bot, so this path is NOT bound to the chibi-creature identity or vinyl mediums.
 *
 * Built the playbook way (axis system, scene-as-hero, LEAN axes because the hero
 * is rich — OceanBot lesson). The LOOK is held constant (own painterly-storybook
 * medium, matching the dreamscape path's feed look) while the spire_world axis
 * goes WIDE across ~12 whimsical tower-world formations — so 200 seeds don't all
 * read as one Seuss street. EXTERIOR VISTAS ONLY (Kevin: dropped the cozy
 * interior-looking-out POV). AXIS-CLEAN: spire_world owns the FORMATION+STYLE,
 * palette owns COLOR, vantage owns the exterior CAMERA, charm_details own the
 * signature charm layer, light_sky owns LIGHT+SKY, whimsy owns the dream element.
 *
 * Config (index.js): own `dreambot_spires` medium (code-only, no DB row) +
 * flux-1.1-pro-ultra lock; excluded from the look-rotation; skips chaos +
 * two-pass-polish (protect the hero composition).
 *
 * Archetype + template: DREAMBOT_DREAM_SPIRES (archetypes.js + archetype-templates.js).
 */

module.exports = {
  archetype: 'DREAMBOT_DREAM_SPIRES',
  pools: {
    spire_world: 'DREAM_SPIRES_WORLD',
    palette: 'DREAM_SPIRES_PALETTE',
    vantage: 'DREAM_SPIRES_VANTAGE',
    charm_details: 'DREAM_SPIRES_CHARM',
    light_sky: 'DREAM_SPIRES_LIGHT',
    // independent conditional layer (see archetype.conditionalLayers)
    whimsy: 'DREAM_SPIRES_WHIMSY', // ~40% gate
  },
};
