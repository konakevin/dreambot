/**
 * Test how V4 handles different user-effort tiers across multiple vibes.
 * Same medium (canvas) + 3 tiers × 2 reps per vibe.
 */
const { createClient } = require('@supabase/supabase-js');
const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY);
const EMAIL = 'konakevin@gmail.com';
const URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const USER_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';

const MEDIUM = 'canvas';

// Default: all active vibes minus coquette + nightshade (already tested).
// Override via CLI: `node scripts/test-prompt-tier.js vibe1 vibe2`
const DEFAULT_VIBES = [
  'cinematic',
  'dark',
  'cozy',
  'minimal',
  'epic',
  'nostalgic',
  'psychedelic',
  'peaceful',
  'whimsical',
  'ethereal',
  'arcane',
  'ancient',
  'enchanted',
  'fierce',
  'macabre',
  'shimmer',
  'surreal',
  'voltage',
];
const VIBES = process.argv.slice(2).length > 0 ? process.argv.slice(2) : DEFAULT_VIBES;

const TIERS = [
  { label: 'A-empty', prompt: '', reps: 2 },
  { label: 'B-weak', prompt: 'cat', reps: 2 },
  { label: 'C-evocative', prompt: 'princess', reps: 2 },
];

async function getJwt() {
  const { data: linkData } = await sb.auth.admin.generateLink({ type: 'magiclink', email: EMAIL });
  const { data: otpData } = await sb.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: 'magiclink',
  });
  return otpData.session.access_token;
}

async function runOne(vibe, tier, n, recipe) {
  const today = new Date().toISOString().slice(0, 10);
  await sb.from('ai_generation_budget').delete().eq('user_id', USER_ID).eq('date', today);
  const jwt = await getJwt();
  const label = `${vibe} ${tier.label} #${n}${tier.prompt ? ` ("${tier.prompt}")` : ' (empty)'}`;
  const t0 = Date.now();
  const body = {
    mode: 'flux-dev',
    medium_key: MEDIUM,
    vibe_key: vibe,
    vibe_profile: recipe,
  };
  if (tier.prompt) body.prompt = tier.prompt;
  const res = await fetch(`${URL}/functions/v1/generate-dream`, {
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
    console.log(`  ${label}: ERROR (${elapsed}s): non-JSON [${res.status}]`);
    return { label, error: `http ${res.status}`, elapsed };
  }
  if (!res.ok) {
    console.log(`  ${label}: ERROR (${elapsed}s): ${data.error || JSON.stringify(data).slice(0, 200)}`);
    return { label, error: data.error || 'unknown', elapsed };
  }
  const url = data.image_url || data.url || '(no url)';
  console.log(`  ${label} (${elapsed}s): ${url}`);
  return { label, url, elapsed, vibe, tier: tier.label };
}

(async () => {
  const { data: recipeRow } = await sb
    .from('user_recipes')
    .select('recipe')
    .eq('user_id', USER_ID)
    .single();
  if (!recipeRow?.recipe?.dream_cast) throw new Error('No dream_cast on user_recipe');
  console.log(`>>> Medium: ${MEDIUM} | Vibes: ${VIBES.length} | Tiers: ${TIERS.length} × ${TIERS[0].reps} reps = ${VIBES.length * TIERS.length * TIERS[0].reps} renders\n`);

  const results = [];
  for (const vibe of VIBES) {
    console.log(`\n━━━ ${vibe.toUpperCase()} ━━━`);
    for (const tier of TIERS) {
      for (let n = 1; n <= tier.reps; n++) {
        results.push(await runOne(vibe, tier, n, recipeRow.recipe));
      }
    }
  }

  console.log('\n=== Summary (by vibe) ===');
  for (const vibe of VIBES) {
    console.log(`\n${vibe}:`);
    for (const r of results.filter((x) => x.vibe === vibe)) {
      if (r.error) console.log(`  ${r.label}: ERROR ${r.error}`);
      else console.log(`  ${r.label}: ${r.url}`);
    }
  }
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
