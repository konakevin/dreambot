/**
 * DreamBot — the bot-engine contract. ROBOT-ONLY since 2026-07-07.
 *
 * DreamBot is the little bubble-bot robot visiting different worlds — that IS
 * the bot's identity (Kevin). Every non-robot path (dreamscape / butterfly-realm
 * / dream-spires / far-eden ×2 / hidden-conservatory / botanical / pulp ×2 +
 * the 18 dormant ChibiBot-heritage paths) moved to scripts/bots/alphabot/
 * (the private proving ground, ALPHABOT.md) with its pools/seeds/archetypes.
 *
 * Path inventory: bubble-bot-dreams + bubble-bot-dreams-warm + 18 crossover
 * paths (the bubble-bot visits each bot's universe — DREAMBOT_CROSSOVER_PLAN.md).
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'bubble-bot-dreams': require('./paths/bubble-bot-dreams'),
  'bubble-bot-dreams-warm': require('./paths/bubble-bot-dreams-warm'),
  // Crossover paths — the bubble-bot visits other bots' worlds (glossy-dreamy).
  'bubble-bot-dreams-earthbot': require('./paths/bubble-bot-dreams-earthbot'),
  'bubble-bot-dreams-brickbot': require('./paths/bubble-bot-dreams-brickbot'),
  'bubble-bot-dreams-dragonbot': require('./paths/bubble-bot-dreams-dragonbot'),
  'bubble-bot-dreams-bloombot': require('./paths/bubble-bot-dreams-bloombot'),
  'bubble-bot-dreams-chibibot': require('./paths/bubble-bot-dreams-chibibot'),
  'bubble-bot-dreams-dinobot': require('./paths/bubble-bot-dreams-dinobot'),
  'bubble-bot-dreams-faebot': require('./paths/bubble-bot-dreams-faebot'),
  'bubble-bot-dreams-gothbot': require('./paths/bubble-bot-dreams-gothbot'),
  'bubble-bot-dreams-mangabot': require('./paths/bubble-bot-dreams-mangabot'),
  'bubble-bot-dreams-mechbot': require('./paths/bubble-bot-dreams-mechbot'),
  'bubble-bot-dreams-oceanbot': require('./paths/bubble-bot-dreams-oceanbot'),
  'bubble-bot-dreams-pixelbot': require('./paths/bubble-bot-dreams-pixelbot'),
  'bubble-bot-dreams-retrobot': require('./paths/bubble-bot-dreams-retrobot'),
  'bubble-bot-dreams-starbot': require('./paths/bubble-bot-dreams-starbot'),
  'bubble-bot-dreams-steambot': require('./paths/bubble-bot-dreams-steambot'),
  'bubble-bot-dreams-tinybot': require('./paths/bubble-bot-dreams-tinybot'),
  'bubble-bot-dreams-toybot': require('./paths/bubble-bot-dreams-toybot'),
  'bubble-bot-dreams-yumbot': require('./paths/bubble-bot-dreams-yumbot'),
};

// Crossover paths (the bubble-bot in other bots' worlds). All share the
// bubble-bot-dreams config (glossy-dreamy medium + flux-ultra + skip chaos/polish);
// only their dream_world pool differs. Listed once here, spread into the maps below.
const CROSSOVER_PATHS = [
  'bubble-bot-dreams-earthbot',
  'bubble-bot-dreams-brickbot',
  'bubble-bot-dreams-dragonbot',
  'bubble-bot-dreams-bloombot',
  'bubble-bot-dreams-chibibot',
  'bubble-bot-dreams-dinobot',
  'bubble-bot-dreams-faebot',
  'bubble-bot-dreams-gothbot',
  'bubble-bot-dreams-mangabot',
  'bubble-bot-dreams-mechbot',
  'bubble-bot-dreams-oceanbot',
  'bubble-bot-dreams-pixelbot',
  'bubble-bot-dreams-retrobot',
  'bubble-bot-dreams-starbot',
  'bubble-bot-dreams-steambot',
  'bubble-bot-dreams-tinybot',
  'bubble-bot-dreams-toybot',
  'bubble-bot-dreams-yumbot',
];

module.exports = {
  username: 'dreambot',
  displayName: 'DreamBot',

  // Every robot path is pinned in mediumByPath; this rotation is the inherited
  // fallback for any future unpinned path.
  mediums: ['chibibot_render', 'chibibot_pixar'],

  mediumStyles: {
    // bubble-bot-dreams (2026-06-12 QA R3): lean DreamBot override of the shared
    // CHIBI_RENDER_MEDIUM. Drops the product-shot cues ("designer-collectible",
    // "Pop Mart designer-toy register") that prime Flux for a shallow-DOF studio
    // product shot with a blurred backdrop, and the redundant figure language (the
    // figure axes own that now). Keeps the glossy CGI vinyl polish; adds deep-focus.
    chibibot_render:
      'polished glossy 3D CGI render, ultra-clean subsurface-scattering vinyl materials, crisp dewy highlights, luminous pastel magical-wallpaper finish, deep focus, richly detailed throughout',
    // bubble-bot-dreams-WARM (R2 look): the original Pop-Mart designer-collectible
    // vinyl medium — softer, warmer, shallower DOF "toy-on-a-diorama" register. A
    // distinct second feed look vs the sharp chibibot_render lean medium above.
    dreambot_render_warm: blocks.CHIBI_RENDER_MEDIUM,
    chibibot_pixar: blocks.CHIBI_PIXAR_MEDIUM,
    chibibot_gpt_clean: blocks.GPT_CLEAN,
  },

  // cleanMediumByModel retired 2026-06-21 — only ever routed Nano Banana / gpt-2,
  // both now banned bot-wide (FLUX-only).
  cleanMediumByModel: {},

  mediumByPath: {
    // bubble-bot-dreams locks the glossy designer-vinyl render (the reference look).
    'bubble-bot-dreams': 'chibibot_render',
    // bubble-bot-dreams-warm: the R2 warmer designer-collectible medium.
    'bubble-bot-dreams-warm': 'dreambot_render_warm',
    // crossover paths use the sharp glossy-dreamy medium (the R4 look).
    ...Object.fromEntries(CROSSOVER_PATHS.map((p) => [p, 'chibibot_render'])),
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  promptPrefixByMedium: {
    // bubble-bot-dreams (2026-06-12 QA R3): override the bot's product-shot
    // PROMPT_PREFIX ("designer collectible quality") for the render medium, and
    // LEAD with the WORLD so CLIP doesn't collapse the scene into a product-shot
    // bokeh backdrop. Only bubble-bot-dreams uses chibibot_render on DreamBot.
    chibibot_render:
      'lush richly-detailed magical dream-world wallpaper, deep focus crisp throughout, glossy luminous pastel finish',
    chibibot_pixar: blocks.PROMPT_PREFIX_PIXAR,
    chibibot_gpt_clean: '',
  },

  // bubble-bot-dreams: NO promptPrefixByPath (2026-06-12 axis rebuild, QA R2). A
  // front prefix front-loads the bot-as-product on CLIP and collapses the dream
  // world into a blurred bokeh backdrop. The figure axes + template already lock
  // the hero. Let the world breathe.
  promptPrefixByPath: {},

  // Cute-forward vibes (banned: dark, fierce, macabre, nightshade,
  // psychedelic, ancient, epic, voltage, arcane). surreal KEPT deliberately —
  // DreamBot is the dream-world wildcard bot. coquette cut 2026-07-03
  // (off-brand vibe audit) — lace/ribbon/teacup register on a bubble-robot bot.
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

  // ROBOT-ONLY roster (2026-07-07 split — non-robot paths live on AlphaBot now).
  paths: ['bubble-bot-dreams', 'bubble-bot-dreams-warm', ...CROSSOVER_PATHS],

  // Flat rotation (2026-05-26): equal weight per path — every path posts
  // once per cycle in randomized order via the cycleAllPaths shuffle-bag.
  cycleAllPaths: true,

  useModelPicker: true,
  // flux-1.1-pro allowed alongside ultra everywhere (Kevin 2026-06-21).
  allowedModels: ['black-forest-labs/flux-1.1-pro-ultra', 'black-forest-labs/flux-1.1-pro'],
  modelWeights: {
    'black-forest-labs/flux-1.1-pro-ultra': 80,
    'black-forest-labs/flux-1.1-pro': 80,
  },

  modelByPath: {
    // Lock to pro-ultra (no gpt-2 bounce) — the glossy iridescent reference look.
    'bubble-bot-dreams': 'black-forest-labs/flux-1.1-pro-ultra',
    'bubble-bot-dreams-warm': 'black-forest-labs/flux-1.1-pro-ultra',
    ...Object.fromEntries(CROSSOVER_PATHS.map((p) => [p, 'black-forest-labs/flux-1.1-pro-ultra'])),
  },

  // Chaos + two-pass polish: every robot path skips both (the bubble-bot look
  // is a locked reference recipe).
  chaos: {
    enabled: true,
    skipPaths: ['bubble-bot-dreams', 'bubble-bot-dreams-warm', ...CROSSOVER_PATHS],
    allowSubjectChaosPaths: [],
  },

  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '65-90',
    preservePhrasesByPath: {},
    skipPaths: ['bubble-bot-dreams', 'bubble-bot-dreams-warm', ...CROSSOVER_PATHS],
  },

  // No robot path uses sensory anchors (they belonged to the moved
  // creature/scene paths); kept enabled with an empty map so re-adding a path
  // is one line.
  sensoryAnchors: {
    enabled: true,
    requiredChannels: ['lightcolor'],
    pathContext: {},
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
      throw new Error(`DreamBot.poolByName: unknown pool "${name}"`);
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
    if (!builder) throw new Error(`DreamBot: unknown path "${path}"`);
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
      throw new Error(`DreamBot: path "${path}" has invalid export shape`);
    }
    // chibibot_render count-block: bubble-bot paths are exempt (their figure
    // axes own the hero) — with a robot-only roster this never fires, kept so
    // a future non-bubble path inherits the guard.
    if (medium === 'chibibot_render' && !path.startsWith('bubble-bot-dreams')) {
      const append = (str) => str + '\n\n' + blocks.CHIBI_CHARACTER_COUNT_BLOCK;
      if (typeof result === 'string') return append(result);
      if (result && typeof result.brief === 'string')
        return { ...result, brief: append(result.brief) };
      return result;
    }
    if (medium === 'chibibot_pixar') {
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
    return `[${path}] ChibiBot`;
  },
};
