#!/usr/bin/env node
/**
 * grow-thin-seed-pools.js — Stage C of BOT_POOL_EXPANSION_STATE.md.
 *
 * Tops up the genuinely SHALLOW content pools on live bots. Not a blanket expansion: the depth
 * distribution is bimodal (279 pools already sit at 100-125, while ~80 sit under 100 and a few are
 * catastrophic -- bloombot_flower_fields_vantage has SIX entries, which repeats every three days at
 * 2 posts/day). Only the shallow band is worth money.
 *
 * Two generator pipelines, so two ways to grow one pool:
 *   MONO    node scripts/gen-<bot>-pool.js --pool <name> --count <DELTA>   (--count means exactly +N)
 *   HELPER  SEED_TOTAL=<TARGET> node scripts/gen-seeds/<bot>/gen-*.js      (grow-to-N semantics)
 *
 * SAFETY, and the reason this script exists instead of a shell loop:
 *  - It REFUSES any pool whose generator is not append-safe. `generatePool` defaults to
 *    append:false, which OVERWRITES. 51 scripts were silently in that state before they were fixed.
 *  - It VERIFIES the script->pool mapping by reading the pool's length before and after. The
 *    coverage audit resolves a script to a pool with loose regexes, so a mis-attributed script
 *    would otherwise quietly rewrite a DIFFERENT pool. A run that does not grow the pool it was
 *    supposed to grow is reported as SUSPECT, loudly, with the file it did touch.
 *  - Concurrency is capped (default 3) per the throttle rule.
 *  - --dry-run prints the plan and the cost and writes nothing.
 *
 * Usage:
 *   node scripts/grow-thin-seed-pools.js --coverage /tmp/coverage.json --dry-run
 *   node scripts/grow-thin-seed-pools.js --coverage /tmp/coverage.json --under 100 --target 120 --apply
 *   node scripts/grow-thin-seed-pools.js --coverage /tmp/coverage.json --bot bloombot --apply
 */
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const ROOT = path.join(__dirname, '..');
const argv = process.argv.slice(2);
const flag = (n, d = null) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
const COVERAGE = flag('--coverage', '/tmp/coverage.json');
const UNDER = parseInt(flag('--under', '100'), 10);
const TARGET = parseInt(flag('--target', '120'), 10);
const CONCURRENCY = parseInt(flag('--concurrency', '3'), 10);
const ONLY_BOT = flag('--bot');
const APPLY = argv.includes('--apply');
const CENTS_PER_ENTRY = 0.012;

// Bots whose user is public and actively scheduled. The private proving ground (alphabot)
// and dark bots (outlawbot) are not worth spend.
const LIVE = new Set([
  'bloombot', 'brickbot', 'chibibot', 'dinobot', 'dragonbot', 'dreambot', 'earthbot', 'faebot',
  'farmbot', 'gothbot', 'mangabot', 'oceanbot', 'pixelbot', 'starbot', 'steambot', 'tinybot',
  'toybot', 'yumbot',
]);

const poolPath = (bot, pool) => path.join(ROOT, 'scripts', 'bots', bot, 'seeds', `${pool}.json`);
function poolLen(bot, pool) {
  try {
    const d = JSON.parse(fs.readFileSync(poolPath(bot, pool), 'utf8'));
    return Array.isArray(d) ? d.length : -1;
  } catch {
    return -1;
  }
}

const rows = JSON.parse(fs.readFileSync(COVERAGE, 'utf8'));
const plan = [];
const skipped = { notLive: 0, noGenerator: 0, overwrites: 0, deepEnough: 0 };
for (const r of rows) {
  if (ONLY_BOT ? r.bot !== ONLY_BOT : !LIVE.has(r.bot)) { skipped.notLive++; continue; }
  if (r.how === 'NONE') { skipped.noGenerator++; continue; }
  if (!r.append) { skipped.overwrites++; continue; }
  if (r.n >= UNDER) { skipped.deepEnough++; continue; }
  plan.push({ ...r, delta: TARGET - r.n });
}
plan.sort((a, b) => a.n - b.n);

