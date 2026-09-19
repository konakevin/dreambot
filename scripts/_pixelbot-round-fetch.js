#!/usr/bin/env node
/**
 * Fetch one QA round's shadow rows for a PixelBot scene path and download the
 * images for viewing. Prints id | model | vibe | look opener | prompt.
 *   node scripts/_pixelbot-round-fetch.js --path pixel-vista --since 2026-09-19T05:30:00Z [--limit 12] [--out /tmp/pixelbot-rounds/x]
 */
const fs = require('fs'); const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const env = Object.fromEntries(fs.readFileSync('.env.local', 'utf8').split('\n').filter((l) => l.includes('=') && !l.startsWith('#')).map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, '')]; }));
const sb = createClient(env.EXPO_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const argv = process.argv.slice(2); const arg = (n, fb) => { const i = argv.indexOf('--' + n); return i >= 0 ? argv[i + 1] : fb; };
const key = arg('path'); const since = arg('since'); const limit = parseInt(arg('limit', '12'), 10);
const out = arg('out', `/tmp/pixelbot-rounds/${key}-${since.replace(/[:.]/g, '')}`);
const PIXELBOT = '87b57ebe-30b0-44d9-9f74-a1e65a066caf';
(async () => {
  const { data, error } = await sb.from('uploads').select('id, model, dream_vibe, image_url, image_url_display, ai_prompt, created_at').eq('user_id', PIXELBOT).eq('shadow', true).ilike('caption', `[${key}]%`).gte('created_at', since).order('created_at', { ascending: true }).limit(limit);
  if (error) throw error;
  fs.mkdirSync(out, { recursive: true });
  let n = 0;
  for (const r of data) {
    n++;
    const url = r.image_url_display || r.image_url;
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    const file = path.join(out, `${String(n).padStart(2, '0')}.jpg`);
    fs.writeFileSync(file, buf);
    const model = String(r.model || '').split('/')[1] || r.model;
    console.log(`#${n} ${file}\n   id=${r.id} model=${model} vibe=${r.dream_vibe} at=${r.created_at}\n   prompt: ${String(r.ai_prompt || '').slice(0, 420)}\n`);
  }
  fs.writeFileSync(path.join(out, 'rows.json'), JSON.stringify(data, null, 2));
  console.log(`rows: ${data.length} → ${out}`);
})().catch((e) => { console.error(e); process.exit(1); });
