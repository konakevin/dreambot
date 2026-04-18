#!/usr/bin/env node
'use strict';

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envFile = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    if (!process.env[trimmed.slice(0, eq).trim()])
      process.env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
}

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const KEVIN_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const KEVIN_EMAIL = 'konakevin@gmail.com';

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const i = args.indexOf('--' + name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const MEDIUM = getArg('medium', 'watercolor');
const VIBE = getArg('vibe', 'cinematic');
const CAST = getArg('cast', 'self');
const FORCE_MODEL = getArg('model', null);

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
const userClient = createClient(SUPABASE_URL, ANON_KEY);

async function main() {
  const { data: rec } = await supabase.from('user_recipes').select('recipe').eq('user_id', KEVIN_ID).single();
  const member = (rec.recipe.dream_cast || []).find(m => m.role === CAST);
  if (!member || !member.thumb_url) {
    console.error('No cast photo for role:', CAST);
    process.exit(1);
  }
  console.log(`Restyle: ${MEDIUM}/${VIBE} on ${CAST} photo`);
  console.log(`Photo: ${member.thumb_url.slice(0, 60)}`);

  const { data: link } = await supabase.auth.admin.generateLink({ type: 'magiclink', email: KEVIN_EMAIL });
  const { data: auth } = await userClient.auth.verifyOtp({ token_hash: link.properties.hashed_token, type: 'magiclink' });
  const token = auth.session.access_token;

  const t0 = Date.now();
  const res = await fetch(`${SUPABASE_URL}/functions/v1/restyle-photo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, apikey: ANON_KEY },
    body: JSON.stringify({
      mode: 'flux-kontext',
      input_image: member.thumb_url,
      medium_key: MEDIUM,
      vibe_key: VIBE,
      ...(FORCE_MODEL ? { force_model: FORCE_MODEL } : {}),
    }),
  });
  const data = await res.json();
  const ms = Date.now() - t0;
  if (res.ok) {
    console.log(`OK ${ms}ms`);
    console.log(`Image: ${data.image_url?.slice(0, 80)}`);
  } else {
    console.log(`FAIL ${ms}ms: ${JSON.stringify(data).slice(0, 300)}`);
  }
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
