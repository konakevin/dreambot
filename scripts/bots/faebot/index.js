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
  'tiny-fae': require('./paths/tiny-fae'),
  'queen-of-the-forest': require('./paths/queen-of-the-forest'),
  'enchanted-vista': require('./paths/enchanted-vista'),
  'fae-village': require('./paths/fae-village'),
  'fae-village-axis': require('./paths/fae-village-axis'),
  'flower-fairy': require('./paths/flower-fairy'),
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
  },

  // Per-medium prompt prefix overrides for flower-fairy: lead with painterly
  // + fae register so Flux lands on the soft ethereal style FaeBot wants.
  promptPrefixByMedium: {
    painted_fantasy_novel:
      'soft ethereal painterly fantasy illustration, visible oil-brushwork, painted fantasy concept art, Greg Manchess + Donato Giancola + Paul Bonner + Brian Froud painted-fantasy lineage, dreamy atmospheric painted glow, NOT photoreal NOT polished CGI',
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // Vibes that fit the peaceful-fairy mood. These translate to vibeDirective
  // (from dream_vibes DB) which Sonnet uses for mood context.
  vibes: ['peaceful', 'enchanted', 'ethereal', 'nostalgic', 'whimsical'],

  paths: ['forest-fairy-scene', 'dryad-portrait', 'tiny-fae', 'queen-of-the-forest', 'enchanted-vista', 'fae-village', 'fae-village-axis', 'flower-fairy'],
  pathWeights: {
    'forest-fairy-scene': 1,
    'dryad-portrait': 1,
    'tiny-fae': 1,
    'queen-of-the-forest': 1,
    'enchanted-vista': 1,
    'fae-village': 1,
    'fae-village-axis': 1,
    'flower-fairy': 2,
  },

  // Use flux-dev for painterly / illustrative looks (better than 1.1-pro
  // for stylized non-photoreal). Lock to flux-dev for POC.
  useModelPicker: false,
  modelByPath: {
    'forest-fairy-scene': 'black-forest-labs/flux-1.1-pro',
    'dryad-portrait': 'black-forest-labs/flux-1.1-pro',
    'tiny-fae': 'black-forest-labs/flux-1.1-pro',
    'queen-of-the-forest': 'black-forest-labs/flux-1.1-pro',
    'enchanted-vista': 'black-forest-labs/flux-1.1-pro',
    'fae-village': 'black-forest-labs/flux-1.1-pro',
    'fae-village-axis': 'black-forest-labs/flux-1.1-pro',
    'flower-fairy': 'black-forest-labs/flux-1.1-pro',
  },

  // Disable chaos + sensory anchors for POC — keep the prompt clean and
  // the look consistent. We can layer those in later if we want texture.
  chaos: { enabled: false, allowSubjectChaosPaths: [] },
  sensoryAnchors: { enabled: false },

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
    skipPaths: ['tiny-fae', 'queen-of-the-forest', 'enchanted-vista', 'fae-village', 'fae-village-axis'],
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
