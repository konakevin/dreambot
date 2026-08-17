/**
 * pixelbot archetype templates — Sonnet brief composer functions.
 *
 * Each function takes the rolled slots + sharedDNA + vibeDirective and
 * returns the final brief string sent to Sonnet for polish.
 *
 * Auto-discovered by scripts/lib/archetypeRegistry.js.
 *
 * To add a new template: add an entry here + the matching archetype
 * definition in ./archetypes.js.
 */

module.exports = {
  PIXELBOT_PIXEL_OVERWORLD: ({ slots, sharedDNA, vibeDirective }) => {
    const { map_region, map_features, traveler_sprite, map_event } = slots;

    const features = Array.isArray(map_features) ? map_features : [map_features];
    const featureBlock = features
      .filter(Boolean)
      .map((f, i) => `${i + 1}. ${f}`)
      .join('\n');

    const eventSection = map_event
      ? `\n\n━━━ MAP EVENT ━━━\n${map_event}\n\nA small dramatic accent on the tile-map.`
      : '';

    return `You are writing a 16-bit RETRO PIXEL ART JRPG WORLD-MAP SCREEN for PixelBot. The frame must read INSTANTLY as the overworld map screen of a classic 16-bit RPG — a straight top-down view of a tile-world you sail and walk across.

Genre lineage: Final Fantasy / Dragon Quest / Chrono Trigger / Secret of Mana overworld maps — chunky repeating terrain tiles, tiny landmark icons, a small party/ship sprite crossing the world.

━━━ ABSOLUTE CAMERA + COMPOSITION LOCK (NON-NEGOTIABLE) ━━━
STRAIGHT TOP-DOWN WORLD-MAP VIEW — looking straight down at the tile-world from directly above, like the overworld map SCREEN. The chunky repeating terrain TILE-GRID must read clearly (grass / forest / mountain / desert / sea tiles).
🚫 NEVER a 3/4 town-view, NEVER a side-parallax landscape, NEVER a first-person view, NEVER a character portrait, NEVER a horizon/sky (this is looking straight DOWN at the map).

━━━ MANDATORY ELEMENTS (every render) ━━━
1. THE MAP REGION — the top-down tile-continent geography filling the frame, chunky terrain tiles clearly readable.
2. THE MAP FEATURES — small landmark icons dotting the map (walled towns / towers / bridges / ports).
3. THE TRAVELER SPRITE — a TINY map-scale party/ship/airship sprite crossing the tiles (never a portrait).

━━━ THE MAP REGION (top-down tile geography) ━━━
${map_region}

━━━ MAP FEATURES (small landmark icons — render both) ━━━
${featureBlock}

━━━ THE TRAVELER SPRITE (tiny, map-scale) ━━━
${traveler_sprite}
${eventSection}

━━━ HARD MANDATES (every render) ━━━
1. **PIXEL-ART REGISTER ONLY** — 16-bit / SNES-era. Chunky repeating terrain tiles, visible pixel grid. NEVER smooth illustration, NEVER 3D, NEVER photoreal.
2. **NO TEXT / UI / MENUS / MAP-LABELS / PLACE-NAMES / GRID-NUMBERS** — the map is pictorial only.
3. **NO IP REFERENCES** — no specific game maps / logos / franchises.
4. **STRAIGHT TOP-DOWN MAP SCREEN** — looking straight down, tile-grid reads, no horizon/sky, no 3/4 view.
5. **RICH SATURATED MAP PALETTE** — green grass, deep-blue sea, brown mountains, sandy desert, forest-green clusters.

🚫 ABSOLUTE BANS:
  • NO smooth illustration / NO 3D / NO photoreal
  • NO text / UI / menus / map-labels / place-names
  • NO IP references
  • NO 3/4 town-view / NO side-parallax / NO horizon-sky / NO first-person / NO portrait

━━━ SCENE-WIDE PIXEL PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ CAMERA PERSPECTIVE ━━━
Straight top-down world-map view (overworld map screen).

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write in this exact order ━━━
[16-bit JRPG world-map pixel-art, STRAIGHT top-down map-screen view], [the tile-continent geography (archipelago / twin continents / inland sea / etc.) with chunky readable terrain tiles], [two small landmark icons — walled town / tower / bridge / port], [a tiny map-scale party/ship/airship sprite crossing the tiles]${map_event ? ', [a small map event — storm-cloud tiles / glowing dungeon / cloud-shadows]' : ''}, [chunky 16-bit terrain tile-grid + saturated map palette (green grass / blue sea / brown mountains)]

CRITICAL — CLASSIC JRPG WORLD-MAP SCREEN (straight top-down, tile-grid reads). PIXEL ART ONLY. NO text/UI/labels anywhere. All 3 mandatory elements present.

Output ONLY 70-95 words. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose.`;
  },

  PIXELBOT_RETRO_RACING: ({ slots, sharedDNA, vibeDirective }) => {
    const { route_scene, horizon_bands, race_moment, roadside_detail } = slots;

    const roadsideSection = roadside_detail
      ? `\n\n━━━ ROADSIDE DETAIL ━━━\n${roadside_detail}\n\nA small roadside element flicking past to ground the route.`
      : '';

    return `You are writing a 16-bit RETRO ARCADE RACING gameplay screenshot for PixelBot — a pixel sports car blasting down an open highway at sunset. The frame must read INSTANTLY as a classic 16-bit arcade racer. Sun-drenched, nostalgic, exhilarating.

Genre lineage: OutRun / Rad Racer / Top Gear / Lotus / Rush'n arcade racers — the SUNSET-ARCADE look, dithered horizon bands, palm parallax. NOTE: this is 16-bit PIXEL ART arcade, NOT an anime-cel night scene (that is a different bot); this register is a SUNSET/day arcade racer.

━━━ ABSOLUTE CAMERA + COMPOSITION LOCK (NON-NEGOTIABLE) ━━━
Pick ONE per render:
  - BEHIND-THE-CAR CHASE VIEW (the genre signature) — camera low behind the car, the road stretching to the dithered horizon, car in the lower-center
  - SIDE-PROFILE — the car sliced flat side-on, scenery scrolling behind in parallax
🚫 NEVER first-person cockpit, NEVER a static-vista painting, NEVER a car portrait, NEVER an interior.

━━━ MANDATORY ELEMENTS (every render) ━━━
1. THE PIXEL SPORTS CAR — a low sleek pixel coupe (red/white/blue), MORPHOLOGICAL only (never a real make/model), mid-race-action.
2. THE ROUTE + SETTING — the highway through its beautiful setting (coast / mountains / desert / beach).
3. THE HORIZON BANDS (money-shot) — the iconic dithered sunset gradient sky + parallax scenery layers.

━━━ THE ROUTE SCENE (the setting) ━━━
${route_scene}

━━━ HORIZON BANDS — MONEY-SHOT (dithered sunset gradient + parallax) ━━━
${horizon_bands}

━━━ RACE MOMENT (the car mid-action) ━━━
${race_moment}
${roadsideSection}

━━━ HARD MANDATES (every render) ━━━
1. **PIXEL-ART REGISTER ONLY** — 16-bit / SNES-arcade. Chunky dithered pixel grid. NEVER smooth illustration, NEVER 3D, NEVER photoreal, NEVER anime-cel.
2. **NO TEXT / SIGNAGE / BILLBOARDS-WITH-TEXT / LABELS / PLATES** — everything pictorial.
3. **NO IP REFERENCES / NO REAL CAR MODELS** — the car is a generic morphological coupe.
4. **NO UI ELEMENTS** — no speedometer, lap-counter, HUD, menus.
5. **DITHERED SUNSET-ARCADE PALETTE** — warm orange / pink / purple sky bands, glinting highlights, chunky sun disc.

🚫 ABSOLUTE BANS:
  • NO smooth illustration / NO 3D / NO photoreal / NO anime-cel
  • NO readable text / signage / billboards / plates / labels
  • NO IP references / NO real car models
  • NO UI / HUD / speedometer
  • NO first-person cockpit / NO car portrait / NO crash

━━━ SCENE-WIDE PIXEL PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ CAMERA PERSPECTIVE ━━━
${sharedDNA.pixelPerspective}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write in this exact order ━━━
[16-bit arcade-racing pixel-art with camera (behind-the-car chase view or side-profile)], [the pixel sports coupe mid-race-action], [the route + setting (coast / mountains / desert / beach)], [the dithered sunset horizon bands + palm/mountain parallax]${roadside_detail ? ', [a roadside detail flicking past — palms / checkpoint arch / guardrails]' : ''}, [chunky dithered 16-bit pixel grid + warm sunset-arcade palette (orange / pink / purple bands)]

CRITICAL — 16-bit SUNSET-ARCADE RACER (OutRun-style, NOT anime-cel night). PIXEL ART ONLY. Car MORPHOLOGICAL, NO text/plates anywhere. All 3 mandatory elements present.

Output ONLY 70-95 words. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose.`;
  },

  PIXELBOT_PIXEL_ITEM_SHOP: ({ slots, sharedDNA, vibeDirective }) => {
    const { shop_locale, shelf_density, keeper_customer_life, cozy_phenomenon } = slots;

    const cozySection = cozy_phenomenon
      ? `\n\n━━━ COZY ATMOSPHERIC ACCENT ━━━\n${cozy_phenomenon}\n\nA small cozy accent warming the shop.`
      : '';

    return `You are writing a 16-bit RETRO PIXEL ART COZY RPG SHOP INTERIOR gameplay screenshot for PixelBot. The frame must read INSTANTLY as the beloved item-shop / tavern / forge / library interior from a classic 16-bit RPG. Warm, cozy, inviting — "I want to shop here." NOT an action scene, NOT a portrait.

Genre lineage: Moonlighter / Recettear item-shops, cozy SNES-RPG taverns and inns, blacksmith forges, magic libraries, general stores. Chunky sprite craft, dithered warm palette.

━━━ ABSOLUTE CAMERA + COMPOSITION LOCK (NON-NEGOTIABLE) ━━━
Pick ONE per render:
  - INTERIOR SIDE-VIEW — the shop sliced flat like a stage, counter + shelves along the back wall, sprites standing on the floor
  - 3/4 ISOMETRIC — angled-down on the shop floor, counter + shelves + sprites in cozy iso depth
🚫 NEVER first-person, NEVER a static-vista painting, NEVER a character portrait, NEVER an exterior street view.

━━━ MANDATORY ELEMENTS (every render) ━━━
1. THE SHOP INTERIOR — the cozy room, its counter/shelves/hearth layout, filling the frame as the stage.
2. THE WARES (money-shot) — countable, readable PICTORIAL wares packed on shelves/racks/counters (potion bottles / hanging swords / bread stacks / gems / tomes) — pictorial objects, NEVER text or price-tags.
3. THE SHOPKEEPER + CUSTOMER — a shopkeeper sprite and an adventurer customer mid-exchange (small chunky sprites, never a portrait).

━━━ THE SHOP LOCALE (the stage) ━━━
${shop_locale}

━━━ THE WARES — MONEY-SHOT (countable, readable, PICTORIAL) ━━━
${shelf_density}

━━━ KEEPER + CUSTOMER (mid-exchange) ━━━
${keeper_customer_life}
${cozySection}

━━━ HARD MANDATES (every render) ━━━
1. **PIXEL-ART REGISTER ONLY** — 16-bit / SNES-era. NEVER smooth illustration, NEVER 3D, NEVER photoreal.
2. **NO TEXT / SIGNAGE / PRICE-TAGS / LABELS** — every ware is a pictorial pixel object; NO readable letters/numbers anywhere.
3. **NO IP REFERENCES** — no specific game characters / logos / franchises.
4. **NO UI ELEMENTS** — no health bars, dialogue boxes, menus, speech bubbles.
5. **CHUNKY 16-BIT PIXEL GRID** — visible pixel grid on every surface.
6. **WARM COZY PALETTE** — candle-amber, wood-brown, warm hearth-orange, soft shadow; inviting shop glow.

🚫 ABSOLUTE BANS:
  • NO smooth illustration / NO 3D / NO photoreal
  • NO readable text / signage / price-tags / labels / speech bubbles
  • NO IP references
  • NO UI / HUD / menus
  • NO first-person / NO portrait / NO exterior

━━━ SCENE-WIDE PIXEL PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ CAMERA PERSPECTIVE ━━━
${sharedDNA.pixelPerspective}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write in this exact order ━━━
[16-bit cozy-shop pixel-art interior with camera (side-view or 3/4-iso)], [the specific shop locale (potion-shop / tavern / forge / library) filling the frame], [the countable pictorial wares packed on shelves/racks], [the shopkeeper + adventurer customer sprites mid-exchange]${cozy_phenomenon ? ', [a cozy atmospheric accent — hearth-flicker / cat on the counter / rain on the window]' : ''}, [chunky 16-bit pixel grid + warm cozy palette (candle-amber / wood-brown / hearth-orange)]

CRITICAL — COZY 16-BIT SHOP INTERIOR (NOT an action scene). PIXEL ART ONLY. Wares PICTORIAL, NO TEXT anywhere. All 3 mandatory elements present.

Output ONLY 70-95 words. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose.`;
  },

  PIXELBOT_PIXEL_HORROR: ({ slots, sharedDNA, vibeDirective }) => {
    const { gothic_setting, classic_enemy, hero_action, gothic_props } = slots;

    const propsSection = gothic_props
      ? `\n\n━━━ GOTHIC FLAVOR PROPS ━━━\n${gothic_props}\n\nGothic-flavor atmospheric props accenting the Castlevania-style scene.`
      : '';

    return `You are writing a 16-bit RETRO PIXEL ART GOTHIC-ACTION GAMEPLAY SCREENSHOT for PixelBot. The frame must read INSTANTLY as a level from a Castlevania / Ghosts n Goblins / Black Tiger / Demon Crest / Splatterhouse-style classic-arcade-era gothic-fantasy action game. NOT modern psychological horror. NOT creeping dread. CLASSIC monster-slaying action vibe.

Genre lineage: Castlevania (NES/SNES) + Ghosts n Goblins + Ghouls n Ghosts + Black Tiger (Capcom) + Demon Crest + Magical Quest + Splatterhouse + Rondo of Blood + Bloodstained pixel-tribute + Maximo pixel.

━━━ ABSOLUTE CAMERA + COMPOSITION LOCK (NON-NEGOTIABLE) ━━━

Pick ONE per render based on the gothic setting:
  - HORIZONTAL SIDE-VIEW (Castlevania / Ghouls n Ghosts) — character sliced flat, foreground platform, parallax depth behind
  - 3/4 ISOMETRIC (Black Tiger interior chambers / Demon Crest aerial views) — angled-down on the floor with knight-sprite mid-action
  - TOP-DOWN action-arena — looking down at a tile-floor with knight + enemies

🚫 NEVER first-person, NEVER static-vista painting, NEVER concept-art portraits, NEVER vertical-key-art.

━━━ MANDATORY ELEMENTS (every render must include all 4) ━━━

1. GOTHIC SETTING — vampire castle hallway, graveyard at midnight, dragon-cave treasure-room, cathedral with toppled pews, crypt-corridor with sarcophagi, demon-realm lava-pit, swamp-witch hut, cursed forest with twisted trees, ruined fortress ramparts, undead arena with bone-piles
2. CLASSIC FANTASY-ENEMIES on the scene — skeletons rising from graves, demon-imp with pitchfork, vampire silhouette, gargoyle on a parapet, zombie shambling, ghost float, dragon coiled, lich casting, undead knight, werewolf prowling, harpy in flight, ogre with club
3. HERO KNIGHT-SPRITE small on the foreground — armored knight / cloaked vampire-hunter / barbarian / mage with staff — tiny scale, mid-action (sword raised / leaping / casting / drawing crossbow)
4. GOTHIC-FLAVOR ATMOSPHERIC PROPS — flickering torches / candelabras / stained-glass windows / hanging chandeliers / iron portcullises / spiked railings / cursed roses / dragon-skull arches / dripping wax / lit braziers / cursed runes / crucifixes / cobwebbed pillars

━━━ THE GOTHIC SETTING ━━━
${gothic_setting}

━━━ THE CLASSIC ENEMY (mid-action) ━━━
${classic_enemy}

━━━ HERO ACTION (solo monster-slayer mid-attack) ━━━
${hero_action}
${propsSection}

━━━ HARD MANDATES (every render) ━━━

1. **PIXEL-ART REGISTER ONLY** — 16-bit / SNES-era. NEVER smooth illustration, NEVER 3D render, NEVER photoreal.
2. **NO IP REFERENCES** — no specific game characters / logos / franchises.
3. **NO UI ELEMENTS** — no health bars, dialogue boxes, menus.
4. **CHUNKY 16-BIT PIXEL GRID** — visible pixel grid on every surface.
5. **SATURATED GOTHIC PALETTE** — deep purples, blood reds, candle-orange highlights, deep blue-black shadows.
6. **CLASSIC-ARCADE GOTHIC** — NOT modern psychological horror, NOT jump-scare, NOT photoreal-horror. Castlevania-style monster-slaying action.

🚫 ABSOLUTE BANS:
  • NO smooth illustration / NO 3D / NO photoreal
  • NO modern psychological horror / NO creeping dread
  • NO IP references
  • NO UI / HUD / menus
  • NO sexualized characters
  • NO explicit gore (Castlevania-style is action-violence, not gore)

━━━ SCENE-WIDE PIXEL PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ CAMERA PERSPECTIVE ━━━
${sharedDNA.pixelPerspective}

━━━ COMPOSITION CRAFT — CASTLEVANIA-STYLE GOTHIC-ACTION GAMEPLAY ━━━

  • Camera: side-view / 3/4-iso / top-down (per setting)
  • GOTHIC SETTING dominant — castle / graveyard / cathedral / crypt / dragon-cave
  • CLASSIC ENEMY positioned in the scene mid-action — skeleton / vampire / gargoyle / etc.
  • HERO KNIGHT-SPRITE small on the foreground mid-action
  • Gothic-flavor props throughout — torches / candelabras / stained-glass / etc.
  • Animated particles (drifting bats / falling cobwebs / dripping wax / sparks)

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write in this exact order ━━━
[16-bit gothic-action pixel-art composition with camera (side-view / iso / top-down) per setting], [the specific gothic setting (vampire castle / graveyard / cathedral / crypt / dragon-cave)], [the classic fantasy-enemy on the scene mid-action], [hero knight-sprite small on the foreground mid-action]${gothic_props ? ', [gothic-flavor atmospheric props — torches / candelabras / stained-glass]' : ''}, [chunky 16-bit pixel grid + saturated gothic palette (deep purples / blood reds / candle-orange / blue-black shadows)]

CRITICAL — CASTLEVANIA-STYLE MONSTER-SLAYING ACTION (NOT modern psychological horror). PIXEL ART ONLY. All 4 mandatory elements present.

Output ONLY 70-95 words. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose.`;
  },

  PIXELBOT_JRPG_COMBAT: ({ slots, sharedDNA, vibeDirective }) => {
    const { open_world_setting, monster_enemy, party_engagement, spell_effect } = slots;

    const spellSection = spell_effect
      ? `\n\n━━━ SPELL / WEAPON EFFECT ACCENT ━━━\n${spell_effect}\n\nA specific visible spell/weapon effect mid-arc/mid-cast amplifying the JRPG-combat feel.`
      : '';

    return `You are writing a 16-bit RETRO PIXEL ART JRPG-COMBAT GAMEPLAY SCREENSHOT for PixelBot. The frame must read INSTANTLY as a screenshot from a classic 16-bit JRPG mid-combat — top-down OR 3/4 isometric view, hero party fighting monsters in an open-world setting, spell effects flying across the screen, monster creatures mid-attack, party mid-cast or mid-strike.

Genre lineage: Final Fantasy IV/V/VI battle scenes + Chrono Trigger active-time combat + Secret of Mana real-time combat + Seiken Densetsu 3 boss fights + Star Ocean / Tales of Phantasia / Lufia II / Y action combat.

━━━ ABSOLUTE CAMERA + COMPOSITION LOCK (NON-NEGOTIABLE) ━━━

TOP-DOWN OR 3/4 ISOMETRIC — the camera looks DOWN at the play area from above. 5 mandatory elements: tile floor + hero party (2-4) + monster + visible spell-effect + open-world setting.

🚫 NEVER side-scrolling. NEVER first-person. NEVER vertical-portrait dramatic cutscene. NEVER cosmic-void abstract.

━━━ THE OPEN-WORLD SETTING ━━━
${open_world_setting}

━━━ THE MONSTER ENEMY (mid-attack) ━━━
${monster_enemy}

━━━ THE HERO PARTY ENGAGEMENT (2-4 sprites in formation) ━━━
${party_engagement}
${spellSection}

━━━ HARD MANDATES ━━━

1. PIXEL-ART REGISTER ONLY — 16-bit / SNES-era. NEVER smooth illustration / 3D / photoreal. Crunchy individual pixels, dithered shading.
2. NO IP REFERENCES.
3. NO UI ELEMENTS (no health bars / dialogue / menus / HUDs).
4. CHUNKY 16-BIT PIXEL GRID on every surface.
5. SATURATED SNES-ERA PALETTE — emerald / royal-blue / desert-amber / sunset-orange / cave-violet / golden-glow / ruby-red / electric-cyan.

🚫 ABSOLUTE BANS: NO smooth illustration / NO 3D / NO photoreal; NO side-scrolling / first-person / vertical-portrait / cosmic-void; NO IP; NO UI; NO sexualized characters.

━━━ SCENE-WIDE PIXEL PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ CAMERA PERSPECTIVE ━━━
${sharedDNA.pixelPerspective}

━━━ COMPOSITION CRAFT — 16-BIT JRPG-COMBAT ━━━

  • TOP-DOWN OR 3/4-ISO camera
  • TILE FLOOR / GROUND dominant
  • HERO PARTY of 2-4 sprites in classic JRPG formation
  • MONSTER ENEMY positioned across the play area, mid-attack
  • VISIBLE SPELL/WEAPON EFFECT mid-arc between party and enemy
  • OPEN-WORLD SETTING giving play-area context
  • Animated particles in motion

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write in this exact order ━━━
[16-bit JRPG-combat top-down or 3/4-iso composition with tile-floor visible], [the specific open-world setting (forest / mountain / lakeshore / ruined-temple / etc.)], [the monster enemy on the tile floor mid-attack], [hero party of 2-4 chunky 16-bit sprites in formation mid-action], [visible spell/weapon effect mid-arc between party and monster]${spell_effect ? ', [specific spell-effect detail]' : ''}, [chunky 16-bit pixel grid + saturated SNES-era palette]

CRITICAL — TOP-DOWN OR 3/4-ISO (NEVER side-view / first-person / portrait). PIXEL ART ONLY. All 5 mandatory elements present including the VISIBLE SPELL/WEAPON EFFECT.

Output ONLY 70-95 words. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose.`;
  },

  PIXELBOT_BOSS_ARENA: ({ slots, sharedDNA, vibeDirective }) => {
    const { arena_setting, boss_creature, player_engagement, arena_phenomenon } = slots;

    const phenomenonSection = arena_phenomenon
      ? `\n\n━━━ ARENA PHENOMENON / EFFECTS ━━━\n${arena_phenomenon}\n\nA specific particle/effect accent amplifying the boss-fight intensity.`
      : '';

    return `You are writing a 16-bit RETRO PIXEL ART BOSS-BATTLE GAMEPLAY SCREENSHOT for PixelBot. The frame must read INSTANTLY as an in-game boss-battle moment — not concept art, not a key-art poster, not a movie still. A screenshot you would capture mid-fight in a SNES-era pixel RPG.

Genre lineage: Chrono Trigger / Final Fantasy VI / Secret of Mana / Earthbound / Link to the Past / Diablo II / Hyper Light Drifter / Hades / Octopath Traveler.

━━━ ABSOLUTE CAMERA + COMPOSITION LOCK (NON-NEGOTIABLE) ━━━

The frame uses a CLASSIC 16-BIT BOSS-BATTLE CAMERA — pick ONE per render based on the arena setting:
  - TOP-DOWN gameplay view (Hyper Light Drifter / Diablo / Bastion / Children of Morta) — looking straight down or near-straight-down at the arena floor
  - 3/4 ISOMETRIC view (Hades / Octopath / Disco Elysium / Salt and Sanctuary / Bastion) — angled-down 30-45° on the arena floor
  - SIDE-VIEW arena (Castlevania / Hollow Knight pixel / Salt and Sanctuary platforms) — flat side perspective on a horizontal arena

🚫 NEVER vertical-portrait dramatic-key-art with a towering silhouette. NEVER concept-art looking-up-at-massive-boss compositions. NEVER cinematic close-up. The player CAN see the entire fightable space.

━━━ MANDATORY ELEMENTS (every render must include all 4) ━━━

1. ARENA FLOOR clearly visible — tiled stone, mossy ground, magic-circle inscribed floor, sand-pit, lava-bridge platform, ice-floor, etc. The fightable space is EXPLICIT.
2. BOSS CREATURE/FIGURE as a SPRITE on the arena — not a towering background silhouette. The boss is an enemy-sprite IN the play-space, mid-action (rearing, roaring, swinging weapon, charging energy, wings spread).
3. PLAYER-SPRITE small on the arena floor — a single hero pixel-sprite somewhere in the frame, scaled tiny relative to the boss, positioned where the player would actually fight from. Optional 2nd companion sprite.
4. ARENA EDGES/WALLS framing the play space — pillars, broken-stones, cliff-edges, mossy walls, magma-cracks, frozen-spike-walls — visible boundaries that define the arena.

━━━ THE ARENA SETTING ━━━
${arena_setting}

━━━ THE BOSS CREATURE (mid-action sprite) ━━━
${boss_creature}

━━━ PLAYER ENGAGEMENT (hero + optional companion mid-combat) ━━━
${player_engagement}
${phenomenonSection}

━━━ HARD MANDATES (every render) ━━━

1. **PIXEL-ART REGISTER ONLY** — 16-bit / SNES-era. NEVER smooth illustration, NEVER 3D render, NEVER photoreal. Crunchy individual visible pixels, dithered shading.
2. **NO IP REFERENCES** — no specific game characters / logos / recognizable franchises.
3. **NO UI ELEMENTS** — no health bars, dialogue boxes, menus, HUDs, button prompts.
4. **CHUNKY 16-BIT PIXEL GRID** — visible pixel grid on every surface.
5. **BOSS IS A SPRITE ON THE ARENA, NOT A SILHOUETTE-IN-THE-SKY** — the boss has a definite position on the play-floor where the player would actually engage it.

🚫 ABSOLUTE BANS:
  • NO smooth illustration / NO 3D / NO photoreal
  • NO vertical-portrait key-art camera
  • NO IP references
  • NO UI / HUD / menus
  • NO sexualized content
  • NO single-sprite-key-art-poster framing

━━━ SCENE-WIDE PIXEL PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ CAMERA PERSPECTIVE ━━━
${sharedDNA.pixelPerspective}

━━━ COMPOSITION CRAFT — 16-BIT BOSS-BATTLE GAMEPLAY ━━━

  • CAMERA: top-down OR 3/4-iso OR side-view (matching the arena setting)
  • ARENA FLOOR: dominant playable surface (>40% of frame)
  • BOSS: enemy-sprite on the arena floor, mid-action — rearing / roaring / casting / charging / wings-spread
  • PLAYER: small hero-sprite in the play-space, mid-action posture toward the boss
  • COMPANIONS (optional): 1-2 supporting hero-sprites at different positions in the arena
  • ARENA EDGES: visible walls / pillars / cliffs framing the play space
  • PARTICLES: dust, sparks, magic, fire, ice-shards, debris — boss-fight intensity

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write in this exact order ━━━
[16-bit BOSS-BATTLE composition with arena-floor visible + camera-angle (top-down / iso / side-view)], [the specific arena setting (lava-bridge / castle-throne / void-arena / etc.)], [the BOSS creature as a sprite ON the arena floor, mid-action], [player-sprite small on the floor + optional companion mid-engagement with the boss], [arena edges/walls framing the play space]${arena_phenomenon ? ', [arena phenomenon — fire / lightning / magic-circle / smoke / etc.]' : ''}, [chunky 16-bit pixel grid throughout]

CRITICAL — BOSS IS A SPRITE ON THE ARENA FLOOR (not a towering silhouette). PIXEL ART ONLY. All 4 mandatory elements present.

Output ONLY 70-95 words. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose.`;
  },

  PIXELBOT_SIDE_SCROLLER_WORLD: ({ slots, sharedDNA, vibeDirective }) => {
    const { biome_setting, platform_geography, hero_action, atmospheric_phenomenon } = slots;

    const phenomenonSection = atmospheric_phenomenon
      ? `\n\n━━━ ATMOSPHERIC PHENOMENON / PARALLAX-MAGIC ACCENT ━━━\n${atmospheric_phenomenon}\n\nA specific atmospheric detail amplifying the parallax-layer magic.`
      : '';

    return `You are writing a 16-bit RETRO PIXEL ART SIDE-SCROLLING PLATFORMER GAMEPLAY SCREENSHOT for PixelBot. The frame must read INSTANTLY as an in-game side-scroller moment — the player is mid-stride on a platform, parallax layers receding behind. NOT concept art. NOT a key-art poster. NOT a vista painting. A screenshot from a SNES-era 2D platformer.

Genre lineage: Castlevania IV / Super Metroid / Donkey Kong Country / Mega Man X / Owlboy / Hollow Knight pixel / Dead Cells / Ori / Celeste / Trine / Salt and Sanctuary.

━━━ ABSOLUTE CAMERA + COMPOSITION LOCK (NON-NEGOTIABLE) ━━━

The camera is HORIZONTAL SIDE-VIEW — character-perspective sliced FLAT across the world. Look at the world from the SIDE, NOT from above, NOT from in front, NOT from behind. The frame is read LEFT-TO-RIGHT.

🚫 NEVER:
  - Top-down view (no looking down at floor)
  - 3/4 isometric (no angled-down floor)
  - First-person view (no looking through hero's eyes)
  - Frontal 4th-wall view (no looking AT a building facade or hall interior from the door)
  - Vertical-portrait composition (no looming-tower / vertical-chasm / staircase-down)
  - Vista paintings (no atmospheric scenes without playable platforms)

━━━ MANDATORY ELEMENTS (every render must include all 5) ━━━

1. HORIZONTAL FRAME — the eye reads left-to-right. The "playable corridor" extends horizontally.
2. FOREGROUND PLATFORMING SURFACE — clear ground / ledge / platform / floor running across the bottom-third of the frame. The terrain the player CAN STAND ON.
3. PLAYER-SPRITE on the foreground platforming surface — a single hero sprite (small) standing or mid-stride. Visible silhouette: cape / sword / cloak / hood / staff. Tiny scale relative to the world.
4. MIDDLE PARALLAX LAYER — terrain receding behind the foreground platform. Different depth, slightly desaturated, more silhouetted. Additional platforms / hills / structures / biome-trees.
5. FAR BACKDROP — sky / horizon / distant peaks / ocean / cosmic-void / cavern-wall. Furthest layer with atmospheric haze.

━━━ THE BIOME / SETTING ━━━
${biome_setting}

━━━ THE FOREGROUND PLATFORM GEOGRAPHY ━━━
${platform_geography}

━━━ HERO + ENEMY ACTION (mid-stride / mid-combat) ━━━
${hero_action}

The hero player-sprite is on the foreground platform mid-action. Often 1-2 enemies are also present — patrolling, charging, or hovering — making the moment feel like ACTIVE gameplay, not a static vista.
${phenomenonSection}

━━━ HARD MANDATES (every render) ━━━

1. **PIXEL-ART REGISTER ONLY** — 16-bit / SNES-era. NEVER smooth illustration, NEVER 3D render, NEVER photoreal. Crunchy individual visible pixels, dithered shading.
2. **NO IP REFERENCES** — no specific game characters / logos / recognizable franchises.
3. **NO UI ELEMENTS** — no health bars, dialogue boxes, menus, HUDs, button prompts.
4. **CHUNKY 16-BIT PIXEL GRID** — visible pixel grid on every surface. Platform tiles clearly tiled.
5. **HORIZONTAL SIDE-VIEW MANDATORY** — NEVER top-down / iso / first-person / frontal / vertical-portrait.

🚫 ABSOLUTE BANS:
  • NO smooth illustration / NO 3D / NO photoreal — pixel art ONLY
  • NO top-down / iso / first-person / frontal / vertical-portrait camera
  • NO IP references
  • NO UI / HUD / menus
  • NO sexualized content
  • NO modern setting (unless the path's biome explicitly allows)

━━━ SCENE-WIDE PIXEL PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ CAMERA PERSPECTIVE ━━━
${sharedDNA.pixelPerspective}

━━━ COMPOSITION CRAFT — HORIZONTAL SIDE-SCROLLER PLATFORMER ━━━

  • HORIZONTAL SIDE-VIEW camera — eye reads left-to-right
  • FOREGROUND: platformable surface running across the bottom-third (stone-tile / ledge / branch / walkway)
  • PLAYER-SPRITE on the platform mid-stride / mid-action, small relative to the world
  • 1-2 ENEMIES on the platform or hovering — patrolling, charging, attacking
  • MIDGROUND PARALLAX: terrain at different depth (more platforms / hills / structures), slightly desaturated
  • BACKGROUND: sky / horizon / distant peaks / cosmic-void with atmospheric haze
  • DEPTH: clear three-tier parallax separation
  • Particles in motion (drifting petals / pollen / snow / embers / rain / mist)

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write in this exact order ━━━
[HORIZONTAL SIDE-VIEW pixel-art side-scroller composition with three-tier parallax], [the biome / setting — specific style of biome (lava-castle / ice-cavern / forest-canopy / etc.)], [the foreground platform geography — specific platformable terrain], [hero pixel-sprite + 1-2 enemies mid-action on the foreground platform], [middle parallax layer of terrain at different depth, slightly desaturated], [far backdrop sky / horizon / atmospheric distance]${atmospheric_phenomenon ? ', [atmospheric particles in motion]' : ''}, [chunky 16-bit pixel grid throughout]

CRITICAL — HORIZONTAL SIDE-VIEW (NEVER top-down / iso / first-person / frontal). PIXEL ART ONLY. All 5 mandatory elements present.

Output ONLY 70-95 words. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose.`;
  },

  PIXELBOT_DUNGEON_DEPTH: ({ slots, sharedDNA, vibeDirective }) => {
    const { dungeon_chamber, dungeon_biome, hero_encounter, loot_detail } = slots;

    const lootSection = loot_detail
      ? `\n\n━━━ DIABLO-STYLE LOOT / DUNGEON PROPS ACCENT ━━━\n${loot_detail}\n\nA specific loot or dungeon-prop detail amplifying the dungeon-crawler feel.`
      : '';

    return `You are writing a 16-bit RETRO PIXEL ART DIABLO-STYLE TOP-DOWN DUNGEON-CRAWLER GAMEPLAY SCREENSHOT for PixelBot. The frame must read INSTANTLY as a level from a classic Diablo-style top-down dungeon-crawler — looking DOWN at the dungeon floor from above, hero adventurer pixel-sprite small in the center, treasure chambers, ambush corridors, monster encounters, loot piles.

Genre lineage: Diablo (and Diablo II) pixel-style + Hades chamber-reveals (top-down) + Hyper Light Drifter (top-down ruins) + Children of Morta (top-down) + Death's Gambit + Moonlighter (top-down dungeon) + Eitr + Heroes of Hammerwatch (top-down dungeon).

━━━ ABSOLUTE CAMERA + COMPOSITION LOCK (NON-NEGOTIABLE) ━━━

TOP-DOWN OR NEAR-TOP-DOWN 3/4 ISOMETRIC — the camera looks DOWN at the dungeon floor. The viewer sees:
  - The TILE FLOOR clearly (stone tiles, cracked-flagstone, mossy-stone, bone-tile, magma-cracked, blood-stained)
  - HERO ADVENTURER pixel-sprite from ABOVE-AND-BEHIND — small armored figure with sword/staff/bow, walking the dungeon floor
  - WALLS / COLUMNS / CORRIDOR EDGES framing the play space
  - DUNGEON PROPS scattered on the floor

🚫 NEVER side-scrolling (foreground-platform horizontal layout). NEVER first-person. NEVER vertical-portrait dramatic key-art. NEVER cinematic close-up of single boss.

━━━ MANDATORY ELEMENTS (every render must include all 4) ━━━

1. TOP-DOWN OR 3/4-ISO TILE FLOOR clearly visible — the play-floor is the dominant element
2. HERO ADVENTURER pixel-sprite small on the floor — armored knight, robed mage, hooded ranger, dual-wielding rogue, plate-armored paladin, leather-clad assassin — mid-stride or mid-action
3. MONSTER ENCOUNTER OR DUNGEON THREAT in the chamber — patrolling skeleton, charging zombie, bat-cluster, lich casting, demon-imp, slime-pile, undead-knight, spider-queen, mimic-chest. Mid-action.
4. DIABLO-STYLE LOOT / DUNGEON PROPS — treasure chest with overflowing gold, scattered coins / gems, glowing weapon on the floor, runic-altar, dripping candelabra, blood-pool, skeletal remains, bone-piles, urns, magic-rune glow on tiles

━━━ THE DUNGEON CHAMBER ━━━
${dungeon_chamber}

━━━ THE DUNGEON BIOME / VISUAL REGISTER ━━━
${dungeon_biome}

━━━ THE HERO + MONSTER ENCOUNTER (mid-action) ━━━
${hero_encounter}

The hero adventurer + monster are BOTH visible in the same chamber, mid-action — combat, casting, sneak-attack, charge, ambush. NEVER static portraits.
${lootSection}

━━━ HARD MANDATES (every render) ━━━

1. **PIXEL-ART REGISTER ONLY** — 16-bit / SNES-era / Diablo-pixel. NEVER smooth illustration, NEVER 3D render, NEVER photoreal. Crunchy individual visible pixels, dithered shading, limited dark gothic palette.
2. **NO IP REFERENCES** — no specific game characters / logos / recognizable franchises.
3. **NO UI ELEMENTS** — no health bars, dialogue boxes, menus, HUDs, button prompts, mini-maps.
4. **CHUNKY 16-BIT PIXEL GRID** — visible pixel grid on every surface.
5. **SATURATED DARK GOTHIC PALETTE** — deep stone-grays / blood-reds / candle-orange / sickly-green poison / magic-violet / blue-black shadow.

🚫 ABSOLUTE BANS:
  • NO smooth illustration / NO 3D / NO photoreal — pixel art ONLY
  • NO side-scrolling / NO first-person / NO portrait-key-art camera
  • NO IP references
  • NO UI / HUD / menus
  • NO sexualized content
  • NO modern setting

━━━ SCENE-WIDE PIXEL PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ CAMERA PERSPECTIVE ━━━
${sharedDNA.pixelPerspective}

━━━ COMPOSITION CRAFT — TOP-DOWN DUNGEON-CRAWLER GAMEPLAY ━━━

  • TOP-DOWN OR 3/4-ISO camera — viewer looks DOWN at the play floor
  • TILE FLOOR is the dominant surface (>40% of frame)
  • HERO adventurer pixel-sprite at lower-center mid-stride
  • MONSTER encounter in mid-action across the chamber from hero
  • LOOT / props scattered on the tile floor — chests, coins, bone-piles, rune-circles, candelabras
  • WALLS / COLUMNS framing the chamber edges
  • Animated particles (dust motes / dripping water / drifting smoke / glow-spore / firefly-glow / breath-mist)

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write in this exact order ━━━
[TOP-DOWN or 3/4-ISO Diablo-style dungeon chamber framed with tile floor as dominant surface], [the specific dungeon chamber (treasure room / altar / corridor / crypt / etc.) + visual register of the chamber], [the dungeon biome — tile material / wall texture / atmospheric quality (stone-tile / lava-cracked / bone-tile / icy-crystal / etc.)], [HERO adventurer pixel-sprite + monster encounter mid-action — both visible in the chamber], [Diablo-style loot/props on the tile floor — chests / coins / glowing weapons / bone-piles / rune-circles]${loot_detail ? ', [specific loot detail accent]' : ''}, [chunky 16-bit pixel grid throughout + saturated dark gothic palette]

CRITICAL — TOP-DOWN OR 3/4-ISO CAMERA (NEVER side-view). PIXEL ART ONLY. All 4 mandatory elements: tile-floor + hero + monster + loot.

Output ONLY 65-90 words. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose.`;
  },

  PIXELBOT_COZY_RPG_TOWN: ({ slots, sharedDNA, vibeDirective }) => {
    const { town_locale, town_biome, npc_life, atmospheric_phenomenon } = slots;

    const phenomenonSection = atmospheric_phenomenon
      ? `\n\n━━━ ATMOSPHERIC MAGIC ━━━\n${atmospheric_phenomenon}\n\nA specific atmospheric detail amplifying the cozy-town magic (NOT competing with the town).`
      : '';

    return `You are a pixel-art game-art director writing a COZY RPG TOWN scene for PixelBot. Genre lineage: Stardew Valley + Octopath Traveler HD-2D + Sea of Stars + Eastward + Children of Morta town hubs. The kind of cozy pixel-RPG town the player returns to between adventures — half-timbered houses, warm tavern light, market-stalls, NPCs going about their day, cobblestone paths winding between shops.

━━━ THE TOWN LOCALE ━━━
${town_locale}

━━━ THE TOWN BIOME / CHARACTER ━━━
${town_biome}

━━━ INHABITED LIFE — NPCS AND DAILY-LIFE DETAIL ━━━
${npc_life}

This town is ALIVE. Signs of inhabitance everywhere: NPCs in motion, market vendors, children, animals, smoke from chimneys, lit windows, drying laundry, signs above doors, fountains, lanterns.
${phenomenonSection}

━━━ HARD MANDATES (every render) ━━━

1. **PIXEL-ART REGISTER ONLY** — 16-bit / SNES-era / HD-2D pixel art. NEVER smooth illustration, NEVER 3D render, NEVER photoreal. Crunchy individual visible pixels, dithered shading, limited palette.
2. **NO IP REFERENCES** — no specific game characters / logos / recognizable franchises. The bot's identity IS the medium + the genre.
3. **NO UI ELEMENTS** — no health bars, dialogue boxes, menus, HUDs, button prompts, mini-maps, text-overlays. Pure scene only.
4. **NORTH STAR** — every render is "a screenshot from a game I desperately wish existed." Frame it as a cinematic-pixel-art moment, not a casual screenshot.
5. **INHABITED FEEL** — the town reads ALIVE. NPC movement implied, signs of daily life everywhere, never an empty ghost-town.

🚫 ABSOLUTE BANS:
  • NO smooth illustration / NO 3D / NO photoreal — pixel art ONLY
  • NO IP references (no Mario / Pokemon / Zelda / specific characters)
  • NO UI / HUD / dialogue boxes / health bars / button prompts / menus
  • NO modern setting — fantasy-RPG era only
  • NO empty / desolate / abandoned — the town is INHABITED
  • NO single-NPC closeup — wide cozy-scene framing
  • NO sci-fi / cyberpunk / horror — those are separate paths
  • NO sexualized / inappropriate content

━━━ SCENE-WIDE PIXEL PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ CAMERA PERSPECTIVE ━━━
${sharedDNA.pixelPerspective}

━━━ COMPOSITION CRAFT — INHABITED COZY TOWN HUB ━━━

  • FOREGROUND: cobblestone path / wooden boardwalk / market-stall edge with inhabited detail
  • MIDGROUND: the focal town buildings — half-timbered shops, tavern with glowing window, market square, fountain, signs above doors
  • BACKGROUND: more buildings receding with depth, rooftops, smoke-curl from chimneys, distant town features (church spire / castle tower / mountain backdrop)
  • DEPTH: HD-2D-style multi-tier depth — sharp foreground / sharp midground / atmospheric distance
  • LIGHTING: warm tavern-window glow in middle distance, lit lanterns, signs of inhabitance from light alone
  • LIFE: NPCs in motion, market vendors, children, animals, smoke, laundry, signs — the town BREATHES

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write in this exact order ━━━
[the SPECIFIC town locale (tavern street / market square / cottage row / etc.) framed in cinematic-pixel-art composition], [the town biome character (half-timbered European / coastal / mountain / desert oasis / forest village / etc.)], [the INHABITED LIFE — NPCs, market vendors, children, animals, signs of daily life], [warm tavern-window glow + lanterns + smoke + signs creating the cozy-inhabited atmosphere]${atmospheric_phenomenon ? ', [atmospheric phenomenon supporting the cozy-magic feel]' : ''}, [HD-2D-style multi-tier depth — Stardew Valley + Octopath Traveler + Sea of Stars register], [16-bit pixel-art register with crunchy individual visible pixels and dithered shading]

CRITICAL — PIXEL ART ONLY (NEVER smooth illustration). The town is INHABITED. Cozy-RPG-town key-art quality — Octopath HD-2D depth, warm tavern lights glowing in middle distance, animated NPCs and signs of life everywhere.

Output ONLY 65-90 words. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose.`;
  },

  PIXELBOT_COZY_FARMING_LIFE_SIM: ({ slots, sharedDNA, vibeDirective }) => {
    const { farm_locale, farm_biome, farmer_villager_life, cozy_phenomenon } = slots;

    const phenomenonSection = cozy_phenomenon
      ? `\n\n━━━ COZY ATMOSPHERIC MAGIC ━━━\n${cozy_phenomenon}\n\nA specific atmospheric detail amplifying the warm-fuzzy life-sim register (NOT competing with the scene).`
      : '';

    return `You are a pixel-art game-art director writing a COZY FARMING / LIFE-SIM scene for PixelBot. Genre lineage: Stardew Valley + Harvest Moon + Animal Crossing pixel-spinoff + My Time at Sandrock + Spiritfarer + Ooblets + Coffee Talk + Story of Seasons + Graveyard Keeper pixel. Tiny pixel farms with crops in neat rows, henhouses with chickens, pixel-cats curled on porches, beachside fish-shacks with smoke curling, summer-festival town squares with hanging lanterns, autumn-harvest barns with pumpkins stacked, spring-rain greenhouses with sprouts, winter-cabin interiors with fire crackling. WARM, SAFE, INVITING — the kind of cozy pixel-life-sim moment that triggers immediate "I want to play this for 200 hours" feeling.

━━━ THE FARM LOCALE ━━━
${farm_locale}

━━━ THE FARM BIOME — SEASON / TIME / ATMOSPHERE ━━━
${farm_biome}

━━━ INHABITED LIFE — SOLO FARMER + AMBIENT VILLAGERS / ANIMALS ━━━
${farmer_villager_life}

This world is ALIVE and INHABITED — a tiny farmer-protagonist mid-cozy-task on the foreground OR an ambient villager moment in the scene, surrounded by signs of daily farm-life. Chickens pecking, cats curled, smoke curling from chimneys, crops swaying, lanterns lit.
${phenomenonSection}

━━━ HARD MANDATES (every render) ━━━

1. **PIXEL-ART REGISTER ONLY** — 16-bit / SNES-era / HD-2D pixel art. NEVER smooth illustration, NEVER 3D render, NEVER photoreal. Crunchy individual visible pixels, dithered shading, limited palette.
2. **NO IP REFERENCES** — no specific game characters / logos / recognizable franchises. The bot's identity IS the medium + the genre.
3. **NO UI ELEMENTS** — no health bars, dialogue boxes, menus, HUDs, button prompts, mini-maps, text-overlays. Pure scene only.
4. **NORTH STAR** — every render is "a screenshot from a cozy farming life-sim I desperately wish existed." Frame it as cinematic-pixel-art key-art, not a casual screenshot.
5. **WARM-COZY REGISTER** — the scene is SAFE, INVITING, gentle. Warm sun-glow, soft palette, animated life. Never grim, never dark, never combat.
6. **INHABITED FEEL** — solo farmer OR ambient villager IS in the scene, plus animals / crops / signs of daily life. Never an empty ghost-farm.

🚫 ABSOLUTE BANS:
  • NO smooth illustration / NO 3D / NO photoreal — pixel art ONLY
  • NO IP references (no Stardew NPCs / no Animal Crossing villagers / etc.)
  • NO UI / HUD / dialogue boxes / health bars / button prompts / menus
  • NO modern industrial / urban — pastoral / village-scale only
  • NO empty / desolate / abandoned — the farm is INHABITED
  • NO sci-fi / cyberpunk / horror / combat — those are separate paths
  • NO sexualized / inappropriate content
  • NO party-combat (life-sim ambient, not adventure-party)

━━━ SCENE-WIDE PIXEL PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ CAMERA PERSPECTIVE ━━━
${sharedDNA.pixelPerspective}

━━━ COMPOSITION CRAFT — INHABITED COZY FARM / LIFE-SIM ━━━

  • FOREGROUND: cobblestone / dirt-path / wooden-porch / crop-row edge with inhabited detail
  • MIDGROUND: the focal farm locale — barn, henhouse, greenhouse, cottage, market-stall, fish-shack — with the solo farmer or villager mid-cozy-task
  • BACKGROUND: rolling pastures, distant village rooftops, mountain backdrop, treeline, smoke curling from chimneys
  • DEPTH: HD-2D-style multi-tier depth — sharp foreground / sharp midground / atmospheric distance
  • LIGHTING: warm sun-glow OR lit-window lantern-glow in middle distance, generous, inviting
  • LIFE: solo farmer-or-villager + animals + crops + lanterns + smoke + signs — the scene BREATHES warm-fuzzy life

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write in this exact order ━━━
[the SPECIFIC farm locale (crop-row / barn / henhouse / greenhouse / beachside-shack / festival-square / cottage-porch / etc.) framed in cinematic-pixel-art composition], [the season + time + atmospheric biome (spring-morning rain / summer-noon golden / autumn-twilight orange / winter-night fireplace / first-frost dawn / festival-evening / etc.)], [the INHABITED LIFE — solo farmer mid-cozy-task OR ambient villager moment + animals + signs of daily farm-life]${cozy_phenomenon ? ', [cozy atmospheric phenomenon supporting the warm-fuzzy feel]' : ''}, [warm sun-glow OR lantern-glow + smoke + animated crops creating the cozy-inhabited atmosphere], [HD-2D-style multi-tier depth — Stardew Valley + Harvest Moon + Spiritfarer register], [16-bit pixel-art register with crunchy individual visible pixels and dithered shading]

CRITICAL — PIXEL ART ONLY (NEVER smooth illustration). The scene is INHABITED and COZY. Cozy-life-sim key-art quality — warm sun-glow, animated crops + animals + smoke, generous warm-fuzzy register, "I want to play this for 200 hours" feel.

Output ONLY 65-90 words. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose.`;
  },

  PIXELBOT_PIXEL_SCI_FI_ACTION: ({ slots, sharedDNA, vibeDirective }) => {
    const { sci_fi_setting, sci_fi_enemy, hero_action, sci_fi_props } = slots;

    const propsSection = sci_fi_props
      ? `\n\n━━━ SCI-FI FLAVOR PROPS ━━━\n${sci_fi_props}\n\nA specific atmospheric prop reinforcing the sci-fi-action register (NOT competing with the action).`
      : '';

    return `You are a pixel-art game-art director writing a 16-BIT SCI-FI ACTION GAMEPLAY SCREENSHOT for PixelBot. Genre lineage: Contra III: The Alien Wars + Mega Man X + Super Metroid + Blaster Master + Turrican II + Gradius + R-Type + Salamander + Gunstar Heroes + Axelay + Cybernator + Star Soldier + Star Fox pixel. Run-and-gun marine on alien-jungle platforms, mech-pilot in robot factory, starfighter dodging asteroids, lone-wanderer in post-apocalyptic ruins blasting drones. Saturated retro-arcade sci-fi action. NOT cyberpunk-noir. NOT modern indie-illustrated. CLASSIC arcade sci-fi action.

━━━ THE SCI-FI SETTING ━━━
${sci_fi_setting}

━━━ SCI-FI ENEMY MID-ACTION ━━━
${sci_fi_enemy}

━━━ HERO MID-ACTION (solo run-and-gun) ━━━
${hero_action}
${propsSection}

━━━ HARD MANDATES (every render) ━━━

1. **PIXEL-ART REGISTER ONLY** — 16-bit / SNES-era pixel art. NEVER smooth illustration, NEVER 3D render, NEVER photoreal. Crunchy individual visible pixels, dithered shading, saturated retro sci-fi palette.
2. **CAMERA LOCK PER SETTING** — pick ONE per render based on the setting:
   • HORIZONTAL SIDE-VIEW (Contra / Mega Man / Metroid / Turrican) — character flat across the world, foreground platform, parallax sci-fi backdrop
   • HORIZONTAL SIDE-SCROLLING SPACE-SHOOTER (Gradius / R-Type / Salamander / Axelay) — hero spaceship left, enemies attacking from right, asteroid/nebula backdrop
   • TOP-DOWN VERTICAL SCROLLER (1942 / Star Soldier / Blaster Master overworld) — hero ship/tank/marine at bottom, enemies from top
   • 3/4 ISOMETRIC SCI-FI INTERIOR (Blaster Master interior / station corridors) — mech-bay / starship-corridor / laboratory
3. **NEVER first-person, NEVER vertical-portrait static-vista, NEVER cyberpunk-neon-streets, NEVER concept-art portrait composition**
4. **NO IP REFERENCES** — no specific game characters / logos / recognizable franchises.
5. **NO UI ELEMENTS** — no health bars, score-display, dialogue boxes, menus, HUDs, button prompts.
6. **NORTH STAR** — every render is "a screenshot from a Contra / Mega Man / Metroid / Blaster Master / Star Fox-style game I'd play right now." Cinematic-arcade-action frame.
7. **HERO + ENEMY + SETTING + ATMOSPHERIC FLAVOR** — all four must be readable in the frame. Hero is small relative to scene (sprite-scale), mid-action. Enemy is mid-action too — never both static.
8. **SOLO HERO** — single run-and-gun protagonist (Contra-style). 1 sidekick acceptable but never party-combat.

🚫 ABSOLUTE BANS:
  • NO smooth illustration / NO 3D / NO photoreal — pixel art ONLY
  • NO IP references (no Master Chief / no Samus / no Mega Man / no specific franchise)
  • NO UI / HUD / health bars / score / dialogue boxes / menus
  • NO cyberpunk-noir / NO modern-indie / NO concept-art portrait
  • NO first-person / NO vertical-portrait static-vista
  • NO sexualized / inappropriate content
  • NO party-combat (solo run-and-gun is genre-correct)
  • NO horror / cozy / fantasy — those are separate paths

━━━ SCENE-WIDE PIXEL PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING / ENERGY VIBE ━━━
${sharedDNA.colorPalette}

━━━ COMPOSITION CRAFT — RETRO SCI-FI ACTION ━━━

  • Camera matches the setting (side-view / horizontal-shooter / top-down / 3/4-iso)
  • FOREGROUND: action floor — platform, ship's-cockpit-edge, mech-bay floor, asteroid-foreground
  • MIDGROUND: hero sprite small mid-action + enemy sprite mid-action
  • BACKGROUND: parallax sci-fi backdrop (alien jungle, nebula, robot-factory interior, asteroid-field)
  • DEPTH: multi-tier parallax — sharp foreground / sharp midground / atmospheric distance
  • LIGHTING: electric-blue energy / hot-magenta plasma / acid-green toxic / metallic-orange explosions
  • PARTICLES: plasma-bolt trails / muzzle-flashes / laser-beams / explosion-shrapnel / energy-arcs / sparks

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write in this exact order ━━━
[the SPECIFIC sci-fi setting (alien jungle platform / robot factory / space-station corridor / asteroid-field / mech-bay / post-apoc ruins / starfighter-cockpit / lunar surface / etc.) framed in cinematic-retro-arcade composition], [the SPECIFIC sci-fi enemy mid-action (alien with claws lunging / robot-soldier firing / mech-walker stomping / drone-swarm / plasma-turret rotating / xenobeast charging / etc.)], [the SOLO HERO sprite small on the action floor mid-action (space-marine firing rifle / mech-pilot mid-step / starfighter banking / jetpack-soldier leaping / etc.)]${sci_fi_props ? ', [sci-fi flavor props supporting the action (pulsing consoles / reactor cores / cables / catwalks / energy-shields / plasma-pillars / etc.)]' : ''}, [electric-energy lighting + plasma-bolts + muzzle-flashes + sparks creating the retro-arcade-action atmosphere], [parallax multi-tier depth — Contra / Mega Man / Metroid / Gradius register], [16-bit pixel-art register with crunchy individual visible pixels, dithered shading, saturated retro sci-fi palette]

CRITICAL — PIXEL ART ONLY (NEVER smooth illustration). The scene is RETRO-ARCADE-ACTION. Sci-fi-action key-art quality — solo run-and-gun hero, enemy mid-action, electric energy lighting, "I want to play this Contra-clone right now" feel.

Output ONLY 70-95 words. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose.`;
  },

  PIXELBOT_CLASSIC_JRPG: ({ slots, sharedDNA, vibeDirective }) => {
    const { jrpg_locale, party_action, npc_or_enemy_life, jrpg_props } = slots;

    const propsSection = jrpg_props
      ? `\n\n━━━ CLASSIC JRPG PROPS ━━━\n${jrpg_props}\n\nA specific classic-JRPG prop reinforcing the SNES-era RPG register (NOT competing with the hero / NPCs).`
      : '';

    return `You are a pixel-art game-art director writing a 16-BIT CLASSIC JRPG GAMEPLAY SCREENSHOT for PixelBot. Genre lineage: Zelda: A Link to the Past + Link's Awakening + Final Fantasy IV / V / VI + Chrono Trigger + Secret of Mana + Seiken Densetsu 3 + Terranigma + Earthbound / Mother 2 + Illusion of Gaia + Soul Blazer + Lufia II + Dragon Quest VI + Breath of Fire + Suikoden + Lunar: Silver Star Story + Tales of Phantasia + Live A Live. Tile-based world rendered from a 3-quarter top-down camera, hero party walking through, NPCs at named locations, characteristic biome.

━━━ THE JRPG LOCALE ━━━
${jrpg_locale}

━━━ HERO PARTY MID-MOMENT ━━━
${party_action}

━━━ NPC LIFE OR ENEMY CREATURE IN THE SCENE ━━━
${npc_or_enemy_life}
${propsSection}

━━━ HARD MANDATES (every render) ━━━

1. **PIXEL-ART REGISTER ONLY** — 16-bit / SNES-era pixel art. NEVER smooth illustration, NEVER 3D render, NEVER photoreal. Crunchy individual visible pixels, dithered shading, saturated SNES-era palette.
2. **CAMERA LOCK — 3/4 TOP-DOWN** — looking down at the world from a slight angle, classic SNES-RPG perspective. The viewer sees the tile-based ground clearly + hero party-sprite from above-and-behind + buildings/trees in front-facing isometric-ish projection. Reference: Zelda LttP / Chrono Trigger / FF6 / Secret of Mana / Earthbound. NEVER side-scrolling, NEVER first-person, NEVER straight-down god's-eye, NEVER pure 3D-iso-grid.
3. **TILE-BASED WORLD VISIBLE** — clear tile-grid floor (grass / stone-path / cobble / sand / wooden-floor / cave-stone / water). The terrain reads as JRPG-overworld or town-hub or dungeon-floor with discrete tiles.
4. **HERO PARTY-SPRITE on the world** — single hero or 2-4 party members walking the tile-map, tiny scale, mid-stride. Simple SNES-era forms (kid in green tunic with sword, mage in robe with staff, warrior in armor with shield, princess in gown).
5. **NO IP REFERENCES** — no Link, no Cloud, no Crono, no specific game characters.
6. **NO UI ELEMENTS** — no health bars, dialogue boxes, menus, HUDs, mini-map.
7. **NORTH STAR** — every render is "a screenshot from a SNES-era classic top-down JRPG I'd play right now." Cinematic-pixel-art tile-based moment.

🚫 ABSOLUTE BANS:
  • NO smooth illustration / NO 3D / NO photoreal — pixel art ONLY
  • NO IP references (no Link / no Cloud / no Crono / no Pokemon / no Mario)
  • NO UI / HUD / dialogue boxes / health bars / mini-map
  • NO side-scrolling / first-person / straight-down / 3D-iso-grid
  • NO modern / contemporary setting — fantasy-RPG era only
  • NO sci-fi / horror / cozy-farming — those are separate paths
  • NO empty / desolate — the world is INHABITED (NPC or enemy)
  • NO sexualized / inappropriate content

━━━ SCENE-WIDE PIXEL PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ COMPOSITION CRAFT — CLASSIC SNES-JRPG 3/4 TOP-DOWN ━━━

  • CAMERA: 3-quarter top-down (Zelda LttP / Chrono Trigger / FF6)
  • FOREGROUND: tile-grid floor edge (grass / stone-path / cobble / sand / wooden-floor / cave-stone / water tiles)
  • MIDGROUND: hero party-sprite small mid-stride on the tile-grid + NPC life or enemy creature
  • BACKGROUND: characteristic biome backdrop (forest canopy / mountain pass / castle wall / dungeon arch / town gates / sky-temple edge)
  • DEPTH: multi-tier — sharp foreground tiles / mid characters / atmospheric distance
  • LIGHTING: warm sun-glow OR torch-glow OR moonlit OR magical-rune-glow per biome
  • ATMOSPHERIC PARTICLES: drifting petals / dust motes / firefly-glow / dripping water / falling leaves / sparkles

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write in this exact order ━━━
[the SPECIFIC JRPG locale (overworld grass-plain / dense forest / mountain pass / town hub / castle throne-room / dungeon-crypt / sacred grove / volcanic cave / etc.) framed in 3/4 top-down camera composition], [the HERO PARTY-SPRITE small mid-stride on the tile-grid (single hero OR 2-4 party members walking / examining / mid-cutscene)], [the NPC LIFE OR ENEMY CREATURE in the scene (vendor / villager / priest / soldier OR slime / bat / skeleton / orc / goblin / harpy mid-patrol)]${jrpg_props ? ', [classic JRPG props supporting the world (treasure chest / signpost / pot / statue / fountain / altar / glowing-rune-floor / etc.)]' : ''}, [biome-appropriate lighting + animated particles creating the SNES-JRPG atmosphere], [multi-tier depth — Zelda LttP / Chrono Trigger / FF6 / Secret of Mana register], [16-bit pixel-art register with chunky tile-grid floor, sprite-art hero / NPCs, dithered shading, saturated SNES-era palette]

CRITICAL — PIXEL ART ONLY (NEVER smooth illustration). The scene is CLASSIC SNES-JRPG. 3/4 top-down camera locked. Hero party-sprite + NPC/enemy + tile-grid + biome — "I want to play this SNES RPG right now" feel.

Output ONLY 70-95 words. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose.`;
  },

  PIXELBOT_EPIC_VISTA: ({ slots, sharedDNA, vibeDirective }) => {
    const { vista_subject, sky_or_backdrop, lighting_atmosphere, parallax_silhouette } = slots;

    const silhouetteSection = parallax_silhouette
      ? `\n\n━━━ OPTIONAL PARALLAX SILHOUETTE (tiny scale, never the focal subject) ━━━\n${parallax_silhouette}\n\nA single tiny silhouette woven into one of the parallax layers — NOT the focal subject, the vista is still the hero. Scale: small enough that you'd miss it on a casual scroll-past.`
      : '';

    return `You are a pixel-art game-art director writing a 16-BIT SIDE-SCROLLING PARALLAX-VISTA GAMEPLAY SCREENSHOT for PixelBot. Genre lineage: Final Fantasy VI airship-flyover + Chrono Trigger world-map + Lufia II overworld + Secret of Mana world-vistas + Terranigma overworld + Castlevania IV background-vistas + Donkey Kong Country background-art + Sonic 2/3 horizon backgrounds. The frame is a wide horizontal landscape rendered as a 16-bit-game-engine side-scrolling parallax background. The viewer reads LEFT-TO-RIGHT. NOT an atmospheric painting. NOT a concept-art wallpaper. A SCREENSHOT FROM A 16-BIT GAME with chunky tile-edge mountains, hard-edge horizons, layered parallax-scrolling depth.

━━━ THE VISTA SUBJECT (the focal landform) ━━━
${vista_subject}

━━━ THE SKY / BACKDROP LAYER (far back) ━━━
${sky_or_backdrop}

━━━ LIGHTING + ATMOSPHERIC PARTICLES ━━━
${lighting_atmosphere}
${silhouetteSection}

━━━ HARD MANDATES (every render) ━━━

1. **PIXEL-ART REGISTER ONLY** — 16-bit / SNES-era pixel art. NEVER smooth illustration, NEVER 3D render, NEVER photoreal, NEVER painterly atmospheric.
2. **CAMERA LOCK — HORIZONTAL SIDE-SCROLLING PARALLAX** — landscape composition reads LEFT-TO-RIGHT, like a side-scrolling level background. NEVER atmospheric painting / concept-art / portrait / vertical-vista / first-person.
3. **4 DISTINCT PARALLAX LAYERS with HARD pixel-edges between them:**
   • FOREGROUND PARALLAX LAYER (closest) — chunky tile-edge terrain in the bottom third (rocky cliff edge, sand-dune ridge, snow-tile foreground, jungle-vine canopy, stone outcrop, cherry-blossom tree, palm-cluster, ice-shelf). Hard pixel-edges, dithered shading, distinct silhouette.
   • MIDDLE PARALLAX LAYER — middle-distance terrain at different depth (rolling hills, forested hills, distant village, ruined temple, smaller mountain peaks, cliff face, treetop layer). Slightly desaturated, tile-edge silhouette.
   • DISTANT PARALLAX LAYER — far peaks, distant horizon-mountains, sea-horizon, fjord-cliff-line, alien-planet-rim, megacity-skyline-silhouette. Cool color shift, tile-edge silhouette, atmospheric-depth haze applied as DITHERED PIXEL bands (not smooth).
   • FAR BACKDROP — sky / sunset gradient (rendered as DITHERED color bands, not smooth) / starfield / aurora / cloud-bank with chunky-edge clouds / planet rising / sun-disc-on-horizon. Hard pixel-edge horizon.
4. **NO CHARACTER as the focal subject** — the vista IS the hero. A single tiny silhouette woven into a parallax layer (bird / airship / caravan / traveler / dragon) is acceptable but never the focal subject.
5. **CHUNKY visible pixel grid** on EVERY surface — mountains, clouds, water, trees, ruins. Sky gradients are DITHERED COLOR-BANDS (not smooth fades). Cloud edges are CHUNKY-PIXEL-EDGE (not airbrushed). Horizon line is HARD PIXEL-EDGE.
6. **NO IP REFERENCES** — no specific game characters / logos / recognizable franchises.
7. **NO UI ELEMENTS** — no HUD / menus / etc.
8. **NORTH STAR** — every render is "a 16-bit side-scrolling-game parallax-vista background." Cinematic-pixel-art vista, not concept-art.

🚫 ABSOLUTE BANS:
  • NO smooth illustration / NO 3D / NO photoreal / NO painterly atmospheric — pixel art ONLY
  • NO IP references / NO specific franchise vistas
  • NO UI / HUD / menus
  • NO atmospheric-painting register / NO concept-art-wallpaper register
  • NO smooth gradient sky-fades (DITHERED color bands ONLY)
  • NO airbrushed cloud edges (CHUNKY-PIXEL-EDGE ONLY)
  • NO vertical-portrait vista / NO first-person / NO straight-down god's-eye
  • NO focal character / hero in the foreground (silhouette only, in a parallax layer)
  • NO sexualized / inappropriate content

━━━ SCENE-WIDE PIXEL PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ COMPOSITION CRAFT — 16-BIT SIDE-SCROLLING PARALLAX VISTA ━━━

  • CAMERA: horizontal side-scrolling parallax (reads left-to-right)
  • 4 distinct parallax layers stacked back-to-front with HARD edges
  • FOREGROUND (closest): chunky tile-edge terrain in the bottom third
  • MIDDLE: middle-distance terrain at different depth, slightly desaturated
  • DISTANT: far peaks / horizon-mountains, cool color shift, DITHERED haze bands
  • FAR BACKDROP: sky / sunset / starfield / aurora as DITHERED color bands
  • OPTIONAL: tiny silhouette woven into one parallax layer (NEVER focal)
  • SATURATED SNES-era 16-bit palette — emerald-greens / royal-blues / sunset-amber / cosmic-violet / desert-amber / snow-cyan / volcanic-orange

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write in this exact order ━━━
[the SPECIFIC vista subject (rolling hills / fjord cliffs / desert mesa / volcanic ridge / arctic tundra / mountain ridge / sea-horizon / floating-island / canyon-rim / etc.) framed as 4-layer side-scrolling parallax vista], [the FAR BACKDROP SKY LAYER (sunset / dawn / starfield / aurora / cloud-bank / planet-rising / nebula) rendered as DITHERED color bands], [the LIGHTING + ATMOSPHERIC PARTICLES (golden-hour amber / dawn-pink / starlit-cool / aurora-prismatic + drifting petals / pollen / snow / embers / mist / dust / leaves)]${parallax_silhouette ? ', [optional tiny parallax silhouette (bird / airship / caravan / traveler / dragon) woven into one of the layers, NEVER focal]' : ''}, [4-layer parallax depth — foreground tile-edge terrain + middle hills / village + distant peaks + far backdrop sky], [HARD pixel-edges between every layer, DITHERED color-bands in the sky, CHUNKY-PIXEL-EDGE cloud edges, HARD pixel-edge horizon], [16-bit pixel-art register with crunchy individual visible pixels, saturated SNES-era palette]

CRITICAL — PIXEL ART ONLY (NEVER smooth illustration / painterly atmospheric / concept-art). The frame is SIDE-SCROLLING PARALLAX VISTA — the vista IS the hero. 4 parallax layers with HARD pixel-edges. "I want to scroll past this in a 16-bit RPG" feel.

Output ONLY 70-95 words. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose.`;
  },
};
