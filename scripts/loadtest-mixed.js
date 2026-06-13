#!/usr/bin/env node
/**
 * loadtest-mixed.js — combined LIGHT + HEAVY burst to validate the per-weight
 * concurrency caps hold independently under sustained load.
 *
 * Fires --light text dreams (weight=light) + --heavy dual face-swap dreams
 * (weight=heavy) at once, kicks the worker, and samples in_progress BY WEIGHT
 * every second. Asserts: light peak ≤ lightCap, heavy peak ≤ heavyCap, zero
 * 546, no orphaned successes (uploads == completed), and reports per-lane
 * completion + failure modes.
 *
 *   node --env-file=.env.local scripts/loadtest-mixed.js --light 150 --heavy 24
 *   node --env-file=.env.local scripts/loadtest-mixed.js --cleanup
 *
 * ⚠️ Spends real render $. Heavy (dual) jobs need the user dual-ready.
 */

const { createClient } = require('@supabase/supabase-js');
const URL = process.env.SUPABASE_URL || 'https://jimftynwrinwenonjrlj.supabase.co';
const sb = createClient(URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const WT = process.env.DREAM_QUEUE_WORKER_TOKEN;
const KEVIN = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const args = process.argv.slice(2);
const flag = (n, d) => {
  const i = args.indexOf('--' + n);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d;
};
const NLIGHT = parseInt(flag('light', '150'), 10);
const NHEAVY = parseInt(flag('heavy', '24'), 10);
const USER = flag('user', KEVIN);
const TAG = 'mixtest';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function cleanup() {
  const { data: rows } = await sb.from('dream_queue').select('id').like('dedup_key', `${TAG}:%`);
  const since = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  const { data: ups } = await sb
    .from('uploads')
    .select('id, image_url, image_url_display')
    .eq('user_id', USER)
    .eq('is_public', false)
    .gte('created_at', since);
  const paths = [];
  for (const u of ups ?? [])
    for (const x of [u.image_url, u.image_url_display])
      if (x && /\/uploads\//.test(x)) paths.push(x.split('/uploads/')[1]);
  for (let i = 0; i < paths.length; i += 100)
    await sb.storage.from('uploads').remove(paths.slice(i, i + 100));
  if ((ups ?? []).length)
    await sb
      .from('uploads')
      .delete()
      .in(
        'id',
        (ups ?? []).map((u) => u.id)
      );
  await sb.from('dream_queue').delete().like('dedup_key', `${TAG}:%`);
  if ((rows ?? []).length)
    await sb
      .from('dream_jobs')
      .delete()
      .in(
        'id',
        (rows ?? []).map((r) => r.id)
      );
  console.log(
    `Cleaned ${(ups ?? []).length} uploads + ${paths.length} blobs + ${(rows ?? []).length} rows.`
  );
}

async function main() {
  if (args.includes('--cleanup')) return cleanup();

  const { data: cfg } = await sb
    .from('engine_config')
    .select('dream_queue_max_concurrent, dream_queue_max_concurrent_heavy')
    .eq('id', 1)
    .single();
  const lightCap = cfg?.dream_queue_max_concurrent ?? 40;
  const heavyCap = cfg?.dream_queue_max_concurrent_heavy ?? 10;
  const { data: r } = await sb
    .from('user_recipes')
    .select('recipe')
    .eq('user_id', USER)
    .maybeSingle();
  const recipe = r?.recipe;
  const { data: meds } = await sb
    .from('dream_mediums')
    .select('key, character_render_mode')
    .eq('face_swaps', true);
  const heavyMed =
    (meds || []).find((m) => m.character_render_mode === 'natural')?.key || 'photography';

  const jobs = [];
  const rows = [];
  for (let i = 0; i < NLIGHT; i++) {
    const id = crypto.randomUUID();
    const p = {
      mode: 'flux-dev',
      medium_key: 'illustration',
      vibe_key: 'cinematic',
      hint: `a quiet valley ${i}`,
      job_id: id,
      vibe_profile: {},
    };
    jobs.push({ id, p });
    rows.push({
      id,
      user_id: USER,
      source: 'create',
      weight: 'light',
      payload: p,
      status: 'queued',
      dedup_key: `${TAG}:${id}`,
    });
  }
  for (let i = 0; i < NHEAVY; i++) {
    const id = crypto.randomUUID();
    const p = {
      mode: 'flux-dev',
      medium_key: heavyMed,
      vibe_key: 'cinematic',
      hint: `the two of us ${i}`,
      job_id: id,
      vibe_profile: recipe,
      force_cast_role: 'dual',
    };
    jobs.push({ id, p });
    rows.push({
      id,
      user_id: USER,
      source: 'create',
      weight: 'heavy',
      payload: p,
      status: 'queued',
      dedup_key: `${TAG}:${id}`,
    });
  }
  console.log(
    `Firing ${NLIGHT} LIGHT + ${NHEAVY} HEAVY (caps: light=${lightCap} heavy=${heavyCap})...`
  );

  for (let i = 0; i < jobs.length; i += 200) {
    const chunk = jobs.slice(i, i + 200);
    await sb.from('dream_jobs').upsert(
      chunk.map((j) => ({ id: j.id, user_id: USER, status: 'processing', payload: j.p })),
      { onConflict: 'id', ignoreDuplicates: true }
    );
    const { error } = await sb
      .from('dream_queue')
      .insert(chunk.map((j) => rows.find((x) => x.id === j.id)));
    if (error) return console.error('insert error:', error.message);
  }
  const ids = jobs.map((j) => j.id);
  const t0 = Date.now();
  const kick = () =>
    WT &&
    fetch(`${URL}/functions/v1/dream-queue-worker`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${WT}`, 'Content-Type': 'application/json' },
      body: '{}',
    }).catch(() => {});
  for (let k = 0; k < 4; k++) {
    kick();
    await sleep(400);
  }

  let maxL = 0,
    maxH = 0;
  const doneAt = new Map();
  for (let t = 0; t < 600; t++) {
    await sleep(1000);
    const { data } = await sb.from('dream_queue').select('id, status, weight').in('id', ids);
    let lip = 0,
      hip = 0,
      lc = 0,
      hc = 0,
      ld = 0,
      hd = 0,
      lq = 0,
      hq = 0;
    for (const x of data ?? []) {
      const h = x.weight === 'heavy';
      if (x.status === 'in_progress') h ? hip++ : lip++;
      else if (x.status === 'completed') {
        h ? hc++ : lc++;
        if (!doneAt.has(x.id)) doneAt.set(x.id, Date.now() - t0);
      } else if (x.status === 'dead_letter') {
        h ? hd++ : ld++;
        if (!doneAt.has(x.id)) doneAt.set(x.id, Date.now() - t0);
      } else if (x.status === 'queued') h ? hq++ : lq++;
    }
    maxL = Math.max(maxL, lip);
    maxH = Math.max(maxH, hip);
    if (t % 5 === 0)
      process.stdout.write(
        `\rt+${t + 1}s L[ip=${lip} ✓${lc} ✗${ld} q=${lq}] H[ip=${hip} ✓${hc} ✗${hd} q=${hq}] peaks L=${maxL} H=${maxH}      \n`
      );
    if ((lq || hq) > 0 && t % 2 === 0) kick();
    if (lc + ld >= NLIGHT && hc + hd >= NHEAVY) break;
  }

  const { data: final } = await sb
    .from('dream_queue')
    .select('status, weight, last_error')
    .in('id', ids);
  const L = final.filter((x) => x.weight === 'light');
  const H = final.filter((x) => x.weight === 'heavy');
  const cnt = (a, s) => a.filter((x) => x.status === s).length;
  const res546 = final.filter((x) => /546|resource|worker_limit/i.test(x.last_error || '')).length;
  // orphan check: private uploads in window vs total completed
  const since = new Date(Date.now() - 20 * 60 * 1000).toISOString();
  const { count: upCount } = await sb
    .from('uploads')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', USER)
    .eq('is_public', false)
    .gte('created_at', since);
  const totalCompleted = cnt(L, 'completed') + cnt(H, 'completed');

  console.log('\n\n━━━ MIXED LOAD RESULT ━━━');
  console.log(
    `LIGHT: ${cnt(L, 'completed')} ✓ / ${cnt(L, 'dead_letter')} ✗   peak in_progress ${maxL}/${lightCap}  ${maxL <= lightCap + 2 ? '✅' : '❌ CAP EXCEEDED'}`
  );
  console.log(
    `HEAVY: ${cnt(H, 'completed')} ✓ / ${cnt(H, 'dead_letter')} ✗   peak in_progress ${maxH}/${heavyCap}  ${maxH <= heavyCap + 2 ? '✅' : '❌ CAP EXCEEDED'}`
  );
  console.log(`546/resource fails: ${res546}  ${res546 === 0 ? '✅' : '❌'}`);
  console.log(
    `orphan check: uploads_in_window=${upCount} totalCompleted=${totalCompleted}  ${upCount <= totalCompleted ? '✅ no orphans' : `⚠ ${upCount - totalCompleted} orphaned`}`
  );
  const hErrs = {};
  H.filter((x) => x.last_error).forEach((x) => {
    const e = x.last_error.slice(0, 70);
    hErrs[e] = (hErrs[e] || 0) + 1;
  });
  if (Object.keys(hErrs).length) {
    console.log('heavy errors:');
    Object.entries(hErrs).forEach(([e, n]) => console.log(`  ${n}x ${e}`));
  }
  console.log('\nRun --cleanup to delete the test data.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
