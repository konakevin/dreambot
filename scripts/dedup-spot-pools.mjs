/**
 * dedup-spot-pools.mjs — spot-pool concentration FLAGGER for location_iconic_spots.
 *
 * WHY: gen-iconic-spots does string/junk dedup but NOT concept dedup. Viking Age
 * had 26 near-duplicate stone/rune/mound spots (25% of the pool) → every nightly
 * cast dream put the couple at a rune stone ("always touching a rock").
 *
 * ⚠️ LESSON (2026-08-25): a fleet-wide AUTO-thinner is UNSAFE. Raw token frequency
 * over-flags legitimate dominant themes (Hawaii SHOULD have many beaches; Bora Bora
 * IS lagoons), and even a Haiku judge over-calls "bloat" and would gut good pools.
 * The systemic "always touching a rock" repetition was the POSE (fixed globally by
 * killing the monument-touching pose + the dynamic pool), NOT the spot pools. So:
 * this is a DIAGNOSTIC — it surfaces candidate pools for HUMAN review. --write is
 * gated to ONE deliberately-chosen --location (never fleet-wide) and is only right
 * for a genuine static-PROP bloat (a touch/interact object repeated), like Viking's
 * rune stones. Do NOT thin varied settings (beaches, temples, canals).
 *
 * Detector: for each location, count how many ACTIVE spots contain each
 * significant feature-token (length>=4, minus stopwords + the location's own
 * name words). A token in > FLAG fraction of the pool AND >= MIN_HITS spots is a
 * bloat cluster. Thinning keeps the most DISTINCTLY-worded members (rarest other
 * tokens) up to CAP fraction and sets is_active=false on the rest — never
 * dropping a pool below MIN_ACTIVE.
 *
 * Usage:
 *   node scripts/dedup-spot-pools.mjs                      # report ALL locations
 *   node scripts/dedup-spot-pools.mjs --location "viking longhouse"
 *   node scripts/dedup-spot-pools.mjs --write              # apply thinning
 *   node scripts/dedup-spot-pools.mjs --flag 0.18 --cap 0.12 --min-active 15
 */
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
dotenv.config({ path: '.env.local' });

const sb = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const ANTHROPIC = process.env.ANTHROPIC_API_KEY;
const HAIKU = 'claude-haiku-4-5-20251001';

