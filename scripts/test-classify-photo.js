/**
 * Test classify-photo end-to-end.
 * For each test photo: call classify-photo, print result, then call generate-dream
 * with the classification and render a dream.
 *
 * Usage:
 *   node scripts/test-classify-photo.js
 */
const { createClient } = require('@supabase/supabase-js');
const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY);
const EMAIL = 'konakevin@gmail.com';
const URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const USER_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';

// Public test photos from Unsplash (royalty-free, stable URLs)
const TEST_PHOTOS = [
  {
    label: 'WIFE (expect PERSON)',
    url: null, // filled from plus_one cast below
    fromCast: 'plus_one',
  },
  {
    label: 'DOG (expect ANIMAL)',
    url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
  },
  {
    label: 'VINTAGE CAR (expect OBJECT)',
    url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80',
  },
  {
    label: 'MOUNTAIN LANDSCAPE (expect SCENERY)',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
  },
];

async function getJwt() {
  const { data: linkData } = await sb.auth.admin.generateLink({ type: 'magiclink', email: EMAIL });
  const { data: otpData } = await sb.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: 'magiclink',
  });
  return otpData.session.access_token;
}

async function classify(photoUrl, jwt) {
  const res = await fetch(`${URL}/functions/v1/classify-photo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
    body: JSON.stringify({ input_image: photoUrl }),
  });
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { error: `non-JSON [${res.status}]: ${text.slice(0, 200)}` };
  }
}

async function generateWithClassification(photoUrl, classification, jwt, recipe) {
  const today = new Date().toISOString().slice(0, 10);
  await sb.from('ai_generation_budget').delete().eq('user_id', USER_ID).eq('date', today);
  const res = await fetch(`${URL}/functions/v1/generate-dream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
    body: JSON.stringify({
      mode: 'flux-kontext',
      input_image: photoUrl,
      photo_style: 'new_scene',
      medium_key: 'canvas',
      vibe_key: 'coquette',
      vibe_profile: recipe,
      subject_description: classification.subject_description,
      subject_type: classification.type,
    }),
  });
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { error: `non-JSON [${res.status}]: ${text.slice(0, 200)}` };
  }
}

(async () => {
  const { data: recipeRow } = await sb
    .from('user_recipes')
    .select('recipe')
    .eq('user_id', USER_ID)
    .single();

  // Fill in cast thumb URLs
  for (const p of TEST_PHOTOS) {
    if (p.fromCast) {
      const cast = recipeRow.recipe.dream_cast.find((m) => m.role === p.fromCast);
      p.url = cast?.thumb_url;
    }
  }

  for (const photo of TEST_PHOTOS) {
    if (!photo.url) {
      console.log(`\n━━━ ${photo.label} ━━━`);
      console.log('  SKIP: no url');
      continue;
    }
    console.log(`\n━━━ ${photo.label} ━━━`);
    console.log(`URL: ${photo.url.slice(0, 80)}...`);

    const jwt = await getJwt();
    const t0 = Date.now();
    const classification = await classify(photo.url, jwt);
    const classifyMs = Date.now() - t0;

    if (classification.error) {
      console.log(`  CLASSIFY ERROR (${classifyMs}ms): ${classification.error}`);
      continue;
    }
    console.log(`  CLASSIFIED (${classifyMs}ms):`);
    console.log(`    type: ${classification.type}`);
    console.log(`    description: ${(classification.subject_description || '').slice(0, 150)}`);

    if (classification.type === 'unclear') {
      console.log(`  (client would show modal — skipping generation)`);
      continue;
    }

    const t1 = Date.now();
    const gen = await generateWithClassification(photo.url, classification, jwt, recipeRow.recipe);
    const genMs = Date.now() - t1;

    if (gen.error) {
      console.log(`  GENERATE ERROR (${genMs}ms): ${gen.error}`);
      continue;
    }
    console.log(`  GENERATED (${(genMs / 1000).toFixed(1)}s): ${gen.image_url}`);
  }
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
