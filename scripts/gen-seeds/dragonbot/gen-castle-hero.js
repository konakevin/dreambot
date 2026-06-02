#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/castle_hero.json',
  total: 200,
  append: true,
  batch: 12,
  metaPrompt: (
    n
  ) => `You are writing ${n} BIG-EPIC WESTERN-HIGH-FANTASY CASTLE entries for DragonBot's castle path. Each entry is a DENSE phrase (35-65 words) describing a SPECIFIC MASSIVE SPRAWLING WESTERN-HIGH-FANTASY CASTLE complex as the ABSOLUTE FOCAL SUBJECT.

⚠️ HARD MANDATE — BIG EPIC ONLY:
Every castle MUST be MASSIVE, SPRAWLING, MULTI-TIER — hundreds-of-meters tall, dozens of distinct spires/towers/battlements, sprawling complex with multiple sections. NEVER a small 2-3 story square keep. NEVER a single isolated tower. NEVER a modest manor-castle. References: Minas-Tirith city-mountain / Erebor whole-mountain-fortress / Hogwarts sprawling-multi-wing complex / Anor-Londo vast-cathedral-city / Stormveil-Castle multi-tier mountain complex / Cair-Paravel sprawling-coast-citadel / Howl's-Moving-Castle multi-element-architecture / Karazhan Karazhan multi-spire tower-complex.

⚠️ STRICT WESTERN HIGH FANTASY ONLY:
✓ LOTR / GoT / Skyrim / Warcraft / Witcher / Elden-Ring / D&D Forgotten Realms / Castlevania / Bloodborne / Dark Souls / Disney-medieval fairytale castle lineage.
🚫 NO Asian pagodas / Japanese tenshu / Forbidden-City style
🚫 NO Mediterranean golden-onion-domes / coral-pink palaces
🚫 NO Middle-Eastern minarets / Persian iwan / Mughal palaces
🚫 NO Aztec / Mayan stepped pyramids
🚫 NO real-world historical-period codes

━━━ PLACEMENT CATEGORIES (distribute ${n} across — VARIETY is critical):

STANDALONE EPIC ON HILLTOP/PLAIN/PROMONTORY (~4):
- vast sprawling Hogwarts-style multi-wing castle complex on a high green hilltop, dozens of distinct turrets and gables, hundreds of windows glowing gold, multi-tier from foundation to highest spire
- massive Cinderella-style fairytale castle dominating a high plateau, hundreds of meters of vertical complex, twin-tower gatehouse + central cathedral-keep + multiple curtain-wall layers
- vast Stormwind-style fortified city-castle complex on a coastal promontory, multi-tier walls + cathedral + dozens of towers + sprawling outer city
- colossal Minas-Tirith-style seven-tier white-stone city-mountain rising from a vast plain, each tier visible cascading up to a crown-keep

BUILT-INTO-MOUNTAIN-WALL (~4):
- vast multi-tier castle CARVED directly into a sheer mountain face, six concentric levels of battlements ascending hundreds of meters, towers jutting from solid rock, crown-keep at the summit
- impossibly tall white-marble cathedral-citadel built tier-upon-tier into a vertical mountain wall, hundreds of arched windows + flying buttresses, banners hanging hundreds of meters
- colossal Erebor-style mountain-fortress with the entire mountain hollowed and carved, vast gates at the base + tier-upon-tier ascending the slope + crown-keep at the summit
- massive Skyrim-style stone-keep complex hewn into a thunderous mountain pass, multiple gatehouses + curtain walls + spiraling tower-complex disappearing into mist

CLIFF-TOP / OCEAN-CLIFF (~3):
- vast sprawling Cair-Paravel-style cliff-top castle complex on a sheer ocean cliff, multi-tier vertical complex with dozens of spires + cathedral + colonnades + outer-city, crashing surf hundreds of meters below
- colossal Storm's-End-style coastal fortress on a windswept sea-cliff, vast circular curtain-wall + central tower + flying-buttress-courtyards, gulls wheeling, hundred-meter drop
- massive Eyrie-style sky-castle perched on the very edge of a sheer cliff overlooking a vast valley, multiple cascading tiers + tower-complex + sky-bridge to a smaller sister-spire

VALLEY-BASIN / RIVER-LAKE (~3):
- vast multi-tier elven Rivendell-style castle complex nestled in a verdant valley between cascading waterfalls, multiple architectural masses connected by bridges, hundreds of meters wide
- colossal sprawling Erebor-style fortress complex at the foot of a mountain valley, vast gates + multi-tier walls + tower-keep + outer-city, river winding to the gates
- massive Karazhan-style multi-spire wizard-tower complex in a misty valley, central cathedral-keep + dozens of outer spires + cascading multi-tier connection-bridges

BRIDGES-TO-OTHER-MASSES / TWIN-CASTLE (~4):
- vast multi-tier castle complex connected by colossal arched stone bridges to two sister-spire-castles across a deep chasm, each connected to the central keep by hundred-meter spans, dramatic multi-element architecture
- colossal split-island castle on twin sea-stacks connected by a vast double-arched bridge over churning surf, each side a multi-tier vertical complex, cathedral-on-the-left + barbican-on-the-right
- massive floating-archipelago castle of three suspended land-masses linked by glowing magical bridges, each mass a multi-tier fortress complex, Lothlorien-style elven architecture
- vast cathedral-castle on a high cliff with a colossal arched bridge spanning a chasm to a smaller satellite-spire complex on the opposing crag

GOTHIC / DARK / RUINED COLOSSAL (~4):
- vast obsidian Castlevania-style gothic cathedral-fortress rising from a mist-shrouded valley, hundreds of pointed spires piercing fog, multi-tier vertical complex, gargoyle-lined walls
- colossal ruined Boletaria-style fortress half-collapsed into a flooded valley, vast curtain-walls + cathedral-keep + dozens of crumbling watchtowers, ivy-choked battlements
- vast Bloodborne-Yharnam-style black-spire cathedral-city crowning a thunder-struck peak, multi-tier vertical complex + dozens of pointed spires + gilded gargoyle-lined walls
- massive Dark-Souls-Lothric-style golden cathedral-castle on a high crag, multi-tier vertical complex + flying buttresses + hundreds of stained-glass windows + crown-keep

MAGICAL ELVEN / ARCANE COLOSSAL (~3):
- vast floating Rivendell-style elven crystalline castle complex suspended above a valley, multiple anti-gravity stone masses linked by glowing arcane-bridges, hundreds of crystal towers
- colossal Karazhan-style magical academy castle on a high promontory above a lake, vast central tower + dozens of outer spires + cathedral-library + multi-tier observatory complex
- massive Elden-Ring-Stormveil-style multi-tier mountain castle complex, sprawling stone-and-silver architecture cascading down the slope, dozens of distinct towers + central cathedral-keep

EACH entry MUST be:
- 35-65 words
- A SPECIFIC BIG-EPIC western-high-fantasy castle (massive, sprawling, multi-tier, dozens of spires/towers, hundreds-of-meters tall)
- A SPECIFIC placement (standalone-hilltop / mountain-built / cliff-top / valley / bridges-to-other-masses / twin-castle / gothic-colossal / magical-arcane-colossal)
- PURE castle focus (NO characters, NO armies)
- Multiple architectural masses or multi-tier vertical complex
- WESTERN HIGH-FANTASY canon only

Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
});
