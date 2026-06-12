# DreamBot Crossover Paths — the bubble-bot visits every bot's world

**Concept (Kevin, 2026-06-12):** DreamBot's bubble-bot is a constant character (the figure axes — body / dome / eyes / pose — never change). Each path swaps only the **`dream_world` axis** for a bespoke pool themed to a *different active bot's universe*, so the bubble-bot "visits" each bot's world.

**Render decision (Kevin):** **EVERYTHING stays in DreamBot's glossy-dreamy register.** We do NOT flex the medium per bot. The bubble-bot keeps its glossy Pop-Mart-vinyl + dreamy look on every path; only the SCENE CONTENT carries each bot's vibe. So a "BrickBot world" is LEGO-shaped scenery rendered glossy-dreamy, not actual LEGO photography.

**Build shape:** every crossover path is identical to `bubble-bot-dreams` (same archetype `DREAMBOT_BUBBLE_BOT`, same template, same figure + world_detail + light_mood + atmosphere pools, same medium + model) **except a bespoke `dream_world` pool**. So each new path = 1 themed dream_world pool (gen MVP-25 → scale) + 1 path file + index.js wiring.

Existing paths: `bubble-bot-dreams` (sharp), `bubble-bot-dreams-warm` (warm) — both generic dreamy worlds.

---

## The 18 active bots — DNA + crossover flavor

For each bot: **WORLD** (what it renders) · **MOTIFS** (signature elements to carry into the dream_world seeds) · **CROSSOVER** (the bubble-bot-in-that-world flavor, rendered glossy-dreamy).

### BloomBot — lush monumental flowers
- WORLD: hyperreal flower-hero scenes; tropical understory, lagoons, lava-rock shores, flower tunnels.
- MOTIFS: building-sized blooms, jewel-tone foliage, petal-carpets, monstera/elephant-ear leaves, dewdrop haloes, hummingbirds/butterflies.
- CROSSOVER: bubble-bot dwarfed beneath towering exotic blooms, petal-carpet floors, flower-tunnel archways, lagoon-edge bloom reflections.

### BrickBot — LEGO MOC worlds
- WORLD: brick-built scenes — pirate galleons, castle siege, dioramas (harbor, arctic base, space dock).
- MOTIFS: studded bricks, minifigs, baseplate terrain, color-blocked builds, crisp deep-focus "everything is LEGO".
- CROSSOVER: bubble-bot in brick-built worlds — a LEGO galleon harbor, a brick castle hall, a studded-brick diorama — glossy-dreamy but unmistakably LEGO-shaped.

### ChibiBot — cute-creature storybook villages (DreamBot's parent)
- WORLD: chibi-creature habitats; treehouse / mushroom-cap / aquatic-stilt / cottagecore villages, cozy interiors.
- MOTIFS: woven rope-bridges, lantern-flower porches, clay huts, market stalls, moss/clay textures, warm glow.
- CROSSOVER: bubble-bot wandering chibi-creature villages — treehouse platforms, mushroom-cap hamlets, jade-stream stilt-villages.

### DinoBot — prehistoric Mesozoic worlds
- WORLD: BBC-Planet-Earth paleoart; fern glades, Carboniferous swamps, volcanic highlands, amber forests, pterosaur cliffs.
- MOTIFS: towering cycads/horsetails, friendly giant dinos (as gentle giants), amber resin pools, mist, volcanic steam.
- CROSSOVER: bubble-bot dwarfed beneath cycad cathedrals + gentle giant dinos, by glowing amber pools, on chalk pterosaur ledges.

### DragonBot — painted high fantasy
- WORLD: Frazetta oil-painted fantasy; castle halls, arcane libraries, floating sky-castles, elven cities, dragon vistas.
- MOTIFS: stone ramparts, floating spell-tomes + glowing orbs, sky-bridges, gentle dragons, runes, cloud-seas.
- CROSSOVER: bubble-bot on a castle window-ledge, among floating tomes in an arcane library, on a floating sky-castle, beside a friendly dragon.

### EarthBot — hyperreal epic nature
- WORLD: Nat-Geo landscapes; granite peaks (K2/Patagonia), turquoise atolls, glaciers (Iceland), Serengeti, Dolomites.
- MOTIFS: monumental rock, turquoise-cobalt reefs, glaciers, waterfalls, restrained natural light, scale-vast vistas.
- CROSSOVER: bubble-bot tiny against a granite peak, on an atoll's white-sand tide-line, in a glacier gorge — epic nature, glossy-dreamy.

### FaeBot — enchanted fae forest
- WORLD: painted peaceful magic forest; ancient oaks, bluebell clearings, mushroom rings, willow archways, mossy streams.
- MOTIFS: phosphorescent moss/fungus, dewdrop pearls, fae companions (stag/hedgehog/firefly), golden dappled or moonlit light.
- CROSSOVER: bubble-bot in towering oak groves, bluebell-and-mushroom carpets, willow-root archways, glowing fairy clearings.

### GothBot — pretty-spooky gothic (WHOLESOME twist)
- WORLD: operatic dark-romance; gothic castles, moonlit ruins, flooded crypts, abandoned carnivals, bone-gardens.
- MOTIFS: cathedral arches, gargoyles, witch-fire glow, jack-o-lantern-ish warmth, candle-amber. **Keep CUTE/pretty-spooky, never scary.**
- CROSSOVER: bubble-bot in pastel-spooky castles, softly-glowing crypts, a friendly overgrown carnival, gargoyle ledges under a big moon.

