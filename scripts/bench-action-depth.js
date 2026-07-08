#!/usr/bin/env node
/**
 * Stage 5b depth QA — pass-rate statistics per action family.
 *
 * The single-shot action bench (bench-dynamic-actions.js) showed 11/12 action
 * families swapping; one shot proves nothing about RATE. This bench renders
 * each family REPS times through the full production leg (Flux target → Fly
 * dual swap → CodeFormer restore) and reports per-family pass rates + the
 * engine's stated reject reasons (no_split:* vs gender_unconfirmed:* — pose
 * wording problem vs gender-read problem, different fixes).
 *
 * Usage: node scripts/bench-action-depth.js
 * Output: ~/Desktop/action-depth-qa/index.html + stats.json  (~$3.50 spend)
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
const REPS = 5;

const OUT = path.join(os.homedir(), 'Desktop', 'action-depth-qa');

const LOCK =
  'a MAN on the LEFT and a WOMAN on the RIGHT, both adults, both faces fully visible and turned toward the camera, ';
const TAIL =
  ', golden hour light, photorealistic, sharp faces, cinematic, vertical composition, no text';
const SCENES = [
  {
    key: 'surfing',
    p:
      LOCK +
      'each riding their own surfboard side by side on the same peeling wave, knees bent mid-carve, spray flying' +
      TAIL,
  },
  {
    key: 'jetski',
    p:
      LOCK +
      'racing across the water on a jetski, he drives and she sits behind him with her arms around his waist, both grinning through the spray' +
      TAIL,
  },
  {
    key: 'swing-dance',
    p:
      LOCK +
      'mid swing-dance spin holding hands, her dress flaring, caught mid-motion under string lights' +
      TAIL,
  },
  {
    key: 'salsa',
    p:
      LOCK +
      'salsa dancing mid-turn on a rooftop at dusk, connected at the hands, both laughing' +
      TAIL,
  },
  {
    key: 'kayak',
    p:
      LOCK +
      'paddling a tandem kayak through gentle whitewater, paddles mid-stroke, splash frozen in the air' +
      TAIL,
  },
  {
    key: 'bikes',
    p:
      LOCK +
      'riding beach cruiser bicycles side by side along a boardwalk, mid-pedal, hair in the wind' +
      TAIL,
  },
  {
    key: 'skiing',
    p: LOCK + 'skiing side by side through fresh powder, snow spraying from their turns' + TAIL,
  },
  {
    key: 'ocean-play',
    p:
      LOCK +
      'waist-deep in breaking ocean waves splashing water at each other, droplets frozen mid-air' +
      TAIL,
  },
  {
    key: 'ridge-scramble',
    p:
      LOCK +
      'scrambling up a rocky summit ridge, he reaches back to pull her up by the hand, both looking toward the camera' +
      TAIL,
  },
  {
    key: 'flour-fight',
    p:
      LOCK +
      'a playful flour fight in a warm kitchen, flour cloud mid-air, aprons dusted white, both mid-laugh' +
      TAIL,
  },
  {
    key: 'ice-skating',
    p:
      LOCK +
      'ice skating holding hands mid-glide on an outdoor rink, one skate lifted, scarves trailing' +
      TAIL,
  },
  {
    key: 'rollercoaster',
    p:
      LOCK + 'front row of a rollercoaster mid-drop, hands thrown up, hair flying, pure joy' + TAIL,
  },
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
        traceId: 'bench-action-depth',
      }),
      signal: AbortSignal.timeout(150_000),
    });
    const text = await res.text();
    let j;
    try {
      j = JSON.parse(text);
    } catch {
      throw new Error(`fly: non-JSON ${res.status} ${text.slice(0, 80)}`);
    }
    if (!res.ok || j.error) throw new Error(`fly: ${j.error ?? res.status}`);
    return j; // {swappedUrl|null, faceCount, status, reason, variant, elapsedMs}
  } catch (e) {
    if (attempt < 2) {
      console.log(`  fly transport retry: ${e.message.slice(0, 60)}`);
      return flySwap(targetUrl, leftUrl, rightUrl, attempt + 1);
    }
    throw e;
  }
}

const restore = (url) =>
  replicate(
    CODEFORMER,
    {
      image: url,
      codeformer_fidelity: 0.9,
      upscale: 1,
      face_upsample: true,
      background_enhance: false,
    },
    'codeformer'
  );

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
  const self = cast.find((m) => m.role === 'self');
  const plusOne = cast.find((m) => m.role === 'plus_one');
  if (!self || !plusOne) throw new Error('need self + plus_one cast');
  async function castUrl(m) {
    if (m.storage_path) {
      const { data } = await sb.storage.from('cast-photos').createSignedUrl(m.storage_path, 21600);
      return data.signedUrl;
    }
    return m.thumb_url;
  }
  const kevinUrl = await castUrl(self);
  const stephUrl = await castUrl(plusOne);
  console.log(`cast resolved — ${SCENES.length} families x ${REPS} reps`);

  const stats = {};
  const rows = [];
  for (const scene of SCENES) {
    const fam = { pass: 0, fail: 0, reasons: {}, swapMs: [] };
    stats[scene.key] = fam;
    const cells = [];
    for (let rep = 1; rep <= REPS; rep++) {
      const id = `${scene.key}-${rep}`;
      try {
        const targetUrl = await replicate(
          null,
          { prompt: scene.p, aspect_ratio: '9:16', output_format: 'jpg', safety_tolerance: 2 },
          'flux',
          FLUX_11_PRO
        );
        const fly = await flySwap(targetUrl, kevinUrl, stephUrl);
        if (fly.swappedUrl) {
          fam.pass++;
          fam.swapMs.push(fly.elapsedMs ?? 0);
          const restored = await restore(fly.swappedUrl);
          cells.push({
            label: `#${rep} PASS (${Math.round((fly.elapsedMs ?? 0) / 1000)}s)`,
            file: await download(restored, `${id}.jpg`),
            ok: true,
          });
        } else {
          fam.fail++;
          const why = fly.reason ?? `faces=${fly.faceCount}`;
          fam.reasons[why] = (fam.reasons[why] ?? 0) + 1;
          cells.push({
            label: `#${rep} REJECT ${why}`,
            file: await download(targetUrl, `${id}-target.jpg`),
            ok: false,
          });
        }
      } catch (e) {
        fam.fail++;
        fam.reasons['error'] = (fam.reasons['error'] ?? 0) + 1;
        cells.push({ label: `#${rep} ERROR ${e.message.slice(0, 40)}`, file: null, ok: false });
        console.log(`  ${id}: ${e.message.slice(0, 80)}`);
      }
    }
    rows.push({ scene, cells });
    console.log(
      `— ${scene.key}: ${fam.pass}/${REPS} pass${Object.keys(fam.reasons).length ? ' rejects: ' + JSON.stringify(fam.reasons) : ''}`
    );
  }

  fs.writeFileSync(path.join(OUT, 'stats.json'), JSON.stringify(stats, null, 2));

  const html = `<!doctype html><meta charset="utf-8"><title>Action depth QA</title>
<style>
body{background:#0a0a12;color:#eee;font:14px system-ui;margin:20px}
h1{font-size:18px}
table{border-collapse:collapse;margin-bottom:24px}
td,th{border:1px solid #333;padding:4px 10px;font-size:13px}
.row{display:flex;gap:8px;margin-bottom:20px;overflow-x:auto}
.cell{flex:0 0 200px}.cell img{width:200px;border-radius:8px;display:block}
.cell .lbl{font-size:11px;color:#aaa;margin:3px 0}
.cell.bad .lbl{color:#f66}
.fail{width:200px;height:352px;background:#1c1626;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#f66;text-align:center;font-size:11px;padding:8px}
.tag{font-size:12px;margin:2px 0;color:#9a8cff;font-weight:600}
</style>
<h1>Action depth QA — ${REPS} reps/family, full production leg (Flux → Fly swap → restore) · ${new Date().toISOString().slice(0, 10)}</h1>
<table><tr><th>family</th><th>pass</th><th>reject reasons</th><th>swap p50</th></tr>
${SCENES.map((s) => {
  const f = stats[s.key];
  const med = f.swapMs.sort((a, b) => a - b)[Math.floor(f.swapMs.length / 2)] ?? 0;
  return `<tr><td>${s.key}</td><td>${f.pass}/${REPS}</td><td>${
    Object.entries(f.reasons)
      .map(([k, v]) => `${k}×${v}`)
      .join(', ') || '—'
  }</td><td>${Math.round(med / 1000)}s</td></tr>`;
}).join('')}
</table>
<p>REJECT cells show the UNSWAPPED target so you can see what the detector saw. Judge PASS cells on faces only.</p>
${rows
  .map(
    ({ scene, cells }) =>
      `<div class="tag">${scene.key} — ${stats[scene.key].pass}/${REPS}</div><div class="row">${cells
        .map((c) =>
          c.file
            ? `<div class="cell${c.ok ? '' : ' bad'}"><div class="lbl">${c.label}</div><a href="${c.file}" target="_blank"><img src="${c.file}" loading="lazy"></a></div>`
            : `<div class="cell bad"><div class="lbl">${c.label}</div><div class="fail">${c.label}</div></div>`
        )
        .join('')}</div>`
  )
  .join('\n')}`;
  fs.writeFileSync(path.join(OUT, 'index.html'), html);
  console.log(`\n✅ grid: ${path.join(OUT, 'index.html')}`);
  console.log(
    JSON.stringify(
      Object.fromEntries(Object.entries(stats).map(([k, v]) => [k, `${v.pass}/${REPS}`]))
    )
  );
})();
