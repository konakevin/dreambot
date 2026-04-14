#!/usr/bin/env node
/**
 * Regenerate expanded fusion settings for existing essence cards.
 *
 * Two-step approach:
 *   Step A: Generate anchor concepts grouped by genre (prevents skew)
 *   Step B: Expand each anchor into a polished fusion sentence
 *
 * Usage:
 *   node scripts/regenerate-essence-cards.js                     # all cards
 *   node scripts/regenerate-essence-cards.js --type location      # locations only
 *   node scripts/regenerate-essence-cards.js --type object        # objects only
 *   node scripts/regenerate-essence-cards.js --name hawaii        # one specific card
 */

require('dotenv').config({ path: '.env.local' });
const Anthropic = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const sb = createClient(
  'https://jimftynwrinwenonjrlj.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const args = process.argv.slice(2);
const typeIdx = args.indexOf('--type');
const nameIdx = args.indexOf('--name');
const ONLY_TYPE = typeIdx >= 0 ? args[typeIdx + 1] : null;
const ONLY_NAME = nameIdx >= 0 ? args[nameIdx + 1] : null;

const LOCATION_COUNT = { realistic: 17, fantasy: 17, scifi: 16 }; // 50 total
const OBJECT_COUNT = { realistic: 7, fantasy: 7, scifi: 6 }; // 20 total

const BANNED_PHRASES = [
  'looking out over', 'gazing at horizon', 'standing at the edge',
  'silhouette against', 'from behind', 'rear angle', 'seen from the back',
  'walking away', 'over-the-shoulder', 'back to camera', 'back turned',
];

function validateFusion(text) {
  const lower = text.toLowerCase();
  return !BANNED_PHRASES.some(phrase => lower.includes(phrase));
}

async function generateAnchors(name, type, genre, count) {
  const typeLabel = type === 'location' ? 'scene setting' : 'object appearance';
  const genreGuide = {
    realistic: 'grounded, real-world cinematic',
    fantasy: 'magical, mythical, enchanted',
    scifi: 'futuristic, sci-fi, technological',
  };

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1000,
    messages: [{
      role: 'user',
      content: `Generate ${count} unique ${genreGuide[genre]} ${typeLabel} anchor concepts for "${name}".

Each anchor must be a DIFFERENT sub-${type === 'location' ? 'location, landmark, or environment type' : 'form, material, or visual treatment'}.
Format: one concept per line, numbered. Each concept is 5-10 words describing a unique angle.
No duplicates. No generic entries. Every concept must be specific to "${name}".

Example for "hawaii" (realistic):
1. black sand beach with lava tubes and tide pools
2. waterfall hidden in bamboo forest valley
3. volcanic caldera rim at dawn with steam vents

Output ONLY the numbered list.`,
    }],
  });

  const text = msg.content[0].text;
  return text.split('\n')
    .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim())
    .filter(line => line.length > 5);
}

async function expandAnchors(name, type, genre, anchors) {
  const typeLabel = type === 'location' ? 'cinematic scene setting' : 'object visual description';
  const batchSize = 10;
  const results = [];

  for (let i = 0; i < anchors.length; i += batchSize) {
    const batch = anchors.slice(i, i + batchSize);
    const anchorList = batch.map((a, idx) => `${idx + 1}. ${a}`).join('\n');

    const msg = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: `Expand each anchor concept into a polished ${typeLabel} for "${name}" (${genre} genre).

ANCHORS:
${anchorList}

RULES:
- Each expansion is 15-25 words, comma-separated cinematic phrases
- ${type === 'location' ? 'Include a camera distance term: medium wide, medium, three-quarter, or environmental portrait' : 'Include how the object is physically placed in the scene'}
- NEVER include: looking out over, gazing at horizon, standing at the edge, silhouette, from behind, walking away, back turned
- Every word must be something a camera can see
- Output one expansion per line, numbered to match

Output ONLY the numbered expansions.`,
      }],
    });

    const expansions = msg.content[0].text.split('\n')
      .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim())
      .filter(line => line.length > 10)
      .filter(validateFusion);

    results.push(...expansions);
  }

  return results;
}

async function regenerateLocationCard(name) {
  console.log(`\n📍 Location: ${name}`);
  const fusionSettings = {};

  for (const [genre, count] of Object.entries(LOCATION_COUNT)) {
    console.log(`  ${genre}: generating ${count} anchors...`);
    const anchors = await generateAnchors(name, 'location', genre, count);
    console.log(`  ${genre}: expanding ${anchors.length} anchors...`);
    const fusions = await expandAnchors(name, 'location', genre, anchors);
    fusionSettings[genre] = fusions;
    console.log(`  ${genre}: ${fusions.length} fusions generated`);
  }

  const total = Object.values(fusionSettings).reduce((s, a) => s + a.length, 0);
  console.log(`  Total: ${total} fusion settings`);

  const { error } = await sb.from('location_cards')
    .update({ fusion_settings: fusionSettings })
    .eq('name', name);

  if (error) {
    console.error(`  ❌ Update failed:`, error.message);
  } else {
    console.log(`  ✅ Updated in DB`);
  }
}

async function regenerateObjectCard(name) {
  console.log(`\n🎸 Object: ${name}`);
  const fusionForms = {};

  for (const [genre, count] of Object.entries(OBJECT_COUNT)) {
    console.log(`  ${genre}: generating ${count} anchors...`);
    const anchors = await generateAnchors(name, 'object', genre, count);
    console.log(`  ${genre}: expanding ${anchors.length} anchors...`);
    const fusions = await expandAnchors(name, 'object', genre, anchors);
    fusionForms[genre] = fusions;
    console.log(`  ${genre}: ${fusions.length} forms generated`);
  }

  const total = Object.values(fusionForms).reduce((s, a) => s + a.length, 0);
  console.log(`  Total: ${total} fusion forms`);

  const { error } = await sb.from('object_cards')
    .update({ fusion_forms: fusionForms })
    .eq('name', name);

  if (error) {
    console.error(`  ❌ Update failed:`, error.message);
  } else {
    console.log(`  ✅ Updated in DB`);
  }
}

(async () => {
  if (!ONLY_TYPE || ONLY_TYPE === 'location') {
    const { data: locations } = await sb.from('location_cards').select('name');
    const locs = ONLY_NAME
      ? (locations || []).filter(l => l.name === ONLY_NAME)
      : (locations || []);

    for (const loc of locs) {
      await regenerateLocationCard(loc.name);
    }
  }

  if (!ONLY_TYPE || ONLY_TYPE === 'object') {
    const { data: objects } = await sb.from('object_cards').select('name');
    const objs = ONLY_NAME
      ? (objects || []).filter(o => o.name === ONLY_NAME)
      : (objects || []);

    for (const obj of objs) {
      await regenerateObjectCard(obj.name);
    }
  }

  console.log('\n🎉 Done.');
})();
