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
};

module.exports = {
  username: 'starbot',
  displayName: 'StarBot',

  mediums: ['render'],

  mediumByPath: {
    'cosmic-vista': 'render',
    'cosmic-oracle': 'render',
    'real-space': 'real-astro',
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
  },

  // Per-medium prompt prefix/suffix overrides. The star-oil-cosmos medium
  // uses environment-dominant language so the scene wins over the figure
  // (mirrors gothbot gothic-oil-garden pattern).
  promptPrefixByMedium: {
    'star-oil-cosmos':
      'cinematic sci-fi oil painting, environment-dominant composition, heavy impasto brushwork, atmospheric depth',
    'real-astro':
      'NASA Hubble JWST astrophotography, vibrant false-color composite, luminous glowing gas clouds, blazing star fields, saturated vivid deep-space imaging',
  },
  promptSuffixByMedium: {
    'star-oil-cosmos':
      'oil-on-canvas finish, impasto brushwork, no text no words no watermarks',
    'real-astro':
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
    // gothbot's gothic-oil-garden. Full-scene painted cosmic oil-canvas where
    // a figure lives WITHIN the environment (NOT a centered portrait).
    'star-oil-cosmos':
      'cinematic sci-fi oil painting, environment-dominant composition with figure WITHIN scene, visible impasto brushwork, heavy canvas texture, dramatic volumetric lighting, gallery-quality masterwork',
    'real-astro':
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
  ],

  pathWeights: {
    'cosmic-vista': 4,
    'alien-landscape': 3,
    'space-opera': 3,
    'sci-fi-interior': 2,
    'cozy-sci-fi-interior': 2,
    'alien-city': 3,
    'robot-moment': 2,
    'real-space': 2,
    'cosmic-oracle': 2,
    'female-explorer': 4,
    'male-explorer': 3,
    'megastructure': 3,
    'cyborg-woman': 4,
  },

  rollSharedDNA({ vibeKey, path, picker }) {
    const base = {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
    };
    if (path === 'cyborg-woman') {
      base.characterBase = picker.pickWithRecency(pools.CYBORG_CHARACTERS, 'cyborg_character');
      base.skin = picker.pickWithRecency(pools.CYBORG_SKIN_TONES, 'cyborg_skin');
      base.bodyType = picker.pickWithRecency(pools.CYBORG_BODY_TYPES, 'cyborg_body');
      base.eyes = picker.pick(pools.CYBORG_EYE_STYLES);
      base.hair = picker.pick(pools.CYBORG_HAIR_STYLES);
      base.internal = picker.pickWithRecency(pools.CYBORG_INTERNAL_EXPOSURE, 'cyborg_internal');
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
