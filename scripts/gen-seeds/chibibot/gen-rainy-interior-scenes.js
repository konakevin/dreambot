#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/chibibot/seeds/rainy_interior_scenes.json',
  total: 100,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} RAINY-INTERIOR scene descriptions for ChibiBot — but these are CONCEPT ART of impossibly cozy spaces, NOT real rooms. Painterly storybook illustration, never photography. 25-45 words each. NO PEOPLE.

━━━ THE LOAD-BEARING RULE ━━━
These rooms do NOT exist as real interiors. They are illustrated concept-art spaces with architectural ambition + density that no real home actually achieves. If the entry could be a Pinterest interior-design photo of an actual room, IT IS WRONG.

Every entry MUST include at least ONE of these architectural-ambition features:
- Multi-level: sunken reading pit / mezzanine loft / spiral wrought-iron staircase / rolling-ladder rail / split-level platforms
- Unexpected vessel: treehouse interior / converted railway carriage / converted barge / glass-roofed conservatory / hollow-tree interior / windmill tower / clock-tower studio / boathouse loft
- Architectural drama: vaulted timber rafters / leaded-bay-window wrapping three walls / floor-to-rafter shelves on sloped ceiling / hidden alcove carved into wall thickness / floor-to-ceiling stone fireplace / sliding shoji separating layered rooms / interior atrium plant-wrapped

PLUS density: every surface art-directed packed — books on books, plants spilling from rafters, herbs hanging from beams, mug beside teapot beside knitting beside open journal beside trailing pothos. Not "tasteful clutter" — concept-art maximum.

PLUS rain on glass mandatory: sheeting / drumming / streaking down panes, condensation fogging corners.

━━━ INTERIOR CATEGORIES (with concept-art ambition baked in) ━━━
- Treehouse studios cantilevered over a forest canopy at storm-night
- Converted railway-carriage bedrooms with curved roof + paneled walls + book-stacks lining the corridor
- Greenhouse conservatories with reading nooks tucked INSIDE the foliage, glass roof drumming with rain
- Mezzanine loft bedrooms above a main study, ladder + open floor allowing the rain on the lower windows to be visible
- Sunken reading pits in the floor of a larger room, encircled by a railing, lamp lowered into the well
- Attic studios under sloped roof with a row of dormer windows, every dormer streaming with rain
- Spiral-stair tower rooms with windows wrapping the walls, books filling every wall-curve
- Hidden-alcove bedrooms carved into thick stone walls, single deep-set window streaming rain
- Glass-walled bay-window rooms wrapped on three sides with rain-sheeting glass, plants pressed against panes
- Bookshop interiors converted into living rooms, shelves up to a vaulted ceiling, ladder + bay window
- Conservatory writing rooms inside a domed glasshouse, ferns + monstera reaching toward the storm-glass
- Cliffside cabin bedrooms with an entire wall of glass facing a rain-driven sea
- Lighthouse-keeper studio rooms in the upper level, circular window-walls with rain warping the view
- Apothecary back-rooms with hanging-herb ceilings, rain-streaked leaded-glass behind shelves of bottles
- Old-bookshop nooks tucked behind sliding-ladder shelves, bay window weeping rain into the courtyard

━━━ MANDATORY ELEMENTS PER ENTRY ━━━
1. ONE architecturally ambitious feature (named explicitly: "spiral wrought-iron stair", "treehouse cantilever", "vaulted timber rafters", "mezzanine loft", "glass-domed conservatory", etc.)
2. Concept-art-density of cozy objects (books stacking, plants spilling from multiple surfaces, layered textiles, multiple light sources)
3. Rain ACTIVELY visible on a window OR glass surface (sheeting / drumming / streaking + condensation)
4. Multiple light sources named (oil lamp + candle + fire / brass desk lamp + pendant + lantern / etc.)
5. Anti-photoreal anchor: "painterly", "concept-art-cozy", "storybook illustration density", "Studio Ghibli interior background", "Eyvind Earle warmth"

━━━ HARD BANS ━━━
- NO people / figures / hands / faces (animals OK as cozy detail — sleeping cat etc.)
- NO surreal elements: NO planets in the sky, NO floating books, NO levitating objects, NO fantasy creatures, NO magic glow without source. The architecture is dramatic but GROUNDED.
- NO photo-realistic real-house descriptions — never "studio apartment with a desk and a plant" / "cozy bedroom with an iron bed". Always concept-art ambition.
- NO modern minimalist aesthetic, NO Pinterest interior-design photo register
- NO bright sunlight (storm scene — light outside is dim cool grey-blue)

━━━ FEW-SHOT EXAMPLES (this is the level of ambition we want) ━━━
EX-1: "Treehouse studio cantilevered into a moss-draped forest canopy, vaulted timber rafters lined with hanging brass lanterns, floor-to-rafter shelves crammed with leather books, mezzanine bed-loft above, three glass-walls sheeting with silver rain, ferns reaching from copper pots, painterly storybook concept art"
EX-2: "Spiral wrought-iron staircase rising through a tower-room library, books packing every curved wall, brass oil lamps at every landing, single deep-set bay window streaming with sheeting rain, condensation fogging the leaded panes, monstera trailing from upper rafters, hand-painted Ghibli interior"
EX-3: "Glass-domed conservatory writing-room, ferns and monstera reaching from copper pots toward the glass roof drumming with heavy rain, brass desk under a hanging copper lamp, books stacked on a wrought-iron rolling cart, oil lantern beside a steaming teapot, Eyvind Earle painterly warmth"
EX-4: "Sunken reading pit in the center of a larger study, deep cushioned step-down ringed with book-stacks waist-high, brass pendant lamp pooling honey-amber from above, candles in pewter holders along the rim, leaded-bay-window beside it streaming rain, painterly concept-art density"
EX-5: "Mezzanine loft bedroom above a main study, rolling-ladder leaning against the floor-to-rafter shelves, plants spilling from upper rail, lower-floor leaded windows streaming rain, brass oil-lamp glowing on the loft desk, sheepskin throw bunched, Studio Ghibli interior background warmth"

━━━ OUTPUT ━━━
JSON array of ${n} strings. Dense, comma-rich, concept-art-ambitious. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
