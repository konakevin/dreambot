#!/usr/bin/env node
/**
 * Repairs one seed pool: finds entries that restate an idea already in the pool
 * and rewrites them into genuinely different ideas.
 *
 * DRY RUN BY DEFAULT. `--execute` is required to write, and even then the pool is
 * backed up first and the entry count can never drop. See SEED_DIVERSITY_CHARTER.md
 * §6b for the safety rules this implements — they are Kevin's, not optional.
 *
 * HOW SAMENESS IS DECIDED (charter §5b)
 *   1. `ideaSimilarity.clusterPool` at a LOOSE threshold shortlists candidate
 *      groups. Cheap, deterministic, and it never has to compare every pair.
 *   2. Haiku judges each shortlisted group: which of these are genuinely the same
 *      idea? Lexical overlap alone cannot do this — the worst real cluster differs
 *      only by `broad` / `large` / `blush`, which no token measure resolves.
 *   3. Sonnet rewrites the redundant members into new ideas in the pool's own
 *      voice, given the surviving ideas as forbidden territory.
 *
 * Usage:
 *   node scripts/repair-seed-pool.js <bot>/<pool>              # dry run
 *   node scripts/repair-seed-pool.js <bot>/<pool> --execute
 *   ... [--prefilter 0.45] [--limit N] [--target 100]
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { clusterPool, similarity, tokens } = require('./lib/ideaSimilarity');
const { SONNET, HAIKU } = require('./lib/models');

const PREFILTER_DEFAULT = 0.45; // loose on purpose: recall matters, Haiku decides
const API = 'api.anthropic.com';

function loadKey() {
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY;
  try {
    for (const l of fs.readFileSync('.env.local', 'utf8').split('\n')) {
      const eq = l.indexOf('=');
      if (eq > 0 && l.slice(0, eq).trim() === 'ANTHROPIC_API_KEY') return l.slice(eq + 1).trim();
    }
  } catch { /* fall through */ }
  throw new Error('ANTHROPIC_API_KEY not found (env or .env.local)');
}

