/**
 * GothBot castlevania-scene path — declarative form (2026-05-15 migration).
 *
 * STRICT KONAMI CASTLEVANIA aesthetic. Symphony of the Night / Bloodlines /
 * Lament of Innocence / Curse of Darkness / Order of Ecclesia / Lords of
 * Shadow / Aria of Sorrow visual canon. Ayami Kojima painted concept-art
 * lineage. STRUCTURE IS THE HERO (80%+ visual weight).
 *
 * BOLD + LUSH + FULL-COLOR-SATURATED palette mandate — royal violet,
 * deep crimson, sapphire, gold-leaf, emerald, amber.
 *
 * Path-bespoke pools (6 × 30 MVP, scale to production after approval):
 *   - structure: GOTHBOT_CASTLEVANIA_SCENE_STRUCTURE
 *   - architectural_detail: GOTHBOT_CASTLEVANIA_SCENE_DETAIL (pickN: 3)
 *   - inner_light: GOTHBOT_CASTLEVANIA_SCENE_INNER_LIGHT
 *   - accent_creature: GOTHBOT_CASTLEVANIA_SCENE_ACCENT_CREATURE (80%-gated)
 *   - spice_decoration: GOTHBOT_CASTLEVANIA_SCENE_SPICE
 *   - sky_layer: GOTHBOT_CASTLEVANIA_SCENE_SKY
 *
 * Universal: LIGHTING + ATMOSPHERES.
 *
 * Pre-refactor file at paths/legacy/castlevania-scene.js.
 */

module.exports = {
  archetype: 'GOTHBOT_CASTLEVANIA_SCENE',
  pools: {
    structure: 'GOTHBOT_CASTLEVANIA_SCENE_STRUCTURE',
    architectural_detail: 'GOTHBOT_CASTLEVANIA_SCENE_DETAIL',
    inner_light: 'GOTHBOT_CASTLEVANIA_SCENE_INNER_LIGHT',
    accent_creature: 'GOTHBOT_CASTLEVANIA_SCENE_ACCENT_CREATURE',
    spice_decoration: 'GOTHBOT_CASTLEVANIA_SCENE_SPICE',
    sky_layer: 'GOTHBOT_CASTLEVANIA_SCENE_SKY',
  },
};
