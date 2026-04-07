#!/usr/bin/env node

/**
 * Autonomous cast dream quality tester.
 *
 * Generates cast dreams, evaluates each with Sonnet vision, scores them,
 * and logs what works vs what doesn't. Adjusts the Kontext prompt approach
 * between rounds based on findings.
 *
 * Usage:
 *   node scripts/test-cast-quality.js
 *   node scripts/test-cast-quality.js --count 10
 *   node scripts/test-cast-quality.js --role self     # only test self
 *   node scripts/test-cast-quality.js --role plus_one
 *   node scripts/test-cast-quality.js --role pet
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const Anthropic = require('@anthropic-ai/sdk');

const sb = createClient(
  'https://jimftynwrinwenonjrlj.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;
const KEVIN_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const COUNT = parseInt(process.argv.find((_, i, a) => a[i - 1] === '--count') ?? '5', 10);
const ROLE_FILTER = process.argv.find((_, i, a) => a[i - 1] === '--role') ?? null;

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const MEDIUMS = {
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
    'Claymation stop-motion animation, smooth sculpted clay characters, visible fingerprint textures',
  '3d_render':
    'Pixar-quality 3D render, soft rounded appealing shapes, subsurface scattering, volumetric lighting',
  ghibli:
    'Studio Ghibli animation style, soft painterly rendering, warm natural color palette, Miyazaki quality',
  comic_book:
    'Comic book art, bold ink outlines, dynamic composition, halftone Ben-Day dots, saturated flat colors',
  disney:
    'Classic Disney 2D animation, hand-drawn cel animation, clean flowing ink outlines, rich painted colors',
  tim_burton:
    'Tim Burton gothic style, spindly elongated limbs, spiral motifs, black and white with purple accents',
};

const VIBES = {
  cinematic:
    'Frame from an Oscar-winning film, motivated lighting, teal-and-orange grade, frozen narrative tension.',
  dreamy:
    'Soft ethereal haze, omnidirectional glow, pastels, weightlessness, moment between sleeping and waking.',
  dark: 'Deep shadow, light is rare and precious, restricted palette of teal and blood red, Caravaggio chiaroscuro.',
  epic: 'Impossibly vast scale, god rays, atmospheric perspective, the viewer feels small and awed.',
  cozy: 'Warm and close, candlelight, string lights, chunky knit blankets, shallow depth of field, steam rising.',
  psychedelic:
    'Melting reality, fractals, maximum saturation, forms morphing, patterns at every scale.',
  whimsical:
    'Physics optional, wrong sizes, candy-bright colors, spiral architecture, playful gravity.',
};

const CATEGORIES = [
  'cosmic',
  'impossible_architecture',
  'peaceful_absurdity',
  'bioluminescence',
  'joyful_chaos',
  'overgrown',
  'broken_gravity',
  'merged_worlds',
  'underwater',
  'cinematic',
];

const SHOT_DIRECTIONS = [
  'extreme low angle looking up, dramatic forced perspective',
  'wide establishing shot, tiny subject in vast environment, epic scale',
  'symmetrical dead-center composition, Wes Anderson framing',
  'silhouette against blazing backlight, rim lighting',
  'candid snapshot feeling, slightly off-center, caught mid-moment',
  'dutch angle, dramatic tension, off-kilter framing',
];

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
  const pred = await res.json();
  if (!pred.id) throw new Error('No prediction ID');
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const poll = await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, {
      headers: { Authorization: `Bearer ${REPLICATE_TOKEN}` },
    });
    const data = await poll.json();
    if (data.status === 'succeeded')
      return typeof data.output === 'string' ? data.output : data.output?.[0];
    if (data.status === 'failed') throw new Error(`Failed: ${data.error}`);
  }
  throw new Error('Timed out');
}

async function persistImage(tempUrl) {
  const resp = await fetch(tempUrl);
  const buf = Buffer.from(await resp.arrayBuffer());
  const fileName = `${KEVIN_ID}/${Date.now()}.jpg`;
  await sb.storage.from('uploads').upload(fileName, buf, { contentType: 'image/jpeg' });
  const { data } = sb.storage.from('uploads').getPublicUrl(fileName);
  return data.publicUrl;
}

async function evaluateWithVision(imageUrl, promptUsed, castDescription, mediumKey) {
  const imgResp = await fetch(imageUrl);
  const imgBuf = Buffer.from(await imgResp.arrayBuffer());
  const base64 = imgBuf.toString('base64');

  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64 } },
          {
            type: 'text',
            text: `You are a quality evaluator for AI-generated dream images. Score this image.

KONTEXT PROMPT USED: "${promptUsed}"

CAST MEMBER DESCRIPTION: "${castDescription}"

INTENDED MEDIUM: ${mediumKey}

Score each dimension 1-5 and explain briefly:

1. LIKENESS: Does the person/pet from the input photo appear recognizable? (5 = clearly them, 1 = unrecognizable or missing)
2. TRANSFORMATION: Is the scene genuinely transformed into a surreal dream, or does it look like the original photo with a filter? (5 = completely new world, 1 = barely changed)
3. INTEGRATION: Does the person look naturally embedded in the scene, or pasted on / awkward? (5 = seamless, 1 = obvious composite)
4. MEDIUM: Does the art style match the intended medium (${mediumKey})? (5 = perfect style match, 1 = wrong style entirely)
5. WOW_FACTOR: Would someone stop scrolling to look at this? (5 = jaw-dropping, 1 = generic)

Output JSON only: {"likeness":N,"transformation":N,"integration":N,"medium":N,"wow":N,"notes":"brief explanation of what worked and what didn't"}`,
          },
        ],
      },
    ],
  });

  const text = msg.content?.[0]?.text?.trim() ?? '';
  try {
    const match = text.match(/\{[\s\S]*\}/);
    return JSON.parse(match?.[0] ?? text);
  } catch {
    return { likeness: 0, transformation: 0, integration: 0, medium: 0, wow: 0, notes: text };
  }
}

async function main() {
  console.log(`\n🔬 Cast Dream Quality Test — ${COUNT} dreams\n`);

  // Load profile
  const { data: row } = await sb
    .from('user_recipes')
    .select('recipe')
    .eq('user_id', KEVIN_ID)
    .single();
  const profile = row?.recipe;
  if (!profile) {
    console.error('No profile');
    process.exit(1);
  }

  const seeds = profile.dream_seeds ?? { characters: [], places: [], things: [] };
  let cast = (profile.dream_cast ?? []).filter(
    (m) => m.description && m.thumb_url?.startsWith('http')
  );

  if (ROLE_FILTER) cast = cast.filter((m) => m.role === ROLE_FILTER);
  if (!cast.length) {
    console.error(
      'No described cast with http URLs. Run test-full-dream.js first to fix cast photos.'
    );
    process.exit(1);
  }

  console.log(
    `Cast: ${cast.map((m) => `${m.role} (${m.description?.slice(0, 30)}...)`).join(', ')}\n`
  );

  const results = [];

  for (let i = 0; i < COUNT; i++) {
    const castMember = pick(cast);
    const mediumKey = pick(Object.keys(MEDIUMS));
    const mediumFragment = MEDIUMS[mediumKey];
    const vibeKey = pick(Object.keys(VIBES));
    const vibeDirective = VIBES[vibeKey];
    const category = pick(CATEGORIES);

    console.log(`[${i + 1}/${COUNT}] ${castMember.role} | ${mediumKey} | ${vibeKey} | ${category}`);

    // Get template
    const { data: rows } = await sb
      .from('dream_templates')
      .select('template')
      .eq('category', category)
      .eq('disabled', false)
      .limit(200);
    if (!rows?.length) {
      console.log('  No templates, skip');
      continue;
    }

    const template = pick(rows).template;
    const character = castMember.role === 'pet' ? 'a small creature' : 'a lone figure';
    const place = seeds.places.length > 0 ? pick(seeds.places) : 'a forgotten city';
    const thing = seeds.things.length > 0 ? pick(seeds.things) : 'glowing fragments';
    const filledTemplate = template
      .replace(/\$\{character\}/g, character)
      .replace(/\$\{place\}/g, place)
      .replace(/\$\{thing\}/g, thing);

    const roleLabel =
      castMember.role === 'self'
        ? 'the dreamer themselves'
        : castMember.role === 'pet'
          ? 'their beloved pet'
          : castMember.relationship === 'significant_other'
            ? 'their romantic partner'
            : `their ${castMember.relationship ?? 'companion'}`;

    const shotDirection = pick(SHOT_DIRECTIONS);

    // Stylized mediums: transform the person INTO the medium (LEGO minifig, clay puppet, etc.)
    // Realistic mediums: keep the person's face, transform the scene around them
    // Stylized mediums: use Flux Dev with text description (better scenes, medium always correct)
    // Realistic mediums: use Kontext with actual photo (face preserved)
    const STYLIZED_MEDIUMS = new Set([
      'pixel_art',
      'lego',
      'claymation',
      'anime',
      'comic_book',
      'disney',
      'sack_boy',
      'funko_pop',
      'ghibli',
      'tim_burton',
      'pop_art',
      'minecraft',
      '8bit',
      'felt',
    ]);
    const isStylized = STYLIZED_MEDIUMS.has(mediumKey);

    let promptUsed;
    let imageUrl;
    const engine = isStylized ? 'flux-dev-cast' : 'kontext-cast';

    if (isStylized) {
      // ── STYLIZED: Flux Dev with per-medium template (same as V2 text path) ──
      const castDesc =
        castMember.role === 'pet'
          ? `A ${castMember.description}`
          : `The protagonist is ${roleLabel}: ${castMember.description}. Stylized as a ${mediumKey.replace(/_/g, ' ')} character — same hair, build, clothing but fully in the art style.`;

      const subject = `${filledTemplate}. ${castDesc}`;

      // Per-medium templates — proven to produce correct medium rendering
      const MEDIUM_TEMPLATES = {
        lego: (s, v) =>
          `Write a Flux AI prompt (50-70 words, comma-separated) for a PHOTOGRAPH of a REAL LEGO SET:\n- Start with: "Photograph of a real LEGO brick diorama, soft studio lighting, shallow depth of field"\n- Subject: ${s} — built ENTIRELY from LEGO bricks. Characters are minifigures with painted expressions, snap-on hair, C-shaped hands\n- EVERY object, surface, and background element is LEGO — visible studs, snap-together construction\n- Portrait 9:16\nExpress the mood through brick color choices and lighting: ${v.slice(0, 200)}\nOutput ONLY the prompt.`,
        pixel_art: (s, v) =>
          `Write a Flux AI prompt (50-70 words, comma-separated) for pixel art:\n- Start with: "16-bit pixel art, SNES era, visible pixel grid, limited 24-color palette, crisp pixel edges"\n- Subject: ${s} — rendered as pixel art sprites and pixel environments\n- Characters have blocky features, dot eyes, iconic silhouettes\n- Dithered shading, NO anti-aliasing, NO smooth gradients\n- Portrait 9:16\nExpress the mood through palette selection: ${v.slice(0, 200)}\nOutput ONLY the prompt.`,
        claymation: (s, v) =>
          `Write a Flux AI prompt (50-70 words, comma-separated) for claymation:\n- Start with: "Claymation stop-motion animation, smooth sculpted clay characters, visible fingerprint textures, glass bead eyes, handcrafted miniature sets"\n- Subject: ${s} — sculpted from smooth matte clay with subtle fingerprint textures\n- Characters have glass bead eyes, knitted/felted clothing. Sets are handcrafted miniatures.\n- Portrait 9:16\nExpress the mood through set lighting and clay color palette: ${v.slice(0, 200)}\nOutput ONLY the prompt.`,
        anime: (s, v) =>
          `Write a Flux AI prompt (50-70 words, comma-separated) for anime illustration:\n- Start with: "Anime illustration, clean ink linework, cel-shaded coloring, expressive detailed eyes, vibrant saturated colors"\n- Subject: ${s} — drawn in anime style with clean ink outlines, cel-shaded flat color\n- Characters have expressive eyes with light reflections, dynamic flowing hair\n- Backgrounds painted with atmospheric detail (Shinkai-style)\n- Portrait 9:16\nExpress the mood through background atmosphere and color saturation: ${v.slice(0, 200)}\nOutput ONLY the prompt.`,
        comic_book: (s, v) =>
          `Write a Flux AI prompt (50-70 words, comma-separated) for comic book art:\n- Start with: "Comic book art, bold ink outlines, dynamic composition, halftone Ben-Day dots, saturated flat colors, graphic novel splash page quality"\n- Subject: ${s} — drawn with bold confident ink outlines, flat saturated color\n- Ben-Day dot halftone patterns in mid-tones. Dynamic angles. Kinetic energy.\n- Portrait 9:16\nExpress the mood through ink weight and color intensity: ${v.slice(0, 200)}\nOutput ONLY the prompt.`,
        disney: (s, v) =>
          `Write a Flux AI prompt (50-70 words, comma-separated) for Disney animation:\n- Start with: "Classic Disney 2D animation, hand-drawn cel animation, clean flowing ink outlines, rich painted colors, Renaissance Disney quality"\n- Subject: ${s} — as a Disney animated character with expressive emotive face, large eyes\n- Clean ink outlines, luminous cel-painted color, lush painted backgrounds\n- Portrait 9:16\nExpress the mood through background painting and color vibrancy: ${v.slice(0, 200)}\nOutput ONLY the prompt.`,
        ghibli: (s, v) =>
          `Write a Flux AI prompt (50-70 words, comma-separated) for Studio Ghibli:\n- Start with: "Studio Ghibli animation, soft painterly rendering, warm natural palette, detailed painted backgrounds, Miyazaki quality"\n- Subject: ${s} — in Ghibli style with natural rounded proportions, warm watercolor-like shading\n- Breathtaking painted landscapes with atmospheric perspective. Nature as a character.\n- Portrait 9:16\nExpress the mood through landscape detail and palette warmth: ${v.slice(0, 200)}\nOutput ONLY the prompt.`,
        tim_burton: (s, v) =>
          `Write a Flux AI prompt (50-70 words, comma-separated) for Tim Burton style:\n- Start with: "Tim Burton gothic illustration, spindly elongated limbs, spiral motifs, black and white with purple accents, crooked angular architecture"\n- Subject: ${s} — with impossibly thin limbs, elongated neck, sunken dark-ringed eyes\n- Spiral motifs in hair, architecture. Stark black/white/grey with pops of purple or blood red.\n- Portrait 9:16\nExpress the mood through angular environment and shadow intensity: ${v.slice(0, 200)}\nOutput ONLY the prompt.`,
        '3d_render': (s, v) =>
          `Write a Flux AI prompt (50-70 words, comma-separated) for a 3D render:\n- Start with: "Pixar-quality 3D render, soft rounded appealing shapes, subsurface scattering, volumetric lighting, cinematic depth of field"\n- Subject: ${s} — as a stylized 3D animated scene with Pixar-level quality\n- Soft rounded shapes, glossy eyes, subsurface scattering on skin\n- Portrait 9:16\nExpress the mood through volumetric lighting and color palette: ${v.slice(0, 200)}\nOutput ONLY the prompt.`,
      };

      const templateFn = MEDIUM_TEMPLATES[mediumKey];
      const fluxBrief = templateFn
        ? templateFn(subject, vibeDirective)
        : `You are a cinematographer. Write a Flux AI prompt (60-90 words, comma-separated).\n\nMEDIUM: ${mediumFragment}\n\nSCENE: ${subject}\n\nCAMERA: ${shotDirection}\nMOOD: ${vibeDirective}\n\nStart with the art medium. Place the character naturally IN the scene with their traits in ${mediumKey.replace(/_/g, ' ')} style. End with: portrait 9:16, hyper detailed.\nOutput ONLY the prompt.`;

      try {
        const msg = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 200,
          messages: [{ role: 'user', content: fluxBrief }],
        });
        promptUsed = msg.content?.[0]?.text?.trim() ?? '';
        if (promptUsed.length < 20) throw new Error('too short');
      } catch {
        promptUsed = `${mediumFragment}, ${filledTemplate}, ${castDesc.slice(0, 80)}, ${vibeDirective.split('.')[0]}, portrait 9:16, hyper detailed`;
      }

      console.log(`  [Flux Dev] ${promptUsed.slice(0, 100)}...`);

      try {
        const tempUrl = await generateFluxDev(promptUsed);
        imageUrl = await persistImage(tempUrl);
      } catch (err) {
        console.log(`  ❌ Flux Dev failed: ${err.message}\n`);
        continue;
      }
    } else {
      // ── REALISTIC: Kontext with actual photo — scene-dominant ──
      const kontextBrief = `You are writing an instruction for Flux Kontext Pro — an AI model that DRAMATICALLY transforms photos into surreal scenes.

THE SCENE IS THE STAR. The person is a small figure WITHIN an overwhelming, impossible environment.

PERSON/PET IN PHOTO: ${roleLabel} — ${castMember.description}

SURREAL SCENE (describe this in vivid detail — it should fill 80% of the image):
${filledTemplate}

CAMERA: ${shotDirection}
MOOD: ${vibeDirective}

Write the Kontext instruction. 50-70 words. Rules:
1. Start with "Transform this photo into a ${mediumFragment.split(',')[0]} scene:"
2. Spend 80% of the words on the ENVIRONMENT — the surreal architecture, impossible physics, materials, lighting, weather
3. The person is TINY within this vast scene — a small figure dwarfed by the impossible world
4. Keep their face recognizable but they should occupy at most 20% of the frame
5. Name specific materials, textures, light sources — NOT abstract adjectives
6. The original photo background must be COMPLETELY REPLACED by the dream scene

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
        promptUsed = `Transform this photo into a ${mediumFragment.split(',')[0]} scene: ${filledTemplate.slice(0, 100)}. The person is a tiny figure in this vast world. Keep their face. portrait 9:16.`;
      }

      console.log(`  [Kontext] ${promptUsed.slice(0, 100)}...`);

      try {
        const tempUrl = await generateKontext(promptUsed, castMember.thumb_url);
        imageUrl = await persistImage(tempUrl);
      } catch (err) {
        console.log(`  ❌ Kontext failed: ${err.message}\n`);
        continue;
      }
    }

    // Evaluate
    let scores;
    try {
      scores = await evaluateWithVision(imageUrl, promptUsed, castMember.description, mediumKey);
    } catch (err) {
      console.log(`  ⚠️ Evaluation failed: ${err.message}`);
      scores = {
        likeness: 0,
        transformation: 0,
        integration: 0,
        medium: 0,
        wow: 0,
        notes: 'eval failed',
      };
    }

    const avg = (
      (scores.likeness + scores.transformation + scores.integration + scores.medium + scores.wow) /
      5
    ).toFixed(1);

    console.log(
      `  Scores: like=${scores.likeness} trans=${scores.transformation} integ=${scores.integration} med=${scores.medium} wow=${scores.wow} | AVG=${avg}`
    );
    console.log(`  Notes: ${scores.notes}`);
    console.log();

    // Save dream
    await sb.from('uploads').insert({
      user_id: KEVIN_ID,
      categories: ['art'],
      image_url: imageUrl,
      ai_prompt: promptUsed,
      dream_medium: mediumKey,
      dream_vibe: vibeKey,
      bot_message: `[${engine}] ${castMember.role}|avg=${avg}`,
      is_approved: true,
      is_active: true,
    });

    results.push({
      role: castMember.role,
      medium: mediumKey,
      vibe: vibeKey,
      category,
      ...scores,
      avg: parseFloat(avg),
      prompt: promptUsed,
    });
  }

  // Summary
  console.log('\n══════════════════════════════════════');
  console.log('SUMMARY');
  console.log('══════════════════════════════════════\n');

  if (results.length === 0) {
    console.log('No results.');
    return;
  }

  const avgAll = (results.reduce((a, r) => a + r.avg, 0) / results.length).toFixed(1);
  console.log(`Overall average: ${avgAll}/5.0 across ${results.length} dreams\n`);

  // Best and worst
  results.sort((a, b) => b.avg - a.avg);
  console.log(
    'BEST:',
    results[0].medium,
    '|',
    results[0].vibe,
    '|',
    results[0].role,
    `(${results[0].avg})`,
    '-',
    results[0].notes?.slice(0, 80)
  );
  console.log(
    'WORST:',
    results[results.length - 1].medium,
    '|',
    results[results.length - 1].vibe,
    '|',
    results[results.length - 1].role,
    `(${results[results.length - 1].avg})`,
    '-',
    results[results.length - 1].notes?.slice(0, 80)
  );

  // Patterns
  console.log('\nBy dimension (avg):');
  const dims = ['likeness', 'transformation', 'integration', 'medium', 'wow'];
  for (const dim of dims) {
    const avg = (results.reduce((a, r) => a + (r[dim] || 0), 0) / results.length).toFixed(1);
    console.log(`  ${dim}: ${avg}/5`);
  }

  // By medium
  console.log('\nBy medium:');
  const byMedium = {};
  for (const r of results) {
    if (!byMedium[r.medium]) byMedium[r.medium] = [];
    byMedium[r.medium].push(r.avg);
  }
  Object.entries(byMedium)
    .sort(
      (a, b) =>
        b[1].reduce((x, y) => x + y, 0) / b[1].length -
        a[1].reduce((x, y) => x + y, 0) / a[1].length
    )
    .forEach(([m, scores]) =>
      console.log(
        `  ${m}: ${(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)} (${scores.length} dreams)`
      )
    );

  // By role
  console.log('\nBy cast role:');
  const byRole = {};
  for (const r of results) {
    if (!byRole[r.role]) byRole[r.role] = [];
    byRole[r.role].push(r.avg);
  }
  Object.entries(byRole).forEach(([role, scores]) =>
    console.log(
      `  ${role}: ${(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)} (${scores.length} dreams)`
    )
  );

  // Problems to fix
  const lowTrans = results.filter((r) => r.transformation <= 2);
  const lowInteg = results.filter((r) => r.integration <= 2);
  const lowMedium = results.filter((r) => r.medium <= 2);
  if (lowTrans.length)
    console.log(
      `\n⚠️ ${lowTrans.length} dreams had weak transformation (looked like original photo)`
    );
  if (lowInteg.length)
    console.log(`⚠️ ${lowInteg.length} dreams had poor integration (person looked pasted on)`);
  if (lowMedium.length) console.log(`⚠️ ${lowMedium.length} dreams had wrong art style`);

  console.log('\nDone! Check the app for results.');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
