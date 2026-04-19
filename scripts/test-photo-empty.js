/**
 * Test the photo-restyle "surprise me" path — empty prompt, just photo + medium + vibe.
 * How does the system invent a scene around a user's photo when they give no direction?
 *
 * Uses the self cast's thumb_url as the input photo. Runs N mediums × 2 reps each.
 *
 * Usage:
 *   node scripts/test-photo-empty.js                        # defaults: canvas,pencil,photography × coquette
 *   node scripts/test-photo-empty.js nightshade             # same mediums × nightshade
 *   node scripts/test-photo-empty.js nightshade canvas,anime,pencil
 */
const { createClient } = require('@supabase/supabase-js');
const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY);
const EMAIL = 'konakevin@gmail.com';
const URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const USER_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';

const args = process.argv.slice(2);
const VIBE = args[0] || 'coquette';
const MEDIUMS = (args[1] || 'canvas').split(',');
const REPS = parseInt(args[2] || '3', 10);
const CAST_ROLE = args[3] || 'plus_one';
const HINT = args[4] || '';  // pass a prompt string to test photo+prompt path

async function getJwt() {
  const { data: linkData } = await sb.auth.admin.generateLink({ type: 'magiclink', email: EMAIL });
  const { data: otpData } = await sb.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: 'magiclink',
  });
  return otpData.session.access_token;
}

async function runOne(medium, n, photoUrl, recipe) {
  const today = new Date().toISOString().slice(0, 10);
  await sb.from('ai_generation_budget').delete().eq('user_id', USER_ID).eq('date', today);
  const jwt = await getJwt();
  const label = `${medium}+${VIBE} #${n}`;
  const t0 = Date.now();
  // No `hint` = empty/surprise-me case
  const res = await fetch(`${URL}/functions/v1/restyle-photo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
    body: JSON.stringify({
      mode: 'flux-kontext',
      input_image: photoUrl,
      medium_key: medium,
      vibe_key: VIBE,
      vibe_profile: recipe,
      ...(HINT ? { hint: HINT } : {}),
    }),
  });
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.log(`  ${label} (${elapsed}s): non-JSON [${res.status}]: ${text.slice(0, 150)}`);
    return { label, error: true };
  }
  if (!res.ok) {
    console.log(`  ${label} (${elapsed}s): ERROR ${data.error || 'unknown'}`);
    return { label, error: true };
  }
  console.log(`  ${label} (${elapsed}s): ${data.image_url}`);
  return { label, url: data.image_url };
}

(async () => {
  const { data: recipeRow } = await sb
    .from('user_recipes')
    .select('recipe')
    .eq('user_id', USER_ID)
    .single();
  if (!recipeRow?.recipe?.dream_cast) throw new Error('No dream_cast on user_recipe');
  const cast = recipeRow.recipe.dream_cast.find((m) => m.role === CAST_ROLE);
  if (!cast?.thumb_url) throw new Error(`No ${CAST_ROLE} cast thumb_url`);

  console.log(`>>> Photo source: ${CAST_ROLE} cast thumb_url`);
  console.log(`>>> Vibe: ${VIBE} | Mediums: ${MEDIUMS.join(', ')} | Reps: ${REPS}`);
  console.log(`>>> Mode: flux-kontext (restyle) | Hint: ${HINT || '(none - surprise me)'}\n`);

  for (const medium of MEDIUMS) {
    console.log(`━━━ ${medium} ━━━`);
    for (let n = 1; n <= REPS; n++) {
      await runOne(medium, n, cast.thumb_url, recipeRow.recipe);
    }
  }
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
