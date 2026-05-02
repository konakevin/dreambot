#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/dollhouse_life_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} DOLLHOUSE-LIFE scene descriptions for ToyBot's dollhouse-life path. Cozy daily-life dioramas in fully-appointed miniature household sets. Mix THREE figurine traditions across the pool — Calico-Critter / Sylvanian-Families flocked-animals (~50% of entries), vintage wooden / soft-plastic dollhouse-people figurines (~30%), modern Lori / Lottie-style posable fashion-doll-scale humans (~20%). Each entry commits to ONE tradition per scene — never mix flocked-animals with human-dolls in the same scene.

Each entry: 18-28 words. ONE specific cozy daily-life moment with figurine(s) in a fully-appointed handcrafted miniature interior.

━━━ THE FIGURINE TRADITIONS ━━━
1. **CALICO-CRITTER / SYLVANIAN-FAMILIES** (flocked-animal): bunny / bear / fox / cat / mouse / raccoon / hedgehog / squirrel / rabbit-family / chipmunk / otter / panda. ~3-inch, flocked-velvet body, painted plastic eyes, tiny cloth outfits (gingham / knit / overalls / bonnet / pinafore / apron-dress).
2. **VINTAGE-DOLLHOUSE-PEOPLE** (wooden / soft-plastic): mom / dad / kid / baby / grandparent. ~3-to-5-inch, simple painted faces, fabric-or-molded clothes, posable wooden joints or stiff plastic — 1950s/60s/70s aesthetic.
3. **MODERN-LORI / LOTTIE-DOLL** (modern fashion-doll-scale humans): ~6-inch articulated plastic, rooted hair, contemporary outfits (overalls / sweaters / dresses / pajamas / school-uniform), realistic painted faces.

━━━ THE INTERIORS (fully-appointed miniature sets) ━━━
Victorian parlor (velvet wingback armchair, fringed lamp, doily on side-table), modern kitchen (miniature appliances, scale-tile floor, butcher-block island), cozy nursery (mini crib, knit-blanket, scale-rocking-horse), library nook (mini bookshelf with scale-books, reading-chair, dust-mote rays), garden-room (potted plants, watering-can, sunbeam through window), bathroom (mini clawfoot-tub, scale-sink, tiled floor), bakery shop (miniature display-case with tiny scale-pastries, scale-cash-register), music-room (mini upright-piano with sheet-music, scale-violin in case), bedroom (mini four-poster-bed, knit-quilt, scale-rug), dining-room (miniature dining-table, scale-place-settings, mini-chandelier), attic (sloped-ceiling miniature room, dust, mini-trunk), greenhouse (glass-roof scale-build, potted scale-plants, watering-can), tea-room (miniature round-table with china-set, scale-tablecloth, mini-doily), study (mini wooden-desk, scale-typewriter, leather-armchair), porch (miniature wicker-chairs, scale-pitcher of lemonade, hanging-plant), playroom (miniature toy-shelf, scale-rocking-horse, knit-rug).

