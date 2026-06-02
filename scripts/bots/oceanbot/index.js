/**
 * OceanBot — the bot-engine contract.
 *
 * BBC Blue Planet × Pre-Raphaelite oil painting × Master and Commander.
 * The full ocean experience — underwater wonder, surface drama, maritime
 * myth, deep-sea bioluminescence, polar seas, age-of-sail, sea-monsters,
 * sunken civilization, painted mermaid mythology.
 *
 * Bot stays INACTIVE in bot_schedules until path TLC is complete + Kevin
 * approves quality. Then we flip active=true to start cron posting.
 *
 * 2026-06-01 — fresh-design v2 build using the modern axis-system
 * architecture (per the MangaBot Phase-2 overhaul + the recent
 * scene-eligible model gate). Legacy OceanBot from 2026-04 was deleted
 * 2026-05-05 — see git history (commits 4d348ed4..013ca103). This is
 * NOT a restore; it's a from-scratch rebuild for the v2 fleet.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  // Nature / biome-led paths (scene is hero)
  'deep-wonder': require('./paths/deep-wonder'),
  'undersea-seascape': require('./paths/undersea-seascape'),
  'shipwreck-kingdom': require('./paths/shipwreck-kingdom'),
  'polar-seas': require('./paths/polar-seas'),
  'calm-glass-sea': require('./paths/calm-glass-sea'),
  'whale-encounter': require('./paths/whale-encounter'),
  'bioluminescent-night': require('./paths/bioluminescent-night'),
  'storm-surface': require('./paths/storm-surface'),
  // Anchor-led paths (vessel / leviathan / mythic figure is hero)
  'ghost-ship': require('./paths/ghost-ship'),
  'kraken-leviathan': require('./paths/kraken-leviathan'),
  'lost-cities': require('./paths/lost-cities'),
  pirates: require('./paths/pirates'),
  'mermaid-myth': require('./paths/mermaid-myth'),
};

module.exports = {
  username: 'oceanbot',
  displayName: 'OceanBot',

  // 4 mediums per Kevin's spec — 3 photoreal (hyperreal / render) and
  // canvas for the painted maritime tradition (ghost-ship / kraken /
  // lost-cities / pirates / mermaid-myth lean here via promptPrefixByMedium
  // override that injects Turner/Aivazovsky/Pre-Raphaelite heritage).
  // illustration is the soft crossover register.
  mediums: ['hyperreal', 'render', 'canvas', 'illustration'],

  // Per-medium override — painted-maritime register injects when medium=canvas.
  // For hyperreal/render the rolled medium's directive already pumps photoreal
  // ocean cinematography. illustration falls through to the base style block.
  promptPrefixByMedium: {
    canvas: blocks.PAINTED_MARITIME_BLOCK,
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // 6-model scene-eligible set per Kevin's 2026-06-01 spec. Same lineup the
  // nightly scene gate uses (engine_config.scene_eligible_models). Drops
  // flux-dev + flux-2-flex (artistic-register / loose models that fight the
  // hyperreal-ocean look).
  useModelPicker: true,
  allowedModels: [
    'google/gemini-2-image',
    'openai/gpt-image-2',
    'black-forest-labs/flux-1.1-pro',
    'black-forest-labs/flux-1.1-pro-ultra',
    'black-forest-labs/flux-2-pro',
    'black-forest-labs/flux-2-max',
  ],

  // 10 ocean-coded vibes (of 16 available). Drops coquette, shimmer, cozy,
  // macabre, surreal, dreamy, arcane, fierce — none fit ocean drama / wonder
  // / age-of-sail / mythic register.
  vibes: [
    'cinematic',
    'dark',
    'peaceful',
    'epic',
    'nostalgic',
    'ethereal',
    'ancient',
    'enchanted',
    'voltage',
    'nightshade',
  ],

  paths: [
    'deep-wonder',
    'undersea-seascape',
    'shipwreck-kingdom',
    'polar-seas',
    'calm-glass-sea',
    'whale-encounter',
    'bioluminescent-night',
    'storm-surface',
    'ghost-ship',
    'kraken-leviathan',
    'lost-cities',
    'pirates',
    'mermaid-myth',
  ],

  // Flat round-robin shuffle-bag (matches the 2026-05-26 fleet flatten):
  // each path posts once per cycle in randomized order before reshuffling.
  cycleAllPaths: true,

  // Axis-system paths skip Haiku polish per `feedback_axis_system_skip_polish`
  // — polish strips the rolled camera_framing / bespoke axis text, defeating
  // the variety we just built into the pools. Confirmed across MangaBot
  // Wave 1-4. All 13 OceanBot paths are axis-driven so all skip polish.
  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '65-90',
    skipPaths: [
      'deep-wonder',
      'undersea-seascape',
      'shipwreck-kingdom',
      'polar-seas',
      'calm-glass-sea',
      'whale-encounter',
      'bioluminescent-night',
      'storm-surface',
      'ghost-ship',
      'kraken-leviathan',
      'lost-cities',
      'pirates',
      'mermaid-myth',
    ],
    polishedWordsByPath: {},
    preservePhrasesByPath: {},
  },

  // Chaos enabled for atmospheric drama. Scene paths get full chaos; anchor
  // paths (ghost-ship / kraken / mermaid-myth) get subject-chaos allowed for
  // mythic weirdness. Per `chaos: { allowSubjectChaosPaths }` pattern.
  chaos: {
    enabled: true,
    skipPaths: [],
    allowSubjectChaosPaths: [
      'deep-wonder',
      'undersea-seascape',
      'shipwreck-kingdom',
      'polar-seas',
      'calm-glass-sea',
      'whale-encounter',
      'bioluminescent-night',
      'storm-surface',
      'ghost-ship',
      'kraken-leviathan',
      'lost-cities',
      'pirates',
      'mermaid-myth',
    ],
  },

  sensoryAnchors: {
    enabled: true,
    requiredChannels: ['lightcolor'],
    pathContext: {
      'deep-wonder': 'scene',
      'undersea-seascape': 'scene',
      'shipwreck-kingdom': 'scene',
      'polar-seas': 'scene',
      'calm-glass-sea': 'scene',
      'whale-encounter': 'scene',
      'bioluminescent-night': 'scene',
      'storm-surface': 'scene',
      'ghost-ship': 'scene',
      'kraken-leviathan': 'scene',
      'lost-cities': 'scene',
      pirates: 'scene',
      'mermaid-myth': 'scene',
    },
    poolsByContextAndChannel: pools.SENSORY_POOLS,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
    };
  },

  // Universal-axis defaults — composer resolves lighting/atmosphere via
  // these when paths don't override. Path-bespoke pools live wired into
  // pathBuilders[*].pools.
  defaultPools: {
    lighting: 'LIGHTING',
    atmosphere: 'ATMOSPHERES',
  },

  // Composer reads path-bespoke pools by name via this. All wired keys
  // live as top-level exports on pools.js.
  poolByName(name) {
    if (!(name in pools)) {
      throw new Error(`OceanBot.poolByName: unknown pool "${name}"`);
    }
    return pools[name];
  },

  // Standard axis-system buildBrief — delegates to the shared composer.
  // `model` is the pre-picked renderModel from botEngine; the composer
  // uses it to entity-cap the rolled slots for high-detail models.
  buildBrief({ path, sharedDNA, vibeDirective, picker, model }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`OceanBot: unknown path "${path}"`);
    if (builder && typeof builder === 'object' && builder.archetype) {
      const { composeBrief } = require('../../lib/brief-composer');
      return composeBrief({
        bot: module.exports,
        pathConfig: builder,
        sharedDNA,
        vibeDirective,
        picker,
        model,
      });
    }
    throw new Error(`OceanBot: path "${path}" has invalid export shape`);
  },

  caption({ path }) {
    return `[${path}] OceanBot`;
  },

  pathBuilders,
};
