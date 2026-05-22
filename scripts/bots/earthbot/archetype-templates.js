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
  EARTHBOT_EPIC_VISTA: ({ slots, sharedDNA, vibeDirective }) => {
    const { subject, lighting, atmosphere, hero_feature, sky_layer, phenomenon } = slots;
    const phenomenonBlock = phenomenon
      ? `\n\n━━━ RARE OPTICAL / WEATHER PHENOMENON (one signature real-Earth event, woven naturally into the scene) ━━━\n${phenomenon}\n\nCRITICAL — PHENOMENON-LIGHTING COMPATIBILITY: If this phenomenon physically contradicts the rolled lighting time-of-day (e.g., total eclipse corona cannot co-exist with golden hour or daylight; aurora cannot appear in midday sun; green flash only happens at the exact moment the sunset disc disappears; sun pillars/sun-dogs/halos need the sun visible so can't appear at night), DROP THE PHENOMENON entirely from the render and just render the clean lighting + sky + scene. Restrained truth beats forced impossibility every single time.`
      : '';

    return `You are a fine-art landscape photographer writing a SINGLE EPIC VISTA scene for EarthBot. The work bar: a Marc Adamus / Peter Lik / Max Rive / Daniel Kordan / Iurie Belegurschi / Albert Dros / Ryan Dyar caliber gallery-print masterpiece — extreme dramatic landscape art with theatrical peak-moment light, the kind of frame people print three feet wide and hang as the centerpiece of a room, the kind that stops a phone-scroller dead and makes them screenshot it. NOT documentary travel photography. NOT a competent travel snapshot. NOT a journalism frame. This is gallery-tier fine art — peak-drama composition, peak-drama light, peak-drama scale. Real Earth, larger than life via geology + lighting + weather amplification, never AI-fake. Output wraps with style prefix + suffix.

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
- NO stylized / 3D-render / illustrated / cartoony aesthetic — this is HYPERREAL photographic, gallery-print tier

━━━ SCENE-AS-HERO MANDATE — THE SUBJECT IS THE WOW ━━━

THE SCENE IS THE PHOTO. The vista subject DOMINATES the frame — fills 60-70%+ of the visual real estate. NO foreground prop pulled across the lower frame, NO secondary subject competing for the viewer's eye. Think gallery-print fine-art landscape: the cliff face IS the photo, the wave barrel IS the photo, the canyon IS the photo, the volcano caldera IS the photo. The scene's monumental scale + dramatic geology + theatrical peak-moment light is the entire show. Restraint on additional compositional clutter is what lets the subject HIT.

━━━ GEOLOGY WOW FACTOR — DIAL THE SCALE TO ELEVEN ━━━

The subject's geological character is the wow, and "wow" means VERTIGINOUS THEATRICAL DRAMA, not pleasant scenery. Push every dimension of its monumental scale to MAXIMUM dramatic impact. Use this drama-vocabulary explicitly in every render:

- VERTIGO-INDUCING — the cliff face plunges in a way that makes the viewer's stomach drop
- CATHEDRAL-VERTICAL — walls so steep they swallow scale
- MILE-DEEP / CONTINENT-SCALE / SKY-PIERCING — the size makes the viewer feel insignificant
- THEATRICAL / OPERATIC / EXTREME / STAGED — the scene is being framed at maximum drama
- The cliff's terrifying vertical drop into the abyss, the caldera's mile-wide gape, the dune-sea's infinite-shadow ridges receding to vanishing point, the fjord wall's cathedral-vertical plunge, the cresting wave's translucent-glass barrel, the ice-cap's continent-scale spread, the canyon's billion-year-strata depth.

The viewer's first reaction must be "look at the SIZE of that — it can't be real, but it is." NOT genteel competent scenery — render the SCALE at MAXIMUM dramatic impact, specific to the subject's actual geology. This is the SINGLE most important lever between "pretty travel photo" and "wallpaper masterpiece." Push it HARD. Theatrical wide-angle low-POV looking up at the wall. Aerial drone POV looking down into the chasm. Eye-level into the heart of the storm. Choose the most dramatic possible vantage for the rolled subject.

━━━ THE VISTA SUBJECT (the location + its core geology — the hero of the frame, fills it) ━━━
${subject}

━━━ LIGHTING (stacked light drama — render every dimension at peak) ━━━
${lighting}

━━━ STACKED LIGHT DRAMA — render every dimension at gallery-print peak intensity ━━━

The lighting above stacks 2-3 light dimensions (time + direction + color + shadow). Render ALL of them at the absolute peak of their drama, simultaneously. Not generic — the 90-second magic-window version. Color at maximum chromatic saturation, shadow at maximum depth-contrast, direction at maximum theatricality. Marc-Adamus / Peter-Lik gallery-print bar: light is THE protagonist of the frame, and every dimension is at eleven. This is the signature lever — light drama is what separates a competent travel snapshot from a wallpaper masterpiece. Push every light dimension HARD, every render.

━━━ ATMOSPHERE (render exactly as rolled — DO NOT override) ━━━
${atmosphere}

The atmosphere rolled above dictates what's in the AIR. If it says "crisp clear," render crisp clear air with sharp distance — drama comes from light stacking alone, NO godrays or volumetric beams. If it says "valley fog" or "post-rain mist" or "sea spray," godrays and atmospheric beams emerge NATURALLY where light meets the particulate — render that emergence at peak drama. The light drama is always maximum; the atmospheric quality (clear vs hazy vs misty vs spray-veiled) is dictated SOLELY by what this axis rolled. Never force volumetric beams onto clear-air rolls. Never strip atmosphere on particulate rolls.

━━━ SKY LAYER (what the sky is doing above the vista) ━━━
${sky_layer}

CRITICAL — SKY-LIGHTING COMPATIBILITY: If the sky rolled above describes a NIGHT-sky element (Milky Way / star field / clean star pinpoints / pre-dawn velvet w/ last stars / pure-night sky) AND the lighting axis rolled a DAYTIME, SUNSET, GOLDEN-HOUR, ALPENGLOW, MIDDAY, or STORM-BREAK condition (anything with the sun visible in the sky), DROP the night-sky elements. Stars and Milky Way ONLY appear in pure-night renders (post-twilight, no sun anywhere in the sky). Substitute a sky condition compatible with the rolled lighting — e.g., for sunset lighting, render the sunset sky gradient; for alpenglow, render the indigo-east-with-rose-west sky; for storm-break, render the cloud-tear with backlit clouds; for midday, render the bright cobalt zenith. STARS + SUNSET DO NOT CO-EXIST ON EARTH — render only the version compatible with the lit-sky moment. Restrained truth beats forced impossibility.

━━━ DISTANT SCALE PROVER (one TINY element in deep distance proving the subject's bigness — no foreground prop) ━━━

${hero_feature}

This is a SCALE PROVER ONLY — a marker-dot in the deep middle or far distance that gives the eye proof of the subject's monumental scale. Render it TINY (postage-stamp-sized, comma-speck, pinprick). It does NOT compete with the subject for visual attention. If it's a tree or boulder, it stays in the deep distance — never near-frame. If it's wildlife, it's a far-away silhouette. The subject is the hero; this is just the yardstick.${phenomenonBlock}

━━━ MOMENT IN MOTION — every render captures one beat of physical motion ━━━

Great landscape photographs catch a SECOND in time, not a frozen still. Every render must imply ONE specific physical motion the scene is producing RIGHT NOW: wind tearing the snow plume off a knife-edge ridge, fog pouring through the saddle, surf curl exploding at the base of the sea-stack, shelf cloud advancing across the horizon, aspen leaves shimmering in the breeze, spindrift catching the low light, waterfall mist breathing upward, banner cloud streaming from the summit, cornice on the verge of collapse, river braiding the silver delta, blowing sand racing across the dune crest, last leaves drifting from autumn aspens, a wave just curling, a glacier just calving, ground-blizzard sweeping across the plateau, dust-devil twisting across the desert floor. NOT new phenomena — physical motion the scene IMPLIES. ONE beat of motion, not five.

━━━ SCENE-WIDE PALETTE ━━━
${sharedDNA && sharedDNA.scenePalette ? sharedDNA.scenePalette : 'cinematic deeply-saturated color, hyperreal but never artificial, naturalistic Earth-pigment range'}

━━━ SECONDARY COLOR VIBE ━━━
${sharedDNA && sharedDNA.colorPalette ? sharedDNA.colorPalette : ''}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION — SUBJECT FILLS THE FRAME ━━━

Wide sweeping panoramic vista where the SUBJECT geology fills 60-70%+ of the frame's visual weight. Sky above (~25-35%), scale-prover as a tiny dot in deep distance, no near-foreground prop. The viewer's eye lands on the SUBJECT immediately, registers its scale, follows the lighting drama across it, finds the tiny scale-prover as evidence. Photographic, hyperreal, alive — Marc-Adamus / Peter-Lik / Max-Rive gallery-print caliber, the kind of frame collectors pay four figures for and people screenshot to set as wallpaper. Theatrical fine-art landscape, never documentary snapshot.

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
- NO stylized / 3D-render / cartoony — this is HYPERREAL photographic

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
${sharedDNA && sharedDNA.scenePalette ? sharedDNA.scenePalette : 'saturated tropical color, hyperreal but never artificial, turquoise water + emerald palm + saturated flower-accent'}

━━━ SECONDARY COLOR VIBE ━━━
${sharedDNA && sharedDNA.colorPalette ? sharedDNA.colorPalette : ''}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION — 50/50 BEACH + FLOWERS PARTNERSHIP ━━━

Ground-level POV. The tropical beach extends across the midground (~50% visual weight). Tropical flowers distributed through the scene as visible named-species accents (~50% visual weight). Both equally readable, neither dominating. Hyperreal photographic — Marc-Adamus / Peter-Lik / Iurie-Belegurschi caliber gallery-print tropical-paradise photography.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
  },

  EARTHBOT_REEF_PARADISE: ({ slots, sharedDNA, vibeDirective }) => {
    const { bay_setting, shoreline_drama, water_quality, sky_drama, composition, foreground_element } = slots;
    const foregroundBlock = foreground_element
      ? `\n\n━━━ FOREGROUND ELEMENT (one accent close to camera) ━━━\n${foreground_element}\n\nOne natural foreground accent close to camera that adds depth without dominating — palm fronds arching in, lava rocks at frame-edge, a hibiscus branch, a tiny silhouette far in the distance. Soft-focus / out-of-focus, never sharp competing detail.`
      : '';

    return `You are a travel photographer writing ONE PRETTY ISLAND-BAY scene for EarthBot. A dramatic tropical island bay viewed at WATERLINE level — crystal turquoise water in the foreground, dramatic shoreline rising above (volcanic ridges, palm-fringed cliffs, lush jungle slopes), sun-burst clouds in a tropical sky. Gallery-print travel-postcard caliber. Output wraps with style prefix + suffix.

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
- NO stylized / 3D-render / cartoony — HYPERREAL photographic

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

This frame should make someone want to BOOK A FLIGHT. Gallery-print travel-photography caliber.

━━━ MOMENT IN MOTION ━━━

Catch a SECOND in time. Gentle ripples, sun-rays shafting through a cloud gap, palm fronds shifting in trade-wind breeze.

━━━ SCENE-WIDE PALETTE ━━━
${sharedDNA && sharedDNA.scenePalette ? sharedDNA.scenePalette : 'turquoise tropical bay water + dramatic shoreline + brilliant tropical sky'}

━━━ SECONDARY COLOR VIBE ━━━
${sharedDNA && sharedDNA.colorPalette ? sharedDNA.colorPalette : ''}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION DIRECTIVE ━━━

Water (or waterline) fills lower 40-50%. Shoreline + sky fill upper 50-60%. Hyperreal travel photography — generic descriptors only, no named places.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO named places.`;
  },

  EARTHBOT_GEOLOGICAL_WONDER: ({ slots, sharedDNA, vibeDirective }) => {
    const { subject, lighting, atmosphere, mineral_color, focal_anchor, phenomenon } = slots;
    const phenomenonBlock = phenomenon
      ? `\n\n━━━ RARE PHENOMENON (one signature optical/weather event) ━━━\n${phenomenon}\n\nIf this phenomenon physically contradicts the rolled lighting or subject, DROP IT.`
      : '';

    return `You are a geological photographer writing ONE GEOLOGICAL WONDER scene for EarthBot. Earth's raw architecture as art — covers BOTH scales: INTIMATE cave interiors (crystal caves with amethyst walls / lava tubes / glacier ice caves / slot canyons with light beams / amethyst geode cathedrals) AND EPIC outdoor vistas (hoodoo amphitheaters / salt flats / basalt cliff coastlines / sandstone wave formations / travertine terraces / fresh lava flows / geyser fields). The geology itself is spectacular and alien. Marc Adamus / Peter Lik / Michael Kenna caliber gallery-print geological photography. Output wraps with style prefix + suffix.

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
- NO stylized / 3D-render / cartoony — this is HYPERREAL photographic
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

━━━ HARD RULE — POSTER-WORTHY GALLERY-PRINT GEOLOGY ━━━

This frame must be a 10/10 poster-print. Marc Adamus / Peter Lik / Iurie Belegurschi / Michael Kenna caliber.

━━━ MOMENT IN MOTION ━━━

Catch a SECOND in time. Mist swirling through a cave, steam billowing from a geyser, water trickling down travertine, a single icicle drip falling.

━━━ SCENE-WIDE PALETTE ━━━
${sharedDNA && sharedDNA.scenePalette ? sharedDNA.scenePalette : 'saturated mineral color, dramatic light, atmospheric depth, focal anchor for scale'}

━━━ SECONDARY COLOR VIBE ━━━
${sharedDNA && sharedDNA.colorPalette ? sharedDNA.colorPalette : ''}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION DIRECTIVE ━━━

The geological subject dominates 60-70% of the frame. Hyperreal photographic — gallery-print geological-photography caliber.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO named places.`;
  },

  EARTHBOT_SACRED_LIGHT: ({ slots, sharedDNA, vibeDirective }) => {
    const { subject, lighting, atmosphere, hero_feature, sky_layer, phenomenon } = slots;
    const phenomenonBlock = phenomenon
      ? `\n\n━━━ RARE PHENOMENON (one signature optical/weather event woven naturally) ━━━\n${phenomenon}\n\nIf this phenomenon physically contradicts the rolled lighting or subject, DROP IT.`
      : '';

    return `You are a fine-art landscape photographer writing ONE SACRED-LIGHT MOMENT scene for EarthBot. Transcendent natural-light moments in nature — the LIGHT itself is the hero. Dawn first-light burning a single ridge while valleys remain in cool shadow, raking shafts plural through old-growth canopy, alpenglow on a snow-capped peak, storm-break broad spotlight across a meadow, crepuscular rays through cypress over a misty lake, sun-halo over winter forest. Mid to tight framing — NOT wide panorama. The light moment fills the emotional center; the landscape supports it. Marc Adamus / Peter Lik / Galen Rowell caliber gallery-print sacred-light photography. Output wraps with style prefix + suffix.

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

Mist, dust beams in light, faint haze layering, crystal-clear air. The atmosphere makes the light visible — without it, light is invisible.

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

The light moment fills the emotional center of the frame. Mid to tight framing — NOT wide panorama. Surrounding landscape sits in cool shadow / cool tones, the lit area glows with warm contrasting saturation. Hyperreal photographic — Galen Rowell / Marc Adamus caliber gallery-print sacred-light photography.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO named places.`;
  },

  EARTHBOT_BEACH_NIGHT: ({ slots, sharedDNA, vibeDirective }) => {
    const { subject, light_source, night_sky, water_state, shoreline_element, phenomenon } = slots;
    const phenomenonBlock = phenomenon
      ? `\n\n━━━ RARE PHENOMENON (one signature night-sky event) ━━━\n${phenomenon}\n\nIf this phenomenon physically contradicts the rolled light_source (moonbow needs moisture, etc), DROP IT.`
      : '';

    return `You are a night-sky photographer writing ONE TROPICAL BEACH NIGHT scene for EarthBot. Magical warm tropical beach scenes at night — moonlit water, silver Milky Way overhead, calm reflective tropical surf, palm silhouettes. The NATURAL light source (moon / stars / Milky Way) is the hero. Awe-inspiring, warm, intimate — NEVER cold ominous night. Marc Adamus / Galen Rowell caliber gallery-print tropical-night photography. Output wraps with style prefix + suffix.

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
- NO stylized / 3D-render / cartoony — HYPERREAL photographic

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

This is a MAGICAL warm tropical night — the kind of beach scene that feels like vacation paradise after dark. NOT a horror beach. NOT a stormy beach. NOT a cold beach. The warmth of trade-winds, the calm of tropical surf, the awe of a Milky Way overhead. Gallery-print travel-photography at night caliber.

━━━ MOMENT IN MOTION — every render captures one beat of physical motion ━━━

Catch a SECOND in time. Gentle surf rippling at the foreground sand, palm fronds shifting in trade-wind breeze, a thin band of silver light on the water surface, a faint shimmer in the wet sand from moonlight, a single small wave breaking softly.

━━━ SCENE-WIDE PALETTE ━━━
${sharedDNA && sharedDNA.scenePalette ? sharedDNA.scenePalette : 'silver moonlit tropical night, cool blue + silver tones, warm tropical mood'}

━━━ SECONDARY COLOR VIBE ━━━
${sharedDNA && sharedDNA.colorPalette ? sharedDNA.colorPalette : ''}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION DIRECTIVE — TROPICAL BEACH NIGHT POSTCARD ━━━

Mid to tight framing. The light source (moon, stars, or Milky Way) fills the upper third / half. The tropical beach extends below. Reflective water carries the light source. Hyperreal photographic — gallery-print tropical-night travel photography.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO named places.`;
  },

  EARTHBOT_WAVES: ({ slots, sharedDNA, vibeDirective }) => {
    const { wave_subject, composition, coastal_context, water_color, sky_layer, light_condition, phenomenon } = slots;
    const phenomenonBlock = phenomenon
      ? `\n\n━━━ RARE PHENOMENON (one signature optical event woven naturally) ━━━\n${phenomenon}\n\nIf this phenomenon physically contradicts the rolled lighting or subject, DROP IT.`
      : '';

    return `You are an ocean photographer writing ONE WAVE scene for EarthBot. Real ocean wave drama — Clark-Little intimate translucent-barrel through monumental big-wave breaking on tropical reef. The wave IS the hero. Real ocean physics: waves come from the open ocean and break TOWARD shore on shallow reefs, cliffs, points — never walls of water sitting on flat sand. Tropical paradise setting. Gallery-print surf-photography caliber. Output wraps with style prefix + suffix.

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
- NO stylized / 3D-render / cartoony — HYPERREAL photographic

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

The wave fills 50-70% of the frame. Coastal context + water color + sky support the wave drama. Real ocean physics throughout — waves coming from open ocean, breaking on shallow obstacles, spray and foam realistic. Gallery-print surf-photography caliber.

━━━ MOMENT IN MOTION — every render captures one beat of physical motion ━━━

Catch a SECOND in time. Spray rocketing off the wave's lip mid-explosion, water curling mid-barrel-formation, foam churning at the reef-break, a single droplet caught mid-flight, the wave at the precise peak of crest before collapse.

━━━ SCENE-WIDE PALETTE ━━━
${sharedDNA && sharedDNA.scenePalette ? sharedDNA.scenePalette : 'real-ocean wave color, tropical paradise context, dramatic spray + light interaction'}

━━━ SECONDARY COLOR VIBE ━━━
${sharedDNA && sharedDNA.colorPalette ? sharedDNA.colorPalette : ''}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION DIRECTIVE — SURF PHOTOGRAPHY POSTCARD ━━━

The wave fills 50-70% of the frame. Coastal context + tropical setting fill the surrounding 30-50%. Sky drama above. Hyperreal photographic — gallery-print surf photography caliber.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO named places.`;
  },

  EARTHBOT_SEASONAL_SHIFT: ({ slots, sharedDNA, vibeDirective }) => {
    const { subject, color_palette, depth_layers, seasonal_motion, lighting, atmosphere, hero_feature, sky_layer, phenomenon } = slots;
    const phenomenonBlock = phenomenon
      ? `\n\n━━━ RARE PHENOMENON (one signature optical event) ━━━\n${phenomenon}\n\nIf this phenomenon physically contradicts the rolled season or lighting, DROP IT.`
      : '';

    return `You are a fine-art nature photographer writing ONE SEASONAL-SHIFT scene for EarthBot. Real-Earth landscape captured at the peak dramatic moment of a season — wall-to-wall multi-color autumn density across mixed forests, first snow with lingering color on alpine valleys, cherry-blossom + wildflower spring superbloom richness, golden summer evenings. THE SEASON IS THE SUBJECT, MULTI-COLOR RICHNESS is mandatory, and DENSITY IS TURNED TO 11 — every branch, every meadow, every slope packed with peak color edge-to-edge. Marc Adamus / Peter Lik / Daniel Kordan / Galen Rowell caliber gallery-print seasonal photography — National Geographic cover quality, the kind of frame people print and hang. Output wraps with style prefix + suffix.

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
- NO stylized / 3D-render / cartoony — HYPERREAL photographic
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

The viewer should feel the season in their bones. ALL named colors from the color_palette must be visible in the render — NEVER mono-tone. Multi-tier depth (FG/MG/distant) per the depth_layers axis. One captured moment per the seasonal_motion axis. Marc Adamus / Peter Lik / Daniel Kordan caliber gallery-print seasonal photography.

━━━ SCENE-WIDE PALETTE ━━━
${sharedDNA && sharedDNA.scenePalette ? sharedDNA.scenePalette : 'peak-saturation seasonal multi-color, dramatic light, atmospheric depth'}

━━━ SECONDARY COLOR VIBE ━━━
${sharedDNA && sharedDNA.colorPalette ? sharedDNA.colorPalette : ''}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ TOWERING TREES / NAMED SPECIES MANDATE ━━━

⚠️ The autumn rendered scene must show ACTUAL DECIDUOUS FOREST — towering / mature trees with visible trunks rising into the canopy, NOT orange shrubs on rocks, NOT scrub on cliffs. Use phrases like: "towering mixed deciduous canopy", "mature sugar-maple + scarlet-oak + yellow-birch + paperbark-birch trunks rising", "tall trunks anchoring the midground", "dense mature canopy".

⚠️ NAME SPECIFIC TREE / FLOWER SPECIES — never generic "mixed forest" alone. Autumn output must name 3-5 species visible as distinct groves: e.g. "golden-yellow paperbark birch sections + scarlet sugar-maple groves + crimson red-oak clusters + amber quaking-aspen stands + lingering dark hemlock columns". Spring output must name 3-5 species: e.g. "pink cherry-blossom canopy + white flowering-dogwood + magenta redbud + cream magnolia + understory of trillium + Virginia bluebell + dame's-rocket".

━━━ DENSITY MANDATE — TURN IT TO 11 ━━━

⚠️ DENSITY IS THE PATH'S SIGNATURE. NO sparse / open / scattered / minimal / patchy / empty / negative-space language. Use density-positive phrasing: "packed wall-to-wall", "every branch carrying peak color", "edge-to-edge", "no gaps in the canopy", "carpet-thick", "shoulder-to-shoulder bloom", "saturated mass", "dense unbroken canopy", "drenched in color".

⚠️ BANNED WORD — "fire" as a NOUN (renders literal flames on mountainsides). Forbidden: "on fire", "fall fire", "peak fire", "fire color", "fire-mosaic", "fire-blanket", "trees on fire". Use SAFE high-energy alternatives: "peak color saturation", "drenched in color", "blazing color" (adj OK), "saturated peak foliage", "color explosion", "ABLAZE with color" (adj OK), "riot of color".

⚠️ BANNED — orange-shrubs-on-rocks rendering. Never use "low shrubs" / "scrub" / "low autumn vegetation" / "rocky cliffs as dominant frame element" / "canyon walls" as the dominant frame. The frame is FOREST-dominant.

━━━ CINEMATIC LIGHT + COLOR GRADE — MANDATORY ━━━

Every render MUST land cinematic light drama, not flat overcast lighting. Required elements:

• HARD DIRECTIONAL LIGHT — low-angle golden-hour or sunset rake catching every trunk-edge and leaf-mass, hard punched shadows beneath every trunk at peak chromatic saturation, NOT flat overcast.
• ATMOSPHERIC HAZE — teal-cooled depth in the far distance, atmospheric perspective separating midground from distant ridge, mist + light interaction in valleys.
• TEAL-AND-ORANGE CINEMATIC SPLIT — warm orange-amber-crimson saturation in foreground/midground + teal-cooled atmospheric depth in the far distance. Hollywood color-grade.
• SCALE PROVER — one tiny element in the distance proves the scale: a hawk hovering as a comma-speck silhouette, a tiny lake reflecting the canopy, a small clearing, a distant ridge tooth catching alpenglow. Render small (postage-stamp scale) to make the forest feel VAST.

━━━ COMPOSITION DIRECTIVE — WIDE FORESTED LANDSCAPE (DEFAULT) ━━━

⚠️ THIS PATH IS WIDE-VISTA-FIRST AND FOREST-DOMINANT. Unless the subject explicitly says "intimate close-up" / "forest interior" / "looking up" / "close-camera", render this as a WIDE PANORAMIC LANDSCAPE dominated by MATURE FOREST — towering canopy filling 60-75% of the frame, sky 15-25%, foreground anchor 10-15%.

For AUTUMN: the rendered output MUST read as "a mature forested hillside drenched edge-to-edge in peak color, every species at maximum saturation, named groves visible across the wide frame." Render every named species in the palette as a distinct dense grove: yellow birch sections, scarlet maple sections, crimson oak sections, amber aspen sections, lingering green conifer columns. NOT orange shrubs on rocks.

For SPRING: the rendered output MUST read as "a mature flowering forest hillside + wildflower SUPERBLOOM understory, named groves visible across the wide frame." Render every named flower species as a distinct dense patch/carpet.

━━━ WOW FACTOR — GALLERY-PRINT BANGER ━━━

This must be a render people frame and hang. National Geographic cover. Marc Adamus / Peter Lik / Daniel Kordan / Galen Rowell caliber gallery-print fine-art photography. Every frame is a poster-worthy banger with hard cinematic light, atmospheric depth, teal-and-orange grade, scale-prover, named species.

Multi-tier depth (foreground anchor + midground forest + distant peaks/horizon) is mandatory. Hyperreal photographic. ALL named colors visible across the wide scene.

DO NOT default to close-camera / intimate / foreground-focused framing unless the subject explicitly demands it. Wide forest-dominant vista is the default.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO named places, NO "fire" as a noun, NO "shrubs" / "scrub" as dominant element.`;
  },

  EARTHBOT_COZY_BEACH: ({ slots, sharedDNA, vibeDirective }) => {
    const { subject_setting, foreground_element, water_state, sky_layer, light_condition, phenomenon } = slots;
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
- NO stylized / 3D-render / cartoony — HYPERREAL photographic

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

Mid to tight intimate framing. The intimate beach moment fills the entire frame — foreground details (driftwood / shells / palm shadows / petals) at close-camera, soft tropical water at midground, palm silhouettes / soft sky in upper frame. NEVER wide-vista panorama. Hyperreal photographic — gallery-print intimate-beach photography. Always golden-hour or soft warm light.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO named places.`;
  },
};
