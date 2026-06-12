/**
 * DreamBot bubble-bot-dreams path — canonical axis-system rebuild (2026-06-12).
 *
 * A glossy designer-toy "bubble-bot" (consistent character, varied finish) as
 * the focal hero of bold, imaginative, colorful dream WORLDS. Built the playbook
 * way: FIGURE axes (body/dome/eyes/pose) split from ENVIRONMENT axes
 * (dream_world / world_detail ×2 / light_mood / atmosphere ×2) so BOTH the hero
 * and the world get their own bespoke creative seed. The dome-mirrors-the-world
 * money-shot is a template mandate.
 *
 * Locked to the chibibot_render medium + flux-1.1-pro-ultra (index.js), excluded
 * from the look-rotation. The silhouette is anchored by promptPrefixByPath.
 *
 * Archetype + template: DREAMBOT_BUBBLE_BOT (archetypes.js + archetype-templates.js).
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
