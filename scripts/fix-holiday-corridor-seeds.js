#!/usr/bin/env node
/**
 * fix-holiday-corridor-seeds.js — holiday SOLO seeds that stage the person on a route (path, trail, avenue, street,
 * rows, aisle, dock, covered bridge...) get a spot to stand at instead, in the same place and theme.
 *
 * Why (2026-10-02, Kevin: three fall / Halloween nightlies "all look like a woman walking forward on a path"): the
 * solo prompt's early "set at" line is the seed's first comma-clause (settingClauseOf, <= 12 words), and flux-1.1-pro
 * stages the person on whatever that names. A route there renders one picture: the person centred on it, the route
 * receding behind, trees both sides. Same-seed probe (scratchpad, 4 production prompts x 6 seeds): the shipped seed
 * 20/24 corridor shots; the same place led by a spot (an iron bench beneath the maples, a broken fountain in the
 * vineyard, the porch steps, a forest hollow) 2/24, and the Halloween props the seed named came back (0/6 -> 6/6).
 *
 * Three steps, like the other pool tools (NIGHTLY_POOL_CLEANUP_PLAN.md): a word prefilter, a judge read (does this
 * seed stage the person on a route?), then a rewrite of the flagged rows that keeps the place, the theme, the props
 * and the voice and leads with a spot. Every rewrite is checked in code and then read by hand before any apply.
 *
 *   node scripts/fix-holiday-corridor-seeds.js --holidays fall,halloween --out <dir> [--limit 25] [--sub <theme>]
 *   node scripts/fix-holiday-corridor-seeds.js --from <dir>/rewrites.json --sql <file> [--rollback]   (guarded UPDATEs)
 *   --pools goofy,elegant,active   the YEAR-ROUND pools instead of holiday rows (composition audit 2026-10-02: their
 *              route-first seeds rendered route-staged 36% solo / 43% couple vs 10% without). Those seeds carry their own
 *              voice ("Person at...", "On a cobblestone alley in...") and often the action, and many are routes BY
 *              DESIGN (a scooter race down a Roman street, a rope bridge over a gorge): the judge keeps those, the
 *              rewrite keeps the seed's opening form, action and props and swaps only a route used as a mere stage.
 *
 * Output: <out>/flags.json (every judged row), <out>/rewrites.json (old -> new, checks), before-state included.
 */
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { ask } = require('./lib/poolJudge');
const { callClaude } = require('./lib/anthropic');

const sb = createClient(
  'https://jimftynwrinwenonjrlj.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const arg = (n, d) => {
  const i = process.argv.indexOf('--' + n);
  return i >= 0 ? process.argv[i + 1] : d;
};
const HOLIDAYS = String(arg('holidays', 'fall,halloween')).split(',');
const POOLS = arg('pools', null) ? String(arg('pools')).split(',') : null;
const YEAR_ROUND = !!POOLS;
const OUT = arg('out', null);
const LIMIT = arg('limit', null) ? Number(arg('limit')) : null;
const SUB = arg('sub', null);
const FROM = arg('from', null);
const SQL = arg('sql', null);
const FLAGS = arg('flags', null); // reuse a previous flags.json (skip the judge read)
// --exclude <file>: a rewrites.json (or id list) whose rows are already repaired; never re-read them.
const EXCLUDE = new Set(
  arg('exclude', null)
    ? String(arg('exclude'))
        .split(',')
        .flatMap((f) => JSON.parse(fs.readFileSync(f, 'utf8')))
        .map((r) => (typeof r === 'string' ? r : r.id))
    : []
);
const CONC = 3;
// --table dual: the COUPLE holiday rows (dual_scenarios). Same defect, measured 2026-10-02 in the composition audit
// (NIGHTLY_COMPOSITION_AUDIT_PLAN.md): couples on route-word seeds were route-staged 53-55% vs 12-16% without.
const TABLE = arg('table', 'single') === 'dual' ? 'dual_scenarios' : 'single_scenarios';
const COUPLE = TABLE === 'dual_scenarios';
const WHO = COUPLE ? 'TWO people (a couple)' : 'ONE person';
const WHO_SHORT = COUPLE ? 'the couple' : 'the person';
const SPOT_FOR = COUPLE
  ? 'where two people would naturally be side by side at the same height (never a spot that puts one higher, lower or behind the other, and never a narrow one that squeezes them together: no doorway, window seat, single chair, ladder or staircase)'
  : 'where a lone person would naturally be';
