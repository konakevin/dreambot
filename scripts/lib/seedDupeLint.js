/**
 * seedDupeLint.js — the one implementation of "is this seed entry a duplicate".
 *
 * Three consumers keep this in one place so they can never drift apart:
 *   - scripts/scan-bot-seed-dupes.js  (the CI / pre-commit gate)
 *   - scripts/purge-bot-seed-dupes.js (the remover)
 *   - __tests__/lib/seedDupeLint.test.ts
 *
 * Why it exists: before 2026-09-22 the only duplicate protection was inside whichever
 * generator wrote the entries, so 5,164 byte-identical copies had accumulated across 225
 * wired pools (gothbot/hair_colors was 100 unique of 200). Nothing checked a pool afterwards.
 *
 * TWO levels, deliberately different:
 *   identity()  EXACT. Strings normalise case + whitespace. Objects compare on ALL fields,
 *               key-sorted with arrays sorted, so a shared description serving two different
 *               tag buckets is NOT a duplicate. That case is real and must survive: chibibot
 *               has an egret tagged ["ARCTIC"] and ["ARCTIC","BIRD"], earthbot a fjord tagged
 *               arctic-polar and coastal-temperate. Deleting either would silently narrow a
 *               tag-filtered pool.
 *   signature() NEAR. First 12 significant tokens, alphabetised, so word-order shuffles
 *               cannot escape it. Mirrors seedGenHelper.js + every gen-<bot>-pool.js so the
 *               numbers are comparable with what the generators report.
 */

// Mirrors the generators' stopword list closely enough for comparable signatures.
const STOPWORDS = new Set(
  (
    'the a an and or of in on at to for with from into onto over under above below its their his her' +
    ' this that these those is are was were be been being as by but not no nor so than then there here' +
    ' while when where which who whom whose what how why all any both each few more most other some such' +
    ' only own same too very can will just should now across against along around behind beside between' +
    ' beyond during except inside near off out outside through toward towards up upon within without' +
    ' after before again once about'
  ).split(/\s+/)
);

/** The display/comparison text of an entry, whatever shape the pool uses. */
function textOf(entry) {
  if (typeof entry === 'string') return entry;
  if (entry && typeof entry === 'object') {
    return entry.description || entry.text || entry.entry || entry.scene || entry.name || '';
  }
  return String(entry === undefined || entry === null ? '' : entry);
}

/** EXACT identity. Two entries are duplicates only when this matches. */
function identity(entry) {
  if (typeof entry === 'string') return 'S:' + entry.toLowerCase().replace(/\s+/g, ' ').trim();
  if (entry && typeof entry === 'object') {
    const sorted = Object.keys(entry)
      .sort()
      .reduce((acc, k) => {
        acc[k] = Array.isArray(entry[k]) ? [...entry[k]].sort() : entry[k];
        return acc;
      }, {});
    return 'O:' + JSON.stringify(sorted).toLowerCase();
  }
  return 'X:' + String(entry);
}

/** Body after a CAPS title prefix, with Rich-Scene-Seed bloat stripped (as the generators do). */
function bodyOf(text) {
  const noBloat = String(text).split(/\sFOREGROUND:/)[0];
  const parts = noBloat.split(/\s+[—–]\s+/);
  return parts.length > 1 ? parts.slice(1).join(' ') : noBloat;
}

/** First `take` significant tokens, de-duplicated and alphabetised. */
function signature(text, take = 12) {
  const tokens = bodyOf(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 4 && !STOPWORDS.has(w));
  const uniq = [];
  for (const w of tokens) if (!uniq.includes(w)) uniq.push(w);
  return uniq.slice(0, take).sort().join('|');
}

/**
 * Audit one pool.
 * @returns {{n, exact, descCollisions, signature, coarseUnique, coarsePct, exactSamples}}
 *   exact          entries that are a byte-identical repeat (always an error)
 *   descCollisions same description, DIFFERENT tags — legitimate, but served twice to any
 *                  path whose filter matches both, so worth a human look
 *   signature      near-duplicates (same idea, reworded)
 *   coarsePct      share of the pool that is the same idea at 6 tokens; >=20% means the
 *                  recipe is near its semantic ceiling and a +100 will under-deliver
 */
function auditPool(entries) {
  const list = Array.isArray(entries) ? entries : [];
  const seenIdentity = new Set();
  const seenDesc = new Set();
  const seenSig = new Set();
  const coarse = new Set();
  const exactSamples = [];
  let exact = 0;
  let descCollisions = 0;
  let sig = 0;
  let n = 0;

  for (const raw of list) {
    const text = textOf(raw);
    if (!text || !text.trim()) continue;
    n++;
    const id = identity(raw);
    if (seenIdentity.has(id)) {
      exact++;
      if (exactSamples.length < 3) exactSamples.push(text.slice(0, 90));
    } else {
      seenIdentity.add(id);
      const d = text.toLowerCase().replace(/\s+/g, ' ').trim();
      if (seenDesc.has(d)) descCollisions++;
      else seenDesc.add(d);
    }
    const s = signature(text, 12);
    if (s.length > 10) {
      if (seenSig.has(s)) sig++;
      else seenSig.add(s);
    }
    coarse.add(signature(text, 6));
  }

  return {
    n,
    exact,
    descCollisions,
    signature: sig,
    coarseUnique: coarse.size,
    coarsePct: n ? Math.round((1 - coarse.size / n) * 100) : 0,
    exactSamples,
  };
}

/** Keep the first copy of each identity, drop later ones. Used by the purge. */
function dedupe(entries) {
  const seen = new Set();
  const kept = [];
  for (const e of Array.isArray(entries) ? entries : []) {
    const id = identity(e);
    if (seen.has(id)) continue;
    seen.add(id);
    kept.push(e);
  }
  return kept;
}

module.exports = { STOPWORDS, textOf, identity, signature, auditPool, dedupe };
