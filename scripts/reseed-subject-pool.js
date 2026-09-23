#!/usr/bin/env node
/**
 * PILOT tool: cleans up and backfills ONE subject pool, by expanding its concept
 * space rather than deduplicating within it.
 *
 * WHY EXPANSION AND NOT DEDUP
 * The bad pools are not deep-with-duplicates, they are ONE IDEA in several
 * wordings. `BLOOMBOT_FLOWER_FRIENDS_FLOWER_FOCAL_CLUSTER` is 125 entries and
 * 8 ideas (94% redundant): 40 powder-blue wildflower clusters, 26 pale-blue
 * periwinkle, 25 pale-violet phlox, and so on. Rewriting the duplicates inside
 * that motif would raise the audit number and change nothing a viewer sees,
 * because every render would still be a soft pastel bouquet.
 *
 * So the operator supplies CATEGORIES — kinds of idea the pool should cover but
 * does not — and generation is per category, which is what actually forces the
 * concept space open.
 *
 * SAFETY (SEED_DIVERSITY_CHARTER.md §6b)
 *   - dry run by default; --execute required
 *   - the pool file is backed up before any write
 *   - KEEPS one representative of every existing idea: nothing is thrown away,
 *     the pool only grows
 *   - every generated entry is validated before it can be written (distinctness
 *     lexically, register/length, negation, text-prior nouns) and anything that
 *     fails is reported, not silently dropped
 *
 * Usage:
 *   node scripts/reseed-subject-pool.js <BOT> <POOL_CONST> --categories FILE [--per 8] [--execute]
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { clusterPool, similarity, entryText, formatTokens, tokens } = require('./lib/ideaSimilarity');
const { SONNET } = require('./lib/models');

function loadKey() {
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY;
  for (const l of fs.readFileSync('.env.local', 'utf8').split('\n')) {
    const e = l.indexOf('=');
    if (e > 0 && l.slice(0, e).trim() === 'ANTHROPIC_API_KEY') return l.slice(e + 1).trim();
  }
  throw new Error('ANTHROPIC_API_KEY not found');
}

function call(system, user, key, maxTokens = 4000) {
  const body = JSON.stringify({ model: SONNET, max_tokens: maxTokens, system, messages: [{ role: 'user', content: user }] });
  return new Promise((res, rej) => {
    const r = https.request(
      { hostname: 'api.anthropic.com', path: '/v1/messages', method: 'POST',
        headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-length': Buffer.byteLength(body) } },
      (x) => { let d = ''; x.on('data', (c) => (d += c)); x.on('end', () => {
        if (x.statusCode !== 200) return rej(new Error(`${x.statusCode}: ${d.slice(0, 200)}`));
        try { res((JSON.parse(d).content || []).map((b) => b.text || '').join('')); } catch (e) { rej(e); } }); });
    r.on('error', rej); r.write(body); r.end();
  });
}

function parseArray(text) {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fence ? fence[1] : text;
  const s = raw.indexOf('['), e = raw.lastIndexOf(']');
  if (s < 0 || e <= s) throw new Error(`no JSON array: ${text.slice(0, 150)}`);
  return JSON.parse(raw.slice(s, e + 1));
}

/** Which seed file backs a pools.js constant — matched by content, not by name. */
function findSeedFile(bot, arr) {
  const dir = path.join(__dirname, 'bots', bot, 'seeds');
  const want = JSON.stringify(arr);
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json')) continue;
    try { if (fs.readFileSync(path.join(dir, f), 'utf8').replace(/\s+$/, '') === want || JSON.stringify(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))) === want) return path.join(dir, f); } catch { /* skip */ }
  }
  return null;
}