const SPOT_LIST = COUPLE
  ? 'a long bench, a wide gate, a fountain rim, a low stone wall, a fence rail, a balcony or terrace balustrade, the side rail of a footbridge, a long harvest table, a hearth, stacked wine barrels, a row of hay bales, a broad boulder. Good: "Long iron bench beneath arching maples", "Wide wrought-iron gate of a decorated manor", "Stone balustrade above a moonlit garden".'
  : 'a bench, a gate, a fountain rim, porch steps, a stone wall, a fence rail, a boulder, a footbridge\'s side rail, a lamp post, a wine barrel, a potting table, a doorway, a balcony, a hearth, a cider press, a hay bale, a mossy root, a well, a lookout rock. Good: "Wrought-iron gate beneath arching maples", "Stone front steps of a decorated Victorian home", "Hay bale at a torchlit corn maze clearing".';

/** Words that make a route or a receding run of things. Broad on purpose: the judge decides. */
const ROUTE_RE =
  /\b(path|paths|pathway|trail|trails|trailhead|avenue|lane|lanes|road|roads|boulevard|street|streets|alley|alleyway|walkway|promenade|boardwalk|footpath|towpath|causeway|switchbacks?|aisle|aisles|rows|corridor|hallway|tunnel|colonnade|arcade|allee|dock|pier|jetty|platform|covered bridge|bridge|maze|vineyard|orchard|greenhouse|conservatory|sidewalk|sidewalks|parkway|esplanade|passage|passageway|driveway|quay|route|queue|catwalk|cul-de-sac|winding|leading|vanishing|receding|stretching)\b/i;
/** A rewrite must not stage on, or recede along, a route. */
const STAGE_RE =
  /\b(path|paths|pathway|trail|trails|avenue|lane|lanes|road|boulevard|street|alley|alleyway|walkway|promenade|boardwalk|footpath|towpath|causeway|aisle|aisles|rows|corridor|hallway|tunnel|colonnade|allee|pier|jetty|sidewalk|sidewalks|parkway|esplanade|passage|passageway|route|catwalk)\b/i;
const RECEDE_RE =
  /\b(winding|winds|leading|leads|vanishing|vanishes|receding|recedes|disappearing|snaking|meandering|curving away)\b|\bstretch(ing|es)? (away|into|toward|towards|ahead|off)\b/i;

/** One judged call that never kills the run: a reply that will not parse leaves its rows unanswered (they fail the
 *  'empty' check and go to the retry, or stay unflagged), and the error is logged. */
async function safeAsk(system, content, maxTokens) {
  try {
    return await ask(system, content, maxTokens);
  } catch (e) {
    // A stray quote inside one rewrite breaks JSON.parse for the whole array; read the reply line by line instead.
    try {
      const r = await callClaude({ job: 'reseed', system, content, maxTokens, timeoutMs: 180000 });
      const items = [];
      for (const m of r.raw.matchAll(
        /"n"\s*:\s*(\d+)\s*,\s*"(scene|corridor)"\s*:\s*("(?:.*)"|true|false)\s*(?:,\s*"why"\s*:\s*"(.*?)")?\s*}/g
      )) {
        const val =
          m[3] === 'true' || m[3] === 'false'
            ? m[3] === 'true'
            : m[3].slice(1, -1).replace(/\\"/g, '"');
        items.push({ n: Number(m[1]), [m[2]]: val, ...(m[4] ? { why: m[4] } : {}) });
      }
      if (items.length) return items;
    } catch {
      // fall through
    }
    console.error(`  ! call failed (${e.message}); its rows stay unanswered`);
    return [];
  }
}

const firstClause = (scene) => ((String(scene).split(/[;.]/)[0] || '').split(',')[0] || '').trim();

async function liveRows() {
  const rows = [];
  if (YEAR_ROUND) {
    for (const pool of POOLS) {
      for (let from = 0; ; from += 1000) {
        const { data, error } = await sb
          .from(TABLE)
          .select(
            COUPLE
              ? 'id, pool, category, sub_theme, scene, attire, action'
              : 'id, pool, category, sub_theme, gender, scene, attire, action'
          )
          .eq('pool', pool)
          .eq('disabled', false)
          .order('id', { ascending: true })
          .range(from, from + 999);
        if (error) throw new Error(error.message);
        rows.push(...data);
        if (data.length < 1000) break;
      }
    }
    return rows;
  }
  for (const holiday of HOLIDAYS) {
    for (let from = 0; ; from += 1000) {
      let q = sb
        .from(TABLE)
        .select(
          COUPLE
            ? 'id, category, sub_theme, scene, attire'
            : 'id, category, sub_theme, gender, scene, attire'
        )
        .eq('pool', 'holiday')
        .eq('category', holiday)
        .eq('disabled', false)
        .order('id', { ascending: true })
        .range(from, from + 999);
      if (SUB) q = q.eq('sub_theme', SUB);
      const { data, error } = await q;
      if (error) throw new Error(error.message);
      rows.push(...data);
      if (data.length < 1000) break;
    }
  }
  return rows;
}

