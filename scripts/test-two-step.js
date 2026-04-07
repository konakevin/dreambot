require('dotenv').config({ path: '/Users/kevinmchenry/Development/apps/dreambot/.env.local' });
const { createClient } = require('@supabase/supabase-js');
const Anthropic = require('@anthropic-ai/sdk');

const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;
const KEVIN_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

const MEDIUMS = [
  { key: 'oil_painting', flux: 'Oil painting on canvas, thick impasto brushstrokes, visible palette knife texture, rich layered glazes, Rembrandt-inspired chiaroscuro' },
  { key: 'anime', flux: 'Anime illustration, clean ink linework, cel-shaded coloring, expressive detailed eyes, Makoto Shinkai inspired backgrounds, vibrant saturated colors' },
  { key: 'lego', flux: 'LEGO brick diorama, everything constructed from LEGO pieces, plastic studs visible on every surface, minifigure characters, soft realistic lighting' },
  { key: 'ghibli', flux: 'Studio Ghibli animation style, soft painterly rendering, warm natural color palette, detailed painted backgrounds, Miyazaki quality' },
  { key: 'claymation', flux: 'Claymation stop-motion animation, smooth sculpted clay characters, visible fingerprint textures, glass bead eyes, handcrafted miniature sets' },
  { key: 'disney', flux: 'Classic Disney 2D animation, hand-drawn cel animation, clean flowing ink outlines, rich painted colors, Renaissance Disney quality' },
  { key: 'tim_burton', flux: 'Tim Burton gothic style, spindly elongated limbs, spiral motifs, black and white with purple accents, dark whimsical aesthetic' },
  { key: 'comic_book', flux: 'Comic book art, bold ink outlines, dynamic composition, halftone Ben-Day dots, saturated flat colors, graphic novel splash page quality' },
];

const VIBES = [
  { key: 'cinematic', dir: 'Frame from an Oscar-winning film. Teal-and-orange grade, motivated lighting, frozen narrative tension.' },
  { key: 'dreamy', dir: 'Soft ethereal haze, omnidirectional glow, pastels, weightlessness.' },
  { key: 'epic', dir: 'SCALE. Impossibly vast — towering mountains, endless skies, cosmic expanses. The viewer feels small and awed.' },
  { key: 'dark', dir: 'Deep shadow, velvety blacks. Light is rare and precious. Caravaggio chiaroscuro.' },
  { key: 'whimsical', dir: 'Physics optional. Wrong sizes, candy-bright colors, floating islands, playful gravity.' },
  { key: 'psychedelic', dir: 'Reality melting, fractals, maximum saturation, patterns at every scale.' },
];

const CATEGORIES = ['cosmic','impossible_architecture','bioluminescence','joyful_chaos','broken_gravity','merged_worlds','underwater','overgrown','peaceful_absurdity','cinematic'];

// Compositions that physically CANNOT be a center vanishing-point path
const SHOTS = [
  'bird\'s eye view looking STRAIGHT DOWN from above, the scene laid out flat like a map, no horizon line',
  'looking STRAIGHT UP from ground level at towering structures and sky above, worm\'s eye view',
  'extreme close-up macro shot of a surreal detail — a single object fills most of the frame, vast world visible through/around it',
  'cross-section cutaway view, like a dollhouse sliced open showing multiple rooms/layers stacked vertically',
  'fish-eye lens warping reality, curved distorted edges, subject in center of a spherical world',
  'the scene reflected in water/mirror/glass, the reflection showing a different reality than above',
  'split composition — top half and bottom half show completely different scenes meeting in the middle',
  'isometric view at 45 degrees, like a video game world rendered in 3/4 perspective, no vanishing point',
];

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
    const poll = await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, { headers: { Authorization: `Bearer ${REPLICATE_TOKEN}` } });
    const data = await poll.json();
    if (data.status === 'succeeded') return data.output?.[0];
    if (data.status === 'failed') throw new Error(`Failed: ${data.error}`);
  }
  throw new Error('Timed out');
}

