#!/usr/bin/env node
/**
 * Builds the HTML cut-sheet for the Sept-2026 new-paths push: every shadow path
 * with its own test renders, grouped by round, so Kevin can decide which paths
 * stay.
 *
 * WHY THIS READS `uploads` AND NOT `bot_run_log`
 * `bot_run_log` looked like the obvious source (it has bot_name + path + status
 * on one row) but it is INCOMPLETE: `acorn-boat-regatta` has 24 renders in
 * `uploads` and ZERO rows in `bot_run_log`. `uploads` is also the table the app
 * itself reads, so building from it means this sheet shows exactly what the
 * in-app shadow view shows. Path lives at `recipe->>path`.
 *
 * BATCHES ARE DERIVED, NOT STORED. Nothing records "this was round 2" — the
 * `--label roundN` passed to iter-bot is not persisted anywhere — so batches are
 * inferred by clustering `created_at` (see ROUND_GAP_MIN for the measured
 * threshold). The sheet says so on its face rather than presenting a guess as
 * fact. It lands on the true QA rounds for most paths ([6,6,6] / [5,5,5]) but a
 * path with retries shows extra small batches, which is why the expanded one is
 * the last batch with >= SUBSTANTIAL_BATCH renders rather than simply the last:
 * `star-charting` ends on four batches of 1-2 retries, and focusing there would
 * have hidden the round.
 *
 * The last substantial batch is the one to grade (Kevin's rule). One path is an
 * exception where a LATER round scored worse for a known reason; it is pinned
 * via GRADES[].bestRound = 'penultimate' and the sheet explains why on the card
 * rather than silently reordering.
 *
 * Usage:  node scripts/build-new-paths-review-sheet.js [--out <path>] [--open]
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

/**
 * Minutes of quiet that separate one render batch from the next.
 *
 * MEASURED, not guessed. My first attempt used 20 and collapsed every path into
 * a single batch, because the agents turned rounds around fast. The real gap
 * distribution on `sheep-shearing-day` is
 *   0,0,0,0,0,0, [10], 0,0,0,0,0, [3], 0,0,0,0,0
 * i.e. three clean groups of six, and on `observatory-tower`
 *   0,1,1,1,1, [4], 1,1,0,1, [3], 1,1,1,1
 * i.e. three groups of five. Within-batch gaps are 0-1 min and between-batch
 * gaps are 3-10, so 2 is comfortably inside that margin. At 2 min most paths
 * land on exactly [6,6,6] / [5,5,5] / [6,6,6,6]; at 3 min several merge wrongly.
 */
const ROUND_GAP_MIN = 2;

/** A batch this small is a retry or a one-off probe, not a QA round to judge. */
const SUBSTANTIAL_BATCH = 3;

const PAGE = 1000;

/**
 * My grades and notes, transcribed from PATHS_REVIEW.md so the sheet is
 * self-contained. `bestRound` is set ONLY where the final round is not the one
 * to judge, and `why` says why — otherwise the sheet would quietly disagree
 * with the review doc.
 */
