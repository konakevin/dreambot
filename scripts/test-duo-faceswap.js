#!/usr/bin/env node
/**
 * Test: Generate a two-person scene and chain face swaps.
 *
 * 1. Load cast descriptions + thumb photos for self & plus_one
 * 2. Generate a scene with both people described
 * 3. Face swap self onto first person
 * 4. Face swap plus_one onto second person
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const sb = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const REPLICATE = process.env.REPLICATE_API_TOKEN;
const ANTHROPIC = process.env.ANTHROPIC_API_KEY;
const USER_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';

async function haikuText(prompt, maxTokens = 150) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text ?? '';
}

async function replicateGenerate(prompt) {
  console.log('\n🎨 Generating image...');
  console.log('   Prompt:', prompt.slice(0, 150));
  const res = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-dev/predictions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${REPLICATE}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: {
        prompt,
        aspect_ratio: '9:16',
        output_format: 'jpg',
        output_quality: 90,
      },
    }),
  });
  const pred = await res.json();
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 1500));
    const poll = await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, {
      headers: { Authorization: `Bearer ${REPLICATE}` },
    });
    const data = await poll.json();
    if (data.status === 'succeeded') {
      const url = Array.isArray(data.output) ? data.output[0] : data.output;
      console.log('   ✅ Image generated');
      return url;
    }
    if (data.status === 'failed') throw new Error(`Generation failed: ${data.error}`);
  }
  throw new Error('Generation timed out');
}

async function faceSwap(sourceUrl, targetUrl, label) {
  console.log(`\n🔄 Face swap: ${label}...`);
  const VERSION = '278a81e7ebb22db98bcba54de985d22cc1abeead2754eb1f2af717247be69b34';
  const res = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${REPLICATE}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      version: VERSION,
      input: { swap_image: sourceUrl, input_image: targetUrl },
    }),
  });
  const pred = await res.json();
  if (!pred.id) throw new Error('No prediction ID');
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 2000));
    const poll = await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, {
      headers: { Authorization: `Bearer ${REPLICATE}` },
    });
    const data = await poll.json();
    if (data.status === 'succeeded') {
      const url = typeof data.output === 'string' ? data.output : data.output?.[0];
      console.log(`   ✅ ${label} swapped`);
      return url;
    }
    if (data.status === 'failed') throw new Error(`Face swap failed: ${data.error}`);
  }
  throw new Error('Face swap timed out');
}

async function persistToStorage(url) {
  const resp = await fetch(url);
  const buf = await resp.arrayBuffer();
  const bytes = new Uint8Array(buf.slice(0, 4));
  const isPng = bytes[0] === 0x89 && bytes[1] === 0x50;
  const ext = isPng ? 'png' : 'jpg';
  const fileName = `${USER_ID}/${Date.now()}.${ext}`;
  const { error } = await sb.storage.from('uploads').upload(fileName, Buffer.from(buf), {
    contentType: isPng ? 'image/png' : 'image/jpeg',
  });
  if (error) throw error;
  const { data } = sb.storage.from('uploads').getPublicUrl(fileName);
  return data.publicUrl;
}

(async () => {
  try {
    const t0 = Date.now();

    // 1. Load cast
    const { data: recipeRow } = await sb.from('user_recipes').select('recipe').eq('user_id', USER_ID).single();
    const cast = recipeRow.recipe.dream_cast || [];
    const selfCast = cast.find(m => m.role === 'self');
    const plusCast = cast.find(m => m.role === 'plus_one');

    if (!selfCast?.thumb_url || !plusCast?.thumb_url) {
      console.error('❌ Need both self and plus_one with thumb photos');
      process.exit(1);
    }

    console.log('👤 Self:', selfCast.description?.slice(0, 60));
    console.log('👫 Plus one:', plusCast.description?.slice(0, 60));

    // 2. Summarize both people for the prompt
    const selfDesc = selfCast.description?.split('\n').slice(0, 5).join(', ').slice(0, 150) || 'a man';
    const plusDesc = plusCast.description?.split('\n').slice(0, 5).join(', ').slice(0, 150) || 'a woman';

    // 3. Build prompt with Haiku
    const brief = `Write a Flux AI image prompt (60-80 words, comma-separated phrases) for:
- A romantic fantasy art scene of a couple together
- Person 1 (left): ${selfDesc}
- Person 2 (right): ${plusDesc}
- Setting: magical enchanted forest at golden hour, glowing fireflies, soft ethereal light
- Both people clearly visible, facing slightly toward each other
- Portrait 9:16 orientation
- Fantasy art style, painterly brushstrokes, rich warm tones
- Both faces must be clearly visible and detailed
Output ONLY the prompt, no explanation.`;

    const prompt = await haikuText(brief);
    console.log('\n📝 Prompt:', prompt.slice(0, 200));

    // 4. Generate
    const baseUrl = await replicateGenerate(prompt);

    // 5. Face swap #1 — self
    const afterSelf = await faceSwap(selfCast.thumb_url, baseUrl, 'self');

    // 6. Face swap #2 — plus_one onto the result
    const afterBoth = await faceSwap(plusCast.thumb_url, afterSelf, 'plus_one');

    // 7. Persist final result
    console.log('\n💾 Persisting to storage...');
    const finalUrl = await persistToStorage(afterBoth);

    // 8. Create draft upload
    const { data: upload } = await sb.from('uploads').insert({
      user_id: USER_ID,
      image_url: finalUrl,
      caption: 'Duo face swap test — fantasy couple',
      ai_prompt: prompt,
      dream_medium: 'fantasy',
      dream_vibe: 'dreamy',
      visibility: 'private',
      is_active: false,
      is_posted: false,
      width: 768,
      height: 1664,
    }).select('id').single();

    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
    console.log(`\n✅ Done in ${elapsed}s`);
    console.log('📸 Image:', finalUrl);
    console.log('🆔 Upload:', upload?.id);
    console.log('\nCheck your My Dreams in the app!');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
