/**
 * gen-avatar-candidates.js — render N candidate profile avatars per bot for
 * Kevin's review (does NOT touch live avatars; apply-bot-avatars.js ships the
 * chosen ones). Follows the playbook avatar lessons: avatars are ICONS, not
 * scenes — single bold subject, tight close-up, simple high-contrast
 * background, rendered in the bot's own medium.
 *
 *   node scripts/gen-avatar-candidates.js            # all bots, 5 concepts each
 *   node scripts/gen-avatar-candidates.js --bot yumbot
 *
 * Output: /tmp/bot-avatar-candidates/<bot>-<i>.jpg (512²) + manifest.json
 * (concept captions included) for the review HTML.
 */
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
const sharp = require('sharp');
const { flux } = require('./lib/botEngine');

const OUT = '/tmp/bot-avatar-candidates';
const MODEL = 'black-forest-labs/flux-1.1-pro';
const KEY = process.env.REPLICATE_API_TOKEN;
const TAIL =
  ', extreme close-up, single subject fills the frame, centered, simple clean uncluttered background, bold, high contrast, crisp and instantly readable, ultra detailed, square';

// 5 concepts per bot — each a DISTINCT idea drawn from that bot's paths +
// hearted looks, phrased icon-first. Label = short caption for the review page.
const CONCEPTS = {
  bloombot: [
    ['Golden Age rose', 'a single deep-crimson rose in full bloom, Dutch Golden Age oil painting, dramatic dark background, dewdrops on velvet petals'],
    ['Hummingbird sip', 'a jewel-green hummingbird hovering at a glowing trumpet flower, wings spread, painterly fine-art render, luminous'],
    ['Stained-glass bloom', 'a Tiffany stained-glass lotus flower, jewel-tone glass petals glowing with backlight, ornate leadwork'],
    ['Pastel peony', 'a lush blush-pink peony fully open, soft pastel watercolor, delicate and pretty, gentle morning light'],
    ['Dawn lotus macro', 'a dew-covered pink lotus glowing at dawn, macro photography, soft golden backlight, crystal water droplets'],
  ],
  brickbot: [
    ['Classic Space minifig', 'a LEGO Classic Space astronaut minifigure, white suit with blue trim, smiling yellow face inside clear helmet, glossy plastic toy photography'],
    ['Pirate captain minifig', 'a LEGO pirate captain minifigure with tricorn hat and parrot on shoulder, cheerful grin, glossy brick-built ship deck bokeh'],
    ['Brick dragon head', 'a red dragon head built entirely from LEGO bricks, studs visible, glossy plastic, fierce and charming AFOL masterpiece'],
    ['Knight minifig', 'a LEGO castle knight minifigure with silver helmet visor raised and red plume, heroic smile, toy photography'],
    ['Brick rainbow heart', 'a heart built from rainbow LEGO bricks, studs visible, glossy candy-colored plastic, playful and clean'],
  ],
  chibibot: [
    ['Red panda cub', 'one adorable chibi red panda cub with huge sparkling eyes, fluffy fur, glossy Pixar-style 3D render, heart-melting cute'],
    ['Baby dragon hatchling', 'a chibi pastel baby dragon hatchling with tiny wings and big shiny eyes, sitting in half an eggshell, storybook 3D cute'],
    ['Otter with lantern', 'a chibi otter cub holding a tiny glowing lantern with both paws, warm light on its face, cozy storybook render'],
    ['Fox in flower crown', 'a chibi fox kit wearing a tiny daisy flower crown, watercolor storybook illustration, soft and sweet'],
    ['Penguin in scarf', 'a chibi baby penguin wrapped in a red knit scarf, snowflakes sparkling, glossy cute 3D render'],
  ],
  dinobot: [
    ['T-rex eye macro', 'extreme close-up of a Tyrannosaurus rex eye, glowing amber iris, textured scaly skin, cinematic photoreal BBC documentary'],
    ['Feathered raptor', 'a feathered Velociraptor head portrait, iridescent plumage, sharp intelligent eye, photoreal paleoart, dramatic side light'],
    ['Triceratops portrait', 'a Triceratops head-on portrait, magnificent frill and horns, golden-hour light, photoreal wildlife photography'],
    ['Hatchling in egg', 'an adorable baby sauropod hatchling peeking out of a cracked egg, big curious eyes, photoreal, warm nest light'],
    ['Sunset sauropod', 'a Brachiosaurus head and long neck silhouetted against a giant orange sunset sun, bold graphic composition, cinematic'],
  ],
  dragonbot: [
    ['Painted dragon head', 'a majestic dragon head and shoulders, intricate emerald scales, glowing golden eyes, painted oil fantasy-novel-cover art'],
    ['Dragon eye macro', 'extreme close-up of a dragon eye, molten-gold slit pupil, jeweled scales reflecting treasure light, painted fantasy'],
    ['Hoard hatchling', 'a cute baby dragon curled asleep on a pile of gold coins, one gold coin stuck to its head, warm painted fantasy'],
    ['Moon silhouette', 'a dragon in flight silhouetted across a huge full moon, wings spread, bold graphic dark fantasy, painted'],
    ['Elven white dragon', 'an elegant white-and-gold dragon head with silver filigree horns, Alan Lee painted high-fantasy, ethereal light'],
  ],
  dreambot: [
    ['Bubble-bot face', 'a glossy cute robot with a glass dome visor face, a swirling candy-colored dream world reflected in the dome, designer-toy 3D render'],
    ['Robot painter', 'a cute round robot holding a paintbrush, painting a glowing swirl of magic stardust, glossy 3D render, whimsical'],
    ['Dream orb', 'a crystal orb containing a miniature candy-colored dream world with tiny spires and a rainbow river, glowing softly, magical 3D render'],
    ['Asleep on a cloud', 'a chibi robot asleep on a fluffy cloud under a crescent moon and sparkling stars, pastel dreamy 3D render'],
    ['Stardust hands', 'a friendly glossy robot cupping glowing stardust spilling through its fingers, deep twilight background, magical 3D render'],
  ],
  earthbot: [
    ['Peak above clouds', 'a golden-hour mountain peak rising above a sea of clouds, alpenglow, clean professional landscape photography'],
    ['Turquoise barrel', 'inside a glassy turquoise ocean wave barrel, sunlight through the crest, crisp nature photography'],
    ['Forest god-rays', 'golden god-rays piercing morning mist in an ancient mossy forest, true-to-life nature photography'],
    ['Aurora peak', 'green aurora borealis curtain over a snow-covered peak, starry sky, clean night landscape photography'],
    ['Slot canyon beam', 'a light beam striking the sculpted red sandstone curves of a slot canyon, warm glow, professional photography'],
  ],
  faebot: [
    ['Fairy portrait', 'a luminous forest fairy close-up portrait, iridescent butterfly wings, flower crown, soft ethereal painted fantasy'],
    ['Fae on mushroom', 'a tiny glowing fae sitting cross-legged on a red-capped mushroom, fireflies around her, painted storybook fantasy'],
    ['Forest queen', 'a serene forest queen portrait with an antler-and-wildflower crown, dappled golden light, Alan Lee painted fantasy'],
    ['Fae door', 'a tiny glowing arched fairy door in the roots of an ancient mossy oak, warm light spilling out, enchanted painted fantasy'],
    ['Blossom dryad', 'a gentle dryad face emerging from cherry blossom petals, bark-and-petal skin, dreamy painted fantasy portrait'],
  ],
  gothbot: [
    ['Vampire portrait', 'a beautiful gothic vampire woman portrait, glowing magenta eyes, black lace veil, pale skin, dark romantic fantasy art'],
    ['Black rose', 'a single black rose with crimson-edged petals and glowing red dew drops, on deep shadow, dark romantic still life'],
    ['Moon gargoyle', 'a stone gargoyle silhouetted before a huge full moon and cathedral rose window, bold gothic graphic'],
    ['Gothic cat', 'a sleek black cat with glowing amber eyes sitting on a moonlit gothic balustrade, elegant dark fantasy'],
    ['Rose window glow', 'a candlelit gothic cathedral rose window, stained glass glowing crimson and violet in darkness, ornate tracery'],
  ],
  mangabot: [
    ['Sakura portrait', 'an anime girl close-up portrait, big expressive eyes, cherry blossom petals drifting, vibrant cel-shaded anime art'],
    ['Magical girl', 'a magical girl mid-transformation, sparkling ribbons of light, star wand glow, vibrant anime art, joyful'],
    ['Ghibli summer', 'a Ghibli-style girl in a straw hat smiling in a summer meadow, soft watercolor anime, warm and nostalgic'],
    ['Kitsune spirit', 'a beautiful nine-tailed kitsune fox spirit with glowing markings, anime art, mystical blue flames'],
    ['Neo-Tokyo neon', 'an anime cyberpunk girl portrait lit by neon signs, reflective visor pushed up, Trigger-style bold anime art'],
  ],
  mechbot: [
    ['Mech visor', 'a futuristic mech robot head close-up, glowing violet visor, sleek armored panels, cinematic sci-fi concept art'],
    ['Titan silhouette', 'a colossal titan war mech silhouetted against a burning orange sky, bold graphic scale, cinematic'],
    ['Chrome shogun', 'a chrome samurai-mech mask close-up, ornate armored faceplate, glowing red eye slits, cinematic sci-fi'],
    ['Scout drone', 'a small round scout drone robot with a single large friendly glowing blue eye, brushed metal, sci-fi concept art'],
    ['Android profile', 'an android woman profile portrait, glowing circuit traces on synthetic skin, chrome cervical column, cinematic sci-fi'],
  ],
  oceanbot: [
    ['Turtle glide', 'a green sea turtle close-up gliding over a sunlit coral reef, crisp underwater photography, turquoise light'],
    ['Deep-glow jelly', 'a bioluminescent jellyfish glowing electric blue and violet against pure black deep ocean, realistic render'],
    ['Whale breach', 'a humpback whale breaching at golden sunset, water spray backlit, cinematic ocean photography'],
    ['Anemone home', 'a vivid orange clownfish peeking from a swaying anemone, macro underwater photography, colorful'],
    ['Kraken eye', 'a giant kraken eye and spiraling tentacle underwater, moody teal light, painterly maritime fantasy'],
  ],
  pixelbot: [
    ['Pixel hero', 'a 16-bit pixel-art hero character face, bold colorful chunky pixels, clean retro SNES sprite'],
    ['Pixel slime', 'a cute smiling blue pixel-art slime with shiny eyes, chunky 16-bit sprite, charming JRPG mascot'],
    ['Pixel sunset', 'a 16-bit pixel-art sunset over mountains and a lake, bold gradient dither sky, beautiful retro vista'],
    ['Pixel potion', 'a glowing pink pixel-art potion bottle with sparkles, crisp 16-bit item icon, game inventory style'],
    ['Pixel farmhouse', 'a cozy pixel-art farmhouse with smoking chimney at dusk, warm windows, 16-bit farming-game charm'],
  ],
  retrobot: [
    ['CRT glow', 'a glowing retro 1980s CRT computer monitor on a desk, warm neon-lit room, nostalgic film grain'],
    ['Boombox sunset', 'a chrome 1980s boombox radio against a neon-pink sunset grid, retro airbrush style, nostalgic'],
    ['VHS tape', 'a black VHS tape with a colorful hand-written rental sticker, on rewind, warm 90s film photo'],
    ['Arcade joystick', 'an arcade cabinet joystick and glowing buttons close-up, neon reflections, 80s arcade nostalgia'],
    ['Roller skates', 'white roller skates with rainbow laces under roller-rink disco light, 80s film photography, fun'],
  ],
  starbot: [
    ['Cosmic visor', 'a sci-fi astronaut in a glossy reflective helmet, a nebula and stars mirrored in the visor, vibrant retro-futurist cover art'],
    ['Ringed giant', 'a tiny astronaut floating before an enormous ringed planet, bold graphic scale contrast, cinematic space art'],
    ['Retro rocket', 'a gleaming chrome retro rocket ship with a warm exhaust flame climbing through stars, vintage sci-fi poster art'],
    ['Crystal world', 'a glowing crystalline alien planet with prismatic spires, seen from orbit, luminous sci-fi concept art'],
    ['Star leviathan', 'a cosmic space whale silhouette swimming through a glowing violet nebula, majestic sci-fi fantasy art'],
  ],
  steambot: [
    ['Brass airship', 'a majestic steampunk airship with ornate brass hull and billowing sails, golden sunset clouds, painted illustration'],
    ['Clockwork owl', 'an ornate brass clockwork owl automaton with glowing amber glass eyes, visible gears, warm gaslit render'],
    ['Goggles & top hat', 'polished brass steampunk goggles resting on a leather top hat, warm workshop light, rich detail illustration'],
    ['Gear heart', 'a brass-and-copper mechanical heart with turning gears and a soft steam wisp, glowing warm, steampunk illustration'],
    ['Aviatrix portrait', 'a glamorous steampunk aviatrix portrait with brass goggles on her leather cap, warm gaslight, painted illustration'],
  ],
  tinybot: [
    ['Mushroom cottage', 'a tiny tilt-shift miniature mushroom cottage with lit windows, adorable handcrafted model, macro photography'],
    ['Walnut sailboat', 'a tiny walnut-shell sailboat with a leaf sail and a mouse sailor at the tiller, tilt-shift macro, storybook charm'],
    ['Teacup island', 'a miniature island world with a tiny tree and cottage inside a porcelain teacup, macro tilt-shift, whimsical'],
    ['Pastel village', 'a tiny pastel miniature village street on a mossy shelf, tilt-shift macro photography, dollhouse charm'],
    ['Acorn lantern', 'a tiny acorn-cap lantern glowing warm with a firefly perched on top, macro tilt-shift, enchanting miniature'],
  ],
  toybot: [
    ['Hero figure', 'a heroic toy action figure, glossy molded plastic, dynamic pose, cinematic toy photography, dramatic light'],
    ['Clay monster', 'a cute claymation monster with a goofy grin, visible fingerprint texture in the clay, stop-motion charm'],
    ['Army man', 'a classic green plastic army man toy soldier close-up, molded plastic sheen, cinematic toy photography'],
    ['Teddy astronaut', 'a plush teddy bear in a tiny astronaut suit, soft fabric detail, warm toy photography, adorable'],
    ['Tin wind-up', 'a vintage tin wind-up robot toy with lithographed panels and a wind-up key, glossy retro toy photography'],
  ],
  yumbot: [
    ['Smiling cupcake', 'an adorable kawaii cupcake with a cute smiling face, pastel pink frosting swirl, candy sprinkles, glossy 3D cute'],
    ['Happy onigiri', 'a kawaii onigiri rice ball with a tiny happy face and nori wrap, glossy 3D render, festival-cute'],
    ['Glossy strawberry', 'a kawaii strawberry with a sweet smiling face and a leaf hat, glossy dewy 3D render, adorable'],
    ['Boba buddy', 'a kawaii boba milk tea cup with a happy face, pastel pearls and a striped straw, glossy 3D cute'],
    ['Pancake stack', 'a kawaii pancake stack with a smiling face, melting butter beret and syrup drizzle, glossy 3D cute'],
  ],
};

