/**
 * DragonBot arcane-halls path — declarative form (2026-05-15 pivot).
 *
 * A single spellcaster (mage / cleric / sorceress / druid / warlock /
 * etc.) caught at the apex of their magical moment INSIDE a grand
 * magical interior (cathedral hall / throne room / courtyard /
 * stairwell / vault / banquet hall / etc.). The character is the
 * focal point — MAGIC IS PARAMOUNT, visibly pouring from them and
 * saturating the space.
 *
 * Path-bespoke pools:
 *   - hall: ARCANE_HALL (broad interior types, 30 MVP)
 *   - caster: ARCANE_CASTER (spellcaster characters, 30 MVP)
 *   - spell_moment: ARCANE_SPELL_MOMENT (peak magic effects, 30 MVP)
 *   - magic_phenomena: ARCANE_HALL_PHENOMENA (pickN: 2 ambient room magic)
 *
 * Pre-pivot files preserved under paths/legacy/.
 */

module.exports = {
  archetype: 'ARCANE_HALLS',
  pools: {
    hall: 'ARCANE_HALL',
    caster: 'ARCANE_CASTER',
    spell_moment: 'ARCANE_SPELL_MOMENT',
    magic_phenomena: 'ARCANE_HALL_PHENOMENA',
  },
};
