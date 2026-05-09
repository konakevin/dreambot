#!/usr/bin/env node
/**
 * smoke-first-dream — fire one render per persona for a test user.
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/smoke-first-dream.js \
 *     --user eab700d8-f11a-4f47-a3a1-addda6fb67ec \
 *     --personas no_cast,solo_male,solo_female,duo
 *
 * Notes:
 * - bypass_one_shot=true (so we can re-fire on the same user during dev)
 * - force_persona overrides cast-derived persona (so we can hit all 4)
 * - downloads each result to /tmp/first-dream-smoke/<persona>.jpg
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

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

if (!SUPABASE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY missing');
  process.exit(1);
}

const args = process.argv.slice(2);
function flag(name, fallback) {
  const i = args.indexOf('--' + name);
  return i >= 0 ? args[i + 1] : fallback;
}

const userId = flag('user', 'eab700d8-f11a-4f47-a3a1-addda6fb67ec');
const personas = (flag('personas', 'no_cast,solo_male,solo_female,duo') || '').split(',');
const outDir = '/tmp/first-dream-smoke';

(async () => {
  const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
  fs.mkdirSync(outDir, { recursive: true });

  // Look up the user's email to mint a magic-link JWT
  const { data: u, error: ue } = await sb.from('users').select('id, email').eq('id', userId).single();
  if (ue || !u) {
    console.error('User not found:', userId, ue?.message);
    process.exit(1);
  }
  console.log(`Test user: ${u.email}`);

  // Mint a session via magic link OTP exchange
  const { data: linkData, error: linkErr } = await sb.auth.admin.generateLink({
    type: 'magiclink',
    email: u.email,
  });
  if (linkErr || !linkData?.properties) {
    console.error('generateLink failed:', linkErr?.message);
    process.exit(1);
  }
  // Extract the OTP code from the email_otp field
  const otp = linkData.properties.email_otp;
  if (!otp) {
    console.error('No email_otp in link properties');
    process.exit(1);
  }
  const userClient = createClient(SUPABASE_URL, getKey('EXPO_PUBLIC_SUPABASE_ANON_KEY') || SUPABASE_KEY);
  const { data: sessData, error: sessErr } = await userClient.auth.verifyOtp({
    email: u.email,
    token: otp,
    type: 'email',
  });
  if (sessErr || !sessData?.session) {
    console.error('verifyOtp failed:', sessErr?.message);
    process.exit(1);
  }
  const jwt = sessData.session.access_token;
  console.log('JWT minted ✓');
  console.log();

  // Fire per persona
  for (const persona of personas) {
    console.log(`━━━ ${persona} ━━━`);
    const t0 = Date.now();
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-first-dream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          bypass_one_shot: true,
          force_persona: persona,
        }),
      });
      const text = await res.text();
      let body;
      try {
        body = JSON.parse(text);
      } catch {
        body = { raw: text };
      }
      const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
      if (!res.ok) {
        console.log(`  ✗ ${res.status} (${elapsed}s):`, JSON.stringify(body).slice(0, 300));
        continue;
      }
      console.log(
        `  ✓ ${elapsed}s | medium=${body.medium} vibe=${body.vibe} | ${body.composition_mode} | swap=${body.face_swap_result}`
      );
      console.log(`  url: ${body.image_url}`);
      // Download the image
      const ext = body.image_url.endsWith('.webp') ? 'webp' : 'jpg';
      const out = path.join(outDir, `${persona}.${ext}`);
      const buf = await fetch(body.image_url).then((r) => r.arrayBuffer());
      fs.writeFileSync(out, Buffer.from(buf));
      console.log(`  saved: ${out}`);
    } catch (err) {
      console.log(`  ✗ exception:`, err.message);
    }
    console.log();
  }

  console.log('Done. Renders saved to', outDir);
})();
