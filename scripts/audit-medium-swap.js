#!/usr/bin/env node
/**
 * audit-medium-swap.js — production-readiness AUDIT of DreamBot-mode dual-character
 * face-swap renders across EVERY medium × EVERY allowed AI model.
 *
 * For each (medium × model) cell it fires a dual-cast dream (self + plus_one,
 * force_cast_role:'dual') through the dream_queue, forcing the model via
 * force_model. Vibe is held constant so the only variables are medium + model.
 *
 * Per cell we verify:
 *   1. Swap/resemblance — did the dual face-swap fire and do the two people look
 *      like the user's cast photos?  (mechanical: upload exists; visual: read img)
 *   2. Medium fidelity — does the image look like the requested medium?  (visual)
 *
 * Outputs:
 *   /tmp/medium-audit/            downloaded render JPEGs + cast-self/-plus_one thumbs
 *   /tmp/medium-audit.json        manifest (cell → upload_id, models, status, file)
 *   /tmp/medium-audit.html        review matrix (medium rows × model cols + cast)
 *
 * Usage:
 *   node --env-file=.env.local scripts/audit-medium-swap.js --slice         # ~5 cells, prove harness
 *   node --env-file=.env.local scripts/audit-medium-swap.js --full          # all 19 mediums × models
 *   node --env-file=.env.local scripts/audit-medium-swap.js --medium anime  # one medium, all models
 *   node --env-file=.env.local scripts/audit-medium-swap.js --cleanup       # delete audit data + blobs
 *
 * ⚠️ Spends real render $ (~$0.13/dual cell). Needs the user dual-ready.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const URL = process.env.SUPABASE_URL || 'https://jimftynwrinwenonjrlj.supabase.co';
const sb = createClient(URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const WT = process.env.DREAM_QUEUE_WORKER_TOKEN;
const KEVIN = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';

const args = process.argv.slice(2);
const has = (n) => args.includes('--' + n);
const flag = (n, d) => {
  const i = args.indexOf('--' + n);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d;
};
const USER = flag('user', KEVIN);
const VIBE = flag('vibe', 'cinematic');
const TAG = flag('tag', 'medaudit');
const NAME = flag('name', 'medium-audit');
const OUTDIR = `/tmp/${NAME}`;
const MANIFEST = `/tmp/${NAME}.json`;
const HTMLOUT = `/tmp/${NAME}.html`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Constant scene. Default keeps the real cinematic default; --hint overrides it
// (e.g. a face-forward portrait when isolating per-MODEL swap quality).
const HINT = flag(
  'hint',
  'the two of us together by a window, both faces clearly visible, warm light'
);

// DB allowed_models stores short names; force_model wants the full Replicate slug.
const SHORT2FULL = {
  'flux-schnell': 'black-forest-labs/flux-schnell',
  'flux-krea-dev': 'black-forest-labs/flux-krea-dev',
  'flux-dev': 'black-forest-labs/flux-dev',
  'flux-1.1-pro': 'black-forest-labs/flux-1.1-pro',
  'flux-1.1-pro-ultra': 'black-forest-labs/flux-1.1-pro-ultra',
  'flux-2-dev': 'black-forest-labs/flux-2-dev',
  'flux-2-pro': 'black-forest-labs/flux-2-pro',
  'flux-2-flex': 'black-forest-labs/flux-2-flex',
  'flux-2-max': 'black-forest-labs/flux-2-max',
  'gpt-image-1': 'openai/gpt-image-1',
  'gpt-image-2': 'openai/gpt-image-2',
  'gemini-2-image': 'google/gemini-2-image',
  'gemini-3-image-preview': 'google/gemini-3-image-preview',
};
const fullOf = (short) => SHORT2FULL[short] || short;
const shortOf = (full) => (full ? full.split('/').pop() : full);
const ULTRA = 'black-forest-labs/flux-1.1-pro-ultra';
const PRO = 'black-forest-labs/flux-1.1-pro';

async function download(url, dest) {
  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    return true;
  } catch {
    return false;
  }
}

async function cleanup() {
  const { data: rows } = await sb
    .from('dream_queue')
    .select('id, upload_id')
    .like('dedup_key', `${TAG}:%`);
  const uploadIds = (rows ?? []).map((r) => r.upload_id).filter(Boolean);
  let blobs = 0;
  for (let i = 0; i < uploadIds.length; i += 500) {
    const { data: ups } = await sb
      .from('uploads')
      .select('image_url, image_url_display')
      .in('id', uploadIds.slice(i, i + 500));
    const paths = [];
    for (const u of ups ?? [])
      for (const url of [u.image_url, u.image_url_display]) {
        const m = url && url.match(/\/uploads\/(.+)$/);
        if (m) paths.push(m[1]);
      }
    for (let j = 0; j < paths.length; j += 100) {
      const { error } = await sb.storage.from('uploads').remove(paths.slice(j, j + 100));
      if (!error) blobs += Math.min(100, paths.length - j);
    }
  }
  if (uploadIds.length) await sb.from('uploads').delete().in('id', uploadIds);
  await sb.from('dream_queue').delete().like('dedup_key', `${TAG}:%`);
  await sb
    .from('dream_jobs')
    .delete()
    .in(
      'id',
      (rows ?? []).map((r) => r.id)
    );
  console.log(
    `Cleaned ${rows?.length ?? 0} queue rows + ${uploadIds.length} uploads + ${blobs} blobs.`
  );
}

async function buildCells() {
  const { data: meds } = await sb
    .from('dream_mediums')
    .select('key, label, face_swaps, character_render_mode, allowed_models, is_active')
    .order('key');
  const active = (meds || []).filter((m) => m.is_active !== false);

  let mediums = active;
  const only = flag('medium', null);
  if (only) mediums = active.filter((m) => m.key === only);
  const mediumCsv = flag('mediums', null);
  if (mediumCsv) {
    const set = new Set(mediumCsv.split(','));
    mediums = active.filter((m) => set.has(m.key));
  }

  // --allmodels: test the FULL active model catalog (image_models) on every
  // medium, not just each medium's allowed_models. This mirrors production:
  // DreamBot mode lets the user force ANY active model (allowed_models only
  // gates the auto-picker used by nightly/bots), so a per-MODEL swap audit
  // must cover all 13.
  let allModels = null;
  if (has('allmodels')) {
    const { data: ims } = await sb
      .from('image_models')
      .select('id, is_active')
      .eq('is_active', true);
    allModels = (ims || []).map((m) => m.id).sort();
  }

  const cells = [];
  for (const m of mediums) {
    const models =
      allModels ||
      (m.allowed_models && m.allowed_models.length
        ? m.allowed_models
        : ['black-forest-labs/flux-1.1-pro']);
    for (const entry of models) {
      // allowed_models are stored as FULL Replicate slugs; tolerate short too.
      const reqFull = entry.includes('/') ? entry : fullOf(entry);
      // Dual swaps clamp Ultra → Pro (Ultra's 4MP busts the swap memory ceiling).
      const expectFull = m.face_swaps && reqFull === ULTRA ? PRO : reqFull;
      cells.push({
        medium: m.key,
        label: m.label,
        faceSwap: m.face_swaps === true,
        renderMode: m.character_render_mode,
        reqModelShort: shortOf(reqFull),
        reqModelFull: reqFull,
        expectModelFull: expectFull,
        clamp: expectFull !== reqFull,
      });
    }
  }

  if (has('slice')) {
    // ~5 representative cells: a face-swap medium across 3 providers + a 2nd
    // face-swap medium + an embodied (likeness) medium.
    const want = [
      ['anime', 'flux-1.1-pro'],
      ['anime', 'gemini-2-image'],
      ['anime', 'gpt-image-2'],
      ['watercolor', 'flux-2-max'],
      ['lego', 'flux-2-max'],
    ];
    const picked = [];
    for (const [med, mod] of want) {
      const c = cells.find((x) => x.medium === med && x.reqModelShort === mod);
      if (c) picked.push(c);
    }
    return picked.length ? picked : cells.slice(0, 5);
  }
  return cells;
}

async function main() {
  if (has('cleanup')) return cleanup();
  if (
    !has('slice') &&
    !has('full') &&
    !flag('medium', null) &&
    !flag('mediums', null) &&
    !has('allmodels')
  ) {
    console.error('Specify --slice, --full, --medium <key>, or --mediums a,b,c [--allmodels].');
    process.exit(1);
  }

  fs.mkdirSync(OUTDIR, { recursive: true });

  const { data: r } = await sb
    .from('user_recipes')
    .select('recipe')
    .eq('user_id', USER)
    .maybeSingle();
  const recipe = r?.recipe;
  const cast = recipe?.dream_cast ?? [];
  const self = cast.find((c) => c.role === 'self');
  const plus = cast.find((c) => c.role === 'plus_one');
  if (!self || !plus) {
    console.error('User is not dual-ready (need self + plus_one in dream_cast).');
    return;
  }
  // Pull cast reference faces for the resemblance check.
  await download(self.thumb_url, path.join(OUTDIR, 'cast-self.jpg'));
  await download(plus.thumb_url, path.join(OUTDIR, 'cast-plus_one.jpg'));

  const { data: cfg } = await sb
    .from('engine_config')
    .select('dream_queue_max_concurrent, dream_queue_max_concurrent_heavy')
    .eq('id', 1)
    .single();
  const lightCap = cfg?.dream_queue_max_concurrent ?? 40;
  const heavyCap = cfg?.dream_queue_max_concurrent_heavy ?? 10;

  const cells = await buildCells();
  console.log(
    `AUDIT: ${cells.length} cells (caps light=${lightCap} heavy=${heavyCap}, vibe=${VIBE})\n` +
      cells
        .map(
          (c) =>
            `  ${c.medium}/${c.reqModelShort}${c.clamp ? ' (→pro)' : ''}${c.faceSwap ? '' : ' [likeness]'}`
        )
        .join('\n')
  );

  // Build + insert jobs. Face-swap mediums = heavy (Fly.io); embodied = light.
  const jobs = cells.map((c) => {
    const id = crypto.randomUUID();
    return {
      id,
      cell: c,
      // Heavy = anything that invokes the Fly.io dual swap: face_swaps mediums
      // AND natural-render mediums (e.g. photography swaps via natural mode even
      // with face_swaps=false). Only truly embodied/likeness mediums are light.
      weight: c.faceSwap || c.renderMode === 'natural' ? 'heavy' : 'light',
      payload: {
        mode: 'flux-dev',
        medium_key: c.medium,
        vibe_key: VIBE,
        hint: HINT,
        job_id: id,
        vibe_profile: recipe,
        force_cast_role: 'dual',
        force_model: c.reqModelFull,
      },
    };
  });

  for (let i = 0; i < jobs.length; i += 200) {
    const chunk = jobs.slice(i, i + 200);
    await sb.from('dream_jobs').upsert(
      chunk.map((j) => ({ id: j.id, user_id: USER, status: 'processing', payload: j.payload })),
      { onConflict: 'id', ignoreDuplicates: true }
    );
    const { error } = await sb.from('dream_queue').insert(
      chunk.map((j) => ({
        id: j.id,
        user_id: USER,
        source: 'create',
        weight: j.weight,
        payload: j.payload,
        status: 'queued',
        dedup_key: `${TAG}:${j.id}`,
      }))
    );
    if (error) return console.error('insert error:', error.message);
  }

  const ids = jobs.map((j) => j.id);
  const kick = () =>
    WT &&
    fetch(`${URL}/functions/v1/dream-queue-worker`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${WT}` },
      body: '{}',
    }).catch(() => {});
  for (let k = 0; k < 3; k++) {
    kick();
    await sleep(500);
  }

  for (let tick = 0; tick < 900; tick++) {
    await sleep(1000);
    const { data: rows } = await sb.from('dream_queue').select('id, status').in('id', ids);
    const c = {};
    for (const x of rows ?? []) c[x.status] = (c[x.status] || 0) + 1;
    process.stdout.write(
      `\r  t+${tick + 1}s  queued=${c.queued || 0} in_progress=${c.in_progress || 0} completed=${c.completed || 0} dead=${c.dead_letter || 0}   `
    );
    if ((c.queued || 0) > 0 && tick % 3 === 0) kick();
    if ((c.completed || 0) + (c.dead_letter || 0) >= ids.length) break;
  }

  // Collect results.
  const { data: qrows } = await sb
    .from('dream_queue')
    .select('id, status, upload_id, last_error')
    .in('id', ids);
  const qById = new Map((qrows ?? []).map((q) => [q.id, q]));
  const upIds = (qrows ?? []).map((q) => q.upload_id).filter(Boolean);
  const upById = new Map();
  for (let i = 0; i < upIds.length; i += 200) {
    const { data: ups } = await sb
      .from('uploads')
      .select('id, model, dream_medium, dream_vibe, image_url, image_url_display, ai_prompt')
      .in('id', upIds.slice(i, i + 200));
    for (const u of ups ?? []) upById.set(u.id, u);
  }

  const manifest = [];
  for (const j of jobs) {
    const q = qById.get(j.id) || {};
    const u = q.upload_id ? upById.get(q.upload_id) : null;
    const fileBase = `${j.cell.medium}__${j.cell.reqModelShort}`.replace(/[^a-z0-9_.-]/gi, '-');
    let file = null;
    if (u) {
      const dl = u.image_url_display || u.image_url;
      const dest = path.join(OUTDIR, fileBase + '.jpg');
      if (await download(dl, dest)) file = dest;
    }
    const actualModel = u?.model || null;
    manifest.push({
      medium: j.cell.medium,
      faceSwap: j.cell.faceSwap,
      renderMode: j.cell.renderMode,
      reqModel: j.cell.reqModelShort,
      reqModelFull: j.cell.reqModelFull,
      expectModelFull: j.cell.expectModelFull,
      actualModel,
      modelMatch: actualModel ? actualModel === j.cell.expectModelFull : null,
      clamp: j.cell.clamp,
      status: q.status || 'unknown',
      uploadId: q.upload_id || null,
      imageUrl: u?.image_url_display || u?.image_url || null,
      file,
      aiPrompt: u?.ai_prompt || null,
      lastError: q.last_error || null,
    });
  }

  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
  writeHtml(manifest, self, plus);

  const ok = manifest.filter((m) => m.status === 'completed').length;
  const bad = manifest.filter((m) => m.status !== 'completed');
  const mm = manifest.filter((m) => m.modelMatch === false);
  console.log(`\n\n━━━ AUDIT RENDER RESULT ━━━`);
  console.log(`completed: ${ok}/${manifest.length}`);
  if (bad.length)
    console.log(
      `NOT completed: ${bad.map((b) => `${b.medium}/${b.reqModel}=${b.status}`).join(', ')}`
    );
  if (mm.length)
    console.log(
      `model mismatch: ${mm.map((b) => `${b.medium}/${b.reqModel} got ${shortOf(b.actualModel)} (expected ${shortOf(b.expectModelFull)})`).join(', ')}`
    );
  console.log(`\nManifest: ${MANIFEST}`);
  console.log(`Review HTML: ${HTMLOUT}`);
  console.log(`Images + cast thumbs: ${OUTDIR}/`);
  console.log(`Run --cleanup to delete audit uploads + blobs.`);
}

function writeHtml(manifest, self, plus) {
  const byMedium = {};
  for (const m of manifest) (byMedium[m.medium] ||= []).push(m);
  const cell = (m) => {
    const img = m.imageUrl
      ? `<img src="${m.imageUrl}" loading="lazy">`
      : `<div class="missing">no render<br>${m.status}</div>`;
    const modelLine =
      m.actualModel && m.actualModel !== m.expectModelFull
        ? `<span class="warn">req ${m.reqModel} → got ${shortOf(m.actualModel)}</span>`
        : m.clamp
          ? `${m.reqModel} <span class="clamp">→ pro (dual clamp)</span>`
          : m.reqModel;
    return `<div class="cell ${m.status !== 'completed' ? 'fail' : ''}">
      ${img}
      <div class="meta">${modelLine}</div>
    </div>`;
  };
  const sections = Object.entries(byMedium)
    .map(
      ([med, arr]) => `<section>
      <h2>${med} ${arr[0].faceSwap ? '<span class="badge swap">face-swap</span>' : '<span class="badge like">likeness</span>'}</h2>
      <div class="grid">${arr.map(cell).join('')}</div>
    </section>`
    )
    .join('\n');
  const html = `<!doctype html><meta charset="utf-8"><title>DreamBot Medium × Model Audit</title>
<style>
  body{background:#0b0b0f;color:#e8e8ee;font:14px/1.4 -apple-system,system-ui,sans-serif;margin:0;padding:24px}
  h1{font-size:20px} h2{font-size:16px;border-bottom:1px solid #333;padding-bottom:6px;text-transform:capitalize}
  .cast{display:flex;gap:16px;align-items:center;background:#15151c;padding:14px;border-radius:12px;margin:12px 0 28px}
  .cast img{width:90px;height:90px;object-fit:cover;border-radius:10px}
  .cast .lab{font-size:12px;color:#9a9ab0}
  .grid{display:flex;flex-wrap:wrap;gap:14px;margin:10px 0 26px}
  .cell{width:230px;background:#15151c;border-radius:10px;overflow:hidden;border:1px solid #222}
  .cell.fail{border-color:#a33}
  .cell img{width:230px;height:230px;object-fit:cover;display:block;background:#000}
  .cell .meta{padding:7px 9px;font-size:12px;color:#cfcfe0}
  .missing{width:230px;height:230px;display:flex;align-items:center;justify-content:center;color:#a66;text-align:center}
  .badge{font-size:11px;padding:2px 8px;border-radius:20px;margin-left:8px;vertical-align:middle}
  .badge.swap{background:#16364f;color:#7ec7ff} .badge.like{background:#4a3a16;color:#ffcf7e}
  .warn{color:#ff9a6b} .clamp{color:#ffcf7e}
</style>
<h1>DreamBot — Dual Face-Swap × Medium × Model Audit</h1>
<div class="cast">
  <div><img src="${self.thumb_url}"><div class="lab">self</div></div>
  <div><img src="${plus.thumb_url}"><div class="lab">plus_one</div></div>
  <div class="lab">Reference cast faces — every render below should put THESE two people into the scene, in the named medium.</div>
</div>
${sections}`;
  fs.writeFileSync(HTMLOUT, html);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
