/**
 * BrickBot crazy-islands path — the fun/crazy tropical-island SCENE path (2026-05-27).
 *
 * Forked from favorite-towns (→ macro-display's hearted deep-focus state), then
 * fully re-themed to ISLANDS. BrickBot's most playful path: a wide variety of
 * fun / funny / surreal / CRAZY tropical-island happenings (giant brick creatures
 * are just ONE of many ideas — also volcano hijinks, castaway contraptions,
 * pirate/kraken mishaps, monkey heists, runaway sandcastles, seaplane splashdowns,
 * luau chaos, surf spectacle, tiki magic, message-bottle armadas…) PLUS ~35%
 * gorgeous serene tropical views. Readability-first: ONE clear hero idea per
 * scene, clean composition. Keeps the hearted deep-focus look (NOT tilt-shift).
 *
 * Reference (Kevin's hearted examples 2026-05-27): a giant brick parrot over a
 * tropical town; a flame-crested parrot over an island tavern; a serene minifig
 * on a dock over a turquoise lagoon. Mix ≈ 2 fun/crazy : 1 pretty.
 *
 * Lean axis set (no town_genre, no conditional twist — crazy is baked into the
 * scene so each frame stays readable). Deep-focus promptPrefixByPath in index.js.
 */

module.exports = {
  archetype: 'BRICKBOT_CRAZY_ISLANDS',
  pools: {
    island_scene: 'BRICKBOT_CRAZY_ISLANDS_SCENE',
    camera_framing: 'BRICKBOT_CRAZY_ISLANDS_CAMERA_FRAMING',
    time_of_day: 'BRICKBOT_CRAZY_ISLANDS_TIME_OF_DAY',
    life_density: 'BRICKBOT_CRAZY_ISLANDS_LIFE_DENSITY',
    shoreline_edge: 'BRICKBOT_CRAZY_ISLANDS_SHORELINE_EDGE',
    palette: 'BRICKBOT_CRAZY_ISLANDS_PALETTE',
  },
};
