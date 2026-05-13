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
"epic futuristic cyberpunk megacity, anime cinematic keyframe illustration, ultra-detailed skyline stretching endlessly into the horizon, towering neon skyscrapers stacked in vertical layers, glowing holographic billboards, dense glowing signage in japanese kanji and futuristic alien glyphs, rain-soaked or steam-soaked streets reflecting neon light, flying cars and hovering taxi traffic streams, illuminated skybridges connecting buildings, massive industrial pipes and ventilation systems, rooftop markets and crowded alleyways, glowing windows everywhere, thousands of tiny lights, atmospheric fog and steam rising between buildings, volumetric light beams, vibrant neon color palette (magenta, cyan, electric blue, purple, gold), extreme detail saturation, bustling city life, tiny dark figures of people on balconies, distant megastructures disappearing into haze, sharp anime linework, rich shading, high contrast lighting, dramatic anime lighting, masterpiece quality, insanely detailed, no blur, no empty areas, every surface covered in detail."

These are MANDATORY core descriptors. The Sonnet polish must include language matching these themes throughout the prompt.

━━━ THE SUBJECT IS A VAST IMPRESSIVE CYBERPUNK CITY — NON-NEGOTIABLE ━━━
The CITY itself is the hero — a sprawling, dense, ALIVE alien-cyberpunk megacity that feels overwhelming in scope. Multiple impressive buildings throughout the frame, each at different distances, each contributing to a UNIFIED sense of "this city is incredible." NOT a single weird centered building dominating the frame.

━━━ THE FEATURED LANDMARK (one building among many) ━━━
${setting}

