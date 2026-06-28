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

  // dreamscape — scene-as-hero candy-fantasy world vista (2026-06-27, new).
  // NO bubble-bot, NO central character — the WORLD itself is the hero (ref
  // aida_ai_pro: lush oversized flora + whimsical fairytale architecture + a
  // reflective stream under a dreamy twilight sky). 9 axes / 10 picks; the
  // `world` axis carries the wide variety spread. AXIS-CLEAN discipline:
  // palette owns COLOR, atmosphere owns LIGHT, sky owns OVERHEAD, world owns
  // the BIOME — no lane bleeds. structure/dream_event/tiny_creature are three
  // INDEPENDENT gated conditional layers (so ~⅓ of renders are pure-natural
  // uninhabited wonderlands; events + rare ambient critters roll separately).
  DREAMBOT_DREAMSCAPE: {
    description:
      'PATH-BESPOKE — DreamBot dreamscape (2026-06-27). Scene-as-hero hyper-saturated candy-fantasy world vista; the WORLD is the hero, no character. 6 always axes (world + flora ×2 + foreground + palette + atmosphere + sky) + 3 independent gated conditionals (whimsical_structure ~60%, dream_event ~40%, tiny_creature ~22%). Own cinematic-fantasy medium (dreambot_dreamscape), flux-1.1-pro-ultra; skips look-rotation + chaos + two-pass-polish.',
    slots: {
      universal: [],
      bot: [],
      path: ['world', 'flora', 'foreground', 'palette', 'atmosphere', 'sky'],
    },
    pickN: { flora: 2 },
    // Three unrelated "a chance for X" layers, each rolled separately.
    conditionalLayers: [
      { slot: 'whimsical_structure', gate: 0.6 },
      { slot: 'dream_event', gate: 0.4 },
      { slot: 'tiny_creature', gate: 0.22 },
    ],
    framingModes: null,
    anchorScaleRange: null,
  },

  // butterfly-realm — striking butterflies as the focal point of a lush, very-
  // pretty scene (2026-06-27, new). NO character; the BUTTERFLIES are the hero.
  // Two modes — (A) photoreal swarm blanketing a natural feature, (B) surreal
  // butterfly-phenomenon (arc/vortex/river) over a vista — both carried by the
  // composition axis. Full color spectrum (monochrome → multicolor) via palette.
  // 8 axes / 9 picks. AXIS-CLEAN: setting owns BIOME, palette owns BUTTERFLY
  // COLOR, composition owns ARRANGEMENT, atmosphere owns LIGHT, backdrop owns the
  // far depth band. flora pickN 2 for lush density; event is a ~35% gated beat.
  DREAMBOT_BUTTERFLY_REALM: {
    description:
      'PATH-BESPOKE — DreamBot butterfly-realm (2026-06-27, R1 redesign). Striking BUTTERFLIES are the focal point of a CLEAN, dreamy, WHIMSICAL dreamscape; no character. 6 always axes (setting + feature + composition + palette + whimsy + atmosphere). R0 was "spammy / too flowery / not dreamy" → de-flowered, composition-over-density, dropped the flora ×2 + backdrop + event axes, added a WHIMSY axis (surreal dream-magic). Two modes (clean swarm-on-feature + clean sky-phenomenon) via composition; monochrome-biased full color via palette. Own cinematic-dreamscape medium (dreambot_butterfly), flux-1.1-pro + pro-ultra; skips look-rotation + chaos + two-pass-polish.',
    slots: {
      universal: [],
      bot: [],
      path: ['setting', 'feature', 'composition', 'palette', 'whimsy', 'atmosphere'],
    },
    pickN: {},
    conditionalLayers: [],
    framingModes: null,
    anchorScaleRange: null,
  },
};
