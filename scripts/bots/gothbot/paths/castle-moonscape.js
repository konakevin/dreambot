/**
 * GothBot castle-moonscape path — declarative form (2026-06-29, new).
 *
 * TWO co-equal heroes: a crazy-beautiful GOTHIC CASTLE / grand HAUNTED HOUSE and
 * a bright FULL MOON dominating the night sky above it. Bonus bats/crows. NO
 * characters — the structure + the moonscape are the show. Castlevania /
 * Crimson-Peak / Hammer-horror / Tim-Burton / classic-haunted-house lineage.
 *
 * Mirrors the castlevania-scene scene-as-hero shape, but ELEVATES the moon to its
 * own hero axis (`moonscape`) and drops spice_decoration. AXIS-CLEAN: structure
 * owns the BUILDING, moonscape owns the MOON, sky_layer owns the rest of the night
 * sky, accent_creature (65%-gated) owns the bats/crows.
 *
 * Path-bespoke pools (6 × 30 MVP, scale after approval):
 *   - structure: GOTHBOT_CASTLE_MOONSCAPE_STRUCTURE (castle/house hero)
 *   - architectural_detail: GOTHBOT_CASTLE_MOONSCAPE_DETAIL (pickN: 3)
 *   - inner_light: GOTHBOT_CASTLE_MOONSCAPE_INNER_LIGHT
 *   - moonscape: GOTHBOT_CASTLE_MOONSCAPE_MOON (the full-moon hero)
 *   - sky_layer: GOTHBOT_CASTLE_MOONSCAPE_SKY
 *   - accent_creature: GOTHBOT_CASTLE_MOONSCAPE_ACCENT_CREATURE (65%-gated bats/crows)
 *
 * Universal: LIGHTING + ATMOSPHERE. Look-enabled (rolls the gothbot look register);
 * routed to gothbot_neutral via mediumByPath; scene model lineup (flux-1.1 pair).
 *
 * Archetype + template: GOTHBOT_CASTLE_MOONSCAPE (archetypes.js + archetype-templates.js).
 */

module.exports = {
  archetype: 'GOTHBOT_CASTLE_MOONSCAPE',
  pools: {
    composition: 'GOTHBOT_CASTLE_MOONSCAPE_COMPOSITION',
    structure: 'GOTHBOT_CASTLE_MOONSCAPE_STRUCTURE',
    architectural_detail: 'GOTHBOT_CASTLE_MOONSCAPE_DETAIL',
    inner_light: 'GOTHBOT_CASTLE_MOONSCAPE_INNER_LIGHT',
    moonscape: 'GOTHBOT_CASTLE_MOONSCAPE_MOON',
    sky_layer: 'GOTHBOT_CASTLE_MOONSCAPE_SKY',
    accent_creature: 'GOTHBOT_CASTLE_MOONSCAPE_ACCENT_CREATURE',
  },
};
