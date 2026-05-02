#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/plush_landscapes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} PLUSH-WORLD wider-environment descriptions for ToyBot's plush-world path — landscape as protagonist, plush characters small or absent. Handcrafted miniature plush-world environments. Storybook warmth, atmospheric, magazine-cover energy.

Each entry: 18-28 words. ONE specific wider environment shot — focus is the plush-world setting itself.

━━━ THE PLUSH-WORLD LANDSCAPES ━━━
Wide forest of fabric-trees, felt-water lake under embroidered-stars, knit-meadow rolling to felt-mountain, attic-bedroom panorama with fairy-lights and miniature furniture, sailboat-fleet on felt-sea at sunset, snow-covered fabric-village with cotton-drifts, autumn felt-orchard with embroidered-leaves, treetop-canopy felt-jungle with rope-bridges, library-nook panorama with shelves of mini-books, scratch-built train-station fabric-platform, felt-beach with stitched-shells, scale fabric-castle on felt-hilltop, mini moonlit garden with felt-flowers and dewdrops, knitted snowy-village with woven-roofs, stuffed-fabric mountain-pass with cotton-snow.

━━━ LANDSCAPE CATEGORIES (rotate, don't cluster) ━━━
- Sweeping fabric-forest panorama — endless rows of stuffed-trees in autumn-felt color, golden-hour
- Felt-meadow at twilight — knit-grass rolling to felt-mountain silhouette, embroidered-stars beginning
- Plush-village snowy panorama — cotton-snow on woven-roofs, lit yellow felt-windows, distant church-steeple
- Treehouse-canopy panorama — wide pull-back of leafy-fabric jungle with rope-bridges between fabric-trees
- Autumn felt-orchard vista — rows of stuffed-trees with embroidered-orange-and-yellow leaves, scattered felt-pumpkins
- Felt-sea harbor at golden-hour — fabric-water with knit-fishing-boats moored, scale-built wood-dock
- Attic-bedroom-panorama — wide shot of mini-furniture, tiny-bed, fairy-lights, scale-window with embroidered-night-sky
- Library-nook panorama — wall-of-bookshelves with miniature scale-books, stuffed-armchair, dust-mote rays of sunlight
- Felt-beach panorama — stitched-shell-line, miniature scale-built sandcastle, felt-waves frozen mid-crash
- Plush-castle on felt-hilltop — fabric-castle silhouette on knit-hill, sunset behind, distant felt-flag flapping
- Moonlit garden panorama — felt-flowers in moonlight with embroidered-dewdrops, scale-built trellis arch
- Knitted snowy-village vista — woven-roof cluster with cotton-drifts, wool-smoke from miniature chimneys
- Plush mountain-pass — cotton-snow drifts on stuffed-mountain-flank with scale-built signpost (no characters)
- Felt-river canyon — fabric-water carving through plush-rock-cliff, atmospheric haze, distant fabric-birds
- Wood-cabin felt-meadow — scale-built wooden-cabin in knit-meadow with embroidered-flowers, smoke from chimney
- Embroidered-night sky panorama — wide felt-meadow under sequin-stars and embroidered-moon, no characters
- Tea-garden panorama — sprawling miniature trellis-and-knit-table set with embroidered-leaves and lanterns
- Picnic-meadow panorama — endless red-checkered knit-blanket landscape with miniature wicker-baskets at intervals
- Snow-fort sprawl — cotton-snow walls forming maze with miniature flag-pole markers, no characters
- Felt-pond duck-village — round felt-water pond with cluster of scale-built duck-houses on stilts, no ducks
- Mini-train-station fabric-platform — scale-built scratch-built fabric-platform with sewn-flag, no train arriving
- Bookstore-loft panorama — multi-level miniature scale-bookstore interior, no plush-characters, dust-motes
- Library-stained-glass panorama — miniature library hall with stained-glass-window throwing rainbow light on knit-floor
- Felt-orchard moonlight panorama — pink-blossom felt-trees in moonlight, embroidered-petals on knit-grass
- Plush-mountain ridge sunrise — cotton-cloud filled valley with first-light hitting felt-summit, distant scale-cabin
- Felt-bay lighthouse panorama — scale-built lighthouse with felt-rocks at base, atmospheric fog rolling in
- Knit-grain-field panorama — wide felt-wheat field rolling to scale-built farmhouse, golden-hour
- Plush-jungle-canopy panorama — overhead view of leafy-fabric canopy with sunbeams piercing through
- Felt-creek-bend panorama — fabric-stream with stones and miniature wooden-bridge, no characters
- Embroidered-firefly meadow — knit-meadow at twilight with sequin-fireflies suspended on threads, no figures
- Felt-village marketplace — empty miniature fabric-market-stalls with knit-canopies, no characters, golden-hour
- Plush-mountain switchback — cotton-snow trail zigzagging up stuffed-mountain with miniature scale-cabin at base
- Felt-canyon panorama — fabric-canyon walls with miniature scale-bridge spanning gap, atmospheric haze
- Mini-train fabric-trestle — scale-built wooden trestle-bridge over felt-river, no train, autumn light
- Plush-village square — empty cobblestone-fabric square with scale-built clocktower, golden-hour, no characters
- Felt-coast cliffs — wide pull-back of fabric-cliffs over felt-ocean with miniature scale-lighthouse beam
- Knitted-snow-globe panorama — wide knit-village under scale-built glass-dome with cotton-snow falling
- Plush-canyon trestle-bridge — cotton-cloud filled canyon with scale wooden-bridge spanning, no characters
- Felt-orchard-twilight rows — endless rows of stuffed-fruit-trees fading into atmospheric haze, blue-hour
- Library-cathedral panorama — multi-story miniature library with vaulted-fabric ceiling and stained-glass, no characters
- Plush-village winter-festival panorama — empty knit-village square with miniature lanterns and felt-snow, no characters

━━━ MUST-HAVE FOR EVERY ENTRY ━━━
- ENVIRONMENT/INFRASTRUCTURE is focal point, not characters
- Reference PLUSH / FABRIC / FELT / KNIT / WOOL / EMBROIDERED / STITCHED / FIBERFILL vocabulary
- Handcrafted miniature world tells (scale-built, miniature, scratch-built, hand-sewn, etc.)
- Atmospheric depth — golden-hour / blue-hour / moonlight / fog / snow / rain / fairy-lights
- Either no characters OR characters as distant silhouette / scale-bait

━━━ BANNED ━━━
- NO LBP burlap-and-zipper language
- NO real animals / real landscapes
- NO active foreground characters (this is the LANDSCAPE pool — env focus)
- NO CGI / illustration / digital-render language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
