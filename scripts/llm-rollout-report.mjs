#!/usr/bin/env node
/**
 * LLM rollout report (LLM_MIGRATION.md step 3): how each Anthropic job is doing, per model, in production.
 *
 * Reads the stamps the clients write (ai_generation_log.fallback_reasons for the app, bot_run_log.llm_models for the
 * bots) over a window and prints, per job x model: calls, fallbacks, refusals, truncations, whole-chain failures.
 * Then the product check that decides a rollback: first-try face-swap hold, split by which model wrote the prompt.
 *
 *   node scripts/llm-rollout-report.mjs [--hours=48] [--qa] [--user=<uuid>]
 *
 * --qa includes QA renders (excluded by default, so lab rounds never count as production).
 * Rollback trigger (the plan): a job's fallback / refusal / truncation rate more than 2 points worse than its 4.6
 * baseline, or swap hold outside its gate. Rollback = remove the job from engine_config.llm_models (or llm_preview_models).
 */
import fs from 'fs';

const env = Object.fromEntries(
  fs
    .readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);
const SRK = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
const BASE = 'https://jimftynwrinwenonjrlj.supabase.co/rest/v1/';
const arg = (k, d) => {
  const a = process.argv.find((x) => x.startsWith(`--${k}=`));
  return a ? a.slice(k.length + 3) : d;
};
const HOURS = Number(arg('hours', '48'));
const WITH_QA = process.argv.includes('--qa');
const USER = arg('user', '');
const since = new Date(Date.now() - HOURS * 3600e3).toISOString();

async function all(table, select, filters) {
  const out = [];
  for (let from = 0; ; from += 1000) {
    const res = await fetch(`${BASE}${table}?select=${select}&${filters}`, {
      headers: { apikey: SRK, Authorization: `Bearer ${SRK}`, Range: `${from}-${from + 999}` },
    });
    if (!res.ok) throw new Error(`${table} ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const rows = await res.json();
    out.push(...rows);
    if (rows.length < 1000) break; // PostgREST caps a read at 1000 rows: page until a short page.
  }
  return out;
}

const qaFilter = WITH_QA ? '' : '&or=(is_qa.is.null,is_qa.eq.false)';
const userFilter = USER ? `&user_id=eq.${USER}` : '';
const logs = await all(
  'ai_generation_log',
  'fallback_reasons,status',
  `created_at=gte.${since}${qaFilter}${userFilter}&order=created_at.asc`
);
const bots = USER
  ? []
  : await all('bot_run_log', 'llm_models,status', `created_at=gte.${since}&source=eq.dispatcher`);

const stats = new Map(); // "job model" -> counts
const bump = (job, model, k) => {
  const key = `${job}\t${model}`;
  const s = stats.get(key) || { calls: 0, fallback: 0, refusal: 0, truncated: 0, failed: 0 };
  s[k]++;
  stats.set(key, s);
};
const swap = new Map(); // "surface model" -> {n, held}
function read(stamps) {
  for (const x of stamps) {
    let m;
    if ((m = x.match(/^llm:([a-z_]+):(.+)$/))) bump(m[1], m[2], 'calls');
    else if ((m = x.match(/^llm_fallback:([a-z_]+):([^→]+)→/))) bump(m[1], m[2], 'fallback');
    else if ((m = x.match(/^llm_refusal:([a-z_]+):([^:]+):/))) bump(m[1], m[2], 'refusal');
    else if ((m = x.match(/^llm_truncated:([a-z_]+):(.+)$/))) bump(m[1], m[2], 'truncated');
    else if ((m = x.match(/^llm_failed:([a-z_]+):/))) bump(m[1], '(chain)', 'failed');
  }
}
for (const r of logs) {
  const st = (r.fallback_reasons || []).map(String);
  read(st);
  if (!st.some((x) => /^dual_attempts:|^dual_swap_error:/.test(x))) continue;
  const writer = st.find((x) => /^llm:(create|nightly)_(slots|brief):/.test(x));
  if (!writer) continue;
  const [, job, model] = writer.match(/^llm:([a-z_]+):(.+)$/);
  const held =
    !st.includes('rerender_for_dual') &&
    !st.some((x) => /dual_degrade_single|solo_fallback/.test(x));
  const key = `${job.split('_')[0]} couples\t${model}`;
  const s = swap.get(key) || { n: 0, held: 0 };
  s.n++;
  if (held) s.held++;
  swap.set(key, s);
}
for (const b of bots)
  read(
    String(b.llm_models || '')
      .split(/\s+/)
      .filter(Boolean)
  );

const pct = (a, n) => (n ? `${((100 * a) / n).toFixed(1)}%` : '—');
console.log(
  `LLM rollout report · last ${HOURS} h · ${logs.length} app renders${WITH_QA ? ' (QA included)' : ''} · ${bots.length} bot runs${USER ? ` · user ${USER}` : ''}\n`
);
console.log(
  'job'.padEnd(18) +
    'model'.padEnd(28) +
    'calls'.padStart(7) +
    'fallback'.padStart(10) +
    'refusal'.padStart(9) +
    'truncated'.padStart(11) +
    'failed'.padStart(8)
);
for (const [key, s] of [...stats].sort()) {
  const [job, model] = key.split('\t');
  const n = Math.max(s.calls, 1);
  console.log(
    job.padEnd(18) +
      model.padEnd(28) +
      String(s.calls).padStart(7) +
      pct(s.fallback, n).padStart(10) +
      pct(s.refusal, n).padStart(9) +
      pct(s.truncated, n).padStart(11) +
      String(s.failed).padStart(8)
  );
}
console.log('\nfirst-try face-swap hold, by the model that wrote the prompt:');
if (!swap.size) console.log('  (no couple renders in the window)');
for (const [key, s] of [...swap].sort()) {
  const [surface, model] = key.split('\t');
  console.log(`  ${surface.padEnd(16)} ${model.padEnd(28)} ${s.held}/${s.n}  ${pct(s.held, s.n)}`);
}
