/**
 * earthbot archetype templates — Sonnet brief composer functions.
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
  EARTHBOT_FOREST_INTERIOR: ({ slots, sharedDNA, vibeDirective }) => {
    const { subject, lighting, atmosphere, understory, phenomenon } = slots;
    const phenomenonBlock = phenomenon
      ? `\n\n━━━ ONE QUIET INTERIOR PHENOMENON (woven naturally — never forced) ━━━\n${phenomenon}\n\nIf it contradicts the rolled lighting (e.g. heavy sun-shafts need a gap in the canopy + haze; a rain-veil can't co-exist with hard dry sun-shafts), drop it and render the clean lit interior. Restrained truth wins.`
      : '';

    return `You are a professional nature photographer writing a SINGLE scene from INSIDE a forest for EarthBot. You are STANDING WITHIN the woods — surrounded by it, not looking at it from a distant overlook. The bar: a clean, true-to-life photograph of an old-growth forest (or rainforest) interior so lush and atmospheric a person stops scrolling — dappled light through the canopy, mist between the trunks, deep green receding into the haze. Real Earth at its most magnificent, always a believable photograph, never stylized or AI-fake. Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — INTERIOR FRAMING, NOT A WIDE VISTA ━━━

You are INSIDE the forest. The camera is among the trees. Frame it as an INTERIOR — one of: looking UP the trunk columns toward the bright canopy; looking INTO the understory at eye level; down a natural corridor between mossy trunks receding into mist; low from the fern-and-root forest floor up into the green. Intimate-to-mid scale. NEVER a wide-angle aerial overlook, NEVER a drone-above-the-canopy shot, NEVER a distant mountain/valley panorama, NEVER "the whole forest seen from across a valley." The trees SURROUND the frame. The sky is NOT the hero — at most a bright glimpse of it through a canopy gap. This is the single most important rule.

━━━ MULTI-TIER DEPTH — WITHIN the forest ━━━

Build depth from the inside out: FOREGROUND close detail (ferns, a mossy root buttress, fallen log, leaf litter, a wet stone in a creek) → MIDGROUND the trunk columns / understory hero → DEEP DISTANCE the forest receding into atmospheric green-grey mist. The depth comes from layers of trees fading into haze, NOT from a far horizon.

━━━ ZERO HUMANS — NEVER, UNDER ANY CIRCUMSTANCES ━━━

NEVER a human figure anywhere — not a hiker, not a tiny figure for scale, not a silhouette. Flux's forest/waterfall training data WILL try to insert a person on a trail; OVERRIDE it. Empty wilderness, no human presence.

━━━ ZERO HUMAN-BUILT FEATURES — NEVER, EVEN AS BACKGROUND ━━━

NEVER a cabin, hut, fence, cairn, stone steps, retaining wall, footbridge, boardwalk, deck, dock, gazebo, planted garden bed, or path. Flux's "scenic forest" training data is HEAVILY contaminated with park-photography that inserts stone steps, footbridges over creeks, and boardwalks through woods even unasked. OVERRIDE THAT BIAS HARD. Trigger-words to NEVER write (author natural-only): "stone steps" / "stone path" / "flagstone" / "masonry" / "retaining wall" / "ruins" / "moss-covered wall" / "footbridge" / "wooden bridge" / "boardwalk" / "stepping stones" / "garden" / "manicured" / "terraced" / "trail" / "path". Water-edge stones are NATURAL boulders / mossy basalt. A clearing entrance is a natural break in foliage, never a "trail." Raw forest. No civilization.

━━━ ABSOLUTELY BANNED (these break EarthBot identity instantly) ━━━

- NO bioluminescent fungi / glowworms / phosphorescent moss / glowing-anything
- NO arcane / magical / mystical / enchanted / ethereal / fairytale / otherworldly vocabulary
- NO time-suspension language ("frozen forever", "eternal", "suspended in time")
- NO floating-islands / impossible-physics / Pandora-style alien biome
- NO stylized / 3D-render / illustrated / cartoony aesthetic — clean, true-to-life photography only

━━━ THE FOREST INTERIOR (the location + its core character — you are standing inside it) ━━━
${subject}

Render this exact forest interior. It FILLS the frame — the trunks, the understory, the canopy above, the floor below all surround the viewer. This is the photo.

━━━ INTERIOR LIGHT (render the real best-light moment, filtered by the canopy) ━━━
${lighting}

Forest light is FILTERED light: dappled coins of sun on the floor, hard god-shafts lancing through a canopy gap into haze, soft diffuse overcast-green glow, backlit translucent leaves glowing, first warm light raking low through the trunks. It always has a clear physical source (sun through the canopy). Let it be lovely and true — never an artificial glow with no source.

━━━ ATMOSPHERE (render exactly as rolled — DO NOT override) ━━━
${atmosphere}

The atmosphere dictates what's in the air between the trunks. If it rolls "mist/fog," the god-shafts and depth-haze emerge naturally where light meets the particulate — render that. If it rolls "crisp clear," render clean air with sharp leaf detail and dappled light, NO forced volumetric beams. Never force beams onto clear air; never strip mist on a misty roll.

━━━ UNDERSTORY / CANOPY DETAIL (the richness that fills the interior) ━━━
${understory}

This is the LUSH packed detail that makes the interior feel alive and dense — render it woven through the scene at the right depth (foreground to midground), never as an isolated prop.${phenomenonBlock}

━━━ MOMENT IN MOTION — every render catches one beat of motion ━━━

Catch ONE second of physical motion the interior is producing RIGHT NOW: a shaft of light drifting as a cloud passes, mist breathing through the trunks, a leaf spiralling down, creek-water sliding over a mossy stone, canopy stirring in a breeze, spores/pollen drifting through a sun-shaft, fern fronds trembling. ONE beat, not five.

━━━ SCENE-WIDE PALETTE ━━━
${sharedDNA && sharedDNA.scenePalette ? sharedDNA.scenePalette : 'deep verdant greens, wet-bark browns, moss emerald, true-to-life and never artificial'}

━━━ SECONDARY COLOR VIBE ━━━
${sharedDNA && sharedDNA.colorPalette ? sharedDNA.colorPalette : ''}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ OUTPUT ━━━
Output ONLY the raw scene description as comma-separated descriptive phrases, ~55-90 words. Lead with the interior framing + the forest subject. NO preamble, NO titles, NO headers, NO ━━━ markers.`;
  },

  EARTHBOT_EPIC_VISTA: ({ slots, sharedDNA, vibeDirective }) => {
    const { subject, lighting, atmosphere, hero_feature, sky_layer, phenomenon } = slots;
    const phenomenonBlock = phenomenon
      ? `\n\n━━━ RARE OPTICAL / WEATHER PHENOMENON (one signature real-Earth event, woven naturally into the scene) ━━━\n${phenomenon}\n\nCRITICAL — PHENOMENON-LIGHTING COMPATIBILITY: If this phenomenon physically contradicts the rolled lighting time-of-day (e.g., total eclipse corona cannot co-exist with golden hour or daylight; aurora cannot appear in midday sun; green flash only happens at the exact moment the sunset disc disappears; sun pillars/sun-dogs/halos need the sun visible so can't appear at night), DROP THE PHENOMENON entirely from the render and just render the clean lighting + sky + scene. Restrained truth beats forced impossibility every single time.`
      : '';

    return `You are a professional landscape photographer writing a SINGLE EPIC VISTA scene for EarthBot. The work bar: a clean, striking real nature photograph — a genuinely magnificent landscape captured on the best possible day, with beautiful natural light and true geological scale. The kind of clear, true-to-life nature photo a person stops scrolling to look at. Real Earth at its most magnificent — earned through real geology + real light + real weather, always a believable photograph, never stylized or AI-fake. Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — REAL EARTH, NEVER SCI-FI, NEVER AI-FAKE ━━━

This is REAL geography, REAL weather, REAL light. Larger-than-life is fine — Earth genuinely produces alpenglow on Himalayan peaks, sun pillars in Arctic air, double rainbows across canyons, mammatus storm-cells lit by sunset, fjord cliffs plunging straight into the sea. But every render must look like something a photographer could have captured on the BEST possible day at that location. Never AI-fake. Never combinatorial impossibility. The viewer should think "this is real — but I've never seen a photo quite this magnificent."

━━━ ZERO HUMANS — NEVER, UNDER ANY CIRCUMSTANCES ━━━

NEVER a human figure anywhere in the frame. NOT wading in a pool, NOT silhouetted on a ridge, NOT standing at a vantage, NOT a hiker, NOT a climber, NOT a tiny figure for scale, NOT a photographer-self-portrait. Flux's training data WILL try to insert a figure into moody-pool / waterfall / forest / cliff-edge compositions because those are dominant stock-photo templates. OVERRIDE THAT BIAS. The scale prover in this scene is wildlife or geology, NEVER a person. If Flux's instinct is to render a person, render the same composition WITHOUT them. Empty wilderness. No civilization. No human presence anywhere.

━━━ ZERO HUMAN-BUILT FEATURES — NEVER, EVEN AS BACKGROUND DECORATION ━━━

NEVER render any human-built feature anywhere in the frame. NOT a cabin, NOT a hut, NOT a lighthouse, NOT a fence post, NOT a cairn (rock pile), NOT a stone retaining wall, NOT cut-stone steps, NOT a footbridge, NOT a wooden deck, NOT a gazebo, NOT a porch, NOT a paved or stone path, NOT a planted garden bed, NOT a fountain, NOT an artificial pond with masonry edge, NOT a dock, NOT a pier, NOT a railing, NOT a bench, NOT a road. Flux's "scenic" training data is HEAVILY contaminated with park-photography that inserts stone steps into pools, footbridges over streams, retaining walls in mossy gardens, ancient ruin-walls in jungle scenes — even when the prompt doesn't ask for them. OVERRIDE THAT BIAS HARD.

Words that trigger this Flux-bias (NEVER include in prose — author atmosphere natural-only):
- "stone steps" / "stone path" / "cobblestone" / "flagstone" / "masonry" / "retaining wall"
- "ruins" / "ancient temple" / "overgrown structure" / "moss-covered wall" / "abandoned cabin"
- "footbridge" / "wooden bridge" / "rope bridge" / "stepping stones" (Flux interprets as cut stones)
- "garden" / "planted bed" / "manicured" / "terraced" / "tended" / "cultivated"
- "dock" / "pier" / "boathouse" / "wharf"
- "deck" / "porch" / "gazebo" / "pavilion" / "viewing platform"
- "trail" / "path" — even nature trails get rendered as constructed footpaths

If the scene wants water-edge stones, render them as NATURAL boulders / mossy basalt / volcanic-rock outcrop — never as cut-stone steps. If the scene wants a clearing entrance, render as a natural break in foliage — never as a "trail" or "path." This is raw nature. No civilization. No human-built features anywhere.

━━━ ABSOLUTELY BANNED (these break EarthBot identity instantly) ━━━

- NO multi-moons / twin-suns / triple-moons (Earth has ONE of each)
- NO cloud-leviathans / whale-shaped clouds / dragon-shaped clouds / serpentine sky-creatures
- NO time-suspension language ("frozen forever", "suspended in time", "eternal")
- NO arcane / magical / mystical / enchanted / ethereal / supernatural / otherworldly vocabulary
- NO bioluminescent fungi / glowworms / phosphorescent moss / glowing-anything-landscape
- NO floating-islands / impossible-physics geometry / Pandora-style alien biomes
- NO galaxies "above sunset" — stars + sunset don't co-exist on Earth (Milky Way only over pure-night sky)
- NO stylized / 3D-render / illustrated / cartoony aesthetic — this is clean, true-to-life photography

━━━ SCENE-AS-HERO MANDATE — THE SUBJECT IS THE WOW ━━━

THE SCENE IS THE PHOTO. The vista subject DOMINATES the frame — fills 60-70%+ of the visual real estate. NO foreground prop pulled across the lower frame, NO secondary subject competing for the viewer's eye. Think clean professional landscape photography: the cliff face IS the photo, the wave barrel IS the photo, the canyon IS the photo, the volcano caldera IS the photo. The scene's real scale + real geology + beautiful natural light is the entire show. Restraint on additional compositional clutter is what lets the subject HIT.

━━━ GEOLOGY WOW FACTOR — LET THE REAL SCALE READ ━━━

The subject's geological character is the wow, and the wow is its REAL monumental scale — genuine vertigo, genuine height, genuine depth, the way these places actually feel when you stand in them. Convey the true scale clearly:

- VERTIGO-INDUCING — the cliff face plunges in a way that makes the viewer's stomach drop
- CATHEDRAL-VERTICAL — walls so steep they swallow scale
- MILE-DEEP / CONTINENT-SCALE / SKY-PIERCING — the size makes the viewer feel small
- The cliff's vertical drop into the valley, the caldera's mile-wide gape, the dune-sea's ridges receding to the vanishing point, the fjord wall's plunge to the water, the cresting wave's translucent barrel, the ice-cap's spread, the canyon's billion-year-strata depth.

The viewer's first reaction must be "look at the SIZE of that" — real Earth at genuine, awe-inspiring scale. Choose the most striking honest vantage for the rolled subject: wide-angle low-POV looking up at the wall, aerial looking down into the chasm, eye-level into the scene. Render the real scale clearly and beautifully, never exaggerated past what the place actually is.

━━━ THE VISTA SUBJECT (the location + its core geology — the hero of the frame, fills it) ━━━
${subject}

━━━ LIGHTING (render the real best-light moment) ━━━
${lighting}

━━━ NATURAL LIGHT — the real best-light moment ━━━

The lighting above stacks 2-3 light dimensions (time + direction + color + shadow). Render them the way real light behaves at the best moment of that day — the 90-second magic-window version: beautiful natural color, real directional warmth, true shadow depth, the way the scene would actually look through a camera at golden hour or first light. Light is what makes the photo, and it stays believable — real sun and real sky, lighting that always has a clear physical source. Let the light be lovely and true, every render — never artificial, never a glow with no source.

━━━ ATMOSPHERE (render exactly as rolled — DO NOT override) ━━━
${atmosphere}

The atmosphere rolled above dictates what's in the AIR. If it says "crisp clear," render crisp clear air with sharp distance — the beauty comes from the light alone, NO godrays or volumetric beams. If it says "valley fog" or "post-rain mist" or "sea spray," godrays and atmospheric beams emerge NATURALLY where light meets the particulate — render that emergence the way it really looks. The light is always lovely and true; the atmospheric quality (clear vs hazy vs misty vs spray-veiled) is dictated SOLELY by what this axis rolled. Never force volumetric beams onto clear-air rolls. Never strip atmosphere on particulate rolls.

━━━ SKY LAYER (what the sky is doing above the vista) ━━━
${sky_layer}

CRITICAL — SKY-LIGHTING COMPATIBILITY: If the sky rolled above describes a NIGHT-sky element (Milky Way / star field / clean star pinpoints / pre-dawn velvet w/ last stars / pure-night sky) AND the lighting axis rolled a DAYTIME, SUNSET, GOLDEN-HOUR, ALPENGLOW, MIDDAY, or STORM-BREAK condition (anything with the sun visible in the sky), DROP the night-sky elements. Stars and Milky Way ONLY appear in pure-night renders (post-twilight, no sun anywhere in the sky). Substitute a sky condition compatible with the rolled lighting — e.g., for sunset lighting, render the sunset sky gradient; for alpenglow, render the indigo-east-with-rose-west sky; for storm-break, render the cloud-tear with backlit clouds; for midday, render the bright cobalt zenith. STARS + SUNSET DO NOT CO-EXIST ON EARTH — render only the version compatible with the lit-sky moment. Restrained truth beats forced impossibility.

━━━ DISTANT SCALE PROVER (one TINY element in deep distance proving the subject's bigness — no foreground prop) ━━━

${hero_feature}

This is a SCALE PROVER ONLY — a marker-dot in the deep middle or far distance that gives the eye proof of the subject's monumental scale. Render it TINY (postage-stamp-sized, comma-speck, pinprick). It does NOT compete with the subject for visual attention. If it's a tree or boulder, it stays in the deep distance — never near-frame. If it's wildlife, it's a far-away silhouette. The subject is the hero; this is just the yardstick.${phenomenonBlock}

━━━ MOMENT IN MOTION — every render captures one beat of physical motion ━━━

Great landscape photographs catch a SECOND in time, not a frozen still. Every render must imply ONE specific physical motion the scene is producing RIGHT NOW: wind tearing the snow plume off a knife-edge ridge, fog pouring through the saddle, surf curl exploding at the base of the sea-stack, shelf cloud advancing across the horizon, aspen leaves shimmering in the breeze, spindrift catching the low light, waterfall mist breathing upward, banner cloud streaming from the summit, cornice on the verge of collapse, river braiding the silver delta, blowing sand racing across the dune crest, last leaves drifting from autumn aspens, a wave just curling, a glacier just calving, ground-blizzard sweeping across the plateau, dust-devil twisting across the desert floor. NOT new phenomena — physical motion the scene IMPLIES. ONE beat of motion, not five.

━━━ SCENE-WIDE PALETTE ━━━
${sharedDNA && sharedDNA.scenePalette ? sharedDNA.scenePalette : 'cinematic deeply-saturated color, true-to-life and never artificial, naturalistic Earth-pigment range'}

━━━ SECONDARY COLOR VIBE ━━━
${sharedDNA && sharedDNA.colorPalette ? sharedDNA.colorPalette : ''}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION — SUBJECT FILLS THE FRAME ━━━

Wide sweeping panoramic vista where the SUBJECT geology fills 60-70%+ of the frame's visual weight. Sky above (~25-35%), scale-prover as a tiny dot in deep distance, no near-foreground prop. The viewer's eye lands on the SUBJECT immediately, registers its scale, follows the natural light across it, finds the tiny scale-prover as evidence. Photographic, natural, alive — clean professional nature photography, a real photograph of Earth at its most magnificent.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
  },

  EARTHBOT_HAWAII_FLOWERS: ({ slots, sharedDNA, vibeDirective }) => {
    const { subject, flowers, lighting, atmosphere, hero_feature, sky_layer, phenomenon } = slots;
    const phenomenonBlock = phenomenon
      ? `\n\n━━━ RARE OPTICAL / WEATHER PHENOMENON (one signature real-Earth event, woven naturally into the scene) ━━━\n${phenomenon}\n\nCRITICAL — PHENOMENON-LIGHTING COMPATIBILITY: If this phenomenon physically contradicts the rolled lighting time-of-day (eclipse + daytime, aurora + midday, green flash needs exact sunset, sun-pillars need visible sun), DROP THE PHENOMENON entirely. Restrained truth beats forced impossibility.`
      : '';

    return `You are a Hawaiian / tropical-paradise photographer writing a SINGLE epic HAWAIIAN BEACH SCENE for EarthBot. The signature: a ground-level tropical beach with TROPICAL FLOWERS tastefully sprinkled through the scene, palms silhouetted at the inland fringe, calm tropical surf, and the wider tropical beach extending behind. The flowers ARE the tropical character; the beach IS the scene. Both are EQUALLY visible — 50/50 partnership. Hawaii / Costa Rica / Maldives / Bali / Tahiti / Polynesia / Caribbean. Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — REAL HAWAIIAN / TROPICAL BEACH, NEVER SCI-FI ━━━

This is REAL tropical beach geography. Real tropical flowers in real Hawaiian-style abundance. Never AI-fake. Never magical-glow. Never impossible combinations.

━━━ ZERO HUMANS — NEVER, UNDER ANY CIRCUMSTANCES ━━━

NEVER a human figure. NOT a sunbather, NOT a surfer, NOT a tiny silhouette walking the beach. Tropical-beach training data has heavy people-bias — OVERRIDE THAT BIAS HARD. Empty paradise, no human presence anywhere.

━━━ ZERO HUMAN-BUILT FEATURES — NEVER, EVEN AS BACKGROUND DECORATION ━━━

NEVER overwater bungalows, NEVER thatched huts, NEVER piers, NEVER docks, NEVER boardwalks, NEVER beach umbrellas, NEVER lounge chairs, NEVER tiki bars, NEVER cabanas, NEVER lighthouses, NEVER village lights. Tropical-paradise training data is HEAVILY contaminated with resort photography — OVERRIDE THAT BIAS HARD. Pure uninhabited natural tropical beach only.

━━━ ABSOLUTELY BANNED ━━━

- NO sci-fi / fantasy / magical / glowing-orbs / bioluminescent / multi-suns / floating-anything
- NO active volcanic eruption / NO lava plume
- NO cliffs as primary subject
- NO waterfalls or cascades
- NO jungle interiors as primary subject
- NO mountain peak as primary subject (small distant silhouette OK)
- NO "sun-disc" alone (renders as UFO orb)
- NO non-tropical (no alpine / no desert / no Norwegian fjord)
- NO stylized / 3D-render / cartoony — this is clean, true-to-life photography

━━━ COMPOSITION MANDATE — 50/50 BEACH + FLOWERS PARTNERSHIP ━━━

The viewer reads BOTH the beach and the flowers equally. The beach is the SCENE (~50% visual weight): sand crescent + palms + tropical surf + open horizon. The flowers are the TROPICAL CHARACTER (~50% visual weight): named-species accents distributed across the scene. Neither dominates.

━━━ TROPICAL FLOWERS (REINTERPRET — sprinkled THROUGH the scene, NOT clustered in foreground, NOT a wall) ━━━
${flowers}

CRITICAL REINTERPRETATION: The flower entry above lists 2-3 named tropical species — PRESERVE those species, but DISTRIBUTE them across the scene as TASTEFUL ACCENTS rather than clustering them in the foreground. The path identity is 50/50 PARTNERSHIP between the BEACH and the FLOWERS.

DISTRIBUTE the named species across the scene:
- One small cluster of one species at the INLAND PALM-LINE (not foreground-dominant)
- Scattered petals of another species drifting in the FOAM at the surf line
- A small accent cluster of a third species at the FAR EDGE of the beach or a small inland accent
- Optional: a few blossoms scattered on the wet sand at mid-frame
- Optional: one overhanging branch with a FEW visible blooms (not a heavy cluster) arching in lightly from frame-edge

NEVER one giant foreground cluster filling the lower frame (BloomBot wall). NEVER a flower-wall. NEVER "cascading carpet."

MANDATE SPECIES VARIETY per render — use 2-3 DIFFERENT named species from the entry distributed across the scene.

━━━ ABSOLUTE NON-NEGOTIABLE — FLOWERS MUST BE CLEARLY VISIBLE ━━━

Every render MUST show clearly visible tropical flowers. NOT "implied." NOT "subtle." VISIBLE BLOOMS — the kind a viewer instantly recognizes as flowers. The path is HAWAII-FLOWERS — if a viewer can't see the flowers, the render IS A FAILURE.

Every entry MUST include AT LEAST ONE of these high-visibility positions:
1. **Scattered fallen petals on the sand foreground** (e.g., "yellow plumeria petals scattered across the wet sand at the surf line")
2. **Blooms floating in the surf foam** (e.g., "scarlet hibiscus blooms drifting in the white surf-foam")
3. **An overhanging branch with several visible blooms** arching in from frame-edge
4. **A small but VISIBLE foreground cluster** (size: 15-20% of frame — small but readable)
5. **Bloom-fringed inland palm-line** with visible bloom mass at palm base

Pick AT LEAST ONE position. Named species MUST be readable. If a viewer at scroll-glance can't immediately spot flowers, the render FAILED.

━━━ THE TROPICAL BEACH SCENE (the setting, ~50% visual weight) ━━━
${subject}

━━━ LIGHTING (one clean signature light condition, often tropical-daylight) ━━━
${lighting}

━━━ ATMOSPHERE (default crisp clear tropical air; particulate only when scene-natural) ━━━
${atmosphere}

━━━ SKY LAYER (what the sky is doing above the tropical beach) ━━━
${sky_layer}

━━━ DISTANT SCALE PROVER (TINY element in deep distance, not competing with flowers/beach) ━━━

${hero_feature}

Render as TINY scale-prover (comma-speck, postage-stamp small) in the deep distance only.${phenomenonBlock}

━━━ MOMENT IN MOTION — every render captures one beat of physical motion ━━━

Catch a SECOND in time. One specific motion: gentle surf curling, palm fronds shifting in trade-wind breeze, a blossom-petal drifting on the surf-foam, sun-glare flare shimmering on the water, scattered petals on wet sand catching the light, a few seabirds gliding the distant sky.

━━━ SCENE-WIDE PALETTE ━━━
${sharedDNA && sharedDNA.scenePalette ? sharedDNA.scenePalette : 'saturated tropical color, true-to-life and never artificial, turquoise water + emerald palm + saturated flower-accent'}

━━━ SECONDARY COLOR VIBE ━━━
${sharedDNA && sharedDNA.colorPalette ? sharedDNA.colorPalette : ''}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION — 50/50 BEACH + FLOWERS PARTNERSHIP ━━━

Ground-level POV. The tropical beach extends across the midground (~50% visual weight). Tropical flowers distributed through the scene as visible named-species accents (~50% visual weight). Both equally readable, neither dominating. Clean, true-to-lifetropical-paradise photography.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
  },

  EARTHBOT_REEF_PARADISE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      bay_setting,
      shoreline_drama,
      water_quality,
      sky_drama,
      composition,
      foreground_element,
    } = slots;
    const foregroundBlock = foreground_element
      ? `\n\n━━━ FOREGROUND ELEMENT (one accent close to camera) ━━━\n${foreground_element}\n\nOne natural foreground accent close to camera that adds depth without dominating — palm fronds arching in, lava rocks at frame-edge, a hibiscus branch, a tiny silhouette far in the distance. Soft-focus / out-of-focus, never sharp competing detail.`
      : '';

    return `You are a travel photographer writing ONE PRETTY ISLAND-BAY scene for EarthBot. A dramatic tropical island bay viewed at WATERLINE level — crystal turquoise water in the foreground, dramatic shoreline rising above (volcanic ridges, palm-fringed cliffs, lush jungle slopes), sun-burst clouds in a tropical sky. Clean, professional travel-postcard caliber. Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — REAL TROPICAL ISLAND BAY, NEVER UNDERWATER REEF, NEVER SCI-FI ━━━

This is a SHORE-AND-WATER view, NOT an underwater reef shot. The hero is the BAY itself — the water surface + the dramatic shoreline above. NO underwater coral cathedrals. NO fish swimming. NO reef interiors. Real tropical bay geography only — generic morphological descriptions, NEVER named places.

━━━ ZERO HUMANS — NEVER, UNDER ANY CIRCUMSTANCES ━━━

NEVER a swimmer, NEVER a sunbather, NEVER a kayaker, NEVER a hiker, NEVER any human silhouette anywhere in the frame. Empty paradise.

━━━ ZERO HUMAN-BUILT FEATURES — NEVER, EVEN AS BACKGROUND DECORATION ━━━

NEVER boats, NEVER sailboats, NEVER yachts, NEVER overwater bungalows, NEVER thatched huts, NEVER docks, NEVER piers, NEVER any man-made structure. Pure uninhabited natural tropical bay.

━━━ ABSOLUTELY BANNED ━━━

- NO underwater coral garden as primary subject
- NO fish schools swimming through frame
- NO place names (no "Bora Bora" / "Hanauma" — describe morphologically)
- NO darkness / NO storm (always sunny tropical day)
- NO snow / NO alpine / NO desert — always TROPICAL
- NO stylized / 3D-render / cartoony — clean true-to-life photography

━━━ THE BAY SETTING ━━━
${bay_setting}

━━━ THE SHORELINE DRAMA ━━━
${shoreline_drama}

This is the visual HERO of the above-water portion.

━━━ THE WATER QUALITY ━━━
${water_quality}

━━━ THE SKY DRAMA ━━━
${sky_drama}

━━━ COMPOSITION ━━━
${composition}${foregroundBlock}

━━━ HARD RULE — PRETTY TROPICAL BAY, POSTCARD-WORTHY ━━━

This frame should make someone want to BOOK A FLIGHT. Clean, professional travel-photography caliber.

━━━ MOMENT IN MOTION ━━━

Catch a SECOND in time. Gentle ripples, sun-rays shafting through a cloud gap, palm fronds shifting in trade-wind breeze.

━━━ SCENE-WIDE PALETTE ━━━
${sharedDNA && sharedDNA.scenePalette ? sharedDNA.scenePalette : 'turquoise tropical bay water + dramatic shoreline + brilliant tropical sky'}

━━━ SECONDARY COLOR VIBE ━━━
${sharedDNA && sharedDNA.colorPalette ? sharedDNA.colorPalette : ''}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION DIRECTIVE ━━━

Water (or waterline) fills lower 40-50%. Shoreline + sky fill upper 50-60%. Naturalistic travel photography — generic descriptors only, the named place vocabulary stays out.

━━━ ⚠️⚠️⚠️ POSITIVE-ONLY OUTPUT MANDATE (CRITICAL) ⚠️⚠️⚠️ ━━━
Your output prompt must contain ZERO negation language: never write "no", "not", "without", "never", "absent", "lacking", or any "no X / not Y" / "zero X / zero Y" construction. The bans above are for YOUR understanding ONLY — do not pass them through to your output. CLIP/T5 ignores "no" / "not" / "zero" and attends to the negated noun, so writing "no humans / zero structures" actually renders humans and structures. A 2026-06-02 hearted render of this path came back as a cliffside HOTEL precisely because Sonnet wrote "zero structures" at the end and Flux rendered a structure. Describe what IS in the scene — the volcanic shoreline, the turquoise bay, the trade-wind breeze, the cumulus over headlands. Never describe what isn't.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. Just the positive-only scene content, opened with the tropical bay subject.`;
  },

  EARTHBOT_GEOLOGICAL_WONDER: ({ slots, sharedDNA, vibeDirective }) => {
    const { subject, lighting, atmosphere, mineral_color, focal_anchor, phenomenon } = slots;
    const phenomenonBlock = phenomenon
      ? `\n\n━━━ RARE PHENOMENON (one signature optical/weather event) ━━━\n${phenomenon}\n\nIf this phenomenon physically contradicts the rolled lighting or subject, DROP IT.`
      : '';

    return `You are a geological photographer writing ONE GEOLOGICAL WONDER scene for EarthBot. Earth's raw architecture as art — covers BOTH scales: INTIMATE cave interiors (crystal caves with amethyst walls / lava tubes / glacier ice caves / slot canyons with light beams / amethyst geode cathedrals) AND EPIC outdoor vistas (hoodoo amphitheaters / salt flats / basalt cliff coastlines / sandstone wave formations / travertine terraces / fresh lava flows / geyser fields). The geology itself is genuinely spectacular. Clean, professional geological photography with rich natural mineral color and atmospheric depth. Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — REAL EARTH GEOLOGY, NEVER SCI-FI / FANTASY ━━━

This is REAL Earth's raw architecture. The geology is REAL minerals + REAL processes — amethyst is real, malachite is real, travertine is real, basalt columns are real. NEVER alien planets. NEVER glowing-fantasy gemstones with impossible colors. NEVER floating rocks. NEVER multi-moon skies. NEVER mythological caves with portals.

━━━ ZERO HUMANS — NEVER, UNDER ANY CIRCUMSTANCES ━━━

NEVER a person, NEVER a silhouette, NEVER a hiker, NEVER a caver, NEVER a climber, NEVER a tiny figure for scale. Geological photographers DO include human figures for scale, but our render NEVER does. Empty geology only.

━━━ ZERO HUMAN-BUILT FEATURES — NEVER, EVEN AS BACKGROUND DECORATION ━━━

NEVER railings, NEVER walkways, NEVER stairs, NEVER bridges, NEVER cabins, NEVER fences, NEVER buildings, NEVER lampposts, NEVER tents, NEVER vehicles, NEVER signs. Pure uninhabited natural geology only.

━━━ ABSOLUTELY BANNED ━━━

- NO sci-fi / fantasy / magical-glow / portal-cave / multi-moons / sky-galaxies
- NO impossible gemstone colors that don't exist
- NO tourist landmark names (describe morphologically)
- NO stylized / 3D-render / cartoony — this is clean, true-to-life photography
- NO floating rocks, NO levitating boulders

━━━ THE GEOLOGICAL SUBJECT (the formation itself — intimate or epic scale) ━━━
${subject}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERE ━━━
${atmosphere}

━━━ MINERAL COLOR DRAMA ━━━
${mineral_color}

━━━ FOCAL ANCHOR ━━━
${focal_anchor}

ONE specific element gives the frame a focal anchor + scale-prover.${phenomenonBlock}

━━━ HARD RULE — BEAUTIFUL TRUE-TO-LIFE GEOLOGY ━━━

This frame must be a clean, true-to-life photograph with beautiful natural mineral light.

━━━ MOMENT IN MOTION ━━━

Catch a SECOND in time. Mist swirling through a cave, steam billowing from a geyser, water trickling down travertine, a single icicle drip falling.

━━━ SCENE-WIDE PALETTE ━━━
${sharedDNA && sharedDNA.scenePalette ? sharedDNA.scenePalette : 'saturated mineral color, dramatic light, atmospheric depth, focal anchor for scale'}

━━━ SECONDARY COLOR VIBE ━━━
${sharedDNA && sharedDNA.colorPalette ? sharedDNA.colorPalette : ''}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION DIRECTIVE ━━━

The geological subject dominates 60-70% of the frame. Clean, true-to-lifegeological-photography caliber.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO named places.`;
  },

  EARTHBOT_SACRED_LIGHT: ({ slots, sharedDNA, vibeDirective }) => {
    const { subject, lighting, atmosphere, hero_feature, sky_layer, phenomenon } = slots;
    const phenomenonBlock = phenomenon
      ? `\n\n━━━ RARE PHENOMENON (one signature optical/weather event woven naturally) ━━━\n${phenomenon}\n\nIf this phenomenon physically contradicts the rolled lighting or subject, DROP IT.`
      : '';

    return `You are a fine-art landscape photographer writing ONE SACRED-LIGHT MOMENT scene for EarthBot. Transcendent natural-light moments in nature — the LIGHT itself is the hero. Dawn first-light burning a single ridge while valleys remain in cool shadow, raking shafts plural through old-growth canopy, alpenglow on a snow-capped peak, storm-break broad spotlight across a meadow, crepuscular rays through cypress over a misty lake, sun-halo over winter forest. Mid to tight framing — NOT wide panorama. The light moment fills the emotional center; the landscape supports it. Clean, professional sacred-light photography — natural-light moments as the hero. Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — REAL NATURAL LIGHT, NEVER SCI-FI / FANTASY ━━━

This is REAL Earth light — alpenglow on a real peak, golden-hour raking through a real forest, storm-break sun blasting through real clouds, sun-halo from real ice-crystal refraction. NEVER alien planet light, NEVER bioluminescent glow, NEVER phosphorescent fungi, NEVER glowing portals, NEVER magical-fantasy luminescence. Real Earth, real light, real sky.

━━━ ZERO HUMANS — NEVER, UNDER ANY CIRCUMSTANCES ━━━

NEVER a person, NEVER a silhouette, NEVER a hiker, NEVER a tiny figure for scale. Empty wilderness, light alone.

━━━ ZERO HUMAN-BUILT FEATURES — NEVER, EVEN AS BACKGROUND DECORATION ━━━

NEVER ruins, NEVER cathedrals, NEVER chapels, NEVER monasteries, NEVER abbeys, NEVER altars, NEVER stained glass, NEVER lighthouses, NEVER any architecture. Sacred-light traditionally evokes religious-architecture imagery in training data — OVERRIDE THAT BIAS HARD. Pure natural-light moments in nature only. NEVER railings / walkways / bridges / cabins / fences / buildings / lampposts / vehicles / signs.

━━━ ABSOLUTELY BANNED OUTPUT WORDS ━━━

The path identity demands real-natural-light language. NEVER write:
- "bioluminescent" / "luminescent" / "luminescence" / "phosphorescent"
- "glowing" (when describing rock/water/mineral — they REFLECT light, never glow)
- "single beam" / "single shaft" / "single column of light" (Flux laser-beam trigger — use "shafts plural" or "broad spotlight")
- "cathedral" / "chapel" / "altar" / "ruins" / "monastery" (architecture)
- "stained glass" / "lighthouse beam"
- "firefly pillar" / "vertical column of fireflies" (alien-coded)
- "portal" / "doorway" / "mystical" / "ethereal" / "otherworldly" / "magical"
- "fluorescent" anything
- "lit from within" / "radiating" / "pulsing"

USE INSTEAD: "shafts plural fanning", "broad spotlight breaking through", "raking sidelight", "warm crown of light", "alpenglow rim", "golden-hour saturation", "soft scattered illumination".

━━━ THE SACRED-LIGHT SUBJECT (the where + what — natural setting primed for light drama) ━━━
${subject}

━━━ THE LIGHTING (the SPECIFIC sacred-light event — this is the hero) ━━━
${lighting}

Light is the EMOTIONAL CENTER. Render the named lighting LITERALLY — alpenglow IS rose-pink-to-magenta on snow, golden-hour raking IS warm copper-amber sidelight, crepuscular rays IS multiple shafts plural fanning through cloud-gap, dawn first-light IS warm rose-gold on the highest crown.

━━━ ATMOSPHERE (the medium that makes the light visible) ━━━
${atmosphere}

Dust-beams catching the light, otherwise crisp clear air. The atmosphere makes the light visible — without it, light is invisible.

━━━ HERO FEATURE (deep distance scale-prover, never competing with the light) ━━━
${hero_feature}

A small element in the deep distance providing depth + scale-prover. Render small (comma-speck / postage-stamp scale) — the LIGHT is the hero, not this.

━━━ SKY LAYER (what the sky is doing above) ━━━
${sky_layer}${phenomenonBlock}

━━━ HARD RULE — LIGHT IS THE EMOTIONAL CENTER ━━━

The viewer's eye lands on the LIGHT first. The landscape provides the stage; the light provides the drama. Mid to tight framing (NOT wide panorama). Surrounding shadow / cool tones / shaded landscape contrasts with the bright light moment. A held-breath, quietly miraculous moment.

━━━ MOMENT IN MOTION — every render captures one beat of physical motion ━━━

Catch a SECOND in time. Dust beams shifting in raking light, drifting mist swirling through shafts, scattered pollen suspended mid-air in golden light, a single petal floating mid-fall through a light-shaft, snow-dust glittering in alpenglow, sun-halo ring catching ice-crystals in upper air.

━━━ SCENE-WIDE PALETTE ━━━
${sharedDNA && sharedDNA.scenePalette ? sharedDNA.scenePalette : 'sacred-light register — warm golden / rose-pink alpenglow / amber raking / cool shadow contrast'}

━━━ SECONDARY COLOR VIBE ━━━
${sharedDNA && sharedDNA.colorPalette ? sharedDNA.colorPalette : ''}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION DIRECTIVE — LIGHT-AS-HERO ━━━

The light moment fills the emotional center of the frame. Mid to tight framing — NOT wide panorama. Surrounding landscape sits in cool shadow / cool tones, the lit area glows with warm contrasting saturation. Clean, true-to-lifesacred-light fine-art.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO named places.`;
  },

  EARTHBOT_BEACH_NIGHT: ({ slots, sharedDNA, vibeDirective }) => {
    const { subject, light_source, night_sky, water_state, shoreline_element, phenomenon } = slots;
    const phenomenonBlock = phenomenon
      ? `\n\n━━━ RARE PHENOMENON (one signature night-sky event) ━━━\n${phenomenon}\n\nIf this phenomenon physically contradicts the rolled light_source (moonbow needs moisture, etc), DROP IT.`
      : '';

    return `You are a night-sky photographer writing ONE TROPICAL BEACH NIGHT scene for EarthBot. Magical warm tropical beach scenes at night — moonlit water, silver Milky Way overhead, calm reflective tropical surf, palm silhouettes. The NATURAL light source (moon / stars / Milky Way) is the hero. Awe-inspiring, warm, intimate — NEVER cold ominous night. Clean, professional tropical-night photography with moon/star light as hero. Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — REAL TROPICAL BEACH AT NIGHT, NEVER SCI-FI ━━━

This is REAL tropical-beach geography at REAL Earth night. Natural light only — moonlight, starlight, Milky Way. NEVER alien glow. NEVER bioluminescent waves. NEVER glowing-fantasy.

━━━ ZERO HUMANS — NEVER, UNDER ANY CIRCUMSTANCES ━━━

NEVER a person, NEVER a silhouette, NEVER a hiker, NEVER a swimmer, NEVER any human figure anywhere in the frame.

━━━ ZERO HUMAN-BUILT FEATURES — NEVER, EVEN AS BACKGROUND DECORATION ━━━

NEVER tiki torches, NEVER lanterns, NEVER paper lanterns, NEVER hurricane lanterns, NEVER lighthouse beams, NEVER bonfires, NEVER fire pits, NEVER dock posts, NEVER piers, NEVER boardwalks, NEVER tiki bars, NEVER overwater bungalows, NEVER thatched huts, NEVER ANY man-made object. The legacy beach-night relied on tiki/lantern/bonfire light — OVERRIDE THAT BIAS. Pure NATURAL night beach.

━━━ ABSOLUTELY BANNED ━━━

- NO bioluminescent / phosphorescent / luminescent / glowing waves / electric-blue surf (sci-fi trigger)
- NO tiki torches / lanterns / paper lights / dock lights / bonfires / fire pits (human-built)
- NO architecture / overwater bungalows / huts / docks / piers
- NO sci-fi / fantasy / magical glow / portal moon / alien stars
- NO sun / sunset / sunrise / daylight (it is fully NIGHT)
- NO single column / single beam / single shaft (use natural diffuse light)
- NO place names
- NO darkness-without-light (Milky Way / moon / stars MUST be the light source)
- NO stylized / 3D-render / cartoony — clean true-to-life photography

━━━ THE TROPICAL BEACH NIGHT SETTING ━━━
${subject}

━━━ THE NATURAL LIGHT SOURCE (the hero — moon / starlight / Milky Way) ━━━
${light_source}

Render the named light source LITERALLY. Moonlight is silver-white. Starlight is faint cool. Milky Way is a dense band of stars across the sky. The light is the HERO.

━━━ THE NIGHT SKY ━━━
${night_sky}

━━━ THE WATER STATE (calm, reflective, night) ━━━
${water_state}

The tropical water is calm + reflective. Night water reflects the moon, stars, sky. Subtle silver / cool reflections, NOT sci-fi glow.

━━━ THE SHORELINE ELEMENT (natural foreground — palms / rocks / driftwood) ━━━
${shoreline_element}

ONE natural foreground element. Palm silhouettes against the night sky, weathered driftwood on sand, smooth lava rocks at the surf line, calm sand patterns — natural shore details only.${phenomenonBlock}

━━━ HARD RULE — WARM TROPICAL NIGHT, NEVER COLD OMINOUS ━━━

This is a MAGICAL warm tropical night — the kind of beach scene that feels like vacation paradise after dark. NOT a horror beach. NOT a stormy beach. NOT a cold beach. The warmth of trade-winds, the calm of tropical surf, the awe of a Milky Way overhead. Clean, professional travel-photography at night caliber.

━━━ MOMENT IN MOTION — every render captures one beat of physical motion ━━━

Catch a SECOND in time. Gentle surf rippling at the foreground sand, palm fronds shifting in trade-wind breeze, a thin band of silver light on the water surface, a faint shimmer in the wet sand from moonlight, a single small wave breaking softly.

━━━ SCENE-WIDE PALETTE ━━━
${sharedDNA && sharedDNA.scenePalette ? sharedDNA.scenePalette : 'silver moonlit tropical night, cool blue + silver tones, warm tropical mood'}

━━━ SECONDARY COLOR VIBE ━━━
${sharedDNA && sharedDNA.colorPalette ? sharedDNA.colorPalette : ''}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION DIRECTIVE — TROPICAL BEACH NIGHT POSTCARD ━━━

Mid to tight framing. The light source (moon, stars, or Milky Way) fills the upper third / half. The tropical beach extends below. Reflective water carries the light source. Clean, true-to-lifetropical-night travel photography.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO named places.`;
  },

  EARTHBOT_WAVES: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      wave_subject,
      composition,
      coastal_context,
      water_color,
      sky_layer,
      light_condition,
      phenomenon,
    } = slots;
    const phenomenonBlock = phenomenon
      ? `\n\n━━━ RARE PHENOMENON (one signature optical event woven naturally) ━━━\n${phenomenon}\n\nIf this phenomenon physically contradicts the rolled lighting or subject, DROP IT.`
      : '';

    return `You are an ocean photographer writing ONE WAVE scene for EarthBot. Real ocean wave drama — Clark-Little intimate translucent-barrel through monumental big-wave breaking on tropical reef. The wave IS the hero. Real ocean physics: waves come from the open ocean and break TOWARD shore on shallow reefs, cliffs, points — never walls of water sitting on flat sand. Tropical paradise setting. Clean, professional surf-photography caliber. Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — REAL OCEAN PHYSICS, NEVER FANTASY ━━━

This is REAL Earth ocean. Waves break where the bottom shallows abruptly — on coral reefs, against volcanic cliffs, over rocky points. NEVER 50-foot walls on flat sand. NEVER a "wave from inland." NEVER tsunamis. NEVER fantasy water-physics. Real swell rolling in from horizon, cresting on reef, exploding white on rock.

━━━ ZERO HUMANS — NEVER, UNDER ANY CIRCUMSTANCES ━━━

NEVER a surfer, NEVER a swimmer, NEVER a kayaker, NEVER a photographer-figure, NEVER any human silhouette in the frame. Surf photography training data is HEAVILY contaminated with surfer-in-barrel shots — OVERRIDE THAT BIAS HARD. The wave is the subject; no one rides it.

━━━ ZERO HUMAN-BUILT FEATURES — NEVER, EVEN AS BACKGROUND DECORATION ━━━

NEVER piers, NEVER docks, NEVER lighthouses, NEVER beach umbrellas, NEVER cabanas, NEVER huts, NEVER overwater bungalows, NEVER tiki bars, NEVER buildings, NEVER railings. Pure natural tropical coast only.

━━━ ABSOLUTELY BANNED ━━━

- NO surfers / surfboards / boards / fins / wetsuits / surfers-in-barrel (zero humans, zero surf gear)
- NO bioluminescent / phosphorescent / glowing waves (sci-fi trigger)
- NO sci-fi / fantasy tube interiors / magical water
- NO named places (no "Pipeline" / "Teahupoʻo" / "Jaws Maui" / "Mavericks" — describe morphologically: "shallow coral reef break" / "deep-water reef break" / "volcanic cliff break")
- NO architecture / piers / lighthouses / huts / buildings
- NO single beam / single shaft / single column of light (Flux laser-beam trigger — use "shafts plural fanning" / "broad spotlight")
- NO impossible-physics walls-of-water on flat sand
- NO tsunami / NO incoming-wall-of-water from horizon (waves break ON something, not as standalone walls)
- NO whales / dolphins / fish in wave (subject is the wave, not wildlife)
- NO stylized / 3D-render / cartoony — clean true-to-life photography

━━━ THE WAVE SUBJECT (THE hero — intimate-barrel or monumental big-wave) ━━━
${wave_subject}

CRITICAL — render the named wave LITERALLY. Translucent emerald barrel IS hollow tube with spray off the lip. Massive wall is a 40-60 foot face breaking on the reef. Real ocean physics, real water motion, captured at the peak instant.

━━━ COMPOSITION / CAMERA FRAMING (THIS DRIVES THE WHOLE SHOT) ━━━
${composition}

CRITICAL — the composition axis dictates the WHOLE camera angle and framing. Render the composition LITERALLY. Side-view-of-barrel = profile shot from beach/cliff side. Pulled-out-wide = aerial-low or distant shot showing wave + following sets in deep ocean. Aerial-overhead = drone-style top-down shot of the breaking wave. Panned-out-island-context = wave foreground with tropical-island landscape silhouetted in the deep background. The framing is the most-important variety lever. NEVER inside-barrel-POV (Flux renders as water tunnels, not real wave barrels).

━━━ COASTAL CONTEXT (what the wave breaks ON / against) ━━━
${coastal_context}

The coastal context EXPLAINS the wave physics. Shallow coral reef = barrel-tube formation. Volcanic cliff = explosive spray. Rocky point = wrapping break. Sand-bar = clean shoulder peel. The context anchors the wave to real-Earth geography.

━━━ WATER COLOR / QUALITY (the specific water signature) ━━━
${water_color}

Translucent emerald, cobalt-deep, sapphire saturation, churning-white-foam, jade-tube-water, gold-glint, midnight-cobalt. Real ocean colors only — no fantasy hues.

━━━ SKY LAYER (what's happening above the wave) ━━━
${sky_layer}

━━━ LIGHT CONDITION ━━━
${light_condition}${phenomenonBlock}

━━━ HARD RULE — WAVE IS THE HERO, PHYSICS IS REAL ━━━

The wave fills 50-70% of the frame. Coastal context + water color + sky support the wave drama. Real ocean physics throughout — waves coming from open ocean, breaking on shallow obstacles, spray and foam realistic. Clean, professional surf-photography caliber.

━━━ MOMENT IN MOTION — every render captures one beat of physical motion ━━━

Catch a SECOND in time. Spray rocketing off the wave's lip mid-explosion, water curling mid-barrel-formation, foam churning at the reef-break, a single droplet caught mid-flight, the wave at the precise peak of crest before collapse.

━━━ SCENE-WIDE PALETTE ━━━
${sharedDNA && sharedDNA.scenePalette ? sharedDNA.scenePalette : 'real-ocean wave color, tropical paradise context, dramatic spray + light interaction'}

━━━ SECONDARY COLOR VIBE ━━━
${sharedDNA && sharedDNA.colorPalette ? sharedDNA.colorPalette : ''}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION DIRECTIVE — SURF PHOTOGRAPHY POSTCARD ━━━

The wave fills 50-70% of the frame. Coastal context + tropical setting fill the surrounding 30-50%. Sky drama above. Clean, true-to-lifesurf photography caliber.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO named places.`;
  },

  EARTHBOT_SEASONAL_SHIFT: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      subject,
      color_palette,
      depth_layers,
      seasonal_motion,
      lighting,
      atmosphere,
      hero_feature,
      sky_layer,
      phenomenon,
    } = slots;
    const phenomenonBlock = phenomenon
      ? `\n\n━━━ RARE PHENOMENON (one signature optical event) ━━━\n${phenomenon}\n\nIf this phenomenon physically contradicts the rolled season or lighting, DROP IT.`
      : '';

    return `You are a fine-art nature photographer writing ONE SEASONAL-SHIFT scene for EarthBot. Real-Earth landscape captured at the peak dramatic moment of a season — wall-to-wall multi-color autumn density across mixed forests, first snow with lingering color on alpine valleys, cherry-blossom + wildflower spring superbloom richness, golden summer evenings. THE SEASON IS THE SUBJECT, MULTI-COLOR RICHNESS is mandatory, and DENSITY IS PEAK — every branch, every meadow, every slope packed with peak color edge-to-edge. Clean, true-to-life seasonal nature photography — a beautiful real photograph of the landscape at its richest moment. Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — REAL EARTH SEASONAL DRAMA, NEVER SCI-FI / FANTASY ━━━

This is REAL Earth at the peak dramatic moment of a season. Mixed multi-color forests (NOT mono-toned). Generic morphological descriptors only — NO named places (no "Colorado" / "Vermont" / "Kyoto" — describe morphologically).

━━━ ZERO HUMANS / ZERO HUMAN-BUILT FEATURES ━━━

NEVER a person, NEVER a hiker, NEVER cabins, NEVER fences, NEVER cars, NEVER roads, NEVER footpaths, NEVER stone-steps, NEVER any constructed element. Pure raw nature only.

━━━ ABSOLUTELY BANNED ━━━

- NO bioluminescent / phosphorescent / foxfire (sci-fi triggers, legacy had these)
- NO named places
- NO single beam / single shaft / single column of light (laser-beam trigger — use "shafts plural fanning")
- NO sci-fi / fantasy / portal / mystical
- NO architecture / stone-steps / garden-paths / cabin
- NO humans
- NO stylized / 3D-render / cartoony — clean true-to-life photography
- NO mono-color scenes (the color_palette axis MANDATES multi-color variety — render ALL the named colors)

━━━ THE SEASONAL SUBJECT (the landscape composition at peak seasonal drama) ━━━
${subject}

━━━ COLOR PALETTE (multi-color seasonal saturation — RENDER ALL OF THESE) ━━━
${color_palette}

⚠️ ABSOLUTE NON-NEGOTIABLE — MULTI-COLOR MANDATE ⚠️

This is the SINGLE most important axis for this path. The named multi-color palette MUST visibly land in the rendered painting — ALL 3-5 contrasting colors VISIBLE in distinct portions of the scene.

If the palette names "yellow birch + scarlet maple + crimson oak + lingering hemlock green + violet aster" → the render MUST show all five: yellow birch sections + scarlet maple sections + crimson oak sections + lingering green spruce sections + violet aster blooms. NEVER let one color dominate. NEVER mono-tone.

YOUR OUTPUT PROMPT MUST EXPLICITLY ENUMERATE EACH NAMED COLOR in distinct phrases. Example: "patches of yellow birch foliage across the left slope, scarlet maple groves dominating the midground, crimson oak clusters on the right ridge, lingering emerald hemlock among the bare trunks, scattered violet aster blooms in the understory." — NEVER collapse them into "fall colors."

If the rendered scene is mono-toned (all-red, all-pink, all-white), the render FAILED the path identity.

━━━ DEPTH LAYERS (foreground / midground / distant — multi-tier composition) ━━━
${depth_layers}

Render the named depth layers LITERALLY — foreground element + midground element + distant element. Multi-tier depth is required for 10/10 frames.

━━━ SEASONAL MOTION (the moment-in-motion accent — catch a second in time) ━━━
${seasonal_motion}

The frame is a captured moment — leaves spinning in a breeze, blossoms drifting, snow-dust glittering, wildflower petals rippling. Render the named motion LITERALLY.

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERE ━━━
${atmosphere}

━━━ HERO FEATURE (deep distance scale-prover, never competing) ━━━
${hero_feature}

Render small (postage-stamp / comma-speck scale) — the SEASONAL DRAMA is the hero, not this.

━━━ SKY LAYER ━━━
${sky_layer}${phenomenonBlock}

━━━ HARD RULE — THE SEASON IS THE EMOTIONAL CENTER, MULTI-COLOR RICHNESS MANDATORY ━━━

The viewer should feel the season in their bones. ALL named colors from the color_palette must be visible in the render — NEVER mono-tone. Multi-tier depth (FG/MG/distant) per the depth_layers axis. One captured moment per the seasonal_motion axis. Clean, professional seasonal photography with peak-color density and multi-tier depth.

━━━ SCENE-WIDE PALETTE ━━━
${sharedDNA && sharedDNA.scenePalette ? sharedDNA.scenePalette : 'peak-saturation seasonal multi-color, dramatic light, atmospheric depth'}

━━━ SECONDARY COLOR VIBE ━━━
${sharedDNA && sharedDNA.colorPalette ? sharedDNA.colorPalette : ''}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ TOWERING TREES / NAMED SPECIES MANDATE ━━━

⚠️ The autumn rendered scene must show ACTUAL DECIDUOUS FOREST — towering / mature trees with visible trunks rising into the canopy, NOT orange shrubs on rocks, NOT scrub on cliffs. Use phrases like: "towering mixed deciduous canopy", "mature sugar-maple + scarlet-oak + yellow-birch + paperbark-birch trunks rising", "tall trunks anchoring the midground", "dense mature canopy".

⚠️ NAME SPECIFIC TREE / FLOWER SPECIES — never generic "mixed forest" alone. Autumn output must name 3-5 species visible as distinct groves: e.g. "golden-yellow paperbark birch sections + scarlet sugar-maple groves + crimson red-oak clusters + amber quaking-aspen stands + lingering dark hemlock columns". Spring output must name 3-5 species: e.g. "pink cherry-blossom canopy + white flowering-dogwood + magenta redbud + cream magnolia + understory of trillium + Virginia bluebell + dame's-rocket".

━━━ DENSITY MANDATE — PEAK SEASONAL FULLNESS ━━━

⚠️ DENSITY IS THE PATH'S SIGNATURE. NO sparse / open / scattered / minimal / patchy / empty / negative-space language. Use density-positive phrasing: "packed wall-to-wall", "every branch carrying peak color", "edge-to-edge", "no gaps in the canopy", "carpet-thick", "shoulder-to-shoulder bloom", "saturated mass", "dense unbroken canopy", "drenched in color".

⚠️ BANNED WORD — "fire" as a NOUN (renders literal flames on mountainsides). Forbidden: "on fire", "fall fire", "peak fire", "fire color", "fire-mosaic", "fire-blanket", "trees on fire". Use SAFE high-energy alternatives: "peak color saturation", "drenched in color", "blazing color" (adj OK), "saturated peak foliage", "color explosion", "ABLAZE with color" (adj OK), "riot of color".

⚠️ BANNED — orange-shrubs-on-rocks rendering. Never use "low shrubs" / "scrub" / "low autumn vegetation" / "rocky cliffs as dominant frame element" / "canyon walls" as the dominant frame. The frame is FOREST-dominant.

━━━ NATURAL LIGHT — BEAUTIFUL, NOT FLAT ━━━

Every render wants real directional light, not flat grey overcast. Aim for:

• DIRECTIONAL LIGHT — low-angle golden-hour or sunset light raking across the trunks and leaf-mass, real soft shadows beneath the canopy, rich natural color — not flat overcast.
• ATMOSPHERIC DEPTH — cooler natural haze in the far distance, real atmospheric perspective separating midground from the distant ridge.
• SCALE PROVER — one tiny element in the distance proves the scale: a hawk hovering as a comma-speck silhouette, a tiny lake reflecting the canopy, a small clearing, a distant ridge catching first light. Render small (postage-stamp scale) to make the forest feel VAST.

━━━ COMPOSITION DIRECTIVE — WIDE FORESTED LANDSCAPE (DEFAULT) ━━━

⚠️ THIS PATH IS WIDE-VISTA-FIRST AND FOREST-DOMINANT. Unless the subject explicitly says "intimate close-up" / "forest interior" / "looking up" / "close-camera", render this as a WIDE PANORAMIC LANDSCAPE dominated by MATURE FOREST — towering canopy filling 60-75% of the frame, sky 15-25%, foreground anchor 10-15%.

For AUTUMN: the rendered output MUST read as "a mature forested hillside drenched edge-to-edge in peak color, every species at maximum saturation, named groves visible across the wide frame." Render every named species in the palette as a distinct dense grove: yellow birch sections, scarlet maple sections, crimson oak sections, amber aspen sections, lingering green conifer columns. NOT orange shrubs on rocks.

For SPRING: the rendered output MUST read as "a mature flowering forest hillside + wildflower SUPERBLOOM understory, named groves visible across the wide frame." Render every named flower species as a distinct dense patch/carpet.

━━━ WOW FACTOR — A BEAUTIFUL REAL PHOTOGRAPH ━━━

This must be a clean, striking nature photo of a real forest at peak season. Every frame has beautiful natural directional light, real atmospheric depth, a tiny scale-prover, and named species visible.

Multi-tier depth (foreground anchor + midground forest + distant peaks/horizon) is mandatory. Clean, true-to-life photography. ALL named colors visible across the wide scene.

DO NOT default to close-camera / intimate / foreground-focused framing unless the subject explicitly demands it. Wide forest-dominant vista is the default.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO named places, NO "fire" as a noun, NO "shrubs" / "scrub" as dominant element.`;
  },

  EARTHBOT_DESERT_SOUTHWEST: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      subject,
      foreground_anchor,
      surprise_element,
      light_condition,
      atmosphere,
      sky_layer,
      scale_prover,
      phenomenon,
    } = slots;
    const phenomenonBlock = phenomenon
      ? `\n\n━━━ RARE PHENOMENON (one real-Earth event woven naturally) ━━━\n${phenomenon}\n\nIf this phenomenon contradicts the rolled light or feels supernatural, DROP IT. Real-Earth ONLY — no aurora, no nacreous, no bioluminescent, no sun-dogs, no fire-rainbow.`
      : '';

    return `You are a fine-art landscape photographer writing ONE DESERT SOUTHWEST scene for EarthBot. American SW iconic raw geology — Monument Valley sandstone towers, Antelope Canyon slot beams, Bryce hoodoo amphitheaters, Zion narrows, Arches, Sedona red rock, Painted Desert, Canyonlands. Clean, professional Southwest landscape photography with terracotta-on-cobalt cinematic depth. Warm-terracotta on cobalt cinematic. Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — RAW EARTH SW GEOLOGY ━━━

This is the real American Southwest — Utah / Arizona / New Mexico iconic raw landforms. Wide-vista panorama or stand-at-the-rim mid-wide framing. The geology is the hero. Multi-tier depth mandatory (foreground anchor + midground hero geology + distant horizon).

━━━ ZERO HUMANS / ZERO HUMAN-BUILT FEATURES / ZERO CULTURAL ━━━

The entire frame is uninhabited landscape. NEVER a figure, NEVER a vehicle, NEVER a road, NEVER buildings, NEVER fences, NEVER petroglyphs (cultural heritage), NEVER ladders, NEVER signage. Pure raw landform only.

━━━ STYLE GUARDS ━━━

- Avoid aurora / nacreous / sun-dogs / fire-rainbow / iridescent / bioluminescent vocabulary (fantasy triggers)
- Avoid sci-fi / portal / mystical / impossible-reflection
- Avoid stylized / 3D-render / cartoony — clean true-to-life photography only
- Avoid "fire" as a noun (renders literal flames per seasonal-shift lesson); use "blazing color" only as adjective
- Avoid molten / lava (American SW geology is cold sandstone / basalt, NOT active volcanic)
- Avoid opal-iridescent / shifting / glowing mineral vocabulary (fantasy-mineral drift)

━━━ THE SUBJECT (the iconic SW landform composition) ━━━
${subject}

━━━ FOREGROUND ANCHOR (close-edge detail) ━━━
${foreground_anchor}

━━━ SURPRISE ELEMENT (one extra scene-richening element woven naturally) ━━━
${surprise_element}

Render this surprise element clearly visible in the scene — it adds the spice that makes the frame feel rich and alive. Bloom on a cactus, dramatic banner cloud above, distant additional rock formation, single weathered tree, etc.

━━━ LIGHT CONDITION ━━━
${light_condition}

━━━ ATMOSPHERE ━━━
${atmosphere}

━━━ SKY LAYER ━━━
${sky_layer}

━━━ SCALE PROVER (tiny element, postage-stamp scale) ━━━
${scale_prover}

Render small — proves the landform is VAST.${phenomenonBlock}

━━━ HARD RULE — TERRACOTTA-ON-COBALT CINEMATIC ━━━

Multi-tier depth (foreground anchor + midground hero geology + distant horizon). Warm terracotta / amber / rust / sienna saturation in foreground + midground; teal-cooled cobalt atmospheric depth in the far distance. Hard sun-light catching every sandstone facet. The viewer should feel the dry warm air and the impossible scale of the rock.

━━━ SCENE-WIDE PALETTE ━━━
${sharedDNA && sharedDNA.scenePalette ? sharedDNA.scenePalette : 'warm terracotta sandstone + cobalt sky + amber-rim rock-edges + cool atmospheric depth'}

━━━ SECONDARY COLOR VIBE ━━━
${sharedDNA && sharedDNA.colorPalette ? sharedDNA.colorPalette : ''}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION DIRECTIVE — WIDE-VISTA OR STAND-AT-THE-RIM ━━━

Wide-vista panoramic landscape OR stand-at-the-rim mid-wide framing. The iconic landform fills 50-65% of the frame. Foreground anchor 15-20%. Sky 15-25%. Multi-tier depth mandatory. Clean, true-to-lifeSouthwest fine-art landscape.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO named places (describe morphologically). Describe positive content only — no negation language like "no humans" or "no architecture" (Flux tokenizer leaks those words).`;
  },

  // Placeholder templates for region-bespoke paths scaffolded 2026-05-23.
  // Built out fully when each path is activated; signature matches the
  // composer contract so pools can load + brief-composer doesn't crash if
  // accidentally invoked. NOT in EARTH_PATHS rotation until full template
  // authored + R0 validated.

  EARTHBOT_AFRICAN_LANDSCAPE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      subject,
      foreground_anchor,
      light_condition,
      atmosphere,
      sky_layer,
      scale_prover,
      phenomenon,
    } = slots;
    const phenomenonBlock = phenomenon
      ? `\n\n━━━ RARE PHENOMENON (one real-Earth African event woven naturally) ━━━\n${phenomenon}\n\nIf this phenomenon contradicts the rolled light or atmosphere, DROP IT. Real-Earth ONLY — no aurora (Africa is too low-latitude), no bioluminescent, no fantasy-cosmic.`
      : '';

    return `You are a fine-art landscape photographer writing ONE AFRICAN RAW NATURE scene for EarthBot. Spans the full breadth of African biomes — Serengeti / Maasai Mara / Etosha / Makgadikgadi / Tarangire / Tsavo savanna grasslands, Congo Basin rainforest (canopy from above / understory floor), Okavango Delta (papyrus channels / lily lagoons), Sahara erg dune seas, Namib coastal red dunes + Deadvlei white clay pan, Madagascar Avenue of the Baobabs + spiny forest, Cape fynbos coastal scrub, Zambezi / Nile riverine flats, Lake Turkana shore, pan-African wildlife at scale-prover scale. Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — REAL AFRICAN BIOMES ONLY ━━━

This is REAL Africa — never alien, never fantasy. Ground every render in specific African geographic identity: BAOBAB and ACACIA trees (NOT generic pine/oak), Icelandic moss has no place here, Patagonian granite has no place here. The horizon is FLAT in open biomes (savanna / delta / dune sea / salt pan / river plain) OR the frame is CANOPY in forest biomes (rainforest / Madagascar baobab grove / Mahale forest interior). NEVER alpine mountains, NEVER snow-capped peaks, NEVER Kilimanjaro / Meru / Lengai (those are mountain triggers Flux locks onto), NEVER Ngorongoro crater rim (reads as mountain).

━━━ ZERO HUMANS / ZERO HUMAN-BUILT FEATURES / ZERO CULTURAL ━━━

The entire frame is uninhabited raw nature. NEVER a figure, NEVER a Maasai herder, NEVER a vehicle (NO safari-jeep / NO Land-Rover / NO pirogue with a human), NEVER a road, NEVER village huts, NEVER kraal, NEVER cattle fences, NEVER aboriginal / rock art, NEVER signage, NEVER tourism infrastructure. Pure raw African landscape only. Wildlife at scale-prover scale (lone elephant / zebra herd thread / giraffe pair / wildebeest column / lion silhouette on termite mound / chimp in canopy / lemur on baobab branch / hippo in delta / flamingo flock on alkaline lake) is permitted at TINY postage-stamp distance, never hero-scale.

━━━ STYLE GUARDS ━━━

- Avoid "sci-fi / portal / mystical / impossible-reflection" vocabulary
- Avoid stylized / 3D-render / cartoony — photographic only
- Avoid "fire" as a noun (renders literal flames) — for grass-burn use "ember-orange horizon glow" / "warm-amber smoke column" as adjective-led phrases
- Avoid generic "African landscape" — name the SPECIFIC African biome and toponym (Serengeti / Maasai Mara / Okavango Delta / Sahara erg / Madagascar Avenue / Cape fynbos) so Flux locks the prior to the right geography

━━━ THE SUBJECT (the iconic African composition) ━━━
${subject}

━━━ FOREGROUND ANCHOR (close-edge detail in the lower 15-20% of frame) ━━━
${foreground_anchor}

━━━ LIGHT CONDITION ━━━
${light_condition}

━━━ ATMOSPHERE ━━━
${atmosphere}

━━━ SKY LAYER ━━━
${sky_layer}

━━━ SCALE PROVER (tiny element at deep distance — postage-stamp scale) ━━━
${scale_prover}

Render small — proves the landscape is VAST. African-appropriate scale-provers ONLY, MATCHED to the rolled subject biome: savanna prompts get lone elephant / zebra herd / wildebeest column / giraffe pair / lion on termite mound. Delta prompts get hippo / flamingo flock / sitatunga / lechwe. Rainforest prompts get chimp in canopy / gorilla family at scrub margin. Madagascar prompts get lemur on baobab branch. Sahara / Namib prompts get oryx / addax / desert elephant pencil-tall in deep distance. NEVER inject elephant into a Sahara prompt or chimp into a savanna prompt. Always TINY and DISTANT, never hero-scale, never anthropomorphic.${phenomenonBlock}

━━━ HARD RULE — AFRICAN PALETTE + ATMOSPHERIC DEPTH ━━━

Multi-tier depth (foreground anchor + midground hero biome + atmospheric distant horizon OR canopy depth). Palette is BIOME-DEPENDENT: dry savanna prompts use warm amber / sienna / red-dust / golden grass; delta prompts use turquoise + papyrus-gold + emerald; rainforest prompts use deep emerald + dappled gold + humid black-water; dune prompts use tangerine + rust + ember; salt pan prompts use blinding pearl-white + cobalt sky; fynbos prompts use protea-pink + king-protea-coral + cool coastal-blue. The viewer should feel African air — dry warm grass-and-dust on savanna, humid leaf-and-mud in rainforest, cold wind-rippled sand on Sahara/Namib dunes, sea-salt on fynbos coast.

━━━ SCENE-WIDE PALETTE ━━━
${sharedDNA && sharedDNA.scenePalette ? sharedDNA.scenePalette : 'African raw nature palette — biome-dependent (warm savanna amber + sienna, turquoise delta + papyrus-gold, deep emerald rainforest, tangerine + rust dune, pearl-white salt pan + cobalt sky, protea-pink + coral fynbos)'}

━━━ SECONDARY COLOR VIBE ━━━
${sharedDNA && sharedDNA.colorPalette ? sharedDNA.colorPalette : ''}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION DIRECTIVE — EPIC, NEVER DOCUMENTARY ━━━

This is a beautiful, striking real photograph of African wilderness — the magnificent version of a real place, the way the best wildlife-documentary cinematographers capture it. Specific composition energy to aim for:

- **LOW-ANGLE HERO STANCE** preferred — camera looking UP at the baobab / acacia / dune crest from grass-level, a clean silhouette against a glowing sky
- **NATURAL SILHOUETTES** of trees / wildlife / dune crests against a warm sunset, blue twilight, or star-crowded indigo
- **AERIAL VISTA** for delta / canopy / salt pan — sweeping natural depth
- **GOD-RAY SHAFTS** through dust haze, crepuscular rays, a lightning-lit thunderhead, storm-break light
- **REAL WEATHER**: anvil thunderhead, mammatus cloud underside at sunset, virga rain-curtain across the plain, haboob dust-wall, monsoon rainbow
- **RICH NATURAL COLOR**: warm amber / copper / rose / cobalt-and-coral sunset gradient — real, saturated, never washed out, never neon
- The iconic African subject fills 50-65% of the frame. Foreground anchor 15-20%. Sky 15-25% (or canopy ceiling for rainforest). Multi-tier depth mandatory.
- Photographic, natural, EPIC African nature photography — the best-light moment, the 90-second magic-window version. Catch the SECOND when the elephant crosses the glowing horizon, when the lion crests the kopje at first light, when the haboob crowns the Sahara, when lightning forks behind the Avenue of the Baobabs.

If the rolled light condition is generic "midday" or "overcast", find its real beauty: midday becomes clear hard sidelight through dust haze, overcast becomes soft pre-storm light. Aim for beautiful natural light, not flat snapshot light.

━━━ MANDATORY OUTPUT ORDER (CRITICAL — Flux attends most to early tokens) ━━━

The polished prompt MUST be authored in this exact sequence:
  1. **OPEN WITH THE SUBJECT** — the African hero (Serengeti shortgrass plain / Maasai Mara golden-grass plain / Okavango Delta papyrus channel / Sahara erg dune sea / Namib Deadvlei white clay pan / Avenue of the Baobabs / Congo Basin canopy / Etosha salt pan / Cape fynbos slope / Zambezi river plain / Nile floodplain / etc.) is the FIRST phrase. NEVER open with foreground detail. NEVER open with light or atmosphere.
  2. Then the SKY LAYER
  3. Then the LIGHT CONDITION + ATMOSPHERE
  4. Then the FOREGROUND ANCHOR (small near-camera detail in lower 15-20%, NOT the hero)
  5. Then the SCALE PROVER (tiny biome-matched wildlife at deep distance)
  6. Then any rolled PHENOMENON
  7. Finally palette / mood notes

The viewer's eye must land on the BAOBAB GROVE / SALT PAN / SAVANNA / DELTA CHANNEL / DUNE SEA / CANOPY first — NEVER on a foreground rock or grass clump. The foreground_anchor and scale_prover are SUPPORTING DETAILS not the subject.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. The FIRST phrase MUST be the African subject. PRESERVE the African toponym from the subject slot verbatim in the opening phrase — Serengeti / Maasai Mara / Etosha / Makgadikgadi / Tarangire / Tsavo / Okavango / Zambezi / Nile / Chobe / Mahale / Sahara / Namib / Deadvlei / Madagascar / Cape fynbos / Congo Basin — these geographic anchors are LOAD-BEARING for African identity, never paraphrase them away. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO meta-descriptors at the open ("Fine-art landscape photography" / "wide-vista gallery print" / "hyperreal photography" — these are style-prior triggers that interfere with the SUBJECT anchoring, NEVER include them at the prompt open). Describe positive content only — no negation language like "no humans" or "no architecture" or "no mountains" (Flux tokenizer leaks those words and renders the noun).`;
  },

  EARTHBOT_ASIA_LANDSCAPE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      subject,
      foreground_anchor,
      light_condition,
      atmosphere,
      sky_layer,
      scale_prover,
      phenomenon,
    } = slots;
    const phenomenonBlock = phenomenon
      ? `\n\n━━━ RARE PHENOMENON (one real-Earth pan-Asian event woven naturally) ━━━\n${phenomenon}\n\nIf this phenomenon contradicts the rolled light or atmosphere, DROP IT. Real-Earth ONLY — no aurora at lower latitudes (only Hokkaido / Tibetan plateau / north Mongolia rarely allow it), no bioluminescent, no fantasy-cosmic.`
      : '';

    return `You are a fine-art landscape photographer writing ONE PAN-ASIAN RAW NATURE scene for EarthBot. THIS IS EARTHBOT — THE LAND IS THE HERO. Spans the full breadth of Asia's signature raw geology — Japan (Mt. Fuji silhouettes, sakura groves, bamboo forest, autumn ginkgo, Hokkaido boreal forest + winter snow trees, Yakushima ancient cedar), China (Huangshan granite peaks + sea-of-clouds, Guilin / Yangshuo / Zhangjiajie / Wulingyuan karst pillars, Tibetan plateau, Jiuzhaigou turquoise lakes), Taiwan (Taroko marble gorge), Vietnam (Halong Bay limestone karst islands), Korea (Seoraksan granite, Jeju volcanic crater), Mongolia (Gobi dunes, Altai steppe), Nepal/Bhutan (high cirque + glacial lake — no Everest), Indonesia (Mount Bromo volcanic basin, Ijen sulfur). Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — REAL ASIAN BIOMES ONLY ━━━

This is REAL Asia — never fantasy. Ground every render in specific Asian geographic identity: GRANITE peaks (NOT generic alps), KARST limestone pillars (NOT mesa), BAMBOO forest (NOT temperate hardwood), SAKURA + GINKGO grove (NOT European autumn), Hokkaido BIRCH/CONIFER snow-trees (NOT alpine), Gobi DUNE SEA, Halong limestone ISLANDS in jade water. Asian peaks are real and welcome (this path INCLUDES mountains — Asia IS mountainous, unlike the African path) but render as Chinese / Japanese / Tibetan / Vietnamese specifically (sea-of-clouds, mist-shrouded granite), NEVER European Alpine drift.

━━━ ZERO HUMANS / ZERO HUMAN-BUILT FEATURES / ZERO CULTURAL HERITAGE ━━━

The entire frame is uninhabited raw nature. NEVER a figure, NEVER a monk, NEVER a vehicle, NEVER torii gates, NEVER pagodas, NEVER temples, NEVER stupas, NEVER village huts, NEVER rice terraces (agricultural), NEVER roads, NEVER stone-paved paths, NEVER prayer flags, NEVER buddha statues, NEVER stone lanterns. Pure raw landscape only. Wildlife if present is matchstick-tiny incidental detail at deep distance — Japanese macaque / snow monkey / red-crowned crane / Hokkaido fox / takin / blue-sheep — never hero-scale.

━━━ STYLE GUARDS ━━━

- Avoid "sci-fi / portal / mystical / impossible-reflection" vocabulary
- Avoid stylized / 3D-render / cartoony — photographic only
- Avoid "fire" as a noun (Flux renders literal flames) — for active volcanism use "molten lava glow" / "ember-red crater rim" / "incandescent sulfur" as adjective-led phrases

━━━ THE SUBJECT (the iconic pan-Asian HABITAT composition) ━━━
${subject}

━━━ FOREGROUND ANCHOR (close-edge detail in the lower 15-20% of frame) ━━━
${foreground_anchor}

━━━ LIGHT CONDITION ━━━
${light_condition}

━━━ ATMOSPHERE ━━━
${atmosphere}

━━━ SKY LAYER ━━━
${sky_layer}

━━━ SCALE PROVER (tiny element at deep distance — postage-stamp scale, optional) ━━━
${scale_prover}

If present, render small — proves the landscape is VAST. Asian-appropriate elements ONLY: Japanese macaque / snow monkey / red-crowned crane / Hokkaido fox / Tibetan blue-sheep / takin / yak / lone-temple-roof-zero geometry / single petrel over Halong / wingtip of distant Demoiselle crane. Never hero-scale, never anthropomorphic.${phenomenonBlock}

━━━ HARD RULE — ASIAN PALETTE + ATMOSPHERIC DEPTH ━━━

Multi-tier depth (foreground anchor + midground hero biome + atmospheric distant horizon OR canopy depth). Palette by biome: HUANGSHAN / SEA-OF-CLOUDS cool grey-and-pearl with granite black; KARST jade-and-emerald water + limestone grey-and-amber; SAKURA pink-and-pearl-pink-against-mist; HOKKAID O snow-white + birch-bone + cool-blue shadow; BAMBOO emerald-and-gold dappled; TIBETAN plateau cobalt-sky + ochre-grass + glacier-blue; GOBI tangerine sand + cobalt sky; HALONG jade water + limestone grey + mist-pearl; YAKUSHIMA emerald-moss + deep-shadow-cedar; INDONESIAN VOLCANO sulfur-yellow + cobalt sky + ash-grey + ember-orange.

━━━ COMPOSITION DIRECTIVE — EPIC, NEVER DOCUMENTARY ━━━

This is a beautiful real nature photograph, not a flat travel-snapshot. This is the LAST SAMURAI cinematic title-card / Kurosawa landscape / BBC Planet Earth Asian episode opener / Mononoke forest energy. The frame must be a beautiful, striking real photograph. Specific composition energy to inject:

- **LOW-ANGLE HERO STANCE** preferred — camera looking UP at the granite spire / karst pillar / cedar trunk from below, dramatic silhouette against mist or burning sky
- **SEA-OF-CLOUDS** — Huangshan / Cordillera Asia signature: clouds breaking around granite peaks, peaks emerging like islands from a white sea
- **DRONE-LEVEL AERIAL** for karst (Halong / Yangshuo / Zhangjiajie), dune sea (Gobi), turquoise-lake (Jiuzhaigou)
- **DRAMATIC SILHOUETTES** of cedar / bamboo / pillar / peak against mist or sunset
- **MIST-INVERSION** epic: Yakushima cedar forest with rolling mist, Huangshan peaks in cloud sea
- **REAL WEATHER**: monsoon-lightning over karst, snow-squall over Hokkaido, sulfur plume over Bromo
- **RICH NATURAL COLOR** (real, saturated, never neon): blood-red sakura sunset / electric jade Jiuzhaigou lake / sulfur-yellow Ijen / orange Gobi against cobalt
- The iconic Asian subject fills 50-65% of the frame. Foreground anchor 15-20%. Sky 15-25% (or canopy ceiling for forest). Multi-tier depth mandatory.
- Photographic, natural, EPIC pan-Asian nature photography — the best-light moment.

━━━ SCENE-WIDE PALETTE ━━━
${sharedDNA && sharedDNA.scenePalette ? sharedDNA.scenePalette : 'Pan-Asian raw nature palette — biome-dependent (cool grey + pearl + granite black for Huangshan, jade + emerald for karst, pink + pearl for sakura, snow + birch + cool-blue for Hokkaido, sulfur + cobalt for volcano)'}

━━━ SECONDARY COLOR VIBE ━━━
${sharedDNA && sharedDNA.colorPalette ? sharedDNA.colorPalette : ''}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ MANDATORY OUTPUT ORDER (CRITICAL — Flux attends most to early tokens) ━━━

The polished prompt MUST be authored in this exact sequence:
  1. **OPEN WITH THE SUBJECT** — the Asian hero (Mt. Fuji silhouette / Huangshan granite spire in sea-of-clouds / Halong Bay limestone islands aerial / Zhangjiajie pillar forest / Yakushima ancient cedar / Sakura grove / Hokkaido birch / Jiuzhaigou turquoise lake / Gobi dune sea / Mount Bromo volcanic basin / etc.) is the FIRST phrase. NEVER open with foreground detail. NEVER open with light or atmosphere.
  2. Then the SKY LAYER
  3. Then the LIGHT CONDITION + ATMOSPHERE
  4. Then the FOREGROUND ANCHOR (small near-camera detail in lower 15-20%, NOT the hero)
  5. Then the SCALE PROVER if applicable (tiny element at deep distance)
  6. Then any rolled PHENOMENON
  7. Finally palette / mood notes

The viewer's eye must land on the PEAK / KARST / CEDAR / SAKURA / DUNE / VOLCANO / LAKE first — NEVER on a foreground rock or grass clump.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. The FIRST phrase MUST be the Asian subject. PRESERVE the Asian toponym from the subject slot verbatim in the opening phrase — Mt. Fuji / Huangshan / Halong Bay / Zhangjiajie / Wulingyuan / Yangshuo / Guilin / Taroko / Seoraksan / Jeju / Hokkaido / Yakushima / Jiuzhaigou / Tibetan plateau / Gobi / Altai / Mount Bromo / Ijen — these geographic anchors are LOAD-BEARING for Asian identity, never paraphrase them away. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO meta-descriptors at the open ("Fine-art landscape photography" / "wide-vista gallery print" / "hyperreal photography" — these are style-prior triggers, NEVER include them at the open). Describe positive content only — no negation language like "no humans" or "no temples" (Flux tokenizer leaks those words).`;
  },
  EARTHBOT_ANDES_PATAGONIA: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      subject,
      foreground_anchor,
      light_condition,
      atmosphere,
      sky_layer,
      scale_prover,
      phenomenon,
    } = slots;
    const phenomenonBlock = phenomenon
      ? `\n\n━━━ RARE PHENOMENON (one real-Earth Patagonian/Andean event woven naturally) ━━━\n${phenomenon}\n\nIf this phenomenon contradicts the rolled light or atmosphere, DROP IT. Real-Earth ONLY — no aurora (rare at this latitude / not the signature look), no bioluminescent, no fantasy-cosmic.`
      : '';

    return `You are a fine-art landscape photographer writing ONE ANDES / PATAGONIA RAW NATURE scene for EarthBot. Spans the full breadth of South American raw geology — Patagonia (Torres del Paine granite spires, Fitz Roy + Cerro Torre, Perito Moreno glacier, Lago Argentino, Tierra del Fuego, Patagonian steppe), the Andes (Cotopaxi + Chimborazo volcanoes, Huayna Picchu + Salkantay peaks, Cordillera Blanca, Aconcagua), Altiplano (Salar de Uyuni mirror flats, Atacama desert, Laguna Colorada + Laguna Verde, Valle de la Luna), Amazon basin (canopy from above, blackwater channels, várzea floodplains), Iguazu Falls, Cordillera del Paine, Marble Caves (Lago General Carrera). Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — REAL SOUTH AMERICAN GEOLOGY ONLY ━━━

This is REAL Patagonia / Andes / Altiplano / Amazon — never fantasy, never alien. Phenomena are real-Earth (lenticular cloud over Patagonian peaks, alpenglow on granite spires, sea of clouds at Andean dawn, Atacama atmospheric clarity, mist drift in Amazon canopy). Ground every render in specific South American geographic identity: GRANITE spires (NOT generic alps), GLACIER fields with patagonian-blue ice (NOT North American), SALAR salt mirror flat (NOT North American playa), Amazon canopy with characteristic emergent trees, ALTIPLANO scrub (yareta cushions, tola shrub, not desert sand). The Andes are the highest tropical mountains on Earth.

━━━ ZERO HUMANS / ZERO HUMAN-BUILT FEATURES / ZERO CULTURAL HERITAGE ━━━

The entire frame is uninhabited raw nature. NEVER a figure, NEVER a hiker, NEVER a vehicle, NEVER buildings or huts, NEVER roads, NEVER trail markers, NEVER fences, NEVER aqueducts. Critically: NEVER Machu Picchu, NEVER Sacsayhuamán, NEVER ANY Inca ruins or stonework, NEVER cultural heritage sites (respect — never render). Pure raw landscape only. Wildlife at scale-prover scale (guanaco / vicuña / condor silhouette / flamingo / llama herd) is permitted at TINY postage-stamp distance, never hero-scale.

━━━ STYLE GUARDS ━━━

- Avoid "sci-fi / portal / mystical / impossible-reflection" vocabulary
- Avoid stylized / 3D-render / cartoony — photographic only
- Avoid "fire" as a noun (Flux renders literal flames) — for active volcanism use "molten lava glow" / "incandescent crater rim" / "ember-red eruption fountain" as adjective-led phrases
- Avoid generic "mountain landscape" — name the SPECIFIC South American formation (Torres del Paine, Fitz Roy, Cotopaxi, Aconcagua) so Flux locks the prior to the right peak

━━━ THE SUBJECT (the iconic Patagonian/Andean composition) ━━━
${subject}

━━━ FOREGROUND ANCHOR (close-edge detail in the lower 15-20% of frame) ━━━
${foreground_anchor}

━━━ LIGHT CONDITION ━━━
${light_condition}

━━━ ATMOSPHERE ━━━
${atmosphere}

━━━ SKY LAYER ━━━
${sky_layer}

━━━ SCALE PROVER (tiny element at deep distance — postage-stamp scale) ━━━
${scale_prover}

Render small — proves the landscape is VAST. Patagonian/Andean scale-provers ONLY (lone guanaco silhouette / vicuña pair / Andean condor wingspan / single Andean fox / flamingo flock on altiplano laguna / matchstick-tiny gaucho-zero geometry on steppe / single tapir at Amazon canopy edge). Never hero-scale, never anthropomorphic.${phenomenonBlock}

━━━ HARD RULE — SOUTH AMERICAN PALETTE + ATMOSPHERIC DEPTH ━━━

Multi-tier depth (foreground anchor + midground hero geology + atmospheric distant horizon). Palette by biome: PATAGONIA cool greys and granite + glacier blues + Patagonian steppe ochre; ANDES alpenglow rose-amber on snow + cool morning blue + lenticular pink; ALTIPLANO blinding salt-white + cobalt sky + flamingo coral + laguna mineral colors (red Colorada, green Verde); ATACAMA terracotta and burnt-orange with high cobalt sky; AMAZON deep emerald + black-water reflection + golden canopy break. Air feels thin and clean at high elevation (Andes / Altiplano) OR humid emerald (Amazon) — viewer should feel which biome.

━━━ SCENE-WIDE PALETTE ━━━
${sharedDNA && sharedDNA.scenePalette ? sharedDNA.scenePalette : 'South American raw nature palette — biome-dependent (cool Patagonian greys + glacier blues, alpenglow Andean rose, salt-white + cobalt altiplano, emerald Amazon)'}

━━━ SECONDARY COLOR VIBE ━━━
${sharedDNA && sharedDNA.colorPalette ? sharedDNA.colorPalette : ''}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION DIRECTIVE ━━━

The iconic South American subject fills 50-65% of the frame. Foreground anchor 15-20%. Sky 15-25%. Multi-tier depth mandatory. Clean, true-to-lifefine-art landscape, never stylized.

━━━ MANDATORY OUTPUT ORDER (CRITICAL — Flux attends most to early tokens) ━━━

The polished prompt MUST be authored in this exact sequence:
  1. **OPEN WITH THE SUBJECT** — the South American hero (Torres del Paine granite spires / Fitz Roy peak / Perito Moreno glacier face / Salar de Uyuni mirror flat / Cotopaxi volcano / Atacama Valle de la Luna / Iguazu Falls / Marble Caves of Lago General Carrera / Amazon canopy / etc.) is the FIRST phrase. NEVER open with foreground detail. NEVER open with light or atmosphere.
  2. Then the SKY LAYER
  3. Then the LIGHT CONDITION + ATMOSPHERE
  4. Then the FOREGROUND ANCHOR (small near-camera detail in lower 15-20%, NOT the hero)
  5. Then the SCALE PROVER (tiny element at deep distance)
  6. Then any rolled PHENOMENON
  7. Finally palette / mood notes

The viewer's eye must land on the TORRES / FITZ ROY / GLACIER / SALAR / VOLCANO / FALLS / CANOPY first — NEVER on a foreground rock or grass clump. The foreground_anchor and scale_prover are SUPPORTING DETAILS not the subject.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. The FIRST phrase MUST be the South American subject. PRESERVE the toponym from the subject slot verbatim in the opening phrase — Torres del Paine / Fitz Roy / Cerro Torre / Perito Moreno / Lago Argentino / Cotopaxi / Chimborazo / Aconcagua / Salar de Uyuni / Atacama / Laguna Colorada / Laguna Verde / Valle de la Luna / Iguazu / Marble Caves / Patagonia / Tierra del Fuego — these geographic anchors are LOAD-BEARING for South American identity, never paraphrase them away. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO meta-descriptors at the open ("Fine-art landscape photography" / "wide-vista gallery print" / "hyperreal photography" — these are style-prior triggers that interfere with the SUBJECT anchoring, NEVER include them at the prompt open). Describe positive content only — no negation language like "no humans" or "no architecture" (Flux tokenizer leaks those words).`;
  },
  EARTHBOT_AUSTRALIAN_OUTBACK: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      subject,
      foreground_anchor,
      light_condition,
      atmosphere,
      sky_layer,
      scale_prover,
      phenomenon,
    } = slots;
    const phenomenonBlock = phenomenon
      ? `\n\n━━━ RARE PHENOMENON (one real-Earth Australian event woven naturally) ━━━\n${phenomenon}\n\nIf this phenomenon contradicts the rolled light or atmosphere, DROP IT. Real-Earth ONLY — no aurora at these latitudes (Aurora Australis only at extreme south coast — very rare), no bioluminescent, no fantasy-cosmic.`
      : '';

    return `You are a fine-art landscape photographer writing ONE AUSTRALIAN OUTBACK RAW NATURE scene for EarthBot. THE LAND IS THE HERO. Spans the full breadth of Australia's signature outback geology — Uluru / Kata Tjuta domes, Bungle Bungle Range beehive striped domes (Purnululu), the Pinnacles desert limestone spires (Nambung), Karijini iron gorges + waterholes, Lake Eyre (Kati Thanda) salt flat, Flinders Ranges + Wilpena Pound, MacDonnell ranges + Glen Helen gorge, Devils Marbles (Karlu Karlu) granite boulders, Cape Range Karijini gorges, Daintree rainforest (north QLD), Twelve Apostles Great Ocean Road sea-stacks, Tasmania (Cradle Mountain wilderness — wait NO mountains: instead Tasmanian temperate rainforest + glacial tarns), Kangaroo Island Remarkable Rocks, Whitehaven Beach silica sand, Pinnacles desert spires. Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — REAL AUSTRALIAN OUTBACK ONLY ━━━

This is REAL Australia — never fantasy. Ground every render in specific Australian geographic identity: RED-IRON-OXIDE soil (distinct from American SW orange — Australian red is deeper rust-red with iron-staining), monolith sandstone (Uluru, Kata Tjuta = round-weathered domes, NOT mesa-cliff geology), striped sandstone beehives (Bungle Bungle), limestone spires (Pinnacles desert), eucalyptus + ghost gum + spinifex grass (NEVER cactus / juniper / sage), red-river-gum on dry riverbed, banksia, grevillea. Australia's palette is RED + OCHRE + COBALT + GHOST-GUM-WHITE + SPINIFEX-GOLD.

━━━ ZERO HUMANS / ZERO HUMAN-BUILT / ZERO CULTURAL HERITAGE ━━━

The entire frame is uninhabited raw nature. NEVER a figure, NEVER a vehicle, NEVER buildings or huts, NEVER roads, NEVER fences, NEVER tourist viewing platforms or boardwalks, NEVER aboriginal rock art / cave paintings / petroglyphs (cultural heritage — RESPECT, never render), NEVER sacred sites depicted as anything other than raw geology. Pure raw landscape only. Wildlife if present is matchstick-tiny incidental detail at deep distance — kangaroo / red-roo / emu / dingo / wedge-tailed eagle / Tasmanian devil silhouette — never hero-scale.

━━━ STYLE GUARDS ━━━

- Avoid "sci-fi / portal / mystical / impossible-reflection" vocabulary
- Avoid stylized / 3D-render / cartoony — photographic only
- Avoid AMERICAN-SOUTHWEST drift — distinct from desert-southwest path. NO Monument Valley / Sedona / Antelope Canyon / Bryce — Australian outback has its OWN iconic geology (Uluru / Kata Tjuta / Bungle Bungle / Pinnacles / Karijini / Devils Marbles / Wilpena Pound). NO juniper / sage / saguaro / Joshua tree — instead eucalyptus / ghost gum / spinifex / banksia.

━━━ THE SUBJECT (the iconic Australian HABITAT composition) ━━━
${subject}

━━━ FOREGROUND ANCHOR (close-edge detail in the lower 15-20% of frame) ━━━
${foreground_anchor}

━━━ LIGHT CONDITION ━━━
${light_condition}

━━━ ATMOSPHERE ━━━
${atmosphere}

━━━ SKY LAYER ━━━
${sky_layer}

━━━ SCALE PROVER (tiny element at deep distance — postage-stamp scale, optional) ━━━
${scale_prover}

If present, render small — proves the landscape is VAST. Australian-appropriate elements ONLY: red-roo silhouette / emu pair / dingo silhouette / wedge-tailed eagle gliding / single white-trunked ghost-gum at deep distance. Never hero-scale.${phenomenonBlock}

━━━ HARD RULE — AUSTRALIAN PALETTE + ATMOSPHERIC DEPTH ━━━

Multi-tier depth (foreground anchor + midground hero biome + atmospheric distant horizon OR canopy depth for Daintree). Palette by biome: ULURU + RED CENTRE deep rust-red iron-oxide + cobalt sky + ghost-gum-white + spinifex-gold; BUNGLE BUNGLE striped orange-and-grey sandstone + cobalt; PINNACLES tan limestone + cobalt; KARIJINI deep red-iron + emerald waterhole; LAKE EYRE blinding pink-white salt + cobalt; DAINTREE emerald canopy + ancient-forest deep-shadow; TWELVE APOSTLES grey limestone + emerald-grass cliffs + cobalt sea; WHITEHAVEN white silica sand + jade water. The air feels DRY HEAT in red centre, HUMID in Daintree, SALT-SPRAY on Twelve Apostles.

━━━ COMPOSITION DIRECTIVE — EPIC, NEVER DOCUMENTARY ━━━

This is a beautiful real nature photograph, not a flat travel-snapshot. This is BBC Planet Earth Australia season-finale showstopper / Russell-Crowe-Australia-film cinematic title-card / Tracks-by-Robyn-Davidson energy. The frame must be a beautiful, striking real photograph. Specific composition energy to inject:

- **LOW-ANGLE HERO STANCE** preferred — camera looking UP at Uluru / Kata Tjuta / Bungle Bungle dome / Pinnacles spire from red-dust ground level
- **DRONE-LEVEL AERIAL** for Bungle Bungle striped domes, Pinnacles desert, Lake Eyre salt flat, Daintree canopy
- **MOLTEN-RED SUNSET SILHOUETTE** of Uluru / Kata Tjuta against burning sky — the iconic Red Centre dusk
- **DRAMATIC ICONIC TREES** — solitary ghost gum on red-dust plain at sunset, twisted river-gum on dry creek-bed
- **MILKY-WAY OVER ULURU** — outback dark-sky night with star-crowded indigo above the monolith
- **EPIC GORGE INTERIOR** — Karijini deep red-iron gorge with emerald waterhole at base, light shafts piercing from above
- **REAL WEATHER**: dust storm wall over Lake Eyre, monsoon lightning over Kakadu, fog inversion over Wilpena Pound
- **RICH NATURAL COLOR** (real, saturated, never neon): blood-red iron-oxide soil against electric cobalt sky / jade Karijini pool against rust walls / pink salt flat against cobalt
- The iconic Australian subject fills 50-65% of the frame. Foreground anchor 15-20%. Sky 15-25%. Multi-tier depth mandatory.

━━━ SCENE-WIDE PALETTE ━━━
${sharedDNA && sharedDNA.scenePalette ? sharedDNA.scenePalette : 'Australian outback palette — biome-dependent (deep rust-red iron-oxide + cobalt + ghost-gum-white + spinifex-gold for Red Centre, striped orange-and-grey for Bungle Bungle, emerald + rust for Karijini, pink-white salt for Lake Eyre, emerald canopy for Daintree, grey limestone + cobalt for Twelve Apostles)'}

━━━ SECONDARY COLOR VIBE ━━━
${sharedDNA && sharedDNA.colorPalette ? sharedDNA.colorPalette : ''}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ MANDATORY OUTPUT ORDER (CRITICAL — Flux attends most to early tokens) ━━━

The polished prompt MUST be authored in this exact sequence:
  1. **OPEN WITH THE SUBJECT** — the Australian hero (Uluru monolith / Kata Tjuta domes / Bungle Bungle striped beehives / Pinnacles desert spires / Karijini iron gorge / Lake Eyre salt flat / Wilpena Pound / Devils Marbles / Twelve Apostles / Whitehaven Beach / Daintree canopy / etc.) is the FIRST phrase. NEVER open with foreground detail. NEVER open with light or atmosphere.
  2. Then the SKY LAYER
  3. Then the LIGHT CONDITION + ATMOSPHERE
  4. Then the FOREGROUND ANCHOR (small near-camera detail, NOT the hero)
  5. Then the SCALE PROVER if applicable
  6. Then any rolled PHENOMENON
  7. Finally palette / mood notes

The viewer's eye must land on the MONOLITH / DOMES / SPIRES / GORGE / SALT PAN / SEA STACKS / CANOPY first.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. The FIRST phrase MUST be the Australian subject. PRESERVE the Australian toponym from the subject slot verbatim in the opening phrase — Uluru / Kata Tjuta / Bungle Bungle / Purnululu / Pinnacles / Nambung / Karijini / Lake Eyre / Kati Thanda / Wilpena Pound / Flinders / MacDonnell / Devils Marbles / Karlu Karlu / Twelve Apostles / Whitehaven / Daintree / Cradle Country (Tasmania) — these geographic anchors are LOAD-BEARING for Australian identity, never paraphrase them away. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO meta-descriptors at the open ("Fine-art landscape photography" / "wide-vista gallery print" / "hyperreal photography" — NEVER include them at the open). Describe positive content only — no negation language like "no humans" or "no rock art" (Flux tokenizer leaks those words).`;
  },
  EARTHBOT_ICELAND_RAW: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      subject,
      foreground_anchor,
      light_condition,
      atmosphere,
      sky_layer,
      scale_prover,
      phenomenon,
    } = slots;
    const phenomenonBlock = phenomenon
      ? `\n\n━━━ RARE PHENOMENON (one real-Earth Icelandic event woven naturally) ━━━\n${phenomenon}\n\nIf this phenomenon contradicts the rolled light or atmosphere, DROP IT. Real-Earth ONLY — aurora is allowed (it IS a real Icelandic phenomenon) but rendered GROUNDED-PHOTOGRAPHIC (subtle green ribbon at moderate intensity, NOT fantasy-cosmic neon).`
      : '';

    return `You are a fine-art landscape photographer writing ONE ICELAND RAW NATURE scene for EarthBot. Iceland's signature raw geology — glacier tongues (Vatnajökull / Sólheimajökull / Breiðamerkurjökull), Jökulsárlón glacier lagoon + Diamond Beach iceberg shards, black-sand beaches (Reynisfjara / Vík), basalt sea stacks + columns (Reynisdrangar / Stuðlagil canyon / Svartifoss cliff face), waterfalls (Skógafoss / Seljalandsfoss / Gullfoss / Dettifoss / Háifoss / Goðafoss), ice caves (Vatnajökull blue-crystal interior), moss-on-lava fields (Eldhraun), rhyolite mountains (Landmannalaugar), Þingvellir continental rift, geothermal vents + geysers (Strokkur / Geysir). Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — REAL ICELANDIC GEOLOGY ONLY ━━━

This is REAL Iceland — never alien, never fantasy. Iceland's optical phenomena (aurora, polar twilight, midnight sun) are real and welcome BUT rendered as documentary fine-art photography NEVER as fantasy-cosmic spectacle. Ground every render in actual Icelandic geographic identity: black volcanic sand (NOT yellow desert sand), basalt (NOT granite), glacial-melt-river silt (NOT crystal-clear mountain stream), Icelandic moss + lichen (NOT lush grass), rhyolite color-banded mountains (NOT alpine snow-capped peaks).

━━━ ZERO HUMANS / ZERO HUMAN-BUILT FEATURES ━━━

The entire frame is uninhabited raw nature. NEVER a figure, NEVER a tourist, NEVER a vehicle, NEVER a building / cabin / hut / lighthouse, NEVER a road or boardwalk or fence or signpost, NEVER a sheep, NEVER cropland. Pure raw Iceland only. Wildlife at scale-prover scale (Icelandic horse / arctic fox / lone seabird) is permitted at TINY postage-stamp distance, never hero-scale.

━━━ STYLE GUARDS ━━━

- Avoid "sci-fi / portal / mystical / impossible-reflection" vocabulary (fantasy triggers)
- Avoid stylized / 3D-render / cartoony — photographic only
- Avoid "fire" as a noun (Flux renders literal flames) — for active volcanism use "molten lava glow" / "incandescent fissure" / "ember-red eruption fountain" as adjective-led phrases
- Aurora is allowed but described as "subtle green ribbon" / "soft emerald arc" / "low-intensity polar curtain" — NEVER as "vivid neon" / "blinding cosmic ribbon" / "mythical fire-sky"

━━━ THE SUBJECT (the iconic Icelandic composition) ━━━
${subject}

━━━ FOREGROUND ANCHOR (close-edge detail in the lower 15-20% of frame) ━━━
${foreground_anchor}

━━━ LIGHT CONDITION ━━━
${light_condition}

━━━ ATMOSPHERE ━━━
${atmosphere}

━━━ SKY LAYER ━━━
${sky_layer}

━━━ SCALE PROVER (tiny element at deep distance — postage-stamp scale) ━━━
${scale_prover}

Render small — proves the landscape is VAST. Iceland-appropriate scale-provers ONLY (Icelandic horse silhouette / arctic fox shape on black sand / lone puffin or kittiwake / single skua against snow / matchstick-tiny iceberg in deep distance). Never hero-scale, never anthropomorphic.${phenomenonBlock}

━━━ HARD RULE — ICELANDIC PALETTE + ATMOSPHERIC DEPTH ━━━

Multi-tier depth (foreground anchor + midground hero feature + atmospheric distant horizon). Iceland's palette is COOL — graphite black sand, glacier blue, basalt grey, moss green, polar twilight purple, white ice, rhyolite ochre and rust banding. Warm tones only at golden-hour / midnight-sun glow / volcanic ember. Air feels cold and clean — viewer should feel the chill of Atlantic spray, glacial wind, sub-zero ice cave.

━━━ SCENE-WIDE PALETTE ━━━
${sharedDNA && sharedDNA.scenePalette ? sharedDNA.scenePalette : 'Icelandic raw nature palette — cool blacks, glacier blues, basalt greys, moss greens, polar twilight purples'}

━━━ SECONDARY COLOR VIBE ━━━
${sharedDNA && sharedDNA.colorPalette ? sharedDNA.colorPalette : ''}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION DIRECTIVE ━━━

The iconic Icelandic subject fills 50-65% of the frame. Foreground anchor 15-20%. Sky 15-25%. Multi-tier depth mandatory. Clean, true-to-lifeIceland fine-art landscape, never stylized.

━━━ MANDATORY OUTPUT ORDER (CRITICAL — Flux attends most to early tokens) ━━━

The polished prompt MUST be authored in this exact sequence:
  1. **OPEN WITH THE SUBJECT** — the Icelandic hero (Reynisfjara black-sand beach / Vatnajökull glacier tongue / Jökulsárlón iceberg lagoon / Skógafoss waterfall / Stuðlagil basalt canyon / Landmannalaugar rhyolite ridge / etc.) is the FIRST phrase. NEVER open with foreground detail. NEVER open with light condition or atmosphere.
  2. Then the SKY LAYER
  3. Then the LIGHT CONDITION + ATMOSPHERE
  4. Then the FOREGROUND ANCHOR (small near-camera detail in lower 15-20%, NOT the hero)
  5. Then the SCALE PROVER (tiny element at deep distance)
  6. Then any rolled PHENOMENON
  7. Finally palette / mood notes

The viewer's eye must land on the GLACIER TONGUE / BLACK BEACH / BASALT STACK / WATERFALL / ICE CAVE / RHYOLITE RIDGE first — NEVER on a foreground rock or moss clump. The foreground_anchor and scale_prover are SUPPORTING DETAILS not the subject.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. The FIRST phrase MUST be the Icelandic subject. PRESERVE the Icelandic toponym from the subject slot verbatim in the opening phrase — Reynisfjara / Vatnajökull / Sólheimajökull / Jökulsárlón / Skógafoss / Seljalandsfoss / Gullfoss / Dettifoss / Stuðlagil / Svartifoss / Landmannalaugar / Þingvellir / Eldhraun / Strokkur / Geysir / Diamond Beach / Vík — these geographic anchors are LOAD-BEARING for Icelandic identity, never paraphrase them away. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO meta-descriptors at the open ("Fine-art landscape photography" / "wide-vista gallery print" / "hyperreal photography" — these are style-prior triggers that interfere with the SUBJECT anchoring, NEVER include them at the prompt open). Describe positive content only — no negation language like "no humans" or "no architecture" (Flux tokenizer leaks those words).`;
  },
  EARTHBOT_EUROPEAN_WILDERNESS: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      subject,
      foreground_anchor,
      light_condition,
      atmosphere,
      sky_layer,
      scale_prover,
      phenomenon,
    } = slots;
    const phenomenonBlock = phenomenon
      ? `\n\n━━━ RARE PHENOMENON (one real-Earth European event woven naturally) ━━━\n${phenomenon}\n\nIf this phenomenon contradicts the rolled light or atmosphere, DROP IT. Real-Earth ONLY — no fantasy.`
      : '';

    return `You are a fine-art landscape photographer writing ONE EUROPEAN WILDERNESS RAW NATURE scene for EarthBot. THE LAND IS THE HERO. Spans the full breadth of Europe's signature wild geology — British Isles (Scottish Highlands: Glen Coe / Quiraing / Old Man of Storr / Loch Lomond / Trotternish ridge; Welsh Snowdonia / Llyn Idwal / Cadair Idris; Irish Cliffs of Moher / Connemara / Burren / Ring of Kerry / Skellig Michael cliffs; English Lake District), Alpine European (Dolomites — Tre Cime / Lago di Braies / Seceda ridge / Cinque Torri; Matterhorn from Riffelsee / Stellisee; Slovenian Julian Alps + Lake Bled island; Bavarian Alps + Königssee / Eibsee; Polish Tatras), Scandinavian fjords (Lofoten / Geirangerfjord / Trolltunga / Preikestolen), Faroe Islands (Drangarnir / Múlafossur / Sørvágsvatn floating-lake), Iceland-overlap-aware (avoid — that's iceland-raw path's domain). Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — REAL EUROPEAN WILDERNESS ONLY ━━━

This is REAL Europe — never fantasy. Ground every render in specific European geographic identity: Scottish HIGHLANDS heather + bog + glen + loch; Welsh Snowdonia slate-grey + emerald grass + cirque-tarn; Irish moss-green + limestone-grey + Atlantic cliff; Dolomites dramatic pale-limestone-and-pink-alpenglow signature; Matterhorn pyramidal silhouette + Riffelsee reflection; Slovenian Julian Alps lake-and-peak Lake-Bled-island signature; Lofoten fjord-and-spire arctic-cool color; Faroe basalt cliff + emerald turf + Atlantic spray. Europe HAS mountains — they're the GOAL here (unlike african-landscape which is flat) — but render as EUROPEAN-specific (Dolomites limestone pink-alpenglow, Matterhorn pyramidal, Scottish-heather-glen, Norwegian fjord), NEVER American Rockies / Patagonian / Asian drift.

━━━ ZERO HUMANS / ZERO HUMAN-BUILT / ZERO CULTURAL HERITAGE ━━━

The entire frame is uninhabited raw nature. NEVER a figure, NEVER a hiker, NEVER a vehicle, NEVER buildings, NEVER huts (including the famous Tre Cime rifugio / Faroe black cabins), NEVER villages, NEVER castles, NEVER ruins (Skellig Michael monastery / Hadrian's Wall / etc — cultural heritage, respect), NEVER standing stones / megalithic features (Stonehenge / Avebury / Ring of Brodgar — cultural), NEVER sheep / cows / agricultural pastures, NEVER fences / drystone walls (cultural), NEVER lighthouses, NEVER roads, NEVER funicular cables. Pure raw landscape only. Wildlife if present is matchstick-tiny incidental detail — red deer / chamois / ibex / mountain hare / Scottish wildcat / Atlantic puffin / sea eagle / gannet — never hero-scale.

━━━ STYLE GUARDS ━━━

- Avoid "sci-fi / portal / mystical / impossible-reflection" vocabulary
- Avoid stylized / 3D-render / cartoony — photographic only
- Avoid AMERICAN-ROCKIES / PATAGONIAN drift — name the SPECIFIC European formation (Dolomites Tre Cime / Matterhorn / Lofoten Reine / Trolltunga / Quiraing / Old Man of Storr) so Flux locks the prior to the right peak / fjord / glen

━━━ THE SUBJECT (the iconic European HABITAT composition) ━━━
${subject}

━━━ FOREGROUND ANCHOR ━━━
${foreground_anchor}

━━━ LIGHT CONDITION ━━━
${light_condition}

━━━ ATMOSPHERE ━━━
${atmosphere}

━━━ SKY LAYER ━━━
${sky_layer}

━━━ SCALE PROVER (tiny element at deep distance — postage-stamp scale, optional) ━━━
${scale_prover}

If present, render small. European-appropriate ONLY: chamois / ibex on cliff / red deer stag / mountain hare / Atlantic puffin / sea eagle / gannet flock / lone Scottish wildcat. Never hero-scale.${phenomenonBlock}

━━━ HARD RULE — EUROPEAN PALETTE + ATMOSPHERIC DEPTH ━━━

Multi-tier depth (foreground anchor + midground hero geology + atmospheric distant horizon). Palette by biome: SCOTTISH HIGHLANDS heather-purple + moss-green + grey-mist + loch-cobalt; SNOWDONIA slate-grey + emerald-grass + cool-mist; IRISH CLIFFS limestone-pale-grey + Atlantic-cobalt + emerald-grass; DOLOMITES pale-limestone-and-pink-alpenglow + cobalt sky + emerald larch-and-pasture; MATTERHORN cobalt-and-snow + Riffelsee reflection cool-blue; JULIAN ALPS emerald-pasture + lake-turquoise + pale-limestone; LOFOTEN cool-blue + snow-white + arctic-pink-twilight + black basalt; FAROE basalt-grey + emerald-turf + Atlantic-pearl-spray.

━━━ COMPOSITION DIRECTIVE — EPIC, NEVER DOCUMENTARY ━━━

This is a beautiful real nature photograph, not a flat travel-snapshot. This is BBC Planet Earth Europe season opener / Lord of the Rings Scottish Highlands cinematic / Skyfall Glen Coe energy. A beautiful, striking real photograph. Specific composition energy:

- **LOW-ANGLE HERO STANCE** — camera looking UP at Dolomites peak / Matterhorn pyramid / Old Man of Storr pinnacle / Faroe sea-cliff from below
- **DRONE-LEVEL AERIAL** for Lofoten fjord, Faroe Sørvágsvatn floating-lake, Lake Bled island, Loch Lomond aerial
- **DRAMATIC PEAK REFLECTION** in mirror tarn (Riffelsee Matterhorn, Lago di Braies Dolomites, Llyn Idwal Snowdon)
- **MIST-INVERSION SEA-OF-CLOUDS** epic: Scottish Highlands dawn cloud-sea, Dolomites alpenglow above cloud floor
- **HEATHER MOOR SUNSET** — Scottish Highlands carpet of purple heather in raking sidelight
- **DRAMATIC SILHOUETTES** — Old Man of Storr pinnacles / Cliffs of Moher edge / Trolltunga rock-tongue
- **REAL WEATHER**: snow squall over Cairngorms, monsoon-like rain curtain Quiraing, lenticular over Matterhorn, Atlantic storm over Cliffs of Moher
- **RICH NATURAL COLOR** (real, saturated, never neon): blood-red Dolomites alpenglow / electric heather sunset / cobalt fjord at blue-hour / molten Faroe basalt-and-sea
- 50-65% subject, 15-20% foreground, 15-25% sky. Multi-tier depth mandatory.

━━━ SCENE-WIDE PALETTE ━━━
${sharedDNA && sharedDNA.scenePalette ? sharedDNA.scenePalette : 'European wilderness palette — biome-dependent (heather-purple + moss-green for Scotland, slate-grey + emerald for Wales, limestone-pale + pink-alpenglow for Dolomites, cobalt + snow + Riffelsee for Matterhorn, emerald + turquoise for Slovenian Lakes, cool-blue + arctic-pink for Lofoten, basalt-grey + emerald-turf for Faroe)'}

━━━ SECONDARY COLOR VIBE ━━━
${sharedDNA && sharedDNA.colorPalette ? sharedDNA.colorPalette : ''}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ MANDATORY OUTPUT ORDER (CRITICAL — Flux attends most to early tokens) ━━━

The polished prompt MUST be authored in this exact sequence:
  1. **OPEN WITH THE SUBJECT** — the European hero (Tre Cime di Lavaredo / Matterhorn from Riffelsee / Old Man of Storr / Quiraing / Glen Coe / Lofoten Reine fjord / Trolltunga / Cliffs of Moher / Faroe Drangarnir sea stack / Sørvágsvatn / Lago di Braies / Snowdonia Llyn Idwal / Lake Bled island / etc.) is the FIRST phrase. NEVER open with foreground.
  2. Then the SKY LAYER
  3. Then the LIGHT CONDITION + ATMOSPHERE
  4. Then the FOREGROUND ANCHOR
  5. Then the SCALE PROVER if applicable
  6. Then any rolled PHENOMENON
  7. Finally palette / mood notes

The viewer's eye must land on the PEAK / FJORD / CLIFF / TARN / RIDGE / SEA-STACK first.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. The FIRST phrase MUST be the European subject. PRESERVE the European toponym from the subject slot verbatim — Tre Cime / Lavaredo / Matterhorn / Riffelsee / Stellisee / Dolomites / Lago di Braies / Seceda / Cinque Torri / Old Man of Storr / Quiraing / Glen Coe / Loch Lomond / Trotternish / Snowdonia / Llyn Idwal / Cadair Idris / Cliffs of Moher / Connemara / Burren / Lofoten / Reine / Geirangerfjord / Trolltunga / Preikestolen / Drangarnir / Múlafossur / Sørvágsvatn / Lake Bled / Königssee / Eibsee / Tatras — these toponyms are LOAD-BEARING, never paraphrase them away. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO meta-descriptors at the open ("Fine-art landscape photography" / "wide-vista gallery print" / "hyperreal photography" — NEVER include them at the open). Describe positive content only — no negation language like "no humans" or "no castles" (Flux tokenizer leaks those words).`;
  },

  EARTHBOT_HIDDEN_CORNER: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      subject,
      foreground_anchor,
      water_feature,
      micro_detail,
      scale_prover,
      lighting,
      atmosphere,
      phenomenon,
    } = slots;
    const phenomenonBlock = phenomenon
      ? `\n\n━━━ RARE PHENOMENON (one signature optical event woven naturally) ━━━\n${phenomenon}\n\nIf this phenomenon physically contradicts the rolled lighting or feels supernatural, DROP IT. Real-Earth ONLY — no bioluminescent / aurora / nacreous / sun-dogs / fire-rainbow / iridescent.`
      : '';

    return `You are a fine-art nature photographer writing ONE HIDDEN CORNER scene for EarthBot. The OFF-THE-BEATEN-PATH discovered pocket of nature — the secret magical place you stumble into where the whole little scene is visible to you. Real-Earth ONLY. STAND-IN-THE-POCKET mid-wide framing — NOT macro close-up of a single element, NOT wide panoramic vista. The viewer is standing IN the secret pocket and can see the whole 10-15 foot intimate scene around them. CRITICAL: intimate scale does NOT mean minimal OR macro — every render must show the WHOLE little pocket of nature PACKED LUSH with multi-tier detail. Clean, professional intimate-nature photography (NOT macro close-up). Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — OFF-THE-BEATEN-PATH SECRET POCKET (NOT MACRO) ━━━

This is the secluded clearing / glade / grotto / creek-pocket you'd find on a long hike, miles from any trail. The viewer is STANDING IN the pocket, seeing the whole 10-15 foot scene unfold around them. The feel is "I can't believe I found this place." Quiet, untouched, magical, intimate.

⚠️ NOT MACRO — do NOT render this as an extreme close-up of one mossy stone, one mushroom, one leaf. The viewer sees the WHOLE little pocket: the clearing or pond or grotto opening, the trees surrounding it, the ground details at the edge, the canopy above filtering the light. Show 8-15 feet of scene around the viewer.

⚠️ NOT WIDE VISTA — do NOT render this as a distant landscape view. Stay INSIDE the pocket — the trees / walls / canopy frame the scene.

━━━ LUSH-DETAIL MANDATE — PACKED FULL ━━━

⚠️ Intimate scale ≠ minimalistic. The frame must be PACKED with rich texture and layered detail at every depth tier. Multi-tier composition mandatory: FOREGROUND close-detail anchor + MIDGROUND subject + BACKGROUND soft atmospheric depth. Every surface ALIVE with texture — moss carpeting every rock, dew on every leaf, lichen patches on every trunk, fern fiddleheads unfurling, mushroom clusters at the base, wet stones, water droplets clinging. NO sparse / empty / minimal / negative-space compositions.

━━━ ZERO HUMANS / ZERO HUMAN-BUILT FEATURES ━━━

NEVER a person, NEVER a hiker, NEVER cabins, NEVER fences, NEVER cars, NEVER roads, NEVER footpaths, NEVER stone-steps, NEVER any constructed element. Pure raw secluded nature only.

━━━ ABSOLUTELY BANNED ━━━

- NO bioluminescent / phosphorescent / foxfire / glowing-fungi (legacy fantasy trigger that drifted hidden-corner sci-fi)
- NO aurora / nacreous / iridescent clouds / sun-dogs / fire-rainbow / double-rainbow (supernatural drift triggers)
- NO sci-fi / fantasy / portal / mystical / cyan-wash / impossible-reflection / impossible-angle
- NO architecture / cabin / bridge / fence / path / stone-steps / signage
- NO humans / footprints / clothing / belongings
- NO wide panorama / epic vista / mountain ridges as dominant frame (this is INTIMATE)
- NO sparse / empty / minimal / negative-space compositions (LUSH packed detail mandatory)
- NO named places
- NO single beam / single shaft of light as ONLY light source (use "shafts plural fanning" if multiple)
- NO stylized / 3D-render / cartoony — clean true-to-life photography
- NO "fire" as a noun (renders literal flames — use "blazing color" as adjective only)

━━━ THE HIDDEN-CORNER SUBJECT (the off-the-beaten-path secret pocket — fills the SCENE, not the frame edge to edge) ━━━
${subject}

Render the subject as the whole little 8-15 foot pocket — the clearing, pond, grotto, glade — visible from where the viewer is standing in it.

━━━ FOREGROUND DETAIL (eye-entry detail at the near edge — NOT macro close-up) ━━━
${foreground_anchor}

Render the foreground detail at the NEAR EDGE of the visible pocket — within a few feet of the viewer, but NOT extreme macro close-up. Just close enough to anchor the eye, not so close that it dominates. Visible alongside the subject and surrounding context.

━━━ WATER FEATURE (water content woven into the scene) ━━━
${water_feature}

━━━ MICRO DETAIL (the rich texture that makes every surface alive) ━━━
${micro_detail}

Render the micro-detail LITERALLY — dew, lichen, moss, water droplets, wet-stone gleam. This is the "alive with texture" mandate; never collapse into "rich detail" — name specifics.

━━━ SCALE PROVER (tiny wildlife / micro element that grounds the human scale) ━━━
${scale_prover}

Render small — postage-stamp scale in the frame. Proves the intimate pocket is alive.

━━━ LIGHTING (intimate diffused / dappled / shaft-filtered — NEVER flat) ━━━
${lighting}

━━━ ATMOSPHERE (mood + air quality) ━━━
${atmosphere}${phenomenonBlock}

━━━ HARD RULE — STAND-IN-THE-POCKET MID-WIDE + LUSH MULTI-TIER + SECRET-POCKET FEEL ━━━

⚠️ STAND-IN-THE-POCKET MID-WIDE FRAMING. The viewer stands inside the secret pocket and sees the WHOLE 10-15 foot scene around them — the clearing or pond or grotto opening (fills 50-60% of frame), trees / walls / canopy surrounding it (15-25% on the sides), ground details at the near edge (10-15% at the bottom), canopy or sky-filtering above (10-15% at the top). MULTI-TIER COMPOSITION visible:
  • NEAR EDGE — ground details (moss, ferns, stones, fallen leaves) within 1-3 feet
  • MIDGROUND — the hidden-corner subject itself (the clearing, the pond, the waterfall pool) 4-10 feet away
  • BACKGROUND — surrounding trees / walls / canopy, fading into soft atmospheric depth, 10+ feet

⚠️ NOT MACRO — never extreme close-up of a single element. The whole pocket must be VISIBLE.
⚠️ NOT WIDE VISTA — never distant landscape. The pocket is enclosed by trees / walls / canopy.

EVERY surface visibly textured — moss / dew / lichen / wet stones / fern fronds / mushroom clusters / fallen petals. The feel is "I stumbled into a magical secret pocket and the whole place is alive with texture."

━━━ SCENE-WIDE PALETTE ━━━
${sharedDNA && sharedDNA.scenePalette ? sharedDNA.scenePalette : 'damp emerald moss + wet-stone slate + soft amber light + cool atmospheric depth'}

━━━ SECONDARY COLOR VIBE ━━━
${sharedDNA && sharedDNA.colorPalette ? sharedDNA.colorPalette : ''}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION DIRECTIVE — STAND-IN-THE-POCKET MID-WIDE ━━━

Mid-wide framing showing the WHOLE 10-15 foot pocket of nature. The viewer is standing inside the secret pocket. NOT macro close-up, NOT wide panoramic vista. Multi-tier depth (NEAR EDGE ground details + MIDGROUND subject + BACKGROUND surrounding trees / walls / canopy). EVERY surface alive with texture. Dappled or shaft-filtered light catching dew + wet stones + leaf edges throughout the scene. Clean, true-to-lifeintimate-nature fine-art photography, National Geographic intimate-nature feature quality.

⚠️ DO NOT render as macro close-up of one element. The whole pocket must be visible.
⚠️ DO NOT render as wide panoramic landscape. Stay inside the pocket.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO named places, NO bioluminescent / aurora / fantasy triggers, NO "fire" as a noun, NO macro close-ups, NO wide panoramic vistas.`;
  },

  EARTHBOT_COZY_BEACH: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      subject_setting,
      foreground_element,
      water_state,
      sky_layer,
      light_condition,
      phenomenon,
    } = slots;
    const phenomenonBlock = phenomenon
      ? `\n\n━━━ RARE PHENOMENON (one signature optical event woven naturally) ━━━\n${phenomenon}\n\nIf this phenomenon physically contradicts the cozy mood (storm / lightning), DROP IT.`
      : '';

    return `You are a tropical-beach photographer writing ONE INTIMATE COZY BEACH MOMENT for EarthBot. ATMOSPHERE IS THE HERO — not architecture, not a wide vista. A quiet warm pocket of a tropical beach at golden hour. Soft palm shadows raked across warm sand, scattered driftwood, a few shells in damp foreground sand, palm-shadowed pocket cove, fallen tropical petals on the sand, a hammock-shaped palm-frond silhouette over a quiet sand patch. The feel is "I want to lie down here forever." Mid-tight intimate framing. Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — INTIMATE WARM TROPICAL MOMENT, NOT VILLAGE / NOT VISTA ━━━

This is NOT a coastal village. NOT a wide-vista panorama. NOT a dramatic surf shot. This is an INTIMATE quiet cozy moment on a tropical beach — golden-hour atmosphere with intimate foreground details. The viewer should feel the warm sand and the soft breeze. Real tropical Earth — palm shadows, driftwood, soft sand textures, calm shorebreak.

━━━ ZERO HUMANS — NEVER, UNDER ANY CIRCUMSTANCES ━━━

NEVER a person, NEVER a sunbather, NEVER a footprint trail, NEVER an empty beach chair, NEVER any human or implied-human-presence element. Empty cozy paradise.

━━━ ABSOLUTELY BANNED ━━━

- NO architecture / villages / cottages / lighthouses / huts / cabanas (cozy-beach IS NOT about architecture anymore — pivot 2026-05-22)
- NO boats / docks / piers / kayaks / surfboards
- NO beach umbrellas / lounge chairs / beach towels / coolers / beach bags (human-presence implications)
- NO bonfire / fire pit (human implications)
- NO tiki torches / lanterns / paper lights
- NO humans / footprints / sandcastles
- NO wide-vista panorama (this is INTIMATE / mid-tight framing only)
- NO bioluminescent / glowing waves / sci-fi
- NO dramatic surf / crashing waves / storm waves
- NO named places
- NO single beam / single shaft (laser trigger)
- NO stylized / 3D-render / cartoony — clean true-to-life photography

━━━ THE INTIMATE BEACH SETTING (where this cozy moment happens) ━━━
${subject_setting}

━━━ FOREGROUND ELEMENT (the cozy accent in close foreground) ━━━
${foreground_element}

Driftwood / scattered shells / palm shadows / fallen tropical petals / sand patterns / sea-grass / lone tropical flower. One natural cozy element in the foreground that adds warmth and intimacy.

━━━ WATER STATE (calm soft tropical water at the shore) ━━━
${water_state}

Gentle shorebreak ripples / mirror-glass tropical lagoon / wet-sand reflection / soft tide pool. Calm and reflective — never dramatic surf.

━━━ SKY LAYER (warm cozy sky) ━━━
${sky_layer}

━━━ LIGHT CONDITION (golden-hour DOMINANT — cozy is warm always) ━━━
${light_condition}${phenomenonBlock}

━━━ HARD RULE — COZY WARM INTIMATE MOOD ━━━

Golden hour dominant. Warm amber-rose tones throughout. Soft inviting light raking across warm sand. The viewer should feel the warmth of the sand on bare feet and the soft breeze through palms. Mid to tight intimate framing — close enough to see individual shells in damp sand, palm-shadow patterns on warm-light sand, driftwood texture. Travel-postcard caliber.

━━━ MOMENT IN MOTION ━━━

Catch a SECOND in time. A single petal drifting on a soft trade-wind breeze, gentle shorebreak ripples curling at the foreground sand, a palm frond shifting overhead casting moving shadows, sand grains glittering in low warm light, a wave's foam edge spilling slowly into the sand.

━━━ SCENE-WIDE PALETTE ━━━
${sharedDNA && sharedDNA.scenePalette ? sharedDNA.scenePalette : 'warm cozy tropical beach — golden-hour amber sand + soft palm shadows + intimate foreground detail'}

━━━ SECONDARY COLOR VIBE ━━━
${sharedDNA && sharedDNA.colorPalette ? sharedDNA.colorPalette : ''}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION DIRECTIVE — INTIMATE COZY BEACH MOMENT ━━━

Mid to tight intimate framing. The intimate beach moment fills the entire frame — foreground details (driftwood / shells / palm shadows / petals) at close-camera, soft tropical water at midground, palm silhouettes / soft sky in upper frame. NEVER wide-vista panorama. Clean, true-to-lifeintimate-beach photography. Always golden-hour or soft warm light.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO named places.`;
  },
};
