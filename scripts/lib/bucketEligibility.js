/**
 * bucketEligibility.js — will a new bucket's entries actually reach a render?
 *
 * THE FAILURE MODE THIS EXISTS TO PREVENT. A "bucket" is a named sub-theme tagged inside one pool
 * ({ tags: ['greenhouse'], description: '...' }). Some pools are read whole and their tags are
 * decorative bookkeeping; others are TAG-FILTERED per path:
 *
 *     // scripts/bots/<bot>/pools.js
 *     pool.filter((e) => e.tags.includes('ANY') || e.tags.some((t) => allowed.has(t)))
 *
 * If a new bucket's tag is not in that path's allowed list, every entry is SILENTLY DROPPED. No
 * error, no warning, zero renders, and the seed file looks perfectly healthy. This repo has been
 * bitten by the same shape repeatedly (three shipped nightly fixes reached 0 renders because one
 * conditional gated them), which is why this is a committed lint and not a one-off script.
 *
 * It also catches the crash case: `e.tags.includes(...)` throws on an entry with no tags array, so
 * a single plain-string entry appended to a tagged pool takes the whole path down at render time.
 *
 * FOUR CHECKS:
 *   UNREACHABLE_TAG  a tag exists in the pool but no call site allows it -> those entries never roll
 *   SHAPE_MIX        a tagged pool holds entries without a tags array -> filterByTags throws
 *   EMPTY_FILTER     a call site's allowed list matches nothing in the pool -> that path has no content
 *   STARVED_BUCKET   a bucket holds <2% of the pool -> it rolls, but about once a decade (warning)
 *
 * DELIBERATELY NOT FLAGGED:
 *   - An UNFILTERED pool's tags. yumbot_places_scenes is tagged into 6 buckets and its path reads
 *     `scene: 'YUMBOT_PLACES_SCENES'` and never looks at the tags, so every entry is eligible and a
 *     new tag needs no code change. Flagging those would be noise on the common case.
 *   - A pool filtered with a VARIABLE, e.g. `byTags(HAIRSTYLE, [gender])`. The allowed set is not
 *     knowable statically, so the pool is reported as `dynamic` and its tags are not judged. Being
 *     silent here is the right trade: a false UNREACHABLE_TAG would send someone editing a path
 *     that is already correct.
 */

/** 'ANY' is the wildcard: an entry carrying it passes every filter. */
const WILDCARD = 'ANY';

/** Strip comments so a commented-out call site is not mistaken for a live one. Quote-aware. */
function stripComments(src) {
  let out = '';
  let i = 0;
  let quote = null;
  while (i < src.length) {
    const c = src[i];
    const n = src[i + 1];
    if (quote) {
      out += c;
      if (c === '\\') {
        out += src[i + 1] || '';
        i += 2;
        continue;
      }
      if (c === quote) quote = null;
      i++;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      quote = c;
      out += c;
      i++;
      continue;
    }
    if (c === '/' && n === '*') {
      const end = src.indexOf('*/', i + 2);
      i = end < 0 ? src.length : end + 2;
      out += ' ';
      continue;
    }
    if (c === '/' && n === '/') {
      const end = src.indexOf('\n', i);
      i = end < 0 ? src.length : end;
      out += ' ';
      continue;
    }
    out += c;
    i++;
  }
  return out;
}

/**
 * The tag vocabulary of a pool, plus the entries whose shape would break filterByTags.
 * Returns { tagged, untagged, tags: Map<tag, count>, total }.
 */
function tagVocabulary(entries) {
  const tags = new Map();
  let tagged = 0;
  let untagged = 0;
  for (const e of entries || []) {
    if (e && typeof e === 'object' && Array.isArray(e.tags)) {
      tagged++;
      for (const t of e.tags) tags.set(t, (tags.get(t) || 0) + 1);
    } else {
      untagged++;
    }
  }
  return { tagged, untagged, tags, total: (entries || []).length };
}

/**
 * Every tag-filter call site in a bot's source, keyed by pool SYMBOL.
 * Returns Map<symbol, { literal: Set<string>, dynamic: boolean, sites: Array<string> }>.
 *
 * Handles the four real shapes in this repo:
 *   byTags(SYMBOL, ['a','b'])         byTags(pools.SYMBOL, ['a','b'])
 *   filterByTags(SYMBOL, [...])       { name: 'SYMBOL', tags: ['a','ANY'] }
 * A non-literal argument (`[gender]`, a named const) marks the symbol `dynamic`.
 */
