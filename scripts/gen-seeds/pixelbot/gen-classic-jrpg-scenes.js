#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/classic_jrpg_scenes.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (n) => `Write ${n} 16-BIT CLASSIC JRPG GAMEPLAY SCREENSHOT scene descriptions for PixelBot's classic-jrpg path.

Reference inspiration (USE AS FEEL-ANCHORS ONLY — NEVER name literally in scene output): Zelda: A Link to the Past + Link's Awakening + Final Fantasy IV / V / VI + Chrono Trigger + Secret of Mana + Seiken Densetsu 3 + Terranigma + Earthbound / Mother 2 + Illusion of Gaia + Soul Blazer + Lufia II + Dragon Quest VI + Breath of Fire I/II + Suikoden + Lunar: Silver Star Story + Y's series + Tales of Phantasia + Live A Live.

━━━ THE NORTH STAR ━━━

Each entry should look like A SCREENSHOT FROM A SNES-ERA TOP-DOWN JRPG LEVEL — overworld exploration, town hub, dungeon-crawl, castle, sacred-grove, party walking the tile-map. 3-quarter top-down camera, tile-based world, hero party-sprite mid-stride. PURE classic 1990s JRPG energy.

Each entry: 30-50 words, ONE paragraph. EVERY entry MUST INCLUDE:
1. CAMERA — 3-quarter top-down (always — looking down at the world from slight angle)
2. TILE-BASED WORLD visible (grass / stone / cobble / sand / wood / cave / water tiles)
3. HERO PARTY-SPRITE small mid-stride on the world (single hero OR 2-4 party members)
4. CHARACTERISTIC BIOME / SETTING (overworld / town / dungeon / castle / forest / desert / etc.)
5. NPC LIFE OR ENEMY CREATURES in the scene
6. JRPG ENVIRONMENT PROPS (treasure chest / signpost / fountain / altar / tavern sign / etc.)

━━━ SETTING TYPES — ROTATE BROADLY ━━━

- Overworld grass-plain with dirt road, distant village
- Dense pine-forest with hidden path
- Mountain pass with stone bridges over chasms
- Desert oasis with palm trees and stone shrine
- Coastal town with cobblestone streets and seagulls
- Castle throne-room with carpeted dais and king-NPC
- Inn interior with wooden floor and patrons at tables
- Dungeon-crypt corridor with sarcophagi and torches
- Sacred grove with glowing rune-stones and ancient tree
- Volcanic cave with magma-streams and stone bridges
- Frozen tundra with snow-drifts and ice-huts
- Pirate ship deck with hero party sneaking past sailors
- Sky-temple floating in clouds with stained-glass floor
- Dwarven mine with rail-cart tracks and pickaxe-wielding NPCs
- Elven village with treetop tile-platforms and rope-bridges
- Haunted village with crooked houses and skeleton patrols
- Wizard's tower spiral interior with floating tomes
- Temple ruins with vine-overgrown stone tiles
- Ocean-floor treasure cave with bubble-streams
- Lakeside shrine with mossy stone path and koi pond
- Burning village with smoke columns and panicked NPCs
- Royal courtyard with knights training in pairs
- Library hall with rows of bookshelves and reading-NPCs
- Marketplace square with vendor-stalls and cobblestone fountain
- Crossroads with signpost pointing four directions

━━━ HERO PARTY-SPRITE TYPES — ROTATE BROADLY ━━━

Kid in green tunic with sword and shield, mage in blue robe with staff, warrior in heavy armor with axe, princess in white gown, ninja in dark garb with shuriken, monk in saffron robes, paladin in golden armor, cleric in white-and-red, ranger with bow, dragoon with spear, dancer in flowing scarves, samurai in lacquered armor, pirate captain with cutlass, summoner with bird-companion, scholar with book.

━━━ NPC / ENEMY TYPES — ROTATE BROADLY ━━━

NPCs: vendor at market stall, farmer with hoe, child running, priest at altar, soldier on patrol, dancer in inn, blacksmith hammering, baker hauling tray, fisherman with rod, drunkard at counter, washerwoman, gravedigger, court-mage, queen on throne, dwarf at forge, elf-scholar.

