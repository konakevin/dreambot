#!/usr/bin/env node
/**
 * simulate-holiday-hero.mjs — roll N hypothetical users through the LIVE day-of hero
 * recipes (mig 457/458) with the PRODUCTION hero math and measure DIVERSITY: is every
 * user's hero a genuinely different scene, or do they pigeonhole into a few repeats?
 *
 *   node scripts/simulate-holiday-hero.mjs                 # 500 users, halloween, all rows
 *   node scripts/simulate-holiday-hero.mjs --n 2000 --holiday halloween
 *   node scripts/simulate-holiday-hero.mjs --show 8        # print 8 sample prompts per row
 *
 * Per (surface × register) it reports: combo space, distinct prompts among N users, the
 * exact-repeat rate (users sharing a prompt with someone else), the max share of any one
 * combo, per-axis balance (min/max share vs uniform), how much of the final scene text is
 * VARIABLE (axis-filled) vs fixed template, the mean pairwise token overlap between two
 * random users (1.0 = identical), and year-over-year change for the same user. It also
 * flags weak spots: any axis with < 3 values, a row whose variable share is < 25%, or a
 * repeat rate above 50%. Exit 1 on a flag so it can gate a seeding round.
 */
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import {
  fillHeroTemplate,
  heroSeed,
  mapHeroRow,
} from '../supabase/functions/_shared/holidayHero.ts';

const env = Object.fromEntries(
  fs
    .readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      return [
        l.slice(0, i).trim(),
        l
          .slice(i + 1)
          .trim()
          .replace(/^["']|["']$/g, ''),
      ];
    })
);
const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', env.SUPABASE_SERVICE_ROLE_KEY);
const arg = (n, d) => {
  const i = process.argv.indexOf('--' + n);
  return i >= 0 ? process.argv[i + 1] : d;
};
const N = Number(arg('n', '500'));
const HOLIDAY = arg('holiday', 'halloween');
const SHOW = Number(arg('show', '3'));
const YEAR = 2026;

const { data, error } = await sb
  .from('holiday_hero_prompts')
  .select('holiday,surface,register,attire,scene,medium_key,medium_ban,pose_pool,axes')
  .eq('holiday', HOLIDAY)
  .eq('disabled', false)
  .order('surface')
  .order('register');
if (error) throw new Error(error.message);
const rows = (data ?? []).map(mapHeroRow);
if (!rows.length) {
  console.log(`no hero rows for ${HOLIDAY}`);
  process.exit(1);
}

// Deterministic pseudo-user ids (uuid-shaped, stable run to run).
const userIds = Array.from(
  { length: N },
  (_, i) => `00000000-0000-4000-8000-${String(i).padStart(12, '0')}`
);
const tokens = (s) => new Set(s.toLowerCase().match(/[a-z][a-z'-]+/g) ?? []);
const jaccard = (a, b) => {
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  return inter / (a.size + b.size - inter || 1);
};
const pct = (x) => `${(x * 100).toFixed(1)}%`;
const flags = [];

console.log(`Hero diversity simulation · ${HOLIDAY} · ${N} users · ${rows.length} recipe row(s)\n`);
for (const row of rows) {
  const label = `${row.surface}/${row.register}`;
  const axes = Object.entries(row.axes).filter(([, v]) => v.length > 0);
  const comboSpace = axes.reduce((p, [, v]) => p * v.length, 1);
  const fills = userIds.map((u) => fillHeroTemplate(row, heroSeed(u, HOLIDAY, YEAR)));
  const prompts = fills.map((f) => `${f.attire} || ${f.scene}`);
  const counts = new Map();
  for (const p of prompts) counts.set(p, (counts.get(p) ?? 0) + 1);
  const distinct = counts.size;
  const repeaters = prompts.filter((p) => counts.get(p) > 1).length;
  const maxShare = Math.max(...counts.values()) / N;
  // per-axis balance
  const axisReport = axes.map(([axis, values]) => {
    const c = {};
    for (const f of fills) c[f.picks[axis]] = (c[f.picks[axis]] ?? 0) + 1;
    const shares = values.map((v) => (c[v] ?? 0) / N);
    return {
      axis,
      n: values.length,
      min: Math.min(...shares),
      max: Math.max(...shares),
      uniform: 1 / values.length,
    };
  });
  // variable share of the scene text (chars contributed by axis picks / total)
  const varChars =
    fills.reduce((s, f) => s + Object.values(f.picks).reduce((a, v) => a + v.length, 0), 0) / N;
  const totalChars = fills.reduce((s, f) => s + f.scene.length + f.attire.length, 0) / N;
  const variableShare = varChars / totalChars;
  // mean pairwise token overlap on 400 random pairs
  let overlap = 0;
  const pairs = 400;
  const toks = fills.map((f) => tokens(`${f.attire} ${f.scene}`));
  for (let i = 0; i < pairs; i++) {
    const a = (i * 7919) % N;
    const b = (i * 104729 + 13) % N;
    overlap += jaccard(toks[a], toks[b === a ? (a + 1) % N : b]);
  }
  overlap /= pairs;
  // year-over-year: same user, next year → different prompt?
  const nextYear = userIds.map((u) => fillHeroTemplate(row, heroSeed(u, HOLIDAY, YEAR + 1)));
  const changed = nextYear.filter((f, i) => `${f.attire} || ${f.scene}` !== prompts[i]).length / N;

  console.log(`── ${label}  [${row.mediumKey ?? 'rolled medium'}]`);
  console.log(
    `   combo space ${comboSpace}  ·  distinct among ${N}: ${distinct}  ·  users sharing a prompt with someone: ${pct(repeaters / N)}  ·  biggest single combo: ${pct(maxShare)}`
  );
  console.log(
    `   variable share of text ${pct(variableShare)}  ·  mean pairwise token overlap ${overlap.toFixed(2)}  ·  changes next year for ${pct(changed)} of users`
  );
  for (const a of axisReport) {
    console.log(
      `   axis ${a.axis.padEnd(9)} ${String(a.n).padStart(2)} values  share min ${pct(a.min)} / max ${pct(a.max)} (uniform ${pct(a.uniform)})`
    );
    if (a.n < 3) flags.push(`${label}: axis "${a.axis}" has only ${a.n} value(s)`);
  }
  if (variableShare < 0.25)
    flags.push(
      `${label}: only ${pct(variableShare)} of the text varies — the scene is pigeonholed`
    );
  if (repeaters / N > 0.5)
    flags.push(`${label}: ${pct(repeaters / N)} of users share an exact prompt with someone`);
  if (SHOW > 0) {
    console.log('   samples:');
    for (let i = 0; i < SHOW; i++) console.log(`     • ${fills[(i * 37) % N].scene}`);
  }
  console.log();
}
if (flags.length) {
  console.log('⚠ diversity flags:');
  for (const f of flags) console.log(`  - ${f}`);
  process.exit(1);
}
console.log('✓ no diversity flags');
