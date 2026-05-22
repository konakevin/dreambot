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

module.exports = {
  YUMBOT_FLORAL_GARDEN_CUP: ({ slots, sharedDNA, vibeDirective }) => {
    const { vessel, overflowing_flora, tabletop_scatter, frame_branches, palette, background, lighting, night_mode } = slots;
    const floraList = Array.isArray(overflowing_flora) ? overflowing_flora : [overflowing_flora];
    const floraBlock = floraList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');
    const scatterList = Array.isArray(tabletop_scatter) ? tabletop_scatter : [tabletop_scatter];
    const scatterBlock = scatterList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');

    return `You are writing FLORAL-GARDEN-CUP renders for YumBot — bex.ai's signature look. A kawaii-faced VESSEL (teacup / takeout-cup / mug / bowl) OVERFLOWING with a magical garden of flowers. Painterly Pop-Mart-illustration-fusion register. Output wraps with style prefix + suffix.
${night_mode ? `

⚠⚠⚠ NIGHTTIME LOCK — READ FIRST, OVERRIDES EVERYTHING BELOW ⚠⚠⚠

${night_mode}

NIGHTTIME LOCK NOTES — apply these to EVERYTHING below:
- The vessel + bouquet are at NIGHT, on a tabletop in a moonlit garden / candlelit interior. Background is DARK indigo / midnight / inky — NOT 'dreamy pastel bokeh' bright.
- Palette = JEWEL-TONES + warm-lantern-amber + cool-moonlit-blue + pearl-cream + deep-indigo background — NOT bright kawaii pastels in the background. The vessel + flowers can stay soft-pearlescent, but the AIR + BACKDROP are dark.
- Lighting = moon + paper-lanterns + candle-glow + fairy-light strings catching dewdrops. NO 'soft volumetric pastel-light pouring down', NO 'warm-pastel rim-light' on a daytime backdrop.
- If any phrase below says 'soft volumetric pastel-light' / 'warm-pastel rim-light' on bright background / 'dreamy pastel bokeh' — REPLACE with night equivalent (moonlit dewdrop sparkle, candle-glow halos, lantern-bokeh dark backdrop).

` : ''}
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

${night_mode ? `━━━ ⚠ NIGHTTIME OVERRIDE — this render is at NIGHT (overrides lighting) ━━━
${night_mode}` : `━━━ LIGHTING ━━━
${lighting}`}

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

  YUMBOT_FLORAL_GARDEN_SCENE: ({ slots, sharedDNA, vibeDirective }) => {
    const { scene_type, vessel, overflowing_flora, tabletop_scatter, frame_branches, palette, background, lighting, night_mode } = slots;
    const floraList = Array.isArray(overflowing_flora) ? overflowing_flora : [overflowing_flora];
    const floraBlock = floraList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');
    const scatterList = Array.isArray(tabletop_scatter) ? tabletop_scatter : [tabletop_scatter];
    const scatterBlock = scatterList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');

    return `You are writing FLORAL-GARDEN renders for YumBot. The SCENE is a RICH kawaii garden composition — indoor (potting shed / sunroom / windowsill / tea-time table / vanity / fireplace mantle) or outdoor (cottage patio / greenhouse / balcony / picnic-in-garden / garden bench / gazebo). The scene contains MULTIPLE kawaii-faced planters/vessels clustered together, OVERFLOWING with magical flowers, kawaii treats scattered through, magical sparkle accents. Painterly Pop-Mart-illustration-fusion register. Output wraps with style prefix + suffix.
${night_mode ? `

⚠⚠⚠ NIGHTTIME LOCK — READ FIRST, OVERRIDES EVERYTHING BELOW ⚠⚠⚠

${night_mode}

NIGHTTIME LOCK NOTES — apply these to EVERYTHING below:
- The garden scene is at NIGHT. Whether indoor (candlelit potting shed / moonlit windowsill / nighttime sunroom) or outdoor (moonlit patio / greenhouse-at-night / nighttime balcony) — the AIR + BACKDROP are DARK.
- Sky / setting background = indigo / navy / midnight / inky (outdoor) OR deep-shadowed-interior (indoor). NOT 'pastel atmosphere' bright, NOT 'leaded windows' showing sunny day.
- Palette = JEWEL-TONES + warm-lantern-amber + cool-moonlit-blue + pearl-cream + deep-indigo backdrop — NOT bright kawaii pastels in the background.
- Lighting = moon + paper-lanterns + candle-glow + fairy-light strings + firefly drift. NO 'soft volumetric pastel-light pouring down', NO 'warm-pastel rim-light' on a bright daytime backdrop.
- If any phrase below says 'soft volumetric pastel-light' / 'warm-pastel rim-light' / 'pastel atmosphere' / 'leaded windows' — REPLACE with night equivalent. The render must read as full NIGHT garden scene.

` : ''}
━━━ ⚠ HARD RULE #1: SCENE-TYPE IS THE COMPOSITION ━━━

The scene-type below establishes the full setting (indoor or outdoor garden setting) AND the cluster of 3+ kawaii planters. The render is ABOUT that scene-type — NOT a single isolated vessel on a plain background. The scene is FULL and RICH — packed with planters, flowers, treats, magical accents. NEVER minimal.

━━━ ⚠ HARD RULE #2: MULTIPLE KAWAII PLANTERS + OVERFLOWING FLOWERS + KAWAII TREATS ━━━

Each scene contains:
- THREE OR MORE kawaii-faced planters/vessels clustered together (teapots, mason jars, terracotta pots, watering cans, mugs, garden baskets — each with a smiling face)
- OVERFLOWING magical flowers spilling from the planters (peonies, ranunculus, cherry-blossom, hydrangeas, dahlias, iridescent dreamy blooms)
- KAWAII TREATS scattered through the scene (macarons, cupcakes, sugar cookies, donuts, taiyaki, mochi, candies — many with tiny kawaii faces)
- MAGICAL ACCENTS (butterflies, pearl-orbs floating, sparkle motes, fairy-lights, glowing pollen drift, cherry-blossom-petal rain)

━━━ ⚠ HARD RULE #3: NO LIVING CHARACTERS — VESSELS+TREATS ARE THE CAST ━━━

NO chibi creatures, NO humans, NO animals — only kawaii-faced vessels + kawaii treats. Butterflies and pearl-orbs OK as magical accents.

━━━ ⚠ HARD RULE #4: PAINTERLY-ILLUSTRATION FUSION ━━━

Pop-Mart designer-vinyl glossy 3D-CGI fused with painterly-illustration warmth (Studio Ghibli + bex.ai + Disney-Tangled storybook texture). Glossy pearlescent vessels + painterly-textured flowers + dreamy soft-focus background.

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

${night_mode ? `━━━ ⚠ NIGHTTIME OVERRIDE — this render is at NIGHT (overrides lighting) ━━━
${night_mode}` : `━━━ LIGHTING ━━━
${lighting}`}

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
${vibeDirective.slice(0, 250)}

━━━ HARD BANS ━━━
- NO real chibi creatures / characters / humans / animals
- NO single hero vessel alone on plain background — must be RICH multi-planter scene
- NO minimal / empty / sparse composition
- NO pathway / road / stream / river running through composition
- NO modern decor / phones / tech
- NO scary / dark / moody

━━━ OUTPUT FORMAT (MANDATORY) ━━━

LEAD WITH THE SCENE — exactly as described above, with the multiple kawaii planters clustered in the setting. Then layer in: overflowing flora, kawaii treats scattered, framing branches, sparkle accents, lighting, painterly rendering.

Template:
"[scene-type composition with multiple kawaii planters clustered in the setting] — overflowing with [flora 1, flora 2, flora 3, flora 4], cherry-blossom branches [arching in], kawaii treats and [scatter 1, 2, 3] scattered throughout, butterflies and pearl-orbs floating, [palette], [background mood], [lighting], painterly Pop-Mart-illustration-fusion rendering."

Output ONLY the raw 130-180 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. The scene is RICH and FULL — multiple planters + flowers + treats + magical accents all visible.`;
  },

  YUMBOT_RAINBOW_DREAMSCAPE: ({ slots, sharedDNA, vibeDirective }) => {
    const { food_inhabitants, dreamscape_setting, rainbow_element, sky_atmosphere, environment, decor, companions, camera, lighting, night_mode } = slots;
    // food_inhabitants is now an array of 5 (pickN:5 from FOOD_CATALOG)
    const foodList = Array.isArray(food_inhabitants) ? food_inhabitants : [food_inhabitants];
    const foodBlock = foodList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');
    const decorList = Array.isArray(decor) ? decor : [decor];
    const decorBlock = decorList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');
    const envList = Array.isArray(environment) ? environment : [environment];
    const envBlock = envList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');
    const compList = Array.isArray(companions) ? companions : [companions];
    const compBlock = compList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');

    return `You are writing RAINBOW-DREAMSCAPE renders for YumBot — bex.ai's wider scenic look. EXACTLY 5 kawaii food-creatures gathered in a lush pastel outdoor dreamscape, COLORFUL and VIBRANT pastel palette throughout (the "rainbow-" in the path name is a reminder that the palette is colorful pastels — it does NOT mean the render must be rainbow-themed). Output wraps with style prefix + suffix.
${night_mode ? `

⚠⚠⚠ NIGHTTIME LOCK — READ FIRST, OVERRIDES EVERYTHING BELOW ⚠⚠⚠

${night_mode}

NIGHTTIME LOCK NOTES — apply these to EVERYTHING below:
- The dreamscape is at NIGHT. Sky is DARK indigo / navy / midnight / inky — NOT 'sunny vibrant pastel light', NOT bright-pastel-sky.
- Palette = JEWEL-TONES + warm-lantern-amber + cool-moonlit-blue + pearl-cream + deep-indigo — NOT 'saturated pinks, mints, lavenders, peaches, baby-blues, creams' bright daytime palette.
- Lighting = moon + paper-lanterns + fairy-light strings + glowing-balloon-orbs + creature-bioluminescence. NO 'sunny vibrant pastel light', NO bright sunny landscape.
- If any phrase below says 'sunny vibrant pastel' / 'colorful palette SINGS' / 'sunny meadow' — REPLACE with the unambiguous-night equivalent. The render must read as full NIGHT dreamscape, not bright-pastel-meadow-with-a-moon.

` : ''}
━━━ ⚠ HARD RULE #1: NAME ALL 5 FOODS EXPLICITLY — COUNT THEM ━━━

The 5 foods below MUST appear in the output by name. Count them: 1, 2, 3, 4, 5. Each visible in the scene as a creature-inhabitant of the meadow. Each has its own kawaii smiling face. Group them in the scene like little friends gathered together. NEVER drop a food. NEVER abbreviate to "and others." Name each one specifically.

⚠ FAILURE: rendering 1, 2, or 3 foods. PASS: 5 distinct kawaii foods visible.

━━━ ⚠ HARD RULE #2: COLORFUL VIBRANT PASTEL PALETTE ━━━

The signature is a colorful vibrant pastel palette — saturated pinks, mints, lavenders, peaches, baby-blues, creams. The whole scene SINGS with color. Rainbows MAY appear as one accent among many (a rainbow arching softly overhead, rainbow-confetti drifting through air, rainbow-prism light scattered across the grass) — they are NOT the hero of the composition and NOT required in every render. The colorful palette is the hero.

━━━ ⚠ HARD RULE #3: OUTDOOR PASTEL LANDSCAPE ━━━

The 3 landscape features below MUST be visibly rendered in the scene — flowers, foliage, pastel hills, soft grass, cherry-blossom trees, rocks, sugar-glitter air, etc. The foods are nestled IN this landscape — on grass / on rocks / on a soft hilltop / under blossoming trees / among flowers — like meadow-creatures living there.

⚠ HARD BAN: tabletop / counter / flat-surface composition. NO bokeh-only backdrop. NO river/stream/brook/path/lane/trail/bridge running through the composition or splitting the frame from foreground to vanishing point — this was a chronic failure mode of older renders. The scene is OUTDOOR NATURE composed as a wide cluster / gathering / clearing, NOT a Z-axis recede.

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

${night_mode ? `━━━ ⚠ NIGHTTIME OVERRIDE — this render is at NIGHT (overrides lighting + sky_atmosphere) ━━━
${night_mode}` : `━━━ LIGHTING ━━━
${lighting}`}

━━━ SCENE PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 200)}

