#!/usr/bin/env node
/**
 * model-matrix-swap.js — QA harness: render the SAME fixed scene across every
 * model × every real-face medium × {self, plus_one, dual} face-swap config, to
 * see which models honor the medium/style vs flatten it to photoreal.
 *
 * Renders go through the REAL pipeline by calling generate-dream directly on the
 * `x-dream-queue` service path (Sonnet brief → forced model → face swap →
 * face-restore). That path skips the sparkle charge (it assumes enqueue already
 * charged), so this does NOT bill Kevin. We seed the minimal dream_jobs +
 * dream_queue rows generate-dream expects, then POST the render body.
 *
 * Everything is held CONSTANT except (model, medium, cast role): one fixed hint
 * + one fixed neutral vibe, so the only variable is model × medium × cast.
 *
 * Usage:
 *   node scripts/model-matrix-swap.js --test                 # 1 render (validate harness)
 *   node scripts/model-matrix-swap.js --pilot                # pop_art × 13 models × 3 roles
 *   node scripts/model-matrix-swap.js --full                 # 7 mediums × 13 models × 3 roles
 *   node scripts/model-matrix-swap.js --only-model <id> --only-medium <k> --only-role <r>
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const { randomUUID } = require('crypto');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const KEV = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const sb = createClient(SUPABASE_URL, SERVICE_KEY);

const OUT_DIR = '/Users/kevinmchenry/dreambot-model-matrix';
const RENDER_DIR = path.join(OUT_DIR, 'renders');

// ── Matrix dimensions ────────────────────────────────────────────────────────
const MODELS = [
  'black-forest-labs/flux-schnell',
  // flux-krea-dev removed 2026-07-12: consistently "Generation timed out" at the
  // render stage (too slow for RENDER_TIMEOUT_MS) — unusable in this pipeline.
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
const MEDIUMS = [
  'photography',
  'watercolor',
  'pop_art',
  'comics',
  'pencil',
  'illustration',
  'canvas',
];
const ROLES = ['self', 'plus_one', 'dual'];

// Held constant across the whole matrix.
const FIXED_VIBE = 'minimal';

// One cool scene PER medium — constant within a medium's batch (so models are
// compared apples-to-apples), fresh per medium (variety + keeper renders).
// Settings only, no style words, so the medium fragment owns the look.
const SCENE_BY_MEDIUM = {
  pop_art: 'having coffee at a cafe',
  photography:
    'standing on a Hawaiian black-sand beach at golden hour, palm trees and dramatic volcanic sea cliffs behind them, turquoise waves rolling in',
  watercolor:
    'in a misty Japanese garden in spring, cherry blossoms drifting down, a red arched bridge over a koi pond',
  comics:
    'on a neon-lit rooftop in a futuristic sci-fi megacity at night, flying cars streaking past glowing skyscrapers',
  pencil:
    'inside a grand old European library with towering bookshelves, a spiral staircase, and warm reading lamps',
  illustration:
    'in an enchanted forest clearing at dusk with glowing mushrooms, floating fireflies, and a little stone cottage',
  canvas:
    'on the deck of a tall wooden sailing ship crossing a dramatic stormy sea at sunset, billowing sails overhead',
  // ── Dream Art (embodied) styles — settings only, style owned by the medium ──
  anime:
    'on a rooftop overlooking a bustling Tokyo street at dusk, glowing neon signs everywhere and a train crossing an elevated track in the distance',
  animation:
    'in a cozy cluttered treehouse workshop full of maps and gadgets, warm lantern light, a big round window looking out over a green forest',
  claymation:
    'in a whimsical backyard vegetable garden with oversized carrots and pumpkins beside a little wooden potting shed, soft morning light',
  fairytale:
    'in a flower-filled meadow below a castle on a hill, butterflies drifting over a winding cobblestone path, distant mountains',
  handcrafted:
    'at a rustic outdoor craft market stall surrounded by handmade wares, wooden crates and warm string lights strung overhead',
  kawaii:
    'inside a pastel bakery packed with oversized cupcakes and macarons, polka-dot walls and a tiny round cafe table by the window',
  pixels:
    'in a glowing retro arcade lined with cabinet screens, a checkerboard floor and bright neon signage overhead',
  storybook:
    'in a snowy village square at night with a decorated tree, little shops glowing warm through their windows and snow softly falling',
};
const DEFAULT_SCENE = 'at a cozy cafe';

const CONCURRENCY = 3; // protect the Fly dual-swap service (2 machines)
const RENDER_TIMEOUT_MS = 150_000;

const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f) => {
  const i = args.indexOf(f);
  return i >= 0 ? args[i + 1] : null;
};

function buildMatrix() {
  let models = MODELS,
    mediums = MEDIUMS,
    roles = ROLES;
  if (has('--test')) {
    return [{ model: 'google/gemini-2-image', medium: 'pop_art', role: 'dual' }];
  }
  if (has('--pilot')) mediums = ['pop_art'];
  if (val('--mediums')) mediums = val('--mediums').split(',');
  if (val('--models')) models = val('--models').split(',');
  if (val('--only-model')) models = [val('--only-model')];
  if (val('--only-medium')) mediums = [val('--only-medium')];
  if (val('--only-role')) roles = [val('--only-role')];
  const combos = [];
  for (const medium of mediums)
    for (const model of models) for (const role of roles) combos.push({ model, medium, role });
  return combos;
}

async function loadRecipe() {
  const { data } = await sb.from('user_recipes').select('recipe').eq('user_id', KEV).single();
  return data.recipe;
}

const ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const WORKER_TOKEN = process.env.DREAM_QUEUE_WORKER_TOKEN;

// Seed the dream_jobs + dream_queue rows the REAL worker will drain. The worker
// calls generate-dream internally (no external-gateway header rewrite) and sends
// our payload verbatim, so force_model/force_cast_role/medium_key/hint all apply.
async function seedJob({ model, medium, role }, recipe) {
  const jobId = randomUUID();
  const payload = {
    job_id: jobId,
    mode: 'flux-dev', // text-to-image base render (then face swap); force_model overrides the model
    medium_key: medium,
    vibe_key: FIXED_VIBE,
    force_model: model,
    force_cast_role: role,
    vibe_profile: recipe,
    hint: SCENE_BY_MEDIUM[medium] || DEFAULT_SCENE,
  };
  await sb
    .from('dream_jobs')
    .upsert(
      { id: jobId, user_id: KEV, status: 'processing', payload },
      { onConflict: 'id', ignoreDuplicates: true }
    );
  const { error } = await sb.from('dream_queue').insert({
    id: jobId,
    user_id: KEV,
    source: 'create',
    weight: role === 'dual' ? 'heavy' : 'light',
    payload,
    status: 'queued',
    dedup_key: `matrix:${jobId}`,
  });
  if (error) console.log('  seed error', model, medium, role, error.message);
  return { jobId, model, medium, role };
}

// Best-effort worker kick (held-connection drain). Falls back to pg_cron if this
// 401s (external gateway). Non-fatal.
async function kickWorker() {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/dream-queue-worker`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${WORKER_TOKEN}`,
        apikey: ANON_KEY,
        'x-worker-sync': '1',
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(140_000),
    }).catch((e) => ({ status: 'ERR:' + e.message }));
    return res.status;
  } catch (e) {
    return 'ERR:' + e.message;
  }
}

(async () => {
  fs.mkdirSync(RENDER_DIR, { recursive: true });
  const combos = buildMatrix();
  console.log(`Matrix: ${combos.length} renders — seeding queue...`);
  const recipe = await loadRecipe();

  const jobs = [];
  for (const c of combos) jobs.push(await seedJob(c, recipe));
  const byId = new Map(jobs.map((j) => [j.jobId, j]));
  console.log(`Seeded ${jobs.length} jobs. Draining via worker + poll...`);

  const done = new Map(); // jobId -> { status, upload_id }
  const deadline = Date.now() + 75 * 60 * 1000; // 75 min cap for the whole batch (216 renders)
  let kickBusy = null;
  while (done.size < jobs.length && Date.now() < deadline) {
    if (!kickBusy)
      kickBusy = kickWorker().then((s) => {
        kickBusy = null;
        return s;
      });
    const pending = jobs.filter((j) => !done.has(j.jobId)).map((j) => j.jobId);
    const { data: rows } = await sb
      .from('dream_queue')
      .select('id,status,upload_id')
      .in('id', pending);
    for (const r of rows || []) {
      if (['completed', 'dead_letter', 'failed'].includes(r.status)) {
        done.set(r.id, { status: r.status, upload_id: r.upload_id });
      }
    }
    process.stdout.write(`\r  ${done.size}/${jobs.length} terminal...   `);
    if (done.size < jobs.length) await new Promise((r) => setTimeout(r, 8000));
  }
  console.log('');

  // Collect: read upload → model + image, download.
  const results = [];
  for (const j of jobs) {
    const term = done.get(j.jobId) || { status: 'timeout', upload_id: null };
    const r = { ...j, status: term.status, scene: SCENE_BY_MEDIUM[j.medium] || DEFAULT_SCENE };
    if (term.upload_id) {
      const { data: up } = await sb
        .from('uploads')
        .select('image_url,model,dream_medium,ai_prompt')
        .eq('id', term.upload_id)
        .maybeSingle();
      const { data: log } = await sb
        .from('ai_generation_log')
        .select('model_used,fallback_reasons')
        .eq('upload_id', term.upload_id)
        .maybeSingle();
      if (up) {
        r.imageUrl = up.image_url;
        r.actualModel = (log && log.model_used) || up.model;
        r.fallback = (log && log.fallback_reasons) || [];
        const fname = `${j.medium}__${j.model.replace(/[^a-z0-9]/gi, '-')}__${j.role}.png`;
        try {
          const buf = Buffer.from(await (await fetch(up.image_url)).arrayBuffer());
          fs.writeFileSync(path.join(RENDER_DIR, fname), buf);
          r.file = fname;
          r.ok = true;
        } catch (e) {
          r.error = 'download:' + e.message;
        }
      }
    }
    console.log(
      `${r.ok ? '✓' : '✗'} ${j.medium} | ${j.model.split('/').pop()} | ${j.role} — ${r.status}`
    );
    results.push(r);
  }
  const outFile = path.join(OUT_DIR, `results-${combos.length}.json`);
  fs.writeFileSync(outFile, JSON.stringify(results, null, 2));
  const ok = results.filter((r) => r.ok).length;
  console.log(`\nDone: ${ok}/${results.length} ok. Results → ${outFile}`);
})();
