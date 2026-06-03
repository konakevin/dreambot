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
  megastructure: require('./paths/megastructure'),
  'space-femme': require('./paths/space-femme'),
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
    // space-femme: bespoke FUN/SEXY/VIVID sci-fi cover look on its OWN medium —
    // NO artist names (Kevin 2026-05-23: artist refs read muted/serious + killed
    // the fun). Own medium so canvas (female/male-explorer) stays untouched.
    'space-femme': 'starbot_space_femme',
    // megastructure: reverted to default starbot_hyperreal medium
    // (Kevin 2026-05-14 — align with all other scene paths)
  },

  // cozy-sci-fi-interior only gets warm/intimate vibes
  vibesByPath: {
    'cozy-sci-fi-interior': [
      'nostalgic',
      'ethereal',
      'enchanted',
      'shimmer',
      'dark',
      'voltage',
      'arcane',
      'surreal',
      'cinematic',
    ],
  },

  // Picker on with a 5-model lineup (2026-06-01 Kevin):
  // Banana + GPT-2 + Flux 2 Pro + Flux 1.1 Pro + Flux 1.1 Pro Ultra.
  // Dropped from the original BOT_MODEL_TALLY 7-model fleet set:
  //   • Flux Dev, Flux 2 Max — earlier 2026-05-30 review
  //   • Flux 2 Flex          — 2026-06-01 (this commit)
  useModelPicker: true,
  allowedModels: [
    'google/gemini-2-image',
    'openai/gpt-image-2',
    'black-forest-labs/flux-2-pro',
    'black-forest-labs/flux-1.1-pro',
    'black-forest-labs/flux-1.1-pro-ultra',
  ],

  // Per-path override (2026-05-30 BOT_MODEL_TALLY): Kevin hearted Flux 2 Max
  // renders on `cosmic-vista` and `real-space` but explicitly wants those
  // paths to also exclude Flux 2 Pro so the OTHER models get reps. These
  // entries OVERRIDE the bot-wide picker for these two paths — same lineup
  // minus Flux 2 Pro (5 models). Other 10 paths fall through to the picker
  // above and use the full 6-model bot-wide lineup.
  // Original per-path locks stripped 2026-05-30; restore individual lines
  // here if a path needs pinning again.
  modelByPath: {
    // cosmic-vista (Kevin 2026-05-31): bot-wide MINUS Flux 2 Pro (2026-05-30),
    // MINUS Flux 2 Flex + MINUS Banana (heart-bans from today's comparison
    // test), AND MINUS Flux 1.1 Pro (Ultra is strictly better — Pro is
    // redundant when Ultra is present). Down to 2 models.
    'cosmic-vista': ['openai/gpt-image-2', 'black-forest-labs/flux-1.1-pro-ultra'],
    // alien-landscape (Kevin 2026-05-31): bot-wide MINUS Flux 2 Flex,
    // MINUS Banana (heart-ban), AND MINUS Flux 1.1 Pro (redundant w/ Ultra).
    // Down to 3 models.
    'alien-landscape': [
      'openai/gpt-image-2',
      'black-forest-labs/flux-2-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    // alien-city / megastructure (Kevin 2026-05-31): bot-wide MINUS Flux 2
    // Flex AND MINUS Flux 1.1 Pro (redundant w/ Ultra). Down to 4 models.
    'alien-city': [
      'google/gemini-2-image',
      'openai/gpt-image-2',
      'black-forest-labs/flux-2-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    megastructure: [
      'google/gemini-2-image',
      'openai/gpt-image-2',
      'black-forest-labs/flux-2-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    // cozy-sci-fi-interior (Kevin 2026-05-31): bot-wide MINUS Flux 2 Pro
    // AND MINUS Flux 2 Flex (3 hearts each in tonight's comparison test).
    // F1.1 Pro intentionally kept (the "Pro redundant w/ Ultra" rule is NOT
    // applied here — Kevin's call). Down to 4 models.
    'cozy-sci-fi-interior': [
      'google/gemini-2-image',
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    // space-opera (Kevin 2026-05-31): REVIVED at premium-tier axis enrichment
    // (5 new bespoke pools + probabilistic axis gating). Locked to GPT-2 +
    // F1.1 Ultra after 3 model-test rounds — Banana / F2 Pro / F2 Flex
    // produced "too messy" renders even with gating; F1.1 Ultra ships clean,
    // GPT-2 handles the gated density well.
    'space-opera': ['openai/gpt-image-2', 'black-forest-labs/flux-1.1-pro-ultra'],
    // real-space (Kevin 2026-05-31): GPT-2 + F1.1 Pro + F1.1 Ultra after the
    // premium-tier axis enrichment + 9-render test. Banana / F2 Pro / F2 Flex
    // remain banned. F1.1 Pro kept (Kevin's "keep Pro on non-character paths"
    // override of the "Pro redundant with Ultra" rule).
    'real-space': [
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
  },

  // Per-medium prompt prefix/suffix overrides. The star_oil_cosmos medium
  // uses environment-dominant language so the scene wins over the figure
  // (mirrors gothbot gothic_oil_garden pattern).
  promptPrefixByMedium: {
    star_oil_cosmos:
      'cinematic sci-fi oil painting, environment-dominant composition, heavy impasto brushwork, atmospheric depth',
    // 2026-06-02 cruft-audit micro-strip — dropped travel-mag `wallpaper-
    // worthy`. The "PUNCHED UP / cranked to 11 / blazing" positive
    // intensifiers already carry the maxed-saturation register.
    real_astro:
      'NASA Hubble JWST astrophotography PUNCHED UP to maximum, vibrant false-color composite cranked to 11, dramatic events captured mid-action — jets shooting / shockwaves expanding / aurora flaring / accretion disks burning / gravitational lensing distorting backgrounds, multiple celestial elements happening at once in the same frame, luminous glowing structures saturated to gallery-print intensity, blazing star fields with diffraction spikes',
    // Hyperreal sci-fi concept-art prefix for starbot_hyperreal medium (migration 145).
    starbot_hyperreal:
      'hyperrealistic photoreal rendering of a science-fiction world, cinematic concept art, ray-traced volumetric lighting, atmospheric depth haze, photoreal future-tech surfaces, mythic epic scale, movie-poster composition',
    // Cosmic-void prefix for space-opera path — mandates pure space vacuum
    // context with ship-as-subject. Added 2026-05-11.
    // 2026-06-02 cruft-audit micro-strip — dropped 4-stack NOT chain
    // (NOT planetary surface / NOT canyon / NOT ground-level / NOT
    // atmospheric) per [[feedback_negative_prompt_leak]]. The "pure
    // vacuum / deep void of space / starfield and nebula backdrop ONLY /
    // ship-as-subject" positive anchors already mandate vacuum context.
    starbot_cosmic_void:
      'epic cosmic space scene set in pure vacuum, deep void of space, kilometer-class capital spaceships dominating the frame, starfield and nebula backdrop only, hyperrealistic photoreal cinematic sci-fi concept art, ray-traced volumetric lighting in vacuum, ship-as-subject composition',
    // space-femme: minimal neutral prefix so the rolled render_style axis (not a
    // fixed style) sets the look. Overrides the heavier bot-wide PROMPT_PREFIX.
    starbot_space_femme: 'bold vivid imaginative science-fiction cover art',
  },
  promptSuffixByMedium: {
    star_oil_cosmos: 'oil-on-canvas finish, impasto brushwork, no text no words no watermarks',
    // 2026-06-02 cruft-audit micro-strip — dropped 5-stack NO chain
    // (NO monitors / NO screens / NO viewports / NO characters / NO
    // industrial scene framing) per [[feedback_negative_prompt_leak]].
    // Replaced travel-mag `wallpaper saturation` with `gallery-print
    // saturation`. The positive "celestial object is the MAIN SUBJECT /
    // occupies bulk of frame / spaceships only as scale-reference"
    // anchors already pin the subject framing.
    real_astro:
      'astrophotography finish cranked to gallery-print saturation, deep black space contrast, pinpoint stars with diffraction spikes, multi-wavelength false-color composite, dramatic mid-event detail (jets / shockwaves / accretion disks / lensing) visible in frame, the celestial object is the MAIN SUBJECT (occupies the bulk of the frame), spaceships permitted only as small silhouette / scale-reference elements at the frame edge, no text, no words, no watermarks',
    // Hyperreal sci-fi concept-art suffix for starbot_hyperreal medium (migration 145).
    // 2026-06-02 cruft-audit micro-strip — dropped tech-spec `8K` + 5-stack
    // NOT chain (NOT painted / NOT illustration / NOT drawing / NOT
    // cartoon / NOT stylized). The "photorealistic film still / cinematic
    // concept art precision / photoreal materials" positive anchors
    // carry the register.
    starbot_hyperreal:
      'cinematic concept art precision, photoreal materials and lighting, atmospheric lens flare and slight bloom, dust motes in light shafts, every plane filled with detail, no text, no words, no watermarks, photorealistic film still',
    // Cosmic-void suffix — reinforces vacuum context + ship-as-subject.
    // 2026-06-02 cruft-audit micro-strip — dropped tech-spec `8K` + 5-stack
    // NO chain (NO planet surface / NO canyon / NO city / NO ground /
    // NO buildings). The "in vacuum / deep black void backdrop / nebula
    // clouds only" positive anchors hold the vacuum context.
    starbot_cosmic_void:
      'cinematic concept art precision, photoreal materials in vacuum, lens flare from distant stars, atmospheric haze from nebula clouds only, the kilometer-class capital spaceship is the MAIN SUBJECT filling the frame, surrounded by smaller craft and starfield, deep black void backdrop, no text, no words, no watermarks, photorealistic film still in deep space',
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
    // space-femme bespoke medium (2026-05-23) — FUN / SEXY / VIVID sci-fi cover
    // look. NO artist names (Kevin: artist refs read muted + serious). Describes
    // the LOOK directly: bold saturated color, glossy, neon-and-chrome space gear,
    // sassy confident heroine, high-energy spectacle.
    // CONSISTENT signature style (Kevin 2026-05-23: art style stays the same;
    // the variety/weird lives in the GIRL + FASHION + scene, not the art style).
    // Vivid glossy neon-chrome sci-fi cover — the kept-posts look.
    // 2026-06-02 cruft-audit micro-strip — dropped 4-stack NOT tail
    // (NOT muted / NOT dull / NOT drab / NOT abstract-art-style). The
    // "vibrant glossy / eye-popping vivid electric / high-energy" positive
    // intensifiers carry the maxed-saturation register.
    starbot_space_femme:
      'vibrant glossy science-fiction cover illustration, bold saturated comic-cover color, slick chrome-and-neon rendering, eye-popping vivid electric palette, high-contrast dramatic neon-and-rim lighting, fun bold high-energy over-the-top sci-fi poster art, polished and crisp',
    // Hyperreal sci-fi concept-art mediumStyle — formalized as the bot-only
    // medium `starbot_hyperreal` in migration 145. Mirrors the DB row's
    // flux_fragment so the override is explicit rather than implicit.
    // 2026-06-02 cruft-audit micro-strip — dropped tech-spec `8K` + 7-stack
    // NOT tail (NOT painted / NOT illustration / NOT drawing / NOT cartoon /
    // NOT stylized / NOT toy / NOT videogame). The "hyperrealistic photoreal
    // / Denis Villeneuve sci-fi film still" positive anchors carry the
    // photoreal-cinematic register.
    starbot_hyperreal:
      'hyperrealistic photoreal cinematic sci-fi concept art, ray-traced volumetric lighting, atmospheric depth haze, photoreal future-tech and alien-world surfaces, slight bloom and lens flare, film-still precision, mythic epic scale, like a still from a Denis Villeneuve sci-fi film',
    // 2026-06-02 cruft-audit micro-strip — dropped 3-stack NOT tail
    // (NOT cute-watercolor / NOT children-book / NOT flowers). The 2-artist
    // lineage + "NASA concept-art / aerospace-concept-art / muted cosmic
    // palette" anchors carry the muted-cosmic-watercolor register.
    watercolor:
      'NASA concept-art watercolor wash — Robert-McCall painted-space-tradition + Jean-Giraud-Moebius watercolor-sci-fi, soft pigment-bleed on cold-press paper, delicate astronaut-sketch washes, muted cosmic palette (pale blues / dusty rose / sepia star-fields), atmospheric color-field abstraction, painterly aerospace-concept-art feel',
    pencil:
      'Ralph-McQuarrie Star-Wars-concept-art graphite + Syd-Mead architectural-pencil-rendering + NASA engineering-blueprint-cross-hatch + Moebius pencil-and-ink sci-fi concept sketch — tight cross-hatched shadow, technical-drafting precision, silver-graphite-on-toned-paper tradition, dramatic value range, architectural-scale cosmic machinery, pre-production-concept-sketch authority',
    // 2026-06-02 cruft-audit micro-strip — dropped 3-stack NOT tail (NOT
    // superhero-comic / NOT manga / NOT cartoon). The 5-artist Heavy-Metal
    // lineage + "European bande-dessinée / Arzach-Incal visual family /
    // dream-logic cosmic surrealism" anchors carry the BD register.
    illustration:
      'Moebius / Jean-Giraud / Philippe-Druillet / Enki-Bilal / Jodorowsky Heavy-Metal-magazine ink-and-color sci-fi BD tradition, clean-ink linework + flat-color-wash with gradient-field cosmic backgrounds, European bande-dessinée science-fiction craftsmanship, Arzach / Incal / The-Airtight-Garage visual family, dream-logic cosmic surrealism',
    // Bot-only custom medium for cosmic-oracle path — sci-fi adaptation of
    // gothbot's gothic_oil_garden. Full-scene painted cosmic oil-canvas where
    // a figure lives WITHIN the environment (NOT a centered portrait).
    star_oil_cosmos:
      'cinematic sci-fi oil painting, environment-dominant composition with figure WITHIN scene, visible impasto brushwork, heavy canvas texture, dramatic volumetric lighting, gallery-quality masterwork',
    // 2026-06-02 cruft-audit micro-strip — dropped travel-mag `wallpaper-
    // worthy` + 3-stack NOT tail (NOT sci-fi concept art / NOT painting /
    // NOT CGI). The Hubble/JWST/ESO false-color composite + scientific-
    // imaging anchors carry the astrophotography register.
    real_astro:
      'NASA-grade astrophotography — Hubble / JWST / ESO false-color composite, vibrant wavelength-mapped colors cranked to maximum, luminous nebula clouds glowing from within, blazing star clusters with diffraction spikes, deep-black void contrast, scientific-imaging aesthetic pushed to gallery-print vivid',
    // Cosmic-void mediumStyle — kilometer-class capital spaceships in pure
    // vacuum, ship-as-subject.
    // 2026-06-02 cruft-audit micro-strip — dropped tech-spec `8K` + 4-stack
    // NOT tail (NOT planetary surface / NOT canyon / NOT ground / NOT
    // atmospheric). The "deep space vacuum / pure vacuum context / nebula
    // haze in deep space" anchors hold the vacuum-only framing.
    starbot_cosmic_void:
      'hyperrealistic photoreal cinematic sci-fi concept art of a kilometer-class capital spaceship in deep space vacuum, ray-traced volumetric lighting from nebulae and distant stars, photoreal hull materials with weapon batteries lit-window grids and hangar bays visible, surrounded by smaller fighter wings cargo trains and satellites as scale provers, atmospheric nebula haze in deep space, film-still precision, like a still from a Denis Villeneuve cosmic sci-fi film — pure vacuum context throughout',
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // Inverts old excludeVibes (minimal/whimsical/cozy).
  vibes: ['cinematic'],

  paths: [
    'cosmic-vista',
    'alien-landscape',
    // REVIVED 2026-05-31 — moved from disabled to premium-tier axis path
    // (5 new bespoke pools added: crew_signal / faction_iconography /
    // propulsion_signature / genre_register / signature_hull_feature).
    // Original 2026-05-12 disable reason (Flux can't render ship silhouettes)
    // is moot now — broader model lineup (Banana / GPT-2 / Flux 2 Pro/Flex / Ultra).
    'space-opera',
    // 'sci-fi-interior' — disabled 2026-05-11 (cozy-sci-fi-interior wins)
    'cozy-sci-fi-interior',
    'alien-city',
    'real-space',
    'cosmic-oracle',
    'female-explorer',
    'male-explorer',
    'megastructure',
    'space-femme',
    // 8 franchise paths (aliens / dune / guardians / halo / mass-effect /
    // star-trek / starcraft / starwars) all DELETED 2026-05-14. Multiple
    // migration attempts produced "hallway" renders that Kevin rejected;
    // path/archetype/template/pool artifacts removed from repo.
  ],

  // Path weights.
  // Flattened to EQUAL distribution — all active paths weight 1 (Kevin 2026-05-23).
  // Flat rotation (2026-05-26): equal weight per path — every path posts
  // once per cycle in randomized order via the cycleAllPaths shuffle-bag.
  cycleAllPaths: true,

  // Chaos layer — allow subject chaos on scenery + megastructure paths
  // (silhouette/echo distortions).
  chaos: {
    enabled: true,
    skipPaths: [],
    allowSubjectChaosPaths: [
      'cosmic-vista',
      'alien-landscape',
      'space-opera',
      'sci-fi-interior',
      'cozy-sci-fi-interior',
      'alien-city',
      'real-space',
      'cosmic-oracle',
      'megastructure',
      // space-femme = the "crazy" path — subject chaos ON for weird LOOKS
      // (Kevin 2026-05-23: "increase the chaos threshold for weird looks/scenes").
      'space-femme',
    ],
    // Per-path chaos intensity bias — space-femme cranked high for weird/wild
    // renders; other StarBot paths keep default (no bias). +0.3 ≈ chaos almost
    // always fires and frequently stacks a 2nd distortion.
    intensityBiasByPath: {
      'space-femme': 0.3,
    },
  },

  // Two-pass Sonnet→Haiku polish.
  twoPassPolish: {
    enabled: true,
    // space-femme is a declarative axis-system path — Haiku polish strips its
    // load-bearing curated language (push-to-11 stack, biome, background drama,
    // props, poster framing). Axis-system paths default to polish OFF.
    // (feedback_axis_system_skip_polish)
    skipPaths: ['space-femme'],
    conceptWords: 150,
    polishedWords: '65-90',
    polishedWordsByPath: {
      'female-explorer': '80-110',
      'male-explorer': '80-110',
      // space-opera (2026-05-31): tighter target to reduce element-density
      // for literal models (Banana / GPT-2 / Flux 2 Pro). Probabilistic axis
      // gating + this compression nudge keeps per-render scenes coherent.
      'space-opera': '55-75',
    },
    // Helmet/visor/EVA tokens kept stripping during compression on
    // female-explorer (2026-05-12 — Kevin called out "no helmets?"
    // despite 100% helmet pool). Force Haiku to preserve them.
    preservePhrasesByPath: {
      'female-explorer': [
        'woman',
        'she',
        'her',
        'helmet',
        'visor',
        'faceplate',
        'bubble helm',
        'breathing apparatus',
        'form-fit',
        'pressure suit',
        'EVA',
      ],
      'male-explorer': [
        'man',
        'he',
        'his',
        'helmet',
        'visor',
        'faceplate',
        'sealed',
        'full-coverage helm',
        'tactical armor',
        'armored coat',
        'cloak',
        'ballistic harness',
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
      megastructure: 'scene',
      'space-femme': 'explorer-female',
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
