/**
 * Bot brief composer — assembles a render brief from an archetype +
 * bespoke path pools + bot-level defaults. Path files declare an
 * archetype + their bespoke pool names; this module does the rest.
 *
 * Pool resolution order (per slot):
 *   1. Path override — pathConfig.pools[slot] names a pool
 *   2. Bot default  — bot.defaultPools[slot] names a pool
 *   3. Error        — missing pool wiring
 *
 * Universal axes (story_beat, lighting, etc.) usually resolve via #2;
 * paths override only when their needs diverge (e.g. intimate-scale
 * story_beats for cozy-sci-fi-interior).
 *
 * See BOT_AXIS_REFACTOR_PLAN.md for the full architecture.
 */

const { ARCHETYPES } = require('./archetypes');
const TEMPLATES = require('./archetype-templates');
const { entityCapForModel, selectEntitiesForModel } = require('./modelDetailTiers');

function composeBrief({ bot, pathConfig, sharedDNA, vibeDirective, picker, model = null }) {
  const arch = ARCHETYPES[pathConfig.archetype];
  if (!arch) {
    throw new Error(`composeBrief: unknown archetype "${pathConfig.archetype}"`);
  }
  if (!TEMPLATES[pathConfig.archetype]) {
    throw new Error(`composeBrief: no template for archetype "${pathConfig.archetype}"`);
  }

  const slots = {};
  // Tracks the raw rolled entry (with .tags) per slot, so later slots can
  // filter their own pool against an already-rolled slot's tags via the
  // `matchTagsFromSlot` pool-spec field. Only populated for slots whose
  // pool entries are tagged objects ({ tags, description }).
  const rolledMeta = {};

  // 1. Universal axes — path override → bot default
  for (const slot of arch.slots.universal) {
    const pool = resolvePool(slot, pathConfig, bot);
    const n = arch.pickN?.[slot];
    // anchor_scale is filtered by the archetype's anchorScaleRange (or path
    // override). Pool entries start with TINY/SMALL/MEDIUM/LARGE prefix.
    if (slot === 'anchor_scale' && arch.anchorScaleRange) {
      const range = pathConfig.anchorScaleRange || arch.anchorScaleRange;
      const filtered = pool.filter((entry) =>
        range.some((label) => typeof entry === 'string' && entry.startsWith(label))
      );
      if (filtered.length === 0) {
        slots[slot] = pool[0];
      } else {
        slots[slot] = picker.pickWithRecency(filtered, slot);
      }
      continue;
    }
    slots[slot] = n ? pickN(pool, n, picker, slot) : picker.pickWithRecency(pool, slot);
  }

  // 2. Bot-level axes — path override → bot default
  for (const slot of arch.slots.bot) {
    const pool = resolvePool(slot, pathConfig, bot);
    const n = arch.pickN?.[slot];
    slots[slot] = n ? pickN(pool, n, picker, slot) : picker.pickWithRecency(pool, slot);
  }

  // 2b. Character DNA axes — path override → bot default → bot.<slot>_<dnaKey>
  // pattern (e.g. female_explorer might map race→SCI_FI_RACE and outfit→
  // EXPLORER_OUTFITS_FEMALE). Same resolution order as universal.
  for (const slot of arch.slots.characterDnaAxes || []) {
    const pool = resolvePool(slot, pathConfig, bot);
    const n = arch.pickN?.[slot];
    slots[slot] = n ? pickN(pool, n, picker, slot) : picker.pickWithRecency(pool, slot);
  }

  // 3. Path-level axes — always path-bespoke (no fallback)
  // pathConfig.pools[slot] is either:
  //   (a) a string pool name (legacy) — picks from pool directly, entries are strings
  //   (b) { name, tags } — filtered pool spec; filter pool to entries matching
  //       any of the tags (entries tagged 'ANY' always included). Pool entries
  //       must be objects { tags: [], description: '' }; the picker receives
  //       the .description string after filtering.
  for (const slot of arch.slots.path) {
    const spec = pathConfig.pools?.[slot];
    if (!spec) {
      throw new Error(
        `composeBrief: path missing required pool for slot "${slot}" (archetype: ${pathConfig.archetype})`
      );
    }
    // resolveSpecPoolRaw returns the raw entries (objects when tagged,
    // strings otherwise). Supports matchTagsFromSlot via rolledMeta.
    const rawPool = resolveSpecPoolRaw(spec, bot, rolledMeta);
    if (!rawPool || rawPool.length === 0) {
      throw new Error(
        `composeBrief: pool spec for slot "${slot}" resolved to empty pool (after tag filter)`
      );
    }
    const stringPool = rawPool.map((e) => (typeof e === 'string' ? e : e.description));
    const n = arch.pickN?.[slot];
    const picked = n ? pickN(stringPool, n, picker, slot) : picker.pickWithRecency(stringPool, slot);
    slots[slot] = picked;
    // If this slot's pool entries are tagged objects, remember the rolled
    // entry's tags so later slots can match against them. Only tracks
    // single-pick (not pickN multi-pick) for now.
    if (typeof picked === 'string') {
      const rawEntry = rawPool.find((e) => typeof e !== 'string' && e.description === picked);
      if (rawEntry) {
        rolledMeta[slot] = { tags: Array.isArray(rawEntry.tags) ? rawEntry.tags : [] };
      }
    }
  }

  // 4. Conditional drama layer (probability-gated)
  // Two shapes supported:
  //   (a) { slot, gate }                                  — single-pool layer (single pick)
  //   (b) { gate, pools: { slot1: { name, pickN }, ... } } — multi-pool layer (each pool picks N entries when fired)
  if (arch.conditionalLayer && Math.random() < arch.conditionalLayer.gate) {
    if (arch.conditionalLayer.pools) {
      // Multi-pool conditional — fire all sub-pools together
      slots._conditionalFired = true;
      for (const [subSlot, cfg] of Object.entries(arch.conditionalLayer.pools)) {
        const poolName = pathConfig.pools?.[subSlot] || cfg.name;
        if (!poolName) continue;
        const pool = bot.poolByName(poolName);
        if (pool && pool.length > 0) {
          slots[subSlot] = cfg.pickN ? pickN(pool, cfg.pickN, picker, subSlot) : picker.pickWithRecency(pool, subSlot);
        }
      }
    } else {
      // Single-pool conditional (legacy shape) — also supports tagged-pool spec.
      // Pass rolledMeta so matchTagsFromSlot works (e.g. SEASONAL_SHIFT_PHENOMENON
      // filtering by subject's autumn/spring tag).
      const slot = arch.conditionalLayer.slot;
      const spec = pathConfig.pools?.[slot];
      if (spec) {
        const rawPool = resolveSpecPoolRaw(spec, bot, rolledMeta);
        if (rawPool && rawPool.length > 0) {
          const stringPool = rawPool.map((e) => (typeof e === 'string' ? e : e.description));
          slots[slot] = picker.pickWithRecency(stringPool, slot);
        }
      }
    }
  }

  // 5. Framing modes (if archetype declares them)
  if (arch.framingModes) {
    slots._framingMode = rollFromWeights(arch.framingModes.modes, arch.framingModes.weights);
  }

  // 5b. Model-aware entity-cap trim. High-faithfulness models (Flux 2 family,
  // Nano Banana, GPT Image 2) render every named entity crisply and produce
  // chaotic frames when 6+ distinct entities pile up. Older Flux 1.x soft-
  // merges those same entities into coherent scenes. To match each model's
  // detail tier, archetypes opt-in by tagging `entitySlots` (the subset of
  // path slots that introduce new objects/creatures/elements). Slots not in
  // that list (atmosphere / composition / palette tuners) are NEVER capped
  // — they tune the existing scene without adding new focal points, so
  // renders stay lush regardless of model.
  //
  // The first `protectedEntityCount` entries in `entitySlots` are always
  // kept (hero + key supporting). The rest are randomly sampled down to
  // the model's cap. Dropped slot values get NULLED so empty-section
  // helpers in templates emit nothing for them.
  //
  // See scripts/lib/modelDetailTiers.js for the cap table + rationale.
  // Archetypes without `entitySlots` are no-op (full backwards compat).
  if (Array.isArray(arch.entitySlots) && arch.entitySlots.length > 0) {
    const cap = entityCapForModel(model);
    const { keep, drop } = selectEntitiesForModel(
      arch.entitySlots,
      cap,
      arch.protectedEntityCount ?? 0
    );
    if (drop.length > 0) {
      for (const slot of drop) {
        // Null the value so block(label, val) helpers emit nothing. We
        // preserve the key (`slot in slots`) so template destructuring
        // doesn't throw — it just sees the empty value.
        slots[slot] = null;
      }
      slots._cappedEntities = { kept: [...keep], dropped: drop, cap, model };
    }
  }

  // 6. Hand off to archetype template for brief assembly
  const brief = TEMPLATES[pathConfig.archetype]({ slots, sharedDNA, vibeDirective });
  // Expose conditionalLayer fire signal so botEngine can react (e.g. swap
  // render model to one that handles night/dark scenes better than the
  // bot's default). Currently used for YumBot's night_mode override —
  // flux-dev/kawaii-pastel can't break out of bright-daytime lighting,
  // so night-fired renders flip to flux-1.1-pro-ultra.
  if (slots.night_mode) {
    return { brief, briefMeta: { nightModeFired: true } };
  }
  return brief;
}

