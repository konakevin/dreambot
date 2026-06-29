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

// DREAMSCAPE_MEDIUM (2026-06-27) — the `dreamscape` path's own cinematic-fantasy
// render register. NOT the chibi vinyl/pixar look: this is a hyperreal, lavishly-
// detailed, ultra-saturated fantasy WORLD vista (ref aida_ai_pro). Code-only
// medium (bot.mediumStyles override; no DB row needed — fetchMediumFluxFragment
// returns '' for an unknown key, and modelByPath hard-locks the model). Kept
// lean (≤250 chars, no negation cascade, no camera-brand stuffing) per the
// medium-cruft rule. Color/light/sky come from the axes, NOT baked here.
const DREAMSCAPE_MEDIUM =
  'cinematic hyperreal 3D fantasy render, lavish painterly detail, ultra-saturated candy-jewel color, volumetric dreamlight, deep focus crisp to the horizon, glossy luminous surfaces, magical-realism film still, ArtStation fantasy concept art, wallpaper-tier';

// BUTTERFLY_MEDIUM (2026-06-27, R5) — the `butterfly-realm` path's own register.
// R4 ("fantasy concept-art render / ArtStation / sharp crisp focus") read as
// CHEESY CGI: flat anime-game render with glossy sticker-butterflies pasted ON the
// scene (Kevin). R5 matches the DREAMSCAPE path's actual feed look — PAINTERLY
// STORYBOOK fantasy ILLUSTRATION with luminous internal glow, deep + cohesive — and
// paints the butterflies INTO the world (luminous painterly wings, not crisp glossy
// vectors). Code-only medium (no DB row; modelByPath hard-locks the model). Lean
// (≤250 chars, no negation cascade). Color/light/world come from the axes.
const BUTTERFLY_MEDIUM =
  'lush painterly fantasy dreamscape, dreamy storybook illustration, butterflies with luminous iridescent painterly wings glowing from within and woven softly into the scene, lavish hand-painted detail, ultra-saturated jewel color, volumetric dreamlight, deep atmospheric depth, magical-realism, wallpaper-tier';

// DREAM_SPIRES_MEDIUM (2026-06-27, leaned 2026-06-28) — the `dream-spires` path's
// own register: an impossible whimsical fairytale TOWER-CITY in the painterly-
// storybook look. Kevin hearted a full batch of this exact medium (NOT the
// hyperreal refs) across flux-1.1-pro-ultra / flux-2-flex / flux-2-pro / flux-2-max
// — so the medium stays painterly and now LEANS into the recurring DNA of every
// hearted render: hundreds of warm glowing windows, pastel twilight/golden-hour
// color, drifting chimney-steam + lantern glow, winding stairs + slender
// skybridges, impossibly tall twisting spires. Code-only medium (no DB row;
// modelByPath rolls the qualified model pool). Color/light/world come from the axes.
const DREAM_SPIRES_MEDIUM =
  'lush painterly fantasy dreamscape, dreamy storybook illustration, an impossible whimsical fairytale tower-city of impossibly tall twisting spires, lavishly hand-painted and glowing from within with hundreds of warm golden windows, soft pastel twilight color, drifting chimney-steam and lantern glow, winding stairs and slender skybridges, volumetric dreamlight, deep atmospheric depth, cozy magical wonder, wallpaper-tier';

// FAR-EDEN MEDIUMS (2026-06-28) — the two render registers for the far-eden
// sibling paths (far-eden = hyperreal, far-eden-soft = painterly). Kevin approved
// BOTH looks, so both ship. Both are HAPPY, inviting alien-paradise vistas; the
// template is look-NEUTRAL so the medium decides the look. Code-only mediums (no
// DB row; modelByPath hard-locks the model). Lean (≤250 chars, no negation
// cascade). Color/light/world come from the axes.
//   • HYPERREAL = the cinematic sci-fi-fantasy concept-art look (the brochure-shot
//     reference register), mirrors DREAMSCAPE_MEDIUM.
const EDEN_MEDIUM_HYPERREAL =
  'cinematic hyperreal sci-fi-fantasy render, lavish detail, ultra-saturated jewel color, volumetric light, deep focus crisp to the horizon, luminous glowing surfaces, breathtaking otherworldly paradise vista, ArtStation fantasy concept art, wallpaper-tier';
//   • PAINTERLY = the luminous hand-painted dreamscape look (matches the feed look
//     Kevin recently hearted on spires/butterfly), applied to alien worlds.
const EDEN_MEDIUM_PAINTERLY =
  'lush painterly sci-fi-fantasy dreamscape, luminous hand-painted illustration glowing from within, ultra-saturated jewel color, volumetric dreamlight, deep atmospheric depth, breathtaking otherworldly paradise vista, magical-realism, wallpaper-tier';

// CONSERVATORY_MEDIUM (2026-06-28) — the `hidden-conservatory` path's render
// register: a photoreal cinematic interior of a lush overgrown stained-glass
// greenhouse, with rainbow prismatic light refracting through jewel-toned glass
// (ref: benmyhre "Stained Glass Greenhouses"). Code-only medium (no DB row;
// modelByPath hard-locks the model). Lean (≤250 chars, no negation cascade). The
// glass color / mood / flora come from the axes; the medium just sets the look.
const CONSERVATORY_MEDIUM =
  'cinematic photoreal interior, a lush overgrown stained-glass conservatory, brilliant jewel-toned glass, rainbow prismatic light refraction scattered across the scene, rich volumetric god-rays, deep atmospheric depth, ultra-detailed botanical greenhouse, romantic and magical, wallpaper-tier';

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

