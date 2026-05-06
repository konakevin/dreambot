/**
 * MechBot — the bot-engine contract.
 *
 * Cyborgs and droids: half-human half-machine beings + ornate solo robots.
 * Hyper-real cinematic 3D. Ex Machina / Alita / Blade Runner / Westworld /
 * Ghost in the Shell aesthetic.
 *
 * Migrated 2026-05-05 from StarBot — peeled cyborg-woman, cyborg-man, and
 * robot-moment paths into their own bot. StarBot keeps the cosmos / alien
 * worlds / sci-fi-IP scenes; MechBot owns the machine-character territory.
 */

const pools = require('./pools');

const pathBuilders = {
  'robot-moment': require('./paths/robot-moment'),
  'cyborg-woman': require('./paths/cyborg-woman'),
  'cyborg-man': require('./paths/cyborg-man'),
};

module.exports = {
  username: 'mechbot',
  displayName: 'MechBot',

  // Single locked medium — `render` (high-end cinematic 3D / VFX-quality).
  // Matches the original StarBot cyborg/robot behavior pre-migration.
  mediums: ['render'],

  // Full vibe rotation per path. Cyborg-woman gets the warm-leaning set,
  // cyborg-man the colder/fiercer set, robot-moment a broad cinematic mix.
  vibesByPath: {
    'cyborg-woman': [
      'cinematic', 'dark', 'epic', 'nostalgic', 'psychedelic', 'ethereal',
      'arcane', 'enchanted', 'voltage', 'shimmer', 'surreal', 'peaceful', 'minimal',
    ],
    'cyborg-man': [
      'cinematic', 'dark', 'epic', 'nostalgic', 'arcane', 'ancient',
      'fierce', 'voltage', 'nightshade', 'macabre', 'surreal',
    ],
    'robot-moment': [
      'cinematic', 'dark', 'epic', 'nostalgic', 'arcane', 'ancient',
      'fierce', 'voltage', 'nightshade', 'ethereal', 'minimal', 'peaceful',
    ],
  },

  modelByPath: {
    'cyborg-woman': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'cyborg-man': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'robot-moment': { 'black-forest-labs/flux-1.1-pro': 100 },
  },

  // Per-path prefix — injected BEFORE style prefix so it's the first tokens Flux sees.
  promptPrefixByPath: {
    'cyborg-man':
      'handsome adult male man (NOT female NOT woman), masculine face, narrow hips, torso clad in cyborg shell — synth-mesh / composite panels / chrome underweave / mechanical mesh covering chest and abdomen as integrated cyborg anatomy (NOT bare skin, NOT a shirt, NOT fabric clothing — this material IS his body covering), cybernetic breakthroughs across face / neck / forearms / hands, not a full robotic chassis',
    'cyborg-woman': 'beautiful woman, cybernetic breakthroughs integrated into human body (not a robotic chassis)',
  },

  // Per-medium prompt injection — MechBot's dialect for the `render` medium.
  // Front-loads photoreal / VFX language ahead of the Sonnet-written scene.
  mediumStyles: {
    render:
      'high-end cinematic 3D render — feature-film VFX quality, physically-based rendering with realistic subsurface-scatter and raytraced reflections, practical-plus-digital hybrid aesthetic, volumetric atmospheric depth, cinematic lighting precision, 4K film-finish polish, NOT cartoon NOT toy NOT videogame',
  },

  promptPrefix:
    'cinematic sci-fi concept art, hyper-detailed mechanical surfaces, ornate machinery, production-art polish',
  promptSuffix: 'no text, no words, no watermarks, hyper detailed, masterpiece quality',

  vibes: ['cinematic'],

  paths: [
    'robot-moment',
    'cyborg-woman',
    'cyborg-man',
  ],

  // Even split — all three are character paths and equally weighted.
  pathWeights: {
    'robot-moment': 1,
    'cyborg-woman': 1,
    'cyborg-man': 1,
  },

  // Chaos layer — both cyborg paths can take subject chaos (silhouette /
  // echo distortions). Robot-moment also benefits.
  chaos: {
    enabled: true,
    skipPaths: [],
    allowSubjectChaosPaths: ['cyborg-woman', 'cyborg-man', 'robot-moment'],
  },

  // Two-pass Sonnet→Haiku polish.
  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '80-110',
    preservePhrasesByPath: {
      // Force Haiku polish to keep leg-count tokens — Flux's bipedal-default
      // bias collapses tripedal/hexapod/quadrupedal seeds to 2-legged renders
      // unless the count is HEAVILY repeated in the prompt.
      'robot-moment': [
        'tripedal', 'tripod',
        'three legs', 'three pneumatic legs', 'three telescoping legs', 'three strut legs', 'three hydraulic legs',
        'quadrupedal', 'four-legged', 'four legs', 'four pneumatic legs', 'four reinforced legs', 'four strut legs',
        'hexapod', 'six-legged', 'six legs', 'six pneumatic legs', 'six articulated legs', 'six rubber-tipped legs',
        'octopod', 'eight legs',
        'four mechanical arms', 'four arms', 'six arms', 'multi-armed',
      ],
    },
  },

  // Sensory anchors — 3 contexts (cyborg-female / cyborg-male / robot).
  sensoryAnchors: {
    enabled: true,
    requiredChannels: ['lightcolor'],
    pathContext: {
      'cyborg-woman': 'cyborg-female',
      'cyborg-man': 'cyborg-male',
      'robot-moment': 'robot',
    },
    poolsByContextAndChannel: pools.SENSORY_POOLS,
  },

  rollSharedDNA({ vibeKey, path, picker }) {
    const base = {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
    };
    if (path === 'cyborg-woman') {
      base.characterBase = picker.pickWithRecency(pools.CYBORG_FEMALE_CHARACTERS, 'cyborg_female_character');
      base.skin = picker.pickWithRecency(pools.CYBORG_SKIN_TONES, 'cyborg_skin');
      base.bodyType = picker.pickWithRecency(pools.CYBORG_BODY_TYPES, 'cyborg_body');
      base.eyes = picker.pick(pools.CYBORG_EYE_STYLES);
      base.hair = picker.pick(pools.CYBORG_HAIR_STYLES);
      base.internal = picker.pickWithRecency(pools.CYBORG_INTERNAL_EXPOSURE, 'cyborg_internal');
      base.glowColor = picker.pickWithRecency(pools.CYBORG_GLOW_COLORS, 'cyborg_glow');
    }
    if (path === 'cyborg-man') {
      base.characterBase = picker.pickWithRecency(pools.CYBORG_MALE_CHARACTERS, 'cyborg_male_character');
      base.skin = picker.pickWithRecency(pools.CYBORG_MALE_SKIN_TONES, 'cyborg_male_skin');
      base.bodyType = picker.pick(pools.CYBORG_MALE_BODY_TYPES);
      base.eyes = picker.pick(pools.CYBORG_EYE_STYLES);
      base.hair = picker.pick(pools.CYBORG_MALE_HAIR_STYLES);
      base.internal = picker.pickWithRecency(pools.CYBORG_MALE_INTERNAL_EXPOSURE, 'cyborg_male_internal');
      base.glowColor = picker.pickWithRecency(pools.CYBORG_GLOW_COLORS, 'cyborg_glow');
    }
    return base;
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`MechBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] MechBot`;
  },
};
