/**
 * StarBot — the bot-engine contract.
 *
 * Mind-bending sci-fi. Blade Runner / Dune / Interstellar / Alien / 2001 /
 * Arrival / Annihilation / Foundation / Moebius-Jodorowsky / Chesley-Bonestell.
 * Cosmic vistas + alien landscapes + epic space opera + sleek futurism.
 *
 * Cyborg / robot character paths split into MechBot 2026-05-05 — see
 * scripts/bots/mechbot/.
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
  'real-space': require('./paths/real-space'),
  'cosmic-oracle': require('./paths/cosmic-oracle'),
  'female-explorer': require('./paths/female-explorer'),
  'male-explorer': require('./paths/male-explorer'),
  'megastructure': require('./paths/megastructure'),
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

  // Single locked medium — starbot_hyperreal is a bot-only medium added in
  // migration 145, formalizing what was previously a render-medium override.
  // Recipe: cinematic photoreal sci-fi concept art — Denis Villeneuve /
  // Blade Runner 2049 / Dune / Interstellar live-action film aesthetic.
  mediums: ['starbot_hyperreal'],

  mediumByPath: {
    'real-space': 'real_astro', // NASA-grade astrophotography stays separate
    // Character paths: starbot_hyperreal biases hero-portraits hard. Override
    // to canvas (sci-fi paperback-cover oil-painting tradition — Frazetta /
    // Mead / Bonestell — full-body action heroes in dramatic scenes, NOT
    // portraits). Tested 2026-05-11 in R6 of female-explorer iteration.
    'female-explorer': 'canvas',
    'male-explorer': 'canvas',
    // megastructure (cyberpunk-building-in-city archetype) — anime medium
    // for Akira / Ghost in the Shell / Cyberpunk Edgerunners aesthetic.
    // Kevin asked 2026-05-12 to test anime spin on the iconic-building feel.
    'megastructure': 'anime',
  },

  // cozy-sci-fi-interior only gets warm/intimate vibes
  vibesByPath: {
    'cozy-sci-fi-interior': ['nostalgic', 'ethereal', 'enchanted', 'shimmer', 'dark', 'voltage', 'arcane', 'surreal', 'cinematic'],
  },

  // all paths use flux-dev / flux-1.1-pro 50/50 rotation
  modelByPath: {
    'cosmic-vista': { 'black-forest-labs/flux-1.1-pro': 100 },
    'alien-landscape': { 'black-forest-labs/flux-1.1-pro': 100 },
    'space-opera': { 'black-forest-labs/flux-1.1-pro': 100 },
    'sci-fi-interior': { 'black-forest-labs/flux-1.1-pro': 100 },
    'cozy-sci-fi-interior': { 'black-forest-labs/flux-1.1-pro': 100 },
    'alien-city': { 'black-forest-labs/flux-1.1-pro': 100 },
    'real-space': { 'black-forest-labs/flux-1.1-pro': 100 },
    'cosmic-oracle': { 'black-forest-labs/flux-1.1-pro': 100 },
    'female-explorer': { 'black-forest-labs/flux-1.1-pro': 100 },
    'male-explorer': { 'black-forest-labs/flux-1.1-pro': 100 },
    'megastructure': { 'black-forest-labs/flux-1.1-pro-ultra': 100 },
    'dune-landscape': { 'black-forest-labs/flux-1.1-pro': 100 },
    'dune-architecture': { 'black-forest-labs/flux-1.1-pro': 100 },
    'aliens-landscape': { 'black-forest-labs/flux-1.1-pro': 100 },
    'aliens-architecture': { 'black-forest-labs/flux-1.1-pro': 100 },
    'starwars-landscape': { 'black-forest-labs/flux-1.1-pro': 100 },
    'starwars-architecture': { 'black-forest-labs/flux-1.1-pro': 100 },
    'guardians-landscape': { 'black-forest-labs/flux-1.1-pro': 100 },
    'guardians-architecture': { 'black-forest-labs/flux-1.1-pro': 100 },
    'mass-effect-landscape': { 'black-forest-labs/flux-1.1-pro': 100 },
    'mass-effect-architecture': { 'black-forest-labs/flux-1.1-pro': 100 },
    'halo-landscape': { 'black-forest-labs/flux-1.1-pro': 100 },
    'halo-architecture': { 'black-forest-labs/flux-1.1-pro': 100 },
    'star-trek-landscape': { 'black-forest-labs/flux-1.1-pro': 100 },
    'star-trek-architecture': { 'black-forest-labs/flux-1.1-pro': 100 },
    'starcraft-landscape': { 'black-forest-labs/flux-1.1-pro': 100 },
    'starcraft-architecture': { 'black-forest-labs/flux-1.1-pro': 100 },
  },

  // Per-medium prompt prefix/suffix overrides. The star_oil_cosmos medium
  // uses environment-dominant language so the scene wins over the figure
  // (mirrors gothbot gothic_oil_garden pattern).
  promptPrefixByMedium: {
    star_oil_cosmos:
      'cinematic sci-fi oil painting, environment-dominant composition, heavy impasto brushwork, atmospheric depth',
    real_astro:
      'NASA Hubble JWST astrophotography PUNCHED UP to maximum, vibrant false-color composite cranked to 11, dramatic events captured mid-action — jets shooting / shockwaves expanding / aurora flaring / accretion disks burning / gravitational lensing distorting backgrounds, multiple celestial elements happening at once in the same frame, luminous glowing structures saturated to wallpaper-worthy intensity, blazing star fields with diffraction spikes',
    // Hyperreal sci-fi concept-art prefix for starbot_hyperreal medium (migration 145).
    starbot_hyperreal:
      'hyperrealistic photoreal rendering of a science-fiction world, cinematic concept art, ray-traced volumetric lighting, atmospheric depth haze, photoreal future-tech surfaces, mythic epic scale, movie-poster composition',
    // Cosmic-void prefix for space-opera path — mandates pure space vacuum
    // context with ship-as-subject. NO landscape/world bias. Added 2026-05-11.
    starbot_cosmic_void:
      'epic cosmic space scene set in pure vacuum, deep void of space, kilometer-class capital spaceships dominating the frame, starfield and nebula backdrop only, NOT planetary surface, NOT canyon, NOT ground-level, NOT atmospheric, hyperrealistic photoreal cinematic sci-fi concept art, ray-traced volumetric lighting in vacuum, ship-as-subject composition',
  },
  promptSuffixByMedium: {
    star_oil_cosmos:
      'oil-on-canvas finish, impasto brushwork, no text no words no watermarks',
    real_astro:
      'astrophotography finish cranked to wallpaper saturation, deep black space contrast, pinpoint stars with diffraction spikes, multi-wavelength false-color composite, dramatic mid-event detail (jets / shockwaves / accretion disks / lensing) visible in frame, the celestial object is the MAIN SUBJECT (occupies the bulk of the frame), spaceships permitted only as small silhouette / scale-reference elements at the frame edge, no text, no words, no watermarks, NO monitors NO screens NO viewports NO characters NO industrial scene framing',
    // Hyperreal sci-fi concept-art suffix for starbot_hyperreal medium (migration 145).
    starbot_hyperreal:
      '8K cinematic concept art precision, photoreal materials and lighting, atmospheric lens flare and slight bloom, dust motes in light shafts, every plane filled with detail, no text, no words, no watermarks, photorealistic film still — NOT painted, NOT illustration, NOT drawing, NOT cartoon, NOT stylized',
    // Cosmic-void suffix — reinforces vacuum context + ship-as-subject.
    starbot_cosmic_void:
      '8K cinematic concept art precision, photoreal materials in vacuum, lens flare from distant stars, atmospheric haze from nebula clouds only, the kilometer-class capital spaceship is the MAIN SUBJECT filling the frame, surrounded by smaller craft and starfield, NO planet surface NO canyon NO city NO ground NO buildings, deep black void backdrop, no text, no words, no watermarks, photorealistic film still in deep space',
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
    // Hyperreal sci-fi concept-art mediumStyle — formalized as the bot-only
    // medium `starbot_hyperreal` in migration 145. Mirrors the DB row's
    // flux_fragment so the override is explicit rather than implicit.
    starbot_hyperreal:
      'hyperrealistic photoreal cinematic sci-fi concept art, ray-traced volumetric lighting, atmospheric depth haze, photoreal future-tech and alien-world surfaces, slight bloom and lens flare, 8K film-still precision, mythic epic scale, like a still from a Denis Villeneuve sci-fi film — NOT painted, NOT illustration, NOT drawing, NOT cartoon, NOT stylized, NOT toy, NOT videogame',
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
    // Cosmic-void mediumStyle — kilometer-class capital spaceships in pure
    // vacuum, ship-as-subject, no landscape bias.
    starbot_cosmic_void:
      'hyperrealistic photoreal cinematic sci-fi concept art of a kilometer-class capital spaceship in deep space vacuum, ray-traced volumetric lighting from nebulae and distant stars, photoreal hull materials with weapon batteries lit-window grids and hangar bays visible, surrounded by smaller fighter wings cargo trains and satellites as scale provers, atmospheric nebula haze in deep space, 8K film-still precision, like a still from a Denis Villeneuve cosmic sci-fi film — pure vacuum context — NOT planetary surface NOT canyon NOT ground NOT atmospheric',
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // Inverts old excludeVibes (minimal/whimsical/cozy).
  vibes: [
    'cinematic',
  ],

  paths: [
    'cosmic-vista', // re-enabled 2026-05-11 with canonical 7-axis + cosmic_event drama layer
    'alien-landscape', // must include alien or character (see path file)
    // 'space-opera' — DISABLED 2026-05-12. Flux cannot reliably render
    // cool sci-fi spaceship silhouettes — output drifts to abstract orb/blob
    // shapes, modern-naval carrier-coded forms, or steampunk regardless of
    // brief admonitions and pool cleanup. Multiple iterations (R1-R3) failed
    // to reach the bar; path retired from rotation. The SPACE_OPERA archetype
    // + composer wiring + iconic-silhouette pool are preserved in case a
    // future Flux release renders ships more reliably.
    // 'sci-fi-interior' — disabled 2026-05-11 (cozy-sci-fi-interior wins)
    'cozy-sci-fi-interior',
    'alien-city',
    'real-space',
    'cosmic-oracle',
    'female-explorer',
    'male-explorer',
    'megastructure',
    'dune-landscape', // should include char or ship (see path file)
    // 'dune-architecture' — deactivated 2026-05-02
    // 'aliens-landscape' — disabled 2026-05-11
    'aliens-architecture',
    'starwars-landscape',
    // 'starwars-architecture' — disabled 2026-05-11
    // 'guardians-landscape' — disabled 2026-05-11
    'guardians-architecture', // ban skulls (see path file)
    // 'mass-effect-landscape' — scrapped 2026-05-02
    'mass-effect-architecture',
    'halo-landscape',
    // 'halo-architecture' — disabled 2026-05-11
    'star-trek-landscape',
    // 'star-trek-architecture' — scrapped 2026-05-02
    'starcraft-landscape',
    // 'starcraft-architecture' — disabled 2026-05-11
  ],

  // Path weights — universe-coded scenes / character paths / generic scenes.
  // Cyborg + robot-moment moved to MechBot 2026-05-05.
  pathWeights: {
    // Generic scene paths (weight 5 each)
    // 'cosmic-vista': 5,  // disabled 2026-05-11
    'alien-landscape': 5,
    // 'space-opera': 5, // DISABLED 2026-05-12 (see bot.paths comment)
    // 'sci-fi-interior': 5,  // disabled 2026-05-11 (cozy variant wins)
    'cozy-sci-fi-interior': 5,
    'alien-city': 5,
    'real-space': 5,
    'megastructure': 5,
    // Character paths (weight 8 each)
    'cosmic-oracle': 8,
    'female-explorer': 8,
    'male-explorer': 8,
    // Universe-coded scene-only paths (weight 4 each)
    'dune-landscape': 4,
    // 'dune-architecture': 4,  // deactivated
    // 'aliens-landscape': 4,  // disabled 2026-05-11
    'aliens-architecture': 4,
    'starwars-landscape': 4,
    // 'starwars-architecture': 4,  // disabled 2026-05-11
    // 'guardians-landscape': 4,  // disabled 2026-05-11
    'guardians-architecture': 4,
    // 'mass-effect-landscape': 4,  // scrapped
    'mass-effect-architecture': 4,
    'halo-landscape': 4,
    // 'halo-architecture': 4,  // disabled 2026-05-11
    'star-trek-landscape': 4,
    // 'star-trek-architecture': 4,  // scrapped
    'starcraft-landscape': 4,
    // 'starcraft-architecture': 4,  // disabled 2026-05-11
  },

  // Chaos layer — allow subject chaos on scenery + megastructure paths
  // (silhouette/echo distortions).
  chaos: {
    enabled: true,
    skipPaths: [],
    allowSubjectChaosPaths: [
      'cosmic-vista', 'alien-landscape', 'space-opera', 'sci-fi-interior',
      'cozy-sci-fi-interior', 'alien-city', 'real-space', 'cosmic-oracle',
      'megastructure',
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
      'female-explorer': '80-110',
      'male-explorer': '80-110',
    },
    // Helmet/visor/EVA tokens kept stripping during compression on
    // female-explorer (2026-05-12 — Kevin called out "no helmets?"
    // despite 100% helmet pool). Force Haiku to preserve them.
    preservePhrasesByPath: {
      'female-explorer': [
        'woman', 'she', 'her',
        'helmet', 'visor', 'faceplate', 'bubble helm', 'breathing apparatus',
        'form-fit', 'pressure suit', 'EVA',
      ],
      'male-explorer': [
        'man', 'he', 'his',
        'helmet', 'visor', 'faceplate', 'sealed', 'full-coverage helm',
        'tactical armor', 'armored coat', 'cloak', 'ballistic harness',
      ],
    },
  },

  // Sensory anchors — 3 contexts (explorer-female / explorer-male / scene)
  // since cyborg + robot moved to MechBot 2026-05-05.
  sensoryAnchors: {
    enabled: true,
    requiredChannels: ['lightcolor'],
    pathContext: {
      'female-explorer': 'explorer-female',
      'male-explorer': 'explorer-male',
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
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
    };
  },

  // Bot-level pool defaults — slot name → pool key in pools.js. The shared
  // brief-composer reads this when a path doesn't override a slot. Universal
  // axes (story_beat, lighting, etc.) are sci-fi-coded by content in StarBot's
  // pools; other bots ship their own genre-coded versions.
  // See BOT_AXIS_REFACTOR_PLAN.md for the pool resolution hierarchy.
  defaultPools: {
    // Universal axes
    story_beat: 'STORY_BEATS',
    composition_frame: 'COMPOSITION_FRAME',
    scale_provers: 'SCALE_PROVERS',
    weather_particulate: 'WEATHER_PARTICULATE',
    emotional_dna: 'EMOTIONAL_DNA',
    lighting: 'LIGHTING',
    anchor_scale: 'ANCHOR_SCALE',
    // Bot-level axes
    surprise_element: 'SURPRISE_ELEMENT',
    sky_layer: 'ALIEN_SKY_LAYER',
    anchor_entity: 'STARBOT_ANCHOR_ENTITY',
  },

  // Lookup a pool array by its key in pools.js. Used by the brief-composer
  // to resolve slot → pool at render time. Throws if the pool is unknown.
  poolByName(name) {
    if (!(name in pools)) {
      throw new Error(`StarBot.poolByName: unknown pool "${name}"`);
    }
    return pools[name];
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`StarBot: unknown path "${path}"`);
    // Two supported path module shapes:
    //   (a) function — legacy hand-written path; called directly
    //   (b) object  { archetype, pools, ... } — declarative; routed through
    //       the shared brief-composer at scripts/lib/brief-composer.js
    if (typeof builder === 'function') {
      return builder({ sharedDNA, vibeDirective, vibeKey, picker });
    }
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
    throw new Error(`StarBot: path "${path}" has invalid export shape`);
  },

  caption({ path }) {
    return `[${path}] StarBot`;
  },
};
