/**
 * MangaBot samurai-era path — axis-system migration 2026-05-22.
 *
 * Historical Japan / jidaigeki — Mononoke / Demon-Slayer / Rurouni-Kenshin /
 * Vagabond aesthetic. 12 path-bespoke axes (10 R0 + 2 R1 narrative-richness:
 * story_prop + background_detail) decompose the legacy SAMURAI_SCENES baked-scene
 * pool into composable parts so every render lands all 8 components of a
 * memorable scene (monumental anchor, multi-tier depth, scale provers,
 * narrative beat, readable focus, material truth, light drama, emotional DNA).
 *
 * See archetypes.js for the slot list + archetype-templates.js for the brief.
 */

module.exports = {
  archetype: 'MANGABOT_SAMURAI_ERA',
  pools: {
    scene_type: 'SAMURAI_SCENE_TYPE',
    landscape_setting: 'SAMURAI_LANDSCAPE_SETTING',
    architectural_anchor: 'SAMURAI_ARCHITECTURAL_ANCHOR',
    character_role: 'SAMURAI_CHARACTER_ROLE',
    action_moment: 'SAMURAI_ACTION_MOMENT',
    atmospheric_element: 'SAMURAI_ATMOSPHERIC_ELEMENT',
    light_drama: 'SAMURAI_LIGHT_DRAMA',
    time_of_day: 'SAMURAI_TIME_OF_DAY',
    emotional_dna: 'SAMURAI_EMOTIONAL_DNA',
    camera_framing: 'SAMURAI_CAMERA_FRAMING',
    story_prop: 'SAMURAI_STORY_PROP',
    background_detail: 'SAMURAI_BACKGROUND_DETAIL',
  },
};
