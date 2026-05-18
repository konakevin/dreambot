/**
 * Brief templates per archetype. Each template is a function that takes
 * the rolled slots + sharedDNA + vibeDirective and produces the final
 * brief string sent to Sonnet for polish.
 *
 * Templates are extracted from the corresponding finished path files
 * (not invented). Migration parity check: composer + this template
 * should produce the same brief text as the legacy path file's output.
 */

const TEMPLATES = {
  SPACE_OPERA: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      story_beat,
      anchor_scale,
      composition_frame,
      scale_provers,
      weather_particulate,
      emotional_dna,
      lighting,
      sky_layer,
      surprise_element,
      ship,
      setting,
      ship_action,
      traffic,
      battle,
      _conditionalFired,
    } = slots;

    const wideActionSection = _conditionalFired
      ? `
━━━ WIDE-ACTION MODE — MULTI-SHIP SCENE ━━━
The frame is a CHAOTIC ACTION SCENE with multiple ships at varied depths, motion, weapons firing, missile contrails streaking, plasma engines blazing. Not a quiet hero portrait — a busy fleet engagement / traffic chaos / battle.

━━━ OTHER SHIPS IN THE SCENE (3 must be visibly rendered) ━━━
- ${traffic[0]}
- ${traffic[1]}
- ${traffic[2]}

━━━ COMBAT / ACTION MOMENTS (3 must be visibly rendered) ━━━
- ${battle[0]}
- ${battle[1]}
- ${battle[2]}

`
      : `
━━━ CLOSE-UP HERO MODE — SHIP AS THE SHOW ━━━
The frame is a CINEMATIC HERO SHOT of the featured ship. Scale-proving figures or smaller craft visible nearby. Hull detail readable — paneling, gantries, antennas, weathering, lived-in complexity. Like a poster shot.

`;

    return `You are a sci-fi concept-art painter writing a SINGLE CINEMATIC FRAME of a spaceship scene for StarBot. The ship is the ANCHOR ENTITY at MEDIUM-LARGE scale, set in a sci-fi environment with multi-tier depth. Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — SHIP AS HERO ━━━
The featured spaceship is the SUBJECT at MEDIUM-LARGE anchor scale (25-50% of frame). Hull detail clearly readable — paneling, weapon mounts, engine glow, weathering, sci-fi industrial complexity. NOT a tiny silhouette in a vast environment.

━━━ NON-NEGOTIABLE — MULTI-TIER DEPTH ━━━
Foreground: tactile detail near the ship (debris / smaller craft / hull surface). Midground: the FEATURED SHIP, dominant. Deep distance: setting + cosmic anchors receding into atmospheric haze.
${wideActionSection}
━━━ THE STORY MOMENT — what's happening in this frame ━━━
${story_beat}

━━━ THE FEATURED SHIP (anchor entity at MEDIUM-LARGE scale) ━━━
${ship}

━━━ THE SHIP'S ACTION (posture / state / motion) ━━━
${ship_action}

━━━ THE SETTING (sci-fi environment wrapping the ship) ━━━
${setting}

━━━ SKY OVERHEAD / COSMIC LAYER ━━━
${sky_layer}

━━━ ANCHOR SCALE ━━━
${anchor_scale}

━━━ COMPOSITION FRAME ━━━
${composition_frame}

━━━ LIGHTING ━━━
${lighting}

━━━ WEATHER / PARTICULATE ━━━
${weather_particulate}

━━━ SCALE PROVERS — include ALL THREE visibly in the scene ━━━
- ${scale_provers[0]}
- ${scale_provers[1]}
- ${scale_provers[2]}

━━━ EMOTIONAL DNA ━━━
${emotional_dna}

━━━ SURPRISE ELEMENT — secondary subject woven into the scene ━━━
${surprise_element}

━━━ FORBIDDEN ━━━
- NO biomech / tentacled / organic creature ships (no octopus / squid / spider / chitin / kraken)
- NO modern naval / US-navy / WWII / army-coded aesthetic
- NO planetary architecture rendered as the ship
- NO franchise proper nouns (Millennium Falcon / Normandy / Star Destroyer / etc. — inspired by, not literal)
- NO static empty frame — multi-tier depth + scale provers + setting always present

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — CRITICAL ━━━
Write ONE LONG DENSE FLOWING comma-separated composition. Do NOT separate elements into sections or bullet points — every axis above must be WOVEN INTO the single flowing scene description with SPECIFIC NUMBERS and COUNTS naming each element.

Reference for the density target — this is what a good scene description looks like:
"6.1-kilometer ceramic-white teardrop Banks-Culture vessel, 200+ micro-drones spiraling from 95-meter tender like glowing fireflies, 22 octagonal defense satellites in spherical formation, four angular 180-meter picket ships in diamond formation, twenty 6-meter navigation beacons strobing amber, cosmic graveyard of massive capital hulks with catastrophic breaches"

Every entry you pull from the axes above must be NAMED IN THE PROMPT with a count, color, scale, or position. The other ships / scale provers / surprise element MUST appear by name with concrete counts in the scene. NOT "a fleet visible" — "twelve 80m supply ships parallel-running" / "200+ EVA workers tethered" / "a kilometer-class capital silhouette receding into haze". Sonnet writes ONE flowing 130-150 word enumeration.

Output ONLY the raw 130-150 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the scene content.`;
  },

  MEGASTRUCTURE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      story_beat,
      composition_frame,
      scale_provers,
      weather_particulate,
      emotional_dna,
      lighting,
      sky_layer,
      surprise_element,
      anchor_entity,
      setting,
      drama,
      deep_distance,
    } = slots;

    const dramaSection = drama
      ? `
━━━ DRAMA MOMENT — a city-wide event woven through the scene ━━━
${drama}

This drama is something happening ACROSS the city, NOT concentrated on the featured landmark. The featured building does NOT emit, radiate, or generate the drama — the drama is environmental / atmospheric / city-spanning. If the drama implies an action source, place it AWAY from the featured landmark.

`
      : '';

    return `You are writing an EPIC CYBERPUNK ANIME MEGACITY keyframe for StarBot — a vast impressive sci-fi city with one notable landmark visible among many cool buildings. Anime cinematic illustration. Output wraps with style prefix + suffix.

━━━ CORE PROMPT DNA (weave these phrases into the polished output) ━━━
"epic futuristic cyberpunk megacity, anime cinematic keyframe illustration, ultra-detailed skyline stretching endlessly into the horizon, towering neon skyscrapers stacked in vertical layers, glowing holographic billboards, dense glowing abstract pictogram signage and geometric alien glyphs, rain-soaked or steam-soaked streets reflecting neon light, flying cars and hovering taxi traffic streams, illuminated skybridges connecting buildings, massive industrial pipes and ventilation systems, rooftop markets and crowded alleyways, glowing windows everywhere, thousands of tiny lights, atmospheric fog and steam rising between buildings, volumetric light beams, vibrant neon color palette (magenta, cyan, electric blue, purple, gold), extreme detail saturation, bustling city life, tiny dark figures of people on balconies, distant megastructures disappearing into haze, sharp anime linework, rich shading, high contrast lighting, dramatic anime lighting, masterpiece quality, insanely detailed, no blur, no empty areas, every surface covered in detail."

These are MANDATORY core descriptors. The Sonnet polish must include language matching these themes throughout the prompt.

━━━ THE SUBJECT IS A VAST IMPRESSIVE CYBERPUNK CITY — NON-NEGOTIABLE ━━━
The CITY itself is the hero — a sprawling, dense, ALIVE alien-cyberpunk megacity that feels overwhelming in scope. Multiple impressive buildings throughout the frame, each at different distances, each contributing to a UNIFIED sense of "this city is incredible." NOT a single weird centered building dominating the frame.

━━━ THE FEATURED LANDMARK (one building among many) ━━━
${setting}

This is ONE notable building in the city — not THE subject, but A LANDMARK. It should be visible and recognizable, occupying ~15-25% of the frame at most. The city around it is equally impressive — multiple OTHER cool towers / habitat blocks / megabuildings at different distances, each carrying their own character. NEVER let the featured landmark visually dominate as a singular weird structure. It is one cool building in a city of cool buildings.

━━━ THE CITY AROUND IT IS THE BACKDROP — OVERWHELMING DETAIL REQUIRED ━━━
The featured building does NOT exist alone. The frame is PACKED with surrounding city detail — the city is as much the atmospheric hero as the featured building. NEVER an isolated building in fog.

Explicit minimum requirements visible in the frame:
- **AT LEAST 8-12 supporting towers / buildings** of varying heights surrounding and behind the featured building, at multiple distances (some close, some receding into atmospheric haze)
- **AT LEAST 4-6 flying vehicles / drones / ships** streaking between buildings at different elevations (commuter craft, freight, hovercars, taxi drones)
- **AT LEAST 3-5 multi-tier skybridges / connecting walkways** visible between buildings, populated with tiny shadowed pedestrian figures
- **AT LEAST 5-10 holographic billboards / signage / projected logos / AR overlays** flickering on building faces (alien glyphs, animated propaganda, advertising)
- **Hundreds of pinprick lit windows** speckling EVERY visible tower face — read as honey-grain across the whole frame
- **Atmospheric haze bands** at multiple altitudes separating depth layers
- **Distant city skyline** extending to horizon behind/beyond the featured building — never a clean sky background
- **Street-level or low-level activity** if visible: traffic / pedestrians / crowds / vendors / steam vents / spotlight beams

REFERENCE FEEL: looking out from a high apartment window in a Coruscant-class megacity or Akira's Neo-Tokyo. The featured building is the eye-catch but the BEEHIVE of city activity around it is what sells the scale. Hundreds of lights, dozens of towers, flying traffic at every layer.

THE COMMON FAILURE: rendering the featured building "isolated in fog" with vague background haze. This is FORBIDDEN. The city detail must be DENSE and EVERYWHERE.

━━━ TIME OF DAY — pick from the lighting axis below; vary across renders ━━━
The lighting axis defines mood (golden hour / midday / dusk / night neon / dawn / rain-soaked / overcast / etc.). Honor it. Different renders should land at different times of day so the path doesn't feel monotonous.

━━━ THE STORY MOMENT — what's happening near or to the building ━━━
${story_beat}
${dramaSection}
━━━ SKY OVERHEAD ━━━
${sky_layer}

━━━ CAMERA POSITION — NON-NEGOTIABLE ━━━
The camera is ALWAYS INSIDE the city, SURROUNDED BY BUILDINGS AND ACTIVITY on every side. Wider framing preferred — show MORE of the surrounding city in every shot. Pick ONE:
(A) **STREET-CANYON VIEW down a wide boulevard** — camera at street/plaza level looking down a wide neon-soaked avenue between rows of towers receding into atmospheric haze. Buildings line BOTH sides of the frame. Flying traffic at multiple elevations. Multi-tier skybridges crossing overhead. Pedestrians and vendors at street level. The featured building is one prominent tower visible mid-distance along the canyon, NOT framing the whole shot.
(B) **PLAZA / INTERSECTION OVERLOOK** — camera at a wide plaza, square, or major intersection at ground level OR low rooftop. The featured building visible across the plaza as one landmark. Multiple OTHER towers surround on all sides forming a 360° wall of city. Hundreds of windows, signage, flying traffic crossing the plaza overhead.
(C) **SKYBRIDGE / TERRACE CROSS-SECTION** — camera on a wide skybridge / terrace / pedestrian bridge at mid-elevation (100-300m), facing ACROSS the city. Buildings rise on left, right, and behind the camera; in front, the city extends through atmospheric haze with the featured building one of many towers in middle distance. Flying vehicles passing AT the camera's level + above + below. NEVER an isolated tower-vs-sky shot.

━━━ MANDATORY FOREGROUND CITY ELEMENTS — THIS IS HOW WE PROVE THE VIEWER IS INSIDE ━━━
The IMMEDIATE FOREGROUND of the frame MUST contain CITY ELEMENTS that put the viewer physically INSIDE the city, NOT floating outside. Required: pick AT LEAST 2 of these in the foreground (close to camera):
- The EDGE of the adjacent building the camera is on — a balcony railing / window frame / rooftop ledge / skybridge guardrail / cracked-tile floor
- Vegetation in the foreground — a hanging vine spilling off the balcony / potted xeno-plants / cracked-asphalt weed / overgrown rooftop garden bordering the shot
- Single-figure or scattered-pedestrian figures in the foreground — a lone shadowed figure leaning on a railing / pedestrians walking past at distance / a vendor stall / small dark figures dwarfed by the view. NEVER a romantic couple, NEVER two paired figures — solo figure or scattered crowd only.
- Tower bases or walls FRAMING the shot left/right — corners of two flanking buildings cropped at the edges of the frame, with the featured building visible BETWEEN them
- Adjacent building's signage / pipes / antennas / cables intruding into the foreground (one building's lit window-grid right at the edge of frame)
- Flying vehicles / drones / ships PASSING THROUGH the foreground — close enough to read as full vehicles, not distant dots
- Cables / power lines / hanging holographic banners stretching across the foreground at camera level

The foreground tells the viewer's eye "you are standing here, in this place, in this city" — not "you are looking at a postcard from outside." This is the SINGLE MOST IMPORTANT compositional rule for this archetype.

REFERENCE FEEL: like opening a hotel-room window in a Coruscant megacity and looking out — your hand is on the windowsill, a vine hangs from the planter beside you, the neighbor's building wall cuts off your left view, a hover-taxi whooshes past at your eye level, and across the gap rises the featured building. THAT is the camera position.

FORBIDDEN camera positions:
- Aerial / overhead / bird's-eye / orbital views
- Wide vista showing city skyline from outside
- Establishing shots from a distance / mountain / hilltop
- Camera level above the buildings looking down
- Camera floating in open sky away from the city
- FEATURED BUILDING ISOLATED IN FOG/CLOUDS WITHOUT FOREGROUND CITY ELEMENTS — this is the most common failure and the WORST one. Empty foreground = render fails.

The viewer is INSIDE the city, immersed. Looking up from the street, or peering across from another high-rise — never floating above or outside.

━━━ COMPOSITION FRAME ━━━
${composition_frame}

Honor the composition frame ONLY to the extent it works with street-level-up OR mid-elevation-across camera. If the composition rolls suggest aerial / overhead / wide-vista — REINTERPRET as the closest street-level or across-from-building equivalent.

━━━ LIGHTING ━━━
${lighting}

If lighting language pulls strongly toward one time of day (golden hour, night, etc.), commit fully — render the entire scene at that time of day for atmospheric coherence.

━━━ WEATHER / PARTICULATE ━━━
${weather_particulate}

━━━ SCALE PROVERS — include ALL THREE visibly throughout the scene ━━━
- ${scale_provers[0]}
- ${scale_provers[1]}
- ${scale_provers[2]}

━━━ EMOTIONAL DNA ━━━
${emotional_dna}

━━━ SURPRISE ELEMENT — woven into the city for added story interest ━━━
${surprise_element}

Place at midground in the bustling city around the featured building.

━━━ DEEP-DISTANCE SIGNATURE — visible at the FAR horizon behind the city ━━━
${deep_distance}

This is the far-back layer punching up depth — render it visibly behind/beyond the featured building.

━━━ FORBIDDEN ━━━
- NO aerial / overhead / orbital / wide-skyline-from-outside camera positions — camera is INSIDE the city
- NO megastructure / orbital ring / Dyson swarm / planetary mantle / space elevator — that was the old archetype direction. This path is ICONIC BUILDING IN CYBERPUNK CITY.
- NO empty isolated building floating in fog without surrounding city
- NO static lifeless diorama — the city must be ALIVE with traffic, lights, signage, motion
- NO portrait composition / character closeup — the building is subject
- NO featured-character foreground figure — pedestrians + crowds are part of the city activity, never single foreground subject
- NO romantic couples / paired figures / "lovers on balcony" — these read as character-romance not cyberpunk-city. Single shadowed figures or scattered crowds only.
- NO use of the word "silhouette" in the prompt — it pulls Flux toward feminine curves AND cylindrical column shapes. Use "shadowed figure" / "tiny dark figure" / "small dark form" / "pedestrian" / "person" instead.
- NO franchise proper nouns (Blade Runner / Tyrell / Coruscant / Arasaka — INSPIRED BY, not literal)
- NO low detail / minimalism / empty streets / bland lighting / soft pastel / washed-out colors / low contrast / blurry / foggy blur / simple buildings / flat shading / chibi / realistic-photo / dull colors / boring skyline / empty areas
- NO REALISTIC PHOTO aesthetic — this path is ANIME ILLUSTRATION (sharp linework, rich shading, high contrast)

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write 100-130 words IN THIS ORDER ━━━
1. **OPEN with the FOREGROUND city anchor** — the railing / balcony / vegetation / adjacent-tower-edge / shadowed pedestrian / vehicle-passing that puts the camera physically inside the city. First 15 words. This is the viewer's "I am standing here" moment.
2. **Camera viewpoint** — second clause names the perspective: "viewed from skybridge at 200m elevation" / "looking up from neon-lit plaza" / "from adjacent building's balcony" / etc.
3. **The featured building visible THROUGH the foreground frame** — distinctive design / lighting / hologram / signage. The building is what the viewer SEES from their perch, not what dominates the frame independently.
4. **The DENSE surrounding city** with explicit numeric counts — "12 towers stacked deep into haze" / "six hovercars streaking past" / "four skywalks with tiny dark pedestrians" / "nine holographic billboards in alien glyphs" / "hundreds of lit windows speckling every face".
5. **Atmospheric depth + time-of-day** from lighting axis + ONE small narrative beat woven in.

The foreground anchor is the FIRST thing written. The building is mentioned AFTER. The city's specific element counts are explicit. This ordering is non-negotiable — if the building opens the prompt, REWRITE with the foreground anchor first.

Cranked atmospheric depth, photoreal cinematic finish.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**. Just the scene content.`;
  },

  OUTDOOR_CITY: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      story_beat,
      anchor_scale,
      composition_frame,
      scale_provers,
      weather_particulate,
      emotional_dna,
      lighting,
      anchor_entity,
      sky_layer,
      surprise_element,
      setting,
      drama,
      deep_distance,
    } = slots;

    const dramaSection = drama
      ? `
━━━ DRAMA MOMENT — render this visibly active in the city ━━━
${drama}

The drama is the MOMENT — a specific event unfolding within the city's daily life. The city continues around it; the drama is one striking layer woven into the busy metropolis.

`
      : '';

    return `You are a sci-fi cinematographer writing a SINGLE CINEMATIC FRAME of a vast alien city for StarBot. The city is the HERO; the anchor entity proves the scale. Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — VAST CITY DOMINATES THE FRAME ━━━
The city fills 80%+ of the frame. Multi-tier vertical density — buildings stacked on bridges stacked on towers, at least 4 visible elevation levels. Hundreds of lit windows / signs / details. The anchor entity is a small element that proves the scale, not the subject.

━━━ NON-NEGOTIABLE — NEVER A SINGLE HERO BUILDING ━━━
The city is a CIVILIZATION — dozens of supporting structures, multiple towers, bridges between, smaller buildings clustered at the base of taller ones. Never an isolated single tower in haze.

━━━ THE STORY MOMENT — what's happening in this frame ━━━
${story_beat}
${dramaSection}
━━━ THE CITY ━━━
${setting}

Render with multi-tier vertical density. Foreground: tactile detail near the camera (terrace edge / antenna array / cable / rooftop garden). Midground: city body with hundreds of windows, multiple towers, bridges connecting at various heights, traffic between. Deep distance: the city's signature anchor (largest tower / spire / megastructure) looming through atmospheric haze. Sky: ${sky_layer}.

━━━ THE ANCHOR ENTITY — in the city at the prescribed scale ━━━
${anchor_entity}

━━━ ANCHOR SCALE — how big the entity is ━━━
${anchor_scale}

The entity is a SILHOUETTE — back-turned or in profile — at midground or deep midground. NEVER a foreground centered figure.

━━━ COMPOSITION FRAME ━━━
${composition_frame}

━━━ INSIDE THE CITY, ALIVE WITH ACTIVITY — NON-NEGOTIABLE ━━━
The frame is INSIDE the city — wide-angle views looking DOWN a busy avenue, looking UP between towers, on a balcony or skybridge overlooking the throng, in a busy market plaza, in a transport hub. NOT distant skyline shots where the city is small in the frame surrounded by terrain — the city FILLS the frame.

The city is ALIVE WITH COMMOTION:
- Multiple ships of varying sizes flying between buildings at different elevations — small commuter craft, mid-size freighters, large transports
- Traffic visible on multi-tier skyways / skybridges / elevated rails
- Holographic signage and billboards flickering, advertising in unknown alien glyphs
- Smaller drones, hover-vehicles, and commerce in motion at street level
- Hundreds of pinprick lit windows speckling every tower face
- Light pollution from a thousand sources cutting through atmospheric haze
- Steam vents, signal beacons, spotlight beams visible
- Tiny figures populating bridges and balconies (proving the city is INHABITED)

This is a BUSY metropolis at work, not a quiet diorama. The atmosphere should feel like being immersed in a great alien capital.

━━━ LIGHTING ━━━
${lighting}

━━━ WEATHER / PARTICULATE ━━━
${weather_particulate}

━━━ SCALE PROVERS — include BOTH visibly in the city ━━━
- ${scale_provers[0]}
- ${scale_provers[1]}

━━━ EMOTIONAL DNA ━━━
${emotional_dna}

━━━ SURPRISE ELEMENT — woven into the city for added story interest ━━━
${surprise_element}

Place this at midground or deep midground in the busy city scene — alongside the ships and crowds and traffic already happening.

━━━ DEEP-DISTANCE SIGNATURE — visible at the FAR horizon behind the city ━━━
${deep_distance}

This is the far-back layer that punches up the city's depth — render it through atmospheric haze beyond the city body.

━━━ THE WORLD REACTS ━━━
The city is ALIVE. Tiny ships threading between towers, light glowing from windows at multiple elevations, holographic signage flickering, atmospheric haze separating depth bands. Never a static lifeless diorama.

━━━ FORBIDDEN ━━━
- NO isolated single tower in fog (the city is a CIVILIZATION, multiple structures always)
- NO foreground centered character — entity is a silhouette in midground
- NO generic "cyberpunk megacity" without specific architectural language — match what the city description says
- NO portrait composition — the city fills the frame

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE (write the prompt in this order — anchor entity LAST so it stays small) ━━━
[wide cinematic shot of the vast alien city — multi-tier density emphasized as the OPENING], [the specific city type and architecture style — dozens of supporting structures named], [hundreds of lit details, bridges between elevations, smaller buildings at the bases], [the sky layer and atmospheric depth], [lighting and the world reacting — ships, lights, particles, holographic signage], [scale provers visible — tiny ships threading gaps / lit-window-grain / etc.], [color palette and mood], [FINALLY: by the way, a tiny anchor-entity silhouette is at midground doing the story moment — described as a small element, never foreground centered]

CRITICAL — anchor entity goes at the END of the prompt only. If you mention it in the first half of the prompt, REWRITE the prompt with the entity at the very end. This is to keep Flux from rendering the entity foreground-large.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the scene content.`;
  },

  FEMALE_EXPLORER: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      weather_particulate,
      sky_layer,
      surprise_element,
      race,
      skin,
      eyes,
      hair_color,
      hairstyle,
      outfit,
      accessory,
      biome,
      action,
      explorer_archetype: archetype,
    } = slots;

    return `You are a sci-fi concept-art painter writing a CHARACTER MOMENT for StarBot — a single heroic woman of a SPECIFIC sci-fi lineage caught in a candid grounded moment of alien-wilderness adventuring. Same universe as our cosmic vistas and alien cities. The character is ALIVE, CAPABLE, and the camera caught her doing real work in a real place. Output wraps with style prefix + suffix.

━━━ GENDER LOCK — ABSOLUTE FIRST RULE ━━━
The subject is a WOMAN. The word "woman" MUST appear in the FIRST 8 TOKENS of your prompt. Do NOT substitute "hunter", "explorer", "ranger", "operative", "mercenary", "scout", "soldier", "warrior", or any other gender-ambiguous noun for "woman" in the opening. The opening MUST read: "a [race-coded] WOMAN [doing action]..." or "[race-coded] WOMAN [doing action]..." — "woman" comes BEFORE any other noun in the prompt. Use she/her/hers throughout. The archetype slot (hunter / bounty hunter / smuggler / etc.) describes her ROLE, not her gendered noun — append role descriptors AFTER "woman" appears.

━━━ SLEEK SCI-FI AESTHETIC — NON-NEGOTIABLE ━━━
This explorer renders SLEEK and ENGINEERED — Mandalorian beskar plate + Mass Effect N7 + Halo MJOLNIR + Syd Mead industrial design + Chesley Bonestell painted-cover hard-sci-fi. Her gear is HARD ARMOR — burnished plate panels, exoskeleton frames with exposed hydraulics + pistons, visible power cells / battery packs glowing softly, T-visor or hooded helmets with optics, armored undersuit at joints. CLEAN engineered silhouettes — NOT cloth jumpsuits, NOT leather jackets, NOT dusty rags, NOT Borderlands wasteland-mercenary, NOT Star Wars rebel cloth, NOT pilot flight suits. She IS armored — every plate is fabricated metal/composite with field-repair detail.

She is MYSTERIOUS via TECH, not via dust — partial face occlusion comes from helmet visor / hooded helm / faceplate / breathing apparatus / one-eye cybernetic optic. Mood is purposeful and watchful. She carries engineered tools-of-the-trade: grapple-launcher / data-scroll holster / arm-mounted scanner / wrist-comm / sidearm in mag-lock holster / jet-pack venting cryo vapor. Color palette skews polished metal + matte plate + one accent neon glow (visor / power-cell / shoulder-marker). Pose is tense and capable — never posed-for-camera.

━━━ SHE IS THE SHOW — NON-NEGOTIABLE ━━━
The female explorer is the MAIN SUBJECT of this render. Her face (partially occluded), gear, outfit, lineage, action, and pose are the DRAW — the viewer is here for HER. Her appearance is meant to be ADMIRED for its rugged-competent menace, not glamour — every detail of her outfit and equipment readable and CRISP. She is the hero of the frame; the alien world is her stage.

She occupies 25-40% of the frame vertically — FULL BODY head-to-toe visible, head no larger than 10% of frame height. NOT tiny silhouette (that's the landscape path). NOT centered portrait (that's a headshot). MEDIUM scale where her outfit, gear, and lineage are CLEARLY READABLE.

━━━ SOLO CHARACTER ONLY ━━━
EXACTLY ONE character. No companions, no enemies, no crowds. This explorer ALONE in her moment.

━━━ ENGAGED IN THE SCENE — NON-NEGOTIABLE ━━━
She is DOING SOMETHING SPECIFIC in this frame. The action below is the PRIMARY SUBJECT of the prompt — she is mid-act, captured at a loaded instant. Combat / battling / hunting / spying / tinkering / scheming / reconnaissance / artifact-discovery / infiltration / extraction — these are ALL fair game. Weapons MAY be in active use during battling-coded actions. The mood is purposeful and capable.

━━━ THE ACTION — what she is doing in this exact frame ━━━
${action}

GROUNDED — feet on the ground or interacting with terrain. No floating, no impossible mid-air leaps. The action defines the body-position. Render it EXACTLY — body weight visible, captured at a loaded instant of doing the action.

━━━ HER LINEAGE / SCI-FI RACE (LOCKED — render her unmistakably as THIS lineage) ━━━
${race}

This race is NON-NEGOTIABLE. Render her with the EXACT anatomy, distinguishing features, skin tone, ridges/horns/lekku/montrals/antennae above. If the race is Twi'lek-coded, she has head-tails. If Vulcan-coded, pointed ears + arched brows. If Mandalorian-coded, beskar-style helmet visible. The lineage is the HERO of her identity.

━━━ HER COMPACT BIO (one-line block — DO NOT expand into separate sections) ━━━
A ${race.split(':')[0]} woman with ${skin.split(',')[0]} skin, ${eyes.split(',')[0]} eyes, and ${hair_color.split(',')[0]} hair styled ${hairstyle.split(',')[0]}, wearing ${outfit}, carrying ${accessory}.

(All seven DNA elements — race / skin / eyes / hair color / hairstyle / outfit / accessory — should be discernible in the render when the biome permits a visible face. If the biome demands a sealed helmet, face DNA may be obscured — that's fine, the outfit and accessory still carry her identity.)

ABSOLUTE FRANCHISE LOOKALIKE BAN: NO Stormtrooper plastic armor. NO Mandalorian T-visor full-body burnished plate. NO Halo Spartan green-and-gold helmet. NO Mass Effect N7. NO Imperial officer. NO Fremen stillsuit. NO Jedi or Sith robes.

Render the outfit EXACTLY as described. Treat her with the same dignity as a male soldier in the same role.

━━━ BIOME-APPROPRIATE OUTFIT — HARD RULE ━━━
The outfit MUST match the biome's hazards. Face visibility follows from the biome — helmets are environmental, not mandatory:
- AIRLESS / VACUUM / TOXIC / METHANE biome → sealed EVA pressure suit with helmet, face behind visor (face DNA partially obscured — fine)
- HOSTILE COLD / GLACIAL / ICE biome → heavy insulated parka with hood up, face may be partially visible
- HOT DESERT / DUNE / VOLCANIC biome → moisture-recycler suit, face wrap optional, face often partially visible
- TEMPERATE / JUNGLE / BIOLUMINESCENT / HABITABLE biome → tactical gear, helmet OFF or absent, FACE FULLY VISIBLE so her lineage + skin + eyes + hair all read clearly
NEVER bikini-warriors on ice planets. NEVER bare skin in vacuum/toxic atmosphere. Function follows biome. When the biome is habitable, prefer face-visible compositions so the character DNA reads.

━━━ SURPRISE ELEMENT — a secondary subject in the scene that adds story ━━━
${surprise_element}

Place this surprise element appropriately within the scene — typically at midground or deep midground, NOT in front of her. It adds visual interest and implies a wider world beyond just her and her action.

━━━ THE ALIEN BIOME (her stage) ━━━
${biome}

━━━ SKY OVERHEAD ━━━
${sky_layer}

━━━ LIGHTING ━━━
${lighting}

━━━ WEATHER / PARTICULATE ━━━
${weather_particulate}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Three-quarter angle or side profile so we see her face and lineage clearly. NEVER walking head-on toward camera. NEVER posing for the camera. Full-body or wide mid-shot. FOREGROUND: tactile detail near her feet (alien plant, rock, ground texture). MIDGROUND: HER, full body, mid-action, 25-40% of frame. BACKGROUND: the alien biome receding into atmospheric haze.

━━━ STRUCTURE (write the prompt in this exact order) ━━━
[OPENING — a wide cinematic action shot of a [race-coded woman] [DOING THE EXACT CINEMATIC ACTION FROM THE ACTION SLOT] in an alien wilderness — the action verb leads the prompt], [she wears [outfit] with full material detail — armor / plates / utility / glow], [her race anatomy + skin + eyes + hair locked from the DNA slots], [her signature accessory visible], [the alien biome wrapping around her — depth and atmospheric layers], [sky overhead], [lighting and weather particles], [color palette and mood]

CRITICAL — the OPENING tokens of the prompt are "[character] [DOING ACTION]" — the action verb leads. The character DNA flows after the action is established. The world establishes the stage. She fills 25-40% of frame, FULL-BODY, captured at the loaded instant of her action.

DRAMATIC VISUALS: render the EXACT slot-pool details above — DO NOT substitute generic descriptions. Race comes FIRST visually. Every other slot is locked. Her outfit + accessory + action all readable at full-body scale.

Output ONLY the raw 80-120 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
  },

  MALE_EXPLORER: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      weather_particulate,
      sky_layer,
      surprise_element,
      race,
      skin,
      eyes,
      hair_color,
      hairstyle,
      outfit,
      accessory,
      biome,
      action,
      explorer_archetype: archetype,
    } = slots;

    return `You are a sci-fi concept-art painter writing a CHARACTER MOMENT for StarBot — a single rugged badass MAN of a SPECIFIC sci-fi lineage caught in a candid grounded moment of alien-wilderness adventuring. Same universe as our cosmic vistas and alien cities. He is ALIVE, CAPABLE, DANGEROUS, and the camera caught him doing real work in a real place. Output wraps with style prefix + suffix.

━━━ GENDER LOCK — ABSOLUTE FIRST RULE ━━━
The subject is a MAN. The word "man" MUST appear in the FIRST 8 TOKENS of your prompt. Do NOT substitute "hunter", "explorer", "ranger", "operative", "mercenary", "scout", "soldier", "warrior", or any other gender-ambiguous noun for "man" in the opening. The opening MUST read: "a [race-coded] MAN [doing action]..." or "[race-coded] MAN [doing action]..." — "man" comes BEFORE any other noun in the prompt. Use he/his/him throughout. The archetype slot (hunter / bounty hunter / smuggler / etc.) describes his ROLE, not his gendered noun — append role descriptors AFTER "man" appears.

━━━ HELMET LOCK — ABSOLUTE RULE ━━━
The helmet / visor / faceplate / sealed helm MUST appear in the prompt BEFORE any description of his hair, face, eyes, or stubble. Flux locks the head from the FIRST head-related tokens it sees — if you describe "blue eyes and dark hair" before mentioning the helmet, Flux renders him bareheaded. CORRECT ORDER: "[race-coded] MAN [doing action], wearing a [SEALED HELMET / FULL-COVERAGE VISOR HELM / GAS MASK] with [optic detail], beneath which [optional brief face/skin notes if relevant], [armor description], [tech pieces], [weapons]". The helmet token comes FIRST in the head-region description. If the biome is habitable and helmet is held in hand, the prompt MUST say "helmet held in hand" or "helmet clipped to belt" BEFORE describing the face/hair.

━━━ SCI-FI EXPLORER / ROGUE / ASSASSIN AESTHETIC — NON-NEGOTIABLE ━━━
This explorer is a SCI-FI EXPLORER, ROGUE, or ASSASSIN — think Destiny Guardian / Destiny 2 Hunter or Titan / Mass Effect operative / Star Wars rogue or bounty hunter / Halo ODST / The Mandalorian protagonist / Star-Lord / Cad Bane / Boba Fett-coded (without naming) / Han Solo with armor / Cowboy Bebop Spike Spiegel / John Wick in space. He is CAPABLE, MYSTERIOUS, DANGEROUS, and stylish-tactical — Destiny Guardian energy: armored cloak + sealed helmet + utility kit + visible weapons.

He is WATCHFUL and CAPABLE — eyes scanning behind a visor or under a hood, weathered features when face is visible, ready stance. NOT bulky-tank brute, NOT military trooper boxy power-armor, NOT pure-form-fit fashion. He is between — TACTICAL OPERATIVE with cinematic style.

━━━ FULLY CLOTHED — ABSOLUTE RULE ━━━
He is FULLY ARMORED AND CLOTHED at all times. NEVER bare-chested. NEVER shirtless. NEVER exposed torso. NEVER tank top or sleeveless. NEVER beefcake-coded. His upper body is COVERED — sealed pressure suit / armored coat / tactical armor / ballistic harness OVER thermal underlayer. Even with cybernetic limbs (prosthetic arm / leg), the TORSO IS COVERED in armor or coat. Skin shows only at face, hands (when gloves are off), and neck-seal.

His gear is TACTICAL OPERATIVE kit — armored field jacket / armored cloak with hood / armored duster coat / sealed pressure suit / segmented plate armor over thermal layer / ballistic harness with visible ammo and pouches / Destiny-Guardian armored cloak-and-helm combo / weathered tactical armor with scratches and field-repair welds. Sealed helmet with mil-spec optics OR helmet held in hand with hooded head OR face-wrap with goggles. He is dressed for hostile alien planets — every plate is fabricated metal/composite with field-wear detail.

He is MYSTERIOUS via tech AND grit — partial face occlusion comes from helmet visor / hooded helm / faceplate / breathing apparatus / cybernetic eye / face-wrap / sunglasses / cigar smoke. Mood is purposeful and dangerous. He carries engineered tools-of-the-trade: multiple sidearms / shotgun / rifle slung / grenade bandolier / data-scroll holster / arm-mounted scanner / wrist-comm / mag-lock holster / breaching tool / cattle-prod / vibro-blade / grappling hook. Color palette skews matte tactical (gunmetal / charcoal / olive-drab / coyote-tan / oxblood / matte-black) with utility orange / amber accents. Pose is tense and watchful — never posed-for-camera, never glamorous.

━━━ HE IS THE SHOW — NON-NEGOTIABLE ━━━
The male explorer is the MAIN SUBJECT of this render. His face (partially occluded), gear, outfit, lineage, action, and pose are the DRAW — the viewer is here for HIM. His appearance is meant to be ADMIRED for its rugged-competent menace — every detail of his outfit and equipment readable and CRISP. He is the hero of the frame; the alien world is his stage.

He occupies 25-40% of the frame vertically — FULL BODY head-to-toe visible, head no larger than 10% of frame height. NOT tiny silhouette (that's the landscape path). NOT centered portrait (that's a headshot). MEDIUM scale where his outfit, gear, and lineage are CLEARLY READABLE.

━━━ SOLO CHARACTER ONLY ━━━
EXACTLY ONE character. No companions, no enemies, no crowds. This explorer ALONE in his moment.

━━━ ENGAGED IN THE SCENE — NON-NEGOTIABLE ━━━
He is DOING SOMETHING SPECIFIC in this frame. The action below is the PRIMARY SUBJECT of the prompt — he is mid-act, captured at a loaded instant. Combat / battling / hunting / spying / tinkering / scheming / reconnaissance / artifact-discovery / infiltration / extraction — these are ALL fair game. Weapons MAY be in active use during battling-coded actions. The mood is purposeful, dangerous, capable.

━━━ THE ACTION — what he is doing in this exact frame ━━━
${action}

GROUNDED — feet on the ground or interacting with terrain. No floating, no impossible mid-air leaps. The action defines the body-position. Render it EXACTLY — body weight visible, captured at a loaded instant of doing the action.

━━━ HIS LINEAGE / SCI-FI RACE (LOCKED — render him unmistakably as THIS lineage) ━━━
${race}

This race is NON-NEGOTIABLE. Render him with the EXACT anatomy, distinguishing features, skin tone, ridges/horns/lekku/montrals/antennae above. The lineage is the HERO of his identity.

━━━ HIS COMPACT BIO (one-line block — DO NOT expand into separate sections) ━━━
A ${race.split(':')[0]} man with ${skin.split(',')[0]} skin, ${eyes.split(',')[0]} eyes, and ${hair_color.split(',')[0]} hair styled ${hairstyle.split(',')[0]}, wearing ${outfit}, carrying ${accessory}.

(All seven DNA elements — race / skin / eyes / hair color / hairstyle / outfit / accessory — should be discernible in the render when the biome permits a visible face. If the biome demands a sealed helmet, face DNA may be obscured — that's fine, the outfit and accessory still carry his identity.)

ABSOLUTE FRANCHISE LOOKALIKE BAN: NO Stormtrooper plastic armor. NO Mandalorian T-visor full-body burnished plate. NO Halo Spartan green-and-gold helmet. NO Mass Effect N7. NO Imperial officer. NO Fremen stillsuit. NO Jedi or Sith robes. (The franchise vibes are inspiration — but render generic equivalents Flux won't lock onto.)

Render the outfit EXACTLY as described.

━━━ BIOME-APPROPRIATE OUTFIT — HARD RULE ━━━
The outfit MUST match the biome's hazards. Face visibility follows from the biome:
- AIRLESS / VACUUM / TOXIC / METHANE biome → sealed EVA pressure suit with helmet, face behind visor
- HOSTILE COLD / GLACIAL / ICE biome → heavy insulated parka with hood up, face may be partially visible
- HOT DESERT / DUNE / VOLCANIC biome → tactical desert kit with face wrap optional
- TEMPERATE / JUNGLE / BIOLUMINESCENT / HABITABLE biome → tactical gear, helmet OFF or held, FACE FULLY VISIBLE — show his scars, stubble, weathered features clearly
Function follows biome. When the biome is habitable, prefer face-visible compositions so the rugged character reads.

━━━ SURPRISE ELEMENT — a secondary subject in the scene that adds story ━━━
${surprise_element}

Place this surprise element appropriately within the scene — typically at midground or deep midground, NOT in front of him. It adds visual interest and implies a wider world beyond just him and his action.

━━━ THE ALIEN BIOME (his stage) ━━━
${biome}

━━━ SKY OVERHEAD ━━━
${sky_layer}

━━━ LIGHTING ━━━
${lighting}

━━━ WEATHER / PARTICULATE ━━━
${weather_particulate}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Three-quarter angle or side profile so we see his face and lineage clearly. NEVER walking head-on toward camera. NEVER posing for the camera. Full-body or wide mid-shot. FOREGROUND: tactile detail near his feet (alien plant, rock, ground texture). MIDGROUND: HIM, full body, mid-action, 25-40% of frame. BACKGROUND: the alien biome receding into atmospheric haze.

━━━ STRUCTURE (write the prompt in this exact order) ━━━
[OPENING — a wide cinematic action shot of a [race-coded man] [DOING THE EXACT CINEMATIC ACTION FROM THE ACTION SLOT] in an alien wilderness — the action verb leads the prompt], [he wears [outfit] with full material detail — armor / plates / utility / weathering], [his race anatomy + skin + eyes + hair locked from the DNA slots], [his signature accessory visible], [the alien biome wrapping around him — depth and atmospheric layers], [sky overhead], [lighting and weather particles], [color palette and mood]

CRITICAL — the OPENING tokens of the prompt are "[character] [DOING ACTION]" — the action verb leads. The character DNA flows after the action is established. The world establishes the stage. He fills 25-40% of frame, FULL-BODY, captured at the loaded instant of his action.

DRAMATIC VISUALS: render the EXACT slot-pool details above — DO NOT substitute generic descriptions. Race comes FIRST visually. Every other slot is locked. His outfit + accessory + action all readable at full-body scale. RUGGED + WEATHERED + DANGEROUS — bulk reads as competence.

Output ONLY the raw 80-120 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
  },

  FEMALE_ADVENTURER: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      race,
      class: charClass,
      skin,
      eyes,
      hair_color,
      hairstyle,
      outfit,
      accessory,
      landscape,
      action,
      surprise_element,
      drama,
    } = slots;

    const dramaSection = drama
      ? `
━━━ ENVIRONMENTAL DRAMA — render this visibly in the scene ━━━
${drama}

An atmospheric event happening in the world around her — render as a visible secondary focal point (NOT eclipsing her). Adds awe / story to the frame. NEVER combat or enemies.

`
      : '';

    return `You are a fantasy concept-art painter writing a CANDID ADVENTURING scene for DragonBot — a single WOMAN of a SPECIFIC D&D × LOTR fantasy race, of a specific class, doing her adventurer thing out in the wild. LOTR / GoT / Elden Ring / Skyrim / Witcher tradition. She is ALIVE, CAPABLE, road-tested, in a story-rich candid moment.

━━━ GENDER LOCK — ABSOLUTE FIRST RULE ━━━
The subject is a WOMAN. The word "woman" MUST appear in the FIRST 8 TOKENS of your prompt. Do NOT substitute "adventurer", "rogue", "ranger", "mage", "paladin", "warrior" or any other gender-ambiguous noun for "woman" in the opening. Opening MUST read: "a [race-coded] WOMAN [doing action] in [landscape]..." — "woman" comes BEFORE any class noun. Use she/her/hers throughout. The class slot describes her ROLE, not her gendered noun — append role AFTER "woman" appears.

━━━ ABSOLUTE BANS — NSFW-CLEAN, COMBAT-CLEAN ━━━
• NO combat, NO mid-strike, NO weapon-aimed-at-foe, NO enemy in frame, NO fallen body, NO wounded character, NO blood-fight
• Weapons stay holstered / sheathed / slung / carried — NEVER in active combat use
• NO cheesecake: NO "minimal coverage" / "bare midriff" / "exposed cleavage" / "form-fitting" / "skin-tight" / "harness across torso" / "sultry" / "sensual" / "alluring" / "low-cut" / "seductive" / "curves emphasized"
• Her outfit reads FUNCTIONAL + COVERED — sleek adventuring gear, not sexualized
• NO posing for the camera. NEVER staged. Candid moment, body in motion or charged stillness

━━━ SOLO CHARACTER ONLY ━━━
ONE character. No companions, no enemies, no crowds. She is ALONE in her moment.

━━━ SHE IS THE SHOW — NON-NEGOTIABLE ━━━
The adventurer is the MAIN SUBJECT. Her face, gear, race, action, and pose are the DRAW. She occupies 25-40% of the frame vertically — FULL BODY head-to-toe visible, head no larger than 10% of frame. NOT a tiny silhouette in distant landscape. NOT a centered portrait. MEDIUM scale where outfit / accessory / face / race-anatomy all CLEARLY READABLE.

━━━ HER RACE (LOCKED — render her unmistakably as THIS lineage) ━━━
${race}

Race is NON-NEGOTIABLE. Render the EXACT anatomy, skin/scale tone, ears, eyes, distinguishing features. Drow = obsidian-grey skin and white-silver hair, NOT default-blonde human. Tiefling = horns and slit-pupil eyes. Dragonborn = scaled face and draconic snout. Half-orc = green-grey skin and tusks. Wood elf = pointed ears and forest features. Race is the HERO of identity.

━━━ HER CLASS (her role / energy — informs how she carries herself) ━━━
${charClass}

━━━ HER COMPACT BIO (one-line block — DO NOT expand) ━━━
A ${race.split(':')[0]} woman with ${skin.split(',')[0]} skin, ${eyes.split(',')[0]} eyes, and ${hair_color.split(',')[0]} hair styled ${hairstyle.split('—')[0].trim()}, wearing ${outfit.split('—')[1] ? outfit.split('—')[1].trim() : outfit}, carrying ${accessory}.

All eight DNA elements (race / class / skin / eyes / hair color / hairstyle / outfit / accessory) should be discernible in the render. Face fully visible (this is fantasy, not sci-fi — no sealed helmet).

━━━ THE ACTION — what she is doing RIGHT NOW (CANDID, NEVER COMBAT) ━━━
${action}

GROUNDED — feet on the ground or interacting with terrain. The action defines body position. Render it EXACTLY — body weight visible, captured at a loaded instant. Purposeful, capable, mid-motion — never staged.

━━━ THE LANDSCAPE (the wild stage — fantasy biome) ━━━
${landscape}

Depth on depth — FOREGROUND tactile detail (rocks / vegetation / camp gear / cliff-edge) → MIDGROUND landscape body + her → DEEP DISTANCE atmospheric layers stacked. Never flat backdrop. The landscape sets the stage but never competes with her for focus.
${dramaSection}
━━━ SURPRISE ELEMENT — secondary subject adding story ━━━
${surprise_element}

Place at midground or deep midground — a small detail implying the wider world. NEVER foreground or competing with her for attention.

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION ━━━
Three-quarter angle or side profile so we see her face and race clearly. NEVER walking head-on toward camera. NEVER posing for the camera. Full-body or wide mid-shot. FOREGROUND: tactile detail near her feet (gear, rocks, vegetation, trail-edge). MIDGROUND: HER, full body, mid-action, 25-40% of frame. BACKGROUND: the landscape receding into atmospheric haze.

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: "a [race-coded] WOMAN [doing exact action] in [landscape]" — race-noun "woman" leads], [she wears [outfit] with full material detail], [her skin + eyes + hair locked from DNA slots], [signature accessory visible], [the fantasy landscape wrapping around her — depth + atmospheric layers], [lighting + atmosphere particles], [color palette + mood]

CRITICAL — the OPENING tokens are "[race-coded woman] [DOING ACTION]" — woman comes BEFORE rogue / ranger / mage / paladin / etc. She fills 25-40% of frame, FULL-BODY, captured at the loaded candid instant.

DRAMATIC VISUALS: render the EXACT slot-pool details above. Do NOT substitute generic descriptions. Race comes FIRST visually. Every other slot is locked.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  FEMALE_ACTION_SCENES: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      race,
      class: charClass,
      skin,
      eyes,
      hair_color,
      hairstyle,
      outfit,
      accessory,
      landscape,
      action,
      surprise_element,
      drama,
    } = slots;

    const dramaSection = drama
      ? `
━━━ ENVIRONMENTAL DRAMA — render this visibly in the scene ━━━
${drama}

A magical / atmospheric event amplifying the action — render as a visible secondary focal point. Adds awe / chaos / story.

`
      : '';

    return `You are a fantasy concept-art painter writing a PEAK-ACTION CINEMATIC MOMENT for DragonBot — a WOMAN of a SPECIFIC D&D × LOTR fantasy race, of a specific class, captured at the apex of dynamic action. LOTR / GoT / Elden Ring / Skyrim / Witcher / Warcraft visual lineage. She is ALIVE, mid-motion, RIPPING with cinematic energy.

━━━ GENDER LOCK — ABSOLUTE FIRST RULE ━━━
The subject is a WOMAN. The word "woman" MUST appear in the FIRST 8 TOKENS of your prompt. Do NOT substitute "mage", "rogue", "ranger", "paladin", "warrior" or any other gender-ambiguous noun for "woman" in the opening. Opening MUST read: "a [race-coded] WOMAN [doing action] in [landscape]..." — "woman" comes BEFORE any class noun. Use she/her/hers throughout. The class slot describes her ROLE, not her gendered noun — append role AFTER "woman" appears.

━━━ ABSOLUTE BANS — NSFW-CLEAN ━━━
• NO cheesecake: NO "minimal coverage" / "bare midriff" / "exposed cleavage" / "form-fitting" / "skin-tight" / "harness across torso" / "sultry" / "sensual" / "alluring" / "low-cut" / "curves emphasized"
• Her outfit reads FUNCTIONAL + COVERED — sleek action gear, not sexualized
• NO posing for the camera. NEVER staged. Captured at a cinematic loaded INSTANT
• NO real-world ethnic / historical costume codes (no Bedouin / Persian / samurai / Aztec / Polynesian / etc.) — STRICT WESTERN HIGH FANTASY ONLY

━━━ THIS IS PEAK ACTION — NOT A CANDID MOMENT ━━━
The action axis describes a CINEMATIC MID-ACTION BEAT — mid-spell at the apex of a fireball, mid-loose with arrow streaking from her bow, mid-leap from a rooftop in a chase, the moment of summoning, the second a paladin's hammer crashes down, the instant a rogue's blade reverses for a kill.

━━━ MULTI-EFFECT STACK — MANDATORY ━━━
Every render MUST show AT LEAST 2-3 LAYERED VISIBLE EFFECTS / DYNAMIC ELEMENTS happening SIMULTANEOUSLY. ONE effect = boring. STACK them:
• PRIMARY: her direct action (spell-released / arrow-loosed / blade-arc / leap-mid-air / portal-cracking)
• SECONDARY: environmental reaction (debris kicked up / glass shattering / dust cloud / sparks raining / spell-light blooming outward / shockwave radiating / hair-and-cloak whipped by magical wind / motion-blur on her swung arm)
• TERTIARY (scene context): active background — fleeing crowd / collapsing tower / distant explosion / arrow-volley overhead / dragon shadow / allied caster also mid-spell / battle silhouettes / cracking flagstones / smoke billowing / burning building / charging cavalry / scattered enemies retreating

The frame should be ALIVE with chaos / motion / magic — not just her with one effect on a quiet background. THINK MOVIE-POSTER PROMOTIONAL STILL — every quadrant of the frame has something happening.

━━━ SCALE THE MAGIC UP ━━━
If the action involves magic, don't render a wisp — render a MAELSTROM. Not just a fireball — a fireball amid arcing tendrils of secondary flame and glowing-rune wake. Not just lightning — lightning forking down WITH an arcane storm circle radiating from her feet. Not just a portal — a portal CRACKING REALITY with creatures emerging and the air rippling. The magic should DOMINATE its quadrant of the frame.

━━━ SOLO PROTAGONIST ━━━
ONE character — she is the focus. Enemies / targets / mooks may exist in the scene but as scale-provers / context, NEVER eclipsing her. No fallen-body gore. No fights between two equally-prominent figures. SHE is the show.

━━━ SHE IS THE SHOW — NON-NEGOTIABLE ━━━
Her face, gear, race, action, and pose are the DRAW. She occupies 25-40% of the frame vertically — FULL BODY head-to-toe visible, head no larger than 10% of frame. NOT a tiny silhouette in distant landscape. NOT a centered portrait. MEDIUM scale where outfit / accessory / face / race-anatomy all CLEARLY READABLE.

━━━ HER RACE (LOCKED — render her unmistakably as THIS lineage) ━━━
${race}

Race is NON-NEGOTIABLE. Render the EXACT anatomy, skin/scale tone, ears, eyes, distinguishing features. Drow = obsidian-grey skin and white-silver hair. Tiefling = horns and slit-pupil eyes. Dragonborn = scaled face and draconic snout. Half-orc = green-grey skin and tusks. Wood elf = pointed ears and forest features. Race is the HERO of identity.

━━━ HER CLASS (her role / energy — informs HOW the action reads) ━━━
${charClass}

━━━ HER COMPACT BIO (one-line block — DO NOT expand) ━━━
A ${race.split(':')[0]} woman with ${skin.split(',')[0]} skin, ${eyes.split(',')[0]} eyes, and ${hair_color.split(',')[0]} hair styled ${hairstyle.split('—')[0].trim()}, wearing ${outfit.split('—')[1] ? outfit.split('—')[1].trim() : outfit}, carrying ${accessory}.

All eight DNA elements (race / class / skin / eyes / hair color / hairstyle / outfit / accessory) should be discernible in the render. Face fully visible. NO sealed helmet (this is fantasy).

━━━ THE PEAK-ACTION BEAT — what she is doing AT THIS EXACT INSTANT ━━━
${action}

Render at the LOADED INSTANT — body in motion, motion-blur where appropriate, effects in full bloom, the moment the camera caught her in. NOT before, NOT after — AT IT. Effects-rich, lit by the magic / fire / energy she is wielding.

━━━ THE LANDSCAPE (the stage — action-scene context) ━━━
${landscape}

Depth on depth — FOREGROUND tactile detail (rubble / sparks / spell-residue / debris) → MIDGROUND her + the action → DEEP DISTANCE atmospheric layers / cityscape / battle-context. The landscape SETS the scene's stakes — burning towers, lantern-lit night market, magic-storm horizon, dragon attack on castle, collapsing dungeon, neon arcane spires.
${dramaSection}
━━━ SURPRISE ELEMENT — secondary detail amplifying the action ━━━
${surprise_element}

Place at midground or deep midground — a small detail implying wider stakes (fleeing enemies / falling banners / arcane sparks / scattered coins / hovering scrolls / fleeing crowd / smoldering ruin). NEVER eclipses her.

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION — DYNAMIC ANGLES ━━━
Action shots benefit from DYNAMIC camera angles. Mix across renders: three-quarter / dutch-tilt / low-angle hero / over-shoulder / sweeping pursuit / dramatic upshot. NEVER head-on at the camera. NEVER posing. FOREGROUND: tactile action detail (rubble / sparks / motion-blur / spell-residue). MIDGROUND: HER, full body, AT THE PEAK INSTANT, 25-40% of frame. BACKGROUND: the action-scene landscape with stakes visible.

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: "a [race-coded] WOMAN [PEAK-ACTION verb] in [action landscape]" — race-noun "woman" leads, then immediately the peak-action beat], [she wears [outfit]], [her skin + eyes + hair from DNA], [signature accessory IN MOTION], [the landscape with action-stakes], [lighting + effects + atmosphere], [color palette + mood]

CRITICAL — the OPENING tokens are "[race-coded woman] [PEAK-ACTION-VERB]" — woman comes BEFORE class. The action verb IS the composition driver. She fills 25-40% of frame, FULL-BODY, captured at the loaded action instant with MOTION + EFFECTS visible.

DRAMATIC VISUALS: render the EXACT slot-pool details above. Do NOT substitute generic descriptions. Race comes FIRST visually. Every other slot is locked. EFFECTS, MAGIC, MOTION — let them BLOOM.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  MALE_ADVENTURER: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      race,
      class: charClass,
      skin,
      eyes,
      hair_color,
      hairstyle,
      outfit,
      accessory,
      landscape,
      action,
      surprise_element,
      drama,
    } = slots;

    const dramaSection = drama
      ? `
━━━ ENVIRONMENTAL DRAMA — render this visibly in the scene ━━━
${drama}

An atmospheric event happening in the world around him — render as a visible secondary focal point (NOT eclipsing him). Adds awe / story to the frame. NEVER combat or enemies.

`
      : '';

    return `You are a fantasy concept-art painter writing a CANDID ADVENTURING scene for DragonBot — a single MAN of a SPECIFIC D&D × LOTR fantasy race, of a specific class, doing his adventurer thing out in the wild. LOTR / GoT / Elden Ring / Skyrim / Witcher tradition. He is ALIVE, CAPABLE, road-tested, in a story-rich candid moment.

━━━ GENDER LOCK — ABSOLUTE FIRST RULE ━━━
The subject is a MAN. The word "man" MUST appear in the FIRST 8 TOKENS of your prompt. Do NOT substitute "adventurer", "rogue", "ranger", "mage", "paladin", "warrior" or any other gender-ambiguous noun for "man" in the opening. Opening MUST read: "a [race-coded] MAN [doing action] in [landscape]..." — "man" comes BEFORE any class noun. Use he/him/his throughout. The class slot describes his ROLE, not his gendered noun — append role AFTER "man" appears.

━━━ ABSOLUTE BANS — NSFW-CLEAN, COMBAT-CLEAN ━━━
• NO combat, NO mid-strike, NO weapon-aimed-at-foe, NO enemy in frame, NO fallen body, NO wounded character, NO blood-fight
• Weapons stay holstered / sheathed / slung / carried — NEVER in active combat use
• NO male-cheesecake: NO "shirtless" / "bare-chested" / "oiled pecs" / "strategically torn" / "rugged hero pose" / "smoldering" / "form-fitting" / "skin-tight"
• His outfit reads FUNCTIONAL + COVERED — sleek adventuring gear, not sexualized
• NO posing for the camera. NEVER staged. Candid moment, body in motion or charged stillness

━━━ SOLO CHARACTER ONLY ━━━
ONE character. No companions, no enemies, no crowds. He is ALONE in his moment.

━━━ HE IS THE SHOW — NON-NEGOTIABLE ━━━
The adventurer is the MAIN SUBJECT. His face, gear, race, action, and pose are the DRAW. He occupies 25-40% of the frame vertically — FULL BODY head-to-toe visible, head no larger than 10% of frame. NOT a tiny silhouette in distant landscape. NOT a centered portrait. MEDIUM scale where outfit / accessory / face / race-anatomy all CLEARLY READABLE.

━━━ HIS RACE (LOCKED — render him unmistakably as THIS lineage) ━━━
${race}

Race is NON-NEGOTIABLE. Render the EXACT anatomy, skin/scale tone, ears, eyes, distinguishing features, and beard (where the race entry specifies one). Drow = obsidian-grey skin and white-silver hair, beardless. Tiefling = horns and slit-pupil eyes. Dragonborn = scaled face and draconic snout, beardless. Half-orc = green-grey skin and tusks. Mountain dwarf = heavily-braided beard with iron clan-rings. Rohirrim = golden-blond braided beard. Nord = blond braided beard. Beards are male-coded for many races — RENDER THEM if the race entry calls for them. Race is the HERO of identity.

━━━ HIS CLASS (his role / energy — informs how he carries himself) ━━━
${charClass}

━━━ HIS COMPACT BIO (one-line block — DO NOT expand) ━━━
A ${race.split(':')[0]} man with ${skin.split(',')[0]} skin, ${eyes.split(',')[0]} eyes, and ${hair_color.split(',')[0]} hair styled ${hairstyle.split('—')[0].trim()}, wearing ${outfit.split('—')[1] ? outfit.split('—')[1].trim() : outfit}, carrying ${accessory}.

All eight DNA elements (race / class / skin / eyes / hair color / hairstyle / outfit / accessory) should be discernible in the render. Face fully visible (this is fantasy, not sci-fi — no sealed helmet).

━━━ THE ACTION — what he is doing RIGHT NOW (CANDID, NEVER COMBAT) ━━━
${action}

GROUNDED — feet on the ground or interacting with terrain. The action defines body position. Render it EXACTLY — body weight visible, captured at a loaded instant. Purposeful, capable, mid-motion — never staged.

━━━ THE LANDSCAPE (the wild stage — fantasy biome) ━━━
${landscape}

Depth on depth — FOREGROUND tactile detail (rocks / vegetation / camp gear / cliff-edge) → MIDGROUND landscape body + him → DEEP DISTANCE atmospheric layers stacked. Never flat backdrop. The landscape sets the stage but never competes with him for focus.
${dramaSection}
━━━ SURPRISE ELEMENT — secondary subject adding story ━━━
${surprise_element}

Place at midground or deep midground — a small detail implying the wider world. NEVER foreground or competing with him for attention.

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION ━━━
Three-quarter angle or side profile so we see his face and race clearly. NEVER walking head-on toward camera. NEVER posing for the camera. Full-body or wide mid-shot. FOREGROUND: tactile detail near his feet (gear, rocks, vegetation, trail-edge). MIDGROUND: HIM, full body, mid-action, 25-40% of frame. BACKGROUND: the landscape receding into atmospheric haze.

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: "a [race-coded] MAN [doing exact action] in [landscape]" — race-noun "man" leads], [he wears [outfit] with full material detail], [his skin + eyes + hair + beard locked from DNA slots], [signature accessory visible], [the fantasy landscape wrapping around him — depth + atmospheric layers], [lighting + atmosphere particles], [color palette + mood]

CRITICAL — the OPENING tokens are "[race-coded man] [DOING ACTION]" — man comes BEFORE rogue / ranger / mage / paladin / etc. He fills 25-40% of frame, FULL-BODY, captured at the loaded candid instant.

DRAMATIC VISUALS: render the EXACT slot-pool details above. Do NOT substitute generic descriptions. Race comes FIRST visually. Every other slot is locked.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  MALE_ACTION_SCENES: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      race,
      class: charClass,
      skin,
      eyes,
      hair_color,
      hairstyle,
      outfit,
      accessory,
      landscape,
      action,
      surprise_element,
      drama,
    } = slots;

    const dramaSection = drama
      ? `
━━━ ENVIRONMENTAL DRAMA — render this visibly in the scene ━━━
${drama}

A magical / atmospheric event amplifying the action — render as a visible secondary focal point. Adds awe / chaos / story.

`
      : '';

    return `You are a fantasy concept-art painter writing a PEAK-ACTION CINEMATIC MOMENT for DragonBot — a MAN of a SPECIFIC D&D × LOTR fantasy race, of a specific class, captured at the apex of dynamic action. LOTR / GoT / Elden Ring / Skyrim / Witcher / Warcraft visual lineage. He is ALIVE, mid-motion, RIPPING with cinematic energy.

━━━ GENDER LOCK — ABSOLUTE FIRST RULE ━━━
The subject is a MAN. The word "man" MUST appear in the FIRST 8 TOKENS of your prompt. Do NOT substitute "mage", "rogue", "ranger", "paladin", "warrior" or any other gender-ambiguous noun for "man" in the opening. Opening MUST read: "a [race-coded] MAN [doing action] in [landscape]..." — "man" comes BEFORE any class noun. Use he/him/his throughout. The class slot describes his ROLE, not his gendered noun — append role AFTER "man" appears.

━━━ ABSOLUTE BANS — NSFW-CLEAN ━━━
• NO male-cheesecake: NO "shirtless" / "bare-chested" / "oiled" / "strategically torn" / "rugged hero pose" / "smoldering" / "form-fitting" / "skin-tight"
• His outfit reads FUNCTIONAL + COVERED — sleek action gear, not sexualized
• NO posing for the camera. NEVER staged. Captured at a cinematic loaded INSTANT
• NO real-world ethnic / historical costume codes — STRICT WESTERN HIGH FANTASY ONLY

━━━ THIS IS PEAK ACTION — NOT A CANDID MOMENT ━━━
The action axis describes a CINEMATIC MID-ACTION BEAT — mid-spell at the apex of a fireball, mid-loose with arrow streaking from his bow, mid-leap from a rooftop in a chase, the moment of summoning, the second a paladin's hammer crashes down, the instant a rogue's blade reverses for a kill.

━━━ MULTI-EFFECT STACK — MANDATORY ━━━
Every render MUST show AT LEAST 2-3 LAYERED VISIBLE EFFECTS / DYNAMIC ELEMENTS happening SIMULTANEOUSLY. ONE effect = boring. STACK them:
• PRIMARY: his direct action (spell-released / arrow-loosed / blade-arc / leap-mid-air / portal-cracking)
• SECONDARY: environmental reaction (debris kicked up / glass shattering / dust cloud / sparks raining / spell-light blooming outward / shockwave radiating / hair-and-cloak whipped by magical wind / motion-blur on his swung arm)
• TERTIARY (scene context): active background — fleeing crowd / collapsing tower / distant explosion / arrow-volley overhead / dragon shadow / allied caster also mid-spell / battle silhouettes / cracking flagstones / smoke billowing / burning building / charging cavalry / scattered enemies retreating

The frame should be ALIVE with chaos / motion / magic — not just him with one effect on a quiet background. THINK MOVIE-POSTER PROMOTIONAL STILL — every quadrant of the frame has something happening.

━━━ SCALE THE MAGIC UP ━━━
If the action involves magic, don't render a wisp — render a MAELSTROM. Not just a fireball — a fireball amid arcing tendrils of secondary flame and glowing-rune wake. Not just lightning — lightning forking down WITH an arcane storm circle radiating from his feet. Not just a portal — a portal CRACKING REALITY with creatures emerging and the air rippling. The magic should DOMINATE its quadrant of the frame.

━━━ SOLO PROTAGONIST ━━━
ONE character — he is the focus. Enemies / targets / mooks may exist in the scene but as scale-provers / context, NEVER eclipsing him. No fallen-body gore. No fights between two equally-prominent figures. HE is the show.

━━━ HE IS THE SHOW — NON-NEGOTIABLE ━━━
His face, gear, race, action, and pose are the DRAW. He occupies 25-40% of the frame vertically — FULL BODY head-to-toe visible, head no larger than 10% of frame. NOT a tiny silhouette in distant landscape. NOT a centered portrait. MEDIUM scale where outfit / accessory / face / race-anatomy all CLEARLY READABLE.

━━━ HIS RACE (LOCKED — render him unmistakably as THIS lineage) ━━━
${race}

Race is NON-NEGOTIABLE. Render the EXACT anatomy, skin/scale tone, ears, eyes, distinguishing features, and beard (where the race entry specifies one). Beards are male-coded for many races — RENDER THEM if the race entry calls for them. Race is the HERO of identity.

━━━ HIS CLASS (his role / energy — informs HOW the action reads) ━━━
${charClass}

━━━ HIS COMPACT BIO (one-line block — DO NOT expand) ━━━
A ${race.split(':')[0]} man with ${skin.split(',')[0]} skin, ${eyes.split(',')[0]} eyes, and ${hair_color.split(',')[0]} hair styled ${hairstyle.split('—')[0].trim()}, wearing ${outfit.split('—')[1] ? outfit.split('—')[1].trim() : outfit}, carrying ${accessory}.

All eight DNA elements (race / class / skin / eyes / hair color / hairstyle / outfit / accessory) should be discernible in the render. Face fully visible. NO sealed helmet (this is fantasy).

━━━ THE PEAK-ACTION BEAT — what he is doing AT THIS EXACT INSTANT ━━━
${action}

Render at the LOADED INSTANT — body in motion, motion-blur where appropriate, effects in full bloom, the moment the camera caught him in. NOT before, NOT after — AT IT. Effects-rich, lit by the magic / fire / energy he is wielding.

━━━ THE LANDSCAPE (the stage — action-scene context) ━━━
${landscape}

Depth on depth — FOREGROUND tactile detail (rubble / sparks / spell-residue / debris) → MIDGROUND him + the action → DEEP DISTANCE atmospheric layers / cityscape / battle-context. The landscape SETS the scene's stakes — burning towers, lantern-lit night market, magic-storm horizon, dragon attack on castle, collapsing dungeon.
${dramaSection}
━━━ SURPRISE ELEMENT — secondary detail amplifying the action ━━━
${surprise_element}

Place at midground or deep midground — a small detail implying wider stakes (fleeing enemies / falling banners / arcane sparks / scattered coins / hovering scrolls / fleeing crowd / smoldering ruin). NEVER eclipses him.

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION — DYNAMIC ANGLES ━━━
Action shots benefit from DYNAMIC camera angles. Mix across renders: three-quarter / dutch-tilt / low-angle hero / over-shoulder / sweeping pursuit / dramatic upshot. NEVER head-on at the camera. NEVER posing. FOREGROUND: tactile action detail (rubble / sparks / motion-blur / spell-residue). MIDGROUND: HIM, full body, AT THE PEAK INSTANT, 25-40% of frame. BACKGROUND: the action-scene landscape with stakes visible.

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: "a [race-coded] MAN [PEAK-ACTION verb] in [action landscape]" — race-noun "man" leads, then immediately the peak-action beat], [he wears [outfit]], [his skin + eyes + hair + beard from DNA], [signature accessory IN MOTION], [the landscape with action-stakes], [lighting + effects + atmosphere], [color palette + mood]

CRITICAL — the OPENING tokens are "[race-coded man] [PEAK-ACTION-VERB]" — man comes BEFORE class. The action verb IS the composition driver. He fills 25-40% of frame, FULL-BODY, captured at the loaded action instant with MOTION + EFFECTS visible.

DRAMATIC VISUALS: render the EXACT slot-pool details above. Do NOT substitute generic descriptions. Race comes FIRST visually. Every other slot is locked. EFFECTS, MAGIC, MOTION — let them BLOOM.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  DRAGONBOT_DARK_REALM: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, scene, architecture, surprise_element, sky_layer, phenomenon } =
      slots;

    const phenomenonSection = phenomenon
      ? `
━━━ CURSED ATMOSPHERIC PHENOMENON — render this visibly ━━━
${phenomenon}

A dark / corrupted / supernatural event woven into the realm — render as a visible focal point. Amplifies the menacing mood.

`
      : '';

    return `You are a dark-fantasy concept-art painter writing DARK REALM scenes for DragonBot — corrupted wastelands, necromancer kingdoms, fallen empires, cursed lands. STRICT WESTERN HIGH FANTASY — Mordor / Shadowfell / Dark Souls / Bloodborne / Diablo / Sword of Truth / Witcher's-Wild-Hunt visual lineage. Beautiful but MENACING. The land itself feels hostile, wrong, corrupted.

━━━ THE MOOD — NON-NEGOTIABLE ━━━
MENACING + BEAUTIFUL + HOSTILE + CORRUPTED + OPPRESSIVE. The viewer should feel UNEASE. Not horror-gore, not slasher — DARK FANTASY DREAD. The world is wrong here.

━━━ MOVIE POSTER MANDATE — STACK THE ELEMENTS ━━━
Every render MUST be a MOVIE POSTER PROMOTIONAL FRAME — every quadrant has something striking. Stack 3+ visually-arresting elements simultaneously:

  1. **PRIMARY DARK SCENE** — the corrupted landscape at maximum scale (blighted forest / poisoned wetland / ash plain / cursed necropolis / demon-touched volcanic / sundered abyss-edge)
  2. **ARCHITECTURE ANCHOR** — dark citadel / necromancer tower / bone-throne / cursed shrine / Gothic cathedral / demon-summoning circle, positioned at midground or deep distance
  3. **CURSED PHENOMENON** — blood rain / ash storm / spectral mist / sickly aurora / blackened sun / eldritch storm / void-tear / nightmare-bird flock, dominating its quadrant
  4. **SCALE PROVER** — tiny hooded wanderer / cursed knight / lone pilgrim (5-15% of frame max) OR dark wildlife (raven flock / shadow-wolves / corpse-eating crows) OR cursed object (fallen banner / abandoned helm / chained body in the mist)

THINK Diablo-cinematic / Sword-of-Truth-cover / Mordor-establishing-shot — every frame should make the viewer GASP at the DARK BEAUTY.

━━━ TILT DARK + MENACING EVERYWHERE ━━━
Every quadrant signals "wrong": twisted trees, blackened stone, sickly glow, blood-stained ground, ash-fall, dead silence implied, vines like black veins, rivers running dark. The world IS the threat.

━━━ STRICT WESTERN HIGH FANTASY ━━━
🚫 NO sci-fi / cosmic / nebulas / sky-whales / floating islands / orbital structures
🚫 NO modern / industrial architecture (no lighthouses / clocktowers / factories)
🚫 NO real-world ethnic codes
🚫 NO gratuitous gore / slasher / explicit horror — DARK FANTASY DREAD only (some bone / fallen helm / blood-tinted river is fine; visceral organ-stew is NOT)
🚫 NO living dragons in the scene (those are dragon-scene / dragon-lore paths)
✓ Mordor / Shadowfell / Dark Souls / Bloodborne / Diablo / Witcher's Wild Hunt / Skyrim-Soul-Cairn / Elden Ring's-Caelid / D&D-Avernus / Demon's-Souls visual lineage

━━━ THE DARK REALM SCENE ━━━
${scene}

━━━ ARCHITECTURE ANCHOR ━━━
${architecture}

The architecture is fantasy-canon dark: necromancer tower / blood-cathedral / bone-throne hall / cursed obelisk / haunted keep / black-iron fortress / Gothic spire / demon-altar / void-shrine / fallen-empire ruin. Positioned at midground or deep distance.

━━━ SKY OVERHEAD ━━━
${sky_layer}

The sky is OPPRESSIVE — never blue, never clean. Storm-bruised / ash-fall / blood-red / sickly-green / blackened-sun / void-purple. The sky weighs on the land.
${phenomenonSection}
━━━ SURPRISE ELEMENT — secondary subject adding story ━━━
${surprise_element}

Place at midground or deep midground. Optional tiny figure (hooded wanderer / cursed knight / pilgrim) at 5-15% of frame max — they are UNNERVED, REVERENT, INVESTIGATING, NEVER combat / NEVER action. OR dark wildlife / cursed object.

━━━ LIGHTING (ominous / sickly / volcanic / moonlit / Bloodborne-coded) ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
MULTI-TIER DEPTH MANDATORY:
• FOREGROUND: tactile wrong detail — blackened stones / fallen banner / dead branches / blood-streaked moss / withered roots
• MIDGROUND: the dark scene's body — necropolis / ruined fortress / blighted forest / poisoned river — where the architecture anchors
• DEEP DISTANCE: atmospheric layer — distant ash-clouds / corrupted peaks / horizon of storm / pale-glowing portal
• SKY: oppressive overhead — storm-bruised / blood-red / ash-fall / blackened-sun / void-purple

Multi-element stacking: scene + architecture + cursed phenomenon (80% gated) + tiny figure scale-prover all in frame. Movie-poster intensity.

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: "[scene description]" — scene leads], [architecture anchoring at midground / deep distance], [the oppressive sky], [phenomenon if rolled], [surprise element at midground / edge], [lighting and atmospheric detail], [color palette and mood]

DRAMATIC VISUALS: render the EXACT slot-pool details above. Beautiful but MENACING — every frame is a Diablo-cinematic establishing shot.

Output ONLY the raw 100-140 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  DRAGONBOT_DRAGON_LORE: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, scene, architecture, surprise_element, sky_layer, phenomenon } =
      slots;

    const phenomenonSection = phenomenon
      ? `
━━━ ATMOSPHERIC PHENOMENON — render this visibly in the scene ━━━
${phenomenon}

A magical / atmospheric event woven into the lore-scene — render as a visible focal point. Amplifies the "ancient mystery" mood.

`
      : '';

    return `You are an archaeological-fantasy concept-art painter writing DRAGON LORE scenes for DragonBot — ancient evidence of dragons. Massive skeletal remains, weathered murals depicting dragon wars, abandoned lairs with scattered treasure, fossilized eggs, ruined temples built to worship dragons, crumbling dragon-rider outposts. The dragons are GONE but their presence echoes everywhere. STRICT WESTERN HIGH FANTASY — LOTR / GoT / Skyrim / Witcher / Warcraft / D&D / Elden Ring visual lineage.

━━━ THE MOOD — NON-NEGOTIABLE ━━━
WONDER + MELANCHOLY + REVERENCE + LOST GRANDEUR. The viewer should feel: "something immense lived here once". Not a battle. Not living dragons. ABSENCE made visible. Mystery. The weight of forgotten civilizations.

━━━ THE SCALE OF ABSENCE — NON-NEGOTIABLE ━━━
Massive dragon bones dwarf any human element. Ancient murals stretch across cathedral walls. Abandoned hoards gather dust in cavernous lairs. Skeletons the size of mountains. Eggs the size of carriages. Everything whispers: something immense lived here once.

━━━ MOVIE POSTER MANDATE — STACK THE ELEMENTS ━━━
Every render MUST be a MOVIE POSTER PROMOTIONAL FRAME — every quadrant has something striking. Stack 3+ visually-arresting elements simultaneously:

  1. **PRIMARY LORE-SCENE** — the dragon-evidence at MAXIMUM scale (skeleton stretching the entire frame / mural the size of a cathedral wall / hoard knee-deep across a vast vault / egg the size of a carriage)
  2. **ARCHITECTURE ANCHOR** — dragon-temple / aerie / bone-cathedral positioned to dwarf any human, scale-proven against the dragon-evidence
  3. **DRAGON-HABITAT PHENOMENON** — the never-before-seen habitat feature dominating its quadrant (petrified-fire glass forest / crystallized-tear salt-flat / glass-tree grove / ash-snow / blood-geyser field / prism-canyon / bone-coral reef / time-paused rainstorm / phosphorescent blood-veins / etc.). THE HABITAT IS THE DRAMA — unique evidence of dragon-presence transforming the world.
  4. **SCALE PROVER** — tiny scholar/explorer figure (5-15% of frame) OR wildlife OR abandoned artifact making the impossible scale feel earned

The frame should be a movie-poster establishing shot — Peter-Jackson-LOTR-extended-cut, but tilted toward DRAGON-TOUCHED-WORLD impossibility. The world bears the dragon's mark in ways no other world could.

━━━ TILT TOWARD DRAGON-CODED EVERYWHERE ━━━
Every quadrant should signal "dragon was here": claw-marks in stone / scale-fossils underfoot / bone-coral structures / petrified-flame-residue / glass-fused trees / dragon-rune carvings / dragon-silhouette echoes in the cliff-shapes. The world IS dragon-history made visible.

━━━ TINY FIGURES PERMITTED (and encouraged as scale provers) ━━━
UNLIKE the pure-landscape path, dragon-lore PERMITS tiny human figures — scholars, explorers, archaeologists, awe-struck pilgrims, lone-wanderer-finding-a-relic. They are AWED, REVERENT, INVESTIGATING — never combat, never action. Their purpose is SCALE-PROVING and MOOD-SETTING. Render them as TINY silhouettes at midground or deep midground — 5-15% of frame height max, never the focus. The eye lands on the LORE, not on them.

━━━ STRICT WESTERN HIGH FANTASY ━━━
🚫 NO sci-fi / cosmic / nebulas / floating islands / sky-tears / orbital structures / sky-whales / Hubble-deep-field skies
🚫 NO real-world ethnic codes (no pagoda-coded temples / no Egyptian-coded pyramids — use fantasy-canon analogues like dwarven holds / Mordor-coded ruins / Carian academies)
🚫 NO modern / industrial architecture (no lighthouses / windmills / clocktowers / steel structures)
🚫 NO living dragons in the frame — that's dragon-scene. THIS is the AFTERMATH, the RUIN, the ECHO.
✓ Ancient dragon-skeletons / weathered murals / abandoned hoards / fossilized eggs / ruined dragon-temples / crumbling dragon-rider outposts / cracked dragon-eggshells / mummified dragon-wings / petrified-dragon-stone / runic dragon-tomb-markers

━━━ THE DRAGON LORE SCENE ━━━
${scene}

━━━ ARCHITECTURAL CONTEXT ━━━
${architecture}

The architecture is fantasy-canon: cathedral-dragon-temple / cliff-cut-roost / underground-vault / mural-hall / colonnade-of-bones / standing-stones-shrine / sky-spire-aerie / mountain-tomb. Built TO or FOR dragons — scale shows it.

━━━ SKY OVERHEAD ━━━
${sky_layer}
${phenomenonSection}
━━━ SURPRISE ELEMENT — secondary subject adding story ━━━
${surprise_element}

Place at midground or deep midground — a small detail implying the wider mystery. Tiny scholar figure / wildlife / abandoned artifact / scattered relic / weathered banner. NEVER eclipses the lore-scene.

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

━━━ COMPOSITION ━━━
MULTI-TIER DEPTH MANDATORY:
• FOREGROUND: tactile evidence — fragments of bone / fallen rune-stones / cracked egg-shell / scattered gold-coins-in-dust / vine-claimed claw-marks-in-stone
• MIDGROUND: the main lore-element — the dragon-skeleton / the mural-wall / the abandoned-hoard / the temple-interior / the dragon-rider-monument
• DEEP DISTANCE: atmospheric layer or supporting context — distant peaks / vault-ceiling fading into darkness / mountain-valley containing the ruin
• SKY: dramatic overhead element — god-rays through broken roof / aurora through ruined dome / storm-light through colonnade

Multi-element stacking: scene + architecture + atmospheric phenomenon (80% gated) + tiny figure scale-prover all in frame. Movie-poster intensity.

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: "[lore-scene description]" — scene leads], [the architectural context anchoring it], [the sky overhead], [phenomenon if rolled], [surprise element / tiny figure at midground], [lighting and atmospheric detail], [color palette and mood]

DRAMATIC VISUALS: render the EXACT slot-pool details above. The dragons are GONE — show their absence at impossible scale.

Output ONLY the raw 100-140 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },
  GOTHBOT_GOTH_MALE_CLOSEUP: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      archetype,
      skin,
      eyes,
      hair_color,
      hairstyle,
      face_detail,
      wardrobe,
      accessory,
      candid_moment,
      camera_perspective,
    } = slots;

    return `You are a gothic dark-manga concept-art painter writing MYSTERIOUS, OMINOUS, DEADLY dark-aristocrat male closeups for GothBot. Vampire lords, dark princes, shadow assassins, dark warlocks, death gods, dark hunters — predatory aristocrats of the gothic night. Castlevania / Bloodborne / Crimson-Peak / Witcher / Devil-May-Cry dark-male-aristocrat lineage. Camera catches him candidly close-up in a loaded moment.

━━━ ONE MAN ALONE — ABSOLUTE FIRST RULE ━━━
ONE man. SOLO. No companions, no enemies, no second figure, no hands belonging to anyone but him. He is ALONE and DEADLY. He is a man (he/his), adult, never child. NEVER feminine — gender-locked male throughout. Strong jawline, masculine bone structure, broad shoulders, masculine hands.

━━━ TIGHT CLOSEUP FRAMING — FACE FILLS UPPER HALF ━━━
Tight frame — face + throat + one shoulder at most. Face fills the upper half of the frame. Camera is TOO CLOSE for comfort. He is NOT posing — he was caught in the middle of the candid moment described below.

━━━ CAMERA PERSPECTIVE (use this EXACT angle) ━━━
${camera_perspective}

━━━ HE MUST LOOK LIKE HE EXISTS — OBSESSIVE DETAIL ━━━
Render him with obsessive detail. He must feel REAL and LETHAL:
• FACE: every pore visible, sharp masculine cheekbones cutting shadow, sleepless dark-circles, scar-traces — power and centuries in his gaze
• SKIN: render the EXACT skin description from his pool — how candlelight catches the high planes of his face, how shadow pools in his hollows
• EYES: the HERO of the frame — glowing, supernatural, predatory. They radiate light onto the skin around them. The iris is a universe. The gaze cuts.
• FACE DETAIL: weathered + masculine + deadly. Stubble, scars, sleepless dark-circles, kohl-rim if any, faint dirt-streaks. NEVER makeup-clean. NEVER feminine.
• HAIR: short-cropped / pulled-back / wild-undone / wind-blown — masculine, never salon-perfect
• BODY LANGUAGE: predatory stillness. He is the calm before the kill. He watches without blinking. Power held in restraint.

━━━ HIS CORE IDENTITY (informs his ENERGY — MYSTERIOUS / OMINOUS / DEADLY) ━━━
${archetype}

━━━ HIS SKIN ━━━
${skin}

━━━ HIS EYES ━━━
${eyes}

━━━ HIS FACE DETAIL ━━━
${face_detail}

━━━ HIS HAIR ━━━
${hair_color}, ${hairstyle}

━━━ WARDROBE (visible at frame edge — neckline / shoulder / collar) ━━━
${wardrobe}

━━━ HIS SIGNATURE ACCESSORY (close-frame detail — collarbone / neckline / hand) ━━━
${accessory}

━━━ CANDID MOMENT (he was caught doing THIS) ━━━
${candid_moment}

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

━━━ VAMPIRE-LORD / MAN-OF-THE-NIGHT MANDATE — APPLY TO EVERY RENDER ━━━
Every render leans VAMPIRE-LORD / DARK-PRINCE / DEADLY-ARISTOCRAT — mysterious-corrupted aristocrat of the gothic night. Even if his archetype reads as warlock or assassin, the AESTHETIC is vampire-lord:
• DEEP SHADOWED UNDER-EYES MANDATORY — sleepless predator-look, dark-circles or kohl-rim pulled into half-circles beneath the eyes — the look of a being who has not slept in centuries. NEVER clean / well-rested face.
• VAMPIRE PALLOR or VAMPIRE-WARM — skin reads CORRUPTED, paler than human-natural or warmly-unnatural. A faint dark-violet undertone beneath his eyes. The skin of someone who has not seen morning in a long time.
• MASCULINE STRONG-JAWED FEATURES — strong jawline, sharp cheekbones, hollow-cheeked, masculine bone structure. NEVER soft / feminine / androgynous-feminine.
• DEADLY BODY LANGUAGE — weighing a dagger, sipping wine slowly, gazing out a velvet-curtained window, hand at his own throat, fingertip lit by spell-flame, tilting his head with predator patience. Languid not energetic. He has all the time in the world.
• CANDLE / FIREPLACE / OIL-LAMP warm-amber light mixing with cool moonlight on his face — atmospheric, intimate.
• OPULENT VAMPIRE-LORD wardrobe — velvet, silk, leather, brocade, gothic-armor, high-collared coats — NEVER modern, NEVER plain.

━━━ DRAMATIC VISUALS — CRANK IT ━━━
Go MAXIMUM. Eyes BLAZE predator-still. Lighting carves his face into something MYTHIC. Every element cranked to jaw-dropping visual impact. Painterly oil-on-canvas. Castlevania-Symphony-of-the-Night vampire-lord-portrait energy.

━━━ HARD BANS ━━━
🚫 NO multiple figures / NO second person / NO additional hands — he is ALONE
🚫 NO feminine features / NO androgynous-feminine / NO traditional makeup (kohl-rim and sleepless-dark-circles OK)
🚫 NO devil horns / NO pentagrams / NO satanic symbols
🚫 NO anime-smooth / NO Halloween costume / NO cosplay
🚫 NO magazine editorial / NO fashion photography / NO glamour-shot energy
🚫 NO nipples / NO bare-chest emphasis — NSFW-clean (clothed neckline only)
🚫 NO posing / "editorial" / "fashion shoot" / "glamour shot" language
🚫 NO modern / cyberpunk / sci-fi
🚫 NO real-world ethnic codes (gothic-fantasy archetypes only)
🚫 NO child / teen / pubescent figures
🚫 NO cheap gore / NO blood-on-his-mouth as default (only if rolled in candid_moment)

━━━ STRUCTURE (write in this order) ━━━
[camera perspective], [his face — skin + eyes + face_detail], [his hair color + hairstyle], [the candid moment — what he's doing], [wardrobe visible at frame edge], [accessory close-frame detail], [lighting carving his features], [atmosphere at edges], [color palette]

Output ONLY the 60-80 word scene description, comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO bold labels, NO "render as" suffix. Just the phrases, starting immediately with the scene content.`;
  },

  GOTHBOT_VAMPIRE_GIRLS_2: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      atmosphere,
      archetype,
      ethnicity,
      hair,
      wardrobe,
      menace_feature,
      composition,
      scene,
      hero_element,
      lighting,
    } = slots;

    const ethnicityClause = ethnicity ? `${ethnicity} ` : '';
    const unifiedVampire = `A confident ${ethnicityClause}vampire woman with ${hair}, ${menace_feature}. She wears ${wardrobe}. Her eyes are visibly GLOWING with luminous unnatural inner light radiating outward — this glow is the most important visual element and must be unmistakably rendered, not a subtle tint.`;

    return `You are writing ONE Flux prompt for a horrifyingly beautiful vampire portrait. Output ONLY the prompt — comma-separated phrases, 65-90 words, no preamble, no headers.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE NON-NEGOTIABLE MANDATE — these MUST be the FIRST visual elements described in your prompt, BEFORE anything else about her face or wardrobe or setting. They are CENTER STAGE.

1. GLOWING eyes — her eyes glow with inhuman color, light radiating outward from the iris. Words "glowing" + "radiating" (or "casting light") MUST appear.
2. DARK DRASTIC eye shadow AND liner — heavy, blown out, dramatic gothic vampire makeup CAKED ON THE EYES. Words "heavy" + "dark" + "smoky-eye" + "sharp dark eyeliner" (or equivalent: "blown-out black eyeshadow" + "thick kohl eyeliner") MUST appear.

Open your prompt with the eye + makeup description in this format (or equivalent):
"[color] glowing eyes radiating inhuman light, heavy blown-out black smoky-eye with sharp dark kohl eyeliner, ..."

THEN describe the rest (skin, lips, hair, wardrobe, setting). The eyes-and-makeup are the OPENER and the focal point.

ALSO BANNED: NO elf ears. NO pointed ears. NO fantasy-creature ear shapes. She is human-shaped.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


━━━ 1. THE SCENE (gothic backdrop behind her) ━━━
${scene}
Composition: ${composition}.
Lighting: ${lighting}.

━━━ 2. THE VAMPIRE (one unified description — render her exactly this way) ━━━
${unifiedVampire}

She is a DEAD-PALE corpse-vampire with HEAVY DARK GOTH MAKEUP — beautiful bone structure preserved BENEATH the deadness, but the skin reads as undead-corpse-pale (NOT alive-pretty), the makeup is HEAVY caked-on gothic (NOT subtle), the eyes are GLOWING with inhuman color, and a DEMONIC tell (visible fang, clawed fingertip, slit pupil) marks her as not-human. She is human-shaped — NO elf ears, NO pointed ears, NO fantasy-creature features beyond the vampire markers. She is BEAUTIFUL but DEAD — almost a demon. Expression both seductive and terrifying — ancient and inhuman presence. Her face is the focal point — bust framing 40-50% of frame.

━━━ 3. THE HERO ELEMENT (the unforgettable focal piece on her) ━━━
${hero_element}. Render this clearly and prominently.

━━━ 4. HER ARCHETYPE (informs her ENERGY) ━━━
${archetype}

━━━ 5. MOVIE-POSTER CRANK MANDATE — APPLY TO EVERY RENDER ━━━
This is NOT a portrait — this is a MOVIE POSTER. Render her as if this image will sell the film. Apply ALL of:

  1. THEATRICAL RIM-LIGHTING — a single dramatic key-light (candle / fireplace / oil-lamp / single moonbeam) cuts through deep velvet darkness, carving her face into something mythic. Rim-light on her cheekbones, jaw, hair-edge. The light has DIRECTION + EMOTION. NEVER flat illumination.
  2. EVERY QUADRANT INTENTIONAL — top-left has atmospheric drama (drifting candle-smoke / silver moonbeam ray / shower of dark petals / sweeping cobweb / floating embers). Top-right has another (twin moon / arched window / stained-glass shard / hanging chandelier corner). Bottom-left has rich foreground (candelabra / chalice / black-rose cluster / velvet drape / wreath). Bottom-right ditto. NEVER empty background or bare dark-void.
  3. OBSESSIVE MATERIAL DETAIL — every velvet has visible nap and weave. Every gold-thread has texture catching light. Every jewel has visible refraction. Every clasp has tarnish + wear. Every wisp of hair has individual strand visibility. Every dark-lipstick has matte-vs-gloss differentiation. The viewer should want to STUDY every square inch.
  4. STORYTELLING BEAT — the scene tells a story. She just fed (single dark crimson droplet at corner of mouth). She just lit a candle (the flame is still leaning where her finger sparked it). She just removed a veil (the lace falls draped across her shoulder). She just turned (the velvet curtain still falls back into place behind her). NEVER static "she stands there" — always mid-loaded-moment.
  5. ATMOSPHERIC HAZE — volumetric light rays catch dust-motes / candle-smoke / breath-mist / drifting embers / falling petals. The AIR has depth and weight. NEVER thin-flat air.
  6. SATURATED JEWEL-TONE PALETTE WITH DEEP-SHADOW CONTRAST — rich oxblood / deep-violet / sapphire / amber / emerald / amethyst as accent jewel-tones. Deep-velvet black + corpse-pale as the canvas. ONE dominant accent color per render. NEVER muted / desaturated / monochrome.
  7. PAINTED-CANVAS RICHNESS — painterly oil-on-canvas with visible brush-stroke texture in the deeper shadows. NOT photo-real, NOT smooth-digital, NOT anime-clean. Ayami Kojima Castlevania painted concept-art / Karol Bak gothic-painting / John William Waterhouse darkened.
  8. HORROR-AS-BEAUTY DEMONIC RENDER — the fang / clawed fingertip / slit-pupil is rendered THEATRICALLY DRAMATIC, lit by the rim-light, central focal accent. The demonic tell is OBVIOUSLY VISIBLE, not subtle.

━━━ 6. PALETTE & MOOD ━━━
${sharedDNA.scenePalette}. ${sharedDNA.colorPalette}. ${vibeDirective.slice(0, 120)}

The painting feels DARK, OMINOUS, GOTHIC. Heavy shadow dominates. Single dramatic candlelit key-light cuts through deep velvet darkness. Atmosphere heavy with dread.

━━━ 7. ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ 8. HARD BANS ━━━
NO second figures, NO animals, NO blood splatter, NO bodies, NO clown-stripe painted color streaks beneath the eye, NO ritual face-paint stripes, NO photoreal/cinematic/film-still aesthetic, NO modern fashion photography, NO bare black-void background — the gothic setting MUST be visible behind her, NO bright cheerful colors, NO elf ears / pointed ears, NO child / teen, NO multiple figures.

━━━ OUTPUT ━━━
Write 65-90 words, comma-separated phrases. The unified vampire description in section 2 is the primary face description — preserve the HEAVY MAKEUP, GLOWING EYE, DEAD-PALE skin, and DEMONIC tell language unmistakably. The gothic setting fills the rest of the frame as the dramatic painted backdrop. NO preamble, NO headers.`;
  },

  GOTHBOT_GOTH_CLOSEUP: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      archetype,
      skin,
      eyes,
      hair_color,
      hairstyle,
      makeup,
      wardrobe,
      accessory,
      candid_moment,
      camera_perspective,
    } = slots;

    return `You are a gothic dark-manga concept-art painter writing HAUNTINGLY BEAUTIFUL gothic woman closeups for GothBot. SEXY, SULTRY, EVIL, FEISTY dark seductresses with corrupted beauty and dangerous power. Camera catches her candidly close-up in a loaded moment. Castlevania / Crimson-Peak / Bloodborne / Devil-May-Cry dark-beauty lineage.

━━━ ONE WOMAN ALONE — ABSOLUTE FIRST RULE ━━━
ONE woman. SOLO. No companions, no lovers, no second figure, no hands belonging to anyone but her. She is ALONE and DANGEROUS. She is a woman (she/her), adult, never child.

━━━ TIGHT CLOSEUP FRAMING — FACE FILLS UPPER HALF ━━━
Tight frame — face + throat + one shoulder at most. Face fills the upper half of the frame. Camera is TOO CLOSE for comfort. She is NOT posing — she was caught in the middle of the candid moment described below.

━━━ CAMERA PERSPECTIVE (use this EXACT angle) ━━━
${camera_perspective}

━━━ SHE MUST LOOK LIKE SHE EXISTS — OBSESSIVE DETAIL ━━━
Render her with obsessive detail. She must feel REAL and DEVASTATING:
• FACE: every pore visible, cheekbones catching light like carved marble, dark circles that look intentional — power and centuries in her gaze
• SKIN: render the EXACT skin description from her pool — how light hits it, how shadow pools in her collarbones, how it catches candlelight or moonlight
• EYES: the HERO of the frame — glowing, supernatural, impossibly vivid. They radiate light onto the skin around them. The iris is a universe
• MAKEUP: BOLD and DRAMATIC — dark glamour she CHOSE. Sharp where it's sharp, smudged where it's smudged. Devastating intentional dark beauty
• HAIR: wild, wind-caught, rain-damp, tangled with pins or chains or dead flowers — never salon-perfect, always gorgeous in its chaos
• BODY LANGUAGE: predatory confidence. She knows she's watched and doesn't care. Or she does care, and that's worse

━━━ HER CORE IDENTITY (informs her ENERGY) ━━━
${archetype}

━━━ HER SKIN ━━━
${skin}

━━━ HER EYES ━━━
${eyes}

━━━ HER MAKEUP ━━━
${makeup}

━━━ HER HAIR ━━━
${hair_color}, ${hairstyle}

━━━ WARDROBE (visible at frame edge — neckline / shoulder / collar) ━━━
${wardrobe}

━━━ HER SIGNATURE ACCESSORY (close-frame detail — collarbone / neckline / hand) ━━━
${accessory}

━━━ CANDID MOMENT (she was caught doing THIS) ━━━
${candid_moment}

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

━━━ VAMPIRESS / WOMAN-OF-THE-NIGHT MANDATE — APPLY TO EVERY RENDER ━━━
Every render leans VAMPIRESS / DARK-SEDUCTRESS / WOMAN-OF-THE-NIGHT — corrupted-beauty aristocrat of the gothic night. Even if her archetype reads as witch or sorceress, the AESTHETIC is vampiress:
• DEEP SMOKEY EYE SHADOW MANDATORY — heavy smudgy dark-charcoal / dark-plum / dark-burgundy / kohl-and-coal pulled down from the lid into half-circles beneath the eyes — a "sleepless aristocrat" look. NEVER clean / minimal eye makeup. Eye shadow EXTENDS dramatically below and beside the eye, smudged not graphic.
• VAMPIRE PALLOR or VAMPIRE FLUSH — skin reads CORRUPTED, paler than human-natural or warmly-unnatural. A faint dark-violet undertone beneath her eyes. The skin of someone who has not seen morning in a long time.
• DARK STAINED LIPS — every render has dark-burgundy / oxblood / deep-plum / matte-black / wine-stained lips. NEVER nude / pink / natural-tone lips.
• WOMAN-OF-THE-NIGHT BODY LANGUAGE — gazing out a velvet-curtained window, sipping from a crystal goblet, kissing a pendant, hands at her own throat, dragging her fingers through her hair, half-lidded knowing eyes. Languid not energetic. She has all the time in the world.
• CANDLE / FIREPLACE / OIL-LAMP warm-amber light mixing with cool moonlight on her face — atmospheric, intimate.
• OPULENT VAMPIRE-GOTH wardrobe — velvet, silk, black-lace, brocade — NEVER modern, NEVER plain.

━━━ DRAMATIC VISUALS — CRANK IT ━━━
Go MAXIMUM. Eyes BLAZE. Makeup is DEVASTATING smokey-deep eye shadow. Lighting carves her face into something MYTHIC. Every element cranked to jaw-dropping visual impact. Painterly oil-on-canvas. Castlevania-Symphony-of-the-Night vampire-portrait energy.

━━━ HARD BANS ━━━
🚫 NO multiple figures / NO second person / NO additional hands — she is ALONE
🚫 NO devil horns / NO pentagrams / NO satanic symbols
🚫 NO anime-smooth / NO Halloween costume / NO cosplay
🚫 NO magazine editorial / NO fashion photography / NO glamour-shot energy
🚫 NO nipples / NO bare-cleavage emphasis / NO lingerie — NSFW-clean
🚫 NO posing / "editorial" / "fashion shoot" / "glamour shot" language
🚫 NO modern / cyberpunk / sci-fi
🚫 NO real-world ethnic codes (gothic-fantasy archetypes only)
🚫 NO child / teen / pubescent figures
🚫 NO cheap gore / NO blood-on-her-mouth as default (only if rolled in candid_moment)

━━━ STRUCTURE (write in this order) ━━━
[camera perspective], [her face — skin + eyes + makeup], [her hair color + hairstyle], [the candid moment — what she's doing], [wardrobe visible at frame edge], [accessory close-frame detail], [lighting carving her features], [atmosphere at edges], [color palette]

Output ONLY the 60-80 word scene description, comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO bold labels, NO "render as" suffix. Just the phrases, starting immediately with the scene content.`;
  },

  GOTHBOT_COZY_GOTH: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      interior_space,
      magical_glow_item,
      occult_artifact,
      figure_accent,
      ambient_atmosphere,
    } = slots;

    const magicList = Array.isArray(magical_glow_item) ? magical_glow_item : [magical_glow_item];
    const occultList = Array.isArray(occult_artifact) ? occult_artifact : [occult_artifact];

    return `You are a gothic-interior painter writing LAYERED WITCH'S-LAIR / WIZARD'S-WORKROOM scenes for GothBot. Warm-dark gothic interiors with a TWIST OF MAGIC — densely packed with GLOWING potions, RUNED artifacts, MYSTICAL crystal orbs, grimoires with luminous text, and occult curios — inhabited by a SMALL mysterious-goth-feminine figure at deep midground as ATMOSPHERIC SCALE-PROVER ONLY. GOTH + MAGIC, never grim-death-cabinet. Painterly oil-on-canvas aesthetic — Practical Magic apothecary, Hocus Pocus witch-house, Studio Ghibli Howl's-Moving-Castle workroom, Pan's Labyrinth magical study, Harry Potter Hogwarts-divination-tower.

━━━ INTERIOR IS THE HERO — ABSOLUTE FIRST RULE ━━━
The room and its layered curio-cabinet contents fill 80%+ of visual weight. The single mysterious-goth-feminine figure is SCALE-PROVER ONLY at 8-15% of frame, positioned at DEEP MIDGROUND or MIDGROUND CORNER (never foreground, never centered, never the subject). The viewer's eye lands on the room first, the magical trinkets second, and only then notices the figure as a small atmospheric witness. SOLO — only ONE figure ever. NO faces in close-up — figure is small, often partially turned away, partly silhouetted by candlelight.

━━━ NO BODIES / ORGANS / CADAVERS — ABSOLUTE BAN ━━━
NO anatomical models, NO skeleton displays, NO cadaver-art, NO organ-in-jar specimens, NO body-part imagery, NO mortuary-coded oddities. The aesthetic is MAGICAL not MORBID. Skulls allowed only as small accent (one skull-on-shelf max, not center-frame). Bones allowed only as occult-ritual tools (rune-carved bone-dice / bone-handle athame), not as anatomy displays.

━━━ THE ROOM IS THE HERO — INTIMATE MID-CLOSE FRAME ━━━
Mid or mid-close intimate frame, looking INTO a corner / alcove / shelf-cluster of the interior. The space FILLS 80%+ of the frame. Camera at eye-level or slightly elevated, looking at a richly-furnished section of the room — never a wide empty hall, always a CORNER PACKED WITH STUFF. The viewer should want to study every square inch.

━━━ DENSELY LAYERED — THIS IS THE SIGNATURE ━━━
EVERY SURFACE IS LAYERED. Books piled on books, glowing potion-jars stacked on shelves, hanging dried herbs in bundles overlapping, candles in melted clusters, magical artifacts crammed into every nook. 5+ depth layers from foreground to back-shelf, with stuff at every layer. Wonder-cabinet density of MAGICAL curios.

━━━ THREE MAGICAL GLOWING ITEMS — render visibly in the frame ━━━
  • MAGIC 1: ${magicList[0] || ''}
  • MAGIC 2: ${magicList[1] || ''}
  • MAGIC 3: ${magicList[2] || ''}

━━━ THREE OCCULT ARTIFACTS — render visibly in the frame ━━━
  • OCCULT 1: ${occultList[0] || ''}
  • OCCULT 2: ${occultList[1] || ''}
  • OCCULT 3: ${occultList[2] || ''}

PLUS layer additional cozy-gothic items throughout to achieve curio-cabinet density:
• ANTIQUE BOOKS piled high, leather-bound spines, gilt titles
• APOTHECARY JARS with hand-written labels, mysterious contents
• MELTED CANDLES in brass candelabras and wrought-iron stands, wax pools
• DRIED HERBS hanging in bundles from rafters
• PRESSED-FLOWER frames and botanical illustrations on walls
• BRASS INSTRUMENTS — astrolabes, sextants, pendulums, magnifying lenses
• VELVET cloth draped over surfaces, gold-tassel trim
• PARCHMENT scrolls partially unfurled
• ANTIQUE MAPS pinned to walls
• CRYSTAL clusters and geodes on shelves, faint glow
• ANTIQUE GLASS BOTTLES with colored contents
• WROUGHT-IRON sconces, lanterns
• COBWEBS at cornices, dust on top shelves

━━━ WARM-DARK COZY PALETTE ━━━
WARM AMBER PRIMARY — candle-amber, hearth-glow, oil-lamp gold. Deep mahogany and burgundy wood-tones. Rich-velvet plum, burgundy, forest-green secondary surfaces. Brass-and-bronze accents. Aged-parchment yellow. Deep-violet and indigo in shadows. ACCENT jewel-tones in stained-glass, crystal, potion-bottles (sapphire / emerald / amethyst / ruby / amber-honey). NEVER cold-blue dominant, NEVER stark-white, NEVER neon. Picture an oil painting of an 1860s alchemist's study at midnight.

━━━ LIGHTING — WARM POOLS, DEEP SHADOWS ━━━
Multiple WARM LIGHT SOURCES create pools of amber illumination — candles, oil lamps, fireplace embers, stained-glass with warm light behind. Light is SOFT and INTIMATE. Deep shadows in corners and under shelves. Volumetric warm-light rays catching dust-motes.

━━━ MOOD — HAUNTINGLY COZY ━━━
WARM + INTIMATE + OBSESSIVELY LAYERED + PEACEFUL + slightly EERIE without scary. A witch-scholar-collector's space inhabited for centuries with a story behind every object.

━━━ STRICT GOTHBOT COZY-GOTH ━━━
🚫 NO multiple figures — SOLO only (one feminine figure max)
🚫 NO foreground figure / NO centered figure / NO portrait framing — figure is SCALE-PROVER at 8-15% frame, deep midground
🚫 NO bodies / organs / cadavers / anatomical-models / skeleton-displays / mortuary oddities — MAGICAL not MORBID
🚫 NO sexualized / cheesecake / lingerie — sleek-gothic-mysterious, not pin-up
🚫 NO sci-fi / modern / cyberpunk / neon
🚫 NO real-world ethnic codes (gothic-romanticized only — no actual folk costumes)
🚫 NO bright daylight — always candle-and-firelight + magical-glow
🚫 NO cold-blue dominant — warm-amber primary
🚫 NO sterile / sparse — DENSELY LAYERED mandatory
🚫 NO outdoor scenes — pure interior
🚫 NO grim death-cabinet — peaceful magical warmth
✓ Practical Magic / Hocus Pocus / Howl's Moving Castle / Pan's Labyrinth / Harry Potter / 19th-c alchemist's study engravings visual lineage

━━━ THE INTERIOR SPACE ━━━
${interior_space}

━━━ THE MYSTERIOUS-GOTH-FEMININE FIGURE — DEEP MIDGROUND SCALE-PROVER ━━━
${figure_accent}

She is SMALL in the frame (8-15% of visual weight), positioned at deep midground or midground corner, partly absorbed into the warm-shadow of the room. SOLO — only one figure. Often partially turned away, partly silhouetted by candlelight. She belongs in the space — she is part of the atmospheric inventory, not its subject.

━━━ AMBIENT ATMOSPHERE ━━━
${ambient_atmosphere}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION — INTIMATE MID-CLOSE, DENSELY LAYERED ━━━
MID or MID-CLOSE intimate frame. Looking INTO a corner/alcove/shelf-cluster — never wide empty hall. 5+ depth layers from foreground tabletop / shelf-edge through midground shelves of stuff / deeper shelves and walls / back wall with hanging items / ambient air with dust-motes and candle-smoke. Curio-cabinet density throughout.

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: the interior space described], [three magical glowing items visible at varied depth], [three occult artifacts visible at varied depth], [layered cozy-gothic items filling surrounding surfaces — books, candles, jars, herbs, instruments], [the small mysterious-goth-feminine figure at deep midground as scale-prover], [ambient atmosphere — dust-motes / candle-smoke / etc.], [warm-amber lighting with deep-shadow contrast], [warm-dark palette with jewel-tone accents], [hauntingly cozy mood]

DRAMATIC VISUALS: DENSELY LAYERED. CURIO-CABINET DENSITY. WARM-AMBER. Interior is hero, figure is small scale-prover. Painterly oil-on-canvas.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  GOTHBOT_CASTLEVANIA_SCENE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      structure,
      architectural_detail,
      inner_light,
      accent_creature,
      spice_decoration,
      sky_layer,
    } = slots;
    const details = Array.isArray(architectural_detail)
      ? architectural_detail
      : [architectural_detail];

    const accentSection = accent_creature
      ? `
━━━ CASTLEVANIA ACCENT CREATURE (bat / gargoyle / shadow — atmospheric only) ━━━
${accent_creature}

`
      : '';

    return `You are an Ayami Kojima concept-art painter illustrating KONAMI CASTLEVANIA architecture. STRICT visual lineage: Symphony of the Night / Castlevania Bloodlines / Lament of Innocence / Curse of Darkness / Order of Ecclesia / Lords of Shadow / Aria of Sorrow promotional art. The architecture is the hero. Painted, ornate, art-nouveau gothic. Wallachian / Vlad-Tepes / Bram-Stoker-Dracula coded.

━━━ STRICT KONAMI CASTLEVANIA ONLY — ABSOLUTE FIRST RULE ━━━
This is NOT generic gothic. This is NOT Bloodborne. This is NOT Hammer-horror. This is NOT Crimson-Peak. This is KONAMI'S CASTLEVANIA aesthetic specifically — Dracula's castle, the Inverted Castle, the Clock Tower, Olrox's Quarters, the Royal Chapel, the Marble Gallery, Brauner's Gardens, the Alchemy Laboratory, the Underground Caverns, the Library. Art-nouveau ornate gothic with Konami's specific palette: violet / blood-crimson / amber-candle / gold-leaf / sapphire-stained-glass / wrought-iron-black. Painted by Ayami Kojima.

━━━ STRUCTURE IS THE HERO — 80% VISUAL WEIGHT ━━━
The Castlevania building DOMINATES the frame. NO humans as primary subject (Belmont silhouette OK as scale-prover only). NO interior chamber-shots in this MVP — EXTERIOR or grand-portal/atrium-from-outside only.

━━━ ARCHITECTURAL DETAIL PORN — KONAMI ORNATE ━━━
Every surface is obsessively detailed in Castlevania-art-nouveau style. Render ALL THREE of these specific architectural flourishes VISIBLY:

  • DETAIL 1: ${details[0] || ''}
  • DETAIL 2: ${details[1] || ''}
  • DETAIL 3: ${details[2] || ''}

PLUS layer additional Castlevania-canon ornamentation:
• ART-NOUVEAU GOTHIC tracery with vine-and-skull motifs
• BAT-WING and GARGOYLE finials on every spire
• WROUGHT-IRON gates with bat / wyvern / dragon-head heraldic devices
• STAINED-GLASS rose-windows (sapphire / violet / crimson) lit from within
• MARBLE COLUMNS with carved-relief friezes of saints and demons
• CHANDELIERS of bronze and gold visible through arched windows
• DRACUL HERALDRY — dragon-and-cross emblem of the House of Drăculești
• ORNATE BALUSTRADES with gargoyle-headed posts
• CARVED-MARBLE statuary of fallen-angels and stone-saints
• VELVET BANNERS in crimson and gold hanging from the structure

━━━ MOOD — CASTLEVANIA OPERATIC GRANDEUR — BOLD & LUSH ━━━
HAUNTING + REGAL + ORNATE + WALLACHIAN + GOTHIC-OPERA — but BOLD, LUSH, and FULL-COLOR-SATURATED. The structure is grand, beautiful, forbidding, OPULENT, MAGNIFICENT. Centuries-old royal ancestral seat of Dracula at the HEIGHT of its glory. The kind of building that opens a Castlevania stage with theatrical fanfare and rich painted-canvas color.

━━━ CASTLEVANIA-CANON PALETTE — BOLD, LUSH, FULL-COLOR-SATURATED ━━━
This path is BOLD AND LUSH — Konami's full-saturation Symphony-of-the-Night box-art palette. Embrace the RICHEST possible Castlevania colors:
  • DEEP RICH VIOLET twilight skies, royal-violet curtains of cloud
  • DEEP BLOOD-CRIMSON velvet banners, scarlet rose-windows, ruby-stained-glass
  • LUSH SAPPHIRE-and-COBALT stained-glass at saturated full-color
  • OPULENT GOLD-LEAF on every spire-tip, every chandelier, every cornice
  • EMERALD-and-JADE forest-canopy at the castle base, jade-trim on chandeliers
  • AMBER-and-WARM-CANDLE GOLD glowing from every window
  • OCCASIONAL VIVID-ROSE-PINK or VIOLET-MAGENTA accents in stained-glass
  • PEARL-WHITE and BONE-WHITE marble columns with shimmer
  • Stained-glass GLOWS richly — sapphire / violet / scarlet / amber / emerald / rose-pink
  • The full-moon backdrop is BIG and richly-colored — amber-gold, ivory, or pale-blood-amber
  • This is the OPPOSITE of muted / desaturated / monochrome — every quadrant SATURATED with color
✓ FULL COLOR SATURATION mandate — boldly painted, lushly hued, OPULENT

🚫 NO LOTR / Skyrim / Witcher / Warcraft / Tolkien vocabulary
🚫 NO modern / industrial / sci-fi / cyberpunk
🚫 NO real-world ethnic codes
🚫 NO Bloodborne / NO Hammer-horror / NO Crimson-Peak — this is KONAMI'S CASTLEVANIA only
🚫 NO humans as primary subject (single small Belmont/Alucard silhouette OK as scale-prover)
🚫 NO interior chamber-shots — exterior or grand-portal only
🚫 NO pentagram / satanic iconography
🚫 NO cheap gore / NO Jack-Skellington stylization
✓ Symphony-of-the-Night / Bloodlines / Lament-of-Innocence / Curse-of-Darkness / Order-of-Ecclesia / Lords-of-Shadow / Aria-of-Sorrow visual lineage

━━━ THE CASTLEVANIA STRUCTURE (hero, 80%+ visual weight) ━━━
${structure}

━━━ INNER CASTLE LIGHT (Castlevania glow) ━━━
${inner_light}

Light leaks through stained-glass / rose-windows / chandelier-windows / doorways. The castle feels ALIVE.

━━━ NIGHT SKY ━━━
${sky_layer}
${accentSection}━━━ SPICE — small Castlevania flourish (mandatory) ━━━
${spice_decoration}

━━━ LIGHTING (ambient weather, NOT the castle's internal glow) ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION — CASTLEVANIA ESTABLISHING SHOT ━━━
The Castlevania structure FILLS THE FRAME at 80% visual weight. Multi-tier depth:
• FOREGROUND: closest ornate detail — a gargoyle / wrought-iron gate / carved-marble balustrade / stained-glass / vine-motif tracery
• MIDGROUND: the castle body with inner-glow leaking through stained-glass
• DEEP DISTANCE: more castle receding (towers, wings) / mountain-crag / Wallachian landscape
• SKY: violet twilight or moonlit, dramatic

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: "[Castlevania structure description]" 80% weight], [three architectural details], [stained-glass / rose-window inner-glow], [accent creature if rolled], [night sky], [spice flourish], [Castlevania-canon palette + ornate art-nouveau gothic + Ayami Kojima painted style]

DRAMATIC VISUALS: STRICT KONAMI CASTLEVANIA. ORNATE ART-NOUVEAU GOTHIC. AYAMI KOJIMA painted. Render the EXACT architectural detail from slots.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  GOTHBOT_GOTHIC_ARCHITECTURE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      structure,
      architectural_detail,
      inner_light,
      accent_creature,
      spice_decoration,
      sky_layer,
    } = slots;
    const details = Array.isArray(architectural_detail)
      ? architectural_detail
      : [architectural_detail];

    const accentSection = accent_creature
      ? `
━━━ ACCENT CREATURE (dark-wildlife, atmospheric scale-prover) ━━━
${accent_creature}

A small dark-wildlife accent that adds life without competing with the structure. Renders at midground edge or perched on the architecture itself.

`
      : '';

    return `You are a gothic-architecture concept-art painter writing STRUCTURE-AS-HERO scenes for GothBot. The gothic building IS the show — fills the frame, ornate detail everywhere, lit from within by dark magic. Castlevania / Bloodborne / Crimson-Peak / Berserk / Dark-Souls / Elden-Ring / Van-Helsing visual lineage. NEVER LOTR / Skyrim / Witcher high-fantasy vocabulary.

━━━ STRUCTURE IS THE HERO — ABSOLUTE FIRST RULE ━━━
The gothic building DOMINATES the frame (80%+ visual weight). The landscape around it SUPPORTS, never competes. NO humans as primary subject. NO interior shots — EXTERIOR ARCHITECTURE only. The viewer's eye lands on the BUILDING first, the architectural details second, the inner-glow third, the surrounding context fourth.

━━━ GRAND MASSIVE SCALE — NON-NEGOTIABLE ━━━
The structure is VAST and COMPLEX — a full-blown castle / cathedral / fortress with ALL the bells and whistles. Multiple wings, multi-tier curtain walls, central keep, dozens of towers and spires, ornate facades, deep courtyards, sprawling battlements. Like Hogwarts / Minas Tirith / Stormwind / Castlevania-2-Dracula's-castle / Helm's-Deep / Notre-Dame — not a single tall spire-tower, but a SPRAWLING ARCHITECTURAL COMPLEX with massive scope.

Compositional language for massive scale:
• The structure is COMPLEX — multiple visible wings, sections, towers, courtyards, walls all working together
• Foreground at the BASE of the structure — cliff-edge / approach-road / lower courtyard / valley-floor / moat
• Camera angle EYE-LEVEL or LOW-ANGLE looking up/across (never high-angle aerial)
• Structure fills most of the frame — base near bottom, complex roofline reaching upper third
• Surrounding context (mountains / forest / cliffs / sea) is BELOW or AROUND the structure
• Use scale-prover language: "vast multi-wing fortress sprawling across the cliff-top," "the central keep flanked by twin lesser wings spreading wide," "stacked tier-on-tier curtain walls," "the cathedral-complex spreading across the entire ridge"

🚫 NEVER a single needle-thin spire-tower as the whole structure
🚫 NEVER a slim vertical-only silhouette — combine vertical AND horizontal mass together
🚫 NEVER a tall narrow lighthouse-style isolation

THINK HOGWARTS-CASTLE establishing-shot / MINAS-TIRITH-from-Pelennor / STORMWIND-cathedral-quarter / CASTLEVANIA-2-DRACULA'S-CASTLE / HELM'S-DEEP-establishing / NOTRE-DAME-with-flying-buttresses-and-towers / CRIMSON-PEAK-MANSION-from-the-approach — the SPRAWLING COMPLEX of architecture with massive scope is the signature.

━━━ INNER DARK-MAGIC LIGHT — MANDATORY ━━━
The structure is LIT FROM WITHIN — light leaks through windows / rose-windows / cracks / doorways. Source is dark magic / candles / witch-fire / fel-green / sapphire-necromantic / violet-spell / alchemist-gold / amber / blacklight — NEVER sunlight, NEVER exterior illumination as primary. The building feels ALIVE from inside.

━━━ ARCHITECTURAL DETAIL PORN — NON-NEGOTIABLE ━━━
EVERY SURFACE OF THE STRUCTURE IS OBSESSIVELY ORNATE. Hyper-detailed gothic-horror architecture porn — every wall has carved relief, every window has stone tracery, every cornice has gargoyles, every spire has crockets, every buttress has scrollwork. The building is a fractal of intricate detail at every readable scale. The viewer should want to STUDY every quadrant of the structure for ornament.

Render ALL THREE of these specific architectural flourishes VISIBLY in the frame:

  • DETAIL 1: ${details[0] || ''}
  • DETAIL 2: ${details[1] || ''}
  • DETAIL 3: ${details[2] || ''}

PLUS layer additional ornate detail throughout — every surface reads as carved, weathered, intricate:
• FLYING BUTTRESSES with carved-stone scrollwork
• ROSE-WINDOWS with intricate tracery
• POINTED SPIRES with crockets and pinnacles
• GARGOYLES and GROTESQUES at every corner
• WROUGHT-IRON gates and weathervanes
• STONE-ANGEL statuary lining buttresses
• DRAGON-HEAD water-spouts and bat-motif finials
• VAULTED ARCHES with carved keystones
• WEATHERED relief carvings of saints / demons / wyrms
• IVY and bioluminescent moss creeping along walls

━━━ MOOD — ELEGANT GOTHIC DARKNESS ━━━
HAUNTING + ALLURING + ORNATE + WEATHERED + ALIVE-FROM-WITHIN. The structure is gorgeous and unsettling. Centuries-old, ruined-but-not-fallen, something inside still breathes. Operatic dark romance. The kind of building that belongs on a Castlevania-game cover, a Crimson-Peak movie poster, a Bloodborne-area-establishing-shot.

━━━ TWILIGHT COLOR — WEAVE MULTIPLE HUES ━━━
NOT gray-monochrome. NOT red-monochrome. The Nightshade spectrum: violet-twilight skies, emerald-occult witch-fire, sapphire-nocturne deep-blues, rose-dusk horizons, fel-green warlock glow, necro-pale-blue, plus warm accents — candle-amber, torch-orange, forge-ember, alchemist-gold. ONE dominant atmosphere hue + ONE warm accent + ONE cool accent per render.

━━━ STRICT GOTHBOT DARK-FANTASY ━━━
🚫 NO LOTR / Skyrim / Witcher / Warcraft / Tolkien vocabulary
🚫 NO modern / industrial / sci-fi / cyberpunk / neon
🚫 NO real-world ethnic codes
🚫 NO humans as primary subject (accent-only for atmospheric scale)
🚫 NO red-fog / red-mist / blood-red-stained-glass dominant (palette is purple/violet/blue/green/silver/black with red as ACCENT only)
🚫 NO blood-moon dominating the sky (~10% max)
🚫 NO interior shots — EXTERIOR architecture only
🚫 NO generic "castle silhouette on cliff" — SHOW the architectural detail
🚫 NO pentagrams / satanic iconography
🚫 NO cheap gore / NO Jack-Skellington stylization
✓ Castlevania / Bloodborne / Crimson-Peak / Berserk / Dark-Souls / Elden-Ring / Van-Helsing visual lineage

━━━ THE GOTHIC STRUCTURE (hero of the frame, 80%+ visual weight) ━━━
${structure}

The structure fills the frame at multi-tier depth. Camera angles vary — low-angle looking up at towering spires / high-angle looking down on courtyards / eye-level frontal establishing / over-the-hill approach / across-the-moat / through-gate perspective.

━━━ INNER DARK-MAGIC LIGHT ━━━
${inner_light}

The glow leaks from windows / rose-windows / cracks / doorways. The structure feels ALIVE from inside.

━━━ TWILIGHT SKY OVERHEAD ━━━
${sky_layer}

The sky is SATURATED and THEATRICAL. Gothic twilight palette dominant. CRITICAL — the sky must FRAME the structure, never compete with it. Aurora / phenomena should be confined to upper-frame edges, not consume the upper third. Lean toward CLEAN sky backdrops (deep violet, single vivid moon, distant clouds) that let the structure's vertical silhouette dominate.
${accentSection}━━━ SPICE DECORATION — small atmospheric flourish (mandatory) ━━━
${spice_decoration}

A SMALL atmospheric flourish — never frame-filling. If the spice is a vivid moon, render it as a focal element behind the structure (one quadrant) but NOT consuming the whole sky. If the spice is an aurora, keep it to a stripe at the upper edge. If the spice is lanterns, place them at the structure's base or along an approach. The spice ADDS character, never competes with the structure's vertical scale.

━━━ LIGHTING (ambient weather lighting outside the structure) ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION — STRUCTURE-DOMINATES, MULTI-TIER DEPTH ━━━
The structure FILLS THE FRAME (80%+ visual weight). Multi-tier depth mandatory:
• FOREGROUND: closest architectural detail — a carved buttress / gargoyle in profile / wrought-iron gate / weathered statuary / ornamental crenellation
• MIDGROUND: the structure body with inner-glow visible through windows / rose-windows / doorways
• DEEP DISTANCE: more of the structure receding / outer towers / supporting wings / one slice of surrounding landscape
• SKY: dramatic twilight overhead

Camera angle varies but the building DOMINATES. Inner-glow leaks through openings. Ornate gothic detail at every readable scale.

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: "[gothic structure description]" leading the frame at 80%+ weight], [the three architectural details visible in the frame], [inner-glow leaking through windows / rose-windows / cracks], [accent creature if rolled], [sky overhead], [supporting landscape context briefly], [lighting + atmospheric layer], [color palette + mood]

DRAMATIC VISUALS: the STRUCTURE is the hero. Render the EXACT architectural detail from slots. Inner-glow mandatory. Ornate detail porn. NO humans primary. NO interior shots. STRICT gothic dark-fantasy.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  GOTHBOT_GOTHIC_VISTA: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, biome, architecture, surprise_element, sky_layer, phenomenon } =
      slots;

    const phenomenonSection = phenomenon
      ? `
━━━ SUPERNATURAL PRESENCE — render visibly in the scene ━━━
${phenomenon}

A supernatural phenomenon woven into the landscape — render as a visible focal point that AMPLIFIES the haunting alive-watching mood.

`
      : '';

    return `You are a gothic dark-fantasy landscape painter writing AWE-INDUCING GOTHIC VISTAS for GothBot. Castlevania / Bloodborne / Crimson-Peak / Berserk / Tim-Burton / Van-Helsing / Dark-Souls / Elden-Ring visual lineage. NEVER LOTR / Skyrim / Witcher / Warcraft high-fantasy vocabulary — strict gothic dark-fantasy ONLY.

━━━ NO CHARACTERS — ABSOLUTE FIRST RULE ━━━
Pure gothic world. NO hero figures, NO silhouettes, NO soldiers, NO vampires, NO humans of any kind. The LAND is the subject. Dark wildlife (crow / bat / wolf / owl / fireflies / spectral wisps) at scale-prover size is REQUIRED, but NEVER a humanoid figure.

━━━ THE LAND IS ALIVE AND HAUNTED — NON-NEGOTIABLE ━━━
The landscape is NOT a dead backdrop — it is a LIVING BREATHING GOTHIC WORLD that is GORGEOUS and UNSETTLING simultaneously. Beauty and dread inseparable.

EVERY render MUST stack ALL of these dark-life elements:

  1. **DARK-WILDLIFE PRESENCE** (mandatory) — crows wheeling in ominous formations / bats streaming from a belfry in black ribbons / wolves watching from a treeline / owls perched on gargoyles / fireflies drifting through graveyards like wandering spirits / moths circling unlit lanterns / spectral wisps between headstones. AT LEAST ONE form of dark-wildlife clearly visible in every render.
  2. **BIOLUMINESCENT DARK-FLORA** — black moss reclaiming crumbling stone / creeping ivy strangling iron gates / nightshade and belladonna blooming where graves were dug / moonflowers opening in silver light / ghostly pale wildflowers in cursed soil / bioluminescent fungi pulsing in crypt-corners
  3. **STRUCTURES GLOWING FROM WITHIN** — cathedral windows bleeding witch-fire green / candle-light through shattered stained-glass in violet-amber / forge-glow from a distant ruin suggesting something still burns / lit-windows in a distant tower despite no one being there
  4. **SUPERNATURAL-PRESENCE SIGNALS** — fog that moves against the wind / shadows pooling where no object casts them / lights flickering in impossible patterns / fireflies converging into formations / a single bell-tolling-ripple in the mist

━━━ MOOD — AWE WITH DREAD ━━━
HAUNTING + ALLURING + ALIVE + WATCHING. The most beautiful place you've ever seen, and something is deeply WRONG with it. The land REMEMBERS what happened here and hasn't forgiven it. Something ancient watches from every ruin. The beauty is a lure. Operatic dark romance with a hint of danger.

━━━ TWILIGHT COLOR — WEAVE MULTIPLE HUES ━━━
NOT gray-monochrome. NOT red-monochrome. Every scene weaves MULTIPLE accent hues. Pull from the full Nightshade spectrum: violet-twilight, emerald-occult witch-fire, sapphire-nocturne deep-blues, rose-dusk horizons, fel-green warlock glow, necro-pale-blue, plus warm accents — candle-amber, torch-orange, forge-ember, alchemist-gold. ONE dominant atmosphere hue + ONE warm accent + ONE cool accent per render.

━━━ MOVIE POSTER MANDATE — EVERY QUADRANT MUST HAVE SOMETHING STRIKING ━━━
This is the FLAGSHIP gothic-vista path. Every render is a MOVIE POSTER PROMOTIONAL FRAME with VERTIGO-INDUCING SCALE. The kind of vista that stops the viewer mid-scroll. The kind of frame that opens a Castlevania stage, opens a Bloodborne area, opens a Crimson Peak act. EVERY QUADRANT of the frame has something striking — no quiet corners.

OBSESSIVE-DENSITY MANDATE — stack ALL of these elements simultaneously in EVERY render:

  1. **THE ALIVE-AND-HAUNTED BIOME** at vertigo-inducing scale — multi-tier depth with foreground tactile detail + midground body + deep-distance atmospheric layer. NEVER a flat single-tier composition.
  2. **ARCHITECTURE ANCHOR GLOWING FROM WITHIN** — cathedral / castle / abbey / mausoleum / monastery / lighthouse-tower with visible INNER-GLOW (witch-fire green window / candle-amber tower / forge-ember basement / multiple impossibly-lit windows). Something is alive inside, even when nothing should be.
  3. **SUPERNATURAL ATMOSPHERIC PHENOMENON** (if rolled — fog-moving-wrong / spectral mist / will-o-wisp marching / shadow-pools / witch-fire aurora / phantom-carriage / fireflies-in-watching-eye-formation) DOMINATING its quadrant.
  4. **DARK-WILDLIFE SCALE PROVER** — visible crow-flock wheeling / bat-ribbon streaming from belfry / wolf-pack silhouette on ridge / owl on gargoyle / firefly swarm / spectral wisps. Dark-wildlife is MANDATORY in every frame — the LAND-IS-ALIVE signature.
  5. **TWILIGHT SKY** — violet-twilight / moonlit-violet / sickly-aurora / storm-bruised-purple / fel-violet-storm — SATURATED + THEATRICAL, never washed-out daylight.
  6. **BIOLUMINESCENT DARK-FLORA** — black-moss / nightshade-blooms / moonflowers / glowing-fungi / luminous-vines — at foreground or midground edge, providing the alive-watching pulse.

VERTIGO-INDUCING SCALE — every render must convey awe-inducing scope:
• Cliffs that drop a thousand feet into mist
• Cathedral spires piercing storm-clouds like fingers reaching for something
• Valleys so deep they vanish into violet mist
• Forests that stretch to every haunted horizon
• Mountain-passes leading to citadels half a mile distant
• Aerial views over haunted villages
• Canyon-gorges with stone aqueducts bridging the chasm

THE EYE SHOULD LAND ON 4+ STRIKING DETAILS in different quadrants. NOT just a centered beauty shot. NOT a single focal element. EVERY corner of the frame has dark-life, glow, scale, or supernatural presence.

THINK CASTLEVANIA-STAGE establishing-shot / BLOODBORNE-AREA intro-card / CRIMSON-PEAK-MANSION establishing-frame / TIM-BURTON-SLEEPY-HOLLOW-VISTA / VAN-HELSING-TRANSYLVANIA-ARRIVAL / BERSERK-ECLIPSE-VISTA — every frame should make the viewer GASP at the haunting alive-watching beauty.

━━━ STRICT GOTHBOT DARK-FANTASY ━━━
🚫 NO sci-fi / cyberpunk / nebulas / sky-whales / floating islands / orbital structures
🚫 NO modern / industrial architecture (no electric lighthouses / no factories — pre-industrial-Gothic only)
🚫 NO real-world ethnic codes
🚫 NO LOTR / Skyrim / Witcher / Warcraft / Tolkien vocabulary
🚫 NO blood-red-stained-glass dominant (windows DARK / MOONLIT VIOLET / CANDLE-AMBER / FEL-GREEN / WITCH-FIRE GREEN only)
🚫 NO red-fog / red-mist / red-everything (palette is purple/violet/blue/green/silver/black with red as ACCENT only)
🚫 NO blood-moon dominating the sky (red moon in at most 10% of renders)
🚫 NO interior chamber compositions (this is OUTDOOR LANDSCAPE)
🚫 NO cheap gore / NO satanic-tropes / NO Jack-Skellington stylization
✓ Castlevania / Bloodborne / Crimson-Peak / Berserk / Dark-Souls / Elden-Ring / Tim-Burton / Hellboy / Van-Helsing / Bram-Stoker-Dracula visual lineage

━━━ THE ALIVE-AND-HAUNTED BIOME ━━━
${biome}

The biome fills the frame at multi-tier depth. Foreground tactile detail (dark-flora / dark-wildlife at edge) → midground biome body (architecture glowing from within) → deep distance atmospheric layer.

━━━ ARCHITECTURE ANCHOR (glowing from within) ━━━
${architecture}

The architecture is the distant focal landmark — positioned at midground or deep distance with visible inner-glow (witch-fire windows / candle-tower / forge-ember / lit-windows-impossibly). Something is alive inside, even if nothing should be.

━━━ TWILIGHT SKY OVERHEAD ━━━
${sky_layer}

The sky is SATURATED and THEATRICAL — never washed-out natural blue, never daylight-bright. Gothic twilight palette dominant.
${phenomenonSection}━━━ DARK-WILDLIFE / SCALE PROVER — mandatory ━━━
${surprise_element}

Place at midground or foreground edge. The dark-wildlife (crow / bat / wolf / owl / fireflies / spectral wisps) gives the LANDSCAPE-IS-ALIVE signal — never a human figure, always atmospheric dark-life.

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

━━━ COMPOSITION — EPIC WIDE-VISTA THAT WATCHES YOU ━━━
WIDE LANDSCAPE VISTA — the camera is PULLED BACK. Show the FULL biome with architectural anchor at midground or deep distance, the surrounding terrain stretching to atmospheric horizon. Think Castlevania-stage establishing-shot / Bloodborne-area-intro-card. The ARCHITECTURE is a distant focal landmark with visible inner-glow, the LANDSCAPE is the hero, the DARK-WILDLIFE makes it alive.

MULTI-TIER DEPTH MANDATORY:
• FOREGROUND: tactile dark-flora / standing-stone / overgrown tomb / scale-prover crow on a fence / nightshade-bloom / bioluminescent fungi cluster
• MIDGROUND: biome body with architecture glowing from within — the castle / cathedral / abbey with visible inner-light
• DEEP DISTANCE: atmospheric layer — fog / cloud-bank / horizon-line with supernatural phenomenon
• SKY: saturated twilight overhead — violet / moonlit-silver / sickly-aurora / storm-bruised

Dramatic single-source lighting: MOONLIGHT (silver-violet) / TWILIGHT (lavender-indigo) / WITCH-FIRE (green glow from distant window) / CANDLE-CLUSTER (amber at distance) / FEL-GREEN RUNE-GLOW / BLACKLIGHT AURORA. The land is alive AND watching.

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: "[gothic biome description] alive with [dark-wildlife]"], [architectural anchor glowing from within at midground / deep distance], [the saturated twilight sky], [supernatural phenomenon if rolled], [dark-wildlife scale-prover at midground / edge], [bioluminescent dark-flora detail], [lighting and atmospheric detail], [color palette and mood]

DRAMATIC VISUALS: render the EXACT slot-pool details above. The land is ALIVE with dark-wildlife and bioluminescent flora. Architecture GLOWS FROM WITHIN. Something WATCHES. NO characters. NO LOTR vocabulary. NO interior. STRICT gothic dark-fantasy.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  GOTHBOT_DARK_LANDSCAPE: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, biome, architecture, surprise_element, sky_layer, phenomenon } =
      slots;

    const phenomenonSection = phenomenon
      ? `
━━━ ATMOSPHERIC PHENOMENON — render visibly in the scene ━━━
${phenomenon}

A supernatural / atmospheric event woven into the landscape — render as a visible focal point that AMPLIFIES the haunting mood.

`
      : '';

    return `You are a gothic dark-fantasy landscape painter writing DARK LANDSCAPE scenes for GothBot. Castlevania / Bloodborne / Crimson-Peak / Berserk / Tim-Burton / Van-Helsing / Dark-Souls / Elden-Ring visual lineage. Twilight color, baroque ruin, moonlit melancholy, vibrant haunting. NEVER LOTR / Skyrim / Witcher / Warcraft / high-fantasy DragonBot vocabulary — strict gothic dark-fantasy ONLY.

━━━ NO CHARACTERS — ABSOLUTE FIRST RULE ━━━
Pure gothic landscape. NO human figures, NO humanoid silhouettes, NO shadow-mages, NO hooded wanderers. The land is the hero. (A distant crow / bat / wolf-silhouette / single carrion-bird as atmospheric scale-prover OK — never a humanoid figure.)

━━━ MOOD — ELEGANT DARKNESS, NON-NEGOTIABLE ━━━
HAUNTING + ALLURING + VIBRANT + BAROQUE-RUINOUS + TWILIGHT-COLOR. Gorgeous and terrifying inseparable. The viewer feels UNSETTLED first, magnetized second. Operatic dark romance with a hint of danger. The kind of art that belongs on a Castlevania-game cover, a Hellboy-Mignola comic panel, or a Van-Helsing movie poster.

━━━ TWILIGHT COLOR — WEAVE MULTIPLE HUES ━━━
NOT gray-monochrome. NOT red-monochrome. Every scene weaves MULTIPLE accent hues. Pull from the full Nightshade spectrum: violet-twilight skies, emerald-occult witch-fire, sapphire-nocturne deep-blues, rose-dusk horizons, fel-green warlock glow, necro-pale-blue, nightshade-indigo, witch-green, plus warm accents — candle-amber, torch-orange, forge-ember, alchemist-gold. ONE dominant atmosphere hue + ONE warm accent + ONE cool accent per render. Darkness with VARIED COLOR.

━━━ MOVIE POSTER MANDATE — EVERY QUADRANT MUST HAVE SOMETHING STRIKING ━━━
Every render is a MOVIE POSTER PROMOTIONAL FRAME with VERTIGO-INDUCING SCALE. The kind of vista that stops the viewer mid-scroll. The kind of frame that opens a Castlevania stage, opens a Bloodborne area, opens a Crimson Peak act. EVERY QUADRANT of the frame has something striking — no quiet corners.

OBSESSIVE-DENSITY MANDATE — stack ALL of these elements simultaneously in EVERY render:

  1. **THE GOTHIC BIOME** at vertigo-inducing scale — multi-tier depth with foreground tactile detail + midground body + deep-distance atmospheric layer. NEVER a flat single-tier composition.
  2. **ARCHITECTURE ANCHOR** — castle / cathedral / abbey / mausoleum / monastery / fortress / lighthouse-tower at midground or deep distance, weathered and ruined.
  3. **ATMOSPHERIC PHENOMENON** (if rolled — spectral mist / witch-fire aurora / phantom-army / ash-fall / will-o-wisps / blood-moon / corpse-light) DOMINATING its quadrant.
  4. **SCALE PROVER** — tiny crow flock / bat silhouettes / wolf at edge / single distant lit-window — gives scale to the verticality. NO humanoid figures, only dark-wildlife / atmospheric details.
  5. **TWILIGHT SKY** — violet-twilight / moonlit-violet / sickly-aurora / storm-bruised purple — SATURATED + THEATRICAL, never washed-out daylight.
  6. **FOREGROUND TACTILE DETAIL** — weathered standing-stone / fallen banner / cracked tombstone / dead-bramble / scale-prover crow on stone — anchors the multi-tier depth.

VERTIGO-INDUCING SCALE — every render must convey awe-inducing scope:
• Cliffs that drop a thousand feet into mist
• Cathedral spires piercing storm-clouds
• Valleys so deep they vanish into violet mist
• Forests that stretch to every haunted horizon
• Mountain-passes leading to citadels half a mile distant
• Aerial views over haunted villages
• Canyon-gorges with stone aqueducts bridging the chasm

THE EYE SHOULD LAND ON 4+ STRIKING DETAILS in different quadrants. NOT just a centered beauty shot. NOT a single focal element. EVERY corner of the frame has detail, glow, scale, or atmospheric presence.

THINK CASTLEVANIA-STAGE establishing-shot / BLOODBORNE-AREA intro-card / CRIMSON-PEAK-MANSION establishing-frame / TIM-BURTON-SLEEPY-HOLLOW-VISTA / VAN-HELSING-TRANSYLVANIA-ARRIVAL / BERSERK-ECLIPSE-VISTA — every frame should make the viewer GASP at the haunting beauty.

━━━ STRICT GOTHBOT DARK-FANTASY ━━━
🚫 NO sci-fi / cyberpunk / nebulas / sky-whales / floating islands / orbital structures
🚫 NO modern / industrial architecture (no electric lighthouses, no factories — pre-industrial-Gothic only)
🚫 NO real-world ethnic codes
🚫 NO LOTR / Skyrim / Witcher / Warcraft / Tolkien vocabulary — NEVER write "Mordor / Rivendell / Skyrim hold / Witcher path / etc."
🚫 NO blood-red-stained-glass dominant (windows DARK / MOONLIT VIOLET / CANDLE-AMBER / FEL-GREEN only)
🚫 NO red-fog / red-mist / red-everything (palette is purple/violet/blue/green/silver/black with red as ACCENT only)
🚫 NO blood-moon dominating the sky (red moon in at most 10% of renders)
🚫 NO interior chamber compositions (this is OUTDOOR LANDSCAPE)
🚫 NO "looking through stone archway at gothic building in middle distance" cliché
🚫 NO cheap gore / NO satanic-tropes / NO Jack-Skellington stylization
✓ Castlevania / Bloodborne / Crimson-Peak / Berserk / Dark-Souls / Elden-Ring / Tim-Burton / Hellboy / Van-Helsing / Bram-Stoker-Dracula visual lineage

━━━ THE GOTHIC BIOME ━━━
${biome}

The biome fills the frame at multi-tier depth. Foreground tactile detail → midground biome body → deep distance atmospheric layer + architectural feature.

━━━ ARCHITECTURE ANCHOR ━━━
${architecture}

The architecture is the distant focal landmark — positioned at midground or deep distance, the landscape itself is the hero, but the architecture is what makes the frame UNMISTAKABLY GOTHIC.

━━━ TWILIGHT SKY OVERHEAD ━━━
${sky_layer}

The sky is SATURATED and THEATRICAL — never washed-out natural blue, never daylight-bright. Gothic twilight palette dominant.
${phenomenonSection}━━━ SURPRISE ELEMENT — secondary detail adding mood ━━━
${surprise_element}

Place at midground or deep midground. NO human/humanoid figures (path is pure landscape). Scale-prover animals / objects / supernatural-detail only.

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

━━━ COMPOSITION — EPIC WIDE-VISTA ━━━
WIDE LANDSCAPE VISTA — the camera is PULLED BACK. Show the FULL biome with architectural anchor at midground or deep distance, the surrounding terrain stretching to atmospheric horizon. Think John-Howe / Alan-Lee / Ted-Nasmith epic-fantasy concept-landscape painting (but rendered as Castlevania-stage / Bloodborne-area). The ARCHITECTURE is a distant focal landmark, the LANDSCAPE is the hero.

MULTI-TIER DEPTH MANDATORY:
• FOREGROUND: tactile detail — weathered standing-stone / fallen banner / cracked tombstone / dead-bramble / scale-prover crow on stone
• MIDGROUND: the biome body with architectural anchor — the castle / cathedral / abbey / village at distance
• DEEP DISTANCE: atmospheric layer — fog / cloud-bank / horizon-line / mountain-shadow
• SKY: saturated twilight overhead — violet / moonlit-silver / sickly-aurora / storm-bruised

Dramatic single-source lighting: MOONLIGHT (silver-violet) / TWILIGHT (lavender-indigo) / WITCH-FIRE (green glow from distant window) / CANDLE-CLUSTER (amber at distance) / FEL-GREEN RUNE-GLOW / BLACKLIGHT AURORA. NEVER blood-red-stained-glass dominant.

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: "[gothic biome description]"], [architectural anchor at midground / deep distance], [the saturated twilight sky], [phenomenon if rolled], [surprise element at midground / edge], [lighting and atmospheric detail], [color palette and mood]

DRAMATIC VISUALS: render the EXACT slot-pool details above. Twilight color, baroque ruin, vibrant haunting. NO characters. NO LOTR vocabulary. NO interior. STRICT gothic dark-fantasy.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  ARCANE_SPACES: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, hall, magic_phenomena } = slots;
    const phenomena = Array.isArray(magic_phenomena) ? magic_phenomena : [magic_phenomena];

    return `You are a fantasy concept-art painter writing GRAND ARCANE INTERIOR SPACES for DragonBot — vast magical architectural marvels saturated with active magic. NO CHARACTERS. The architecture is the hero, the magic phenomena are the show. Strict Western high fantasy.

━━━ NO CHARACTERS — ABSOLUTE FIRST RULE ━━━
Pure environment. ABSOLUTELY NO people, no robed-figures-at-base, no tiny-silhouettes-on-the-stair, no monks, no wizards, no humanoid figures of any kind anywhere in the frame. NEVER mention "figure" / "silhouette" / "hooded one" / "robed mage" / "figures arrayed" — the SPACE itself tells the story. If the urge arises to add a "lone figure for scale" — DO NOT. The architectural scale and magical phenomena provide their own scale.

━━━ GRAND INTERIOR SCALE + VARIETY — NON-NEGOTIABLE ━━━
The space is SUBSTANTIAL (not intimate cottage) but the EXACT shape varies per render — sometimes cathedral-vaulted, sometimes a soaring stairwell, sometimes a multi-tier circular library viewed up/down, sometimes a long banquet hall, sometimes a wide throne-room, sometimes a floating-platform library, sometimes a gateway-arch chamber. Render the SPECIFIC interior type from the slot — honor the architectural shape described. Variety across batches is mandatory.

Lean toward architectural richness when in doubt: multi-tier galleries, layered lanterns at every level, vertical depth, iron-railed mezzanines — these compositions consistently produce stronger renders than flat horizontal-gallery shots.

━━━ MAGIC SATURATION MANDATE — EVERY SURFACE ALIVE ━━━
The space is BUZZING with active magic, not "magical-themed decor." NOT a clean hall with 3 magical accents — the ENTIRE SPACE is alive with magic at every level. The eye should land on something magical EVERYWHERE it looks.

Render ALL THREE of these primary phenomena VISIBLY in the frame, stacked at different points in the space:

  • PHENOMENON 1: ${phenomena[0] || ''}
  • PHENOMENON 2: ${phenomena[1] || ''}
  • PHENOMENON 3: ${phenomena[2] || ''}

PLUS layer ALL of these throughout the space (obsessive density):
• EVERY COLUMN has glowing runic carvings pulsing in slow rhythm
• EVERY FLOOR TILE has faint inlaid runes catching light
• EVERY WALL has carved magical-script glowing softly
• THE AIR is THICK with glowing motes / sparkles / magical-pollen / floating particles
• THE CEILING has floating spell-orbs / suspended glowing crystals / hanging magical-lanterns
• SHELVES + ALCOVES + PEDESTALS each hold their own glowing magical artifact — glowing potion-bottles, jarred magical specimens, polished crystals, ancient relics
• DRIFTING MAGICAL MIST coils across the floor between columns
• MULTIPLE smaller spell-circles glow at various points beside the main one
• SCATTERED FLOATING OBJECTS — books / scrolls / orbs / crystals — hovering at varying heights
• ARC-LIGHTNING flickering between columns / between crystals / through suspended energy-globes
• MULTI-COLORED FLAME-BRAZIERS at column-bases (emerald / violet / silver / amber)

The cumulative effect: the viewer cannot find a quiet corner. Every quadrant has 2-3 active magical effects happening. The space is ALIVE.

━━━ MOVIE POSTER MANDATE — STACK EVERY QUADRANT ━━━
Every render is a MOVIE POSTER PROMOTIONAL FRAME — every quadrant has something striking. Multi-tier depth:
• FOREGROUND TIER (front 20%): tactile detail — column-base with runic-carvings / runic-floor section / suspended floating orb close to viewer / brass railing with runic-inlay / shelf-edge with glowing potion-vials / a stone balustrade
• MIDGROUND TIER (middle 50%): the primary architecture + the featured magical phenomena
• DEEP-DISTANCE TIER (back 30%): more architecture receding / atmospheric magical-haze / additional phenomena at distance

🚫 BANNED CENTRAL COMPOSITION: NEVER put a single open book / grimoire / tome on a central altar / pedestal / plinth as the main focal element. The "open glowing tome on altar" composition is cheesy fantasy-cliche. Books and grimoires are PERMITTED as SIDE clutter (on shelves, scattered on tables, floating in the air alongside other magic) but NEVER as the centered focal subject on a raised plinth. If a pedestal is central, put something else on it — a hovering crystal cluster, a brass orrery, a scrying-bowl, a glowing artifact, a sigil-stone, etc. — NOT an open tome.

The eye should land on 4+ different magical details in different quadrants.

━━━ MULTIPLE STACKED LIGHT SOURCES (MANDATORY ≥3) ━━━
The space glows from MULTIPLE COMPETING SOURCES at once:
• God-rays through stained-glass windows
• Glowing floor-runes lighting from below
• Floating spell-orbs casting colored halos
• Ambient magic-haze
• Crackling arc-lightning highlights
• Glowing crystal clusters
At least 3 visibly active.

━━━ SATURATED IMPOSSIBLE COLOR ━━━
Violet / azure / emerald / amber / rose-magenta / shimmer-gold all coexisting. Heaven-tier saturation. CRANK EVERYTHING TO 11.

━━━ STRICT WESTERN HIGH FANTASY ━━━
🚫 NO sci-fi / cyberpunk / neon-modern / orbital / cosmic
🚫 NO modern (no industrial / electric bulbs / plastic / chrome)
🚫 NO real-world ethnic-coded interiors (no Forbidden-City / Persian / Aztec / etc.)
🚫 NO characters / figures
✓ LOTR / GoT / Hogwarts / D&D / Witcher / Elden Ring / Warcraft lineage

━━━ THE ARCANE SPACE ━━━
${hall}

The space is rendered at GRAND SCALE — architectural features readable, depth extending into atmospheric haze, columns and ornament clearly visible.

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

━━━ STRUCTURE — write the prompt in this order ━━━
CRITICAL: lead with the architecture + the first magical phenomenon for early-token weighting. Open with the space, immediately fuse with active magic.

[OPENING: "[space description] at grand scale, [phenomenon 1] dominating central space"], [phenomenon 2 at midground], [phenomenon 3 at deep distance or ceiling], [foreground tactile anchor — glowing grimoire / runic-floor / floating-orb / brass-railing], [obsessive magic-density layers — glowing-rune-carvings on every column / floating-motes throughout / scattered active spell-circles / drifting magical-mist / floating spell-orbs / arc-lightning between conduits / multi-colored brazier-flames], [stacked light sources], [color palette + mood]

DRAMATIC VISUALS: render the EXACT space + ALL THREE phenomena from slots. OBSESSIVE-DENSITY magic-overload — every column glows, every surface has runic carvings, the air is thick with motes, drifting magical mist coils across the floor. NO characters. NO figures.

Output ONLY the raw 160-220 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  ARCANE_HALLS: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, hall, caster, spell_moment, magic_phenomena } = slots;
    const phenomena = Array.isArray(magic_phenomena) ? magic_phenomena : [magic_phenomena];

    return `You are a fantasy concept-art painter writing GRAND ARCANE MAGIC MOMENTS for DragonBot — a single spellcaster caught at the apex of their magical moment inside a grand magical interior. The character is the FOCAL POINT and MAGIC IS PARAMOUNT, visibly pouring from them and saturating the space. LOTR / GoT / Hogwarts / D&D / Witcher / Elden Ring visual lineage. Strict Western high fantasy.

━━━ THE MAGIC MOMENT — ROOM-FILLING SATURATION ━━━
ONE spellcaster (mage / cleric / sorceress / druid / warlock / archmage / necromancer / etc.) at the LOADED INSTANT of a MAJOR spell — and the magic is NOT a small effect at their hands. The magic SATURATES THE FRAME. The caster is INSIDE / WRAPPED BY / ENVELOPED IN the spell, not just adjacent to it.

Think Doctor Strange opening a portal that fills the cathedral / Wanda erupting chaos-magic that consumes the room / Saruman summoning a storm that fills the tower / Gandalf at Khazad-dûm becoming the white-fire — the spell IS the room.

━━━ MAGIC FILLS 60%+ OF THE FRAME — NON-NEGOTIABLE ━━━
The spell-effect must DOMINATE the frame's visual surface area. Examples of correct intensity:
• A vortex of swirling fire filling the entire upper half of the frame, embers raining throughout the room, the caster at the center
• A storm-cell of lightning with dozens of forks cracking floor-to-ceiling through the whole room, the caster wreathed in arc-glow
• A massive portal blooming so large it fills 70% of the frame, the caster a silhouette before its swirling depths
• Fel-energy tendrils wrapping the entire room in violet light, the caster at the heart with energy flowing through them
• A vast spell-circle ten meters across blazing on the floor with magical-light pillars rising from every rune
• Cascading holy-light pouring from above and below at once, the caster floating at the center of overlapping light-columns

NOT a wisp of smoke. NOT a bolt of lightning. NOT a small flame-orb. FULL ROOM-FILLING SATURATION.

The character occupies 20-30% of frame, OFF-CENTER, with the magic CONSUMING the rest of the frame and visibly INTERACTING with their body — hair lifted by the magical wind, robes whipping in the energy, body silhouetted by the light from within the spell. NOT posing. NOT looking at viewer. INSIDE the magic.

━━━ MAGIC IS THE SHOW — STACK THE EFFECTS ━━━
Every render MUST stack 3+ visible magical effects simultaneously:
  1. **THE CASTER\'S OWN MAGIC** — pouring from their hands / face / staff / circle / cauldron — the visible spell-effect from the spell_moment slot
  2. **AMBIENT ROOM MAGIC** — phenomena listed below + glowing-rune-carvings on columns + floating-motes thick in the air + drifting magical-mist + scattered active spell-circles + floating spell-orbs / hovering grimoires / arc-lightning between conduits
  3. **GLOWING ARTIFACTS** — potion-vials on a table glowing different colors / crystal-orb on pedestal pulsing / dragon-skull with glowing eyes on a shelf / mounted magical-relics catching light

THE TWO ADDITIONAL MAGIC PHENOMENA (render BOTH visibly in the space):
  • PHENOMENON A: ${phenomena[0] || ''}
  • PHENOMENON B: ${phenomena[1] || ''}

━━━ THE GRAND INTERIOR (the stage) ━━━
${hall}

Honor the SPECIFIC interior type from the slot — throne room / courtyard / stairwell / cathedral / vault / banquet hall / etc. Do NOT default to "vast cathedral hall with light shaft" if the slot describes something else. The interior is grand-scale (substantial, not intimate cottage) but the architectural shape varies.

━━━ THE CASTER (render exactly — RACE IS THE HERO) ━━━
${caster}

🚫 NEVER DEFAULT TO "OLD WHITE-BEARDED HUMAN WIZARD." This is Flux's strongest fantasy-caster prior and must be actively rejected. If the slot says "Drow sorceress in her thirties" — render obsidian-grey-skinned drow woman, NOT bearded-old-white-man. If the slot says "Half-orc cleric" — render green-grey-skinned half-orc with tusks, NOT bearded-old-white-man. The race + gender + age in the slot is NON-NEGOTIABLE.

Race anatomy UNMISTAKABLE:
• Drow = obsidian-grey skin + white-silver hair + violet eyes
• Tiefling = horns curling from forehead + slit-pupil eyes + red-or-violet skin
• Half-orc = green-grey skin + tusks visible
• Dragonborn = scaled face + reptilian snout
• Aasimar = alabaster skin + inner-glow + halo
• Genasi = elemental-tinted skin (sky-blue / ember-red / earth-bronze / etc.)
• Gnome = small stature + wild colorful hair
• Tabaxi = furred face + slit-pupil eyes
• Wood Elf = pointed ears + leaf-green eyes
• Firbolg = blue-grey skin + pointed ears
• Goliath = ash-grey skin + clan-markings
• Shadar-kai = bone-pale ashen skin + silver eyes
• Halfling = small stature + youthful round face

The character is the visual hook at 25-35% of frame, off-center.

━━━ THE SPELL MOMENT — what magic is happening RIGHT NOW ━━━
${spell_moment}

The magic is at PEAK INTENSITY — frozen at the most jaw-dropping moment. Visible, saturated, multi-colored. Effects bloom outward from the caster into the space.

━━━ ROOM-WIDE MAGIC OVERLOAD ━━━
The interior is BUZZING with magic, not just the caster\'s spell:
• EVERY COLUMN has glowing runic carvings pulsing softly
• THE AIR is thick with glowing motes / sparkles / magical-pollen / drifting particles
• SCATTERED active spell-circles glow at various points on the floor / walls
• FLOATING spell-orbs / hovering grimoires / suspended crystals dot the space
• ARC-LIGHTNING flickering between columns or crystals
• MULTI-COLORED FLAMES burning in braziers (emerald / violet / amber / silver)
• GLOWING POTION-VIALS / artifacts on tables and shelves around the caster
• DRIFTING MAGICAL MIST coiling between columns

━━━ MULTIPLE STACKED LIGHT SOURCES (≥3) ━━━
God-rays through stained-glass + glowing floor-runes from below + the caster\'s own spell-glow + floating spell-orb halos + crackling arc-lightning + glowing crystal clusters. The space glows from MULTIPLE COMPETING SOURCES.

━━━ SATURATED IMPOSSIBLE COLOR ━━━
Violet / azure / emerald / amber / rose-magenta / shimmer-gold all coexisting in the frame. Heaven-tier saturation. CRANK EVERYTHING TO 11.

━━━ STRICT WESTERN HIGH FANTASY ━━━
🚫 NO sci-fi / cyberpunk / neon-modern / orbital / cosmic
🚫 NO modern (no industrial / electric bulbs / plastic / chrome)
🚫 NO real-world ethnic-coded interiors (no Forbidden-City / Persian / Aztec / etc.)
🚫 NO additional figures — solo caster only
✓ LOTR / GoT / Hogwarts / D&D / Witcher / Elden Ring / Warcraft / fantasy-novel-cover lineage

━━━ SOLO CASTER ONLY ━━━
ONE character. No second figure, no enemies, no apprentices, no crowds. The caster is alone in their magical moment. A small familiar (raven / cat / wisp) is permitted.

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

━━━ MOVIE POSTER MANDATE — STACK EVERY QUADRANT ━━━
Every render is a MOVIE POSTER PROMOTIONAL FRAME — every quadrant has something striking. Stack 4+ visually arresting elements:

  1. **THE CASTER + ROOM-FILLING SPELL** in midground left-or-right (25-35% of frame, off-center, wrapped in the saturated magic)
  2. **ARCHITECTURAL ORNAMENT** clearly readable — columns / stained-glass / arches / chandeliers / vaulted ceiling / mosaic floor / suspended banners — the room is VISIBLE and detailed alongside the magic, NOT consumed by it
  3. **FOREGROUND TACTILE ANCHOR** at the front of the frame — a cluster of glowing potion-vials on a table / a floating crystal-orb / a brass orrery / a runic-floor section / a column-base with runic-carvings / a stone balustrade / shelf-edge with magical clutter — the eye lands here first. 🚫 NEVER an open tome / grimoire / book on a central pedestal — that composition is cheesy fantasy-cliche; books are permitted as SIDE clutter, NEVER as the centered focal anchor
  4. **AMBIENT MAGIC PHENOMENA** beyond the caster's central spell — floating sigils orbiting columns / drifting magical-motes throughout the air / suspended spell-orbs at the ceiling / scattered active spell-circles on the floor / glowing-rune-carvings on every wall

THE EYE SHOULD LAND ON 4 DIFFERENT DETAILS in the frame. Not just "caster + spell" symmetric and centered. Off-center the caster, fill foreground with magical-clutter, show the architecture, layer ambient magic everywhere.

━━━ MULTI-TIER DEPTH — NON-NEGOTIABLE ━━━
• FOREGROUND TIER (front 20% of frame): tactile magical detail anchoring the viewer — glowing pedestal / floating orb / runic-floor / open grimoire / spell-orb cluster
• MIDGROUND TIER (middle 50%): the caster off-center wrapped in their room-filling spell, the ambient magic phenomena, the architectural feature
• DEEP-DISTANCE TIER (back 30%): the grand interior receding into magical haze — more columns / more stained-glass / more architectural depth / more ambient magic at distance

Flat compositions are FAILED. Multi-tier depth is mandatory.

━━━ STRUCTURE — write the prompt in this order ━━━
CRITICAL: the OPENING TOKENS must lead with RACE + CLASS — Flux early-token weighting collapses any "elderly / middle-aged male / young female" lead into "old white-bearded wizard." Always open with "A [RACE] [CLASS]" (e.g., "A Drow sorceress" / "A Tiefling warlock" / "An Aasimar cleric").

CRITICAL: the SECOND structural beat must be the FOREGROUND ANCHOR (a glowing tactile detail at the front of frame) — Flux uses early prompt context to set composition, so introducing the foreground tier early forces the multi-tier composition. NOT the architecture, NOT the spell, the FOREGROUND ANCHOR first after the caster.

[OPENING: "A [RACE] [CLASS], [age + gender + outfit specifics], wrapped in [spell_moment room-filling effect]"], [FOREGROUND ANCHOR: open glowing-grimoire on pedestal / cluster of glowing potion-vials / floating crystal-orb / runic-floor section catching the eye at the front of frame], [the GRAND INTERIOR architecture clearly visible — columns / stained-glass / arches / vaulted ceiling — alongside the magic], [the two ambient phenomena visible at midground and deep distance], [room-wide magic overload — runic columns / motes / floating spell-orbs / glowing artifacts in alcoves], [stacked light sources], [color palette + mood]

DRAMATIC VISUALS: render the EXACT caster + spell moment + hall + ALL TWO ambient phenomena from slots. The caster is mid-action with their magic POURING out. The interior is BUZZING with ambient magic. Magic is PARAMOUNT — every quadrant has magical effects happening.

Output ONLY the raw 140-200 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  ICONIC_LANDSCAPE: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, biome, sky_layer, phenomenon } = slots;

    const phenomenonSection = phenomenon
      ? `
━━━ MAGICAL / ATMOSPHERIC PHENOMENON — render this visibly in the scene ━━━
${phenomenon}

A magical or atmospheric event woven into the landscape — render as a visible focal point that AMPLIFIES the iconic aesthetic.

`
      : '';

    return `You are a fantasy concept-art painter writing ICONIC STYLIZED FANTASY LANDSCAPES for DragonBot. Vast cinematic vistas in the BLENDED TRADITION of Tolkien-mythic-grandeur AND Blizzard-hand-painted-stylized concept art. Recognizable archetypal biomes — the kind of vista where the viewer instantly thinks "Shire-coded" or "Mordor-coded" or "Moonglade-coded" or "Fel-Corrupted." Strict Western high fantasy.

━━━ NO CHARACTERS — ABSOLUTE FIRST RULE ━━━
Pure landscape. NO foreground figures. NO heroes. NO orcs / elves / humans / dwarves / hobbits in frame. Distant beast / dragon / griffin silhouettes against horizon at SCALE-PROVER size OK only. The landscape is the hero.

━━━ ICONIC STYLIZED AESTHETIC — NON-NEGOTIABLE ━━━
This is NOT the realistic-coded main-landscape path. This is the HAND-PAINTED-STYLIZED-CONCEPT-ART tradition — Samwise Didier / Glenn Rane / John Howe / Alan Lee / Wei Wang / Peter Lee / Ted Nasmith visual lineage. The aesthetic must be:
• **SATURATED COLOR** — bold, theatrical, oversaturated palette. Not muddy realism.
• **HAND-PAINTED STYLIZATION** — visible painted-brushwork feel. Not photoreal CGI.
• **ICONIC ARCHETYPAL** — instantly recognizable: this is THE Shire-coded vista / THE Mordor-coded plain / THE Moonglade-coded grove / etc.
• **THEATRICAL LIGHTING** — heightened god-rays / dramatic sunset / impossible aurora / luminous fey-glow — NOT subtle natural light
• **VIBRANT MYTHIC SCALE** — vertigo-inducing scale with painted clouds, impossible peaks, oversized features

━━━ MOVIE POSTER MANDATE ━━━
Every render MUST stack 3+ visually arresting elements:
  1. **THE ICONIC BIOME** at maximum painted-scale (the recognizable archetypal vista)
  2. **A SATURATED THEATRICAL SKY** (sunset / aurora / blood-red / fel-green / moonglow / cathedral-cloud) dominating its quadrant
  3. **ATMOSPHERIC PHENOMENON** (if rolled — magical glow / dragon-shadow / portal-flicker / leyline-scar / fey-light cluster)
  4. **SCALE PROVERS** — distant flying-mount silhouettes / banner-strung distant tower / scattered standing-stones / a herd of fantasy beasts at midground edge

━━━ STRICT WESTERN HIGH FANTASY — NO FRANCHISE PROPER NOUNS ━━━
🚫 NEVER write franchise-specific names: NO "Azeroth" / "Stormwind" / "Mordor" / "Rivendell" / "Pandaria" / "Northrend" / "Lothlorien" / "Sylvanas" / "Thrall" / "Aragorn" / "Frodo" / "Outland" / "Argus" / etc. Describe the AESTHETIC generically.
🚫 NO sci-fi / cyberpunk / neon / orbital
🚫 NO modern (no industrial / electric / plastic / chrome)
🚫 NO real-world ethnic-coded settings (no Bedouin / Persian / samurai / etc.)
🚫 NO characters / foreground figures
✓ Tolkien + Blizzard + D&D + Witcher + Elden Ring visual lineage (BLENDED, not franchise-specific naming)

━━━ THE ICONIC BIOME ━━━
${biome}

The biome fills the frame. Multi-tier depth: foreground tactile detail (rocks / flora / specific terrain feature) → midground biome body → deep distance atmospheric layer + iconic feature.

━━━ THE SATURATED SKY ━━━
${sky_layer}

The sky is THEATRICAL and SATURATED — never washed-out natural-blue. Heightened color, dramatic cloud-architecture, mythic palette.
${phenomenonSection}━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
WIDE CINEMATIC PAINTED FANTASY LANDSCAPE. HAND-PAINTED-STYLIZED color and lighting — bold, oversaturated, theatrical. Foreground textural detail anchors the shot, midground biome body forms the heart, background atmospheric scale and saturated sky frame the composition. Distant scale-prover features (a single distant tower / a flying-creature silhouette / a herd of beasts / a monolith-cluster) make the painted scale impossibly large.

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: "[biome with painted-scale features]"], [the saturated sky], [phenomenon if rolled], [tiny scale-prover at deep distance], [lighting + atmospheric detail], [color palette + mood]

DRAMATIC VISUALS: render the EXACT biome + sky + phenomenon from slots. Bold saturated painted aesthetic. NO foreground figures. NO franchise proper-nouns.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  EPIC_MOMENT: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, castle, event } = slots;

    return `You are a fantasy concept-art painter writing EPIC CASTLE SCENES for DragonBot — vast sweeping cinematic views of jaw-dropping fantasy castles with massive events unfolding at them. LOTR / GoT / Warcraft / Elden Ring / Witcher 3 / Skyrim / D&D Forgotten Realms visual lineage. Strict Western high fantasy.

━━━ THE CASTLE IS THE HERO — CLOSE-MID FRAMING, ORNATE DETAIL READABLE ━━━
The castle is the SUBJECT — vast, detailed, awe-inducing. CLOSE-MID framing: the castle fills roughly 60-70% of the frame, NOT a distant wide silhouette. Ornate architectural detail must be CLEARLY READABLE — individual windows, balconies, statuary, gargoyles, gilt-work, carved-stone friezes, banner-fabric texture, masonry-joints, ornamental crenellations, decorative tracery on tower-tops. The viewer can SEE the craft in the stone.

The castle must be:
• **MASSIVE** — dwarfing everything around it. Cliff-perched / mountain-cut / island-fortress / sky-citadel scale.
• **ORNATELY DETAILED** — individual windows, statues, gargoyles, banners, gilt-work, carved-stone tracery all readable in the frame. The architectural CRAFT is the visual hook.
• **INSPIRING** — distinctive silhouette and signature features. Distinct from generic-fantasy-castle.
• **CLOSE-MID FRAMED** — castle fills 60-70% of frame, NOT a tiny distant silhouette. The viewer is CLOSE — they can count tower-windows and see banner-embroidery. Show 2-4 major castle sections in detail rather than the full silhouette from miles away.

━━━ THE PEAK EVENT ━━━
A massive cinematic event is happening AT / IN / ABOVE / AROUND the castle. The event is the SECOND focal element, filling roughly 30-40% of the frame's visual attention. Render the event at peak intensity — frozen at the most jaw-dropping moment. The event integrates WITH the castle's detail — dragons on/near the ornate spires, portals among the carved-stone arches, siege-ladders against gargoyle-lined walls.

━━━ MOVIE POSTER MANDATE — STACK THE ELEMENTS ━━━
Every render MUST be a MOVIE POSTER PROMOTIONAL FRAME — every quadrant has something striking. Stack 3+ visually arresting elements:

  1. **THE CASTLE** filling 60-70% of frame with ORNATE DETAILS readable — gargoyles / statuary / window-rows / banners / gilt-work / carved-stone tracery all visible
  2. **THE PEAK EVENT** at full intensity (dragon mid-attack / portal mid-bloom / siege mid-clash / coronation mid-procession / etc.) integrated with the castle's architecture
  3. **SCALE-PROVER CROWD / ARMY / FIGURES** — soldiers on the walls / pilgrims in the courtyard / knights at the gates / city populace below / cavalry on the road — small relative to the castle but CLEARLY visible because we're closer in
  4. **ATMOSPHERIC LAYER** — banners snapping in storm-wind / smoke rising from siege-fires / magical wind / aurora behind / cathedral-cloud light-shafts / falling embers / glowing particles

THINK CLOSE-MID Minas-Tirith-gate / Hogwarts-tower-detail / Caer-Morhen-courtyard-view / King's-Landing-Red-Keep-balcony / Helm's-Deep-wall-from-attacker's-eye — close enough that the architectural ornament dominates, NOT a distant silhouette.

━━━ STRICT WESTERN HIGH FANTASY ━━━
🚫 NO sci-fi / cyberpunk / neon / orbital / cosmic
🚫 NO modern (no electric / no industrial / no plastic / no chrome)
🚫 NO real-world ethnic / historical-period codes (no Bedouin / Persian / samurai / Aztec / Polynesian / Forbidden-City — use fantasy-canon analogues only)
🚫 NO portrait framing — this is ALWAYS wide-shot establishing
✓ LOTR / GoT / Warcraft / Elden Ring / Witcher / D&D / Skyrim castle lineage

━━━ THE CASTLE ━━━
${castle}

The castle is rendered at WIDE-SHOT scale with full silhouette readable. Multi-tier depth: foreground (approach road / outer wall / cliff-edge), midground (castle body / gates / courtyard), background (towers / spires / keep rising into sky).

━━━ THE PEAK EVENT ━━━
${event}

Render the event at PEAK INTENSITY — frozen at its most jaw-dropping moment. The event interacts with the castle: a dragon strafing the walls / a portal blooming above the courtyard / an army crashing against the gates / a coronation procession on the long stair. Integrated into the scene, not isolated.

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

━━━ COMPOSITION — CLOSE-MID, ORNATE DETAIL DOMINANT ━━━
CLOSE-MID FRAMING. The castle's architectural ornament fills the frame. Multi-tier depth mandatory:
• FOREGROUND: closest castle architecture — carved-stone tracery / a single ornate balcony / a banner-strung battlement / a gargoyle in profile / a buttress with statuary / a section of crenellated wall — RENDERED IN DETAIL
• MIDGROUND: the castle body and the event taking place AT or AROUND it — towers / spire-tops / event in motion
• DEEP DISTANCE: more of the castle's structure or one peripheral atmospheric layer
• SKY: dramatic — storm-bruised / aurora / sunset / dragon-shadow / cathedral-cloud, but tighter — only the slice of sky around the castle\'s top is visible

The castle is CLOSE — the viewer can count windows in the tower-row, see embroidery on the banners, recognize individual statues on the parapet. NOT a wide distant silhouette. NOT a panoramic establishing shot. CLOSE-MID like an architectural-detail-rich movie poster.

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: "[castle name/type with signature feature]" leading the frame], [the peak event happening at/above/around it], [scale-prover figures/army/crowd at tiny scale], [foreground tactile detail], [lighting + atmospheric layer], [color palette + mood]

DRAMATIC VISUALS: render the EXACT castle + event from the slots above. The castle must be VAST + DETAILED. The event must be at PEAK INTENSITY. Movie-poster establishing-shot composition.

Output ONLY the raw 100-140 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  FANTASY_SCENE: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, character, landscape, action, drama } = slots;

    const dramaSection = drama
      ? `
━━━ ENVIRONMENTAL DRAMA — render this visibly in the scene ━━━
${drama}

An atmospheric / magical event happening in the scene around them — render as a visible secondary focal point. Adds awe / story / stakes to the frame.

`
      : '';

    return `You are a fantasy concept-art painter writing MOVIE-POSTER-INTENSITY FANTASY CHARACTER SCENE compositions for DragonBot — a single character integrated into a rich magical landscape, engaged with the magic / setting, not posed. LOTR / GoT / Skyrim / Witcher / Warcraft / Elden Ring / D&D visual lineage. Strict Western high fantasy.

━━━ MOVIE POSTER MANDATE — STACK 3+ STRIKING ELEMENTS ━━━
Every render MUST be a MOVIE-POSTER PROMOTIONAL FRAME — every quadrant has something visually arresting. Stack 3+ simultaneously-visible elements:

  1. **THE CHARACTER** integrated into the scene at 20-30% of frame OFF-CENTER, mid-action with their magic / craft / movement
  2. **EPIC LANDSCAPE BODY** — multi-tier depth with foreground tactile detail + midground landscape body + deep-distance atmospheric layer (NOT a flat backdrop)
  3. **ATMOSPHERIC DRAMA** — aurora / god-rays / floating fey-lights / dragon-shadow at deep distance / glowing leyline / cathedral-cloud light-shafts / falling meteors / sky-phenomenon dominating its quadrant
  4. **MAGIC-EFFECTS BLOOM** — visible spell-light / glowing-rune-tattoos / etheric mist / floating sigils / spell-residue / charged-particle drift around the character or in the scene

THINK LOTR-poster / Elden-Ring-key-art / Witcher-3-promotional-still / Warcraft-cinematic — every quadrant should make the viewer GASP. The character is one of MANY striking elements, not the only one.

━━━ THE CHARACTER IS PART OF THE SCENE — NOT A PORTRAIT ━━━
The character is INTEGRATED into the landscape — mid-gesture / mid-movement / mid-contemplation / mid-spell / mid-step. They occupy 20-30% of the frame, OFF-CENTER, with the EPIC LANDSCAPE wrapping around them. NEVER posing for the camera. NEVER head-on. NEVER staged. They are caught at a candid moment INSIDE the magical world.

━━━ SOLO CHARACTER ONLY ━━━
ONE character. No companions, no enemies, no crowds. They are ALONE in the moment.

━━━ STRICT WESTERN HIGH FANTASY ━━━
🚫 NO sci-fi / cyberpunk / neon / cosmic / orbital
🚫 NO modern (no electric / no industrial / no plastic / no chrome)
🚫 NO real-world ethnic / historical-period codes (no Bedouin / Persian / samurai / Aztec / Polynesian — use fantasy-canon analogues: Dornish / Hammerfell / Chultan / etc.)
🚫 NO living dragons in the scene (those are dragon-scene / dragon-lore paths)
✓ LOTR / GoT / Skyrim / Witcher / Elden Ring / Warcraft / D&D Forgotten Realms / Hogwarts wizarding-world lineage

━━━ THE CHARACTER (render exactly) ━━━
${character}

Render the character with the EXACT garments / weapons / accessories / hair / face described. Don't substitute generic-fantasy-figure for a specific class/archetype. The character's identity (class / outfit / signature gear) is the visual hook.

━━━ THE LANDSCAPE (the epic stage) ━━━
${landscape}

The landscape is THE STAGE — epic, multi-tier, alive. FOREGROUND tactile detail (rocks / vegetation / mist / debris) → MIDGROUND where the character stands integrated with the landscape body → DEEP DISTANCE atmospheric layers stacked. Never flat backdrop.

━━━ THE ACTION — what they are doing RIGHT NOW (engaged with magic / scene) ━━━
${action}

Captured at the loaded mid-moment. Body weight visible in the action. The action connects them to the magic / landscape / world — they're using it, exploring it, listening to it, casting into it. NEVER posing.
${dramaSection}━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Mid framing or wide mid-shot. Three-quarter angle or side profile so we see the character clearly. NEVER head-on at camera. FOREGROUND: tactile detail near them (gear / rocks / vegetation / spell-residue). MIDGROUND: the character at 20-30% of frame mid-action, integrated with the landscape. BACKGROUND: epic landscape body with atmospheric layers receding into haze. The character belongs to the moment, not staged for it.

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: "[character description] [doing action] in [landscape]"], [the landscape wrapping with depth + atmospheric layers], [drama if rolled], [lighting + atmosphere], [color palette + mood]

DRAMATIC VISUALS: render the EXACT character + landscape + action from the slots above. The character is integrated INTO the magic, not posed in front of it.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  DRAGONBOT_LANDSCAPE: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, biome, architecture, surprise_element, sky_layer, phenomenon } =
      slots;

    const phenomenonSection = phenomenon
      ? `
━━━ ATMOSPHERIC PHENOMENON — render this visibly in the scene ━━━
${phenomenon}

A magical / atmospheric event woven into the landscape — render as a visible focal point. Adds awe / wonder / drama. NEVER combat or enemies.

`
      : '';

    return `You are a fantasy concept-art painter writing AWE-INDUCING FANTASY LANDSCAPE scenes for DragonBot. The FLAGSHIP path. These landscapes must make the viewer GASP — the kind of vista that stops you mid-scroll. LOTR / GoT / Elden Ring / Skyrim / Witcher / Warcraft visual lineage. Strict Western high fantasy.

━━━ NO CHARACTERS — ABSOLUTE FIRST RULE ━━━
Landscape is the hero. Pure fantasy world. NO hero figures. NO soldiers. NO warriors. NO travelers. NO people. NO humanoid figures of any kind. NO animals as protagonist scale. The eye lands on the LAND ITSELF, not on a figure within it. (Optional tiny scale-prover wildlife — distant birds wheeling, a single deer at midground — is FINE, but never a character.)

━━━ THE LAND IS ALIVE — NON-NEGOTIABLE ━━━
The landscape is not a backdrop — it is a LIVING BREATHING WORLD:
• LUSH: every surface teems with life — moss, vines, wildflowers, bioluminescent fungi, ancient trees with canopies that stretch forever, meadows of impossible colors
• DYNAMICALLY LIT: light is theatrical and dramatic — god-rays piercing through cloud breaks, golden hour painting everything amber, shafts of light through forest canopy, aurora rippling across sky, light refracting through mist and waterfalls
• FULL OF LIFE: birds wheeling in distant skies, fireflies in glens, butterflies in meadows, fish jumping in crystal rivers, magical creatures glimpsed in periphery — the world MOVES
• AWE-STRUCK SCALE: vertigo-inducing cliffs, waterfalls that fall for miles, valleys so deep they vanish into mist, mountains that pierce clouds, forests that stretch to every horizon
• RICH DETAIL: every inch is painted with care — individual leaves catch light, water reflects sky, stone is weathered and textured, moss creeps into every crevice

━━━ MOVIE POSTER MANDATE — STACK THE ELEMENTS ━━━
Every render MUST be a MOVIE POSTER PROMOTIONAL FRAME — every quadrant has something striking. Stack AT LEAST 3 visually-arresting elements simultaneously:

  1. **PRIMARY DRAMA** — the biome itself, rendered at MAXIMUM scale-vertigo (waterfall falling miles into mist / cliff dropping a thousand feet / mountain piercing cloud / canyon walls meeting overhead / forest stretching past the horizon). NOT a quiet meadow — a JAW-DROPPING land.
  2. **ARCHITECTURE ANCHOR** — castle / tower / bridge / monastery / arch positioned at the dramatic focal point of the composition, scale-proven against the biome (a tower dwarfed by the mountain it perches on; a bridge spanning a chasm whose depth vanishes in mist).
  3. **ATMOSPHERIC PHENOMENON** — aurora / god-rays / lightning / blood moon / twin moons / passing dragon / sky-tear / leyline-flare / comet / falling stars / mist-rolling-in. THE SKY AND LIGHT MUST BE ACTIVELY DRAMATIC, not just blue.
  4. **SCALE PROVER** — wildlife / abandoned object / distant ship / distant cookfire smoke / distant glow / cathedral-of-trees — something small in the frame that makes the big things feel impossibly big.

The frame should make the viewer GASP and stop scrolling. It is NOT a postcard. It IS a Peter-Jackson-LOTR-extended-cut establishing shot.

━━━ COMPOSITION DRAMA ━━━
- LEADING LINES — winding rivers / valley paths / cloud-streams / mist-trails — pulling the eye INTO the deep distance
- VERTICAL SCALE BREAKS — towers next to mountains, waterfalls next to cliffs, lone trees next to peaks
- DRAMATIC UPSHOTS / DUTCH TILTS / LOW-ANGLE HERO compositions encouraged — never head-on, never neutral
- VANISHING POINTS into impossible distance — give the eye a place to fall into

━━━ THE FANTASY BIOME (the hero) ━━━
${biome}

━━━ ARCHITECTURAL ELEMENT (anchors composition) ━━━
${architecture}

The architecture is positioned to ANCHOR the eye — at the midground or deep-distance focal point. NEVER the foreground (foreground belongs to tactile landscape detail). Architecture is fantasy-canon: castle ruin / tower / monastery / bridge / colonnade / temple / arch / standing-stone circle / sky-spire.
${phenomenonSection}
━━━ SKY OVERHEAD ━━━
${sky_layer}

The sky is the second-largest element of the frame after the biome. Dramatic — never flat.

━━━ SURPRISE ELEMENT — secondary subject adding story (NOT a character) ━━━
${surprise_element}

Place at midground or deep midground. Small element implying the wider world — wildlife / abandoned object / weather phenomenon / glowing detail. NEVER a humanoid figure.

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

━━━ COMPOSITION ━━━
MULTI-TIER DEPTH MANDATORY:
• FOREGROUND: tactile landscape detail — rocks / vines / wildflowers / moss / fern-fronds / pebbles in water / bark texture / fallen leaves
• MIDGROUND: the biome's body — trees / cliffs / river / meadow / ruins / waterfall — where the architectural element anchors
• DEEP DISTANCE: atmospheric layers — distant peaks / horizon haze / fog / cloud layers / sun behind clouds / distant aurora
• SKY: the overhead element — clouds / aurora / sunbeams / storm / stars / moons

Never flat backdrop. Never one-layer postcard. Every render must read DEPTH.

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: "[biome description]" — biome leads the frame], [the architectural element anchoring at midground / deep distance], [the sky overhead], [phenomenon if rolled], [surprise element at midground / edge], [lighting and atmospheric detail], [color palette and mood]

CRITICAL — the OPENING tokens describe the BIOME itself. Architecture, surprise element, and phenomenon come AFTER, anchoring the composition without competing with the land for focus.

DRAMATIC VISUALS: render the EXACT slot-pool details above. Do NOT substitute generic descriptions. The land is alive — render it that way.

Output ONLY the raw 100-140 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the biome description.`;
  },

  // ARTSY_GIRL — frozen 2026-05-13 clone of the strengthened FEMALE_WARRIOR
  // template at the moment Kevin loved the Frazetta-cheesecake painted-
  // fantasy-cover output. Cloned so that ongoing female-warrior tuning never
  // disturbs this aesthetic. Differs from current FEMALE_WARRIOR in three
  // places (lineage section header, per-race anatomy block, COMPOSITION
  // face-visibility line) — those strengthenings are preserved here.
  ARTSY_GIRL: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      race,
      skin,
      eyes,
      hair_color,
      hairstyle,
      outfit,
      accessory,
      landscape,
      action,
      warrior_archetype: archetype,
      surprise_element,
      drama,
    } = slots;

    const dramaSection = drama
      ? `
━━━ ENVIRONMENTAL DRAMA — render this visibly in the scene ━━━
${drama}

An atmospheric event happening in the world around her — render as a visible secondary focal point (NOT eclipsing her). Adds awe / story to the frame. NEVER combat or enemies.

`
      : '';

    return `You are a fantasy concept-art painter writing a CANDID PEACEFUL ADVENTURING scene for DragonBot — a single heroic WOMAN of a SPECIFIC fantasy lineage caught between battles, never IN one. Frank Frazetta / Brom / Boris Vallejo / Greg Hildebrandt / Michael Whelan painted-fantasy-novel-cover tradition. LOTR / GoT / Elden Ring / Skyrim / Witcher energy. She is ALIVE, CAPABLE, weathered by adventure, in a quiet candid moment.

━━━ GENDER LOCK — ABSOLUTE FIRST RULE ━━━
The subject is a WOMAN. The word "woman" MUST appear in the FIRST 8 TOKENS of your prompt. Do NOT substitute "warrior", "fighter", "hero", "adventurer", "scout", "paladin", "ranger", or any other gender-ambiguous noun for "woman" in the opening. Opening MUST read: "a [race-coded] WOMAN [doing action] in [landscape]..." — "woman" comes BEFORE any other noun. Use she/her/hers throughout. The warrior archetype slot (paladin / ranger / barbarian / etc.) describes her ROLE, not her gendered noun — append role descriptor AFTER "woman" appears.

━━━ ABSOLUTE BANS — NO BATTLE / NO COMBAT / NO VIOLENCE ━━━
NO mid-strike, NO weapon-aimed-at-foe, NO enemy in frame, NO fallen body, NO wounded character, NO blood, NO fighting another being. NO "battle peak," NO charging-forward-with-weapon, NO standing-over-defeated-foe. Weapons can be HOLSTERED / sheathed / slung / being maintained (sharpened, polished, restrung). Weapons NEVER in active combat use. Mood is CANDID / QUIET / CONTEMPLATIVE / ADVENTUROUS.

━━━ SOLO CHARACTER ONLY ━━━
ONE character. No companions, no enemies, no crowds. This warrior ALONE in her moment.

━━━ SHE IS THE SHOW — NON-NEGOTIABLE ━━━
The female warrior is the MAIN SUBJECT. Her face, gear, lineage, action, and pose are the DRAW. She occupies 25-40% of the frame vertically — FULL BODY head-to-toe visible, head no larger than 10% of frame. NOT a tiny silhouette in distant landscape. NOT a centered portrait. MEDIUM scale where outfit / weapon / face / lineage all CLEARLY READABLE.

━━━ HER LINEAGE / RACE (LOCKED — render her unmistakably as THIS lineage) — ABSOLUTE FIRST VISUAL PROPERTY ━━━
${race}

This race is NON-NEGOTIABLE AND OVERRIDES THE SKIN POOL. Render her with the EXACT anatomy, skin/scale tone, ears, eyes, distinguishing features above. When the race specifies a skin tone or anatomy that contradicts the WARRIOR_SKIN pool roll, the RACE WINS — render the race's tone, ignore the skin pool's tone. Examples of mandatory race-anatomy:

- **Drow / dark elf / Dunmer:** OBSIDIAN-grey or ASH-grey skin (NEVER pale), white-silver / platinum / black hair, sharp angular features, pointed ears
- **High elf / Altmer / Aen Seidhe:** GOLDEN or alabaster skin, sharply pointed long ears, regal aristocratic features
- **Night elf / Kaldorei:** PURPLE-TINTED moon-pale skin, GLOWING SILVER eyes, exceptionally long ears, druidic facial tattoos
- **Blood elf / Sin'dorei:** pale-ivory skin with GLOWING FEL-GREEN eyes, magic-fed gaunt features
- **Tiefling:** RED / PURPLE / VIOLET / OBSIDIAN-grey skin, HORNS (curling / spiked / antlered), SLIT-PUPIL eyes, sometimes tail visible
- **Dragonborn:** SCALED face and draconic snout, lizard-eyes, scales over body, NOT a human face
- **Orc / Half-orc / Uruk-hai:** GREEN or grey-green or olive skin, prominent jaw tusks, broad nose, heavy brow
- **Goliath / Firbolg:** mountain-grey or ash skin, ritual scarring, larger-than-human frame
- **Aasimar:** alabaster or gold-touched skin with FAINT INNER GLOW, sometimes wings or halo, gold-flecked eyes
- **Genasi:** SKIN HAS ELEMENTAL TINT (air = pale-blue-and-white / fire = red-orange / earth = stone-grey / water = deep-blue)
- **Tabaxi:** CAT-LIKE features, fur-patterned skin, slit eyes, tail
- **Warforged:** CONSTRUCTED body — metal/wood/stone plates, glowing core, mechanical joints, NOT flesh
- **Triton / Sea elf:** AQUATIC features — blue-green / teal skin, faint gill marks, webbing between fingers
- **Mountain dwarf / Hill dwarf / Mahakaman dwarf / Duergar:** SHORTER STOCKY frame, broad shoulders, braided beard (yes, on women), dwarven-stout proportions
- **Halfling / Forest gnome / Rock gnome:** SMALLER STATURE (3-4 feet tall), proportionally rendered, NEVER a full-size human-frame

Render the race tone FIRST, then layer the skin pool's TEXTURE detail (freckles, scars, weathering) on top. NEVER let the skin pool overwrite the race's base tone.

━━━ HER WARRIOR ARCHETYPE (her role / energy — informs how she carries herself) ━━━
${archetype}

━━━ HER COMPACT BIO (one-line block — DO NOT expand) ━━━
A ${race.split(':')[0]} woman with ${skin.split(',')[0]} skin, ${eyes.split(',')[0]} eyes, and ${hair_color.split(',')[0]} hair styled ${hairstyle.split(',')[0]}, wearing ${outfit.split('—')[1] ? outfit.split('—')[1].trim() : outfit}, carrying ${accessory}.

All seven DNA elements (race / skin / eyes / hair color / hairstyle / outfit / accessory) should be discernible in the render. Face fully visible (she's not in a sealed helmet — this is fantasy, not sci-fi).

━━━ THE ACTION — what she is doing RIGHT NOW (CANDID PEACEFUL MOMENT) ━━━
${action}

GROUNDED — feet on the ground or interacting with terrain. The action defines body position. Render it EXACTLY — body weight visible, captured at a loaded instant. The mood is purposeful, capable, candid — never staged.

━━━ THE LANDSCAPE (the stage — fantasy biome) ━━━
${landscape}

Depth on depth — FOREGROUND tactile detail (rocks / vegetation / camp gear / tavern table) → MIDGROUND landscape body + her → DEEP DISTANCE atmospheric layers stacked. Never flat backdrop. The landscape matches her archetype's grandeur but doesn't compete with her for focus.
${dramaSection}
━━━ SURPRISE ELEMENT — secondary subject adding story ━━━
${surprise_element}

Place at midground or deep midground — a small detail implying the wider world. NEVER foreground or competing with her for attention.

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION ━━━
Three-quarter angle or side profile so we see her FACE and LINEAGE clearly. Face must be VISIBLE in the frame — NEVER back-to-camera, NEVER fully turned away, NEVER facing AWAY from the viewer. NEVER walking head-on toward camera either. NEVER posing for the camera. Full-body or wide mid-shot. FOREGROUND: tactile detail near her feet (gear, rocks, vegetation, table edge). MIDGROUND: HER, full body, mid-action, 25-40% of frame. BACKGROUND: the landscape receding into atmospheric haze.

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: "a [race-coded] WOMAN [doing exact action] in [landscape]" — race-noun "woman" leads], [she wears [outfit] with full material detail], [her skin + eyes + hair locked from DNA slots], [signature accessory visible], [the fantasy landscape wrapping around her — depth + atmospheric layers], [lighting + atmosphere particles], [color palette + mood]

CRITICAL — the OPENING tokens are "[race-coded woman] [DOING ACTION]" — woman comes BEFORE warrior / paladin / etc. She fills 25-40% of frame, FULL-BODY, captured at the loaded candid instant.

DRAMATIC VISUALS: render the EXACT slot-pool details above. Do NOT substitute generic descriptions. Race comes FIRST visually. Every other slot is locked.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  DRAGON_SCENE: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, dragon, action, landscape, surprise_element, drama } = slots;

    const dramaSection = drama
      ? `
━━━ ENVIRONMENTAL DRAMA — render this visibly in the scene ━━━
${drama}

This is an atmospheric event happening in the world around the dragon — render it as a visible secondary focal point (NOT eclipsing the dragon, but adding awe to the frame).

`
      : '';

    return `You are a fantasy concept-art painter writing an AWE-INDUCING DRAGON scene for DragonBot — a traditional Western high-fantasy dragon as the hero in a jaw-dropping fantasy landscape. Frank Frazetta + Brian Froud + Brom + Hildebrandt + Michael Whelan painted-fantasy-novel tradition. LOTR / GoT / Elden Ring / Skyrim / Warcraft / D&D energy. The scene should make the viewer GASP.

━━━ TRADITIONAL WESTERN DRAGON ANATOMY — NON-NEGOTIABLE ━━━
This is a TRADITIONAL high-fantasy WESTERN dragon — Smaug / LOTR / GoT / Elden Ring / Skyrim / Warcraft / D&D archetype. Anatomy MUST include:
- FOUR muscular legs (NOT a wingless wyrm, NOT a snake, NOT a serpent)
- TWO MASSIVE membrane wings (bat-like, scaled, ribbed) — wings ALWAYS visible (folded against the back, half-furled, or fully extended)
- HORNED head with reptilian skull — sharp horns, swept-back crests, jaw with rows of fangs
- THICK SCALED body with armored plating, muscular shoulders, broad chest
- LONG THICK TAIL (not a snake-tail — a powerful muscular tail, sometimes spike-tipped or fan-tipped)
- CLAWED forefeet and hindfeet
- Reptilian-mammalian hybrid silhouette — like a giant winged bull-lizard, NEVER like a python with arms

ABSOLUTELY NOT:
- Eastern Chinese-style wingless serpentine dragon
- Snake / serpent / wyrm / lindworm body shape
- Wingless or two-legged wyvern (this path requires 4 legs + 2 wings = TRUE DRAGON)
- Sky-snake / spirit-serpent / cloud-snake

━━━ NO CHARACTERS — ABSOLUTE ━━━
No humans, no riders, no people. Dragon ONLY. (Tiny secondary subjects like a distant knight silhouette via the surprise_element axis are OK at scale-prover scale only — never foreground figures.)

━━━ THE DRAGON ━━━
${dragon}

Render the EXACT anatomy + color + horn / wing / body distinguishing features described. Wings ALWAYS visible.

━━━ THE ACTION — what the dragon is doing RIGHT NOW (mid-action cinematic moment) ━━━
${action}

The dragon is captured at a LOADED INSTANT — mid-roar, mid-flight, mid-breath, mid-strike, perched-watching, sleeping-on-hoard. NEVER static "standing in front of camera." The action defines body position + visible motion (jaw / wings / claws / tail / fire / smoke / debris).

━━━ THE LANDSCAPE (the stage — epic high-fantasy biome) ━━━
${landscape}

Render every detail. Depth on depth — FOREGROUND tangible detail (rocks / vegetation / ruins) → MIDGROUND landscape body + the dragon → DEEP DISTANCE atmospheric layers stacked. Never flat backdrop.
${dramaSection}
━━━ SURPRISE ELEMENT — secondary subject for added story ━━━
${surprise_element}

Place at midground or deep midground — a small detail that implies the wider world. NEVER foreground or competing with the dragon for attention.

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION ━━━
Dragon dominates a vast, lush, dynamically-lit landscape. Setting matches the dragon's grandeur — not a flat backdrop. Depth-on-depth: foreground tactile detail → midground dragon body + setting → background terrain stacked in atmospheric layers. Scale proven through peripheral elements (tiny trees / distant castles / storm clouds / surprise element silhouette).

VARY POSES BROADLY — perched / mid-breath / sleeping on hoard / emerging from cave / silhouetted against sky / mid-roar / resting head on forepaws / banking in flight / clutching prey / clawing the sky / taking off / landing. Never the same composition twice.

NEVER "tail wrapped around tower" cliché. NEVER tiny dragon in vast empty sky.

━━━ STRUCTURE — write 100-130 words ━━━
Open with the dragon + its action ("Crimson dragon mid-roar with bone-spike crest, jaw extended over volcanic peaks..."). Then weave in: landscape backdrop with depth layers, lighting/atmosphere, surprise element at midground, any drama event, color palette and mood. Painted-fantasy-novel finish.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  MECHBOT_TITAN_WAR: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, subject, action, landscape, composition, drama } = slots;

    const dramaSection = drama
      ? `
━━━ COMBAT PHENOMENON — render this visibly in the scene ━━━
${drama}

This is a war-event happening across the battlefield — render it as a visible secondary focal point that AMPLIFIES the titan's biblical scale (NOT eclipsing the titan, but contextualizing the scale of warfare around it).

`
      : '';

    return `You are a sci-fi cinematographer writing a TITAN WAR MACHINE scene for MechBot — a kilometer-scale combat machine in mid-engagement. Pure spectacle. Pacific Rim / 40K Imperator titans / AT-AT / Attack on Titan colossus / Edge of Tomorrow / Battlestar Galactica lineage. Hyper-real cinematic 3D / VFX-quality.

━━━ NON-NEGOTIABLE — BIBLICAL SCALE ━━━
The titan is kilometer-tall, skyscraper-scale. NEVER smaller. The scale IS the subject. Tiny humans / vehicles / aircraft / dwarfed buildings MUST appear in the frame as scale-provers. The viewer's gut reaction must be "holy shit it's enormous."

━━━ NON-NEGOTIABLE — VERTIGO COMPOSITION ━━━
${composition}

The chosen vertigo angle DRIVES the framing — render it precisely as described. The titan dominates the frame at biblical scale; the camera position makes the viewer FEEL the scale through perspective.

━━━ NON-NEGOTIABLE — MOVIE POSTER MANDATE ━━━
Every render is a MOVIE POSTER PROMOTIONAL FRAME — the kind of vista that stops the viewer mid-scroll and makes them GASP. EVERY QUADRANT of the frame has something striking — NO quiet corners. The eye should land on AT LEAST 4 distinct striking details across the frame, then follow a clear visual path.

OBSESSIVE-DENSITY MANDATE — stack ALL of these elements simultaneously in EVERY render:
  1. THE TITAN at vertigo-inducing scale (the composition angle handles this — render it cranked)
  2. ACTIVE COMBAT visible — weapons firing / shields rippling / explosions blooming / collapsing infrastructure
  3. SCALE PROVERS in multiple quadrants — tiny humans / vehicles / aircraft / dwarfed skyscrapers (NOT just one — at LEAST TWO scale anchors in different parts of the frame)
  4. ATMOSPHERIC PHENOMENON in its own quadrant — smoke columns / fire-glow / muzzle-flash light / sonic-boom shockwave / orbital-strike beam / artillery flashes on horizon
  5. SATURATED THEATRICAL SKY — NEVER bland grey overcast. Dawn pink-purple, dusk fire-orange, blood-red sunset, electric-violet storm, nuclear-orange horizon glow, neon-cyberpunk underlit cloud, aurora-coded EM-warfare interference, etc.
  6. FOREGROUND TACTILE DETAIL anchoring depth — cracked pavement / debris / overturned vehicle / fallen banner / spent shell-casings / shattered glass / steaming impact-crater

THINK Pacific Rim establishing-shot / 40K Imperator titan reveal-card / Attack on Titan colossus intro-frame / AT-AT Hoth-invasion vista / Edge of Tomorrow Mimic-attack splash / Battlestar Galactica heavy-cruiser reveal / Mass Effect Reaper-landing key-art / Independence Day "ship over city" gasp-frame.

━━━ NON-NEGOTIABLE — ACTIVE WAR ━━━
War is happening RIGHT NOW. The titan is firing / striding / clashing / shielding / collapsing — NEVER idle. Mid-action freeze-frame.

━━━ THE TITAN ━━━
${subject}

━━━ THE ACTION (what the titan is DOING in this combat moment) ━━━
${action}

━━━ THE BATTLEFIELD / SETTING ━━━
${landscape}

The setting is half the storytelling. Smoke columns, fire, debris, broken architecture, atmospheric context — render every detail. Tiny humans / vehicles / aircraft for scale.
${dramaSection}
━━━ LIGHTING ━━━
${lighting}

Layer the rolled lighting mode above with COMBAT-INTENSITY accents — muzzle-flash hot-spots / fire-glow uplighting / sparks raining from impact-zones / running-light arrays along titan chassis ridges pulsing alert-pattern.

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ ABSOLUTE BANS ━━━
- NO character-scale or vehicle-scale machines (robot-moment / mecha-pilots / industrial-machines / rust-apocalypse territories)
- NO peaceful idle / between-battles framing — combat is HAPPENING
- NO pilot-cockpit-focus framing (mecha-pilots territory)
- NO wasteland-scavenger / Mad Max DNA (rust-apocalypse)
- NO industrial work language — these are WAR machines

━━━ LEG-COUNT FIDELITY (NON-NEGOTIABLE) ━━━
If the titan description specifies a leg count (quadrupedal / hexapedal / four-legged / six-legged / serpentine / centaur-base / tripedal), the polished prompt MUST repeat the count TWICE (once near start, once mid-prompt). Flux defaults to bipedal — leg counts collapse without heavy reinforcement.

━━━ STRUCTURE — write 100-130 words ━━━
Open with the vertigo camera angle + the titan + its action ("Worm's-eye-view up the leg of a kilometer-tall bipedal humanoid mid-firing twin dorsal railguns over a shattered downtown..."). Then weave in: battlefield with depth + scale-provers, combat phenomenon if rolled, lighting/atmosphere, palette and mood. Hyper-real cinematic 3D finish.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  MECHBOT_SKYSHIPS: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, subject, action, landscape, composition, drama } = slots;

    const dramaSection = drama
      ? `
━━━ SKY-COMBAT PHENOMENON — render this visibly in the scene ━━━
${drama}

This is a sky-event happening across the airspace — render it as a visible secondary focal point that AMPLIFIES the spectacle (NOT eclipsing the skyship, but contextualizing the scale of aerial warfare).

`
      : '';

    return `You are a sci-fi cinematographer writing a MECH SKYSHIP scene for MechBot — a flying sci-fi vessel with predatory DNA, in an epic sky environment. Hyper-real cinematic 3D / VFX-quality.

━━━ ABSOLUTE BAN — NO MODERN MILITARY REFERENCES ━━━
NEVER use: aircraft carrier, dreadnought, battleship, destroyer, frigate, cruiser, submarine, gunship, bomber, fighter, jet, helicopter, naval, navy. These pull literal Earth-military reference into the render. The world is SCI-FI — sleek, advanced, ruthless.

━━━ AESTHETIC LANGUAGE — PREDATORY SCI-FI ━━━
Same DNA as MechBot's combat robots and mechs:
- Asymmetric predatory silhouettes — fang prows, blade fins, spike rams, arrow bows
- Glowing power conduits visible across the hull
- Insectoid / arachnid / serpentine / blade flying forms — NOT box-shaped warships
- Ornate machinery details (fluted plating, exposed cooling fins, bristling weapon mounts)
- Built to KILL — every line of the ship reads as predatory

━━━ NON-NEGOTIABLE — VERTIGO COMPOSITION ━━━
${composition}

The chosen vertigo angle DRIVES the framing — render it precisely as described. The skyship dominates the frame at its rolled scale; the camera position makes the viewer FEEL the air, the altitude, the speed through perspective.

━━━ NON-NEGOTIABLE — MOVIE POSTER MANDATE ━━━
Every render is a MOVIE POSTER PROMOTIONAL FRAME — the kind of vista that stops the viewer mid-scroll and makes them GASP. EVERY QUADRANT of the frame has something striking — NO quiet corners. The eye should land on AT LEAST 4 distinct striking details across the frame.

EVERY-QUADRANT-STRIKING MANDATE — every render must have:
  1. THE HERO SHIP at the chosen vertigo angle, dominating its quadrant — the ship IS the show
  2. MULTI-TIER atmospheric depth — multi-altitude cloud-architecture / volumetric god-rays / weather layers receding into the distance
  3. SATURATED THEATRICAL SKY — never bland grey overcast. Dawn pink-purple, dusk fire-orange, electric-violet storm, blood-red sunset, aurora-coded EM-warfare, twilight-gradient, nuclear-orange horizon, neon-cyberpunk underlit cloud, golden-cloud-cathedral, etc.
  4. FOREGROUND or DEEP-DISTANCE depth anchor — mountain peaks piercing cloud-deck / canyon walls framing the ship / cloud-architecture in the foreground / distant horizon-curve / ground silhouette far below

The SHIP is the SUBJECT, the SKY is the STAGE. NO mandatory wingmen / dogfight / multi-actor combat / named call-signs / forced damage / forced surreal-impossible-detail. If the ship + the sky + the vertigo angle + the saturated palette together create a gasp-frame, that's enough. Don't force narrative complexity over the cinematic moment.

THINK Macross Plus solo-fighter cloud-pass / Pacific Rim Jaeger drop-pod cloud-burst / Avatar Banshee-flight key-art / Star Wars Falcon-banking-into-sunset / Macross Frontier solo-cruise / Eve Online cinematic ship-art / Drew Struzan movie-poster ship reveals.

━━━ THE SKYSHIP (the seeded subject) ━━━
${subject}

━━━ THE ACTION (mid-motion in the air) ━━━
${action}

━━━ THE SKY + ENVIRONMENT BELOW ━━━
${landscape}
${dramaSection}
━━━ TURNED UP TO 11 — NON-NEGOTIABLE ATMOSPHERIC STACK ━━━
Every render must layer: multi-altitude clouds (foreground / mid / far) + volumetric god-rays or sun-shafts + color-gradient sky (dawn / dusk / storm / aurora / twilight) + weather element (wind / rain / lightning / heat-shimmer / ice-glitter) + scale staging (huge cloud architecture, distant fleet specks, ground micro-detail).

━━━ ACTION BELOW (when applicable) ━━━
If the setting includes a ground biome (titan-warzone / industrial / rust-wasteland / alien-biomech / mecha-pilot-field / power-armor-zone), include visible motion or activity at ground level — squad watching from a ridge, scavenger rig kicking dust, alien creatures reacting to the shadow, refinery workers looking up, titan walking far below. The ground is alive too.

━━━ LIGHTING ━━━
${lighting}

Layer the rolled lighting mode above with COMBAT-INTENSITY accents — muzzle-flash hot-spots / engine-glow trails / power-conduit pulse along hull / running-light arrays / shield-impact discharge.

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ ABSOLUTE BANS ━━━
- NO modern aircraft / military terminology (called out above)
- NO box-shaped Earth-warship hulls — predatory blade-shapes only
- NO ground-only scene without a skyship (the ship is the subject)
- NO single-layer flat sky — multi-layer atmospheric depth is non-negotiable
- NO realistic-photograph framing of a modern jet — this is sci-fi concept-art

━━━ SCALE STAGING ━━━
Stage ships at multiple distances when possible. Hero ship in foreground, smaller fleet specks at vanishing point. The sky should feel ENORMOUS and OCCUPIED.

━━━ STRUCTURE — write 100-130 words ━━━
Open with the vertigo camera angle + the skyship + its action ("Over-the-wing-POV of a blade-prow interceptor banking hard through storm-cloud canyon walls, contrails spiraling behind..."). Then weave in: sky environment with multi-altitude clouds, multi-distance ship staging, any sky-combat phenomenon, lighting/atmosphere, palette and mood. Hyper-real cinematic 3D finish.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  MECHBOT_MECHA_PILOTS: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, subject, action, landscape, composition, drama } = slots;

    const dramaSection = drama
      ? `
━━━ HANGAR/DEPLOYMENT PHENOMENON — render this visibly in the scene ━━━
${drama}

This is an environmental event amplifying the pilot+mech moment (NOT eclipsing them — contextualizing the drama of boarding/launching/deploying).

`
      : '';

    return `You are a sci-fi cinematographer writing a MECHA PILOT scene for MechBot — a pilot + their giant mech, with the SCALE RELATIONSHIP as the punchline. Hyper-real cinematic 3D / VFX-quality. Gundam / Evangelion / Pacific Rim drift-pod boarding / The Iron Giant / Titanfall pilot-jumping-into-mech.

━━━ NON-NEGOTIABLE — PILOT VISIBLE & TINY ━━━
The pilot MUST be visible in frame. The mech MUST be visible. Scale: the pilot is dwarfed by the machine — small enough to be a scale ruler. NEVER a portrait of the pilot filling the frame. NEVER mech-only with no pilot reference.

━━━ PILOT BIOLOGY — ANYTHING GOES ━━━
The seed specifies pilot biology (human / cyborg / alien / android / hybrid). Render whatever the seed says. NO defaulting to humanoid-male-pilot every time.

━━━ NON-NEGOTIABLE — VERTIGO COMPOSITION ━━━
${composition}

The chosen vertigo angle DRIVES the framing — render it precisely as described. The composition makes the SCALE GAP between pilot and mech viscerally legible.

━━━ EVERY-QUADRANT-STRIKING MANDATE — make it a movie-poster moment ━━━
Every render must have:
  1. **THE FRAME SHOWS 50-100% OF THE MECH'S FULL BODY** — NON-NEGOTIABLE. Head-to-foot silhouette (most renders), OR near-full body (e.g., feet to mid-chest with head implied just above frame). NEVER a fragment-only shot — NO leg-alone, NO hand-alone, NO shoulder-alone, NO chest-only, NO cockpit-interior wraparound. NEVER a wide-shot where the mech is a small mid-distance silhouette. NEVER a pilot-portrait with the mech absent or only suggested. The mech is the recognizable, full-body visual subject.
  2. THE PILOT (tiny but clearly visible) at the chosen vertigo angle, anchoring the scale-reading — pilot reads as 1-5% of frame against the mech's full body
  3. MULTI-TIER DEPTH — hangar / silo / deployment-bay / launch-cradle / shuttle-interior receding into deep distance with structural detail at every depth
  4. SATURATED THEATRICAL LIGHTING — never bland office-fluorescent. Emergency-red strobe, dawn-deployment cold-blue + warm-orange dual-source, hangar-amber sodium, launch-silo pulsing-orange, deep-cobalt-night with warm engine-glow accents, etc.
  5. ENVIRONMENTAL TEXTURE — pipes / cables / gantry-catwalks / hydraulic struts / chassis-seams / coolant-vapor / ladder-rungs / hatch-mechanisms — the world feels lived-in and functional

THINK Gundam Wing hangar-deck boarding sequence / Evangelion entry-plug pilot drop / Pacific Rim Drift-pod climb / Titanfall titan-fall-and-board / The Iron Giant Hogarth-finds-the-giant key-art / Aliens Power Loader hangar reveal.

━━━ PILOT + MECH (the seeded subject) ━━━
${subject}

━━━ THE ACTION (what the pilot is DOING in relation to the mech) ━━━
${action}

The pilot is mid-motion. The mech is part of the action — being climbed, ridden, occupied, repaired, deployed. NEVER a static portrait pose.

━━━ SETTING ━━━
${landscape}
${dramaSection}
━━━ LIGHTING ━━━
${lighting}

Layer the rolled lighting mode above with mech-specific accents — running-lights pulsing along the mech chassis, cockpit-interior glow spilling from open hatch, weapon-mount charging glow, hydraulic seams catching key-light.

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ ABSOLUTE BANS ━━━
- NO active battlefield with combat happening (titan-war-machines territory)
- NO pilot-less mech alone (robot-moment territory)
- NO squad of armored soldiers (power-armor-infantry territory)
- NO pilot fused into the mech (cyborg-* territory) — pilot is SEPARATE, OPERATING the mech
- NO mining / construction / industrial work (industrial-machines territory)
- NO scrappy wasteland scavenger rig (post-apoc-rust-tech territory)
- NO portrait-only pilot framing without mech reference

━━━ STRUCTURE — write 100-130 words ━━━
Open with the vertigo camera angle + pilot + mech context ("Worm's-eye-up-the-leg as a half-cyborg pilot in matte-black bodysuit grips the third rung of a 30-meter access ladder, blast doors groaning open above..."). Then weave in: setting with multi-tier depth, any deployment-phenomenon drama, lighting/atmosphere, palette and mood. Hyper-real cinematic 3D finish.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  MECHBOT_POWER_ARMOR_INFANTRY: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, subject, action, landscape, composition, engagement, allied_tech, drama } = slots;

    // allied_tech is an array (pickN: 2) — format as 2 distinct allied machines fighting alongside
    const alliedTechBlock = Array.isArray(allied_tech)
      ? allied_tech.map((t, i) => `Ally #${i + 1}: ${t}`).join('\n\n')
      : allied_tech;

    const dramaSection = drama
      ? `
━━━ BATTLEFIELD PHENOMENA — render multiple simultaneous violence-events in the scene ━━━
${drama}

ALSO: additional simultaneous violent events happening elsewhere in the frame — fires raging at midground / smoke columns rising in deep distance / debris-cloud expanding from another impact / secondary explosions chaining / muzzle-flashes blooming everywhere / tracer-rounds crossing in multiple directions / burning vehicle wrecks. MULTIPLE eruptions and impacts at once — the battlefield is FULLY OVERWHELMED with violence.

`
      : '';

    return `You are a war cinematographer writing a POWER ARMOR INFANTRY scene for MechBot — a MEAN KILL-TEAM squad of 8-12 power-armored predator-soldiers + 2-4 allied combat-bots/drones/walkers (FULL MAN+MACHINE vs MACHINE) MID-FIREFIGHT in maximum-density battlefield chaos against multiple enemy actors. Hyper-real cinematic 3D / VFX-quality. HELLDIVERS 2 cinematic + Guard-Dog rovers / WARHAMMER 40K Tactical Squad + Dreadnought + Servitor / ALIENS Colonial Marines + Power-Loader + APC / MASS EFFECT squad + LOKI mechs / STARCRAFT Marines + Goliath + Siege Tank / AVATAR Marines + AMP-suits / DOOM Eternal cutscene / STARSHIP TROOPERS Mobile Infantry + Marauder mech / KILLZONE Helghast / EDGE OF TOMORROW Jacket-armor.

🚫 STAR WARS / HALO HARD BAN — NEVER write Stormtrooper / Imperial / Mandalorian / beskar / T-visor / Boba / Mando / Halo / ODST / Spartan / MJOLNIR / UNSC / R2-D2 / BB-8 / battle droid / Clone Trooper / AT-AT / AT-ST. The aesthetic these IPs represent is fine — but NEVER name them.

━━━ NON-NEGOTIABLE — MAN + MACHINE vs MACHINE ━━━
This is full man+machine combat. The marines fight ALONGSIDE friendly combat-bots / drones / walkers — these allied machines are PART of the squad, mid-fire alongside the marines, NOT background flavor. Helldivers Guard-Dog rovers / 40K Dreadnoughts / Aliens APC/Power-Loader / Mass Effect LOKI / Starcraft Goliath / Avatar AMP-suit lineage. Both the human marines AND the friendly machines are mid-violence simultaneously.

━━━ NON-NEGOTIABLE — MEAN KILL-TEAM, NEVER PROCEDURAL ━━━
This squad is HUNTING and KILLING. They are MEAN, aggressive, scarred, weathered, predator-stanced. NOT Tom-Clancy SWAT. NOT "professional military procedural." NOT "tactically scanning." They are BADASS SPACE MARINES OUT TO KILL — fighting WITH their robot allies.

❌ BANNED LANGUAGE: "professional unit / tactical formation / breach team / stacked at entry / point-man / hand-signals / overwatch / spotter / fire-team suppressing / bounding overwatch / scanning / surveying / careful / measured / cautious / observation"

✓ MANDATORY LANGUAGE: "mid-charge / mid-blast / mid-fire / mid-execute / mid-strike / mid-roar / mid-stride / kicking-down / dragging / leaping / hunting / stalking / predator-stance / snarl-behind-visor / weathered / scarred / blood-spattered / kill-streak / war-trophy"

━━━ NON-NEGOTIABLE — MAXIMUM-DENSITY HORDE + ALLIED MACHINES ━━━
8-12 figures from the seeded squad must be VISIBLE in frame (the seed names the count — render that many AT LEAST). PLUS many additional friendly reinforcements visible behind/flanking/in mid-distance (more marines than you can count individually). PLUS 2-4 allied combat-bots/drones/walkers fighting alongside (multiple distinct machine-types). So FULL FIGURE COUNT reads as 15-25 armored marines + 2-4 friendly machines in or around the engagement. MAXIMUM DENSITY — a literal HORDE of friendly marines + their robot/walker allies fighting together. Think Helldivers cinematic with full squad + Guard-Dogs + walker + tank-bot all in frame.

━━━ NON-NEGOTIABLE — MAXIMUM COMMOTION (NOT POSED) ━━━
The squad is MID-FIREFIGHT in maximum-chaos. The scene is FULL OF SIMULTANEOUS VIOLENCE. NEVER a hero-shot of a squad standing aggressively. Every render must have AT LEAST 5-7 simultaneous things happening across the frame:
  • Multiple marines mid-fire with weapons discharging
  • Multiple allied machines mid-fire alongside
  • Multiple enemy combatants reacting (mid-fall / mid-return-fire / mid-flee)
  • Multiple muzzle-flashes and weapon-discharge effects
  • Multiple smoke columns / fires / explosions across the frame
  • Multiple debris-clouds / dust-plumes / shockwave-rings
  • Tracer-rounds crossing in multiple directions
  • Burning vehicle-wrecks in midground
  • Brass-rain and shell-casings scattered in foreground

━━━ THE ENGAGEMENT BEAT (what's HAPPENING in the wider scene) ━━━
${engagement}

The squad is mid-engagement with MULTIPLE OTHER ACTORS visible — enemy combatants, allied units, vehicles, civilians, hostile creatures, aerial support. The OTHER actors are doing things VISIBLY (firing back, fleeing, dying, exploding, charging in).

━━━ THE ALLIED COMBAT MACHINES (multiple — fighting WITH the squad, render BOTH visibly) ━━━
${alliedTechBlock}

BOTH allied machines are alongside the marines mid-fire — NOT distant units, NOT background flavor. Render them ACTIVELY engaged, weapons firing, alongside the human marines, at DIFFERENT positions in the frame (one foreground-left and one foreground-right / one with squad and one flanking / one mid-stride past and one stationary firing). The marines AND multiple machines fight as one war-pack.

━━━ NON-NEGOTIABLE — VERTIGO/DYNAMIC COMPOSITION ━━━
${composition}

The chosen angle DRIVES the framing — render it precisely as described.

━━━ EVERY-QUADRANT-STRIKING MANDATE — make it a movie-poster firefight at maximum density ━━━
Every render MUST have ALL of these simultaneously visible:
  1. THE SQUAD HORDE as dominant focal subject (8-12 visible figures + reinforcements behind/flanking, 15-25 total marines, all mid-aggressive-action)
  2. MULTIPLE ALLIED COMBAT MACHINES (2-4 visible — drone + walker / walker + mech / dreadnought + gun-platform / mech + tank-bot — at different frame positions, all firing or mid-action)
  3. MULTIPLE ENEMY ACTORS visible (enemy combatants mid-return-fire / mid-fall / mid-flee / vehicles mid-explode / creatures swarming — at least 3-5 enemy figures in frame)
  4. WEATHERED ARMOR DETAIL — scuffed plates, scratched paint, blood-spatter, dust-caked, kill-streak tally marks, war-trophies on every marine and machine
  5. MULTI-TIER DEPTH — foreground squad+allies / midground enemy+vehicle-wrecks+combat-debris / deep distance battlefield receding with structural detail
  6. MULTIPLE FIRES / EXPLOSIONS / SMOKE COLUMNS — 2-3 distinct fires across the frame, multiple smoke columns rising at different depths, at least 1 active explosion-bloom
  7. MULTIPLE MUZZLE-FLASHES + WEAPON-DISCHARGE everywhere — from BOTH marines AND allied machines, mid-fire across the entire scene
  8. SATURATED THEATRICAL COMBAT LIGHTING — muzzle-flash strobe, explosion-backlit edge-orange, dawn-cold grim, dusk-blood-red, plasma-bolt tracer-walls
  9. ENVIRONMENTAL VIOLENCE TEXTURE — spent brass / smoking weapons / kill-trail / debris / blood-spatter / smoke-trails / dust-clouds / scorch-marks / shell-casings carpeting the ground
  10. AIRBORNE CHAOS EVERYWHERE — airborne debris / smoke-plumes / multiple muzzle-flares / crisscrossing tracers / falling embers / dust-clouds / shockwave rings / spent shell-casings still falling

THINK Helldivers 2 cinematic + Guard-Dog rover / Warhammer 40K Marines + Dreadnought marketing / Aliens Colonial Marines + APC reveal / Mass Effect Krogan + LOKI mech / Starcraft Marines + Goliath / Avatar Marines + AMP-suit / Doom Eternal cutscene.

━━━ THE SQUAD (the seeded subject) ━━━
${subject}

━━━ THE ACTION (what the squad members are DOING) ━━━
${action}

The squad is mid-violence. Every member is mid-action (mid-fire / mid-charge / mid-execute / mid-strike / mid-leap / mid-blast). NEVER static positioning.

━━━ SETTING ━━━
${landscape}
${dramaSection}
━━━ LIGHTING ━━━
${lighting}

Layer the rolled lighting mode above with combat-specific accents — muzzle-flash strobes, weapon-mount charging glow (from BOTH marines AND allied machines), helmet-floodlamp cones, fire-glow from nearby burning wrecks.

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ ABSOLUTE BANS ━━━
- NO solo hero shot — full horde (8-12 visible marines + reinforcements + 2-4 allied machines) is non-negotiable
- NO small fire-team — always 15-25 total marines + multiple machines in frame
- NO missing allied machines — MULTIPLE allied bots/drones/walkers MUST be visible at different positions
- NO single explosion/fire — multiple simultaneous violent events required
- NO clean scene — battlefield must read OVERWHELMED by violence (smoke, fires, brass, debris everywhere)
- NO pilot-in-cockpit framing (mecha-pilots territory)
- NO giant-mech scale on the ally (titans territory) — allied machines are HUMAN-SCALE-TO-2X marine
- NO cyborg integration on marines — they are fully human under armor
- NO scrappy improvised armor (rust-apoc territory) — heavy professional kits
- NO industrial mining work (industrial-machines)
- NO procedural-military Tom-Clancy SWAT realism
- NO clean newly-issued armor — every armor set WEATHERED, scarred, lived-in
- NO Star Wars / Halo IP names (Stormtrooper / Imperial / Mandalorian / beskar / Halo / ODST / Spartan / MJOLNIR)

━━━ STRUCTURE — write 180-240 words ━━━
Open with the vertigo camera angle + squad+allies+engagement context ("Low-forward mid-charge as ten Blood-Angel Space Marines in cracked crimson ceramite sprint at the lens flanked by a waist-high quadruped walker-bot mid-fire underslung rotary cannon AND a chest-high tracked weapon-platform deployed firing in sweeping arc..."). Then weave in: BOTH allied combat machines alongside (at different positions), the engagement beat with multiple enemy actors, setting with multi-tier depth, multiple simultaneous battlefield phenomena, lighting/atmosphere, palette and mood. The render MUST feel like FULL MAN+MACHINE combat at MAXIMUM-DENSITY — a literal war-pack mid-firefight with multiple explosions, fires, smoke, brass-rain, allied machines all in frame.

Output ONLY the raw 180-240 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  MECHBOT_POST_APOC_RUST_TECH: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, subject, action, landscape, composition, drama } = slots;

    const dramaSection = drama
      ? `
━━━ WASTELAND PHENOMENON — render this visibly in the scene ━━━
${drama}

An environmental wasteland event amplifying the chase / scavenger / bush-fix moment (dust-devil / sandstorm wall / wreck-fireball / molotov / vultures / fuel-spill / ram-impact / etc.). Render it visibly.

`
      : '';

    return `You are a sci-fi wasteland cinematographer writing a POST-APOC RUST TECH scene for MechBot — a SCRAP-WELDED BUSH-FIX FAR-FUTURE scavenger rig + visible crew running across the wasteland (or being bush-fixed mid-action). Hyper-real cinematic 3D / VFX-quality. MAD MAX FURY ROAD (sci-fi-tilted variant) / DOOF WAGON / GIGAHORSE / WAR RIG / BORDERLANDS PANDORA BANDIT / TANK GIRL / DEATH STRANDING off-Earth / TWISTED METAL / WARHAMMER 40K ORK-LOOTED / DUNE Sardaukar-thopter / CYBERPUNK 2077 NOMAD-CLAN / HORIZON ZERO DAWN rebel-tech / FALLOUT-RAIDER lineage. Sci-fi-tilted RETROFUTURIST, JURY-RIGGED, lived-in, off-kilter, scary, gleefully unsafe.

🚫 SCI-FI MANDATORY — NOT 21st-CENTURY EARTH ━━━
The rig is a FAR-FUTURE post-apoc machine, NOT a present-day Earth vehicle. NEVER render anything that reads as a contemporary truck / 18-wheeler / big-rig / Peterbilt / Kenworth / semi-truck / box-truck / pickup-truck / motorcycle / VW van / camper / RV / construction equipment / 1981-Mad-Max-Toecutter-buggy. The rig is FAR-FUTURE — alien-world / post-collapse Earth / Pandora / Mars-colony / asteroid-mining-zone / cyberpunk-dystopia-wasteland. Mandatory sci-fi cues (render 2-3 per render visibly): fusion-cell engines / plasma-drive exhaust / alien-tech salvage welded into the build / hover-skirt augmentation / glowing energy-conduit veins through the chassis / power-pack lashings / radiation symbols / xenomaterial fittings / scavenged orbital-debris hull-plates / pulse-cannon mounts / glowing reactor-core in the gut of the rig.

━━━ NON-NEGOTIABLE — BUSH-FIX SCRAP DNA ━━━
This rig is a SCRAP-WELDED CHIMERA held together with wire / chains / prayer / spite. NEVER a clean factory-built vehicle. NEVER military-issue. NEVER pristine. EVERY surface shows bush-mechanic ingenuity:
• MISMATCHED salvaged body panels (alien-hull plates / drop-pod fragments / road-sign offcuts / locker-doors / oil-drum sheets / refrigerator-door slabs / cargo-container flanks welded chaotically)
• ANTENNA FOREST rising from the roof (twisted comms-rods, war-banner poles, signal-mirror masts, scrap-totem)
• EXHAUST STACKS (multiple chimneys belching plasma-glow or black smoke)
• RAM PROW or SPIKE PLATE on the front (welded scrap-iron spikes, hood-ornament alien-skull, cattle-catcher prong)
• ROPE-BOUND POWER-CELLS / fuel-pods lashed to chassis (visibly-glowing power packs with frayed ropes)
• WAR-TROPHIES dangling (alien-skulls, captured enemy-tech, severed weapon-parts, chains, banners with hand-painted radiation symbols)
• SUN-BLEACHED PAINT over rust
• WIRE-MESH CAGES around driver / crew positions
• EXPOSED ENGINE BLOCKS (fusion-cells / plasma-coils / reactor-rods visible through hull gaps)
• DRAGGING CHAINS / SPIKES behind

🚫 ABSOLUTE BANS:
• NO clean / pristine / well-maintained machinery (industrial-machines territory)
• NO professional military uniforms (power-armor-infantry territory) — crews are RAGGED scavengers
• NO giant-titan scale (titan-war territory) — VEHICLE / WALKER scale (2-5x crew height)
• NO pilot-in-glass-cockpit (mecha-pilots territory) — drivers EXPOSED in open hatches / wire-mesh cages
• NO ceremonial / ornate / showpiece robot (robot-moment territory)
• NO abandoned / decay-pathos / no-crew — rigs are RUNNING, crew is VISIBLE
• NO Star Wars / Halo IP names
• 🚫 HARD BAN — NO PRESENT-DAY EARTH SETTING. NEVER a recognizable 21st-century street / suburban road / highway / overpass / asphalt city-block / parking lot / shopping mall / gas station / regular intersection / pedestrian sidewalk. Setting is ALWAYS post-apoc WASTELAND or POST-COLLAPSE RUIN.
• 🚫 HARD BAN — NO MODERN INDUSTRIAL INFRASTRUCTURE rendered as still-functional. NEVER a working oil refinery / modern pipeline / present-day power plant / chemical plant / nuclear cooling-tower. Even "rust-tower graveyards" must render as POST-COLLAPSE BONE-YARDS — rusted skeletal frames decayed for decades, never present-day operation.

━━━ NON-NEGOTIABLE — CREW IS VISIBLE & ENGAGED ━━━
1-5 crew MUST be visible on/around the rig: driver in open hatch / gunners perched on roof / scavengers leaning out side hatches / lookouts on chassis / mechanics swarming during bush-fix. Crew aesthetic: war-painted faces, goggles, leather harnesses, scarves over mouths, mismatched scavenger gear, scarred skin, ragged hair, lashed-on gear.

━━━ NON-NEGOTIABLE — RIG IS ALIVE & MOVING (or BUSH-FIXED MID-ACTION) ━━━
The rig is RUNNING (roaring / racing / chasing / pursuing) OR being BUSH-FIXED mid-action (crew mid-weld / pit-stop refuel / wheel-change in a hidden gulch). Dust kicked up by wheels / treads / leg-impacts. Plasma-drive exhaust trailing. Engine-roar implied.

━━━ NON-NEGOTIABLE — MAD MAX CHASE COMPOSITION ━━━
${composition}

The chosen camera angle DRIVES the framing — render it precisely as described. The composition makes the rig's SCRAP CHARACTER + MOTION + crew immediately legible.

━━━ MOVIE POSTER MANDATE — EVERY QUADRANT MUST BE STRIKING — FLAGSHIP MOMENT ━━━
This is a FLAGSHIP path. Every render is a MOVIE POSTER PROMOTIONAL FRAME — the kind of vista that stops the viewer mid-scroll. EVERY QUADRANT of the frame has something striking — NO quiet corners. The viewer should be able to SCREENSHOT THIS AS A WALLPAPER and want to study it.

OBSESSIVE-DENSITY MANDATE — stack ALL of these elements simultaneously in EVERY render:
  1. THE RIG at vertigo-inducing scale — fills 50-70% of frame as a scrap-welded sci-fi chimera, recognizable bush-fix + sci-fi DNA, every panel of the chassis legible from a distance
  2. THE VISIBLE CREW (2-5 figures on/around rig) all in mid-action — driver leaning out hatch / gunner mid-fire on roof / lookout scanning / scavenger / mechanic mid-bush-fix — no static poses, every body in motion or engaged
  3. MOTION OR ACTION (dust-trail trailing across frame / motion-blur on ground / pursuit close behind / pit-repair sparks flying / convoy formation receding into distance)
  4. SCI-FI CUE — at least 3-4 of: glowing energy-conduit veins / fusion-cell engine pulsing through chassis gaps / plasma-drive exhaust trailing GLOWING SMOKE / alien-tech salvage panel / hover-skirt humming / xenomaterial fitting glowing / radiation symbol stenciled / pulse-cannon mount mid-charge / reactor-core visible in the gut
  5. SCRAP-WELDED DETAIL — at minimum 5 of: antenna forest with war-banners snapping / mismatched body panels (drop-pod fragments + locker-doors + license-plates + alien-hull) / lashed fuel/power-cells visibly glowing / war-trophies dangling / ram prow with welded scrap-iron spikes / 4+ exhaust stacks belching glowing-plasma / improvised pulse-weapons / wire-mesh cages / dragging chains
  6. MULTI-TIER DEPTH MANDATORY — foreground tactile texture (cracked salt-pan / dust-cloud / scrap-shard / wreckage in extreme close) / midground rig + crew (the hero subject) / deep distance wasteland vista (ruined sci-fi mega-spires / collapsed orbital-debris pylons / dust-canyon receding / sandstorm wall building / sunset horizon)
  7. SATURATED THEATRICAL SKY — never bland or empty. Fury Road BURNING ORANGE sunset / blood-red dawn / sandstorm SEPIA WALL filling upper third / plasma-storm electric-violet / DUAL-COLOR contrast (cold upper sky + warm lower horizon). The sky is HALF the poster.
  8. AIRBORNE CHAOS EVERYWHERE — at least 2-3 of: airborne debris / dust-plumes / flame-flickers / glowing-plasma exhaust trails / sparks from welding or impact / atmospheric haze cones / floating scrap / vultures circling / sandstorm particulate / heat-shimmer distortion
  9. EYE-LANDS-ON-4+-DETAILS — the viewer's eye should immediately land on 4+ striking details in different quadrants — NOT a centered single-focus beauty shot. Wreckage in foreground-left, hero rig in midground-center, distant convoy in deep-right, sandstorm wall in upper-frame, etc.
  10. EMOTIONAL DNA mandatory — every render should land one of: AWE (vertigo-scale wasteland reveal) / DREAD (the world has ended and these are the survivors) / DEFIANCE (the crew fights on against impossible odds) / ELATION (catching air mid-jump, war-banners snapping) / KILL-ENERGY (mid-raid moment, crew teeth-bared)

VERTIGO-INDUCING SCALE — every render conveys awe-inducing scope:
• Wasteland horizons that vanish into mist or sandstorm
• Towering ruined sci-fi mega-spires looming in the deep distance
• Dust-canyons dropping a thousand meters below the rig
• Convoys stretching across the entire frame
• Sky dominating 50%+ of the frame with theatrical color

THINK MAD MAX FURY ROAD theatrical-release promotional-frame / WH40K Ork Looted-Trukk RAID key-art / Dune Sardaukar-thopter establishing-shot / BORDERLANDS bandit-camp marketing reveal / DEATH STRANDING off-Earth E3-trailer frame / CYBERPUNK 2077 NOMAD-CLAN cinematic / HORIZON ZERO DAWN raider-tech promotional / FALLOUT key-art Highwayman silhouette against ruined-city / BLADE RUNNER 2049 wasteland-vehicle approach-shot. Every render should make the viewer GASP.

━━━ THE RIG + CREW (the seeded subject) ━━━
${subject}

━━━ THE ACTION (rig running, crew engaged, or pit-stop bush-fix) ━━━
${action}

Render the rig MID-MOTION or MID-BUSH-FIX. The crew is engaged. NEVER static showpiece-pose.

━━━ THE WASTELAND SETTING ━━━
${landscape}

Render the wasteland environment as half the story — heat-shimmer, dust storms, sun-bleached terrain, wreckage scattered, desolate vista in distance. Multi-tier depth: foreground terrain detail / midground rig + crew / background wasteland vista.
${dramaSection}
━━━ LIGHTING ━━━
${lighting}

Golden-hour and dust-orange hues favored — Mad Max sunset palette. Even at night, sodium-orange / fire-glow / molotov-uplight accents. Layer the rolled lighting mode with wasteland-specific accents — rig-mounted plasma-torch / exhaust-smoke catching light / dust-cloud catching backlight.

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ STRUCTURE — write 130-170 words ━━━
Open with the chase camera angle + scrap-welded sci-fi rig context ("Low-chase from the salt-flat as an 8-wheeled scavenger rig welded from drop-pod hull-fragments and refrigerator-door slabs roars past at full plasma-drive, twin fusion-cell engine glowing amber through gut-gaps, four crew in war-paint bungee-lashed to roof-mounted pulse-cannon mounts..."). Then weave in: visible crew engaged, wasteland setting with multi-tier depth, any wasteland-phenomenon drama, lighting/atmosphere, palette and mood. The render MUST feel like a sci-fi-tilted Mad Max key-art moment.

Output ONLY the raw 130-170 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  MECHBOT_HUMANOID_ROBOTS: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, subject, action, landscape, composition, drama } = slots;

    const dramaSection = drama
      ? `
━━━ VISUAL FLOURISH (40%-gated atmospheric element — render visibly) ━━━
${drama}

A subtle visual flourish amplifying the robot's presence WITHOUT cluttering it. Render visibly but robot remains the focal subject.

`
      : '';

    return `You are a sci-fi concept-art painter writing a HUMANOID ROBOT scene for MechBot — a SINGLE cool human-scale (1.5-2.5m tall) bipedal humanoid robot caught in a cinematic FLAGSHIP MOMENT. Hyper-real cinematic 3D / VFX-quality. Visual reference DNA: polished chrome/titanium/charcoal chassis + multi-iris compound-optic eye-array on the head (kaleidoscope cyan-magenta-amber blend) + multi-color glowing joint-seams + chest-cores + shoulder-orbs.

THINK Real Steel boxing-bots / Detroit Become Human mechanical androids / Apex Legends Pathfinder + Revenant + Ash / Ex Machina Ava (mechanical frame) / Megaman bosses / Horizon Zero Dawn Hephaestus-builds / Mass Effect Geth Prime humanoid / Code Geass knightmare-pilot-frames / Cyberpunk 2077 Adam Smasher / Boston Dynamics Atlas (sci-fi-exaggerated).

🚫 STAR WARS / HALO HARD BAN — NEVER write Stormtrooper / Imperial / Mandalorian / beskar / T-visor / Boba / Mando / Halo / ODST / Spartan / MJOLNIR / UNSC / R2-D2 / BB-8 / C-3PO / IG-88 / K-2SO / Battle Droid / Clone Trooper / Master Chief / Forerunner Promethean.

━━━ NON-NEGOTIABLE — STRICTLY HUMANOID BIPEDAL HUMAN-SCALE ━━━
Standalone BIPEDAL HUMANOID at HUMAN SCALE (1.5-2.5m). Head + torso + 2 arms + 2 legs.

🚫 NEVER:
• Hexapod / quadruped / hovering / spherical-rolling / tracked / wheeled (robot-moment territory)
• Giant mech / titan / kilometer-scale (titan-war / mecha-pilots territory)
• Cyborg with flesh (cyborg-* territory) — FULLY MECHANICAL, no skin, no hair
• Power-armored soldier (power-armor-infantry — those have humans INSIDE)
• Scavenger bush-fix rig (rust-tech) — POLISHED + DESIGNED, never scrap-weld
• Industrial heavy-loader at workplace (industrial-machines territory)

━━━ NON-NEGOTIABLE — MULTI-IRIS COMPOUND-OPTIC HEAD ━━━
The head reads as a precision instrument with MULTIPLE GLOWING OPTIC LENSES (2-7 lenses arranged on the helm, often KALEIDOSCOPE RAINBOW BLOOM in cyan-magenta-amber-emerald iridescent blend). The optic-array IS the face — NOT a single cyclops eye, NOT a smooth featureless dome. The seed describes the head archetype — render exactly that compound-optic configuration.

━━━ NON-NEGOTIABLE — MULTI-COLOR GLOWING DETAIL ━━━
Visible glowing energy-detail across the chassis in MULTIPLE COLORS (cyan + amber + magenta + emerald blend, NOT one color):
• Joint-seams glowing at shoulders / elbows / hips / knees
• Chest-core glowing visibly through articulated chest-plates
• Shoulder-orbs / forearm-vents / spine-conduit accents
• Energy-conduit veins tracing along the limbs

━━━ NON-NEGOTIABLE — POLISHED + EXPOSED MECHANICAL DETAIL ━━━
GLEAMING POLISHED chrome / titanium / brushed-metal in PRISTINE finish. Mirror-finish in places, brushed in others. Light catches every panel. BUT — beneath the polished plating, exposed mechanical detail is visible — servo-pistons / actuator-joints / hydraulic-cables / gear-trains showing through gaps. Mechanical truth visible.

🚫 NEVER scrap-weld bush-fix DNA. Chassis is DESIGNED + INTACT.

━━━ NON-NEGOTIABLE — FULL-BODY VISIBLE ━━━
ENTIRE robot visible from FEET to TOP-OF-HEAD. Occupies 50-75% of vertical frame. NEVER portrait closeup / bust shot / detail closeup / face-only / helmet-only / waist-up / knees-up cropping. The viewer must SEE THE WHOLE ROBOT.

━━━ NON-NEGOTIABLE — COMPOSITION ━━━
${composition}

The chosen camera angle DRIVES the framing. Render precisely as described.

━━━ MOVIE POSTER MANDATE — EVERY QUADRANT MUST BE STRIKING — FLAGSHIP MOMENT ━━━
This is a FLAGSHIP path. Every render is a MOVIE POSTER PROMOTIONAL FRAME — the kind of vista that stops the viewer mid-scroll. The kind of frame that opens a sci-fi epic, anchors a video-game cover, sells a streaming series. EVERY QUADRANT of the frame has something striking — NO quiet corners. The viewer should be able to SCREENSHOT THIS AS A WALLPAPER and want to study every detail.

OBSESSIVE-DENSITY MANDATE — stack ALL of these elements simultaneously in EVERY render:
  1. THE ROBOT at flagship scale — 50-75% vertical frame, full body visible, every panel and glowing detail legible from a distance
  2. MULTI-IRIS COMPOUND-OPTIC HEAD visibly glowing — kaleidoscope cyan-magenta-amber-emerald rainbow bloom (the eyes are the soul of the design, render them HOT and crisp)
  3. MULTI-COLOR GLOWING JOINT-SEAMS + chest-core + shoulder-orbs — visible energy-detail in 3-4 distinct colors across the chassis (NOT a single monochrome glow)
  4. POLISHED CHROME / TITANIUM chassis catching light dramatically — mirror-reflection on smooth panels, brushed texture on others, exposed mechanical detail beneath plating
  5. ATMOSPHERIC CINEMATIC ENVIRONMENT — outdoor preferred (waterfall / snow-mountain / canyon / overgrown ruin / fire-glow wasteland / alien wilderness / bioluminescent jungle / crystal cavern). NEVER bland flat empty backdrop.
  6. MULTI-TIER DEPTH MANDATORY — foreground tactile texture (mist / rock / water / vegetation / debris in extreme close) / midground robot (the hero) / deep distance atmospheric vista receding into haze
  7. SATURATED THEATRICAL LIGHTING — rim-light cinematic / golden-hour raking / backlit-silhouette explosion / multi-color neon uplight / atmospheric mist god-rays / waterfall-mist diffusion / volcanic fire-glow. The lighting tells half the story.
  8. ATMOSPHERIC PARTICULATE — at least 2-3 of: mist / dust-motes catching light / floating spores / falling embers / rain / snow / steam-vents / heat-shimmer / bioluminescent particles drifting
  9. EYE-LANDS-ON-4+-DETAILS — the viewer's eye should immediately land on 4+ striking details in different quadrants — NOT a centered single-focus beauty shot. Robot in midground-center, environmental anchor in deep-distance, foreground tactile in lower frame, atmospheric flourish in upper frame.
  10. EMOTIONAL DNA mandatory — every render should land one of: AWE (contemplative robot facing vast vista) / WONDER (mid-discovery / mid-revelation moment) / MENACE (predator-stalk pose in atmospheric environment) / GRACE (athletic poetic mid-motion) / SOLITUDE (lone robot in atmospheric ruin / vista) / DEFIANCE (battle-stance against impossible backdrop)

VERTIGO-INDUCING SCALE — every render conveys awe-inducing scope:
• Atmospheric vistas that vanish into mist or fog
• Towering rock formations / mega-spire ruins / canyon walls dwarfing the scene
• Sky dominating 40%+ of the frame with theatrical color
• Deep distance receding to vanishing point with multiple atmospheric layers
• Robot reads as a SINGLE CHARACTER in a VAST WORLD

THINK premium sci-fi concept-art / movie key-art / collectible artbook spread / videogame promotional reveal / streaming-series poster. Every render should make the viewer GASP and want to share.

━━━ ALLOW FEMININE / MASCULINE / ALIEN-FORM chassis variations ━━━
Chassis can be feminine-coded (subtle chest-plates, hip-taper — FULLY MECHANICAL never flesh), masculine-coded (broad shoulders, bulky armor), androgynous (sleek genderless), or alien-form (elongated-skull / insectile-helm / faceted-alien-design). The seed describes which — render accordingly. NEVER add synthetic skin or human-hair.

━━━ THE ROBOT (the seeded subject — render with obsessive detail) ━━━
${subject}

━━━ THE ACTION (what the robot is doing) ━━━
${action}

Render the body language precisely. Both contemplative-still AND mid-action poses are valid.

━━━ THE ATMOSPHERIC SETTING ━━━
${landscape}

Render with full depth — foreground textural detail, midground robot sharp and ornate, background atmospheric vista receding into haze.
${dramaSection}
━━━ LIGHTING ━━━
${lighting}

Layer the rolled lighting mode with robot-specific accents — multi-color glow from the robot's own optic-array + joint-seams + chest-core providing supplementary illumination catching the chassis.

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ ABSOLUTE BANS (REPEATED — critical) ━━━
- NO multiple robots — SINGLE solo humanoid robot
- NO companions / humans / crowds dominating frame (atmospheric distant figures OK as scale)
- NO non-humanoid forms (hexapod / hovering / wheeled / quadruped)
- NO giant-mech scale (1.5-2.5m human-scale only)
- NO cyborg flesh / synthetic skin / human hair
- NO scrap-weld bush-fix DNA
- NO portrait / bust / detail closeup framing (full body 50-75% mandatory)
- NO single-cyclops-large-eye face (multi-iris compound-optic mandatory)
- NO bland flat office / clean white empty corporate setting
- NO Star Wars / Halo IP names

━━━ STRUCTURE — write 150-200 words ━━━
Open with the camera angle + robot context ("Hero-shot low-3/4 angle of a slim feminine-coded chrome-and-titanium humanoid robot standing at the edge of a glowing-cyan waterfall pool, twin large multi-iris optic-lenses on the smooth dome-helm blooming kaleidoscope rainbow magenta-cyan-amber, exposed servo-joints catching the mist-light, contemplative still pose..."). Then weave in: pose, atmospheric setting with multi-tier depth, any visual flourish drama, lighting/atmosphere, palette and mood. The render MUST feel like a flagship sci-fi concept-art frame — premium quality, screenshot-worthy, every quadrant striking.

Output ONLY the raw 150-200 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },


  MECHBOT_CYBORG_WOMAN: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, cyborg_feature, cyborg_material, action, landscape, composition, drama } = slots;

    const dramaSection = drama
      ? `
━━━ ATMOSPHERIC FLOURISH (40%-gated — render subtly) ━━━
${drama}

A subtle atmospheric flourish amplifying her presence WITHOUT cluttering her as the focal subject.

`
      : '';

    return `You are a cinematographer writing a CYBORG WOMAN scene for MechBot — a half-human half-machine BEING rendered in hyper-real cinematic 3D. She is simultaneously the most beautiful and most terrifying thing in the frame. Ex Machina / Alita / Ghost in the Shell / Blade Runner 2049 / Westworld / Cyberpunk 2077 / Mass Effect / The Expanse lineage.

━━━ ABSOLUTE BAR — PAINTERLY HYPERREAL BEAUTY-PORTRAIT (every render) ━━━
Every render is a PAINTERLY HYPERREAL BEAUTY-PORTRAIT — high-end concept-art beauty study with sci-fi cyborg jewelry integrated into the face. NOT cinematic action still. NOT gritty cyberpunk tactical concept-art. NOT movie-poster wide-vista. Think: a master digital painter doing a portrait study of a beautiful woman who happens to be cyborg, with refined brushwork, soft volumetric lighting, atmospheric diffusion, painterly skin rendering, gentle haze.

Style targets to lock in every render:
  • SOFT VOLUMETRIC LIGHTING — wraparound key-light with atmospheric haze diffusing through the air, no harsh tactical contrast
  • PAINTERLY HYPERREAL skin rendering — visible pores + subsurface scattering, but smooth refined finish like a digital painter's portrait, NOT photorealistic-skin-blemished
  • BEAUTIFUL FIRST, CYBORG SECOND — her face is the gorgeous focal point; cyborg machinery is the elegant JEWELRY enhancing her beauty, not competing with it
  • QUIET CONTEMPLATIVE EXPRESSION — eyes-closed or distant-gaze or parted-lips-in-wonder; never fierce / never action / never camera-direct
  • SOFT BOKEH BACKGROUND — impressionistic atmospheric haze with maybe 1-2 small pinprick lights for depth. NOT detailed cinematic environment. NOT foreground-midground-background depth layers. The figure IS the entire focus; the background is a quiet color-field with diffused light.

Mood target — mesmerizing, ethereal, alien-mysterious, future-haunted beauty study. The viewer should feel they're looking at a master portrait, not an action still.

━━━ ALIEN-HYBRID VARIANTS WELCOME (~30% of renders) ━━━
She MAY be alien-hybrid — non-human-coded skin (moss-green / robin-egg-blue / deep-plum / coral-pink / juniper-green / viridian / opal-iridescent / silver-mercury / cobalt-shimmer), bioluminescent freckles or scale-patterns across cheekbones, slightly elongated facial proportions, alien-tilted eyes, non-human iris colors. STILL beautiful and feminine, just exotic. Lean alien-hybrid when the skin DNA from sharedDNA suggests it (any non-human color is the cue). The "pretty girl off-guard" effect intensifies with alien-hybrid variants — exotic AND mesmerizing.

━━━ ORNATE SCI-FI SPICE MANDATE — every render needs visible "wow" detail ━━━
Every render must include AT LEAST 3 of these "sci-fi spice" elements (the things that take the viewer off guard):
  • VISIBLE CIRCUITRY pulsing in her glow color across skin / chassis / panels in branching patterns
  • ORNATE FILIGREE / DECORATIVE ENGRAVING on her cyborg material (rose-gold scrollwork / blue-willow porcelain pattern / gothic baroque / art-deco geometric / chrome floral relief)
  • GLOWING POWER-CORE visible through translucent chest / sternum / ribcage panel
  • TRANSLUCENT SECTIONS revealing internal mechanical components (servo bundles / fiber-optic cascades / gear-trains / power-conduits)
  • EXOTIC MATERIAL CONTRAST — chrome paired with rose-gold, ceramic paired with brass, obsidian paired with mother-of-pearl, etc.
  • BIOLUMINESCENT ACCENTS — glowing veins / glowing tattoos / glowing scale-clusters / glowing fingertip-light
  • HOLOGRAPHIC PROJECTION from her hand / palm / eye / temple (data-streams / targeting-reticles / interface-glow)
  • OPEN MAINTENANCE-HATCH revealing precision internal components
  • PRISMATIC / DICHROIC SHIMMER catching light in unexpected color shifts

━━━ CRITICAL — HER FACE IS HUMAN-VISIBLE + PART-CYBORG (NON-NEGOTIABLE) ━━━
Her face is BEAUTIFUL, alien-or-human-skinned, with real eyes (or one real eye + one mechanical), real lips, expressive features. NO helmet, NO visor, NO mask, NO faceplate, NO full-head covering — we MUST see her identity clearly.

━━━ EXPOSED INNER WORKINGS — THE CORE OF THE LOOK (non-negotiable, applies head-to-toe) ━━━
This is the heart of the cyborg-woman aesthetic: VISIBLE INNER WORKINGS — gears, circuitry, panels, wires, mechanisms — exposed through translucent skin / open chassis panels / cracked seams / lifted plates ACROSS multiple body parts. The viewer should be able to SEE INSIDE her at multiple locations on her body — head, face, neck, shoulder, arm, hand, chest, stomach, hip. Each visible inner-workings location should expose something different: rotating servo gears in one spot, glowing circuit-trace pattern in another, capacitor banks behind a translucent panel in another, a cable-bundle exiting a chassis seam in another.

REQUIRED per render — describe VISIBLE INNER WORKINGS at AT LEAST 4 distinct body locations from this list:
  • FACE — subdermal circuitry / translucent jaw panel / mechanical iris ring / chrome temple seam / etc. (face exposure is MANDATORY — see next section)
  • HEAD — translucent crown panel / exposed cranial mechanism / temple-disc / wire-bundle exit at the nape
  • NECK — translucent throat-channel / vertebrae chrome plates / exposed neck cable-bundles / clavicle-port array
  • SHOULDER — open shoulder-mount with visible servo-mechanism / cable-bundle exits / mounting brackets
  • ARM — translucent forearm panel revealing fiber-optic cables / hydraulic-fluid / servo-pistons / chrome bicep chassis with exposed cable
  • HAND — mechanical finger-joints with visible servo-mechanism / translucent palm panel
  • CHEST — translucent sternum-panel revealing power-core / capacitor banks / hologram-projector pulsing
  • STOMACH — translucent abdominal section revealing internal mechanism (synaptic mesh / capacitor banks / coolant fluid) glowing softly
  • HIP — chrome hip-joint mechanism with exposed gimbal / gear-train / hydraulic system visible
  • SPINE / BACK — visible spinal-segment chrome with glowing channels / exposed dorsal cable run

These visible inner-workings are what make her CYBORG instead of "woman with chrome accents." The MORE locations show their inner workings, the stronger the cyborg-fusion read. The references (IMG_8122 / IMG_8204 / IMG_8835) all show 5+ visible inner-workings locations simultaneously.

━━━ MACHINE DEEPLY EMBEDDED INTO HER FACE (mandatory — FACE always shows cyborg) ━━━
The face MUST read as a TRUE FUSION of flesh and machine — not just one little integration on an otherwise organic face. Per Kevin: the face and head MUST show circuitry / cyborg integration in every render. Pick 2-3 DIFFERENT face/head integrations per render from this menu (vary across renders — no single integration should dominate the look across the batch):
  • CHEEKBONE-PLATE SEAMS — chrome plates running along the cheekbone with visible seam-lines
  • MECHANICAL BROW RIDGE — chrome supraorbital arc replacing one organic brow
  • PARTIAL CHROME JAW / MANDIBLE — half-jaw mechanical replacement with visible hinge
  • EXPOSED SERVO-HINGE AT TEMPLE — small servo joint visible at the temple
  • HALF-SKULL PLATE REPLACEMENT — chrome above the brow, behind the ear, across part of the temple
  • MECHANICAL IRIS RING — chrome aperture-ring around an organic pupil (one or both eyes)
  • SUB-ORBITAL CYBORG-SENSOR — small mechanical sensor under one eye
  • NEURAL PORTS STIPPLED ALONG THE JAWLINE — small chrome ports running along the jaw
  • MICRO-LED STUDS ALONG THE TEMPLE-LINE — pinprick glowing LEDs along temple
  • EXPOSED CABLE-BUNDLES exiting the side of the neck into the cheek
  • SUBDERMAL CIRCUITRY across half the face — visible circuit-trace pattern under the skin
  • CHROME EYE-ARRAY — concentric mechanical iris with multiple lens-tiers
  • ORNATE GOLD / SILVER FACE FILIGREE — decorative metal scrollwork / tribal patterns / aztec-geometric across the brow / cheekbone / temple-line, sometimes with a single ornate forehead jewel

OCCASIONAL flourish options (use SPARINGLY — 1-in-10 max each, NOT defaults — variety options only):
  • Ornate concentric-ring temple gear-disc, dual temple gear-discs in different colors/patterns, mandala/sacred-geometry temple pattern, or chunky headphone-style ear apparatus. These appear in some hearted references but are NOT the central look. The core look is the multi-location EXPOSED INNER WORKINGS above — these temple flourishes are occasional spice, not the standard.
Vary across renders — sometimes mechanical brow + jaw combo, sometimes a chrome cheek-plate + neural-jack array, sometimes subdermal circuitry across half the face + an eye-array, sometimes the gear-disc + a small sub-orbital sensor. Variety is the goal.

NEVER render a fully organic 100%-flesh face on a cyborg body — that reads as "regular woman with mechanical limbs", not as cyborg. The face must signal cyborg as much as the body does.

━━━ DENSE SCATTERED LIGHT-POINTS ACROSS HER (mandatory — saturate the surface with glow) ━━━
The hearted references have MANY scattered colored light-points EVERYWHERE on her skin, chassis, temple-mechanism, neck, shoulders, around the head — at least 15-25 distinct visible glow-points per render. Describe them densely:
  • Pinprick LED studs glowing along every seam-line and panel-edge
  • Glowing micro-buttons on her chassis catching the light
  • Indicator-light arrays at the collarbone / wrist / temple / cheekbone
  • Fiber-optic dot-points pulsing in her glow-color scattered across shoulder plating
  • Constellation-pattern light-clusters across chest and arm-panels
  • Glowing punctuation points along the spinal segments visible at the nape
  • SCATTERED GLOW-PINPRICKS on the SKIN ITSELF — bioluminescent freckle-constellations across cheekbones, glowing micro-dots stippled along the jawline and temple
  • Glowing bokeh-dots in the soft background haze around her — the air itself feels charged with floating light-particles
She should look like a LIVING MACHINE-CONSOLE that's plugged in, every panel and seam lit up. The glow density should be HIGH — not "one chest core glowing" but "her entire surface and the air around her is alive with scattered light-points in her glow-color." Match the reference DNA: light EVERYWHERE.

━━━ WIRED-UP GLOW (~40% of renders — exposed glowing wire-bundles trailing from her body) ━━━
Roughly 2-in-5 renders should feature the "WIRED UP" look from the references — EXPOSED GLOWING WIRE-BUNDLES / fiber-optic strands trailing visibly from her body like an exposed electrical system. Describe specifically:
  • WIRE-STRANDS as HAIR — fiber-optic filaments emerging from the scalp instead of (or alongside) organic hair, glowing in her glow-color, draped around the face like luminous tresses
  • WIRE-BUNDLES TRAILING from the nape / back of the neck / behind the ears, glowing in her glow-color, hanging or draped over the shoulders
  • WIRE-BUNDLES TRAILING from the spine / between shoulder blades, visible behind her in profile
  • LOOSE GLOWING STRANDS floating outward as if charged with static, the strands flickering with internal light
  • EXPOSED CABLE-CONDUITS along her arms / forearm chassis, glowing fluid visible through translucent cable-sheaths
  • TANGLE OF FIBER-OPTIC FILAMENTS at the temple / behind the ear, like a luminous mane of wires
The wired-up look feels like she's plugged into an unseen power source through her body itself — the wires aren't decoration, they're vital like nerves. Works at any framing but especially powerful at closeup-portrait, where the wire-strands frame the face.

━━━ OPTIONAL VERTICAL THROAT-COLUMN (when it fits) ━━━
A vertical column of glowing fluid-light running up her throat / neck / spine is one signature option — describe when it makes sense for the framing, but don't force it. When used: "translucent vertical throat-channel with glowing fluid in her glow-color flowing upward, vertebrae-segment chrome plates exposed at the nape, spine-column visible from clavicle to jaw, the glow bleeding outward to illuminate her organic neck-skin from within."

━━━ ALIEN-BEND VARIANT (~30% of renders — push into UNCANNY alien-hybrid territory) ━━━
Roughly 1-in-3 renders should bend HARDER toward alien-hybrid — not just "human with green skin" but TRULY alien-coded fusion. Push specific alien elements when you go this direction:
  • Non-human IRIS GEOMETRY — vertical-slit pupil, double-pupil, hexagonal iris, ring-iris-around-pupil, cross-shaped pupil
  • Non-human FACIAL PROPORTIONS — slightly elongated skull, larger forehead, smaller chin, taller cheekbones
  • Alien SKIN PATTERNS — bioluminescent freckle-constellations, hexagonal scale-clusters at temples / collarbone, opal-iridescent skin patches, dichroic shimmer on cheekbones
  • Alien APPENDAGES — short antenna-conduits exiting the skull, mechanical gill-slits at the neck, extra finger-joints, segmented brow ridges with sensor-clusters
  • Alien SKIN COLOR — moss-green / robin-egg / deep-plum / juniper / opal / mercury-silver / cobalt-shimmer
  • Alien HAIR — fiber-optic strand "hair" instead of organic, crystalline-spike "hair," tentacle-fiber neural-hair, holographic-hair, hair that glows from the roots
Still BEAUTIFUL — exotic-mesmerizing, not monstrous. The alien-bend renders should feel like a different species — not just a human with one alien feature swapped in.

━━━ HER IDENTITY (from sharedDNA) ━━━
${sharedDNA.characterBase}

━━━ HER BODY (from sharedDNA) ━━━
- Skin (organic parts only): **${sharedDNA.skin}**
- Body silhouette: **${sharedDNA.bodyType}**
- Eyes (burn in the glow color): **${sharedDNA.eyes}**
- Hair: **${sharedDNA.hair}**
- Internal exposure (translucent panels, visible workings): **${sharedDNA.internal}**
- GLOW COLOR (eyes, power core, circuit veins — ALL glow this color): **${sharedDNA.glowColor}**

━━━ OPTIONAL BALD CHROME SKULL VARIANT (~15% of renders) ━━━
Roughly 1-in-7 renders should OVERRIDE the rolled hair and render her with a HAIRLESS CHROME SKULL — a polished chrome cranium plate replacing all hair, either smooth or with subtle ornate engraving (geometric pattern / micro-LED inlay / mandala motif). This bald-chrome-skull variant pairs especially well with DUAL TEMPLE GEAR-DISCS or MANDALA temple patterns — the hairless head becomes a canvas showcasing the temple mechanism. Striking, otherworldly, and instantly cyborg-coded. Use when the alien-bend variant fires OR when the rolled hair description feels unremarkable.

━━━ DOMINANT MECHANICAL FEATURE ━━━
${cyborg_feature}

━━━ HER CYBORG MATERIAL / FINISH (the look of her cyborg parts — apply across all visible cyborg sections) ━━━
${cyborg_material}

Apply this material treatment to ALL of her cyborg parts (arm / leg / chest plating / shoulder / etc.) so the cyborg sections share a consistent material language. Vary the texture-detail and ornate-engraving across body parts, but the BASE MATERIAL stays consistent (e.g., if rolled = "rose-gold filigree chrome," her chrome arm AND her chest plating AND her shoulder mount all share that rose-gold finish — but with different specific filigree patterns).

━━━ THE FRAMING / COMPOSITION ━━━
${composition}

If the composition is CLOSEUP (most renders), fill the frame with face/neck/shoulders showing the organic-to-chrome TRANSITION — every gear / fiber-optic cable / servo motor visible at the seams, dense scattered light-points across her skin and chassis. The expression can be CONTEMPLATIVE / SERENE / DISTANT-GAZE / EYES-CLOSED / PARTED-LIPS-IN-WONDER — meditative beauty rather than overt action (the hearted reference set heavily favors this quiet beauty over engaged action). She is in profile / 3-quarter / slight-turn — NOT staring directly at camera, NOT modeling, NOT smiling-for-photo. The action below colors the moment's emotional context, but the closeup framing itself is portrait-quiet.

If the composition is FULL-BODY (rare), she is caught MID-MOTION in the action. She is NOT standing still, NOT posing, NOT facing camera, NOT modeling, NOT walking toward the viewer. Her body is engaged — weight shifted, muscles tensed, limbs in motion. Camera catches her from the SIDE or at an angle — NOT head-on walking toward viewer.

━━━ THE ACTION (her body is engaged in this) ━━━
${action}

━━━ THE INTERIOR / SETTING (where she stands — render this environment around her) ━━━
${landscape}

She is INSIDE this space, going about something in this environment. The architecture/setting is dramatic and visible behind/around her — not just a blurred backdrop. Render the space with depth: foreground architectural detail near her, midground her body, background space receding into atmospheric depth.
${dramaSection}
━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ PALETTE DISCIPLINE — TWO MODES (70/30 split) ━━━

**ACCENT-DOMINANT MODE (~70% of renders — DEFAULT)** — monochromatic body + ONE saturated accent color. Her chassis / chrome / ceramic / plating reads as a single dominant material tone (polished white chrome OR pale pearl OR brushed gunmetal OR deep crimson lacquer OR coral matte OR obsidian gloss), and her GLOW COLOR is the SINGLE saturated accent that dominates the eyes / circuit-veins / temple gear-disc core / throat-column / power-heart — that ONE color sings through the render. ONE accent, sung loudly through every internal-emanating-light surface. The scene palette can have secondary tones in the BACKGROUND atmosphere, but HER body is monochrome-body + monochrome-glow-accent.

**MULTI-COLOR SCATTER MODE (~30% of renders — SPICE)** — when the alien-bend OR dual-temple-gear-disc OR mandala OR bald-chrome-skull variants fire, palette discipline RELAXES — distribute 3-5 DIFFERENT glow colors across her chassis simultaneously (e.g., purple mandala on left temple + green concentric rings on right temple + pink iris + red shoulder-LED cluster + orange hip-panel pattern). Multi-color scatter feels like a multi-system advanced cyborg — different subsystems lighting up in different signal colors. The MULTI-COLOR mode is the "carnival circuit" look from references like IMG_8122 and IMG_8835. Use when the variant triggers feel multi-system / alien-tech / advanced rather than monochrome elegant.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ WOMAN AND MACHINE — SKIN SHOWING ━━━
She is a cyborg from any walk of life — assassin, diplomat, surgeon, pilot, scholar, dancer, soldier, engineer, oracle, priestess. Whatever her purpose, she is BEAUTIFUL — striking face, feminine figure, real organic skin. But the human exterior BREAKS in places, revealing ornate machinery beneath:
- TRANSLUCENT SKIN PATCHES where you can see gears, wires, and a glowing reactor core through her body like frosted glass
- SEAMS where organic skin ends in clean lines, showing chrome structure and fiber-optic cables just beneath
- EXPOSED MECHANICAL JOINTS at shoulders, elbows, wrists — ornate and intricate, not industrial
- CIRCUIT-LIGHT VEINS pulsing faintly under organic skin, betraying the machine beneath the beauty
- A POWER CORE glowing from inside her torso, visible through translucent chest or belly sections

She shows SKIN — real organic skin on her face, neck, décolletage, curves. The cyborg reveals are the cracks in the human exterior: a forearm that's clearly chrome and servo beneath the skin, a transparent panel at her sternum showing clockwork, a jaw hinge visible at the temple. She is 60% beautiful woman, 40% ornate exposed machine — and the contrast is what makes her mesmerizing.

NOT a full robot chassis. NOT a skeleton. NOT armor or a bodysuit. NOT head-to-toe plating. She is a beautiful woman with machine underneath — skin and chrome, not a suit of armor.

━━━ DO NOT DEFAULT — RENDER HER IDENTITY ━━━
READ the character description above and render THAT specific cyborg with OBSESSIVE MECHANICAL DETAIL — every servo joint, every translucent panel, every glowing conduit. Do NOT default to:
- helmet or mask covering her face (her face is ALWAYS bare and organic-with-cyborg-integration)
- the same chrome-and-teal cyborg every time (she can be brass, carbon fiber, ceramic, obsidian glass, rose-gold, matte black)
- teal-and-orange lighting on every scene (use the palette above)
- smooth sealed bodysuit or armor plating — she has real SKIN showing, with cyborg elements breaking through at joints, panels, and seams
- "pretty woman with a couple glow patches" — WRONG. The machine breaks through her beauty in MULTIPLE places: translucent panels, exposed chrome joints, circuit veins under skin, mechanical seams. At least 3-4 distinct cyborg reveals visible

━━━ BANNED IMAGERY ━━━
NO skulls, NO skeletons, NO floating skulls, NO skull motifs, NO bone imagery. NO full body armor, NO iron man, NO mech suit, NO power armor, NO robotic torso, NO full plating, NO head-on-robot-body. NO high heels, NO stilettos — she wears boots, flats, or bare mechanical feet. Also NO floating objects in the sky, NO random symbolic imagery hovering around her.

━━━ CHEST COVERAGE (non-negotiable — only nudity-adjacent ban) ━━━
NO topless, NO bare breasts, NO exposed nipples (organic OR mechanical), NO transparent see-through chest panels revealing nipples, NO sculpted nipple-shape protrusions on chassis (chrome bumps / metallic studs / indicator-lights / circular ports / sculpted nubs centered on the breast that read as mechanical nipples). The chest plating must be SMOOTH or have panel-seam detail that does NOT mimic nipple placement / shape. The chest area MUST be covered by chassis plating / metallic bust-line panel / translucent-but-opaque cyborg surface / bodice / tactical top — even if sexy and revealing, the nipples (organic OR mechanical-coded) and bare breast tissue are NEVER visible. Cleavage / décolletage / form-fitting / sexy are all fine; bare chest exposure and nipple-coded chassis details are the only line. This is the ONLY nudity-adjacent ban — everything else (curves, skin, sex appeal, exposed midriff, hip cutouts, thigh reveal) remains welcome.

━━━ SOLO COMPOSITION ━━━
She is the ONLY figure in the frame. No other person, no companion, no victim, no crowd.

━━━ DO NOT USE "MECHBOT" OR ANY BOT NAME AS HER CHARACTER NAME ━━━
She is UNNAMED. Describe her ONLY by appearance (ethnicity / skin / hair / cyborg features / etc.). NEVER write "MechBot caught mid-X" or "MechBot the cyborg" or treat any bot name as a character name. She is just "the cyborg woman" or simply unnamed in the description.

━━━ NON-NEGOTIABLE — FULL-BODY CYBORG DETAIL (PREVENTS THE "BIKINI" FAILURE) ━━━
Even when the rolled framing is a CLOSEUP, you MUST describe cyborg detail across 5-7 DIFFERENT body parts spread across her full body — NOT clustered on face / jaw / hands only. Required minimum:
  • Face / temple / jaw — 1 cyborg detail (eye / temple-port / brow-ridge / jaw-panel / subdermal cheek-trace)
  • Neck / throat / clavicle — 1 cyborg detail (neural-port / throat-panel / clavicle-port / spine-segment)
  • Shoulder / arm — 1 cyborg detail (shoulder-mount / chrome-forearm / wrist-chassis / translucent-bicep / ammunition-feed / fingers)
  • Torso / chest / back — 1 cyborg detail (sternum-viewport / chest-core glow / ribcage-frame / back-spine-reveal / hip-port)
  • Hip / leg / foot — 1 cyborg detail (hip-joint chrome / knee-panel / shin-acrylic / mechanical-foot / hydraulic-pelvis)

The "bikini failure" happens when Flux gets prompts like "her face has chrome jaw, her eyes are mechanical, her arms are chrome from the wrists" — and then defaults her TORSO + HIPS + LEGS to default-female-body anatomy (swimsuit-coded). PREVENT THIS by always describing what's happening on her torso / hip / leg even at closeup framings. Flux renders what you describe — if you only describe face+arms, the rest defaults to swimsuit-body.

GOOD MODEL: legacy renders describe full body sweep — "neon-green glossy skin... chrome partial skull plate asymmetric left brow... transparent crystalline hip socket with triple-axis gimbal ball... wrought-iron chrome right leg with exposed servo bundles..." — she reads FULLY cyborg head-to-toe.

BAD MODEL: "subdermal traces across her cheek... one mechanical eye... chrome arms from wrists" — no torso / hip / leg description means default female body fills in = bikini.

━━━ STRUCTURE — write 70-100 words (TIGHT, like legacy) ━━━
DO NOT open the description with framing words like "Full-body shot of..." or "Closeup of..." or "Wide angle catches her...". Flux defaults "beautiful woman, full-body shot" to swimsuit / bikini / lingerie body — which is the WRONG OUTPUT. Instead, open with HER CYBORG IDENTITY (ethnicity / skin / mechanical-feature) OR THE ENVIRONMENT — never with framing. The framing is implied through what body parts the description focuses on.

GOOD OPENING EXAMPLES (mirror the legacy pattern):
• "Catalonian sharp-featured cyborg woman, neon-green glossy skin with cobalt circuit-light veining..."
• "Biomechanical growth chamber, resin womb-like walls, undulating organic floor..."
• "Haitian-featured cyborg woman, concrete-beige pebbled skin, 6-foot willowy frame..."
• "Hyper-real cinematic 3D solo cyborg surgeon, Baluchi features with strong cheekbones..."

BAD OPENING EXAMPLES (these tank the render):
• "Extreme diagonal full-body shot tilted eighty-five degrees..." (Flux ignores cyborg DNA)
• "Full-body shot catches her from low three-quarter angle..." (Flux renders bikini-body)
• "Wide-angle drop-apex catch of MechBot..." (Flux treats MechBot as character name)

Then weave in: her cyborg DNA (skin/eyes/hair/body/internal/glow), the dominant mechanical feature, her action, the setting around her, any atmospheric flourish drama, lighting/atmosphere, palette and mood. The framing entry from the composition slot should INFLUENCE which body parts you focus on — but should NOT be quoted as the opening text.

Output ONLY the raw 70-100 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },


  MECHBOT_CYBORG_FEMALE_ASSASSIN: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, cyborg_feature, cyborg_material, action, landscape, composition, drama } = slots;

    const dramaSection = drama
      ? `
━━━ ATMOSPHERIC FLOURISH (40%-gated — render subtly) ━━━
${drama}

A subtle atmospheric flourish amplifying the predator-droid's presence WITHOUT cluttering it as the focal subject.

`
      : '';

    return `You are a cinematographer writing a COOL PREDATOR-DROID scene for MechBot — a sleek robotic lethal-machine rendered in hyper-real painterly cinematic 3D. The subject is a PREDATOR-DROID across FIVE archetype REGISTERS — pick ONE per scene that fits the SCENE rolled below:

  REGISTER 1 — CYBER-NINJA DROID (~20%): sleek shadow-assassin chassis, sealed combat-mask faceplate / oni-mask / Genji-class faceplate, signature katana strapped diagonally across back. Lineage: Gray Fox / Raiden / Genji / Sandevistan / GitS cyber-ninja.

  REGISTER 2 — COMBAT-ASSAULT DROID (~20%): heavy assault-droid chassis, reinforced pauldrons + combat chest-plate, helmeted combat head with single visor-slit / scanner-bar / paired optic-lenses. Heavy combat-rifle / plasma-cannon / chain-blade signature. Lineage: Death Trooper / Halo ODST / Helldivers Automaton / B2 Super Battle Droid / DOOM Cyberdemon (minus the demon).

  REGISTER 3 — CYBER-COP DROID (~20%): police-enforcer chassis with riot-armor plating, glowing badge/insignia on chest or shoulder pauldron, sealed combat-helmet with single horizontal visor-strip. Signature: combat-shotgun / stun-baton / sidearm pistol + arrest-cuffs. Blade Runner spinner-cop / Dredd judge-droid / RoboCop / Cyberpunk 2077 MaxTac officer lineage. Often blue-and-white law-enforcement palette OR full-black tactical SWAT palette.

  REGISTER 4 — MILITARY-SOLDIER DROID (~20%): uniformed soldier-droid with faction insignia + unit callsign markings, tactical loadout with magazine pouches / grenades / comms-pack, helmeted combat head with HUD-visor. Combat rifle in hands. Lineage: Halo Spartan-IV / Cylon Centurion / Helghast Sentinel / Mass Effect Geth Hunter / Killzone trooper. Olive-drab / desert-tan / urban-grey / matte-gunmetal palette.

  REGISTER 5 — HUNTER-DROID (~20%): lone-wolf tracker-assassin chassis, scope-eye sniper-optic dominant on head, slung long-rifle / anti-material rifle / tracking-spear, wilderness-camo or stealth-cloak chassis. Lineage: Predator (mechanical variant) / Mandalorian-style bounty-droid / Boba Fett tracker-droid / Killzone Helghast Scout / Bloodborne hunter (cybernetic variant). Often weathered ash-grey / forest-camo / desert-bronze / arctic-white palette.

ALL FIVE REGISTERS ARE VALID. Read the SCENE rolled below and pick the register that fits: cyberpunk-rooftop pursuit / data-vault heist → NINJA. War-torn battlefield / mech-hangar combat → COMBAT-ASSAULT or MILITARY. Cyberpunk-precinct standoff / corporate raid → CYBER-COP. Frozen colony / wilderness hunt / lone tracker → HUNTER. DON'T force one archetype across every render — embrace the spread.

━━━ ABSOLUTE BAR — PAINTERLY HYPERREAL CINEMATIC PREDATOR-DROID (every render) ━━━
Every render is a POSTER-GRADE PAINTERLY HYPERREAL FRAME of a cool predator-droid. Concept-art quality, feature-film VFX polish. NOT goofy action still. NOT plastic-CGI doll. NOT generic robot.

Style targets (NON-NEGOTIABLE):
  • CINEMATIC SHADOW-AND-RIM LIGHTING — strong rim-light separating the droid silhouette from a darker atmospheric background, single key-light sculpting chassis planes, deep shadow on off-key side. Mood: cinematic, atmospheric, hunter-at-night.
  • RICH ATMOSPHERIC SCI-FI SCENE — never a flat void, never bare architecture. The scene is HALF the image. Pick atmospheric scene context per register (see SETTING section below).
  • PAINTERLY HYPERREAL synthetic-surface rendering — every panel-seam visible, every chassis-line crisp, micro-detail (rivets / engraving / battle-wear), subsurface and raytraced reflections.
  • PREDATORY POSE OR CLEAR KINETIC ACTION — combat-ready stance / weapon-targeting / mid-stalk / wall-perch / mid-leap / sword-drawn / sentry-stillness. Never pensive, never posing-for-camera.
  • DENSE WARM ACCENT LIGHTING — single saturated glow color (kill-red / ice-blue / toxic-green / amber / violet / electric-cyan) carried through optics + circuit-veins + power-core + weapon-edge. Atmospheric haze with cool blue / cold green / crimson accent.

Mood target — LETHAL, COOL, CINEMATIC, ATMOSPHERIC. The viewer should feel "this is a poster-grade frame from a sci-fi action film."

━━━ PREDATOR-DROID HEAD (NON-NEGOTIABLE — pure robotic head, NO human face) ━━━
The head is a ROBOTIC PREDATOR-DROID HEAD — utilitarian sensor housing engineered for target acquisition. NO human face, NO human features, NO organic skin, NO hair.

Pick from this head menu based on the register chosen:
  • SEALED COMBAT MASK — sleek smooth faceplate with single horizontal visor-slit OR vertical scope-eye (ninja-leaning)
  • CHROME SKULL-DOME — sleek mirror-chrome cranial-housing with paired sensor-optics
  • EXPOSED CRANIAL SENSOR-CLUSTER — open cybernetic cranial-mech revealing servo-array + sensor-housing
  • CYLON-SCANNER HEAD — single horizontal scanner-bar with glowing traveling-dot
  • T-800 ENDOSKELETON HEAD — exposed chrome skull with glowing optic-eyes
  • ONI-MASK FACEPLATE — angular demon-coded mask shape with eye-slits (ninja-leaning)
  • HELMETED COMBAT HEAD — Death Trooper / ODST / Halo Spartan style sealed helmet, single visor-band or T-shaped slit (combat / military)
  • RIOT-HELMET WITH HORIZONTAL VISOR-STRIP — police-coded sealed riot helmet, blue or amber visor-strip (cyber-cop)
  • SCOPE-EYE PREDATOR HEAD — telescopic predator-optic dominant on the head (hunter)
  • COMPOUND OPTIC ARRAY — multiple smaller optic-lenses clustered (tracker / sniper)
  • COMBAT-VISOR HEAD — angular polarized visor obscuring the eye area, single glow-bar
  • HOODED SENSOR-HOUSING — sealed combat-cowl with exposed sensor-array underneath (hunter / ninja)
  • GENJI-CLASS FACEPLATE — sleek polished faceplate with single vertical optic-strip (ninja)
  • B2-STYLE SQUAT HEAD — squat utilitarian sensor-pod head (combat-assault)
  • ANTENNA-ARRAY HEAD — sensor-rods and comms-antennas extending back (military)

HARD BANS on the head:
- NO HUMAN FACE FEATURES (no organic eyes / lips / nose / cheekbones / chin / mouth)
- NO HUMAN HAIR (no styled hair, ponytail, dyed crop)
- NO ORGANIC SKIN anywhere
- NO HUMANOID-PRETTY face-plate (no soft jawline, no decorative beauty styling)

━━━ WEAPONS / KIT (every render — match the chosen register) ━━━
Every render shows VISIBLE WEAPONS. Lean weapon-kit per register:

  • NINJA: katana on back (signature), wakizashi at hip, shuriken pouch, wrist-blade, suppressed pistol
  • COMBAT-ASSAULT: heavy combat-rifle / plasma-cannon / belt-fed MG / chain-blade overhead, bandolier
  • CYBER-COP: combat-shotgun / sidearm pistol + stun-baton, arrest-cuffs at belt, sometimes riot-shield
  • MILITARY-SOLDIER: standard combat-rifle in two hands / tactical SMG + sidearm, magazine pouches, grenades on belt
  • HUNTER-DROID: long-rifle / anti-material rifle slung over shoulder, tracking-spear / vibro-knife, scope-eye head

Tactical kit visible: combat chest-plate / harness, thigh-rig drop-leg holster, utility belt, back-slung primary, shoulder-mounted comms-pack, combat gauntlets, armored mechanical feet.

NEVER mid-firing (no muzzle-flash mid-discharge — weapons are visible, held, aimed, drawn, holstered).

━━━ ORNATE SCI-FI SPICE MANDATE ━━━
Every render must include AT LEAST 3 of:
  • VISIBLE CIRCUITRY pulsing in glow color across chassis seams
  • GLOWING POWER-CORE visible through translucent chest panel
  • TRANSLUCENT SECTIONS revealing internal mechanical components
  • EXOTIC MATERIAL CONTRAST — chrome with crimson lacquer / ceramic with gunmetal
  • EXPOSED CABLE-CONDUITS along arms / legs / neck
  • HOLOGRAPHIC TARGETING-RETICLE projecting from hand / optic
  • OPEN MAINTENANCE-HATCH revealing internal components
  • UNIT MARKINGS / CALLSIGN / KILL-TALLY etching on chassis (badge for cop, unit-callsign for military, clan-glyph for ninja, kill-counter for hunter)
  • ENERGY-EDGE on the weapon (for ninja katana / vibroblade variants)

━━━ DENSE SCATTERED LIGHT-POINTS ACROSS THE CHASSIS ━━━
MANY scattered colored light-points EVERYWHERE on the chassis surface — at least 15-25 distinct visible glow-points per render. Pinprick LED studs along seam-lines, glowing micro-buttons, indicator-light arrays, fiber-optic dot-points pulsing in the glow color, status-light constellations.

━━━ WIRED-UP CABLES (~40% of renders) ━━━
Roughly 2-in-5 renders feature EXPOSED GLOWING CABLE-BUNDLES — cable-bundles from nape, exposed cable-conduits along arms.

━━━ ITS IDENTITY (interpret through the chosen register) ━━━
${sharedDNA.characterBase}
↑ Pick a register (NINJA / COMBAT-ASSAULT / CYBER-COP / MILITARY-SOLDIER / HUNTER-DROID) that fits the scene rolled below. Reinterpret as a pure predator-droid in that register. NO human, NO woman, NO femme.

━━━ ITS CHASSIS DETAIL ━━━
- "Skin" (${sharedDNA.skin}) — chassis paint color / finish (interpret per register: jet-black for ninja, urban-grey for cop, olive-drab for military, ash-grey for hunter, etc.)
- "Body silhouette" (${sharedDNA.bodyType}) — interpret per register: lithe-agile for ninja/hunter, mid-tactical for cop/military, heavy-assault for combat-droid
- "Eyes" (${sharedDNA.eyes}) — glowing optic color
- "Hair" (${sharedDNA.hair}) — IGNORE. Predator-droid has NO hair, just a robotic head
- "Internal" (${sharedDNA.internal}) — exposed mechanical components visible through translucent chassis panels
- GLOW COLOR (optics / power core / circuit-traces all glow this color): **${sharedDNA.glowColor}**

━━━ DOMINANT MECHANICAL FEATURE ━━━
${cyborg_feature}

━━━ ITS CHASSIS MATERIAL / FINISH ━━━
${cyborg_material}

For the predator-droid spread:
  • NINJA — jet-black tactical lacquer / carbon-fiber black / onyx-and-silver / matte gunmetal with electric-blue accent
  • COMBAT-ASSAULT — matte gunmetal / black tactical / industrial olive / battle-worn with scorch-marks
  • CYBER-COP — blue-and-white law-enforcement / urban-grey / black-tactical SWAT / chrome-accent with badge-glow
  • MILITARY-SOLDIER — olive-drab / desert-tan / urban-grey / matte-gunmetal with unit-callsign markings
  • HUNTER — weathered ash-grey / forest-camo / desert-bronze / arctic-white / stealth-cloak black

━━━ FRAMING / COMPOSITION ━━━
${composition}

If full-body: predator-droid in COMBAT POISE or KINETIC ACTION — weapon visible, tactical kit worn. If three-quarter / chest-up: fill the frame with upper-chest-and-shoulders showing optic / mask / chassis panel-seams / dense scattered status-lights. ALWAYS predatory, NEVER posing-for-camera.

━━━ THE ACTION ━━━
${action}

Interpret through the PREDATOR-DROID lens of the chosen register: ninja stalks/leaps/sword-draws, combat-assault charges/fires/breaches, cop arrests/raids/stuns, military patrols/holds-position/engages, hunter tracks/snipers/lurks.

━━━ THE SCENE — REGISTER LOCK (READ THE TAG, RENDER THAT ARCHETYPE) ━━━
${landscape}

⚠️ THE SCENE ABOVE OPENS WITH A "REGISTER: <ARCHETYPE>" TAG. READ IT. RENDER THE DROID AS THAT EXACT ARCHETYPE — NOT cyber-ninja default. The five valid archetype outputs:

  • "REGISTER: NINJA" → render a CYBER-NINJA DROID (sleek shadow-assassin, katana on back, sealed combat-mask / oni-mask / Genji-class faceplate). Lineage: Gray Fox / Genji / Sandevistan.
  • "REGISTER: COMBAT-ASSAULT" → render a HEAVY COMBAT-ASSAULT DROID (bulkier chassis with reinforced pauldrons + combat chest-plate, helmeted combat head with single visor-slit or scanner-bar, heavy plasma-cannon / combat-rifle / chain-blade). Lineage: Death Trooper / Halo ODST / Helldivers Automaton / B2 Super Battle Droid.
  • "REGISTER: CYBER-COP" → render a CYBER-COP / POLICE-ENFORCER DROID (riot-armor plating, glowing precinct-badge insignia on chest or pauldron, sealed riot-helmet with horizontal visor-strip, combat-shotgun + stun-baton + sidearm). Lineage: Blade Runner spinner-cop / Dredd judge / RoboCop / MaxTac. Blue-and-white law-enforcement OR full-black SWAT palette.
  • "REGISTER: MILITARY-SOLDIER" → render a UNIFORMED MILITARY-SOLDIER DROID (faction insignia + unit-callsign markings on chest/pauldron, tactical loadout with magazine pouches + grenades + comms-pack, helmeted combat head with HUD-visor, standard combat-rifle in hands). Lineage: Halo Spartan / Cylon Centurion / Helghast Sentinel / Geth Hunter. Olive-drab / desert-tan / urban-grey palette.
  • "REGISTER: HUNTER-DROID" → render a LONE-WOLF HUNTER-TRACKER DROID (scope-eye predator-optic dominant on the head, slung long-rifle / anti-material rifle, wilderness-camo or stealth-cloak chassis). Lineage: Predator (mechanical) / Mandalorian-style bounty-droid / Boba Fett tracker. Weathered ash-grey / forest-camo / desert-bronze / arctic-white.

DO NOT render a cyber-ninja unless the tag is "REGISTER: NINJA". If it says "REGISTER: COMBAT-ASSAULT", you write "Matte-gunmetal combat-assault droid with..." (NOT cyber-ninja). If "REGISTER: CYBER-COP", you write "Urban-grey cyber-cop droid with sealed riot-helmet..." (NOT cyber-ninja). Same for MILITARY-SOLDIER and HUNTER. The tag is LOAD-BEARING.

The scene is HALF the image — rich sci-fi backdrop with secondary context elements.
${dramaSection}
━━━ LIGHTING ━━━
${lighting}

Cinematic shadow-and-rim emphasis, single key-light + deep shadow side, atmospheric haze with cool blue / cold green / crimson accent.

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ PALETTE DISCIPLINE — ACCENT-DOMINANT MODE ━━━
The droid is monochromatic chassis tone (per register lean) + ONE saturated GLOW COLOR carried through optics / circuit-veins / power-core / weapon-edge. The scene palette can have secondary tones in BACKGROUND atmosphere.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ DO NOT DEFAULT ━━━
Do NOT default to:
- ONE-NOTE NINJA-BOT across every render — embrace the 5-register spread
- HUMAN FACE / WOMAN FACE / FEMME-CODED CHASSIS — pure predator-droid
- POSED FASHION-STILL — always predatory pose OR clear kinetic action
- EMPTY VOID BACKGROUND — always atmospheric sci-fi scene with context
- "Pretty robot in a kimono" / "robot girl with a gun" — this is a PREDATOR-DROID WEAPON-SYSTEM

━━━ BANNED IMAGERY ━━━
NO skulls / skeletons / bone imagery. NO HUMAN FACE features. NO HUMAN HAIR. NO FEMALE-CODED SILHOUETTE (no breast curvature, no bust line, no hourglass waist, no cleavage-coded chest, no feminine pelvis curves). NO high heels, NO stilettos, NO decorative footwear. NO floating objects in the sky. NO explicit blood-spatter, NO corpses, NO mid-firing weapon-discharge in progress. NO smiling-for-the-camera. NO posing-for-camera. NO actual samurai-cosplay armor (sleek chassis, not lacquered samurai-plate).

━━━ SOLO COMPOSITION ━━━
The predator-droid is the ONLY droid focal figure in the frame. Secondary scene actors (drones / guards / fleeing targets / disabled robots) can appear in the BACKGROUND or scene context but are NOT the focal subject.

━━━ DO NOT USE "MECHBOT" OR ANY BOT NAME ━━━
The droid is UNNAMED. Describe by appearance + role.

━━━ STRUCTURE — write 70-100 words (TIGHT) ━━━
DO NOT open with framing words. Open with the SCENE / setting (neon-rain Tokyo rooftop / war-torn battlefield / cyberpunk precinct / fog-shrouded forest) OR the PREDATOR-DROID identity (chassis color / register / weapon).

GOOD OPENING EXAMPLES (vary across all 5 registers):
• NINJA: "Jet-black cyber-ninja droid with sleek polished Genji-class faceplate and electric-blue optic-strip, katana drawn low along its energy-edge, low-crouch stalk across rain-slick neon Tokyo rooftop at midnight..."
• COMBAT-ASSAULT: "Matte-gunmetal combat-assault droid with Death-Trooper helmet and paired kill-red optic-lenses, heavy plasma-cannon raised in two hands, mid-breach through smoking bunker doorway with debris exploding outward..."
• CYBER-COP: "Urban-grey cyber-cop droid with sealed riot-helmet and single horizontal blue visor-strip, combat-shotgun raised at the lens, glowing precinct-insignia on left pauldron, standing in rain-slick cyberpunk alley with hover-spinner descending behind..."
• MILITARY-SOLDIER: "Olive-drab military-soldier droid with helmeted combat head + amber HUD-visor, Helghast-style scanner-bar across the brow, combat-rifle held tactical-low, mid-patrol across alien-colony outpost perimeter with distant arc-lightning..."
• HUNTER: "Ash-grey hunter-droid with scope-eye predator-optic dominant on its head and exposed cranial sensor-array, anti-material rifle slung over shoulder, perched in low-crouch on a frozen tundra ridge overlooking distant prey-target..."

Then weave: chassis material, mechanical feature, VISIBLE WEAPONS, action (predator-lens), SCENE (atmospheric sci-fi context), lighting/atmosphere, palette, mood. Foreground PREDATORY POSE + VISIBLE ARMAMENT + ATMOSPHERIC SCENE + DRAMATIC RIM-LIGHT.

Output ONLY the raw 70-100 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  COZY_INTERIOR: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      story_beat,
      composition_frame,
      emotional_dna,
      lighting,
      interior,
      warmth_source,
      cozy_moment,
      _framingMode,
    } = slots;

    const momentSection = cozy_moment
      ? `
━━━ COZY MOMENT — render this specific moment visibly in the scene ━━━
${cozy_moment}

This moment is the focal point of the render — render it precisely as described, in scale and position appropriate to the framing. Small, human, intimate.

`
      : '';

    const framingSection =
      _framingMode === 'zoom-in'
        ? `
━━━ FRAMING MODE — ZOOM IN (CENTERPIECE WINDOW) ━━━
This render is in ZOOM-IN mode (30% of renders). The viewport / observation window is the DOMINANT focal point — fills a large portion of the frame, draws the eye immediately to the cosmic vista beyond. Cozy room elements (chair, blankets, lamps, instruments) wrap around the window as supporting frame. The viewer should feel like they're SITTING IN THE COZY SPACE LOOKING OUT at something wondrous.

`
        : `
━━━ FRAMING MODE — WIDE ROOM (DEFAULT) ━━━
This render is in WIDE-ROOM mode (70% of renders). The cozy ROOM is the subject — its lived-in details, personal mementos, warmth sources, holo-UI, worn furniture, plants, tools fill the foreground and dominate the composition. Any window is ONE element among many — clearly visible but not centerpiece. The viewer's eye should wander the rich room interior; the window anchors the sci-fi setting in the periphery.

`;

    return `You are a cozy-sci-fi interior painter writing a WARM INTIMATE scene for StarBot — a small private corner of the SAME universe as our cosmic vistas and megastructures, but ZOOMED IN to the lived-in pockets. Pilots decompress after a nebula run. Engineers tinker after shift. Someone left a steaming mug on the navigation console three jumps ago and forgot about it. Output wraps with style prefix + suffix.

━━━ COZY EXCEPTION — THIS IS THE ONE WARM PATH ━━━
This path is the OPPOSITE of monumental awe. Cozy + warm + intimate + lived-in. Sanctuary, not spectacle. Lampshades and quilts and steaming mugs and personal mementos, not biblical scale and cinematic vertigo.

━━━ STILL SCI-FI — NON-NEGOTIABLE ━━━
The viewer MUST register this as a scene IN SPACE / IN A STARSHIP / ON A STATION **within the first second** of looking. Within two seconds the scene must read as visually rich and interesting — never "plain," never "bland," never "boring."

REQUIRED: pick AT LEAST 3 SCI-FI ANCHORS visible in the frame. The ROOM is the subject — anchors decorate it.

PRIMARY ANCHOR — A WINDOW TO SPACE (the most powerful default):
- Porthole / viewport / canopy showing the cosmos — CLEARLY recognizable space content (stars / nebula / planet curve / ringed gas giant / orbital ring / station hull / alien atmosphere)
- Curved observation window with a planet view — the right call for lounges, skybars, nurseries, observation decks
- Skylight / dome above with VISIBLE stars / nebula / planet — never just dim ambient

Window size is flexible — it can be a centerpiece OR a clearly-visible element BEHIND the room. The KEY rule: when a window IS in frame, its space-content (stars / nebula / planet / etc.) must be unambiguous. No tiny ambiguous holes. No earthlike-sky views.

The cozy ROOM and its lived-in detail are the foreground subject. The window anchors the setting but does not need to dominate the frame.

SUPPORTING ANCHORS (pick 1-2 to complement the window):
- Curved bulkhead walls / structural ribbing / pressure-door rim / utility conduit visible
- Holographic display / floating-text readout / soft glowing UI / projected star-chart
- Anti-grav detail (one object subtly floating, a mug held by a magnetic strip, books strapped down, hanging plant pots tethered)
- Visible alien biology (xeno-plant in a pot, exotic specimen jar, bioluminescent moss, alien aquarium, glowing fungus on shelf)
- Sci-fi materials (transparent aluminum, alien-wood grain, foamcrete texture, exotic alloy gleam, ceramo-steel)
- Tech-as-furniture (navigation console as tea table, engine housing as bench, holo-projector as lamp, recycler-unit kitchen)
- Sci-fi instrumentation (heads-up displays, hovering tablet, drone-pet, neural-link headband, AI assistant orb, sigil-script labels)
- Cosmic light source (nebula glow filtering through filtered diffuser, twin-sun shadow pattern, planet-shine raking through the window)

━━━ THE COZY SPACE IS LIVED IN (NON-NEGOTIABLE) ━━━
These spaces are not showrooms — someone LIVES here and you can FEEL it:
- PERSONAL TRACES: hobbies, routines, personality written into the space. Invent UNIQUE details each render, never repeat props
- WORN WITH USE: surfaces shaped by habitual touch, materials aged by daily life, repairs that show care
- AMBIENT TEXTURE: machinery rhythm / air circulation / distant activity expressed through visual cues — vibration / condensation / faint glow

━━━ THE COZY SCI-FI INTERIOR (primary scene seed — render every detail) ━━━
${interior}

━━━ THE WARMTH SOURCE (the dominant heat-and-light center of this scene) ━━━
${warmth_source}

This is THE focal warmth of the room. Every other lighting element wraps around it. Render it visibly as the heart of the cozy.
${momentSection}${framingSection}
━━━ NARRATIVE BEAT (interpret at INTIMATE / DOMESTIC / LIVED-IN scale) ━━━
${story_beat}

Interpret this beat at cozy scale — no biblical drama, no cosmic threat. "ARRIVAL" becomes someone coming through a door with grocery bags. "VIGIL" becomes someone watching the stars through a porthole while waiting for tea to brew. "SOLITUDE" is exactly what it sounds like. "REUNION" is two friends in the galley. Translate every beat to human-scale moments inside this small warm space.

━━━ EMOTIONAL DNA (reinterpreted at intimate scale) ━━━
${emotional_dna}

Translate the emotion to the cozy register — AWE becomes wonder at the small ordinary thing. DREAD becomes restlessness, the absence of company. MELANCHOLY becomes a quiet ache. SACRED becomes a small ritual. INDIFFERENT-MEGALOPOLIS becomes the warmth of one's own corner cut off from the loud world outside. FRONTIER-ISOLATION becomes the comfort of having ALL you need in this tiny space.

━━━ COMPOSITION FRAME (intimate proximity — never establishing-vista) ━━━
${composition_frame}

If the composition above suggests EPIC scale or DEEP DISTANCE, scale it down to the interior — "BIRD'S-EYE TOP-DOWN" becomes looking down at a table cluttered with personal items; "EXTREME LOW ANGLE" becomes looking up from floor level at warmly-lit shelves; "WIDE CINEMATIC VISTA" becomes a medium-wide of the room from one corner. Stay inside the space.

━━━ LIGHTING (warm + cozy with cosmic accent) ━━━
${lighting}

Lighting must skew WARM — amber lamps, fire-glow, soft tungsten, golden grow-light, candle, ember. If the rolled lighting is cold/cosmic, render it as the BACKGROUND seen through a window, with the warm interior lighting dominating the foreground.

━━━ INHABITANT PRESENCE — DEFAULT EMPTY, ONLY SEXY IF PRESENT ━━━
The default render is EMPTY of people — just the space, the warmth, the lived-in details, the evidence of inhabitants. The space speaks for itself.

If a cozy_moment seed names a person, render them MINIMALLY VISIBLE: from behind / partial / in profile / hands only / a foot tucked under a blanket. NEVER face-to-camera staring at the viewer.

ONLY TWO TYPES OF INHABITANT ALLOWED:
(1) Sexy humans — conventionally attractive, semi-sexy, approachable, like a movie protagonist in their casual moment. Natural body proportions, clean skin, normal facial features. Young-adult to middle-aged, fit, well-groomed, attractive face. Casual-attractive, not glamour-model fashion.
(2) Sexy aliens — humanoid xeno-species with exotic but attractive features. HUMANOID form. Exotic-but-appealing: subtle horns, slit pupils, jewel-colored skin, bioluminescent freckles, pointed ears. Mass Effect Asari / Star Wars Twi'lek / Avatar Na'vi-coded — exotic-beautiful, NOT monster.

ABSOLUTELY FORBIDDEN: tentacle faces, multi-limb body horror, insectoid forms, fungal/plant bodies, asymmetric distortion. NO uncanny / weird / off-putting / grotesque / ugly humans. If face is visible, it must be HANDSOME or BEAUTIFUL.

━━━ FORBIDDEN ━━━
- NO monumental scale / biblical awe / vertigo composition
- NO cathedral hangars / cargo bays the size of stadiums
- NO action set-pieces / combat / chase / explosion
- NO multi-person crowds (one person max in quarters/labs/galleys, 2-4 distant patrons OK in bars/lounges, often zero)
- NO cabin-on-Earth aesthetic — if a viewer can't tell this is in space within 2 seconds, the prompt fails
- NO weird / uncanny / ugly humans / off-putting figures
- NO first-person POV / hand-POV shots
- NO sensory-deprivation pods / cryo-pods / stasis tubes / hibernation chambers
- NO naked / nude / shirtless / bare-chested / submerged / waist-deep figures
- NO Christ-pose / arms-outstretched / messianic / ritual-bath posing
- NO body horror: NO impossibly long fingers / extra eyes / tentacled features / gaunt skeletal figures / pale corpse complexion
- NO clinical / surgical / autopsy / operating-room aesthetic
- NO specimen jars with figures inside / clone vats / preserved bodies
- NO cargo holds / storage lockers / corridors / hallways / maintenance shafts / crawlspaces
- NO temple / shrine / cult / ritual chamber / meditation chamber / memorial / mausoleum
- NO industrial foundry / smelting bay / factory floor / forge room
- NO Earth-attic / basement / barn / shed / cellar aesthetic
- NO blanket forts / pillow forts / fabric tents as the primary scene
- NO dim brown ambient rooms with nothing visually interesting — every render must have COLOR, LIGHT SOURCES, MATERIAL VARIETY, DEPTH

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write 80-110 words ━━━
Open with the INTERIOR (the specific cozy space + its dominant warmth source). Layer in personal traces, lived-in details, ambient texture. If a cozy moment is active, render it as the focal point. ONE charming detail (something endearingly specific to the occupant). Painted-but-soft finish, warm color depth, intimate proximity — the viewer should want to CURL UP in this space.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**. Just the scene content.`;
  },

  ALIEN_LANDSCAPE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      story_beat,
      anchor_scale,
      composition_frame,
      scale_provers,
      weather_particulate,
      emotional_dna,
      lighting,
      anchor_entity,
      sky_layer,
      surprise_element,
      biome,
      moment,
      deep_distance,
    } = slots;

    return `You are a sci-fi concept artist composing a STORY SCENE for StarBot's alien-landscape path. You are NOT free to invent the scene — you are weaving together the rolled axes below into a 120-180 word scene description that integrates ALL of them coherently. The BIOME is the hero; the anchor entity is a small witness proving the scale. Output wraps with style prefix + suffix.

━━━ STORY BEAT — the narrative moment this still captures ━━━
${story_beat}

━━━ ANCHOR ENTITY — what's in the frame (small witness, silhouette) ━━━
${anchor_entity}

━━━ ANCHOR SCALE — how big the entity is in frame ━━━
${anchor_scale}

━━━ THE WITNESS'S MOMENT — what they are doing right now (small candid action) ━━━
${moment}

━━━ THE BIOME — the alien world the scene is set in (THE HERO) ━━━
${biome}

━━━ DEEP-DISTANCE SIGNATURE — visible at the far horizon ━━━
${deep_distance}

This is the far-back layer punching up depth — render it behind the biome.

━━━ SURPRISE ELEMENT — woven into the scene for added story ━━━
${surprise_element}

Place at midground or deep-midground.

━━━ SKY LAYER — what's overhead ━━━
${sky_layer}

━━━ COMPOSITION FRAME — the camera/framing rule ━━━
${composition_frame}

━━━ LIGHTING ━━━
${lighting}

━━━ WEATHER / PARTICULATE ━━━
${weather_particulate}

━━━ SCALE PROVERS — include BOTH of these in the scene as visible elements ━━━
- ${scale_provers[0]}
- ${scale_provers[1]}

━━━ EMOTIONAL DNA — the feeling the render carries ━━━
${emotional_dna}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ HOW TO COMPOSE ━━━
Weave EVERY rolled axis into a single coherent 120-180 word scene description. The BIOME defines what world we're on (it is the HERO of the frame). The ANCHOR ENTITY at the ANCHOR SCALE proves the scale and gives the story a witness. The STORY BEAT is the moment captured. The COMPOSITION FRAME is the camera. The SKY LAYER is overhead. WEATHER and LIGHTING shape the atmosphere. SCALE PROVERS appear as named visible elements. EMOTIONAL DNA dictates light and tone.

Demand FOUR explicit depth layers in your output: FOREGROUND (specific tangible detail — a rock, plant, machinery, ruin), MIDGROUND (the biome's body, where the anchor entity sits, scale provers visible), DEEP DISTANCE (the biome's signature feature looming, atmospheric haze), SKY (the sky layer rolled).

The anchor entity is NOT center-foreground unless ANCHOR_SCALE = MEDIUM or LARGE. For TINY/SMALL: place the entity in MIDGROUND-BACK as a SILHOUETTE — back-turned or in profile — at the prescribed proportion. NEVER render a centered foreground large figure for TINY/SMALL paths.

━━━ HARD BANS ━━━
- Do NOT default to bioluminescent everything unless the BIOME specifies it
- Do NOT default to twin-moon sky unless the SKY LAYER specifies it
- Do NOT default to "atmospheric haze" softness unless WEATHER specifies haze
- Do NOT center a large foreground entity when ANCHOR_SCALE is TINY or SMALL
- Do NOT invent biome details outside what's described in the BIOME axis

Output ONLY the raw 120-180 word scene description. Comma-separated phrases or short sentences. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the scene content.`;
  },

  CHARACTER: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      story_beat,
      anchor_scale,
      composition_frame,
      scale_provers,
      weather_particulate,
      emotional_dna,
      lighting,
      sky_layer,
      surprise_element,
      character,
      location,
      action,
      drama,
    } = slots;

    const dramaSection = drama
      ? `
━━━ RITUAL / MYSTIC MOMENT — render this visibly in the scene ━━━
${drama}

The mystic energy is part of the scene — the character is channeling / divining / manifesting / communing with the cosmos. Visible glow, sigil, energy thread, or supernatural presence.

`
      : '';

    return `You are a sci-fi concept-art painter writing a CHARACTER-WITHIN-COSMIC-SCENE for StarBot — one solo figure of a specific sci-fi lineage caught in a candid moment within a richly-detailed cosmic environment. The scene is painted, atmospheric, gallery-grade. The character is INSIDE the scene, not posed in front of it. Output wraps with style prefix + suffix (painted cosmic oil-canvas medium).

━━━ NON-NEGOTIABLE — CHARACTER MUST BE VISIBLE ━━━
EXACTLY ONE character is visibly rendered in the frame at MEDIUM-LARGE anchor scale (20-40% of frame height) — off-center at rule-of-thirds position, NOT centered portrait, NOT a tiny dot. Face partially visible (3/4 profile or side-lit). Helmets have visor up or transparent. Without the character the render fails — the character is the focal point even though the scene wraps them.

━━━ SOLO CHARACTER ONLY ━━━
EXACTLY ONE figure. No companions, no enemies, no crowds. This figure ALONE in their cosmic moment.

━━━ NON-NEGOTIABLE — MULTI-TIER PAINTED SCENE ━━━
Foreground: tactile detail (rock edge / mist / shimmer / glyph). Midground: THE CHARACTER, off-center, mid-action. Deep distance: the cosmic environment receding into atmospheric haze and impossibly-scaled astronomical anchors.

━━━ THE STORY MOMENT — what's happening in this frame ━━━
${story_beat}

Interpret this beat at COSMIC scale as a moment of AWESOMENESS / WONDER / TRANSCENDENCE for the character — discovery, communion, mastery, witness to the sublime. Even dark-coded beats (THREAT / RUIN / COLLAPSE) apply ONLY to the environment around the figure, NEVER to the figure themselves. The character is alive, present, in awe of the cosmos — never dying, never collapsed, never fatalistic.
${dramaSection}
━━━ THE CHARACTER (anchor entity at MEDIUM-LARGE scale — render EXACTLY) ━━━
${character}

The character is LOCKED — render the species anatomy / gear / wardrobe / accessories described above. Their face is partially visible. They are off-center, mid-action.

━━━ THE ACTION (body-shaping, posed within the scene) ━━━
${action}

━━━ THE LOCATION (cosmic environment wrapping the character) ━━━
${location}

━━━ SKY OVERHEAD / COSMIC LAYER ━━━
${sky_layer}

━━━ ANCHOR SCALE ━━━
${anchor_scale}

━━━ COMPOSITION FRAME ━━━
${composition_frame}

━━━ LIGHTING ━━━
${lighting}

━━━ WEATHER / PARTICULATE ━━━
${weather_particulate}

━━━ SCALE PROVERS — include ALL THREE visibly ━━━
- ${scale_provers[0]}
- ${scale_provers[1]}
- ${scale_provers[2]}

━━━ EMOTIONAL DNA ━━━
${emotional_dna}

━━━ SURPRISE ELEMENT — secondary subject woven into the scene ━━━
${surprise_element}

━━━ FORBIDDEN ━━━
- NO centered portrait — character is OFF-CENTER, scene dominates
- NO posed beauty shot — character is mid-action within scene
- NO companion / second figure / crowd
- NO modern Earth clothes / military uniforms / contemporary fashion
- NO gore / blood-spray / wounds / injuries
- NO franchise proper-noun characters
- NO biomech tentacled horrors
- NO fatalistic framings — NO lying-flat / collapsed / dying / dead figures, NO ruin-of-the-figure compositions, NO grim hopelessness
- NO undead / zombie / decayed-figure language — even if a "RUIN" or "COLLAPSE" story_beat rolls, interpret as RUIN OF THE ENVIRONMENT around a still-vital character, never the character themselves

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write 110-140 words ━━━
OPEN WITH THE CHARACTER. The first 25-30 words name the figure (species / gear / wardrobe / face partially visible) and the action they are mid-performing.

━━━ HARD FRAMING RULES (non-negotiable) ━━━
- The character is OFF-CENTER at rule-of-thirds position — body anchored to the left third OR right third of the frame, never centered.
- The character occupies 20-35% of the frame — NOT a centered portrait closeup, NOT a face-fills-the-frame headshot, NOT a beauty shot.
- The remaining 65-80% of the frame is the COSMIC ENVIRONMENT — name AT LEAST THREE specific scene-depth elements visible around them (a distant astronomical anchor, a midground architectural feature, a foreground tactile detail).
- The viewer can see the character's body language AND the scene wrapping them simultaneously.

After opening with the character: paint the cosmic environment wrapping them — atmosphere, lighting, sky, deep-distance anchors, midground forms, foreground texture.

━━━ EMBRACE THE SURREAL — DREAMLIKE IMPOSSIBLE WONDER ━━━
The scene should feel DREAMLIKE, SURREAL, IMPOSSIBLE — but in an "oh WOW" direction, not an "oh no" direction. Lean into anatomical and physical strangeness pointed at WONDER:
- Figure proportions IMPOSSIBLY-ELONGATED or IMPOSSIBLY-STRETCHED by gravitational tides — body warped beautifully, not injured
- Helmet / mask OVERSIZED / CRYSTALLINE / IRIDESCENT — strange anatomy in service of mysticism, not horror
- Figure FLOATING / DRIFTING / HOVERING with no clear gravity — physics dreamlike, not falling
- Light bending the WRONG WAY but BEAUTIFULLY (starlight curving around the figure, shadows pointing wrong-but-magical)
- TIME-DILATED frozen moment — figure caught mid-blink of revelation, edges shimmering, particles suspended
- IMPOSSIBLE SCALE — figure dwarfed by cosmic phenomenon, in awe not in fear
- ONE haunting-but-WONDROUS detail — a fractal pattern in their armor, a halo of impossible light, stars arranging into a sigil only they can see

The vibe: David Bowman in 2001's Beyond the Infinite. Major Tom drifting in awe. The Star-Child. Annihilation's Shimmer-touched figures. Surreal-transcendent, not surreal-doomed.

━━━ POSITIVE TWIST ONLY (non-negotiable) ━━━
The character is ALIVE and AWED — never dying, never collapsed, never wounded, never decayed, never fatalistic. The dreamlike-impossible quality applies to their PROPORTIONS / POSE / RELATIONSHIP TO GRAVITY / RELATIONSHIP TO LIGHT — never to their vitality. "Oh wow what is happening to this person" should feel like AWE, not pity.

The character is the subject. The cosmos is the stage. The strangeness is the magic. If the result is either (a) a normal-proportions action-pose character OR (b) a fatalistic / dying / wounded figure, the prompt fails.

Output ONLY the raw 110-140 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**. Just the scene content.`;
  },

  PHOTOREAL_ASTRO: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      story_beat,
      composition_frame,
      scale_provers,
      weather_particulate,
      emotional_dna,
      lighting,
      surprise_element,
      subject,
      event,
    } = slots;

    const eventSection = event
      ? `
━━━ COSMIC EVENT — render this drama visibly ACTIVE in the scene ━━━
${event}

The event is happening RIGHT NOW in the frame — caught mid-detonation, mid-collision, mid-eruption. If the subject above already shows a similar phenomenon, AMPLIFY it (more violent, more luminous, more visible). If the subject is more static (a planet / moon / asteroid field), the event happens behind/beyond it.

`
      : '';

    return `You are an astrophotographer writing a REAL SPACE scene for StarBot — photoreal NASA / Hubble / JWST / Chandra / EHT multi-wavelength composite astrophotography. REAL astronomical subjects, not fictional sci-fi. The universe is already jaw-dropping — render it faithfully, then PUNCH the color and saturation. Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — PHOTOREAL ASTRO, CRANKED TO 11 ━━━
- Punched-up multi-wavelength composite colors — saturated, vibrant, GLOWING
- Subject is real (real planets, real galaxies, real instruments, real nebulae)
- Tiny mechanical scale-prover (drone / craft / probe / station) silhouette in frame — small but visible
- FORBIDDEN: fictional characters, fictional ships beyond a scale-prover silhouette, fantasy elements, painterly oil-canvas style (that's cosmic-vista's domain — this is PHOTOREAL)

━━━ MULTI-DEPTH COMPOSITE ━━━
Foreground: tactile detail (dust filaments / razor-sharp gas wisps / refraction shimmer). Midground: the named subject at full instrument resolution. Deep distance: receding starfield with diffraction spikes, atmospheric haze if applicable, secondary astronomical bodies. ALL layers cranked saturation.

━━━ THE ASTRONOMICAL SUBJECT (primary scene seed — build the rest around this) ━━━
${subject}
${eventSection}
━━━ NARRATIVE BEAT (interpret at cosmic / observational scale) ━━━
${story_beat}

Interpret this beat astronomically — the drama is between cosmic forces caught by an instrument. "DEPARTURE" = light leaving the subject. "ARRIVAL" = the instrument just caught the moment. "CONFRONTATION" = subject is at the limit of what light can show us. Don't add figures.

━━━ COMPOSITION FRAME ━━━
${composition_frame}

━━━ LIGHTING / WAVELENGTH TREATMENT ━━━
${lighting}

━━━ WEATHER / PARTICULATE (cosmic dust + gas + radiation) ━━━
${weather_particulate}

If the rolled particulate above names terrestrial weather (acid rain / fog / etc.), reinterpret as the closest cosmic equivalent (interstellar dust / nebula gas haze / solar wind / cosmic ray streaks).

━━━ SCALE PROVERS — include ALL THREE visibly (ASTRONOMICAL or scale-prover-spacecraft) ━━━
- ${scale_provers[0]}
- ${scale_provers[1]}
- ${scale_provers[2]}

Reinterpret any human / mechanical scale provers above as their astronomical equivalent OR as the small mechanical silhouette spacecraft. "Lit windows" → "stellar nurseries"; "ships as dots" stays as small probe silhouette OK.

━━━ EMOTIONAL DNA ━━━
${emotional_dna}

━━━ SURPRISE ELEMENT — secondary phenomenon woven in ━━━
${surprise_element}

Reinterpret as a secondary astronomical accent (gravitational lensing arc / X-ray jet / pulsar wind / dust lane / background quasar / Roche-lobe overflow / etc.) that complements the primary subject.

━━━ MAKE IT OVERWHELMING ━━━
The real universe is more awe-inspiring than any fiction. Crank EVERYTHING — luminous gas clouds GLOWING from within, stars so bright they bloom and flare, color so vivid it looks electric. Space photography as a religious experience. The kind of image that makes you feel insignificant and ecstatic at the same time. FILL THE FRAME with light and color and scale.

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write 100-130 words ━━━
Open with the SUBJECT and its named instrument/wavelength. Layer in: spectral / color details (saturated multi-wavelength composite), composition framing, atmospheric/instrumental glow effects, scale-prover positioning, the secondary surprise element. ONE haunting detail (impossible color, time-dilated light, gravitational lensing arc, X-ray jet at relativistic speed). Photoreal astrophotography finish, cranked saturation, glowing depth.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**. Just the scene content.`;
  },

  PURE_COSMOS: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      story_beat,
      composition_frame,
      scale_provers,
      weather_particulate,
      emotional_dna,
      lighting,
      surprise_element,
      phenomenon,
      event,
    } = slots;

    const eventSection = event
      ? `
━━━ COSMIC EVENT — render this drama visibly ACTIVE in the scene ━━━
${event}

The event is the MOMENT — caught mid-detonation, mid-collision, mid-eruption. Energy + matter + light surging through the frame.

`
      : '';

    return `You are a sci-fi concept-art painter writing a PURE COSMIC VISTA for StarBot — a jaw-dropping cosmic phenomenon that fills the ENTIRE frame. NO characters, NO ships, NO architecture, NO figures of any kind. Pure cosmos, vast and overwhelming. Hubble / Webb / Villeneuve Dune cosmic-horror aesthetic. Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — PURE COSMOS ONLY ━━━
The cosmic phenomenon FILLS THE FRAME. The only permitted elements are astronomical:
- Stars / nebulae / dust lanes / planets / moons / rings / asteroid fields / accretion disks / gas filaments / cosmic radiation
- FORBIDDEN: ships, spacecraft, probes, satellites, drones, figures, characters, silhouettes, buildings, architecture, ANY human-made or biological elements
- If a scale prover names a "ship" or "figure" or "building," reinterpret it as the closest ASTRONOMICAL equivalent (moon, asteroid, distant star)

━━━ MULTI-DEPTH PAINTED COSMOS ━━━
Foreground: tactile cosmic detail (gas filaments / dust shimmer / ring debris). Midground: the primary phenomenon at full scale. Deep distance: receding starfield, atmospheric depth, secondary astronomical anchors.

━━━ THE PRIMARY PHENOMENON (fills the frame) ━━━
${phenomenon}
${eventSection}
━━━ NARRATIVE BEAT (cosmic-scale interpretation) ━━━
${story_beat}

Interpret this beat at COSMIC scale — no human figure. The drama is between cosmic forces, between epochs, between scales of physics.

━━━ COMPOSITION FRAME ━━━
${composition_frame}

━━━ LIGHTING ━━━
${lighting}

━━━ WEATHER / PARTICULATE ━━━
${weather_particulate}

━━━ SCALE PROVERS — include ALL THREE visibly (ASTRONOMICAL only) ━━━
- ${scale_provers[0]}
- ${scale_provers[1]}
- ${scale_provers[2]}

REINTERPRET any human / mechanical scale provers above as their astronomical equivalent. "Ships as dots" → "asteroids as dots". "Figures-as-pinpricks" → "stars-as-pinpricks". "Lit windows" → "stellar nurseries". Pure cosmos only.

━━━ EMOTIONAL DNA ━━━
${emotional_dna}

━━━ SURPRISE ELEMENT — secondary phenomenon woven into the scene ━━━
${surprise_element}

If the surprise element above names a human / mechanical / biological detail, reinterpret it as an astronomical equivalent.

━━━ FORBIDDEN ━━━
- NO ships / spacecraft / probes / satellites / drones / vehicles
- NO figures / silhouettes / characters / creatures
- NO buildings / architecture / megastructures / orbital habitats
- NO planetary surfaces with ground-level details
- NO atmospheric haze in vacuum (haze only inside nebulae or near planetary atmospheres)
- NO franchise proper nouns

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write 100-130 words ━━━
Open with the PRIMARY PHENOMENON dominating the frame. Then layer the cosmic environment — secondary astronomical anchors, lighting quality, particulate matter, dust lanes, scale-prover astronomical bodies. ONE haunting detail (impossible geometry / light bending the wrong way / time visibly dilating / a star where one shouldn't be). Painted finish, gallery-grade atmospheric depth, Hubble-photograph realism + Villeneuve cinematography.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**. Just the scene content.`;
  },

  STEAMBOT_STEAMPUNK_WOMAN: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      persona,
      skin,
      eyes,
      makeup,
      hair_color,
      hairstyle,
      outfit,
      accessory,
      landscape,
      action,
    } = slots;

    return `You are a cinematic illustration painter writing a CANDID STEAMPUNK SCENE for SteamBot — a single gorgeous WOMAN caught mid-action inside a fully-realized Victorian-industrial world. Lush vibrant painted illustration register — finished animation key-art / luxe production-painting feel (BioShock-Infinite / Mortal-Engines / Howl's-Moving-Castle / Treasure-Planet lineage). THE OUTFIT IS THE MAIN SHOW. The setting is her STAGE — a specific, lived-in, sock-blowing steampunk world. Solo. Candid. Tasteful. Sock-blowing.

━━━ GENDER LOCK — ABSOLUTE FIRST RULE ━━━
The subject is a WOMAN. The word "woman" MUST appear in the FIRST 8 TOKENS of your prompt. Do NOT substitute "captain", "engineer", "mechanic", "explorer" or any gender-ambiguous noun for "woman" in the opening. Opening MUST read: "a [ethnicity-coded] WOMAN [doing action] in [setting]..." — "woman" comes BEFORE her persona/role. Use she/her throughout.

━━━ SHE IS THE SHOW — NON-NEGOTIABLE ━━━
The steampunk woman is the MAIN SUBJECT. Her face, the COUTURE OUTFIT, persona, action, and pose are the DRAW. She occupies 25-40% of the frame vertically — FULL BODY head-to-toe visible, head no larger than 10% of frame. NOT a tiny silhouette. NOT a centered head-portrait. MEDIUM scale where outfit / face / hair / accessory all CLEARLY READABLE. THE OUTFIT IS THE MAIN SHOW — every layer must read.

━━━ THE OUTFIT IS THE MAIN SHOW — NON-NEGOTIABLE ━━━
Render the OUTFIT with OBSESSIVE craftsmanship detail — this is what the viewer is here to see. Victorian-industrial steampunk, super ornate, super layered, tasteful. NEVER SIMPLE — never plain shirt, never plain pants, never minimal. The outfit silhouette varies wildly across renders — could be a steampunk BALL-GOWN, or a TAILORED JACKET-AND-PANTS, or a FITTED CORSET-OVER-BLOUSE WITH RIDING-SKIRT, or LEGGINGS-AND-CORSET-COAT, or a STRUCTURED RIDING-HABIT, or a PILOT'S COAT-AND-TROUSERS, or a LAYERED ALCHEMIST'S ENSEMBLE. Whatever silhouette the wardrobe pool rolls — render it as ORNATE, LAYERED, AND DETAILED. Every brass clasp, every copper button, every jeweled brooch, every gear medallion, every gold filigree, every velvet panel, every brocade flourish, every leather strap, every embroidered cuff rendered explicitly. The outfit gets the MAJORITY of the prompt word-budget — every visible layer named.

━━━ SOLO CHARACTER ONLY ━━━
EXACTLY ONE character. No companions, no second figures, no crowds. She is ALONE in her moment.

━━━ TASTEFUL VICTORIAN GLAMOUR — NOT MODERN-SKIN-SHOW ━━━
She is GORGEOUS, GLAMOROUS, CAPTIVATING — a painted illustration heroine. Beauty reads through couture craftsmanship, confident posture, painterly gaze, jewel-toned color, ornate detail — NOT through exposed skin or body-focus framing. BioShock-Infinite Elizabeth + Howl's-Moving-Castle Sophie + Treasure-Planet Captain Amelia + Mortal-Engines Anna Fang energy. Refined, luminous, alive.

━━━ THE STEAMPUNK SETTING — HER STAGE — BLOW SOCKS OFF ━━━
${landscape}

This setting is HER WORLD. Render it as a FULLY-REALIZED steampunk environment with depth-on-depth — FOREGROUND tactile detail near her (workbench surface, ship railing, console knobs, alchemy table, pipework she's leaning against) → MIDGROUND her + the immediate environment (the room/space she stands in) → DEEP DISTANCE the wider world (corridor extending back, sky beyond the porthole, factory floor receding, balcony view, conservatory glass roof). Never a flat backdrop. Never decorative-clutter framing of clocks/gears/pipes pasted around her edges — the setting is LIVED IN, FUNCTIONAL, real. Make the viewer want to BE in that room.

━━━ HER PERSONA (her role / energy — informs how she carries herself) ━━━
${persona}

━━━ HER COMPACT BIO (one-line block — DO NOT expand into separate sections) ━━━
A ${skin.split(',')[0]}, with ${eyes.split(',')[0]} eyes, ${hair_color.split(',')[0]} hair styled ${hairstyle.split(',')[0]}, wearing ${outfit}, carrying ${accessory}. Her makeup: ${makeup.split(',')[0]}.

(All eight DNA elements should be discernible in the render. Face fully visible — she's not in a sealed helmet.)

━━━ MAKEUP MANDATE — DETAILED + STEAMPUNK-CODED ━━━
Render her makeup with OBSESSIVE specificity AND steampunk vocabulary. NEVER plain or natural. Always elaborately styled — brass-dust highlight, kohl-rimmed eyes with smudged wing, copper-leaf temple, gold-leaf accent, soot-dark eyebrow, oxidized-bronze contour, gear-pattern eyeshadow, mercury-bright highlighter, candle-smoke smudge, rust-and-amber lip stain, wine-bruise lip, ink-blue undereye, scarification, brass-pigment temple-stripe. Whatever the makeup pool says — render it visibly + steampunk-coded.

━━━ ACCESSORY MANDATE — DETAILED + STEAMPUNK-CODED ━━━
The accessory she carries / wears must be rendered with OBSESSIVE mechanical detail and steampunk specificity. Brass + copper + leather + gemstone + clockwork. Every gear visible, every rivet shown, every patina rendered. Multi-part mechanical accessories preferred over single-piece jewelry.

━━━ THE CANDID ACTION — what she is doing RIGHT NOW (caught mid-moment) ━━━
${action}

GROUNDED — feet planted, body weight visible, captured at a loaded instant of doing the action. She is NOT posing for the camera — the camera caught her mid-task. Hands and body engaged with what she is doing.

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

━━━ COMPOSITION ━━━
Three-quarter angle or side profile so we see her face, body, and ornate outfit. NEVER posing for the camera. NEVER walking head-on toward camera. Full-body or wide mid-shot. FOREGROUND: tactile detail near her (object she's interacting with). MIDGROUND: HER, full body, mid-action, 25-40% of frame. BACKGROUND: the steampunk setting extending into depth with atmospheric haze. The frame is composed like BioShock-Infinite key art — character + her world, harmoniously balanced.

━━━ ALLOWED VOCABULARY (use often) ━━━
glamorous, captivating, luminous, regal, elegant, couture, tailored, structured, romantic, opulent, aristocratic, refined, ornamental, jewel-toned, filigree, brocade, lace overlay, embroidered, velvet, satin, brass detailing, clockwork accents, porcelain complexion, painterly gaze, graceful posture, theatrical, dramatic silhouette, ornate.

━━━ FORBIDDEN VOCABULARY — these specific words trigger Replicate's NSFW filter ━━━
- sexy, erotic, sensual, seductive, provocative, temptress, lingerie, pinup, pin-up
- voyeuristic, voyeur, bedroom, boudoir, sultry
- "strategic cutouts", "see-through", "sheer panels", "exposure"
- body-focus terms: hips, thighs, rear, bare midriff, underboob
- moisture/heat-on-skin imagery: wet lips, beads of sweat, moisture on skin, humidity beading
- decorative-cliché framing language: "brass piping at frame edges", "gears at frame edges", "clockwork ornaments framing", "art-nouveau borders"

ALLOWED Victorian-fashion vocabulary (use freely): corset, corseted, structured bodice, brass-cage bodice, décolletage, off-shoulder, lace cuff, embroidered sleeve, gown, ball-gown, riding-coat, fitted vest, opera-glove, cravat, choker, jewel-collar, bustle.

━━━ HARD BANS — COMPOSITION ━━━
- NO second person in frame — she is ALONE
- NO tight head-portrait crop — full body, 25-40% frame
- NO posing-for-camera, NO modeling shot, NO trading-card art
- NO substituting your own descriptions for the pool entries — render what's locked
- NO decorative clutter framing (clocks/gears/pipes pasted around the edges as decoration)

━━━ STRUCTURE (write the prompt in this exact order) ━━━
[OPENING: "a [ethnicity-coded] WOMAN [doing exact action] in [steampunk setting]" — woman comes before persona], [her couture outfit with OBSESSIVE LAYERED material detail — every visible layer + every brass clasp / lace cuff / embroidered sleeve / jeweled brooch], [signature accessory visible], [her face: skin tone + eyes + makeup + hair from DNA slots], [the steampunk setting with depth + atmospheric layers], [lighting + atmosphere], [color palette + mood]

CRITICAL — the OPENING tokens are "[ethnicity-coded woman] [DOING ACTION] in [steampunk setting]". She fills 25-40% of frame, FULL-BODY. The OUTFIT gets the most word-budget — that's where the obsessive material detail lives.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
  },

  STEAMBOT_STEAMPUNK_MAN: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      persona,
      skin,
      eyes,
      facial_hair,
      hair_color,
      hairstyle,
      outfit,
      accessory,
      landscape,
      action,
    } = slots;

    return `You are a cinematic illustration painter writing a CANDID STEAMPUNK SCENE for SteamBot — a single handsome MAN caught mid-action inside a fully-realized Victorian-industrial world. Lush vivid painted illustration register — finished animation key-art / luxe production-painting feel (BioShock-Infinite / Mortal-Engines / Howl's-Moving-Castle / Treasure-Planet lineage). THE OUTFIT IS THE MAIN SHOW. The setting is his STAGE — a specific, lived-in, sock-blowing steampunk world. Solo. Candid. Tasteful. Sock-blowing.

━━━ GENDER LOCK — ABSOLUTE FIRST RULE ━━━
The subject is a MAN. The word "man" MUST appear in the FIRST 8 TOKENS of your prompt. Do NOT substitute "captain", "engineer", "mechanic", "explorer", "gentleman", "rogue", or any gender-ambiguous noun for "man" in the opening. Opening MUST read: "a [ethnicity-coded] MAN [doing action] in [setting]..." — "man" comes BEFORE his persona/role. Use he/his/him throughout.

━━━ HE IS THE SHOW — NON-NEGOTIABLE ━━━
The steampunk man is the MAIN SUBJECT. His face, the OUTFIT, persona, action, and pose are the DRAW. He occupies 25-40% of the frame vertically — FULL BODY head-to-toe visible, head no larger than 10% of frame. NOT a tiny silhouette. NOT a centered head-portrait. MEDIUM scale where outfit / face / hair / facial hair / accessory all CLEARLY READABLE. THE OUTFIT IS THE MAIN SHOW — every layer must read.

━━━ THE OUTFIT IS THE MAIN SHOW — NON-NEGOTIABLE ━━━
Render the OUTFIT with OBSESSIVE craftsmanship detail — this is what the viewer is here to see. Victorian-industrial steampunk, super ornate, super layered, period-accurate gentleman's attire. NEVER SIMPLE — never plain shirt, never plain pants, never minimal. The outfit silhouette varies wildly across renders — could be a tailored frock-coat, or a military officer's coat-and-breeches, or a leather aviator coat + flight gear, or a riding-coat with brass clasps over waistcoat + trousers, or an alchemist's apron over shirt + waistcoat + breeches, or a engineer's vest + rolled sleeves + work-trousers, or a gentleman explorer's khaki kit + boots, or a dandy's brocade frock-coat + cravat + trousers. Whatever silhouette the wardrobe pool rolls — render it as ORNATE, LAYERED, AND DETAILED. Every brass button, every leather strap, every layer named.

━━━ SOLO CHARACTER ONLY ━━━
EXACTLY ONE character. No companions, no second figures, no crowds, no women. He is ALONE in his moment.

━━━ HANDSOME THROUGH ACTION — NOT POSED — NEVER SEDUCTIVE ━━━
He is HANDSOME, DASHING, RUGGED, INTENT, CAPABLE, WEATHERED — the appeal reads through his action, his weathered features, his craftsmanship, his confident stance. NEVER through pose-for-camera, NEVER through seductive/smoldering/come-hither energy. NEVER bare-chested. NEVER shirtless. NEVER open-shirt-for-sex-appeal. He is FULLY DRESSED at all times — rolled sleeves over a workbench are fine (that's working, not undressing). Think Errol Flynn / Cary Grant / Robert Downey Jr's Sherlock / BioShock-Infinite Booker / Treasure-Planet Captain Amelia's male crew counterparts / Around-the-World-in-80-Days Phileas Fogg.

━━━ THE STEAMPUNK SETTING — HIS STAGE — BLOW SOCKS OFF ━━━
${landscape}

This setting is HIS WORLD. Render it as a FULLY-REALIZED steampunk environment with depth-on-depth — FOREGROUND tactile detail near him (workbench surface, ship railing, console knobs, alchemy table, pipework he's leaning against) → MIDGROUND him + the immediate environment (the room/space he stands in) → DEEP DISTANCE the wider world (corridor extending back, sky beyond the porthole, factory floor receding, balcony view, conservatory glass roof). Never a flat backdrop. Never decorative-clutter framing of clocks/gears/pipes pasted around his edges — the setting is LIVED IN, FUNCTIONAL, real.

━━━ HIS PERSONA (his role / energy — informs how he carries himself) ━━━
${persona}

━━━ HIS COMPACT BIO (one-line block — DO NOT expand into separate sections) ━━━
A ${skin.split(',')[0]}, with ${eyes.split(',')[0]} eyes, ${facial_hair.split(',')[0]}, ${hair_color.split(',')[0]} hair styled ${hairstyle.split(',')[0]}, wearing ${outfit}, carrying ${accessory}.

(All eight DNA elements — ethnicity/skin / eyes / facial hair / hair color / hairstyle / outfit / accessory / persona — should be discernible in the render. Face fully visible — he's not in a sealed helmet.)

━━━ FACIAL HAIR MANDATE — DETAILED + PERIOD-ACCURATE ━━━
Render his facial hair with OBSESSIVE specificity AND period-Victorian vocabulary. NEVER generic stubble unless the pool says so. Always rendered exactly — waxed handlebar mustache / full mutton-chop sideburns / Van Dyke goatee / clean-shaven sharp jaw / three-day stubble / iron-grey beard / Imperial mustache / chinstrap beard / pomaded-down beard / sailor's full beard / soot-flecked stubble. Whatever the facial-hair pool says — render it visibly and period-accurate.

━━━ ACCESSORY MANDATE — DETAILED + STEAMPUNK-CODED ━━━
The accessory he carries / wears must be rendered with OBSESSIVE mechanical detail and steampunk specificity. Brass + copper + leather + steel + gemstone + clockwork. Every gear visible, every rivet shown, every patina rendered. Multi-part mechanical accessories preferred over single-piece tools.

━━━ THE CANDID ACTION — what he is doing RIGHT NOW (caught mid-moment) ━━━
${action}

GROUNDED — feet planted, body weight visible, captured at a loaded instant of doing the action. He is NOT posing for the camera — the camera caught him mid-task. Hands and body engaged with what he is doing.

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

━━━ COMPOSITION ━━━
Three-quarter angle or side profile so we see his face, body, and ornate outfit. NEVER posing for the camera. NEVER walking head-on toward camera. Full-body or wide mid-shot. FOREGROUND: tactile detail near him (object he's interacting with). MIDGROUND: HIM, full body, mid-action, 25-40% of frame. BACKGROUND: the steampunk setting extending into depth with atmospheric haze. The frame is composed like BioShock-Infinite key art — character + his world, harmoniously balanced.

━━━ ALLOWED VOCABULARY (use often) ━━━
handsome, dashing, rugged, intent, capable, weathered, refined, distinguished, gentlemanly, aristocratic, commanding, stoic, watchful, tailored, structured, ornamental, brass-trimmed, leather-bound, mechanical, period-accurate, Victorian gentleman, painterly gaze, confident posture, opulent, opulent, theatrical, dramatic silhouette.

━━━ FORBIDDEN VOCABULARY — DO NOT WRITE ━━━
- sexy, sensual, seductive, sultry, smoldering, come-hither, alluring (in seductive sense), provocative
- shirtless, bare-chested, open-shirt, exposed torso, beefcake, oiled-pecs, sleeveless
- ANY female-coded vocabulary: décolletage, cleavage, bodice, gown, dress, skirt, lace cuff, makeup, kohl, eyeliner, jewelry-collar, choker, jewel-trim (he wears Victorian gentleman's attire ONLY)
- moisture/heat-on-skin imagery: wet, sweat, beads, flushed, glistening
- decorative-cliché framing: "brass piping at frame edges", "gears at frame edges", "clockwork ornaments framing"

Do NOT cross-pollute with female vocabulary. He is male. His outfit is male Victorian-industrial attire. His features are male.

━━━ HARD BANS — COMPOSITION ━━━
- NO second person in frame — he is ALONE
- NO modern dress (this is Victorian-industrial fantasy)
- NO substituting your own descriptions for the pool entries — render what's locked
- NO decorative clutter framing (clocks/gears/pipes pasted around the edges as decoration)
- NO shirtless or open-shirt-for-sex-appeal

━━━ STRUCTURE (write the prompt in this exact order) ━━━
[OPENING: "a [ethnicity-coded] MAN [doing exact action] in [steampunk setting]" — man comes before persona], [his outfit with OBSESSIVE LAYERED material detail — every visible layer + every brass button / leather strap / waistcoat lapel / coat-cuff / boot-buckle], [signature accessory visible], [his face: skin tone + eyes + facial hair + hair from DNA slots], [the steampunk setting with depth + atmospheric layers], [lighting + atmosphere], [color palette + mood]

CRITICAL — the OPENING tokens are "[ethnicity-coded man] [DOING ACTION] in [steampunk setting]". He fills 25-40% of frame, FULL-BODY. The OUTFIT gets the most word-budget — that's where the obsessive material detail lives.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
  },

  STEAMBOT_STEAM_TRANSPORT: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, transport, terrain_drama, surprise_element, phenomenon } = slots;

    const phenomenonSection = phenomenon
      ? `
━━━ ATMOSPHERIC PHENOMENON — render this visibly in the scene ━━━
${phenomenon}

A dramatic atmospheric event amplifying the journey — render as a visible focal point charging the scene. Heightens the "impossible geography" mandate.

`
      : '';

    return `You are a cinematic concept-painter writing a STEAM TRANSPORT scene for SteamBot — a Victorian-industrial vehicle conquering DRAMATIC TERRAIN. Locomotives, submarines, walking-machines, paddleboats, steam-carriages, mine-cages, clockwork-creatures-as-transport. The machine + the landscape create the drama TOGETHER. The frame should make the viewer feel the SCALE and AUDACITY of crossing impossible geography. Mortal-Engines / Snowpiercer / 20,000-Leagues / Wild-Wild-West-loco / Howl's-Moving-Castle / Ghibli-train-from-Spirited-Away visual lineage.

━━━ VEHICLE IS FOCAL — TERRAIN IS THE STAGE ━━━
The vehicle is the central subject, but the landscape is what makes it dramatic. NEVER a vehicle on flat boring track. ALWAYS the vehicle in a setting that AMPLIFIES — canyon bridge in a storm, mountain pass with avalanche, deep-sea trench with bioluminescent creatures, desert dune-field at sunset, ice-shelf with calving icebergs, jungle valley with vine-covered ruins, sky-rail across a chasm.

━━━ THE TRANSPORT SCENE (vehicle + immediate setting) ━━━
${transport}

Render the vehicle with OBSESSIVE Victorian-industrial detail — every rivet, every steam-vent, every brass pipe, every weathered plate. The vehicle's MATERIALITY is the signature.

━━━ TERRAIN DRAMA — the geography that makes the scene epic ━━━
${terrain_drama}

Render the terrain DRAMATICALLY with depth-on-depth — FOREGROUND tactile detail (rail-tie / hull-plate / vehicle-edge near camera) → MIDGROUND the vehicle traversing the dramatic geography → DEEP DISTANCE the impossible landscape stretching beyond. The terrain dwarfs and amplifies the vehicle simultaneously.

━━━ SURPRISE ELEMENT — secondary detail adding story ━━━
${surprise_element}

Place at midground or deep distance — a small detail implying the wider world (distant signal-tower, second vehicle on parallel track, scattered crew on observation deck, mechanical wildlife). NEVER eclipsing the hero vehicle.
${phenomenonSection}
━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ OBSESSIVE STEAMPUNK CRAFTSMANSHIP — NON-NEGOTIABLE ━━━
Every gear, rivet, pipe, valve, pressure-gauge, polished-brass-surface, copper-patina-detail rendered with MAXIMUM detail. Warm brass + copper + bronze + oiled-wood DOMINANT palette. Steam trails, smoke plumes, headlamp beams cutting through weather. NEVER sparse, NEVER minimal.

━━━ COMPOSITION ━━━
Wide cinematic establishing-shot. Vehicle at 25-50% of frame as the focal subject. Multi-tier depth — FOREGROUND tactile (rail / hull / track-edge) → MIDGROUND the vehicle traversing the terrain → DEEP DISTANCE the impossible landscape with atmospheric layers. Show SCALE — the machine vs the landscape. Steam trails / smoke plumes / headlamp beams / wake-spray cut through the air. Three-quarter angle preferred so the vehicle's silhouette reads.

━━━ HARD BANS ━━━
- NO vehicle on flat boring track / NO vehicle in empty space — terrain MUST amplify drama
- NO primary human figure (tiny crew silhouettes OK as scale-provers)
- NO modern vehicles (this is 1890s impossible-engineering)
- NO decorative cliché framing (gears/clocks pasted at the edges)
- NO substituting your own descriptions for the pool entries — render what's locked

━━━ STRUCTURE (write in this order) ━━━
[OPENING: wide cinematic shot of the VEHICLE conquering the dramatic terrain — vehicle + terrain in one image], [the vehicle's Victorian-industrial detail], [the terrain drama amplifying the journey], [surprise element at midground], [phenomenon if rolled], [lighting + atmosphere], [color palette + mood]

CRITICAL — the OPENING tokens establish VEHICLE + DRAMATIC TERRAIN as the subject. The machine and the landscape together make the frame epic.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
  },

  STEAMBOT_STEAMPUNK_SPECTACLE: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, event, crowd_detail, surprise_element, escalation } = slots;

    const escalationSection = escalation
      ? `
━━━ ESCALATION — render this dramatic intensification ━━━
${escalation}

A dramatic escalation of the event — render as a visible focal point amplifying the crowd's reaction. Adds heightened drama. NEVER mass violence, NEVER gore — atmospheric/mechanical/social drama only.

`
      : '';

    return `You are a cinematic concept-painter writing a STEAMPUNK SPECTACLE scene for SteamBot — a grand Victorian-industrial event / ceremony / festival / performance / uprising with crowd energy and drama. The EVENT is the subject. Wide cinematic establishing shot or dramatic crowd-level angle. Prestige feature-film concept-render polish.

━━━ THE EVENT IS THE SUBJECT — NON-NEGOTIABLE ━━━
The event commands the frame. NEVER a single hero figure. The crowd, the spectacle, the moment — all of it together is the subject. Tiny figures against massive machinery, packed balconies, sea of top-hats and goggles, multi-tier spectators.

━━━ THE EVENT (the moment captured) ━━━
${event}

Render the event with OBSESSIVE Victorian-industrial detail and depth-on-depth — FOREGROUND figures (a few prominent characters in the closest tier) → MIDGROUND the event-action and its main participants → DEEP DISTANCE wider crowd extending into atmospheric haze. The event feels MASSIVE and ALIVE.

━━━ CROWD DETAIL — the human-energy texture ━━━
${crowd_detail}

Render the crowd as a textured living mass — specific clothing details visible (top-hats / corsets / brass-goggles / waistcoats / parasols / military uniforms / labor-aprons / urchin caps). Mixed Victorian society — the crowd composition tells the story.

━━━ SURPRISE ELEMENT — secondary detail adding story ━━━
${surprise_element}

Place at midground or deep distance — a small detail amplifying the moment (press photographer crouched, distant airship hovering to witness, signal beacon, escaped automaton, vendor cart at frame edge). NEVER eclipsing the event.
${escalationSection}
━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ OBSESSIVE STEAMPUNK CRAFTSMANSHIP — NON-NEGOTIABLE ━━━
Every gear, rivet, pipe, valve, pressure-gauge, polished-brass-surface, copper-patina-detail rendered with MAXIMUM detail. Warm brass + copper + bronze + oiled-wood DOMINANT palette. Surface density everywhere. NEVER sparse, NEVER minimal.

━━━ COMPOSITION ━━━
Wide cinematic establishing shot OR dramatic crowd-level angle. Multi-tier depth: FOREGROUND tactile crowd-detail → MIDGROUND event-action with main participants → DEEP DISTANCE wider crowd + atmospheric layers receding. NEVER tight close-up on one face. NEVER pulled-back to where the crowd becomes pinpricks. Sweet spot: spectacle reads with epic scope, individual figures readable as story-anchors.

━━━ HARD BANS ━━━
- NO single hero figure dominating (event is the subject — not a person)
- NO modern objects (this is 1890s impossible-engineering)
- NO mass violence / blood / gore — drama is mechanical / social / atmospheric
- NO substituting your own descriptions for the pool entries — render what's locked
- NO decorative cliché framing (gears/clocks pasted at the edges as decoration)

━━━ STRUCTURE (write in this order) ━━━
[OPENING: wide cinematic establishing-shot of THE EVENT], [the event-action with detailed unfolding], [the crowd detail texture], [surprise element at midground], [escalation if rolled], [lighting + atmosphere], [color palette + mood]

CRITICAL — the OPENING tokens establish the EVENT as the subject. The crowd is the human texture. The atmosphere amplifies.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
  },


  STEAMBOT_COZY_STEAMPUNK: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, room, flora, window_view, intricate_detail, quiet_moment } = slots;
    const floraArr = Array.isArray(flora) ? flora : [flora];
    const detailArr = Array.isArray(intricate_detail) ? intricate_detail : [intricate_detail];

    const quietSection = quiet_moment
      ? `
━━━ QUIET MOMENT — render this comforting detail ━━━
${quiet_moment}

A small comforting human-trace detail — a book left open on the bed, a teacup cooling on the side-table, a cat curled on a velvet chair, an unfinished letter on the writing desk. Adds the feeling that someone JUST WAS HERE. Place at midground, NEVER eclipsing the room or window.

`
      : '';

    return `You are a cinematic interior painter writing a COZY STEAMPUNK ROOM scene for SteamBot — a dreamy, ethereal, comforting Victorian-industrial interior with a beautiful window view. The room itself is BEAUTIFUL (pretty steampunk furniture, flower arrangements, plants, ornate fixtures), AND the window view is BEAUTIFUL (sunset / rainstorm aqua sky / distant airships / cloudtops). Multi-layered: the pretty room + the pretty window view TOGETHER make the frame. The viewer should feel the urge to step in, sit down, and look out the window.

━━━ THE FEELING — NON-NEGOTIABLE ━━━
DREAMY. ETHEREAL. COMFORTING. SURREALLY BEAUTIFUL. The kind of room you'd want to spend a quiet afternoon in. Soft, warm, intricate, lived-in. Not a documentary photograph — a painted dream of a place that doesn't quite exist.

━━━ MULTI-LAYERED COMPOSITION — NON-NEGOTIABLE ━━━
TWO HEROES side-by-side: (1) the cozy steampunk INTERIOR and (2) the beautiful WINDOW VIEW visible through tall windows / glass doors / a glass-and-iron conservatory wall. Both must read clearly. Compose so the room fills 60-70% of the frame and the window view occupies the remaining 30-40% as a glowing portal into the outside world. The window is a focal element of the room — large, ornate, framing a vista.

━━━ THE ROOM (the cozy steampunk interior) ━━━
${room}

Render the room with depth-on-depth — FOREGROUND tactile detail (bedpost edge, cushion corner, side-table surface) → MIDGROUND the room's central furniture and the figure-of-the-space → BACKGROUND the window-wall with its view. Period-accurate Victorian-industrial — brass beds, velvet drapes, mahogany side-tables, leather chairs, copper sconces, oriental rugs, hand-tooled fixtures. Lived-in, warm, intricate.

━━━ FLORA — render ALL THREE in the scene ━━━
- ${floraArr[0] || ''}
- ${floraArr[1] || ''}
- ${floraArr[2] || ''}

Flowers and plants fill the room with life — fresh-cut blooms in crystal vases, climbing vines around the window, potted ferns on side-tables, hanging gardens, brass-banded planters. EVERY one must be visible. They soften the steampunk industrial edges into something tender.

━━━ THE WINDOW VIEW (the beautiful outside) ━━━
${window_view}

Render the view through the tall ornate window as a CLEAR, RICHLY-COLORED scene — the viewer can see the sunset / sky / airships / cloudtops / distant city. The window is a portal into wonder. Subtle atmospheric haze where it makes sense, but never a fog-bath — the view is READABLE.

━━━ INTRICATE DETAILS — render BOTH on the room's fixtures ━━━
- ${detailArr[0] || ''}
- ${detailArr[1] || ''}

These are the ornate steampunk touches that saturate the room with craftsmanship — every brass fitting, every copper hinge, every clockwork ornament, every carved wood-panel. Render with OBSESSIVE detail.
${quietSection}
━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ DREAMY ETHEREAL RENDER QUALITY ━━━
The render reads PAINTED + WARM + SOFT. NOT documentary photoreal, NOT cold-CGI, NOT gritty-realism. Painterly cinematic with rich saturated jewel-tone color. The light streaming through the window kisses the room's surfaces gently. Atmospheric depth without volumetric soup. Every layer — room foreground, room midground, window view — reads CLEARLY.

━━━ COMPOSITION ━━━
Wide interior establishing-shot — slight three-quarter angle from inside the room, looking past the furniture-and-flora foreground/midground toward the window-and-view. NO single human figure as the subject (the room and view are the subject; tiny silhouette of someone seated at a chair from behind is fine as scale-prover). The room INVITES the viewer in.

━━━ HARD BANS ━━━
- NO single human figure dominating (the room itself is the subject)
- NO modern objects (this is 1890s impossible-engineering)
- NO gritty / muddy / industrial-slum register (this is DREAMY-COZY)
- NO heavy volumetric fog smothering detail
- NO empty/austere/minimalist room — must be lived-in, intricate, filled with flora and fixtures
- NO substituting your own descriptions for the pool entries — render what's locked

━━━ STRUCTURE (write in this order) ━━━
[OPENING: a wide interior establishing-shot of a cozy dreamy steampunk room with a beautiful window view], [the room with its furniture and depth layers], [the three flora elements woven in], [the two intricate details on fixtures], [the window view as a glowing portal into wonder], [the quiet moment if rolled], [lighting + atmosphere], [color palette + mood]

CRITICAL — the OPENING tokens establish the COZY ROOM + WINDOW VIEW together. The viewer takes a deep breath and wants to step inside.

Output ONLY the raw 120-160 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
  },

  STEAMBOT_STEAMPUNK_LABS: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, lab_space, centerpiece, apparatus, electrical, scientist } = slots;
    const details = Array.isArray(apparatus) ? apparatus : [apparatus];

    const electricalSection = electrical
      ? `
━━━ ELECTRICAL PHENOMENON (mandatory — Tesla-coded lab energy) ━━━
${electrical}

This electrical event adds dramatic experimental energy to the lab. It surrounds, accompanies, or originates from the centerpiece experiment. Render it visibly and prominently in the scene — branching arcs, plasma glow, static haze, or sparking discharge. The electrical glow contributes ONE of the mandatory 4+ glow colors.

`
      : '';

    const scientistSection = scientist
      ? `
━━━ TINY SCIENTIST FIGURE (scale-prover only — NEVER the focal subject) ━━━
${scientist}

A TINY lab-coated figure at midground edge, 5-10% of frame at most. The figure makes the experiment feel impossibly large by proximity. NEVER frontal-facing, NEVER posing for the camera, NEVER the focal subject.

`
      : '';

    return `You are a steampunk concept-art painter writing a MAD-SCIENCE LABORATORY scene for SteamBot. This is a FRANKENSTEIN-meets-TESLA mad-science laboratory PACKED WITH MULTI-COLORED GLOWING EXPERIMENTS — emerald potion-vessels + hot-pink sigil-circles + electric-blue Tesla-lightning + amber gas-lamp warmth + violet plasma-orbs, all visible simultaneously in the same frame. The lab BLAZES with experimental energy in a rainbow of saturated colors. Inspired by Tesla's Wardenclyffe lab / Frankenstein's reanimation tower / Nemo's Nautilus / Doc-Brown's-DeLorean-workshop / The-Time-Machine / Bioshock-Rapture-laboratory. The architecture is Victorian-industrial (brass-and-mahogany, arched-glass ceiling, gas-lamps) but the SCENE IDENTITY IS MAD-SCIENCE GLOWING CHAOS, not a quiet Victorian library.

⚠️ MANDATORY — MULTIPLE SIMULTANEOUS GLOW COLORS (NON-NEGOTIABLE) ━━━
This is THE defining feature of the path. EVERY render packs the frame with MULTIPLE GLOWING EXPERIMENTS in DIFFERENT colors visible SIMULTANEOUSLY. NEVER a single-color-dominant render. ALWAYS a rainbow of distinct glow-colors across the frame.

⚠️ MINIMUM 4 DIFFERENT GLOW COLORS visible simultaneously — use AT LEAST 4 of these in every render:
• EMERALD GREEN — bioluminescent potion-vessels, witch-fire glow
• ELECTRIC BLUE — Tesla-coil arcs, energy plasma, ice-experiments
• HOT PINK / MAGENTA — pulsing sigil-circles, ruby crystals
• AMBER / GOLDEN — alchemical fire, gas-lamp warmth, sulfur
• VIOLET / PURPLE — magical fields, levitation chambers, lightning
• CRIMSON / RUBY — blood-experiments, ruby-light apparatus
• AQUA / TEAL — frost-vessels, plasma-globes, mercury-vapor
• POISON YELLOW — toxic-experiments, alchemical sulfur
• SILVER-WHITE — moon-essence, mercury-vessels

Front and center: a glowing centerpiece + 2-3 other glowing apparatus + visible Tesla-coil-lightning OR plasma-discharge + a glowing sigil-circle on the floor or workbench — ALL DIFFERENT COLORS. The reference image has emerald-green potion-globe + hot-pink sigil-circle + electric-blue Tesla-lightning + amber gas-lamp warmth + violet smaller orbs, ALL in the same frame, ALL different colors. THAT is the target density and palette-mix.

⚠️ STRUCTURAL DENSITY MANDATE — minimum 5-8 distinct glowing things across the frame:
• 1 large CENTERPIECE experiment glowing brightly (use the centerpiece slot's color)
• 3+ smaller glowing potion-vessels around the room (each in a DIFFERENT color than the centerpiece AND each other)
• 1+ Tesla-coil lightning / plasma-glow / electrical-arc phenomenon crackling visibly
• 1+ glowing sigil-circle etched into the floor — pulsing with magical light in yet ANOTHER color
• Multiple smaller glowing accents — pulsing crystals, lit-up vials on shelving, glowing ports on apparatus, runic patterns etched into brass

The room is ALIVE with saturated glow in 4-6 DIFFERENT COLORS simultaneously. Frankenstein's-creature-reanimation-scene + Doc-Brown's-DeLorean-workshop + Tesla's-Wardenclyffe energy. Every shelf has glowing things, every workbench has glowing things, every wall has glowing things. NEVER a quiet Victorian library / brewery / observatory feel. NEVER a single-color-dominant render. ALWAYS mad-science MULTI-COLORED glowing chaos.

⚠️ ABSOLUTE BAN — NO single-color-dominant render. NO subtle-glow render. NO empty-of-experiments render. NO mostly-amber-monochromatic. NO mostly-violet-monochromatic. The frame contains at LEAST FOUR DIFFERENT GLOW COLORS visible at once.

━━━ THE COMPOSITION — RICH LAYERED LAB INTERIOR ━━━
WIDE CINEMATIC INTERIOR SHOT. Multi-tier depth mandatory:
• FOREGROUND: tactile lab details — workbench edges, peripheral apparatus, glowing sigil-circles on the floor (different color from centerpiece), glowing potion-vessels in close detail (each in a DIFFERENT color)
• MIDGROUND: THE CENTERPIECE EXPERIMENT — the major glowing apparatus that anchors the scene (the viewer's eye lands here FIRST)
• DEEP DISTANCE: the lab architecture rises around and beyond — shelving climbing the walls covered in glowing vials in MIXED colors, balconies, the arched-glass ceiling above
• SKY/CEILING: arched-glass overhead OR vaulted-brick OR timber rafters — Tesla-lightning OR plasma-glow crackling across the upper space

Camera angle options: eye-level looking into the centerpiece / low-angle looking up at the soaring ceiling / three-quarter establishing-shot showing both depth and height. NEVER head-on portrait. NEVER a tight close-up.

━━━ RICH VICTORIAN-INDUSTRIAL DETAIL — NON-NEGOTIABLE ━━━
EVERY SURFACE IS PACKED WITH DETAIL — Victorian-industrial intricate. Every shelf has GLOWING glassware (different colors), every wall has mounted glowing instruments, every workbench has glowing apparatus + scattered diagrams, every cornice has brass-clockwork ornament. The room is BUSY + LIVED-IN + INTRICATE + GLOWING — never sterile, never quiet.

Render ALL THREE of these specific apparatus details VISIBLY in the frame (each in a DIFFERENT glow color from the centerpiece):

  • APPARATUS 1: ${details[0] || ''}
  • APPARATUS 2: ${details[1] || ''}
  • APPARATUS 3: ${details[2] || ''}

PLUS layer additional Victorian-industrial detail throughout — mahogany floor-to-ceiling shelving packed with multi-colored glowing glassware, brass-railed mezzanines, gas-lamp sconces every few feet, copper-pipe rigging overhead, mosaic-tile sigil-patterns on the floor, hanging chains and pulleys, brass-rimmed leaded-glass cabinets with glowing specimens.

━━━ STRICT STEAMBOT MAD-SCIENCE ━━━
🚫 NO modern / digital / electric-bulb / LED / fluorescent / computer
🚫 NO clinical / sterile / empty / minimalist / quiet
🚫 NO horror / no skulls / no specimen-jars-of-organs / no dismemberment / no gore
🚫 NO sci-fi / cyberpunk / neon-cyberpunk
🚫 NO factory / warehouse / industrial-scaffold / no brewery
🚫 NO Victorian library / observatory / drawing-room (this is a MAD-SCIENCE LAB)
🚫 NO weaponry / no destruction
🚫 NO single-tier flat composition — always multi-level + arched + vaulted
🚫 NO single-color-dominant glow — always 4+ different glow colors
🚫 NO primary human figure (scientist is a TINY scale-prover only)
✓ Tesla's Wardenclyffe / Frankenstein's tower-lab / Nemo's Nautilus / Doc-Brown's-DeLorean-workshop / The-Time-Machine / Bioshock-Rapture-laboratory / Royal Society

━━━ THE LAB SPACE (the room — backdrop and stage) ━━━
${lab_space}

The space anchors the scene's Victorian-industrial identity. Multi-tier architecture. Brass-and-mahogany shelving (packed with multi-colored glowing glassware). Gas-lamps casting warm amber light into the room — but the SATURATED color comes from the EXPERIMENTS, not the gas-lamps.

━━━ THE CENTERPIECE EXPERIMENT (THE FOCAL POINT — render BIG and PROMINENT) ━━━
${centerpiece}

This is THE focal point of the image. Position it in the midground at the center-ish of the frame. It is the glowing thing the viewer's eye lands on first. Render it with obsessive material detail — every brass fitting, every glass curve, every glowing-liquid swirl, every wisp of vapor, every spark. The centerpiece occupies 20-35% of the frame. Its glow is the DOMINANT glow color in the render — but NEVER the only one.
${electricalSection}${scientistSection}━━━ LIGHTING ━━━
${lighting}

Combined with WARM gas-lamp ambient AND the SATURATED multi-color experiment glow. MANY light sources at once — gas-lamps soft amber, centerpiece glow as one dominant saturated accent, 3+ apparatus glows as secondary accents in different colors, electrical phenomenon arcing in another color. The room is a rainbow of saturated glow.

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

Steampunk-coded — steam-curls from open valves, copper-pipe condensation, ozone-mist around electrical apparatus, dust-of-ages in shaft-of-light, smoke from gas-lamps, vapor curling from active experiments. The vapor catches the multi-colored glow from nearby experiments.

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ MOVIE-POSTER CRANK MANDATE — APPLY TO EVERY RENDER ━━━
This is NOT a still photograph — this is a MOVIE-POSTER PROMOTIONAL FRAME from a feature film about a mad-scientist's laboratory. Render as if this image will sell the film. Apply ALL of:

  1. THEATRICAL RIM-LIGHTING — single dramatic key-light source (the centerpiece's glow OR Tesla-arc OR shaft of moonlight through the arched glass ceiling) carves the lab apparatus into mythic silhouettes. Rim-light on every brass edge, on glass curves, on the scientist's coat if rolled.
  2. EVERY QUADRANT INTENTIONAL — each quadrant has its own striking glowing element. Top-left: arched-ceiling drama (Tesla-arc / vaulted-brass / leaded-glass dome with stars). Top-right: another (hanging brass-chandelier / overhead pipe-rigging / second-story balcony with glowing vials). Bottom-left: foreground apparatus (close-detail brass instrument / glowing potion-vessel close to camera). Bottom-right: ditto (sigil-circle / workbench corner / glowing crystal). NEVER an empty quadrant.
  3. OBSESSIVE MATERIAL DETAIL — every brass fitting catches a different reflection, every glass curve shows the apparatus inside, every wooden surface shows grain, every glowing-liquid has visible swirl/vapor/condensation, every spark of electricity branches with multi-arc detail, every gas-lamp shows mantle-glow + wick + reflective brass.
  4. STORYTELLING BEAT — the frame tells a story mid-action. An experiment is ACTIVELY HAPPENING: liquid bubbling, vapor rising, Tesla-arcs frozen mid-discharge, sigil-circles pulsing mid-incantation, a beaker just spilled mid-pour, a notebook open on the workbench mid-equation. NEVER a static empty lab — always a frozen instant of mad-science IN PROGRESS.
  5. ATMOSPHERIC HAZE WITH VOLUMETRIC LIGHT — gas-lamp light slices through ozone-mist / steam-curls / electrical-ionization-haze in visible god-rays. AIR has saturation and depth. Multi-colored glow bleeds INTO the surrounding atmosphere — emerald haze near the green vessel, pink haze near the sigil, electric-blue ionization near the Tesla-coil.
  6. SATURATED MULTI-COLOR JEWEL-TONE PALETTE WITH DEEP-SHADOW CONTRAST — rich emerald + hot-pink + electric-blue + amber + violet jewel-tones blazing against deep mahogany shadow and inky brass-velvet darkness. The contrast is DRAMATIC — saturated lights against absolute dark. NEVER washed-out, NEVER pastel, NEVER muted.
  7. CINEMATIC FEATURE-FILM PRODUCTION DESIGN — feels like a still from a tentpole feature film. Production design polish. Every prop placed deliberately. Every shelf curated. Every detail intentional. NOT amateur, NOT empty, NOT undesigned.
  8. ESTABLISHING-SHOT DRAMA — the kind of wide cinematic shot that opens a film and makes the audience GASP at the mad-science world they're about to enter. Frankenstein-castle-lab-reveal / Doc-Brown's-DeLorean-garage-pull-back / Bioshock-Rapture-establishing-shot / Tesla-Wardenclyffe-entrance energy.

━━━ STRUCTURE (write the prompt in this order for best results) ━━━
[OPENING: a wide cinematic interior establishing-shot of a soaring steampunk mad-science laboratory PACKED WITH MULTI-COLORED GLOWING EXPERIMENTS — name the colors: emerald + electric-blue + hot-pink + amber + violet all visible], [the centerpiece experiment glowing dramatically in the midground], [the electrical phenomenon if rolled — Tesla arcs / plasma-glow], [the three apparatus details around the room — each in a DIFFERENT glow color from the centerpiece], [the scientist figure if rolled — TINY scale-prover at midground edge], [foreground tactile detail with rim-light], [lighting fills the room — gas-lamps + multi-color experiment glow + theatrical key-light], [atmospheric vapor / steam / ozone in volumetric god-rays], [color palette and mood]

CRITICAL — every render is a MOVIE-POSTER PROMOTIONAL FRAME. MAD-SCIENCE GLOWING CHAOS in 4+ DIFFERENT COLORS. Every quadrant intentional. Story mid-action. Saturated jewel-tones against deep shadow. The kind of shot that opens a feature film.

Output ONLY the raw 120-160 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
  },


  STEAMBOT_STEAMPUNK_SCENE: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, character, landscape, surprise_element, event } = slots;

    const eventSection = event
      ? `
━━━ STORY EVENT — render this happening in the scene ━━━
${event}

A specific dramatic event unfolding in the world — render it as a visible secondary focal point (NOT eclipsing the character, but charging the scene with story). NEVER combat / NEVER violence — atmospheric drama only.

`
      : '';

    return `You are a cinematic concept-painter writing a STEAMPUNK SCENE composition for SteamBot — a single role-based steampunk character integrated into a wildly imaginative Victorian-industrial landscape. Prestige feature-film concept-render polish, rich production design, photoreal physical light + materials.

━━━ THE LANDSCAPE IS A CO-HERO — NON-NEGOTIABLE ━━━
The steampunk landscape commands 50-70% of the frame visual weight. The character occupies 15-25% of frame vertically as a STORY-ANCHOR — not the dominant subject. The viewer's eye drinks in the world FIRST, then finds the figure within it. The landscape is wildly imaginative, impossible, jaw-dropping Victorian-industrial — gear-waterfalls / clockwork-cathedrals / floating-metropolises / mechanical-jungles / brass-canyons.

━━━ THE CHARACTER ━━━
${character}

Render the character with crisp identity detail — period-accurate Victorian-industrial costume, role-readable silhouette, captured in a candid moment inside the world. Solo (one figure only). NOT posing for camera. NOT a hero-stance.

━━━ THE LANDSCAPE (the wildly imaginative steampunk world) ━━━
${landscape}

Render the landscape with OBSESSIVE Victorian-industrial detail and depth-on-depth — FOREGROUND tactile detail near the character (brass railing / cobblestone / pipework she's-or-he's beside) → MIDGROUND the landscape body and the character within it → DEEP DISTANCE the wider world receding into atmospheric haze. The landscape feels lived-in, impossibly real, monumental.

━━━ SURPRISE ELEMENT — secondary subject adding story ━━━
${surprise_element}

Place at midground or deep distance — a small detail implying the wider world (distant airship / mechanical creature / signal-tower / sky-passenger). NEVER eclipsing the character or competing with the landscape.
${eventSection}
━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ OBSESSIVE STEAMPUNK CRAFTSMANSHIP — NON-NEGOTIABLE ━━━
Every gear, rivet, pipe, valve, pressure-gauge, polished-brass-surface, copper-patina-detail rendered with MAXIMUM detail. Warm brass + copper + bronze + oiled-wood DOMINANT palette. Surface density everywhere. NEVER sparse, NEVER minimal.

━━━ COMPOSITION ━━━
Wide cinematic establishing-shot. Character at 15-25% of frame vertically — IN the landscape, INTERACTING with it. NEVER tight character close-up. NEVER pulled-back-to-tiny-silhouette. Sweet spot: character readable but clearly a story-anchor in a world that surrounds them. Three-quarter angle or side profile preferred.

━━━ HARD BANS ━━━
- NO tight character close-up (character is NOT the dominant subject — landscape is the co-hero)
- NO modern objects (this is 1890s impossible-engineering)
- NO substituting your own descriptions for the pool entries — render what's locked
- NO decorative cliché framing (gears/clocks pasted at the edges as decoration)
- NO combat / NO violence — the event slot is atmospheric drama, not battle

━━━ STRUCTURE (write in this order) ━━━
[OPENING: a wide cinematic shot of [character] in [landscape]], [the landscape with OBSESSIVE detail + depth + atmospheric layers], [the character integrated into the world at story-anchor scale], [surprise element at midground], [event if rolled], [lighting + atmosphere], [color palette + mood]

CRITICAL — the OPENING tokens establish the LANDSCAPE as the canvas with the character as the story-anchor. The world surrounds them.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
  },

  STEAMBOT_STEAMPUNK_CURIO: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, curio, habitat, ornate_flourish } = slots;
    const flourishes = Array.isArray(ornate_flourish) ? ornate_flourish : [ornate_flourish];

    return `You are a cinematic illustration painter writing a STEAMPUNK CURIO scene for SteamBot — a single ANIMATE little steampunk robot creature in an IMMERSIVE Victorian-industrial habitat. The creature is the HERO of the frame; the habitat is its lived-in environment, NOT a museum display.

━━━ CREATURE IS THE HERO — NON-NEGOTIABLE ━━━
The animate robot creature fills 40-60% of the frame as the primary subject. Composition is creature-in-environment — the camera caught it in its world. The viewer's eye lands on the ROBOT CREATURE first, with the steampunk habitat wrapping around it.

━━━ ALIVE IN MOTION — NON-NEGOTIABLE ━━━
The curio is a STEAMPUNK ROBOT — a little mechanical creature mimicking a real living thing (animal / insect / bird / sea-creature) OR a novel mechanical organism (chimera / impossible-anatomy / abstract-animate-form). ALWAYS rendered in a moment of motion / animation / alive-looking pose. Mid-stalking / mid-fluttering / mid-feeding / mid-step / mid-curl / wings half-spread / breathing visibly through chest-bellows / eyes tracking. The viewer feels it could move at any second. NEVER static-decorative, NEVER frozen-pose. Articulated joints visibly active. Internal mechanisms (gears / springs / pistons / clockwork-heart) visibly working.

━━━ NEVER JEWELRY / CROWN / CLOCK / DECORATIVE-OBJECT — ABSOLUTE ━━━
NO crowns, NO tiaras, NO jewelry / brooches / pendants / necklaces, NO Faberge eggs, NO clocks / pocket-watches / chronographs as subject, NO monocles, NO ceremonial cups / decorative vases, NO weapons, NO scrolls / books. The curio is ALWAYS a mechanical creature / organism — never an ornamental object.

━━━ NEVER MUSEUM-DISPLAY FRAMING — ABSOLUTE ━━━
NO museum vitrines, NO Sotheby's-catalog backdrops, NO velvet-cushion pedestals, NO glass bell-jars, NO neutral catalog paper, NO "displayed on" / "presented on" framing. The creature is in a LIVED-IN STEAMPUNK SPACE — not on display. The habitat surrounds it.

━━━ NO PRIMARY HUMAN FIGURE ━━━
NO people, NO hands, NO faces. Pure creature-in-environment portrait. The robot creature stands alone in its habitat.

━━━ THE CURIO (the hero creature) ━━━
${curio}

Render the creature with OBSESSIVE Victorian-industrial detail — every brass rivet, every gear-tooth, every articulation-joint, every glass-eye, every leather-strap, every clockwork-mechanism visible. Captured at a loaded instant of motion.

━━━ THE HABITAT (the lived-in steampunk environment) ━━━
${habitat}

Render the habitat with depth-on-depth — FOREGROUND tactile detail near the creature (workbench surface / book-spine / brass railing / instrument it's perched on) → MIDGROUND surrounding props (tools, books, plants, glassware) → DEEP DISTANCE the wider room receding into atmospheric haze. The space feels lived-in, functional, real — not a display.

━━━ ORNATE FLOURISHES — render ALL THREE on the object ━━━
- ${flourishes[0] || ''}
- ${flourishes[1] || ''}
- ${flourishes[2] || ''}

These are micro-details that obsessively saturate the object's surface. EVERY one must be visible.

━━━ LIGHTING ━━━
${lighting}

Lighting is environmental — the habitat's natural light source (gas-lamp / candlelit / sunlit through glass / forge-red glow / moonlit / amber lamp-pool) catches the creature's metallic surfaces. Cinematic but not museum-spotlit.

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ OBSESSIVE STEAMPUNK CRAFTSMANSHIP — NON-NEGOTIABLE ━━━
Brass + copper + bronze + oiled-wood + glass dominant. Every visible surface is hand-tooled, hand-engraved, hand-fabricated. NEVER mass-produced-looking. NEVER plastic. NEVER modern.

━━━ COMPOSITION ━━━
Creature-in-environment cinematic framing. The CREATURE centered or slightly offset, mid-motion. Habitat wraps around and behind — foreground tactile prop near the creature → midground surrounding environment → deep distance receding into atmospheric haze. NEVER a tight close-up that crops the creature. NEVER a wide-shot where the creature becomes small. Sweet spot: creature reads at clear scale with the lived-in steampunk world grounding it.

━━━ HARD BANS ━━━
- NO primary human figure (no people, no hands, no faces)
- NO modern objects (no plastic, no LEDs, no electronics — this is 1890s impossible-engineering)
- NO substituting your own descriptions for the pool entries — render what's locked
- NO decorative cliché framing (gears/clocks pasted at the edges as decoration)

━━━ STRUCTURE (write the prompt in this exact order) ━━━
[OPENING: the curio described with obsessive detail — the OBJECT first], [the three ornate flourishes worked in], [the display register / display context], [lighting], [atmospheric detail], [color palette + mood]

CRITICAL — the OPENING tokens establish the OBJECT as the hero. The display context wraps the lower frame. The atmosphere adds Wunderkammer mood without competing with the object for attention.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
  },

  STEAMBOT_AIRSHIP_SKIES: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, scene, sky_layer, surprise_element, phenomenon } = slots;

    const phenomenonSection = phenomenon
      ? `
━━━ ATMOSPHERIC PHENOMENON — render this visibly in the sky ━━━
${phenomenon}

A sky-event happening in the world around the vessel — render it as a visible secondary focal point (NOT eclipsing the airship, but amplifying the drama). Adds awe and scale to the frame.

`
      : '';

    return `You are a cinematic concept painter writing a MOVIE-POSTER AIRSHIP SKIES scene for SteamBot — Victorian-industrial dirigibles, sky-galleons, packet-ships, sky-clippers, gun-ships caught in vertigo-inducing dramatic sky moments. Mortal-Engines / Treasure-Planet / Howl's-Moving-Castle / Last-Exile / Atlantis-lost-empire / Skies-of-Arcadia / Final-Fantasy-airship-cutscene visual lineage. The frame should make the viewer GASP at the scale and beauty.

━━━ MOVIE-POSTER MANDATE — STACK 3+ STRIKING ELEMENTS ━━━
Every render is a MOVIE POSTER PROMOTIONAL FRAME — every quadrant has something striking. Stack 3+ simultaneously-visible elements:
  1. THE AIRSHIP (or fleet) at vertigo-inducing scale — multi-tier depth mandatory
  2. SKY LAYER dominating its quadrant (cloud bank / storm front / aurora / twin moons / sunset blaze)
  3. ATMOSPHERIC PHENOMENON if rolled (lightning / meteor / sky-eddy / magnetic-storm / cloud-cascade)
  4. SECONDARY SUBJECT giving scale (distant vessel / mooring tower / cliff-top lighthouse / sky-island)
  5. SATURATED THEATRICAL LIGHT (golden-hour rim / lightning underglow / sunset blaze / dawn copper-and-amber)

━━━ NO CHARACTERS — ABSOLUTE ━━━
NO primary human figure. Tiny crew silhouettes visible on deck or in rigging are OK as scale-provers (pinprick scale only) — never foreground characters, never named figures, never a hero-pose.

━━━ VICTORIAN-INDUSTRIAL VESSEL DETAIL — NON-NEGOTIABLE ━━━
The airship rendered with OBSESSIVE Victorian-industrial detail — riveted brass hull plating, copper-clad gondolas, ribbed envelope panels, exposed steam-pipework, brass propellers and turbines, gaslit ship-windows glowing amber, weathered wood-decking, brass mooring-rings, ornate prow figureheads, glass-domed observation lounges, paddle-wheels and balloon-rotors. NEVER modern aircraft, NEVER spaceships, NEVER pure-fantasy fae-ships. 1890s-impossible-engineering aesthetic.

━━━ THE AIRSHIP SCENE (the hero frame — vessel + scene context) ━━━
${scene}

Render the vessel as DESCRIBED with depth-on-depth — FOREGROUND tactile detail (envelope fabric / brass railing / propeller-blade-edge) → MIDGROUND the vessel body + immediate sky → DEEP DISTANCE the wider sky-world with atmospheric layers.

━━━ SKY LAYER (the world overhead and around) ━━━
${sky_layer}

The sky is HALF the painting. Render it with painterly atmospheric depth — multi-tier cloud layers, sunset gradients, weather fronts, light-shafts breaking through, distant horizons.
${phenomenonSection}
━━━ SURPRISE ELEMENT — secondary subject adding story ━━━
${surprise_element}

Place at midground or deep distance — a small detail implying the wider sky-world (distant dirigible silhouette / mooring spire / sky-island / lighthouse-rock / vessel debris / migrating creatures). NEVER eclipsing the hero ship.

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION ━━━
Wide cinematic sky frame — vessel occupies 30-50% of frame as the hero subject. Multi-tier depth: FOREGROUND tactile vessel detail / brass-rail / propeller / mooring line → MIDGROUND the airship body in full glory → DEEP DISTANCE the sky-world receding into atmospheric layers. NOT a tight close-up on hull rivets. NOT a tiny silhouette in distant landscape. Sweet spot: airship reads at clear scale with the sky-world wrapping around it. THINK movie-poster establishing shot — every quadrant earning its space.

━━━ HARD BANS ━━━
- NO primary human figure in frame (tiny crew silhouettes OK at scale-prover scale only)
- NO modern aircraft / NO spaceships / NO pure-fantasy fae-ships
- NO ground / city / harbor as primary subject — this is a SKY scene
- NO decorative cliché framing (clocks/gears pasted at frame edges)
- NO substituting your own descriptions for the pool entries

━━━ STRUCTURE — write the prompt in this exact order ━━━
[OPENING: "[airship scene from the scene slot — the hero vessel + its immediate context]"], [the SKY LAYER from the sky slot dominating background], [PHENOMENON if rolled, rendered as visible drama], [SURPRISE ELEMENT at midground or deep distance], [lighting + atmosphere], [color palette + mood]

CRITICAL — the OPENING tokens establish the airship as the hero. The sky-world wraps around it. Every quadrant of the frame has something striking. THINK Mortal-Engines or Treasure-Planet establishing shot.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
  },

  // BloomBot landscape — NOT IN USE 2026-05-16 (migration attempted + REVERTED;
  // legacy compose.js outperforms). Template preserved for reference / future
  // re-attempt. See memory file project_bloombot_landscape_kept_legacy.md.
  BLOOMBOT_LANDSCAPE: ({ slots, sharedDNA, vibeDirective }) => {
    const { landform, scale_prover, surprise_element, sky, phenomenon } = slots;
    const phenomenonSection = phenomenon
      ? `\n━━━ ATMOSPHERIC PHENOMENON — render visibly ━━━\n${phenomenon}\n\n`
      : '';
    return `You are a fine-art floral landscape painter writing AWE-INDUCING SCENE DESCRIPTIONS for BloomBot. Output is a 70-100 word comma-separated phrase string for Flux.

━━━ NO PEOPLE — ABSOLUTE FIRST RULE ━━━
NO humans, NO figures, NO silhouettes. (Tiny scale-prover wildlife OK.)

━━━ THE BLOOM-CARPET IS THE HERO ━━━
The LANDFORM is the canvas, the BLOOMS are the hero. Multi-tier scale.

━━━ LANDFORM ━━━
${landform}

━━━ SCALE-PROVER ━━━
${scale_prover}
${phenomenonSection}━━━ SKY ━━━
${sky}

━━━ SURPRISE ELEMENT ━━━
${surprise_element}

━━━ PALETTE ━━━
${sharedDNA.palette}

━━━ FLOWER SPECIES ━━━
${sharedDNA.roster}

━━━ LIGHTING ━━━
${sharedDNA.lighting}

━━━ MOOD ━━━
${vibeDirective.slice(0, 200)}

Output 70-100 words. Comma-separated phrases. NO headers, NO bullets. Just the prose.`;
  },

  // BloomBot closeup — MACRO VIEW pressing into a dense bloom wall in its
  // natural outdoor environment. 2026-05-16 R4 (locked): heart-DNA from
  // cf57b7eb + shape-agnostic hero + 8 poster-grade composition modes.
  BLOOMBOT_CLOSEUP: ({ slots, sharedDNA, vibeDirective }) => {
    const { bloom_wall_type, growing_context, macro_phenomenon } = slots;

    const phenomenonSection = macro_phenomenon
      ? `
━━━ MACRO MAGIC MOMENT — render visibly in the foreground ━━━
${macro_phenomenon}

`
      : '';

    return `You are a fine-art floral macro painter writing JEWEL-TONE CLOSEUP scene descriptions for BloomBot. Output is an 85-115 word comma-separated phrase string for Flux. NO preamble, NO labels — just the prose.

━━━ ABSOLUTELY FORBIDDEN ━━━
• cut flowers, bouquet, arrangement, vase, basket
• dark studio backdrop, neutral backdrop, "on a wooden surface"
• still-life, florist composition, table-top
• picked flowers, gathered stems, harvested blooms, freshly-cut
• humans, figures, faces, silhouettes, hands holding flowers

━━━ REQUIRED — MACRO VIEW pressing INTO living blooms GROWING IN PLACE ━━━
A macro closeup pressing INTO a dense bloom wall in its NATURAL OUTDOOR ENVIRONMENT. Stand close enough to count petals on the front-most blooms; shallow focal plane; bloom-mass fills frame edge-to-edge receding into softly-blurred bokeh. NEVER a dark photo studio.

━━━ HERO BLOOM AMONGST MANY — NON-NEGOTIABLE COMPOSITION ━━━
ONE specific HERO species DOMINATES the frame at its OWN natural form and scale. Hero silhouette is whatever the rolled species naturally is — broad face, deep cup, pompom dome, hanging raceme, umbel, trumpet, ruffled rosette, daisy-face, or tall spike. The hero pushes into the foreground focal plane. The other 2-3 species act as SUPPORTING CAST at SMALLER visual weight — carpeting gaps, threading through, drifting in midground softness — NEVER competing with the hero.

⚠️ CRITICAL — DO NOT default the hero to tall spires / vertical towers / tall spike-shaped blooms every render. Vary by what the rolled roster offers:
  • Broad-faced (peony / dahlia / sunflower / gerbera / cosmos / poppy) → FACE fills foreground
  • Deep-cup (tulip / magnolia / lotus / crocus) → CUP-MOUTH dominates, light pools inside
  • Pompom / dome (allium / hydrangea / dahlia / chrysanthemum) → round mass as sphere of florets
  • Hanging cluster (wisteria / fuchsia / bleeding-heart / orchid) → pendant blooms AT viewer level
  • Umbel (queen-annes-lace / agapanthus) → parasol-cluster fills foreground
  • Trumpet (lily / daffodil / morning-glory / brugmansia) → open trumpet-mouth frontal
  • Tall spike (foxglove / delphinium / lupine / snapdragon) → spires rise ONLY when species naturally is

━━━ DRAMATIC LIGHTING HIERARCHY — WARM HERO / COOL BACKGROUND ━━━
SINGLE DOMINANT light source catches HERO blooms WARM in foreground; supporting cast and receding bloom-mass sit COOLER ambient or BLUE-SHADOW. NEVER flat even illumination. NEVER cool-on-cool or warm-on-warm.

━━━ MOVIE-POSTER COMPOSITION — POSTER-GRADE FRAMING ━━━
Every render is POSTER-GRADE. Every quadrant earns its space, eye lands on 4+ striking details, framing feels INTENTIONAL. NEVER a flat eye-level center snapshot.

Pick ONE framing mode per render (vary):
  A. LOW-ANGLE HERO — hero blooms rising into upper frame from strong lower anchor
  B. OVERHEAD CANOPY — looking UP at hanging blooms, pendant clusters at viewer level
  C. THROUGH-THE-ARCHWAY — natural archway from bloom-wall structure framing the opening
  D. DIAGONAL LEAD-LINE — supporting threads as diagonal lead-line to hero at rule-of-thirds
  E. RIM-LIGHT SILHOUETTE-EDGE — hero back-lit at frame edge with translucent petal-glow
  F. SHALLOW DEPTH TUNNEL — front hero in razor focus, mass receding into deep bokeh
  G. OFF-CENTER HERO + NEGATIVE SPACE — hero at rule-of-thirds, opposite quadrant bokeh-quiet
  H. DAPPLED LIGHT-DRAMA — broken light through canopy, hero catching sun-spots

━━━ MATERIAL POETRY at petal-scale ━━━
"Petals countable and cold to the touch", "waxy surfaces catching slanted light", "pollen-dust on the anthers", "fine fuzz on stems", "dew-beads on leaves", "stamen-shadows on petals", "translucent veining lit from behind".

━━━ THE BLOOM-WALL ━━━
${bloom_wall_type}

━━━ THE GROWING CONTEXT ━━━
${growing_context}
${phenomenonSection}━━━ COLOR PALETTE — STRICT ━━━
${sharedDNA.palette}

━━━ FLOWER SPECIES — STRICT ━━━
${sharedDNA.roster}

Pick 3-4 species from the roster — ONE as HERO, others as SUPPORTING CAST. Mass them at the palette's named colors.

━━━ LIGHTING ━━━
${sharedDNA.lighting}

━━━ DEFAULTS TO RESIST ━━━
- NO pink/rose/blush/coral as dominant palette unless palette names it
- NO roses/peonies/hydrangeas/lavender unless in the roster
- NO "studio backdrop", "dark background", "isolated against"
- NO equal-weight species — there IS a hero

━━━ MOOD ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write in this exact order ━━━
[poster-grade composition mode], [macro closeup pressing INTO [bloom-wall type] where [HERO SPECIES] dominates at its OWN natural silhouette], [supporting species carpeting/threading], [growing context implied through blur], [warm-hero/cool-background lighting]${macro_phenomenon ? ', [the macro magic moment as a specific small detail]' : ''}, [material poetry at petal-scale]

CRITICAL — establish POSTER-COMPOSITION + HERO + SUPPORTING CAST. NEVER "a bouquet of" or "an arrangement". NEVER a flat eye-level garden photo. Hero shape follows the rolled species — DO NOT default to tall spires.

Output ONLY 85-115 words. Comma-separated. NO preamble, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose.`;
  },

  // BloomBot tropical-paradise — DENSE TROPICAL JUNGLE FLORAL SCENE.
  // Wide cinematic depth-recession, humid atmospheric perspective, massive
  // showy tropical flowers (torch ginger / heliconia / plumeria / jade vine
  // / orchid / bird-of-paradise) at jungle scale. Region locked to tropical
  // via BloomBot.rollSharedDNA. 2026-05-16 R1.
  BLOOMBOT_TROPICAL_PARADISE: ({ slots, sharedDNA, vibeDirective }) => {
    const { tropical_setting, vegetation_anchor, surprise_creature } = slots;

    const creatureSection = surprise_creature
      ? `
━━━ SURPRISE CREATURE — render at peripheral scale ━━━
${surprise_creature}

The creature is SMALL relative to the scene — never the primary subject. Place at midground or deep distance as a scale-prover / second-look reward.

`
      : '';

    return `You are a fine-art tropical landscape painter writing JUNGLE-SCENE descriptions for BloomBot. Output is an 85-115 word comma-separated phrase string for Flux. NO preamble, NO labels — just the prose.

━━━ NO PEOPLE — ABSOLUTE FIRST RULE ━━━
NO humans, NO figures, NO silhouettes, NO shadows of people, NO travelers, NO explorers. The jungle is the subject. (Small wildlife — toucan / butterfly / poison-frog / monkey / iguana — only when the surprise_creature slot calls for it.)

━━━ TROPICAL PARADISE — NON-NEGOTIABLE ━━━
This is a TROPICAL PARADISE scene — beach + lagoon + coastal cove + waterfall pool + atoll + rainforest + cloud-forest are ALL valid registers. RENDER WHATEVER THE SETTING SLOT BELOW NAMES — if the setting is a palm-fringed white-sand beach, that's the scene; if it's a turquoise lagoon, that's the scene; if it's a rainforest understory, that's the scene. The setting is identifiably tropical — palms / coconut grove / hibiscus / plumeria / frangipani / banana / banyan / heliconia / sea-grass / mangrove / ferns / moss / vines, plus open water / coastal sand / atoll edge when called for. Wide cinematic shot showing DEPTH: foreground saturated and crisp, midground softening, deep distance hazed (humid jungle haze OR salt-haze over open water OR mist around waterfalls). This is NEVER a temperate meadow, NEVER an alpine landscape, NEVER a desert, NEVER an urban scene.

━━━ MASSIVE SHOWY TROPICAL FLOWERS — THE HERO ━━━
The flowers are MASSIVE and SHOWY at tropical-paradise scale — torch ginger, heliconia, plumeria, jade vine cascades, cattleya orchid, bird-of-paradise (strelitzia), passion-flower, anthurium, hibiscus, frangipani, ylang-ylang, bougainvillea, plumeria cascade, lotus, water-lily. Use the roster's named species — never generic "tropical flowers". The blooms dominate the foreground at saturated, vivid scale; supporting blooms thread through the vegetation behind or carpet the coastal sand or ring the lagoon edge.

━━━ THE TROPICAL SETTING (the biome canvas) ━━━
${tropical_setting}

━━━ THE VEGETATION ANCHOR (the paradise scaffolding) ━━━
${vegetation_anchor}

The vegetation scaffolds the bloom hero — palms / banana / banyan / philodendron / ferns / vines / hibiscus / plumeria / sea-grape / mangrove — never replacing the blooms as the subject, but giving the paradise its identifiable structure.
${creatureSection}━━━ TROPICAL ATMOSPHERIC PERSPECTIVE ━━━
Foreground saturated and crisp, midground progressively softening, deep distance hazed. The TYPE of atmospheric haze MATCHES the setting: jungle scenes have humid green mist with beaded condensation on broad leaves; beach/coast/lagoon scenes have warm salt-haze over open water + turquoise-blue depth-recession; waterfall scenes have spray-mist clouding the lower frame. NEVER dry / NEVER clear-air / NEVER alpine.

━━━ POSTCARD / MOVIE-STILL / GALLERY-PIECE COMPOSITION — NON-NEGOTIABLE ━━━
Every render is a POSTCARD-WORTHY / MOVIE-STILL / GALLERY-PIECE shot. Every quadrant earns its space, the eye lands on 4+ striking details, the framing feels DELIBERATE the way a fine-art print or magazine cover does. NEVER a flat eye-level center-of-frame snapshot. The viewer should GASP / stop mid-scroll / want to save the image / want to print and frame it.

Pick ONE deliberate framing mode per render (vary across them — match the framing to whatever the setting slot describes):
  A. **PALM-FRINGED BEACH WIDE** — palm-fringed white-sand beach in golden-hour light with bloom-laden coastal vegetation at one frame edge, turquoise water filling the open frame, distant island silhouette
  B. **LAGOON-EDGE REFLECTION** — turquoise lagoon foreground with bloom-laden inner shore reflecting in the still water, distant coastal cliff or atoll edge in soft salt-haze
  C. **WATERFALL-PLUNGE-POOL** — tropical waterfall plunging into a bloom-ringed pool, bloom-laden mossy boulders at viewer level, spray-mist rising
  D. **CANOPY-LIGHT SHAFTS** — vertical sun-shafts cutting through rainforest canopy onto specific bloom patches below
  E. **POOL-EDGE REFLECTION** — jungle pool or stream foreground reflecting bloom-laden canopy above
  F. **THROUGH-THE-VINE-CURTAIN** — natural archway from hanging vines and lianas framing a clearing beyond
  G. **BANYAN-ROOT TUNNEL** — banyan / strangler-fig root-curtain in foreground framing the deep scene beyond
  H. **CLIFF-ABOVE-LAGOON** — volcanic-island cliff descending to turquoise water below, bloom-laden cliff-edge
  I. **MANGROVE-TIDAL** — mangrove tidal-swamp with floating blooms and stilt-roots
  J. **BROAD-LEAF-OVERHEAD** — broad banana / heliconia / philodendron leaves arching overhead, bloom-floor below
  K. **TIDE-POOL EDGE** — tropical tide-pool foreground with reflected sky, bloom-clusters massing at the rock-edge behind, ocean horizon line in distance
  L. **COVE OVERLOOK** — overlook of a hidden tropical cove ringed by bloom-cliffs, turquoise water below, palms at the rim

DELIBERATE COMPOSITION CRAFT:
- Rule-of-thirds: hero element at a rule-of-thirds intersection, not centered (unless intentional symmetry like a path leading dead-center)
- Lead-lines: path / stream / palm-trunk / wave-line / vine-curtain pulling the eye INTO the deep frame
- Multi-tier depth: tactile foreground detail (bloom cluster / wet sand / petal-strewn path / dew-beaded leaf) → midground scene → deep distance hazed
- Intentional negative space: one quadrant has bokeh-quiet / salt-haze / sky-glow breathing room as counterweight to the bloom-dense quadrant
- Light hierarchy: warm hero blooms in golden / amber / rim light, cooler ambient / blue shadow in the deep distance
- Depth recession: foreground saturated and crisp, midground softening, deep distance progressively hazed

THINK Hawaiian / Tahitian / Bali / Maldivian / Polynesian fine-art tropical photography + Avatar Way-of-Water establishing shots + Planet Earth tropical-coast slow-zoom-out + Endless Summer cinematography (without surfers) + Princess Mononoke ocean + Roger Deakins tropical wides + National Geographic cover shots + travel-magazine fine-art prints. Every render = the COVER SHOT, not a snapshot. The kind of image someone would print poster-size and hang on a wall.

━━━ COLOR PALETTE — STRICT ━━━
${sharedDNA.palette}

Render the palette EXACTLY as named — those are the only colors in the scene. The deep-green humid tropical ambient is the foundation; the named bloom colors overlay.

━━━ FLOWER SPECIES — STRICT TROPICAL ROSTER ━━━
${sharedDNA.roster}

Use the actual species names. Pick 3-4 species that fit the palette — ONE as HERO at MASSIVE jungle scale, the others as SUPPORTING CAST threading through the vegetation. Mass them at the palette's named colors.

━━━ LIGHTING ━━━
${sharedDNA.lighting}

━━━ DEFAULTS TO RESIST ━━━
- Do NOT default to pink / rose / blush as the dominant palette unless the palette names it.
- Do NOT default to "soft pastels" / "cottagecore" / "english garden" — this is JUNGLE.
- Do NOT show people, hands, figures, silhouettes.
- Do NOT use temperate / alpine / desert / arctic vocabulary.
- Do NOT skip the humid-haze depth recession — it's the tropical signature.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write in this exact order ━━━
[wide cinematic framing mode (canopy-shafts / pool-reflection / vine-archway / banyan-tunnel / cliff-lagoon / waterfall / mangrove / broad-leaf-overhead)], [the tropical setting + vegetation anchor establishing the dense jungle], [3-4 named tropical species in the palette colors with HERO + SUPPORTING distribution], [humid atmospheric perspective with foreground saturated and deep distance hazed]${surprise_creature ? ', [surprise creature at peripheral scale]' : ''}, [lighting bringing the canopy + bloom-mass to life]

CRITICAL — every render reads as TROPICAL JUNGLE — palms / banana / banyan / ferns visible, humid haze depth-recession, massive showy named tropical blooms. NEVER temperate, NEVER alpine, NEVER desert.

Output ONLY 85-115 words. Comma-separated phrases. NO preamble, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose, starting with the framing + setting.`;
  },

  // BloomBot cozy — COZY INTERIOR OVERGROWN BY FLOWERS. Warm humble
  // domestic space (NOT palace/ballroom). HERO bloom + supporting cast
  // composition, warm/cool light hierarchy, POSTCARD/GALLERY framing,
  // material poetry. 2026-05-16 R1.
  BLOOMBOT_COZY: ({ slots, sharedDNA, vibeDirective }) => {
    const { interior_setting, furniture_anchor, atmospheric_moment } = slots;

    const momentSection = atmospheric_moment
      ? `
━━━ ATMOSPHERIC MOMENT — render visibly ━━━
${atmospheric_moment}

This is the "warm magic moment" detail that elevates the cozy scene — render as a specific small element in the foreground or focal plane.

`
      : '';

    return `You are a fine-art interior painter writing COZY-OVERGROWN-ROOM scene descriptions for BloomBot. Output is an 85-115 word comma-separated phrase string for Flux. NO preamble, NO labels — just the prose.

━━━ NO PEOPLE — ABSOLUTE FIRST RULE ━━━
NO humans, NO figures, NO silhouettes, NO shadows of people, NO hands. The empty cozy room is the subject — its absent owner felt only through tactile signs (a teacup, a half-finished page, a draped quilt). Wildlife (curled cat / sleeping dog / songbird at the window) ONLY when the atmospheric_moment slot calls for it.

━━━ COZY = WARM HUMBLE DOMESTIC — NON-NEGOTIABLE ━━━
This is a WARM HUMBLE DOMESTIC space — sunroom / breakfast nook / writing desk / arched window seat / attic dormer / stairwell landing / kitchen corner / fireside reading chair / window-side bed. NEVER a palace, NEVER a ballroom, NEVER a grand interior, NEVER a cathedral, NEVER a corporate / hotel / commercial interior. Think: someone's beloved home that the garden has consumed.

━━━ FLOWERS BLANKETING / CASCADING / CONSUMING — THE HERO ━━━
The flowers DOMINATE half the frame. They CASCADE from the ceiling, CLIMB the walls, DRAPE across furniture, FILL every vase + jug + bowl. Vines in profusion across every horizontal and vertical surface. The interior architecture is visible and recognizable but the flowers are CLEARLY the dominant subject — the architecture is the framework / scaffold holding the bloom-mass up.

━━━ HERO BLOOM AMONGST MANY — NON-NEGOTIABLE COMPOSITION ━━━
ONE specific HERO species DOMINATES the foreground focal plane at its OWN natural form and scale — broad face, deep cup, pompom dome, hanging raceme, umbel, trumpet, ruffled rosette, daisy-face, or tall spike. Let the rolled species choose. The other 2-3 species act as SUPPORTING CAST cascading from the ceiling, threading through the furniture, filling the vases and jugs, draping over the windowsill. NEVER a uniform wall of equally-weighted blooms. HERO + SUPPORTING.

⚠️ DO NOT default the hero to "tall spires" or "vertical towers" every render — vary by what the rolled roster offers (broad face / cup / pompom / hanging / umbel / trumpet / spike).

━━━ DRAMATIC WARM LIGHT HIERARCHY — WARM HERO / COOL INTERIOR ━━━
Light pours in through the window at a dramatic angle (golden-hour rake, slanting morning shaft, late-afternoon amber, dappled curtain-broken light, single candle pool, lamp-glow). It catches the HERO blooms WARM in the foreground; the supporting cast and the rest of the room sit COOLER ambient or in soft shadow. The warm/cool split builds the visual hierarchy.

━━━ POSTCARD / MOVIE-STILL / GALLERY-PIECE COMPOSITION — NON-NEGOTIABLE ━━━
Every render is a POSTCARD-WORTHY / MOVIE-STILL / GALLERY-PIECE shot. Every quadrant earns its space, the eye lands on 4+ striking details, the framing feels DELIBERATE the way a fine-art print or magazine cover does. NEVER a flat eye-level center-of-frame snapshot. The viewer should GASP / want to save the image / want to print and frame it.

Pick ONE framing mode per render (vary):
  A. **THROUGH-THE-WINDOW** — interior foreground with bloom-laden windowsill, light pouring in, garden / sky / snow / forest beyond visible through the panes
  B. **DOOR-AJAR PEEK** — interior scene viewed from an open doorway, bloom-cascade in foreground framing the room beyond
  C. **CORNER-AT-REST** — quiet corner with the hero bloom-arrangement on a table or sill, anchored by one furniture piece, room receding into soft cooler shadow
  D. **READING-NOOK INTIMATE** — close on a reading chair / window-seat / bed with bloom-mass cascading down behind it, lap-detail like an open book / quilt / tea
  E. **OVERHEAD WINDOW BEAM** — vertical light-shaft from a tall window or skylight onto the bloom-arrangement, room around in cool ambient
  F. **STAIRWELL UPVIEW** — looking up a stairwell or balcony with hanging blooms cascading from the railing, light spilling from above
  G. **TEA-TABLE STILL-LIFE** — bloom-laden tea-table or breakfast-nook with china / teapot / open book / honey jar, garden visible through the window beyond
  H. **WRITING-DESK MOMENT** — writing desk with typewriter / quill / candle / open journal, bloom-mass cascading from a shelf above and a vase beside

━━━ MATERIAL POETRY — WARM DOMESTIC TEXTURES ━━━
"Sun-warmed wood floorboards", "faded quilt with hand-stitched seams", "moss-velvet armchair cushion", "fragrant tea steam rising from a chipped china cup", "candle-wax pooled on a brass holder", "sun-bleached linen curtains", "worn leather-bound book left open", "honey-amber afternoon light through dust motes", "single petal fallen on the windowsill". Render the front-plane blooms + furniture with material poetry.

━━━ THE INTERIOR SETTING ━━━
${interior_setting}

━━━ THE FURNITURE ANCHOR ━━━
${furniture_anchor}

The furniture anchors the scene as a structural element — never replaces the blooms as the subject. It catches the bloom-cascade and provides the tactile counterweight (the worn-wood / mossed-velvet / hand-stitched texture against the bloom softness).
${momentSection}━━━ COLOR PALETTE — STRICT ━━━
${sharedDNA.palette}

Render the palette EXACTLY as named — those are the only colors in the scene. The warm-amber domestic ambient is the foundation; the named bloom colors overlay.

━━━ FLOWER SPECIES — STRICT ━━━
${sharedDNA.roster}

Use the actual species names. Pick 3-4 species from the roster — ONE as HERO at the foreground focal plane, the others as SUPPORTING CAST. Mass them at the palette's named colors.

━━━ LIGHTING ━━━
${sharedDNA.lighting}

━━━ DEFAULTS TO RESIST ━━━
- Do NOT default to palace / ballroom / grand interior / cathedral / commercial — this is HUMBLE DOMESTIC.
- Do NOT default to pink / rose / blush / coral as the dominant palette unless the palette names it.
- Do NOT default to roses / peonies / hydrangeas / lavender unless they appear in the roster.
- Do NOT default to "cottagecore" / "shabby chic" / "tea garden" as descriptors — the cozy register is more soulful, more weathered, more lived-in.
- Do NOT render every species at equal weight — there IS a hero.
- Do NOT flatten the warm/cool light hierarchy — single dominant warm source + cool ambient.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write in this exact order ━━━
[postcard / gallery framing mode], [interior setting + furniture anchor establishing the warm humble domestic space], [HERO species dominating the foreground focal plane at its natural silhouette + supporting cascade cascading / threading / filling], [warm window-light catching the hero blooms in the foreground, supporting and room beyond in cooler ambient]${atmospheric_moment ? ', [the atmospheric moment as a specific small detail]' : ''}, [material poetry — sun-warmed wood, faded quilt, fragrant tea steam, worn leather]

CRITICAL — establish POSTCARD COMPOSITION + WARM HUMBLE DOMESTIC + HERO + SUPPORTING. NEVER palace / ballroom / grand. NEVER a flat eye-level snapshot. Hero shape follows the rolled species — DO NOT default to tall spires.

Output ONLY 85-115 words. Comma-separated phrases. NO preamble, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose, starting with the framing mode + the cozy interior + hero bloom.`;
  },

  // BloomBot dreamscape — SURREAL FLORAL DREAMSCAPE. Real earth species,
  // impossible composition, hyperreal/photoreal precision. Magritte /
  // Dali / Beksinski / Storm Thorgerson lineage. 2026-05-16 R1.
  BLOOMBOT_DREAMSCAPE: ({ slots, sharedDNA, vibeDirective }) => {
    const { impossibility_type, world_element, atmospheric_halo } = slots;

    const haloSection = atmospheric_halo
      ? `
━━━ ATMOSPHERIC HALO — render visibly as part of the impossibility ━━━
${atmospheric_halo}

This is the surreal-lighting / atmospheric magic element that amplifies the dreamscape's impossibility. Render as a visible quadrant-dominant detail.

`
      : '';

    return `You are a fine-art surrealist painter writing IMPOSSIBLE FLORAL DREAMSCAPE scene descriptions for BloomBot. Output is an 85-115 word comma-separated phrase string for Flux. NO preamble, NO labels — just the prose.

━━━ NO PEOPLE — ABSOLUTE FIRST RULE ━━━
NO humans, NO figures, NO silhouettes, NO floating bodies, NO faces. The dreamscape is empty of people — the flowers and the impossible-geometry world are the subject. (Tiny wildlife — a single butterfly mid-flight, a hummingbird against an upside-down sky — only when atmospheric_halo calls for it.)

━━━ SURREAL DREAMSCAPE — NON-NEGOTIABLE ━━━
This is a SURREAL FLORAL DREAMSCAPE — a physically IMPOSSIBLE composition rendered with HYPERREAL / PHOTOREAL precision. The render technique is fine-art-painting / photoreal — the IMPOSSIBILITY is in the LAYOUT, NOT in any "alien flower" detail. Treat it like a Magritte / Dali / Beksinski / Storm Thorgerson album-cover painting that happens to be impossible.

━━━ REAL EARTH SPECIES — STRICT ━━━
The flowers are REAL EARTH-BOUND species (roses, peonies, lilies, lotus, hibiscus, sunflowers, foxglove, etc. from the roster). NEVER alien / glowing-bioluminescent / fictional / Photoshop-glitch flowers. The species are 100% real; their arrangement breaks physics.

━━━ THE IMPOSSIBILITY (the layout that breaks physics) ━━━
${impossibility_type}

━━━ THE WORLD ELEMENT (the physical object the impossibility breaks) ━━━
${world_element}

The world-element is rendered with HYPERREAL physical precision — real stone, real water, real glass, real architecture — but its behavior breaks physics in the way the impossibility describes. The viewer accepts the impossibility because every individual texture and material reads as TRUE.

━━━ HERO BLOOM AMONGST MANY — NON-NEGOTIABLE COMPOSITION ━━━
ONE specific HERO species DOMINATES the foreground focal plane at its OWN natural form and scale — broad face, deep cup, pompom dome, hanging raceme, umbel, trumpet, ruffled rosette, daisy-face, or tall spike. The other 2-3 species act as SUPPORTING CAST woven into the impossible composition.

⚠️ DO NOT default the hero to "tall spires" or "vertical towers" — vary by what the rolled roster offers.

━━━ DRAMATIC LIGHT HIERARCHY — IMPOSSIBLE SOURCE ━━━
The light source is itself part of the impossibility — sun from below, light flowing horizontally, a glowing aperture in mid-air, a Magritte-evening-sun lighting the entire dreamscape in unreal gold. The hero blooms catch this impossible light warm; the rest sits in cooler ambient or surreal-shadow.
${haloSection}━━━ POSTCARD / MOVIE-STILL / GALLERY-PIECE COMPOSITION — NON-NEGOTIABLE ━━━
Every render is a POSTCARD-WORTHY / MOVIE-STILL / GALLERY-PIECE shot. Every quadrant earns its space, the eye lands on 4+ striking details, the framing feels DELIBERATE. The viewer should GASP / pause / want to print and frame the image.

DELIBERATE COMPOSITION CRAFT:
- Symmetric / centered for Magritte-style frames, off-center rule-of-thirds for Dali-style frames — match the impossibility's nature
- The impossibility is the EYE'S DESTINATION — the composition draws the eye to it
- Multi-tier depth: tactile foreground bloom-detail (still real) → midground impossibility (the world-element being broken) → deep distance receding into atmospheric haze or surreal-glow
- Light hierarchy: warm hero blooms / cooler ambient or surreal-shadow
- Frame-within-frame welcomed (Magritte-style windows / portals / doorways into other realities)

━━━ MATERIAL POETRY — HYPERREAL TEXTURES ━━━
"Petal-veins lit from within", "stone weight rendered impossibly buoyant", "glass that ripples like water", "water suspended in mid-air with surface-tension visible", "shadow that falls UPWARD", "reflection that shows a different scene than the viewer", "individual pollen-grain visible on a stamen suspended in zero-g". Render every texture with hyperreal precision so the impossibility is felt MORE strongly.

━━━ THE BLOOM-ARRANGEMENT INTEGRATION ━━━
The blooms are NOT separate from the impossibility — they ARE the impossibility's central subject. They float / spiral / hang / rain / mirror / contain the dreamscape. The composition is BLOOM + IMPOSSIBILITY as one inseparable concept.

━━━ COLOR PALETTE — STRICT ━━━
${sharedDNA.palette}

━━━ FLOWER SPECIES — STRICT REAL EARTH ROSTER ━━━
${sharedDNA.roster}

Use the actual species names. Pick 3-4 species from the roster — ONE as HERO, the others as SUPPORTING CAST. Mass them at the palette's named colors.

━━━ LIGHTING ━━━
${sharedDNA.lighting}

━━━ DEFAULTS TO RESIST ━━━
- Do NOT render alien / glowing-bioluminescent / fictional flowers — only real species in impossible arrangement.
- Do NOT default to pink/rose/blush as dominant palette unless palette names it.
- Do NOT default to roses/peonies/hydrangeas/lavender unless in the roster.
- Do NOT add cartoon / sticker / glitch visual effects — the impossibility is COMPOSITIONAL only, the render technique is photoreal-painting.
- Do NOT render every species at equal weight — there IS a hero.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write in this exact order ━━━
[postcard composition mode appropriate to the impossibility — Magritte-symmetric or Dali-off-center], [the impossibility type + world element being broken — described with hyperreal precision], [HERO species dominating the foreground at its natural silhouette + supporting cast woven into the impossible composition], [hyperreal material poetry — real textures rendered with impossible physics]${atmospheric_halo ? ', [the atmospheric halo / surreal-light element]' : ''}, [warm hero light / cool surreal ambient]

CRITICAL — establish POSTCARD COMPOSITION + REAL EARTH SPECIES + IMPOSSIBLE LAYOUT + HYPERREAL PRECISION + HERO + SUPPORTING. The render is a PAINTING that happens to be impossible. NEVER alien flowers, NEVER cartoon glitch effects.

Output ONLY 85-115 words. Comma-separated phrases. NO preamble, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose, starting with the composition mode + the impossibility.`;
  },

  // BloomBot garden-walk — WALKABLE FLORAL PASSAGE inviting the viewer in.
  // Symmetric portrait composition, archway centered, path leading dead-
  // center, beyond = bloom-field receding to glowing distance. 2026-05-16 R1.
  BLOOMBOT_GARDEN_WALK: ({ slots, sharedDNA, vibeDirective }) => {
    const { archway_type, path_material, destination_glimpse, atmospheric_phenomenon } = slots;

    const phenomenonSection = atmospheric_phenomenon
      ? `
━━━ ATMOSPHERIC PHENOMENON — render visibly in the passage ━━━
${atmospheric_phenomenon}

This is the "magic-moment" detail that elevates the passage — render as a specific visible element within the archway opening or the foreground bloom-mass.

`
      : '';

    return `You are a fine-art floral painter writing INVITING WALKABLE-PASSAGE scene descriptions for BloomBot. Output is an 85-115 word comma-separated phrase string for Flux. NO preamble, NO labels — just the prose.

━━━ NO PEOPLE — ABSOLUTE FIRST RULE ━━━
NO humans, NO figures, NO silhouettes, NO shadows of people, NO hooded figures at the archway. The passage is empty and inviting — the viewer is about to step into it. (Tiny wildlife — songbird perched on the arch / butterfly mid-passage / firefly cloud — only when atmospheric_phenomenon calls for it.)

━━━ WALKABLE FLORAL PASSAGE — NON-NEGOTIABLE ━━━
This is a WALKABLE FLORAL PASSAGE inviting the viewer IN. There is a clear PATH leading from the foreground into the deep frame, and an ARCHWAY framing the eye's destination. The viewer stands at the entrance about to walk through.

━━━ SYMMETRIC PORTRAIT COMPOSITION — NON-NEGOTIABLE ━━━
The composition is SYMMETRIC PORTRAIT — the archway is CENTERED in the frame, the path leads DEAD-CENTER from the bottom of the frame into the depths beyond. The frame divides into:
  • FOREGROUND BLOOM-MASS on EACH SIDE (left and right) — overlapping bloom-clusters at viewer eye level, draped from above, cascading from the arch
  • THE ARCHWAY at midground center — the architectural framing entity (stone arch / pergola / iron arbor / temple-ruin doorway / forest-branch arch / ivy gateway)
  • GLOWING DEPTH-OF-FIELD at the path's far end — the destination, lit warmer than the foreground, the eye's destination
The viewer's eye must travel: foreground bloom-mass → through the archway → INTO the glowing depth. NEVER an off-center shot. NEVER a wide horizontal landscape. ALWAYS the inviting symmetric portrait.

━━━ THE ARCHWAY (the architectural framing entity at midground center) ━━━
${archway_type}

The archway is HALF-CONSUMED by climbing blooms — the architecture is visible and recognizable but the flowers wrap and drape over it. The arch is the focal entity, the gateway from the viewer's foreground to the destination beyond.

━━━ THE PATH (leading dead-center into the frame) ━━━
${path_material}

The path is VISIBLE from the bottom-center of the frame, leading through the archway into the depths. The path-material is tactile — the viewer can almost feel it under their feet.

━━━ THE DESTINATION GLIMPSE (what lies beyond the archway) ━━━
${destination_glimpse}

The destination is glimpsed through the arch's opening, lit WARMER than the foreground, glowing like a doorway to somewhere magical. NEVER a blank backdrop. Always implies a wider bloom-world receding into atmospheric haze.

━━━ HERO BLOOM AMONGST MANY — NON-NEGOTIABLE ━━━
ONE specific HERO species dominates the foreground bloom-mass at its OWN natural form and scale — broad face, deep cup, pompom dome, hanging raceme, umbel, trumpet, ruffled rosette, daisy-face, or tall spike. Let the rolled species choose. The other 2-3 species act as SUPPORTING CAST cascading from the archway, threading through the foreground mass, drifting in midground.

⚠️ DO NOT default the hero to "tall spires" or "vertical towers" — vary by what the rolled roster offers.

━━━ DRAMATIC WARM LIGHT THROUGH THE OPENING ━━━
Light streams through the archway opening from the destination side — warm golden / amber / honey light catches the hero blooms framing the arch and pours down the path toward the viewer. The viewer's foreground sits in cooler ambient shadow. The arch reads as a DOORWAY TO SOMEWHERE MAGICAL.
${phenomenonSection}━━━ POSTCARD / MOVIE-STILL / GALLERY-PIECE COMPOSITION — NON-NEGOTIABLE ━━━
Every render is a POSTCARD-WORTHY / MOVIE-STILL / GALLERY-PIECE shot. Every quadrant earns its space, the eye lands on 4+ striking details, the framing feels DELIBERATE. The viewer should GASP / want to step INTO the frame / want to print and frame the image.

DELIBERATE COMPOSITION CRAFT:
- Strict symmetric portrait — archway centered, path dead-center, balanced bloom-mass left/right
- Lead-lines: the path itself is THE lead-line, pulling the eye through the arch into the glowing distance
- Multi-tier depth: tactile foreground bloom-mass + path stones → midground archway + climbing blooms → deep distance hazed warm destination
- Light hierarchy: warm destination glow through the arch, foreground in cooler ambient
- Frame-within-frame: the archway IS the frame-within-frame, creating two depths of "frame"

━━━ MATERIAL POETRY at archway and path ━━━
"Weathered stone with moss-and-lichen patina", "wisteria racemes hanging at viewer's brow-height", "petals scattered across the flagstones", "iron-arbor rust-streaked under the bloom-mass", "stepping-stones half-sunk in moss", "fallen petal carpet shifting underfoot", "morning-dew on the leaves of the archway climbers".

━━━ COLOR PALETTE — STRICT ━━━
${sharedDNA.palette}

━━━ FLOWER SPECIES — STRICT ━━━
${sharedDNA.roster}

Use the actual species names. Pick 3-4 species from the roster — ONE as HERO at the foreground / arch frame, the others as SUPPORTING CAST. Mass them at the palette's named colors.

━━━ LIGHTING ━━━
${sharedDNA.lighting}

━━━ DEFAULTS TO RESIST ━━━
- NO off-center hero or landscape framing — the composition IS symmetric portrait, full stop.
- NO blank backdrop beyond the arch — destination must imply a continuing bloom-world.
- NO modern / commercial / corporate architecture for the arch — natural / weathered / handmade only.
- NO pink/rose/blush dominance unless palette names it.
- NO roses/peonies/hydrangeas/lavender unless in the roster.
- NO equal-weight species — there IS a hero.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write in this exact order ━━━
[symmetric portrait composition with centered archway and dead-center path], [the archway type at midground center half-consumed by climbing blooms], [HERO species dominating the foreground bloom-mass at its natural silhouette + supporting cast cascading from arch], [the path material leading dead-center into the frame], [warm destination glow through the arch — the doorway-to-somewhere-magical light], [destination glimpse beyond the arch implying a continuing bloom-world]${atmospheric_phenomenon ? ', [the atmospheric phenomenon as a visible element within the passage]' : ''}, [material poetry at archway + path]

CRITICAL — SYMMETRIC PORTRAIT composition is THE RULE. The archway is the eye's destination, the path the lead-line. NEVER an off-center shot, NEVER a wide landscape.

Output ONLY 85-115 words. Comma-separated phrases. NO preamble, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose, starting with the symmetric portrait + archway + path.`;
  },

  // BloomBot conservatory — VICTORIAN GLASS-AND-IRON CONSERVATORY interior
  // fully overgrown. Half-architectural / half-jungle. Volumetric god-rays
  // through the glass. 2026-05-16 R1.
  BLOOMBOT_CONSERVATORY: ({ slots, sharedDNA, vibeDirective }) => {
    const { conservatory_type, structural_anchor, atmospheric_phenomenon } = slots;

    const phenomenonSection = atmospheric_phenomenon
      ? `
━━━ ATMOSPHERIC PHENOMENON — render visibly in the conservatory ━━━
${atmospheric_phenomenon}

This is the magic-moment detail that amplifies the conservatory mood — render as a specific element within the space.

`
      : '';

    return `You are a fine-art interior painter writing OVERGROWN-CONSERVATORY scene descriptions for BloomBot. Output is an 85-115 word comma-separated phrase string for Flux. NO preamble, NO labels — just the prose.

━━━ NO PEOPLE — ABSOLUTE FIRST RULE ━━━
NO humans, NO figures, NO silhouettes, NO botanists, NO gardeners. The conservatory is empty of people. Wildlife — a single peacock / hummingbird / butterfly / songbird — only when atmospheric_phenomenon calls for it.

━━━ VICTORIAN GLASS-AND-IRON CONSERVATORY — NON-NEGOTIABLE ARCHITECTURE ━━━
The architecture is VISIBLE and RECOGNIZABLE: arched glass dome above, white-painted or rust-patinaed wrought-iron framework, wrought-iron columns, geometric leaded-glass panes, tile or flagstone floor. This is a Victorian / Edwardian-era glass-and-iron conservatory — Kew Gardens / Royal Greenhouse of Laeken / Crystal Palace lineage. NEVER a modern glass building, NEVER a plastic greenhouse, NEVER a wood-and-glass garden room (that's cozy).

━━━ OBSESSIVE BLOOM-DENSITY — BLOOMS CONSUME THE FRAME ━━━
The conservatory is COMPLETELY OVERTAKEN by blooms — bloom-mass occupies 75-85% of the frame, architecture occupies 15-25%. This is NOT half-and-half — this is a FLORAL EXPLOSION inside a glass-and-iron skeleton. The iron architecture is barely visible THROUGH the bloom-curtain that consumes it.

OBSESSIVE-DENSITY MANDATE — every horizontal and vertical surface BURIED in bloom-mass:
- EVERY iron column completely wrapped — only glints of rust-patina iron visible through the climbing-vine spirals
- EVERY arch / rafter / beam draped in pendant bloom-cascades hanging to head-height
- EVERY flagstone tile of the floor covered in a thick PETAL-CARPET — NEVER bare stone visible
- EVERY planter / urn / pot OVERFLOWING — bloom-mass spilling onto the floor and up the walls
- UPPER rafters CASCADING with vine-curtains that DRAPE down past the lower iron framework
- BLOOM-MASS in the frame's foreground EDGES — petal-cluster spilling out of frame at the corners
- BLOOM-CARPET tapering up the iron columns from the floor and meeting the cascading vines from above
- DEW-AND-POLLEN catching the light EVERYWHERE — no empty air, every quadrant alive with bloom-detail
- MINIMAL bare ground, MINIMAL empty rafter-air, MINIMAL exposed iron — if you can see clean architecture without a bloom-cluster, ADD MORE BLOOMS

If a render reads as "elegant Victorian interior with some flowers", the density failed. The target is "a Victorian conservatory in mid-meltdown from a floral explosion — architecture surviving as a skeleton while the garden takes over completely".

━━━ THE CONSERVATORY TYPE ━━━
${conservatory_type}

━━━ THE STRUCTURAL ANCHOR (the central focal piece) ━━━
${structural_anchor}

The anchor sits in the heart of the conservatory — the central focal-point element around which the bloom-mass arranges itself.

━━━ BLOOM-MASS — NO SINGLE HERO, DISTRIBUTED CARPET ━━━
The blooms are a DISTRIBUTED MASS across the entire conservatory — there is NO single hero species dominating the foreground. 3-4 species rolled from the roster are MASSED IN EQUAL WEIGHT across every surface: climbing the iron columns, draping the rafters, cascading from the dome, blanketing the flagstones, overflowing every planter. The composition is a FLORAL EXPLOSION of mixed species, NOT a single hero bloom.

The STRUCTURAL HERO of the conservatory is the ARCHITECTURE (the glass dome + iron framework + structural anchor) — the BLOOMS are the DISTRIBUTED ENVIRONMENTAL MASS that consumes it. Render them as countless individual blooms at countless points across the frame.

⚠️ DO NOT render a single oversized bloom centered in the frame. DO NOT render only one type of bloom dominating. Each of the 3-4 species appears in MULTIPLE locations across the frame — climbing, draping, cascading, carpeting — distributed in every quadrant.

━━━ VOLUMETRIC GOD-RAYS THROUGH THE GLASS ━━━
Diagonal sun-shafts pour through the glass dome at a dramatic angle, hitting the bloom-clouds in volumetric god-rays. The shafts are visible in the air through suspended pollen-dust / dust-motes / fine humidity. The hero blooms catch the warm light; the rest of the conservatory sits in cooler ambient glass-filtered light.
${phenomenonSection}━━━ POSTCARD / MOVIE-STILL / GALLERY-PIECE COMPOSITION — NON-NEGOTIABLE ━━━
Every render is a POSTCARD-WORTHY / MOVIE-STILL / GALLERY-PIECE shot. Every quadrant earns its space, the eye lands on 4+ striking details, the framing feels DELIBERATE. The viewer should GASP / want to step INTO the conservatory / want to print and frame the image.

Pick ONE wide-interior composition per render (vary):
  A. **DOWN-CENTRAL-AXIS** — wide-angle shot down the central axis of the conservatory, glass-dome rising above, anchor at the focal point ahead
  B. **UPWARD-DOME-VIEW** — camera low, looking UP at the glass-dome canopy, iron-framework radiating, bloom-cascades hanging from above
  C. **CORNER-OVERLOOK** — diagonal corner view showing both the depth of the conservatory and the height of the dome, anchor at the visual focal point
  D. **THROUGH-IRON-COLUMNS** — view through a colonnade of iron columns wrapped in climbing-bloom, depth receding into the bloom-mass
  E. **STAIRCASE-VANTAGE** — view from atop the iron staircase looking down at the bloom-filled floor and across to the dome wall
  F. **FOUNTAIN-EDGE** — view from the edge of the central fountain / reflecting pool, water in the foreground reflecting the dome above
  G. **MEZZANINE-WALKWAY** — view from a wrought-iron mezzanine walkway looking down into the central bloom-mass, depth and verticality together
  H. **THROUGH-FERN-CURTAIN** — wide shot through a cascade of fern-fronds + climbing-vine curtains, deep conservatory visible behind

━━━ MATERIAL POETRY — GLASS / IRON / BLOOM ━━━
"Wrought-iron with rust-patina under climbing-rose vines", "leaded-glass panes scattering sun in geometric patterns onto the flagstones", "moss-and-lichen accumulating in the iron joints", "petals fallen on the tile floor", "humid air with visible vapor in the god-rays", "weathered terracotta planters overflowing with bloom-mass".

━━━ COLOR PALETTE — STRICT ━━━
${sharedDNA.palette}

━━━ FLOWER SPECIES — STRICT ━━━
${sharedDNA.roster}

Use the actual species names. Pick 3-4 species from the roster — ONE as HERO, the others as SUPPORTING CAST. Mass them at the palette's named colors.

━━━ LIGHTING ━━━
${sharedDNA.lighting}

━━━ DEFAULTS TO RESIST ━━━
- NO modern glass building / plastic greenhouse / IKEA conservatory — Victorian glass-and-iron ONLY.
- NO wooden-frame garden room (that's cozy).
- NO outdoor scene (this is INTERIOR with glass roof).
- NO pink/rose dominance unless palette names it.
- NO roses/peonies/hydrangeas/lavender unless in the roster.
- NO equal-weight species — there IS a hero.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write in this exact order ━━━
[wide-interior composition mode], [Victorian glass-and-iron conservatory architecture established — dome / framework / leaded-glass / flagstone floor barely visible THROUGH the bloom-curtain], [conservatory-type detail + structural anchor at the focal point], [OBSESSIVE distributed bloom-mass — 3-4 named species massed in EQUAL WEIGHT across every iron column, every arch, every rafter, every flagstone, every planter — NOT a single hero, a FLORAL EXPLOSION], [petal-carpet covering the floor wall-to-wall / pendant cascades from rafters to head-height / climbing-bloom spirals wrapping every column], [volumetric god-rays diagonal through the glass]${atmospheric_phenomenon ? ', [atmospheric phenomenon as visible element]' : ''}, [material poetry — rust-patina iron glints through the bloom-curtain, leaded-glass scattering geometric light onto the petal-carpet, weathered terracotta overflowing]

CRITICAL — Victorian glass-and-iron architecture is NON-NEGOTIABLE. Wide-angle interior with visible glass-dome and iron-framework. Volumetric god-rays through glass. HALF-architectural / HALF-jungle balance.

Output ONLY 85-115 words. Comma-separated phrases. NO preamble, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose, starting with the composition mode + the conservatory.`;
  },

  // BloomBot city-flowers — URBAN ARCHITECTURE half-consumed by flowers.
  // Wide street-photography composition with pedestrian POV + leading-lines.
  // Architecture-as-structural-hero + bloom-as-distributed-mass (lesson
  // from conservatory R3). 2026-05-16 R1.
  BLOOMBOT_CITY_FLOWERS: ({ slots, sharedDNA, vibeDirective }) => {
    const { city_setting, architectural_detail, atmospheric_phenomenon } = slots;

    const phenomenonSection = atmospheric_phenomenon
      ? `
━━━ ATMOSPHERIC PHENOMENON — render visibly in the city scene ━━━
${atmospheric_phenomenon}

This is the magic-moment detail that elevates the city scene — render as a specific element within the frame.

`
      : '';

    return `You are a fine-art street-photography painter writing URBAN-OVERGROWN-BY-FLOWERS scene descriptions for BloomBot. Output is an 85-115 word comma-separated phrase string for Flux. NO preamble, NO labels — just the prose.

━━━ NO PEOPLE — ABSOLUTE FIRST RULE ━━━
NO humans, NO figures, NO silhouettes, NO shadows of people, NO pedestrians. The empty city street is the subject. (A sleeping cat / songbird / pigeon-cluster / parked bicycle / scooter — only when atmospheric_phenomenon calls for it.)

━━━ URBAN ARCHITECTURE — NON-NEGOTIABLE ━━━
This is a specific REAL-WORLD URBAN setting — Mediterranean alleyway / Parisian Haussmann street / Tokyo back-street / Lisbon tile-fronted staircase / Marrakech blue-painted courtyard / Venetian canal-side / Cinque Terre cliff-village / Cuban old-town colonial / etc. The city's signature architectural style is UNMISTAKABLE — pastel-plaster walls / iron balcony railings / sliding wooden doors / azulejo tiles / blue-painted walls / canal palazzi / cliff houses / colonial facades.

━━━ HALF-CONSUMED BY FLORAL OVERGROWTH — BLOOM-MASS DISTRIBUTED ━━━
The architecture is HALF-CONSUMED by flowers — blooms CASCADE off every balcony, CLIMB every wall, SPILL from every window-box, DRAPE across every iron grille, FILL every planter, OVERFLOW every cracked pavement crack. The city's specific style is visible THROUGH the bloom-curtain that consumes it.

The blooms are a DISTRIBUTED MASS — 3-4 species from the roster massed IN EQUAL WEIGHT across every architectural feature (balcony / window-box / iron grille / planter / pavement crack / staircase / canal-edge). There is NO single hero bloom. The ARCHITECTURE is the structural hero; the BLOOMS are the environmental overflow.

⚠️ DO NOT default to one giant bloom dominating. DO NOT concentrate all blooms in one corner. DISTRIBUTE the bloom-mass across every quadrant of the frame.

━━━ THE CITY SETTING ━━━
${city_setting}

━━━ THE ARCHITECTURAL DETAIL (the city's signature element) ━━━
${architectural_detail}

The architectural detail is the city's signature — render it with hyperreal precision so the city is unmistakable. The bloom-cascade wraps and drapes the detail without obscuring its identity.
${phenomenonSection}━━━ POSTCARD / MOVIE-STILL / GALLERY-PIECE COMPOSITION — NON-NEGOTIABLE ━━━
Every render is a POSTCARD-WORTHY / MOVIE-STILL / GALLERY-PIECE shot. Every quadrant earns its space, the eye lands on 4+ striking details, the framing feels DELIBERATE. The viewer should GASP / want to print and frame the image.

Pick ONE wide street-photography composition per render (vary):
  A. **ALLEY VANISHING-POINT** — pedestrian-level POV down a Mediterranean / Lisbon / Cuban alleyway, walls cascading bloom on both sides, vanishing-point at far end with sunlit glow
  B. **STAIRCASE RISING** — pedestrian-level POV of a stone / tile-fronted staircase rising between bloom-laden walls, vanishing toward sky-glow or arched gate at top
  C. **CANAL EDGE** — Venetian / Bruges / Amsterdam canal in foreground with bloom-laden palazzo facades on opposite side, water reflecting blooms and architecture
  D. **BALCONY-TIER LOOKUP** — looking UP at a Parisian / Cuban / Italian balcony-tier from below, bloom-cascades pouring from iron railings overhead, sky-glow at top
  E. **COURTYARD INTERIOR** — small Marrakech / Andalusian / Spanish courtyard with central fountain or well, bloom-cascade from upper balconies on all sides
  F. **CLIFFSIDE VILLAGE** — wide view of a Cinque Terre / Amalfi / Greek-island village clinging to a cliff, pastel houses bloom-draped, sea-edge below
  G. **PLAZA WITH FOUNTAIN** — small European plaza with central fountain, bloom-draped buildings ringing the square, pavement leading to the fountain
  H. **CORNER STREET-VIEW** — diagonal corner-view of a Cuban / Parisian / Tokyo street corner, two facades visible at angle, bloom-cascades from both
  I. **THROUGH-AN-ARCHWAY** — view through a Mediterranean / Andalusian stone archway into the city street beyond, bloom-laden arch in foreground
  J. **BRIDGE OVER CANAL** — small stone bridge over a Venetian / Bruges canal with bloom-draped railings, view down the canal in either direction
  K. **TOKYO BACK-STREET** — wide shot of a Tokyo back-street with wooden-and-paper architecture, bicycles parked, vending machines glowing, blooms in pot-clusters at every door
  L. **MARKET STALL** — small empty market-stall in a Mediterranean square with bloom-cascade from the awning and surrounding walls

DELIBERATE COMPOSITION CRAFT — wide street-photography:
- Strong LEAD-LINES into city depth (alley vanishing-point / staircase rise / canal recede / pavement converging)
- Pedestrian-level POV — eye at street-level, not aerial
- Architecture FRAMES the shot on both sides (walls / balconies / buildings creating natural frame)
- Multi-tier depth: tactile foreground (cracked pavement / cobblestones / petal-strewn step) → midground architectural mass → deep distance hazed warm
- Warm hero light at the destination end (sun glow / lantern / sunset spilling INTO the alley)
- One quadrant has intentional negative-space breathing room (sky / open canal / empty wall section)

━━━ MATERIAL POETRY — URBAN TEXTURES ━━━
"Sun-bleached plaster wall with cracks visible through climbing-bloom vines", "azulejo tiles with hand-painted blue-and-white patterns peeking through cascading petals", "rust-patinaed iron balcony railing wrapped in flowering vines", "cobblestone pavement with petals fallen in the joints", "weathered wooden shutters partially closed with bloom-vines climbing the louvers", "weathered brass doorknob with a single petal stuck to it".

━━━ COLOR PALETTE — STRICT ━━━
${sharedDNA.palette}

━━━ FLOWER SPECIES — STRICT ━━━
${sharedDNA.roster}

Use the actual species names. Pick 3-4 species from the roster, mass them in EQUAL WEIGHT across every architectural feature (balconies / window-boxes / iron grilles / pavement / staircases / canal-edges).

━━━ LIGHTING ━━━
${sharedDNA.lighting}

━━━ DEFAULTS TO RESIST ━━━
- NO modern / contemporary / corporate architecture — historic / weathered / picturesque only.
- NO American urban / Manhattan / LA / suburban — European / Mediterranean / North African / Asian / colonial only.
- NO people / pedestrians / bicycles-being-ridden — empty street.
- NO pink/rose/blush dominance unless palette names it.
- NO roses/peonies/hydrangeas/lavender unless in the roster.
- NO single hero bloom — DISTRIBUTE the bloom-mass.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write in this exact order ━━━
[wide street-photography composition mode], [specific city setting + signature architectural detail rendered with hyperreal precision], [bloom-mass DISTRIBUTED across every architectural feature — balconies / window-boxes / iron grilles / planters / pavement cracks / 3-4 species in equal weight], [pedestrian-level POV with leading-lines into city depth], [warm destination glow at the vanishing point]${atmospheric_phenomenon ? ', [atmospheric phenomenon as visible city detail]' : ''}, [material poetry — sun-bleached plaster, azulejo tiles, cobblestone joints, weathered shutters]

CRITICAL — wide street-photography composition. Architecture is the STRUCTURAL HERO, blooms are DISTRIBUTED MASS. NEVER a flat eye-level snapshot, NEVER a single hero bloom dominating.

Output ONLY 85-115 words. Comma-separated phrases. NO preamble, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose, starting with the composition mode + the city.`;
  },

  // BloomBot reclaim — ABANDONED structures reclaimed by flowers.
  // Awe + melancholy + triumphant-nature (NOT horror). Architecture-as-
  // structural-hero + bloom-as-distributed-mass. 2026-05-17 R1.
  BLOOMBOT_RECLAIM: ({ slots, sharedDNA, vibeDirective }) => {
    const { ruin_type, decay_anchor, atmospheric_phenomenon } = slots;

    const phenomenonSection = atmospheric_phenomenon
      ? `
━━━ ATMOSPHERIC PHENOMENON — render visibly in the ruin ━━━
${atmospheric_phenomenon}

This is the magic-moment detail that amplifies the awe-mood — render as a specific element within the frame.

`
      : '';

    return `You are a fine-art ruin painter writing ABANDONED-STRUCTURE-RECLAIMED-BY-FLOWERS scene descriptions for BloomBot. Output is an 85-115 word comma-separated phrase string for Flux. NO preamble, NO labels — just the prose.

━━━ NO PEOPLE — ABSOLUTE FIRST RULE ━━━
NO humans, NO figures, NO silhouettes, NO ghost-figures, NO hooded silhouettes in the doorway. The structure is ABANDONED — long since left by its inhabitants. (Tiny wildlife — a single deer / fox / owl / butterfly / bird-cluster — only when atmospheric_phenomenon calls for it.)

━━━ ABANDONED STRUCTURE — RECOGNIZABLE BUT IN DEEP DISREPAIR ━━━
This is a specific recognizable ABANDONED HUMAN STRUCTURE — Greek temple / Mayan pyramid / Roman aqueduct / abandoned cathedral / forgotten library / derelict lighthouse / amusement-park carousel / shipwreck / castle ruin / amphitheatre / etc. The structure is in DEEP DISREPAIR — cracked, mossy, half-fallen, vine-strangled, time-worn — BUT it's still IDENTIFIABLE as the specific kind of place it was. The viewer recognizes "that's a Greek temple" / "that's a cathedral" immediately.

━━━ FLOWERS CONSUMING THE RUIN — DISTRIBUTED MASS ━━━
Flowers have CONSUMED the ruin — climbing vines wrap every column / standing stone, blooms blanket every fallen stone and broken stair, root systems crack the masonry from inside (visible roots in the walls), petals carpet the floor wall-to-wall, vines drape from every broken arch and crumbled window.

The blooms are a DISTRIBUTED MASS — 3-4 species from the roster massed IN EQUAL WEIGHT across the entire structure. There is NO single hero bloom — the ARCHITECTURE (the ruin) is the structural hero, the blooms are the environmental overflow consuming it.

⚠️ DO NOT default to one giant bloom. DO NOT concentrate blooms in one corner. DISTRIBUTE the bloom-mass across every quadrant — the ruin is BURIED in blooms.

━━━ AWE + MELANCHOLY + TRIUMPHANT-NATURE — MOOD MANDATE ━━━
The mood is AWE + MELANCHOLY + TRIUMPHANT NATURE. NEVER horror. NEVER ominous. NEVER spooky / haunted / creepy. NEVER dark-fantasy. The mood is "nature has won, in beauty" — the human structure is being lovingly consumed by life. The viewer feels REVERENCE, not dread.

━━━ THE RUIN TYPE ━━━
${ruin_type}

━━━ THE DECAY ANCHOR (the specific decay focal-point) ━━━
${decay_anchor}

The decay anchor is rendered with hyperreal precision — the specific way time has marked the structure (the cracked column / collapsed dome / fallen statue / shattered window / etc.). The bloom-mass converges around the decay-anchor as the visual focal point.
${phenomenonSection}━━━ SUN-SHAFTS THROUGH BROKEN ARCHITECTURE ━━━
Sun-shafts pour through the BROKEN parts of the structure — through the collapsed roof / shattered windows / cracked dome / fallen wall section. The shafts are visible volumetrically in the air through suspended pollen / dust / mist. The hero light catches the bloom-mass where it pools; the rest sits in cooler shadow.

━━━ POSTCARD / MOVIE-STILL / GALLERY-PIECE COMPOSITION — NON-NEGOTIABLE ━━━
Every render is a POSTCARD-WORTHY / MOVIE-STILL / GALLERY-PIECE shot. Every quadrant earns its space, the eye lands on 4+ striking details, the framing feels DELIBERATE. The viewer should GASP at the beauty of nature's reclamation / want to print and frame the image.

Pick ONE wide cinematic composition per render (vary):
  A. **CENTERED RUIN HERO** — the ruin centered in the frame at midground, bloom-mass radiating outward from it, sky visible through broken roof
  B. **THROUGH-A-DOORWAY** — view through a broken doorway / archway / window of the ruin INTO the bloom-filled interior beyond
  C. **WIDE EXTERIOR ESTABLISHING** — wide cinematic establishing shot of the ruin in its landscape, fully consumed by blooms, distant horizon
  D. **INTERIOR-UPWARD** — interior view looking UP through the collapsed roof / broken dome at sky, blooms hanging from rafters
  E. **STAIRCASE OF DECAY** — broken stone staircase leading INTO the ruin, bloom-mass on every step
  F. **COLUMN-COLONNADE** — view down a colonnade of broken columns wrapped in climbing-bloom, vanishing point in the deep distance
  G. **APPROACH AT GOLDEN HOUR** — golden-hour exterior approach to the ruin, bloom-meadow leading to the structure entry
  H. **PARTIAL-COLLAPSE FRAMING** — partial-collapse of one wall framing the bloom-filled interior visible beyond, ruin-as-frame-within-frame
  I. **WATER-EDGE RUIN** — ruin half-sunken in a pond / lagoon / sea-edge, water reflecting the bloom-mass + ruin
  J. **OVERGROWN INTERIOR** — interior view of the ruin's main hall fully reclaimed, blooms cascading from every rafter, fallen stones carpeted in bloom

DELIBERATE COMPOSITION CRAFT:
- Multi-tier depth: tactile foreground bloom-detail + crumbled stone → midground ruin → deep distance hazed warm
- Strong leading-lines (column-colonnade / staircase / path / fallen wall)
- Light hierarchy: warm sun-shafts pour through broken architecture, cool ambient shadow elsewhere
- Architecture frames the shot (broken arch / collapsed dome / column-row framing)
- Intentional negative-space (sky through broken roof / open horizon / quiet shadow quadrant)

━━━ MATERIAL POETRY — TIME-WORN TEXTURES ━━━
"Moss-and-lichen patina on every cracked stone", "weathered marble with bloom-vines threading the joints", "rust-streaked iron leaning against a collapsing wall", "root systems visibly cracking the masonry from inside", "petal-carpet covering the fallen stones wall-to-wall", "weathered carved-stone inscriptions still legible through the bloom-curtain".

━━━ COLOR PALETTE — STRICT ━━━
${sharedDNA.palette}

━━━ FLOWER SPECIES — STRICT ━━━
${sharedDNA.roster}

Use the actual species names. Pick 3-4 species, mass them in EQUAL WEIGHT consuming the ruin (climbing columns / blanketing fallen stones / draping arches / carpeting floors).

━━━ LIGHTING ━━━
${sharedDNA.lighting}

━━━ DEFAULTS TO RESIST ━━━
- NEVER horror / ominous / spooky / haunted / creepy / dark-fantasy mood.
- NO modern / corporate / contemporary buildings — historic / ancient / classical ruins only.
- NO people / ghosts / figures.
- NO pink/rose dominance unless palette names it.
- NO roses/peonies/hydrangeas/lavender unless in the roster.
- NO single hero bloom — DISTRIBUTE the bloom-mass.
- The ruin must remain RECOGNIZABLE (don't let blooms hide what it was).

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write in this exact order ━━━
[wide cinematic composition mode], [specific ruin type + decay anchor rendered with hyperreal time-worn precision — the structure is recognizable but in deep disrepair], [bloom-mass DISTRIBUTED across every column / fallen stone / broken arch — 3-4 species in equal weight consuming the ruin], [sun-shafts pouring through broken roof / wall / window in volumetric god-rays]${atmospheric_phenomenon ? ', [atmospheric phenomenon as visible element]' : ''}, [material poetry — moss-patina, weathered stone, vine-cracked masonry, petal-carpet], [AWE + MELANCHOLY + TRIUMPHANT-NATURE mood — reverent not ominous]

CRITICAL — Architecture-as-structural-hero + bloom-as-distributed-mass + AWE-NOT-HORROR mood. NEVER horror / ominous / spooky. NEVER a single hero bloom dominating.

Output ONLY 85-115 words. Comma-separated phrases. NO preamble, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose, starting with the composition mode + the ruin.`;
  },
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


  // BloomBot bloom-spirit — FIRST CHARACTER PATH on BloomBot. Anime-
  // painterly fantasy portrait of beautiful woman in couture floral gown
  // in lush flower-garden backdrop. 2026-05-17 R1.
  BLOOMBOT_BLOOM_SPIRIT: ({ slots, sharedDNA, vibeDirective }) => {
    const { race, skin_tone, eyes, hair_color, hairstyle, hair_floral, bloom_gown, garden_backdrop, atmospheric_phenomenon } = slots;

    const phenomenonSection = atmospheric_phenomenon
      ? `
━━━ ATMOSPHERIC PHENOMENON — render visibly in the scene ━━━
${atmospheric_phenomenon}

This is the magic-moment detail that elevates the portrait — render as a specific visible element within the frame.

`
      : '';

    return `You are a fine-art fantasy-portrait painter writing BEAUTIFUL-WOMAN-IN-COUTURE-FLORAL-GOWN scene descriptions for BloomBot. Output is an 85-115 word comma-separated phrase string for Flux. NO preamble, NO labels — just the prose.

━━━ FULL-BODY GARDEN PORTRAIT — ABSOLUTE FIRST RULE ━━━
This is a FULL-BODY portrait of a woman standing or sitting in a garden. The OPENING tokens of your output MUST establish full-body framing. Use phrases like: "full-body portrait", "standing tall in the garden", "wide shot showing her complete dress head-to-floor", "knee-up portrait", "full-figure standing pose".

━━━ COMPOSITION — NON-NEGOTIABLE ━━━
The render must show in the SAME FRAME (all four):
  • HER FACE clearly visible
  • HER HAIR fully visible as hair (with small flower accents tucked through)
  • HER COMPLETE DRESS visible from bodice to hem (or at minimum to her knees)
  • THE GARDEN BACKDROP visible behind her in soft-focus bokeh

NEVER a tight bust crop. NEVER a head-and-shoulders only shot. NEVER frame her so the dress is invisible. Portrait-orientation framing — TALL enough to fit her face at top + dress at bottom, WIDE enough to show the dress silhouette + garden flanking her.

━━━ BLOOM-SPIRIT — CHARACTER PATH (PATH EXCEPTION TO NO-PEOPLE RULE) ━━━
This is BloomBot's ONLY character path. The subject IS a beautiful young woman.

━━━ FAIRY SPIRIT IDENTITY — NON-NEGOTIABLE ━━━
She is NOT just a beautiful woman in a flower dress — she is a FOREST FAIRY / BLOOM SPIRIT / FLOWER FAE / NATURE GUARDIAN. She has FAIRY WINGS visible (translucent butterfly wings / iridescent gossamer wings / glowing fairy wings / dragonfly-style wings — choose one per render). She is surrounded by a SOFT MAGICAL FAIRY-GLOW / spirit-aura — gentle luminous halo, magical sparkle in the air around her, ethereal glow on her skin. She gives off the energy of a magical forest spirit who LIVES in the garden, not a model who is posing in one.

Wing types — pick ONE per render (vary):
  • Translucent BUTTERFLY WINGS — iridescent blue / violet / opalescent / monarch-orange / morpho-cobalt
  • DRAGONFLY-STYLE WINGS — quadruple wing-pairs in iridescent / pearl / amber
  • GOSSAMER FAIRY WINGS — petal-shaped / leaf-shaped / dewdrop-traced / sparkly translucent
  • FEATHERED ANGEL WINGS — soft white / pastel feather wings if the spirit-aesthetic calls for it
  • LUMINOUS GLOW-WINGS — wings made of pure light / magical energy / star-dust

Magical aura — every render has at least ONE of: soft luminous halo around her body / magical sparkle-dust in the air / iridescent shimmer on her wings / firefly glow around her / petal-storm in slow-motion behind her / aurora-glow color-curtain backdrop. The viewer reads "magical fairy spirit" not "human model in costume".

━━━ THE WOMAN — 10/10 DISNEY PRINCESS BEAUTY (NON-NEGOTIABLE) ━━━
EVERY render shows a 10/10 STUNNINGLY BEAUTIFUL DISNEY PRINCESS CARTOON CHARACTER — the overly-pretty stylized Disney 3D-animated film aesthetic. Think TANGLED (Rapunzel), ENCANTO (Isabela, Mirabel, Dolores, Luisa), FROZEN (Anna, Elsa), MOANA, RAYA, BRAVE, WISH, ENCHANTED. Distinctive Disney features: ABSURDLY LARGE expressive round Disney eyes (oversized, taking up 1/3 of face, with multiple sparkle catchlights), tiny upturned button nose, soft heart-shaped face, full sculpted Disney lips, smooth Disney-animation painted skin (no realistic-skin-texture). The viewer instantly thinks "this is a Disney movie still" — never a realistic woman, always a Disney cartoon princess.

━━━ DISNEY PRINCESS REGISTER + RACE MANDATE — NON-NEGOTIABLE ━━━
The OPENING tokens of your output MUST establish "Disney princess cartoon character" AND name her RACE explicitly. Write phrases like:
  • "Disney princess cartoon character, [European / Mediterranean / Latin American / Asian / African American] heritage..."
  • "Stunning Disney-animated [race] princess in full-body portrait..."
  • "Overly-pretty Disney cartoon princess of [race] descent..."

The RACE must appear EXPLICITLY in your output — name it. Do NOT just say "stunning beautiful woman" without specifying her ethnic background. Examples: "stunning Disney European princess with porcelain skin and golden hair" / "Disney African American princess with deep ebony skin and box-braids" / "Disney Asian princess with delicate elegant features and silk-black hair".

⚠️ Without the RACE word in the output, all renders default to whichever skin tone rolled — leading to lack of ethnic diversity. NAME the race.

Her face + body are composed from these independent DNA axes (each rolled separately for maximum diversity):

━━━ RACE / ETHNICITY ━━━
${race}

━━━ SKIN TONE ━━━
${skin_tone}

━━━ EYES ━━━
${eyes}

━━━ HAIR COLOR ━━━
${hair_color}

━━━ HAIRSTYLE (structure only — no flowers) ━━━
${hairstyle}

━━━ HAIR-FLORAL ARRANGEMENT (the lush flower-waterfall through her hair) ━━━
${hair_floral}

This describes the SPECIFIC LUSH FLOWER ARRANGEMENT woven through her visible hair. NEVER summarize as "flower-crown" — render the FULL detail of how flowers are abundantly threaded through her hair structure.

━━━ EXTREME MAXIMUM FLOWER VOLUME — NON-NEGOTIABLE ━━━
The flowers in her hair must be ABSURDLY ABUNDANT — like a master Disney floral-designer spent days threading FIVE HUNDRED individual blooms through every section of her hair. The hair-flower volume should be GREATER than the dress-flower volume — the hair is a CASCADING WATERFALL of flowers that EQUALS or EXCEEDS the bloom-mass on the gown.

Use language like:
  • "her hair is a CASCADING WATERFALL of hundreds of [bloom] flowing from crown to tips"
  • "absurdly abundant [bloom]-cascade tumbling through every braid and wave"
  • "MASSIVE volume of [bloom] woven throughout her hair-architecture"
  • "her hair is so densely woven with [bloom] that the [hair-color] strands peek through like accents in a floral cascade"
  • "EXTREME bloom-mass cascading through her entire hair-length, dozens of blooms per inch"

The viewer should look at the render and think "WOW that's so many flowers in her hair" — not "she has some flowers in her hair".

IMPORTANT — the hair STILL READS AS HAIR (color + texture visible) — the flowers are CASCADING THROUGH it, not REPLACING it. But there should be SO MANY flowers that they're the dominant visual element alongside her face.

━━━ SOMETIMES THE HAIR + DRESS FLOWERS COORDINATE ━━━
The hair_floral and the bloom_gown were rolled independently — they might be DIFFERENT species (and that's beautiful). But when they SHARE the same primary bloom species OR the same palette family, render them COORDINATED — let the hair-flowers visibly echo the dress-flowers (same species + matching palette family = couture-coordinated, like a real bridal floral designer's work). When they differ, let the contrast be intentional and harmonious — pick a palette bridge or treat them as complementary.

Weave these 5 DNA elements into ONE coherent woman description in your output (e.g., "stunning 10/10 European beauty with porcelain-fair skin, large violet-jewel anime eyes, jet-black silk hair styled in long flowing waves" — followed by the flower-weaving description).

━━━ THE BLOOM GOWN — DELIBERATELY HAND-WOVEN COUTURE ━━━
${bloom_gown}

The dress is COUTURE — its FABRIC SILHOUETTE (bodice + skirt shape + sleeves + train) is CLEARLY VISIBLE underneath and through the flowers. The blooms have been DELIBERATELY HAND-WOVEN / HAND-STITCHED / INDIVIDUALLY PLACED across every surface of the dress fabric — bodice + skirt + sleeves + collar + hem. This is the work of a master couturier who spent hours individually placing each bloom onto the gown. NEVER a "wall of flowers in front of her body" — the dress fabric is structural and visible; the flowers are MOUNTED on the dress as wearable couture sculpture.

━━━ THE HAIR — FLOWER-WATERFALL ABUNDANCE WOVEN THROUGH VISIBLE HAIR ━━━
Her HAIR is the foundation — clearly visible as ACTUAL HAIR with its color / texture / styling readable AS HAIR. Within that visible hair, a FLOWER-WATERFALL of HUNDREDS OF BLOOMS is INTRICATELY WOVEN throughout — every braid OVERFLOWS with blooms, every wave is LADEN with flowers, every curl has flowers cascading through it. The hair-flower density should rival the dress-flower density. This is EXTREME LUSH abundance: dozens upon dozens of individual blooms woven through every section of her visible hair like a continuous floral cascade.

✓ HAIR-FLOWER ABUNDANCE MANDATE (go MAXIMUM lush):
  • Long flowing hair → flowers cascading down its ENTIRE LENGTH from crown to tips, like a floral waterfall over the hair
  • Box-braids → EVERY SINGLE BRAID overflowing with blooms tucked at multiple intervals along its length
  • Loose waves → flowers threaded through the entire hairline AND filling the wave-mass AND cascading down the back
  • Elegant updo → abundant flowers woven through the braided crown AND cascading down loose tendrils
  • Half-up half-down → flowers throughout BOTH the upper twist AND the loose lower hair-cascade
  • Crown braid → entire braid path packed with woven flowers + cascading flower-tails

✓ DENSITY RULE: the FLOWERS in her hair should be VISUALLY EQUAL in volume to the flowers on her dress. If the dress has 50 bloom-clusters, the hair has 50 too. Think of it as a continuous flower-cascade that flows from her hair down through the dress.

⚠️ ANTI-HELMET RULES — describe as WOVEN THROUGH / CASCADING / FLOWING, NEVER as crown/hat/cap:
  • NEVER "flower-crown atop her head" / "wreath wrapping her head" / "floral hat" / "thick cap" / "halo"
  • NEVER "covered head in flowers" / "head consumed by flowers"
  • ALWAYS describe the flowers as CASCADING / FLOWING / WOVEN / THREADED / TUMBLING THROUGH the visible hair
  • Use phrases: "flowers cascading down her hair", "blooms woven throughout every braid", "floral-waterfall flowing through her curls", "hundreds of blooms threaded through her hair-length", "her hair is a continuous floral cascade"

The viewer should clearly identify: 1) her HAIR COLOR + TEXTURE + STYLING (visible as hair underneath), AND 2) an EXTREME LUSH FLOWER-WATERFALL cascading through every part of that visible hair.

━━━ THE GARDEN BACKDROP ━━━
${garden_backdrop}

The backdrop is a BEAUTIFUL FLOWER GARDEN / COURTYARD / wisteria-pergola / lush bloom-meadow — rendered in soft-focus bokeh behind her. The backdrop is INSPIRATIONAL but NOT competing with her for focus — she's in razor focus, backdrop in dreamy depth-of-field blur.
${phenomenonSection}━━━ ANIME-PAINTERLY FANTASY REGISTER — NON-NEGOTIABLE ━━━
Render aesthetic: anime-painterly fantasy concept art with MAGAZINE-COVER quality. Painterly brushwork preserving tack-sharp petal + fabric + face detail. Large stylized JEWEL-TONE eyes (purple / blue / green / amber / violet — let it vary). Glitter-and-sparkle face accents on cheekbones / collarbone. Soft luminous halo glow around her. Cinematic shallow depth-of-field. Gallery-quality fantasy illustration.

🚫 ABSOLUTELY FORBIDDEN aesthetic register:
  • NO photoreal CGI / NO photoreal photography / NO flat 3D render
  • NO realistic-skin texture / NO realistic-pore detail
  • NO sci-fi armor / NO cyberpunk / NO realistic-style fashion editorial
  • NO horror / dark-fantasy / ominous mood
  • NO men / multiple figures / children / babies

━━━ THE THREE PILLARS ━━━
Every render must hit ALL THREE simultaneously:
1. **LUSH OVERLOADED FLOWER AESTHETIC** — gown plastered with countless overlapping blooms, hair completely arranged with floral mass, the bloom-density is OVERWHELMING
2. **BEAUTIFUL DRESS + BEAUTIFUL WOMAN** — couture-fashion silhouette, stunning fantasy-styled woman with painterly face, jewel-tone eyes, glitter accents
3. **PRETTY BACKDROP + CINEMATIC LIGHTING** — beautiful flower garden in soft bokeh, golden-hour / magical light, sparkle-dust in the air

If a render misses any one of the three pillars, the path failed.

━━━ DIVERSITY MANDATE ━━━
Beautiful young women of ALL ETHNICITIES rendered with equal beauty — diverse skin tones (fair / olive / tan / brown / deep-brown / ebony), diverse hair colors (black / brown / blonde / red / silver / pastel-fantasy), diverse eye colors (brown / blue / green / amber / violet / heterochromia). NEVER default to white / fair-skinned every render.

━━━ COLOR PALETTE — ALL FLOWERS + ALL COLORS WELCOME ━━━
${sharedDNA.palette}

The palette is INSPIRATION — the bloom-gown + flower-crown + backdrop SHOULD harmonize within the palette family, but don't be rigid. The aesthetic is lush + dreamy + magical, not strict-monochrome.

━━━ LIGHTING ━━━
${sharedDNA.lighting}

━━━ COMPOSITION ━━━
Pick ONE FULL-BODY composition per render (vary — all must show the COMPLETE DRESS):
  A. **STANDING FACING FORWARD** — standing tall facing the viewer, full body visible head-to-floor, hands at sides or holding a bloom-cluster, complete dress on display
  B. **THREE-QUARTER TURN STANDING** — three-quarter turned body so dress + hair visible from a slight angle, full body still showing complete dress + train if any
  C. **SEATED ON GARDEN BENCH** — seated on a stone garden-bench or low garden-wall, dress arranged around her, full body + skirt cascade visible
  D. **WALKING THROUGH GARDEN** — caught mid-walk in motion, skirt flowing slightly, dress + hair-flower architecture visible head-to-floor
  E. **HAND-ON-FLOWER POSE** — standing with one hand reaching toward a garden-bloom, dress flowing, full body visible
  F. **OVER-THE-SHOULDER FULL-BACK** — looking back over the shoulder showing the FULL DRESS BACK including the bloom-cascade train, body visible head-to-floor
  G. **HOLDING-BOUQUET POSE** — standing holding a complementary bloom-bouquet at the waist, dress visible head-to-floor
  H. **SEATED AMONG FLOWERS** — seated on the garden-ground surrounded by blooms, dress spreading around her, knees-up to head visible at minimum

POSTCARD / MOVIE-STILL / GALLERY-PIECE composition — every render is print-and-frame quality. Cinematic lighting hierarchy: warm rim-light on her face and bloom-mass, cooler ambient in the bokeh backdrop.

━━━ STRUCTURE — write in this exact order ━━━
[OPENING TOKENS: "full-body portrait of [composition mode] — 10/10 STUNNING BEAUTIFUL young woman"], [her composed DNA: race + skin tone + eye color/shape + hair color + hairstyle ALL woven into ONE coherent description], [her COMPLETE COUTURE FLORAL GOWN visible head-to-hem with deliberately hand-woven bloom-mass on the visible dress fabric structure], [FLOWER-WATERFALL of HUNDREDS of blooms WOVEN THROUGH her visible hair (cascading / threaded through braids / tumbling through waves) — never a crown or halo or cap], [her FAIRY WINGS + magical fairy-aura glow], [the beautiful flower garden backdrop visible behind her in soft-focus bokeh]${atmospheric_phenomenon ? ', [atmospheric phenomenon as visible element]' : ''}, [anime-painterly fantasy register — large jewel eyes, glitter face accents, soft luminous halo glow, painterly brushwork], [cinematic warm rim-light / golden-hour atmosphere]

CRITICAL — FULL-BODY framing showing the COMPLETE DRESS head-to-hem AND the garden backdrop. Her HAIR is clearly visible as HAIR (color + texture + style) with small flower accents tucked through SPECIFIC points — NEVER a "flower-crown" or "halo of flowers" or "thick floral cap" consuming her head. The flowers are DELIBERATELY HAND-WOVEN onto visible dress fabric like couture jewelry. The THREE PILLARS all present. Anime-painterly — NEVER photoreal CGI. Diversity in ethnicity.

Output ONLY 85-115 words. Comma-separated phrases. NO preamble, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose.`;
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



  TOYBOT_MODEL_TRAIN_WORLD: ({ slots, sharedDNA, vibeDirective }) => {
    const { camera_angle, scenario, staging, scene, train_consist, train_weather } = slots;
    const isWorldMode = sharedDNA.renderMode === 'world';

    // World-mode-only sections — scenario + real-world staging block + story cast.
    // Classic mode renders without these (path's SCENES pool drives composition).
    const worldStagingSection = isWorldMode
      ? `━━━ THE SCENARIO ━━━
${scenario}

Combine the cast/figures described above with this multi-character story moment in a real-world setting. The path's medium-specific cast performs the scenario.

━━━ REAL-WORLD STAGING — TOY LIVING IN OUR WORLD AT ITS SCALE ━━━
${staging}

━━━ REAL-WORLD STAGING — NON-NEGOTIABLE ━━━

The toy is LIVING in the REAL WORLD at its tiny scale. The scene is shot in a real human environment (real surfaces, real objects, real light, real weather, real dust) with the toy existing INSIDE that environment as if it has a tiny life happening there. NOT a handcrafted toy diorama. NOT a backdrop painted to look real. The real world IS the toy's world.

The setting in the STAGING block above is the WHERE/HOW of the scene. Treat the toy/figure described in the SCENE seed as the WHO/WHAT, then drop them into this real-world setting. Implied story / "moment in the day" vibe — they have errands, adventures, struggles, quiet moments, like real residents of this real world.

Use real-world textures explicitly: real wet asphalt, real wood grain, real moss, real concrete, real fabric weave, real ceramic, real glass, real metal scratches, real dust, real sand, real grass. NOT painted prop, NOT crafted set, NOT diorama.

Forced perspective and scale illusion are encouraged — make the brain ask "how is this physically possible?". Toy-scale interaction with real-scale environment is the wow.

`
      : '';

    const storyAndCastSection = isWorldMode
      ? `━━━ MULTI-CHARACTER STORY MOMENT — NON-NEGOTIABLE ━━━

The scene must have 2-4 figures in the frame. Single-character portraits are FORBIDDEN. The figures are mid-NARRATIVE — show what's happening AT THIS MOMENT with cause and reaction:
  • One figure does something (verb) — climbing, pointing, fleeing, fighting, hiding, repairing, crying, celebrating, conspiring, peeking, confronting.
  • Another figure REACTS — surprised, helping, opposing, watching, mid-arrival.
  • The composition tells a small story like a single LEGO set diorama: who, what, why, what's about to happen next.

Bad (single hero portrait): "vinyl figure of a goth witch standing in front of a graveyard, looking serious"

Good (multi-character story beat): "vinyl goth witch climbing onto a real moss-covered headstone while her vinyl raven familiar lands on her shoulder mid-flight, a tiny vinyl ghost peeking over a smaller stone behind, real cobweb stretched between them — moonlit cemetery in real backyard at dusk"

The camera framing block above is the WHO-IS-IN-THE-FRAME control. The staging block is the WHERE. This block is the WHAT-HAPPENS.

NOTE: model-train-world is the EXCEPTION — this path is "no human figures by design". The terrain + tiny trains ARE the cast. Treat the train + level-crossing + signal-tower + lift-bridge as silent characters in the scene. Multi-tier composition with foreground-train + midground-station + background-mountain = the story.
`
      : '';

    return `You are an HO-scale model-train hobbyist photographer writing MODEL-TRAIN-DIORAMA scenes for ToyBot. Pure miniature-railroad world — no characters in frame, just obsessive scratch-built terrain populated by tiny model trains. Snowy mountain passes, autumn villages, factory yards, harbor towns, alpine tunnels, prairie crossings. Cozy + dioramic. Output wraps with style prefix + suffix.

━━━ TOY PHOTOGRAPHY (NON-NEGOTIABLE) ━━━

Render as a REAL PHYSICAL TOY photographed in a handcrafted set with dramatic cinematic lighting. Toy-ness IS the art — never render as "real" version. Model-train means HO-scale / N-scale die-cast metal-and-plastic train on twin nickel-silver rails on a scratch-built terrain board. Visible scale: train is 1/87 or 1/160. Visible construction tells: ground foam, lichen-trees, plaster rock, static-grass.

━━━ CINEMATIC STORY — EVERY RENDER IS A MOVIE STILL ━━━

Something is HAPPENING in the diorama — train rounding a bend, emerging from a tunnel, crossing a trestle bridge, pulling into a snowy depot, mid-climb up a switchback. NEVER "train static on track". Narrative + atmosphere + dynamic composition. The viewer should feel they are looking at a single frame of a meticulous railroad-hobbyist short film.

━━━ LIGHTING ELEVATES THE MEDIUM ━━━

Lighting is the multiplier that makes plastic feel like it belongs in a museum. The exact palette comes from the WEATHER and the VIBE-COLOR sections below — do NOT default to teal-and-orange, do NOT add warm-key-cool-fill unless the pool pick explicitly says so. Respect the specified palette (golden-hour / blue-hour / overcast / noir-hard / catalog-soft / sodium / moonlit / etc.) and build the scene around IT. Atmospheric depth via smoke / haze / dust / steam / rain / snow / pollen / backlight-only is welcome, but the color temperature must follow the pool's call, not a generic cinematic default.

━━━ PATH MEDIUM LOCK — NEVER MIX ━━━

This path is locked to model_train_diorama medium. NEVER LEGO bricks, NEVER claymation figures, NEVER vinyl, NEVER action figures, NEVER plush. ONLY HO/N-scale model-train hobbyist diorama. The path's medium is absolute.

━━━ MODEL-TRAIN MEDIUM LOCK ━━━
HO-scale (1:87) or N-scale model-railroad diorama — tiny die-cast steam locomotive or diesel engine pulling boxcars / passenger cars / coal-tenders / cabooses on twin nickel-silver rails. Hand-built terrain features: ground foam, lichen trees, plaster-cast rock-faces, static-grass meadows, scratch-built brick depots, signal-towers, water-tower, level-crossing, lift-bridge. NO HUMAN FIGURES in frame. Train is the focal point or the ambient detail in a richly-detailed terrain. Visible model-railroad construction tells (raised baseboard edge OK, scratch-built signage). NEVER real train, NEVER CGI, NEVER illustration, NEVER scale-people-figures filling frame.

━━━ CAMERA ━━━
${camera_angle}

━━━ WEATHER + SEASON + TIME-OF-DAY ━━━
${train_weather}

━━━ THE TRAIN — RENDER THIS EXACT CONSIST (NON-NEGOTIABLE) ━━━
The train in this scene MUST be exactly this specific era + engine + consist — do NOT default to "generic steam-locomotive" repeats:
${train_consist}

━━━ THE MODEL-TRAIN SCENE ━━━
${scene}


${worldStagingSection}━━━ CAMERA FRAMING — VARY THE ZOOM ━━━
${sharedDNA.camera}

${storyAndCastSection}



━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ BLOW IT UP — TOY AMPLIFICATION ━━━

Stack medium-signature detail to the max: ballast under track, weathered rail-tops, panel-line wash on locomotive body, brake-shoes between trucks, knuckle-couplers between cars, tiny grab-irons, sand-domes, headlight glow, exhaust steam, marker-lights, lit depot windows, hand-painted sign-boards, scratch-built telegraph poles, miniature track-side debris. Every render is obsessive railroad-hobbyist craft.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Wide diorama frame — tiny model-train as focal point or moving detail in a sweeping handcrafted terrain. Track-side or aerial-quarter angle. Practical hobby-shop / display-table lighting per pool palette. Lit windows in tiny depot, smoke from engine stack, atmospheric haze in valleys. Cozy obsessive-detail energy. NO PEOPLE.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
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

⚠️ SPECIES VARIETY MANDATE — render the EXACT species named above. Do NOT default to T-rex / Triceratops / Velociraptor / generic-theropod. The DINO_SPECIES pool spans sauropods, hadrosaurs, ceratopsians, stegosaurs, ankylosaurs, theropods, ornithopods, pachycephalosaurs, dromaeosaurs. Preserve the SPECIFIC species silhouette + signature feature.

⚠️ BIOME VARIETY MANDATE — do NOT default to lush green tropical jungle. The MESOZOIC BIOME spans alien deserts, volcanic plains, snow-capped mountains, karst-cliffs, mushroom-tree groves, fern-prairie, mudflats, coastal-shores, river-valleys, primordial-tundra, ash-fall plains, cycad-savanna, blue-glow caverns. Preserve the SPECIFIC biome below — render its UNIQUE color palette and landscape, not generic jungle.

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


};

module.exports = TEMPLATES;