const FLAG_SYSTEM = `You review seeds for an AI dream-image engine. Each seed is a short scene for ${WHO}, rendered tall (9:16) and shown from the knees up, facing the viewer. The image model stages ${WHO_SHORT} on whatever the seed's first words name.

The defect: a seed that stages the person ON A ROUTE renders the same picture every time: the person centred on a path, trail, avenue, street, lane, boardwalk, dock, bridge deck, aisle, hallway or between rows (vines, pumpkins, corn, trees, shelves), with the route receding behind them to a vanishing point. Flag a seed when a route or a run of rows is its stage or a prominent feature the person would naturally stand on: it is named in the first clause, OR the seed describes it winding, leading, vanishing or stretching away, OR the place itself is a corridor (a greenhouse aisle, a vineyard, an orchard row, a corn maze, a covered bridge, a train platform, a dock).

Do NOT flag a seed whose route is only a small incidental detail far from the person (a distant road on a hillside, a mention of "Main Street" as the town's name while the scene is a shop interior, "rows of jars" on a shelf), or whose stage is clearly a spot that is not a route (a porch, a table, a hearth, a bench, a fountain, a window seat).

Reply with ONLY a JSON array, one object per seed: {"n": <number>, "corridor": true|false, "why": "<5-12 words>"}.`;

const YR_FLAG_SYSTEM = `You review seeds for an AI dream-image engine. Each seed is a short scene for ${WHO}, rendered tall (9:16) and shown from the knees up, facing the viewer. The image model stages ${WHO_SHORT} on whatever the seed's first words name.

The defect: a seed whose STAGE is a route renders the same picture every time: ${WHO_SHORT} standing centred on a street, alley, lane, path, avenue, boardwalk, garden walk, aisle or hallway, with the route receding behind to a vanishing point. Flag a seed when ${WHO_SHORT} would simply be standing or posing on the route: it is named in the first clause as where they are ("On a cobblestone alley in Notting Hill", "Flower-strewn parterre garden with gravel paths", "Rain-slick megacity back alley"), or the seed describes it winding, leading or stretching away from them.

Do NOT flag:
- a seed where the route IS the activity or the adventure: racing, riding, skating, chasing or parading along it, crossing a rope bridge over a gorge, a runway walk, a bobsled run, a scooter race down a street. That movement is the dream; it stays.
- a seed where the word is not a route: "a lane apart", a bowling alley lane, rows of seats in a theatre, a ship's command bridge, rows of jars on a shelf, a street name used as an address while the stage is a shop, a room or a terrace.
- a seed whose stage is clearly a spot that is not a route (a balcony, a table, a terrace, a fountain, a bench, a stage, a car roof).

Reply with ONLY a JSON array, one object per seed: {"n": <number>, "corridor": true|false, "why": "<5-12 words>"}.`;

const YR_REWRITE_SYSTEM = `You repair seeds for an AI dream-image engine. Each seed is a short scene for ${WHO}, rendered tall and knees-up, facing the viewer. These seeds put ${WHO_SHORT} on a route as a mere stage, so every render comes out as the same picture: centred on a street or path, the route receding behind. Rewrite each seed so ${WHO_SHORT} has a SPOT to be at in the same place instead.

Rules:
1. Same place, same mood and light, same category, and keep EVERY action, prop, outfit cue, creature and detail the seed names (a held lantern, a plasma rifle, a waving bigfoot, the bougainvillea). Keep what gives the place its character (pastel townhouses, neon signs, the machiya facades): only the route's geometry goes. Never add people, never add a new action.
2. Keep the seed's OWN opening form: if it opens "Person at ...", keep "Person at ..."; if it opens "On a ..." or "In a ...", keep that preposition; if it opens with a bare noun phrase, keep a bare noun phrase. Only the route noun in that opening changes to ONE specific spot in the same place, ${SPOT_FOR}: ${SPOT_LIST.split(' Good:')[0]} Example: "On a cobblestone alley in Notting Hill, pastel townhouses..." -> "On a garden-wall bench in Notting Hill, pastel townhouses...".
3. The spot is off the route and does not look down it: a bench at the edge, a doorstep, a fountain rim, a railing, a cafe table, not the middle of the street.
4. No route anywhere as a stage (no path, lane, alley, street, avenue, walkway, boardwalk, aisle, corridor, hallway as where they are), and nothing winding, leading, vanishing, receding or stretching away. The street may stay once as scenery after the opening ("beside a lantern-lit Gion street"), never receding.
5. Same voice and format, no camera words, no "you", similar length (within 25% of the original word count).

Reply with ONLY a JSON array: {"n": <number>, "scene": "<rewritten seed>"}.`;

