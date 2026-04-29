#!/usr/bin/env node
/**
 * dual-swap-qa.js — Automated QA for dual face swap pipeline.
 *
 * Renders dual face swap dreams, posts to feed, downloads images for review.
 * Cycles through all face-swap mediums systematically.
 *
 * Usage:
 *   node scripts/dual-swap-qa.js [--round N] [--count N] [--mediums a,b,c]
 *
 * Options:
 *   --round <N>       Round number (default: auto-increment from log)
 *   --count <N>       Renders per round (default: 5)
 *   --mediums <list>  Comma-separated medium keys (default: cycle through all)
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// ── Config ──────────────────────────────────────────────────────────────

function readEnvFile() {
  try {
    const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}
const envFile = readEnvFile();
function getKey(name) {
  return process.env[name] || envFile[name];
}

const SUPABASE_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const SUPABASE_KEY = getKey('SUPABASE_SERVICE_ROLE_KEY');
const KEVIN_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';

if (!SUPABASE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

const args = process.argv.slice(2);
const MEDIUM_ARG = args.find((_, i, a) => a[i - 1] === '--mediums') || null;
const COUNT = parseInt(args.find((_, i, a) => a[i - 1] === '--count') ?? '5', 10);

const QA_DIR = '/tmp/dual-qa';
const LOG_FILE = path.join(QA_DIR, 'qa-log.json');

// ── Auth ────────────────────────────────────────────────────────────────

async function getJwtForUser(email) {
  const { data: linkData, error: linkErr } = await sb.auth.admin.generateLink({
    type: 'magiclink',
    email,
  });
  if (linkErr) throw new Error(`Auth link failed: ${linkErr.message}`);
  const { data: otpData, error: otpErr } = await sb.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: 'magiclink',
  });
  if (otpErr || !otpData.session) throw new Error(`OTP verify failed: ${otpErr?.message}`);
  return otpData.session.access_token;
}

// ── Render ───────────────────────────────────────────────────────────────

async function renderDream(jwt, vibeProfile, medium) {
  const body = {
    vibe_profile: vibeProfile,
    force_cast_role: 'dual',
    force_medium: medium,
  };

  const res = await fetch(`${SUPABASE_URL}/functions/v1/nightly-dreams`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(180_000),
  });

  const data = await res.json();
  if (!res.ok) {
    return { success: false, error: data.error || `HTTP ${res.status}` };
  }
  return {
    success: true,
    upload_id: data.upload_id,
    image_url: data.image_url,
    prompt_used: data.prompt_used,
    resolved_medium: data.resolved_medium,
    resolved_vibe: data.resolved_vibe,
  };
}

// ── Main ────────────────────────────────────────────────────────────────

(async () => {
  fs.mkdirSync(QA_DIR, { recursive: true });

  // Load existing log for auto-incrementing round
  let allLogs = [];
  try {
    allLogs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
  } catch {}

  const ROUND_ARG = args.find((_, i, a) => a[i - 1] === '--round');
  const ROUND = ROUND_ARG
    ? parseInt(ROUND_ARG, 10)
    : allLogs.length > 0
      ? Math.max(...allLogs.map((l) => l.round)) + 1
      : 1;

  console.log(`\n🔬 Dual Face Swap QA — Round ${ROUND} (${COUNT} renders)`);

  // Get face-swap mediums from DB
  const { data: mediumRows } = await sb
    .from('dream_mediums')
    .select('key')
    .eq('is_active', true)
    .eq('face_swaps', true);
  const allMediums = (mediumRows ?? []).map((m) => m.key);

  // Pick mediums for this round
  let roundMediums;
  if (MEDIUM_ARG) {
    roundMediums = MEDIUM_ARG.split(',');
  } else {
    roundMediums = [];
    for (let i = 0; i < COUNT; i++) {
      const idx = ((ROUND - 1) * COUNT + i) % allMediums.length;
      roundMediums.push(allMediums[idx]);
    }
  }
  console.log(`Mediums: ${roundMediums.join(', ')}`);

  // Get Kevin's profile + JWT
  const { data: userRecipe } = await sb
    .from('user_recipes')
    .select('recipe, users!inner(email)')
    .eq('user_id', KEVIN_ID)
    .single();

  if (!userRecipe) {
    console.error('Could not load user recipe');
    process.exit(1);
  }

  const jwt = await getJwtForUser(userRecipe.users.email);
  const vibeProfile = userRecipe.recipe;
  console.log(`JWT acquired, starting renders...\n`);

  // Run renders sequentially (safer for face swap model warm-up)
  const results = [];
  for (let i = 0; i < roundMediums.length; i++) {
    const medium = roundMediums[i];
    const t0 = Date.now();
    console.log(`  [${i + 1}/${roundMediums.length}] ${medium}...`);

    try {
      const result = await renderDream(jwt, vibeProfile, medium);
      const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

      if (result.success && result.upload_id) {
        // Finalize upload so it shows on feed
        await sb.rpc('finalize_nightly_upload', {
          p_upload_id: result.upload_id,
          p_bot_message: `QA R${ROUND}/${i + 1} ${medium}`,
          p_from_wish: null,
        });
        console.log(
          `    ✅ ${medium}/${result.resolved_vibe} (${elapsed}s) — ${result.prompt_used?.slice(0, 100)}...`
        );
      } else {
        console.log(`    ❌ ${medium} (${elapsed}s) — ${result.error}`);
      }

      results.push({
        index: i + 1,
        medium,
        elapsed: parseFloat(elapsed),
        ...result,
      });
    } catch (err) {
      const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
      console.log(`    ❌ ${medium} (${elapsed}s) — ${err.message}`);
      results.push({
        index: i + 1,
        medium,
        elapsed: parseFloat(elapsed),
        success: false,
        error: err.message,
      });
    }
  }

  // Download images
  const roundDir = path.join(QA_DIR, `round-${ROUND}`);
  fs.mkdirSync(roundDir, { recursive: true });

  for (const r of results.filter((r) => r.success && r.image_url)) {
    try {
      const resp = await fetch(r.image_url);
      const buf = Buffer.from(await resp.arrayBuffer());
      const fname = `r${ROUND}_${r.index}_${r.medium}.jpg`;
      fs.writeFileSync(path.join(roundDir, fname), buf);
      r.localFile = path.join(roundDir, fname);
    } catch (err) {
      console.log(`    ⚠️  Download failed for ${r.medium}: ${err.message}`);
    }
  }

  // Save to running log
  allLogs.push({
    round: ROUND,
    timestamp: new Date().toISOString(),
    results,
  });
  fs.writeFileSync(LOG_FILE, JSON.stringify(allLogs, null, 2));

  // Summary
  const successes = results.filter((r) => r.success).length;
  console.log(`\n📊 Round ${ROUND}: ${successes}/${roundMediums.length} rendered`);
  console.log(`📁 Images: ${roundDir}`);
  console.log('\nPrompts:');
  for (const r of results) {
    if (r.success) {
      console.log(`  [${r.index}] ${r.medium}/${r.resolved_vibe}: ${r.prompt_used?.slice(0, 150)}`);
    } else {
      console.log(`  [${r.index}] ${r.medium}: FAILED — ${r.error}`);
    }
  }
})();
