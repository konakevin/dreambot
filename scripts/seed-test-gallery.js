#!/usr/bin/env node
/**
 * Seed ONE test gallery post so Kevin can verify the carousel end-to-end
 * (GALLERY_POSTS_PLAN.md Phase 1). Requires migration 356 applied.
 *
 * Targets a BOT post: get_feed excludes the viewer's own posts, so a gallery on
 * Kevin's own account wouldn't appear in his For You feed. A bot gallery shows
 * up in the feed (carousel + dots) AND on the bot's profile grid (stack badge).
 *
 * Picks a bot with >= N recent public posts, makes its NEWEST post the host
 * (position 0 = its existing cover), and adds the next few posts' images as
 * upload_media rows. The trigger sets uploads.media_count.
 *
 * Usage:
 *   node scripts/seed-test-gallery.js            # default 4 images
 *   node scripts/seed-test-gallery.js --count 6
 *   node scripts/seed-test-gallery.js --undo     # remove the seeded gallery
 */
require('dotenv').config({ path: '/Users/kevinmchenry/Development/apps/dreambot/.env.local' });
const { createClient } = require('@supabase/supabase-js');

const sb = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const arg = (k, d) => {
  const i = process.argv.indexOf(k);
  return i >= 0 ? process.argv[i + 1] : d;
};
const UNDO = process.argv.includes('--undo');
const COUNT = Math.max(2, Math.min(10, parseInt(arg('--count', '4'), 10)));

(async () => {
  if (UNDO) {
    // Strip media from any BOT-owned gallery. Bots never legitimately have
    // galleries in Phase 1, so this only removes our test seed — and it never
    // mutates any real column (just deletes the child rows; the trigger resets
    // media_count back to 1).
    const { data: botIds } = await sb.from('users').select('id').eq('is_bot', true);
    const ids = (botIds ?? []).map((b) => b.id);
    const { data: hosts } = await sb
      .from('uploads')
      .select('id')
      .gt('media_count', 1)
      .in('user_id', ids);
    for (const h of hosts ?? []) {
      await sb.from('upload_media').delete().eq('upload_id', h.id);
      console.log('undone:', h.id);
    }
    if (!hosts?.length) console.log('no bot gallery to undo');
    return;
  }

  // Find a bot with enough recent public posts.
  const { data: bots } = await sb.from('users').select('id, username').eq('is_bot', true).limit(50);
  let host = null;
  let others = [];
  for (const bot of bots ?? []) {
    const { data: posts } = await sb
      .from('uploads')
      .select('id, image_url, image_url_display, image_url_hq, thumbhash, width, height')
      .eq('user_id', bot.id)
      .eq('is_public', true)
      .not('posted_at', 'is', null)
      .order('posted_at', { ascending: false })
      .limit(COUNT);
    if ((posts?.length ?? 0) >= COUNT) {
      host = { ...posts[0], username: bot.username };
      others = posts.slice(1);
      break;
    }
  }
  if (!host) {
    console.error(`no bot found with >= ${COUNT} public posts`);
    process.exit(1);
  }

  // Guard: don't double-seed.
  const { count: existing } = await sb
    .from('upload_media')
    .select('id', { count: 'exact', head: true })
    .eq('upload_id', host.id);
  if (existing && existing > 0) {
    console.error(`host ${host.id} already has ${existing} media rows — run --undo first`);
    process.exit(1);
  }

  const pick = (r, pos) => ({
    upload_id: host.id,
    position: pos,
    image_url: r.image_url,
    image_url_display: r.image_url_display ?? null,
    image_url_hq: r.image_url_hq ?? null,
    thumbhash: r.thumbhash ?? null,
    width: r.width ?? null,
    height: r.height ?? null,
  });
  const rows = [pick(host, 0), ...others.map((r, i) => pick(r, i + 1))];

  const { error: insErr } = await sb.from('upload_media').insert(rows);
  if (insErr) {
    console.error('insert failed:', insErr.message);
    process.exit(1);
  }

  const { data: check } = await sb
    .from('uploads')
    .select('id, media_count')
    .eq('id', host.id)
    .single();
  console.log(`✅ seeded ${rows.length}-image gallery on @${host.username}`);
  console.log(`   host upload id: ${host.id}`);
  console.log(`   uploads.media_count = ${check?.media_count} (trigger)`);
  console.log(`   view: bots/For You feed, or the bot's profile grid (stack badge).`);
  console.log(`   undo: node scripts/seed-test-gallery.js --undo`);
})();