━━━ OUTPUT FORMAT (MANDATORY) ━━━

Lead with the outdoor pastel landscape, then NAME ALL 5 FOODS, then sky + decor + optional rainbow accent.

Template:
"Wider scenic outdoor shot of [dreamscape setting] with [landscape feature 1], [landscape feature 2], [landscape feature 3] visible — five kawaii food-creatures gathered: (1) [food 1 named in 6-10 words], (2) [food 2 named], (3) [food 3 named], (4) [food 4 named], (5) [food 5 named] — [sky element], [decor 1, 2, 3 scattered], [companion 1 + 2 fluttering], [rainbow_element as optional accent if it fits naturally], painterly Pop-Mart pearlescent rendering, sunny vibrant pastel light."

⚠ Count the (1) (2) (3) (4) (5) explicitly in the output to ensure all 5 foods appear. The numbered list is required.

⚠ NO river / stream / brook / path / trail / lane / bridge as a compositional element. The landscape is a wide pastel meadow / clearing / hillside / garden — not a path-cuts-through-the-frame scene.

Output ONLY the raw 130-170 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. All 5 foods + landscape features + companions read clearly.`;
  },

  YUMBOT_CANDY_FANTASY: ({ slots, sharedDNA, vibeDirective }) => {
    const { candy_scene_type, candy_world_signature, candy_terrain, candy_sky, food_inhabitants, companions, decor_accents, candy_camera, candy_lighting, candy_time_of_day, candy_weather, night_mode } = slots;
    const sigList = Array.isArray(candy_world_signature) ? candy_world_signature : [candy_world_signature];
    const sigBlock = sigList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');
    const foodList = Array.isArray(food_inhabitants) ? food_inhabitants : [food_inhabitants];
    const foodBlock = foodList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');
    const compList = Array.isArray(companions) ? companions : [companions];
    const decorList = Array.isArray(decor_accents) ? decor_accents : [decor_accents];

    return `You are writing CANDY-FANTASY renders for YumBot. The SCENE-TYPE is the WHOLE point — it dictates where the 5 food-characters are placed and how the composition is framed. Atmosphere, lighting, time-of-day, weather wrap around the scene-type. Output wraps with style prefix + suffix.
