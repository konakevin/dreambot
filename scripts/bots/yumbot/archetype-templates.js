/**
 * yumbot archetype templates — Sonnet brief composer functions.
 *
 * Each function takes the rolled slots + sharedDNA + vibeDirective and
 * returns the final brief string sent to Sonnet for polish.
 *
 * Auto-discovered by scripts/lib/archetypeRegistry.js.
 *
 * To add a new template: add an entry here + the matching archetype
 * definition in ./archetypes.js.
 */

const { YUMBOT_NIGHTTIME_BLOCK, YUMBOT_LOOK_OVERRIDE } = require('./shared-blocks');

// Fallback look register for the bucket-aggregated paths whose templates
// previously inlined it (used when no sharedDNA.lookRegister rolled).
const LOOK_FALLBACK =
  'Soft warm watercolor kawaii illustration — visible paper texture, gentle pigment washes, hand-drawn pencil-line outline, cozy picture-book register.';

module.exports = {
  YUMBOT_FLORAL_GARDEN_CUP: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      vessel,
      overflowing_flora,
      tabletop_scatter,
      frame_branches,
      palette,
      background,
      lighting,
      night_mode,
    } = slots;
    const floraList = Array.isArray(overflowing_flora) ? overflowing_flora : [overflowing_flora];
    const floraBlock = floraList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');
    const scatterList = Array.isArray(tabletop_scatter) ? tabletop_scatter : [tabletop_scatter];
    const scatterBlock = scatterList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');

    return `${YUMBOT_LOOK_OVERRIDE(sharedDNA)}You are writing FLORAL-GARDEN-CUP renders for YumBot — bex.ai's signature look. A kawaii-faced VESSEL (teacup / takeout-cup / mug / bowl) OVERFLOWING with a magical garden of flowers. Painterly Pop-Mart-illustration-fusion register. Output wraps with style prefix + suffix.
${YUMBOT_NIGHTTIME_BLOCK(
  night_mode,
  'The vessel + bouquet are at NIGHT on a tabletop in a moonlit garden / candlelit interior.'
)}
━━━ THE HERO (load-bearing) ━━━
A kawaii-faced vessel (smiling face printed on it — dimpled-blush, closed-arc eyes) with an OVERSIZED magical bouquet bursting impossibly out of its top — the bouquet is BIGGER than the cup itself. The only cast is the vessel + flowers (NO creatures / humans / animals). Painterly-illustration fusion, NOT a flat product-shot: glossy pearlescent vessel + hand-painted oil/gouache flowers + dreamy soft-focus background.

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

${
  night_mode
    ? `━━━ ⚠ NIGHTTIME OVERRIDE — this render is at NIGHT (overrides lighting) ━━━
${night_mode}`
    : `━━━ LIGHTING ━━━
${lighting}`
}

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
${vibeDirective.slice(0, 150)}

━━━ HARD BANS ━━━
- NO creatures / humans / animals; NO flat product-shot (bouquet must overflow bigger than the vessel); NO modern tech; NO scary/dark/moody

━━━ OUTPUT FORMAT (MANDATORY) ━━━

Open with: "[kawaii-faced vessel description — cup/mug/bowl with smiling face + decorative pattern detail], OVERFLOWING with [bouquet description naming the specific flora pieces from above], cherry-blossom branches [arching in], pastel pearls + [tabletop scatter] scattered at the base, dreamy pastel-bokeh background, painterly Pop-Mart-illustration-fusion rendering..."

Output ONLY the raw 100-140 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. The bouquet's painterly-flower texture and impossible overflow must read CLEARLY.`;
  },

  YUMBOT_FLORAL_GARDEN_SCENE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      scene_type,
      vessel,
      overflowing_flora,
      tabletop_scatter,
      frame_branches,
      palette,
      background,
      lighting,
      night_mode,
    } = slots;
    const floraList = Array.isArray(overflowing_flora) ? overflowing_flora : [overflowing_flora];
    const floraBlock = floraList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');
    const scatterList = Array.isArray(tabletop_scatter) ? tabletop_scatter : [tabletop_scatter];
    const scatterBlock = scatterList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');

    return `${YUMBOT_LOOK_OVERRIDE(sharedDNA)}You are writing FLORAL-GARDEN renders for YumBot. The SCENE is a RICH kawaii garden composition — indoor (potting shed / sunroom / windowsill / tea-time table / vanity / fireplace mantle) or outdoor (cottage patio / greenhouse / balcony / picnic-in-garden / garden bench / gazebo). The scene contains MULTIPLE kawaii-faced planters/vessels clustered together, OVERFLOWING with magical flowers, kawaii treats scattered through, magical sparkle accents. Painterly Pop-Mart-illustration-fusion register. Output wraps with style prefix + suffix.
${YUMBOT_NIGHTTIME_BLOCK(
  night_mode,
  'The garden scene is at NIGHT, indoor (candlelit shed / moonlit windowsill) or outdoor (moonlit patio / greenhouse-at-night).'
)}
━━━ THE COMPOSITION (load-bearing) ━━━
The scene-type below IS the composition — a FULL, RICH garden setting (NOT a single isolated vessel, NEVER minimal) holding THREE OR MORE kawaii-faced planters clustered together (teapots, mason jars, terracotta pots, watering cans, mugs, baskets — each with a smiling face), OVERFLOWING magical flowers, kawaii treats scattered through (macarons, cupcakes, cookies, donuts, mochi — many with tiny faces), and magical accents (butterflies, floating pearl-orbs, sparkle motes, fairy-lights, petal-rain). The only cast is kawaii vessels + treats (NO creatures / humans / animals; butterflies + pearl-orbs OK). Painterly-illustration fusion: glossy pearlescent vessels + hand-painted flowers + dreamy soft-focus background.

━━━ THE SCENE (composition + multiple planters cluster + setting) ━━━
${scene_type}

━━━ PRIMARY VESSEL STYLE (the hero kawaii-faced planter — anchors the cluster) ━━━
${vessel}

━━━ FOUR OVERFLOWING FLORA ELEMENTS (spilling from the planters across the scene) ━━━
${floraBlock}

━━━ FRAMING BRANCHES (arching from upper-corner(s) into the frame) ━━━
${frame_branches}

━━━ THREE TABLETOP SCATTER + KAWAII TREATS (macarons, cupcakes, cookies, donuts, candies, pearls, berries scattered through scene) ━━━
${scatterBlock}

━━━ COLOR PALETTE (dominant 3-4 pastel colors for this render) ━━━
${palette}

━━━ BACKGROUND MOOD (the setting's pastel atmosphere — leaded windows, garden bokeh, cottage walls, leafy backdrop, etc.) ━━━
${background}

${
  night_mode
    ? `━━━ ⚠ NIGHTTIME OVERRIDE — this render is at NIGHT (overrides lighting) ━━━
${night_mode}`
    : `━━━ LIGHTING ━━━
