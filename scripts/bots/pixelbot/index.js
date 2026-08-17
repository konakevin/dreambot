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
const { ALL_ENABLED_AI_MODELS } = require('../../lib/imageModels');

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
  'pixel-landscapes': require('./paths/pixel-landscapes'),
  'pixel-item-shop': require('./paths/pixel-item-shop'), // Stage K1 SHADOW
  'retro-racing': require('./paths/retro-racing'), // Stage K2 SHADOW
  'pixel-overworld': require('./paths/pixel-overworld'), // Stage K3 SHADOW
};

// Dark-launched (shadow) paths — renderable via `iter-bot --mode <path> --post`
// (admin-only shadow posts), NOT in live rotation until promoted into `paths`.
const PIXEL_SHADOW_PATHS = ['pixel-item-shop', 'retro-racing', 'pixel-overworld'];

// Per-path vibe lock — each genre prefers a tight subset of vibes for
// scene-cohesion. Engine respects this when rolling vibe per render.
const vibesByPath = {
  'cozy-rpg-town': ['nostalgic', 'whimsical', 'enchanted'],
  'dungeon-depth': ['dark', 'arcane', 'fierce'],
  'side-scroller-world': ['cinematic', 'epic', 'voltage'],
  'boss-arena': ['epic', 'fierce', 'cinematic'],
  'jrpg-combat': ['epic', 'fierce', 'arcane', 'cinematic'],
  'pixel-horror': ['fierce', 'arcane', 'dark', 'epic'],
  'cozy-farming-life-sim': ['nostalgic', 'whimsical', 'coquette'],
  'pixel-sci-fi-action': ['epic', 'fierce', 'voltage', 'cinematic'],
  'classic-jrpg': ['nostalgic', 'enchanted', 'whimsical', 'epic'],
  'epic-vista': ['epic', 'ethereal', 'cinematic', 'nostalgic'],
  'pixel-landscapes': ['epic', 'ethereal', 'cinematic', 'nostalgic'],
  'pixel-item-shop': ['nostalgic', 'whimsical', 'enchanted'], // Stage K1 SHADOW (cozy interior)
  'retro-racing': ['nostalgic', 'cinematic', 'epic', 'voltage'], // Stage K2 SHADOW
  'pixel-overworld': ['nostalgic', 'enchanted', 'epic'], // Stage K3 SHADOW
};

const allVibes = Array.from(new Set(Object.values(vibesByPath).flat()));

module.exports = {
  username: 'pixelbot',
  displayName: 'PixelBot',

  mediums: ['pixels'],

  // 4-model rotation. Engine picks at random per render — diversity
  // across models is part of the variance the bot trades on.
  useModelPicker: true,
  allowedModels: ALL_ENABLED_AI_MODELS,

  // Per-path model pins land here when a specific path needs a specific model.
  modelByPath: {},

  // nano-banana clean-render override (2026-06-07). Keeps the pixel-art
  // register crisp + readable on this model (+ empty promptPrefixByMedium
  // so the bot's prefix doesn't pull it off-style).
  mediumStyles: {
    pixelbot_gpt_clean: blocks.GPT_CLEAN,
  },
  // cleanMediumByModel retired 2026-06-21 — only ever routed Nano Banana / gpt-2,
  // both now banned bot-wide (FLUX-only).
  cleanMediumByModel: {},
  promptPrefixByMedium: {
    pixelbot_gpt_clean: '',
  },

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
    'pixel-landscapes',
    // Stage K — promoted to live rotation 2026-08-16 (scaled to production;
    // faithful xerox — not in allowSubjectChaosPaths (chaos off), polish applies
    // as in shadow, vibesByPath + global promptPrefix preserved).
    'pixel-item-shop',
    'retro-racing',
    'pixel-overworld',
  ],

  // Dark-launched (shadow) paths — renderable on demand, hidden from public + rotation.
  shadowPaths: [], // Stage K paths promoted to live rotation 2026-08-16

  // Flat rotation (2026-05-26): equal weight per path — every path posts
  // once per cycle in randomized order via the cycleAllPaths shuffle-bag.
  cycleAllPaths: true,

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
      'pixel-landscapes',
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
