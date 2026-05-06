/**
 * CozyBot — shared prose blocks.
 *
 * 2026-05-06: After the CuddleBot merge, this file is fully self-contained.
 * Originally re-exported CuddleBot's blocks; that cross-bot dependency was
 * inlined when CuddleBot was retired (its content now lives entirely here).
 *
 * Pure CUTE + COZY + CUDDLY. Bedroom-poster / picture-book / Pixar / Sanrio /
 * Totoro energy. Stylized ONLY — never photoreal. No humans. Pets/creatures
 * peripheral, going about cozy-life.
 */

const PROMPT_PREFIX =
  'cozy bedroom-poster quality, stylized cute cuddly artwork, adorable, big-eyed, soft shapes';

const PROMPT_SUFFIX = 'no text, no words, no watermarks, hyper detailed, masterpiece quality';

const CUTE_CUDDLY_COZY_BLOCK = `━━━ CUTE + CUDDLY + COZY (NON-NEGOTIABLE) ━━━

Every render must produce: AWWW + instant smile + "I want to hug it" instinct. If the render has even a whisper of dark / edgy / menacing — it FAILED. The reaction is wholesome delight — big eyes, soft shapes, infectious cuteness. Lighting and mood should match the SCENE naturally (rainy = soft grey, sunset = golden, night = moonlit) — not forced bright.`;

const STYLIZED_NOT_PHOTOREAL_BLOCK = `━━━ STYLIZED / ILLUSTRATIVE ONLY — NEVER PHOTOREAL ━━━

Never photoreal. Never documentary-wildlife. The creature or scene is always rendered in a soft illustrative mode — exaggerated proportions (big head, big eyes, soft round limbs), warm painted textures, clean edges, dreamy color grading. Let the MEDIUM tag control the specific art style.`;

const NO_DARK_NO_INTENSE_BLOCK = `━━━ NO DARK / NO INTENSE / NO CREEPY ━━━

Absolutely no menace, no threat, no horror, no creepy undertones, no "uncanny cute" disturbing vibes. Safe + wholesome + approachable. The tone is kind and gentle, not Tim-Burton-stop-motion. Lighting should feel natural to the scene — overcast and soft for rain, golden for sunset, cool and silvery for moonlit — NOT artificially forced bright.`;

const NO_PEOPLE_BLOCK = `━━━ NO HUMANS ━━━

No human figures, no faces, no hands. All subjects are creatures (real-exaggerated or fantasy-cute) or plushies or tiny cozy-worlds. If a thing would normally include a person, reimagine it without — the creature does the activity alone or with another creature.`;

const IMPOSSIBLE_BEAUTY_BLOCK = `━━━ IMPOSSIBLE BEAUTY ━━━

Wall-poster quality. NOT dramatic-beautiful (that's GlowBot) — CUTE-beautiful. The composition is balanced and charming. Every element is rendered with love — the kind of image a kid pins above their bed and looks at every night.`;

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — CUTENESS AMPLIFICATION ━━━

Cuteness is the canvas, not the ceiling. Stack cute-elements: big dewy eyes + fluffy texture + blushing cheeks + sparkles + warm glow + layered atmospheric charm + adorable supporting micro-details (tiny mushrooms, floating hearts, cozy accessories). Go ALL the way on sweet + warm + cozy. Obsessive detail in service of wholesome delight.`;

// ─── Toy-photography blocks (used by plushie-life + dollhouse-life ONLY) ─
// These two paths intentionally break the "stylized only" brand contract
// to deliver realistic toy-photography aesthetic. All other paths use the
// CUTE/STYLIZED blocks above.
const TOY_PHOTO_PROMPT_PREFIX =
  'toy photography in a handcrafted practical set, action-packed toy-world storytelling, toy-ness elevated as the subject';

const TOY_PHOTO_PROMPT_SUFFIX = 'no text, no words, no watermarks, hyper detailed, masterpiece quality';

const TOY_PHOTOGRAPHY_BLOCK = `━━━ TOY PHOTOGRAPHY (NON-NEGOTIABLE) ━━━

Render as a REAL PHYSICAL TOY photographed in a handcrafted set with dramatic cinematic lighting. Toy-ness IS the art — never render as "real" version. If it's plush, fabric/felt/yarn/button-eyes visible. If it's a dollhouse figurine, scale-accurate miniature interior with wooden furniture and tiny dishware. Practical-set photography, never CGI, never illustration.`;

const CINEMATIC_STORY_BLOCK = `━━━ CINEMATIC STORY — EVERY RENDER IS A MOVIE STILL ━━━

Something IS HAPPENING. Action mid-charge, mid-pour, mid-toast, mid-laugh, mid-hug. NEVER "toy-on-shelf" static. Narrative + tension + dynamic composition. The viewer should feel they stumbled into minute 47 of a stop-motion film.`;

const DRAMATIC_LIGHTING_MAKES_CHEAP_LOOK_EPIC_BLOCK = `━━━ LIGHTING ELEVATES THE MEDIUM ━━━

Lighting is the multiplier that makes plastic / clay / fabric feel like it belongs in a museum. Respect the path-specific lighting palette. Atmospheric depth via smoke / haze / dust / steam / pollen / backlight is welcome.`;

const PATH_MEDIUM_LOCK_BLOCK = `━━━ PATH MEDIUM LOCK — NEVER MIX ━━━

Each path is locked to its medium. NEVER mix LEGO with plush, NEVER put vinyl figures beside action-figures. The path's medium is absolute — stay true.`;

// COZY_PIXAR_MEDIUM — modern 3D-animated-feature-film register, the locked
// CozyBot medium. Era markers + studio names (which diffuse) but NOT specific
// films/artists (which dominate). The polish that distinguishes 2024-Pixar
// from 2005-Pixar: subsurface scattering on fluffy textures, volumetric warm
// god-rays, shallow-DOF bokeh, saturated jewel tones, frame-worthy composition.
const COZY_PIXAR_MEDIUM =
  'modern Pixar Disney DreamWorks 3D animated feature-film polish, current-decade animation movie still quality, soft subsurface scattering on every fluffy texture, volumetric warm god-rays cutting through magical atmosphere, shallow depth of field with creamy painterly bokeh, saturated jewel-tone palette (warm amber + emerald + teal + peach + magenta), lush magical detail in every corner, frame-worthy wallpaper-poster composition, NOT 2005-era CGI NOT plasticky NOT photoreal';

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

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  CUTE_CUDDLY_COZY_BLOCK,
  STYLIZED_NOT_PHOTOREAL_BLOCK,
  NO_DARK_NO_INTENSE_BLOCK,
  NO_PEOPLE_BLOCK,
  IMPOSSIBLE_BEAUTY_BLOCK,
  BLOW_IT_UP_BLOCK,
  TOY_PHOTO_PROMPT_PREFIX,
  TOY_PHOTO_PROMPT_SUFFIX,
  TOY_PHOTOGRAPHY_BLOCK,
  CINEMATIC_STORY_BLOCK,
  DRAMATIC_LIGHTING_MAKES_CHEAP_LOOK_EPIC_BLOCK,
  PATH_MEDIUM_LOCK_BLOCK,
  COZY_PIXAR_MEDIUM,
  COZY_INDOOR_CLUTTER_BLOCK,
  COZY_VILLAGE_CLUTTER_BLOCK,
};
