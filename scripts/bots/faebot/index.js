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
  'fairy-court': require('./paths/fairy-court'),
  'enchanted-vista': require('./paths/enchanted-vista'),
};

module.exports = {
  username: 'faebot',
  displayName: 'FaeBot',

  // HARDCODED MEDIUM — every render uses bande_dessinee_fantasy. Bot-
  // internal medium key (not in dream_mediums DB). The bot's mediumStyles
  // override provides the full directive to Flux. DLT replay reproduces
  // the look via Phase 2.2c synthesis from recipe.medium_style_override.
  defaultMedium: 'painted_fantasy_novel',

  // Override the DB flux_fragment for this medium key with the locked
  // painted-fantasy-novel directive (Manchess + Giancola + Bonner + Wyeth
  // + Frazetta painted-fantasy lineage). Visible brush strokes + painted
  // edges + romantic painted atmosphere. NOT ink-outlined, NOT animation.
  mediumStyles: {
    painted_fantasy_novel: blocks.PAINTED_FANTASY_NOVEL_MEDIUM,
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // Vibes that fit the peaceful-fairy mood. These translate to vibeDirective
  // (from dream_vibes DB) which Sonnet uses for mood context.
  vibes: ['peaceful', 'enchanted', 'ethereal', 'nostalgic', 'whimsical'],

  paths: ['forest-fairy-scene', 'dryad-portrait', 'tiny-fae', 'fairy-court', 'enchanted-vista'],
  pathWeights: {
    'forest-fairy-scene': 1,
    'dryad-portrait': 1,
    'tiny-fae': 1,
    'fairy-court': 1,
    'enchanted-vista': 1,
  },

  // Use flux-dev for painterly / illustrative looks (better than 1.1-pro
  // for stylized non-photoreal). Lock to flux-dev for POC.
  useModelPicker: false,
  modelByPath: {
    'forest-fairy-scene': 'black-forest-labs/flux-1.1-pro',
    'dryad-portrait': 'black-forest-labs/flux-1.1-pro',
    'tiny-fae': 'black-forest-labs/flux-1.1-pro',
    'fairy-court': 'black-forest-labs/flux-1.1-pro',
    'enchanted-vista': 'black-forest-labs/flux-1.1-pro',
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
  },

  rollSharedDNA({ vibeKey }) {
    return {
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.peaceful,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`FaeBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] FaeBot`;
  },
};
