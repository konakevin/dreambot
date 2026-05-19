/**
 * ChibiBot cuddly-aquatic path — full-bespoke axis-system (2026-05-19).
 *
 * Pair of impossibly cute baby aquatic creatures cuddling in their underwater
 * / surface-water habitat. Sea otter pups holding paws, baby seals on ice,
 * hermit-crab anemone villages, jellyfish-blanket octopuses, axolotl tea
 * rooms. Pixar/Sanrio/Ghibli/Finding-Nemo cuteness.
 *
 * UNLIKE other ChibiBot paths, creature_2 is ALWAYS-ON (no 70% gate) — this
 * path's identity IS the cuddling pair. Bespoke axes per BOT_SCENE_QUALITY_PLAYBOOK.
 *
 * Axes (10 total):
 *   Universal (bot.defaultPools): lighting, atmosphere, weather
 *   Reused from heartwarming-scene: time_of_day (HEARTWARMING_TIME_OF_DAY)
 *   Path-bespoke: creature_1, creature_2 (BOTH always present), interaction,
 *                 setting, surprise_element, phenomenon
 *   Template-gated 60%: phenomenon (drama / magical event)
 *
 * Two-pass polish disabled (bot.twoPassPolish.skipPaths) — setting is a
 * co-hero, polish compression strips habitat language.
 */

// cuddly-aquatic filters the unified creature pool to MARINE-tagged creatures
// (children + magical-realm with ANY tag also match). FANTASY+MARINE entries
// like sea-dragons / mermaids land in the marine bucket via their MARINE tag.
module.exports = {
  archetype: 'CHIBIBOT_CUDDLY_AQUATIC',
  pools: {
    creature_1: { name: 'CUTE_CREATURES_UNIFIED', tags: ['MARINE'] },
    creature_2: { name: 'CUTE_CREATURES_UNIFIED', tags: ['MARINE'] },
    interaction: 'CUDDLY_AQUATIC_INTERACTIONS',
    setting: 'CUDDLY_AQUATIC_SETTINGS',
    time_of_day: 'HEARTWARMING_TIME_OF_DAY',
    surprise_element: 'CUDDLY_AQUATIC_SURPRISE_ELEMENTS',
    phenomenon: 'CUDDLY_AQUATIC_PHENOMENA',
  },
};