async function generateKontext(prompt, inputImage, sceneImage) {
  // Kontext Pro with both the person photo and the scene as reference
  const res = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-kontext-pro/predictions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${REPLICATE_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: { prompt, input_image: sceneImage, aspect_ratio: '9:16', output_format: 'jpg' } }),
  });
  if (!res.ok) throw new Error(`Kontext create failed: ${res.status}`);
  const pred = await res.json();
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 2000));
    const poll = await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, { headers: { Authorization: `Bearer ${REPLICATE_TOKEN}` } });
    const data = await poll.json();
    if (data.status === 'succeeded') return typeof data.output === 'string' ? data.output : data.output?.[0];
    if (data.status === 'failed') throw new Error(`Failed: ${data.error}`);
  }
  throw new Error('Timed out');
}

async function cropTo916(inputBuf) {
  // Use sharp to crop 1:1 → 9:16 (take full width, crop height to 9/16 of width, center vertically)
  const sharp = require('sharp');
  const meta = await sharp(inputBuf).metadata();
  const w = meta.width;
  const targetH = Math.round((w * 16) / 9);
  const h = meta.height;
  // If image is already taller than 9:16, just crop centered
  // If shorter, take full height and crop width
  if (h >= targetH) {
    const top = Math.round((h - targetH) / 2);
    return sharp(inputBuf).extract({ left: 0, top, width: w, height: targetH }).jpeg({ quality: 90 }).toBuffer();
  } else {
    const targetW = Math.round((h * 9) / 16);
    const left = Math.round((w - targetW) / 2);
    return sharp(inputBuf).extract({ left, top: 0, width: targetW, height: h }).jpeg({ quality: 90 }).toBuffer();
  }
}

async function persistImage(tempUrl) {
  const resp = await fetch(tempUrl);
  const buf = Buffer.from(await resp.arrayBuffer());
  const fileName = `${KEVIN_ID}/${Date.now()}.jpg`;
  await sb.storage.from('uploads').upload(fileName, buf, { contentType: 'image/jpeg' });
  const { data } = sb.storage.from('uploads').getPublicUrl(fileName);
  return data.publicUrl;
}

