/**
 * poolJudge.js — the shared mechanics of the seed-pool duplicate judge (NIGHTLY_POOL_CLEANUP_PLAN.md), used by
 * scripts/clean-location-pools.js (location spots) and scripts/clean-scenario-pools.js (shared scene pools). Each tool
 * brings its own prompts (what "the same picture" means for a spot vs a scenario); this file owns the parts that were
 * learned the hard way: tolerant reply parsing, retries, group hygiene, and the second pair-by-pair check.
 */
const { callClaude } = require('./anthropic');

const CHUNK = 60; // items per call for flagging / pair checks

/** Index of the bracket closing the array that opens at `start`, or -1. */
function arrayEnd(raw, start) {
  let depth = 0;
  let inStr = false;
  for (let i = start; i < raw.length; i++) {
    const ch = raw[i];
    if (inStr) {
      if (ch === '\\') i++;
      else if (ch === '"') inStr = false;
    } else if (ch === '"') inStr = true;
    else if (ch === '[') depth++;
    else if (ch === ']' && --depth === 0) return i;
  }
  return -1;
}

/** The first balanced JSON array in a reply that parses. A model sometimes adds a note after the array or a bracket in
 *  prose before it (both broke the first location audit), so every '[' is tried in turn. */
function parse(raw) {
  for (let start = raw.indexOf('['); start >= 0; start = raw.indexOf('[', start + 1)) {
    const end = arrayEnd(raw, start);
    if (end < 0) continue;
    try {
      const v = JSON.parse(raw.slice(start, end + 1));
      if (Array.isArray(v)) return v;
    } catch {
      // not the array; try the next bracket
    }
  }
  throw new Error('no parseable JSON array in reply');
}

/** One judged call (job `reseed`), parsed to an array; 3 tries. */
async function ask(system, content, maxTokens = 6000) {
  for (let a = 0; a < 3; a++) {
    try {
      const r = await callClaude({
        job: 'reseed',
        system,
        content,
        maxTokens,
        retryDelaysMs: [2000, 8000, 20000],
        timeoutMs: 180000,
      });
      return parse(r.raw);
    } catch (e) {
      if (a === 2) throw e;
    }
  }
  return [];
}

/** Clean a judge reply ([{keep, same:[...], why}], 1-based) into 0-based groups: in range, at least two members, and
 *  each item in at most one group. */
function cleanGroups(groups, count) {
  const seen = new Set();
  const out = [];
  for (const g of Array.isArray(groups) ? groups : []) {
    const members = [g && g.keep, ...(g && Array.isArray(g.same) ? g.same : [])].filter(
      (n) => Number.isInteger(n) && n >= 1 && n <= count
    );
    if (members.length < 2 || members.some((n) => seen.has(n))) continue;
    members.forEach((n) => seen.add(n));
    out.push({
      keep: members[0] - 1,
      same: members.slice(1).map((n) => n - 1),
      why: String((g && g.why) || ''),
    });
  }
  return out;
}

/** Group same-idea items with one read of the whole list. */
async function judgeGroups(system, texts, maxTokens = 4000) {
  if (texts.length < 2) return [];
  const groups = await ask(system, texts.map((t, i) => `${i + 1}. ${t}`).join('\n'), maxTokens);
  return cleanGroups(groups, texts.length);
}

/** Second, pair-by-pair check: returns the set of pair indexes the checker also calls the same. The group read alone
 *  was wrong about 1 in 10 on location spots (it paired the Arch of Constantine with the Arch of Janus). */
async function confirmPairs(system, pairs) {
  const ok = new Set();
  for (let off = 0; off < pairs.length; off += CHUNK) {
    const chunk = pairs.slice(off, off + CHUNK);
    const res = await ask(
      system,
      chunk.map((p, i) => `${i + 1}. "${p.a}" | "${p.b}"`).join('\n'),
      1500
    );
    for (const n of res)
      if (Number.isInteger(n) && n >= 1 && n <= chunk.length) ok.add(off + n - 1);
  }
  return ok;
}

module.exports = { CHUNK, parse, ask, cleanGroups, judgeGroups, confirmPairs };
