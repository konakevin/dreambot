#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
const { BLOWN_UP_OCEAN_ENTRY_MANDATE } = require('../../lib/blownUpSeedMandate');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/big_waves.json',
  total: 200,
  append: false,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} MASSIVE WAVE descriptions for OceanBot's big-wave path. The theme is RAW DESTRUCTIVE POWER OF THE SEA — heavy seas, terrifying scale, cliff-exploding impact moments, walls of water meeting the coast — but BLOWN UP to AI-impossible levels. NOT side-view wave portraits — IMPACT moments where massive water meets COASTLINE / CLIFFS / LIGHTHOUSES / WOODEN BOATS / BEACHES / HARBORS, with stacked extreme phenomena.

Each entry: 28-40 words. ONE specific dramatic IMPACT or FURY moment with 3+ stacked extreme phenomena.

${BLOWN_UP_OCEAN_ENTRY_MANDATE}

━━━ SCENE TYPES — emphasis on IMPACT + STACKED PHENOMENA ━━━
1. **CLIFF EXPLOSION** — 80-foot wave detonating against vertical sea-cliff + spray catching godrays + double-rainbow forming in mist + bioluminescent foam at the base
2. **LIGHTHOUSE STRIKE** — massive wave engulfing historic stone lighthouse + lightning forking inside distant storm wall + sun blasting hole in clouds above + spray-pillar lit from within
3. **HARBOR BREACH** — rogue wave overtopping breakwater + storm cell over distant islands with rainbow + godrays piercing through into harbor
4. **BEACH SURGE** — apocalyptic surge dragging driftwood + impossible 6-color sunset sky overhead + bioluminescent plankton glowing in the foam
5. **COASTAL DEVASTATION** — coastline churning under wave train + twin waterspouts on horizon + aurora overhead reflecting on wet rock
6. **GALLEON-IN-PERIL** — pre-1850 wooden ship dwarfed by towering wall + lightning + multi-moon sky + rainbow over the trough
7. **FISHING VILLAGE FURY** — old harbor village + wave overtopping seawall + sun blazing through hole in storm wall + cathedral-scale spray-pillar
8. **NAZARÉ CANYON GIANT** — 100-foot wall stacking up over deep canyon + sun blasting through translucent face like stained glass + lightning in distance
9. **WAVE-INSIDE-WAVE** — Teahupo'o slab + sets stacked to horizon + bioluminescent reef visible through translucent foreground wall
10. **STORM SURGE OPEN OCEAN** — pyramidal wave formations + storm wall on one side + rainbow on the other + cloud-leviathan drifting overhead
11. **BREAKWATER OBLITERATION** — stone breakwater + sustained wave assault + spray catching multiple sunbeam-shafts simultaneously + saturated impossible color stacking
12. **SUNSET BARREL** — massive curling barrel with sunset BLASTING through translucent water like stained glass + bioluminescent spray + double-rainbow

━━━ ABSOLUTELY BANNED ━━━
- NO surfers / surfboards (focus is power, not sport)
- NO modern boats / motor yachts / cargo ships / tankers / fishing trawlers / jet skis — only pre-1850 wooden sailing vessels
- NO modern cars / highways / parking lots
- NO sea monsters / krakens (kraken-leviathan path)
- NO cute beach moments — ALL renders should feel SCARY and POWERFUL
- NO calm seas (calm-glass-sea path)
- **NO BOATS BEING DESTROYED AGAINST SHORE / CLIFF / ROCKS / WALLS / DOCKS / PIERS / BREAKWATERS** — that's distress/disaster, not awe-of-nature. A wooden vessel riding heavy open seas / dwarfed by an open-ocean wave wall is FINE. A boat smashed against rocks / hurled into a cottage / torn from a dock is BANNED.

━━━ MOOD ━━━
SCARY. AWE-INSPIRING. POWERFUL. BIBLICAL. The Old Testament's Leviathan-in-the-deep energy compounded with AI-impossible-sky drama.

━━━ RULES ━━━
- 28-40 words, ONE concrete IMPACT moment per entry
- 3+ stacked extreme phenomena per entry (impact + sky drama + light source + atmospheric particles + impossible color)
- Mix scene types broadly
- SCALE + POWER + SCARINESS over surf-photography aesthetics
- Specific landmarks (lighthouse, breakwater, cliff, harbor village) over abstract waves
- Vivid, visceral, scary language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