${night_mode ? `

⚠⚠⚠ NIGHTTIME LOCK — READ FIRST, OVERRIDES EVERYTHING BELOW ⚠⚠⚠

${night_mode}

NIGHTTIME LOCK NOTES — apply these to EVERYTHING below:
- The candy-world is at NIGHT. Sky is DARK indigo / navy / midnight / inky — NOT twilight, NOT dusk.
- Candy-world palette = JEWEL-TONES + warm-lantern-amber + cool-moonlit-blue + pearl-cream — NOT bright Disney-CGI sunny pastels. Candy surfaces glossy but DEEP-toned at night.
- Lighting = moon + candy-paper-lanterns + glowing-gumdrop-fairy-lights + bioluminescent-frosting. NO daytime sun, NO bright pastel sunny light.
- If any phrase below says 'sunny pastel' / 'warm Disney-CGI' / 'bright lush saturated pastel' — REPLACE with the unambiguous-night equivalent. The render must read as full NIGHT, not bright-candy-with-a-moon.

` : ''}
━━━ ⚠ HARD RULE #1: SCENE-TYPE IS THE COMPOSITION ━━━

The scene-type below is a COMPOSITION-LOCKED scene with explicit character placement (perched on a railing / seated around a campfire / clinging to a pinwheel / inside a glass jar / atop a cake mountain / on a roller-coaster crest / etc.). The 5 kawaii food-characters take the EXACT positions described in the scene-type. The render is ABOUT the scene-type — atmosphere is decoration around it.

DO NOT replace the scene-type with a generic "kawaii characters in candy meadow". Whatever the scene-type prop is (bridge railing / treehouse / Easter-egg boat / advent-calendar wall / lazy-Susan turntable / etc.) must be the visual anchor of the composition.

━━━ ⚠ HARD RULE #2: 5 FOOD-CHARACTERS TAKE THE SCENE-TYPE POSITIONS ━━━

The 5 kawaii foods below are the (1) (2) (3) (4) (5) food-friends from the scene-type. Assign each food to one of the positions/poses described in the scene-type (e.g. if the scene-type says "perched along a bridge railing", then (1) is leaning forward, (2) is sitting cross-legged, etc.). Use the foods' specific shapes — but their PLACEMENT comes from the scene-type.

━━━ ⚠ HARD RULE #3: CANDY-FANTASY WORLD AESTHETIC ━━━

Everything is made of candy/cake/sugar/cookie/frosting/marshmallow. NOT real wood / metal / fabric / stone — every prop in the scene-type is rendered in confectionary material. Disney-CGI lush saturated pastel palette — kawaii vinyl-pearlescent finish.

━━━ THE SCENE (this is the COMPOSITION — character placement is built in) ━━━
${candy_scene_type}

━━━ 5 KAWAII FOOD-CHARACTERS (these are the (1)-(5) food-friends in the scene above) ━━━
${foodBlock}

━━━ 1 BACKGROUND SIGNATURE ELEMENT (subtle accent, NOT a competing landmark) ━━━
${sigBlock}

${night_mode ? `━━━ ⚠ NIGHTTIME OVERRIDE — this render is at NIGHT (overrides time + weather + lighting) ━━━
${night_mode}` : `━━━ TIME OF DAY ━━━
${candy_time_of_day}

━━━ WEATHER / ATMOSPHERE ━━━
${candy_weather}

━━━ LIGHTING DIRECTION / QUALITY ━━━
${candy_lighting}`}

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
${vibeDirective.slice(0, 200)}

━━━ SPARKLE STACK ━━━

- Glossy designer-vinyl finish on EVERY candy element
- Saturated lush pastel + warm Disney-CGI palette
- Sugar-glitter dust catching light
- Painterly Pop-Mart-illustration-fusion on the whole scene

━━━ HARD BANS ━━━

- NO replacing the scene-type with a generic candy-meadow composition
- NO real grass / soil / wood / metal — everything is candy/sugar/frosting
- NO photoreal terrain or sky
- NO dark / moody / scary
- NO industrial / modern setting
- NO neon-electric colors — lush saturated pastels
- NO chibi creatures / humans / animals (food is the only cast)

━━━ OUTPUT FORMAT (MANDATORY) ━━━

