#!/usr/bin/env node
/**
 * resmoke-axis-paths.js — re-run the 3 hidden smoke renders for every AXIS_POOL_EXPANSION.md path
 * whose checklist line shows fewer than 3/3 delivered (the 2026-09-24 Replicate stall failed the
 * smoke step on six paths while the pools themselves were fine), and rewrite each line with the
 * re-run result. Sequential, one render in flight, headroom-gated.
 *
 *   node scripts/reseed/resmoke-axis-paths.js [--only bot/path] [--dry-run]
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '../..');
const TRACKER = path.join(ROOT, 'AXIS_POOL_EXPANSION.md');
const args = process.argv.slice(2);
const DRY = args.includes('--dry-run');
const onlyIdx = args.indexOf('--only');
const ONLY = onlyIdx >= 0 ? args[onlyIdx + 1] : null;

const md = fs.readFileSync(TRACKER, 'utf8');
const lines = md.split('\n');
const targets = [];
for (const line of lines) {
  const m = line.match(/^- \[[ x]\] \*\*([a-z]+)\/([a-z-]+)\*\* — .*smoke (\d)\/3 delivered/);
  if (!m) continue;
  const [, bot, p, n] = m;
  if (Number(n) >= 3) continue;
  if (ONLY && ONLY !== `${bot}/${p}`) continue;
  targets.push({ bot, path: p, prior: Number(n), line });
}
console.log(
  `paths needing a re-smoke: ${targets.map((t) => `${t.bot}/${t.path} (${t.prior}/3)`).join(', ') || 'none'}`
);
if (DRY) process.exit(0);

function run(cmd, timeoutMs) {
  const r = spawnSync(
    'bash',
    ['-c', cmd.replace(/^node /, `${JSON.stringify(process.execPath)} `)],
    {
      cwd: ROOT,
      encoding: 'utf8',
      timeout: timeoutMs,
      maxBuffer: 64 * 1024 * 1024,
    }
  );
  return { code: r.status, out: (r.stdout || '') + (r.stderr || '') };
}

for (const t of targets) {
  const h = run('node scripts/check-pool-headroom.js', 60000);
  if (h.code !== 0) {
    console.log('  headroom tight, waiting 5 min');
    spawnSync('sleep', ['300']);
  }
  const r = run(
    `node scripts/iter-bot.js --bot ${t.bot} --mode ${t.path} --count 3 --post --shadow --label axis-resmoke`,
    25 * 60 * 1000
  );
  const ok = (r.out.match(/✅/g) || []).length;
  const failed = (r.out.match(/❌ #/g) || []).length;
  const errs = [
    ...new Set(
      [...r.out.matchAll(/❌ \[[a-z]+\] stage=[a-z-]+: ([^\n]{0,60})/g)].map((m) => m[1].trim())
    ),
  ];
  const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
  const note = `smoke ${t.prior}/3 during the Replicate stall, re-run ${ok}/3 delivered${failed ? ` (${errs.join('; ')})` : ''} at ${stamp}`;
  const cur = fs.readFileSync(TRACKER, 'utf8');
  const re = new RegExp(
    `^(- \\[[ x]\\] \\*\\*${t.bot}\\/${t.path}\\*\\* — .*?)smoke \\d\\/3 delivered[^;]*;`,
    'm'
  );
  const next = cur.replace(re, `$1${note};`);
  fs.writeFileSync(TRACKER, next);
  console.log(
    `  ${t.bot}/${t.path}: ${ok}/3 delivered${failed ? `, ${failed} failed (${errs.join('; ')})` : ''}`
  );
}
console.log('re-smoke pass finished');
