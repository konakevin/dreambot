#!/usr/bin/env node
/**
 * Render one archetype's 4-render QA batch (2 couple, 1 self, 1 plus_one) to Kevin's
 * album, captioned "🎃 <archetype> R<round> <surface>" so batches group visually.
 *   node scripts/qa-holiday-archetype.js --archetype vampire --round 1 [--holiday halloween]
 * Prints the 4 image URLs.
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const SB = 'https://jimftynwrinwenonjrlj.supabase.co';
const U = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const W = process.env.DREAM_QUEUE_WORKER_TOKEN;
const sb = createClient(SB, process.env.SUPABASE_SERVICE_ROLE_KEY);
const arg = (n, d) => {
  const i = process.argv.indexOf('--' + n);
  return i >= 0 ? process.argv[i + 1] : d;
};
const ARCH = arg('archetype');
const ROUND = arg('round', '1');
const HOLIDAY = arg('holiday', 'halloween');
const SURFACES = [
  ['dual', 'couple1'],
  ['dual', 'couple2'],
  ['self', 'self'],
  ['plus_one', 'plus1'],
];

(async () => {
  const out = [];
  for (const [cast, label] of SURFACES) {
    await sb
      .from('ai_generation_budget')
      .delete()
      .eq('user_id', U)
      .eq('date', new Date().toISOString().slice(0, 10));
    let d;
    // The edge fn intermittently returns WORKER_RESOURCE_LIMIT (transient compute
    // pressure, not a content problem) — retry a couple times before giving up.
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch(`${SB}/functions/v1/nightly-dreams`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${W}` },
          body: JSON.stringify({
            user_id: U,
            force_holiday_scene: HOLIDAY,
            force_holiday_sub_theme: ARCH,
            force_cast_role: cast,
          }),
        });
        d = await res.json();
      } catch (e) {
        d = { error: e.message };
      }
      if (d && d.upload_id) break;
      if (d && d.code === 'WORKER_RESOURCE_LIMIT' && attempt < 2) continue;
      break;
    }
    if (!d) {
      console.log(`  ✗ ${label}: no response`);
      continue;
    }
    if (!d.upload_id) {
      console.log(`  ✗ ${label}: ${JSON.stringify(d).slice(0, 90)}`);
      continue;
    }
    const { data: up } = await sb
      .from('uploads')
      .select('dream_medium,holiday')
      .eq('id', d.upload_id)
      .single();
    await sb
      .from('uploads')
      .update({ caption: `🎃 ${ARCH} R${ROUND} ${label}` })
      .eq('id', d.upload_id);
    console.log(`  ${label} [${up?.dream_medium}|h=${up?.holiday}]: ${d.image_url}`);
    out.push({ label, url: d.image_url });
  }
  console.log(JSON.stringify(out.map((o) => o.url)));
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
