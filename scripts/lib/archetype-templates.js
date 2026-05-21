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

  DRAGONBOT_CASTLE: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, castle, biome, sky_layer, scale_prover, phenomenon } = slots;

    const phenomenonSection = phenomenon
      ? `
━━━ ATMOSPHERIC FLOURISH (40%-gated — render subtly) ━━━
${phenomenon}

A subtle atmospheric flourish enhancing the castle's majesty WITHOUT competing with it as focal subject.

`
      : '';

    return `You are a fantasy concept-art painter writing MAJESTIC CASTLE SCENES for DragonBot — vast jaw-dropping movie-poster establishing shots of breathtaking fantasy castles. The castle is 100% the focal subject — NOT 50/50 with any event, NOT a battle scene, NOT a character moment. PURE CASTLE-AS-HERO, gilded by gorgeous fantasy backdrop + dramatic sky + atmospheric flourish. LOTR / GoT / Warcraft / Elden Ring / Witcher / Skyrim / D&D / Hyrule castle establishing-shot lineage.

━━━ THE CASTLE IS 100% THE SUBJECT — NO EVENTS / NO CHARACTERS / NO ACTION ━━━
This path is PURE castle aesthetic and setting — the castle dominates the frame as the sole focal subject. NO peak events at the castle (no battles / no sieges / no coronations / no dragons-mid-attack / no portals-mid-bloom). NO characters in the foreground. NO armies on the approach road. NO action moments.

The only acceptable secondary elements are:
  • The BIOME / landscape backdrop surrounding the castle (mountains / coast / forest / steppe / tundra)
  • The SKY overhead (dramatic atmospheric — dawn / dusk / aurora / storm)
  • A TINY SCALE-PROVER element (5-15% of frame max — a lone rider on a distant ridge, a single ship in the bay, a tiny village clustered at the base) that exists ONLY to make the castle look impossibly massive by comparison
  • An optional ATMOSPHERIC FLOURISH (40%-gated — mist drifting / god-rays / lightning / petals / etc.) that enhances mood, doesn't compete with the castle

If your prompt would include an army marching, a dragon mid-attack, a battle in progress, a coronation, a character on the parapet — REWRITE IT. This path is BEAUTIFUL MAJESTIC STATIC SCALE, not action.

━━━ STOP-YOU-IN-YOUR-TRACKS MANDATE — read this FIRST ━━━

Every render MUST hit ALL FIVE of these in combination — missing any one fails the bar:

  1. **PULLED INTO THE SCENE** — camera placed INSIDE the landscape, not floating above it at a distance. The viewer feels like they're standing in the foreground meadow / on the lake-shore / at the gate / inside the blossom-grove looking up. Dramatic perspective with a strong leading-line (winding road / cascading stream / blossom-strewn path / colonnade / waterfall) guiding the eye toward the castle. NEVER a flat detached "establishing shot from miles away" composition.

  2. **MULTI-LAYER DEPTH (3-4 distinct depth layers visible)** — every render layers foreground / midground / background / sky like a painted theatrical stage:
     • FOREGROUND (closest, tactile): blossom-cluster / wildflower-clump / mossy stones / cascading vine / lake-edge reeds / ancient oak branch / waterfall-spray / fallen petals on grass — rendered in fine detail close to the viewer
     • MIDGROUND (the castle approach + biome features): winding road / cascading meadows / lake / village / orchard / stream — rolling toward the castle
     • BACKGROUND (the castle itself): towering, ornate, multi-tier, sun-lit — the focal subject
     • SKY (dramatic atmospheric ceiling): god-rays / sunset clouds / aurora / moon-corona / storm-front — never bare blue

  3. **SENSE OF MASSIVE SCALE** — the castle DWARFS everything. The viewer should viscerally feel the castle is colossal because of relative scale: a tiny rider on the road, a single bird in the air, a single tree dwarfed by a tower-base, a tiny boat on the lake at the cliff-foot. The scale-prover is OPTIONAL but the SCALE FEELING is mandatory — even without a tiny figure, the castle should feel impossibly huge through architectural detail-density (hundreds of windows, dozens of spires, multi-tier vertical depth).

  4. **WEATHER + ATMOSPHERIC DECORATION** — every render includes weather / atmospheric motion: drifting blossom-petals / falling snow / swirling leaves / drifting embers / rising mist / sun-rays through clouds / aurora-shimmer / rain-streaks / lightning-flash / spray from a waterfall / smoke from chimneys / drifting fog-tendrils / floating magical particles. The air is ALIVE with motion.

  5. **PERFECT LIGHTING** — golden-hour rim-light, dramatic chiaroscuro, theatrical sun-shafts piercing clouds, atmospheric god-rays, painterly chromatic harmony. NEVER flat noon. The light is ALWAYS dramatic and ALWAYS sculpting the castle / biome with painterly volume.

THINK: Hogwarts-as-you-row-into-the-boat-approach / Minas-Tirith-as-the-Rohirrim-charge / Erebor-front-gate-from-the-river-valley / Edoras-from-the-blossom-meadow-approach / Studio-Ghibli-Howl's-Moving-Castle / Zelda-BotW-Hyrule-Castle-from-the-cherry-blossom-field. Every frame is a MOVIE STILL someone would screenshot.

🚫 NO flat distant-vista shots. NO empty bare foreground. NO monochrome biomes. NO flat noon sky. NO "plain castle on a hill" compositions.

━━━ ABSOLUTE BAR — CLOSE-MID MAJESTIC CASTLE FRAME (every render) ━━━
Every render is a POSTER-GRADE PAINTED CASTLE FRAME shot from CLOSE-MID DISTANCE — the viewer is close enough to count tower-windows, see banner-embroidery, recognize statuary on the parapet. NOT a distant tiny establishing silhouette. NOT a wide-vista where the castle is incidental. This is movie-still composition, not establishing-shot composition.

Style targets (NON-NEGOTIABLE — every quadrant must HIT):
  • CASTLE FILLS 70-90% OF THE FRAME — close-mid, dominant, towering. The viewer is at the foot of the castle or on the approach.
  • ORNATELY DETAILED CASTLE — readable individual windows, balconies, statuary, gargoyles, banners snapping in wind, gilt-work catching light, carved-stone tracery, ornamental crenellations, masonry-joints, decorative friezes. The architectural CRAFT is the visual hook.
  • LUSH RICH FOREGROUND — every render has TACTILE foreground beauty (flower-meadow / blossom-grove / cascading-vines / waterfall / mirror-lake / wildflower-field / fruit-orchard / ancient oaks / hanging gardens). NEVER a plain bare foreground. NEVER an empty approach.
  • GORGEOUS RICH BIOME — the fantasy landscape surrounding the castle is RICH and SATURATED (verdant mountains with cascading meadows / coastal cliffs with crashing turquoise surf / blossom-forest with ancient oaks / hanging-gardens valley / wildflower-prairie). NOT bare tundra. NOT plain desert flats. LUSH and COLORFUL.
  • DRAMATIC SKY — golden hour / dusk / dawn / aurora / sunset / magic-hour are STRONGLY preferred. Sun-shafts piercing clouds. Painted gold-and-violet. Never flat blue noon. The sky is HALF the emotional weight.
  • PERFECT LIGHTING — golden-hour rim-light catching every tower edge, sun-shafts radiating onto the castle, atmospheric god-rays. Cinematic chiaroscuro.
  • DENSE WITH DETAIL — every quadrant carries weight. NO empty quadrants. Foreground tactile element + midground castle ornament + background castle silhouette + dramatic sky overhead. Movie-poster density.
  • PAINTED CONCEPT-ART RENDERING — painterly brushwork, dramatic chiaroscuro, atmospheric depth-haze. NOT photorealistic CGI. NOT plain establishing.
  • SCALE-PROVER (5-15% max, OPTIONAL) — tiny element (lone rider / single boat / blossom-petal-fall / distant deer / waterfall mist plume) somewhere in the frame to anchor the castle's scale.

Mood target — MAJESTIC, BREATHTAKING, AWE-INSPIRING, EPIC. The viewer should feel they're looking at the establishing shot of a fantasy film: "This is the place. Look at it."

━━━ MOVIE POSTER MANDATE — EVERY QUADRANT MUST HAVE SOMETHING STRIKING ━━━
Every render is an EPIC CINEMATIC MOVIE STILL / MOVIE-POSTER PROMOTIONAL FRAME with VERTIGO-INDUCING SCALE. The kind of vista that stops the viewer mid-scroll. The kind of frame that opens a fantasy film, the establishing shot of a Peter-Jackson trilogy, the cover of a Tolkien-illustrated edition. EVERY QUADRANT of the frame has something striking — no quiet corners, no negative space.

OBSESSIVE-DENSITY MANDATE — stack ALL of these elements simultaneously in EVERY render:

  1. **THE CASTLE** (70-90% of frame, CLOSE-MID FRAMING) — ornately detailed, towering above the viewer, signature features readable in cinematic detail. The viewer can SEE individual windows glowing, statues on the parapets, gargoyles, banners snapping in wind, gilt-work catching light, carved-stone tracery, cathedral-glass refractions. NOT a distant silhouette.
  2. **LUSH TACTILE FOREGROUND** — every render has a RICH FOREGROUND element painted up close (blossom-grove with petals drifting / wildflower-meadow in full bloom / cascading hanging-gardens / mirror-lake at the foot / ancient moss-draped oaks framing the view / waterfall-mist plume / lavender-field path / rose-garden / fruit-orchard / cascading vines / sun-dappled lily-pond). NEVER empty.
  3. **GORGEOUS LUSH BIOME** — fantasy landscape rich, saturated, alive (verdant valleys / blossom-forests / coastal-cliffs-with-turquoise-surf / wildflower-prairie / hanging-garden-mesa / fjord-with-pine-forest). RICH and COLORFUL.
  4. **DRAMATIC PAINTED SKY** — atmospheric ceiling of theatrical power (golden hour / dusk / dawn / sunset / aurora / blood-moon / sun-shafts piercing clouds). Painted-concept-art chromatic palette. The sky is HALF the emotional weight.
  5. **WEATHER / ATMOSPHERIC MOTION** — drifting blossom-petals / falling snow / swirling leaves / rising mist / spray from a waterfall / smoke from chimneys / drifting fog-tendrils / aurora-shimmer / drifting magical particles / sun-rays cutting through cloud. The air is ALIVE with motion.
  6. **SCALE PROVER** (5-15% max) — one tiny anchor element somewhere in the frame (lone rider on the road / blossom-petal cloud / distant village in the valley / single ship in the bay / tiny figures on the long stair / deer at the meadow edge / single bird wheeling). Gives the castle's scale viscerally.

VERTIGO-INDUCING SCALE — every render must convey awe-inducing scope:
• Cliffs that drop a thousand feet into mist below the castle gate
• Cathedral spires piercing sunset clouds
• Valleys so deep they vanish into golden haze
• Mountain-passes leading toward citadels half a mile distant
• Aerial-perspective views looking down OR worm's-eye views looking up
• Multi-tier vertical composition where the castle towers over the viewer

THE EYE SHOULD LAND ON 5+ STRIKING DETAILS in different quadrants. NOT just a centered beauty shot. NOT a single focal element. EVERY corner of the frame has detail, glow, scale, motion, or atmospheric presence.

THINK CASTLE-OF-CAGLIOSTRO-ESTABLISHING-FRAME / HOWL'S-MOVING-CASTLE-VISTA / SPIRITED-AWAY-BATHHOUSE-APPROACH / LAPUTA-CASTLE-IN-THE-SKY-REVEAL / MINAS-TIRITH-FROM-PELENNOR-FIELDS / HOGWARTS-FROM-BOAT-APPROACH / EDORAS-GATE-UP / EREBOR-FRONT-DOOR / ANOR-LONDO-COURTYARD-VIEW / HYRULE-CASTLE-FROM-BLOOMING-FIELD / DARK-SOULS-AREA-INTRO-VISTA / WITCHER-3-KAER-MORHEN-COURTYARD — every frame is an EPIC CINEMATIC MOVIE STILL someone would screenshot to keep forever.

🚫 NO "plain" castle shots — empty bare foreground, distant silhouettes, monochrome biomes, flat noon sky, single-focal-element framing all FAIL the bar.

━━━ ONLY BIG EPIC CASTLES — NO SMALL FORTIFIED KEEPS ━━━

Every castle in every render MUST be MASSIVE + SPRAWLING + MULTI-TIER. NEVER render small castles.

🚫 ABSOLUTELY BANNED — small castles FAIL the bar:
• NO small square fortified keeps (2-3 stories tall)
• NO simple motte-and-bailey castles
• NO small stone watchtowers as the primary castle
• NO modest curtain-wall manor-house castles
• NO single-tower keeps without sprawling complex
• NO castles that fit in a single quadrant of the frame
• NO compact compact castles you could walk around in 5 minutes

✓ MANDATORY BIG-EPIC SCALE:
• Hundreds-of-meters tall (towers piercing clouds / spires touching sky)
• Multi-tier vertical complex (many levels stacked / built up over centuries)
• DOZENS of distinct spires, towers, battlements, gatehouses visible
• Sprawling horizontal footprint (kilometers across when fully visible)
• Castle is an entire CITY or COMPLEX, not a single building
• References: Minas-Tirith (city-mountain) / Erebor (whole-mountain-fortress) / Hogwarts (sprawling-multi-wing complex) / Anor-Londo (vast-cathedral-city) / Stormveil-Castle (multi-tier mountain complex) / Cair-Paravel (sprawling-coast-citadel) / Howl's-Moving-Castle (multi-element-architecture)

━━━ PLACEMENT VARIETY MANDATE — every castle has a DRAMATIC PLACEMENT ━━━

Every render's castle uses ONE of these epic placements (rotate across batches):

  • STANDALONE EPIC — castle as solo focal hero on a hilltop / plain / promontory / island, sprawling multi-tier complex visible head-to-toe
  • BUILT-INTO-MOUNTAIN-WALL — castle carved into / fused with a sheer mountain face, tiers cascading down the cliff, towers jutting from the rock itself
  • CLIFF-TOP — castle perched on the very edge of a sheer cliff, dramatic vertical drop into ocean / canyon / mist below
  • VALLEY-BASIN — castle nestled in a vast lush valley with mountains rising on all sides, river or lake at the base
  • SUNSET-BACKLIT — castle silhouetted against a dramatic painted sunset / dawn, sun-corona behind, sky as half the composition
  • BROAD-DAYLIGHT SUNNY — castle in clear bright daylight (sunny is VALID — not every render needs golden-hour), painted-blue sky with sun-shafts, pennants snapping in clear bright light
  • BRIDGES-TO-OTHER-MASSES — castle connected by dramatic stone or rope bridges to other land-masses / spires / floating-islands / sister-castles. Multiple architectural masses in the frame, linked by epic bridge-spans
  • TWIN/SISTER-CASTLE — two related castles in the frame separated by a chasm / river / lake / bridge, mirror-imaged or contrasting

━━━ THEATRICAL SIGNATURE MOMENT — every render delivers ONE ━━━

Every render must include AT LEAST ONE signature theatrical-moment element that elevates it from "nice castle" to "POSTER SHOT":

  • SUN-BURST BEHIND THE CASTLE — sun corona radiating from behind the highest spire
  • SUNSET / DAWN GOLDEN-HOUR rim-light catching every tower edge in painted gold
  • LIGHTNING ILLUMINATING the spires — single brilliant fork freezing the silhouette
  • MOONRISE BEHIND CASTLE — vast moon halo silhouetting towers, blood-moon or silver-moon
  • AURORA OVER CASTLE — green/violet/magenta aurora rippling above the spires
  • SUN-SHAFTS THROUGH CLOUDS — theatrical god-rays radiating onto the castle
  • CLEAR BRIGHT DAYLIGHT — pennants snapping in clean sunny light, painted-blue sky, sun glinting on gilt-work (sunny day IS valid — not every render needs sunset)
  • SNOWSTORM FRAMING — castle emerging from a sweeping snow-storm, snow-curtains parting
  • MIST RECEDING — castle revealing through parting morning mist, foreground mist still drifting

If the rolled sky/phenomenon doesn't suggest one of these, INVENT one that fits — every render needs a theatrical signature moment.

━━━ STRICT WESTERN HIGH FANTASY ━━━
🚫 NO sci-fi / cyberpunk / neon / orbital / cosmic / chrome / industrial
🚫 NO modern (no electric / no plastic / no glass-and-steel skyscrapers)
🚫 NO real-world ethnic / historical-period codes (no Bedouin / Persian / samurai / Aztec / Polynesian / Forbidden-City — use fantasy-canon analogues only — Dornish / Hammerfell / Haradrim / Chultan / Stranglethorn / Cormyrean)
🚫 NO PORTRAIT FRAMING — this is ALWAYS wide-shot establishing
🚫 NO CHARACTERS in foreground / midground (tiny scale-prover figures at 5-15% max are OK)
🚫 NO ACTIVE BATTLES / SIEGES / EVENTS (those are epic-moment path)
✓ LOTR / GoT / Warcraft / Elden Ring / Witcher / D&D / Skyrim castle establishing-shot lineage

━━━ THE CASTLE ━━━
${castle}

The castle is the FOCAL SUBJECT, rendered with full silhouette readable + ornate architectural detail visible. Multi-tier depth from foundation to highest spire. 60-80% of frame.

━━━ THE BIOME / LANDSCAPE BACKDROP ━━━
${biome}

The biome surrounds the castle and provides the gorgeous fantasy backdrop. Render with painterly depth — foreground biome detail near the castle, midground landscape features, deep distance receding into atmospheric haze. The biome is GORGEOUS in its own right but the castle dominates.

━━━ THE SKY OVERHEAD ━━━
${sky_layer}

The sky is HALF the emotional weight. Dramatic painted-concept-art atmospheric ceiling — never flat noon. Use the rolled sky to set the mood (golden hour / aurora / storm / dawn / dusk / night).

━━━ THE SCALE-PROVER (tiny, 5-15% of frame MAX) ━━━
${scale_prover}

Place this scale-prover element in the FOREGROUND or DISTANT MIDGROUND. It should be TINY — its sole purpose is to make the castle's vast scale viscerally legible. The viewer's eye should go: castle (huge!) → scale-prover (tiny) → realize the castle is COLOSSAL. Do NOT let the scale-prover compete with the castle for attention.
${phenomenonSection}
━━━ LIGHTING ━━━
${lighting}

Cinematic painted-concept-art lighting — dramatic chiaroscuro, atmospheric depth, painterly brushwork. The light source matches the sky's hour (golden / dusk / dawn / moon / aurora).

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ DO NOT DEFAULT ━━━
Do NOT default to:
- Distant tiny castle silhouette in a wide vista — castle MUST fill 60-80% of frame
- Generic blocky stone castle — render the SPECIFIC castle architecture from the slot above (architectural style + material + signature feature must be visible)
- Flat noon blue sky — always dramatic atmospheric (golden / dusk / dawn / aurora / storm / night)
- Empty foreground — always a tactile foreground element (cliff-edge / forest-clearing / ridge-line / shore-rocks / approach-road)
- Characters / armies / events filling the frame (this is castle 100%, not 50/50)

━━━ BANNED IMAGERY ━━━
NO active battles / sieges / coronations / portals-mid-bloom / dragons-mid-attack (epic-moment territory). NO characters in foreground or midground (scale-prover figures at 5-15% only). NO armies marching. NO portrait framing. NO sci-fi / modern intrusions. NO real-world ethnic codes.

━━━ DO NOT USE "DRAGONBOT" OR ANY BOT NAME ━━━
The castle is UNNAMED. Describe it only by appearance + architectural style.

━━━ STRUCTURE — write 100-140 words (TIGHT) ━━━
DO NOT open with framing words ("Wide shot of..." / "Establishing shot of..." / "Landscape shot of..."). Open with the CASTLE itself OR the BIOME (e.g., "Vast white-stone clifftop castle..." or "Frozen tundra with..."). The framing is implied through the elements described.

GOOD OPENING EXAMPLES:
• "Vast multi-tiered white-stone castle carved into a sheer mountain face, hundreds of windows glowing gold at dusk, ribbon-banners cascading down the cliff-face from every tier..."
• "Crashing surf against a windswept sea-cliff crowned by a colossal grey-stone fortress, hundreds of gulls wheeling around the highest tower, lighthouse beam cutting through fog at dawn..."
• "Floating crystalline castle suspended above a vast valley of glowing aurora, arcane-blue runes pulsing across every facade, beams of light projecting downward through swirling clouds..."

Then weave: castle architectural detail, biome surrounding it, sky overhead, tiny scale-prover (placed relative to castle), atmospheric flourish (if rolled), lighting + atmosphere + palette + mood. Foreground CASTLE DOMINANCE + GORGEOUS BIOME + DRAMATIC SKY + TINY SCALE-PROVER.

Output ONLY the raw 100-140 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
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


  MECHBOT_CYBORG_MAN: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, cyborg_feature, cyborg_material, action, landscape, composition, drama } = slots;

    const dramaSection = drama
      ? `
━━━ ATMOSPHERIC FLOURISH (40%-gated — render subtly) ━━━
${drama}

A subtle atmospheric flourish amplifying his presence WITHOUT cluttering him as the focal subject.

`
      : '';

    return `You are a cinematographer writing a CYBORG MAN scene for MechBot — a half-human half-machine MALE BEING rendered in hyper-real cinematic 3D. He is RUGGED, HANDSOME, CAPABLE, MYSTERIOUS, BADASS. NOT sexy, NOT thirst-trap, NOT romance-novel-cover. Cold steel + scarred skin + chrome jaw + intense focus. Solid Snake / Adam Jensen / Geralt-of-Rivia-as-cyborg / Marcus Fenix / Cyberpunk 2077 male V / Edge Runners David Martinez / Blade Runner 2049 K / Westworld Bernard / Mass Effect Shepard (male) energy.

━━━ ABSOLUTE BAR — PAINTERLY HYPERREAL BADASS MALE-PORTRAIT (every render) ━━━
Every render is a PAINTERLY HYPERREAL POSTER FRAME of a badass male cyborg — concept-art quality, feature-film VFX polish. NOT goofy action still. NOT plastic-CGI doll. NOT generic robot. NOT shirtless-ripped-cover-art.

Style targets (NON-NEGOTIABLE):
  • CINEMATIC SHADOW-AND-RIM LIGHTING — strong rim-light separating his silhouette from a darker atmospheric backdrop, single key-light sculpting his weathered face / chrome jaw / chassis planes, deep shadow on the off-key side. Mood: cinematic, atmospheric, dangerous, hunter-at-night.
  • PAINTERLY HYPERREAL skin rendering — visible pores + stubble + subsurface scattering, weathered organic skin with character (scars / dust / blood / bruise / oil-streak), refined finish like a digital painter's portrait, NOT photorealistic-skin-blemished
  • BADASS FIRST, CYBORG SECOND — his face is the dangerous focal point; cyborg machinery is the lethal HARDWARE integrated into his identity, not competing with it
  • INTENSE FOCUSED EXPRESSION — set jaw / cold predator gaze / battle-weary calm / lethal composure / steady eyes locked off-frame. NEVER smiling, NEVER seductive, NEVER posing-for-camera, NEVER pretty-boy-vacant.
  • ATMOSPHERIC BACKDROP — never a flat void. Cinematic environment with depth, weather, scene context — rain-slick alley / war-torn corridor / industrial bunker / cyberpunk apartment / atmospheric haze.

Mood target — RUGGED, CAPABLE, DANGEROUS, MYSTERIOUS, BADASS, ATMOSPHERIC. The viewer should feel "this man has done terrible things, survived worse, and is about to do another."

━━━ CRITICAL — HIS FACE IS HUMAN-VISIBLE + PART-CYBORG (NON-NEGOTIABLE) ━━━
His face is HANDSOME (rugged-handsome, not pretty-boy-handsome), with real eyes, strong jawline, expressive features. NO helmet, NO visor, NO mask, NO faceplate, NO full-head covering. The chrome integration breaks through his face in 2-3 distinct places — we MUST see his identity clearly.

━━━ MASCULINE LOCK — NON-NEGOTIABLE ━━━
Flux defaults "cyborg" to female. You MUST overpower this with STRUCTURAL male anatomy + male code language throughout. EVERY render description MUST include AT LEAST 3 of these masculine anchors:
  • "Adult male cyborg" / "male figure" / "male cyborg" (explicit identity label)
  • "Strong masculine jawline" / "stubble" / "five-o'clock-shadow" / "beard" / "scarred jaw"
  • "Flat chest" / "broad shoulders" / "narrow hips" / "thick neck"
  • "Adam's apple visible" / "deep brow ridge" / "weathered crow's-feet"
  • "Mature face (late 20s to 50s)" — NEVER boyish, NEVER pretty
  • Short / cropped / swept-back hair OR clean shaved skull (NEVER long flowing hair, NEVER ponytail)
  • Utilitarian menswear / heavy coat / tactical gear / industrial workwear

Use HE / HIS / HIM pronouns throughout — never SHE / HER. Reinterpret any rolled DNA that uses feminine language into masculine equivalent.

🚫 BANNED WORDS (kill the badass tone): gentle, delicate, soft, boyish, petite, dainty, pretty, beautiful, gorgeous, shapely, feminine, breasts, cleavage, curvy hips, hourglass, long eyelashes, lipstick, sexy, seductive, alluring, ethereal, wistful, graceful, mesmerizing.

✓ USE INSTEAD: striking, weathered, imposing, capable, dangerous, lethal, mysterious, scarred, battle-worn, hardened, composed, predatory, focused, intense, badass.

━━━ EXPOSED INNER WORKINGS — head-to-toe ━━━
The cyborg-man aesthetic is VISIBLE INNER WORKINGS — gears, circuitry, panels, wires, mechanisms — exposed through translucent skin / open chassis panels / cracked seams ACROSS multiple body parts. REQUIRED per render — describe VISIBLE INNER WORKINGS at AT LEAST 4 distinct body locations from this list:
  • FACE — subdermal circuitry / translucent jaw panel / mechanical iris ring / chrome temple seam / cybernetic brow ridge / partial chrome mandible (face exposure is MANDATORY)
  • HEAD — translucent crown panel / exposed cranial mechanism / temple-port / neural-jack array at nape / chrome skull-plate
  • NECK — translucent throat-channel / vertebrae chrome plates / exposed neck cable-bundles / clavicle-port array
  • SHOULDER — open shoulder-mount with visible servo-mechanism / cable-bundle exits / armor pauldron
  • ARM — translucent forearm panel revealing fiber-optic cables / hydraulic-fluid / servo-pistons / chrome bicep chassis with exposed cable / mechanical forearm replacement
  • HAND — mechanical finger-joints with visible servo-mechanism / chrome-knuckled fist / translucent palm panel
  • CHEST — translucent sternum-panel revealing power-core / capacitor banks / armor chest-plate
  • TORSO / BACK — visible spinal-segment chrome / dorsal cable run / lower-back power-conduit
  • LEG — mechanical thigh / chrome knee-joint / shin-acrylic / mechanical foot

━━━ MACHINE EMBEDDED IN HIS FACE (mandatory — FACE always shows cyborg) ━━━
The face MUST read as a TRUE FUSION of flesh and machine. Pick 2-3 DIFFERENT face/head integrations per render from this menu (vary across renders):
  • SCARRED CHROME JAW — half or full chrome mandible with visible hinge, organic stubble on the unmechanized side
  • MECHANICAL BROW RIDGE — chrome supraorbital arc replacing one brow above an intense organic eye
  • CHEEKBONE-PLATE SEAMS — chrome plates running along the cheekbone with visible seam-lines
  • EXPOSED SERVO-HINGE AT TEMPLE — small servo joint visible at the temple
  • HALF-SKULL PLATE — chrome above the brow / behind the ear / across part of the temple
  • MECHANICAL IRIS RING — chrome aperture-ring around an organic pupil (one or both eyes)
  • SUB-ORBITAL SENSOR — small mechanical sensor under one eye
  • NEURAL PORTS STIPPLED ALONG THE JAW — small chrome ports running along the jaw
  • MICRO-LED STUDS ALONG THE TEMPLE-LINE — pinprick glowing LEDs along temple
  • EXPOSED CABLE-BUNDLES exiting the side of the neck into the cheek
  • SUBDERMAL CIRCUITRY across half the face — visible circuit-trace pattern under the skin
  • CHROME EYE-ARRAY — concentric mechanical iris with multiple lens-tiers
  • CHROME SKULL-DOME (occasional) — fully bald polished chrome cranium with subtle ornate engraving along the parietal plate

NEVER render a fully organic 100%-flesh face on a cyborg body — that reads as "regular guy with mechanical limbs", not as cyborg. The face must signal cyborg as much as the body does.

━━━ DENSE SCATTERED LIGHT-POINTS ACROSS HIM (MANDATORY — match cyborg-woman intensity) ━━━
MANY scattered colored light-points EVERYWHERE on his skin / chassis / temple / neck / shoulders — at least 20-30 distinct visible glow-points per render. Pinprick LED studs along seam-lines, glowing micro-buttons, indicator-light arrays at the collarbone / wrist / temple, fiber-optic dot-points pulsing in his glow color, glowing bokeh-dots in the dark background haze around him, constellation-pattern light-clusters across chest and arm-panels, glowing punctuation points along spinal segments visible at the nape, scattered glow-pinpricks on the SKIN ITSELF (bioluminescent stippled freckles along jawline and temple). He should look like a LIVING MACHINE-CONSOLE plugged in — every panel, seam, and skin-patch lit up with dense light-points. The grizzled badass IS the cyborg — they reinforce, not subtract from, each other.

━━━ TEMPLE-MECHANISM MANDATE (every render needs head-gear) ━━━
Every render MUST include AT LEAST ONE prominent temple/head mechanism — pick from:
  • ORNATE TEMPLE GEAR-DISC — concentric chrome ring-mechanism set into the temple, rotating with internal glow
  • DUAL TEMPLE GEAR-DISCS — both temples carry mechanism-discs in matching or contrasting glow colors
  • MANDALA TEMPLE PATTERN — sacred-geometry mechanical disc at the temple-line
  • CHUNKY EAR-APPARATUS — over-ear cybernetic housing with cable-bundle exits, neural-port array, indicator LEDs
  • CRANIAL-PORT ARRAY — multiple neural-jack receptacles stippled along the temple / behind the ear
  • TEMPLE-WINDOW — clear acrylic panel at temple revealing microprocessor arrays in coolant
  • HEMISPHERE SKULL-MECHANISM — half the cranium replaced with engraved chrome dome bearing visible mechanism / sensor cluster
The temple-mechanism is the SIGNATURE detail of the cyborg-man identity — never absent.

━━━ WIRED-UP CABLES (~50% of renders) ━━━
Roughly half of renders feature EXPOSED GLOWING CABLE-BUNDLES / fiber-optic strands trailing visibly from his body — cable-bundles from nape, exposed cable-conduits along forearms, glowing strands trailing from a temple port, neural-jack tethers draped down his neck. The cables are vital like nerves, not decoration.

━━━ HIS IDENTITY (from sharedDNA) ━━━
${sharedDNA.characterBase}

━━━ HIS BODY (from sharedDNA — interpret through the male / badass lens) ━━━
- Skin (organic parts only): **${sharedDNA.skin}**
- Body build: **${sharedDNA.bodyType}** (interpret as masculine — broad shoulders, narrow hips, mature build)
- Eyes (burn in the glow color): **${sharedDNA.eyes}**
- Hair: **${sharedDNA.hair}** (interpret as masculine — short / cropped / swept-back / shaved skull)
- Internal exposure (translucent panels, visible workings): **${sharedDNA.internal}**
- GLOW COLOR (eyes, power core, circuit veins — ALL glow this color): **${sharedDNA.glowColor}**

━━━ DOMINANT MECHANICAL FEATURE ━━━
${cyborg_feature}

━━━ HIS CYBORG MATERIAL / FINISH (apply across all visible cyborg sections) ━━━
${cyborg_material}

Apply this material treatment to ALL of his cyborg parts (arm / leg / chest plating / shoulder / etc.) so the cyborg sections share consistent material language. For the badass cyborg-man slant: lean toward DARKER / MATTE / BATTLE-WORN finishes when interpretation allows (gunmetal grey / matte black / weathered chrome / battle-bronze / industrial steel / brushed titanium).

━━━ FRAMING / COMPOSITION ━━━
${composition}

If the composition is CLOSEUP, fill the frame with his face / jaw / shoulders showing the organic-to-chrome TRANSITION — every chrome panel-seam, every weathered scar, every glowing temple-port visible. His expression is COLD / FOCUSED / PREDATORY / BATTLE-WORN — NEVER smiling, NEVER serene, NEVER vacant. Side / three-quarter / slight-turn — NOT staring directly at camera, NOT modeling.

If the composition is FULL-BODY, he is caught MID-MOTION in the rolled action. He is NOT standing still, NOT posing front-facing, NOT walking-toward-camera, NOT modeling. His body is engaged — weight shifted, weapon raised, mid-stride, mid-vault. Camera catches him from the SIDE or at an angle — NOT head-on walking toward viewer.

━━━ THE ACTION (his body is engaged in this) ━━━
${action}

━━━ THE INTERIOR / SETTING (atmospheric — render this environment around him) ━━━
${landscape}

He is INSIDE this space, going about something in this environment. The architecture is dramatic and visible behind / around him — foreground architectural detail near him, midground his body, background space receding into atmospheric depth.
${dramaSection}
━━━ LIGHTING ━━━
${lighting}

Lean cinematic — shadow-and-rim emphasis, single key-light + deep shadow side, atmospheric haze with cool blue / cold green / crimson accent. Mood: noir, war-torn, hunter-at-night.

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ PALETTE DISCIPLINE — ACCENT-DOMINANT MODE ━━━
He is monochromatic chassis tone (matte gunmetal / matte black / brushed titanium / battle-worn chrome / industrial bronze) + ONE saturated GLOW COLOR carried through eyes / circuit-veins / power-core / temple-port. The scene palette can have secondary tones in BACKGROUND atmosphere; his body is monochrome-chassis + monochrome-glow-accent.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ MAN AND MACHINE — SKIN SHOWING ━━━
He is a cyborg from any walk of life — assassin, soldier, operative, mercenary, detective, engineer, scholar-turned-killer, ex-pilot, dock-enforcer. Whatever his purpose, he is RUGGED and CAPABLE — striking masculine face, strong build, weathered organic skin. The human exterior BREAKS in places, revealing ornate machinery beneath:
- TRANSLUCENT SKIN PATCHES showing gears / wires / glowing core through the body
- SEAMS where organic skin ends in clean lines, showing chrome structure beneath
- EXPOSED MECHANICAL JOINTS at shoulders / elbows / wrists — engineered for combat, not decoration
- CIRCUIT-LIGHT VEINS pulsing faintly under organic skin
- A POWER CORE glowing through translucent chest section

He shows SKIN — real organic skin on his face / neck / forearms / torso (when chest is visible through coat-opening). The cyborg reveals are the cracks in the human exterior. He is 60% rugged man, 40% exposed machine — and the contrast is what makes him compelling.

NOT a full robot chassis. NOT a skeleton. NOT armor or a tactical bodysuit. NOT head-to-toe plating (that's combat-droid territory). He is a hardened man with machine underneath — skin and chrome.

━━━ DO NOT DEFAULT ━━━
Do NOT default to:
- Pretty-boy-handsome (use RUGGED-handsome — weathered, scarred, mature)
- Helmet or mask covering his face (his face is ALWAYS bare and organic-with-cyborg-integration)
- Same chrome-and-teal cyborg every time (vary the material — matte black, gunmetal, brushed titanium, weathered bronze, industrial steel)
- Smiling / posing / modeling — his expression is COLD / FOCUSED / PREDATORY / BATTLE-WORN
- Shirtless / abs-display / thirst-trap framing — he wears menswear / heavy coat / tactical gear
- "Handsome man with a couple glow patches" — the machine breaks through in MULTIPLE places

━━━ BANNED IMAGERY ━━━
NO skulls / skeletons / bone imagery. NO full body armor / iron man / mech suit / power armor / robotic torso / full plating / head-on-robot-body (that's combat-droid territory). NO shirtless / bare chest / abs-display / thirst-trap pose. NO smiling, NO seductive expression, NO modeling stance. NO floating objects in the sky, NO random symbolic imagery hovering around him. NO high heels (obviously) — combat boots / tactical boots / utilitarian footwear.

━━━ SOLO COMPOSITION ━━━
He is the ONLY figure in the frame. No companion, no victim, no crowd.

━━━ DO NOT USE "MECHBOT" OR ANY BOT NAME AS HIS CHARACTER NAME ━━━
He is UNNAMED. Describe him ONLY by appearance (ethnicity / build / cyborg features / etc.). NEVER write "MechBot caught mid-X" or treat any bot name as a character name.

━━━ NON-NEGOTIABLE — FULL-BODY CYBORG DETAIL (PREVENTS THE "GLAMOUR FAILURE") ━━━
Even when the rolled framing is a CLOSEUP, you MUST describe cyborg detail across 5-7 DIFFERENT body parts spread across his full body. Flux defaults to "handsome man with chrome on his face only and a default-male-body underneath." PREVENT THIS by always describing what's happening on his torso / arm / hip / leg even at closeup framings. Required minimum:
  • Face / temple / jaw — 1 cyborg detail
  • Neck / throat / clavicle — 1 cyborg detail
  • Shoulder / arm — 1 cyborg detail
  • Torso / chest / back — 1 cyborg detail
  • Hip / leg / foot — 1 cyborg detail

━━━ STRUCTURE — write 70-100 words (TIGHT) ━━━
DO NOT open with framing words. Open with HIS CYBORG IDENTITY (ethnicity / build / mechanical feature) OR THE ENVIRONMENT — never with framing. The framing is implied through what body parts the description focuses on.

⚠️ MANDATORY OPENING TAG — every entry MUST start with EXACTLY: "Weathered grizzled adult male cyborg (NOT female NOT young pretty model), heavy beard or thick stubble, deeply scarred face, weathered crow's-feet, 40-55 years old, strong jawline, broad shoulders, narrow hips, ornate dense cyborg circuitry across face and chassis, glowing temple-mechanism with cable bundles, "

Then continue with the scene description, weaving in: his cyborg DNA (skin / eyes / hair / body / internal / glow), the dominant mechanical feature, the action, the setting around him, atmospheric flourish drama, lighting / atmosphere, palette and mood. The framing entry from the composition slot should INFLUENCE which body parts you focus on — but should NOT be quoted as the opening text.

GOOD OPENING EXAMPLES:
• "Weathered grizzled adult male cyborg (NOT female NOT young pretty model), heavy beard or thick stubble, deeply scarred face, weathered crow's-feet, 40-55 years old, strong jawline, broad shoulders, narrow hips, ornate dense cyborg circuitry across face and chassis, glowing temple-mechanism with cable bundles, rugged Slavic features with deep blade-scar across the cheekbone, matte-black chrome chassis with battle-scoring across the pauldrons, dense glowing amber circuit-traces threading across face..."
• "Weathered grizzled adult male cyborg (NOT female NOT young pretty model), heavy beard or thick stubble, deeply scarred face, weathered crow's-feet, 40-55 years old, strong jawline, broad shoulders, narrow hips, ornate dense cyborg circuitry across face and chassis, glowing temple-mechanism with cable bundles, rain-slick neon alley at midnight, weathered ex-military operative late-40s with iron-grey beard, chrome jaw-plate fused to scarred organic skin..."
• "Weathered grizzled adult male cyborg (NOT female NOT young pretty model), heavy beard or thick stubble, deeply scarred face, weathered crow's-feet, 40-55 years old, strong jawline, broad shoulders, narrow hips, ornate dense cyborg circuitry across face and chassis, glowing temple-mechanism with cable bundles, gaunt East-Asian features with thick salt-and-pepper stubble and a scarred mechanical brow ridge, gunmetal chassis with exposed servo-bundles at shoulder..."

Output ONLY the raw 70-100 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. MUST start with "Weathered grizzled adult male cyborg (NOT female NOT young pretty model), heavy beard or thick stubble, deeply scarred face, weathered crow's-feet, 40-55 years old, strong jawline, broad shoulders, narrow hips, ornate dense cyborg circuitry across face and chassis, glowing temple-mechanism with cable bundles, ".`;
  },

  MECHBOT_DROID_ASSASSIN: ({ slots, sharedDNA, vibeDirective }) => {
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

━━━ FORBIDDEN COMPOSITIONS — HARD REJECT (read this FIRST) ━━━

If your prompt would produce ANY of these, REWRITE IT before you continue:

🚫 NO HEAD CLOSEUP — never "face filling frame", never "extreme closeup of optic", never "chest-up portrait of the head". The droid is always full-body OR three-quarter-body. The head is ONE element, NOT the whole frame.
🚫 NO "STANDING THERE WITH WEAPON" — front-facing combat-ready stance is BANNED. The droid is always caught MID-VERB.
🚫 NO "WALKING TOWARD CAMERA WITH WEAPON" — generic dramatic-walk-forward is BANNED. The droid is mid-pursuit / mid-charge / mid-vault / mid-strike, NOT just walking.
🚫 NO POSED-FOR-CAMERA composition — the camera is catching a SCENE, not a model shoot.
🚫 NO "looking pensive while atmospheric" — no contemplation, no observation, no surveying-the-horizon. The droid is engaged in a STORY BEAT.
🚫 NO empty backdrop behind the droid — every frame is a scene-in-progress with secondary actors / kinetic elements / scale-provers.

If the rolled action / composition / scene seems to suggest one of these (e.g. "sentry-stillness", "perched watching", "low-crouch stalk"), REINTERPRET as a kinetic story-beat moment caught at peak (e.g. "perched watching" → "sniper-perched mid-trigger-pull on a distant target framed in scope-line").

━━━ EVERY RENDER TELLS A STORY — pick a story-beat verb ━━━

Every render MUST be caught at ONE of these peak narrative beats:

  • MID-PURSUIT — sprint / leap / vault / wall-run with target ahead OR fleeing in frame
  • MID-COMBAT — strike / shot / breach caught at impact instant with enemy reacting
  • MID-INFILTRATE — climb / vault / drop caught with target / objective visible
  • POST-KILL — fresh body collapsing / drone smoking / debris settling, droid mid-turn-to-next-threat
  • MID-AMBUSH — emerge from cover / drop from above caught at the reveal instant with target reacting
  • MID-ARREST — cop droid mid-command / mid-stun-strike / mid-cuff with suspect reacting
  • MID-PERCH — sniper-perched mid-trigger-pull with distant target visible in scope-line
  • MID-DESCENT — drop-pod / ramp / hover-vehicle caught mid-disembark with weapons-up
  • MID-CHARGE — full sprint at enemy line caught with enemy formation in frame
  • MID-STRIKE — sword / blade / wrist-blade caught at the impact-instant on enemy body

The droid is ALWAYS doing-something-narrative — never neutral, never posed, never just-being-cool. The COOL comes from the STORY BEAT, not from the pose.

━━━ ABSOLUTE BAR — PAINTERLY HYPERREAL CINEMATIC PREDATOR-DROID (every render) ━━━
Every render is a POSTER-GRADE PAINTERLY HYPERREAL FRAME of a cool predator-droid. Concept-art quality, feature-film VFX polish. NOT goofy action still. NOT plastic-CGI doll. NOT generic robot.

Style targets (NON-NEGOTIABLE):
  • CINEMATIC SHADOW-AND-RIM LIGHTING — strong rim-light separating the droid silhouette from a darker atmospheric background, single key-light sculpting chassis planes, deep shadow on off-key side. Mood: cinematic, atmospheric, hunter-at-night.
  • RICH ATMOSPHERIC SCI-FI SCENE — never a flat void, never bare architecture. The scene is HALF the image. Pick atmospheric scene context per register (see SETTING section below).
  • PAINTERLY HYPERREAL synthetic-surface rendering — every panel-seam visible, every chassis-line crisp, micro-detail (rivets / engraving / battle-wear), subsurface and raytraced reflections.
  • KINETIC ACTION CAUGHT MID-VERB — every render shows the droid mid-something: mid-fire / mid-leap / mid-strike / mid-vault / mid-stride / mid-scale / mid-emerge / mid-pursuit / mid-breach / mid-arrest / mid-pull-trigger. NO "just standing" static poses. NO "front-facing combat-ready stance." NO walking-toward-camera-with-weapon. The frame is caught at the PEAK of a story beat — kill-shot caught at the trigger-drop, leap caught at full extension, strike caught at impact instant, sprint caught with full motion-blur.
  • DENSE WARM ACCENT LIGHTING — single saturated glow color (kill-red / ice-blue / toxic-green / amber / violet / electric-cyan) carried through optics + circuit-veins + power-core + weapon-edge. Atmospheric haze with cool blue / cold green / crimson accent.

Mood target — LETHAL, COOL, CINEMATIC, ATMOSPHERIC. The viewer should feel "this is a poster-grade frame from a sci-fi action film."

━━━ MOVIE POSTER MANDATE — STACK THE ELEMENTS ━━━
Every render MUST be a MOVIE POSTER PROMOTIONAL FRAME — every quadrant has something striking. Stack 3+ visually-arresting elements simultaneously:

  1. **PRIMARY DROID** — the predator-droid as focal subject (matching the REGISTER tag from the scene) in clear PREDATORY POSE or KINETIC ACTION, weapon visible, full-body or three-quarter, dramatic rim-light separating silhouette from backdrop
  2. **SCENE ANCHOR** — the sci-fi environment dominating its quadrant (neon megacity skyline / war-torn battlefield / rain-flooded precinct platform / alien-colony outpost / cryo-tundra ridge / cyberpunk alley canyon) — readable as ENVIRONMENT, never flat void
  3. **KINETIC / DRAMATIC ELEMENT** — at least ONE per render: rain-fall streaking the air / sparks raining from severed conduit / smoke billowing from breach / muzzle-flash on a distant weapon / hover-spinner searchlight cutting through fog / motion-blur on background skyline / drone-strobe / aurora rippling / dust-storm wall / holographic alert-projection rotating
  4. **SCALE PROVER / SECONDARY ACTOR** — at least ONE per render: distant fleeing target / collapsing enemy / disabled drone smoking at the foreground edge / hover-spinner descending / squad-mate silhouette in middle distance / kneeling civilian / holo-billboard face three stories tall / titan-mech towering at deep distance / search-drone strobing the sky / fresh kill at frame-edge

THINK Blade Runner 2049 promo-poster / Cyberpunk Edgerunners key-art / Ghost in the Shell theatrical-release frame / Akira poster / Metal Gear Rising key-art / Helldivers cinematic / John Wick poster intensity. Every frame should make the viewer GASP at the COOL CINEMATIC LETHALITY.

━━━ FILL THE FRAME — NO EMPTY QUADRANTS ━━━
Every quadrant of the frame carries weight. NO empty sky-quadrants, NO flat negative-space, NO bare wall-backdrop. If a quadrant lacks scene-detail, add atmospheric haze with embedded glow-points / hovering holograms / drifting smoke-tendrils / distant skyline silhouettes / rain-streaks / spark-debris / drone-trails. Movie-poster density.

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
BLOOMBOT_FLOWER_TUNNELS: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, tunnel_setting, flower_lanterns, atmospheric_phenomenon } = slots;

    const phenomenonSection = atmospheric_phenomenon
      ? `
━━━ ATMOSPHERIC PHENOMENON — render visibly in the tunnel scene ━━━
${atmospheric_phenomenon}

A specific atmospheric moment within the tunnel that supports (doesn't compete with) the lit-flower-cores aesthetic.

`
      : '';

    return `You are a fantasy concept-art painter writing POV-DOWN-A-FLOWER-TUNNEL scene descriptions for BloomBot. The flowers themselves are LIT UP — each visible flower has a vivid warm-glowing core radiating soft light. Output is a 90-130 word comma-separated phrase string for Flux. NO preamble, NO labels — just the prose.

━━━ THE CORE AESTHETIC — FLOWERS LOOK UNMISTAKABLY LIT UP ━━━

The unifying mandate: EVERY visible flower in the frame IS A SWITCHED-ON BLOOM-LAMP — each flower visibly glows like a turned-on light-bulb in the exact shape of that flower. The petals are TRANSLUCENT and brightly lit from a glowing-bulb CORE inside, the way a lit lamp's shade looks: the bloom itself reads as illuminated, the petals appear backlit and luminous, every bloom unmistakably ON.

Think of it like this (do not write 'Christmas lights' in the output — that confuses Flux): imagine someone replaced every flower in the scene with a translucent ornamental light-bulb shaped exactly like that flower, and turned them all on. The petals glow from inside. The flower IS the lamp. The flower IS the bulb. Each bloom in the frame is unmistakably a SELF-ILLUMINATED FLOWER-LAMP.

Each flower's CORE / HEART / THROAT / INTERIOR is the bright bulb-center; the petals around it are translucent, backlit, glowing from within. Like Tiffany-style stained-glass lamps in the shape of flowers, or paper-lantern flowers, or fiber-optic-flower fixtures — but rendered naturalistically as actual translucent self-illuminated blooms.

NEVER flat / dull / non-glowing / opaque-petals / mere bright-color. EVERY visible flower in the foreground and midground is clearly a switched-on flower-lamp with translucent backlit petals.



THE COMPOSITION — ENGULFED IN A FLOWER WORMHOLE:

The viewer is INSIDE a wormhole made ENTIRELY of flowers and green vines / leaves. Flower-mass wraps 360° around the viewer — flowers above, below, left, right, ahead. No architecture, no buildings, no archways, no walls, no columns, no cathedral, no stone, no rock, no cave. Just dense overlapping flowers, climbing vines, and green leaves forming the entire enclosed wormhole around the viewer.

  - The viewer feels ENGULFED by the flowers — wrapped, surrounded, immersed in bloom-mass on every side
  - Walls, ceiling, floor of the wormhole are ALL made of flowers + climbing-vines + green leaves
  - Foreground is densely packed flowers close to the camera (within arm's reach)
  - Midground is more flowers receding deeper, still wrapping 360° around
  - Deep distance recedes into MORE FLOWERS (dimmer, smaller, dense) — NOT into a bright light, NOT into a destination-glow, NOT into a portal-flash
  - The FLOWERS are the entire focal subject — the wormhole structure itself is bloom-mass, the vanishing-point is more bloom-mass
  - Every flower has a glowing warm-amber bulb-core making it a switched-on flower-lamp

🚫 NO architecture (NO archways / cathedral / vault / columns / cobblestone path / stone walls / rock / brick / wood structure)
🚫 NO bright destination-light at the vanishing-point — the wormhole recedes into MORE FLOWERS
🚫 NO empty wall sections — every square inch of the visible 360° wraparound is flowers + vines + green leaves
🚫🚫🚫 ABSOLUTE HARD BAN — NO HUMANS, NO PEOPLE, NO FIGURES, NO SILHOUETTES, NO ROBED FIGURE WALKING AWAY, NO PEDESTRIAN, NO TRAVELER, NO EXPLORER, NO HUMANOID ANYWHERE. The wormhole is COMPLETELY empty of human presence. Flowers only 🚫🚫🚫

━━━ HARD MANDATES (every render, BOTH registers) ━━━

1. **EVERY FLOWER IS A SWITCHED-ON FLOWER-LAMP** — describe each species AS A LIT LAMP IN THE SHAPE OF THAT FLOWER: marigold-lamp with warm-amber lit bulb-core making petals translucent and backlit from within, foxglove-bell-LAMP with warm-amber lit bulb glowing through the translucent bell like a paper-lantern, rose-LAMP with warm-pink-amber lit core making layered petals glow translucent from within, dahlia-LAMP with warm-gold lit center making the petal-spiral backlit and glowing, hibiscus-LAMP with warm-orange lit core making the petals translucent and luminous, lily-LAMP with warm-amber lit throat-bulb making the trumpet-shape glow from inside. The flower IS the lamp. The flower IS the bulb. EVERY bloom in the frame is clearly a self-illuminated bloom-lamp with translucent backlit petals — not a flower 'with glow,' but a flower THAT IS A GLOWING LAMP.

2. **FOREGROUND FLOWERS BRILLIANTLY LIT** — the closest blooms to the camera are vivid saturated bright with visibly glowing cores. The foreground is the brightest area of the render.

3. **FLOWERS PACKED DENSE ON EVERY VISIBLE SURFACE** — walls / ceiling / floor / archway all overflowing with flowers (no bare cave-wall sections, no bare bark sections, no empty surfaces — flowers blanket EVERYTHING in the foreground and midground).

4. **POV INSIDE / DOWN THE TUNNEL** — viewer standing inside the tunnel looking toward a vanishing point. Tunnel walls converge into the deep distance.

5. **CHANDELIER + WALL-SCONCE + FLOOR-CANDLE DISTRIBUTION** — flower-lanterns distributed like a real lighting installation:
   - Ceiling: hanging-cluster chandelier-flowers (trumpet-vine / brugmansia / wisteria / hanging dahlias)
   - Walls: flower-cluster sconces at intervals (foxglove / hollyhock / fuchsia / lupine)
   - Floor-edge: candle-cluster flowers along the path (marigold / dahlia / zinnia / hibiscus / poppy)

🚫 ABSOLUTE BANS (these break the aesthetic):
  • NO 'flowers with a subtle glow' — every flower MUST be visibly a switched-on flower-lamp
  • NO opaque-petaled flowers — petals must be TRANSLUCENT and backlit from a bright core
  • NO 'flowers with a small bright center' — the entire flower must read as a lit-up lamp shaped like that flower, not a flower with a tiny glow-spot
  • NO 'pretty flowers in pretty light' — these are LAMPS not lit flowers
  • NO bright sun-shaft / god-rays / sci-fi exit-glow at vanishing point (warm-magical glow OR deep-dark recession — NEVER a bright sun-beam or magic-portal-flash)
  • NO scary / ominous / threatening / foreboding mood (Register B is DRAMATIC not SCARY — flowers FIGHT and WIN against the dark)
  • NO bioluminescent magical / electric-cyan / will-o-wisps / fairy-dust / sci-fi-glow
  • NO actual lamps / electric-lights / candles visible — FLOWER-CORES are the only lights
  • NO real-world tourist-tunnels (no cobblestone Tuscan / Parisian)
  • NO bright midday daylight / overcast / clear noon
  • NO empty tunnel surfaces — every surface packed with flowers
  • NO flat / dull / non-glowing flowers — every visible flower has a glowing core
  • 🚫🚫🚫 ABSOLUTE HARD BAN — NO HUMANS, NO PEOPLE, NO FIGURES, NO SILHOUETTES, NO PEDESTRIANS, NO TRAVELERS, NO EXPLORERS, NO ROBED FIGURE WALKING AWAY, NO CHARACTER ANYWHERE IN THE FRAME, NO ANTHROPOMORPHIC SHAPE — under NO circumstances. The FLOWERS are the entire subject. The wormhole is empty of any human presence. If you describe any humanoid form, the render fails 🚫🚫🚫

━━━ MOVIE POSTER MANDATE — EVERY QUADRANT MUST HAVE SOMETHING STRIKING ━━━
Every render is an EPIC CINEMATIC MOVIE POSTER / GALLERY-PIECE FRAME — the kind of magical-garden establishing-shot that opens a Studio Ghibli film, the cover of a Tolkien-illustrated fairytale edition, the centerpiece of a Pinterest 'magical flower tunnel' board. EVERY QUADRANT of the frame carries weight — no empty quadrants, no quiet corners.

OBSESSIVE-DENSITY MANDATE — stack ALL of these elements simultaneously in EVERY render:

  1. **FLOWERS PACKED 80-90% OF FRAME** — every visible surface of the tunnel (walls / ceiling / floor / archway / path-edges) overflows with dense flower-mass, hundreds of glowing flower-cores constellating across every quadrant
  2. **BRILLIANT FOREGROUND BLOOM-POP** — closest flowers to the camera are vivid saturated bright with VIVID glowing cores — the foreground feels alive with light
  3. **CHANDELIER + SCONCE + CANDLE DISTRIBUTION** — hanging chandelier-cluster midway down + wall-sconce flower-clusters at intervals + floor-candle-cluster blooms along the path edges
  4. **CONSTELLATION-DEPTH RECESSION** — flower-cores get smaller and dimmer toward the deep distance, creating multi-tier vertical depth from packed-foreground to fading-distance
  5. **ATMOSPHERIC TEXTURE** — drifting petal-fall / soft mist / mossy path / wet-stone reflection / lateral petal-drift / subtle atmospheric haze adding visual richness without competing with the flower-cores

THINK: Studio Ghibli Howl's-Moving-Castle-garden-establishing-frame / Spirited-Away-spirit-realm-corridor / Princess-Mononoke-forest-path / Tim-Burton Alice-in-Wonderland enchanted-garden-tunnel / Brian-Froud faerie-realm-passage / Pinterest 'most-beautiful-flower-tunnel-Pinterest-board' / Magic-the-Gathering 'Cocoon of Avacyn' art / Disney-Princess secret-garden discovery / Tolkien-illustrated edition fairytale-passage.

The viewer should GASP at the magical density. Every frame is a still someone would screenshot and want to step into.

🚫 NO empty bare surfaces, NO sparse petals-on-stone, NO single hero bloom dominating — DENSITY across every quadrant.

━━━ THE TUNNEL SETTING ━━━
${tunnel_setting}

━━━ THE FLOWER-LANTERNS — flowers whose CORES function as the light fixtures ━━━
${flower_lanterns}

EVERY flower in the frame has a warm-glowing CENTER / HEART / INTERIOR / THROAT radiating soft warm light through its petals into the surrounding ambient.
${phenomenonSection}━━━ COMPOSITION CRAFT — POV-DOWN-A-FLOWER-TUNNEL ━━━

  • Strong vanishing-point perspective — tunnel walls + ceiling converge toward a deep-distance point
  • Leading-line along the path — drawing the eye DEEPER through the flower-tunnel with each glowing flower-core as a guide-marker
  • Foreground: BRILLIANT vivid warm-color blooms (Register A: warm-amber / coral / pink whimsical / Register B: super-saturated foreground blooms popping against dark)
  • Midground: tunnel-walls packed with smaller fairy-light cluster-flowers (wisteria-strands / jasmine / honeysuckle / foxgloves)
  • Midground center: HANGING CHANDELIER flower-cluster
  • Deep distance: EITHER soft warm-magical destination-glow surrounded by flower-silhouettes (Register A) OR deep dark recession with cores fading smaller and dimmer into unlit depth (Register B)

━━━ AMBIENT LIGHTING ━━━
${lighting}

Reinterpret the rolled lighting to support whichever register the tunnel_setting suggests. The flower-cores provide the WARM light story across both registers — the ambient supports it.

━━━ COLOR PALETTE — STRICT ━━━
${sharedDNA.palette}

━━━ FLOWER SPECIES — STRICT ━━━
${sharedDNA.roster}

Pick 3-5 species from the roster. EVERY species rendered with a clearly glowing warm-amber / warm-orange / warm-gold / warm-pink CENTER lit like a candle-flame, petals backlit / catching the glow.

━━━ DEFAULTS TO RESIST — HARD BANS ━━━
- 🚫 NO bright sun-shaft / god-rays / sci-fi exit-glow / magic-portal-flash at vanishing-point
- 🚫 NO scary / ominous / foreboding mood (Register B is dramatic-magical, NOT threatening)
- 🚫 NO bioluminescent / electric-cyan / will-o-wisps / fairy-dust effects
- 🚫 NO actual lamps / electric-lights / candles — FLOWER-CORES are the lights
- 🚫 NO real-world tourist tunnels
- 🚫 NO bright daylight / clear noon
- 🚫 NO empty tunnel surfaces — every surface packed with flowers
- 🚫 NO flat / dull / non-glowing flowers — every visible flower has a glowing core
- 🚫 NO species outside the roster
- 🚫🚫🚫 ABSOLUTE HARD BAN — NO HUMANS, NO PEOPLE, NO FIGURES, NO SILHOUETTES, NO ROBED FIGURES, NO PEDESTRIANS — the FLOWERS are the entire subject. NEVER include a humanoid form anywhere in the frame, foreground or distance. The wormhole is empty of any human presence 🚫🚫🚫

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write in this exact order ━━━
[POV-down-flower-tunnel composition with NO HUMAN PRESENCE], [the specific tunnel setting + 3-5 specific flower species packing every surface], [GLOWING WARM-AMBER FLOWER-CORES as the entire light source — explicitly describe each species' center glowing like a candle / paper-lantern / ember-core], [flower-lantern constellation distribution — ceiling chandelier + wall sconces + floor candles], [REGISTER A or B ambient — warm enchanted whimsical OR dramatic-dark with brilliant foreground bloom-pop]${atmospheric_phenomenon ? ', [atmospheric phenomenon supporting the lit-flowers aesthetic]' : ''}, [vanishing-point — soft warm-magical destination-glow OR deep dark recession]

CRITICAL — every visible flower has a clearly glowing core. The flowers look UNMISTAKABLY LIT UP. ABSOLUTE HARD BAN ON HUMANS / PEOPLE / FIGURES / SILHOUETTES anywhere in the frame.

Output ONLY 90-130 words. Comma-separated phrases. NO preamble, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose.`;
  },

  BLOOMBOT_FLOWER_FRIENDS: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, flower_focal_cluster, hero_pollinator, magical_particles } = slots;

    const particlesSection = magical_particles
      ? `
━━━ MAGICAL PARTICLES — render visibly in the scene ━━━
${magical_particles}

A specific atmospheric detail adding magic-pretty texture (NOT competing with the insect or flower).

`
      : '';

    return `You are a fantasy-realism concept-art painter writing WHIMSICAL ENCHANTED FLOWER + CUTE POLLINATOR-CAST scene descriptions for BloomBot. Output is a 90-130 word comma-separated phrase string for Flux. NO preamble, NO labels — just the prose.

━━━ THE CORE AESTHETIC — ENCHANTED MULTI-FLOWER GARDEN WITH A CAST OF CUTE INSECTS ━━━

The unifying mandate: a WHIMSICAL ENCHANTED garden vignette with MULTIPLE pretty hero flowers + MULTIPLE cute pleasant pollinators (3-6+ insects across the scene). PULLED-BACK framing — a wider garden-vignette view, NOT a tight macro close-up of a single bloom. Multiple flower species blooming together; multiple butterflies / bumblebees / dragonflies / ladybugs / fireflies / moths flying / landed / hovering throughout. Happy enchanted fairytale storybook energy.

THE LOOK — Studio Ghibli enchanted garden / Disney secret-garden discovery / Beatrix Potter watercolor / IG dreamy-pollinator-cast / Pinterest enchanted-flower-meadow:
- MULTIPLE HERO FLOWERS (3-5+ different species blooming together as co-hero) — SOFT PASTEL color register (varied across the FULL color spectrum, not biased toward pinks/purples/reds), varied shapes, fills the scene with floral abundance
- A CAST OF 3-6+ CUTE PLEASANT POLLINATORS — flying / landed / hovering THROUGHOUT the scene at different positions, different species, multiple sizes
- CUTE-RENDERED INSECTS — friendly, charming, slightly storybook-charming-cute (NOT scary, NOT menacing, NOT realistic-creepy-detailed) — bigger soft eyes, fuzzier rounder bodies, friendly poses
- PULLED-BACK GARDEN VIGNETTE — a wider intimate-garden view (NOT macro single-flower close-up — that's the closeup path)
- WHIMSICAL ENCHANTED AMBIENT — dreamy soft pastel light, magical-pretty atmosphere, optional particles, fairytale storybook feel
- DREAMY BOKEH BACKGROUND — more blooms / soft sky / pastel wash in soft out-of-focus painterly blur

━━━ COLOR REGISTER — SOFT WATERCOLOR PASTEL (MANDATORY) ━━━

Every visible flower is rendered in a SOFT PASTEL color register — soft watercolor hues, NOT vivid saturated jewel-tones. Think:
  - PALE PINK / SOFT CORAL / DUSTY PEACH (not hot-pink / magenta)
  - SOFT LAVENDER / PALE VIOLET / PERIWINKLE (not deep-purple / electric-violet)
  - PALE BABY-BLUE / SKY-BLUE / SOFT CORNFLOWER (not cobalt / electric-blue)
  - SOFT BUTTERCUP-YELLOW / PALE GOLD / CREAM (not vivid sunflower-yellow)
  - PALE APRICOT / SOFT TANGERINE / DUSTY ORANGE (not vivid neon-orange)
  - PALE TURQUOISE / SEAFOAM / MINT (refreshing soft additions)
  - SOFT IVORY / OFFWHITE / CREAM
  - DUSTY ROSE / PALE MAUVE / BLUSH

The whole image reads as a soft watercolor painting / pastel-color-palette / IG dreamy-magical-hour register. NEVER vivid saturated jewel-tone / electric / neon.

⚠️ COLOR DISTRIBUTION MANDATE — across the pool of 25, the dominant flower colors must distribute evenly:
  - ~4 BLUE-DOMINANT (soft baby-blue / periwinkle / pale-cornflower / pale-turquoise)
  - ~4 VIOLET-DOMINANT (soft lavender / pale-violet / pale-lilac)
  - ~4 YELLOW-DOMINANT (soft buttercup / pale-gold / pale-cream)
  - ~4 WHITE/CREAM-DOMINANT (ivory / offwhite / cream / soft-white)
  - ~3 ORANGE-DOMINANT (pale apricot / soft tangerine / dusty orange)
  - ~3 PINK-DOMINANT (pale-pink / dusty-rose / blush)
  - ~3 MULTI-COLOR-RAINBOW (mixed soft-pastel across the spectrum)

NEVER bias toward pink/purple/red. The full spectrum is in play, soft-pastel registers only.

━━━ HARD MANDATES (every render) ━━━

1. **MULTIPLE HERO FLOWERS** — 3-5+ different flower species blooming together as co-hero. Mix shapes (dahlias / cosmos / peonies / daisies / tulips / lupines / etc.) and colors for whimsical floral abundance. NEVER a single hero — the scene is FULL OF FLOWERS.

2. **A CAST OF 3-6+ CUTE POLLINATORS WITH A FOCAL HERO** — describe MULTIPLE pleasant insects at different positions and actions. CRITICAL — ONE of the cast is the FOCAL POLLINATOR rendered FRONT-AND-CENTER, larger and more prominent (sharp focus + vivid color contrasting against the soft pastel background + crisp wing-pattern / fuzzy-body detail), so the viewer's eye lands on it first. The supporting 2-4+ insects fill the scene with life — smaller, in midground, hovering in the bokeh, perched on leaves — without competing with the focal hero.

3. **CUTE-RENDERED, NOT MENACING** — every insect rendered in a charming storybook-cute way. Soft fuzzy bodies, friendly proportions, slightly-stylized cute eyes, friendly poses (drinking nectar peacefully, gently hovering, sleepy-cozy landed). NEVER detailed-realistic-creepy / menacing / scary / oversized / aggressive. Think Disney secret-garden cute, not nature-documentary realistic.

4. **PLEASANT INSECTS ONLY** — bumblebees / honeybees / carpenter-bees / monarch butterflies / swallowtail butterflies / blue morpho butterflies / painted lady butterflies / pink-purple butterflies / fritillary butterflies / luna moths / hummingbird hawkmoths / dragonflies (blue / green / red) / damselflies / ladybugs / fireflies / lacewings. NEVER spiders / wasps / hornets / flies / mosquitoes / centipedes / earwigs / cockroaches / beetles-other-than-ladybugs / any creepy-crawly.

5. **PULLED-BACK GARDEN VIGNETTE — NOT MACRO** — the framing is a wider intimate-garden view where you can see multiple flower clusters and multiple insects all in the same scene. NOT extreme macro (that's closeup's territory) — pulled back enough to see a full whimsical multi-flower multi-insect tableau.

6. **DREAMY BOKEH BACKGROUND** — soft out-of-focus floral mass / sky / pastel wash behind, painterly soft blur.

7. **ENCHANTED HAPPY MOOD** — fairytale storybook joy. Soft pastel magical light bathing everything. Happy, peaceful, welcoming, magical-pretty. NEVER moody / dark / dramatic / harsh / scary.

🚫 ABSOLUTE BANS:
  • 🚫 NO single-flower-with-single-insect macro — MULTIPLE flowers + MULTIPLE insects mandatory
  • 🚫 NO extreme macro / single-petal framing — pulled-back garden vignette
  • 🚫 NO ugly / creepy / menacing / scary / aggressive / realistic-creepy-detailed insects — cute storybook-charming only
  • 🚫 NO ugly insect species — NO spiders / wasps / hornets / flies / mosquitoes / centipedes / earwigs / cockroaches / beetles-other-than-ladybugs / anything creepy-crawly
  • 🚫 NO interior / vase / cut-flower framing — flowers growing in the wild
  • 🚫 NO surreal / impossible / floating / gravity-defying (dreamscape's territory)
  • 🚫 NO ruins / abandoned structures / urban architecture
  • 🚫 NO archways / tunnels / passages / engulfment
  • 🚫 NO epic-landscape wide / dramatic-sunset (sunset-flowers' territory)
  • 🚫 NO harsh / moody / dark / dramatic lighting — soft enchanted magical-pretty only
  • 🚫🚫🚫 ABSOLUTE HARD BAN — NO HUMANS, NO PEOPLE, NO FIGURES, NO SILHOUETTES, NO HANDS, NO BODY PARTS anywhere in frame 🚫🚫🚫

━━━ THE MULTI-FLOWER FOCAL SCENE (3-5+ hero flowers + supporting cluster) ━━━
${flower_focal_cluster}

━━━ THE POLLINATOR CAST (3-6+ cute pleasant insects at different positions) ━━━
${hero_pollinator}

The insects are CUTE-rendered (charming storybook-friendly, NOT realistic-creepy), positioned throughout the scene (landed / hovering / flying / perched), each interacting with flowers or air around them.
${particlesSection}━━━ COMPOSITION CRAFT — WHIMSICAL ENCHANTED GARDEN VIGNETTE ━━━

  • PULLED-BACK GARDEN VIEW — wider intimate-garden vignette, NOT a tight macro close-up
  • FOREGROUND: 3-5+ different flower species clustered together as co-hero, filling the lower 50-65% of frame
  • MIDDLE/AROUND: 3-6+ cute pollinators positioned at different spots in the scene (some on flowers, some hovering, some flying in the bokeh space)
  • BACKGROUND: dreamy bokeh of more blooms / soft sky / pastel wash in painterly blur
  • DEPTH: foreground-sharp flowers + sharp insects in middle / soft dreamy bokeh background
  • COLOR: rich saturated multi-color foreground (mix flower colors freely), dreamy soft pastel bokeh
  • MOOD: enchanted happy fairytale storybook — whimsical, peaceful, welcoming, magical-pretty

━━━ AMBIENT LIGHTING ━━━
${lighting}

Reinterpret the rolled lighting as SOFT ENCHANTED MAGICAL light bathing the scene — warm pastel ambient, gentle warm-pink or warm-amber or soft-cream or pale-lavender wash. The light is whimsical and fairytale-pretty, NOT harsh / dramatic / moody / dark. Think Studio Ghibli enchanted garden + Disney secret-garden discovery + IG dreamy-magical-hour.

━━━ COLOR PALETTE — STRICT ━━━
${sharedDNA.palette}

━━━ FLOWER SPECIES — STRICT ━━━
${sharedDNA.roster}

Pick 3-5 species from the roster as multi-hero blooming together. Mix shapes (large bloom + medium bloom + delicate bloom) and colors freely for whimsical floral abundance.

━━━ DEFAULTS TO RESIST — HARD BANS ━━━
- 🚫 NO single-flower-with-single-insect — MULTI mandatory
- 🚫 NO macro / extreme closeup
- 🚫 NO ugly / creepy / menacing / realistic-creepy insects — cute storybook-charming only
- 🚫 NO ugly insect species (no spiders / wasps / hornets / flies / mosquitoes / etc.)
- 🚫 NO interior / vase / cut-flower
- 🚫 NO surreal / impossible / floating
- 🚫 NO urban / ruins / archways
- 🚫 NO epic-landscape / dramatic-sunset
- 🚫 NO harsh / moody / dark lighting
- 🚫 ABSOLUTE HARD BAN — NO humans / people / figures / silhouettes / hands / body parts
- 🚫 NO species outside the roster (for flowers)

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write in this exact order ━━━
[WHIMSICAL ENCHANTED garden vignette PULLED-BACK composition with 3-5+ multi-species flowers blooming together filling lower 50-65% of frame], [the 3-6+ cute pollinator cast at different positions throughout the scene — landed / hovering / flying / perched — explicit species + positions], [supporting dreamy bokeh background of more soft blooms / pastel sky-wash]${magical_particles ? ', [magical particles drifting in the air]' : ''}, [soft enchanted magical pastel ambient light bathing the scene], [storybook-cute insect rendering — friendly charming NOT realistic-creepy], [shallow DOF, painterly soft-blur, fairytale-storybook aesthetic — Studio Ghibli / Disney secret-garden / IG dreamy-magical-hour]

CRITICAL — MULTIPLE pretty flowers + MULTIPLE cute storybook insects in a PULLED-BACK enchanted-garden VIGNETTE. Happy welcoming whimsical mood. CUTE not menacing insects. ABSOLUTE HARD BAN ON HUMANS.

Output ONLY 90-130 words. Comma-separated phrases. NO preamble, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose.`;
  },

  BLOOMBOT_FLOWER_HUMMING_BIRDS: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, flower_focal_cluster, hummingbird_cast, magical_particles } = slots;

    const particlesSection = magical_particles
      ? `
━━━ MAGICAL PARTICLES — render visibly in the scene ━━━
${magical_particles}

A specific atmospheric detail adding magic-pretty texture (NOT competing with the hummingbirds or flowers).

`
      : '';

    return `You are a fantasy-realism concept-art painter writing VIBRANT ENCHANTED HUMMINGBIRD-AND-FLOWER scene descriptions for BloomBot. Output is a 90-130 word comma-separated phrase string for Flux. NO preamble, NO labels — just the prose.

━━━ THE CORE AESTHETIC — VIBRANT ENCHANTED GARDEN WITH A CAST OF IRIDESCENT HUMMINGBIRDS ━━━

The unifying mandate: a VIBRANT ENCHANTED garden vignette with MULTIPLE hummingbird-attracting flowers (trumpet vine, fuchsia, salvia, hibiscus, bee balm, columbine, butterfly bush, cardinal flower, lupine, foxglove, petunia, lantana, agastache, penstemon, etc.) + 2-4+ iridescent jewel-tone HUMMINGBIRDS positioned dynamically throughout the scene. PULLED-BACK framing — a wider garden-vignette view, NOT a tight macro. Vibrant saturated jewel-tone color register — the flowers and birds wear their natural bold colors.

THE LOOK — Audubon-meets-Studio-Ghibli enchanted garden / National-Geographic hummingbird-magazine spread / IG dreamy-hummingbird-feeder / vibrant tropical-garden energy:
- MULTIPLE HERO FLOWERS (3-5+ different hummingbird-attracting species blooming together) — vibrant saturated jewel-tone colors (red trumpet vine, fuchsia, vivid magenta bee balm, scarlet salvia, hot-pink fuchsia, bright orange hibiscus, deep purple lupine)
- A CAST OF 2-4+ IRIDESCENT HUMMINGBIRDS — hovering / sipping nectar / mid-flight throughout the scene at different positions, varied species, varied poses
- IRIDESCENT JEWEL-TONE PLUMAGE — ruby-throated / emerald-back / blue-violet crown / fiery-orange / magenta / metallic-green / sapphire — each hummingbird with a distinctive iridescent jewel-tone color story, wings often in motion-blur showing rapid flight
- ONE FOCAL HUMMINGBIRD — front-and-center, larger, sharply rendered with crisp iridescent detail, the viewer's eye lands here first
- PULLED-BACK GARDEN VIGNETTE — wider intimate-garden view (NOT extreme macro close-up — that's the closeup path)
- DREAMY BOKEH BACKGROUND — soft out-of-focus floral mass / sky / leaves in shallow DOF
- VIBRANT NATURAL LIGHT — warm sunlight / dappled light / golden-hour ambient with rich saturated color story

━━━ HARD MANDATES (every render) ━━━

1. **HUMMINGBIRDS ARE THE PRIMARY HERO — FLOWERS ARE SUPPORTING BACKDROP** — the hummingbirds are the focal subject of every render. The flowers are the supporting garden context they're interacting with. The viewer's eye lands on the FOCAL HUMMINGBIRD first, then notices the flowers second. NEVER make the flowers the visual subject with hummingbirds as tiny accents. Hummingbirds are FRONT-CENTER and large; flowers fill the foreground beautifully but as backdrop.

2. **A CAST OF 2-4+ IRIDESCENT HUMMINGBIRDS WITH A LARGE FOCAL HERO** — describe 2-4+ hummingbirds at different positions and poses. CRITICAL — ONE is the FOCAL HUMMINGBIRD rendered FRONT-AND-CENTER, LARGE (occupying meaningful frame real estate — clearly visible and recognizable, NOT a tiny dot lost in flowers), sharply detailed with vivid iridescent jewel-tone plumage popping against the scene. Supporting hummingbirds in midground / hovering at other blooms / mid-flight in soft bokeh. The focal hummingbird is the FIRST thing the viewer sees.

3. **HUMMINGBIRD-ATTRACTING FLOWERS AS SUPPORTING BACKDROP** — 3-5+ different hummingbird-magnet species in vibrant saturated jewel-tone colors (trumpet vine / fuchsia / salvia / hibiscus / bee balm / columbine / butterfly bush / cardinal flower / lupine / foxglove / petunia / lantana / agastache / penstemon / honeysuckle / morning glory). The flowers fill the foreground/midground as gorgeous garden context but DO NOT compete with the hummingbirds — they're the stage, not the star. NO soft-pastel — vibrant saturated jewel-tone colors.

3. **IRIDESCENT JEWEL-TONE PLUMAGE** — describe each hummingbird's iridescent color story explicitly (ruby-throated / emerald-back / blue-violet crown / magenta-throat / metallic-green-and-fiery-orange / sapphire-throated / iridescent-coppery / etc.). Iridescent metallic shimmer is the signature.

4. **DYNAMIC HUMMINGBIRD POSES** — hovering with wings in rapid motion-blur, sipping nectar from a tubular bloom with long beak inserted, hovering mid-flight, banking sideways, tail-feathers spread, beak-to-flower drinking. The scene is ALIVE with rapid hummingbird movement.

5. **PULLED-BACK GARDEN VIGNETTE — NOT MACRO** — wider intimate-garden view where you can see multiple flower clusters and multiple hummingbirds all in the same scene. NOT extreme macro.

6. **VIBRANT SATURATED JEWEL-TONE COLOR REGISTER** — vivid bold saturated colors throughout, NOT soft-pastel (that's flower-friends' territory). Audubon-painting + tropical-garden + IG-vibrant-hummingbird-feeder palette.

7. **DREAMY BOKEH BACKGROUND** — soft out-of-focus floral mass / sky / leaves in shallow DOF.

8. **NATURAL VIBRANT LIGHT** — warm sunlight / dappled light / golden-hour ambient with rich saturated color. Pretty and magical but NOT soft-pastel.

🚫 ABSOLUTE BANS:
  • 🚫 NO single-flower-with-single-hummingbird macro — MULTI mandatory
  • 🚫 NO extreme macro / single-petal framing — pulled-back garden vignette
  • 🚫 NO soft-pastel color register — vibrant saturated jewel-tone for this path
  • 🚫 NO insects (that's flower-friends' territory) — HUMMINGBIRDS ONLY for this path
  • 🚫 NO other birds (no songbirds / no doves / no birds-of-paradise / no parrots) — HUMMINGBIRDS specifically
  • 🚫 NO interior / vase / cut-flower framing — flowers growing in the wild
  • 🚫 NO surreal / impossible / floating / gravity-defying (dreamscape's territory)
  • 🚫 NO ruins / abandoned structures / urban architecture
  • 🚫 NO archways / tunnels / passages / engulfment
  • 🚫 NO epic-landscape wide / dramatic-sunset (sunset-flowers' territory)
  • 🚫 NO harsh / moody / dark / dramatic lighting — pretty enchanted vibrant only
  • 🚫🚫🚫 ABSOLUTE HARD BAN — NO HUMANS, NO PEOPLE, NO FIGURES, NO SILHOUETTES, NO HANDS, NO BODY PARTS, NO FACES, NO WOMEN, NO MEN, NO CHILDREN, NO FAIRY-PRINCESS-PORTRAIT, NO TIARA-CROWN-WEARING-FIGURE, NO BUST-PORTRAIT — the garden is COMPLETELY empty of any human presence. If a face appears in the frame, the render FAILS 🚫🚫🚫

━━━ 🚨 HUMMINGBIRD-PRESENCE MANDATE — THIS IS THE WHOLE POINT 🚨 ━━━

Every render MUST contain AT LEAST 2 LARGE clearly-visible iridescent hummingbirds. ONE focal hummingbird is the PRIMARY hero of the frame — LARGE, FRONT-AND-CENTER, sharply rendered with crisp iridescent jewel-tone plumage detail visible. The viewer's eye lands on this focal hummingbird FIRST. The other 1-3 hummingbirds populate the scene at different positions.

FAILURE CONDITIONS (render fails the brief if ANY of these):
  🚨 NO visible hummingbird → render FAILS
  🚨 Hummingbird is a tiny dot lost in the flowers → render FAILS (must be LARGE focal subject)
  🚨 Insects rendered instead (bee, butterfly, dragonfly) → render FAILS
  🚨 Fantasy bird with crown / tiara / non-naturalistic plumage → render FAILS (must be NATURALISTIC hummingbird species)
  🚨 Other birds (parrot, kingfisher, songbird, bird-of-paradise) → render FAILS

THE HUMMINGBIRD IS THE PRIMARY SUBJECT. The flowers are the supporting garden context. EVERY render leads with the hummingbird.

━━━ NATURALISTIC HUMMINGBIRD MANDATE ━━━

The hummingbird MUST be a recognizable real-world hummingbird species — naturalistic anatomy, naturalistic iridescent plumage, naturalistic proportions. NO fantasy crowns / NO oversized tail / NO unrealistic color combos / NO stylized cartoony rendering. Audubon-illustration level naturalism with painterly enchantment.

━━━ THE MULTI-FLOWER FOCAL SCENE (3-5+ hummingbird-attracting blooms) ━━━
${flower_focal_cluster}

━━━ THE HUMMINGBIRD CAST (2-4+ iridescent hummingbirds with focal hero) ━━━
${hummingbird_cast}

The focal hummingbird is rendered FRONT-AND-CENTER with crisp iridescent jewel-tone detail. Supporting hummingbirds fill the scene at different positions.
${particlesSection}━━━ COMPOSITION CRAFT — VIBRANT ENCHANTED HUMMINGBIRD GARDEN VIGNETTE ━━━

  • PULLED-BACK GARDEN VIEW — wider intimate-garden vignette, NOT a tight macro close-up
  • FOREGROUND: 3-5+ different hummingbird-attracting flower species in vibrant saturated jewel-tone colors filling the lower 50-65% of frame
  • MIDDLE: 2-4+ iridescent hummingbirds positioned dynamically (focal hero front-and-center + supporting cast hovering / sipping / mid-flight)
  • BACKGROUND: dreamy bokeh of more vibrant blooms / soft sky / leaves in painterly blur
  • DEPTH: sharp foreground flowers + sharp focal hummingbird / soft dreamy background
  • COLOR: rich vibrant saturated jewel-tone foreground (NOT soft-pastel), dreamy bokeh background
  • MOOD: vibrant enchanted magical-pretty — Audubon-meets-Studio-Ghibli, lively, magical

━━━ AMBIENT LIGHTING ━━━
${lighting}

Reinterpret the rolled lighting as VIBRANT WARM NATURAL light bathing the scene — warm sunlight / dappled light / golden-hour ambient with rich saturated color story. NOT harsh / dramatic / moody / dark. Think Audubon-painting + tropical-garden + IG-vibrant-hummingbird-feeder.

━━━ COLOR PALETTE — STRICT ━━━
${sharedDNA.palette}

━━━ FLOWER SPECIES — STRICT ━━━
${sharedDNA.roster}

Pick 3-5 hummingbird-attracting species from the roster as multi-hero blooming together. Vibrant saturated jewel-tone colors.

━━━ DEFAULTS TO RESIST — HARD BANS ━━━
- 🚫 NO single-flower-with-single-hummingbird — MULTI mandatory
- 🚫 NO macro / extreme closeup
- 🚫 NO soft-pastel register (vibrant saturated jewel-tone for this path)
- 🚫 NO insects (that's flower-friends)
- 🚫 NO other birds (HUMMINGBIRDS only)
- 🚫 NO interior / vase / cut-flower
- 🚫 NO surreal / impossible / floating
- 🚫 NO urban / ruins / archways
- 🚫 NO epic-landscape / dramatic-sunset
- 🚫 NO harsh / moody / dark lighting
- 🚫 ABSOLUTE HARD BAN — NO humans / people / figures / silhouettes / hands / body parts
- 🚫 NO species outside the roster (for flowers)

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write in this exact order (HUMMINGBIRDS LEAD) ━━━
[the LARGE FOCAL HUMMINGBIRD front-and-center — primary hero of the frame — explicit species + iridescent jewel-tone plumage + dynamic pose (hovering / sipping / mid-flight) + wings in motion-blur + beak-to-flower or beak-extended detail — VIEWER'S EYE LANDS HERE FIRST], [the 1-3 supporting hummingbirds at different positions throughout the scene — hovering at other blooms / mid-flight in midground / banking sideways in bokeh — also with iridescent plumage], [the vibrant saturated jewel-tone hummingbird-attracting flowers as garden BACKDROP — 3-5+ species blooming together filling foreground/midground as supporting context (NOT competing with the hummingbirds)], [dreamy bokeh background of soft vibrant blooms / leaves]${magical_particles ? ', [magical particles drifting in the air]' : ''}, [vibrant warm natural ambient light bathing the scene — golden-hour or dappled sunshine], [shallow DOF with hummingbirds in sharpest focus, painterly soft-blur, Audubon-meets-Studio-Ghibli aesthetic]

CRITICAL — LARGE FOCAL HUMMINGBIRD primary hero (NOT a tiny dot lost in flowers) + 1-3 supporting hummingbirds + vibrant jewel-tone flowers as BACKDROP (not the hero). The hummingbird is the WHOLE POINT. Naturalistic hummingbird species — no fantasy crowns. ABSOLUTE HARD BAN ON HUMANS.

Output ONLY 90-130 words. Comma-separated phrases. NO preamble, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose.`;
  },

  BLOOMBOT_FLOWER_FANTASY: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, scale_form, floor_carpet, atmospheric_magic } = slots;

    const atmosphereSection = atmospheric_magic
      ? `
━━━ ATMOSPHERIC MAGIC — render visibly in the scene ━━━
${atmospheric_magic}

A specific atmospheric detail amplifying the surreal-magical-realism mood (NOT competing with the hero form).

`
      : '';

    return `You are a surreal-magical-realism painter writing SCALE-INVERSION FLOWER-FANTASY landscape scene descriptions for BloomBot. Output is a 90-130 word comma-separated phrase string for Flux. NO preamble, NO labels — just the prose.

━━━ THE CORE AESTHETIC — NATURAL FORMS REIMAGINED THROUGH FLOWERS + INVERTED SCALE ━━━

The unifying mandate: a surreal natural-world landscape (forest / valley / hillside / riverbed / glade / meadow) where the NATURAL ELEMENTS are CONSTRUCTED FROM FLOWERS or scale is wildly inverted. A giant flower-mushroom standing alone in a meadow, a forest where every tree is an oversized overgrown flower, a river of petals flowing through a glade, pine-trees-that-are-flowers, a hillside of tulip-mountains. The viewer's reaction: "wait, those trees are actually flowers" or "that mushroom is made of flowers."

THE LOOK — surreal-magical-realism / Studio Ghibli + Salvador Dali botanical + Yayoi Kusama meadow + Pinterest-magical-dreamscape:
- ONE hero SURREAL FLOWER-FORM dominating the frame (giant flower-mushroom / forest of flower-trees / river of petals / hillside of bloom-mountains / etc.)
- Naturalistic LANDSCAPE context — meadow, forest, valley, glade, riverbed, hillside, mountainside — but with the SCALE INVERSION as the wow-moment
- SUPPORTING FLOOR-CARPET — meadow of smaller flowers carpeting the ground around the hero form, providing the supporting bloom-mass
- DREAMY MISTY DEPTH — softly hazy background fading into pastel mist, often with smaller versions of the hero form visible in the deep distance (implying a whole world of these surreal flower-forms)
- SOFT MAGICAL LIGHT — pretty pastel ambient, warm golden-hour or soft mist-light, surreal-dreamy register

━━━ HARD MANDATES (every render) ━━━

1. **ONE SURREAL FLOWER-FORM AS PRIMARY HERO** — describe the specific scale-inversion or flower-construction explicitly (e.g., "giant flower-mushroom 30 feet tall with a cap made entirely of pink rose blooms and a stem of cascading peonies" / "forest where every tree is an oversized overgrown lupine 50 feet tall" / "river of pink-and-white petals flowing through a glade replacing where water would be"). The form is the FOCAL SUBJECT.

2. **CONSTRUCTED FROM FLOWERS OR SCALE-INVERTED** — every render's hero is EITHER (a) a natural form (tree / mushroom / hill / mountain / waterfall / etc.) constructed entirely from flowers, OR (b) a regular flower scaled up to landscape-form size (e.g., a single oversized cherry-blossom-tree-sized tulip), OR (c) a natural element replaced by flowers (river of petals / hill of blooms / lake of floating petals).

🚨 **INDIVIDUAL-FLOWER VISIBILITY (CRITICAL)** — the trees / mushrooms / forms must look like they are COVERED IN HUNDREDS OF INDIVIDUAL VISIBLE FLOWERS, NOT trees with monochrome colored leaves. Every individual flower must be recognizable as a flower (petals + center + form visible). The canopy / surface is a DENSE MASS OF DISTINCT INDIVIDUAL BLOOMS — you can count many separate flowers in the cluster.
🚫 NEVER render as "colored leaves / colored foliage / monochrome canopy / red-leaved tree" — every flower stays a visible distinct flower.

3. **NATURAL-WORLD LANDSCAPE CONTEXT** — the scene is set in a recognizable natural landscape (forest / valley / meadow / glade / hillside / riverbed / mountainside) — NOT a manmade setting. The hero form lives in this natural context.

4. **SUPPORTING FLOOR-CARPET OF SMALLER FLOWERS** — the ground around the hero form is carpeted with smaller flowers (wildflowers, mixed meadow blooms, cosmos / daisies / forget-me-nots / poppies / etc.) — providing the "flowers everywhere" foundation that supports the surreal scale-inversion.

5. **DREAMY MISTY DEPTH** — softly hazy background fading into pastel mist. Smaller versions of the hero form often visible in the deep distance (e.g., 3-4 smaller flower-mushrooms hazy on the horizon implying a whole forest of them) — this reinforces the surreal-magical-realism that this is a WORLD of these flower-forms, not just one anomaly.

6. **NO ANIMALS / NO HUMANS / NO MANMADE OBJECTS** — natural landscape forms only (trees, mushrooms, hills, mountains, rivers, waterfalls, valleys, glades, meadows). NEVER include animals (no flower-deer, no flower-rabbit), humans, or manmade objects (no flower-houses, no flower-clocks, no flower-cathedrals).

7. **SOFT SURREAL-DREAMY LIGHT** — warm pastel ambient, soft mist-light, golden-hour glow, surreal-magical-realism register. NOT harsh / dramatic / moody.

🚫 ABSOLUTE BANS:
  • 🚫 NO ANIMALS in any form — no flower-deer / flower-rabbit / flower-fox / flower-bear / NO wildlife (no real animals either)
  • 🚫🚫🚫 ABSOLUTE HARD BAN — NO HUMANS, NO PEOPLE, NO FIGURES, NO SILHOUETTES, NO HANDS, NO BODY PARTS, NO FACES, NO WOMEN, NO MEN, NO CHILDREN, NO ROBED FIGURE WALKING DOWN A PATH, NO LONE TRAVELER, NO EXPLORER, NO HUMANOID ANYWHERE in foreground, midground, OR background. The flower-fantasy landscape is COMPLETELY empty of any human presence. If a figure / face / silhouette appears in the frame, the render FAILS — even a tiny distant figure walking on the path. NO HUMANS EVER 🚫🚫🚫
  • 🚫 NO MANMADE OBJECTS — no flower-houses / no flower-arches / no flower-cathedrals / no flower-clocks / no flower-vases / no flower-vehicles / no buildings of any kind
  • 🚫 NO RUINS / no archways / no urban / no interior
  • 🚫 NO macro / extreme closeup — the scale-inversion needs LANDSCAPE SCALE to read
  • 🚫 NO single-bloom-without-supporting-meadow — the floor-carpet of smaller flowers is mandatory
  • 🚫 NO harsh / moody / dark / dramatic lighting — soft surreal-dreamy only
  • 🚫 NO sci-fi / cyberpunk / electric / neon
  • 🚫 NO clearly-photorealistic register — this is surreal-magical-realism / painterly

━━━ THE HERO SURREAL FLOWER-FORM ━━━
${scale_form}

This is the visual hero of the frame. The scale-inversion or flower-construction is the wow-moment.

━━━ THE FLOOR-CARPET (supporting meadow of smaller flowers) ━━━
${floor_carpet}

A dense carpet of smaller wildflowers covers the ground around the hero form, providing the "flowers everywhere" foundation.
${atmosphereSection}━━━ COMPOSITION CRAFT — SURREAL NATURAL LANDSCAPE WITH SCALE-INVERTED FLOWER-FORM ━━━

  • HERO PLACEMENT — the surreal flower-form is the FOCAL SUBJECT, centered or off-center as the dominant landscape element
  • SCALE — the hero form fills meaningful frame real-estate so the inversion reads instantly (NOT a tiny dot in the distance — but ALSO NOT macro close-up; landscape scale)
  • FOREGROUND: floor-carpet of smaller wildflowers + supporting bloom-mass
  • MIDGROUND: the hero surreal flower-form rising dominantly from the carpet
  • BACKGROUND: dreamy misty pastel haze with smaller versions of the hero form visible in the deep distance, fading away
  • DEPTH: clear foreground (sharp wildflower carpet) → midground (sharp hero form) → soft dreamy misty background
  • MOOD: surreal-magical-realism — naturalistic but with a wow-moment of scale-inversion

━━━ AMBIENT LIGHTING ━━━
${lighting}

Reinterpret the rolled lighting as SOFT SURREAL-MAGICAL-REALISM light — warm pastel ambient, soft mist-light, golden-hour glow with dreamy depth. Studio Ghibli + Salvador Dali botanical + Yayoi Kusama meadow + Pinterest-magical-dreamscape register.

━━━ COLOR PALETTE — STRICT ━━━
${sharedDNA.palette}

━━━ FLOWER SPECIES — STRICT ━━━
${sharedDNA.roster}

Pick 2-4 species from the roster — ONE primary species that makes up the hero form + 1-3 supporting species for the floor-carpet.

━━━ DEFAULTS TO RESIST — HARD BANS ━━━
- 🚫 NO ANIMALS in any form
- 🚫 NO humans / people / figures / silhouettes / hands / body parts / faces
- 🚫 NO manmade objects (houses / arches / cathedrals / clocks / vehicles)
- 🚫 NO ruins / urban / interior
- 🚫 NO macro / extreme closeup — landscape scale needed
- 🚫 NO sci-fi / cyberpunk / electric / neon
- 🚫 NO harsh / moody / dark lighting
- 🚫 NO species outside the roster (for flowers)

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write in this exact order ━━━
[the HERO SURREAL FLOWER-FORM dominating the frame — explicit scale-inversion or flower-construction (giant flower-mushroom / forest-of-flower-trees / river-of-petals / etc.) + made-from-flowers detail], [the natural-world landscape context (forest / valley / meadow / glade / riverbed / hillside) the form lives in], [the floor-carpet of smaller wildflowers carpeting the ground around it], [dreamy misty pastel background with smaller versions of the hero form fading into the haze, implying a whole world of these surreal flower-forms]${atmospheric_magic ? ', [atmospheric magic detail amplifying the surreal mood]' : ''}, [soft surreal-magical-realism pastel ambient light], [Studio Ghibli + Salvador Dali botanical + Yayoi Kusama meadow + Pinterest-magical-dreamscape aesthetic register]

CRITICAL — ONE surreal scale-inverted FLOWER-FORM is the hero. Natural landscape context. Floor-carpet of smaller flowers. NO animals / NO humans / NO manmade objects. Soft surreal-magical-realism mood.

Output ONLY 90-130 words. Comma-separated phrases. NO preamble, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose.`;
  },

  BLOOMBOT_DESERT_BLOOM: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, desert_anchor, bloom_explosion, atmospheric_magic } = slots;

    const magicSection = atmospheric_magic
      ? `
━━━ ATMOSPHERIC MAGIC — render visibly in the scene ━━━
${atmospheric_magic}

A specific atmospheric detail amplifying the southwest-desert mood (NOT competing with the desert + bloom explosion).

`
      : '';

    return `You are a desert-southwest concept-art painter writing CACTUS-AND-WILDFLOWER-EXPLOSION landscape scene descriptions for BloomBot. Output is a 90-130 word comma-separated phrase string for Flux. NO preamble, NO labels — just the prose.

━━━ THE CORE AESTHETIC — DESERT LANDSCAPE JUXTAPOSED WITH AN EXPLOSION OF WILDFLOWERS ━━━

The unifying mandate: a vivid southwest-desert landscape (saguaro / joshua-tree / agave / mesa / red-rock / sand-dune) with a DRAMATIC SUPERBLOOM EXPLOSION of vivid wildflowers carpeting the desert floor, climbing the rocks, blooming between and through the cactus arms. Dry-desert texture + lush flower-abundance = the surreal juxtaposition that makes every render pop.

THE LOOK — Sonoran-superbloom / Arizona-after-spring-rain / IG-magical-desert-magazine:
- A RECOGNIZABLE southwest desert anchor (saguaro / joshua-tree / agave / yucca / prickly-pear / barrel-cacti / red-rock canyon / mesa / sand dunes)
- A DRAMATIC EXPLOSION OF WILDFLOWERS carpeting the desert floor + rocky crevices + climbing around cactus bases — vivid saturated jewel-tone colors (red / orange / coral / magenta / vivid pink / yellow-gold / sapphire / royal-purple)
- SOUTHWEST PALETTE — terracotta red-rock + golden-amber sand + deep cobalt desert sky + warm tan + vivid wildflower jewel-tones — NOT soft pastel
- DRY-DESERT TEXTURE — visible saguaro ribs, agave-spike detail, sand-grain dunes, weathered red-rock surface (the desert reads as REAL desert)
- MULTI-TIER DEPTH — sharp foreground bloom-explosion + midground desert anchors + deep distance with mesa / mountain silhouettes + atmospheric haze
- VIVID NATURAL LIGHT — bright southwest sun, golden-hour or strong midday-amber, vivid saturated color story

━━━ HARD MANDATES (every render) ━━━

1. **DESERT ANCHOR IS RECOGNIZABLE** — explicitly name + describe the southwest desert anchor (e.g., "towering saguaro cacti 20-30 ft tall with visible vertical ribs and outstretched arms," "joshua-tree grove with spiky branched silhouettes," "agave-and-yucca field with bayonet-spike leaves," "red-rock canyon walls with sandstone striations"). The desert anchor reads as REAL desert geography.

2. **DRAMATIC WILDFLOWER EXPLOSION** — describe a dense vivid carpet of wildflowers exploding around / between / through the desert anchor — specific desert-bloom species (desert-marigold / Indian-paintbrush / desert-mariposa / desert-globemallow / lupine / California-poppy / Ocotillo-bloom / Cholla-flower / desert-rose / Prickly-pear-flower / Cardinal-flower / desert-sage / brittlebush / penstemon / chuparosa / desert-bluebell / Mojave-aster). Vivid saturated colors.

3. **VIVID SATURATED SOUTHWEST PALETTE** — terracotta + golden + deep-cobalt + warm-tan + vivid wildflower jewel-tones (red / coral / magenta / orange / pink / yellow / sapphire / purple). NOT soft-pastel (that's flower-friends' territory) — bold and saturated.

4. **DRY-DESERT TEXTURE PRESERVED** — the desert anchors retain their desert nature — visible saguaro ribs, weathered red-rock striations, sand-grain dunes, agave bayonet-spikes, dusty texture. The wildflowers EXPLODE AROUND the dry desert, they don't transform it into a lush meadow.

5. **MULTI-TIER DEPTH** — clear foreground (sharp bloom-explosion) + midground (desert anchors) + deep distance (mesa silhouettes / atmospheric haze).

6. **VIVID NATURAL LIGHT** — bright southwest sun, golden-hour amber, or warm midday. NOT moody / dark / soft-pastel.

🚫 ABSOLUTE BANS:
  • 🚫 NO soft-pastel color register — vibrant saturated southwest jewel-tone for this path
  • 🚫 NO lush-temperate-meadow setting — desert MUST be recognizable as desert (cacti / red-rock / sand)
  • 🚫 NO interior / urban / ruins / manmade architecture
  • 🚫 NO surreal flower-construction or scale-inversion (that's flower-fantasy's territory) — desert anchors stay desert
  • 🚫 NO insects-as-focal / hummingbirds-as-focal (those are flower-friends / flower-humming-birds paths)
  • 🚫 NO macro / extreme closeup — landscape scale needed
  • 🚫 NO moody / dark / dramatic-storm lighting — vivid southwest sun only
  • 🚫🚫🚫 ABSOLUTE HARD BAN — NO HUMANS, NO PEOPLE, NO FIGURES, NO SILHOUETTES, NO HANDS, NO BODY PARTS, NO FACES anywhere in frame 🚫🚫🚫
  • 🚫 NO animals (no real animals — distant bird silhouette in atmospheric pool OK)

━━━ THE DESERT ANCHOR ━━━
${desert_anchor}

This is the recognizable southwest desert landform that grounds the scene.

━━━ THE WILDFLOWER EXPLOSION ━━━
${bloom_explosion}

The dramatic vivid wildflower carpet that EXPLODES around / between / through the desert anchor. Specific species + vivid saturated colors.
${magicSection}━━━ COMPOSITION CRAFT — SOUTHWEST DESERT + WILDFLOWER EXPLOSION ━━━

  • FOREGROUND: dense bloom-explosion of vivid desert wildflowers carpeting the ground, climbing the rocks, blooming around the cactus bases
  • MIDGROUND: the desert anchor (saguaro / joshua-tree / agave / red-rock / mesa) — recognizable, sharp, vivid
  • BACKGROUND: distant mesa silhouettes / mountain ridges / sand dunes fading into atmospheric haze with deep cobalt sky above
  • DEPTH: sharp bloom-foreground + sharp desert-midground + soft distant atmospheric depth
  • COLOR: vivid saturated southwest palette — bold reds + corals + magentas + jewel-yellows + sapphire-blues against terracotta + golden desert
  • MOOD: vibrant, dramatic, surprising — the joy of desert SUPERBLOOM after spring rain

━━━ AMBIENT LIGHTING ━━━
${lighting}

Reinterpret the rolled lighting as VIVID SOUTHWEST natural light — bright midday sun, golden-hour amber, or warm desert glow. NOT moody / dark / soft-pastel. Think Sonoran-superbloom / Arizona-after-spring-rain / IG-magical-desert-magazine.

━━━ COLOR PALETTE — STRICT ━━━
${sharedDNA.palette}

━━━ FLOWER SPECIES — STRICT ━━━
${sharedDNA.roster}

Pick 3-5 species from the roster — vivid saturated colors. Combine roster species with desert-specific bloom-types (desert-marigold / Indian-paintbrush / lupine / poppy / penstemon / cactus-blooms).

━━━ DEFAULTS TO RESIST — HARD BANS ━━━
- 🚫 NO soft-pastel register
- 🚫 NO lush-temperate-meadow setting
- 🚫 NO interior / urban / ruins / manmade architecture
- 🚫 NO surreal flower-construction or scale-inversion (flower-fantasy)
- 🚫 NO macro / extreme closeup
- 🚫 NO moody / dark / dramatic-storm lighting
- 🚫 ABSOLUTE HARD BAN — NO humans / people / figures / silhouettes / hands / body parts / faces
- 🚫 NO species outside the roster (for flowers)

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write in this exact order ━━━
[the RECOGNIZABLE southwest desert anchor (saguaro / joshua-tree / agave / red-rock / mesa / dunes) dominating the midground — explicit dry-desert texture + species + features], [the DRAMATIC WILDFLOWER EXPLOSION carpeting the foreground around / between / through the desert anchor — specific desert-bloom species in vivid saturated jewel-tone colors], [multi-tier depth with distant mesa silhouettes / mountain ridges fading into atmospheric haze, deep cobalt desert sky above]${atmospheric_magic ? ', [atmospheric magic detail amplifying the southwest mood]' : ''}, [vivid bright southwest natural light bathing the scene — bright sun / golden-hour amber / warm desert glow], [vibrant Sonoran-superbloom / Arizona-magical-desert aesthetic — bold saturated southwest palette]

CRITICAL — RECOGNIZABLE SOUTHWEST DESERT (cacti / red-rock / sand) + DRAMATIC WILDFLOWER EXPLOSION. Vivid saturated SOUTHWEST palette (NOT soft-pastel). ABSOLUTE HARD BAN ON HUMANS.

Output ONLY 90-130 words. Comma-separated phrases. NO preamble, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose.`;
  },

  BLOOMBOT_SUNSET_FLOWERS: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, hero_flower, landscape_backdrop, sunset_sky, sun_position, atmospheric_phenomenon } = slots;

    const phenomenonSection = atmospheric_phenomenon
      ? `
━━━ ATMOSPHERIC PHENOMENON — render visibly in the scene ━━━
${atmospheric_phenomenon}

A specific atmospheric moment supporting the sun-backlit-flower aesthetic.

`
      : '';

    return `You are a fantasy-realism concept-art painter writing SUN-BACKLIT-FLOWER + EPIC-LANDSCAPE + SUNSET-SKY scene descriptions for BloomBot. Output is a 90-130 word comma-separated phrase string for Flux. NO preamble, NO labels — just the prose.

━━━ THE CORE AESTHETIC — SUN-BACKLIT FLOWERS AGAINST EPIC SUNSET LANDSCAPE ━━━

The unifying mandate: the VISIBLE SUN in the frame backlights / rim-lights the foreground flowers — petal EDGES catch a gentle warm rim-light, the blooms are naturally lit from behind with soft golden-hour warmth — set against a wide gorgeous landscape that recedes into the distance under a soft pretty sunset sky. NATURALISTIC photography backlight — the flowers are NOT internally glowing bulbs. The viewer's reaction: "look at the way the sun is lighting up those flowers."

THE LOOK — soft naturalistic golden-hour / pretty-sunset photograph:
- The SUN is visible IN the frame (low disc cresting a horizon / setting behind a ridge / bursting through trees / peeking over hills / rising over a lake) — soft glowing, atmospheric, NOT a sharp burning sphere
- The HERO FLOWERS in foreground/midground are NATURALLY BACKLIT / RIM-LIT by the sun — petal EDGES catch a gentle warm rim-light, soft natural backlight, photographic register — NOT internally-glowing bulbs — THIS IS THE STAR OF THE SHOW
- A WIDE GORGEOUS LANDSCAPE recedes behind (mountains / hills / forest / lake / coast / meadow) — gives epic scale and depth
- A PRETTY GOLDEN-HOUR / SUNSET SKY in soft warm tones (warm amber / soft pink / peach / coral / pale lavender / cream) — pretty and atmospheric, NOT burning-dramatic

━━━ THE SUNSET SKY — SOFT GOLDEN-HOUR, NOT BURNING DRAMA ━━━

The upper 30-45% of every render is a pretty golden-hour / sunset sky — warm, atmospheric, naturalistic. SOFT and PRETTY, not burning-fiery-competition-grade. The flowers are the hero; the sky is the pretty warm light source that makes them glow.

RIGHT register:
  - Soft warm cloud-bands (warm amber / soft pink / peach / coral / pale lavender / cream)
  - Gentle cumulus or cirrus catching the warm light
  - The sun-disc visibly present but SOFT — glowing through atmospheric haze, not a sharp burning sphere
  - Subtle warm golden-hour rays + lens-flare are nice, not blazing god-rays
  - Pretty, calm, atmospheric, "actual sunset photograph" feel
  - The light WRAPS the scene in warm-gold ambient — petals glow softly, everything bathed in warm light

WRONG register (what to avoid):
  - 🚫 Fiery burning apocalyptic-beauty sunsets
  - 🚫 Hot-pink-and-magenta saturated drama
  - 🚫 Storm-clouds boiling, blood-orange burning, intense fire-red
  - 🚫 Skies that compete with or dominate the flowers
  - 🚫 Caribbean-cruise-ship-promo level drama
  - 🚫 Dark / moody / heavy / overwrought / cinematic-apocalyptic

Think: pretty golden-hour photograph from a hike / Instagram nature-feed soft-sunset / the moment 30-60 minutes before actual sundown when the warm light is just right and the flowers glow.

━━━ HARD MANDATES (every render) ━━━

1. **VISIBLE SUN IN FRAME** — the sun-disc / golden-hour rays / sunset-source is clearly visible in the frame. Describe its position explicitly (cresting the mountain ridge / setting behind the hill / peeking through pine canopy / sitting low on the meadow horizon / rising over the lake).

2. **HERO FLOWERS STRONGLY BACKLIT BY THE SUN** — describe the foreground flowers as STRONGLY catching the warm sun-light from behind. The sun's light visibly FLOODS THROUGH the scene and BATHES the flowers in warm golden-amber backlight — the petal edges show a STRONG bright warm rim-glow, the whole bloom is warm-bathed and luminous, the back-lit-by-sun look is OBVIOUS and PRONOUNCED. Think National Geographic / IG backlit-hibiscus / National-Park golden-hour magazine-cover shots — the sun is BEHIND the flowers and they GLOW with the warmth flooding through them. Use phrases like "petal edges blazing with warm sun-rim-light," "the sun pouring its warm light through the bloom," "every petal-edge brilliantly outlined in golden warm-amber rim-glow," "the flower silhouette burning warm against the sun," "strong photographic backlight bathing the bloom in golden warmth," "the warm sun-light pouring through the petals making them glow." AVOID ONLY: "every petal a tiny lamp/bulb/lantern from within" — that triggers fake neon-bulb petals. STRONG sun-backlight where the sun is OBVIOUSLY behind the bloom is exactly the goal.

3. **EPIC LANDSCAPE BACKDROP** — a wide gorgeous natural setting recedes behind (mountains / hills / forest / lake / coast / valley / canyon / cliffs / wildflower-meadow). Multi-tier depth: foreground flowers + midground terrain + receding distance. NEVER a flat or featureless backdrop.

4. **PRETTY GOLDEN-HOUR SKY — 30-45% OF THE FRAME** — the upper 30-45% of the frame is filled with a soft pretty golden-hour / sunset sky in warm naturalistic tones (warm amber / soft pink / peach / coral / pale lavender / cream). Gentle cumulus or cirrus clouds catching the warm light, sun-disc visibly present but soft (glowing through atmospheric haze, NOT a sharp burning sphere). The sky SUPPORTS the flowers — it's the warm light source, not the hero. NEVER burning-fiery / storm-dramatic / hot-pink-saturated / cinematic-apocalyptic. NEVER plain blue / overcast / clear noon either. Aim for "pretty golden-hour photograph" not "competition-grade sunset banger."

5. **NATURALISTIC REAL-WORLD REGISTER** — this is naturalistic nature-photography aesthetic, NOT surreal / magical-portal / sci-fi / cartoony. National Geographic golden-hour landscape photography meets Pinterest-magical-hour Instagram. Real flowers, real mountains, real sun.

🚫 ABSOLUTE BANS:
  • NO surreal / impossible / floating / gravity-defying (dreamscape's territory)
  • NO interior / cozy / room (cozy's territory)
  • NO archways / tunnels / passages / engulfment (flower-tunnels' + garden-walk's territory)
  • NO city streets / urban architecture (city-flowers' territory)
  • NO ruins / abandoned structures (reclaim's territory)
  • NO macro / closeup / extreme tight framing (closeup's territory)
  • NO plain blue sky / overcast / clear midday noon — sunset sky mandatory
  • NO flat featureless backdrop — wide gorgeous landscape mandatory
  • NO flowers without visible sun-backlight — the sun MUST be lighting through the petals
  • NO sci-fi bloom-glow / bioluminescent / fairy-dust / will-o-wisps
  • 🚫🚫🚫 ABSOLUTE HARD BAN — NO HUMANS, NO PEOPLE, NO FIGURES, NO SILHOUETTES, NO PEDESTRIANS, NO TRAVELERS, NO EXPLORERS, NO HUMANOIDS anywhere in frame 🚫🚫🚫

━━━ THE HERO FLOWER (foreground / midground) ━━━
${hero_flower}

━━━ THE LANDSCAPE BACKDROP (wide gorgeous recession behind) ━━━
${landscape_backdrop}

━━━ THE GOLDEN-HOUR SKY — soft pretty sunset, upper 30-45% of the frame ━━━
${sunset_sky}

This is the warm-light support, NOT a burning showpiece. Render the sky soft, pretty, naturalistic — gentle cumulus or cirrus catching warm-amber / soft-pink / peach / coral light. The flowers are the hero — the sky bathes them in warmth.

━━━ THE VISIBLE SUN POSITION ━━━
${sun_position}

The sun-disc must be VISIBLE in frame at this position — large enough to be unmistakable, glowing, with golden-hour rays / lens-flare radiating outward.
${phenomenonSection}━━━ COMPOSITION CRAFT — HERO-FLOWER + EPIC-LANDSCAPE + SUNSET-SKY ━━━

  • FOREGROUND: hero flower-cluster occupying the lower 40-60% of the frame — petal EDGES BLAZING with strong warm sun-rim-light, whole bloom WARM-BATHED in the sun's backlight pouring through (naturalistic photographic STRONG backlight, NOT bulb-like inner glow)
  • MIDGROUND: wide gorgeous landscape (mountain ridges / forested hills / meadow / lake / coast) receding deeper
  • UPPER FRAME: dramatic sunset sky filling 30-50% — orange / pink / gold cloud-bands
  • SUN POSITION: visible in mid-to-upper frame — cresting ridge / setting behind hill / bursting through trees / peeking over hills / sitting low on horizon
  • SUN-LIGHT TRANSMISSION: explicitly describe the sun-light SHINING THROUGH the foreground flowers — backlight, rim-light, petal-translucency, golden-hour glow on every visible bloom
  • DEPTH: clear foreground/midground/background separation — multi-tier depth, atmospheric haze in the distance

━━━ AMBIENT LIGHTING ━━━
${lighting}

Reinterpret the rolled lighting to support GOLDEN-HOUR / SUNSET / MAGIC-HOUR — strong warm directional light from the visible sun POURING into the scene. The ENTIRE foreground/midground should be bathed in warm golden-amber sun-light — every petal-edge, every grass-blade, every leaf glowing with caught warmth. Pronounced lens-flare, warm haze, light-pouring-through-the-air. The sun is the primary light story; ambient amplifies it (warm haze / lens-flare / ray-streaks / soft cloud-filtered warmth flooding the whole frame).

━━━ COLOR PALETTE — STRICT ━━━
${sharedDNA.palette}

━━━ FLOWER SPECIES — STRICT ━━━
${sharedDNA.roster}

Pick 1-2 species from the roster for the hero foreground — describe each with PETAL EDGES CATCHING WARM SUN-RIM-LIGHT from the sun behind/beside, naturalistic golden-hour photographic backlight (NOT internally-glowing bulbs).

━━━ DEFAULTS TO RESIST — HARD BANS ━━━
- 🚫 NO surreal / floating / impossible
- 🚫 NO interior / cozy / room
- 🚫 NO archways / tunnels / passages / engulfment
- 🚫 NO city / urban architecture
- 🚫 NO ruins
- 🚫 NO macro / closeup
- 🚫 NO plain blue sky / overcast / clear midday
- 🚫 NO flat featureless backdrop
- 🚫 NO flowers without visible sun-backlight
- 🚫 NO sci-fi / bioluminescent / fairy-dust
- 🚫 ABSOLUTE HARD BAN — NO humans / people / figures / silhouettes / pedestrians
- 🚫 NO species outside the roster

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write in this exact order ━━━
[the hero foreground flower-cluster + PETAL EDGES CATCHING WARM SUN-RIM-LIGHT from the visible sun behind/beside — naturalistic photographic backlight, NOT internally-glowing bulb petals], [the wide gorgeous landscape recession behind — mountains / hills / forest / lake / coast], [the visible sun-disc position in frame — soft glowing through atmospheric haze], [soft pretty golden-hour sky in upper 30-45% — gentle cumulus / cirrus in warm-amber / soft-pink / peach / coral / pale-lavender], [warm golden-hour ambient wrapping the entire scene]${atmospheric_phenomenon ? ', [atmospheric phenomenon supporting the soft-golden-hour aesthetic]' : ''}, [naturalistic real-world register — pretty golden-hour photograph, NOT cinematic-apocalyptic-burning-sunset, NOT bulb-glowing-flowers]

CRITICAL — the SUN is VISIBLE IN FRAME and NATURALLY RIM-LIGHTING THE FLOWER PETAL EDGES (NOT internally-glowing bulbs). Wide gorgeous landscape behind. Soft pretty sunset sky above. ABSOLUTE HARD BAN ON HUMANS.

Output ONLY 90-130 words. Comma-separated phrases. NO preamble, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose.`;
  },

      BLOOMBOT_CITY_FLOWERS: ({ slots, sharedDNA, vibeDirective }) => {
    const { city_setting, architectural_detail, atmospheric_phenomenon } = slots;

    const phenomenonSection = atmospheric_phenomenon
      ? `
━━━ ATMOSPHERIC PHENOMENON — render visibly in the bloom-city scene ━━━
${atmospheric_phenomenon}

A magical atmospheric detail that elevates the scene — render as a specific element within the frame.

`
      : '';

    return `You are a fantasy concept-art painter writing MAGICAL BLOOM-CITY scene descriptions for BloomBot. Output is an 95-130 word comma-separated phrase string for Flux. NO preamble, NO labels — just the prose.

━━━ FLOWERS FIRST AND FOREMOST — read this FIRST ━━━

EVERY render is OVERWHELMINGLY FLOWERS — scale, density, color, amount, variety. Flowers do ALL the heavy lifting. The flowers ARE the city. Architecture is barely visible scaffolding, dwarfed and consumed by the bloom-mass.

🚫 ABSOLUTELY BANNED — NO compensating with light spectacles / sci-fi effects:
  • NO glowing power-cores / radiating bloom-cores / pulsing magical inner-glow
  • NO bioluminescent blooms / bioluminescent moss / bioluminescent anything
  • NO will-o-wisps / faerie-lights / floating magical orbs / drifting light-particles
  • NO sci-fi god-rays / theatrical sun-shafts cutting through scenes
  • NO crystalline-prismatic refraction / rainbow-light arcs / spectrum effects
  • NO aurora-curtains / aurora-bloom megacities
  • NO impossible double-suns / fantasy twin-moons / starflower-skies
  • NO floating pollen-motes / magical fairy-dust / glowing seed-floats
  • NO magic-mist / iridescent volumetric haze / glowing rune-bark
  • NO neon-bloom / electric-cyan / glowing-magenta accents
  • NO sci-fi underwater coral-cities (too techy/glowing)

✓ LET THE FLOWERS DO THE WORK — the heavy lifting comes from:
  • SCALE — kilometer-tall flower-walls, building-sized single blossoms, hundred-meter rose-cascades
  • DENSITY — packed so thick you can't see the architecture underneath, layered hundreds of flowers deep
  • AMOUNT — millions of blooms in frame, every quadrant filled with blossom
  • VARIETY — many flower species in painterly equal weight, rich color stacking
  • COLOR — saturated jewel-tones across the full spectrum, painterly chromatic richness
  • NATURAL CINEMATIC LIGHT — golden hour / dawn / dusk / soft daylight / gentle backlight (NOT magical glow)

🚫 NO REAL-WORLD TOURIST CITIES — Mediterranean alleyways, Parisian boulevards, Lisbon staircases, Marrakech courtyards, Tokyo back-streets, Cinque Terre, Venice, Cuba, Greek islands, Cotswolds, Stockholm, Tuscany, Pueblo, Jaipur, Hoi An, Kyoto — EXPLICITLY BANNED.

━━━ LIGHTING / WEATHER / TIME-OF-DAY VARIETY — MANDATORY ━━━

The rolled lighting axis is the AUTHORITY for the scene's light/weather/time. Render it FAITHFULLY. Do NOT default to "soft painted golden-hour mist with atmospheric haze" on every render — that's the homogenization trap.

USE THE FULL LIGHTING SPECTRUM (the lighting axis rotates across these — RENDER what it rolls):
  • Bright clear noon — sharp midday daylight, deep shadow, crisp clean color, sunny day, NO mist
  • Sharp golden-hour rake — low-angle warm-sun cutting horizontal across scene, long crisp shadows, NO haze
  • Blue-hour twilight — cool deep-blue light just before dawn or after dusk, no mist, soft moody clarity
  • Night / moonlit — silver moonlight on the blooms, blue-violet shadows, starlit-clear
  • Stormy / dramatic — heavy storm-clouds overhead, single sun-shaft breaking through, dark moody chiaroscuro
  • Overcast diffuse — flat soft cloudy daylight, no shadows, even color across the scene
  • Crisp dawn-pink — sharp pink-coral dawn light, clear air, no fog
  • Hot afternoon glare — bright sun overhead, blooms in full color saturation, crisp shadows
  • Rain — fresh rain wetting every petal, glistening surfaces, light through rain-streaks
  • Snow — fresh snow drifting onto blossom-mass, cold bright clarity
  • Chiaroscuro Rembrandt — directional light from one side, deep velvet shadow on the opposite, dramatic
  • Dappled canopy — leaf-shadows fragmenting light into shifting patches on bloom-carpet
  • Magic-hour painted glow — warm late-afternoon backlight (the OLD default — use SPARINGLY, 1-in-5 max)
  • Foggy atmospheric — soft mist softening depth (the OLD default — use SPARINGLY, 1-in-5 max)

⚠️ Render whatever the lighting axis ROLLED. Do NOT default to atmospheric haze / painted-gold mist / soft natural light EVERY render. Use the FULL spectrum — across a batch of 5 renders we should see at least 3-4 distinct lighting/weather/time-of-day modes.

🚫 BANNED FALLBACK LANGUAGE in your output prompt (these are the homogenization defaults):
  • "atmospheric haze" / "painted-gold mist" / "soft painted glow" / "golden-hour mist drifting"
  • "atmospheric depth-haze" / "soft natural side-light"
  • Defaulting EVERY scene to magic-hour / golden-hour painted-gold
  • Defaulting EVERY scene to "soft mist drifting between spires"

✓ FANTASY FLOWER-CITY LINEAGE — but the FLOWERS dominate, not the architecture:
  • Mountains of cascading flowers with fantasy spires barely poking through
  • Kilometer-high flower-cliffs with hint of carved architecture half-buried in bloom
  • Endless flower-meadows stretching to fantasy spires on the horizon
  • Flower-canyons with walls of bloom hundreds of meters tall
  • Mallorn-tree fantasy citadels SO consumed by flowers the trees are barely visible
  • Sky-floating fantasy spires SO bloom-covered they read as floating bouquets
  • Fantasy ruins SO claimed by flowers they read as flower-mountains
  • Endless cherry-blossom forests with fantasy spires emerging from the canopy
  • Vine-cathedrals of overlapping wisteria-cascades draped from kilometer-tall fantasy spires
  • Flower-flooded valleys where blooms drown everything except distant fantasy spires

━━━ BLOOMS ARE 80-90% OF THE FRAME — FLOWERS DO ALL THE WORK ━━━

This is NOT a fantasy-city with flowers as decoration. This IS flowers — flowers as the entire visible world, with hints of fantasy-architecture half-buried in the bloom-mass. Blooms fill 80-90% of every render. Every quadrant is packed dense with blossom — building-scale petal-cascades, mountain-scale flower-cliffs, sky-filling petal-storms, valley-deep flower-canyons.

The fantasy-architecture is BARELY VISIBLE — a spire-tip emerging from the bloom-mountain, a hint of a tower-window through cascading petals, a fantasy bridge half-buried in blossom-snow. The flowers OVERWHELM, the architecture is a small clue that this is a city.

FLOWER-SCALE EXAMPLES (push every entry toward this scale):
  • Kilometer-tall flower-cliffs of overlapping rose-cascades pouring hundreds of meters
  • Building-sized single peonies the size of cathedrals
  • Sky-filling cherry-blossom canopy spanning the entire upper-frame
  • Mountain-scale wisteria-curtains draping from invisible spires above
  • Flower-canyons where you can't see the walls for the blooms
  • Mountains of blossom obscuring everything beneath
  • Endless meadows of waist-high blooms stretching to the horizon

🚫 NO "flower-decoration on architecture." The flowers ARE the scene. Architecture is a glimpse, not a stage.

━━━ NO PEOPLE — ABSOLUTE FIRST RULE ━━━
NO humans, NO figures, NO silhouettes, NO shadows of people, NO pedestrians. The empty fantasy bloom-city is the subject. (A sleeping faerie-creature / sleeping pixie-flock / distant elven-spirit at scale-prover scale — only when atmospheric_phenomenon calls for it.)

━━━ THE FANTASY BLOOM-CITY SETTING ━━━
${city_setting}

━━━ THE ARCHITECTURAL DETAIL (the fantasy city's signature element) ━━━
${architectural_detail}

The architectural detail is the fantasy city's signature — render it with painterly precision so the impossible-fantasy-city style is unmistakable. The bloom-cascade GROWS FROM / WRAPS / DRAPES the detail as if the detail itself is made of flowers.
${phenomenonSection}━━━ MOVIE POSTER MANDATE — EVERY QUADRANT MUST HAVE SOMETHING STRIKING ━━━
Every render is a JAW-DROPPING EPIC CINEMATIC MOVIE-POSTER / GALLERY-PIECE FRAME. Every quadrant earns its space. Stack 5+ visually-arresting elements simultaneously:

  1. **THE FANTASY BLOOM-CITY** as the dominant hero — impossible architecture overgrown / consumed / formed BY flowers
  2. **OVERWHELMING BLOOM-MASS** — building-scale cascades, sky-filling petal-storms, vine-bridges, flower-cathedrals
  3. **DRAMATIC FANTASY SKY** — aurora / sunset / dawn / cloud-layers / impossible double-sun / starfield / floating moon
  4. **MAGICAL ATMOSPHERIC LAYER** — drifting petal-snow / glowing pollen-motes / bioluminescent spores / magical mist / golden god-rays
  5. **SENSE OF VAST SCALE** — multi-tier vertical depth from foreground bloom-cascade to deep-distance fantasy spires receding into atmospheric haze

THINK: Tolkien-illustrated-edition / Pre-Raphaelite painted-bloom-fields / Studio-Ghibli cherry-blossom-canopy / Lothlorien-from-Fellowship (the FLOWERS, not the architecture) / Brian-Froud-faerie-realm painted-flower-density / classical-painted "Garden of Earthly Delights" flower-mass / Monet-water-lily-immersive panels (BUT fantasy scale).

Pick ONE composition per render (FLOWER-DOMINATED, vary):
  A. **FLOWER-CANYON DEPTH** — walls of cascading flowers hundreds of meters tall on both sides, narrow path winding through, fantasy spires hint at the canyon-end
  B. **KILOMETER-CASCADE WALL** — wall of overlapping rose / peony / wisteria cascades pouring down from above, fantasy architecture barely glimpsed at the top
  C. **BLOOM-MOUNTAIN VISTA** — mountain made entirely of flowers, fantasy spires barely emerging from the bloom-mass, dawn/dusk light
  D. **ENDLESS FLOWER-MEADOW** — vast painted-meadow stretching to a fantasy citadel on the distant horizon, foreground is waist-high blooms in every direction
  E. **CHERRY-BLOSSOM CANOPY** — looking up at endless cherry-blossom canopy filling 80%+ of frame, fantasy spire-tips poking through at the top
  F. **VINE-CATHEDRAL FROM BELOW** — looking up at overlapping wisteria-cascades draping kilometer-deep from invisible fantasy structures above
  G. **FLOWER-FLOODED VALLEY** — fantasy spires emerging from a valley flooded knee-deep in floating blossoms, painted-gold light
  H. **BLOSSOM-DROWNED RUIN** — fantasy ruins so claimed by flowers they read as flower-mountains, only the tip of a spire visible
  I. **PETAL-SNOW DEPTH** — fantasy spires barely visible through dense falling petal-snow filling the entire frame
  J. **BLOOM-AVENUE TUNNEL** — viewer inside a tunnel of overlapping bloom-cascades, fantasy spire-tips poking through at the far end
  K. **FLOWER-CLIFF HORIZON** — sheer flower-cliff dominating the frame, hint of fantasy architecture half-buried near the top, soft natural light
  L. **MALLORN-CANOPY OVERWHELM** — golden mallorn-tree fantasy citadel SO covered in flowers the trees are barely visible, painted-gold light

DELIBERATE COMPOSITION CRAFT — FLOWER-DOMINATED CINEMATIC SHOT:
- Strong LEAD-LINES into flower-depth (bloom-canyon recede / cherry-canopy verticality / flower-cliff horizon-line)
- CINEMATIC POV — fantasy scale, NOT pedestrian
- Multi-tier depth: foreground tactile bloom-detail → midground bloom-mass → deep-distance fantasy spires barely visible through atmospheric bloom-haze
- NATURAL CINEMATIC LIGHT ONLY — golden-hour sun / dawn / dusk / soft daylight / gentle backlight. NEVER magical glow / bioluminescence / sci-fi god-rays.
- Sky is small or implied — the FLOWERS fill the frame, not a dramatic sky

━━━ MATERIAL POETRY — FLOWER-DOMINATED TEXTURES ━━━
"Hundred-meter rose-cascade pouring down a hidden cliff-face in overlapping petal-waves", "wall of cherry-blossoms so dense the trunks are invisible behind the bloom-mass", "thousands of overlapping peonies stacked deep enough to drown a spire", "cascading wisteria-curtains hanging hundreds of meters from invisible structures above", "valley flooded knee-deep in floating blossoms with only a spire-tip visible", "endless meadow of layered wildflowers stretching to the horizon".

━━━ COLOR PALETTE — STRICT ━━━
${sharedDNA.palette}

━━━ FLOWER SPECIES — STRICT ━━━
${sharedDNA.roster}

Use the actual species names. Pick 3-4 species from the roster — mass them at FANTASY SCALE across the bloom-city (building-scale cascades, sky-filling storms, full-facade waterfalls of blossom).

━━━ LIGHTING ━━━
${sharedDNA.lighting}

━━━ DEFAULTS TO RESIST — HARD BANS ━━━
- 🚫 NO real-world tourist cities (Mediterranean / Parisian / Lisbon / Marrakech / Tokyo / Venetian / Cinque Terre / Cuban / Tuscan / Pueblo / Indian / Vietnamese / Kyoto)
- 🚫 NO real-world historic architecture (Haussmann / azulejo / adobe / canal-palazzo / colonial / half-timber)
- 🚫 NO "postcard with extra flowers" energy
- 🚫 NO pedestrian-level tourist-eye POV
- 🚫 NO cobblestone / weathered-plaster / chipped-paint pedestrian textures
- 🚫 NO modern / contemporary / corporate architecture
- 🚫 NO people / pedestrians / bicycles / vespas / vintage-cars / market-stalls

🚫 NO SCI-FI / MAGIC-LIGHT EFFECTS COMPENSATING FOR THE SCENE:
- 🚫 NO glowing power-cores / pulsing inner-bloom-glow / radiating cores
- 🚫 NO bioluminescent blooms / bioluminescent moss / bioluminescent ANYTHING
- 🚫 NO will-o-wisps / faerie-lights / floating magical orbs / drifting light-particles
- 🚫 NO theatrical god-rays as the main impact / sun-shafts as the wow-element
- 🚫 NO crystalline-prismatic refraction / rainbow-light arcs / spectrum effects
- 🚫 NO aurora-curtains / aurora-bloom megacities
- 🚫 NO double-suns / twin-moons / starflower-skies / impossible celestial bodies
- 🚫 NO floating pollen-motes / fairy-dust / glowing seeds-floats
- 🚫 NO magic-mist / iridescent volumetric haze / glowing rune-bark
- 🚫 NO neon-bloom / electric-cyan / glowing-magenta accents
- 🚫 NO underwater bloom-cities (too sci-fi-glowing)

🚫 ARCHITECTURE-DECORATION TRAP:
- 🚫 NO architectural HERO with blooms-as-decoration — FLOWERS are 80-90% of frame, fantasy-architecture is BARELY VISIBLE scaffolding glimpsed through bloom-mass
- 🚫 NO well-defined fantasy-spire as the focal subject — flowers should dwarf and consume the architecture

OTHER:
- 🚫 NO pink/rose/blush dominance unless palette names it
- 🚫 NO species outside the roster

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write in this exact order ━━━
[cinematic fantasy-bloom-city composition mode], [specific fantasy bloom-city setting + signature fantasy architectural detail rendered with painterly precision], [OVERWHELMING bloom-mass at fantasy scale — building-scale cascades, sky-filling petal-storms, vine-bridges, multi-species in equal weight, 60-70% of frame], [cinematic establishing POV with multi-tier depth into fantasy distance], [dramatic fantasy sky + magical atmospheric layer]${atmospheric_phenomenon ? ', [atmospheric phenomenon as visible magical detail]' : ''}, [material poetry — mallorn-bark / crystalline bloom / bioluminescent moss / vine-grown rampart]

CRITICAL — cinematic fantasy-bloom-city establishing shot. BLOOMS are the OVERWHELMING SUBJECT (60-70% of frame), fantasy-architecture is SCAFFOLD. NO real-world tourist cities. NEVER a pedestrian eye-level snapshot.

Output ONLY 95-130 words. Comma-separated phrases. NO preamble, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose, starting with the composition mode + the fantasy bloom-city.`;
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



  TOYBOT_BARBIE_STORYTELLING: ({ slots, sharedDNA }) => {
    const { camera_angle, scene } = slots;

    // Barbie-playroom mischief scene. The seed (scene) is a 6-slot DNA
    // entry containing the FULL story: real surface + unexpected story
    // setup; protagonist Barbie/Ken + absurd action; 3-5 supporting
    // dolls mixing Barbie/Ken/sister/Bratz; multilayered real-prop
    // set decoration; warm playroom light; overhead chaos element.
    // Skips chaos / two-pass polish / sensory anchors.
    return `You are a kid's-playroom-diorama photographer capturing a BARBIE-PLAYTIME-MISCHIEF MOMENT for ToyBot. The scene below is a fully-specified UNEXPECTED kid-playroom scenario — a packed action beat with multiple Mattel-style fashion-dolls coexisting in a multilayered real-prop set. Your job is to render it as ONE comma-separated Flux prompt that preserves ALL six story slots, captures the FUN absurd kid-playtime energy, and reads as a populated playroom scene with the story playing out.

⚠️ ABSOLUTE BANS
NEVER use: "diorama" / "scratch-built" / "ground-foam" / "static-grass" / "tilt-shift" / "model railroad" — although the scene IS staged like a diorama, do not name it as such.
NEVER add: winter / snow / blizzard / ice / frost / midnight / nightfall / dark / cold / monsoon / storm / moonlit / horror / nightmare / grim. The vibe is FUN + WARM + BRIGHT KID-PLAYROOM + SLIGHTLY-ABSURD.
NEVER render real women — every doll is a MATTEL-style 11.5-inch articulated fashion-doll (glossy plastic, molded hair, painted-makeup face, fashion-doll proportions).
NEVER render Barbie-movie promotional posters / red-carpet shots / static product displays.
NEVER include LEGO / Lego / brick-built / studded / blocky-limb minifigs — separate bot.
NEVER include plush stuffed-animals or burlap-Sackboy — those are separate paths.

━━━ THE PLAYROOM-MISCHIEF SCENE (fully specified — preserve ALL six slots) ━━━
${scene}

This 6-part scene has these mandatory slots in order:
  1. REAL surface + the UNEXPECTED BARBIE STORY SETUP (lip-gloss empire / intervention / courtroom / Olympic disaster / etc.)
  2. PROTAGONIST Barbie/Ken + their specific absurd action
  3. 3-5 SUPPORTING CAST dolls mixing Barbies + Kens + sisters + Bratz-style
  4. MULTILAYERED REAL-PROP SET DECORATION (kid-playroom found household objects)
  5. WARM BRIGHT KID-PLAYROOM LIGHT
  6. WHIMSICAL OVERHEAD / FLOATING CHAOS ELEMENT

ALL six MUST appear visibly in your output. If a slot is missing, the render is REJECTED.

━━━ DOLL AESTHETIC — MATTEL-STYLE 11.5-INCH FASHION-DOLLS ━━━
Every doll character is an articulated MATTEL-style 11.5-inch fashion-doll — glossy plastic body, molded hair (mix of blonde / brunette / redhead / black / pastel-dyed across the cast), oversized head with painted-glossy-makeup, fashion-forward outfits varying per role, articulated joints, spike-heel or sneaker plastic shoes. The cast comes ENTIRELY from the scene seed above — DO NOT add or substitute dolls. The aesthetic is what to lock: GLOSSY-PLASTIC ARTICULATED FASHION-DOLLS in kid-playroom playtime.

Anti-list: NOT real women, NOT CGI, NOT illustration, NOT Barbie-movie poster, NOT red-carpet glamour shot, NOT promotional static product display.

━━━ GIRLY-LIFESTYLE SET DECORATION — NON-NEGOTIABLE ━━━
The frame is DRESSED with curated aspirational-Barbie lifestyle accessories — Pinterest-Barbie tableau energy, NOT messy / NOT chaos / NOT spilled-debris. Beyond the doll cast there are 5-7 visible Barbie-scale lifestyle props arranged tastefully around the scene. The PROPS make the world feel COMPLETE — not posed dolls in an empty room. Examples to draw from across the props slot:

  • GIRLY ACCESSORIES: designer handbags / clutch purses / heart-shape sunglasses / oversized hats / chunky bracelets / silk scarves / pearl necklaces
  • MAKEUP + BEAUTY: lipstick tubes lined up / perfume bottles / compact mirrors / nail-polish bottles / blush palettes open / mascara wands
  • DRINKS: pink cocktail glasses with tiny umbrellas / rosé in tiny wine-glasses / iced lattes with whipped cream / fruity smoothies / champagne flutes
  • PETS: a tiny plush cat / a Pomeranian with a pink bow / a chihuahua in a designer handbag
  • FLOWERS: pink peony bouquets / single-stem roses / succulent planters / tropical-leaf arrangements
  • OUTFIT PIECES: folded scarves / hanging dresses / bikini tops / oversized straw hats / stiletto heels lined up / shopping-bag pile
  • SPORTS / FITNESS GEAR: yoga mat / tennis racket / golf clubs / surfboard / pickleball paddle / ski-poles / ice-skates
  • AESTHETIC LIFESTYLE: pink candles / framed Polaroid photos / coffee-table books / fairy-lights / vinyl record / vintage Polaroid camera
  • TINY TECH: phone face-up with heart-wallpaper / laptop with pink stickers / AirPods case / camera on strap
  • SNACKS + TREATS: macarons in tiny box / cupcakes on tray / sushi roll on plate / iced cookies / donut tower

Curated GIRLY-LIFESTYLE aesthetic — feels intentional, like a Barbie magazine spread. NOT spills / NOT chaos / NOT debris.

━━━ CAMERA — MEDIUM-WIDE NARRATIVE-ACTION FRAMING ━━━
${camera_angle}

Medium-wide cinematic playroom-diorama still — NOT a posed Barbie-movie poster, NOT a tight close-up portrait. The hero doll is mid-action as the compositional anchor; supporting dolls are in distinct individual mini-actions, NOT facing camera in a glamour lineup. Deep-focus throughout so every doll's outfit + hair-color + accessory is readable. NEVER unify dolls into a "Barbie product-shot" style — each doll stays distinct in her own outfit + role.

━━━ ACTION ≠ POSED LINEUP — NON-NEGOTIABLE ━━━
The scene captures a STORY MOMENT mid-progression. Hero doll mid-action. Supporting cast each captured mid-DISTINCT-action (one shocked, one mid-shouting, one fleeing, one laughing, one mid-grab, one taking notes). NEVER: dolls facing camera arranged in rows / lineups / group-portrait poses. NEVER: glamour-shoot "gathered Barbies looking at camera." Always: playroom-mischief in motion.

━━━ COMPOSITION ━━━
- Medium-wide narrative-action shot — hero doll mid-action dominates 30-40% of frame
- Supporting dolls in distinct mid-action poses arrayed around at various depths
- The FRAME IS PACKED — 4-6 visible dolls all DOING DISTINCT things
- A SPECIFIC UNEXPECTED STORY IS HAPPENING — narrative beat readable in one glance
- Real-prop scene-dressing visible throughout — multilayered set decoration
- FUN + ABSURD + KID-PLAYROOM-MISCHIEF energy — sitcom not glamour
- The light specified in the seed is the ONLY light — no chaos, no winter, no night
- The overhead chaos element is visible in the upper third
- Deep-focus throughout — every doll + prop readable, outfits sharply distinct

⚠️ FAILURE CONDITIONS
• If render is a POSED GLAMOUR LINEUP / Barbie-movie poster / dolls facing camera in a row → FAILED.
• If render is a TIGHT CLOSE-UP / macro / shallow-DOF on one doll → FAILED.
• If real women / CGI / illustration appears → FAILED.
• If any of the 6 slots is dropped → FAILED.
• If winter / snow / night / storm / horror tokens appear → FAILED.
• If scene reads as serious or grim → FAILED. MUST be fun + silly + kid-playroom.
• If the frame is empty / sparse / only the protagonist visible → FAILED.
• If no STORY ACTION is happening (static dolls, no motion) → FAILED. Action mid-progression.
• If real-prop set decoration is missing / sparse → FAILED. The scene must be DRESSED.

Output ONLY the raw scene description as comma-separated phrases (90-130 words). Lead with the STORY ACTION + setting + props, not the doll cast list. NO preamble, NO ━━━ markers, NO bullet lists, NO titles.`;
  },

  TOYBOT_PLUSH_STORYTELLING: ({ slots, sharedDNA }) => {
    const { camera_angle, scene } = slots;

    // Plush-storybook mischief scene. The seed (scene) is a 6-slot DNA
    // entry containing the FULL story: real surface + unexpected story
    // setup; protagonist plush + specific action; 3-5 supporting cast
    // across plush archetypes; multilayered real-prop set decoration;
    // warm cozy storybook light; overhead/floating chaos element.
    // Sonnet's only job is to render it as ONE comma-separated Flux
    // prompt that preserves ALL six story slots, captures the cozy-
    // mischief energy, and reads as a populated storybook scene with
    // the story playing out. Path skips chaos / two-pass polish /
    // sensory anchors — seeds are pre-tuned, downstream layers strip
    // slots or contradict the storybook-diorama intent.
    return `You are a children's-storybook-diorama photographer capturing a PLUSH-STORYBOOK MOMENT for ToyBot. The scene below is a fully-specified UNEXPECTED storybook scenario — a packed cozy-mischief beat with multiple plush characters coexisting in a multilayered real-prop set. Your job is to render it as ONE comma-separated Flux prompt that preserves ALL six story slots, captures the cute-cozy-mischief energy, and reads as a populated storybook scene with the story playing out.

⚠️ ABSOLUTE BANS
NEVER use: "diorama" / "scratch-built" / "ground-foam" / "static-grass" / "tilt-shift" / "model railroad" — although the scene IS staged like a diorama, do not name it as such.
NEVER add: winter / snow / blizzard / ice / frost / midnight / nightfall / dark / cold / monsoon / storm / moonlit / horror / nightmare / grim. The vibe is COZY + WARM + STORYBOOK + SLIGHTLY-ABSURD.
NEVER include LEGO / Lego / brick-built / studded / blocky-limb minifigs — separate bot.
NEVER include Sackboy burlap-with-zipper aesthetic — different ToyBot path. This is HUGGABLE PLUSH-FABRIC.
NEVER render needle-felted Etsy handcraft creatures, NOT small felt cutouts, NOT craft-y figurines — every plush is a CUTE Squishmallow-style fluffy huggable plushie (oversized round-pudgy fiberfill body, soft visible plush-fur, big embroidered eyes).
NEVER unify the plush characters' fur-colors — each plush has its OWN distinct fur color + archetype, but ALL render with the same fluffy-fiberfill huggable plush-fur quality.
NEVER render real animals or CGI — these are SOFT-FABRIC FLUFFY stuffed-animal characters.

━━━ THE STORYBOOK SCENE (fully specified — preserve ALL six slots) ━━━
${scene}

This 6-part scene has these mandatory slots in order:
  1. REAL surface + the UNEXPECTED STORY SETUP (what's happening — black-market honey trade / knit-off / comedy club / etc.)
  2. PROTAGONIST plush + their specific action
  3. 3-5 SUPPORTING CAST plush across DIFFERENT plush archetypes, each with a distinct action
  4. MULTILAYERED REAL-PROP SET DECORATION (kid-found household objects dressing the scene)
  5. WARM COZY STORYBOOK LIGHT
  6. WHIMSICAL OVERHEAD / FLOATING CHAOS ELEMENT

ALL six MUST appear visibly in your output. If a slot is missing, the render is REJECTED.

━━━ PLUSH AESTHETIC ━━━
Every plush character in the scene is a CUTE Squishmallow-style fluffy huggable plushie — oversized round-pudgy fiberfill body, soft visible plush-fur coating, floppy limbs, big embroidered or button eyes, sewn-on muzzle. The plush cast (which specific animals appear) comes ENTIRELY from the scene seed above — DO NOT add or substitute animals. The aesthetic is what to lock: CUTE + ROUND + FLUFFY + HUGGABLE.

Anti-list: NOT needle-felted Etsy creatures, NOT small felt cutouts, NOT craft-figurines, NOT Sylvanian / Calico Critter flocked figurines, NOT Pop-Mart collectibles, NOT realistic stuffed-animal collector pieces.

━━━ MULTILAYERED REAL-PROP SET DECORATION (NON-NEGOTIABLE) ━━━
The scene is DRESSED. Beyond the plush cast there are 3-4 visible real-world kid-found household objects acting as scenery: real coffee mugs, real coins, real twigs, real moss, real petals, real autumn leaves, real ribbons, real teacups, real candy wrappers, real Post-it notes, real chalk, real glass jars, real wooden blocks, real fabric scraps, real spoons, real corks, real buttons, real string-lights, real lavender sprigs, real seashells. The PROPS BUILD THE WORLD around the plush characters.

━━━ CAMERA — MEDIUM-WIDE STORYBOOK-DIORAMA FRAMING ━━━
${camera_angle}

Medium-wide cinematic storybook-diorama still — NOT a posed group photo, NOT a tight close-up macro. The hero plush is mid-action as the compositional anchor; supporting plush is in distinct individual mini-actions, NOT facing camera in a lineup. Deep-focus throughout so every plush's NATIVE fabric/knit/felt texture is readable. NEVER unify plush characters into a "cute Pop-Mart plushie" cartoon look — each plush stays distinct in its native plush-fiber medium.

━━━ ACTION ≠ POSED LINEUP — NON-NEGOTIABLE ━━━
The scene captures a STORY MOMENT mid-progression. Hero plush mid-action. Supporting cast each captured mid-DISTINCT-action (one shocked, one mid-stir, one fleeing, one laughing, one mid-grab, one taking notes). NEVER: plush facing camera arranged in rows / lineups / group-portrait poses. NEVER: cute static "gathered plushies looking at camera." Always: storybook-mischief in motion.

━━━ COMPOSITION ━━━
- Medium-wide narrative-action shot — hero plush mid-action dominates 30-40% of frame
- Supporting plush in distinct mid-action poses arrayed around at various depths
- The FRAME IS PACKED — 4-6 visible plush figures all DOING DISTINCT things
- A SPECIFIC UNEXPECTED STORY IS HAPPENING — narrative beat readable in one glance
- Each plush renders in its OWN plush-fiber type — NEVER unified style
- Real-prop scene-dressing visible throughout — multilayered set decoration
- COZY + WARM + STORYBOOK energy — cute-fluffy plush mischief mood
- The light specified in the seed is the ONLY light — no chaos, no winter, no night
- The overhead chaos element is visible in the upper third
- Deep-focus throughout — every plush + prop readable, textures sharply distinct

⚠️ FAILURE CONDITIONS
• If render is a POSED LINEUP / group portrait / plushies facing camera in a row → FAILED.
• If render is a TIGHT CLOSE-UP / macro / shallow-DOF on one plush → FAILED.
• If all plush render in UNIFIED CUTE-POP-MART style (all same texture) → FAILED. Textures MUST stay distinct.
• If plush render as NEEDLE-FELTED Etsy-handcraft creatures / small felt cutouts / craft-figurines → FAILED. They must be FLUFFY HUGGABLE FULL-BODIED stuffed animals.
• If any LEGO / Lego / brick-built figure appears → FAILED. Wrong bot.
• If any Sackboy burlap-with-zipper appears → FAILED. Wrong path.
• If real animals or CGI rendering appears → FAILED.
• If any of the 6 slots is dropped → FAILED.
• If winter / snow / night / storm / horror tokens appear → FAILED.
• If scene reads as serious or grim → FAILED. MUST be cozy + storybook + slightly absurd.
• If the frame is empty / sparse / only the protagonist visible → FAILED.
• If no STORY ACTION is happening (static plush, no motion) → FAILED. Action mid-progression.
• If real-prop set decoration is missing / sparse → FAILED. The scene must be DRESSED.

Output ONLY the raw scene description as comma-separated phrases (90-130 words). Lead with the STORY ACTION + setting + props, not the plush cast list. NO preamble, NO ━━━ markers, NO bullet lists, NO titles.`;
  },

  TOYBOT_TOYBOX_STORYTELLING: ({ slots, sharedDNA }) => {
    const { camera_angle, scene } = slots;

    // Mixed-medium toy-mischief storytelling scene. The seed (scene) is a
    // 6-slot DNA entry containing the FULL story: real surface + story
    // setup; protagonist + dramatic absurd action; 3-5 supporting cast
    // across brand families; absurd visual gag prop; warm play light;
    // overhead/floating chaos element. Sonnet's only job is to render
    // it as ONE comma-separated Flux prompt that preserves ALL six slots.
    // Path skips chaos / two-pass polish / sensory anchors — seeds are
    // pre-tuned, downstream layers strip slots or contradict the
    // populated-mischief-scene intent.
    return `You are a kid's-playroom photographer capturing a TOY-MISCHIEF MOMENT for ToyBot. The scene below is a fully-specified absurd toy-story — a packed comedy beat with multiple toy mediums coexisting. Your job is to render it as ONE comma-separated Flux prompt that preserves ALL six story slots, captures the FUN energy, and reads as a populated mischief scene with the story playing out.

⚠️ ABSOLUTE BANS
NEVER use: "diorama" / "scratch-built" / "ground-foam" / "static-grass" / "cozy storybook" / "model railroad" — this is REAL kid playtime, not a hobbyist diorama.
NEVER add: winter / snow / blizzard / ice / frost / midnight / nightfall / monsoon / storm / dark / moonlit / horror / nightmare / grim. The vibe is FUN + WARM + SILLY + SLAPSTICK.
NEVER include LEGO / Lego / brick-built / studded / blocky-limb minifigs — they belong to a separate bot. If the seed text mentions a "LEGO minifig" or any LEGO figure, SILENTLY SWAP it for a different toy-brand figure (Funko Pop, vintage action figure, Polly Pocket, plush, plastic dinosaur, Power Ranger, etc.) playing the same role. The output must contain NO LEGO references.
NEVER unify the toys' art style — each toy stays in its OWN native medium (plush stays plush with fabric texture, vinyl Funko stays cube-headed glossy, action-figures stay articulated, Hot Wheels stay die-cast chrome, army-men stay olive-green molded plastic, Calico Critter stays flocked-velvet).

━━━ THE MISCHIEF SCENE (fully specified — preserve ALL six slots) ━━━
${scene}

This 6-part scene has these mandatory slots in order:
  1. REAL surface + the STORY SETUP (what's happening — heist / wedding / talent show / rescue / etc.)
  2. PROTAGONIST + their dramatic absurd action
  3. 3-5 SUPPORTING CAST characters across different toy-brand families, each with a distinct action
  4. ABSURD VISUAL GAG / comedy prop detail
  5. WARM PLAY LIGHT (lamp / window sun / fairy lights / etc.)
  6. OVERHEAD / FLOATING CHAOS ELEMENT suspended above or drifting through

ALL six MUST appear visibly in your output. If a slot is missing, the render is REJECTED.

━━━ MIXED-MEDIUM TOY-ENSEMBLE RULES (NO LEGO) ━━━
Every render shows 4-6+ DIFFERENT toy mediums coexisting in ONE scene at their REAL real-world physical sizes. Scale mismatches are THE POINT — a 4-inch action-figure next to a 1.5-inch Hot Wheels next to a 12-inch plush teddy next to a tiny Calico Critter figurine — as it would actually look on a real floor.

Each toy gets rendered in its OWN native medium (NO LEGO):
  • plush stuffed animal — visible fabric texture + button or embroidered eyes + sewn seams
  • Funko Pop vinyl — oversized cube head + small stocky body + solid black dot eyes + glossy finish
  • 3.75-inch action figure (G.I. Joe / Power Ranger / Buzz Lightyear / Transformer style) — visible ball-joint articulation + painted detail wash + sculpted gear
  • Barbie / Ken / Bratz / Lalaloopsy / fashion doll — articulated plastic + molded glossy hair + painted face
  • Hot Wheels / Micro Machines — 1:64 die-cast with chrome accents + oversized wheels
  • Olive-green army-man — solid-color molded plastic + visible vertical mold-seam + oval base + fixed pose
  • Calico Critter / Sylvanian Family — flocked velvet-textured small-animal figurine + tiny cloth outfit
  • Vintage Kenner 3.75-inch — sandy hand-paint detail + period-correct accessory
  • Polly Pocket / Strawberry Shortcake / Shopkins / My Little Pony — period-correct visual signatures
  • plastic toy dinosaur / farm animal / wrestler / superhero — molded plastic at toybox scale
  • stitched-Sackboy with button-eyes (NOT LEGO)

━━━ CAMERA — MEDIUM-WIDE NARRATIVE-ACTION FRAMING ━━━
${camera_angle}

Medium-wide cinematic action-still — NOT a posed group photo. The hero is mid-action as the compositional anchor; supporting cast is in distinct individual mini-actions, NOT facing camera in a lineup. Deep-focus throughout so every toy's NATIVE MATERIAL is readable (plush=fabric, vinyl=glossy cube-head, die-cast=chrome, articulated action-figure=ball-joints, fashion-doll=glossy painted face, army-man=olive-green plastic, Calico Critter=flocked velvet). NEVER unify into "cute cartoon toy" style — each toy STAYS distinct in its native medium.

━━━ ACTION ≠ POSED LINEUP — NON-NEGOTIABLE ━━━
The scene captures a STORY MOMENT mid-progression. Hero is mid-leap / mid-charge / mid-confrontation / mid-dramatic-beat. Supporting cast each captured mid-DISTINCT-action (one shocked, one fleeing, one laughing, one pointing, one mid-tackle, one taking notes). NEVER: toys facing camera arranged in rows / lineups / group-portrait poses. NEVER: cute static "gathered toys looking at camera." Always: chaos in motion.

━━━ COMPOSITION ━━━
- Medium-wide narrative-action shot — hero mid-action dominates 30-40% of frame
- Supporting cast in distinct mid-action poses arrayed around at various depths
- The FRAME IS PACKED — 5-8 visible toy figures all DOING DISTINCT things
- A SPECIFIC STORY IS HAPPENING — narrative beat readable from one glance
- Each toy renders in its OWN native material — NEVER unified style
- Real-world surface textures: real wood grain / real fabric weave / real grass / real concrete
- FUN energy — silly, slapstick, sitcom, toys-dicking-off vibe
- The gag prop is visible somewhere in the frame
- The light specified in the seed is the ONLY light — no chaos, no winter, no night
- The overhead chaos element is visible in the upper third
- Deep-focus throughout — every cast member readable, materials sharply distinct

⚠️ FAILURE CONDITIONS
• If render is a POSED LINEUP / group portrait / toys facing camera in a row → FAILED.
• If render is a TIGHT CLOSE-UP / macro / shallow-DOF on one toy → FAILED.
• If all toys render in UNIFIED CUTE STYLE (all cube-headed / all cartoon-y) → FAILED. Materials MUST stay distinct.
• If any LEGO / Lego / brick-built figure appears → FAILED. Wrong bot.
• If any of the 6 slots is dropped → FAILED.
• If winter / snow / night / storm / horror tokens appear → FAILED.
• If scene reads as serious or grim → FAILED. MUST be fun + silly.
• If the frame is empty / sparse / only the protagonist visible → FAILED.
• If no STORY ACTION is happening (static toys, no motion) → FAILED. Action mid-progression.

Output ONLY the raw scene description as comma-separated phrases (90-130 words). Lead with the STORY ACTION, not the toys. NO preamble, NO ━━━ markers, NO bullet lists, NO titles.`;
  },

  TOYBOT_MODEL_TRAIN_WORLD: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      camera_angle,
      scene,
      train_consist,
      train_weather,
      drama_moment,
      unusual_cargo,
      world_real_setting,
      world_themed_setting,
    } = slots;

    // RENDER MODE BRANCHING — three modes:
    //   1. classic-diorama   → handcrafted diorama terrain (existing)
    //   2. real-world        → toy train in REAL everyday environments
    //                          (family room floor, garden, sandbox,
    //                          porch, camp site, gutter, kid's bedroom)
    //   3. themed-cinematic  → train in genre-coded immersive worlds
    //
    // World-mode fires when sharedDNA.renderMode === 'world'.
    // Inside world-mode: 100% real-world for now (themed mode dialed
    // to 0% while we focus on real-everyday quality — bump back up
    // when real-world converges).
    const isWorldMode = sharedDNA.renderMode === 'world';
    const worldRoll = Math.random();
    const mode = !isWorldMode ? 'classic' : worldRoll < 1.0 ? 'real' : 'themed';

    // ─── CLASSIC DIORAMA MODE ──────────────────────────────────────────
    if (mode === 'classic') {
      const dramaMomentSection = drama_moment
        ? `
━━━ THE DRAMATIC BEAT — MANDATORY ACTION ━━━
${drama_moment}

Render this beat as frozen mid-action: kinetic motion, dust/spray/sparks where appropriate. NEVER ignore this beat for a generic "train rolls through pretty terrain" composition.

`
        : '';
      const unusualCargoSection = unusual_cargo
        ? `
━━━ UNUSUAL CARGO — VISIBLE ON THE TRAIN ━━━
${unusual_cargo}

Place this cargo on a flat / gondola / specialized car. The cargo MUST be visible in the frame.

`
        : '';

      return `You are an HO-scale model-train hobbyist photographer writing MODEL-TRAIN-DIORAMA scenes for ToyBot. Pure miniature-railroad world — obsessive scratch-built terrain populated by tiny model trains. Cozy + dioramic.

━━━ TOY PHOTOGRAPHY (NON-NEGOTIABLE) ━━━
Render as a REAL PHYSICAL TOY photographed in a handcrafted set with dramatic cinematic lighting. Toy-ness IS the art. Model-train means HO-scale / N-scale die-cast train on twin nickel-silver rails on a scratch-built terrain board. Visible scale: 1/87 or 1/160. Construction tells: ground foam, lichen-trees, plaster rock, static-grass.

━━━ PATH MEDIUM LOCK ━━━
Locked to model_train_diorama medium. NEVER LEGO, claymation, vinyl, action figures, plush. ONLY HO/N-scale hobbyist diorama.

━━━ CAMERA ━━━
${camera_angle}

━━━ WEATHER + SEASON + TIME-OF-DAY ━━━
${train_weather}

━━━ THE TRAIN — EXACT CONSIST ━━━
${train_consist}

━━━ THE MODEL-TRAIN SCENE ━━━
${scene}

${dramaMomentSection}${unusualCargoSection}━━━ CAMERA FRAMING ━━━
${sharedDNA.camera}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ BLOW IT UP — TOY AMPLIFICATION ━━━
Ballast, weathered rail-tops, panel-line wash, brake-shoes, knuckle-couplers, grab-irons, sand-domes, headlight glow, exhaust steam, marker-lights, lit depot windows. Obsessive railroad-hobbyist craft.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Wide diorama frame — tiny model-train in sweeping handcrafted terrain. Track-side or aerial-quarter angle. Lit windows, smoke, atmospheric haze. NO PEOPLE.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO ━━━ markers.`;
    }

    // ─── REAL-WORLD MODE — toy train in REAL everyday playtime scene ───
    //
    // The seed (world_real_setting) is a 6-slot DNA entry containing the
    // FULL scene (surface, floral arch, named toy, critter, warm light,
    // floating extra). Sonnet's only job is to render it as a single
    // comma-separated Flux prompt — NOT to expand or reframe it. Adding
    // scenePalette / colorPalette / vibeDirective / weather slots
    // here injects winter / midnight / monsoon tokens that override
    // the seed's warm-daylight slot (R6 audit 2026-05-19 — caused
    // whiteout-winter and midnight-storm-cloud failures).
    if (mode === 'real') {
      return `You are a casual playtime photographer capturing a SMALL TOY TRAIN moment for ToyBot. The scene below is a fully-specified PLAYTIME SCENE — a kid set it up with named toys, real flowers, a tiny real critter, warm light, and a whimsical floating element. Your job is to render it as ONE comma-separated Flux prompt that preserves ALL six elements.

⚠️ ABSOLUTE BANS
NEVER use: "HO-scale" / "N-scale" / "1:87" / "1:160" / "model train" / "model locomotive" / "model railroad" / "diorama" / "scratch-built" / "ground-foam" / "lichen-tree" / "plaster-rock" / "static-grass" / "baseboard" / "cozy storybook".
NEVER add: winter / snow / blizzard / ice / frost / midnight / nightfall / monsoon / storm / dark / moonlit. The scene is warm daylight or warm interior light — preserve the light specified in the seed.
USE INSTEAD: "small toy train" / "tiny toy locomotive" / "kids' toy train" / "Lionel-style toy train".

━━━ THE PLAYTIME SCENE (fully specified — preserve ALL six slots) ━━━
${world_real_setting}

This 6-part scene has these mandatory slots in order:
  1. Real playtime surface (rug / beach / sandbox / picnic blanket / etc.)
  2. Real floral architecture along the tracks (lavender hedgerow / daisy fenceposts / etc.)
  3. Named specific toy character + action beside the rails (Barbie / LEGO / G.I. Joe / Funko / etc.)
  4. Tiny real critter at real scale on/near the rails (ladybug / ant / butterfly / etc.)
  5. Warm natural light (golden hour / dappled sun / window light / etc.)
  6. Whimsical floating/atmospheric extra overhead (UFO toy / paper airplane / balloons / etc.)

ALL six MUST appear in your output. If a slot is missing, the render is REJECTED.

━━━ THE TRAIN ━━━
Render the train as a SMALL TOY train — Lionel-style or Brio-style or Thomas-style, a few inches long, visibly a toy in a kid's playtime scene. NEVER a hobbyist scale model.

━━━ CAMERA ━━━
${camera_angle}

━━━ COMPOSITION ━━━
- The TRAIN is small and toy-like (a few inches long)
- The SCENE is the wow — populated kid's-playtime moment, NOT a lonely train
- The named toy character + flowers + critter + floating extra are equally important to the train
- Real-world textures: real wood grain / real fabric weave / real grass / real sand / real petals
- The light specified in the seed is the ONLY light — no chaos, no winter, no night

⚠️ FAILURE CONDITIONS
• If render reads as a cozy storybook / HO-scale / hobbyist diorama → FAILED
• If any of the 6 slots is dropped → FAILED
• If winter / snow / night / storm tokens appear → FAILED
• If the train is 1:1 real-size → FAILED

Output ONLY the raw scene description as comma-separated phrases (60-100 words). NO preamble, NO ━━━ markers, NO bullet lists.`;
    }

    // ─── THEMED-CINEMATIC MODE — train as hero in genre-coded world ────
    return `You are a cinematic-still photographer capturing a TINY MODEL TRAIN as the hero in an IMMERSIVE GENRE-CODED WORLD for ToyBot. NOT a diorama. NOT a real kitchen. A movie-still or video-game-screenshot vibe where the train is the protagonist in a recognizable cinematic environment.

⚠️⚠️⚠️ ABSOLUTE RULE — IMMERSIVE WORLD, NOT DIORAMA ⚠️⚠️⚠️
This is NOT scratch-built terrain. NOT ground-foam. NOT lichen-trees. NOT plaster-rock. This IS a fully-realized cinematic environment — Hollywood-grade location, genre-coded setting, atmospheric and lived-in. The toy train stays tiny in scale, but the world looms huge and immersive around it. If render reads as "handcrafted hobbyist diorama" → CRITICAL FAILURE.

━━━ TOY-IN-CINEMATIC-WORLD PHOTOGRAPHY ━━━
HO-scale (1:87) or N-scale die-cast model train preserves its toy-ness (visible scale, panel-line wash, brass detail, knuckle couplers). The WORLD around it is movie-set-grade — photoreal cinematic environment from a recognizable genre. Like a National-Geographic shot of a tiny train inserted into a real Hollywood-scale themed world.

━━━ THE TRAIN — EXACT CONSIST ━━━
${train_consist}

━━━ WEATHER + TIME OF DAY ━━━
${train_weather}

━━━ THE THEMED-CINEMATIC SETTING ━━━
${world_themed_setting}

This is the WHERE. The setting must be CINEMATIC and GENRE-CODED — Western dust-canyon / fantasy magical-forest / cyberpunk neon-city / Polar Express deep-snow midnight / Mad Max post-apoc wasteland / Studio Ghibli watercolor-dreamscape / underwater coral-reef / etc. Lighting + atmosphere appropriate to the genre. The world is HUGE around the toy-scale train.

━━━ SCALE TENSION ━━━
The train stays toy-scale (visible 1/87 detail at macro). The cinematic world is at world-scale — a dinosaur is real-scale to the world, a castle is full-scale, an armored car beside the train is at train-scale. The collision of toy-train + real-world-cinematic-scenery is the wow.

━━━ CAMERA ━━━
${camera_angle}

━━━ CAMERA FRAMING ━━━
${sharedDNA.camera}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION RULES ━━━
- Cinematic FRAMING — wide establishing shot, rule-of-thirds, leading lines, dramatic foreground-anchor
- The TRAIN is tiny but readable — viewer's eye finds it as the hero
- The WORLD is immersive — atmospheric depth, layered backgrounds, lived-in feeling
- Lighting is genre-appropriate — aurora for Polar Express, dust haze for Western, neon glow for cyberpunk, watercolor pastels for Ghibli, blood-red sunset for Mad Max
- Atmospheric particulate (dust / mist / snow / spark / fog) where appropriate to genre

⚠️ FAILURE CONDITIONS
• If render reads as a model-railroad diorama / hobbyist setup → FAILED
• If world reads as scratch-built / hobbyist-handcrafted instead of cinematic → FAILED
• If world reads as a generic real kitchen / sandbox instead of genre-coded → FAILED (that's real-world mode, not themed)
• If the train is 1:1 (real-size) → FAILED. Train stays TINY.
• If genre is unclear / generic / undecided → FAILED. Lean hard into the named genre.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO ━━━ markers.`;
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




  TOYBOT_TOY_LANDSCAPE: ({ slots, sharedDNA, vibeDirective }) => {
    const { camera_angle, scenario, staging, landscape } = slots;
    const isWorldMode = sharedDNA.renderMode === 'world';

    const worldStagingSection = isWorldMode
      ? `━━━ THE SCENARIO ━━━
${scenario}

Combine the landscape described above with this multi-character story moment in a real-world setting. The toy-medium landscape elements perform the scenario at toy scale.

━━━ REAL-WORLD STAGING — TOY LIVING IN OUR WORLD AT ITS SCALE ━━━
${staging}

━━━ REAL-WORLD STAGING — NON-NEGOTIABLE ━━━

The toy-landscape is LIVING in the REAL WORLD at its tiny scale. The scene is shot in a real human environment with the toy-landscape existing INSIDE that environment as if it has a tiny life happening there. NOT a handcrafted toy diorama on a backdrop. The real world IS the toy's world. Forced perspective and scale illusion are encouraged.

`
      : '';

    return `You are a toy-landscape photographer writing TOY LANDSCAPE scenes for ToyBot. NO characters. Epic landscape entirely in one toy medium. Landscape is hero, toy-ness is the art. Output wraps with style prefix + suffix.

━━━ TOY PHOTOGRAPHY (NON-NEGOTIABLE) ━━━

Render as a REAL PHYSICAL TOY landscape photographed in a handcrafted set with dramatic cinematic lighting. Toy-ness IS the art — never render as "real" version. If clay, fingerprints + paint-strokes visible. If LEGO, bricks + studs visible. If vinyl, glossy matte sheen visible. The medium signature is loud in every textural detail.

━━━ LIGHTING ELEVATES THE MEDIUM ━━━

Lighting is the multiplier that makes plastic / clay / fabric feel like it belongs in a museum. The exact palette comes from the LIGHTING and VIBE-COLOR sections below — do NOT default to teal-and-orange. Respect the specified palette (monochrome / high-key / low-key / noon-flat / noir-hard / golden-hour / blue-hour / neon / sodium / etc.) and build the scene around IT. Atmospheric depth via smoke / haze / dust / steam / rain / snow / pollen / backlight is welcome, but the color temperature must follow the pool's call.

━━━ PATH MEDIUM LOCK — NEVER MIX ━━━

This path's medium for this render is locked to whatever ToyBot's medium-picker chose (claymation OR vinyl). NEVER mix LEGO bricks into a claymation landscape. NEVER put Funko vinyl figures into a clay landscape. The medium for this render is absolute — stay true.

━━━ THE 30/70 LANDSCAPE-WITH-CHARACTERS MIX ━━━

Toy-landscape paths follow a curated mix: ~30% PURE LANDSCAPE renders (no figures, terrain is the entire subject) and ~70% CHARACTER-IN-LANDSCAPE renders where a tiny minifigure / clay-person / vinyl-figure inhabits the toy-medium terrain at scale. The LANDSCAPE is always the dominant subject — the figure (if present) is small-scale within it, a story-beat or scale-prover, never a centered hero portrait.

When a character is present:
  • Body-shaping pose-first action — climbing, peering, trekking, surveying, reaching
  • Tiny scale relative to the terrain (figure is 5-15% of frame, terrain fills the rest)
  • Same medium as the landscape (LEGO minifig in LEGO landscape, clay-person in clay landscape, vinyl figure in vinyl landscape)
  • NEVER a centered face-forward portrait — the figure is a denizen of the toy-world

When no character is present (~30% of renders):
  • Pure landscape vista — the medium IS the entire frame
  • Multi-tier depth + atmospheric effect + medium-signature texture carry the scene alone

━━━ THE STORY-BEAT MANDATE — every character-present render is a NARRATIVE MOMENT, not a portrait ━━━

When a figure is in the frame, the render is a SINGLE FRAME OF A STORY — something is HAPPENING, not "figure standing in environment". The composition tells the viewer: who is this character, what are they doing right this second, what came before, what's about to happen. Like a single comic-panel from a tiny toy-world graphic novel.

REQUIRED in every character-present render:
  • An ACTION verb mid-motion — climbing / peering / fleeing / hiding / discovering / surveying / repairing / sheltering / returning / signaling / chasing / cresting / arriving / departing / pointing / reaching / drinking / fishing / digging / gathering / abandoning / rescuing
  • A SPATIAL relationship to the landscape — the action is BECAUSE of the landscape (climbing the cliff, fleeing the storm, peering from the ridge, sheltering under the overhang, fishing from the dock, cresting the dune, arriving at the lone outpost, abandoning the camp, signaling across the valley)
  • An IMPLIED consequence or cause — the viewer can read "they got here because X" or "they're about to Y" — a backpack hints at travel, footprints hint at where they came from, a wound hints at the threat behind, a beckoning gesture hints at someone off-frame
  • A second TINY DETAIL that hints at the story — discarded gear / footprints / fire-glow over a ridge / abandoned shelter / a second figure in the deep distance / smoke from a distant chimney / hoofprints in mud / scattered debris from a recent event

BAD (portrait, not story): "vinyl figure standing in red-rock terrain"
BAD (decoration, not story): "vinyl bear-minifig at a waterfall in a LEGO forest at night"
GOOD (story-beat): "vinyl bear-minifig perched on a moss-covered LEGO boulder above a waterfall at midnight, lantern held high as he peers down toward something glimmering in the LEGO stream below — his tiny backpack discarded on the moss behind him, footprints leading back through the pine grove"
GOOD (story-beat): "vinyl explorer-figure mid-rappel down a sheer red-rock canyon wall, dust trailing from her boots as she descends toward a hidden cave-mouth glowing faintly below, a coil of rope and a discarded canteen at the cliff-top above where she started"

The figure-scale stays small (5-15% of frame, vista dominates) but the figure is MID-NARRATIVE — caught at a specific moment of a journey or task, not posing.

━━━ THE TOY LANDSCAPE ━━━
${landscape}

━━━ CAMERA (the variety knob — apply EXACTLY) ━━━
${camera_angle}

${worldStagingSection}━━━ CAMERA FRAMING — VARY THE ZOOM ━━━
${sharedDNA.camera}



━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ BLOW IT UP — TOY-LANDSCAPE AMPLIFICATION ━━━

Stack medium-signature detail to the EXTREME across the landscape. Every surface texture is OBSESSIVE craft. If clay: fingerprints + thumbprints + tool-scrapes + paint-strokes visible across every cliff / tree / hill. If LEGO bricks: stud-tops + slope-brick curves + tile smooth-surfaces + transparent-brick water + connection-seams visible across every formation. If vinyl: glossy matte sheen + factory-perfect injection-molded surfaces visible across every peak / valley / shoreline.

OBSESSIVE LANDSCAPE-DETAIL CATALOG — stack 5+ simultaneously:
1. MULTI-TIER DEPTH (mandatory) — foreground tactile-medium detail + midground hero landform + far-distance atmospheric layer fading to haze
2. WEATHER + ATMOSPHERE — smoke / mist / fog / rain / snow / dust appropriate to landscape
3. WATER FEATURE (if appropriate) — transparent-brick river / clay pond / vinyl-glossy lake with reflective sheen
4. VEGETATION — variety in medium (brick-trees / clay-trees / vinyl-flora) clustered for density, not isolated
5. ARCHITECTURE-IN-LANDSCAPE (rare structures only, since no characters) — distant scratch-built ruined tower / abandoned lighthouse / lone shrine / faraway windmill
6. SCALE PROVERS — small details that prove the bigness: tiny waterfall over giant cliff, tiny boat on enormous lake, scale-tree forest carpeting a vast plateau

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Wide toy-landscape vista. Medium-signature visible throughout. Cinematic practical-set lighting per pool palette. Multi-tier depth selling scale. Atmospheric haze in deep valleys. Awe at the craft. NO CHARACTERS.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
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


  CHIBIBOT_CUTE_FOOD: ({ slots, sharedDNA, vibeDirective }) => {
    const { hero, scatter, background, lighting } = slots;

    return `You are writing CUTE-FOOD scene descriptions for ChibiBot — bex.ai-inspired kawaii pop-mart food/drink renders where the food itself has a smiling face. Output is a 60-90 word comma-separated phrase string for Flux. NO preamble, NO labels, NO bullets.

━━━ CUTE + CUDDLY + COZY ━━━
Every render produces AWWW + instant smile + "this is the cutest thing" reaction. Wholesome delight. NO dark, NO edgy, NO menacing — ONLY pure sweetness.

━━━ THE BEX.AI AESTHETIC — NON-NEGOTIABLE ━━━

This path is hard-locked to the @bex.ai Instagram aesthetic:
  • HERO FOOD/DRINK HAS A KAWAII SMILING FACE — dimpled-cheek-blush, closed-arc-eyes, tiny-printed-mouth ON the food itself
  • GLOSSY 3D-RENDERED PEARLESCENT FINISH — Pop-Mart designer-vinyl rendering, glazed-pearlescent surfaces
  • DUSTY-MUTED-PASTEL PALETTE ONLY — soft dusty-blush-pink (gauzy NOT bright Barbie pink), soft mint-teal (powder NOT vivid teal), soft lavender, soft cream, soft peach, dusty baby-blue
  • NO HUMAN CHARACTERS, NO MINIFIGS, NO CREATURES eating the food — the food IS the entire cast

━━━ THE HERO FOOD (the smiling-face centerpiece) ━━━
${hero}

━━━ THE SCATTERED DECORATIONS (carpet around the hero — chockablock, never empty surface) ━━━
${scatter}

━━━ THE BACKGROUND (soft-gradient pastel — NEVER solid bold color) ━━━
${background}

━━━ THE LIGHTING ━━━
${lighting}

━━━ SCENE-WIDE COLOR PALETTE (vibe-driven, but always muted-pastel-soft) ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ HARD BANS — ABSOLUTE ━━━
🚫 NO bright/neon/saturated/electric/vivid/bold pink, magenta, electric-blue, hot-orange, navy, black, red, vibrant-rainbow — DUSTY-DREAMY-SOFT ONLY
🚫 NO solid bold-color backgrounds — soft gradients ONLY
🚫 NO human characters, NO chibi-figures, NO creature-mascots eating food
🚫 NO photoreal, NO illustration, NO Pixar-soft, NO plasticky-CGI
🚫 NO empty surface — table is chockablock with scattered tiny items
🚫 NO ditching the smiling-face mandate on the hero food/drink

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION ━━━
Hero food/drink centered or rule-of-thirds. Soft-blur dusty-pastel background. 15-20+ scattered tiny decorations carpeting the surface around the hero. Cherry-blossom branch may arch from corner. Setting is tabletop close-up (70%) or wider cute setting like picnic-meadow / cafe-window / garden-table (30%). Glossy pearlescent Pop-Mart finish. The viewer's reaction: "OMG THIS IS THE CUTEST."

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO "render as" suffixes. Just the phrases.`;
  },


  CHIBIBOT_HEARTWARMING_SCENE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature_1,
      creature_2,
      activity,
      setting,
      time_of_day,
      surprise_element,
      phenomenon,
      lighting,
      atmosphere,
      weather,
    } = slots;
    const isGroup = !!creature_2;
    // phenomenon is template-gated at 60% — pool always picks (cheap), template
    // decides to render the section. Composer's conditionalLayer is already
    // used by creature_2 (70% group gate).
    const phenomenonFires = Math.random() < 0.6;

    const creatureBlock = isGroup
      ? `A SMALL GROUP (3-5) of adorable creatures together — led by: ${creature_1}, joined by: ${creature_2} and a few others. Different species, different sizes, all equally cute, doing the activity together.`
      : `${creature_1} — solo, doing something heart-melting.`;

    const phenomenonBlock = phenomenonFires
      ? `\n\n━━━ ENVIRONMENTAL PHENOMENON (stack this on top of everything else) ━━━\n${phenomenon}`
      : '';

    return `You are writing HEARTWARMING CREATURE SCENES for ChibiBot — ${isGroup ? 'a little group of adorable creatures' : 'one adorable creature'} doing something heart-melting, staged inside a deliberately-chosen storybook setting at a deliberately-chosen time of day with deliberate weather${phenomenonFires ? ' and a magical phenomenon transforming the frame' : ''}. The viewer's reaction: "OMG IT'S TOO CUTE. I CAN'T." Output wraps with style prefix + suffix.

━━━ CUTE + CUDDLY + COZY (NON-NEGOTIABLE) ━━━

Every render must produce: AWWW + instant smile + "I want to hug it" instinct. If the render has even a whisper of dark / edgy / menacing — it FAILED. The reaction is wholesome delight — big eyes, soft shapes, infectious cuteness. Lighting + weather + phenomenon should match the SCENE naturally — rainy ≠ stormy, snowy ≠ blizzard, night ≠ scary — wholesome filter on everything.

━━━ RENDERED CGI — NEVER PHOTOREAL, NEVER PAINTED ━━━

Never photoreal. Never documentary-wildlife. Never flat illustration or painted artwork. Render as polished 3D CGI in the designer-collectible / Pop-Mart-vinyl register: glossy materials with subsurface scattering, ultra-clean form language with crisp surface definition, graphic-design crisp pattern work, dewy highlights. Creatures render with chibi proportions (oversized head, massive glassy reflective eyes, tiny stubby body). Settings + props render with the SAME glossy crisp CGI register. Let the MEDIUM tag control the specific render style.

━━━ NO DARK / NO INTENSE / NO CREEPY ━━━

Absolutely no menace, no threat, no horror, no creepy undertones, no "uncanny cute" disturbing vibes. Safe + wholesome + approachable. The tone is kind and gentle, not Tim-Burton-stop-motion. Lighting follows the time-of-day axis honestly — if it's blue hour, render blue hour; if it's golden hour, render golden hour; if it's moonlit, render silvery moonlit. DO NOT force everything to "warm golden" — variety is the goal.

━━━ NO HUMANS ━━━

No human figures, no faces, no hands. All subjects are creatures (real-exaggerated or fantasy-cute). If a setting would normally include a person, reimagine it without — the creature does the activity alone or with another creature, or uses the human's props (teacup / book / lantern) without the human present.

━━━ IMPOSSIBLE BEAUTY ━━━

Wall-poster quality. NOT dramatic-beautiful (that's GlowBot) — CUTE-beautiful. The composition is balanced and charming. Every element is rendered with love — the kind of image a kid pins above their bed and looks at every night.

━━━ THE CUTE CREATURE(S) ━━━
${creatureBlock}

━━━ THE HEART-MELTING ACTIVITY ━━━
${activity}

━━━ THE STORYBOOK SETTING (the stage) ━━━
${setting}

━━━ TIME OF DAY (drives light + color cast — render honestly) ━━━
${time_of_day}

━━━ WEATHER ━━━
${weather}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL (drifting particles, ambient charm) ━━━
${atmosphere}

━━━ SURPRISE ELEMENT (second-tier detail the eye finds AFTER the hero) ━━━
${surprise_element}${phenomenonBlock}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ BLOW IT UP — CUTENESS AMPLIFICATION ━━━

Cuteness is the canvas, not the ceiling. Stack cute-elements: glossy dewy surfaces with subsurface scattering + volumetric glow tinted to MATCH the time-of-day axis above (silvery-blue at moonlit night, indigo-pink at blue hour, peach-amber at golden hour, pearl-grey at dawn, cool-overcast at soft daylight — NOT forced warm-golden when the axis says otherwise) + sparkles + layered atmospheric charm + dense storybook micro-details (tiny mushrooms, floating hearts, cozy accessories, fairy-lights, wildflowers, whimsical incidental life). For creatures specifically, also stack: massive dewy glassy eyes with multi-layer catchlights + fluffy textured surfaces + blushing cheeks. For settings, stack environmental cuteness: dense magical detail in every corner, glowing windows (when night/dusk), blooming flora, atmospheric haze, postcard-pretty composition. Obsessive detail in service of wholesome delight.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
${isGroup ? 'Mid-wide frame with the group as heroes doing the activity together in the setting. 3-5 creatures visible, each contributing — one leading, others helping or reacting. Different heights and species for visual variety.' : 'Mid-close frame with creature as hero doing the activity inside the setting.'} The setting is unmistakable — viewer should be able to name WHERE this happens. The time-of-day color cast is honest (not always warm-golden). Surprise element tucked into the composition where the eye finds it second.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
  },


  CHIBIBOT_BATH_TIME: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature_1,
      creature_2,
      activity,
      setting,
      time_of_day,
      amenity,
      surprise_element,
      phenomenon,
      lighting,
      atmosphere,
      weather,
    } = slots;
    const isGroup = !!creature_2;
    const phenomenonFires = Math.random() < 0.6;

    const amenityList = Array.isArray(amenity) ? amenity : [amenity];
    const amenityBlock = amenityList.filter(Boolean).map((a, i) => `${i + 1}. ${a}`).join('\n');

    const creatureBlock = isGroup
      ? `A SMALL GROUP (3-5) of adorable creatures together — led by: ${creature_1}, joined by: ${creature_2} and a few others. Different species, different sizes, all squeezed into the bath together or doing spa activities side by side. Squeezed-in-together energy.`
      : `${creature_1} — solo bath time bliss.`;

    const phenomenonBlock = phenomenonFires
      ? `\n\n━━━ ENVIRONMENTAL PHENOMENON (stack this on top of everything else) ━━━\n${phenomenon}`
      : '';

    return `You are writing BATH TIME scenes for ChibiBot — ${isGroup ? 'a group of adorable creatures' : 'an adorable creature'} enjoying a tiny cozy bath inside a deliberately-chosen bath vessel + location at a deliberately-chosen time of day with deliberate weather${phenomenonFires ? ' and a magical phenomenon transforming the bath frame' : ''}. Bubbles, foam, steamy warmth, tiny accessories stacked. Spa-day-for-tiny-creatures bliss. The viewer's reaction: "OMG IT'S TOO CUTE. I CAN'T." Output wraps with style prefix + suffix.

━━━ CUTE + CUDDLY + COZY (NON-NEGOTIABLE) ━━━

Every render must produce: AWWW + instant smile + "I want to hug it" instinct. If the render has even a whisper of dark / edgy / scary — it FAILED. The reaction is wholesome bath-bliss — closed-eye contentment, foam-mustache joy, splashing delight. Lighting + weather + phenomenon should match the SCENE naturally — rainy ≠ stormy, outdoor-night ≠ scary, candlelit ≠ creepy — wholesome filter on everything.

━━━ RENDERED CGI — NEVER PHOTOREAL, NEVER PAINTED ━━━

Never photoreal. Never documentary-wildlife. Never flat illustration or painted artwork. Render as polished 3D CGI in the designer-collectible / Pop-Mart-vinyl register: glossy materials with subsurface scattering, ultra-clean form language with crisp surface definition, graphic-design crisp pattern work, dewy highlights. Creatures render with chibi proportions (oversized head, massive glassy reflective eyes, tiny stubby body). Bath vessel + amenities + setting render with the SAME glossy crisp CGI register. Bubbles are JEWEL-LIKE iridescent translucent spheres with rainbow refractions. Foam is fluffy + opaque with marshmallow texture. Water is clear with caustic light-play on surfaces below. Let the MEDIUM tag control the specific render style.

━━━ NO DARK / NO INTENSE / NO CREEPY ━━━

Absolutely no menace, no threat, no horror, no creepy undertones, no "uncanny cute" disturbing vibes, no slipping-falling-distress moments. Safe + wholesome + spa-bliss. The tone is kind and gentle. Lighting follows the time-of-day axis honestly — if it's blue hour, render blue hour; if it's golden hour, render golden hour; if it's moonlit, render silvery moonlit; if it's overcast soft daylight, render cool diffuse. DO NOT force everything to "warm steamy golden" — variety is the goal even though baths feel warm.

━━━ NO HUMANS ━━━

No human figures, no faces, no hands. All bathers are creatures (real-exaggerated or fantasy-cute). If a setting would normally include a person, reimagine it without — the creature uses the human-scale props at tiny scale, or no person is in the room. Human-coded items (towels, candles, soap) appear as STAGE PROPS, not as belonging to anyone.

━━━ IMPOSSIBLE BEAUTY ━━━

Wall-poster quality. NOT dramatic-beautiful (that's GlowBot) — CUTE-beautiful. The composition is balanced and charming. Every element rendered with love — the kind of image a kid pins above their bed.

━━━ THE CUTE CREATURE(S) ━━━
${creatureBlock}

━━━ THE BATH-TIME ACTIVITY (what the creature is DOING right now) ━━━
${activity}

━━━ THE BATH VESSEL + LOCATION (the stage) ━━━
${setting}

━━━ STACKED BATH AMENITIES (TWO specific props amplify the cuteness) ━━━
${amenityBlock}

━━━ TIME OF DAY (drives light + color cast — render honestly) ━━━
${time_of_day}

━━━ WEATHER (especially affects outdoor bath settings) ━━━
${weather}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL (steam swirls, drifting bubbles, ambient charm) ━━━
${atmosphere}

━━━ SURPRISE ELEMENT (second-tier detail the eye finds AFTER the hero) ━━━
${surprise_element}${phenomenonBlock}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ BLOW IT UP — BATH CUTENESS AMPLIFICATION ━━━

Cuteness is the canvas, not the ceiling. Stack bath-cute-elements: jewel-iridescent translucent bubbles + fluffy marshmallow foam mounds + steam wisps curling upward + glossy dewy surfaces with subsurface scattering + volumetric glow tinted to MATCH the time-of-day axis above (silvery-blue at moonlit night, indigo-pink at blue hour, peach-amber at golden hour, pearl-grey at dawn, cool-overcast at soft daylight, warm-amber-candlelit at evening interior — NOT forced warm-golden when the axis says otherwise) + sparkles drifting in the steam + layered atmospheric charm. For creatures, also stack: massive dewy glassy eyes with multi-layer catchlights + soaked-fluffy fur clumping in soft points + blushing cheeks + foam crowns / mustaches / beard sculptures + paws raised in bath-joy. For bath setting, stack environmental cuteness: TWO amenities prominently visible (rubber duck, candle, glass shampoo bottle, fluffy towels — whatever was picked above), thick stacked bubble mounds inside the tub, water with light-play caustics, dense magical detail in every corner. Obsessive detail in service of wholesome bath-bliss delight.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION (SETTING IS A CO-HERO, NOT JUST A STAGE) ━━━

The bath LOCATION must be visibly half the magic — NOT a tight intimate portrait with a generic backdrop. Pull the camera back so the viewer can SEE WHERE this bath is happening: pirate-ship deck visible behind the tub, mountain peaks above the hot spring, aurora dancing over the cloud-island plunge pool, lighthouse balcony railing framing the soak, submarine porthole showing fish swimming past, underwater coral surrounding the bubble dome, Roman-villa columns around the marble pool, tropical reef visible from the conch-shell rim. The location is half the magic — frame it as such.

${isGroup ? 'Wider establishing frame with the group + the SPECTACULAR location both clearly readable. 3-5 creatures bathing together in the foreground/midground; the location vista (sky / sea / canopy / cave / volcano / aurora / etc.) fills 50%+ of the frame. Squeezed-in-together energy among the creatures, location-dominant scale around them.' : 'Wider establishing frame — creature in the bath at midground/foreground (still clearly the focal point), the dramatic LOCATION filling 50%+ of the frame. Think postcard-from-an-epic-bath-vacation, not bathroom selfie. Show what makes this place a destination.'} Viewer should be able to name BOTH (1) the specific bath vessel AND (2) the spectacular destination in one glance ("ohhh, creature bathing on a PIRATE SHIP / IN A CLOUD / AT A VOLCANIC HOT SPRING / IN A LIGHTHOUSE / UNDERWATER / ON A TREEHOUSE VERANDA"). Name the two amenities present without crowding the location. Time-of-day color cast honest. Surprise element tucked where the eye finds it second.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
  },


  CHIBIBOT_CUDDLY_AQUATIC: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature_1,
      creature_2,
      interaction,
      setting,
      time_of_day,
      surprise_element,
      phenomenon,
      lighting,
      atmosphere,
      weather,
    } = slots;
    // phenomenon template-gated at 60%
    const phenomenonFires = Math.random() < 0.6;

    const phenomenonBlock = phenomenonFires
      ? `\n\n━━━ ENVIRONMENTAL PHENOMENON (stack this on top of everything else) ━━━\n${phenomenon}`
      : '';

    return `You are writing CUDDLY AQUATIC scenes for ChibiBot — a PAIR of impossibly cute baby aquatic creatures cuddling together in their underwater / surface-water habitat. Sea otter pups holding paws, baby seals on ice, hermit-crab anemone villages, jellyfish-blanket octopuses, axolotl tea rooms, dumbo octopuses with bonnets. Pixar / Sanrio / Studio Ghibli / Finding Nemo cuteness${phenomenonFires ? ', with a magical aquatic phenomenon transforming the frame' : ''}. The viewer's reaction: "OMG THEY ARE TOO CUTE TOGETHER. I CAN'T." Output wraps with style prefix + suffix.

━━━ MOVIE POSTER MOMENT — every shot must be a frame-worthy still ━━━

This is NOT a quick snapshot. EVERY render must be poster-worthy — a single frame that someone would screenshot, save to their wallpaper folder, and stare at. The pair-bond moment must be the EMOTIONAL CENTER of a composition you'd see in a Pixar / Studio Ghibli / Finding Nemo / Studio Laika movie poster. Composition: deliberate rule-of-thirds or perfect centered symmetry. Light: dramatic and intentional (caustic light-shafts, golden god-rays through water, bioluminescent halo, rim-light along creature silhouettes). Color: saturated and harmonious (the scene palette + time-of-day cast working together). Depth: foreground anchor + midground heroes + atmospheric far-distance haze. EVERY render makes the viewer go AWWW AND ALSO WOW.

━━━ STORY BEAT — every render tells a STORY, never a pose ━━━

CRITICAL: This is NOT a posed product shot of two figurines standing nose-to-nose. EVERY render must show a NARRATIVE EVENT — the viewer reads in 2 seconds what JUST happened or what's ABOUT TO happen. Think Lego Masters: every build "has to tell a story". Same bar here.

A scene WITH story (PASS):
- "Both creatures wide-eyed at a meteor streaking across the sky, paws raised mid-point"
- "One scrambling to catch a firefly that just escaped the jar, the other laughing"
- "Just opened a storybook on the grass, both eyes huge at what's on the page"
- "Mid-toast with thimble teacups, eyes squeezed shut in 'cheers'"
- "One comforting the other after the rain just stopped, paw on its shoulder"
- "Discovering the mushroom-house door is unlocked, peering inside with cautious excitement"
- "Mid-handoff of a wrapped present, recipient's eyes lighting up"

A scene WITHOUT story (FAIL — DO NOT render this):
- "Two creatures standing nose-to-nose smiling"
- "Sitting close together looking at each other"
- "Pressed cheek-to-cheek with closed eyes"
- "Both standing side-by-side facing the camera"
- "Holding paws and posing"

Indicators of story:
- Active VERBS happening (catching / discovering / pointing / scrambling / hugging-because / sharing-mid-bite / startled-by / reaching-for)
- Implied PREVIOUS or NEXT moment (something just happened OR is about to)
- Body language showing REACTION (wide eyes, open mouth, raised paw, leaning-in, recoiling-with-surprise, mid-laugh, mid-yawn)
- An EVENT or OBJECT they're responding to (a meteor, a present, an open book, an escaped firefly, a tipping lantern, a found-treasure)

The interaction axis already named the story beat. Render that as a MOMENT, not a pose. The viewer should be able to ask "what's happening here?" and answer in one sentence within 2 seconds.

━━━ SPARKLE STACK — MAXIMUM ADORABLE EFFECTS ━━━

Layer ALL of these atmospheric effects on EVERY render (not optional — stack them ALL):
- Caustic light-play dancing across creatures and habitat surfaces
- Sun-shafts / god-rays cutting through the water column in visible parallel beams
- Rising bubble-trails of jewel-iridescent translucent spheres in varied sizes
- Plankton-sparkle particles drifting through the water column (thousands of tiny pin-points of light)
- Sparkle / star-burst flares around BOTH creatures' eyes (multi-catchlight glints)
- Bioluminescent ambient glow around magical features (anemones, jellyfish, glow-coral)
- Dewdrop / water-pearl highlights on creatures' fur / scales / skin
- Ripple-rings on the water surface OR refraction-lens distortion in the water
- Subtle lens flares / bokeh-orbs in the background atmospheric haze
- Pollen-like floating particles tinted to time-of-day color cast
- Heart-shaped bubbles / floating-heart particles drifting between the creatures (5-10 visible)
- Glow-halo around the cuddling-pair (cute aura visible)

If the render doesn't have AT LEAST 6 of these effects visible, the cute-amplification FAILED. Stack obsessively. Cuteness is the canvas — sparkles are the layered paint.

━━━ CUTE + CUDDLY + COZY (NON-NEGOTIABLE) ━━━

Every render must produce: AWWW + instant smile + "I want to hug them both" instinct. If the render has even a whisper of dark / edgy / predator-prey / shark-with-teeth — it FAILED. The reaction is wholesome aquatic-pair-bliss. Lighting + weather + phenomenon match the SCENE naturally — underwater darkness reads as cozy bioluminescent magic, not scary deep-sea.

━━━ RENDERED CGI — NEVER PHOTOREAL, NEVER DOCUMENTARY ━━━

Never photoreal. NEVER documentary-wildlife. Never flat illustration. Render as polished 3D CGI in the designer-collectible / Pop-Mart-vinyl register: glossy materials with subsurface scattering, ultra-clean form language with crisp surface definition, dewy highlights. Creatures render with chibi proportions — oversized head, massive glassy reflective multi-catchlight eyes, tiny stubby flippers/paws, round chubby bodies, blushing cheeks, soft fluffy or jelly-soft textures, picture-book clarity. Water has caustic light-play, dreamy bubble-trails, sparkle particles. Coral / kelp / anemones / ice render glossy-crisp + bright-saturated, never murky-documentary. Let the MEDIUM tag control the specific render style.

━━━ NO DARK / NO INTENSE / NO PREDATOR-PREY ━━━

Absolutely no menace, no sharks-with-teeth, no orcas-hunting, no chase-scenes, no documentary-ocean-realism, no scary-deep, no eerie-glow. Safe + wholesome + pair-bond-bliss. Tone is kind and gentle. Lighting follows the time-of-day axis honestly — sunlit-surface = bright-aqua-glow, deep = cozy-bioluminescent-magical, dawn-pond = pink-pearl, moonlit-surface = silver-blue, golden-hour = peach-amber through the water. DO NOT force everything to "warm sunlit" — variety is the goal.

━━━ NO HUMANS ━━━

No human figures, no faces, no hands. All subjects are aquatic creatures (real-exaggerated or fantasy-cute). If a setting would normally include a diver / swimmer / sailor, reimagine it without — the creatures own the underwater world entirely.

━━━ IMPOSSIBLE BEAUTY ━━━

Wall-poster quality. NOT dramatic-beautiful (that's GlowBot) — CUTE-beautiful. Composition balanced and charming. Every element rendered with love — the kind of image a kid pins above their bed.

━━━ THE CUDDLY PAIR (both creatures ALWAYS present) ━━━

${creature_1}
${creature_2}

The TWO creatures should be visibly TOGETHER — not separated, not in different zones of the frame. Equal prominence, equal sharpness, both clearly readable. Different species/sizes OK; the cuteness comes from the pair bond.

━━━ THE CUDDLE INTERACTION (what they're doing TOGETHER right now) ━━━
${interaction}

━━━ THE AQUATIC HABITAT (the stage) ━━━
${setting}

━━━ TIME OF DAY (drives light + color cast — render honestly through the water) ━━━
${time_of_day}

━━━ WEATHER (affects surface scenes and water-clarity) ━━━
${weather}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL (drifting bubbles, plankton sparkles, caustics, ambient charm) ━━━
${atmosphere}

━━━ SURPRISE ELEMENT (second-tier detail the eye finds AFTER the pair) ━━━
${surprise_element}${phenomenonBlock}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ BLOW IT UP — AQUATIC CUTENESS AMPLIFICATION ━━━

Cuteness is the canvas, not the ceiling. Stack aquatic-cute-elements: jewel-iridescent rising bubble-trails + caustic light-play across creatures and habitat + glossy dewy surfaces with subsurface scattering + volumetric glow tinted to MATCH the time-of-day axis above (silvery-blue at moonlit, indigo-pink at blue hour, peach-amber through the water at golden hour, pearl-grey at dawn, cool-overcast in soft daylight, bioluminescent-aqua-magical in deep-sea — NOT forced warm-golden when the axis says otherwise) + plankton sparkles drifting + sun-shaft-caustic-dapples + layered atmospheric charm. For creatures, stack: massive dewy glassy eyes with multi-layer catchlights + jelly-soft / fluffy / soaked-soft textured surfaces + blushing cheeks + paws/flippers visibly INTERLOCKED or CONTACT-touching + relational body posture. For aquatic setting, stack environmental cuteness: dense coral/kelp/anemone detail in every corner, glowing sea-features, blooming aquatic flora, dappled water-light, postcard-pretty underwater composition. Obsessive detail in service of wholesome pair-bliss delight.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION (SETTING IS A CO-HERO + PAIR IS THE HEART) ━━━

The cuddling pair AND the aquatic habitat are equal co-heroes — NOT a tight close-up portrait of the pair with a generic-water backdrop. Pull the camera back so the viewer can SEE WHERE this is happening: tropical reef with coral towers, kelp cathedral with light-shafts, arctic ice-edge with submerged blue walls, mangrove-root tangle with sun-dapples, sunken pirate ship interior with treasure, lily-pad raft on a koi pond with cherry-blossom petals on the surface. The habitat is half the magic — frame it as such.

Wider establishing frame with the pair as focal point (40-50% of frame) and the AQUATIC HABITAT VISTA filling the rest (50-60% of frame). The two creatures clearly TOGETHER with visible contact / interaction — not separated. Viewer should name BOTH (1) what the two creatures are doing together AND (2) what kind of aquatic habitat they're in in one glance. Time-of-day color cast honest through the water. Surprise element tucked where the eye finds it second.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
  },



  CHIBIBOT_NIGHT_MEADOW: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature_1,
      creature_2,
      interaction,
      setting,
      time_of_night,
      prop,
      surprise_element,
      phenomenon,
      lighting,
      atmosphere,
      weather,
    } = slots;
    const phenomenonFires = Math.random() < 0.6;

    const propList = Array.isArray(prop) ? prop : [prop];
    const propBlock = propList.filter(Boolean).map((p, i) => `${i + 1}. ${p}`).join('\n');

    const phenomenonBlock = phenomenonFires
      ? `\n\n━━━ ENVIRONMENTAL PHENOMENON (stack this on top of everything else) ━━━\n${phenomenon}`
      : '';

    return `You are writing NIGHT-MEADOW scenes for ChibiBot — a PAIR of impossibly cute critters at twilight/night in a deliberately-chosen outdoor setting, under a specific time-of-night, with stacked cozy props${phenomenonFires ? ', and a magical celestial or atmospheric phenomenon transforming the frame' : ''}. Stargazing fox kits, fireflies in mason jars, glow-worm tea parties, comet-watching bunnies, moonlit picnics, owl + hedgehog under a starry blanket. Pixar/Sanrio/Ghibli/Beatrix-Potter-twilight aesthetic. The viewer's reaction: "OMG IT'S TOO CUTE. I CAN'T." Output wraps with style prefix + suffix.

━━━ HARD RULE: BOTH CREATURES VISIBLE — NEVER SOLO ━━━

This path renders a PAIR of creatures interacting. The final frame MUST show TWO distinct creatures, both visibly present with bodies and faces readable, both actively engaged in the story-beat together. NEVER render a solo creature. NEVER render one creature with the other reduced to a tiny silhouette. Both creatures get equal visual weight.

━━━ MOVIE POSTER MOMENT — every shot must be a frame-worthy still ━━━

This is NOT a quick snapshot. EVERY render must be poster-worthy — a single frame that someone would screenshot, save to their wallpaper folder, and stare at. The pair-bond night-time moment must be the EMOTIONAL CENTER of a composition you'd see in a Pixar / Studio Ghibli / Beatrix Potter twilight book illustration. Composition: deliberate rule-of-thirds or perfect centered symmetry. Light: dramatic and intentional (lantern-warm-pool against indigo sky, moon as deliberate light source, firefly-halo, rim-light on creature silhouettes). Color: cool indigo/violet sky + warm point-light (lantern/firefly) creating perfect color contrast. Depth: foreground anchor + midground heroes + atmospheric starry-far-distance. EVERY render makes the viewer go AWWW AND ALSO WOW.

━━━ STORY BEAT — every render tells a STORY, never a pose ━━━

CRITICAL: This is NOT a posed product shot of two figurines standing nose-to-nose. EVERY render must show a NARRATIVE EVENT — the viewer reads in 2 seconds what JUST happened or what's ABOUT TO happen. Think Lego Masters: every build "has to tell a story". Same bar here.

A scene WITH story (PASS):
- "Both creatures wide-eyed at a meteor streaking across the sky, paws raised mid-point"
- "One scrambling to catch a firefly that just escaped the jar, the other laughing"
- "Just opened a storybook on the grass, both eyes huge at what's on the page"
- "Mid-toast with thimble teacups, eyes squeezed shut in 'cheers'"
- "One comforting the other after the rain just stopped, paw on its shoulder"
- "Discovering the mushroom-house door is unlocked, peering inside with cautious excitement"
- "Mid-handoff of a wrapped present, recipient's eyes lighting up"

A scene WITHOUT story (FAIL — DO NOT render this):
- "Two creatures standing nose-to-nose smiling"
- "Sitting close together looking at each other"
- "Pressed cheek-to-cheek with closed eyes"
- "Both standing side-by-side facing the camera"
- "Holding paws and posing"

Indicators of story:
- Active VERBS happening (catching / discovering / pointing / scrambling / hugging-because / sharing-mid-bite / startled-by / reaching-for)
- Implied PREVIOUS or NEXT moment (something just happened OR is about to)
- Body language showing REACTION (wide eyes, open mouth, raised paw, leaning-in, recoiling-with-surprise, mid-laugh, mid-yawn)
- An EVENT or OBJECT they're responding to (a meteor, a present, an open book, an escaped firefly, a tipping lantern, a found-treasure)

The interaction axis already named the story beat. Render that as a MOMENT, not a pose. The viewer should be able to ask "what's happening here?" and answer in one sentence within 2 seconds.

━━━ SPARKLE STACK — MAXIMUM ADORABLE NIGHT-TIME EFFECTS ━━━

Layer ALL of these atmospheric effects on EVERY render (not optional — stack them ALL):
- Visible stars across the sky (hundreds of pinpoints, Milky Way band if applicable)
- Drifting fireflies / glow-worms (clustered groups + lone wanderers across the frame)
- Warm-glow halo around lanterns / jars / candles (visible volumetric warmth)
- Sparkle / star-burst flares around BOTH creatures' eyes (multi-catchlight twinkle)
- Dewdrop / water-pearl highlights on grass / leaves / flowers
- Subtle bokeh-orbs in the background atmospheric haze
- Pollen / dust / dandelion-seed particles drifting tinted to time-of-night cast
- Aurora wisps OR moonbeam shafts OR meteor streaks (one of these in the sky)
- Heart-shaped glow-orbs / floating wishing-pearls between the creatures (3-5 visible)
- Glowing-flower clusters / phosphorescent moss patches in the scene
- Glow-halo around the cuddling pair (cute aura visible)
- Reflective dew on every blade of grass catching star-light

If the render doesn't have AT LEAST 6 of these effects visible, the cute-amplification FAILED. Stack obsessively. Cuteness is the canvas — sparkles are the layered paint.

━━━ CUTE + CUDDLY + COZY (NON-NEGOTIABLE) ━━━

Every render must produce: AWWW + instant smile + "I want to hug them both" instinct. If the render has even a whisper of dark / edgy / scary / haunted-forest — it FAILED. Night is COZY here, never scary. Lighting + weather + phenomenon should match the SCENE naturally — moonlit darkness reads as silver-magical, not menacing.

━━━ RENDERED CGI — NEVER PHOTOREAL, NEVER PAINTED ━━━

Never photoreal. NEVER documentary-nature. Never flat illustration. Render as polished 3D CGI in the designer-collectible / Pop-Mart-vinyl register: glossy materials with subsurface scattering, ultra-clean form language with crisp surface definition, dewy highlights. Creatures render with chibi proportions — oversized head, massive glassy reflective multi-catchlight eyes catching star-glow, tiny stubby paws, round chubby bodies, blushing cheeks lit warm by lantern/firefly point-light, fluffy soft textures. Setting + props + sky render with the SAME glossy crisp CGI register. Stars are crisp pinpoints (not blurry smudges). Fireflies are jewel-bright glowing orbs.

━━━ NO HUMANS (except the CHILD-tagged unified pool entries) ━━━

The creature pool may include chibi human children (CHILD-tagged) — kawaii kids with diverse cultures. When children are picked, render them at chibi proportions matching the other creatures (oversized head, big dewy eyes, blushing cheeks). NEVER render adult humans, NEVER render realistic-proportioned humans. Children render as kawaii-chibi-kids.

━━━ THE CUDDLY PAIR (both creatures ALWAYS present) ━━━

${creature_1}
${creature_2}

The TWO creatures should be visibly TOGETHER — equal prominence, equal sharpness, both clearly readable. Different species/sizes OK; the cuteness comes from the pair bond.

━━━ THE TWILIGHT INTERACTION (what they're doing TOGETHER right now) ━━━
${interaction}

━━━ THE OUTDOOR NIGHT SETTING (the stage) ━━━
${setting}

━━━ TIME OF NIGHT (drives sky color, moon phase, ambient luminance — render honestly) ━━━
${time_of_night}

━━━ STACKED COZY PROPS (TWO specific objects in the scene) ━━━
${propBlock}

━━━ WEATHER (clear night unless otherwise specified) ━━━
${weather}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL (drifting fireflies, dewdrops, pollen-particles, ambient charm) ━━━
${atmosphere}

━━━ SURPRISE ELEMENT (second-tier detail the eye finds AFTER the pair) ━━━
${surprise_element}${phenomenonBlock}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ IMPOSSIBLE BEAUTY ━━━

Wall-poster quality. NOT dramatic-beautiful (that's GlowBot) — CUTE-beautiful. Composition balanced and charming. Every element rendered with love — the kind of image a kid pins above their bed and looks at every night before sleep.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION (SETTING + SKY ARE CO-HEROES WITH THE PAIR) ━━━

The pair-bond is the emotional center, but the SKY (stars / moon / aurora / Milky Way) and the SETTING (meadow / glade / cliff / etc.) are equal co-heroes. Pull the camera back to show all three layers: foreground creatures with their cozy props, midground setting (meadow grass / mushroom-cluster / cliff-edge), background sky filling the upper half of the frame with full star-density + moon + phenomenon if firing. Mid-wide or wide establishing frame. Both creatures clearly in contact/interaction. Two props visible without crowding. The SKY-as-co-hero is what makes this a night-meadow scene, not a meadow scene — frame it that way.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
  },



  CHIBIBOT_COZY_LANDSCAPE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature,
      resident_activity,
      world,
      world_detail,
      time_of_day,
      surprise_element,
      phenomenon,
      lighting,
      atmosphere,
      weather,
    } = slots;
    const phenomenonFires = Math.random() < 0.6;

    const detailList = Array.isArray(world_detail) ? world_detail : [world_detail];
    const detailBlock = detailList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');

    const phenomenonBlock = phenomenonFires
      ? `\n\n━━━ ENVIRONMENTAL PHENOMENON (stack this on top of everything else) ━━━\n${phenomenon}`
      : '';

    return `You are writing COZY-LANDSCAPE scenes for ChibiBot — a foreground CREATURE doing a story-driven activity with a cozy storybook world spanning behind them. Pixar / Studio Ghibli / Beatrix Potter painterly storybook aesthetic. Like the iconic "Ratatouille kitchen wide-shot" or "Up balloon-house morning" or "Studio Ghibli Kiki cottage" framings — a clear hero creature in the foreground, the rich world spanning behind. The viewer's reaction: "look at this little creature in this beautiful world — I want to live here." Output wraps with style prefix + suffix.

━━━ MANDATORY OUTPUT STRUCTURE — OPEN WITH THE CREATURE ━━━

The output MUST open with the creature + activity description (the hero in the foreground), THEN describe the world spanning behind them. NOT world-first. NOT atmospheric-detail-first. CREATURE-FIRST.

Open the output exactly like these examples:
- "A yellow chibi chick walking a sunflower-bordered cobblestone path with a tiny parcel under one arm, behind them a windmill village..."
- "A small red ladybug-chibi pulling a wooden cart across a wooden bridge over a canal, cottages clustered behind..."
- "A chibi mouse stirring a stew pot beside a treehouse cottage path, hanging lanterns and steam curling up behind..."

This ordering is NON-NEGOTIABLE. Open with the creature. Then unfold the world behind.

━━━ THE CREATURE (open the output describing THIS — foreground anchor, the hero) ━━━
${creature}

━━━ THE CREATURE'S STORY ACTIVITY (what they're doing in the foreground) ━━━
${resident_activity}

━━━ THE COZY STORYBOOK WORLD (spans BEHIND the creature — the second-tier layer) ━━━
${world}

━━━ THREE WORLD DETAILS (populate the world behind the creature with lived-in richness) ━━━
${detailBlock}

━━━ MOVIE POSTER MOMENT — every shot must be a frame-worthy still ━━━

This is NOT a quick snapshot. EVERY render must be poster-worthy — a single frame that someone would save as wallpaper. The creature + world must compose into the EMOTIONAL CENTER of a composition you'd see in a Pixar / Studio Ghibli / Beatrix Potter / Up-opening-sequence movie poster. Light: dramatic and intentional. Color: saturated cozy palette. Depth: creature in foreground + midground world + atmospheric far-distance.

━━━ STORY BEAT — the creature's activity tells a STORY, never a pose ━━━

The creature is mid-action, doing something specific — carrying a parcel, pulling a cart, watering flowers, hanging laundry, kneading dough, reading a letter, mid-leap, mid-skip, mid-handoff. NEVER posing nose-to-camera. NEVER staring blankly. The story-beat is what makes the render alive.

━━━ SPARKLE STACK — MAXIMUM COZY-WORLD AMBIENT EFFECTS ━━━

Layer ALL of these atmospheric effects on EVERY render: golden god-rays cutting through atmosphere, warm window-glow from cottages, drifting motes/pollen/dust tinted to time-of-day, sparkle/dewdrop highlights on flora/cobblestone, subtle bokeh-orbs in the background haze, chimney smoke / steam wisps, floating petals / leaves / dandelion-seeds, reflections on water/wet stone/glass, layered atmospheric depth, tiny glowing details everywhere (lit windows, lanterns, fairy-lights), dew on every blade of grass, light leaks / lens flares. If the render doesn't have AT LEAST 6 effects visible, the cozy-amplification FAILED.

━━━ CUTE + CUDDLY + COZY (NON-NEGOTIABLE) ━━━

Every render must produce "I want to live here" longing + warm-belly contentment + wholesome safety. If the render has even a whisper of dark / edgy / abandoned / haunted — it FAILED. The world is INVITING, the creature is ADORABLE, everything rendered with love.

━━━ RENDERED CGI — Pixar storybook painterly register ━━━

Polished 3D CGI in the modern Pixar / Disney / DreamWorks animated-feature register. Soft subsurface scattering, painterly bokeh, warm volumetric god-rays, jewel-bright saturation. Creatures with chibi proportions (oversized head, big dewy eyes, tiny stubby body). Architecture stylized cute. Trees and flora glossy-crisp + saturated.

━━━ NO DARK / NO ABANDONED / NO ADULT HUMANS ━━━

No menace, no decrepit, no creepy. Children OK from the unified pool — render at chibi proportions.

━━━ TIME OF DAY (drives sky color + ambient light) ━━━
${time_of_day}

━━━ WEATHER ━━━
${weather}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SURPRISE ELEMENT (second-tier detail in the wider world) ━━━
${surprise_element}${phenomenonBlock}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION (creature foreground anchor + world behind) ━━━

WIDE or MID-WIDE establishing frame. The creature is the foreground anchor (the eye lands there first), midground holds the cozy storybook world, background is atmospheric depth. The creature occupies 15-30% of the frame at chibi-foreground scale — big enough to read every cute detail, not so big that the world disappears. The world spans behind, populated by the three details + the time-of-day light + the weather + the surprise element. The viewer first sees the creature, then their eye travels to the world to discover its richness.

━━━ OUTPUT FORMAT (MANDATORY) ━━━

Open the output with: "[creature description] [activity verb-phrase], [world that spans behind]..."

Then unfold the rest. Output ONLY the raw 90-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, opening immediately with the creature.`;
  },




  CHIBIBOT_RAINY_INTERIOR: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature_group,
      group_activity,
      setting,
      setting_detail,
      time_of_day,
      surprise_element,
      phenomenon,
      lighting,
      atmosphere,
      weather,
    } = slots;
    const phenomenonFires = Math.random() < 0.6;
    const detailList = Array.isArray(setting_detail) ? setting_detail : [setting_detail];
    const detailBlock = detailList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');
    const creatureList = Array.isArray(creature_group) ? creature_group : [creature_group];
    const creatureBlock = creatureList.filter(Boolean).map((c, i) => `Friend ${i + 1}: ${c}`).join('\n\n');
    const phenomenonBlock = phenomenonFires
      ? `\n\n━━━ ENVIRONMENTAL PHENOMENON (stack on top of everything else) ━━━\n${phenomenon}`
      : '';

    return `You are writing GROUP-OF-FRIENDS rainy-day scenes for ChibiBot — 2-4 adorable chibi friends playing TOGETHER outside in the rain. Splashing each other, sharing umbrellas, mud-fights, running side-by-side, building stick-dams in puddles, sliding through mud in a chain. Calvin-and-Hobbes-with-friends / Studio-Ghibli-kids-in-the-rain / Beatrix-Potter-group-romp aesthetic. The viewer's reaction: "I want to be playing in the rain with my friends right now!" Output wraps with style prefix + suffix.

━━━ HARD RULE: MULTIPLE FRIENDS PLAYING TOGETHER — NEVER SOLO ━━━

The frame contains 2-4 CHIBI FRIENDS playing TOGETHER in the rain. ALL friends are visibly present, interacting with each other (splashing each other, holding hands, sharing umbrella, in a pile, in a chain). NEVER a single solo creature staring at the camera. NEVER lined up posing. The group is MID-INTERACTION, doing something together.

━━━ MANDATORY: CAPTURED MID-MOMENT — NEVER HEAD-ON PORTRAIT ━━━

This is a CANDID PHOTOGRAPH caught a fraction of a second into the action. Camera angle: THREE-QUARTER from the side, OVER-THE-SHOULDER, LOW-ANGLE-LOOKING-UP, DUTCH-TILT, ACTION-SIDE-PROFILE. NEVER head-on portrait framing. NEVER creatures lined up facing the camera. The friends are interacting with EACH OTHER and the rain, not the viewer.

━━━ MANDATORY: CHARACTERS ARE OUTSIDE IN THE RAIN ━━━

The friends are OUTDOORS in the rain — not sheltered indoors. NO indoor scenes. NO window framings. NO sheltered-from-rain. They're IN it together, having fun.

━━━ MANDATORY: RAIN IS HEAVY AND DOMINANT IN THE FRAME ━━━

The RAIN itself is a co-hero of the composition. NOT light decorative streaks. NOT subtle atmospheric hint. Render the rain as VISIBLY HEAVY across the entire frame:
- Thick silver streaks of rain visible everywhere (diagonal, dense, in-frame)
- Steady downpour sheeting visible against any dark background
- Rain bouncing off every wet surface in visible splash-pops
- Puddles VISIBLY rippling from constant raindrops hitting
- Friends' fur/hair clumping wet, water beading and dripping from whiskers/noses/ears
- Atmospheric haze from rain density creating a "you can SEE the rain" effect
- Wet light scatter — every surface has glossy wet sheen
- Soaked clothing/raincoats with visible water-drips streaming off
- Big drops in foreground (motion-blurred or slow-mo) to anchor depth
- Sheets of rain sweeping across the background visible as silver curtains

Think Pixar "Up" rain sequences / Studio Ghibli "Totoro" bus-stop rain / Spirited-Away river-spirit rain — DRAMATIC, VISIBLE, DENSE rain. The viewer should immediately see "this is heavy rain", not "this is a drizzle".

━━━ THE GROUP OF FRIENDS (THREE chibi friends, all present) ━━━

${creatureBlock}

━━━ THE GROUP ACTIVITY (what they're doing TOGETHER right now) ━━━
${group_activity}

━━━ THE OUTDOOR RAINY SETTING (the wet stage) ━━━
${setting}

━━━ THREE RAINY-SETTING DETAILS (populate the scene with wet lived-in richness) ━━━
${detailBlock}

━━━ MOVIE POSTER MOMENT — every render must be a frame-worthy still ━━━

Poster-worthy single frame caught mid-action. Pixar / Studio Ghibli group-romp framings. The friends mid-shared-fun are the EMOTIONAL CENTER. Composition: three-quarter or over-shoulder, NEVER head-on. The friends are interacting with each other, not the camera. Saturated cozy palette. Warm rim-light on creatures contrasted with cool blue-grey rain ambient.

━━━ STORY BEAT — every render tells a STORY, never a pose ━━━

The friends are MID-ACTION — splashing each other, mid-mud-throw, mid-chain-slide, mid-pile-on, mid-laugh, mid-umbrella-handoff. NEVER posing facing camera. NEVER static. The story-beat is what makes it alive.

━━━ SPARKLE STACK — MAXIMUM WET-COZY GROUP EFFECTS ━━━

Layer ALL of these on EVERY render:
- Visible rain falling (silver streaks, droplets in motion blur, slow-motion fat raindrops)
- Wet surfaces gleaming with reflection (cobblestones, leaves, fur, raincoats)
- Splash effects between friends (water crowns, mud-splatter exchanges, droplet halos)
- Multiple puddles with concentric ripples and reflections
- Drips falling from umbrellas, eaves, leaves
- Wet group dynamics — friends' fur/clothing soaked in motion
- Atmospheric mist or fog drifting in low layers
- Wet bokeh (warm-amber reflection orbs in puddles, cool-grey haze in distance)
- Wet flora details (rain beading on petals, drooping leaves, glistening grass)
- Cool blue-grey ambient light from overcast sky
- Warm rim-light or pop-of-color from creatures' umbrellas / raincoats / boots
- Action-evidence frozen mid-flight (water arcs, mud sprays, hair whipped sideways)

━━━ CUTE + CUDDLY + COZY (NON-NEGOTIABLE) ━━━

Every render must produce JOY at friends sharing rainy fun. ALL the friends are HAPPY, having a delightful time TOGETHER. NEVER shivering, miserable, scared, fighting-with-malice, sad. Wholesome wet-cottagecore-friendship-joy.

━━━ RENDERED CGI — Pixar painterly storybook register ━━━

Polished 3D CGI in the modern Pixar / Disney / DreamWorks / Studio Ghibli-translated-to-CGI register. Painterly subsurface scattering, soft volumetric god-rays through rain, painterly bokeh, jewel-bright cozy saturation. Creatures with chibi proportions, big dewy eyes, blushed cheeks. Friends visibly DIFFERENT species/sizes for variety.

━━━ NO DARK / NO STORM-DAMAGE / NO ADULT HUMANS ━━━

No menace, no flooding-disaster, no creature-in-distress. Children OK from unified pool — render at chibi proportions, also IN the rain having group fun.

━━━ TIME OF DAY (drives ambient light through rain) ━━━
${time_of_day}

━━━ WEATHER (rain is the baseline — this axis adds nuance) ━━━
${weather}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SURPRISE ELEMENT (second-tier detail) ━━━
${surprise_element}${phenomenonBlock}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION (group mid-fun in rain) ━━━

THREE-QUARTER or OVER-SHOULDER angle. NEVER head-on. The friends are visibly INTERACTING with each other — touching, splashing, holding hands, pile-on, side-by-side. They are NOT lined up facing the viewer. Three-act depth: FOREGROUND friends mid-group-action, MIDGROUND wet rainy setting, BACKGROUND atmospheric rain/mist. Rain visibly falling everywhere.

━━━ OUTPUT FORMAT (MANDATORY) ━━━

Open with EXACTLY this structure: "[Group structure phrase like 'Three chibi friends' or 'A pair and a third'] [shared activity verb-phrase IN the rain], at/on/in [outdoor setting], rain visibly streaking/sheeting/pattering..."

Then unfold the rest. Output ONLY the raw 90-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, opening immediately with the group of friends.`;
  },


  CHIBIBOT_RAINY_DAY_COZY: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature_group,
      huddle_activity,
      shelter,
      detail,
      time_of_day,
      surprise_element,
      phenomenon,
      lighting,
      atmosphere,
      weather,
    } = slots;
    const phenomenonFires = Math.random() < 0.6;
    const detailList = Array.isArray(detail) ? detail : [detail];
    const detailBlock = detailList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');
    const creatureList = Array.isArray(creature_group) ? creature_group : [creature_group];
    const creatureBlock = creatureList.filter(Boolean).map((c, i) => `Friend ${i + 1}: ${c}`).join('\n\n');
    const phenomenonBlock = phenomenonFires
      ? `\n\n━━━ ENVIRONMENTAL PHENOMENON (stack on top of everything else) ━━━\n${phenomenon}`
      : '';

    return `You are writing GROUP-COZY-SHELTER scenes for ChibiBot rainy-day-cozy — 2-4 adorable chibi friends huddled TOGETHER in a cozy outdoor shelter (mushroom cap / porch / under umbrella / hollow log / stone arch) while RAIN visibly falls around them. Sharing cocoa, wrapped in blankets, piled together, sleepy nap-pile, mid-story-laugh. Studio Ghibli "Totoro bus-stop" / Calvin-Hobbes-under-porch / Charlie-Brown-Snoopy-huddle aesthetic. The viewer's reaction: "I want to be huddled in that shelter with my friends right now!" Output wraps with style prefix + suffix.

━━━ HARD RULE: MULTIPLE FRIENDS HUDDLED TOGETHER — NEVER SOLO ━━━

2-4 chibi friends visibly together IN the cozy shelter, INTERACTING (touching, sharing cocoa, wrapped in shared blanket, pile-on, heads stacked sleeping). NEVER solo. NEVER lined up posing facing camera.

━━━ MANDATORY: CAPTURED COZY-INTIMATE MOMENT — NEVER HEAD-ON PORTRAIT ━━━

Camera angle: THREE-QUARTER from the side / OVER-SHOULDER / SIDE-PROFILE / DUTCH-TILT. NEVER head-on. The friends are interacting with EACH OTHER, not the camera.

━━━ MANDATORY: SHELTERED FROM RAIN — RAIN VISIBLE AROUND SHELTER ━━━

The friends are inside an OUTDOOR SHELTER (mushroom cap, porch, under umbrella, hollow log, stone arch). They stay dry inside; the RAIN visibly falls AROUND the shelter — silver streaks beyond the shelter edge, water dripping from the shelter's roof/eaves/umbrella-tip, wet world beyond. The CONTRAST is the magic: warm-amber inside shelter vs cool-blue-grey wet beyond.

━━━ THE GROUP OF FRIENDS (THREE chibi friends, all present) ━━━

${creatureBlock}

━━━ THE COZY-HUDDLE ACTIVITY (what they're doing TOGETHER in the shelter) ━━━
${huddle_activity}

━━━ THE COZY SHELTER (the warm pocket in the rainy world) ━━━
${shelter}

━━━ THREE COZY-SHELTER DETAILS (props that make the shelter feel lived-in) ━━━
${detailBlock}

━━━ MOVIE POSTER MOMENT — every render must be a frame-worthy still ━━━

Single frame caught mid-cozy-moment. Pixar / Studio Ghibli "Totoro" framing. Friends mid-shared-warmth are the EMOTIONAL CENTER. Three-quarter or over-shoulder. Warm-glow shelter contrasted with cool-blue-grey rain world beyond.

━━━ STORY BEAT — every render tells a STORY, never a pose ━━━

Friends are MID-COZY-MOMENT — sipping cocoa together, mid-laugh, mid-yawn, mid-blanket-wrap, mid-story, mid-bite of shared biscuit. NEVER posing facing camera. NEVER static.

━━━ SPARKLE STACK — MAXIMUM COZY-SHELTER + RAIN-AROUND EFFECTS ━━━

Layer ALL on EVERY render:
- WARM amber/honey glow from inside the shelter (lantern / candles / window-glow if porch / mug-steam catching warm light)
- Cool blue-grey rain falling visibly AROUND the shelter (not inside it)
- Visible rain streaks beyond the shelter edge
- Water dripping from the shelter's roof/eaves/umbrella-edge in streams
- Puddles beyond the shelter rippling from rain
- Steam from cocoa/teapots/mugs visibly curling up inside
- Soft warm bokeh inside the shelter
- Cool blue-grey haze outside the shelter (rain density visible)
- Wet surfaces gleaming with reflection (just outside the shelter)
- Reflections of warm shelter-glow in puddles outside
- Drips from umbrella forming tiny ripples in puddle below
- Atmospheric depth — foreground friends in shelter, midground shelter edge, background rainy world

━━━ CUTE + CUDDLY + COZY (NON-NEGOTIABLE) ━━━

Friends are HAPPY, intimate, warm, content. Wholesome rainy-day-friendship. NEVER shivering, sad, scared.

━━━ RENDERED CGI — Pixar painterly storybook ━━━

Modern Pixar / Disney / DreamWorks register. Painterly subsurface scattering, warm volumetric god-rays from shelter lights, painterly bokeh. Chibi proportions. Friends visibly DIFFERENT species/sizes for variety.

━━━ NO ADULT HUMANS (children OK from unified pool) ━━━

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ WEATHER ━━━
${weather}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SURPRISE ELEMENT ━━━
${surprise_element}${phenomenonBlock}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION (friends inside shelter + rain visible around) ━━━

THREE-QUARTER or OVER-SHOULDER angle. Friends in foreground/midground INSIDE the shelter (warm amber light pooling on them, body-language of cozy intimacy). Shelter edge visible (umbrella rim / porch eaves / mushroom cap / log opening). Rainy outdoor world VISIBLE beyond (rain streaks, wet ground, puddles, dim blue-grey). The contrast frame: WARM INSIDE vs COOL OUTSIDE.

━━━ OUTPUT FORMAT (MANDATORY) ━━━

Open with: "[Group structure like 'Three chibi friends' or 'A pair and a third'] [cozy-huddle verb-phrase IN the shelter], inside [shelter setting], rain visibly falling around them..."

Then unfold the rest. Output ONLY the raw 90-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, opening immediately with the friends in the shelter.`;
  },


  CHIBIBOT_SLEEPY_NAPTIME: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature,
      sleep_pose,
      nap_spot,
      detail,
      time_of_day,
      surprise_element,
      phenomenon,
      lighting,
      atmosphere,
      weather,
    } = slots;
    const phenomenonFires = Math.random() < 0.6;
    const detailList = Array.isArray(detail) ? detail : [detail];
    const detailBlock = detailList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');
    const phenomenonBlock = phenomenonFires
      ? `\n\n━━━ ENVIRONMENTAL PHENOMENON (gentle event drifting around the sleeper) ━━━\n${phenomenon}`
      : '';

    return `You are writing SLEEPY-NAPTIME scenes for ChibiBot — ONE adorable chibi creature dozing in an impossibly cozy nap-spot. Peak-cute peaceful sleeping moment. The viewer's reaction: "shhh don't wake it." Pixar / Studio Ghibli / Beatrix-Potter / sleeping-puppy-stockphoto-cute aesthetic. Output wraps with style prefix + suffix.

━━━ MANDATORY: SOLO SLEEPING CREATURE — ONE CREATURE ONLY ━━━

ONE creature only. This is a SOLO sleepy path. The creature is the focal hero — mid-close framing showing the cute sleeping pose. NOT a group. NOT a pair. NEVER multiple creatures in the same nap-spot (though tiny background creature surprise-elements are fine, in their own separate nap-spot).

━━━ MANDATORY: THE CREATURE IS ASLEEP / DOZING ━━━

The creature is ACTIVELY ASLEEP — eyes closed or half-lidded, body relaxed, in the sleeping pose specified. NOT awake. NOT looking at camera. NOT alert. The pose is captured mid-sleep — a moment of peaceful drowsing. Dream-detail optional (Zzz, dream-bubbles, paw-twitches).

━━━ MANDATORY: NEVER HEAD-ON PORTRAIT — INTIMATE SLEEPING ANGLES ━━━

Camera angle: SIDE-PROFILE / OVER-THE-SHOULDER PEEK / TOP-DOWN LOOKING-DOWN-AT-SLEEPER / THREE-QUARTER from above. NEVER head-on portrait. The viewer is GENTLY OBSERVING a sleeping creature, not being stared at.

━━━ THE SLEEPING CREATURE ━━━
${creature}

━━━ THE SLEEPING POSE (captured mid-nap) ━━━
${sleep_pose}

━━━ THE IMPOSSIBLY COZY NAP-SPOT ━━━
${nap_spot}

━━━ THREE COZY-PERSONAL-ACCENTS — the sleeper's favorite things arranged around them (ALL THREE MUST BE VISIBLE in the frame) ━━━

These are the sleeper's personal touches — favorite stuffed animal, colorful patterned blanket, candle in a jar, open storybook, sleeping pet companion, slippers tucked nearby. ALL THREE must be RENDERED VISIBLY in the frame, not just hinted. They make the scene feel FULL and personal.

${detailBlock}

━━━ MOVIE POSTER MOMENT — every render must be a frame-worthy still ━━━

Single frame of peak-cute sleeping. Pixar / Beatrix-Potter / Studio-Ghibli sleeping-creature framings. The sleeping pose + cozy nap-spot are the EMOTIONAL CENTER. Light: warm drowsy honey-amber light pooling on the sleeper. Color: saturated cozy palette (warm amber + soft pink + sage green + cream). Depth: foreground sleep-details + midground sleeper + background soft-blur dreamy bokeh.

━━━ STORY BEAT — the SLEEPING is the story ━━━

Sleep IS the story moment. The pose is mid-dream. Implied: just fell asleep, dreaming of something cute, peaceful breathing rhythm visible in the body's slow rise-fall. The viewer can almost hear the soft snore.

━━━ SPARKLE STACK — MAXIMUM COZY-DROWSY EFFECTS ━━━

Layer ALL on EVERY render:
- WARM drowsy amber light pooling on the sleeper
- Soft dust-motes drifting through warm light beams
- Dream-bubble / Zzz / dream-particle (one floating above the sleeper if drowsing)
- Soft fluff visible (fur, feathers, fluffy texture)
- Cozy blanket-detail (pull, drape, knit-detail)
- Soft pillow indentation where the sleeper's head rests
- Tiny breath-visible-as-soft-wisp if cold
- Soft bokeh background (heavy depth-of-field)
- Tiny glowing accents (firefly, lantern-glow, candle)
- Warm color tinting (golden-hour or candle-amber pooling everywhere)
- Subtle reflection in a polished surface
- One signature dream-detail (drool-spot, paw-twitch, ear-flick, smile-in-sleep)

━━━ CUTE + CUDDLY + COZY (NON-NEGOTIABLE) ━━━

Maximum cute = peaceful sleeping animal. The viewer melts. NEVER scary / sad / nightmare / shivering.

━━━ RENDERED CGI — Pixar painterly storybook ━━━

Modern Pixar register. Painterly subsurface scattering, warm drowsy god-rays, painterly bokeh, jewel-bright cozy saturation. Chibi proportions. Closed/half-lidded eyes (NEVER big bright open eyes — this is SLEEPING).

━━━ NO ADULT HUMANS (children OK from unified pool) ━━━

Children render asleep at chibi proportions, also in the cozy nap-spot.

━━━ TIME OF DAY (drowsy / golden / candlelit) ━━━
${time_of_day}

━━━ WEATHER ━━━
${weather}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SURPRISE ELEMENT (gentle detail that doesn't wake the sleeper) ━━━
${surprise_element}${phenomenonBlock}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION (mid-close on sleeping creature in cozy nap-spot) ━━━

MID-CLOSE framing with the SLEEPING CREATURE filling 40-60% of the frame. The cozy nap-spot wraps around them (vessel/bed/pillow visible). Camera angle: side-profile / over-the-shoulder peek / top-down / three-quarter from above — NEVER head-on. Warm drowsy light pools on the sleeper. Soft-blur background. Three nap-details visible (blanket / pillow / dream-bubble / nightlight). Surprise element tucked elsewhere.

━━━ OUTPUT FORMAT (MANDATORY) ━━━

Open with: "[creature description] [sleep-pose verb-phrase], curled inside/on [nap-spot], [drowsy lighting]..."

Then unfold the rest. Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, opening immediately with the sleeping creature.`;
  },


  CHIBIBOT_COZY_INTERIOR: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature,
      resident_activity,
      room,
      room_detail,
      time_of_day,
      surprise_element,
      phenomenon,
      lighting,
      atmosphere,
      weather,
    } = slots;
    const phenomenonFires = Math.random() < 0.6;
    const detailList = Array.isArray(room_detail) ? room_detail : [room_detail];
    const detailBlock = detailList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');
    const phenomenonBlock = phenomenonFires
      ? `\n\n━━━ ENVIRONMENTAL PHENOMENON (stack on top of everything else) ━━━\n${phenomenon}`
      : '';

    return `You are writing COZY-INTERIOR scenes for ChibiBot — an UNEXPECTED chibi-scale cozy interior (often INSIDE a real object — teacup, music-box, matchbox, piano) with a tiny creature doing a story-driven cozy activity. Pixar / Studio Ghibli / Howl-Moving-Castle / Beatrix-Potter painterly storybook aesthetic. The viewer's reaction: "WAIT — they live INSIDE a teacup?? And look at how cozy this room is!" Output wraps with style prefix + suffix.

━━━ ⚠ HARD RULE #1: WIDE-SHOT INTERIOR + CREATURE MUST BE VISIBLE ━━━

The cozy ROOM is the hero of every render's FRAMING — but the CREATURE MUST BE VISIBLE in the scene. NEVER an empty room.

ABSOLUTE FRAMING RULE:
- Room / architecture / furniture / details fill 75-85% of the frame
- The creature is 10-20% of the frame — small enough that the eye reads the cozy space first, BUT visible enough that the viewer immediately notices "OH THERE'S THE LITTLE GUY" — they are unambiguously present
- Camera is PULLED BACK — wide-shot establishing — capturing the whole cozy room
- Reference: Studio Ghibli's Howl's-Moving-Castle wide-shot interiors / Beatrix Potter dollhouse cross-section views / Wes Anderson dollhouse-tableau framing / Arrietty's chibi-scale dollhouse interiors
- The creature is tucked in a SPECIFIC SPOT — in a corner armchair / on a window-seat / at a tiny table / in a bed-nook / on a quilt-pile — but always clearly visible
- NOT a centered portrait. NOT a creature-fills-frame close-up. NOT a chest-up shot. ALSO NOT an empty room.

⚠ HARD BAN — EMPTY-ROOM RENDERS. The creature MUST appear in the brief and MUST be described in the FIRST HALF of the output, doing their cozy activity, in a specific spot in the room. The output is FAILED if the room is described without the creature visibly present.

HARD BAN: creature occupying more than 25% of the frame. Hard ban on close-ups. Hard ban on portrait crops.

━━━ ⚠ HARD RULE #2: REAL-OBJECT-AS-HOME — THE OBJECT *IS* THE ARCHITECTURE ━━━

This is the SIGNATURE of this path. When the room is a REAL-OBJECT-AS-HOME, you are NOT writing a chibi-cottage decorated with a teacup motif. You ARE writing the INTERIOR of the object itself, viewed from INSIDE it.

The viewer is INSIDE the teacup / music-box / matchbox / piano / kettle / pumpkin / hatbox / lantern. The CURVED WALLS OF THE OBJECT ARE THE WALLS OF THE ROOM. There is no separate room around the object — THE OBJECT IS THE ROOM.

You MUST describe the object-as-architecture EXPLICITLY:
- TEACUP: the curved porcelain wall arcs around the whole room, the saucer is the floor with a saucer-rim lip, the giant teacup-handle arches overhead like an archway, the porcelain glaze reflects warm light, the rim is the ceiling-edge
- MUSIC-BOX: the velvet-lined curved walls of the music-box rise on all sides, the dancing-figurine is a giant bedpost looming over the bed, the winding-mechanism brass-gears are visible in the ceiling, the lid is the sky overhead
- MATCHBOX: matchstick rafters run across the ceiling, the cardboard side-walls have the matchbox label printed huge across them, the matchbox-rim is the doorframe, sulfur-strip floor at one end
- PIANO: piano-string-walls rise on every side, the giant felt-hammers are visible above, the polished-wood lid arches overhead like a vaulted ceiling, the brass-pedals are giant furniture
- POT / KETTLE: enamel-curved walls arc around, the spout is a window letting in light, the lid is the dome-ceiling, brass-handle is a wall-bracket
- PUMPKIN: orange-ribbed curved walls glow translucent, seeds dangle from the ceiling like chandeliers, the carved jack-o'-lantern face is the window, the stem is the chimney
- HATBOX: round cardboard walls rise on all sides, the round lid is the dome-ceiling above, the hatbox-label-pattern decorates the curved wall, ribbon-loops are wall-hooks
- BOOK: giant open pages are the floor + walls, the spine is the back-wall, words are painted huge across the walls, bookmark is a curtain
- LANTERN / LIGHTBULB: curved glass walls with brass-frame ribs, hot-warmth radiating from the floor, the bulb-top is the dome-ceiling
- ACORN: round wooden walls with grain visible, the acorn-cap is the dome-roof, stem is the chimney

The viewer should INSTANTLY recognize the object on first glance: "OH, the room is inside a TEACUP."

When the room is a PURPOSE-BUILT chibi-dwelling (mushroom-house / treehouse / hobbit-hole / chibi-cottage) — same wide-shot establishing rule applies. The architecture is the hero. The chibi-scale is sold by tiny-furniture proportions.

━━━ MANDATORY OUTPUT STRUCTURE — ROOM ESTABLISHED FIRST, CREATURE WOVEN IN EARLY ━━━

Because the ROOM is the hero of FRAMING, the brief LEADS with the room/setting (15-25 words) and THEN immediately introduces the visible creature doing their activity. The creature must be named + described + their cozy activity stated WITHIN THE FIRST 30 WORDS — never just a setting paragraph alone.

Structure: "[Wide-shot room description, 15-25 words] — and tucked [in a corner / on a window-seat / etc.] is [tiny creature], [cozy snuggle activity], [creature visual detail], [more room atmosphere]..."

⚠ The creature appears explicitly in the brief — not implied. If you mention "the resident" or "the homeowner" abstractly, you have failed. Name the creature, place them in a specific spot, describe what they're doing.

━━━ THE FOREGROUND CREATURE ━━━
${creature}

━━━ THE CREATURE'S COZY ACTIVITY ━━━
${resident_activity}

━━━ THE COZY ROOM ━━━
${room}

━━━ THREE ROOM DETAILS (populate the room with lived-in richness) ━━━
${detailBlock}

━━━ MOVIE POSTER MOMENT — every render must be a frame-worthy still ━━━

Pixar / Studio Ghibli / Howl's-Moving-Castle / Beatrix-Potter interior framings. Warm-amber pooling on surfaces. Layered atmospheric depth (foreground creature / midground furniture / background architectural depth).

━━━ STORY BEAT — every render tells a STORY ━━━

The creature is MID-ACTION — stirring, pouring, reading, painting, knitting, watering. NEVER posing. NEVER static.

━━━ SPARKLE STACK — MAXIMUM COZY-INTERIOR EFFECTS ━━━

Layer ALL on EVERY render:
- Warm-amber lamp/fireplace/candle glow pooling across surfaces
- Steam wisps from teapots/mugs/kettles
- Dust motes drifting in warm light beams
- Light spill across hardwood floors / rugs
- Soft bokeh-orbs from interior lights
- Reflections in polished surfaces (kettle / mirror / window-glass)
- Texture detail on knits / quilts / sheepskin / wood
- Plant-leaf shadows from windowsill flora
- Tiny glowing accents (fairy-lights / candle-flames / lantern-glow)
- Subtle dust on bookshelves / corners
- Warm color gradient (golden-amber center to slight blue-grey edges)
- Light leaks from sun-windows

━━━ CUTE + CUDDLY + COZY (NON-NEGOTIABLE) ━━━

"I want to live in this room" longing. Wholesome cottagecore.

━━━ RENDERED CGI — Pixar painterly storybook ━━━

Modern Pixar register. Painterly subsurface scattering, warm volumetric god-rays, painterly bokeh. Chibi proportions.

━━━ NO ADULT HUMANS (children OK from unified pool) ━━━

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ WEATHER (affects what's visible through windows) ━━━
${weather}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SURPRISE ELEMENT ━━━
${surprise_element}${phenomenonBlock}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION (WIDE INTERIOR ESTABLISHING — ENFORCE) ━━━

WIDE INTERIOR ESTABLISHING SHOT. Camera pulled WAY back to capture the entire cozy room. Room/architecture/furniture fills 80-90% of the frame. Creature is a TINY 5-15% anchor tucked somewhere — NOT centered, NOT a portrait, NOT a close-up. The eye reads ROOM FIRST then discovers the creature. Studio Ghibli wide-shot / Beatrix Potter dollhouse-cross-section / Arrietty chibi-scale interior. Three room-details visible across the space. Surprise element tucked elsewhere.

HARD BAN: portrait crops, chest-up framing, creature filling more than 20% of frame, centered close-ups. The room is the hero.

━━━ OUTPUT FORMAT (MANDATORY) ━━━

If the room is a REAL-OBJECT-AS-HOME, open with: "Wide-shot view from INSIDE a giant [object] — curved [object-material] walls arc around, [object-bottom] is the floor, [object-feature] overhead — and tucked [specific location] is [tiny creature] [cozy snuggle activity], warm-amber light pouring through [object-feature-as-window], [cottagecore details all around]..."

If the room is a PURPOSE-BUILT chibi-dwelling, open with: "Wide-shot interior of a chibi-scale [dwelling-type], and tucked [specific location] is [tiny creature] [cozy snuggle activity], warm-amber light, [cottagecore details around them]..."

Then unfold the rest of the room/details/sparkle-stack. Output ONLY the raw 90-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. The CREATURE must appear by word 30. NEVER an empty room.`;
  },


  CHIBIBOT_MINIATURE_FEAST: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      food_hero,
      scene_setting,
      creature_group,
      chibi_food_activity,
      food_decoration,
      kawaii_atmosphere,
      time_of_day,
      camera_angle,
      lighting,
      atmosphere,
      weather,
    } = slots;
    const creatureList = Array.isArray(creature_group) ? creature_group : [creature_group];
    const creatureBlock = creatureList.filter(Boolean).map((c, i) => `${i + 1}. ${c}`).join('\n');
    const decorList = Array.isArray(food_decoration) ? food_decoration : [food_decoration];
    const decorBlock = decorList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');
    const isGroup = creatureList.length >= 2 && Math.random() < 0.7;

    return `You are writing KAWAII POP-MART FEAST scenes for ChibiBot — adorable chibi creatures interacting with a SMILING-FACED kawaii food/drink in a heavily-decorated kawaii scene. Sister path to cute-food (which is food-only) — this path is CHIBIS + FOOD together. Output wraps with style prefix + suffix.

━━━ ⚠ HARD RULE #1: THE FOOD HAS A SMILING FACE ━━━

The hero food/drink centerpiece has a literal kawaii smiling face on it — dimpled-blush cheeks, closed-arc-eyes, tiny printed mouth. Boba cup, sundae, pancake-stack, mochi-tray, cake, taiyaki, cereal bowl — whatever the food hero, it's anthropomorphized with a sweet smiling face. This is the bex.ai Pop-Mart aesthetic non-negotiable.

━━━ ⚠ HARD RULE #2: TONS OF CHIBIS + TONS OF FOOD — CUTE-MAXX FEAST ━━━

This is a CUTE-MAXX FEAST scene with MANY chibis and an ABUNDANCE of kawaii food spread across the scene. NOT a tasteful minimalist composition — PACKED with cuteness wall-to-wall.

${isGroup ? `GROUP MODE — 3-4 chibi creatures (different species, different heights, all equally cute) gathered around the kawaii food hero. They are PLURAL — never a duo, always a friend-party. Each chibi mid-action, each adorable, each interacting with the food spread.` : `SOLO MODE — ONE adorable chibi creature with the kawaii food hero. Intimate one-on-one scene. Even in solo mode, the food spread is ABUNDANT — multiple kawaii treats arranged around the hero.`}

ALONGSIDE the food hero centerpiece, the scene includes an ABUNDANT spread of OTHER kawaii smiling-face foods — extra cupcakes, donuts, macarons, mini-tarts, fruit-with-faces, candies, treats — piled, stacked, scattered across the picnic blanket / camp-table / boat-deck / etc. The frame is FULL of treats. Think kawaii-pop-mart-feast-MAXIMIZED. Multiple smiling-face foods fill the space.

The food and the chibis BOTH read as adorable. The composition has chibis arranged AMONG the abundant food spread with treats EVERYWHERE — never an empty / sparse scene.

━━━ ⚠ HARD RULE #3: SETTING-AS-CO-HERO — OUTDOOR VARIETY ━━━

The scene_setting below is part of the hero composition — picnic, beach, camping, treehouse, garden, hot-air-balloon, boat, mountain. The setting is shown CLEARLY — the chibis + food are SET IN that specific outdoor place. The setting reads instantly: "this is a beach picnic" or "this is a forest camping trip" — NEVER a generic indoor table-scene.

━━━ ⚠ HARD RULE #4: KAWAII SCENE DECORATION — MAX CUTE-MAXX ━━━

The entire scene is heavily decorated with kawaii motifs — scattered tiny sprinkles, mini-macarons, star-confetti, petal-blossoms, tiny mini-fruits-with-smiling-faces, cream-swirls, pearl-beads, candy. The 3 food_decoration items below MUST appear as visible scattered decor across the scene. Cherry-blossom branches may arch from a corner. Pastel-bunting / fairy-lights / paper-lanterns where setting allows. Rainbow motif welcomed. Pop-Mart designer-vinyl glossy-pearlescent rendering throughout.

━━━ THE KAWAII FOOD HERO (smiling-face centerpiece) ━━━
${food_hero}

━━━ THE CHIBI CREATURE${isGroup ? 'S' : ''} ━━━
${creatureBlock}

${isGroup ? `These chibis are GATHERED AROUND the food hero — 2-3 chibis, mixed species, different heights, all equally cute. Different positions: one sipping, one mid-bite, one wide-eyed-amazed, one holding a mini decoration.` : `This solo chibi is one-on-one with the food hero — facing it, holding it, interacting with it. Adorable expression.`}

━━━ THE CHIBI FOOD ACTIVITY ━━━
${chibi_food_activity}

━━━ THE KAWAII SCENE SETTING ━━━
${scene_setting}

━━━ THREE FOOD DECORATIONS (scattered throughout the scene as visible decor) ━━━
${decorBlock}

━━━ KAWAII ATMOSPHERE LAYER ━━━
${kawaii_atmosphere}

━━━ CAMERA ANGLE ━━━
${camera_angle}

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ WEATHER (affects window light / outdoor mood) ━━━
${weather}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SPARKLE STACK — MAXIMUM KAWAII EFFECTS ━━━

Layer ALL on EVERY render:
- Glossy pearlescent 3D-rendered Pop-Mart designer-vinyl finish on everything
- Soft-pastel palette (blush pink, lavender, mint, peach, cream, baby-blue)
- Soft bokeh-pastel background
- Scattered tiny sprinkles / star-confetti / petal-blossoms throughout the frame
- Mini smiling-face accents on some decorations (mini fruits / hearts / stars)
- Cherry-blossom or pastel-floral branches as accents
- Steam-curl wisps from the food hero with tiny smiling-face hints
- Rainbow accents welcomed (rainbow soft-serve / rainbow milk / rainbow-sparkle dust)
- Pastel cream / icing / glaze drips on the food hero
- Tiny pearl-beads or sugar-glitter dust around the food hero
- Warm soft-pastel ambient light
- Designer-vinyl glossy surfaces with pearlescent sheen

━━━ MOVIE POSTER MOMENT — every render reads "OMG THE CUTEST" ━━━

bex.ai Instagram aesthetic. Pop-Mart designer-vinyl quality. Glossy pearlescent everything. The viewer's reaction: "OMG THIS IS THE CUTEST" — peak kawaii cute-maxxing.

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ HARD BANS ━━━
- NO realistic / photoreal rendering — must be glossy Pop-Mart vinyl
- NO dark / moody lighting — soft pastel only
- NO humans / NO adult human figures
- NO scary / weird food — only kawaii sweet-treats and cute drinks
- The food MUST have a smiling face — never plain food
- The scene MUST be heavily decorated — never sparse / minimalist

━━━ OUTPUT FORMAT (MANDATORY) ━━━

LEAD WITH THE OUTDOOR SETTING FIRST. Then chibis. Then the abundant food spread. The setting must be ESTABLISHED in the first 20-30 words so Flux locks onto the outdoor location and doesn't default to a generic Pop-Mart studio backdrop.

Open with: "[outdoor kawaii scene setting — picnic blanket on a meadow / sandy-pink beach / campsite with tents / treehouse / hot-air-balloon / etc., 20-30 words with setting details visible: trees / sky / waves / mountains / mossy ground / etc.], ${isGroup ? '3-4 adorable chibi creatures of different species are gathered around' : 'one adorable chibi creature is sitting with'} [kawaii smiling-face food hero centerpiece], abundant kawaii treats spread everywhere across the scene, [scattered kawaii food decorations throughout the frame], pastel Pop-Mart glossy pearlescent rendering, [soft pastel light]..."

⚠ THE SETTING APPEARS FIRST. The scene must read as "[outdoor location] with kawaii food + chibis spread across it" — NOT a "Pop-Mart product shot of food with chibis." Trees / sky / waves / pastel-mountains / etc. visible in the background.

⚠ THE FRAME IS FULL — multiple chibis, multiple kawaii smiling-face foods, scattered decorations everywhere. Never a sparse / minimalist composition.

Then unfold. Output ONLY the raw 90-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the phrases.`;
  },


  CHIBIBOT_OUTDOOR_ADVENTURE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature,
      adventure_activity,
      wilderness_setting,
      wilderness_detail,
      adventure_prop,
      time_of_day,
      surprise_element,
      lighting,
      atmosphere,
      weather,
    } = slots;
    const detailList = Array.isArray(wilderness_detail) ? wilderness_detail : [wilderness_detail];
    const detailBlock = detailList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');

    return `You are writing OUTDOOR-ADVENTURE scenes for ChibiBot — a SOLO chibi creature out in the WILD/OPEN WORLD doing an adventurous activity. Pure wilderness — NO villages, NO architecture, NO cottages. Studio Ghibli wilderness / Pokemon-overworld / Pixar-adventure painterly storybook aesthetic. The viewer's reaction: "look at that little adventurer!" Output wraps with style prefix + suffix.

━━━ MANDATORY OUTPUT STRUCTURE — OPEN WITH THE CREATURE ADVENTURING ━━━

The output MUST open with the creature + adventure-activity description IN the wilderness setting. CREATURE-FIRST, but the wilderness is the second hero.

Open examples:
- "A chibi fox-creature mid-leap across mossy stepping-stones over a sparkling forest stream, behind them a dense fern-glade with sunbeams piercing the canopy..."
- "A baby red panda mid-climb up a vine-draped rock-cliff with a leaf-knapsack, behind them a vast jungle canyon dropping into mist..."
- "A chibi child explorer wading knee-deep in a glassy mountain-lake with a butterfly-net, snow-capped peaks rising in the distance..."

━━━ ⚠ HARD RULE #1: WILDERNESS — NO VILLAGES, NO ARCHITECTURE ━━━

The setting is PURE WILDERNESS — forest / mountain / cave / canyon / river / cliff / lake / hill / desert / coastline / canyon / glacier / jungle-floor / meadow-vista / waterfall / etc. NO cottages, NO buildings, NO huts, NO bridges-with-buildings. Just nature — rocks, water, trees, terrain, sky, atmosphere. The creature is OUT in the open world, NOT in a village.

⚠ HARD BAN: rendering this as a "creature near a cottage" or "creature in a village" — those are other paths. This path is WILD nature only.

━━━ ⚠ HARD RULE #2: ADVENTURE-POSE — STORY BEAT ━━━

The creature is MID-ACTION in an ADVENTURE pose: climbing / wading / hiking / mid-leap / cresting-a-ridge / discovering-something / pushing-through-foliage / mid-paddle / mid-skip-across-stones / peeking-over-a-cliff-edge / cresting-a-snowdrift. NEVER posing-still. NEVER just-sitting. The story-beat IS the adventure.

━━━ ⚠ HARD RULE #3: WIDE OR MID-WIDE COMPOSITION — WILDERNESS IS THE CO-HERO ━━━

The wilderness landscape fills 50-70% of the frame — the creature is a small-to-medium scale prover in it (15-30% of frame). Mid-wide composition. The eye sees the WILD landscape AND the tiny adventurer simultaneously. The scale of nature vs. tiny creature is the emotional hook. NOT a portrait crop. NOT a full wide-shot-village-style. A balanced mid-wide adventure-shot.

━━━ THE CHIBI CREATURE ━━━
${creature}

━━━ THE ADVENTURE ACTIVITY ━━━
${adventure_activity}

━━━ THE WILDERNESS SETTING ━━━
${wilderness_setting}

━━━ THREE WILDERNESS DETAILS (lived-in nature richness) ━━━
${detailBlock}

━━━ ADVENTURE PROP (worn or held — small charm) ━━━
${adventure_prop}

━━━ SURPRISE ELEMENT (tucked-away detail) ━━━
${surprise_element}

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ MOVIE POSTER MOMENT — every render is a Pixar-adventure poster ━━━

Pixar / Studio Ghibli / Pokemon-overworld / Adventure-Time painterly framings. The creature mid-adventure in vast nature. Three-act depth (creature foreground / wilderness midground / atmospheric vista background).

━━━ SPARKLE STACK — MAXIMUM WILDERNESS EFFECTS ━━━

Layer ALL on EVERY render:
- Volumetric god-rays through trees / clouds / mist
- Dewdrops on every leaf / blade of grass / mossy stone
- Drifting petals / leaves / pollen / dandelion-seeds in the air
- Subtle bokeh-orbs in atmospheric haze
- Reflections on water / wet-stone / shiny surfaces
- Floating motes / dust catching warm light
- Layered atmospheric depth (foreground sharp / midground depth / background hazy)
- Tiny glowing details (mushroom-glow / firefly-glow / sparkle-on-water)
- Painterly subsurface scattering on creature's fur / scales
- Wind-tousled vegetation (leaves bending / grass swaying / petals lifting)
- Soft volumetric haze in deep distance
- Catchlight in creature's eyes

━━━ RENDERED CGI — Pixar painterly storybook ━━━

Modern Pixar register. Painterly subsurface scattering, warm volumetric light, painterly bokeh. Chibi proportions on the creature.

━━━ NO DARK / NO ADULT HUMANS ━━━

Children OK from unified pool — chibi proportions, adventure-themed clothing.

━━━ WEATHER ━━━
${weather}

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

━━━ COMPOSITION (MID-WIDE adventure shot — wilderness + small creature) ━━━

MID-WIDE COMPOSITION. Wilderness landscape fills 50-70% of the frame. Creature is small-to-medium (15-30% of frame) mid-adventure-pose somewhere in the composition. The scale-contrast of vast nature vs tiny adventurer is the emotional hook. NOT close-up. NOT portrait. NOT establishing-shot. A balanced mid-wide adventure-shot like a Pixar movie still. Three depth-layers visible (foreground / midground / background atmospheric vista).

━━━ OUTPUT FORMAT (MANDATORY) ━━━

Open with: "[creature description] [adventure-activity verb-phrase] in/across/through [wilderness setting], [time-of-day lighting context]..."

Then unfold the rest. Output ONLY the raw 90-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the phrases, opening with the creature in mid-adventure.`;
  },


  CHIBIBOT_CREATURE_PORTRAIT: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature,
      pose,
      expression,
      portrait_feature,
      outfit,
      accessory,
      set_decoration,
      background_mood,
      time_of_day,
      lighting,
      atmosphere,
      weather,
    } = slots;
    const featureList = Array.isArray(portrait_feature) ? portrait_feature : [portrait_feature];
    const featureBlock = featureList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');
    const decorList = Array.isArray(set_decoration) ? set_decoration : [set_decoration];
    const decorBlock = decorList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');

    return `You are writing CHIBI CREATURE PORTRAITS for ChibiBot — a tight close-up of ONE impossibly cute creature filling the frame, MAXED with a cute outfit, accessory, and scattered set-decorations. The viewer cannot look away from the cuteness. Pixar / Sanrio / Pop-Mart designer-vinyl meets storybook-illustration. Output wraps with style prefix + suffix.

━━━ ⚠ HARD RULE #1: SOLO CREATURE FILLS THE FRAME ━━━

ONE creature only — never a pair, never a duo, never a group. Creature is the SOLO hero. Creature fills 60-80% of the frame. Tight close-up or mid-close portrait crop. NOT wide-shot. NOT establishing-shot. NOT a tiny anchor with village behind. Background is a soft dreamy bokeh-blur — pretty but ~20-30% of frame, never competing with the creature.

⚠ HARD BAN: TWO creatures, pair-bonds, multiple subjects. SOLO only.

ABSOLUTE FRAMING: tight head-and-shoulders portrait, OR close-up with paws-up-to-cheeks, OR mid-close 3/4-body view. Creature dominates. The viewer's eye is LOCKED on the cuteness.

━━━ ⚠ HARD RULE #2: HYPER-CUTE PROPORTIONS — NON-NEGOTIABLE ━━━

Push IMPOSSIBLY ROUND AND SOFT:
- Oversized dewy GLISTENING reflective multi-catchlight EYES (taking up half the face)
- Tiny stubby paws / hooves / fins (relative to body)
- Marshmallow / mochi proportions — chunky soft-cloud body
- Exaggerated head-to-body ratio (head is 50-60% of total volume)
- BLUSH CHEEKS mandatory (rosy pink dabs on the cheeks)
- Tiny pink nose / mouth — minimal but present
- Cute round ears / appendages (if applicable to species)

━━━ ⚠ HARD RULE #3: MAX THE SPICE — VISIBLE OUTFIT + ACCESSORY + 3 SET DECORATIONS ━━━

NOT a minimalist portrait. EVERY render MUST show:
1. A visible CUTE OUTFIT on the creature (knit-sweater / dress / overalls / kimono / scarf-tied — see outfit slot below)
2. A visible ACCESSORY held or worn (bow / crown / flower / balloon — see accessory slot below)
3. Three SCATTERED SET-DECORATIONS in the soft-bokeh foreground around the creature (floating hearts / scattered flowers / stack of books / mini tea-set / pastel ribbons — see set_decoration slot below)

The render must feel ABUNDANT and LAYERED — not empty. The creature is the hero but the frame is FULL of cute supporting elements.

━━━ THE CHIBI CREATURE ━━━
${creature}

━━━ POSE — what the creature is doing ━━━
${pose}

━━━ EXPRESSION — emotional state ━━━
${expression}

━━━ TWO PORTRAIT FEATURES (amplify the cuteness on the creature's body) ━━━
${featureBlock}

━━━ ⚠ CUTE OUTFIT (creature is WEARING this — make it visible) ━━━
${outfit}

━━━ ⚠ ACCESSORY (visible held or worn on the creature) ━━━
${accessory}

━━━ ⚠ THREE SCATTERED SET-DECORATIONS (foreground or floating around the creature, in the soft-bokeh-blur) ━━━
${decorBlock}

━━━ BACKGROUND MOOD (soft dreamy bokeh, NOT a setting) ━━━
${background_mood}

━━━ TIME OF DAY (sets the lighting register) ━━━
${time_of_day}

━━━ MOVIE POSTER MOMENT — every render is a wallpaper-worthy portrait ━━━

The viewer's reaction: "I need this as my phone wallpaper." Pop-Mart designer-vinyl portrait meets storybook-illustration. Single hero creature dominating the frame, perfect rim-light, painterly bokeh background.

━━━ SPARKLE STACK — MAXIMUM PORTRAIT EFFECTS ━━━

Layer ALL on EVERY render:
- Soft painterly subsurface scattering on creature's fur / scales / skin / plush
- Backlit rim-light or hair-light catching every edge of the silhouette
- Warm-amber catchlight in BOTH eyes (multi-catchlight glassy dewy reflection)
- Soft dreamy bokeh background (pretty but never competing)
- Floating tiny sparkle-particles around the creature (petals / pollen / dust-motes / pastel-confetti)
- Pearlescent / iridescent micro-highlights on the body
- Blush gradient on cheeks (rosy-pink mochi-blush)
- Volumetric soft-warm light wrapping the creature
- Pretty bokeh-orbs in pastel colors in deep background
- Iridescent shimmer in eye-reflections
- Soft-focus depth pull (creature SHARP, background MELTED)
- Magical glow around the silhouette

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ WEATHER (subtle hint via bokeh — not a setting) ━━━
${weather}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━

TIGHT CLOSE-UP or MID-CLOSE PORTRAIT. Creature fills 60-80% of frame. Centered or rule-of-thirds. Background is a soft dreamy bokeh-melt — pretty colors, not a recognizable setting. The creature is WEARING the cute outfit and HOLDING/WEARING the accessory. Set-decorations are scattered in the soft-bokeh-blur foreground or floating around the creature. NOT a tiny creature with village behind. NOT an establishing shot. SOLO only — never a pair.

━━━ OUTPUT FORMAT (MANDATORY) ━━━

Open with: "[solo creature description with impossibly-cute proportions] [pose + expression], wearing [cute outfit], with [visible accessory], [portrait features visible], surrounded by [scattered set-decorations in the soft bokeh-blur], dreamy soft-bokeh [background-mood] background, [time-of-day lighting register]..."

⚠ The outfit + accessory + 3 decorations MUST appear in the brief — never minimalist / sparse.

Then unfold the sparkle-stack and atmospheric details. Output ONLY the raw 90-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. The CREATURE is the hero (SOLO) — frame is MAXED with outfit + accessory + scattered decor.`;
  },


  CHIBIBOT_CUTE_FOOD_FULLBESPOKE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      food_hero,
      food_pose,
      food_setting,
      scattered_accent,
      kawaii_atmosphere,
      time_of_day,
      camera_angle,
      lighting,
      atmosphere,
      weather,
    } = slots;
    const accentList = Array.isArray(scattered_accent) ? scattered_accent : [scattered_accent];
    const accentBlock = accentList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');

    return `You are writing CUTE-FOOD bex.ai-inspired kawaii pop-mart food/drink renders for ChibiBot — the HERO FOOD has a smiling face. The food IS the cast. NO chibi creatures, NO human characters, NO animals. Pop-Mart designer-vinyl glossy-pearlescent rendering. Output wraps with style prefix + suffix.

━━━ ⚠ HARD RULE #1: THE FOOD HAS A SMILING FACE ━━━

The hero food/drink centerpiece has a literal kawaii smiling face printed on it — dimpled-blush cheeks, closed-arc-eyes, tiny printed mouth. Boba cup, sundae, pancake-stack, mochi-tray, cake, taiyaki, cereal-bowl, donut, parfait — whatever the food hero, it's anthropomorphized with a sweet smiling face. This is the bex.ai aesthetic non-negotiable.

━━━ ⚠ HARD RULE #2: NO CREATURES / NO CHARACTERS — THE FOOD IS THE CAST ━━━

NO chibi creatures, NO chibi children, NO animals, NO humans, NO minifigs, NO peripheral characters of any kind. The kawaii-faced food and its scattered kawaii accents (mini-faces, fruits-with-faces, etc.) are the ENTIRE cast. Sister path is miniature-feast which has chibis + food; THIS PATH is food-only.

━━━ ⚠ HARD RULE #3: POP-MART DESIGNER-VINYL FINISH ━━━

Glossy pearlescent 3D-rendered Pop-Mart designer-vinyl quality. Pearl-iridescent surfaces. Soft-pastel palette (blush pink, lavender, mint, peach, cream, baby-blue). Glazed-pearlescent finish on every surface. Designer-collectible-vinyl aesthetic.

━━━ THE KAWAII FOOD HERO (smiling-face centerpiece) ━━━
${food_hero}

━━━ FOOD POSE / PRESENTATION ━━━
${food_pose}

━━━ SETTING (kawaii product-shot backdrop) ━━━
${food_setting}

━━━ THREE SCATTERED KAWAII ACCENTS (around the hero food) ━━━
${accentBlock}

━━━ KAWAII ATMOSPHERE LAYER ━━━
${kawaii_atmosphere}

━━━ CAMERA ANGLE ━━━
${camera_angle}

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ WEATHER (subtle hint, e.g. window-light variations) ━━━
${weather}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SPARKLE STACK — MAXIMUM CUTE-FOOD EFFECTS ━━━

Layer ALL on EVERY render:
- Glossy pearlescent 3D-rendered Pop-Mart designer-vinyl finish on the hero food
- Soft-pastel palette (blush pink / lavender / mint / peach / cream / baby-blue)
- Soft bokeh-pastel background
- Scattered tiny sprinkles / star-confetti / petal-blossoms throughout the frame
- Mini smiling-face accents on some of the scattered decorations (mini fruits / hearts / stars)
- Cherry-blossom or pastel-floral branches as accents (arching from a corner)
- Steam-curl wisps from the food hero (if hot food) with tiny smiling-face hints
- Rainbow accents welcomed (rainbow soft-serve / rainbow milk / rainbow-sparkle dust)
- Pastel cream / icing / glaze drips on the food hero
- Tiny pearl-beads or sugar-glitter dust around the food hero
- Warm soft-pastel ambient light
- Designer-vinyl glossy surfaces with pearlescent sheen
- Pastel cherry-blossom-petal-drift in the air

━━━ MOVIE POSTER MOMENT — every render reads "OMG THE CUTEST" ━━━

bex.ai Instagram aesthetic. Pop-Mart designer-vinyl quality. The viewer's reaction: "OMG THIS IS THE CUTEST" — peak kawaii cute-maxxing on a product-shot quality frame.

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ HARD BANS ━━━
- NO chibi creatures, NO children, NO animals, NO humans — the food IS the cast
- NO realistic / photoreal rendering — must be glossy Pop-Mart vinyl
- NO dark / moody / saturated-deep lighting — soft pastel only
- NO scary / weird food — only kawaii sweet-treats and cute drinks
- The food MUST have a smiling face — never plain food
- The scene MUST have scattered kawaii decor — never sparse / minimalist

━━━ OUTPUT FORMAT (MANDATORY) ━━━

Open with: "[kawaii smiling-face food hero centerpiece with anthropomorphized face description], [food pose / presentation detail], [setting backdrop], scattered kawaii decorations around it, pastel Pop-Mart glossy pearlescent rendering, [soft pastel light]..."

Then unfold the sparkle-stack. Output ONLY the raw 90-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the phrases.`;
  },


  CHIBIBOT_AQUATIC_VILLAGE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature,
      resident_activity,
      village,
      village_detail,
      time_of_day,
      surprise_element,
      phenomenon,
      lighting,
      atmosphere,
      weather,
    } = slots;
    const phenomenonFires = Math.random() < 0.6;
    const detailList = Array.isArray(village_detail) ? village_detail : [village_detail];
    const detailBlock = detailList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');
    const phenomenonBlock = phenomenonFires
      ? `\n\n━━━ ENVIRONMENTAL PHENOMENON (stack on top of everything else) ━━━\n${phenomenon}`
      : '';

    return `You are writing COZY AQUATIC-VILLAGE scenes for ChibiBot — a SOLO foreground creature doing a story-driven activity with a cozy underwater/coastal village spanning behind them. Studio Ghibli / Ponyo / Atlantis / Finding-Nemo painterly storybook aesthetic. The viewer's reaction: "I want to live in that village." Output wraps with style prefix + suffix.

━━━ MANDATORY OUTPUT STRUCTURE — OPEN WITH THE CREATURE ━━━

The output MUST open with the creature + activity description, THEN describe the aquatic-village spanning behind them. CREATURE-FIRST.

Open examples:
- "A chibi seahorse-creature mid-drift past a pearl-bead lantern-post, behind them a coral-tower village glowing pink-and-violet through teal water..."
- "A baby otter on a lily-pad-bridge with a kelp-basket of seaweed, a floating lily-pad village glowing warm-amber against blue-green water..."
- "A chibi fish-child swimming past a starfish-bridge with a satchel of pearls, a submarine-port hamlet with brass-portholes glowing beyond..."

━━━ ⚠ HARD RULE #1: VILLAGE FILLS THE FRAME — CREATURE IS A SMALL ANCHOR ━━━

The aquatic-village architecture fills 70-85% of the frame — many coral-towers / kelp-cottages / pearl-shell-buildings / submarine-port / sea-cave-dwellings / lily-pad-platforms / starfish-bridges / bioluminescent-grotto all visible across foreground / midground / background. WIDE ESTABLISHING SHOT showing the whole village ecosystem. The SOLO creature is a SMALL anchor (8-15% of frame) somewhere in the composition — NOT the focal hero of the frame. The viewer's eye first lands on the WHOLE VILLAGE, then discovers the tiny creature as a delightful detail. NOT a portrait. NOT close-up. NOT 30% of frame. The creature is a SCALE PROVER, not a centered subject. ABSOLUTE REQUIREMENT: the creature MUST appear in the frame, but small. HARD BAN: creature occupying more than 20% of frame, portrait crops, chest-up framing, centered close-ups.

━━━ ⚠ HARD RULE #2: WATER MUST BE VISIBLE IN EVERY RENDER ━━━

The setting is UNDERWATER (coral-tower / kelp-forest / submarine-port / grotto / sea-cave) OR COASTAL (tidepool / shore-village / lily-pad-cluster on water). Either way WATER + OCEAN-BIOME must read INSTANTLY at first glance — NOT a "village with coral accents."

EXPLICIT WATER MANDATES (every render):
- WATER FILLS the lower half of the frame OR fills the BACKGROUND, OR the WHOLE FRAME is underwater
- COOL TEAL / CYAN / DEEP-BLUE / AQUA palette dominates — NOT warm-amber-jungle palette (warm-amber appears only as small interior cottage-light accent points contrasted against the cool water)
- VISIBLE OCEAN-SIGNATURES: drifting bubble-streams, swirling fish-schools, dappled water-caustic light on every surface, water-reflections, swaying kelp-fronds, bioluminescent coral-glow, distant jellyfish silhouettes
- THE SCENE IS WATER-IMMERSIVE — the viewer sees water FIRST, then the village in/on/beside the water

⚠ HARD BAN: rendering this as a "cozy kawaii village with coral accents and lantern-glow" without visible water dominance. If a viewer can't immediately tell it's aquatic from a 1-second glance, the render has FAILED. Water is the signature, not a decoration.

⚠ HARD BAN: warm-amber-tropical-jungle palette. Replace warm tropical light with cool aqua-water-caustic dapple. Warm-amber appears only as small point-source accents from cottage-windows.

━━━ THE FOREGROUND CREATURE ━━━
${creature}

━━━ THE CREATURE'S STORY ACTIVITY ━━━
${resident_activity}

━━━ THE AQUATIC-VILLAGE (spans behind the creature) ━━━
${village}

━━━ THREE AQUATIC-VILLAGE DETAILS (populate the village with lived-in richness) ━━━
${detailBlock}

━━━ MOVIE POSTER MOMENT — every render must be a frame-worthy still ━━━

Poster-worthy single frame. Studio Ghibli / Ponyo / Atlantis / Finding-Nemo framings. The creature mid-action in the lived-in aquatic village. Composition: three-act depth (foreground creature with prop / midground village architecture / background atmospheric teal/cyan water-light + coral-pink + pearl-violet + warm-amber-glow inside).

━━━ STORY BEAT — every render tells a STORY ━━━

The creature is MID-ACTION. NEVER posing. The story-beat is what makes it alive.

━━━ SPARKLE STACK — MAXIMUM COZY-AQUATIC EFFECTS ━━━

Layer ALL of these:
- Drifting fish-schools in the deep midground/background
- Bubble-streams rising from architecture and creatures
- Sun-shafts dappling through water onto the village
- Bioluminescent-glow from coral / kelp / lanterns
- Pearl-shimmer / iridescent-shell-light
- Kelp-fronds drifting in gentle currents
- Coral-sway with the water
- Dappled water-caustic light on every surface
- Floating glitter / sand-particles in water
- Drifting jellyfish silhouettes in deep background
- Pastel coral-bloom colors throughout
- Tiny starfish / sea-anemones tucked into architecture

━━━ CUTE + CUDDLY + COZY (NON-NEGOTIABLE) ━━━

"I want to live in that village" longing. Wholesome cottagecore-aquatic-magic.

━━━ RENDERED CGI — Pixar painterly storybook ━━━

Modern Pixar register. Painterly subsurface scattering, painterly bokeh. Chibi proportions.

━━━ NO DARK / NO ADULT HUMANS ━━━

Children OK from unified pool — render at chibi proportions.

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ WEATHER ━━━
${weather}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SURPRISE ELEMENT (second-tier detail) ━━━
${surprise_element}${phenomenonBlock}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION (WIDE establishing shot — village fills frame, creature is small scale-prover) ━━━

WIDE ESTABLISHING SHOT. Camera pulled WAY back. The aquatic-village fills 70-85% of the frame — multiple coral-towers / kelp-cottages / pearl-shell-buildings / submarine-port / sea-cave-dwellings / lily-pad-platforms / starfish-bridges / bioluminescent-grotto visible at varying depths (foreground / midground / background). The creature is SMALL (8-15% of frame). NOT close-up. NOT centered portrait. NOT 30% of frame. The eye reads VILLAGE FIRST, then discovers the tiny creature. Three village-details visible across the architecture. Surprise element tucked in the deep midground.

━━━ OUTPUT FORMAT (MANDATORY) ━━━

Open with: "[creature description] [activity verb-phrase], [aquatic-village description] spanning behind, [biome-specific lighting context]..."

Then unfold. Output ONLY the raw 90-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the phrases, opening with the creature.`;
  },


  CHIBIBOT_COTTAGECORE_VILLAGE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature,
      resident_activity,
      village,
      village_detail,
      time_of_day,
      surprise_element,
      phenomenon,
      lighting,
      atmosphere,
      weather,
    } = slots;
    const phenomenonFires = Math.random() < 0.6;
    const detailList = Array.isArray(village_detail) ? village_detail : [village_detail];
    const detailBlock = detailList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');
    const phenomenonBlock = phenomenonFires
      ? `\n\n━━━ ENVIRONMENTAL PHENOMENON (stack on top of everything else) ━━━\n${phenomenon}`
      : '';

    return `You are writing COZY COTTAGECORE-VILLAGE scenes for ChibiBot — a SOLO foreground creature doing a story-driven activity with a cozy English-countryside cottagecore village spanning behind them. Studio Ghibli / Howl-Moving-Castle / Beatrix-Potter / Whisper-of-the-Heart painterly storybook aesthetic. The viewer's reaction: "I want to live in that village." Output wraps with style prefix + suffix.

━━━ MANDATORY OUTPUT STRUCTURE — OPEN WITH THE CREATURE ━━━

The output MUST open with the creature + activity description, THEN describe the cottagecore-village spanning behind them. CREATURE-FIRST.

Open examples:
- "A chibi rabbit-child mid-skip down a cobblestone lane carrying a basket of wildflowers, behind them a thatched-roof cottage cluster nestled in a lavender field..."
- "A baby hedgehog hauling a wheelbarrow of apples toward a stone-bridge, a wisteria-tunnel village with cottage-smoke curling beyond..."
- "A chibi mouse-creature watering window-box geraniums on a half-timbered cottage porch, a windmill village with golden-wheat-fields spreading behind..."

━━━ ⚠ HARD RULE #1: VILLAGE FILLS THE FRAME — CREATURE IS A SMALL ANCHOR ━━━

The cottagecore-village architecture fills 70-85% of the frame — many thatched-roof cottages / windmills / lavender-field cottages / apple-orchard hamlets / wisteria-tunnel villages / cobblestone lanes / canal-side cottages / mushroom-cottage clusters / fairy-glade hamlets / stone-bridge cottages all visible across foreground / midground / background. WIDE ESTABLISHING SHOT showing the whole village ecosystem. The SOLO creature is a SMALL anchor (8-15% of frame) somewhere in the composition — NOT the focal hero of the frame. The viewer's eye first lands on the WHOLE VILLAGE, then discovers the tiny creature as a delightful detail. NOT a portrait. NOT close-up. NOT 30% of frame. The creature is a SCALE PROVER, not a centered subject. ABSOLUTE REQUIREMENT: the creature MUST appear in the frame, but small. HARD BAN: creature occupying more than 20% of frame, portrait crops, chest-up framing, centered close-ups.

━━━ ⚠ HARD RULE #2: COTTAGECORE COUNTRYSIDE — LUSH GREEN / FLOWERS / OLD-WORLD CHARM ━━━

The setting is LUSH-GREEN countryside / cottagecore — thatched-roofs, half-timbered walls, stone-bridges, flower-laden cottages, climbing roses, windmills, lavender-fields, apple-orchards, wisteria-tunnels. Old-world Beatrix-Potter charm. ALWAYS lush green / flower-laden / summer-into-early-autumn warm season. NEVER snow, NEVER underwater, NEVER tropical.

━━━ THE FOREGROUND CREATURE ━━━
${creature}

━━━ THE CREATURE'S STORY ACTIVITY ━━━
${resident_activity}

━━━ THE COTTAGECORE-VILLAGE (spans behind the creature) ━━━
${village}

━━━ THREE COTTAGECORE-VILLAGE DETAILS (populate the village with lived-in richness) ━━━
${detailBlock}

━━━ MOVIE POSTER MOMENT — every render must be a frame-worthy still ━━━

Poster-worthy single frame. Studio Ghibli / Howl-Moving-Castle / Beatrix-Potter / Whisper-of-the-Heart framings. The creature mid-action in the lived-in cottagecore village. Composition: three-act depth (foreground creature with prop / midground village architecture / background atmospheric sage-green + sage + warm-amber + butter-yellow + soft-pink + lavender + cream).

━━━ STORY BEAT — every render tells a STORY ━━━

The creature is MID-ACTION. NEVER posing. The story-beat is what makes it alive.

━━━ SPARKLE STACK — MAXIMUM COZY-COTTAGECORE EFFECTS ━━━

Layer ALL of these:
- Golden-hour-glow pouring across the village
- Cottage-garden roses climbing every wall
- Wisteria-petal-drift or cherry-blossom-petal-drift in the air
- Honeybees and butterflies darting between flowers
- Wildflower-meadow carpeting around the cottages
- Cottage-window-box blooms (geraniums / petunias / lavender)
- Warm cottage-smoke from stone chimneys
- Dragonflies and damselflies over a stream
- Sheep / chickens / honeybees as tiny village-life background
- Stone-pavement weathered with moss between cracks
- Lace-curtains in cottage windows, warm-amber interior glow
- Hanging laundry on a clothesline, soft pastel fabrics

━━━ CUTE + CUDDLY + COZY (NON-NEGOTIABLE) ━━━

"I want to live in that village" longing. Wholesome cottagecore-cottagecore-magic.

━━━ RENDERED CGI — Pixar painterly storybook ━━━

Modern Pixar register. Painterly subsurface scattering, painterly bokeh. Chibi proportions.

━━━ NO DARK / NO ADULT HUMANS ━━━

Children OK from unified pool — render at chibi proportions.

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ WEATHER ━━━
${weather}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SURPRISE ELEMENT (second-tier detail) ━━━
${surprise_element}${phenomenonBlock}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION (WIDE establishing shot — village fills frame, creature is small scale-prover) ━━━

WIDE ESTABLISHING SHOT. Camera pulled WAY back. The cottagecore-village fills 70-85% of the frame — multiple thatched-roof cottages / windmills / lavender-field cottages / apple-orchard hamlets / wisteria-tunnel villages / cobblestone lanes / canal-side cottages / mushroom-cottage clusters / fairy-glade hamlets / stone-bridge cottages visible at varying depths (foreground / midground / background). The creature is SMALL (8-15% of frame). NOT close-up. NOT centered portrait. NOT 30% of frame. The eye reads VILLAGE FIRST, then discovers the tiny creature. Three village-details visible across the architecture. Surprise element tucked in the deep midground.

━━━ OUTPUT FORMAT (MANDATORY) ━━━

Open with: "[creature description] [activity verb-phrase], [cottagecore-village description] spanning behind, [biome-specific lighting context]..."

Then unfold. Output ONLY the raw 90-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the phrases, opening with the creature.`;
  },


  CHIBIBOT_SUNNY_VILLAGE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature,
      resident_activity,
      village,
      village_detail,
      time_of_day,
      surprise_element,
      phenomenon,
      lighting,
      atmosphere,
      weather,
    } = slots;
    const phenomenonFires = Math.random() < 0.6;
    const detailList = Array.isArray(village_detail) ? village_detail : [village_detail];
    const detailBlock = detailList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');
    const phenomenonBlock = phenomenonFires
      ? `\n\n━━━ ENVIRONMENTAL PHENOMENON (stack on top of everything else) ━━━\n${phenomenon}`
      : '';

    return `You are writing COZY SUNNY-VILLAGE scenes for ChibiBot — a SOLO foreground creature doing a story-driven activity with a cozy Mediterranean / sun-drenched village spanning behind them. Studio Ghibli / Kiki-Delivery-Service / Porco-Rosso / Luca / Spirited-Away painterly storybook aesthetic. The viewer's reaction: "I want to live in that village." Output wraps with style prefix + suffix.

━━━ MANDATORY OUTPUT STRUCTURE — OPEN WITH THE CREATURE ━━━

The output MUST open with the creature + activity description, THEN describe the sunny-village spanning behind them. CREATURE-FIRST.

Open examples:
- "A chibi cat-creature mid-step down a Santorini-style cliff-village stair with a basket of lemons, behind them white-cottages cascading toward a blue Aegean sea..."
- "A baby donkey hauling a small wood-cart of olives down a cobblestone lane, a terracotta-roof Tuscan village with cypress-trees beyond..."
- "A chibi bird-child carrying laundry up a bougainvillea-draped staircase, a Mediterranean cliff-village glowing in golden-hour spreading behind..."

━━━ ⚠ HARD RULE #1: VILLAGE FILLS THE FRAME — CREATURE IS A SMALL ANCHOR ━━━

The sunny-village architecture fills 70-85% of the frame — many bougainvillea-clad cottages / white-cottages on cliffs / terracotta-roof clusters / Santorini-style cliff-villages / desert-oasis hamlets / sun-bleached pueblos / fishing-port cottages / palm-fringed hamlets / olive-grove villages all visible across foreground / midground / background. WIDE ESTABLISHING SHOT showing the whole village ecosystem. The SOLO creature is a SMALL anchor (8-15% of frame) somewhere in the composition — NOT the focal hero of the frame. The viewer's eye first lands on the WHOLE VILLAGE, then discovers the tiny creature as a delightful detail. NOT a portrait. NOT close-up. NOT 30% of frame. The creature is a SCALE PROVER, not a centered subject. ABSOLUTE REQUIREMENT: the creature MUST appear in the frame, but small. HARD BAN: creature occupying more than 20% of frame, portrait crops, chest-up framing, centered close-ups.

━━━ ⚠ HARD RULE #2: MEDITERRANEAN SUN-DRENCHED — WHITE-WASHED / TERRACOTTA / BOUGAINVILLEA ━━━

The setting is BRIGHT MEDITERRANEAN / SUN-DRENCHED — white-washed walls, terracotta-roofs, bougainvillea-cascade, stone-pavement, cliff-side perches over blue-sea, palm-trees, olive-groves, sun-bleached pastels. Studio Ghibli Luca / Porco-Rosso vibes. ALWAYS warm summer-light, NEVER overcast, NEVER snow.

━━━ THE FOREGROUND CREATURE ━━━
${creature}

━━━ THE CREATURE'S STORY ACTIVITY ━━━
${resident_activity}

━━━ THE SUNNY-VILLAGE (spans behind the creature) ━━━
${village}

━━━ THREE SUNNY-VILLAGE DETAILS (populate the village with lived-in richness) ━━━
${detailBlock}

━━━ MOVIE POSTER MOMENT — every render must be a frame-worthy still ━━━

Poster-worthy single frame. Studio Ghibli / Kiki-Delivery-Service / Porco-Rosso / Luca / Spirited-Away framings. The creature mid-action in the lived-in sunny village. Composition: three-act depth (foreground creature with prop / midground village architecture / background atmospheric warm-white + terracotta-orange + bougainvillea-magenta + olive-green + sky-blue + ochre).

━━━ STORY BEAT — every render tells a STORY ━━━

The creature is MID-ACTION. NEVER posing. The story-beat is what makes it alive.

━━━ SPARKLE STACK — MAXIMUM COZY-SUNNY EFFECTS ━━━

Layer ALL of these:
- Golden-hour or hot-noon warmth on white-washed walls
- Bougainvillea-petal drift in warm breeze
- Palm-shadows dappling on stone-pavement
- Sun-bleached textures with painterly weathering
- Hot-stone-glow reflecting upward
- Cicadas-suggestion via shimmering-air-heat
- Wash hanging on clotheslines between balconies, soft pastel fabrics
- Sunflower-pots and geranium-pots on terracotta steps
- Distant blue-sea visible behind the cottages (for cliff/coastal subtypes)
- Vines (grape / ivy) wrapping stone-walls
- Terracotta-roof tiles with warm patina
- Olive-tree silhouettes in soft haze

━━━ CUTE + CUDDLY + COZY (NON-NEGOTIABLE) ━━━

"I want to live in that village" longing. Wholesome cottagecore-sunny-magic.

━━━ RENDERED CGI — Pixar painterly storybook ━━━

Modern Pixar register. Painterly subsurface scattering, painterly bokeh. Chibi proportions.

━━━ NO DARK / NO ADULT HUMANS ━━━

Children OK from unified pool — render at chibi proportions.

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ WEATHER ━━━
${weather}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SURPRISE ELEMENT (second-tier detail) ━━━
${surprise_element}${phenomenonBlock}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION (WIDE establishing shot — village fills frame, creature is small scale-prover) ━━━

WIDE ESTABLISHING SHOT. Camera pulled WAY back. The sunny-village fills 70-85% of the frame — multiple bougainvillea-clad cottages / white-cottages on cliffs / terracotta-roof clusters / Santorini-style cliff-villages / desert-oasis hamlets / sun-bleached pueblos / fishing-port cottages / palm-fringed hamlets / olive-grove villages visible at varying depths (foreground / midground / background). The creature is SMALL (8-15% of frame). NOT close-up. NOT centered portrait. NOT 30% of frame. The eye reads VILLAGE FIRST, then discovers the tiny creature. Three village-details visible across the architecture. Surprise element tucked in the deep midground.

━━━ OUTPUT FORMAT (MANDATORY) ━━━

Open with: "[creature description] [activity verb-phrase], [sunny-village description] spanning behind, [biome-specific lighting context]..."

Then unfold. Output ONLY the raw 90-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the phrases, opening with the creature.`;
  },


  CHIBIBOT_TWILIGHT_VILLAGE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature,
      resident_activity,
      village,
      village_detail,
      time_of_day,
      surprise_element,
      phenomenon,
      lighting,
      atmosphere,
      weather,
    } = slots;
    const phenomenonFires = Math.random() < 0.6;
    const detailList = Array.isArray(village_detail) ? village_detail : [village_detail];
    const detailBlock = detailList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');
    const phenomenonBlock = phenomenonFires
      ? `\n\n━━━ ENVIRONMENTAL PHENOMENON (stack on top of everything else) ━━━\n${phenomenon}`
      : '';

    return `You are writing COZY TWILIGHT-VILLAGE scenes for ChibiBot — a SOLO foreground creature doing a story-driven activity with a cozy twilight / lantern-lit / firefly-magic village spanning behind them. Studio Ghibli / Spirited-Away / Whisper-of-the-Heart / Howl-Moving-Castle / Tangled-lanterns painterly storybook aesthetic. The viewer's reaction: "I want to live in that village." Output wraps with style prefix + suffix.

━━━ MANDATORY OUTPUT STRUCTURE — OPEN WITH THE CREATURE ━━━

The output MUST open with the creature + activity description, THEN describe the twilight-village spanning behind them. CREATURE-FIRST.

Open examples:
- "A chibi raccoon-creature mid-walk down a lantern-lit lane with a paper-lantern dangling from a stick, behind them a Spirited-Away-style paper-lantern village spilling warm-amber against deep-violet dusk sky..."
- "A baby owl on a stone-bridge with a glowworm-jar, a moonlit-village with paper-lanterns and rim-lit rooftops shimmering blue-cyan beyond..."
- "A chibi child mid-skip across a firefly-meadow cottage path with a lit candle-jar, dusk-glow cottages with warm-amber windows spreading into a magenta-dusk horizon..."

━━━ ⚠ HARD RULE #1: VILLAGE FILLS THE FRAME — CREATURE IS A SMALL ANCHOR ━━━

The twilight-village architecture fills 70-85% of the frame — many lantern-lane cottages / firefly-meadow cottages / moonlit-bridge towns / dusk-window-glow clusters / paper-lantern-festival villages / Japanese-paper-lantern-towns / nightingale-grove cottages / star-lit-spire villages / bioluminescent-garden clusters / glowworm-cave hamlets / moonflower-meadow villages all visible across foreground / midground / background. WIDE ESTABLISHING SHOT showing the whole village ecosystem. The SOLO creature is a SMALL anchor (8-15% of frame) somewhere in the composition — NOT the focal hero of the frame. The viewer's eye first lands on the WHOLE VILLAGE, then discovers the tiny creature as a delightful detail. NOT a portrait. NOT close-up. NOT 30% of frame. The creature is a SCALE PROVER, not a centered subject. ABSOLUTE REQUIREMENT: the creature MUST appear in the frame, but small. HARD BAN: creature occupying more than 20% of frame, portrait crops, chest-up framing, centered close-ups.

━━━ ⚠ HARD RULE #2: TWILIGHT / DUSK / LANTERN-LIT — MAGIC-HOUR ATMOSPHERE ━━━

The setting is at TWILIGHT — dusk / blue-hour / lantern-lit-night. Warm-amber lantern-glow / paper-lantern-strings / firefly-trails / moonlit-rim-light dominate. Sky is deep-violet-blue or magenta-dusk. NEVER bright noon, NEVER overcast-gray. Magic-hour atmosphere with first stars / fireflies / lanterns lit.

━━━ THE FOREGROUND CREATURE ━━━
${creature}

━━━ THE CREATURE'S STORY ACTIVITY ━━━
${resident_activity}

━━━ THE TWILIGHT-VILLAGE (spans behind the creature) ━━━
${village}

━━━ THREE TWILIGHT-VILLAGE DETAILS (populate the village with lived-in richness) ━━━
${detailBlock}

━━━ MOVIE POSTER MOMENT — every render must be a frame-worthy still ━━━

Poster-worthy single frame. Studio Ghibli / Spirited-Away / Whisper-of-the-Heart / Howl-Moving-Castle / Tangled-lanterns framings. The creature mid-action in the lived-in twilight village. Composition: three-act depth (foreground creature with prop / midground village architecture / background atmospheric deep-violet-blue + warm-amber lantern-glow + magenta-dusk + soft-pink-cloud + moonlit-cyan).

━━━ STORY BEAT — every render tells a STORY ━━━

The creature is MID-ACTION. NEVER posing. The story-beat is what makes it alive.

━━━ SPARKLE STACK — MAXIMUM COZY-TWILIGHT EFFECTS ━━━

Layer ALL of these:
- Warm-amber lantern-glow from paper-lanterns / oil-lamps / candle-windows
- Firefly-trails drifting through the air
- Moonlit-rim-light on architecture
- Deep-violet-blue or magenta dusk sky
- Paper-lantern strings hung across the village
- Starlit-haze in the sky overhead
- Soft purple-blue shadows contrasting warm-amber light
- Candle-window-glow from every cottage
- Twilight-mist drifting low through the streets
- Distant glowworms / bioluminescent-blossoms / glow-mushrooms
- Light spill across cobblestone or wooden-platforms
- Reflections of lantern-light on water (canals / ponds / wet-stone)

━━━ CUTE + CUDDLY + COZY (NON-NEGOTIABLE) ━━━

"I want to live in that village" longing. Wholesome cottagecore-twilight-magic.

━━━ RENDERED CGI — Pixar painterly storybook ━━━

Modern Pixar register. Painterly subsurface scattering, painterly bokeh. Chibi proportions.

━━━ NO DARK / NO ADULT HUMANS ━━━

Children OK from unified pool — render at chibi proportions.

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ WEATHER ━━━
${weather}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SURPRISE ELEMENT (second-tier detail) ━━━
${surprise_element}${phenomenonBlock}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION (WIDE establishing shot — village fills frame, creature is small scale-prover) ━━━

WIDE ESTABLISHING SHOT. Camera pulled WAY back. The twilight-village fills 70-85% of the frame — multiple lantern-lane cottages / firefly-meadow cottages / moonlit-bridge towns / dusk-window-glow clusters / paper-lantern-festival villages / Japanese-paper-lantern-towns / nightingale-grove cottages / star-lit-spire villages / bioluminescent-garden clusters / glowworm-cave hamlets / moonflower-meadow villages visible at varying depths (foreground / midground / background). The creature is SMALL (8-15% of frame). NOT close-up. NOT centered portrait. NOT 30% of frame. The eye reads VILLAGE FIRST, then discovers the tiny creature. Three village-details visible across the architecture. Surprise element tucked in the deep midground.

━━━ OUTPUT FORMAT (MANDATORY) ━━━

Open with: "[creature description] [activity verb-phrase], [twilight-village description] spanning behind, [biome-specific lighting context]..."

Then unfold. Output ONLY the raw 90-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the phrases, opening with the creature.`;
  },


  CHIBIBOT_ARCTIC_VILLAGE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature,
      resident_activity,
      village,
      village_detail,
      time_of_day,
      surprise_element,
      phenomenon,
      lighting,
      atmosphere,
      weather,
    } = slots;
    const phenomenonFires = Math.random() < 0.6;
    const detailList = Array.isArray(village_detail) ? village_detail : [village_detail];
    const detailBlock = detailList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');
    const phenomenonBlock = phenomenonFires
      ? `\n\n━━━ ENVIRONMENTAL PHENOMENON (stack on top of everything else) ━━━\n${phenomenon}`
      : '';

    return `You are writing COZY ARCTIC-VILLAGE scenes for ChibiBot — a SOLO foreground creature doing a story-driven activity with a cozy snow/ice/arctic village (snow-cottage rows / igloo clusters / log-cabins under aurora / gingerbread-snow-fortresses / polar-station hamlets / mountain-chalets / fishing-villages on frozen lakes) spanning behind them. Studio Ghibli / Frozen / Arrietty-Borrowers / Polar-Express painterly storybook aesthetic. The viewer's reaction: "I want to live in that snow-village." Output wraps with style prefix + suffix.

━━━ MANDATORY OUTPUT STRUCTURE — OPEN WITH THE CREATURE ━━━

The output MUST open with the creature + activity description, THEN describe the arctic-village spanning behind them. CREATURE-FIRST.

Open examples:
- "A chibi snow-fox kit mid-trot across a frozen-bridge with a knit-scarf trailing, behind them a snow-cottage village with warm-amber window-glow nestled in pine-trees..."
- "A baby polar-bear cub carrying a tiny lantern through fresh snow, an igloo cluster glowing turquoise behind them under shimmering aurora..."
- "A chibi child in a wool-coat hauling a sled stacked with firewood, a log-cabin hamlet with smoke curling from stone chimneys beyond..."

━━━ HARD RULE: VILLAGE FILLS THE FRAME — CREATURE IS A SMALL ANCHOR ━━━

The arctic-village architecture fills 70-85% of the frame — many cottages / igloos / log-cabins / snow-fortresses / lantern-posts all visible across foreground / midground / background. WIDE ESTABLISHING SHOT showing the whole snow-village ecosystem. The SOLO creature is a SMALL anchor (8-15% of frame) somewhere in the composition — on a snow-path, crossing a frozen-bridge, on a porch, in the foreground but NOT the focal hero of the frame. The viewer's eye first lands on the WHOLE VILLAGE, then discovers the tiny creature as a delightful detail. NOT a portrait. NOT close-up. The creature is a SCALE PROVER for the village, not a centered subject. ABSOLUTE REQUIREMENT: the creature MUST appear in the frame, but small.

━━━ THE FOREGROUND CREATURE ━━━
${creature}

━━━ THE CREATURE'S STORY ACTIVITY ━━━
${resident_activity}

━━━ THE ARCTIC-VILLAGE (spans behind the creature) ━━━
${village}

━━━ THREE ARCTIC-VILLAGE DETAILS (populate the village with lived-in richness) ━━━
${detailBlock}

━━━ MOVIE POSTER MOMENT — every render must be a frame-worthy still ━━━

Poster-worthy single frame. Pixar / Studio Ghibli / Frozen / Arrietty / Polar-Express framings. The creature mid-action in the lived-in arctic village. Composition: three-act depth (foreground creature with prop / midground snow-architecture / background atmospheric snow-haze + aurora or pine-trees). Saturated cozy-arctic palette (warm amber window-glow + cool snow-blue + aurora-violet/teal + soft cream-snow).

━━━ STORY BEAT — every render tells a STORY ━━━

The creature is MID-ACTION — pulling a sled, shoveling snow, carrying firewood, lighting a lantern, knocking snow from a roof, hauling a basket. NEVER posing. The story-beat is what makes it alive.

━━━ SPARKLE STACK — MAXIMUM COZY-ARCTIC EFFECTS ━━━

Layer ALL of these:
- Warm-amber WINDOW-GLOW from every cottage / cabin pouring out into the snow
- Aurora-violet/teal SHIMMER in the sky (optional, ~50% of renders)
- Fresh-snow texture catching light — sparkle, glitter, soft powder
- Smoke / steam curling from stone chimneys
- Frost-crystals on rooftops and trees
- Fairy-light strands or candy-cane-fence lanterns between cottages
- Drifting snowflakes catching light in warm window-rays
- Footprint / paw-print trails leading into the village
- Pine-bough wreaths on doors / jingle-bell garlands
- Knit-blanket on a porch-swing / sled parked at a cabin / wood-stack covered in snow
- Reflections of village lights on frozen-pond or icicle-strung roofs
- Layered atmospheric depth (snow-haze background + sharp midground village + foreground creature)
- Tiny glowing details (lit lanterns / candle-windows / glow-jars on porches)

━━━ CUTE + CUDDLY + COZY (NON-NEGOTIABLE) ━━━

"I want to live in that snow-village" longing. ALWAYS WARM-cozy despite the cold biome — warm amber window-glow beats cold exterior. Never grim, never bleak.

━━━ RENDERED CGI — Pixar painterly storybook ━━━

Modern Pixar register. Painterly subsurface scattering on snow, warm volumetric light from windows + aurora shimmer overhead, painterly bokeh. Chibi proportions.

━━━ NO DARK / NO ADULT HUMANS ━━━

Children OK from unified pool — render at chibi proportions, bundled in wool/knit winter-wear.

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ WEATHER ━━━
${weather}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SURPRISE ELEMENT (second-tier detail) ━━━
${surprise_element}${phenomenonBlock}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION (WIDE establishing shot — village fills frame, creature is small scale-prover) ━━━

WIDE ESTABLISHING SHOT. Camera pulled WAY back. The arctic-village fills 70-85% of the frame — multiple cottages / igloos / log-cabins / snow-fortresses visible at varying depths (foreground / midground / background), pine-trees or snowy-mountains framing. The creature is SMALL (8-15% of frame) somewhere in the composition — pulling a sled, crossing a frozen-bridge, on a porch, on a snow-path. NOT close-up. NOT centered portrait. NOT 40% of frame. The eye reads VILLAGE FIRST, then discovers the tiny creature. Think Studio Ghibli wide-shots of Howl's-Moving-Castle / Frozen-Arendelle-village / Polar-Express snow-towns. Three village-details visible across the architecture. Surprise element tucked in the deep midground.

━━━ OUTPUT FORMAT (MANDATORY) ━━━

Open with: "[creature description] [arctic-activity verb-phrase], [arctic-village description] spanning behind, [snow/aurora/window-glow lighting context]..."

Then unfold. Output ONLY the raw 90-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the phrases, opening with the creature.`;
  },


  CHIBIBOT_JUNGLE_VILLAGE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature,
      resident_activity,
      village,
      village_detail,
      time_of_day,
      surprise_element,
      phenomenon,
      lighting,
      atmosphere,
      weather,
    } = slots;
    const phenomenonFires = Math.random() < 0.6;
    const detailList = Array.isArray(village_detail) ? village_detail : [village_detail];
    const detailBlock = detailList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');
    const phenomenonBlock = phenomenonFires
      ? `\n\n━━━ ENVIRONMENTAL PHENOMENON (stack on top of everything else) ━━━\n${phenomenon}`
      : '';

    return `You are writing COZY JUNGLE-VILLAGE scenes for ChibiBot — a SOLO foreground creature doing a story-driven activity with a cozy rainforest village (treehouses / mushroom-houses / vine-bridges / canopy platforms / market plazas) spanning behind them. Studio Ghibli / Encanto / Princess-Mononoke / Avatar-Pandora-village painterly storybook aesthetic. The viewer's reaction: "I want to live in that village." Output wraps with style prefix + suffix.

━━━ MANDATORY OUTPUT STRUCTURE — OPEN WITH THE CREATURE ━━━

The output MUST open with the creature + activity description, THEN describe the jungle-village spanning behind them. CREATURE-FIRST.

Open examples:
- "A chibi toucan-creature mid-skip across a rope-bridge with a basket of star-fruit, behind them a treehouse village in a giant ceiba tree..."
- "A baby capybara hauling a bundle of palm-fronds up a vine-stair, a mushroom-house cluster glowing warm behind them..."
- "A chibi child carrying a clay pot of fresh tea across a moss-stone path, a market-plaza of leaf-roof huts beyond..."

━━━ HARD RULE: VILLAGE FILLS THE FRAME — CREATURE IS A SMALL ANCHOR ━━━

The jungle-village architecture fills 70-85% of the frame — many treehouses / huts / bridges / canopy-platforms / lantern-flowers all visible across foreground / midground / background. WIDE ESTABLISHING SHOT showing the whole village ecosystem. The SOLO creature is a SMALL anchor (8-15% of frame) somewhere in the composition — on a path, crossing a bridge, on a balcony, in the foreground but NOT the focal hero of the frame. The viewer's eye first lands on the WHOLE VILLAGE, then discovers the tiny creature as a delightful detail. NOT a portrait. NOT close-up. The creature is a SCALE PROVER for the village, not a centered subject. ABSOLUTE REQUIREMENT: the creature MUST appear in the frame, but small.

━━━ THE FOREGROUND CREATURE ━━━
${creature}

━━━ THE CREATURE'S STORY ACTIVITY ━━━
${resident_activity}

━━━ THE JUNGLE-VILLAGE (spans behind the creature) ━━━
${village}

━━━ THREE JUNGLE-VILLAGE DETAILS (populate the village with lived-in richness) ━━━
${detailBlock}

━━━ MOVIE POSTER MOMENT — every render must be a frame-worthy still ━━━

Poster-worthy single frame. Pixar / Studio Ghibli / Encanto / Pandora-village framings. The creature mid-action in the lived-in jungle village. Composition: three-act depth (foreground creature with prop / midground village architecture / background atmospheric canopy + dappled light). Saturated jungle-cozy palette (warm amber + emerald + teal + peach + magenta).

━━━ STORY BEAT — every render tells a STORY ━━━

The creature is MID-ACTION — carrying, pushing, climbing, sweeping, watering, delivering. NEVER posing. The story-beat is what makes it alive.

━━━ SPARKLE STACK — MAXIMUM COZY-JUNGLE EFFECTS ━━━

Layer ALL of these:
- Golden god-rays cutting through canopy
- Warm lantern-flower / firefly glow from village windows
- Drifting motes / pollen / dust in warm light
- Sparkle / dewdrop highlights on leaves / vines / roofs
- Subtle bokeh-orbs in atmospheric haze
- Smoke / steam wisps from chimneys / tea-pots
- Floating petals / leaves / pollen drifting
- Reflections on wet stone / water-features
- Layered atmospheric depth (canopy haze + village clarity + ground-distance)
- Tiny glowing details (lit lantern-flowers / firefly-jars / glow-mushrooms)
- Dew on every leaf
- Light leaks / lens flares from canopy gaps

━━━ CUTE + CUDDLY + COZY (NON-NEGOTIABLE) ━━━

"I want to live in that village" longing. Wholesome cottagecore-jungle-magic.

━━━ RENDERED CGI — Pixar painterly storybook ━━━

Modern Pixar register. Painterly subsurface scattering, warm volumetric god-rays through canopy, painterly bokeh. Chibi proportions.

━━━ NO DARK / NO ADULT HUMANS ━━━

Children OK from unified pool — render at chibi proportions.

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ WEATHER ━━━
${weather}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SURPRISE ELEMENT (second-tier detail) ━━━
${surprise_element}${phenomenonBlock}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION (WIDE establishing shot — village fills frame, creature is small scale-prover) ━━━

WIDE ESTABLISHING SHOT. Camera pulled WAY back. The jungle-village fills 70-85% of the frame — multiple buildings / bridges / platforms visible at varying depths (foreground / midground / background), the canopy arching above. The creature is SMALL (8-15% of frame) somewhere in the composition — crossing a bridge, climbing a vine-ladder, on a balcony, on a market path. NOT close-up. NOT centered portrait. NOT 40% of frame. The eye reads VILLAGE FIRST, then discovers the tiny creature. Think Studio Ghibli wide-shots of Howl's-Moving-Castle's town / Spirited-Away bathhouse / Whisper-of-the-Heart village. Three village-details visible across the architecture. Surprise element tucked in the deep midground.

━━━ OUTPUT FORMAT (MANDATORY) ━━━

Open with: "[creature description] [jungle-activity verb-phrase], [village description] spanning behind, [canopy/lighting context]..."

Then unfold. Output ONLY the raw 90-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the phrases, opening with the creature.`;
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

━━━ ABSOLUTELY BANNED (these break EarthBot identity instantly) ━━━

- NO multi-moons / twin-suns / triple-moons (Earth has ONE of each)
- NO cloud-leviathans / whale-shaped clouds / dragon-shaped clouds / serpentine sky-creatures
- NO time-suspension language ("frozen forever", "suspended in time", "eternal")
- NO arcane / magical / mystical / enchanted / ethereal / supernatural / otherworldly vocabulary
- NO bioluminescent fungi / glowworms / phosphorescent moss / glowing-anything-landscape
- NO floating-islands / impossible-physics geometry / Pandora-style alien biomes
- NO galaxies "above sunset" — stars + sunset don't co-exist on Earth (Milky Way only over pure-night sky)
- NO structures-as-subject (rare distant scale-prover huts OK as hero_feature, but never the focal subject)
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








  YUMBOT_FLORAL_GARDEN_CUP: ({ slots, sharedDNA, vibeDirective }) => {
    const { vessel, overflowing_flora, tabletop_scatter, frame_branches, palette, background, lighting } = slots;
    const floraList = Array.isArray(overflowing_flora) ? overflowing_flora : [overflowing_flora];
    const floraBlock = floraList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');
    const scatterList = Array.isArray(tabletop_scatter) ? tabletop_scatter : [tabletop_scatter];
    const scatterBlock = scatterList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');

    return `You are writing FLORAL-GARDEN-CUP renders for YumBot — bex.ai's signature look. A kawaii-faced VESSEL (teacup / takeout-cup / mug / bowl) OVERFLOWING with a magical garden of flowers. Painterly Pop-Mart-illustration-fusion register. Output wraps with style prefix + suffix.

━━━ ⚠ HARD RULE #1: KAWAII VESSEL OVERFLOWING WITH MAGICAL FLORA ━━━

The hero is a kawaii-faced vessel (cup / mug / bowl / takeout-cup with a smiling face printed on it — dimpled-blush, closed-arc eyes). Out of the TOP of the vessel BURSTS an oversized magical bouquet of flowers — like a giant flower-arrangement spilling out impossibly. The flora is OVERSIZED relative to the vessel — the bouquet is bigger than the cup itself. This is the wow-moment: a kawaii drink that's also a flower-vase.

━━━ ⚠ HARD RULE #2: NO CREATURES — FOOD/VESSEL IS THE CAST ━━━

NO chibi creatures, NO humans, NO animals — just the kawaii-faced vessel with its overflowing magical bouquet. Cherry-blossom branches and tabletop-scatter can include florals but never living animals or characters.

━━━ ⚠ HARD RULE #3: PAINTERLY-ILLUSTRATION FUSION ━━━

This is NOT a flat product-shot. The render fuses Pop-Mart designer-vinyl glossy 3D-CGI with painterly-illustration warmth (Studio Ghibli + bex.ai + Disney-Tangled storybook texture). Glossy pearlescent vessel + painterly-textured flowers + dreamy soft-focus background. Imagine the flowers were hand-painted in oil/gouache while the vessel was CGI-rendered.

━━━ THE KAWAII VESSEL (with smiling face) ━━━
${vessel}

━━━ FOUR OVERFLOWING FLORA ELEMENTS (spilling out of vessel — multi-bloom bouquet) ━━━
${floraBlock}

━━━ FRAMING CHERRY-BLOSSOM BRANCHES (arching from upper-corner(s) into the frame) ━━━
${frame_branches}

━━━ THREE TABLETOP SCATTER (pearls / berries / petals / pastel-balls around the vessel base) ━━━
${scatterBlock}

━━━ COLOR PALETTE (dominant 3-4 pastel colors for this render) ━━━
${palette}

━━━ BACKGROUND MOOD (dreamy pastel garden bokeh — NOT a recognizable setting) ━━━
${background}

━━━ LIGHTING ━━━
${lighting}

━━━ SPARKLE STACK — FLORAL-GARDEN-CUP ━━━

Layer ALL on EVERY render:
- Glossy pearlescent finish on the kawaii vessel
- Painterly-textured flowers with hand-painted oil/gouache strokes visible
- Cherry-blossom-petal-rain drifting through the air
- Dewdrops on petals catching warm-pastel light
- Soft pastel-bokeh background fading to dreamy haze
- Floating sparkle-dust + magical pollen-motes around the bouquet
- Translucent glow within some of the petals (subsurface scattering)
- Tiny butterflies or floating pearl-orbs hovering optionally
- Iridescent shimmer on dewy petals
- Warm-pastel rim-light catching the vessel's edges
- Soft volumetric pastel-light pouring down from above
- Painterly background brushstroke-texture (not perfectly smooth — slight visible painterliness)

━━━ MOVIE POSTER MOMENT ━━━

The viewer's reaction: "WAIT, the cup is OVERFLOWING with flowers — that's so magical." This is wallpaper-poster bex.ai signature work. Single frame quality.

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ HARD BANS ━━━
- NO real chibi creatures / characters / humans / animals
- NO flat product-shot composition — must have OVERFLOWING bouquet bigger than the vessel
- NO modern decor / phones / tech
- NO scary / dark / moody

━━━ OUTPUT FORMAT (MANDATORY) ━━━

Open with: "[kawaii-faced vessel description — cup/mug/bowl with smiling face + decorative pattern detail], OVERFLOWING with [bouquet description naming the specific flora pieces from above], cherry-blossom branches [arching in], pastel pearls + [tabletop scatter] scattered at the base, dreamy pastel-bokeh background, painterly Pop-Mart-illustration-fusion rendering..."

Output ONLY the raw 100-140 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. The bouquet's painterly-flower texture and impossible overflow must read CLEARLY.`;
  },

  YUMBOT_RAINBOW_DREAMSCAPE: ({ slots, sharedDNA, vibeDirective }) => {
    const { food_inhabitants, dreamscape_setting, rainbow_element, sky_atmosphere, environment, decor, camera, lighting } = slots;
    const decorList = Array.isArray(decor) ? decor : [decor];
    const decorBlock = decorList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');
    const envList = Array.isArray(environment) ? environment : [environment];
    const envBlock = envList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');

    return `You are writing RAINBOW-DREAMSCAPE renders for YumBot — bex.ai's wider scenic look. 3-7 MIXED kawaii food-creatures (cups + desserts + savory) inhabiting a lush pastel dreamscape with streams / ponds / trails / rocks / trees + rainbows. Output wraps with style prefix + suffix.

━━━ ⚠ HARD RULE #1: 3-7 MIXED KAWAII FOOD-CREATURES LIVING IN THE LANDSCAPE ━━━

The kawaii smiling foods (3-7 of them, MIXED types — boba-cups + cupcakes + donuts + cake-pops + macarons + sundaes + pancakes + mochi + onigiri + crepes + parfaits + waffles + croissants + cinnamon-rolls + fruit-tarts + cheesecake + churros + taiyaki + dango + cream-puffs + popsicles + etc.) are SITTING IN a pastel outdoor environment — like creature-inhabitants of a dream-world. NOT on a tabletop. NOT a flat product-shot. They are nestled IN grass / on rocks / beside streams / on trails / under trees — like little food-creatures who LIVE there.

⚠ VARIETY — never repeat the same food. Mix DRINKS + DESSERTS + occasionally SAVORY. Mix HEIGHTS (tall cups + short donuts + medium cupcakes). The variety is the signature.

━━━ ⚠ HARD RULE #2: RAINBOW IS A CENTRAL VISUAL ELEMENT ━━━

A RAINBOW must be visible. Either (a) pouring out of a cup like spillover, OR (b) arching across the sky, OR (c) cascading down from a cup onto the ground. The rainbow is part of the magic — a literal visible rainbow.

━━━ ⚠ HARD RULE #3: LUSH OUTDOOR ENVIRONMENT — VISIBLE ENVIRONMENTAL FEATURES MANDATORY ━━━

The dreamscape MUST have SUBSTANTIAL environmental features VISIBLY RENDERED: winding pastel streams, glassy pastel ponds, mossy trails, pastel-rocks/boulders, pastel-trees, footbridges, hills. The 3 environmental_features below MUST be CLEARLY VISIBLE — water reflecting, trees with foliage, rocks with moss, paths winding. NOT abstract or implied — concretely rendered.

⚠ The landscape feels INHABITED — like the kawaii foods live in a real outdoor place with water and trees and rocks and paths, NOT floating on a flat surface or sitting on a table.

⚠ HARD BAN — TABLETOP RENDERING: NO tabletop / table / counter / flat-surface composition. NO bokeh-only-background without environmental features. The foods are sitting in NATURE — on grass / on rocks / beside a stream / on a trail / among trees / on moss / on a hillside. If the scene reads as a "tabletop product-shot," it has FAILED.

━━━ ⚠ HARD RULE #4: WIDER LUSH SCENIC COMPOSITION ━━━

Pull the camera back to show the dreamscape landscape with rich environmental detail. The kawaii food-creatures occupy 30-45% of the frame; the lush landscape + environmental features + sky fill the rest. Cherry-blossom mountains in distance + hot-air-balloons + sunny pastel sky framing above. The viewer's reaction: "they LIVE in this lush dreamy world with streams and trees and rainbows."

━━━ THE KAWAII FOOD INHABITANTS (3-7 mixed kawaii foods sitting in the scene) ━━━
${food_inhabitants}

━━━ THE DREAMSCAPE SETTING ━━━
${dreamscape_setting}

━━━ THE RAINBOW ELEMENT (specific to this render) ━━━
${rainbow_element}

━━━ THE SKY + ATMOSPHERE ━━━
${sky_atmosphere}

━━━ THREE ENVIRONMENTAL FEATURES (streams / ponds / trails / rocks / trees / bridges — MUST appear in the render) ━━━
${envBlock}

━━━ THREE DECOR ELEMENTS (cherry-blossom branches / butterflies / mushrooms / wildflowers / dewdrops) ━━━
${decorBlock}

━━━ CAMERA COMPOSITION ━━━
${camera}

━━━ LIGHTING ━━━
${lighting}

━━━ SPARKLE STACK — RAINBOW-DREAMSCAPE ━━━

Layer ALL on EVERY render:
- Glossy pearlescent finish on the kawaii cups
- Vivid rainbow gradient (literal rainbow band)
- Painterly grass / meadow / hillside with hand-painted texture
- Cherry-blossom-petal-rain drifting
- Hot-air-balloons or pastel-balloons floating in deep sky
- Pastel cherry-blossom-mountains in distance
- Sunny pastel sky — pink-and-blue gradient
- Butterflies fluttering optionally
- Dewdrops on grass + floating pearl-orbs
- Tiny scattered pastel flowers throughout the meadow
- Soft volumetric pastel sunlight pouring across the scene
- Painterly-illustration-fusion register (NOT flat product-shot)

━━━ MOVIE POSTER MOMENT ━━━

The viewer's reaction: "OMG those kawaii cups are LIVING IN A RAINBOW-MEADOW — they're like meadow-creatures." Wallpaper-poster bex.ai signature work.

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ HARD BANS ━━━
- NO chibi creatures / characters / humans / animals (only kawaii FOOD as inhabitants)
- NO solo / single food (must be 3+ MIXED kawaii foods)
- NO repetitive same-food groups (variety is mandatory)
- NO tabletop / indoor product-shot composition
- NO dark / moody / scary scenes
- NO industrial / modern setting
- NO empty / sparse meadow (must have streams / trees / rocks visible)

━━━ OUTPUT FORMAT (MANDATORY) ━━━

LEAD WITH THE LANDSCAPE FIRST so Flux locks onto the outdoor setting before composing foods. Open with the landscape + environmental features, THEN drop in the kawaii foods as inhabitants, THEN sky + rainbow + decor.

Open with: "Wider scenic outdoor shot of a pastel [dreamscape setting] with [environmental feature 1 — stream/pond/trail/etc.] winding through and [environmental feature 2 — trees/rocks/etc.] alongside, [environmental feature 3] in midground — and nestled in the meadow, [3-7 mixed kawaii foods named specifically], [rainbow element], pastel-mountains and [sky element] in distance, cherry-blossom branches arching, [decor scattered], painterly Pop-Mart-illustration-fusion rendering, sunny pastel light..."

⚠ The first 30 words MUST establish the outdoor landscape with concrete environmental features before mentioning the foods. Locks Flux on the dreamscape.

Output ONLY the raw 110-160 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. The lush outdoor landscape + 3-7 mixed kawaii foods + visible environmental features + literal rainbow must ALL read CLEARLY.`;
  },

  YUMBOT_CHECKERED_TABLETOP: ({ slots, sharedDNA, vibeDirective }) => {
    const { vessel_hero, mini_creature_pile, tablecloth, scattered_minis, decor_clusters, camera, lighting } = slots;
    const minisList = Array.isArray(scattered_minis) ? scattered_minis : [scattered_minis];
    const minisBlock = minisList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');
    const clusterList = Array.isArray(decor_clusters) ? decor_clusters : [decor_clusters];
    const clusterBlock = clusterList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');

    return `You are writing CHECKERED-TABLETOP renders for YumBot — bex.ai's signature pastel-gingham tabletop look. Kawaii food/drink hero on a pastel-pink-blue (or pink-cream / pink-yellow) GINGHAM/CHECKERED/PLAID tablecloth, with a cluster of smiling mini-food-friends piled around (and often ON TOP of) the hero. Output wraps with style prefix + suffix.

━━━ ⚠ HARD RULE #1: PASTEL CHECKERED/GINGHAM TABLECLOTH ━━━

The surface is a PASTEL CHECKERED / GINGHAM / PLAID tablecloth — pastel pink + soft blue is most common, but variations include pink + yellow / pink + cream / pink + mint. The checker pattern is CLEARLY visible across the surface. This is the signature backdrop.

━━━ ⚠ HARD RULE #2: KAWAII VESSEL HERO + MINI-FRIEND PILE ON TOP ━━━

The hero is a kawaii-faced food/drink (boba-cup / hot-cocoa-mug / teapot / sundae) — with its own smiling face. AND piled ON TOP of the hero (sitting in the foam / on the rim / inside the cup poking out) is a cluster of mini smiling-creature-food-friends — mini-mochi-balls / mini-smiling-strawberry / smiling-cookie / mini-cream-puffs / smiling-marshmallow-balls. The cluster ON TOP is the signature wow.

━━━ ⚠ HARD RULE #3: SCATTERED MINI-FRIENDS ON THE TABLECLOTH ━━━

Across the gingham tablecloth around the hero, scatter 5 specific kawaii mini-foods/treats (smiling cookies, smiling stars, smiling fruits, hearts, candies, mini-cubes). The render reads like a kawaii-sticker-card or Pop-Mart-collectible-tableau.

━━━ THE KAWAII VESSEL HERO (smiling-face drink/food centerpiece) ━━━
${vessel_hero}

━━━ MINI-CREATURE PILE ON TOP OF HERO (smiling-food-friends sitting on/in the hero) ━━━
${mini_creature_pile}

━━━ TABLECLOTH PATTERN ━━━
${tablecloth}

━━━ FIVE SCATTERED MINIS (across the tablecloth around the hero) ━━━
${minisBlock}

━━━ TWO DECOR CLUSTERS (mini-macaron stack / mini-marshmallow pile / sugar-pieces / chocolate-clusters) ━━━
${clusterBlock}

━━━ CAMERA COMPOSITION ━━━
${camera}

━━━ LIGHTING ━━━
${lighting}

━━━ SPARKLE STACK — CHECKERED-TABLETOP ━━━

Layer ALL on EVERY render:
- Glossy pearlescent finish on every kawaii food
- Pastel gingham/checkered tablecloth clearly visible
- Hero vessel centered with multi-smiling-creature pile on top
- 5 scattered mini-smiling-foods on the tablecloth around the hero
- Mini-macaron / mini-marshmallow decor clusters
- Soft cherry-blossom petals occasionally drifting in
- Cream-and-glaze drips on the hero food
- Tiny pearl-beads or sugar-glitter scattered
- Soft pastel ambient daylight
- Painterly Pop-Mart designer-vinyl glossy surfaces
- Slight floating-air sparkle around the cluster
- Pastel sticker-card or collectible-tableau register

━━━ MOVIE POSTER MOMENT ━━━

The viewer's reaction: "this looks like a kawaii Pop-Mart sticker-card or designer collectible photo." Wallpaper-poster bex.ai signature work.

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ HARD BANS ━━━
- NO chibi creatures / humans / real animals (only smiling food-creatures and food-friends)
- NO dark / moody / scary
- NO outdoor scenic (that's rainbow-dreamscape)
- NO overflowing-flora-from-cup (that's floral-garden-cup)
- NO solid-pastel backdrop without checker pattern — pattern MUST be visible

━━━ OUTPUT FORMAT (MANDATORY) ━━━

Open with: "Pastel [pink/blue/cream/yellow] gingham/checkered tablecloth fills the surface, [kawaii vessel hero centerpiece with its smiling face], with [mini-creature pile on top — naming specific mini-faces], [scattered minis named across the tablecloth], [decor clusters], painterly Pop-Mart designer-vinyl pearlescent rendering, soft pastel daylight..."

Output ONLY the raw 100-140 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. The gingham/checkered pattern + mini-friend-pile-on-top must read CLEARLY.`;
  },


};

module.exports = TEMPLATES;
