/**
 * SirenBot — the bot-engine contract.
 *
 * Character: high-fantasy warriors (elves / orcs / tieflings / dragons /
 * nymphs / undead-knights / etc.). Gender-split across 7 paths — 4 female
 * paths (body/action/face/seductive) + 3 male paths (body/action/face).
 * Ornate fantasy-painterly art, D&D concept-art energy.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'female-body': require('./paths/female-body'),
  'female-action': require('./paths/female-action'),
  'female-face': require('./paths/female-face'),
  'female-seductive': require('./paths/female-seductive'),
  'male-body': require('./paths/male-body'),
  'male-action': require('./paths/male-action'),
  'male-face': require('./paths/male-face'),
};

module.exports = {
  // ── Identity ──
  username: 'sirenbot',
  displayName: 'SirenBot',

  // ── Medium (multi-medium, all fantasy-art compatible) ──
  mediums: ['canvas', 'watercolor', 'photography', 'illustration'],

  // ── Flux prompt wrapping ──
  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // ── Vibes (fantasy-fitting subset — inverts old excludeVibes) ──
  vibes: [
    'cinematic',
    'dark',
    'epic',
    'psychedelic',
    'ethereal',
    'arcane',
    'ancient',
    'enchanted',
    'fierce',
    'nightshade',
    'macabre',
    'shimmer',
  ],

  // ── 7 render paths ──
  paths: [
    'female-body',
    'female-action',
    'female-face',
    'female-seductive',
    'male-body',
    'male-action',
    'male-face',
  ],

  // Slightly favor female paths (matches original bot balance where seductive existed only for female)
  pathWeights: {
    'female-body': 2,
    'female-action': 2,
    'female-face': 1,
    'female-seductive': 1,
    'male-body': 2,
    'male-action': 2,
    'male-face': 1,
  },

  // ── Shared DNA (rolled once per render) ──
  rollSharedDNA({ vibeKey, picker }) {
    return {
      race: picker.pickWithRecency(pools.RACES, 'race'),
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      vibeKey,
    };
  },

  // ── Dispatch to path builder ──
  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`SirenBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] SirenBot`;
  },
};
