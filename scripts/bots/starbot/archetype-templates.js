/**
 * starbot archetype templates — Sonnet brief composer functions.
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
  STARBOT_SPACE_FEMME: ({ slots, vibeDirective }) => {
    const {
      subject_dna,
      outfit,
      action_poster,
      biome,
      background_drama,
      prop,
      camera_poster,
      phenomenon,
    } = slots;

    const props = Array.isArray(prop) ? prop : [prop];
    const propLines = props.map((p, i) => `  ${i + 1}. ${p}`).join('\n');

    const phenomenonSection = phenomenon
      ? `
━━━ COSMIC PHENOMENON (this render's environmental drama) ━━━
${phenomenon}

The phenomenon AMPLIFIES the scene — render it visibly as a secondary focal point that the eye lands on AFTER the figure. Saturated trans-color elements, dramatic atmospheric light, multi-tier depth.

`
      : '';

    return `You are a sci-fi cover artist writing a FUN, SEXY, VIVID SPACE FEMME render for StarBot — a single sassy larger-than-life space heroine caught in a candid heroic moment. Bold, eye-popping, high-energy, unmistakably sci-fi.

━━━ THE BAR — CONSISTENT VIVID SCI-FI COVER LOOK; THE WEIRD LIVES IN THE GIRL ━━━
Render in StarBot's SIGNATURE consistent look: a vivid, glossy, saturated neon-and-chrome SCI-FI COVER illustration — bold comic-cover color, eye-popping, high-energy, fun and punchy. KEEP THIS ART STYLE CONSISTENT every render (do NOT swap to stained-glass / screenprint / mosaic / abstract-pattern art styles — the style stays the same).

The VARIETY and the WEIRD live entirely in the GIRL, her FASHION, and the scene — NOT in the art style. Lean HARD into: strange, wildly varied ALIEN faces and morphology (a different species every render), and wildly different cool sci-fi OUTFITS (a different fashion every render), varied poses, varied alien settings. Every render = a DIFFERENT weird woman in DIFFERENT fashion, all in the SAME vivid sci-fi-cover style.

━━━ PUSH-TO-11 — MAXIMALIST DENSITY, NO QUIET CORNERS ━━━
Stack at least 3 layers simultaneously and fill every quadrant: ornate multi-trait character DNA + maximalist outfit & stacked gear + cinematic mid-verb pose + exotic perilous biome + secondary background drama + multi-source dramatic lighting.

━━━ THE FEMME (gender-locked she/her/woman) ━━━
${subject_dna}

A SINGLE female figure — she / her / woman / female — anatomy as described. Could be alien (head-tendrils / pointed ears / colored skin / bone-plate ridges / cat-slit eyes), augmented (chrome limbs / neural ports / cybernetic eyes), mutant, or ornate-baseline human. NEVER vanilla / generic. NEVER multi-figure. ONE woman is the whole show.

━━━ THE OUTFIT — CRAZY, STYLIZED, COOL SCI-FI SPACE-ADVENTURE FASHION ━━━
${outfit}

The HEART of this path: a HOT heroine in a CRAZY, highly-stylized, COOL sci-fi outfit built for space exploration and action. Functional for space-adventure AND really cool to look at — playful, stylish, hot, fun. NEVER clinical, drab, frumpy, or boring. The outfit is the STAR.

VARY THE OUTFIT HARD — a DIFFERENT look every render across sealed-suited (helmet/visor/rebreather), rogue/bounty-huntress (jacket/harness/holsters, no helmet), hooded/masked, explorer, pilot, ranger, scavenger. Hot and form-fitting is great but covered enough to read cool (not near-naked, no bare-midriff-bikini). A helmet/visor/mask is great but NOT required on the rogue/explorer looks.

━━━ THE POSE / ACTION ━━━
${action_poster}

Render her in THIS pose — body language reads in 2 seconds. It may be heroic action OR a confident sassy pose (crouching, sitting, leaning, perched) — whatever the pose says. Always confident with attitude; never limp, slumped, or lifeless.

━━━ THE BIOME ━━━
${biome}

Exotic perilous environment — bioluminescent / volcanic / acidic / crystalline / electrical / nebula-saturated. Multi-tier depth (foreground tactile detail + midground biome + deep-distance horizon).

━━━ BACKGROUND DRAMA (mid/deep-distance — always-on) ━━━
${background_drama}

A secondary mid/deep-distance focal point — alien fleet / leviathan / orbital ring / dimensional rift / kaiju shadow / colossal alien statue / cosmic phenomenon. The viewer's eye lands on the femme first, then drifts to the drama, then back. Multi-anchor poster composition.

━━━ STACKED ACCESSORIES (×2 — visible on her body or surrounding) ━━━
${propLines}

These are ORNATE detail anchors — pulsing bio-monitor / nav-compass on chrome chain / glowing alien artifact in C-grip / ritual mask hanging from belt / drone-companion / familiar creature on shoulder. Stack them; they make the figure feel lived-in.

━━━ POSTER FRAMING ━━━
${camera_poster}

Apply this camera framing precisely — it's the poster composition. Override default centered-portrait Flux bias.
${phenomenonSection}
━━━ LIGHTING ━━━
Bold vivid high-impact lighting — punchy neon-and-rim, saturated, high-contrast, glossy — suited to the scene and biome. The vivid neon-cover lighting is part of StarBot's signature look.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ OUTPUT SPEC ━━━
Write 130-180 words. Single paragraph. Comma-separated phrase string. NO preamble, NO ━━━ markers, NO **bold**, NO numbered output.

⚠️ FIGURE RULE — COOL SCI-FI OUTFIT FIRST. Describe her cool, stylized sci-fi space-adventure outfit FIRST (before alien features) — either a sealed suit WITH helmet/visor/mask, OR a helmet-free rogue/explorer look (cool jacket, harness, gear). Her body is dressed in cool functional gear, never bare. Her weird ALIEN traits (face-skin color, eyes, head shape, horns/tendrils, markings) show at her FACE — through a clear/flip-up visor if helmeted, or just her striking bare face if not. NO bare midriff, NO near-naked, NO flimsy non-sci-fi cloth.

Render her IN THE EXACT POSE from THE POSE / ACTION section (crouch / sit / lean / perch / over-shoulder / stand — don't default to standing) and VARY THE SHOT (wide / medium / close / over-shoulder / low-angle). She is a clear readable focal point, never a tiny speck, never a face-only bust.

OUTPUT ORDER — lead with: "[alien] woman in [her cool stylized sci-fi outfit + any helmet/visor/mask], [pose]"; THEN her alien face, then biome, background drama, props, lighting, phenomenon (if fired). End reinforcing the vivid glossy sci-fi-cover look. NO preamble, NO ━━━ markers, NO **bold**, NO numbered output, NO "render as" trailer. Pure Flux-feed phrase string.`;
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
      painted_tradition,
      vista_composition,
      narrative_witness,
      atmospheric_layer,
      color_register,
      signature_phenomenon,
      event,
    } = slots;

    const eventSection = event
      ? `
━━━ COSMIC EVENT — render this drama visibly ACTIVE in the scene ━━━
${event}

The event is the MOMENT — caught mid-detonation, mid-collision, mid-eruption. Energy + matter + light surging through the frame.

`
      : '';

    // Probabilistic axis gating (2026-05-31) — each accent axis fires 50% of
    // the time so per-render density stays coherent across literal models.
    // Always-on identity = phenomenon + painted_tradition (the "what + how").
    // 5 gated accents = vista_composition / narrative_witness / atmospheric_layer
    // / color_register / signature_phenomenon.
    const includeVistaComp = Math.random() < 0.5;
    const includeWitness = Math.random() < 0.5;
    const includeAtmoLayer = Math.random() < 0.5;
    const includeColorReg = Math.random() < 0.5;
    const includeSigPhenom = Math.random() < 0.5;
    const vistaCompSection = includeVistaComp
      ? `
━━━ PAINTED VISTA COMPOSITION — specific framing for this cosmic vista ━━━
${vista_composition}

Apply this composition on top of the universal composition_frame axis. Painted-tradition framings (terraformed-foreground-globe-behind / two-moons-on-horizon / planetary-rings-bisecting / spiral-arm-overhead / nebula-cathedral / etc.) — bake the named framing into the prompt structure.

`
      : '';
    const witnessSection =
      narrative_witness && includeWitness
        ? `
━━━ NARRATIVE WITNESS — tiny silhouette scale-prover (NOT a hero) ━━━
${narrative_witness}

Render as a TINY silhouette providing scale — observatory dome / orbiting habitat / lone lander / painted figure-at-windowsill. Place at frame edge or middle distance. Pixels-tall, NEVER the focal subject. Just gives the eye a human/structural anchor for the cosmic scale.

`
        : '';
    const atmoLayerSection = includeAtmoLayer
      ? `
━━━ ATMOSPHERIC LAYER — terrestrial-foreground atmospheric interpretation ━━━
${atmospheric_layer}

If the vista is viewed FROM a planet surface or near-orbit, render this specific atmospheric layer (dust-laden / cryogenic crystal-fog / methane-blue haze / sulfur-yellow smog / volcanic-ash veil / lichen-spore drift). Anchors the painted-cosmic-vista to a concrete viewpoint.

`
      : '';
    const colorRegSection = includeColorReg
      ? `
━━━ PAINTED COLOR REGISTER — the specific palette signature ━━━
${color_register}

Wash the painted vista in THIS exact palette — saturated and named (e.g. "sunset-on-Jupiter amber-and-burgundy" / "Saturn-rings ivory-and-cobalt"). Painted-tradition colors, not photoreal.

`
      : '';
    const sigPhenomSection = includeSigPhenom
      ? `
━━━ SIGNATURE PAINTED PHENOMENON — bigger painted-cosmic drama ━━━
${signature_phenomenon}

This is in addition to the main phenomenon — a secondary painted-tradition drama (Kuiper comet streak / mass-driver stream / planetary alignment / Lagrange habitat-cluster / Dyson-veil shimmer / impossible-aurora). Bake at midground or deep distance.

`
      : '';

    return `You are a sci-fi concept-art painter writing a PURE COSMIC VISTA for StarBot — a jaw-dropping cosmic phenomenon that fills the ENTIRE frame. NO characters, NO ships, NO architecture, NO figures of any kind. Pure cosmos, vast and overwhelming. Hubble / Webb cosmic-horror aesthetic. Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — PURE COSMOS ONLY ━━━
The cosmic phenomenon FILLS THE FRAME. The only permitted elements are astronomical:
- Stars / nebulae / dust lanes / planets / moons / rings / asteroid fields / accretion disks / gas filaments / cosmic radiation
- FORBIDDEN: ships, spacecraft, probes, satellites, drones, figures, characters, silhouettes, buildings, architecture, ANY human-made or biological elements
- If a scale prover names a "ship" or "figure" or "building," reinterpret it as the closest ASTRONOMICAL equivalent (moon, asteroid, distant star)

━━━ MULTI-DEPTH PAINTED COSMOS ━━━
Foreground: tactile cosmic detail (gas filaments / dust shimmer / ring debris). Midground: the primary phenomenon at full scale. Deep distance: receding starfield, atmospheric depth, secondary astronomical anchors.

━━━ THE PRIMARY PHENOMENON (fills the frame) ━━━
${phenomenon}

━━━ PAINTED TRADITION — the painter aesthetic for this render (always-on identity) ━━━
${painted_tradition}

Open the polished prompt with this painter's lineage. Bonestell saturated planetscape reads differently than McCall NASA-watercolor reads differently than Whelan paperback. Anchor the entire painted aesthetic on the named tradition.
${vistaCompSection}${witnessSection}${atmoLayerSection}${colorRegSection}${sigPhenomSection}${eventSection}
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
- NO hero figure / NO foreground character / NO ship-as-subject
- NO franchise proper nouns
- Tiny silhouette figures/structures from the NARRATIVE WITNESS axis above are ALLOWED ONLY when that axis fires — render them at scale-prover size (pixels-tall, frame-edge or middle-distance, NEVER the focal subject)
- NO atmospheric haze in vacuum (haze only inside nebulae or near planetary atmospheres or when the ATMOSPHERIC LAYER axis fires)

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ STRUCTURE — write 100-130 words ━━━
Open with the PRIMARY PHENOMENON dominating the frame. Then layer the cosmic environment — secondary astronomical anchors, lighting quality, particulate matter, dust lanes, scale-prover astronomical bodies. ONE haunting detail (impossible geometry / light bending the wrong way / time visibly dilating / a star where one shouldn't be). Painted finish, gallery-grade atmospheric depth, Hubble-photograph realism + Villeneuve cinematography.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**. Just the scene content.`;
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
This explorer renders SLEEK and ENGINEERED — burnished metallic plate armor with T-shaped or visor helmets, matte-black armored undersuits with single-accent shoulder markers, heavy sealed power-armor with integrated visor optics, industrial hard-surface design, painted hard-sci-fi cover-art tradition. Her gear is HARD ARMOR — burnished plate panels, exoskeleton frames with exposed hydraulics + pistons, visible power cells / battery packs glowing softly, T-visor or hooded helmets with optics, armored undersuit at joints. CLEAN engineered silhouettes — NOT cloth jumpsuits, NOT leather jackets, NOT dusty rags, NOT wasteland-mercenary rags, NOT loose rebel cloth, NOT pilot flight suits. She IS armored — every plate is fabricated metal/composite with field-repair detail.

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

This race is NON-NEGOTIABLE. Render her with the EXACT anatomy, distinguishing features, skin tone, ridges / head-tendrils / striped head-projections / antennae above. If the race description says head-tendrils, she has head-tendrils. If it says pointed ears + arched brows, render that. If it says burnished-plate visor helm, render that. The lineage is the HERO of her identity.

CRITICAL — NEVER NAME ANY SCI-FI FRANCHISE OR SPECIES in your output. Describe the FEATURES, not the franchise. Do not write "Twi'lek", "Vulcan", "Klingon", "Mandalorian", "Spartan", "Asari", "Togruta", "Andorian", "Trill", "Mirialan", "Drow", "Witcher", "Dunmer", "Fremen", "Space Marine", "Edgerunner", "Netrunner", "Sin'dorei", "Romulan", "Cardassian", "Bajoran", "Ferengi", "Tholian", "Borg", "Krogan", "Turian", "Quarian", "Drell", "Aeldari", "N7", "Reaper", "beskar", "stillsuit", "ceramite", "bolter", "MJOLNIR", "ODST", "lekku", "montrals" or any other franchise / species / trademark name. The aesthetic inspiration is fine; the NAME is not.

━━━ HER COMPACT BIO (one-line block — DO NOT expand into separate sections) ━━━
A ${race.split(':')[0]} woman with ${skin.split(',')[0]} skin, ${eyes.split(',')[0]} eyes, and ${hair_color.split(',')[0]} hair styled ${hairstyle.split(',')[0]}, wearing ${outfit}, carrying ${accessory}.

(All seven DNA elements — race / skin / eyes / hair color / hairstyle / outfit / accessory — should be discernible in the render when the biome permits a visible face. If the biome demands a sealed helmet, face DNA may be obscured — that's fine, the outfit and accessory still carry her identity.)

ABSOLUTE LOOKALIKE BAN: NO stark white plastic armor with featureless mask. NO full-body burnished plate with T-shaped visor as the WHOLE outfit. NO green-and-gold sealed helmet matching one specific franchise. NO matte-black-and-red-stripe armored undersuit. NO grey-tan boxy officer uniform. NO tan moisture-recycler bodysuit with face-wrap. NO monk-style hooded saber-robes. (The aesthetic inspiration is fine; render generic equivalents that don't 1:1 match any single franchise.)

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
${vibeDirective.slice(0, 150)}

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
This explorer is a SCI-FI EXPLORER, ROGUE, or ASSASSIN — armored-cloak-and-helm guardian / matte-tactical operative in sealed undersuit / armored rogue or bounty hunter with visor / drop-trooper in sealed-visor armor / burnished-plate bounty hunter / retro-armored space rogue with helmet / rumpled-suit bounty hunter / stoic dark-suited assassin. He is CAPABLE, MYSTERIOUS, DANGEROUS, and stylish-tactical — armored cloak + sealed helmet + utility kit + visible weapons.

He is WATCHFUL and CAPABLE — eyes scanning behind a visor or under a hood, weathered features when face is visible, ready stance. NOT bulky-tank brute, NOT military trooper boxy power-armor, NOT pure-form-fit fashion. He is between — TACTICAL OPERATIVE with cinematic style.

━━━ FULLY CLOTHED — ABSOLUTE RULE ━━━
He is FULLY ARMORED AND CLOTHED at all times. NEVER bare-chested. NEVER shirtless. NEVER exposed torso. NEVER tank top or sleeveless. NEVER beefcake-coded. His upper body is COVERED — sealed pressure suit / armored coat / tactical armor / ballistic harness OVER thermal underlayer. Even with cybernetic limbs (prosthetic arm / leg), the TORSO IS COVERED in armor or coat. Skin shows only at face, hands (when gloves are off), and neck-seal.

His gear is TACTICAL OPERATIVE kit — armored field jacket / armored cloak with hood / armored duster coat / sealed pressure suit / segmented plate armor over thermal layer / ballistic harness with visible ammo and pouches / armored cloak-and-helm combo / weathered tactical armor with scratches and field-repair welds. Sealed helmet with mil-spec optics OR helmet held in hand with hooded head OR face-wrap with goggles. He is dressed for hostile alien planets — every plate is fabricated metal/composite with field-wear detail.

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

ABSOLUTE LOOKALIKE BAN: NO stark white plastic armor with featureless mask. NO full-body burnished plate with T-shaped visor as the WHOLE outfit. NO green-and-gold sealed helmet matching one specific franchise. NO matte-black-and-red-stripe armored undersuit. NO grey-tan boxy officer uniform. NO tan moisture-recycler bodysuit with face-wrap. NO monk-style hooded saber-robes. CRITICAL — NEVER name any sci-fi franchise / species / trademark in your output (no Twi'lek / Vulcan / Klingon / Mandalorian / Spartan / Asari / Togruta / Andorian / Trill / Mirialan / Drow / Witcher / Dunmer / Fremen / Space Marine / Edgerunner / Netrunner / Sin'dorei / Romulan / Cardassian / Bajoran / Ferengi / Tholian / Borg / Krogan / Turian / Quarian / Drell / Aeldari / N7 / Reaper / beskar / stillsuit / ceramite / bolter / MJOLNIR / ODST / lekku / montrals — describe the FEATURES, not the franchise).

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
${vibeDirective.slice(0, 150)}

━━━ COMPOSITION ━━━
Three-quarter angle or side profile so we see his face and lineage clearly. NEVER walking head-on toward camera. NEVER posing for the camera. Full-body or wide mid-shot. FOREGROUND: tactile detail near his feet (alien plant, rock, ground texture). MIDGROUND: HIM, full body, mid-action, 25-40% of frame. BACKGROUND: the alien biome receding into atmospheric haze.

━━━ STRUCTURE (write the prompt in this exact order) ━━━
[OPENING — a wide cinematic action shot of a [race-coded man] [DOING THE EXACT CINEMATIC ACTION FROM THE ACTION SLOT] in an alien wilderness — the action verb leads the prompt], [he wears [outfit] with full material detail — armor / plates / utility / weathering], [his race anatomy + skin + eyes + hair locked from the DNA slots], [his signature accessory visible], [the alien biome wrapping around him — depth and atmospheric layers], [sky overhead], [lighting and weather particles], [color palette and mood]

CRITICAL — the OPENING tokens of the prompt are "[character] [DOING ACTION]" — the action verb leads. The character DNA flows after the action is established. The world establishes the stage. He fills 25-40% of frame, FULL-BODY, captured at the loaded instant of his action.

DRAMATIC VISUALS: render the EXACT slot-pool details above — DO NOT substitute generic descriptions. Race comes FIRST visually. Every other slot is locked. His outfit + accessory + action all readable at full-body scale. RUGGED + WEATHERED + DANGEROUS — bulk reads as competence.

Output ONLY the raw 80-120 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
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
${vibeDirective.slice(0, 150)}

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
${vibeDirective.slice(0, 150)}

━━━ STRUCTURE (write the prompt in this order — anchor entity LAST so it stays small) ━━━
[wide cinematic shot of the vast alien city — multi-tier density emphasized as the OPENING], [the specific city type and architecture style — dozens of supporting structures named], [hundreds of lit details, bridges between elevations, smaller buildings at the bases], [the sky layer and atmospheric depth], [lighting and the world reacting — ships, lights, particles, holographic signage], [scale provers visible — tiny ships threading gaps / lit-window-grain / etc.], [color palette and mood], [FINALLY: by the way, a tiny anchor-entity silhouette is at midground doing the story moment — described as a small element, never foreground centered]

CRITICAL — anchor entity goes at the END of the prompt only. If you mention it in the first half of the prompt, REWRITE the prompt with the entity at the very end. This is to keep Flux from rendering the entity foreground-large.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the scene content.`;
  },

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
      crew_signal,
      faction_iconography,
      propulsion_signature,
      genre_register,
      signature_hull_feature,
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

    // Probabilistic axis gating (2026-05-31) — each accent axis fires 50% of
    // the time so the per-render density stays cleaner across literal models
    // (Banana / GPT-2 / Flux 2 Pro). The 3 subject-identity axes (ship,
    // ship_action, setting) stay always-on. The 5 new bespoke axes gate.
    const includeHullFeature = Math.random() < 0.5;
    const includePropulsion = Math.random() < 0.5;
    const includeFaction = Math.random() < 0.5;
    const includeCrewSignal = Math.random() < 0.5;
    const includeGenreRegister = Math.random() < 0.5;
    const hullFeatureSection = includeHullFeature
      ? `
━━━ SIGNATURE HULL FEATURE — the one weird memorable detail on this ship ━━━
${signature_hull_feature}

Bake this feature INTO the ship description as a specific named detail with shape/color/scale. It's the readable-focus element — the thing the viewer will remember about THIS ship versus every other.

`
      : '';
    const propulsionSection = includePropulsion
      ? `
━━━ PROPULSION SIGNATURE — engine/drive aesthetic + visible exhaust ━━━
${propulsion_signature}

The drive must render as visible light/exhaust/heat behind the ship — name the COLOR, GLOW, plume shape, and trail length.

`
      : '';
    const factionSection = includeFaction
      ? `
━━━ FACTION ICONOGRAPHY — visible markings/badges/colors hinting at allegiance ━━━
${faction_iconography}

Paint THIS specific iconography onto the hull at readable scale — a numeral, glyph, sigil, or color-bar placed somewhere visible. Not text-block / not floating watermarks — heraldic/painted/etched onto the ship itself.

`
      : '';
    const crewSignalSection = includeCrewSignal
      ? `
━━━ CREW SIGNAL — visible life ON or AROUND the ship ━━━
${crew_signal}

Render this as a specific element with COUNT and SCALE — "twelve lit bridge silhouettes in the forward canopy" / "six EVA workers tethered to a midship hull-breach". Makes the ship feel inhabited and the scale legible.

`
      : '';
    const genreRegisterSection = includeGenreRegister
      ? `
━━━ GENRE REGISTER — the narrative tone of this frame ━━━
${genre_register}

Bend the entire scene tone to this register. story_beat + this register together set whether the frame reads as military thriller / pirate adventure / first contact / lost-ship horror / smuggler chase / etc.

`
      : '';

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
${hullFeatureSection}${propulsionSection}${factionSection}${crewSignalSection}${genreRegisterSection}━━━ THE SETTING (sci-fi environment wrapping the ship) ━━━
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
${vibeDirective.slice(0, 150)}

━━━ STRUCTURE — CRITICAL ━━━
Write ONE LONG DENSE FLOWING comma-separated composition. Do NOT separate elements into sections or bullet points — every axis above must be WOVEN INTO the single flowing scene description with SPECIFIC NUMBERS and COUNTS naming each element.

Reference for the density target — this is what a good scene description looks like:
"6.1-kilometer ceramic-white teardrop Banks-Culture vessel, 200+ micro-drones spiraling from 95-meter tender like glowing fireflies, 22 octagonal defense satellites in spherical formation, four angular 180-meter picket ships in diamond formation, twenty 6-meter navigation beacons strobing amber, cosmic graveyard of massive capital hulks with catastrophic breaches"

Every entry you pull from the axes above must be NAMED IN THE PROMPT with a count, color, scale, or position. The other ships / scale provers / surprise element MUST appear by name with concrete counts in the scene. NOT "a fleet visible" — "twelve 80m supply ships parallel-running" / "200+ EVA workers tethered" / "a kilometer-class capital silhouette receding into haze". Sonnet writes ONE flowing 130-150 word enumeration.

Output ONLY the raw 130-150 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the scene content.`;
  },

  ORBITAL_DESCENT: ({ slots, sharedDNA, vibeDirective }) => {
    const { planet_type, surface_detail, atmosphere_glow, approach_craft, space_backdrop, descent_event } = slots;
    const eventSection = descent_event
      ? `\n━━━ DESCENT EVENT — a beat (in the sky / on approach) ━━━\n${descent_event}\n\n`
      : '';
    return `You are a sci-fi concept-art painter writing an ORBITAL VISTA for StarBot — a tiny craft descending toward an alien world seen from ORBIT, the planet's great curve filling the frame from above. Think the breathtaking "approaching a world from space" shot. Output wraps with style prefix + suffix.

━━━ FROM ORBIT — ABSOLUTE FIRST RULE ━━━
The camera is IN SPACE, high above the planet, looking DOWN. The world's CURVE fills most of the frame as a colossal sphere below; the black of space is above. NEVER a ground-level landscape — this is the view from orbit, the planet seen as a whole curved world.

━━━ THE WORLD (the hero, seen from orbit) ━━━
${planet_type}

━━━ SURFACE DETAIL VISIBLE FROM ABOVE ━━━
${surface_detail}

━━━ ATMOSPHERE GLOW + TERMINATOR ━━━
${atmosphere_glow}

The thin bright arc of atmosphere rims the planet's curve; render the terminator/sunrise line where day meets night.

━━━ THE APPROACHING CRAFT (a CLEAR readable accent — sells the descent + scale) ━━━
${approach_craft}

This craft MUST be clearly visible in the frame — a sharp readable silhouette catching the light (engine-glow, plasma-trail, or sun-glint making it pop). It is small against the colossal planet but a DISTINCT focal accent, not lost. Render it unmistakably.

━━━ SPACE BACKDROP (above + around) ━━━
${space_backdrop}
${eventSection}━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ COMPOSITION ━━━
Cinematic wide orbital shot, the planet's curve filling the lower/major portion of the frame, the thin atmosphere arc and terminator clear, the craft small on approach, the black of space and stars beyond. Breathtaking scale. NEVER a ground-level horizon landscape — always the curved world seen from orbit.

━━━ STRUCTURE (write the prompt in this exact order) ━━━
[OPENING — a breathtaking view from orbit of a tiny craft approaching a colossal alien world, the planet's curve filling the frame — the world-from-orbit leads], [the world's surface detail from above], [the thin atmosphere arc + terminator], [the small approaching craft], [the black of space + backdrop], [palette + awestruck mood]

CRITICAL — render the EXACT slot-pool details above. The planet is seen FROM ORBIT (curved, from above), the craft is SMALL. Do NOT render a ground-level landscape.

Output ONLY the raw 90-120 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ### markers, NO **bold labels**. Just the phrases, starting immediately with the scene content.`;
  },

  ASTEROID_MINING: ({ slots, sharedDNA, vibeDirective }) => {
    const { mining_setting, industrial_detail, mining_action, worker_presence, belt_setting, hazard_event } = slots;
    const eventSection = hazard_event
      ? `\n━━━ HAZARD EVENT — a beat of industrial danger ━━━\n${hazard_event}\n\n`
      : '';
    return `You are a sci-fi concept-art painter writing a GRITTY INDUSTRIAL asteroid-mining scene for StarBot — blue-collar working-class space in the Nostromo / Expanse tradition. Worn, scarred, floodlit, lived-in machinery carving a rock in the void. NOT a sleek clean starship — this is a hard, dirty job. Output wraps with style prefix + suffix.

━━━ GRITTY + INDUSTRIAL — ABSOLUTE FIRST RULE ━━━
Everything is WORN, scarred, utilitarian, blue-collar — battered metal, floodlit dust, exposed pipework, hazard stripes, grime. This is heavy industry in space, not a gleaming spaceship. Functional, hard-used, real.

━━━ THE MINING OPERATION (the hero) ━━━
${mining_setting}

━━━ INDUSTRIAL DETAIL (the gritty machinery) ━━━
${industrial_detail}

━━━ THE ACTION (mining happening now) ━━━
${mining_action}

━━━ THE WORKERS (small, grubby — human scale) ━━━
${worker_presence}

━━━ THE BELT SETTING (surroundings) ━━━
${belt_setting}
${eventSection}━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ COMPOSITION ━━━
Cinematic industrial film-still — harsh floodlights cutting the dark, volumetric dust, deep shadow, scarred metal, sparks. The mining structure dominates; workers are small. Gritty, hard-used, atmospheric. NEVER a clean sleek spaceship, NEVER a pristine surface.

━━━ STRUCTURE (write the prompt in this exact order) ━━━
[OPENING — a gritty industrial mining operation carving an asteroid in deep space, floodlit and scarred — the industrial operation leads], [the worn machinery + gantries + pipework], [the mining action with sparks/dust], [tiny grubby workers for scale], [the asteroid belt setting], [harsh floodlight, dust, deep shadow], [palette + hard working mood]

CRITICAL — render the EXACT slot-pool details above. WORN + INDUSTRIAL + blue-collar, NOT a sleek clean starship.

Output ONLY the raw 90-120 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ### markers, NO **bold labels**. Just the phrases, starting immediately with the scene content.`;
  },

  COCKPIT_VIEW: ({ slots, sharedDNA, vibeDirective }) => {
    const { cockpit_type, hud_overlay, view_beyond, cockpit_detail, alert_state, combat_event } = slots;
    const eventSection = combat_event
      ? `\n━━━ COMBAT EVENT — a beat beyond/around the cockpit ━━━\n${combat_event}\n\n`
      : '';
    return `You are a sci-fi concept-art painter writing a FIRST-PERSON COCKPIT POV for StarBot — the view from INSIDE a cockpit, canopy frame and glowing HUD in the foreground, looking OUT at space. Immersive "you are the pilot." Output wraps with style prefix + suffix.

━━━ FIRST-PERSON COCKPIT POV — ABSOLUTE FIRST RULE ━━━
The camera is INSIDE the cockpit, looking OUT through the canopy/viewport. The cockpit frame, dashboard, and holographic HUD are the FOREGROUND, framing the shot; the scene beyond is seen THROUGH the glass. This is a first-person pilot's-eye view — NEVER a third-person external shot of a ship.

━━━ THE COCKPIT (foreground frame) ━━━
${cockpit_type}

━━━ THE HUD ON THE GLASS ━━━
${hud_overlay}

Render the holographic HUD glowing on the inside of the canopy — reticles, readouts, markers floating over the view.

━━━ WHAT'S BEYOND THE GLASS (the scene outside) ━━━
${view_beyond}

━━━ COCKPIT INTERIOR DETAIL (foreground) ━━━
${cockpit_detail}

━━━ ALERT STATE + MOOD-LIGHT ━━━
${alert_state}
${eventSection}━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ COMPOSITION ━━━
First-person POV: the dark cockpit interior + canopy frame + glowing HUD fill the foreground edges, the scene beyond the glass is the bright focal point. Instrument-glow lighting on the foreground. Immersive, you-are-there. NEVER a third-person external view of the ship.

━━━ STRUCTURE (write the prompt in this exact order) ━━━
[OPENING — a first-person view from inside a cockpit looking out through the canopy, HUD glowing on the glass — the cockpit POV leads], [the HUD reticles + readouts on the glass], [the scene beyond the glass], [foreground cockpit interior — hands, dash, switches], [alert state + instrument-glow light], [palette + mood]

CRITICAL — this is a FIRST-PERSON cockpit POV with the canopy + HUD in the foreground. Do NOT render an external third-person shot of a ship.

Output ONLY the raw 90-120 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ### markers, NO **bold labels**. Just the phrases, starting immediately with the scene content.`;
  },

  SHIP_GRAVEYARD: ({ slots, sharedDNA, vibeDirective }) => {
    const { graveyard_setting, wreck_detail, graveyard_scale, explorer_craft, cosmic_setting, eerie_detail } = slots;
    const eventSection = eerie_detail
      ? `\n━━━ EERIE DETAIL — a haunting beat among the dead ships ━━━\n${eerie_detail}\n\n`
      : '';
    return `You are a sci-fi concept-art painter writing a SHIP-GRAVEYARD scene for StarBot — a vast silent boneyard of dead warships drifting from a battle long over, a lone explorer threading the wrecks. Melancholy, vast, cold, awe-inspiring. Output wraps with style prefix + suffix.

━━━ A FIELD OF THE DEAD — ABSOLUTE FIRST RULE ━━━
Hundreds of BROKEN, GUTTED, POWERLESS STARSHIP hulls drift weightless and silent in the airless black VACUUM of deep space — a fleet-scale graveyard. These are dead spacecraft: snapped in half, hull-breached, scorched, DARK with every light and engine cold and DEAD. They tumble at dead angles in zero gravity. NEVER lit, powered, or active; NEVER a working fleet or a battle in progress; NEVER floating on water or an ocean (this is the vacuum of space) — this is the silent aftermath of a battle long over. The only living thing is the tiny lone explorer.

━━━ THE GRAVEYARD (the hero boneyard) ━━━
${graveyard_setting}

━━━ WRECK DETAIL (the dead ships up close) ━━━
${wreck_detail}

━━━ THE VAST SCALE ━━━
${graveyard_scale}

━━━ THE LONE EXPLORER (tiny — threads the dead fleet) ━━━
${explorer_craft}

Keep this TINY against the vast field of wrecks — a single small visitor among the dead.

━━━ COSMIC SETTING (backdrop) ━━━
${cosmic_setting}
${eventSection}━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ COMPOSITION ━━━
Cinematic wide vista, hundreds of dead hulls drifting in layers into atmospheric haze, the lone explorer tiny among them, cold low light, deep shadow. Silent, vast, melancholy, awe. NEVER a working fleet or an active battle.

━━━ STRUCTURE (write the prompt in this exact order) ━━━
[OPENING — a vast silent graveyard of dead drifting warships, a tiny explorer threading the wrecks — the boneyard leads], [the wrecked hull detail], [the vast fleet-scale receding into haze], [the tiny lone explorer], [the cold cosmic backdrop], [palette + melancholy awestruck mood]

CRITICAL — render the EXACT slot-pool details above. DEAD wrecks, fleet-scale, a TINY explorer. Do NOT render a working fleet or an active battle.

Output ONLY the raw 90-120 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ### markers, NO **bold labels**. Just the phrases, starting immediately with the scene content.`;
  },

  TERRAFORMING: ({ slots, sharedDNA, vibeDirective }) => {
    const { terraform_stage, terraform_tech, climate_drama, settlement, world_backdrop, milestone_event } = slots;
    const eventSection = milestone_event
      ? `\n━━━ MILESTONE EVENT — a beat of a world being born ━━━\n${milestone_event}\n\n`
      : '';
    return `You are a sci-fi concept-art painter writing a TERRAFORMING vista for StarBot — a half-remade alien world being brought to life, machinery and spreading green fighting the old barren rock. Hopeful, epic-scale transformation. Output wraps with style prefix + suffix.

━━━ A WORLD MID-TRANSFORMATION — ABSOLUTE FIRST RULE ━━━
This world is BEING CHANGED — barren rock meets new life. The drama is the CONTRAST: red desert giving way to green, machinery remaking the sky, the old world and the new world visible in the same frame. Hopeful and epic.

━━━ THE WORLD'S STAGE OF TRANSFORMATION (the hero) ━━━
${terraform_stage}

━━━ THE TERRAFORMING MACHINERY ━━━
${terraform_tech}

━━━ THE NEW-CLIMATE SKY + WEATHER ━━━
${climate_drama}

━━━ THE SETTLEMENT (human presence) ━━━
${settlement}

━━━ PLANETARY / COSMIC BACKDROP ━━━
${world_backdrop}
${eventSection}━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ COMPOSITION ━━━
Cinematic epic-scale vista — the barren-meets-living contrast clear, terraforming machinery monumental, the spreading green and the dramatic new-climate sky, settlements small for scale. Hopeful, awe, transformation. Show BOTH the old barren world and the new living one in tension.

━━━ STRUCTURE (write the prompt in this exact order) ━━━
[OPENING — an epic vista of a half-terraformed alien world, barren red rock giving way to spreading green, terraforming machinery remaking the sky — the transforming world leads], [the terraforming machinery], [the dramatic new-climate sky/weather], [small settlements for scale], [the planetary/cosmic backdrop], [palette + hopeful epic mood]

CRITICAL — render the EXACT slot-pool details above. A world MID-CHANGE (barren-meets-living), with the machinery + green + dramatic sky.

Output ONLY the raw 90-120 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ### markers, NO **bold labels**. Just the phrases, starting immediately with the scene content.`;
  },

  DERELICT: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      derelict_setting,
      decay_detail,
      explorer_light,
      ominous_reveal,
      light_atmosphere,
      threat_hint,
    } = slots;

    const threatSection = threat_hint
      ? `
━━━ A HINT OF THREAT — a beat of dread (subtle, in the dark, NOT a monster reveal) ━━━
${threat_hint}

Keep this SUBTLE and distant — a wrongness at the edge of the light, not a clear monster in frame. The dread is in the suggestion.

`
      : '';

    return `You are a sci-fi concept-art painter writing an eerie DERELICT-SPACECRAFT scene for StarBot — a lone explorer drifting through a dead, abandoned ship or station, flashlight cutting the dark. Alien / Dead-Space / Event-Horizon awe-horror. Silent, cold, tense, with a "what happened here?" mystery. Output wraps with style prefix + suffix.

━━━ DEAD + ABANDONED — ABSOLUTE FIRST RULE ━━━
This place is DEAD — powered-down, frozen, long-abandoned, silent. No bustling crew, no clean working ship. Cold, derelict, eerie. The only life is the lone explorer.

━━━ THE DERELICT (the hero setting) ━━━
${derelict_setting}

━━━ SIGNS OF DEATH + ABANDONMENT ━━━
${decay_detail}

━━━ THE LONE EXPLORER + THEIR LIGHT (the narrative anchor + key light) ━━━
${explorer_light}

EXACTLY ONE explorer, small in the vast dead space, their flashlight/helmet-lamp beam the primary light cutting the dark and catching drifting dust and frost. Seen from behind or in silhouette.

━━━ WHAT THE BEAM REVEALS (the mystery) ━━━
${ominous_reveal}

━━━ THE LIGHT + MOOD ━━━
${light_atmosphere}
${threatSection}
━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ COMPOSITION ━━━
Cinematic film-still, deep shadow and a single hard light source (the explorer's beam or a failing emergency light). High contrast, volumetric dust in the beam, deep blacks. The explorer is small — dwarfed by the dead structure. Tense, lonely, awe-horror. NEVER brightly-lit, NEVER a clean working ship, NEVER a crowd.

━━━ STRUCTURE (write the prompt in this exact order) ━━━
[OPENING — a lone suited explorer small in a dead abandoned [derelict setting], flashlight beam cutting the dark — the dead place + the light lead], [the decay and abandonment detail], [what the beam reveals], [the eerie light and mood], [deep shadow, volumetric dust, high contrast], [palette and tense lonely mood]

CRITICAL — render the EXACT slot-pool details above. Dead, cold, abandoned, ONE small explorer with a beam in the dark. Do NOT render a clean lit working ship or a crowd.

Output ONLY the raw 90-120 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ### markers, NO **bold labels**. Just the phrases, starting immediately with the scene content.`;
  },

  LEVIATHAN: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature_form,
      creature_detail,
      creature_behavior,
      cosmic_setting,
      scale_anchor,
      contact_event,
    } = slots;

    const eventSection = contact_event
      ? `
━━━ FIRST-CONTACT EVENT — a dramatic beat ━━━
${contact_event}

`
      : '';

    return `You are a sci-fi concept-art painter writing a FIRST-CONTACT scene for StarBot — a tiny human ship encountering a COLOSSAL LIVING ALIEN ENTITY in deep space. Pure sense-of-wonder awe. Think Arrival / 2001 / Annihilation — the encounter with something vast, alive, and utterly alien. Output wraps with style prefix + suffix.

━━━ A LIVING CREATURE — ABSOLUTE FIRST RULE ━━━
This is a COLOSSAL LIVING ANIMAL drifting ALONE in open space — a discrete, free-floating organism of SOFT TRANSLUCENT FLESH, MEMBRANE, and BIOLUMINESCENCE, like a vast deep-sea creature adrift in the void. It is ALIVE and ORGANIC. It is NOT a machine, NOT a ring, NOT a station, NOT crystal terrain, NOT architecture, NOT a structure of any kind — those are the failure mode. It is also NOT a recognizable Earth mammal (no whale/dolphin/shark/fish-face/bird). Soft, glowing, gelatinous, tentacled, membranous — a wondrous alien sea-creature of space.

━━━ THE CREATURE — ITS FORM (the hero) ━━━
${creature_form}

Render this colossal SOFT LIVING creature drifting free in open space, filling much of the frame — translucent flesh, glowing organs, trailing tendrils or fronds, unmistakably ALIVE and organic. A discrete floating animal, NOT a wall, NOT terrain, NOT a tunnel, NOT a structure.

━━━ THE CREATURE — ALIEN SURFACE + ANATOMY ━━━
${creature_detail}

Bioluminescence, translucency, energy, crystalline or living-metal texture — alien, never Earth-animal fur/scales/feathers.

━━━ THE MOMENT — what it is doing (first contact) ━━━
${creature_behavior}

━━━ THE COSMIC SETTING ━━━
${cosmic_setting}

━━━ SCALE ANCHOR — the tiny thing proving its colossal size ━━━
${scale_anchor}

This must be TINY against the creature — a ship or figure dwarfed to a speck, selling the overwhelming scale of the encounter.
${eventSection}
━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ COMPOSITION ━━━
Cinematic wide shot, the colossal alien dominating the frame, the tiny ship/figure dwarfed to a speck for scale. Deep space setting with atmospheric/nebula depth. Awe, wonder, the sublime. The creature is alive and alien. NEVER a recognizable Earth animal; NEVER the creature small or the ship large.

━━━ STRUCTURE (write the prompt in this exact order) ━━━
[OPENING — a tiny ship encountering a COLOSSAL LIVING ALIEN entity (the specific alien form) in deep space — the alien creature leads], [its alien surface + anatomy + bioluminescence], [what it is doing — the first-contact moment], [the cosmic setting around it], [the tiny ship/figure dwarfed for scale], [palette and awestruck sublime mood]

CRITICAL — render the EXACT alien form above; it is colossal, alive, and NON-EARTH (no whale/mammal/fish silhouette). The scale anchor is TINY.

Output ONLY the raw 90-120 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ### markers, NO **bold labels**. Just the phrases, starting immediately with the scene content.`;
  },

  CRYSTALLINE_WORLD: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      composition,
      crystal_formation,
      crystal_material,
      light_refraction,
      ground_detail,
      sky_above,
      crystal_event,
    } = slots;

    const eventSection = crystal_event
      ? `
━━━ CRYSTAL EVENT — a phenomenon animating the crystal world ━━━
${crystal_event}

Weave this in as a secondary wonder — the crystal terrain + refracted light stay the hero.

`
      : '';

    return `You are a sci-fi concept-art painter writing a jaw-dropping ALIEN CRYSTALLINE-WORLD vista for StarBot — a world of titanic glowing crystal prisms with a star's light fracturing through them into rainbow caustics. Same universe as our cosmic vistas and alien landscapes. Pure jewel-like spectacle. Output wraps with style prefix + suffix.

━━━ THE JEWEL WORLD — ABSOLUTE FIRST RULE ━━━
The terrain is made of COLOSSAL TRANSLUCENT CRYSTAL. A star's light passes THROUGH it and FRACTURES into visible rainbow caustics, prismatic light-shafts, and internal glow. Saturated, luminous, gem-like. This is the unmistakable subject — never a normal rock landscape.

━━━ THE COMPOSITION — THE SHOT THAT LEADS THIS RENDER (honor it exactly) ━━━
${composition}

This is the camera framing and scene-shape for THIS render. Open your prompt with it. The crystalline architecture is DIFFERENT every render — a wide canyon, an enclosing cavern, an aerial field, a distant vista, an overhead arch, a mirror-reflection. DO NOT default to a centered glowing vertical crystal tower/column/spiral — render the EXACT composition above, varied and distinct.

━━━ THE CRYSTAL FORMATION (the hero terrain, framed by the composition above) ━━━
${crystal_formation}

Render this crystalline terrain as the composition above frames it — translucent, faceted, catching and bending the light. Fit the formation to the shot type; do not collapse it into a single central tower.

━━━ THE CRYSTAL MATERIAL (color + clarity) ━━━
${crystal_material}

This is the crystal's color, clarity, and gem-type — it sets the palette of the whole world.

━━━ THE LIGHT REFRACTION (the signature money-shot) ━━━
${light_refraction}

This is the soul of the image — render the fractured, split, prismatic light in breathtaking detail: rainbow caustics splashed across surfaces, shafts of separated spectrum, glow trapped inside the crystal.

━━━ THE GROUND (foreground floor) ━━━
${ground_detail}

━━━ THE SKY + LIGHT SOURCE ━━━
${sky_above}

The star or sky above is what fractures through the crystal — render the light source and how its rays enter the formation.
${eventSection}
━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ COMPOSITION ━━━
Cinematic wide vista. Colossal crystal formations dominating the frame, translucent and glowing, light fracturing through them into rainbow shafts and caustics. Deep atmospheric perspective with prismatic haze. Any figure or ship is a TINY scale-speck dwarfed by the crystal. Breathtaking, saturated, jewel-like — a world made of light and gemstone. NEVER a dull grey rock scene — the crystal is luminous and the light is fractured into visible color.

━━━ STRUCTURE (write the prompt in this exact order) ━━━
[OPENING — establish the COMPOSITION/shot from the composition slot (wide canyon / enclosing cavern / aerial field / distant vista / overhead arch / reflection) rendered in colossal translucent crystal with light fracturing into rainbow caustics — the composition + crystal lead], [the crystal type + color + clarity], [the prismatic split light, caustics and internal glow], [the foreground crystal floor], [the sky and light source above], [prismatic atmospheric depth], [palette and luminous awestruck mood]

CRITICAL — the OPENING tokens establish the SPECIFIC composition + "translucent crystal world, light fracturing into rainbow caustics". Render the EXACT slot-pool details above — DO NOT substitute a generic rocky landscape, and DO NOT default to a centered glowing vertical crystal tower (vary the architecture per the composition). The crystal must be translucent + glowing and the light visibly fractured.

Output ONLY the raw 90-120 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ### markers, NO **bold labels**. Just the phrases, starting immediately with the scene content.`;
  },

  IMPOSSIBLE_SKY: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      ringed_giant,
      sky_companions,
      foreground,
      horizon_detail,
      atmosphere,
      sky_event,
      witness_figure,
    } = slots;

    const eventSection = sky_event
      ? `
━━━ SKY EVENT — a dramatic celestial beat (in the sky, not the foreground) ━━━
${sky_event}

Place this in the sky as a secondary wonder — the ringed giant stays the hero.

`
      : '';

    const witnessSection = witness_figure
      ? `
━━━ A TINY WITNESS — a lone figure gazing up at the impossible sky (epic-tiny composition) ━━━
${witness_figure}

Place this single figure SMALL in the foreground — a speck dwarfed by the colossal sky — seen from BEHIND or in silhouette, gazing UP at the ringed giant. This is an emotional + scale anchor: the awe of one small being beneath an overwhelming sky. The figure is TINY (a few percent of frame height); the sky is still the hero. EXACTLY ONE figure.

`
      : '';

    return `You are a sci-fi concept-art painter writing a jaw-dropping ALIEN-SKY wallpaper vista for StarBot — a colossal ringed gas giant looming over the horizon of an alien world, the kind of breathtaking sky people set as their wallpaper. Same universe as our cosmic vistas. The SKY is the entire show. Output wraps with style prefix + suffix.

━━━ THE SKY IS THE HERO — ABSOLUTE FIRST RULE ━━━
The horizon sits LOW in the frame. The SKY fills 60-70% of the image and a colossal ringed planet DOMINATES it. The land below is only a thin anchoring foreground strip. This is an awe-at-the-sky image — the viewer's eye goes UP. NEVER a normal landscape with a small sky.

━━━ THE RINGED GIANT (the hero of the sky) ━━━
${ringed_giant}

This colossal ringed planet hangs ENORMOUS over the horizon, filling much of the sky. Its rings slice across the frame at a dramatic tilt, casting banded shadows. Render its cloud-banding, color, and ring system in breathtaking detail — it is the unmistakable subject.

━━━ THE REST OF THE SKY (companions) ━━━
${sky_companions}

Arrange these across the sky around the ringed giant — moons, distant suns, aurora, the galaxy band — filling the sky with layered wonder so it never feels empty.

━━━ THE FOREGROUND (a thin anchor that MIRRORS the sky) ━━━
${foreground}

Keep this a LOW, thin foreground strip at the bottom of the frame. If it is water, ice, or glass, it MIRRORS the ringed giant and the sky — a stunning reflection doubling the spectacle. The land is the stage; the sky is the star.

━━━ THE HORIZON (midground detail) ━━━
${horizon_detail}

Sits along the low horizon line where land meets sky — adds depth and, where it includes a tiny structure or figure, a sense of human scale against the immense sky.

━━━ ATMOSPHERE + LIGHT ━━━
${atmosphere}

This sets the sky's color, light, and air — ring-shadow bands, aurora glow, twilight gradient, the terminator, golden-hour wash. It is the mood of the whole image.
${eventSection}${witnessSection}
━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ COMPOSITION ━━━
Cinematic wide landscape, LOW horizon (bottom third), the ringed giant dominating the upper sky, rings slicing diagonally across the frame. Foreground a thin mirroring strip. Deep atmospheric perspective. Breathtaking, serene, wallpaper-worthy. NEVER a centered small planet in a big empty black sky — the giant is HUGE and close, hanging over a real alien world with air and light. NO figure dominating — any figure is a tiny scale-speck on the horizon.

━━━ STRUCTURE (write the prompt in this exact order) ━━━
[OPENING — a breathtaking alien vista with a colossal ringed gas giant looming huge over a low horizon, rings slicing across the sky — the ringed giant leads], [its banding + color + ring system in detail], [the moons / suns / aurora filling the rest of the sky], [the thin foreground land or sea mirroring the sky], [the horizon detail], [atmosphere, ring-shadow bands, color and light], [palette and serene awestruck mood]

CRITICAL — the OPENING tokens establish "[colossal ringed planet looming over an alien horizon, rings across the sky]" — the giant leads. The sky fills 60-70% of frame; the land is a thin mirroring anchor. Render the EXACT slot-pool details above — DO NOT substitute a generic small-planet-in-black-space.

Output ONLY the raw 90-120 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ### markers, NO **bold labels**. Just the phrases, starting immediately with the scene content.`;
  },

  RING_HABITAT: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      habitat_zone,
      curve_overhead,
      axis_light,
      endcap,
      habitat_detail,
      scale_prover,
      habitat_event,
    } = slots;

    const eventSection = habitat_event
      ? `
━━━ HABITAT EVENT — a moment of life woven into the world (mid/deep distance) ━━━
${habitat_event}

Place this within the curved world — it adds life and scale but the WORLD-CURVE stays the hero.

`
      : '';

    return `You are a sci-fi concept-art painter writing a jaw-dropping INTERIOR VISTA of a colossal rotating space habitat for StarBot — an O'Neill cylinder / ring-world interior where an entire enclosed world wraps around the inside of a spinning drum. Same universe as our cosmic vistas and megastructures. The "the ground is the sky" gut-punch is the whole point. Output wraps with style prefix + suffix.

━━━ THE CURVE — ABSOLUTE FIRST RULE ━━━
This is the INSIDE of a giant rotating cylinder. The land does NOT lie flat under an open sky — it CURVES UP both side walls and ARCS OVER THE TOP, so the far side of the world hangs UPSIDE-DOWN overhead like a ceiling of terrain. The horizon CURVES UPWARD on both sides, not down. Looking up, you see more land — cities, fields, rivers — hanging in the sky above. This upward-wrapping world-curve is the HERO of the image and MUST be unmistakable.

━━━ THE WORLD-CURVE FRAMING ━━━
${curve_overhead}

━━━ THE LANDSCAPE INSIDE (the terrain wrapping the drum) ━━━
${habitat_zone}

Render this terrain wrapping the full interior — in the foreground at the bottom, sweeping up both curved walls, and continuing overhead on the far side. It is ONE continuous enclosed world seen from within.

━━━ THE AXIAL SUN (the world's light source) ━━━
${axis_light}

This runs down the central long axis of the cylinder and lights the whole interior — it is the sun of this world. Light falls from the centerline outward onto the curved land.

━━━ THE FAR ENDCAP ━━━
${endcap}

The cylinder is closed at the far end by this colossal endcap, far in the distance, with atmospheric haze between here and there conveying the immense length of the world.

━━━ INTERIOR WONDER — mid-scale detail ━━━
${habitat_detail}

━━━ SCALE PROOF — tiny human-scale detail that sells the impossible size ━━━
${scale_prover}

These must be TINY against the world-curve — towns, fields, vehicles, or a lone figure dwarfed to specks. They prove the habitat is kilometers across. Without them the scale reads flat.
${eventSection}
━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ ATMOSPHERE + DEPTH ━━━
This is a HABITABLE interior — it has air, weather, and atmospheric haze. Build deep atmospheric perspective: crisp detail near, softening to luminous haze along the axis toward the distant endcap. Clouds may drift at the weightless centerline. The air gives the colossal interior its sense of scale and depth.

━━━ COMPOSITION ━━━
Cinematic wide vista. Camera INSIDE the cylinder, looking along or across its length so the UPWARD-CURVING horizon and the overhead far-side terrain are both clearly visible. Foreground terrain detail at the bottom, the world sweeping up and over, the axial sun blazing down the center, the endcap hazed in the deep distance. NEVER a flat-ground-under-open-sky landscape — the world ALWAYS wraps overhead. NO single object centered and dominating — the WORLD is the subject.

━━━ STRUCTURE (write the prompt in this exact order) ━━━
[OPENING — a breathtaking wide interior vista inside a colossal rotating space habitat, the landscape curving up the walls and arcing overhead — the world-curve leads], [the terrain wrapping the drum — foreground, up the walls, overhead], [the glowing axial sun down the centerline], [the distant endcap hazed far away], [tiny towns / fields / vehicles proving the kilometer scale], [atmospheric depth and haze], [color palette and awestruck mood]

CRITICAL — the OPENING tokens establish "[interior of a giant rotating habitat, land curving up and overhead]" — the world-curve leads. Render the EXACT slot-pool details above — DO NOT substitute generic flat landscapes. The upward-wrapping curve is non-negotiable.

Output ONLY the raw 90-120 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ### markers, NO **bold labels**. Just the phrases, starting immediately with the scene content.`;
  },

  SPACEWALK: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      suit,
      eva_action,
      visor_reflection,
      void_backdrop,
      nearby_structure,
      suit_detail,
      cosmic_event,
    } = slots;

    const eventSection = cosmic_event
      ? `
━━━ COSMIC EVENT — a distant drama beat woven into the void (deep background, NOT touching the figure) ━━━
${cosmic_event}

Place this far away in the deep background — it adds story and scale but must NOT crowd the figure or the foreground structure. The figure stays the readable hero; this is a distant wonder beyond them.

`
      : '';

    return `You are a sci-fi concept-art painter writing the single most iconic SPACE image for StarBot — a ZERO-GRAVITY SPACEWALK. One lone suited figure FLOATING in the open vacuum of space, weightless, caught in a candid loaded instant of an EVA. Same universe as our cosmic vistas and alien worlds. Think the breath-held silence of Gravity / 2001 / Interstellar — a real human-scale figure dwarfed by, but vivid against, the overwhelming cosmos. Output wraps with style prefix + suffix.

━━━ ZERO-G — ABSOLUTE FIRST RULE ━━━
The figure FLOATS. Weightless, free-falling in vacuum — NO feet on any ground, NO standing pose, NO "down" direction. Limbs drift, the safety tether snakes loose in a slow curve, the body is oriented at a cinematic diagonal (NOT bolt-upright). This is the OPPOSITE of standing on a planet. Free-float body language in EVERY pose.

━━━ OPEN SPACE — ALWAYS THE AIRLESS VOID (positive anchor) ━━━
The setting is ALWAYS the open airless black void of outer space — high above any world, in hard vacuum, surrounded by the star-field and the cosmic backdrop below. The environment is pure orbital space: the curve of a planet seen from orbit, a nebula, a star, or a colossal spacecraft hull adrift in the black. The safety tether is a loose weightless line floating in vacuum (NOT a taut climbing rope). Keep the whole frame in deep space — the void backdrop below is a WORLD SEEN FROM ORBIT, sky and vacuum, never a ground-level landscape the figure could stand in.

━━━ THE EVA ACTION — what the figure is doing in this exact frame (verb leads the prompt) ━━━
${eva_action}

Render this action EXACTLY, captured at a loaded mid-instant — the body position flows from the action, in free-fall.

━━━ CO-HEROES — THE FIGURE AND THE VOID, BOTH FULLY DETAILED ━━━
This render has TWO heroes and both must be richly rendered:
1. THE FIGURE — a single suited astronaut, ~20-35% of the frame, FULL BODY visible, suit and gear tack-sharp and READABLE. Not a tiny lost speck, not a centered portrait — a readable human-scale figure floating in the vast frame.
2. THE VOID — the cosmic environment behind and around them fills the remaining 65%+ of frame with breathtaking, detailed deep-space spectacle. NEVER an empty black background — the void is alive with the backdrop below.

━━━ THE SUIT (the figure's identity — render every detail) ━━━
${suit}

The suit is SEALED — this is hard vacuum. The helmet is on, visor down. Render the suit's silhouette, material/finish, plating, joints, and glowing tech EXACTLY as described — crisp and readable at full-body scale.

━━━ THE VISOR REFLECTION — the signature detail ━━━
${visor_reflection}

The curved helmet visor is a mirror — render this reflection clearly across the faceplate. It is the soul of the shot. The face behind it may be a faint silhouette or hidden in glare — the REFLECTION is the hero of the helmet.

━━━ SUIT / GEAR DETAILS (render these on the suit) ━━━
${suit_detail}

━━━ THE VOID BACKDROP (the cosmic environment — the "out in space" hero) ━━━
${void_backdrop}

This dominates the deep background — colossal, detailed, breathtaking. The figure floats AGAINST it. Render it with full atmospheric depth, color, and scale so the frame screams "we are OUT IN SPACE."

━━━ FOREGROUND STRUCTURE — hard-surface tech near the figure ━━━
${nearby_structure}

This grounds the figure in a real place in space and adds tactile foreground detail — panels, rivets, antennae, cabling. The figure interacts with or floats just off it.
${eventSection}
━━━ LIGHTING ━━━
${lighting}

Harsh, directional sunlight in vacuum — brilliant rim-light on one side of the suit, deep black shadow on the other, with soft fill bouncing off the void backdrop (planet-glow, nebula-wash). High dynamic range, cinematic.

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ SOLO FIGURE ONLY ━━━
EXACTLY ONE suited figure (a distant second EVA figure is allowed ONLY if the cosmic-event slot above named one). No crowds. This astronaut ALONE in the silence.

━━━ NO FRANCHISE NAMES ━━━
Describe the suit and tech by their FEATURES, never by franchise / trademark. No "EVA", "NASA", "spacesuit-model", brand, or named-program text in the output — describe the hardware.

━━━ COMPOSITION ━━━
Cinematic wide film-still. The figure floats OFF-CENTER (rule of thirds), oriented at a dramatic diagonal, full-body. The void backdrop fills the majority of the frame behind them with deep, detailed spectacle. Foreground structure anchors one edge or corner. Strong sense of scale, isolation, and silence. NEVER a centered head-and-shoulders portrait. NEVER an empty black frame.

━━━ STRUCTURE (write the prompt in this exact order) ━━━
[OPENING — a wide cinematic shot of a lone suited astronaut FLOATING weightless in space, DOING THE EXACT EVA ACTION — the action verb leads], [the suit rendered in full material detail — plating / joints / glowing tech / gear], [the visor reflection mirroring the cosmos], [the colossal void backdrop filling the frame behind them], [the foreground structure they float against], [lighting — harsh vacuum sun + void-glow fill], [color palette and silent, awestruck mood]

CRITICAL — the OPENING tokens are "[lone astronaut] [FLOATING / DOING ACTION] in space" — the zero-g action leads. The figure is readable full-body at 20-35% of frame; the void fills the rest with detailed deep-space spectacle. Render the EXACT slot-pool details above — DO NOT substitute generic descriptions.

Output ONLY the raw 90-120 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ### markers, NO **bold labels**. Just the phrases, starting immediately with the scene content.`;
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
${vibeDirective.slice(0, 150)}

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
${vibeDirective.slice(0, 150)}

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
      wavelength_signature,
      structural_detail,
      color_palette_band,
      scale_anchor,
      composition_focus,
      narrative_phase,
      event,
    } = slots;

    const eventSection = event
      ? `
━━━ COSMIC EVENT — render this drama visibly ACTIVE in the scene ━━━
${event}

The event is happening RIGHT NOW in the frame — caught mid-detonation, mid-collision, mid-eruption. If the subject above already shows a similar phenomenon, AMPLIFY it (more violent, more luminous, more visible). If the subject is more static (a planet / moon / asteroid field), the event happens behind/beyond it.

`
      : '';

    // Probabilistic axis gating DISABLED 2026-05-31 — Kevin's call: "let it
    // rip" — all 5 accent axes always-on. Restore by flipping the constants
    // back to Math.random() < 0.5 to re-enable per-render gating.
    const includeStructural = true;
    const includePalette = true;
    const includeScaleAnchor = true;
    const includeComposition = true;
    const includeNarrative = true;
    const structuralSection = includeStructural
      ? `
━━━ STRUCTURAL DETAIL — name the specific physical feature(s) visible ━━━
${structural_detail}

Bake the named structure into the prompt as a specific phrase (e.g. "twin polar jets venting at relativistic speed" / "two-arm spiral with razor-sharp dust lanes"). This is the readable-focus element.

`
      : '';
    const paletteSection = includePalette
      ? `
━━━ FALSE-COLOR PALETTE BAND — the wavelength-mapped color treatment ━━━
${color_palette_band}

Wash the whole scene in this exact color band — every layer rendered in the named hue family. NOT a generic "vibrant" — name the specific palette.

`
      : '';
    const scaleAnchorSection = includeScaleAnchor
      ? `
━━━ SCALE ANCHOR — astro-specific scale-prover ━━━
${scale_anchor}

This is in ADDITION to the universal scale_provers above. Specifically astronomical (foreground asteroid silhouette / nearby star with diffraction cross / approaching probe / contrasting smaller galaxy beside the subject).

`
      : '';
    const compositionSection = includeComposition
      ? `
━━━ ASTRO COMPOSITION FOCUS ━━━
${composition_focus}

This is the composition framing — apply on top of the universal composition_frame above. Astronomical framing: edge-on disk / spiral-arm hero / centered jewel-box / merging-galaxies pair / nebula-into-void wide / etc.

`
      : '';
    const narrativeSection = includeNarrative
      ? `
━━━ NARRATIVE PHASE — the cosmic moment captured ━━━
${narrative_phase}

The frame is captured at THIS specific phase of cosmic time (star formation / supernova death / galaxy merger / quiet majesty / aftermath / discovery / etc.). Bend the story_beat above to this phase.

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

━━━ WAVELENGTH SIGNATURE — the telescope/instrument tradition that defines the aesthetic ━━━
${wavelength_signature}

This sets the WHOLE rendering tradition — open the polished prompt with this. Hubble visible-light reads differently than JWST IR-mapped reads differently than Chandra X-ray pseudo-color reads differently than ALMA radio. Anchor the entire aesthetic on the named instrument.
${structuralSection}${paletteSection}${scaleAnchorSection}${compositionSection}${narrativeSection}${eventSection}
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
${vibeDirective.slice(0, 150)}

━━━ STRUCTURE — write 100-130 words ━━━
Open with the SUBJECT and its named instrument/wavelength. Layer in: spectral / color details (saturated multi-wavelength composite), composition framing, atmospheric/instrumental glow effects, scale-prover positioning, the secondary surprise element. ONE haunting detail (impossible color, time-dilated light, gravitational lensing arc, X-ray jet at relativistic speed). Photoreal astrophotography finish, cranked saturation, glowing depth.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**. Just the scene content.`;
  },
};
