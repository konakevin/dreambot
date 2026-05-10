import fs from 'fs';
const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
const env = {};
for (const l of lines) {
  const e = l.indexOf('=');
  if (e > 0) env[l.slice(0, e).trim()] = l.slice(e + 1).trim();
}
const { createClient } = await import('@supabase/supabase-js');
const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', env.SUPABASE_SERVICE_ROLE_KEY);

// 1. Soft-delete the 4 standalones
const DROP = ['ancient elven city', 'dwarven fortress', 'dragons keep', 'crystal caverns'];
await sb.from('location_cards').update({ is_approved: false, picker_category: null }).in('name', DROP);
console.log('soft-deleted', DROP.length, 'high fantasy standalones');

// 2. Add 'high fantasy' picker entry
const { error: e1 } = await sb.from('location_cards').upsert({
  name: 'high fantasy',
  display_name: 'High Fantasy',
  picker_category: 'fantasy',
  picker_sort_order: 4, // after enchanted forest / floating sky islands / underwater atlantis
  biome: 'fantasy_imagined',
  is_approved: true,
}, { onConflict: 'name' });
if (e1) { console.error('insert location:', e1.message); process.exit(1); }
console.log('inserted high fantasy location');

// 3. Hand-curated pillars across all 4 themes (elven / dwarven / dragon / crystal) + general high fantasy
const PILLARS = [
  // Elven cities & forests (Rivendell / Lothlórien / Caras Galadhon archetypes)
  'Elven city built into ancient mossy oak trees',
  'Crystal-clear elven waterfall with carved stone bridges',
  'Rivendell-style cliffside elven sanctuary autumn leaves',
  'Lothlorien-style golden mallorn tree-cities at twilight',
  'Elven palace of woven branches and silver light',
  'Elven harbor with white swan-prow ships',
  'Caras Galadhon platforms among colossal silver trees',
  'Mirkwood enchanted forest path with phosphorescent vines',
  'Elven amphitheater carved into cliff wall with reflection pool',
  'Tree-built elven library spiraling around ancient oak',
  // Dwarven fortresses (Erebor / Moria / Khazad-dûm)
  'Dwarven fortress carved into the side of a mountain',
  'Erebor-style mountain stronghold gates with golden runes',
  'Khazad-dûm Bridge over the abyss with fading lantern light',
  'Dwarven hall with massive stone pillars and forge fires',
  'Iron Hills dwarven mining citadel under stormy sky',
  'Dwarven undercity with rivers of molten gold',
  'Mountain pass leading to colossal dwarven gate',
  'Dwarven mining tunnels lit by glowing crystal lanterns',
  // Dragon keeps & lairs
  'Dragon keep castle with smoldering volcanic backdrop',
  'Smaug-style dragon lair piled with hoarded gold',
  'Dragon-watched mountain peak at sunset',
  'Burning castle silhouetted against dragon flight',
  'Cliff-side dragon roost with skeletons of past meals',
  'Dragon perched atop ruined fortress wall',
  'Volcanic island dragon sanctuary with lava flows',
  'Ancient dragon-bone gate to a dark fortress',
  // Crystal caverns
  'Crystal cavern of giant glowing amethyst columns',
  'Underground crystal lake reflecting glowing geodes',
  'Crystal cathedral cave with bioluminescent moss',
  'Subterranean diamond crystal forest',
  'Massive geode interior with hexagonal crystal floors',
  'Quartz-spike chamber with light beams piercing through',
  'Sapphire-blue ice cave deep underground',
  'Crystal dragon spire rising from cavern floor',
  // General high fantasy
  'White stone fortress on jagged mountain peak',
  'Bridge over a misty abyss to a floating sanctuary',
  'High elven citadel rising above sea of clouds',
  'Castle of black obsidian on dark volcanic island',
  'Wind-blasted tower keep alone on a cliff edge',
  'Ancient watchtower at the end of the world',
  'Mossy ruined keep with ravens circling above',
  'Stone dragon statues guarding mountain pass',
  'High fantasy ridgeline with castles on multiple peaks',
  'Snow-covered mountain pass with fortress watchtowers',
  'Silver-spired city on the edge of an ancient forest',
];
console.log('curated', PILLARS.length, 'high fantasy pillars');

const rows = PILLARS.map((t) => ({ location_key: 'high fantasy', spot_text: t, spot_kind: 'vista', quality_tier: 'A', is_active: true }));
const { error: e2, data: inserted } = await sb.from('location_iconic_spots').upsert(rows, { onConflict: 'location_key,spot_text', ignoreDuplicates: true }).select('id');
if (e2) { console.error('pillars:', e2.message); process.exit(1); }
console.log('inserted', inserted.length, 'pillars');

// 4. Reuse a thumbnail from one of the dropped fantasy locations
const { data: thumbCandidates } = await sb.from('location_cards').select('name, thumbnail_url').in('name', DROP);
const choice = thumbCandidates.find((r) => r.name === 'ancient elven city' && r.thumbnail_url) || thumbCandidates.find((r) => r.thumbnail_url);
if (choice) {
  await sb.from('location_cards').update({ thumbnail_url: choice.thumbnail_url }).eq('name', 'high fantasy');
  console.log('used thumbnail from', choice.name);
}

const { count: userFacing } = await sb.from('location_cards').select('*', { count: 'exact', head: true }).eq('is_approved', true);
console.log('user-facing locations now:', userFacing);

const { data: fantasy } = await sb.from('location_cards').select('display_name, picker_sort_order').eq('picker_category', 'fantasy').eq('is_approved', true).order('picker_sort_order');
console.log('fantasy section now:'); for (const r of fantasy) console.log(' •', r.display_name);
