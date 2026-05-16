/**
 * GothBot vampire-girls-2 path — declarative form (2026-05-15 migration).
 *
 * STRICT VAMPIRE bust portraits. DEAD-PALE corpse-skin, HEAVY DARK GOTH
 * MAKEUP, GLOWING eyes radiating inhuman light, DEMONIC tell (fang /
 * clawed fingertip / slit pupil). Stylized dark-fantasy splash painting
 * / gothic horror character art aesthetic.
 *
 * Gender-locked FEMALE. Solo only. Bust framing (40-50% of frame).
 *
 * Reuses 9 existing production-scale vampire pools (all at 100 entries):
 *   - archetype: VAMPIRE_ARCHETYPES
 *   - ethnicity: VAMPIRE_ETHNICITIES
 *   - hair: VAMPIRE_HAIR
 *   - wardrobe: VAMPIRE_WARDROBE
 *   - menace_feature: VAMPIRE_MENACE_FEATURES (unified eye+makeup+skin+demonic-tell)
 *   - composition: VAMPIRE_COMPOSITIONS
 *   - scene: VAMPIRE_SETTINGS
 *   - hero_element: VAMPIRE_KILLER_DETAILS
 *   - lighting: VAMPIRE_LIGHTING
 *
 * Universal: ATMOSPHERES.
 *
 * Template weaves ethnicity + makeup + glow + hair + wardrobe + posture
 * into ONE UNIFIED vampire description (no separate fields for Sonnet to
 * summarize away).
 *
 * Pre-refactor file at paths/legacy/vampire-girls-2.js.
 */

module.exports = {
  archetype: 'GOTHBOT_VAMPIRE_GIRLS_2',
  pools: {
    archetype: 'VAMPIRE_ARCHETYPES',
    ethnicity: 'VAMPIRE_ETHNICITIES',
    hair: 'VAMPIRE_HAIR',
    wardrobe: 'VAMPIRE_WARDROBE',
    menace_feature: 'VAMPIRE_MENACE_FEATURES',
    composition: 'VAMPIRE_COMPOSITIONS',
    scene: 'VAMPIRE_SETTINGS',
    hero_element: 'VAMPIRE_KILLER_DETAILS',
    lighting: 'VAMPIRE_LIGHTING',
  },
};
