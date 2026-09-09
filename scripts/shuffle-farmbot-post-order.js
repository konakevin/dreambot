#!/usr/bin/env node
/**
 * One-off: shuffle FarmBot's posted_at values across all its posted uploads
 * so the profile grid (ordered by posted_at DESC — hooks/usePublicProfilePosts.ts)
 * doesn't show renders clustered by QA batch/path (e.g. 5 pineapple shots in
 * a row, then 5 mango shots). Kevin: "mix up the order in preparation for
 * live."
 *
 * Reassigns which upload gets which posted_at — does NOT touch created_at
 * (the true generation record) and does NOT change the actual SET of
 * timestamps (same time span, just a randomized upload-to-slot mapping), so
 * this can't create weird gaps or artifacts, only reorder.
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const FARMBOT_ID = '754ad892-3e52-41d9-9364-e41fe081812c';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function main() {
  const sb = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data: rows, error } = await sb
    .from('uploads')
    .select('id, posted_at')
    .eq('user_id', FARMBOT_ID)
    .eq('is_posted', true)
    .order('posted_at', { ascending: false });

  if (error) {
    console.error('FETCH FAILED:', error);
    process.exit(1);
  }
  console.log(`Fetched ${rows.length} posted uploads.`);

  const slots = rows.map((r) => r.posted_at); // the real timestamp set, unchanged
  const shuffledIds = shuffle(rows.map((r) => r.id));

  let updated = 0;
  const CONCURRENCY = 8;
  for (let i = 0; i < shuffledIds.length; i += CONCURRENCY) {
    const batch = shuffledIds.slice(i, i + CONCURRENCY).map((id, j) => ({
      id,
      posted_at: slots[i + j],
    }));
    await Promise.all(
      batch.map(async ({ id, posted_at }) => {
        const { error: updErr } = await sb.from('uploads').update({ posted_at }).eq('id', id);
        if (updErr) console.error(`  FAILED ${id}:`, updErr.message);
        else updated++;
      })
    );
    process.stdout.write(`\r  updated ${updated}/${shuffledIds.length}`);
  }
  console.log(`\nDone — ${updated}/${shuffledIds.length} posted_at values reassigned.`);
}

main().catch((e) => {
  console.error('FAILED:', e);
  process.exit(1);
});
