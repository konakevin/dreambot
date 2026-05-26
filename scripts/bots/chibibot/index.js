/**
 * ChibiBot — the bot-engine contract.
 *
 * 2026-05-20 — Cut 6 redundant paths (bookish-sanctuary, fireplace-cabin,
 * snowy-arctic, jungle-canopy, sunny-pair, storybook-page) after migration
 * audit; covered by cozy-interior / arctic-village / jungle-village /
 * cozy-landscape / night-meadow / heartwarming-scene. outdoor-adventure
 * kept — covers wild/open-world creature scenes that nothing else does.
 *
 * 2026-05-07 — Toy-photography paths (plushie-life, dollhouse-life) removed;
 * those live in ToyBot now.
 *
 * 2026-05-06 — CuddleBot merged into ChibiBot.
 *
 * 2026-05-22 — Food paths (miniature-feast, cute-food) moved to YumBot.
 *
 * Path inventory (17):
 *   Indoor: rainy-interior / cozy-interior
 *   Creature-focused: heartwarming-scene / creature-portrait / sleepy-naptime /
 *                     bath-time / cuddly-aquatic
 *   Outdoor-scene: cozy-landscape / rainy-day-cozy / night-meadow / outdoor-adventure
 *   Villages (6): aquatic-village / arctic-village / cottagecore-village /
 *                 jungle-village / sunny-village / twilight-village
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  // 3 ChibiBot-original indoor paths
  'rainy-interior': require('./paths/rainy-interior'),
  // 15 paths from CuddleBot (plushie-life + dollhouse-life moved to ToyBot)
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

  // 50/50 rotation between two medium identities (2026-05-19):
  //   chibibot_render — "funko cute": hyper-detailed 3D CGI / Pop-Mart designer-vinyl register
  //   chibibot_pixar  — "pixar cute": modern Pixar/Disney/DreamWorks animated-feature register
  // Equal counts → equal probability via botEngine.resolveMedium.
  mediums: ['chibibot_render', 'chibibot_pixar'],

  mediumStyles: {
    chibibot_render: blocks.CHIBI_RENDER_MEDIUM,
    chibibot_pixar: blocks.CHIBI_PIXAR_MEDIUM,
    // creature-world only — the verbatim 05-07 medium that produced Kevin's
    // hearted ornate single-hero creatures (recovered from render recipes;
    // see CHIBI_CREATURE_MEDIUM). bot.mediumStyles overrides the DB
    // flux_fragment, so this fully controls creature-world's style prefix.
    chibibot_creature: blocks.CHIBI_CREATURE_MEDIUM,
  },

  // Per-path medium lock — falls through to bot.mediums 50/50 rotation
  // when path not listed.
  mediumByPath: {
    // cozy-landscape — locked to pixar medium (storybook painterly rendering
    // works better for setting-as-hero than the Pop-Mart vinyl register)
    'cozy-landscape': 'chibibot_pixar',
    // rainy-interior — same painterly storybook register as cozy-landscape
    'rainy-interior': 'chibibot_pixar',
    // rainy-day-cozy — same painterly storybook register
    'rainy-day-cozy': 'chibibot_pixar',
    // sleepy-naptime — painterly storybook for peak-cute sleeping moments
    'sleepy-naptime': 'chibibot_pixar',
    'jungle-village': 'chibibot_pixar',
    'cozy-interior': 'chibibot_pixar',
    'arctic-village': 'chibibot_pixar',
    'aquatic-village': 'chibibot_pixar',
    'cottagecore-village': 'chibibot_pixar',
    'sunny-village': 'chibibot_pixar',
    'twilight-village': 'chibibot_pixar',
    'outdoor-adventure': 'chibibot_pixar',
    // creature-portrait: no medium lock — both chibibot_render + chibibot_pixar work
    // creature-world — locked to the chibibot_creature medium (the verbatim
    // 05-07 "lineage applied to whatever / creature IS the subject" text that
    // produced Kevin's hearted ornate single-hero creatures). NOT chibibot_render
    // (whose current text forces "NOT a single hero figurine / group composition").
    'creature-world': 'chibibot_creature',
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // chibibot_pixar uses the original (pre-rewrite) prefix verbatim.
  // chibibot_render falls through to bot.promptPrefix above.
  promptPrefixByMedium: {
    chibibot_pixar: blocks.PROMPT_PREFIX_PIXAR,
  },

  // Per-path prefix override — prepended BEFORE the medium style prefix as
  // the FIRST tokens Flux sees. Use case: aquatic-village needs cool-teal-water
  // context to override the warm-amber-jungle-palette baked into PROMPT_PREFIX_PIXAR
  // (which causes Flux to render coastal scenes as warm-cottage villages).
  promptPrefixByPath: {
    'aquatic-village':
      'UNDERWATER OR COASTAL OCEAN SCENE — cool teal-cyan-aqua water-caustic light dappling every surface, deep-blue ocean-water filling the scene, drifting bubble-streams rising through water, swirling fish-schools visible in background, bioluminescent coral-glow accents, water-reflection on architecture, palette of TEAL + CYAN + AQUA + CORAL-PINK + PEARL-VIOLET (cool aquatic palette, NOT warm tropical jungle palette), submerged underwater village OR coastal tidepool village always with VISIBLE WATER',
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
    // 15 from CuddleBot
    'heartwarming-scene',
    'cozy-landscape',
    'creature-portrait',
    'creature-world',
    'sleepy-naptime',
    'rainy-day-cozy',
    'bath-time',
    'cuddly-aquatic',
    'night-meadow',
    'outdoor-adventure',
    'cozy-interior',
    // 6 village
    'cottagecore-village',
    'aquatic-village',
    'arctic-village',
    'jungle-village',
    'twilight-village',
    'sunny-village',
  ],

  // Path weights — 2× indoor boost; everything else 1×.
  // Flat rotation (2026-05-26): equal weight per path — every path posts
  // once per cycle in randomized order via the cycleAllPaths shuffle-bag.
  cycleAllPaths: true,

  useModelPicker: true,
  allowedModels: ['black-forest-labs/flux-dev'],

  // Per-path model lock. creature-world → flux-dev. CONFIRMED from the DB:
  // the ornate reference renders Kevin hearted (2026-05-07, paths
  // aquatic-village/outdoor-adventure/etc.) were ALL flux-dev. flux-1.1-pro
  // renders the medium's literal "Be@rbrick designer-vinyl" as glass/metallic
  // figurines — the wrong look. flux-dev gives the soft, ornate, jewel-eyed
  // creatures. (Locked per-path so it survives even if chibibot.allowedModels
  // changes again — the f5ad51a drift that lost flux-1.1-pro is irrelevant
  // here because flux-dev is exactly what we want.)
  modelByPath: {
    'creature-world': 'black-forest-labs/flux-dev',
  },

  // Chaos layer — subject chaos OFF for creature-centric paths (don't
  // distort the cute silhouette). Village + scenery + storybook +
  // cozy-interior + indoor paths get subject-chaos.
  chaos: {
    enabled: true,
    skipPaths: [],
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

  // Sensory anchors — creature-centric paths use 'creature' context;
  // scenery/village/indoor paths use 'scene'.
  sensoryAnchors: {
    enabled: true,
    requiredChannels: ['lightcolor'],
    pathContext: {
      'creature-portrait': 'creature',
      'creature-world': 'creature',
      'sleepy-naptime': 'creature',
      'bath-time': 'creature',
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
    // EXEMPT creature-world — its identity is a SOLO hero figure (the
    // count-block's pair/trio would break the "Pop Mart" collectible look).
    if (medium === 'chibibot_render' && path !== 'creature-world') {
      const append = (str) => str + '\n\n' + blocks.CHIBI_CHARACTER_COUNT_BLOCK;
      if (typeof result === 'string') return append(result);
      if (result && typeof result.brief === 'string')
        return { ...result, brief: append(result.brief) };
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
