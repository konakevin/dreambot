#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/dollhouse_life_landscapes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} DOLLHOUSE-LIFE wider-interior descriptions for ToyBot's dollhouse-life path — focus on the INTERIOR ROOM as protagonist, figurines small or absent. Detail-rich miniature household sets. Cozy, atmospheric, magazine-cover energy.

Each entry: 18-28 words. ONE specific wider miniature-interior shot — focus is the room itself in obsessive scale-accurate detail.

━━━ INTERIOR FOCUS (rooms as the subject) ━━━
- Sweeping miniature Victorian parlor — velvet armchairs, fringed-lamp, gilt-mirror, fireplace mantle with tiny clocks
- Cozy modern kitchen panorama — butcher-block island, miniature appliances, scale-tile floor, fruit-bowl with tiny scale-fruit
- Empty cozy nursery — mini crib with knit-blanket, scale rocking-horse, mobile, nightlight glow on scale-wallpaper
- Library nook empty — wall-of-mini-bookshelves with scale-books, reading-chair with knit-throw, dust-mote rays from window
- Garden-room interior — potted miniature plants on scale-shelving, watering-can, glass-roof scale-build, sun-beams on stone-floor
- Empty bathroom miniature — clawfoot-tub, scale-sink with tiny faucet, tiled floor, miniature towel-rack with scale-towels
- Bakery shop interior — miniature display-case with tiny scale-pastries, scale-cash-register, chalkboard menu with embroidered text
- Music-room interior — mini upright-piano with scale sheet-music open, violin-case, metronome, dust-motes in window-light
- Empty bedroom interior — four-poster-bed with knit-quilt, scale-rug, miniature dresser with scale-photos, lamp-glow
- Dining-room formal panorama — miniature mahogany dining-table with scale place-settings, chandelier, scale-china-cabinet
- Attic sloped-ceiling room — miniature trunk with scale-trinkets spilling, dust-haze, mini-window with sunbeam
- Greenhouse interior — scratch-built glass-roof with potted miniature plants, watering-can, scale-trowel, late-afternoon
- Tea-room formal — miniature round-table with full china-set, scale-tablecloth, mini-doily, lace-curtains, no figurines
- Study cozy — mini wooden-desk with scale-typewriter, leather-armchair, miniature globe, scale-pen-set, banker's-lamp
- Porch miniature — wicker-chairs, scale-pitcher of lemonade, miniature potted-plants, hanging-fern, sunset glow
- Playroom panorama — miniature toy-shelf with scale-toys, scale-rocking-horse, knit-rug, tiny chalkboard
- Empty Victorian bedroom — four-poster-bed with lace-canopy, scale-vanity-table with mini-bottles, fringed-lamp glow
- Modern living-room — miniature sectional-couch with knit-throw-pillows, mini coffee-table with scale-magazines, TV
- Empty cottage-kitchen — miniature wood-stove, scale-copper-pots hanging, butcher-block island, hanging dried-herbs
- Library cathedral — multi-level miniature bookshelves with scale-ladder, vaulted scale-ceiling, dust-rays
- Greenhouse conservatory — vast miniature glass-roof structure with scale-tropical-plants, miniature stone-fountain
- Antique shop interior — cluttered miniature shop-floor with scale-knickknacks, mini-armoire, fringed-lamp, dust
- Miniature bookstore-cafe — scale shelves with tiny scale-books, miniature cafe-tables, scale-coffee-cups
- Cottage-bedroom — miniature canopy-bed with quilted scale-blanket, scale-rocking-chair, mini-fireplace, lit windows
- Empty Victorian dining-room — long mahogany scale-table, candelabras, scale-china-display, formal-portrait on wall
- Modern minimalist living-room — miniature white-couch, mini coffee-table with scale-vase, scale-rug, sunlight
- Empty cottage-living-room — knit-rug, fireplace with scale-logs, miniature armchair with scale-knitting, lit-window
- Storybook reading-room — miniature reading-chair with scale-blanket, mini side-table with scale-tea, lamp-glow
- Modern home-office — mini-desk with scale-computer, miniature ergonomic-chair, scale-bookshelf with mini-binders
- Empty bakery-kitchen — miniature scale-mixer on butcher-block, scale-flour-canister, mini measuring-cups
- Garden-shed interior — miniature potting-bench, scale-tools, hanging dried-herbs, mini-clay-pots
- Empty schoolroom — miniature desks in rows, scale-chalkboard, mini-globe on teacher's-desk, scale-bell
- Tea-shop interior — miniature counter with scale-teapot-display, scale-loose-leaf-jars, fringed-lamps, doilies
- Cozy reading-loft — miniature fireplace, mini-armchair with scale-blanket, scale-bookshelves, knit-rug
- Empty tailor-shop — miniature dress-form, scale-sewing-machine, scale-fabric-bolts on shelves, scale-thread-spools
- Miniature toy-shop interior — scale-shelves with tiny mini-toys, mini-rocking-horse, scale-doll-display
- Empty cottage-bathroom — miniature clawfoot-tub, scale-pitcher-and-basin, dried-flowers in scale-jar
- Modern kitchen-island — miniature pendant-lights over butcher-block, scale-stools, scale-fruit-bowl, sun-window
- Empty Victorian-music-room — mini-grand-piano with scale-bench, scale-violin-case, ornate scale-wallpaper
- Cottage-greenhouse — scratch-built glass-roof structure with potted-plants, scale-watering-can, sunbeam
- Library hallway — long miniature corridor lined with scale-bookshelves, scale-runner-rug, banker's-lamp at end
- Empty playroom — miniature toy-chest, scale-stuffed-animals, scale-rocking-horse, scale-pencil-jar, sunlight

━━━ MUST-HAVE FOR EVERY ENTRY ━━━
- INTERIOR ROOM is focal point, figurines absent or as scale-bait silhouette
- Reference MINIATURE / SCALE / DOLLHOUSE / SCRATCH-BUILT vocabulary
- Specific room-type (parlor / kitchen / nursery / library / etc.)
- Atmospheric depth — sun-beam / lamp-glow / fireplace-warmth / dust-mote / golden-hour
- Dense scale-accurate detail (multiple miniature props named)

━━━ BANNED ━━━
- NO foreground active figurines (this is the LANDSCAPE pool — env focus)
- NO real interiors / real homes
- NO outdoor wilderness scenes
- NO CGI / illustration / digital-render language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
