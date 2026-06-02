#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/eldenring_architecture.json',
  total: 25,
  batch: 12,
  metaPrompt: (
    n
  ) => `You are writing ${n} ELDEN-RING / DARK-SOULS-CODED ARCHITECTURE entries for DragonBot's eldenring-architecture path. Each entry is a DENSE phrase (25-50 words) describing a SPECIFIC ARCHITECTURAL INTERIOR in the Hidetaka-Miyazaki / FromSoftware aesthetic tradition — ancient gold-cathedral throne chambers, decaying castle interiors, ruined-king's-hall under crumbling vaulted ceilings, dragon-graveyard chambers, void-plateau architecture, blood-tainted nightmare temples, ancient libraries swallowed by ruin, frozen-throne mountain halls.

CRITICAL — NO CHARACTERS, NO PEOPLE, NO TARNISHED, NO HEROES. Pure architecture only.

CRITICAL — NO PROPER NOUNS. Never write "Elden Ring", "Dark Souls", "Tarnished", "Elden Lord", "Erdtree", "Limgrave", "Caelid", "Leyndell", "Stormveil", "Anor Londo", "Lordran", "Lothric", "Drangleic", "Yharnam", "Cathedral of the Deep", "Painted World", "Miyazaki", "FromSoftware", "Bloodborne" — describe the AESTHETIC generically.

━━━ AESTHETIC DNA ━━━

Capture the mood of Hidetaka-Miyazaki / FromSoftware concept-art tradition. EVERY interior feels DECAYING, BEAUTIFUL-and-DOOMED, GOTHIC, MELANCHOLIC. Vast vaulted ceilings, broken stained-glass windows, dust-haze in shafts of golden light, ancient gold-leaf decoration peeling away, fallen statuary, scattered relics. Color palettes are PAINTED-GOLD + DIM-GREY-AND-DECAY. Mood is gothic-fantasy-dread-and-awe.

━━━ ARCHITECTURE CATEGORIES (variety across ${n}) ━━━

ANCIENT GOLD-CATHEDRAL THRONE CHAMBERS (~4):
- vast gold-cathedral throne hall with broken stained-glass windows, dust-haze in shafts of golden light, single empty throne on dais
- ancient cathedral interior with vaulted ceiling impossibly high, broken pillars, gold-leaf peeling off the walls, melancholic mood
- ruined gold-throne chamber with collapsed ceiling, sky visible through the breach, single shaft of light on the empty throne
- cathedral-fortress interior with broken statuary, golden-decay walls, atmospheric dust haze, dread-laden ambient

DECAYING CASTLE INTERIORS (~4):
- decaying castle great hall with broken-pillar architecture, hanging chandelier missing crystals, dust-haze in shafts of light
- ruined feast hall with overturned tables, fallen banners, vaulted ceiling with cracks letting in light, melancholic mood
- castle corridor with broken stained-glass at one end, fallen suits-of-armor against the walls, atmospheric haze
- abandoned throne room with cracked stone floor, fallen pillars, single shaft of dawn-light on the empty throne

RUINED-KING'S-HALL CRUMBLING VAULTS (~3):
- vast crumbling vaulted hall with massive broken statuary, ancient banners hanging in tatters, dust-haze, dread mood
- decaying chamber with kilometer-high vaulted ceiling, broken-stained-glass casting fragmented light, fallen pillars
- ruined king's audience-chamber with collapsed roof, sky visible above, golden-decay aesthetic, atmospheric melancholy

DRAGON-GRAVEYARD CHAMBERS (~2):
- chamber where massive dragon-skeleton fills the vaulted space, ancient bones jutting through broken stone, dust-haze
- subterranean cathedral with colossal dragon-skull half-buried in the floor, gothic-arched walls, ancient ambient

VOID-PLATEAU IMPOSSIBLE ARCHITECTURE (~3):
- void-realm chamber with floating broken architecture, impossible orientations, sickly cosmic-glow ambient
- nightmare-temple interior with reality folding strangely, walls leading into void, broken statues drifting
- ancient sealed chamber where space distorts, multiple ceiling-orientations visible, dimensional dread

BLOOD-TAINTED NIGHTMARE TEMPLES (~3):
- blood-tainted temple chamber with crimson-pooling on the floor, decay-statues, sickly red ambient
- nightmare-shrine interior with blood-coral growing on the walls, broken-altar, oppressive crimson-mood
- ruined cult-temple with scattered ritual-objects, blood-stained walls, dim red ambient, dread atmosphere

ANCIENT-LIBRARY SWALLOWED-BY-RUIN (~3):
- ancient vast library with scrolls and books decaying on broken shelves, vaulted ceiling cracked, dust-haze, melancholic
- ruined library hall with collapsed bookcases, ancient parchment scattered across the floor, single window-light shaft
- abandoned scholar's-tower interior with mummified texts, broken telescope, dust-haze, dim atmospheric ambient

FROZEN-THRONE MOUNTAIN HALLS (~3):
- frozen mountain hall carved from solid ice, ancient throne at the far end, atmospheric ice-mist, blue-cold ambient
- ice-cathedral interior with frozen-stained-glass windows, ancient runed-stone pillars, atmospheric snow drifting
- frozen-throne chamber with single shaft of cold blue light on an empty stone throne, ancient runic walls

━━━ RULES ━━━
- 25-50 words each — dense, paintable
- NO characters / NO Tarnished / NO heroes-as-figures
- NO franchise proper nouns
- HIDETAKA-MIYAZAKI / FROMSOFTWARE painted concept-art mood — DECAYING, BEAUTIFUL-and-DOOMED, GOTHIC
- Variety across the 8 categories above mandatory
- Color palette: painted-gold-decay + dim-grey + crimson-blood + atmospheric overcast
- Cinematic gothic-fantasy scale, broken-statuary EVERYWHERE

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
