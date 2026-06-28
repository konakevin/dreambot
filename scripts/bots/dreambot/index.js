/**
 * ChibiBot — the bot-engine contract.
 *
 * 2026-05-20 — Cut 6 redundant paths (bookish-sanctuary, fireplace-cabin,
 * snowy-arctic, jungle-canopy, sunny-pair, storybook-page) after migration
 * audit; covered by cozy-interior / arctic-village / jungle-village /
 * cozy-landscape / night-meadow / heartwarming-scene. outdoor-adventure
 * kept — covers wild/open-world creature scenes that nothing else does.
 *
 * 2026-05-07 — Toy-photography paths (plushie-life, dollhouse-life) removed;
 * those live in ToyBot now.
 *
 * 2026-05-06 — CuddleBot merged into ChibiBot.
 *
 * 2026-05-22 — Food paths (miniature-feast, cute-food) moved to YumBot.
 *
 * Path inventory (17):
 *   Indoor: rainy-interior / cozy-interior
 *   Creature-focused: heartwarming-scene / creature-portrait / sleepy-naptime /
 *                     bath-time / cuddly-aquatic
 *   Outdoor-scene: cozy-landscape / rainy-day-cozy / night-meadow / outdoor-adventure
 *   Villages (6): aquatic-village / arctic-village / cottagecore-village /
 *                 jungle-village / sunny-village / twilight-village
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');
const { ALL_ENABLED_AI_MODELS } = require('../../lib/imageModels');

const pathBuilders = {
  // 3 ChibiBot-original indoor paths
  'rainy-interior': require('./paths/rainy-interior'),
  // 15 paths from CuddleBot (plushie-life + dollhouse-life moved to ToyBot)
  'heartwarming-scene': require('./paths/heartwarming-scene'),
  'cozy-landscape': require('./paths/cozy-landscape'),
  'creature-portrait': require('./paths/creature-portrait'),
  'creature-world': require('./paths/creature-world'),
  'bubble-bot-dreams': require('./paths/bubble-bot-dreams'),
  'bubble-bot-dreams-warm': require('./paths/bubble-bot-dreams-warm'),
  // Crossover paths — the bubble-bot visits other bots' worlds (glossy-dreamy).
  'bubble-bot-dreams-earthbot': require('./paths/bubble-bot-dreams-earthbot'),
  'bubble-bot-dreams-brickbot': require('./paths/bubble-bot-dreams-brickbot'),
  'bubble-bot-dreams-dragonbot': require('./paths/bubble-bot-dreams-dragonbot'),
  'bubble-bot-dreams-bloombot': require('./paths/bubble-bot-dreams-bloombot'),
  'bubble-bot-dreams-chibibot': require('./paths/bubble-bot-dreams-chibibot'),
  'bubble-bot-dreams-dinobot': require('./paths/bubble-bot-dreams-dinobot'),
  'bubble-bot-dreams-faebot': require('./paths/bubble-bot-dreams-faebot'),
  'bubble-bot-dreams-gothbot': require('./paths/bubble-bot-dreams-gothbot'),
  'bubble-bot-dreams-mangabot': require('./paths/bubble-bot-dreams-mangabot'),
  'bubble-bot-dreams-mechbot': require('./paths/bubble-bot-dreams-mechbot'),
  'bubble-bot-dreams-oceanbot': require('./paths/bubble-bot-dreams-oceanbot'),
  'bubble-bot-dreams-pixelbot': require('./paths/bubble-bot-dreams-pixelbot'),
  'bubble-bot-dreams-retrobot': require('./paths/bubble-bot-dreams-retrobot'),
  'bubble-bot-dreams-starbot': require('./paths/bubble-bot-dreams-starbot'),
  'bubble-bot-dreams-steambot': require('./paths/bubble-bot-dreams-steambot'),
  'bubble-bot-dreams-tinybot': require('./paths/bubble-bot-dreams-tinybot'),
  'bubble-bot-dreams-toybot': require('./paths/bubble-bot-dreams-toybot'),
  'bubble-bot-dreams-yumbot': require('./paths/bubble-bot-dreams-yumbot'),
  'sleepy-naptime': require('./paths/sleepy-naptime'),
  'rainy-day-cozy': require('./paths/rainy-day-cozy'),
  'bath-time': require('./paths/bath-time'),
  'cuddly-aquatic': require('./paths/cuddly-aquatic'),
  'night-meadow': require('./paths/night-meadow'),
  'outdoor-adventure': require('./paths/outdoor-adventure'),
  'cozy-interior': require('./paths/cozy-interior'),
  // 6 village paths
  'cottagecore-village': require('./paths/cottagecore-village'),
  'aquatic-village': require('./paths/aquatic-village'),
  'arctic-village': require('./paths/arctic-village'),
  'jungle-village': require('./paths/jungle-village'),
  'twilight-village': require('./paths/twilight-village'),
  'sunny-village': require('./paths/sunny-village'),
  // dreamscape — scene-as-hero candy-fantasy world vista (2026-06-27). NO
  // character; the world is the hero. Own cinematic-fantasy medium, flux-ultra.
  dreamscape: require('./paths/dreamscape'),
  // butterfly-realm — striking butterflies as the focal point of a lush scene
  // (2026-06-27). NO character; the butterflies are the hero. Own photoreal-
  // cinematic medium, flux-ultra.
  'butterfly-realm': require('./paths/butterfly-realm'),
  // dream-spires — whimsical fairytale TOWER-CITY (2026-06-27). NO character;
  // the impossible tower-city is the hero. Own painterly-storybook medium,
  // flux-ultra. EXTERIOR VISTAS ONLY.
  'dream-spires': require('./paths/dream-spires'),
};

// All look-enabled paths = every path EXCEPT creature-world (which keeps its
// hearted chibibot_creature recipe). Drives mediumByPath routing + the
// cleanMediumByModel skipPaths (so gpt-2/banana render WITH the look). Derived
// so a new path is look-enabled by default — exclude one by name here.
// All bubble-bot-dreams* paths (base + warm + crossovers) are NON-look paths:
// locked to the glossy designer-vinyl medium, excluded from the look rotation.
const CHIBI_LOOK_PATHS = Object.keys(pathBuilders).filter(
  (p) =>
    p !== 'creature-world' &&
    p !== 'dreamscape' &&
    p !== 'butterfly-realm' &&
    p !== 'dream-spires' &&
    !p.startsWith('bubble-bot-dreams')
);

// Crossover paths (the bubble-bot in other bots' worlds). All share the
// bubble-bot-dreams config (glossy-dreamy medium + flux-ultra + skip chaos/polish);
// only their dream_world pool differs. Listed once here, spread into the maps below.
const CROSSOVER_PATHS = [
  'bubble-bot-dreams-earthbot',
  'bubble-bot-dreams-brickbot',
  'bubble-bot-dreams-dragonbot',
  'bubble-bot-dreams-bloombot',
  'bubble-bot-dreams-chibibot',
  'bubble-bot-dreams-dinobot',
  'bubble-bot-dreams-faebot',
  'bubble-bot-dreams-gothbot',
  'bubble-bot-dreams-mangabot',
  'bubble-bot-dreams-mechbot',
  'bubble-bot-dreams-oceanbot',
  'bubble-bot-dreams-pixelbot',
  'bubble-bot-dreams-retrobot',
  'bubble-bot-dreams-starbot',
  'bubble-bot-dreams-steambot',
  'bubble-bot-dreams-tinybot',
  'bubble-bot-dreams-toybot',
  'bubble-bot-dreams-yumbot',
];

module.exports = {
  username: 'dreambot',
  displayName: 'DreamBot',

  // 50/50 rotation between two medium identities (2026-05-19):
  //   chibibot_render — "funko cute": hyper-detailed 3D CGI / Pop-Mart designer-vinyl register
  //   chibibot_pixar  — "pixar cute": modern Pixar/Disney/DreamWorks animated-feature register
  // Equal counts → equal probability via botEngine.resolveMedium.
  mediums: ['chibibot_render', 'chibibot_pixar'],

  mediumStyles: {
    // bubble-bot-dreams (2026-06-12 QA R3): lean DreamBot override of the shared
    // CHIBI_RENDER_MEDIUM. Drops the product-shot cues ("designer-collectible",
    // "Pop Mart designer-toy register") that prime Flux for a shallow-DOF studio
    // product shot with a blurred backdrop, and the redundant figure language (the
    // figure axes own that now). Keeps the glossy CGI vinyl polish; adds deep-focus.
    chibibot_render:
      'polished glossy 3D CGI render, ultra-clean subsurface-scattering vinyl materials, crisp dewy highlights, luminous pastel magical-wallpaper finish, deep focus, richly detailed throughout',
    // bubble-bot-dreams-WARM (R2 look): the original Pop-Mart designer-collectible
    // vinyl medium — softer, warmer, shallower DOF "toy-on-a-diorama" register. A
    // distinct second feed look vs the sharp chibibot_render lean medium above.
    dreambot_render_warm: blocks.CHIBI_RENDER_MEDIUM,
    chibibot_pixar: blocks.CHIBI_PIXAR_MEDIUM,
    // creature-world only — the verbatim 05-07 medium that produced Kevin's
    // hearted ornate single-hero creatures (recovered from render recipes;
    // see CHIBI_CREATURE_MEDIUM). bot.mediumStyles overrides the DB
    // flux_fragment, so this fully controls creature-world's style prefix.
    chibibot_creature: blocks.CHIBI_CREATURE_MEDIUM,
    chibibot_gpt_clean: blocks.GPT_CLEAN,
    // "Looks" medium (2026-06-07) — locks chibi-creature identity + proportions,
    // defers the render style to the rolled sharedDNA.lookRegister. See
    // shared-blocks.js CHIBI_NEUTRAL. Supersedes the chibibot_render/pixar
    // coin-flip on look-enabled paths.
    chibibot_neutral: blocks.CHIBI_NEUTRAL,
    // dreamscape — the world-vista path's own cinematic-fantasy medium (code-only,
    // no DB row; fetchMediumFluxFragment returns '' for an unknown key + modelByPath
    // hard-locks the model). NOT the chibi vinyl/pixar look. See shared-blocks.js.
    dreambot_dreamscape: blocks.DREAMSCAPE_MEDIUM,
    // butterfly-realm — own photoreal-cinematic medium (code-only, no DB row).
    dreambot_butterfly: blocks.BUTTERFLY_MEDIUM,
    // dream-spires — own painterly-storybook medium (code-only, no DB row).
    dreambot_spires: blocks.DREAM_SPIRES_MEDIUM,
  },

  // gpt-image-2 + nano-banana clean-render override (2026-06-07). Both models
  // read the CGI/polish anchors as "go abstract"; the clean medium (+ empty
  // promptPrefixByMedium) lets the seed's cute subject lead. Overrides the
  // chibibot_pixar mediumByPath locks below when one of these models rolls.
  // skipPaths (2026-06-07): the look-enabled paths opt OUT of the clean swap so
  // gpt-2 + nano-banana render WITH the rolled look (chibibot_neutral medium)
  // instead of the look-blind chibibot_gpt_clean. VERIFIED they hold the look +
  // chibi creature with no abstract drift (gorgeous critter-village + cute
  // creature renders). Non-look paths still swap to clean. (MVP-4 listed here;
  // expand to all 16 look paths at full rollout.)
  // cleanMediumByModel retired 2026-06-21 — only ever routed Nano Banana / gpt-2,
  // both now banned bot-wide (FLUX-only).
  cleanMediumByModel: {},

  // Per-path medium lock — falls through to bot.mediums 50/50 rotation
  // when path not listed.
  //
  // ── "Looks" axis (2026-06-07) — MVP on 4 paths ──────────────────────────
  // chibibot_neutral routes the look-enabled paths so the fixed Pop-Mart-vinyl
  // / pixar style lock is bypassed and the rolled sharedDNA.lookRegister (one of
  // 13 cute film/storybook looks) leads CLIP. MVP scope: creature-portrait +
  // cuddly-aquatic + cottagecore-village + sleepy-naptime — render-validated
  // (human-child leak + species fidelity + proportions) before the other 12
  // are flipped. creature-world stays on chibibot_creature (hearted recipe).
  // Every look-enabled path → chibibot_neutral (the looks medium). creature-world
  // is the ONLY exclusion — it keeps its hearted chibibot_creature medium (the
  // verbatim 05-07 "creature IS the subject" text that produced Kevin's hearted
  // ornate single-hero creatures) + its flux-dev lock.
  mediumByPath: {
    ...Object.fromEntries(CHIBI_LOOK_PATHS.map((p) => [p, 'chibibot_neutral'])),
    'creature-world': 'chibibot_creature',
    // bubble-bot-dreams locks the glossy designer-vinyl render (the reference look).
    'bubble-bot-dreams': 'chibibot_render',
    // bubble-bot-dreams-warm: the R2 warmer designer-collectible medium.
    'bubble-bot-dreams-warm': 'dreambot_render_warm',
    // crossover paths use the sharp glossy-dreamy medium (the R4 look).
    ...Object.fromEntries(CROSSOVER_PATHS.map((p) => [p, 'chibibot_render'])),
    // dreamscape locks its own cinematic-fantasy medium (the world-vista look).
    dreamscape: 'dreambot_dreamscape',
    // butterfly-realm locks its own photoreal-cinematic medium.
    'butterfly-realm': 'dreambot_butterfly',
    // dream-spires locks its own painterly-storybook medium.
    'dream-spires': 'dreambot_spires',
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // chibibot_pixar uses the original (pre-rewrite) prefix verbatim.
  // chibibot_render falls through to bot.promptPrefix above.
  promptPrefixByMedium: {
    // bubble-bot-dreams (2026-06-12 QA R3): override the bot's product-shot
    // PROMPT_PREFIX ("designer collectible quality") for the render medium, and
    // LEAD with the WORLD so CLIP doesn't collapse the scene into a product-shot
    // bokeh backdrop. Only bubble-bot-dreams uses chibibot_render on DreamBot.
    chibibot_render:
      'lush richly-detailed magical dream-world wallpaper, deep focus crisp throughout, glossy luminous pastel finish',
    chibibot_pixar: blocks.PROMPT_PREFIX_PIXAR,
    chibibot_gpt_clean: '',
    // dreamscape: LEAD with the WORLD so CLIP gets a scene cue first (env-collapse
    // lesson). Region/world-anchor only — NO biome enumeration (first-noun lock).
    dreambot_dreamscape:
      'lush hyper-detailed magical fantasy dream-world, cinematic wallpaper, deep focus, ultra-saturated',
    // butterfly-realm (R5): LEAD with the striking butterflies + a PAINTERLY
    // STORYBOOK dream-world cue (Kevin: R4 read cheesy-CGI; match the dreamscape
    // path's painterly look). Subject anchor only.
    dreambot_butterfly:
      'lush painterly butterfly dreamscape, striking iridescent butterflies the focal point painted into the scene, a dreamy colorful storybook dream-world, magical and whimsical',
    // dream-spires: LEAD with the whimsical tower-city hero + painterly storybook
    // cue. Region/world-anchor only — no enumeration (first-noun lock).
    dreambot_spires:
      'whimsical fairytale tower-city, impossible twisting pastel spires with glowing windows, lush painterly storybook dream-world, dreamy and magical',
    // Tight cute anchor that REPLACES the bot's Pop-Mart-vinyl PROMPT_PREFIX so
    // the rolled look leads the style. Deliberately NOT "creature" — that word
    // here front-loads creature-as-subject and collapses the scene-led village/
    // landscape paths into a creature close-up. Empty would fall through to the
    // Pop-Mart prefix, so a 2-word cute anchor that doesn't dictate the subject.
    chibibot_neutral: 'cute chibi',
  },

  // Per-medium suffix override — chibibot_neutral drops the bot PROMPT_SUFFIX's
  // generic tail and reinforces the no-humans guard; the look carries finish.
  promptSuffixByMedium: {
    chibibot_neutral: 'adorable wholesome charm, every character is a creature, no humans, no text no watermarks',
  },

  // Per-path prefix override — prepended BEFORE the medium style prefix as
  // the FIRST tokens Flux sees. Use case: aquatic-village needs cool-teal-water
  // context to override the warm-amber-jungle-palette baked into the medium
  // (which causes Flux to render coastal scenes as warm-cottage villages).
  //
  // 2026-06-02 cruft-audit strip — was 499ch with THREE enumeration locks:
  //   • biome-OR `UNDERWATER OR COASTAL OCEAN SCENE` at the open (locked
  //     Flux UNDERWATER, every render fully submerged regardless of subject)
  //   • palette enum `TEAL + CYAN + AQUA + CORAL-PINK + PEARL-VIOLET`
  //     (locked TEAL, dropped the other 4)
  //   • biome-OR repeated `submerged underwater village OR coastal tidepool`
  //   • negation tail `NOT warm tropical jungle palette` (per
  //     [[feedback_negative_prompt_leak]] this LEAKS jungle palette)
  //
  // New: single anchor "aquatic ocean scene with VISIBLE WATER", cool
  // aquatic mood as a single attribute (not an enum), positive-only.
  // Subject pool decides submerged vs tidepool — wrapper doesn't pre-pick.
  promptPrefixByPath: {
    'aquatic-village':
      'aquatic ocean scene with VISIBLE WATER, cool aquatic palette, water-caustic light dappling every surface, drifting bubble-streams, swirling fish-schools in background, bioluminescent coral-glow accents, water-reflection on architecture',
    // bubble-bot-dreams: NO prefix (2026-06-12 axis rebuild, QA R2). A front
    // prefix front-loads the bot-as-product on CLIP and collapses the dream world
    // into a blurred bokeh backdrop (the briefs describe rich worlds; Flux renders
    // a product shot). The figure axes + template already lock the hero, so the
    // prefix is redundant AND harmful to the environment. Let the world breathe.
  },

  // Cute-forward vibes (banned: dark, fierce, macabre, nightshade,
  // psychedelic, ancient, epic, voltage, arcane).
  vibes: [
    'cozy',
    'peaceful',
    'whimsical',
    'enchanted',
    'coquette',
    'shimmer',
    'nostalgic',
    'ethereal',
    'cinematic',
    'surreal',
  ],

  // DreamBot's active paths. First path: bubble-bot-dreams (xerox-copied from
  // ChibiBot 2026-06-12). The rest of the ChibiBot machinery is inherited
  // (dormant) so future DreamBot paths are easy — only listed paths post.
  paths: [
    'bubble-bot-dreams',
    'bubble-bot-dreams-warm',
    ...CROSSOVER_PATHS,
    'dreamscape',
    'butterfly-realm',
    'dream-spires',
  ],

  // Path weights — 2× indoor boost; everything else 1×.
  // Flat rotation (2026-05-26): equal weight per path — every path posts
  // once per cycle in randomized order via the cycleAllPaths shuffle-bag.
  cycleAllPaths: true,

  useModelPicker: true,
  // Locked to flux-1.1-pro-ultra (Kevin 2026-06-07 — the chibi look rolls
  // cleanest on pro-ultra) with a 20% bounce to gpt-image-2 for variety. The
  // gpt-2 picks auto-swap to chibibot_gpt_clean via cleanMediumByModel (mig
  // 238) so they render with the dedicated clean directive instead of the
  // neutral medium's Pop-Mart vinyl default.
  // flux-1.1-pro allowed alongside ultra everywhere (Kevin 2026-06-21).
  allowedModels: ['black-forest-labs/flux-1.1-pro-ultra', 'black-forest-labs/flux-1.1-pro'],
  modelWeights: {
    'black-forest-labs/flux-1.1-pro-ultra': 80,
    'black-forest-labs/flux-1.1-pro': 80,
  },

  // Per-path model lock. creature-world → flux-dev. CONFIRMED from the DB:
  // the ornate reference renders Kevin hearted (2026-05-07, paths
  // aquatic-village/outdoor-adventure/etc.) were ALL flux-dev. flux-1.1-pro
  // renders the medium's literal "Be@rbrick designer-vinyl" as glass/metallic
  // figurines — the wrong look. flux-dev gives the soft, ornate, jewel-eyed
  // creatures. (Locked per-path so it survives even if chibibot.allowedModels
  // changes again — the f5ad51a drift that lost flux-1.1-pro is irrelevant
  // here because flux-dev is exactly what we want.)
  modelByPath: {
    'creature-world': 'black-forest-labs/flux-dev',
    // Lock to pro-ultra (no gpt-2 bounce) — the glossy iridescent reference look.
    'bubble-bot-dreams': 'black-forest-labs/flux-1.1-pro-ultra',
    'bubble-bot-dreams-warm': 'black-forest-labs/flux-1.1-pro-ultra',
    ...Object.fromEntries(
      CROSSOVER_PATHS.map((p) => [p, 'black-forest-labs/flux-1.1-pro-ultra'])
    ),
    // dreamscape — pro-ultra renders the lush hyperreal candy-fantasy vista best.
    dreamscape: 'black-forest-labs/flux-1.1-pro-ultra',
    // butterfly-realm — flux-1.1-pro + pro-ultra (uniform random), both render
    // crisp iridescent wings + lush photoreal depth (Kevin 2026-06-27).
    'butterfly-realm': ['black-forest-labs/flux-1.1-pro-ultra', 'black-forest-labs/flux-1.1-pro'],
    // dream-spires — the 5 models approved for this path (2026-06-28), uniform
    // random. pro-ultra = the most magical/polished pastel castle-cities;
    // flux-1.1-pro = pro-ultra-tier crisp + cheaper; flux-2-flex = cozy inked
    // storybook; flux-2-pro = rich painterly misty spire-villages; flux-2-max =
    // rich detailed whimsy+charm (the safety-filter false-positives it trips just
    // re-roll + recover, never fail). (flux-dev banned — too soft/atmospheric.)
    'dream-spires': [
      'black-forest-labs/flux-1.1-pro-ultra',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-2-flex',
      'black-forest-labs/flux-2-pro',
      'black-forest-labs/flux-2-max',
    ],
  },

  // Chaos layer — subject chaos OFF for creature-centric paths (don't
  // distort the cute silhouette). Village + scenery + storybook +
  // cozy-interior + indoor paths get subject-chaos.
  chaos: {
    enabled: true,
    // 2026-06-05 — bath-time lean-rebuild: every chaos perturbation (geometry,
    // framing, secondary_light, etc.) pushes the bath vessel further out of
    // focus on a path whose entire identity is "creature in a bath." Skip.
    skipPaths: [
      'bath-time',
      'bubble-bot-dreams',
      'bubble-bot-dreams-warm',
      'dreamscape',
      'butterfly-realm',
      'dream-spires',
      ...CROSSOVER_PATHS,
    ],
    allowSubjectChaosPaths: [
      'cozy-landscape',
      'rainy-day-cozy',
      'night-meadow',
      'aquatic-village',
      'jungle-village',
      'arctic-village',
      'twilight-village',
      'sunny-village',
      'cottagecore-village',
      'cozy-interior',
      'rainy-interior',
    ],
  },

  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '65-90',
    preservePhrasesByPath: {},
    skipPaths: [
      'bath-time',
      'bubble-bot-dreams',
      'bubble-bot-dreams-warm',
      'dreamscape',
      'butterfly-realm',
      'dream-spires',
      ...CROSSOVER_PATHS,
      'cuddly-aquatic',
      'night-meadow',
      'cozy-landscape',
      'rainy-interior',
      'rainy-day-cozy',
      'sleepy-naptime',
      'jungle-village',
      'cozy-interior',
      'arctic-village',
      'aquatic-village',
      'cottagecore-village',
      'sunny-village',
      'twilight-village',
      'outdoor-adventure',
      'creature-portrait',
      'creature-world',
    ],
  },

  // Sensory anchors — creature-centric paths use 'creature' context;
  // scenery/village/indoor paths use 'scene'.
  sensoryAnchors: {
    enabled: true,
    requiredChannels: ['lightcolor'],
    pathContext: {
      'creature-portrait': 'creature',
      'creature-world': 'creature',
      'sleepy-naptime': 'creature',
      // 2026-06-05 — bath-time lean-rebuild: anchors compounded into the
      // bubble-creature failure on shimmer; the medium fragment already
      // carries the creature-DNA tokens. No anchor needed for this path.
      // (Omit 'bath-time' → no sensory anchoring fires here.)
      'cuddly-aquatic': 'creature',
      'heartwarming-scene': 'scene',
      'cozy-landscape': 'scene',
      'rainy-day-cozy': 'scene',
      'night-meadow': 'scene',
      'outdoor-adventure': 'creature',
      'aquatic-village': 'scene',
      'jungle-village': 'scene',
      'arctic-village': 'scene',
      'twilight-village': 'scene',
      'sunny-village': 'scene',
      'cozy-interior': 'scene',
      'cottagecore-village': 'scene',
      'rainy-interior': 'scene',
    },
    poolsByContextAndChannel: pools.SENSORY_POOLS,
  },

  // Bot-level pool defaults for declarative axis paths.
  // Universal slots (lighting, atmosphere) resolve here when a declarative
  // path declares them. Path-bespoke axes always override.
  defaultPools: {
    lighting: 'LIGHTING',
    atmosphere: 'ATMOSPHERES',
    weather: 'SCENE_WEATHER',
  },

  poolByName(name) {
    const pools = require('./pools');
    if (!(name in pools)) {
      throw new Error(`ChibiBot.poolByName: unknown pool "${name}"`);
    }
    return pools[name];
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cozy,
      // Bot-wide cute film/storybook look (2026-06-07). Rolled for every path
      // but only CONSUMED by look-enabled templates (they lead their brief with
      // it). recency-aware so the same look doesn't cluster.
      lookRegister: picker
        ? picker.pickWithRecency(pools.CHIBIBOT_LOOK_REGISTER, 'look_register')
        : pools.CHIBIBOT_LOOK_REGISTER[0],
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, medium, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`ChibiBot: unknown path "${path}"`);
    // Declarative axis-system paths export an object { archetype, pools }.
    // Legacy function-form paths export a function. Dispatch on shape.
    let result;
    if (builder && typeof builder === 'object' && builder.archetype) {
      const { composeBrief } = require('../../lib/brief-composer');
      result = composeBrief({
        bot: module.exports,
        pathConfig: builder,
        sharedDNA,
        vibeDirective,
        picker,
      });
    } else if (typeof builder === 'function') {
      result = builder({ sharedDNA, vibeDirective, vibeKey, picker });
    } else {
      throw new Error(`ChibiBot: path "${path}" has invalid export shape`);
    }
    // chibibot_render: append the 1–3 character-count rule so renders
    // aren't all solo portraits. Pixar renders skip this entirely.
    // EXEMPT creature-world — its identity is a SOLO hero figure (the
    // count-block's pair/trio would break the "Pop Mart" collectible look).
    // EXEMPT bath-time (2026-06-05 lean rebuild) — count is owned by the
    // path's creature_1 + conditional creature_2/creature_3 axes; the
    // append-block double-sources count instructions.
    if (
      medium === 'chibibot_render' &&
      path !== 'creature-world' &&
      path !== 'bath-time' &&
      !path.startsWith('bubble-bot-dreams')
    ) {
      const append = (str) => str + '\n\n' + blocks.CHIBI_CHARACTER_COUNT_BLOCK;
      if (typeof result === 'string') return append(result);
      if (result && typeof result.brief === 'string')
        return { ...result, brief: append(result.brief) };
      return result;
    }
    // chibibot_pixar AND chibibot_neutral ("looks"): swap the render-style
    // shared blocks for their style-AGNOSTIC _PIXAR variants. The default
    // STYLIZED_NOT_PHOTOREAL_BLOCK hard-codes the Pop-Mart-vinyl register, which
    // would fight a rolled look; the _PIXAR variant says "let the MEDIUM tag
    // control the art style" — so the rolled look register provides the style.
    if (medium === 'chibibot_pixar' || medium === 'chibibot_neutral') {
      const swap = (str) =>
        str
          .split(blocks.STYLIZED_NOT_PHOTOREAL_BLOCK)
          .join(blocks.STYLIZED_NOT_PHOTOREAL_BLOCK_PIXAR)
          .split(blocks.BLOW_IT_UP_BLOCK)
          .join(blocks.BLOW_IT_UP_BLOCK_PIXAR);
      if (typeof result === 'string') return swap(result);
      if (result && typeof result.brief === 'string')
        return { ...result, brief: swap(result.brief) };
      return result;
    }
    return result;
  },

  caption({ path }) {
    return `[${path}] ChibiBot`;
  },
};
