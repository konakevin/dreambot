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
// Render-quality only — the steampunk/gaslit identity comes from PROMPT_PREFIX,
// so this fragment must NOT repeat it (the two were doubling ~30 words of
// "gorgeous steampunk illustration, warm gaslit" onto every prompt).
const STEAMBOT_HYPERREAL_STYLE =
  'cinematic painted depth, crisp readable detail across the frame, rich warm color';

// Bespoke medium for sexy-steampunk-woman — vivid painted character
// illustration. Modern digital painted character art lineage (Artgerm / WLOP
// / Loish / Stanley Lau / Sakimichan / Jia Xing) — lush saturated painterly
// finish, soft painterly brushwork on skin with cinematic lighting, full
// tonal range. NOT hyperreal CGI (CG-precision precision is what we DON'T
// want), NOT watercolor on paper, NOT Mucha/art-nouveau decorative borders,
// NOT anime. Painted character art with idealized proportions + ornate
// detail + saturated jewel-tones + dramatic cinematic light.
const STEAMBOT_PAINTED_WOMAN_STYLE =
  'lush oil-painted character illustration, visible painterly brushwork, saturated jewel-toned pigment, dramatic cinematic light with golden rim-light, painted-fantasy-cover finish';

// Bespoke medium for steampunk-man — same oil-painted-illustration register
// as the female path but with its own named medium so the male path stays
// architecturally isolated (no cross-pollution). Frazetta / Brom / Vallejo
// painted-fantasy-cover lineage; tuned for handsome / dashing / rugged
// gentleman portraits, never seductive.
const STEAMBOT_PAINTED_MAN_STYLE =
  'lush oil-painted character illustration, visible painterly brushwork, saturated jewel-toned pigment, dramatic cinematic light with golden rim-light, painted-fantasy-cover finish';

// Bespoke medium for cozy-steampunk path — same lush painted-illustration
// register as the painted-woman medium, but tuned for INTERIORS not
// female-figure-on-cover. Swaps the Frazetta/Brom/Vallejo lineage (which
// bakes in pin-up/cheesecake bias) for painters with the same opulent
// painted-fantasy atmosphere on INTERIORS / WORLDS: Maxfield Parrish
// (golden atmospheric), James Gurney Dinotopia (lush painted worldbuilding
// of fantasy interiors and architecture), James Christensen (ornate
// intricate fantasy detail), N.C. Wyeth (classic illustration depth).
const STEAMBOT_PAINTED_INTERIOR_STYLE =
  'lush oil-painted steampunk-interior illustration, visible painterly brushwork, golden atmospheric warmth, saturated jewel-toned pigment, ornate brass-and-clockwork detail, painted-worldbuilding depth';

// Grounded de-cheesed character medium (A/B test 2026-06-30). Painted feel but
// NOT the romance-cover register — naturalistic, matte, gritty, documentary.
// Drops golden-rim-light / jewel-tone / fantasy-cover glamour that made the
// character paths read as paperback covers.
const STEAMBOT_GROUNDED_PAINTED_STYLE =
  'grounded painterly steampunk illustration, naturalistic muted earthy palette, matte finish, lived-in grit and material wear, tactile realistic brass and iron and wood and leather, soft naturalistic directional light, documentary realism in a painted register';

// "Medium Looks" system (2026-06-30) — GothBot/MangaBot pattern. One
// composition-NEUTRAL medium locks the steampunk-world identity; a per-render
// LOOK (rolled in rollSharedDNA, prepended in buildBrief) supplies the render
// style. Replaces the per-path painted-woman/man/interior + hyperreal mediums
// so the bot rolls a dynamic range of treatments instead of one locked look.
const STEAMBOT_NEUTRAL_STYLE =
  'richly detailed steampunk Victorian-industrial imagery — brass, copper, riveted iron, exposed gears, pipework, glass gauges, oiled wood and gaslight, an 1800s world of impossible clockwork engineering; render exactly the scene and composition the brief describes — the art-style, medium, palette and finish are set entirely by the LOOK at the top of the prompt';

// Paths that roll a look (all of them) — routed to steambot_neutral below and
// receive the look-override in buildBrief.
const STEAMBOT_LOOK_PATHS = new Set([
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
]);

// Per-render LOOK override block, prepended to the brief in buildBrief. Strong
// STYLE-AUTHORITY wording (MangaBot lesson) so it beats any baked style phrase
// ("lush painted key-art" / "cinematic") still living in a template.
function lookOverride(look) {
  if (!look) return '';
  return `━━━ RENDER LOOK (AUTHORITY — open your Flux prompt with this; render EVERYTHING in this style) ━━━
${look}

This LOOK is the authority on rendering style. It OVERRIDES any other art-style, medium, palette, or finish wording anywhere below (e.g. "lush painted key-art", "oil-painted", "cinematic painted depth"). Keep the scene content, characters, composition, and every rule exactly as written — but render all of it in THIS look. Open your Flux prompt with these look tokens.

`;
}

