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
    p !== 'pulp-hero'
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
  },

  cleanMediumByModel: {},

  mediumByPath: {
    ...Object.fromEntries(CHIBI_LOOK_PATHS.map((p) => [p, 'chibibot_neutral'])),
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
  },

  promptSuffixByMedium: {
    chibibot_neutral:
      'adorable wholesome charm, every character is a creature, no humans, no text no watermarks',
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
  },

  chaos: {
    enabled: true,
    skipPaths: [
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
    ],
  },

  sensoryAnchors: {
    enabled: true,
    requiredChannels: ['lightcolor'],
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

  rollSharedDNA({ vibeKey, picker }) {
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