${lighting}`
}

━━━ SPARKLE STACK — FLORAL-GARDEN-SCENE ━━━

Layer ALL on EVERY render:
- Glossy pearlescent finish on every kawaii vessel
- Painterly-textured flowers with hand-painted oil/gouache strokes visible
- Cherry-blossom-petal-rain drifting through the air
- Dewdrops on petals catching warm-pastel light
- Floating sparkle-dust + magical pollen-motes around the cluster
- Translucent glow within some of the petals (subsurface scattering)
- Tiny butterflies and floating pearl-orbs hovering
- Iridescent shimmer on dewy petals
- Warm-pastel rim-light catching every vessel's edges
- Soft volumetric pastel-light pouring down
- Painterly background brushstroke-texture
- Kawaii treats with their own tiny smiling faces (when appropriate)

━━━ POSTER MOMENT ━━━

The viewer's reaction: "this is a magical kawaii garden scene — so much going on, so cute, every detail charming." Wallpaper-poster bex.ai signature work. RICH, NEVER minimal.

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ HARD BANS ━━━
- NO creatures / humans / animals; NO single hero vessel alone or minimal/sparse composition (must be RICH multi-planter scene); NO pathway/road/stream/river through the composition; NO modern tech; NO scary/dark/moody

━━━ OUTPUT FORMAT (MANDATORY) ━━━

LEAD WITH THE SCENE — exactly as described above, with the multiple kawaii planters clustered in the setting. Then layer in: overflowing flora, kawaii treats scattered, framing branches, sparkle accents, lighting, painterly rendering.

Template:
"[scene-type composition with multiple kawaii planters clustered in the setting] — overflowing with [flora 1, flora 2, flora 3, flora 4], cherry-blossom branches [arching in], kawaii treats and [scatter 1, 2, 3] scattered throughout, butterflies and pearl-orbs floating, [palette], [background mood], [lighting], painterly Pop-Mart-illustration-fusion rendering."

Output ONLY the raw 130-180 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. The scene is RICH and FULL — multiple planters + flowers + treats + magical accents all visible.`;
  },

  YUMBOT_RAINBOW_DREAMSCAPE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      food_inhabitants,
      dreamscape_setting,
      rainbow_element,
      sky_atmosphere,
      environment,
      decor,
      companions,
      camera,
      lighting,
      night_mode,
    } = slots;
    // food_inhabitants is now an array of 5 (pickN:5 from FOOD_CATALOG)
    const foodList = Array.isArray(food_inhabitants) ? food_inhabitants : [food_inhabitants];
    const foodBlock = foodList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');
    const decorList = Array.isArray(decor) ? decor : [decor];
    const decorBlock = decorList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');
    const envList = Array.isArray(environment) ? environment : [environment];
    const envBlock = envList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');
    const compList = Array.isArray(companions) ? companions : [companions];
    const compBlock = compList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');

    return `${YUMBOT_LOOK_OVERRIDE(sharedDNA)}You are writing RAINBOW-DREAMSCAPE renders for YumBot — bex.ai's wider scenic look. EXACTLY 5 kawaii food-creatures gathered in a lush pastel outdoor dreamscape, COLORFUL and VIBRANT pastel palette throughout (the "rainbow-" in the path name is a reminder that the palette is colorful pastels — it does NOT mean the render must be rainbow-themed). Output wraps with style prefix + suffix.
${YUMBOT_NIGHTTIME_BLOCK(
  night_mode,
  'The dreamscape is at NIGHT — a wide moonlit pastel meadow, not a bright sunny one.'
)}
━━━ THE COMPOSITION (load-bearing) ━━━
NAME ALL 5 foods explicitly — count (1)(2)(3)(4)(5) — each a kawaii-faced creature-inhabitant gathered like little friends, NEVER dropped or abbreviated to "and others". The 3 landscape features below are visibly rendered (flowers, foliage, pastel hills, grass, blossom-trees, rocks) and the foods nestle IN the landscape — on grass / rocks / a hilltop / among flowers — as a wide cluster/gathering/clearing. The colorful vibrant pastel palette is the hero; rainbows are an OPTIONAL accent, not required. HARD BAN: tabletop/counter/flat-surface, bokeh-only backdrop, and any river/stream/path/lane/trail/bridge that recedes the frame to a vanishing point (chronic older failure).

⚠ FAILURE: rendering 1-3 foods. PASS: 5 distinct kawaii foods visible.

━━━ THE 5 KAWAII FOOD INHABITANTS (each MUST appear by name in the output) ━━━
${foodBlock}

━━━ DREAMSCAPE SETTING ━━━
${dreamscape_setting}

━━━ RAINBOW ELEMENT (this render's rainbow density — RENDER IT) ━━━
${rainbow_element}

━━━ SKY + ATMOSPHERE ━━━
${sky_atmosphere}

━━━ 3 LANDSCAPE FEATURES (visibly rendered) ━━━
${envBlock}

━━━ 3 DECOR ELEMENTS (scattered through scene) ━━━
${decorBlock}

━━━ 2 TINY COMPANIONS (peripheral cuties) ━━━
${compBlock}

━━━ CAMERA ━━━
${camera}

${
  night_mode
    ? `━━━ ⚠ NIGHTTIME OVERRIDE — this render is at NIGHT (overrides lighting + sky_atmosphere) ━━━
${night_mode}`
    : `━━━ LIGHTING ━━━
${lighting}`
}

━━━ SCENE PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

━━━ OUTPUT FORMAT (MANDATORY) ━━━

Lead with the outdoor pastel landscape, then NAME ALL 5 FOODS, then sky + decor + optional rainbow accent.

Template:
"Wider scenic outdoor shot of [dreamscape setting] with [landscape feature 1], [landscape feature 2], [landscape feature 3] visible — five kawaii food-creatures gathered: (1) [food 1 named in 6-10 words], (2) [food 2 named], (3) [food 3 named], (4) [food 4 named], (5) [food 5 named] — [sky element], [decor 1, 2, 3 scattered], [companion 1 + 2 fluttering], [rainbow_element as optional accent if it fits naturally], painterly Pop-Mart pearlescent rendering, sunny vibrant pastel light."

⚠ Count the (1) (2) (3) (4) (5) explicitly in the output to ensure all 5 foods appear. The numbered list is required.

⚠ NO river / stream / brook / path / trail / lane / bridge as a compositional element. The landscape is a wide pastel meadow / clearing / hillside / garden — not a path-cuts-through-the-frame scene.

Output ONLY the raw 130-170 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. All 5 foods + landscape features + companions read clearly.`;
  },

  YUMBOT_CANDY_FANTASY: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      candy_scene_type,
      candy_world_signature,
      candy_terrain,
      candy_sky,
      food_inhabitants,
      companions,
      decor_accents,
      candy_camera,
      candy_lighting,
      candy_time_of_day,
      candy_weather,
      night_mode,
    } = slots;
    const sigList = Array.isArray(candy_world_signature)
      ? candy_world_signature
      : [candy_world_signature];
    const sigBlock = sigList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');
    const foodList = Array.isArray(food_inhabitants) ? food_inhabitants : [food_inhabitants];
    const foodBlock = foodList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');
    const compList = Array.isArray(companions) ? companions : [companions];
    const decorList = Array.isArray(decor_accents) ? decor_accents : [decor_accents];

    return `${YUMBOT_LOOK_OVERRIDE(sharedDNA)}You are writing CANDY-FANTASY renders for YumBot. The SCENE-TYPE is the WHOLE point — it dictates where the 5 food-characters are placed and how the composition is framed. Atmosphere, lighting, time-of-day, weather wrap around the scene-type. Output wraps with style prefix + suffix.
${YUMBOT_NIGHTTIME_BLOCK(
  night_mode,
  'The candy-world is at NIGHT — candy surfaces stay glossy but DEEP-toned, lit by candy-lanterns + glowing-gumdrop fairy-lights + bioluminescent frosting.'
)}
━━━ THE COMPOSITION (load-bearing) ━━━
The scene-type below is COMPOSITION-LOCKED with explicit character placement (perched on a railing / around a campfire / inside a glass jar / atop a cake mountain / etc.). The 5 kawaii foods take the EXACT positions it describes — assign each to a pose. The scene-type prop (bridge railing / treehouse / advent-calendar wall / lazy-Susan turntable / etc.) is the visual anchor — DO NOT replace it with a generic candy-meadow. Everything is made of candy/cake/sugar/frosting/marshmallow (every prop is confectionery, never real wood/metal/fabric/stone). Disney-CGI lush saturated pastel palette, kawaii vinyl-pearlescent finish.

━━━ THE SCENE (this is the COMPOSITION — character placement is built in) ━━━
${candy_scene_type}

━━━ 5 KAWAII FOOD-CHARACTERS (these are the (1)-(5) food-friends in the scene above) ━━━
${foodBlock}

━━━ 1 BACKGROUND SIGNATURE ELEMENT (subtle accent, NOT a competing landmark) ━━━
${sigBlock}

${
  night_mode
    ? `━━━ ⚠ NIGHTTIME OVERRIDE — this render is at NIGHT (overrides time + weather + lighting) ━━━
${night_mode}`
    : `━━━ TIME OF DAY ━━━
${candy_time_of_day}

━━━ WEATHER / ATMOSPHERE ━━━
${candy_weather}