const GRADES = {
  'undergrowth-scale': { g: 4.8, what: 'the forest floor at ankle height, where a fern is a column' },
  'brass-glasshouse': { g: 4.75, what: "the bot's first green/wet/translucent interior" },
  'puppet-theatre': { g: 4.7, what: 'a proscenium as a whole framing language' },
  'volcano-forge': { g: 4.7, what: 'the classic game-splash forge interior' },
  'mushroom-apothecary': { g: 4.7, what: 'a remedy shop inside a giant mushroom' },
  'den-and-burrow': { g: 4.7, what: 'the hero is the unseen underground' },
  'alpine-wildflower-meadow': { g: 4.67, what: 'altitude as a physical fact, not a backdrop' },
  'castle-town-gate': { g: 4.64, what: 'arrival at a fortified threshold' },
  'courtship-display': { g: 4.6, what: 'dinosaur BEHAVIOUR, the wildlife-documentary money shot' },
  'onsen-evening': { g: 4.6, what: 'a hot spring at dusk' },
  'floating-market-canal': { g: 4.52, what: 'a canal town where the market IS boats' },
  'star-charting': { g: 4.5, what: "fae astronomers; the bot's first night sky" },
  'snow-globe-world': { g: 4.47, what: 'a whole world inside the glass' },
  'orchid-cloud-forest': {
    g: 4.42,
    what: 'a wet vertical wall of epiphytes',
    lever: 'orchids scatter like stickers instead of clumping, and a pale sky patch survives. Delete template prose so both clauses move into the attended half',
  },
  'sheep-shearing-day': {
    g: 4.4,
    what: 'shearing day in the shed',
    lever: 'the bare shorn body lands 5 of 6; put that clause in the framing block too',
  },
  'amber-forest': {
    g: 4.4,
    what: 'resin as a lens you see things through',
    lever: '~1 in 4 renders the resin OPAQUE, losing the lens half of the premise. The clean-medium opt-out is already applied',
  },
  'apiary-beekeeping': {
    g: 4.37,
    what: 'beekeeping up close',
    lever: "Replicate's filter trips on ~12% (3 of 26)",
    warn: 'This grade PREDATES a half-applied fix I closed on 2026-09-23 (an inflator was still in the output order). The renders below are the honest record of what rendered; the fix is unverified.',
  },
  'balloon-festival': {
    g: 4.27,
    what: 'a mass ascension',
    lever: '~1 in 6 goes wide-and-distant and loses the scale ruler, saturation and text control at once. Purge the camera pool by frame-size',
  },
  'observatory-tower': {
    g: 4.26,
    what: "an astronomer's tower, dome slot open to the night",
    lever: 'long rolls push `reading_tool` and `room_dressing` off the end, and those two axes are exactly what the bare-walled renders were missing',
  },
  'rooftop-telegraph': {
    g: 4.2,
    what: 'signal towers above the rooftops',
    lever: 'the vantage reaches only 1 of 6 prompts, and that render is the best one. Give it its own output-order item',
  },
  'honey-harvest': {
    g: 4.2,
    what: "fae robbing a wild hive; the bot's first foraging path",
    lever: 'beat the naked-cherub trap 6/6 first try by opening with a fae AT WORK mid-movement',
  },
  'autumn-seed-gathering': {
    g: 4.15,
    what: 'fae working the autumn seed harvest, hanging off pods in a gale',
    lever: 'delete one output-order item so the pod mechanism and the backlit halo move into the attended half',
    bestRound: 'last',
    why: 'Biggest arc of the run (2.27 → 4.15). The EARLIER rounds are the pale, sober batches — judge the final round only.',
  },
  'coastal-cliff-bloom': {
    g: 4.13,
    what: 'wind-pruned bloom on a sea cliff',
    lever: 'the postcard vista in ~4 of 6, and NOT beatable by wording. Halve a 6.6 KB template',
  },
  'tidal-flat-tracks': {
    g: 4.02,
    what: 'the giant has already walked through: filling trackways, the flat as a mirror',
    lever: 'purge the 6 pool entries describing a continuous furrow rather than discrete hollows (4.19 vs 2.83 mean)',
    bestRound: 'penultimate',
    why: 'GRADE ROUND 2, NOT 3. Round 3\'s fix was correct (it killed the grey frames) but a separate 3-entry sky defect rolled twice and cost the round.',
  },
  'game-center-arcade': {
    g: 4.0,
    what: "the bot's first true interior-night path",
    lever: 'lettering survives in the compressed background band; fill it with a named physical mass',
  },
  'hay-baling-summer': {
    g: 3.97,
    what: 'high-summer haymaking, the field half-cut',
    lever: 'one light family of six averages 2.5 against 3.0-4.3, because its own wording says "lies flat" and "bleached" — five entries to reword',
  },
  'lambing-season': {
    g: 3.92,
    what: 'lambing in the cold',
    lever: '~4 `light` entries described as "even" produce every sober frame; rewriting those is one edit',
  },
  'ice-cavern': {
    g: 3.8,
    what: 'a voxel ice interior',
    lever: 'a stone-masonry drift I deliberately did not chase, because naming the enclosure was itself the earlier fix for voxel looks rendering a void',
  },
  'sand-toy-beachworks': {
    g: 3.5,
    what: 'sand engineering as an epic, where the toys are the tools',
    lever: 'the toys still render factory-fresh; the fix is six words moved to the front of the prefix',
  },
  'archaeology-dig': {
    g: 3.45,
    what: 'a LEGO excavation, the trench cut open',
    lever: 'ONE pool entry of 25 is eating the hero — a giant ladder, while the trench already contains an ordinary one, so the model renders the ordinary one and drops the find',
  },
  'acorn-boat-regatta': {
    g: 3.07,
    what: "the bot's first action path",
    lever: '`honey-harvest` later beat this path\'s naked-putto trap with a fix this path never got. It is a transplant, not research',
  },
  'bath-toy-flotilla': {
    g: 3.0,
    what: 'the bath as an ocean, toys as a fleet',
    lever: 'toys render factory-fresh against "scuffed sun-faded well-chewed" in all 24 prompts',
  },
  'airfield-biplanes': {
    g: null,
    what: 'brick biplanes over a brick airfield',
    lever: 'best draws 4.5; gibberish wing text at ~1-2 per 6, below the resolution of a 6-render round',
  },
  'desert-dunes': { g: 4.5, what: 'a pure paleo desert vista (bonus path)' },
  'snowline-forest': {
    g: 4.6,
    what: 'a cold forest at the snowline (bonus path)',
    lever: 'cloning inherited an archetype that mandated WARM tones and hard-banned its own subject. Fixed with a cold sibling archetype, locked by a test',
  },
  'cozy-farming-life-sim': {
    g: null,
    what: 'NOT part of this run',
    warn: 'You pulled this path for rework on 2026-09-18. Its renders predate that and some were public while it was live. Included only so the sheet reconciles against the code.',
  },
};

