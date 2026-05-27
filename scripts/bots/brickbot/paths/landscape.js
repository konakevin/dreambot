/**
 * BrickBot landscape path — declarative axis-system form (2026-05-27).
 *
 * Seventh BrickBot path migrated. EPIC NATURAL-VISTA all-brick MOC
 * photography — mountain ranges, glacier valleys, redwood groves, desert
 * canyons, coastal cliffs, alpine meadows, mesas, river deltas, fjords.
 *
 * Bespoke design (per BRICKBOT_LANDSCAPE archetype): this path is
 * SCENERY-LED, not character/structure-led — the vista is the hero and
 * minifigs are tiny scale-provers. So it has NO minifig-action axis and
 * NO LEGO-faction register (a mountain has no faction). Instead:
 *   • biome_vista — the hero subject (which monumental brick landform)
 *   • terrain_build_technique — the anti-photoreal star axis (epic-landscape
 *     is Flux's strongest photoreal pull; this + the template's per-element
 *     brick mandate are load-bearing)
 *   • scale_prover (pickN:2) — tiny figures/elements at different depths that
 *     prove the monumental scale
 *   • flora_detail / camera_framing / atmosphere / lighting / palette
 *   • natural_phenomenon — 50%-gated dramatic brick event
 * Every pool bans photoreal-terrain/rock/water/snow + fluid-motion verbs.
 *
 * No deep-focus promptPrefixByPath — keeps tilt-shift (playbook Lesson 1).
 * Legacy function-form preserved at paths/legacy/landscape.js.
 */

module.exports = {
  archetype: 'BRICKBOT_LANDSCAPE',
  pools: {
    biome_vista: 'BRICKBOT_LANDSCAPE_BIOME_VISTA',
    terrain_build_technique: 'BRICKBOT_LANDSCAPE_TERRAIN_BUILD_TECHNIQUE',
    scale_prover: 'BRICKBOT_LANDSCAPE_SCALE_PROVER',
    flora_detail: 'BRICKBOT_LANDSCAPE_FLORA_DETAIL',
    camera_framing: 'BRICKBOT_LANDSCAPE_CAMERA_FRAMING',
    atmosphere: 'BRICKBOT_LANDSCAPE_ATMOSPHERE',
    lighting: 'BRICKBOT_LANDSCAPE_LIGHTING',
    palette: 'BRICKBOT_LANDSCAPE_PALETTE',
    natural_phenomenon: 'BRICKBOT_LANDSCAPE_NATURAL_PHENOMENON', // 50%-gated conditional
  },
};
