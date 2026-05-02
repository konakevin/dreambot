#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/plush_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} PLUSH-WORLD scene descriptions for ToyBot's plush-world path. Soft-fabric stuffed-animal characters on cozy adventures — teddy bears, plush bunnies, stuffed foxes, knitted cats, stitched dragons, fabric owls. Storybook warmth + emotional tenderness + handcrafted detail. NOT Sackboy LBP-burlap-and-zipper aesthetic — this is huggable plush-fur and knit-texture.

Each entry: 18-28 words. ONE specific scene with stuffed-animal character(s) mid-cozy-adventure in a fully-dressed handcrafted miniature set.

━━━ THE CHARACTERS ━━━
Soft-fabric stuffed animals: teddy-bear (brown / white / pastel), plush-bunny (long floppy ears, knit body), stuffed-fox (orange-and-white fluff), knitted-cat (yarn-textured body), stitched-dragon (scaled-fabric, button eyes), fabric-owl (round body, sewn-on wings), felt-duck (yellow + felt beak), cuddly-raccoon (grey-and-black stripes), plush-elephant (grey wool with floppy trunk), stuffed-deer (cream + felt antlers), plush-mouse (grey + pink-felt-ears), knitted-hedgehog (textured-yarn quills). Visible plush-fiber FUR or KNIT TEXTURE on body, embroidered or button eyes, stitched mouth, sewn-on muzzle, soft floppy limbs, fiberfill pudgy bodies. Optional tiny knit sweaters, cloth bandanas, felt scarves, mini hats. Active poses, body-language driven (toasting marshmallow, hoisting sail, peeking, hugging) — no passive sitting.

━━━ THE WORLDS (handcrafted miniature sets) ━━━
Forest campsite (mini tent, tiny lantern, twig-firepit, marshmallow-stick), sailboat at sea (felt-water, mini ship-wheel, wooden mast, sail-canvas), picnic meadow (knit-blanket, miniature wicker-basket, tiny tea-set), attic bedroom (mini wooden-bed, sewn-pillow, fairy-lights, tiny window), treehouse (rope-ladder, wooden-platform, leafy-canopy, scale-rope-bridge), tea garden (miniature trellis, tiny teapot, scale tea-table), snow fort (cotton-snow walls, sewn-flag, snowball-pile), library nook (miniature bookshelf, fabric reading-chair, scale-books), garden plot (felt-flowers, mini watering-can, scale-trellis), beach cove (felt-sand, tiny shell-pile, miniature sandcastle), mountain ridge (lichen-evergreens, plush-snow, scale signpost).

