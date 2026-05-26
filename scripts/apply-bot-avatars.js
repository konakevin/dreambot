/**
 * Apply the squared bot avatars (from crop-bot-avatars.js) to the live bot
 * accounts: upload each to the public `avatars` bucket at <botId>/avatar.jpg
 * (upsert) and set users.avatar_url with a ?v= cache-buster.
 */
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');

const SB_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const sb = createClient(SB_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const DIR = '/tmp/bot-avatars-final';

(async () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(DIR, 'manifest.json'), 'utf8'));
  const v = Date.now();
  let ok = 0;
  for (const [username, { botId, file }] of Object.entries(manifest)) {
    try {
      const buf = fs.readFileSync(file);
      const objPath = `${botId}/avatar.jpg`;
      const up = await sb.storage
        .from('avatars')
        .upload(objPath, buf, { contentType: 'image/jpeg', upsert: true });
      if (up.error) throw new Error(`upload: ${up.error.message}`);
      const url = `${SB_URL}/storage/v1/object/public/avatars/${objPath}?v=${v}`;
      const { error: uErr } = await sb.from('users').update({ avatar_url: url }).eq('id', botId);
      if (uErr) throw new Error(`update: ${uErr.message}`);
      console.log(`✅ ${username} -> ${url}`);
      ok++;
    } catch (e) {
      console.log(`❌ ${username}: ${e.message}`);
    }
  }
  console.log(`\nApplied ${ok}/${Object.keys(manifest).length} avatars.`);
})();
