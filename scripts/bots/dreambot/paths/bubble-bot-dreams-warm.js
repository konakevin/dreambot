/**
 * DreamBot bubble-bot-dreams-WARM — the R2 "designer-collectible" look (2026-06-12).
 *
 * A second live path that gives the feed a DISTINCT rendering style alongside the
 * sharp R4 path (bubble-bot-dreams). Identical in every way — same archetype, same
 * template, same scaled 8-axis pools (incl. the 1000-world dream_world) — EXCEPT
 * the medium: this uses `dreambot_render_warm` (the original Pop-Mart designer-
 * collectible vinyl medium), giving the softer, warmer, shallower-DOF "toy on a
 * dreamy diorama" look from QA Round 2, vs the sharp deep-focus lean medium the
 * R4 path uses. The medium + its product prefix are wired in index.js.
 */

module.exports = {
  archetype: 'DREAMBOT_BUBBLE_BOT',
  pools: {
    bot_body: 'BUBBLE_BOT_BODY',
    bot_dome: 'BUBBLE_BOT_DOME',
    bot_eyes: 'BUBBLE_BOT_EYES',
    bot_pose: 'BUBBLE_BOT_POSE',
    dream_world: 'BUBBLE_DREAM_WORLD',
    world_detail: 'BUBBLE_WORLD_DETAIL',
    light_mood: 'BUBBLE_LIGHT_MOOD',
    atmosphere: 'BUBBLE_ATMOSPHERE',
  },
};