━━━ SCENE CATEGORIES (rotate, don't cluster) ━━━
- Teddy-camp around tiny firepit — three teddies on knit-blankets toasting felt-marshmallows on twig-sticks, lantern-glow
- Plush-bunny pirate-ship adventure — knit-bunny gripping wooden-ship-wheel mid-storm, felt-waves crashing
- Stuffed-fox treehouse lookout — orange-fluff fox peering through telescope from rope-ladder treehouse, sunset behind
- Knitted-cat tea-party — yarn-cat pouring miniature teapot into tiny cup, felt-petals scattered on knit-blanket
- Stitched-dragon castle siege — scaled-fabric dragon mid-leap toward sewn-flag castle, fabric-flame breath
- Fabric-owl reading-loft — round-body owl perched on miniature bookshelf with tiny scale-book between paws
- Felt-duck pond expedition — yellow-felt duck mid-paddle on felt-water with knit-lily-pad, mini fishing-rod
- Cuddly-raccoon midnight-snack — grey-stripe raccoon mid-grab of miniature cookie-jar, attic-window moonlight
- Plush-elephant garden party — grey-wool elephant gripping mini-watering-can over felt-flower bed, golden-hour
- Stuffed-deer winter-walk — cream-fluff deer mid-step through cotton-snow, felt-antler decorated with mini-bells
- Plush-mouse cheese-fortress — grey-felt mouse mid-climb on stack of foam-cheese-wedges, tiny crown
- Knitted-hedgehog acorn-hoarding — yarn-hedgehog mid-roll with felt-acorn cluster on knit-leaf-pile
- Plush-bear-cubs picnic — three knit-bear-cubs around miniature wicker-basket on red-checkered knit-blanket
- Plush-otter river-raft — sewn-otter on log-raft mid-float on felt-water, paddle-stick gripped, sun-glint
- Stitched-rabbit rocket-ship — knit-rabbit in miniature foil-rocket mid-launch on cotton-cloud-puff
- Plush-squirrel hot-air-balloon — yarn-squirrel in miniature wicker-balloon-basket lifting off from felt-meadow
- Plush-koala koalathon — fluffy-koala mid-climb on scratch-built eucalyptus-tree with felt-leaf-cluster
- Plush-pig snowman-build — pink-felt pig mid-roll of cotton-snowball with carrot-nose-pile beside
- Plush-puppy splash-pool — knit-puppy mid-leap into miniature plastic kiddie-pool with felt-droplets frozen
- Stuffed-bear lighthouse-keeper — knit-bear at scale lighthouse window adjusting tiny lens, beam visible
- Plush-cat treehouse climb — knit-cat mid-climb on mini-rope-ladder, felt-leaves rustling
- Plush-fox campfire-storyteller — fluffy-fox mid-gesture in front of twig-firepit with seated knit-cubs around
- Knit-mouse tea-set host — yarn-mouse pouring miniature teapot into row of three tiny cups on doily
- Plush-bunny umbrella-rain — long-eared bunny mid-step under miniature umbrella in felt-puddle reflection
- Stuffed-dragon hoard-of-buttons — scaled-fabric dragon coiled around pile of mini-buttons in cave-set
- Plush-bear cozy-lighthouse — knit-bear silhouetted in lit-window of scale lighthouse, plush-fog approaching
- Plush-bunny carrot-garden — knit-bunny mid-pull on giant felt-carrot from felt-soil, garden-tools beside
- Plush-fox harvest-festival — orange-fluff fox carrying mini-pumpkin through corn-stalk-set, autumn leaves
- Plush-koala bedtime-storytime — fluffy-koala in miniature bed with tiny scale-book held by paw, fairy-lights
- Stuffed-owl nightlight-watch — round-body owl perched on miniature shelf with tiny lit-lantern, moon-window
- Plush-bear lemonade-stand — knit-bear behind mini wooden-stand pouring miniature pitcher, felt-lemon pile
- Plush-cat rooftop-stargaze — yarn-cat on miniature shingle-roof with telescope-stick aimed at painted-stars
- Plush-puppy wagon-ride — felt-puppy in miniature wooden-wagon mid-pull by knit-bunny, picnic-blanket beside
- Plush-bear flower-press — knit-bear mid-arrangement of felt-flower in miniature wooden flower-press
- Plush-mouse miniature-bakery — grey-felt mouse mid-decorate of fabric-cupcake with felt-frosting, tiny bakery-set
- Plush-fox kayak-paddle — orange-fluff fox in miniature wooden-kayak on felt-river, mid-paddle motion
- Stitched-elephant kite-flight — wool-elephant gripping mini kite-string with felt-kite arcing across painted-sky
- Plush-bunny carousel-ride — long-eared bunny on miniature carousel-pony with felt-mane, spinning-wheel
- Plush-bear bookstore-loft — knit-bear nestled in miniature reading-nook with stack of tiny scale-books beside
- Plush-cat-and-mouse tea — yarn-cat and grey-mouse sharing miniature teapot at scale-table, pinky raised

━━━ MUST-HAVE FOR EVERY ENTRY ━━━
- Reference PLUSH / STUFFED / KNIT / FABRIC / FELT / FIBER / EMBROIDERED-EYE / BUTTON-EYE / FIBERFILL language
- Specific stuffed-animal archetype (teddy-bear / plush-bunny / stuffed-fox / etc.)
- Mid-action verb (toasting / hoisting / peering / mid-leap / mid-climb / mid-roll / mid-pull) — NO passive sitting
- Handcrafted miniature set anchor (mini-tent / felt-meadow / treehouse / picnic-blanket / etc.)
- Storybook warmth — lantern-glow, golden-hour-meadow, moonlit-window, firelight, fairy-lights

━━━ BANNED ━━━
- NO LBP burlap-and-zipper language (that's Sackboy path)
- NO real animals
- NO Raggedy-Ann generic-doll body
- NO passive sitting / lying / watching — characters MUST be mid-action
- NO CGI / illustration / digital-render language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
