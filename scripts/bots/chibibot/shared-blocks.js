/**
 * ChibiBot — shared prose blocks.
 *
 * 2026-05-07: Toy-photography paths (plushie-life, dollhouse-life) moved to
 * ToyBot. ChibiBot is now a single visual register: hyper-cute 3D character
 * render — designer-collectible / Pop-Mart-vinyl-toy CGI quality. Every path
 * uses chibibot_render medium.
 *
 * Pure CUTE + COZY + CUDDLY. Big-eyed glossy character renders, not painted.
 * No humans. Pets/creatures peripheral, going about cozy-life.
 */

// 2026-06-02 cruft-audit micro-strip — dropped `hyper-detailed` (AI-photo
// tell tech-spec); rest of the polish anchors carry the work.
const PROMPT_PREFIX =
  '3D CGI render, designer collectible quality, glossy dewy surfaces with subsurface scattering, frame-worthy magical wallpaper composition';

// 2026-06-02 — dropped tech-spec `hyper detailed`.
const PROMPT_SUFFIX = 'no text, no words, no watermarks, masterpiece quality';

const CUTE_CUDDLY_COZY_BLOCK = `━━━ CUTE + CUDDLY + COZY (NON-NEGOTIABLE) ━━━

Every render must produce: AWWW + instant smile + "I want to hug it" instinct. If the render has even a whisper of dark / edgy / menacing — it FAILED. The reaction is wholesome delight — big eyes, soft shapes, infectious cuteness. Lighting and mood should match the SCENE naturally (rainy = soft grey, sunset = golden, night = moonlit) — not forced bright.`;

const STYLIZED_NOT_PHOTOREAL_BLOCK = `━━━ RENDERED CGI — NEVER PHOTOREAL, NEVER PAINTED ━━━

Never photoreal. Never documentary-wildlife. Never flat illustration or painted artwork. Whatever the subject is — creature, environment, building, interior, landscape — render it as polished 3D CGI in the designer-collectible / Pop-Mart-vinyl register: glossy materials with subsurface scattering, ultra-clean form language with crisp surface definition, graphic-design crisp pattern work, dewy highlights. WHEN A CREATURE OR CHARACTER IS THE SUBJECT, render it with chibi proportions (oversized head, massive glassy reflective eyes, tiny stubby body). When the subject is scenery / architecture / interior / landscape, the SAME render quality applies — apply the glossy crisp CGI register to buildings, plants, weather, props, light. Let the MEDIUM tag control the specific render style.`;

const NO_DARK_NO_INTENSE_BLOCK = `━━━ NO DARK / NO INTENSE / NO CREEPY ━━━

Absolutely no menace, no threat, no horror, no creepy undertones, no "uncanny cute" disturbing vibes. Safe + wholesome + approachable. The tone is kind and gentle, not Tim-Burton-stop-motion. Lighting should feel natural to the scene — overcast and soft for rain, golden for sunset, cool and silvery for moonlit — NOT artificially forced bright.`;

const NO_PEOPLE_BLOCK = `━━━ NO HUMANS ━━━

No human figures, no faces, no hands. All subjects are creatures (real-exaggerated or fantasy-cute) or tiny cozy-worlds. If a thing would normally include a person, reimagine it without — the creature does the activity alone or with another creature.`;

const IMPOSSIBLE_BEAUTY_BLOCK = `━━━ IMPOSSIBLE BEAUTY ━━━

Wall-poster quality. NOT dramatic-beautiful (that's GlowBot) — CUTE-beautiful. The composition is balanced and charming. Every element is rendered with love — the kind of image a kid pins above their bed and looks at every night.`;

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — CUTENESS AMPLIFICATION ━━━

