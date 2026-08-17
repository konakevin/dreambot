/**
 * DinoBot — the bot-engine contract.
 *
 * BBC Planet Earth meets museum-grade paleoart. Cinematic nature
 * documentary stills of scientifically plausible dinosaurs.
 * Ultra-realistic, species-accurate, dramatic cinematography.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');
const { ALL_ENABLED_AI_MODELS } = require('../../lib/imageModels');

const pathBuilders = {
  'dino-portrait': require('./paths/dino-portrait'),
  'dino-action': require('./paths/dino-action'),
  'paleo-landscape': require('./paths/paleo-landscape'),
  'herd-migration': require('./paths/herd-migration'),
  'territory-clash': require('./paths/territory-clash'),
  'nesting-ground': require('./paths/nesting-ground'),
  'swamp-river': require('./paths/swamp-river'),
  'ocean-reptiles': require('./paths/ocean-reptiles'),
  'cinematic-silhouette': require('./paths/cinematic-silhouette'),
  'extinction-event': require('./paths/extinction-event'),
  'dino-cozy': require('./paths/dino-cozy'),
  'dino-pack': require('./paths/dino-pack'),
  'aerial-perspectives': require('./paths/aerial-perspectives'),
  'dino-nights': require('./paths/dino-nights'), // Stage D1 SHADOW
  'storm-season': require('./paths/storm-season'), // Stage D2 SHADOW
  'polar-dinos': require('./paths/polar-dinos'), // Stage D3 SHADOW
};

// Dark-launched (shadow) paths — renderable via `iter-bot --mode <path> --post`
// (admin-only shadow posts), NOT in live rotation until promoted into `paths`.
const DINO_SHADOW_PATHS = ['dino-nights', 'storm-season', 'polar-dinos'];

module.exports = {
  username: 'dinobot',
  displayName: 'DinoBot',

  // Single locked medium — Unreal Engine 5 cinematic raytracing for every render.
  // Was rotating photography/render/canvas; that produced inconsistent quality
  // (watercolor / pencil / etc. flatness on some renders). Lock to `render`
  // and pump the override hard so every output reads as UE5-killed-it polish.
  mediums: ['render'],

  // Per-medium override — Avatar Pandora × Skull Island × Land of the Lost
  // overgrown-jungle cinematics (NOT documentary-savanna). The dinosaur is a
  // photoreal real animal in an UNHINGED-LUSH primordial jungle.
  //
  // Documentary references like "Prehistoric Planet" or "wildlife photography"
  // pull Flux toward open-savanna training data with sparse cover. We want
  // the OPPOSITE — buried in jungle, leaves the size of cars, vines hanging
  // from impossible heights. Lost-world cinematics, not nature-doc.
  // Per-medium override — SETTING-AGNOSTIC visual signature only. Setting
  // (jungle vs savanna vs canyon vs volcanic vs ocean) comes from the
  // path's own pools and per-path blocks, NOT from the global wrapper.
  // Was pumping "dense Mesozoic jungle / mega-flora / overgrown" here,
  // which collapsed every path's render into jungle regardless of intent.
  // 2026-06-02 cruft-audit micro-strip — mediumStyles + promptSuffixByMedium
  // both held heavy negation chains (3 + 9 NO/NOT bans in mediumStyles,
  // 4 + 2 NO/NOT bans in suffix) that leaked humans/people/cartoon/painted/
  // watercolor/pencil/toy/3D-character/video-game/plastic-CGI INTO renders
  // per [[feedback_negative_prompt_leak]]. The "this world is 66M years
  // before humans existed" positive anchor + "REAL LIVING ANIMAL"
  // identity carry the no-humans rule downstream through every path's
  // template + the bot-wide PROMPT_PREFIX which already states it.
  // Medium owns RENDER-QUALITY only; the primordial-era anchor lives ONCE in
  // PROMPT_PREFIX (de-duped 2026-06-12 cruft-audit — both used to state
  // "66 million years before humans" + the ray-traced/IMAX stack).
  mediumStyles: {
    render:
      'cinematic 35mm film still, photoreal living animal with leathery scarred biological hide, hyperreal organic textures, ray-traced reflections, PBR materials, IMAX cinematic precision',
    dinobot_gpt_clean: blocks.GPT_CLEAN,
  },
  promptSuffixByMedium: {
    render:
      'photoreal cinematic film still, the dinosaur is a REAL LIVING ANIMAL, hyperreal organic detail',
    dinobot_gpt_clean: '',
  },

  // nano-banana clean-render override (2026-06-07). Banana reads the
  // IMAX/PBR/ray-traced anchors as "go abstract"; the clean medium
  // (+ empty prefix/suffix) lets the seed's dinosaur scene lead.
  // Retired with the 2026-06-21 fleet ban; RESTORED 2026-07-01 (Kevin) —
  // DinoBot re-enables Nano Banana via modelBanExemptions below.
  cleanMediumByModel: {
    'google/gemini-2-image': { medium: 'dinobot_gpt_clean' },
  },
  promptPrefixByMedium: {
    dinobot_gpt_clean: '',
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // Per-path prefix override — JUNGLE-CODED paths wrap their Flux prompt
  // with lush-overgrown-jungle language so the rendered scene reads as
  // dense primordial jungle (not the setting-neutral global wrapper that
  // open paths use). Open paths (herd, paleo, volcanic, ocean, action,
  // territory, pack, extinction, silhouette, aerial) inherit the global
  // setting-neutral PROMPT_PREFIX and let their setting pools dictate.
  // 2026-06-02 NEGATION STRIP — see shared-blocks.js for full explanation.
  // Removed "NO HUMANS — " prefix from each jungle wrapper; the "66 million
  // years before humans evolved" phrasing already carries the prehistoric-
  // exclusive meaning without leaking "humans" into renders.
  // 2026-06-02 cruft-audit micro-strip — dropped `8K detail` tech-spec
  // tail from all 3 jungle wrappers. IMAX cinematic precision already
  // carries the precision register.
  // 2026-06-12 cruft-audit — these are PREPENDED to the global PROMPT_PREFIX
  // (botEngine pathPrefix + prefix), so each used to RE-state the era +
  // ray-traced/hyperreal/IMAX stack that PROMPT_PREFIX already carries.
  // Cut to the JUNGLE DELTA only — the region these paths add on top of the
  // global setting-neutral wrapper.
  promptPrefixByPath: {
    'dino-cozy':
      'dense Mesozoic jungle, massive overgrown flora (mega-leaves the size of cars, vines hanging from impossible heights, gnarled mile-high trees)',
    'nesting-ground':
      'dense Mesozoic jungle, massive overgrown flora (mega-leaves the size of cars, vines hanging from impossible heights, gnarled mile-high trees)',
    'swamp-river':
      'dense Mesozoic jungle along tannin-dark waters, massive overgrown flora (mega-leaves the size of cars, vines hanging from impossible heights, gnarled mile-high trees)',
    // dino-portrait wrapper REMOVED 2026-05-17 — the legacy stuffed wrapper
    // forced every render to "dense Mesozoic jungle" overriding the biome
    // pool's variety. Portrait now inherits the global setting-neutral
    // PROMPT_PREFIX and lets the biome slot dictate the environment.
    // 'dino-portrait': (removed),
  },

  useModelPicker: true,
  // Ban flux-2-max + flux-2-flex from DinoBot specifically. Per Kevin
  // 2026-06-01 — those two models push DinoBot's photoreal-dinosaur prompt
  // toward 3D-render/plastic-CGI looks that fight the BBC-Planet-Earth /
  // museum-paleoart aesthetic the bot wants. The remaining canonical Flux
  // models stay (flux-dev / flux-1.1-pro / flux-1.1-pro-ultra / flux-2-pro);
  // filtered from the canonical list so newly-added models auto-inherit
  // (still need explicit add to the ban set if they also fight the look).
  allowedModels: [
    ...ALL_ENABLED_AI_MODELS.filter(
      (m) => m !== 'black-forest-labs/flux-2-max' && m !== 'black-forest-labs/flux-2-flex'
    ),
    // Nano Banana re-enabled for DinoBot (Kevin 2026-07-01) — not in the
    // canonical list (fleet ban stands), so added explicitly here and
    // exempted below.
    'google/gemini-2-image',
  ],
  // Per-bot opt-out of the fleet-wide BOT_BANNED_MODELS set (modelPicker +
  // botEngine render guard both honor this).
  modelBanExemptions: ['google/gemini-2-image'],

  // Single locked vibe — cinematic. Was rotating 11 vibes which produced
  // inconsistent moods (cozy/ethereal/shimmer pulled away from the
  // hyperreal Prehistoric-Planet-cinematic look). Lock to cinematic.
  vibes: ['cinematic'],

  paths: [
    'dino-portrait',
    'dino-action',
    'paleo-landscape',
    'herd-migration',
    'territory-clash',
    'nesting-ground',
    'swamp-river',
    'ocean-reptiles',
    'cinematic-silhouette',
    'extinction-event',
    'dino-cozy',
    'dino-pack',
    'aerial-perspectives',
    // Stage D — promoted to live rotation 2026-08-16 (scaled to production;
    // faithful xerox — not in allowSubjectChaosPaths (chaos off), polish off via
    // DINO_SHADOW_PATHS in skipPaths; config unchanged).
    'dino-nights',
    'storm-season',
    'polar-dinos',
  ],

  // Dark-launched paths — renderable on demand, hidden from public + rotation.
  shadowPaths: [], // Stage D paths promoted to live 2026-08-16 (DINO_SHADOW_PATHS const kept — drives polish-OFF skip)

  // Flat rotation (2026-05-26): equal weight per path — every path posts
  // once per cycle in randomized order via the cycleAllPaths shuffle-bag.
  cycleAllPaths: true,

  chaos: {
    enabled: true,
    skipPaths: [],
    allowSubjectChaosPaths: [
      'paleo-landscape',
      'herd-migration',
      'territory-clash',
      'nesting-ground',
      'swamp-river',
      'ocean-reptiles',
      'cinematic-silhouette',
      'extinction-event',
      'dino-cozy',
      'dino-pack',
      'aerial-perspectives',
    ],
  },
  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '65-90',
    polishedWordsByPath: {},
    preservePhrasesByPath: {},
    skipPaths: [
      'paleo-landscape',
      'swamp-river',
      'ocean-reptiles',
      'nesting-ground',
      'herd-migration',
      'territory-clash',
      'cinematic-silhouette',
      'dino-cozy',
      'dino-pack',
      'aerial-perspectives',
      'dino-portrait',
      'dino-action',
      'extinction-event',
      ...DINO_SHADOW_PATHS,
    ],
  },
  sensoryAnchors: {
    enabled: true,
    requiredChannels: ['lightcolor'],
    pathContext: {
      'dino-portrait': 'dinosaur',
      'dino-action': 'dinosaur',
      'dino-pack': 'dinosaur',
      'paleo-landscape': 'scene',
      'herd-migration': 'dinosaur',
      'territory-clash': 'dinosaur',
      'nesting-ground': 'dinosaur',
      'swamp-river': 'scene',
      'ocean-reptiles': 'dinosaur',
      'cinematic-silhouette': 'dinosaur',
      'extinction-event': 'scene',
      'dino-cozy': 'scene',
      'aerial-perspectives': 'dinosaur',
    },
    poolsByContextAndChannel: pools.SENSORY_POOLS,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
    };
  },

  // Bot-level pool defaults for declarative axis paths (composer reads these
  // when a path config doesn't override the slot).
  defaultPools: {
    lighting: 'LIGHTING',
    atmosphere: 'PREHISTORIC_ATMOSPHERES',
  },

  poolByName(name) {
    if (!(name in pools)) {
      throw new Error(`DinoBot.poolByName: unknown pool "${name}"`);
    }
    return pools[name];
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`DinoBot: unknown path "${path}"`);
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
    throw new Error(`DinoBot: path "${path}" has invalid export shape`);
  },

  bannedPhrases: [
    'human',
    'person',
    'people',
    'man ',
    'woman',
    'child',
    'hunter',
    'explorer',
    'scientist',
    'ranger',
    'tourist',
  ],

  caption({ path }) {
    return `[${path}] DinoBot`;
  },
};
