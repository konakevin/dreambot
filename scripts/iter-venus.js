#!/usr/bin/env node
/**
 * VenusBot iteration harness.
 *
 * Runs a set of test hints through the live generate-dream Edge Function
 * with photography medium, downloads the results to /tmp/venus_iter-N/,
 * and prints the URLs so they can be inspected.
 *
 * Goal: photoreal cyborg documentary feel, beautiful, pulsing energy cores,
 * varied color, NOT the 3D/CGI default that "android/chrome" language pulls.
 *
 * Usage:
 *   node scripts/iter-venus.js --iter 1 --vibe cinematic
 *   node scripts/iter-venus.js --iter 2 --vibe voltage
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function readEnvFile() {
  const env = {};
  const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
  for (const line of lines) {
    const eq = line.indexOf('=');
    if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
  }
  return env;
}
const ENV = readEnvFile();
const getKey = (n) => process.env[n] || ENV[n];

const SUPABASE_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const sb = createClient(SUPABASE_URL, getKey('SUPABASE_SERVICE_ROLE_KEY'));

const args = process.argv.slice(2);
function arg(name, def) {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : def;
}
const ITER = arg('iter', '1');
const VIBE = arg('vibe', 'cinematic');
const MEDIUM = arg('medium', 'photography');

// Iteration 1 — lean on documentary-photography + physical-prosthetic
// language that AVOIDS tokens Flux associates with 3D/CGI renders.
// No "chrome-plated android", no "synthetic flesh panels", no "silver
// joints gleaming" — those phrases reliably pull the CGI aesthetic even
// with a strong photography directive.
const HINTS = [
  // Subject with subtle prosthetic + internal glow, documentary feel.
  'Documentary portrait of a stunning woman with a visible cybernetic prosthetic replacing part of her jaw and temple — matte brushed titanium, not glossy, not chrome. Her real skin is visible with pores, freckles, natural texture. A soft amber LED glow pulses from beneath the prosthetic like a backlit vein, hinting at the power core inside her chest. Shot on Hasselblad medium format, 85mm lens, natural window light, subtle film grain. She looks like a real person who happens to be augmented — a working cyborg, not a sci-fi doll.',
  // Chest-panel energy core emphasis.
  'Editorial magazine cover photograph of a breathtaking woman. Her collarbone has a small inlaid port — circular, matte — that glows faintly turquoise, pulsing with the rhythm of a heartbeat. Real skin, real hair, real imperfections. She meets the camera with an amused, confident gaze. Shot on Leica SL2, 50mm, golden-hour side light, subtle film grain. The cybernetics are quiet and lived-in, not the hero of the image — her face is.',
  // Eye/iris cybernetic with color saturation.
  'Close-up portrait of a beautiful woman, shot like a Vogue editorial on Hasselblad. One iris is a living machine — delicate copper filaments around an amber pulsing aperture, iris petals like a camera shutter. The rest of her face is entirely human with visible skin texture, eyelash detail, a small mole. Rim lighting picks out the filament in her iris and the subtle metallic port at her temple. Rich saturated color — teal shadows, warm skin, copper accents.',
  // Full-body athletic with visible exposed wiring under skin.
  'Fashion editorial photograph of an athletic woman in a simple black tank top. A portion of her shoulder and upper arm is replaced with a prosthetic — the skin is grafted seamlessly around it, visible suture scars, real texture. Faint electric-blue circuit lines glow beneath the translucent skin graft, pulsing softly. She looks like an Olympic athlete who had an accident and came back better. Natural window light, 85mm, shot on real film, grain visible.',
  // Sultry close-up with dramatic pulsing energy and vivid palette.
  'Intimate close-up photograph of an exquisite woman. Her lips are painted matte crimson. One temple has a small glowing port — soft violet pulse — like her augmentation is breathing. Real dewy skin, real hair catching backlight. Shot on Hasselblad, shallow depth of field, rich warm orange and teal color grading. She is undeniably a real person with real skin, real bones — the cybernetic is small, specific, and alive.',
];

async function signInVenus() {
  const email = 'bot-venusbot@dreambot.app';
  const password = 'BotAccount2026!!venusbot';
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error || !data.session) throw new Error(`signin failed: ${error?.message}`);
  return data.session.access_token;
}

async function runOne(jwt, hint, idx) {
  console.log(`\n[${idx}/${HINTS.length}] ${MEDIUM}+${VIBE} | hint: ${hint.slice(0, 80)}...`);
  const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-dream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
    body: JSON.stringify({ mode: 'flux-dev', medium_key: MEDIUM, vibe_key: VIBE, hint }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`  ❌ ${res.status}: ${err.slice(0, 200)}`);
    return null;
  }
  const result = await res.json();
  if (!result.upload_id) {
    console.error('  ❌ no upload_id', result);
    return null;
  }
  const { data: upload } = await sb
    .from('uploads')
    .select('id, image_url, ai_prompt')
    .eq('id', result.upload_id)
    .single();
  console.log(`  ✅ ${upload.image_url}`);
  console.log(`  prompt: ${(upload.ai_prompt || '').slice(0, 200)}`);
  return upload;
}

async function download(url, outPath) {
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outPath, buf);
}

(async () => {
  const jwt = await signInVenus();
  const outDir = `/tmp/venus_iter-${ITER}`;
  fs.mkdirSync(outDir, { recursive: true });
  console.log(`📁 ${outDir}`);

  const results = [];
  for (let i = 0; i < HINTS.length; i++) {
    const upload = await runOne(jwt, HINTS[i], i + 1);
    if (upload) {
      const filename = `iter${ITER}-${String(i + 1).padStart(2, '0')}.jpg`;
      await download(upload.image_url, path.join(outDir, filename));
      console.log(`  💾 saved ${filename}`);
      results.push({ filename, id: upload.id, prompt: upload.ai_prompt });
    }
    await new Promise((r) => setTimeout(r, 1500));
  }

  fs.writeFileSync(
    path.join(outDir, 'manifest.json'),
    JSON.stringify({ iter: ITER, vibe: VIBE, medium: MEDIUM, results }, null, 2)
  );
  console.log(`\n🎉 Done — ${results.length} renders in ${outDir}`);
})();