━━━ SCENE CATEGORIES (rotate across all 3 figurine traditions, don't cluster) ━━━
- Calico bunny-family in Victorian parlor — flocked-bunny-mom pouring miniature teapot for two flocked-bunny-kids in fringed-lamp glow
- Vintage dollhouse-people Sunday-dinner — wooden mom-and-dad serving miniature roast at scale dining-table, kids reaching for tiny rolls
- Modern Lori-doll in cozy bedroom — 6-inch posable doll mid-read scale-book on miniature four-poster-bed, fairy-lights overhead
- Calico bear baking in modern kitchen — flocked-bear-figurine mid-stir of miniature mixing-bowl, tiny apron tied, scale-flour-dusting
- Vintage wooden grandpa reading in library nook — wooden-figure with painted face mid-page-turn of scale-book, fringed lamp glow
- Lori-doll painting in garden-room — 6-inch articulated doll mid-brushstroke at miniature easel, scale paint-set on mini-table, sun-beam
- Calico fox-cubs nursery scene — two flocked-fox-kids in miniature crib with knit-blanket, mom-fox tucking-in mid-action, lamp-glow
- Vintage soft-plastic mom-and-baby in bathroom — wooden-mom mid-bathing soft-plastic-baby in mini clawfoot-tub, sudsy water
- Lori-doll homework in study — 6-inch articulated doll mid-write at miniature wooden-desk with scale-textbook open, focused expression
- Calico mouse-family bakery — flocked-mouse-mom behind miniature bakery-counter handing tiny scale-cookie to flocked-kid-mouse customer
- Vintage wooden-figures music-room recital — wooden-mom at miniature piano with sheet-music, wooden-dad playing scale-violin, kids listening
- Lori-doll baking with mom — two 6-inch articulated dolls (mom + child) mid-roll of miniature pie-crust on scale-counter, dough-flour
- Calico bunny-tea-time on porch — flocked-bunny in miniature wicker-chair pouring scale-pitcher of tea into tiny glass, garden BG
- Vintage soft-plastic family Christmas — wooden-figures around miniature Christmas-tree with scale-presents, mid-unwrap moment, lit windows
- Lori-doll attic-discovery — 6-inch articulated doll mid-open of miniature mini-trunk in dusty attic, surprised expression, scale-treasures
- Calico hedgehog-grandma knitting in parlor — flocked-hedgehog-figure mid-stitch on miniature knitting-needles, scale-yarn-ball at feet
- Vintage wooden mom-and-kid greenhouse — wooden-mom-figure showing kid-figure how to mid-water miniature potted-plant, sun-beam
- Lori-doll tea-party with friends — three 6-inch articulated dolls at miniature round-table with scale-china-set, mid-laugh moment
- Calico bear-cubs treehouse-bedroom — flocked-bear-cubs in miniature bunk-beds with knit-quilts, scale-window with embroidered-stars
- Vintage wooden grandpa-and-grandkid fishing — wooden-figures on miniature pier with scale-fishing-rods, felt-pond reflection
- Lori-doll dance-class — 6-inch articulated doll mid-pirouette in miniature dance-studio with scale-mirror-wall, ballet-shoes
- Calico cat-cafe scene — flocked-cat-figurines at miniature cafe-tables, one as barista at scale-espresso-machine, mid-action
- Vintage soft-plastic mom-baking-with-baby — wooden-mom mid-stir at miniature mixer with soft-plastic-baby in scale-high-chair watching
- Lori-doll camping-trip miniature — 6-inch articulated doll mid-marshmallow-toast over miniature campfire in scratch-built tent-set
- Calico fox-family fall-harvest — flocked-fox-figures with miniature pumpkin-pile in scale-wagon, mid-pull moment, autumn-leaf scatter
- Vintage wooden Sunday-school class — wooden-figures-children at miniature school-desks with scale-chalkboard, teacher mid-lesson
- Lori-doll yoga-class — 6-inch articulated doll mid-warrior-pose on miniature yoga-mat in scratch-built sunlit-studio
- Calico raccoon-family bath-time — flocked-raccoons in miniature clawfoot-tub with felt-bubbles, mid-scrub moment, mom-figure with scale-towel
- Vintage soft-plastic family farm-life — wooden-figures-family on miniature porch with scale-tractor in BG, mid-conversation moment
- Lori-doll making-friendship-bracelets — 6-inch articulated dolls cross-legged on miniature rug with scale-thread-spools, mid-knot
- Calico bunny-grandma teaching-baking — flocked-bunny-grandma mid-roll of scale-dough showing flocked-bunny-grandkid, kitchen warmth
- Vintage wooden-figures library-reading — wooden-mom-and-dad in miniature library armchairs with scale-books mid-page-turn, cat-figurine at feet
- Lori-doll music-practice — 6-inch articulated doll mid-violin-bow at miniature music-stand, sheet-music in focus, scale-bow-action
- Calico squirrel-family acorn-collection — flocked-squirrels with miniature baskets mid-gather of scale-acorn-pile, autumn-meadow tableau
- Vintage soft-plastic kids-playing — wooden-figure-children mid-game of miniature jacks on scale-rug, scale-marbles scattered
- Lori-doll first-day-of-school — 6-inch articulated doll with miniature backpack at miniature front-door, mom-figure waving from porch
- Calico hedgehog-family bedtime — flocked-hedgehog-parents tucking flocked-hedgehog-kids into miniature bunk-beds, lamp-glow, lullaby moment
- Vintage wooden grandparents-knitting — wooden-grandma-and-grandpa in matching armchairs mid-stitch of scale-knitting-projects, fireplace
- Lori-doll sleepover — three 6-inch articulated dolls in miniature sleeping-bags on scale-floor, fairy-lights, mid-laugh moment
- Calico panda-family movie-night — flocked-panda-cubs on miniature couch with scale-popcorn-bowl, mom-and-dad watching tiny scale-screen
- Vintage soft-plastic family-dinner-grace — wooden-figures with hands-clasped mid-prayer at miniature dining-table, scale-roast-dinner
- Lori-doll cookie-baking — 6-inch articulated doll mid-decorate of scale-cookie with miniature frosting-bag, sprinkles
- Calico bear-cub birthday-party — flocked-bear-figures at miniature round-table with scale-cake and scale-candles, mid-blow moment
- Vintage wooden gardener-figure — wooden-figure mid-water of miniature flower-bed with scale-watering-can, sun-hat tilted

━━━ MUST-HAVE FOR EVERY ENTRY ━━━
- ONE figurine tradition committed (Calico OR vintage-wooden OR Lori — not mixed in same scene)
- Reference DOLLHOUSE / MINIATURE / SCALE / FLOCKED / WOODEN / ARTICULATED / FIGURINE language
- Specific archetype (flocked-bunny / wooden-mom / Lori-doll-girl / etc.)
- Mid-cozy-activity verb (mid-stir / mid-pour / mid-page-turn / mid-tuck-in / mid-laugh / mid-bake)
- Fully-appointed interior anchor (Victorian-parlor / modern-kitchen / library-nook / garden-room / etc.)

━━━ BANNED ━━━
- NO mixing figurine traditions in same scene (calico-bunny + Lori-doll = banned)
- NO real human / real animal
- NO outdoor wilderness scenes (this is INTERIOR LIFE)
- NO action / drama / battle (this is COZY DAILY-LIFE)
- NO CGI / illustration / digital-render language
- NO passive sitting-staring — figures should be MID-ACTIVITY

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
