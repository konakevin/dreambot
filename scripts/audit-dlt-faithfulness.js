/**
 * audit-dlt-faithfulness.js — READ-ONLY.
 *
 * For every bot + path, decide whether "Dream Like This" can faithfully
 * recreate that path's look. The risk: a path renders with a NEUTRAL/photoreal
 * medium (photography / render / *hyperreal / real_astro) while its real look
 * carries a pervasive MATERIAL/CONSTRUCTION tilt (LEGO bricks / claymation /
 * plush / pixels / vinyl / papercraft) that lives in the PROMPT, not the medium.
 * DLT transfers the medium + strips the subject → the tilt is lost.
 *
 * Output: per (bot, path) → medium, medium-type, tilt-in-renders, clean-row,
 * and a RISK verdict. Writes /tmp/dlt_audit.json + prints a summary.
 */

const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY);

// Mediums that carry NO material/illustration tilt — just photoreal/CGI realism.
// A path on one of these inherits "realism" in DLT, nothing bot-specific.
const NEUTRAL = new Set([
  'photography', 'real_astro', 'render', 'hyperreal', 'cinematic',
  'starbot_hyperreal', 'earthbot_hyperreal', 'bloom_hyperreal_cgi', 'steambot-hyperreal',
]);

// Pervasive MATERIAL/CONSTRUCTION tilts — these ARE the style (apply to the whole
// image), so they SHOULD transfer in DLT but get lost if the medium is neutral.
const TILT_PATTERNS = [
  ['lego', /\blego\b|\bbrick(s|-)|stud(s|-topped)|minifig/i],
  ['claymation', /claymation|plasticine|\bclay\b|aardman|stop-motion clay/i],
  ['plush', /\bplush\b|stuffed-animal|squishmallow|fiberfill|sackboy|burlap|felt|knit|crochet|sewn/i],
  ['pixel', /\bpixel(s|-art|ated)\b|voxel|8-bit|16-bit/i],
  ['vinyl', /\bvinyl\b|designer-vinyl|pop[- ]mart|be@rbrick|figurine/i],
  ['toy-figure', /action-figure|fashion-doll|army-men|die-cast|tabletop-mini|toy soldier|gi-joe|barbie/i],
  ['papercraft', /papercraft|origami|paper-cut|cardboard cut/i],
  ['diorama', /\bdiorama\b|stop-motion|miniature set|practical-prop set/i],
];

const detectTilt = (text) => {
  const t = (text || '').toLowerCase();
  return TILT_PATTERNS.filter(([, re]) => re.test(t)).map(([name]) => name);
};

