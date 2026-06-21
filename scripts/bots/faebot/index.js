/**
 * FaeBot — the bot-engine contract.
 *
 * Candid magical-forest-creature illustrations — dryads, nymphs, leshy,
 * kodama, fox-spirits, glow-moths. Each render is a hidden-camera glimpse
 * of an exotic mythic creature with stacked plant-merged features (vine-
 * hair, moss-tinted skin, leaf-garments, magical glow). Painterly fantasy
 * concept art. POC currently runs a single path (forest-fairy-scene).
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'forest-fairy-scene': require('./paths/forest-fairy-scene'),
  'dryad-portrait': require('./paths/dryad-portrait'),
  'forest-elder': require('./paths/forest-elder'),
  'female-druid': require('./paths/female-druid'),
  'female-druid-adventure': require('./paths/female-druid-adventure'),
  'male-druid': require('./paths/male-druid'),
  'male-druid-adventure': require('./paths/male-druid-adventure'),
  'tiny-fae': require('./paths/tiny-fae'),
  'queen-of-the-forest': require('./paths/queen-of-the-forest'),
  'enchanted-vista': require('./paths/enchanted-vista'),
  'fae-village': require('./paths/fae-village'),
  'fae-village-axis': require('./paths/fae-village-axis'),
  'flower-fairy': require('./paths/flower-fairy'),
  'fae-court': require('./paths/fae-court'),
  'elven-city': require('./paths/elven-city'),
  'fae-castle-village': require('./paths/fae-castle-village'),
  'fae-wilds-village': require('./paths/fae-wilds-village'),
  'fae-natural-village': require('./paths/fae-natural-village'),
};

module.exports = {
  username: 'faebot',
  displayName: 'FaeBot',

  // HARDCODED MEDIUM — every render uses bande_dessinee_fantasy. Bot-
  // internal medium key (not in dream_mediums DB). The bot's mediumStyles
  // override provides the full directive to Flux. DLT replay reproduces
  // the look via Phase 2.2c synthesis from recipe.medium_style_override.
  defaultMedium: 'painted_fantasy_novel',

  // flower-fairy uses painted_fantasy_novel (FaeBot's default) so it
  // matches the soft painterly look of the other FaeBot paths
  // (Manchess + Giancola + Bonner painted-fantasy lineage).
  // mediumByPath omitted — flower-fairy falls through to defaultMedium.

  // Override the DB flux_fragment for this medium key with the locked
  // painted-fantasy-novel directive (Manchess + Giancola + Bonner + Wyeth
  // + Frazetta painted-fantasy lineage). Visible brush strokes + painted
  // edges + romantic painted atmosphere. NOT ink-outlined, NOT animation.
  mediumStyles: {
    painted_fantasy_novel: blocks.PAINTED_FANTASY_NOVEL_MEDIUM,
    faebot_gpt_clean: blocks.GPT_CLEAN,
  },

  // nano-banana clean-render override (2026-06-07; no gpt-image-2 in FaeBot's
  // lineup). Banana reads the painted graphic-novel anchors as "go abstract";
  // the clean medium (+ empty promptPrefixByMedium) lets the seed's fae scene lead.
  // cleanMediumByModel retired 2026-06-21 — only ever routed Nano Banana / gpt-2,
  // both now banned bot-wide (FLUX-only).
  cleanMediumByModel: {},

  // Per-medium prompt prefix overrides for flower-fairy: lead with painterly
  // + fae register so Flux lands on the soft ethereal style FaeBot wants.
  promptPrefixByMedium: {
    // 2026-06-02 cruft-audit micro-strip — dropped trailing `NOT photoreal
    // NOT polished CGI`. The "painted fantasy / oil-brushwork / painted-
    // fantasy lineage" positive anchors hold the register.
    painted_fantasy_novel:
      'soft ethereal painterly fantasy illustration, visible oil-brushwork, painted fantasy concept art, Greg Manchess + Donato Giancola + Paul Bonner + Brian Froud painted-fantasy lineage, dreamy atmospheric painted glow',
    faebot_gpt_clean: '',
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // Vibes that fit the peaceful-fairy mood. These translate to vibeDirective
  // (from dream_vibes DB) which Sonnet uses for mood context.
  vibes: ['peaceful', 'enchanted', 'ethereal', 'nostalgic', 'whimsical'],

  paths: [
    'forest-fairy-scene',
    'dryad-portrait',
    'forest-elder',
    'female-druid',
    'female-druid-adventure',
    'male-druid',
    'male-druid-adventure',
    'tiny-fae',
    'queen-of-the-forest',
    'enchanted-vista',
    'fae-village',
    'fae-village-axis',
    'flower-fairy',
    'fae-court',
    'elven-city',
    'fae-castle-village',
    'fae-wilds-village',
    'fae-natural-village',
  ],
  // Flat rotation (2026-05-26): equal weight per path — every path posts
  // once per cycle in randomized order via the cycleAllPaths shuffle-bag.
  cycleAllPaths: true,

  // Picker on with the BOT_MODEL_TALLY 6-model lineup (2026-05-30):
  // Banana + GPT-2 + Flux 2 Pro + Flux 1.1 Pro + Flux 1.1 Pro Ultra + Flux 2 Max.
  // Dropped per Kevin's review: Flux Dev, Flux 2 Flex.
  useModelPicker: true,
  // Trimmed to 3 (Kevin 2026-06-02): Banana + F1.1 Pro + F1.1 Pro Ultra.
  // History: flux-2-pro removed 2026-06-01; gpt-image-2 + flux-2-max removed today.
  // Nano Banana banned fleet-wide 2026-06-21 (Kevin) — bots are FLUX-ONLY.
  allowedModels: ['black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-1.1-pro-ultra'],
  // modelByPath: stripped 2026-05-30 to let allowedModels picker drive selection.
  // Original locks (restore individual lines if a path needs pinning again):
  // modelByPath: {
  // 'forest-fairy-scene': 'black-forest-labs/flux-1.1-pro',
  // 'dryad-portrait': 'black-forest-labs/flux-1.1-pro',
  // 'tiny-fae': 'black-forest-labs/flux-1.1-pro',
  // 'queen-of-the-forest': 'black-forest-labs/flux-1.1-pro',
  // 'enchanted-vista': 'black-forest-labs/flux-1.1-pro',
  // 'fae-village': 'black-forest-labs/flux-1.1-pro',
  // 'fae-village-axis': 'black-forest-labs/flux-1.1-pro',
  // 'flower-fairy': 'black-forest-labs/flux-1.1-pro',
  // },

  // Disable chaos + sensory anchors for POC — keep the prompt clean and
  // the look consistent. We can layer those in later if we want texture.
  chaos: { enabled: false, allowSubjectChaosPaths: [] },
  sensoryAnchors: { enabled: false },

  // 2026-06-06 — post-render Haiku-vision nudity check for character paths.
  // Flux occasionally renders fae / dryad / nymph character paths with bare
  // chests despite covered-outfit prompts. On flag, the whole render re-rolls
  // (fresh picker + fresh brief). enchanted-vista skipped — pure landscape.
  // See scripts/lib/nudityCheck.js for the classifier.
  nudityCheck: {
    enabled: true,
    maxRetries: 2,
    paths: [
      'dryad-portrait',
      'forest-elder',
      'female-druid',
      'female-druid-adventure',
      'male-druid',
      'male-druid-adventure',
      'flower-fairy',
      'forest-fairy-scene',
      'queen-of-the-forest',
      'tiny-fae',
      'fae-court',
    ],
  },

  // Two-pass Sonnet → Haiku polish. Sonnet writes a vivid concept,
  // Haiku polishes to ~70 words for clean Flux input.
  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '65-90',
    // Axis-system paths skip polish — Haiku compression strips
    // load-bearing axis language. tiny-fae: dwarfing-companion mandate.
    // queen-of-the-forest: posed-setting + critters-paying-respects mandates.
    // enchanted-vista: multi-layer richness (canopy + hero + floor + water + magic + depth).
    // fae-village + fae-village-axis: both skip polish — Kevin's legacy comparison
    // batches were polish-skipped, that's the look he approved for both paths.
    // forest-elder: skip polish — the male GENDER-LOCK (he/his/bearded) is the
    // load-bearing element; Haiku compression strips it and androgyny returns.
    skipPaths: [
      'forest-elder',
      'female-druid',
      'female-druid-adventure',
      'male-druid',
      'male-druid-adventure',
      'tiny-fae',
      'queen-of-the-forest',
      'enchanted-vista',
      'fae-village',
      'fae-village-axis',
      'fae-court',
      'elven-city',
      'fae-castle-village',
      'fae-wilds-village',
      'fae-natural-village',
    ],
  },

  // Bot-level pool defaults for declarative composer (flower-fairy path)
  defaultPools: {},
  poolByName(name) {
    if (!(name in pools)) {
      throw new Error(`FaeBot.poolByName: unknown pool "${name}"`);
    }
    return pools[name];
  },

  rollSharedDNA({ vibeKey }) {
    return {
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.peaceful,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`FaeBot: unknown path "${path}"`);
    // Declarative axis-system paths export an object { archetype, pools }.
    // Legacy function-form paths export a function. Dispatch on shape.
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
    throw new Error(`FaeBot: path "${path}" has invalid export shape`);
  },

  caption({ path }) {
    return `[${path}] FaeBot`;
  },
};
