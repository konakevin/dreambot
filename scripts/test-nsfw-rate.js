/**
 * Ship 4 — NSFW flag rate A/B test.
 * Runs N coquette+female face-swap renders back-to-back, reports how many
 * tripped the safety filter (before and after the Ship 2.5 retry + 'hot'
 * scrub). The retry logic now gives each generation up to 3 attempts before
 * surfacing an NSFW error — measures both "had to retry" and "failed
 * entirely after retries" rates.
 */
const { createClient } = require('@supabase/supabase-js');
const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY);
const EMAIL = 'konakevin@gmail.com';
const URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const USER_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';

const args = process.argv.slice(2);
const COUNT = parseInt(args[0] || '10', 10);
const MEDIUM = 'canvas';
const VIBE = 'coquette';
const CAST_ROLE = 'plus_one'; // wife (female)

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
    }),
  });
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return { n, outcome: 'error', elapsed, detail: `non-JSON [${res.status}]` };
  }
  if (!res.ok) {
    if (data.nsfw || (data.error || '').includes('NSFW')) {
      return { n, outcome: 'nsfw_failed', elapsed, detail: data.error };
    }
    return { n, outcome: 'error', elapsed, detail: data.error || 'unknown' };
  }
  return { n, outcome: 'success', elapsed, url: data.image_url };
}

(async () => {
  const { data: recipeRow } = await sb
    .from('user_recipes')
    .select('recipe')
    .eq('user_id', USER_ID)
    .single();

  console.log(`>>> NSFW flag rate test: ${COUNT} × ${MEDIUM}+${VIBE} face-swap (${CAST_ROLE})\n`);
  const results = [];
  for (let n = 1; n <= COUNT; n++) {
    const r = await runOne(n, recipeRow.recipe);
    const icon = r.outcome === 'success' ? '✓' : r.outcome === 'nsfw_failed' ? '🚫' : '✗';
    console.log(`  ${icon} #${n} (${r.elapsed}s) ${r.outcome}${r.detail ? ` — ${r.detail.slice(0, 80)}` : ''}`);
    results.push(r);
  }

  // Query logs for nsfwRetries
  const { data: logs } = await sb
    .from('ai_generation_log')
    .select('rolled_axes')
    .eq('user_id', USER_ID)
    .order('created_at', { ascending: false })
    .limit(COUNT);
  const retryCounts = (logs || [])
    .map((l) => (l.rolled_axes || {}).nsfwRetries ?? 0)
    .filter((n) => typeof n === 'number');

  const success = results.filter((r) => r.outcome === 'success').length;
  const nsfwFailed = results.filter((r) => r.outcome === 'nsfw_failed').length;
  const otherError = results.filter((r) => r.outcome === 'error').length;
  const passedWithRetry = retryCounts.filter((n) => n > 0).length;

  console.log('\n━━━ RESULTS ━━━');
  console.log(`  Success (passed first try):      ${success - passedWithRetry} / ${COUNT}`);
  console.log(`  Success after retry:             ${passedWithRetry} / ${COUNT}`);
  console.log(`  NSFW (exhausted retries):        ${nsfwFailed} / ${COUNT}  ← user-facing flag rate`);
  console.log(`  Other errors:                    ${otherError} / ${COUNT}`);
  console.log();
  console.log(`  Effective flag rate: ${((nsfwFailed / COUNT) * 100).toFixed(0)}%`);
  console.log(`  (Before Ship 2.5 baseline ≈ 33% on this combo)`);
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