(async () => {
  const botsDir = 'scripts/bots';
  const botDirs = fs.readdirSync(botsDir).filter((d) => fs.existsSync(path.join(botsDir, d, 'index.js')));

  // medium directives from DB (to check if a medium itself names the tilt)
  const { data: dm } = await sb.from('dream_mediums').select('key,directive,flux_fragment,is_bot_only');
  const mediumDirective = Object.fromEntries((dm || []).map((r) => [r.key, `${r.directive || ''} ${r.flux_fragment || ''}`]));
  const { data: cleanRows } = await sb.from('dlt_clean_mediums').select('medium_key');
  const haveClean = new Set((cleanRows || []).map((r) => r.medium_key));

  const report = [];
  for (const dir of botDirs) {
    let cfg;
    try {
      cfg = require(path.resolve(botsDir, dir, 'index.js'));
    } catch (e) {
      report.push({ bot: dir, error: e.message.slice(0, 80) });
      continue;
    }
    const username = cfg.username || dir;

    // bot user id (match by username, case-insensitive)
    const { data: users } = await sb.from('users').select('id,username').ilike('username', username);
    const uid = users && users[0] && users[0].id;

    // recent renders → group by recipe.path
    const byPath = {};
    if (uid) {
      const { data: posts } = await sb
        .from('uploads')
        .select('dream_medium,ai_prompt,style_summary,recipe')
        .eq('user_id', uid)
        .order('created_at', { ascending: false })
        .limit(120);
      for (const p of posts || []) {
        const pth = (p.recipe && p.recipe.path) || '(unknown)';
        if (!byPath[pth]) byPath[pth] = [];
        byPath[pth].push(p);
      }
    }

    // path → configured medium
    const pathList = cfg.paths || Object.keys(cfg.mediumByPath || {});
    const mediumFor = (pth) => {
      if (cfg.mediumByPath && cfg.mediumByPath[pth] != null) {
        const v = cfg.mediumByPath[pth];
        if (typeof v === 'string') return [v];
        if (Array.isArray(v)) return v;
        if (typeof v === 'object') return Object.keys(v);
      }
      if (cfg.defaultMedium) return [cfg.defaultMedium];
      if (Array.isArray(cfg.mediums)) return cfg.mediums;
      return ['(unknown)'];
    };

    const seenPaths = new Set([...pathList, ...Object.keys(byPath)]);
    for (const pth of seenPaths) {
      const mediums = mediumFor(pth);
      const samples = byPath[pth] || [];
      // tilt detected in this path's real renders
      const renderTilts = new Set();
      const styleTilts = new Set();
      for (const s of samples.slice(0, 8)) {
        detectTilt(s.ai_prompt).forEach((t) => renderTilts.add(t));
        detectTilt(s.style_summary).forEach((t) => styleTilts.add(t));
      }
      const actualMediums = [...new Set(samples.map((s) => s.dream_medium).filter(Boolean))];
      const effMediums = actualMediums.length ? actualMediums : mediums;

      for (const m of effMediums) {
        const isNeutral = NEUTRAL.has(m);
        const medNamesTilt = detectTilt(mediumDirective[m] || '');
        // RISK: neutral medium + renders carry a tilt the medium doesn't name
        const lostTilts = [...renderTilts].filter((t) => !medNamesTilt.includes(t));
        let risk = 'OK';
        if (isNeutral && renderTilts.size > 0) risk = 'HIGH';
        else if (!isNeutral && renderTilts.size > 0 && lostTilts.length && !medNamesTilt.length) risk = 'CHECK';
        report.push({
          bot: username,
          path: pth,
          medium: m,
          neutralMedium: isNeutral,
          mediumNamesTilt: medNamesTilt,
          renderTilts: [...renderTilts],
          inStyleSummary: [...styleTilts],
          samplePosts: samples.length,
          hasCleanRow: haveClean.has(m),
          risk,
        });
      }
    }
  }

  fs.writeFileSync('/tmp/dlt_audit.json', JSON.stringify(report, null, 2));

  // ── Summary ──
  const high = report.filter((r) => r.risk === 'HIGH');
  const check = report.filter((r) => r.risk === 'CHECK');
  console.log(`\n===== HIGH RISK (neutral medium + material tilt in renders → DLT loses the look) =====`);
  for (const r of high) {
    console.log(`  ${r.bot} / ${r.path}  [medium=${r.medium}]  tilt=${r.renderTilts.join('+')}  (style_summary has: ${r.inStyleSummary.join('+') || 'none'}) posts=${r.samplePosts}`);
  }
  console.log(`\n===== CHECK (tilt in renders, medium may not fully carry it) =====`);
  for (const r of check) {
    console.log(`  ${r.bot} / ${r.path}  [medium=${r.medium}]  tilt=${r.renderTilts.join('+')}`);
  }
  console.log(`\nTotals: ${report.length} (bot,path,medium) rows | HIGH=${high.length} | CHECK=${check.length} | full data → /tmp/dlt_audit.json`);
  const errs = report.filter((r) => r.error);
  if (errs.length) console.log('LOAD ERRORS:', errs.map((e) => `${e.bot}:${e.error}`).join(' | '));
})();