// Round 2 (Kevin: "funner") — playful, personality-forward takes: mischief,
// mid-action charm, tiny costumes. Rendered as indices 5-9 alongside round 1.
const FUN_CONCEPTS = {
  bloombot: [
    ['Sunglasses sunflower', 'a cheerful sunflower wearing tiny sunglasses, tilted like it is posing for a photo, bright summer light, playful 3D render'],
    ['Petal confetti', 'a bright flower bursting open in a joyful explosion of petal confetti, mid-pop, vivid and playful'],
    ['Bee pilot', 'a chubby bumblebee wearing tiny aviator goggles coming in for a landing on a bright zinnia, playful macro'],
    ['Ladybug lounger', 'a ladybug lounging on a daisy petal like a sun chair beside a tiny drink umbrella, whimsical macro'],
    ['Singing tulips', 'two tulips leaning together like duet singers with pollen sparkle notes in the air, whimsical illustration'],
  ],
  brickbot: [
    ['Ice cream minifig', 'a LEGO minifigure gleefully holding a giant brick-built ice cream cone twice its size, glossy toy photography'],
    ['Brick surfer', 'a LEGO minifigure surfing a translucent blue brick-built wave, arms out, action toy photography'],
    ['Minifig wizard', 'a LEGO wizard minifigure casting a spell of floating rainbow studs, sparkly toy photography'],
    ['Shark suit', 'a LEGO minifigure in a shark costume suit, goofy grin visible in the shark mouth, glossy toy photography'],
    ['Selfie minifig', 'a LEGO minifigure taking a selfie with a tiny brick phone, big printed smile, glossy toy photography'],
  ],
  chibibot: [
    ['Hamster cheeks', 'a chibi hamster with comically stuffed cheeks hugging a giant strawberry, glossy 3D cute'],
    ['Shark onesie cat', 'a chibi kitten wearing a shark onesie hoodie, only its face peeking out, glossy 3D adorable'],
    ['Party duckling', 'a chibi duckling in a tiny party hat blowing a paper party horn, confetti bits, glossy 3D cute'],
    ['Teacup cannonball', 'a chibi bunny mid-cannonball leap into a giant teacup of bubbles, joyful, glossy 3D render'],
    ['Giggling panda', 'a chibi baby panda rolling on its back laughing with tiny tears of joy, glossy 3D cute'],
  ],
  dinobot: [
    ['Party rex', 'a photoreal Tyrannosaurus rex wearing a tiny pointed party hat, deadpan expression, cinematic lighting'],
    ['Raptor zoomies', 'a feathered raptor mid-sprint doing joyful zoomies, dust kicked up, tongue out, photoreal action'],
    ['Eggshell helmet', 'a baby dinosaur hatchling wearing its eggshell half as a helmet, big happy eyes, photoreal warm light'],
    ['Butterfly horn', 'a photoreal triceratops looking cross-eyed at a bright butterfly perched on its horn, golden light'],
    ['Snowflake snap', 'a photoreal T-rex trying to catch a snowflake on its tongue, snow dusting its snout, soft winter light'],
  ],
  dragonbot: [
    ['Sneeze flame', 'a cute baby dragon mid-sneeze releasing a tiny puff of flame and smoke, startled eyes, painted fantasy'],
    ['One-coin hoard', 'a baby dragon proudly hugging a single gold coin like the greatest treasure ever, painted fantasy, charming'],
    ['Helmet hatchling', 'a baby dragon wearing an oversized knight helmet slipping over one eye, painted fantasy, adorable'],
    ['Heart smoke rings', 'a young dragon blowing heart-shaped smoke rings, pleased with itself, painted fantasy'],
    ['Treasure belly-flop', 'a chubby dragon belly-flopped face-down on a pile of gold, utterly content, painted fantasy'],
  ],
  dreambot: [
    ['Star juggler', 'a glossy cute robot juggling a tiny sun, moon and star, delighted expression, designer-toy 3D render'],
    ['Paint-splattered grin', 'a cute robot with rainbow paint splattered across its face grinning proudly, brush behind its ear, 3D render'],
    ['World bubble', 'a cute robot blowing a soap bubble that contains a tiny dream world with spires and a rainbow, 3D render'],
    ['Confetti dance', 'a chibi robot mid-happy-dance with one leg up, confetti and sparkles around it, glossy 3D render'],
    ['Sleepy nightcap', 'a cute robot in a striped nightcap mid-yawn with little glowing Z letters floating up, cozy 3D render'],
  ],
  earthbot: [
    ['Quokka smile', 'a quokka smiling its famous huge smile straight at the camera, crisp wildlife photography, golden light'],
    ['Puffin haul', 'a puffin with a comically overstuffed beak full of silver fish, crisp wildlife photography'],
    ['Otter float', 'a sea otter floating on its back holding a favorite pebble on its belly, sweet wildlife photography'],
    ['Fox pounce', 'a red fox frozen mid-pounce diving nose-first toward snow, tail up, crisp winter wildlife photography'],
    ['Mud-puddle calf', 'a baby elephant joyfully splashing in a mud puddle, ears out, warm wildlife photography'],
  ],
  faebot: [
    ['Bee rodeo', 'a tiny fae riding a chubby bumblebee like a rodeo bronco, glitter trail behind, painted fantasy, gleeful'],
    ['Tulip nap', 'a pixie napping inside a half-open tulip, feet sticking out over the petal edge, painted fantasy, sweet'],
    ['Snail tea party', 'a tiny fae having a mushroom-table tea party with a polite snail, acorn teacups, painted storybook'],
    ['Glitter loop', 'a fairy pulling a joyful loop-de-loop leaving a spiral glitter trail, painted fantasy, dynamic and fun'],
    ['Grumpy gnome', 'a tiny grumpy toadstool gnome peeking out of moss with crossed arms, painted storybook, endearing'],
  ],
  gothbot: [
    ['Winking bat', 'a fluffy black bat hanging upside down winking one big amber eye, moonlit, cute dark fantasy'],
    ['Lace ghost', 'an elegant little ghost wearing a black lace veil, softly glowing, cute gothic romance'],
    ['Witch-hat cat', 'a black cat in a tiny crooked witch hat, glowing amber eyes, moonlight, charming dark fantasy'],
    ['Heart lollipop', 'a skeleton hand elegantly holding a black heart-shaped lollipop with a crimson bow, gothic cute'],
    ['Coffee gargoyle', 'a stone gargoyle on a cathedral ledge sipping from a tiny coffee mug, deadpan, moonlit, witty gothic'],
  ],
  mangabot: [
    ['Ramen bliss', 'a chibi anime girl blissfully slurping a giant bowl of ramen, steam swirls, sparkle eyes, vibrant anime'],
    ['Cat-girl wink', 'an anime cat-girl winking and flashing a peace sign, cherry blossom bokeh, vibrant cel-shaded anime'],
    ['Blossom mecha', 'a giant mecha tilting its head at a single cherry blossom stuck on its faceplate, gentle anime moment'],
    ['Onigiri laugh', 'an anime girl laughing with an onigiri in each hand, sparkles and joy, cel-shaded anime'],
    ['Sailor shiba', 'a shiba inu wearing a sailor school uniform collar, proud expression, cute anime style'],
  ],
  mechbot: [
    ['Tiny flex', 'a hulking battle mech flexing comically tiny arms, gym pose, cinematic sci-fi with a wink'],
    ['Kitten cargo', 'a giant war mech gently cradling a tiny orange kitten in its massive armored hand, warm sci-fi'],
    ['Low battery', 'a cute robot with droopy sleepy eyes and a low-battery icon on its chest, plugged in and dozing, sci-fi charm'],
    ['Cone party hat', 'a battle mech wearing an orange traffic cone as a party hat, deadpan glowing visor, witty sci-fi'],
    ['Wheelie bot', 'a small round robot popping a gleeful wheelie on one wheel, sparks and motion streaks, playful sci-fi'],
  ],
  oceanbot: [
    ['Surprised puffer', 'a fully puffed pufferfish with huge surprised eyes, comically round, crisp underwater photography'],
    ['Pirate octopus', 'an octopus wearing a tiny pirate tricorn hat, one tentacle raised like a salute, painterly maritime fun'],
    ['Clapping seal', 'a delighted seal mid-clap with flippers together, sparkling water drops, crisp wildlife photography'],
    ['Crab workout', 'a muscular little crab lifting a tiny barbell made of pebbles, determined face, playful underwater render'],
    ['Bubble-ring dolphin', 'a dolphin blowing a perfect silver bubble ring, playful eye contact, crisp underwater photography'],
  ],
  pixelbot: [
    ['Pixel cat chaos', 'a 16-bit pixel-art cat mid-swipe knocking a potion bottle off a table, mischievous, charming sprite scene'],
    ['Chicken knight', 'a 16-bit pixel-art knight riding a giant chicken, triumphant banner, playful JRPG sprite'],
    ['Pizza ghost', 'a 16-bit pixel-art ghost happily eating a slice of pizza, crumbs floating, cute sprite'],
    ['Mimic grin', 'a 16-bit pixel-art treasure chest mimic with a huge toothy grin and a gold coin on its tongue, playful sprite'],
    ['Sword frog', 'a 16-bit pixel-art frog adventurer with a tiny sword strapped to its back, determined, cute sprite'],
  ],
  retrobot: [
    ['Cool cassette', 'a cassette tape wearing tiny sunglasses, neon-pink 80s glow, retro airbrush style, fun'],
    ['Happy computer', 'a beige retro computer with a big pixel smiley face on its CRT screen, cheerful 80s product photo'],
    ['Floppy duck', 'a rubber duck perched proudly on a stack of rainbow floppy disks, warm 90s film photo, playful'],
    ['Rad pizza', 'a pizza slice riding a skateboard, motion blur, totally rad 90s airbrush cartoon style'],
    ['Party controller', 'a retro game controller with a party popper bursting confetti, saturday-morning fun, bright'],
  ],
  starbot: [
    ['Zero-g taco', 'an astronaut in a helmet chasing a floating taco with drifting lettuce in zero gravity, playful sci-fi art'],
    ['UFO wave', 'a cute green alien blob waving happily from a flying saucer porthole, retro sci-fi cartoon charm'],
    ['Star surfer', 'an astronaut surfing a shooting star like a skateboard, sparkling trail, playful retro sci-fi poster'],
    ['Space corgi', 'a corgi wearing a bubble space helmet, ears up, stars behind, adorable sci-fi render'],
    ['Donut asteroid', 'an astronaut proudly planting a tiny flag on a giant glazed-donut-shaped asteroid, witty sci-fi art'],
  ],
  steambot: [
    ['Butler bot', 'a dapper brass robot butler with a curled mustache plate serving tea on a gear tray, warm steampunk charm'],
    ['Penny-farthing mouse', 'a clockwork mouse riding a tiny penny-farthing bicycle, gears whirring, whimsical steampunk illustration'],
    ['Monocle cat', 'a distinguished cat wearing a monocle and tiny top hat with brass goggles, steampunk portrait, charming'],
    ['Teapot airship', 'a whimsical airship built from a copper teapot with steam puffing from the spout, steampunk illustration'],
    ['Wind-up hummingbird', 'a brass wind-up hummingbird mid-hover with a turning key on its back, gaslit sparkle, steampunk charm'],
  ],
  tinybot: [
    ['Snail mail', 'a tiny snail with leather mail saddlebags delivering a letter to a mushroom door, tilt-shift macro, adorable'],
    ['Bottle-cap picnic', 'two tiny mice having a picnic on a bottle-cap table with crumb sandwiches, tilt-shift macro, charming'],
    ['Jam jar gnome', 'a tiny gnome happily stuck inside a jam jar licking jam off his fingers, macro tilt-shift, funny'],
    ['Leaf raincoat', 'a hedgehog wearing a folded-leaf raincoat in light rain, tiny puddle boots, macro storybook cute'],
    ['Frog king', 'a tiny frog wearing a bottle-cap crown sitting on a spool throne, regal and ridiculous, macro tilt-shift'],
  ],
  toybot: [
    ['Super duck', 'a rubber duck wearing a tiny red superhero cape, heroic chin up, glossy toy photography'],
    ['Tea party truce', 'a fierce action figure politely holding a tiny teacup at a dolls tea party, toy photography, funny'],
    ['Crayon snack', 'a claymation dinosaur guiltily chewing a bright crayon, clay crumbs, stop-motion charm'],
    ['Slinky tangle', 'a wind-up robot toy hopelessly tangled in a rainbow slinky, cheerful panic, glossy toy photography'],
    ['Sock dragon', 'a sock-puppet dragon with button eyes and felt flames mid-roar, handmade charm, toy photography'],
  ],
  yumbot: [
    ['Dancing taco', 'a kawaii taco with a happy face doing a little dance, lettuce ruffling like a skirt, glossy 3D cute'],
    ['Sushi tower', 'three kawaii sushi rolls with tiny faces stacked in a wobbling tower, top one cheering, glossy 3D cute'],
    ['Hula donut', 'a kawaii donut hula-hooping with an onion ring, sprinkles flying, glossy 3D fun'],
    ['Melting wink', 'a kawaii ice cream cone winking as its scoop slides dramatically to one side, glossy 3D cute'],
    ['Cowboy hotdog', 'a kawaii hotdog wearing a tiny cowboy hat with a ketchup lasso swirl, glossy 3D fun'],
  ],
};

