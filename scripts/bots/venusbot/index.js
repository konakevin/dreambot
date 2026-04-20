/**
 * VenusBot — the bot-engine contract.
 *
 * Character: cyborg-assassin woman, half-human half-machine, honeytrap
 * predator. Exotic, exquisite, cold. 6 render paths rolled per cron.
 *
 * Entry: the engine calls rollSharedDNA + buildBrief per render. Bot
 * never calls Sonnet, Flux, or Supabase directly — all that lives in
 * scripts/lib/botEngine.js.
 *
 * See docs/MIGRATE-BOT.md for the bot-module contract.
 */

const fs = require('fs');
const path = require('path');
const pools = require('./pools');
const blocks = require('./shared-blocks');

// Load Sonnet-authored seed pools once at require time
const CHARACTER_BASES = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'seeds', 'characters.json'), 'utf8')
);

// Per-path brief builders
const pathBuilders = {
  closeup: require('./paths/closeup'),
  'full-body': require('./paths/full-body'),
  seduction: require('./paths/seduction'),
  'cyborg-fashion': require('./paths/cyborg-fashion'),
  stare: require('./paths/stare'),
  robot: require('./paths/robot'),
};

module.exports = {
  // ── Identity ──
  username: 'venusbot',
  displayName: 'VenusBot',

  // ── Medium: VenusBot is hardcoded to 'surreal' (a bot-only medium that
  //    never appears in dream_mediums so users can't select it). This
  //    unique medium string is how VenusBot's posts tag in the feed. ──
  defaultMedium: 'surreal',

  // ── Flux prompt wrapping ──
  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // ── Vibes she works with (must exist in dream_vibes table, rolled per render) ──
  vibes: [
    'cinematic',
    'epic',
    'ethereal',
    'psychedelic',
    'voltage',
    'shimmer',
    'nostalgic',
    'cozy',
    'arcane',
    'dark',
    'fierce',
    'nightshade',
    'surreal',
    'macabre',
  ],

  // ── 6 render paths ──
  paths: ['closeup', 'full-body', 'seduction', 'cyborg-fashion', 'stare', 'robot'],

  // Slight weight toward closeup and robot (hero paths)
  pathWeights: {
    closeup: 2,
    'full-body': 1,
    seduction: 1,
    'cyborg-fashion': 1,
    stare: 1,
    robot: 2,
  },

  // ── Content safety ──
  // (none for VenusBot — coverage rules already in REQUIRED_ELEMENTS_BLOCK)

  // ──────────────────────────────────────────────────────
  // SHARED DNA — rolled once per render, used by all paths
  // ──────────────────────────────────────────────────────
  rollSharedDNA({ vibeKey, picker }) {
    const scenePalette = picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette');
    const colorPalette = pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic;
    return {
      skin: picker.pickWithRecency(pools.SKIN_TONES, 'skin'),
      bodyType: picker.pickWithRecency(pools.BODY_TYPES, 'body'),
      glowColor: picker.pickWithRecency(pools.GLOW_COLORS, 'glow'),
      characterBase: picker.pickWithRecency(CHARACTER_BASES, 'character'),
      hair: picker.pick(pools.HAIR_STYLES),
      eyes: picker.pick(pools.EYE_STYLES),
      internal: picker.pickWithRecency(pools.INTERNAL_EXPOSURE, 'internal'),
      wildcard: picker.pickWithRecency(pools.WILDCARDS, 'wildcard'),
      scenePalette,
      colorPalette,
    };
  },

  // ──────────────────────────────────────────────────────
  // BRIEF — dispatch to path-specific builder
  // ──────────────────────────────────────────────────────
  buildBrief({ path: pathName, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[pathName];
    if (!builder) throw new Error(`VenusBot: unknown path "${pathName}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  // ── Optional caption ──
  caption({ path }) {
    return `[${path}] VenusBot`;
  },
};
