#!/usr/bin/env node
/**
 * Generate 50 OBSERVATIONAL camera angles / framings for VenusBot's
 * full-body path.
 *
 * These are how the CAMERA CATCHES HER full-body, not how she poses. Think
 * voyeur / documentary / candid surveillance angles — the camera is wherever
 * it would naturally be to catch her in motion, not a studio setup.
 *
 * Generation strategy: batches of 10, each call gets prior batches as
 * "AVOID these" so Sonnet dedups intra-pool as it goes.
 *
 * Output: scripts/bots/venusbot/seeds/action_poses.json (array of 50 strings)
 */

const fs = require('fs');
const path = require('path');

const ENV = (() => {
  const env = {};
  const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
  for (const l of lines) {
    const eq = l.indexOf('=');
    if (eq > 0) env[l.slice(0, eq).trim()] = l.slice(eq + 1).trim();
  }
  return env;
})();
const ANTHROPIC = process.env.ANTHROPIC_API_KEY || ENV.ANTHROPIC_API_KEY;

const TOTAL = 50;
const BATCH = 10;

const baseMeta = `You are writing CANDID full-body camera-angle descriptions for a cyborg woman in motion. The camera is wherever a voyeur, documentary-shooter, or surveillance lens would naturally be to catch her — NOT a studio setup.

━━━ CRITICAL RULE ━━━

She is NOT posing. The camera catches her DOING something. Descriptions describe WHERE THE CAMERA IS and WHAT IT SEES, not how she's composing herself for the shot.

BANNED WORDS AND CONCEPTS: pose, posing, model, modeling, editorial, fashion shoot, fashion photography, Vogue, strikes, runway, studio shot, portrait framing, confident pose, fashion-editorial framing, cover shot, catwalk.

USE INSTEAD: view from, framing from, angle from, seen from, camera at, across the room, through a window, over her shoulder, low-angle, high-angle, Dutch tilt, wide frame, middle distance.

━━━ VARIETY ━━━

Each entry is 12-25 words. Mix:
- ANGLES: low / high / eye-level / Dutch / reflected / through something
- DISTANCES: wide / mid / closer
- POSITIONS: behind her / over shoulder / across a room / through a doorway / from above / from ground level
- CONTEXTS: through glass / reflected in puddle / from another car / through doorframe / through foliage / from an elevated platform / through an opening
- CINEMATIC quality: observational (not fashion-editorial). Think surveillance cam, documentary shooter, voyeur, security-footage, reflection-capture, found-footage angles.

She should be the subject of the frame but NEVER looking "camera-ready" — she's doing something and the camera is nearby.

━━━ OUTPUT ━━━

JSON array of ${BATCH} strings. No preamble, no numbering, no quotes wrapping the array.`;

async function callWithRetry(body) {
  const delays = [2000, 6000, 15000, 30000];
  for (let i = 0; i <= delays.length; i++) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': ANTHROPIC, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) return await res.json();
    const text = (await res.text()).slice(0, 200);
    if ((res.status === 529 || res.status === 429 || res.status >= 500) && i < delays.length) {
      console.log(`  ⏳ ${res.status} — retry ${i + 1}/${delays.length} in ${delays[i] / 1000}s`);
      await new Promise((r) => setTimeout(r, delays[i]));
      continue;
    }
    throw new Error(res.status + ': ' + text);
  }
  throw new Error('exhausted');
}

(async () => {
  console.log(`🌱 Generating ${TOTAL} action-pose camera angles in batches of ${BATCH}...\n`);
  const all = [];
  for (let batch = 1; batch <= Math.ceil(TOTAL / BATCH); batch++) {
    const prior = all.length > 0
      ? `\n\n━━━ ALREADY GENERATED (DO NOT DUPLICATE THESE, vary strongly from them) ━━━\n\n${all.map((x, i) => `${i + 1}. ${x}`).join('\n')}`
      : '';
    const data = await callWithRetry({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2500,
      messages: [{ role: 'user', content: baseMeta + prior }],
    });
    const raw = (data.content[0]?.text || '').trim();
    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) { console.error('No JSON. Raw:\n', raw); process.exit(1); }
    const newEntries = JSON.parse(match[0]);
    console.log(`  ✓ batch ${batch}: +${newEntries.length} (total: ${all.length + newEntries.length})`);
    all.push(...newEntries);
  }
  const outPath = 'scripts/bots/venusbot/seeds/action_poses.json';
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(all, null, 2));
  console.log(`\n✅ Saved ${all.length} action-poses to ${outPath}\n`);
  all.slice(0, 5).forEach((s, i) => console.log(`#${i + 1}: ${s}`));
  console.log(`... (${all.length - 5} more)`);
})().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
