#!/usr/bin/env node
/**
 * purge-bot-seed-dupes.js — remove EXACT duplicate entries from bot seed pools.
 *
 * Found by scan-bot-seed-dupes.js: 5,168 entries across 227 wired pools are byte-identical copies
 * of another entry in the same file (gothbot/hair_colors is 100 unique of 200; yumbot/chef_lighting
 * 111 of 200). They come from append-mode generation that ran more than once, before/around the
 * time the generators' dedupe landed — the x3 and x4 multiplicities are the tell. Same condition
 * FLEET_POOL_BACKFILL.md hit in June ("castle_hero had 158 unique of 200 … quietly polluting
 * renders for months").
 *
 * Why it matters: the picker's shuffle bag keys on entry TEXT (bot_dedup, migration 123), so a
 * duplicated entry (a) is over-served, because before first use it has N times the chance of being
 * drawn, and (b) makes the pool smaller than its label, so the axis cycle resets twice as often.
 *
 * Why it is safe: the surviving copy carries the identical text, so no bot_dedup history is
 * orphaned and no migration is needed. Every touched file gets a .bak-<ts> first, matching the
 * generators' own convention.
 *
 * ONLY exact duplicates. Near-duplicates (signature matches) are left alone: those need human
 * judgement, and a fleet-wide auto-thinner was already built once and demoted to a flagger for
 * gutting good pools.
 *
 * Usage:
 *   node scripts/purge-bot-seed-dupes.js --wired /tmp/wiring.json            # dry run (default)
 *   node scripts/purge-bot-seed-dupes.js --wired /tmp/wiring.json --apply
 *   node scripts/purge-bot-seed-dupes.js --bot gothbot --apply
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'bots');
const argv = process.argv.slice(2);
const flag = (n) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : null);
const ONLY = flag('--bot');
const WIRED = flag('--wired');
const APPLY = argv.includes('--apply');

let wiredIndex = null;
if (WIRED) {
  const data = JSON.parse(fs.readFileSync(WIRED, 'utf8'));
  wiredIndex = new Map(data.map((r) => [r.bot, new Set(r.reachable)]));
}

// One implementation of identity, shared with scan-bot-seed-dupes.js and locked by
// __tests__/lib/seedDupeLint.test.ts. Objects compare on ALL fields, so a shared description
// serving two different tag buckets is NOT a duplicate and is never removed.
const { identity } = require('./lib/seedDupeLint');

const stamp = Date.now();
const results = [];
let filesTouched = 0;
let removedTotal = 0;

for (const bot of (ONLY ? [ONLY] : fs.readdirSync(ROOT)).sort()) {
  const seedDir = path.join(ROOT, bot, 'seeds');
  if (!fs.existsSync(seedDir)) continue;
  for (const f of fs.readdirSync(seedDir).sort()) {
    if (!f.endsWith('.json')) continue;
    const pool = f.replace(/\.json$/, '');
    if (wiredIndex && !(wiredIndex.get(bot) || new Set()).has(pool)) continue;
    const full = path.join(seedDir, f);
    let data;
    try {
      data = JSON.parse(fs.readFileSync(full, 'utf8'));
    } catch {
      console.log(`  ! unreadable, skipped: ${bot}/${pool}`);
      continue;
    }
    if (!Array.isArray(data) || data.length === 0) continue;

    const seen = new Set();
    const kept = [];
    for (const e of data) {
      const id = identity(e);
      if (seen.has(id)) continue; // drop the later copy, keep the first
      seen.add(id);
      kept.push(e);
    }
    const removed = data.length - kept.length;
    if (removed === 0) continue;

    results.push({ bot, pool, before: data.length, after: kept.length, removed });
    removedTotal += removed;
    filesTouched++;

    if (APPLY) {
      fs.copyFileSync(full, `${full}.bak-${stamp}`);
      fs.writeFileSync(full, JSON.stringify(kept, null, 2) + '\n');
    }
  }
}

results.sort((a, b) => b.removed - a.removed);
const pad = (s, n) => String(s).padEnd(n);
const num = (s, n) => String(s).padStart(n);
console.log(`${APPLY ? 'PURGED' : 'DRY RUN (nothing written)'} — exact duplicates only\n`);
console.log(pad('bot/pool', 52) + num('before', 8) + num('after', 7) + num('removed', 9));
for (const r of results.slice(0, 30)) {
  console.log(pad(`${r.bot}/${r.pool}`, 52) + num(r.before, 8) + num(r.after, 7) + num(r.removed, 9));
}
if (results.length > 30) console.log(`  … and ${results.length - 30} more pools`);

const byBot = new Map();
for (const r of results) byBot.set(r.bot, (byBot.get(r.bot) || 0) + r.removed);
console.log('\nBY BOT');
for (const [bot, n] of [...byBot].sort((a, b) => b[1] - a[1])) console.log('  ' + pad(bot, 12) + num(n, 6));

console.log(
  `\nTOTAL: ${removedTotal.toLocaleString()} duplicate entries in ${filesTouched} pools` +
    (APPLY ? `\nBackups written as *.json.bak-${stamp}` : '\nRe-run with --apply to write.')
);
