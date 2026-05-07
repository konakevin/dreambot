#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/jrpg_combat_scenes.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (n) => `Write ${n} 16-BIT JRPG COMBAT GAMEPLAY SCREENSHOT scene descriptions for PixelBot's jrpg-combat path. Genre lineage: Final Fantasy IV / V / VI battle scenes + Chrono Trigger active-time combat + Secret of Mana real-time combat + Seiken Densetsu 3 boss fights + Star Ocean combat + Tales of Phantasia combat + Lufia II battles + Y's series action combat + Live A Live combat.

━━━ THE NORTH STAR ━━━

Each entry should look like A SCREENSHOT FROM A 16-BIT JRPG MID-COMBAT in an open world — top-down or 3/4 isometric camera, hero party fighting monsters, spell effects flying, party mid-cast/mid-strike, monster mid-attack. NOT cosmic-void abstract. NOT cutscene poses. ACTIVE COMBAT GAMEPLAY.

Each entry: 30-50 words, ONE paragraph. EVERY entry MUST OPEN with explicit top-down/iso framing — "Top-down view of a JRPG party battling...", "3/4 isometric combat scene...", "Looking down at a JRPG party fighting...", "Top-down 16-bit JRPG combat screenshot...".

━━━ MANDATORY ELEMENTS (every entry — NO EXCEPTIONS) ━━━

1. CAMERA — top-down OR 3/4 isometric (always — explicit in opening)
2. TILE FLOOR / OPEN-WORLD GROUND visible (grass / stone / sand / forest-floor / cave-floor / ice / lava-rock / ruined-tile)
3. HERO PARTY of 2-4 pixel-sprites in formation mid-action (kid with sword, mage with staff, princess in gown, warrior with axe, ninja, monk, paladin, ranger, dragoon, samurai, dancer, cleric)
4. MONSTER ENEMY mid-attack (dragon / lich / forest-spirit / chimera / wraith / stone-golem / giant-wolf / spider-queen / ice-giant / harpy / hydra / demon-knight / etc.)
5. VISIBLE SPELL OR WEAPON EFFECT (fireball-arc trailing flame, lightning-bolt zigzag, ice-shard volley, healing-glow aura, sword-slash-arc, arrow-trail, summon-spirit aura, dark-magic-cloud, wind-blade, holy-light-pillar)
6. OPEN-WORLD JRPG SETTING (NOT cosmic-void) — outdoor biomes, ruins, dungeons with light

━━━ OPEN-WORLD SETTING TYPES — ROTATE BROADLY ━━━

- Forest clearing with sun-rays through canopy
- Mountain pass with snow-capped peaks visible
- Grassland with rolling hills
- Ruined temple courtyard with vine-strangled pillars
- Cave entrance with crystal-light streaming in
- Lakeshore with reflecting water
- Snowy plain with distant mountains
- Desert oasis with palm trees
- Ancient stone-bridge over chasm
- Beach with crashing waves
- Swamp clearing with moss-stones
- Frozen lake with ice-cracks
- Bamboo forest with cherry blossoms
- Volcanic crater rim
- Rolling-hill prairie at dusk
- Canyon between red cliffs
- Underwater shrine clearing
- Sky-island platform overlooking clouds
- Marsh with reeds and lit lanterns
- Ruined castle courtyard
- Forest grove with ancient oak
- Coastal cliff with stormy ocean below
- Glacier valley with aurora overhead
- Misty mountain shrine
- Coliseum sand-arena
- Open meadow with wildflowers
- Crossroads with signpost
- Dragon's-gate entrance with stone pillars
- Cursed forest with twisted trees
- Hilltop ruins overlooking valley

━━━ HERO PARTY-SPRITE TYPES — ROTATE BROADLY (2-4 per scene) ━━━

Kid in green tunic with sword and shield, mage in blue robe with staff, princess in white gown casting, warrior in heavy armor with axe, ninja in dark garb with shuriken, monk in saffron robes with quarterstaff, paladin in golden armor with mace, cleric in white-and-red with tome, ranger with bow drawn, dragoon mid-spear-thrust, dancer mid-spin with scarves, samurai with katana raised, summoner with bird-companion, scholar with book, barbarian with two-handed axe, druid with vine-staff.

━━━ MONSTER TYPES — ROTATE BROADLY ━━━

Dragon mid-fire-breath, lich casting necro-spell, forest-spirit lunging, chimera roaring, wraith-cluster swooping, stone-golem stomping, giant-wolf snarling, spider-queen rearing, ice-giant smashing, harpy diving, hydra with multiple heads attacking, demon-knight charging, undead-knight rising, plague-rat swarm, basilisk gaze, troll lurching, gorgon hissing, kraken-tentacle emerging, frost-witch casting, fire-elemental, crystal-golem, treant looming, ogre with club, manticore mid-leap, frost-wolf pack, spectral-knight, swamp-hag, sand-worm.

━━━ SPELL / WEAPON EFFECT TYPES — ROTATE BROADLY ━━━

