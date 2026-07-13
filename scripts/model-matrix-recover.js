#!/usr/bin/env node
/**
 * model-matrix-recover.js — recover matrix renders from the DB when the harness
 * was interrupted (e.g. Supabase billing freeze 2026-07-12 left jobs stuck and
 * the poll loop hung, so nothing downloaded). The renders themselves completed
 * (uploads exist); this re-downloads them into RENDER_DIR in the same shape
 * model-matrix-swap.js writes, and reports which target combos are still missing.
 *
 *   node scripts/model-matrix-recover.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const sb = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const OUT_DIR = '/Users/kevinmchenry/dreambot-model-matrix';
const RENDER_DIR = path.join(OUT_DIR, 'renders');

const ART = [
  'anime',
  'animation',
  'claymation',
  'fairytale',
  'handcrafted',
  'kawaii',
  'pixels',
  'storybook',
];
const MODELS = [
  'black-forest-labs/flux-dev',
  'black-forest-labs/flux-1.1-pro',
  'black-forest-labs/flux-1.1-pro-ultra',
  'black-forest-labs/flux-2-dev',
  'black-forest-labs/flux-2-pro',
  'black-forest-labs/flux-2-flex',
  'black-forest-labs/flux-2-max',
  'openai/gpt-image-1',
  'openai/gpt-image-2',
  'google/gemini-2-image',
  'google/gemini-3-image-preview',
];
const ROLES = ['self', 'plus_one', 'dual'];
const slug = (m) => m.replace(/[^a-z0-9]/gi, '-');

(async () => {
  fs.mkdirSync(RENDER_DIR, { recursive: true });
  const { data, error } = await sb
    .from('dream_queue')
    .select('id,status,upload_id,payload,created_at')
    .like('dedup_key', 'matrix:%')
    .order('created_at', { ascending: false });
  if (error) throw error;

  // Newest completed job per (medium|model|role) art combo.
  const best = new Map();
  for (const r of data) {
    const p = r.payload || {};
    if (!ART.includes(p.medium_key)) continue;
    if (r.status !== 'completed' || !r.upload_id) continue;
    const key = `${p.medium_key}|${p.force_model}|${p.force_cast_role}`;
    if (!best.has(key)) best.set(key, r);
  }

  const results = [];
  let ok = 0;
  for (const [key, r] of best) {
    const p = r.payload;
    const fname = `${p.medium_key}__${slug(p.force_model)}__${p.force_cast_role}.png`;
    const rec = {
      jobId: r.id,
      model: p.force_model,
      medium: p.medium_key,
      role: p.force_cast_role,
      status: 'completed',
    };
    try {
      const { data: up } = await sb
        .from('uploads')
        .select('image_url,model')
        .eq('id', r.upload_id)
        .maybeSingle();
      const { data: log } = await sb
        .from('ai_generation_log')
        .select('model_used,fallback_reasons')
        .eq('upload_id', r.upload_id)
        .maybeSingle();
      rec.imageUrl = up ? up.image_url : null;
      rec.actualModel = (log && log.model_used) || (up && up.model);
      rec.fallback = (log && log.fallback_reasons) || [];
      const dest = path.join(RENDER_DIR, fname);
      // Resume: skip re-download if we already have it on disk.
      if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
        rec.file = fname;
        rec.ok = true;
        ok++;
      } else if (up && up.image_url) {
        const buf = Buffer.from(await (await fetch(up.image_url)).arrayBuffer());
        fs.writeFileSync(dest, buf);
        rec.file = fname;
        rec.ok = true;
        ok++;
      }
    } catch (e) {
      rec.error = String(e && e.message);
    }
    results.push(rec);
  }
  fs.writeFileSync(path.join(OUT_DIR, 'results-artrecover.json'), JSON.stringify(results, null, 2));

  // Report missing combos (of the full 8×11×3 = 264 target).
  const missing = [];
  for (const m of ART)
    for (const model of MODELS)
      for (const role of ROLES) {
        if (!best.has(`${m}|${model}|${role}`)) missing.push({ medium: m, model, role });
      }
  console.log(`Recovered ${ok}/${best.size} renders → RENDER_DIR + results-artrecover.json`);
  console.log(`Missing ${missing.length}/264 combos:`);
  for (const c of missing) console.log('  ', c.medium, c.model.split('/').pop(), c.role);
  // Emit a --mediums/--models re-run hint grouped by what's missing.
  const misMediums = [...new Set(missing.map((c) => c.medium))];
  const misModels = [...new Set(missing.map((c) => c.model))];
  if (missing.length) {
    console.log(
      '\nRe-run hint (may over-cover; harness skips nothing so re-download is idempotent):'
    );
    console.log(`  --mediums ${misMediums.join(',')} --models ${misModels.join(',')}`);
  }
})();