LEAD WITH THE SCENE — exactly as described above, with the 5 food-characters slotted into the positions. The scene-type opens the prompt and is the composition. Then BUILD OUT THE RICH CANDY-WORLD BACKDROP that surrounds the scene — describe the candy-fantasy landscape visible behind/around the foreground scene (frosted-cake mountains, oversized lollipop-trees, marshmallow drifts, candy-cane forests, sprinkle-grass terrain, cotton-candy clouds, candy-rainbow arches, sugar-glitter air, distant candy-monuments) so the render has VISUAL DEPTH and RICHNESS behind the scene. The backdrop is the world the scene lives in — not negotiable, not optional.

Template:
"[scene-type rewritten with (1)-(5) named foods in the positions] — set inside a RICH candy-fantasy world: [rich layered candy-landscape backdrop: 3-5 concrete candy-world elements like frosted-cake mountains / lollipop-tree groves / marshmallow drifts / candy-rainbow arches / cotton-candy clouds / sugar-crystal formations / candy-monuments — describe them in the background filling out the scene's depth] — [time-of-day], [weather], [lighting], [camera framing]. [1 signature element accent / 1 decor accent / 1 companion]. Painterly kawaii Pop-Mart candy-fantasy rendering."

⚠ THREE LAYERS: (1) foreground scene-type composition with characters placed, (2) RICH candy-world backdrop visible behind/around, (3) atmosphere/framing. Skip layer 2 = the render looks empty. Make layer 2 visually concrete with 3-5 candy-world elements.

Output ONLY the raw 130-180 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers.`;
  },

  YUMBOT_JAPANESE_FESTIVAL: ({ slots, sharedDNA, vibeDirective }) => {
    const { scene_type, market_backdrop, signature, terrain, sky, camera, lighting, time_of_day, weather, food_inhabitants, companion } = slots;
    const foodList = Array.isArray(food_inhabitants) ? food_inhabitants : [food_inhabitants];
    const foodBlock = foodList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');
    const sigList = Array.isArray(signature) ? signature : [signature];
    const sigBlock = sigList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');

    return `You are writing JAPANESE-FESTIVAL renders for YumBot — kawaii matsuri scenes with 5 kawaii Japanese festival foods composed cleanly in a richly-detailed matsuri/market setting. Natural family-portrait cluster with slight pose variation per food — NOT identical lineup, NOT chaotic action. Painterly Pop-Mart fusion register with Studio-Ghibli warmth. Output wraps with style prefix + suffix.

━━━ ⚠ HARD RULE #1: 5 FOODS NAMED FIRST — ALL VISIBLE ━━━

The 5 kawaii foods MUST appear with explicit names at the START of the output: (1) (2) (3) (4) (5). Group them so all 5 fit cleanly in the frame — close enough that each face is visible. NEVER drop a food. Natural family-portrait cluster.

⚠ FAILURE = rendering 1, 2, 3, or 4 foods. PASS = 5 distinct kawaii foods all visible.

━━━ ⚠ HARD RULE #2: SLIGHT POSE VARIATION (NOT lineup, NOT acrobatics) ━━━

The scene-type below describes the composition with slight POSE VARIATION per food — one peeking forward, one tilted, one leaning back, one looking up, one tallest at center. Render EXACTLY that composition. NOT a row of identical-posed soldiers. NOT chaotic stacking / acrobatics / vendor drama.

━━━ ⚠ HARD RULE #3: VISIBLE MATSURI BACKDROP + ATMOSPHERIC LAYERS ━━━

The matsuri/market BACKDROP must be CLEARLY VISIBLE behind the foods. Plus the SIGNATURE elements accent the scene. Plus terrain underfoot. Plus sky overhead. Plus time-of-day light. Plus weather drift. Plus one tiny companion accent. All 11 axes layer into the render.

━━━ ⚠ HARD RULE #4: MATSURI ATMOSPHERE ━━━

Traditional Japanese FESTIVAL — chochin paper-lanterns, wooden festival architecture, sakura petals OR autumn maple-leaves drifting, warm lantern-glow + soft sky palette. NO modern urban / mall / shopping. Pop-Mart designer-vinyl glossy 3D-CGI fused with painterly Studio-Ghibli-meets-bex.ai warmth.

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
${vibeDirective.slice(0, 200)}

━━━ POSTER MOMENT ━━━

"a magical Japanese matsuri night — 5 kawaii foods gathered together in a rich festival setting with natural personality." Wallpaper-poster bex.ai-meets-Studio-Ghibli register.

━━━ HARD BANS ━━━

- NO modern urban / shopping / mall scenes — traditional matsuri ONLY
- NO Western carnival / fairground / Ferris wheel — Japanese festival ONLY
- NO photoreal / harsh-realism — kawaii painterly Pop-Mart fusion
- NO dark / moody / scary atmosphere
- NO chibi creatures / humans / animals as cast — only kawaii foods (tiny companion is OK)
- NO real kanji / Japanese-text characters — decorative-pattern only, never legible-text
- NO pathway / road / lane RECEDING into vanishing point — tight cluster composition
- NO chaotic vertical-stacking / climbing / vendor-customer drama — natural pose-varied cluster
- NO blurred-out generic-pink-bokeh backdrop — matsuri setting MUST be visibly rendered
- NO identical-row-of-soldiers lineup — natural family-portrait pose variation per food

━━━ OUTPUT FORMAT (MANDATORY) ━━━

LEAD with the 5 foods named at the START (early tokens = Flux locks them), then weave in scene-type + backdrop + signature + terrain + sky + lighting + time + weather + companion as one integrated description.

Template:
"Five kawaii Japanese-festival foods together — (1) [food 1 named in 5-8 words], (2) [food 2 named], (3) [food 3 named], (4) [food 4 named], (5) [food 5 named] — [scene-type pose-varied cluster arrangement]. Set in [market_backdrop matsuri setting visibly rendered]. [signature 1] and [signature 2] visible in the scene, [terrain] underfoot, [sky] overhead, [time-of-day], [weather drifting], [lighting]. [companion] nearby. [camera framing]. Painterly Pop-Mart kawaii-matsuri rendering."

⚠ Count (1)(2)(3)(4)(5) explicitly. ALL 5 FOODS named at the START. Natural pose-variation cluster.

