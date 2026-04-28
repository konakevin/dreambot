#!/usr/bin/env node
/**
 * Generate a complete object card with rich visual data + 15 fusion forms per genre.
 * Creates base card fields + genre-specific fusion_forms in one shot.
 *
 * Usage:
 *   node scripts/generate-full-object-card.js sword guitar
 *   node scripts/generate-full-object-card.js --all        # all approved objects
 *   node scripts/generate-full-object-card.js --missing     # only objects without fusion_forms
 */

require('dotenv').config({ path: '.env.local' });
const Anthropic = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const sb = createClient(
  'https://jimftynwrinwenonjrlj.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const FUSION_COUNT = 15;

const BANNED_PHRASES = [
  'looking out over', 'gazing at horizon', 'standing at the edge',
  'silhouette against', 'from behind', 'rear angle', 'seen from the back',
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

// ── Step 1: Generate base card fields ──

async function generateBaseCard(name) {
  console.log(`  Generating base card...`);

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 3000,
    messages: [{
      role: 'user',
      content: `You are a cinematic prop designer. Create a rich visual essence card for the object "${name}".

Return ONLY valid JSON with these keys:

{
  "visual_forms": ["8 specific physical variations of this object — different materials, styles, eras, cultures. 8-12 words each."],
  "material_textures": ["8 tactile surface details — what it feels like, how light hits it. 6-10 words each."],
  "signature_details": ["5 tiny identifying details a close-up camera would catch. 6-10 words each."],
  "scale_contexts": ["6 phrases showing how this object relates to human body scale. 6-10 words each."],
  "interaction_modes": ["8 ways a person physically touches, holds, or uses this object. 8-12 words each."],
  "environment_bindings": ["10 ways this object could be placed or found in a scene — leaning, hanging, resting, etc. 6-10 words each."],
  "role_options": ["5 compositional roles: e.g. 'artifact on a pedestal', 'hero prop in foreground', 'carried casually', 'background element', 'surreal giant-scale version'"],
  "soft_presence_forms": ["5 indirect/symbolic ways this object could appear — shadows, reflections, patterns, imprints. 8-12 words each."],
  "context_bridges": ["5 phrases connecting this object to broader scene contexts — what kind of scene it naturally belongs in. 6-10 words each."]
}

CRITICAL RULES:
- Be SPECIFIC to "${name}". Not generic.
- MOOD-NEUTRAL: describe physical object ONLY. No emotional tone, no darkness, no menace.
- Every phrase must be something a camera can see or a hand can feel.
- No duplicates within any field.`
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

// ── Step 2: Generate fusion forms (genre-specific object reimaginings) ──

async function generateFusionForms(name, genre) {
  const genreGuide = {
    realistic: 'grounded, real-world, photorealistic',
    fantasy: 'magical, mythical, enchanted, wonder-filled',
    scifi: 'futuristic, sci-fi, technological, high-tech',
  };

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1500,
    messages: [{
      role: 'user',
      content: `Generate ${FUSION_COUNT} unique ${genreGuide[genre]} reimaginings of "${name}" as a visual object in a dream scene.

Each entry describes what this object LOOKS LIKE in a ${genre} world — materials, colors, textures, glow effects, surface treatments.

RULES:
- Each is 8-15 words, a comma-separated visual description
- Every entry must be visually DISTINCT from the others
- MOOD-NEUTRAL: describe physical appearance only, no emotional language
- No duplicates, no generic entries
- Output ONLY a numbered list, one per line`
    }],
  });

  const raw = msg.content[0].text.split('\n')
    .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim())
    .filter(line => line.length > 5)
    .filter(validate);

  const seen = new Set();
  return raw.filter(f => {
    const key = f.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ── Main: generate full card ──

async function generateFullCard(name) {
  console.log(`\n🎁 ${name}`);

  const base = await generateBaseCard(name);
  if (!base) return;

  const filterField = (arr) => (arr || []).filter(validate);

  const card = {
    visual_forms: filterField(base.visual_forms),
    material_textures: filterField(base.material_textures),
    signature_details: filterField(base.signature_details),
    scale_contexts: filterField(base.scale_contexts),
    interaction_modes: filterField(base.interaction_modes),
    environment_bindings: filterField(base.environment_bindings),
    role_options: base.role_options || [],
    soft_presence_forms: filterField(base.soft_presence_forms),
    context_bridges: filterField(base.context_bridges),
    prompt_version: 2,
    model_version: 'claude-sonnet-4-5-20250929',
  };

  console.log(`  Base: ${card.visual_forms.length} forms, ${card.environment_bindings.length} bindings`);

  const fusionForms = {};
  for (const genre of ['realistic', 'fantasy', 'scifi']) {
    console.log(`  ${genre}: generating ${FUSION_COUNT} fusion forms...`);
    const forms = await generateFusionForms(name, genre);
    fusionForms[genre] = forms;
    console.log(`  ${genre}: ${forms.length} forms`);
  }
  card.fusion_forms = fusionForms;

  const totalForms = Object.values(fusionForms).reduce((s, a) => s + a.length, 0);
  console.log(`  Total: ${totalForms} fusion forms`);

  // Update existing row, preserving tags/category/scale/faceswap fields
  const normalizedName = name.toLowerCase().trim();
  const { error } = await sb
    .from('object_cards')
    .update(card)
    .eq('name', normalizedName);

  if (error) {
    console.error(`  ❌ Update failed:`, error.message);
  } else {
    console.log(`  ✅ Saved to DB`);
  }
}

// ── CLI ──

(async () => {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node scripts/generate-full-object-card.js <object>');
    console.log('       node scripts/generate-full-object-card.js --all');
    console.log('       node scripts/generate-full-object-card.js --missing');
    process.exit(1);
  }

  if (args[0] === '--all') {
    const { data } = await sb.from('object_cards').select('name').eq('is_approved', true);
    for (const obj of (data || [])) {
      await generateFullCard(obj.name);
    }
  } else if (args[0] === '--missing') {
    const { data } = await sb
      .from('object_cards')
      .select('name, fusion_forms')
      .eq('is_approved', true);
    const missing = (data || []).filter(r =>
      !r.fusion_forms || Object.keys(r.fusion_forms).length === 0
    );
    console.log(`${missing.length} objects missing fusion_forms...`);
    for (const obj of missing) {
      await generateFullCard(obj.name);
    }
  } else {
    for (const name of args) {
      await generateFullCard(name);
    }
  }

  console.log('\n🎉 Done.');
})();