━━━ LIGHTING DIRECTION / QUALITY ━━━
${candy_lighting}`
}

━━━ CAMERA FRAMING ━━━
${candy_camera}

━━━ TERRAIN / SKY / DECOR / COMPANION (background dressing) ━━━
Terrain: ${candy_terrain}
Sky: ${candy_sky}
Decor accent: ${decorList[0] || ''}
Companion: ${compList[0] || ''}

━━━ SCENE PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

━━━ HARD BANS ━━━
- NO generic candy-meadow replacing the scene-type; NO real grass/soil/wood/metal (everything is candy); NO photoreal terrain/sky; NO dark/moody/scary; NO industrial/modern; NO neon colors; NO creatures/humans/animals (food is the only cast)

━━━ OUTPUT FORMAT (MANDATORY) ━━━

LEAD WITH THE SCENE — exactly as described above, with the 5 food-characters slotted into the positions. The scene-type opens the prompt and is the composition. Then BUILD OUT THE RICH CANDY-WORLD BACKDROP that surrounds the scene — describe the candy-fantasy landscape visible behind/around the foreground scene (frosted-cake mountains, oversized lollipop-trees, marshmallow drifts, candy-cane forests, sprinkle-grass terrain, cotton-candy clouds, candy-rainbow arches, sugar-glitter air, distant candy-monuments) so the render has VISUAL DEPTH and RICHNESS behind the scene. The backdrop is the world the scene lives in — not negotiable, not optional.

Template:
"[scene-type rewritten with (1)-(5) named foods in the positions] — set inside a RICH candy-fantasy world: [rich layered candy-landscape backdrop: 3-5 concrete candy-world elements like frosted-cake mountains / lollipop-tree groves / marshmallow drifts / candy-rainbow arches / cotton-candy clouds / sugar-crystal formations / candy-monuments — describe them in the background filling out the scene's depth] — [time-of-day], [weather], [lighting], [camera framing]. [1 signature element accent / 1 decor accent / 1 companion]. Painterly kawaii Pop-Mart candy-fantasy rendering."

⚠ THREE LAYERS: (1) foreground scene-type composition with characters placed, (2) RICH candy-world backdrop visible behind/around, (3) atmosphere/framing. Skip layer 2 = the render looks empty. Make layer 2 visually concrete with 3-5 candy-world elements.

Output ONLY the raw 130-180 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers.`;
  },

  YUMBOT_JAPANESE_FESTIVAL: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      scene_type,
      market_backdrop,
      signature,
      terrain,
      sky,
      camera,
      lighting,
      time_of_day,
      weather,
      food_inhabitants,
      companion,
    } = slots;
    const foodList = Array.isArray(food_inhabitants) ? food_inhabitants : [food_inhabitants];
    const foodBlock = foodList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');
    const sigList = Array.isArray(signature) ? signature : [signature];
    const sigBlock = sigList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');

    return `${YUMBOT_LOOK_OVERRIDE(sharedDNA)}You are writing JAPANESE-FESTIVAL renders for YumBot — kawaii matsuri scenes with 5 kawaii Japanese festival foods composed cleanly in a richly-detailed matsuri/market setting. Natural family-portrait cluster with slight pose variation per food — NOT identical lineup, NOT chaotic action. Painterly Pop-Mart fusion register with Studio-Ghibli warmth. Output wraps with style prefix + suffix.

━━━ THE COMPOSITION (load-bearing) ━━━
NAME all 5 foods at the START — (1)(2)(3)(4)(5), each face visible, NEVER drop one — in a natural family-portrait cluster with SLIGHT pose variation (one peeking, one tilted, one leaning back, one looking up, one tallest at center), NOT an identical-soldier lineup and NOT chaotic stacking/acrobatics. The matsuri/market backdrop is CLEARLY visible behind them, with signature elements, terrain, sky, time-of-day, weather, and one tiny companion all layering in. Traditional Japanese FESTIVAL only (chochin lanterns, wooden festival architecture, sakura/maple drift, warm lantern-glow) — never modern urban/mall.

⚠ FAILURE = rendering 1-4 foods. PASS = 5 distinct kawaii foods all visible.

━━━ THE SCENE-TYPE (composition + 5-food pose-varied cluster) ━━━
${scene_type}

━━━ MATSURI / MARKET BACKDROP (surrounding setting — render visibly) ━━━
${market_backdrop}

━━━ 2 SIGNATURE MATSURI ELEMENTS (iconic accents) ━━━
${sigBlock}

━━━ TERRAIN (underfoot ground texture) ━━━
${terrain}

━━━ SKY / OVERHEAD ━━━
${sky}

━━━ CAMERA FRAMING ━━━
${camera}

━━━ LIGHTING DIRECTION / QUALITY ━━━
${lighting}

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ WEATHER / ATMOSPHERE (what's drifting through the air) ━━━
${weather}

━━━ 1 TINY COMPANION (small peripheral accent — firefly / goldfish / origami-crane / etc.) ━━━
${companion}

━━━ 5 KAWAII JAPANESE FESTIVAL FOODS (the (1)-(5) food-friends in the scene) ━━━
${foodBlock}

━━━ SCENE PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

━━━ POSTER MOMENT ━━━

"a magical Japanese matsuri night — 5 kawaii foods gathered together in a rich festival setting with natural personality." Wallpaper-poster bex.ai-meets-Studio-Ghibli register.

━━━ HARD BANS ━━━
- Traditional matsuri ONLY (NO modern urban/mall, NO Western carnival/Ferris-wheel); NO creatures/humans/animals as cast (tiny companion OK); NO real kanji/legible-text (decorative-pattern only); NO pathway receding to a vanishing point; NO blurred generic-bokeh backdrop (matsuri MUST be visible); NO photoreal; NO dark/scary

━━━ OUTPUT FORMAT (MANDATORY) ━━━

LEAD with the 5 foods named at the START (early tokens = Flux locks them), then weave in scene-type + backdrop + signature + terrain + sky + lighting + time + weather + companion as one integrated description.

Template:
"Five kawaii Japanese-festival foods together — (1) [food 1 named in 5-8 words], (2) [food 2 named], (3) [food 3 named], (4) [food 4 named], (5) [food 5 named] — [scene-type pose-varied cluster arrangement]. Set in [market_backdrop matsuri setting visibly rendered]. [signature 1] and [signature 2] visible in the scene, [terrain] underfoot, [sky] overhead, [time-of-day], [weather drifting], [lighting]. [companion] nearby. [camera framing]. Painterly Pop-Mart kawaii-matsuri rendering."

⚠ Count (1)(2)(3)(4)(5) explicitly. ALL 5 FOODS named at the START. Natural pose-variation cluster.

Output ONLY the raw 140-200 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers.`;
  },

  YUMBOT_MINI_CHEF: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      scene_type,
      kitchen_backdrop,
      signature,
      terrain,
      sky,
      camera,
      lighting,
      time_of_day,
      atmosphere,
      food_inhabitants,
      companion,
      dish_being_prepared,
    } = slots;
    const foodList = Array.isArray(food_inhabitants) ? food_inhabitants : [food_inhabitants];
    const foodBlock = foodList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');
    const sigList = Array.isArray(signature) ? signature : [signature];
    const sigBlock = sigList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');

    return `${YUMBOT_LOOK_OVERRIDE(sharedDNA)}You are writing MINI-CHEF renders for YumBot — kawaii kitchen scenes with 5 KAWAII FOOD-CHARACTERS (the foods themselves) cooking together to prepare a kawaii dish in a richly-detailed kitchen. The food-characters ARE the cooks — no human chef figures, no chibi-children, no human-coded clothing. Natural family-portrait cluster with slight pose variation. Painterly Pop-Mart fusion with Studio-Ghibli kitchen warmth. Output wraps with style prefix + suffix.

━━━ THE COMPOSITION (load-bearing) ━━━
NAME all 5 foods at the START — (1)(2)(3)(4)(5). The FOOD ITSELF is the cook (taiyaki / mochi / cupcake / donut / dango with kawaii face ON the food, holding tiny baking tools, dusted with flour) in a natural family-portrait cluster with slight pose variation — NEVER a human or chibi-child holding/wearing the food. The foods read as cooks from what they're DOING (leaning over a bowl, holding a whisk, piping frosting), NOT from apparel: the food is naked with a kawaii face — do NOT write "wearing" anything, and no chef hats / toques / aprons / uniforms (that priming reads as a human). They PREPARE a specific kawaii dish (the visual centerpiece) in a cozy kawaii kitchen (cottage / patisserie / sushi-bar / French country) — NEVER modern industrial/mall — with the backdrop CLEARLY visible, bright warm light, pastel palette.

⚠ FAILURE = rendering humans / chibi-children / 1-4 foods. PASS = 5 distinct kawaii food-character cooks all visible.

━━━ THE SCENE-TYPE (composition + 5-food pose-varied cluster + activity) ━━━
${scene_type}

━━━ THE DISH BEING PREPARED (centerpiece in the scene) ━━━
${dish_being_prepared}

━━━ KITCHEN BACKDROP (surrounding setting — render visibly) ━━━
${kitchen_backdrop}

━━━ 2 SIGNATURE KITCHEN PROPS ━━━
${sigBlock}

━━━ TERRAIN (counter / floor / surface) ━━━
${terrain}

━━━ SKY / OVERHEAD ━━━
${sky}

━━━ CAMERA FRAMING ━━━
${camera}

━━━ LIGHTING DIRECTION / QUALITY ━━━
${lighting}

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ ATMOSPHERE (what's drifting through the air — flour-dust / steam / sparkle) ━━━
${atmosphere}

━━━ 1 TINY KITCHEN COMPANION (sugar-mouse / dough-spirit / spice-fairy / etc.) ━━━
${companion}

━━━ 5 KAWAII FOOD-CHARACTERS (the (1)-(5) food-cooks in the scene — the food ITSELF is the character) ━━━
${foodBlock}

━━━ SCENE PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

━━━ POSTER MOMENT ━━━

"a magical kawaii kitchen — 5 kawaii food-characters cooking a kawaii dish together, no humans, no chefs-in-uniform — just kawaii foods doing the cooking themselves." Wallpaper-poster bex.ai-meets-Studio-Ghibli register.

━━━ HARD BANS ━━━
- NO human figures / chibi-children / chef-mascots (ONLY kawaii foods); NO chef hats / aprons / uniforms and NO foods "wearing" anything (naked food with kawaii face — these words prime humans); kawaii cottage/patisserie kitchen ONLY (NO industrial/mall); NO real kanji/labels; NO blurred generic-bokeh backdrop (kitchen MUST be visible); NO photoreal; NO dark/dirty/scary

━━━ OUTPUT FORMAT (MANDATORY) ━━━

LEAD with the 5 food-characters named at the START, describe them as the food ITSELF (NOT a person wearing/holding the food), then weave in scene-type + dish + backdrop + signature + terrain + sky + lighting + time + atmosphere + companion.

Template:
"Five kawaii food-characters cooking together — (1) [food 1 named in 5-8 words — the food ITSELF with flour-dust / spoon / whisk in tiny arms], (2) [food 2 named], (3) [food 3 named], (4) [food 4 named], (5) [food 5 named] — [scene-type pose-varied cluster arrangement] preparing [dish_being_prepared centerpiece]. Set in [kitchen_backdrop visibly rendered]. [signature 1] and [signature 2] in the scene, [terrain] underfoot, [sky] overhead, [time-of-day], [atmosphere drifting], [lighting]. [companion] nearby. [camera framing]. Painterly Pop-Mart kawaii-kitchen rendering."

⚠ Count (1)(2)(3)(4)(5) explicitly. ALL 5 FOODS named at the START. The food IS the character — NOT a human wearing/holding food. Natural pose-variation cluster.

Output ONLY the raw 150-220 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers.`;
  },

  YUMBOT_COTTAGECORE_NATURE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      scene_type,
      backdrop,
      signature,
      terrain,
      sky,
      camera,
      lighting,
      time_of_day,
      atmosphere,
      food_inhabitants,
      companion,
      nature_element,
      night_mode,
    } = slots;
    const foodList = Array.isArray(food_inhabitants) ? food_inhabitants : [food_inhabitants];
    const foodBlock = foodList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');
    const sigList = Array.isArray(signature) ? signature : [signature];
    const sigBlock = sigList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');

    return `${YUMBOT_LOOK_OVERRIDE(sharedDNA)}You are writing COTTAGECORE-NATURE renders for YumBot — kawaii countryside-nature scenes with 5 kawaii food-characters composed cleanly in a richly-detailed cottagecore setting. Natural family-portrait cluster with slight pose variation. Painterly Pop-Mart fusion with Studio-Ghibli countryside warmth. Output wraps with style prefix + suffix.
${YUMBOT_NIGHTTIME_BLOCK(
  night_mode,
  'The cottagecore countryside is at NIGHT, lit by moon + cottage-window-glow + lanterns + firefly drift.'
)}
━━━ THE COMPOSITION (load-bearing) ━━━
NAME all 5 foods at the START — (1)(2)(3)(4)(5). The food ITSELF is the character (jam-jar / scone / berry / cream-puff / honey-jar with kawaii face ON the food) in a natural family-portrait cluster with slight pose variation — never a human or chibi-child. The cottagecore backdrop (wildflower meadow / cottage garden / woodland clearing / orchard) is CLEARLY visible behind them, with the featured nature element, signature props, terrain, sky, time, atmosphere, and companion layering in. Cottagecore countryside only — NEVER modern urban/industrial/mall — soft warm light, sage/butter/cream/pink/lavender palette.

⚠ FAILURE = rendering humans / chibi-children / 1-4 foods. PASS = 5 distinct kawaii foods all visible.

━━━ THE SCENE-TYPE (composition + 5-food pose-varied cluster) ━━━
${scene_type}

━━━ COTTAGECORE BACKDROP (surrounding setting — render visibly) ━━━
${backdrop}

━━━ 2 COTTAGECORE SIGNATURE PROPS (iconic accents — wicker basket / mason jar / lace doily / etc.) ━━━
${sigBlock}

━━━ FEATURED NATURE ELEMENT (1 wow-detail — mushroom cluster / berry bush / wildflower patch / etc.) ━━━
${nature_element}

━━━ TERRAIN (underfoot ground texture) ━━━
${terrain}

━━━ SKY / OVERHEAD CANOPY ━━━
${sky}

━━━ CAMERA FRAMING ━━━
${camera}

${
  night_mode
    ? `━━━ ⚠ NIGHTTIME OVERRIDE — this render is at NIGHT (overrides lighting + time + atmosphere) ━━━