Fireball mid-arc trailing flame and embers, lightning-bolt zigzagging from staff-tip to monster, ice-shard volley flying, healing-glow aura around party member, sword-slash-arc with motion-blur, arrow-trail mid-flight, summon-spirit glowing aura with translucent figure forming, dark-magic-cloud swirling, wind-blade vortex, holy-light-pillar shooting up, blood-rune circle pulsing on ground, frost-cone freezing area, lava-burst from cracked earth, lightning-rain falling, magic-bolt-cluster fanning out, charged-up-flash sphere, axe-spin with slash-trails.

━━━ EXAMPLES (write fresh — do not copy) ━━━

- "Top-down view of a JRPG party battling a forest-troll in a sun-dappled clearing, foreground grass-tile floor with kid-hero mid-sword-swing, mage-companion casting fireball-arc trailing embers toward troll, princess casting healing-glow on warrior, warrior mid-axe-swing, drifting petals, sun-rays through canopy."
- "3/4 isometric combat scene in a ruined temple courtyard, party of four mid-action — dragoon mid-spear-thrust at stone-golem, ninja flanking with shuriken trail, mage with staff raised conjuring lightning-bolt zigzag, cleric mid-prayer with healing-glow, vine-strangled pillars in middle layer, drifting dust motes."
- "Looking down at a JRPG party fighting a dragon on a mountain pass, foreground rocky tile-ground with paladin shielding princess, warrior mid-axe-strike at dragon's flank, mage with staff casting ice-shard volley, dragon mid-fire-breath roaring, snow-capped peaks beyond, drifting snowflakes."
- "Top-down 16-bit JRPG combat screenshot in a cave with crystal-light, party of three mid-battle with spider-queen — kid-hero mid-sword-strike, ranger with bow drawn arrow trailing, monk with quarterstaff mid-spin, spider-queen rearing with web-trails, glowing crystal-veins, drifting magical motes, deep cave-haze backdrop."
- "3/4 isometric combat scene at a snowy plain with distant peaks, party of four — barbarian mid-double-axe-swing at ice-giant, mage casting fire-burst, princess healing wounded warrior with healing-glow aura, ice-giant mid-stomp shaking ground, drifting snowflakes, golden-hour sun."
- "Top-down view of a JRPG party at a desert oasis battling a sand-worm, foreground sand-tile with palm-tree shadows, samurai mid-katana-slash with motion-blur arc, mage casting wind-blade vortex, cleric mid-prayer with holy-light-pillar, sand-worm emerging from ground spraying sand-particles, palm trees parallax."
- "3/4 isometric combat scene at a swamp clearing, party of three — druid casting vine-trap from staff, ranger with arrow trailing, warrior mid-axe-swing, troll-creature lurching from moss-pool, mossy-stone tile floor, drifting fireflies, deep green-violet swamp ambient."
- "Looking down at a JRPG party fighting a frost-witch on a frozen lake, foreground ice-tile with ice-cracks, dragoon mid-spear-thrust, mage casting lightning-bolt zigzag, princess with healing-glow on cleric, frost-witch mid-cast with ice-shard cone, distant snow-mountains, drifting snowflakes."
- "Top-down 16-bit JRPG combat at a coastal cliff with stormy ocean, party of four — kid-hero mid-sword-strike, mage casting summon-spirit aura with translucent dragon forming above, ranger with bow drawn, paladin shielding cleric, harpy diving with wing-spread, lightning-flash in middle distance, drifting rain."
- "3/4 isometric combat scene at a ruined castle courtyard, party of three — warrior mid-axe-swing at undead-knight, mage casting dark-magic-cloud at lich-boss, princess healing party with holy-light-aura, lich raising bone-warriors with necro-aura, cracked-stone tile floor, drifting ash motes."

━━━ HARD RULES ━━━

- ALWAYS top-down or 3/4 isometric camera (NEVER side-view / first-person / vertical-portrait / cosmic-void)
- ALWAYS hero party of 2-4 mid-action
- ALWAYS monster mid-attack
- ALWAYS visible spell or weapon effect
- ALWAYS OPEN-WORLD JRPG setting (NOT cosmic-void abstract — that's a different aesthetic we removed)
- 16-BIT chunky pixel-grid aesthetic — hard sprite edges, dithered shading, NEVER smooth/painterly
- Saturated SNES-era palette — RICH chunky color blocks
- Animated particles (drifting petals / dust / firefly-glow / snow / sparkles / spell-residue)
- NO UI / health bars / damage numbers / dialogue boxes
- NEVER named IP characters (no "Crono" / "Cloud" / "Terra" by name) — generic descriptive labels
- NEVER cosmic-void / abstract / cutscene-only / static-pose composition

━━━ AVOID ━━━

- Cosmic-void abstract settings (different aesthetic — we removed those)
- Specific named IPs
- Static cutscene poses (parties walking through, no combat)
- Side-scrolling or first-person compositions
- Smooth modern indie-pixel rendering

━━━ OUTPUT ━━━
Output ONLY a valid JSON array of ${n} strings. Each string is one complete scene description (30-50 words). No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
