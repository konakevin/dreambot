#!/usr/bin/env node
/**
 * Generate scenic thumbnail images for location picker tiles.
 * Uses Flux Dev to render a landscape preview for each location,
 * uploads to Supabase Storage, and stores the public URL in location_cards.
 *
 * Usage:
 *   node scripts/generate-location-thumbnails.js hawaii tokyo paris
 *   node scripts/generate-location-thumbnails.js --all        # all locations in LocationPickerStep
 *   node scripts/generate-location-thumbnails.js --missing     # only locations without thumbnail_url
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const REPLICATE_KEY = process.env.REPLICATE_API_TOKEN;
const sb = createClient(
  'https://jimftynwrinwenonjrlj.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BUCKET = 'location-thumbnails';

const LOCATION_PROMPTS = {
  'new york city': 'Aerial view of Manhattan skyline at golden hour, towering skyscrapers reflecting warm sunset light, Central Park visible below, dramatic clouds, cinematic wide shot, photorealistic',
  'tokyo': 'Shibuya crossing at twilight with glowing neon signs, dense urban Japanese cityscape, rain-slicked streets reflecting colorful lights, cinematic wide shot, photorealistic',
  'paris': 'Eiffel Tower framed by Haussmann buildings at blue hour, Seine river reflecting city lights, warm café glow, romantic atmosphere, cinematic wide shot, photorealistic',
  'venice': 'Grand Canal with gondolas at sunset, ornate Venetian palazzos reflected in turquoise water, golden light on marble facades, cinematic wide shot, photorealistic',
  'london': 'Tower Bridge and Thames at twilight, dramatic cloudy sky, city lights reflecting on water, iconic British architecture, cinematic wide shot, photorealistic',
  'dubai': 'Burj Khalifa towering above cloud layer at sunrise, futuristic glass skyline, golden desert light, ultra-modern cityscape, cinematic wide shot, photorealistic',
  'santorini': 'White-washed buildings with blue domes overlooking Aegean Sea at sunset, dramatic caldera cliffs, warm Mediterranean light, cinematic wide shot, photorealistic',
  'hong kong': 'Victoria Harbour at night with dense neon-lit skyscrapers, light reflections on water, dramatic urban density, cinematic wide shot, photorealistic',
  'rome': 'Roman Forum ruins at golden hour, ancient columns and arches bathed in warm light, Mediterranean pines in background, cinematic wide shot, photorealistic',
  'los angeles': 'Los Angeles skyline from Griffith Observatory at sunset, palm trees silhouetted, purple and orange sky, sprawling city lights below, cinematic wide shot, photorealistic',
  'miami': 'Miami Beach Art Deco district at dusk, pastel-colored buildings, palm trees, turquoise ocean, warm tropical light, cinematic wide shot, photorealistic',
  'san francisco': 'Golden Gate Bridge emerging from fog at sunrise, dramatic Pacific coastline, warm golden light on red towers, cinematic wide shot, photorealistic',
  'barcelona': 'Sagrada Familia towering above Barcelona rooftops at golden hour, Gothic Quarter in foreground, Mediterranean Sea in distance, cinematic wide shot, photorealistic',
  'rio de janeiro': 'Christ the Redeemer overlooking Guanabara Bay at sunset, Sugarloaf Mountain, lush green hills meeting turquoise water, cinematic wide shot, photorealistic',
  'seoul': 'Traditional Korean hanok village with modern Seoul skyline behind, cherry blossoms, Namsan Tower on hilltop, cinematic wide shot, photorealistic',
  'las vegas': 'Las Vegas Strip at night, dazzling neon lights and casino marquees, dramatic desert sky, electric energy, cinematic wide shot, photorealistic',
  'hawaii': 'Na Pali Coast cliffs at golden hour, dramatic volcanic ridges meeting turquoise Pacific Ocean, lush green valleys, tropical mist, cinematic wide shot, photorealistic',
  'maldives': 'Overwater bungalows on crystal-clear turquoise lagoon, white sand, tropical sunset, pristine coral reef visible through water, cinematic wide shot, photorealistic',
  'bali': 'Terraced rice paddies in Ubud at sunrise, morning mist through palm trees, ancient stone temple in background, lush tropical green, cinematic wide shot, photorealistic',
  'costa rica': 'Dense cloud forest canopy with hanging bridges, exotic birds, waterfalls cascading through emerald green jungle, tropical mist, cinematic wide shot, photorealistic',
  'bora bora tahiti': 'Mount Otemanu rising above crystal lagoon, overwater bungalows on turquoise water, white sand motus, tropical sunset, cinematic wide shot, photorealistic',
  'caribbean island': 'Pristine Caribbean beach with powdery white sand, swaying palm trees, crystal turquoise water, colorful fishing boats, cinematic wide shot, photorealistic',
  'yosemite': 'El Capitan and Half Dome at golden hour, Yosemite Valley with waterfalls, towering granite cliffs, pine forests, dramatic light rays, cinematic wide shot, photorealistic',
  'moab arches': 'Delicate Arch at sunset with La Sal Mountains behind, red sandstone formations glowing orange, dramatic desert sky, cinematic wide shot, photorealistic',
  'swiss alps': 'Matterhorn peak reflected in alpine lake at sunrise, snow-capped mountains, green meadows with wildflowers, Swiss chalets, cinematic wide shot, photorealistic',
  'iceland': 'Dramatic Icelandic landscape with glacier, black volcanic beach, northern lights in sky, steaming geothermal vents, surreal terrain, cinematic wide shot, photorealistic',
  'canadian rockies': 'Lake Louise with turquoise glacial water reflecting snow-capped Rocky Mountains, evergreen forests, dramatic clouds, cinematic wide shot, photorealistic',
  'grand canyon': 'Grand Canyon layers at golden hour, vast red and orange rock formations, Colorado River far below, dramatic shadows, cinematic wide shot, photorealistic',
  'zion national park': 'The Narrows in Zion with towering red canyon walls, Virgin River reflecting sky, lush hanging gardens, dramatic light, cinematic wide shot, photorealistic',
  'redwood forest': 'Ancient redwood trees towering overhead, cathedral-like forest, shafts of golden light through canopy, fern-covered floor, cinematic wide shot, photorealistic',
  'amazon rainforest': 'Dense Amazon canopy from river level, massive tropical trees, exotic wildlife, misty atmosphere, lush biodiversity, cinematic wide shot, photorealistic',
  'arctic wilderness': 'Arctic landscape with glaciers calving into deep blue sea, polar ice formations, aurora borealis, pristine white snow, cinematic wide shot, photorealistic',
  'sahara desert': 'Towering Saharan sand dunes at golden hour, dramatic shadows and curves, caravan of camels in distance, vast endless desert, cinematic wide shot, photorealistic',
  'big sur cliffs': 'Bixby Bridge spanning Big Sur coastline, dramatic Pacific cliffs, crashing waves, wildflowers on hillside, golden California light, cinematic wide shot, photorealistic',
  'ancient egypt': 'Great Pyramids of Giza at golden hour, Sphinx in foreground, vast desert stretching to horizon, warm amber light on limestone, cinematic wide shot, photorealistic',
  'machu picchu': 'Machu Picchu ruins emerging from morning clouds, Huayna Picchu peak behind, Incan stone terraces, dramatic Andean mountains, cinematic wide shot, photorealistic',
  'angkor wat': 'Angkor Wat temple complex reflected in lotus pond at sunrise, ancient stone towers, jungle growing through ruins, golden light, cinematic wide shot, photorealistic',
  'ancient rome': 'Roman Colosseum interior at golden hour, ancient arches and corridors, warm light on travertine stone, dramatic shadows, cinematic wide shot, photorealistic',
  'petra': 'The Treasury of Petra carved into rose-red cliff face, narrow Siq canyon entrance, warm golden light on sandstone, cinematic wide shot, photorealistic',
  'taj mahal': 'Taj Mahal reflected in long pool at sunrise, white marble glowing in warm light, symmetrical Mughal gardens, misty atmosphere, cinematic wide shot, photorealistic',
  'great wall of china': 'Great Wall winding across misty mountain ridges at sunrise, watchtowers disappearing into fog, autumn foliage, dramatic scale, cinematic wide shot, photorealistic',
  'enchanted forest': 'Magical glowing forest with bioluminescent mushrooms and fireflies, ancient twisted trees with golden leaves, ethereal mist, fantasy, cinematic wide shot',
  'floating sky islands': 'Massive floating islands in a sunset sky, waterfalls cascading into clouds below, lush vegetation on rocky platforms, fantasy, cinematic wide shot',
  'wizard academy': 'Grand magical academy with soaring towers and floating staircases, arcane symbols glowing, vast library visible through arched windows, fantasy, cinematic wide shot',
  'underwater city atlantis': 'Luminous underwater city with crystal domes and coral-covered spires, bioluminescent sea life, light rays penetrating deep blue water, fantasy, cinematic wide shot',
  'ancient elven city': 'Ethereal elven city built into massive ancient trees, silver bridges between platforms, soft golden light filtering through canopy, fantasy, cinematic wide shot',
  'dwarven fortress': 'Vast underground dwarven hall with towering stone pillars, rivers of molten gold, massive forge fires, carved mountain interior, fantasy, cinematic wide shot',
  'dragons keep': 'Dragon perched atop volcanic mountain fortress, treasure hoard visible in cavern below, dramatic storm clouds, fire-lit peaks, fantasy, cinematic wide shot',
  'crystal caverns': 'Enormous crystal cavern with massive prismatic formations, light refracting into rainbow spectrums, underground lake reflecting crystals, fantasy, cinematic wide shot',
  'cloud kingdom': 'Majestic palace built on clouds at sunset, golden spires piercing sky, rainbow bridges between cloud platforms, ethereal atmosphere, fantasy, cinematic wide shot',
  'fairy tale kingdom': 'Whimsical fairy tale castle on rolling hills, candy-colored towers, enchanted gardens with oversized flowers, warm storybook light, fantasy, cinematic wide shot',
  'paris cafe': 'Intimate Parisian café terrace at golden hour, bistro chairs on cobblestone, warm lamplight, flowering window boxes, romantic atmosphere, cinematic medium shot, photorealistic',
  'cherry blossoms': 'Avenue of cherry blossom trees in full bloom, pink petals drifting in warm breeze, soft golden light, serene pathway, cinematic wide shot, photorealistic',
  'japanese garden': 'Traditional Japanese zen garden with raked gravel, moss-covered stones, red maple, koi pond, bamboo water feature, peaceful atmosphere, cinematic wide shot, photorealistic',
  'fairy cottage': 'Tiny magical cottage in a woodland clearing, thatched roof covered in flowers, warm light from windows, garden of wildflowers and herbs, fantasy, cinematic medium shot',
  'princess garden castle': 'Romantic garden castle with climbing roses, marble fountains, manicured hedges, warm golden afternoon light, fairy tale atmosphere, fantasy, cinematic wide shot',
  'rose palace': 'Opulent palace courtyard filled with thousands of roses in every color, marble columns draped in vines, soft pink light, fantasy, cinematic wide shot',
  'victorian london': 'Foggy Victorian London street with gas lamps glowing, cobblestone roads, ornate brick buildings, horse carriages, moody atmospheric light, cinematic wide shot, photorealistic',
  'transylvania': 'Gothic castle on misty mountain peak at twilight, dark forests below, dramatic clouds, full moon, Carpathian Mountains, cinematic wide shot, photorealistic',
  'haunted cathedral': 'Vast gothic cathedral interior with stained glass windows casting colored light, stone arches, dramatic shadows, sacred atmosphere, cinematic wide shot, photorealistic',
  'noir cityscape': 'Rain-soaked city street at night, neon signs reflecting on wet asphalt, fire escapes and steam vents, dramatic film noir shadows, cinematic wide shot, photorealistic',
  'alien planet': 'Alien landscape with bioluminescent flora, twin suns setting over crystalline mountains, strange geological formations, unearthly color palette, sci-fi, cinematic wide shot',
  'cyberpunk megacity': 'Massive cyberpunk city with towering holographic billboards, flying vehicles, dense vertical architecture, neon-drenched rain, sci-fi, cinematic wide shot',
  'space station': 'Orbital space station with Earth visible through massive viewport, metallic corridors with blue lighting, zero-gravity elements, sci-fi, cinematic wide shot',
  'mars colony': 'Human settlement on Mars with pressurized domes, red desert landscape, distant Olympus Mons, Earth visible in sky, sci-fi, cinematic wide shot',
};

async function generateThumbnail(locationKey) {
  const prompt = LOCATION_PROMPTS[locationKey];
  if (!prompt) {
    console.error(`  ❌ No prompt for "${locationKey}"`);
    return null;
  }

  console.log(`  Generating image...`);
  const createRes = await fetch(
    'https://api.replicate.com/v1/models/black-forest-labs/flux-dev/predictions',
    {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + REPLICATE_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { prompt, width: 768, height: 512, num_outputs: 1, guidance: 3.5 },
      }),
    }
  );
  const pred = await createRes.json();
  if (!pred.id) {
    console.error(`  ❌ Prediction failed:`, pred);
    return null;
  }

  let imageUrl = null;
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 3000));
    const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, {
      headers: { Authorization: 'Bearer ' + REPLICATE_KEY },
    });
    const status = await pollRes.json();
    if (status.status === 'succeeded') {
      imageUrl = status.output && status.output[0];
      break;
    }
    if (status.status === 'failed' || status.status === 'canceled') {
      console.error(`  ❌ Prediction ${status.status}:`, status.error);
      return null;
    }
  }

  if (!imageUrl) {
    console.error(`  ❌ Prediction timed out`);
    return null;
  }

  console.log(`  Downloading...`);
  const res = await fetch(imageUrl);
  const buffer = Buffer.from(await res.arrayBuffer());

  const filename = `${locationKey.replace(/\s+/g, '-')}.webp`;
  console.log(`  Uploading to ${BUCKET}/${filename}...`);

  const { error: uploadErr } = await sb.storage
    .from(BUCKET)
    .upload(filename, buffer, {
      contentType: 'image/webp',
      upsert: true,
    });

  if (uploadErr) {
    console.error(`  ❌ Upload failed:`, uploadErr.message);
    return null;
  }

  const { data: urlData } = sb.storage.from(BUCKET).getPublicUrl(filename);
  return urlData.publicUrl;
}

async function processLocation(locationKey) {
  console.log(`\n📍 ${locationKey}`);

  const publicUrl = await generateThumbnail(locationKey);
  if (!publicUrl) return;

  const { error } = await sb
    .from('location_cards')
    .update({ thumbnail_url: publicUrl })
    .eq('name', locationKey);

  if (error) {
    console.error(`  ❌ DB update failed:`, error.message);
  } else {
    console.log(`  ✅ ${publicUrl}`);
  }
}

(async () => {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage:');
    console.log('  node scripts/generate-location-thumbnails.js hawaii tokyo');
    console.log('  node scripts/generate-location-thumbnails.js --all');
    console.log('  node scripts/generate-location-thumbnails.js --missing');
    process.exit(1);
  }

  // Ensure bucket exists
  const { data: buckets } = await sb.storage.listBuckets();
  if (!buckets.find(b => b.name === BUCKET)) {
    const { error } = await sb.storage.createBucket(BUCKET, { public: true });
    if (error) console.warn('Bucket creation:', error.message);
    else console.log(`Created bucket: ${BUCKET}`);
  }

  if (args[0] === '--all') {
    const keys = Object.keys(LOCATION_PROMPTS);
    console.log(`Generating ${keys.length} thumbnails...`);
    for (const key of keys) {
      await processLocation(key);
    }
  } else if (args[0] === '--missing') {
    const { data: rows } = await sb
      .from('location_cards')
      .select('name')
      .is('thumbnail_url', null);
    const names = (rows || []).map(r => r.name).filter(n => LOCATION_PROMPTS[n]);
    console.log(`${names.length} locations missing thumbnails...`);
    for (const name of names) {
      await processLocation(name);
    }
  } else {
    for (const name of args) {
      await processLocation(name);
    }
  }

  console.log('\n🎉 Done.');
})();
