/**
 * MermaidBot — the bot-engine contract.
 *
 * Mermaids in every flavor — seductive sirens, bioluminescent deep-sea aliens,
 * tropical reef sprites, gothic haunts, underwater royalty, liminal shore-dwellers,
 * arctic ice-singers, armored ocean warriors.
 * Waterhouse × concept art × underwater cinematography.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'mermaid-siren': require('./paths/mermaid-siren'),
  'mermaid-deep': require('./paths/mermaid-deep'),
  'mermaid-reef': require('./paths/mermaid-reef'),
  'mermaid-dark': require('./paths/mermaid-dark'),
  'mermaid-royal': require('./paths/mermaid-royal'),
  'mermaid-shore': require('./paths/mermaid-shore'),
  'mermaid-ice': require('./paths/mermaid-ice'),
  'mermaid-warrior': require('./paths/mermaid-warrior'),
};

module.exports = {
  username: 'mermaidbot',
  displayName: 'MermaidBot',

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
    'ethereal',
    'enchanted',
    'fierce',
    'nightshade',
    'shimmer',
    'surreal',
    'arcane',
    'ancient',
    'psychedelic',
  ],

  paths: [
    'mermaid-siren',
    'mermaid-deep',
    'mermaid-reef',
    'mermaid-dark',
    'mermaid-royal',
    'mermaid-shore',
    'mermaid-ice',
    'mermaid-warrior',
  ],

  pathWeights: {
    'mermaid-siren': 1,
    'mermaid-deep': 1,
    'mermaid-reef': 1,
    'mermaid-dark': 1,
    'mermaid-royal': 1,
    'mermaid-shore': 1,
    'mermaid-ice': 1,
    'mermaid-warrior': 1,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      features: picker.pickWithRecency(pools.MERMAID_FEATURES, 'mermaid_features'),
      waterCondition: picker.pickWithRecency(pools.WATER_CONDITIONS, 'water_condition'),
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      vibeKey,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`MermaidBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] MermaidBot`;
  },
};
