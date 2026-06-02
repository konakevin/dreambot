#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/dungeon_depth_scenes.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (
    n
  ) => `Write ${n} 16-BIT DIABLO-STYLE TOP-DOWN DUNGEON-CRAWLER GAMEPLAY SCREENSHOT scene descriptions for PixelBot's dungeon-depth path. Genre lineage: Diablo (and Diablo II) pixel-style + Hades chamber-reveals + Hyper Light Drifter top-down ruins + Children of Morta + Death's Gambit + Moonlighter + Eitr + Heroes of Hammerwatch.

━━━ THE NORTH STAR ━━━

Each entry should look like A SCREENSHOT FROM A 16-BIT DIABLO-STYLE TOP-DOWN DUNGEON-CRAWLER LEVEL — looking DOWN at the dungeon floor from above, hero adventurer pixel-sprite small in the chamber, monster encounter mid-action, treasure / loot / dungeon-props on the floor. NOT side-scroller. NOT cinematic concept art. Classic top-down dungeon-crawler gameplay.

Each entry: 30-50 words, ONE paragraph. EVERY entry MUST OPEN with explicit top-down framing — "Top-down view of...", "3/4 isometric dungeon chamber...", "Looking down at...", "Top-down 16-bit dungeon-crawler...".

━━━ MANDATORY ELEMENTS (every entry) ━━━

1. CAMERA — top-down OR near-top-down 3/4 isometric (always — explicit in opening)
2. TILE FLOOR clearly visible (cracked-flagstone / mossy-stone / bone-tile / blood-stained / magma-cracked / etc.)
3. HERO ADVENTURER pixel-sprite small on the floor mid-action (armored knight, robed mage, hooded ranger, dual-wielding rogue, paladin, assassin)
4. MONSTER ENCOUNTER OR DUNGEON THREAT mid-action (patrolling skeleton, charging zombie, lich casting, demon-imp, slime-pile, undead-knight, mimic-chest, spider-queen, etc.)
5. DIABLO-STYLE LOOT / DUNGEON PROPS on the floor (treasure chest, scattered coins, glowing weapon, runic-altar, candelabra, blood-pool, skeletal remains, urns, magic-rune glow on tiles)

━━━ DUNGEON SETTING TYPES — ROTATE BROADLY ━━━

- Stone hall with cracked-flagstone tiles and torchlit walls
- Cathedral catacomb with cracked sarcophagi and bone-piles
- Treasure chamber with overflowing chest and scattered coins
- Bioluminescent fungi cave with glowing mushroom clusters
- Magic-circle inscribed floor (runic summoning chamber)
- Submerged temple with water lapping at the floor
- Crystal cavern with refracting gem-veins
- Ancient library dungeon with toppled bookshelves
- Demonic altar chamber with red-glow runes
- Frozen ice-tomb with frozen warriors in glaciers
- Volcanic lava chamber with stone bridge
- Overgrown jungle ruin with vine-strangled pillars
- Forgotten throne room with broken crown on floor
- Bone-coated corridor with skeletal arches
- Wizard's tower interior with alchemy bottles
- Prison cell-block with rusted bars
- Sunken pirate-cove dungeon with treasure-piles
- Kraken-temple with tentacle stone-carvings
- Mage-academy laboratory with bubbling cauldrons
- Spider-queen lair with cobweb-draped pillars
- Hellish foundry with chained demons
- Necromancer's pit with rising skeletons
- Plague-rat sewer with green ooze pools
- Ghoul-infested mausoleum
- Lich's library with floating tomes

━━━ HERO ADVENTURER TYPES — ROTATE BROADLY ━━━

Armored knight with sword and shield, robed mage with staff, hooded ranger with bow, dual-wielding rogue with daggers, plate-armored paladin with mace, leather-clad assassin with dagger, barbarian with axe, monk with quarterstaff, druid with vine-staff, cleric with mace and tome.

━━━ MONSTER TYPES — ROTATE BROADLY ━━━

Skeleton warrior, skeleton archer, charging zombie, ghoul crouching, lich casting spell, demon-imp lunging, slime-pile bouncing, undead-knight charging, mimic-chest snapping, spider-queen on web, plague-rat swarming, fishman emerging, witch on broom, bone-snake, wraith floating, gargoyle, golem stomping, harpy mid-flight, dire wolf, banshee screeching.

━━━ EXAMPLES (write fresh — do not copy) ━━━

- "Top-down view of a torch-lit stone hall, cracked-flagstone tiles with dust motes drifting, hero armored-knight-sprite mid-stride sword raised at the south edge, skeleton warrior patrolling the north archway, scattered coins glinting on the floor, blood-pool by a broken sarcophagus, layered chamber walls."
- "3/4 isometric dungeon chamber, mossy-stone tile floor with a magic-circle inscribed in violet runes, hero robed-mage-sprite mid-cast staff glowing, demon-imp with pitchfork lunging from the east passage, treasure chest overflowing gold in the corner, dripping wax candelabra, bone-pile."
- "Top-down view of a bioluminescent fungi cave, mossy-stone tile floor with glowing pale-cyan mushroom clusters, hero hooded-ranger-sprite mid-stride bow drawn, slime-pile bouncing toward her, drifting spore-particles, skeletal remains and an urn on the floor."
- "Looking down at a frozen ice-tomb chamber, ice-tile floor with frozen warriors locked in translucent ice-blocks, hero plate-paladin-sprite mid-charge mace raised, undead-knight rising from a cracked tomb, breath-mist visible, dripping icicles overhead, scattered coins on the ice."
- "Top-down 16-bit dungeon-crawler chamber, blood-stained-tile floor with a hellfire altar in the center, hero barbarian-sprite mid-swing axe raised, charging zombie at south, ghoul crouching east, treasure chest spilling gems, dripping wax, magic-rune glow on tiles."
- "3/4 isometric crystal cavern chamber, gem-vein-flecked stone tile floor with refracting prism-light, hero leather-clad-rogue-sprite mid-roll daggers drawn, lich casting at north altar, scattered coins and an enchanted-sword on the floor, drifting magical motes."
- "Top-down view of a sunken-temple chamber, water-lapping mossy-tile floor, hero druid-sprite with vine-staff mid-stride, fishman emerging from a flooded passage, bone-pile in the corner, dripping torchlight from above, glowing runic-altar with offerings."
- "Looking down at an overgrown jungle ruin, vine-strangled stone tiles with monkey-skull totems, hero monk-sprite mid-stride quarterstaff raised, spider-queen rising from the ceiling-web at north, scattered coins and broken weapons, drifting dust motes in sunbeam."

━━━ HARD RULES ━━━

- ALWAYS open with explicit top-down or 3/4-iso framing
- ALWAYS show tile floor as the dominant element (the play-space)
- ALWAYS hero adventurer pixel-sprite small on the floor mid-action
- ALWAYS monster encounter mid-action (or threat-imminent)
- ALWAYS Diablo-style loot / dungeon props (treasure chest / scattered coins / runic-altar / candelabra / bone-piles / etc.)
- 16-BIT chunky pixel-grid aesthetic — hard sprite edges, visible tile-edges, NEVER smooth/painterly
- Saturated dark gothic palette — deep stone-grays / blood-reds / candle-orange / sickly-green poison / magic-violet / blue-black shadow
- Animated-feel particles (drifting dust motes / dripping water / drifting smoke / glow-spore / firefly-glow / breath-mist)
- NO UI / health bars / damage numbers / dialogue boxes
- NEVER named IP characters (no "Diablo" / "Belial" / "Imp" by name)
- NEVER side-scrolling / first-person / dramatic-portrait composition

━━━ AVOID ━━━

- Specific named IPs
- Side-view or vertical-portrait compositions
- Brightly-lit cheerful scenes — dungeons are DIM and threatening
- Static frames without monster encounter or hero mid-action

━━━ OUTPUT ━━━
Output ONLY a valid JSON array of ${n} strings. Each string is one complete scene description (30-50 words). No preamble, no commentary, no markdown code fences.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
