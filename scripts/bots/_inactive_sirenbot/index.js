/**
 * SirenBot — the bot-engine contract.
 *
 * Gorgeous dangerous fantasy women across all archetypes — mermaids, dark elves,
 * nymphs, vampires, dragon-women, sorceresses, succubi, archangels.
 * Wildlife-documentary framing: observing these creatures in their natural habitats.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'mermaid': require('./paths/mermaid'),
  'dark-elf': require('./paths/dark-elf'),
  'forest-nymph': require('./paths/forest-nymph'),
  'vampire-queen': require('./paths/vampire-queen'),
  'dragon-woman': require('./paths/dragon-woman'),
  'sorceress': require('./paths/sorceress'),
  'succubus': require('./paths/succubus'),
  'archangel': require('./paths/archangel'),
};

module.exports = {
  username: 'sirenbot',
  displayName: 'SirenBot',

  mediums: ['photography', 'render', 'canvas'],

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  useModelPicker: true,
  allowedModels: ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-2-dev', 'black-forest-labs/flux-2-pro'],

  bannedPhrases: ['looking at the viewer', 'gazing at the camera', 'seductive pose', 'come-hither', 'beckoning the viewer', 'inviting gaze', 'sultry', 'posing for'],

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

  paths: [
    'mermaid',
    'dark-elf',
    'forest-nymph',
    'vampire-queen',
    'dragon-woman',
    'sorceress',
    'succubus',
    'archangel',
  ],

  pathWeights: {
    'mermaid': 1,
    'dark-elf': 1,
    'forest-nymph': 1,
    'vampire-queen': 1,
    'dragon-woman': 1,
    'sorceress': 1,
    'succubus': 1,
    'archangel': 1,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      atmosphere: picker.pickWithRecency(pools.MAGICAL_ATMOSPHERES, 'atmosphere'),
      vibeKey,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`SirenBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] SirenBot`;
  },
};
