#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/guardians_architecture.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} GUARDIANS-OF-THE-GALAXY-CODED ARCHITECTURE entries for StarBot's guardians-architecture path. Each entry is a DENSE phrase (25-50 words) describing a SPECIFIC ARCHITECTURAL INTERIOR in the GotG aesthetic tradition — severed-Celestial-skull mining colony interiors, gold-aesthetic ornate halls, neon nightclub interiors, ravager-pirate-ship interiors, ego-living-planet biological palaces, kaleidoscopic crystal-chamber interiors.

CRITICAL — NO CHARACTERS, NO PEOPLE, NO ALIENS-AS-FIGURES. Pure architecture only.

CRITICAL — NO PROPER NOUNS. Never write "Knowhere", "Xandar", "Contraxia", "Sovereign", "Yondu", "Star-Lord", "Rocket", "Groot", "Ego", "Nova Corps" — describe the AESTHETIC generically.

━━━ AESTHETIC DNA ━━━

Capture the mood of James-Gunn-cosmic / Jack-Kirby-cosmic / 70s-album-cover-sci-fi / Heavy-Metal-magazine. COSMIC-WEIRD, COLORFUL, EXTRAVAGANT. Each interior is wildly distinct: severed-skull-mining-colony exposed bone-and-metal industrial chambers, gold-aesthetic-perfect classical halls, neon-nightclub seedy-glamour interiors, ravager-pirate-ship rust-and-junk industrial chambers, ego-biological organic-palace chambers, kaleidoscopic crystal interiors.

━━━ ARCHITECTURE CATEGORIES (variety across ${n}) ━━━

SEVERED-SKULL-MINING-COLONY INTERIORS (~4):
- industrial corridor inside a severed alien-being's skull, exposed bone-and-metal walls with rust-streaked I-beams
- mining-colony market plaza inside the skull-cathedral, neon shop-fronts crammed against curving bone walls
- catwalk-bridges spanning the cavernous skull-interior with glimpses of the planet through eye-socket windows
- skull-colony industrial foundry with smelting pits glowing red, dust-haze in shafts of light from above

GOLD-AESTHETIC PERFECT HALLS (~3):
- gold-and-white classical throne chamber with elegant columns, ornate floor inlay, perfect symmetry
- golden palace audience hall with arched windows, polished marble floor, classical statuary
- gold-aesthetic society senate chamber with concentric rings of seating, ornate domed ceiling

NEON NIGHTCLUB INTERIORS (~3):
- pulsing nightclub interior with magenta-and-cyan neon, mirrored ceiling, dance floor empty (no figures)
- nightclub dive-bar interior with neon signs in alien languages, beat-up booths, atmospheric pollution
- pleasure-planet brothel-lounge interior with velvet booths, neon side-lighting, hookah-coded smoke

RAVAGER-PIRATE-SHIP INTERIORS (~3):
- pirate-ship cargo bay with rusty containers, scattered loot, hammocks strung between pipes, atmospheric haze
- ravager-bridge with mismatched control consoles welded together, exposed wiring, ornate-but-junkyard aesthetic
- pirate-ship corridor with rust-streaked walls, exposed pipes, neon graffiti, scrap-decoration

EGO-BIOLOGICAL ORGANIC-PALACE (~3):
- biological palace interior with rib-vault ceiling and pulsing organic walls, soft cyan-violet light
- organic chamber where every surface is grown from translucent muscle-and-bone, soft veins glowing
- bio-palace corridor with curving organic walls, light filtering through translucent tissue ceiling

KALEIDOSCOPIC CRYSTAL CHAMBERS (~3):
- chamber lined entirely with prismatic crystals refracting light into rainbow patterns across the floor
- crystal-cave interior on a strange planet, every facet pulsing with shifting kaleidoscope color
- prismatic geode chamber with massive amethyst spires reaching ceiling, refracted light dancing

VIBRANT BAZAAR / MARKET INTERIORS (~3):
- alien bazaar interior with chaotic stalls, neon signs, hanging strange-goods, atmospheric color clash
- alien marketplace promenade with multilingual neon, exotic-fruit stalls, smoke-haze, no figures
- spaceport bazaar interior with high arched ceiling, scattered hover-stalls, atmospheric layering

OUTLAW FRONTIER SALOONS (~3):
- outlaw frontier saloon interior with dusty-orange ambient light, beat-up tables, swinging entrance doors
- saloon back-room interior with poker tables, neon trim, atmospheric haze, holstered-weapon decor on walls
- frontier-bar interior with crooked establishment signs, mismatched chairs, neon glow

━━━ RULES ━━━
- 25-50 words each — dense, paintable
- NO characters / NO aliens-as-figures
- NO franchise proper nouns
- COSMIC-WEIRD-COLORFUL mood
- Variety across the 8 categories above mandatory
- Strong material specificity (bone-and-metal / gold-and-white classical / neon-and-velvet / rust-and-junk / organic-translucent / prismatic-crystal)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
