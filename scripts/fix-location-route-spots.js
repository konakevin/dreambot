#!/usr/bin/env node
/**
 * fix-location-route-spots.js — location spots that stage a cast dream ON a route (a street, boardwalk, avenue, trail,
 * promenade, shrine approach) get a spot BESIDE it instead, keeping the place (NIGHTLY_COMPOSITION_AUDIT_PLAN.md).
 *
 * Why (composition audit, 2026-10-02): a location dream's "set at" line is the whole spot text, and flux stages the
 * person on what it names first. Solo location dreams on route-word spots rendered the person centred on the route 29%
 * vs 10% without. Render test on Kevin's account (10 route spots x orig/new x 2, real nightly-dreams via
 * force_slot_input): route-staged 12/20 -> 4/20, swaps 20/20 both arms. The misses kept a generic route noun in front
 * ("on Adare village main street") or put the spot ON the route (a torii gate across the approach); the rules were
 * tightened and a second round (12 new spots x 2) went 18/24 -> 0/24, swaps 24/24. Applied as migration 661 (923 spots,
 * every rewrite read, ~85 by hand). Read the output for receding clauses ("path curving away") and for a card whose
 * rewrites all open the same way (race-track-garage -> "pit wall", excluded with `apply: false`).
 *
 * A spot that is also a scene-only postcard (pure_scene_eligible) keeps its text for postcards: the row is switched
 * off for cast dreams and a NEW cast-only row carries the rewrite. A cast-only spot is rewritten in place.
 *
 *   node scripts/fix-location-route-spots.js --out <dir> [--limit N]            judge + rewrite -> <dir>/rewrites.json
 *   node scripts/fix-location-route-spots.js --from <dir>/rewrites.json --sql <file> [--rollback]
 */
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { ask } = require('./lib/poolJudge');

const sb = createClient(
  'https://jimftynwrinwenonjrlj.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const arg = (n, d) => {
  const i = process.argv.indexOf('--' + n);
  return i >= 0 ? process.argv[i + 1] : d;
};
const OUT = arg('out', null);
const FROM = arg('from', null);
const SQL = arg('sql', null);
const LIMIT = arg('limit', null) ? Number(arg('limit')) : null;
const CONC = 3;

const ROUTE_RE =
  /\b(street|streets|streetscape|boardwalk|avenue|boulevard|promenade|colonnade|colonnaded|corridor|trail|lane|road|walkway|pathway|path|alley|esplanade|arcade)\b/i;
const GENERIC_ROUTE_RE =
  /\b(main street|street|streets|streetscape|boardwalk|avenue|boulevard|promenade|colonnade|corridor|trail|lane|road|walkway|pathway|path|alley|esplanade|arcade|approach)\b/i;

async function safeAsk(system, content, maxTokens) {
  try {
    return await ask(system, content, maxTokens);
  } catch (e) {
    console.error(`  ! call failed (${e.message}); its rows stay unanswered`);
    return [];
  }
}

const FLAG_SYSTEM = `You review location spots for an AI dream-image engine. Each spot names a real or imagined place where a person (or a couple) is shown from the knees up, facing the viewer, in a tall image. The image model stages the person on whatever the spot's first words name.

The defect: a spot that stages the person ON A ROUTE renders the same picture every time: the person centred on a street, boardwalk, avenue, trail, promenade, lane, path, arcade, colonnade or shrine approach, with the route receding behind them to a vanishing point. Flag a spot when the route is what it shows (a shopping street, a boardwalk, a trail, an avenue of trees, a pedestrian promenade, a colonnade walk).

Do NOT flag a spot whose route word is only an address or a name of something else ("City Hall on St Andrews Road", "Castle Clinton at Battery Park"), or whose stage is clearly a building, a view, a plaza, a beach or a room.

Reply with ONLY a JSON array: {"n": <number>, "route": true|false, "why": "<5-12 words>"}.`;

