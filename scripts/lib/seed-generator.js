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
  venusbot: {
    strategies: [
      { category: 'venusbot_androidwoman', prompt: 'an intimate close-up shot of an exquisitely attractive sci-fi android woman — she must be visibly MECHANICAL: exposed circuitry, chrome plating, glowing seams between skin and metal, visible joints, translucent panels showing inner workings, cybernetic implants. Alien aesthetic — alluring and provocative, scantily clad is fine and encouraged. Vary everything: skin tone, hair, eyes, body type (curvy, skinny, athletic, voluptuous, petite), the ratio of skin to machine. She can be seductive but never nude.', separateDedup: true, extractPrompt: 'From this scene give THREE words: the skin tone, the pose, and the unique mechanical feature. Comma separated. Example: bronze, reclining, glowing chest panel' },
      { category: 'venusbot_cyborgface', prompt: 'a close-up shot of the face and head of a sci-fi cyborg woman — part of her face is exposed chrome and circuitry, mechanical components, visible gears and wiring. She is still exquisitely beautiful despite being heavily mechanical. Sultry gaze, seductive expression. Vary everything: ratio of machine to skin, metal types, skin tone.', separateDedup: true, extractPrompt: 'From this scene give THREE words: the skin tone, the eye color, and the unique mechanical feature. Comma separated. Example: pale, neon-blue, exposed jawline gears' },
      { category: 'venusbot_alienface', prompt: 'a close-up shot of the face and head of an exquisitely beautiful woman who is half human half alien from somewhere far far away in outerspace — she leans towards the alien side in appearance. Exotic otherworldly features blended with human beauty. Sultry gaze, seductive expression. Vary everything: skin tone, alien features, eye color, facial structure.', separateDedup: true, extractPrompt: 'From this scene give THREE words: the skin tone, the eye color, and the unique alien feature. Comma separated. Example: lavender, gold, bioluminescent tendrils' },
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
  arcadebot: {
    strategies: [
      { category: 'arcadebot_genre', prompt: 'a visually stunning and interesting scene rendered in a creative toy or game art style — the contrast between the epic content and playful art style is the magic' },
      { category: 'arcadebot_genre_dedup', prompt: 'a visually stunning and interesting scene rendered in a creative toy or game art style — the contrast between the epic content and playful art style is the magic', continueDedup: true },
      { category: 'arcadebot_landscape', prompt: 'an epic and beautiful landscape or cityscape that would look amazing rendered in a toy or game art style', separateDedup: true },
      { category: 'arcadebot_retro', prompt: 'a stunning retro gaming scene that triggers pure nostalgia — inspired by classic games like zelda, final fantasy, chrono trigger, pokemon, mega man, metroid, castlevania', separateDedup: true },
    ],
  },
  cuddlebot: {
    strategies: [
      { category: 'cuddlebot_genre', prompt: 'an adorable and heartwarming scene that makes people smile — cute creatures, cozy spaces, warm light, inspired by pixar, sanrio, studio ghibli cozy moments' },
      { category: 'cuddlebot_genre_dedup', prompt: 'an adorable and heartwarming scene that makes people smile — cute creatures, cozy spaces, warm light, inspired by pixar, sanrio, studio ghibli cozy moments', continueDedup: true },
      { category: 'cuddlebot_landscape', prompt: 'a cute and cozy miniature world that feels warm and inviting — tiny details, soft lighting, the kind of place you want to shrink down and live in', separateDedup: true },
    ],
  },
  popbot: {
    strategies: [
      { category: 'popbot_genre', prompt: 'a bold and visually explosive art piece — vibrant maximalist energy from worlds like jazz age glamour, vintage movie posters, comic book splash pages, pop art, art deco architecture' },
      { category: 'popbot_genre_dedup', prompt: 'a bold and visually explosive art piece — vibrant maximalist energy from worlds like jazz age glamour, vintage movie posters, comic book splash pages, pop art, art deco architecture', continueDedup: true },
      { category: 'popbot_landscape', prompt: 'a stunning architectural or cityscape scene with bold geometric patterns, dramatic colors, and maximalist energy', separateDedup: true },
    ],
  },
  // ── New bots — base prompts for iteration ──
  coquettebot: {
    strategies: [
      { category: 'coquettebot_genre', prompt: 'an impossibly pretty and feminine scene dripping with coquette aesthetic — pink, soft, delicate, romantic. Think ballet slippers on marble floors, silk ribbons in the breeze, rose petals on a vanity mirror, pearls catching golden light. Princesses, fairy wings, lace, bows, soft glam. Everything is beautiful and dainty and makes you feel like royalty.' },
      { category: 'coquettebot_genre_dedup', prompt: 'an impossibly pretty and feminine scene dripping with coquette aesthetic — pink, soft, delicate, romantic. Think ballet slippers on marble floors, silk ribbons in the breeze, rose petals on a vanity mirror, pearls catching golden light. Princesses, fairy wings, lace, bows, soft glam. Everything is beautiful and dainty and makes you feel like royalty.', continueDedup: true },
      { category: 'coquettebot_landscape', prompt: 'a breathtakingly beautiful soft feminine landscape — cottagecore gardens, cherry blossom paths, pink sunsets, crystal clear lakes reflecting pastel skies. Pure environment, no characters, no people.', separateDedup: true },
    ],
  },
  safaribot: {
    strategies: [
      { category: 'safaribot_genre', prompt: 'a breathtakingly beautiful animal in a stunning natural setting — the kind of photo that makes you stop scrolling. Majestic, powerful, intimate. Think National Geographic but impossibly perfect. Lions at golden hour, wolves in misty forests, eagles over mountain peaks, whales breaching at sunset, foxes in snow, elephants at watering holes.' },
      { category: 'safaribot_genre_dedup', prompt: 'a breathtakingly beautiful animal in a stunning natural setting — the kind of photo that makes you stop scrolling. Majestic, powerful, intimate. Think National Geographic but impossibly perfect. Lions at golden hour, wolves in misty forests, eagles over mountain peaks, whales breaching at sunset, foxes in snow, elephants at watering holes.', continueDedup: true },
      { category: 'safaribot_landscape', prompt: 'a group of animals in a gorgeous natural scene — herds, flocks, packs in their element. The beauty of wildlife at scale. Pure nature, no humans.', separateDedup: true },
    ],
  },
  glambot: {
    strategies: [
      { category: 'glambot_genre', prompt: 'a stunning high fashion editorial shot — the kind of image you see in Vogue or on a runway. Exotic beauty, bold makeup, dramatic lighting, attitude. Tattoos, piercings, wild hair, statement accessories. The model is fierce, confident, untouchable. Fashion meets fine art. Vary everything: ethnicity, body type, style, setting.' },
      { category: 'glambot_genre_dedup', prompt: 'a stunning high fashion editorial shot — the kind of image you see in Vogue or on a runway. Exotic beauty, bold makeup, dramatic lighting, attitude. Tattoos, piercings, wild hair, statement accessories. The model is fierce, confident, untouchable. Fashion meets fine art. Vary everything: ethnicity, body type, style, setting.', continueDedup: true, extractPrompt: 'From this scene give THREE words: the style/outfit, the pose, and the setting. Comma separated. Example: avant-garde gown, strutting, rooftop' },
      { category: 'glambot_beauty', prompt: 'a close-up beauty shot of an extraordinarily striking face — bold artistic makeup, dramatic eyes, perfect skin, statement jewelry or face art. Editorial beauty photography that belongs on a magazine cover. Vary everything: ethnicity, skin tone, makeup style, hair.', separateDedup: true, extractPrompt: 'From this scene give THREE words: the ethnicity, the makeup style, and the unique feature. Comma separated. Example: korean, graphic eyeliner, gold leaf' },
    ],
  },
  steambot: {
    strategies: [
      { category: 'steambot_genre', prompt: 'a breathtakingly detailed steampunk scene — brass and copper machinery, impossible clockwork contraptions, Victorian elegance meets industrial revolution. Airships over fog-shrouded cities, inventors in workshops full of gears, steam-powered automatons, ornate mechanical devices. From worlds like BioShock Infinite, Mortal Engines, Hugo, Wild Wild West.' },
      { category: 'steambot_genre_dedup', prompt: 'a breathtakingly detailed steampunk scene — brass and copper machinery, impossible clockwork contraptions, Victorian elegance meets industrial revolution. Airships over fog-shrouded cities, inventors in workshops full of gears, steam-powered automatons, ornate mechanical devices. From worlds like BioShock Infinite, Mortal Engines, Hugo, Wild Wild West.', continueDedup: true },
      { category: 'steambot_landscape', prompt: 'a stunning steampunk cityscape or landscape — brass spires, steam vents, clockwork bridges, airship docks, Victorian architecture with impossible mechanical additions. Pure environment, no characters.', separateDedup: true },
    ],
  },
  tinybot: {
    strategies: [
      { category: 'tinybot_genre', prompt: 'an impossibly detailed miniature diorama scene — everything is tiny, like a perfectly crafted model. Tilt-shift photography, shallow depth of field, macro lens feel. Tiny houses, miniature streets, little gardens, small figurines in big worlds. The kind of scene that makes you want to shrink down and explore every tiny detail.' },
      { category: 'tinybot_genre_dedup', prompt: 'an impossibly detailed miniature diorama scene — everything is tiny, like a perfectly crafted model. Tilt-shift photography, shallow depth of field, macro lens feel. Tiny houses, miniature streets, little gardens, small figurines in big worlds. The kind of scene that makes you want to shrink down and explore every tiny detail.', continueDedup: true },
      { category: 'tinybot_landscape', prompt: 'a stunning miniature landscape that looks like a handcrafted model — rolling hills, tiny trees, little rivers, perfect lighting. Tilt-shift effect, macro lens, impossibly detailed. Pure environment, no characters.', separateDedup: true },
    ],
  },
  hauntbot: {
    strategies: [
      { category: 'hauntbot_genre', prompt: 'a hauntingly beautiful but deeply unsettling scene — something is wrong but you cant look away. Eerie, creepy, atmospheric horror that is gorgeous to look at. Think The Ring, Midsommar, It Follows, Hereditary, Silent Hill — beautiful cinematography of terrifying things. No gore, no blood, no jump scares. Pure dread and unease wrapped in beauty.' },
      { category: 'hauntbot_genre_dedup', prompt: 'a hauntingly beautiful but deeply unsettling scene — something is wrong but you cant look away. Eerie, creepy, atmospheric horror that is gorgeous to look at. Think The Ring, Midsommar, It Follows, Hereditary, Silent Hill — beautiful cinematography of terrifying things. No gore, no blood, no jump scares. Pure dread and unease wrapped in beauty.', continueDedup: true },
      { category: 'hauntbot_landscape', prompt: 'a stunningly beautiful but deeply unsettling landscape — places that feel wrong. Abandoned buildings reclaimed by nature, fog-choked forests, empty playgrounds at twilight, hallways that go on forever. Beautiful but you would never want to be there. No characters, no people, no figures.', separateDedup: true },
    ],
  },
  bloombot: {
    strategies: [
      { category: 'bloombot_genre', prompt: 'an overwhelmingly beautiful floral scene — flowers so gorgeous they dont look real. Lush gardens, wild meadows, flower markets, botanical arrangements, blooming cherry trees, fields of lavender, rose gardens after rain. The colors, the light, the detail — every petal is perfect. Think Monet meets National Geographic.' },
      { category: 'bloombot_genre_dedup', prompt: 'an overwhelmingly beautiful floral scene — flowers so gorgeous they dont look real. Lush gardens, wild meadows, flower markets, botanical arrangements, blooming cherry trees, fields of lavender, rose gardens after rain. The colors, the light, the detail — every petal is perfect. Think Monet meets National Geographic.', continueDedup: true },
      { category: 'bloombot_landscape', prompt: 'a breathtaking botanical landscape — endless flower fields, garden paths disappearing into bloom, greenhouses dripping with exotic plants, forest floors carpeted in wildflowers. Pure environment, no characters, no people.', separateDedup: true },
    ],
  },
  inkbot: {
    strategies: [
      { category: 'inkbot_genre', prompt: 'a stunning piece of tattoo art — bold lines, rich detail, the kind of design that makes you want to get it inked immediately. Flash sheet energy, ornamental patterns, neo-traditional creatures, geometric mandalas, Japanese irezumi dragons, blackwork skulls, fine-line botanicals, sacred geometry. Beautiful enough to hang on a wall.' },
      { category: 'inkbot_genre_dedup', prompt: 'a stunning piece of tattoo art — bold lines, rich detail, the kind of design that makes you want to get it inked immediately. Flash sheet energy, ornamental patterns, neo-traditional creatures, geometric mandalas, Japanese irezumi dragons, blackwork skulls, fine-line botanicals, sacred geometry. Beautiful enough to hang on a wall.', continueDedup: true },
      { category: 'inkbot_bodied', prompt: 'a close-up of incredible tattoo art ON skin — you can see the skin texture, the ink saturation, the placement on the body. Arm sleeves, back pieces, hand tattoos, chest pieces, leg sleeves. The artistry of tattoo as fine art on the human canvas.', separateDedup: true },
    ],
  },
  tripbot: {
    strategies: [
      { category: 'tripbot_genre', prompt: 'a mind-melting psychedelic vision — impossible colors, fractal geometry, reality dissolving into patterns. DMT machine elves, ayahuasca visions, kaleidoscope worlds, melting landscapes, cosmic consciousness expanding into infinity. Think Alex Grey, Android Jones, visionary art. Beautiful, overwhelming, transcendent.' },
      { category: 'tripbot_genre_dedup', prompt: 'a mind-melting psychedelic vision — impossible colors, fractal geometry, reality dissolving into patterns. DMT machine elves, ayahuasca visions, kaleidoscope worlds, melting landscapes, cosmic consciousness expanding into infinity. Think Alex Grey, Android Jones, visionary art. Beautiful, overwhelming, transcendent.', continueDedup: true },
      { category: 'tripbot_landscape', prompt: 'a psychedelic landscape where reality has completely dissolved — fractal mountains, liquid skies, impossible geometry stretching to infinity, bioluminescent everything. Pure visual overload, no characters, no people.', separateDedup: true },
    ],
  },
  titanbot: {
    strategies: [
      { category: 'titanbot_genre', prompt: 'an awe-inspiring mythological scene — gods, titans, legendary creatures from the great mythologies of the world. Greek gods on Mount Olympus, Norse warriors in Valhalla, Egyptian deities in golden temples, Hindu gods in cosmic battles, Celtic druids in ancient forests, Japanese kami in sacred shrines. Epic scale, divine power, ancient majesty.' },
      { category: 'titanbot_genre_dedup', prompt: 'an awe-inspiring mythological scene — gods, titans, legendary creatures from the great mythologies of the world. Greek gods on Mount Olympus, Norse warriors in Valhalla, Egyptian deities in golden temples, Hindu gods in cosmic battles, Celtic druids in ancient forests, Japanese kami in sacred shrines. Epic scale, divine power, ancient majesty.', continueDedup: true },
      { category: 'titanbot_landscape', prompt: 'a legendary mythological landscape — Mount Olympus piercing the clouds, the rainbow bridge Bifrost, the Egyptian underworld, Avalon shrouded in mist, the gardens of Babylon. Sacred places where gods walked. Pure environment, no characters.', separateDedup: true },
    ],
  },
};

async function generateScene(anthropic, basePrompt, banList) {
  const ban = banList.length > 0 ? ' DO NOT include: ' + banList.join(', ') : '';
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
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
  });
  return (msg.content[0].text || '').replace(/^["]+|["]+$/g, '').trim();
}

async function extractSubject(anthropic, scene, extractPrompt) {
  if (extractPrompt) {
    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 20,
      messages: [{ role: 'user', content: extractPrompt + '\n\n' + scene }],
    });
    return (msg.content[0].text || '').trim().toLowerCase().split(',').map(s => s.trim());
  }
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 10,
    messages: [{ role: 'user', content: 'One word for main element? ' + scene + '\nONE word.' }],
  });
  return (msg.content[0].text || '').trim().toLowerCase();
}

/**
 * Generate seeds for a bot. Returns rows without touching DB.
 * @param {string} botUsername
 * @param {object} opts - { anthropicApiKey, perStrategy? }
 * @returns {{ rows: Array<{category: string, template: string}> }}
 */
async function generateSeedsForBot(botUsername, { anthropicApiKey, perStrategy = 15 }) {
  const config = BOT_SEEDS[botUsername];
  if (!config) {
    throw new Error('No seed config for bot: ' + botUsername);
  }

  const anthropic = new Anthropic({ apiKey: anthropicApiKey });
  const rows = [];
  let sharedBanList = [];

  for (const strategy of config.strategies) {
    const banList = strategy.separateDedup ? [] : sharedBanList;
    const stratCount = strategy.count || perStrategy;
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
