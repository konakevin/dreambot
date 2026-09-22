#!/usr/bin/env node
/**
 * scan-bot-seed-dupes.js — duplicate + near-duplicate audit for every bot seed pool.
 *
 * Why this exists: today the ONLY duplicate protection is the in-process signature dedupe inside
 * whichever generator wrote the entries (seedGenHelper.js `keyForExact`/`signatureOf`, and the
 * mirrored `dedupe()` in every gen-<bot>-pool.js). Nothing checks a pool afterwards, so a hand
 * edit, a different script, or two agents growing one pool in parallel all go uncaught. The
 * playbook is blunt about the stakes: without programmatic dedupe, "200 entries" may really be
 * "75 unique entries with 125 near-duplicates".
 *
 * Detection mirrors the generators so results are comparable:
 *   EXACT     lowercased, whitespace-collapsed match (always an error)
 *   SIGNATURE first 12 significant tokens (>4 chars, stopwords dropped), alphabetised, hashed
 *             (word-order shuffles cannot escape it) — the generators' own near-dupe test
 *   COARSE    first 6 significant tokens — "same idea, different sentence", reported as a
 *             saturation signal, NOT a failure (a high coarse rate means the recipe is near its
 *             semantic ceiling, so a +100 expansion will under-deliver)
 *
 * Exit code: 1 if any EXACT duplicate exists (or --strict and any SIGNATURE dupe). Near-dupes
 * alone never fail the run, because several pools legitimately sit near their ceiling.
 *
 * Usage:
 *   node scripts/scan-bot-seed-dupes.js                      # all pools, summary
 *   node scripts/scan-bot-seed-dupes.js --wired wiring.json  # only pools a live path reads
 *   node scripts/scan-bot-seed-dupes.js --bot starbot -v     # per-pool detail
 *   node scripts/scan-bot-seed-dupes.js --strict             # CI gate incl. signature dupes
 *   node scripts/scan-bot-seed-dupes.js --json out.json
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'bots');
const argv = process.argv.slice(2);
const flag = (n) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : null);
const ONLY = flag('--bot');
const WIRED = flag('--wired');
const JSON_OUT = flag('--json');
const VERBOSE = argv.includes('-v') || argv.includes('--verbose');
const STRICT = argv.includes('--strict');

// One implementation of "is this a duplicate", shared with purge-bot-seed-dupes.js and
// locked by __tests__/lib/seedDupeLint.test.ts so the two can never drift apart.
const { auditPool } = require('./lib/seedDupeLint');

let wiredIndex = null;
if (WIRED) {
  const data = JSON.parse(fs.readFileSync(WIRED, 'utf8'));
  wiredIndex = new Map(data.map((r) => [r.bot, new Set(r.reachable)]));
}

const pools = [];
for (const bot of (ONLY ? [ONLY] : fs.readdirSync(ROOT)).sort()) {
  const seedDir = path.join(ROOT, bot, 'seeds');
  if (!fs.existsSync(seedDir)) continue;
  for (const f of fs.readdirSync(seedDir).sort()) {
    if (!f.endsWith('.json')) continue;
    const name = f.replace(/\.json$/, '');
    if (wiredIndex && !(wiredIndex.get(bot) || new Set()).has(name)) continue;
    let data;
    try {
      data = JSON.parse(fs.readFileSync(path.join(seedDir, f), 'utf8'));
    } catch {
      pools.push({ bot, pool: name, unreadable: true });
      continue;
    }
    if (!Array.isArray(data)) continue;
    const r = auditPool(data);
    pools.push({
      bot,
      pool: name,
      n: r.n,
      exact: r.exact,
      descCollisions: r.descCollisions,
      sig: r.signature,
      coarseUnique: r.coarseUnique,
      coarsePct: r.coarsePct,
      samplesExact: r.exactSamples,
    });
  }
}

const live = pools.filter((p) => !p.unreadable);
const totalEntries = live.reduce((s, p) => s + p.n, 0);
const totalExact = live.reduce((s, p) => s + p.exact, 0);
const totalSig = live.reduce((s, p) => s + p.sig, 0);

const byBot = new Map();
for (const p of live) {
  const b = byBot.get(p.bot) || { pools: 0, n: 0, exact: 0, sig: 0, coarse: 0 };
  b.pools++;
  b.n += p.n;
  b.exact += p.exact;
  b.sig += p.sig;
  b.coarse += p.coarseUnique;
  byBot.set(p.bot, b);
}

const pad = (s, n) => String(s).padEnd(n);
const num = (s, n) => String(s).padStart(n);
console.log(pad('bot', 12) + num('pools', 6) + num('entries', 9) + num('exact', 7) + num('sig', 6) + num('idea_dup%', 11));
for (const [bot, b] of [...byBot].sort((a, b) => b[1].n - a[1].n)) {
  console.log(
    pad(bot, 12) +
      num(b.pools, 6) +
      num(b.n.toLocaleString(), 9) +
      num(b.exact, 7) +
      num(b.sig, 6) +
      num(Math.round((1 - b.coarse / b.n) * 100) + '%', 11)
  );
}
console.log(
  `\nTOTAL: ${live.length} pools, ${totalEntries.toLocaleString()} entries, ` +
    `${totalExact} exact dupes, ${totalSig} signature dupes`
);

// Saturation: pools where a +100 expansion will under-deliver.
const saturated = live.filter((p) => p.n >= 50 && p.coarsePct >= 20).sort((a, b) => b.coarsePct - a.coarsePct);
console.log(`\nNEAR-CEILING POOLS (>=50 entries, >=20% same-idea): ${saturated.length}`);
for (const p of saturated.slice(0, 15)) console.log(`  ${p.coarsePct}%  ${p.bot}/${p.pool} (${p.n})`);

const collide = live.filter((p) => p.descCollisions > 0);
if (collide.length) {
  console.log(
    `\nSAME DESCRIPTION, DIFFERENT TAGS (not duplicates, but served twice to any path whose filter matches both): ${collide.reduce((s, p) => s + p.descCollisions, 0)}`
  );
  for (const p of collide) console.log(`  ${p.bot}/${p.pool}: ${p.descCollisions}`);
}

const worst = live.filter((p) => p.exact > 0).sort((a, b) => b.exact - a.exact);
if (worst.length) {
  console.log(`\nPOOLS WITH EXACT DUPLICATES: ${worst.length}`);
  for (const p of worst.slice(0, 20)) {
    console.log(`  ${p.bot}/${p.pool}: ${p.exact} of ${p.n}`);
    if (VERBOSE) for (const s of p.samplesExact) console.log(`      "${s}…"`);
  }
}
if (VERBOSE) {
  const sigPools = live.filter((p) => p.sig > 0).sort((a, b) => b.sig - a.sig);
  console.log(`\nPOOLS WITH SIGNATURE NEAR-DUPES: ${sigPools.length}`);
  for (const p of sigPools.slice(0, 25)) console.log(`  ${p.bot}/${p.pool}: ${p.sig} of ${p.n}`);
}
for (const p of pools.filter((x) => x.unreadable)) console.log(`  ! unreadable: ${p.bot}/${p.pool}`);

if (JSON_OUT) {
  fs.writeFileSync(JSON_OUT, JSON.stringify(live, null, 2));
  console.log(`\nwrote ${JSON_OUT}`);
}

const fail = totalExact > 0 || (STRICT && totalSig > 0);
if (fail) {
  console.error(
    `\nFAIL: ${totalExact} exact duplicate entries${STRICT ? ` + ${totalSig} signature near-dupes` : ''}.`
  );
  process.exit(1);
}
console.log('\nOK: no exact duplicates.');
