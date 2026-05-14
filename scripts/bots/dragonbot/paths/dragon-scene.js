/**
 * DragonBot dragon-scene path — declarative form (2026-05-14).
 *
 * First DragonBot path migrated to the new bespoke biome+axes system.
 * Western dragon is the SUBJECT in a jaw-dropping fantasy landscape.
 * NO characters/riders/humans.
 *
 * Path-bespoke pools (5 × 30 entries = Stage 1 MVP):
 *   - dragon: DRAGON_SCENE_DRAGON (Western dragon anatomy + visual identity)
 *   - action: DRAGON_SCENE_ACTION (mid-action cinematic moment)
 *   - landscape: DRAGON_SCENE_LANDSCAPE (epic fantasy biome)
 *   - drama: DRAGON_SCENE_DRAMA (40% gated environmental event)
 *   - surprise_element: DRAGON_SCENE_SURPRISE_ELEMENT (tiny secondary subject)
 *
 * Pre-refactor file preserved at paths/legacy/dragon-scene.js.
 *
 * See:
 *   - scripts/lib/archetypes.js          (DRAGON_SCENE slot definitions)
 *   - scripts/lib/archetype-templates.js (DRAGON_SCENE brief template)
 *   - scripts/bots/dragonbot/index.js    (promptPrefixByPath wrapper)
 *   - BOT_SCENE_QUALITY_PLAYBOOK.md      (architecture decision record)
 */

module.exports = {
  archetype: 'DRAGON_SCENE',
  pools: {
    dragon: 'DRAGON_SCENE_DRAGON',
    action: 'DRAGON_SCENE_ACTION',
    landscape: 'DRAGON_SCENE_LANDSCAPE',
    drama: 'DRAGON_SCENE_DRAMA', // 40% gated conditional
    surprise_element: 'DRAGON_SCENE_SURPRISE_ELEMENT',
  },
};
