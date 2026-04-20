/**
 * seedGenHelper.js — shared batch-generator for Sonnet-seeded axis pools.
 *
 * Lets per-axis generator scripts stay tiny: just declare the meta-prompt
 * and output path, the helper handles env loading, batched generation
 * with intra-pool dedup (prior batches shown to Sonnet as "avoid these"),
 * retry on transient errors, and JSON output.
 *
 * Usage:
 *   const { generatePool } = require('../../lib/seedGenHelper');
 *   generatePool({
 *     outPath: 'scripts/bots/venusbot/seeds/expressions.json',
 *     total: 50,
 *     batch: 10,
 *     metaPrompt: (perBatchCount) => `You are writing ${perBatchCount} expression entries...`
 *   });
 */

const fs = require('fs');
const path = require('path');

function loadEnv() {
  const env = {};
  try {
    const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
    for (const l of lines) {
      const eq = l.indexOf('=');
      if (eq > 0) env[l.slice(0, eq).trim()] = l.slice(eq + 1).trim();
    }
  } catch (_) {}
  return env;
}

async function callWithRetry(body, anthropicKey) {
  const delays = [2000, 6000, 15000, 30000];
  for (let i = 0; i <= delays.length; i++) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (res.ok) return await res.json();
    const text = (await res.text()).slice(0, 200);
    if ((res.status === 529 || res.status === 429 || res.status >= 500) && i < delays.length) {
      console.log(`  ⏳ ${res.status} — retry ${i + 1}/${delays.length} in ${delays[i] / 1000}s`);
      await new Promise((r) => setTimeout(r, delays[i]));
      continue;
    }
    throw new Error(res.status + ': ' + text);
  }
  throw new Error('exhausted');
}

/**
 * Generate a pool of string entries with intra-pool dedup.
 *
 * Options:
 *   outPath         - relative file path to write JSON array to
 *   total           - total entries desired (e.g., 50)
 *   batch           - entries per Sonnet call (e.g., 10)
 *   metaPrompt      - function(perBatchCount) => string — the per-call brief
 *                     (does not need to include prior-batch dedup — helper adds that)
 *   maxTokens       - optional, default 2500
 *   model           - optional, default claude-sonnet-4-5-20250929
 *
 * Writes JSON array to outPath. Resolves with the full array on success.
 */
async function generatePool({
  outPath,
  total,
  batch = 10,
  metaPrompt,
  maxTokens = 2500,
  model = 'claude-sonnet-4-5-20250929',
}) {
  const ENV = loadEnv();
  const anthropicKey = process.env.ANTHROPIC_API_KEY || ENV.ANTHROPIC_API_KEY;
  if (!anthropicKey) throw new Error('ANTHROPIC_API_KEY missing');

  console.log(`🌱 Generating ${total} entries in batches of ${batch} → ${outPath}\n`);

  const all = [];
  for (let batchN = 1; batchN <= Math.ceil(total / batch); batchN++) {
    const thisBatchCount = Math.min(batch, total - all.length);
    const base = metaPrompt(thisBatchCount);
    const prior = all.length > 0
      ? `\n\n━━━ ALREADY GENERATED (DO NOT DUPLICATE, vary strongly from these) ━━━\n\n${all.map((x, i) => `${i + 1}. ${typeof x === 'string' ? x : JSON.stringify(x)}`).join('\n')}`
      : '';
    const data = await callWithRetry(
      {
        model,
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: base + prior }],
      },
      anthropicKey
    );
    const raw = (data.content[0]?.text || '').trim();
    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) {
      console.error('No JSON array in response. Raw:\n', raw);
      throw new Error('no JSON array in response');
    }
    const newEntries = JSON.parse(match[0]);
    console.log(`  ✓ batch ${batchN}: +${newEntries.length} (total: ${all.length + newEntries.length}/${total})`);
    all.push(...newEntries);
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(all, null, 2));
  console.log(`\n✅ Saved ${all.length} entries to ${outPath}\n`);
  all.slice(0, 4).forEach((s, i) =>
    console.log(`#${i + 1}: ${typeof s === 'string' ? s.slice(0, 140) : JSON.stringify(s).slice(0, 140)}`)
  );
  console.log(`... (${all.length - 4} more)`);
  return all;
}

module.exports = { generatePool, loadEnv };
