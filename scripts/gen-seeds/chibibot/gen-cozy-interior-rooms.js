#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/cozy_interior_rooms.json',
  total: 200,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} CHIBI-SCALE COZY INTERIORS for ChibiBot cozy-interior. The HERO of this pool is REAL-OBJECT-AS-HOME (chibi has converted a normal-sized human object into a fully-decorated tiny home). A MINORITY (~40%) are PURPOSE-BUILT chibi-scale dwellings (mushroom-house / treehouse / chibi-cottage). Every entry is HEAVILY DECORATED COTTAGECORE.

Each entry: 18-30 words. ONE specific chibi-scale interior. NO creatures, time-of-day, weather, or activity verbs.

━━━ THE BAR — UNEXPECTED CUTE TINY-CREATURE-ONLY HOME ━━━

The viewer's reaction should be "WAIT — they live INSIDE a teacup / a music-box / a matchbox?" or "look at that tiny hobbit-hole cottage!" Whimsical + magical + unexpected. NEVER an ordinary human-scale room.

━━━ TWO CATEGORIES — REAL-OBJECT IS THE HERO ━━━

(A) REAL-OBJECT-AS-HOME (60%) — chibi has moved into an everyday object and furnished it
(B) PURPOSE-BUILT TINY-CHIBI-HOME (40%) — actual home built to chibi scale

━━━ CATEGORY DISTRIBUTION ━━━

[REAL-OBJECT-AS-HOME — 60%]
- 15% TEACUP / KETTLE / VESSEL HOME (interior of a giant porcelain teacup converted to a sitting-room: patchwork quilt draped over a thimble-armchair, miniature hearth carved into the saucer-rim / inside an enamel kettle re-purposed as a cozy bedroom with brass-wire bed and lace curtain stitched across the spout-window / interior of a chipped sugar-bowl with hanging-lantern and wee book-stack / nutshell-room with cotton-stuffing bed and walnut-shell bookshelves)
- 15% MUSIC / INSTRUMENT HOME (inside a grand piano with velvet curtains hung between the strings and a knit-blanket bed on the soundboard / interior of a wind-up music-box with velvet-lined walls and a dancing-figurine becoming the bedpost / accordion-bellows-room with patchwork curtains across each pleat / interior of a violin-case bedroom with red-velvet lining and tiny pillows / harp-frame archway with curtain and a tiny window-nook in the resonator)
- 10% MATCHBOX / SUITCASE / TRUNK (matchbox bedroom with cotton-mattress and brass-thimble headboard and matchstick rafters / interior of a furnished steamer-trunk: framed pressed-flowers on the inside-lid, quilt-bed in the base, brass-key on a hook / hatbox cottage with floral wallpaper, wee fireplace carved into the brim, lace curtains / shoe-box bedroom with leather-walls and embroidered cushions)
- 10% TEAPOT / FRUIT / GOURD (interior of a Halloween-pumpkin converted to a cozy autumn home with carved-window-curtains and knit-blanket bed and stem-candle / inside a hollowed-out apple with seed-shelves and a candle on a stem-bedpost / interior of a giant teapot with curtained spout-window, kettle-handle becoming a rope-ladder loft / hollowed gourd-cottage with carved window and stem-chimney-smoke / inside a sliced-watermelon-half with seed-pillow bed)
- 5% BOOK / LANTERN / LIGHTBULB / UNUSUAL VESSEL (interior of a giant open storybook re-purposed as a bedroom — pages becoming the walls, a knit blanket draped across a sentence, dried-flower-bookmark for a curtain / inside a hollowed-glass-lantern with brass-floor and embroidered cushions / interior of a frosted-lightbulb bedroom with cotton-wool clouds and tiny rope-ladder / hollow-glass-bottle interior with curtained-cork-door)
- 5% MISC REAL-OBJECT (open umbrella turned upside-down with embroidered cushions and lantern-strung handle for a chandelier / inside a typewriter with keyboard-keys becoming little stools and ribbon-curtains / interior of a wooden-music-box jewelry-organizer with curtained-drawer-bedrooms / hollowed-mailbox cottage with letter-stack-bed and brass-flag-window)

[PURPOSE-BUILT TINY-CHIBI-HOME — 40%]
- 15% MUSHROOM-HOUSE INTERIOR (giant-mushroom-cap interior with spiral wood-stair to a loft, dried-herb bunches hanging from the underside-gills, brass-lantern at every nook / red-cap mushroom-house with knit-blanket bed in the stalk-base, pressed-flower frames lining the curved walls, circular hearth carved into the floor / amanita-cap living-room with circular hearth, patchwork rugs, woven-vine railings to a sleeping-loft / cluster-of-tiny-mushroom rooms connected by wee bridges)
- 10% TREEHOUSE / IN-TREE INTERIOR (hollowed-oak interior with curved-wood ceiling, knit blankets draped over a window-seat, brass-lamp at every nook / hollowed-redwood room with spiral-stair to a loft, fairy-lights woven through bark, embroidered cushions piled in a window-seat / hollow-willow cottage with curtain of leaves at the doorway, hearth carved into the trunk, pressed-flower-frames lining the walls)
- 10% HOBBIT-HOLE / BURROW (round green-door interior with curved oak ceiling, knit-blanket-piled window-seat, brass-lamp pooling warm light / underground-burrow with hanging-roots ceiling, cozy circular hearth, patchwork quilts on a low bed / earth-walled snug with woven-rug floor, dried-herb-bundles, leather-bound-books)
- 5% MISC TINY-CHIBI-DWELLING (Beatrix-Potter-scale cottage sitting-room with floral wallpaper, lace curtains, knit-blanket-piled armchair / wee witch's cottage kitchen with bubbling cauldron, hanging-herbs, broom-in-the-corner / chibi-wizard-tower-turret with star-charts pinned to walls, brass orrery, dripping candles)

━━━ MANDATORY: COZY-DECOR ELEMENTS IN EVERY ENTRY ━━━

Each entry MUST visibly include at least 3 of: blankets/quilts, warm light source (hearth/lamp/candle/fairy-lights), books/teacups/dried-herbs/pressed-flowers, textiles (lace/embroidery/knits), framed-art or florals.

━━━ HARD BANS ━━━

- NO creatures or characters
- NO time / weather / activity verbs
- NO outdoor scenes (interior ONLY)
- NO modern tech
- NO minimalist / sparse rooms — every entry packed with cozy detail
- NO ordinary human-scale rooms (chibi-scale ONLY)

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering. Aim for 60% real-object-as-home, 40% purpose-built tiny-chibi-dwelling.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
