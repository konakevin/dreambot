/**
 * ChibiBot rainy-interior path — full-bespoke axis-system (2026-05-19).
 *
 * SETTING-AS-HERO indoor path. A warm cozy room is the hero, with a
 * MANDATORY rainy window showing dim blue-grey exterior — the warm-amber
 * inside vs cool-grey outside contrast carries the emotional anchor.
 * One SOLO resident creature adds story-driven life. Pixar / Studio Ghibli
 * / Howl's-Moving-Castle / Beatrix-Potter painterly cozy-interior aesthetic.
 *
 * Pixar-medium-locked (mediumByPath) — same painterly storybook register
 * as cozy-landscape.
 *
 * Axes (11 total):
 *   Universal (bot.defaultPools): lighting, atmosphere, weather
 *   Path-bespoke: creature (unified pool, unfiltered) + resident_activity
 *     + room + room_detail (pickN:3) + window_view + time_of_day +
 *     surprise_element + phenomenon (template-gated 60%)
 *
 * Two-pass polish disabled (twoPassPolish.skipPaths) — setting + window
 * + creature all need full brief intact.
 */

module.exports = {
  archetype: 'CHIBIBOT_RAINY_INTERIOR',
  pools: {
    creature_group: { name: 'CUTE_CREATURES_UNIFIED' },
    group_activity: 'RAINY_INTERIOR_RESIDENT_ACTIVITIES',
    setting: 'RAINY_INTERIOR_ROOMS',
    setting_detail: 'RAINY_INTERIOR_ROOM_DETAILS',
    time_of_day: 'RAINY_INTERIOR_TIME_OF_DAY',
    surprise_element: 'RAINY_INTERIOR_SURPRISE_ELEMENTS',
    phenomenon: 'RAINY_INTERIOR_PHENOMENA',
  },
};
