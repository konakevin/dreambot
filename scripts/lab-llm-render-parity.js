#!/usr/bin/env node
/**
 * Render parity, Sonnet 4.6 vs 5.5 (LLM_MIGRATION.md step 2). Real renders, as Kevin, into his private album
 * (captioned "LLM parity" only, so the A/B vote stays blind; the arm map stays in OUT/map.json).
 *
 * PAIRED: both arms render the SAME input, and only the language model differs.
 *   nightly  Kevin's own logged slot inputs, replayed with force_slot_input + the image model they rendered on
 *            (force_model). The prompt is then a pure function of (input, slots), so the pair differs only in the
 *            slots each model wrote. 5.5 arm = force_llm_model (Sonnet jobs only; the Haiku swap probes stay).
 *   create   a fixed prompt set through the queue (as the app does), image model pinned; 5.5 arm = qa_llm_model.
 *
 * At most 2 renders in flight and a pool-headroom check before each (CLAUDE.md hard rule), which leaves a
 * face-swap slot free for real users.
 *
 *   node scripts/lab-llm-render-parity.js --surface=nightly|create --arm55=claude-sonnet-5-5@high --out=DIR
 *     [--couples=20] [--solos=12]
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const { waitForHeadroom } = require('./lib/poolHeadroom');

const URL_ = process.env.EXPO_PUBLIC_SUPABASE_URL;
const sb = createClient(URL_, process.env.SUPABASE_SERVICE_ROLE_KEY);
const TOK = process.env.DREAM_QUEUE_WORKER_TOKEN;
const ANON = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const KEVIN = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';

const arg = (k, d) => {
  const a = process.argv.find((x) => x.startsWith(`--${k}=`));
  return a ? a.slice(k.length + 3) : d;
};
const SURFACE = arg('surface', 'nightly');
const ARM55 = arg('arm55', 'claude-sonnet-5-5@high');
const OUT = arg('out', '');
const COUPLES = Number(arg('couples', '20'));
const SOLOS = Number(arg('solos', '12'));
const IN_FLIGHT = 2;
if (!OUT) throw new Error('--out=DIR is required');
fs.mkdirSync(OUT, { recursive: true });

function accessToken() {
  if (process.env.SUPABASE_ACCESS_TOKEN) return process.env.SUPABASE_ACCESS_TOKEN;
  const raw = execFileSync('security', ['find-generic-password', '-s', 'Supabase CLI', '-w'], {
    encoding: 'utf8',
  }).trim();
  const wrap = 'go-keyring-base64:';
  return raw.startsWith(wrap)
    ? Buffer.from(raw.slice(wrap.length), 'base64').toString('utf8')
    : raw;
}
async function sql(query) {
  const res = await fetch(
    'https://api.supabase.com/v1/projects/jimftynwrinwenonjrlj/database/query',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    }
  );
  if (!res.ok) throw new Error(`SQL ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res.json();
}

/** Stamps → outcome. "Held first try" is the nightly/Create lab bar: no re-render, no degrade. */
function grade(stamps, cast) {
  const s = stamps.join(' ');
  const degraded = /dual_degrade_single|solo_fallback|SHIPPED_FACELESS|pure_scene_fallback/.test(s);
  const rerendered = /rerender_for_dual/.test(s);
  return {
    heldFirstTry: cast === 2 ? !degraded && !rerendered : !degraded,
    degraded,
    rerendered,
    giantFace: /giant_face_hfrac|face_gate:couple/.test(s),
    swapped: cast === 2 ? /dual_swap_ms|identity_sim:L/.test(s) : /identity_sim_solo/.test(s),
    identity: (stamps.find((x) => /^identity_sim/.test(x)) || '').replace(
      /^identity_sim(_solo)?:/,
      ''
    ),
    llm: stamps.filter((x) => /^(llm|qa:llm)/.test(x)),
  };
}

