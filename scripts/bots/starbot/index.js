/**
 * StarBot — the bot-engine contract.
 *
 * Mind-bending sci-fi. Blade Runner / Dune / Interstellar / Alien / 2001 /
 * Arrival / Annihilation / Foundation / Moebius-Jodorowsky / Chesley-Bonestell.
 * Cosmic vistas + alien landscapes + epic space opera + sleek futurism.
 * Includes cyborg-woman path (inherited from retired VenusBot).
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'cosmic-vista': require('./paths/cosmic-vista'),
  'alien-landscape': require('./paths/alien-landscape'),
  'space-opera': require('./paths/space-opera'),
  'sci-fi-interior': require('./paths/sci-fi-interior'),
  'cozy-sci-fi-interior': require('./paths/cozy-sci-fi-interior'),
  'alien-city': require('./paths/alien-city'),
  'robot-moment': require('./paths/robot-moment'),
  'real-space': require('./paths/real-space'),
  'cosmic-oracle': require('./paths/cosmic-oracle'),
  'female-explorer': require('./paths/female-explorer'),
  'male-explorer': require('./paths/male-explorer'),
  'megastructure': require('./paths/megastructure'),
  'cyborg-woman': require('./paths/cyborg-woman'),
  'cyborg-man': require('./paths/cyborg-man'),
  'dune-landscape': require('./paths/dune-landscape'),
  'dune-architecture': require('./paths/dune-architecture'),
  'aliens-landscape': require('./paths/aliens-landscape'),
  'aliens-architecture': require('./paths/aliens-architecture'),
  'starwars-landscape': require('./paths/starwars-landscape'),
  'starwars-architecture': require('./paths/starwars-architecture'),
  'guardians-landscape': require('./paths/guardians-landscape'),
  'guardians-architecture': require('./paths/guardians-architecture'),
  'mass-effect-landscape': require('./paths/mass-effect-landscape'),
  'mass-effect-architecture': require('./paths/mass-effect-architecture'),
  'halo-landscape': require('./paths/halo-landscape'),
  'halo-architecture': require('./paths/halo-architecture'),
  'star-trek-landscape': require('./paths/star-trek-landscape'),
  'star-trek-architecture': require('./paths/star-trek-architecture'),
  'starcraft-landscape': require('./paths/starcraft-landscape'),
  'starcraft-architecture': require('./paths/starcraft-architecture'),
};

module.exports = {
  username: 'starbot',
  displayName: 'StarBot',

  mediums: ['render'],

  mediumByPath: {
    'cosmic-vista': 'render',
    'cosmic-oracle': 'render',
    'real-space': 'real_astro',
  },

  // cozy-sci-fi-interior only gets warm/intimate vibes
  vibesByPath: {
    'cozy-sci-fi-interior': ['nostalgic', 'ethereal', 'enchanted', 'shimmer', 'dark', 'voltage', 'arcane', 'surreal', 'cinematic'],
  },

  // all paths use flux-dev / flux-1.1-pro 50/50 rotation
  modelByPath: {
    'cosmic-vista': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'alien-landscape': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'space-opera': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'sci-fi-interior': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'cozy-sci-fi-interior': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'alien-city': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'robot-moment': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'real-space': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'cosmic-oracle': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'female-explorer': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'male-explorer': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'megastructure': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'cyborg-woman': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'cyborg-man': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'dune-landscape': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'dune-architecture': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'aliens-landscape': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'aliens-architecture': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'starwars-landscape': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'starwars-architecture': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'guardians-landscape': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'guardians-architecture': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'mass-effect-landscape': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'mass-effect-architecture': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'halo-landscape': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'halo-architecture': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'star-trek-landscape': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'star-trek-architecture': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'starcraft-landscape': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'starcraft-architecture': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
  },

  // Per-path prefix — injected BEFORE style prefix so it's the first tokens Flux sees.
  promptPrefixByPath: {
    'cyborg-man': 'handsome adult male man (NOT female NOT woman), masculine face, narrow hips, torso clad in cyborg shell — synth-mesh / composite panels / chrome underweave / mechanical mesh covering chest and abdomen as integrated cyborg anatomy (NOT bare skin, NOT a shirt, NOT fabric clothing — this material IS his body covering), cybernetic breakthroughs across face / neck / forearms / hands, not a full robotic chassis',
    'cyborg-woman': 'beautiful woman, cybernetic breakthroughs integrated into human body (not a robotic chassis)',
  },

  // Per-medium prompt prefix/suffix overrides. The star_oil_cosmos medium
  // uses environment-dominant language so the scene wins over the figure
  // (mirrors gothbot gothic_oil_garden pattern).
  promptPrefixByMedium: {
    star_oil_cosmos:
      'cinematic sci-fi oil painting, environment-dominant composition, heavy impasto brushwork, atmospheric depth',
    real_astro:
      'NASA Hubble JWST astrophotography, vibrant false-color composite, luminous glowing gas clouds, blazing star fields, saturated vivid deep-space imaging',
  },
  promptSuffixByMedium: {
    star_oil_cosmos:
      'oil-on-canvas finish, impasto brushwork, no text no words no watermarks',
    real_astro:
      'astrophotography finish, deep black space contrast, pinpoint stars, no text no words no watermarks',
  },

  // Per-medium prompt injection — StarBot's dialect for each medium.
  // Gets injected between promptPrefix and the Sonnet-written scene,
  // giving each medium StarBot's Blade-Runner / Dune / Alien / 2001 /
  // Moebius-Jodorowsky DNA instead of the generic medium text.
  mediumStyles: {
    photography:
      '35mm cinematic sci-fi film-still — Denis-Villeneuve Blade-Runner-2049 / Dune / Arrival visual family, Roger-Deakins cinematography, anamorphic widescreen with characteristic horizontal lens-flare, shallow-DOF practical-effects scale, physical-model + miniature-photography authenticity, subdued naturalistic color-grade with shadow-heavy low-key lighting, Kubrick-2001-style precision framing, atmospheric haze, photographic grain',
    vaporwave:
      'late-80s / early-90s retrofuturism — Syd-Mead + Moebius painted chrome-and-neon-pink-cyan palette, gridded-horizon vanishing-point perspective, synthwave-cosmos sunset, tropical-palm-silhouette against gradient-sky, VHS-glitch scanlines, Miami-Vice-in-space mood, Blade-Runner-original-era neon-signage, pastel-gradient nebula backdrop',
    canvas:
      'painted sci-fi-paperback-cover oil-on-canvas — Chesley-Bonestell / Syd-Mead / John-Harris / Michael-Whelan / Bruce-Pennington / Frank-Kelly-Freas Analog-SF-magazine tradition, heavy-impasto painted brushwork, painterly atmospheric cosmic depth, dramatic painted-chiaroscuro with nebula-hued ambient shadow, pulp-sci-fi paperback polish, museum-painted masterwork quality',
    render:
      'high-end cinematic 3D render — feature-film VFX quality, physically-based rendering with realistic subsurface-scatter and raytraced reflections, practical-plus-digital hybrid aesthetic, volumetric atmospheric depth, cinematic lighting precision, 4K film-finish polish, NOT cartoon NOT toy NOT videogame',
    watercolor:
      'NASA concept-art watercolor wash — Robert-McCall painted-space-tradition + Jean-Giraud-Moebius watercolor-sci-fi, soft pigment-bleed on cold-press paper, delicate astronaut-sketch washes, muted cosmic palette (pale blues / dusty rose / sepia star-fields), atmospheric color-field abstraction, painterly aerospace-concept-art feel, NOT cute-watercolor NOT children-book NOT flowers',
    pencil:
      'Ralph-McQuarrie Star-Wars-concept-art graphite + Syd-Mead architectural-pencil-rendering + NASA engineering-blueprint-cross-hatch + Moebius pencil-and-ink sci-fi concept sketch — tight cross-hatched shadow, technical-drafting precision, silver-graphite-on-toned-paper tradition, dramatic value range, architectural-scale cosmic machinery, pre-production-concept-sketch authority',
    illustration:
      'Moebius / Jean-Giraud / Philippe-Druillet / Enki-Bilal / Jodorowsky Heavy-Metal-magazine ink-and-color sci-fi BD tradition, clean-ink linework + flat-color-wash with gradient-field cosmic backgrounds, European bande-dessinée science-fiction craftsmanship, Arzach / Incal / The-Airtight-Garage visual family, dream-logic cosmic surrealism, NOT superhero-comic NOT manga NOT cartoon',
    // Bot-only custom medium for cosmic-oracle path — sci-fi adaptation of
    // gothbot's gothic_oil_garden. Full-scene painted cosmic oil-canvas where
    // a figure lives WITHIN the environment (NOT a centered portrait).
    star_oil_cosmos:
      'cinematic sci-fi oil painting, environment-dominant composition with figure WITHIN scene, visible impasto brushwork, heavy canvas texture, dramatic volumetric lighting, gallery-quality masterwork',
    real_astro:
      'NASA-grade astrophotography — Hubble / JWST / ESO false-color composite, vibrant wavelength-mapped colors cranked to maximum, luminous nebula clouds glowing from within, blazing star clusters with diffraction spikes, deep-black void contrast, scientific-imaging aesthetic pushed to wallpaper-worthy vivid, NOT sci-fi concept art NOT painting NOT CGI',
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // Inverts old excludeVibes (minimal/whimsical/cozy).
  vibes: [
    'cinematic',
    'dark',
    'epic',
    'nostalgic',
    'psychedelic',
    'ethereal',
    'arcane',
    'enchanted',
    'voltage',
    'shimmer',
    'surreal',
    'peaceful',
    'minimal',
  ],

  paths: [
    'cosmic-vista',
    'alien-landscape',
    'space-opera',
    'sci-fi-interior',
    'cozy-sci-fi-interior',
    'alien-city',
    'robot-moment',
    'real-space',
    'cosmic-oracle',
    'female-explorer',
    'male-explorer',
    'megastructure',
    'cyborg-woman',
    // 'cyborg-man' — deactivated 2026-05-02 (Kevin: renders looked like GQ model shoot, not cyborg)
    'dune-landscape',
    // 'dune-architecture' — deactivated 2026-05-02
    'aliens-landscape',
    'aliens-architecture',
    'starwars-landscape',
    'starwars-architecture',
    'guardians-landscape',
    'guardians-architecture',
    // 'mass-effect-landscape' — scrapped 2026-05-02 (Kevin)
    'mass-effect-architecture',
    'halo-landscape',
    'halo-architecture',
    'star-trek-landscape',
    // 'star-trek-architecture' — scrapped 2026-05-02 (Kevin)
    'starcraft-landscape',
    'starcraft-architecture',
  ],

  // Path weights tuned for ~40% universe-coded scenes / ~30% character paths /
  // ~30% generic scene paths.
  // Universe paths (13): weight 4 each → 52 / 132 = ~39.4%
  // Character paths (5): weight 8 each → 40 / 132 = ~30.3%
  // Generic scene paths (8): weight 5 each → 40 / 132 = ~30.3%
  pathWeights: {
    // Generic scene paths (weight 5 each)
    'cosmic-vista': 5,
    'alien-landscape': 5,
    'space-opera': 5,
    'sci-fi-interior': 5,
    'cozy-sci-fi-interior': 5,
    'alien-city': 5,
    'real-space': 5,
    'megastructure': 5,
    // Character paths (weight 8 each)
    'robot-moment': 8,
    'cosmic-oracle': 8,
    'female-explorer': 8,
    'male-explorer': 8,
    'cyborg-woman': 8,
    // 'cyborg-man': 8,  // deactivated
    // Universe-coded scene-only paths (weight 4 each)
    'dune-landscape': 4,
    // 'dune-architecture': 4,  // deactivated
    'aliens-landscape': 4,
    'aliens-architecture': 4,
    'starwars-landscape': 4,
    'starwars-architecture': 4,
    'guardians-landscape': 4,
    'guardians-architecture': 4,
    // 'mass-effect-landscape': 4,  // scrapped
    'mass-effect-architecture': 4,
    'halo-landscape': 4,
    'halo-architecture': 4,
    'star-trek-landscape': 4,
    // 'star-trek-architecture': 4,  // scrapped
    'starcraft-landscape': 4,
    'starcraft-architecture': 4,
  },

  // Chaos layer — sci-fi works well with chaos. Skip face-dominant cyborg
  // closeups (none here — cyborg-woman/man are full-figure). Allow subject
  // chaos on scenery + megastructure paths (silhouette/echo distortions).
  chaos: {
    enabled: true,
    skipPaths: [],
    allowSubjectChaosPaths: [
      'cosmic-vista', 'alien-landscape', 'space-opera', 'sci-fi-interior',
      'cozy-sci-fi-interior', 'alien-city', 'real-space', 'cosmic-oracle',
      'megastructure',
      'cyborg-woman',
      'cyborg-man',
      'dune-landscape', 'dune-architecture', 'aliens-landscape', 'aliens-architecture',
      'starwars-landscape', 'starwars-architecture',
      'guardians-landscape', 'guardians-architecture',
      'mass-effect-landscape', 'mass-effect-architecture',
      'halo-landscape', 'halo-architecture',
      'star-trek-landscape', 'star-trek-architecture',
      'starcraft-landscape', 'starcraft-architecture',
    ],
  },

  // Two-pass Sonnet→Haiku polish.
  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '65-90',
    polishedWordsByPath: {
      'cyborg-woman': '80-110',
      'cyborg-man': '80-110',
      'female-explorer': '80-110',
      'male-explorer': '80-110',
      'robot-moment': '80-110',
    },
    preservePhrasesByPath: {},
  },

  // Sensory anchors — 6 contexts (cyborg-female / cyborg-male /
  // explorer-female / explorer-male / robot / scene). 42 pools at 100 each.
  // Cyborg/explorer split per Kevin's catch — different body types
  // (machine anatomy vs organic-in-EVA), can't share a pool.
  sensoryAnchors: {
    enabled: true,
    requiredChannels: ['lightcolor'],
    pathContext: {
      'cyborg-woman': 'cyborg-female',
      'cyborg-man': 'cyborg-male',
      'female-explorer': 'explorer-female',
      'male-explorer': 'explorer-male',
      'robot-moment': 'robot',
      'cosmic-vista': 'scene',
      'alien-landscape': 'scene',
      'space-opera': 'scene',
      'sci-fi-interior': 'scene',
      'cozy-sci-fi-interior': 'scene',
      'alien-city': 'scene',
      'real-space': 'scene',
      'cosmic-oracle': 'scene',
      'megastructure': 'scene',
      'dune-landscape': 'scene',
      'dune-architecture': 'scene',
      'aliens-landscape': 'scene',
      'aliens-architecture': 'scene',
      'starwars-landscape': 'scene',
      'starwars-architecture': 'scene',
      'guardians-landscape': 'scene',
      'guardians-architecture': 'scene',
      'mass-effect-landscape': 'scene',
      'mass-effect-architecture': 'scene',
      'halo-landscape': 'scene',
      'halo-architecture': 'scene',
      'star-trek-landscape': 'scene',
      'star-trek-architecture': 'scene',
      'starcraft-landscape': 'scene',
      'starcraft-architecture': 'scene',
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
    if (!builder) throw new Error(`StarBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] StarBot`;
  },
};
