/**
 * Test within-vibe diversity — N empty-prompt renders on ONE medium+vibe combo.
 * Are we getting 10 cathedrals, or 10 different gothic scenes?
 *
 * Usage:
 *   node scripts/test-empty-diversity.js                  # canvas + nightshade × 10
 *   node scripts/test-empty-diversity.js canvas coquette  # coquette × 10
 *   node scripts/test-empty-diversity.js canvas nightshade 15  # × 15
 */
const { createClient } = require('@supabase/supabase-js');
const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY);
const EMAIL = 'konakevin@gmail.com';
const URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const USER_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';

const args = process.argv.slice(2);
const MEDIUM = args[0] || 'canvas';
const VIBE = args[1] || 'nightshade';
const COUNT = parseInt(args[2] || '10', 10);

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
    }),
  });
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.log(`#${n} (${elapsed}s): non-JSON [${res.status}]`);
    return { n, error: true };
  }
  if (!res.ok) {
    console.log(`#${n} (${elapsed}s): ERROR ${data.error || 'unknown'}`);
    return { n, error: true };
  }
  console.log(`#${n} (${elapsed}s): ${data.image_url}`);
  return { n, url: data.image_url };
}

(async () => {
  const { data: recipeRow } = await sb
    .from('user_recipes')
    .select('recipe')
    .eq('user_id', USER_ID)
    .single();
  if (!recipeRow?.recipe) throw new Error('No user_recipe');
  console.log(`>>> Medium: ${MEDIUM} | Vibe: ${VIBE} | Renders: ${COUNT} | Empty prompt`);
  console.log(`>>> Goal: see if empty prompts produce diverse scenes WITHIN this vibe\n`);

  for (let n = 1; n <= COUNT; n++) {
    await runOne(n, recipeRow.recipe);
  }

  console.log('\n(After running, pull the ai_prompts to compare scene variety across the batch)');
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