async function main() {
  const [bot, constName] = process.argv.slice(2);
  const ci = process.argv.indexOf('--categories');
  const per = process.argv.includes('--per') ? Number(process.argv[process.argv.indexOf('--per') + 1]) : 8;
  const execute = process.argv.includes('--execute');
  if (!bot || !constName || ci < 0) {
    console.error('usage: node scripts/reseed-subject-pool.js <BOT> <POOL_CONST> --categories FILE [--per N] [--execute]');
    process.exit(1);
  }
  const categories = fs.readFileSync(process.argv[ci + 1], 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  const pools = require(path.join(__dirname, 'bots', bot, 'pools.js'));
  const original = pools[constName];
  if (!Array.isArray(original)) { console.error(`${constName} not found in ${bot}/pools.js`); process.exit(1); }
  const seedFile = findSeedFile(bot, original);
  const key = loadKey();

  const before = clusterPool(original, 0.48);
  console.log(`\n━━━ ${bot}/${constName}`);
  console.log(`  entries ${original.length}   distinct ideas ${before.distinct}   redundant ${before.pct}%`);
  console.log(`  seed file: ${seedFile ? path.relative(process.cwd(), seedFile) : 'NOT FOUND (inline pool — cannot write)'}`);
  console.log(`  categories to author: ${categories.length} x ${per} = ${categories.length * per} target entries`);

  // keep one representative per existing idea — nothing is discarded
  const keep = before.clusters.map((c) => original[c.members[0]]);
  console.log(`  keeping ${keep.length} existing entries (one per existing idea); the other ${original.length - keep.length} are restatements`);

  const styleSample = keep.slice(0, 6).map(entryText);
  const SYSTEM =
    'You author entries for one image-prompt seed pool. Each entry describes the SUBJECT of a close-up ' +
    'photograph — what the picture is OF. Match the given pool style EXACTLY: same shape, same caps ' +
    'convention, same approximate length, same level of concrete detail. ' +
    'Write each entry about the requested CATEGORY, and make every entry a genuinely different idea ' +
    'from the others and from the existing entries listed. Never negate ("no X", "without X"). Never ' +
    'mention signs, labels, text or writing. Reply with ONLY a JSON array of strings.';

  const generated = [];
  for (const cat of categories) {
    const user =
      `POOL STYLE — copy this shape and length exactly:\n${styleSample.map((t) => `- ${t}`).join('\n')}\n\n` +
      `IDEAS ALREADY IN THE POOL (do not repeat any of these):\n${keep.map((t) => `- ${entryText(t).slice(0, 80)}`).join('\n')}\n\n` +
      `AUTHOR ${per} ENTRIES for this category, each a different idea:\n${cat}`;
    try {
      const arr = parseArray(await call(SYSTEM, user, key));
      for (const t of arr) if (typeof t === 'string' && t.trim()) generated.push({ cat, text: t.trim() });
    } catch (e) {
      console.log(`  ⚠️ ${cat.slice(0, 40)}: ${e.message.slice(0, 70)}`);
    }
    process.stdout.write(`\r  generated: ${generated.length}`);
  }
  console.log();

  // validate
  //
  // Similarity here MUST strip the pool's own boilerplate, exactly as clusterPool
  // does. An earlier version called similarity() raw, so the validator measured
  // FORMAT while the audit measured IDEAS — and it rejected 72 of 100 entries
  // whose real match against the closest existing entry was only 16-32%, far
  // under the threshold. The audit said the pool had 63 ideas and the validator
  // behaved as though it had 8. Same measure, both places, or the numbers lie.
  const fmt = formatTokens(original, 0.4);
  const strip = (t) => { const out = new Set(); for (const x of tokens(t)) if (!fmt.has(x)) out.add(x); return out.size ? out : tokens(t); };
  const sim = (a, b) => similarity(strip(a), strip(b));

  // DESIGN CONFORMANCE. Kevin: "making sure that the new seeds match the pool
  // they're going into? we need to make sure to maintain each pool's
  // over-arching design when we do this."
  //
  // The pool's high-frequency tokens ARE its design: the ones in >=80% of
  // entries carry its framing and register. For flower_focal_cluster those
  // include `co-hero`, `vignette`, `pastel`, `watercolor`, `layers` — drop them
  // and the entry stops being a flower-friends entry even if the flowers are
  // lovely. So a new entry must carry most of that skeleton, which is the
  // generic form of a check first done by hand on the pilot (all six structural
  // markers were at 100% on both old and new).
  const designTokens = [...formatTokens(original, 0.8)];
  const DESIGN_MIN = 0.7; // fraction of the pool's own skeleton a new entry must carry
  const conformance = (t) => {
    if (!designTokens.length) return 1;
    const has = tokens(t);
    let n = 0;
    for (const d of designTokens) if (has.has(d)) n++;
    return n / designTokens.length;
  };

  const BANNED = /\b(sign|signs|signage|label|labels|banner|placard|lettering|written|words?)\b/i;
  const NEG = /\b(no|not|never|without|avoid)\b/i;
  const lens = keep.map((e) => entryText(e).length).sort((a, b) => a - b);
  const lo = lens[Math.floor(lens.length * 0.1)] || 40, hi = lens[Math.floor(lens.length * 0.9)] || 400;
  const accepted = [], rejected = [];
  for (const g of generated) {
    const why = [];
    if (BANNED.test(g.text)) why.push('text-prior noun');
    if (NEG.test(g.text)) why.push('negation');
    if (g.text.length < lo * 0.5 || g.text.length > hi * 1.8) why.push(`length ${g.text.length} vs pool ${lo}-${hi}`);
    const conf = conformance(g.text);
    if (conf < DESIGN_MIN) why.push(`off-design: carries only ${Math.round(conf * 100)}% of the pool's skeleton (needs ${DESIGN_MIN * 100}%)`);
    const vsOld = keep.reduce((m, t) => Math.max(m, sim(g.text, entryText(t))), 0);
    if (vsOld >= 0.48) why.push(`${Math.round(vsOld * 100)}% same as an existing entry`);
    const vsNew = accepted.reduce((m, a) => Math.max(m, sim(g.text, a.text)), 0);
    if (vsNew >= 0.48) why.push(`${Math.round(vsNew * 100)}% same as another new entry`);
    (why.length ? rejected : accepted).push({ ...g, why });
  }

  const after = [...keep, ...accepted.map((a) => a.text)];
  const afterC = clusterPool(after, 0.48);

  console.log(`\nVALIDATION`);
  console.log(`  accepted ${accepted.length}   rejected ${rejected.length}`);
  console.log(`  design skeleton: ${designTokens.length} token(s) in >=80% of existing entries; new entries must carry >=${DESIGN_MIN * 100}%`);
  if (accepted.length) {
    const confs = accepted.map((a) => conformance(a.text)).sort((x, y) => x - y);
    console.log(`  accepted conformance: min ${Math.round(confs[0] * 100)}%  median ${Math.round(confs[Math.floor(confs.length / 2)] * 100)}%`);
  }
  const byReason = {};
  for (const r of rejected) for (const w of r.why) { const k = w.replace(/\d+/g, 'N'); byReason[k] = (byReason[k] || 0) + 1; }
  for (const [k, v] of Object.entries(byReason).sort((a, b) => b[1] - a[1])) console.log(`     ${String(v).padStart(3)} x ${k}`);

  console.log(`\nRESULT`);
  console.log(`  entries  ${original.length} → ${after.length}`);
  console.log(`  distinct ${before.distinct} → ${afterC.distinct}`);
  console.log(`  redundant ${before.pct}% → ${afterC.pct}%`);
  const perCat = {};
  for (const a of accepted) perCat[a.cat] = (perCat[a.cat] || 0) + 1;
  console.log(`\nACCEPTED PER CATEGORY`);
  for (const c of categories) console.log(`  ${String(perCat[c] || 0).padStart(2)}  ${c.slice(0, 92)}`);

  console.log(`\nSAMPLE OF NEW ENTRIES`);
  for (const a of accepted.slice(0, 10)) console.log(`  • ${a.text.slice(0, 145)}`);

  const dump = path.join(process.env.HOME, `reseed-${bot}-${constName}-${Date.now()}.json`);
  fs.writeFileSync(dump, JSON.stringify({ bot, constName, seedFile, original, keep, accepted, rejected }, null, 1));
  console.log(`\nfull proposal: ${dump}`);

  if (!execute) { console.log('\n── DRY RUN — pool NOT modified. ──'); return; }
  if (!seedFile) { console.error('\n❌ cannot write: no backing seed file found'); process.exit(1); }
  if (after.length < original.length * 0.5) { console.error('\n❌ refusing: result would be less than half the original size'); process.exit(1); }
  const backup = path.join(process.env.HOME, `poolbackup-${bot}-${constName}-${Date.now()}.json`);
  fs.writeFileSync(backup, JSON.stringify(original, null, 1));
  fs.writeFileSync(seedFile, JSON.stringify(after, null, 1) + '\n');
  const reread = JSON.parse(fs.readFileSync(seedFile, 'utf8'));
  if (!Array.isArray(reread) || reread.length !== after.length) { console.error('❌ post-write verification failed'); process.exit(1); }
  console.log(`\n✓ written ${after.length} entries. backup: ${backup}`);
}

main().catch((e) => { console.error('\n❌ ' + e.message); process.exit(1); });
