/**
 * YumBot — kawaii food specialist (bex.ai-modeled).
 *
 * Launched 2026-05-20. Paths each tightly modeled on a distinct
 * bex.ai reference look:
 *   floral-garden-cup    — SINGLE-vessel-hero closeup with overflowing flora
 *   floral-garden-scene  — MULTI-planter garden scene (indoor or outdoor) — sister of floral-garden-cup
 *   rainbow-dreamscape   — kawaii food-creatures in a wider pastel meadow
 *   checkered-tabletop   — kawaii food on pastel-gingham with mini-friend pile
 *   candy-fantasy        — composition-locked candy-world scenes
 */

const blocks = require('./shared-blocks');
const { ALL_ENABLED_AI_MODELS } = require('../../lib/imageModels');

const pathBuilders = {
  'floral-garden-cup': require('./paths/floral-garden-cup'),
  'floral-garden-scene': require('./paths/floral-garden-scene'),
  'rainbow-dreamscape': require('./paths/rainbow-dreamscape'),
  'checkered-tabletop': require('./paths/checkered-tabletop'),
  'candy-fantasy': require('./paths/candy-fantasy'),
  'japanese-festival': require('./paths/japanese-festival'),
  'mini-chef': require('./paths/mini-chef'),
  'cottagecore-nature': require('./paths/cottagecore-nature'),
  'coquette-food': require('./paths/coquette-food'),
  'kawaii-koi-pond': require('./paths/kawaii-koi-pond'),
  'kawaii-koi-pond-ultra': require('./paths/kawaii-koi-pond-ultra'),
  // 2026-06-06 trial — bucket-aggregated meal-occasion path. 6 sub-themes
  // share axis pools; scenes are tagged structured objects.
  'meal-types': require('./paths/meal-types'),
  // 2026-06-07 trial — bucket-aggregated whimsical-concept path. 6 sub-themes
  // (food-with-pets / food-fashion-show / food-spa / food-orchestra /
  // food-school / food-and-toys). Same architecture as meal-types.
  whimsical: require('./paths/whimsical'),
  // 2026-06-07 trial — bucket-aggregated global-cuisine path. 7 sub-themes
  // (french-patisserie / italian-trattoria / mexican-fiesta / korean-dessert-
  // cafe / indian-sweet-shop / middle-eastern-souk / nordic-bakery).
  cuisine: require('./paths/cuisine'),
  // 2026-06-07 trial — bucket-aggregated scale-twist path. 6 sub-themes
  // (giant-real-world / microscopic / food-island / chocolate-river /
  // underwater / food-in-space).
  scale: require('./paths/scale'),
  // 2026-06-07 trial — bucket-aggregated unexpected-place path. 6 sub-themes
  // (greenhouse / library / train / amusement-park / aquarium / rooftop-garden).
  places: require('./paths/places'),
  // 2026-06-07 trial — bucket-aggregated narrative-action path. 6 sub-themes
  // (baking-in-progress / garden-harvest / pastry-shop-window / food-parade /
  // food-tea-party / bakery-delivery).
  narrative: require('./paths/narrative'),
  // 2026-06-07 trial — bucket-aggregated fruits-and-veggies path. 6 sub-themes
  // (vegetable-garden / fruit-tree / vine-and-bush / harvest-basket /
  // forest-forage / farmers-market). Each scene = kawaii fruit/veggie HOST +
  // 1-2 kawaii dessert FRIENDS.
  'fruits-veggies': require('./paths/fruits-veggies'),
  // 2026-06-07 trial — bucket-aggregated fast-food path. 6 sub-themes
  // (burger-joint / pizza-shop / taco-stand / fried-classics / hot-dog-cart /
  // diner-shake-and-fries).
  'fast-food': require('./paths/fast-food'),
  // 2026-06-07 trial — bucket-aggregated carnival-food path. 6 sub-themes
  // (cotton-candy-cart / funnel-cake-stand / caramel-apple-booth /
  // snow-cone-stand / pretzel-cart / carnival-corn-dog).
  'carnival-food': require('./paths/carnival-food'),
};

