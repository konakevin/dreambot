#!/usr/bin/env node
/**
 * QA-render a dream LOCATION on Kevin's account for Operation Dream Location
 * Expansion. Renders cast (self + plus_one) with a pinned vivid face-swap medium
 * and a scene-only shot with a pinned cinematic medium, captioned so batches group
 * in the album. Uses nightly-dreams force_place (loads the location_card by name).
 *
 *   node scripts/qa-location.js --location "alien planet" --cast-medium photography --scene-medium cinematic
 *   node scripts/qa-location.js --location "alien planet"   # defaults photography/cinematic
 *
 * Prints the image URLs.
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const SB = 'https://jimftynwrinwenonjrlj.supabase.co';
const U = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const W = process.env.DREAM_QUEUE_WORKER_TOKEN;
const sb = createClient(SB, process.env.SUPABASE_SERVICE_ROLE_KEY);
const arg = (n, d) => {
  const i = process.argv.indexOf('--' + n);
  return i >= 0 ? process.argv[i + 1] : d;
};
const LOC = arg('location');
const CAST_MEDIUM = arg('cast-medium', 'photography');
const SCENE_MEDIUM = arg('scene-medium', 'cinematic');
if (!LOC) {
  console.error('--location required');
  process.exit(1);
}

// [role, medium, pure_scene, label]
const SURFACES = [
  ['self', CAST_MEDIUM, false, 'self'],
  ['plus_one', CAST_MEDIUM, false, 'plus1'],
  [null, SCENE_MEDIUM, true, 'scene'],
];

async function render(role, medium, pureScene, label) {
  const body = {
    user_id: U,
    force_place: LOC,
    force_medium: medium,
  };
  if (pureScene) {
    body.force_pure_scene = true;
  } else {
    body.force_cast_role = role;
    // Don't FORCE an action beat (Kevin 2026-08-24): forcing it made every render
    // "doing something / looking away." We want natural characters within their
    // environment — sometimes an action, sometimes just looking at the camera. Let
    // the engine's normal location_action_pct mix decide, same as production.
  }
  for (let attempt = 0; attempt < 3; attempt++) {
    await sb
      .from('ai_generation_budget')
      .delete()
      .eq('user_id', U)
      .eq('date', new Date().toISOString().slice(0, 10));
    let d;
    try {
      const res = await fetch(`${SB}/functions/v1/nightly-dreams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${W}` },
        body: JSON.stringify(body),
      });
      d = await res.json();
    } catch (e) {
      d = { error: e.message };
    }
    if (d && d.upload_id) {
      await sb
        .from('uploads')
        .update({ caption: `🌍 ${LOC} — ${label} [${medium}]` })
        .eq('id', d.upload_id);
      console.log(`  ${label} [${medium}]: ${d.image_url}`);
      return d.image_url;
    }
    if (d && d.code === 'WORKER_RESOURCE_LIMIT' && attempt < 2) continue;
    console.log(`  ✗ ${label}: ${JSON.stringify(d).slice(0, 100)}`);
    return null;
  }
}

(async () => {
  const out = [];
  for (const [role, medium, pure, label] of SURFACES) {
    out.push(await render(role, medium, pure, label));
  }
  console.log(JSON.stringify(out.filter(Boolean)));
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
