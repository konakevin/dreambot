/**
 * Shared seed generation logic.
 * Used by both generate-bot-seeds.js (standalone CLI) and
 * generate-bot-dreams.js (inline regen when pool exhausted).
 */

const Anthropic = require('@anthropic-ai/sdk');

// ── Bot seed configurations ──
// Each bot has 3+ strategies with prompt formulas.
// Characters in scenes are described by role/action only — never named,
// never specific appearance details (hair color, etc.) — let the AI choose.

const BOT_SEEDS = {
  dragonbot: {
    strategies: [
      { category: 'dragonbot_genre', prompt: 'an epic cinematic fantasy scene that is mind blowingly exotic and beautiful in one of these genres: middle earth, lord of the rings, harry potter, wheel of time, game of thrones — sweeping cinematic perspectives with deep atmospheric depth, theatrical lighting with golden hour warmth and ethereal glows, dramatic rim lighting, supernatural illumination, rich color palettes with mystical accents' },
      { category: 'dragonbot_genre_dedup', prompt: 'an epic cinematic fantasy scene that is mind blowingly exotic and beautiful in one of these genres: middle earth, lord of the rings, harry potter, wheel of time, game of thrones — sweeping cinematic perspectives with deep atmospheric depth, theatrical lighting with golden hour warmth and ethereal glows, dramatic rim lighting, supernatural illumination, rich color palettes with mystical accents', continueDedup: true },
      { category: 'dragonbot_landscape', prompt: 'an epic fantasy landscape that is exotic and mind blowingly beautiful and interesting to look at — sweeping cinematic vistas, deep atmospheric perspective with layered depth, dramatic theatrical lighting (golden hour warmth, ethereal glows, god rays through clouds), rich earth tones with mystical accent colors, supernatural magical atmosphere', separateDedup: true },
    ],
  },
  mangabot: {
    strategies: [
      { category: 'mangabot_genre', prompt: 'an extremely interesting and visually appealing scene rooted in Japanese culture and anime — draw from the full spectrum: modern anime (ghibli, makoto shinkai, demon slayer, spirited away, evangelion, princess mononoke, akira, ghost in the shell), traditional Japan (samurai, ronin, geisha, ninja, Edo period, torii gates, shrines, pagodas, cherry blossoms, bamboo forests), mythology (kitsune fox spirits, yokai, oni demons, tengu, tanuki, kami, dragons), futuristic Japan (Neo-Tokyo, cyberpunk alleys, neon). Characters exist naturally described only by role (a warrior, a spirit, a creature) never by name or specific appearance.' },
      { category: 'mangabot_genre_dedup', prompt: 'an extremely interesting and visually appealing scene rooted in Japanese culture and anime — draw from the full spectrum: modern anime (ghibli, makoto shinkai, demon slayer, spirited away, evangelion, princess mononoke, akira, ghost in the shell), traditional Japan (samurai, ronin, geisha, ninja, Edo period, torii gates, shrines, pagodas, cherry blossoms, bamboo forests), mythology (kitsune fox spirits, yokai, oni demons, tengu, tanuki, kami, dragons), futuristic Japan (Neo-Tokyo, cyberpunk alleys, neon). Characters exist naturally described only by role (a warrior, a spirit, a creature) never by name or specific appearance.', continueDedup: true },
      { category: 'mangabot_landscape', prompt: 'a beautiful Japanese landscape or environment — pull from across all Japanese settings: ancient shrines in misty mountains, zen gardens, rice paddies at sunset, cherry blossom festivals, koi ponds, bamboo groves, torii gates at forest edges, Edo-period streets, Neo-Tokyo neon alleys, traditional tatami interiors, mountain villages, cedar forests where spirits dwell. Pure environment, no characters, no people.', separateDedup: true },
      { category: 'mangabot_mythology', prompt: 'a hauntingly beautiful scene featuring a Japanese mythological creature or spirit — kitsune (nine-tailed fox), yokai (yokai demons and ghosts), tengu (mountain spirit), tanuki (shape-shifter), oni (ogre), kami (nature spirits), ryujin (dragon king), yuki-onna (snow woman), nekomata (cat spirit). Place them in appropriately mythical settings: shrines, moonlit forests, ancient temples, mist-shrouded mountains. Render in beautiful anime illustration style.', separateDedup: true },
      { category: 'mangabot_cute', prompt: 'an adorable heartwarming anime scene inspired by the feeling of totoro, ponyo, kiki — characters exist naturally described only by role (a girl, a spirit, a cat, a creature) never by name or appearance details. Big expressive eyes, warm cozy atmosphere. Japanese cultural elements welcome: tatami rooms, bento boxes, tanabata festivals, summer fireworks, schoolgirls walking past shrines.', separateDedup: true },
    ],
  },
  starbot: {
    strategies: [
      { category: 'starbot_genre', prompt: 'a mind-bending surreal sci-fi scene that is visually stunning and awe-inspiring from worlds like blade runner, dune, interstellar, alien, 2001 a space odyssey, arrival, annihilation' },
      { category: 'starbot_genre_dedup', prompt: 'a mind-bending surreal sci-fi scene that is visually stunning and awe-inspiring from worlds like blade runner, dune, interstellar, alien, 2001 a space odyssey, arrival, annihilation', continueDedup: true },
      { category: 'starbot_landscape', prompt: 'an impossibly beautiful alien landscape or cosmic vista that defies physics and takes your breath away', separateDedup: true },
      { category: 'starbot_spacebattle', prompt: 'an epic expansive gorgeous looking space opera battle scene set in the interstellar reaches of outerspace', noDedup: true },
      { category: 'starbot_interior', prompt: 'Epic and beautiful interior shot of a building, space ship, or natural structure in the sci-fi genre', separateDedup: true },
      { category: 'starbot_cozyinterior', prompt: 'cozy and beautiful interior shot of a building, space ship, or natural structure in the sci-fi genre', separateDedup: true },
      { category: 'starbot_robot', prompt: 'a beautiful sci-fi scene with a robot having a human moment in a tranquil setting — the robot can be any form: humanoid, industrial, tiny companion bot, massive mech, ancient rusted machine, sleek drone, bio-mechanical hybrid', separateDedup: true },
      { category: 'starbot_city', prompt: 'an expansive, vast sci-fi city viewed from above on an alien world out in the far off reaches of space', noDedup: true },
      { category: 'starbot_androidwoman', prompt: 'an intimate close-up shot of an exquisitely attractive sci-fi android woman — she must be visibly MECHANICAL: exposed circuitry, chrome plating, glowing seams between skin and metal, visible joints, translucent panels showing inner workings, cybernetic implants. Alien aesthetic — alluring and provocative, scantily clad is fine and encouraged. Vary everything: skin tone, hair, eyes, body type (curvy, skinny, athletic, voluptuous, petite), the ratio of skin to machine. She can be seductive but never nude.', separateDedup: true, extractPrompt: 'From this scene give THREE words: the skin tone, the pose, and the unique mechanical feature. Comma separated. Example: bronze, reclining, glowing chest panel' },
    ],
  },
  sirenbot: {
    strategies: [
      { category: 'sirenbot_femalebody', prompt: 'a shot of an exquisitely beautiful and dangerous high fantasy woman — scantily clad is fine and encouraged. Fierce and seductive, dont-fuck-with-me energy. ALWAYS covered enough to avoid nudity but showing skin is great. Vary the race wildly: elf, half-dragon, gnome, dwarf, orc, tiefling, drow, fairy, nymph, centaur, harpy, lamia, succubus, half-giant, goblin princess, merfolk. Ornate flashy details: enchanted armor, magical tattoos, glowing runes, jeweled accessories. Sexy but never nude, never topless.', separateDedup: true, extractPrompt: 'From this scene give THREE words: the race, the pose, and the unique accessory. Comma separated. Example: tiefling, crouching, enchanted gauntlets' },
      { category: 'sirenbot_femaleaction', prompt: 'a shot of an exquisitely beautiful and dangerous high fantasy woman in the heat of action — casting a devastating spell, swinging an enchanted blade, commanding an army, riding a dragon, leaping through battle. Never floating in place, never hovering — always in dynamic motion. Fierce and seductive, scantily clad is fine and encouraged. Ornate flashy details. Vary the race wildly. Sexy but never nude, never topless.', separateDedup: true, extractPrompt: 'From this scene give THREE words: the race, the action, and the weapon/spell. Comma separated. Example: drow, leaping, fire spell' },
      { category: 'sirenbot_femaleface', prompt: 'a close-up shot of the face and head of an exquisitely beautiful high fantasy woman — exotic magical features, glowing eyes, enchanted markings, pointed ears, horns, scales, or ethereal glow. Fierce and seductive expression. Vary everything: race, features, skin tone, magical details.', separateDedup: true, extractPrompt: 'From this scene give THREE words: the race, the eye color, and the unique facial feature. Comma separated. Example: elf, violet, glowing runes' },
      { category: 'sirenbot_malebody', prompt: 'a shot of a powerful and menacing high fantasy warrior — fierce, dangerous, alpha male energy. Battle-scarred, muscular, intimidating. Warlords, dark knights, barbarian kings, demon hunters, dragon slayers, shadow assassins. Ornate flashy details: enchanted weapons, runic war paint, battle armor, glowing eyes. Vary the race wildly: orc, half-dragon, dwarf, tiefling, elf, human, goliath, minotaur, undead knight.', separateDedup: true, extractPrompt: 'From this scene give THREE words: the race, the pose, and the weapon. Comma separated. Example: orc, kneeling, war hammer' },
      { category: 'sirenbot_maleface', prompt: 'a close-up shot of the face and head of a powerful and menacing high fantasy male warrior — battle-scarred, fierce eyes, war paint, enchanted markings, horns, tusks, or glowing runes. Dangerous and intimidating. Vary everything: race, features, skin tone, scars, war paint, facial accessories.', separateDedup: true, extractPrompt: 'From this scene give THREE words: the race, the eye color, and the unique facial feature. Comma separated. Example: minotaur, amber, runic scars' },
      { category: 'sirenbot_maleaction', prompt: 'a shot of a powerful and menacing high fantasy male warrior in the heat of action — always in dynamic motion, never floating. Battle-scarred, muscular, intimidating. Ornate flashy details. Vary the race wildly.', separateDedup: true, extractPrompt: 'From this scene give THREE words: the race, the action, and the weapon. Comma separated. Example: goliath, charging, twin axes' },
      { category: 'sirenbot_seductive', prompt: 'an exquisitely beautiful sexy FEMALE high fantasy woman in a sizzling, provocative pose in an exotic fantasy setting. She is feminine, gorgeous, seductive, mysterious and dangerous. Showing skin, scantily clad. No nipples showing. Fantasy art style makes it feel like mythic fine art. Vary race wildly. No nudity.', separateDedup: true, extractPrompt: 'From this scene give THREE words: the race, the pose, and the setting. Comma separated. Example: nymph, reclining, moonlit pool' },
    ],
  },
  gothbot: {
    strategies: [
      { category: 'gothbot_genre', prompt: 'a hauntingly beautiful dark fantasy scene from worlds like dark souls, elden ring, bloodborne, tim burton films, gothic fairy tales, castlevania, berserk, sleepy hollow, crimson peak, pan\'s labyrinth — beautiful but unsettling, elegant darkness', extractPrompt: 'From this scene give THREE words: the setting, the character role, and the key prop. Comma separated. Example: ballroom, knight, roses' },
      { category: 'gothbot_genre_dedup', prompt: 'a hauntingly beautiful dark fantasy scene from worlds like dark souls, elden ring, bloodborne, tim burton films, gothic fairy tales, castlevania, berserk, sleepy hollow, crimson peak, pan\'s labyrinth — beautiful but unsettling, elegant darkness', continueDedup: true, extractPrompt: 'From this scene give THREE words: the setting, the character role, and the key prop. Comma separated. Example: ballroom, knight, roses' },
      { category: 'gothbot_landscape', prompt: 'a dark and beautiful gothic landscape — haunted, atmospheric, mysterious, but stunningly gorgeous. Pure environment, no characters, no people, no figures.', separateDedup: true, extractPrompt: 'From this scene give THREE words: the structure type, the weather, and the light source. Comma separated. Example: bridge, fog, moonlight' },
      { category: 'gothbot_horror', prompt: 'Pick ONE: werewolf, vampire, demon, succubus, goblin, banshee, wraith, ghoul, lich, hellhound, wendigo, gargoyle, revenant, specter, chimera, basilisk, manticore, kraken, shade, phantom. Then describe a never-before-seen reimagining of that creature — powerful, terrifying, radiating malice. No blood, no gore, no clowns. Pure darkness and dread. Vary the action: stalking, lunging, perched, crawling, hovering, emerging from shadows, mid-howl, watching from above.', separateDedup: true, extractPrompt: 'From this scene give THREE words: the creature type, the action, and the setting. Comma separated. Example: wendigo, stalking, forest' },
      {
        category: 'gothbot_gothwoman', count: 30, separateDedup: true,
        prompt: 'an exquisitely exotic and beautiful goth woman from the bowels of hell. Evil incarnate but so pretty she lures you in with her evil smile only to destroy you. Glowing colored eyes, fangs, sharp claws, dark lipstick, tattoos, piercings, showing lots of skin. Include a unique dark accessory or feature (horns, crown, chains, wings, veil, thorns, serpents, third eye, antlers, halo). She MUST be visibly female. No nipples, never nude, no skeletons. Dynamic pose.',
        extractPrompt: 'From this scene give THREE words: the pose, the eye color, and the unique accessory. Comma separated. Example: lounging, crimson, horns',
      },
      {
        category: 'gothbot_castlevania', separateDedup: true,
        prompt: 'a richly painterly dark fantasy scene in the style of Castlevania game art, Bloodborne concept art, Berserk manga, and classic gothic horror illustrations. Think: vampire hunters, Belmont clan energy, cursed cathedrals, gargoyle statues, wrought iron gates, stained glass windows bleeding crimson light, moonlit castle courtyards, cobblestone streets shrouded in fog, werewolves lurking in shadows, gothic nobility in ornate period dress, candlelit crypts, blood moon skies. Characters include: pale vampire lords in Victorian fashion, wandering hunters with silver weapons, cursed priests, noble ghosts, elegant monsters. Render as a detailed painterly illustration with dramatic chiaroscuro lighting, deep purples and crimsons against midnight blacks, rich atmospheric depth, ornate gothic detail. Hauntingly beautiful, darkly romantic, classical gothic horror made gorgeous.',
        extractPrompt: 'From this scene give THREE words: the character or creature, the gothic setting, and the key prop. Comma separated. Example: vampire, cathedral, silver crossbow',
      },
    ],
  },
  glowbot: {
    strategies: [
      { category: 'glowbot_genre', prompt: 'an ethereally beautiful scene that takes your breath away — soft divine light, magical atmosphere, transcendent beauty from worlds like lord of the rings, studio ghibli, narnia' },
      { category: 'glowbot_genre_dedup', prompt: 'an ethereally beautiful scene that takes your breath away — soft divine light, magical atmosphere, transcendent beauty from worlds like lord of the rings, studio ghibli, narnia', continueDedup: true },
      { category: 'glowbot_landscape', prompt: 'a breathtakingly beautiful landscape that feels like a painting you would hang in your home — serene, luminous, peaceful', separateDedup: true },
    ],
  },
  earthbot: {
    strategies: [
      { category: 'earthbot_genre', prompt: 'an awe-inspiring nature scene that looks real but impossibly beautiful — the kind of place that cant possibly exist but you desperately wish it did, like avatar pandora or patagonia or iceland. Sweeping panoramic vista, deep atmospheric depth, golden hour lighting, dramatic cloud formations, god rays, rich saturated colors' },
      { category: 'earthbot_genre_dedup', prompt: 'an awe-inspiring nature scene that looks real but impossibly beautiful — the kind of place that cant possibly exist but you desperately wish it did, like avatar pandora or patagonia or iceland. Sweeping panoramic vista, deep atmospheric depth, golden hour lighting, dramatic cloud formations, god rays, rich saturated colors', continueDedup: true },
      { category: 'earthbot_landscape', prompt: 'an impossibly beautiful natural landscape — dramatic cinematic lighting, perfect conditions, the most stunning version of earth or an alien world. Sweeping wide vista framing, deep atmospheric perspective, golden hour or magic hour lighting, dramatic skies, god rays streaming through clouds, rich saturated nature colors', separateDedup: true },
    ],
  },
  toybot: {
    strategies: [
      {
        category: 'toybot_lego', count: 20,
        prompt: 'an EPIC scene built entirely in LEGO — every surface is LEGO bricks, every character is a minifigure, every prop is a brick-built element. A LEGO castle under siege with catapults and knights, a LEGO space station with astronaut minifigs floating through brick corridors, a LEGO city street at night with glowing windows, a LEGO pirate ship battling a brick-built kraken, a LEGO medieval village with a dragon overhead. The detail should be OBSESSIVE — you can see individual studs, transparent pieces for windows and water, printed faces on minifigs. Dramatic lighting on plastic bricks.',
        separateDedup: true,
        extractPrompt: 'From this scene give TWO words: the LEGO theme and the key element. Comma separated. Example: castle, siege',
      },
      {
        category: 'toybot_claymation',
        prompt: 'a scene that looks like it is from a stop-motion CLAYMATION or PLAY-DOH film — Wallace & Gromit, Shaun the Sheep, Coraline, Kubo, Laika studio energy, or bright colorful Play-Doh creations. Everything is made of CLAY or PLAY-DOH — you can see fingerprints in the material, the slightly lumpy handcrafted texture, the warm imperfect charm, the bright primary colors of Play-Doh or the muted earth tones of professional clay. Characters with clay bodies and painted eyes. Sets that look built on a tabletop with real tiny props. Warm lighting like a practical film set. Charming, handmade, alive.',
        separateDedup: true,
        extractPrompt: 'From this scene give TWO words: the character type and the setting. Comma separated. Example: dog, kitchen',
      },
      {
        category: 'toybot_vinyl',
        prompt: 'a dramatic diorama scene starring VINYL COLLECTIBLE FIGURES — Funko Pop style, designer toy aesthetic, Kidrobot energy. Oversized heads, tiny bodies, glossy plastic sheen, painted-on details. A vinyl samurai figure standing on a tiny bonsai mountain, a vinyl astronaut on a miniature moon, vinyl medieval knights in a tabletop castle siege, a vinyl detective in a noir diorama. The figures should look like REAL PHYSICAL VINYL TOYS photographed with dramatic cinematic lighting in handcrafted miniature sets.',
        separateDedup: true,
        extractPrompt: 'From this scene give TWO words: the vinyl character and the diorama. Comma separated. Example: astronaut, moon',
      },
      {
        category: 'toybot_action_figure', count: 20,
        prompt: 'an EPIC dramatic scene of ACTION FIGURES — real plastic toys with visible joint articulation, plastic sheen, molded hair, painted-on details, toy-scale weapons and accessories. Shot like high-end toy photography with dramatic lighting. Think: giant transforming robot figures battling on a shelf with explosion effects, muscular barbarian warrior figures storming a playset castle, space marine figures in a diorama moonbase, ninja figures mid-kick on a rooftop playset, kaiju monster figures destroying a miniature city. The figures should look like REAL PHYSICAL 80s/90s ACTION FIGURES — chunky sculpts, bold primary colors, over-the-top muscles and weapons. Dramatic cinematic lighting makes cheap plastic look epic. The gap between "its just a toy" and "that looks like a movie" IS the magic.',
        separateDedup: true,
        extractPrompt: 'From this scene give TWO words: the figure type and the action. Comma separated. Example: robot, battling',
      },
      {
        category: 'toybot_everyday',
        prompt: 'mundane everyday human activities rendered with TOY FIGURES — the charming absurdity of toys living normal lives. LEGO minifigures having a dinner party with brick-built food, claymation characters waiting for a bus in the rain, vinyl figures doing laundry in a tiny laundromat, action figures grocery shopping with miniature carts, plush animals commuting on a toy train. The activity should be completely ORDINARY (cooking, cleaning, commuting, working, relaxing) but the toy rendering makes it unexpectedly delightful and funny.',
        separateDedup: true,
        extractPrompt: 'From this scene give TWO words: the toy type and the mundane activity. Comma separated. Example: lego, dinner-party',
      },
    ],
  },
  cuddlebot: {
    strategies: [
      { category: 'cuddlebot_genre', prompt: 'an adorable and heartwarming scene that makes people smile — cute creatures, cozy spaces, warm light, inspired by pixar, sanrio, studio ghibli cozy moments' },
      { category: 'cuddlebot_genre_dedup', prompt: 'an adorable and heartwarming scene that makes people smile — cute creatures, cozy spaces, warm light, inspired by pixar, sanrio, studio ghibli cozy moments', continueDedup: true },
      { category: 'cuddlebot_landscape', prompt: 'a cute and cozy miniature world that feels warm and inviting — tiny details, soft lighting, the kind of place you want to shrink down and live in', separateDedup: true },
      {
        category: 'cuddlebot_plushie', count: 20,
        prompt: 'a scene of PLUSHIE STUFFED ANIMALS living their lives like Toy Story — the plushies are ALIVE, interacting with each other and their environment in adorable ways. They have visible stitching, button eyes, soft fuzzy fabric, and slightly floppy limbs. Think: a group of plushie bears having a tiny picnic on a blanket with miniature sandwiches, plushie bunnies watching a movie on a tiny TV with popcorn, a plushie cat reading a tiny book by lamplight, plushie puppies playing board games on the floor, plushies camping in a pillow fort with fairy lights, a plushie tea party with tiny cups and cookies, plushies cooking together in a dollhouse kitchen, plushies stargazing from a windowsill at night. The plushies are the CHARACTERS — they have personality, they are doing something SPECIFIC and heartwarming. The scene should make you want to hug your childhood stuffed animal. Soft warm lighting, cozy settings, impossibly cute.',
        separateDedup: true,
        extractPrompt: 'From this scene give TWO words: the plushie animal type and the activity. Comma separated. Example: bears, picnic',
      },
    ],
  },
  // ── New bots — base prompts for iteration ──
  coquettebot: {
    strategies: [
      {
        category: 'coquettebot_creatures', count: 20,
        prompt: 'the MOST ADORABLE thing you have ever seen — a tiny cute creature in a soft pastel setting that makes girls absolutely LOSE THEIR MINDS with cuteness. Baby bunnies in teacups with flower crowns, kittens sleeping in rose petals, tiny fantasy dragons with HUGE sparkly eyes curled in silk ribbons, crystal foxes on pink clouds, fairy kittens with butterfly wings, hedgehogs in tiny knit sweaters, baby deer with butterflies on their nose, cloud puppies, iridescent baby birds, tiny unicorn foals. Make up ADORABLE creatures that dont exist — fantasy pets with big dewy eyes. Every creature must have BIG EYES. Every setting must be SOFT PASTEL PINK. The image should make someone literally say "OH MY GOD" out loud.',
        separateDedup: true,
        extractPrompt: 'From this scene give TWO words: the creature and the setting. Comma separated. Example: bunny, teacup',
      },
      {
        category: 'coquettebot_scenes',
        prompt: 'the prettiest most adorable cottagecore/fairy/princess scene that girls want to LIVE IN — a fairy door in a mossy tree with tiny lanterns and pink mushrooms, a picnic blanket with strawberries and pink macarons and wildflowers, a pink velvet bedroom with canopy bed and fairy lights and stuffed animals, a ballet studio with pink tulle and mirrors, a tiny Parisian café with pink awning and pastries, a bookshop with climbing roses and window seat and blankets. Everything PASTEL, everything SOFT, everything makes you want to climb inside the screen.',
        separateDedup: true,
        extractPrompt: 'From this scene give TWO words: the main element and the setting. Comma separated. Example: macarons, picnic',
      },
      {
        category: 'coquettebot_nature',
        prompt: 'the GIRLIEST nature scene possible — nature but make it PINK. Cherry blossom paths with petals falling like pink snow, fields of pink peonies stretching forever, pastel sunsets over still water with a single white bunny, a garden path lined with roses and butterflies everywhere, lavender fields at golden hour with dragonflies, a meadow of wildflowers in pastels with dewdrops catching rainbow light. Soft, dreamy, impossibly pretty.',
        separateDedup: true,
        extractPrompt: 'From this scene give TWO words: the flower and the setting. Comma separated. Example: cherry-blossom, path',
      },
      {
        category: 'coquettebot_sweet',
        prompt: 'food and treats SO PRETTY you could never eat them in a FANTASTICAL whimsical setting — a tower of pink macarons on a marble stand in a fairy kitchen, a strawberry cake being decorated by tiny mice in aprons, a princess arranging petit fours in a rose garden, a bunny barista making latte art in a pastel café, a magical bakery run by hedgehogs in tiny hats. If characters are present they must be WHIMSICAL — cute animals, fairy-tale princesses, tiny magical creatures. NEVER a realistic human chef or pastry worker. Everything pink, pastel, fantastical, precious. NEVER repeat the same food item — every seed must feature a DIFFERENT treat.',
        separateDedup: true,
        extractPrompt: 'From this scene give ONE word: the specific food item (macarons, cake, croissant, latte, cupcake, etc). ONE word only.',
      },
      {
        category: 'coquettebot_fashion',
        prompt: 'coquette fashion moment that makes girls think "I WANT TO BE HER" — ribbon-laced corsets with pearl details, ballet slippers on marble floors, silk bows in perfectly curled hair, lace gloves holding a single rose, pink velvet everything, a vanity table dripping with perfume bottles and pearls and soft golden light, a girl twirling in a tulle skirt in a flower field. Soft, feminine, aspirational, princess energy. Characters described by outfit and pose only, never named.',
        separateDedup: true,
        extractPrompt: 'From this scene give TWO words: the fashion item and the setting. Comma separated. Example: corset, garden',
      },
    ],
  },
  steambot: {
    strategies: [
      {
        category: 'steambot_scene',
        prompt: 'a breathtakingly detailed steampunk scene that makes you want to LIVE in this world — brass and copper machinery, impossible clockwork contraptions, Victorian elegance meets industrial revolution. Airships docking at fog-shrouded towers, inventors in workshops overflowing with gears, steam-powered automatons serving tea, ornate mechanical birds in brass cages. From worlds like BioShock Infinite, Mortal Engines, Hugo, Howls Moving Castle. Every rivet, every gear, every steam wisp rendered with obsessive detail.',
        separateDedup: true,
        extractPrompt: 'From this scene give TWO words: the main machine/object and the setting. Comma separated. Example: airship, clocktower',
      },
      { category: 'steambot_scene_dedup', prompt: 'a breathtakingly detailed steampunk scene — brass machinery, clockwork contraptions, Victorian elegance meets industrial revolution. Airships, workshops, automatons, mechanical marvels. Every rivet and gear rendered with obsessive detail. BioShock Infinite, Mortal Engines, Howls Moving Castle energy.', continueDedup: true, extractPrompt: 'From this scene give TWO words: the main machine/object and the setting. Comma separated. Example: automaton, workshop' },
      {
        category: 'steambot_landscape',
        prompt: 'a VAST steampunk cityscape or landscape that takes your breath away — brass spires piercing fog, steam vents creating clouds between clockwork bridges, airship docks bustling overhead, Victorian architecture with impossible mechanical additions — entire buildings that are machines, clock faces the size of cathedrals, copper domes with spinning gyroscopes. Pure environment at MASSIVE scale. Golden hour or foggy dawn.',
        separateDedup: true,
        extractPrompt: 'From this scene give TWO words: the main structure and the atmosphere. Comma separated. Example: clocktower, fog',
      },
      {
        category: 'steambot_machine',
        prompt: 'a BEAUTIFUL steampunk machine rendered in loving closeup detail — an ornate clockwork heart with spinning gears, a brass telescope with impossible lenses, a steam-powered music box with dancing automatons, an orrery of spinning planets, a mechanical flower that opens and closes. The machine itself is the art — every gear, every spring, every polished surface. Dramatic warm lighting on copper and brass.',
        separateDedup: true,
        extractPrompt: 'From this scene give TWO words: the machine type and the material. Comma separated. Example: orrery, brass',
      },
    ],
  },
  tinybot: {
    strategies: [
      {
        category: 'tinybot_diorama', count: 20,
        prompt: 'an impossibly detailed miniature diorama that makes you want to SHRINK DOWN and live inside it — tilt-shift photography, extreme shallow depth of field, macro lens feel. A tiny perfect village with smoke coming from chimneys, a miniature train station with working lights, a dollhouse-scale bakery with tiny pastries in the window, a small garden with individual flowers you can count. Every miniature detail is PERFECT. The kind of scene that makes you stare for five minutes finding new details.',
        separateDedup: true,
        extractPrompt: 'From this scene give TWO words: the miniature subject and the setting type. Comma separated. Example: bakery, village',
      },
      {
        category: 'tinybot_landscape',
        prompt: 'a miniature landscape so perfect it looks handcrafted by a master model-maker — rolling hills with individual tiny trees, a little river with a stone bridge, perfectly manicured hedges, soft golden lighting that makes everything glow. Tilt-shift effect, macro lens, impossibly detailed at micro scale. Pure environment — the landscape itself is the marvel. Like looking at a snow globe from inside.',
        separateDedup: true,
        extractPrompt: 'From this scene give TWO words: the terrain feature and the season. Comma separated. Example: river-bridge, autumn',
      },
      {
        category: 'tinybot_nature_macro',
        prompt: 'real nature rendered at MINIATURE SCALE so it looks like a tiny fantasy world — a mushroom that looks like a house with a door, a dewdrop that contains a reflected universe, an acorn cap that looks like a tiny swimming pool, moss that looks like a forest from above, a snail shell that looks like a cathedral. The magic of macro photography where real nature becomes a miniature kingdom.',
        separateDedup: true,
        extractPrompt: 'From this scene give TWO words: the natural element and what it resembles. Comma separated. Example: mushroom, house',
      },
      {
        category: 'tinybot_urban',
        prompt: 'a tiny perfect miniature city or urban scene — a model train running through a miniature downtown, tiny shop fronts with working neon signs, a miniature street market with individual tiny produce, little café tables with microscopic coffee cups. Tilt-shift photography makes real-looking things feel dollhouse-scale. Warm evening lighting, every window glowing.',
        separateDedup: true,
        extractPrompt: 'From this scene give TWO words: the urban element and the time of day. Comma separated. Example: café, evening',
      },
    ],
  },
  bloombot: {
    strategies: [
      {
        category: 'bloombot_landscape',
        prompt: 'imagine the Garden of Eden times 100 — an absolutely INSANE explosion of flowers across a jaw-dropping landscape. Flowers EVERYWHERE covering every surface, impossibly dense and lush, more blooms than physics allows. Pick a specific flower type AND a specific breathtaking setting (volcanic coastline, glacial valley, ancient ruins, tropical jungle, Hawaiian garden, Mediterranean cliffside, Icelandic black sand, bamboo forest, desert canyon, floating islands). The flower DOMINATES the scene. The setting is stunning. The combination should overwhelm with impossible beauty. This could NEVER exist in reality — only AI could create this.',
        separateDedup: true,
        extractPrompt: 'From this scene give TWO words: the flower type and the setting. Comma separated. Example: wisteria, cathedral',
      },
      {
        category: 'bloombot_landscape_dedup',
        prompt: 'imagine the Garden of Eden times 100 — an absolutely INSANE explosion of flowers across a jaw-dropping landscape. Flowers EVERYWHERE covering every surface, impossibly dense and lush, more blooms than physics allows. Pick a specific flower type AND a specific breathtaking setting (greenhouse, rooftop garden, moonlit grove, underwater cave, abandoned train station, spiral staircase tower, temple ruins, cloud forest, coral reef, glacier). The flower DOMINATES the scene. The setting is stunning. The combination should overwhelm with impossible beauty. This could NEVER exist in reality — only AI could create this.',
        continueDedup: true,
        extractPrompt: 'From this scene give TWO words: the flower type and the setting. Comma separated. Example: lotus, cenote',
      },
      {
        category: 'bloombot_portrait',
        prompt: 'an extreme closeup of a flower that is SO beautiful it doesnt look real — maybe a real flower rendered with impossible detail and physics-defying beauty, or a completely INVENTED botanical specimen from another world (crystal petals, bioluminescent veins, liquid mercury stems, frozen flame petals, nebula-colored stamen). Dramatic lighting — Rembrandt chiaroscuro, golden backlighting through translucent petals, dawn sidelight. Dark or bokeh background. Every vein and dewdrop visible. Fashion-editorial energy for a plant. The viewer should think "I have never seen anything this beautiful."',
        separateDedup: true,
        extractPrompt: 'From this scene give TWO words: the flower type and the lighting style. Comma separated. Example: protea, chiaroscuro',
      },
      {
        category: 'bloombot_surreal',
        prompt: 'a surreal impossible scene where flowers exist in a context that could ONLY happen through AI — flowers reclaiming an abandoned cathedral, a grand piano in a field completely consumed by roses, flowers growing underwater in a sunken ship, blooming from the surface of the moon, cascading from the strings of a harp, erupting from cracked mirrors, growing from ancient clockwork machinery. Or: a completely INVENTED impossible flower species — crystalline petals, aurora borealis blooms, flowers made of frozen light. The flowers are ALWAYS the hero and ALWAYS jaw-droppingly gorgeous. Beauty first, surrealism second.',
        separateDedup: true,
        extractPrompt: 'From this scene give TWO words: the flower type and the surreal element. Comma separated. Example: roses, piano',
      },
      {
        category: 'bloombot_cozy',
        prompt: 'the PRETTIEST flower setting in an interior space a person could dream of — flowers inside homes, cottagecore scenes, gorgeous vases of flowers in beautiful rooms, the warmest coziest most inviting floral interiors imaginable. Think: a rain-streaked cottage window with a wildflower box bursting with blooms, a massive vase of peonies on a farmhouse table with morning light streaming through linen curtains, a greenhouse with warm golden light and rain on the glass, a cozy reading nook with hanging plants and flower garlands, a tiny Parisian flower shop with buckets spilling onto cobblestones, a claw-foot bathtub filled with floating petals and candles, a bedroom nightstand with roses and soft amber lamp glow, a Victorian conservatory with climbing wisteria and old iron chairs, a sun-drenched kitchen drowning in sunflowers and wildflowers in mason jars. Cottagecore meets botanical paradise. The flowers are EVERYWHERE — impossibly abundant, lush, overflowing. The space is warm, golden, inviting. The prettiest interior flower scene you can possibly imagine.',
        separateDedup: true,
        extractPrompt: 'From this scene give TWO words: the flower type and the cozy setting. Comma separated. Example: peonies, kitchen',
      },
    ],
  },
  titanbot: {
    strategies: [
      {
        category: 'titanbot_deity', count: 20,
        prompt: 'a GOD or TITAN in the moment of their divine power — NOT a static portrait but a MOMENT. Zeus mid-thunderbolt with the sky splitting, Anubis weighing a soul with golden scales, Odin on Sleipnir crossing the Rainbow Bridge, Shiva mid-dance destroying a world, Athena emerging from Zeus head, Thor calling Mjolnir through a storm, Amaterasu stepping from a cave to light the world. Draw from ALL mythologies: Greek, Norse, Egyptian, Hindu, Celtic, Japanese, Mesopotamian, Aztec, Polynesian, African. Epic scale, divine power, the moment where myth becomes real. Characters described by role and action, never by specific appearance details.',
        separateDedup: true,
        extractPrompt: 'From this scene give TWO words: the deity and the divine action. Comma separated. Example: zeus, thunderbolt',
      },
      {
        category: 'titanbot_landscape',
        prompt: 'a LEGENDARY mythological landscape — the sacred places where gods walked, rendered with jaw-dropping beauty. Mount Olympus piercing golden clouds, Valhalla great hall with infinite warriors feasting, the Egyptian underworld river of stars, Avalon shrouded in eternal mist, the Gardens of Babylon hanging impossibly over desert, Asgard rainbow bridge spanning the cosmos, the Japanese spirit realm where kami dwell. Pure environment — no characters, just the PLACE itself radiating divine energy.',
        separateDedup: true,
        extractPrompt: 'From this scene give TWO words: the mythological place and the mythology. Comma separated. Example: valhalla, norse',
      },
      {
        category: 'titanbot_battle',
        prompt: 'a LEGENDARY mythological battle of cosmic scale — Ragnarok with gods and giants clashing as the world burns, the Titanomachy with Zeus overthrowing Kronos, Rama vs Ravana with divine weapons splitting the sky, Beowulf vs the Dragon, Perseus vs Medusa, the War of Troy at its most explosive. EPIC SCALE — armies of gods, cosmic destruction, divine weapons, the fate of worlds at stake. Beautiful and terrifying at once.',
        separateDedup: true,
        extractPrompt: 'From this scene give TWO words: the battle and the mythology. Comma separated. Example: ragnarok, norse',
      },
      {
        category: 'titanbot_creature',
        prompt: 'a mythological CREATURE reimagined as something NEVER seen before — a Phoenix reborn in an explosion of impossible colors, a Hydra with heads of different elements (fire, ice, lightning, shadow), Fenrir the wolf so large it swallows the horizon, a Thunderbird creating a storm with each wingbeat, Quetzalcoatl as a feathered serpent made of living jade and turquoise, a Sphinx with galaxy eyes. Classic creatures but rendered in jaw-dropping new ways. The creature should feel ANCIENT and POWERFUL.',
        separateDedup: true,
        extractPrompt: 'From this scene give TWO words: the creature and the reimagined feature. Comma separated. Example: phoenix, prismatic-flames',
      },
    ],
  },
};

