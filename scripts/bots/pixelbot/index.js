/**
 * PixelBot — the bot-engine contract.
 *
 * GAMING SCENES SPECIALIST. Every render is pixel art that looks like
 * "a screenshot from a game I desperately wish existed." 7 genre paths:
 * Cozy RPG Towns, Dungeon Depths, Side-Scroller Worlds, Boss Arenas,
 * JRPG Dreamscapes, Pixel Horror, Cozy Farming/Life Sim.
 * NO IP references. Bot's identity IS the medium + the genre.
 *
 * Pixel-cyberpunk path was killed 2026-05-06 — Flux's training has
 * billions of MODERN cyberpunk illustrations and almost no 16-bit
 * cyberpunk pixel-art examples, so the path consistently rendered
 * smooth/illustrated regardless of the 16-bit retro lock.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'cozy-rpg-town': require('./paths/cozy-rpg-town'),
  'dungeon-depth': require('./paths/dungeon-depth'),
  'side-scroller-world': require('./paths/side-scroller-world'),
  'boss-arena': require('./paths/boss-arena'),
  'jrpg-combat': require('./paths/jrpg-combat'),
  'pixel-horror': require('./paths/pixel-horror'),
  'cozy-farming-life-sim': require('./paths/cozy-farming-life-sim'),
  'pixel-sci-fi-action': require('./paths/pixel-sci-fi-action'),
  'classic-jrpg': require('./paths/classic-jrpg'),
  'epic-vista': require('./paths/epic-vista'),
};

// Per-path vibe lock — each genre prefers a tight subset of vibes for
// scene-cohesion. Engine respects this when rolling vibe per render.
const vibesByPath = {
  'cozy-rpg-town':         ['nostalgic', 'whimsical', 'enchanted'],
  'dungeon-depth':         ['dark', 'arcane', 'fierce'],
  'side-scroller-world':   ['cinematic', 'epic', 'voltage'],
  'boss-arena':            ['epic', 'fierce', 'cinematic'],
  'jrpg-combat':           ['epic', 'fierce', 'arcane', 'cinematic'],
  'pixel-horror':          ['fierce', 'arcane', 'dark', 'epic'],
  'cozy-farming-life-sim': ['nostalgic', 'whimsical', 'coquette'],
  'pixel-sci-fi-action':   ['epic', 'fierce', 'voltage', 'cinematic'],
  'classic-jrpg':          ['nostalgic', 'enchanted', 'whimsical', 'epic'],
  'epic-vista':            ['epic', 'ethereal', 'cinematic', 'nostalgic'],
};

const allVibes = Array.from(new Set(Object.values(vibesByPath).flat()));

module.exports = {
  username: 'pixelbot',
  displayName: 'PixelBot',

  mediums: ['pixels'],

  // 4-model rotation. Engine picks at random per render — diversity
  // across models is part of the variance the bot trades on.
  allowedModels: [
    'black-forest-labs/flux-dev',
    'black-forest-labs/flux-1.1-pro',
    'black-forest-labs/flux-2-dev',
    'black-forest-labs/flux-2-pro',
  ],

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  vibes: allVibes,
  vibesByPath,

  paths: [
    'cozy-rpg-town',
    'dungeon-depth',
    'side-scroller-world',
    'boss-arena',
    'jrpg-combat',
    'pixel-horror',
    'cozy-farming-life-sim',
    'pixel-sci-fi-action',
    'classic-jrpg',
    'epic-vista',
  ],

  pathWeights: {
    'cozy-rpg-town': 1,
    'dungeon-depth': 1,
    'side-scroller-world': 1,
    'boss-arena': 1,
    'jrpg-combat': 1,
    'pixel-horror': 1,
    'cozy-farming-life-sim': 1,
    'pixel-sci-fi-action': 1,
    'classic-jrpg': 1,
    'epic-vista': 1,
  },

  chaos: {
    enabled: true,
    skipPaths: [],
    allowSubjectChaosPaths: [
      'cozy-rpg-town',
      'dungeon-depth',
      'side-scroller-world',
      'boss-arena',
      'jrpg-combat',
      'pixel-horror',
      'cozy-farming-life-sim',
      'pixel-sci-fi-action',
      'classic-jrpg',
      'epic-vista',
    ],
  },

  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '65-90',
    polishedWordsByPath: {},
    preservePhrasesByPath: {},
  },

  // Sensory anchors disabled — they bleed generic "arcade/boss-fight/CRT/helipad"
  // gaming language into every render, sabotaging per-path genre fidelity.
  sensoryAnchors: { enabled: false },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      pixelPerspective: picker.pickWithRecency(pools.PIXEL_PERSPECTIVES, 'pixel_perspective'),
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
    };
  },

  // Bot-level pool defaults for declarative axis paths. PixelBot's axis
  // paths use path-bespoke pools for most slots; this stays empty for now.
  defaultPools: {},

  poolByName(name) {
    if (!(name in pools)) {
      throw new Error(`PixelBot.poolByName: unknown pool "${name}"`);
    }
    return pools[name];
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`PixelBot: unknown path "${path}"`);
    // Declarative axis-system paths export an object { archetype, pools }.
    // Legacy compositional paths export a function. Dispatch on shape.
    if (builder && typeof builder === 'object' && builder.archetype) {
      const { composeBrief } = require('../../lib/brief-composer');
      return composeBrief({
        bot: module.exports,
        pathConfig: builder,
        sharedDNA,
        vibeDirective,
        picker,
      });
    }
    if (typeof builder === 'function') {
      return builder({ sharedDNA, vibeDirective, vibeKey, picker });
    }
    throw new Error(`PixelBot: path "${path}" has invalid export shape`);
  },

  caption({ path }) {
    return `[${path}] PixelBot`;
  },
};