Cuteness is the canvas, not the ceiling. Stack cute-elements appropriate to the subject: glossy dewy surfaces with subsurface scattering + warm volumetric glow + sparkles + layered atmospheric charm + adorable supporting micro-details (tiny mushrooms, floating hearts, cozy accessories, fairy-lights, wildflowers, whimsical incidental life). WHEN A CHARACTER IS PRESENT, also stack: massive dewy glassy eyes with multi-layer catchlights + fluffy textured surfaces + blushing cheeks. WHEN THE SUBJECT IS SCENERY / VILLAGE / INTERIOR / LANDSCAPE, stack environmental cuteness instead: dense magical detail in every corner, glowing windows, blooming flora, atmospheric haze, postcard-pretty composition. Go ALL the way on sweet + warm + cozy. Obsessive detail in service of wholesome delight.`;

// CHIBI_RENDER_MEDIUM — hyper-cute 3D character render, designer-collectible /
// Pop-Mart-vinyl-figurine CGI register. Sharp + glossy + rendered, NOT painted
// or Pixar-soft. Inspired by the cute-creature-render aesthetic that's
// dominating Instagram feeds (Kim Sung Hwan baby giraffes, vinaykumar182023
// baby turtles). Front-loads chibi proportions + glassy eyes + glossy
// materials before scene-specific tokens.
// 2026-06-02 cruft-audit strip — dropped tech-spec `hyper-detailed`,
// the 5-stack NOT tail (NOT painted / NOT 2D illustration / NOT Pixar-
// soft / NOT photoreal / NOT plasticky), the embedded "NOT a single
// hero figurine" and "NOT hero-with-secondary-behind-bokeh" negations,
// and the travel-mag `wallpaper-poster`. Positive identity anchors
// (Pop-Mart-vinyl designer-collectible / glossy-dewy / ultra-clean
// form / group composition rule for multi-character) carry the look.
const CHIBI_RENDER_MEDIUM =
  '3D CGI render, Octane / Redshift quality, Pop Mart / Be@rbrick designer-vinyl WORLD aesthetic (a whole magical diorama set rendered as collectible-figurine display — environments, villages, interiors, multi-character scenes all sit naturally in this register), glossy dewy material treatment with subsurface scattering on every organic surface, ultra-clean form language with crisp surface definition and graphic-design crisp pattern work, framing varies — sometimes shallow-DOF hero portrait, OFTEN medium-wide group composition with all characters equally prominent at equal sharpness, lush magical detail in every corner, volumetric warm god-rays cutting through magical atmosphere, saturated jewel-tone palette (warm amber + emerald + teal + peach + magenta), gallery-print poster composition. When characters appear, render each with chibi proportions — oversized head, massive glassy reflective multi-catchlight eyes, tiny stubby body. WHEN MULTIPLE CHARACTERS ARE PRESENT (pair or trio), frame as a GROUP COMPOSITION — medium-wide shot, ALL figures equally prominent in the foreground and equally sharp, all characters in clear focus interacting relationally';

// CHIBI_CREATURE_MEDIUM — the EXACT medium text (verbatim from the recipe of
// Kevin's hearted 2026-05-07 reference renders, recovered from the DB since
// it predates the dream_mediums rewrite). This is the pre-drift version that
// produced the ornate, jewel-eyed, single-hero creatures: it says the
// designer-vinyl register is "applied to whatever the scene is" and
// explicitly "When a creature/character IS the subject, render with chibi
// proportions — oversized head, massive glassy reflective multi-catchlight
// eyes" — i.e. it PERMITS a single ornate hero creature, unlike the current
// CHIBI_RENDER_MEDIUM which forces "NOT a single hero figurine / group
// composition". Used ONLY by the creature-world path (mediumStyles override).
// Material + rendering "secret sauce" ONLY (per Kevin's style-layer spec) —
// deliberately NO locked environment / weather / palette / time-of-day, so the
// path's environment + weather + lighting axes drive scene VARIETY (the
// references had varied detailed scenes, not all warm flower gardens).
// CHIBI_CREATURE_MEDIUM — the EXACT medium from the approved cw-clean batch
// ("wow you've actually done it"), recovered verbatim from a posted render's
// frozen prompt. Ornate luxury-collectible creature + lush glowing dreamworld
// environment. This is the locked, approved version — do not re-edit without
// rendering against the references first.
const CHIBI_CREATURE_MEDIUM =
  'ultra-detailed designer-toy aesthetic, a SINGLE luxury collectible-figurine creature, ornate fantasy craftsmanship with intricate embossed surface detailing, delicate gold filigree and gemstone inlays, premium resin-vinyl texture, highly stylized chibi proportions, ENORMOUS glossy liquid-glass eyes with multi-layer translucent irises, reflective wet-eye shader, glowing inner refractions and cinematic catchlights, soft subsurface scattering, ultra-fine micro-engraved skin and feathered fur microtextures, porcelain-resin ornamental finish, whimsical fantasy realism, nestled in a lush richly-layered magical environment — abundant jewel-tone flowers and flora crowding the foreground, a deep atmospheric background receding into dreamy bokeh strung with glowing fairy-lights and floating luminous particles, rich saturated jewel-tone color grading (teal, magenta, gold, violet, rose), volumetric god-rays and dreamy ambient bloom, cinematic depth with creamy layered bokeh, octane / Unreal Engine 5 cinematic render, high-end collectible-toy photography, hyper-detailed stylized realism, the creature in crisp focus inside its glowing lush dreamworld, immersive magical atmosphere, premium pop-designer collectible vibe, masterpiece quality';

// COZY_INDOOR_CLUTTER_BLOCK — borrowed from DragonBot's cozy-arcane "OPULENT
// MAGICAL CLUTTER" forcing function. The "STACK AT LEAST 6 categories" mandate
// is the secret weapon that makes DragonBot cozy-arcane renders feel
// jam-packed-find-new-details. Adapted to cozy-domestic categories.
const COZY_INDOOR_CLUTTER_BLOCK = `━━━ OPULENT COZY CLUTTER (NON-NEGOTIABLE — STACK AT LEAST 6 CATEGORIES) ━━━