async function main() {
  console.log('\n🔬 TWO-STEP CAST DREAM PROTOTYPE\n');

  // Load profile
  const { data: row } = await sb.from('user_recipes').select('recipe').eq('user_id', KEVIN_ID).single();
  const profile = row?.recipe;
  const seeds = profile?.dream_seeds ?? { characters: [], places: [], things: [] };
  const cast = (profile?.dream_cast ?? []).filter(m => m.description && m.thumb_url?.startsWith('http'));
  
  console.log(`Cast: ${cast.map(m => `${m.role} (${m.description?.slice(0,30)}...)`).join(', ')}\n`);

  const COUNT = parseInt(process.argv.find((_, i, a) => a[i-1] === '--count') ?? '5', 10);

  for (let i = 0; i < COUNT; i++) {
    const castMember = pick(cast);
    const medium = pick(MEDIUMS);
    const vibe = pick(VIBES);
    const category = pick(CATEGORIES);
    const shot = pick(SHOTS);

    console.log(`[${i+1}/${COUNT}] ${castMember.role} | ${medium.key} | ${vibe.key} | ${category}`);

    // Get template
    const { data: rows } = await sb.from('dream_templates').select('template').eq('category', category).eq('disabled', false).limit(200);
    if (!rows?.length) { console.log('  No templates, skip\n'); continue; }

    const template = pick(rows).template;
    const character = seeds.characters.length > 0 ? pick(seeds.characters) : 'a wandering figure';
    const place = seeds.places.length > 0 ? pick(seeds.places) : 'a forgotten city';
    const thing = seeds.things.length > 0 ? pick(seeds.things) : 'glowing fragments';
    const dreamScene = template.replace(/\$\{character\}/g, character).replace(/\$\{place\}/g, place).replace(/\$\{thing\}/g, thing);

    // ═══ STEP 1: Generate epic scene (NO character mention) ═══
    const sceneBrief = `You are a cinematographer composing a single breathtaking frame. Write a Flux AI prompt. 60-90 words, comma-separated.

MEDIUM: ${medium.flux}

DREAM SCENE (this is sacred — do NOT water it down):
${dreamScene}

CAMERA: ${shot}
MOOD: ${vibe.dir}

Write the prompt:
1. Start with the art medium
2. Describe the EXACT scene — every surreal detail preserved
3. NO PEOPLE. NO CHARACTERS. NO FIGURES. This is a pure landscape/environment.
4. Name specific materials, textures, light sources (NOUNS not adjectives)
5. Compose as if this is a WIDE panoramic canvas — fill the frame with interesting detail everywhere, not just the center. No vanishing-point corridors.
6. End with: no text, no words, no letters, no watermarks, hyper detailed

Do NOT mention aspect ratio or orientation in the prompt. Output ONLY the prompt.`;

    let scenePrompt;
    try {
      const msg = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 200,
        messages: [{ role: 'user', content: sceneBrief }],
      });
      scenePrompt = msg.content?.[0]?.text?.trim() ?? '';
      if (scenePrompt.length < 20) throw new Error('too short');
    } catch {
      scenePrompt = `${medium.flux}, ${dreamScene}, ${vibe.dir.split('.')[0]}, no people, no figures, square 1:1, hyper detailed`;
    }

    console.log(`  Step 1 [Scene]: ${scenePrompt.slice(0, 120)}...`);

    let sceneUrl;
    try {
      sceneUrl = await generateFluxDev(scenePrompt);
      if (!sceneUrl) throw new Error('No URL');
    } catch (err) {
      console.log(`  ❌ Scene generation failed: ${err.message}\n`);
      continue;
    }
    console.log(`  Step 1 ✅ Scene generated`);

    // ═══ STEP 2: Composite cast member into the scene via Kontext ═══
    const roleLabel = castMember.role === 'self' ? 'the dreamer themselves'
      : castMember.role === 'pet' ? 'their beloved pet'
      : castMember.relationship === 'significant_other' ? 'their romantic partner'
      : `their ${castMember.relationship ?? 'companion'}`;

    const kontextInstruction = castMember.role === 'pet'
      ? `Keep this EXACT scene unchanged. Add ONE small ${castMember.description?.split(',')[0] ?? 'white dog'} somewhere in the scene as a tiny detail. The scene composition, colors, art style, and lighting must remain IDENTICAL. The pet is barely noticeable — a small element in the corner or middle distance. Do NOT zoom in. Do NOT crop. Do NOT change the art style. Do NOT make the pet the focus.`
      : `Keep this EXACT scene unchanged. Add ONE small ${medium.key.replace(/_/g, ' ')}-style figure into the scene: ${castMember.description?.split('.')[0]}. The figure should be SMALL — occupying at most 15% of the image. Place them naturally within the environment at proper scale. The scene composition, colors, art style, and lighting must remain IDENTICAL. Do NOT zoom in. Do NOT crop. Do NOT change to a portrait. Do NOT make the person the focus.`;

    console.log(`  Step 2 [Composite]: ${kontextInstruction.slice(0, 100)}...`);

    let finalUrl;
    try {
      finalUrl = await generateKontext(kontextInstruction, castMember.thumb_url, sceneUrl);
      if (!finalUrl) throw new Error('No URL');
    } catch (err) {
      console.log(`  ❌ Composite failed: ${err.message}`);
      // Fall back to just the scene
      finalUrl = sceneUrl;
      console.log(`  ⚠️ Using scene-only as fallback`);
    }

    const imageUrl = await persistImage(finalUrl);
    console.log(`  Step 2 ✅ Final image: ${imageUrl.slice(-30)}`);

    // Save
    await sb.from('uploads').insert({
      user_id: KEVIN_ID,
      categories: ['art'],
      image_url: imageUrl,
      ai_prompt: `[TWO-STEP] Scene: ${scenePrompt.slice(0, 300)} | Composite: ${kontextInstruction.slice(0, 200)}`,
      dream_medium: medium.key,
      dream_vibe: vibe.key,
      bot_message: `[two-step] ${castMember.role}|${medium.key}`,
      is_approved: true,
      is_active: true,
    });

    console.log(`  ✅ Saved\n`);
  }

  console.log('Done! Check the app.');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
