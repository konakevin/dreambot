/**
 * DreamBot crossover path: bubble-bot-dreams-earthbot (2026-06-12).
 * EarthBot — epic real-Earth nature (peaks, atolls, glaciers, canyons) in glossy-dreamy register
 *
 * Identical to bubble-bot-dreams (same archetype DREAMBOT_BUBBLE_BOT, same figure
 * + world_detail + light_mood + atmosphere pools, same glossy-dreamy medium/model)
 * EXCEPT the dream_world pool is themed to earthbot's world. See DREAMBOT_CROSSOVER_PLAN.md.
 */

module.exports = {
  archetype: 'DREAMBOT_BUBBLE_BOT',
  pools: {
    bot_body: 'BUBBLE_BOT_BODY',
    bot_dome: 'BUBBLE_BOT_DOME',
    bot_eyes: 'BUBBLE_BOT_EYES',
    bot_pose: 'BUBBLE_BOT_POSE',
    dream_world: 'BUBBLE_WORLD_EARTHBOT',
    world_detail: 'BUBBLE_WORLD_DETAIL',
    light_mood: 'BUBBLE_LIGHT_MOOD',
    atmosphere: 'BUBBLE_ATMOSPHERE',
  },
};
