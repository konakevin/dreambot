#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/cuddlebot/seeds/cozy_interior_scenes.json',
  total: 200,
  append: true,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} COZY-INTERIOR SCENE descriptions for CuddleBot's cozy-interior path. Beautiful interior SPACES — snug fireplace reading-nook, sunlit kitchen with bubbling pot, attic library, rain-window window-seat, cottage-loft bedroom under exposed beams, tea-room with floral wallpaper. The COZY ROOM and ATMOSPHERE are the hero. Pixar / Sanrio / Studio Ghibli / Howl's-Moving-Castle / Kiki's-Delivery-Service / Hobbit-hole / Beatrix-Potter aesthetic. NEVER photoreal, NEVER documentary.

Each entry: 18-28 words. ONE specific cozy-interior scene with COZY ROOM detail.

━━━ CRITTER RULE — NON-NEGOTIABLE ━━━
EVERY entry MUST include at least one cute critter in the scene — kitten curled in a knit blanket, mouse reading a tiny book by the fire, hedgehog sipping tea from a thimble, bunny peeking from under a quilt, owl watching rain on the window. The CRITTER + the COZY ROOM together = the cute. Architecture alone is not cute — the critter adds the soul. Critter is peripheral (small in frame, not center) but ALWAYS PRESENT.

━━━ INTERIOR TYPES (mix broadly across all entries) ━━━
- Stone fireplace reading-nook — overstuffed armchair angled toward a crackling fire, knit blanket, stack of books, side-table with tea
- Sunlit kitchen — wood stove with copper kettle steaming, herbs hanging from rafters, sun pouring through a curtain-framed window, breakfast-table with fresh bread
- Attic library — sloped ceilings under exposed beams, bookshelves to the rafters, ladder, oil-lamp on a desk, window-nook with cushion
- Rain-window window-seat — built-in window-seat with cushion, raindrop-streaked panes, knit throw, mug of cocoa, book open
- Cottage-loft bedroom — exposed beams, quilt-covered bed under a sloped roof, bedside-lamp, framed pressed flowers on the wall
- Tea-room with floral wallpaper — small round table with full tea-set, lace curtains, wallpaper of tiny roses, flower-vase
- Fairy-light-strung sewing room — cluttered cozy sewing nook, fairy-lights overhead, knitting basket, half-finished blanket
- Sun-drenched conservatory — glass-walled room with potted plants, wicker chair with knit cushion, sunbeams through leaves
- Hobbit-hole snug — round door interior, low ceilings, cluttered comfortable den with mantel-clock, framed maps
- Studio-Ghibli kitchen — old-fashioned wood-stove kitchen with cast-iron pot bubbling, herbs drying, cuckoo clock
- Cozy bath nook — claw-foot tub with bubble-bath, soft-towel-pile, candle-lit, lace-curtain window with steam
- Window-side painting nook — easel by a window, paint-jars, brushes-in-a-mug, half-painted canvas, sun-pouring-in
- Loft sleeping nook — cushioned alcove with pillows + quilt, fairy-light strands, fern-plant nearby
- Cottage entryway — coat-hooks with hung scarves, basket of mittens, snow/leaf at the door, lantern on a shelf
- Pantry-and-stove corner — open-shelf pantry with mason jars of preserves, copper-pot rack, stove with simmering pot
- Rocking-chair-by-fire — wooden rocking chair angled at a stone fireplace, knit-blanket draped, side-table with cocoa
- Sunny breakfast nook — corner banquette with cushions, sun-pouring-in window, breakfast-spread on a checkered tablecloth
- Cocoa-and-marshmallow living room — soft couch with quilt, mugs on the coffee-table, snow on the window outside
- Botanical conservatory tea-spot — wicker tea-table among potted ferns + orchids, glass walls, sun-dappled
- Reading-loft above a fireplace — cushion-pile loft with book stacks, fireplace-glow rising, tiny lantern
- Spell-book study — desk with old leather-bound books, candles dripping, telescope, cozy clutter, wood-paneled walls
- Cozy nursery — wooden crib with a quilt, mobile of stars, stuffed-creature pile, soft pastel walls, sun-pouring-in
- Window-seat with cat-bed — built-in window-seat with a knit cat-bed, lace curtain, sunlit garden visible outside
- Cottage stair-landing nook — stair-landing with a window-seat, framed art, knit-blanket-on-railing
- Christmas-fire-living-room — twinkle-light-strung mantel with stockings, decorated tree in corner, cocoa-mugs on coffee-table

━━━ SUPER OVERLAY CUTE STYLE (every entry) ━━━
- Architecture rendered with obsessive cozy detail: stone fireplace with crackling-fire glow, knit blankets, bookshelves overflowing, exposed wooden beams, cast-iron pot on a wood-stove, copper kettle, pressed-flower frames, floral wallpaper, woven rugs, lace curtains, cluttered tea-set, wax-dripping candles, dried herbs hanging, mason jars of preserves
- WARM-amber lighting from fireplace / oil-lamp / candle / sun-through-window — interior MUST READ as warm-and-glowing
- Cozy palette: warm honey-amber + cream + soft sage-green + dusty-rose + warm wood-brown + cream wallpaper
- The room feels LIVED IN and LOVED — half-finished knitting, baked-pie on windowsill, watering-can by a houseplant, slippers under the chair
- Cute critter doing something cozy — curled in a blanket, reading a tiny book, sipping tea from a thimble, peeking from under a quilt, watching rain

━━━ ABSOLUTELY BANNED ━━━
- NO photoreal / NO documentary / NO IKEA-catalog modern
- NO modern minimalism / NO sleek-empty-rooms — these are CLUTTERED cozy
- NO scary / NO eerie / NO menace
- NO modern tech (no TVs, no laptops, no smartphones, no LED-strip lights)
- NO identifiable humans

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: room-type + key-furnishing + critter-activity + light-source. Vary ROOM-TYPE + DETAIL + LIGHT across entries.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Stone fireplace reading-nook at golden-hour, kitten curled in a knit-blanket on an armchair, crackling fire, side-table with tea-set, book open"
- "Sunlit kitchen at noon, mouse on a stool watching a copper kettle steam on a wood-stove, herbs drying overhead, basket of fresh bread"
- "Attic library at twilight, owl perched on a stack of leather books, sloped ceiling under exposed beams, oil-lamp glow, fern-plant nearby"
- "Rain-window window-seat in autumn, hedgehog wrapped in a knit throw watching raindrops, mug of cocoa, book open, lace-curtain framed"
- "Studio-Ghibli kitchen at golden-hour, baby fox by a wood-stove with cast-iron pot bubbling, herbs hanging from rafters, cuckoo-clock above"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
