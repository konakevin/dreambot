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
 * ⚠️ READ THIS BEFORE QUOTING ANY NUMBER THIS MODULE PRODUCES
 *
 * This measure is WRONG IN BOTH DIRECTIONS on labelled real data, and the
 * failures are pinned in __tests__/lib/ideaSimilarity.test.ts:
 *
 *   - WITHOUT boilerplate stripping, a rigidly-formatted pool makes unrelated
 *     entries look like duplicates. faebot_flower_fairy_scale_prover reads 28
 *     distinct ideas raw vs 90 stripped: same file, same threshold.
 *   - WITH stripping, near-duplicates score as maximally DIFFERENT. A token is
 *     called "format" when it appears in >= `share` of the compared entries, and
 *     near-duplicates share nearly all their text — so nearly all of it is
 *     stripped and only the words where they DIFFER survive. The nine labelled
 *     magnolia duplicates below never merge into one idea at ANY threshold.
 *
 * No choice of {keepFormat, threshold} gets both labelled cases right. So:
 *
 *   USE THIS AS A PREFILTER AND A CI TRIPWIRE, NEVER AS AN ACCEPTANCE GATE.
 *   A `distinct` count is an UPPER bound on real diversity, i.e. a LOWER bound
 *   on redundancy — the true redundancy is always worse than reported. Acceptance
 *   needs a judge that reads meaning (SEED_DIVERSITY_CHARTER.md §5b, decision 16).
 *
 * THRESHOLD
 * `SAME_IDEA` = 0.6 is the value the program's published figures were computed
 * with; it is NOT a calibrated optimum, because no optimum exists (above). If you
 * change it, re-run the test and restate every affected number in
 * SEED_DIVERSITY_CHARTER.md — they all move with it.
 *
 * COMPARING ONE POOL BEFORE AND AFTER
 * Pass the BASELINE entries as `clusterPool(after, t, {formatFrom: before})`.
 * The profile is otherwise derived from whatever is being measured, so the two
 * sides get different yardsticks and the comparison is meaningless.
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

/**
 * The text of a seed entry.
 *
 * Entries are NOT a uniform shape across the fleet. Most are bare strings, some
 * are {description}, and some are richer records — BrickBot's location pool uses
 * {location, scene, tier}. An earlier version of this function only read
 * `description`/`text` and therefore returned '' for all 1,601 entries of that
 * pool, which the audit then reported as "1601 entries, 0 distinct ideas". That
 * was a bug in this function presented as a finding about the data.
 *
 * So: strings pass through, and objects contribute every string field EXCEPT the
 * ones that are classification metadata rather than content (`tier`, `tags`,
 * `id`, `weight`) — including those would make two entries look similar merely
 * for sharing a tier.
 */
const META_FIELDS = new Set(['tier', 'tags', 'tag', 'id', 'key', 'weight', 'rarity', 'category']);

function entryText(e) {
  if (typeof e === 'string') return e;
  if (!e || typeof e !== 'object') return '';
  if (typeof e.description === 'string' && e.description) return e.description;
  if (typeof e.text === 'string' && e.text) return e.text;
  const parts = [];
  for (const [k, v] of Object.entries(e)) {
    if (META_FIELDS.has(k)) continue;
    if (typeof v === 'string' && v) parts.push(v);
  }
  return parts.join(' ');
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

/**
 * Tokens that appear in at least `share` of a pool's entries are that pool's
 * FORMAT, not its content, and comparing them makes every pair look similar.
 *
 * Measured on BLOOMBOT_FLOWER_FRIENDS_FLOWER_FOCAL_CLUSTER: twelve tokens appear
 * in 100% of its 125 entries (`pale`, `soft`, `ivory`, `pastel`, `watercolor`,
 * `blooming`, `together`, `hero`, `pulled`, `back`, `enchanted`, `register`,
 * `layers`). With them included the median pairwise similarity is 0.46; with
 * them removed it is 0.08. A fixed 0.48 threshold therefore sat just above the
 * median and rejected legitimate pairs for sharing boilerplate — which is
 * exactly what happened on the first pilot run, where 78 of 120 generated
 * entries were thrown out as "too similar to another new entry".
 *
 * So idea comparison inside a pool must be done against the pool's own
 * boilerplate profile, not in the abstract.
 */
function formatTokens(entries, share = 0.4) {
  const df = new Map();
  for (const e of entries) for (const t of tokens(entryText(e))) df.set(t, (df.get(t) || 0) + 1);
  const out = new Set();
  const min = Math.max(2, Math.ceil(entries.length * share));
  for (const [t, c] of df) if (c >= min) out.add(t);
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
function clusterPool(entries, threshold = SAME_IDEA, opts = {}) {
  const texts = entries.map(entryText);
  // Strip this pool's own boilerplate before comparing, unless told not to.
  // See formatTokens: without this a rigidly-formatted pool shows a median
  // pairwise similarity of 0.46 and every threshold measures format, not idea.
  //
  // `formatFrom` EXISTS BECAUSE THIS MEASURE IS OTHERWISE NOT COMPARABLE ACROSS
  // TWO VERSIONS OF A POOL. The profile is derived from the entries being
  // measured, so adding diverse entries lowers each token's document frequency,
  // fewer tokens clear `share`, less gets stripped — and the "after" number is
  // computed with a different yardstick than the "before". Measured on the
  // flower_focal_cluster pilot at share 0.4: original 125 entries read 90 ideas
  // / 28% redundant, the repaired 137 read 137 / 0%. The 0% is an artifact; a
  // manual read of the same file found a 7-entry alpine cluster that all name
  // edelweiss + saxifrage + stonecrop.
  //
  // So ANY before/after comparison must pass the BASELINE pool as `formatFrom`
  // and never quote a percentage without saying which basis produced it.
  const fmtSource = opts.formatFrom || entries;
  const fmt = opts.keepFormat ? new Set() : formatTokens(fmtSource, opts.formatShare ?? 0.4);
  const sets = texts.map((t) => {
    const s = tokens(t);
    if (!fmt.size) return s;
    const out = new Set();
    for (const x of s) if (!fmt.has(x)) out.add(x);
    return out.size ? out : s; // an entry that is ALL boilerplate keeps its tokens
  });
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

module.exports = { STOP, MIN_LEN, SAME_IDEA, entryText, tokens, similarity, isSameIdea, clusterPool, formatTokens };
