/**
 * Regenerate bot avatars as CLEAN, readable thumbnails: same subject + style
 * as each bot's hearted pick, but reframed as a tight single-subject close-up
 * with a simple background (the busy scene crops were unreadable at avatar
 * size). Square 1:1 via Flux, resized to 512, written over /tmp/bot-avatars-final
 * + manifest so apply-bot-avatars.js can ship them unchanged.
 */
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
const sharp = require('sharp');
const { createClient } = require('@supabase/supabase-js');
const { flux } = require('./lib/botEngine');

const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY);
const OUT = '/tmp/bot-avatars-final';
const MODEL = 'black-forest-labs/flux-1.1-pro';
const KEY = process.env.REPLICATE_API_TOKEN;
const TAIL =
  ', extreme close-up, single subject fills the frame, centered, simple clean uncluttered background, bold, high contrast, crisp and instantly readable, ultra detailed, square';

// Subject + style baked per bot (style mirrors each bot's medium / hearted look).
const SUBJECTS = {
  bloombot: 'a single vivid red hibiscus flower in full bloom, dewy fresh petals, lush botanical, soft magical glow',
  brickbot: 'a LEGO minifigure astronaut, glossy plastic toy, clear smiling yellow minifig face, white space helmet with visor',
  chibibot: 'one adorable chibi winged kitten with huge sparkling eyes, fluffy white fur, glossy 3D designer-vinyl render, storybook cute',
  dinobot: 'a fierce dinosaur head close-up, textured scaly skin, glowing amber eye, sharp teeth, cinematic photoreal prehistoric',
  dragonbot: 'a majestic dragon head and shoulders, intricate scales, glowing eyes, Frank Frazetta painted fantasy art, dramatic',
  earthbot: 'one majestic ancient tree backlit by golden sunrise, glowing mist, lush leaves, epic cinematic nature photography',
  faebot: 'a luminous forest fairy close-up portrait, glowing iridescent butterfly wings, flower crown, soft ethereal painted fantasy',
  gothbot: 'a gothic vampire woman portrait, glowing magenta eyes, black lace veil, pale skin, dark romantic fantasy art',
  mangabot: 'an anime girl close-up portrait, big expressive eyes, soft cherry blossom light, vibrant cel-shaded anime art',
  mechbot: 'a single futuristic mech robot, head and torso, glowing energy core, sleek armored panels, cinematic sci-fi concept art, purple rim light',
  pixelbot: 'a single 16-bit pixel-art hero character face, bold colorful chunky pixels, clean retro SNES sprite, crisp',
  retrobot: 'a glowing retro 1980s CRT computer monitor on a desk, warm neon-lit room, nostalgic film grain, vaporwave',
  starbot: 'a sci-fi astronaut in a glossy reflective helmet, close-up, vibrant retro-futurist sci-fi cover art, cosmic glow',
  steambot: 'a single majestic steampunk airship, ornate brass and copper, billowing sails, golden sunset clouds, painted illustration',
  tinybot: 'a tiny tilt-shift miniature mushroom cottage, adorable handcrafted model, macro photography, shallow focus',
  toybot: 'a single heroic toy action figure, glossy molded plastic, dynamic pose, cinematic toy photography, dramatic light',
  yumbot: 'an adorable kawaii cupcake with a cute smiling face, pastel pink frosting, candy sprinkles, glossy 3D cute',
};

async function genOne(username, botId) {
  const url = await flux({ prompt: SUBJECTS[username] + TAIL, aspectRatio: '1:1', model: MODEL, replicateKey: KEY });
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  const file = path.join(OUT, `${username}.jpg`);
  await sharp(buf).resize(512, 512, { fit: 'cover' }).jpeg({ quality: 90 }).toFile(file);
  return { botId, file };
}

async function pool(entries, size, fn, manifest) {
  let i = 0;
  async function worker() {
    while (i < entries.length) {
      const [username, botId] = entries[i++];
      try {
        manifest[username] = { ...(await fn(username, botId)), source: 'regen' };
        console.log(`✅ ${username}`);
      } catch (e) {
        console.log(`❌ ${username}: ${e.message}`);
      }
    }
  }
  await Promise.all(Array.from({ length: size }, worker));
}

(async () => {
  if (!KEY) throw new Error('REPLICATE_API_TOKEN missing');
  fs.mkdirSync(OUT, { recursive: true });
  const { data: bots } = await sb.from('users').select('id, username').eq('is_bot', true);
  const entries = (bots || [])
    .map((b) => [b.username.toLowerCase(), b.id])
    .filter(([u]) => SUBJECTS[u]);
  console.log(`Regenerating ${entries.length} readable avatars (1:1, ${MODEL})\n`);
  const manifest = {};
  await pool(entries, 5, genOne, manifest);
  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`\n${Object.keys(manifest).length} regenerated -> ${OUT}`);
})();
