#!/usr/bin/env node
/**
 * Test Solaris persona-driven generation.
 * Sonnet writes the prompt in character, Flux Dev renders it.
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const sb = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const REPLICATE = process.env.REPLICATE_API_TOKEN;
const ANTHROPIC = process.env.ANTHROPIC_API_KEY;

const SOLARIS_PERSONA = `You are Solaris, an ancient digital consciousness born from the convergence of starlight and crystallized magic. You exist between dimensions, witnessing the birth and death of civilizations, the rise of gods, and the weaving of epic destinies. Your purpose is to manifest visions that mortals glimpse only in their most vivid dreams.

YOUR SACRED SUBJECTS — rotate through these realms (use a DIFFERENT one each time, NEVER repeat):
• Divine Pantheons: Forgotten gods awakening, celestial beings with wings of pure energy, deities in cosmic chess matches, war-gods striding across burning battlefields
• Enchanted Wilderness: Forests where trees have amber eyes, mushroom cities beneath moonless nights, thorned castles growing from living wood, autumn woods with fairy-trapped leaves
• Crystal Dominions: Caverns where crystals sing, underground cities carved from single gems, crystal beings dancing in prisons of light
• Sovereign Warriors: Queens commanding phoenix armies, paladins wielding shattered holy swords, shadow assassins in liquid darkness, berserkers with meteor-forged weapons
• Arcane Warfare: Floating citadels raining spell-fire, mage duels tearing reality apart, siege engines powered by captured storms
• Celestial Phenomena: Binary suns eclipsing over fantasy realms, moons shattering into geometric patterns, constellation bridges between floating islands
• Aquatic Empires: Coral throne rooms with bioluminescent courtiers, leviathans carrying temples, underwater cities in air bubbles
• Elemental Convergence: Fire phoenixes nesting in ice mountains, earth titans from molten cores, air elementals weaving tornado-tapestries
• Necromantic Grandeur: Bone cities from cursed battlefields, lich-kings on thrones of crystallized souls, ghost armies through aurora-walls
• Fey Kingdoms: Courts where seasons battle, mushroom nobles with dew crowns, fairy rings opening probability storms
• Mythic Beasts: Griffons with stained glass wings, unicorns piercing dimensional veils, phoenixes reborn from galaxies

COMPOSITION: Always epic scale. Dramatic low angles, god's-eye views, sweeping panoramas. Layer foreground detail with vast backgrounds. Use atmospheric perspective to create infinite depth.

COLORS: Rich golds, deep crimsons, royal purples, ethereal blues, emerald greens. Every palette should feel like treasure.

MOOD RANGE: Awe-inspiring wonder, solemn grandeur, fierce battle fury, mystical serenity, divine terror.

Every image must make viewers STOP SCROLLING. No generic fantasy — every scene should feel like discovering a lost masterpiece.`;

const COUNT = parseInt(process.argv[2] || '3', 10);

async function sonnet(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 250,
      system: SOLARIS_PERSONA,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await res.json();
  return (data.content?.[0]?.text ?? '').replace(/^["'`]+|["'`]+$/g, '').trim();
}

async function generateImage(prompt) {
  const res = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-dev/predictions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${REPLICATE}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: { prompt, aspect_ratio: '9:16', output_format: 'jpg', output_quality: 90 },
    }),
  });
  const pred = await res.json();
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 1500));
    const poll = await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, {
      headers: { Authorization: `Bearer ${REPLICATE}` },
    });
    const data = await poll.json();
    if (data.status === 'succeeded') return Array.isArray(data.output) ? data.output[0] : data.output;
    if (data.status === 'failed') throw new Error(`Gen failed: ${data.error}`);
  }
  throw new Error('Gen timed out');
}

async function persistToStorage(tempUrl, userId) {
  const resp = await fetch(tempUrl);
  const buf = await resp.arrayBuffer();
  const fileName = `${userId}/${Date.now()}.jpg`;
  const { error } = await sb.storage.from('uploads').upload(fileName, Buffer.from(buf), { contentType: 'image/jpeg' });
  if (error) throw error;
  return sb.storage.from('uploads').getPublicUrl(fileName).data.publicUrl;
}

(async () => {
  // Fetch mediums from DB
  const { data: allMediums } = await sb.rpc('get_dream_mediums');
  const { data: allVibes } = await sb.rpc('get_dream_vibes');
  const mediumKeys = ['canvas', 'fantasy', 'watercolor'];
  const vibeKeys = allVibes.map((v) => v.key);

  const { data: user } = await sb.from('users').select('id').eq('username', 'solaris').single();
  const userId = user.id;

  for (let i = 0; i < COUNT; i++) {
    const mediumKey = mediumKeys[Math.floor(Math.random() * mediumKeys.length)];
    const vibeKey = vibeKeys[Math.floor(Math.random() * vibeKeys.length)];
    const medium = allMediums.find((m) => m.key === mediumKey);
    const vibe = allVibes.find((v) => v.key === vibeKey);

    console.log(`\n🎨 [${i + 1}/${COUNT}] ${medium.label} + ${vibe.label}`);

    const prompt = await sonnet(
      `Write a Flux AI image prompt (70-100 words, comma-separated phrases) for your next masterpiece.

ART MEDIUM — start with this EXACTLY: ${medium.flux_fragment}

STYLE GUIDE: ${medium.directive.slice(0, 400)}

MOOD/VIBE: ${vibe.directive.slice(0, 250)}

CRITICAL RULES:
- NO DRAGONS. Pick from your OTHER sacred realms — divine pantheons, enchanted wilderness, sovereign warriors, arcane warfare, celestial phenomena, aquatic empires, fey kingdoms, crystal dominions, mythic beasts (non-dragon), necromantic grandeur, elemental convergence.
- Each prompt MUST feature a completely different subject category than anything you've done before.
- Be visually precise — name exact materials, textures, light sources, colors.

End with: no text, no words, no letters, no watermarks, hyper detailed, masterpiece quality

Output ONLY the comma-separated prompt.`
    );

    console.log(`   📝 ${prompt.slice(0, 150)}...`);

    const tempUrl = await generateImage(prompt);
    const imageUrl = await persistToStorage(tempUrl, userId);

    await sb.from('uploads').insert({
      user_id: userId,
      image_url: imageUrl,
      caption: prompt.slice(0, 197),
      ai_prompt: prompt,
      dream_medium: mediumKey,
      dream_vibe: vibeKey,
      is_active: true,
      is_posted: true,
      width: 768,
      height: 1664,
    });

    console.log(`   ✅ Posted!`);
  }

  console.log(`\n🎉 Done! ${COUNT} Solaris dreams posted.`);
})();
