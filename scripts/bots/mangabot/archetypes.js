/**
 * mangabot archetypes — path-bespoke archetype definitions.
 *
 * Each archetype declares which axis slots the path requires + how many
 * to pick per slot. The composer reads this and assembles a brief per
 * the corresponding archetype template in ./archetype-templates.js.
 *
 * Auto-discovered by scripts/lib/archetypeRegistry.js.
 *
 * To add a new archetype: add an entry here + the matching template
 * function in ./archetype-templates.js + reference it from one of the
 * bot's path files via { archetype: 'YOUR_NAME', pools: {...} }.
 */

module.exports = {
  MANGABOT_SAMURAI_ERA: {
    description:
      'PATH-BESPOKE — MangaBot samurai-era (2026-05-22 axis-system migration). Historical Japan / jidaigeki — Mononoke / Demon-Slayer / Rurouni-Kenshin / Vagabond aesthetic. Decouples the legacy SAMURAI_SCENES baked-scene pool into 10 composable axes so renders get true multi-tier depth + monumental anchors + scale provers + variety. Every render is a keyframe still: composition lead + monumental architectural anchor + figure mid-action + atmospheric motion + cinematic light.',
    slots: {
      universal: [],
      bot: [],
      path: [
        'scene_type',
        'landscape_setting',
        'architectural_anchor',
        'character_role',
        'action_moment',
        'atmospheric_element',
        'light_drama',
        'time_of_day',
        'emotional_dna',
        'camera_framing',
        'story_prop',
        'background_detail',
      ],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },
};
