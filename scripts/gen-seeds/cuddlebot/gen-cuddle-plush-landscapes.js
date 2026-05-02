#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/cuddlebot/seeds/cuddle_plush_landscapes.json',
  total: 200,
  batch: 25,
  metaPrompt: (n) => `Write ${n} CUDDLEBOT plush-world wider-environment descriptions — landscape as protagonist, plushies small or absent. Handcrafted miniature plush-world environments. ULTRA-CUTE storybook warmth, soft cozy + dreamy + rosy, magazine-cover energy. Slight Sanrio/Hello-Kitty/Studio-Ghibli/Totoro/Pusheen kawaii nudge. Each entry 18-28 words.

━━━ CUTE NUDGE — APPLY TO EVERY ENTRY ━━━
- pastel + dreamy + soft-pink-rosy palette layering
- sparkles / glitter / shimmer-particles drifting
- oversized cute miniatures (giant strawberries, chubby felt clouds, plump mushrooms)
- soft-rounded silhouettes, no sharp edges
- always wholesome, never edgy

━━━ LANDSCAPE CATEGORIES (rotate, vary) ━━━
- Wide fabric-forest panorama in rose-gold golden-hour, plump felt-mushroom cluster, sparkles drifting
- Felt-meadow rolling to felt-mountain at twilight, embroidered-stars, pastel-blossom flurry
- Plush-village snowy panorama, woven-roof cluster glowing yellow windows, pastel-snow falling soft
- Treehouse-canopy panorama, leafy-fabric jungle, pastel-rope-bridges, dappled rosy-gold light
- Autumn felt-orchard vista with embroidered orange-pink leaves, plump felt-pumpkins
- Felt-sea harbor at golden-hour with knit-fishing-boats, pastel-pink sails, dreamy haze
- Attic-bedroom panorama with pastel mini-furniture, fairy-lights cluster, scale-window with pastel night-sky
- Library-nook panorama with cute-book-pile, mini-armchair, dust-motes shimmering rose-gold
- Felt-beach panorama with pastel-shells, miniature scale-built sandcastle, plush-cloud foam-waves
- Plush-castle on felt-hilltop pastel sunset, cotton-candy clouds, distant felt-flag
- Moonlit garden panorama, felt-pink-flowers, embroidered-dewdrops shimmer, scale-trellis
- Knitted snowy-village vista with woven-pink-roofs, wool-smoke from miniature chimneys
- Plush mountain-pass with pastel-snow drifts, plush-bear ambient, scale-built pink-sign
- Felt-river canyon, fabric-water carving through pink-plush-rock, atmospheric haze, fabric-birds
- Wood-cabin felt-meadow with scale-built thatched-cottage, knit-meadow embroidered-flowers
- Embroidered-night sky panorama, sequin-stars, embroidered-moon, pastel meadow below
- Tea-garden panorama, sprawling miniature trellis-and-knit-table, paper-lanterns, sparkles
- Picnic-meadow panorama, endless red-checkered knit-blanket landscape, miniature wicker-baskets
- Snow-fort sprawl, pastel-snow walls, miniature pastel-flag-pole markers
- Felt-pond duck-village, round felt-water pond, scale-built duck-houses on stilts
- Mini-train-station fabric-platform, scratch-built pastel-platform, sewn-flag, embroidered-tracks
- Bookstore-loft panorama, multi-level miniature scale-bookstore interior, pastel dust-motes
- Library-stained-glass panorama with rainbow-light on knit-floor, pastel sunbeam-shaft
- Felt-orchard moonlight panorama, pink-blossom felt-trees, embroidered-petals, dreamy
- Plush-mountain ridge sunrise, cotton-candy-cloud filled valley, distant scale-cabin
- Felt-bay lighthouse panorama with scale-built pink-lighthouse, atmospheric pink-fog
- Knit-grain-field panorama, wide felt-wheat field rolling to scale-built farmhouse, golden-hour
- Plush-jungle-canopy panorama, overhead leafy-fabric canopy, sunbeams-shimmer through
- Felt-creek-bend panorama, fabric-stream with pastel-stones, miniature wooden-bridge
- Embroidered-firefly meadow, knit-meadow at twilight, sequin-fireflies suspended
- Felt-village marketplace, empty miniature fabric-market-stalls with knit-canopies, pastel
- Plush-mountain switchback, pastel-snow trail zigzagging, miniature scale-cabin
- Felt-canyon panorama, fabric-canyon walls, miniature scale-bridge, atmospheric haze
- Plush-village square, empty cobblestone-fabric square, scale-built clocktower, golden-hour
- Felt-coast cliffs, wide pull-back of pastel-fabric-cliffs, miniature scale-lighthouse beam
- Knitted-snow-globe panorama, knit-village under scale-built glass-dome, pastel-snow falling
- Plush-canyon trestle-bridge, cotton-candy-cloud canyon, scale wooden-bridge spanning
- Felt-orchard-twilight rows, endless rows of stuffed-fruit-trees fading into rosy-pink haze
- Library-cathedral panorama, multi-story miniature library, vaulted-fabric ceiling stained-glass
- Plush-village winter-festival panorama, empty knit-village square, miniature lanterns

━━━ MUST-HAVE per entry ━━━
- Reference plush / fabric / felt / knit / wool / embroidered / stitched / fiberfill vocabulary
- Soft cute pastel-pink / rosy / golden / dreamy lighting
- Handcrafted miniature world tells (scale-built, miniature, scratch-built, hand-sewn)
- Optional plushie ambient or absent

━━━ BANNED ━━━
- LBP burlap-and-zipper aesthetic
- Real animals / real landscapes
- Active foreground characters (env focus)
- Grim / dark / battle / horror tones
- CGI / illustration

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
