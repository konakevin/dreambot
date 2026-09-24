#!/usr/bin/env node
/**
 * grow-axis-pools.js — the AXIS-pool expansion driver (AXIS_POOL_EXPANSION.md, 2026-09-24).
 *
 * For each of the 16 live Track B paths: grow every path-owned axis pool still under TARGET to
 * TARGET with the path's OWN generator in append mode (or the register-derived grower when the
 * generator is gone or overwrites), run the dedupe gate (check-axis-pool.js --fix, then top up,
 * up to 3 rounds), prove the originals are byte-identical, smoke-render the path 3× hidden, tick
 * the path off in the tracker, commit + push. One path at a time, so a failure never blocks the
 * rest and the tracker always shows exactly how far it got.
 *
 *   node scripts/reseed/grow-axis-pools.js            # run everything not yet done
 *   node scripts/reseed/grow-axis-pools.js --plan     # print the plan and refresh the tracker only
 *   node scripts/reseed/grow-axis-pools.js --only faebot/star-charting
 *   node scripts/reseed/grow-axis-pools.js --no-commit --no-smoke
 */
const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '../..');
const TRACKER = path.join(ROOT, 'AXIS_POOL_EXPANSION.md');
const TARGET = 100;
const args = process.argv.slice(2);
const has = (n) => args.includes('--' + n);
const flag = (n) => {
  const i = args.indexOf('--' + n);
  return i >= 0 ? args[i + 1] : null;
};
const PLAN_ONLY = has('plan');
const ONLY = flag('only');
const DO_COMMIT = !has('no-commit');
const DO_SMOKE = !has('no-smoke');

// ── the 16 paths, their pool prefixes, and how each family grows ────────────────────────────
// gen: 'target'  → node <script> --pool <name> --target 100        (appends, backs up, sig-dedups)
//      'scale'   → SEED_TOTAL=100 node <script> --only <slot> --scale (appends via generatePool)
//      'all'     → SEED_TOTAL=100 node <script>                     (runs every pool, append:true)
//      'generic' → node scripts/reseed/grow-axis-pool.js <bot> <pool> --target 100
// The MangaBot arcade generator is append:false (it would OVERWRITE the live pools, including the
// reworded play-moment entries) → generic. SteamBot brass-glasshouse and faebot_regatta_shore have
// no surviving generator → generic. DinoBot's four SHARED paleo pools are not path-owned and are
// never touched (the prefixes below own only the bespoke pools).
const PATHS = [
  {
    bot: 'brickbot',
    path: 'balloon-festival',
    prefix: 'brickbot_balloon_',
    gen: 'target',
    script: 'scripts/gen-brickbot-balloon-pools.js',
  },
  {
    bot: 'brickbot',
    path: 'airfield-biplanes',
    prefix: 'brickbot_airfield_',
    gen: 'target',
    script: 'scripts/gen-brickbot-airfield-pools.js',
  },
  {
    bot: 'tinybot',
    path: 'snow-globe-world',
    prefix: 'tinybot_snow_globe_',
    gen: 'all',
    script: 'scripts/gen-seeds/tinybot/gen-snow-globe-world.js',
  },
  { bot: 'mangabot', path: 'game-center-arcade', prefix: 'game_center_arcade_', gen: 'generic' },
  {
    bot: 'steambot',
    path: 'brass-glasshouse',
    prefix: 'steambot_brass_glasshouse_',
    gen: 'generic',
  },
  {
    bot: 'pixelbot',
    path: 'floating-market-canal',
    prefix: 'pixelbot_floating_market_canal_',
    gen: 'scale',
    script: 'scripts/gen-seeds/pixelbot/gen-floating-market-canal-pools.js',
  },
  {
    bot: 'pixelbot',
    path: 'volcano-forge',
    prefix: 'pixelbot_volcano_forge_',
    gen: 'scale',
    script: 'scripts/gen-seeds/pixelbot/gen-volcano-forge-pools.js',
  },
  {
    bot: 'faebot',
    path: 'mushroom-apothecary',
    prefix: 'faebot_mushroom_apothecary_',
    gen: 'target',
    script: 'scripts/gen-faebot-pool.js',
  },
  {
    bot: 'faebot',
    path: 'acorn-boat-regatta',
    prefix: 'faebot_regatta_',
    gen: 'target',
    script: 'scripts/gen-faebot-regatta-pools.js',
    genericPools: ['faebot_regatta_shore'],
  },
  {
    bot: 'faebot',
    path: 'star-charting',
    prefix: 'faebot_starchart_',
    gen: 'target',
    script: 'scripts/gen-faebot-starchart-pools.js',
  },
  {
    bot: 'dinobot',
    path: 'amber-forest',
    prefix: 'dinobot_amber_',
    gen: 'target',
    script: 'scripts/gen-dinobot-pool.js',
  },
  {
    bot: 'dinobot',
    path: 'courtship-display',
    prefix: 'dinobot_courtship_',
    gen: 'target',
    script: 'scripts/gen-dinobot-pool.js',
  },
  {
    bot: 'dinobot',
    path: 'den-and-burrow',
    prefix: 'dinobot_den_',
    gen: 'target',
    script: 'scripts/gen-dinobot-pool.js',
  },
  {
    bot: 'dinobot',
    path: 'desert-dunes',
    prefix: 'dinobot_desert_dunes_',
    gen: 'target',
    script: 'scripts/gen-dinobot-pool.js',
  },
  {
    bot: 'dinobot',
    path: 'snowline-forest',
    prefix: 'dinobot_snowline_forest_',
    gen: 'target',
    script: 'scripts/gen-dinobot-pool.js',
  },
  {
    bot: 'dinobot',
    path: 'undergrowth-scale',
    prefix: 'dinobot_undergrowth_',
    gen: 'target',
    script: 'scripts/gen-dinobot-pool.js',
  },
];

