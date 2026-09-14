/**
 * AlphaBot — the PRIVATE proving-ground bot (ALPHABOT.md).
 *
 * 2026-07-07 — DreamBot non-robot split: every DreamBot path that ISN'T the
 * little bubble-bot robot moved here (Kevin: DreamBot = purely the robot in
 * different worlds). The whole DreamBot/ChibiBot machinery (pools, blocks,
 * archetypes, shared DNA, buildBrief post-processing) rode along BYTE-IDENTICAL
 * (xerox doctrine) so the moved paths render exactly as they did on DreamBot.
 *
 * Active candidates = the 9 paths that were live on DreamBot. The 18 dormant
 * ChibiBot-heritage paths (villages / creatures / cozy interiors) are wired in
 * pathBuilders but NOT in paths[] — same dormant state they had on DreamBot.
 *
 * THE PORTABILITY CONTRACT (before wiring any NEW candidate): per-path config
 * must be cloned byte-identical from the destination bot — medium, models,
 * prefixes, polish/chaos/sensory. A path proven under the wrong config proves
 * nothing. Axis names must not collide with the destination's live axes.
 *
 * NO bot_schedules row exists for alphabot ON PURPOSE — it never auto-posts.
 * Render: node scripts/iter-bot.js --bot alphabot --mode <path> --count 5 \
 *   --label "auto-qa: <path> R<n>" --post
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');
// FarmBot-destined candidates (2026-09-09 AlphaBot proving-ground QA) — the
// path files + their bespoke pools live under farmbot/ (not moved/duplicated,
// per ALPHABOT.md's "no need to move files" note); Node resolves each path
// file's own internal require('../seeds/...')/require('../shared-blocks')
// relative to ITS OWN location, so this still pulls FarmBot's real content.
// Config below (medium/prefix/suffix/model) is cloned byte-identical from
// scripts/bots/farmbot/index.js so each candidate is proven under FarmBot's
// real destination config, not AlphaBot's own.
const farmbotBlocks = require('../farmbot/shared-blocks');
const farmbotPools = require('../farmbot/pools');

// Paths whose real destination bot (FarmBot) rolls its OWN dedicated look
// register (5 curated anime/cel-shaded entries) instead of AlphaBot's
// inherited Chibi one below — keeps each FarmBot candidate's art-style roll
// byte-identical to FarmBot's real rollSharedDNA (proving a path under the
// wrong look register proves nothing). If you're wiring in another FarmBot
// candidate, add its path key here too.
const FARMBOT_DESTINED_PATHS = [
  'farm-fair-festival',
  'duck-pond',
  'evening-chores',
  'market-town-square',
  'deliveries',
  'laundry-day',
  'waterfall-glade',
];

// Where each candidate is headed. 'ex-dreambot' = split refugee, destination
// undecided; update when Kevin assigns one (feeds the caption + the
// promote-alphabot-renders.js matcher).
const TARGETS = {};
const DEFAULT_TARGET = 'ex-dreambot';

const pathBuilders = {
  // ── Active candidates (were live on DreamBot until the 2026-07-07 split) ──
  dreamscape: require('./paths/dreamscape'),
  'butterfly-realm': require('./paths/butterfly-realm'),
  'dream-spires': require('./paths/dream-spires'),
  'far-eden': require('./paths/far-eden'),
  'far-eden-soft': require('./paths/far-eden-soft'),
  'hidden-conservatory': require('./paths/hidden-conservatory'),
  botanical: require('./paths/botanical'),
  'pulp-femme': require('./paths/pulp-femme'),
  'pulp-hero': require('./paths/pulp-hero'),
  // ── Dormant ChibiBot-heritage paths (inherited via DreamBot's xerox) ──
  'rainy-interior': require('./paths/rainy-interior'),
  'heartwarming-scene': require('./paths/heartwarming-scene'),
  'cozy-landscape': require('./paths/cozy-landscape'),
  'creature-portrait': require('./paths/creature-portrait'),
  'creature-world': require('./paths/creature-world'),
  'sleepy-naptime': require('./paths/sleepy-naptime'),
  'rainy-day-cozy': require('./paths/rainy-day-cozy'),
  'bath-time': require('./paths/bath-time'),
  'cuddly-aquatic': require('./paths/cuddly-aquatic'),
  'night-meadow': require('./paths/night-meadow'),
  'outdoor-adventure': require('./paths/outdoor-adventure'),
  'cozy-interior': require('./paths/cozy-interior'),
  'cottagecore-village': require('./paths/cottagecore-village'),
  'aquatic-village': require('./paths/aquatic-village'),
  'arctic-village': require('./paths/arctic-village'),
  'jungle-village': require('./paths/jungle-village'),
  'twilight-village': require('./paths/twilight-village'),
  'sunny-village': require('./paths/sunny-village'),
  // ── DreamBot Stage C candidates (2026-08-16, sandbox MVP-25, function-form) ──
  'pocket-planets': require('./paths/pocket-planets'),
  'cloud-harbor': require('./paths/cloud-harbor'),
  'dreamscape-nocturne': require('./paths/dreamscape-nocturne'),
  'lantern-sky': require('./paths/lantern-sky'),
  // (dream-express removed 2026-08-17 — Kevin cut the train path)
  'sky-bazaar': require('./paths/sky-bazaar'),
  'dream-orchard': require('./paths/dream-orchard'),
  'starlight-carnival': require('./paths/starlight-carnival'),
  // (Halloween candidates 2026-09 — all 27 approved ones promoted to their
  // destination bots' own seasonalPaths.halloween 2026-09-07; the 3
  // superseded BloomBot rejects — gothic-harvest-florals, pumpkin-patch-blooms,
  // witchs-garden-blooms — deleted, replaced by moonlit-flower-garden /
  // overgrown-pumpkin-blooms / haunted-mansion-florals / nightshade-forest-path.)
  // ── FarmBot-destined candidates (2026-09-09) — 6 already-built-but-never-
  // registered FarmBot path files, proving out here before registration into
  // farmbot/index.js. Required directly from farmbot/paths/ (not moved).
  'farm-fair-festival': require('../farmbot/paths/farm-fair-festival'),
  'duck-pond': require('../farmbot/paths/duck-pond'),
  'market-town-square': require('../farmbot/paths/market-town-square'),
  deliveries: require('../farmbot/paths/deliveries'),
  'evening-chores': require('../farmbot/paths/evening-chores'),
  'laundry-day': require('../farmbot/paths/laundry-day'),
  'waterfall-glade': require('../farmbot/paths/waterfall-glade'),
};

// Look-enabled paths — same derivation DreamBot used (bubble exclusions moot
// here; the bespoke-medium paths + creature-world opt out, everything else
// renders with the rolled lookRegister via chibibot_neutral).
const CHIBI_LOOK_PATHS = Object.keys(pathBuilders).filter(
  (p) =>
    p !== 'creature-world' &&
    p !== 'dreamscape' &&
    p !== 'butterfly-realm' &&
    p !== 'dream-spires' &&
    p !== 'far-eden' &&
    p !== 'far-eden-soft' &&
    p !== 'hidden-conservatory' &&
    p !== 'botanical' &&
    p !== 'pulp-femme' &&
    p !== 'pulp-hero' &&
    // Stage C dream candidates own their inline cosmic-dream look (function-form).
    p !== 'pocket-planets' &&
    p !== 'cloud-harbor' &&
    p !== 'dreamscape-nocturne' &&
    p !== 'lantern-sky' &&
    p !== 'sky-bazaar' &&
    p !== 'dream-orchard' &&
    p !== 'starlight-carnival'
);

module.exports = {
  username: 'AlphaBot',
  displayName: 'AlphaBot',

  // Inherited DreamBot medium rotation (only matters for paths not pinned in
  // mediumByPath — currently none).
  mediums: ['chibibot_render', 'chibibot_pixar'],

  // Byte-identical DreamBot mediumStyles (code-only mediums; no DB rows).
  mediumStyles: {
    chibibot_render:
      'polished glossy 3D CGI render, ultra-clean subsurface-scattering vinyl materials, crisp dewy highlights, luminous pastel magical-wallpaper finish, deep focus, richly detailed throughout',
    chibibot_pixar: blocks.CHIBI_PIXAR_MEDIUM,
    chibibot_creature: blocks.CHIBI_CREATURE_MEDIUM,
    chibibot_gpt_clean: blocks.GPT_CLEAN,
    chibibot_neutral: blocks.CHIBI_NEUTRAL,
    dreambot_dreamscape: blocks.DREAMSCAPE_MEDIUM,
    dreambot_butterfly: blocks.BUTTERFLY_MEDIUM,
    dreambot_spires: blocks.DREAM_SPIRES_MEDIUM,
    dreambot_eden_hyperreal: blocks.EDEN_MEDIUM_HYPERREAL,
    dreambot_eden_painterly: blocks.EDEN_MEDIUM_PAINTERLY,
    dreambot_conservatory: blocks.CONSERVATORY_MEDIUM,
    dreambot_botanical: blocks.BOTANICAL_MEDIUM,
    dreambot_pulp: blocks.PULP_MEDIUM,
    // Stage C dream candidates — minimal anchor (the function-form paths inline
    // their full look; this just reinforces the painterly-dream register).
    dreambot_cosmic_dream:
      'luminous painterly dream-illustration, storybook-cosmic wonder, dreamy soft light, richly detailed, deep atmospheric depth, magical and serene',
    // FarmBot candidate — byte-identical clone of farmbot/index.js's
    // mediumStyles.farmbot_cozy_neutral (the bot's ONLY medium/tone-lock).
    farmbot_cozy_neutral: farmbotBlocks.FARMBOT_COZY_NEUTRAL,
  },

  cleanMediumByModel: {},

  mediumByPath: {
    ...Object.fromEntries(CHIBI_LOOK_PATHS.map((p) => [p, 'chibibot_neutral'])),
    // FarmBot candidate — locked to its own medium (never chibibot_neutral).
    'farm-fair-festival': 'farmbot_cozy_neutral',
    'duck-pond': 'farmbot_cozy_neutral',
    'market-town-square': 'farmbot_cozy_neutral',
    deliveries: 'farmbot_cozy_neutral',
    'evening-chores': 'farmbot_cozy_neutral',
    'laundry-day': 'farmbot_cozy_neutral',
    'waterfall-glade': 'farmbot_cozy_neutral',
    'creature-world': 'chibibot_creature',
    dreamscape: 'dreambot_dreamscape',
    'butterfly-realm': 'dreambot_butterfly',
    'dream-spires': 'dreambot_spires',
    'far-eden': 'dreambot_eden_hyperreal',
    'far-eden-soft': 'dreambot_eden_painterly',
    'hidden-conservatory': 'dreambot_conservatory',
    botanical: 'dreambot_botanical',
    'pulp-femme': 'dreambot_pulp',
    'pulp-hero': 'dreambot_pulp',
    'pocket-planets': 'dreambot_cosmic_dream',
    'cloud-harbor': 'dreambot_cosmic_dream',
    'dreamscape-nocturne': 'dreambot_cosmic_dream',
    'lantern-sky': 'dreambot_cosmic_dream',
    'sky-bazaar': 'dreambot_cosmic_dream',
    'dream-orchard': 'dreambot_cosmic_dream',
    'starlight-carnival': 'dreambot_cosmic_dream',
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // Byte-identical DreamBot per-medium prefixes for the moved paths.
  promptPrefixByMedium: {
    chibibot_pixar: blocks.PROMPT_PREFIX_PIXAR,
    chibibot_gpt_clean: '',
    dreambot_dreamscape:
      'lush hyper-detailed magical fantasy dream-world, cinematic wallpaper, deep focus, ultra-saturated',
    dreambot_butterfly:
      'lush painterly butterfly dreamscape, striking iridescent butterflies the focal point painted into the scene, a dreamy colorful storybook dream-world, magical and whimsical',
    dreambot_spires:
      'whimsical fairytale tower-city, impossible twisting pastel spires with glowing windows, lush painterly storybook dream-world, dreamy and magical',
    dreambot_pulp:
      'a fun retro 1960s pulp sci-fi illustration, a glamorous space character front and center, campy retro-future scene, bold saturated vintage airbrush artwork',
    dreambot_eden_hyperreal:
      'breathtaking alien-world paradise vista under a cosmic sky, lush otherworldly wonder, cinematic wallpaper, deep focus, ultra-saturated',
    dreambot_eden_painterly:
      'breathtaking alien-world paradise vista under a cosmic sky, lush otherworldly wonder, luminous painterly dreamscape, deep focus, ultra-saturated',
    dreambot_conservatory:
      'lush overgrown stained-glass conservatory interior, rainbow prismatic light scattered through jewel-toned glass, a secret cathedral garden, cinematic photoreal, deep focus, vivid',
    dreambot_botanical:
      'a gorgeous dreamlike storybook botanical scene, lush foliage or trees as the hero, fine-art nature photography, soft enchanted nostalgic light, rich and varied color, an impossibly pretty place you would want to wander through, dreamy serene and beautiful',
    chibibot_neutral: 'cute chibi',
    dreambot_cosmic_dream:
      'a breathtaking luminous painterly dream-illustration, storybook-cosmic wonder, dreamy and magical, rich saturated color, deep atmospheric depth',
    // Byte-identical clone of farmbot/index.js's promptPrefixByMedium.
    farmbot_cozy_neutral: 'cozy farm scene',
  },

  promptSuffixByMedium: {
    chibibot_neutral:
      'adorable wholesome charm, every character is a creature, no humans, no text no watermarks',
    // Byte-identical clone of farmbot/index.js's promptSuffixByMedium.
    farmbot_cozy_neutral:
      'no text, no words, no letters, no numbers, no watermark, no signature, no artist tag, no logo, no stylized mark of any kind anywhere in the frame, gallery quality',
  },

  promptPrefixByPath: {
    'aquatic-village':
      'aquatic ocean scene with VISIBLE WATER, cool aquatic palette, water-caustic light dappling every surface, drifting bubble-streams, swirling fish-schools in background, bioluminescent coral-glow accents, water-reflection on architecture',
  },

  // DreamBot's cute-forward vibe set (all exist in dream_vibes).
  vibes: [
    'cozy',
    'peaceful',
    'whimsical',
    'enchanted',
    'shimmer',
    'nostalgic',
    'ethereal',
    'cinematic',
    'surreal',
  ],

  // Active candidates only — dormant heritage paths stay out of the rotation
  // exactly as they did on DreamBot.
  paths: [
    'dreamscape',
    'butterfly-realm',
    'dream-spires',
    'far-eden',
    'far-eden-soft',
    'hidden-conservatory',
    'botanical',
    'pulp-femme',
    'pulp-hero',
    'pocket-planets',
    'cloud-harbor',
    'dreamscape-nocturne',
    'lantern-sky',
    'sky-bazaar',
    'dream-orchard',
    'starlight-carnival',
    // FarmBot candidate (2026-09-09) — safe to list despite AlphaBot's
    // cycleAllPaths shuffle-bag: no bot_schedules row exists for alphabot,
    // so this can never auto-post; only reachable via explicit --mode.
    'farm-fair-festival',
    'duck-pond',
    'deliveries',
    'market-town-square',
    'evening-chores',
    'laundry-day',
    'waterfall-glade',
  ],

  cycleAllPaths: true,

  useModelPicker: true,
  allowedModels: ['black-forest-labs/flux-1.1-pro-ultra', 'black-forest-labs/flux-1.1-pro'],
  modelWeights: {
    'black-forest-labs/flux-1.1-pro-ultra': 80,
    'black-forest-labs/flux-1.1-pro': 80,
  },

  // Byte-identical DreamBot per-path model locks for the moved paths.
  modelByPath: {
    'creature-world': 'black-forest-labs/flux-dev',
    dreamscape: 'black-forest-labs/flux-1.1-pro-ultra',
    'butterfly-realm': [
      'black-forest-labs/flux-1.1-pro-ultra',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-dev',
    ],
    'dream-spires': [
      'black-forest-labs/flux-1.1-pro-ultra',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-dev',
      'black-forest-labs/flux-2-flex',
      'black-forest-labs/flux-2-pro',
      'black-forest-labs/flux-2-max',
    ],
    'far-eden': ['black-forest-labs/flux-1.1-pro-ultra', 'black-forest-labs/flux-1.1-pro'],
    'far-eden-soft': ['black-forest-labs/flux-1.1-pro-ultra', 'black-forest-labs/flux-1.1-pro'],
    'hidden-conservatory': 'black-forest-labs/flux-1.1-pro-ultra',
    botanical: 'black-forest-labs/flux-1.1-pro-ultra',
    'pulp-femme': ['black-forest-labs/flux-1.1-pro-ultra', 'black-forest-labs/flux-1.1-pro'],
    'pulp-hero': ['black-forest-labs/flux-1.1-pro-ultra', 'black-forest-labs/flux-1.1-pro'],
    'pocket-planets': 'black-forest-labs/flux-1.1-pro-ultra',
    'cloud-harbor': 'black-forest-labs/flux-1.1-pro-ultra',
    'dreamscape-nocturne': 'black-forest-labs/flux-1.1-pro-ultra',
    'lantern-sky': 'black-forest-labs/flux-1.1-pro-ultra',
    'sky-bazaar': 'black-forest-labs/flux-1.1-pro-ultra',
    'dream-orchard': 'black-forest-labs/flux-1.1-pro-ultra',
    'starlight-carnival': 'black-forest-labs/flux-1.1-pro-ultra',
    // FarmBot candidate — locked to flux-2-flex only, matching
    // farmbot/index.js's allowedModels lock exactly (modelByPath takes
    // priority over AlphaBot's own useModelPicker/allowedModels above, so
    // this alone is sufficient — no need to touch AlphaBot's global list).
    'farm-fair-festival': 'black-forest-labs/flux-2-flex',
    'duck-pond': 'black-forest-labs/flux-2-flex',
    'market-town-square': 'black-forest-labs/flux-2-flex',
    deliveries: 'black-forest-labs/flux-2-flex',
    'evening-chores': 'black-forest-labs/flux-2-flex',
    'laundry-day': 'black-forest-labs/flux-2-flex',
    'waterfall-glade': 'black-forest-labs/flux-2-flex',
  },

  chaos: {
    enabled: true,
    skipPaths: [
      // FarmBot candidate — FarmBot's real production config has no chaos
      // layer at all; skip it here so the test render matches production.
      'farm-fair-festival',
      'duck-pond',
      'market-town-square',
      'deliveries',
      'evening-chores',
      'laundry-day',
      'waterfall-glade',
      'bath-time',
      'dreamscape',
      'butterfly-realm',
      'dream-spires',
      'far-eden',
      'far-eden-soft',
      'hidden-conservatory',
      'botanical',
      'pulp-femme',
      'pulp-hero',
      'pocket-planets',
      'cloud-harbor',
      'dreamscape-nocturne',
      'lantern-sky',
      'sky-bazaar',
      'dream-orchard',
      'starlight-carnival',
    ],
    allowSubjectChaosPaths: [
      'cozy-landscape',
      'rainy-day-cozy',
      'night-meadow',
      'aquatic-village',
      'jungle-village',
      'arctic-village',
      'twilight-village',
      'sunny-village',
      'cottagecore-village',
      'cozy-interior',
      'rainy-interior',
    ],
  },

  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '65-90',
    preservePhrasesByPath: {},
    skipPaths: [
      // FarmBot candidate — FarmBot's real production config has no
      // twoPassPolish layer at all; skip it here so the test render matches
      // production (this bot composes its own brief directly).
      'farm-fair-festival',
      'duck-pond',
      'market-town-square',
      'deliveries',
      'evening-chores',
      'laundry-day',
      'waterfall-glade',
      'bath-time',
      'dreamscape',
      'butterfly-realm',
      'dream-spires',
      'far-eden',
      'far-eden-soft',
      'hidden-conservatory',
      'botanical',
      'pulp-femme',
      'pulp-hero',
      'cuddly-aquatic',
      'night-meadow',
      'cozy-landscape',
      'rainy-interior',
      'rainy-day-cozy',
      'sleepy-naptime',
      'jungle-village',
      'cozy-interior',
      'arctic-village',
      'aquatic-village',
      'cottagecore-village',
      'sunny-village',
      'twilight-village',
      'outdoor-adventure',
      'creature-portrait',
      'creature-world',
      'pocket-planets',
      'cloud-harbor',
      'dreamscape-nocturne',
      'lantern-sky',
      'sky-bazaar',
      'dream-orchard',
      'starlight-carnival',
    ],
  },

  sensoryAnchors: {
    enabled: true,
    requiredChannels: ['lightcolor'],
    // FarmBot candidates — FarmBot's real production config has no
    // sensoryAnchors layer at all; skip them here so the test render
    // matches production exactly.
    skipPaths: [
      'farm-fair-festival',
      'duck-pond',
      'market-town-square',
      'deliveries',
      'evening-chores',
      'laundry-day',
      'waterfall-glade',
    ],
    pathContext: {
      'creature-portrait': 'creature',
      'creature-world': 'creature',
      'sleepy-naptime': 'creature',
      'cuddly-aquatic': 'creature',
      'heartwarming-scene': 'scene',
      'cozy-landscape': 'scene',
      'rainy-day-cozy': 'scene',
      'night-meadow': 'scene',
      'outdoor-adventure': 'creature',
      'aquatic-village': 'scene',
      'jungle-village': 'scene',
      'arctic-village': 'scene',
      'twilight-village': 'scene',
      'sunny-village': 'scene',
      'cozy-interior': 'scene',
      'cottagecore-village': 'scene',
      'rainy-interior': 'scene',
      'pocket-planets': 'scene',
      'cloud-harbor': 'scene',
      'dreamscape-nocturne': 'scene',
      'lantern-sky': 'scene',
      'sky-bazaar': 'scene',
      'dream-orchard': 'scene',
      'starlight-carnival': 'scene',
    },
    poolsByContextAndChannel: pools.SENSORY_POOLS,
  },

  defaultPools: {
    lighting: 'LIGHTING',
    atmosphere: 'ATMOSPHERES',
    weather: 'SCENE_WEATHER',
  },

  poolByName(name) {
    const pools = require('./pools');
    if (!(name in pools)) {
      throw new Error(`AlphaBot.poolByName: unknown pool "${name}"`);
    }
    return pools[name];
  },

  rollSharedDNA({ vibeKey, path, picker }) {
    // FarmBot candidates — byte-identical clone of farmbot/index.js's own
    // rollSharedDNA (its 5-entry anime/cel-shaded FARMBOT_LOOK_REGISTER,
    // NOT AlphaBot's inherited CHIBIBOT_LOOK_REGISTER below — a path proven
    // under the wrong look register proves nothing). Distinct dedup axis key
    // ('farmbot_look_register') so recency-tracking doesn't bleed between
    // the two unrelated pools under AlphaBot's shared 'look_register' axis.
    if (path && FARMBOT_DESTINED_PATHS.includes(path)) {
      const lookRegister =
        (picker
          ? picker.pickWithRecency(farmbotPools.FARMBOT_LOOK_REGISTER, 'farmbot_look_register')
          : farmbotPools.FARMBOT_LOOK_REGISTER[0]) || farmbotPools.FARMBOT_LOOK_REGISTER[0];
      return {
        lookRegister,
        scenePalette: lookRegister.split('—')[0].trim(),
      };
    }
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cozy,
      lookRegister: picker
        ? picker.pickWithRecency(pools.CHIBIBOT_LOOK_REGISTER, 'look_register')
        : pools.CHIBIBOT_LOOK_REGISTER[0],
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, medium, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`AlphaBot: unknown path "${path}"`);
    let result;
    if (builder && typeof builder === 'object' && builder.archetype) {
      const { composeBrief } = require('../../lib/brief-composer');
      result = composeBrief({
        bot: module.exports,
        pathConfig: builder,
        sharedDNA,
        vibeDirective,
        picker,
      });
    } else if (typeof builder === 'function') {
      result = builder({ sharedDNA, vibeDirective, vibeKey, picker });
    } else {
      throw new Error(`AlphaBot: path "${path}" has invalid export shape`);
    }
    // Byte-identical DreamBot post-processing (chibibot_render count-block +
    // the pixar/neutral shared-block swaps) so dormant heritage paths render
    // exactly as they did before the split.
    if (medium === 'chibibot_render' && path !== 'creature-world' && path !== 'bath-time') {
      const append = (str) => str + '\n\n' + blocks.CHIBI_CHARACTER_COUNT_BLOCK;
      if (typeof result === 'string') return append(result);
      if (result && typeof result.brief === 'string')
        return { ...result, brief: append(result.brief) };
      return result;
    }
    if (medium === 'chibibot_pixar' || medium === 'chibibot_neutral') {
      const swap = (str) =>
        str
          .split(blocks.STYLIZED_NOT_PHOTOREAL_BLOCK)
          .join(blocks.STYLIZED_NOT_PHOTOREAL_BLOCK_PIXAR)
          .split(blocks.BLOW_IT_UP_BLOCK)
          .join(blocks.BLOW_IT_UP_BLOCK_PIXAR);
      if (typeof result === 'string') return swap(result);
      if (result && typeof result.brief === 'string')
        return { ...result, brief: swap(result.brief) };
      return result;
    }
    return result;
  },

  caption({ path }) {
    const target = TARGETS[path] || DEFAULT_TARGET;
    return `AlphaBot › ${target} › ${path}`;
  },
};
