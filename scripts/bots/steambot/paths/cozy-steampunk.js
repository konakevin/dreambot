/**
 * SteamBot cozy-steampunk — declarative composer form.
 *
 * Resurrected + migrated 2026-05-15 to canonical multi-layered room+view
 * shape. Dreamy ethereal cozy Victorian-industrial interiors with beautiful
 * window views. The room (steampunk furniture + flora) AND the window view
 * (sunset / rainstorm sky / airships / cloudtops) are both heroes.
 *
 * 7-axis split: 4 path-bespoke (room / flora pickN:3 / window_view /
 * intricate_detail pickN:2) + 1 conditional 40%-gated (quiet_moment)
 * + 2 universal (lighting / atmosphere).
 *
 * Pre-resurrection function-form preserved at paths/legacy/cozy-steampunk.js.
 */

module.exports = {
  archetype: 'STEAMBOT_COZY_STEAMPUNK',
  pools: {
    room: 'COZY_STEAMPUNK_ROOM',
    flora: 'COZY_STEAMPUNK_FLORA',
    window_view: 'COZY_STEAMPUNK_WINDOW_VIEW',
    intricate_detail: 'COZY_STEAMPUNK_INTRICATE_DETAIL',
    quiet_moment: 'COZY_STEAMPUNK_QUIET_MOMENT',
  },
};