### MangaBot — anime worlds
- WORLD: anime spectrum; neon Neo-Tokyo, Ghibli countryside, samurai temple gardens, magical-girl rooftops, isekai realms.
- MOTIFS: holographic neon signage, sakura + stone lanterns, misty rice-terraces, torii gates, atmospheric haze.
- CROSSOVER: bubble-bot in a neon Shibuya scramble, a misty Ghibli valley, a sakura temple garden, a magical-girl rooftop at dusk.

### MechBot — sci-fi mecha + deep-sea
- WORLD: cinematic mecha; battle arenas, hadal trenches, sentinel temple-ruins, derelict undersea cities.
- MOTIFS: giant (friendly) mechs, floodlit black water, chrome/titanium, moss-draped dormant sentinels, bioluminescent creatures.
- CROSSOVER: bubble-bot beside gentle-giant mechs, in a floodlit deep-sea bot-city, cradled in a mossy sentinel's palm.

### OceanBot — maritime + deep-sea wonder
- WORLD: age-of-sail + Nat-Geo ocean; coral-crusted shipwrecks, sunken cities, reefs, whales, bioluminescent abyss.
- MOTIFS: barnacled galleons, coral towers, manta rays/jellyfish, anemone gardens, god-rays through water, glowing tube-worms.
- CROSSOVER: bubble-bot on a coral-crusted galleon, in a reef carnival, riding a manta, in a bioluminescent abyss-garden.

### PixelBot — video-game adventure worlds (rendered glossy, not pixel)
- WORLD: game-genre scenes; cozy RPG towns, dungeons, boss arenas, JRPG battlefields, farm sim, sci-fi action.
- MOTIFS: half-timbered shops + lanterns, treasure chests + runes, boss-creatures, spell-effects, parallax vistas.
- CROSSOVER: bubble-bot in an RPG market town, a glowing dungeon, a boss-arena, a cozy farm — game-world *scenes* in glossy-dreamy render.

### RetroBot — 80s/90s nostalgia interiors
- WORLD: American-childhood scenes (no characters); Saturday-morning living rooms, mall food courts, bedroom forts, video stores.
- MOTIFS: wood-console CRTs, cereal bowls + shag carpet, blanket forts, neon signs, VHS glow, warm Kodachrome light.
- CROSSOVER: bubble-bot in a sun-striped 80s living room by a glowing CRT, a mall food court, a couch-cushion blanket fort.

### StarBot — epic deep-space sci-fi
- WORLD: cosmic grandeur; crystal canyons, bioluminescent tide pools, ringed-giant skies, spore forests, space opera.
- MOTIFS: twin suns, resonant quartz spires, ringed gas giants, glowing alien flora, nebula skies, scale-dwarfing vistas.
- CROSSOVER: bubble-bot clinging to a crystal spire under twin suns, in glowing tide pools, beneath a ringed-giant sky, in a spore forest.

### SteamBot — steampunk brass-and-gaslight
- WORLD: Victorian-industrial; brass spire cities, airship harbors, gear-bridges, mechanical gardens, gaslit foundries.
- MOTIFS: interlocking gears, copper domes, dirigibles, steam-plumes, gear-flowers, amber gaslight, Parrish-warm interiors.
- CROSSOVER: bubble-bot on a brass observation-platform, an airship-dock gangway, in a gear-flower garden, a gaslit reading-nook.

### TinyBot — tilt-shift miniature dioramas
- WORLD: tabletop model worlds; cottage villages, alpine chalets, zen gardens, farms, coastal scenes — obsessive micro-detail.
- MOTIFS: countable tiny props, handcrafted imperfections, thumb-sized scale, tilt-shift blur, cozy charm.
- CROSSOVER: bubble-bot in handcrafted mini-villages, dollhouse farms, zen-garden dioramas (the bot is already toy-scale — natural fit).

### ToyBot — toy-world story dioramas
- WORLD: cinematic toy storytelling; claymation villages, plush worlds, army-men, hot-wheels cities — on real surfaces.
- MOTIFS: multi-toy ensembles, real-surface sets (desk/rug/attic), practical props, mid-action story beats.
- CROSSOVER: bubble-bot among other toys — on a desk with army-men, in a claymation village, a hot-wheels city, a plush picnic.

### YumBot — kawaii food candy-worlds
- WORLD: smiling-food dreamscapes; candy mountains, lollipop forests, food festivals, dessert tea-parties.
- MOTIFS: frosted-cake mountains, gumdrop bushes, candy-cane bridges, kawaii food-friends, pastel candy terrain.
- CROSSOVER: bubble-bot in Sugar-Rush candy-lands, lollipop forests, among smiling food-friends at a dessert tea-party.

---

## Build plan (Phase 2)

Per bot: a `gen-dreambot-pool.js` recipe (themed to that bot's WORLD/MOTIFS, sub-themed across its scene families, in DreamBot's terse dream_world voice + the bot's vibe) → gen MVP-25 → wire a path (`bubble-bot-dreams-<bot>`) sharing everything but the dream_world pool → render-test → on approval scale the pool + activate.

**Recommended sequencing:** validate the crossover concept on 2-3 *representative* bots first (e.g., one nature/realist = EarthBot, one stylized/structured = BrickBot, one fantasy = DragonBot) — gen MVP-25 + render-test + Kevin review — to confirm "bot's world content in glossy-dreamy render" lands. Then roll out the remaining 15 in batches.
