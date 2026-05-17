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
};

module.exports = TEMPLATES;