async function withRetry(fn, maxRetries = 4) {
  const delays = [2000, 5000, 12000, 30000];
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const retryable = err.status === 429 || err.status === 529 || err.status >= 500;
      if (!retryable || attempt === maxRetries) throw err;
      const delay = delays[Math.min(attempt, delays.length - 1)];
      console.log(`   ⏳ ${err.status} overloaded, retrying in ${delay / 1000}s (attempt ${attempt + 1}/${maxRetries})...`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

async function generateScene(anthropic, basePrompt, banList) {
  const ban = banList.length > 0 ? ' DO NOT include: ' + banList.join(', ') : '';
  const msg = await withRetry(() => anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 60,
    messages: [
      {
        role: 'user',
        content:
          'Given: "' +
          basePrompt +
          ban +
          '"\nWrite ONE specific scene in 15-25 words. Characters described by role only, never named. Output ONLY the scene.',
      },
    ],
  }));
  return (msg.content[0].text || '').replace(/^["]+|["]+$/g, '').trim();
}

async function extractSubject(anthropic, scene, extractPrompt) {
  if (extractPrompt) {
    const msg = await withRetry(() => anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 20,
      messages: [{ role: 'user', content: extractPrompt + '\n\n' + scene }],
    }));
    return (msg.content[0].text || '').trim().toLowerCase().split(',').map(s => s.trim());
  }
  const msg = await withRetry(() => anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 10,
    messages: [{ role: 'user', content: 'One word for main element? ' + scene + '\nONE word.' }],
  }));
  return (msg.content[0].text || '').trim().toLowerCase();
}

