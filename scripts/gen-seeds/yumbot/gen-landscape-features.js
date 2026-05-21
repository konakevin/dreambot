#!/usr/bin/env node
/**
 * YumBot LANDSCAPE_FEATURES — hand-crafted ~80-entry pool of substantial
 * outdoor scene elements. Refactor of the existing dream_environment pool,
 * now tagged with WORLD_FIT + TYPE so any path can filter to its native
 * landscape elements.
 *
 * Tag dimensions:
 *   TYPE:      STREAM / POND / TRAIL / ROCKS / TREES / BRIDGE / HILL /
 *              FLORAL_FIELD / MUSHROOM_GROVE / WATERFALL / FLOATING_ISLAND /
 *              CANDY_TERRAIN / FOREST_FLOOR / OPEN_MEADOW
 *   WORLD_FIT: RAINBOW_DREAMSCAPE / COTTAGECORE / CANDY_FANTASY /
 *              FESTIVAL / PICNIC / MARKET / UNIVERSAL
 */

const fs = require('fs');

const FEATURES = [
  // === STREAMS (water — rainbow-dreamscape, cottagecore) ===
  { d: 'A pastel-pink stream winding gently through the soft meadow grass with rainbow ripples', t: ['STREAM', 'RAINBOW_DREAMSCAPE', 'COTTAGECORE'] },
  { d: 'A glassy pastel-mint stream reflecting cotton-candy clouds as it meanders across the dreamscape', t: ['STREAM', 'RAINBOW_DREAMSCAPE', 'COTTAGECORE'] },
  { d: 'A soft sparkling pastel-blue brook babbling over smooth pebbles through the flowering meadow', t: ['STREAM', 'RAINBOW_DREAMSCAPE', 'COTTAGECORE', 'PICNIC'] },
  { d: 'A rainbow-ribbon stream cutting a gentle curve across the pastel grass with shimmering water', t: ['STREAM', 'RAINBOW_DREAMSCAPE', 'CANDY_FANTASY'] },
  { d: 'A pastel forest stream flowing past mossy rocks under cherry-blossom branches', t: ['STREAM', 'COTTAGECORE', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A chocolate-syrup river flowing through soft candy-banks with marshmallow-foam', t: ['STREAM', 'CANDY_FANTASY'] },
  { d: 'A liquid-pastel-icing stream cascading over candy-cane stepping-stones', t: ['STREAM', 'CANDY_FANTASY'] },

  // === PONDS / LAKES (water — cottagecore, dreamscape) ===
  { d: 'A small glassy pastel-lavender pond reflecting the soft sky like a perfect mirror', t: ['POND', 'RAINBOW_DREAMSCAPE', 'COTTAGECORE'] },
  { d: 'A lily-pad-dotted pastel-pink pond nestled between gentle hills with pearlescent water', t: ['POND', 'RAINBOW_DREAMSCAPE', 'COTTAGECORE'] },
  { d: 'A pearl-blue mini-lake surrounded by soft pastel grasses and blooming meadow flowers', t: ['POND', 'RAINBOW_DREAMSCAPE', 'COTTAGECORE', 'PICNIC'] },
  { d: 'A koi-pond with pastel water and floating cherry-blossom-petals at twilight', t: ['POND', 'FESTIVAL', 'COTTAGECORE'] },
  { d: 'A jelly-pool of pastel-rainbow gelatin shimmer with marshmallow-banks', t: ['POND', 'CANDY_FANTASY'] },
  { d: 'A small fairy-pool of glowing pastel-water at the base of a mossy bank', t: ['POND', 'COTTAGECORE', 'RAINBOW_DREAMSCAPE'] },

  // === TRAILS / PATHS ===
  { d: 'A mossy stone-trail winding gently through the pastel grass toward a distant hilltop', t: ['TRAIL', 'COTTAGECORE', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A pastel-petal-strewn path lined with stones leading off into the meadow', t: ['TRAIL', 'RAINBOW_DREAMSCAPE', 'COTTAGECORE'] },
  { d: 'A smooth pebble-path of pastel rounded stones meandering through wildflowers', t: ['TRAIL', 'COTTAGECORE', 'PICNIC', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A pastel-stepping-stone trail crossing a stream toward a cottage', t: ['TRAIL', 'COTTAGECORE'] },
  { d: 'A golden-pastel-pollen trail glowing softly as if magical', t: ['TRAIL', 'RAINBOW_DREAMSCAPE', 'CANDY_FANTASY'] },
  { d: 'A cobblestone festival-lane lit by hanging paper-lanterns', t: ['TRAIL', 'FESTIVAL', 'MARKET'] },
  { d: 'A pastel-rainbow-ribbon path snaking through a candy-grass field', t: ['TRAIL', 'CANDY_FANTASY'] },
  { d: 'A cookie-tile road in alternating pastel-pink and pastel-yellow squares', t: ['TRAIL', 'CANDY_FANTASY'] },

  // === ROCKS / BOULDERS ===
  { d: 'A cluster of mossy pastel-boulders covered in soft green moss and tiny ferns', t: ['ROCKS', 'COTTAGECORE', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A cluster of round pastel-rocks dotting the meadow grass in soft cream and pink', t: ['ROCKS', 'COTTAGECORE', 'PICNIC', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A sparkling pastel-crystal-cluster outcrop with iridescent shimmer in the light', t: ['ROCKS', 'CANDY_FANTASY', 'RAINBOW_DREAMSCAPE'] },
  { d: 'Soft moss-covered rocks scattered along the edge of a stream', t: ['ROCKS', 'COTTAGECORE'] },
  { d: 'A cluster of pastel-pebbles arranged like a small cairn beside a path', t: ['ROCKS', 'COTTAGECORE', 'RAINBOW_DREAMSCAPE'] },
  { d: 'Gumdrop-shaped boulders in pastel-rainbow colors clustered along a candy-path', t: ['ROCKS', 'CANDY_FANTASY'] },

  // === TREES ===
  { d: 'A small pastel cherry-blossom-tree with cascading pink petals and a moss-wrapped trunk', t: ['TREES', 'COTTAGECORE', 'RAINBOW_DREAMSCAPE', 'FESTIVAL'] },
  { d: 'A pastel-pink flowering-tree silhouette with delicate branches and floral-cluster blooms', t: ['TREES', 'COTTAGECORE', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A pastel-rainbow-leaved tree with leaves in pink, mint, lavender, and peach', t: ['TREES', 'CANDY_FANTASY', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A pastel-pine-tree dusted with soft snow-blossoms and pearl-glitter', t: ['TREES', 'COTTAGECORE'] },
  { d: 'A pastel-willow-tree with cascading branches trailing toward the water', t: ['TREES', 'COTTAGECORE', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A cluster of small pastel-mint trees with rounded canopies and slim trunks', t: ['TREES', 'COTTAGECORE', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A lollipop-shaped tree with pastel-swirl-disk canopy and a peppermint-stripe trunk', t: ['TREES', 'CANDY_FANTASY'] },
  { d: 'A candy-cane-striped pastel-pine-tree with frosting-snow drape', t: ['TREES', 'CANDY_FANTASY'] },
  { d: 'A pastel-marshmallow-tree with fluffy spherical-canopy clusters', t: ['TREES', 'CANDY_FANTASY'] },

  // === BRIDGES ===
  { d: 'A wooden footbridge crossing a pastel-stream with mossy edges and a railing of vines', t: ['BRIDGE', 'COTTAGECORE'] },
  { d: 'An arched stone-bridge with mossy edges spanning a small pastel-stream', t: ['BRIDGE', 'COTTAGECORE', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A pastel-painted bridge with ribbon-railings and curved pastel-pink boards', t: ['BRIDGE', 'CANDY_FANTASY', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A small red lacquered festival-bridge with paper-lanterns hanging along the railing', t: ['BRIDGE', 'FESTIVAL'] },
  { d: 'A gingerbread-cookie bridge with icing-railings spanning a chocolate-stream', t: ['BRIDGE', 'CANDY_FANTASY'] },

  // === HILLS / RIDGES ===
  { d: 'A gentle pastel-hill rising in the foreground covered in pastel-wildflowers', t: ['HILL', 'COTTAGECORE', 'PICNIC', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A soft rolling pastel-grass-ridge curving across the midground', t: ['HILL', 'COTTAGECORE', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A pastel-mossy mound in the meadow with tiny pastel-flowers blooming on top', t: ['HILL', 'COTTAGECORE', 'PICNIC'] },
  { d: 'A pastel-pink frosting-hill with sprinkle-decorations along its slope', t: ['HILL', 'CANDY_FANTASY'] },
  { d: 'A pastel-cake-mountain with layered fondant tiers visible', t: ['HILL', 'CANDY_FANTASY'] },

  // === FLORAL FIELDS / MEADOWS ===
  { d: 'A dense field of pastel cosmos blooming in pink, white, and lavender', t: ['FLORAL_FIELD', 'COTTAGECORE', 'PICNIC', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A sea of pastel poppies and wildflowers stretching to the horizon', t: ['FLORAL_FIELD', 'COTTAGECORE', 'PICNIC', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A sweeping pastel-lupine-field with tall flower-spires in pink and lilac', t: ['FLORAL_FIELD', 'COTTAGECORE', 'PICNIC'] },
  { d: 'A dense wildflower-meadow patch with cosmos, daisies, and clover all mixed', t: ['FLORAL_FIELD', 'COTTAGECORE', 'PICNIC', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A meadow of pastel tulips in cream, blush, and butter-yellow', t: ['FLORAL_FIELD', 'COTTAGECORE', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A sweeping field of pastel-sunflowers turned toward the sky', t: ['FLORAL_FIELD', 'COTTAGECORE', 'PICNIC'] },

  // === MUSHROOM GROVES ===
  { d: 'A cluster of giant pastel-mushrooms with cream-spotted red caps in a forest clearing', t: ['MUSHROOM_GROVE', 'COTTAGECORE', 'CANDY_FANTASY'] },
  { d: 'A glowing pastel-mushroom-grove with mushrooms in pink, mint, and lavender', t: ['MUSHROOM_GROVE', 'COTTAGECORE', 'RAINBOW_DREAMSCAPE'] },
  { d: 'An amanita-mushroom-cluster in the grass with iridescent shimmer on the caps', t: ['MUSHROOM_GROVE', 'COTTAGECORE'] },
  { d: 'A pastel-marshmallow-mushroom-grove with fluffy cap-textures', t: ['MUSHROOM_GROVE', 'CANDY_FANTASY'] },

  // === WATERFALLS ===
  { d: 'A small pastel-waterfall cascading off a rocky shelf into a glassy pool', t: ['WATERFALL', 'COTTAGECORE', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A rainbow-mist waterfall splashing into a pool of pearl-pastel water', t: ['WATERFALL', 'RAINBOW_DREAMSCAPE', 'CANDY_FANTASY'] },
  { d: 'A glassy waterfall with sparkle-spray rising in iridescent mist', t: ['WATERFALL', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A chocolate-syrup waterfall pouring over a candy-cliff into a marshmallow-pool', t: ['WATERFALL', 'CANDY_FANTASY'] },

  // === FLOATING ISLANDS ===
  { d: 'A small floating pastel-rock-island hovering in the air with a tiny waterfall trickling off', t: ['FLOATING_ISLAND', 'RAINBOW_DREAMSCAPE', 'CANDY_FANTASY'] },
  { d: 'A mossy floating-cliff with a waterfall splashing into clouds below', t: ['FLOATING_ISLAND', 'COTTAGECORE', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A Studio-Ghibli-style floating pastel-platform with a single tree on top', t: ['FLOATING_ISLAND', 'RAINBOW_DREAMSCAPE', 'COTTAGECORE'] },

  // === CANDY TERRAIN (candy-fantasy specific) ===
  { d: 'Cotton-candy-cloud formations drifting at meadow-level like fluffy fog', t: ['CANDY_TERRAIN', 'CANDY_FANTASY', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A pastel-frosting-snow-bank with sprinkle-confetti scattered across it', t: ['CANDY_TERRAIN', 'CANDY_FANTASY'] },
  { d: 'A field of gumdrop-bushes in pastel-rainbow colors clustered like shrubs', t: ['CANDY_TERRAIN', 'CANDY_FANTASY'] },
  { d: 'A peppermint-striped pastel-snowy-hill with candy-cane-fence at the edge', t: ['CANDY_TERRAIN', 'CANDY_FANTASY'] },
  { d: 'A meadow of pastel-jellybean-stones scattered like pebbles', t: ['CANDY_TERRAIN', 'CANDY_FANTASY'] },

  // === FOREST FLOOR (cottagecore) ===
  { d: 'A mossy forest floor carpeted with fallen pastel-leaves and tiny ferns', t: ['FOREST_FLOOR', 'COTTAGECORE'] },
  { d: 'A pastel-fern-glade with sun-shafts piercing through a leafy canopy', t: ['FOREST_FLOOR', 'COTTAGECORE'] },
  { d: 'A bed of pastel-clover dotted with tiny mushroom-clusters', t: ['FOREST_FLOOR', 'COTTAGECORE'] },

  // === OPEN MEADOW (universal outdoor) ===
  { d: 'A wide pastel-grass meadow stretching to gentle pastel-mountain peaks in the distance', t: ['OPEN_MEADOW', 'RAINBOW_DREAMSCAPE', 'PICNIC', 'COTTAGECORE'] },
  { d: 'A sun-dappled pastel-meadow with cherry-blossom-trees framing the edges', t: ['OPEN_MEADOW', 'RAINBOW_DREAMSCAPE', 'COTTAGECORE', 'PICNIC'] },
  { d: 'A breezy pastel-grassland with pastel-mountains in soft pastel-haze on the horizon', t: ['OPEN_MEADOW', 'RAINBOW_DREAMSCAPE', 'PICNIC'] },
  { d: 'A pastel-valley with rolling hills and a winding stream at the floor', t: ['OPEN_MEADOW', 'RAINBOW_DREAMSCAPE', 'COTTAGECORE'] },

  // === FESTIVAL UNIQUE ===
  { d: 'A festival-stall row of wooden-frame yatai with paper-lanterns hanging overhead', t: ['TRAIL', 'FESTIVAL', 'MARKET'] },
  { d: 'A pastel-pebble path lit by paper-lanterns leading toward a festival-shrine entrance', t: ['TRAIL', 'FESTIVAL'] },

  // === MARKET UNIQUE ===
  { d: 'A row of striped pastel market-tents with hand-painted signs and bunting', t: ['TRAIL', 'MARKET'] },
  { d: 'A pastel-cobblestone market-square with hanging-laundry across the alley above', t: ['TRAIL', 'MARKET'] },
];

const VALID_TYPES = new Set(['STREAM', 'POND', 'TRAIL', 'ROCKS', 'TREES', 'BRIDGE', 'HILL', 'FLORAL_FIELD', 'MUSHROOM_GROVE', 'WATERFALL', 'FLOATING_ISLAND', 'CANDY_TERRAIN', 'FOREST_FLOOR', 'OPEN_MEADOW']);
const VALID_WORLDS = new Set(['CAFE', 'KONBINI', 'CANDY_FANTASY', 'FESTIVAL', 'PICNIC', 'BAKERY', 'MARKET', 'TEA_PARTY', 'ARCADE', 'COTTAGECORE', 'BENTO', 'MINI_CHEF', 'RAINBOW_DREAMSCAPE', 'UNIVERSAL']);

let errors = 0;
FEATURES.forEach((c, i) => {
  const types = c.t.filter(t => VALID_TYPES.has(t));
  const worlds = c.t.filter(t => VALID_WORLDS.has(t));
  const unknown = c.t.filter(t => !VALID_TYPES.has(t) && !VALID_WORLDS.has(t));
  if (types.length < 1) { console.error(`#${i+1}: expected 1+ TYPE, got 0`); errors++; }
  if (worlds.length < 1) { console.error(`#${i+1}: expected 1+ WORLD, got 0`); errors++; }
  if (unknown.length) { console.error(`#${i+1}: unknown tags: ${unknown.join(',')}`); errors++; }
});
if (errors) { console.error(`${errors} validation errors. Aborting.`); process.exit(1); }

const out = FEATURES.map(c => ({ description: c.d, tags: c.t }));
fs.writeFileSync('scripts/bots/yumbot/seeds/landscape_features.json', JSON.stringify(out, null, 2));
console.log(`✓ Wrote ${out.length} entries to scripts/bots/yumbot/seeds/landscape_features.json`);