/**
 * Resolve a path's pool spec to an array of RAW entries (objects when
 * tagged, strings otherwise). Spec is either:
 *   string  — name of a pool registered on the bot. Entries returned as-is.
 *   { name, tags? }            — static-tag filter against the named pool.
 *   { name, matchTagsFromSlot } — DYNAMIC tag filter — reads the rolled
 *                                  source slot's tags from rolledMeta and
 *                                  filters this pool to entries whose tags
 *                                  overlap. Requires the source slot to
 *                                  appear EARLIER in archetype.slots.path
 *                                  (composer rolls slots in declaration
 *                                  order). 'ANY'-tagged entries always pass.
 *
 * Returns RAW entries (not .description strings) so the composer can both
 * pick from them and track tags via rolledMeta. Wrap with .map(entryToString)
 * before passing to a picker.
 */
function resolveSpecPoolRaw(spec, bot, rolledMeta) {
  if (typeof spec === 'string') {
    return bot.poolByName(spec);
  }
  if (spec && typeof spec === 'object' && spec.name) {
    const raw = bot.poolByName(spec.name);
    if (!raw) throw new Error(`resolveSpecPoolRaw: pool "${spec.name}" not found on bot`);

    let allowedTags;
    if (spec.matchTagsFromSlot) {
      const sourceMeta = rolledMeta && rolledMeta[spec.matchTagsFromSlot];
      if (!sourceMeta) {
        throw new Error(
          `resolveSpecPoolRaw: matchTagsFromSlot="${spec.matchTagsFromSlot}" but that slot has not been rolled yet — declare it EARLIER in archetype.slots.path`
        );
      }
      allowedTags = sourceMeta.tags || [];
      if (allowedTags.length === 0) {
        // Source slot has no tags — return everything unfiltered
        return raw;
      }
    } else if (spec.tags && spec.tags.length > 0) {
      allowedTags = spec.tags;
    } else {
      // No tag filter — return all
      return raw;
    }

    const allowed = new Set(allowedTags);
    return raw.filter((e) => {
      if (typeof e === 'string') return true; // unfiltered if not tagged
      if (!Array.isArray(e.tags)) return false;
      if (e.tags.includes('ANY')) return true;
      return e.tags.some((t) => allowed.has(t));
    });
  }
  throw new Error(`resolveSpecPoolRaw: invalid spec ${JSON.stringify(spec)}`);
}

