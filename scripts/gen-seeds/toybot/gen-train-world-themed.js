#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/train_world_themed.json',
  total: 50,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} CINEMATIC-THEMED-WORLD seed entries for ToyBot's model-train-world path. Each seed describes ONE moment where a tiny HO-scale or N-scale model train is the hero in a cinematic, genre-coded, immersive themed-world. NOT a diorama. NOT a real kitchen. A movie-still or video-game-screenshot vibe where the train is the protagonist.

Each entry: 22-32 words. ONE specific genre-driven world the train inhabits. The world is fully realized (not handcrafted) — like a Hollywood-grade location shot at toy-train scale.

━━━ CRITICAL: GENRE-IMMERSIVE WORLD, NOT DIORAMA ━━━
The setting is a cinematic environment from a recognizable genre (Wild West / fantasy / sci-fi / horror / steampunk / post-apoc / Studio Ghibli / Wes Anderson / Mad Max / etc.). It feels like a movie still, not a hobbyist build. Toy train remains tiny in scale, but the world looms huge and lived-in.

━━━ THEMED-WORLD CATEGORIES (rotate aggressively) ━━━

DINOSAUR / PREHISTORIC
- Tiny train escaping a real-sized Tyrannosaurus rex through prehistoric jungle, mud splashing under rails, dust columns rising
- Train threading through grazing herd of brontosaurus in misty primordial fern-valley, peaceful coexistence vibe
- Locomotive crossing rope bridge over volcanic lava-river, pterodactyls circling overhead, Jurassic-Park-island energy
- Train passing skeletal dinosaur ribcage exposed in cliff-face, paleontologist-camp tents glowing nearby, dust haze

WIZARDING / FANTASY
- Train weaving through enchanted forest with floating lanterns, Hogwarts-Express vibe, deep-blue twilight, warm window glow
- Locomotive at platform 9-3/4 vibe — magical column of steam, wizards in robes boarding (scale-figure), ornate iron arches
- Train crossing rainbow viaduct in fairytale kingdom, unicorns grazing nearby, crystal castle in distance
- Engine running through hobbit-shire vibe — round doors in green hills, garden patches, smoke from chimneys, golden hour
- Train passing dwarven mountain forge entrance, glowing orange interior visible, anvils ringing, dwarves waving

POLAR / WINTER MAGIC
- Polar-Express-style locomotive thundering through deep-snow forest at midnight, aurora overhead, golden interior lights
- Train crossing frozen-lake causeway under shimmering northern-lights sky, ice cracking under wheels, breath-fog
- Engine emerging from ice-tunnel in glacier wall, frost crystals catching headlamp beam, blue-hour magic
- Locomotive at remote Arctic station with thick snowfall, wolf-pack watching from treeline, lanterns burning

POST-APOCALYPTIC / MAD MAX
- Armored train with welded scrap-metal cars rolling through dust-storm wasteland, mohawk passengers visible on roof
- Locomotive pulling rusted ore-cars across cracked desert plain, abandoned cars half-buried in sand, sunset blood-red
- Train passing skeletal remains of a city-skyline, debris-strewn rails, scavengers waving from ruined buildings
- Engine threading through collapsed-highway overpasses, vines reclaiming the iron, mutant fauna watching from shadows

WESTERN / OLD WEST
- Steam-engine outracing horseback bandits across red-rock canyon, dust kicked up, scale-figure outlaws firing pistols
- Train pulling into ghost-town station with tumbleweeds rolling, weathered wooden saloon, dust haze in evening light
- Locomotive crossing wooden trestle bridge over rust-red canyon, vultures circling, John-Ford golden-hour palette
- Train escaping native scout signal-fires on distant mesas, prairie running wild beside tracks, frontier vibe

