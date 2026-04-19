/**
 * 20-night nightly-dream simulation.
 *
 * Runs the real nightly-dreams Edge Function 20 times with Kevin's profile,
 * simulating 20 consecutive nightly dreams. Captures rolled_axes from every
 * render and computes diversity + profile coverage stats.
 *
 * Usage:
 *   node scripts/test-nightly-simulation.js        # 20 nights (default)
 *   node scripts/test-nightly-simulation.js 10     # fewer for a quick check
 */
const { createClient } = require('@supabase/supabase-js');
const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY);
const EMAIL = 'konakevin@gmail.com';
const URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const USER_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';

const args = process.argv.slice(2);
const NIGHTS = parseInt(args[0] || '20', 10);

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

async function runNight(n, recipe) {
  await clearBudget();
  const jwt = await getJwt();
  const t0 = Date.now();
  const res = await fetch(`${URL}/functions/v1/nightly-dreams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
    body: JSON.stringify({
      vibe_profile: recipe,
      dream_wish: recipe.dream_wish,
    }),
  });
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return { n, elapsed, ok: false, error: `non-JSON [${res.status}]` };
  }
  if (!res.ok) {
    return { n, elapsed, ok: false, error: data.error || 'unknown' };
  }
  return {
    n,
    elapsed,
    ok: true,
    url: data.image_url,
    medium: data.resolved_medium,
    vibe: data.resolved_vibe,
  };
}

function pct(n, total) {
  return ((n / total) * 100).toFixed(0) + '%';
}

function countBy(arr, keyFn) {
  const counts = {};
  for (const item of arr) {
    const k = keyFn(item);
    if (!k && k !== 0) continue;
    counts[k] = (counts[k] || 0) + 1;
  }
  return counts;
}

function fmtDistribution(counts, total) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `    ${k.padEnd(22)} ${v}x  (${pct(v, total)})`)
    .join('\n');
}

(async () => {
  const { data: recipeRow } = await sb
    .from('user_recipes')
    .select('recipe')
    .eq('user_id', USER_ID)
    .single();
  const recipe = recipeRow.recipe;

  console.log(`>>> 20-NIGHT NIGHTLY DREAM SIMULATION`);
  console.log(`>>> Profile: ${recipe.art_styles.length} mediums, ${recipe.aesthetics.length} vibes, ${recipe.dream_cast.length} cast, ${(recipe.dream_seeds?.places || []).length} places, ${(recipe.dream_seeds?.things || []).length} things`);
  console.log(`>>> Running ${NIGHTS} nights sequentially...\n`);

  const results = [];
  for (let n = 1; n <= NIGHTS; n++) {
    const r = await runNight(n, recipe);
    const icon = r.ok ? '✓' : '✗';
    console.log(`  ${icon} Night ${String(n).padStart(2)} (${r.elapsed}s): ${r.ok ? `${r.medium}/${r.vibe}` : r.error}`);
    results.push(r);
  }

  // Pull rolled_axes for every successful render (most recent first, then reverse)
  const { data: logs } = await sb
    .from('ai_generation_log')
    .select('rolled_axes, enhanced_prompt, created_at')
    .eq('user_id', USER_ID)
    .order('created_at', { ascending: false })
    .limit(NIGHTS);
  const axesList = (logs || []).reverse().map((l) => l.rolled_axes || {});
  const prompts = (logs || []).reverse().map((l) => l.enhanced_prompt || '');

  const ok = results.filter((r) => r.ok);
  console.log(`\n━━━ RENDER HEALTH ━━━`);
  console.log(`  Successful: ${ok.length} / ${NIGHTS}`);
  if (ok.length < NIGHTS) {
    for (const r of results.filter((x) => !x.ok)) {
      console.log(`    ✗ Night ${r.n}: ${r.error}`);
    }
  }

  // ── Diversity stats ──────────────────────────────────────────────────
  console.log(`\n━━━ CHARACTER INCLUSION ━━━  (target: ~50%)`);
  const hasCharacter = axesList.filter((a) => a.nightlyPath?.startsWith('char')).length;
  console.log(`  Character included:  ${hasCharacter} / ${axesList.length}  (${pct(hasCharacter, axesList.length)})`);

  console.log(`\n━━━ CAST ROLES  (when character fired) ━━━  (target: self 75% / plus_one 25% — no pet in profile)`);
  const castCounts = {};
  for (const a of axesList) {
    const roles = a.castRoles || [];
    for (const role of roles) castCounts[role] = (castCounts[role] || 0) + 1;
  }
  console.log(fmtDistribution(castCounts, hasCharacter || 1));

  console.log(`\n━━━ LOCATION ━━━`);
  const hasLoc = axesList.filter((a) => a.nightlyPath?.includes('loc')).length;
  console.log(`  Location included:  ${hasLoc} / ${axesList.length}  (${pct(hasLoc, axesList.length)})  (target: ~100%)`);

  console.log(`\n━━━ OBJECT ━━━  (target: ~50%)`);
  const hasObj = axesList.filter((a) => a.nightlyPath?.includes('obj')).length;
  console.log(`  Object included:  ${hasObj} / ${axesList.length}  (${pct(hasObj, axesList.length)})`);

  console.log(`\n━━━ COMPOSITION ━━━`);
  console.log(fmtDistribution(countBy(axesList, (a) => a.composition), axesList.length));

  console.log(`\n━━━ COMPOSITION MODE ━━━`);
  console.log(fmtDistribution(countBy(axesList, (a) => a.compositionMode), axesList.length));

  console.log(`\n━━━ MEDIUM DISTRIBUTION ━━━  (${recipe.art_styles.length} in profile)`);
  const mediumCounts = countBy(axesList, (a) => a.medium);
  console.log(fmtDistribution(mediumCounts, axesList.length));
  const mediumsUsed = Object.keys(mediumCounts).length;
  console.log(`  Unique mediums:  ${mediumsUsed} / ${recipe.art_styles.length} (${pct(mediumsUsed, recipe.art_styles.length)} coverage)`);
  const missingMediums = recipe.art_styles.filter((m) => !mediumCounts[m]);
  if (missingMediums.length) console.log(`  NOT chosen: ${missingMediums.join(', ')}`);

  console.log(`\n━━━ VIBE DISTRIBUTION ━━━  (${recipe.aesthetics.length} in profile)`);
  const vibeCounts = countBy(axesList, (a) => a.vibe);
  console.log(fmtDistribution(vibeCounts, axesList.length));
  const vibesUsed = Object.keys(vibeCounts).length;
  console.log(`  Unique vibes:  ${vibesUsed} / ${recipe.aesthetics.length} (${pct(vibesUsed, recipe.aesthetics.length)} coverage)`);
  const missingVibes = recipe.aesthetics.filter((v) => !vibeCounts[v]);
  if (missingVibes.length) console.log(`  NOT chosen: ${missingVibes.join(', ')}`);

  // Locations actually appearing in prompts
  console.log(`\n━━━ LOCATION USAGE  (parsed from final prompts) ━━━  (${(recipe.dream_seeds?.places || []).length} in profile)`);
  const places = recipe.dream_seeds?.places || [];
  const placeCounts = {};
  for (const p of places) placeCounts[p] = 0;
  for (const prompt of prompts) {
    const lower = (prompt || '').toLowerCase();
    for (const p of places) {
      if (lower.includes(p.toLowerCase())) {
        placeCounts[p]++;
        break; // only count once per prompt
      }
    }
  }
  console.log(fmtDistribution(placeCounts, axesList.length));

  console.log(`\n━━━ OBJECT USAGE  (parsed from final prompts) ━━━  (${(recipe.dream_seeds?.things || []).length} in profile)`);
  const things = recipe.dream_seeds?.things || [];
  const thingCounts = {};
  for (const t of things) thingCounts[t] = 0;
  for (const prompt of prompts) {
    const lower = (prompt || '').toLowerCase();
    for (const t of things) {
      if (lower.includes(t.toLowerCase())) {
        thingCounts[t]++;
        break;
      }
    }
  }
  console.log(fmtDistribution(thingCounts, axesList.length));

  console.log(`\n━━━ NSFW RETRIES ━━━`);
  const retryTriggered = axesList.filter((a) => a.nsfwRetries && a.nsfwRetries > 0).length;
  console.log(`  Renders that hit retry:  ${retryTriggered} / ${axesList.length}`);

  // ── Image URLs ───────────────────────────────────────────────────────
  console.log(`\n━━━ IMAGE URLS (${ok.length}) ━━━`);
  for (const r of ok) {
    console.log(`  Night ${String(r.n).padStart(2)}  ${r.medium}/${r.vibe}  ${r.url}`);
  }
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