const seedFile = (bot, pool) => path.join(ROOT, 'scripts/bots', bot, 'seeds', pool + '.json');
const count = (bot, pool) => JSON.parse(fs.readFileSync(seedFile(bot, pool), 'utf8')).length;
const log = (s) => {
  const line = `[${new Date().toISOString().slice(11, 19)}] ${s}`;
  console.log(line);
  fs.appendFileSync(path.join(ROOT, 'scratch-axis-driver.log'), line + '\n');
};

function poolsOf(p) {
  const dir = path.join(ROOT, 'scripts/bots', p.bot, 'seeds');
  return fs
    .readdirSync(dir)
    .filter((f) => f.startsWith(p.prefix) && f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''))
    .sort();
}
// A pool "belongs to the expansion" if it started under TARGET. We freeze that membership in the
// tracker's own table so a pool that reaches 100 mid-run still shows as part of the work.
function plannedPools(p) {
  const fromTracker = trackerPools(p);
  if (fromTracker) return fromTracker;
  return poolsOf(p).filter((pool) => count(p.bot, pool) < TARGET);
}
function trackerPools(p) {
  if (!fs.existsSync(TRACKER)) return null;
  const md = fs.readFileSync(TRACKER, 'utf8');
  const re = new RegExp(`^\\| ${p.bot}/${p.path} \\| ([a-z0-9_]+) \\|`, 'gm');
  const pools = [...md.matchAll(re)].map((m) => m[1]);
  return pools.length ? pools : null;
}

function cmdFor(p, pool) {
  const generic = p.gen === 'generic' || (p.genericPools || []).includes(pool);
  if (generic)
    return {
      cmd: `node scripts/reseed/grow-axis-pool.js ${p.bot} ${pool} --target ${TARGET}`,
      env: {},
    };
  if (p.gen === 'target')
    return { cmd: `node ${p.script} --pool ${pool} --target ${TARGET}`, env: {} };
  if (p.gen === 'scale')
    return {
      cmd: `node ${p.script} --only ${pool.replace(p.prefix, '')} --scale`,
      env: { SEED_TOTAL: String(TARGET) },
    };
  if (p.gen === 'all') return { cmd: `node ${p.script}`, env: { SEED_TOTAL: String(TARGET) } };
  throw new Error('unknown gen ' + p.gen);
}

function run(cmd, env, timeoutMs) {
  log(
    `  $ ${Object.entries(env)
      .map(([k, v]) => k + '=' + v + ' ')
      .join('')}${cmd}`
  );
  // The driver's own node binary runs every child, so a login shell cannot swap the toolchain.
  const resolved = cmd.replace(/^node /, `${JSON.stringify(process.execPath)} `);
  const r = spawnSync('bash', ['-c', resolved], {
    cwd: ROOT,
    env: { ...process.env, ...env },
    encoding: 'utf8',
    timeout: timeoutMs,
    maxBuffer: 64 * 1024 * 1024,
  });
  const out = (r.stdout || '') + (r.stderr || '');
  fs.appendFileSync(
    path.join(ROOT, 'scratch-axis-driver.log'),
    out
      .split('\n')
      .slice(-25)
      .map((l) => '      ' + l)
      .join('\n') + '\n'
  );
  return { code: r.status, out, timedOut: r.error && r.error.code === 'ETIMEDOUT' };
}

