/**
 * SteamBot steampunk-scene — declarative composer form.
 *
 * Migrated 2026-05-15 to canonical character-in-scene shape. Role-based
 * steampunk character (clockwork magistrate / sky-nomad / weather-
 * prognosticator / etc.) integrated into a wildly imaginative Victorian-
 * industrial landscape. The LANDSCAPE is the co-hero; the character is a
 * story-anchor at MEDIUM scale (15-25% of frame).
 *
 * 5-axis split: 3 path-bespoke (character / landscape / surprise_element)
 * + 1 conditional 40%-gated (event) + 2 universal (lighting / atmosphere).
 * Reuses production-scale 200-entry STEAMPUNK_CHARACTERS + 199-entry
 * STEAMPUNK_LANDSCAPES pools.
 *
 * Pre-rewrite preserved at paths/legacy/steampunk-scene.js.
 */

module.exports = {
  archetype: 'STEAMBOT_STEAMPUNK_SCENE',
  pools: {
    character: 'STEAMPUNK_CHARACTERS',
    landscape: 'STEAMPUNK_LANDSCAPES',
    surprise_element: 'STEAMPUNK_SCENE_SURPRISE_ELEMENT',
    event: 'STEAMPUNK_SCENE_EVENT',
  },
};
