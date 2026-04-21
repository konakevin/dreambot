# Pending bot migrations — finalized path specs

Working notes for the batch migration. Each bot's paths are locked here
once Kevin approves. Then I migrate all bots using these specs.

Migration order (saved when path discussion reaches each bot):
1. (pending)

---

## Format per bot

- **Theme:** one-line character description
- **Scene-centric or character-centric?**
- **Mediums:** (+ pinning if any)
- **Vibes:** (allowed list)
- **banPhrases:** (if any)
- **Paths:** numbered list with scope notes
- **Unique axes to seed:** list of Sonnet-seeded pools

---

## Queue (not yet finalized)

### DragonBot ✅ FINALIZED

- **Theme:** High-fantasy magical worlds + landscapes + arcane scenes + characters. Every render rendered with RICH magical feeling — theatrical lighting, mystical atmosphere, mythic production value. LOTR / GoT / Harry-Potter / Elden-Ring / Witcher / Warhammer-concept-art energy. **Landscape is the flagship path** — stunning fantasy-world art (castles / vistas / ruins / cities) is the bot's core offering.
- **Mixed scene/character** (characters by role only — wizard/ranger/knight/mage — never named)
- **Mediums:** `canvas`, `watercolor`, `illustration`, `pencil` (from old config)
- **Vibes:** cinematic, cozy, epic, nostalgic, psychedelic, peaceful, whimsical, ethereal, arcane, ancient, enchanted, fierce, coquette, voltage, nightshade, macabre, shimmer, surreal (inverts old `minimal/dark`)
- **banPhrases:** none

**Paths (6):**
1. `landscape` ⭐ **FLAGSHIP** — Stunning fantasy-world vistas + castles + ruins + mythic cities (no characters)
2. `fantasy-scene` — Character in rich magical-atmospheric scene (wizard at cliff with cosmic storm, ranger in forest with glowing motes, mage mid-ritual in ruined temple). Character is engaged, integrated with magic
3. `epic-moment` — Charged narrative moment (battle-mid-charge, spell-cast, coronation, ritual, army-at-dawn on hilltop, siege-assault)
4. `dragon-scene` — Dragon as hero (coiled on hoard, in flight above mountains, sleeping in volcanic cave, standoff with rider, ancient lair)
5. `magic-moment` — ARCANE MAXIMALISM. Layered impossibly-magical artifact/phenomena scenes. Staffs topped with living galaxies, grimoires whose pages lift themselves, portals tearing reality, ritual circles with stars materializing overhead. Never simple-object-on-altar — always 4-5 magical elements stacked per scene. Scene RESPONDS to the magic (dust suspended, time frozen, light bending, walls breathing)
6. `cozy-arcane` — Cozy fantasy places. Mix inhabited (Hobbiton hearth / elven tea-garden / wizard's rainy library / tavern at snow / witch's herb-drying cottage) AND natural (glowing-moss creek / fae-glen / sprite-cave / sleeping-unicorn meadow / fire-moth stump at dusk). Magical wildlife welcome (fae / sprites / young dragons / spirit-foxes at rest). Warm-tame-peaceful magic, never dramatic

**pathWeights:**
- `landscape: 3` (flagship)
- `fantasy-scene: 2`, `cozy-arcane: 2`, `dragon-scene: 2`
- `epic-moment: 1`, `magic-moment: 1`

