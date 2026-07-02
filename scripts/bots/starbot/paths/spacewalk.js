/**
 * StarBot spacewalk path — declarative form (2026-06-09, NEW).
 *
 * The iconic ZERO-G EVA shot: a lone suited figure floating in open
 * vacuum, the curve of a world / a blazing star / a colossal hull behind
 * them. Gravity / 2001 / Interstellar film-still tradition. BOTH the
 * figure (suit + visor reflection + gear) AND the void environment
 * (planet curve / nebula / structure) are co-heroes, fully detailed.
 *
 * Gender-neutral — the figure is sealed in a suit, no DNA stack. Uses the
 * bot default starbot_hyperreal medium (photoreal cinematic film-still).
 *
 * See:
 *   - scripts/bots/starbot/archetypes.js          (SPACEWALK slots)
 *   - scripts/bots/starbot/archetype-templates.js (SPACEWALK brief template)
 *   - scripts/lib/brief-composer.js               (resolution + assembly)
 *
 * Pools are MVP-25 (2026-06-09) — seed-test-then-scale per Kevin's mandate.
 */

module.exports = {
  archetype: 'SPACEWALK',
  pools: {
    // Path override of the universal lighting axis — sunlit-bright only
    // (2026-07-01 reference calibration; the universal pool rolled gloom).
    lighting: 'SPACEWALK_LIGHTING',
    suit: 'SPACEWALK_SUIT',
    eva_action: 'SPACEWALK_EVA_ACTION',
    visor_reflection: 'SPACEWALK_VISOR_REFLECTION',
    void_backdrop: 'SPACEWALK_VOID_BACKDROP',
    nearby_structure: 'SPACEWALK_NEARBY_STRUCTURE',
    suit_detail: 'SPACEWALK_SUIT_DETAIL',
    // conditional layer (50% gate)
    cosmic_event: 'SPACEWALK_COSMIC_EVENT',
  },
};
