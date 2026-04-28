#!/usr/bin/env node
/**
 * Generate a complete, expanded location card with mood-neutral language.
 * Creates base card fields (30 entries each) + 50 fusion settings.
 * All in one shot — replaces both lazy generation and fusion expansion.
 *
 * Usage:
 *   node scripts/generate-full-location-card.js hawaii
 *   node scripts/generate-full-location-card.js --all          # all locations in user's profile
 *   node scripts/generate-full-location-card.js --list file.txt # from a file, one per line
 */

require('dotenv').config({ path: '.env.local' });
const Anthropic = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const sb = createClient(
  'https://jimftynwrinwenonjrlj.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const LOCATION_FUSION_COUNTS = { realistic: 50, fantasy: 50, scifi: 50 };

const BANNED_PHRASES = [
  'looking out over', 'gazing at horizon', 'standing at the edge',
  'silhouette against', 'from behind', 'rear angle', 'seen from the back',
  'walking away', 'over-the-shoulder', 'back to camera', 'back turned',
];

const MOOD_WORDS = [
  'dark', 'eerie', 'haunting', 'ghostly', 'ominous', 'sinister',
  'foreboding', 'menace', 'menacing', 'dread', 'gloomy', 'creepy',
  'terrifying', 'horror', 'nightmarish', 'demonic', 'cursed',
];

function validate(text) {
  const lower = text.toLowerCase();
  if (BANNED_PHRASES.some(p => lower.includes(p))) return false;
  if (MOOD_WORDS.some(w => lower.includes(w))) return false;
  return true;
}

// ── Step 1: Generate base card fields (30 each) ──

async function generateBaseCard(name) {
  console.log(`  Generating base card...`);

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 3000,
    messages: [{
      role: 'user',
      content: `You are a cinematic location scout. Create a rich visual essence card for "${name}".

Return ONLY valid JSON with these keys. Generate MANY entries per field for maximum variety:

{
  "tags": ["3-5 tags from: tropical, coastal, urban, nature, forest, fantasy, sky, underwater, gothic, interior, snow, mountain, desert, space, fire, epic, surreal, underground, cozy, theme_park"],
  "visual_palette": ["30 specific visual elements unique to this place, 6-10 words each — colors, materials, landmarks, natural features"],
  "atmosphere": ["30 sensory atmosphere phrases — sounds, air quality, temperature, smells, textures of the air, 6-10 words each"],
  "architecture": ["15 built environment details — structures, surfaces, materials, 6-10 words each"],
  "light_signature": ["10 phrases describing how light behaves in this place, 8-12 words each"],
  "texture_details": ["15 tactile close-up details — surfaces, natural elements, 6-10 words each"],
  "cinematic_phrases": ["30 short evocative phrases a cinematographer would use to describe shots here, 6-10 words each"]
}

CRITICAL RULES:
- Be SPECIFIC to "${name}". Not generic. What makes THIS place visually unique?
- MOOD-NEUTRAL: describe physical environment ONLY. No emotional tone, no darkness, no eeriness, no menace, no haunting, no ominous. A separate mood system handles tone — your job is JUST the physical place.
- Even unusual or dramatic features should be described neutrally (lava = "molten rock flowing into ocean" not "terrifying lava")
- Every phrase must be something a camera can see or a microphone can hear
- Each phrase max 10 words
- No duplicates within any field
- No metaphors, no cliches`
    }, {
      role: 'assistant',
      content: '{'
    }],
  });

  const raw = '{' + msg.content[0].text;
  const lastBrace = raw.lastIndexOf('}');
  const cleaned = lastBrace > 0 ? raw.slice(0, lastBrace + 1) : raw;

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('  ❌ JSON parse failed:', e.message);
    return null;
  }
}

// ── Step 2: Generate fusion anchors (same as regenerate script) ──

async function generateAnchors(name, genre, count) {
  const genreGuide = {
    realistic: 'grounded, real-world cinematic',
    fantasy: 'magical, mythical, enchanted, wonder-filled',
    scifi: 'futuristic, sci-fi, technological, awe-inspiring',
  };

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 2500,
    messages: [{
      role: 'user',
      content: `Generate ${count} unique ${genreGuide[genre]} scene concepts for "${name}".

Each must be a DIFFERENT sub-location, landmark, or environment type.
Format: one concept per line, numbered. Each is 5-10 words.
No duplicates. No generic entries. Every concept specific to "${name}".
MOOD-NEUTRAL: describe physical places ONLY. No emotional tone, no darkness, no eeriness, no menace, no haunting. Beautiful and wonder-filled, not threatening.

Output ONLY the numbered list.`,
    }],
  });

  return msg.content[0].text.split('\n')
    .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim())
    .filter(line => line.length > 5);
}

