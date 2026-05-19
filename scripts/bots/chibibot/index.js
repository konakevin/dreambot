/**
 * ChibiBot — the bot-engine contract.
 *
 * 2026-05-07 — Toy-photography paths (plushie-life, dollhouse-life) removed;
 * those live in ToyBot now. ChibiBot is now a single locked visual register:
 * hyper-cute 3D character render (chibibot_render medium) — designer-vinyl
 * collectible CGI aesthetic across all 24 paths.
 *
 * 2026-05-06 — CuddleBot merged into ChibiBot.
 *
 * Path inventory (24):
 *   3 ChibiBot-original indoor paths: rainy-interior / fireplace-cabin /
 *     bookish-sanctuary
 *   15 paths from CuddleBot: heartwarming-scene / cozy-landscape /
 *     creature-portrait / sleepy-naptime / rainy-day-cozy /
 *     miniature-feast / bath-time / outdoor-adventure / storybook-page /
 *     cuddly-aquatic / jungle-canopy / snowy-arctic / night-meadow /
 *     sunny-pair / cozy-interior
 *   6 village paths: cottagecore-village / aquatic-village /
 *     arctic-village / jungle-village / twilight-village / sunny-village
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  // 3 ChibiBot-original indoor paths
  'rainy-interior': require('./paths/rainy-interior'),
  'fireplace-cabin': require('./paths/fireplace-cabin'),
  'bookish-sanctuary': require('./paths/bookish-sanctuary'),
  // 15 paths from CuddleBot (plushie-life + dollhouse-life moved to ToyBot)
  'heartwarming-scene': require('./paths/heartwarming-scene'),
  'cozy-landscape': require('./paths/cozy-landscape'),
  'creature-portrait': require('./paths/creature-portrait'),
  'sleepy-naptime': require('./paths/sleepy-naptime'),
  'rainy-day-cozy': require('./paths/rainy-day-cozy'),
  'miniature-feast': require('./paths/miniature-feast'),
  'bath-time': require('./paths/bath-time'),
  'outdoor-adventure': require('./paths/outdoor-adventure'),
  'storybook-page': require('./paths/storybook-page'),
  'cuddly-aquatic': require('./paths/cuddly-aquatic'),
  'jungle-canopy': require('./paths/jungle-canopy'),
  'snowy-arctic': require('./paths/snowy-arctic'),
  'night-meadow': require('./paths/night-meadow'),
  'sunny-pair': require('./paths/sunny-pair'),
  'cozy-interior': require('./paths/cozy-interior'),
  // cute-food (2026-05-17, bex.ai-inspired kawaii pop-mart food)
  'cute-food': require('./paths/cute-food'),
  // 6 village paths
  'cottagecore-village': require('./paths/cottagecore-village'),
  'aquatic-village': require('./paths/aquatic-village'),
  'arctic-village': require('./paths/arctic-village'),
  'jungle-village': require('./paths/jungle-village'),
  'twilight-village': require('./paths/twilight-village'),
  'sunny-village': require('./paths/sunny-village'),
};

module.exports = {
  username: 'chibibot',
  displayName: 'ChibiBot',

  // 60/40 rotation between two medium identities:
  //   chibibot_render — hyper-cute 3D CGI / Pop-Mart designer-vinyl register (2026-05-07) — 6×
  //   chibibot_pixar  — modern Pixar/Disney/DreamWorks animated-feature register (pre-2026-05-07) — 4×
  // Repeated entries weight the random pick by botEngine.resolveMedium.
  mediums: [
    'chibibot_render', 'chibibot_render', 'chibibot_render',
    'chibibot_render', 'chibibot_render', 'chibibot_render',
    'chibibot_pixar', 'chibibot_pixar', 'chibibot_pixar', 'chibibot_pixar',
  ],

  mediumStyles: {
    chibibot_render: blocks.CHIBI_RENDER_MEDIUM,
    chibibot_pixar: blocks.CHIBI_PIXAR_MEDIUM,
    chibibot_food: blocks.CHIBI_FOOD_MEDIUM,
  },

  // Per-path medium lock — cute-food gets its own bespoke medium directive
  // (chibibot_food) where the FOOD is the cast (smiling faces ON the food
  // itself, no human/chibi/creature characters in the frame). Same Pop-Mart
  // glossy-pearlescent rendering as chibibot_render but food-centric, not
  // character-centric — matches the bex.ai Instagram aesthetic.
  // Other paths fall through to the bot.mediums 60/40 rotation above.
  mediumByPath: {
    'cute-food': 'chibibot_food',
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // chibibot_pixar uses the original (pre-rewrite) prefix verbatim.
  // chibibot_render falls through to bot.promptPrefix above.
  promptPrefixByMedium: {
    chibibot_pixar: blocks.PROMPT_PREFIX_PIXAR,
  },

  // Cute-forward vibes (banned: dark, fierce, macabre, nightshade,
  // psychedelic, ancient, epic, voltage, arcane).
  vibes: [
    'cozy',
    'peaceful',
    'whimsical',
    'enchanted',
    'coquette',
    'shimmer',
    'nostalgic',
    'ethereal',
    'cinematic',
    'surreal',
  ],

  paths: [
    // 3 ChibiBot-original indoor (weighted 2× to balance vs the 21 others)
    'rainy-interior',
    'fireplace-cabin',
    'bookish-sanctuary',
    // 15 from CuddleBot
    'heartwarming-scene',
    'cozy-landscape',
    'creature-portrait',
    'sleepy-naptime',
    'rainy-day-cozy',
    'miniature-feast',
    'bath-time',
    'outdoor-adventure',
    'storybook-page',
    'cuddly-aquatic',
    'jungle-canopy',
    'snowy-arctic',
    'night-meadow',
    'sunny-pair',
    'cozy-interior',
    // cute-food
    'cute-food',
    // 6 village
    'cottagecore-village',
    'aquatic-village',
    'arctic-village',
    'jungle-village',
    'twilight-village',
    'sunny-village',
  ],

  // Path weights — 2× indoor boost; everything else 1×.
  pathWeights: {
    'rainy-interior': 2,
    'fireplace-cabin': 2,
    'bookish-sanctuary': 2,
    'heartwarming-scene': 1,
    'cozy-landscape': 1,
    'creature-portrait': 1,
    'sleepy-naptime': 1,
    'rainy-day-cozy': 1,
    'miniature-feast': 1,
    'bath-time': 1,
    'outdoor-adventure': 1,
    'storybook-page': 1,
    'cuddly-aquatic': 1,
    'jungle-canopy': 1,
    'snowy-arctic': 1,
    'night-meadow': 1,
    'sunny-pair': 1,
    'cozy-interior': 1,
    'cute-food': 2,
    'cottagecore-village': 1,
    'aquatic-village': 1,
    'arctic-village': 1,
    'jungle-village': 1,
    'twilight-village': 1,
    'sunny-village': 1,
  },

  useModelPicker: true,
  allowedModels: ['black-forest-labs/flux-dev'],

  // Chaos layer — subject chaos OFF for creature-centric paths (don't
  // distort the cute silhouette). Village + scenery + storybook +
  // cozy-interior + indoor paths get subject-chaos.
  chaos: {
    enabled: true,
    skipPaths: [],
    allowSubjectChaosPaths: [
      'cozy-landscape',
      'rainy-day-cozy',
      'storybook-page',
      'night-meadow',
      'aquatic-village',
      'jungle-village',
      'arctic-village',
      'twilight-village',
      'sunny-village',
      'cottagecore-village',
      'cozy-interior',
      'rainy-interior',
      'fireplace-cabin',
      'bookish-sanctuary',
    ],
  },

  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '65-90',
    preservePhrasesByPath: {},
  },

  // Sensory anchors — creature-centric paths use 'creature' context;
  // scenery/village/indoor paths use 'scene'.
  sensoryAnchors: {
    enabled: true,
    requiredChannels: ['lightcolor'],
    pathContext: {
      'creature-portrait': 'creature',
      'sleepy-naptime': 'creature',
      'bath-time': 'creature',
      'outdoor-adventure': 'creature',
      'miniature-feast': 'creature',
      'cuddly-aquatic': 'creature',
      'jungle-canopy': 'creature',
      'snowy-arctic': 'creature',
      'sunny-pair': 'creature',
      'heartwarming-scene': 'scene',
      'cozy-landscape': 'scene',
      'rainy-day-cozy': 'scene',
      'storybook-page': 'scene',
      'night-meadow': 'scene',
      'aquatic-village': 'scene',
      'jungle-village': 'scene',
      'arctic-village': 'scene',
      'twilight-village': 'scene',
      'sunny-village': 'scene',
      'cozy-interior': 'scene',
      'cottagecore-village': 'scene',
      'rainy-interior': 'scene',
      'fireplace-cabin': 'scene',
      'bookish-sanctuary': 'scene',
      'cute-food': 'scene',
    },
    poolsByContextAndChannel: pools.SENSORY_POOLS,
  },

  // Bot-level pool defaults for declarative axis paths.
  // Universal slots (lighting, atmosphere) resolve here when a declarative
  // path declares them. Path-bespoke axes always override.
  defaultPools: {
    lighting: 'LIGHTING',
    atmosphere: 'ATMOSPHERES',
    weather: 'SCENE_WEATHER',
  },

  poolByName(name) {
    const pools = require('./pools');
    if (!(name in pools)) {
      throw new Error(`ChibiBot.poolByName: unknown pool "${name}"`);
    }
    return pools[name];
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cozy,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, medium, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`ChibiBot: unknown path "${path}"`);
    // Declarative axis-system paths export an object { archetype, pools }.
    // Legacy function-form paths export a function. Dispatch on shape.
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
      throw new Error(`ChibiBot: path "${path}" has invalid export shape`);
    }
    // chibibot_render: append the 1–3 character-count rule so renders
    // aren't all solo portraits. Pixar renders skip this entirely.
    // EXCEPTION: cute-food path has "food IS the cast, no characters" —
    // appending the character-count block would override that mandate.
    if (medium === 'chibibot_render' && path !== 'cute-food') {
      const append = (str) => str + '\n\n' + blocks.CHIBI_CHARACTER_COUNT_BLOCK;
      if (typeof result === 'string') return append(result);
      if (result && typeof result.brief === 'string') return { ...result, brief: append(result.brief) };
      return result;
    }
    // chibibot_pixar: swap the new render-style shared blocks for their
    // pre-rewrite verbatim originals so the brief Sonnet sees matches the
    // OLD style verbatim.
    if (medium === 'chibibot_pixar') {
      const swap = (str) =>
        str
          .split(blocks.STYLIZED_NOT_PHOTOREAL_BLOCK)
          .join(blocks.STYLIZED_NOT_PHOTOREAL_BLOCK_PIXAR)
          .split(blocks.BLOW_IT_UP_BLOCK)
          .join(blocks.BLOW_IT_UP_BLOCK_PIXAR);
      if (typeof result === 'string') return swap(result);
      if (result && typeof result.brief === 'string') return { ...result, brief: swap(result.brief) };
      return result;
    }
    return result;
  },

  caption({ path }) {
    return `[${path}] ChibiBot`;
  },
};
