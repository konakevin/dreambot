#!/usr/bin/env node
/**
 * queue.js — the reseed candidate queue: SUBJECT pools of PUBLIC bots that the dupes scan reads as
 * ≥20% same-idea with ≥50 entries, worst first. Starting list only: the scan's number is a lexical
 * FLOOR on redundancy (SEED_DIVERSITY_CHARTER.md §4) and the subject match is by slot-name suffix
 * (SUBJECT_POOL_MAP.json), so VERIFY each pool by reading the path file before working it.
 *
 *   node scripts/reseed/queue.js [--min-pct 20] [--min-n 50] [--top 40] [--json out.json]
 */
/* global __dirname */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..', '..');
const argv = process.argv.slice(2);
const flag = (n) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : null);
const MIN_PCT = Number(flag('--min-pct') || 20);
const MIN_N = Number(flag('--min-n') || 50);
const TOP = Number(flag('--top') || 40);
const DARK_BOTS = new Set(['alphabot', 'outlawbot']); // post to nobody

const tmp = path.join(os.tmpdir(), `bot-seed-dupes-${Date.now()}.json`);
execFileSync('node', [path.join(ROOT, 'scripts/scan-bot-seed-dupes.js'), '--json', tmp], {
  cwd: ROOT,
  stdio: ['ignore', 'ignore', 'inherit'],
});
const rows = JSON.parse(fs.readFileSync(tmp, 'utf8'));
const map = JSON.parse(fs.readFileSync(path.join(ROOT, 'SUBJECT_POOL_MAP.json'), 'utf8'));

const slotsByBot = {};
for (const [key, v] of Object.entries(map)) {
  const [bot, p] = key.split('/');
  const slots = String(v.subject || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  (slotsByBot[bot] = slotsByBot[bot] || []).push({ path: p, slots });
}

const queue = [];
for (const r of rows) {
  if (DARK_BOTS.has(r.bot) || r.n < MIN_N || r.coarsePct < MIN_PCT) continue;
  const paths = (slotsByBot[r.bot] || []).filter((p) =>
    p.slots.some((s) => r.pool === s || r.pool.endsWith('_' + s))
  );
  if (!paths.length) continue;
  queue.push({
    bot: r.bot,
    paths: paths.map((p) => p.path),
    pool: r.pool,
    entries: r.n,
    sameIdeaPct: r.coarsePct,
  });
}
queue.sort((a, b) => b.sameIdeaPct - a.sameIdeaPct || b.entries - a.entries);

if (flag('--json')) fs.writeFileSync(flag('--json'), JSON.stringify(queue, null, 1) + '\n');
console.log(
  `${queue.length} candidate subject pools (public bots, ≥${MIN_N} entries, ≥${MIN_PCT}% same-idea by the lexical scan)`
);
console.log('same% | n   | bot       | pool  (paths)');
for (const q of queue.slice(0, TOP)) {
  console.log(
    `${String(q.sameIdeaPct).padStart(4)}% | ${String(q.entries).padStart(3)} | ${q.bot.padEnd(9)} | ${q.pool}  (${q.paths.join(', ')})`
  );
}
