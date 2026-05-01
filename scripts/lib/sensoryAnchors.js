/**
 * Sensory anchors layer — V4/nightly Step 3 enhancement port.
 *
 * Injects 1-2 non-visual sensory cues (smell / sound / touch / temperature /
 * weight / air) into the Sonnet brief. Sonnet weaves them into the scene
 * description, sharpening the visual word choices around them.
 *
 * Flux can't render smell directly, but the verbs/adjectives Sonnet picks
 * around an anchor like "frankincense smoke clinging to her hair" force more
 * specific visual detail than "she stands in a cathedral" alone.
 *
 * Reusable across bots — opt-in via:
 *
 *   bot.sensoryAnchors = {
 *     enabled: true,
 *     skipPaths: [],                    // optional: paths to skip
 *     poolsByChannel: {                 // optional: bot-wide channel overrides
 *       smell: ['frankincense', ...],
 *       sound: [...], ...
 *     },
 *     poolsByChannelByPath: {           // optional: per-path overrides (deepest)
 *       'vampire-girls-2': { smell: [...] }
 *     },
 *   };
 *
 * Resolution order per channel: per-path > per-bot > built-in DEFAULT_POOLS.
 *
 * Per-render mechanics:
 *   - 70% of renders → 1 anchor
 *   - 30% of renders → 2 anchors from DIFFERENT channels
 *   - Channels picked weighted-random; phrases picked uniform-random
 */

// Generic fallback pools — bots that opt in without overriding channels still
// get something better than nothing. Bot-specific pools layer on top.
const DEFAULT_POOLS = {
  smell: [
    'damp earth',
    'wood smoke',
    'crushed pine needles',
    'rain on hot stone',
    'old paper and ink',
    'distant ozone',
  ],
  sound: [
    'wind through the trees',
    'distant bell',
    'water dripping in stone',
    'something rustling underfoot',
    'a single bird call',
    'her own breath in the silence',
  ],
  touch: [
    'cold air on bare skin',
    'rough fabric against the neck',
    'damp grass underfoot',
    'metal cool in the palm',
    'a drop of water on the cheek',
    'silk warming in her hand',
  ],
  temperature: [
    'midday heat radiating off stone',
    'frozen breath catching in her throat',
    'sun-warmed against her back',
    'cellar-cold creeping up the legs',
    'cheeks flushed warm',
    'fingertips numb at the tips',
  ],
  weight: [
    'heavy cloak pulling at the shoulders',
    'feather-light fabric drifting',
    'a small object held in the closed fist',
    'the press of jewelry at the throat',
    'boots sinking into soft ground',
    'a strap cutting across the chest',
  ],
  air: [
    'mist drifting between trees',
    'dust motes turning in a shaft of light',
    'snowflakes settling on her hair',
    'pollen drifting in golden light',
    'leaves trembling in invisible draft',
    'smoke curling upward',
  ],
};

const CHANNEL_WEIGHTS = {
  smell: 20,
  sound: 20,
  touch: 18,
  temperature: 18,
  weight: 15,
  air: 15,
};

function pickWeightedChannel(channels, excludeKeys) {
  const pool = excludeKeys && excludeKeys.length
    ? channels.filter((c) => !excludeKeys.includes(c.key))
    : channels;
  if (pool.length === 0) return null;
  const total = pool.reduce((s, c) => s + c.weight, 0);
  let r = Math.random() * total;
  for (const c of pool) {
    if (r < c.weight) return c;
    r -= c.weight;
  }
  return pool[pool.length - 1];
}

function pickFromPool(pool) {
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Roll a sensory anchor profile for one render.
 *
 * @param {object} args
 * @param {string} args.path           — the bot path being rendered
 * @param {object} args.botSensory     — bot.sensoryAnchors config block
 * @returns {{ anchors: Array<{channel: string, phrase: string}>, channelKeys: string[] }}
 */
function rollSensoryAnchors({ path, botSensory }) {
  if (!botSensory || !botSensory.enabled) {
    return { anchors: [], channelKeys: [] };
  }
  if (botSensory.skipPaths && botSensory.skipPaths.includes(path)) {
    return { anchors: [], channelKeys: [] };
  }

  // Resolve pools per channel: per-path > per-bot > defaults.
  const pathPools =
    (botSensory.poolsByChannelByPath && botSensory.poolsByChannelByPath[path]) || {};
  const botPools = botSensory.poolsByChannel || {};

  const channels = Object.keys(CHANNEL_WEIGHTS)
    .map((key) => ({
      key,
      weight: CHANNEL_WEIGHTS[key],
      pool: pathPools[key] || botPools[key] || DEFAULT_POOLS[key],
    }))
    .filter((c) => c.pool && c.pool.length > 0);

  if (channels.length === 0) return { anchors: [], channelKeys: [] };

  // 70% one anchor / 30% two anchors (different channels)
  const count = Math.random() < 0.30 ? 2 : 1;
  const anchors = [];
  const usedKeys = [];

  for (let i = 0; i < count; i++) {
    const channel = pickWeightedChannel(channels, usedKeys);
    if (!channel) break;
    usedKeys.push(channel.key);
    anchors.push({ channel: channel.key, phrase: pickFromPool(channel.pool) });
  }

  return { anchors, channelKeys: usedKeys };
}

/**
 * Build the brief block that gets appended to the Sonnet brief.
 * Returns empty string if no anchors rolled.
 */
function buildSensoryBriefBlock(profile) {
  if (!profile || !profile.anchors || profile.anchors.length === 0) return '';
  const lines = profile.anchors.map((a) => `  - ${a.channel}: ${a.phrase}`).join('\n');
  return `\n\n━━━ SENSORY ANCHORS — weave naturally into the scene ━━━\n${lines}\n\nUse these as INFLUENCE on word choice. Let them sharpen the visual details around them — describe what they imply (the curl of smoke, the goosebumps from the cold, the weight of the chain at her throat). Do NOT list them. Do NOT name the channel. Show, don't tell.`;
}

module.exports = {
  rollSensoryAnchors,
  buildSensoryBriefBlock,
  DEFAULT_POOLS,
  CHANNEL_WEIGHTS,
};
