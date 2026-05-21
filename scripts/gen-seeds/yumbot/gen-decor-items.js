#!/usr/bin/env node
/**
 * YumBot DECOR_ITEMS — ~60-entry pool of cute small set-decoration items.
 *
 * These are small scene-details — NOT food, NOT characters, NOT landscape
 * features. They populate the scene with charming clutter. Filtered by
 * WORLD_FIT so each path pulls only decor that fits its emotional world.
 *
 * Tag dimensions:
 *   TYPE:      LANTERN / FLOWER / RIBBON / FAIRY_LIGHT / BUNTING / BASKET /
 *              PLUSH / SIGN / VESSEL / WIND_DECOR / LACE / GIFT / TINY_OBJECT
 *   WORLD_FIT: CAFE / KONBINI / CANDY_FANTASY / FESTIVAL / PICNIC / BAKERY /
 *              MARKET / TEA_PARTY / ARCADE / COTTAGECORE / BENTO / MINI_CHEF /
 *              RAINBOW_DREAMSCAPE / UNIVERSAL
 */

const fs = require('fs');

const DECOR = [
  // === LANTERNS (festival / cottagecore / cafe) ===
  { d: 'A paper-lantern strand of warm red-and-gold lanterns hung overhead with soft glow', t: ['LANTERN', 'FESTIVAL', 'CAFE'] },
  { d: 'A cluster of small pastel-pink paper-lanterns hanging at varying heights', t: ['LANTERN', 'FESTIVAL', 'CAFE', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A hanging glass-jar lantern with a tiny candle inside, twisted-wire handle', t: ['LANTERN', 'COTTAGECORE', 'PICNIC', 'CAFE'] },
  { d: 'A vintage brass-lantern with warm-amber glow on a wooden post', t: ['LANTERN', 'COTTAGECORE', 'MARKET', 'CAFE'] },
  { d: 'A floating sky-lantern in pastel-pink drifting upward with a tiny ribbon-tail', t: ['LANTERN', 'FESTIVAL', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A row of festival-stall paper-lanterns in red, yellow, and pink along a stall-roof', t: ['LANTERN', 'FESTIVAL', 'MARKET'] },

  // === FLOWERS / FLORAL CLUSTERS ===
  { d: 'A small pastel-pink rose bouquet wrapped in lace tied with twine', t: ['FLOWER', 'COTTAGECORE', 'TEA_PARTY', 'PICNIC', 'BAKERY'] },
  { d: 'A cluster of pastel daisies in a tiny glass-bottle vase', t: ['FLOWER', 'COTTAGECORE', 'PICNIC', 'TEA_PARTY', 'CAFE'] },
  { d: 'A cherry-blossom branch arching from a wall with pink petals', t: ['FLOWER', 'COTTAGECORE', 'CAFE', 'RAINBOW_DREAMSCAPE', 'TEA_PARTY'] },
  { d: 'A sprig of pastel-lavender stems tied with a satin ribbon', t: ['FLOWER', 'COTTAGECORE', 'TEA_PARTY', 'PICNIC'] },
  { d: "A cluster of pastel wildflowers (cosmos, baby's breath, mini-roses) gathered casually", t: ['FLOWER', 'COTTAGECORE', 'PICNIC', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A pastel hydrangea-cluster in a ceramic teapot-vase', t: ['FLOWER', 'TEA_PARTY', 'COTTAGECORE', 'CAFE'] },
  { d: 'A wreath of fresh wildflowers hanging on a wooden cottage-door', t: ['FLOWER', 'COTTAGECORE', 'MARKET'] },

  // === RIBBONS / BOWS / BUNTING ===
  { d: 'A string of pastel-pink-and-blue triangular bunting hanging in a gentle arc', t: ['BUNTING', 'CANDY_FANTASY', 'PICNIC', 'CAFE', 'BAKERY', 'TEA_PARTY'] },
  { d: 'A satin chiffon ribbon-loop in pastel-pink trailing across a surface', t: ['RIBBON', 'TEA_PARTY', 'BAKERY', 'CAFE', 'CANDY_FANTASY'] },
  { d: 'A row of pastel-rainbow ribbons fluttering in a soft breeze', t: ['RIBBON', 'CANDY_FANTASY', 'PICNIC', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A cluster of pastel polka-dot bunting hanging between two posts', t: ['BUNTING', 'PICNIC', 'CAFE', 'MARKET', 'BAKERY'] },
  { d: 'A pearl-bead chain draped across a shelf or beam', t: ['RIBBON', 'TEA_PARTY', 'BAKERY', 'CANDY_FANTASY'] },

  // === FAIRY LIGHTS / STRING LIGHTS ===
  { d: 'A string of warm-amber fairy-lights tangled around a branch with soft glow', t: ['FAIRY_LIGHT', 'COTTAGECORE', 'CAFE', 'RAINBOW_DREAMSCAPE', 'FESTIVAL'] },
  { d: 'A pastel-rainbow string-light cluster glowing softly overhead', t: ['FAIRY_LIGHT', 'COTTAGECORE', 'CAFE', 'CANDY_FANTASY', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A canopy of twinkling fairy-lights hung between two posts at a market-stall', t: ['FAIRY_LIGHT', 'MARKET', 'FESTIVAL', 'CAFE'] },
  { d: 'A net of fairy-lights draped over a cottage-window with warm glow filtering through', t: ['FAIRY_LIGHT', 'COTTAGECORE', 'CAFE'] },

  // === BASKETS / WICKER ===
  { d: 'A small wicker picnic-basket with a checkered cloth peeking out', t: ['BASKET', 'PICNIC', 'MARKET', 'COTTAGECORE'] },
  { d: 'A round wicker basket of pastel-mini-fruits (strawberries, blueberries, peaches)', t: ['BASKET', 'PICNIC', 'MARKET', 'COTTAGECORE', 'BAKERY'] },
  { d: 'A small flower-basket of cosmos and daisies with woven handle', t: ['BASKET', 'COTTAGECORE', 'PICNIC', 'MARKET'] },
  { d: 'A pastel-painted wooden basket of fresh-baked rolls covered with a cloth', t: ['BASKET', 'BAKERY', 'MARKET', 'COTTAGECORE'] },

  // === PLUSHIES / TINY TOYS ===
  { d: 'A small kawaii plushie of a pastel-pink bear sitting on a shelf', t: ['PLUSH', 'CAFE', 'TEA_PARTY', 'UNIVERSAL'] },
  { d: 'A tiny pastel-bunny plushie with a ribbon-bow on its ear', t: ['PLUSH', 'CAFE', 'COTTAGECORE', 'TEA_PARTY'] },
  { d: 'A cluster of three small kawaii-creature plushies sitting in a row', t: ['PLUSH', 'CAFE', 'ARCADE', 'TEA_PARTY'] },
  { d: 'A pastel-pink rabbit-plushie peeking from a wicker basket', t: ['PLUSH', 'CAFE', 'PICNIC', 'COTTAGECORE'] },

  // === SIGNS / MENUS ===
  { d: 'A handwritten pastel-chalkboard menu on a wooden easel with cute doodles', t: ['SIGN', 'CAFE', 'BAKERY', 'MARKET'] },
  { d: 'A small wooden sign painted pastel-pink with cursive lettering hanging by twine', t: ['SIGN', 'CAFE', 'BAKERY', 'COTTAGECORE', 'MARKET'] },
  { d: 'A pastel-painted shop-sign with floral border and gentle calligraphy', t: ['SIGN', 'CAFE', 'BAKERY', 'MARKET'] },
  { d: 'A festival-stall sign with calligraphy and red-paper trim', t: ['SIGN', 'FESTIVAL', 'MARKET'] },

  // === VESSELS / SERVING ITEMS (decor that aren\'t food themselves) ===
  { d: 'A vintage porcelain teapot on a saucer with steam-curl rising', t: ['VESSEL', 'TEA_PARTY', 'CAFE', 'COTTAGECORE'] },
  { d: 'A pastel-painted ceramic cake-stand with a tiny ribbon-bow', t: ['VESSEL', 'TEA_PARTY', 'BAKERY', 'CAFE'] },
  { d: 'A small pastel-pink milk-pitcher with a kawaii face on the side', t: ['VESSEL', 'TEA_PARTY', 'CAFE', 'BREAKFAST'] },
  { d: 'A pastel-mint sugar-bowl with a tiny silver-spoon resting on the lid', t: ['VESSEL', 'TEA_PARTY', 'CAFE'] },
  { d: 'A clear glass-jar of pastel-rainbow candy with a cork-lid', t: ['VESSEL', 'CANDY_FANTASY', 'BAKERY', 'CAFE'] },

  // === WIND DECOR / DRIFTING ===
  { d: 'Cherry-blossom petals drifting through the air in a soft cluster', t: ['WIND_DECOR', 'COTTAGECORE', 'CAFE', 'RAINBOW_DREAMSCAPE', 'FESTIVAL'] },
  { d: 'Floating pastel-bubble-orbs drifting like soap-bubbles through the scene', t: ['WIND_DECOR', 'CANDY_FANTASY', 'CAFE', 'RAINBOW_DREAMSCAPE'] },
  { d: 'Drifting pastel-rainbow confetti scattered through the air', t: ['WIND_DECOR', 'CANDY_FANTASY', 'PICNIC', 'CAFE'] },
  { d: 'Sugar-glitter dust hovering in shafts of warm light', t: ['WIND_DECOR', 'CANDY_FANTASY', 'CAFE', 'BAKERY', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A swirl of pastel-petal-snow falling gently through the scene', t: ['WIND_DECOR', 'COTTAGECORE', 'RAINBOW_DREAMSCAPE'] },

  // === LACE / DOILIES ===
  { d: 'A vintage-lace doily under a serving-plate with floral edging', t: ['LACE', 'TEA_PARTY', 'BAKERY', 'COTTAGECORE'] },
  { d: 'A pastel-pink lace-trimmed napkin folded into a triangle', t: ['LACE', 'TEA_PARTY', 'PICNIC', 'CAFE'] },
  { d: 'A delicate crocheted-doily in cream-white with pastel-floral embroidery', t: ['LACE', 'COTTAGECORE', 'TEA_PARTY'] },

  // === GIFTS / WRAPPED ITEMS ===
  { d: 'A small pastel-wrapped gift-box with a satin-ribbon-bow on top', t: ['GIFT', 'TEA_PARTY', 'CAFE', 'CANDY_FANTASY'] },
  { d: 'A stack of three pastel-striped gift-boxes tied together with twine', t: ['GIFT', 'TEA_PARTY', 'BAKERY', 'CANDY_FANTASY'] },
  { d: 'A small pastel-pink tin-canister with floral printing, lid slightly ajar', t: ['GIFT', 'TEA_PARTY', 'COTTAGECORE', 'BAKERY'] },

  // === FESTIVAL UNIQUE ===
  { d: 'A festival fireworks-burst lighting up the dark sky in pastel-rainbow', t: ['WIND_DECOR', 'FESTIVAL'] },
  { d: 'A festival mask hanging on a stall-post — pastel-colored with cute design', t: ['TINY_OBJECT', 'FESTIVAL', 'MARKET'] },
  { d: 'A row of festival-yukata-pattern paper-fans displayed at a stall', t: ['TINY_OBJECT', 'FESTIVAL', 'MARKET'] },

  // === CANDY-FANTASY UNIQUE ===
  { d: 'A scattering of pastel candy-canes and lollipops stuck in the ground', t: ['TINY_OBJECT', 'CANDY_FANTASY', 'FESTIVAL'] },
  { d: 'A small pile of sugar-cube blocks with pastel-icing decoration', t: ['TINY_OBJECT', 'CANDY_FANTASY', 'BAKERY'] },
  { d: 'A pastel-marshmallow-cluster scattered on the ground like pillows', t: ['TINY_OBJECT', 'CANDY_FANTASY', 'COTTAGECORE'] },

  // === ARCADE UNIQUE ===
  { d: 'A pastel-neon arcade-sign glowing softly in pink and blue', t: ['SIGN', 'ARCADE'] },
  { d: 'A small claw-machine in pastel-colors with plushies inside visible', t: ['TINY_OBJECT', 'ARCADE'] },
  { d: 'A stack of pastel-game-tokens in a small cup', t: ['TINY_OBJECT', 'ARCADE'] },

  // === CAFE UNIQUE ===
  { d: 'A small stack of cute hand-illustrated magazines on a cafe-counter', t: ['TINY_OBJECT', 'CAFE', 'COTTAGECORE'] },
  { d: 'A pastel-painted coffee-bag-of-beans tied with twine on a shelf', t: ['TINY_OBJECT', 'CAFE', 'MARKET'] },
  { d: 'A small succulent in a tiny pastel-painted clay pot', t: ['FLOWER', 'CAFE', 'COTTAGECORE'] },

  // === RAINBOW-DREAMSCAPE UNIQUE ===
  { d: 'A rainbow-arc-ribbon stretched across the air like a hanging decoration', t: ['RIBBON', 'RAINBOW_DREAMSCAPE', 'CANDY_FANTASY'] },
  { d: 'A floating cluster of pastel-rainbow balloons tied with ribbons', t: ['TINY_OBJECT', 'RAINBOW_DREAMSCAPE', 'CANDY_FANTASY', 'PICNIC'] },

  // === BENTO UNIQUE ===
  { d: 'A pair of pastel-pink lacquered chopsticks resting on a tiny chopstick-rest', t: ['TINY_OBJECT', 'BENTO'] },
  { d: 'A folded pastel paper-divider separating bento-box compartments', t: ['TINY_OBJECT', 'BENTO'] },
  { d: 'A tiny bunny-shaped hard-boiled-egg garnish with carved ears and dimpled face', t: ['TINY_OBJECT', 'BENTO'] },
  { d: 'A small pastel-flower silicone-cup separator for bento-compartments', t: ['TINY_OBJECT', 'BENTO'] },

  // === KONBINI UNIQUE ===
  { d: 'A pastel-pink wire shelf row of perfectly-packaged konbini snacks with tiny labels', t: ['TINY_OBJECT', 'KONBINI'] },
  { d: 'A glowing pastel fridge-shelf with neatly-arranged drink-bottles, soft-white-light strip', t: ['TINY_OBJECT', 'KONBINI'] },
  { d: 'A small pastel-yellow konbini price-tag sign hanging from a wire shelf', t: ['SIGN', 'KONBINI'] },
  { d: 'A row of pastel-foil-wrapped onigiri triangles with cute character labels', t: ['TINY_OBJECT', 'KONBINI'] },

  // === MINI_CHEF UNIQUE ===
  { d: 'A tiny pastel-pink chef\'s-hat sitting on a wooden hook', t: ['TINY_OBJECT', 'MINI_CHEF'] },
  { d: 'A small pastel-mint mixing-bowl with a tiny whisk leaning against it', t: ['VESSEL', 'MINI_CHEF'] },
  { d: 'A miniature wooden rolling-pin with pastel-painted handles', t: ['TINY_OBJECT', 'MINI_CHEF'] },
  { d: 'A pastel-floral apron hanging on a wall-hook with a single ribbon-tie', t: ['TINY_OBJECT', 'MINI_CHEF', 'COTTAGECORE'] },

  // === MORE ARCADE ===
  { d: 'A pastel-rainbow ticket-strip curling out of an arcade-machine slot', t: ['TINY_OBJECT', 'ARCADE'] },
  { d: 'A pastel-neon star-sign glowing softly above a snack-counter', t: ['SIGN', 'ARCADE'] },
  { d: 'A pixel-art-pattern checkered floor in pastel-pink and pastel-blue squares', t: ['TINY_OBJECT', 'ARCADE'] },

  // === UNIVERSAL (any path) ===
  { d: 'A drift of soft pastel-glitter dust through the air, catching warm light', t: ['WIND_DECOR', 'UNIVERSAL', 'CAFE', 'BAKERY', 'TEA_PARTY', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A tiny cluster of pastel-pearl-bead orbs scattered like small jewels', t: ['TINY_OBJECT', 'UNIVERSAL', 'TEA_PARTY', 'CANDY_FANTASY'] },
];

const VALID_TYPES = new Set(['LANTERN', 'FLOWER', 'RIBBON', 'FAIRY_LIGHT', 'BUNTING', 'BASKET', 'PLUSH', 'SIGN', 'VESSEL', 'WIND_DECOR', 'LACE', 'GIFT', 'TINY_OBJECT']);
const VALID_WORLDS = new Set(['CAFE', 'KONBINI', 'CANDY_FANTASY', 'FESTIVAL', 'PICNIC', 'BAKERY', 'MARKET', 'TEA_PARTY', 'ARCADE', 'COTTAGECORE', 'BENTO', 'MINI_CHEF', 'RAINBOW_DREAMSCAPE', 'UNIVERSAL', 'BREAKFAST']);

let errors = 0;
DECOR.forEach((c, i) => {
  const types = c.t.filter(t => VALID_TYPES.has(t));
  const worlds = c.t.filter(t => VALID_WORLDS.has(t));
  const unknown = c.t.filter(t => !VALID_TYPES.has(t) && !VALID_WORLDS.has(t));
  if (types.length < 1) { console.error(`#${i+1}: expected 1+ TYPE, got 0: ${c.t.join(',')}`); errors++; }
  if (worlds.length < 1) { console.error(`#${i+1}: expected 1+ WORLD, got 0`); errors++; }
  if (unknown.length) { console.error(`#${i+1}: unknown tags: ${unknown.join(',')}`); errors++; }
});
if (errors) { console.error(`${errors} validation errors. Aborting.`); process.exit(1); }

const out = DECOR.map(c => ({ description: c.d, tags: c.t }));
fs.writeFileSync('scripts/bots/yumbot/seeds/decor_items.json', JSON.stringify(out, null, 2));
console.log(`✓ Wrote ${out.length} entries to scripts/bots/yumbot/seeds/decor_items.json`);
