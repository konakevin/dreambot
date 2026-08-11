#!/usr/bin/env node
/**
 * qa-nightly-fun.js — fire N nightly-dreams renders for a user, forced to the
 * ACTIVE scenario pool (the new fun/fantasy buckets), so they persist as uploads
 * under that user's account and show up in the app feed/album for QA.
 * See NIGHTLY_FUN_SCENARIOS_PLAN.md. Worker-token path (server-to-server).
 *
 * Usage:
 *   node scripts/qa-nightly-fun.js --cast dual --count 6
 *   node scripts/qa-nightly-fun.js --cast self --count 3
 *   node scripts/qa-nightly-fun.js --cast plus_one --count 3
 *   optional: --user <uuid> (default Kevin), --medium <key>
 */
require('dotenv').config({ path: '.env.local' });

const args = process.argv.slice(2);
const arg = (k, d) => {
  const i = args.indexOf(k);
  return i >= 0 ? args[i + 1] : d;
};
const CAST = arg('--cast', 'dual'); // dual | self | plus_one
const COUNT = parseInt(arg('--count', '6'), 10);
const USER = arg('--user', 'eab700d8-f11a-4f47-a3a1-addda6fb67ec'); // Kevin
const MEDIUM = arg('--medium', null);
const BUCKET = arg('--bucket', 'swashbuckler'); // the scenario category to force
// --pose mode: force the dynamic ACTIVE POSE pool on a normal LOCATION dream
// (no scenario), to preview retrofitting motion across all nightly dreams.
const POSE_MODE = args.includes('--pose');
// --locfit mode: force the generative LOCATION-FIT action beat (Option B) on a
// normal location dream — a swap-safe action authored to fit the exact place.
const LOCFIT_MODE = args.includes('--locfit');
// --natural mode: NO forcing at all — the engine runs its own composition roll
// (dual/self/+1) + scenario roll (goofy/elegant/active/location) + Option B,
// exactly like a real nightly. Use to sanity-check the LIVE variety/mix.
const NATURAL_MODE = args.includes('--natural');

const URL =
  (process.env.SUPABASE_URL || 'https://jimftynwrinwenonjrlj.supabase.co') +
  '/functions/v1/nightly-dreams';
const TOKEN = process.env.DREAM_QUEUE_WORKER_TOKEN;
if (!TOKEN) {
  console.error('Missing DREAM_QUEUE_WORKER_TOKEN in .env.local');
  process.exit(1);
}

// force_scene_category targets the exact bucket via a LIVE DB query (any pool) —
// bypasses the isolate scenario cache, so a freshly-seeded bucket renders without
// a redeploy or enabling its pool %.
const body = NATURAL_MODE
  ? { user_id: USER, ...(MEDIUM ? { force_medium: MEDIUM } : {}) } // full natural roll
  : LOCFIT_MODE
    ? {
        user_id: USER,
        force_cast_role: CAST,
        force_location_action: true, // generative location-fit action (Option B)
        ...(MEDIUM ? { force_medium: MEDIUM } : {}),
      }
    : POSE_MODE
      ? {
          user_id: USER,
          force_cast_role: CAST,
          force_active_pose: true, // dynamic pose pool on a plain location dream
          ...(MEDIUM ? { force_medium: MEDIUM } : {}),
        }
      : {
          user_id: USER,
          force_cast_role: CAST,
          force_scene_category: BUCKET,
          ...(MEDIUM ? { force_medium: MEDIUM } : {}),
        };

(async () => {
  console.log(`Rendering ${COUNT}x nightly [${BUCKET}] (${CAST}) for ${USER}...\n`);
  for (let i = 1; i <= COUNT; i++) {
    const t0 = Date.now();
    try {
      const res = await fetch(URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const text = await res.text();
      let j;
      try {
        j = JSON.parse(text);
      } catch {
        j = { raw: text.slice(0, 160) };
      }
      const secs = ((Date.now() - t0) / 1000).toFixed(0);
      const info = j.upload_id
        ? `upload=${j.upload_id} medium=${j.medium ?? j.dream_medium ?? '?'}`
        : j.error
          ? `error=${j.error}`
          : JSON.stringify(j).slice(0, 160);
      console.log(`  ${i}/${COUNT} [${secs}s] http=${res.status} ${info}`);
    } catch (e) {
      console.log(`  ${i}/${COUNT} REQUEST ERROR: ${e.message}`);
    }
  }
  console.log('\nDone. Check the app feed / your album under the account.');
})();
