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

function composeBrief({ bot, pathConfig, sharedDNA, vibeDirective, picker }) {
  const arch = ARCHETYPES[pathConfig.archetype];
  if (!arch) {
    throw new Error(`composeBrief: unknown archetype "${pathConfig.archetype}"`);
  }
  if (!TEMPLATES[pathConfig.archetype]) {
    throw new Error(`composeBrief: no template for archetype "${pathConfig.archetype}"`);
  }

  const slots = {};

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

  // 3. Path-level axes — always path-bespoke (no fallback)
  for (const slot of arch.slots.path) {
    const poolName = pathConfig.pools?.[slot];
    if (!poolName) {
      throw new Error(
        `composeBrief: path missing required pool for slot "${slot}" (archetype: ${pathConfig.archetype})`
      );
    }
    const pool = bot.poolByName(poolName);
    if (!pool || pool.length === 0) {
      throw new Error(`composeBrief: pool "${poolName}" is empty or missing`);
    }
    const n = arch.pickN?.[slot];
    slots[slot] = n ? pickN(pool, n, picker, slot) : picker.pickWithRecency(pool, slot);
  }

  // 4. Conditional drama layer (probability-gated)
  if (arch.conditionalLayer && Math.random() < arch.conditionalLayer.gate) {
    const slot = arch.conditionalLayer.slot;
    const poolName = pathConfig.pools?.[slot];
    if (poolName) {
      const pool = bot.poolByName(poolName);
      if (pool && pool.length > 0) {
        slots[slot] = picker.pickWithRecency(pool, slot);
      }
    }
  }

  // 5. Framing modes (if archetype declares them)
  if (arch.framingModes) {
    slots._framingMode = rollFromWeights(arch.framingModes.modes, arch.framingModes.weights);
  }

  // 6. Hand off to archetype template for brief assembly
  return TEMPLATES[pathConfig.archetype]({ slots, sharedDNA, vibeDirective });
}

function resolvePool(slot, pathConfig, bot) {
  // Path override
  if (pathConfig.pools?.[slot]) {
    const poolName = pathConfig.pools[slot];
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
