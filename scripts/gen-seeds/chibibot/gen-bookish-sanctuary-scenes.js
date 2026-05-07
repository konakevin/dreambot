#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/chibibot/seeds/bookish_sanctuary_scenes.json',
  total: 100,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} BOOKISH-SANCTUARY scene descriptions for ChibiBot — but these are CONCEPT ART of impossibly book-saturated spaces, NOT real libraries. Painterly storybook illustration, never photography. 25-45 words each. NO PEOPLE.

━━━ THE LOAD-BEARING RULE ━━━
These libraries do NOT exist as real photographable rooms. They are illustrated concept-art spaces with architectural ambition + book density that no real library actually achieves. If the entry could be a Pinterest "cozy library" photo of an actual study, IT IS WRONG.

Every entry MUST include at least ONE architectural-ambition feature:
- Multi-level: two/three-story library rooms with mezzanine + balcony / spiral wrought-iron stair winding up between alcoves / floor-to-ceiling shelves on a sloped ceiling / sleeping-loft above the main reading room reachable by ladder
- Unexpected vessel: tower-library with windows wrapping the spiral interior / book-shop inside a hollow tree trunk / converted-train-carriage bookshop / glass-domed conservatory study with shelves built around the conservatory / cliff-cave library carved into rock / underwater-glass library with sea-creatures visible / antique narrowboat-library on a canal / barge with book-shelves on three floors
- Architectural drama: vaulted timber rafters with hanging brass-and-glass lanterns / cathedral-style rose window with shafts of colored light striking book-stacks / hidden alcoves between bookcases (book-walled secret rooms) / stained-glass dome over a circular reading-pit / built-in window-seats wrapped on three sides by tall shelves

PLUS book density is EXTREME: visible THOUSANDS of spines, floor-to-ceiling-to-mezzanine shelves PACKED tight, towers of books leaning waist-high against the shelves, books spilling from every surface (chairs, tables, ladders, floor), varied bindings (leather, cloth, vellum, gilt), spines visibly OLD.

PLUS classic library cozy: rolling-ladder, brass desk-lamps with green shades, deep leather armchairs, Persian rugs over-rugs, oil lamps, candles dripped wax, magnifying glasses, fountain pens, dust-mote light shafts.

━━━ INTERIOR CATEGORIES ━━━
- Three-story tower libraries with spiral wrought-iron stair winding past balcony rails on each level, shelves filling every wall-curve
- Conservatory studies inside a glass-domed greenhouse, ferns reaching from the rafters, books along inner walls, oil lamp pooling honey on the open atlas
- Cathedral-vault libraries with rose-window stained glass, shafts of colored light striking the book-towers, mezzanine balcony above
- Sleeping-loft libraries with the bed accessible by ladder, the loft itself lined with shelves, lower floor a study with deep armchair
- Cave-library carved into rock, candle-lit alcoves, vaulted natural-stone ceiling, books in every nook
- Sunken reading pit ringed by waist-high book-stacks, brass pendant pooling honey from above, deep leather chair below
- Barge / canal-boat library with shelves running the length, slanted-roof sleeping-loft, oil lantern swinging
- Hollow-tree bookshops with shelves carved into the inner trunk, spiral-step ladder to a tiny upper landing, candles in every nook
- Hidden-passage library: shelves opening like a door into a deeper book-cave behind, candles + oil lamps inside
- Mezzanine-balcony bookstores with rolling-ladder, lower floor a reading room with armchairs, upper floor more books
- Wizard / alchemist libraries with brass orreries + astrolabes between the books, candles dripping wax over scrolls
- Apothecary back-libraries with hanging-herb ceilings + shelves of bottled tinctures alongside the books
- Glass-walled library overlooking a misty forest, shelves on the inner wall, mist condensing on the outer glass
- Spiral-stair library wrapping a central column floor-to-ceiling, every step lined with books on the inside, rail brass
- Treehouse-library cantilevered into a forest canopy, shelves on every wall, lantern hanging from the rafter
- Train-carriage library converted from a vintage railway car, curved-roof with shelves up the sides, plush seats
- Bookshop-cottage interior with sleeping-nook bed tucked behind a bookcase that opens like a door

━━━ MANDATORY ELEMENTS PER ENTRY ━━━
1. ONE architecturally ambitious feature (multi-level / spiral stair / vaulted rafters / cantilevered / cave / glass-dome / etc.)
2. EXTREME book density — thousands of visible spines, towers, varied bindings explicitly named
3. Cozy library inhabitants (rolling ladder + lamp + armchair + Persian rug + magnifying glass + fountain pen + steaming mug + candle + dust-motes)
4. Anti-photoreal anchor: "painterly", "concept-art", "Studio Ghibli interior background", "Eyvind Earle warmth", "hand-illustrated"

━━━ HARD BANS ━━━
- NO people / figures (sleeping cat / owl on rafter OK as cozy detail)
- NO surreal: NO floating books, NO glowing pages, NO Hogwarts moving stairs, NO dancing chandeliers
- NO modern bookstore (open white shelves, bright LED, sterile)
- NO sparse "minimalist library" — books MUST visibly overflow
- Books MUST visibly vary (not all matching modern hardcovers)

━━━ FEW-SHOT EXAMPLES ━━━
EX-1: "Three-story tower library with spiral wrought-iron stair winding past two balcony rails, shelves PACKED tight floor-to-ceiling-to-ceiling-to-ceiling with leather and gilt-edge volumes, central reading-table with brass-shaded lamp pooling honey on an open atlas, ladder leaning, painterly Studio Ghibli warmth"
EX-2: "Hollow-tree bookshop carved into a giant oak's interior, shelves lining the curved trunk-wall floor-to-canopy, spiral-step ladder leading to a tiny upper landing, candle in every nook, mossy roots forming the floor, leaded-window framing the forest dusk, Eyvind Earle painterly concept art"
EX-3: "Conservatory study inside a glass-domed greenhouse, ferns and monstera reaching from the rafters, three walls of bookshelves stacked floor-to-glass-wall, oil lamp pooling on an open botanical atlas, brass magnifying lens beside it, dust-motes spiraling in shafts of warm afternoon light, painterly storybook"
EX-4: "Cathedral-vault library with cathedral-arch ceiling soaring three stories, stained-glass rose window throwing crimson and amber light onto towering book-stacks, mezzanine balcony with rolling-ladder, leather armchair below in a pool of honey-amber lamp-glow, painterly concept-art density"
EX-5: "Sleeping-loft library above the main study, ladder leaning against the loft rail, lower floor crammed with floor-to-ceiling shelves and a deep armchair under a brass desk-lamp, books towering on the floor, oil lantern hanging, painterly Ghibli interior"

━━━ OUTPUT ━━━
JSON array of ${n} strings. Dense, comma-rich, concept-art-ambitious. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
