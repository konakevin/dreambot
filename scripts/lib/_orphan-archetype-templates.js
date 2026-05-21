/**
 * Orphan archetype templates — paired with _orphan-archetypes.js.
 */
module.exports = {
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
};
