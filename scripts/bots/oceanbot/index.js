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
 * Status: 10/10 paths live (built out 2026-06-04 in one session). Bot is
 * active in bot_schedules at 4 posts/day (flipped 2026-06-03). All
 * paths use the same lean 4-axis architecture (2 path slots +
 * lighting + atmosphere universals) — the hero pool entries are dense
 * enough to carry the scene without the 10+ axis architecture that
 * produced over-stuffed / anachronistic R0 renders earlier. See
 * archetypes.js header for the full axis-count diagnosis.
 *
 * Path roadmap (Kevin 2026-06-02 — all complete):
 *   Naval lore (5):  ★ shipwreck-kingdom, ★ lost-cities, ★ pirates,
 *                    ★ ghost-ship, ★ kraken-leviathan
 *   Scenic (5):      ★ deep-wonder, ★ whale-encounter, ★ reef-paradise,
 *                    ★ polar-seas, ★ bioluminescent-night
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
  'reef-paradise': require('./paths/reef-paradise'),
  'polar-seas': require('./paths/polar-seas'),
  'bioluminescent-night': require('./paths/bioluminescent-night'),
  // FUNCTION-FORM character path (not declarative archetype) — rich
  // inline guardrails per the GothBot vampire-assassin-female pattern.
  // Synthesized from the 2026-06-04 4-bot character-path research.
  // Mer-folk anatomy is a known Flux weak zone (legacy OceanBot
  // mermaid-legend was RETIRED 2026-05-01 for unreliable renders) —
  // this attempt leans HARD into painted register + explicit tail
  // anatomy mandate + cultural diversity to break the failure prior.
  'mystical-mermaid': require('./paths/mystical-mermaid'),
  // 3 new wildlife scenic paths (Kevin 2026-06-05) — same lean 4-axis
  // shape as the other scenic paths.
  'seaturtle-scape': require('./paths/seaturtle-scape'),
  'wild-sealife-camera': require('./paths/wild-sealife-camera'),
  'tropical-fish-closeup': require('./paths/tropical-fish-closeup'),
  'coastal-power': require('./paths/coastal-power'),
};

