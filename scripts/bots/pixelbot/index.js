/**
 * PixelBot — the bot-engine contract.
 *
 * GAMING SCENES SPECIALIST. Every render is pixel art that looks like
 * "a screenshot from a game I desperately wish existed." 7 genre paths:
 * Cozy RPG Towns, Dungeon Depths, Side-Scroller Worlds, Boss Arenas,
 * JRPG Dreamscapes, Pixel Horror, Cozy Farming/Life Sim.
 * NO IP references. Bot's identity IS the medium + the genre.
 *
 * Pixel-cyberpunk path was killed 2026-05-06 — Flux's training has
 * billions of MODERN cyberpunk illustrations and almost no 16-bit
 * cyberpunk pixel-art examples, so the path consistently rendered
 * smooth/illustrated regardless of the 16-bit retro lock.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');
const { ALL_ENABLED_AI_MODELS } = require('../../lib/imageModels');
const scene = require('./scenePaths');

// SCENE PATHS (PIXELBOT_SCENES_PLAN.md): pixel PAINTINGS of places on the
// pixelbot_painting register with the pixel LOOKS register rolling. All wiring
// for these (medium, model set, vibes, chaos + polish off, shadow lane) derives
// from this map — adding a scene path is one line here. They live in
// shadowPaths until Kevin approves each one; go-live = move the key to paths[].
const SCENE_PATHS = {
  'pixel-vista': require('./paths/pixel-vista'), // replaces epic-vista at ship (plan §3.8)
  'pixel-cabin-glow': require('./paths/pixel-cabin-glow'), // PASS R2 4.74 (2026-09-19)
  'pixel-harbor': require('./paths/pixel-harbor'), // batch 1 (agent), R3 under the flux-2 set pending
  'pixel-cozy-room': require('./paths/pixel-cozy-room'), // batch 1 (agent), R3 under the flux-2 set pending
  'pixel-fantasy-vista': require('./paths/pixel-fantasy-vista'), // batch 2 (agent), PASS R1 4.72
  'pixel-cool-rides': require('./paths/pixel-cool-rides'), // batch 2 (agent), PASS R3 4.65
  'pixel-rain-street': require('./paths/pixel-rain-street'), // batch 2 (agent), 5 rounds, signage residual — Kevin's decision
  'pixel-campfire-night': require('./paths/pixel-campfire-night'), // batch 3 (agent), PASS R2 4.62
  'pixel-shoreline': require('./paths/pixel-shoreline'), // batch 3 (agent) + orchestrator R4, PASS 4.62
  'pixel-skyward': require('./paths/pixel-skyward'), // batch 3 (agent), PASS R2 4.64
  'pixel-ruins': require('./paths/pixel-ruins'), // batch 4 (agent) + orchestrator R3, CLOSE 4.48 — Kevin's decision
  'volcano-forge': require('./paths/volcano-forge'), // batch 5 (agent), 3 rounds — R1 PASS 4.50; R2 four clean renders avg 4.75
  'floating-market-canal': require('./paths/floating-market-canal'), // batch 5 (agent), 4 rounds — R3 PASS 4.52 (min 4.2); corridor 0/5, text 0/5
  'castle-town-gate': require('./paths/castle-town-gate'), // wave 5 (agent), 3 rounds — R0 3.02 → R1 4.46 → R2 PASS 4.64 (min 4.3); text 0/10 on the pin
  // NOTE: no modelByPath entry needed — this path self-declares its flux-2 pin on the
  // builder, and scene.modelByPath now honours builder.models (fixed 61f04d93).
};

const pathBuilders = {
  ...SCENE_PATHS,
  'cozy-rpg-town': require('./paths/cozy-rpg-town'),
  'side-scroller-world': require('./paths/side-scroller-world'),
  'boss-arena': require('./paths/boss-arena'),
  'pixel-horror': require('./paths/pixel-horror'),
  'cozy-farming-life-sim': require('./paths/cozy-farming-life-sim'),
  'pixel-sci-fi-action': require('./paths/pixel-sci-fi-action'),
  'classic-jrpg': require('./paths/classic-jrpg'),
  'epic-vista': require('./paths/epic-vista'),
  'retro-racing': require('./paths/retro-racing'), // Stage K2 SHADOW
  // Halloween seasonal candidates — promoted from AlphaBot (2026-09), Kevin-
  // approved via QA matrix. Fire ONLY through seasonalPaths.halloween below,
  // never in the year-round `paths` rotation.
  'pixel-haunted-house': require('./paths/pixel-haunted-house'),
  'pixel-trickortreat-street': require('./paths/pixel-trickortreat-street'),
  'pixel-witchs-cottage': require('./paths/pixel-witchs-cottage'),
  'pixel-graveyard-night': require('./paths/pixel-graveyard-night'),
  'pixel-haunted-overworld': require('./paths/pixel-haunted-overworld'),
  'pixel-haunted-dungeon': require('./paths/pixel-haunted-dungeon'),
};

// Per-path vibe lock — each genre prefers a tight subset of vibes for
// scene-cohesion. Engine respects this when rolling vibe per render.
const GAME_VIBES_BY_PATH = {
  'cozy-rpg-town': ['nostalgic', 'whimsical', 'enchanted'],
  'side-scroller-world': ['cinematic', 'epic', 'voltage'],
  'boss-arena': ['epic', 'fierce', 'cinematic'],
  'pixel-horror': ['fierce', 'arcane', 'dark', 'epic'],
  'cozy-farming-life-sim': ['nostalgic', 'whimsical', 'coquette'],
  'pixel-sci-fi-action': ['epic', 'fierce', 'voltage', 'cinematic'],
  'classic-jrpg': ['nostalgic', 'enchanted', 'whimsical', 'epic'],
  'epic-vista': ['epic', 'ethereal', 'cinematic', 'nostalgic'],
  'retro-racing': ['nostalgic', 'cinematic', 'epic', 'voltage'], // Stage K2 SHADOW
};
const vibesByPath = { ...GAME_VIBES_BY_PATH, ...scene.vibesByPath(SCENE_PATHS) };

const allVibes = Array.from(new Set(Object.values(vibesByPath).flat()));

module.exports = {
  username: 'pixelbot',
  displayName: 'PixelBot',

  mediums: ['pixels'],

  // 4-model rotation. Engine picks at random per render — diversity
  // across models is part of the variance the bot trades on.
  useModelPicker: true,
  allowedModels: ALL_ENABLED_AI_MODELS,

  // Per-path model pins land here when a specific path needs a specific model.
  modelByPath: {
    ...scene.modelByPath(SCENE_PATHS),
    // volcano-forge only: flux-1.1-pro-ultra rendered an EXTERIOR golden-hour vista with a
    // gibberish sign on an interior prompt (the same failure class as pixel-campfire-night), and
    // flux-dev dropped the named machinery and rendered a "small, far off" figure at hero scale.
    // The firelit INTERIOR is this path's whole identity, so it runs on the flux-2 family.
    'volcano-forge': {
      'black-forest-labs/flux-2-pro': 1,
      'black-forest-labs/flux-2-max': 1,
      'black-forest-labs/flux-2-flex': 1,
    },
    // ice-cavern: the SAME exclusion, applied from round 0 on volcano-forge's evidence rather than
    // rediscovered. A blue-lit ice INTERIOR is a lighting condition, and flux-1.1-pro-ultra reverts
    // any condition-identity path to a golden-hour EXTERIOR with a fake sign; flux-dev drops named
    // features and renders a "small, far off" figure at hero scale.
    // floating-market-canal: the flux-2 family only, pinned from R0 on volcano-forge +
    // ice-cavern + campfire-night's measured evidence rather than rediscovered.
    // flux-1.1-pro-ultra SIGNS its work, and a fake signature is a hard TEXT fail on what is
    // the highest text-risk path in the roster (a market means awnings and shopfronts);
    // flux-dev drops named features, and every named boat-stall rendering IS this path's money
    // shot. All 20 QA renders ran on pro/max/flex and held the pixel medium 20/20.
    'floating-market-canal': {
      'black-forest-labs/flux-2-pro': 1,
      'black-forest-labs/flux-2-max': 1,
      'black-forest-labs/flux-2-flex': 1,
    },
    // castle-town-gate: flux-2 family only, MEASURED ON THIS PATH rather than
    // inherited. Round 0 ran unpinned across all five SCENE_MODELS and all three
    // renders handed to flux-dev or flux-1.1-pro-ultra failed: two as FULLY SMOOTH
    // paintings with no pixel structure (ultra also rendered a LIVE bear where a
    // carved stone bear was asked for) and one as crisp pixel art with a GIBBERISH
    // SIGNATURE stamped in the corner. A fake signature is a hard TEXT fail on the
    // roster's highest text-risk subject, and flux-dev dropped most of the late
    // content at 371 emitted words — the named travellers ARE this path's scale
    // ruler. Rounds 1-2: 10 renders on pro/max/flex, medium 10/10, text 0/10.
    'castle-town-gate': {
      'black-forest-labs/flux-2-pro': 1,
      'black-forest-labs/flux-2-max': 1,
      'black-forest-labs/flux-2-flex': 1,
    },
    // pixel-campfire-night only: flux-1.1-pro-ultra rendered a golden-hour SUNSET on an
    // aurora-and-stars night prompt and stamped a fake copyright mark on it (2026-09-19).
    // Night is this path's whole identity, so it runs on the four models that held it.
    'pixel-campfire-night': {
      'black-forest-labs/flux-2-pro': 1,
      'black-forest-labs/flux-2-max': 1,
      'black-forest-labs/flux-2-flex': 1,
      'black-forest-labs/flux-dev': 1,
    },
  },
  mediumByPath: scene.mediumByPath(SCENE_PATHS),

  // nano-banana clean-render override (2026-06-07). Keeps the pixel-art
  // register crisp + readable on this model (+ empty promptPrefixByMedium
  // so the bot's prefix doesn't pull it off-style).
  mediumStyles: {
    pixelbot_gpt_clean: blocks.GPT_CLEAN,
    // Scene register: a pixel PAINTING of a place (content + composition only;
    // the rolled look owns technique, the prefix owns identity). Code-only medium.
    pixelbot_painting: blocks.PAINTING_MEDIUM,
  },
  // cleanMediumByModel retired 2026-06-21 — only ever routed Nano Banana / gpt-2,
  // both now banned bot-wide (FLUX-only).
  cleanMediumByModel: {},
  promptPrefixByMedium: {
    pixelbot_gpt_clean: '',
    pixelbot_painting: blocks.PAINTING_PREFIX,
  },
  promptSuffixByMedium: {
    pixelbot_painting: blocks.PAINTING_SUFFIX,
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  vibes: allVibes,
  vibesByPath,

  paths: [
    // ─── SCENE PATHS, live 2026-09-19 (PIXELBOT_SCENES_PLAN.md §6) ───
    // Kevin approved all eleven after the final QA batches. Faithful xerox:
    // they remain in SCENE_PATHS above, so medium / model set / vibes /
    // chaos-off / polish-off are byte-identical to the approved shadow runs.
    'pixel-vista',
    'pixel-cabin-glow',
    'pixel-harbor',
    'pixel-cozy-room',
    'pixel-fantasy-vista',
    'pixel-cool-rides',
    'pixel-rain-street',
    'pixel-campfire-night',
    'pixel-shoreline',
    'pixel-skyward',
    'pixel-ruins',
    // ─── the in-game flavour paths Kevin kept ───
    'cozy-rpg-town',
    'side-scroller-world',
    'boss-arena',
    'pixel-horror',
    // 'cozy-farming-life-sim', — PULLED 2026-09-19 for rework into a cozy-cute pixel farm (FarmBot-in-pixels); lives in shadowPaths meanwhile
    'pixel-sci-fi-action',
    'classic-jrpg',
    // 'epic-vista', — REPLACED 2026-09-19 by 'pixel-vista' (plan §3.8); files left dormant
    // Stage K — promoted to live rotation 2026-08-16 (scaled to production;
    // faithful xerox — not in allowSubjectChaosPaths (chaos off), polish applies
    // as in shadow, vibesByPath + global promptPrefix preserved).
    'retro-racing',
  ],

  // Dark-launched (shadow) paths — renderable on demand, hidden from public + rotation.
  // cozy-farming-life-sim: pulled from rotation 2026-09-19 for a rework (cozy-cute pixel
  // farm, FarmBot-in-pixels). Kept renderable + hidden here until the rework is approved.
  // The scene paths went live 2026-09-19; only the pulled farm path stays parked here.
  shadowPaths: [
    'cozy-farming-life-sim',
    'volcano-forge',
    'floating-market-canal',
    'castle-town-gate',
  ],

  // Flat rotation (2026-05-26): equal weight per path — every path posts
  // once per cycle in randomized order via the cycleAllPaths shuffle-bag.
  cycleAllPaths: true,

  // Seasonal paths — drawn ONLY when engine_config.bots_seasonal_enabled is
  // true AND the named holiday window (public.holidays) is calendar-active
  // (scripts/lib/botSeasonal.js). NEVER add these to `paths` above — that
  // would fire them in year-round rotation, exactly what this gate prevents.
  seasonalPaths: {
    halloween: [
      'pixel-haunted-house',
      'pixel-trickortreat-street',
      'pixel-witchs-cottage',
      'pixel-graveyard-night',
      'pixel-haunted-overworld',
      'pixel-haunted-dungeon',
    ],
  },

  chaos: {
    enabled: true,
    skipPaths: [
      ...Object.keys(SCENE_PATHS), // scene paths: chaos off (one hero, never a collage)
      // Halloween seasonal candidates — protect the curated MVP composition
      // proven during AlphaBot QA.
      'pixel-haunted-house',
      'pixel-trickortreat-street',
      'pixel-witchs-cottage',
      'pixel-graveyard-night',
      'pixel-haunted-overworld',
      'pixel-haunted-dungeon',
    ],
    allowSubjectChaosPaths: [
      'cozy-rpg-town',
      'side-scroller-world',
      'boss-arena',
      'pixel-horror',
      'cozy-farming-life-sim',
      'pixel-sci-fi-action',
      'classic-jrpg',
      'epic-vista',
    ],
  },

  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '65-90',
    polishedWordsByPath: {},
    preservePhrasesByPath: {},
    // Halloween seasonal candidates — protect the curated MVP composition
    // proven during AlphaBot QA (same protection as chaos.skipPaths above).
    skipPaths: [
      ...Object.keys(SCENE_PATHS), // scene paths: polish off (setting is the co-hero)
      'pixel-haunted-house',
      'pixel-trickortreat-street',
      'pixel-witchs-cottage',
      'pixel-graveyard-night',
      'pixel-haunted-overworld',
      'pixel-haunted-dungeon',
    ],
  },

  // Sensory anchors disabled — they bleed generic "arcade/boss-fight/CRT/helipad"
  // gaming language into every render, sabotaging per-path genre fidelity.
  sensoryAnchors: { enabled: false },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      // Pixel LOOKS register (scene paths consume it via PIXEL_LOOK_OVERRIDE;
      // in-game templates ignore it and keep their locked SNES register).
      lookRegister: pools.PIXELBOT_LOOK_REGISTER.length
        ? picker.pickWithRecency(pools.PIXELBOT_LOOK_REGISTER, 'look_register')
        : null,
      pixelPerspective: picker.pickWithRecency(pools.PIXEL_PERSPECTIVES, 'pixel_perspective'),
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
    };
  },

  // Bot-level pool defaults for declarative axis paths. PixelBot's axis
  // paths use path-bespoke pools for most slots; this stays empty for now.
  defaultPools: {},

  poolByName(name) {
    if (!(name in pools)) {
      throw new Error(`PixelBot.poolByName: unknown pool "${name}"`);
    }
    return pools[name];
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`PixelBot: unknown path "${path}"`);
    // Declarative axis-system paths export an object { archetype, pools }.
    // Legacy compositional paths export a function. Dispatch on shape.
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
    throw new Error(`PixelBot: path "${path}" has invalid export shape`);
  },

  caption({ path }) {
    return `[${path}] PixelBot`;
  },
};
