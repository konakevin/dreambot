#!/usr/bin/env node

/**
 * A/B comparison: textPrompts.ts templates vs directive-only approach.
 *
 * For each active medium, generates 2 images with textPrompts approach
 * and 2 with directive approach, evaluates with Sonnet vision, reports winner.
 *
 * Usage:
 *   node scripts/compare-prompts.js
 *   node scripts/compare-prompts.js --medium lego   # test one medium only
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;
const MEDIUM_FILTER = process.argv.find((_, i, a) => a[i - 1] === '--medium') ?? null;
const COUNT = 2; // 2 per approach per medium

// Load mediums from dreamEngine.ts (parse the CURATED_MEDIUMS)
// We'll just hardcode the active ones with their data to keep it simple
const ACTIVE_MEDIUMS = [
  'pixel_art', 'oil_painting', 'anime', 'lego', 'claymation', '3d_cartoon',
  '3d_render', 'cyberpunk', 'comic_book', 'embroidery', 'disney', 'sack_boy',
  'funko_pop', 'ghibli', 'tim_burton', 'pop_art', 'minecraft', '8bit',
  'paper_cutout', 'retro_poster', 'childrens_book', 'vaporwave', 'fantasy',
  'ukiyo_e', 'art_deco', 'steampunk', 'cute_anime', 'dark_anime',
];

// Load directives + fluxFragments from constants file
function loadMediums() {
  const src = fs.readFileSync('constants/dreamEngine.ts', 'utf8');
  const mediums = {};
  const regex = /key:\s*'([^']+)',\s*\n\s*label:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = regex.exec(src)) !== null) {
    const key = m[1];
    // Find directive and fluxFragment after this key
    const after = src.slice(m.index);
    const dirMatch = after.match(/directive:\s*\n?\s*['"`]([^'"`]{20,})['"`]/);
    const fragMatch = after.match(/fluxFragment:\s*\n?\s*'([^']{20,})'/);
    if (dirMatch && fragMatch) {
      mediums[key] = { label: m[2], directive: dirMatch[1], fluxFragment: fragMatch[1] };
    }
  }
  return mediums;
}

// Load textPrompts templates
function loadTextPrompts() {
  const src = fs.readFileSync('supabase/functions/_shared/textPrompts.ts', 'utf8');
  // Just check which keys exist
  const keys = new Set();
  const regex = /^\s+['"]?(\w+)['"]?:\s*\(/gm;
  let m;
  while ((m = regex.exec(src)) !== null) {
    if (!['subject', 'vibe', 'fluxFragment', 'mediumKey', 'vibeDirective'].includes(m[1])) {
      keys.add(m[1]);
    }
  }
  return keys;
}

const TEST_SUBJECT = 'A vast crystal cave with bioluminescent mushrooms growing from the ceiling, light refracting through quartz formations, tiny glowing creatures floating in the air';
const TEST_VIBE = 'Soft ethereal haze, omnidirectional glow, dreamlike wonder, pastels and jewel tones.';

async function generateFluxDev(prompt) {
  const res = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-dev/predictions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${REPLICATE_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: { prompt, aspect_ratio: '9:16', num_outputs: 1, output_format: 'jpg' } }),
  });
  if (!res.ok) throw new Error(`Flux create failed: ${res.status}`);
  const pred = await res.json();
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 2000));
    const poll = await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, {
      headers: { Authorization: `Bearer ${REPLICATE_TOKEN}` },
    });
    const data = await poll.json();
    if (data.status === 'succeeded') return data.output?.[0];
    if (data.status === 'failed') throw new Error(`Failed: ${data.error}`);
  }
  throw new Error('Timed out');
}

async function sonnetPrompt(brief) {
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 200,
    messages: [{ role: 'user', content: brief }],
  });
  return msg.content?.[0]?.text?.trim() ?? '';
}

async function evaluate(imageUrl, mediumKey) {
  const imgResp = await fetch(imageUrl);
  const imgBuf = Buffer.from(await imgResp.arrayBuffer());
  const base64 = imgBuf.toString('base64');

  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 150,
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64 } },
        { type: 'text', text: `Score this image. Intended medium: ${mediumKey}.\n1. MEDIUM (does it look like authentic ${mediumKey}?): 1-5\n2. QUALITY (visually stunning?): 1-5\nOutput JSON: {"medium":N,"quality":N,"notes":"brief"}` },
      ],
    }],
  });

  try {
    const match = msg.content?.[0]?.text?.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match?.[0] ?? '{}');
    return { medium: parsed.medium || 0, quality: parsed.quality || 0, notes: parsed.notes || '' };
  } catch {
    return { medium: 0, quality: 0, notes: 'eval failed' };
  }
}

async function main() {
  const allMediums = loadMediums();
  const textPromptKeys = loadTextPrompts();
  const toTest = MEDIUM_FILTER ? [MEDIUM_FILTER] : ACTIVE_MEDIUMS;
  const totalImages = toTest.length * COUNT * 2;

  console.log(`\n🔬 A/B: textPrompts vs directive | ${toTest.length} mediums × ${COUNT} × 2 = ${totalImages} images (~$${(totalImages * 0.03).toFixed(2)})\n`);

  const results = [];

  for (const key of toTest) {
    const m = allMediums[key];
    if (!m) { console.log(`⚠️ ${key} not found in dreamEngine.ts, skipping`); continue; }
    const hasTextPrompt = textPromptKeys.has(key);

    for (let i = 0; i < COUNT; i++) {
      // ── A: textPrompts.ts approach (via Edge Function) ──
      if (hasTextPrompt) {
        // Build the textPrompts-style brief inline (mirrors what textPrompts.ts does)
        const briefA = `Write a Flux AI prompt (50-70 words, comma-separated) for ${key.replace(/_/g, ' ')}:\n- Start with: "${m.fluxFragment}"\n- Subject: ${TEST_SUBJECT}\n- End with: no text, no words, no letters, no watermarks, hyper detailed.\nExpress the mood: ${TEST_VIBE}\nOutput ONLY the prompt.`;
        console.log(`[${key}] A/textPrompt #${i + 1}...`);
        try {
          const promptA = await sonnetPrompt(briefA);
          const urlA = await generateFluxDev(promptA);
          const scoreA = await evaluate(urlA, key);
          console.log(`  A: med=${scoreA.medium} qual=${scoreA.quality} | ${scoreA.notes?.slice(0, 50)}`);
          results.push({ medium: key, approach: 'textPrompt', ...scoreA });
        } catch (e) { console.log(`  A: FAILED ${e.message?.slice(0, 50)}`); }
      } else {
        console.log(`[${key}] A/textPrompt: no template, skipping`);
      }

      // ── B: directive approach ──
      const briefB = `You are a cinematographer. Write a Flux AI prompt (60-90 words, comma-separated).\n\nMEDIUM (start the prompt with this): ${m.fluxFragment}\n\nSTYLE GUIDE:\n${m.directive}\n\nSUBJECT:\n${TEST_SUBJECT}\n\nMOOD: ${TEST_VIBE}\n\nWrite the prompt:\n1. Start with the art medium fragment EXACTLY as given\n2. Render the subject in this medium's style\n3. Name specific materials, textures, light sources\n4. End with: no text, no words, no letters, no watermarks, hyper detailed\nOutput ONLY the prompt.`;
      console.log(`[${key}] B/directive #${i + 1}...`);
      try {
        const promptB = await sonnetPrompt(briefB);
        const urlB = await generateFluxDev(promptB);
        const scoreB = await evaluate(urlB, key);
        console.log(`  B: med=${scoreB.medium} qual=${scoreB.quality} | ${scoreB.notes?.slice(0, 50)}`);
        results.push({ medium: key, approach: 'directive', ...scoreB });
      } catch (e) { console.log(`  B: FAILED ${e.message?.slice(0, 50)}`); }

      console.log();
    }
  }

  // ── Summary ──
  console.log('\n══════════════════════════════════════');
  console.log('SUMMARY — textPrompts vs directive');
  console.log('══════════════════════════════════════\n');

  for (const key of toTest) {
    const tpResults = results.filter(r => r.medium === key && r.approach === 'textPrompt');
    const dirResults = results.filter(r => r.medium === key && r.approach === 'directive');

    const avgTP = tpResults.length > 0
      ? { med: tpResults.reduce((a, r) => a + r.medium, 0) / tpResults.length, qual: tpResults.reduce((a, r) => a + r.quality, 0) / tpResults.length }
      : null;
    const avgDir = dirResults.length > 0
      ? { med: dirResults.reduce((a, r) => a + r.medium, 0) / dirResults.length, qual: dirResults.reduce((a, r) => a + r.quality, 0) / dirResults.length }
      : null;

    const tpScore = avgTP ? (avgTP.med + avgTP.qual).toFixed(1) : 'N/A';
    const dirScore = avgDir ? (avgDir.med + avgDir.qual).toFixed(1) : 'N/A';
    const winner = !avgTP ? 'directive (only)' : !avgDir ? 'textPrompt (only)' :
      (avgTP.med + avgTP.qual) > (avgDir.med + avgDir.qual) ? 'textPrompt ⬅️' :
      (avgTP.med + avgTP.qual) < (avgDir.med + avgDir.qual) ? 'DIRECTIVE ✅' : 'TIE';

    console.log(`${key.padEnd(16)} | TP: ${avgTP ? `med=${avgTP.med.toFixed(1)} qual=${avgTP.qual.toFixed(1)}` : 'N/A'.padEnd(20)} | Dir: ${avgDir ? `med=${avgDir.med.toFixed(1)} qual=${avgDir.qual.toFixed(1)}` : 'N/A'.padEnd(20)} | ${winner}`);
  }

  const allTP = results.filter(r => r.approach === 'textPrompt');
  const allDir = results.filter(r => r.approach === 'directive');
  const globalTP = allTP.length > 0 ? (allTP.reduce((a, r) => a + r.medium + r.quality, 0) / allTP.length).toFixed(1) : 'N/A';
  const globalDir = allDir.length > 0 ? (allDir.reduce((a, r) => a + r.medium + r.quality, 0) / allDir.length).toFixed(1) : 'N/A';
  console.log(`\nOVERALL: textPrompts avg=${globalTP} | directive avg=${globalDir}`);
  console.log(`\nTotal images: ${results.length} | Est cost: $${(results.length * 0.03).toFixed(2)}`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
