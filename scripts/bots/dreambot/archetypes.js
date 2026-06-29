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

  // dream-spires — scene-as-hero whimsical fairytale TOWER-CITY (2026-06-27, new).
  // NO character; the impossible whimsical tower-city is the hero. LEAN axes
  // (hero is rich — OceanBot lesson): 5 always + 1 gated whimsy. EXTERIOR VISTAS
  // ONLY. AXIS-CLEAN: spire_world owns FORMATION+STYLE, palette owns COLOR,
  // vantage owns the exterior CAMERA, charm_details (pickN 2) own the signature
  // charm layer, light_sky owns LIGHT+SKY, whimsy owns the gated dream element.
  DREAMBOT_DREAM_SPIRES: {
    description:
      'PATH-BESPOKE — DreamBot dream-spires (2026-06-27). Scene-as-hero whimsical fairytale TOWER-CITY (Seuss-meets-Ghibli spiral pastel towers, chimney-steam, skybridges, lit windows); the WORLD is the hero, no character. 5 always axes (spire_world + palette + vantage + charm_details ×2 + light_sky) + 1 gated conditional (whimsy ~40%). EXTERIOR VISTAS ONLY. Own painterly-storybook medium (dreambot_spires), flux-1.1-pro-ultra; skips look-rotation + chaos + two-pass-polish.',
    slots: {
      universal: [],
      bot: [],
      path: ['spire_world', 'palette', 'vantage', 'charm_details', 'light_sky'],
    },
    pickN: { charm_details: 2 },
    conditionalLayers: [{ slot: 'whimsy', gate: 0.4 }],
    framingModes: null,
    anchorScaleRange: null,
  },

  // far-eden — scene-as-hero HAPPY fantasy ALIEN WORLD (2026-06-28, new).
  // NO character; an original, beautiful, INVITING alien world is the hero —
  // "brochure shots of alien worlds" (Kevin: steered AWAY from sci-fi's dark/
  // serious default → joyful paradise vistas). Modeled on the dreamscape shape
  // (NOT painterly spires). 5 always axes (world + cosmic_sky + flora ×2 +
  // palette + atmosphere) + 4 INDEPENDENT gated conditionals (terrain_glow ~50%
  // so half are bright-daylight paradises, life_accent ~28%, wonder_structure
  // ~30%, dream_event ~30%). AXIS-CLEAN: world owns BIOME, cosmic_sky owns the
  // OVERHEAD celestial wonder (the signature axis), flora owns plant-life,
  // palette owns COLOR, atmosphere owns LIGHT+AIR. LOOK-NEUTRAL template — the
  // MEDIUM decides hyperreal vs painterly (two sibling paths: far-eden +
  // far-eden-soft share this archetype + pools, differ only in medium).
  DREAMBOT_FAR_EDEN: {
    description:
      'PATH-BESPOKE — DreamBot far-eden (2026-06-28). Scene-as-hero HAPPY fantasy ALIEN WORLD; an original, beautiful, inviting paradise vista is the hero, no character. 5 always axes (world + cosmic_sky + flora ×2 + palette + atmosphere) + 4 independent gated conditionals (terrain_glow ~50%, life_accent ~28%, wonder_structure ~30%, dream_event ~30%). Look-neutral template; medium decides hyperreal vs painterly. flux-1 family; skips look-rotation + chaos + two-pass-polish.',
    slots: {
      universal: [],
      bot: [],
      path: ['world', 'cosmic_sky', 'flora', 'palette', 'atmosphere'],
    },
    pickN: { flora: 2 },
    conditionalLayers: [
      { slot: 'terrain_glow', gate: 0.5 },
      { slot: 'life_accent', gate: 0.28 },
      { slot: 'wonder_structure', gate: 0.3 },
      { slot: 'dream_event', gate: 0.3 },
    ],
    framingModes: null,
    anchorScaleRange: null,
  },

  // hidden-conservatory — scene-as-hero stained-glass GREENHOUSE INTERIOR
  // (2026-06-28, new). NO character; an overgrown garden inside a grand
  // stained-glass cathedral/conservatory is the hero, with sun SHATTERING through
  // jewel-glass into rainbow prismatic light (ref: benmyhre "Stained Glass
  // Greenhouses"). 6 always axes (conservatory + glass_palette + flora ×2 +
  // light_effect + vantage + atmosphere) + 3 INDEPENDENT gated conditionals
  // (water_feature ~35%, architectural_detail ~40%, ambient_life ~22%). The mood
  // ROLLS the full range (moody-dark ↔ bright) via the atmosphere axis; the glass
  // + flora + refracted light stay vivid (pretty, not grim). AXIS-CLEAN:
  // conservatory=architecture, glass_palette=glass color, flora=plant-life,
  // light_effect=the prismatic refraction (the signature axis), vantage=interior
  // camera, atmosphere=light-quality+mood+air. Own photoreal-cinematic medium
  // (dreambot_conservatory), flux-1.1 pair; skips look-rotation + chaos + two-pass.
  DREAMBOT_HIDDEN_CONSERVATORY: {
    description:
      'PATH-BESPOKE — DreamBot hidden-conservatory (2026-06-28). Scene-as-hero stained-glass GREENHOUSE INTERIOR; an overgrown garden inside a grand stained-glass cathedral/conservatory with rainbow prismatic light refraction is the hero, no character. 6 always axes (conservatory + glass_palette + flora ×2 + light_effect + vantage + atmosphere) + 3 independent gated conditionals (water_feature ~35%, architectural_detail ~40%, ambient_life ~22%). Mood rolls moody-dark↔bright via atmosphere; glass/flora/light stay vivid. Own photoreal medium (dreambot_conservatory), flux-1.1 pair; skips look-rotation + chaos + two-pass-polish.',
    slots: {
      universal: [],
      bot: [],
      path: ['conservatory', 'glass_palette', 'flora', 'light_effect', 'vantage', 'atmosphere'],
    },
    pickN: { flora: 2 },
    conditionalLayers: [
      { slot: 'water_feature', gate: 0.35 },
      { slot: 'architectural_detail', gate: 0.4 },
      { slot: 'ambient_life', gate: 0.22 },
    ],
    framingModes: null,
    anchorScaleRange: null,
  },

  DREAMBOT_BOTANICAL: {
    description:
      'PATH-BESPOKE — DreamBot botanical (2026-06-28, dreamy biome-diverse pure-nature rework per Kevin). OUTDOOR, dreamy/whimsical/storybook, biome-diverse lush plant-life scenes you want to walk through — NOT a single flower bloom and NO draping flower-sheets (BloomBot owns flowers; blossoms only sprinkled or as overhead canopies), NEVER an indoor atrium/greenhouse/conservatory. 4 always axes (biome-diverse botanical hero + biome-neutral setting + light_season + framing) + 1 gated scene_element (~25%: subtle NATURAL accents — stream/mist/pool/waterfall/light-shafts, plus a few soft nature-integrated touches). Own botanical fine-art medium (dreambot_botanical); flux-1.1-pro-ultra; skips look-rotation + chaos + two-pass-polish.',
    slots: { universal: [], bot: [], path: ['botanical', 'setting', 'light_season', 'framing'] },
    pickN: {},
    conditionalLayers: [{ slot: 'scene_element', gate: 0.25 }],
    framingModes: null,
    anchorScaleRange: null,
  },
};