${night_mode}
`
    : `━━━ LIGHTING DIRECTION / QUALITY ━━━
${lighting}

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ ATMOSPHERE (what's drifting through the air — petals / pollen / butterflies / dust motes) ━━━
${atmosphere}`
}

━━━ 1 TINY COTTAGECORE COMPANION (bunny / honeybee / songbird / butterfly / etc.) ━━━
${companion}

━━━ 5 KAWAII FOOD-CHARACTERS (the (1)-(5) food-friends in the scene — the food ITSELF is the character) ━━━
${foodBlock}

━━━ SCENE PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

━━━ POSTER MOMENT ━━━

"a magical cottagecore meadow — 5 kawaii foods gathered together in a richly-detailed countryside-nature setting with natural personality." Wallpaper-poster bex.ai-meets-Studio-Ghibli register.

━━━ HARD BANS ━━━
- Cottagecore countryside ONLY (NO modern urban/industrial/mall); NO human figures/chibi-children (tiny companion creature OK); NO real kanji/labels; NO pathway/brook receding to a vanishing point; NO blurred generic-bokeh backdrop (cottagecore MUST be visible); NO photoreal; NO dark/scary

━━━ OUTPUT FORMAT (MANDATORY) ━━━

LEAD with the 5 food-characters named at the START (early tokens = Flux locks them), then weave in scene-type + backdrop + nature element + signature + terrain + sky + lighting + time + atmosphere + companion.

Template:
"Five kawaii cottagecore food-characters together — (1) [food 1 named in 5-8 words], (2) [food 2 named], (3) [food 3 named], (4) [food 4 named], (5) [food 5 named] — [scene-type pose-varied cluster arrangement]. Set in [backdrop visibly rendered]. [nature_element] visible as featured detail, [signature 1] and [signature 2] accenting the scene, [terrain] underfoot, [sky] overhead, [time-of-day], [atmosphere drifting], [lighting]. [companion] nearby. [camera framing]. Painterly Pop-Mart kawaii-cottagecore rendering."

⚠ Count (1)(2)(3)(4)(5) explicitly. ALL 5 FOODS named at the START. Natural pose-variation cluster.

Output ONLY the raw 150-220 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers.`;
  },

  YUMBOT_CHECKERED_TABLETOP: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      vessel_hero,
      mini_creature_pile,
      tablecloth,
      scattered_minis,
      decor_clusters,
      backdrop,
      signature,
      atmosphere,
      time_of_day,
      companion,
      camera,
      lighting,
    } = slots;
    const minisList = Array.isArray(scattered_minis) ? scattered_minis : [scattered_minis];
    const minisBlock = minisList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');
    const clusterList = Array.isArray(decor_clusters) ? decor_clusters : [decor_clusters];
    const clusterBlock = clusterList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');
    const sigList = Array.isArray(signature) ? signature : [signature];
    const sigBlock = sigList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');

    return `${YUMBOT_LOOK_OVERRIDE(sharedDNA)}You are writing CHECKERED-TABLETOP renders for YumBot — bex.ai's signature pastel-gingham tabletop look. Kawaii food/drink hero on a pastel-pink-blue (or pink-cream / pink-yellow) GINGHAM/CHECKERED/PLAID tablecloth, with a cluster of smiling mini-food-friends piled around (and often ON TOP of) the hero. Output wraps with style prefix + suffix.

━━━ THE COMPOSITION (load-bearing) ━━━
A PASTEL CHECKERED/GINGHAM/PLAID tablecloth (pink+blue most common; also pink+yellow / pink+cream / pink+mint) with the checker pattern CLEARLY visible — the signature backdrop. The hero is a kawaii-faced food/drink (boba-cup / hot-cocoa-mug / teapot / sundae) with a cluster of mini smiling-food-friends piled ON TOP (in the foam / on the rim / poking out) — that pile-on-top is the signature wow. Plus 5 specific kawaii mini-foods (smiling cookies / stars / fruits / hearts / candies) scattered across the tablecloth around the hero. The render reads like a kawaii-sticker-card or Pop-Mart-collectible tableau.

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

━━━ SOFT-FOCUS BACKDROP (what's visible BEHIND the tabletop — soft-focus bokeh, NEVER sharp landscape) ━━━
${backdrop}

━━━ 2 KAWAII SIGNATURE PROPS (linen napkin / ceramic spoon / sugar-cube dish / vintage creamer / floral saucer / ribbon-bow / etc.) ━━━
${sigBlock}

━━━ ATMOSPHERE (what's drifting through the air — sparkle / petals / heart-bokeh / bubble-orbs) ━━━
${atmosphere}

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ 1 TINY COMPANION (sugar-mouse / butterfly / honeybee / origami-crane / etc.) ━━━
${companion}

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
${vibeDirective.slice(0, 150)}

━━━ HARD BANS ━━━
- NO creatures/humans/real animals (only smiling food-friends); NO solid-pastel backdrop without the checker pattern (pattern MUST be visible); NO outdoor scenic (that's rainbow-dreamscape); NO overflowing-flora-from-cup (that's floral-garden-cup); NO dark/moody/scary

━━━ OUTPUT FORMAT (MANDATORY) ━━━

Open with: "Pastel [pink/blue/cream/yellow] gingham/checkered tablecloth fills the surface, [kawaii vessel hero centerpiece with its smiling face], with [mini-creature pile on top — naming specific mini-faces], [scattered minis named across the tablecloth], [decor clusters], [signature 1] and [signature 2] accenting beside the hero, [backdrop softly out of focus behind], [time-of-day], [atmosphere drifting], [companion] nearby, [lighting], [camera framing], painterly Pop-Mart designer-vinyl pearlescent rendering."

Output ONLY the raw 120-170 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. The gingham/checkered pattern + mini-friend-pile-on-top must read CLEARLY, and the backdrop must be SOFT-FOCUS behind.`;
  },

  YUMBOT_COQUETTE_FOOD: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      scene_type,
      backdrop,
      signature,
      terrain,
      sky,
      camera,
      lighting,
      time_of_day,
      atmosphere,
      dessert_motif,
      palette_variant,
      bow_motif,
      scattered_items,
      companion,
      food_inhabitants,
    } = slots;
    const foodList = Array.isArray(food_inhabitants) ? food_inhabitants : [food_inhabitants];
    const foodBlock = foodList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');
    const sigList = Array.isArray(signature) ? signature : [signature];
    const sigBlock = sigList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');
    const scatterList = Array.isArray(scattered_items) ? scattered_items : [scattered_items];
    const scatterBlock = scatterList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');

    return `${YUMBOT_LOOK_OVERRIDE(sharedDNA)}You are writing COQUETTE-FOOD renders for YumBot — the FLAGSHIP OMG-cute coquette kawaii food-party path. Hyper-feminine ultra-pink ultra-coquette palette. Output wraps with style prefix + suffix.

━━━ ⚠ PALETTE LOCK (load-bearing — read first) ━━━
The ENTIRE render is restricted to pinks (blush / dusty-rose / coral-pink / bubblegum / hot-pink), lavenders, whites, and soft purples (lilac / mauve / periwinkle). ABSOLUTELY NO yellows, blues outside soft-purple, greens, oranges, reds outside soft-pink, browns, blacks, neons. Re-tint any normally-other-colored food (e.g. a yellow lemon) into the pink/lavender range.

━━━ THE COMPOSITION (load-bearing) ━━━
NAME all 5 foods at the START — (1)(2)(3)(4)(5), the food ITSELF is the character with kawaii face, all visible in a pose-varied cluster (never a human/chibi-child). PACK the scene RICH and OVERFLOWING with cute (never minimal): beyond the 5 foods, layer the 3 signature props + 2 scattered girly items + 1 companion + 1 centerpiece dessert + 1 hero bow-motif. Hyper-feminine ultra-coquette aesthetic — ribbons, bows, lace, pearls, hearts, strawberries, cherries; Marie-Antoinette tea party meets ballerina dressing-room meets pastel kawaii bakery. NEVER masculine/dark/grungy.

⚠ FAILURE = rendering humans / chibi-children / 1-4 foods. PASS = 5 distinct kawaii foods all visible.

━━━ THE SCENE-TYPE (composition + 5-food pose-varied cluster) ━━━
${scene_type}

━━━ THE CENTERPIECE DESSERT MOTIF (the hero treat) ━━━
${dessert_motif}

━━━ THE BOW MOTIF (featured ribbon/bow arrangement) ━━━
${bow_motif}

━━━ COQUETTE BACKDROP (surrounding setting — render visibly) ━━━
${backdrop}

━━━ 3 SIGNATURE COQUETTE PROPS ━━━
${sigBlock}

━━━ 2 SCATTERED GIRLY ITEMS (lipsticks / perfume / hair-clips / mini-figurines / etc.) ━━━
${scatterBlock}

━━━ TERRAIN (surface foods sit on) ━━━
${terrain}

━━━ SKY / OVERHEAD ━━━
${sky}

━━━ CAMERA FRAMING ━━━
${camera}

━━━ LIGHTING DIRECTION / QUALITY ━━━
${lighting}

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ ATMOSPHERE (what's drifting in the air) ━━━
${atmosphere}

━━━ PALETTE VARIANT (dominant shade combination from the locked range) ━━━
${palette_variant}

━━━ 1 TINY COMPANION ━━━
${companion}

━━━ 5 KAWAII FOOD-CHARACTERS (the (1)-(5) food-friends — the food ITSELF is the character) ━━━
${foodBlock}

━━━ SCENE PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

━━━ POSTER MOMENT ━━━

"the OMG-cutest coquette kawaii food-party — 5 kawaii foods amid a riot of pink ribbons, pearls, hearts, bows, girly accessories. Every viewer says 'this is so cute it hurts.'" Wallpaper-poster flagship work.

━━━ HARD BANS ━━━
- ⚠ NO COLORS OUTSIDE pinks / lavenders / whites / soft purples — ZERO exceptions (NO mint, green, blue except soft-lavender, yellow, orange, red outside soft-pink, brown, chocolate, black, gray)
- NO human figures/chibi-children (tiny companion creature OK); NO minimal/sparse composition (OVERFLOWING with cute); NO blurred generic backdrop (coquette setting MUST be visible); NO real kanji/labels; NO photoreal; NO dark/scary/grungy/masculine

━━━ OUTPUT FORMAT (MANDATORY) ━━━

LEAD with the 5 food-characters named at the START, then layer in scene-type + dessert + bow + backdrop + signatures + scattered items + terrain + sky + camera + lighting + time + atmosphere + palette + companion as one integrated description.

Template:
"Five kawaii coquette food-characters together — (1) [food 1 named in 5-8 words], (2) [food 2 named], (3) [food 3 named], (4) [food 4 named], (5) [food 5 named] — [scene-type pose-varied cluster] around [dessert_motif centerpiece] decorated with [bow_motif]. Set in [backdrop visibly rendered]. [signature 1], [signature 2], [signature 3] accenting the scene. [scattered_item 1] and [scattered_item 2] scattered nearby. [terrain] underfoot, [sky] overhead, [time-of-day], [atmosphere drifting], [lighting]. [companion] nearby. Palette: [palette_variant]. [camera framing]. Painterly Pop-Mart ultra-coquette kawaii rendering, pinks + lavenders + whites + soft purples ONLY."

⚠ Count (1)(2)(3)(4)(5) explicitly. ALL 5 FOODS named at the START. Pack the scene RICH with cute coquette items.

Output ONLY the raw 170-240 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers.`;
  },

  YUMBOT_KAWAII_KOI_POND: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      scene_type,
      backdrop,
      signature,
      terrain,
      sky,
      camera,
      lighting,
      time_of_day,
      atmosphere,
      water_element,
      companion,
      creatures,
      night_mode,
    } = slots;
    const creatureList = Array.isArray(creatures) ? creatures : [creatures];
    const creatureBlock = creatureList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');
    const sigList = Array.isArray(signature) ? signature : [signature];
    const sigBlock = sigList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');

    return `${YUMBOT_LOOK_OVERRIDE(sharedDNA)}You are writing KAWAII-KOI-POND renders for YumBot — a tranquil Japanese koi-pond scene with 5 kawaii pond-creatures (smiling koi-fish, axolotls, cloud-mochi-spirits, lily-frogs, pearl-blobs) half-submerged in/around the pond. Painterly Studio-Ghibli meets bex.ai Pop-Mart kawaii register. Output wraps with style prefix + suffix.
${YUMBOT_NIGHTTIME_BLOCK(
  night_mode,
  'This scene is at NIGHT — the kawaii cast keeps soft cream-pink-blush faces, but the WORLD around them is DARK (lit by moon + lotus-lanterns + creature-bioluminescence + firefly drift, NOT twilight/magic-hour).'
)}
━━━ THE COMPOSITION (load-bearing) ━━━
NAME all 5 at the START — (1)(2)(3)(4)(5). Each is a kawaii POND-CREATURE (closed-arc-eyes, blush cheeks, tiny mouth) — NOT a food — half-submerged or floating, in a natural pose-varied cluster (one peeking from water, one tilted, one nestled, one tallest at back, one floating). The Japanese garden backdrop (pagoda / wisteria-grove / temple-courtyard / teahouse / zen-rock-garden) is CLEARLY visible behind the pond, and the featured water-element centerpiece (lotus-lantern / glowing-lily / floating-paper-crane) anchors it. Painterly Studio-Ghibli register: twilight/dusk-heavy, glowing lotus-lanterns, soft mist, cherry-blossom + wisteria petals drifting — cinematic and atmospheric.

⚠ FAILURE = rendering humans / chibi-children / 1-4 creatures. PASS = 5 distinct kawaii pond-creatures all visible.

━━━ THE SCENE-TYPE (composition + 5-creature pose-varied cluster in pond) ━━━
${scene_type}

━━━ THE FEATURED WATER ELEMENT (centerpiece on the pond) ━━━
${water_element}

━━━ JAPANESE GARDEN BACKDROP (surrounding setting — render visibly) ━━━
${backdrop}

━━━ 2 SIGNATURE POND ELEMENTS (lotus-lantern / stepping-stone / paper-crane / etc.) ━━━
${sigBlock}

━━━ POND-WATER SURFACE TEXTURE ━━━
${terrain}

━━━ OVERHEAD CANOPY (wisteria / pagoda eave / twilight sky / etc.) ━━━
${sky}

━━━ CAMERA FRAMING ━━━
${camera}

${
  night_mode
    ? `━━━ ⚠ NIGHTTIME OVERRIDE — this render is at NIGHT (overrides lighting + time + atmosphere) ━━━
