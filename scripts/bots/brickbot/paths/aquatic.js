/**
 * BrickBot aquatic path — declarative axis-system form (2026-05-27).
 *
 * Fifth BrickBot path migrated to the bespoke axis composer. BEACH (surface)
 * + UNDERWATER (submerged) LEGO MOC diorama photography — tropical-paradise
 * coast AND the submerged reef/kelp/trench world.
 *
 * Bespoke design (per BRICKBOT_AQUATIC archetype): aquatic's defining trait
 * is its SURFACE↔SUBMERGED duality, so it gets two axes the other paths don't:
 *   • water_build_technique — the anti-photoreal-water lever: how water, waves,
 *     coral, kelp, sand, and bubbles read as unmistakable BRICK.
 *   • marine_life (pickN:2) — a creature-fill axis populating the reef/beach
 *     with brick-built sea creatures for life, scale, and story.
 * Every pool bans photoreal-water/sand/coral vocab + fluid-motion verbs
 * (rippling/flowing/crashing/lapping) so the trans-blue-plate water reads as
 * plastic, never a real ocean.
 *
 * Axes (10 always-on + 1 conditional):
 *   • scene_type           — SURFACE or SUBMERGED stage (tagged)
 *   • minifig_action       — verb-led aquatic story beat
 *   • water_build_technique — bespoke water/coral/kelp/bubble brick construction
 *   • camera_framing       — aquatic-specific (waterline-split / underwater-up / reef-wall / porthole)
 *   • subject_focus        — STRUCTURE / CREATURE-MOUNT / no-vehicle interior / no-vehicle landscape
 *   • register             — marine heritage lock (~85% iconic LEGO: Atlantis / Aquazone / Deep-Sea / Friends-beach / Creator)
 *   • marine_life (×2)     — bespoke brick-built creature fill
 *   • scene_props          — brick-built diorama detail
 *   • lighting             — caustic / surface-shimmer / sunset / bioluminescent / lighthouse-beam
 *   • palette              — axis-clean LEGO-coded marine palettes
 *   • aquatic_phenomenon   — 50%-gated environmental beat (brick-rendered)
 *
 * No deep-focus promptPrefixByPath — aquatic keeps tilt-shift (Flux's
 * "everything-is-LEGO" structural signal per playbook Lesson 1).
 *
 * Legacy function-form preserved at paths/legacy/aquatic.js.
 */

module.exports = {
  archetype: 'BRICKBOT_AQUATIC',
  pools: {
    scene_type: 'BRICKBOT_AQUATIC_SCENE_TYPE',
    minifig_action: 'BRICKBOT_AQUATIC_MINIFIG_ACTION',
    water_build_technique: 'BRICKBOT_AQUATIC_WATER_BUILD_TECHNIQUE',
    camera_framing: 'BRICKBOT_AQUATIC_CAMERA_FRAMING',
    subject_focus: 'BRICKBOT_AQUATIC_SUBJECT_FOCUS',
    register: 'BRICKBOT_AQUATIC_REGISTER',
    marine_life: 'BRICKBOT_AQUATIC_MARINE_LIFE',
    scene_props: 'BRICKBOT_AQUATIC_SCENE_PROPS',
    lighting: 'BRICKBOT_AQUATIC_LIGHTING',
    palette: 'BRICKBOT_AQUATIC_PALETTE',
    aquatic_phenomenon: 'BRICKBOT_AQUATIC_PHENOMENON', // 50%-gated conditional
  },
};
