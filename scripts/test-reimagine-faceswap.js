/**
 * Test Ship 2 — reimagine path + face-swap.
 * Sends photo + medium + vibe to generate-dream with photo_style='reimagine'.
 * If the medium is face-swap eligible, the input photo's face should be
 * preserved on the Sonnet-invented scene.
 *
 * Usage:
 *   node scripts/test-reimagine-faceswap.js                                      # plus_one + canvas + coquette × 3
 *   node scripts/test-reimagine-faceswap.js self pencil nightshade 3             # custom
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
const PHOTO_STYLE = args[4] || 'new_scene';  // 'new_scene' or 'reimagine'

async function getJwt() {
  const { data: linkData } = await sb.auth.admin.generateLink({ type: 'magiclink', email: EMAIL });
  const { data: otpData } = await sb.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: 'magiclink',
  });
  return otpData.session.access_token;
}

async function runOne(n, photoUrl, recipe) {
  const today = new Date().toISOString().slice(0, 10);
  await sb.from('ai_generation_budget').delete().eq('user_id', USER_ID).eq('date', today);
  const jwt = await getJwt();
  const t0 = Date.now();
  const res = await fetch(`${URL}/functions/v1/generate-dream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
    body: JSON.stringify({
      mode: 'flux-kontext',
      input_image: photoUrl,
      photo_style: PHOTO_STYLE,
      medium_key: MEDIUM,
      vibe_key: VIBE,
      vibe_profile: recipe,
      // No hint = surprise-me
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
  const cast = recipeRow.recipe.dream_cast.find((m) => m.role === CAST_ROLE);
  if (!cast?.thumb_url) throw new Error(`No ${CAST_ROLE} thumb_url`);

  console.log(`>>> Path: generate-dream + photo_style=${PHOTO_STYLE} (Ship 2)`);
  console.log(`>>> Photo: ${CAST_ROLE} | Medium: ${MEDIUM} | Vibe: ${VIBE} | Empty hint (surprise-me)\n`);

  for (let n = 1; n <= REPS; n++) {
    await runOne(n, cast.thumb_url, recipeRow.recipe);
  }
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