function esc(s) {
  return String(s == null ? '' : s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );
}

/** Cluster renders into rounds by gaps in created_at. */
function intoRounds(renders) {
  const sorted = renders.slice().sort((a, b) => a.created_at.localeCompare(b.created_at));
  const rounds = [];
  let cur = [];
  let prev = null;
  for (const r of sorted) {
    const t = new Date(r.created_at).getTime();
    if (prev !== null && t - prev > ROUND_GAP_MIN * 60 * 1000) {
      rounds.push(cur);
      cur = [];
    }
    cur.push(r);
    prev = t;
  }
  if (cur.length) rounds.push(cur);
  return rounds;
}

async function main() {
  const argv = process.argv.slice(2);
  const outArg = argv.indexOf('--out');
  const out =
    outArg >= 0 && argv[outArg + 1]
      ? argv[outArg + 1]
      : path.join(process.env.HOME, 'Desktop', 'dreambot-new-paths-review.html');

  const sb = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // the shadow paths ARE the new paths — read them from the bots themselves so
  // this script can never drift from the code
  const botsDir = path.join(__dirname, 'bots');
  const pathToBot = {};
  for (const d of fs.readdirSync(botsDir, { withFileTypes: true })) {
    if (!d.isDirectory() || !fs.existsSync(path.join(botsDir, d.name, 'index.js'))) continue;
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const bot = require(path.join(botsDir, d.name, 'index.js'));
    for (const p of bot.shadowPaths || []) pathToBot[p] = d.name;
  }

  const byPath = {};
  for (const p of Object.keys(pathToBot)) {
    const rows = [];
    for (let from = 0; ; from += PAGE) {
      // per-path queries: a single .in() over 36 paths plus long URLs silently
      // truncated earlier, so this stays one path at a time and checks errors
      const { data, error } = await sb
        .from('uploads')
        .select('id, image_url, image_url_display, created_at, is_public, is_posted, recipe')
        .eq('recipe->>path', p)
        .order('created_at', { ascending: true })
        .range(from, from + PAGE - 1);
      if (error) throw new Error(`uploads read failed for ${p}: ${error.message}`);
      rows.push(...data);
      if (data.length < PAGE) break;
    }
    byPath[p] = rows.map((r) => ({
      id: r.id,
      url: r.image_url_display || r.image_url,
      full: r.image_url,
      created_at: r.created_at,
      is_public: r.is_public,
      model: ((r.recipe || {}).model || '').replace(/^.*\//, '') || '?',
      vibe: (r.recipe || {}).vibe_key || '',
      prompt: (r.recipe || {}).ai_prompt || '',
    }));
  }

  const bots = [...new Set(Object.values(pathToBot))].sort();
  const total = Object.values(byPath).reduce((s, a) => s + a.length, 0);
  const graded = Object.keys(byPath).filter((p) => (GRADES[p] || {}).g != null).length;

  // ---- render the page -------------------------------------------------
  let sections = '';
  for (const bot of bots) {
    const paths = Object.keys(pathToBot)
      .filter((p) => pathToBot[p] === bot)
      .sort((a, b) => ((GRADES[b] || {}).g || 0) - ((GRADES[a] || {}).g || 0));
    sections += `<h2 class="bot">${esc(bot)}<span class="c">${paths.length} path${paths.length > 1 ? 's' : ''}</span></h2>`;
    for (const p of paths) {
      const meta = GRADES[p] || {};
      const renders = byPath[p] || [];
      const rounds = intoRounds(renders);
      // Which batch to show expanded. Not simply the last one: several paths end
      // on a 1-2 render retry, and focusing there would hide the actual round.
      const substantial = rounds
        .map((r, i) => (r.length >= SUBSTANTIAL_BATCH ? i : -1))
        .filter((i) => i >= 0);
      let focus = substantial.length ? substantial[substantial.length - 1] : rounds.length - 1;
      if (meta.bestRound === 'penultimate' && substantial.length >= 2) {
        focus = substantial[substantial.length - 2];
      }
      const gradeCls = meta.g == null ? 'na' : meta.g >= 4.5 ? 'pass' : meta.g >= 3.9 ? 'close' : 'under';
      const gradeTxt = meta.g == null ? '—' : meta.g.toFixed(2);

      let roundsHtml = '';
      rounds.forEach((rr, i) => {
        const isFocus = i === focus;
        const label =
          rounds.length === 1 ? 'all renders' : `batch ${i + 1} of ${rounds.length}`;
        const when = rr[0].created_at.slice(0, 16).replace('T', ' ');
        roundsHtml += `
        <details class="round" ${isFocus ? 'open' : ''}>
          <summary><b>${esc(label)}</b> · ${rr.length} render${rr.length > 1 ? 's' : ''} · ${esc(when)} ${isFocus ? '<em class="focus">← the batch to judge</em>' : ''}</summary>
          <div class="grid">
            ${rr
              .map(
                (r) => `<figure>
              <a href="${esc(r.full)}" target="_blank" rel="noreferrer"><img loading="lazy" src="${esc(r.url)}" alt="${esc(p)} render"></a>
              <figcaption>${esc(r.model)}${r.vibe ? ' · ' + esc(r.vibe) : ''}${r.is_public ? ' · <span class="pub">PUBLIC</span>' : ''}</figcaption>
            </figure>`
              )
              .join('')}
          </div>
        </details>`;
      });

      sections += `
      <section class="path" data-path="${esc(p)}" data-bot="${esc(bot)}" data-grade="${meta.g == null ? '' : meta.g}">
        <header>
          <div class="hl">
            <span class="grade ${gradeCls}">${gradeTxt}</span>
            <h3><code>${esc(p)}</code></h3>
            <span class="n">${renders.length} render${renders.length === 1 ? '' : 's'} · ${rounds.length} batch${rounds.length === 1 ? '' : 'es'}</span>
          </div>
          <p class="what">${esc(meta.what || '')}</p>
          ${meta.warn ? `<p class="warn">⚠️ ${esc(meta.warn)}</p>` : ''}
          ${meta.why ? `<p class="why">📌 ${esc(meta.why)}</p>` : ''}
          ${meta.lever ? `<p class="lever"><b>Residual + lever:</b> ${esc(meta.lever)}</p>` : ''}
          <div class="cut" role="group" aria-label="decision for ${esc(p)}">
            <button data-v="keep">Keep</button>
            <button data-v="lever">Keep + spend the lever</button>
            <button data-v="cut">Cut</button>
            <button data-v="clear" class="clear">clear</button>
            <span class="verdict"></span>
          </div>
        </header>
        ${roundsHtml}
      </section>`;
    }
  }

  const html = `<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>DreamBot — new paths cut sheet</title>
<style>
  :root { color-scheme: light dark; --fg:#111; --bg:#fafaf8; --card:#fff; --line:#e3e3de; --mut:#666; }
  @media (prefers-color-scheme: dark) { :root { --fg:#e9e9e6; --bg:#16171a; --card:#1e2024; --line:#32343a; --mut:#9a9a96; } }
  * { box-sizing: border-box; }
  body { margin:0; padding:24px 20px 80px; background:var(--bg); color:var(--fg);
         font:14px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif; }
  .wrap { max-width:1180px; margin:0 auto; }
  h1 { font-size:26px; margin:0 0 6px; letter-spacing:-.4px; }
  .sub { color:var(--mut); margin:0 0 18px; }
  .note { background:var(--card); border:1px solid var(--line); border-left:3px solid #c9a227;
          border-radius:8px; padding:12px 14px; margin:0 0 14px; }
  .note b { color:var(--fg); }
  .bar { position:sticky; top:0; z-index:10; background:var(--bg); border-bottom:1px solid var(--line);
         padding:10px 0; margin:0 0 18px; display:flex; gap:10px; flex-wrap:wrap; align-items:center; }
  .bar button, .cut button { font:inherit; cursor:pointer; border:1px solid var(--line);
         background:var(--card); color:var(--fg); border-radius:6px; padding:6px 11px; }
  .bar button:hover, .cut button:hover { border-color:var(--mut); }
  .tally { color:var(--mut); margin-left:auto; font-variant-numeric:tabular-nums; }
  h2.bot { font-size:19px; margin:34px 0 12px; padding-bottom:6px; border-bottom:2px solid var(--line);
           text-transform:capitalize; display:flex; align-items:baseline; gap:10px; }
  h2.bot .c { font-size:12px; font-weight:400; color:var(--mut); text-transform:none; }
  section.path { background:var(--card); border:1px solid var(--line); border-radius:10px;
                 padding:14px 16px; margin:0 0 16px; }
  section.path.decided-cut { opacity:.5; }
  section.path.decided-keep { border-color:#2e7d32; }
  section.path.decided-lever { border-color:#c9a227; }
  .hl { display:flex; align-items:baseline; gap:12px; flex-wrap:wrap; }
  .hl h3 { margin:0; font-size:16px; font-weight:600; }
  .hl code { font:inherit; }
  .grade { font-weight:700; font-variant-numeric:tabular-nums; padding:2px 8px; border-radius:5px; font-size:13px; }
  .grade.pass { background:#2e7d32; color:#fff; }
  .grade.close { background:#c9a227; color:#1a1a1a; }
  .grade.under { background:#b3543f; color:#fff; }
  .grade.na { background:var(--line); color:var(--mut); }
  .n { color:var(--mut); font-size:12px; margin-left:auto; }
  .what { margin:6px 0 0; color:var(--mut); }
  .warn, .why, .lever { margin:8px 0 0; padding:8px 10px; border-radius:6px; font-size:13px; }
  .warn { background:rgba(179,84,63,.12); }
  .why  { background:rgba(201,162,39,.14); }
  .lever { background:rgba(127,127,127,.10); }
  .cut { margin:11px 0 4px; display:flex; gap:7px; align-items:center; flex-wrap:wrap; }
  .cut .clear { border:none; background:none; color:var(--mut); text-decoration:underline; padding:6px 2px; }
  .cut button[aria-pressed="true"] { background:var(--fg); color:var(--bg); border-color:var(--fg); }
  .verdict { font-size:12px; color:var(--mut); }
  details.round { margin:10px 0 0; border-top:1px solid var(--line); padding-top:8px; }
  details.round summary { cursor:pointer; color:var(--mut); font-size:13px; }
  details.round summary b { color:var(--fg); }
  .focus { color:#2e7d32; font-style:normal; font-weight:600; }
  .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(210px,1fr)); gap:10px; margin-top:10px; }
  figure { margin:0; }
  figure img { width:100%; aspect-ratio:1/1; object-fit:cover; border-radius:7px; display:block;
               background:var(--line); border:1px solid var(--line); }
  figcaption { font-size:11px; color:var(--mut); margin-top:3px; word-break:break-word; }
  .pub { color:#b3543f; font-weight:700; }
  @media (max-width:520px) { .grid { grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); } }
</style>
<div class="wrap">
<h1>New paths — the cut sheet</h1>
<p class="sub">${Object.keys(pathToBot).length} shadow paths across ${bots.length} bots · ${total} test renders · generated ${new Date().toISOString().slice(0, 16).replace('T', ' ')}</p>

<div class="note">
<b>Every path here is shadow-only.</b> Nothing is in live rotation; going live is moving one string into <code>paths[]</code>.
Grades are mine on a 5-lens rubric and I grade harsh, so read 3.5 as "worth a look" rather than "bad".
<b>Batches are derived, not recorded</b> — nothing stores "this was round 2", so they are inferred by clustering render
timestamps with a ${ROUND_GAP_MIN}-minute gap (measured: within a batch renders land 0-1 min apart, between batches 3-10).
Most paths fall out as clean groups of 5 or 6, which matches the QA rounds that were actually run, but a path with
retries will show extra small batches. The batch I'd judge is expanded &mdash; the last one with at least
${SUBSTANTIAL_BATCH} renders, so a one-off retry doesn't masquerade as a round. Earlier batches are collapsed.
Click any render to open the full-size original.
</div>

<div class="bar">
  <button id="all">Expand every round</button>
  <button id="focus">Collapse to the judged batch</button>
  <button id="undec">Show only undecided</button>
  <button id="showall">Show all paths</button>
  <button id="exp">Export decisions</button>
  <span class="tally" id="tally"></span>
</div>

${sections}
</div>
<script>
// Decisions persist per-browser only. Wrapped because storage throws in private mode.
var KEY = 'dreambot-cut-sheet-v1';
function load(){ try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch(e) { return {}; } }
function save(d){ try { localStorage.setItem(KEY, JSON.stringify(d)); } catch(e) {} }
var decisions = load();

function paint(){
  var counts = { keep:0, lever:0, cut:0 };
  document.querySelectorAll('section.path').forEach(function(s){
    var p = s.dataset.path, v = decisions[p];
    s.classList.remove('decided-keep','decided-cut','decided-lever');
    if (v) { s.classList.add('decided-' + v); counts[v]++; }
    s.querySelectorAll('.cut button[data-v]').forEach(function(b){
      if (b.dataset.v !== 'clear') b.setAttribute('aria-pressed', String(b.dataset.v === v));
    });
    var vd = s.querySelector('.verdict');
    vd.textContent = v ? ({keep:'kept', lever:'keep, spend the lever', cut:'cut'})[v] : 'no call yet';
  });
  var n = Object.keys(pathsAll).length;
  document.getElementById('tally').textContent =
    counts.keep + ' keep · ' + counts.lever + ' keep+lever · ' + counts.cut + ' cut · ' +
    (n - counts.keep - counts.lever - counts.cut) + ' undecided';
}
var pathsAll = {};
document.querySelectorAll('section.path').forEach(function(s){ pathsAll[s.dataset.path] = 1; });

document.addEventListener('click', function(e){
  var b = e.target.closest('.cut button[data-v]');
  if (!b) return;
  var p = b.closest('section.path').dataset.path;
  if (b.dataset.v === 'clear') delete decisions[p]; else decisions[p] = b.dataset.v;
  save(decisions); paint();
});

document.getElementById('all').onclick = function(){
  document.querySelectorAll('details.round').forEach(function(d){ d.open = true; });
};
document.getElementById('focus').onclick = function(){
  document.querySelectorAll('details.round').forEach(function(d){
    d.open = !!d.querySelector('.focus');
  });
};
document.getElementById('undec').onclick = function(){
  document.querySelectorAll('section.path').forEach(function(s){
    s.hidden = !!decisions[s.dataset.path];
  });
};
document.getElementById('showall').onclick = function(){
  document.querySelectorAll('section.path').forEach(function(s){ s.hidden = false; });
};
document.getElementById('exp').onclick = function(){
  var out = { keep:[], lever:[], cut:[], undecided:[] };
  document.querySelectorAll('section.path').forEach(function(s){
    var p = s.dataset.path;
    (out[decisions[p] || 'undecided']).push(p);
  });
  var txt = 'KEEP (' + out.keep.length + '):\\n' + out.keep.map(function(x){return '  '+x;}).join('\\n') +
    '\\n\\nKEEP + SPEND THE LEVER (' + out.lever.length + '):\\n' + out.lever.map(function(x){return '  '+x;}).join('\\n') +
    '\\n\\nCUT (' + out.cut.length + '):\\n' + out.cut.map(function(x){return '  '+x;}).join('\\n') +
    '\\n\\nUNDECIDED (' + out.undecided.length + '):\\n' + out.undecided.map(function(x){return '  '+x;}).join('\\n');
  // No download: just select it so it can be copied straight into chat.
  var ta = document.createElement('textarea');
  ta.value = txt;
  ta.style.cssText = 'position:fixed;inset:6% 8%;z-index:99;width:84%;height:80%;font:12px/1.5 ui-monospace,monospace;padding:14px;border-radius:10px;';
  ta.onblur = function(){ ta.remove(); };
  document.body.appendChild(ta); ta.focus(); ta.select();
};
paint();
</script>`;

  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);

  const missing = Object.keys(byPath).filter((p) => byPath[p].length === 0);
  console.log(`✓ ${out}`);
  console.log(
    `  ${Object.keys(pathToBot).length} paths · ${total} renders · ${graded} carry a grade`
  );
  if (missing.length) console.log(`  ⚠️ no renders found for: ${missing.join(', ')}`);
  const pub = Object.entries(byPath).flatMap(([p, rs]) =>
    rs.filter((r) => r.is_public).map(() => p)
  );
  console.log(
    pub.length
      ? `  ⚠️ ${pub.length} render(s) marked PUBLIC, on: ${[...new Set(pub)].join(', ')}`
      : '  ✓ zero renders are public'
  );
  if (argv.includes('--open')) require('child_process').spawn('open', [out], { detached: true });
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
