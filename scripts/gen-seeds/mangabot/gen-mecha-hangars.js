#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/mecha_hangar_scenes.json',
  total: 25,
  batch: 25,
  append: false,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} MECHA HANGAR / LAUNCH BAY scene descriptions for MangaBot's mecha-hangars path. Each entry is 30-50 words. Setting-only — describe the PLACE + atmosphere + scale, not the pilots.

CONTEXT: Gundam / Evangelion / Macross / Patlabor / Code-Geass aesthetic. Massive industrial-mechanical hangars where giant robots live. Dramatic scale. Maintenance scaffolding. Warning lights. Engineers as tiny figures (optional). The MECH dwarfs everything.

Categories — rotate widely:
- Underground deep-bunker hangar (cathedral-scale concrete vault, mech standing in launch slot)
- Surface mech-bay (sliding ceiling open to sky, mech mid-elevator-rise)
- Carrier-deck launch (catapult-rail extending toward open sky, mech crouched at launch position)
- Repair-bay (mech mid-repair, partially disassembled, scaffolding wrapping torso)
- Warehouse-style hangar (mech parked in row with other distant mechs, fluorescent overhead lighting)
- Sea-base launch dock (mech exiting a flooded launch chamber, water cascading off)
- Rooftop mech-pad (single mech kneeling on a rooftop pad with city skyline below)
- Mountain-cave hangar (mech crouched in carved-rock interior, natural and industrial mixed)

EVERY entry must include:
- Specific hangar type
- Mech presence + scale anchor (towering / dwarfing scaffolding / mid-elevator-rising / kneeling at launch position / etc.)
- 4-6 environmental details (scaffolding, catwalks, warning lights, fuel-line cables, klaxon-orange strobes, hanging chains, console banks, exhaust ducts, banner-flags, technical signage, painted hangar-floor markings)
- 1-2 atmospheric effects (steam, sparks, exhaust haze, dust motes in shafts of light, cooling vapor)
- Lighting tone (industrial fluorescent / klaxon-red / spot-arc-white / sunset through open ceiling / blue-cold-bunker)

ABSOLUTELY BANNED:
- NO photoreal industrial-photography descriptions (this is anime cel-shaded)
- NO mech-in-combat (this is HANGAR / pre-launch / repair, not battle)
- NO named-IP mechs (no "Eva Unit-01", no "RX-78", no "Strike Freedom")
- NO sexualized engineer attire

Examples (write fresh):
- "Vast underground concrete launch-bay with cathedral-scale arched ceiling, a single 60-foot humanoid mech standing in vertical launch slot, scaffolding wrapped around its torso, catwalk-engineers as tiny figures, klaxon-amber warning lights pulsing, exhaust-vapor curling from cooling vents, painted hangar-floor lane-markings"
- "Surface mech-bay with sliding ceiling halfway open to dawn sky, mech mid-elevator-rise from below floor, hydraulic-rams hissing steam, blue-LED light strips lining the walls, hanging fuel-cables retracting, technical kanji signage on the bulkheads, dust-motes in shaft of morning light"
- "Carrier-deck launch position at dusk, mech crouched at the start of an extending catapult-rail, ocean horizon beyond the deck-edge, deck-crew silhouettes signaling, warning-strobes flashing red, exhaust haze drifting, painted launch-zone markings, klaxon-yellow lighting, salt-mist atmosphere"

Output ONLY a valid JSON array of ${n} strings (30-50 words each). No preamble, no commentary.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
