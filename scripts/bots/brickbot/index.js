/**
 * BrickBot — full rewrite 2026-05-07 (branch: brickbot-rebuild).
 *
 * Architecture: subject is the path identity. Camera + lighting + palette
 * are AXES — camera is shared, lighting + palette are per-path pools that
 * narrow the mood to subject-appropriate ranges. Old camera-as-path
 * organization (cinematic, noir, micro) replaced by subject-as-path:
 * 13 distinct subject domains.
 *
 * Locked: vibe = cinematic only, model = flux-1.1-pro, medium = photography.
 *
 * Each render rolls:
 *   • SCENE from per-path scenes pool (~200 entries, 40% architecture/world,
 *     50% character story scenes with action verbs, 10% mood)
 *   • CAMERA from shared camera_axis pool (~40 entries — the variety knob)
 *   • LIGHTING from per-path lighting pool (~30 entries, subject-tinted)
 *   • PALETTE from per-path palette pool (~30 entries, subject-tinted)
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'macro-display': require('./paths/macro-display'),
  girly: require('./paths/girly'),
  'lego-masters': require('./paths/lego-masters'),
  western: require('./paths/western'),
  fantasy: require('./paths/fantasy'),
  space: require('./paths/space'),
  aquatic: require('./paths/aquatic'),
  winter: require('./paths/winter'),
  pirates: require('./paths/pirates'),
  mech: require('./paths/mech'),
  'theme-park': require('./paths/theme-park'),
  forest: require('./paths/forest'),
  landscape: require('./paths/landscape'),
};

module.exports = {
  username: 'brickbot',
  displayName: 'BrickBot',

  mediums: ['photography'],

  useModelPicker: true,
  allowedModels: ['black-forest-labs/flux-1.1-pro'],
  modelByPath: Object.fromEntries(
    pools.PATHS.map((p) => [p, { 'black-forest-labs/flux-1.1-pro': 100 }])
  ),

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  vibes: ['cinematic'],

  paths: pools.PATHS,

  pathWeights: Object.fromEntries(pools.PATHS.map((p) => [p, 1])),

  chaos: {
    enabled: true,
    skipPaths: [],
    allowSubjectChaosPaths: pools.PATHS,
  },

  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '70-100',
  },

  // No sensoryAnchors — universal LEGO MOC photography mood is captured
  // in shared blocks + per-path lighting/palette already provides plenty
  // of sensory color. Adding a sensory pool would dilute the path identity.

  rollSharedDNA({ picker }) {
    return {
      camera: picker.pickWithRecency(pools.CAMERA_AXIS, 'camera'),
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`BrickBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, picker, pools });
  },

  caption({ path }) {
    return `[${path}] BrickBot`;
  },
};
