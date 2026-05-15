/**
 * GothBot gothic-architecture path — declarative form (2026-05-15).
 *
 * STRUCTURE IS THE HERO. The gothic building dominates 80%+ of the
 * frame. Inner-glow leaks from windows / rose-windows / cracks. Ornate
 * architectural detail porn (flying buttresses, rose-windows, pinnacles,
 * crockets, tracery, gargoyles, grotesques, water-spouts). Castlevania /
 * Bloodborne / Crimson-Peak / Berserk lineage. Exterior only.
 *
 * Path-bespoke pools (5 × 30 MVP):
 *   - structure: GOTHBOT_GOTHIC_ARCHITECTURE_STRUCTURE (building hero)
 *   - architectural_detail: GOTHBOT_GOTHIC_ARCHITECTURE_DETAIL (pickN: 3)
 *   - inner_light: GOTHBOT_GOTHIC_ARCHITECTURE_INNER_LIGHT (glow source)
 *   - accent_creature: GOTHBOT_GOTHIC_ARCHITECTURE_ACCENT_CREATURE (80%-gated)
 *   - sky_layer: GOTHBOT_GOTHIC_ARCHITECTURE_SKY
 *
 * Pre-refactor file preserved at paths/legacy/gothic-architecture.js.
 */

module.exports = {
  archetype: 'GOTHBOT_GOTHIC_ARCHITECTURE',
  pools: {
    structure: 'GOTHBOT_GOTHIC_ARCHITECTURE_STRUCTURE',
    architectural_detail: 'GOTHBOT_GOTHIC_ARCHITECTURE_DETAIL',
    inner_light: 'GOTHBOT_GOTHIC_ARCHITECTURE_INNER_LIGHT',
    accent_creature: 'GOTHBOT_GOTHIC_ARCHITECTURE_ACCENT_CREATURE',
    spice_decoration: 'GOTHBOT_GOTHIC_ARCHITECTURE_SPICE',
    sky_layer: 'GOTHBOT_GOTHIC_ARCHITECTURE_SKY',
  },
};