${night_mode}
`
    : `━━━ LIGHTING DIRECTION / QUALITY ━━━
${lighting}

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ ATMOSPHERE (what's drifting through the air — petals / fireflies / mist) ━━━
${atmosphere}`
}

━━━ 1 TINY COMPANION (dragonfly / origami-crane / butterfly / etc.) ━━━
${companion}

━━━ 5 KAWAII POND-CREATURES (the (1)-(5) cast — kawaii faces, half-submerged or floating) ━━━
${creatureBlock}

━━━ SCENE PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

━━━ POSTER MOMENT ━━━

"a tranquil kawaii Japanese koi-pond at twilight — 5 kawaii pond-creatures gathered around a glowing lotus-lantern under wisteria canopy with cherry-blossom petals drifting." Wallpaper-poster bex.ai-meets-Studio-Ghibli register.

━━━ HARD BANS ━━━
- NO foods as cast (this path uses kawaii POND-CREATURES — koi / axolotl / mochi-spirit); NO human figures/chibi-children; traditional Japanese garden ONLY (NO modern urban/mall); NO real kanji/text; NO pathway receding to a vanishing point; NO blurred generic backdrop (garden MUST be visible); NO photoreal; NO dark/scary (peaceful twilight register)

━━━ OUTPUT FORMAT (MANDATORY) ━━━

LEAD with the 5 kawaii pond-creatures named at the START, then weave in scene-type + water-element + backdrop + signatures + terrain + sky + camera + lighting + time + atmosphere + companion.

Template:
"Five kawaii pond-creatures together in a Japanese koi-pond — (1) [creature 1 named in 5-8 words], (2) [creature 2 named], (3) [creature 3 named], (4) [creature 4 named], (5) [creature 5 named] — [scene-type pose-varied cluster in pond] around [water_element centerpiece]. Set in [backdrop Japanese garden visibly rendered]. [signature 1] and [signature 2] accenting the pond. [terrain pond-water surface], [sky overhead], [time-of-day], [atmosphere drifting], [lighting]. [companion] nearby. [camera framing]. Painterly Pop-Mart-meets-Studio-Ghibli kawaii koi-pond rendering."

⚠ Count (1)(2)(3)(4)(5) explicitly. ALL 5 CREATURES named at the START.

Output ONLY the raw 150-220 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers.`;
  },

  YUMBOT_FAST_FOOD: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      scene,
      camera_framing,
      lighting,
      palette,
      time_of_day,
      companion,
      decor_accents,
      atmospheric_accent,
    } = slots;
    const decorList = Array.isArray(decor_accents) ? decor_accents : [decor_accents];
    const decorBlock = decorList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');
    return `${YUMBOT_LOOK_OVERRIDE(sharedDNA)}You are writing FAST-FOOD renders for YumBot — 1-3 kawaii fast-food items in a fast-food context. Visual treatment is set by the LOOK REGISTER above.

━━━ THE SCENE ━━━
${scene}

━━━ DECOR ACCENTS — ALL 3 MUST APPEAR BY NAME ━━━
${decorBlock}

━━━ COMPANION — MUST APPEAR BY NAME ━━━
${companion}

━━━ ATMOSPHERIC ACCENT — MUST APPEAR BY NAME ━━━
${atmospheric_accent}

━━━ CAMERA + FRAMING ━━━
${camera_framing}

━━━ LIGHTING ━━━
${lighting}

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ COLOR PALETTE ━━━
${palette}

━━━ VIBE MOOD ━━━
${vibeDirective.slice(0, 150)}

━━━ HARD MANDATES ━━━
1. The 1-3 kawaii fast-food items appear by name with kawaii face features.
2. Fast-food context reads instantly. ALL 3 decor + companion + atmospheric accent appear BY NAME.

━━━ HARD BANS ━━━
- NO desserts / pastries / produce — cast is fast-food only.
- NO human faces. NO photoreal tokens.

━━━ OUTPUT ━━━
The raw Flux prompt, 160-220 words, comma-separated. Open with LOOK REGISTER, then fast-food + setting, then decor + companion + atmospheric accent, then camera + lighting + time + palette + vibe. NO preamble, NO titles, NO headers, NO bulleted lists.`;
  },

  YUMBOT_CARNIVAL_FOOD: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      scene,
      camera_framing,
      lighting,
      palette,
      time_of_day,
      companion,
      decor_accents,
      atmospheric_accent,
    } = slots;
    const decorList = Array.isArray(decor_accents) ? decor_accents : [decor_accents];
    const decorBlock = decorList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');
    return `${YUMBOT_LOOK_OVERRIDE(sharedDNA)}You are writing CARNIVAL-FOOD renders for YumBot — 1-3 kawaii carnival foods at a carnival / fairground context. Visual treatment is set by the LOOK REGISTER above.

━━━ THE SCENE ━━━
${scene}

━━━ DECOR ACCENTS — ALL 3 MUST APPEAR BY NAME ━━━
${decorBlock}

━━━ COMPANION — MUST APPEAR BY NAME ━━━
${companion}

━━━ ATMOSPHERIC ACCENT — MUST APPEAR BY NAME ━━━
${atmospheric_accent}

━━━ CAMERA + FRAMING ━━━
${camera_framing}

━━━ LIGHTING ━━━
${lighting}

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ COLOR PALETTE ━━━
${palette}

━━━ VIBE MOOD ━━━
${vibeDirective.slice(0, 150)}

━━━ HARD MANDATES ━━━
1. The 1-3 kawaii carnival-foods appear by name with kawaii face features.
2. Carnival context reads instantly. ALL 3 decor + companion + atmospheric accent appear BY NAME.

━━━ HARD BANS ━━━
- NO regular fast-food / desserts / produce — strictly carnival foods.
- NO human faces. NO photoreal tokens.

━━━ OUTPUT ━━━
The raw Flux prompt, 160-220 words, comma-separated. Open with LOOK REGISTER, then carnival food + context, then decor + companion + atmospheric accent, then camera + lighting + time + palette + vibe. NO preamble, NO titles, NO headers, NO bulleted lists.`;
  },

  YUMBOT_FRUITS_VEGGIES: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      scene,
      camera_framing,
      lighting,
      palette,
      time_of_day,
      companion,
      decor_accents,
      atmospheric_accent,
    } = slots;

    const decorList = Array.isArray(decor_accents) ? decor_accents : [decor_accents];
    const decorBlock = decorList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');

    return `${YUMBOT_LOOK_OVERRIDE(sharedDNA)}You are writing FRUITS-AND-VEGGIES renders for YumBot — 2-3 kawaii fruits and/or vegetables hanging out together in an organic outdoor setting. The cast is PURELY fruits and vegetables. Visual treatment is set by the LOOK REGISTER above.

━━━ THE SCENE (2-3 kawaii fruits and/or vegetables + organic environment) ━━━
${scene}

━━━ DECOR ACCENTS — ALL 3 APPEAR BY NAME ━━━
${decorBlock}

━━━ COMPANION — APPEARS BY NAME (small, 5-10% of frame, NEAR the kawaii produce) ━━━
${companion}

━━━ ATMOSPHERIC ACCENT — APPEARS BY NAME ━━━
${atmospheric_accent}

━━━ CAMERA + FRAMING ━━━
${camera_framing}

━━━ LIGHTING ━━━
${lighting}

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ COLOR PALETTE ━━━
${palette}

━━━ VIBE MOOD ━━━
${vibeDirective.slice(0, 150)}

━━━ HARD MANDATES ━━━
The 2-3 kawaii fruits/veggies (with kawaii faces) + the organic environment (soil / branch / vine / wicker basket / mossy floor / market crate) + all 3 decor items + the companion + the atmospheric accent ALL appear by name.

━━━ HARD BANS ━━━
- Cast is PURELY fruits and vegetables — NO desserts/pastries/sweets/cakes/mochi/chocolate/breads; NO human faces; NO photoreal tokens; NO swapping the organic setting for a generic kawaii meadow.

━━━ OUTPUT ━━━
The raw Flux prompt, 160-220 words, comma-separated. Open with LOOK REGISTER, then the kawaii fruits/veggies + organic environment, then decor names + companion + atmospheric accent, then camera + lighting + time + palette + vibe. NO preamble, NO titles, NO headers, NO ━━━ markers, NO bulleted lists.`;
  },

  YUMBOT_NARRATIVE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      scene,
      camera_framing,
      lighting,
      palette,
      time_of_day,
      companion,
      decor_accents,
      atmospheric_accent,
    } = slots;

    const decorList = Array.isArray(decor_accents) ? decor_accents : [decor_accents];
    const decorBlock = decorList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');

    return `${
      sharedDNA && sharedDNA.lookRegister
        ? YUMBOT_LOOK_OVERRIDE(sharedDNA)
        : `━━━ LOOK REGISTER (NON-NEGOTIABLE — open your Flux prompt with this medium; render every surface in it) ━━━
