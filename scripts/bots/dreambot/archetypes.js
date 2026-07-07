/**
 * DreamBot archetypes — only the active bubble-bot-dreams path.
 *
 * DreamBot was xerox-cloned from ChibiBot; the dormant CHIBIBOT_* archetypes were
 * removed here because the cross-bot archetype registry rejects duplicate names
 * (ChibiBot still owns them). DreamBot's only active path is bubble-bot-dreams.
 *
 * Auto-discovered by scripts/lib/archetypeRegistry.js.
 */

module.exports = {
  // bubble-bot-dreams — canonical axis-system rebuild (2026-06-12).
  // A glossy designer-toy "bubble-bot" (consistent character, varied finish) as
  // the focal hero of a bold, imaginative, COLORFUL dream WORLD (the co-star).
  // FIGURE axes split from ENVIRONMENT axes so BOTH are richly detailed:
  //   figure: bot_body + bot_dome + bot_eyes + bot_pose
  //   environment: dream_world + world_detail (×2) + light_mood + atmosphere (×2)
  // Money-shot is a TEMPLATE mandate (the dome mirrors the dream world). The
  // silhouette is locked by the path prefix; these axes supply the variety.
  DREAMBOT_BUBBLE_BOT: {
    description:
      'PATH-BESPOKE — DreamBot bubble-bot-dreams (2026-06-12 canonical axis rebuild). 8 axes / 11 picks: figure = bot_body + bot_dome + bot_eyes + bot_pose; environment = dream_world + world_detail (pickN 2) + light_mood + atmosphere (pickN 2). No conditional. Target: the original-10 vibes — consistent toy, creative step-inside worlds.',
    slots: {
      universal: [],
      bot: [],
      path: [
        'bot_body',
        'bot_dome',
        'bot_eyes',
        'bot_pose',
        'dream_world',
        'world_detail',
        'light_mood',
        'atmosphere',
      ],
    },
    pickN: { world_detail: 2, atmosphere: 2 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },
};
