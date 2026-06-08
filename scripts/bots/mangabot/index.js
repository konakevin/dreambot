/**
 * MangaBot — the bot-engine contract.
 *
 * Japanese culture + anime aesthetic full spectrum. Ghibli/Shinkai/Demon-Slayer
 * + traditional Japan + mythology + Neo-Tokyo cyberpunk. Hand-drawn anime
 * illustration. Characters by role only.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');
const { ALL_ENABLED_AI_MODELS } = require('../../lib/imageModels');

const pathBuilders = {
  // Bespoke axis-system paths (Wave 1-4 overhaul 2026-05-29..30):
  'mythological-creature': require('./paths/mythological-creature'),
  kawaii: require('./paths/kawaii'),
  'slice-of-life': require('./paths/slice-of-life'),
  'neo-tokyo': require('./paths/neo-tokyo'),
  'shonen-action': require('./paths/shonen-action'),
  'samurai-era': require('./paths/samurai-era'),
  'isekai-fantasy': require('./paths/isekai-fantasy'),
  'anime-village': require('./paths/anime-village'),
  'anime-character-female': require('./paths/anime-character-female'),
  'anime-character-male': require('./paths/anime-character-male'),
  'mecha-hangars': require('./paths/mecha-hangars'),
  'festival-nights': require('./paths/festival-nights'),
  'magical-girl': require('./paths/magical-girl'),
  'ghibli-countryside': require('./paths/ghibli-countryside'),
  'occult-tokyo': require('./paths/occult-tokyo'),
  'post-apocalyptic': require('./paths/post-apocalyptic'),
  'beach-episode': require('./paths/beach-episode'),
  'rooftop-sunsets': require('./paths/rooftop-sunsets'),
  'cherry-blossom-romance': require('./paths/cherry-blossom-romance'),
  'space-opera': require('./paths/space-opera'),
  // SDXL-aesthetic revival path (Phase 2.19, 2026-05-30):
  'ghibli-painterly': require('./paths/ghibli-painterly'),
};

module.exports = {
  username: 'mangabot',
  displayName: 'MangaBot',

  mediums: ['anime'],

  useModelPicker: true,
  // Banned 2026-06-02: openai/gpt-image-2 (Kevin heart-ban).
  // Banned 2026-06-02: flux-2-flex (Kevin heart-ban).
  allowedModels: ALL_ENABLED_AI_MODELS.filter(
    (m) => m !== 'openai/gpt-image-2' && m !== 'black-forest-labs/flux-2-flex'
  ),

  // Single 'anime' medium — pin heavy on anime-friendly vibes
  vibesByMedium: {
    anime: ['enchanted', 'cinematic', 'epic', 'ethereal', 'whimsical', 'arcane'],
  },

  // nano-banana clean-render override (2026-06-07). Banana reads the anime
  // medium/prefix as "go abstract"; the clean medium (+ empty
  // promptPrefixByMedium) keeps a readable anime scene. gpt-image-2 stays
  // banned (see allowedModels) — re-enabling it later would reuse this medium.
  mediumStyles: {
    mangabot_gpt_clean: blocks.GPT_CLEAN,
    // "Looks" medium (2026-06-07) — locks anime IDENTITY, defers the specific
    // art-style to the rolled sharedDNA.lookRegister. See shared-blocks.js.
    mangabot_anime_neutral: blocks.ANIME_NEUTRAL,
  },
  cleanMediumByModel: {
    'google/gemini-2-image': { medium: 'mangabot_gpt_clean' },
  },

  // ── "Looks" axis (2026-06-07) — full rollout, 17 of 21 paths ───────────
  // The look-enabled paths route to mangabot_anime_neutral so the bot-wide
  // PROMPT_PREFIX Ghibli/Shinkai/KyoAni style lock is bypassed and the rolled
  // sharedDNA.lookRegister leads CLIP (one of 12 anime sub-styles per render).
  // EXCLUDED (stay on the 'anime' medium — their identity IS a fixed style):
  // ghibli-countryside, ghibli-painterly (SDXL-locked), slice-of-life, samurai-era.
  // Validated on 4 MVP paths (20 renders, 0 fails, Kevin "10/10") before this
  // rollout to the remaining 13. Playbook: "Medium Looks" 2ND PROVEN BOT section.
  // NOTE: mangabot_anime_neutral's dream_mediums.allowed_models is FLUX-ONLY
  // (no nano-banana) — so the picker never rolls banana on look paths and the
  // cleanMediumByModel banana→gpt_clean swap (which would skip the look) never
  // fires here. Banana still serves the 4 style-locked paths via 'anime'.
  mediumByPath: {
    'neo-tokyo': 'mangabot_anime_neutral',
    'shonen-action': 'mangabot_anime_neutral',
    'isekai-fantasy': 'mangabot_anime_neutral',
    'anime-character-female': 'mangabot_anime_neutral',
    'anime-character-male': 'mangabot_anime_neutral',
    'mythological-creature': 'mangabot_anime_neutral',
    kawaii: 'mangabot_anime_neutral',
    'anime-village': 'mangabot_anime_neutral',
    'mecha-hangars': 'mangabot_anime_neutral',
    'festival-nights': 'mangabot_anime_neutral',
    'magical-girl': 'mangabot_anime_neutral',
    'occult-tokyo': 'mangabot_anime_neutral',
    'post-apocalyptic': 'mangabot_anime_neutral',
    'beach-episode': 'mangabot_anime_neutral',
    'rooftop-sunsets': 'mangabot_anime_neutral',
    'cherry-blossom-romance': 'mangabot_anime_neutral',
    'space-opera': 'mangabot_anime_neutral',
  },

  promptPrefixByMedium: {
    mangabot_gpt_clean: '',
    // Tight anchor that REPLACES the bot's Ghibli/Shinkai PROMPT_PREFIX so the
    // rolled look leads. Empty would be falsy → fall through to PROMPT_PREFIX.
    mangabot_anime_neutral: 'anime illustration',
  },
  promptSuffixByMedium: {
    // Drop the bot PROMPT_SUFFIX's "soft bloom / filmic color grading" tail —
    // it would smother flat-gouache / retro-cel / shonen-ink looks. Keep only
    // a neutral detail anchor + the no-text guardrail; the look carries finish.
    mangabot_anime_neutral:
      'detailed anime rendering, no text no words no watermarks no logos no frame borders',
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // Inverts old excludeVibes (ancient/fierce/psychedelic/minimal).
  vibes: [
    'cinematic',
    'dark',
    'cozy',
    'epic',
    'nostalgic',
    'peaceful',
    'whimsical',
    'ethereal',
    'arcane',
    'enchanted',
    'coquette',
    'voltage',
    'nightshade',
    'macabre',
    'shimmer',
    'surreal',
  ],

  paths: [
    'mythological-creature',
    'kawaii',
    'slice-of-life',
    'neo-tokyo',
    'shonen-action',
    'samurai-era',
    'isekai-fantasy',
    'anime-village',
    'anime-character-female',
    'anime-character-male',
    'mecha-hangars',
    'festival-nights',
    'magical-girl',
    'ghibli-countryside',
    'occult-tokyo',
    'post-apocalyptic',
    'beach-episode',
    'rooftop-sunsets',
    'cherry-blossom-romance',
    'space-opera',
    'ghibli-painterly',
  ],

  // ghibli-painterly: locked to SDXL. The 2026-05-30 bake-off conclusion was
  // wrong — flux-1.1-pro renders this aesthetic too tight / illustrated, losing
  // the LOOSE HAND-PAINTED brushwork + storybook softness that defined Kevin's
  // 37 hearted SDXL-era renders. SDXL R0 batch confirmed the looser feel is the
  // whole point. Trade-off: ~3x slower (10-18s vs 5s), PNG output (heavier).
  modelByPath: {
    'ghibli-painterly': 'sdxl',
  },

  // Flat rotation (2026-05-26): equal weight per path — every path posts
  // once per cycle in randomized order via the cycleAllPaths shuffle-bag.
  cycleAllPaths: true,

  chaos: {
    enabled: true,
    skipPaths: [],
    allowSubjectChaosPaths: [
      'neo-tokyo',
      'isekai-fantasy',
      'anime-village',
      'mythological-creature',
      'mecha-hangars',
      'occult-tokyo',
      'post-apocalyptic',
      'space-opera',
      'ghibli-countryside',
      'ghibli-painterly',
      'festival-nights',
      'rooftop-sunsets',
    ],
  },

  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '65-90',
    // Axis-system paths skip polish per playbook lesson
    // `feedback_axis_system_skip_polish` — Haiku polish strips the rolled
    // camera_framing axis content + CAMERA_FRAMING_MANDATORY_BLOCK text +
    // per-template anti-back-to-camera mandates when compressing the
    // 150-word Sonnet concept down to 65-110 words. Without polish, the
    // rolled axis language reaches Flux intact. Validated 2026-05-29:
    // R1 housekeeping test showed 3 of 5 isekai-fantasy renders dropped
    // back to back-to-camera despite the rewritten templates because
    // Haiku had stripped the camera_framing description entirely.
    skipPaths: [
      'isekai-fantasy',
      'ghibli-countryside',
      'neo-tokyo',
      'samurai-era',
      'anime-character-female',
      'anime-character-male',
      'magical-girl',
      'shonen-action',
      'kawaii',
      'slice-of-life',
      'cherry-blossom-romance',
      'rooftop-sunsets',
      'occult-tokyo',
      'post-apocalyptic',
      'beach-episode',
      'festival-nights',
      'anime-village',
      'mecha-hangars',
      'mythological-creature',
      'space-opera',
      'ghibli-painterly',
    ],
    polishedWordsByPath: {
      // Character-rich paths need extra word budget for archetype + outfit + setting + vista
      'anime-character-female': '90-130',
      'anime-character-male': '90-130',
      // Density-mandated paths — extra room for 8+ micro-details + 2+ atmosphere + 2+ lighting
      kawaii: '80-110',
      'slice-of-life': '80-110',
      'shonen-action': '80-110',
      'samurai-era': '80-110',
      'mythological-creature': '80-110',
      'mecha-hangars': '80-110',
      'festival-nights': '80-110',
      'magical-girl': '80-110',
      'ghibli-countryside': '80-110',
      'occult-tokyo': '80-110',
      'post-apocalyptic': '80-110',
      'beach-episode': '80-110',
      'rooftop-sunsets': '80-110',
      'cherry-blossom-romance': '80-110',
      'space-opera': '80-110',
      underwater: '80-110',
    },
    preservePhrasesByPath: {},
  },

  sensoryAnchors: {
    enabled: true,
    requiredChannels: ['lightcolor'],
    pathContext: {
      // Female-coded paths
      kawaii: 'female',
      'slice-of-life': 'female',
      'cherry-blossom-romance': 'female',
      'magical-girl': 'female',
      'anime-character-female': 'female',
      // Male-coded paths
      'shonen-action': 'male',
      'samurai-era': 'male',
      'anime-character-male': 'male',
      // Creature-coded
      'mythological-creature': 'creature',
      // Scene-coded (no specific gender for sensory anchors)
      'anime-village': 'scene',
      'neo-tokyo': 'scene',
      'isekai-fantasy': 'scene',
      'food-anime': 'scene',
      'mecha-hangars': 'scene',
      'festival-nights': 'scene',
      'ghibli-countryside': 'scene',
      'occult-tokyo': 'scene',
      'post-apocalyptic': 'scene',
      'beach-episode': 'scene',
      'rooftop-sunsets': 'scene',
      'space-opera': 'scene',
      underwater: 'scene',
    },
    poolsByContextAndChannel: pools.SENSORY_POOLS,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
      // Bot-wide anime look (2026-06-07). Rolled for every path but only
      // CONSUMED by look-enabled templates (they lead their Sonnet brief with
      // it). Non-injected templates ignore it — harmless. recency-aware so the
      // same look doesn't cluster across consecutive renders.
      lookRegister: picker
        ? picker.pickWithRecency(pools.MANGABOT_LOOK_REGISTER, 'look_register')
        : pools.MANGABOT_LOOK_REGISTER[0],
    };
  },

  // Bot-level pool defaults for declarative axis paths. The composer
  // resolves a slot via path-override → bot-default → throw. Adding these
  // lets axis paths declare `universal: ['lighting', 'atmosphere']`
  // without each path having to wire its own lighting/atmosphere pool.
  defaultPools: {
    lighting: 'LIGHTING',
    atmosphere: 'ATMOSPHERES',
  },

  poolByName(name) {
    if (!(name in pools)) {
      throw new Error(`MangaBot.poolByName: unknown pool "${name}"`);
    }
    return pools[name];
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`MangaBot: unknown path "${path}"`);
    // Axis-system path — declarative { archetype, pools }
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
    // Legacy inline-builder path
    if (typeof builder === 'function') {
      return builder({ sharedDNA, vibeDirective, vibeKey, picker });
    }
    throw new Error(`MangaBot: path "${path}" has invalid export shape`);
  },

  caption({ path }) {
    return `[${path}] MangaBot`;
  },
};