const REWRITE_SYSTEM = `You repair seeds for an AI dream-image engine. Each seed is a short scene for ${WHO}, rendered tall and knees-up, facing the viewer. These seeds stage ${WHO_SHORT} on a route, so every render comes out as the same picture: the person centred on a path or between rows, the route receding behind. Rewrite each seed so the person has a SPOT to be at instead.

Rules:
1. Same place, same holiday theme, same mood and light, and keep every prop, creature and decoration the seed names (jack-o-lanterns, lanterns, leaves, fog, moon, barrels...). Keep what gives the place its character (arching maples over an avenue, decorated Victorian homes on a street, towering stalks in a corn maze, granite spires above a ridge): only the route's geometry goes. Never add people.
2. The FIRST clause (before the first comma, at most 12 words) is a NOUN PHRASE naming ONE specific spot in that place, ${SPOT_FOR}: ${SPOT_LIST} Never start with a pose or a preposition (no "Leaning against", "Seated on", "Standing at", "Perched on", "Atop", "At the", "Beside") and never name a person in any way: the person and the pose are added later by other code.
3. The spot is off the route and does not look down it: a bench under the trees, not the middle of the avenue; the side rail of a bridge, not its entrance; a clearing in the maze, not a passage.
4. No route anywhere as a stage: no path, trail, lane, avenue, road, boulevard, street, alley, walkway, promenade, boardwalk, footpath, aisle, rows, corridor, hallway, tunnel, colonnade, pier or jetty, and nothing winding, leading, vanishing, receding or stretching away. Only when the route IS the theme (a switchback hike, a horseback trail, a train platform, a trick-or-treat street, a leaf-storm avenue) may it appear ONCE, after the first clause, as something beside the spot ("beside the switchback trail"), never receding.
5. Keep the seed's own voice and format: comma-separated scene phrases, no camera words, no "you", similar length (within 25% of the original word count).

Reply with ONLY a JSON array: {"n": <number>, "scene": "<rewritten seed>"}.`;

/** --light: seeds the judge passed (their stage is already a spot) that still NAME a route or rows somewhere. The
 *  2026-10-02 porch seed ("jack-o-lanterns creating a luminous path") and the vineyard seed both rendered the
 *  corridor shot in production with the route only mid-seed, so the route phrase goes; the rest stays word for word. */
const LIGHT_SYSTEM = `You repair seeds for an AI dream-image engine. Each seed is a short scene for ${WHO}, rendered tall and knees-up, facing the viewer. When a seed names a route anywhere (a path, trail, lane, walk, street, aisle, dock running out, or rows of vines, pumpkins or corn), the image model stages the person on it and every render becomes the same picture: the person centred on the route, which recedes behind them.

Edit each seed as little as possible:
1. Reword ONLY the phrase that names the route so it becomes a non-route detail of the same place (a luminous path of jack-o-lanterns -> jack-o-lanterns glowing along the porch rail; vineyard rows -> vines heavy on the trellis; a stone path through the garden -> stones mossy underfoot). Keep every other word, prop and the order.
2. If the first clause (before the first comma) is a vineyard, orchard, field or other place whose shape is rows, and the seed names a feature someone could stand at (a fountain, barrel, press, gate, wall), move that feature to the front: "Broken stone fountain in a haunted autumn vineyard, ...".
3. If the route word is not a route (rows of candles on a table, a building on Main Street seen from a window), return the seed UNCHANGED.
4. Never add people, poses or camera words.

Reply with ONLY a JSON array: {"n": <number>, "scene": "<edited seed>"}.`;
const LIGHT = process.argv.includes('--light');
const rewriteSystem = () =>
  LIGHT ? LIGHT_SYSTEM : YEAR_ROUND ? YR_REWRITE_SYSTEM : REWRITE_SYSTEM;