/** Target total seeds per bot — every bot gets exactly this many regardless of strategy count */
const TARGET_SEEDS_PER_BOT = 75;

/**
 * Generate seeds for a bot. Returns rows without touching DB.
 * Each bot gets exactly TARGET_SEEDS_PER_BOT seeds, distributed evenly
 * across its strategies. A bot with 3 strategies gets 25 each. A bot
 * with 5 strategies gets 15 each. This makes it easy to verify all bots
 * generated correctly — anything less than 75 means something failed.
 *
 * @param {string} botUsername
 * @param {object} opts - { anthropicApiKey, totalTarget? }
 * @returns {{ rows: Array<{category: string, template: string}> }}
 */
async function generateSeedsForBot(botUsername, { anthropicApiKey, totalTarget = TARGET_SEEDS_PER_BOT }) {
  const config = BOT_SEEDS[botUsername];
  if (!config) {
    throw new Error('No seed config for bot: ' + botUsername);
  }

  const anthropic = new Anthropic({ apiKey: anthropicApiKey });
  const rows = [];
  let sharedBanList = [];

  // Distribute target evenly across strategies, giving remainder to the first ones
  const numStrategies = config.strategies.length;
  const basePerStrategy = Math.floor(totalTarget / numStrategies);
  const remainder = totalTarget % numStrategies;

  for (let si = 0; si < config.strategies.length; si++) {
    const strategy = config.strategies[si];
    const banList = strategy.separateDedup ? [] : sharedBanList;
    const stratCount = strategy.count || (basePerStrategy + (si < remainder ? 1 : 0));
    console.log(`--- ${stratCount} ${strategy.category} ---`);

    for (let i = 0; i < stratCount; i++) {
      const scene = await generateScene(anthropic, strategy.prompt, strategy.noDedup ? [] : banList);
      let subject = '-';
      if (!strategy.noDedup) {
        const extracted = await extractSubject(anthropic, scene, strategy.extractPrompt);
        if (Array.isArray(extracted)) {
          subject = extracted.join(', ');
          banList.push(...extracted);
        } else {
          subject = extracted;
          banList.push(extracted);
        }
        if (!strategy.separateDedup) sharedBanList = banList;
      }

      rows.push({ category: strategy.category, template: scene });
      console.log(rows.length + '. [' + subject + '] ' + scene);
    }
    console.log();
  }

  return { rows };
}

module.exports = { BOT_SEEDS, generateScene, extractSubject, generateSeedsForBot };