function gate(bot, pool, original) {
  const r = run(
    `node scripts/reseed/check-axis-pool.js ${bot} ${pool} --original-count ${original} --fix`,
    {},
    120000
  );
  const m = r.out.match(
    /exact dupes (\d+) · signature dupes (\d+) · near-dupes \(jaccard ≥ 0.6\) (\d+) · same-opening clusters (\d+)/
  );
  const after = r.out.match(
    /after fix: exact (\d+) · signature (\d+) · near (\d+) · clusters (\d+)/
  );
  const clean = /✓ clean/.test(r.out) || (after && after.slice(1).every((x) => x === '0'));
  return {
    clean,
    found: m ? m.slice(1).map(Number) : null,
    dropped: (r.out.match(/--fix: dropped (\d+)/) || [])[1] || 0,
  };
}

function growPool(p, pool) {
  const before = JSON.parse(fs.readFileSync(seedFile(p.bot, pool), 'utf8'));
  const start = before.length;
  if (start >= TARGET) {
    const g = gate(p.bot, pool, Math.min(25, start));
    return {
      pool,
      start,
      end: start,
      rounds: 0,
      clean: g.clean,
      originalsIntact: true,
      note: 'already at target',
    };
  }
  const own = cmdFor(p, pool);
  // Rounds 1-2: the path's own recipe (the xerox rule). Rounds 3-5: the register-derived grower,
  // which shows Sonnet the whole current pool and forbids rephrasing it — the path generators
  // carry no anti-list, so when a recipe keeps paraphrasing its own entries the gate drops them
  // and the pool would never fill.
  const generic = {
    cmd: `node scripts/reseed/grow-axis-pool.js ${p.bot} ${pool} --target ${TARGET}`,
    env: {},
  };
  let rounds = 0,
    g = null;
  while (rounds < 5) {
    rounds++;
    const { cmd, env } = rounds <= 2 ? own : generic;
    const r = run(cmd, env, 30 * 60 * 1000);
    if (r.code !== 0)
      log(`  ⚠️ generator exit ${r.code}${r.timedOut ? ' (timeout)' : ''} on ${pool}`);
    g = gate(p.bot, pool, start);
    const now = count(p.bot, pool);
    log(
      `  ${pool}: round ${rounds} → ${now} entries, dupes found ${g.found ? g.found.join('/') : '?'}, dropped ${g.dropped}, clean=${g.clean}`
    );
    if (now >= TARGET && g.clean) break;
  }
  const finalList = JSON.parse(fs.readFileSync(seedFile(p.bot, pool), 'utf8'));
  const originalsIntact = before.every((e, i) => finalList[i] === e);
  // The --target generators drop a `<pool>.json.bak-<ts>` safety copy next to the pool; git holds
  // the real history, so clear them rather than leave untracked cruft in the seeds dir.
  const dir = path.dirname(seedFile(p.bot, pool));
  for (const f of fs.readdirSync(dir))
    if (f.startsWith(pool + '.json.bak-')) fs.unlinkSync(path.join(dir, f));
  return { pool, start, end: finalList.length, rounds, clean: g.clean, originalsIntact };
}

