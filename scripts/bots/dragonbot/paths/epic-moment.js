/**
 * DragonBot epic-moment path = EPIC CASTLE SCENES (2026-05-14
 * migration + reframing from legacy single-pool form).
 *
 * Vast sweeping cinematic views of jaw-dropping fantasy castles with
 * massive events unfolding at them. 50/50 castle hero + peak event.
 * Wide-shot establishing composition, characters at scale-prover size.
 *
 * Path-bespoke pools (2 × 30 MVP):
 *   - castle: EPIC_CASTLE (vast detailed fantasy castle as hero)
 *   - event: EPIC_CASTLE_EVENT (peak event at/in/above/around castle)
 *
 * Pre-refactor file preserved at paths/legacy/epic-moment.js.
 */

module.exports = {
  archetype: 'EPIC_MOMENT',
  pools: {
    castle: 'EPIC_CASTLE',
    event: 'EPIC_CASTLE_EVENT',
  },
};
