#!/usr/bin/env node
/**
 * Generate 50 CANDID close-up poses for VenusBot's closeup path.
 *
 * Candid = what she's DOING in a tight frame, not how she's POSING.
 * She's thinking / listening / noticing / reacting / mid-motion — the
 * camera catches her. She is NOT modeling, NOT on a runway, NOT in an
 * editorial. Verbs describe actions; never "poses", "strikes", "models".
 *
 * Generation strategy: batches of 10, each call gets prior batches as
 * "AVOID these" so Sonnet dedups intra-pool as it goes.
 *
 * Output: scripts/bots/venusbot/seeds/poses.json (array of 50 strings)
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

const baseMeta = `You are writing CANDID close-up gesture/pose descriptions for a cyborg woman. The camera catches her tight — face, throat, shoulders, maybe collarbone.

━━━ CRITICAL RULE ━━━

She is NOT posing, modeling, strutting, or performing for the camera. She is DOING something in the world and the camera happens to catch her close. Descriptions should use ACTION VERBS that describe what she's doing, not modeling language.

BANNED WORDS AND CONCEPTS: pose, posing, model, modeling, editorial, fashion shoot, Vogue, strikes, runway, studio, portrait, photographed, shoot-for, camera-ready, confident pose, statuesque pose, catwalk.

USE INSTEAD: caught mid-X, turning, tilting, leaning, resting, noticing, listening, exhaling, glancing, scanning, tracking, watching, considering, reaching, pressing, grazing, brushing, lifting, lowering, mid-thought.

━━━ FRAMING ━━━

Each entry describes WHAT SHE IS DOING in a tight close-up frame. Face + throat + shoulders + maybe one hand in frame. NO full body. NO legs. NO hips.

━━━ CONTENT ━━━

Each entry is 10-25 words. Vary WIDELY:
- Actions (turning, listening, reaching, etc.)
- What her hand is doing (at throat, at lips, on collarbone, at temple, in hair, nowhere)
- What she's looking at (off-frame something, down, up, over shoulder, into a reflection, at her own hand)
- Micro-tells (chrome fingertip tapping, half-smile, parted lips, pressed lips, subtle head-tilt)
- Mood (calculating, thoughtful, faintly amused, bored, alert, distracted)

Keep the SEXY silhouette and material quality intact — she is always hot — but sexiness comes from HER, not from posing.

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
  console.log(`🌱 Generating ${TOTAL} candid poses in batches of ${BATCH}...\n`);
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
  const outPath = 'scripts/bots/venusbot/seeds/poses.json';
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(all, null, 2));
  console.log(`\n✅ Saved ${all.length} poses to ${outPath}\n`);
  all.slice(0, 5).forEach((s, i) => console.log(`#${i + 1}: ${s}`));
  console.log(`... (${all.length - 5} more)`);
})().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