function filterSites(src) {
  const clean = stripComments(src);
  const out = new Map();
  const spans = []; // [start, end) of every filter call site, to find UNFILTERED reads later
  const get = (sym) => {
    if (!out.has(sym)) {
      out.set(sym, { literal: new Set(), dynamic: false, sites: [], unfiltered: false });
    }
    return out.get(sym);
  };

  // byTags(SYM, [...]) / filterByTags(pools.SYM, [...])
  const call = /\b(?:filterBy|by)Tags\(\s*(?:pools\.)?([A-Z][A-Z0-9_]*)\s*,\s*([^)]*)\)/g;
  for (const m of clean.matchAll(call)) {
    const rec = get(m[1]);
    rec.sites.push(m[0].slice(0, 90));
    spans.push([m.index, m.index + m[0].length]);
    const arg = m[2];
    const arr = arg.match(/\[([^\]]*)\]/);
    if (!arr) {
      rec.dynamic = true;
      continue;
    }
    const lits = [...arr[1].matchAll(/'([^']*)'|"([^"]*)"/g)].map((x) => x[1] ?? x[2]);
    // `[gender]` or `[...SOME_CONST]` yields no literals but is a real filter -> unknowable.
    if (!lits.length && arr[1].trim()) rec.dynamic = true;
    for (const t of lits) rec.literal.add(t);
  }

  // declarative { name: 'SYM', tags: ['a','ANY'] }
  const decl = /\{\s*name:\s*'([A-Z][A-Z0-9_]*)'\s*,\s*tags:\s*\[([^\]]*)\]/g;
  for (const m of clean.matchAll(decl)) {
    const rec = get(m[1]);
    rec.sites.push(m[0].slice(0, 90));
    spans.push([m.index, m.index + m[0].length]);
    const lits = [...m[2].matchAll(/'([^']*)'|"([^"]*)"/g)].map((x) => x[1] ?? x[2]);
    if (!lits.length && m[2].trim()) rec.dynamic = true;
    for (const t of lits) rec.literal.add(t);
  }

  // UNFILTERED CONSUMERS — the check above is worthless without this, and getting it wrong
  // produced 71 confident false positives on the first run.
  //
  // `farmbot_gentle_magic` is tagged by season and ONE path filters it to autumn, so the scanner
  // reported spring/summer/winter as dead. They are not: six other paths read the same pool WHOLE
  //     pools.GENTLE_MAGIC.map((e) => e.description)
  // and every entry is eligible through those. A pool with even one unfiltered consumer places no
  // requirement on its tags at all.
  //
  // So: any reference to the symbol that is NOT inside a filter call site, and is not its own
  // declaration or a bare re-export, counts as reading the pool whole.
  const inSpan = (i) => spans.some(([a, b]) => i >= a && i < b);
  for (const [sym, rec] of out) {
    const ref = new RegExp(`(?:pools\\.)?\\b${sym}\\b`, 'g');
    for (const m of clean.matchAll(ref)) {
      if (inSpan(m.index)) continue;
      const line = clean.slice(clean.lastIndexOf('\n', m.index) + 1, clean.indexOf('\n', m.index));
      // Skip only lines that DECLARE or RE-EXPORT this symbol. The test caught this being too
      // greedy: matching `const` anywhere on the line also skipped
      //     const m = pools.SCENES.map((e) => e.description);
      // which is the single most important unfiltered read to detect.
      if (new RegExp(`(?:const|let|var)\\s+${sym}\\s*=`).test(line)) continue;
      if (new RegExp(`\\b${sym}\\s*[:=]\\s*(?:load(?:Optional)?|require)\\(`).test(line)) continue;
      if (new RegExp(`^\\s*${sym}\\s*,?\\s*$`).test(line)) continue;
      if (new RegExp(`^\\s*${sym}\\s*:\\s*${sym}\\s*,?\\s*$`).test(line)) continue;
      rec.unfiltered = true;
      break;
    }
  }

  return out;
}

/**
 * Audit one bot.
 *
 * @param {object} o
 * @param {string} o.bot
 * @param {string} o.allSrc      every .js in the bot module, concatenated
 * @param {Map<string,string>} o.symbolToFile  pool SYMBOL -> seed file basename
 * @param {(file:string)=>any[]|null} o.readPool
 * @param {Set<string>} [o.wiredPools]  seed files a LIVE path can reach (from audit-bot-pool-wiring)
 * @param {number} [o.starvedPct]
 * @returns {Array<object>} findings
 */
