#!/usr/bin/env node
/**
 * check-axis-pool.js — the dedupe + register gate for a grown AXIS pool.
 *
 * An axis pool (light, camera, palette, air, a prop, a second presence …) is a list of short
 * fragments. "Count" is not the bar; Kevin's bar (2026-09-24) is that the new entries are
 * ACCURATELY deduplicated: no two entries say the same thing. This checks four things and exits
 * 1 if any fails, so the expansion driver cannot mark a pool done on a bad grow:
 *
 *   1. exact duplicates (after whitespace/case/punctuation normalisation)       → must be 0
 *   2. signature duplicates (lib/seedDupeLint: first 12 significant tokens)      → must be 0
 *   3. near-duplicates: content-word Jaccard ≥ 0.6 between any two entries       → must be 0
 *   4. same-opening clusters: ≥ 6 entries sharing their first 3 VARYING words  → must be 0
 *      (an actor-first axis reuses a small cast in its openings; six is a template echo)
 *
 * It also prints the word-length range of the ORIGINAL entries vs the NEW ones so a grow that
 * drifted register (terse 8-word originals, 30-word new entries) is visible, and lists every
 * offending pair so the fix is a targeted rewrite, never a blind regen.
 *
 * Usage:
 *   node scripts/reseed/check-axis-pool.js <bot> <pool_name> [--original-count N] [--fix]
 *
 * --original-count N  the first N entries are the originals (default 25)
 * --fix               drop the LATER entry of every offending pair / cluster overflow and
 *                     rewrite the file, then re-check (the driver tops the pool back up)
 */
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const bot = args[0];
const pool = args[1];
const flag = (n, fb) => {
  const i = args.indexOf('--' + n);
  return i >= 0 ? args[i + 1] : fb;
};
const FIX = args.includes('--fix');
const ORIG = parseInt(flag('original-count', '25'), 10);
if (!bot || !pool) {
  console.error('usage: check-axis-pool.js <bot> <pool_name> [--original-count N] [--fix]');
  process.exit(2);
}
const file = path.join(__dirname, '../bots', bot, 'seeds', pool + '.json');
const entries = JSON.parse(fs.readFileSync(file, 'utf8'));
if (!Array.isArray(entries)) throw new Error(file + ' is not an array');

const STOP = new Set(
  'a an the of in on at to with and or but for from by as its it is are was were be this that these those into onto over under near beside between through across along around above below one two three four five six seven eight nine ten each every some any all both very more most much many just only still also then than so such no not nor off out up down'.split(
    ' '
  )
);
const norm = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
const words = (s) =>
  norm(s)
    .split(' ')
    .filter((w) => w && !STOP.has(w));
const signature = (s) => [...new Set(words(s))].slice(0, 12).sort().join(' ');
const jaccard = (a, b) => {
  const A = new Set(a),
    B = new Set(b);
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  const uni = A.size + B.size - inter;
  return uni ? inter / uni : 0;
};

// REGISTER WORDS: vocabulary the pool's own originals repeat in ≥ 40% of entries (a mandated
// opener like "hot-air balloon", a material law like "brick" / "minifigure", the axis noun
// itself). Two entries that share only those words are not duplicates of each other, so both
// the overlap test and the opening test run on the words that VARY, after these are removed.
function registerWords(list, origCount) {
  const orig = list.slice(0, Math.max(1, Math.min(origCount, list.length)));
  const df = new Map();
  for (const e of orig) for (const w of new Set(words(e))) df.set(w, (df.get(w) || 0) + 1);
  const reg = new Set();
  for (const [w, n] of df) if (n / orig.length >= 0.4) reg.add(w);
  return reg;
}