const POSE_START_RE =
  /^(leaning|seated|sitting|standing|resting|perched|paused|kneeling|crouched|crouching|lounging|atop|on|at|in|by|beside|near|under|beneath|inside|against)\b/i;
const PERSON_RE =
  /\b(person|someone|figure|traveler|traveller|visitor|guest|she|he|her|his|they|their)\b/i;

function check(oldScene, scene) {
  const fc = firstClause(scene);
  const issues = [];
  if (!scene) issues.push('empty');
  // Year-round seeds carry their own voice ("Person at ...", "On a ..."): only a NEW pose or person is a defect.
  const oldFc = firstClause(oldScene);
  if (POSE_START_RE.test(fc) && !(YEAR_ROUND && POSE_START_RE.test(oldFc)))
    issues.push(`first clause opens with a pose/preposition: ${fc.split(/\s+/)[0]}`);
  if (PERSON_RE.test(scene) && !(YEAR_ROUND && PERSON_RE.test(oldScene)))
    issues.push(`names a person: ${scene.match(PERSON_RE)[0]}`);
  // The solo/couple "set at" line is the first clause cut to 12 words (settingClauseOf). Year-round openings are often
  // longer than 12 words by design, so there only a clause that GREW is flagged.
  const fcWords = fc.split(/\s+/).length;
  const oldFcWords = oldFc.split(/\s+/).length;
  if (fcWords > (YEAR_ROUND ? Math.max(12, oldFcWords) : 12))
    issues.push(`first clause ${fcWords} words`);
  const setAt = fc.split(/\s+/).slice(0, 12).join(' ');
  if (STAGE_RE.test(setAt)) issues.push(`route in first clause: ${setAt.match(STAGE_RE)[0]}`);
  if (RECEDE_RE.test(scene)) issues.push(`recede word: ${scene.match(RECEDE_RE)[0]}`);
  const stageHits = (scene.match(new RegExp(STAGE_RE.source, 'gi')) || []).length;
  if (stageHits > 1) issues.push(`${stageHits} route words`);
  // The theme must survive: most content words of the old first clause (minus route words) reappear somewhere.
  const stem = (w) =>
    w
      .toLowerCase()
      .replace(/[^a-z]/g, '')
      .slice(0, 5);
  const keep = firstClause(oldScene)
    .split(/[\s-]+/)
    .filter(
      (w) =>
        w.length >= 4 &&
        !STAGE_RE.test(w) &&
        !ROUTE_RE.test(w) &&
        !/^(with|from|into|through|where|under|over|beneath|beside|along|near)$/i.test(w)
    )
    .map(stem);
  const have = new Set(scene.split(/[\s,.-]+/).map(stem));
  const kept = keep.filter((k) => have.has(k)).length;
  if (keep.length >= 2 && kept / keep.length < 0.5)
    issues.push(`theme words lost (${kept}/${keep.length} of "${firstClause(oldScene)}")`);
  const ow = String(oldScene).split(/\s+/).length;
  const nw = scene.split(/\s+/).length;
  if (nw < ow * 0.7 || nw > ow * 1.35) issues.push(`length ${ow} -> ${nw}`);
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
  if (FROM && process.argv.includes('--recheck')) {
    // Re-run the code checks on a rewrites file (after a check changed or rows were edited by hand), no LLM call.
    const rows = JSON.parse(fs.readFileSync(FROM, 'utf8'));
    for (const r of rows) r.issues = check(r.old, r.scene);
    fs.writeFileSync(FROM, JSON.stringify(rows, null, 1));
    console.log(`rechecked ${rows.length}, failing ${rows.filter((r) => r.issues.length).length}`);
    return;
  }
  if (FROM && SQL) return writeSql();
  if (!OUT) throw new Error('--out <dir> is required');
  fs.mkdirSync(OUT, { recursive: true });
  const rows = await liveRows();
  let cands = rows.filter((r) => ROUTE_RE.test(r.scene) && !EXCLUDE.has(r.id));
  console.log(`live ${TABLE} rows ${rows.length}, prefilter ${cands.length}`);

  // 1. Judge read, 40 per call (or a previous read, re-checked against the live text).
  const live = new Map(rows.map((r) => [r.id, r]));
  const judged = FLAGS
    ? JSON.parse(fs.readFileSync(FLAGS, 'utf8')).filter(
        (r) => live.has(r.id) && live.get(r.id).scene === r.scene
      )
    : (
        await pool(chunks(cands, 40), async (batch) => {
          const list = batch.map((r, i) => `${i + 1}. ${r.scene}`).join('\n');
          const reply = await safeAsk(YEAR_ROUND ? YR_FLAG_SYSTEM : FLAG_SYSTEM, list, 4000);
          return batch.map((r, i) => {
            const v = reply.find((x) => x && x.n === i + 1);
            return { ...r, corridor: !!(v && v.corridor), why: (v && v.why) || '(no verdict)' };
          });
        })
      ).flat();
  if (!FLAGS) fs.writeFileSync(path.join(OUT, 'flags.json'), JSON.stringify(judged, null, 1));
  let flagged = LIGHT
    ? judged.filter(
        (r) =>
          !r.corridor &&
          (STAGE_RE.test(r.scene) || /\bvineyard\b|\b(orchard|corn|pumpkin) rows\b/i.test(r.scene))
      )
    : judged.filter((r) => r.corridor);
  console.log(`judge flagged ${flagged.length} of ${judged.length}`);
  if (LIMIT) flagged = flagged.slice(0, LIMIT);

  // 2. Rewrite, 12 per call (same sub-theme together so spots vary within a theme).
  flagged.sort((a, b) =>
    `${a.category}:${a.sub_theme}`.localeCompare(`${b.category}:${b.sub_theme}`)
  );
  const rewrites = (
    await pool(chunks(flagged, 12), async (batch) => {
      const list = batch
        .map((r, i) => `${i + 1}. [${r.category} / ${r.sub_theme || r.pool}] ${r.scene}`)
        .join('\n');
      let reply = await safeAsk(rewriteSystem(), list, 8000);
      const out = batch.map((r, i) => {
        const v = reply.find((x) => x && x.n === i + 1);
        const scene = v && typeof v.scene === 'string' ? v.scene.trim() : '';
        return {
          id: r.id,
          pool: r.pool || 'holiday',
          category: r.category,
          sub_theme: r.sub_theme,
          gender: r.gender,
          why: r.why,
          old: r.scene,
          scene,
          issues: check(r.scene, scene),
        };
      });
      // One retry for rows whose rewrite failed a check, with the issue named.
      const bad = out.filter((o) => o.issues.length);
      if (bad.length) {
        const list2 = bad
          .map(
            (o, i) =>
              `${i + 1}. [${o.category} / ${o.sub_theme || o.pool}] ${o.old}\n   (your last try broke a rule: ${o.issues.join('; ')})`
          )
          .join('\n');
        reply = await safeAsk(rewriteSystem(), list2, 8000);
        bad.forEach((o, i) => {
          const v = reply.find((x) => x && x.n === i + 1);
          const scene = v && typeof v.scene === 'string' ? v.scene.trim() : '';
          const issues = check(o.old, scene);
          if (scene && issues.length <= o.issues.length) {
            o.scene = scene;
            o.issues = issues;
          }
        });
      }
      return out;
    })
  ).flat();
  fs.writeFileSync(path.join(OUT, 'rewrites.json'), JSON.stringify(rewrites, null, 1));
  const failing = rewrites.filter((r) => r.issues.length);
  console.log(`rewrites ${rewrites.length}, failing checks ${failing.length}`);
  for (const r of failing) console.log(`  ✗ ${r.sub_theme}: ${r.issues.join('; ')}`);
}

/** Guarded UPDATEs: a row changes only if it still holds the text that was read (a concurrent edit is skipped). */
function writeSql() {
  const rows = JSON.parse(fs.readFileSync(FROM, 'utf8')).filter(
    (r) => r.apply !== false && r.scene && r.scene !== r.old && !r.issues.length
  );
  const lit = (s) => `'${String(s).replace(/'/g, "''")}'`;
  // --rollback writes the reverse (new -> old), guarded the same way.
  const back = process.argv.includes('--rollback');
  const lines = rows.map((r) => {
    const [to, from] = back ? [r.old, r.scene] : [r.scene, r.old];
    return `UPDATE public.${TABLE} SET scene = ${lit(to)} WHERE id = ${lit(r.id)} AND pool = ${lit(r.pool || 'holiday')} AND scene = ${lit(from)};`;
  });
  fs.writeFileSync(SQL, lines.join('\n') + '\n');
  console.log(`${lines.length} guarded updates -> ${SQL}`);
}

main().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