function auditBot({ bot, allSrc, symbolToFile, readPool, wiredPools = null, starvedPct = 2 }) {
  const sites = filterSites(allSrc);
  const findings = [];

  for (const [symbol, file] of symbolToFile) {
    const entries = readPool(file);
    if (!Array.isArray(entries) || !entries.length) continue;
    const vocab = tagVocabulary(entries);
    if (!vocab.tagged) continue; // not a bucketed pool at all
    const site = sites.get(symbol);
    const wired = !wiredPools || wiredPools.has(file);

    // A tagged pool nothing can reach is dead weight whatever its tags say.
    if (!wired) {
      findings.push({
        bot, pool: file, symbol, kind: 'UNWIRED_POOL', severity: 'error',
        detail: `${vocab.total} entries in ${vocab.tags.size} buckets, but no live path reads this pool`,
      });
      continue;
    }

    // filterByTags does `e.tags.includes(...)` with no guard, so one untagged entry throws.
    if (vocab.untagged) {
      findings.push({
        bot, pool: file, symbol, kind: 'SHAPE_MIX', severity: site ? 'error' : 'warning',
        detail:
          `${vocab.untagged} of ${vocab.total} entries have no tags array` +
          (site
            ? ' — filterByTags does e.tags.includes() with no guard, so this THROWS at render time'
            : ' — harmless today because this pool is read whole, but it breaks the moment a path tag-filters it'),
      });
    }

    if (!site) continue; // no filter anywhere: every tag is eligible, nothing to check
    if (site.dynamic) continue; // allowed set not knowable statically; staying silent on purpose
    // One consumer reading the pool whole makes every entry eligible, so the tags place no
    // requirement on anything. This is the common case and skipping it is what keeps the scan
    // honest -- see the UNFILTERED CONSUMERS note in filterSites().
    if (site.unfiltered) continue;

    const allowed = site.literal;
    for (const [tag, count] of vocab.tags) {
      if (tag === WILDCARD || allowed.has(tag)) continue;
      // Entries carrying this tag still roll if they ALSO carry an allowed tag or the wildcard.
      const stranded = entries.filter(
        (e) =>
          e && Array.isArray(e.tags) &&
          e.tags.includes(tag) &&
          !e.tags.some((t) => t === WILDCARD || allowed.has(t))
      ).length;
      if (!stranded) continue;
      findings.push({
        bot, pool: file, symbol, kind: 'UNREACHABLE_TAG', severity: 'error', tag,
        detail:
          `bucket '${tag}' has ${count} entries, ${stranded} of which can NEVER roll: no call site ` +
          `allows '${tag}' (allowed: ${[...allowed].sort().join(', ') || 'none'}). ` +
          `Add '${tag}' to the path's tag list, or give the entries 'ANY'.`,
      });
    }

    // A filter that matches nothing leaves that path with an empty axis.
    const matching = entries.filter(
      (e) => e && Array.isArray(e.tags) && e.tags.some((t) => t === WILDCARD || allowed.has(t))
    ).length;
    if (!matching) {
      findings.push({
        bot, pool: file, symbol, kind: 'EMPTY_FILTER', severity: 'error',
        detail: `no entry matches the allowed tags (${[...allowed].sort().join(', ')}) — this axis is empty at render time`,
      });
    }

    for (const [tag, count] of vocab.tags) {
      if (tag === WILDCARD) continue;
      const pct = (count / vocab.total) * 100;
      if (pct < starvedPct && allowed.has(tag)) {
        findings.push({
          bot, pool: file, symbol, kind: 'STARVED_BUCKET', severity: 'warning', tag,
          detail: `bucket '${tag}' is ${count}/${vocab.total} entries (${pct.toFixed(1)}%) — it rolls, but rarely`,
        });
      }
    }
  }
  return findings;
}

/**
 * PRE-FLIGHT: before writing a bucket, will it roll?
 * Answers the question "I am adding bucket <tag> to <symbol> for path <path>" without generating
 * anything. Returns { ok, reason, action }.
 */
function willBucketRoll({ symbol, tag, allSrc, entriesHaveWildcard = false }) {
  const site = filterSites(allSrc).get(symbol);
  if (!site) {
    return { ok: true, reason: 'pool is read whole (no tag filter), so every entry is eligible', action: null };
  }
  if (site.unfiltered) {
    return {
      ok: true,
      reason: 'at least one path reads this pool whole, so every entry is eligible regardless of tags',
      action: null,
    };
  }
  if (site.dynamic) {
    return {
      ok: null,
      reason: 'pool is filtered with a runtime value, so eligibility cannot be decided statically',
      action: `read the call site by hand: ${site.sites[0]}`,
    };
  }
  if (entriesHaveWildcard || site.literal.has(tag) || site.literal.has(WILDCARD)) {
    return { ok: true, reason: `'${tag}' is allowed by a call site`, action: null };
  }
  return {
    ok: false,
    reason: `'${tag}' is not in the allowed list (${[...site.literal].sort().join(', ') || 'none'}), so every entry would be silently dropped`,
    action: `add '${tag}' to the tag list at: ${site.sites[0]}`,
  };
}

module.exports = { WILDCARD, stripComments, tagVocabulary, filterSites, auditBot, willBucketRoll };
