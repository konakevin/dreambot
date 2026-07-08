#!/usr/bin/env node
/**
 * Stage 5b extension — DYNAMIC ACTION scenes (Kevin 2026-07-08: "show us both
 * surfing, show us on a jetski, show us dancing together ... all sorts of
 * scenes or actions a couple might be engaged in besides sitting or standing
 * side by side").
 *
 * Renders 12 couple ACTION targets (sport / dance / play — bodies in motion,
 * both faces kept camera-visible, gender-locked sides), swaps each through OUR
 * Fly dynamic engine only (easel was rejected on latency — Stage 4 ledger),
 * restores with CodeFormer f=0.9. Fly "rerender" rejections are data: they map
 * which action families today's detector can't split.
 *
 * Usage: node scripts/bench-dynamic-actions.js
 * Output: ~/Desktop/dynamic-action-bench/index.html   (~$0.70 total spend)
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
const FLY_URL = 'https://dreambot-face-swap-dual.fly.dev/';
const FLY_TOKEN = fs
  .readFileSync(
    '/private/tmp/claude-501/-Users-kevinmchenry-Development-apps-dreambot/6fd5ca87-8c10-41e3-be85-6598fe6433e3/scratchpad/fly-token.txt',
    'utf8'
  )
  .trim();
const CODEFORMER = 'cc4956dd26fa5a7185d5660cc9100fab1b8070a1d1654a8bb5eb6d443b020bb2';
const FLUX_11_PRO = 'black-forest-labs/flux-1.1-pro';

const OUT = path.join(os.homedir(), 'Desktop', 'dynamic-action-bench');

// Gender-locked action prompts. Every scene keeps BOTH faces toward the camera
// (the swap invariant) but the BODIES are genuinely mid-action — the question
// is whether detection + per-face composite survive motion, lean, spray, and
// smaller faces in wider sports framing.
const LOCK =
  'a MAN on the LEFT and a WOMAN on the RIGHT, both adults, both faces fully visible and turned toward the camera, ';
const TAIL =
  ', golden hour light, photorealistic, sharp faces, cinematic, vertical composition, no text';
const SCENES = [
  { key: 'surfing', p: LOCK + 'each riding their own surfboard side by side on the same peeling wave, knees bent mid-carve, spray flying' + TAIL },
  { key: 'jetski', p: LOCK + 'racing across the water on a jetski, he drives and she sits behind him with her arms around his waist, both grinning through the spray' + TAIL },
  { key: 'swing-dance', p: LOCK + 'mid swing-dance spin holding hands, her dress flaring, caught mid-motion under string lights' + TAIL },
  { key: 'salsa', p: LOCK + 'salsa dancing mid-turn on a rooftop at dusk, connected at the hands, both laughing' + TAIL },
  { key: 'kayak', p: LOCK + 'paddling a tandem kayak through gentle whitewater, paddles mid-stroke, splash frozen in the air' + TAIL },
  { key: 'bikes', p: LOCK + 'riding beach cruiser bicycles side by side along a boardwalk, mid-pedal, hair in the wind' + TAIL },
  { key: 'skiing', p: LOCK + 'skiing side by side through fresh powder, snow spraying from their turns' + TAIL },
  { key: 'ocean-play', p: LOCK + 'waist-deep in breaking ocean waves splashing water at each other, droplets frozen mid-air' + TAIL },
  { key: 'ridge-scramble', p: LOCK + 'scrambling up a rocky summit ridge, he reaches back to pull her up by the hand, both looking toward the camera' + TAIL },
  { key: 'flour-fight', p: LOCK + 'a playful flour fight in a warm kitchen, flour cloud mid-air, aprons dusted white, both mid-laugh' + TAIL },
  { key: 'ice-skating', p: LOCK + 'ice skating holding hands mid-glide on an outdoor rink, one skate lifted, scarves trailing' + TAIL },
  { key: 'rollercoaster', p: LOCK + 'front row of a rollercoaster mid-drop, hands thrown up, hair flying, pure joy' + TAIL },
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
        traceId: 'bench-dynamic-actions',
      }),
      signal: AbortSignal.timeout(150_000),
    });
    const text = await res.text();
    let j;
    try { j = JSON.parse(text); } catch { throw new Error(`fly: non-JSON ${res.status} ${text.slice(0, 80)}`); }
    if (!res.ok || j.error) throw new Error(`fly: ${j.error ?? res.status}`);
    return j; // {swappedUrl|null, faceCount, status, variant}
  } catch (e) {
    if (attempt < 2) {
      console.log(`  fly transport retry: ${e.message.slice(0, 60)}`);
      return flySwap(targetUrl, leftUrl, rightUrl, attempt + 1);
    }
    throw e;
  }
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

    try {
      const fly = await flySwap(targetUrl, kevinUrl, stephUrl);
      if (fly.swappedUrl) {
        cells.push({ label: `fly ${fly.variant ?? ''} (faces=${fly.faceCount})`, file: await download(fly.swappedUrl, `${scene.key}-fly.jpg`) });
        try {
          cells.push({ label: 'fly + restore', file: await download(await restore(fly.swappedUrl), `${scene.key}-fly-r.jpg`) });
        } catch (e) { cells.push({ label: 'fly restore failed', file: null }); }
      } else {
        cells.push({ label: `fly — REJECTED faces=${fly.faceCount} (rerender signal)`, file: null });
        console.log(`  fly: REJECTED faces=${fly.faceCount}`);
      }
    } catch (e) {
      cells.push({ label: `fly — error: ${e.message.slice(0, 60)}`, file: null });
      console.log(`  fly: ${e.message.slice(0, 80)}`);
    }

    rows.push({ scene, cells });
    console.log(`  done (${cells.filter((c) => c.file).length} images)`);
  }

  const html = `<!doctype html><meta charset="utf-8"><title>Dynamic action bench</title>
<style>
body{background:#0a0a12;color:#eee;font:14px system-ui;margin:20px}
h1{font-size:18px}.k{color:#9a8cff}
.row{display:flex;gap:8px;margin-bottom:20px;overflow-x:auto}
.cell{flex:0 0 250px}.cell img{width:250px;border-radius:8px;display:block}
.cell .lbl{font-size:12px;color:#aaa;margin:4px 0}
.fail{width:250px;height:440px;background:#1c1626;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#f66;text-align:center;font-size:12px;padding:10px}
.tag{font-size:12px;margin:2px 0;color:#9a8cff;font-weight:600}
</style>
<h1>Dynamic ACTION bench — couple mid-activity, our Fly engine + restore · ${new Date().toISOString().slice(0, 10)}</h1>
<p>Judge FACES ONLY (integration + likeness — hair/wardrobe variance is fine). A REJECTED cell = the detector couldn't split two clean faces on that action; that action family needs pose-level rewording before it can join the pools.</p>
${rows.map(({ scene, cells }) => `<div class="tag">${scene.key}</div><div class="row">${cells
    .map((c) => (c.file
      ? `<div class="cell"><div class="lbl">${c.label}</div><a href="${c.file}" target="_blank"><img src="${c.file}" loading="lazy"></a></div>`
      : `<div class="cell"><div class="lbl">${c.label}</div><div class="fail">${c.label}</div></div>`)).join('')}</div>`).join('\n')}`;
  fs.writeFileSync(path.join(OUT, 'index.html'), html);
  console.log(`\n✅ grid: ${path.join(OUT, 'index.html')}`);
})();
