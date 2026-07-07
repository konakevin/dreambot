/**
 * ChibiBot night-meadow path — full-bespoke axis-system (2026-05-19).
 *
 * Pair of impossibly cute critters at twilight/night in a meadow/glade/forest-
 * clearing under the stars. Stargazing fox kits, fireflies in mason jars,
 * comet-watching bunnies, moonlit picnics. Pixar/Sanrio/Ghibli/Beatrix-Potter-
 * twilight aesthetic.
 *
 * Axes (11 total):
 *   Universal (bot.defaultPools): lighting, atmosphere, weather
 *   Path-bespoke: creature_1, creature_2 (BOTH always-on, pair-bond identity),
 *                 interaction, setting, time_of_night, prop (pickN:2),
 *                 surprise_element, phenomenon
 *   Template-gated 60%: phenomenon
 *
 * Creature pool: CUTE_CREATURES_UNIFIED (no biome filter — any cute critter
 * fits the night-meadow mood; children + magical-realm with ANY tag also
 * eligible).
 *
 * Two-pass polish disabled (twoPassPolish.skipPaths) — setting + sky are
 * co-heroes; polish compression strips that detail.
 */

module.exports = {
  archetype: 'CHIBIBOT_NIGHT_MEADOW',
  pools: {
    creature_1: { name: 'CUTE_CREATURES_UNIFIED' },
    creature_2: { name: 'CUTE_CREATURES_UNIFIED' },
    interaction: 'NIGHT_MEADOW_INTERACTIONS',
    setting: 'NIGHT_MEADOW_SETTINGS',
    time_of_night: 'NIGHT_MEADOW_TIME_OF_NIGHT',
    prop: 'NIGHT_MEADOW_PROPS',
    surprise_element: 'NIGHT_MEADOW_SURPRISE_ELEMENTS',
    phenomenon: 'NIGHT_MEADOW_PHENOMENA',
  },
};
