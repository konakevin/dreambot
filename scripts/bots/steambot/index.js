/**
 * SteamBot — the bot-engine contract.
 *
 * UNIFIED STEAMPUNK STYLE (2026-05-03):
 * One custom hardcoded look — `steambot-hyperreal` — applied to EVERY
 * SteamBot render. No medium rotation. No vibe rotation. The bot has
 * one unified visual identity: hyperreal surreal-realistic cinematic
 * steampunk concept render. Variety comes only from path + scene seeds.
 *
 * The medium key `steambot-hyperreal` is bot-internal only — it does NOT
 * exist in the dream_mediums DB table. The engine reads its style from
 * `mediumStyles` here, which short-circuits the DB lookup.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'steampunk-scene': require('./paths/steampunk-scene'),
  'airship-skies': require('./paths/airship-skies'),
  'steampunk-curio': require('./paths/steampunk-curio'),
  'sexy-steampunk-woman': require('./paths/sexy-steampunk-woman'),
  'steampunk-man': require('./paths/steampunk-man'),
  'steampunk-spectacle': require('./paths/steampunk-spectacle'),
  'steam-transport': require('./paths/steam-transport'),
};

// THE SteamBot look — crisp + vivid + cinematic. NO "hyperreal" / "photoreal"
// language because those words trigger Flux 1.1 Pro's locked beautiful-woman
// face prior and produce same-girl-every-render. Aiming for rich, vivid,
// cinematic illustration that FEELS real without invoking photorealism.
const STEAMBOT_HYPERREAL_STYLE =
  'crisp vivid cinematic rendering, rich saturated color, sharp focused detail across all depth layers, dramatic feature-film production design, painterly-rich character illustration with photographic clarity';

module.exports = {
  username: 'steambot',
  displayName: 'SteamBot',

  useModelPicker: true,
  allowedModels: ['black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-dev'],

  modelByPath: {
    'steampunk-scene':       { 'black-forest-labs/flux-1.1-pro': 100 },
    'airship-skies':         { 'black-forest-labs/flux-1.1-pro': 100 },
    'steampunk-curio':       { 'black-forest-labs/flux-1.1-pro': 100 },
    // Female path stays on main's two-model rotation — proven to give
    // face-geometry diversity. Other paths keep hyperreal lock.
    'sexy-steampunk-woman':  ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'steampunk-man':         { 'black-forest-labs/flux-1.1-pro': 100 },
    'steampunk-spectacle':   { 'black-forest-labs/flux-1.1-pro': 100 },
    'steam-transport':       { 'black-forest-labs/flux-1.1-pro': 100 },
  },

  // SteamBot's ONE custom medium key for SCENE paths. Bot-internal — does
  // NOT exist in dream_mediums DB. Female path overrides with mediumByPath.
  mediums: ['steambot-hyperreal'],

  mediumByPath: {
    // Female path hardcoded to render (testing).
    'sexy-steampunk-woman': 'render',
  },

  mediumStyles: {
    'steambot-hyperreal': STEAMBOT_HYPERREAL_STYLE,
  },

  promptPrefixByMedium: {
    'steambot-hyperreal': blocks.PROMPT_PREFIX,
  },
  promptSuffixByMedium: {
    'steambot-hyperreal': blocks.PROMPT_SUFFIX,
  },

  // Single-vibe lock for scene paths. Female path overrides with vibesByPath.
  vibes: ['cinematic'],

  vibesByPath: {
    'sexy-steampunk-woman': [
      'cinematic', 'dark', 'epic', 'nostalgic', 'peaceful', 'whimsical',
      'ethereal', 'arcane', 'ancient', 'enchanted', 'fierce', 'coquette',
      'voltage', 'nightshade', 'macabre', 'shimmer', 'surreal',
    ],
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // Per-path overrides — keep tiny. Long prefixes shove Sonnet's ethnicity
  // tokens past Flux's attention zone; main proves short stack = diversity.
  promptPrefixByPath: {
    'steampunk-man':
      'diverse cast steampunk character study, distinctive identity-anchored portrait, specific ethnicity and features rendered exactly',
  },
  promptSuffixByPath: {
    'steampunk-man':
      'render the EXACT skin tone and ethnicity, render the EXACT hair color, render the EXACT facial hair style — NOT a generic white European stubbled craftsman, NOT centered hand-on-hip stance, NOT runway model strut',
  },

  paths: [
    'steampunk-scene',
    'airship-skies',
    'steampunk-curio',
    'sexy-steampunk-woman',
    'steampunk-man',
    'steampunk-spectacle',
    'steam-transport',
  ],

  pathWeights: {
    'steampunk-scene': 2,
    'airship-skies': 2,
    'steampunk-curio': 2,
    'sexy-steampunk-woman': 2,
    'steampunk-man': 2,
    'steampunk-spectacle': 1,
    'steam-transport': 2,
  },

  chaos: { enabled: true, skipPaths: [], allowSubjectChaosPaths: ['steampunk-scene','airship-skies','steampunk-curio','steampunk-spectacle','steam-transport'] },
  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '65-90',
    polishedWordsByPath: { 'sexy-steampunk-woman': '80-110', 'steampunk-man': '80-110' },
    preservePhrasesByPath: {
      'steampunk-man': [
        'Black', 'Mahogany', 'Sepia', 'Persian', 'Indian', 'Asian', 'Mediterranean', 'Greek', 'Italian', 'Egyptian', 'Moroccan', 'Caribbean',
        'man with', 'eyes',
        'mustache', 'beard', 'clean-shaven', 'mutton chops', 'handlebar', 'Van Dyke', 'goatee',
        'salt-and-pepper', 'silver', 'iron-grey', 'auburn', 'sandy-blond', 'pomaded', 'shaved', 'queue',
        'amber', 'olive-green', 'ice-blue', 'steel-grey', 'pewter',
      ],
      'sexy-steampunk-woman': [
        // Ethnicity / skin tokens
        'Black', 'African', 'Senegalese', 'Ethiopian', 'Caribbean', 'Afro',
        'East Asian', 'Chinese', 'Japanese', 'Korean', 'Vietnamese', 'Thai',
        'South Asian', 'Indian', 'Pakistani', 'Sri Lankan', 'Bangladeshi',
        'Persian', 'Arab', 'Middle Eastern', 'Levantine', 'Egyptian', 'Moroccan',
        'Latin', 'Latina', 'Mexican', 'Mestiza', 'Hispanic',
        'Indigenous', 'Native', 'Navajo', 'Polynesian', 'Maori', 'Hawaiian', 'Pacific Islander',
        'Mediterranean', 'Greek', 'Italian', 'Spanish', 'Sicilian',
        'European', 'English', 'Nordic', 'Celtic', 'Irish', 'Scottish',
        // Skin tone descriptors
        'cocoa', 'mahogany', 'ebony', 'sepia', 'walnut-brown', 'caramel', 'wheat', 'olive', 'porcelain', 'ivory', 'alabaster', 'bronze', 'copper', 'jade', 'amber',
        // Hair color tokens
        'raven', 'jet-black', 'auburn', 'copper-red', 'ginger', 'platinum', 'silver', 'flax-blonde', 'honey-blonde', 'salt-and-pepper',
        // Eye color tokens
        'amber', 'jade', 'sage-green', 'ice-blue', 'violet', 'hazel', 'tawny', 'antique-bronze', 'steel-grey',
      ],
    },
  },
  sensoryAnchors: {
    enabled: true,
    requiredChannels: ['lightcolor'],
    pathContext: {
      'sexy-steampunk-woman': 'female',
      'steampunk-man': 'male',
      'steampunk-scene': 'scene',
      'airship-skies': 'scene', 'steampunk-curio': 'scene',
      'steampunk-spectacle': 'scene', 'steam-transport': 'scene',
    },
    poolsByContextAndChannel: pools.SENSORY_POOLS,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`SteamBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] SteamBot`;
  },
};