module.exports = {
  username: 'oceanbot',
  displayName: 'OceanBot',

  // 4 standard mediums — no custom bot-only mediums for the 10 scene
  // paths. photography is the primary NatGeo-wreck-discovery register;
  // canvas activates the Pre-Raphaelite painted-maritime tradition
  // (Turner/Aivazovsky); the others give register variety.
  //
  // 'oceanbot_pirate_paint' is a bot-only medium pinned only to the
  // pirate-girl path via mediumByPath — NOT exposed in the user-facing
  // mediums list (it's a path-locked style register, not a freestanding
  // user choice). Same pattern as SteamBot's steambot-painted-woman.
  mediums: ['photography', 'canvas', 'watercolor', 'illustration'],

  // mediumStyles overrides:
  // • canvas (scene paths): Pre-Raphaelite maritime oil tradition
  // • oceanbot_mermaid_paint (mystical-mermaid only): classical
  //   storybook illustration with smooth shading + readable
  //   anatomy (2026-06-05 rewrite — see shared-blocks comment)
  mediumStyles: {
    canvas: blocks.CANVAS_MARITIME,
    oceanbot_mermaid_paint: blocks.MERMAID_PAINT,
    oceanbot_gpt_clean: blocks.GPT_CLEAN,
  },

  // gpt-image-2 + nano-banana clean-render override (2026-06-07). Both models
  // read the maritime-oil anchors as "go abstract"; the clean medium (+ empty
  // promptPrefixByMedium) lets the seed's ocean scene lead. mystical-mermaid is
  // EXCLUDED — it's gpt-2-locked with its own painted mer-folk medium
  // (mediumByPath below), so skipPaths keeps that look intact.
  // cleanMediumByModel retired 2026-06-21 — only ever routed Nano Banana / gpt-2,
  // both now banned bot-wide (FLUX-only).
  cleanMediumByModel: {},
  promptPrefixByMedium: {
    oceanbot_gpt_clean: '',
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // 3-model scene-eligible lineup. Dropped flux-2-pro bot-wide
  // 2026-06-05 (Kevin call) — was consistently the weakest of the 4
  // on this bot's painted/photoreal register and Kevin's heart-
  // pattern across paths showed it never landed a winner. Was banned
  // per-path on mystical-mermaid (R1b) for the same reason. Removing
  // bot-wide simplifies. Prior bans: flux-2-max + flux-2-flex (fleet
  // bans), flux-dev (artistic-fights-ocean-photoreal), flux-1.1-pro
  // (redundant with Ultra after dream_mediums fix surfaced Ultra).
  useModelPicker: true,
  // Nano Banana removed 2026-06-21 (banned fleet-wide). Bot-wide lineup is
  // flux-1.1-pro-ultra + flux-1.1-pro (1.1-pro re-allowed alongside ultra
  // fleet-wide, Kevin 2026-06-21).
  allowedModels: ['black-forest-labs/flux-1.1-pro-ultra', 'black-forest-labs/flux-1.1-pro'],

  // Per-path model bans (Kevin 2026-06-04). lost-cities + pirates used
  // to have their own modelByPath dropping flux-1.1-pro; that became
  // redundant when flux-1.1-pro was dropped bot-wide, so those entries
  // are gone. Only paths that DIFFER from the new bot-wide lineup keep
  // an override here.
  modelByPath: {
    // ghost-ship: bot-wide MINUS GPT Image 2 — the haunted/spectral
    // register reads stronger on the other 2 models. Down to 2.
    // (flux-2-pro dropped from this entry when removed bot-wide
    // 2026-06-05.)
    'ghost-ship': ['black-forest-labs/flux-1.1-pro-ultra', 'black-forest-labs/flux-1.1-pro'],
    // deep-wonder: the abyssal-black bioluminescent register reads
    // strongest on Ultra. (Gemini dropped earlier; gpt-image-2 removed
    // 2026-06-17 with the fleet-wide ban.) Down to 1.
    'deep-wonder': ['black-forest-labs/flux-1.1-pro-ultra', 'black-forest-labs/flux-1.1-pro'],
    // bioluminescent-night: bot-wide MINUS Flux 2 Pro PLUS Flux 1.1 Pro
    // (re-enabled here even though banned bot-wide). Kevin's call from
    // R0b — Flux 2 Pro reads off for the surface-glow register and
    // Flux 1.1 Pro fits better here than on other paths. Stays at 4.
    'bioluminescent-night': [
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    // mystical-mermaid: DEACTIVATED 2026-06-17 (removed from the active
    // `paths` list below) because it was HARD-LOCKED to gpt-image-2, which
    // is now banned fleet-wide. It was gpt-2-only on purpose: flux-1.1-pro-
    // ultra + gemini-2-image both render bare-chest even with an explicit
    // chest-covering described, and OpenAI's content policy was the only
    // one that reliably refused. With gpt-2 gone there's no safe model, so
    // the path is parked (files + pools kept). To revive: find a model that
    // holds the chest-covering, re-add it here, and re-list the path.
  },

  // Force-pin mystical-mermaid to the bot-only painted-mer-folk medium
  // (Waterhouse / Dulac / Rackham lineage). Scene paths fall through
  // to whatever the dispatcher rolls from the 4 standard mediums.
  // Same pattern as SteamBot's mediumByPath pin to steambot-painted-
  // woman for airship-female / sexy-steampunk-woman.
  mediumByPath: {
    'mystical-mermaid': 'oceanbot_mermaid_paint',
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

  // No per-path vibe overrides — every OceanBot path (including
  // reef-paradise and mystical-mermaid) uses the bot-wide 10-vibe list.
  // Earlier trims (reef-paradise dark-vibe drop 2026-06-04, mystical-
  // mermaid mystical-coded subset) were reversed 2026-06-05: full
  // vibe surface area across the bot.
  vibesByPath: {},

  paths: [
    'shipwreck-kingdom',
    'lost-cities',
    'pirates',
    'ghost-ship',
    'kraken-leviathan',
    'deep-wonder',
    'whale-encounter',
    'reef-paradise',
    'polar-seas',
    'bioluminescent-night',
    // 'mystical-mermaid' — DEACTIVATED 2026-06-17 (gpt-2-only path; gpt-2
    // banned fleet-wide). Files + pools kept; see modelByPath note above.
    'seaturtle-scape',
    'wild-sealife-camera',
    'tropical-fish-closeup',
    'coastal-power',
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
      'reef-paradise',
      'polar-seas',
      'bioluminescent-night',
      // mystical-mermaid: skip per the StarBot R1 lesson — Haiku
      // polish strips load-bearing character DNA (ethnicity-noun,
      // tail-anatomy specifics, hair/adornment detail, mystical-
      // element token), leaving Flux's generic-mermaid-portrait
      // default. Single-pass Sonnet preserves the full stack.
      'mystical-mermaid',
      // 3 new wildlife paths — same axis-system polish-skip pattern
      // as the other scenic paths.
      'seaturtle-scape',
      'wild-sealife-camera',
      'tropical-fish-closeup',
      'coastal-power',
    ],
  },

  // Chaos + sensory anchors — DISABLED for the pilot. We're keeping the
  // brief lean to validate the base recipe first. Will revisit per-path
  // after the pilot ships and other paths fan out.
  chaos: { enabled: false, skipPaths: [], allowSubjectChaosPaths: [] },

  // 2026-06-06 — post-render Haiku-vision nudity check for mystical-mermaid.
  // Mermaids render bare-chested sometimes despite shell-bra / coral-bra
  // outfit prompts. On flag, the whole render re-rolls. See
  // scripts/lib/nudityCheck.js for the classifier.
  nudityCheck: {
    enabled: true,
    maxRetries: 2,
    paths: ['mystical-mermaid'],
  },

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
    // Function-form paths (e.g. pirate-girl) — rich character templates
    // with inline guardrails. Pattern mirrored from GothBot's
    // vampire-assassin-female. Called directly with the standard args
    // and must return the Sonnet brief string.
    if (typeof builder === 'function') {
      return builder({ sharedDNA, vibeDirective, picker });
    }
    // Declarative archetype paths (the 10 lean OceanBot scene paths)
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
