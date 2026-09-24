/**
 * core.js — the pool-agnostic half of a subject-pool repair (the `reseed` skill, RESEED_STATUS.md).
 * Factored out of the pilot tool scripts/repair-flower-focal-cluster.js after it proved the method.
 *
 * A pool CONFIG (scripts/reseed/pools/<name>.js) supplies the pool-specific half:
 *   name            'bloombot/flower_humming_birds/flower_focal_cluster' (for backups + reports)
 *   poolFile        absolute path to the seed JSON (an array of strings)
 *   basis           one sentence: what "the same idea" means for this pool (quoted with every figure)
 *   parse(entry)    → { keys: string[], ...anything } — the entry's varying element as comparable keys
 *   sameGroup(a, b) → boolean, on two parsed entries (the first of a group is kept, the rest rewritten)
 *   planSlots({ pool, parsed, kept, slots }) → decorate each slot (index, old, dupOf) with what to write
 *                   (family, register, variant, …) and slot.tags (short strings for the review page)
 *   assign(slot, ctx) → { keys, ... } the varying element chosen BEFORE the LLM writes, or null
 *                   ctx = { pool, parsed, working, groups, usage, cfg }; the core reserves the keys
 *   brief(batch, examples, ctx) → prompt asking for a JSON array of batch.length strings
 *   formatRe        RegExp every rewritten entry must match (also enforced at --execute)
 *   mechanical(cand, slot, ctx) → string[] problems (format, counts, bans, caps, overlap …)
 *   reality(cand, slot, ctx)  → async string[] problems (optional LLM reality check)
 *   judge(cand, ctx)          → async number[] (optional LLM same-idea reader; advisory with --judge-advisory)
 *   measure(pool, parsed)     → extra stats for the report (optional)
 *   examples(kept, pool)      → the example entries shown to the LLM (optional; default: first 6 kept)
 *   batchSize                 default 6; maxAttempts default 8; textAttemptsBeforeReassign default 3
 *   keyUsage(parsedEntry)     → keys to count in `usage` (default: parsed.keys)
 *
 * CLI (scripts/reseed/reseed.js <pool-config> …):
 *   --plan            print groups + the slot plan, no LLM
 *   --out <dir>       where proposal.json + report.json go (default os.tmpdir()/reseed-<name>)
 *   --limit N         only the first N slots
 *   --resume <report> keep that run's accepted rewrites, fill only what it left unfilled
 *   --judge-advisory  record the judge's opinion on the change instead of rejecting on it
 *   --check-kept      run cfg.reality on the KEPT originals too (informational, flagged in the report)
 *   --execute --from <proposal.json>   back the pool up outside the repo, write, re-parse, assert
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { loadEnv } = require('../../lib/seedGenHelper');

const KEY = process.env.ANTHROPIC_API_KEY || loadEnv().ANTHROPIC_API_KEY;

// ── Model calls ──────────────────────────────────────────────────────────────────────────────────
async function claude(model, prompt, maxTokens) {
  if (!KEY) throw new Error('ANTHROPIC_API_KEY missing');
  const delays = [2000, 6000, 15000, 30000];
  for (let i = 0; ; i++) {
    let res;
    try {
      res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
    } catch (e) {
      if (i < delays.length) {
        await new Promise((r) => setTimeout(r, delays[i]));
        continue;
      }
      throw e;
    }
    if (res.ok) {
      const j = await res.json();
      return j.content.map((c) => c.text || '').join('');
    }
    if ((res.status === 429 || res.status === 529 || res.status >= 500) && i < delays.length) {
      await new Promise((r) => setTimeout(r, delays[i]));
      continue;
    }
    throw new Error(`${model} ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
}

/** The first complete JSON array/object in a reply (Sonnet sometimes adds prose after it). */
function jsonOf(t) {
  const start = t.search(/[[{]/);
  if (start < 0) throw new Error('no JSON in reply');
  let depth = 0;
  let inStr = false;
  for (let i = start; i < t.length; i++) {
    const c = t[i];
    if (inStr) {
      if (c === '\\') i++;
      else if (c === '"') inStr = false;
    } else if (c === '"') inStr = true;
    else if (c === '[' || c === '{') depth++;
    else if (c === ']' || c === '}') {
      depth--;
      if (depth === 0) return JSON.parse(t.slice(start, i + 1));
    }
  }
  throw new Error('unterminated JSON in reply');
}

const shuffle = (a) =>
  a
    .map((x) => [Math.random(), x])
    .sort((p, q) => p[0] - q[0])
    .map(([, x]) => x);
/** Least-used first, ties shuffled: spreads the pool across a roster instead of favourites. */
const byUsage = (items, usage, keyOf = (x) => x) =>
  shuffle(items).sort((m, n) => (usage[keyOf(m)] || 0) - (usage[keyOf(n)] || 0));

// ── Grouping ─────────────────────────────────────────────────────────────────────────────────────
/** Greedy, pool order: the first entry of every group is kept; later members are rewrite slots. */
function group(pool, parsed, sameGroup) {
  const kept = [];
  const slots = [];
  pool.forEach((e, i) => {
    const dupOf = kept.find((k) => sameGroup(parsed[k], parsed[i]));
    if (dupOf === undefined) kept.push(i);
    else slots.push({ index: i, old: e, dupOf });
  });
  return { kept, slots };
}

function sharedKeys(a, b) {
  return a.keys.filter((k) => b.keys.includes(k));
}

function measurePool(cfg, pool) {
  const parsed = pool.map(cfg.parse);
  const { kept } = group(pool, parsed, cfg.sameGroup);
  let maxShared = 0;
  for (let i = 0; i < parsed.length; i++)
    for (let j = 0; j < i; j++)
      maxShared = Math.max(maxShared, sharedKeys(parsed[i], parsed[j]).length);
  const base = {
    entries: pool.length,
    distinct: kept.length,
    keys: new Set(parsed.flatMap((p) => p.keys)).size,
    maxSharedKeysAnyPair: maxShared,
  };
  return cfg.measure ? { ...base, ...cfg.measure(pool, parsed) } : base;
}

// ── The run ──────────────────────────────────────────────────────────────────────────────────────
async function runReseed(cfg, argv) {
  const flag = (n) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : null);
  const OUT = flag('--out') || path.join(os.tmpdir(), `reseed-${cfg.name.replace(/\//g, '-')}`);
  if (argv.includes('--execute')) return execute(cfg, flag('--from'));

  const pool = JSON.parse(fs.readFileSync(cfg.poolFile, 'utf8'));
  const parsed = pool.map(cfg.parse);
  let { kept, slots } = group(pool, parsed, cfg.sameGroup);
  const GROW = Number(flag('--grow') || 0);
  if (GROW) {
    // Track B (NEW_PATH_POOL_SCALING.md): the pool only GROWS. Every existing entry is kept at its
    // index and N new slots are appended; a config used this way must accept slots with old === null.
    kept = pool.map((_, i) => i);
    slots = Array.from({ length: GROW }, (_, i) => ({
      index: pool.length + i,
      old: null,
      dupOf: null,
    }));
  }
  cfg.planSlots({ pool, parsed, kept, slots, grow: GROW });
  console.log(
    `${cfg.name}: pool ${pool.length} | kept ${kept.length} | to rewrite ${slots.length}`
  );
  console.log(`basis: ${cfg.basis}`);

  if (argv.includes('--plan')) {
    const groups = {};
    slots
      .filter((s) => s.dupOf !== null)
      .forEach((s) => (groups[s.dupOf] = (groups[s.dupOf] || 0) + 1));
    console.log('\nlargest groups (kept index → near-copies):');
    Object.entries(groups)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .forEach(([k, n]) => console.log(`  #${Number(k) + 1} ×${n}  ${pool[k].slice(0, 90)}…`));
    const tally = {};
    slots.forEach((s) => {
      const t = (s.tags || []).join(' ');
      tally[t] = (tally[t] || 0) + 1;
    });
    console.log('\nslot plan (tags → count):');
    Object.entries(tally)
      .sort((a, b) => b[1] - a[1])
      .forEach(([t, n]) => console.log(`  ${String(n).padStart(3)}  ${t}`));
    console.log('\nrewrite indices:', slots.map((s) => s.index + 1).join(','));
    return { pool, kept, slots };
  }

  fs.mkdirSync(OUT, { recursive: true });
  const lens = pool.map((e) => e.length);
  const lenBand = cfg.lenBand || [Math.min(...lens) - 20, Math.max(...lens) + 60];
  const examples = cfg.examples ? cfg.examples(kept, pool) : kept.slice(0, 6).map((k) => pool[k]);
  const working = kept.map((k) => pool[k]);
  const groupsList = kept.map((k) => parsed[k]);
  const usage = {};
  const keyUsage = cfg.keyUsage || ((p) => p.keys);
  groupsList.forEach((p) => keyUsage(p).forEach((k) => (usage[k] = (usage[k] || 0) + 1)));
  const ctx = { cfg, pool, parsed, working, groups: groupsList, usage, lenBand, examples };

  const keptFlags = [];
  if (argv.includes('--check-kept') && cfg.reality) {
    for (const k of kept) {
      try {
        const bad = await cfg.reality(pool[k], null, ctx);
        if (bad.length) keptFlags.push({ index: k + 1, bad });
      } catch (e) {
        keptFlags.push({ index: k + 1, bad: [`check failed: ${e.message.slice(0, 80)}`] });
      }
    }
  }

  const done = [];
  // --resume: keep a previous run's accepted rewrites, fill only what it left unfilled.
  const prior = flag('--resume')
    ? JSON.parse(fs.readFileSync(flag('--resume'), 'utf8')).changes
    : [];
  const priorByIndex = new Map(prior.map((c) => [c.index - 1, c]));
  for (const s of slots) {
    const c = priorByIndex.get(s.index);
    if (!c) continue;
    const p = cfg.parse(c.new);
    working.push(c.new);
    groupsList.push(p);
    keyUsage(p).forEach((k) => (usage[k] = (usage[k] || 0) + 1));
    done.push({ ...s, new: c.new, attempts: c.attempts, judgeNote: c.judgeNote, resumed: true });
  }
  const LIMIT = Number(flag('--limit') || 0);
  const todo = slots.filter((s) => !priorByIndex.has(s.index));
  const pending = (LIMIT ? todo.slice(0, LIMIT) : todo).map((s) => ({
    ...s,
    attempts: 0,
    textAttempts: 0,
    rejections: [],
  }));
  const JUDGE_ADVISORY = argv.includes('--judge-advisory');
  const BATCH = cfg.batchSize || 6;
  const MAX_ATTEMPTS = cfg.maxAttempts || 8;
  const REASSIGN_AFTER = cfg.textAttemptsBeforeReassign || 3;
  const reserve = (s) => s.keys.forEach((k) => (usage[k] = (usage[k] || 0) + 1));
  const release = (s) => s.keys.forEach((k) => (usage[k] = Math.max(0, (usage[k] || 0) - 1)));

  while (pending.length) {
    const batch = pending.splice(0, BATCH);
    for (const s of batch) {
      if (!s.assignment || s.reassign) {
        const a = cfg.assign(s, ctx);
        if (!a) {
          s.rejections.push({
            cand: null,
            problems: ['no assignment satisfies the caps + overlap rule'],
          });
          done.push({ ...s, new: null });
          continue;
        }
        s.assignment = a;
        s.keys = a.keys;
        if (a.tags) s.tags = a.tags;
        s.reassign = false;
        s.textAttempts = 0;
        reserve(s);
        s.groupEntry = { keys: a.keys, assignment: a };
        groupsList.push(s.groupEntry);
      }
    }
    const live = batch.filter((s) => s.assignment && !done.includes(s));
    if (!live.length) continue;
    let out;
    try {
      out = jsonOf(
        await claude(cfg.writerModel || SONNET_ID, cfg.brief(live, examples, ctx), 6000)
      );
    } catch (e) {
      console.log(`  batch parse failed (${e.message.slice(0, 80)}); retrying these slots`);
      live.forEach((s) => (s.attempts += 1));
      pending.unshift(...live.filter((s) => s.attempts < MAX_ATTEMPTS));
      continue;
    }
    for (let i = 0; i < live.length; i++) {
      const s = live[i];
      const cand = String(out[i] || '').trim();
      s.attempts++;
      s.textAttempts++;
      const problems = [];
      if (!cfg.formatRe.test(cand)) problems.push('format');
      if (cand.length < lenBand[0] || cand.length > lenBand[1])
        problems.push(`length ${cand.length}`);
      let candParsed = null;
      try {
        candParsed = cfg.parse(cand);
        const missing = s.keys.filter((k) => !candParsed.keys.includes(k));
        const extra = candParsed.keys.filter((k) => !s.keys.includes(k));
        if (missing.length || extra.length)
          problems.push(
            `differs from the assignment (missing ${missing.join(',') || '-'}; extra ${extra.join(',') || '-'})`
          );
      } catch (e) {
        problems.push(`unparseable: ${e.message.slice(0, 60)}`);
      }
      problems.push(...cfg.mechanical(cand, s, ctx));
      try {
        if (!problems.length && cfg.reality) {
          const bad = await cfg.reality(cand, s, ctx);
          if (bad.length) problems.push(`reality: ${bad.join('; ')}`);
        }
        if (!problems.length && cfg.judge) {
          const dups = await cfg.judge(cand, ctx);
          if (dups.length) {
            const note = `same idea as: ${dups.map((d) => (working[d - 1] || '?').slice(0, 50)).join(' | ')}`;
            if (JUDGE_ADVISORY) s.judgeNote = note;
            else problems.push(note);
          }
        }
      } catch (e) {
        problems.push(`check failed: ${e.message.slice(0, 80)}`);
      }
      if (problems.length) {
        console.log(
          `  ✗ #${s.index + 1} ${(s.tags || []).join(' ')}: ${problems.join(' ; ').slice(0, 300)}`
        );
        if (process.env.RESEED_SHOW_CAND) console.log(`      ${cand.slice(0, 400)}`);
        s.rejections.push({ cand, problems });
        if (s.textAttempts >= REASSIGN_AFTER) {
          release(s);
          groupsList.splice(groupsList.indexOf(s.groupEntry), 1);
          s.reassign = true;
        }
        if (s.attempts < MAX_ATTEMPTS) pending.push(s);
        else {
          if (!s.reassign) {
            release(s);
            groupsList.splice(groupsList.indexOf(s.groupEntry), 1);
          }
          done.push({ ...s, new: null });
        }
        continue;
      }
      // accepted: the working pool now holds the real text (its parse replaces the planned keys)
      working.push(cand);
      groupsList.splice(groupsList.indexOf(s.groupEntry), 1, candParsed);
      done.push({ ...s, new: cand });
      process.stdout.write(`  ✓ #${s.index + 1} ${(s.tags || []).join(' ')}\n`);
    }
  }

  const filled = pool.slice();
  for (const d of done) if (d.new) filled[d.index] = d.new;
  // grow mode: an unfilled appended slot leaves no hole
  const proposal = filled.filter((e) => e !== undefined);
  const unfilled = done.filter((d) => !d.new);
  fs.writeFileSync(path.join(OUT, 'proposal.json'), JSON.stringify(proposal, null, 2) + '\n');
  const report = {
    pool: cfg.name,
    basis: cfg.basis,
    before: measurePool(cfg, pool),
    after: measurePool(cfg, proposal),
    rewritten: done.filter((d) => d.new).length,
    unfilled: unfilled.map((u) => ({ index: u.index + 1, tags: u.tags, rejections: u.rejections })),
    keptFlags,
    changes: done
      .filter((d) => d.new)
      .sort((a, b) => a.index - b.index)
      .map((d) => ({
        index: d.index + 1,
        tags: d.tags || [],
        old: d.old,
        new: d.new,
        attempts: d.attempts,
        ...(d.judgeNote ? { judgeNote: d.judgeNote } : {}),
      })),
  };
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ before: report.before, after: report.after }, null, 1));
  console.log(
    `rewritten ${report.rewritten}/${slots.length}, unfilled ${unfilled.length}, kept flags ${keptFlags.length}`
  );
  console.log(`proposal + report written to ${OUT} (the pool file is unchanged)`);
  return report;
}

