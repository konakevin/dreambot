/**
 * chibibot archetype templates — Sonnet brief composer functions.
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
};
