/**
 * DreamBot crossover path: bubble-bot-dreams-mangabot (2026-06-12).
 * The bubble-bot in mangabot's world, rendered in DreamBot's glossy-dreamy register.
 * Identical to bubble-bot-dreams except the dream_world pool. See DREAMBOT_CROSSOVER_PLAN.md.
 */

module.exports = {
  archetype: 'DREAMBOT_BUBBLE_BOT',
  pools: {
    bot_body: 'BUBBLE_BOT_BODY',
    bot_dome: 'BUBBLE_BOT_DOME',
    bot_eyes: 'BUBBLE_BOT_EYES',
    bot_pose: 'BUBBLE_BOT_POSE',
    dream_world: 'BUBBLE_WORLD_MANGABOT',
    world_detail: 'BUBBLE_WORLD_DETAIL',
    light_mood: 'BUBBLE_LIGHT_MOOD',
    atmosphere: 'BUBBLE_ATMOSPHERE',
  },
};
