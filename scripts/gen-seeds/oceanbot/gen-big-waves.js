#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/big_waves.json',
  total: 200,
  append: true,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} MASSIVE WAVE descriptions for OceanBot's big-wave path. The theme is RAW DESTRUCTIVE POWER OF THE SEA — heavy seas, terrifying scale, cliff-exploding impact moments, walls of water meeting the coast. Scary, awe-inspiring, biblical-fury. NOT side-view wave portraits — IMPACT moments where massive water meets COASTLINE / CLIFFS / LIGHTHOUSES / WOODEN BOATS / BEACHES / HARBORS.

Each entry: 18-28 words. ONE specific dramatic IMPACT or FURY moment.

━━━ SCENE TYPES — emphasis on IMPACT ━━━
1. **CLIFF EXPLOSION** — 80-foot wave detonating against vertical sea-cliff, white spray erupting hundreds of feet upward, cliff walls vanishing in the explosion
2. **LIGHTHOUSE STRIKE** — massive wave engulfing historic stone lighthouse halfway up the tower, foam climbing past the lantern room, beam still cutting through spray
3. **HARBOR BREACH** — rogue wave overtopping a stone breakwater into a harbor, smaller wooden boats tossed at impossible angles
4. **BEACH SURGE** — apocalyptic surge of foaming water sweeping a beach, dragging massive driftwood and debris up the strand
5. **COASTAL DEVASTATION** — entire coastline churning under wave train, headlands disappearing in spray-foam, cliffs taking direct hits
6. **GALLEON-IN-PERIL** — pre-1850 wooden sailing ship dwarfed by towering wave wall, hull crashing through the trough, masts tipping under storm-pressure
7. **FISHING VILLAGE FURY** — old harbor village with stone houses, wave overtopping the seawall and slamming into stone walls, spray flying past windows
8. **SUBMERGED LIGHTHOUSE** — historic stone lighthouse half-engulfed in storm surge, only the lantern room visible above churning water
9. **REEF EXPLOSION** — Teahupo'o-style slab breaking over shallow reef, water detonating, blue-green explosion
10. **NAZARÉ CANYON GIANT** — 100-foot wall stacking up over deep canyon, dwarfing distant lighthouse on cliff
11. **STORM SURGE** — heavy storm at sea, massive waves rolling in pyramidal formations, no land visible, raw open-ocean fury
12. **WAVE-OVER-CLIFF SPRAY-PILLAR** — geyser of seawater shooting straight up the cliff face after wave impact
13. **BREAKWATER OBLITERATION** — stone breakwater being overtopped and partially destroyed by sustained wave assault
14. **FOAM-ENGULFED COASTAL CLIFF PATH** — abandoned coastal cliff path with car-sized foam-tongues sweeping across
15. **WOODEN BOAT CAUGHT IN STORM** — pre-1850 wooden vessel being lifted vertically by wave wall in dark grey storm sea

━━━ ABSOLUTELY BANNED ━━━
- NO surfers / surfboards (focus is power, not sport)
- NO modern boats / motor yachts / cargo ships / tankers / fishing trawlers / jet skis — only pre-1850 wooden sailing vessels
- NO modern cars / highways / parking lots
- NO sea monsters / krakens (kraken-leviathan path)
- NO cute beach moments — ALL renders should feel SCARY and POWERFUL
- NO calm seas (calm-glass-sea path)
- **NO BOATS BEING DESTROYED AGAINST SHORE / CLIFF / ROCKS / WALLS / DOCKS / PIERS / BREAKWATERS** — that's distress/disaster, not awe-of-nature. A wooden vessel riding heavy open seas / dwarfed by an open-ocean wave wall is FINE. A boat smashed against rocks / hurled into a cottage / torn from a dock is BANNED.
- The path is primarily an **AWE-OF-NATURE** scene path — POWER and SCALE of the SEA itself. Boats may appear in open-water scenes, but never as victims of coastal impact.

━━━ MOOD ━━━
SCARY. AWE-INSPIRING. POWERFUL. BIBLICAL. The Old Testament's Leviathan-in-the-deep energy. The viewer should feel the danger and the indifference of the sea.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "100-foot wave detonating against vertical basalt sea-cliff, white spray erupting four hundred feet skyward, cliff face vanishing in mist for ten breathless seconds"
- "Massive storm-surge engulfs historic stone lighthouse halfway up the tower, foam climbing past the lantern room, beam still cutting through the spray"
- "Old harbor breakwater overtopped by rogue wave, three small wooden fishing boats tossed at impossible angles in the harbor beyond, stone houses spray-blasted"
- "Apocalyptic surge sweeps a deserted beach, foaming wall of water dragging massive driftwood logs and seaweed up the strand at house-window height"
- "Pre-1850 wooden galleon dwarfed by towering wave wall in dark grey storm sea, hull crashing through the trough, mainmast tipping under hurricane-pressure"

━━━ RULES ━━━
- 18-28 words, ONE concrete IMPACT moment per entry
- Mix scene types broadly — emphasis on CLIFF/LIGHTHOUSE/HARBOR/COAST IMPACT
- SCALE + POWER + SCARINESS over surf-photography aesthetics
- Specific landmarks (lighthouse, breakwater, cliff, harbor village) over abstract waves
- Vivid, visceral, scary language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
