#!/usr/bin/env node
/**
 * Stage 2 bench — post-swap face restoration (FACE_SWAP_UPGRADE_PLAN.md).
 *
 * Takes recent face-swapped renders from Kevin's account (no new render
 * spend), runs each through GFPGAN v1.4 and CodeFormer at three fidelity
 * levels via Replicate, downloads everything locally, and writes an HTML
 * compare grid for judging. inswapper_128 reconstructs identity at 128px —
 * the bench answers whether restoration recovers the detail and at what
 * setting, per FACE_SWAP_ENGINE_AUDIT.md Q1.
 *
 * Usage: node scripts/bench-face-restore.js [--count 12]
 * Output: ~/Desktop/faceswap-restore-bench/index.html
 * Cost: ~count × 4 × $0.0025 ≈ $0.12 at default count.
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const os = require('os');
const { createClient } = require('@supabase/supabase-js');

const sb = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const REPLICATE = process.env.REPLICATE_API_TOKEN;
const KEVIN = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';

const args = process.argv.slice(2);
const cIdx = args.indexOf('--count');
const COUNT = cIdx >= 0 ? Number(args[cIdx + 1]) : 12;

const OUT_DIR = path.join(os.homedir(), 'Desktop', 'faceswap-restore-bench');

async function latestVersion(owner, name) {
  const res = await fetch(`https://api.replicate.com/v1/models/${owner}/${name}`, {
    headers: { Authorization: `Bearer ${REPLICATE}` },
  });
  if (!res.ok) throw new Error(`${owner}/${name}: ${res.status}`);
  const j = await res.json();
  return j.latest_version.id;
}

async function runPrediction(version, input, label) {
  const create = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${REPLICATE}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ version, input }),
  });
  const pred = await create.json();
  if (pred.error || !pred.id) throw new Error(`${label}: ${pred.error ?? 'no id'}`);
  for (let i = 0; i < 120; i++) {
    await new Promise((r) => setTimeout(r, 1500));
    const poll = await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, {
      headers: { Authorization: `Bearer ${REPLICATE}` },
    });
    const p = await poll.json();
    if (p.status === 'succeeded') {
      const out = Array.isArray(p.output) ? p.output[0] : p.output;
      if (!out) throw new Error(`${label}: empty output`);
      return out;
    }
    if (p.status === 'failed' || p.status === 'canceled') {
      throw new Error(`${label}: ${p.status} ${p.error ?? ''}`);
    }
  }
  throw new Error(`${label}: poll timeout`);
}

async function download(url, file) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download ${res.status}`);
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Half recent singles, half recent DUALS — duals are the harder case
  // (halved crops = smaller faces feeding inswapper's 128px identity).
  const half = Math.ceil(COUNT / 2);
  const { data: singles, error } = await sb
    .from('uploads')
    .select('id, image_url, face_swap_mode, dream_medium, created_at')
    .eq('user_id', KEVIN)
    .eq('face_swap_mode', 'single')
    .order('created_at', { ascending: false })
    .limit(half);
  if (error) throw error;
  const { data: duals } = await sb
    .from('uploads')
    .select('id, image_url, face_swap_mode, dream_medium, created_at')
    .eq('user_id', KEVIN)
    .eq('face_swap_mode', 'dual')
    .order('created_at', { ascending: false })
    .limit(COUNT - half);
  const renders = [...(duals ?? []), ...(singles ?? [])];
  if (!renders.length) throw new Error('no swapped renders found');
  console.log(
    `${renders.length} swapped renders (mix: ${renders.map((r) => r.face_swap_mode).join(',')})`
  );

  const [gfpganV, codeformerV] = await Promise.all([
    latestVersion('tencentarc', 'gfpgan'),
    latestVersion('sczhou', 'codeformer'),
  ]);
  console.log('gfpgan', gfpganV.slice(0, 12), '| codeformer', codeformerV.slice(0, 12));

  const VARIANTS = [
    {
      key: 'gfpgan',
      label: 'GFPGAN v1.4',
      run: (img) => runPrediction(gfpganV, { img, version: 'v1.4', scale: 1 }, 'gfpgan'),
    },
    {
      key: 'cf05',
      label: 'CodeFormer f=0.5',
      run: (img) =>
        runPrediction(
          codeformerV,
          {
            image: img,
            codeformer_fidelity: 0.5,
            upscale: 1,
            face_upsample: true,
            background_enhance: false,
          },
          'cf05'
        ),
    },
    {
      key: 'cf07',
      label: 'CodeFormer f=0.7',
      run: (img) =>
        runPrediction(
          codeformerV,
          {
            image: img,
            codeformer_fidelity: 0.7,
            upscale: 1,
            face_upsample: true,
            background_enhance: false,
          },
          'cf07'
        ),
    },
    {
      key: 'cf09',
      label: 'CodeFormer f=0.9',
      run: (img) =>
        runPrediction(
          codeformerV,
          {
            image: img,
            codeformer_fidelity: 0.9,
            upscale: 1,
            face_upsample: true,
            background_enhance: false,
          },
          'cf09'
        ),
    },
  ];

  const rows = [];
  for (const [i, r] of renders.entries()) {
    const rowId = `r${i}`;
    const origFile = `${rowId}-orig.jpg`;
    await download(r.image_url, path.join(OUT_DIR, origFile));
    const cells = [
      { label: `original (${r.face_swap_mode}, ${r.dream_medium ?? '—'})`, file: origFile },
    ];
    // Variants in parallel per render (4 predictions), renders sequential to be
    // polite to Replicate rate limits.
    const results = await Promise.allSettled(
      VARIANTS.map(async (v) => {
        const out = await v.run(r.image_url);
        const file = `${rowId}-${v.key}.jpg`;
        await download(out, path.join(OUT_DIR, file));
        return { label: v.label, file };
      })
    );
    for (const [vi, res] of results.entries()) {
      if (res.status === 'fulfilled') cells.push(res.value);
      else {
        console.warn(`  ${rowId} ${VARIANTS[vi].key} FAILED: ${res.reason.message}`);
        cells.push({ label: `${VARIANTS[vi].label} — FAILED`, file: null });
      }
    }
    rows.push({ id: r.id, cells });
    console.log(`row ${i + 1}/${renders.length} done`);
  }

  const html = `<!doctype html><meta charset="utf-8"><title>Face restore bench</title>
<style>
body{background:#0a0a12;color:#eee;font:14px system-ui;margin:20px}
h1{font-size:18px} .row{display:flex;gap:8px;margin-bottom:18px;overflow-x:auto}
.cell{flex:0 0 240px}.cell img{width:240px;border-radius:8px;display:block}
.cell .lbl{font-size:12px;color:#aaa;margin:4px 0}.fail{width:240px;height:420px;background:#222;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#f66}
a{color:inherit}
</style>
<h1>Post-swap face restoration bench — ${new Date().toISOString().slice(0, 10)} (${rows.length} renders × 4 variants)</h1>
<p>Judge the FACE only (identity + integration). Click any image for full size.</p>
${rows
  .map(
    (row) =>
      `<div class="row">${row.cells
        .map((c) =>
          c.file
            ? `<div class="cell"><div class="lbl">${c.label}</div><a href="${c.file}" target="_blank"><img src="${c.file}" loading="lazy"></a></div>`
            : `<div class="cell"><div class="lbl">${c.label}</div><div class="fail">failed</div></div>`
        )
        .join('')}</div>`
  )
  .join('\n')}`;
  fs.writeFileSync(path.join(OUT_DIR, 'index.html'), html);
  console.log(`\n✅ bench grid: ${path.join(OUT_DIR, 'index.html')}`);
})();
