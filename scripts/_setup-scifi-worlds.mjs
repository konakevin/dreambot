import fs from 'fs';
const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
const env = {};
for (const l of lines) {
  const e = l.indexOf('=');
  if (e > 0) env[l.slice(0, e).trim()] = l.slice(e + 1).trim();
}
const { createClient } = await import('@supabase/supabase-js');
const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', env.SUPABASE_SERVICE_ROLE_KEY);

const DROP = ['alien planet', 'cyberpunk megacity', 'space station', 'mars colony'];
await sb.from('location_cards').update({ is_approved: false, picker_category: null }).in('name', DROP);
console.log('soft-deleted', DROP.length, 'sci-fi standalones');

const { error: e1 } = await sb.from('location_cards').upsert({
  name: 'sci-fi worlds',
  display_name: 'Sci-Fi Worlds',
  picker_category: 'scifi',
  picker_sort_order: 1,
  biome: 'scifi_cosmic',
  is_approved: true,
}, { onConflict: 'name' });
if (e1) { console.error('insert:', e1.message); process.exit(1); }
console.log('inserted sci-fi worlds');

const PILLARS = [
  // Alien planets — exotic atmospheres
  'Alien planet with twin moons over crimson desert',
  'Bioluminescent jungle on a violet alien world',
  'Methane lakes reflecting orange alien sky',
  'Spiraling crystal mountains on barren exoplanet',
  'Plasma storms over alien red-rock canyon',
  'Massive ringed gas giant filling alien horizon',
  'Alien tide pools with iridescent blue creatures',
  'Lava rivers on a volcanic alien world',
  'Frozen alien tundra with green ice formations',
  'Twin-sun sunset over alien dune sea',
  'Alien cathedral mountains spiraling into sky',
  // Cyberpunk megacities
  'Cyberpunk skyline with glowing neon grids and rain',
  'Neon-soaked street level with holographic billboards',
  'Mega-tower city under perpetual storm clouds',
  'Cyberpunk rooftop overlook above neon canyon',
  'Glass-tower megacity reflecting magenta sunset',
  'Floating neon market district above smoggy skyline',
  'Cyberpunk bridge spanning chasm of neon traffic',
  'Tokyo-style neon alley with steaming food stalls',
  'Vertical city ribbon of light against dark mountains',
  'Holographic dragon ad arcing over cyberpunk plaza',
  // Space stations & orbital
  'Massive ring space station orbiting blue gas giant',
  'Space station docking bay with departing starship',
  'Orbital observation deck overlooking Earth-like planet',
  'Generation ship interior with massive cylindrical farms',
  'Solar array arms of an orbital habitat',
  'Space elevator anchor in equatorial ocean',
  'O’Neill cylinder interior with green terraced landscape',
  'Asteroid mining station with hollowed-out rock interior',
  'Stargate ring suspended over star field',
  'Dyson sphere construction in deep space',
  // Mars colony / terraformed worlds
  'Mars colony with glass domes on red dust plains',
  'Olympus Mons towering over Martian colony',
  'Terraformed Mars with green oasis under glass',
  'Martian valley city carved into canyon walls',
  'Mars launch pad with rocket against red sunset',
  'Martian solar farm on ochre desert',
  'Mars hydroponics tower glowing through dust storm',
  // Megastructures & cosmic phenomena
  'Alien megastructure ring around distant star',
  'Galactic core viewed from orbital lookout',
  'Neutron star binary pair in deep space',
  'Black hole accretion disk seen from observation post',
  'Ancient alien obelisk glowing on barren moon',
  'Massive interstellar archway gateway',
  'Crystal pyramid obelisks alien temple plain',
];
console.log('curated', PILLARS.length, 'sci-fi pillars');

const rows = PILLARS.map((t) => ({ location_key: 'sci-fi worlds', spot_text: t, spot_kind: 'vista', quality_tier: 'A', is_active: true }));
const { error: e2, data: inserted } = await sb.from('location_iconic_spots').upsert(rows, { onConflict: 'location_key,spot_text', ignoreDuplicates: true }).select('id');
if (e2) { console.error('pillars:', e2.message); process.exit(1); }
console.log('inserted', inserted.length, 'pillars');

const { data: thumbCandidates } = await sb.from('location_cards').select('name, thumbnail_url').in('name', DROP);
const choice = thumbCandidates.find((r) => r.name === 'cyberpunk megacity' && r.thumbnail_url) || thumbCandidates.find((r) => r.thumbnail_url);
if (choice) {
  await sb.from('location_cards').update({ thumbnail_url: choice.thumbnail_url }).eq('name', 'sci-fi worlds');
  console.log('used thumbnail from', choice.name);
}

const { count } = await sb.from('location_cards').select('*', { count: 'exact', head: true }).eq('is_approved', true);
console.log('user-facing total:', count);
const { data: scifi } = await sb.from('location_cards').select('display_name').eq('picker_category', 'scifi').eq('is_approved', true);
console.log('scifi section now:'); for (const r of scifi) console.log(' •', r.display_name);