/**
 * Backward-compatible wrapper — returns .description strings (or strings
 * as-is) for callers that don't need raw entries or matchTagsFromSlot.
 * Used by the conditional layer below + any external callers.
 */
function resolveSpecPool(spec, bot) {
  const raw = resolveSpecPoolRaw(spec, bot, null);
  return raw.map((e) => (typeof e === 'string' ? e : e.description));
}

function resolvePool(slot, pathConfig, bot) {
  // Path override
  if (pathConfig.pools?.[slot]) {
    const poolName = pathConfig.pools[slot];
    if (typeof poolName === 'object' && poolName.name) {
      // Tagged-pool spec — use resolveSpecPool to filter
      const pool = resolveSpecPool(poolName, bot);
      if (pool && pool.length > 0) return pool;
      throw new Error(`composeBrief: path-override tagged pool "${poolName.name}" empty/missing for slot "${slot}"`);
    }
    const pool = bot.poolByName(poolName);
    if (pool && pool.length > 0) return pool;
    throw new Error(`composeBrief: path-override pool "${poolName}" empty/missing for slot "${slot}"`);
  }
  // Bot default
  if (bot.defaultPools?.[slot]) {
    const poolName = bot.defaultPools[slot];
    const pool = bot.poolByName(poolName);
    if (pool && pool.length > 0) return pool;
    throw new Error(`composeBrief: bot-default pool "${poolName}" empty/missing for slot "${slot}"`);
  }
  throw new Error(`composeBrief: no pool wired for slot "${slot}" (neither path override nor bot default)`);
}

function pickN(pool, n, picker, axisName) {
  const out = [];
  const seen = new Set();
  let attempts = 0;
  while (out.length < n && attempts < n * 4) {
    const pick = picker.pickWithRecency(pool, `${axisName}_${out.length}`);
    if (!seen.has(pick)) {
      seen.add(pick);
      out.push(pick);
    }
    attempts++;
  }
  return out;
}

function rollFromWeights(items, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

module.exports = { composeBrief };
