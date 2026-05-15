/**
 * DragonBot arcane-spaces path — declarative form (2026-05-15).
 *
 * Sister path to arcane-halls. Grand magical INTERIOR SPACES — vast
 * architectural marvels with obsessive magic-density saturating the
 * room. NO CHARACTERS — pure environment. Architecture is the subject;
 * magic phenomena fill every quadrant.
 *
 * Reuses production-scale pools shared with arcane-halls:
 *   - hall: ARCANE_HALL (200 entries)
 *   - magic_phenomena: ARCANE_HALL_PHENOMENA (100 entries, pickN: 3)
 *
 * Distinct from arcane-halls (which now centers a spellcaster). This
 * path is the pure no-character grand-architecture-with-magic-overload
 * version Kevin hearted in the ah-r2-broad batch.
 */

module.exports = {
  archetype: 'ARCANE_SPACES',
  pools: {
    hall: 'ARCANE_HALL',
    magic_phenomena: 'ARCANE_HALL_PHENOMENA',
  },
};
