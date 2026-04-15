#!/usr/bin/env node
/**
 * Test nightly dreams using Kontext with cast photo as input.
 * Takes the user's cast photo, picks a random scene + face-swap medium,
 * and runs it through the photo restyle path via Kontext.
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
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const FACE_SWAP_MEDIUMS = ['pencil', 'anime', 'comics', 'shimmer', 'twilight', 'surreal', 'photography', 'neon'];

const SCENE_HINTS = [
  'standing on the edge of a crumbling ancient temple high above a sea of clouds at golden hour, wind whipping through the scene',
  'riding a massive dragon through a lightning storm over an erupting volcano, lava rivers glowing below',
  'in a vast neon-lit cyberpunk city at night, rain-soaked streets reflecting holographic billboards stretching into the sky',
];

(async () => {
  // Get JWT for Kevin
  const { data: linkData, error: linkErr } = await sb.auth.admin.generateLink({
    type: 'magiclink', email: 'konakevin@gmail.com',
  });
  if (linkErr) { console.error('❌', linkErr.message); process.exit(1); }
  const { data: otpData, error: otpErr } = await sb.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token, type: 'magiclink',
  });
  if (otpErr || !otpData.session) { console.error('❌', otpErr?.message); process.exit(1); }
  const jwt = otpData.session.access_token;
  console.log('🔑 Authenticated');

  // Get Kevin's cast photo
  const { data: recipeData } = await sb.from('user_recipes').select('recipe').eq('user_id', KEVIN_ID).single();
  const cast = recipeData?.recipe?.dream_cast || [];
  const selfCast = cast.find(c => c.role === 'self');
  if (!selfCast || !selfCast.thumb_url) { console.error('❌ No self cast photo'); process.exit(1); }
  console.log('📸 Cast photo:', selfCast.thumb_url.slice(-40));

  // Get vibes
  const { data: vibes } = await sb.rpc('get_dream_vibes');
  const activeVibes = vibes || [];

  let posted = 0;

  for (let i = 0; i < 3; i++) {
    const medium = pick(FACE_SWAP_MEDIUMS);
    const vibe = pick(activeVibes);
    const scene = SCENE_HINTS[i];

    console.log(`\n🎨 [${i + 1}/3] ${medium} + ${vibe.key}`);
    console.log(`   📝 ${scene.slice(0, 80)}...`);

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-dream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          mode: 'flux-kontext',
          medium_key: medium,
          vibe_key: vibe.key,
          input_image: selfCast.thumb_url,
          photo_style: 'restyle',
          hint: scene,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`${res.status}: ${err.slice(0, 300)}`);
      }

      const result = await res.json();
      if (result.upload_id) {
        await sb.from('uploads').update({ is_active: true, is_posted: true }).eq('id', result.upload_id);
        console.log(`   ✅ Posted! (${++posted}/3)`);
      } else {
        console.log('   ⚠️', JSON.stringify(result).slice(0, 200));
      }
    } catch (err) {
      console.error(`   ❌`, err.message);
    }

    await new Promise(r => setTimeout(r, 3000));
  }

  console.log(`\n🎉 Done. ${posted}/3 posted.`);
})();