const totalNeed = plan.reduce((s, p) => s + p.delta, 0);
console.log(
  `Stage C plan: ${plan.length} pools under ${UNDER} entries -> grow to ${TARGET}\n` +
    `  ${totalNeed} new entries, about $${(totalNeed * CENTS_PER_ENTRY).toFixed(0)}\n` +
    `  skipped: ${skipped.deepEnough} already >=${UNDER}, ${skipped.noGenerator} have no generator, ` +
    `${skipped.overwrites} have a generator that OVERWRITES, ${skipped.notLive} not a live bot\n`
);
if (!APPLY) {
  for (const p of plan.slice(0, 40)) {
    // Show the command this script will ACTUALLY run. p.script is the coverage audit's static
    // suggestion and always says `--count 100`; the real delta is per-pool.
    const cmd =
      p.how === 'MONO'
        ? `node scripts/gen-${p.bot}-pool.js --pool ${p.pool} --count ${p.delta}`
        : `SEED_TOTAL=${TARGET} node ${p.script}`;
    console.log(`  ${String(p.n).padStart(4)} -> ${TARGET}  ${p.bot}/${p.pool}  [${p.how}]  ${cmd}`);
  }
  if (plan.length > 40) console.log(`  ... +${plan.length - 40} more`);
  console.log('\nDRY RUN — nothing written. Re-run with --apply.');
  process.exit(0);
}

function runOne(p) {
  return new Promise((resolve) => {
    const before = poolLen(p.bot, p.pool);
    if (before < 0) return resolve({ ...p, status: 'MISSING', before });
    let file, args, env = { ...process.env };
    if (p.how === 'MONO') {
      file = path.join(ROOT, 'scripts', `gen-${p.bot}-pool.js`);
      args = ['--pool', p.pool, '--count', String(p.delta)];
    } else {
      file = path.join(ROOT, p.script);
      args = [];
      env.SEED_TOTAL = String(TARGET);
    }
    if (!fs.existsSync(file)) return resolve({ ...p, status: 'NO_SCRIPT', before });
    execFile('node', [file, ...args], { cwd: ROOT, env, maxBuffer: 1 << 24 }, (err, stdout, stderr) => {
      const after = poolLen(p.bot, p.pool);
      let status;
      if (err) status = 'FAILED';
      else if (after > before) status = 'GREW';
      // The script ran clean but the pool it was supposed to grow did not change -- the coverage
      // audit's script->pool guess was wrong and something ELSE was written. Never silent.
      else status = 'SUSPECT';
      resolve({ ...p, status, before, after, err: err ? String(err.message).slice(0, 200) : null,
        tail: String(stdout || stderr).trim().split('\n').slice(-2).join(' | ').slice(0, 200) });
    });
  });
}

(async () => {
  const results = [];
  let i = 0;
  const workers = Array.from({ length: Math.min(CONCURRENCY, plan.length) }, async () => {
    while (i < plan.length) {
      const p = plan[i++];
      const r = await runOne(p);
      results.push(r);
      const mark = { GREW: 'ok', SUSPECT: '!!', FAILED: 'XX', NO_SCRIPT: '??', MISSING: '??' }[r.status];
      console.log(
        `  [${String(results.length).padStart(3)}/${plan.length}] ${mark} ${r.bot}/${r.pool}: ` +
          `${r.before} -> ${r.after ?? '?'}${r.status === 'GREW' ? '' : `  ${r.status} ${r.err || r.tail || ''}`}`
      );
    }
  });
  await Promise.all(workers);

  const by = (s) => results.filter((r) => r.status === s);
  console.log(
    `\nDONE: ${by('GREW').length} grew, ${by('SUSPECT').length} suspect, ${by('FAILED').length} failed, ` +
      `${by('NO_SCRIPT').length + by('MISSING').length} unrunnable`
  );
  const gained = by('GREW').reduce((s, r) => s + (r.after - r.before), 0);
  console.log(`entries added: ${gained} (about $${(gained * CENTS_PER_ENTRY).toFixed(0)})`);
  for (const r of [...by('SUSPECT'), ...by('FAILED')]) {
    console.log(`  ${r.status}  ${r.bot}/${r.pool} via ${r.script}: ${r.err || r.tail}`);
  }
  if (by('SUSPECT').length) {
    console.log(
      '\n!! SUSPECT means the script ran clean but that pool did not grow, so the script most likely\n' +
        '   writes a DIFFERENT pool than the coverage audit guessed. Check `git status` before committing.'
    );
  }
})();