Output ONLY the raw 140-200 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers.`;
  },

  YUMBOT_MINI_CHEF: ({ slots, sharedDNA, vibeDirective }) => {
    const { scene_type, kitchen_backdrop, signature, terrain, sky, camera, lighting, time_of_day, atmosphere, food_inhabitants, companion, dish_being_prepared } = slots;
    const foodList = Array.isArray(food_inhabitants) ? food_inhabitants : [food_inhabitants];
    const foodBlock = foodList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');
    const sigList = Array.isArray(signature) ? signature : [signature];
    const sigBlock = sigList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');

    return `You are writing MINI-CHEF renders for YumBot — kawaii kitchen scenes with 5 KAWAII FOOD-CHARACTERS (the foods themselves) cooking together to prepare a kawaii dish in a richly-detailed kitchen. The food-characters ARE the cooks — no human chef figures, no chibi-children, no human-coded clothing. Natural family-portrait cluster with slight pose variation. Painterly Pop-Mart fusion with Studio-Ghibli kitchen warmth. Output wraps with style prefix + suffix.

━━━ ⚠ HARD RULE #1: 5 KAWAII FOOD-CHARACTERS NAMED FIRST — ALL VISIBLE ━━━

The 5 kawaii foods MUST appear with explicit names at the START of the output: (1) (2) (3) (4) (5). The FOOD ITSELF is the character — taiyaki / mochi / cupcake / donut / dango / etc. with kawaii face ON the food, holding tiny baking tools, dusted with flour, etc. NEVER a human or chibi-child holding/wearing the food. Group them so all 5 fit cleanly in the frame.

⚠ FAILURE = rendering humans / chibi-children / 1-4 foods. PASS = 5 distinct kawaii food-character cooks all visible.

━━━ ⚠ HARD RULE #2: NO HUMAN-CODED LANGUAGE OR APPAREL ━━━

ABSOLUTE BAN on human-coded chef apparel: NO chef hats / toques / aprons / neckerchiefs / chef-outfits / chef-uniforms / chef-attire on the foods. The foods are inherently cooks because of what they're DOING — leaning over the bowl, holding a whisk, dusting flour, piping frosting. The food's KAWAII FACE is on the food itself, NOT on a chibi-child holding the food. Saying "wearing X" is BANNED — that priming reads as a human in chef-attire.

━━━ ⚠ HARD RULE #3: SLIGHT POSE VARIATION (NOT lineup, NOT acrobatics) ━━━

The scene-type below describes the kitchen composition with slight POSE VARIATION per food. Natural family-portrait cluster.

━━━ ⚠ HARD RULE #4: DISH BEING PREPARED + KITCHEN BACKDROP VISIBLE ━━━

The food-cooks are PREPARING a specific kawaii dish (described below) — that dish is the visual centerpiece. The kitchen BACKDROP must be CLEARLY VISIBLE behind them.

━━━ ⚠ HARD RULE #5: KAWAII KITCHEN AESTHETIC ━━━

Cozy kawaii kitchen (cottage / patisserie / sushi-bar / French country / etc.) — NEVER modern industrial / commercial / mall. Pop-Mart designer-vinyl glossy 3D-CGI fused with painterly Studio-Ghibli-meets-bex.ai kitchen warmth. Bright warm light, pastel palette.

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
${vibeDirective.slice(0, 200)}

━━━ POSTER MOMENT ━━━

"a magical kawaii kitchen — 5 kawaii food-characters cooking a kawaii dish together, no humans, no chefs-in-uniform — just kawaii foods doing the cooking themselves." Wallpaper-poster bex.ai-meets-Studio-Ghibli register.

━━━ HARD BANS ━━━

- NO HUMAN figures / chibi-children / chef-mascot-figures — ONLY kawaii foods as the cast
- NO "chef hats" / "toques" / "aprons" / "neckerchiefs" / "chef outfits" / "chef uniforms" — BANNED words that prime humans
- NO foods "wearing" anything — the food IS the character, naked food with kawaii face
- NO modern industrial / commercial / mall kitchens — kawaii cottage / patisserie / French country ONLY
- NO photoreal / harsh-realism — kawaii painterly Pop-Mart fusion
- NO dark / dirty / scary kitchen
- NO real kanji / Japanese-text characters / English labels — decorative-pattern only
- NO pathway / lane RECEDING into vanishing point — tight cluster
- NO chaotic vertical-stacking / climbing / acrobatics — natural pose-varied cluster
- NO blurred-out generic-pink-bokeh backdrop — kitchen MUST be visibly rendered
- NO identical-row-of-soldiers lineup

━━━ OUTPUT FORMAT (MANDATORY) ━━━

LEAD with the 5 food-characters named at the START, describe them as the food ITSELF (NOT a person wearing/holding the food), then weave in scene-type + dish + backdrop + signature + terrain + sky + lighting + time + atmosphere + companion.

Template:
"Five kawaii food-characters cooking together — (1) [food 1 named in 5-8 words — the food ITSELF with flour-dust / spoon / whisk in tiny arms], (2) [food 2 named], (3) [food 3 named], (4) [food 4 named], (5) [food 5 named] — [scene-type pose-varied cluster arrangement] preparing [dish_being_prepared centerpiece]. Set in [kitchen_backdrop visibly rendered]. [signature 1] and [signature 2] in the scene, [terrain] underfoot, [sky] overhead, [time-of-day], [atmosphere drifting], [lighting]. [companion] nearby. [camera framing]. Painterly Pop-Mart kawaii-kitchen rendering."

⚠ Count (1)(2)(3)(4)(5) explicitly. ALL 5 FOODS named at the START. The food IS the character — NOT a human wearing/holding food. Natural pose-variation cluster.

Output ONLY the raw 150-220 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers.`;
  },

  YUMBOT_COTTAGECORE_NATURE: ({ slots, sharedDNA, vibeDirective }) => {
    const { scene_type, backdrop, signature, terrain, sky, camera, lighting, time_of_day, atmosphere, food_inhabitants, companion, nature_element, night_mode } = slots;
    const foodList = Array.isArray(food_inhabitants) ? food_inhabitants : [food_inhabitants];
    const foodBlock = foodList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');
    const sigList = Array.isArray(signature) ? signature : [signature];
    const sigBlock = sigList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');

    return `You are writing COTTAGECORE-NATURE renders for YumBot — kawaii countryside-nature scenes with 5 kawaii food-characters composed cleanly in a richly-detailed cottagecore setting. Natural family-portrait cluster with slight pose variation. Painterly Pop-Mart fusion with Studio-Ghibli countryside warmth. Output wraps with style prefix + suffix.