module.exports = {
  username: 'steambot',
  displayName: 'SteamBot',

  useModelPicker: true,
  // flux-2-pro BANNED bot-wide 2026-06-07 (Kevin).
  // nano-banana (google/gemini-2-image) + flux-2-flex BANNED bot-wide
  // 2026-06-12 (Kevin). Lineup is now Flux 1.1 Pro / Pro Ultra + GPT-Image-2.
  allowedModels: ['black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-1.1-pro-ultra'],

  // modelByPath: per-path bans. Character paths (airship-female/male,
  // sexy-steampunk-woman, steampunk-man) are Flux-only (GPT-2 dropped there
  // historically); non-character paths get GPT-2 + the Flux 1.1 family.
  modelByPath: {
    // ── Character paths — Flux 1.1 family only.
    'airship-female': ['black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-1.1-pro-ultra'],
    'airship-male': ['black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-1.1-pro-ultra'],
    'sexy-steampunk-woman': [
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    'steampunk-man': ['black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-1.1-pro-ultra'],
    'steampunk-scene': ['black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-1.1-pro-ultra'],
    'airship-skies': ['black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-1.1-pro-ultra'],
    'steampunk-curio': ['black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-1.1-pro-ultra'],
    'steampunk-spectacle': [
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    'steam-transport': ['black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-1.1-pro-ultra'],
    'steampunk-labs': ['black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-1.1-pro-ultra'],
    'cozy-steampunk': ['black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-1.1-pro-ultra'],
  },

  // SteamBot's custom medium keys. Bot-internal — do NOT exist in
  // dream_mediums DB. Scene paths use steambot-hyperreal; female path uses
  // steambot-painted-woman (painterly-photographic character portraiture).
  mediums: ['steambot-hyperreal'],

  // cleanMediumByModel: gpt-image-2 renders the bot-only 'steambot_gpt_clean'
  // medium + minimal prefix. Strips the "impossibly-detailed" anchor that pulls
  // it into abstract ornamental plates. (nano-banana entry removed 2026-06-12
  // when the model was banned bot-wide.)
  cleanMediumByModel: {},

  // Looks system (2026-06-30): every look-enabled path routes to the
  // composition-neutral medium; the per-render LOOK supplies the render style.
  // (Replaced the per-path painted-woman/man/interior + default-hyperreal
  // mediums so the bot rolls a dynamic range of treatments.)
  mediumByPath: Object.fromEntries([...STEAMBOT_LOOK_PATHS].map((p) => [p, 'steambot_neutral'])),

  mediumStyles: {
    // gpt-image-2 clean (routed via mediumByModel above). Pulls GPT-Image-2
    // out of the abstract-plate prior the heavy steampunk illustration
    // anchors trigger. Mirrors mystical-mermaid (2026-06-05).
    steambot_gpt_clean: blocks.GPT_CLEAN,
    'steambot-hyperreal': STEAMBOT_HYPERREAL_STYLE,
    steambot_neutral: STEAMBOT_NEUTRAL_STYLE,
    'steambot-grounded-painted': STEAMBOT_GROUNDED_PAINTED_STYLE,
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
    // Neutral medium: tight CONTENT-only anchor (no style/palette tokens) so the
    // rolled LOOK leads the CLIP anchor.
    steambot_neutral: 'steampunk illustration, Victorian-industrial clockwork machinery',
    'steambot-grounded-painted':
      'steampunk scene, brass and copper clockwork machinery, Victorian-industrial, working gaslit atmosphere',
    'steambot-painted-woman': blocks.PROMPT_PREFIX,
    'steambot-painted-man': blocks.PROMPT_PREFIX,
    'steambot-painted-interior': blocks.PROMPT_PREFIX,
  },
  promptSuffixByMedium: {
    'steambot-hyperreal': blocks.PROMPT_SUFFIX,
    steambot_neutral: blocks.PROMPT_SUFFIX,
    'steambot-grounded-painted': blocks.PROMPT_SUFFIX,
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
      'voltage',
      'nightshade',
      'macabre',
      'shimmer',
      'surreal',
    ],
    // airship-female: action-leaning subset (drop peaceful/cozy/nostalgic
    // vibes that conflict with combat / mid-action register; keep dark /
    // epic / cinematic / voltage that amplify). fierce banned 2026-06-28 (Kevin).
    'airship-female': [
      'cinematic',
      'dark',
      'epic',
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
    // 2026-06-12 cleanup — labs + spectacle are already maximally dense with
    // their own built-in identity (multi-color glow / crowd-event). Chaos was
    // injecting extra subjects + surreal geometry ("stairs that resolve into
    // nothing") that read as crammed/confusing. Skip chaos on those two.
    skipPaths: ['steampunk-labs', 'steampunk-spectacle'],
    allowSubjectChaosPaths: [
      'steampunk-scene',
      'airship-skies',
      'steampunk-curio',
      'steam-transport',
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
      lookRegister: picker.pickWithRecency(pools.STEAMBOT_LOOK_REGISTER, 'look_register'),
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`SteamBot: unknown path "${path}"`);
    let brief;
    if (typeof builder === 'function') {
      brief = builder({ sharedDNA, vibeDirective, vibeKey, picker });
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
      throw new Error(`SteamBot: path "${path}" has invalid export shape`);
    }
    // Looks system: prepend the rolled LOOK override on look-enabled paths.
    if (STEAMBOT_LOOK_PATHS.has(path) && sharedDNA && sharedDNA.lookRegister) {
      brief = lookOverride(sharedDNA.lookRegister) + brief;
    }
    return brief;
  },

  caption({ path }) {
    return `[${path}] SteamBot`;
  },
};
