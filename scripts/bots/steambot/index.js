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

const pathBuilders = {
  'steampunk-scene': require('./paths/steampunk-scene'),
  'airship-skies': require('./paths/airship-skies'),
  'steampunk-curio': require('./paths/steampunk-curio'),
  'sexy-steampunk-woman': require('./paths/sexy-steampunk-woman'),
  'steampunk-man': require('./paths/steampunk-man'),
  'steampunk-spectacle': require('./paths/steampunk-spectacle'),
  'steam-transport': require('./paths/steam-transport'),
  'cozy-steampunk': require('./paths/cozy-steampunk'),
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
  allowedModels: ['black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-dev'],

  modelByPath: {
    'steampunk-scene':       { 'black-forest-labs/flux-1.1-pro': 100 },
    'airship-skies':         { 'black-forest-labs/flux-1.1-pro': 100 },
    'steampunk-curio':       { 'black-forest-labs/flux-1.1-pro': 100 },
    // Female path locked to flux-1.1-pro 2026-05-15. Two-model rotation
    // (flux-dev + flux-1.1-pro) produced inconsistent register — flux-dev
    // anime/cartoony, flux-1.1-pro photoreal-painterly. Single-model lock
    // matches the rest of the bot.
    'sexy-steampunk-woman':  { 'black-forest-labs/flux-1.1-pro': 100 },
    'steampunk-man':         { 'black-forest-labs/flux-1.1-pro': 100 },
    'steampunk-spectacle':   { 'black-forest-labs/flux-1.1-pro': 100 },
    'steam-transport':       { 'black-forest-labs/flux-1.1-pro': 100 },
    'cozy-steampunk':        { 'black-forest-labs/flux-1.1-pro': 100 },
  },

  // SteamBot's custom medium keys. Bot-internal — do NOT exist in
  // dream_mediums DB. Scene paths use steambot-hyperreal; female path uses
  // steambot-painted-woman (painterly-photographic character portraiture).
  mediums: ['steambot-hyperreal'],

  mediumByPath: {
    'sexy-steampunk-woman': 'steambot-painted-woman',
    'steampunk-man': 'steambot-painted-man',
    'cozy-steampunk': 'steambot-painted-interior',
  },

  mediumStyles: {
    'steambot-hyperreal': STEAMBOT_HYPERREAL_STYLE,
    'steambot-painted-woman': STEAMBOT_PAINTED_WOMAN_STYLE,
    'steambot-painted-man': STEAMBOT_PAINTED_MAN_STYLE,
    'steambot-painted-interior': STEAMBOT_PAINTED_INTERIOR_STYLE,
  },

  promptPrefixByMedium: {
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
      'cinematic', 'dark', 'epic', 'nostalgic', 'peaceful', 'whimsical',
      'ethereal', 'arcane', 'ancient', 'enchanted', 'fierce', 'coquette',
      'voltage', 'nightshade', 'macabre', 'shimmer', 'surreal',
    ],
    'steampunk-man': [
      'cinematic', 'dark', 'epic', 'nostalgic', 'peaceful', 'whimsical',
      'ethereal', 'arcane', 'ancient', 'enchanted', 'fierce',
      'voltage', 'nightshade', 'macabre', 'shimmer', 'surreal',
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
    'steampunk-curio',
    'sexy-steampunk-woman',
    'steampunk-man',
    'steampunk-spectacle',
    'steam-transport',
    'cozy-steampunk',
  ],

  pathWeights: {
    'steampunk-scene': 2,
    'airship-skies': 2,
    'steampunk-curio': 2,
    'sexy-steampunk-woman': 2,
    'steampunk-man': 2,
    'steampunk-spectacle': 1,
    'steam-transport': 2,
    'cozy-steampunk': 2,
  },

  chaos: { enabled: true, skipPaths: [], allowSubjectChaosPaths: ['steampunk-scene','airship-skies','steampunk-curio','steampunk-spectacle','steam-transport'] },
  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '65-90',
    // sexy-steampunk-woman + steampunk-man skip polish — Haiku compression
    // was stripping skin/eyes/makeup/hair DNA, leaving only the ethnicity
    // noun. Single-pass Sonnet preserves the full DNA stack. Per playbook
    // 2026-05-15 lesson: two-pass polish OFF for all new-axis paths.
    skipPaths: ['sexy-steampunk-woman', 'steampunk-man', 'airship-skies', 'steampunk-curio', 'steampunk-scene', 'steampunk-spectacle', 'steam-transport', 'cozy-steampunk'],
    polishedWordsByPath: { 'sexy-steampunk-woman': '80-110', 'steampunk-man': '80-110' },
    preservePhrasesByPath: {
      'steampunk-man': [
        'Black', 'Mahogany', 'Sepia', 'Persian', 'Indian', 'Asian', 'Mediterranean', 'Greek', 'Italian', 'Egyptian', 'Moroccan', 'Caribbean',
        'man with', 'eyes',
        'mustache', 'beard', 'clean-shaven', 'mutton chops', 'handlebar', 'Van Dyke', 'goatee',
        'salt-and-pepper', 'silver', 'iron-grey', 'auburn', 'sandy-blond', 'pomaded', 'shaved', 'queue',
        'amber', 'olive-green', 'ice-blue', 'steel-grey', 'pewter',
      ],
      'sexy-steampunk-woman': [
        // Ethnicity / skin tokens
        'Black', 'African', 'Senegalese', 'Ethiopian', 'Caribbean', 'Afro',
        'East Asian', 'Chinese', 'Japanese', 'Korean', 'Vietnamese', 'Thai',
        'South Asian', 'Indian', 'Pakistani', 'Sri Lankan', 'Bangladeshi',
        'Persian', 'Arab', 'Middle Eastern', 'Levantine', 'Egyptian', 'Moroccan',
        'Latin', 'Latina', 'Mexican', 'Mestiza', 'Hispanic',
        'Indigenous', 'Native', 'Navajo', 'Polynesian', 'Maori', 'Hawaiian', 'Pacific Islander',
        'Mediterranean', 'Greek', 'Italian', 'Spanish', 'Sicilian',
        'European', 'English', 'Nordic', 'Celtic', 'Irish', 'Scottish',
        // Skin tone descriptors
        'cocoa', 'mahogany', 'ebony', 'sepia', 'walnut-brown', 'caramel', 'wheat', 'olive', 'porcelain', 'ivory', 'alabaster', 'bronze', 'copper', 'jade', 'amber',
        // Hair color tokens
        'raven', 'jet-black', 'auburn', 'copper-red', 'ginger', 'platinum', 'silver', 'flax-blonde', 'honey-blonde', 'salt-and-pepper',
        // Eye color tokens
        'amber', 'jade', 'sage-green', 'ice-blue', 'violet', 'hazel', 'tawny', 'antique-bronze', 'steel-grey',
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
      'steampunk-scene': 'scene',
      'airship-skies': 'scene', 'steampunk-curio': 'scene',
      'steampunk-spectacle': 'scene', 'steam-transport': 'scene',
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