const REWRITE_SYSTEM = `You repair location spots for an AI dream-image engine. Each spot names a place where a person is shown knees-up, facing the viewer, in a tall image. These spots stage the person ON a route (a street, boardwalk, trail, avenue, promenade), so every render is the same picture: the person centred on it, the route receding behind. Rewrite each spot so the person has a SPOT BESIDE the route instead.

Rules:
1. Keep every proper name exactly as written (Rodeo Drive, Moshup Trail, Royal Palm Way, Third Street Promenade, Meiji Jingu): the spot must still be unmistakably that place.
2. Start with a NOUN PHRASE naming one specific spot a person would stand at, off the route: a boutique doorway, a cafe table, a bench, a fountain edge, a railing, a lookout boulder, a cottage doorway, a shrine's stone lantern, a lamp post, a garden wall. Never a gate, arch or torii standing ACROSS the route (that puts the person in the middle of it again), never a pose, never a person.
3. Generic route words that are not part of a name (main street, path, trail, avenue, lane, walkway, approach, boardwalk) do not appear in front. Either drop them or keep the place's character as scenery after the spot ("palm-lined", "thatched-roof cottages").
4. Same voice as the original: a short noun phrase, 6 to 18 words, no camera words, no "you". Similar length.
Examples of the shape (never copy them): "Clifftop boulder above the Aquinnah coast beside Moshup Trail"; "Stone bench beneath the royal palms of Royal Palm Way".

Reply with ONLY a JSON array: {"n": <number>, "spot": "<rewritten spot>"}.`;

function check(oldSpot, spot) {
  const issues = [];
  if (!spot) issues.push('empty');
  const words = spot.split(/\s+/).length;
  if (words < 5 || words > 20) issues.push(`length ${words}`);
  // Proper names (capitalised runs) of the old spot must survive.
  const names = (
    oldSpot.match(/\b[A-Z][\w'’-]*(?:\s+(?:of|de|la|du|the|and)?\s*[A-Z][\w'’-]*)*/g) || []
  ).filter((n) => n.length > 3 && !/^(The|A|An)$/.test(n));
  const lost = names.filter((n) => !spot.includes(n.split(/\s+/)[0]));
  if (lost.length) issues.push(`names lost: ${lost.join(' / ')}`);
  const lead = spot.split(/\s+/).slice(0, 4).join(' ');
  if (GENERIC_ROUTE_RE.test(lead))
    issues.push(`route word in front: ${lead.match(GENERIC_ROUTE_RE)[0]}`);
  if (
    /^(leaning|seated|sitting|standing|walking|resting|perched|atop|on|at|in|by|beside|near|under)\b/i.test(
      spot
    )
  )
    issues.push('opens with a pose/preposition');
  if (/\b(torii|archway|arch|gate)\b/i.test(lead))
    issues.push('a gate/arch in front (may span the route)');
  return issues;
}

async function pool(items, fn) {
  const out = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: CONC }, async () => {
      while (i < items.length) {
        const k = i++;
        out[k] = await fn(items[k], k);
      }
    })
  );
  return out;
}
const chunks = (arr, n) =>
  Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n));

