/**
 * SteamBot steampunk-hybrid — declarative composer form (revived 2026-06-30).
 *
 * Steampunk COLLIDES with another genre — gothic-horror / western / rain-noir /
 * underwater / arctic / fantasy / volcanic-desert-jungle — and BOTH are equally
 * visible. The bot's VARIETY lane: genre collisions force palette + mood range
 * the rest of the roster doesn't have. Environment-dominant; figures incidental.
 *
 * Originally deleted 2026-05-03 (the hyperreal-medium-lock commit) along with
 * its old overblown engine blocks (BLOW_IT_UP_BLOCK / IMPOSSIBLE_BEAUTY_BLOCK).
 * Rebuilt LEAN on the current axis system + the looks system (the render style
 * comes from the per-render LOOK, not a baked medium).
 *
 * Lean axes: 1 path-bespoke hero (hybrid_world) + 40%-gated surprise (reuses the
 * shared scene surprise pool) + universal lighting + atmosphere.
 */

module.exports = {
  archetype: 'STEAMBOT_STEAMPUNK_HYBRID',
  pools: {
    hybrid_world: 'STEAMBOT_HYBRID_WORLDS',
    surprise_element: 'STEAMPUNK_SCENE_SURPRISE_ELEMENT',
  },
};
