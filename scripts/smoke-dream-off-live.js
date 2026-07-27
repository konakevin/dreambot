/**
 * Dream Off LIVE smoke test — drives the real, deployed stack through the
 * auth-gated RPC surface with two real users. This is what CI's throwaway DB
 * can't do: it proves create_game / join_game_by_code / advance_phase / the read
 * RPCs / cancel_game work end-to-end against production with real JWTs.
 *
 * It does NOT render (skips the entry submit → no cost, no edge dependency beyond
 * the RPCs). Rendering + voting are validated manually (see
 * DREAM_OFF_DEPLOY_AND_TEST.md). It self-cleans by cancelling the game.
 *
 * Prereqs:
 *   - engine_config.dream_off_enabled = true  (script refuses otherwise)
 *   - two EXISTING test accounts, passed via env (NOT created here, to avoid
 *     firing onboarding/welcome-bonus triggers in prod):
 *       DREAM_OFF_SMOKE_EMAIL_1 / DREAM_OFF_SMOKE_PW_1
 *       DREAM_OFF_SMOKE_EMAIL_2 / DREAM_OFF_SMOKE_PW_2
 *
 * Run:
 *   export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && node scripts/smoke-dream-off-live.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const URL = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const ANON = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

const E1 = process.env.DREAM_OFF_SMOKE_EMAIL_1;
const P1 = process.env.DREAM_OFF_SMOKE_PW_1;
const E2 = process.env.DREAM_OFF_SMOKE_EMAIL_2;
const P2 = process.env.DREAM_OFF_SMOKE_PW_2;

let step = 0;
const pass = (m) => console.log(`✅ ${++step}. ${m}`);
function fail(m, e) {
  console.error(`❌ ${++step}. ${m}${e ? ` — ${e.message || e}` : ''}`);
  process.exit(1);
}

async function signIn(email, pw) {
  const c = createClient(URL, ANON, { auth: { persistSession: false } });
  const { data, error } = await c.auth.signInWithPassword({ email, password: pw });
  if (error) fail(`sign in ${email}`, error);
  return createClient(URL, ANON, {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${data.session.access_token}` } },
  });
}

(async () => {
  if (!URL || !ANON || !SERVICE)
    fail('missing SUPABASE_URL / ANON / SERVICE_ROLE_KEY in .env.local');
  if (!E1 || !P1 || !E2 || !P2) {
    fail(
      'missing test creds. Set DREAM_OFF_SMOKE_EMAIL_1/PW_1 + _2/PW_2 to two existing test accounts.'
    );
  }

  const admin = createClient(URL, SERVICE);
  const { data: cfg } = await admin
    .from('engine_config')
    .select('dream_off_enabled')
    .eq('id', 1)
    .single();
  if (!cfg?.dream_off_enabled)
    fail('dream_off_enabled is false — flip it on before smoke-testing.');
  pass('kill-switch is ON');

  const u1 = await signIn(E1, P1);
  const u2 = await signIn(E2, P2);
  pass('both test users signed in');

  // 1) Owner creates a scene game (custom topic — no deal_topic/pack dependency).
  const { data: created, error: cErr } = await u1.rpc('create_game', {
    p_topic: 'smoke test — a cute taco playing in a mariachi band',
    p_topic_source: 'custom',
    p_pack_category: 'scene',
  });
  if (cErr) fail('create_game', cErr);
  const gameId = created.game_id;
  const code = created.invite_code;
  if (!gameId || !/^[A-Z2-9]{6,10}$/.test(code || '')) fail('create_game returned a bad game/code');
  pass(`created game ${gameId.slice(0, 8)} (code ${code})`);

  // 2) Second user joins by code.
  const { error: jErr } = await u2.rpc('join_game_by_code', { p_code: code });
  if (jErr) fail('join_game_by_code', jErr);
  pass('second user joined by code');

  // 3) Both read the room; owner sees >=2 players + the invite code.
  const { data: room1, error: r1e } = await u1.rpc('get_game_room', { p_game_id: gameId });
  if (r1e) fail('get_game_room (owner)', r1e);
  if (!room1 || room1.player_count < 2 || !room1.is_owner || !room1.invite_code) {
    fail(`owner room state wrong: players=${room1?.player_count} owner=${room1?.is_owner}`);
  }
  const { data: room2 } = await u2.rpc('get_game_room', { p_game_id: gameId });
  if (room2?.status !== 'ok' || room2?.is_owner) fail('member room state wrong for user 2');
  pass(`room reads correct (players=${room1.player_count}, member views scoped)`);

  // 4) get_game_players roster (migration 422).
  const { data: players, error: pErr } = await u1.rpc('get_game_players', { p_game_id: gameId });
  if (pErr) fail('get_game_players', pErr);
  if (!Array.isArray(players) || players.length < 2) fail('roster should list both players');
  pass(`roster lists ${players.length} players`);

  // 5) Owner advances setup -> submission.
  const { data: phase, error: aErr } = await u1.rpc('advance_phase', { p_game_id: gameId });
  if (aErr) fail('advance_phase', aErr);
  if (phase !== 'submission') fail(`expected submission, got ${phase}`);
  pass('owner advanced setup -> submission');

  // 6) A non-owner cannot advance (owner-only guard).
  const { error: guardErr } = await u2.rpc('advance_phase', { p_game_id: gameId });
  if (!guardErr) fail('non-owner advance_phase should have been rejected');
  pass('non-owner advance correctly rejected');

  // 7) Cleanup: cancel the game (refunds, terminal) so we leave no live game.
  const { error: xErr } = await u1.rpc('cancel_game', { p_game_id: gameId });
  if (xErr) fail('cancel_game (cleanup)', xErr);
  pass('cancelled the smoke game (cleanup)');

  console.log(
    '\n✅ LIVE SMOKE PASSED — create / join / room reads / roster / advance / owner-guard / cancel all good.\n' +
      '   (Rendering + voting are validated manually — see DREAM_OFF_DEPLOY_AND_TEST.md.)'
  );
  process.exit(0);
})();
