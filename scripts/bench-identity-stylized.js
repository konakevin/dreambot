#!/usr/bin/env node
/**
 * Stage 8b (part 2) — identity-score distributions PER MEDIUM.
 *
 * The realistic threshold (0.35, owner-picked 2026-07-08) is only valid for
 * photoreal render bases: stylized mediums score lower against the cast photo
 * even on perfect swaps, and most production character duals are stylized
 * (nightly re-rolls realistic away). This bench renders the SAME safe couple
 * pose across 6 mediums (photography = control + 5 stylized, fragments
 * verbatim from dream_mediums), swaps via the production Fly engine, and
 * scores the SWAP OUTPUT (pre-restore — exactly what production shadow
 * measures). Output: per-medium sorted grids → the owner picks a line per
 * medium, or leaves it shadow-only where good/bad don't separate.
 *
 * Usage: node scripts/bench-identity-stylized.js
 * Output: ~/Desktop/identity-stylized/index.html + sims.json  (~$1.20)
 */

require('dotenv').config({ path: '/Users/kevinmchenry/Development/apps/dreambot/.env.local' });
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
const FLY = 'https://dreambot-face-swap-dual.fly.dev';
const FLY_TOKEN = fs
  .readFileSync(
    '/private/tmp/claude-501/-Users-kevinmchenry-Development-apps-dreambot/6fd5ca87-8c10-41e3-be85-6598fe6433e3/scratchpad/fly-token.txt',
    'utf8'
  )
  .trim();
const FLUX_11_PRO = 'black-forest-labs/flux-1.1-pro';
const REPS = 4;
const MEDIUMS = ['photography', 'watercolor', 'canvas', 'illustration', 'storybook', 'fairytale'];

const OUT = path.join(os.homedir(), 'Desktop', 'identity-stylized');

const SCENE =
  'a MAN on the LEFT and a WOMAN on the RIGHT, both adults, standing side by side with a clear gap between their heads, both faces large, frontal, fully visible and turned toward the camera, waist-up, at a sunlit harbor with boats behind them';

async function replicate(version, input, label, modelPath) {
  const url = modelPath
    ? `https://api.replicate.com/v1/models/${modelPath}/predictions`
    : 'https://api.replicate.com/v1/predictions';
  const body = modelPath ? { input } : { version, input };
  const create = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REPLICATE}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const pred = await create.json();
  if (!pred.id) throw new Error(`${label}: ${JSON.stringify(pred).slice(0, 150)}`);
  for (let i = 0; i < 180; i++) {
    await new Promise((r) => setTimeout(r, 1500));
    const p = await (
      await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, {
        headers: { Authorization: `Bearer ${REPLICATE}` },
      })
    ).json();
    if (p.status === 'succeeded') {
      const out = Array.isArray(p.output) ? p.output[0] : p.output;
      if (!out) throw new Error(`${label}: empty output`);
      return out;
    }
    if (p.status === 'failed' || p.status === 'canceled')
      throw new Error(`${label}: ${p.status} ${String(p.error).slice(0, 100)}`);
  }
  throw new Error(`${label}: timeout`);
}

