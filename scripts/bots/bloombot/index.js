/**
 * BloomBot — full rewrite 2026-05-06 (branch: bloombot-from-scratch).
 *
 * Compositional architecture, not big-pool architecture:
 *   palette (40 hand-authored)  + region (10 rotation, flora roster)
 *   + lighting (30 hand-authored) + per-path scene (hardcoded in builder)
 *   = the brief's color/species/light/scene DNA.
 *
 * Locked: medium = bloom_hyperreal_cgi (the "turtle" aesthetic),
 *         vibe   = cinematic only,
 *         model  = flux-1.1-pro only.
 *
 * Why locked: prior version's vibe rotation, medium overrides, and big
 * pool generators were the drift surfaces. Removing them.
 *
 * Adding a path: drop a builder in paths/, add to pathBuilders + paths +
 * pathWeights + sensoryAnchors.pathContext.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');
const { REGION_KEYS_GENERAL, regionRosterPrompt } = require('./species-roster');
const { ALL_ENABLED_AI_MODELS } = require('../../lib/imageModels');

const pathBuilders = {
  // 2026-05-16: landscape migration attempted + REVERTED — legacy compose.js
  // outperformed the new declarative archetype. Declarative version preserved
  // at paths/landscape.js for reference, legacy stays canonical.
  landscape: require('./paths/legacy/landscape'),
  closeup: require('./paths/closeup'),
  cozy: require('./paths/legacy/cozy'),
  'garden-walk': require('./paths/garden-walk'),
  dreamscape: require('./paths/legacy/dreamscape'),
  conservatory: require('./paths/conservatory'),
  'tropical-paradise': require('./paths/tropical-paradise'),
  'city-flowers': require('./paths/city-flowers'),
  'flower-tunnels': require('./paths/flower-tunnels'),
  'sunset-flowers': require('./paths/sunset-flowers'),
  'flower-friends': require('./paths/flower-friends'),
  'flower-humming-birds': require('./paths/flower-humming-birds'),
  'flower-fantasy': require('./paths/flower-fantasy'),
  'flower-grove': require('./paths/flower-grove'),
  'tropical-grove': require('./paths/tropical-grove'),
  'flower-arrangement': require('./paths/flower-arrangement'),
  'desert-bloom': require('./paths/desert-bloom'),
  reclaim: require('./paths/reclaim'),
};

module.exports = {
  username: 'bloombot',
  displayName: 'BloomBot',

  mediums: ['bloom_hyperreal_cgi'],

  useModelPicker: true,
  // All paths random-pick one of these per render — EXCEPT any path locked in
  // modelByPath below, which falls through to its lock. 2026-06-09: re-added
  // flux-2-pro + flux-2-max (Kevin) — back to 6 models (Banana, GPT2, F1.1Pro,
  // F1.1Pro Ultra, F2Pro, F2Max). Defined explicitly (not via subtraction) so
  // the lineup is auditable; BOT_MODEL_TALLY.md is the source of truth.
  allowedModels: [
    'google/gemini-2-image',
    'openai/gpt-image-2',
    'black-forest-labs/flux-1.1-pro-ultra',
    'black-forest-labs/flux-1.1-pro',
    'black-forest-labs/flux-2-pro',
    'black-forest-labs/flux-2-max',
  ],
  // Per-path model lock. tropical-grove → random pick between flux-1.1-pro and
  // flux-1.1-pro-ultra only (Kevin 2026-05-27). Paths NOT listed here use the
  // uniform allowedModels pick above.
  modelByPath: {
    'tropical-grove': ['black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-1.1-pro-ultra'],
    'flower-arrangement': [
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // cleanMediumByModel: gpt-image-2 AND nano-banana both render the bot-only
  // clean medium. The bot-wide PROMPT_PREFIX ("monumental bloom-form dominating
  // composition") + PROMPT_SUFFIX (species-color faithfulness rules) push these
  // models into abstract botanical plates; the clean medium + ''-prefix (see
  // promptPrefixByMedium) strip them so the seed's bloom subject leads.
  // 2026-06-07 (extends the 2026-06-05 gpt-only fix to nano-banana).
  cleanMediumByModel: {
    'openai/gpt-image-2': { medium: 'bloombot_gpt_clean' },
    'google/gemini-2-image': { medium: 'bloombot_gpt_clean' },
  },
  mediumStyles: {
    bloombot_gpt_clean: blocks.GPT_CLEAN,
    // Override the DB bloom_hyperreal_cgi flux_fragment with the neutral
    // content-only fragment so the bot-wide look register (rolled in
    // rollSharedDNA, injected at the top of the brief in buildBrief) sets
    // the rendering medium per render. The old painterly-CGI finish lives
    // on as look #1 in bloom_look_register.json. See "Medium Looks" in
    // BOT_SCENE_QUALITY_PLAYBOOK.md.
    bloom_hyperreal_cgi: blocks.BLOOM_NEUTRAL,
  },
  promptPrefixByMedium: {
    bloombot_gpt_clean: 'lush flower scene',
  },
  promptSuffixByMedium: {
    bloombot_gpt_clean: 'no text, no words, no watermarks, gallery quality',
  },

  vibes: ['cinematic'],

  paths: [
    'landscape',
    'closeup',
    'cozy',
    'garden-walk',
    'dreamscape',
    'conservatory',
    'tropical-paradise',
    'city-flowers',
    'flower-tunnels',
    'sunset-flowers',
    'flower-friends',
    'flower-humming-birds',
    'flower-fantasy',
    'flower-grove',
    'tropical-grove',
    'flower-arrangement',
    'desert-bloom',
    'reclaim',
  ],

  // Flat rotation (2026-05-26): equal weight per path — every path posts
  // once per cycle in randomized order via the cycleAllPaths shuffle-bag.
  cycleAllPaths: true,

  chaos: {
    enabled: true,
    // flower-arrangement skips chaos — perception-distortion warps the careful
    // ornate arrangement; its own whimsy layer supplies the controlled "pop".
    skipPaths: ['flower-arrangement'],
    allowSubjectChaosPaths: [
      'landscape',
      'cozy',
      'garden-walk',
      'dreamscape',
      'conservatory',
      'tropical-paradise',
      'city-flowers',
      'flower-tunnels',
      'sunset-flowers',
      'flower-friends',
      'flower-humming-birds',
      'flower-fantasy',
      'desert-bloom',
      'reclaim',
    ],
  },

  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '70-100',
    polishedWordsByPath: {
      closeup: '85-115',
    },
    // Per playbook (2026-05-15 + 2026-05-16): two-pass polish OFF for all
    // declarative axis-system paths. Single-pass Sonnet preserves slot-pool
    // richness; Haiku compression drops bespoke vocabulary to hit word count.
    skipPaths: [
      'landscape',
      'closeup',
      'tropical-paradise',
      'cozy',
      'garden-walk',
      'dreamscape',
      'conservatory',
      'city-flowers',
      'flower-tunnels',
      'sunset-flowers',
      'flower-friends',
      'flower-humming-birds',
      'flower-fantasy',
      'tropical-grove',
      'flower-arrangement',
      'desert-bloom',
      'reclaim',
    ],
  },

  sensoryAnchors: {
    enabled: true,
    requiredChannels: ['lightcolor'],
    pathContext: {
      landscape: 'scene',
      closeup: 'scene',
      cozy: 'scene',
      'garden-walk': 'scene',
      dreamscape: 'scene',
      conservatory: 'scene',
      'tropical-paradise': 'scene',
      'city-flowers': 'scene',
      'flower-tunnels': 'scene',
      'sunset-flowers': 'scene',
      'flower-friends': 'scene',
      'flower-humming-birds': 'scene',
      'flower-fantasy': 'scene',
      'flower-grove': 'scene',
      'tropical-grove': 'scene',
      'flower-arrangement': 'scene',
      'desert-bloom': 'scene',
      reclaim: 'scene',
    },
    poolsByContextAndChannel: pools.SENSORY_POOLS,
  },

  // Bot-level pool defaults for declarative axis paths. Lighting + palette
  // also live on sharedDNA (rolled once per render in rollSharedDNA); these
  // entries exist for the brief-composer's bot-slot resolution path.
  defaultPools: {
    lighting: 'LIGHTING',
    palette: 'PALETTES',
  },

  poolByName(name) {
    if (!(name in pools)) {
      throw new Error(`BloomBot.poolByName: unknown pool "${name}"`);
    }
    return pools[name];
  },

  rollSharedDNA({ path, picker }) {
    // Flower Engine (BLOOMBOT_FLOWER_ENGINE_PLAN.md): roll a color THEME + pluck
    // a curated flower cast from the tagged pool. Emits palette + roster blocks
    // that drop into the existing brief slots. Phase 3 will move biome/themeBias
    // onto per-path flowerContext; for now a small biome map.
    const flowerEngine = require('./flowerEngine');
    const BIOME_BY_PATH = {
      'tropical-paradise': 'tropical',
      'tropical-grove': 'tropical',
      'desert-bloom': 'desert',
    };
    let biome = BIOME_BY_PATH[path] || 'any';
    // flower-arrangement TROPICAL MODE (~50% gate, additive): about half the
    // arrangements become a lush tropical arrangement (tropical blooms +
    // monstera/lanai/jungle backdrop). The template reads sharedDNA.tropical.
    let arrangementTropical = false;
    let themeBias;
    if (path === 'flower-arrangement' && Math.random() < 0.5) {
      biome = 'tropical';
      arrangementTropical = true;
      // Favor WARM + spectrum themes in tropical mode. Two reasons: (1) cool
      // themes (blue/purple) have <5 tropical-pool matches and silently fall
      // back to the temperate pool (de-tropicalizing the render); warm themes
      // are rich in tropical species so the roster stays tropical. (2) warm =
      // loud iconic Hawaiian (hibiscus/bird-of-paradise/heliconia hot tones).
      themeBias = {
        blue: 0.15,
        purple: 0.2,
        bluePurple: 0.2,
        purpleWhiteBlue: 0.3,
        white: 0.4,
        sunset: 2.5,
        orange: 2.5,
        red: 1.6,
        magentaGold: 2,
        coralCreamPeach: 1.8,
        yellow: 1.5,
        pinkWhite: 1.3,
        goldenMeadow: 1.3,
        rainbow: 1.4,
        mixedLush: 1.2,
      };
    }
    const fc = flowerEngine.roll({ biome, themeBias, picker });
    // region kept ONLY for legacy compose.js paths (e.g. cozy) that still build
    // their own roster; axis paths now use fc.palette + fc.roster.
    const region =
      path === 'tropical-paradise'
        ? 'tropical'
        : picker.pickWithRecency(REGION_KEYS_GENERAL, 'region');
    return {
      palette: fc.palette,
      lighting: picker.pickWithRecency(pools.LIGHTING, 'lighting'),
      region,
      roster: fc.roster,
      flowerTheme: fc.theme,
      flowerRegister: fc.register,
      tropical: arrangementTropical,
      // Bot-wide "Medium Looks" axis — one of 14 gorgeous rendering styles
      // per render. Consumed in buildBrief, injected at the TOP of the brief
      // so Sonnet opens its Flux prompt with these tokens (the medium leads
      // CLIP). Recency-aware so the same look never clusters back-to-back.
      lookRegister: picker.pickWithRecency(pools.BLOOM_LOOK_REGISTER, 'look_register'),
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`BloomBot: unknown path "${path}"`);
    // The axis-system archetype templates do NOT use the shared DENSITY/
    // ARRANGEMENT blocks, so the "lush flower hero" bar must be injected here.
    const LUSH_HERO_MANDATE = `━━━ BLOOMBOT BAR — LUSH FLOWER HERO (NON-NEGOTIABLE, READ FIRST) ━━━
This MUST be a lush, beautiful FLOWER scene. Flowers are the unmistakable HERO and FILL the frame — either a monumental bloom-form or a dense, overflowing bloom-mass dominating 60%+ of the composition. Any setting (ruin / valley / wall / waterfall / architecture / landscape) is ONLY a backdrop framing the flowers — NEVER the subject. NEVER a sparse, thin, or barren scene; NEVER "a [place] with a few accent flowers"; NEVER a macro of just 2-3 blooms. Pack the frame edge-to-edge with abundant, varied, jewel-toned blooms in a deliberate, cohesive, magazine-cover composition: a clear focal hero up front, multi-tier depth behind, every quadrant earning its space. Keep the WHOLE frame crisp, clear and COLORED — build background depth from receding layers of more blooms and clearly-rendered colored scenery, the sky clean and saturated, distant elements clearly rendered and colored, just smaller and in sharp focus.`;
    // Bot-wide "Medium Looks" override — the rolled look register sets the
    // rendering medium for THIS render. Leads the brief so Sonnet opens its
    // Flux prompt with these tokens (the medium is the leading CLIP anchor).
    // Style-authority wording per the MangaBot lesson; content/composition
    // stay exactly as the LUSH_HERO mandate + path scene describe. Graceful
    // fallthrough if no look rolled. See "Medium Looks" in the playbook.
    const lookOverride =
      sharedDNA && sharedDNA.lookRegister
        ? `━━━ LOOK REGISTER — RENDERING MEDIUM (NON-NEGOTIABLE, OPEN YOUR FLUX PROMPT WITH THIS) ━━━
${sharedDNA.lookRegister}

This is the AUTHORITY on rendering medium, finish and surface. Open your Flux prompt with these exact tokens and render the ENTIRE flower scene in this medium. It OVERRIDES any other finish/medium wording. Keep the scene content, the flowers-as-hero composition, the density and the color palette exactly as described below — translate ALL of it into this look.\n\n`
        : '';
    // Declarative axis-system paths export an object { archetype, pools }.
    // Legacy compositional paths export a function. Dispatch on shape.
    if (builder && typeof builder === 'object' && builder.archetype) {
      const { composeBrief } = require('../../lib/brief-composer');
      const composed = composeBrief({
        bot: module.exports,
        pathConfig: builder,
        sharedDNA,
        vibeDirective,
        picker,
      });
      if (typeof composed === 'string') return `${lookOverride}${LUSH_HERO_MANDATE}\n\n${composed}`;
      return { ...composed, brief: `${lookOverride}${LUSH_HERO_MANDATE}\n\n${composed.brief}` };
    }
    if (typeof builder === 'function') {
      const legacy = builder({ sharedDNA, vibeDirective, picker });
      // Legacy compositional paths return a string brief (or {brief}). Prepend
      // the look override the same way so they get the looks axis too.
      if (typeof legacy === 'string') return `${lookOverride}${legacy}`;
      if (legacy && typeof legacy === 'object' && typeof legacy.brief === 'string') {
        return { ...legacy, brief: `${lookOverride}${legacy.brief}` };
      }
      return legacy;
    }
    throw new Error(`BloomBot: path "${path}" has invalid export shape`);
  },

  caption({ path }) {
    return `[${path}] BloomBot`;
  },
};