function execute(cfg, from) {
  if (!from)
    throw new Error('--execute needs --from <proposal.json> (the reviewed dry-run output)');
  const before = JSON.parse(fs.readFileSync(cfg.poolFile, 'utf8'));
  const proposal = JSON.parse(fs.readFileSync(from, 'utf8'));
  if (!Array.isArray(proposal) || proposal.length < before.length) {
    throw new Error(`proposal has ${proposal.length} entries, pool has ${before.length}; refusing`);
  }
  if (proposal.length > before.length) {
    // grow mode: every original stays byte-identical at its index; only appended entries are new
    const moved = before.filter((e, i) => proposal[i] !== e).length;
    if (moved) throw new Error(`${moved} originals differ in a grow proposal; refusing`);
  }
  // Unchanged entries must be byte-identical originals; changed ones must pass the strict format.
  const bad = proposal.filter(
    (e, i) => e !== before[i] && (typeof e !== 'string' || !cfg.formatRe.test(e))
  );
  if (bad.length) throw new Error(`${bad.length} changed entries fail the format check; refusing`);
  const backup = path.join(
    os.homedir(),
    `poolbackup-${cfg.name.replace(/\//g, '-')}-${Date.now()}.json`
  );
  fs.writeFileSync(backup, JSON.stringify(before, null, 2) + '\n');
  fs.writeFileSync(cfg.poolFile, JSON.stringify(proposal, null, 2) + '\n');
  const check = JSON.parse(fs.readFileSync(cfg.poolFile, 'utf8'));
  if (check.length !== proposal.length) throw new Error('post-write count mismatch');
  const changed = proposal.filter((e, i) => e !== before[i]).length;
  console.log(
    `backed up to ${backup}; wrote ${check.length} entries (${changed} changed) to ${cfg.poolFile}`
  );
}

const SONNET_ID = require('../../lib/models').SONNET;
const HAIKU_ID = require('../../lib/models').HAIKU;

module.exports = {
  runReseed,
  execute,
  measurePool,
  group,
  sharedKeys,
  claude,
  jsonOf,
  shuffle,
  byUsage,
  SONNET: SONNET_ID,
  HAIKU: HAIKU_ID,
};
