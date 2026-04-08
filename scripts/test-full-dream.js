#!/usr/bin/env node

/**
 * Full nightly dream pipeline test — exercises EVERY piece of onboarding data:
 *   - Mood-weighted template category selection
 *   - DB template with seed slot filling
 *   - Dream cast injection via Kontext (real photos)
 *   - Sonnet prompt writer with aesthetics, seeds, avoid list
 *   - Saves results as real dreams on the user's account
 *
 * Also fixes cast photos: uploads local file:// images to Storage,
 * describes them via Haiku vision, and updates the profile.
 *
 * Usage:
 *   node scripts/test-full-dream.js
 *   node scripts/test-full-dream.js --count 3
 *   node scripts/test-full-dream.js --cast-only      # only cast dreams (Kontext)
 *   node scripts/test-full-dream.js --no-cast         # only pure scene dreams (Flux Dev)
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const Anthropic = require('@anthropic-ai/sdk');

const SUPABASE_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const sb = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;
const KEVIN_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const COUNT = parseInt(process.argv.find((_, i, a) => a[i - 1] === '--count') ?? '5', 10);
const CAST_ONLY = process.argv.includes('--cast-only');
const NO_CAST = process.argv.includes('--no-cast');

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── Curated mediums/vibes (subset matching user's profile) ──────────────

const ALL_MEDIUMS = {
  pixel_art:
    '16-bit pixel art, carefully placed pixels, limited harmonious color palette, dithered gradients, retro game aesthetic',
  watercolor:
    'Watercolor painting on textured paper, transparent layered washes, wet-on-wet blooms, soft bleeding edges',
  oil_painting:
    'Oil painting on canvas, thick impasto brushstrokes, visible palette knife texture, rich layered glazes',
  anime:
    'Anime illustration, clean ink linework, cel-shaded coloring, expressive detailed eyes, dynamic hair flow',
  lego: 'LEGO brick diorama, everything constructed from LEGO pieces, plastic studs visible, minifigure characters',
  claymation:
    'Claymation stop-motion animation, smooth sculpted clay characters, visible fingerprint textures, glass bead eyes',
  '3d_render':
    'Pixar-quality 3D render, soft rounded appealing shapes, subsurface scattering, volumetric lighting',
  pencil_sketch:
    'Detailed pencil sketch on textured paper, confident graphite linework, hatching and cross-hatching',
  neon: 'Neon-lit night scene, glowing tube lights, electric cyan and hot pink, rain-slicked reflective surfaces',
  comic_book:
    'Comic book art, bold ink outlines, dynamic composition, halftone Ben-Day dots, saturated flat colors',
  embroidery:
    'Hand embroidery on linen fabric, cross-stitch and satin stitch techniques, visible thread texture',
  disney:
    'Classic Disney 2D animation, hand-drawn cel animation, clean flowing ink outlines, rich painted colors',
  sack_boy:
    'LittleBigPlanet Sack Boy style, knitted fabric characters, button eyes, cardboard craft material world',
  funko_pop:
    'Funko Pop vinyl figure style, oversized head, tiny body, glossy plastic surface, dot eyes',
  ghibli:
    'Studio Ghibli animation style, soft painterly rendering, warm natural color palette, Miyazaki quality',
  tim_burton:
    'Tim Burton gothic style, spindly elongated limbs, spiral motifs, black and white with purple accents',
  pop_art:
    'Pop art style, Andy Warhol screen print, bold flat primary colors at maximum saturation',
  minecraft: 'Minecraft voxel style, everything built from cubic blocks, pixelated block textures',
  '8bit':
    'NES 8-bit pixel art, extremely limited color palette, large chunky pixels, retro 1985 gaming',
  felt: 'Needle-felted stop-motion puppet, visible wool fiber texture, hand-crafted miniature set, Laika quality',
};

const ALL_VIBES = {
  cinematic:
    'Frame from an Oscar-winning film, motivated lighting, teal-and-orange grade, frozen narrative tension.',
  dreamy:
    'Soft ethereal haze, omnidirectional glow, pastels, weightlessness, moment between sleeping and waking.',
  dark: 'Deep shadow, light is rare and precious, restricted palette of teal and blood red, Caravaggio chiaroscuro.',
  chaos:
    'No rules, conflicting light sources, clashing colors at maximum saturation, reality glitching.',
  cozy: 'Warm and close, candlelight, string lights, chunky knit blankets, shallow depth of field, steam rising.',
  minimal:
    'One subject, vast negative space, two colors max, mathematical composition, held breath.',
  epic: 'Impossibly vast scale, god rays, atmospheric perspective, the viewer feels small and awed.',
  nostalgic:
    'Warm golden tones, eternal summer, magic hour, slightly soft focus, romanticized memory.',
  psychedelic:
    'Melting reality, fractals, maximum saturation, forms morphing, patterns at every scale.',
  peaceful:
    'Absolute stillness, still water, soft harmonious colors, horizontal lines, breathing slows.',
  whimsical:
    'Physics optional, wrong sizes, candy-bright colors, spiral architecture, playful gravity.',
};

const SHOT_DIRECTIONS = [
  'extreme low angle looking up, dramatic forced perspective, subject towering overhead',
  'tilt-shift miniature effect, shallow depth of field, toy-like scale',
  'silhouette against blazing backlight, rim lighting, dramatic contrast',
  'macro lens extreme close-up, impossibly detailed textures, creamy bokeh background',
  'aerial view looking straight down, geometric patterns, vast scale',
  'wide establishing shot, tiny subject in vast environment, epic scale',
  'symmetrical dead-center composition, Wes Anderson framing, obsessive balance',
  'reflection shot, scene mirrored in water or glass, doubled reality',
  'candid snapshot feeling, slightly off-center, caught mid-moment',
  'dutch angle, dramatic tension, off-kilter framing',
];

// ── Mood-weighted category picker ───────────────────────────────────────

function pickWeightedCategory(moods) {
  const w = {
    cosmic: 1 + moods.realistic_surreal * 0.5,
    microscopic: 1 + (1 - moods.minimal_maximal) * 0.5,
    impossible_architecture: 1 + moods.realistic_surreal * 0.5 + moods.minimal_maximal * 0.3,
    giant_objects: 1 + moods.minimal_maximal * 0.5,
    peaceful_absurdity: 1 + (1 - moods.peaceful_chaotic) * 0.8 + (1 - moods.cute_terrifying) * 0.3,
    beautiful_melancholy:
      1 + (1 - moods.peaceful_chaotic) * 0.5 + (1 - moods.minimal_maximal) * 0.3,
    cosmic_horror: 1 + moods.cute_terrifying * 0.8 + moods.realistic_surreal * 0.3,
    joyful_chaos: 1 + moods.peaceful_chaotic * 0.8 + (1 - moods.cute_terrifying) * 0.3,
    eerie_stillness: 1 + (1 - moods.peaceful_chaotic) * 0.5 + moods.cute_terrifying * 0.5,
    broken_gravity: 1 + moods.peaceful_chaotic * 0.3 + moods.realistic_surreal * 0.5,
    wrong_materials: 1 + moods.realistic_surreal * 0.8,
    time_distortion: 1 + moods.realistic_surreal * 0.8,
    merged_worlds: 1 + moods.realistic_surreal * 0.5 + moods.minimal_maximal * 0.3,
    living_objects: 1 + (1 - moods.cute_terrifying) * 0.3 + moods.realistic_surreal * 0.3,
    impossible_weather: 1 + moods.peaceful_chaotic * 0.3 + moods.realistic_surreal * 0.3,
    overgrown: 1 + (1 - moods.peaceful_chaotic) * 0.3,
    bioluminescence: 1 + (1 - moods.cute_terrifying) * 0.5 + (1 - moods.peaceful_chaotic) * 0.3,
    dreams_within_dreams: 1 + moods.realistic_surreal * 0.8 + moods.minimal_maximal * 0.3,
    memory_distortion: 1 + (1 - moods.peaceful_chaotic) * 0.3 + moods.realistic_surreal * 0.5,
    abandoned_running: 1 + moods.cute_terrifying * 0.3 + (1 - moods.peaceful_chaotic) * 0.3,
    transformation: 1 + moods.realistic_surreal * 0.5 + moods.peaceful_chaotic * 0.3,
    reflections: 1 + (1 - moods.minimal_maximal) * 0.3 + moods.realistic_surreal * 0.3,
    machines: 1 + moods.minimal_maximal * 0.5 + moods.peaceful_chaotic * 0.3,
    music_sound: 1 + moods.peaceful_chaotic * 0.3,
    underwater: 1 + (1 - moods.peaceful_chaotic) * 0.3,
    doors_portals: 1 + moods.realistic_surreal * 0.5,
    collections: 1 + moods.minimal_maximal * 0.8,
    decay_beauty: 1 + moods.cute_terrifying * 0.5 + (1 - moods.peaceful_chaotic) * 0.3,
    childhood: 1 + (1 - moods.cute_terrifying) * 0.5,
    transparency: 1 + moods.realistic_surreal * 0.5 + (1 - moods.minimal_maximal) * 0.3,
    cinematic: 1 + moods.minimal_maximal * 0.3,
  };
  const entries = Object.entries(w);
  const total = entries.reduce((a, [, v]) => a + v, 0);
  let roll = Math.random() * total;
  for (const [cat, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return cat;
  }
  return entries[0][0];
}

// ── Replicate helpers ───────────────────────────────────────────────────

async function generateFluxDev(prompt) {
  const res = await fetch(
    'https://api.replicate.com/v1/models/black-forest-labs/flux-dev/predictions',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${REPLICATE_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { prompt, aspect_ratio: '9:16', num_outputs: 1, output_format: 'jpg' },
      }),
    }
  );
  if (!res.ok) throw new Error(`Flux Dev create failed: ${res.status}`);
  return pollPrediction(await res.json());
}

async function generateKontext(prompt, inputImageUrl) {
  const res = await fetch(
    'https://api.replicate.com/v1/models/black-forest-labs/flux-kontext-pro/predictions',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${REPLICATE_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { prompt, input_image: inputImageUrl, aspect_ratio: '9:16', output_format: 'jpg' },
      }),
    }
  );
  if (!res.ok) throw new Error(`Kontext create failed: ${res.status}`);
  return pollPrediction(await res.json());
}

async function pollPrediction(pred) {
  if (!pred.id) throw new Error('No prediction ID');
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const res = await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, {
      headers: { Authorization: `Bearer ${REPLICATE_TOKEN}` },
    });
    const data = await res.json();
    if (data.status === 'succeeded') {
      return typeof data.output === 'string' ? data.output : data.output?.[0];
    }
    if (data.status === 'failed') throw new Error(`Failed: ${data.error}`);
  }
  throw new Error('Timed out');
}

async function persistImage(tempUrl) {
  const resp = await fetch(tempUrl);
  if (!resp.ok) throw new Error('Download failed');
  const buf = Buffer.from(await resp.arrayBuffer());
  const fileName = `${KEVIN_ID}/${Date.now()}.jpg`;
  const { error } = await sb.storage
    .from('uploads')
    .upload(fileName, buf, { contentType: 'image/jpeg' });
  if (error) throw new Error(`Storage: ${error.message}`);
  const { data } = sb.storage.from('uploads').getPublicUrl(fileName);
  return data.publicUrl;
}

// ── Main ────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🌙 Full Nightly Dream Pipeline Test — ${COUNT} dreams\n`);

  // 1. Load profile
  const { data: row } = await sb
    .from('user_recipes')
    .select('recipe')
    .eq('user_id', KEVIN_ID)
    .single();
  if (!row?.recipe) {
    console.error('No profile. Run onboarding first.');
    process.exit(1);
  }
  const profile = row.recipe;

  const seeds = profile.dream_seeds ?? { characters: [], places: [], things: [] };
  const moods = profile.moods ?? {
    peaceful_chaotic: 0.5,
    cute_terrifying: 0.3,
    minimal_maximal: 0.5,
    realistic_surreal: 0.5,
  };
  const aesthetics = profile.aesthetics ?? [];
  const artStyles = profile.art_styles ?? [];
  const avoid = profile.avoid ?? ['text', 'watermarks'];
  let cast = profile.dream_cast ?? [];

  console.log('Profile:');
  console.log('  Art styles:', artStyles.join(', '));
  console.log('  Aesthetics:', aesthetics.join(', '));
  console.log('  Moods:', JSON.stringify(moods));
  console.log('  Seeds:', JSON.stringify(seeds));
  console.log('  Avoid:', avoid.join(', '));
  console.log('  Cast:', cast.length, 'members');

  // 2. Fix cast photos — upload file:// to Storage and describe via Haiku vision
  let castFixed = false;
  for (let ci = 0; ci < cast.length; ci++) {
    const member = cast[ci];

    // Upload local file:// to Storage if needed
    if (member.thumb_url?.startsWith('file://')) {
      const localPath = decodeURIComponent(member.thumb_url.replace('file://', ''));
      if (!fs.existsSync(localPath)) {
        console.log(`  ⚠️ ${member.role}: file not found, skipping`);
        continue;
      }
      const buf = fs.readFileSync(localPath);
      const fileName = `${KEVIN_ID}/cast-${member.role}-${Date.now()}.jpg`;
      const { error } = await sb.storage
        .from('uploads')
        .upload(fileName, buf, { contentType: 'image/jpeg' });
      if (error) {
        console.log(`  ⚠️ ${member.role}: upload failed: ${error.message}`);
        continue;
      }
      const { data } = sb.storage.from('uploads').getPublicUrl(fileName);
      cast[ci].thumb_url = data.publicUrl;
      castFixed = true;
      console.log(`  ✅ ${member.role}: uploaded to ${data.publicUrl.slice(0, 80)}...`);
    }

    // Describe via Haiku vision if no description
    if (!member.description && cast[ci].thumb_url?.startsWith('http')) {
      try {
        // Download image and convert to base64 for vision API
        const imgResp = await fetch(cast[ci].thumb_url);
        const imgBuf = Buffer.from(await imgResp.arrayBuffer());
        const base64 = imgBuf.toString('base64');
        const mimeType = 'image/jpeg';

        const roleHint =
          member.role === 'self'
            ? 'This is a photo of the user themselves.'
            : member.role === 'pet'
              ? 'This is a photo of a pet.'
              : 'This is a photo of someone important to the user.';

        const msg = await anthropic.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 100,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64 } },
                {
                  type: 'text',
                  text: `${roleHint} Describe their appearance in one sentence: skin tone, hair color/style, clothing, distinguishing features. Be factual and concise. Output ONLY the description.`,
                },
              ],
            },
          ],
        });
        const desc = msg.content?.[0]?.text?.trim() ?? '';
        if (desc.length > 5) {
          cast[ci].description = desc;
          castFixed = true;
          console.log(`  ✅ ${member.role}: described — ${desc.slice(0, 80)}...`);
        }
      } catch (err) {
        console.log(`  ⚠️ ${member.role}: vision failed: ${err.message}`);
      }
    }
  }

  // Save fixed cast back to DB
  if (castFixed) {
    await sb
      .from('user_recipes')
      .update({
        recipe: { ...profile, dream_cast: cast },
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', KEVIN_ID);
    console.log('  Cast photos fixed and saved to DB\n');
  }

  const describedCast = cast.filter((m) => m.description && m.thumb_url?.startsWith('http'));
  console.log(
    `  Described cast ready: ${describedCast.map((m) => m.role).join(', ') || '(none)'}\n`
  );

  // 3. Generate dreams
  for (let i = 0; i < COUNT; i++) {
    // Decide: cast dream or pure scene
    const useCast = !NO_CAST && describedCast.length > 0 && (CAST_ONLY || Math.random() < 0.4);
    const castMember = useCast ? pick(describedCast) : null;

    // Pick medium from user's styles
    const mediumKey = artStyles.length > 0 ? pick(artStyles) : pick(Object.keys(ALL_MEDIUMS));
    const mediumFragment = ALL_MEDIUMS[mediumKey] ?? ALL_MEDIUMS.oil_painting;

    // Pick vibe from user's aesthetics
    const vibeKey = aesthetics.length > 0 ? pick(aesthetics) : pick(Object.keys(ALL_VIBES));
    const vibeDirective = ALL_VIBES[vibeKey] ?? ALL_VIBES.dreamy;

    // Pick mood-weighted category
    const category = pickWeightedCategory(moods);

    console.log(
      `[${i + 1}/${COUNT}] ${castMember ? `CAST(${castMember.role})` : 'SCENE'} | medium: ${mediumKey} | vibe: ${vibeKey} | cat: ${category}`
    );

    // Fetch template
    const { data: rows } = await sb
      .from('dream_templates')
      .select('template')
      .eq('category', category)
      .eq('disabled', false)
      .limit(200);

    if (!rows?.length) {
      console.log('  No templates, skipping');
      continue;
    }

    const template = pick(rows).template;

    // For cast dreams, use a neutral character placeholder that matches the cast role
    // so the template doesn't conflict with the person being injected via Kontext
    let character;
    if (castMember) {
      character =
        castMember.role === 'pet'
          ? 'a small creature'
          : castMember.role === 'self'
            ? 'a lone figure'
            : 'a figure';
    } else {
      character = seeds.characters.length > 0 ? pick(seeds.characters) : 'a wandering figure';
    }
    const place = seeds.places.length > 0 ? pick(seeds.places) : 'a forgotten city';
    const thing = seeds.things.length > 0 ? pick(seeds.things) : 'glowing fragments';

    const filledTemplate = template
      .replace(/\$\{character\}/g, character)
      .replace(/\$\{place\}/g, place)
      .replace(/\$\{thing\}/g, thing);

    console.log(`  Scene: ${filledTemplate.slice(0, 100)}...`);

    const shotDirection = pick(SHOT_DIRECTIONS);
    const aestheticFlavor =
      aesthetics.length > 0
        ? `\nFLAVOR (the dreamer vibes with): ${aesthetics.slice(0, 4).join(', ')}`
        : '';
    const allSeeds = [...seeds.characters, ...seeds.places, ...seeds.things];
    const extraSeeds =
      allSeeds.length > 0
        ? `\nDREAMER'S INGREDIENTS (weave 1-2 in naturally if they fit): ${allSeeds
            .sort(() => Math.random() - 0.5)
            .slice(0, 4)
            .join(', ')}`
        : '';
    const avoidLine = avoid.length > 0 ? `\nNEVER INCLUDE: ${avoid.join(', ')}` : '';

    let imageUrl;
    let promptUsed;

    if (castMember) {
      // ── CAST DREAM: Kontext ──
      const roleLabel =
        castMember.role === 'self'
          ? 'the dreamer themselves'
          : castMember.role === 'pet'
            ? 'their beloved pet'
            : castMember.relationship === 'significant_other'
              ? 'their romantic partner'
              : `their ${castMember.relationship ?? 'companion'}`;

      const kontextBrief = `You are writing an instruction for Flux Kontext Pro — an AI model that takes a PHOTO of a real person/pet and transforms the scene around them while KEEPING their face and likeness.

PERSON/PET IN PHOTO: ${roleLabel} — ${castMember.description}

DREAM SCENE TO BUILD AROUND THEM:
${filledTemplate}

CAMERA: ${shotDirection}
MOOD: ${vibeDirective}
${aestheticFlavor}${extraSeeds}${avoidLine}

Write the Kontext instruction. 50-70 words. Rules:
1. Start with "Transform this photo:"
2. Place the person/pet AS THE PROTAGONIST of this surreal scene
3. Keep their face, expression, and identity — change EVERYTHING else
4. Describe the surreal environment wrapping around them with specific materials and light sources
5. The person should feel naturally embedded, not pasted on
6. Art style: ${mediumFragment.split(',').slice(0, 2).join(',')}

Output ONLY the instruction.`;

      try {
        const msg = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 150,
          messages: [{ role: 'user', content: kontextBrief }],
        });
        promptUsed = msg.content?.[0]?.text?.trim() ?? '';
        if (promptUsed.length < 20) throw new Error('too short');
      } catch {
        promptUsed = `Transform this photo: place this person in ${filledTemplate.slice(0, 100)}. Keep their face. ${mediumFragment.split(',')[0]}, surreal atmosphere, portrait 9:16.`;
      }

      console.log(`  Kontext prompt: ${promptUsed.slice(0, 120)}...`);

      try {
        const tempUrl = await generateKontext(promptUsed, castMember.thumb_url);
        imageUrl = await persistImage(tempUrl);
      } catch (err) {
        console.log(`  ❌ Kontext failed: ${err.message}`);
        continue;
      }
    } else {
      // ── PURE SCENE: Flux Dev ──
      const fluxBrief = `You are a cinematographer composing a single breathtaking frame. Convert this dream into a Flux AI prompt. 60-90 words, comma-separated phrases.

MEDIUM: ${mediumFragment}

DREAM SCENE (this is sacred — do NOT water it down):
${filledTemplate}

CAMERA/COMPOSITION: ${shotDirection}

MOOD: ${vibeDirective}
${aestheticFlavor}${extraSeeds}${avoidLine}

Write the prompt:
1. Start with the art medium
2. Describe the EXACT scene — every surreal detail preserved
3. Apply the camera direction
4. Name specific materials, textures, light sources (NOUNS not adjectives)
5. End with: portrait 9:16, hyper detailed, masterwork composition, stunning lighting

No quotation marks. Output ONLY the prompt.`;

      try {
        const msg = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 200,
          messages: [{ role: 'user', content: fluxBrief }],
        });
        promptUsed = msg.content?.[0]?.text?.trim() ?? '';
        if (promptUsed.length < 20) throw new Error('too short');
      } catch {
        promptUsed = `${mediumFragment}, ${filledTemplate}, ${vibeDirective.split('.')[0]}, portrait 9:16, hyper detailed, gorgeous lighting`;
      }

      console.log(`  Flux prompt: ${promptUsed.slice(0, 120)}...`);

      try {
        const tempUrl = await generateFluxDev(promptUsed);
        imageUrl = await persistImage(tempUrl);
      } catch (err) {
        console.log(`  ❌ Flux Dev failed: ${err.message}`);
        continue;
      }
    }

    // Save as a dream
    const engine = castMember ? `kontext-cast-${castMember.role}` : 'flux-dev-scene';
    const { data: upload, error: uploadErr } = await sb
      .from('uploads')
      .insert({
        user_id: KEVIN_ID,
        categories: ['art'],
        image_url: imageUrl,
        caption: null,
        ai_prompt: promptUsed,
        bot_message: `[test] ${engine} | ${category}`,
        is_approved: true,
        is_active: true,
      })
      .select('id')
      .single();

    if (uploadErr) {
      console.log(`  ❌ DB insert failed: ${uploadErr.message}`);
    } else {
      console.log(`  ✅ Saved (id: ${upload.id}) — ${engine}\n`);
    }
  }

  console.log('\nDone! Check your feed in the app.');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