// Round 3 (Kevin request) — 10 more per selected bot. SteamBot: all airships
// on LIGHT backgrounds for circle readability.
const ROUND3_CONCEPTS = {
  bloombot: [
    ['Blossom branch', 'a cherry blossom branch in full bloom against a pale blue spring sky, delicate pink petals, fine-art photography'],
    ['Wisteria cascade', 'a cascading curtain of lavender wisteria blooms glowing in soft light, dreamy painterly render'],
    ['Mason jar posy', 'a wildflower bouquet in a mason jar on a sunlit cottage windowsill, warm and charming, soft photography'],
    ['White orchid', 'a single elegant white orchid on a soft cream background, minimal, graceful fine-art still life'],
    ['Lavender hour', 'one sharp lavender stem before a dreamy golden-hour lavender field bokeh, warm fine-art photography'],
    ['Bloom terrarium', 'a glass terrarium globe filled with tiny colorful blooms and moss, glowing softly, whimsical render'],
    ['Butterfly landing', 'a monarch butterfly alighting on a purple coneflower, painterly botanical art, luminous'],
    ['Petal spiral', 'a rainbow ranunculus flower macro, hypnotic spiral of layered petals, vivid fine-art photography'],
    ['Flower crown', 'a lush flower crown of roses and baby breath on a clean ivory background, pretty product-art flat lay'],
    ['Twilight bloom', 'a magical flower glowing softly from within at twilight, luminous petals, enchanted fantasy render'],
  ],
  faebot: [
    ['Lantern flight', 'a tiny fae flying through night air carrying a glowing paper lantern, warm light on her face, painted fantasy'],
    ['Moth-wing moon', 'a moth-winged fae silhouetted against a huge golden full moon, delicate wing patterns, painted fantasy'],
    ['Acorn-hat sprite', 'a tiny sprite wearing an acorn cap peeking over the edge of a green leaf, big curious eyes, storybook fantasy'],
    ['Dewdrop mirror', 'a fairy admiring her reflection in a giant dewdrop on a leaf, morning sparkle, painted fantasy'],
    ['Luna wings', 'close-up of luminous luna-moth fairy wings, pale green with moon-dust sparkle, ethereal fantasy art'],
    ['Walnut cradle', 'a baby fae asleep in a walnut-shell cradle with a firefly nightlight, heart-melting painted storybook'],
    ['Leaf crown', 'an elven crown woven of silver leaves and starlight resting on a mossy stone, glowing, painted fantasy still life'],
    ['Paper-boat voyage', 'a tiny fae sailing a folded paper boat down a sparkling stream, joyful, painted storybook fantasy'],
    ['Foxglove heart', 'a pixie drawing a heart of glittering pixie dust above a foxglove spire, whimsical painted fantasy'],
    ['Blackberry hug', 'a tiny dragonfly-winged fae hugging a blackberry bigger than she is, gleeful, painted storybook'],
  ],
  gothbot: [
    ['Vampire cameo', 'an ornate Victorian cameo brooch with a vampire woman silhouette, carved ivory on black velvet, gothic elegance'],
    ['Raven jewel', 'a glossy raven holding a glowing crimson jewel in its beak, moonlit, dark romantic fantasy'],
    ['Black candelabra', 'an ornate silver candelabra with dripping black candles and violet flames, gothic still life'],
    ['Crimson elixir', 'an ornate gothic perfume bottle glowing with crimson liquid, black lace beneath, dark romance still life'],
    ['Rose gate', 'a moonlit ornate iron gate wrapped in blood-red climbing roses, gothic romance, misty'],
    ['Fanged smile', 'a close-up of dark crimson lips with elegant vampire fangs, pale skin, bold dark glamour'],
    ['Skeleton key', 'an ornate antique skeleton key with a bat-wing bow, glowing faintly violet, gothic still life'],
    ['Bat crystal ball', 'a crystal ball on a clawed stand showing a swirling bat swarm inside, candlelit, gothic fantasy'],
    ['Widow veil', 'an elegant Victorian widow hat with black lace veil on a brass stand, moody gothic still life'],
    ['Black swan', 'a black swan gliding on a moonlit lake, red eye glinting, dark elegant fantasy'],
  ],
  starbot: [
    ['Phoenix nebula', 'a glowing nebula shaped like a rising phoenix, vivid violet and gold, deep-space astrophotography art'],
    ['Zen astronaut', 'an astronaut floating cross-legged in serene meditation among drifting stars, peaceful sci-fi art'],
    ['Ringed dawn', 'a giant ringed planet rising over crystalline mountains, seen from an alien beach, luminous sci-fi vista'],
    ['Aurora jelly', 'a bioluminescent space-jellyfish creature drifting through an aurora nebula, elegant cosmic fantasy'],
    ['Chrome ray-gun', 'a gleaming chrome retro ray-gun with glowing rings, vintage pulp sci-fi poster art, playful'],
    ['Overgrown helmet', 'an astronaut helmet overgrown with glowing alien vines and tiny luminous flowers, poetic sci-fi still life'],
    ['Golden record', 'a glowing golden data disc etched with star maps, floating in space, luminous sci-fi artifact'],
    ['Twin moons', 'two glowing ringed moons rising over a violet crystalline horizon, breathtaking sci-fi vista'],
    ['Probe buddy', 'a cute round space probe with solar-panel wings and a waving antenna, friendly lens eye, charming sci-fi render'],
    ['Rainbow comet', 'a brilliant comet with a prismatic rainbow tail streaking past a purple planet, vivid space art'],
  ],
  steambot: [
    ['Brass zeppelin', 'a majestic brass zeppelin airship in side profile against a pale cream sky, polished hull gleaming, painted illustration'],
    ['Galleon of the skies', 'an ornate galleon-style airship with white canvas balloon sailing a bright pale-blue sky, painted illustration'],
    ['Teapot dirigible', 'a whimsical airship built from a copper teapot puffing steam, floating on a soft ivory sky, charming illustration'],
    ['Gearwork balloon', 'a brass hot-air balloon airship with visible clockwork gondola, bright white clouds behind, painted illustration'],
    ['Pocket airship', 'a small rounded adorable airship with twin propellers and portholes, soft pastel morning sky, charming illustration'],
    ['Cloud flagship', 'a grand flagship airship cresting through bright white cumulus clouds in full sun, luminous painted illustration'],
    ['Butterfly wings', 'an elegant airship with brass butterfly wings spread wide, pale pearl sky background, whimsical illustration'],
    ['Sky locomotive', 'a steam locomotive-style skyship with a big front lamp puffing white steam, pale morning sky, painted illustration'],
    ['Sunlit underbelly', 'an ornate brass airship seen from below against a bright white cloud dome with sun flare, painted illustration'],
    ['Swan airship', 'an elegant swan-shaped white-and-brass airship gliding on a light pearl sky, graceful painted illustration'],
  ],
};

