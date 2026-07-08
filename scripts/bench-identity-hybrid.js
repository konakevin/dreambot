#!/usr/bin/env node
/**
 * Stage 7 spike — identity-conditioned generation vs the production swap leg.
 *
 * Every hosted swap engine we use is inswapper_128 underneath: identity encoded
 * at 128px, pasted frontal. That caps likeness AND composition (profiles,
 * far shots, extreme poses can't take a paste). Identity-conditioned models
 * render the scene WITH the identity woven in from the start:
 *   - bytedance/flux-pulid   (PuLID-FLUX, id_weight conditioning)
 *   - zsxkib/infinite-you    (InfiniteYou InfuseNet, aes_stage2)
 * vs the current production leg (Flux 1.1-pro render → cdingram swap →
 * CodeFormer restore) on 8 EXPRESSIVE solo compositions the swap contract
 * currently forbids or handles poorly.
 *
 * Usage: node scripts/bench-identity-hybrid.js
 * Output: ~/Desktop/identity-hybrid-bench/index.html  (~$2 spend)
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
const CODEFORMER = 'cc4956dd26fa5a7185d5660cc9100fab1b8070a1d1654a8bb5eb6d443b020bb2';
const CDINGRAM = 'd1d6ea8c8be89d664a07a457526f7128109dee7030fdac424788d762c71ed111';
// Community models must be called by VERSION HASH via POST /v1/predictions —
// the models/<owner>/<name>/predictions route 404s for them (official-only).
const PULID = '8baa7ef2255075b46f4d91cd238c21d31181b3e6a864463f967960bb0112525b';
const INFU = 'b1370c5f5b1bb078eaa87332641c9cc6b89fff1bbd5c61f9e0e81370541b24f0';
const FLUX_11_PRO = 'black-forest-labs/flux-1.1-pro';

const OUT = path.join(os.homedir(), 'Desktop', 'identity-hybrid-bench');

// Solo scenes deliberately OUTSIDE the current swap contract (which requires a
// big, frontal, camera-facing face). PuLID/InfiniteYou should shine here; the
// production leg's result shows what users get today on the nearest allowed
// framing.
const SUBJ = 'a fit man in his 40s with short brown hair';
const TAIL = ', golden hour, photorealistic, cinematic, vertical composition, no text';
const SCENES = [
  {
    key: 'profile',
    p:
      `strict side profile portrait of ${SUBJ} gazing at the horizon from a sea cliff, wind in his hair` +
      TAIL,
  },
  {
    key: 'low-angle',
    p:
      `dramatic low-angle shot looking up at ${SUBJ} standing on a boulder summit, storm clouds behind` +
      TAIL,
  },
  {
    key: 'far-vista',
    p:
      `${SUBJ} standing small in a vast canyon landscape, seen from a distance, face still recognizable` +
      TAIL,
  },
  {
    key: 'action-run',
    p:
      `${SUBJ} sprinting through rain-soaked neon streets at night, motion in the puddles, determined expression` +
      TAIL,
  },
  {
    key: 'laughing',
    p:
      `candid shot of ${SUBJ} with his head thrown back laughing at an outdoor dinner party, string lights` +
      TAIL,
  },
  {
    key: 'overhead',
    p:
      `overhead top-down shot of ${SUBJ} lying on a picnic blanket in a meadow, arms behind his head, looking up at the camera` +
      TAIL,
  },
  {
    key: 'over-shoulder',
    p:
      `three-quarter over-the-shoulder shot of ${SUBJ} looking back toward the camera on a mountain trail` +
      TAIL,
  },
  {
    key: 'surf-action',
    p: `${SUBJ} carving a turn on a surfboard, spray flying, shot from the water level` + TAIL,
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
  const t0 = Date.now();
  for (let i = 0; i < 240; i++) {
    await new Promise((r) => setTimeout(r, 1500));
    const p = await (
      await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, {
        headers: { Authorization: `Bearer ${REPLICATE}` },
      })
    ).json();
    if (p.status === 'succeeded') {
      const out = Array.isArray(p.output) ? p.output[0] : p.output;
      if (!out) throw new Error(`${label}: empty output`);
      return { url: out, ms: Date.now() - t0 };
    }
    if (p.status === 'failed' || p.status === 'canceled')
      throw new Error(`${label}: ${p.status} ${String(p.error).slice(0, 120)}`);
  }
  throw new Error(`${label}: timeout`);
}

const restore = async (url) =>
  (
    await replicate(
      CODEFORMER,
      {
        image: url,
        codeformer_fidelity: 0.9,
        upscale: 1,
        face_upsample: true,
        background_enhance: false,
      },
      'codeformer'
    )
  ).url;

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
  const self = (rec.recipe.dream_cast ?? []).find((m) => m.role === 'self');
  if (!self) throw new Error('need self cast');
  let kevinUrl = self.thumb_url;
  if (self.storage_path) {
    const { data } = await sb.storage.from('cast-photos').createSignedUrl(self.storage_path, 21600);
    kevinUrl = data.signedUrl;
  }
  console.log('cast resolved');

  const rows = [];
  for (const scene of SCENES) {
    console.log(`— ${scene.key}`);
    const cells = [];

    // All three legs are independent — run them concurrently per scene.
    const [current, pulid, infu] = await Promise.allSettled([
      (async () => {
        const t = await replicate(
          null,
          { prompt: scene.p, aspect_ratio: '9:16', output_format: 'jpg', safety_tolerance: 2 },
          'flux',
          FLUX_11_PRO
        );
        const s = await replicate(
          CDINGRAM,
          { swap_image: kevinUrl, input_image: t.url },
          'cdingram'
        );
        return { url: await restore(s.url), ms: t.ms + s.ms };
      })(),
      (async () => {
        const r = await replicate(
          PULID,
          {
            prompt: scene.p,
            main_face_image: kevinUrl,
            width: 896,
            height: 1152,
            id_weight: 1,
            num_steps: 20,
            output_quality: 90,
          },
          'pulid'
        );
        return r;
      })(),
      (async () => {
        const r = await replicate(
          INFU,
          {
            prompt: scene.p,
            id_image: kevinUrl,
            width: 864,
            height: 1152,
            model_version: 'aes_stage2',
            enable_realism: true,
            output_format: 'jpg',
            output_quality: 90,
          },
          'infiniteyou'
        );
        return r;
      })(),
    ]);

    const legs = [
      ['current (render→swap→restore)', current, 'cur'],
      ['flux-pulid', pulid, 'pulid'],
      ['infinite-you', infu, 'infu'],
    ];
    for (const [label, res, suffix] of legs) {
      if (res.status === 'fulfilled') {
        cells.push({
          label: `${label} · ${Math.round(res.value.ms / 1000)}s`,
          file: await download(res.value.url, `${scene.key}-${suffix}.jpg`),
        });
      } else {
        cells.push({ label: `${label} — ${res.reason.message.slice(0, 60)}`, file: null });
        console.log(`  ${label}: ${res.reason.message.slice(0, 80)}`);
      }
    }
    rows.push({ scene, cells });
    console.log(`  done (${cells.filter((c) => c.file).length}/3)`);
  }

  const html = `<!doctype html><meta charset="utf-8"><title>Identity hybrid bench</title>
<style>
body{background:#0a0a12;color:#eee;font:14px system-ui;margin:20px}
h1{font-size:18px}
.row{display:flex;gap:8px;margin-bottom:20px;overflow-x:auto}
.cell{flex:0 0 280px}.cell img{width:280px;border-radius:8px;display:block}
.cell .lbl{font-size:12px;color:#aaa;margin:4px 0}
.fail{width:280px;height:373px;background:#1c1626;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#f66;text-align:center;font-size:12px;padding:10px}
.tag{font-size:12px;margin:2px 0;color:#9a8cff;font-weight:600}
</style>
<h1>Stage 7 spike — identity-conditioned generation vs production swap · ${new Date().toISOString().slice(0, 10)}</h1>
<p>Column 1 = today's pipeline on a composition it was never designed for. Columns 2-3 render WITH your identity from the start. Judge: "is that really me?" + composition freedom. Timing in each label.</p>
${rows
  .map(
    ({ scene, cells }) =>
      `<div class="tag">${scene.key}</div><div class="row">${cells
        .map((c) =>
          c.file
            ? `<div class="cell"><div class="lbl">${c.label}</div><a href="${c.file}" target="_blank"><img src="${c.file}" loading="lazy"></a></div>`
            : `<div class="cell"><div class="lbl">${c.label}</div><div class="fail">${c.label}</div></div>`
        )
        .join('')}</div>`
  )
  .join('\n')}`;
  fs.writeFileSync(path.join(OUT, 'index.html'), html);
  console.log(`\n✅ grid: ${path.join(OUT, 'index.html')}`);
})();
