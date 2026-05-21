#!/usr/bin/env node
/**
 * YumBot FOOD_CATALOG generator — hand-crafted ~100-entry tagged kawaii food
 * catalog. Each entry has a kawaii description + multi-dimensional tags:
 *
 *   CATEGORY:  DESSERT / PASTRY / DRINK / ICE_CREAM / SAVORY / BREAKFAST /
 *              ASIAN_SWEET / CANDY / FAST_FOOD
 *   ORIGIN:    JAPANESE / KOREAN / FRENCH / AMERICAN / CHINESE / ITALIAN /
 *              MEXICAN / TAIWANESE / BRITISH / UNIVERSAL
 *   FORM:      TALL / ROUND / STACKED / ON_STICK / FLAT / BOWL / CONE /
 *              WRAPPED / FOLDED / TRIANGLE / SWIRL / CUP / BAR
 *   WORLD_FIT: CAFE / KONBINI / CANDY_FANTASY / FESTIVAL / PICNIC / BAKERY /
 *              MARKET / TEA_PARTY / ARCADE / COTTAGECORE / BENTO / MINI_CHEF /
 *              RAINBOW_DREAMSCAPE
 *
 * Foods chosen for iconic-pop-culture recognizability (anime + gaming +
 * mainstream cute + fast food). Hand-crafted for deterministic coverage.
 */

const fs = require('fs');

