/**
 * Build square bot avatars from the most-recently-hearted (by Kevin) post on
 * each bot. Smart-crops each 9:16 render to 512x512 (sharp 'attention' keeps
 * the subject), writes to /tmp/bot-avatars-final/ + a manifest for the apply
 * step. Generation only — does NOT touch the live avatar_url.
 */
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
const sharp = require('sharp');
const { createClient } = require('@supabase/supabase-js');

const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY);
const KEVIN = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const OUT = '/tmp/bot-avatars-final';
const HIDDEN = ['glowbot', 'humanbot'];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const since = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  const { data: likes } = await sb
    .from('likes').select('created_at, upload_id').eq('user_id', KEVIN)
    .gte('created_at', since).order('created_at', { ascending: false });
  const ids = [...new Set((likes || []).map((l) => l.upload_id))];
  const { data: ups } = await sb.from('uploads').select('id, user_id, image_url').in('id', ids);
  const upById = new Map((ups || []).map((u) => [u.id, u]));
  const { data: bots } = await sb.from('users').select('id, username').eq('is_bot', true);
  const botById = new Map((bots || []).map((b) => [b.id, b.username]));

  const perBot = new Map(); // username -> { botId, imageUrl }
  for (const l of likes || []) {
    const u = upById.get(l.upload_id);
    if (!u) continue;
    const username = botById.get(u.user_id);
    if (!username || HIDDEN.includes(username.toLowerCase())) continue;
    if (!perBot.has(username)) perBot.set(username, { botId: u.user_id, imageUrl: u.image_url });
  }

  const manifest = {};
  for (const [username, { botId, imageUrl }] of perBot) {
    try {
      const res = await fetch(imageUrl);
      const buf = Buffer.from(await res.arrayBuffer());
      const out = path.join(OUT, `${username}.jpg`);
      await sharp(buf)
        .resize(512, 512, { fit: 'cover', position: 'attention' })
        .jpeg({ quality: 90 })
        .toFile(out);
      manifest[username] = { botId, sourceUrl: imageUrl, file: out };
      console.log(`✅ ${username} -> ${out}`);
    } catch (e) {
      console.log(`❌ ${username}: ${e.message}`);
    }
  }
  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`\n${Object.keys(manifest).length} avatars cropped. manifest -> ${OUT}/manifest.json`);
})();
