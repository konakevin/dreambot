/**
 * Wild West consolidation 8→5 (2026-08-26): fold Saloon Interior + Steam Train
 * Depot + Border Cantina into a broadened Frontier Town, then hide the 3 retired
 * cards (picker_category=null). Frontier Town's WARDROBE is already on-register.
 */
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
dotenv.config({ path: '.env.local' });
const sb = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const KEEP = 'frontier town';
const FOLD = ['saloon interior', 'steam train depot', 'border cantina'];
const PER = 45; // cast spots folded from each retired card

const SUBJECT =
  'An unmistakably authentic OLD WEST FRONTIER TOWN spanning the whole settlement — the setting varies widely from render to render: dusty main streets lined with timber false-front facades, hitching rails and boardwalks; swinging-door saloons, gambling halls and dance halls; the railroad depot, water tower and steam locomotive; adobe border cantinas and mission walls; the jailhouse, sheriff’s office and gallows; general stores, liveries, smithies and telegraph offices. Sun-baked, gritty and lawless — timber, dust, iron and gunsmoke — never a modern trace.';
const SUB_REGIONS = [
  'dusty main streets with timber false-front facades, hitching rails and boardwalks',
  'swinging-door saloons, gambling halls and dance halls',
  'the railroad depot, water tower and steam locomotive',
  'adobe border cantinas and mission walls',
  "the jailhouse, sheriff's office and gallows",
  'general stores, liveries, smithies and telegraph offices',
];

// broaden Frontier Town
const { data: card } = await sb
  .from('location_cards')
  .select('biome_config')
  .eq('name', KEEP)
  .single();
await sb
  .from('location_cards')
  .update({ biome_config: { ...(card.biome_config || {}), SUBJECT_RULE: SUBJECT }, sub_regions: SUB_REGIONS })
  .eq('name', KEEP);
console.log(`Frontier Town: broadened (6 facets).`);

// fold cast spots from each retired card
for (const key of FOLD) {
  const { data } = await sb
    .from('location_iconic_spots')
    .select('id')
    .eq('location_key', key)
    .eq('is_active', true)
    .eq('character_eligible', true)
    .order('id', { ascending: false })
    .limit(PER);
  const ids = data.map((r) => r.id);
  if (ids.length) await sb.from('location_iconic_spots').update({ location_key: KEEP }).in('id', ids);
  // hide the retired card
  await sb.from('location_cards').update({ picker_category: null }).eq('name', key);
  console.log(`  ${key}: folded ${ids.length} cast spots → Frontier Town, card hidden.`);
}

// final count
let tot = 0,
  from = 0;
for (;;) {
  const { data } = await sb
    .from('location_iconic_spots')
    .select('id')
    .eq('location_key', KEEP)
    .eq('is_active', true)
    .range(from, from + 999);
  tot += data.length;
  if (data.length < 1000) break;
  from += 1000;
}
console.log(`Frontier Town now ${tot} active spots. Wild West: 8 → 5 cards.`);
