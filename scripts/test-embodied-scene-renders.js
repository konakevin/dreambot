#!/usr/bin/env node
/**
 * Test scene-only embodied renders after the V234 simplification.
 * Kevin's profile has no cast → composition rolls pure_scene most of the
 * time, and force_medium plants an embodied medium directly. We're validating
 * that the EXISTING pure_scene brief produces a good render with LEGO /
 * pixels / handcrafted mediums (the medium directive + flux_fragment do the
 * heavy lifting; no new brief code was written).
 *
 * Plus 2 unforced renders to eyeball the 30% weighted sub-roll in practice.
 */

const fs = require('fs');
const path = require('path');

const env = fs
  .readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8')
  .split('\n')
  .reduce((a, l) => {
    const m = l.match(/^([^=]+)=(.*)$/);
    if (m) a[m[1]] = m[2];
    return a;
  }, {});

const SUPABASE_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const WORKER_TOKEN = env.DREAM_QUEUE_WORKER_TOKEN;
const KEVIN = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';

const TESTS = [
  { label: 'lego-1',       force_medium: 'lego' },
  { label: 'lego-2',       force_medium: 'lego' },
  { label: 'lego-3',       force_medium: 'lego' },
  { label: 'pixels-1',     force_medium: 'pixels' },
  { label: 'pixels-2',     force_medium: 'pixels' },
  { label: 'pixels-3',     force_medium: 'pixels' },
  { label: 'handcrafted-1',force_medium: 'handcrafted' },
  { label: 'handcrafted-2',force_medium: 'handcrafted' },
  { label: 'handcrafted-3',force_medium: 'handcrafted' },
  { label: 'unforced-1',   force_medium: undefined },
  { label: 'unforced-2',   force_medium: undefined },
];

async function fireRender(test) {
  const start = Date.now();
  const body = {
    user_id: KEVIN,
    force_medium: test.force_medium,
    persist: true,
  };
  console.log(`[${test.label}] firing...`);
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/nightly-dreams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${WORKER_TOKEN}`,
      },
      body: JSON.stringify(body),
    });
    const elapsedS = ((Date.now() - start) / 1000).toFixed(1);
    if (!res.ok) {
      const text = await res.text();
      console.log(`[${test.label}] ❌ ${res.status} in ${elapsedS}s — ${text.slice(0, 200)}`);
      return { label: test.label, ok: false, error: text };
    }
    const data = await res.json();
    console.log(`[${test.label}] ✅ in ${elapsedS}s — upload_id=${data.upload_id || '?'}`);
    return { label: test.label, ok: true, ...data, elapsedS };
  } catch (err) {
    console.log(`[${test.label}] ❌ THROW — ${err.message}`);
    return { label: test.label, ok: false, error: err.message };
  }
}

(async () => {
  console.log(`Firing ${TESTS.length} embodied scene renders in parallel...\n`);
  const results = await Promise.all(TESTS.map(fireRender));
  console.log('\n──────────────────────────────────────────');
  console.log('SUMMARY');
  console.log('──────────────────────────────────────────');
  const okIds = [];
  for (const r of results) {
    const tag = r.ok ? '✅' : '❌';
    console.log(`${tag} ${r.label.padEnd(18)} ${r.ok ? r.elapsedS + 's  upload=' + r.upload_id : r.error?.slice(0, 80)}`);
    if (r.ok && r.upload_id) okIds.push(r.upload_id);
  }
  console.log('\nupload IDs for prompt inspection:');
  console.log(okIds.join(','));
})();