${LOOK_FALLBACK}

`
    }You are writing NARRATIVE-ACTION renders for YumBot — a kawaii food vignette CAUGHT MID-STORY (baking-in-progress, garden harvest, pastry-shop-window peek, food parade, food tea-party, bakery delivery). The kawaii food is DOING something or playing a role in a story moment. The VISUAL TREATMENT is locked by the LOOK REGISTER above.

━━━ THE SCENE (kawaii subject mid-action + narrative moment + composition) ━━━
${scene}

━━━ DECOR ACCENTS — ALL 3 APPEAR BY NAME ━━━
${decorBlock}

━━━ COMPANION — APPEARS BY NAME (small, 5-10% of frame, NEAR the kawaii hero) ━━━
${companion}

━━━ ATMOSPHERIC ACCENT — APPEARS BY NAME ━━━
${atmospheric_accent}

━━━ CAMERA + FRAMING ━━━
${camera_framing}

━━━ LIGHTING ━━━
${lighting}

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ COLOR PALETTE ━━━
${palette}

━━━ VIBE MOOD ━━━
${vibeDirective.slice(0, 150)}

━━━ HARD MANDATES ━━━
The kawaii food (with kawaii face) is the HERO and the actor, caught MID-ACTION so the narrative moment reads instantly. All 3 decor items + the companion + the atmospheric accent appear by name.

━━━ HARD BANS ━━━
- NO human faces/hands/characters (the food IS the cast and actor); NO photoreal tokens; NO swapping the narrative moment for a static still-life.

━━━ OUTPUT ━━━
The raw Flux prompt, 160-220 words, comma-separated. Open with LOOK REGISTER, then the kawaii hero MID-ACTION + the narrative moment, then decor names + companion + atmospheric accent, then camera + lighting + time + palette + vibe. NO preamble, NO titles, NO headers, NO ━━━ markers, NO bulleted lists.`;
  },

  YUMBOT_FOOD_ADVENTURES: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      scene,
      camera_framing,
      lighting,
      palette,
      time_of_day,
      companion,
      decor_accents,
      atmospheric_accent,
    } = slots;

    const decorList = Array.isArray(decor_accents) ? decor_accents : [decor_accents];
    const decorBlock = decorList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');

    return `${
      sharedDNA && sharedDNA.lookRegister
        ? YUMBOT_LOOK_OVERRIDE(sharedDNA)
        : `━━━ LOOK REGISTER (NON-NEGOTIABLE — open your Flux prompt with this medium; render every surface in it) ━━━
