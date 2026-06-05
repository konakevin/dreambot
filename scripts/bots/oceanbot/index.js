/**
 * OceanBot v3 — the bot-engine contract.
 *
 * Old naval lore × scenic ocean nature. NatGeo deep-water cinematography
 * crossed with age-of-sail maritime tradition. Built 2026-06-02 to
 * resurrect the bot that was retired 2026-05-05 (commit 013ca103) and
 * fold in all lessons from the recent fleet cruft-sweep wave.
 *
 * Architecture: pure axis-system per-path (no entity-cap). Backwards
 * compatible with the standing engine — no shared-lib changes required.
 *
 * Status: 2 paths live — shipwreck-kingdom + lost-cities (both naval-
 * lore underwater siblings). Bot is active in bot_schedules at 4
 * posts/day (flipped 2026-06-03). Other 8 paths land as the bot
 * matures, in roadmap order.
 *
 * Path roadmap (Kevin 2026-06-02):
 *   Naval lore (5):  pirates, kraken-leviathan, ghost-ship,
 *                    ★ shipwreck-kingdom, ★ lost-cities
 *   Scenic (5):      deep-wonder, whale-encounter, reef-paradise,
 *                    polar-seas, bioluminescent-night
 *
 * Style discipline (per 2026-06-01/02 fleet cruft sweep):
 *   • Short single-anchor prompt prefix / suffix (no enumeration locks)
 *   • Zero negation chains in any layer (no "NOT X" leakage)
 *   • Standard mediums only (NO bot-only mediums — legacy v1's
 *     maritime_oil_* mediums were the negation-soup vehicle that
 *     contributed to retirement)
 *   • Per-medium overrides only where they earn their keep, ≤150ch each
 *   • Pre-1850 wooden vessels for ship rendering (legacy lesson f7f319cf)
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'shipwreck-kingdom': require('./paths/shipwreck-kingdom'),
  'lost-cities': require('./paths/lost-cities'),
  pirates: require('./paths/pirates'),
  'ghost-ship': require('./paths/ghost-ship'),
  'kraken-leviathan': require('./paths/kraken-leviathan'),
  'deep-wonder': require('./paths/deep-wonder'),
  'whale-encounter': require('./paths/whale-encounter'),
  // Other 3 paths land as the bot matures.
};

module.exports = {
  username: 'oceanbot',
  displayName: 'OceanBot',

  // 4 standard mediums — no custom bot-only mediums. photography is the
  // primary NatGeo-wreck-discovery register; canvas activates the
  // Pre-Raphaelite painted-maritime tradition (Turner/Aivazovsky); the
  // others give register variety.
  mediums: ['photography', 'canvas', 'watercolor', 'illustration'],

  // ONE bot-bespoke medium override — canvas activates the painted
  // maritime tradition. Short single-anchor anchor (≤150ch), zero
  // negation. The other 3 mediums fall through to their DB defaults.
  mediumStyles: {
    canvas: blocks.CANVAS_MARITIME,
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // 5-model scene-eligible lineup. Matches StarBot's recently-curated
  // set. Drops flux-2-max + flux-2-flex (fleet-wide bans per recent
  // session) and flux-dev (artistic register fights ocean photoreal).
  useModelPicker: true,
  allowedModels: [
    'google/gemini-2-image',
    'openai/gpt-image-2',
    'black-forest-labs/flux-1.1-pro',
    'black-forest-labs/flux-1.1-pro-ultra',
    'black-forest-labs/flux-2-pro',
  ],

  // Per-path model bans (Kevin 2026-06-04).
  // • lost-cities: bot-wide MINUS Flux 1.1 Pro — Ultra renders the
  //   sunken-stone ruins more atmospherically, Pro reads flatter.
  // • pirates: bot-wide MINUS Flux 1.1 Pro — same call from R0 batch;
  //   the maritime-cinema cutlass/lantern look reads stronger on the
  //   other 4 models.
  // Both paths down to 4 models. shipwreck-kingdom + future paths still
  // get the full 5-model lineup.
  modelByPath: {
    'lost-cities': [
      'google/gemini-2-image',
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro-ultra',
      'black-forest-labs/flux-2-pro',
    ],
    pirates: [
      'google/gemini-2-image',
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro-ultra',
      'black-forest-labs/flux-2-pro',
    ],
    // ghost-ship: bot-wide MINUS GPT Image 2 — the haunted/spectral
    // register reads stronger on the other 4 models. Down to 4 models.
    'ghost-ship': [
      'google/gemini-2-image',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
      'black-forest-labs/flux-2-pro',
    ],
    // deep-wonder: bot-wide MINUS Gemini 2 Image (Nano Banana) — the
    // abyssal-black bioluminescent register reads stronger on the
    // other 4 models. Down to 4 models.
    'deep-wonder': [
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
      'black-forest-labs/flux-2-pro',
    ],
  },

  // 10 ocean-coded vibes. Drops the 6 that don't fit ocean drama / wonder
  // / age-of-sail (coquette, shimmer, cozy, macabre, surreal, dreamy,
  // arcane, fierce — none of those map cleanly to maritime register).
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
    'shipwreck-kingdom',
    'lost-cities',
    'pirates',
    'ghost-ship',
    'kraken-leviathan',
    'deep-wonder',
    'whale-encounter',
  ],

  // Flat round-robin shuffle-bag (matches 2026-05-26 fleet flatten).
  cycleAllPaths: true,

  // Axis-system paths skip Haiku polish per [[feedback_axis_system_skip_polish]] —
  // polish strips the rolled camera_framing / bespoke axis text. All
  // OceanBot paths are axis-driven so all skip.
  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '65-90',
    skipPaths: [
      'shipwreck-kingdom',
      'lost-cities',
      'pirates',
      'ghost-ship',
      'kraken-leviathan',
      'deep-wonder',
      'whale-encounter',
    ],
  },

  // Chaos + sensory anchors — DISABLED for the pilot. We're keeping the
  // brief lean to validate the base recipe first. Will revisit per-path
  // after the pilot ships and other paths fan out.
  chaos: { enabled: false, skipPaths: [], allowSubjectChaosPaths: [] },

  // Composer reads path-bespoke pools by name via poolByName.
  // Universal axes (lighting / atmosphere) resolve via defaultPools.
  defaultPools: {
    lighting: 'LIGHTING',
    atmosphere: 'ATMOSPHERES',
  },

  poolByName(name) {
    if (!(name in pools)) {
      throw new Error(`OceanBot.poolByName: unknown pool "${name}"`);
    }
    return pools[name];
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, picker }) {
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
      });
    }
    throw new Error(`OceanBot: path "${path}" has invalid export shape`);
  },

  caption({ path }) {
    return `[${path}] OceanBot`;
  },

  pathBuilders,
};
