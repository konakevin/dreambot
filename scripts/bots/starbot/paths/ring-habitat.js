/**
 * StarBot ring-habitat path — declarative form (2026-06-09, NEW).
 *
 * The INTERIOR of a colossal rotating space habitat (O'Neill cylinder /
 * ring-world / Stanford torus). The jaw-dropping shot where the landscape
 * curves UP both walls and arcs OVER the sky — the far side of the world
 * hangs upside-down overhead. A glowing axial sun-line lights an enclosed
 * world of cities, farms, rivers wrapped around a spinning drum.
 *
 * Scene-led — the HABITAT is the hero; tiny scale-provers sell the scale.
 * Uses the bot default starbot_hyperreal medium (photoreal cinematic vista).
 *
 * See:
 *   - scripts/bots/starbot/archetypes.js          (RING_HABITAT slots)
 *   - scripts/bots/starbot/archetype-templates.js (RING_HABITAT brief template)
 *
 * Pools are MVP-25 (2026-06-09) — seed-test-then-scale per Kevin's mandate.
 */

module.exports = {
  archetype: 'RING_HABITAT',
  pools: {
    habitat_zone: 'RING_HABITAT_ZONE',
    curve_overhead: 'RING_HABITAT_CURVE',
    axis_light: 'RING_HABITAT_AXIS_LIGHT',
    endcap: 'RING_HABITAT_ENDCAP',
    habitat_detail: 'RING_HABITAT_DETAIL',
    scale_prover: 'RING_HABITAT_SCALE_PROVER',
    // conditional layer (40% gate)
    habitat_event: 'RING_HABITAT_EVENT',
  },
};
