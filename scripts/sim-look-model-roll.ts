/**
 * sim-look-model-roll.ts — roll the REAL nightly style contract N times, offline, no renders.
 *
 * Kevin 2026-09-17: "do a theoretical roll across 100 nightly dreams ... i want to see if it's rolling
 * correctly, the gemini are still over represented it seems like".
 *
 * This imports `buildStyleContract` — the SAME function nightly-dreams calls — with the live catalog,
 * approvals, model policy and engine_config. It is NOT a mirror of the roll (scripts/sim-nightly-distribution.js
 * is, and a mirror is exactly the thing that can drift and lie). The only thing simulated is the surface mix.
 *
 *   deno run --allow-net --allow-env --allow-read scripts/sim-look-model-roll.ts [N] [BIGN]
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';
import { loadNightlyLooks } from '../supabase/functions/_shared/pools/nightlyLooksLoader.ts';
import { loadNightlyModelPolicy } from '../supabase/functions/_shared/pools/nightlyModelPolicyLoader.ts';
import {
  buildStyleContract,
  type StyleSurface,
} from '../supabase/functions/_shared/nightlyStyle.ts';
import { looksPathBans } from '../supabase/functions/_shared/nightlyLooksPath.ts';
import { fetchEngineConfig } from '../supabase/functions/_shared/engineConfig.ts';

const envText = await Deno.readTextFile('.env.local');
const env: Record<string, string> = {};
for (const line of envText.split('\n')) {
  const i = line.indexOf('=');
  if (i > 0 && !line.startsWith('#'))
    env[line.slice(0, i).trim()] = line
      .slice(i + 1)
      .trim()
      .replace(/^"|"$/g, '');
}
const sb = createClient(env.EXPO_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const N = Number(Deno.args[0] ?? 100);
const BIGN = Number(Deno.args[1] ?? 20000);

const catalog = await loadNightlyLooks(sb);
const policy = await loadNightlyModelPolicy(sb);
const cfg = await fetchEngineConfig(sb);
// Same ban set the render builds (contractBans → looksPathBans with no day-of holiday).
const bans = looksPathBans(new Set(['black-forest-labs/flux-2-dev']), policy, []);

console.log(`catalog: ${catalog.looks.length} looks · ${catalog.approvals.length} approval rows`);
for (const s of ['couple', 'solo'] as const)
  console.log(
    `  policy ${s}: ${policy[s].primaryModels.join(', ')} weights ${JSON.stringify(policy[s].primaryWeights)}`
  );
console.log(`  legacyPct ${cfg.nightlyLegacyLookPct} · recency ${cfg.nightlyLookRecency}\n`);

const short = (m: string) => m.split('/').pop() ?? m;
function roll(surface: StyleSurface) {
  return buildStyleContract({
    surface,
    policy,
    modelFromLook: true,
    lockLook: true,
    bans,
    evenModelSplit: surface === 'scene',
    looks: catalog.looks,
    approvals: catalog.approvals,
    recentLookKeys: [],
    recencyWindow: cfg.nightlyLookRecency,
    legacyPct: cfg.nightlyLegacyLookPct,
  });
}

// ── 1. The 100 rolls Kevin asked to see, at the observed subject mix ──────────
const { data: mixRows } = await sb
  .from('uploads')
  .select('face_swap_mode')
  .eq('user_id', 'eab700d8-f11a-4f47-a3a1-addda6fb67ec')
  .gte('created_at', '2026-09-10')
  .not('face_swap_mode', 'is', null)
  .limit(1000);
const mix = { dual: 0, single: 0 };
for (const r of mixRows ?? []) {
  if (r.face_swap_mode === 'dual') mix.dual++;
  else mix.single++;
}
const dualShare = mix.dual / Math.max(1, mix.dual + mix.single);
console.log(
  `observed subject mix (last ~1000 real renders): couple ${(dualShare * 100).toFixed(0)}% · solo ${((1 - dualShare) * 100).toFixed(0)}%\n`
);

const rows: { n: number; subject: string; model: string; look: string }[] = [];
for (let i = 1; i <= N; i++) {
  const surface: StyleSurface = Math.random() < dualShare ? 'couple' : 'solo';
  const c = roll(surface);
  if (!c) continue;
  rows.push({
    n: i,
    subject: surface === 'couple' ? 'couple (+1)' : 'solo (self)',
    model: short(c.model),
    look: c.look.key.replace('nightly_', ''),
  });
}
console.log(`── ${rows.length} ROLLS ──`);
for (const r of rows.slice(0, 40))
  console.log(
    `  ${String(r.n).padStart(3)}  ${r.subject.padEnd(12)} ${r.model.padEnd(16)} ${r.look}`
  );
if (rows.length > 40) console.log(`  … ${rows.length - 40} more`);

const tally = (f: (r: (typeof rows)[0]) => string) => {
  const m = new Map<string, number>();
  for (const r of rows) m.set(f(r), (m.get(f(r)) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
};
console.log(`\n  model over ${rows.length}:`);
for (const [k, v] of tally((r) => r.model))
  console.log(`    ${k.padEnd(16)} ${v} (${((100 * v) / rows.length).toFixed(1)}%)`);
console.log(`  distinct looks: ${new Set(rows.map((r) => r.look)).size}`);
console.log(`  top looks:`);
for (const [k, v] of tally((r) => r.look).slice(0, 8)) console.log(`    ${k.padEnd(26)} ${v}`);

// ── 2. The statistical answer: is the delivered share the configured share? ───
console.log(`\n── ${BIGN} ROLLS PER SURFACE (is the roll correct?) ──`);
for (const surface of ['couple', 'solo'] as const) {
  const counts = new Map<string, number>();
  const poolSize = new Map<number, number>();
  let n = 0;
  for (let i = 0; i < BIGN; i++) {
    const c = roll(surface);
    if (!c) continue;
    n++;
    counts.set(short(c.model), (counts.get(short(c.model)) ?? 0) + 1);
    const ps = c.stamps.find((s: string) => s.startsWith('model_source:look:'));
    const k = ps ? Number(ps.split(':').pop()) : 0;
    poolSize.set(k, (poolSize.get(k) ?? 0) + 1);
  }
  const w = policy[surface].primaryWeights ?? [];
  const tot = w.reduce((a: number, b: number) => a + b, 0) || 1;
  console.log(
    `\n  ${surface}  (configured: ${policy[surface].primaryModels.map((m: string, i: number) => `${short(m)} ${((100 * (w[i] ?? 0)) / tot).toFixed(0)}%`).join(' · ')})`
  );
  for (const [k, v] of [...counts.entries()].sort((a, b) => b[1] - a[1]))
    console.log(`    delivered  ${k.padEnd(16)} ${((100 * v) / n).toFixed(1)}%`);
  console.log(
    `    pool size: ${[...poolSize.entries()]
      .sort()
      .map(([k, v]) => `${k}-model ${((100 * v) / n).toFixed(1)}%`)
      .join(' · ')}`
  );
}