// CHIBI_RENDER_MEDIUM — hyper-cute 3D character render, Pop-Mart designer-vinyl
// collectible register. Sharp + glossy + rendered.
// 2026-06-05 cruft-strip down to positive identity anchors only (~270 chars,
// playbook target ≤250). Dropped: duplicate "3D CGI render" overlap with
// PROMPT_PREFIX, tech-spec ("Octane / Redshift quality"), travel-mag
// ("gallery-print poster composition"), the WORLD-diorama language that
// told Flux to render an entire environment/village/multi-character scene
// regardless of path intent, the hard-locked warm-amber+teal+peach palette
// + "volumetric warm god-rays" that overrode every time-of-day axis, and
// the bot-wide "WHEN MULTIPLE CHARACTERS ARE PRESENT (pair/trio) GROUP
// COMPOSITION" mandate that compounded with CHIBI_CHARACTER_COUNT_BLOCK
// + per-path templates to push every render to 3+ creatures.
// Kept: Pop Mart designer-vinyl collectible identity / glossy-dewy
// subsurface-scatter / crisp form language / chibi proportions when a
// creature subject is present. Palette + composition + creature-count
// now owned by the path axes (time-of-day / setting / creature slots).
const CHIBI_RENDER_MEDIUM =
  'Polished 3D CGI designer-collectible vinyl render, Pop Mart designer-toy register, glossy dewy subsurface-scattering materials, ultra-clean crisp form language; creature subjects rendered with chibi proportions — oversized head, massive glassy multi-catchlight eyes, soft stubby body';

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

// Clean-render medium for gpt-image-2 + nano-banana (routed via
// cleanMediumByModel in index.js) — keeps these models from reading the bot's
// CGI/polish anchors as "go abstract". Light genre tag, positive-only.
const GPT_CLEAN =
  'Clean cute chibi character illustration, crisp render with clearly readable big-eyed rounded characters and cozy scenes, soft pastel palette, warm gentle lighting, designer-collectible register';

// CHIBI_NEUTRAL — the "looks" medium (2026-06-07). Locks ChibiBot's IDENTITY
// (an adorable chibi CREATURE — never a human — at chibi proportions) but DROPS
// the fixed Pop-Mart-vinyl render-style lock. The specific animation style /
// rendering medium / finish / palette is set by the rolled sharedDNA.lookRegister
// tokens that lead the prompt (Pixar / DreamWorks / Disney-CG / Ghibli / storybook
// / etc.). HARD creatures-only + chibi-proportion locks are load-bearing here:
// the film looks (Pixar/Disney/Tangled/Frozen) carry strong human-child/princess
// priors and non-chibi proportion priors, and ChibiBot has a documented
// human-children purge — so this fragment must out-vote those. Used by the
// look-enabled paths (mediumByPath in index.js); creature-world keeps its
// hearted chibibot_creature medium. Mirrors YumBot's YUMBOT_FOOD_NEUTRAL.
// COMPOSITION-NEUTRAL on purpose (2026-06-07 fix): ChibiBot is HYBRID —
// creature-led paths (a creature IS the subject) AND scene-led paths (a
// village / landscape / interior is the hero, with chibi creatures in it). An
// earlier version opened "The subject is a CHIBI CREATURE…", which front-loaded
// creature-as-subject and collapsed the village/landscape paths into a single
// creature close-up. So this fragment locks creatures-only + chibi proportions
// + no-humans but DEFERS the subject/composition to the scene description.
const CHIBI_NEUTRAL =
  'Every figure in frame is an adorable chibi CREATURE — a real animal or a cute fantasy critter — at chibi proportions (oversized round head, big sparkling eyes), NEVER a human or human child. Keep the composition the scene below describes — a hero creature OR a village / landscape / interior populated by chibi creatures. The animation style, rendering medium, finish, and palette are set by the look-register tokens that lead the prompt.';

// ── Beauty-gap scene mediums (2026-06-28) — code-only, no DB rows. DreamBot is
//    the wild-card poster; these expand it into beautiful subject areas the fleet
//    lacks. Each also leads with its own promptPrefixByMedium anchor in index.js.
const BOTANICAL_MEDIUM =
  'lush botanical fine-art photography with a dreamy whimsical storybook atmosphere, soft enchanted light, exquisite leaf and foliage detail, painterly depth and a magical wistful mood, rich and joyfully varied jewel-like color, an impossibly beautiful dreamworld you could wander into, serene gallery-print composition, wallpaper-tier';

module.exports = {
  GPT_CLEAN,
  CHIBI_NEUTRAL,
  BOTANICAL_MEDIUM,
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
  DREAMSCAPE_MEDIUM,
  BUTTERFLY_MEDIUM,
  DREAM_SPIRES_MEDIUM,
  EDEN_MEDIUM_HYPERREAL,
  EDEN_MEDIUM_PAINTERLY,
  CONSERVATORY_MEDIUM,
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