async function logFor(where) {
  const { data } = await sb
    .from('ai_generation_log')
    .select('fallback_reasons,model_used,upload_id,job_id')
    .match(where);
  const stamps = (data || []).flatMap((l) => l.fallback_reasons || []).map(String);
  return {
    stamps,
    model: (data && data[0] && data[0].model_used) || null,
    uploadId: data && data[0] && data[0].upload_id,
  };
}

async function renderNightly(item, arm) {
  await waitForHeadroom({ min: 25, label: `llm-parity:${item.key}` });
  const body = {
    user_id: KEVIN,
    persist: true,
    force_cast_role: item.cast === 2 ? 'dual' : 'self',
    force_slot_input: item.input,
    force_model: item.model,
    ...(arm === '5.5' ? { force_llm_model: ARM55 } : {}),
  };
  const t0 = Date.now();
  const sinceIso = new Date(t0 - 5000).toISOString();
  let p = {};
  let netErr = null;
  try {
    const res = await fetch(`${URL_}/functions/v1/nightly-dreams`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOK}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(200_000),
    });
    p = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
  } catch (e) {
    // Long (~90 s) requests lose their response on this network although the render finishes server-side
    // (2026-09-29). Don't depend on it: find the render in the log.
    netErr = `${e.message}${e.cause ? ' / ' + (e.cause.code || e.cause.message) : ''}`;
  }
  const uploadId = p.upload_id || (netErr ? await findRender(item, arm, sinceIso) : null);
  if (!uploadId) {
    return {
      error: String(p.error || netErr || 'no upload'),
      seconds: Math.round((Date.now() - t0) / 1000),
    };
  }
  claimed.add(uploadId);
  const log = await logFor({ upload_id: uploadId });
  return {
    uploadId,
    recovered: !p.upload_id,
    netErr,
    seconds: Math.round((Date.now() - t0) / 1000),
    ...log,
  };
}

const claimed = new Set();
/** This request's render: Kevin's, since it started, a forced slot input for THIS place, on THIS arm's model. */
async function findRender(item, arm, sinceIso) {
  const wantModel = arm === '5.5' ? 'claude-sonnet-5-5' : 'claude-sonnet-4-6';
  for (let tries = 0; tries < 24; tries++) {
    const { data } = await sb
      .from('ai_generation_log')
      .select(
        'upload_id, fallback_reasons, place:rolled_axes->observability->slotInput->>userPlace'
      )
      .eq('user_id', KEVIN)
      .gte('created_at', sinceIso)
      .contains('fallback_reasons', ['qa:force_slot_input'])
      .order('created_at', { ascending: true });
    const hit = (data || []).find(
      (r) =>
        r.upload_id &&
        !claimed.has(r.upload_id) &&
        (r.place || null) === (item.place || null) &&
        (r.fallback_reasons || []).includes(`llm:nightly_slots:${wantModel}`)
    );
    if (hit) return hit.upload_id;
    await new Promise((r) => setTimeout(r, 10_000));
  }
  return null;
}

const CREATE_PROMPTS = [
  ['dual', 'me and Steph snowboarding down a mountain', 'photography', 'cinematic'],
  ['dual', 'me and my wife dancing at a jazz club', 'vintage_film', 'cozy'],
  ['dual', 'me and Steph on a gondola in Venice', 'watercolor', 'dreamy'],
  ['dual', 'us exploring an ancient jungle temple', 'canvas', 'epic'],
  ['dual', 'me and Steph as pirates on a ship deck', 'animation', 'whimsical'],
  ['dual', 'me and my wife at a night market in Tokyo', 'photography', 'golden_hour'],
  ['dual', 'us hiking to a waterfall in Hawaii', 'canvas', 'golden_hour'],
  ['dual', 'me and Steph as astronauts on the moon', 'pop_art', 'epic'],
  ['dual', 'me and my wife at a cozy cabin by the fire in winter', 'fairytale', 'cozy'],
  ['dual', 'us riding horses on a beach at sunset', 'glamour', 'cinematic'],
  ['self', 'me surfing a huge wave', 'photography', 'epic'],
  ['self', 'me as a wizard in a library of floating books', 'fairytale', 'arcane'],
  ['self', 'me at a street cafe in Paris', 'watercolor', 'dreamy'],
  ['self', 'me as a knight in shining armor', 'canvas', 'epic'],
  ['self', 'me DJing at a rooftop party', 'pop_art', 'cinematic'],
];

