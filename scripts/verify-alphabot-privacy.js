#!/usr/bin/env node
/**
 * AlphaBot privacy canary — proves the proving ground hasn't leaked.
 *
 * Re-run after ANY change to: uploads/users RLS, get_feed, get_bot_users,
 * get_public_profile, or the follows table semantics. Exits non-zero on any
 * leak. Requires at least one AlphaBot post (the standing 'privacy canary'
 * post, or any candidate render).
 *
 * Probes three principals:
 *   ANON   (website key)      — must see NOTHING
 *   REGULAR (bunny test user) — must see NOTHING
 *   SUPREME ADMIN (Kevin)     — must see the posts (follower)
 *
 * Run: node scripts/verify-alphabot-privacy.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const SB_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const ANON = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const admin = createClient(SB_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const KEVIN = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec'; // lib/superAdmin.ts
const BUNNY = '543efc6a-ef2a-46f0-9e49-f0aa7642e078'; // regular test account

let failures = 0;
function check(label, cond, detail) {
  console.log(`  ${cond ? '✓' : '✗ LEAK'} ${label}${cond ? '' : ` — ${detail}`}`);
  if (!cond) failures++;
}

async function mint(userId) {
  const { data: u } = await admin.auth.admin.getUserById(userId);
  const c = createClient(SB_URL, ANON);
  const { data: link } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email: u.user.email,
  });
  const { error } = await c.auth.verifyOtp({
    token_hash: link.properties.hashed_token,
    type: 'magiclink',
  });
  if (error) throw new Error(`otp for ${userId}: ${error.message}`);
  return c;
}

(async () => {
  const { data: alpha } = await admin
    .from('users')
    .select('id')
    .ilike('username', 'alphabot')
    .single();
  if (!alpha) {
    console.error('AlphaBot account not found');
    process.exit(1);
  }
  const ALPHA = alpha.id;

  const { data: posts } = await admin.from('uploads').select('id').eq('user_id', ALPHA).limit(1);
  if (!posts || posts.length === 0) {
    console.error('AlphaBot has no posts — seed one before verifying');
    process.exit(1);
  }
  const POST = posts[0].id;

  async function probe(name, c, viewerId, mustSee) {
    console.log(`${name}:`);
    const a = await c.from('uploads').select('id').eq('user_id', ALPHA);
    check(
      'uploads by author',
      mustSee ? (a.data || []).length > 0 : (a.data || []).length === 0,
      `${(a.data || []).length} rows`
    );
    const b = await c.from('uploads').select('id').eq('id', POST).maybeSingle();
    check('post by direct id', mustSee ? !!b.data : !b.data, 'row visible');
    if (viewerId) {
      for (const tab of ['forYou', 'following']) {
        const f = await c.rpc('get_feed', { p_user_id: viewerId, p_limit: 100, p_tab: tab });
        const hits = (f.data || []).filter((x) => x.user_id === ALPHA).length;
        check(`feed ${tab}`, mustSee ? hits > 0 : hits === 0, `${hits} posts`);
      }
    }
    const bots = await c.rpc('get_bot_users');
    const listed = (bots.data || []).some((x) => x.id === ALPHA);
    // Pill: only the supreme admin should ever get it (migration 339);
    // pre-339 it's hidden for everyone including the admin — accept either
    // for the admin, require hidden for the rest.
    check('bot pills', mustSee ? true : !listed, 'listed in get_bot_users');
  }

  const anonC = createClient(SB_URL, ANON);
  await probe('ANON (website key)', anonC, null, false);
  await probe('REGULAR USER (bunny)', await mint(BUNNY), BUNNY, false);
  await probe('SUPREME ADMIN (kevin)', await mint(KEVIN), KEVIN, true);

  if (failures) {
    console.error(`\n❌ ${failures} LEAK(S) — AlphaBot is visible where it must not be`);
    process.exit(1);
  }
  console.log('\n✅ AlphaBot privacy holds: anon + regular users see nothing, admin sees posts');
})();