${night_mode ? `

⚠⚠⚠ NIGHTTIME LOCK — READ FIRST, OVERRIDES EVERYTHING BELOW ⚠⚠⚠

${night_mode}

NIGHTTIME LOCK NOTES — apply these to EVERYTHING below:
- The cottagecore countryside is at NIGHT. Sky is DARK indigo / navy / midnight / inky — NOT twilight, NOT dusk, NOT warm-amber-sunset.
- Palette = JEWEL-TONES + warm-lantern-amber + cool-moonlit-blue + pearl-cream + deep sage shadows — NOT 'sage / butter / cream / pink / lavender' bright daytime palette.
- Lighting = moon + cottage-window-glow + paper-lanterns + fairy-light strings + firefly drift. NO daytime sun, NO 'soft warm light' afternoon glow.
- If any phrase below says 'soft warm light' / 'warm cozy palette' / 'sage/butter/cream' bright daytime — REPLACE with the unambiguous-night equivalent. The render must read as full NIGHT, not bright-cottage-with-a-moon.

` : ''}
━━━ ⚠ HARD RULE #1: 5 KAWAII FOOD-CHARACTERS NAMED FIRST — ALL VISIBLE ━━━

The 5 kawaii foods MUST appear with explicit names at the START of the output: (1) (2) (3) (4) (5). The food ITSELF is the character (jam-jar / scone / berry / cream-puff / honey-jar / etc.) with kawaii face ON the food. Group them so all 5 fit cleanly in the frame.

⚠ FAILURE = rendering humans / chibi-children / 1-4 foods. PASS = 5 distinct kawaii foods all visible.

━━━ ⚠ HARD RULE #2: SLIGHT POSE VARIATION (NOT lineup, NOT acrobatics) ━━━

The scene-type below describes the cottagecore composition with slight POSE VARIATION per food. Natural family-portrait cluster.

━━━ ⚠ HARD RULE #3: VISIBLE COTTAGECORE BACKDROP + NATURE LAYERS ━━━

The cottagecore BACKDROP (wildflower meadow / cottage garden / woodland clearing / orchard / etc.) must be CLEARLY VISIBLE behind them. Plus the featured nature element accent, signature cottagecore props, terrain, sky/canopy, time, atmosphere, companion all layer in.

━━━ ⚠ HARD RULE #4: COTTAGECORE AESTHETIC ━━━

Cottagecore countryside — wildflowers, cottage gardens, woodlands, orchards. NEVER modern urban / industrial / mall. Pop-Mart designer-vinyl glossy 3D-CGI fused with painterly Studio-Ghibli-meets-bex.ai countryside warmth. Soft warm light, pastel palette with sage / butter / cream / pink / lavender.

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

${night_mode ? `━━━ ⚠ NIGHTTIME OVERRIDE — this render is at NIGHT (overrides lighting + time + atmosphere) ━━━
${night_mode}
` : `━━━ LIGHTING DIRECTION / QUALITY ━━━
${lighting}

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ ATMOSPHERE (what's drifting through the air — petals / pollen / butterflies / dust motes) ━━━
${atmosphere}`}

━━━ 1 TINY COTTAGECORE COMPANION (bunny / honeybee / songbird / butterfly / etc.) ━━━
${companion}

━━━ 5 KAWAII FOOD-CHARACTERS (the (1)-(5) food-friends in the scene — the food ITSELF is the character) ━━━
${foodBlock}

━━━ SCENE PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 200)}

━━━ POSTER MOMENT ━━━

"a magical cottagecore meadow — 5 kawaii foods gathered together in a richly-detailed countryside-nature setting with natural personality." Wallpaper-poster bex.ai-meets-Studio-Ghibli register.

━━━ HARD BANS ━━━

- NO modern urban / industrial / mall scenes — cottagecore countryside ONLY
- NO HUMAN figures / chibi-children — only kawaii foods (tiny companion creature is OK)
- NO photoreal / harsh-realism — kawaii painterly Pop-Mart fusion
- NO dark / moody / scary atmosphere — warm cozy cottagecore palette
- NO real kanji / English-text labels — decorative-pattern only
- NO pathway / lane / brook RECEDING into vanishing point — tight cluster
- NO chaotic vertical-stacking / climbing / acrobatics — natural pose-varied cluster
- NO blurred-out generic-pink-bokeh backdrop — cottagecore setting MUST be visibly rendered
- NO identical-row-of-soldiers lineup

━━━ OUTPUT FORMAT (MANDATORY) ━━━

LEAD with the 5 food-characters named at the START (early tokens = Flux locks them), then weave in scene-type + backdrop + nature element + signature + terrain + sky + lighting + time + atmosphere + companion.

Template:
"Five kawaii cottagecore food-characters together — (1) [food 1 named in 5-8 words], (2) [food 2 named], (3) [food 3 named], (4) [food 4 named], (5) [food 5 named] — [scene-type pose-varied cluster arrangement]. Set in [backdrop visibly rendered]. [nature_element] visible as featured detail, [signature 1] and [signature 2] accenting the scene, [terrain] underfoot, [sky] overhead, [time-of-day], [atmosphere drifting], [lighting]. [companion] nearby. [camera framing]. Painterly Pop-Mart kawaii-cottagecore rendering."

⚠ Count (1)(2)(3)(4)(5) explicitly. ALL 5 FOODS named at the START. Natural pose-variation cluster.

