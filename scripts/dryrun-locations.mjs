// Dry-run smoke test: exercise the real nightly engine (roll → recipe → Sonnet
// brief → prompt assembly) for every new-category location across 3 surfaces,
// multiple rolls each, and flag any "dead dream" (empty/crash/corrupt/degraded).
import fs from 'fs';
const env = Object.fromEntries(
  fs
    .readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);
const { createClient } = await import('@supabase/supabase-js');
const SB = 'https://jimftynwrinwenonjrlj.supabase.co';
const W = env.DREAM_QUEUE_WORKER_TOKEN || env.SUPABASE_SERVICE_ROLE_KEY;
const sb = createClient(SB, env.SUPABASE_SERVICE_ROLE_KEY);
const U = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const CORRUPT =
  /\*\*|not a recognized|please (clarify|tell me|specify)|which do you want|i.ll execute|a specific (book|game|film|series|franchise)|author\/title|i need to flag|to give you (a |exactly)/i;
const MIN_LEN = 150; // a real assembled prompt is always well over this
const ROLLS = 2; // rolls per surface (sample different spots)
const CONC = 6;

const SURFACES = [
  { key: 'self', body: { force_cast_role: 'self' } },
  { key: 'dual', body: { force_cast_role: 'dual' } },
  { key: 'scene', body: { force_pure_scene: true } },
];

async function clearBudget() {
  await sb
    .from('ai_generation_budget')
    .delete()
    .eq('user_id', U)
    .eq('date', new Date().toISOString().slice(0, 10));
}

async function dryRun(place, surface) {
  const body = {
    user_id: U,
    force_place: place,
    force_medium: 'canvas',
    dry_run: true,
    ...surface.body,
  };
  try {
    const res = await fetch(`${SB}/functions/v1/nightly-dreams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${W}` },
      body: JSON.stringify(body),
    });
    const d = await res.json();
    if (res.status !== 200 || !d.dry_run)
      return {
        ok: false,
        reason: `HTTP${res.status}:${(d.error || JSON.stringify(d)).slice(0, 80)}`,
      };
    const p = d.finalPrompt || '';
    if (p.length < MIN_LEN) return { ok: false, reason: `SHORT(${p.length}):${p.slice(0, 60)}` };
    if (CORRUPT.test(p)) return { ok: false, reason: `CORRUPT:${(p.match(CORRUPT) || [''])[0]}` };
    const fb = d.fallbackReasons || [];
    const dead = fb.find((r) => /pure_scene_fallback|no_eligible|empty|dead|missing/i.test(r));
    if (dead) return { ok: false, reason: `FALLBACK:${dead}` };
    return { ok: true, len: p.length, fb };
  } catch (e) {
    return { ok: false, reason: `EXC:${e.message.slice(0, 60)}` };
  }
}

const args = process.argv.slice(2);
let cardsQ = sb
  .from('location_cards')
  .select('name,display_name,picker_category')
  .eq('is_approved', true)
  .not('picker_category', 'is', null);
if (args[0] === '--new') cardsQ = cardsQ.eq('admin_only', true);
const { data: cards } = await cardsQ.order('picker_category').order('name');
console.log(
  `Dry-running ${cards.length} cards × ${SURFACES.length} surfaces × ${ROLLS} rolls = ${cards.length * SURFACES.length * ROLLS} calls\n`
);

await clearBudget();
const tasks = [];
for (const c of cards)
  for (const s of SURFACES) for (let r = 0; r < ROLLS; r++) tasks.push({ c, s, r });

const results = {};
let done = 0;
async function worker(queue) {
  while (queue.length) {
    const t = queue.shift();
    if (done % 40 === 0) await clearBudget();
    const res = await dryRun(t.c.name, t.s);
    const k = t.c.name;
    results[k] = results[k] || {
      disp: t.c.display_name,
      cat: t.c.picker_category,
      fails: [],
      oks: 0,
    };
    if (res.ok) results[k].oks++;
    else results[k].fails.push(`${t.s.key}#${t.r}: ${res.reason}`);
    done++;
    if (done % 25 === 0) process.stderr.write(`  ...${done}/${tasks.length}\n`);
  }
}
const queue = [...tasks];
await Promise.all(Array.from({ length: CONC }, () => worker(queue)));

// report
let cat = null,
  failCards = 0;
for (const name of Object.keys(results).sort(
  (a, b) => results[a].cat.localeCompare(results[b].cat) || a.localeCompare(b)
)) {
  const r = results[name];
  if (r.cat !== cat) {
    cat = r.cat;
    console.log(`\n=== ${cat.toUpperCase()} ===`);
  }
  if (r.fails.length) {
    failCards++;
    console.log(`  ❌ ${r.disp} | ${r.oks} ok, ${r.fails.length} FAIL:`);
    r.fails.slice(0, 4).forEach((f) => console.log(`       ${f}`));
  } else console.log(`  ✅ ${r.disp} | ${r.oks}/${SURFACES.length * ROLLS} ok`);
}
console.log(`\n=== ${Object.keys(results).length} cards | ${failCards} with failures ===`);
