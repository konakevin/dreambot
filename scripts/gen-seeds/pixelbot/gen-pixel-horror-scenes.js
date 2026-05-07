#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixel_horror_scenes.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (n) => `Write ${n} 16-BIT GOTHIC-FANTASY ACTION GAMEPLAY SCREENSHOT scene descriptions for PixelBot's pixel-horror path. Genre lineage: Castlevania (NES/SNES) + Ghosts 'n Goblins + Ghouls 'n Ghosts + Black Tiger (Capcom) + Demon's Crest + Magical Quest + Splatterhouse + Rondo of Blood + Bloodstained pixel-tribute + Maximo pixel.

━━━ THE NORTH STAR ━━━

Each entry should look like A SCREENSHOT FROM A 16-BIT GOTHIC-FANTASY ACTION GAME LEVEL — vampire-hunting in a haunted castle, monster-slaying through graveyards, dragon-caves with treasure, demon-realm fortresses. Classic side-scroller / 3/4-iso action gameplay. NOT modern psychological horror. NOT creeping dread. CLASSIC retro monster-slaying.

Each entry: 30-50 words, ONE paragraph. EVERY entry MUST INCLUDE:
1. CAMERA — side-view / 3/4 iso / top-down (one explicitly stated)
2. GOTHIC SETTING (castle hallway / graveyard / cathedral / crypt / dragon-cave / cursed-forest / etc.)
3. CLASSIC FANTASY ENEMY mid-action (skeleton / vampire / demon / gargoyle / ghost / dragon / lich / zombie / werewolf / harpy / etc.)
4. HERO KNIGHT-SPRITE small on the floor mid-action (armored knight / vampire-hunter / barbarian / mage)
5. GOTHIC ATMOSPHERIC PROPS (torches / candelabras / stained-glass / chandeliers / sarcophagi / cobwebbed pillars / cursed roses / etc.)

━━━ SETTING TYPES — ROTATE BROADLY ━━━

- Vampire castle stone-hall corridor
- Cathedral with toppled pews and shattered stained-glass
- Graveyard at midnight with rising skeletons
- Crypt-corridor with sarcophagi and dripping wax
- Dragon-cave treasure-room with gold piles
- Demon-realm lava-pit with stone bridges
- Swamp-witch hut over toxic bog
- Cursed forest with twisted skeletal trees
- Ruined fortress ramparts under storm-sky
- Undead arena with bone-piles
- Werewolf-haunted moonlit clearing
- Vampire ballroom with chandelier
- Hellish foundry with chained demons
- Gothic-tower spiral interior
- Catacomb depth with skeletal arches
- Burning village with shambling zombies
- Cursed cathedral nave with possessed statues
- Necromancer's laboratory with bubbling cauldrons
- Dragon's lair lava-bridge
- Lich's library with floating tomes
- Cursed-forest moss-overgrown ruin
- Witch's covenstead with cauldron
- Ghoul-infested mausoleum
- Wraith-hall with floating apparitions
- Frost-cursed castle balcony

━━━ ENEMY TYPES — ROTATE BROADLY ━━━

Skeleton warrior, skeleton archer, vampire bat-form, vampire-lord cape-spreading, demon-imp pitchfork, gargoyle launching, zombie shambling, ghost-knight floating, ghoul crouching, lich casting spell, werewolf mid-leap, harpy diving, ogre swinging club, undead-knight charging, mummy lurching, banshee screeching, dragon-whelp breathing fire, possessed-statue animating, dark-priest summoning, cursed-armor rising, plague-rat swarming, fishman emerging, witch on broom, frankenstein lurching, headless-horseman riding.

━━━ EXAMPLES (write fresh — do not copy) ━━━

- "Side-view 16-bit gothic action level, vampire castle stone-hall corridor, foreground checkered-tile floor with hero knight-sprite mid-strike sword raised, skeleton warrior rising from cracked tile, candelabra flickering on wall, stained-glass window casting blood-red light, parallax columns receding."
- "3/4 isometric gothic action chamber, dragon-cave treasure-room with gold-pile foreground, hero barbarian-sprite mid-stride raising axe, dragon-whelp coiled atop hoard breathing fire, glowing cyan crystal-veins in walls, stalactites overhead, drifting embers."
- "Top-down 16-bit graveyard arena, hero vampire-hunter sprite at south edge crossbow drawn, three skeletons rising from cracked tombstones, full moon overhead, cursed iron fence at perimeter, drifting fog and falling autumn leaves, lit lantern by gravedigger's shed."
- "Side-view cathedral nave level, foreground checkered-tile floor with toppled pews, hero knight-sprite mid-leap holy-sword raised, possessed-statue animating from pedestal mid-frame, shattered stained-glass window casting violet light, hanging chandelier swaying."
- "Side-scrolling 2D crypt corridor, foreground stone-tile floor with cobwebs, hero mage-sprite mid-cast staff glowing, skeleton-archer drawing bow on raised platform, sarcophagus lid sliding open, dripping wax candelabra, deep blue-black shadows."
- "3/4 iso demon-realm lava-pit chamber, foreground obsidian-tile bridge with hero knight-sprite mid-stride, demon-imp with pitchfork lunging, stone bridge over molten orange lava, skull-decorated columns, drifting embers and ash, cracked stone walls receding."
- "Side-view ruined-fortress ramparts level at storm-night, foreground stone parapet with hero vampire-hunter sprite mid-stride crossbow drawn, undead-knight charging on the parapet ahead, lightning strike middle-distance, gothic spires fading into rain-haze."

━━━ HARD RULES ━━━

- ALWAYS specify camera (side-view / 3/4 iso / top-down)
- ALWAYS show a hero-sprite mid-action AND a fantasy enemy in the scene
- 16-BIT chunky pixel-grid aesthetic — NOT modern HD-2D smooth, NOT painterly
- Saturated gothic palette — deep purples / blood reds / candle-orange / blue-black shadows
- Animated-feel particles (drifting bats / dripping wax / falling cobwebs / embers / sparks)
- NO UI / health bars / damage numbers / dialogue boxes
- NO modern psychological-horror language (NEVER "wrong-shape silhouette" / "flickering fluorescent" / "analog static" / "wrong-color wallpaper" / "implied dread")
- NEVER vertical-portrait compositions or static vistas without action
- Specific named IPs (Castlevania, Ghosts 'n Goblins by name) — never mentioned, just lineage in your head

━━━ AVOID ━━━

- Modern psychological-horror trappings (CRT static, fluorescent flicker, suburban abandoned spaces)
- Static empty hallways without enemies and a hero
- Smooth modern indie-pixel rendering
- Portrait-poster compositions

━━━ OUTPUT ━━━
Output ONLY a valid JSON array of ${n} strings. Each string is one complete scene description (30-50 words). No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