Output ONLY the raw 150-220 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers.`;
  },

  YUMBOT_CHECKERED_TABLETOP: ({ slots, sharedDNA, vibeDirective }) => {
    const { vessel_hero, mini_creature_pile, tablecloth, scattered_minis, decor_clusters, backdrop, signature, atmosphere, time_of_day, companion, camera, lighting } = slots;
    const minisList = Array.isArray(scattered_minis) ? scattered_minis : [scattered_minis];
    const minisBlock = minisList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');
    const clusterList = Array.isArray(decor_clusters) ? decor_clusters : [decor_clusters];
    const clusterBlock = clusterList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');
    const sigList = Array.isArray(signature) ? signature : [signature];
    const sigBlock = sigList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');

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
${vibeDirective.slice(0, 250)}

━━━ HARD BANS ━━━
- NO chibi creatures / humans / real animals (only smiling food-creatures and food-friends)
- NO dark / moody / scary
- NO outdoor scenic (that's rainbow-dreamscape)
- NO overflowing-flora-from-cup (that's floral-garden-cup)
- NO solid-pastel backdrop without checker pattern — pattern MUST be visible

━━━ OUTPUT FORMAT (MANDATORY) ━━━

Open with: "Pastel [pink/blue/cream/yellow] gingham/checkered tablecloth fills the surface, [kawaii vessel hero centerpiece with its smiling face], with [mini-creature pile on top — naming specific mini-faces], [scattered minis named across the tablecloth], [decor clusters], [signature 1] and [signature 2] accenting beside the hero, [backdrop softly out of focus behind], [time-of-day], [atmosphere drifting], [companion] nearby, [lighting], [camera framing], painterly Pop-Mart designer-vinyl pearlescent rendering."

Output ONLY the raw 120-170 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. The gingham/checkered pattern + mini-friend-pile-on-top must read CLEARLY, and the backdrop must be SOFT-FOCUS behind.`;
  },

  YUMBOT_COQUETTE_FOOD: ({ slots, sharedDNA, vibeDirective }) => {
    const { scene_type, backdrop, signature, terrain, sky, camera, lighting, time_of_day, atmosphere, dessert_motif, palette_variant, bow_motif, scattered_items, companion, food_inhabitants } = slots;
    const foodList = Array.isArray(food_inhabitants) ? food_inhabitants : [food_inhabitants];
    const foodBlock = foodList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');
    const sigList = Array.isArray(signature) ? signature : [signature];
    const sigBlock = sigList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');
    const scatterList = Array.isArray(scattered_items) ? scattered_items : [scattered_items];
    const scatterBlock = scatterList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');

    return `You are writing COQUETTE-FOOD renders for YumBot — the FLAGSHIP OMG-cute coquette kawaii food-party path. Hyper-feminine ultra-pink ultra-coquette palette. Output wraps with style prefix + suffix.

━━━ ⚠ HARD RULE #1: PALETTE LOCKED — PINKS / LAVENDERS / WHITES / SOFT PURPLES ONLY ━━━

The ENTIRE render's color palette is restricted to pinks (blush / dusty-rose / coral-pink / bubblegum / hot-pink), lavenders, whites, and soft purples (lilac / mauve / periwinkle). ABSOLUTELY NO yellows, blues outside soft-purple, greens, oranges, reds outside soft-pink, browns, blacks, neons. If a food is normally another color (e.g. yellow lemon), re-tint it into the pink/lavender palette range.

━━━ ⚠ HARD RULE #2: 5 KAWAII FOOD-CHARACTERS NAMED FIRST — ALL VISIBLE ━━━

The 5 kawaii foods MUST appear with explicit names at the START of the output: (1) (2) (3) (4) (5). The food ITSELF is the character with kawaii face. Group them so all 5 fit cleanly in the frame.

⚠ FAILURE = rendering humans / chibi-children / 1-4 foods. PASS = 5 distinct kawaii foods all visible.

━━━ ⚠ HARD RULE #3: PACKED OMG-CUTE COQUETTE DENSITY ━━━

Beyond the 5 foods, the scene contains 3 signature props + 2 scattered girly items + 1 companion + 1 centerpiece dessert + 1 hero bow-motif. That's 8 additional decorative cast elements. Pack the scene RICH with cute coquette items — bows, ribbons, pearls, hearts, charms, scattered girly accessories. The render should feel OVERFLOWING with cute. NEVER minimal.

━━━ ⚠ HARD RULE #4: COQUETTE AESTHETIC ━━━

Hyper-feminine ultra-coquette: ribbons, bows, lace, pearls, hearts, strawberries, cherries. Marie-Antoinette tea party + ballerina dressing-room + pastel kawaii bakery. Pop-Mart designer-vinyl glossy 3D-CGI fused with painterly Studio-Ghibli storybook warmth. NEVER masculine / dark / grungy.

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
${vibeDirective.slice(0, 200)}

━━━ POSTER MOMENT ━━━

"the OMG-cutest coquette kawaii food-party — 5 kawaii foods amid a riot of pink ribbons, pearls, hearts, bows, girly accessories. Every viewer says 'this is so cute it hurts.'" Wallpaper-poster flagship work.

━━━ HARD BANS ━━━

- ⚠ NO COLORS OUTSIDE pinks / lavenders / whites / soft purples — ZERO exceptions. NO mint, NO green, NO blue (except soft-lavender), NO yellow, NO orange, NO red outside soft-pink, NO brown, NO chocolate, NO black, NO gray
- NO HUMAN figures / chibi-children — only kawaii foods (tiny companion creature is OK)
- NO photoreal / harsh-realism — kawaii painterly Pop-Mart fusion
- NO dark / moody / scary / grungy / masculine
- NO real kanji / English-text labels — decorative-pattern only
- NO pathway / lane RECEDING into vanishing point — tight cluster
- NO chaotic vertical-stacking / climbing / acrobatics
- NO blurred-out generic backdrop — coquette setting MUST be visibly rendered
- NO identical-row-of-soldiers lineup
- NO minimal / sparse composition — the scene is OVERFLOWING with cute items

━━━ OUTPUT FORMAT (MANDATORY) ━━━

LEAD with the 5 food-characters named at the START, then layer in scene-type + dessert + bow + backdrop + signatures + scattered items + terrain + sky + camera + lighting + time + atmosphere + palette + companion as one integrated description.

Template:
"Five kawaii coquette food-characters together — (1) [food 1 named in 5-8 words], (2) [food 2 named], (3) [food 3 named], (4) [food 4 named], (5) [food 5 named] — [scene-type pose-varied cluster] around [dessert_motif centerpiece] decorated with [bow_motif]. Set in [backdrop visibly rendered]. [signature 1], [signature 2], [signature 3] accenting the scene. [scattered_item 1] and [scattered_item 2] scattered nearby. [terrain] underfoot, [sky] overhead, [time-of-day], [atmosphere drifting], [lighting]. [companion] nearby. Palette: [palette_variant]. [camera framing]. Painterly Pop-Mart ultra-coquette kawaii rendering, pinks + lavenders + whites + soft purples ONLY."

⚠ Count (1)(2)(3)(4)(5) explicitly. ALL 5 FOODS named at the START. Pack the scene RICH with cute coquette items.

Output ONLY the raw 170-240 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers.`;
  },

  YUMBOT_KAWAII_KOI_POND: ({ slots, sharedDNA, vibeDirective }) => {
    const { scene_type, backdrop, signature, terrain, sky, camera, lighting, time_of_day, atmosphere, water_element, companion, creatures, night_mode } = slots;
    const creatureList = Array.isArray(creatures) ? creatures : [creatures];
    const creatureBlock = creatureList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');
    const sigList = Array.isArray(signature) ? signature : [signature];
    const sigBlock = sigList.filter(Boolean).map((d, i) => `${i + 1}. ${d}`).join('\n');

    return `You are writing KAWAII-KOI-POND renders for YumBot — a tranquil Japanese koi-pond scene with 5 kawaii pond-creatures (smiling koi-fish, axolotls, cloud-mochi-spirits, lily-frogs, pearl-blobs) half-submerged in/around the pond. Painterly Studio-Ghibli meets bex.ai Pop-Mart kawaii register. Output wraps with style prefix + suffix.
${night_mode ? `

⚠⚠⚠ NIGHTTIME LOCK — READ FIRST, OVERRIDES EVERYTHING BELOW ⚠⚠⚠

${night_mode}

NIGHTTIME LOCK NOTES — apply these to EVERYTHING below:
- The sky is DARK indigo / navy / midnight / inky — NOT twilight, NOT dusk, NOT magic-hour.
- Scene palette = JEWEL-TONES + warm-lantern-amber + cool-moonlit-blue + pearl-cream + deep-indigo. NOT bright kawaii pastels.
- Lighting = moon + paper-lanterns + lotus-lanterns + creature-bioluminescence + firefly-drift. NO daytime sun, NO bright pastel sunny light.
- The kawaii cast itself can keep soft cream-pink-blush faces, but the WORLD around them is DARK.
- If any phrase below says 'twilight register' / 'warm sunny' / 'pink magic-hour' / 'bright pastel sky' / 'rose-silver moonlight on bright pastels' — REPLACE it with the unambiguously-night equivalent. The render must read as full NIGHT, not twilight-with-a-moon.

` : ''}
━━━ ⚠ HARD RULE #1: 5 KAWAII POND-CREATURES NAMED FIRST — ALL VISIBLE ━━━

The 5 kawaii creatures MUST appear with explicit names at the START of the output: (1) (2) (3) (4) (5). Each is a kawaii pond-creature with kawaii face (closed-arc-eyes, blush cheeks, tiny mouth) — NOT a food. Half-submerged or floating in the pond water.

⚠ FAILURE = rendering humans / chibi-children / 1-4 creatures. PASS = 5 distinct kawaii pond-creatures all visible.

━━━ ⚠ HARD RULE #2: SLIGHT POSE VARIATION ━━━

The scene-type below describes the pond composition with slight POSE VARIATION per creature (one peeking from water, one tilted, one nestled close, one tallest at the back, one floating). Natural family-portrait cluster.

━━━ ⚠ HARD RULE #3: JAPANESE GARDEN BACKDROP + WATER-ELEMENT CENTERPIECE ━━━

The Japanese garden BACKDROP (pagoda / wisteria-grove / temple-courtyard / teahouse / zen-rock-garden / etc.) must be CLEARLY VISIBLE behind the pond. The featured WATER-ELEMENT centerpiece (lotus-lantern / glowing-lily / floating-paper-crane / etc.) anchors the pond.

━━━ ⚠ HARD RULE #4: TWILIGHT / DUSK CINEMATIC PAINTERLY REGISTER ━━━

bex.ai reference register: painterly Studio-Ghibli warmth, twilight/dusk-heavy, glowing lotus-lanterns, soft mist, cherry-blossom + wisteria petals drifting. Cinematic and atmospheric.

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

${night_mode ? `━━━ ⚠ NIGHTTIME OVERRIDE — this render is at NIGHT (overrides lighting + time + atmosphere) ━━━
${night_mode}
` : `━━━ LIGHTING DIRECTION / QUALITY ━━━
${lighting}

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ ATMOSPHERE (what's drifting through the air — petals / fireflies / mist) ━━━
${atmosphere}`}

━━━ 1 TINY COMPANION (dragonfly / origami-crane / butterfly / etc.) ━━━
${companion}

━━━ 5 KAWAII POND-CREATURES (the (1)-(5) cast — kawaii faces, half-submerged or floating) ━━━
${creatureBlock}

━━━ SCENE PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 200)}

━━━ POSTER MOMENT ━━━

"a tranquil kawaii Japanese koi-pond at twilight — 5 kawaii pond-creatures gathered around a glowing lotus-lantern under wisteria canopy with cherry-blossom petals drifting." Wallpaper-poster bex.ai-meets-Studio-Ghibli register.

━━━ HARD BANS ━━━

- NO foods as cast — this path uses kawaii POND-CREATURES (koi / axolotl / mochi-spirit / etc.)
- NO HUMAN figures / chibi-children — kawaii pond-creatures only
- NO photoreal / harsh-realism — kawaii painterly Studio-Ghibli fusion
- NO dark / scary / moody atmosphere — peaceful twilight register
- NO modern urban / industrial / mall scenes — traditional Japanese garden ONLY
- NO real kanji / Japanese-text characters — decorative-pattern only
- NO pathway / lane RECEDING into vanishing point — pond composition is clustered/wide
- NO chaotic vertical-stacking / climbing / acrobatics — natural pose-varied cluster
- NO blurred-out generic backdrop — Japanese garden MUST be visibly rendered
- NO identical-row-of-soldiers lineup

━━━ OUTPUT FORMAT (MANDATORY) ━━━

LEAD with the 5 kawaii pond-creatures named at the START, then weave in scene-type + water-element + backdrop + signatures + terrain + sky + camera + lighting + time + atmosphere + companion.

Template:
"Five kawaii pond-creatures together in a Japanese koi-pond — (1) [creature 1 named in 5-8 words], (2) [creature 2 named], (3) [creature 3 named], (4) [creature 4 named], (5) [creature 5 named] — [scene-type pose-varied cluster in pond] around [water_element centerpiece]. Set in [backdrop Japanese garden visibly rendered]. [signature 1] and [signature 2] accenting the pond. [terrain pond-water surface], [sky overhead], [time-of-day], [atmosphere drifting], [lighting]. [companion] nearby. [camera framing]. Painterly Pop-Mart-meets-Studio-Ghibli kawaii koi-pond rendering."

⚠ Count (1)(2)(3)(4)(5) explicitly. ALL 5 CREATURES named at the START.

Output ONLY the raw 150-220 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers.`;
  },
};