function analyse(list, origCount) {
  const problems = [];
  const seenExact = new Map();
  const seenSig = new Map();
  const reg = registerWords(list, origCount);
  const wl = list.map((e) => words(e));
  const vl = wl.map((w) => w.filter((x) => !reg.has(x))); // the varying words only
  list.forEach((e, i) => {
    const k = norm(e);
    if (seenExact.has(k)) problems.push({ kind: 'exact', a: seenExact.get(k), b: i });
    else seenExact.set(k, i);
    const s = signature(e);
    if (seenSig.has(s)) problems.push({ kind: 'signature', a: seenSig.get(s), b: i });
    else seenSig.set(s, i);
  });
  for (let i = 0; i < list.length; i++)
    for (let j = i + 1; j < list.length; j++) {
      if (vl[i].length < 4 || vl[j].length < 4) continue;
      const jac = jaccard(vl[i], vl[j]);
      if (jac >= 0.6) problems.push({ kind: 'near ' + jac.toFixed(2), a: i, b: j });
    }
  const open = new Map();
  vl.forEach((w, i) => {
    if (w.length < 3) return;
    const k = w.slice(0, 3).join(' ');
    if (!open.has(k)) open.set(k, []);
    open.get(k).push(i);
  });
  // 6+ entries opening with the same three VARYING words is a template echo; fewer is variety.
  // Why 6 and not 4: an actor-first axis ("a boy in a bucket hat …", "a student with a bag …")
  // legitimately reuses a small cast in its openings while the BEAT that follows is the axis —
  // arcade play_moment lost 47 distinct beats to a threshold of 4 (2026-09-24). A real template
  // echo produces 10+ identical openings and is still caught.
  // The ORIGINALS are Kevin-approved and never edited here: a pair or cluster made only of
  // originals is reported for information but does not fail the gate, because --fix could not
  // resolve it without touching them. Anything involving a NEW entry counts.
  const clusters = [...open.entries()].filter(
    ([, idx]) => idx.length >= 6 && idx.some((i) => i >= origCount)
  );
  const blocking = problems.filter((p) => p.a >= origCount || p.b >= origCount);
  return { problems: blocking, clusters, wl, reg };
}

let list = entries.slice();
let { problems, clusters, wl, reg } = analyse(list, ORIG);
console.log(`  register words ignored (in ≥40% of originals): ${[...reg].join(', ') || '(none)'}`);

const range = (idx) => {
  const lens = idx.map((i) => wl[i].length);
  return lens.length
    ? `${Math.min(...lens)}-${Math.max(...lens)} (median ${lens.sort((a, b) => a - b)[Math.floor(lens.length / 2)]})`
    : '-';
};
console.log(
  `${bot}/${pool}: ${list.length} entries (${Math.min(ORIG, list.length)} original + ${Math.max(0, list.length - ORIG)} new)`
);
console.log(
  `  content words per entry — originals ${range(list.map((_, i) => i).filter((i) => i < ORIG))}, new ${range(list.map((_, i) => i).filter((i) => i >= ORIG))}`
);
console.log(
  `  exact dupes ${problems.filter((p) => p.kind === 'exact').length} · signature dupes ${problems.filter((p) => p.kind === 'signature').length} · near-dupes (jaccard ≥ 0.6) ${problems.filter((p) => p.kind.startsWith('near')).length} · same-opening clusters ${clusters.length}`
);
for (const p of problems.slice(0, 40))
  console.log(
    `    ${p.kind.padEnd(10)} #${p.a} ↔ #${p.b}\n      ${String(list[p.a]).slice(0, 110)}\n      ${String(list[p.b]).slice(0, 110)}`
  );
for (const [k, idx] of clusters.slice(0, 20))
  console.log(`    opening "${k}" × ${idx.length}: #${idx.join(' #')}`);

if (FIX && (problems.length || clusters.length)) {
  const drop = new Set();
  for (const p of problems) drop.add(Math.max(p.a, p.b) >= ORIG ? Math.max(p.a, p.b) : p.b);
  for (const [, idx] of clusters) for (const i of idx.slice(5)) if (i >= ORIG) drop.add(i);
  const kept = list.filter((_, i) => !drop.has(i));
  fs.writeFileSync(file, JSON.stringify(kept, null, 2) + '\n');
  console.log(
    `  --fix: dropped ${drop.size} entries (${[...drop].sort((a, b) => a - b).join(',')}) → ${kept.length} remain; re-checking`
  );
  list = kept;
  ({ problems, clusters, wl } = analyse(list, ORIG));
  console.log(
    `  after fix: exact ${problems.filter((p) => p.kind === 'exact').length} · signature ${problems.filter((p) => p.kind === 'signature').length} · near ${problems.filter((p) => p.kind.startsWith('near')).length} · clusters ${clusters.length}`
  );
}
const ok = problems.length === 0 && clusters.length === 0;
console.log(ok ? '  ✓ clean' : '  ✗ NOT CLEAN');
process.exit(ok ? 0 : 1);
