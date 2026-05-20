/**
 * ChibiBot cozy-landscape path — full-bespoke axis-system (2026-05-19).
 *
 * SETTING-AS-HERO path. A magical miniature cozy WORLD (mushroom village /
 * acorn cottage / wildflower meadow / beach cove / market square / treehouse
 * / cliffside cottage / canal-bridge village) is the hero of the frame. ONE
 * SOLO tiny resident creature adds story-driven life without stealing focus.
 * Pixar / Studio Ghibli / Beatrix Potter / tilt-shift cozy aesthetic.
 *
 * UNLIKE pair-bond paths — only ONE creature; no pair-guard, no creature_2.
 *
 * Axes (11 total):
 *   Universal (bot.defaultPools): lighting, atmosphere, weather
 *   Path-bespoke: creature (unified pool, unfiltered), resident_activity,
 *     world, world_detail (pickN:3), time_of_day, surprise_element, phenomenon
 *   Template-gated 60%: phenomenon
 *
 * Two-pass polish disabled — world + atmospheric detail need full brief intact.
 */

module.exports = {
  archetype: 'CHIBIBOT_COZY_LANDSCAPE',
  pools: {
    creature: { name: 'CUTE_CREATURES_UNIFIED' },
    resident_activity: 'COZY_LANDSCAPE_RESIDENT_ACTIVITIES',
    world: 'COZY_LANDSCAPE_WORLDS',
    world_detail: 'COZY_LANDSCAPE_WORLD_DETAILS',
    time_of_day: 'COZY_LANDSCAPE_TIME_OF_DAY',
    surprise_element: 'COZY_LANDSCAPE_SURPRISE_ELEMENTS',
    phenomenon: 'COZY_LANDSCAPE_PHENOMENA',
  },
};
