#!/usr/bin/env node
/**
 * qa-buckets.js — shadow-render every NEW bucket so Kevin can actually see it.
 *
 * THE PROBLEM THIS SOLVES. A bucket is 25 new entries inside a pool of ~200, so a random render
 * shows the new content about one time in eight. A 6-render batch could easily show a new bucket
 * ZERO times, and then "the batch looked fine" says nothing about the thing we just paid for.
 *
 * So each bucket is rendered with `iter-bot --pool-override`, which replaces that pool's contents
 * IN MEMORY with only the new entries, for that run. Every render is guaranteed to be the new
 * bucket. Nothing is written to disk, so the hourly dispatcher firing mid-test cannot post a
 * truncated pool.
 *
 * Every render is a SHADOW post (hidden, admin-only via get_shadow_feed) per the standing rule
 * that bot test renders are reviewed IN THE APP, never as a /tmp HTML page.
 *
 * Usage:
 *   node scripts/qa-buckets.js --spec scripts/bucket-specs/wave-1.json --dry-run
 *   node scripts/qa-buckets.js --spec scripts/bucket-specs/wave-1.json --apply --per 2
 *   node scripts/qa-buckets.js --spec scripts/bucket-specs/wave-1.json --apply --only gothbot
 */
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFile } = require('child_process');

const ROOT = path.join(__dirname, '..');
const argv = process.argv.slice(2);
const flag = (n, d = null) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
const SPEC = flag('--spec');
const ONLY = flag('--only');
const PER = parseInt(flag('--per', '2'), 10);
const APPLY = argv.includes('--apply');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'bucket-qa-'));

if (!SPEC) {
  console.error('Usage: node scripts/qa-buckets.js --spec <file.json> [--apply] [--per N] [--only <bot>]');
  process.exit(2);
}

const specs = JSON.parse(fs.readFileSync(SPEC, 'utf8')).filter((s) => !ONLY || s.bot === ONLY);

/**
 * The new bucket's entries. For a TAGGED pool that is exact (filter on the tag). For a plain-string
 * pool there is no marker, so take the TAIL — add-bucket.js appends, so the last `count` entries
 * are the new bucket. Stated explicitly because it silently breaks if anything else appends first.
 */
function newEntries(s, count) {
  const file = path.join(ROOT, 'scripts', 'bots', s.bot, 'seeds', `${s.pool}.json`);
  const all = JSON.parse(fs.readFileSync(file, 'utf8'));
  const tag = s.tag || s.bucket.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const byTag = all.filter((e) => e && typeof e === 'object' && (e.tags || []).includes(tag));
  return byTag.length ? { entries: byTag, how: `tag '${tag}'` } : { entries: all.slice(-count), how: 'tail' };
}

const plan = [];
for (const s of specs) {
  try {
    const { entries, how } = newEntries(s, 25);
    if (!entries.length) {
      console.log(`  SKIP ${s.bot}/${s.bucket}: no new entries found`);
      continue;
    }
    plan.push({ ...s, entries, how });
  } catch (e) {
    console.log(`  SKIP ${s.bot}/${s.bucket}: ${e.message}`);
  }
}

const renders = plan.length * PER;
console.log(
  `Bucket QA: ${plan.length} buckets x ${PER} renders = ${renders} shadow posts (about $${(renders * 0.05).toFixed(2)})\n`
);
for (const p of plan) {
  console.log(`  ${p.bot}/${p.path}  "${p.bucket}"  ${p.entries.length} entries via ${p.how}`);
}

if (!APPLY) {
  console.log('\nDRY RUN — nothing rendered. Re-run with --apply.');
  process.exit(0);
}

function renderOne(p) {
  return new Promise((resolve) => {
    const slug = `${p.bot}-${(p.tag || p.bucket).replace(/[^a-z0-9]+/gi, '-')}`.toLowerCase();
    const file = path.join(TMP, `${slug}.json`);
    fs.writeFileSync(file, JSON.stringify(p.entries, null, 2));
    // Override by the SEED FILE name: iter-bot resolves either a pools.js symbol or seeds/<name>.json,
    // and several of these pools (FarmBot places, FaeBot vistas) are loaded by direct require.
    const args = [
      path.join(ROOT, 'scripts', 'iter-bot.js'),
      '--bot', p.bot,
      '--count', String(PER),
      '--mode', p.path,
      '--post', '--shadow',
      '--label', `bucket-${slug}`,
      '--pool-override', `${p.pool}=${file}`,
    ];
    execFile('node', args, { cwd: ROOT, maxBuffer: 1 << 26 }, (err, stdout, stderr) => {
      const out = String(stdout || '') + String(stderr || '');
      const ok = (out.match(/✅/g) || []).length;
      const overridden = /pool .* overridden in memory/.test(out);
      resolve({
        ...p,
        ok,
        overridden,
        err: err ? String(err.message).slice(0, 160) : null,
        tail: out.trim().split('\n').slice(-2).join(' | ').slice(0, 200),
      });
    });
  });
}

(async () => {
  const results = [];
  let i = 0;
  // Renders hold a Postgres connection for 20-150s each. Hard rule: cap at 3 and never batch wide.
  const CONCURRENCY = 2;
  const workers = Array.from({ length: Math.min(CONCURRENCY, plan.length) }, async () => {
    while (i < plan.length) {
      const p = plan[i++];
      const r = await renderOne(p);
      results.push(r);
      console.log(
        `  [${String(results.length).padStart(2)}/${plan.length}] ${r.ok === PER ? 'ok' : '!!'} ` +
          `${r.bot}/${r.bucket}: ${r.ok}/${PER} rendered` +
          `${r.overridden ? '' : '  (OVERRIDE DID NOT APPLY — renders may not show the bucket)'}` +
          `${r.err ? `  ${r.err}` : ''}`
      );
    }
  });
  await Promise.all(workers);

  const total = results.reduce((s, r) => s + r.ok, 0);
  console.log(`\nDONE: ${total}/${renders} shadow posts rendered.`);
  const bad = results.filter((r) => r.ok < PER || !r.overridden);
  if (bad.length) {
    console.log('needs a look:');
    for (const r of bad) console.log(`  ${r.bot}/${r.bucket}: ${r.err || r.tail}`);
  }
  console.log('\nReview in the app — shadow posts carry the purple SHADOW badge (get_shadow_feed).');
})();
