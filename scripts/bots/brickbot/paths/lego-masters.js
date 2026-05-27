/**
 * BrickBot lego-masters path — declarative axis-system form (2026-05-27).
 *
 * Thirteenth (final) BrickBot path migrated. THE COMPETITION-FINALE SHOWCASE
 * path — a single dramatic narrative hero build, theatrically lit (spotlight +
 * haze + base-glow), frozen at its story-climax, on a turntable.
 *
 * Bespoke design (per BRICKBOT_LEGO_MASTERS archetype): identity = theatrical
 * finale presentation + story-climax, NOT a theme. Bespoke axes:
 * narrative_concept (story premise) + dramatic_beat (the frozen climactic
 * instant) + build_technique (cutaway / dynamic-motion / trans-effect-
 * integration / gravity-defying armature) + centerpiece_subject (dragon /
 * kraken / volcano / collapsing-tower) + story_figures (minifigs mid-peril) +
 * finale-reveal lighting (the signature) + dramatic_effect (50%). May re-use
 * motifs from other paths — the identity is the THEATRICAL PRESENTATION. Bans
 * photoreal/CGI.
 *
 * No deep-focus promptPrefixByPath — keeps tilt-shift (playbook Lesson 1).
 * Legacy function-form preserved at paths/legacy/lego-masters.js.
 */

module.exports = {
  archetype: 'BRICKBOT_LEGO_MASTERS',
  pools: {
    narrative_concept: 'BRICKBOT_LEGO_MASTERS_NARRATIVE_CONCEPT',
    dramatic_beat: 'BRICKBOT_LEGO_MASTERS_DRAMATIC_BEAT',
    build_technique: 'BRICKBOT_LEGO_MASTERS_BUILD_TECHNIQUE',
    camera_framing: 'BRICKBOT_LEGO_MASTERS_CAMERA_FRAMING',
    centerpiece_subject: 'BRICKBOT_LEGO_MASTERS_CENTERPIECE_SUBJECT',
    story_figures: 'BRICKBOT_LEGO_MASTERS_STORY_FIGURES',
    lighting: 'BRICKBOT_LEGO_MASTERS_LIGHTING',
    palette: 'BRICKBOT_LEGO_MASTERS_PALETTE',
    dramatic_effect: 'BRICKBOT_LEGO_MASTERS_DRAMATIC_EFFECT', // 50%-gated conditional
  },
};
