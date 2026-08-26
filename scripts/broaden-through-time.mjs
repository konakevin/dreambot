/**
 * Broaden the narrow Through Time set-pieces into full-era themes (2026-08-25).
 * Per card: rewrite biome_config.SUBJECT_RULE + sub_regions to the 6-facet broad
 * theme (mirrors Viking Age), rename display_name, and REBALANCE — deactivate the
 * narrowest old spots down to `keep` (the old concept becomes ONE facet) so the
 * pool isn't dominated by it once the new broad spots land. Then gen-iconic-spots
 * fills the new facets. Scoped by location_key (safe).
 */
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
dotenv.config({ path: '.env.local' });
const sb = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const CARDS = [
  {
    key: 'pirate cove',
    display: 'Age of Pirates',
    keep: 40, // 200 narrow "cove rocks" → keep 40 as the coves/islands facet
    subject:
      'An unmistakably authentic GOLDEN AGE OF PIRACY scene — the setting varies widely from render to render: tall-masted pirate galleons and sloops under full sail on the open sea; ship-to-ship boarding battles wreathed in cannon smoke; bustling colonial ports and harbor towns crowded with rigging; raucous candlelit dockside taverns and grog halls; hidden treasure islands, jungle-fringed coves and buried-loot beaches; the captain’s quarters and gun decks below deck. Render it with swashbuckling grit and Caribbean gold — weathered timber, canvas sail, black powder, brass and rum — never a modern trace.',
    sub_regions: [
      'tall-masted pirate galleons and sloops under full sail on the open sea',
      'ship-to-ship boarding battles wreathed in cannon smoke',
      'bustling colonial ports and crowded harbor towns',
      'raucous candlelit dockside taverns and grog halls',
      'hidden treasure islands, jungle coves and buried-loot beaches',
      "below-deck captain's quarters and gun decks",
    ],
  },
  {
    key: '1920s speakeasy',
    display: 'Roaring 20s',
    keep: 70, // keep varied exteriors as the "streets/venues" facet
    subject:
      'An unmistakably authentic 1920s ROARING TWENTIES scene — the setting varies widely from render to render: smoky underground speakeasies and hot jazz clubs; glittering Art Deco ballrooms, hotel lobbies and grand theaters; bustling city streets with Model-T cars, neon marquees and elevated trains; rooftop garden parties and penthouse soirées; opulent casino floors and supper clubs; dockside bootlegging and warehouse operations. Prohibition-era America — brass, velvet, cigarette smoke and jazz-age opulence — never a modern trace.',
    sub_regions: [
      'smoky underground speakeasies and hot jazz clubs',
      'glittering Art Deco ballrooms, hotel lobbies and grand theaters',
      'bustling city streets with Model-T cars, neon marquees and elevated trains',
      'rooftop garden parties and penthouse soirées',
      'opulent casino floors and supper clubs',
      'dockside bootlegging and warehouse operations',
    ],
  },
  {
    key: 'medieval village',
    display: 'Medieval Times',
    keep: 90, // already fairly varied (castles/towns/walls) → keep most
    subject:
      'An unmistakably authentic MEDIEVAL scene spanning the whole era — the setting varies widely from render to render: towering stone castles with ramparts, drawbridges and great halls; bustling market squares and craftsman streets; armored knights, jousting tournaments and tourney grounds; timber-framed villages and thatched cottages; candlelit monasteries, cathedrals and scriptoriums; siege camps, battlefields and fortified city gates. High-medieval Europe — stone, banner, chainmail and torchlight — never a modern trace.',
    sub_regions: [
      'towering stone castles with ramparts, drawbridges and great halls',
      'bustling market squares and craftsman streets',
      'armored knights, jousting tournaments and tourney grounds',
      'timber-framed villages and thatched cottages',
      'candlelit monasteries, cathedrals and scriptoriums',
      'siege camps, battlefields and fortified city gates',
    ],
  },
];

(async () => {
  for (const c of CARDS) {
    // 1) broaden biome_config + sub_regions + rename
    const { data: card } = await sb
      .from('location_cards')
      .select('biome_config')
      .eq('name', c.key)
      .single();
    const bc = { ...(card.biome_config || {}), SUBJECT_RULE: c.subject };
    const { error: e1 } = await sb
      .from('location_cards')
      .update({ biome_config: bc, sub_regions: c.sub_regions, display_name: c.display })
      .eq('name', c.key);
    if (e1) {
      console.log(c.key, 'update err', e1.message);
      continue;
    }
    // 2) rebalance: keep `keep` (prefer character_eligible), deactivate the rest
    const all = [];
    let from = 0;
    for (;;) {
      const { data } = await sb
        .from('location_iconic_spots')
        .select('id,character_eligible')
        .eq('location_key', c.key)
        .eq('is_active', true)
        .range(from, from + 999);
      all.push(...data);
      if (data.length < 1000) break;
      from += 1000;
    }
    all.sort((a, b) => (b.character_eligible ? 1 : 0) - (a.character_eligible ? 1 : 0));
    const drop = all.slice(c.keep).map((s) => s.id);
    for (let i = 0; i < drop.length; i += 200) {
      await sb
        .from('location_iconic_spots')
        .update({ is_active: false })
        .in('id', drop.slice(i, i + 200));
    }
    console.log(
      `✅ ${c.display}: broadened (6 facets), kept ${Math.min(c.keep, all.length)} old spots, deactivated ${drop.length}. Ready for gen.`
    );
  }
})();
