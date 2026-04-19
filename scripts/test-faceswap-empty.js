/**
 * Test the face-swap + surprise-me path.
 * generate-dream with force_cast_role (no prompt, no photo input) — Sonnet
 * invents a scene, Flux renders with character placeholder, face-swap pastes
 * the real face on.
 *
 * Usage:
 *   node scripts/test-faceswap-empty.js                                   # plus_one + canvas + coquette × 3
 *   node scripts/test-faceswap-empty.js self                              # self instead of plus_one
 *   node scripts/test-faceswap-empty.js plus_one pencil nightshade 5      # custom
 */
const { createClient } = require('@supabase/supabase-js');
const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY);
const EMAIL = 'konakevin@gmail.com';
const URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const USER_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';

const args = process.argv.slice(2);
const CAST_ROLE = args[0] || 'plus_one';
const MEDIUM = args[1] || 'canvas';
const VIBE = args[2] || 'coquette';
const REPS = parseInt(args[3] || '3', 10);

async function getJwt() {
  const { data: linkData } = await sb.auth.admin.generateLink({ type: 'magiclink', email: EMAIL });
  const { data: otpData } = await sb.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: 'magiclink',
  });
  return otpData.session.access_token;
}

async function runOne(n, recipe) {
  const today = new Date().toISOString().slice(0, 10);
  await sb.from('ai_generation_budget').delete().eq('user_id', USER_ID).eq('date', today);
  const jwt = await getJwt();
  const t0 = Date.now();
  const res = await fetch(`${URL}/functions/v1/generate-dream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
    body: JSON.stringify({
      mode: 'flux-dev',
      medium_key: MEDIUM,
      vibe_key: VIBE,
      vibe_profile: recipe,
      force_cast_role: CAST_ROLE,
      // No prompt = surprise-me
    }),
  });
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.log(`#${n} (${elapsed}s): non-JSON [${res.status}]: ${text.slice(0, 150)}`);
    return;
  }
  if (!res.ok) {
    console.log(`#${n} (${elapsed}s): ERROR ${data.error || 'unknown'}`);
    return;
  }
  console.log(`#${n} (${elapsed}s): ${data.image_url}`);
}

(async () => {
  const { data: recipeRow } = await sb
    .from('user_recipes')
    .select('recipe')
    .eq('user_id', USER_ID)
    .single();
  if (!recipeRow?.recipe?.dream_cast) throw new Error('No dream_cast on user_recipe');
  console.log(`>>> Path: generate-dream + force_cast_role=${CAST_ROLE} (face-swap)`);
  console.log(`>>> Medium: ${MEDIUM} | Vibe: ${VIBE} | Renders: ${REPS} | Empty prompt\n`);

  for (let n = 1; n <= REPS; n++) {
    await runOne(n, recipeRow.recipe);
  }
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