This space is LIVED-IN. Every render must be DENSELY FILLED with specific cozy-domestic detail — never sparse, never minimalist. STACK AT LEAST 6 of these categories visibly in every frame, with multiple specific items from each:

- BOOKS + READING — leather-bound paperbacks stacked, dog-eared novels splayed open mid-read, leather journal with a bookmark trailing, fountain pen + ink-pot, magnifying glass on a brass chain, library card used as a bookmark, atlas open across the desk, sheet music propped up
- PLANTS + GREENERY — trailing pothos cascading from shelves, ferns bursting from copper pots, monstera reaching toward the light, herbs hanging upside-down from beams, single eucalyptus stem in an amber glass bottle, succulent cluster on the windowsill, potted lemon tree
- TEXTILES + WARMTH — knit wool throw rumpled on a chair arm, sheepskin draped over a stool, embroidered cushions piled and dented, hand-loomed Persian rug overlapping a sisal mat, linen napkins folded by a basket, hand-knit socks tucked into worn slippers
- HOT DRINKS + KITCHEN — steaming hand-thrown ceramic mug, cast-iron teapot with bamboo strainer, copper kettle on the stove, espresso machine with milk-foam jug, brass samovar, dried tea leaves spilling from a tin
- FOOD ON SURFACES — wedge of cheese on a wooden board with crumbly knife, blue-glazed bowl of clementines and pomegranates, half-eaten croissant on a chipped plate, honey jar with the spoon stuck in, sourdough loaf on butcher block, cinnamon sticks scattered, dish of dried figs
- LIGHT SOURCES — brass-stem table lamp with linen shade pooling honey-amber, taper candles in pewter holders dripped with wax, hurricane lantern with sooted glass, string-lights wrapped along a shelf, candelabra clustered on the mantel, brass oil-lamp
- MUSIC + ART + MAKING — vinyl spinning on a turntable catching lamp-light, acoustic guitar leaning against a wall, sheet music propped on a piano stand, watercolor palette open with brushes in a ceramic mug, sketchbook open mid-page, knitting needles stuck through a half-finished sock
- ACCUMULATED MEMENTOS — framed photographs in mismatched silver and brass frames clustered on the mantel, dried flower bouquet in a green-glass jar, brass-rim reading glasses lying on an open book, antique pocket-watch on a chain, stack of letters tied with twine, postcards pinned to a corkboard
- WINDOWSILL DETAIL — succulents clustered, weather radio with a bent antenna, ceramic ginger jar, single brass bell on a leather strap, smooth river-stone collection, piece of weathered driftwood
- NATURE INVADING — ivy creeping in through the window-frame, climbing-rose cane reaching across the wall, vines spilling from the rafters, moss growing in the windowsill cracks, wildflowers in jars on every surface, garden-spilling-into-the-room feel
- FURNITURE TEXTURE — wing-back armchair worn smooth at the arms, oak desk with decades of patina, mismatched bookshelves of varied wood, weathered timber ceiling beams, faded Persian carpet over wide-plank pine floor, linen curtains gently moving, stone fireplace with hand-laid masonry, handmade ceramics, crochet lace, patchwork quilts

