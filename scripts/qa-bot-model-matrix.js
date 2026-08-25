#!/usr/bin/env node
/**
 * QA tool — Bot × Model HTML Matrix Test.
 *
 * Fires N renders per (path × model) for a bot, posts them to the live feed,
 * then builds an HTML matrix Kevin can open locally to triage which models
 * to keep enabled for which paths.
 *
 * Usage:
 *   node scripts/qa-bot-model-matrix.js --bot bloombot
 *   node scripts/qa-bot-model-matrix.js --bot starbot --count 3
 *   node scripts/qa-bot-model-matrix.js --bot dragonbot \\
 *     --paths "landscape,castle,dragon-scene" \\
 *     --models "google/gemini-2-image,black-forest-labs/flux-1.1-pro-ultra"
 *
 * Flags:
 *   --bot <name>          REQUIRED. e.g. bloombot / starbot / earthbot
 *   --count <N>           Renders per (path × model). Default 1 (triage).
 *                         Use 3 for stronger sample at 3× cost.
 *   --paths <csv>         Override which paths to test. Default = bot.paths.
 *   --models <csv>        Override which models to test. Default = bot.allowedModels.
 *   --no-post             Don't post to live feed. Renders save to /tmp only,
 *                         HTML uses local file:// URLs (only opens on this Mac).
 *                         Default: POST ENABLED (matrix uses Supabase URLs).
 *   --output <path>       HTML output path. Default /tmp/<bot>-matrix.html
 *
 * Default behavior: 1×/(model×path), --post enabled, HTML to /tmp/<bot>-matrix.html.
 *
 * Cost estimate per render: ~3-7¢ depending on model. For 18 paths × 8 models × 1
 * render = ~$7 (BloomBot full matrix). Sonnet brief composition adds ~$1.
 *
 * Wall time: 8 parallel processes (one per model), each looping all paths.
 * Wall time ≈ (paths × ~40s) ≈ 5-15 min for typical bots.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { waitForHeadroom } = require('./lib/poolHeadroom');

function arg(name, fallback) {
  const i = process.argv.indexOf('--' + name);
  return i >= 0 ? process.argv[i + 1] : fallback;
}
function has(name) {
  return process.argv.includes('--' + name);
}

const BOT = arg('bot', null);
if (!BOT) {
  console.error('Usage: node scripts/qa-bot-model-matrix.js --bot <name> [--count 1]');
  process.exit(1);
}
const COUNT = parseInt(arg('count', '1'), 10);
const POST = !has('no-post');
const OUT = arg('output', `/tmp/${BOT}-matrix.html`);

// Load bot config
let botCfg;
try {
  botCfg = require(path.join(__dirname, 'bots', BOT, 'index.js'));
} catch (e) {
  console.error(`Cannot load bot ${BOT}: ${e.message}`);
  process.exit(1);
}

const PATHS = (arg('paths', '') ? arg('paths').split(',') : botCfg.paths || []).map((s) => s.trim()).filter(Boolean);
const MODELS = (arg('models', '') ? arg('models').split(',') : botCfg.allowedModels || []).map((s) => s.trim()).filter(Boolean);

if (PATHS.length === 0) {
  console.error('No paths to test.');
  process.exit(1);
}
if (MODELS.length === 0) {
  console.error('No models to test.');
  process.exit(1);
}

const totalCells = PATHS.length * MODELS.length;
const totalRenders = totalCells * COUNT;
console.log(`Bot: ${BOT}`);
console.log(`Paths: ${PATHS.length} — ${PATHS.join(', ')}`);
console.log(`Models: ${MODELS.length} — ${MODELS.map((m) => m.replace(/.*\//, '')).join(', ')}`);
console.log(`Renders: ${totalCells} cells × ${COUNT} each = ${totalRenders} total`);
console.log(`Posting: ${POST ? 'YES (live feed)' : 'no — /tmp only'}`);
console.log(`Output:  ${OUT}`);
console.log('');

const startISO = new Date().toISOString();

// Run one model serially across all paths
function modelShort(m) {
  return m
    .replace(/.*\//, '')
    .replace('gemini-2-image', 'banana')
    .replace('gpt-image-2', 'gpt2')
    .replace('flux-1.1-pro-ultra', 'f11ultra')
    .replace('flux-1.1-pro', 'f11pro')
    .replace('flux-2-pro', 'f2pro')
    .replace('flux-2-flex', 'f2flex')
    .replace('flux-2-max', 'f2max')
    .replace('flux-dev', 'fdev');
}

function runIterBot(p, m) {
  return new Promise((resolve, reject) => {
    const a = [
      'scripts/iter-bot.js',
      '--bot', BOT,
      '--mode', p,
      '--count', String(COUNT),
      '--model', m,
      '--label', `matrix-${modelShort(m)}`,
    ];
    if (POST) a.push('--post');
    const proc = spawn('node', a, { stdio: ['ignore', 'pipe', 'pipe'] });
    let killed = false;
    proc.on('close', (code) => {
      if (killed) return;
      if (code === 0) resolve();
      else reject(new Error(`iter-bot exited ${code} for ${p} × ${m}`));
    });
    // Light progress signal
    proc.stdout.on('data', (d) => {
      const s = d.toString();
      if (s.includes('posted:') || s.includes('saved:')) {
        process.stdout.write(`  ${modelShort(m)}/${p} ✓\n`);
      } else if (s.includes('failed')) {
        process.stdout.write(`  ${modelShort(m)}/${p} ✗\n`);
      }
    });
  });
}

async function runModelSerial(m) {
  for (const p of PATHS) {
    try {
      await runIterBot(p, m);
    } catch (e) {
      console.error(`  ${modelShort(m)}/${p} ERR: ${e.message}`);
    }
  }
  console.log(`✓ ${modelShort(m)} done (${PATHS.length} paths)`);
}

async function buildHtml() {
  // Lazy-load supabase client only when we need it
  const { createClient } = require('@supabase/supabase-js');
  try { require('dotenv').config({ path: '.env.local' }); } catch (_) {}
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('SUPABASE_SERVICE_ROLE_KEY / EXPO_PUBLIC_SUPABASE_URL missing from env. Aborting HTML build.');
    return;
  }
  const sb = createClient(url, key);

  // Find bot user_id
  const { data: bots } = await sb.from('users').select('id,username').ilike('username', `%${BOT}%`);
  if (!bots || !bots.length) {
    console.error(`Bot user "${BOT}" not found in users table.`);
    return;
  }
  const botId = bots[0].id;

  // Pull all posts since start
  const { data: ups } = await sb
    .from('uploads')
    .select('id,image_url,caption,model,created_at')
    .eq('user_id', botId)
    .gte('created_at', startISO)
    .order('created_at');
  console.log(`Found ${ups.length} ${BOT} posts since matrix start (${startISO}).`);

  // Group by path × model. With COUNT > 1 we keep an array of urls per cell.
  const grid = {};
  for (const u of ups) {
    const p = (u.caption.match(/^\[([^\]]+)\]/) || [])[1];
    if (!p || !PATHS.includes(p)) continue;
    if (!grid[p]) grid[p] = {};
    if (!grid[p][u.model]) grid[p][u.model] = [];
    grid[p][u.model].push(u.image_url);
  }

  const friendlyName = (m) =>
    m
      .replace(/^.*\//, '')
      .replace('gemini-2-image', 'Nano Banana')
      .replace('gpt-image-2', 'GPT Image 2')
      .replace('flux-1.1-pro-ultra', 'Flux 1.1 Pro Ultra')
      .replace('flux-1.1-pro', 'Flux 1.1 Pro')
      .replace('flux-2-pro', 'Flux 2 Pro')
      .replace('flux-2-flex', 'Flux 2 Flex')
      .replace('flux-2-max', 'Flux 2 Max')
      .replace('flux-dev', 'Flux Dev');

  let html = `<!doctype html><html><head><meta charset=utf-8><title>${BOT} ${PATHS.length}×${MODELS.length} matrix</title><style>
body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#0F0F1A;color:#FFF;margin:0;padding:20px}
h1{margin:0 0 6px 0;font-size:20px}
p.sub{color:#9CA3AF;margin:0 0 18px 0;font-size:13px}
table{border-collapse:separate;border-spacing:6px;width:100%}
th{font-size:11px;color:#9CA3AF;font-weight:600;text-align:center;padding:6px 4px;background:#1A1A2E;border-radius:4px}
th.path{text-align:left;padding:6px 10px}
td{background:#1A1A2E;border-radius:6px;overflow:hidden;vertical-align:top}
td img{width:100%;height:auto;display:block;cursor:pointer;transition:transform .2s}
td img:hover{transform:scale(1.04)}
td.empty{background:#1A1A2E;color:#444;text-align:center;padding:30px 0;font-size:12px}
.pathlbl{font-weight:600;font-size:13px;color:#FFF}
.cellstack{display:grid;grid-template-rows:repeat(auto-fit, 1fr);gap:2px}
</style></head><body>
<h1>${BOT} — ${PATHS.length} paths × ${MODELS.length} models${COUNT > 1 ? ' × ' + COUNT : ''}</h1>
<p class=sub>Generated ${new Date().toISOString().slice(0, 19)}Z. Click any image to open full-size in a new tab.</p>
<table><thead><tr><th class=path>Path</th>`;
  MODELS.forEach((m) => (html += `<th>${friendlyName(m)}</th>`));
  html += '</tr></thead><tbody>';
  let filled = 0, empty = 0;
  for (const p of PATHS) {
    html += `<tr><th class='path'><div class=pathlbl>${p}</div></th>`;
    for (const m of MODELS) {
      const urls = (grid[p] || {})[m] || [];
      if (urls.length === 0) {
        html += '<td class=empty>—</td>';
        empty++;
      } else {
        filled++;
        html += '<td><div class=cellstack>';
        for (const u of urls)
          html += `<a href='${u}' target=_blank><img loading=lazy src='${u}'></a>`;
        html += '</div></td>';
      }
    }
    html += '</tr>';
  }
  html += '</tbody></table></body></html>';
  fs.writeFileSync(OUT, html);
  console.log(`\n✓ Wrote ${OUT}`);
  console.log(`  Matrix: ${filled} filled, ${empty} missing of ${PATHS.length * MODELS.length} cells`);
  console.log(`\n  Open with: open ${OUT}`);
}

(async () => {
  // Throttle: cap concurrent model processes and wait for DB connection headroom
  // before each batch, so a matrix run can't saturate the pool + take the app
  // non-responsive (see DB_CONNECTION_SATURATION_PLAN.md). Override the cap with
  // MATRIX_CONCURRENCY, or bypass the guard with SKIP_POOL_GUARD=1.
  const MATRIX_CONCURRENCY = parseInt(process.env.MATRIX_CONCURRENCY || '3', 10);
  console.log(`Firing renders (≤${MATRIX_CONCURRENCY} model processes at a time, headroom-gated)...`);
  for (let i = 0; i < MODELS.length; i += MATRIX_CONCURRENCY) {
    const batch = MODELS.slice(i, i + MATRIX_CONCURRENCY);
    if (!process.env.SKIP_POOL_GUARD) {
      await waitForHeadroom({ min: 25, label: `matrix (models ${i + 1}-${i + batch.length}/${MODELS.length})` });
    }
    await Promise.all(batch.map(runModelSerial));
  }
  console.log('\nAll renders done. Building HTML matrix...\n');
  await buildHtml();
})().catch((e) => {
  console.error('Matrix failed:', e);
  process.exit(1);
});
