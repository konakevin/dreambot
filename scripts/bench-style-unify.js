#!/usr/bin/env node
/**
 * Stage 6 spike — stylized-medium swap unify (kontextPass revival candidate).
 *
 * On painterly mediums the swap pastes a PHOTOREAL face into a painted scene;
 * CodeFormer restore sharpens it but can't paint it. This bench renders 4
 * stylized solo scenes (medium fragments verbatim from dream_mediums), runs
 * the production swap leg, then applies the medium's own kontext_directive
 * (already authored, sitting unused in the DB) via flux-kontext-pro.
 *
 * Columns: target (unswapped) | today (swap+restore) | +kontext unify.
 * Judge: does the face SIT in the medium, and does identity survive the pass?
 *
 * Usage: node scripts/bench-style-unify.js
 * Output: ~/Desktop/style-unify-bench/index.html  (~$0.90 spend)
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
const FLUX_11_PRO = 'black-forest-labs/flux-1.1-pro';
const KONTEXT = 'black-forest-labs/flux-kontext-pro';

const OUT = path.join(os.homedir(), 'Desktop', 'style-unify-bench');
const MEDIUMS = ['watercolor', 'canvas', 'illustration', 'storybook'];

const SCENE =
  'a fit man in his 40s with short brown hair standing at a sunlit harbor, boats behind him, his face large, frontal, clearly visible and turned toward the camera, waist-up';

const IDENTITY_SUFFIX =
  '\n\nCRITICAL: The person in this image must remain EXACTLY recognizable — same face, same features, same identity. Transform the art style and surfaces but preserve their exact likeness. This is a style transfer, not a reimagining.';

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
      return out;
    }
    if (p.status === 'failed' || p.status === 'canceled')
      throw new Error(`${label}: ${p.status} ${String(p.error).slice(0, 120)}`);
  }
  throw new Error(`${label}: timeout`);
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
  const self = (rec.recipe.dream_cast ?? []).find((m) => m.role === 'self');
  let kevinUrl = self.thumb_url;
  if (self.storage_path) {
    const { data } = await sb.storage.from('cast-photos').createSignedUrl(self.storage_path, 21600);
    kevinUrl = data.signedUrl;
  }
  const { data: meds } = await sb
    .from('dream_mediums')
    .select('key,flux_fragment,kontext_directive')
    .in('key', MEDIUMS);
  console.log('cast + mediums resolved');

  const rows = [];
  for (const key of MEDIUMS) {
    const med = meds.find((m) => m.key === key);
    console.log(`— ${key}`);
    const cells = [];
    try {
      const prompt = `${SCENE}, ${med.flux_fragment}, vertical composition, no text`;
      const targetUrl = await replicate(
        null,
        { prompt, aspect_ratio: '9:16', output_format: 'jpg', safety_tolerance: 2 },
        'flux',
        FLUX_11_PRO
      );
      cells.push({
        label: 'target (unswapped)',
        file: await download(targetUrl, `${key}-target.jpg`),
      });

      const swapped = await replicate(
        CDINGRAM,
        { swap_image: kevinUrl, input_image: targetUrl },
        'cdingram'
      );
      const restored = await restore(swapped);
      cells.push({
        label: 'today (swap + restore)',
        file: await download(restored, `${key}-today.jpg`),
      });

      const directive =
        (med.kontext_directive ??
          `Convert this photo into a ${key} artwork while keeping the person's exact same face, identity, age, gender, expression, pose, and framing.`) +
        IDENTITY_SUFFIX;
      const unified = await replicate(
        null,
        { prompt: directive, input_image: restored, output_format: 'jpg' },
        'kontext',
        KONTEXT
      );
      cells.push({ label: '+ kontext unify', file: await download(unified, `${key}-unified.jpg`) });
    } catch (e) {
      cells.push({ label: `error: ${e.message.slice(0, 60)}`, file: null });
      console.log(`  ${e.message.slice(0, 80)}`);
    }
    rows.push({ key, cells });
    console.log(`  done (${cells.filter((c) => c.file).length}/3)`);
  }

  const html = `<!doctype html><meta charset="utf-8"><title>Style unify bench</title>
<style>
body{background:#0a0a12;color:#eee;font:14px system-ui;margin:20px}
h1{font-size:18px}
.row{display:flex;gap:8px;margin-bottom:20px;overflow-x:auto}
.cell{flex:0 0 280px}.cell img{width:280px;border-radius:8px;display:block}
.cell .lbl{font-size:12px;color:#aaa;margin:4px 0}
.fail{width:280px;height:497px;background:#1c1626;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#f66;text-align:center;font-size:12px;padding:10px}
.tag{font-size:12px;margin:2px 0;color:#9a8cff;font-weight:600}
</style>
<h1>Stage 6 spike — does a Kontext pass make swapped faces SIT in painterly mediums? · ${new Date().toISOString().slice(0, 10)}</h1>
<p>Per medium: unswapped target | today's production output | + the medium's own kontext_directive over the swapped image. Judge: style cohesion AND whether it's still you.</p>
${rows
  .map(
    ({ key, cells }) =>
      `<div class="tag">${key}</div><div class="row">${cells
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
