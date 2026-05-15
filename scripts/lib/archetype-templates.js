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
};

module.exports = TEMPLATES;
