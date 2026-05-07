#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/side_scroller_scenes.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (n) => `Write ${n} 16-BIT SIDE-SCROLLING PLATFORMER GAMEPLAY SCREENSHOT scene descriptions for PixelBot's side-scroller-world path. Each entry feeds a Flux pixel-art prompt-writer. Genre lineage: Castlevania IV + Super Metroid + Donkey Kong Country + Mega Man X + Owlboy + Hollow Knight pixel-spinoff + Dead Cells + Celeste + Ori-style.

━━━ THE NORTH STAR ━━━

Each entry should look like A SCREENSHOT FROM AN ACTUAL 16-BIT 2D SIDE-SCROLLING PLATFORMER LEVEL — not concept art, not key art, not a vista painting. The camera is sliced FLAT from the side, looking ACROSS the world. Foreground platforming terrain + middle parallax + far backdrop. Player-sprite on the platform mid-stride. The viewer thinks: "this is a level I'd play right now."

Each entry: 30-50 words, ONE paragraph. EVERY entry MUST OPEN with explicit side-view framing language.

━━━ MANDATORY OPENING PATTERN — every entry starts with one of these ━━━

- "Horizontal side-view of [biome], foreground [platform-type] with [terrain-detail], middle layer [parallax-element], far backdrop [sky/horizon-detail]..."
- "Side-scrolling 2D level set in [biome], [platform-type] running across the foreground, [parallax-layer] receding behind, [far-backdrop]..."
- "Side-view 16-bit platformer of [biome], hero sprite mid-stride on [platform-type], [middle-layer-detail] behind, [far-backdrop]..."

ALWAYS include a player-sprite (small hero figure) on the foreground platforming surface, mid-stride.

━━━ BIOME / SETTING — ROTATE BROADLY ━━━

- Forest canopy with branch-platforms
- Underground crystal cavern
- Lava-cavern with floating obsidian platforms
- Frozen tundra with ice-platforms
- Sky-island archipelago at sunrise
- Cliffside kingdom built into mountain face
- Volcanic peak with floating lava-rock platforms
- Steampunk airship-dock with brass walkways
- Abandoned cathedral with crumbling pews
- Coral-reef with bioluminescent kelp platforms
- Bamboo-forest with vertical bamboo trunks
- Ancient temple ruin with broken column-platforms
- Pirate-galleon-shipwreck with rope-rigging
- Magical-academy interior with floating bookshelves
- Storm-cliff with lightning middle-distance
- Mech-factory with conveyor-belt platforms
- Haunted mansion side-cutaway with rooms-as-platforms
- Underwater archipelago with kelp-platforms
- Crystal-cave waterfall platforming
- Desert ruin with sandstone arches
- Mushroom-forest with mushroom-cap platforms
- Clockwork-tower interior with gear-platforms
- Stone-bridge fortress with parapets

━━━ HARD RULES ━━━

- ALWAYS HORIZONTAL SIDE-VIEW — left-to-right reading direction
- ALWAYS 3 PARALLAX LAYERS — foreground platform + middle layer + far backdrop
- ALWAYS player-sprite small on the foreground platform mid-stride
- 16-BIT chunky pixel-grid aesthetic — NOT modern HD-2D smooth, NOT painterly
- Animated-feel particles (drifting pollen / snow / embers / rain / petals / pollen-motes)
- NEVER vertical-portrait compositions
- NEVER top-down or iso-angled-down floors
- NEVER first-person (looking-through-hero's-eyes)
- NEVER frontal-4th-wall views (looking AT a wall / facade / hall-interior from the door)
- NEVER vista paintings without playable platforms
- NO UI / health bars / damage numbers / dialogue boxes

━━━ EXAMPLES (write fresh — do not copy) ━━━

- "Horizontal side-view of a sky-island platformer level at sunrise, foreground stone platform with mossy edges and dangling vines hosting a hero player-sprite mid-stride sword raised, middle layer floating moss-platforms with rope bridges, far backdrop pink-orange cloud-bank with mountain peaks emerging."
- "Side-scrolling 2D underground crystal cavern, hero sprite tiny mid-jump on a stone-tile platform foreground glowing pale-cyan from gem-veins, middle layer cavern hall with stalactites and additional ledges, far backdrop deep-violet cave gloom fading to black, drifting magical motes."
- "Side-view 16-bit platformer of a frozen tundra level, foreground ice-platform with frost-crystal edges and a cloaked hero sprite mid-walk staff in hand, middle layer snow-laden pines with snow-drifted hills, far backdrop aurora ribbons in pink-cyan night sky."
- "Horizontal side-view of a mech-factory level, foreground steel-grate platform with conveyor-belts and a hero player-sprite mid-jump dodging neon sparks, middle layer brass scaffolding with mechanical arms in action, far backdrop furnace-glow steam-cloud parallax."
- "Side-scrolling 2D castle-ramparts level at storm-night, foreground stone-tile parapet with a hooded hero sprite mid-stride sword in hand, middle layer columned hall with iron braziers, far backdrop lightning strike across deep-blue stormy sky."
- "Side-view 16-bit forest-canopy level, hero sprite mid-jump between two oak-branch platforms, middle layer giant ancient trees with platforms in branches and rope-bridges, far backdrop golden god-rays piercing pink-tinted morning fog."
- "Horizontal side-view of a volcanic peak level, foreground obsidian platform with a hero player-sprite mid-stride leaping over a lava-channel, middle layer floating lava-rock platforms with embers rising, far backdrop erupting peak with ash-cloud plume."
- "Side-scrolling 2D pirate-galleon-shipwreck level, hero sprite mid-stride on a tilted deck-plank in foreground, middle layer rope-rigging and torn-sail platforms, far backdrop stormy ocean horizon with thunder-clouds."

━━━ AVOID ━━━

- Specific named IPs (Hollow Knight, Castlevania, Owlboy by name)
- Vertical compositions (looking up at tower, looking down chasm)
- Frontal-vista compositions (looking AT a thing without side-view)
- Static empty frames without a hero sprite
- Atmospheric concept-art language ("dramatic vista" / "cinematic landscape" / "epic panorama") — ONLY gameplay-screenshot framing
- Smooth modern indie-pixel rendering — strict 16-bit chunky retro

━━━ OUTPUT ━━━
Output ONLY a valid JSON array of ${n} strings. Each string is one complete scene description (30-50 words). No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
