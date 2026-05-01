#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/male_outfits.json',
  total: 25,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} OUTFIT entries for DragonBot's male-warrior path. Each entry is a DENSE phrase (20-35 words) describing his FULL ARMOR / WARRIOR DRESS in obsessive material detail — every leather strap, every steel plate, every furred-or-scaled layer.

━━━ ARCHETYPE-MATCHED OUTFITS (enforce variety across ${n}) ━━━
- HEAVY KNIGHT / FULL PLATE (4-5) — full-plate dragon-crested armor, tabard with house-sigil over the breastplate, gauntlets to the elbow, plated greaves over chainmail leggings, fur-lined cloak clasped with a dragon-pommel, war-helm tucked under the arm
- LIGHT / RANGER (4-5) — leather-and-mail studded jerkin over linen shirt, ranger-cloak hooded with deep cowl, leather bracers reinforced with steel-bands, soft leather boots laced to the knee, quiver of arrows at his back, leather riding-trousers
- BERSERKER / WILD (4-5) — bare-chested under bear-pelt mantle, leather-strapped torso showing battle-scars, fur-trimmed war-skirt over heavy boots, dragon-tooth necklace, gauntlets of riveted leather and bone, war-paint fading on his face
- DRAGON-RIDER / SKY (4-5) — fitted leather flight-armor with dragon-scale chest-plate, harness-straps for the saddle visible across his shoulders, fur-lined high-collar cloak, riding-trousers tucked into mid-calf boots, gauntleted gloves with reinforced palms, goggles pushed up on his brow
- NOBLE COMMANDER (3-4) — gold-trimmed dragon-scale armor over crimson velvet under-coat, fur-mantle of bear-pelt over one shoulder, family-crest pauldron, ceremonial sword at his hip, polished riding-boots, gold-thread cloak-clasp at his throat
- BARBARIAN / NORTH (3-4) — fur-and-leather warrior dress baring battle-scarred arms, heavy iron-banded belt with multiple weapon-loops, fur-lined boots laced to the calf, hooded fur-cloak, brass-armband bicep, leather kilt over fur leggings

━━━ RULES ━━━
- Each entry is OBSESSIVELY DETAILED — every layer, every clasp, every material
- Fantasy-warrior-mandatory materials: dragon-scale, runed steel, leather, fur, mail, blood-iron
- The frame SHOWS this — describe what's VISIBLE in waist-up to thigh-up framing
- Practical for combat OR signature for noble-warrior identity
- "Sexy" comes from CAPABILITY-MAGNETISM — battle-scarred = working garment, NOT exposed skin tease
- No modern items (no jeans, no zippers — buckles / laces / leather only)
- SAFETY: no "torn open" / "exposed" — capability-sexy, not exploitation-sexy
- Specific to MALE warriors

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
