/**
 * ONE definition of "the same idea", shared by the audit, the generators and the
 * CI gate. Before this module there were two competing definitions in the repo
 * and the one wired into generation was the weaker of them.
 *
 * WHY NOT A HASH KEY
 * Every previous attempt hashed the first N significant tokens (sorted) and
 * compared keys for equality. That cannot work for the failure mode we actually
 * have. Take the real cluster from `faebot_flower_fairy_scale_prover`:
 *
 *   "A painted giant magnolia-bloom as her painted bedchamber, painted BROAD cream-and-pink petals dwarfing her painted form"
 *   "A painted giant magnolia-bloom as her painted bedchamber, painted LARGE cream-and-rose petals dwarfing her painted form"
 *
 * These are obviously one idea. But the distinguishing words are adjectives that
 * land INSIDE any first-6 or first-12 window, so the two produce different keys
 * and both pass. Widening the window makes it worse, not better — more room for
 * synonym swaps to look distinct. Narrowing it collapses genuinely different
 * entries that happen to share an opening noun.
 *
 * So similarity, not equality: two entries are the same idea when their
 * significant-token SETS overlap enough. That is insensitive to word order, to
 * synonym swaps and to how deep in the sentence the difference sits.
 *
 * STOPWORDS ARE GRAMMATICAL ONLY, ON PURPOSE
 * `seedGenHelper.js`'s existing list contains content words — `painted`,
 * `large`, `giant` — which were added to make its 12-token signature behave.
 * Stripping content words is exactly wrong here: "painted" appearing four times
 * in one entry is a real signal about that entry. This list removes only
 * function words.
 *
 * THRESHOLD
 * `SAME_IDEA` is calibrated in __tests__/lib/ideaSimilarity.test.ts against
 * labelled real pool data: known duplicate clusters must collapse, known
 * distinct entries must not. Do not change it without re-running that test —
 * every number in SEED_DIVERSITY_CHARTER.md moves with it.
 */

/** Function words only. No content words, no style words, no adjectives. */
const STOP = new Set(
  (
    'a an the and or but nor for yet so of in on at to from by with without within into onto upon ' +
    'over under above below across along around behind beside between through during before after ' +
    'while when where which who whom whose that this these those there here it its is are was were ' +
    'be been being am do does did done has have had having will would shall should can could may ' +
    'might must as if then than too very just also not no nor only own same such both each few more ' +
    'most other some any all one two her his their your our my me him them they we you i out up down ' +
    'off again further once about against because until how what why'
  ).split(/\s+/)
);

/** Minimum token length kept. 3 keeps "sun", "ice", "oak"; 4 would drop them. */
const MIN_LEN = 3;

/**
 * Jaccard overlap at or above which two entries are the same idea.
 * Calibrated, not guessed — see the test file.
 */
const SAME_IDEA = 0.6;

/** The text of a seed entry, which may be a bare string or {description}. */
function entryText(e) {
  if (typeof e === 'string') return e;
  if (e && typeof e.description === 'string') return e.description;
  if (e && typeof e.text === 'string') return e.text;
  return '';
}

/**
 * Significant tokens as a Set. Deduped deliberately: an entry that says
 * "painted" four times should not have four slots' worth of weight, but the
 * fact that it says it at all is kept.
 */
function tokens(s) {
  const out = new Set();
  for (const raw of String(s)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/[\s-]+/)) {
    if (raw.length < MIN_LEN) continue;
    if (STOP.has(raw)) continue;
    out.add(raw);
  }
  return out;
}

/** Jaccard similarity of two token sets: |A∩B| / |A∪B|. 0 = nothing shared, 1 = identical. */
function similarity(a, b) {
  const A = a instanceof Set ? a : tokens(entryText(a));
  const B = b instanceof Set ? b : tokens(entryText(b));
  if (A.size === 0 || B.size === 0) return A.size === B.size ? 1 : 0;
  let inter = 0;
  const [small, large] = A.size <= B.size ? [A, B] : [B, A];
  for (const t of small) if (large.has(t)) inter++;
  return inter / (A.size + B.size - inter);
}

function isSameIdea(a, b, threshold = SAME_IDEA) {
  return similarity(a, b) >= threshold;
}

/**
 * Greedy single-link clustering of a pool by idea.
 *
 * Greedy is the right trade here: it is O(n·k) in the number of clusters rather
 * than O(n²) in entries, deterministic given input order, and it never merges
 * two entries that are not directly similar to the same representative — which
 * keeps clusters tight and makes the "largest cluster" output trustworthy as a
 * rewrite list.
 *
 * @returns {{clusters: Array<{rep: string, members: number[]}>, distinct: number,
 *            redundant: number, pct: number}}
 */
function clusterPool(entries, threshold = SAME_IDEA) {
  const texts = entries.map(entryText);
  const sets = texts.map(tokens);
  const clusters = [];
  for (let i = 0; i < texts.length; i++) {
    if (!texts[i]) continue;
    let placed = false;
    for (const c of clusters) {
      if (similarity(sets[i], c.repSet) >= threshold) {
        c.members.push(i);
        placed = true;
        break;
      }
    }
    if (!placed) clusters.push({ rep: texts[i], repSet: sets[i], members: [i] });
  }
  const redundant = clusters.reduce((s, c) => s + (c.members.length - 1), 0);
  const total = clusters.reduce((s, c) => s + c.members.length, 0);
  return {
    clusters: clusters.map((c) => ({ rep: c.rep, members: c.members })),
    distinct: clusters.length,
    redundant,
    pct: total ? Math.round((100 * redundant) / total) : 0,
  };
}

module.exports = { STOP, MIN_LEN, SAME_IDEA, entryText, tokens, similarity, isSameIdea, clusterPool };