${LOOK_FALLBACK}

`
    }You are writing FOOD-ADVENTURE storytelling renders for YumBot — adorable kawaii food CHARACTERS out in the world DOING fun things (riding rides, playing, performing, exploring). This is the playful, story-driven side of YumBot, NOT a staged close-up of a smiling food. The VISUAL TREATMENT is locked by the LOOK REGISTER above.

━━━ EMBODIED CHARACTER (NON-NEGOTIABLE — the food itself is the character) ━━━
Each character IS a food or drink come to life — always clearly recognizable as that exact food (its real shape, color, toppings and texture kept intact), with a kawaii face, physically acting out the scene (riding, kicking, splashing, performing, building). The food itself is the character. No humans, no human hands — every character is a food or drink.

━━━ THE SCENE (the food-character friend(s) + activity + real-world location + story moment) ━━━
${scene}

━━━ STORYTELLING FRAMING (NON-NEGOTIABLE — out in the world) ━━━
The real-world LOCATION fills the frame around the characters — a rich, fully-built, readable environment (rides, water, trees, stalls, crowds, lights, etc.) with multi-tier depth: foreground detail, the characters mid-action in the midground, the location built out behind and to the sides. This is a SCENE happening in a PLACE — NEVER a figurine on a blank / white / studio backdrop, NEVER a tight product close-up, NEVER a flat pastel void. The setting is as fun and full as the characters.

━━━ FOOD-FRIENDS — MULTIPLE HEROES WELCOME ━━━
Include the food-friend characters named in the scene as CO-HEROES, not tiny extras — they're all friends sharing the adventure. A group of 2-4 food characters doing the activity TOGETHER is great (like a band of friends), each its own recognizable food doing its own action.

━━━ DECOR ACCENTS — ALL 3 APPEAR BY NAME ━━━
${decorBlock}

━━━ COMPANION — APPEARS BY NAME (small, near the hero) ━━━
${companion}

━━━ ATMOSPHERIC ACCENT — APPEARS BY NAME ━━━
${atmospheric_accent}

━━━ CAMERA + FRAMING ━━━
${camera_framing}

━━━ LIGHTING ━━━
${lighting}

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ COLOR PALETTE ━━━
${palette}

━━━ VIBE MOOD ━━━
${vibeDirective.slice(0, 150)}

━━━ HARD BANS ━━━
- NO human faces/hands/characters (food IS the entire cast). NO photoreal tokens. NO tight close-up product shot. NO blank pastel-void background — the real-world location must read.

━━━ OUTPUT ━━━
The raw Flux prompt, 160-220 words, comma-separated. Open with the LOOK REGISTER tokens, then the embodied hero character mid-action + the real-world location + the story moment + the secondary food-friends, then decor names + companion + atmospheric accent, then camera + lighting + time + palette + vibe. NO preamble, NO titles, NO headers, NO ━━━ markers, NO bulleted lists.`;
  },

  YUMBOT_PLACES: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      scene,
      camera_framing,
      lighting,
      palette,
      time_of_day,
      companion,
      decor_accents,
      atmospheric_accent,
    } = slots;

    const decorList = Array.isArray(decor_accents) ? decor_accents : [decor_accents];
    const decorBlock = decorList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');

    return `${
      sharedDNA && sharedDNA.lookRegister
        ? YUMBOT_LOOK_OVERRIDE(sharedDNA)
        : `━━━ LOOK REGISTER (NON-NEGOTIABLE — open your Flux prompt with this medium; render every surface in it) ━━━
${LOOK_FALLBACK}

`
    }You are writing UNEXPECTED-PLACES renders for YumBot — a kawaii food vignette placed in a real-world venue where food doesn't usually live (greenhouse / library / vintage train / amusement park / aquarium / rooftop garden). The VISUAL TREATMENT is locked by the LOOK REGISTER above.

━━━ THE SCENE (kawaii subject + venue + composition) ━━━
${scene}

━━━ DECOR ACCENTS — ALL 3 APPEAR BY NAME ━━━
${decorBlock}

━━━ COMPANION — APPEARS BY NAME (small, 5-10% of frame, NEAR the kawaii hero) ━━━
${companion}

━━━ ATMOSPHERIC ACCENT — APPEARS BY NAME ━━━
${atmospheric_accent}

━━━ CAMERA + FRAMING ━━━
${camera_framing}

━━━ LIGHTING ━━━
${lighting}

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ COLOR PALETTE ━━━
${palette}

━━━ VIBE MOOD ━━━
${vibeDirective.slice(0, 150)}

━━━ HARD MANDATES ━━━
The kawaii food (with kawaii face) is the HERO, in a venue that reads instantly (keep the culturally-coded venue element the scene names). All 3 decor items + the companion + the atmospheric accent appear by name.

━━━ HARD BANS ━━━
- NO human faces (food is the cast); NO photoreal tokens; NO swapping the venue for a generic kawaii meadow.

━━━ OUTPUT ━━━
The raw Flux prompt, 160-220 words, comma-separated. Open with LOOK REGISTER, then hero + venue, then decor names + companion + atmospheric accent, then camera + lighting + time + palette + vibe. NO preamble, NO titles, NO headers, NO ━━━ markers, NO bulleted lists.`;
  },

  YUMBOT_SCALE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      scene,
      camera_framing,
      lighting,
      palette,
      time_of_day,
      companion,
      decor_accents,
      atmospheric_accent,
    } = slots;

    const decorList = Array.isArray(decor_accents) ? decor_accents : [decor_accents];
    const decorBlock = decorList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');

    return `${
      sharedDNA && sharedDNA.lookRegister
        ? YUMBOT_LOOK_OVERRIDE(sharedDNA)
        : `━━━ LOOK REGISTER (NON-NEGOTIABLE — open your Flux prompt with this medium; render every surface in it) ━━━
${LOOK_FALLBACK}

