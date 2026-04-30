#!/usr/bin/env node
/**
 * benchmark-face-swap-models.js — Compare face-swap models on Replicate.
 *
 * For each candidate model: fires N face-swap requests against a real cast
 * photo + a real generated dream image, measures wall-clock latency, status
 * code, and final output URL. Reports a per-model summary so we can pick
 * the warmest / fastest / highest-quality model for production.
 *
 * Usage:
 *   node scripts/benchmark-face-swap-models.js [--n 3] [--models a,b,c]
 *
 * Options:
 *   --n <N>           Requests per model (default: 3, recommended 3-5)
 *   --models <list>   Subset of models by short name (default: all)
 *   --target <url>    Override target image URL (default: most recent dream)
 *   --source <url>    Override source face URL (default: Kevin's cast-self)
 *   --warm-only       Skip a model if its first request 503s (likely cold + broken)
 *
 * What this measures:
 *   - status_first   — HTTP status of the create-prediction call
 *   - latency_ms     — wall-clock for full prediction (queue + boot + run)
 *   - output_url     — saved per-model so you can visually grade quality
 *   - cold_signal    — true if first request took >25s (proxy for cold boot)
 *
 * Output: prints a markdown table to stdout AND writes JSON results to
 * scripts/face-swap-bench-results.json with full per-call detail.
 *
 * IMPORTANT: each model uses different input param names (swap_image vs
 * source_image vs reference_image). The MODELS table below maps each
 * model to its expected param names. If a 422 ("invalid input") shows up
 * for any model, the param mapping is wrong — fix it in this file.
 */

const fs = require('fs');
const path = require('path');

// ── Env loading ────────────────────────────────────────────────────────