**Axes to Sonnet-seed (50 each):**
- `fantasy_characters` — by role (wizard / ranger / mage / knight / druid / paladin / hooded-figure / warlord / elf-archer / dwarf-smith)
- `fantasy_landscapes` — flagship axis: castles / floating-islands / ancient-ruins / elven-forests / volcanic-peaks / frozen-tundra / sunken-kingdoms / enchanted-lakes / Dwarven-halls / sky-cities
- `epic_moments` — charged moments (battle-charge / spell-cast / siege / coronation / ritual / army-march / standoff)
- `dragon_types` — specific dragons (western / eastern-serpentine / wyvern / ancient-rotting / crystal / shadow / sunset / ice / volcano)
- `arcane_phenomena` — LAYERED multi-element magical scenes (object + what's happening + atmospheric response + architectural context). NOT simple-still-life
- `cozy_arcane_settings` — cozy inhabited + natural fantasy pockets (hearth / library / tavern / glowing-moss creek / sprite-cave / fae-glen / sleeping-unicorn meadow)
- `architectural_elements` — castles / towers / temples / bridges / gates / thrones / banners
- `atmospheres` — god-rays / swirling mist / floating embers / magical sparks / falling leaves / dragon-smoke / lightning-arcs
- `lighting` — cinematic (golden-hour / blue-hour / lantern-interior / dragon-fire-glow / moon-and-torch / storm-light)
- `scene_palettes` — fantasy color moods (rich-earth / moody-storm / golden-dusk / twilight-mystic / fire-and-ash / ice-and-sapphire)

**Shared blocks:**
- `EPIC_FANTASY_BLOCK` (LOTR/GoT/Harry-Potter-film-still energy; concept-art movie quality; never cartoon, never generic-RPG-art)
- `MAGICAL_ATMOSPHERE_EVERYWHERE_BLOCK` (every render has rich magical feeling regardless of path — theatrical lighting, mystical atmosphere, arcane energy integrated)
- `PAINTERLY_ILLUSTRATION_BLOCK` (canvas/watercolor/illustration/pencil aesthetic, never photoreal)
- `NO_NAMED_CHARACTERS_BLOCK` (characters by role only)
- `CINEMATIC_COMPOSITION_BLOCK` (framing + lighting + depth chosen for movie-shot quality)
- `BLOW_IT_UP_BLOCK` (epic-fantasy amplification: book-cover / Peter-Jackson-concept-art quality × 10)
- `IMPOSSIBLE_BEAUTY_BLOCK` (epic-fantasy edition)

**Path-specific amplification blocks:**
- `ARCANE_MAXIMALISM_BLOCK` (magic-moment path only: layered arcane stacking — object + orbiting glyphs + rising light + ritual architecture + atmospheric response. 4-5 magical elements per render. Setting is never neutral — responds to the magic)
- `WARM_QUIET_MAGIC_BLOCK` (cozy-arcane path only: tame peaceful magic in inhabited OR natural settings; magical wildlife welcome at rest; never dramatic action; the PLACE + cozy atmosphere is subject)
### MangaBot ✅ FINALIZED

- **Theme:** Japanese culture + anime aesthetic — full spectrum. Modern anime (Ghibli/Shinkai/Demon-Slayer/Mononoke/Akira/Ghost-in-the-Shell), traditional Japan (samurai/geisha/ronin/Edo/torii/shrines/bamboo), mythology (kitsune/yokai/oni/tengu/kami/ryujin), futuristic Neo-Tokyo cyberpunk. Hand-drawn anime illustration quality. Characters by role only, never named.
- **Mixed scene/character**
- **Mediums:** `anime` (single medium, from old config)
- **Vibes:** cinematic, dark, cozy, epic, nostalgic, peaceful, whimsical, ethereal, arcane, enchanted, coquette, voltage, nightshade, macabre, shimmer, surreal (inverts `ancient/fierce/psychedelic/minimal`)
- **vibesByMedium:** `anime` pins heavy on enchanted / cinematic / epic / ethereal / whimsical / arcane (from old pinVibes)
- **banPhrases:** none

**Paths (7):**
1. `anime-scene` — Classic anime scene with character-by-role (warrior/spirit/ronin) — modern/traditional/futuristic mix
2. `anime-landscape` — Pure Japanese environment, no characters (shrines, rice paddies, bamboo, torii, tatami, Edo street)
3. `mythological-creature` — Japanese mythological being as hero (kitsune / yokai / oni / tengu / ryujin / yuki-onna / nekomata / tanuki)
4. `cozy-anime` — Ghibli warm moments, peaceful + heartwarming slower-paced (Totoro/Ponyo energy — rain-umbrella, spirit drinking tea, girl + cat at window)
5. `kawaii` — Explicit KAWAII CUTE anime (chibi / big-eye / magical-girl / sparkle-heavy / shoujo-cover-art character cuteness)
6. `slice-of-life` — Quiet daily anime (schoolgirl in classroom / kotatsu tea / balcony stargazing / 2am convenience store / train commute at dawn)
7. `neo-tokyo` — Cyberpunk Japan future (neon alleys, rain street, ramen 3am, Blade-Runner-meets-Akira)

**Axes to Sonnet-seed (50 each):**
- `anime_characters` — by role only, modern/traditional/mythic/futuristic
- `japanese_landscapes` — shrines/rice/bamboo/cedar/zen/torii/Edo/mountain
- `mythological_beings` — specific yokai/kami/creature types
- `cozy_anime_moments` — Ghibli-warm vignettes
- `kawaii_moments` — chibi + magical-girl + sparkle-cute scenes
- `slice_of_life_moments` — quiet daily anime (classroom/kotatsu/convenience-store/balcony/commute)
- `neo_tokyo_settings` — cyberpunk-Japan locations
- `cultural_elements` — torii/paper-lanterns/tanabata/kitsune-masks/origami/tea-ceremony/wagashi/kimono
- `atmospheres` — petal-rain/firefly/pollen/rain/fog/snow-drift/spirit-wisps
- `lighting` — anime-lighting (Shinkai-sunset / Ghibli-dappled / Akira-neon / moonlit / lantern)
- `scene_palettes` — anime color moods
- `character_details` — anime-character visual vocabulary (big eyes / flowing hair / haori / kimono / cyberpunk-layers)

**Shared blocks:**
- `ANIME_AESTHETIC_BLOCK` (Ghibli/Shinkai/anime-illustration quality, never photoreal or 3D-render)
- `NO_NAMED_CHARACTERS_BLOCK` (characters by role only)
- `CULTURAL_RESPECT_BLOCK` (respectful Japanese-culture rendering, no caricature)
- `BLOW_IT_UP_BLOCK` (anime amplification — stack drama/culture/lighting, most stunning Ghibli-frame × 10)
- `IMPOSSIBLE_BEAUTY_BLOCK` (anime-illustration edition)
### StarBot ✅ FINALIZED

- **Theme:** Mind-bending sci-fi. Blade Runner / Dune / Interstellar / Alien / 2001 / Arrival / Annihilation / Foundation. Cosmic vistas, impossible alien landscapes, epic space opera, sleek futurism, awe-inspiring scale. VenusBot owns cyborg-woman territory — StarBot drops that.
- **Mixed** (landscape-heavy scene-centric + some robot/interior paths)
- **Mediums:** `photography`, `vaporwave`, `canvas`, `render`
- **Vibes:** cinematic, dark, epic, nostalgic, psychedelic, peaceful, ethereal, arcane, ancient, enchanted, fierce, coquette, voltage, nightshade, macabre, shimmer, surreal (inverts old `minimal/whimsical/cozy`)
- **banPhrases:** none

**Paths (8):**
1. `cosmic-vista` — Mind-bending FICTIONAL sci-fi space/cosmic phenomenon (nebula skies, black-hole event-horizon, pulsar ice-world, binary-sun sunset, ringed-planet horizon). Blade-Runner/Dune/Interstellar style. Pure environment
2. `alien-landscape` — Alien planet surfaces (bioluminescent Pandora-jungles, crystal-spire deserts, floating-coral forests, methane-lakes under two moons)
3. `space-opera` — Epic fleet/battle (Star-Destroyer ships, armadas, dogfights in nebula, asteroid-field battles). Massive + kinetic
4. `sci-fi-interior` — Epic interior scale (space-station bridge, starship corridor, cathedral-hangar, Blade-Runner apartment, Interstellar library-construct, minimalist lab)
5. `cozy-sci-fi-interior` — Cozy sci-fi pocket (personal quarters with plants + nebula view, space-station cafe, captain's study with holo-star-map, greenhouse module with starfield view)
6. `alien-city` — Vast alien city from above (Coruscant-style megacity, floating-platform city, dome-city on ice moon, ring-habitat, crystal-crater city)
7. `robot-moment` — Sci-fi robot having HUMAN moment in tranquil setting. Solo robot only
8. `real-space` — PHOTOREAL astrophotography dialed to 11. NASA-Hubble / JWST-style real space. Real nebulae (Orion / Eagle / Horsehead / Carina / Crab), real galaxies (Andromeda / whirlpool / pinwheel), planet close-ups (Saturn rings / Jupiter storm-bands / Mars surface / Venus clouds), star-clusters, supernova remnants, cosmic-dust pillars, aurora-from-ISS, Earth-from-orbit, eclipse photography, Hubble-Deep-Field depth. Photorealistic astronomy beauty. Distinct from fictional `cosmic-vista`

**Axes to Sonnet-seed (50 each):**
- `cosmic_phenomena` — FICTIONAL sci-fi space-physics marvels
- `alien_landscapes` — alien planet surface types
- `space_opera_scenes` — battle/fleet/chase/boarding setups
- `sci_fi_interiors` — bridge/corridor/engine-bay/lab/library/hangar
- `cozy_sci_fi_interiors` — quarters/cafe/sleep-pod/study/greenhouse-module/observation-lounge
- `alien_cities` — vast alien city types
- `robot_types` — specific robot forms (massive-mech / rusted / sleek-drone / tiny-companion / bio-mechanical / humanoid-android / industrial)
- `tranquil_moments` — human-moment activities (meditating / reading / watching-sunrise / sleeping / gazing / tinkering)
- `real_space_subjects` — REAL astrophotography subjects (specific real nebulae/galaxies/planets with JWST-Hubble-style framing + wavelength-color-treatment). Astronomical facts (names OK)
- `atmospheres` — space-dust / nebula-wisps / ion-storm / cosmic-rays / plasma-glow / crystal-refraction / rain-on-metal
- `lighting` — sci-fi lighting + real-astronomy lighting (single-star / binary-sun / planet-glow / neon-reflected / ion-glow / nebula-backlight / industrial-strobe / mapped-science-colors)
- `scene_palettes` — cosmic color moods (deep-space-indigo / nebula-pink / ion-teal / Blade-Runner-neon / Dune-sepia / ice-blue / gas-giant-cream-and-gold / JWST-infrared-orange-teal / Hubble-pillars-amber-blue)

**Shared blocks:**
- `SCI_FI_AWE_BLOCK` (Blade-Runner/Dune/Interstellar/Alien/2001 production value)
- `NO_COZY_EXCEPT_COZY_PATH_BLOCK` (most paths = awe + drama + scale; cozy-interior is the warm exception)
- `NO_NAMED_CHARACTERS_BLOCK` (robots/beings unnamed)
- `NO_CYBORG_WOMEN_BLOCK` (VenusBot territory — StarBot robots are mechs/drones/bio-mechs/androids but never "sexy cyborg woman")
- `BLOW_IT_UP_BLOCK` (Blade-Runner × Interstellar × Annihilation × 10 quality — movie-poster energy)
- `IMPOSSIBLE_BEAUTY_BLOCK` (sci-fi edition)
- `SOLO_ROBOT_BLOCK` (robot-moment path only)
### GothBot ✅ FINALIZED

- **Theme:** Hauntingly beautiful dark fantasy. Castlevania / Bloodborne / Dark-Souls / Elden-Ring / Tim-Burton / Crimson-Peak / Berserk / gothic-fairy-tale. Elegant darkness — unsettling but gorgeous. Deep purples + crimsons + midnight blacks + ornate gothic detail + chiaroscuro. Never ugly/gory — always darkly-romantic or classically-gothic.
- **Mixed scene/character** (characters key — goth women / vampires / hunters / cursed nobles / monsters)
- **Mediums:** `canvas`, `anime`, `comics`, `illustration`, `pencil`
- **Vibes:** cinematic, dark, epic, nostalgic, psychedelic, whimsical, ethereal, arcane, ancient, enchanted, fierce, coquette, voltage, nightshade, macabre, shimmer, surreal (inverts `minimal/cozy/peaceful`)
- **banPhrases:** `jack skellington`, `nightmare before christmas`

**Paths (6):**
1. `dark-scene` — Hauntingly beautiful dark fantasy with character-by-role (knight in crimson ballroom, cursed priest at altar, hooded wanderer on foggy bridge)
2. `dark-landscape` — Pure gothic landscape, no characters (haunted castle, foggy cemetery, overgrown cathedral, blood-moon forest, lightning-struck tree, gothic cityscape in fog, moonlit mausoleum)
3. `horror-creature` — Dark-fantasy creature as hero (werewolf / vampire / demon / wraith / wendigo / lich / phantom / ghoul / banshee). Powerful + terrifying + beautifully rendered
4. `goth-woman` — Exquisitely beautiful goth-hellspawn woman. Glowing-colored eyes, fangs, claws, dark lipstick, tattoos, piercings, dramatic pose. Unique dark accessory (horns / crown / chains / wings / veil / thorns / serpents / third-eye / antlers / halo). Solo
5. `castlevania-scene` — Castlevania-game-art / Bloodborne / Berserk aesthetic (vampire hunters, Belmont energy, cursed cathedrals, gargoyles, wrought iron, crimson stained glass, moonlit courtyards, werewolves in shadow, gothic-nobility Victorian dress, candlelit crypts, blood-moon skies)
6. `cozy-goth` — Cozy dark-fantasy pockets (candlelit library with skull-decor, gothic bedroom with velvet + iron-candelabra, witch's apothecary with dried bats + potions, crypt-kitchen, rain-streaked window with grimoire, vampire-lord reading nook, midnight-crypt-tavern, nightshade-moonflower greenhouse). Warm-dark coziness

**Axes to Sonnet-seed (50 each):**
- `dark_characters` — knight / cursed-priest / hooded-wanderer / gothic-noble / warlock / blood-hunter / reaper / veiled-bride
- `gothic_landscapes` — haunted castles / cemeteries / cathedral ruins / blood-moon-forests / gothic-cityscapes
- `dark_creatures` — specific horror creatures (werewolf/vampire/demon/wraith/wendigo/gargoyle/lich/banshee/phantom/kraken/chimera/basilisk/manticore/revenant)
- `goth_woman_accessories` — horns / crown / chains / wings / veil / thorns / serpents / third-eye / antlers / halo
- `castlevania_contexts` — cathedral / courtyard / gate / stained-glass / crypt / cobblestone-street / castle-hall
- `cozy_goth_settings` — candlelit-library / gothic-bedroom / apothecary / crypt-kitchen / rain-window-tea / reading-nook / midnight-tavern / nightshade-greenhouse
- `atmospheres` — fog / rain / bats / ravens / falling-ash / blood-mist / moths / candles-flicker / cobweb-drift
- `lighting` — chiaroscuro / moonlight / candle / crimson-stained-glass / lightning-flash / red-ritual-glow
- `scene_palettes` — deep purple / crimson / midnight black / bone white / oxblood / velvet green / sickly chartreuse

**Shared blocks:**
- `ELEGANT_DARKNESS_BLOCK` (haunting beauty, never ugly/gory — Castlevania/Bloodborne/Crimson-Peak/Tim-Burton/Berserk quality)
- `NO_JACK_SKELLINGTON_BLOCK` (hardcoded bannedPhrases enforced at engine level)
- `NO_BLOOD_NO_GORE_NO_CLOWNS_BLOCK` (never visceral — dread + darkness only)
- `PAINTERLY_ILLUSTRATION_BLOCK` (rich ornate detail)
- `NO_NAMED_CHARACTERS_BLOCK` (by role only)
- `BLOW_IT_UP_BLOCK` (gothic amplification — stack darkness + ornate detail + atmospheric drama + mystical dread)
- `IMPOSSIBLE_BEAUTY_BLOCK` (hauntingly-beautiful)
- `SOLO_COMPOSITION_BLOCK` (character paths)
### GlowBot ✅ FINALIZED

- **Theme:** LIGHT IS THE HERO. Every scene emotionally carried by the light itself. Pandora-bioluminescent energy + Ghibli/Narnia soft-sacred luminance + Rivendell divine glow. Viewer should feel RELAXED / AWE-INSPIRED / AT PEACE purely from how the light lands. Overlap with BloomBot OK — BloomBot's hero is flowers, GlowBot's is light.
- **Scene-centric** (no characters; wildlife optional as scale/peripheral)
- **Mediums:** `watercolor`, `canvas`, `illustration`, `pencil`
- **Vibes:** cinematic, cozy, epic, nostalgic, psychedelic, peaceful, whimsical, ethereal, arcane, ancient, enchanted, coquette, voltage, nightshade, shimmer, surreal (inverts old excludeVibes `dark/fierce/macabre`)
- **banPhrases:** none

**Paths (4):**
1. `luminous-landscape` — Earthly landscapes where LIGHT is the soul (sun through mist, aurora on lake, golden-hour mountains)
2. `ethereal-scene` — Ghibli/Narnia/Rivendell soft-magical scenes, floating islands + cloud palaces + divine staircases
3. `divine-moment` — Sacred-light FOCAL scenes (single sunbeam, firefly pillar, glowing doorway at twilight)
4. `dreamscape` — Pandora-bioluminescent energy (glowing moss, lakes of inner-glow, crystalline forests, glowing-wildflower hillsides)

**Axes to Sonnet-seed (50 each):**
- `landscape_settings` — earthly landscapes for luminous-landscape path
- `ethereal_scenes` — floating-islands/cloud-palaces/divine-architectures
- `divine_moments` — sacred-light focal events
- `dreamscape_contexts` — bioluminescent otherworldly
- `light_treatments` — god-rays/aurora/firefly/moss-glow/shaft-through-mist
- `emotional_tones` — hushed-reverence/gentle-awe/golden-calm/sacred-quiet (explicit emotional target per render)
- `atmospheres` — mist/pollen-motes/drifting-leaves/pearlescent-fog
- `scene_palettes` — overall color mood
- `architectural_elements` — shared across paths (temples/arches/bridges/portals/stairs)

**Shared blocks:**
- `LIGHT_IS_HERO_BLOCK` (replaces standard dramatic-lighting — enforces light-as-emotional-subject)
- `AWE_AND_PEACE_BLOCK` (requires relaxed/awe-inspired/peaceful emotional read)
- `NO_HARSH_DARK_FIERCE_BLOCK` (no menace/threat/harsh contrast)
- `NO_PEOPLE_BLOCK` (wildlife optional)
- `IMPOSSIBLE_BEAUTY_BLOCK`
- `BLOW_IT_UP_BLOCK` — amplification: "The theme is the canvas, not the ceiling. Max saturation + layered light phenomena + impossibly-abundant luminous elements + atmospheric stacking." Stays within peaceful-awe constraint, no menace
### EarthBot ✅ FINALIZED

- **Theme:** EARTH ONLY. Every render is a theoretically plausible earthly location dialed to 10× in drama, saturation, lighting, weather, composition — but always within Earth's actual geographic/geologic/biologic/meteorologic rules. Invented-specific OK (an unnamed glacier valley, fictitious basalt cliff), bound by Earth physics. National-Geographic-cover × 10. Zero fantasy, zero cosmic, zero physics-defying.
- **Scene-centric** (NO characters, NO wildlife — animal subjects belong to AnimalBot)
- **Mediums:** `photography`, `canvas`, `watercolor`, `pencil`
- **Vibes:** cinematic, dark, cozy, epic, nostalgic, peaceful, whimsical, ethereal, arcane, ancient, enchanted, fierce, coquette, voltage, nightshade, shimmer, surreal (inverts old `minimal/psychedelic/macabre`)
- **banPhrases:** none

**Paths (5):**
1. `vista` — Epic Earth panoramas, wide-scale (Patagonian peaks, Icelandic coasts, Saharan dunes, Hawaiian lava, alpine valleys)
2. `hidden-corner` — Intimate discovery / small-scale tight-frame (fern-curtained grottos, moss-draped streams, tide pools, forest clearings)
3. `weather-moment` — Earth weather dialed up at ground level (aurora on ice-field, supercells over prairie, fog-in-redwoods, monsoon rain, blood-moon)
4. `cozy-nature` — Warm inviting "I want to BE here" earthly nature (sun-dappled forest clearings, willow-lined river bends, sunlit meadow edges, pine trails with filtered light)
5. `sky` — Sky + atmospheric phenomena as art. Aurora over ground, supercell thunderstorms, lightning fork over canyon, impossible cloud formations (mammatus/lenticular/altocumulus-wave), sunsets-from-plane-window, Milky-Way arc terrestrial, rainbow-after-storm, god-rays piercing stormclouds, ice-fog tundra, sandstorm, monsoon curtain, fog rolling through valleys, sun-dog / moon-halo / iridescent cloud, volcanic eruption cloud, noctilucent clouds. SKY IS THE SUBJECT; ground is context

**Axes to Sonnet-seed (50 each):**
- `earth_vistas` — real/plausible Earth panoramas
- `hidden_earth_corners` — intimate Earth-nature discovery spots
- `earth_weather_phenomena` — ground-level atmospheric events (weather-moment path)
- `cozy_earth_scenes` — warm-inviting earthly nature (cozy-nature path)
- `sky_phenomena` — sky-IS-subject atmospheric phenomena (aurora/supercell/mammatus/lenticular/Milky-Way-arc/rainbow-after-storm/god-rays/sun-dog/iridescent-clouds/noctilucent)
- `atmospheres` — Earth-plausible particles/mist/dust/snow
- `scene_palettes` — Earth-rooted color moods
- `time_of_day` — golden/blue/dawn/dusk/moonlit/starfield with specific atmospheric detail
- `biomes` — specific Earth biomes (alpine/tundra/rainforest/desert/coastal/boreal/reef/mangrove/volcanic)

**Shared blocks:**
- `EARTH_ONLY_BLOCK` (NON-NEGOTIABLE: no fantasy, no cosmic, no physics-defying, no built structures)
- `BLOW_IT_UP_BLOCK` — "Earth is the canvas, not the ceiling. Stack weather/atmospheric phenomena, invent absurd-but-plausible geological features, saturate colors beyond realistic, dial every element to max. Sonnet is encouraged to embellish." Same DNA as BloomBot's Garden-of-Eden × 100
- `NATURE_IS_HERO_BLOCK` (land itself is subject)
- `NO_PEOPLE_BLOCK` + `NO_WILDLIFE_BLOCK` (no human figures AND no animal subjects — AnimalBot's job)
- `IMPOSSIBLE_BEAUTY_BLOCK`
- `DRAMATIC_LIGHTING_BLOCK`
### CuddleBot ✅ FINALIZED

- **Theme:** Pure CUTE + COZY + CUDDLY. Every post makes girls and kids go "AWWW" and want to hug it. Stylized / illustrative only — never photoreal. Bedroom-poster / storybook-picture-book quality. Pixar / Sanrio / Totoro-warmth energy.
- **Scene-centric with cute-creature subjects** (no humans)
- **Mediums (stylized only):** `animation`, `claymation`, `storybook`, `watercolor`, `handcrafted`, `illustration`, `fairytale`, `anime`, `pencil`, `canvas`. **BANNED:** photography, vaporwave, lego, pixels, render, comics
- **Vibes (cute-forward, no dark):** cozy, peaceful, whimsical, enchanted, coquette, shimmer, nostalgic, ethereal, cinematic, surreal (cute-surreal only). **BANNED:** dark, fierce, macabre, nightshade, psychedelic, ancient, epic, voltage, arcane
- **banPhrases:** none

**Paths (5):**
1. `heartwarming-scene` — Adorable creature doing something heart-melting (fox-pup with leaf-umbrella, tiny dragon with book, bunny family cake)
2. `cozy-landscape` — Miniature cozy worlds (mushroom villages, acorn cottages, pillow-fort forests, firefly glens)
3. `plushie-life` — Plushies alive Toy-Story-style (picnics, movie nights, tea parties, pillow-fort camping)
4. `creature-portrait` — Tight closeup of impossibly cute creature (storybook-illustration quality, big dewy eyes)
5. `tiny-animal-friends` — Small creature pair/group warmth (bunny hugging flower, dragons napping on cloud, mouse family dinner)

**Axes to Sonnet-seed (50 each, meta-prompts explicitly exclude edgy/dark/realistic):**
- `cute_creatures` — fantasy cute + exaggerated real (baby sloth / cloud-kitten / moss-sprite)
- `heartwarming_activities` — picnics / tea / reading / napping / stargazing / baking
- `cozy_miniature_worlds` — tiny cozy settings
- `plushie_scenes` — plushie-alive warm activities
- `portrait_features` — dewy eyes / fluff / whiskers / sparkles / rosy cheeks
- `tiny_friendships` — pair/group warmth moments
- `atmospheres` — soft particles / fairy dust / petals / warm glow / gentle steam
- `lighting` — warm amber / storybook-soft / golden-hour-through-window / candle-lit / firefly-glow
- `scene_palettes` — warm pastel / cozy autumn / dreamy / sanrio-pastel / storybook-warm

**Shared blocks:**
- `CUTE_CUDDLY_COZY_BLOCK` (every render must trigger AWW + smile + warm-fuzzy; girls + kids should LOVE it)
- `STYLIZED_NOT_PHOTOREAL_BLOCK` (stylized/illustrative aesthetic only; never photoreal — AnimalBot's job)
- `NO_DARK_NO_INTENSE_BLOCK` (no menace / threat / horror / sharp contrast / creepy undertones — always warm + bright + safe)
- `NO_PEOPLE_BLOCK` (no humans)
- `BLOW_IT_UP_BLOCK` (cuteness amplification: max cuteness + max cozy warmth + layer heartwarming details)
- `IMPOSSIBLE_BEAUTY_BLOCK` (storybook-picture-book edition — cute-beautiful, not dramatic-beautiful)
### CoquetteBot ✅ FINALIZED

- **Theme:** Bot for girls who LOSE THEIR MINDS over cuteness. Soft pink pastel everything. Cottagecore / princess / fairy / ballet / Parisian-pastry energy. Every post: "I WANT TO BE HER" / "I WANT TO LIVE THERE" / "OH MY GOD that's cute." Adult-feminine-pastel leaning (vs CuddleBot's kid-friendly cute).
- **Mixed** — 4 scene-centric paths + 1 fashion with human girl + 1 couture with varied characters
- **Mediums:** `fairytale`, `watercolor`, `canvas`, `pencil`, `photography` (from old config)
- **Vibes:** cinematic, cozy, nostalgic, peaceful, whimsical, ethereal, arcane, enchanted, coquette, voltage, nightshade (soft only), shimmer, surreal (inverts old excludeVibes `dark/fierce/psychedelic/ancient/epic/macabre`)
- **vibesByMedium:** `fairytale` pins heavy on `coquette/enchanted/whimsical/shimmer` (preserves old pinVibes pattern)
- **banPhrases:** none

**Paths (6):**
1. `adorable-creatures` — Tiny cute creatures in pastel settings (big dewy eyes, soft pink, no clothing focus)
2. `cottagecore-scene` — Places girls want to LIVE IN (fairy doors, pink velvet bedrooms, ballet studios, Parisian cafés)
3. `pink-nature` — Girliest nature scenes (cherry-blossom paths, pink peony fields, pastel sunsets)
4. `sweet-treats` — Food still-life, ZERO humans (whimsical mouse/bunny/hedgehog characters OK as cute supporting elements — never human chefs/bakers/hands)
5. `coquette-fashion` — Human girl editorial fashion moments (ribbon-corsets, ballet slippers, silk bows, tulle)
6. `adorable-couture` — Clothing focal on ANY character (princess/fairy/cute-animal/whimsical-creature) in rich detailed scenes

**Axes to Sonnet-seed (50 each):**
- `adorable_creatures` — fantasy + exaggerated-real creatures with BIG dewy eyes in pastel settings
- `cottagecore_scenes` — fairy-door / pink-velvet bedroom / ballet studio / Parisian café / rose bookshop
- `pink_nature_scenes` — cherry blossom / peony / pink sunset / lavender / rose-garden
- `whimsical_sweets` — food still-life (NO humans, only whimsical cute-animal characters OR pure still-life)
- `coquette_fashion_moments` — human girl fashion editorial moments
- `coquette_garments` — specific coquette clothing items (tulle gown / pearl-ribbon bodice / butterfly-wing-cape / rose-embroidered slippers / silk-bow sash / flower crown / lace gloves)
- `couture_wearers` — varied character types wearing couture (fairy / princess / mouse in gown / bunny ballerina / hedgehog in lace / made-up fantasy creature)
- `couture_scenes` — rich-detail backdrops for the couture path (fairy glen with lanterns / rose garden golden hour / pastel ballroom / teacup-dance meadow)
- `cute_accessories` — shared across paths (pearls / ribbons / lace / bows / flower crowns / tiaras)
- `atmospheres` — pink petal drift / fairy dust / sparkle motes / warm diffuse glow
- `lighting` — golden-hour pastel / candle-warm / fairy-light-twinkle / morning-through-gauzy-curtains
- `scene_palettes` — pink-dominant pastel palettes

**Shared blocks:**
- `COQUETTE_ENERGY_BLOCK` (pink/pastel/soft/feminine/princess/cottagecore/ballet/fairy — girls must say "I want to be her / live there / OMG")
- `PINK_AND_PASTEL_DOMINANT_BLOCK` (pink/rose-gold/blush/cream/lavender/mint/butter-yellow always dominant)
- `NO_DARK_NO_EDGY_BLOCK` (nothing menacing/edgy/gritty/dark/cyberpunk)
- `NO_HUMANS_IN_SWEETS_BLOCK` (sweets path specifically: ZERO humans, zero chefs, zero pastry workers, zero human hands)
- `STYLIZED_AESTHETIC_BLOCK` (fairytale/watercolor/illustration leaning; photography reserved for coquette-fashion whimsical-editorial)
- `BLOW_IT_UP_BLOCK` (max pink + pastel + adorable + dreamy-precious — if it doesn't make you squeal, dial up)
- `IMPOSSIBLE_BEAUTY_BLOCK` (coquette edition — precious-pretty)
- `SOLO_COMPOSITION_BLOCK` (coquette-fashion path only — girl is solo)
### AnimalBot ✅ FINALIZED

- **Theme:** Wildlife at Nat Geo × 10. The ANIMAL is always the hero — razor-sharp detail, impossible clarity, dramatic lighting, peak-moment timing. Makes you feel awe / tenderness / power / wonder. LAND ANIMALS ONLY (marine belongs to future OceanBot).
- **Subject-centric** (no human characters)
- **Mediums:** `photography`, `canvas`, `watercolor`, `pencil`
- **Vibes:** cinematic, dark, cozy, epic, nostalgic, peaceful, whimsical, ethereal, arcane, ancient, enchanted, fierce, coquette, voltage, nightshade, shimmer, surreal (inverts `minimal/psychedelic/macabre`)
- **banPhrases:** none

**Paths (5):**
1. `portrait` — Extreme macro closeup of ONE animal
2. `landscape` — Single animal as scale element in vast stunning setting
3. `action` — Dynamic frozen-motion peak-moments
4. `tender` — Intimate emotional pair / parent-child moments
5. `cozy` — Real wildlife in warm cozy natural settings (fox curled in autumn leaves, bear cub in sun-dappled den, owl in warm hollow). Photoreal Nat-Geo quality, cozy emotional read (distinct from CuddleBot's stylized cuteness)

**Axes to Sonnet-seed (50 each):**
- `land_animals` — specific terrestrial species with distinguishing features
- `portrait_framings` — macro composition strategies
- `landscape_contexts` — breathtaking settings where animal sits small
- `action_moments` — dynamic action types
- `tender_pairings` — emotional pair/parent-child types
- `cozy_animal_moments` — real animal + cozy natural setting + warm intimate detail
- `atmospheres` — dust/golden-haze/snow-drift/pollen/mist
- `lighting` — dramatic treatments
- `scene_palettes` — overall color mood

**Shared blocks:**
- `ANIMAL_IS_HERO_BLOCK` (animal is emotional center, even in landscape path)
- `IMPOSSIBLE_CLARITY_BLOCK` (razor-sharp fur/feather/scale)
- `SOLO_ANIMAL_BLOCK` (one per frame; tender path pair exception; prey fragment OK in action if needed)
- `NO_PEOPLE_BLOCK` (no humans)
- `NO_MARINE_BLOCK` (no ocean / fish / marine life — OceanBot's territory)
- `BLOW_IT_UP_BLOCK` — amplification within nature-photography constraints: dialed lighting + dramatic backdrops + peak-moment timing + max-impact atmospheric stacking
- `DRAMATIC_LIGHTING_BLOCK`
### GlamBot ✅ FINALIZED

- **Theme:** Editorial fashion / beauty / makeup magazine-cover energy. "I NEED that." "How is her skin like that?" Met-Gala-meets-AI maximalism. Bold, confident, diverse, edgy. Vogue × Harper's Bazaar × viral TikTok makeup looks. Opposite lane from CoquetteBot (soft pastel) — GlamBot is BOLD / HIGH-FASHION / I-WANT-THAT.
- **Character-centric** (human women, solo compositions; diverse ethnicity/body-type/style)
- **Mediums:** `photography` ×2, `canvas`, `vaporwave`, `render` (photography weighted 2x)
- **Vibes:** cinematic, dark, epic, nostalgic, psychedelic, peaceful, whimsical, ethereal, arcane, enchanted, fierce, coquette, voltage, nightshade, macabre, shimmer, surreal (inverts old excludeVibes `ancient/cozy/minimal`)
- **banPhrases:** none

**Paths (6):**
1. `makeup-closeup` — Face extreme closeup where MAKEUP IS THE ART (graphic liner, crystal gems, holographic highlights, editorial color-block, viral makeup looks)
2. `fashion-moment` — Sleek confident editorial outfits — "I NEED THAT." Statement pieces, alive + moving, varied body type / ethnicity / style
3. `beauty-portrait` — Jaw-dropping beauty portrait, face IS art. Glowing skin, piercing eyes, hair with own gravity. Magazine-cover + personality + edge
4. `avant-garde` — Met-Gala-meets-AI impossible fashion. Butterfly dresses, smoke gowns, crystal architecture, liquid mercury, fashion as spectacle. Still gorgeous, never ugly
5. `hair-moment` **(new)** — Hair IS the art — architectural updos, rainbow-gradient braids, liquid-hair sculptures, impossible volume, color-blocked structural bobs. Hair fills the frame
6. `nail-and-hand` **(new)** — Extreme closeup on hands + nails + jewelry — viral manicure art, sculptural rings, stacked bracelets, chromatic nails catching light. Tiny frame, big impact

**Axes to Sonnet-seed (50 each):**
- `makeup_looks` — specific makeup treatments
- `fashion_outfits` — specific editorial outfits
- `beauty_faces` — distinctive face/feature combos
- `avant_garde_concepts` — impossible-fashion concepts
- `hair_treatments` — bold editorial hair styles (architectural / liquid / braided-crown / color-block)
- `nail_art` — viral manicure + ring-stacking concepts
- `skin_tones` — wide ethnic + fantasy spectrum (all major ethnicities + alien)
- `body_types` — wide variety (reject runway-thin-default)
- `fashion_scenes` — editorial backdrops (neon-alley / white-cyc / rain-street / mirrored-room / ornate-ballroom)
- `atmospheres` — smoke / light-streaks / rain / wind-in-hair / lens-flare
- `scene_palettes` — editorial color moods
- `lighting` — high-fashion lighting (hard-strobe / butterfly-beauty / rembrandt / backlit-silhouette / rim-light / jewel-gel)
- `hand_poses` (for nail-and-hand path) — editorial hand poses (holding champagne / adjusting earring / fanning cards / cradling jewel)

**Shared blocks:**
- `EDITORIAL_FASHION_BLOCK` (Vogue-cover production value, magazine-editorial energy, never snapshot)
- `DIVERSITY_BLOCK` (explicit ethnicity/body-type/age/style variety — reject runway-thin-white-default)
- `CONFIDENT_NOT_POSED_BLOCK` (alive + moving + presence, NOT runway-stiff)
- `NO_NAMED_CHARACTERS_BLOCK` (describe by features + outfit + vibe)
- `SOLO_COMPOSITION_BLOCK` (one character in frame)
- `NO_COZY_NO_SOFT_BLOCK` (GlamBot is BOLD/EDGY/HIGH-FASHION — never cozy-soft)
- `IMPOSSIBLE_BEAUTY_BLOCK` (editorial-photoshoot quality)
- `BLOW_IT_UP_BLOCK` — "The theme is the canvas, not the ceiling. Every path — makeup/fashion/hair/nails/avant-garde — must show CRAZY, impossible, maxed-out, show-stopping high-fashion work. Dial saturation, scale, complexity, detail, materials, impossibility to the limit within editorial tone. Never realistic, never tame, never what you'd see on a normal face/outfit. The kind of work that makes viewers stop-and-stare, screenshot, want to try to recreate. If it wouldn't get 10M views on TikTok/IG — dial it up."
### SteamBot ✅ FINALIZED

- **Theme:** Breathtaking steampunk worlds — brass + copper + clockwork + Victorian-industrial. BioShock-Infinite / Mortal-Engines / Hugo / Howl's-Moving-Castle / League-of-Extraordinary-Gentlemen / FFIX energy. Obsessive gear/rivet/steam-wisp detail. Victorian elegance meets industrial revolution meets impossible machinery.
- **Mixed scene/character** (scene-heavy + sexy-steampunk-woman character path)
- **Mediums:** `canvas`, `photography`, `illustration`
- **Vibes:** cinematic, dark, epic, nostalgic, peaceful, whimsical, ethereal, arcane, ancient, enchanted, fierce, coquette, voltage, nightshade, macabre, shimmer, surreal (inverts old `minimal/psychedelic/cozy`)
- **banPhrases:** none

**Paths (6):**
1. `steampunk-scene` — Character-by-role in rich steampunk setting (inventor in workshop, airship-pilot, corseted-goggled-engineer, automaton-butler)
2. `steampunk-landscape` — Vast steampunk cityscape / landscape at massive scale (brass-spire cities, airship-dock skies, clockwork-bridge mega-structures, Victorian-industrial sprawl). Pure environment
3. `contraption` — Fantastical steampunk machines in closeup (wide range — NOT just clocks). Instruments / automatons / alchemical / vehicles-in-miniature / living-hybrid / communication / weapons-tools / domestic-impossible
4. `airship-skies` — Airships in dramatic sky scenes (breaking through clouds, fleet over city, mid-storm, docking, cloud-gliding)
5. `cozy-steampunk` — Warm cozy steampunk pockets (inventor's-workshop with forge + tea, brass-parlor with mechanical-tea-service, observatory with telescope + maps, cozy airship cabin, Victorian library with mechanical book-arm, apothecary with brass herb-distillation)
6. `sexy-steampunk-woman` — Really-fucking-sexy steampunk woman candid solo (corseted airship-captain at helm, brass-prosthetic mechanic oiling gauntlets, Victorian-adventuress reloading steam-rifle, mad-scientist at workbench with cybernetic-goggle). Capable, dangerous-magnetic, steampunk-identity unmistakable

**pathWeights:**
- `steampunk-scene: 2`, `steampunk-landscape: 2`, `airship-skies: 2`, `cozy-steampunk: 2`, `sexy-steampunk-woman: 2`
- `contraption: 1`

**Axes to Sonnet-seed (50 each):**
- `steampunk_characters` — steampunk-character-by-role (inventor / engineer / airship-pilot / corseted-adventurer / mechanical-woman / goggled-mechanic / Victorian-explorer / clockwork-aristocrat)
- `steampunk_landscapes` — vast cityscapes / airship-docks / clockwork-skies / Victorian-industrial sprawl / brass-spire-cities / mechanical-bridges
- `contraption_types` — RANGE of fantastical steampunk devices (NOT clock-dominant): instruments / automatons / alchemical / vehicles-in-miniature / living-hybrid / communication / weapons-tools / domestic-impossible
- `airship_scenes` — airship dramatic moments (clouds / fleet / mid-storm / docking / cloud-gliding)
- `cozy_steampunk_settings` — cozy steampunk spaces (workshop / parlor / observatory / airship-cabin / Victorian-library / apothecary / brass-conservatory)
- `steampunk_women_candid_moments` — sexy steampunk women caught candidly + steampunk-specific action + gaslight/brass setting
- `steampunk_atmospheres` — steam-wisps / coal-smoke / gaslight-flicker / brass-dust / gear-oil-gleam / airship-sail-flutter / clockwork-ticks
- `lighting` — steampunk lighting (brass-glow / gaslight-warm / forge-amber / moonlit-copper / smoke-filtered-sun / cloud-shaft-through-airship-window)
- `scene_palettes` — steampunk color moods (brass-and-copper / Victorian-moody / sepia-industrial / fog-and-gold / smoke-and-flame)

**Shared blocks:**
- `STEAMPUNK_OBSESSIVE_DETAIL_BLOCK` (every gear/rivet/pipe rendered with max detail; warm brass+copper dominant; never sparse)
- `VICTORIAN_INDUSTRIAL_BLOCK` (Victorian elegance + industrial revolution power + impossible machinery; never modern or futuristic-sleek)
- `BLOW_IT_UP_BLOCK` (steampunk amplification: BioShock × Mortal-Engines × Howl's-Moving-Castle × 10; stack complexity + steam atmosphere + impossible mechanical invention)
- `IMPOSSIBLE_BEAUTY_BLOCK` (steampunk edition)
- `NO_NAMED_CHARACTERS_BLOCK` (character paths by role)
- `SOLO_COMPOSITION_BLOCK` (character paths)

**Path-specific blocks:**
- `STEAMPUNK_WOMAN_CANDID_BLOCK` (sexy-steampunk-woman path only: candid + unperformed + really-fucking-sexy + steampunk-capable; steampunk identity unmistakable; dangerous-magnetic underneath candid moment)
- `NO_POSING_BLOCK` (character paths)
- `HOT_AS_HELL_BLOCK` (sexy-steampunk-woman path — strict no-nipples/no-nude)
### TinyBot ✅ FINALIZED

- **Theme:** Clever + cute + "WHOA look at THAT" miniature magic. Tilt-shift photography / extreme macro / dollhouse-scale obsessive-detail. Every render makes viewer stop + lean in + smile + look twice. Cozy is ONE flavor — also surprising scale-play, tiny surreal juxtapositions, delight-through-smallness.
- **Scene-centric** (no humans, no characters — miniature world is the subject; tiny creatures OK in terrarium/macro paths)
- **Mediums:** `photography`, `animation`, `claymation`, `storybook`, `handcrafted`
- **Vibes:** cinematic, cozy, epic, nostalgic, psychedelic, peaceful, whimsical, ethereal, arcane, ancient, enchanted, coquette, voltage, nightshade, shimmer, surreal (inverts old `dark/fierce/macabre`)
- **banPhrases:** none

**Paths (6):**
1. `diorama` — Technical-wonder dollhouse-scale dioramas (train stations, cityscapes, ballrooms, medieval-castle cross-sections, markets). "Look at ALL THAT detail" wonder
2. `miniature-landscape` — Master-modelmaker miniature landscapes (rolling hills with countable trees, river-bridge, alpine, stone-cottage)
3. `macro-nature` — Real nature at miniature scale as fantasy-kingdom (mushroom-house, dewdrop-universe, acorn-pool, moss-forest, snail-cathedral)
4. `miniature-urban` — Tiny perfect urban scenes (downtown, café, market, subway, rooftop-village). Tilt-shift makes real things feel dollhouse
5. `tiny-cozy` — Warm-inviting-homey dollhouse-scale (bakery-with-pastries, tiny-library-with-fireplace, dollhouse-bedroom-with-cat, reading-nook-with-plants, micro-kitchen-with-copper-pots). "I want to shrink down and LIVE here"
6. `contained-worlds` — Any contained miniature world — classic terrariums + object-containers (teacup/eggshell/book/kettle/lunchbox/perfume-bottle/music-box) + surreal-tiny juxtapositions (tiny climbers on croissant, picnic on books, beach on clam-shell). Cute + clever. NOT sci-fi

**pathWeights:**
- `diorama: 2`, `contained-worlds: 2`, `tiny-cozy: 2`, `macro-nature: 2`
- `miniature-landscape: 1`, `miniature-urban: 1`

**Axes to Sonnet-seed (50 each):**
- `dollhouse_dioramas` — technical-wonder dollhouse scenes
- `miniature_landscapes` — handcrafted landscape dioramas
- `macro_nature_subjects` — real nature at miniature scale
- `miniature_urban_scenes` — miniature urban settings
- `tiny_cozy_scenes` — cozy homey dollhouse spaces (bakery/library/bedroom/nook/greenhouse/tea-shop/pottery-workshop)
- `contained_worlds` — classic terrariums + object-containers + surreal-tiny juxtapositions
- `tiny_creatures` — tiny scale-creatures for terrarium + macro-nature (lizards/frogs/beetles/snails/butterflies/pixies/fae/ants)
- `tilt_shift_lighting` — miniature-feel lighting (warm-golden-hour / glow-from-within / window-light / diorama-studio / morning-dew)
- `atmospheres` — micro-scale particles (pollen-motes / dust-mote / fairy-glow / miniature-steam / micro-rain / tiny-pollen-cloud)
- `scene_palettes` — miniature-warm palettes (sunny-warm / cozy-amber / dappled-green / pastel-soft / dreamy-peach / storybook-pastel)

**Shared blocks:**
- `TILT_SHIFT_MINIATURE_BLOCK` (shallow DOF, tilt-shift effect, macro-lens-feel, dollhouse-scale IS the art)
- `OBSESSIVE_MICRO_DETAIL_BLOCK` (every tiny detail countable; stare-for-5-minutes quality)
- `CLEVER_CUTE_WHOA_BLOCK` (stop + lean in + smile + look twice energy — clever + cute + surprising + cozy-when-appropriate, never just pretty-miniatures)
- `NO_HUMANS_BLOCK` (no people; tiny creatures OK in terrarium/macro paths)
- `BLOW_IT_UP_BLOCK` (miniature amplification — snow-globe-world quality × 10; if viewer doesn't want to shrink down + live in it, dial up)
- `IMPOSSIBLE_BEAUTY_BLOCK` (miniature edition)

**Path-specific blocks:**
- `TINY_COZY_WARMTH_BLOCK` (tiny-cozy only: warm-inviting-homey, lived-in-quality, tiny-cozy-details)
- `CONTAINED_WORLD_SURREAL_BLOCK` (contained-worlds only: loose "container" includes teacups/eggshells/books; surreal-tiny juxtapositions welcome — cute + clever, NEVER sci-fi / dark / horror)
### InkBot ❌ RETIRED (not migrating)

Kevin killed this bot during path review — don't migrate. At batch-migration time:
- Remove `inkbot` entry from `scripts/generate-bot-dreams.js` BOTS map
- Remove `inkbot` from `.github/workflows/bot-dreams.yml` bash array
- Do NOT create `.github/workflows/inkbot.yml`
- Do NOT create `scripts/bots/inkbot/` directory
- The `inkbot` user account remains in DB (don't delete) — just stops posting
- Any existing `bot_seeds` rows with `category LIKE 'inkbot_%'` can stay as historical records (don't delete per CLAUDE.md hard rule about seed tables)
### TitanBot ✅ FINALIZED

- **Theme:** Mythology across ALL world pantheons at epic scale. Gods, titans, deities, mythic battles, legendary landscapes, gnarly mythic creatures, sexy mythic women, cozy mythic places. Renaissance-painting × concept-art production quality.
- **Mixed scene/character** (deities + creatures + mythic women — all described by role + pantheon, never named)
- **Mediums:** `canvas`, `photography`, `render`
- **Vibes:** cinematic, dark, epic, nostalgic, psychedelic, ethereal, arcane, ancient, enchanted, fierce, coquette, voltage, nightshade, macabre, shimmer, surreal (inverts old `minimal/cozy/whimsical/peaceful`)
- **banPhrases:** none

**Paths (6):**
1. `deity-moment` — God/titan in divine-action-moment (thunder-god mid-thunderbolt, death-god weighing soul, dawn-goddess stepping from cave, dance-god mid-destruction)
2. `mythological-landscape` — Sacred mythic realm, no characters (Olympus, Valhalla, Avalon, Mictlan, Asgard, Takamagahara, Tir-na-nOg, Aztec-Xibalba, African-creation-pools)
3. `epic-battle` — Cosmic-scale mythic battle (end-times gods-vs-giants, titan-fall, hero-vs-world-monster, sky-splitting divine war)
4. `mythic-creature` — GNARLY visceral mythic creatures. Multi-elemental Hydras, stone-cracking Medusas, bronze-fused Minotaurs, barnacle-krakens. NEVER cute — always ancient + powerful + gnarly
5. `mythic-women` — ANY mythic female (goddess / heroine / monster-woman / sorceress / spirit / cursed-being / Medusa / Lamia / Valkyrie / Kitsune-woman). Candid unsuspecting moment, REALLY FUCKING SEXY + cool-looking, doing something specific (resting / preparing / bathing / gazing). Voyeuristic "caught her" angle. Solo
6. `cozy-mythic` — Warm quiet mythic pockets. Inhabited cultural spaces (Greek symposium / Norse longhouse / Japanese tea-house / Aztec stone-bath / Celtic druid-cottage) + natural mythic-nature (sacred grove / kami-meadow / fox-spirit-oak / sleeping-dragon-cave). Pantheon diversity. Peripheral mythic creatures at rest

**pathWeights:**
- `mythological-landscape: 2`, `deity-moment: 2`, `mythic-women: 2`, `mythic-creature: 2`, `cozy-mythic: 2`
- `epic-battle: 1`

**Axes to Sonnet-seed (50 each):**
- `deities` — god/titan archetypes across pantheons (by role+domain+culture, never named)
- `pantheons_and_regalia` — cultural anchors + signature regalia
- `mythological_landscapes` — specific mythic-realm landscapes
- `epic_battles` — cosmic-battle setups
- `mythic_creatures` — GNARLY reimagined creatures (amplified, stacked features, Bloodborne-meets-myth energy)
- `mythic_women_candid_moments` — any mythic female + candid action + sexy/striking visual
- `cozy_mythic_settings` — inhabited + natural cozy-mythic across pantheons
- `atmospheres` — divine-phenomena (golden-dust / star-fall / cosmic-embers / divine-mist / glowing-glyphs / petals-of-fate)
- `lighting` — divine lighting (god-rays / cosmic-dawn / golden-corona / temple-candlelight / underworld-glow / divine-aura)
- `scene_palettes` — mythic color moods (golden-god / blood-crimson / deep-violet-underworld / dawn-peach-heaven / jade-and-turquoise / sepia-ancient)
- `architectural_elements` — mythic architecture (marble temple / ziggurat / pagoda / stone-circle / sacred-grove / rainbow-bridge)

**Shared blocks:**
- `MYTHIC_SCALE_BLOCK` (cosmic scale — gods 100-ft-tall, battles rip skies, artifacts shake universes)
- `PANTHEON_DIVERSITY_BLOCK` (rotate across ALL world mythologies — avoid Greek/Norse clustering)
- `NO_NAMED_DEITIES_BLOCK` (describe by role+pantheon — never "Zeus" / "Odin" / "Anubis")
- `RENAISSANCE_CONCEPT_ART_BLOCK` (painterly grandeur, never generic-RPG-art)
- `BLOW_IT_UP_BLOCK` (mythic amplification — book-cover × classical-oil × concept-art quality)
- `IMPOSSIBLE_BEAUTY_BLOCK` (mythic-sublime edition)

**Path-specific blocks:**
- `GNARLY_CREATURE_BLOCK` (creatures never cute/rounded; visceral + ancient + wild — Bloodborne-meets-myth stacking 4-5 grotesque-beautiful features)
- `MYTHIC_WOMEN_CANDID_BLOCK` (candid, unperformed, REALLY-FUCKING-SEXY + cool-looking, solo, mythic-identity unmistakable, dangerous-magnetic energy)
- `WARM_QUIET_MYTHIC_BLOCK` (cozy-mythic only: peaceful inhabited + natural spaces, tame magic, peripheral spirits at rest, pantheon rotation)
- `NO_POSING_BLOCK` + `SOLO_COMPOSITION_BLOCK` (character paths)
### PixelBot ✅ FINALIZED (renamed from ArcadeBot)

- **Rename at migration:** `users.username` from `arcadebot` → `pixelbot`. Update old `generate-bot-dreams.js` BOTS removal + new workflow filename accordingly. Flag to Kevin before DB rename.
- **Theme:** PIXEL-ART MEDIUM specialist. Every render is pixel art — 16-bit SNES-era saturation / 32-bit polished / modern-indie-pixel (Celeste / Stardew / Hades-lite / Hyper-Light-Drifter energy). Subjects are universal + generic — dragons, forests, spaceships, cozy bedrooms, characters — all rendered in pixel art. NO IP references. The bot's identity IS the medium.
- **Mixed scene/character** (path-dependent)
- **Mediums:** `pixels` (locked — defining feature)
- **Vibes:** cinematic, dark, epic, nostalgic, psychedelic, whimsical, ethereal, arcane, enchanted, fierce, coquette, voltage, nightshade, macabre, shimmer, surreal (inverts old `ancient/cozy/peaceful`)
- **banPhrases:** none

**Paths (6):**
1. `pixel-pretty` — Pure pretty scenes in pixel art (cherry-blossom paths, snow-mountain vistas, lavender fields, aurora lakes, firefly meadows). No genre, no characters, no action — just beauty. Flagship-quality
2. `pixel-fantasy` — Pixel fantasy scenes (dragons, castles, wizards, elves, rune-stones)
3. `pixel-cozy` — Pixel cozy scenes (bedrooms with CRTs, tiny cottages, pixel cafes, winter cabins, sunny apartment windows)
4. `pixel-sci-fi` — Pixel cyberpunk alleys / spaceships / alien planets / vaporwave-adjacent
5. `pixel-character-moment` — Generic pixel archetypes in context (hooded warrior / pixel sorceress / pixel ronin / pixel astronaut / pixel druid). Candid, solo
6. `pixel-action` — Pixel dynamic action-moments (dragon breath, warrior leap, spaceship dogfight, monster standoff)

**pathWeights:**
- `pixel-pretty: 2`, `pixel-fantasy: 2`, `pixel-cozy: 2`
- `pixel-sci-fi: 1`, `pixel-character-moment: 1`, `pixel-action: 1`

**Axes to Sonnet-seed (50 each):**
- `pixel_pretty_scenes` — pure pretty-scene subjects (cherry-blossom / snow-mountain / coastal-lighthouse / lavender-field / forest-stream / tropical-beach / koi-pond / aurora-lake / nebula-sky / firefly-meadow)
- `pixel_fantasy_subjects` — dragons / castles / wizards / elves / knights / runes / magic-artifacts
- `pixel_sci_fi_subjects` — cyberpunk alleys / spaceships / alien planets / robots / vaporwave scenes / futuristic cities
- `pixel_cozy_subjects` — bedrooms with CRT / cottages / ramen shops / cafes / libraries / winter cabins
- `pixel_characters` — generic archetypes (hooded-warrior / sorceress / ronin / astronaut / druid / mage-apprentice / knight / explorer / cyberpunk-runner)
- `pixel_action_moments` — action setups (dragon-breath / warrior-leap / dogfight / monster-standoff / airship-storm)
- `pixel_environments` — cross-path backgrounds (forests / mountains / underground / ocean-coast / volcano / neon-city / space-void / tundra)
- `pixel_lighting` — pixel-rendered lighting (torch-glow / sunset-pixel / neon-pink / moonlit-blue / dragon-fire / CRT-scanline-overlay)
- `scene_palettes` — classic pixel-art palettes (NES 2-bit subset / SNES pastel / gameboy-green / pico-8 / CGA / modern-indie-pixel)
- `atmospheres` — pixel atmosphere particles (pixel-rain / pixel-snow / pixel-embers / pixel-fog / pixel-dust / pixel-fireflies / scanline-glow)

**Shared blocks:**
- `PIXEL_ART_ONLY_BLOCK` (16-bit / 32-bit / modern-indie-pixel aesthetic — visible pixels, limited palettes, dithering; NEVER photorealistic / 3D-render / vector-smooth)
- `NO_IP_REFERENCES_BLOCK` (generic subjects only — never named franchises / characters; evoke style never IP)
- `BLOW_IT_UP_BLOCK` (pixel amplification — max atmospheric detail, stack particles, gallery-wall-poster-quality indie-pixel × 10)
- `IMPOSSIBLE_BEAUTY_BLOCK` (pixel-art edition)

**Path-specific blocks:**
- `PIXEL_PRETTY_BLOCK` (pixel-pretty path only: no genre / no characters / no action — pure serene nature + light + atmosphere as gallery-quality pixel art)
### OceanBot ✅ FINALIZED (NEW BOT — no old config to migrate)

- **Theme:** Underwater + sea-life specialist. `wave` + `coastal-vista` moved to BeachBot — OceanBot is now pure beneath-the-surface + marine-creature territory.
- **NEW BOT** — no existing `users.username = 'oceanbot'` row; must create user account + avatar before cutover
- **Mixed** scene-centric + creature-subject
- **Mediums:** `photography`, `canvas`, `watercolor`, `pencil`
- **Vibes:** cinematic, dark, cozy, epic, nostalgic, psychedelic, peaceful, whimsical, ethereal, arcane, ancient, enchanted, fierce, coquette, voltage, nightshade, macabre, shimmer, surreal
- **banPhrases:** none

**Paths (5):**
1. `reef-life` ⭐ **FLAGSHIP** — MAXED-OUT reef + tropical fish abundance. Many fish + many coral species + many colors per frame. Density + movement + sunbeams-through-water
2. `deep-creature` — Real + mythic marine beasts. Real-amplified (whale shark / humpback / orca / great white / giant octopus) AND mythic (Kraken / Leviathan / sea-serpent / ancient-deep-things)
3. `marine-portrait` — ONE real ocean creature as sole hero. Candid expert-aquatic-photographer portrait. Perfect composition + lighting + backdrop. Razor-sharp detail. Real creatures only
4. `underwater-world` — Vast underwater ecosystems. Kelp forests / shipwrecks / underwater canyons / cenotes / arctic under-ice / underwater caves. PURE underwater environment
5. `after-dark` — Ocean in glowing-dark moments. Bioluminescent plankton + glowing jellyfish / comb-jellies / firefly-squid swarms / moonlit-ocean + silver-reflection / Milky-Way-over-calm-water / starfield-reflection / aurora-over-sea / twilight-reef with glowing coral / sunset-aftermath peaceful mirror-reflection / lightning-over-sea. Low-light + luminous atmosphere is hero. Between GlowBot and pure nighttime ocean photography

**pathWeights:**
- `reef-life: 3` (flagship)
- `after-dark: 2`, `deep-creature: 2`, `marine-portrait: 2`
- `underwater-world: 1`

**Axes to Sonnet-seed (50 each):**
- `reef_scenes` — rich stacked reef scenes
- `deep_creatures` — mix real marine + mythic sea-beasts
- `marine_portrait_subjects` — single real marine hero + candid moment + backdrop + lighting
- `underwater_environments` — kelp-forests / shipwrecks / cenotes / under-ice / underwater-caves
- `after_dark_ocean_scenes` — glowing-dark ocean moments (bioluminescent plankton / glowing jellyfish / firefly-squid / moonlit-silver / Milky-Way-reflection / aurora-over-sea / twilight-reef / lightning / sunset-aftermath-peaceful)
- `ocean_atmospheres` — sunbeam-through-water / bioluminescent-plankton-glow / particulate-drift / god-rays-underwater / moonlight-glitter / bio-cyan-trails
- `lighting` — underwater + low-light lighting (sunbeams-through-water-column / god-rays / filtered-blue-gradient / bioluminescent-glow / moonlit-silver / starfield)
- `scene_palettes` — ocean color moods (turquoise-tropical / deep-navy / bioluminescent-blue / arctic-white / moonlit-silver / twilight-purple / after-sunset-coral)

**Shared blocks:**
- `OCEAN_IS_HERO_BLOCK` (ocean/water/creatures is always subject)
- `BLOW_IT_UP_BLOCK` (ocean amplification — Nat-Geo × 10 quality, stack atmospheric drama + lighting + detail)
- `IMPOSSIBLE_CLARITY_BLOCK` (creature paths — razor-sharp detail)
- `IMPOSSIBLE_BEAUTY_BLOCK` (ocean edition)
- `NO_PEOPLE_BLOCK`

**Path-specific blocks:**
- `REEF_EXPLOSION_BLOCK` (reef-life: maxed abundance dialed to 11; if it looks sparse dial up 3×)
- `MYTHIC_SEA_CREATURES_WELCOME_BLOCK` (deep-creature: real + mythical both welcome)
- `AQUATIC_PORTRAIT_BLOCK` (marine-portrait: ONE real creature hero + candid + expert aquatic-photography)
- `AFTER_DARK_OCEAN_BLOCK` (after-dark: low-light + luminous atmosphere is hero; bioluminescence/moonlight/starfield/glowing-jellies/aurora/twilight-reef/peaceful-reflection/lightning-drama; always beautiful-awe-inspiring, never horror-gory)

---

### BeachBot ✅ FINALIZED (NEW BOT — no old config)

- **Theme:** Stunning beach settings. Tropical paradise, dramatic rocky coasts, beach-life atmosphere, sunset beaches, hidden coves. The JOY of being at the beach captured as wallpaper-worthy scenes. BLOWN UP to 10× across every path — crystal water, saturated skies, dramatic lighting, impossibly gorgeous. Every render makes viewer want to book a flight.
- **NEW BOT** — no existing `users.username = 'beachbot'` row; must create user account + avatar before cutover
- **Scene-centric** (no humans; boats / huts / umbrellas / beach-objects OK as scale)
- **Mediums:** `photography`, `canvas`, `watercolor`, `pencil`
- **Vibes:** cinematic, cozy, epic, nostalgic, peaceful, whimsical, ethereal, ancient, enchanted, coquette, voltage, shimmer, surreal (drops `dark/fierce/macabre/nightshade/arcane/psychedelic` — BeachBot is brighter-happier)
- **banPhrases:** none

**Paths (7):**
1. `coastal-vista` *(moved from OceanBot)* — Wallpaper-worthy dramatic CRAGGY coastlines + water-eroded features (sea-stacks, arches, eroded cliffs) + striking sea-color + dramatic weather/light
2. `wave` *(moved from OceanBot)* — Clark-Little-inspired signature wave photography. Unusual perspectives + rich backdrops
3. `tropical-paradise` — Crystal-water dreamy-destinations (Maldives / Bora Bora / Bahamas / Thai-islands / Seychelles / Philippines / Fiji). Palm trees + turquoise water + white/pink sand
4. `beach-landscape` — Wide POSTCARD of any beach + its full context + any weather/time. Overlook-from-cliff / from-out-in-water / entire-bay / through-palms / pulled-back-sand. ALL beach types + all weathers + all times-of-day
5. `tide-pool` — Intimate tide-pool beauty (starfish-arrays / anemones / kelp / sea-urchins + hermit-crabs). Crystal-clear shallow detail
6. `beach-moment` — Specific atmospheric beach-object moments (hammock-between-palms / lounge-chair + footprints / driftwood-and-shells / beach-umbrella + table / sandcastle / surfboard-silhouette). Beach-objects tell the story
7. `cozy-beach` — Coastal villages / huts / lighthouses / coastal cottages (small Mediterranean fishing village / colorful Caribbean coastal town / Greek whitewashed steps / lighthouse on misty cliff / New-England coastal cottage / pier café)

**pathWeights:**
- `beach-landscape: 2`, `tropical-paradise: 2`, `coastal-vista: 2`, `wave: 2`, `cozy-beach: 2`
- `tide-pool: 1`, `beach-moment: 1`

**Axes to Sonnet-seed (50 each):**
- `coastal_vistas` — craggy-geography + sea-color + weather/light combined
- `wave_moments` — Clark-Little-style perspectives (inside-tube / close-up-crest / through-curtain / water-level)
- `tropical_paradise_scenes` — specific tropical-paradise destinations
- `beach_landscape_scenes` — wide postcard combos (beach-type + composition-angle + weather/time)
- `tide_pool_scenes` — specific tide-pool subjects
- `beach_moments` — atmospheric beach-object moments
- `cozy_coast_scenes` — warm coastal pockets (fishing villages / beach huts / lighthouses / cottages)
- `sea_colors` — specific sea-color-states
- `coastal_weather_moments` — golden-hour / blue-hour / storm / mist / moonlit / post-rain-rainbow / aurora
- `atmospheres` — sand-blow / sea-spray / mist-over-water / palm-frond-shadow / seagull-drift / sunlight-sparkle-on-water

**Shared blocks:**
- `BEACH_PARADISE_BLOCK` (beach-joy energy — crystal water, warm light, "I want to be there right now" feeling)
- `WALLPAPER_WORTHY_BLOCK` (every render is phone-wallpaper / wall-poster quality; never generic)
- `BLOW_IT_UP_BLOCK` (beach amplification — "Stack tropical saturation + dramatic light + atmospheric detail + perfect composition. Nat-Geo-Travel × 10. If viewer wouldn't book a flight looking at it — dial up." — applies UNIVERSALLY across ALL paths including coastal-vista and wave)
- `NO_PEOPLE_BLOCK` (no humans; scale-objects OK)
- `IMPOSSIBLE_BEAUTY_BLOCK` (beach/paradise edition)
- `DRAMATIC_LIGHTING_BLOCK`

**Path-specific blocks:**
- `CLARK_LITTLE_WAVE_BLOCK` (wave path: unusual angles + rich backdrops + signature surf-photographer style)
- `POSTCARD_WIDE_ANGLE_BLOCK` (beach-landscape path: wide postcard composition; beach + surroundings + weather combined per frame)

---

### DinoBot ✅ FINALIZED (NEW BOT — no old config)

- **Theme:** Dinosaurs at Jurassic-concept-art quality. Photoreal + cinematic. Majesty + scale + primal beauty. Species-accurate anatomy rendered dramatically.
- **NEW BOT** — no existing `users.username = 'dinobot'` row; must create user account + avatar before cutover
- **Subject-centric** (dinosaur present in most paths; paleo-landscape may have distant dinos only)
- **Mediums:** `photography`, `canvas`, `illustration`
- **Vibes:** cinematic, dark, cozy, epic, nostalgic, ethereal, ancient, enchanted, fierce, voltage, nightshade, shimmer, surreal (drops `minimal/whimsical/coquette/macabre/psychedelic`)
- **banPhrases:** none

**Paths (5):**
1. `dino-portrait` — Single dinosaur as hero (T-Rex close-range roar with breath-steam, Velociraptor intense eye-contact, Triceratops golden-hour dust, Spinosaurus emerging from water). Razor-sharp species detail
2. `dino-action` — Dynamic frozen-action (T-Rex chasing, Velociraptor pack mid-hunt, predator-clash, Pterodactyl diving, sauropod running). Jurassic-cinematic peak-moments. No gore
3. `paleo-landscape` — Prehistoric-Earth landscape (Carboniferous fern-swamp, Jurassic coastline with volcanic peaks, Cretaceous valley with distant sauropod silhouette). World is the subject; distant dinos as scale-element OK
4. `dino-pack` — Herd/flock scenes (sauropod herd with babies, Triceratops watering hole, hadrosaur stampede, pterodactyl flock over sea-stacks). Wildlife-documentary scale
5. `dino-cozy` — Cozy prehistoric moments (mother with eggs in nest at golden-hour, sauropod drinking from misty pond, small theropod sheltering from rain under giant ferns, baby dinosaurs playing in clearing, pterodactyl cliff-ledge roost at sunset). Tender + warm contrast to dramatic paths

**pathWeights:**
- `dino-portrait: 2`, `dino-action: 2`, `paleo-landscape: 2`, `dino-cozy: 2`
- `dino-pack: 1`

**Axes to Sonnet-seed (50 each):**
- `dino_species` — accurate species with signature features (T-Rex / Velociraptor / Triceratops / Stegosaurus / Brachiosaurus / Spinosaurus / Ankylosaurus / Pterodactyl / Pteranodon / Archaeopteryx / Parasaurolophus / Allosaurus / Deinonychus / Microraptor / Carnotaurus / Iguanodon / Dreadnoughtus / Mosasaur / Plesiosaur)
- `prehistoric_settings` — era-specific (Cretaceous forest / Jurassic coastline / Carboniferous swamp / Triassic desert / Early-Cretaceous plain / volcanic-era highlands)
- `dino_actions` — dynamic action moments (roaring / chasing / hunting / diving / splashing / tail-swing / eye-to-camera / emerging-from-water / clashing-horns)
- `pack_scenes` — herd/flock compositions (sauropod-herd-with-babies / Triceratops-watering-hole / Velociraptor-pack / hadrosaur-stampede / pterodactyl-flock)
- `cozy_dino_moments` — tender prehistoric vignettes (nest-with-eggs / baby-playing / sheltering-from-rain / pond-drinking / sunlit-grove-family / cliff-ledge-roost)
- `prehistoric_atmospheres` — era atmospheres (volcanic-ash / jungle-mist / cretaceous-dust / primordial-steam / warm-morning-haze / sunset-golden)
- `lighting` — dino-scene lighting (golden-hour / blue-hour / storm-light / dappled-canopy / dawn-mist / lightning-flash / sunset-backlit)
- `dino_visual_cues` — species-specific cues (breath-steam / dust-from-footfall / feather-fluff / scale-highlight / wet-shine / mud-on-legs)
- `scene_palettes` — prehistoric color moods (amber-jungle / volcanic-red-gray / misty-blue-green / ancient-sepia / dramatic-storm / dusk-crimson)

**Shared blocks:**
- `DINOSAUR_IS_HERO_BLOCK` (dinos are subject/world; every render carries primal prehistoric energy)
- `SPECIES_ACCURATE_BLOCK` (scientifically-informed anatomy — feathers where known, correct proportions, real species) + Jurassic-concept-art-dramatic-rendering
- `BLOW_IT_UP_BLOCK` (prehistoric amplification — Jurassic-Park-concept-art × 10)
- `NO_GORE_BLOCK` (predator-prey moments OK but never explicit gore/dismemberment/blood-spatter — dread + tension only)
- `NO_HUMANS_BLOCK` (prehistoric era, no humans)
- `IMPOSSIBLE_BEAUTY_BLOCK` (dino edition — Jurassic-cinematic-concept-art)
- `DRAMATIC_LIGHTING_BLOCK`
- `NO_JURASSIC_PARK_NAMES_BLOCK` (evoke Spielberg / Jurassic-concept-art aesthetic without naming the franchise)

### ToyBot ✅ FINALIZED

- **Theme:** Every render is CINEMATIC toy-world storytelling. Toys are not sitting there — scenes are action-packed movie-stills. Each path pegged to a specific toy medium. The toy-ness is the art; dramatic lighting elevates the medium into cinematic work.
- **Mixed scene/character** (character paths have toy-characters; toy-landscape is pure environment)
- **Mediums:** locked per path via `mediumByPath` (heavy use of this feature)
- **Vibes:** cinematic, cozy, epic, nostalgic, peaceful, whimsical, ethereal, arcane, ancient, enchanted, coquette, voltage, nightshade, shimmer, surreal (inverts old `dark/fierce/psychedelic/macabre`)
- **banPhrases:** none

**Paths (6):**
1. `lego-epic` — LEGO scenes with minifigure action (castles, space stations, pirate battles). Brick-everything
2. `claymation` — Clay/Play-Doh scenes with clay-characters (Wallace-Gromit / Coraline / Laika energy)
3. `vinyl` — Funko-Pop-style vinyl figure dioramas (Kidrobot / designer-toy)
4. `action-figure` — 80s/90s action-figure cinematic dioramas with toy-scale drama
5. `sackboy` — LBP-style fabric-world + stitched-Sackboy-style characters (everything in the world is fabric/felt/yarn/paper/cardboard)
6. `toy-landscape` — NO characters. Epic landscape scenes rendered entirely in toy medium (brick-waterfalls, clay-mountains, vinyl-cliffs). Landscape is hero, toy-ness is the art

**mediumByPath (new mediums: `action-figure`, `stitched`):**
```js
mediumByPath: {
  'lego-epic': 'lego',
  'claymation': 'claymation',
  'vinyl': 'vinyl',
  'action-figure': 'action-figure',   // NEW bot-only medium
  'sackboy': 'stitched',              // NEW bot-only medium (LBP-fabric-world)
  'toy-landscape': ['lego', 'lego', 'lego', 'claymation', 'vinyl'],  // weighted LEGO-heavy
}
```
Both `action-figure` + `stitched` are bot-only mediums (NOT added to public `dream_mediums` table — same pattern as VenusBot's `surreal`).

**pathWeights:**
- `lego-epic: 2`, `toy-landscape: 2`
- `claymation: 1`, `vinyl: 1`, `action-figure: 1`, `sackboy: 1`

**Axes to Sonnet-seed (50 each):**
- `lego_scenes` — epic LEGO scene types (castle siege / space station / pirate battle / city street / dragon battle)
- `claymation_scenes` — stop-motion clay scenes (Wallace-Gromit domestic / Coraline-charming / Kubo-whimsical / Play-Doh-vivid)
- `vinyl_dioramas` — Funko-Pop-style figure settings (samurai-bonsai / astronaut-moon / knights-castle / noir-detective / wizard-tower / pirate-ship)
- `action_figure_battles` — 80s/90s action-figure dioramas (robot-battle / barbarian-siege / space-marine-moonbase / ninja-rooftop / kaiju-city)
- `sackboy_scenes` — LBP-style fabric-world scenes (fabric-cotton-cloud world / burlap-dungeon / felt-grass hillside / cardboard-village rescue / felt-moon astronaut / paper-cherry-blossom samurai / knit-snowland / yarn-forest)
- `toy_landscapes` — pure landscape-in-toy-medium (LEGO-brick-mountain / clay-valley / vinyl-coast / LEGO-desert-canyon / claymation-winter-forest)
- `lighting` — cinematic toy-photography lighting (dramatic-studio / explosion / warm-practical / tabletop-daylight / atmospheric-dust-motes)
- `atmospheres` — practical-set atmospheres (explosion smoke / tabletop dust / cotton clouds / glitter mist)
- `scene_palettes` — toy-world color moods (bold primary / 80s-saturated / pastel-cozy / noir-moody / fantasy-warm / sci-fi-cool)

**Shared blocks:**
- `TOY_PHOTOGRAPHY_BLOCK` (render as real physical toy photographed in handcrafted set with dramatic cinematic lighting; toy-ness is the art; never render as "real" version)
- `CINEMATIC_STORY_BLOCK` (every render is a MOVIE STILL — something happening, action mid-charge, explosion frozen, mid-leap. Never "toy-on-shelf". Narrative + tension + dynamic composition)
- `DRAMATIC_LIGHTING_MAKES_CHEAP_LOOK_EPIC_BLOCK` (lighting elevates plastic/clay/fabric to cinematic status)
- `PATH_MEDIUM_LOCK_BLOCK` (each path locks to its medium — NEVER mix LEGO in claymation scene, etc.)
- `BLOW_IT_UP_BLOCK` (toy amplification — stack medium-signature detail: LEGO studs + printed minifig faces + transparent brick-water; clay fingerprints + painted-eyes; vinyl glossy sheen + oversized head; action-figure joint-articulation + explosion effects; stitched-fabric textures + button-eyes + yarn-hair)
- `IMPOSSIBLE_BEAUTY_BLOCK` (toy-photography edition — dramatic-cinematic-plastic/clay/fabric)

**Path-specific blocks:**
- `SACKBOY_EVERYTHING_BLOCK` (sackboy path only: entire world is handcrafted fabric/felt/yarn/paper/cardboard/stitching/buttons/zippers. Never just characters — the whole world is handmade texture)
- `TOY_LANDSCAPE_BLOCK` (toy-landscape path only: NO characters/figures/minifigs. Every element of landscape made of the path's toy medium. Toy-ness of landscape is the art. Still cinematic composition)
