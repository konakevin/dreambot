/**
 * OutlawBot — the bot-engine contract.
 *
 * The American Old West, made VIVID and EXCITING — a painted picture-book of the
 * frontier. Red Dead Redemption / Tombstone / Sergio Leone / Remington / Wyeth.
 * Cowboys, frontier towns, saloons, desert vistas, homesteads, streams, cabins.
 *
 * LOOKS SYSTEM: every look-enabled path routes to the CODE-ONLY `outlawbot_neutral`
 * medium (no DB row needed — mediumStyles overrides the DB fragment, modelByPath
 * hard-locks the model) and rolls a per-render WESTERN-ART LOOK that leads the
 * prompt and sets the render style (Remington oil / Bierstadt luminist / Leone
 * technicolor / dime-novel pulp / sepia tintype / game-cinematic / …).
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'frontier-town': require('./paths/frontier-town'),
  'gunslinger-male': require('./paths/gunslinger-male'),
  'gunslinger-female': require('./paths/gunslinger-female'),
};

// Look-enabled paths roll a per-render western-art LOOK (buildBrief prepends the
// OUTLAWBOT_LOOK_OVERRIDE; each is routed to outlawbot_neutral via mediumByPath).
const LOOK_ENABLED_PATHS = new Set(['frontier-town', 'gunslinger-male', 'gunslinger-female']);

// Every path is locked to the Flux pair (matches GothBot's character/scene lineup:
// flux-1.1-pro + flux-1.1-pro-ultra). modelByPath hard-locks the model, which is
// what makes the code-only outlawbot_neutral medium safe (pickModel never runs).
const FLUX_PAIR = [
  'black-forest-labs/flux-1.1-pro',
  'black-forest-labs/flux-1.1-pro-ultra',
];

module.exports = {
  username: 'outlawbot',
  displayName: 'OutlawBot',

  useModelPicker: true,
  allowedModels: FLUX_PAIR,

  modelByPath: {
    'frontier-town': FLUX_PAIR,
    'gunslinger-male': FLUX_PAIR,
    'gunslinger-female': FLUX_PAIR,
  },

  // Western vibe set (all real dream_vibes keys) — cinematic/epic/nostalgic
  // weighted, plus majestic/fierce/peaceful/ancient/dark for range. Inject MOOD,
  // not off-genre content.
  vibes: [
    'cinematic',
    'cinematic',
    'cinematic',
    'epic',
    'epic',
    'nostalgic',
    'nostalgic',
    'majestic',
    'fierce',
    'peaceful',
    'ancient',
    'dark',
  ],

  vibesByPath: {
    'frontier-town': ['cinematic', 'epic', 'nostalgic', 'majestic', 'fierce', 'ancient', 'dark'],
    'gunslinger-male': ['cinematic', 'fierce', 'epic', 'dark', 'nostalgic', 'ancient'],
    'gunslinger-female': ['cinematic', 'fierce', 'epic', 'dark', 'nostalgic', 'ancient'],
  },

  // CODE-ONLY neutral medium (no DB migration — see playbook "A BOT-ONLY medium
  // needs NO DB migration at all"). Look-enabled paths route here; the rolled LOOK
  // supplies the render style.
  mediums: ['outlawbot_neutral'],

  mediumByPath: {
    'frontier-town': 'outlawbot_neutral',
    'gunslinger-male': 'outlawbot_neutral',
    'gunslinger-female': 'outlawbot_neutral',
  },

  mediumStyles: {
    outlawbot_neutral: blocks.OUTLAWBOT_NEUTRAL,
  },

  // Short identity-only anchor so the rolled LOOK leads CLIP, not a style prefix.
  promptPrefixByMedium: {
    outlawbot_neutral: blocks.OUTLAWBOT_NEUTRAL_PREFIX,
  },
  promptSuffixByMedium: {
    outlawbot_neutral: blocks.OUTLAWBOT_NEUTRAL_SUFFIX,
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  bannedPhrases: [],

  // Chaos layer — protect the scene composition for the MVP (re-enable on scale).
  chaos: {
    enabled: true,
    skipPaths: ['frontier-town', 'gunslinger-male', 'gunslinger-female'],
    allowSubjectChaosPaths: [],
  },

  // Sensory anchors DISABLED for the MVP (the gothic sensory pools don't apply;
  // western sensory pools can be seeded later once the bot is validated).
  sensoryAnchors: {
    enabled: false,
  },

  // Two-pass polish off for the scene MVP (the rich bespoke pools carry the brief).
  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '70-95',
    skipPaths: ['frontier-town', 'gunslinger-male', 'gunslinger-female'],
  },

  paths: ['frontier-town', 'gunslinger-male', 'gunslinger-female'],

  // Flat rotation — each active path posts once per cycle, reshuffled.
  cycleAllPaths: true,

  rollSharedDNA({ vibeKey, picker }) {
    return {
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
      // Looks system: roll a western-art render-style look per render. Consumed by
      // look-enabled paths via the OUTLAWBOT_LOOK_OVERRIDE prepend in buildBrief.
      lookRegister:
        picker && pools.OUTLAWBOT_LOOK_REGISTER && pools.OUTLAWBOT_LOOK_REGISTER.length
          ? picker.pickWithRecency(pools.OUTLAWBOT_LOOK_REGISTER, 'look_register')
          : null,
    };
  },

  poolByName(name) {
    if (!(name in pools)) {
      throw new Error(`OutlawBot.poolByName: unknown pool "${name}"`);
    }
    return pools[name];
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, medium, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`OutlawBot: unknown path "${path}"`);
    let brief;
    if (typeof builder === 'function') {
      brief = builder({ sharedDNA, vibeDirective, vibeKey, medium, picker });
    } else if (builder && typeof builder === 'object' && builder.archetype) {
      const { composeBrief } = require('../../lib/brief-composer');
      brief = composeBrief({
        bot: module.exports,
        pathConfig: builder,
        sharedDNA,
        vibeDirective,
        picker,
      });
    } else {
      throw new Error(`OutlawBot: path "${path}" has invalid export shape`);
    }
    // Looks system: prepend the render-style AUTHORITY override for look-enabled
    // paths so the rolled western-art look leads + beats any baked style language.
    if (LOOK_ENABLED_PATHS.has(path)) {
      let dna = sharedDNA;
      // CHARACTER paths: drop the most glamorizing look registers (dime-novel pulp,
      // technicolor, Hollywood-matte, Leone-saturated) — they amplify Flux's pin-up
      // face prior. Re-roll from the grounded/photographic + painterly-realist subset.
      if ((path === 'gunslinger-male' || path === 'gunslinger-female') && picker && pools.OUTLAWBOT_LOOK_REGISTER) {
        const safe = pools.OUTLAWBOT_LOOK_REGISTER.filter(
          (l) => !/pulp|dime-novel|technicolor|spaghetti|hollywood/i.test(l)
        );
        if (safe.length) {
          dna = { ...sharedDNA, lookRegister: picker.pickWithRecency(safe, 'look_register_char') };
        }
      }
      brief = blocks.OUTLAWBOT_LOOK_OVERRIDE(dna) + brief;
    }
    return brief;
  },

  caption({ path }) {
    return `[${path}] OutlawBot`;
  },
};