const FOODS = [
  // === KEVIN'S ORIGINAL 30 ===
  { d: 'A smiling kawaii strawberry shortcake slice with whipped-cream face, dimpled blush cheeks, cherry-on-top, and visible sponge layers', t: ['DESSERT', 'AMERICAN', 'STACKED', 'CAFE', 'BAKERY', 'TEA_PARTY', 'PICNIC', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A smiling pastel macaron with closed-arc eyes, dimpled blush cheeks, and soft pastel-cream filling visible between the shells', t: ['DESSERT', 'FRENCH', 'ROUND', 'CAFE', 'BAKERY', 'TEA_PARTY', 'PICNIC', 'MARKET'] },
  { d: 'A smiling glazed donut with sprinkle-eyes, blush cheeks, pastel icing-drips, and a perfect round hole in the center', t: ['DESSERT', 'AMERICAN', 'ROUND', 'CAFE', 'BAKERY', 'KONBINI', 'CANDY_FANTASY', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A smiling pastel mochi-donut with closed-arc eyes, chewy chain-link shape, and pastel-glaze coating', t: ['DESSERT', 'ASIAN_SWEET', 'JAPANESE', 'ROUND', 'CAFE', 'KONBINI', 'MARKET'] },
  { d: 'A smiling folded crepe with whipped-cream face, strawberry-on-top, and pastel sauce-drizzle, wrapped in paper-cone', t: ['DESSERT', 'FRENCH', 'FOLDED', 'CAFE', 'FESTIVAL', 'MARKET', 'BAKERY'] },
  { d: 'A tall smiling soufflé pancake stack with kawaii face on the top fluffy layer, syrup-drip, and a single cherry-topper', t: ['DESSERT', 'BREAKFAST', 'JAPANESE', 'STACKED', 'CAFE', 'BAKERY', 'MINI_CHEF'] },
  { d: 'A smiling Belgian waffle with kawaii face in the grid-pattern, whipped-cream cloud-topping, and pastel berry-cluster', t: ['DESSERT', 'BREAKFAST', 'AMERICAN', 'FLAT', 'CAFE', 'BAKERY', 'PICNIC'] },
  { d: 'A smiling pastel cupcake with cream-swirl-face, blush-cheeks, rainbow sprinkles, and pearl-bead toppers', t: ['DESSERT', 'AMERICAN', 'ROUND', 'CAFE', 'BAKERY', 'TEA_PARTY', 'CANDY_FANTASY', 'PICNIC', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A smiling slice of pastel cheesecake with cherry-topper-face, graham-crust-base, and cream-blush cheeks', t: ['DESSERT', 'AMERICAN', 'ROUND', 'CAFE', 'BAKERY', 'TEA_PARTY', 'PICNIC'] },
  { d: 'A smiling cinnamon roll with icing-swirl-face, golden-spiral pastry layers, and warm-amber glaze cascading down', t: ['PASTRY', 'AMERICAN', 'SWIRL', 'CAFE', 'BAKERY', 'BREAKFAST', 'COTTAGECORE'] },
  { d: 'A smiling pastel sugar-cookie with chocolate-chip-eyes, dimpled-blush, and heart-shaped silhouette', t: ['DESSERT', 'AMERICAN', 'ROUND', 'CAFE', 'BAKERY', 'COTTAGECORE', 'KONBINI', 'CANDY_FANTASY'] },
  { d: 'A smiling cream puff with whipped-cream-face poking out the choux pastry top, pastel-glaze drip, blush cheeks', t: ['DESSERT', 'FRENCH', 'ROUND', 'CAFE', 'BAKERY', 'TEA_PARTY', 'MARKET'] },
  { d: 'A smiling pastel mochi-ball trio in pink, mint, and yellow — each with closed-arc eyes and dimpled-cheek blush', t: ['DESSERT', 'JAPANESE', 'ASIAN_SWEET', 'ROUND', 'FESTIVAL', 'KONBINI', 'MARKET', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A smiling dango skewer with three pastel mochi-balls in pink, white, green — each with its own kawaii face on the stick', t: ['DESSERT', 'JAPANESE', 'ASIAN_SWEET', 'ON_STICK', 'FESTIVAL', 'KONBINI', 'MARKET'] },
  { d: 'A smiling taiyaki fish-shaped pastry with kawaii face on the side, golden-crispy crust, and red-bean-paste filling peeking out', t: ['DESSERT', 'JAPANESE', 'ASIAN_SWEET', 'FOLDED', 'FESTIVAL', 'KONBINI', 'MARKET'] },
  { d: 'A tall pastel parfait glass with smiling-face on the side, layered cream + fruit + cake-cubes, and a tiny umbrella-topper', t: ['DESSERT', 'UNIVERSAL', 'TALL', 'CAFE', 'BAKERY', 'KONBINI', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A tall ice-cream sundae glass with kawaii face, three pastel scoops, drizzling syrup, cherry-on-top, and rainbow sprinkles', t: ['ICE_CREAM', 'AMERICAN', 'TALL', 'CAFE', 'ARCADE', 'CANDY_FANTASY', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A smiling soft-serve ice-cream swirl in a waffle-cone, kawaii face on the cream, pastel rainbow stripe twisting up', t: ['ICE_CREAM', 'AMERICAN', 'CONE', 'ARCADE', 'MARKET', 'FESTIVAL', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A smiling pastel popsicle on a wooden stick with closed-arc eyes, blush-cheeks, dripping-syrup gloss', t: ['ICE_CREAM', 'UNIVERSAL', 'ON_STICK', 'KONBINI', 'ARCADE', 'FESTIVAL', 'MARKET'] },
  { d: 'A smiling golden croissant with flaky-layer-face, dimpled-blush, crescent-shape and buttery sheen', t: ['PASTRY', 'FRENCH', 'FOLDED', 'CAFE', 'BAKERY', 'MARKET', 'COTTAGECORE'] },
  { d: 'A smiling fruit tart with kawaii face in the cream-filling, glazed strawberries + kiwi + blueberries arranged on top', t: ['DESSERT', 'FRENCH', 'ROUND', 'CAFE', 'BAKERY', 'TEA_PARTY', 'MARKET', 'COTTAGECORE'] },
  { d: 'A smiling chocolate-covered strawberry with kawaii face on the chocolate-shell, leafy-green-hat, and dipping-drips visible', t: ['DESSERT', 'AMERICAN', 'ROUND', 'CANDY_FANTASY', 'TEA_PARTY', 'MARKET'] },
  { d: 'A smiling chocolate brownie square with chocolate-chip-eyes, dimpled-blush, crackly-fudge-top texture', t: ['DESSERT', 'AMERICAN', 'FLAT', 'CAFE', 'BAKERY', 'KONBINI', 'COTTAGECORE'] },
  { d: 'A smiling pastel pudding-cup with caramel-drip face, dimpled-blush, jiggle-shape, and tiny mint-leaf garnish', t: ['DESSERT', 'UNIVERSAL', 'ROUND', 'KONBINI', 'CAFE', 'COTTAGECORE'] },
  { d: 'A smiling churro with kawaii face on the sugar-coated dough, cinnamon-dust eyebrows, and one curl in the rope', t: ['DESSERT', 'MEXICAN', 'ON_STICK', 'FESTIVAL', 'MARKET', 'ARCADE'] },
  { d: 'A smiling mini-cake with cream-frosting-face, single candle on top, blush-cheeks, and pastel-rosette decorations', t: ['DESSERT', 'UNIVERSAL', 'ROUND', 'CAFE', 'BAKERY', 'TEA_PARTY'] },
  { d: 'A smiling pocky-stick with kawaii face on the chocolate-dipped end, slim biscuit-body, pastel-glaze coating', t: ['CANDY', 'JAPANESE', 'ON_STICK', 'KONBINI', 'CANDY_FANTASY', 'ARCADE'] },
  { d: 'A smiling cotton-candy puff on a paper-stick with closed-arc eyes, pastel pink-blue swirl-cloud, and dimpled-blush', t: ['CANDY', 'UNIVERSAL', 'ON_STICK', 'FESTIVAL', 'CANDY_FANTASY', 'ARCADE'] },
  { d: 'A smiling pastel gummy-bear cluster with kawaii faces, soft jelly translucency, and pastel rainbow colors', t: ['CANDY', 'UNIVERSAL', 'ROUND', 'KONBINI', 'CANDY_FANTASY', 'ARCADE'] },
  { d: 'A smiling Japanese fruit sandwich (fruit sando) with kawaii face on the bread, whipped-cream + strawberry + kiwi visible', t: ['DESSERT', 'JAPANESE', 'ASIAN_SWEET', 'FLAT', 'KONBINI', 'CAFE', 'PICNIC'] },

  // === KEVIN'S SECOND 20 ===
  { d: 'A smiling egg-tart with golden custard-face, flaky-pastry-shell, and a small caramelized-top spot for a freckle', t: ['DESSERT', 'CHINESE', 'ROUND', 'BAKERY', 'MARKET', 'CAFE'] },
  { d: 'A smiling banana-pudding bowl with kawaii face on the cream, vanilla-wafer-eyes, and sliced-banana decorations', t: ['DESSERT', 'AMERICAN', 'BOWL', 'CAFE', 'BAKERY', 'PICNIC'] },
  { d: 'A smiling mille-feuille pastry with kawaii face on the cream-layer, alternating crisp pastry-and-cream stripes', t: ['DESSERT', 'FRENCH', 'STACKED', 'CAFE', 'BAKERY', 'TEA_PARTY'] },
  { d: 'A smiling chocolate eclair with kawaii face on the chocolate-glaze top, oblong choux shape, cream-filling-glimpse', t: ['PASTRY', 'FRENCH', 'FOLDED', 'CAFE', 'BAKERY', 'TEA_PARTY', 'MARKET'] },
  { d: 'A smiling pastel scone with kawaii face on the cracked-top, dimpled-blush, jam-drip-mustache and clotted-cream-tuft', t: ['PASTRY', 'BRITISH', 'ROUND', 'CAFE', 'BAKERY', 'TEA_PARTY', 'PICNIC', 'COTTAGECORE'] },
  { d: 'A tall smiling honey-toast tower with kawaii face on the front, cube-cut bread, honey-drizzle cascade, and ice-cream-scoop-topper', t: ['DESSERT', 'JAPANESE', 'STACKED', 'CAFE', 'COTTAGECORE'] },
  { d: 'A smiling kakigori shaved-ice bowl with kawaii face on the side, mountainous-fluffy-ice, rainbow-syrup-drizzle, and mochi-balls on top', t: ['ICE_CREAM', 'JAPANESE', 'BOWL', 'FESTIVAL', 'KONBINI'] },
  { d: 'A smiling bingsu bowl with kawaii face on the side, mountain of shaved-milk-ice, condensed-milk-drizzle, and fruit-cluster topping', t: ['ICE_CREAM', 'KOREAN', 'BOWL', 'CAFE', 'MARKET'] },
  { d: 'A smiling pastel jelly-cup with kawaii face wobbling in the gel, fruit-suspension inside, and pastel-rainbow gradient', t: ['DESSERT', 'UNIVERSAL', 'CUP', 'KONBINI', 'ARCADE', 'CANDY_FANTASY'] },
  { d: 'A smiling yogurt-parfait bowl with kawaii face on the cream, layered granola + berries + honey-drip', t: ['BREAKFAST', 'UNIVERSAL', 'BOWL', 'CAFE', 'BAKERY', 'PICNIC'] },
  { d: 'A smiling stack of mini-pancakes with kawaii face on the top one, butter-pat-hat, and maple-syrup cascade', t: ['BREAKFAST', 'AMERICAN', 'STACKED', 'CAFE', 'MARKET', 'COTTAGECORE'] },
  { d: 'A smiling pastel cake-pop on a stick with kawaii face, sprinkle-coating, and ribbon-bow tied around the stick', t: ['DESSERT', 'AMERICAN', 'ON_STICK', 'BAKERY', 'CAFE', 'TEA_PARTY', 'CANDY_FANTASY'] },
  { d: 'A smiling pastel marshmallow puff with kawaii face on the rounded-top, dimpled-blush, and sugar-crystal-sparkle dust', t: ['CANDY', 'UNIVERSAL', 'ROUND', 'CANDY_FANTASY', 'ARCADE', 'COTTAGECORE'] },
  { d: 'A smiling choco-cornet pastry with kawaii face on the cream-filled tip, golden-spiral cone-shape, chocolate-glaze coating', t: ['PASTRY', 'JAPANESE', 'ASIAN_SWEET', 'CONE', 'BAKERY', 'KONBINI'] },
  { d: 'A smiling melon-pan bun with kawaii face on the criss-cross top, golden-sugar crust, dimpled-blush, and round soft body', t: ['PASTRY', 'JAPANESE', 'ASIAN_SWEET', 'ROUND', 'KONBINI', 'BAKERY', 'MARKET'] },
  { d: 'A smiling onigiri rice-ball with kawaii face on the side, perfect triangle-shape, and a strip of nori-seaweed belt', t: ['SAVORY', 'JAPANESE', 'TRIANGLE', 'KONBINI', 'BENTO', 'FESTIVAL'] },
  { d: 'A smiling ramen-bowl with kawaii face on the side, floating soft-boiled-egg-companion with face, noodle-curl, scallion-bits', t: ['SAVORY', 'JAPANESE', 'BOWL', 'KONBINI', 'FESTIVAL', 'MINI_CHEF'] },
  { d: 'A smiling sushi-roll with kawaii face on the rice-side, avocado-and-cucumber spiral filling, and nori-seaweed wrap', t: ['SAVORY', 'JAPANESE', 'ROUND', 'BENTO', 'FESTIVAL', 'MINI_CHEF'] },
  { d: 'A smiling cluster of three fried-chicken nuggets, each with kawaii face on the golden-crispy coating', t: ['SAVORY', 'FAST_FOOD', 'AMERICAN', 'ROUND', 'ARCADE', 'FESTIVAL'] },
  { d: 'A smiling cluster of pastel french-fries with kawaii faces on each fry, golden-crispy texture, and tiny salt-sparkles', t: ['SAVORY', 'FAST_FOOD', 'AMERICAN', 'ON_STICK', 'ARCADE', 'FESTIVAL'] },

  // === FAST FOOD EXPANSION ===
  { d: 'A smiling kawaii hamburger with sesame-seed-eyes on the bun, lettuce-tongue, tomato-blush-cheeks, and stacked patties visible', t: ['SAVORY', 'FAST_FOOD', 'AMERICAN', 'STACKED', 'ARCADE'] },
  { d: 'A smiling cheeseburger with melted-cheese-drip eyes, sesame-seed eyebrows, dimpled-blush, and a tiny pickle-mouth', t: ['SAVORY', 'FAST_FOOD', 'AMERICAN', 'STACKED', 'ARCADE'] },
  { d: 'A smiling hot dog in a soft bun with kawaii face on the sausage, mustard-zigzag, ketchup-blush cheeks', t: ['SAVORY', 'FAST_FOOD', 'AMERICAN', 'WRAPPED', 'ARCADE', 'FESTIVAL'] },
  { d: 'A smiling slice of pizza with kawaii face on the cheese, pepperoni-eyes, basil-tuft hair, and a single olive-mouth', t: ['SAVORY', 'FAST_FOOD', 'ITALIAN', 'TRIANGLE', 'ARCADE'] },
  { d: 'A smiling stack of golden onion-rings, each ring with its own kawaii face, dimpled-blush, crispy-coating texture', t: ['SAVORY', 'FAST_FOOD', 'AMERICAN', 'ROUND', 'ARCADE'] },
  { d: 'A smiling soft pretzel with kawaii face in the twist, sea-salt-eyebrows, and golden-brown braided body', t: ['PASTRY', 'AMERICAN', 'WRAPPED', 'ARCADE', 'FESTIVAL', 'MARKET'] },
  { d: 'A smiling corn dog on a wooden stick with kawaii face on the golden-batter coating, mustard-zigzag, and ketchup-cheek', t: ['SAVORY', 'FAST_FOOD', 'AMERICAN', 'ON_STICK', 'FESTIVAL', 'ARCADE'] },
  { d: 'A smiling mac-and-cheese cup with kawaii face on the cup, cheese-bubble eyes, golden-cheddar swirl, and pasta-curls visible', t: ['SAVORY', 'FAST_FOOD', 'AMERICAN', 'CUP', 'KONBINI'] },
  { d: 'A smiling bagel with kawaii face on the side, sesame-seed sprinkles, cream-cheese-blush, and a perfect ring-shape', t: ['PASTRY', 'AMERICAN', 'ROUND', 'BAKERY', 'CAFE', 'BREAKFAST'] },
  { d: 'A smiling PB&J sandwich with kawaii face on the bread, jam-drip mustache, peanut-butter-blush cheeks, and corner-bite missing', t: ['SAVORY', 'AMERICAN', 'FLAT', 'PICNIC', 'BENTO', 'COTTAGECORE'] },
  { d: 'A smiling kawaii taco with kawaii face on the shell, lettuce-tuft hair, tomato-blush, and folded crispy-shell wrap', t: ['SAVORY', 'MEXICAN', 'FAST_FOOD', 'FOLDED', 'MARKET'] },
  { d: 'A smiling burrito with kawaii face on the tortilla wrap, salsa-blush cheeks, and tightly-rolled cylinder shape', t: ['SAVORY', 'MEXICAN', 'WRAPPED', 'MARKET', 'ARCADE'] },
  { d: 'A smiling tall soda-cup with kawaii face on the side, straw poking out, ice-cubes visible inside, and pastel-fizz bubbles', t: ['DRINK', 'FAST_FOOD', 'AMERICAN', 'TALL', 'ARCADE', 'KONBINI'] },
  { d: 'A smiling pretzel-bite cluster with kawaii faces on each bite, dimpled-blush, golden-twist shapes, and salt-crystal sparkles', t: ['PASTRY', 'FAST_FOOD', 'AMERICAN', 'ROUND', 'ARCADE', 'FESTIVAL'] },

  // === DRINKS BROADER ===
  { d: 'A tall smiling boba milk-tea cup with kawaii face on the side, paper-straw, visible pastel-pearls at the bottom', t: ['DRINK', 'TAIWANESE', 'ASIAN_SWEET', 'TALL', 'CAFE', 'KONBINI', 'ARCADE', 'RAINBOW_DREAMSCAPE'] },
  { d: 'A tall smiling matcha-latte glass with kawaii face on the side, foam-art-heart on top, and vibrant green-and-cream gradient', t: ['DRINK', 'JAPANESE', 'ASIAN_SWEET', 'TALL', 'CAFE', 'TEA_PARTY'] },
  { d: 'A smiling hot-cocoa mug with kawaii face on the ceramic, frothy whipped-cream cloud-top with marshmallows, and steam-curl', t: ['DRINK', 'AMERICAN', 'BOWL', 'CAFE', 'COTTAGECORE', 'KONBINI'] },
  { d: 'A tall smiling iced-coffee glass with kawaii face on the side, paper-straw, ice-cubes, and cream-swirl floating top', t: ['DRINK', 'AMERICAN', 'TALL', 'CAFE', 'KONBINI', 'ARCADE'] },
  { d: 'A tall smiling smoothie cup with kawaii face on the side, pastel pink-or-mint smoothie, fruit-skewer-topper, and tiny umbrella', t: ['DRINK', 'UNIVERSAL', 'TALL', 'CAFE', 'MARKET', 'PICNIC'] },
  { d: 'A tall smiling lemonade glass with kawaii face on the side, lemon-slice-floating, mint-sprig-eyebrow, and ice-cubes', t: ['DRINK', 'AMERICAN', 'TALL', 'MARKET', 'PICNIC', 'FESTIVAL'] },
  { d: 'A small smiling espresso cup with kawaii face on the porcelain, dark-coffee crema-top, and tiny saucer with biscotti', t: ['DRINK', 'ITALIAN', 'CUP', 'CAFE'] },
  { d: 'A smiling cappuccino cup with kawaii face on the side, latte-art heart on the foam, and a tiny chocolate-cube on saucer', t: ['DRINK', 'ITALIAN', 'CUP', 'CAFE', 'TEA_PARTY'] },
  { d: 'A tall smiling taro-bubble-tea cup with kawaii face on the side, pastel-purple drink, large pearls visible, and paper-straw', t: ['DRINK', 'TAIWANESE', 'ASIAN_SWEET', 'TALL', 'CAFE', 'KONBINI'] },
  { d: 'A tall smiling strawberry-milk glass with kawaii face on the side, pink-cream blend, paper-straw, and strawberry-slice-on-rim', t: ['DRINK', 'UNIVERSAL', 'TALL', 'CAFE', 'KONBINI', 'PICNIC'] },

  // === INTERNATIONAL EXTRAS ===
  { d: 'A smiling crème brûlée ramekin with kawaii face on the caramelized-top, cracked-sugar shell, and tiny berry-garnish', t: ['DESSERT', 'FRENCH', 'BOWL', 'CAFE', 'BAKERY', 'TEA_PARTY'] },
  { d: 'A smiling tiramisu square with kawaii face on the cocoa-dusted-top, mascarpone-cream layers, and ladyfinger-edges visible', t: ['DESSERT', 'ITALIAN', 'STACKED', 'CAFE', 'BAKERY', 'MARKET'] },
  { d: 'A tall smiling macaron tower with kawaii face on the top macaron, pastel-rainbow-stacked tier of macarons, and ribbon-bow', t: ['DESSERT', 'FRENCH', 'STACKED', 'TEA_PARTY', 'BAKERY', 'MARKET'] },
  { d: 'A smiling bao-bun with kawaii face on the white pillowy dough, dimpled-blush, and folded pleats at the top', t: ['SAVORY', 'CHINESE', 'ROUND', 'MARKET', 'MINI_CHEF', 'BENTO'] },
  { d: 'A smiling spring-roll with kawaii face on the golden-crispy wrap, dimpled-blush, and vegetable-fill visible at the ends', t: ['SAVORY', 'CHINESE', 'WRAPPED', 'MARKET', 'FESTIVAL'] },
  { d: 'A smiling Korean-fried-chicken-piece with kawaii face on the spicy-glaze, sesame-seed sprinkles, and crispy texture', t: ['SAVORY', 'KOREAN', 'FAST_FOOD', 'ROUND', 'MARKET'] },
  { d: 'A smiling hotteok pancake with kawaii face on the golden-pan-fried side, brown-sugar-drip cheeks, and crispy-edges', t: ['DESSERT', 'KOREAN', 'ROUND', 'FESTIVAL', 'MARKET'] },
  { d: 'A smiling kimbap roll with kawaii face on the nori-wrap side, colorful-vegetable-spiral filling, and sliced-round shape', t: ['SAVORY', 'KOREAN', 'ROUND', 'BENTO', 'KONBINI'] },
  { d: 'A smiling tteokbokki skewer with kawaii faces on the rice-cake-cylinders, spicy-red-pepper sauce coating, and sesame-sprinkle', t: ['SAVORY', 'KOREAN', 'ON_STICK', 'FESTIVAL', 'MARKET'] },

  // === JAPANESE EXTRAS ===
  { d: 'A smiling dorayaki with kawaii face on the pancake-top, golden-spongy texture, and red-bean paste oozing between the discs', t: ['DESSERT', 'JAPANESE', 'ASIAN_SWEET', 'ROUND', 'KONBINI', 'FESTIVAL', 'MARKET'] },
  { d: 'A smiling strawberry-daifuku with kawaii face on the mochi-skin, whole strawberry visible inside, and pastel-pink mochi-wrap', t: ['DESSERT', 'JAPANESE', 'ASIAN_SWEET', 'ROUND', 'MARKET', 'FESTIVAL'] },
  { d: 'A smiling castella cake slice with kawaii face on the golden-spongy-top, layered-slice profile, and honey-drip', t: ['DESSERT', 'JAPANESE', 'ASIAN_SWEET', 'STACKED', 'BAKERY', 'MARKET'] },
  { d: 'A smiling anpan bun with kawaii face on the golden-domed top, sesame-seed sprinkle, and red-bean-paste filling glimpse', t: ['PASTRY', 'JAPANESE', 'ASIAN_SWEET', 'ROUND', 'BAKERY', 'KONBINI'] },
  { d: 'A smiling matcha-roll-cake slice with kawaii face on the swirled-cream-spiral, vibrant green outer-sponge, and pastel-pink center', t: ['DESSERT', 'JAPANESE', 'ASIAN_SWEET', 'SWIRL', 'BAKERY', 'CAFE', 'TEA_PARTY'] },
  { d: 'A smiling takoyaki ball on a toothpick with kawaii face on the dough-ball, bonito-flakes hair waving, and savory-sauce-drizzle', t: ['SAVORY', 'JAPANESE', 'FAST_FOOD', 'ROUND', 'FESTIVAL', 'MARKET'] },
  { d: 'A smiling yakisoba noodle plate with kawaii face on the side, twirled noodle-curl, pickled-ginger-tuft, and cabbage-bits visible', t: ['SAVORY', 'JAPANESE', 'FAST_FOOD', 'BOWL', 'FESTIVAL', 'MARKET'] },
  { d: 'A smiling tamagoyaki roll with kawaii face on the layered-egg-side, golden-yellow color, and ribbon-roll shape', t: ['SAVORY', 'JAPANESE', 'FOLDED', 'BENTO', 'BREAKFAST'] },
  { d: 'A smiling bento-box with kawaii face on the lid, sectioned compartments visible — rice + tamago + sausage + veggies', t: ['SAVORY', 'JAPANESE', 'FLAT', 'BENTO'] },
  { d: 'A smiling candy-apple on a stick with kawaii face on the glossy-red-shell, leafy-green-cap, and shiny pastel coating', t: ['CANDY', 'AMERICAN', 'ON_STICK', 'FESTIVAL', 'CANDY_FANTASY'] },

  // === ADDITIONAL CUTE ===
  { d: 'A smiling petit-four with kawaii face on the icing-top, perfectly-square-cake, pastel-floral piped-decorations', t: ['DESSERT', 'FRENCH', 'ROUND', 'TEA_PARTY', 'BAKERY'] },
  { d: 'A smiling pavlova with kawaii face on the meringue-shell, whipped-cream-cloud, and fresh-berry-cluster topping', t: ['DESSERT', 'UNIVERSAL', 'ROUND', 'CAFE', 'TEA_PARTY'] },
  { d: 'A smiling caramel-popcorn-pile with kawaii faces on the individual kernels, golden-glaze coating, and a paper-cone holder', t: ['CANDY', 'AMERICAN', 'CONE', 'ARCADE', 'FESTIVAL'] },
  { d: 'A smiling lollipop on a paper-stick with kawaii face on the spiral-pastel-disk, ribbon-bow tied to the stick', t: ['CANDY', 'AMERICAN', 'ON_STICK', 'CANDY_FANTASY', 'ARCADE', 'FESTIVAL'] },
  { d: 'A smiling cluster of pastel donut-holes with kawaii faces on each ball, dimpled-blush, and sugar-glaze coating', t: ['DESSERT', 'AMERICAN', 'ROUND', 'CAFE', 'BAKERY', 'KONBINI'] },
  { d: 'A smiling fluffy pancake-stack with kawaii face on the top one, syrup-cascade, butter-pat-hat, and berry-cluster topper', t: ['BREAKFAST', 'AMERICAN', 'STACKED', 'CAFE', 'COTTAGECORE'] },
  { d: 'A smiling tres-leches cake slice with kawaii face on the cream-soaked-top, layered-sponge profile, and cinnamon-dust sprinkles', t: ['DESSERT', 'MEXICAN', 'STACKED', 'BAKERY', 'MARKET'] },
  { d: 'A smiling fortune-cookie with kawaii face on the folded-arc, golden crispy-shell, and tiny paper-fortune peeking out', t: ['DESSERT', 'CHINESE', 'FOLDED', 'KONBINI', 'MARKET'] },
  { d: 'A smiling milkshake glass with kawaii face on the side, whipped-cream-cloud topping, cherry-on-top, paper-straw, and rainbow sprinkles', t: ['DRINK', 'AMERICAN', 'TALL', 'CAFE', 'ARCADE', 'RAINBOW_DREAMSCAPE'] },

  // === EXTRAS FOR VARIETY ===
  { d: 'A smiling chocolate-chip-cookie with kawaii face on the golden-baked surface, chocolate-chip eyes, and a missing crescent-bite', t: ['DESSERT', 'AMERICAN', 'ROUND', 'CAFE', 'BAKERY', 'COTTAGECORE', 'KONBINI'] },
  { d: 'A smiling pastel macaron-trio stacked with kawaii faces, three different pastel colors, and a ribbon tied around them', t: ['DESSERT', 'FRENCH', 'STACKED', 'TEA_PARTY', 'BAKERY', 'MARKET'] },
  { d: 'A smiling chocolate-glazed donut-with-sprinkles with kawaii face, rainbow-sprinkle eyebrows, and chocolate-drip cheeks', t: ['DESSERT', 'AMERICAN', 'ROUND', 'CAFE', 'BAKERY', 'KONBINI', 'CANDY_FANTASY'] },
  { d: 'A smiling pastel-pink cupcake with rosette-frosting face, pearl-bead crown, blush-cheeks, and sprinkle confetti', t: ['DESSERT', 'AMERICAN', 'ROUND', 'CAFE', 'BAKERY', 'TEA_PARTY', 'CANDY_FANTASY'] },
  { d: 'A smiling strawberry-cake-slice with kawaii face on the strawberry-cream, layered-pink-sponge, and whole-strawberry topper', t: ['DESSERT', 'AMERICAN', 'STACKED', 'CAFE', 'BAKERY', 'TEA_PARTY', 'PICNIC'] },
  { d: 'A smiling cluster of chocolate-truffles with kawaii faces, cocoa-dust coating, and pastel-paper-cups around each', t: ['CANDY', 'FRENCH', 'ROUND', 'TEA_PARTY', 'CANDY_FANTASY'] },
  { d: 'A smiling pastel-rainbow-cake slice with kawaii face on the side, layered rainbow-pastel sponge, and cream-rosette top', t: ['DESSERT', 'AMERICAN', 'STACKED', 'CAFE', 'BAKERY', 'CANDY_FANTASY', 'TEA_PARTY'] },
  { d: 'A smiling pretzel with kawaii face on the twist, sea-salt eyebrows, mustard-dip-mustache, and golden-brown braid', t: ['PASTRY', 'AMERICAN', 'WRAPPED', 'ARCADE', 'FESTIVAL'] },
  { d: 'A smiling box of small chocolate-bonbons with kawaii faces, lavender-pearl-base, gold-foil-wraps, and pastel-rainbow-cocoa hues', t: ['CANDY', 'FRENCH', 'ROUND', 'TEA_PARTY', 'CANDY_FANTASY'] },
  { d: 'A smiling kawaii fruit-cup with kawaii face on the cup, watermelon-cube + cantaloupe-ball + strawberry-half scatter inside', t: ['DESSERT', 'UNIVERSAL', 'CUP', 'PICNIC', 'MARKET', 'BREAKFAST'] },
  { d: 'A smiling stack of three little waffles with kawaii face on the top, butter-pat hat, fresh-berry crown, and syrup-cascade', t: ['BREAKFAST', 'AMERICAN', 'STACKED', 'CAFE', 'COTTAGECORE'] },
  { d: 'A smiling pastel-creamsicle popsicle on a stick with kawaii face, orange-and-cream-swirl, dimpled-blush, drip-glaze', t: ['ICE_CREAM', 'AMERICAN', 'ON_STICK', 'KONBINI', 'FESTIVAL', 'ARCADE'] },
  { d: 'A smiling kawaii-omurice plate with kawaii face on the egg-omelette-wrap, ketchup-zigzag drawn as a heart, and rice-base visible', t: ['SAVORY', 'JAPANESE', 'FOLDED', 'BENTO', 'MINI_CHEF'] },
  { d: 'A smiling fluffy-pancake with kawaii face on the cream-swirl topper, jelly-blob cheeks, and a tiny ribbon-bow on the side', t: ['BREAKFAST', 'JAPANESE', 'STACKED', 'CAFE', 'COTTAGECORE'] },
];

const VALID_CATEGORIES = new Set(['DESSERT', 'PASTRY', 'DRINK', 'ICE_CREAM', 'SAVORY', 'BREAKFAST', 'ASIAN_SWEET', 'CANDY', 'FAST_FOOD']);
const VALID_ORIGINS = new Set(['JAPANESE', 'KOREAN', 'FRENCH', 'AMERICAN', 'CHINESE', 'ITALIAN', 'MEXICAN', 'UNIVERSAL', 'TAIWANESE', 'BRITISH']);
const VALID_FORMS = new Set(['TALL', 'ROUND', 'STACKED', 'ON_STICK', 'FLAT', 'BOWL', 'CONE', 'WRAPPED', 'FOLDED', 'TRIANGLE', 'SWIRL', 'CUP', 'BAR']);
const VALID_WORLDS = new Set(['CAFE', 'KONBINI', 'CANDY_FANTASY', 'FESTIVAL', 'PICNIC', 'BAKERY', 'MARKET', 'TEA_PARTY', 'ARCADE', 'COTTAGECORE', 'BENTO', 'MINI_CHEF', 'RAINBOW_DREAMSCAPE']);

// Validate every entry has at least 1 of each dimension (categories overlap —
// e.g., a mochi is both DESSERT and ASIAN_SWEET; french-fries are both SAVORY
// and FAST_FOOD — both tags legitimately apply)
let errors = 0;
FOODS.forEach((f, i) => {
  const tags = f.t;
  const cats = tags.filter(t => VALID_CATEGORIES.has(t));
  const origins = tags.filter(t => VALID_ORIGINS.has(t));
  const forms = tags.filter(t => VALID_FORMS.has(t));
  const worlds = tags.filter(t => VALID_WORLDS.has(t));
  const unknown = tags.filter(t => !VALID_CATEGORIES.has(t) && !VALID_ORIGINS.has(t) && !VALID_FORMS.has(t) && !VALID_WORLDS.has(t));
  if (cats.length < 1) { console.error(`#${i+1}: expected 1+ CATEGORY, got 0`); errors++; }
  if (origins.length !== 1) { console.error(`#${i+1}: expected 1 ORIGIN, got ${origins.length}: ${origins.join(',')}`); errors++; }
  if (forms.length < 1) { console.error(`#${i+1}: expected 1+ FORM, got 0`); errors++; }
  if (worlds.length < 1) { console.error(`#${i+1}: expected 1+ WORLD_FIT, got 0`); errors++; }
  if (unknown.length) { console.error(`#${i+1}: unknown tags: ${unknown.join(',')}`); errors++; }
});
if (errors) { console.error(`${errors} validation errors. Aborting.`); process.exit(1); }

const out = FOODS.map(f => ({ description: f.d, tags: f.t }));
fs.writeFileSync('scripts/bots/yumbot/seeds/food_catalog.json', JSON.stringify(out, null, 2));
console.log(`✓ Wrote ${out.length} entries to scripts/bots/yumbot/seeds/food_catalog.json`);
