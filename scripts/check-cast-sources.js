#!/usr/bin/env node
/**
 * Cast-source health check — HEAD-checks a user's stored cast photo URLs.
 *
 * A dream's face swap fails with "[faceSwap] source unreachable" when a cast
 * thumb_url 404s (e.g. the user re-uploaded their cast photo, deleting the old
 * file, but a queued dream's payload still points at the dead URL). This flags
 * such broken sources from the CURRENT canonical cast (user_recipes.recipe)
 * before they burn a render.
 *
 * Usage:
 *   node scripts/check-cast-sources.js              # default test user
 *   node scripts/check-cast-sources.js <userId>
 *
 * Exit code 0 = all sources reachable; 1 = at least one broken.
 */
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const env = fs.readFileSync('.env.local', 'utf8');
const get = (k) => (env.match(new RegExp('^' + k + '=(.*)$', 'm')) || [])[1];
const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', get('SUPABASE_SERVICE_ROLE_KEY'));

const userId = process.argv[2] || 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';

async function head(url) {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) return { ok: false, info: 'invalid url' };
  try {
    const r = await fetch(url, { method: 'HEAD' });
    return { ok: r.ok, info: `HTTP ${r.status} ${r.headers.get('content-type') || ''}`.trim() };
  } catch (e) {
    return { ok: false, info: 'fetch error: ' + e.message };
  }
}

(async () => {
  const { data: ur } = await sb
    .from('user_recipes')
    .select('recipe')
    .eq('user_id', userId)
    .maybeSingle();
  const cast = (ur && ur.recipe && (ur.recipe.dream_cast || [])) || [];
  if (!cast.length) {
    console.log(`no dream_cast for ${userId.slice(0, 8)} (user_recipes.recipe)`);
    process.exit(0);
  }
  console.log(`cast sources for ${userId.slice(0, 8)}:`);
  let broken = 0;
  for (const c of cast) {
    const res = await head(c.thumb_url);
    if (!res.ok) broken++;
    console.log(`  ${res.ok ? '✅' : '❌'} ${c.role}: ${res.info}  ...${c.thumb_url ? c.thumb_url.slice(-48) : '(none)'}`);
  }
  console.log(broken ? `\n❌ ${broken} broken source(s)` : '\n✅ all cast sources reachable');
  process.exit(broken ? 1 : 0);
})();
