/**
 * DreamBot archetype templates — only the active bubble-bot-dreams path.
 *
 * Dormant CHIBIBOT_* templates removed (cross-bot registry rejects duplicate
 * names; ChibiBot still owns them). DreamBot's only active path is
 * bubble-bot-dreams.
 *
 * Auto-discovered by scripts/lib/archetypeRegistry.js.
 */

module.exports = {
  // DreamBot bubble-bot-dreams — canonical axis rebuild (2026-06-12).
  // Deliberately NO lookOverride() — this path is locked to the chibibot_render
  // medium (its consistent glossy designer-vinyl look), NOT the rolled look-
  // register. The 4 figure axes assemble the consistent hero; the environment
  // axes build a bold creative co-star world; the dome mirrors it.
  DREAMBOT_BUBBLE_BOT: ({ slots }) => {
    const { bot_body, bot_dome, bot_eyes, bot_pose, dream_world, light_mood } = slots;
    const detail = (Array.isArray(slots.world_detail) ? slots.world_detail : [slots.world_detail])
      .filter(Boolean)
      .join('; ');
    const atmo = (Array.isArray(slots.atmosphere) ? slots.atmosphere : [slots.atmosphere])
      .filter(Boolean)
      .join('; ');

    return `You are writing ONE frame-worthy magical phone-wallpaper render for DreamBot — an adorable glossy "bubble-bot" designer-toy as the focal hero of a bold, imaginative, COLORFUL dream world. Vertical, cinematic, dreamy, poster-worthy. Output wraps with the style prefix + suffix.

━━━ THE HERO — the bubble-bot (a cute glossy designer-toy, NOT a human, NOT a realistic robot) ━━━
A small round chibi designer-toy bubble-bot — assemble it from EXACTLY these parts and keep it the focal hero:
• body: ${bot_body}
• head: ${bot_dome}
• eyes: ${bot_eyes}
• pose: ${bot_pose}
Chibi proportions (big rounded domed head, soft stubby body). Small-to-medium in the lower-center of the frame — never filling it, never a close-up. Render its POSE with full life and energy — if the pose is an action (running, jumping, climbing, reaching, exploring), make it dynamic and mid-motion; if serene, calm and charming. Always expressive and full of personality.

━━━ THE DREAM WORLD (the CO-STAR — build it bold, dense, sharp, and CREATIVE) ━━━
${dream_world}
Layer in: ${detail}
Render this as a FULLY-REALIZED, imaginative world — colorful, dynamic, packed with specific creative detail, rendered SHARP and deep (NOT a blurred or empty backdrop). Grand scale and real layered depth: a detailed foreground, the rich world rising and receding around the bot, a glowing horizon beyond. Commit hard to its signature elements — towering, teeming, swirling, glowing. The world matters as much as the hero; it should be a place you'd want to step inside.

━━━ MONEY SHOT — the dome mirrors the world ━━━
The bubble-bot's glossy dome/visor REFLECTS the dream world around it — the scene curving across its surface in miniature. This reflection is the signature detail; make it readable. NO text, letters, logos, or words anywhere on the dome or in the image.

━━━ LIGHT + PALETTE ━━━
${light_mood}
Commit fully to this dreamy light and pastel palette — soft, luminous, magical, frame-worthy.

━━━ DREAMY ATMOSPHERE (weave both naturally; never let them bury the hero) ━━━
${atmo}

━━━ COMPOSITION + RULES ━━━
Vertical 9:16 phone-wallpaper. The bubble-bot is the clear focal hero, small-to-medium in the lower-center, gazing into the world; the imaginative world fills the frame richly around and behind it with depth and detail. CRITICAL: render the WHOLE WORLD in SHARP focus, crisp and fully visible to the horizon — this is NOT a studio product shot, NOT a shallow depth-of-field portrait, NOT a blurred / bokeh / empty background. The environment is detailed and in-focus, a real place, edge to edge. Glossy, polished, ultra-clean, frame-worthy. NO humans, NO people, NO text, NO words, NO watermarks.

Write the Flux prompt OPENING with the bubble-bot hero (body + dome + eyes), then place it into the richly-detailed dream world. Output ONLY the raw Flux prompt as one flowing paragraph, ~95-130 words. No preamble, no labels.`;
  },

  // DreamBot dreamscape — scene-as-hero candy-fantasy world vista (2026-06-27).
  // The WORLD is the hero (no character). Holds the LOOK constant (own medium +
  // candy palette + dreamy light) while the world axis spans ~12 biomes. The
  // three conditional slots (whimsical_structure / dream_event / tiny_creature)
  // are woven in only when they fired (composer leaves them undefined otherwise).
  DREAMBOT_DREAMSCAPE: ({ slots }) => {
    const { world, foreground, palette, atmosphere, sky } = slots;
    const flora = (Array.isArray(slots.flora) ? slots.flora : [slots.flora])
      .filter(Boolean)
      .join('; ');
    const structure = slots.whimsical_structure;
    const event = slots.dream_event;
    const creature = slots.tiny_creature;

    return `You are writing ONE frame-worthy magical phone-wallpaper render for DreamBot — a lush, hyper-saturated, candy-colored FANTASY WORLD where the WORLD ITSELF is the hero (NOT a character, NOT a product). Vertical, cinematic, dreamy, poster-worthy. Output wraps with the style prefix + suffix.

━━━ THE DREAM WORLD (THE HERO — build it bold, dense, lush, sharp, and CREATIVE) ━━━
${world}
This world fills the frame and IS the show. Render it as a fully-realized, jaw-dropping place with real layered depth: a detailed foreground anchoring the bottom, the lush world rising and receding around it, a glowing horizon beyond. Commit hard to its signature wonder — towering, teeming, glowing, alive. A place you'd want to step inside.

━━━ HERO FLORA (the lush oversized plant-life that packs the world) ━━━
Layer in, big and abundant: ${flora}.

━━━ FOREGROUND ANCHOR (grounds the bottom, leads the eye in) ━━━
${foreground}
${structure ? `
━━━ WHIMSICAL ARCHITECTURE (a charming accent nestled INTO the world — NOT dominating it) ━━━
${structure}
Tuck it naturally among the flora as a storybook accent; the world stays the hero.
` : ''}${creature ? `
━━━ A TINY HIDDEN CREATURE (rare ambient life — a delightful detail you discover, NEVER the focus) ━━━
${creature}
Keep it SMALL and dwarfed by the world — a tiny resident, not the subject. It is a creature, NEVER a human.
` : ''}${event ? `
━━━ A MAGICAL MOMENT (a beat of motion bringing the scene alive) ━━━
${event}
` : ''}
━━━ COLOR STORY (commit fully — designed, cohesive, never a random color salad) ━━━
${palette}

━━━ LIGHT + ATMOSPHERE (cinematic, dreamy, magical) ━━━
${atmosphere}

━━━ SKY OVERHEAD ━━━
${sky}

━━━ ZERO HUMANS — NEVER, UNDER ANY CIRCUMSTANCES ━━━
NEVER a human, a person, a child, or a humanoid figure anywhere in the frame — NOT walking the path, NOT on a balcony, NOT a tiny silhouette for scale. This is an UNINHABITED magical world. Flux's training data WILL try to place a lone figure walking into the misty distance at the end of a stream / path — the vanishing point stays EMPTY: no lone person, no silhouette at the end of the walkway. If Flux's instinct is a figure, render the same scene without one.

━━━ COMPOSITION + RULES ━━━
Vertical 9:16 phone-wallpaper. The lush world fills the frame edge to edge with real depth — foreground, midground, glowing horizon. CRITICAL: render the WHOLE WORLD in SHARP, deep focus, crisp and fully visible to the horizon — this is NOT a studio product shot, NOT a shallow depth-of-field portrait, NOT a blurred / bokeh / empty background. Dense and abundant, yet COHESIVE and designed — rhythm and readable depth, not a chaotic spammy jumble. Cinematic, hyperreal, ultra-saturated, frame-worthy. NO text, NO words, NO watermarks.

Write the Flux prompt OPENING with the dream world + its hero flora, then layer in the foreground, any accents, the color story, light, and sky. Output ONLY the raw Flux prompt as one flowing paragraph, ~95-130 words. No preamble, no labels.`;
  },

  // DreamBot butterfly-realm — striking butterflies in a VIVID, COLORFUL, SURREAL
  // dream-world (2026-06-27, R4). The BUTTERFLIES are the hero (lead with them).
  // R0 spammy/flowery, R3 too swirly, then "pretty good but a bit conservative /
  // pedestrian — make it a vivid FUN dream-world, NOT rooted in realism" (Kevin).
  // R4 fix: PUSH the WORLD vivid/surreal/colorful (like the dreamscape path) while
  // keeping the butterflies the big-crisp-striking hero + atmospheric DEPTH so they
  // pop. Clean graceful arrangements (NO swirly background chaos), no flower-garden,
  // no humans. Color via `palette`; surreal dream-element via `whimsy`.
  DREAMBOT_BUTTERFLY_REALM: ({ slots }) => {
    const { setting, feature, composition, palette, whimsy, atmosphere } = slots;

    return `You are writing ONE breathtaking, frame-worthy phone-wallpaper render for DreamBot — a VIVID, COLORFUL, SURREAL fantasy DREAM-WORLD where STRIKING BUTTERFLIES are the unmistakable hero, rendered as a LUSH PAINTERLY STORYBOOK ILLUSTRATION (luminous, hand-painted, glowing from within — NOT a glossy 3D game-render, NOT crisp plastic clip-art). This is a DREAM, NOT rooted in realism: lean into wonder, saturated color, and magic. Vertical, cinematic, poster-worthy. Output wraps with the style prefix + suffix.

━━━ THE BUTTERFLIES (THE HERO — striking, vivid, painted INTO the dream-world) ━━━
Color story: ${palette}
Arrangement: ${composition}
A FEW butterflies are LARGE and bold in the near foreground (luminous painterly wings glowing with iridescent color) — the eye lands on them FIRST — with a SPARSE, graceful scatter of smaller ones behind. CRITICAL: never a uniform frame-filling CARPET of same-size butterflies — a few clear HEROES dominate, the rest are few and softly placed. They are gorgeous and unmistakably the subject, but painted INTO the scene with the same luminous storybook brush as the world (NOT crisp glossy stickers pasted on top).

━━━ THE DREAM-WORLD (the CO-STAR — a deep, cohesive, PAINTERLY storybook world) ━━━
Setting: ${setting}
One striking focal anchor: ${feature}
Render this as a JAW-DROPPING painterly fantasy dream-world — saturated, luminous, magical, lavishly hand-painted, with real layered DEPTH (foreground anchor, the world receding into glowing atmospheric haze, a luminous horizon beyond). Like a beautiful storybook illustration glowing from within, NOT a literal nature photo, NOT a flat game-render, NOT a muted gray misty forest. Keep it COHESIVE and deep so the butterflies belong IN the world. This is NOT a flower garden — do not fill it with flowers or busy undergrowth.

━━━ THE WHIMSY (this is a DREAM — one surreal, magical, otherworldly touch) ━━━
${whimsy}
Weave this in as ONE clean, graceful, wondrous element — surreal and dreamlike. Render it SIMPLY and beautifully: NO chaotic swirling vortexes, NO busy spiral patterns, NO churning fog crowding the frame — clean dream-magic, not visual noise.

━━━ LIGHT + ATMOSPHERE (dreamy, luminous, colorful) ━━━
${atmosphere}
Commit to dreamy, luminous light with real atmospheric depth — the glow makes the butterfly wings shimmer and the world feel magical.

━━━ ZERO HUMANS — NEVER, UNDER ANY CIRCUMSTANCES ━━━
NEVER a human, a person, or a figure anywhere in the frame. Flux's training data WILL try to add a LONE FIGURE STANDING ON A CLIFFTOP / PEAK / ROCK GAZING UP at the butterflies or the vista — there is NO such person: the clifftop / ledge / summit is EMPTY. Also NOT a silhouette in the distance, NOT someone walking a path, NOT a figure watching the swarm. The only "characters" are the butterflies. If Flux's instinct is to place a person admiring the scene, render the exact same scene with the vantage point EMPTY.

━━━ COMPOSITION + RULES ━━━
Vertical 9:16 phone-wallpaper. A FEW large bold butterflies are the clear focal hero in the near field, with only a sparse graceful scatter behind — set into a vivid, painterly, surreal dream-world with real atmospheric depth so they belong IN it. Everything is lush hand-painted storybook illustration glowing from within — NOT a glossy 3D game-render, NOT crisp plastic clip-art, NOT a uniform frame-filling carpet of butterflies, NOT a flower garden, NO swirling background noise. Cinematic, dreamy, ultra-vivid, frame-worthy. NO text, NO words, NO watermarks.

Write the Flux prompt OPENING with the striking butterflies (their color + arrangement), then paint them into the vivid surreal storybook dream-world with its anchor, the whimsy dream-element, and luminous light. Output ONLY the raw Flux prompt as one flowing paragraph, ~95-125 words. No preamble, no labels.`;
  },

  // DreamBot dream-spires — scene-as-hero whimsical fairytale TOWER-CITY
  // (2026-06-27). The impossible whimsical tower-city is the hero (lead with it).
  // EXTERIOR VISTAS ONLY (Kevin: no cozy interior POV). Painterly storybook
  // register (matches dreamscape + butterfly R5). charm_details arrive as an
  // array (pickN 2); whimsy is gated (~40% — undefined otherwise; the composer
  // omits its block when it didn't fire).
  DREAMBOT_DREAM_SPIRES: ({ slots }) => {
    const { spire_world, palette, vantage, light_sky } = slots;
    const charm = (Array.isArray(slots.charm_details) ? slots.charm_details : [slots.charm_details])
      .filter(Boolean)
      .join('; ');
    const whimsy = slots.whimsy;

    return `You are writing ONE breathtaking, frame-worthy phone-wallpaper render for DreamBot — an IMPOSSIBLE, WHIMSICAL FAIRYTALE TOWER-CITY where the dream-city ITSELF is the hero (NOT a character, NOT a product), rendered as a LUSH PAINTERLY STORYBOOK ILLUSTRATION (luminous, lavishly hand-painted, glowing from within — NOT a flat 3D game-render). Think Dr. Seuss meets Studio Ghibli: absurdly tall, slender, gently TWISTING towers stacked with round lantern-lit windows and balconies. Vertical, cinematic, dreamy, poster-worthy. Output wraps with the style prefix + suffix.

━━━ THE TOWER-CITY (THE HERO — build it tall, dense, whimsical, and ENCHANTING) ━━━
${spire_world}
This whimsical tower-city fills the frame and IS the show. Render it as a fully-realized, jaw-dropping place with real layered DEPTH: detailed towers in the foreground, the spire-city receding and rising around them, a hazy horizon of more distant spires beyond. The towers are impossibly tall and slender, gently spiraling/twisting, packed with charming round windows glowing warm gold. A magical, peaceful dream-city — the architecture is always the hero.

━━━ COLOR STORY (commit fully — soft candy-pastel, designed and cohesive) ━━━
${palette}
Each tower a different soft pastel hue; the whole city reads as one cohesive candy-pastel palette, never a random color salad.

━━━ THE CHARM LAYER (the signature whimsical details — weave in naturally) ━━━
${charm}
These decorative details make it magical; layer them through the towers, never letting them clutter the silhouette. Keep it serene — NO crowds, NO market vendors, NO bustling marketplace filling the foreground.

━━━ VANTAGE (the exterior camera — an outside view of the city) ━━━
${vantage}
This is always an EXTERIOR view OF the tower-city — never an indoor room. Lead the eye up and through the spires with real depth.
${whimsy ? `
━━━ A DREAM ELEMENT (one surreal, magical touch in the sky/air — this is a DREAM) ━━━
${whimsy}
Weave it in simply and beautifully as ONE graceful accent — never cluttering the city.
` : ''}
━━━ LIGHT + SKY ━━━
${light_sky}
Commit to dreamy, luminous light and a soft painterly sky; the windows glow warm against it.

━━━ THE CITY IS THE HERO — NO FOREGROUND PEOPLE, NO CROWDS ━━━
The tower-city architecture is ALWAYS the subject. Never a person in the foreground, never a face, never a crowd, never a marketplace of vendors, never a lone figure posed for scale dominating the frame. If any residents appear at all they are TINY and DISTANT — barely-there specks of life glimpsed on a far balcony or bridge, adding scale and warmth, never a focal point. When in doubt, leave the walkways empty.

━━━ COMPOSITION + RULES ━━━
Vertical 9:16 phone-wallpaper. The whimsical tower-city fills the frame edge to edge with real depth — foreground towers, the city rising and receding, a glowing horizon of distant spires. Everything is lush hand-painted storybook illustration glowing from within — NOT a flat 3D game-render, NOT photoreal, NOT a modern city. Dense and abundant yet COHESIVE and designed, readable depth, never a chaotic jumble. Cinematic, dreamy, whimsical, frame-worthy. NO text, NO words, NO watermarks.

Write the Flux prompt OPENING with the whimsical tower-city (its formation + towers), then layer in the color story, the charm details, the exterior vantage, any dream element, and the light + sky. Output ONLY the raw Flux prompt as one flowing paragraph, ~95-130 words. No preamble, no labels.`;
  },

  // DreamBot far-eden — scene-as-hero HAPPY fantasy ALIEN WORLD (2026-06-28).
  // "Brochure shots of alien worlds": original, beautiful, INVITING paradise
  // vistas (Kevin: steered away from sci-fi's dark/serious default). LOOK-NEUTRAL
  // on rendering technique (says only "cinematic / vivid / luminous") so the
  // MEDIUM decides hyperreal vs painterly — far-eden + far-eden-soft share this
  // template. cosmic_sky is the signature money-shot axis (always-on). Gated
  // slots arrive undefined when they don't fire; the composer omits their blocks.
  DREAMBOT_FAR_EDEN: ({ slots }) => {
    const { world, cosmic_sky, palette, atmosphere } = slots;
    const flora = (Array.isArray(slots.flora) ? slots.flora : [slots.flora])
      .filter(Boolean)
      .join('; ');
    const glow = slots.terrain_glow;
    const life = slots.life_accent;
    const structure = slots.wonder_structure;
    const event = slots.dream_event;

    return `You are writing ONE breathtaking, frame-worthy phone-wallpaper render for DreamBot — an ORIGINAL, beautiful FANTASY ALIEN WORLD where the otherworldly landscape ITSELF is the hero (NOT a character, NOT a product). This is a "brochure shot of an alien paradise": a wondrous, inviting, jaw-dropping place you wish you could visit. Vertical, cinematic, dreamy, poster-worthy. Output wraps with the style prefix + suffix.

━━━ HAPPY, BEAUTIFUL, ALLURING — THE #1 RULE ━━━
This alien world is JOYFUL and INVITING — gorgeous, alluring, full of wonder and life. It is a PARADISE, a place that makes you smile and want to step inside. NEVER dark, NEVER ominous, NEVER bleak, NEVER a grim / derelict / dystopian sci-fi wasteland. No menace, no horror, no decay, no cold lifeless void — beautiful and warm and alive, always.

━━━ THE ALIEN WORLD (THE HERO — original, bold, lush, and ENCHANTING) ━━━
${world}
This otherworldly landscape fills the frame and IS the show — an ORIGINAL alien world (never Earth, never a known movie or game world). Render it as a fully-realized, jaw-dropping place with real layered DEPTH: a detailed foreground anchoring the bottom, the world rising and receding around it, a luminous horizon beyond. Commit hard to its signature wonder.

━━━ THE COSMIC SKY (the signature wonder overhead — a beautiful celestial spectacle) ━━━
${cosmic_sky}
The sky is a major, breathtaking part of the frame — a stunning celestial sight hanging over the paradise below. Render it as WONDER and beauty (soft, luminous, awe-inspiring), never as threat or doom.

━━━ ALIEN FLORA (the lush, exotic plant-life that packs the world) ━━━
Layer in, big and abundant: ${flora}.

━━━ COLOR STORY (commit fully — joyful, designed, cohesive, never a muddy color salad) ━━━
${palette}

━━━ LIGHT + ATMOSPHERE (cinematic, dreamy, inviting) ━━━
${atmosphere}
${glow ? `
━━━ GLOWING TERRAIN (the land emits its own soft light) ━━━
${glow}
Weave this self-lit glow naturally through the world — luminous and magical, but still warm and inviting.
` : ''}${structure ? `
━━━ A DISTANT WONDER (one beautiful, far-off alien marvel — NOT dominating) ━━━
${structure}
Keep it DISTANT and elegant on the horizon as a graceful accent — beautiful and inviting, never grim or derelict. The natural world stays the hero.
` : ''}${life ? `
━━━ SPARSE DISTANT LIFE (rare, far-off, gentle — adds scale + warmth, never the focus) ━━━
${life}
Keep it SMALL and DISTANT — a delightful glimpse of gentle life, never the subject. It is a creature, NEVER a human.
` : ''}${event ? `
━━━ A MAGICAL MOMENT (a beat of motion / wonder in the scene) ━━━
${event}
` : ''}
━━━ ZERO HUMANS — NEVER, UNDER ANY CIRCUMSTANCES ━━━
NEVER a human, a person, a child, an astronaut, or a humanoid figure anywhere in the frame — NOT in the foreground, NOT a tiny silhouette for scale. This is an UNINHABITED alien paradise. Flux's training data WILL try to place a lone figure standing on a ledge / clifftop gazing at the vista, or walking into the misty distance — the vantage point stays EMPTY: no lone person, no silhouette. If Flux's instinct is a figure, render the exact same scene without one.

━━━ COMPOSITION + RULES ━━━
Vertical 9:16 phone-wallpaper. The alien world fills the frame edge to edge with real depth — foreground, midground, the cosmic sky above, a glowing horizon. CRITICAL: render the WHOLE WORLD in SHARP, deep focus, crisp and fully visible to the horizon — this is NOT a studio product shot, NOT a shallow depth-of-field portrait, NOT a blurred / bokeh / empty background. Lush and abundant yet COHESIVE and designed — readable depth, never a chaotic jumble. Cinematic, vivid, luminous, frame-worthy. NO text, NO words, NO watermarks.

Write the Flux prompt OPENING with the alien world + the cosmic sky, then layer in the flora, the color story, light, and any glowing terrain / distant wonder / life / magical moment. Output ONLY the raw Flux prompt as one flowing paragraph, ~95-130 words. No preamble, no labels.`;
  },

  // DreamBot hidden-conservatory — scene-as-hero stained-glass GREENHOUSE INTERIOR
  // (2026-06-28). An overgrown garden inside a grand stained-glass cathedral/
  // conservatory; sun SHATTERS through jewel-glass into rainbow prismatic light
  // (ref: benmyhre "Stained Glass Greenhouses"). `light_effect` is the signature
  // money-shot (always-on); `atmosphere` rolls the full mood range (moody-dark ↔
  // bright) — the template keeps glass + flora + refracted light VIVID either way.
  // Gated slots (water_feature / architectural_detail / ambient_life) arrive
  // undefined when they don't fire; the composer omits their blocks.
  DREAMBOT_HIDDEN_CONSERVATORY: ({ slots }) => {
    const { conservatory, glass_palette, light_effect, vantage, atmosphere } = slots;
    const flora = (Array.isArray(slots.flora) ? slots.flora : [slots.flora])
      .filter(Boolean)
      .join('; ');
    const water = slots.water_feature;
    const detail = slots.architectural_detail;
    const life = slots.ambient_life;

    return `You are writing ONE breathtaking, frame-worthy phone-wallpaper render for DreamBot — a lush, overgrown botanical garden growing INSIDE a grand STAINED-GLASS CONSERVATORY, where sunlight pours through jewel-toned glass and SHATTERS into rainbow prismatic light across the whole scene. The room ITSELF is the hero (NOT a character, NOT a product) — a "secret garden inside a cathedral." Vertical, cinematic, photoreal, poster-worthy. Output wraps with the style prefix + suffix.

━━━ VIBRANT + ROMANTIC + MAGICAL — THE #1 RULE ━━━
However moody or bright the light, the scene is GORGEOUS, romantic, and enchanting — the stained glass, the flowers, and the refracted rainbow light are ALWAYS brilliant and vivid. A reclaimed/overgrown look (vines on the columns, green softening the stone) is welcome and beautiful, but it reads LUSH and THRIVING — NEVER grim, NEVER horror, NEVER rotting/decaying, NEVER a bleak derelict ruin. Beautiful and alive, always.

━━━ THE CONSERVATORY (THE HERO — grand stained-glass architecture overgrown with garden) ━━━
${conservatory}
This soaring stained-glass hall fills the frame and IS the show. Render it as a fully-realized, jaw-dropping interior with real layered DEPTH: a detailed foreground of plants and path, the glazed hall rising and receding around it, the great windows glowing beyond. Towering stained-glass windows and a glass roof, ornate iron/stone framing, a lush garden overtaking the floor.

━━━ THE PRISMATIC LIGHT (the signature — rainbow refraction is a MAJOR element) ━━━
${light_effect}
Commit HARD to this: the colored glass breaks the sun into brilliant rainbow light scattered across the floor, the plants, and the air. This is the whole magic of the shot — make it rich and unmistakable.

━━━ STAINED-GLASS COLOR STORY (the jewel hues of the glass + the light it casts) ━━━
${glass_palette}
The glass glows in these jewel hues, and the refracted light paints the scene in the same palette — cohesive, brilliant, never a muddy color salad.

━━━ THE LUSH GARDEN (the overgrown botanicals packing the hall) ━━━
Layer in, big and abundant: ${flora}.

━━━ VANTAGE (the interior camera) ━━━
${vantage}
Always an INTERIOR view inside the conservatory, with strong leading lines drawing the eye through the hall.

━━━ LIGHT + ATMOSPHERE + MOOD (this sets the overall mood — moody-dark OR bright, both beautiful) ━━━
${atmosphere}
${water ? `
━━━ A REFLECTIVE WATER ELEMENT (doubles the colored light) ━━━
${water}
The water mirrors the stained-glass color, doubling the magic — keep it natural to the garden.
` : ''}${detail ? `
━━━ A CHARMING ARCHITECTURAL ACCENT (a graceful detail — NOT dominating) ━━━
${detail}
Tuck it naturally into the hall as a storybook accent; the garden + glass stay the hero.
` : ''}${life ? `
━━━ TINY AMBIENT LIFE (a rare delightful detail — never the focus) ━━━
${life}
Keep it SMALL and incidental — a charming creature you notice, never the subject. It is a creature, NEVER a human.
` : ''}
━━━ ZERO HUMANS — NEVER, UNDER ANY CIRCUMSTANCES ━━━
NEVER a human, a person, a child, a gardener, or a humanoid figure anywhere in the frame — NOT on the path, NOT a tiny silhouette for scale. This is an UNINHABITED secret garden. Flux's training data WILL try to place a lone figure walking down the central aisle into the light — the path stays EMPTY: no lone person, no silhouette at the end of the walkway. If Flux's instinct is a figure, render the exact same scene without one.

━━━ COMPOSITION + RULES ━━━
Vertical 9:16 phone-wallpaper. The stained-glass conservatory fills the frame with real depth — a lush foreground, the glazed hall receding, the glowing windows beyond. A soft out-of-focus foreground curtain of blooms/leaves framing the shot is welcome, but the MID-GROUND and the hall stay SHARP and fully readable — NOT a studio product shot, NOT an all-over blurred/empty background. Lush and abundant yet COHESIVE and designed. Cinematic, photoreal, richly detailed, frame-worthy. NO text, NO words, NO watermarks.

Write the Flux prompt OPENING with the stained-glass conservatory + the rainbow prismatic light, then layer in the glass color, the lush garden, the vantage, atmosphere, and any water / architectural accent / ambient life. Output ONLY the raw Flux prompt as one flowing paragraph, ~95-130 words. No preamble, no labels.`;
  },

  DREAMBOT_BOTANICAL: ({ slots }) => {
    const { botanical, setting, light_season, framing } = slots;
    const element = slots.scene_element;
    return `You are writing ONE gorgeous, frame-worthy phone-wallpaper render for DreamBot — lush OUTDOOR PLANT-LIFE as the hero. Fine-art botanical photography. Output wraps with the style prefix + suffix.

━━━ THE BOTANICAL HERO (filling the frame) ━━━
${botanical}.

━━━ AN IMMERSIVE OUTDOOR PLACE, NOT AN OBJECT — THE #1 RULE ━━━
This is an OUTDOOR ENVIRONMENT you stand INSIDE — a lush grove, a foliage tunnel, a fern-filled hollow, a canopy seen from within, a wild hillside or garden under open sky — that fills the whole frame and surrounds the viewer. It is ALWAYS outdoors in nature: NEVER inside a greenhouse, glasshouse, conservatory, atrium, or any indoor/built interior (BANNED). It is NOT a single specimen plant centered against a blurred background, and absolutely NOT a potted/dish/bonsai/houseplant object on display (BANNED — reads as a product shot). The foliage and trees are the hero, and blossoming trees are welcome for color — a canopy of blossoms arching OVERHEAD (a flowering grove or avenue) is lovely. What's BANNED is flowers DANGLING or DRAPING DOWN in hanging sheets or curtains toward the viewer (that wisteria-curtain / flower-show look is BloomBot's territory), and a single flower bloom as the close-up subject. Blossoms belong up in the canopy or sprinkled naturally, never hanging down in draped sheets. The lush living place ITSELF is the hero. Render it as exquisite fine-art nature photography: every leaf, frond, blade, cap, and bit of bark detailed with loving precision. Beautiful, serene, never grim or dead.

━━━ STORYBOOK + NOSTALGIC MOOD — THE FEELING ━━━
Infuse a warm, wistful, storybook feeling — like a beloved page from a childhood picture-book, or a golden half-remembered afternoon. Soft nostalgic light, dreamy enchanted atmosphere, a fairy-tale hush, timeless and tender. Keep it believable fine-art photography (NOT cartoon or illustration), just suffused with that cozy storybook warmth and gentle nostalgia.

━━━ SETTING + LIGHT + FRAMING ━━━
Set it ${setting}, in ${light_season}, captured as ${framing}.
${element ? `
━━━ A SUBTLE NATURAL ACCENT (woven softly in) ━━━
Let ${element} appear as a subtle, natural feature tucked softly into the scene — secondary to and half-hidden by the lush greenery, never a centerpiece. The gorgeous botanical display stays the hero.
` : ''}
━━━ FRESH, NOT STOCK (anti-cliché) ━━━
Lean into the real, specific beauty of this plant-life — avoid the tired AI defaults (no generic glowing-blue mushrooms by default, no lone red-leaf-on-a-pond, no single potted tree). Make it a place you'd want to wander into.

━━━ COMPOSITION + RULES ━━━
Vertical 9:16 phone-wallpaper. Lush, abundant, and immersive yet cohesive and serene — foliage filling the frame, always outdoors under natural light. No people, no text, no words, no watermarks. Gorgeous, ultra-detailed, frame-worthy.

Write the Flux prompt OPENING with the immersive outdoor botanical place, then the setting, light/season, framing, and any storybook element. Output ONLY the raw Flux prompt as one flowing paragraph, ~75-105 words. No preamble, no labels.`;
  },

  DREAMBOT_PULP_FEMME: ({ slots }) => {
    const { being, hair_color, femme_hairstyle, femme_outfit, femme_pose, world, sky, lighting, shot } = slots;
    const gag = slots.gag;
    const prop = slots.prop;

    return `You are writing ONE deliriously fun, frame-worthy phone-wallpaper render for DreamBot — a RETRO PULP SCI-FI COMEDY scene straight out of the 1960s-70s space age: loony, campy, tongue-in-cheek, glamorous, and a little sexy, with a real sense of humor. A glamorous SPACE-HEROINE is the star. Painted like a vintage pulp sci-fi ILLUSTRATION (a painting, NOT a book cover). Vertical, cinematic, poster-worthy. Output wraps with the style prefix + suffix.

━━━ CRANK THE IMAGINATION — GO BIG ━━━
Be maximalist and a little UNHINGED: wild stylish props, absurd background business, over-the-top retro space-fashion, ridiculous gizmos and gadgets crammed into every corner. Surprise and delight — the weirder and more inventive, the better. Keep it CLEVER and stylish, never gross, never crude, never lazy or cheap-looking. Gloriously, gorgeously bananas.

━━━ THE STAR — assemble her from these EXACT traits (she is the #1 rule) ━━━
A glamorous retro space-heroine: a woman with ${being}, ${hair_color} hair styled in ${femme_hairstyle}, wearing ${femme_outfit}, ${femme_pose}. She is the focal hero of the scene — big, bold, FRONT-AND-CENTER, bursting with confident pin-up glamour: flirty, self-assured, a twinkle of mischief in her eye. Render her with vintage pulp-illustration glamour and lean ALL the way into the comedy and the camp.
${prop ? `She has ${prop} — a fun retro detail worked naturally into her hands or the scene.
` : ''}

━━━ THE RETRO SPACE SCENE (her setting) ━━━
${world}
Build it around her as a vivid kitschy retro-future set — chrome, fins, ray-guns, bubble-helmets, atomic-age curves, blinking gizmos — packed with playful space-age detail.

━━━ THE COSMOS (retro space-age backdrop) ━━━
${sky}
Style it RETRO and bold, like a vintage sci-fi movie poster.

━━━ LIGHT + CAMERA (drive the cinematic fidelity) ━━━
Light the scene with ${lighting}. Compose it as ${shot}. Render it RICH and HIGH-FIDELITY — crisp confident linework, lush painted shading, depth and atmosphere, packed with specific tactile retro detail in every corner.

━━━ THE HUMOR (tongue firmly in cheek) ━━━
There must be a WINK — a sight gag, an over-the-top pose, a goofy contrast. This scene is FUNNY; never po-faced or grim.
${gag ? `
━━━ A WILD PROP / SIGHT GAG (a sprinkle of crazy — work it in) ━━━
Somewhere in the scene: ${gag}. Make it land as a delightful, funny detail — woven in naturally, adding to the chaos and charm without crowding out the star.
` : ''}
━━━ SEXY-BUT-TASTEFUL ━━━
Glamour in the spirit of a vintage pulp pin-up — flirty, confident, campy. Her outfit ALWAYS fully covers her torso. Suggestive is fine; bare skin is not — NO nudity, NO bare chest, NO exposed nipples, nothing explicit. Covered, classy, and playful, like a fun retro illustration.

━━━ COMPOSITION + RULES ━━━
Vertical 9:16 phone-wallpaper, painted like a bold retro pulp sci-fi illustration — dynamic, the heroine prominent with the retro scene rich around her. Saturated, glossy, fun, frame-worthy. Her torso is FULLY COVERED by her outfit. This is the artwork ONLY: NO text, NO words, NO lettering, NO title, NO signs with writing, NO signature or artist credit, NO watermark, NO URL, NO logos, NO gore.

Write the Flux prompt OPENING with the heroine and her pose, then the retro space scene, the cosmic backdrop, and the comedic wink. Output ONLY the raw Flux prompt as one flowing paragraph, ~90-120 words. No preamble, no labels.`;
  },

  DREAMBOT_PULP_HERO: ({ slots }) => {
    const { being, hair_color, hero_hairstyle, hero_outfit, hero_pose, world, sky, lighting, shot } = slots;
    const gag = slots.gag;
    const prop = slots.prop;

    return `You are writing ONE deliriously fun, frame-worthy phone-wallpaper render for DreamBot — a RETRO PULP SCI-FI COMEDY scene straight out of the 1960s-70s space age: loony, campy, tongue-in-cheek, adventurous, and a little roguish, with a real sense of humor. A LEAN, COOL SPACE-HERO is the star. Painted like a vintage pulp sci-fi ILLUSTRATION (a painting, NOT a book cover). Vertical, cinematic, poster-worthy. Output wraps with the style prefix + suffix.

━━━ CRANK THE IMAGINATION — GO BIG ━━━
Be maximalist and a little UNHINGED: wild stylish props, absurd background business, over-the-top retro space-gear, ridiculous gizmos and gadgets crammed into every corner. Surprise and delight — the weirder and more inventive, the better. Keep it CLEVER and stylish, never gross, never crude, never lazy or cheap-looking. Gloriously, gorgeously bananas.

━━━ THE STAR — assemble him from these EXACT traits (he is the #1 rule) ━━━
A lean, handsome retro space-hero: a man with ${being}, ${hair_color} hair styled in ${hero_hairstyle}, wearing ${hero_outfit}, ${hero_pose}. He is the focal hero of the scene — big, bold, FRONT-AND-CENTER, effortlessly cool and confident: a roguish space-smuggler / cool retro leading man with a twinkle of mischief. Render him with vintage pulp-illustration adventure-cool and lean ALL the way into the comedy and the camp.
${prop ? `He has ${prop} — a fun retro detail worked naturally into his hands or the scene.
` : ''}

━━━ HE IS LEAN, COOL + MASCULINE (NOT ANDROGYNOUS) — bake this in HARD ━━━
He is LEAN and HANDSOME with a slim athletic build — effortlessly cool, NOT a bulky bodybuilder, NOT a beefcake. His pose is MASCULINE and grounded (arms crossed, gripping his ray-gun, fists ready, hands at his sides, or mid-action). He wears a PRACTICAL, masculine retro outfit. NEVER a skin-tight catsuit or spandex, NEVER shirtless or bare-chested, NEVER a hand-on-hip / cocked-hip / coy / flirty pin-up pose (that posing is ONLY for the women, never him), NEVER flamboyant, campy, effeminate, or androgynous.

━━━ THE RETRO SPACE SCENE (his setting) ━━━
${world}
Build it around him as a vivid kitschy retro-future set — chrome, fins, ray-guns, bubble-helmets, atomic-age curves, blinking gizmos — packed with playful space-age detail.

━━━ THE COSMOS (retro space-age backdrop) ━━━
${sky}
Style it RETRO and bold, like a vintage sci-fi movie poster.

━━━ LIGHT + CAMERA (drive the cinematic fidelity) ━━━
Light the scene with ${lighting}. Compose it as ${shot}. Render it RICH and HIGH-FIDELITY — crisp confident linework, lush painted shading, depth and atmosphere, packed with specific tactile retro detail in every corner.

━━━ THE HUMOR (tongue firmly in cheek) ━━━
There must be a WINK — a sight gag, a goofy contrast, a deadpan robot, a backfiring jetpack. This scene is FUNNY; never po-faced or grim.
${gag ? `
━━━ A WILD PROP / SIGHT GAG (a sprinkle of crazy — work it in) ━━━
Somewhere in the scene: ${gag}. Make it land as a delightful, funny detail — woven in naturally, adding to the chaos and charm without crowding out the star.
` : ''}
━━━ COMPOSITION + RULES ━━━
Vertical 9:16 phone-wallpaper, painted like a bold retro pulp sci-fi illustration — dynamic, the hero prominent with the retro scene rich around him. Saturated, glossy, fun, frame-worthy. He is always FULLY DRESSED in his practical retro outfit — never shirtless. This is the artwork ONLY: NO text, NO words, NO lettering, NO title, NO signs with writing, NO signature or artist credit, NO watermark, NO URL, NO logos, NO gore.

Write the Flux prompt OPENING with the hero and his action, then the retro space scene, the cosmic backdrop, and the comedic wink. Output ONLY the raw Flux prompt as one flowing paragraph, ~90-120 words. No preamble, no labels.`;
  },

};
