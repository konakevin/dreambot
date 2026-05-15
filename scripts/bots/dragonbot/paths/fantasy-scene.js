/**
 * DragonBot fantasy-scene path — declarative form (2026-05-14).
 *
 * A single fantasy character integrated into an epic magical landscape,
 * engaged with the magic / setting (not posed).
 *
 * Path-bespoke pools:
 *   - character: FANTASY_CHARACTERS (reused legacy 200-entry pool)
 *   - landscape: FANTASY_LANDSCAPES (reused legacy 280-entry pool)
 *   - action: FANTASY_SCENE_ACTION (new 50-entry MVP)
 *   - drama: FANTASY_SCENE_DRAMA (new 30-entry, 40%-gated)
 *
 * Pre-refactor file preserved at paths/legacy/fantasy-scene.js.
 */

module.exports = {
  archetype: 'FANTASY_SCENE',
  pools: {
    character: 'FANTASY_CHARACTERS',
    landscape: 'FANTASY_LANDSCAPES',
    action: 'FANTASY_SCENE_ACTION',
    drama: 'FANTASY_SCENE_DRAMA',
  },
};