CYBERPUNK / SCI-FI
- Maglev train gliding through neon-soaked future-city, holograms shimmering on skyscrapers, rain-slicked streets below
- Locomotive emerging from chrome tunnel into space-elevator station, stars visible through dome, lit walkways
- Train passing through alien-jungle planet with bioluminescent fauna, twin moons in sky, exotic flora curling near rails
- Steam-and-circuit hybrid engine in cyberpunk Tokyo alleyway, neon kanji signs reflecting on locomotive body

STUDIO GHIBLI / WHIMSICAL
- Spirited-Away-style train running on submerged track across reflective sea at sunset, ghostly silhouette passengers
- Engine threading through forest of giant sunflowers and butterflies, Totoro-vibe, soft watercolor light
- Train at platform in cloudscape station above the world, Castle-in-the-Sky vibe, drifting islands beyond
- Locomotive crossing soap-bubble bridge over rainbow river, fantasy-painted skies, dreamlike pastel palette

HORROR / GOTHIC
- Train passing crumbling gothic cathedral with crows in flight, fog rolling, only a single lit window in cathedral
- Locomotive emerging from misty tunnel into graveyard valley, headstones at sundown, single figure standing on tracks ahead
- Engine creaking past abandoned Victorian asylum in moonlight, ivy reclaiming walls, ravens perched on broken statuary
- Train threading through twisted dead-tree forest, scarecrow lit by lantern, harvest-moon hanging blood-orange

WES ANDERSON / PASTEL
- Symmetrical pastel-pink station with retro signage, train framed dead-center, vintage suitcases on platform, peach-and-mint palette
- Pastel mountain-resort train passing salmon-pink hotel facade, geometric snow-capped peaks, pastel uniforms on platform
- Train traversing mint-green meadow at golden hour, vintage station beyond, painted-perfect cloud formations
- Locomotive at retro-futurist station with curved chrome details, pastel-yellow tile, vintage flight-attendant aesthetic

STEAMPUNK
- Brass-and-rivet locomotive pulling airship-tethered cars across mountain pass, propellers spinning, Victorian dirigibles overhead
- Steam-engine emerging from brass-clockwork tunnel with visible gears turning, mechanical landscape, copper haze
- Train crossing wrought-iron viaduct over canyon with steam-powered factories below, smokestack forest, brass detail
- Engine at brass-and-glass terminal with vacuum-tube transit systems, top-hat passengers, gaslamp glow

UNDERWATER / SUBMERGED
- Train running on coral-encrusted track along ocean floor, schools of fish parting, sunbeams filtering down, ancient ruins glimpsed
- Locomotive crossing glass-tube tunnel through aquarium-vast sea, sharks circling, scuba-suited engineer in cab
- Engine threading through sunken Atlantis ruins, broken marble columns flanking tracks, glowing fish swirling
- Train approaching kelp-forest tunnel, scale-perfect sea-anemones along rails, octopus draped over engine cab

━━━ MUST-HAVE FOR EVERY ENTRY ━━━
- Train must be EXPLICITLY described as tiny HO-scale or N-scale (1:87 or 1:160) — toy-ness preserved
- World is fully cinematic and immersive (not handcrafted, not real kitchen) — a believable lived-in environment
- Specific genre cue (lava / dust storm / aurora / cathedral / neon / pastel / brass-gears / kelp)
- Lighting + atmosphere appropriate to the genre vibe
- World feels HUGE around the toy-scale train — the scale-tension is the wow

━━━ BANNED LANGUAGE ━━━
- NO "scratch-built" / "ground-foam" / "lichen-tree" / "plaster-rock" / "static-grass" — those are diorama words
- NO "diorama" / "model railroad layout" / "track on baseboard" / "hobbyist build"
- NO "real kitchen" / "real coffee mug" / "real cat" — those belong in the real-world pool
- NO CGI / illustration / digital-render language
- NO copyrighted character names ("Harry Potter", "T-Rex" the name) — use generic descriptors

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering. Each string is one cinematic-themed-world train scene description.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
