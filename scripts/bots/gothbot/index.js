/**
 * GothBot — the bot-engine contract.
 *
 * Hauntingly beautiful dark fantasy. Castlevania/Bloodborne/Dark-Souls/
 * Elden-Ring/Tim-Burton/Crimson-Peak/Berserk/gothic-fairy-tale energy.
 * Elegant darkness — unsettling but gorgeous. Characters by role only.
 * banPhrases: jack skellington, nightmare before christmas.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');
const { ALL_ENABLED_AI_MODELS } = require('../../lib/imageModels');

const pathBuilders = {
  'dark-landscape': require('./paths/dark-landscape'),
  'gothic-architecture': require('./paths/gothic-architecture'),
  'goth-closeup': require('./paths/goth-closeup'),
  'goth-full-body': require('./paths/goth-full-body'),
  'castlevania-scene': require('./paths/castlevania-scene'),
  'cozy-goth': require('./paths/cozy-goth'),
  'vampire-girls-2': require('./paths/vampire-girls-2'),
  'gothic-vista': require('./paths/gothic-vista'),
  'vampire-assassin-female': require('./paths/vampire-assassin-female'),
  'vampire-from-a-distance': require('./paths/vampire-from-a-distance'),
  'vampire-hunter-in-action': require('./paths/vampire-hunter-in-action'),
  'goth-male-full-body-axis': require('./paths/goth-male-full-body-axis'),
  'vampire-assassin-combat': require('./paths/vampire-assassin-combat'),
  'monster-prowl': require('./paths/monster-prowl'),
  'monster-prowl-victorian': require('./paths/monster-prowl-victorian'),
  'monster-prowl-inked': require('./paths/monster-prowl-inked'),
  'monster-prowl-weta': require('./paths/monster-prowl-weta'),
};

module.exports = {
  username: 'gothbot',
  displayName: 'GothBot',

  // Opt in to per-medium Flux routing via lib/modelPicker.js.
  // Reads dream_mediums.allowed_models (bot-scope, includes bot-only mediums).
  // Other bots without this flag continue to use hardcoded flux-dev.
  useModelPicker: true,

  // Bot-scoped model whitelist — intersects with each medium's allowed_models
  // pool BEFORE picking. GothBot bans flux-2-dev (tensor bug: "q_descale must
  // have shape...") and flux-2-pro (over-strict E005 safety filter). Every
  // gothbot render picks flux-dev or flux-1.1-pro only.
  // Banned 2026-06-02: flux-2-flex (Kevin heart-ban — fleet-wide for gothbot).
  allowedModels: [
    'google/gemini-2-image',
    'openai/gpt-image-2',
    'black-forest-labs/flux-2-pro',
    'black-forest-labs/flux-1.1-pro',
    'black-forest-labs/flux-1.1-pro-ultra',
    'black-forest-labs/flux-2-max',
  ],

  // Per-path model override — takes precedence over pickModel (medium pool).
  // Every path locked to flux-1.1-pro (Kevin's call 2026-05-16: PNG output
  // solved the resolution issue that originally drove the move to ultra, and
  // pro handles multi-subject combat scenes better than ultra — ultra
  // collapses two-subject prompts to single dominant subject).
  //
  // KNOWN RISK: vampire-girls-2 was previously locked to flux-dev because
  // 1.1-pro's E005 safety filter tripped on its dark vampire imagery. If
  // any path renders fail on E005, fall that single path back to flux-dev.
  modelByPath: {
    // Scene / landscape / architecture paths — modelByPath entries REMOVED
    // 2026-05-31. These were 1.1-pro string-locks that overrode the 7-model
    // bot-wide allowedModels lineup. Now these paths roll from the full
    // 7-model picker (Banana, GPT-2, F2 Pro, F1.1 Pro, F1.1 Pro Ultra,
    // F2 Flex, F2 Max — Flux Dev was the bot-wide drop per BOT_MODEL_TALLY).
    // Locks removed: dark-landscape, gothic-architecture, castlevania-scene,
    // cozy-goth, gothic-vista.

    // ── Female character paths — multi-model arrays from Kevin's 5-path
    // ── × 8-model × 3-rep audit (2026-05-31). The previous 1.1-pro locks
    // ── on these 5 paths are intentionally REPLACED with the broader
    // ── per-path lineup minus the hearted-as-bad models. Bans noted
    // ── inline per path. To unban: add the model id back.
    'goth-closeup': [
      // BAN: Banana, Flux 2 Flex (2026-06-02)
      'openai/gpt-image-2',
      'black-forest-labs/flux-dev',
      'black-forest-labs/flux-2-pro',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
      'black-forest-labs/flux-2-max',
    ],
    'goth-full-body': [
      // BAN: Flux Dev, Flux 2 Pro, Flux 2 Flex (2026-06-02)
      'google/gemini-2-image',
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
      'black-forest-labs/flux-2-max',
    ],
    'goth-male-full-body-axis': [
      // Mirror of goth-full-body (2026-05-31). Same bans on male twin:
      // Flux Dev, Flux 2 Pro, Flux 2 Flex (2026-06-02). Model fingerprint
      // (eye geometry, face polish) doesn't change with subject gender,
      // so a model that looks bad on the female version of a path looks
      // bad on the male version too.
      'google/gemini-2-image',
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
      'black-forest-labs/flux-2-max',
    ],

    // Vampire paths (female-coded subset gets the multi-model arrays)
    'vampire-girls-2': [
      // BAN: Flux 2 Flex (2026-06-02)
      'google/gemini-2-image',
      'openai/gpt-image-2',
      'black-forest-labs/flux-dev',
      'black-forest-labs/flux-2-pro',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
      'black-forest-labs/flux-2-max',
    ],
    'vampire-assassin-female': [
      // BAN: Flux Dev, Flux 2 Flex
      'google/gemini-2-image',
      'openai/gpt-image-2',
      'black-forest-labs/flux-2-pro',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
      'black-forest-labs/flux-2-max',
    ],
    // ── Non-character scene/atmosphere/monster paths (Kevin 2026-05-31 —
    // ── uniform cross-bot lineup): 5 models — Banana, GPT-2, F2 Pro,
    // ── F1.1 Pro, F1.1 Ultra. F2 Flex + F2 Max + Flux Dev banned.
    // ── vampire-from-a-distance is classified non-character (distant figure,
    // ── cinematic scenery) per Kevin's confirmation 2026-05-31.
    'vampire-from-a-distance': [
      'google/gemini-2-image',
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    'dark-landscape': [
      'google/gemini-2-image',
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    'gothic-architecture': [
      'google/gemini-2-image',
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    'castlevania-scene': [
      'google/gemini-2-image',
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    'gothic-vista': [
      'google/gemini-2-image',
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    'monster-prowl': [
      'google/gemini-2-image',
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    'monster-prowl-victorian': [
      'google/gemini-2-image',
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],

    // Other character/vampire paths (vampire-hunter-in-action, goth-male-
    // full-body-axis, vampire-assassin-combat) intentionally fall through to
    // the bot-wide 7-model allowedModels picker — audit individually if
    // render quality regresses.
  },

  // Per-path vibe restriction — vampire-girls-2 only renders well with
  // dark-coded vibes. Pretty-coded vibes (coquette/shimmer/ethereal/psychedelic)
  // and tone-neutral ones (cinematic/epic) fight the vampire intent.
  vibesByPath: {
    // Character paths consolidated to the dark/nightshade/macabre triad.
    'goth-closeup': ['dark', 'nightshade', 'macabre'],
    'goth-full-body': ['dark', 'nightshade', 'macabre'],
    'vampire-girls-2': ['dark', 'nightshade', 'macabre'],
    // Scene paths locked to the dark / nightshade / macabre triad for the trial.
    'dark-landscape': ['dark', 'nightshade', 'macabre'],
    'gothic-architecture': ['dark', 'nightshade', 'macabre'],
    'castlevania-scene': ['dark', 'nightshade', 'macabre'],
    'cozy-goth': ['dark', 'nightshade', 'macabre'],
    'gothic-vista': ['dark', 'nightshade', 'macabre'],
    // Vampire-assassin paths locked to the dark triad.
    'vampire-assassin-female': ['dark', 'nightshade', 'macabre'],
    'vampire-from-a-distance': ['dark', 'nightshade', 'macabre'],
    'vampire-hunter-in-action': ['dark', 'nightshade', 'macabre'],
    'goth-male-full-body-axis': ['dark', 'nightshade', 'macabre'],
    'vampire-assassin-combat': ['dark', 'nightshade', 'macabre'],
    'monster-prowl': ['dark', 'nightshade', 'macabre'],
    'monster-prowl-victorian': ['dark', 'nightshade', 'macabre'],
    'monster-prowl-inked': ['dark', 'nightshade', 'macabre'],
    'monster-prowl-weta': ['dark', 'nightshade', 'macabre'],
  },

  mediumByPath: {
    // Character paths consolidated to anime medium (matches scene paths).
    'goth-closeup': 'anime',
    'goth-full-body': 'anime',
    'vampire-girls-2': 'anime',
    // Scene/landscape paths hardcoded to anime medium for the trial.
    'dark-landscape': 'anime',
    'gothic-architecture': 'gothbot_gothic_print',
    'castlevania-scene': 'anime',
    'cozy-goth': 'anime',
    'gothic-vista': 'anime',
    // Vampire-assassin paths locked to anime medium for the trial.
    'vampire-assassin-female': 'anime',
    'vampire-from-a-distance': 'anime',
    'vampire-hunter-in-action': 'anime',
    'goth-male-full-body-axis': 'anime',
    'vampire-assassin-combat': 'anime',
    // monster-prowl renders in the dark-ANIME medium (Kevin 2026-05-25 — anime gives
    // the most creative range in Flux; this is the medium that made the hearted ghoul).
    // Spiced up with the 40%-gated drama axis (dramatic gothic background events).
    'monster-prowl': 'anime',
    // monster-prowl-victorian stays the FROZEN classical-oil branch.
    'monster-prowl-victorian': 'canvas_victorian',
    'monster-prowl-inked': 'inked_spectrum',
    'monster-prowl-weta': 'gargoyle_anime',
  },

  // Bot-only tags (inactive in dream_mediums so users can't pick them — VenusBot's 'surreal' pattern):
  //   'gothic_architecture' → heavy-ink Castlevania-manga stylization (landscape/architecture paths)
  //   'gothic_realistic' → 80s-90s dark-fantasy paperback oil-painting
  // Character paths override via mediumByPath → canvas/illustration/watercolor.
  mediums: [
    'gothic_architecture',
    'gothic_architecture',
    'gothic_architecture',
    'gothic_architecture', // 4× = 29% flagship stylized
    'gothic_realistic',
    'gothic_realistic',
    'gothic_realistic', // 3× = 21% painterly-realism
    'anime',
    'anime', // 2× = 14% dark-anime
    'comics',
    'pencil',
    'illustration',
    'canvas',
    'watercolor',
  ],

  promptPrefixByMedium: {
    vampire_portrait:
      'wallpaper-worthy operatic gothic vampire painting, dramatic theatrical composition, gallery-poster gravity',
    // FaeBot-pattern: empty prefix so the scene leads, not style language.
    painted_gothic_fantasy: blocks.PROMPT_PREFIX_PAINTED_GOTHIC_FANTASY,
    // gothic-architecture path bespoke (2026-05-15). Empty so the structure
    // description leads — style language lives in mediumStyles + suffix.
    gothbot_gothic_print: '',
    // monster-prowl (canvas): NO override — uses the bot-wide PROMPT_PREFIX.
    // Reverted to the hearted impasto-Castlevania state (Kevin 2026-05-25,
    // preferred over the later Frazetta classical-Victorian tune). The
    // classical-Victorian prefix now lives ONLY on canvas_victorian (frozen).
    // monster-prowl-victorian — FROZEN classical-Victorian prefix (converged state).
    canvas_victorian:
      'a classical Victorian gothic oil painting of a single recognizable monster, dark-Romantic 19th-century painted horror, operatic and beautiful and terrifying, vivid and richly saturated',
    // monster-prowl (inked) — REPLACES the bot-wide prefix to drop its purple-lead
    // ("deep purples + midnight blues + velvet blacks") that was forcing a violet
    // monochrome. Front-loads VIVID VARIED saturated comic color (Kevin 2026-05-25).
    // monster-prowl — hyperreal cinematic prefix (Kevin 2026-05-25).
    hyperreal:
      'ultra-high-definition hyperreal cinematic gothic-horror creature render, Unreal Engine 5 photorealistic 3D, Castlevania + Bloodborne creature-feature energy, rich natural color, dramatic and cinematic',
    inked_gothic:
      'detailed dark-fantasy gothic-horror ink illustration, Castlevania + Bloodborne creature-feature energy, rich natural full color, hauntingly beautiful and operatic',
    inked_spectrum:
      'bold inked dark-anime gothic-horror comic illustration, Castlevania + Bloodborne + Devil-May-Cry + Van-Helsing creature-feature energy, VIVID FULLY-SATURATED high-chroma comic color across a RICH VARIED spectrum — emerald and witch-green, blood-crimson, electric teal and cyan, gold and candle-amber, bone-ivory, with royal-violet and hot-magenta accents — bold and punchy against deep inky blacks, hauntingly beautiful and operatic',
    // monster-prowl-weta — combined hyperreal + Weta-Workshop realistic render.
    weta_render:
      'ultra-high-definition hyperreal cinematic 3D render, Weta-Workshop + Unreal Engine 5 lifelike realism, RICH FULL-SPECTRUM SATURATED color against deep ominous shadow, dark dramatic and cinematic',
    gargoyle_anime:
      'richly-detailed dark-anime gothic-horror illustration, hand-drawn and cel-shaded, vivid, dramatic and cinematic',
  },
  // 2026-06-02 — Per-path prefix prepended BEFORE the bot-wide prefix in the
  // engine resolution order. monster-prowl's hearted impasto-Castlevania
  // state (Kevin 2026-05-25) relied on the OLD 282ch bot-wide prefix that
  // contained the franchise enumeration + 6-color palette enumeration. The
  // bot-wide was stripped in shared-blocks.js to a clean single anchor so
  // the other 14 paths render without first-token enum-lock; this entry
  // preserves the FULL ORIGINAL prefix verbatim for ONLY monster-prowl,
  // restoring its hearted DNA.
  promptPrefixByPath: {
    'monster-prowl':
      'Castlevania + Bloodborne + Devil-May-Cry + Van-Helsing energy, rich varied palette with deep purples + midnight blues + velvet blacks + poison greens + candle-amber + moonlit silver accents',
  },
  promptSuffixByMedium: {
    vampire_portrait:
      'operatic gothic dark-fantasy painting finish, painterly brushwork with bold heavy shadow, gallery-poster gravity, no text no words no watermarks, NOT photoreal NOT cinematic film-still NOT 35mm NOT magazine editorial NOT plastic-skin NOT Halloween costume NOT modern fashion photography',
    painted_gothic_fantasy: blocks.PROMPT_SUFFIX_PAINTED_GOTHIC_FANTASY,
    gothbot_gothic_print:
      'Castlevania-promotional-art finish, hyper-detailed sharp linework, high-def gallery-print fidelity, dark gothic-action-horror illustration quality, no text no words no watermarks, NOT photoreal NOT film-still NOT 35mm NOT photo-realistic CGI NOT plain-anime',
  },

  // Per-medium prompt injection — gives each medium distinct visual character.
  // This fragment gets injected between promptPrefix and the Sonnet-written scene.
  mediumStyles: {
    gothbot_gothic_print:
      'hyper-detailed Castlevania-illustration concept-art, Symphony-of-the-Night promotional-art lineage, Devil-May-Cry environment-art tradition, Bloodborne concept-illustration polish, Berserk-manga Kentaro-Miura ink-detail stylization but painted-not-flat, sharp clean linework, every architectural ornament rendered crisp at every readable scale, theatrical high-contrast lighting, rich tonal depth, high-def gallery-print fidelity, dark gothic-horror action-game promotional-art quality, NOT photoreal NOT film-still NOT 35mm NOT photo-realistic CGI NOT plain-anime NOT shonen NOT moe NOT cute',
    gothic_architecture:
      'dark gothic-horror illustration, heavy-ink shadow, hyper-baroque ornate architectural detail, high-contrast chiaroscuro, Castlevania-environment concept-art, moonlit stone and stained-glass atmosphere',
    // Subject-agnostic rewrite — stripped all character/face/makeup/expression
    // language that was leaking into landscape + architecture paths. Medium now
    // describes ONLY the rendering style (painted oil-on-canvas dark-fantasy
    // paperback polish) with no subject implied. Any path's subject (landscape,
    // architecture, character, interior) gets rendered in this style cleanly.
    gothic_realistic:
      '1980s-1990s dark-fantasy paperback oil-painting cover art, Luis-Royo + Boris-Vallejo + Julie-Bell + Frank-Frazetta + Ken-Kelly painted-cover tradition, semi-realistic painterly rendering with visible brushwork and heavy impasto oil texture (NOT photoreal, NOT plastic-digital), strong chiaroscuro with warm amber candle / torch / moonlit key-light against cool violet-blue shadow, dramatic painted-polish dark-fantasy atmosphere, dark-fantasy-paperback-cover craft quality, NOT flat-inked, NOT manga, NOT smooth-digital-art, NOT Artgerm-plastic, NOT Rossdraws',
    vampire_portrait:
      'WALLPAPER-WORTHY operatic gothic-theatrical painting fusing old-master-oil-painting tradition with painted-fantasy-poster drama, visible painterly brushwork, punchy jewel-tone palette anchored by deep velvet shadow, theatrical chiaroscuro pushed to operatic extreme, dramatic single-source key-light cutting through gloom, frame-worthy gallery-painting composition, dark gothic horror character energy, NOT photoreal NOT cinematic film-still NOT magazine editorial NOT plastic-skin NOT smooth-digital-art NOT modern fashion photography NOT pretty-girl-in-dress',
    anime:
      'dark-anime horror illustration, Berserk-manga Kentaro-Miura ink stylization, Devil-May-Cry character-art, heavy-shadow anime-horror aesthetic, NOT cute-anime NOT shonen NOT moe',
    comics:
      'gothic-horror comic-panel illustration, Mike-Mignola-Hellboy inked shadow, Hellblazer vertigo-horror comic stylization, bold black ink, dramatic chiaroscuro panels',
    pencil:
      'heavy graphite gothic-horror sketch, cross-hatched shadow, dark-fantasy concept-sketch linework, inked-over-pencil stylization, dramatic gothic illustration drawn in pencil-and-ink',
    illustration:
      'stylized gothic-horror illustration, angular ink-driven dark-fantasy concept art, heavy-black shadow rendering, dark-manga-horror cover-art stylization',
    // monster-prowl: reverted to the HEARTED impasto-Castlevania canvas state
    // (Kevin 2026-05-25 — preferred over the later Frazetta classical-Victorian tune).
    canvas:
      'oil-painted gothic-horror portrait, heavy impasto brushwork, chiaroscuro painterly-horror tradition (Caravaggio-meets-Castlevania), painterly dark-fantasy baroque canvas',
    canvas_victorian:
      'lush classical oil painting on canvas, vivid luminous dark-fantasy oil in the tradition of Frank Frazetta + Brom + Caravaggio, rich JEWEL-TONED SATURATED color, glowing radiant highlights against deep velvety shadows, dramatic chiaroscuro, fine detailed painterly brushwork, bold vibrant high-saturation gothic-horror oil painting, painterly NOT photographic, NOT anime, NOT digital-cartoon, NOT cel-shaded',
    // monster-prowl bespoke (Kevin 2026-05-25) — inked dark-anime / comic-horror.
    // monster-prowl — ULTRA-HIGH-DEF HYPERREAL cinematic render (Kevin 2026-05-25).
    hyperreal:
      'ultra-high-definition hyperreal cinematic render, Unreal Engine 5 + Octane photorealistic 3D, ray-traced global illumination, physically-based materials, ultra-detailed 8K textures (matted fur, wet scales, weathered stone, pale skin, tattered fabric), volumetric atmospheric lighting, cinematic depth of field, film-quality VFX creature render, razor-sharp focus, hyperrealistic',
    inked_gothic:
      'detailed dark-fantasy ink illustration, clean confident bold inking with sharp readable linework, SOLID clearly-readable forms and faces, rich NATURAL full color, dramatic chiaroscuro, gothic-horror illustration',
    // monster-prowl-inked — BOLD RICH DETAILED COMIC (matches the hearted vivid look);
    // palette from the color_mood spectrum axis. No Berserk (tree-fusion); solid-creature guard.
    inked_spectrum:
      'inked dark-anime gothic-horror illustration, bold hard black contour outlines wrapping every form, flat graphic cel-shaded color blocks, VIVID FULLY-SATURATED high-chroma color, richly detailed and intricate rendering, crisp clean drawn linework, heavy solid-black shadow shapes, Berserk-manga Kentaro-Miura ink stylization, Castlevania promotional-art lineage, Mike-Mignola-Hellboy inked-comic finish, dramatic graphic chiaroscuro, lush detailed backgrounds, mature gritty comic-horror, NOT cute-anime NOT shonen NOT moe',
    // monster-prowl-weta — COMBINED hyperreal (UE5) + Weta-Workshop realistic render (Kevin 2026-05-25).
    weta_render:
      'hyperreal cinematic 3D render, Weta-Workshop practical-effects realism fused with Unreal Engine 5 + Octane physically-based rendering, ultra-high-definition lifelike textures (believable skin, scales, fur, wet membrane, sinew, weathered stone), ray-traced cinematic lighting in RICH FULL-SPECTRUM SATURATED color — bold colored light and glow in vivid emerald, blood-crimson, electric teal, gold-amber, royal violet, hot magenta — against deep ominous inky-black shadow, ultra-detailed 8K materials, sharp focus, dark dramatic cinematic depth',
    // gargoyle anime comparison medium (illustrative dark-anime, hand-drawn cel-shaded).
    gargoyle_anime:
      'richly-detailed dark-anime gothic-horror illustration, clean confident bold anime linework, flat cel-shaded with rich vivid saturated color, hand-drawn illustrated 2D style, dramatic and ornate, intricate detail',
    watercolor:
      'gothic watercolor horror illustration, blood-ink wash bleed, wet-on-wet dark fantasy tradition, atmospheric watercolor with ink-line overlay, gothic sumi-e inkwash',
    // FaeBot-pattern tiny medium tag — small enough not to hijack early-
    // token weight. The path's scene description leads the prompt.
    painted_gothic_fantasy: blocks.PAINTED_GOTHIC_FANTASY_MEDIUM,
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  bannedPhrases: ['jack skellington', 'nightmare before christmas'],

  // Chaos layer — port of V4's chaosLayer.ts. Adds 1-2 dream-logic perception
  // distortions (geometry/reflection/scale/framing/secondary-light) to the
  // Sonnet brief on ~70% of renders. Sonnet weaves the distortion into the
  // scene description naturally.
  //
  // skipPaths: face-dominant paths where perception distortion would fight
  // the face-swap aesthetic or muddy a portrait.
  //
  // allowSubjectChaosPaths: only paths with a figure IN an environment (not
  // face-dominant) get subject-chaos channel enabled. Pure scenery paths
  // also benefit (figure becomes optional landmark).
  chaos: {
    enabled: true,
    skipPaths: ['goth-closeup'],
    allowSubjectChaosPaths: ['goth-full-body', 'goth-male-full-body-axis'],
  },

  // Sensory anchors (V4/nightly Step 3 enhancement port).
  // Adds 1-2 non-visual sensory cues (smell/sound/touch/temperature/weight/air)
  // to the Sonnet brief on every render. Sonnet weaves them into the scene so
  // verbs/adjectives around them sharpen — frankincense smoke clinging to her
  // hair, stone radiating crypt-cold up through her bare feet, etc.
  //
  // Bot-wide pools live in poolsByChannel (used for any path that doesn't
  // override). Per-path richer pools live in poolsByChannelByPath. Resolution
  // order per channel: per-path > per-bot > built-in DEFAULT_POOLS.
  //
  // Testing pools at 6 entries each (will scale to 100/channel via Sonnet
  // seed gen once the layer is validated — same pattern as vampire_hair etc).
  sensoryAnchors: {
    enabled: true,
    // Mandatory channels — always fire, on top of stochastic count.
    // lightcolor is required so every render gets a punchy lighting palette
    // (otherwise Sonnet defaults to safe warm-amber/cool-violet).
    requiredChannels: ['lightcolor'],

    // Map each path to its subject context. Pools are split into three
    // variants (female / male / scene) so language matches the subject:
    //   - female paths: "her throat", "lace digging", feminine garments
    //   - male paths: "his jaw", "gauntlet leather", masculine gear
    //   - scene paths: no human, environmental anchors only
    // Paths not listed default to 'scene' in the layer.
    pathContext: {
      'vampire-girls-2': 'female',
      'goth-closeup': 'female',
      'goth-full-body': 'female',
      'goth-male-full-body-axis': 'male',
      'vampire-hunter-in-action': 'male',
      'dark-landscape': 'scene',
      'gothic-architecture': 'scene',
      'gothic-vista': 'scene',
      'castlevania-scene': 'scene',
      'cozy-goth': 'scene',
    },

    // 21 Sonnet-seeded pools (3 contexts × 7 channels × 50 entries each)
    // loaded from scripts/bots/gothbot/seeds/sensory_<ctx>_<ch>.json.
    poolsByContextAndChannel: pools.SENSORY_POOLS,
  },

  // Two-pass Sonnet→Haiku polish (V4/nightly Step 2 enhancement port).
  // Sonnet writes a vivid 150-word concept (no compression pressure),
  // then Haiku compresses to Flux-ready length while preserving anchor
  // phrases. Reusable for any bot — copy this block and customize
  // preservePhrasesByPath to enable.
  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '65-90',
    // Per-path word ceiling overrides — paths with sensory anchors + many
    // mandatory anchors need more headroom or Haiku drops sensory detail.
    polishedWordsByPath: {
      'vampire-girls-2': '80-110',
    },
    // Per-path anchor phrases that Haiku must preserve through compression.
    // Falls back to twoPassPolish.preservePhrases (global) if path not listed.
    // Sensory anchor phrases that rolled this turn are auto-merged into this
    // list at runtime (engine appends them — no need to enumerate here).
    preservePhrasesByPath: {
      'vampire-girls-2': [
        'glowing',
        'radiating',
        'inhuman',
        'heavy',
        'dark smoky-eye',
        'sharp dark eyeliner',
        'blood-red',
        'corpse-pale',
        'gothic',
      ],
    },
    // Optional: skip two-pass on specific paths
    // vampire-hunter-in-action: axis-system path with load-bearing hunt-scene mandate.
    // goth-male-full-body-axis: rich pools need full Sonnet brief.
    skipPaths: [
      'dark-landscape',
      'gothic-vista',
      'gothic-architecture',
      'castlevania-scene',
      'cozy-goth',
      'monster-prowl',
      'monster-prowl-victorian',
      'monster-prowl-inked',
      'monster-prowl-weta',
      'vampire-hunter-in-action',
      'goth-male-full-body-axis',
    ],
  },

  // Curated 13 — cuts: whimsical/nostalgic/enchanted/voltage (too soft/fairytale/neon);
  // excludes: minimal/cozy/peaceful (off-brand). Coquette + shimmer re-added
  // 2026-04-22 for vampire-vogue editorial-couture path (pastel-rose/black-lace
  // and tarnished-silver/gold-glint work for extreme vampire fashion).
  // Array repetition weights: macabre/nightshade/arcane 3× (flagship trio), others 1×.
  vibes: [
    'macabre',
    'macabre',
    'macabre',
    'nightshade',
    'nightshade',
    'nightshade',
    'arcane',
    'arcane',
    'arcane',
    'cinematic',
    'dark',
    'epic',
    'psychedelic',
    'ethereal',
    'ancient',
    'fierce',
    'surreal',
    'coquette',
    'shimmer',
  ],

  paths: [
    'dark-landscape',
    'gothic-architecture',
    'goth-closeup',
    'goth-full-body',
    'castlevania-scene',
    'cozy-goth',
    'vampire-girls-2',
    'gothic-vista',
    'vampire-assassin-female',
    'vampire-from-a-distance',
    'vampire-hunter-in-action',
    'goth-male-full-body-axis',
    'vampire-assassin-combat',
    'monster-prowl',
    'monster-prowl-victorian',
    // Built + working, intentionally NOT live yet — Kevin may activate later (2026-05-26).
    // Builder / medium / pools / seeds all wired below; re-enable by uncommenting.
    // 'monster-prowl-inked',
    // 'monster-prowl-weta',
  ],

  // Flat rotation (2026-05-26 fleet-wide flatten): no pathWeights — every active
  // path gets an equal 1 slot/cycle via the cycleAllPaths shuffle-bag below, so
  // the bot posts each path once per cycle in randomized order, then reshuffles.
  // (Replaced the old scene:character 4:3 weighting.)
  cycleAllPaths: true,

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.dark,
    };
  },

  // Bot-level pool defaults for declarative axis paths.
  defaultPools: {
    lighting: 'LIGHTING',
    atmosphere: 'ATMOSPHERES',
  },

  poolByName(name) {
    if (!(name in pools)) {
      throw new Error(`GothBot.poolByName: unknown pool "${name}"`);
    }
    return pools[name];
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, medium, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`GothBot: unknown path "${path}"`);
    if (typeof builder === 'function') {
      return builder({ sharedDNA, vibeDirective, vibeKey, medium, picker });
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
    throw new Error(`GothBot: path "${path}" has invalid export shape`);
  },

  caption({ path }) {
    return `[${path}] GothBot`;
  },
};
