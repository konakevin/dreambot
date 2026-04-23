/**
 * StarBot — the bot-engine contract.
 *
 * Mind-bending sci-fi. Blade Runner / Dune / Interstellar / Alien / 2001 /
 * Arrival / Annihilation / Foundation / Moebius-Jodorowsky / Chesley-Bonestell.
 * Cosmic vistas + alien landscapes + epic space opera + sleek futurism.
 * VenusBot owns cyborg-women — StarBot does not.
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
};

module.exports = {
  username: 'starbot',
  displayName: 'StarBot',

  // 7 mediums — 4 original + 3 added (watercolor/pencil/illustration).
  // Plus 1 bot-only custom medium (star-oil-cosmos) locked to cosmic-oracle.
  mediums: ['photography', 'vaporwave', 'canvas', 'render', 'watercolor', 'pencil', 'illustration'],

  // cosmic-oracle path locks to the custom bot-only star-oil-cosmos medium
  mediumByPath: {
    'cosmic-oracle': 'star-oil-cosmos',
  },

  // cosmic-oracle path locks to flux-dev (best painterly model)
  modelByPath: {
    'cosmic-oracle': 'black-forest-labs/flux-dev',
  },

  // Per-medium prompt prefix/suffix overrides. The star-oil-cosmos medium
  // uses environment-dominant language so the scene wins over the figure
  // (mirrors gothbot gothic-oil-garden pattern).
  promptPrefixByMedium: {
    'star-oil-cosmos':
      'cinematic sci-fi oil painting, environment-dominant composition, heavy impasto brushwork, atmospheric depth',
  },
  promptSuffixByMedium: {
    'star-oil-cosmos':
      'oil-on-canvas finish, impasto brushwork, no text no words no watermarks',
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
      'high-end cinematic 3D render — ILM / Weta / DNEG / MPC feature-film VFX quality, physically-based rendering with realistic subsurface-scatter and raytraced reflections, Dune / Blade-Runner-2049 / Arrival / Interstellar CG precision, practical-plus-digital hybrid aesthetic, volumetric atmospheric depth, 4K film-finish polish, NOT cartoon NOT toy NOT videogame',
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
    'peaceful',
    'ethereal',
    'arcane',
    'ancient',
    'enchanted',
    'fierce',
    'coquette',
    'voltage',
    'nightshade',
    'macabre',
    'shimmer',
    'surreal',
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
  ],

  pathWeights: {
    'cosmic-vista': 2,
    'alien-landscape': 2,
    'space-opera': 1,
    'sci-fi-interior': 1,
    'cozy-sci-fi-interior': 1,
    'alien-city': 2,
    'robot-moment': 1,
    'real-space': 2,
    'cosmic-oracle': 2,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
    };
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
