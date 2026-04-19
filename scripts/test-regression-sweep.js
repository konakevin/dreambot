/**
 * Ship 4 — regression sweep after photo-path overhaul.
 * Exercises each user-facing path once (cheap), confirms it renders without error.
 * Photo-based paths use wife's cast thumb as the input photo.
 *
 * Usage:
 *   node scripts/test-regression-sweep.js
 */
const { createClient } = require('@supabase/supabase-js');
const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY);
const EMAIL = 'konakevin@gmail.com';
const URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const USER_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';

async function getJwt() {
  const { data: linkData } = await sb.auth.admin.generateLink({ type: 'magiclink', email: EMAIL });
  const { data: otpData } = await sb.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: 'magiclink',
  });
  return otpData.session.access_token;
}

async function clearBudget() {
  const today = new Date().toISOString().slice(0, 10);
  await sb.from('ai_generation_budget').delete().eq('user_id', USER_ID).eq('date', today);
}

async function call(endpoint, body) {
  await clearBudget();
  const jwt = await getJwt();
  const t0 = Date.now();
  const res = await fetch(`${URL}/functions/v1/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
    body: JSON.stringify(body),
  });
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return { elapsed, ok: false, error: `non-JSON [${res.status}]: ${text.slice(0, 120)}` };
  }
  return {
    elapsed,
    ok: res.ok,
    data,
    error: res.ok ? null : (data.error || 'unknown'),
  };
}

(async () => {
  const { data: recipeRow } = await sb
    .from('user_recipes')
    .select('recipe')
    .eq('user_id', USER_ID)
    .single();
  const recipe = recipeRow.recipe;
  const plusOne = recipe.dream_cast.find((m) => m.role === 'plus_one');
  const wifePhotoUrl = plusOne.thumb_url;

  const results = [];
  const run = async (label, fn) => {
    console.log(`\n>>> ${label}`);
    try {
      const r = await fn();
      console.log(`  ${r.ok ? '✓' : '✗'} ${r.elapsed}s ${r.ok ? r.data.image_url : r.error}`);
      results.push({ label, ok: r.ok, elapsed: r.elapsed, url: r.ok ? r.data.image_url : null, error: r.error });
    } catch (e) {
      console.log(`  ✗ FAIL: ${e.message}`);
      results.push({ label, ok: false, error: e.message });
    }
  };

  console.log('━━━ TEXT PATHS ━━━');

  await run('1. Surprise (no prompt, no photo)', () =>
    call('generate-dream', {
      mode: 'flux-dev',
      medium_key: 'canvas',
      vibe_key: 'coquette',
      vibe_profile: recipe,
    })
  );

  await run('2. Text prompt', () =>
    call('generate-dream', {
      mode: 'flux-dev',
      medium_key: 'canvas',
      vibe_key: 'coquette',
      vibe_profile: recipe,
      prompt: 'a princess in a rose garden',
    })
  );

  await run('3. Self-reference text (put me in ...)', () =>
    call('generate-dream', {
      mode: 'flux-dev',
      medium_key: 'canvas',
      vibe_key: 'coquette',
      vibe_profile: recipe,
      prompt: 'put me in a Parisian cafe',
    })
  );

  console.log('\n━━━ PHOTO PATHS ━━━');

  await run('4. Photo restyle (Kontext, no hint)', () =>
    call('restyle-photo', {
      mode: 'flux-kontext',
      input_image: wifePhotoUrl,
      medium_key: 'canvas',
      vibe_key: 'coquette',
      vibe_profile: recipe,
    })
  );

  await run('5. Photo restyle + hint', () =>
    call('restyle-photo', {
      mode: 'flux-kontext',
      input_image: wifePhotoUrl,
      medium_key: 'canvas',
      vibe_key: 'coquette',
      vibe_profile: recipe,
      hint: 'turn me into a fairytale princess',
    })
  );

  await run('6. Photo new_scene (no pre-classification)', () =>
    call('generate-dream', {
      mode: 'flux-kontext',
      medium_key: 'canvas',
      vibe_key: 'coquette',
      vibe_profile: recipe,
      input_image: wifePhotoUrl,
      photo_style: 'new_scene',
    })
  );

  await run('7. Photo new_scene + pre-classified person', () =>
    call('generate-dream', {
      mode: 'flux-kontext',
      medium_key: 'canvas',
      vibe_key: 'coquette',
      vibe_profile: recipe,
      input_image: wifePhotoUrl,
      photo_style: 'new_scene',
      subject_description: 'A woman with shoulder-length chestnut brown wavy hair, warm genuine smile',
      subject_type: 'person',
    })
  );

  console.log('\n━━━ SUMMARY ━━━');
  const passed = results.filter((r) => r.ok).length;
  console.log(`${passed} / ${results.length} passed\n`);
  for (const r of results) {
    console.log(`  ${r.ok ? '✓' : '✗'} ${r.label}${r.ok ? '' : ` — ${r.error}`}`);
  }
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
