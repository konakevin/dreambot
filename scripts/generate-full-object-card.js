#!/usr/bin/env node
/**
 * Generate a complete object card with context bridges, mood-neutral language.
 * Creates all fields including fusion_forms (20 per object) and context_bridges.
 *
 * Usage:
 *   node scripts/generate-full-object-card.js sword
 *   node scripts/generate-full-object-card.js --all          # all from CURATED_OBJECTS
 *   node scripts/generate-full-object-card.js --list          # print the curated list
 */

require('dotenv').config({ path: '.env.local' });
const Anthropic = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const sb = createClient(
  'https://jimftynwrinwenonjrlj.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const CURATED_OBJECTS = [
  // Weapons / Adventure
  { name: 'sword', category: 'weapon', scale: 'handheld' },
  { name: 'bow and arrow', category: 'weapon', scale: 'handheld' },
  { name: 'lightsaber', category: 'weapon', scale: 'handheld' },
  { name: 'trident', category: 'weapon', scale: 'handheld' },
  { name: 'wand', category: 'weapon', scale: 'handheld' },
  { name: 'dagger', category: 'weapon', scale: 'handheld' },
  { name: 'katana', category: 'weapon', scale: 'handheld' },
  // Vehicles
  { name: 'motorcycle', category: 'vehicle', scale: 'large' },
  { name: 'classic muscle car', category: 'vehicle', scale: 'massive' },
  { name: 'sailboat', category: 'vehicle', scale: 'massive' },
  { name: 'helicopter', category: 'vehicle', scale: 'massive' },
  { name: 'spaceship', category: 'vehicle', scale: 'massive' },
  { name: 'hot air balloon', category: 'vehicle', scale: 'massive' },
  // Instruments
  { name: 'guitar', category: 'instrument', scale: 'handheld' },
  { name: 'piano', category: 'instrument', scale: 'large' },
  { name: 'violin', category: 'instrument', scale: 'handheld' },
  { name: 'drums', category: 'instrument', scale: 'large' },
  // Animals / Creatures
  { name: 'dragon', category: 'creature', scale: 'massive' },
  { name: 'phoenix', category: 'creature', scale: 'large' },
  { name: 'wolf', category: 'creature', scale: 'large' },
  { name: 'horse', category: 'creature', scale: 'massive' },
  { name: 'owl', category: 'creature', scale: 'handheld' },
  { name: 'cat', category: 'creature', scale: 'handheld' },
  // Technology
  { name: 'robot', category: 'technology', scale: 'large' },
  { name: 'drone', category: 'technology', scale: 'handheld' },
  { name: 'telescope', category: 'technology', scale: 'large' },
  { name: 'compass', category: 'technology', scale: 'tiny' },
  { name: 'lantern', category: 'technology', scale: 'handheld' },
  // Sports / Outdoor
  { name: 'surfboard', category: 'sport', scale: 'large' },
  { name: 'skateboard', category: 'sport', scale: 'handheld' },
  { name: 'campfire', category: 'outdoor', scale: 'large' },
  { name: 'bicycle', category: 'sport', scale: 'large' },
  { name: 'snowboard', category: 'sport', scale: 'large' },
  // Toys / Whimsy
  { name: 'teddy bear', category: 'toy', scale: 'handheld' },
  { name: 'kite', category: 'toy', scale: 'handheld' },
  { name: 'music box', category: 'toy', scale: 'tiny' },
  { name: 'snow globe', category: 'toy', scale: 'tiny' },
  { name: 'balloons', category: 'toy', scale: 'handheld' },
  // Mythical / Artifacts
  { name: 'crystal orb', category: 'artifact', scale: 'handheld' },
  { name: 'ancient book', category: 'artifact', scale: 'handheld' },
  { name: 'treasure chest', category: 'artifact', scale: 'large' },
  { name: 'hourglass', category: 'artifact', scale: 'handheld' },
  { name: 'magic mirror', category: 'artifact', scale: 'large' },
  // Nature / Elements
  { name: 'giant flower', category: 'nature', scale: 'large' },
  { name: 'butterfly swarm', category: 'nature', scale: 'large' },
  { name: 'bonsai tree', category: 'nature', scale: 'handheld' },
  { name: 'crystals', category: 'nature', scale: 'handheld' },
  { name: 'seashell', category: 'nature', scale: 'tiny' },
  // Girly / Glam / Coquette
  { name: 'jewelry box', category: 'glam', scale: 'handheld' },
  { name: 'crystal chandelier', category: 'glam', scale: 'massive' },
  { name: 'ornate hand mirror', category: 'glam', scale: 'handheld' },
  { name: 'rose bouquet', category: 'glam', scale: 'handheld' },
  { name: 'perfume bottle', category: 'glam', scale: 'tiny' },
  { name: 'jeweled hand fan', category: 'glam', scale: 'handheld' },
  { name: 'parasol', category: 'glam', scale: 'handheld' },
  { name: 'vanity table', category: 'glam', scale: 'large' },
  { name: 'music locket', category: 'glam', scale: 'tiny' },
  { name: 'glass terrarium', category: 'glam', scale: 'handheld' },
];

const OBJECT_FUSION_COUNTS = { realistic: 7, fantasy: 7, scifi: 6 };

const MOOD_WORDS = [
  'dark', 'eerie', 'haunting', 'ghostly', 'ominous', 'sinister',
  'foreboding', 'menace', 'menacing', 'dread', 'gloomy', 'creepy',
];

function validate(text) {
  const lower = text.toLowerCase();
  return !MOOD_WORDS.some(w => lower.includes(w));
}

