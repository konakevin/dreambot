#!/usr/bin/env node
/**
 * Combined Stage 4 + 5b bench (FACE_SWAP_UPGRADE_PLAN.md).
 *
 * Renders 10 couple targets (4 poses inside today's swap-safe contract + 6
 * CONTACT poses the pools currently ban), swaps each with BOTH engines:
 *   - our Fly dynamic engine (YuNet split / per-face composite)
 *   - easel-ai/advanced-face-swap on fal (native two-person swap)
 * then restores both with CodeFormer f=0.9 (the Stage-2 production setting).
 *
 * One grid answers two ledger rows: Stage 4 (is easel >= Fly on likeness?)
 * and Stage 5b (does the composite path handle contact poses well enough to
 * ship a contact pose pool?). Fly "rerender" rejections on contact poses are
 * themselves data — they show where detection gives up.
 *
 * Usage: node scripts/bench-dual-engines.js
 * Output: ~/Desktop/dual-engine-bench/index.html   (~$1.20 total spend)
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
const FAL = process.env.FAL_API_KEY;
const KEVIN = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const FLY_URL = 'https://dreambot-face-swap-dual.fly.dev/';
const FLY_TOKEN = fs
  .readFileSync(
    '/private/tmp/claude-501/-Users-kevinmchenry-Development-apps-dreambot/6fd5ca87-8c10-41e3-be85-6598fe6433e3/scratchpad/fly-token.txt',
    'utf8'
  )
  .trim();
const CODEFORMER = 'cc4956dd26fa5a7185d5660cc9100fab1b8070a1d1654a8bb5eb6d443b020bb2';
const FLUX_11_PRO = 'black-forest-labs/flux-1.1-pro';

const OUT = path.join(os.homedir(), 'Desktop', 'dual-engine-bench');

// Gender-locked couple scene prompts. GEO = today's contract; CONTACT = the
// poses the pools ban (both faces stay visible — the Stage-5 invariant).
const LOCK =
  'a MAN on the LEFT and a WOMAN on the RIGHT, both adults, both faces fully visible and turned toward the camera, ';
const TAIL =
  ', golden hour light, photorealistic, sharp faces, cinematic, vertical composition, no text';
const SCENES = [
  { key: 'safe-pier', kind: 'safe', p: LOCK + 'standing side by side with a clear gap between their heads, waist-up, on a sunset pier' + TAIL },
  { key: 'safe-cafe', kind: 'safe', p: LOCK + 'seated side by side at a Parisian cafe table, clear gap between their heads, waist-up' + TAIL },
  { key: 'safe-summit', kind: 'safe', p: LOCK + 'standing a step apart on a mountain summit, arms raised in triumph, heads apart' + TAIL },
  { key: 'safe-market', kind: 'safe', p: LOCK + 'standing side by side at a neon night market, holding street food, gap between heads' + TAIL },
  { key: 'contact-sidehug', kind: 'contact', p: LOCK + 'in a warm side hug, her head leaning near his shoulder, both smiling at the camera' + TAIL },
  { key: 'contact-dance', kind: 'contact', p: LOCK + 'slow dancing close together in the rain, his hand on her waist, both faces toward camera' + TAIL },
  { key: 'contact-dip', kind: 'contact', p: LOCK + 'mid dance dip, he dips her dramatically, both laughing, both faces visible to camera' + TAIL },
  { key: 'contact-piggyback', kind: 'contact', p: LOCK + 'piggyback ride, she rides on his back with her arms around his shoulders, both grinning at camera' + TAIL },
  { key: 'contact-cheek', kind: 'contact', p: LOCK + 'cheeks nearly touching as they lean in for a selfie-style closeup, both faces large and visible' + TAIL },
  { key: 'contact-armwalk', kind: 'contact', p: LOCK + 'walking arm in arm down a cobblestone street toward the camera, heads close, both faces clear' + TAIL },
];

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

async function flySwap(targetUrl, leftUrl, rightUrl, attempt = 1) {
  try {
    const res = await fetch(FLY_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${FLY_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetUrl,
        leftSourceUrl: leftUrl,
        rightSourceUrl: rightUrl,
        userId: KEVIN,
        deadlineMs: Date.now() + 130_000,
        leftGender: 'male',
        rightGender: 'female',
        traceId: 'bench-dual-engines',
      }),
      signal: AbortSignal.timeout(150_000),
    });
    const text = await res.text();
    let j;
    try { j = JSON.parse(text); } catch { throw new Error(`fly: non-JSON ${res.status} ${text.slice(0, 80)}`); }
    if (!res.ok || j.error) throw new Error(`fly: ${j.error ?? res.status}`);
    return j; // {swappedUrl|null, faceCount, status, variant}
  } catch (e) {
    // One retry on transport-level flakes (Fly proxy 502 / truncated body / timeout);
    // a clean status:'rerender' response returns above and is NOT retried.
    if (attempt < 2) {
      console.log(`  fly transport retry: ${e.message.slice(0, 60)}`);
      return flySwap(targetUrl, leftUrl, rightUrl, attempt + 1);
    }
    throw e;
  }
}

// fal's synchronous fal.run gateway hangs past 180s for this model — the first
// bench run timed out on EVERY scene. Queue API instead: submit, poll, fetch.
async function easelSwap(targetUrl, kevinUrl, stephUrl) {
  const submit = await fetch('https://queue.fal.run/easel-ai/advanced-face-swap', {
    method: 'POST',
    headers: { Authorization: `Key ${FAL}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      face_image_0: kevinUrl,
      gender_0: 'male',
      face_image_1: stephUrl,
      gender_1: 'female',
      target_image: targetUrl,
      workflow_type: 'target_hair',
      detailer: false,
      upscale: false,
    }),
    signal: AbortSignal.timeout(30_000),
  });
  const sub = await submit.json();
  if (!submit.ok || !sub.status_url) throw new Error(`easel submit: ${JSON.stringify(sub).slice(0, 150)}`);

  const deadline = Date.now() + 420_000;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 4000));
    const st = await (
      await fetch(sub.status_url, { headers: { Authorization: `Key ${FAL}` }, signal: AbortSignal.timeout(20_000) })
    ).json();
    if (st.status === 'COMPLETED') {
      const j = await (
        await fetch(sub.response_url, { headers: { Authorization: `Key ${FAL}` }, signal: AbortSignal.timeout(20_000) })
      ).json();
      const out = j.image?.url ?? j.images?.[0]?.url ?? j.output?.url;
      if (!out) throw new Error(`easel: ${JSON.stringify(j).slice(0, 150)}`);
      return out;
    }
    if (st.status === 'FAILED' || st.status === 'ERROR')
      throw new Error(`easel: ${st.status} ${JSON.stringify(st.error ?? '').slice(0, 100)}`);
  }
  throw new Error('easel: queue timeout (7min)');
}

const restore = (url) =>
  replicate(CODEFORMER, {
    image: url,
    codeformer_fidelity: 0.9,
    upscale: 1,
    face_upsample: true,
    background_enhance: false,
  }, 'codeformer');

async function download(url, file) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`dl ${res.status}`);
  fs.writeFileSync(path.join(OUT, file), Buffer.from(await res.arrayBuffer()));
  return file;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  // Cast sources — fresh signed URLs from the private cast bucket (3h).
  const { data: rec } = await sb.from('user_recipes').select('recipe').eq('user_id', KEVIN).single();
  const cast = rec.recipe.dream_cast ?? [];
  const self = cast.find((m) => m.role === 'self');
  const plusOne = cast.find((m) => m.role === 'plus_one');
  if (!self || !plusOne) throw new Error('need self + plus_one cast');
  async function castUrl(m) {
    if (m.storage_path) {
      const { data } = await sb.storage.from('cast-photos').createSignedUrl(m.storage_path, 10800);
      return data.signedUrl;
    }
    return m.thumb_url;
  }
  const kevinUrl = await castUrl(self);
  const stephUrl = await castUrl(plusOne);
  console.log('cast sources resolved');

  const rows = [];
  for (const scene of SCENES) {
    console.log(`— ${scene.key}: rendering target...`);
    const cells = [];
    let targetUrl;
    try {
      targetUrl = await replicate(null, { prompt: scene.p, aspect_ratio: '9:16', output_format: 'jpg', safety_tolerance: 2 }, 'flux', FLUX_11_PRO);
      cells.push({ label: 'target (unswapped)', file: await download(targetUrl, `${scene.key}-target.jpg`) });
    } catch (e) {
      console.warn(`  target FAILED: ${e.message}`);
      rows.push({ scene, cells: [{ label: `target FAILED: ${e.message.slice(0, 60)}`, file: null }] });
      continue;
    }

    // Fly + easel in parallel; restores follow each.
    const [fly, easel] = await Promise.allSettled([
      flySwap(targetUrl, kevinUrl, stephUrl),
      easelSwap(targetUrl, kevinUrl, stephUrl),
    ]);

    if (fly.status === 'fulfilled' && fly.value.swappedUrl) {
      cells.push({ label: `fly ${fly.value.variant ?? ''} (faces=${fly.value.faceCount})`, file: await download(fly.value.swappedUrl, `${scene.key}-fly.jpg`) });
      try {
        cells.push({ label: 'fly + restore', file: await download(await restore(fly.value.swappedUrl), `${scene.key}-fly-r.jpg`) });
      } catch (e) { cells.push({ label: `fly restore failed`, file: null }); }
    } else {
      const why = fly.status === 'fulfilled' ? `REJECTED faces=${fly.value.faceCount} (rerender signal)` : `error: ${fly.reason.message.slice(0, 60)}`;
      cells.push({ label: `fly — ${why}`, file: null });
      console.log(`  fly: ${why}`);
    }

    if (easel.status === 'fulfilled') {
      cells.push({ label: 'easel', file: await download(easel.value, `${scene.key}-easel.jpg`) });
      try {
        cells.push({ label: 'easel + restore', file: await download(await restore(easel.value), `${scene.key}-easel-r.jpg`) });
      } catch (e) { cells.push({ label: 'easel restore failed', file: null }); }
    } else {
      cells.push({ label: `easel — error: ${easel.reason.message.slice(0, 60)}`, file: null });
      console.log(`  easel: ${easel.reason.message.slice(0, 80)}`);
    }

    rows.push({ scene, cells });
    console.log(`  done (${cells.filter((c) => c.file).length} images)`);
  }

  const html = `<!doctype html><meta charset="utf-8"><title>Dual engine bench</title>
<style>
body{background:#0a0a12;color:#eee;font:14px system-ui;margin:20px}
h1{font-size:18px}.k{color:#9a8cff}
.row{display:flex;gap:8px;margin-bottom:20px;overflow-x:auto}
.cell{flex:0 0 250px}.cell img{width:250px;border-radius:8px;display:block}
.cell .lbl{font-size:12px;color:#aaa;margin:4px 0}
.fail{width:250px;height:440px;background:#1c1626;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#f66;text-align:center;font-size:12px;padding:10px}
.tag{font-size:12px;margin:2px 0;color:#9a8cff;font-weight:600}
</style>
<h1>Dual-engine bench — Fly (ours) vs easel · safe vs CONTACT poses · ${new Date().toISOString().slice(0, 10)}</h1>
<p>Judge: likeness of both faces + pose naturalness. A "REJECTED" fly cell on a contact pose = today's engine would re-render; easel succeeding there = the pose-freedom unlock.</p>
${rows.map(({ scene, cells }) => `<div class="tag">${scene.kind.toUpperCase()} · ${scene.key}</div><div class="row">${cells
    .map((c) => (c.file
      ? `<div class="cell"><div class="lbl">${c.label}</div><a href="${c.file}" target="_blank"><img src="${c.file}" loading="lazy"></a></div>`
      : `<div class="cell"><div class="lbl">${c.label}</div><div class="fail">${c.label}</div></div>`)).join('')}</div>`).join('\n')}`;
  fs.writeFileSync(path.join(OUT, 'index.html'), html);
  console.log(`\n✅ grid: ${path.join(OUT, 'index.html')}`);
})();
