#!/usr/bin/env node
/**
 * Holiday DAY-OF monitor (HOLIDAY_DAY_OF_PLAN.md R7 / §7). Runs on a holiday's peak date (per user
 * timezone the takeover spans two 08:00 UTC runs, so run it on both mornings) and tallies, for the
 * last --hours: eligible nightly renders vs `holiday_day_of:<key>:…` stamps vs `postcard:<key>:ok`
 * vs `SHIPPED_FACELESS`. Exit 1 (GitHub failure email) when the takeover did not fire, when postcards
 * are missing on day-of renders, or when any cast day-of dream shipped faceless.
 *
 *   node scripts/check-holiday-day-of.js --holiday halloween [--hours 26] [--preflight]
 *   --if-peak:   exit 0 quietly unless UTC today/yesterday is the peak of an active day_of_enabled holiday (CI daily cron)
 *   --preflight: no renders needed — checks the reserved day_of pool has rows for every surface and
 *                that the catalog row is active + day_of_enabled + has a postcard overlay. Exit 1 on a gap.
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');

const KEVIN = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const arg = (n, d) => {
  const i = process.argv.indexOf('--' + n);
  return i >= 0 ? process.argv[i + 1] : d;
};
const holiday = arg('holiday', 'halloween');
const PREFLIGHT = process.argv.includes('--preflight');
const IF_PEAK = process.argv.includes('--if-peak');

async function pageAll(q) {
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await q.range(from, from + 999);
    if (error) throw error;
    rows.push(...(data || []));
    if (!data || data.length < 1000) break;
  }
  return rows;
}

(async () => {
  const sb = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://jimftynwrinwenonjrlj.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  if (IF_PEAK) {
    // The takeover spans two 08:00 UTC runs (per-timezone), so a peak day is 'today or yesterday (UTC)'.
    const W = require('./lib/holidayWindow.js');
    const { data: cats } = await sb.from('holidays').select('*').eq('is_active', true);
    const now = new Date();
    const todaySerial = W.toSerial({
      year: now.getUTCFullYear(),
      month: now.getUTCMonth() + 1,
      day: now.getUTCDate(),
    });
    const peaks = (cats || [])
      .map((c) => W.mapHolidayCatalogRow(c))
      .filter((r) => r.dayOfEnabled !== false)
      .filter((r) =>
        [now.getUTCFullYear(), now.getUTCFullYear() + 1].some((y) => {
          const p = W.toSerial(W.resolvePeak(r, y));
          return p === todaySerial || p === todaySerial - 1;
        })
      );
    if (peaks.length === 0) {
      console.log(
        'not a day-of date for any active holiday (UTC today/yesterday) — nothing to check'
      );
      return;
    }
    console.log('peak day for: ' + peaks.map((r) => r.key).join(', '));
    for (const r of peaks)
      if (r.key !== holiday) console.log('  (run again with --holiday ' + r.key + ')');
  }
  const problems = [];

  if (PREFLIGHT) {
    const { data: cat } = await sb.from('holidays').select('*').eq('key', holiday).maybeSingle();
    if (!cat) problems.push(`no holidays row for ${holiday}`);
    else {
      if (!cat.is_active) problems.push('catalog row is_active = false');
      if (cat.day_of_enabled === false) problems.push('catalog day_of_enabled = false');
      if (!cat.postcard_overlay_url) problems.push('catalog has no postcard_overlay_url (R4)');
      // §5d (mig 478): every day-of look key must be a live, face-swap, natural dream_mediums row.
      const lookKeys = Array.isArray(cat.day_of_look_keys) ? cat.day_of_look_keys : [];
      if (lookKeys.length === 0) problems.push('catalog has no day_of_look_keys (§5d: the day-of medium would fall to the normal roll)');
      else {
        const { data: looks } = await sb.from('dream_mediums').select('key,is_active,face_swaps,character_render_mode,is_public').in('key', lookKeys);
        for (const k of lookKeys) {
          const m = (looks || []).find((x) => x.key === k);
          if (!m) problems.push(`look ${k}: no dream_mediums row`);
          else if (!m.is_active || !m.face_swaps || m.character_render_mode !== 'natural') problems.push(`look ${k}: must be is_active + face_swaps + natural`);
          else if (m.is_public) problems.push(`look ${k}: is_public=true would list it in the Create picker`);
        }
        console.log(`  looks ${lookKeys.length}: ${lookKeys.join(', ')}  ban: ${cat.day_of_medium_ban || '(none)'}`);
      }
    }
    const { POOL_OF_SUB } = require('./lib/' + holiday + 'Pools');
    const dayOfSubs = Object.entries(POOL_OF_SUB)
      .filter(([, p]) => p === `${holiday}_day_of`)
      .map(([s]) => s);
    if (dayOfSubs.length === 0) problems.push(`taxonomy has no ${holiday}_day_of subs`);
    for (const t of ['dual_scenarios', 'single_scenarios', 'holiday_scenes']) {
      const col = t === 'holiday_scenes' ? 'holiday' : 'category';
      const rows = await pageAll(
        sb
          .from(t)
          .select('sub_theme')
          .eq(col, holiday)
          .eq('disabled', false)
          .in('sub_theme', dayOfSubs)
          .order('id')
      );
      const bySub = {};
      for (const r of rows) bySub[r.sub_theme] = (bySub[r.sub_theme] || 0) + 1;
      const missing = dayOfSubs.filter((s) => !bySub[s]);
      console.log(
        `${t.padEnd(17)} day-of rows ${String(rows.length).padStart(4)}  subs covered ${dayOfSubs.length - missing.length}/${dayOfSubs.length}${missing.length ? '  MISSING: ' + missing.join(', ') : ''}`
      );
      if (rows.length === 0) problems.push(`${t}: the ${holiday}_day_of pool is EMPTY`);
      else if (missing.length) problems.push(`${t}: no rows for ${missing.join(', ')}`);
    }
  } else {
    const hours = Number(arg('hours', '26'));
    const since = new Date(Date.now() - hours * 3600e3).toISOString();
    const rows = await pageAll(
      sb
        .from('ai_generation_log')
        .select(
          'id,user_id,fallback_reasons,np:rolled_axes->>nightlyPath,castRoles:rolled_axes->castRoles'
        )
        .gte('created_at', since)
        .neq('user_id', KEVIN)
        .order('id')
    );
    const nightly = rows.filter((r) => r.np);
    const t = {
      nightly: nightly.length,
      dayOf: 0,
      fromPool: 0,
      fromWindow: 0,
      postcard: 0,
      faceless: 0,
      castDayOf: 0,
      empty: 0,
      error: 0,
    };
    const bad = [];
    for (const r of nightly) {
      const f = r.fallback_reasons || [];
      const d = f.find((s) => s.startsWith(`holiday_day_of:${holiday}:`));
      if (f.some((s) => s.startsWith(`holiday_day_of_empty:${holiday}`))) t.empty++;
      if (f.some((s) => s.startsWith(`holiday_day_of_error:`))) t.error++;
      if (!d) continue;
      t.dayOf++;
      if (d.includes(':day_of:')) t.fromPool++;
      else t.fromWindow++;
      const pc = f.some((s) => s.startsWith(`postcard:${holiday}:ok`));
      if (pc) t.postcard++;
      else bad.push({ id: r.id, why: 'day-of render without postcard' });
      const isCast = Array.isArray(r.castRoles) && r.castRoles.length > 0;
      if (isCast) t.castDayOf++;
      if (f.includes('SHIPPED_FACELESS')) {
        t.faceless++;
        bad.push({ id: r.id, why: 'cast day-of dream shipped FACELESS' });
      }
    }
    console.log(
      `${holiday} day-of, last ${hours}h (real users): nightly ${t.nightly} · day-of ${t.dayOf} (pool ${t.fromPool}, window-fallback ${t.fromWindow}) · postcards ${t.postcard} · cast ${t.castDayOf} · faceless ${t.faceless} · empty-pool ${t.empty} · errors ${t.error}`
    );
    if (t.nightly > 0 && t.dayOf === 0)
      problems.push('the day-of takeover did NOT fire on any nightly');
    if (t.fromWindow > 0)
      problems.push(
        `${t.fromWindow} day-of render(s) fell back to the WINDOW pool (reserved pool empty for that surface?)`
      );
    if (t.error > 0) problems.push(`${t.error} holiday_day_of_error stamp(s)`);
    for (const b of bad.slice(0, 20)) problems.push(`${b.id}: ${b.why}`);
  }

  if (problems.length) {
    console.error('✗ ' + problems.join('\n✗ '));
    process.exit(1);
  }
  console.log(PREFLIGHT ? '✓ day-of preflight clean' : '✓ day-of night clean');
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
