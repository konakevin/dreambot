#!/usr/bin/env node
/**
 * QA the ENTIRE holiday nightly loop on a real account (HOLIDAY_DREAMS_PLAN.md).
 * Renders every surface × season via force_holiday_scene (bypasses is_active /
 * holidays_enabled, so it works while dark) + force_cast_role (picks the path):
 *   dual cast  ← force_cast_role='dual'   (Path 1 dual)
 *   solo cast  ← force_cast_role='self'   (Path 1 solo)
 *   scene-only ← force_cast_role=null     (Path 2)
 *
 *   node scripts/qa-holiday-renders.js [--per 2] [--season halloween|fall|both]
 *
 * Posts real dreams to Kevin's account (review in-app). Clears the AI budget first.
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const SB_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const USER_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec'; // Kevin
const WORKER = process.env.DREAM_QUEUE_WORKER_TOKEN;
const sb = createClient(SB_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const arg = (n, d) => {
  const i = process.argv.indexOf('--' + n);
  return i >= 0 ? process.argv[i + 1] : d;
};
const PER = parseInt(arg('per', '2'), 10);
const SEASON = arg('season', 'both');
const seasons = SEASON === 'both' ? ['halloween', 'fall'] : [SEASON];
const SURFACES = [
  { label: 'dual-cast', cast: 'dual' },
  { label: 'solo-cast', cast: 'self' },
  { label: 'scene-only', cast: null },
];

(async () => {
  if (!WORKER) {
    console.error('Missing DREAM_QUEUE_WORKER_TOKEN (.env.local)');
    process.exit(2);
  }
  const results = [];
  for (const season of seasons) {
    for (const surf of SURFACES) {
      for (let i = 0; i < PER; i++) {
        const today = new Date().toISOString().slice(0, 10);
        await sb.from('ai_generation_budget').delete().eq('user_id', USER_ID).eq('date', today);

        // scene-only (surf.cast === null): force_pure_scene forces the no-cast
        // composition even for a user WITH a cast photo (Path 2). Cast surfaces
        // use force_cast_role 'dual' | 'self' (Path 1).
        const body =
          surf.cast === null
            ? { user_id: USER_ID, force_holiday_scene: season, force_pure_scene: true }
            : { user_id: USER_ID, force_holiday_scene: season, force_cast_role: surf.cast };
        const t0 = Date.now();
        let data;
        try {
          const res = await fetch(`${SB_URL}/functions/v1/nightly-dreams`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${WORKER}` },
            body: JSON.stringify(body),
          });
          const text = await res.text();
          try {
            data = JSON.parse(text);
          } catch {
            console.log(
              `  ✗ ${season}/${surf.label} #${i + 1}: non-JSON ${res.status}: ${text.slice(0, 120)}`
            );
            continue;
          }
          if (!res.ok) {
            console.log(`  ✗ ${season}/${surf.label} #${i + 1}: ${data.error || res.status}`);
            continue;
          }
        } catch (e) {
          console.log(`  ✗ ${season}/${surf.label} #${i + 1}: ${e.message}`);
          continue;
        }
        const secs = ((Date.now() - t0) / 1000).toFixed(0);
        if (data.upload_id) {
          await sb
            .from('uploads')
            .update({ caption: `QA holiday: ${season} ${surf.label}` })
            .eq('id', data.upload_id);
        }
        console.log(
          `  ✅ ${season}/${surf.label} #${i + 1} (${secs}s) | ${data.resolved_medium || '?'} | comp=${data.composition || '?'} | holiday=${data.holiday || '?'}`
        );
        console.log(`     ${data.image_url}`);
        results.push({
          season,
          surface: surf.label,
          url: data.image_url,
          upload_id: data.upload_id,
        });
      }
    }
  }
  console.log(`\n━━━ ${results.length} holiday QA renders posted to Kevin's account ━━━`);
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