Render AT LEAST 6 categories simultaneously. The room should look ALIVE — like someone just stepped out for a moment, their book still warm. Every surface has STUFF on it. Every shelf is full. Light pools across MULTIPLE INTERESTING OBJECTS, not bare wood. The viewer should be able to spend an hour LOOKING at the picture and still find new details.`;

// COZY_VILLAGE_CLUTTER_BLOCK — same forcing function at village scale.
const COZY_VILLAGE_CLUTTER_BLOCK = `━━━ OPULENT VILLAGE CLUTTER (NON-NEGOTIABLE — STACK AT LEAST 6 CATEGORIES) ━━━

This village is LIVED-IN. Every render must be DENSELY FILLED with specific village-life detail — never a sparse "postcard" view. STACK AT LEAST 6 of these categories visibly in every frame:

- ARCHITECTURE TEXTURE — hand-laid stone walls weathered with age, mossy thatched roofs sagging picturesquely, gabled timber-frames leaning slightly, painted-wood shutters faded, crooked chimneys with smoke spiraling, leaded-glass windows with their wonky panes
- WARM-GLOW WINDOWS — multiple cottages with rich amber-tungsten windows blazing inside, paper-lantern garlands strung between rooflines, gas-lamp posts just lit, candles in upstairs windows, doorways spilling honey-light onto the path
- FLOWERS + GREENERY — climbing roses tumbling over arched doorways, flower-boxes overflowing on every windowsill (foxglove, marigold, lavender, pansies), wisteria draping a porch, hollyhocks against fences, herb gardens edging paths, ivy reclaiming a wall
- LAUNDRY + DAILY LIFE — white linen sheets on a clothesline catching warm light, knit blankets airing over a railing, kitchen towels draped over a doorhandle, baskets of laundry beside doors, embroidered cushions on outdoor benches
- MARKET / TRADE DETAIL — wooden crates of apples and pumpkins stacked outside a doorway, baskets of bread and cheese under a striped awning, hand-painted shop signs swinging on iron brackets, milk-bottles on a stoop, market stalls with bunting strung overhead
- TRANSPORT + TOOLS — bicycle leaning against a fence with a flower-basket on the front, wooden wheelbarrow tipped with autumn leaves or pumpkins, rake and broom propped by a doorway, garden-shears on a low wall, watering-can beside a door
- COZY CAFÉ / BAKERY EVIDENCE — café tables with checkered cloths in the dappled shade, tray of fresh bread cooling on a windowsill, chalkboard menu beside a doorway, painted bakery sign, espresso-cup left on an outdoor ledge
- PATHWAY DETAIL — cobblestones worn smooth by centuries of footsteps, mossy cracks between stones, paw-prints in dust or snow, wagon-rut grooves in dirt lanes, fallen petals or leaves swept into corners
- HANGING + GARLAND DETAIL — bunting strung between rooflines, paper lanterns at every doorway, dried-flower wreaths on doors, jingle-bell ribbons in winter, dried herb bundles hanging in a market alcove, prayer flags at a hillside hamlet
- LIGHTING SOURCES — multiple gas-lamp posts lit along a path, lit candles in windowsills, paper-lantern strings overhead, hurricane lanterns hanging by doorways, hearth-fires glowing through open doorways
- NATURE INVADING — ivy creeping up stone walls and over rooflines, climbing-roses tumbling over arched doorways, wildflowers spilling from every flower-box, garden-spilling-into-the-cobblestone-path, moss growing on roof-shingles and in cracks between stones, vines reaching across upper-storey windows, wisteria draping a porch
- MEMORY DETAIL — well at the village center with a wooden bucket, stone bridge over a small creek, water-pump with a dipper hanging, mailbox with letters peeking out, weathervane on the highest gable, old church bell-tower, milestone marker

Render AT LEAST 6 categories simultaneously. The village should feel ALIVE — every doorway, every window, every pathway has evidence of routine. The viewer should be able to spend an hour LOOKING and still find new details.`;

// ─── Pixar-style aliases (verbatim from main, pre-2026-05-07 rewrite) ───
// Used by the chibibot_pixar medium for 50/50 stylistic rotation alongside
// the new chibibot_render medium. chibibot/index.js swaps these in via
// promptPrefixByMedium + a buildBrief post-processor.

const PROMPT_PREFIX_PIXAR =
  'cozy bedroom-poster quality, stylized cute cuddly artwork, adorable, big-eyed, soft shapes';

const STYLIZED_NOT_PHOTOREAL_BLOCK_PIXAR = `━━━ STYLIZED / ILLUSTRATIVE ONLY — NEVER PHOTOREAL ━━━