function readEnvFile() {
  try {
    const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}
const envFile = readEnvFile();
const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN || envFile.REPLICATE_API_TOKEN;
if (!REPLICATE_TOKEN) {
  console.error('Missing REPLICATE_API_TOKEN — set in .env.local or env');
  process.exit(1);
}

// ── Args ───────────────────────────────────────────────────────────────

function getArg(flag, fallback) {
  const idx = process.argv.indexOf(flag);
  if (idx >= 0 && idx + 1 < process.argv.length) return process.argv[idx + 1];
  return fallback;
}
const N = parseInt(getArg('--n', '3'), 10);
const MODELS_FILTER = getArg('--models', '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const TARGET_OVERRIDE = getArg('--target', '');
const SOURCE_OVERRIDE = getArg('--source', '');
const WARM_ONLY = process.argv.includes('--warm-only');

// ── Model registry ─────────────────────────────────────────────────────
//
// Each entry is what we hand Replicate's POST /predictions. `version` is
// the specific model version hash (always pin to a hash, never `:latest`).
// `inputBuilder(source, target)` returns the `input` object — different
// models use different param names.
//
// TODO: confirm version hashes are still latest before each benchmark run.
// You can find the latest hash at https://replicate.com/<model>/api?tab=python

// Versions and input field names verified via Replicate API on 2026-04-30.
// All models below are commercial-use eligible. lucataco/faceswap is
// excluded — its license says "Research & Non-commercial use only."

const MODELS = [
  {
    name: 'cdingram',
    fullName: 'cdingram/face-swap',
    version: 'd1d6ea8c8be89d664a07a457526f7128109dee7030fdac424788d762c71ed111',
    inputBuilder: (source, target) => ({ swap_image: source, input_image: target }),
    note: 'Current production model. 2.5M runs.',
  },
  {
    name: 'yan-ops',
    fullName: 'yan-ops/face_swap',
    version: 'd5900f9ebed33e7ae08a07f17e0d98b4ebc68ab9528a70462afc3899cfe23bab',
    inputBuilder: (source, target) => ({
      source_image: source,
      target_image: target,
      // Reasonable defaults so the prediction submits cleanly. These existed
      // in the input schema but most are tunable knobs we leave at default.
      weight: 0.5,
      det_thresh: 0.1,
    }),
    note: 'Original face-swap model — 496M runs. Replaced earlier due to canned-output bug; worth retesting.',
  },
  {
    name: 'okaris-roop',
    fullName: 'okaris/roop',
    version: '8c1e100ecabb3151cf1e6c62879b6de7a4b84602de464ed249b6cff0b86211d8',
    inputBuilder: (source, target) => ({
      source: source,
      target: target,
      enhance_face: true,
    }),
    note: 'Open-source roop, one-click. 9M runs. Strong popularity signal.',
  },
  {
    name: 'codeplugtech',
    fullName: 'codeplugtech/face-swap',
    version: '278a81e7ebb22db98bcba54de985d22cc1abeead2754eb1f2af717247be69b34',
    inputBuilder: (source, target) => ({ swap_image: source, input_image: target }),
    note: '"Advance Face Swap" by pixalto.app. 2.1M runs. Same input shape as cdingram.',
  },
  {
    name: 'pikachupichu25',
    fullName: 'pikachupichu25/image-faceswap',
    version: '94b109952d4dd3cb6e9947340a6a099cc9a4821af8807a879c1f7af92e2a3b00',
    inputBuilder: (source, target) => ({ swap_image: source, target_image: target }),
    note: '643K runs. Smaller pool, included for completeness.',
  },
];

// ── Defaults: source + target images ───────────────────────────────────

// Both source and target need detectable faces. The previous default target
// was a stylized illustration where the face detector failed ("no face
// found"). Using two real cast photos gives a clean baseline test.
// Source = Kevin's cast-self photo, target = his plus_one's photo.
const DEFAULT_SOURCE =
  'https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/avatars/eab700d8-f11a-4f47-a3a1-addda6fb67ec/cast-self-1777416646249.jpg';
const DEFAULT_TARGET =
  'https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/avatars/eab700d8-f11a-4f47-a3a1-addda6fb67ec/cast-plus_one-1777416729160.jpg';

const SOURCE = SOURCE_OVERRIDE || DEFAULT_SOURCE;
const TARGET = TARGET_OVERRIDE || DEFAULT_TARGET;

// ── Replicate client ───────────────────────────────────────────────────

async function fetchJson(url, init = {}) {
  const res = await fetch(url, init);
  let body;
  try {
    body = await res.json();
  } catch {
    body = { _raw: await res.text() };
  }
  return { status: res.status, body };
}

const POLL_INTERVAL_MS = 1000;
const MAX_WAIT_MS = 90_000;

async function runOnePrediction(model, source, target) {
  const t0 = Date.now();
  const create = await fetchJson('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${REPLICATE_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: model.version,
      input: model.inputBuilder(source, target),
    }),
  });

  if (create.status !== 201) {
    return {
      ok: false,
      statusCreate: create.status,
      latencyMs: Date.now() - t0,
      error: JSON.stringify(create.body).slice(0, 200),
      outputUrl: null,
    };
  }

  const id = create.body.id;
  const maxPolls = Math.ceil(MAX_WAIT_MS / POLL_INTERVAL_MS);
  for (let i = 0; i < maxPolls; i++) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    const poll = await fetchJson(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: { Authorization: `Bearer ${REPLICATE_TOKEN}` },
    });
    if (poll.status !== 200) {
      return {
        ok: false,
        statusCreate: 201,
        latencyMs: Date.now() - t0,
        error: `poll ${poll.status}`,
        outputUrl: null,
      };
    }
    const s = poll.body.status;
    if (s === 'succeeded') {
      const out = poll.body.output;
      const url =
        typeof out === 'string'
          ? out
          : Array.isArray(out)
            ? out[0]
            : out && typeof out === 'object'
              ? out.image
              : null;
      return {
        ok: true,
        statusCreate: 201,
        latencyMs: Date.now() - t0,
        error: null,
        outputUrl: url,
      };
    }
    if (s === 'failed' || s === 'canceled') {
      return {
        ok: false,
        statusCreate: 201,
        latencyMs: Date.now() - t0,
        error: `${s}: ${(poll.body.error ?? 'unknown').toString().slice(0, 200)}`,
        outputUrl: null,
      };
    }
  }
  return {
    ok: false,
    statusCreate: 201,
    latencyMs: Date.now() - t0,
    error: 'timeout',
    outputUrl: null,
  };
}

// ── Main ───────────────────────────────────────────────────────────────

