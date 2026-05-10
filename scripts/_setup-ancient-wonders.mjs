import fs from 'fs';
const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
const env = {};
for (const l of lines) {
  const e = l.indexOf('=');
  if (e > 0) env[l.slice(0, e).trim()] = l.slice(e + 1).trim();
}
const { createClient } = await import('@supabase/supabase-js');
const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', env.SUPABASE_SERVICE_ROLE_KEY);

const DROP = ['arctic wilderness', 'sahara desert', 'ancient egypt', 'machu picchu', 'angkor wat', 'ancient rome', 'petra', 'taj mahal', 'great wall of china'];
await sb.from('location_cards').update({ is_approved: false, picker_category: null }).in('name', DROP);
console.log('soft-deleted', DROP.length, 'locations');

const { error: e1 } = await sb.from('location_cards').upsert({
  name: 'ancient wonders',
  display_name: 'Ancient Wonders',
  picker_category: 'ancient_wonders',
  picker_sort_order: 1,
  biome: 'ancient_ruins',
  is_approved: true,
}, { onConflict: 'name' });
if (e1) {
  console.error('insert location:', e1.message);
  process.exit(1);
}
console.log('inserted ancient wonders location');

const PILLARS = [
  'Pyramids of Giza with the Sphinx',
  'Sphinx of Giza in desert sand',
  'Karnak Temple massive hypostyle hall columns',
  'Abu Simbel temples carved into cliff',
  'Valley of the Kings desert hillside tombs',
  'Luxor Temple obelisks at sunset',
  'Philae Temple on island in the Nile',
  'Chichen Itza pyramid at El Castillo',
  'Tikal Mayan pyramid above jungle canopy',
  'Palenque ruins emerging from rainforest',
  'Teotihuacan Pyramid of the Sun and Moon',
  'Machu Picchu Inca citadel above Sacred Valley',
  'Sacsayhuamán massive stone walls Cusco',
  'Nazca Lines geoglyphs from above',
  'Easter Island moai statues lined up',
  'Angkor Wat temple at sunrise reflecting pool',
  'Bayon Temple smiling stone faces',
  'Ta Prohm temple roots and trees',
  'Borobudur Buddhist temple terraces',
  'Bagan thousands of temples plain Myanmar',
  'Great Wall of China winding mountain ridges',
  'Terracotta Army warriors pit Xi an',
  'Forbidden City rooftops and gates',
  'Taj Mahal marble mausoleum reflecting pool',
  'Hampi ancient ruins boulder landscape',
  'Petra Treasury façade carved into rose cliff',
  'Petra Monastery atop mountain steps',
  'Persepolis Persian columns and reliefs Iran',
  'Baalbek Roman temple columns Lebanon',
  'Palmyra ruins in Syrian desert',
  'Roman Colosseum amphitheater arches',
  'Roman Forum ruins in Rome',
  'Pantheon Roman dome and columns',
  'Pompeii ruins beneath Mount Vesuvius',
  'Acropolis of Athens with Parthenon',
  'Delphi ancient sanctuary on mountain slope',
  'Ephesus Library of Celsus façade',
  'Mycenae Lion Gate and ancient citadel',
  'Stonehenge megalithic circle on Salisbury Plain',
  'Newgrange neolithic mound passage tomb',
  'Carnac stone alignments in Brittany',
  'Lalibela rock-hewn churches Ethiopia',
  'Great Zimbabwe stone tower ruins',
  'Leptis Magna Roman city Libya coast',
  'Göbekli Tepe ancient pillars Turkey',
];
const rows = PILLARS.map((t) => ({ location_key: 'ancient wonders', spot_text: t, spot_kind: 'vista', quality_tier: 'A', is_active: true }));
const { error: e2, data: inserted } = await sb.from('location_iconic_spots').upsert(rows, { onConflict: 'location_key,spot_text', ignoreDuplicates: true }).select('id');
if (e2) {
  console.error('pillars:', e2.message);
  process.exit(1);
}
console.log('inserted', inserted.length, 'pillars (out of', PILLARS.length, 'curated)');

const { count: userFacing } = await sb.from('location_cards').select('*', { count: 'exact', head: true }).eq('is_approved', true);
console.log('user-facing locations now:', userFacing);
