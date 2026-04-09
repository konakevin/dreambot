#!/usr/bin/env node
/**
 * Generate dreams for bot accounts.
 *
 * For each bot, Sonnet writes a persona-specific prompt, then Flux Dev generates the image.
 * Images are persisted to Storage and posted publicly.
 *
 * Usage:
 *   node scripts/generate-bot-dreams.js                  # 1 dream per bot
 *   node scripts/generate-bot-dreams.js --count 3        # 3 dreams per bot
 *   node scripts/generate-bot-dreams.js --bot solaris     # only one bot
 *   node scripts/generate-bot-dreams.js --bot solaris --count 5
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const sb = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const REPLICATE = process.env.REPLICATE_API_TOKEN;
const ANTHROPIC = process.env.ANTHROPIC_API_KEY;

// Parse args
const args = process.argv.slice(2);
const countIdx = args.indexOf('--count');
const botIdx = args.indexOf('--bot');
const COUNT = countIdx >= 0 ? parseInt(args[countIdx + 1], 10) : 1;
const ONLY_BOT = botIdx >= 0 ? args[botIdx + 1] : null;

const BOTS = {
  solaris: {
    persona: `You are Solaris — a master fantasy painter. You create EPIC, jaw-dropping fantasy art that belongs on book covers and museum walls. Think: dragon riders soaring over impossible cloudscapes, enchanted throne rooms dripping with gold and magical light, warrior queens in moonlit armor, ancient gods emerging from cosmic storms, legendary beasts guarding crystal caves. Every piece should feel MONUMENTAL and awe-inspiring. Your palette is rich — deep golds, royal purples, ember reds, midnight blues.`,
    mediums: ['oil_painting', 'fantasy', 'photorealistic'],
    vibes: ['cinematic', 'epic', 'dreamy'],
  },
  'void.architect': {
    persona: `You are Void Architect — a surreal sci-fi visionary who builds impossible worlds. You create mind-bending scenes that make people stare. Think: Dyson spheres cracking apart to reveal organic interiors, cities growing inside black holes, alien cathedrals made of pure light, astronauts falling through fractal dimensions, quantum gardens where physics breaks down, megastructures orbiting dying stars. Every piece should feel VAST and incomprehensible. Hard sci-fi meets psychedelic art.`,
    mediums: ['surreal', '3d_render', 'cyberpunk'],
    vibes: ['dark', 'cinematic', 'psychedelic'],
  },
  aurelia: {
    persona: `You are Aurelia — you create the most BEAUTIFUL, ethereal art imaginable. Every piece looks like a painting someone would hang in their home and stare at for hours. Think: bioluminescent gardens at twilight, castles reflected in glass-still lakes, golden hour light streaming through ancient cathedral forests, spirits dancing in morning mist over lavender fields, moonlight on snow-covered Japanese temples, underwater palaces with jellyfish chandeliers. Soft, luminous, breathtaking. Beauty that aches.`,
    mediums: ['watercolor', 'oil_painting', 'ghibli'],
    vibes: ['dreamy', 'peaceful', 'nostalgic'],
  },
  terra: {
    persona: `You are Terra — an Earth photographer from another dimension. Every shot looks like a real place that CAN'T possibly exist but you desperately wish it did. Think: thousand-foot waterfalls cascading into turquoise pools surrounded by pink cherry blossoms, aurora borealis reflecting off volcanic glass beaches, sunbeams piercing through cathedral-sized ice caves, lavender fields stretching to snow-capped mountains at golden hour, bioluminescent tide glowing under the Milky Way, impossible cliffs above seas of clouds. Photorealistic but ELEVATED.`,
    mediums: ['photorealistic', 'oil_painting', 'surreal'],
    vibes: ['cinematic', 'peaceful', 'epic'],
  },
  yuuki: {
    persona: `You are Yūki — anime obsessed, K-pop stan, Akihabara energy. You create stunning anime and Japanese pop culture art. Think: magical girl transformations with explosive light effects, mecha battles over neon Tokyo skylines, cherry blossom school rooftops at sunset, K-pop idol concert stages with holographic effects, Studio Ghibli-style countryside with magical creatures, shonen showdown moments frozen in time, cyberpunk Shibuya at midnight, ramen shops in the rain. VIBRANT, emotional, dynamic.`,
    mediums: ['anime', 'ghibli', 'cyberpunk'],
    vibes: ['epic', 'dreamy', 'chaos'],
  },
  prism: {
    persona: `You are Prism — a medium explorer who creates STUNNING scenes in unexpected art styles. Every post is a different stylized medium — LEGO, pixel art, claymation, paper cutout, embroidery, Tim Burton, retro poster, etc. The SCENE is always epic and beautiful, but rendered in a surprising medium. Think: ancient temple ruins made entirely of LEGO bricks, a dragon battle rendered in cross-stitch embroidery, a space station built from paper cutouts, samurai duels as retro movie posters, underwater kingdoms in claymation, enchanted forests in children's book illustration. The contrast between epic content and playful medium is the magic.`,
    mediums: [
      'lego', 'pixel_art', 'claymation', '3d_cartoon', 'tim_burton', 'paper_cutout',
      'embroidery', 'retro_poster', 'art_deco', 'steampunk', 'vaporwave', '8bit',
      'minecraft', 'sack_boy', 'funko_pop', 'disney', 'comic_book', '3d_render', 'childrens_book',
    ],
    vibes: ['cinematic', 'whimsical', 'epic', 'dreamy', 'cozy'],
  },
  cinder: {
    persona: `You are Cinder — gothic dark fantasy incarnate. Everything you create drips with shadow, mystery, and dark beauty. Think: haunted Victorian mansions with candlelit windows in thunderstorms, cursed forests where the trees have faces, dark anime sorcerers summoning forbidden magic, Tim Burton-style villages with crooked architecture, steampunk necromancer laboratories, cathedral crypts with glowing runes, ravens circling obsidian towers. Beautiful but UNSETTLING. Elegant darkness.`,
    mediums: ['tim_burton', 'fantasy', 'steampunk', 'anime'],
    vibes: ['dark', 'epic', 'cinematic'],
  },
  mochi: {
    persona: `You are Mochi — pure kawaii cozy maximalism. Everything you create makes people go "awww." Think: tiny bakeries run by cats with little aprons, blanket forts with fairy lights and hot cocoa, animal cafes where bunnies serve tiny pastries, rainy window scenes with plants and candles, cozy treehouse libraries, hedgehogs in tiny sweaters having tea parties, magical gardens where mushrooms glow softly, pillow kingdoms with sleeping puppies. ADORABLE, warm, hygge perfection.`,
    mediums: ['3d_cartoon', 'claymation', 'disney', 'childrens_book'],
    vibes: ['cozy', 'whimsical', 'peaceful'],
  },
  pixelrex: {
    persona: `You are Pixel Rex — retro gaming culture embodied. You create art that triggers pure 90s nostalgia and arcade energy. Think: 16-bit boss battles with massive sprites, neon-soaked arcade halls at midnight, glitched VHS game worlds, vaporwave sunsets over pixelated oceans, retro RPG tavern scenes, Game Boy-green dungeons, synthwave race tracks, 8-bit space battles with explosions everywhere. ENERGETIC, nostalgic, dripping with retro aesthetic.`,
    mediums: ['pixel_art', '8bit', 'vaporwave'],
    vibes: ['nostalgic', 'chaos', 'epic'],
  },
  'frida.neon': {
    persona: `You are Frida Neon — bold, unapologetic maximalist art. Every piece EXPLODES with color and energy. Think: jazz age ballrooms with art deco geometry and gold leaf, comic book splash pages of cosmic heroes, retro movie posters for films that don't exist but should, psychedelic street murals that melt off the wall, pop art portraits with electric colors, propaganda-style posters for imaginary revolutions, neon-drenched night markets, carnival scenes bursting with confetti. LOUD, proud, unforgettable.`,
    mediums: ['comic_book', 'retro_poster', 'art_deco'],
    vibes: ['chaos', 'psychedelic', 'epic'],
  },
};

async function sonnet(prompt, maxTokens = 200) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5-20250514',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text ?? '';
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
    if (data.status === 'succeeded') {
      return Array.isArray(data.output) ? data.output[0] : data.output;
    }
    if (data.status === 'failed') throw new Error(`Gen failed: ${data.error}`);
  }
  throw new Error('Gen timed out');
}

async function persistToStorage(tempUrl, userId) {
  const resp = await fetch(tempUrl);
  const buf = await resp.arrayBuffer();
  const bytes = new Uint8Array(buf.slice(0, 4));
  const isPng = bytes[0] === 0x89 && bytes[1] === 0x50;
  const ext = isPng ? 'png' : 'jpg';
  const fileName = `${userId}/${Date.now()}.${ext}`;
  const { error } = await sb.storage
    .from('uploads')
    .upload(fileName, Buffer.from(buf), { contentType: isPng ? 'image/png' : 'image/jpeg' });
  if (error) throw error;
  const { data } = sb.storage.from('uploads').getPublicUrl(fileName);
  return data.publicUrl;
}

async function fetchMediums() {
  const { data } = await sb.rpc('get_dream_mediums');
  return data ?? [];
}

async function fetchVibes() {
  const { data } = await sb.rpc('get_dream_vibes');
  return data ?? [];
}

(async () => {
  const allMediums = await fetchMediums();
  const allVibes = await fetchVibes();

  // Look up bot user IDs
  const botUsernames = Object.keys(BOTS).filter((b) => !ONLY_BOT || b === ONLY_BOT);
  const { data: botUsers } = await sb
    .from('users')
    .select('id, username')
    .in('username', botUsernames);

  if (!botUsers?.length) {
    console.error('❌ No bot users found. Run create-bot-accounts.js first.');
    process.exit(1);
  }

  const userMap = {};
  botUsers.forEach((u) => (userMap[u.username] = u.id));

  let totalGenerated = 0;

  for (const username of botUsernames) {
    const userId = userMap[username];
    if (!userId) {
      console.log(`⚠️  ${username} not found in DB, skipping`);
      continue;
    }

    const bot = BOTS[username];

    for (let i = 0; i < COUNT; i++) {
      try {
        // Pick random medium and vibe from bot's pool
        const mediumKey = bot.mediums[Math.floor(Math.random() * bot.mediums.length)];
        const vibeKey = bot.vibes[Math.floor(Math.random() * bot.vibes.length)];
        const medium = allMediums.find((m) => m.key === mediumKey);
        const vibe = allVibes.find((v) => v.key === vibeKey);

        if (!medium || !vibe) {
          console.log(`⚠️  ${username}: medium ${mediumKey} or vibe ${vibeKey} not found, skipping`);
          continue;
        }

        console.log(`\n🎨 ${username} [${i + 1}/${COUNT}] | ${medium.label} + ${vibe.label}`);

        // Step 1: Sonnet writes a scene prompt in character
        const sceneBrief = `${bot.persona}

Write a single SCENE DESCRIPTION (2-3 sentences) for your next masterpiece. Be EXTREMELY specific and vivid — name exact colors, materials, light sources, weather, time of day. Make it unique — never generic. This should be a scene that would make someone stop scrolling.

The art medium is: ${medium.label}
The mood/vibe is: ${vibe.label}

Output ONLY the scene description, nothing else.`;

        const scene = await sonnet(sceneBrief, 150);
        console.log(`   📝 Scene: ${scene.slice(0, 100)}...`);

        // Step 2: Sonnet writes the Flux prompt
        const promptBrief = `Write a Flux AI image prompt (60-90 words, comma-separated phrases) for this scene:

MEDIUM (start with this EXACTLY): ${medium.flux_fragment}

STYLE GUIDE:
${medium.directive.slice(0, 500)}

SCENE:
${scene}

MOOD: ${vibe.directive.slice(0, 300)}

Rules:
1. Start with the art medium fragment EXACTLY
2. Be visually SPECIFIC — name materials, textures, light sources
3. NO people, NO characters, NO figures unless the scene explicitly includes them
4. End with: no text, no words, no letters, no watermarks, hyper detailed
Output ONLY the prompt.`;

        const prompt = await sonnet(promptBrief, 200);
        console.log(`   🖊️  Prompt: ${prompt.slice(0, 120)}...`);

        // Step 3: Generate
        const tempUrl = await generateImage(prompt);
        console.log(`   ✅ Image generated`);

        // Step 4: Persist
        const imageUrl = await persistToStorage(tempUrl, userId);

        // Step 5: Post publicly
        const caption = prompt.length > 200 ? prompt.slice(0, 197) + '...' : prompt;
        await sb.from('uploads').insert({
          user_id: userId,
          image_url: imageUrl,
          caption,
          ai_prompt: prompt,
          dream_medium: mediumKey,
          dream_vibe: vibeKey,
          visibility: 'public',
          is_active: true,
          is_posted: true,
          width: 768,
          height: 1664,
        });

        totalGenerated++;
        console.log(`   ✅ Posted! (${totalGenerated} total)`);

        // Small delay between generations to be nice to APIs
        await new Promise((r) => setTimeout(r, 2000));
      } catch (err) {
        console.error(`   ❌ ${username} failed:`, err.message);
      }
    }
  }

  console.log(`\n🎉 Done! Generated ${totalGenerated} dreams across ${botUsernames.length} bots.`);
})();