async function generateBaseCard(name, category, scale) {
  console.log(`  Generating base card...`);

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 3000,
    messages: [{
      role: 'user',
      content: `You are a cinematic prop master. Create a visual essence card for the object: "${name}"
Category: ${category}, Scale: ${scale}

Return ONLY valid JSON:
{
  "tags": ["3-5 tags from: weapon, vehicle, instrument, creature, technology, sport, outdoor, toy, artifact, nature, glam, face_risk"],
  "visual_forms": ["8 visually striking versions of this object with specific details, 8-12 words each"],
  "material_textures": ["8 close-up tactile details — surface finish, wear, materials, 6-10 words each"],
  "signature_details": ["6 cinematic micro-details that catch light or draw the eye, 6-10 words each"],
  "scale_contexts": ["6 ways this object relates to a human body in size/position, 6-10 words each"],
  "interaction_modes": ["8 natural ways a person interacts with this object, 6-10 words each — NOT wearing it"],
  "environment_bindings": ["10 ways this object is physically grounded in a scene, 6-10 words each"],
  "role_options": ["artifact on a pedestal", "hero prop in foreground", "carried casually", "background element", "surreal giant-scale version"],
  "context_bridges": ["12 story justifications for WHY this object is in a random scene, 6-10 words each — washed up, left behind, salvaged, discovered, abandoned, displayed, etc."],
  "soft_presence_forms": ["6 indirect/symbolic appearances — as mural, sign, shadow, carving, 8-12 words each"],
  "faceswap_forbidden": ["constraints if this object could cover a face, or empty array"],
  "faceswap_safe_positive": ["3 safe positioning phrases for face-swap mode, 6-10 words each"]
}

MOOD-NEUTRAL: describe physical appearance ONLY. No emotional tone, no darkness, no eeriness.
Objects should be beautiful, interesting, and wonder-filled.
Each phrase max 12 words. No duplicates. No metaphors.`
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

async function generateFusionAnchors(name, genre, count) {
  const genreGuide = {
    realistic: 'grounded, real-world cinematic',
    fantasy: 'magical, mythical, enchanted, wonder-filled',
    scifi: 'futuristic, sci-fi, technological, awe-inspiring',
  };

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 500,
    messages: [{
      role: 'user',
      content: `Generate ${count} unique ${genreGuide[genre]} visual variations of "${name}".
Each must be a DIFFERENT material, style, or visual treatment.
Format: one per line, numbered. Each is 8-12 words.
MOOD-NEUTRAL: beautiful and wonder-filled, not dark or threatening.
Output ONLY the numbered list.`,
    }],
  });

  return msg.content[0].text.split('\n')
    .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim())
    .filter(line => line.length > 5)
    .filter(validate);
}

async function generateFullCard(obj) {
  console.log(`\n🎸 ${obj.name} (${obj.category}/${obj.scale})`);

  const base = await generateBaseCard(obj.name, obj.category, obj.scale);
  if (!base) return;

  const filterField = (arr) => (arr || []).filter(validate);

  // Generate fusion forms (20 total: 7+7+6)
  const fusionForms = {};
  for (const [genre, count] of Object.entries(OBJECT_FUSION_COUNTS)) {
    console.log(`  ${genre}: generating ${count} fusion forms...`);
    const forms = await generateFusionAnchors(obj.name, genre, count);
    fusionForms[genre] = forms;
    console.log(`  ${genre}: ${forms.length} forms`);
  }

  const card = {
    name: obj.name.toLowerCase().trim(),
    tags: base.tags || [],
    category: obj.category,
    scale: obj.scale,
    prompt_version: 2,
    model_version: 'claude-sonnet-4-5-20250929',
    visual_forms: filterField(base.visual_forms),
    material_textures: filterField(base.material_textures),
    signature_details: filterField(base.signature_details),
    scale_contexts: filterField(base.scale_contexts),
    interaction_modes: filterField(base.interaction_modes),
    environment_bindings: filterField(base.environment_bindings),
    role_options: base.role_options || [],
    fusion_forms: fusionForms,
    context_bridges: filterField(base.context_bridges),
    soft_presence_forms: filterField(base.soft_presence_forms),
    faceswap_forbidden: base.faceswap_forbidden || [],
    faceswap_safe_positive: base.faceswap_safe_positive || [],
  };

  const totalForms = Object.values(fusionForms).reduce((s, a) => s + a.length, 0);
  console.log(`  Base: ${card.visual_forms.length} forms, ${card.context_bridges.length} bridges, ${totalForms} fusions`);

  // Upsert
  await sb.from('object_cards').delete().eq('name', card.name);
  const { error } = await sb.from('object_cards').insert(card);
  if (error) {
    console.error(`  ❌ Insert failed:`, error.message);
  } else {
    console.log(`  ✅ Saved`);
  }
}

(async () => {
  const args = process.argv.slice(2);

  if (args[0] === '--list') {
    CURATED_OBJECTS.forEach((o, i) => console.log(`${i + 1}. ${o.name} (${o.category}/${o.scale})`));
    console.log(`\nTotal: ${CURATED_OBJECTS.length}`);
    return;
  }

  if (args[0] === '--all') {
    for (const obj of CURATED_OBJECTS) {
      await generateFullCard(obj);
    }
  } else {
    for (const name of args) {
      const obj = CURATED_OBJECTS.find(o => o.name === name.toLowerCase()) || { name, category: 'misc', scale: 'handheld' };
      await generateFullCard(obj);
    }
  }

  console.log('\n🎉 Done.');
})();