async function main() {
  if (FROM && SQL) return writeSql();
  if (!OUT) throw new Error('--out <dir> is required');
  fs.mkdirSync(OUT, { recursive: true });
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await sb
      .from('location_iconic_spots')
      .select(
        'id, location_key, spot_text, spot_kind, quality_tier, pure_scene_eligible, character_eligible'
      )
      .eq('is_active', true)
      .eq('character_eligible', true)
      .order('id', { ascending: true })
      .range(from, from + 999);
    if (error) throw new Error(error.message);
    rows.push(...data);
    if (data.length < 1000) break;
  }
  const cands = rows.filter((r) => ROUTE_RE.test(r.spot_text));
  console.log(`cast-eligible spots ${rows.length}, prefilter ${cands.length}`);
  const judged = (
    await pool(chunks(cands, 50), async (batch) => {
      const reply = await safeAsk(
        FLAG_SYSTEM,
        batch.map((r, i) => `${i + 1}. [${r.location_key}] ${r.spot_text}`).join('\n'),
        5000
      );
      return batch.map((r, i) => {
        const v = reply.find((x) => x && x.n === i + 1);
        return { ...r, route: !!(v && v.route), why: (v && v.why) || '(no verdict)' };
      });
    })
  ).flat();
  fs.writeFileSync(path.join(OUT, 'flags.json'), JSON.stringify(judged, null, 1));
  let flagged = judged.filter((r) => r.route);
  console.log(`judge flagged ${flagged.length} of ${judged.length}`);
  if (LIMIT) flagged = flagged.slice(0, LIMIT);
  flagged.sort((a, b) => a.location_key.localeCompare(b.location_key));
  const rewrites = (
    await pool(chunks(flagged, 15), async (batch) => {
      const list = batch.map((r, i) => `${i + 1}. [${r.location_key}] ${r.spot_text}`).join('\n');
      const reply = await safeAsk(REWRITE_SYSTEM, list, 5000);
      const out = batch.map((r, i) => {
        const v = reply.find((x) => x && x.n === i + 1);
        const spot = v && typeof v.spot === 'string' ? v.spot.trim().replace(/\.$/, '') : '';
        return { ...r, old: r.spot_text, spot, issues: check(r.spot_text, spot) };
      });
      const bad = out.filter((o) => o.issues.length);
      if (bad.length) {
        const list2 = bad
          .map(
            (o, i) =>
              `${i + 1}. [${o.location_key}] ${o.old}\n   (your last try broke a rule: ${o.issues.join('; ')})`
          )
          .join('\n');
        const reply2 = await safeAsk(REWRITE_SYSTEM, list2, 4000);
        bad.forEach((o, i) => {
          const v = reply2.find((x) => x && x.n === i + 1);
          const spot = v && typeof v.spot === 'string' ? v.spot.trim().replace(/\.$/, '') : '';
          const issues = check(o.old, spot);
          if (spot && issues.length <= o.issues.length) {
            o.spot = spot;
            o.issues = issues;
          }
        });
      }
      return out;
    })
  ).flat();
  fs.writeFileSync(path.join(OUT, 'rewrites.json'), JSON.stringify(rewrites, null, 1));
  console.log(
    `rewrites ${rewrites.length}, failing checks ${rewrites.filter((r) => r.issues.length).length}`
  );
}

/** Cast-only spot: rewrite in place. Shared with postcards: switch the row off for cast and insert a cast-only twin.
 *  Every statement guarded on the text that was read. --rollback reverses both. */
function writeSql() {
  const rows = JSON.parse(fs.readFileSync(FROM, 'utf8')).filter(
    (r) => r.apply !== false && r.spot && r.spot !== r.old && !r.issues.length
  );
  const lit = (s) =>
    s === null || s === undefined ? 'NULL' : `'${String(s).replace(/'/g, "''")}'`;
  const back = process.argv.includes('--rollback');
  const lines = [];
  for (const r of rows) {
    if (r.pure_scene_eligible) {
      if (back) {
        lines.push(
          `DELETE FROM public.location_iconic_spots WHERE location_key = ${lit(r.location_key)} AND spot_text = ${lit(r.spot)} AND pure_scene_eligible = false;`
        );
        lines.push(
          `UPDATE public.location_iconic_spots SET character_eligible = true WHERE id = ${lit(r.id)};`
        );
      } else {
        lines.push(
          `UPDATE public.location_iconic_spots SET character_eligible = false WHERE id = ${lit(r.id)} AND spot_text = ${lit(r.old)} AND character_eligible = true;`
        );
        lines.push(
          `INSERT INTO public.location_iconic_spots (location_key, spot_text, spot_kind, quality_tier, is_active, pure_scene_eligible, character_eligible) ` +
            `SELECT ${lit(r.location_key)}, ${lit(r.spot)}, ${lit(r.spot_kind)}, ${lit(r.quality_tier)}, true, false, true ` +
            `WHERE NOT EXISTS (SELECT 1 FROM public.location_iconic_spots WHERE location_key = ${lit(r.location_key)} AND spot_text = ${lit(r.spot)});`
        );
      }
    } else {
      const [to, from] = back ? [r.old, r.spot] : [r.spot, r.old];
      lines.push(
        `UPDATE public.location_iconic_spots SET spot_text = ${lit(to)} WHERE id = ${lit(r.id)} AND spot_text = ${lit(from)};`
      );
    }
  }
  fs.writeFileSync(SQL, lines.join('\n') + '\n');
  console.log(`${rows.length} spots, ${lines.length} guarded statements -> ${SQL}`);
}

main().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