Enemies: slime with bouncing motion, giant rat, cave-bat, skeleton soldier, orc warrior, goblin scout, harpy mid-flight, dire wolf, undead-knight, plant-monster, mimic-chest, golem, ghost-mage, lizard-warrior, kobold raider, scorpion, sand-worm, ice-elemental.

━━━ EXAMPLES (write fresh — do not copy) ━━━

- "3-quarter top-down camera over a sunlit grass-plain overworld, dirt road winding through tile-grass with a small village in middle parallax, kid-hero in green tunic mid-stride sword raised, child NPC running across the path, treasure chest under an oak tree, drifting flower-petals, dappled sunshine."
- "3-quarter top-down view of a cobblestone town square at golden hour, tile-cobble pavement with central stone fountain, three party members mid-stride toward the inn, two vendor-NPCs at market stalls with awnings, baker hauling bread-tray, lit tavern sign glowing amber, drifting petals."
- "3-quarter top-down dungeon-crypt corridor, tile-stone floor with cracked sarcophagi flanking, hero party in single-file mid-stride, skeleton-soldier patrolling ahead, wall-torches flickering orange, drifting dust-motes in the torch-shaft, treasure chest in the corner."
- "3-quarter top-down sacred grove with mossy stone-tile floor, ancient tree at the center with glowing rune-circle around it, mage in blue robe casting spell on the runes, princess companion watching, mossy stones around clearing, drifting magical-motes pale-cyan."
- "3-quarter top-down volcanic cave, tile-stone floor with magma-stream cutting through middle, stone-bridge crossing the lava, dragoon-hero mid-stride spear raised toward red-orange ember-glow chamber, plant-monster lurching from a side passage, drifting embers, oppressive heat-shimmer."
- "3-quarter top-down frozen tundra, snow-tile floor with ice-hut cluster and igloo, party of 4 mid-stride wrapped in cloaks crossing the snowfield, winter-wolf prowling on the right, distant snow-mountains in middle parallax, drifting snowflakes, soft cool sunlight."
- "3-quarter top-down royal courtyard, marble-tile floor with red carpet, two knight-NPCs sparring with swords, princess companion mid-stride observing, royal-guard standing at attention by the throne-room doors, hanging banners, drifting cherry-petals."
- "3-quarter top-down pirate ship deck, wooden plank tile-floor with rigging-shadows, hero ninja mid-stride with shuriken drawn sneaking past two sleeping pirate-NPCs, captain's wheel in the back, hanging lantern swaying, ocean horizon with stormy sky beyond."

━━━ HARD RULES ━━━

- ALWAYS 3-quarter top-down camera (looking down at the world from slight angle, classic SNES-RPG perspective)
- ALWAYS show tile-based world clearly (grass / stone / sand / wood / etc.)
- ALWAYS hero party-sprite small mid-stride on the world
- ALWAYS NPC life OR enemy creatures in the scene
- 16-BIT chunky pixel-grid aesthetic — NOT modern HD-2D smooth, NOT painterly
- Saturated SNES-era palette — emerald-greens / royal-blues / desert-ambers / castle-grays / dungeon-violets / golden-glow accents
- Animated-feel particles (drifting petals / dust motes / firefly-glow / dripping water / falling leaves / sparkles)
- NO UI / health bars / damage numbers / dialogue boxes
- NEVER named IP characters in OUTPUT scene (no "Link" / "Cloud" / "Crono" / "Ness" by name) — use generic descriptive labels for hero ("kid in green tunic", "mage in blue robe", "princess in white gown")
- NEVER side-scrolling / first-person / straight-down / 3D-iso-grid composition
- NEVER vertical-portrait or static-vista compositions

━━━ AVOID ━━━

- Specific named IP characters in the OUTPUT scene
- Side-scrolling / platformer compositions (different path)
- Vista paintings without action
- Smooth modern indie-pixel rendering
- Pure top-down (straight-down god's-eye)

━━━ OUTPUT ━━━
Output ONLY a valid JSON array of ${n} strings. Each string is one complete scene description (30-50 words). No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
