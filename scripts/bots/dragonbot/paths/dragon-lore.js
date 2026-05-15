/**
 * DragonBot dragon-lore path — archaeological-fantasy evidence of dragons.
 *
 * Migrated 2026-05-14 from legacy function-based slot-pool form to
 * declarative 5-axis bespoke system. The dragons are GONE — their
 * presence echoes everywhere. Mood: WONDER + MELANCHOLY + REVERENCE +
 * LOST GRANDEUR. UNLIKE landscape path, tiny figures (scholars /
 * explorers / archaeologists / pilgrims) ARE permitted as scale-provers
 * and mood-setters.
 *
 * 5 path-bespoke pools (mirror of landscape's pattern):
 *   - scene: DRAGON_LORE_SCENE (the lore beat — skeleton / mural /
 *     hoard / egg / temple / outpost)
 *   - architecture: DRAGON_LORE_ARCHITECTURE (dragon-themed structure)
 *   - phenomenon: DRAGON_LORE_PHENOMENON (80% gated atmospheric event)
 *   - surprise_element: DRAGON_LORE_SURPRISE_ELEMENT (tiny figure or
 *     wildlife or abandoned artifact)
 *   - sky_layer: DRAGON_LORE_SKY (overhead atmospheric element)
 *
 * Plus universal lighting + atmosphere from bot defaults.
 */

module.exports = {
  archetype: 'DRAGONBOT_DRAGON_LORE',
  pools: {
    scene: 'DRAGON_LORE_SCENE',
    architecture: 'DRAGON_LORE_ARCHITECTURE',
    phenomenon: 'DRAGON_LORE_PHENOMENON',
    surprise_element: 'DRAGON_LORE_SURPRISE_ELEMENT',
    sky_layer: 'DRAGON_LORE_SKY',
  },
};