// Round 4 (Kevin's per-bot art direction, 2026-07-01). Bold, small-readable.
const ROUND4_CONCEPTS = {
  bloombot: [
    ['Rose emblem', 'a bold elegant silhouette of a single rose in deep magenta, flat graphic emblem on a soft cream background, instantly recognizable shape'],
    ['Tulip emblem', 'a bold coral tulip silhouette with one leaf curve, flat graphic emblem on a pale mint background, clean and pretty'],
    ['Sunflower emblem', 'a bold golden sunflower silhouette with radiating petals, flat graphic emblem on a warm ivory background, iconic'],
    ['Orchid emblem', 'a bold violet orchid silhouette, graceful petal shape, flat graphic emblem on a soft blush background'],
    ['Calla curve', 'a bold elegant calla lily silhouette in white with a soft gold edge, flat graphic emblem on a dusty rose background'],
  ],
  chibibot: [
    ['Leaf umbrella', 'a chibi hedgehog holding a leaf umbrella in light rain, glossy 3D cute'],
    ['Baby seal', 'a chibi baby seal pup with huge dark eyes on pale ice, glossy 3D adorable'],
    ['Corgi pup', 'a chibi corgi puppy with a tiny happy tongue out, glossy 3D cute'],
    ['Nightcap owl', 'a chibi baby owl wearing a striped nightcap, sleepy eyes, glossy 3D cute'],
    ['Teacup kitten', 'a chibi kitten sitting inside a floral teacup, paws on the rim, glossy 3D adorable'],
    ['Butterfly nose', 'a chibi fawn cross-eyed at a butterfly landing on its nose, glossy 3D sweet'],
    ['Rainbow scarf', 'a chibi puppy wrapped in an oversized rainbow knit scarf, glossy 3D cute'],
    ['Baby axolotl', 'a chibi pink axolotl smiling with frilly gills, underwater sparkle, glossy 3D cute'],
    ['Flower lamb', 'a chibi fluffy lamb with a daisy tucked behind its ear, glossy 3D sweet'],
    ['Cookie bandit', 'a chibi raccoon clutching a chocolate-chip cookie with guilty delight, glossy 3D cute'],
  ],
  dinobot: [
    ['Sunset rex', 'a Tyrannosaurus rex head and shoulders roaring, silhouetted against a giant orange sunset sun, bold graphic composition, cinematic'],
    ['Sunset trike', 'a Triceratops profile with frill and horns silhouetted against a giant golden sunset sun, bold graphic composition, cinematic'],
    ['Sunset stego', 'a Stegosaurus with its plated back silhouetted against a giant amber sunset sun, bold graphic composition, cinematic'],
    ['Sunset wings', 'a Pteranodon gliding wings-spread silhouetted across a giant crimson sunset sun, bold graphic composition, cinematic'],
    ['Sunset sail', 'a Spinosaurus with its tall sail silhouetted against a giant burnt-orange sunset sun, bold graphic composition, cinematic'],
  ],
  dragonbot: [
    ['Crimson dragon', 'a majestic crimson dragon head and shoulders, intricate scales, glowing golden eyes, Frank Frazetta painted fantasy art, dramatic'],
    ['Ember black dragon', 'a majestic obsidian-black dragon head and shoulders, ember-lit scale edges, glowing orange eyes, painted fantasy art, dramatic'],
    ['Emerald dragon', 'a majestic emerald-green dragon head and shoulders, jeweled scales, glowing amber eyes, painted fantasy-novel-cover art, dramatic'],
    ['Storm dragon', 'a majestic sapphire-blue dragon head and shoulders, storm-lit scales, glowing white eyes, painted fantasy art, dramatic'],
    ['Gilded dragon', 'a majestic golden dragon head and shoulders, burnished metallic scales, glowing sapphire eyes, painted fantasy art, dramatic'],
  ],
  earthbot: [
    ['Savanna acacia', 'a lone acacia tree silhouetted against a giant orange African sunset, golden haze, epic cinematic nature photography'],
    ['Hilltop oak', 'one majestic oak tree on a hill backlit by golden sunrise, glowing mist, epic cinematic nature photography'],
    ['Ridge pine', 'a lone windswept pine silhouetted on a misty blue mountain ridge at dawn, cinematic nature photography'],
    ['Baobab dusk', 'a massive baobab tree silhouetted against a warm amber dusk sky, epic cinematic nature photography'],
    ['Lakeside willow', 'a graceful willow tree golden-backlit over a mirror-still lake at sunrise, epic cinematic nature photography'],
  ],
  faebot: [
    ['Golden moon fae', 'a delicate fairy silhouette with outstretched wings against a huge golden full moon, sparkling dust drifting, painted fantasy'],
    ['Blue moon dance', 'a dancing fairy silhouette mid-twirl against a huge pale-blue full moon, glitter trail, painted fantasy'],
    ['Crescent perch', 'a fairy silhouette sitting on the tip of a glowing crescent moon, legs swinging, painted fantasy'],
    ['Dandelion wish', 'a fairy silhouette blowing dandelion seeds that drift across a huge silver moon, painted fantasy'],
    ['Moonlit ascent', 'a fairy silhouette rising toward a huge amber harvest moon, wings catching the light, sparkles below, painted fantasy'],
  ],
  gothbot: [
    ['Crimson gaze', 'a beautiful gothic vampire woman portrait, glowing crimson eyes, raven-black hair, pale skin, dark romantic fantasy art, foreboding'],
    ['Violet choker', 'a beautiful gothic vampire woman portrait, glowing violet eyes, black velvet choker, pale skin, dark romantic fantasy art'],
    ['Silver moonlight', 'a beautiful gothic vampire woman portrait lit by moonlight, glowing silver eyes, windswept black hair, dark romantic fantasy art'],
    ['Rose whisper', 'a beautiful gothic vampire woman portrait holding a black rose near her lips, glowing red eyes, dark romantic fantasy art'],
    ['Candlelit stare', 'a beautiful gothic vampire woman portrait in flickering candlelight, glowing amber eyes, lace collar, dark romantic fantasy art, foreboding'],
  ],
  starbot: [
    ['Ringed emblem', 'a bold ringed planet silhouette, deep indigo sphere with luminous gold rings, flat graphic emblem on a soft starfield, instantly recognizable'],
    ['Crescent world', 'a planet in dramatic crescent light, clean bold shape against deep space, luminous edge, graphic and iconic'],
    ['Twin moon planet', 'a bold violet planet silhouette with two small glowing moons, clean graphic composition on dark starfield'],
    ['Swirl giant', 'a gas giant with one bold glowing storm swirl, rich teal and gold bands, clean iconic planet shape on dark space'],
    ['Eclipse corona', 'a dark planet silhouette in total eclipse with a blazing corona ring, bold graphic, instantly recognizable shape'],
  ],
  steambot: [
    ['Pastel sunset sails', 'a majestic steampunk airship with ornate brass hull and billowing sails, soft pastel peach sunset sky, painted illustration'],
    ['Lavender dusk ship', 'a majestic steampunk airship with ornate brass hull and billowing sails, light lavender-and-gold evening sky, painted illustration'],
    ['Coral dawn ship', 'a majestic steampunk airship with ornate brass hull and billowing sails, pale coral dawn sky with soft clouds, painted illustration'],
    ['Bright day sails', 'a majestic steampunk airship with ornate brass hull and billowing sails, bright pale-blue midday sky with white clouds, painted illustration'],
    ['Golden haze ship', 'a majestic steampunk airship with ornate brass hull and billowing sails, luminous light-gold hazy sky, painted illustration'],
  ],
  tinybot: [
    ['Glowing toadstool home', 'a tiny tilt-shift red toadstool cottage with warm glowing windows in soft moss, macro photography, adorable miniature'],
    ['Mushroom lane', 'a tiny mushroom cottage with a pebble path and micro picket fence, tilt-shift macro, charming miniature scene'],
    ['Mushroom hamlet', 'a cluster of three tiny mushroom houses with lit windows nestled in moss, tilt-shift macro, enchanting miniature'],
    ['Autumn mushroom', 'a tiny mushroom cottage among fallen autumn leaves, warm window glow, tilt-shift macro, cozy miniature'],
    ['Firefly mushroom', 'a tiny mushroom cottage at dusk with a firefly glowing by the door, tilt-shift macro, magical miniature'],
  ],
};