module.exports = {
  username: 'YumBot',
  displayName: 'YumBot',

  mediums: ['yumbot_food', 'yumbot_food_neutral'],
  mediumStyles: {
    yumbot_food: blocks.YUMBOT_FOOD_MEDIUM,
    yumbot_gpt_clean: blocks.GPT_CLEAN,
    // 2026-06-06 — neutral kawaii anchor used by paths that roll a per-render
    // visual treatment via sharedDNA.lookRegister (meal-types is the first).
    // Locks the kawaii-food character but NOT the medium / palette / finish.
    yumbot_food_neutral: blocks.YUMBOT_FOOD_NEUTRAL,
  },

  // Per-path medium override — meal-types uses the neutral anchor so the
  // rolled look_register from sharedDNA leads the CLIP anchor instead of
  // the Pop-Mart vinyl lock.
  // 2026-06-07 — ALL paths use yumbot_food_neutral medium. The bot-wide
  // sharedDNA.lookRegister rolls a different cute visual treatment per
  // render, breaking the Pop-Mart vinyl CLIP lock on every path. Original
  // 11 templates were edited in the same commit to inject sharedDNA.lookRegister
  // at the top of their Sonnet briefs.
  mediumByPath: {
    'floral-garden-cup': 'yumbot_food_neutral',
    'floral-garden-scene': 'yumbot_food_neutral',
    'rainbow-dreamscape': 'yumbot_food_neutral',
    'checkered-tabletop': 'yumbot_food_neutral',
    'candy-fantasy': 'yumbot_food_neutral',
    'japanese-festival': 'yumbot_food_neutral',
    'mini-chef': 'yumbot_food_neutral',
    'cottagecore-nature': 'yumbot_food_neutral',
    'coquette-food': 'yumbot_food_neutral',
    'kawaii-koi-pond': 'yumbot_food_neutral',
    'kawaii-koi-pond-ultra': 'yumbot_food_neutral',
    'meal-types': 'yumbot_food_neutral',
    whimsical: 'yumbot_food_neutral',
    cuisine: 'yumbot_food_neutral',
    scale: 'yumbot_food_neutral',
    places: 'yumbot_food_neutral',
    narrative: 'yumbot_food_neutral',
    'fruits-veggies': 'yumbot_food_neutral',
    'fast-food': 'yumbot_food_neutral',
    'carnival-food': 'yumbot_food_neutral',
  },

  // Per-medium prompt prefix override (engine line 1314) — REPLACES the
  // bot.promptPrefix when set. yumbot_food_neutral gets a minimal kawaii
  // anchor so the rolled look_register from Sonnet's prompt leads CLIP
  // attention instead of the bot-wide Pop-Mart-vinyl prefix smothering it.
  // Empty string would be falsy and fall through to bot.promptPrefix; using
  // a tight 4-word anchor that yields to whatever look the register dictates.
  // gpt-image-2 + nano-banana clean-render override (2026-06-07). The CGI +
  // painterly-fusion medium/prefix make these models pick one extreme; the
  // clean medium (+ empty promptPrefixByMedium) lets the seed's kawaii food lead.
  cleanMediumByModel: {
    'google/gemini-2-image': { medium: 'yumbot_gpt_clean' },
  },
  // Per-medium prompt-prefix override (engine line 1314) — REPLACES the
  // bot.promptPrefix when set for the current medium.
  //   yumbot_food_neutral: tight 4-word anchor so the rolled sharedDNA
  //     lookRegister from Sonnet's output leads CLIP attention.
  //   yumbot_gpt_clean:   empty → falls through to bot.promptPrefix (existing
  //     behavior; the clean medium's own fragment carries the kawaii anchor).
  promptPrefixByMedium: {
    yumbot_food_neutral: 'kawaii illustration',
    yumbot_gpt_clean: '',
  },
  // Per-medium prompt-suffix override (engine line 1316-1319) — replaces
  // bot.promptSuffix when set. yumbot_food_neutral drops the Pop-Mart vinyl
  // tail ("designer-vinyl glossy-pearlescent finish") so the rolled look
  // register can carry the visual treatment without late-prompt smothering.
  promptSuffixByMedium: {
    yumbot_food_neutral: 'soft kawaii charm, every face is a food, no humans',
  },

  useModelPicker: true,
  // Banned 2026-06-07: flux-2-max (Kevin heart-ban).
  allowedModels: [
    'google/gemini-2-image',
    'black-forest-labs/flux-dev',
    'black-forest-labs/flux-1.1-pro',
    'black-forest-labs/flux-1.1-pro-ultra',
    'black-forest-labs/flux-2-flex',
  ],

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

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

  paths: [
    'floral-garden-cup',
    'floral-garden-scene',
    'rainbow-dreamscape',
    'checkered-tabletop',
    'candy-fantasy',
    'japanese-festival',
    'mini-chef',
    'cottagecore-nature',
    'coquette-food',
    'kawaii-koi-pond',
    'kawaii-koi-pond-ultra',
    'meal-types',
    'whimsical',
    'cuisine',
    'scale',
    'places',
    'narrative',
    'fruits-veggies',
    'fast-food',
    'carnival-food',
  ],

  // floral-garden-cup + floral-garden-scene are SISTER paths at 0.5 each —
  // their combined weight equals 1 (the same total weight floral-garden-cup
  // had before the split), so the existing-3-path frequencies are preserved.
  // Flat rotation (2026-05-26): equal weight per path — every path posts
  // once per cycle in randomized order via the cycleAllPaths shuffle-bag.
  cycleAllPaths: true,

  // Per-path model override — bot.modelByPath HARDCODES a specific model for
  // a specific path, overriding useModelPicker + allowedModels.
  //
  // kawaii-koi-pond-ultra: locked 100% to ultra (its purpose as the
  // ultra-only sister path of kawaii-koi-pond).
  //
  // All other paths fall through to allowedModels = flux-dev (100%).
  // night_mode conditional layer still FORCES ultra when it fires
  // (handled outside modelByPath), so night renders stay on ultra.
  modelByPath: {
    'kawaii-koi-pond-ultra': 'black-forest-labs/flux-1.1-pro-ultra',
  },

  chaos: { enabled: false, skipPaths: [], allowSubjectChaosPaths: [] },
  twoPassPolish: {
    enabled: false,
    conceptWords: 0,
    polishedWords: '0',
    preservePhrasesByPath: {},
    skipPaths: [],
  },
  sensoryAnchors: { enabled: false },

  defaultPools: {},

  // Per-path prefix override — prepended BEFORE the medium style prefix
  // as the FIRST tokens Flux sees. Used to lock path-specific world DNA
  // that the shared medium prefix can't establish on its own.
  promptPrefixByPath: {
    // 2026-06-02 cruft-audit strip — was 603ch with:
    //   • 8-item backdrop enum (frosted-cake mountains, oversized lollipop-
    //     trees, marshmallow drifts, sprinkle-grass, cotton-candy clouds,
    //     sugar-glitter air, gumdrop bushes, candy-cane accents) → Flux
    //     locks frosted-cake mountains, drops the other 7
    //   • 5-item negation chain `NEVER real wood/grass/stone/metal/fabric`
    //     → leaks those materials via [[feedback_negative_prompt_leak]]
    //   • `NOT a default candy meadow` negation
    // The "every surface confectionery" positive instruction does the
    // backdrop work without enumerating. Per-path pools carry specific
    // backdrop elements (frosted-cake mountains etc.) one per entry.
    'candy-fantasy':
      'Kawaii candy-fantasy scene — composition follows the scene description below. The scene sits inside a RICH KAWAII CANDY-FANTASY WORLD where every surface is confectionery. The candy-world backdrop is RICH AND DETAILED but never overrides the foreground composition the scene description establishes.',
    // 2026-06-06 — meal-types path: bot-wide Pop-Mart vinyl prefix overridden
    // (left empty) so the rolled look_register from sharedDNA leads the brief.
    // Sonnet front-loads the rolled cute medium (watercolor / claymation /
    // pixel / felt / etc.) — that's the CLIP anchor variety knob.
    'meal-types': '',
  },

  poolByName(name) {
    const pools = require('./pools');
    if (!(name in pools)) {
      throw new Error(`YumBot.poolByName: unknown pool "${name}"`);
    }
    return pools[name];
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, medium, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`YumBot: unknown path "${path}"`);
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
    if (typeof builder === 'function') {
      return builder({ sharedDNA, vibeDirective, vibeKey, picker });
    }
    throw new Error(`YumBot: path "${path}" has invalid export shape`);
  },

  rollSharedDNA({ vibeKey, picker }) {
    const pools = require('./pools');
    return {
      scenePalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cozy,
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cozy,
      // 2026-06-06 — cute / kawaii visual register, mixed per render. Paths
      // opt in by consuming sharedDNA.lookRegister in their template (lead
      // with it so Flux's CLIP anchors there). Existing paths ignore it
      // until plugged in path-by-path.
      lookRegister: picker
        ? picker.pickWithRecency(pools.YUMBOT_LOOK_REGISTER, 'look_register')
        : pools.YUMBOT_LOOK_REGISTER[0],
    };
  },
};
