/**
 * Dream Off pre-flip readiness check (read-only).
 *
 * Run BEFORE flipping engine_config.dream_off_enabled=true to confirm the deck +
 * config are actually in place. Does NOT create anything.
 *
 *   export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && node scripts/check-dream-off-ready.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const s = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ok = (b) => (b ? '✅' : '❌');

(async () => {
  let pass = true;

  // 1. Kill-switch
  const { data: cfg } = await s.from('engine_config').select('dream_off_enabled').eq('id', 1).single();
  const enabled = !!cfg?.dream_off_enabled;
  console.log(`${ok(true)} kill-switch: dream_off_enabled = ${enabled}  (flip this LAST)`);

  // 2. Pack catalog
  const { data: packs } = await s.from('dream_off_packs').select('key,is_active,season_start,season_end');
  const today = new Date().toISOString().slice(0, 10);
  const inSeason = (packs || []).filter(
    (p) =>
      p.is_active &&
      (!p.season_start || p.season_start <= today) &&
      (!p.season_end || p.season_end >= today)
  );
  console.log(`${ok((packs || []).length >= 40)} pack catalog: ${(packs || []).length} packs, ${inSeason.length} in-season today`);
  pass = pass && (packs || []).length >= 40;

  // 3. Topics per category
  const cats = {};
  for (const c of ['scene', 'cast']) {
    const { count } = await s
      .from('dream_off_topics')
      .select('*', { count: 'exact', head: true })
      .eq('category', c)
      .eq('is_active', true);
    cats[c] = count || 0;
  }
  console.log(`${ok(cats.scene > 500 && cats.cast > 500)} topics: ${cats.scene} scene, ${cats.cast} cast`);
  pass = pass && cats.scene > 500 && cats.cast > 500;

  // 4. Tiers
  const { data: tiers } = await s.from('dream_off_tiers').select('key,is_active').eq('is_active', true);
  const hasStandard = (tiers || []).some((t) => t.key === 'standard');
  console.log(`${ok(hasStandard)} tiers: ${(tiers || []).map((t) => t.key).join(', ') || 'none'}`);
  pass = pass && hasStandard;

  // 5. Reads callable (get_dream_off_packs)
  const { error: rpcErr } = await s.rpc('get_dream_off_packs', { p_category: 'scene' });
  console.log(`${ok(!rpcErr)} get_dream_off_packs RPC: ${rpcErr ? rpcErr.message : 'callable'}`);
  pass = pass && !rpcErr;

  console.log(
    `\n${pass ? '✅ Deck + config READY.' : '❌ Not ready — fix the ❌ rows above.'} ` +
      `${enabled ? 'Flag is ON.' : 'Flip dream_off_enabled=true when the App Store build is live.'}`
  );
  process.exit(pass ? 0 : 1);
})();