// ── Step 3: Expand anchors into fusion sentences ──

async function expandAnchors(name, genre, anchors) {
  const batchSize = 10;
  const results = [];

  for (let i = 0; i < anchors.length; i += batchSize) {
    const batch = anchors.slice(i, i + batchSize);
    const anchorList = batch.map((a, idx) => `${idx + 1}. ${a}`).join('\n');

    const msg = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2500,
      messages: [{
        role: 'user',
        content: `Expand each anchor into a polished cinematic scene setting for "${name}" (${genre} genre).

ANCHORS:
${anchorList}

RULES:
- Each expansion is 15-25 words, comma-separated cinematic phrases
- Include a camera distance term: medium wide, medium, three-quarter, or environmental portrait
- MOOD-NEUTRAL: describe physical environment and composition ONLY. No emotional language. No darkness, eeriness, menace, haunting, ghostly, ominous. Beautiful and wonder-filled, not dark or threatening.
- NEVER include: looking out over, gazing at horizon, standing at the edge, silhouette, from behind, walking away, back turned
- Every word must be something a camera can see
- Output one expansion per line, numbered to match

Output ONLY the numbered expansions.`,
      }],
    });

    const expansions = msg.content[0].text.split('\n')
      .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim())
      .filter(line => line.length > 10)
      .filter(validate);

    results.push(...expansions);
  }

  return results;
}

// ── Main: generate full card ──

async function generateFullCard(name) {
  console.log(`\n📍 ${name}`);

  // Step 1: Base card
  const base = await generateBaseCard(name);
  if (!base) return;

  // Filter mood words from base fields
  const filterField = (arr) => (arr || []).filter(validate);

  const card = {
    name: name.toLowerCase().trim(),
    tags: base.tags || [],
    visual_palette: filterField(base.visual_palette),
    atmosphere: filterField(base.atmosphere),
    architecture: filterField(base.architecture),
    light_signature: filterField(base.light_signature),
    texture_details: filterField(base.texture_details),
    cinematic_phrases: filterField(base.cinematic_phrases),
    prompt_version: 2,
    model_version: 'claude-sonnet-4-5-20250929',
  };

  console.log(`  Base: ${card.visual_palette.length} visuals, ${card.atmosphere.length} atmosphere, ${card.cinematic_phrases.length} phrases`);

  // Step 2: Fusion settings (50 total)
  const fusionSettings = {};
  for (const [genre, count] of Object.entries(LOCATION_FUSION_COUNTS)) {
    console.log(`  ${genre}: generating ${count} anchors...`);
    const anchors = await generateAnchors(name, genre, count);
    console.log(`  ${genre}: expanding ${anchors.length} anchors...`);
    const raw = await expandAnchors(name, genre, anchors);
    const seen = new Set();
    const fusions = raw.filter(f => {
      const key = f.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    fusionSettings[genre] = fusions;
    console.log(`  ${genre}: ${fusions.length} fusions (${raw.length - fusions.length} dupes removed)`);
  }
  card.fusion_settings = fusionSettings;

  const totalFusions = Object.values(fusionSettings).reduce((s, a) => s + a.length, 0);
  console.log(`  Total: ${totalFusions} fusions`);

  // Upsert into DB
  const { error: deleteErr } = await sb.from('location_cards').delete().eq('name', card.name);
  if (deleteErr) console.warn('  Delete warning:', deleteErr.message);

  const { error: insertErr } = await sb.from('location_cards').insert(card);
  if (insertErr) {
    console.error(`  ❌ Insert failed:`, insertErr.message);
  } else {
    console.log(`  ✅ Saved to DB`);
  }
}

// ── CLI ──

(async () => {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node scripts/generate-full-location-card.js <location>');
    console.log('       node scripts/generate-full-location-card.js --all');
    process.exit(1);
  }

  if (args[0] === '--all') {
    const { data } = await sb.from('location_cards').select('name');
    for (const loc of (data || [])) {
      await generateFullCard(loc.name);
    }
  } else {
    for (const name of args) {
      await generateFullCard(name);
    }
  }

  console.log('\n🎉 Done.');
})();