async function flyPost(pathname, body) {
  const r = await fetch(`${FLY}${pathname}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${FLY_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(160_000),
  });
  const text = await r.text();
  let j;
  try {
    j = JSON.parse(text);
  } catch {
    throw new Error(`fly ${pathname}: non-JSON ${r.status} ${text.slice(0, 80)}`);
  }
  if (!r.ok || j.error) throw new Error(`fly ${pathname}: ${j.error ?? r.status}`);
  return j;
}

async function download(url, file) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`dl ${res.status}`);
  fs.writeFileSync(path.join(OUT, file), Buffer.from(await res.arrayBuffer()));
  return file;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  const { data: rec } = await sb
    .from('user_recipes')
    .select('recipe')
    .eq('user_id', KEVIN)
    .single();
  const cast = rec.recipe.dream_cast ?? [];
  const refs = [];
  const srcs = {};
  for (const role of ['self', 'plus_one']) {
    const m = cast.find((x) => x.role === role);
    const { data } = await sb.storage.from('cast-photos').createSignedUrl(m.storage_path, 21600);
    refs.push(data.signedUrl);
    srcs[role] = data.signedUrl;
  }
  const { data: meds } = await sb
    .from('dream_mediums')
    .select('key,flux_fragment')
    .in('key', MEDIUMS);
  console.log(`cast + ${meds.length} mediums resolved — ${MEDIUMS.length} x ${REPS}`);

  const rows = [];
  for (const key of MEDIUMS) {
    const med = meds.find((m) => m.key === key);
    const cells = [];
    for (let rep = 1; rep <= REPS; rep++) {
      const id = `${key}-${rep}`;
      try {
        const prompt = `${SCENE}, ${med.flux_fragment}, vertical composition, no text`;
        const targetUrl = await replicate(
          null,
          { prompt, aspect_ratio: '9:16', output_format: 'jpg', safety_tolerance: 2 },
          'flux',
          FLUX_11_PRO
        );
        const swap = await flyPost('/', {
          targetUrl,
          leftSourceUrl: srcs.self,
          rightSourceUrl: srcs.plus_one,
          userId: KEVIN,
          deadlineMs: Date.now() + 130_000,
          leftGender: 'male',
          rightGender: 'female',
          traceId: 'bench-identity-stylized',
        });
        if (!swap.swappedUrl) {
          cells.push({
            id,
            min: null,
            reject: swap.reason ?? `faces=${swap.faceCount}`,
            file: await download(targetUrl, `${id}-target.jpg`),
          });
          console.log(`  ${id}: REJECT ${swap.reason ?? ''}`);
          continue;
        }
        const v = await flyPost('/verify', { imageUrl: swap.swappedUrl, refs });
        const byX = [...(v.faces ?? [])].sort((a, b) => a.x - b.x);
        const s00 = byX[0]?.sims?.[0] ?? null;
        const s01 = byX[0]?.sims?.[1] ?? null;
        const s10 = byX[1]?.sims?.[0] ?? null;
        const s11 = byX[1]?.sims?.[1] ?? null;
        const flipped = (s01 ?? 0) + (s10 ?? 0) > (s00 ?? 0) + (s11 ?? 0);
        const left = flipped ? s01 : s00;
        const right = flipped ? s10 : s11;
        const min = Math.min(left ?? 0, right ?? 0);
        cells.push({
          id,
          left,
          right,
          min,
          flipped,
          faces: (v.faces ?? []).length,
          file: await download(swap.swappedUrl, `${id}.jpg`),
        });
        console.log(`  ${id}: L=${left ?? '—'} R=${right ?? '—'} min=${min}`);
      } catch (e) {
        cells.push({ id, min: null, error: e.message.slice(0, 60), file: null });
        console.log(`  ${id}: ERROR ${e.message.slice(0, 70)}`);
      }
    }
    rows.push({ key, cells });
    const mins = cells.map((c) => c.min).filter((v) => v !== null);
    console.log(`— ${key}: mins=[${mins.join(', ')}]`);
  }

  fs.writeFileSync(path.join(OUT, 'sims.json'), JSON.stringify(rows, null, 2));

  const html = `<!doctype html><meta charset="utf-8"><title>Identity per medium</title>
<style>
body{background:#0a0a12;color:#eee;font:14px system-ui;margin:20px}
h1{font-size:18px}
.row{display:flex;gap:8px;margin-bottom:20px;overflow-x:auto}
.cell{flex:0 0 210px}.cell img{width:210px;border-radius:8px;display:block}
.cell .lbl{font-size:11px;color:#aaa;margin:3px 0}
.cell .sim{font-size:13px;font-weight:700}
.low .sim{color:#f66}.mid .sim{color:#fc6}.high .sim{color:#6f6}
.fail{width:210px;height:370px;background:#1c1626;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#f66;font-size:11px;text-align:center;padding:8px}
.tag{font-size:13px;margin:2px 0;color:#9a8cff;font-weight:700}
</style>
<h1>Identity scores per medium — same safe pose, swap output (pre-restore) · ${new Date().toISOString().slice(0, 10)}</h1>
<p>photography = control (compare to the 0.35 realistic line). For each stylized medium: do the numbers separate "really us" from "not us"? If yes, name the line; if no, that medium stays shadow-only.</p>
${rows
  .map(
    ({ key, cells }) =>
      `<div class="tag">${key}</div><div class="row">${cells
        .map((c) => {
          if (!c.file)
            return `<div class="cell"><div class="fail">${c.id} — ${c.error ?? c.reject ?? ''}</div></div>`;
          if (c.min === null)
            return `<div class="cell low"><a href="${c.file}" target="_blank"><img src="${c.file}" loading="lazy"></a><div class="sim">REJECT ${c.reject ?? ''}</div><div class="lbl">${c.id} (unswapped target)</div></div>`;
          const cls = c.min < 0.2 ? 'low' : c.min < 0.35 ? 'mid' : 'high';
          return `<div class="cell ${cls}"><a href="${c.file}" target="_blank"><img src="${c.file}" loading="lazy"></a><div class="sim">min ${c.min} (L ${c.left ?? '—'} / R ${c.right ?? '—'})${c.flipped ? ' ⇄' : ''}</div><div class="lbl">${c.id}</div></div>`;
        })
        .join('')}</div>`
  )
  .join('\n')}`;
  fs.writeFileSync(path.join(OUT, 'index.html'), html);
  console.log(`\n✅ grid: ${path.join(OUT, 'index.html')}`);
})();