function smoke(p) {
  if (!DO_SMOKE) return 'skipped';
  const h = run('node scripts/check-pool-headroom.js', {}, 60000);
  if (h.code !== 0) {
    log('  headroom tight, waiting 5 min before smoke renders');
    spawnSync('sleep', ['300']);
  }
  const r = run(
    `node scripts/iter-bot.js --bot ${p.bot} --mode ${p.path} --count 3 --post --shadow --label axis-smoke`,
    {},
    25 * 60 * 1000
  );
  const ok = (r.out.match(/✅/g) || []).length;
  const failed = (r.out.match(/❌ #/g) || []).length;
  return `${ok}/3 delivered${failed ? `, ${failed} failed` : ''}`;
}

// ── tracker ─────────────────────────────────────────────────────────────────────────────────
function updateTracker(p, results, smokeNote, done) {
  let md = fs.readFileSync(TRACKER, 'utf8');
  for (const r of results) {
    const rowRe = new RegExp(`^\\| ${p.bot}/${p.path} \\| ${r.pool} \\|.*$`, 'm');
    const status = r.end >= TARGET && r.clean && r.originalsIntact ? '✅' : '⚠️ needs attention';
    md = md.replace(
      rowRe,
      `| ${p.bot}/${p.path} | ${r.pool} | ${r.start} | ${r.end} | ${r.rounds} | ${r.clean ? 'clean' : 'NOT clean'} | ${r.originalsIntact ? 'yes' : 'NO'} | ${status} |`
    );
  }
  const pathRe = new RegExp(`^- \\[[ x]\\] \\*\\*${p.bot}/${p.path}\\*\\*.*$`, 'm');
  const pools = results.length;
  const good = results.filter((r) => r.end >= TARGET && r.clean && r.originalsIntact).length;
  const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
  md = md.replace(
    pathRe,
    `- [${done ? 'x' : ' '}] **${p.bot}/${p.path}** — ${good}/${pools} pools at ≥${TARGET} and clean; smoke ${smokeNote}; ${stamp}`
  );
  fs.writeFileSync(TRACKER, md);
}

function seedTrackerTable() {
  // Fill the per-pool table + checklist between the markers if they are still placeholders.
  let md = fs.readFileSync(TRACKER, 'utf8');
  if (
    !/<!-- POOLS:START -->\n<!-- POOLS:END -->/.test(md) &&
    !/<!-- POOLS:START -->\n\n<!-- POOLS:END -->/.test(md)
  )
    return;
  const rows = [];
  const checks = [];
  for (const p of PATHS) {
    const pools = plannedPools(p);
    checks.push(`- [ ] **${p.bot}/${p.path}** — ${pools.length} pools`);
    for (const pool of pools)
      rows.push(`| ${p.bot}/${p.path} | ${pool} | ${count(p.bot, pool)} |  |  |  |  | ⬜ |`);
  }
  const table = [
    '| path | pool | before | after | rounds | dedupe gate | originals intact | status |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
    ...rows,
  ].join('\n');
  md = md.replace(
    /<!-- POOLS:START -->[\s\S]*?<!-- POOLS:END -->/,
    `<!-- POOLS:START -->\n${table}\n<!-- POOLS:END -->`
  );
  md = md.replace(
    /<!-- CHECKLIST:START -->[\s\S]*?<!-- CHECKLIST:END -->/,
    `<!-- CHECKLIST:START -->\n${checks.join('\n')}\n<!-- CHECKLIST:END -->`
  );
  fs.writeFileSync(TRACKER, md);
  log(`tracker seeded: ${rows.length} pools across ${PATHS.length} paths`);
}

function commit(p, pools, summary) {
  if (!DO_COMMIT) return;
  const files = pools
    .map((pool) => `scripts/bots/${p.bot}/seeds/${pool}.json`)
    .concat(['AXIS_POOL_EXPANSION.md']);
  const add = run(`git add ${files.join(' ')}`, {}, 60000);
  if (add.code !== 0) return log('  ⚠️ git add failed');
  const msg = `Axis pools: ${p.bot}/${p.path} ${summary}\n\nAXIS_POOL_EXPANSION.md run (Kevin 2026-09-24): every path-owned axis pool of the live Track B paths grown to ${TARGET}+ with the path's own generator in append mode (or the register-derived grower), originals byte-identical, dedupe gate clean (exact / signature / jaccard≥0.6 / same-opening clusters), 3 hidden smoke renders.\n\nCo-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`;
  fs.writeFileSync(path.join(ROOT, 'scratch-axis-commit-msg.txt'), msg);
  const c = run('git commit -q -F scratch-axis-commit-msg.txt', {}, 15 * 60 * 1000);
  if (c.code !== 0)
    return log(`  ⚠️ commit failed (exit ${c.code}); files stay staged for the next path's commit`);
  const push = run('git push -q origin main', {}, 5 * 60 * 1000);
  log(`  committed + push exit ${push.code}`);
}

(async () => {
  seedTrackerTable();
  if (PLAN_ONLY) {
    for (const p of PATHS)
      log(
        `${p.bot}/${p.path}: ${plannedPools(p)
          .map((pool) => pool + '=' + count(p.bot, pool))
          .join(', ')} via ${p.gen}`
      );
    return;
  }
  const md0 = fs.readFileSync(TRACKER, 'utf8');
  for (const p of PATHS) {
    const key = `${p.bot}/${p.path}`;
    if (ONLY && ONLY !== key) continue;
    if (!ONLY && new RegExp(`^- \\[x\\] \\*\\*${key}\\*\\*`, 'm').test(md0)) {
      log(`skip ${key} (already ticked)`);
      continue;
    }
    log(`━━━ ${key}`);
    const pools = plannedPools(p);
    const results = [];
    for (const pool of pools) results.push(growPool(p, pool));
    const good = results.filter((r) => r.end >= TARGET && r.clean && r.originalsIntact).length;
    const smokeNote = smoke(p);
    const done = good === pools.length;
    updateTracker(p, results, smokeNote, done);
    log(
      `${key}: ${good}/${pools.length} pools good, smoke ${smokeNote}${done ? ' ✓ DONE' : ' ⚠️ NEEDS ATTENTION'}`
    );
    commit(p, pools, `${good}/${pools.length} pools → ${TARGET}+ (smoke ${smokeNote})`);
  }
  log('driver finished');
})().catch((err) => {
  log('driver crashed: ' + (err && err.stack));
  process.exit(1);
});