This is ONE notable building in the city — not THE subject, but A LANDMARK. It should be visible and recognizable, occupying ~25-35% of the frame at most. The city around it is equally impressive — multiple OTHER cool towers / habitat blocks / megabuildings at different distances, each carrying their own character. NEVER let the featured landmark visually dominate as a singular weird structure. It is one cool building in a city of cool buildings.

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
The camera is INSIDE the city — pick ONE:
(A) **STREET LEVEL looking UP** at the featured building at a dramatic upward angle. Camera at sidewalk / plaza / skybridge / rooftop-pedestrian-level. Tilt up. Building looms above. Surrounding city visible at street level around the camera (other tower bases, signage, traffic, pedestrians, vehicles passing).
(B) **MIDWAY UP looking ACROSS** at the featured building from another building's balcony / window / terrace / skybridge. Camera at 100-300m elevation. The featured building's mid-section fills the frame, surrounded by other towers at similar heights, with flying vehicles / drones passing between buildings at the camera's level.

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

  STARWARS_LANDSCAPE: ({ slots, sharedDNA, vibeDirective }) => {
    const { story_beat, composition_frame, emotional_dna, lighting, weather_particulate, biome, anchor_entity, moment, deep_distance } = slots;

    return `You are a sci-fi concept-art painter writing a STAR-WARS-CODED PLANET VISTA for StarBot — George-Lucas / Ralph-McQuarrie / Doug-Chiang painted-matte production-art tradition. LIVED-IN DIRTY-FUTURE USED-COSMOS mood. The galaxy feels old, weathered, real.

━━━ THE LANDSCAPE IS THE SUBJECT — NON-NEGOTIABLE ━━━
Wide cinematic landscape, painted-matte feel. The biome is the hero. Witness is small for scale. Sky DOMINATES 50-70% of frame in atmospheric grandeur.

━━━ LIVED-IN DIRTY-FUTURE — THE STAR WARS SIGNATURE ━━━
The world is OLD and USED. Surfaces are weathered, dusty, rusted. Vehicles look beat-up. Buildings have repair-history. NEVER pristine. NEVER clean futurism (that's Mass Effect). The galaxy is far from new — it's a galaxy where things have HISTORY.

━━━ ICONIC BIOME CATALOG ━━━
Each rolled biome lands somewhere in: twin-sun desert (Tatooine-coded) / redwood-moon canopy (Endor-coded) / lava hellscape (Mustafar-coded) / city-planet sky (Coruscant-coded but landscape-side) / cloud-city floating (Bespin-coded) / ice plain (Hoth-coded) / lake country (Naboo-coded) / shipwreck junkyard desert (Jakku-coded) / coastal moon (Kashyyyk-coded forest).

━━━ ONE SMALL WITNESS — for scale ━━━
${anchor_entity}

Witness is SMALL — silhouette proving scale. Lived-in: dust-trail behind landspeeder / wind-blown robes / weathered staff. EXACTLY ONE.

━━━ WHAT THE WITNESS IS DOING — candid moment ━━━
${moment}

Small grounded action — moisture-farmer at vaporator / trader leading pack-beast / scavenger with staff.

━━━ THE BIOME (render this exact landscape) ━━━
${biome}

Render every iconic detail — the biome's signature character + lived-in weathering + atmospheric depth.

━━━ DEEP-DISTANCE SIGNATURE — receding through dust-haze ━━━
${deep_distance}

Render at the deepest layer — distant capital ship / walker silhouette / sandcrawler / temple ruin / cantina silhouette / planet ring overhead.

━━━ McQUARRIE / CHIANG PAINTED-MATTE STYLE ━━━
Painted production-painting feel. Atmospheric perspective rendered in pigment. Foreground textural specificity. Lived-in surface treatment everywhere. Color palette skews twin-sun amber / desert-rose / dusk-violet / oxblood-shadow / Endor-forest-green / Mustafar-volcanic-orange / Hoth-ice-cyan.

━━━ STORY BEAT (interpret at lived-in galactic scale) ━━━
${story_beat}

Translate at frontier-galactic scale: ARRIVAL = ship descending against twin-sun sunset. VIGIL = moisture-farmer watching horizon. SOLITUDE = empty dune sea. CONFRONTATION = patrol meeting at outpost crossroads.

━━━ COMPOSITION FRAME ━━━
${composition_frame}

━━━ LIGHTING ━━━
${lighting}

Twin-sun-raking light, golden-hour rake, dusk-violet, dawn-amber, polar-glare, lava-spectrum red-orange. Name the time-of-day.

━━━ WEATHER / PARTICULATE ━━━
${weather_particulate}

Dust-haze, sand-trail, ash-fall, ice-mist — lived-in atmospheric particles.

━━━ EMOTIONAL DNA ━━━
${emotional_dna}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

Lived-in palette: weathered tan / oxblood / amber-rust / dusk-violet / Endor-green / Hoth-ice-cyan / Mustafar-volcanic-orange.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION ━━━
Wide cinematic landscape. Sky dominates 50-70%. Painted-matte production feel. FOREGROUND: textural detail (sand-trail, rust-burned debris, weathered rock). MIDGROUND: biome body + small witness in profile. DEEP DISTANCE: signature feature through dust-haze. Camera HIGH and WIDE.

━━━ FRANCHISE BAN — ABSOLUTE ━━━
NEVER write "Tatooine", "Coruscant", "Hoth", "Endor", "Naboo", "Mustafar", "Kashyyyk", "Jakku", "Kamino", "Bespin", "Jedi", "Sith", "Empire", "Rebellion", "Death Star", "Star Wars", "Mandalorian" in the output. Use only generic descriptive language of the iconic biome.

━━━ FORBIDDEN ━━━
- NO centered foreground large figure
- NO pristine clean futurism — must be LIVED-IN weathered
- NO crowds — exactly one witness
- NO lightsabers, NO laser-blaster effects

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  STARCRAFT_LANDSCAPE: ({ slots, sharedDNA, vibeDirective }) => {
    const { story_beat, composition_frame, emotional_dna, lighting, weather_particulate, biome, anchor_entity, moment, deep_distance } = slots;

    return `You are a sci-fi concept-art painter writing a STARCRAFT-CODED PLANET VISTA for StarBot — Blizzard / Sam-Didier / Glenn-Rane / Trent-Kaniuga concept-art tradition. Three faction-coded biomes with STRONG faction-color identity readable in 2 seconds.

━━━ THE LANDSCAPE IS THE SUBJECT — NON-NEGOTIABLE ━━━
Wide cinematic landscape. The world is the hero. Witness is small for scale. Strong faction-color signature dominates the palette.

━━━ THREE FACTION CODES — pick from the rolled biome's specific code ━━━
- TERRAN: rust-orange industrial wasteland, weathered mining rig, blast-burned military structure, dust-storm haze, grit-grain texture — Wild-West-in-space frontier aesthetic
- PROTOSS: gold-blue-purple crystalline psionic vista, gravity-defying spire structures, glowing energy-thread foliage, sacred geometry, ancient warrior-priest tone
- ZERG: red-purple organic-biomech wasteland, creep-spread coverage, fleshy-tendril growth, chitinous tower-fauna, parasitic alien hostility

The biome pool entry specifies which faction's world. Lock the faction palette and aesthetic accordingly.

━━━ ONE SMALL WITNESS — for scale ━━━
${anchor_entity}

Witness is SMALL — silhouette proving the world's scale.

━━━ WHAT THE WITNESS IS DOING — candid moment ━━━
${moment}

Small action — soldier scanning / scout climbing / observer pointing / industrial worker tending.

━━━ THE BIOME (render this exact landscape) ━━━
${biome}

Render every faction-specific detail — Terran prefab structures and rust-stained surfaces / Protoss gold-crystalline spires and energy-glow / Zerg organic-biomech growth and creep-spread.

━━━ DEEP-DISTANCE SIGNATURE — receding through atmosphere ━━━
${deep_distance}

Render the franchise's signature far-back element — distant mining rig / gold-crystalline tower / biomech tower-fauna / capital ship hovering / shipyard silhouette.

━━━ BLIZZARD CONCEPT-ART STYLE ━━━
Painted concept-art mood. Strong saturated color signature per faction. Dramatic atmospheric perspective. Detail-dense foreground. Bold silhouettes. Frame-worthy production-painting quality.

━━━ STORY BEAT (interpret at faction-vista scale) ━━━
${story_beat}

━━━ COMPOSITION FRAME ━━━
${composition_frame}

━━━ LIGHTING ━━━
${lighting}

Faction-coded lighting — Terran harsh-amber dustlight / Protoss gold-shaft psionic radiance / Zerg blood-orange volcanic-glow under-purple-haze.

━━━ WEATHER / PARTICULATE ━━━
${weather_particulate}

━━━ EMOTIONAL DNA ━━━
${emotional_dna}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

Locked to faction: rust-orange-grit (Terran) / gold-blue-purple (Protoss) / red-purple-organic (Zerg). Pick the dominant from the rolled biome.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION ━━━
Wide cinematic landscape. FOREGROUND: faction-coded textural detail (rust-burned metal / gold-crystal cluster / fleshy creep tendril). MIDGROUND: biome body + small witness in profile. DEEP DISTANCE: faction-signature feature receding into atmosphere. Bold saturated faction palette.

━━━ FRANCHISE BAN — ABSOLUTE ━━━
NEVER write "Terran", "Protoss", "Zerg", "Kerrigan", "Raynor", "Aiur", "Char", "Mar Sara", "Korhal", "Battlecruiser", "Khaydarin", "Starcraft" in the output. Use generic descriptions of the visual language.

━━━ FORBIDDEN ━━━
- NO centered foreground large figure
- NO mixing faction palettes — each render commits to ONE faction signature
- NO crowds — exactly one witness

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  STARTREK_LANDSCAPE: ({ slots, sharedDNA, vibeDirective }) => {
    const { story_beat, composition_frame, emotional_dna, lighting, weather_particulate, biome, anchor_entity, moment, deep_distance } = slots;

    return `You are a sci-fi concept-art painter writing a STAR-TREK-CODED PLANET VISTA for StarBot — Andrew-Probert / Rick-Sternbach / classic-Star-Trek painted-matte tradition (TNG / DS9 / Voyager / Discovery era concept art). Each world reads as a distinct COLOR-CODED species/empire aesthetic at first glance.

━━━ THE LANDSCAPE IS THE SUBJECT — NON-NEGOTIABLE ━━━
Wide cinematic landscape OR claustrophobic mechanical interior depending on world. Strong species/empire color signature readable in 2 seconds. Painted-matte concept-art mood. NO foreground figures dominating.

━━━ COLOR-CODED EMPIRE LANGUAGE — THE STAR TREK SIGNATURE ━━━
Each world has its color identity at a glance:
- Red-rust temple-world (Vulcan-coded austere logic)
- Orange-stone monastery-cliff (Bajoran-coded spiritual)
- Tropical paradise pleasure-planet (Risa-coded indulgent)
- Matte-black-green Borg-cube-station mechanical (Borg-coded mechanical horror)
- Volcanic forge warrior-empire homeworld (Klingon-coded martial)
- White-and-bronze classical-future Federation colony (Federation-coded optimistic)
- Green-bronze Romulan-style ringed empire (Romulan-coded secretive)
- Bone-rust military station decay (Cardassian-coded oppressive)
- Pastoral farming planet (rustic generic-Trek)

Pick from the rolled biome's specific color/empire code.

━━━ ONE SMALL WITNESS — for scale ━━━
${anchor_entity}

This witness is SMALL — silhouette proving scale. EXACTLY ONE. Never crowds.

━━━ WHAT THE WITNESS IS DOING — candid moment ━━━
${moment}

Small grounded action — pilgrim climbing temple steps / observer at canyon rim / agricultural worker tending field.

━━━ THE BIOME (render this exact landscape) ━━━
${biome}

Render every detail — the world's specific architectural language, materials, color palette, time of day.

━━━ DEEP-DISTANCE SIGNATURE — receding through atmospheric perspective ━━━
${deep_distance}

Render at deepest layer — temple-spire / forge-city / orbital ring / Cardassian-style station.

━━━ STORY BEAT (interpret at painted-matte scale) ━━━
${story_beat}

Translate at classical-matte scale: ARRIVAL = pilgrim approaching temple complex. VIGIL = sentinel watching from monastery balcony. SOLITUDE = empty agricultural plain. CONFRONTATION = patrol meeting at gate.

━━━ COMPOSITION FRAME ━━━
${composition_frame}

━━━ LIGHTING ━━━
${lighting}

Painted-matte color treatment — strong color signature per world. Sun-spectrum dialed warm or cold per empire. Never garish.

━━━ WEATHER / PARTICULATE ━━━
${weather_particulate}

━━━ EMOTIONAL DNA ━━━
${emotional_dna}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

Palette is empire-coded — red-rust / orange-stone / matte-black-green / white-and-bronze / bone-rust / green-bronze / volcanic-orange.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION ━━━
Wide cinematic landscape. FOREGROUND: textural detail (architectural ornament / temple stone / cropland row / mechanical strut). MIDGROUND: the biome body + small witness in profile. DEEP DISTANCE: signature feature receding through atmospheric perspective. Painted-matte production-painting feel.

━━━ FRANCHISE BAN — ABSOLUTE ━━━
NEVER write "Vulcan", "Klingon", "Romulan", "Cardassian", "Bajoran", "Federation", "Starfleet", "Borg", "Trill", "Risa", "Deep Space Nine", "Enterprise", "Picard", "Spock", "Star Trek" in the output. Render the visual language only.

━━━ FORBIDDEN ━━━
- NO centered foreground large figure
- NO modern Earth-coded architecture
- NO crowds — exactly one witness
- NO franchise nouns

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  MASS_EFFECT_ARCHITECTURE: ({ slots, sharedDNA, vibeDirective }) => {
    const { story_beat, composition_frame, emotional_dna, lighting, setting, atmosphere, deep_distance, incident } = slots;

    const incidentSection = incident
      ? `
━━━ INCIDENT — render this visibly active ━━━
${incident}

Clean-futurism event woven into the scene. Mass-effect-field activation / biotic surge / holo-conference / defense-field test. Controlled, never chaotic.

`
      : '';

    return `You are a sci-fi concept-art painter writing a MASS-EFFECT-CODED ARCHITECTURE INTERIOR for StarBot — BioWare / Sparth / Matt-Rhodes tradition. CLEAN-FUTURE-MEETS-DISTINCT-ALIEN. Each species/world has its own architectural language. CONTROLLED PALETTES — never gaudy.

━━━ MOOD — NON-NEGOTIABLE ━━━
CLEAN + ELEGANT + ALIEN-DISTINCT. Holographic UI panels glow soft blue. Biotic-energy ribbons curl through space. Neural-link cabling arcs in elegant loops. Mass-effect-field shimmer at thresholds. The architecture is sleek, intentional, ALIEN — never gritty (Aliens) or grim (Star Wars) or extravagant (Guardians).

━━━ NO FIGURES — ABSOLUTE ━━━
Pure architecture. NO Shepard, NO Garrus, NO Tali, NO Krogan, NO geth-as-figures, NO foreground ships. Empty interior reads through architectural language + holo-elements + light.

━━━ THE ARCHITECTURE (render this exact interior) ━━━
${setting}

Each interior has SPECIFIC architectural language — Citadel-style flowing curves / Krogan-coded weathered military / Quarian-style modular and patched / Asari-coded crystalline organic / Salarian-precise lab interior / Cerberus-style sterile lab. Honor the species/world the pool entry encodes.

━━━ ATMOSPHERIC TEXTURE — controlled-color signature ━━━
${atmosphere}

━━━ DEEP-DISTANCE SIGNATURE — receding through clean atmospheric depth ━━━
${deep_distance}

The far layer adds intentional depth — sleek tower-spire receding / observation glass with planet beyond / massive holo-projection at far end / data-pillar core extending through chamber.
${incidentSection}
━━━ CONTROLLED COLOR — THE MASS EFFECT SIGNATURE ━━━
Controlled blues (Citadel cyan), oranges (Krogan amber), purples (Asari violet), greens (Salarian / Quarian), whites (Cerberus sterile). NEVER gaudy. NEVER rainbow saturation. ONE dominant color per frame with controlled accent palette.

━━━ STORY BEAT (interpret at clean-future scale) ━━━
${story_beat}

Translate at sleek-future scale: ARRIVAL = mass-effect-field threshold cycling open. VIGIL = empty observation deck with planet beyond glass. SOLITUDE = vast chamber with holo-projection. CONFRONTATION = defense-field active at threshold.

━━━ COMPOSITION FRAME ━━━
${composition_frame}

━━━ LIGHTING ━━━
${lighting}

Cool ambient (Citadel-blue / Asari-violet / Salarian-green) with ONE warm accent. Holographic UI casts soft glow. Mass-effect-field shimmer at thresholds. Never harsh fluorescent.

━━━ EMOTIONAL DNA ━━━
${emotional_dna}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION ━━━
Clean-future architectural composition. FOREGROUND: tactile sleek detail (holo-panel edge, biotic-cable, sleek alloy threshold, translucent partition). MIDGROUND: architecture body — chamber / lab / observation deck / bridge / hub. DEEP DISTANCE: signature feature receding through controlled atmospheric depth.

━━━ FRANCHISE BAN — ABSOLUTE ━━━
NEVER write "Citadel", "Normandy", "Tuchanka", "Thessia", "Reaper", "Sovereign", "Geth", "Quarian", "Krogan", "Asari", "Salarian", "Cerberus", "Mass Effect", "Shepard", "Garrus", "Tali", "Wrex" in the output. Use generic descriptive language only.

━━━ FORBIDDEN ━━━
- NO foreground figures
- NO gaudy rainbow saturation — controlled palette only
- NO industrial grit — clean futurism only
- NO chaotic crowds or commotion

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  HALO_LANDSCAPE: ({ slots, sharedDNA, vibeDirective }) => {
    const { story_beat, composition_frame, emotional_dna, lighting, weather_particulate, biome, anchor_entity, moment, deep_distance } = slots;

    return `You are a sci-fi concept-art painter writing a HALO-CODED LANDSCAPE for StarBot — Bungie / 343-Industries / Sparth / Pat-Rawlings / Eddie-Smith concept-art tradition. Vast cinematic alien-world vista. The RING-INSTALLATION ARC visible across the sky is the franchise signature.

━━━ THE LANDSCAPE IS THE SUBJECT — NON-NEGOTIABLE ━━━
Wide cinematic vista. The world fills the frame. Witness is small for scale — proves the world's scale, never dominates.

━━━ MOOD RANGE ━━━
Each render lands somewhere on the spectrum: SACRED-ANCIENT (precursor-megalith calm) → MILITARY-INDUSTRIAL (frontier base grit) → BIBLICAL-RINGWORLD (vast ring-arc awe). The mood is determined by the rolled biome's specific character.

━━━ ONE SMALL WITNESS — for scale ━━━
${anchor_entity}

This witness is SMALL — silhouette in midground-back proving scale. EXACTLY ONE. Never crowds.

━━━ WHAT THE WITNESS IS DOING — candid moment ━━━
${moment}

Small grounded action — boots on terrain. NEVER hero posing.

━━━ THE BIOME (render this exact landscape) ━━━
${biome}

Render every detail of the biome's specific character — ringworld inner-surface curve / Forerunner-style precursor stone / military prefab outpost / volcanic wasteland / alpine plateau / dropship-staging plain / coastal megastructure.

━━━ DEEP-DISTANCE SIGNATURE — THE RING-ARC IS THE HALO HALLMARK ━━━
${deep_distance}

Render at the deepest layer — receding through atmospheric perspective. When the rolled feature is a ringworld arc, the curve sweeps across the sky bending overhead — the iconic Halo silhouette.

━━━ HALO COMPOSITION SIGNATURE ━━━
Sky often shows the RING-INSTALLATION ARC bending overhead — translucent through atmospheric haze, distant inner-surface visible. Halo's defining shot. Mix in: precursor monolith on horizon, distant Forerunner-style tower, atmospheric processor smoke columns, military base sketched into far valley.

━━━ STORY BEAT (interpret at vast-vista scale) ━━━
${story_beat}

Translate at frontier-scale: ARRIVAL = dropship descending against ring-arc. VIGIL = sentinel on ridge. SOLITUDE = empty precursor temple plaza. CONFRONTATION = distant patrol meeting at outpost.

━━━ COMPOSITION FRAME ━━━
${composition_frame}

━━━ LIGHTING ━━━
${lighting}

Painted-concept-art lighting — atmospheric perspective, cool-greens / cobalt-blues / golden-Sun-Earth-spectrum / ringworld inner-shadow accents.

━━━ WEATHER / PARTICULATE ━━━
${weather_particulate}

━━━ EMOTIONAL DNA ━━━
${emotional_dna}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

Palette references the franchise: forest-green precursor + military-coyote + ring-cobalt + atmospheric-haze grey + golden ring-amber.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION ━━━
Wide cinematic vista. FOREGROUND: textural detail (rock outcrop / Forerunner-style stone / military debris / native vegetation). MIDGROUND: the biome body + small witness in profile. DEEP DISTANCE: ring-arc OR precursor megalith OR distant base receding through atmospheric perspective. Sky carries 40-60% — often shows the ring's curve sweeping overhead.

━━━ FRANCHISE BAN — ABSOLUTE ━━━
NEVER write "Halo", "Forerunner", "Covenant", "Reach", "Master Chief", "Spartan", "Cortana", "Sangheili", "Elite", "UNSC", "Pelican", "Warthog", "Brute", "ODST", "Banished" in the output.

━━━ FORBIDDEN ━━━
- NO centered foreground large figure
- NO Bungie/343 logos or visual nouns
- NO crowds — exactly one witness
- NO modern military fatigues — armor is sci-fi tactical, generic

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  GUARDIANS_ARCHITECTURE: ({ slots, sharedDNA, vibeDirective }) => {
    const { story_beat, composition_frame, emotional_dna, lighting, setting, atmosphere, deep_distance, incident } = slots;

    const incidentSection = incident
      ? `
━━━ PLAYFUL-COSMIC DISRUPTION — render this visibly active ━━━
${incident}

A whimsical-cosmic event woven into the scene. Light show / floating banners / energy bloom / parade — never grim, always wonder.

`
      : '';

    return `You are a sci-fi concept-art painter writing a GUARDIANS-OF-THE-GALAXY-CODED ARCHITECTURE INTERIOR for StarBot — James-Gunn / Jack-Kirby-cosmic / 70s-album-cover-sci-fi tradition. PLAYFUL + EXTRAVAGANT + WEIRD + SATURATED-COLOR. Less gritty than Star Wars, more whimsical-cosmic-grand. NO FIGURES, NO PEOPLE, NO ALIENS-AS-FIGURES.

━━━ MOOD — NON-NEGOTIABLE ━━━
COSMIC + PLAYFUL + EXTRAVAGANT. Color-saturated cathedrals, kaleidoscopic geometry, temple-arcades, spire-cities. The cosmos is exuberant, weird, alive. Whimsy over dread. NEVER macabre.

━━━ NO SKULLS — ABSOLUTE BAN ━━━
NEVER render skulls of any kind. No giant celestial skull, no skull-shaped architecture, no skull-bone fragments, no cracked-cranium spaces. Cosmic-weird leans into temple-arcade / spire-city / color-saturated cathedral / kaleidoscopic geometry — NOT macabre bone forms.

━━━ NO FIGURES — ABSOLUTE ━━━
Pure architecture. NO Star-Lord, NO Rocket, NO Groot, NO humans, NO aliens-as-figures, NO foreground spaceships. Empty cosmic-weird space speaks through architectural color + light.

━━━ THE ARCHITECTURE (render this exact interior) ━━━
${setting}

━━━ ATMOSPHERIC TEXTURE — saturated color is the signature ━━━
${atmosphere}

━━━ DEEP-DISTANCE SIGNATURE — receding through cosmic haze ━━━
${deep_distance}

This is the far-back layer — kaleidoscopic geometry stretching to vanishing point, color-bleed atmospheric depth.
${incidentSection}
━━━ SATURATED COLOR — THE GUARDIANS SIGNATURE ━━━
Push saturation HARD. Neon-magenta, electric-cyan, gold-leaf, prism-rainbow, oxblood-magenta, plasma-violet. Color is the language. Multiple color blocks per frame. Never washed out, never grey-on-grey. Color-saturated cathedrals stacking palettes.

━━━ STORY BEAT (interpret at cosmic-playful scale) ━━━
${story_beat}

Translate at cosmic-celebration scale: ARRIVAL = beam descending through atrium. VIGIL = light-show ritual. SOLITUDE = empty cathedral with prismatic glow. CONFRONTATION = ceremonial energy field.

━━━ COMPOSITION FRAME ━━━
${composition_frame}

━━━ LIGHTING ━━━
${lighting}

━━━ EMOTIONAL DNA ━━━
${emotional_dna}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION ━━━
Color-saturated cosmic architecture composition. FOREGROUND: prismatic detail (refraction, crystal cluster, color-block tile). MIDGROUND: architecture body (cathedral / temple-arcade / spire-cluster / kaleidoscopic chamber). DEEP DISTANCE: color-bleed atmospheric depth receding through cosmic haze. Push color-saturation EVERYWHERE.

━━━ FRANCHISE BAN — ABSOLUTE ━━━
NEVER write "Knowhere", "Xandar", "Contraxia", "Sovereign", "Yondu", "Star-Lord", "Rocket", "Groot", "Ego", "Nova Corps", "Guardians" in the output.

━━━ FORBIDDEN ━━━
- NO skulls of any kind (Knowhere code) — hard ban
- NO foreground figures
- NO grim-gritty palette — saturation must be HIGH
- NO macabre bone forms

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  DUNE_LANDSCAPE: ({ slots, sharedDNA, vibeDirective }) => {
    const { story_beat, composition_frame, emotional_dna, lighting, weather_particulate, biome, anchor_entity, moment, deep_distance } = slots;

    return `You are a sci-fi concept-art painter writing a DUNE-CODED DESERT VISTA for StarBot — Frank-Herbert / Denis-Villeneuve / David-Lean / Stanley-Kubrick / Lawrence-of-Arabia / Apocalypse-Now-desert-vista painted-matte tradition. BIBLICAL scale. The desert is the hero. Sky DOMINATES 50-70% of frame in sweeping atmospheric grandeur. The empire feels ANCIENT, VAST, and SACRED.

━━━ THE DESERT IS THE SUBJECT — NON-NEGOTIABLE ━━━
The vast desert/empire vista is the hero. Twin-sun light raking endless dunes, spice-blue dawn haze, sandstorm-wall scale, polar-ice horizon, wormtrail terrain at MASSIVE scale. The empty world is 90% of the frame. The figure or craft is small — proves scale only.

━━━ ONE SMALL WITNESS — for scale ━━━
${anchor_entity}

This witness is SMALL in the frame. NOT a centered figure. Place in MIDGROUND-BACK as silhouette proving scale of the immense desert. EXACTLY ONE — never crowds.

━━━ WHAT THE WITNESS IS DOING — candid moment ━━━
${moment}

Small-scale action — a grounded human moment in the vast empire. NEVER heroic posing.

━━━ THE DESERT BIOME (render this exact landscape) ━━━
${biome}

This is THE scene. Render every detail of the desert's specific character — its dunes, formations, atmospheric perspective, materials. The desert vocabulary is biblical-ancient: amber dune-seas, sandstone cathedrals, hand-carved architectural ornament, weathered-bronze monuments, hexagonal basalt, polar-ice edges, methane lakes, glassed crater fields.

━━━ DEEP-DISTANCE SIGNATURE — at the horizon ━━━
${deep_distance}

Render at the deepest layer — receding through dust-haze atmospheric perspective. Adds biblical-scale depth.

━━━ DUNE BLOW-IT-UP AMPLIFICATION ━━━
Stack: BIBLICAL desert scale + twin-sun light raking dunes + spice-blue dawn haze + sandstorm-wall scale + dust-haze atmospheric depth + hand-carved architectural ornament + monumental empire grandeur + ancient-bronze-and-stone material weight. Frank-Herbert × David-Lean × Denis-Villeneuve × Kurosawa × 10. Every frame a museum-poster painting. The world feels ANCIENT, VAST, SACRED.

━━━ STORY BEAT (interpret at biblical desert scale) ━━━
${story_beat}

Translate at empire-scale: ARRIVAL = caravan cresting horizon. VIGIL = lone figure watching twin-suns set. SOLITUDE = empty dune-sea. CONFRONTATION = sandstorm-wall approaching pilgrim.

━━━ COMPOSITION FRAME ━━━
${composition_frame}

━━━ LIGHTING ━━━
${lighting}

Twin-sun raking light, copper-amber midday, spice-blue dawn glow, oxblood dusk, polar-ice glare — name the time-of-day specifically.

━━━ WEATHER / PARTICULATE ━━━
${weather_particulate}

Dust-haze, sand-spray, heat-shimmer, wind-traced ripple, atmospheric perspective.

━━━ EMOTIONAL DNA ━━━
${emotional_dna}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

Palette skews ancient-bronze, amber-sand, copper-sun, spice-blue, oxblood-shadow, polar-bone. NEVER bright cheerful.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION ━━━
Wide cinematic landscape, BIBLICAL scale. Sky dominates 50-70% of frame. Horizon stretches into atmospheric perspective. FOREGROUND: textural detail (dune ripples / sandstone cracks / wind-traced sand / fossilized bone-shard). MIDGROUND: the desert body + the small witness in profile. DEEP DISTANCE: signature feature looming through dust-haze. Camera HIGH and WIDE — emphasizing the scale of the empty world. Painted-matte production-painting feel.

━━━ FRANCHISE BAN — ABSOLUTE ━━━
NEVER write "Arrakis", "Dune", "Fremen", "Harkonnen", "Atreides", "ornithopter", "spice" (as proper noun), "Bene Gesserit", "Shai-Hulud", "Paul" in the output. Use original phrasing — "insectoid-bladed flyer" not "ornithopter", "spice-blue haze" only as descriptive color.

━━━ FORBIDDEN ━━━
- NO centered foreground large figure — witness is small in midground
- NO bright cheerful color — desert palette is bronze / amber / copper / oxblood
- NO modern military aesthetics — this is ancient-empire-grandeur
- NO crowds — exactly one witness

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  ALIENS_ARCHITECTURE: ({ slots, sharedDNA, vibeDirective }) => {
    const { story_beat, composition_frame, emotional_dna, lighting, setting, atmosphere, deep_distance, incident } = slots;

    const incidentSection = incident
      ? `
━━━ INCIDENT — render this visibly active in the scene ━━━
${incident}

This is a moment of disruption woven INTO the architecture — visible evidence (steam burst, light strobe, structural damage, leaked fluid, electrical fault). NOT the subject.

`
      : '';

    return `You are a sci-fi concept-art painter writing an ALIENS-CODED ARCHITECTURE INTERIOR for StarBot — H.R.-Giger / Ridley-Scott / James-Cameron / Ron-Cobb / Syd-Mead-industrial / Annihilation tradition. TERRIFYING-AND-MAJESTIC. The architecture is the subject — NO FIGURES, NO PEOPLE, NO XENOMORPHS, NO CREATURES.

━━━ MOOD — NON-NEGOTIABLE ━━━
HAUNTED + INDUSTRIAL + WRONG. The world feels haunted by absent inhabitants. Alien resin pulses with wet-organic life. Machinery hums in distant systems. Silence is heavy with menace. Every frame is a museum-poster painting of hostile-alien-world dread OR biblical Engineer-architecture awe.

━━━ NO FIGURES — ABSOLUTE ━━━
Pure architecture. NO humans, NO xenomorphs, NO aliens, NO engineers, NO androids, NO creatures of any kind. The empty terrifying space speaks for itself through architectural detail, condition, and atmosphere.

━━━ THE ARCHITECTURE (render this exact interior) ━━━
${setting}

━━━ ATMOSPHERIC TEXTURE — render WOVEN through the space ━━━
${atmosphere}

━━━ DEEP-DISTANCE SIGNATURE — visible at the far end / through doorway / down corridor ━━━
${deep_distance}

This is the far-back layer creating depth and dread — render it receding through atmospheric steam-haze.
${incidentSection}
━━━ MATERIAL SPECIFICITY — REQUIRED ━━━
Every surface NAMED with material: biomech resin (glossy wet-organic), ribbed steel beam, prefab metal panel, cryo-glass, blast-shielded ceramic, acid-pitted alloy, wet-organic secretion, fossilized chitin, drainage-channel grating, condensation-streaked bulkhead, cable-bundle veins, ductwork-coiled walls.

━━━ DRAMATIC LIGHTING — name specific sources ━━━
Sodium emergency strips (warm amber along floor/wall channels), blue-white sterile fluorescents (cold clinical), red strobe pulses (rhythmic alarm), single recessed emergency lights (pinpoint haloed in steam), steam-filtered work lights (volumetric shafts), single shaft of daylight piercing dust, sodium-yellow channel lighting. Cold pale ambient with ONE accent color dominating per frame.

━━━ STORY BEAT (interpret architecturally — no figures acting it out) ━━━
${story_beat}

Translate to space-mood: ARRIVAL = door cycling open with depressurization haze. VIGIL = silent corridor watched by emergency lights. SOLITUDE = cavernous chamber empty of life. CONFRONTATION = blast-door half-cycled stuck with sparks. DEPARTURE = vapor-trail through bulkhead pressure-cycle.

━━━ EMOTIONAL DNA ━━━
${emotional_dna}

━━━ COMPOSITION FRAME ━━━
${composition_frame}

━━━ LIGHTING ━━━
${lighting}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION ━━━
Cinematic architectural composition. CLAUSTROPHOBIC + DREAD-LADEN where the space calls for it (biomech corridors / vent tunnels / abandoned barracks / cryo-bays). MAJESTIC + BIBLICAL where appropriate (Engineer-class chambers / atmospheric processor cavities / cathedral hangars).

FOREGROUND: tactile architectural detail (resin drips, cable bundles, floor grating, overturned equipment, condensation streaks). MIDGROUND: the architecture body (corridor / chamber / hangar / lab — wet-glistening surface, ribbed structural language). DEEP DISTANCE: signature feature receding through atmospheric steam-haze and dread.

━━━ FRANCHISE BAN — ABSOLUTE ━━━
NEVER write "LV-426", "Nostromo", "Sulaco", "Hadley's Hope", "Weyland-Yutani", "Xenomorph", "Facehugger", "Engineer-ship", "Prometheus", "MUTHUR", "Alien" (as proper noun), "Ripley" in the output. Render the visual language generically.

━━━ FORBIDDEN ━━━
- NO foreground figures of any kind
- NO bright cheerful color — always cold ambient + ONE accent
- NO clean futurism — must be wet-glistening / decay-streaked / industrial-grit
- NO action shots — atmosphere over event

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  ARCHITECTURE_INTERIOR: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      story_beat,
      composition_frame,
      emotional_dna,
      lighting,
      setting,
      atmosphere,
      deep_distance,
      incident,
    } = slots;

    const incidentSection = incident
      ? `
━━━ INCIDENT — render this visibly active in the scene ━━━
${incident}

This is a moment of disruption — render the visible evidence (steam burst, light strobe, structural damage, leaked fluid, fire). It is woven INTO the architecture, not the subject.

`
      : '';

    return `You are a sci-fi concept-art painter writing an ARCHITECTURE INTERIOR scene for StarBot. NO CHARACTERS, NO PEOPLE, NO FIGURES — the architecture itself is the subject. Cinematic atmospheric interior — corridors, chambers, hangars, labs, control rooms. Output wraps with style prefix + suffix.

━━━ NO FIGURES — NON-NEGOTIABLE ━━━
This is PURE ARCHITECTURE. NO humans, NO creatures, NO figures of any kind. The empty terrifying / majestic / sacred / industrial space speaks for itself. Atmosphere is rendered through architectural detail, lighting, and condition — not through inhabitants.

━━━ THE ARCHITECTURE (render this exact interior) ━━━
${setting}

━━━ ATMOSPHERIC DETAIL — render this woven through the scene ━━━
${atmosphere}

━━━ DEEP-DISTANCE SIGNATURE — visible at the far end / through doorway / down corridor ━━━
${deep_distance}

This is the far-back layer that gives depth and mystery — render it receding through atmospheric haze.
${incidentSection}
━━━ STORY BEAT (interpret at architectural / atmospheric scale) ━━━
${story_beat}

Translate this beat to architectural atmosphere — no figures acting it out. ARRIVAL = a door cycling open. VIGIL = a silent corridor watched by emergency lights. SOLITUDE = a cavernous chamber empty of life. Translate to space-mood.

━━━ EMOTIONAL DNA ━━━
${emotional_dna}

━━━ COMPOSITION FRAME ━━━
${composition_frame}

━━━ LIGHTING ━━━
${lighting}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION ━━━
Cinematic architectural composition. FOREGROUND: tangible architectural element (floor grating, cable bundle, console edge, pipe, vent). MIDGROUND: the architecture body — chamber / corridor / hangar / lab. DEEP DISTANCE: the signature far-back element through doorway/down-corridor/across-hangar receding into atmospheric haze.

Heavy material specificity — every surface named (biomech resin / ribbed steel / prefab metal / cryo-glass / ceramic / weathered alloy / wet-organic / etc.). DRAMATIC lighting from named sources (emergency strips / sodium fluorescents / red strobes / spotlight beams / atmospheric haze diffusing).

━━━ FRANCHISE LANGUAGE ━━━
The setting / atmosphere / deep_distance pools carry the franchise visual DNA (Aliens / Mass Effect / etc.). Honor what those pools describe. Do NOT add franchise proper nouns to the output (no "LV-426", "Citadel", "Normandy", etc.) — render the visual language the pools encode, generically named.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**. Just the scene content.`;
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