// Haiku judge: is a flagged cluster genuinely repetitive (same object/composition
// repeated → samey dreams, like Viking rune-stones) or a legitimately varied theme
// (many different beaches/temples)? Returns { bloat, keep:[spot ids] }.
async function judgeCluster(loc, token, members, keepN) {
  const list = members.map((m, i) => `${i}. ${m.spot_text}`).join('\n');
  const prompt = `You curate location backdrops for an AI dream-photo generator. Below are ${members.length} backdrop descriptions from "${loc}" that all mention "${token}".

A cluster is BLOAT if these are near-duplicate variations of the SAME visual subject/composition — they'd make generated dreams look repetitive (e.g. twenty different carved standing stones that all render as "a person next to a rune stone"). A cluster is FINE if they are genuinely VARIED scenes that merely share the word (e.g. many distinct beaches, or a building material like stone used across different structures).

Backdrops:
${list}

If BLOAT, pick the ${keepN} MOST visually distinct ones to keep (drop the rest). If FINE, keep all.
Respond with ONLY compact JSON, no prose: {"bloat": true|false, "keep": [indices]}`;
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': ANTHROPIC, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: HAIKU, max_tokens: 1000, messages: [{ role: 'user', content: prompt }] }),
  });
  if (!res.ok) throw new Error(`Haiku ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const txt = ((await res.json()).content?.[0]?.text || '').trim();
  const m = txt.match(/\{[\s\S]*\}/);
  if (!m) return { bloat: false, keep: members.map((_, i) => i) };
  const parsed = JSON.parse(m[0]);
  const keepIdx = new Set((parsed.keep || []).filter((n) => Number.isInteger(n)));
  return { bloat: !!parsed.bloat, keepIds: members.filter((_, i) => keepIdx.has(i)).map((x) => x.id) };
}
const arg = (n, d) => {
  const i = process.argv.indexOf('--' + n);
  return i >= 0 ? process.argv[i + 1] : d;
};
const has = (n) => process.argv.includes('--' + n);

const ONLY = arg('location', null);
const WRITE = has('write');
const JUDGE = has('judge') || WRITE; // thinning is ALWAYS Haiku-judged
const FLAG = parseFloat(arg('flag', '0.18')); // flag a token in > this fraction of the pool
const CAP = parseFloat(arg('cap', '0.12')); // thin the cluster down to ~ this fraction
const MIN_HITS = parseInt(arg('min-hits', '6'), 10); // and at least this many spots
const MIN_ACTIVE = parseInt(arg('min-active', '15'), 10); // never thin a pool below this

const STOP = new Set(
  ('the a an of and or with at on in to by from for over under near beside along across into onto ' +
    'its their view views scene backdrop vista overlooking overlook toward towards through between ' +
    'above below around within amid amidst against this that these those where while during ' +
    'great grand large small tall high low long wide old new ancient distant vast')
    .split(/\s+/)
);

function tokens(text, nameWords) {
  return [
    ...new Set(
      text
        .toLowerCase()
        .replace(/[^a-z\s-]/g, ' ')
        .split(/\s+/)
        .map((w) => w.replace(/s$/, '')) // crude singularize so stone/stones cluster
        .filter((w) => w.length >= 4 && !STOP.has(w) && !nameWords.has(w))
    ),
  ];
}

async function loadAll() {
  // paginate past the 1000-row cap
  const rows = [];
  let from = 0;
  for (;;) {
    const { data, error } = await sb
      .from('location_iconic_spots')
      .select('id,location_key,spot_text,is_active')
      .eq('is_active', true)
      .range(from, from + 999);
    if (error) throw error;
    rows.push(...data);
    if (data.length < 1000) break;
    from += 1000;
  }
  return rows;
}

async function run() {
  if (WRITE && !ONLY) {
    console.error('REFUSED: --write requires an explicit --location (no fleet-wide auto-thin — it over-cuts).');
    process.exit(1);
  }
  const all = await loadAll();
  const byLoc = new Map();
  for (const r of all) {
    if (ONLY && r.location_key !== ONLY) continue;
    if (!byLoc.has(r.location_key)) byLoc.set(r.location_key, []);
    byLoc.get(r.location_key).push(r);
  }

  let flaggedLocs = 0;
  let totalThinned = 0;
  const disableIds = [];

  for (const [loc, spots] of [...byLoc.entries()].sort()) {
    const total = spots.length;
    const nameWords = new Set(loc.toLowerCase().split(/\s+/).map((w) => w.replace(/s$/, '')));
    // global token freq across this pool
    const freq = new Map();
    const spotTokens = new Map();
    for (const s of spots) {
      const t = tokens(s.spot_text, nameWords);
      spotTokens.set(s.id, t);
      for (const w of t) freq.set(w, (freq.get(w) || 0) + 1);
    }
    // bloat clusters
    const clusters = [...freq.entries()]
      .filter(([, c]) => c >= MIN_HITS && c / total > FLAG)
      .sort((a, b) => b[1] - a[1]);
    if (!clusters.length) continue;
    flaggedLocs++;
    console.log(`\n▲ ${loc}  (${total} active)`);
    for (const [tok, count] of clusters) {
      const pct = Math.round((count / total) * 100);
      if (!JUDGE) {
        console.log(`   "${tok}" ×${count} (${pct}%) — flagged (run --judge to verify)`);
        continue;
      }
      const keepN = Math.max(1, Math.floor(CAP * total));
      const members = spots.filter((s) => spotTokens.get(s.id).includes(tok));
      let verdict;
      try {
        verdict = await judgeCluster(loc, tok, members, keepN);
      } catch (e) {
        console.log(`   "${tok}" ×${count} (${pct}%) — judge error: ${e.message}`);
        continue;
      }
      if (!verdict.bloat) {
        console.log(`   "${tok}" ×${count} (${pct}%) → Haiku: varied theme, KEEP all`);
        continue;
      }
      const keepIds = new Set(verdict.keepIds || []);
      let drop = members.filter((s) => !keepIds.has(s.id)).map((s) => s.id);
      // guard: never push this pool below MIN_ACTIVE (account for prior thins here)
      const priorHere = disableIds.filter((x) => x.loc === loc).length;
      const room = total - MIN_ACTIVE - priorHere;
      drop = drop.slice(0, Math.max(0, room));
      console.log(
        `   "${tok}" ×${count} (${pct}%) → Haiku: BLOAT, keep ${members.length - drop.length}, thin ${drop.length}`
      );
      if (WRITE) {
        disableIds.push(...drop.map((id) => ({ id, loc })));
        totalThinned += drop.length;
      }
    }
  }

  console.log(
    `\n${flaggedLocs} location(s) flagged. ${WRITE ? `Thinning ${totalThinned} spots (is_active=false)...` : 'DRY RUN — pass --write to apply.'}`
  );
  if (WRITE && disableIds.length) {
    // batch update
    const ids = disableIds.map((x) => x.id);
    for (let i = 0; i < ids.length; i += 200) {
      const { error } = await sb
        .from('location_iconic_spots')
        .update({ is_active: false })
        .in('id', ids.slice(i, i + 200));
      if (error) console.log('  update error:', error.message);
    }
    console.log(`  done — ${ids.length} spots deactivated.`);
  }
}

run().catch((e) => {
  console.error('FATAL', e.message);
  process.exit(1);
});