`
    }You are writing SCALE-TWIST renders for YumBot — a kawaii food vignette at an UNUSUAL SCALE or setting (colossal in a real city / microscopic at ant-scale / an entire island made of food / a chocolate-river world / undersea pastry kingdom / deep cosmic space). The VISUAL TREATMENT is locked by the LOOK REGISTER above.

━━━ THE SCENE (kawaii subject + scale twist + composition) ━━━
${scene}

━━━ DECOR ACCENTS — ALL 3 APPEAR BY NAME, each in its own zone (not stacked) ━━━
${decorBlock}

━━━ COMPANION — APPEARS BY NAME (small, 5-10% of frame, NEAR the kawaii hero) ━━━
${companion}

━━━ ATMOSPHERIC ACCENT — APPEARS BY NAME (small, understated) ━━━
${atmospheric_accent}

━━━ CAMERA + FRAMING ━━━
${camera_framing}

━━━ LIGHTING ━━━
${lighting}

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ COLOR PALETTE ━━━
${palette}

━━━ VIBE MOOD ━━━
${vibeDirective.slice(0, 150)}

━━━ HARD MANDATES ━━━
The kawaii food (with kawaii face) is the HERO, and the SCALE TWIST reads instantly (keep what the scene names — colossal city / micro ant-world / cake-island / chocolate-river / undersea / cosmic). All 3 decor items + the companion + the atmospheric accent appear by name.

━━━ HARD BANS ━━━
- NO human-character cast (food is the cast); NO photoreal tokens ("photograph" / "DSLR" / "f/2.8"); NO swapping the scale twist for a default tabletop kawaii scene.

━━━ OUTPUT ━━━
The raw Flux prompt, 160-220 words, comma-separated. Open with the LOOK REGISTER tokens, then the kawaii hero + scale twist, then the 3 decor items + companion + atmospheric accent by name, then camera + lighting + time + palette + vibe. NO preamble, NO titles, NO headers, NO ━━━ markers, NO bulleted lists.`;
  },

  YUMBOT_CUISINE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      scene,
      camera_framing,
      lighting,
      palette,
      time_of_day,
      companion,
      decor_accents,
      atmospheric_accent,
    } = slots;

    const decorList = Array.isArray(decor_accents) ? decor_accents : [decor_accents];
    const decorBlock = decorList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');

    return `${
      sharedDNA && sharedDNA.lookRegister
        ? YUMBOT_LOOK_OVERRIDE(sharedDNA)
        : `━━━ LOOK REGISTER (NON-NEGOTIABLE — open your Flux prompt with this medium; render every surface in it) ━━━
${LOOK_FALLBACK}

`
    }You are writing CUISINE renders for YumBot — a kawaii food vignette anchored in one of 7 global cuisine cultures (French / Italian / Mexican / Korean / Indian / Middle-Eastern / Nordic). The VISUAL TREATMENT is locked by the LOOK REGISTER above — render the whole scene in THAT medium.

━━━ THE SCENE (kawaii subject + cuisine setting + composition) ━━━
${scene}

━━━ DECOR ACCENTS — ALL 3 APPEAR BY NAME, each in its own zone (not stacked) ━━━
${decorBlock}

━━━ COMPANION — APPEARS BY NAME (small, 5-10% of frame, NEAR the kawaii hero) ━━━
${companion}

━━━ ATMOSPHERIC ACCENT — APPEARS BY NAME (small, understated) ━━━
${atmospheric_accent}

━━━ CAMERA + FRAMING ━━━
${camera_framing}

━━━ LIGHTING ━━━
${lighting}

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ COLOR PALETTE ━━━
${palette}

━━━ VIBE MOOD ━━━
${vibeDirective.slice(0, 150)}

━━━ HARD MANDATES ━━━
The kawaii food (with kawaii face) is the HERO, and the CUISINE setting reads instantly (keep the culturally-coded element the scene names). All 3 decor items + the companion + the atmospheric accent appear by name. Kawaii register, NOT photoreal.

━━━ HARD BANS ━━━
- NO human faces, NO chefs/customers/vendors as people (food is the cast); NO photoreal tokens ("photograph" / "DSLR" / "f/2.8"); NO swapping the cuisine for a generic kawaii meadow.

━━━ OUTPUT ━━━
The raw Flux prompt, 160-220 words, comma-separated. Open with the LOOK REGISTER tokens, then the kawaii hero + cuisine setting, then the 3 decor items + companion + atmospheric accent by name, then camera + lighting + time + palette + vibe. NO preamble, NO titles, NO headers, NO ━━━ markers, NO bulleted lists.`;
  },

  YUMBOT_WHIMSICAL: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      scene,
      camera_framing,
      lighting,
      palette,
      time_of_day,
      companion,
      decor_accents,
      atmospheric_accent,
    } = slots;

    const decorList = Array.isArray(decor_accents) ? decor_accents : [decor_accents];
    const decorBlock = decorList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');

    return `${
      sharedDNA && sharedDNA.lookRegister
        ? YUMBOT_LOOK_OVERRIDE(sharedDNA)
        : `━━━ LOOK REGISTER (NON-NEGOTIABLE — open your Flux prompt with this medium; render every surface in it) ━━━
${LOOK_FALLBACK}

`
    }You are writing WHIMSICAL renders for YumBot — a kawaii food vignette caught in an unexpected concept (modeling on a runway, relaxing at a spa, playing in an orchestra, attending school, hanging with pets / toys). The VISUAL TREATMENT is locked by the LOOK REGISTER above — render the whole scene in THAT medium.

━━━ THE SCENE (kawaii subject + whimsical concept + composition) ━━━
${scene}

━━━ DECOR ACCENTS — ALL 3 APPEAR BY NAME, each in its own zone (not stacked) ━━━
${decorBlock}

━━━ COMPANION — APPEARS BY NAME (small, 5-10% of frame, NEAR the kawaii hero) ━━━
${companion}

━━━ ATMOSPHERIC ACCENT — APPEARS BY NAME (small, understated) ━━━
${atmospheric_accent}

━━━ CAMERA + FRAMING ━━━
${camera_framing}

━━━ LIGHTING ━━━
${lighting}

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ COLOR PALETTE ━━━
${palette}

━━━ VIBE MOOD ━━━
${vibeDirective.slice(0, 150)}

━━━ HARD MANDATES ━━━
The kawaii food (with kawaii face) is the HERO, and the whimsical concept reads instantly (keep what the scene names — runway / spa / orchestra / school / pets / toys). All 3 decor items + the companion + the atmospheric accent appear by name. Kawaii register, NOT photoreal.

━━━ HARD BANS ━━━
- NO human faces, NO human models/students/spa-goers (food is the cast); NO photoreal tokens ("photograph" / "DSLR" / "f/2.8"); NO swapping the whimsical concept for a generic kawaii meadow.

━━━ OUTPUT ━━━
The raw Flux prompt, 160-220 words, comma-separated. Open with the LOOK REGISTER tokens, then the kawaii hero + whimsical concept, then the 3 decor items + companion + atmospheric accent by name, then camera + lighting + time + palette + vibe. NO preamble, NO titles, NO headers, NO ━━━ markers, NO bulleted lists.`;
  },

  YUMBOT_MEAL_TYPES: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      scene,
      camera_framing,
      lighting,
      palette,
      time_of_day,
      companion,
      decor_accents,
      atmospheric_accent,
    } = slots;

    const decorList = Array.isArray(decor_accents) ? decor_accents : [decor_accents];
    const decorBlock = decorList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');

    return `${
      sharedDNA && sharedDNA.lookRegister
        ? YUMBOT_LOOK_OVERRIDE(sharedDNA)
        : `━━━ LOOK REGISTER (NON-NEGOTIABLE — open your Flux prompt with this medium; render every surface in it) ━━━
${LOOK_FALLBACK}

`
    }You are writing MEAL-TYPES renders for YumBot — a kawaii food vignette in a specific meal-occasion setting, populated with multiple props + a tiny companion + an atmospheric flourish. The VISUAL TREATMENT is locked by the LOOK REGISTER above — render the whole scene in THAT medium.

━━━ THE SCENE (kawaii subject + meal-occasion setting + composition) ━━━
${scene}

━━━ DECOR ACCENTS — ALL 3 APPEAR BY NAME, each in its own zone (not stacked) ━━━
${decorBlock}

━━━ COMPANION — APPEARS BY NAME (small, 5-10% of frame, NEAR the kawaii hero) ━━━
${companion}

━━━ ATMOSPHERIC ACCENT — APPEARS BY NAME (small, understated) ━━━
${atmospheric_accent}

━━━ CAMERA + FRAMING ━━━
${camera_framing}

━━━ LIGHTING ━━━
${lighting}

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ COLOR PALETTE ━━━
${palette}

━━━ VIBE MOOD ━━━
${vibeDirective.slice(0, 150)}

━━━ HARD MANDATES ━━━
The kawaii food (with kawaii face) is the HERO, and the meal-occasion setting reads instantly (keep what the scene names — windowsill / tiered china stand / checker blanket / cafe counter / neon food truck / dim kitchen). All 3 decor items + the companion + the atmospheric accent appear by name. Kawaii register, NOT photoreal.

━━━ HARD BANS ━━━
- NO human faces, NO chef hats/aprons/uniforms; NO photoreal tokens ("photograph" / "DSLR" / "f/2.8"); NO replacing the meal-occasion setting with a generic kawaii meadow.

━━━ OUTPUT ━━━
The raw Flux prompt, 160-220 words, comma-separated. Open with the LOOK REGISTER tokens, then the kawaii hero + meal-occasion setting, then the 3 decor items + companion + atmospheric accent by name, then camera + lighting + time + palette + vibe. NO preamble, NO titles, NO headers, NO ━━━ markers, NO bulleted lists.`;
  },
};
