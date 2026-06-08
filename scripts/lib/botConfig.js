/**
 * botConfig — overlays admin-tunable dials from the bot_config table onto a bot's
 * code config at run time (ADMIN_CONFIG_PLAN.md Phase 5).
 *
 * DB wins where set; a NULL column / missing row leaves the code value untouched,
 * so this is fully backwards-compatible (no row = today's behavior). Infra only —
 * it never touches creative content (paths/pools/archetypes/prose stay in code).
 *
 * Wired dials: allowed_models, mediums, vibes (arrays), chaos_enabled (FALSE
 * disables the chaos layer), two_pass_polish_enabled. The `overrides` jsonb column
 * is reserved but intentionally not applied yet (a blind shallow-merge would clobber
 * nested code config like chaos.skipPaths).
 */

// Per-process cache: the dispatcher runs one process per bot; iter-bot batches one
// bot — either way we want a single fetch. `undefined` = not loaded, `null` = no row.
const _cache = {};

async function loadBotConfigRow(sb, botName) {
  if (_cache[botName] !== undefined) return _cache[botName];
  const { data, error } = await sb
    .from('bot_config')
    .select('*')
    .eq('bot_name', botName)
    .maybeSingle();
  if (error) {
    console.warn(`[botConfig] load failed for ${botName} — using code defaults:`, error.message);
    _cache[botName] = null;
  } else {
    _cache[botName] = data || null;
  }
  return _cache[botName];
}

/**
 * Return a shallow copy of `bot` with bot_config dials overlaid. Returns the same
 * `bot` object (no copy) when there's no row, so the common path is allocation-free.
 */
async function applyBotConfigOverlay(sb, bot) {
  if (!bot || !bot.username || !sb) return bot;
  const cfg = await loadBotConfigRow(sb, bot.username);
  if (!cfg) return bot;

  const merged = { ...bot };
  if (Array.isArray(cfg.allowed_models)) merged.allowedModels = cfg.allowed_models;
  if (Array.isArray(cfg.mediums)) merged.mediums = cfg.mediums;
  if (Array.isArray(cfg.vibes)) merged.vibes = cfg.vibes;
  // chaos_enabled is a DISABLE switch (enabling needs the code's chaos config).
  if (cfg.chaos_enabled === false) merged.chaos = null;
  if (typeof cfg.two_pass_polish_enabled === 'boolean') {
    merged.twoPassPolish = { ...(bot.twoPassPolish || {}), enabled: cfg.two_pass_polish_enabled };
  }
  return merged;
}

/** Test seam — reset the per-process cache. */
function _resetBotConfigCache() {
  for (const k of Object.keys(_cache)) delete _cache[k];
}

module.exports = { applyBotConfigOverlay, _resetBotConfigCache };
