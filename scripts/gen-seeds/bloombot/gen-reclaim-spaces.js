#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/reclaim_spaces.json',
  total: 200,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} HOSTILE/DESOLATE setting descriptions for BloomBot's "reclaim" path. Each entry describes a harsh, ugly, or desolate environment where flowers are WINNING — nature reclaiming inhospitable places. NO specific flower species or colors (a separate pool handles flowers).

Each entry: 15-25 words. One specific hostile setting with atmosphere and camera angle.

━━━ THE CONCEPT ━━━
The CONTRAST is the beauty. Ugly, harsh, desolate settings — but flowers are CONQUERING them. Flowers pushing through cracks, erupting from ruins, overtaking decay. The flowers are WINNING against the hostile environment.

━━━ SETTING TYPES (distribute evenly — NO repeats of the same category) ━━━
- Swamp/bayou — murky water, twisted cypress roots, spanish moss, blooms rising from the muck
- Desert cracked earth — bone-dry wasteland, super-bloom erupting from parched ground
- Cave/underground — dark stalactites, wet rock, flowers glowing in pitch darkness
- Volcanic wasteland — black lava fields, ash, flowers pushing through hardened lava cracks
- Abandoned factory — rusted machinery, broken windows, concrete floors, flowers reclaiming
- Burned/charred forest — blackened tree trunks, ash-covered ground, flowers sprouting from destruction
- Frozen tundra — ice, snow, permafrost, flowers breaking through frozen ground
- Shipwreck — rusted hull half-submerged, barnacles, flowers growing through portholes and deck
- Construction rubble — broken concrete slabs, rebar, mud, flowers erupting from debris
- Abandoned subway/tunnel — cracked tiles, rusted rails, puddles, flowers overtaking platform
- Junkyard — crushed cars, scrap metal, oil stains, flowers growing through everything
- Abandoned church/cathedral — crumbling stone, fallen roof open to sky, flowers filling nave
- Dried riverbed — cracked mud, bleached stones, flowers lining the empty channel
- War ruins — bombed-out walls, rubble, broken arches, flowers softening the destruction
- Flooded basement — standing water, peeling walls, flowers growing from waterline up
- Mine shaft — rough-hewn rock, old timber supports, flowers emerging from mineral-rich darkness
- Rusted bridge — corroded iron, missing planks, flowers threading through every gap
- Toxic industrial pond — chemical-stained concrete edges, murky water, flowers defying pollution
- Abandoned greenhouse (broken) — shattered glass, collapsed frame, flowers that outlived the structure
- Snow-buried cabin — half-collapsed roof, deep drifts, flowers pushing through snowpack

━━━ CAMERA ANGLES (vary across entries) ━━━
- Ground-level through debris/rubble toward flowers
- Wide establishing showing scale of desolation vs flowers
- Low-angle looking up at flowers conquering structure
- Through broken window/doorway/hole framing flowers beyond
- Bird's-eye showing pattern of flowers reclaiming from above
- Intimate detail — single crack with flowers erupting

━━━ FLOWER INSTRUCTIONS (critical) ━━━
Do NOT name specific flower species or colors. Use only generic terms: "blooms", "flowers", "floral explosion". A separate pool provides the specific arrangement. But DO emphasize that flowers are WINNING — they dominate despite the hostile setting.

━━━ ATMOSPHERE (include one per entry) ━━━
Post-apocalyptic stillness, eerie quiet, grey overcast, shaft of sunlight through clouds, dawn mist, dust motes in light beam, dripping water echo, wind through ruins, humid decay, frozen silence

━━━ NO PEOPLE ━━━
Absolutely NO people. Empty, abandoned. Only flowers and the hostile environment.

━━━ DEDUP ━━━
Each entry must be a completely DIFFERENT setting type. No two entries from the same category above. 25 entries = 20 categories + 5 creative additions you invent.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
