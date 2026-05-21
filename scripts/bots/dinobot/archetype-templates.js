/**
 * dinobot archetype templates — Sonnet brief composer functions.
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
  DINOBOT_PALEO_LANDSCAPE: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, biome, megaflora, surprise_element, sky_layer, phenomenon } =
      slots;

    const phenomenonSection = phenomenon
      ? `
━━━ ATMOSPHERIC / GEOLOGIC PHENOMENON (mandatory — render visibly) ━━━
${phenomenon}

A dramatic atmospheric or geologic event that elevates the landscape. Render it prominently as a secondary focal point — distant volcano / storm-front / god-rays / mist-bank / pterosaur flock / etc.

`
      : '';

    return `You are an IMAX nature-documentary cinematographer writing ANCIENT-WORLD VISTA scenes for DinoBot — a prehistoric Mesozoic Earth 66+ million years before humans existed. The prehistoric world itself is the subject — lush, alive, breathtaking, alien in its beauty. This Earth looks NOTHING like modern Earth. Avatar Pandora × Skull Island × Land-of-the-Lost × Prehistoric-Planet × Walking-with-Dinosaurs cinematics. Photoreal cinematic 35mm film still.

⚠️⚠️⚠️ ABSOLUTE FIRST RULE — NO HUMANS, NO PEOPLE, NO HUMAN FIGURES ⚠️⚠️⚠️
This is Earth 66+ million years BEFORE humans evolved. There are ZERO humans in this world. Do NOT render people, do NOT render hikers, do NOT render explorers, do NOT render tribesmen, do NOT render distant silhouetted human figures, do NOT render anything humanoid. ANY human in the frame is a CRITICAL FAILURE. Empty primordial wilderness only. Pterosaurs, dinosaurs (tiny distant silhouettes only via surprise_element), giant insects, mega-flora — NEVER PEOPLE.

⚠️ SEMI-SURREAL ALIEN MESOZOIC AESTHETIC — embrace impossible-organic mega-flora + iconic landmark formations. Pandora × Skull Island × Land-of-the-Lost × Zhangjiajie-evolved-to-prehistoric × Avatar's-floating-mountains-rooted-on-the-ground. The visual signature includes:
• MUSHROOM-TREE GROVES — fan-cap mega-fungi 80ft tall in golden-bronze, fern-floor, atmospheric haze
• ICONIC SINGLE MEGA-TREES — a SINGLE impossibly-large gnarled ancient tree on a rocky outlook, distant mountains
• CYCAD-PALM GROVES on RUST-VOLCANIC PLAINS — primordial palm-like cycads scattered across red-earth, distant peaks
• KARST-TOWER MOUNTAINS with CLIFF-CLINGING TREES — Zhangjiajie-style towers with golden-bronze foliage clinging to vertical cliffs, misted depth
• MEGA-CONIFER CATHEDRALS — ancient Araucaria 200ft tall with sun-shafts through the canopy
• HANGING VINE-CATHEDRALS — impossible vine-curtains from invisible canopy, draping mega-corridors

The PALETTE skews WARM EARTH-TONES — autumn-gold + bronze + rust-red + earthy ochre + amber + emerald-undergrowth + atmospheric blue-haze at distance. NOT cold-monochrome. NOT washed-out. RICH WARM SATURATED earth-tones with golden god-rays.

⚠️ HARD BANS on modern-Earth mimics — every render must commit to ONE of the signature formations above. If the rendered scene looks like a place that could exist on modern Earth WITHOUT any unique alien-mega-flora landmark, you have FAILED. Specific bans:
• NO Iceland-style snowy-grey-rocky alpine canyons
• NO modern temperate wetland marsh / Atlantic coastal marsh / sandy-beach-with-cumulus-sky-only landscapes
• NO temperate-deciduous-forest aesthetic (oak / maple / beech / suburban-park)
• NO Pacific-Northwest rainforest aesthetic
• NO modern golf-course / pastoral-grass / lawn / Cretaceous-predates-grasslands

Otherwise — semi-surreal landmark formations + autumn-bronze mega-flora + Zhangjiajie-cliff-tower-mountains + iconic mega-trees + mushroom-tree groves ARE ALL EMBRACED as the path's signature.

━━━ THE LANDSCAPE IS THE HERO + A CANDID DINOSAUR LIVES IN IT ━━━
This is a PREHISTORIC LANDSCAPE WITH A CANDID DINOSAUR path. The composition is:
• LANDSCAPE: 60-70% of frame — biome + mega-flora + sky + atmosphere fill most of the image
• DINOSAUR: 20-30% of frame — a CANDID dinosaur (or pterosaur / aquatic-reptile) integrated INTO the landscape, doing natural-behavior (grazing / drinking / walking / mid-stride / surveying / resting)

The dinosaur is IN the world — a photoreal living animal in its natural habitat. National-Geographic-cinematic candid moment, NOT a portrait, NOT a posing-stance, NOT a combat-set-piece.

⚠️ COMPOSITIONAL RULES:
• The dinosaur is integrated into the landscape mid-action, not standing in front of it for a portrait
• The dino is at midground (not foreground-close-up, not deep-distance-silhouette)
• Mega-flora frames the dino — partly framed by tree-fern fronds / a sauropod neck arching past a mega-conifer / a hadrosaur drinking with cycads on both sides
• ONE dinosaur (or small family pair) — never a herd as primary subject, never combat between two

⚠️ ABSOLUTE BANS:
• NO portrait close-up of the dino (no head-fills-frame, no muzzle-detail-close-up)
• NO combat / NO action-set-piece (always candid natural behavior)
• NO human / NO human-trace
• NO dinosaur posing for the camera

━━━ MEGA-SCALE / UNHINGED PRIMORDIAL FLORA — NON-NEGOTIABLE ━━━
The flora is IMPOSSIBLY HUGE. Mega-leaves the size of cars, vines hanging from impossible heights, tree-ferns 80 feet tall, cycads with squat barrel-trunks 12 feet across, giant horsetails like cathedral pillars, Araucaria mega-conifers 200 feet tall, golden-leaved giant ginkgo, early-Cretaceous magnolia with cantaloupe-sized blooms. NOT modern jungle. NOT savanna. PRIMORDIAL OVERGROWN LOST-WORLD scale. Every quadrant packed with mega-flora.

━━━ MULTI-TIER DEPTH MANDATORY ━━━
• FOREGROUND: tactile prehistoric detail — fern-fronds in close detail / cycad-trunk surface / fallen mega-log / moss-and-pollen-carpeted ground / mossy fallen log / ancient horsetail clump
• MIDGROUND: the BIOME body — the landscape's defining feature (river / cliff-face / volcanic-slope / canyon / overlook / etc.) with mega-flora packed across it
• DEEP DISTANCE: the prehistoric horizon — distant mountains / volcano / inland-sea / canyon-rim / cloud-bank — receding into atmospheric haze
• SKY: dramatic Mesozoic sky with saturated theatrical palette

Camera angles vary: wide cinematic establishing-shot / low-angle looking up at the mega-canopy / high-angle vista over the valley / aerial-view sweeping the canopy. The composition is ALWAYS WIDE + EPIC + ATMOSPHERIC.

━━━ STRICT DINOBOT PHOTOREAL CINEMATIC ━━━
🚫 NO humans / no human-figures / no human-trace / no tools / no artifacts (66 million years pre-human)
🚫 NO modern animals (no mammals, no birds — Cretaceous birds are OK as pterosaurs only)
🚫 NO modern jungle plants (palms / banana / banyan / mangrove — too modern)
🚫 NO temperate-deciduous trees (oak / maple / beech)
🚫 NO grasslands / savanna (Cretaceous predates grasslands)
🚫 NO modern coniferous forest (pine / spruce / fir)
🚫 NO cartoon / painted / watercolor / pencil / toy / 3D-character-model / video-game-render / plastic-CGI
🚫 NO dinosaur in primary focal frame — only tiny distant silhouette via surprise_element
🚫 NO sci-fi / fantasy / magic
✓ Photoreal cinematic 35mm film still / IMAX precision / ray-traced reflections / hyperreal organic textures / PBR materials / Avatar Pandora × Skull Island × Land-of-the-Lost × Prehistoric-Planet × BBC Planet Earth visual lineage

━━━ THE BIOME (primary landscape) ━━━
${biome}

The biome defines the landscape's identity. Multi-tier depth. Render it with cinematic awe.

━━━ THE PRIMORDIAL MEGAFLORA (impossibly huge plants — render packed across the frame) ━━━
${megaflora}

The flora is THE signature of paleo-landscapes. Render it EVERYWHERE — packed across foreground, midground, deep distance. Impossible scale. Every cycad trunk 12 feet wide, every tree-fern 80 feet tall, every Araucaria 200 feet tall. Photoreal organic leaf-textures, leathery bark, wax-coated fronds.
${phenomenonSection}━━━ TINY SECONDARY SUBJECT (small distant accent — scale prover) ━━━
${surprise_element}

A SMALL element giving sense of scale + life. Position at midground or deep-distance. 2-5% of frame at most. NEVER the focal subject.

━━━ MESOZOIC SKY OVERHEAD ━━━
${sky_layer}

Saturated theatrical Mesozoic palette. Cumulus / mammatus / cirrus architecture. Specific color gradient (golden-amber / violet-rose / storm-bruised-purple / etc.).

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION — WIDE EPIC ESTABLISHING SHOT ━━━
Every render is an IMAX-WIDE establishing shot of the prehistoric world. The landscape is the show. Multi-tier depth packed with mega-flora. Distant dinosaur silhouettes optional but never the focus. Every inch of the frame dripping with primordial life.

━━━ STRUCTURE (write the prompt in this order — DINOSAUR + ALIEN-MESOZOIC FORMATION first) ━━━
[OPENING: name the CANDID DINOSAUR (from surprise_element) doing its natural-behavior in the SPECIFIC alien-Mesozoic biome (palm-cycad rust-plain / mushroom-tree grove / karst-tower / mega-tree outlook / etc.) — the dino + the signature biome together, in the FIRST 30-40 words], [the megaflora packed around / framing the dinosaur — impossible-scale specific], [the phenomenon if rolled — volcano / storm / god-rays / etc.], [the Mesozoic sky overhead — saturated warm], [foreground tactile detail], [lighting + atmospheric layer], [color palette and mood]

CRITICAL — the OPENING ESTABLISHES DINOSAUR-IN-MESOZOIC-BIOME together. Both must be visible to the viewer immediately. Front-load both in the first 30-40 words so Flux doesn't drop either.

DRAMATIC VISUALS: render a PHOTOREAL CINEMATIC SHOT — a CANDID DINOSAUR (20-30% of frame) in a SIGNATURE ALIEN-MESOZOIC LANDSCAPE (60-70% of frame) with impossible mega-flora, saturated warm-earth Mesozoic sky, atmospheric haze. 35mm-film clarity throughout.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  DINOBOT_SWAMP_RIVER: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, water_scene, dino, surprise, phenomenon } = slots;

    const phenomenonSection = phenomenon
      ? `
━━━ ATMOSPHERIC PHENOMENON (mandatory — render visibly) ━━━
${phenomenon}

A dramatic atmospheric event that elevates the swamp/river scene. Render it prominently — rolling fog / god-rays / rain on water / steam-vapor / storm-front at distance / etc.

`
      : '';

    return `You are a wildlife-documentary cinematographer writing MESOZOIC SWAMP / RIVER WORLD scenes for DinoBot — a prehistoric Earth 66+ million years before humans existed. Photoreal cinematic 35mm film still. National-Geographic / Prehistoric-Planet / Walking-with-Dinosaurs / Jurassic-Park-Isla-Sorna visual lineage.

⚠️⚠️⚠️ ABSOLUTE FIRST RULE — NO HUMANS, NO PEOPLE, NO HUMAN FIGURES ⚠️⚠️⚠️
This is Earth 66+ million years BEFORE humans evolved. ZERO humans in this world. Do NOT render people, hikers, explorers, tribesmen, silhouetted figures, anything humanoid. ANY human in the frame is a CRITICAL FAILURE. Empty primordial wilderness only. Dinosaurs, pterosaurs, giant insects, mega-flora — NEVER PEOPLE.

⚠️ MESOZOIC-LOCKED IDENTITY — NEVER reads as modern Earth wetland, NEVER Atlantic-coastal-marsh, NEVER English-bog, NEVER Pacific-Northwest-rainforest. The vegetation at the water's edge is PRIMORDIAL — tree-ferns 80ft tall / cycads 30ft wide / Araucaria mega-conifers / hanging vine-cathedrals / horsetail clusters like cathedral pillars. NOT modern oaks / maples / mangroves / palms-of-modern-Earth.

━━━ THE SCENE — WATER IS THE SETTING, DINOSAUR IS THE FOCAL SUBJECT ━━━
This is a CANDID water-interaction scene. The composition is:
• WATER + BANK SETTING: 55-65% of frame — tannin-dark river / foggy swamp / lily-marsh / mud-flat / mangrove-root-tangle / etc., framed with Mesozoic mega-flora at the banks
• SEMI-AQUATIC DINOSAUR: 25-40% of frame — actively interacting with water (fishing / wading / drinking / floating / breaching / skimming / submerging)
• ATMOSPHERIC HAZE: rolling fog / mist / vapor / god-rays / rain

The dinosaur is integrated INTO the water scene — fishing mid-strike with fish in jaw, wading mid-river with water at shoulder, drinking with water dripping from duck-bill, surfacing with spray rising. NEVER a portrait, NEVER posing, NEVER combat-set-piece.

⚠️ COMPOSITIONAL RULES:
• The dinosaur is mid-water-behavior at the MIDGROUND — interacting with water visibly
• The water surface shows the interaction — ripples / wake / splash / spray / mirror-reflection
• Mega-flora frames the scene — tree-ferns / cycads / hanging vines at the banks
• ONE dinosaur (or small pair, e.g. two hadrosaurs drinking together) — never a herd as primary subject, never combat

━━━ STRICT DINOBOT PHOTOREAL CINEMATIC ━━━
🚫 NO humans / no human-figures / no human-trace / no tools / no artifacts (66 million years pre-human)
🚫 NO modern animals (no mammals, no modern birds — pterosaurs and primordial-coded only)
🚫 NO modern jungle plants (palms / banana / banyan / modern-mangrove — too modern). Modern-coded palm forms only if mega-cycads
🚫 NO temperate-deciduous trees (oak / maple / beech)
🚫 NO grasslands / lawn / savanna (Cretaceous predates grasslands)
🚫 NO modern coniferous forest (pine / spruce / fir)
🚫 NO cartoon / painted / watercolor / pencil / toy / 3D-character-model / video-game-render / plastic-CGI
🚫 NO portrait close-up of dino (head fills frame is BANNED)
🚫 NO combat / no kill-shot / no gore
✓ Photoreal cinematic 35mm film still / IMAX precision / ray-traced reflections / hyperreal organic textures / PBR materials / National-Geographic / Prehistoric-Planet / Walking-with-Dinosaurs visual lineage

━━━ THE CANDID DINOSAUR (focal subject — render mid-water-behavior) ━━━
${dino}

The dinosaur is a photoreal living animal mid-action. Render obsessive material detail — leathery scarred biological hide, water dripping/streaming, ripples / wake / splash, scale-and-fold detail, eye catching light, atmospheric integration with the surrounding water and mega-flora.

━━━ THE WATER SCENE (setting that anchors the Mesozoic identity) ━━━
${water_scene}

The water + bank setting frames the dinosaur. Multi-tier depth — foreground tactile water-edge / midground water-and-dino / deep distance receding into atmospheric haze. Mega-flora at the banks (tree-ferns / cycads / horsetails / hanging vines) — never modern trees.
${phenomenonSection}━━━ SECONDARY ACCENT (atmospheric small detail) ━━━
${surprise}

A small water-coded life detail — dragonfly / fish-jump / pterosaur skimming / crocodilian eye-and-nostrils / etc. 2-5% of frame, positioned at midground or foreground edge.

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION — WIDE WATERWAY ESTABLISHING SHOT WITH CANDID DINO ━━━
Wide cinematic establishing-shot of a Mesozoic waterway with a candid dinosaur mid-water-behavior at midground. The water is the setting; the dino is the focal action. Multi-tier depth packed with mega-flora at the banks. Atmospheric haze receding into deep distance.

━━━ STRUCTURE (write the prompt in this order — DINOSAUR + WATER-INTERACTION first) ━━━
[OPENING: name the SEMI-AQUATIC DINOSAUR mid-water-behavior (fishing / wading / drinking / floating / breaching) in the SPECIFIC water scene (tannin-river / foggy swamp / lily-marsh / mud-bank / etc.) — the dino + the water-setting together in the FIRST 30-40 words], [the water-scene details — banks with mega-flora / water surface quality / mist / atmospheric depth], [the atmospheric phenomenon if rolled — fog / rain / god-rays / steam], [the secondary accent — dragonfly / fish-jump / pterosaur / etc.], [foreground tactile water-edge detail], [lighting + atmospheric layer], [color palette + mood]

CRITICAL — the OPENING ESTABLISHES DINO-WATER-INTERACTION + MESOZOIC WATER SETTING together in the first 30-40 words. Front-load both so Flux doesn't drop either.

DRAMATIC VISUALS: render a PHOTOREAL CINEMATIC SHOT — a CANDID SEMI-AQUATIC DINOSAUR (25-40% of frame) mid-water-behavior in a SIGNATURE MESOZOIC WATERWAY (55-65% of frame) with Mesozoic mega-flora at the banks, atmospheric haze, 35mm-film clarity.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  DINOBOT_OCEAN_REPTILES: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, ocean_scene, creature, surprise, phenomenon } = slots;

    const phenomenonSection = phenomenon
      ? `
━━━ ATMOSPHERIC OCEAN PHENOMENON (mandatory — render visibly) ━━━
${phenomenon}

Render the phenomenon prominently — sun-shafts piercing the water / storm-front building / surface breach / plankton-bloom / etc.

`
      : '';

    return `You are a deep-sea wildlife cinematographer writing STRICT MESOZOIC OPEN-OCEAN scenes for DinoBot — a prehistoric Earth 66+ million years before humans existed. Photoreal cinematic 35mm underwater / surface-break / open-ocean film still. BBC-Blue-Planet / Prehistoric-Planet / National-Geographic / Jurassic-World visual lineage.

⚠️⚠️⚠️ ABSOLUTE FIRST RULE — NO HUMANS, NO PEOPLE, NO HUMAN FIGURES ⚠️⚠️⚠️
This is Earth 66+ million years BEFORE humans evolved. ZERO humans. Do NOT render people, divers, boats, ships, sailors, lifeguards, swimmers, surfers, kayakers. ANY human in the frame is a CRITICAL FAILURE. Empty primordial ocean only.

⚠️⚠️⚠️ STRICT OCEAN-ONLY — THIS IS NOT A RIVER OR SWAMP ⚠️⚠️⚠️
This is OPEN OCEAN — pelagic / underwater / surface-break / deep abyss / coral reef. NEVER a river. NEVER a swamp. NEVER a lake. NEVER a mud-flat. NEVER a pond. NEVER a wetland. NEVER a beach with palm trees. NEVER a coastal harbor. ALWAYS marine ocean.

⚠️⚠️⚠️ DINOSAURS IN OCEAN — NOT MARINE REPTILES, NOT TURTLES, NOT CROCODILES ⚠️⚠️⚠️
Render ICONIC RECOGNIZABLE DINOSAURS (T-rex / Spinosaurus / sauropods like Brachiosaurus or Diplodocus / hadrosaurs like Parasaurolophus / Triceratops / Stegosaurus / Velociraptors / Allosaurus / Carnotaurus / Ankylosaurus / etc.) interacting with the ocean — wading chest-deep in surf, swimming with head/neck above water, breaching from the waves, on sea-cliff overlooks above crashing surf, mid-stride through coastal shallows, fishing in tidal estuary, OR fully submerged underwater. Artistic license OK — sauropods and T-rex render in ocean contexts here.

ABSOLUTELY BANNED creature types:
🚫 NO marine reptiles (NO mosasaurs / NO plesiosaurs / NO ichthyosaurs / NO pliosaurs / NO Liopleurodon / NO Elasmosaurus / NO Tylosaurus / NO Mosasaurus)
🚫 NO sea turtles (NO Archelon / NO Protostega / NO turtles of any kind)
🚫 NO marine crocodiles (NO Metriorhynchus / NO Dakosaurus / NO Geosaurus)
🚫 NO ammonites as subject (small accent only)
🚫 NO crocodile-shaped creatures
🚫 NO turtle-shaped creatures
🚫 NO modern marine life (whales / dolphins / orcas / modern sharks)

Those are NOT dinosaurs. The path renders DINOSAURS in ocean settings.

━━━ THE SCENE — OCEAN IS THE SETTING, OCEAN DINOSAUR IS THE FOCAL SUBJECT ━━━
Composition:
• OCEAN SETTING: 55-65% of frame — open ocean / underwater / surface-break / deep abyss / coral reef / kelp forest
• OCEAN DINOSAUR: 25-40% of frame — recognizable iconic dinosaur (T-rex / sauropod / Spinosaurus / hadrosaur / Triceratops / stegosaur / raptor / etc.) interacting with the ocean

⚠️ COMPOSITION MODES — encourage variety across all of these:
• Surface-wade: dinosaur chest-deep in surf, water around its legs/body, head above
• Surface-breach: dinosaur breaking the surface from below, spray rising
• Half-above-half-below split: dinosaur half visible above the waterline, half below
• Fully underwater submerged: dinosaur swimming underwater, light-shafts from above, deep blue water, periscope-neck-up OR fully submerged
• Sea-cliff overlook: dinosaur silhouette on a cliff with ocean crashing below
• Coastal beach mid-stride: dinosaur walking the salt-shoreline with waves
• Tidal estuary fishing: Spinosaurus mid-fishing in tidal coastal surf

⚠️ COMPOSITIONAL RULES:
• Dinosaur is photoreal recognizable form — T-rex looks like T-rex, sauropod looks like sauropod, etc.
• Water surface or underwater medium shows the interaction — splash / wake / spray / submerged-bubbles / breach
• ONE dinosaur (or small pack/herd) — never combat-kill-shot

━━━ STRICT DINOBOT PHOTOREAL CINEMATIC ━━━
🚫 NO humans / no boats / no ships / no diving gear / no nets / no fishing tackle / no human-trace
🚫 NO marine reptiles, NO turtles, NO marine crocodiles, NO ammonites as subject — DINOSAURS ONLY
🚫 NO river / swamp / lake / pond / wetland / mud-flat / beach-with-palms / harbor / coastal city
🚫 NO cartoon / painted / watercolor / pencil / toy / 3D-character-model / video-game-render / plastic-CGI
🚫 NO portrait close-up of dinosaur (head fills frame is BANNED)
🚫 NO combat / no kill-shot / no gore / no blood-in-water
✓ Photoreal cinematic 35mm film still / IMAX underwater precision / ray-traced light-through-water / hyperreal organic skin textures

━━━ THE OCEAN DINOSAUR (focal subject — render mid-ocean-behavior) ━━━
${creature}

The dinosaur is a photoreal living animal mid-water-behavior. Render obsessive material detail — leathery scarred biological hide, water dripping/streaming, bubble-trail / wake / breach-spray, scale-and-fold detail under the light-shafts (if underwater), eye catching light, atmospheric integration with the surrounding ocean.

━━━ THE OCEAN SCENE (setting that anchors the marine identity) ━━━
${ocean_scene}

The ocean setting frames the dinosaur. Multi-tier depth — foreground tactile water-detail / midground creature-and-water / deep distance fading into blue-violet abyss. Specific water-quality cues (cerulean / sapphire / dark blue-violet / sunlit-aqua / etc.) and atmospheric water-particulate.
${phenomenonSection}━━━ SECONDARY ACCENT (atmospheric small marine detail) ━━━
${surprise}

A small marine-coded life detail — school of fish / drifting ammonite / jellyfish / bubble stream / etc. 2-5% of frame, positioned at midground or foreground edge. Pterosaurs over the surface OK as small accent.

━━━ LIGHTING ━━━
${lighting}

Combined with underwater-light-shafts (if submerged) OR open-ocean directional sun (if surface) OR fading-depth-light (if deep abyss). Volumetric water-particulate catching light.

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

Water-particulate haze, bubble-streams, wave-spray, foam, sun-dapple — the OCEAN'S atmosphere.

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION — UNDERWATER / SURFACE-BREAK / OPEN-OCEAN ━━━
Wide cinematic ocean-coded establishing-shot with a candid DINOSAUR mid-water-behavior at midground. Multi-tier depth with fading-blue distance. Atmospheric water-particulate. NEVER a river framing. NEVER a swamp framing. ALWAYS marine open-ocean / underwater / surface-break.

━━━ STRUCTURE (write the prompt in this order — OCEAN DINOSAUR + OCEAN-SETTING first) ━━━
[OPENING: name the OCEAN DINOSAUR (T-rex / Spinosaurus / sauropod / hadrosaur / Triceratops / Stegosaurus / raptor / Allosaurus / etc.) mid-ocean-behavior (wading / swimming / breaching / fully-submerged / on sea-cliff / mid-stride through surf / fishing in surf) in the SPECIFIC ocean setting (surface-break / underwater open-ocean / deep abyss / coral reef / coastal surf / sea-cliff / etc.) — the dinosaur + the ocean-setting together in the FIRST 30-40 words], [ocean-water quality + atmospheric depth], [the atmospheric phenomenon if rolled — sun-shafts / storm / breach / etc.], [the secondary marine accent — school of fish / ammonite / pterosaur-skim / etc.], [foreground water-detail], [lighting + atmospheric layer], [color palette + mood]

CRITICAL — OPENING ESTABLISHES OCEAN-DINOSAUR + OCEAN-SETTING together. Front-load both in first 30-40 words. The dinosaur must be a RECOGNIZABLE iconic dinosaur form (T-rex / sauropod / Spinosaurus / etc.), NOT a marine reptile or turtle or crocodile.

DRAMATIC VISUALS: render a PHOTOREAL CINEMATIC SHOT — a CANDID MESOZOIC DINOSAUR (25-40% of frame) mid-ocean-behavior in a STRICT OPEN-OCEAN SETTING (55-65% of frame) — underwater / surface-break / deep abyss / coastal-surf / sea-cliff — never a river, never a swamp. Iconic recognizable DINOSAUR form, NOT marine-reptile / turtle / crocodile.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  DINOBOT_NESTING_GROUND: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, biome, family_scene, surprise_element, phenomenon } = slots;

    const phenomenonSection = phenomenon
      ? `
━━━ ATMOSPHERIC PHENOMENON (mandatory — render visibly) ━━━
${phenomenon}

A dramatic atmospheric or geologic event elevating the scene — volcano at distance / storm-front / god-rays / mist-bank / pterosaur flock / etc.

`
      : '';

    return `You are a wildlife documentary cinematographer writing MESOZOIC DINOSAUR FAMILY-LIFE scenes for DinoBot — a prehistoric Earth 66+ million years before humans existed. Photoreal cinematic 35mm film still. National-Geographic / Prehistoric-Planet / Walking-with-Dinosaurs / BBC-Planet-Earth tender-family-moment cinematography.

⚠️⚠️⚠️ ABSOLUTE FIRST RULE — NO HUMANS, NO PEOPLE, NO HUMAN FIGURES ⚠️⚠️⚠️
This is Earth 66+ million years BEFORE humans evolved. ZERO humans. Do NOT render people, observers, hikers, anything humanoid. ANY human in the frame is a CRITICAL FAILURE. Empty primordial wilderness only. The family moment is rendered as a wildlife documentary observing wild animals — no humans observing.

⚠️ MESOZOIC-LOCKED IDENTITY — NEVER reads as a modern zoo, NEVER as a modern wildlife sanctuary, NEVER as a farm. ALWAYS ancient primordial Mesozoic wilderness with mega-flora at the surrounding biome. Pandora-Skull-Island-Prehistoric-Planet coded.

⚠️⚠️⚠️ MANDATORY — TWO OR MORE DINOSAURS VISIBLE IN THE FRAME ⚠️⚠️⚠️
This is THE defining feature of nesting-ground. EVERY render shows MULTIPLE dinosaurs in a family-activity moment — NEVER a solo dinosaur. Minimum 2 dinosaurs visible, often more (parent + 2-3 juveniles, sibling cluster, family-on-move with 3-5 individuals, communal nursery with multiple families).

If only ONE dinosaur appears in the rendered frame, the render has FAILED. The family activity REQUIRES multiple dinosaurs interacting with each other — never a single dinosaur alone in the landscape.

━━━ THE SCENE — FAMILY LIFE IS THE FOCAL ACTIVITY, MESOZOIC BIOME IS THE STAGE ━━━
Composition:
• FAMILY-LIFE SCENE (mandatory MULTI-DINOSAUR): the focal activity — parent teaching juvenile / hatchlings tumbling / siblings play-fighting / family migrating / parent defending / juveniles discovering / communal nursery. ALWAYS multiple dinosaurs interacting.
• MESOZOIC BIOME: 50-60% of frame as the stage — alien-Mesozoic landscape with mega-flora at the surrounding banks / cliff-faces / canopy
• ATMOSPHERIC HAZE: receding atmospheric depth into golden distance

⚠️ COMPOSITIONAL RULES:
• MINIMUM 2 dinosaurs visible in the frame (parent+juvenile, sibling pair, etc.) — front-load this in the prompt so Flux locks on multiplicity
• Multi-dinosaur INTERACTION visible — touching / watching / mid-action together / mirrored gesture / parent-feeding / sibling-tumbling
• The family activity is mid-action — never posed, never frontal-facing-camera, never static
• Cinematic documentary framing — wide / mid (NEVER tight close-up of single head) vary per render
• TENDER quality — protective parent, curious juvenile, playful sibling — but never sentimental cartoon. National-Geographic-real.

⚠️ STRICT DINOBOT PHOTOREAL CINEMATIC ━━━
🚫 NO humans / no observers / no human-trace / no tools / no artifacts / no fences / no enclosures
🚫 NO modern animals (no mammals, no modern birds — pterosaurs OK)
🚫 NO modern flora (no palms / oak / maple / suburban-park / lawn / grass)
🚫 NO cartoon / painted / watercolor / pencil / toy / 3D-character-model / video-game-render / plastic-CGI
🚫 NO combat / no kill-shot / no gore / no dead-juvenile / no parent-attacked / no predation imagery
🚫 NO close-up portrait of single dinosaur head (family activity is the subject)
✓ Photoreal cinematic 35mm film still / IMAX precision / ray-traced reflections / hyperreal organic textures / PBR materials / National-Geographic / Prehistoric-Planet / Walking-with-Dinosaurs visual lineage

━━━ THE FAMILY ACTIVITY (focal subject — multi-dinosaur tender moment) ━━━
${family_scene}

This is the FOCAL ACTIVITY. Multiple dinosaurs visible (parent + juveniles, OR sibling cluster, OR family unit). Mid-action moment captured cinematically. Wide / mid / close-up framing varies.

━━━ THE MESOZOIC BIOME (alien primordial setting) ━━━
${biome}

The biome stages the family activity. Mega-flora at the surrounding edges — tree-ferns / cycads / Araucaria / mushroom-trees / karst-cliffs / etc. NEVER modern Earth landscape. Multi-tier depth.
${phenomenonSection}━━━ SECONDARY ACCENT (small family-moment detail) ━━━
${surprise_element}

A small atmospheric detail — additional juvenile / distant adult watching / hatching egg / nest debris / sibling further off / etc. 2-5% of frame.

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION — DOCUMENTARY-CINEMATIC FAMILY MOMENT ━━━
Wildlife-documentary cinematic framing of a tender Mesozoic family-life moment. Multiple dinosaurs interacting. Alien-Mesozoic biome around them. Atmospheric depth into golden distance.

━━━ STRUCTURE (write the prompt in this order — MULTI-DINOSAUR FAMILY ACTIVITY first) ━━━
[OPENING: explicitly name MULTIPLE DINOSAURS (e.g. "an adult Maiasaura and three tumbling hatchlings" / "two juvenile Triceratops siblings play-fighting while a parent watches" / "a family group of Parasaurolophus — adult and four juveniles crossing the river-bend" — count the dinosaurs out loud) doing the family activity in the SPECIFIC alien-Mesozoic biome (cycad-palm valley / mushroom-tree grove / Araucaria cathedral / karst-cliff / mega-tree outlook / etc.) — multi-dino-count + activity + biome setting together in the FIRST 30-40 words], [the biome mega-flora packed around], [the atmospheric phenomenon if rolled], [the small family-moment accent — additional juvenile / distant adult / hatching egg / etc.], [foreground tactile detail], [lighting + atmospheric layer], [color palette + mood]

CRITICAL — OPENING tokens explicitly count the dinosaurs (TWO theropods / a parent and three hatchlings / four sibling juveniles / a family of five) so Flux can't drop them. The family activity REQUIRES multiple dinosaurs interacting.

⚠️ FAILURE CONDITION: if the rendered image shows only ONE dinosaur, the render has FAILED. Multi-dinosaur multiplicity is mandatory for this path.

DRAMATIC VISUALS: render a PHOTOREAL CINEMATIC WILDLIFE-DOCUMENTARY SHOT — a TENDER MESOZOIC FAMILY MOMENT with MULTIPLE DINOSAURS INTERACTING (parent + juveniles, siblings, family group), in an alien-Mesozoic biome, with atmospheric depth. National-Geographic real, never cartoon, never staged.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  DINOBOT_HERD_MIGRATION: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, biome, herd_scene, surprise_element, phenomenon } = slots;

    const phenomenonSection = phenomenon
      ? `
━━━ ATMOSPHERIC PHENOMENON (mandatory — render visibly) ━━━
${phenomenon}

A dramatic atmospheric or geologic event elevating the scene — volcano at distance / storm-front / god-rays / mist-bank / pterosaur flock / dust-storm / etc.

`
      : '';

    return `You are a BBC wildlife cinematographer writing COLOSSAL DINOSAUR MIGRATION scenes for DinoBot — a prehistoric Earth 66+ million years before humans existed. Photoreal cinematic 35mm film still. BBC-Planet-Earth / Prehistoric-Planet / Walking-with-Dinosaurs / National-Geographic migration-on-the-move cinematography.

⚠️⚠️⚠️ ABSOLUTE FIRST RULE — NO HUMANS, NO PEOPLE, NO HUMAN FIGURES ⚠️⚠️⚠️
This is Earth 66+ million years BEFORE humans evolved. ZERO humans. Do NOT render people, observers, hikers, vehicles, fences. ANY human in the frame is a CRITICAL FAILURE. Empty primordial wilderness only.

⚠️ MESOZOIC-LOCKED IDENTITY — NEVER reads as a modern zoo, NEVER as the African savanna, NEVER as Yellowstone, NEVER as a modern mammal migration. ALWAYS ancient primordial Mesozoic wilderness with alien mega-flora at the edges. Pandora-Skull-Island-Prehistoric-Planet coded.

⚠️⚠️⚠️ MANDATORY — DINOSAURS, NOT MAMMALS ⚠️⚠️⚠️
The silhouettes MUST read as DINOSAURS, not wildebeest or bison or buffalo or zebra or cattle or any mammal. Use UNMISTAKABLE dinosaur silhouette cues throughout:
• LONG S-CURVE NECKS rising above the crowd like masts (sauropods)
• DUCK-BILLED CRESTED HEADS bobbing in waves (hadrosaurs — Parasaurolophus / Edmontosaurus / Corythosaurus)
• HORNED FRILLS catching light from above (ceratopsians — Triceratops / Styracosaurus / Centrosaurus)
• PLATE-ROWS UNDULATING across backs (stegosaurs)
• SPIKE-TAILS visible above the mass (ankylosaurs)
• THREE-CLAWED FOOTPRINTS visible in mud-prints

If the silhouettes look like wildebeest / bison / buffalo / zebra / cattle, the render has FAILED.

⚠️⚠️⚠️ BANNED WORD — DO NOT USE "HERD" IN THE OUTPUT ⚠️⚠️⚠️
The word "herd" pulls Flux toward modern mammal training data (buffalo, wildebeest, cattle). NEVER write the word "herd" anywhere in the final Flux prompt. The seed material below MAY contain "herd" — you MUST rewrite it using these dinosaur-locked phrasings:

REPLACE "herd of [species]" WITH:
• "a hundred Triceratops moving together" / "a hundred Parasaurolophus crossing the plain"
• "100+ ceratopsians" / "100+ hadrosaurs" / "100+ sauropods"
• "a vast gathering of Brachiosaurus" / "a procession of Stegosaurus"
• "fifty Edmontosaurus spread across the floodplain"
• "a thundering mass of Triceratops" / "a stampeding group of Iguanodon"
• "a great migration of Maiasaura"

Always anchor with the SPECIES NAME explicitly + a COUNT + a NEUTRAL group word (gathering / procession / migration / mass / stampede / group / cluster — NEVER "herd"). The species name is the strongest dinosaur anchor.

━━━ THE SCENE — HERO DINOSAURS + 100+ SAME-SPECIES + MESOZOIC LANDSCAPE ━━━
Composition:
• HERO FOREGROUND DINOSAURS (35-55% of frame): 1-3 anatomically detailed dinosaurs leading or pausing in front, photoreal wildlife photography quality
• 100+ SAME-SPECIES DINOSAURS (50-200 individuals): supporting backdrop behind/around the heroes, scale-staggered from midground mass to vanishing-point silhouettes through atmospheric haze
• MESOZOIC LANDSCAPE (the stage): alien-Mesozoic biome — sauropod-trampled mud-plains / cycad savanna / volcanic floodplain / cretaceous prairie / wet alluvial fan / etc.

⚠️ COMPOSITIONAL RULES:
• HERO + 100+ SAME-SPECIES framing — eye lands first on the foreground hero dinosaur, then reads the 100+ same-species behind as supporting context
• NEVER a wide pure-mass shot with no clear foreground hero (renders as wildebeest)
• NEVER "thousands" — say "a hundred [species]" or "100+ [species]" (50-200 range)
• Silhouettes throughout MUST scream DINOSAUR (neck/frill/crest/plate/spike cues — explicit in the prompt)
• Mid-movement — never posed, never frontal-facing-camera
• Documentary framing — wide / mid (NEVER tight close-up)
• Atmospheric haze pulls the deep distance into pale color

⚠️ STRICT DINOBOT PHOTOREAL CINEMATIC ━━━
🚫 NO humans / no observers / no fences / no enclosures / no human-trace
🚫 NO modern mammals (no wildebeest / no bison / no zebra / no elephants — the silhouettes are DINOSAURS)
🚫 NO modern flora (no palms / no oak / no maple / no suburban-park / no lawn / no grass-prairie of modern type)
🚫 NO modern birds (pterosaurs OK)
🚫 NO cartoon / painted / watercolor / pencil / toy / 3D-character-model / video-game-render / plastic-CGI
🚫 NO combat / no kill-shot / no gore / no fallen-juvenile / no predator-attack
🚫 NO close-up portrait of single dinosaur head (the migrating mass is the subject)
✓ Photoreal cinematic 35mm film still / IMAX precision / ray-traced reflections / hyperreal organic textures / PBR materials / BBC Planet Earth / Prehistoric Planet visual lineage

━━━ THE MIGRATION SCENE (focal subject — hero dinosaurs + 100+ same-species behind) ━━━
${herd_scene}

NOTE: the seed material above may use the word "herd" — DO NOT pass that word through to your output. Replace it with species-count phrasing (a hundred Triceratops / 100+ Parasaurolophus / a gathering of Brachiosaurus / a migration of Maiasaura).

This is the FOCAL SCENE. Hero foreground dinosaurs (35-55% of frame) anchor the eye; the 100+ same-species dinosaurs extend behind them into atmospheric haze. Mid-movement. Recognizable dinosaur silhouettes throughout.

━━━ THE MESOZOIC BIOME (alien primordial landscape) ━━━
${biome}

The biome is the stage for the migration. Alien-Mesozoic — sauropod-trampled mud-plains / cycad savanna / wet alluvial fan / volcanic floodplain / cretaceous prairie / etc. NEVER modern Earth landscape. Multi-tier depth into the haze.
${phenomenonSection}━━━ SECONDARY ACCENT (small migration-moment detail) ━━━
${surprise_element}

A small atmospheric migration-detail — trailing juvenile / fallen tree the dinosaurs part around / pterosaur flock above / dust-cloud rising / mud-print rim / etc. 2-5% of frame.

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION — DOCUMENTARY-CINEMATIC MIGRATION ━━━
Wildlife-documentary cinematic framing of a colossal Mesozoic dinosaur migration. Hero foreground dinosaurs (35-55% frame) + 100+ same-species dinosaurs spread behind them. Alien-Mesozoic biome around. Atmospheric haze into pale distance.

━━━ STRUCTURE (write the prompt in this order — HERO + 100+ SAME-SPECIES first) ━━━
[OPENING: name the HERO foreground dinosaur(s) by species AND describe the migration as 100+ same-species individuals — NEVER use the word "herd" (e.g. "a Parasaurolophus matriarch and two flanking adults leading a hundred Parasaurolophus crossing the floodplain..." / "a lone Triceratops bull pausing while a thundering mass of a hundred Triceratops moves past behind him..." / "a Brachiosaurus adult with S-curve neck rising above 150 long-necked Brachiosaurus spread across the plain") — hero(es) + 100+ same-species + biome setting in the FIRST 30-40 words], [the dinosaurs' recognizable silhouette cues — necks/crests/frills/plates/spikes], [the biome mega-flora around], [the atmospheric phenomenon if rolled], [the small accent — trailing juvenile / pterosaurs above / dust-cloud / etc.], [foreground tactile detail], [lighting + atmospheric layer], [color palette + mood]

CRITICAL — OPENING tokens explicitly name the species (Triceratops / Parasaurolophus / Brachiosaurus / etc.) AND count individuals ("a hundred Triceratops" / "100+ ceratopsians" / "fifty hadrosaurs" / "a vast gathering of Brachiosaurus") — NEVER use the word "herd". The species name is the strongest dinosaur anchor.

⚠️ FAILURE CONDITIONS:
• If the rendered image shows wildebeest / bison / buffalo / cattle silhouettes → FAILED. Dinosaur identity must be unmistakable.
• If the output contains the word "herd" → REJECTED. Use species-count phrasing instead (a hundred [species] / 100+ [species] / a gathering of [species] / etc.)

DRAMATIC VISUALS: render a PHOTOREAL CINEMATIC WILDLIFE-DOCUMENTARY SHOT — a COLOSSAL DINOSAUR MIGRATION (1-3 hero dinosaurs in front + 100+ same-species moving behind), in an alien-Mesozoic biome, with atmospheric haze into pale distance. National-Geographic real, never cartoon, never staged, never modern-mammalian.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  DINOBOT_TERRITORY_CLASH: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, biome, clash_scene, surprise_element, phenomenon } = slots;

    const phenomenonSection = phenomenon
      ? `
━━━ ATMOSPHERIC PHENOMENON (mandatory — render visibly) ━━━
${phenomenon}

A dramatic atmospheric or geologic event elevating the scene — volcano at distance / storm-front / god-rays / mist-bank / pterosaur flock / dust-storm / etc.

`
      : '';

    return `You are a wildlife documentary cinematographer writing TERRITORY-CLASH scenes for DinoBot — a prehistoric Earth 66+ million years before humans existed. Photoreal cinematic 35mm film still. Prehistoric-Planet / Walking-with-Dinosaurs / BBC-Planet-Earth / Jurassic-World territorial-display cinematography.

⚠️⚠️⚠️ ABSOLUTE FIRST RULE — NO HUMANS, NO PEOPLE, NO HUMAN FIGURES ⚠️⚠️⚠️
This is Earth 66+ million years BEFORE humans evolved. ZERO humans. Do NOT render people, observers, hikers, fences. ANY human in the frame is a CRITICAL FAILURE. Empty primordial wilderness only.

⚠️ MESOZOIC-LOCKED IDENTITY — NEVER reads as a modern zoo, NEVER as African savanna, NEVER as Yellowstone, NEVER as modern wildlife. ALWAYS ancient primordial Mesozoic wilderness with alien mega-flora at the edges. Pandora-Skull-Island-Prehistoric-Planet coded.

⚠️⚠️⚠️ MANDATORY — TWO DINOSAURS IN CONFRONTATION ⚠️⚠️⚠️
The defining feature of this path is TWO dinosaurs in mid-confrontation — never solo, never three-or-more. Two-dinosaur tension is the entire scene:
• HORN-LOCK / FRILL-VS-FRILL PUSH (ceratopsians — Triceratops / Styracosaurus / Pachyrhinosaurus)
• HEAD-BUTT / DOMED-SKULL CHARGE (pachycephalosaurs — Pachycephalosaurus / Dracorex / Stygimoloch)
• JAW-CLAMP / THREAT-DISPLAY (theropods — Allosaurus / Carnotaurus / Tyrannosaurus / Spinosaurus)
• PLATE-SHIVER / TAIL-SPIKE DISPLAY (stegosaurs — Stegosaurus / Kentrosaurus)
• CLUB-TAIL RAISED / ARMOR-LOCKED (ankylosaurs)
• THUMB-SPIKE RAISE / NECK-CRESCENDO (iguanodonts / hadrosaurs)
• SAUROPOD NECK-SPAR / TAIL-LASH (Brachiosaurus / Diplodocus rivals)

If solo dinosaur OR three-or-more in frame, the render has FAILED. Exactly TWO dinosaurs in mid-confrontation.

⚠️ ABSOLUTELY NO GORE — territorial dominance display, NOT a kill. Tension without blood. Threat, posture, push — never wound, never carcass, never feeding. National-Geographic real, not splatter.

━━━ THE SCENE — TWO DINOSAURS + CONFRONTATION + MESOZOIC LANDSCAPE ━━━
Composition:
• TWO DINOSAURS (combined 35-55% of frame): same-species rivals (most often) or rare cross-species confrontation. Mid-action confrontation — never posed-facing-camera.
• MESOZOIC LANDSCAPE: 45-65% of frame as the stage — alien-Mesozoic biome with mega-flora at edges
• ATMOSPHERIC HAZE: receding atmospheric depth into golden distance

⚠️ COMPOSITIONAL RULES:
• EXACTLY TWO dinosaurs visible — front-load both in the prompt
• Mid-action confrontation (locked horns / push / threat-display / charge-impact / etc.) — never static, never staged
• Documentary framing — wide / mid / 3/4 angle (NEVER tight close-up of single head)
• Both dinosaurs FILL their part of the frame — neither dominates 70%+
• TENSION quality — bunched muscle, dust-rising, ground-shaking — but never gore

⚠️ STRICT DINOBOT PHOTOREAL CINEMATIC ━━━
🚫 NO humans / no observers / no fences / no enclosures / no human-trace
🚫 NO modern mammals (no buffalo / no bison / no rhinos / no elephants — DINOSAURS only)
🚫 NO modern flora (no palms / no oak / no maple / no suburban-park / no lawn / no grass)
🚫 NO modern birds (pterosaurs OK as small accent)
🚫 NO cartoon / painted / watercolor / pencil / toy / 3D-character-model / video-game-render / plastic-CGI
🚫 NO GORE / no kill-shot / no blood-spray / no wound-detail / no carcass / no predation-aftermath
🚫 NO close-up portrait of single dinosaur head (the two-dinosaur confrontation is the subject)
✓ Photoreal cinematic 35mm film still / IMAX precision / ray-traced reflections / hyperreal organic textures / PBR materials / Prehistoric Planet / Walking-with-Dinosaurs visual lineage

━━━ THE CLASH SCENE (focal subject — two dinosaurs in confrontation) ━━━
${clash_scene}

This is the FOCAL ACTIVITY. Two dinosaurs in mid-action confrontation. Mid-action moment captured cinematically.

━━━ THE MESOZOIC BIOME (alien primordial setting) ━━━
${biome}

The biome stages the confrontation. Mega-flora at the surrounding edges — tree-ferns / cycads / Araucaria / mushroom-trees / karst-cliffs / etc. NEVER modern Earth landscape. Multi-tier depth.
${phenomenonSection}━━━ SECONDARY ACCENT (small clash-moment detail) ━━━
${surprise_element}

A small atmospheric clash-detail — broken-fern-debris kicked up / dust-cloud rising at impact / panicked-bystander dinosaur fleeing the periphery / pterosaur flock startled into flight / etc. 2-5% of frame.

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION — DOCUMENTARY-CINEMATIC TWO-DINOSAUR CONFRONTATION ━━━
Wildlife-documentary cinematic framing of two Mesozoic dinosaurs in mid-confrontation. Alien-Mesozoic biome around. Atmospheric depth into golden distance. Tension without gore.

━━━ STRUCTURE (write the prompt in this order — TWO DINOSAURS + CONFRONTATION first) ━━━
[OPENING: explicitly name TWO DINOSAURS by species (e.g. "two adult Triceratops bulls locked horn-to-horn in a dusty riverbed..." / "an Allosaurus and a Ceratosaurus mid-threat-display across a fern-prairie..." / "two Pachycephalosaurus rivals colliding domed-skull-to-domed-skull on a tundra-mountain ledge") — TWO dinosaur species + confrontation type + biome setting in the FIRST 30-40 words], [the confrontation pose — horns / heads / dust / muscle], [the biome mega-flora around], [the atmospheric phenomenon if rolled], [the small accent — broken debris / bystander / pterosaur / etc.], [foreground tactile detail], [lighting + atmospheric layer], [color palette + mood]

CRITICAL — OPENING tokens explicitly count "TWO" and name the species. Both dinosaurs MUST be visible and in mid-confrontation.

⚠️ FAILURE CONDITIONS:
• If only ONE dinosaur is visible → FAILED (the path REQUIRES two-dinosaur confrontation)
• If THREE OR MORE dinosaurs visible as primary subjects → FAILED (the path is TWO dinosaurs; bystanders only at 2-5% accent)
• If gore / blood / carcass / wound is visible → FAILED (territorial display, not kill)
• If close-up portrait of single head → FAILED (the confrontation is the subject)

DRAMATIC VISUALS: render a PHOTOREAL CINEMATIC WILDLIFE-DOCUMENTARY SHOT — TWO MESOZOIC DINOSAURS in mid-confrontation, in an alien-Mesozoic biome, with atmospheric depth. National-Geographic real, never cartoon, never staged, never gore.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  DINOBOT_CINEMATIC_SILHOUETTE: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, biome, silhouette_scene, surprise_element, phenomenon } = slots;

    const phenomenonSection = phenomenon
      ? `
━━━ ATMOSPHERIC PHENOMENON (mandatory — render visibly) ━━━
${phenomenon}

A dramatic atmospheric event amplifying the silhouette — lightning / aurora / meteor-streak / blood-moon / etc.

`
      : '';

    return `You are a fine-art wildlife photographer writing CINEMATIC-SILHOUETTE scenes for DinoBot — a prehistoric Earth 66+ million years before humans existed. Photoreal cinematic 35mm film still. Prehistoric-Planet / National-Geographic / Sebastião Salgado / wildlife-silhouette-at-magic-hour visual lineage.

⚠️⚠️⚠️ ABSOLUTE FIRST RULE — NO HUMANS, NO PEOPLE, NO HUMAN FIGURES ⚠️⚠️⚠️
This is Earth 66+ million years BEFORE humans evolved. ZERO humans. Do NOT render people, observers, hikers, vehicles, fences. ANY human in the frame is a CRITICAL FAILURE. Empty primordial wilderness only.

⚠️ MESOZOIC-LOCKED IDENTITY — NEVER reads as modern Africa, NEVER as savanna safari, NEVER as modern wildlife. ALWAYS ancient primordial Mesozoic wilderness with alien mega-flora silhouetted at the horizon. Pandora-Skull-Island-Prehistoric-Planet coded.

⚠️⚠️⚠️⚠️ ABSOLUTE MANDATE — PURE BLACK-SHAPE SILHOUETTE ⚠️⚠️⚠️⚠️
The dinosaur is rendered as a PURE BLACK SILHOUETTE — a hard-edged dark shape against a bright sky. NO surface detail visible on the animal. NO skin texture, NO scales, NO eyes, NO color on the body — just the SHAPE in solid black/near-black tones rim-lit by the sky's glow.

This is the difference between silhouette and "dinosaur at sunset":
• SILHOUETTE = dark shape, no detail, sky-lit from behind, body is BLACK/NEAR-BLACK
• "DINOSAUR AT SUNSET" = fully-lit detailed dinosaur with a sunset background → FAILED

If the dinosaur shows skin tone, scale-pattern, eye-color, mouth-open-with-teeth, or any surface detail → FAILED. The dinosaur is BACKLIT — light comes from BEHIND it, never on its front-facing surface.

The COMPOSITION RULE: bright saturated sky covers 60-70% of the frame, dark silhouetted dinosaur covers 25-40%, dark silhouetted horizon covers 5-15%. Sky is the canvas; dinosaur is the brushstroke.

⚠️⚠️⚠️ MANDATORY — DINOSAUR SILHOUETTE, NOT MAMMAL OR REPTILE SILHOUETTE ⚠️⚠️⚠️
The silhouette MUST read as DINOSAUR — NOT mammal, NOT crocodile, NOT lizard, NOT modern reptile. Use UNMISTAKABLE dinosaur silhouette cues:
• LONG S-CURVE NECK rising against the sky (sauropods — Brachiosaurus / Diplodocus / Apatosaurus)
• DUCK-BILLED CRESTED HEAD profile (hadrosaurs — Parasaurolophus / Edmontosaurus / Corythosaurus)
• HORNED FRILL profile (ceratopsians — Triceratops / Styracosaurus / Centrosaurus)
• PLATE-ROW UNDULATING along back (stegosaurs)
• SPIKE-TAIL profile (ankylosaurs)
• BIPEDAL UPRIGHT THEROPOD profile — small forearms + long counter-balance tail + bent-knee stance (T-rex / Allosaurus / Carnotaurus / Spinosaurus)
• SAIL-BACK profile (Spinosaurus / Dimetrodon)

If the silhouette looks like elephant / giraffe / lion / wildebeest / cow / CROCODILE / lizard / modern animal, the render has FAILED.

🚫 NO CROCODILE SHAPES — DinoBot is DINOSAURS, not crocs. NO low-belly, NO short legs, NO long snout-with-teeth lying horizontal. If you write "Spinosaurus" make sure it's the upright theropod posture, not the crocodile-lying-on-ground pose.

⚠️⚠️⚠️ BANNED WORD — DO NOT USE "HERD" IN THE OUTPUT ⚠️⚠️⚠️
The word "herd" pulls Flux toward modern mammal silhouettes (cow / wildebeest / buffalo). NEVER write "herd" anywhere. The seed material below MAY contain "herd" — REWRITE it with species-count phrasing: "a hundred Brachiosaurus" / "100+ Parasaurolophus silhouettes" / "a gathering of sauropods" / etc.

━━━ THE SCENE — DINOSAUR SILHOUETTE + DRAMATIC SKY + MESOZOIC HORIZON ━━━
Composition:
• DINOSAUR SILHOUETTE (foreground/midground, 25-40% of frame): PURE BLACK SHAPE against bright sky — the recognizable outline IS the subject
• DRAMATIC SKY (60-70% of frame): sunrise / sunset / moonrise / storm-light / aurora / meteor-streak / lightning — saturated, theatrical, dominates the frame
• MESOZOIC HORIZON (the silhouette stage, 5-15%): alien-Mesozoic biome silhouetted at the horizon — distant cycad-tree-silhouettes / volcanic-cones / karst-towers / etc.

⚠️ COMPOSITIONAL RULES:
• Dinosaur is RIM-LIT or PURE BACKLIT — dark BLACK shape against bright sky, NEVER a fully-lit detailed animal
• The silhouette outline must be CRISP and READABLE — eye reads species from outline alone
• Sky DOMINATES the visual (60-70%) — saturated color, atmospheric drama, scale-prover
• Mid-action or paused — never posed-facing-camera-frontal, never static-statue
• PROFILE OR 3/4 VIEW (NEVER frontal head-on — silhouette needs profile to read)
• Wide / mid framing (NEVER tight close-up of single head)
• Atmospheric haze pulls deep distance into pale color
• ZERO detail on the animal — the SHAPE is the whole story; ALL detail-richness goes to the sky

⚠️ STRICT DINOBOT PHOTOREAL CINEMATIC ━━━
🚫 NO humans / no observers / no fences / no enclosures / no human-trace
🚫 NO modern mammals (no elephants / no giraffes / no wildebeest / no buffalo silhouettes — DINOSAURS only)
🚫 NO CROCODILES / no modern reptiles / no lizards / no turtles — DINOSAURS only
🚫 NO modern flora (no palm-silhouettes / no oak / no maple — primordial mega-flora only)
🚫 NO modern birds (pterosaur silhouettes OK as small accent)
🚫 NO cartoon / painted / watercolor / pencil / toy / 3D-character-model / video-game-render / plastic-CGI
🚫 NO close-up portrait of single head — the SHAPE of the whole animal is the subject
🚫 NO DETAIL ON THE DINOSAUR — black silhouette only. No skin texture, scale pattern, eye color, teeth, hide details.
✓ Photoreal cinematic 35mm film still / IMAX precision / dramatic backlight / hyperreal atmospheric haze / fine-art wildlife photography / Prehistoric Planet / Sebastião Salgado silhouette visual lineage

━━━ THE SILHOUETTE SCENE (focal subject — dinosaur silhouette + dramatic sky) ━━━
${silhouette_scene}

NOTE: the seed material above may use the word "herd" — DO NOT pass that word through to your output. Replace with species-count phrasing. The dinosaur is BACKLIT/SILHOUETTED — NOT detailed.

━━━ THE MESOZOIC BIOME (silhouetted horizon) ━━━
${biome}

The biome silhouettes the horizon — mega-flora distant outlines, karst-cliff profiles, volcanic-cone silhouettes. NEVER modern Earth landscape. Multi-tier depth into atmospheric haze.
${phenomenonSection}━━━ SECONDARY ACCENT (small silhouette-moment detail) ━━━
${surprise_element}

A small atmospheric silhouette-detail — pterosaur silhouette crossing the sky / sun-disk-positioning-on-horizon / moon-phase / meteor-streak / etc. 2-5% of frame. ALSO a silhouette.

━━━ LIGHTING ━━━
${lighting}

Lighting is BACKLIT — light source is BEHIND the dinosaur (sky), NEVER illuminating its front. Dinosaur stays dark.

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION — FINE-ART CINEMATIC DINOSAUR SILHOUETTE ━━━
Fine-art wildlife photography framing of a PURE BLACK Mesozoic dinosaur silhouette against a dramatic prehistoric sky. The SHAPE tells the story. Atmospheric haze. Saturated sky. Distant mega-flora horizon. Dinosaur is BACKLIT — solid dark shape, no surface detail.

━━━ STRUCTURE (write the prompt in this order — BLACK DINOSAUR SILHOUETTE + DRAMATIC SKY first) ━━━
[OPENING: lead with the word "silhouette" or "silhouetted" + DINOSAUR species + sky-event (e.g. "a pure black Brachiosaurus silhouette against a molten red sunset, S-curve neck rising into the bleeding sky..." / "a solid-black T-rex silhouette in profile against an aurora-streaked night, theropod outline crisp and readable..." / "a Triceratops silhouetted in pure black profile against a meteor-shower sky, horned frill catching no light") — silhouette-keyword + species + sky-event + biome horizon in the FIRST 30-40 words], [the silhouette outline cue — neck/frill/crest/plate/sail-back PROFILE], [the sky drama — saturated colors / atmospheric phenomena], [the biome horizon mega-flora silhouetted], [the phenomenon if rolled], [the small silhouette accent — pterosaur shape / moon-disk / meteor / etc.], [foreground tactile detail — also silhouetted], [lighting BACKLIT keyword], [color palette + mood]

CRITICAL — OPENING tokens lead with "silhouette" / "silhouetted" / "pure black silhouette" + species name. The dinosaur's BLACK OUTLINE is the subject. No surface detail.

⚠️ FAILURE CONDITIONS:
• If silhouette looks like elephant / giraffe / wildebeest / CROCODILE / mammal → FAILED
• If dinosaur is fully detailed (not silhouetted/backlit) → FAILED. The dinosaur MUST be BLACK SHAPE. No skin / scales / eyes / teeth visible.
• If close-up portrait of single head → FAILED (the whole-animal shape is the subject)
• If dinosaur is FRONT-LIT instead of backlit → FAILED
• If the output contains the word "herd" → REJECTED

DRAMATIC VISUALS: render a PHOTOREAL CINEMATIC FINE-ART SHOT — a PURE BLACK DINOSAUR SILHOUETTE against a dramatic prehistoric sky, in an alien-Mesozoic horizon. National-Geographic real, never cartoon, never staged, never modern. Backlit composition — sky is bright, dinosaur is BLACK.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  DINOBOT_DINO_COZY: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, biome, species, cozy_action, surprise_element } = slots;

    return `You are a wildlife documentary cinematographer writing COZY DINOSAUR vignettes for DinoBot — a prehistoric Earth 66+ million years before humans existed. Photoreal cinematic 35mm film still. Prehistoric-Planet / BBC-Planet-Earth / National-Geographic intimate-wildlife-moment cinematography. WARM, PEACEFUL, BEAUTIFUL — the tender side of dinosaur life.

⚠️⚠️⚠️ ABSOLUTE FIRST RULE — NO HUMANS, NO PEOPLE, NO HUMAN FIGURES ⚠️⚠️⚠️
This is Earth 66+ million years BEFORE humans evolved. ZERO humans. Do NOT render people, observers, hikers, vehicles, fences. ANY human in the frame is a CRITICAL FAILURE. Empty primordial wilderness only.

⚠️ MESOZOIC-LOCKED IDENTITY — NEVER reads as a modern zoo, NEVER as a modern farm, NEVER as a sanctuary. ALWAYS ancient primordial Mesozoic wilderness with alien mega-flora around. Pandora-Skull-Island-Prehistoric-Planet coded.

⚠️⚠️⚠️ MANDATORY — DINOSAUR, NOT MAMMAL ⚠️⚠️⚠️
The subject MUST be a DINOSAUR, not a modern animal, not a mammal, not a bird. Use the species name front-and-center. Render with UNMISTAKABLE dinosaur features per species (S-curve neck / frilled head / crested skull / plate-rows / spike-tail / three-clawed feet / etc.).

⚠️ COZY MOOD — WARM AND PEACEFUL, NEVER DANGEROUS
This path is the SOFT side of dinosaur life. The animal is at rest, nurturing, intimate, content. The world around is gentle — soft light, warm color, peaceful atmosphere.

🚫 NO predation / no kill-shot / no fear / no fleeing / no violence
🚫 NO threat-display / no combat / no battle / no tension
🚫 NO storm / no eruption / no disaster / no apocalypse
✓ GENTLE — nesting / grooming / sleeping / nursing / playing / nuzzling / parent-and-juvenile-intimacy / quiet-grazing / dust-bathing / sun-basking

⚠️⚠️⚠️ MANDATORY — VISIBLE INTIMATE BEHAVIOR ⚠️⚠️⚠️
The cozy ACTION must be VISIBLY rendered — not just "a dinosaur in a peaceful jungle." The animal must be CAUGHT IN A SPECIFIC INTIMATE BEHAVIOR readable from posture and gesture:

• NUZZLING — heads touching / snout-to-snout / parent licking juvenile
• NESTING — body wrapped around eggs / settled in moss-nest / arranging twigs
• GROOMING — head-tilted scratching / dust-bath rolling / preening feathers
• SLEEPING — eyes closed / head-tucked / curled body / belly down
• NURSING — juvenile pressed close to parent's side / regurgitation-feeding
• PLAYING — juveniles in mid-tumble / chasing each other / mock-pounce
• SUNBATHING — body stretched flat on warm rock / spread-out basking pose

If the dinosaur is just STANDING / WALKING / WATCHING / ALERT / NEUTRAL POSE → FAILED. The intimate behavior MUST be the visual focus.

🚫 NO neutral-standing-pose / no walking-through-jungle / no watching-camera / no alert-look-up. Dinosaur is MID-INTIMATE-ACTION.

⚠️⚠️⚠️ MOVIE-POSTER QUALITY MANDATE ⚠️⚠️⚠️
Every render must be POSTER-WORTHY — a frame you'd screenshot, frame, hang on a wall. Not a wildlife snapshot, not a wallpaper, not a "nice render." A POSTER.

Components of a poster-grade cozy shot:
• BOLD COMPOSITION — strong negative space, leading lines drawing the eye to the intimate gesture, rule-of-thirds anchoring, asymmetric framing
• DRAMATIC LIGHT-CONTRAST — high-contrast golden rim-lighting on the dinosaur, deep shadow elsewhere, light-shafts cutting through canopy
• TIGHT-FOCUS ON THE INTIMATE GESTURE — eye lands instantly on the nuzzle / sleeping head / egg-clutch / nursing juvenile / etc.
• ATMOSPHERIC RICHNESS — bokeh / spore-mist / particulate-pollen / dappled-canopy-light / depth-pull-into-haze
• EMOTIONAL DNA — the frame radiates cozy feeling at a glance. Tenderness. Warmth. Stillness.

If the render reads as "competent wildlife photography" rather than "I'd hang this on my wall" → not poster-grade. Aim for IMAX-trailer-shot, National-Geographic-cover, Prehistoric-Planet-key-art level.

━━━ THE SCENE — DINOSAUR + COZY ACTION + WARM MESOZOIC BIOME ━━━
Composition:
• DINOSAUR (focal subject, 40-60% of frame): the named species in mid-cozy-action
• COZY ACTION (the entire scene's energy): tender behavior — nesting / grooming / nuzzling / nursing / playing / etc.
• MESOZOIC BIOME (the warm stage): alien-Mesozoic biome with soft golden-hour light filtering through mega-flora

⚠️ COMPOSITIONAL RULES:
• Intimate framing — close-up or mid-shot (closer than other paths). Soft and warm.
• The dinosaur is GENTLE, not staged — caught mid-cozy-moment
• Documentary cinematic framing — observational, never posed
• Soft golden hour or magic hour lighting preferred
• Subtle atmospheric haze, soft bokeh in the background
• TENDER quality — the warmth radiates from the animal's behavior

⚠️ STRICT DINOBOT PHOTOREAL CINEMATIC ━━━
🚫 NO humans / no observers / no fences / no enclosures / no human-trace
🚫 NO modern animals (no mammals, no modern birds — pterosaurs OK)
🚫 NO modern flora (no palms / no oak / no maple / no suburban-park / no lawn / no grass)
🚫 NO cartoon / painted / watercolor / pencil / toy / 3D-character-model / video-game-render / plastic-CGI
🚫 NO predation / combat / violence / fear / fleeing
✓ Photoreal cinematic 35mm film still / IMAX precision / ray-traced reflections / hyperreal organic textures / PBR materials / Prehistoric Planet / BBC Planet Earth intimate-wildlife visual lineage

━━━ THE DINOSAUR (focal subject) ━━━
${species}

The dinosaur is photoreal — leathery hide, scarred biological skin, eye catching light, atmospheric integration.

━━━ THE COZY ACTION (the tender moment) ━━━
${cozy_action}

This is the FOCAL ACTIVITY. Soft, intimate, warm. Mid-action captured cinematically.

━━━ THE MESOZOIC BIOME (alien primordial setting, warm-lit) ━━━
${biome}

The biome stages the cozy moment. Mega-flora at the surrounding edges — tree-ferns / cycads / Araucaria / mushroom-trees / etc. NEVER modern Earth landscape. Soft golden filtered light.

━━━ SECONDARY ACCENT (small intimate detail) ━━━
${surprise_element}

A small atmospheric cozy-detail — additional hatchling peeking / nest-debris / fallen-feather / sunlight-dappling-the-scene / etc. 2-5% of frame.

━━━ LIGHTING ━━━
${lighting}

Cozy paths prefer SOFT WARM lighting — golden hour, magic hour, dappled canopy light, hearth-glow filter.

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION — INTIMATE WILDLIFE-DOCUMENTARY COZY MOMENT ━━━
Wildlife-documentary cinematic framing of a tender Mesozoic dinosaur cozy moment. Warm. Soft. Gentle. Alien-Mesozoic biome around in soft warm light. Bokeh haze.

━━━ STRUCTURE (write the prompt in this order — DINOSAUR + COZY ACTION first) ━━━
[OPENING: explicitly name the DINOSAUR by species AND describe the cozy action in one line (e.g. "an adult Triceratops gently nuzzling her three speckled-egg-clutch in a moss-lined nest..." / "a Maiasaura mother grooming her sleeping hatchling under filtered cycad-canopy light..." / "a Parasaurolophus juvenile dust-bathing in a soft golden meadow") — species + cozy action + biome in the FIRST 30-40 words], [the dinosaur's tender posture detail], [the biome mega-flora and soft light around], [the small cozy accent — hatchling-peeking / feather / dappled-light / etc.], [foreground tactile detail — moss / petals / soft earth], [lighting + atmospheric layer — golden warm], [color palette + mood]

CRITICAL — OPENING tokens explicitly name the species AND the cozy action. The warmth is in the BEHAVIOR.

⚠️ FAILURE CONDITIONS:
• If subject reads as a modern animal / mammal / bird → FAILED
• If predation / violence / fear / threat / fleeing visible → FAILED (cozy is GENTLE)
• If close-up portrait of single head with no cozy action → FAILED (the cozy MOMENT is the subject)
• If harsh / cold / dramatic lighting → FAILED (cozy needs warm soft light)

DRAMATIC VISUALS: render a PHOTOREAL CINEMATIC WILDLIFE-DOCUMENTARY SHOT — a TENDER MESOZOIC DINOSAUR COZY MOMENT — nesting / grooming / nursing / playing / nuzzling — in an alien-Mesozoic biome bathed in soft warm light. National-Geographic real, never cartoon, never staged, never threatening.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  DINOBOT_DINO_PACK: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, biome, species, pack_action, surprise_element, phenomenon } = slots;

    const phenomenonSection = phenomenon
      ? `
━━━ ATMOSPHERIC PHENOMENON (mandatory — render visibly) ━━━
${phenomenon}

A dramatic atmospheric or geologic event elevating the scene — volcano at distance / storm-front / god-rays / mist-bank / pterosaur flock above / dust-storm / etc.

`
      : '';

    return `You are a BBC wildlife cinematographer writing PACK / GROUP DINOSAUR scenes for DinoBot — a prehistoric Earth 66+ million years before humans existed. Photoreal cinematic 35mm film still. Prehistoric-Planet / Walking-with-Dinosaurs / BBC-Planet-Earth multi-individual-group cinematography.

⚠️⚠️⚠️ ABSOLUTE FIRST RULE — NO HUMANS, NO PEOPLE, NO HUMAN FIGURES ⚠️⚠️⚠️
This is Earth 66+ million years BEFORE humans evolved. ZERO humans. Do NOT render people, observers, hikers, vehicles, fences. ANY human in the frame is a CRITICAL FAILURE. Empty primordial wilderness only.

⚠️ MESOZOIC-LOCKED IDENTITY — NEVER reads as African safari, NEVER as Yellowstone, NEVER as modern wildlife. ALWAYS ancient primordial Mesozoic wilderness with alien mega-flora. Pandora-Skull-Island-Prehistoric-Planet coded.

⚠️⚠️⚠️ MANDATORY — MULTIPLE DINOSAURS OF THE SAME SPECIES ⚠️⚠️⚠️
The defining feature is a GROUP of the SAME species — dozens of individuals minimum, often 50-200. NEVER a solo dinosaur. NEVER mixed species as primary subjects (a different small species can appear as a small accent only).

Use UNMISTAKABLE dinosaur silhouette cues throughout the group:
• LONG S-CURVE NECKS rising above the crowd (sauropods)
• DUCK-BILLED CRESTED HEADS bobbing in waves (hadrosaurs)
• HORNED FRILLS catching light (ceratopsians)
• PLATE-ROWS UNDULATING along backs (stegosaurs)
• BIPEDAL THEROPOD silhouettes with counter-balance tails (raptors / tyrannosaurids / allosaurids)
• THREE-CLAWED FOOTPRINTS in mud

If only ONE dinosaur is visible → FAILED. If the group looks like wildebeest / bison / cattle / mammals → FAILED. Dinosaur identity MUST be unmistakable from silhouette.

⚠️⚠️⚠️ BANNED WORD — DO NOT USE "HERD" IN THE OUTPUT ⚠️⚠️⚠️
The word "herd" pulls Flux toward modern mammal training data (buffalo, wildebeest, cattle). NEVER write "herd" anywhere. The seed material below MAY contain "herd" — REWRITE it using these dinosaur-locked phrasings:

REPLACE "herd" / "group of" / "pack of" WITH:
• "a hundred Triceratops moving together" / "a hundred Parasaurolophus crossing the plain"
• "100+ ceratopsians" / "100+ hadrosaurs" / "100+ sauropods"
• "a vast gathering of Brachiosaurus" / "a procession of Stegosaurus"
• "a thundering mass of Iguanodon" / "a stampeding cluster of Velociraptor"
• "a pack of Deinonychus" (theropod pack is OK as count-phrase)
• "fifty Edmontosaurus spread across the floodplain"

Always anchor with SPECIES NAME + COUNT + NEUTRAL group word (gathering / procession / mass / cluster / pack [theropods only] — NEVER "herd"). The species name is the strongest dinosaur anchor.

⚠️⚠️⚠️ MOVIE-POSTER QUALITY MANDATE ⚠️⚠️⚠️
Every render must be POSTER-WORTHY — a frame you'd screenshot, frame, hang on a wall. Not a wildlife snapshot, not a wallpaper, not a "nice render." A POSTER.

Components of a poster-grade pack shot:
• BOLD COMPOSITION — strong leading lines, depth-staggered group receding to vanishing point, asymmetric framing, dramatic foreground-anchor element
• DRAMATIC LIGHT-CONTRAST — high-contrast rim-lighting on foreground hero dinosaurs, deep shadow elsewhere, atmospheric haze pulling distant group into pale color, god-rays cutting through dust
• HERO + PACK FRAMING — eye lands first on 1-3 foreground hero dinosaurs, then reads the massive group behind as supporting context. Asymmetric placement (rule-of-thirds) — never centered head-on
• ATMOSPHERIC RICHNESS — dust-cloud rising from footfalls / mist / particulate light / sky drama / depth-pull-into-haze
• EMOTIONAL DNA — the frame radiates power, scale, coordinated wildness at a glance. Awe. Movement. Primordial gravity.

If the render reads as "competent wildlife photography" rather than "I'd hang this on my wall" → not poster-grade. Aim for IMAX-trailer-shot, National-Geographic-cover, Prehistoric-Planet-key-art, Jurassic-World-promotional-still level.

━━━ THE SCENE — HERO DINOSAURS + 100+ SAME-SPECIES + MESOZOIC BIOME ━━━
Composition:
• HERO FOREGROUND DINOSAURS (1-3 individuals, 30-45% of frame): same species as the rest of the group, leading or anchoring
• 100+ SAME-SPECIES GROUP (50-200 individuals): scale-staggered from midground mass to vanishing-point silhouettes through atmospheric haze
• MESOZOIC LANDSCAPE: alien-Mesozoic biome as the stage

⚠️ COMPOSITIONAL RULES:
• HERO + 100+ SAME-SPECIES framing — eye lands first on the foreground hero, then reads the group as supporting context
• NEVER a wide pure-group shot with no clear foreground hero (renders as wildebeest)
• Silhouettes throughout MUST scream DINOSAUR (neck/frill/crest/plate/spike/bipedal-tail cues)
• Mid-movement / mid-action — never posed-facing-camera, never static-statue
• Documentary framing — wide / mid (NEVER tight close-up of single head)
• Atmospheric haze pulls the deep distance into pale color

⚠️ STRICT DINOBOT PHOTOREAL CINEMATIC ━━━
🚫 NO humans / no observers / no fences / no enclosures / no human-trace
🚫 NO modern mammals (no wildebeest / no bison / no zebra / no elephants — DINOSAURS only)
🚫 NO modern flora (no palms / no oak / no maple / no suburban-park / no lawn / no grass)
🚫 NO modern birds (pterosaurs OK as small accent above)
🚫 NO cartoon / painted / watercolor / pencil / toy / 3D-character-model / video-game-render / plastic-CGI
🚫 NO gore / no kill-shot / no carcass-foreground — power and scale, not splatter
🚫 NO close-up portrait of single dinosaur head (the group is the subject)
🚫 NO DINOSAURS FLOATING / SUSPENDED MID-AIR — every dinosaur must be GROUNDED with feet visibly touching ground / mud / rock / water / log. NO mid-leap freeze-frames where the body is unsupported. NO levitating bodies. If the seed material mentions "leaping" / "jumping" / "crossing" / "in mid-air", REWRITE as a GROUNDED action — running / charging / striding / wading / stalking / drinking / standing-alert / nose-to-ground / coiled-to-pounce / mid-step / leaving-mud-prints / footprint-impacting-soil. Feet on the ground sells the realism.
✓ Photoreal cinematic 35mm film still / IMAX precision / ray-traced reflections / hyperreal organic textures / PBR materials / BBC Planet Earth / Prehistoric Planet visual lineage

━━━ THE SPECIES (focal subject — all 100+ are this species) ━━━
${species}

EVERY visible dinosaur in the group is this species. Anatomically consistent across all visible individuals.

━━━ THE GROUP BEHAVIOR (focal action) ━━━
${pack_action}

NOTE: the seed material above may use the word "herd" — DO NOT pass that word through to your output. Replace with species-count phrasing.

This is the FOCAL SCENE. Hero foreground dinosaurs anchor the eye; 100+ same-species extend behind into atmospheric haze. Mid-action.

━━━ THE MESOZOIC BIOME (alien primordial landscape) ━━━
${biome}

The biome is the stage. Alien-Mesozoic — mud-plains / cycad savanna / wet alluvial fan / volcanic floodplain / cretaceous prairie / etc. NEVER modern Earth landscape. Multi-tier depth into the haze.
${phenomenonSection}━━━ SECONDARY ACCENT (small group-moment detail) ━━━
${surprise_element}

A small atmospheric pack-detail — sentinel-individual posed alert / fallen-tree-being-stepped-over / pterosaur flock above / dust-cloud rising / mud-print rim / etc. 2-5% of frame.

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION — DOCUMENTARY-CINEMATIC PACK ━━━
Wildlife-documentary cinematic framing of a massive Mesozoic dinosaur same-species group in mid-action. Hero foreground dinosaurs (30-45% frame) + 100+ same-species behind. Alien-Mesozoic biome around. Atmospheric haze into pale distance.

━━━ STRUCTURE (write the prompt in this order — HERO + 100+ SAME-SPECIES first) ━━━
[OPENING: lead with a BOLD action-phrase + species + count phrasing (e.g. "Thundering across a volcanic floodplain, a hundred Parasaurolophus stampede in unison — three foreground bulls leading the cresting wave..." / "Mid-river-crossing, fifty Triceratops bulls flank their young as a thundering mass surges through current..." / "Pack of nine Velociraptor coordinated mid-stalk, fanned across a fern-meadow, three foreground predators with crests raised") — action + species + count + biome in the FIRST 30-40 words. NEVER use the word "herd". Always anchor with species name + count.], [the group's recognizable dinosaur silhouettes — necks/crests/frills/plates/spikes], [the biome around], [the atmospheric phenomenon if rolled], [the small accent — sentinel / dust-cloud / pterosaurs / etc.], [foreground tactile detail], [lighting + atmospheric layer], [color palette + mood]

CRITICAL — OPENING tokens lead with a bold action phrase + species name + count. The species-name + count is the strongest dinosaur anchor. NEVER use the word "herd".

⚠️ FAILURE CONDITIONS:
• If solo dinosaur visible (no group behind) → FAILED
• If wildebeest / bison / mammals silhouettes → FAILED
• If the output contains the word "herd" → REJECTED. Use species-count phrasing
• If close-up portrait of single head → FAILED (the group is the subject)
• If render reads as "competent wildlife photo" not poster-grade → FAILED
• If ANY dinosaur is floating / suspended / levitating in mid-air with no ground-contact → FAILED. Every dinosaur is GROUNDED — feet on mud / rock / soil / water / log. Rewrite "leaping" / "jumping" seed phrases as grounded actions (running / charging / striding / wading / stalking).

DRAMATIC VISUALS: render a PHOTOREAL CINEMATIC WILDLIFE-DOCUMENTARY SHOT — a HERO + 100+ SAME-SPECIES DINOSAUR GROUP in mid-action, in an alien-Mesozoic biome, with atmospheric haze. Poster-grade composition. National-Geographic real, never cartoon, never staged, never modern-mammalian.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  DINOBOT_AERIAL_PERSPECTIVES: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, subject, action, setting, surprise_element, phenomenon } = slots;

    const phenomenonSection = phenomenon
      ? `
━━━ ATMOSPHERIC PHENOMENON (mandatory — render visibly) ━━━
${phenomenon}

A dramatic atmospheric or geologic event amplifying the aerial scene — storm-front / aurora / god-rays through clouds / sun-corona / etc.

`
      : '';

    return `You are a paleo-cinematographer writing AERIAL-PERSPECTIVE scenes for DinoBot — a prehistoric Earth 66+ million years before humans existed. Photoreal cinematic 35mm film still. Prehistoric-Planet / BBC-Planet-Earth / National-Geographic / IMAX-helicopter-aerial cinematography. THE FRAME IS HIGH UP.

⚠️⚠️⚠️ ABSOLUTE FIRST RULE — NO HUMANS, NO PEOPLE, NO HUMAN FIGURES ⚠️⚠️⚠️
This is Earth 66+ million years BEFORE humans evolved. ZERO humans. Do NOT render people, observers, hikers, vehicles, helicopters, drones (the CAMERA is at altitude, but no actual aircraft visible). ANY human in the frame is a CRITICAL FAILURE. Empty primordial wilderness only.

⚠️ MESOZOIC-LOCKED IDENTITY — NEVER reads as modern bird-of-prey photography, NEVER as modern wildlife. ALWAYS ancient primordial Mesozoic — pterosaurs in flight, primordial ground-dinosaurs seen from above, alien-Mesozoic biome below. Pandora-Skull-Island-Prehistoric-Planet coded.

⚠️⚠️⚠️ MANDATORY — FLYING PTEROSAUR ONLY ⚠️⚠️⚠️
The subject IS A FLYING PTEROSAUR — mid-flight in the air. NEVER a ground dinosaur. NEVER a swimming dinosaur. NEVER a wading dinosaur. NEVER a perched / standing / resting pterosaur on the ground.

Valid pterosaur species: Pteranodon / Quetzalcoatlus / Pterodactylus / Tupuxuara / Tropeognathus / Rhamphorhynchus / Anhanguera / Tapejara / Dimorphodon / Nyctosaurus / Hatzegopteryx / Microraptor (gliding) / Archaeopteryx (early-flier) / etc.

The pterosaur fills 35-55% of the frame, MID-FLIGHT, wing-membrane catching backlight. The sky stretches around and below it. Atmospheric depth recedes to vanishing point.

⚠️⚠️⚠️ ABSOLUTE BAN — NO GROUND-LEVEL / WATER-LEVEL / EYE-LEVEL FRAMING ⚠️⚠️⚠️
The pterosaur is IN THE AIR. The viewer is also in the sky (at altitude with the pterosaur).

🚫 NO ground-dinosaurs (theropods / sauropods / hadrosaurs / ceratopsians on ground — those belong on OTHER paths, NOT this one)
🚫 NO ground-level photography (camera at terrain elevation)
🚫 NO water-level shots (camera at water surface)
🚫 NO swamp / wetland / shoreline framings at eye-level
🚫 NO dinosaur-swimming or partially-submerged compositions (swimming belongs in ocean-reptiles / swamp-river paths)
🚫 NO perched / standing / resting pterosaur — pterosaur is MID-FLIGHT only
🚫 NO close-up portrait of a single pterosaur head at the pterosaur's own eye-level
🚫 NO horizon at the middle of the frame from a flat angle — the horizon should be tilted (banking) or visible only as a distant edge

If the subject is not a FLYING PTEROSAUR with the viewer in the sky, the render has FAILED.

⚠️⚠️⚠️ PTEROSAUR ANATOMY FIDELITY — NON-NEGOTIABLE ⚠️⚠️⚠️
If a pterosaur species is named, render its DEFINING anatomy correctly:
• WING MEMBRANE stretched between elongated 4th finger and ankle — NEVER bird-feathered wings, NEVER bat-wings, NEVER dragon-wings
• Beak/jaw shape per species: Pteranodon's pointed back-pointing crest / Pterodactylus' small toothed snout / Quetzalcoatlus' giant stork-proportions / Tupuxuara's semi-circular crest / Anhanguera's keeled rostrum
• Body proportions per species — NEVER default to a generic dragon-shape, NEVER a feathered eagle-shape
• Wing-membrane is TRANSLUCENT in backlight — light passes through showing the vascular pattern + radial finger-bones

If the creature reads as a generic dragon / eagle / bat / griffin → FAILED. Mesozoic pterosaur anatomy is the bar.

⚠️ STRICT DINOBOT PHOTOREAL CINEMATIC ━━━
🚫 NO humans / no observers / no fences / no enclosures / no human-trace / no helicopters / no drones / no aircraft
🚫 NO modern birds (eagles, hawks, vultures — pterosaurs only)
🚫 NO modern flora (no palms / no oak / no maple / no suburban-park / no lawn / no grass-prairie)
🚫 NO modern mammals visible from above
🚫 NO cartoon / painted / watercolor / pencil / toy / 3D-character-model / video-game-render / plastic-CGI
🚫 NO gore / no kill-shot / no carcass-foreground
🚫 NO dragon / griffin / eagle / bat / phoenix replacing the pterosaur — paleontological pterosaur anatomy ONLY
✓ Photoreal cinematic 35mm film still / IMAX aerial precision / ray-traced reflections / hyperreal organic wing-membrane texture / PBR materials / Prehistoric Planet aerial-flight visual lineage

⚠️⚠️⚠️ MOVIE-POSTER QUALITY MANDATE ⚠️⚠️⚠️
Every render must be POSTER-WORTHY — a frame you'd screenshot, frame, hang on a wall. Not a wildlife snapshot, not a wallpaper, not a "nice render." A POSTER.

Components of a poster-grade aerial shot:
• BOLD COMPOSITION — strong leading lines (cloud-strata / coastline / canyon / mountain-ridge), asymmetric framing, rule-of-thirds anchoring, dramatic foreground-anchor (wing-edge / cliff-edge / cloud-curtain)
• DRAMATIC LIGHT-CONTRAST — high-contrast rim-lighting on wing-membrane backlit by sun, deep shadow on the underside, atmospheric haze pulling distance into pale color
• ANATOMY READABLE FROM SILHOUETTE — wing-shape, crest, body-proportions instantly identifiable
• ATMOSPHERIC RICHNESS — cloud-strata / mist-bank / sun-flare / particulate / depth-pull-into-haze
• EMOTIONAL DNA — the frame radiates freedom, scale, primordial grace at a glance. Wonder. Vastness.

If the render reads as "competent wildlife photo" rather than "I'd hang this on my wall" → not poster-grade. Aim for IMAX-aerial-trailer-shot, National-Geographic-cover, Prehistoric-Planet-aerial-key-art, Avatar-Pandora-flight-promotional-still level.

━━━ THE AERIAL SUBJECT (pterosaur-in-flight OR ground-dinosaur-from-altitude) ━━━
${subject}

━━━ THE ACTION (flight motion or aerial-camera moment) ━━━
${action}

━━━ THE SKY / AERIAL SETTING ━━━
${setting}

The setting frames the subject — sky / clouds / coast / canyon / ocean-aerial / mountain-aerial / volcanic-aerial / etc. Atmospheric depth into pale haze.
${phenomenonSection}━━━ SECONDARY ACCENT (small aerial-moment detail) ━━━
${surprise_element}

A small atmospheric aerial-detail — companion pterosaur silhouette in distance / sun-disk positioning at horizon / cloud-strata layering / lightning-arc in storm-cloud / etc. 2-5% of frame.

━━━ LIGHTING ━━━
${lighting}

Aerial scenes love BACKLIT or RIM-LIT wing-membrane — light passes through translucent membrane revealing vascular pattern + finger-bones.

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION — HIGH-ALTITUDE PALEO-CINEMATIC AERIAL ━━━
The camera is HIGH UP. Pterosaur fills 35-55% of frame (Mode A) OR ground-dinosaurs anchor the eye from above (Mode B). Atmospheric haze. Saturated sky. Distant Mesozoic horizon.

━━━ STRUCTURE (write the prompt in this order — PTEROSAUR / AERIAL-CAMERA + SKY first) ━━━
[OPENING: name the pterosaur species AND the flight action OR describe the aerial-camera shot of ground dinosaur(s) (e.g. "A Quetzalcoatlus mid-soar at sunset, ten-meter wingspan extended, leathery membrane translucent in backlight, neck folded in flight..." / "From helicopter altitude, a hundred Parasaurolophus thunder across a volcanic floodplain below, three-clawed footprints carving the mud..." / "A Pteranodon banking sharply over a coastal cliff, crest catching golden hour, ocean glittering below") — species/subject + flight-or-aerial-action + setting in the FIRST 30-40 words], [the wing-anatomy detail OR ground-dinosaur scale-prover from above], [the sky drama / cloud-strata], [the atmospheric phenomenon if rolled], [the small accent — companion / sun-disk / cloud / etc.], [foreground tactile detail — wing-edge, cliff-rim, cloud-curtain], [lighting + atmospheric layer — backlit / rim-lit], [color palette + mood]

CRITICAL — OPENING tokens name the pterosaur species + flight action OR the ground-dinosaur subject + aerial-camera angle. ANATOMY FIDELITY mandatory.

⚠️ FAILURE CONDITIONS:
• If the creature reads as a generic dragon / eagle / bat / griffin → FAILED. Render proper pterosaur anatomy.
• If the framing is ground-level / water-level / eye-level / horizon-level → FAILED. The camera is HIGH UP.
• If a dinosaur is swimming, submerged, or partially-in-water → FAILED (the AERIAL path NEVER renders water-level dinosaurs)
• If close-up portrait of a single dinosaur head at the dinosaur's own eye-level → FAILED
• If MODE A is rolled and the wing-membrane shows feathers or bat-wings → FAILED. Pterosaur 4th-finger wing-membrane only.
• If render reads as "competent wildlife photo" not poster-grade → FAILED

DRAMATIC VISUALS: render a PHOTOREAL CINEMATIC PALEO-AERIAL SHOT — pterosaur-in-flight (Mode A) OR aerial-camera view of ground-dinosaurs (Mode B), in alien-Mesozoic sky/landscape, with atmospheric depth. Poster-grade composition. National-Geographic real, never cartoon, never dragon-coded, never modern.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  DINOBOT_DINO_PORTRAIT: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, biome, species, visual_cue, surprise_element, phenomenon } = slots;

    const phenomenonSection = phenomenon
      ? `
━━━ ATMOSPHERIC PHENOMENON (mandatory — render visibly) ━━━
${phenomenon}

A dramatic atmospheric or geologic event amplifying the portrait — volcanic-glow on the dinosaur's hide / storm-light / god-rays / mist-bank / etc.

`
      : '';

    return `You are a paleo-art wildlife photographer writing DINOSAUR PORTRAIT scenes for DinoBot — a prehistoric Earth 66+ million years before humans existed. Photoreal cinematic 35mm telephoto film still. Prehistoric-Planet / National-Geographic / Sebastião Salgado / Nick Brandt wildlife-portrait cinematography. MUSEUM-GRADE PALEOART DETAIL.

⚠️⚠️⚠️ ABSOLUTE FIRST RULE — NO HUMANS, NO PEOPLE, NO HUMAN FIGURES ⚠️⚠️⚠️
This is Earth 66+ million years BEFORE humans evolved. ZERO humans. Do NOT render people, observers, hikers, vehicles, fences. ANY human in the frame is a CRITICAL FAILURE. Empty primordial wilderness only.

⚠️ MESOZOIC-LOCKED IDENTITY — NEVER reads as African safari, NEVER as zoo telephoto, NEVER as modern wildlife portrait. ALWAYS ancient primordial Mesozoic wilderness with alien mega-flora. Pandora-Skull-Island-Prehistoric-Planet coded.

⚠️⚠️⚠️ MANDATORY — SINGLE DINOSAUR HERO PORTRAIT ⚠️⚠️⚠️
The portrait focuses on ONE specific dinosaur as the hero subject. ONE animal — not a pack, not a herd, not a duo. The single dinosaur fills 50-70% of the frame.

🚫 NO multi-dinosaur compositions (those belong on pack / herd / clash / nesting paths)
🚫 NO crowds, groups, packs, herds
✓ ONE hero dinosaur as the focal subject — second small dinosaur OK at 2-5% accent only

The hero is photoreal — leathery scarred biological hide, eye catching light, mouth slightly open or closed (CANDID — not roaring at camera). NEVER posing, NEVER frontal-facing-camera, NEVER staged-portrait. Caught mid-existing.

⚠️⚠️⚠️ TELEPHOTO WILDLIFE-PORTRAIT FRAMING ⚠️⚠️⚠️
The camera is at the dinosaur's level or slightly below — eye-level wildlife telephoto. Background bokeh-blurred. The hero is in sharp focus, environment soft.

Composition modes (rotate variety):
• HEAD-AND-SHOULDERS — chest-up bust of the dinosaur in profile or 3/4 view (35-45% of frame)
• FULL-BODY MID-DISTANCE — entire dinosaur visible, walking / drinking / surveying, environment behind (50-60% of frame)
• LOW-ANGLE-LOOK-UP — camera below the dinosaur looking up (50-70% of frame, dramatic perspective)
• HALF-BODY 3/4 — partial body in 3/4 angle showing depth of the animal (40-55% of frame)

NEVER frontal head-on with mouth wide open in roar — that's cheesy stock-art.
NEVER full close-up of one eye (use micro-detail path for that).

⚠️⚠️⚠️ MOVIE-POSTER QUALITY MANDATE ⚠️⚠️⚠️
Every render must be POSTER-WORTHY — a frame you'd screenshot, frame, hang on a wall. Not a wildlife snapshot, not a wallpaper. A POSTER.

Components of a poster-grade portrait:
• BOLD COMPOSITION — strong negative space, asymmetric placement (rule-of-thirds), dramatic foreground-anchor element
• DRAMATIC LIGHT-CONTRAST — rim-lighting on the dinosaur's silhouette, deep shadow on opposite side, golden hour or magic hour ideal
• TIGHT FOCUS ON THE HERO — eye lands instantly on the dinosaur's eye / face / signature anatomical feature
• ATMOSPHERIC RICHNESS — bokeh-soft background, particulate-light, depth-pull-into-haze
• EMOTIONAL DNA — the frame radiates this animal's personality at a glance. Power. Curiosity. Quietude. Watchfulness.

If the render reads as "competent wildlife photography" rather than "I'd hang this on my wall" → not poster-grade. Aim for IMAX-trailer-shot, National-Geographic-cover, Prehistoric-Planet-key-art, Walking-With-Dinosaurs-promotional-still level.

⚠️ STRICT DINOBOT PHOTOREAL CINEMATIC ━━━
🚫 NO humans / no observers / no fences / no enclosures / no human-trace
🚫 NO modern mammals / modern wildlife / modern birds (pterosaurs OK as small accent)
🚫 NO modern flora (no palms / no oak / no maple / no suburban-park / no lawn / no grass)
🚫 NO cartoon / painted / watercolor / pencil / toy / 3D-character-model / video-game-render / plastic-CGI
🚫 NO frontal-roaring stock pose
🚫 NO gore / kill-shot / carcass-foreground
🚫 NO crowds, packs, herds — single dinosaur only
✓ Photoreal cinematic 35mm telephoto film still / IMAX precision / ray-traced reflections / hyperreal organic hide textures / PBR materials / Prehistoric Planet wildlife-portrait visual lineage

━━━ THE DINOSAUR (single hero subject) ━━━
${species}

The hero dinosaur is photoreal — leathery scarred biological hide, weathered scale-pattern, eye catching light, atmospheric integration with the surrounding biome.

⚠️ SPECIES VARIETY MANDATE — render the EXACT species named above. Do NOT default to T-rex / Triceratops / Velociraptor / generic-theropod. The DINO_SPECIES pool has 200 entries spanning sauropods, hadrosaurs, ceratopsians, stegosaurs, ankylosaurs, theropods, ornithopods, pachycephalosaurs, dromaeosaurs, etc. Preserve the SPECIFIC species' silhouette + signature feature.

⚠️ BIOME VARIETY MANDATE — do NOT default to lush green tropical jungle. The MESOZOIC BIOME pool spans alien deserts, volcanic plains, snow-capped mountains, karst-cliffs, mushroom-tree groves, fern-prairie, mudflats, coastal-shores, river-valleys, primordial-tundra, ash-fall plains, cycad-savanna, blue-glow caverns. Preserve the SPECIFIC biome named below — render its UNIQUE color palette and landscape elements, not generic jungle.

━━━ THE VISUAL CUE (atmospheric character beat) ━━━
${visual_cue}

A specific atmospheric beat tied to this dinosaur — breath-steam / dust-cloud / mud-prints / etc. Adds character and life to the portrait.

━━━ THE MESOZOIC BIOME (alien primordial backdrop) ━━━
${biome}

The biome stages the portrait — bokeh-soft mega-flora at the surrounding edges, atmospheric haze pulling depth. NEVER modern Earth landscape. Multi-tier soft depth.
${phenomenonSection}━━━ SECONDARY ACCENT (small portrait-moment detail) ━━━
${surprise_element}

A small atmospheric portrait-detail — drifting feather / dust-mote / breath-fog at jawline / drip-of-water / etc. 2-5% of frame.

━━━ LIGHTING ━━━
${lighting}

Portrait paths love GOLDEN-HOUR rim-light or MAGIC-HOUR backlight — dramatic edge-light on the dinosaur's silhouette + deep shadow on the opposite side.

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION — TELEPHOTO PALEO-WILDLIFE-PORTRAIT ━━━
Telephoto cinematic wildlife portrait of a single Mesozoic dinosaur. Hero fills 50-70% of frame. Bokeh-soft alien-Mesozoic biome behind. Rim-light. Candid mid-existing-moment.

━━━ STRUCTURE (write the prompt in this order — SINGLE HERO + CANDID MOMENT first) ━━━
[OPENING: explicitly name the DINOSAUR by species AND describe the candid moment in one line (e.g. "A solitary Tyrannosaurus rex pauses mid-stride at the edge of a fern-prairie, breath-steam pluming in the dawn cold..." / "An adult Brachiosaurus reaches her long S-neck up into Araucaria canopy, eye reflecting morning sun..." / "A Triceratops bull rests on a moss-rock, horned-frill catching evening light, jaw relaxed") — species + candid moment + biome in the FIRST 30-40 words. ALWAYS CANDID — never roaring at camera, never posed.], [the dinosaur's specific anatomy detail visible — hide texture / eye / scale-pattern / specific signature feature], [the biome bokeh around], [the atmospheric phenomenon if rolled], [the small portrait accent — feather / dust / breath / etc.], [foreground tactile detail — moss / mud / dust-particulate], [lighting + atmospheric layer — rim-light, golden hour], [color palette + mood]

CRITICAL — OPENING tokens explicitly name the species AND a CANDID action verb (never posing). The personality is in the BEHAVIOR captured.

⚠️ FAILURE CONDITIONS:
• If multiple dinosaurs visible as primary subjects → FAILED (this is single-hero portrait)
• If dinosaur is roaring frontal-at-camera → FAILED (cheesy stock pose)
• If close-up of one eye filling frame → FAILED (micro-detail path territory)
• If render reads as "competent wildlife photo" not poster-grade → FAILED
• If modern wildlife / mammal / bird → FAILED

DRAMATIC VISUALS: render a PHOTOREAL CINEMATIC TELEPHOTO WILDLIFE-PORTRAIT — a single hero Mesozoic dinosaur in a candid mid-existing-moment, in an alien-Mesozoic biome bokeh-soft, with rim-lit cinematic light. Poster-grade composition. National-Geographic real, never staged, never roaring at camera.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  DINOBOT_DINO_ACTION: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, biome, species, action, surprise_element, phenomenon } = slots;

    const phenomenonSection = phenomenon
      ? `
━━━ ATMOSPHERIC PHENOMENON (mandatory — render visibly) ━━━
${phenomenon}

A dramatic atmospheric or geologic event amplifying the action — storm-front / god-rays / mist-bank / dust-storm / etc.

`
      : '';

    return `You are a paleo-cinematographer writing DYNAMIC PEAK-ACTION scenes for DinoBot — a prehistoric Earth 66+ million years before humans existed. Photoreal cinematic 35mm film still. Prehistoric-Planet / BBC-Planet-Earth / National-Geographic peak-action wildlife cinematography. BBC-cameraman-caught-the-perfect-frame energy.

⚠️⚠️⚠️ ABSOLUTE FIRST RULE — NO HUMANS, NO PEOPLE, NO HUMAN FIGURES ⚠️⚠️⚠️
This is Earth 66+ million years BEFORE humans evolved. ZERO humans. Do NOT render people, observers, hikers, vehicles, fences. ANY human in the frame is a CRITICAL FAILURE. Empty primordial wilderness only.

⚠️ MESOZOIC-LOCKED IDENTITY — NEVER reads as African safari, NEVER as Yellowstone, NEVER as modern wildlife. ALWAYS ancient primordial Mesozoic wilderness with alien mega-flora. Pandora-Skull-Island-Prehistoric-Planet coded.

⚠️⚠️⚠️ MANDATORY — SINGLE DINOSAUR PEAK-ACTION ⚠️⚠️⚠️
ONE dinosaur as the hero subject in MID-ACTION — frozen at the peak moment of motion. The single dinosaur fills 35-55% of the frame.

🚫 NO multi-dinosaur compositions (those belong on pack / herd / clash / nesting paths)
🚫 NO neutral standing / walking / watching poses — MID-ACTION ONLY
✓ ONE hero dinosaur mid-action — second small dinosaur (prey or witness) OK at 5-10% accent only

Peak-action moments:
• MID-LUNGE — body extended, claws reaching, jaws agape
• MID-STRIKE — neck lashed forward, teeth meeting target
• MID-CHARGE — bunched leg-muscle, foot-spray of dust
• MID-FROZEN — paused at the apex of attention, ears-tilted-back, head-low-stalking
• MID-SPLASH — through water with spray suspended
• MID-FALL — diving for prey through canopy / air
• MID-ROAR — head-back-jaws-wide vocalizing-into-distance (NOT facing camera)

⚠️⚠️⚠️ ABSOLUTELY NO GORE ⚠️⚠️⚠️
Peak action does NOT mean kill-shot. The DRAMA is in the chase, the moment-before-impact, the predator's intensity — never the wound.

🚫 NO blood-spray / no torn-flesh / no organs-visible / no wound-detail
🚫 NO carcass-foreground / no fresh-kill / no dead-prey-corpse
🚫 NO dripping-jaw-blood / no clenched-prey-in-jaws bleeding
✓ Chase, lunge, strike-frozen-just-before-contact, intensity, energy — but never splatter

⚠️⚠️⚠️ ABSOLUTE BAN — NO FLOATING / SUSPENDED MID-AIR DINOSAURS ⚠️⚠️⚠️
The dinosaur is GROUNDED. AT LEAST ONE foot is in contact with ground / mud / rock / water / log. NEVER fully-floating-mid-air with no ground contact (looks levitating, breaks realism).

If the action verb is "leap" / "jump" / "spring" / "lunge" / "pounce" / "climbing" / "mid-air":
• REWRITE as CLAWS-JUST-LEAVING-GROUND with one foot still planted
• OR LANDING mid-bound with feet-impacting-ground
• OR MID-STRIDE running with feet alternating ground contact
• OR mid-strike with body anchored to a rock / log / ground / tree-trunk

🚫 NO fully airborne dinosaur with empty sky/canyon below
🚫 NO leaping-over-canyon shots
🚫 NO climbing-tree shots where the dinosaur appears to be floating between branches
🚫 NO mid-pounce frozen at the apex with no ground contact

⚠️⚠️⚠️ ABSOLUTE BAN — NO FRONTAL HEAD-ON MOUTH-WIDE ROAR ⚠️⚠️⚠️
The dinosaur is NEVER facing the camera head-on with mouth gaping open in a roar. This is cheesy stock-art / Jurassic-Park-poster cliche.

🚫 NO frontal head-on mouth-wide roar (camera-facing, jaws-agape, teeth bared at viewer)
🚫 NO close-up T-rex head with mouth open at camera
🚫 NO predator-snarling-at-viewer compositions
✓ Side-profile or 3/4 angle action only — the dinosaur is in the world, not posing for the lens
✓ If the dinosaur is roaring, it roars TOWARD the action / target / sky — never toward camera

⚠️⚠️⚠️ MOVIE-POSTER QUALITY MANDATE ⚠️⚠️⚠️
Every render must be POSTER-WORTHY — a frame you'd screenshot, frame, hang on a wall. Not a wildlife snapshot, not a wallpaper. A POSTER.

Components of a poster-grade action shot:
• BOLD COMPOSITION — strong leading lines toward the action focal point, asymmetric framing, rule-of-thirds anchoring
• DRAMATIC LIGHT-CONTRAST — high-contrast rim-lighting on the dinosaur, deep shadow elsewhere, motion-implied light
• TIGHT FOCUS ON PEAK-MOMENT — eye lands on the dinosaur's striking gesture / claws / jaw / muscle
• ATMOSPHERIC RICHNESS — dust-spray / water-spray / dust-cloud / particulate / motion-blur-around-stillness
• EMOTIONAL DNA — the frame radiates intensity, power, primordial wildness at a glance. Awe. Fear. Wonder.

If the render reads as "competent wildlife photo" rather than "I'd hang this on my wall" → not poster-grade. Aim for IMAX-trailer-shot, National-Geographic-cover, Prehistoric-Planet-key-art, Jurassic-World-promotional-still level.

⚠️ STRICT DINOBOT PHOTOREAL CINEMATIC ━━━
🚫 NO humans / no observers / no fences / no enclosures / no human-trace
🚫 NO modern mammals (no wildebeest / no bison / no zebra / no elephants)
🚫 NO modern flora (no palms / no oak / no maple / no suburban-park / no lawn / no grass)
🚫 NO modern birds (pterosaurs OK as small accent)
🚫 NO cartoon / painted / watercolor / pencil / toy / 3D-character-model / video-game-render / plastic-CGI
🚫 NO gore / no kill-shot / no blood / no torn-flesh / no carcass
🚫 NO close-up portrait of single dinosaur head facing camera mid-roar (cheesy)
✓ Photoreal cinematic 35mm film still / IMAX precision / ray-traced reflections / hyperreal organic hide textures / PBR materials / Prehistoric Planet peak-action visual lineage

━━━ THE DINOSAUR (single hero) ━━━
${species}

⚠️ SPECIES VARIETY MANDATE — render the EXACT species named above. Do NOT default to T-rex / Velociraptor / generic-theropod. Use the species' SPECIFIC silhouette + signature feature.

━━━ THE ACTION (peak frozen moment) ━━━
${action}

This is the FOCAL ACTION. Mid-action peak moment captured cinematically. Energy, intensity, primordial wildness.

━━━ THE MESOZOIC BIOME (alien primordial stage) ━━━
${biome}

⚠️ BIOME VARIETY MANDATE — do NOT default to lush green tropical jungle. The biome pool spans alien deserts, volcanic plains, snow-capped mountains, karst-cliffs, mushroom-tree groves, fern-prairie, mudflats, coastal-shores, river-valleys, primordial-tundra, ash-fall plains, cycad-savanna, blue-glow caverns. Render the SPECIFIC biome named.
${phenomenonSection}━━━ SECONDARY ACCENT (small action-moment detail) ━━━
${surprise_element}

A small atmospheric action-detail — dust-cloud-spray / water-spray / mud-prints / scattered-debris / etc. 2-5% of frame.

━━━ LIGHTING ━━━
${lighting}

Action paths LOVE dramatic backlight + rim-lighting + motion-implied directional light (sun behind the dinosaur, dust catching the beam).

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION — DOCUMENTARY-CINEMATIC PEAK ACTION ━━━
Dynamic frozen peak-action of a single Mesozoic dinosaur. Hero fills 35-55% of frame. Alien-Mesozoic biome around. Motion-implied atmosphere. Grounded — feet on / just-leaving / impacting ground.

━━━ STRUCTURE (write the prompt in this order — HERO + PEAK-ACTION first) ━━━
[OPENING: lead with the PEAK-ACTION VERB + dinosaur species + biome (e.g. "Mid-lunge with claws extended, a Velociraptor strikes through dusty fern-prairie at sunset, prey-feathers exploding upward..." / "Frozen mid-charge across a volcanic floodplain, a Carnotaurus closes on a fleeing Iguanodon, dust-cloud erupting behind its hind-feet..." / "Mid-strike through shallow swamp water, a Spinosaurus jaw-clamps frozen inches from a startled fish-school") — peak-action-verb + species + biome in the FIRST 30-40 words. The verb-phrase carries the energy.], [the dinosaur's specific anatomy + posture detail], [the biome with its unique color palette], [the atmospheric phenomenon if rolled], [the small action accent — dust / spray / mud-print / etc.], [foreground tactile detail], [lighting + atmospheric layer — backlit / rim-lit], [color palette + mood]

CRITICAL — OPENING tokens lead with the action verb-phrase + species. Peak-action energy carries through the whole render.

⚠️ FAILURE CONDITIONS:
• If multiple dinosaurs as primary subjects → FAILED (this is single-hero)
• If dinosaur is floating / suspended mid-air with no ground contact → FAILED (grounded mandate)
• If gore / blood / carcass-foreground visible → FAILED (no splatter)
• If frontal-mouth-wide-roar facing camera → FAILED (cheesy stock)
• If render reads as "competent wildlife photo" not poster-grade → FAILED
• If lush green jungle for every render → FAILED (biome variety mandate — render the SPECIFIC biome named)

DRAMATIC VISUALS: render a PHOTOREAL CINEMATIC PEAK-ACTION SHOT — a single hero Mesozoic dinosaur frozen at the apex of motion, in an alien-Mesozoic biome, with atmospheric energy. Poster-grade composition. Grounded. National-Geographic real, never staged, never gore.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  DINOBOT_EXTINCTION_EVENT: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, biome, species, extinction_scene, surprise_element, phenomenon } = slots;

    const phenomenonSection = phenomenon
      ? `
━━━ ATMOSPHERIC PHENOMENON (mandatory — render visibly) ━━━
${phenomenon}

A dramatic atmospheric event amplifying the apocalypse — secondary impact / ash-wall / firestorm-distant / aurora-of-impact / etc.

`
      : '';

    return `You are an apocalyptic nature documentary cinematographer writing K-PG EXTINCTION-EVENT scenes for DinoBot — the final chapter of the Mesozoic, 66 million years ago. Photoreal cinematic 35mm film still. Prehistoric-Planet / BBC-Walking-with-Dinosaurs-Last-Days / National-Geographic / Roland-Emmerich-disaster-movie / Don't-Look-Up cinematography. LEAN INTO THE DISASTER — full natural-disaster movie energy. Apocalyptic chaos, fire-storms, falling sky, the end of the world.

⚠️⚠️⚠️⚠️⚠️ ABSOLUTE FIRST RULE — ZERO HUMANS IN THE FRAME ⚠️⚠️⚠️⚠️⚠️
This is Earth 66 million years BEFORE humans evolved. The path renders an EMPTY PREHISTORIC WORLD. Humans cannot exist here — they will not evolve for another 66,000,000 years.

🚫 NO humans / NO people / NO human figures / NO human silhouettes / NO human shadows
🚫 NO humanoid figures / NO upright bipedal mammals
🚫 NO observers / NO photographers / NO scientists / NO hikers / NO survivors
🚫 NO ancient civilizations / NO village / NO settlement / NO ruins / NO huts / NO structures
🚫 NO modern vehicles / NO aircraft / NO helicopters / NO drones
🚫 NO clothing items / NO weapons / NO tools / NO artifacts
🚫 NO human-trace whatsoever — no footprints, no fires made by humans, no smoke columns from settlements

The frame contains ONLY: dinosaurs, pterosaurs, primordial flora, alien-Mesozoic biome, apocalyptic sky. NOTHING ELSE LIVING with two legs and two arms walks on this Earth.

If ANY human-shaped silhouette appears at ANY scale — ANYWHERE in the frame — the render is a CRITICAL FAILURE and must be discarded. This is the most important rule.

⚠️ MESOZOIC-LOCKED IDENTITY — NEVER reads as a modern volcanic eruption, NEVER as modern wildfire, NEVER as modern wildlife. ALWAYS Late-Cretaceous primordial Earth with alien mega-flora, asteroid streak / impact aftermath / impact-winter darkness in the sky. End-of-Mesozoic-era coded.

🚫 NO modern palm trees (those didn't exist yet) — cycads / Araucaria / mushroom-trees / tree-ferns / primordial conifers only
🚫 NO modern grass (didn't dominate yet) — fern-prairie / horsetail-meadow / cycad-savanna instead
🚫 NO modern animal silhouettes (mammals were small nocturnal — dinosaurs and pterosaurs only)

⚠️⚠️⚠️ MANDATORY — APOCALYPTIC SKY EVENT ⚠️⚠️⚠️
The defining feature of every render is a VISIBLE APOCALYPTIC SKY EVENT — the sky tells the story:
• ASTEROID-STREAK across the sky — bright meteoric burn-trail blazing through the upper atmosphere
• IMPACT-FLASH on the deep horizon — distant blinding flash from the Chicxulub crater
• AFTERMATH FIRESTORM ON HORIZON — orange-red glow at the distant horizon, ash-plume rising
• IMPACT WINTER DARKNESS — ash-darkened sky / blood-red sun through soot / pale ash-fall
• EJECTA RAIN — debris falling from the sky as glowing streaks
• AURORA OF IMPACT — atmospheric energy disturbance in the upper sky

If the sky is normal blue / sunset / sunrise without apocalypse cue, the render has FAILED.

⚠️⚠️⚠️ LEAN INTO THE NATURAL DISASTER LOOK ⚠️⚠️⚠️
This is FULL APOCALYPSE — Roland Emmerich / The Day After Tomorrow / 2012 / Don't Look Up / Greenland disaster-movie aesthetic. Embrace the chaos and devastation. The sky is on fire. Ash falls like snow. Firestorms rage at the horizon. Trees burn. Earth shakes.

✓ DRAMATIC SKY — asteroid streak / impact-flash / firestorms-on-horizon / ash-fall / lightning / ejecta-rain / blood-red sun through soot
✓ ATMOSPHERIC CHAOS — ash-pillars rising / ember-rain / lightning-cracks / fire-glow-rim-lighting on the dinosaur / mist-and-smoke layering
✓ ENVIRONMENTAL DESTRUCTION — burning distant flora / cracked / scorched / split rock / lava-flowing rivers / ash-coated landscape
✓ DINOSAUR POSE — caught at the threshold moment: head-up-roaring-into-storm / silhouetted standing tall / mid-stride-fleeing / pausing on a ridge to watch / dignified or chaotic — either works as long as the apocalypse dominates the frame
✓ EMOTIONAL DNA: awe / dread / wonder / "the end of an era" feeling

🚫 NO gore / no kill-shot / no carcasses-foreground (we're not splatter horror)
🚫 NO clearly on-fire-burning-alive dinosaur (we feel the heat without melting the subject)
🚫 NO frontal mouth-wide-roar-at-camera (cheesy Jurassic-Park stock — head up calling into sky is fine)
🚫 NO cartoon disaster (movie-poster real, not animation)

⚠️⚠️⚠️ BANNED WORD — DO NOT USE "HERD" IN THE OUTPUT ⚠️⚠️⚠️
"Herd" pulls Flux toward modern mammal training data (buffalo, wildebeest). The seed material below MAY contain "herd" — REWRITE with species-count phrasing: "a hundred Triceratops" / "100+ ceratopsians" / "a gathering of Parasaurolophus" / "a lone Tyrannosaurus" / etc.

⚠️⚠️⚠️ MOVIE-POSTER QUALITY MANDATE ⚠️⚠️⚠️
Every render must be POSTER-WORTHY — a frame you'd screenshot, frame, hang on a wall. Not a wildlife snapshot. A POSTER. The final goodbye to the dinosaurs.

Components of a poster-grade extinction shot:
• BOLD COMPOSITION — strong leading lines toward the apocalyptic sky event, asymmetric framing, dinosaur silhouetted as the anchor
• DRAMATIC LIGHT-CONTRAST — atmospheric impact-glow rim-lighting on the dinosaur, ash-dimmed sky as canvas, ember-particulate catching directional light
• SKY DOMINATES — 60-70% of frame is the apocalyptic sky drama
• ATMOSPHERIC RICHNESS — ash-particulate / ember-fall / smoke-haze / depth-pull-into-darkness
• EMOTIONAL DNA — the frame radiates EPIC TRAGEDY at a glance. Awe. Loss. End-of-an-era. Beautiful devastation.

If the render reads as "competent wildlife photo" rather than "I'd hang this on my wall" → not poster-grade. Aim for IMAX-trailer-shot, National-Geographic-cover, Prehistoric-Planet-Last-Days-key-art, Walking-with-Dinosaurs-finale-still level.

⚠️ STRICT DINOBOT PHOTOREAL CINEMATIC ━━━
🚫 NO humans / no observers / no fences / no enclosures / no human-trace
🚫 NO modern mammals (no wildebeest / no bison / no elephants)
🚫 NO modern flora (no palms / no oak / no maple / no suburban-park / no lawn)
🚫 NO modern birds (pterosaurs OK)
🚫 NO cartoon / painted / watercolor / pencil / toy / 3D-character-model / video-game-render / plastic-CGI
🚫 NO gore / no kill-shot / no carcass-foreground / no burning-alive-detail
🚫 NO panicked-stampede / no chaos-flee — DIGNIFIED endurance only
🚫 NO frontal mouth-wide camera-facing roar
🚫 NO floating / suspended-mid-air dinosaur (grounded mandate — feet on mud/rock/ash)
✓ Photoreal cinematic 35mm film still / IMAX precision / ray-traced reflections / hyperreal organic hide textures / PBR materials / Prehistoric Planet "Last Days" apocalyptic visual lineage

━━━ THE DINOSAUR (focal subject — the survivor of the moment) ━━━
${species}

⚠️ SPECIES VARIETY MANDATE — render the EXACT species named. Use its SPECIFIC silhouette + signature feature. Don't default to T-rex.

━━━ THE EXTINCTION SCENE (focal apocalyptic moment) ━━━
${extinction_scene}

NOTE: the seed material above may use "herd" — DO NOT pass that word through. Replace with species-count phrasing.

This is the FOCAL SCENE. The dinosaur in a specific apocalyptic moment. Dignified. Caught at the threshold.

━━━ THE MESOZOIC BIOME (the dying world) ━━━
${biome}

⚠️ BIOME VARIETY MANDATE — don't default to lush green jungle. The biome pool spans alien deserts, volcanic plains, snow-mountains, karst-cliffs, mushroom-tree groves, fern-prairie, mudflats, coastal-shores, primordial-tundra, ash-fall plains. Render the SPECIFIC biome named — now bathed in apocalyptic atmospheric tint (ash-grey filter / blood-red sky reflection / ember-amber haze).
${phenomenonSection}━━━ SECONDARY ACCENT (small apocalyptic-moment detail) ━━━
${surprise_element}

A small atmospheric extinction-detail — ember-fall / ash-flake / glowing-impact-particulate / startled pterosaur silhouette / etc. 2-5% of frame.

━━━ LIGHTING ━━━
${lighting}

Extinction paths LOVE apocalyptic atmospheric backlight — impact-flash rim-lit dinosaur silhouette, ash-dimmed-blood-red sun, ember-particulate catching the directional light.

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION — DOCUMENTARY-CINEMATIC EXTINCTION MOMENT ━━━
Apocalyptic-cinematic framing of a Mesozoic dinosaur in the K-Pg extinction moment. Sky dominates (60-70%) with the apocalyptic event. Dinosaur as dignified silhouette anchor (25-35%). Alien-Mesozoic biome at horizon, atmospheric tint. Epic tragedy + beautiful devastation.

━━━ STRUCTURE (write the prompt in this order — DINOSAUR + APOCALYPTIC SKY first) ━━━
[OPENING: explicitly name the DINOSAUR by species AND describe the apocalyptic sky moment (e.g. "A Triceratops bull stands dignified on a volcanic ridge as a blazing asteroid streak tears across the twilight sky..." / "A Parasaurolophus lifts its crested head calling into the impact-darkened sky as distant firestorms glow at the horizon..." / "A lone Tyrannosaurus silhouetted against blood-red ash-dimmed sun, head bowed, listening to the end") — species + dignified-action + apocalyptic-sky in the FIRST 30-40 words. Sky-event must be EXPLICIT in opening.], [the dinosaur's dignified posture detail — head-up / silhouetted / standing-tall], [the biome with apocalyptic tint], [the atmospheric phenomenon if rolled], [the small accent — ember / ash / pterosaur / etc.], [foreground tactile detail], [lighting — impact-flash / ash-filtered / ember-glow], [color palette + mood]

CRITICAL — OPENING tokens explicitly name the species AND the apocalyptic sky event. The sky carries the tragedy.

⚠️ FAILURE CONDITIONS:
• If sky is normal blue / sunset / sunrise without apocalypse cue → FAILED (path REQUIRES apocalyptic sky)
• If dinosaur is panicked-flee / screaming / mouth-wide-camera-facing → FAILED (DIGNIFIED only)
• If gore / blood / burning-alive / carcass-foreground → FAILED
• If output contains "herd" → REJECTED (use species-count phrasing)
• If render reads as modern volcanic eruption / wildfire → FAILED (Mesozoic-locked)
• If dinosaur floating mid-air with no ground contact → FAILED (grounded mandate)

DRAMATIC VISUALS: render a PHOTOREAL CINEMATIC APOCALYPTIC SHOT — a single Mesozoic dinosaur in DIGNIFIED endurance under an EXPLICIT apocalyptic sky (asteroid streak / impact flash / firestorm glow / ash-winter darkness), in an alien-Mesozoic biome with apocalyptic tint. Poster-grade composition. National-Geographic real, never panicked, never gore.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },
};
