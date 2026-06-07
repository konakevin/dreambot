/**
 * SteamBot — the bot-engine contract.
 *
 * UNIFIED STEAMPUNK STYLE (2026-05-03):
 * One custom hardcoded look — `steambot-hyperreal` — applied to EVERY
 * SteamBot render. No medium rotation. No vibe rotation. The bot has
 * one unified visual identity: hyperreal surreal-realistic cinematic
 * steampunk concept render. Variety comes only from path + scene seeds.
 *
 * The medium key `steambot-hyperreal` is bot-internal only — it does NOT
 * exist in the dream_mediums DB table. The engine reads its style from
 * `mediumStyles` here, which short-circuits the DB lookup.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');
const { ALL_ENABLED_AI_MODELS } = require('../../lib/imageModels');

const pathBuilders = {
  'steampunk-scene': require('./paths/steampunk-scene'),
  'airship-skies': require('./paths/airship-skies'),
  'airship-female': require('./paths/airship-female'),
  'airship-male': require('./paths/airship-male'),
  'steampunk-curio': require('./paths/steampunk-curio'),
  'sexy-steampunk-woman': require('./paths/sexy-steampunk-woman'),
  'steampunk-man': require('./paths/steampunk-man'),
  'steampunk-spectacle': require('./paths/steampunk-spectacle'),
  'steam-transport': require('./paths/steam-transport'),
  'cozy-steampunk': require('./paths/cozy-steampunk'),
  'steampunk-labs': require('./paths/steampunk-labs'),
};

// THE SteamBot look — crisp + vivid + cinematic. NO "hyperreal" / "photoreal"
// language because those words trigger Flux 1.1 Pro's locked beautiful-woman
// face prior and produce same-girl-every-render. Aiming for rich, vivid,
// cinematic illustration that FEELS real without invoking photorealism.
const STEAMBOT_HYPERREAL_STYLE =
  'crisp vivid cinematic rendering, rich saturated color, sharp focused detail across all depth layers, dramatic feature-film production design, painterly-rich character illustration with photographic clarity';

// Bespoke medium for sexy-steampunk-woman — vivid painted character
// illustration. Modern digital painted character art lineage (Artgerm / WLOP
// / Loish / Stanley Lau / Sakimichan / Jia Xing) — lush saturated painterly
// finish, soft painterly brushwork on skin with cinematic lighting, full
// tonal range. NOT hyperreal CGI (CG-precision precision is what we DON'T
// want), NOT watercolor on paper, NOT Mucha/art-nouveau decorative borders,
// NOT anime. Painted character art with idealized proportions + ornate
// detail + saturated jewel-tones + dramatic cinematic light.
const STEAMBOT_PAINTED_WOMAN_STYLE =
  'oil-painted illustration on canvas, visible painterly brushwork and brush texture, traditional painted character illustration in the style of Frazetta and Brom and Boris Vallejo painted-fantasy-cover heroines, lush saturated jewel-toned oil pigment, dramatic cinematic lighting with golden-hour rim light, every surface PAINTED not photographed, painted-illustration finish, NOT a photograph, NOT photorealistic, NOT hyperreal CGI, NOT watercolor on paper, NOT anime, NOT art-nouveau decorative border';

// Bespoke medium for steampunk-man — same oil-painted-illustration register
// as the female path but with its own named medium so the male path stays
// architecturally isolated (no cross-pollution). Frazetta / Brom / Vallejo
// painted-fantasy-cover lineage; tuned for handsome / dashing / rugged
// gentleman portraits, never seductive.
const STEAMBOT_PAINTED_MAN_STYLE =
  'oil-painted illustration on canvas, visible painterly brushwork and brush texture, traditional painted character illustration in the style of Frazetta and Brom and Boris Vallejo painted-fantasy-cover heroes, lush saturated jewel-toned oil pigment, dramatic cinematic lighting with golden-hour rim light, every surface PAINTED not photographed, painted-illustration finish, NOT a photograph, NOT photorealistic, NOT hyperreal CGI, NOT watercolor on paper, NOT anime, NOT art-nouveau decorative border';

// Bespoke medium for cozy-steampunk path — same lush painted-illustration
// register as the painted-woman medium, but tuned for INTERIORS not
// female-figure-on-cover. Swaps the Frazetta/Brom/Vallejo lineage (which
// bakes in pin-up/cheesecake bias) for painters with the same opulent
// painted-fantasy atmosphere on INTERIORS / WORLDS: Maxfield Parrish
// (golden atmospheric), James Gurney Dinotopia (lush painted worldbuilding
// of fantasy interiors and architecture), James Christensen (ornate
// intricate fantasy detail), N.C. Wyeth (classic illustration depth).
const STEAMBOT_PAINTED_INTERIOR_STYLE =
  'oil-painted illustration on canvas, visible painterly brushwork and brush texture, lush painted-interior illustration in the style of Maxfield Parrish (golden atmospheric beauty) and James Gurney Dinotopia (lush painted worldbuilding) and James Christensen (ornate intricate fantasy detail) and N.C. Wyeth (classic illustration depth), saturated jewel-toned oil pigment, dramatic cinematic lighting with directional rim light, every surface PAINTED not photographed, painted-illustration finish, NOT a photograph, NOT photorealistic, NOT hyperreal CGI, NOT watercolor on paper, NOT anime, NOT a pin-up cover, NOT a cheesecake-cover heroine';

module.exports = {
  username: 'steambot',
  displayName: 'SteamBot',

  useModelPicker: true,
  // flux-2-pro BANNED bot-wide 2026-06-07 (Kevin) — removed from allowedModels
  // and every modelByPath entry below.
  allowedModels: [
    'google/gemini-2-image',
    'openai/gpt-image-2',
    'black-forest-labs/flux-1.1-pro',
    'black-forest-labs/flux-1.1-pro-ultra',
    'black-forest-labs/flux-2-flex',
  ],

  // modelByPath: per-path bans (2026-05-31 — Kevin's uniform non-character
  // lineup). Non-character paths get the same 4-model lineup:
  // Banana, GPT-2, F1.1 Pro, F1.1 Ultra. Character paths (airship-female,
  // airship-male, sexy-steampunk-woman, steampunk-man) get the same lineup
  // MINUS Banana per Kevin's 2026-06-05 character-path ban.
  modelByPath: {
    // ── Character paths — bot-wide MINUS Banana (Kevin 2026-06-05).
    'airship-female': [
      'google/gemini-2-image',
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
      'black-forest-labs/flux-2-flex',
    ],
    'airship-male': [
      'google/gemini-2-image',
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
      'black-forest-labs/flux-2-flex',
    ],
    'sexy-steampunk-woman': [
      // Banana BANNED 2026-06-05 — 50% safety-filter refusal rate in audit
      // (4 attempts: 2 refused with finishReason: NO_IMAGE). Headache to
      // recover in production. F1.1 family + GPT-2 + F2 family carry it.
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
      'black-forest-labs/flux-2-flex',
    ],
    'steampunk-man': [
      'google/gemini-2-image',
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
      'black-forest-labs/flux-2-flex',
    ],
    'steampunk-scene': [
      'google/gemini-2-image',
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    'airship-skies': [
      'google/gemini-2-image',
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    'steampunk-curio': [
      'google/gemini-2-image',
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    'steampunk-spectacle': [
      'google/gemini-2-image',
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    'steam-transport': [
      'google/gemini-2-image',
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    'steampunk-labs': [
      'google/gemini-2-image',
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    'cozy-steampunk': [
      'google/gemini-2-image',
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
  },

  // SteamBot's custom medium keys. Bot-internal — do NOT exist in
  // dream_mediums DB. Scene paths use steambot-hyperreal; female path uses
  // steambot-painted-woman (painterly-photographic character portraiture).
  mediums: ['steambot-hyperreal'],

  // cleanMediumByModel: gpt-image-2 AND nano-banana both render the bot-only
  // 'steambot_gpt_clean' medium + minimal prefix. Strips the "impossibly-
  // detailed" anchor that pulls these models into abstract ornamental plates.
  // 2026-06-07 (extends the 2026-06-05 gpt-only fix to nano-banana).
  cleanMediumByModel: {
    'openai/gpt-image-2': { medium: 'steambot_gpt_clean' },
    'google/gemini-2-image': { medium: 'steambot_gpt_clean' },
  },

  mediumByPath: {
    'sexy-steampunk-woman': 'steambot-painted-woman',
    'steampunk-man': 'steambot-painted-man',
    'airship-female': 'steambot-painted-woman',
    'airship-male': 'steambot-painted-man',
    'cozy-steampunk': 'steambot-painted-interior',
    // steampunk-labs uses default hyperreal medium — painted-interior medium
    // drowned the sci-fi mad-science energy with lush atmospheric-Victorian
    // painter lineage (Parrish/Gurney/Christensen). Hyperreal lets the
    // glowing experiments + sigils + Tesla arcs come through.
  },

  mediumStyles: {
    // gpt-image-2 clean (routed via mediumByModel above). Pulls GPT-Image-2
    // out of the abstract-plate prior the heavy steampunk illustration
    // anchors trigger. Mirrors mystical-mermaid (2026-06-05).
    steambot_gpt_clean: blocks.GPT_CLEAN,
    'steambot-hyperreal': STEAMBOT_HYPERREAL_STYLE,
    'steambot-painted-woman': STEAMBOT_PAINTED_WOMAN_STYLE,
    'steambot-painted-man': STEAMBOT_PAINTED_MAN_STYLE,
    'steambot-painted-interior': STEAMBOT_PAINTED_INTERIOR_STYLE,
  },

  promptPrefixByMedium: {
    // gpt-image-2 clean: replace the "impossibly-detailed" bot prefix
    // with a minimal content anchor. The GPT_CLEAN mediumStyle carries
    // the actual register.
    steambot_gpt_clean: 'steampunk Victorian scene',
    'steambot-hyperreal': blocks.PROMPT_PREFIX,
    'steambot-painted-woman': blocks.PROMPT_PREFIX,
    'steambot-painted-man': blocks.PROMPT_PREFIX,
    'steambot-painted-interior': blocks.PROMPT_PREFIX,
  },
  promptSuffixByMedium: {
    'steambot-hyperreal': blocks.PROMPT_SUFFIX,
    'steambot-painted-woman': blocks.PROMPT_SUFFIX,
    'steambot-painted-man': blocks.PROMPT_SUFFIX,
    'steambot-painted-interior': blocks.PROMPT_SUFFIX,
  },

  // Single-vibe lock for scene paths. Female path overrides with vibesByPath.
  vibes: ['cinematic'],

  vibesByPath: {
    'sexy-steampunk-woman': [
      'cinematic',
      'dark',
      'epic',
      'nostalgic',
      'peaceful',
      'whimsical',
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
    'steampunk-man': [
      'cinematic',
      'dark',
      'epic',
      'nostalgic',
      'peaceful',
      'whimsical',
      'ethereal',
      'arcane',
      'ancient',
      'enchanted',
      'fierce',
      'voltage',
      'nightshade',
      'macabre',
      'shimmer',
      'surreal',
    ],
    // airship-female: action-leaning subset (drop peaceful/cozy/nostalgic
    // vibes that conflict with combat / mid-action register; keep dark /
    // epic / fierce / cinematic / voltage that amplify).
    'airship-female': [
      'cinematic',
      'dark',
      'epic',
      'fierce',
      'voltage',
      'arcane',
      'ancient',
      'macabre',
      'nightshade',
      'shimmer',
      'surreal',
    ],
    // airship-male: same action-leaning subset as airship-female.
    'airship-male': [
      'cinematic',
      'dark',
      'epic',
      'fierce',
      'voltage',
      'arcane',
      'ancient',
      'macabre',
      'nightshade',
      'shimmer',
      'surreal',
    ],
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // Per-path overrides — keep tiny. Long prefixes shove Sonnet's ethnicity
  // tokens past Flux's attention zone; main proves short stack = diversity.
  // 2026-05-15 — emptied steampunk-man wrapper after migration to canonical
  // composer (per playbook wrapper-strip lesson; the new template handles
  // ethnicity/feature locking via the gender-locked compact bio).
  promptPrefixByPath: {},
  promptSuffixByPath: {},

  paths: [
    'steampunk-scene',
    'airship-skies',
    'airship-female',
    'airship-male',
    'steampunk-curio',
    'sexy-steampunk-woman',
    'steampunk-man',
    'steampunk-spectacle',
    'steam-transport',
    'cozy-steampunk',
    'steampunk-labs',
  ],

  // Flat rotation (2026-05-26): equal weight per path — every path posts
  // once per cycle in randomized order via the cycleAllPaths shuffle-bag.
  cycleAllPaths: true,

  chaos: {
    enabled: true,
    skipPaths: [],
    allowSubjectChaosPaths: [
      'steampunk-scene',
      'airship-skies',
      'steampunk-curio',
      'steampunk-spectacle',
      'steam-transport',
      'steampunk-labs',
    ],
  },
  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '65-90',
    // sexy-steampunk-woman + steampunk-man skip polish — Haiku compression
    // was stripping skin/eyes/makeup/hair DNA, leaving only the ethnicity
    // noun. Single-pass Sonnet preserves the full DNA stack. Per playbook
    // 2026-05-15 lesson: two-pass polish OFF for all new-axis paths.
    skipPaths: [
      'sexy-steampunk-woman',
      'steampunk-man',
      'airship-female',
      'airship-male',
      'airship-skies',
      'steampunk-curio',
      'steampunk-scene',
      'steampunk-spectacle',
      'steam-transport',
      'cozy-steampunk',
      'steampunk-labs',
    ],
    polishedWordsByPath: {
      'sexy-steampunk-woman': '80-110',
      'steampunk-man': '80-110',
      'airship-female': '80-110',
    },
    preservePhrasesByPath: {
      'steampunk-man': [
        'Black',
        'Mahogany',
        'Sepia',
        'Persian',
        'Indian',
        'Asian',
        'Mediterranean',
        'Greek',
        'Italian',
        'Egyptian',
        'Moroccan',
        'Caribbean',
        'man with',
        'eyes',
        'mustache',
        'beard',
        'clean-shaven',
        'mutton chops',
        'handlebar',
        'Van Dyke',
        'goatee',
        'salt-and-pepper',
        'silver',
        'iron-grey',
        'auburn',
        'sandy-blond',
        'pomaded',
        'shaved',
        'queue',
        'amber',
        'olive-green',
        'ice-blue',
        'steel-grey',
        'pewter',
      ],
      'sexy-steampunk-woman': [
        // Ethnicity / skin tokens
        'Black',
        'African',
        'Senegalese',
        'Ethiopian',
        'Caribbean',
        'Afro',
        'East Asian',
        'Chinese',
        'Japanese',
        'Korean',
        'Vietnamese',
        'Thai',
        'South Asian',
        'Indian',
        'Pakistani',
        'Sri Lankan',
        'Bangladeshi',
        'Persian',
        'Arab',
        'Middle Eastern',
        'Levantine',
        'Egyptian',
        'Moroccan',
        'Latin',
        'Latina',
        'Mexican',
        'Mestiza',
        'Hispanic',
        'Indigenous',
        'Native',
        'Navajo',
        'Polynesian',
        'Maori',
        'Hawaiian',
        'Pacific Islander',
        'Mediterranean',
        'Greek',
        'Italian',
        'Spanish',
        'Sicilian',
        'European',
        'English',
        'Nordic',
        'Celtic',
        'Irish',
        'Scottish',
        // Skin tone descriptors
        'cocoa',
        'mahogany',
        'ebony',
        'sepia',
        'walnut-brown',
        'caramel',
        'wheat',
        'olive',
        'porcelain',
        'ivory',
        'alabaster',
        'bronze',
        'copper',
        'jade',
        'amber',
        // Hair color tokens
        'raven',
        'jet-black',
        'auburn',
        'copper-red',
        'ginger',
        'platinum',
        'silver',
        'flax-blonde',
        'honey-blonde',
        'salt-and-pepper',
        // Eye color tokens
        'amber',
        'jade',
        'sage-green',
        'ice-blue',
        'violet',
        'hazel',
        'tawny',
        'antique-bronze',
        'steel-grey',
      ],
    },
  },
  sensoryAnchors: {
    enabled: true,
    requiredChannels: ['lightcolor'],
    pathContext: {
      // Switched 'female'→'scene' 2026-05-15 to escape body-coded sensory
      // anchors ("tight around her throat", "corset constricting her ribs",
      // "weight on her hips") that were triggering Replicate NSFW filter on
      // ~40% of renders. Scene context uses environment-coded sensory
      // (steam-heat / brass-cold / etc.) — clean.
      'sexy-steampunk-woman': 'scene',
      // steampunk-man also routed to 'scene' 2026-05-15 to avoid body-coded
      // male-touch sensory anchors potentially feeding NSFW filter triggers.
      'steampunk-man': 'scene',
      // airship-female routed to 'scene' (same NSFW-filter reasoning as
      // sexy-steampunk-woman/steampunk-man — body-coded sensory anchors
      // were tripping Replicate on ~40% of female renders).
      'airship-female': 'scene',
      'airship-male': 'scene',
      'steampunk-scene': 'scene',
      'airship-skies': 'scene',
      'steampunk-curio': 'scene',
      'steampunk-spectacle': 'scene',
      'steam-transport': 'scene',
      'steampunk-labs': 'scene',
    },
    poolsByContextAndChannel: pools.SENSORY_POOLS,
  },

  // Bot-level pool defaults for declarative axis paths (composer reads these
  // when a path config doesn't override the slot).
  defaultPools: {
    lighting: 'LIGHTING',
    atmosphere: 'STEAMPUNK_ATMOSPHERES',
  },

  poolByName(name) {
    if (!(name in pools)) {
      throw new Error(`SteamBot.poolByName: unknown pool "${name}"`);
    }
    return pools[name];
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`SteamBot: unknown path "${path}"`);
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
    throw new Error(`SteamBot: path "${path}" has invalid export shape`);
  },

  caption({ path }) {
    return `[${path}] SteamBot`;
  },
};