(async () => {
  const candidates = MODELS_FILTER.length
    ? MODELS.filter((m) => MODELS_FILTER.includes(m.name))
    : MODELS;

  console.log(`\n🧪 Face-swap model benchmark`);
  console.log(`   Source: ${SOURCE}`);
  console.log(`   Target: ${TARGET}`);
  console.log(`   N per model: ${N}`);
  console.log(`   Models: ${candidates.map((m) => m.name).join(', ')}`);
  if (WARM_ONLY) console.log(`   --warm-only: skipping models whose first request 503s`);
  console.log('');

  const allResults = [];

  for (const model of candidates) {
    console.log(`\n── ${model.name} (${model.fullName}) ──`);
    console.log(`   ${model.note}`);

    const runs = [];
    for (let i = 0; i < N; i++) {
      process.stdout.write(`   Run ${i + 1}/${N}: `);
      const r = await runOnePrediction(model, SOURCE, TARGET);
      runs.push(r);

      const seconds = (r.latencyMs / 1000).toFixed(1);
      const tag = r.ok ? `✅ ${seconds}s` : `❌ ${r.error || `HTTP ${r.statusCreate}`} (${seconds}s)`;
      console.log(tag);

      if (WARM_ONLY && i === 0 && !r.ok && (r.statusCreate >= 500 || r.statusCreate === 429)) {
        console.log(`   --warm-only: bailing early on ${model.name}`);
        break;
      }

      // Small spacing between requests so we don't pile on a cold model
      if (i < N - 1) await new Promise((r) => setTimeout(r, 1500));
    }

    const successCount = runs.filter((r) => r.ok).length;
    const successRate = `${successCount}/${runs.length}`;
    const successfulRuns = runs.filter((r) => r.ok);
    const avgLatency = successfulRuns.length
      ? Math.round(successfulRuns.reduce((s, r) => s + r.latencyMs, 0) / successfulRuns.length)
      : null;
    const firstRunCold = runs[0] && runs[0].ok && runs[0].latencyMs > 25_000;

    console.log(`   → success ${successRate}, avg latency ${avgLatency ? `${avgLatency}ms` : 'n/a'}, cold-on-first: ${firstRunCold ? 'yes' : 'no'}`);

    allResults.push({
      model: model.name,
      fullName: model.fullName,
      version: model.version,
      successRate,
      successCount,
      totalRuns: runs.length,
      avgLatencyMs: avgLatency,
      firstRunCold,
      runs: runs.map((r) => ({
        ok: r.ok,
        statusCreate: r.statusCreate,
        latencyMs: r.latencyMs,
        error: r.error,
        outputUrl: r.outputUrl,
      })),
    });
  }

  // Summary table
  console.log('\n\n═══ SUMMARY ═══');
  console.log('\n| Model | Success | Avg Latency | First-Run Cold |');
  console.log('|-------|---------|-------------|----------------|');
  for (const r of allResults) {
    const lat = r.avgLatencyMs ? `${(r.avgLatencyMs / 1000).toFixed(1)}s` : 'n/a';
    console.log(`| ${r.model} | ${r.successRate} | ${lat} | ${r.firstRunCold ? '🥶' : '✅'} |`);
  }

  // Top output URLs for visual grading
  console.log('\n═══ OUTPUT URLS (visually grade quality) ═══');
  for (const r of allResults) {
    const successUrls = r.runs.filter((run) => run.ok && run.outputUrl).map((run) => run.outputUrl);
    if (successUrls.length) {
      console.log(`\n${r.model}:`);
      successUrls.forEach((u) => console.log(`  ${u}`));
    } else {
      console.log(`\n${r.model}: (no successful outputs)`);
    }
  }

  // Persist
  const outFile = path.join(__dirname, 'face-swap-bench-results.json');
  fs.writeFileSync(
    outFile,
    JSON.stringify(
      { ranAt: new Date().toISOString(), source: SOURCE, target: TARGET, n: N, results: allResults },
      null,
      2
    )
  );
  console.log(`\n💾 Full results: ${outFile}\n`);
})().catch((err) => {
  console.error('Benchmark failed:', err);
  process.exit(1);
});