function call({ model, system, user, maxTokens = 4000, key }) {
  const body = JSON.stringify({
    model,
    max_tokens: maxTokens,
    system,
    messages: [{ role: 'user', content: user }],
  });
  return new Promise((resolve, reject) => {
    const req = https.request(
      { hostname: API, path: '/v1/messages', method: 'POST', headers: {
        'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01',
        'content-length': Buffer.byteLength(body) } },
      (res) => {
        let d = '';
        res.on('data', (c) => (d += c));
        res.on('end', () => {
          if (res.statusCode !== 200) return reject(new Error(`${res.statusCode}: ${d.slice(0, 300)}`));
          try {
            const j = JSON.parse(d);
            resolve({ text: (j.content || []).map((b) => b.text || '').join(''), stop: j.stop_reason });
          } catch (e) { reject(e); }
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

/** Pull a JSON array out of a model reply that may be fenced or chatty. */
function parseArray(text) {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fence ? fence[1] : text;
  const s = raw.indexOf('[');
  const e = raw.lastIndexOf(']');
  if (s < 0 || e <= s) throw new Error(`no JSON array in reply: ${text.slice(0, 200)}`);
  return JSON.parse(raw.slice(s, e + 1));
}

const entryText = (e) => (typeof e === 'string' ? e : (e && (e.description || e.text)) || '');

async function main() {
  const target = process.argv.find((a) => a.startsWith('--target'))
    ? Number(process.argv[process.argv.indexOf('--target') + 1]) : 100;
  const pf = process.argv.includes('--prefilter')
    ? Number(process.argv[process.argv.indexOf('--prefilter') + 1]) : PREFILTER_DEFAULT;
  const limit = process.argv.includes('--limit')
    ? Number(process.argv[process.argv.indexOf('--limit') + 1]) : Infinity;
  const execute = process.argv.includes('--execute');
  const spec = process.argv[2];
  if (!spec || !spec.includes('/')) {
    console.error('usage: node scripts/repair-seed-pool.js <bot>/<pool> [--execute]');
    process.exit(1);
  }
  const [bot, pool] = spec.split('/');
  const file = path.join(__dirname, 'bots', bot, 'seeds', `${pool}.json`);
  if (!fs.existsSync(file)) { console.error(`no such pool: ${file}`); process.exit(1); }

  const original = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!Array.isArray(original)) { console.error('pool is not an array'); process.exit(1); }
  const key = loadKey();

  console.log(`\n━━━ ${spec}`);
  console.log(`entries: ${original.length}`);

  // ── 1. lexical prefilter ────────────────────────────────────────────────
  const pre = clusterPool(original, pf);
  const candidates = pre.clusters.filter((c) => c.members.length > 1);
  console.log(`lexical prefilter @${pf}: ${pre.distinct} groups, ${candidates.length} with >1 member`);
  if (!candidates.length) { console.log('nothing to judge — pool looks clean lexically.'); return; }

  // ── 2. Haiku judges each candidate group ────────────────────────────────
  const JUDGE_SYSTEM =
    'You judge whether short image-prompt seed entries describe THE SAME IDEA or DIFFERENT ideas. ' +
    'Same idea means a viewer looking at two rendered images would feel they had seen the same picture ' +
    'twice, even if the wording differs. Swapped adjectives, synonyms, or re-ordered clauses do NOT ' +
    'make an idea different. A genuinely different subject, setting, action or object DOES. ' +
    'Reply with ONLY a JSON array of arrays: each inner array lists the 0-based indices you judge to ' +
    'be one idea. Every index must appear exactly once.';

  let judged = 0;
  const groups = [];
  for (const c of candidates.slice(0, isFinite(limit) ? limit : candidates.length)) {
    const list = c.members.map((i, n) => `${n}: ${entryText(original[i])}`).join('\n');
    let parsed;
    try {
      const r = await call({ model: HAIKU, system: JUDGE_SYSTEM, user: list, maxTokens: 1500, key });
      parsed = parseArray(r.text);
    } catch (e) {
      console.log(`  ⚠️ judge failed on a group of ${c.members.length}: ${e.message.slice(0, 80)}`);
      continue;
    }
    judged++;
    for (const g of parsed) {
      if (!Array.isArray(g) || g.length < 2) continue;
      groups.push(g.map((n) => c.members[n]).filter((x) => Number.isInteger(x)));
    }
  }
  const redundantIdx = [];
  for (const g of groups) redundantIdx.push(...g.slice(1)); // keep the first of each
  console.log(`Haiku judged ${judged} group(s) → ${groups.length} same-idea set(s), ${redundantIdx.length} entries to rewrite`);
  if (!redundantIdx.length) { console.log('Haiku found no true duplicates. Nothing to do.'); return; }

  // ── 3. Sonnet rewrites the redundant entries ────────────────────────────
  const keepIdx = original.map((_, i) => i).filter((i) => !redundantIdx.includes(i));
  const sample = keepIdx.slice(0, 12).map((i) => entryText(original[i]));
  const forbidden = keepIdx.map((i) => entryText(original[i]));

  const REWRITE_SYSTEM =
    'You rewrite image-prompt seed entries. You are given entries that DUPLICATE an idea already in ' +
    'the pool, plus the ideas already present. Replace each with a GENUINELY DIFFERENT idea that fits ' +
    'the same pool: same voice, same sentence shape, same approximate length, same register and ' +
    'subject domain. Never reuse a subject, setting, object or action already present. Never negate ' +
    '("no X", "without X") — the renderer cannot process it. Never mention signs, labels, banners, ' +
    'text or writing. Reply with ONLY a JSON array of strings, one per entry given, in order.';

  const rewrites = [];
  const BATCH = 8;
  for (let i = 0; i < redundantIdx.length; i += BATCH) {
    const chunk = redundantIdx.slice(i, i + BATCH);
    const user =
      `POOL STYLE — entries already in this pool, match their shape and voice:\n` +
      sample.map((t) => `- ${t}`).join('\n') +
      `\n\nIDEAS ALREADY PRESENT (do not reuse any of these subjects):\n` +
      forbidden.slice(0, 120).map((t) => `- ${t.slice(0, 90)}`).join('\n') +
      `\n\nREWRITE THESE ${chunk.length} ENTRIES, each into a different idea:\n` +
      chunk.map((idx, n) => `${n}: ${entryText(original[idx])}`).join('\n');
    try {
      const r = await call({ model: SONNET, system: REWRITE_SYSTEM, user, maxTokens: 3000, key });
      const arr = parseArray(r.text);
      chunk.forEach((idx, n) => { if (typeof arr[n] === 'string' && arr[n].trim()) rewrites.push({ idx, from: entryText(original[idx]), to: arr[n].trim() }); });
    } catch (e) {
      console.log(`  ⚠️ rewrite batch ${i / BATCH} failed: ${e.message.slice(0, 100)}`);
    }
    process.stdout.write(`\r  rewrites proposed: ${rewrites.length}/${redundantIdx.length}`);
  }
  console.log();

  // ── 4. validate every proposal ──────────────────────────────────────────
  const BANNED_TEXT = /\b(sign|signs|signage|label|labels|banner|banners|placard|lettering|written|words?)\b/i;
  const NEGATION = /\b(no|not|never|without|avoid)\b/i;
  const lens = original.map((e) => entryText(e).length).sort((a, b) => a - b);
  const lo = lens[Math.floor(lens.length * 0.1)], hi = lens[Math.floor(lens.length * 0.9)];
  const accepted = [], rejected = [];
  const liveTexts = keepIdx.map((i) => entryText(original[i]));
  for (const r of rewrites) {
    const reasons = [];
    if (BANNED_TEXT.test(r.to)) reasons.push('text-prior noun');
    if (NEGATION.test(r.to)) reasons.push('negation');
    if (r.to.length < lo * 0.6 || r.to.length > hi * 1.6) reasons.push(`off-register length ${r.to.length} (pool ${lo}-${hi})`);
    const worst = liveTexts.reduce((m, t) => Math.max(m, similarity(r.to, t)), 0);
    if (worst >= 0.45) reasons.push(`still ${Math.round(worst * 100)}% similar to an existing entry`);
    const dupOfNew = accepted.reduce((m, a) => Math.max(m, similarity(r.to, a.to)), 0);
    if (dupOfNew >= 0.45) reasons.push(`duplicates another rewrite (${Math.round(dupOfNew * 100)}%)`);
    (reasons.length ? rejected : accepted).push({ ...r, reasons });
  }

  // ── 5. report ───────────────────────────────────────────────────────────
  const after = original.slice();
  for (const a of accepted) after[a.idx] = a.to;
  const beforeC = clusterPool(original, pf), afterC = clusterPool(after, pf);

  console.log(`\nVALIDATION`);
  console.log(`  accepted : ${accepted.length}`);
  console.log(`  rejected : ${rejected.length}`);
  for (const r of rejected.slice(0, 8)) console.log(`     ✗ ${r.reasons.join('; ')}\n        ${r.to.slice(0, 100)}`);

  console.log(`\nPROJECTED EFFECT (lexical @${pf}, the LLM judgement is the real measure)`);
  console.log(`  entries  : ${original.length} → ${after.length}   ${after.length === original.length ? '(unchanged, as required)' : '⚠️ CHANGED'}`);
  console.log(`  distinct : ${beforeC.distinct} → ${afterC.distinct}`);
  console.log(`  redundant: ${beforeC.pct}% → ${afterC.pct}%`);
  console.log(`  still short of ${target} distinct by: ${Math.max(0, target - afterC.distinct)} (backfill would cover this)`);

  console.log(`\nSAMPLE REWRITES (first 12 of ${accepted.length})`);
  for (const a of accepted.slice(0, 12)) {
    console.log(`\n  OLD  ${a.from.slice(0, 150)}`);
    console.log(`  NEW  ${a.to.slice(0, 150)}`);
  }

  const outJson = path.join(process.env.HOME, `pool-repair-${bot}-${pool}-${Date.now()}.json`);
  fs.writeFileSync(outJson, JSON.stringify({ spec, original, accepted, rejected, groups }, null, 1));
  console.log(`\nfull proposal written to ${outJson}`);

  if (!execute) { console.log('\n── DRY RUN — the pool file was NOT modified. ──'); return; }

  if (after.length !== original.length) { console.error('\n❌ REFUSING TO WRITE: entry count changed.'); process.exit(1); }
  const backup = path.join(process.env.HOME, `pool-backup-${bot}-${pool}-${Date.now()}.json`);
  fs.writeFileSync(backup, JSON.stringify(original, null, 1));
  fs.writeFileSync(file, JSON.stringify(after, null, 1) + '\n');
  const reread = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!Array.isArray(reread) || reread.length !== original.length) { console.error('❌ post-write verification FAILED'); process.exit(1); }
  console.log(`\n✓ written. backup: ${backup}`);
}

main().catch((e) => { console.error('\n❌ ' + e.message); process.exit(1); });