const argBot = (() => {
  const i = process.argv.indexOf('--bot');
  return i > -1 ? process.argv[i + 1] : null;
})();
const FUN = process.argv.includes('--fun');
const ROUND3 = process.argv.includes('--round3');
const ROUND4 = process.argv.includes('--round4');

async function genOne(bot, idx, label, prompt) {
  const url = await flux({ prompt: prompt + TAIL, aspectRatio: '1:1', model: MODEL, replicateKey: KEY });
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  const file = path.join(OUT, `${bot}-${idx}.jpg`);
  await sharp(buf).resize(512, 512, { fit: 'cover' }).jpeg({ quality: 90 }).toFile(file);
  return { file, label, prompt };
}

(async () => {
  if (!KEY) throw new Error('REPLICATE_API_TOKEN missing');
  fs.mkdirSync(OUT, { recursive: true });
  const SET = ROUND4 ? ROUND4_CONCEPTS : ROUND3 ? ROUND3_CONCEPTS : FUN ? FUN_CONCEPTS : CONCEPTS;
  // Merge into the existing manifest so all rounds live side by side.
  const manifestPath = path.join(OUT, 'manifest.json');
  const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};
  const bots = argBot ? [argBot] : Object.keys(SET);
  const jobs = [];
  for (const bot of bots) {
    // Round 4 appends after whatever each bot already has (bots differ: 10 or 20).
    const OFFSET = ROUND4 ? (manifest[bot] || []).length : ROUND3 ? 10 : FUN ? 5 : 0;
    (SET[bot] || []).forEach(([label, prompt], i) =>
      jobs.push({ bot, idx: i + OFFSET, label, prompt })
    );
  }
  console.log(`Rendering ${jobs.length} avatar candidates (${bots.length} bots, ${MODEL})\n`);
  let cursor = 0;
  async function worker() {
    while (cursor < jobs.length) {
      const j = jobs[cursor++];
      try {
        const out = await genOne(j.bot, j.idx, j.label, j.prompt);
        (manifest[j.bot] = manifest[j.bot] || [])[j.idx] = out;
        console.log(`✅ ${j.bot}-${j.idx} ${j.label}`);
      } catch (e) {
        console.log(`❌ ${j.bot}-${j.idx}: ${e.message}`);
      }
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker));
  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
  const done = Object.values(manifest).flat().filter(Boolean).length;
  console.log(`\n${done}/${jobs.length} rendered -> ${OUT}`);
})();
