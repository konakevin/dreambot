#!/usr/bin/env node
/**
 * Test slotted nightly seeds through the ACTUAL nightly path.
 * Posts 9 dreams: 3 character-only, 3 character+object, 3 character+location.
 */

const { createClient } = require('@supabase/supabase-js');

function readEnvFile() {
  try {
    const lines = require('fs').readFileSync('.env.local', 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch { return {}; }
}
const envFile = readEnvFile();
const getKey = (name) => process.env[name] || envFile[name];

const SUPABASE_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const sb = createClient(SUPABASE_URL, getKey('SUPABASE_SERVICE_ROLE_KEY'));
const KEVIN_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';

const TESTS = [
  { label: 'face-swap 1/3', force_nightly_path: 'cast_random' },
  { label: 'face-swap 2/3', force_nightly_path: 'cast_random' },
  { label: 'face-swap 3/3', force_nightly_path: 'cast_random' },
];

(async () => {
  // Get JWT for Kevin
  const { data: linkData, error: linkErr } = await sb.auth.admin.generateLink({
    type: 'magiclink',
    email: 'konakevin@gmail.com',
  });
  if (linkErr) { console.error('❌ Link failed:', linkErr.message); process.exit(1); }
  const { data: otpData, error: otpErr } = await sb.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: 'magiclink',
  });
  if (otpErr || !otpData.session) { console.error('❌ Auth failed:', otpErr?.message); process.exit(1); }
  const jwt = otpData.session.access_token;
  console.log('🔑 Authenticated as Kevin');

  // Get Kevin's vibe profile
  const { data: recipeData } = await sb.from('user_recipes').select('recipe').eq('user_id', KEVIN_ID).single();
  const vibeProfile = recipeData?.recipe;
  if (!vibeProfile) { console.error('❌ No vibe profile'); process.exit(1); }
  console.log(`👤 Cast: ${(vibeProfile.dream_cast || []).map(c => c.role).join(', ')}`);
  console.log(`📍 Places: ${(vibeProfile.dream_seeds?.places || []).join(', ')}`);
  console.log(`🎸 Things: ${[...(vibeProfile.dream_seeds?.things || []), ...(vibeProfile.dream_seeds?.characters || [])].join(', ')}\n`);

  let posted = 0;

  for (let i = 0; i < TESTS.length; i++) {
    const test = TESTS[i];
    console.log(`\n🎨 [${i + 1}/9] ${test.label}`);

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-dream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          mode: 'flux-dev',
          medium_key: 'surprise_me',
          vibe_key: 'surprise_me',
          vibe_profile: vibeProfile,
          force_cast_role: 'self',
          force_nightly_path: test.force_nightly_path,
          force_medium: ['pencil','anime','comics','shimmer','twilight','surreal','photography','neon'][Math.floor(Math.random() * 8)],
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`${res.status}: ${err.slice(0, 300)}`);
      }

      const result = await res.json();
      if (result.upload_id) {
        await sb.from('uploads').update({ is_active: true, is_posted: true }).eq('id', result.upload_id);
        console.log(`   ✅ Posted! (${++posted}/9)`);
      } else {
        console.log('   ⚠️ No upload_id:', JSON.stringify(result).slice(0, 200));
      }
    } catch (err) {
      console.error(`   ❌ Failed:`, err.message);
    }

    await new Promise(r => setTimeout(r, 3000));
  }

  console.log(`\n🎉 Done. ${posted}/9 dreams posted.`);
})();