async function renderCreate(item, arm, recipe) {
  await waitForHeadroom({ min: 25, label: `llm-parity:${item.key}` });
  const jobId = crypto.randomUUID();
  const payload = {
    job_id: jobId,
    mode: 'flux-dev',
    medium_key: item.medium,
    vibe_key: item.vibe,
    force_model: 'black-forest-labs/flux-1.1-pro',
    force_cast_role: item.role,
    vibe_profile: recipe,
    hint: item.hint,
    ...(arm === '5.5' ? { qa_llm_model: ARM55 } : {}),
  };
  await sb.from('dream_jobs').upsert({ id: jobId, user_id: KEVIN, status: 'processing', payload });
  const { error } = await sb.from('dream_queue').insert({
    id: jobId,
    user_id: KEVIN,
    source: 'create',
    weight: 'heavy',
    payload,
    status: 'queued',
    dedup_key: `llmparity:${jobId}`,
  });
  if (error) return { error: error.message };
  const t0 = Date.now();
  fetch(`${URL_}/functions/v1/dream-queue-worker`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOK}`, apikey: ANON, 'Content-Type': 'application/json' },
    body: '{}',
  }).catch(() => {});
  let row = null;
  while (Date.now() - t0 < 6 * 60 * 1000) {
    await new Promise((r) => setTimeout(r, 6000));
    const { data } = await sb
      .from('dream_queue')
      .select('status,upload_id,last_error')
      .eq('id', jobId)
      .single();
    row = data;
    if (['completed', 'dead_letter', 'failed'].includes(data.status)) break;
  }
  const log = await logFor({ job_id: jobId });
  return {
    jobId,
    uploadId: (row && row.upload_id) || log.uploadId,
    status: row && row.status,
    error: row && row.status !== 'completed' ? row.last_error || row.status : undefined,
    seconds: Math.round((Date.now() - t0) / 1000),
    ...log,
  };
}

(async () => {
  let items;
  let recipe = null;
  const itemsPath = path.join(OUT, `items-${SURFACE}.json`);
  if (fs.existsSync(itemsPath)) {
    items = JSON.parse(fs.readFileSync(itemsPath, 'utf8'));
    if (SURFACE === 'create') {
      recipe = (await sb.from('user_recipes').select('recipe').eq('user_id', KEVIN).single()).data
        .recipe;
    }
  } else if (SURFACE === 'nightly') {
    const rows = await sql(`
      select id, model_used as model, rolled_axes->'observability'->'slotInput' as input,
             jsonb_array_length(rolled_axes->'observability'->'slotInput'->'cast') as cast
      from ai_generation_log
      where user_id = '${KEVIN}' and status = 'completed' and created_at > now() - interval '14 days'
        and rolled_axes->'observability'->'slotInput' is not null and model_used like 'black-forest-labs/%'
        and not ('qa:force_slot_input' = any(fallback_reasons))
      order by created_at desc limit 400`);
    // --offset=N skips the first N distinct inputs of each cast size (a second round on fresh inputs).
    const OFFSET = Number(arg('offset', '0'));
    const pick = (cast, n) => {
      const seen = new Set();
      const out = [];
      let skipped = 0;
      for (const r of rows.filter((x) => x.cast === cast)) {
        const k = `${r.input.userPlace || ''}|${r.input.mediumFluxFragment || ''}`.slice(0, 120);
        if (seen.has(k)) continue;
        seen.add(k);
        if (skipped < OFFSET) {
          skipped++;
          continue;
        }
        out.push(r);
        if (out.length >= n) break;
      }
      return out;
    };
    items = [...pick(2, COUPLES), ...pick(1, SOLOS)].map((r, i) => ({
      key: `n${i + 1}`,
      sourceLogId: r.id,
      cast: r.cast,
      model: r.model,
      input: r.input,
      place: r.input.userPlace || null,
    }));
  } else {
    const { data } = await sb.from('user_recipes').select('recipe').eq('user_id', KEVIN).single();
    recipe = data.recipe;
    const reps = Math.max(1, Math.round((COUPLES + SOLOS) / CREATE_PROMPTS.length));
    items = CREATE_PROMPTS.flatMap(([role, hint, medium, vibe], i) =>
      Array.from({ length: reps }, (_, k) => ({
        key: `c${i + 1}${'ab'[k] || k}`,
        role,
        cast: role === 'dual' ? 2 : 1,
        hint,
        medium,
        vibe,
      }))
    );
  }
  if (!fs.existsSync(itemsPath)) fs.writeFileSync(itemsPath, JSON.stringify(items));
  // --skip=n1,n2: inputs already rendered in an earlier run (their renders are recovered from the log separately).
  const skip = arg('skip', '').split(',').filter(Boolean);
  items = items.filter((it) => !skip.includes(it.key));
  // Both arms per item, in a random order per pair so neither arm always renders first.
  const jobs = items.flatMap((it) =>
    (Math.random() < 0.5 ? ['4.6', '5.5'] : ['5.5', '4.6']).map((arm) => ({ it, arm }))
  );
  console.log(
    `▶ ${SURFACE}: ${items.length} inputs × 2 arms = ${jobs.length} renders (5.5 = ${ARM55}), ≤${IN_FLIGHT} in flight`
  );
  const results = [];
  let next = 0;
  await Promise.all(
    Array.from({ length: IN_FLIGHT }, async () => {
      while (next < jobs.length) {
        const { it, arm } = jobs[next++];
        let r;
        try {
          r =
            SURFACE === 'nightly'
              ? await renderNightly(it, arm)
              : await renderCreate(it, arm, recipe);
        } catch (e) {
          r = { error: e.message };
        }
        const g = r.stamps ? grade(r.stamps, it.cast) : null;
        // Neutral caption: the album never shows which model wrote it.
        const blindLabel = crypto.randomBytes(3).toString('hex');
        if (r.uploadId) {
          await sb
            .from('uploads')
            .update({ caption: `✨ LLM parity ${it.key}·${blindLabel}` })
            .eq('id', r.uploadId);
        }
        results.push({
          key: it.key,
          arm,
          cast: it.cast,
          blindLabel,
          ...r,
          stamps: r.stamps,
          grade: g,
        });
        console.log(
          `  ${it.key.padEnd(5)} ${arm}  ${r.error ? 'ERROR ' + String(r.error).slice(0, 80) : `${g.heldFirstTry ? 'HELD' : g.degraded ? 'DEGRADED' : 're-rendered'} ${r.seconds}s id ${g.identity} ${g.llm.filter((x) => x.startsWith('llm:')).join(' ')}`}`
        );
        fs.writeFileSync(
          path.join(OUT, `results-${SURFACE}.json`),
          JSON.stringify({ items, results }, null, 1)
        );
      }
    })
  );
  const by = (arm, cast) =>
    results.filter((r) => r.arm === arm && (!cast || r.cast === cast) && r.grade);
  for (const cast of [2, 1]) {
    for (const arm of ['4.6', '5.5']) {
      const rs = by(arm, cast);
      if (!rs.length) continue;
      const n = rs.length;
      const c = (f) => rs.filter(f).length;
      console.log(
        `${SURFACE} ${cast === 2 ? 'couples' : 'solos  '} ${arm}: n=${n} held-first-try ${c((r) => r.grade.heldFirstTry)}/${n} · degraded ${c((r) => r.grade.degraded)} · giant-face ${c((r) => r.grade.giantFace)} · errors ${results.filter((r) => r.arm === arm && r.cast === cast && r.error).length}`
      );
    }
  }
})().catch((e) => {
  console.error('FAIL', e.message);
  process.exit(1);
});
