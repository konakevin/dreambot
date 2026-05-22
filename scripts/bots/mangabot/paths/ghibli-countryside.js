/**
 * MangaBot ghibli-countryside path — axis-system migration 2026-05-22.
 *
 * Studio Ghibli pastoral wonder — Totoro / Kiki / Mononoke / Spirited-Away /
 * Whisper of the Heart aesthetic. HAND-PAINTED oil-watercolor brushwork, soft
 * warm pastoral palette. 14 path-bespoke axes (13 always-on + spirit_element
 * conditionally gated at 40% — Ghibli sometimes has visible magic, sometimes
 * pure pastoral, that variability is genre-defining).
 *
 * See archetypes.js for the slot list + archetype-templates.js for the brief.
 */

module.exports = {
  archetype: 'MANGABOT_GHIBLI_COUNTRYSIDE',
  pools: {
    scene_type: 'GHIBLI_SCENE_TYPE',
    landscape_setting: 'GHIBLI_LANDSCAPE_SETTING',
    architectural_anchor: 'GHIBLI_ARCHITECTURAL_ANCHOR',
    character_role: 'GHIBLI_CHARACTER_ROLE',
    action_moment: 'GHIBLI_ACTION_MOMENT',
    wildflower_garden: 'GHIBLI_WILDFLOWER_GARDEN',
    weather_air: 'GHIBLI_WEATHER_AIR',
    light_quality: 'GHIBLI_LIGHT_QUALITY',
    time_of_day: 'GHIBLI_TIME_OF_DAY',
    emotional_dna: 'GHIBLI_EMOTIONAL_DNA',
    camera_framing: 'GHIBLI_CAMERA_FRAMING',
    story_prop: 'GHIBLI_STORY_PROP',
    background_detail: 'GHIBLI_BACKGROUND_DETAIL',
    spirit_element: 'GHIBLI_SPIRIT_ELEMENT',
  },
};
