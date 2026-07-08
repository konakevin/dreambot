#!/usr/bin/env node
/**
 * Face-swap health snapshot — the Stage-0 baseline for FACE_SWAP_UPGRADE_PLAN.md.
 *
 * Every stage's soak window compares against these numbers. Run before any
 * flip and weekly during the program:
 *   node scripts/faceswap-baseline.js [--days 30]
 *
 * One metric per line, diffable.
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const sb = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const args = process.argv.slice(2);
const daysIdx = args.indexOf('--days');
const DAYS = daysIdx >= 0 ? Number(args[daysIdx + 1]) : 30;
const SINCE = new Date(Date.now() - DAYS * 86400e3).toISOString();

async function count(table, mods) {
  let q = sb.from(table).select('id', { count: 'exact', head: true });
  q = mods(q);
  const { count: c, error } = await q;
  if (error) throw new Error(`${table}: ${error.message}`);
  return c ?? 0;
}

(async () => {
  console.log(`# face-swap baseline — last ${DAYS}d (since ${SINCE})`);

  // Volume by swap mode
  const dual = await count('uploads', (q) =>
    q.eq('face_swap_mode', 'dual').gte('created_at', SINCE)
  );
  const single = await count('uploads', (q) =>
    q.eq('face_swap_mode', 'single').gte('created_at', SINCE)
  );
  console.log(`dual_swaps_persisted ${dual}`);
  console.log(`single_swaps_persisted ${single}`);

  // Queue outcomes for swap-weight jobs (heavy = swap-likely)
  const heavyTotal = await count('dream_queue', (q) =>
    q.eq('weight', 'heavy').gte('created_at', SINCE)
  );
  const heavyDead = await count('dream_queue', (q) =>
    q.eq('weight', 'heavy').eq('status', 'dead_letter').gte('created_at', SINCE)
  );
  console.log(`heavy_jobs ${heavyTotal}`);
  console.log(
    `heavy_dead_letter_pct ${heavyTotal ? ((100 * heavyDead) / heavyTotal).toFixed(2) : 'n/a'}`
  );

  // Refunds tied to dead-lettered queue jobs
  const { data: refunds } = await sb
    .from('sparkle_transactions')
    .select('id, reason')
    .like('reason', 'refund:queue_dead_letter%')
    .gte('created_at', SINCE)
    .limit(5000);
  console.log(`dead_letter_refunds ${(refunds ?? []).length}`);

  // Swap-related fallback reasons (engine telemetry lands in Stage 0;
  // pre-telemetry this doubles as the dynamic-split liveness probe:
  // zero no_dual_split across nonzero duals ⇒ blind 55/55 is serving).
  const { data: logs } = await sb
    .from('ai_generation_log')
    .select('fallback_reasons, rolled_axes, created_at')
    .gte('created_at', SINCE)
    .not('fallback_reasons', 'is', null)
    .limit(5000);
  const reasonCounts = {};
  for (const r of logs ?? []) {
    for (const f of r.fallback_reasons ?? []) {
      if (/dual|split|swap|solo|restore/i.test(f)) {
        const key = f.replace(/\(.*?\)/g, '(N)');
        reasonCounts[key] = (reasonCounts[key] ?? 0) + 1;
      }
    }
  }
  const keys = Object.keys(reasonCounts).sort();
  if (keys.length === 0) console.log('swap_fallback_reasons none');
  for (const k of keys) console.log(`reason ${k} ${reasonCounts[k]}`);

  // p95 render duration for completed heavy jobs (started→completed)
  const { data: heavyDone } = await sb
    .from('dream_queue')
    .select('started_at, completed_at')
    .eq('weight', 'heavy')
    .eq('status', 'completed')
    .gte('created_at', SINCE)
    .not('started_at', 'is', null)
    .not('completed_at', 'is', null)
    .limit(5000);
  const durs = (heavyDone ?? [])
    .map((r) => (new Date(r.completed_at) - new Date(r.started_at)) / 1000)
    .filter((s) => s > 0)
    .sort((a, b) => a - b);
  if (durs.length) {
    const p = (q) => durs[Math.min(durs.length - 1, Math.floor(q * durs.length))].toFixed(1);
    console.log(`heavy_duration_s p50 ${p(0.5)} p95 ${p(0.95)} n ${durs.length}`);
  } else {
    console.log('heavy_duration_s n 0');
  }

  // Swap-cost accounting (Stage 0 telemetry) — present once rolled_axes.swap ships
  const withSwapAxes = (logs ?? []).filter((r) => r.rolled_axes && r.rolled_axes.swap);
  console.log(`renders_with_swap_accounting ${withSwapAxes.length}`);
})();