Never photoreal. Never documentary-wildlife. The creature or scene is always rendered in a soft illustrative mode — exaggerated proportions (big head, big eyes, soft round limbs), warm painted textures, clean edges, dreamy color grading. Let the MEDIUM tag control the specific art style.`;

const BLOW_IT_UP_BLOCK_PIXAR = `━━━ BLOW IT UP — CUTENESS AMPLIFICATION ━━━

Cuteness is the canvas, not the ceiling. Stack cute-elements: big dewy eyes + fluffy texture + blushing cheeks + sparkles + warm glow + layered atmospheric charm + adorable supporting micro-details (tiny mushrooms, floating hearts, cozy accessories). Go ALL the way on sweet + warm + cozy. Obsessive detail in service of wholesome delight.`;

// 2026-06-02 cruft-audit strip — dropped 3-stack NOT tail (NOT 2005-era
// CGI / NOT plasticky / NOT photoreal) + travel-mag `wallpaper-poster`.
// The "modern Pixar Disney DreamWorks polish / current-decade animation
// movie still" positive anchors carry the modern-feature-film register.
const CHIBI_PIXAR_MEDIUM =
  'modern Pixar Disney DreamWorks 3D animated feature-film polish, current-decade animation movie still quality, soft subsurface scattering on every fluffy texture, volumetric warm god-rays cutting through magical atmosphere, shallow depth of field with creamy painterly bokeh, saturated jewel-tone palette (warm amber + emerald + teal + peach + magenta), lush magical detail in every corner, gallery-print poster composition';

// CHIBI_CHARACTER_COUNT_BLOCK — only injected for chibibot_render renders
// (via the buildBrief dispatcher). Tells Sonnet to vary character count 1–3
// per render so the Pop-Mart-vinyl renders aren't all solo portraits. Pixar
// renders skip this — they already multi-character naturally via the
// original shared blocks.
const CHIBI_CHARACTER_COUNT_BLOCK = `━━━ CHIBI CHARACTER COUNT — VARY 1–3 (chibi-render only) ━━━

When this scene includes characters/creatures, vary the count from render to render — DO NOT default to solo every time:
- ~50% SOLO: one chibi-rendered character as the hero
- ~30% PAIR: two chibi characters in a cozy relational moment — companions, parent-and-young, friends, pet-and-buddy, two creatures sharing food / walking together / watching the world / cuddling / mid-conversation
- ~20% TRIO: three small chibi characters in an intimate group — siblings, picnic, gathering, family moment, small play scene

When multiple characters appear they are TOGETHER FOR A REASON — relational warmth, not a crowd. Compose them touching, close, or in shared activity. The SECOND/THIRD character can be a different species (e.g., a fox companion to a hedgehog, a small bird perched on an otter's head) for charm.

Pick the count for THIS render fresh — don't anchor to whatever count the seed implies if the seed only mentions one creature; you may add a companion or two when relationally appropriate.

When the scene is pure architecture / landscape (no creatures specified in the seed AT ALL), keep it empty — don't force-add characters.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  CUTE_CUDDLY_COZY_BLOCK,
  STYLIZED_NOT_PHOTOREAL_BLOCK,
  NO_DARK_NO_INTENSE_BLOCK,
  NO_PEOPLE_BLOCK,
  IMPOSSIBLE_BEAUTY_BLOCK,
  BLOW_IT_UP_BLOCK,
  CHIBI_RENDER_MEDIUM,
  CHIBI_CREATURE_MEDIUM,
  COZY_INDOOR_CLUTTER_BLOCK,
  COZY_VILLAGE_CLUTTER_BLOCK,
  // Pixar aliases
  PROMPT_PREFIX_PIXAR,
  STYLIZED_NOT_PHOTOREAL_BLOCK_PIXAR,
  BLOW_IT_UP_BLOCK_PIXAR,
  CHIBI_PIXAR_MEDIUM,
  // chibibot_render-only injection
  CHIBI_CHARACTER_COUNT_BLOCK,
};
