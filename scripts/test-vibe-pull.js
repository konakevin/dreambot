const { createClient } = require('@supabase/supabase-js');
const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY);
const EMAIL = 'konakevin@gmail.com';
const URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const USER_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';

const PRINCESS_PROMPT =
  'a princess having tea in her secret rose garden tower, surrounded by climbing pink roses, ' +
  'white peonies, and fluttering silk ribbons, golden hour light filtering through lattice windows, ' +
  'she looks like she is about to tell a wonderful secret';

async function getJwt() {
  const { data: linkData } = await sb.auth.admin.generateLink({ type: 'magiclink', email: EMAIL });
  const { data: otpData } = await sb.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: 'magiclink',
  });
  return otpData.session.access_token;
}

async function runCombo(combo, n, recipe) {
  const today = new Date().toISOString().slice(0, 10);
  await sb.from('ai_generation_budget').delete().eq('user_id', USER_ID).eq('date', today);
  const jwt = await getJwt();
  const label = `${combo.medium}+${combo.vibe} #${n}`;
  console.log(`\n>>> ${label}...`);
  const t0 = Date.now();
  const res = await fetch(`${URL}/functions/v1/generate-dream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
    body: JSON.stringify({
      mode: 'flux-dev',
      medium_key: combo.medium,
      vibe_key: combo.vibe,
      prompt: PRINCESS_PROMPT,
      vibe_profile: recipe,
      force_cast_role: 'plus_one',
    }),
  });
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.log(`  ERROR (${elapsed}s): non-JSON response [${res.status}]: ${text.slice(0, 150)}`);
    return { label, error: `http ${res.status}`, elapsed };
  }
  if (!res.ok) {
    console.log(`  ERROR (${elapsed}s): ${data.error || JSON.stringify(data).slice(0, 300)}`);
    return { label, error: data.error || 'unknown', elapsed };
  }
  const url = data.image_url || data.url || '(no url)';
  console.log(`  ${elapsed}s | ${url}`);
  return { label, url, elapsed };
}

(async () => {
  const { data: recipeRow } = await sb
    .from('user_recipes')
    .select('recipe')
    .eq('user_id', USER_ID)
    .single();
  if (!recipeRow?.recipe?.dream_cast) throw new Error('No dream_cast on user_recipe');
  const recipe = recipeRow.recipe;
  console.log(`>>> prompt: "${PRINCESS_PROMPT}"\n>>> cast role: plus_one`);

  const runs = [
    { medium: 'fairytale', vibe: 'coquette', reps: 3 },
  ];
  const results = [];
  for (const combo of runs) {
    for (let n = 1; n <= combo.reps; n++) {
      results.push(await runCombo(combo, n, recipe));
    }
  }

  console.log('\n=== Summary ===');
  for (const r of results) {
    if (r.error) console.log(`  ${r.label} (${r.elapsed}s): ERROR ${r.error}`);
    else console.log(`  ${r.label} (${r.elapsed}s): ${r.url}`);
  }
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
