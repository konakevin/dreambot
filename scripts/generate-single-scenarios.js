#!/usr/bin/env node
/**
 * Generate the SINGLE-character SPECIAL scene pools (goofy + elegant) for nightly
 * solo dreams — the single-cast counterpart to generate-dual-scenarios.js.
 * Batched by sub-theme bucket; each bucket is tagged gender any/male/female.
 * Each entry = { scene, attire }.
 *
 *   GOOFY   = random funny scenes (any era / absurd). Mostly gender-NEUTRAL; a few
 *             girly/guy flavor buckets.
 *   ELEGANT = pretty, dressed-up solo scenes across all eras. Gender-SPECIFIC
 *             attire (gowns/cute outfits for her, suits/tuxes for him).
 *
 * HARD RULES (face-swap solo PORTRAIT): the ONE person is the clear FOREGROUND
 * subject with a big clear face; background elements/animals never crowd/cover the
 * face; no other prominent people; face fully visible (no masks/hoods/face-paint);
 * tasteful; no minors. NO pose/gaze language (framing is locked downstream).
 *
 * Usage:
 *   node scripts/generate-single-scenarios.js --pool both --dry-run --buckets sample
 *   node scripts/generate-single-scenarios.js --pool goofy
 *   node scripts/generate-single-scenarios.js --pool elegant
 */
const { SONNET } = require('./lib/models');
require('dotenv').config({ path: '.env.local' });
const Anthropic = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(
  'https://jimftynwrinwenonjrlj.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const args = process.argv.slice(2);
const arg = (k, d) => {
  const i = args.indexOf(k);
  return i >= 0 ? args[i + 1] : d;
};
const POOL = arg('--pool', 'both');
const DRY = args.includes('--dry-run');
const BUCKET_FILTER = arg('--buckets', null);
// Optional per-bucket count override (applies to every selected bucket) —
// used for append runs, e.g. --count 60 to scale a 25-bucket to 85.
const COUNT_OVERRIDE = arg('--count', null) ? parseInt(arg('--count', null), 10) : null;

// Operation Sweet Dreams: fantastical scenes ban EVERY photo-real-adjacent
// medium (photoreal dragons/magic/creatures read as creepy CGI; noir/vintage/
// heirloom/overlay/glamour render semi-real styles badly). CSV in medium_ban;
// nightly-dreams parses it and re-rolls into the painterly face-swap mediums.
const PHOTO_ADJACENT_BAN =
  'photography,film_noir,vintage_film,double_exposure,heirloom,glamour';

// count = entries for that bucket. Goofy ~500 (mostly 'any'); elegant ~500 (even M/F).
const GOOFY_BUCKETS = [
  {
    key: 'time_travel',
    gender: 'any',
    count: 90,
    label: 'Time-travel comedy',
    desc: 'Funny PERIOD scenes — the person as a caveman in furs, a swashbuckling pirate, a medieval knight/peasant, a Roman gladiator, a viking, a wild-west cowboy, a 70s disco-goer, an ancient Egyptian, an astronaut on a fake moon set. The period costume is the joke. Face fully visible (no helmets/masks/face-paint).',
  },
  {
    key: 'fun_activities',
    gender: 'any',
    count: 90,
    label: 'Fun activities & adventures',
    desc: 'A fun/silly ACTIVITY in normal activity-clothes — bungee jumping, cruising a candy-colored lowrider, shredding an electric guitar on a small stage, on a rollercoaster mid-drop, go-karting, riding a mechanical bull, mid tandem-skydive, in a swan paddle boat.',
  },
  {
    key: 'animal_mayhem',
    gender: 'any',
    count: 85,
    label: 'Animal mayhem',
    desc: 'Funny animal situations, normal clothes — buried in a pile of puppies/kittens, photobombed by a llama leaning in from the side, a parrot perched on one shoulder, a giant fluffy dog sitting beside them, surrounded by a flock of flamingos in the background.',
  },
  {
    key: 'absurd_giant',
    mediumBan: PHOTO_ADJACENT_BAN, // photo-real-adjacent mediums read creepy for fantastical content
    gender: 'any',
    count: 85,
    label: 'Absurd & oversized',
    desc: 'Absurd modern situations / comically oversized props, normal clothes — waist-deep in a giant ball pit, in a room overflowing with balloons, beside a donut taller than them, holding a colossal ice-cream cone, in a confetti explosion, on a giant beanbag.',
  },
  {
    key: 'fantastical',
    mediumBan: PHOTO_ADJACENT_BAN, // photo-real-adjacent mediums read creepy for fantastical content
    gender: 'any',
    count: 60,
    label: 'Fantastical & silly',
    desc: 'Light fantasy/sci-fi comedy, readable — a selfie with a friendly cartoonish alien, a tiny dragon perched nearby, a goofy robot butler offering a snack, a friendly yeti leaning in from the side.',
  },
  {
    key: 'girly_fun',
    gender: 'female',
    count: 45,
    label: 'Girly fun',
    desc: 'Playful, glam, fun-girly scenes — a sparkly pop-star moment on a glitter stage, a whimsical over-the-top princess tea party, swept up in a swirl of fairy-godmother sparkles, a fun unicorn-themed party, a glam disco-diva spotlight. Bright, cute, joyful.',
  },
  {
    key: 'guy_fun',
    gender: 'male',
    count: 45,
    label: 'Guy fun',
    desc: 'Playful, fun-guy scenes — an air-guitar rockstar moment under stage lights, at a roaring monster-truck rally, proudly holding up a comically huge fish, a chaotic backyard BBQ grill-master moment, a gearhead in a cool garage with a muscle car.',
  },
  {
    key: 'glamour_shot_retro',
    gender: 'any',
    posePool: 'glamour', // migration 353: renders draw from the curated glamour pose pool
    mediumKey: 'photography', // migration 354: photo-genre parody — force the photo medium
    count: 25,
    label: 'Retro glamour-shot studio',
    desc: 'A cheesy 1980s/90s mall GLAMOUR SHOTS photo studio, played completely straight — soft-focus dreamy glow, an airbrushed studio backdrop (laser grid, misty pastel clouds, marbled gray, glittery starburst), wind-machine hair, dramatic studio spotlights, a white column or draped fake-fur prop nearby. The earnest cheese IS the joke. Attire carries it: acid-wash denim jacket off the shoulder, chunky pearls, a sequined top, teased/feathered hair, or a white suit with big shoulder pads.',
  },
  {
    key: 'decade_eras',
    gender: 'any',
    count: 25,
    label: 'Decade eras fashion',
    desc: "A stylized 20th-century DECADE portrait with the era's wild fashion played straight — 1940s swing-dance hall in victory rolls or high-waist trousers and suspenders, 1950s pastel diner with a milkshake in a poodle skirt or letterman jacket, 1960s mod go-go set in a geometric shift dress or slim suit, 1970s roller-disco rink in a flared jumpsuit under a disco ball, 1980s neon aerobics studio in leotard leg-warmers and headband, 1990s mall photo booth in a windbreaker and frosted denim, Y2K house party in metallic fashion and tiny sunglasses. The over-the-top era-accurate fashion is the fun; era-accurate setting details around them.",
  },
  {
    key: 'surreal_absurd',
    gender: 'any',
    count: 25,
    label: 'Surreal absurd (deadpan impossible)',
    desc: "A DEADPAN IMPOSSIBLE scene treated like a totally normal photo, normal clothes — sitting in a giant bowl of breakfast cereal with a huge spoon, lounging on an inflatable flamingo pool float on the gray surface of the moon with Earth in the sky, a fancy candlelit dinner at a tiny table on top of a highway billboard, an office cubicle set up underwater with fish swimming past, toasting a marshmallow over a tiny campfire in a fancy hotel lobby, waiting at a bus stop bench in the middle of a desert with a single traffic light. Every noun CONCRETE (a specific object, never a vague 'creature/figure'); ONE impossible idea per scene, played straight.",
  },
  {
    key: 'out_and_about',
    gender: 'any',
    count: 25,
    label: 'Out and about (classic fun outings)',
    desc: 'A wholesome classic FUN OUTING, normal everyday clothes — at the amusement park with a ferris wheel behind them, cotton candy at the county fair midway, on a picnic blanket with a wicker basket in a sunny park, a beach day with striped umbrellas and sandcastles, at the aquarium in front of a glowing floor-to-ceiling fish tank, at a pumpkin patch with wheelbarrows of pumpkins, apple picking in an orchard with a basket, at the zoo by the giraffe enclosure, a museum trip beside dinosaur skeletons, at a farmers market with armfuls of flowers and produce, mini golf by the windmill hole, a drive-in movie leaning on a classic car. Joyful, sunny, postcard-fun.',
  },
  {
    key: 'adorable_swarm',
    gender: 'any',
    count: 25,
    label: 'Adorable baby-animal swarm',
    desc: 'Joyfully mobbed by ADORABLE baby animals, normal clothes — knee-deep in a tumble of golden puppies, under a pile of fluffy ducklings and chicks, in a sunny meadow surrounded by piglets, kittens spilling out of a basket, or bunnies hopping all around. The overwhelming cuteness is the whole point; the animals stay low and around, and NEVER come up over the face.',
  },
  {
    key: 'girly_cute_f',
    gender: 'female',
    count: 25,
    label: 'Cute pink fluffy fun (her)',
    desc: 'Cute, pink, fluffy FUN for HER — a dreamy pastel bedroom fort of plushies, a cotton-candy carnival in a fluffy outfit, a kawaii dessert café of giant macarons, a bubblegum-pink balloon wall, or a sparkly slumber-party moment. Sweet, playful, adorable.',
  },
];

const ELEGANT_BUCKETS = [
  {
    key: 'victorian_f',
    gender: 'female',
    count: 50,
    label: 'Victorian (her)',
    desc: 'Victorian elegance for HER — a flowing bustle gown with lace; gas-lit streets, conservatories, estate rose gardens, candlelit parlors.',
  },
  {
    key: 'victorian_m',
    gender: 'male',
    count: 50,
    label: 'Victorian (him)',
    desc: 'Victorian elegance for HIM — a tailcoat, waistcoat, cravat (top hat held, not over the face); gas-lit streets, conservatories, libraries, estate grounds.',
  },
  {
    key: 'gatsby_f',
    gender: 'female',
    count: 50,
    label: '1920s Gatsby (her)',
    desc: '1920s glamour for HER — a beaded fringed flapper gown; Art Deco ballrooms, rooftop speakeasies, jazz lounges, grand staircases.',
  },
  {
    key: 'gatsby_m',
    gender: 'male',
    count: 50,
    label: '1920s Gatsby (him)',
    desc: '1920s glamour for HIM — a sharp tuxedo or pinstripe suit; Art Deco ballrooms, speakeasies, opera-house lobbies, yacht decks.',
  },
  {
    key: 'modern_f',
    gender: 'female',
    count: 50,
    label: 'Modern formal (her)',
    desc: 'Modern formal for HER — a sleek gown or chic cocktail dress; galas, fine restaurants, rooftop bars at night, gallery openings, hotel terraces.',
  },
  {
    key: 'modern_m',
    gender: 'male',
    count: 50,
    label: 'Modern formal (him)',
    desc: 'Modern formal for HIM — a tailored tux or sharp suit; galas, fine restaurants, rooftop bars at night, gallery openings, hotel terraces.',
  },
  {
    key: 'gardens_f',
    gender: 'female',
    count: 50,
    label: 'Gardens & pretty dresses (her)',
    desc: 'Beautiful garden settings for HER in a pretty dress — blooming rose gardens, lavender and wildflower fields, courtyards, flower-draped gazebos, greenhouse conservatories. Soft, romantic, flattering.',
  },
  {
    key: 'gardens_m',
    gender: 'male',
    count: 50,
    label: 'Gardens & dapper (him)',
    desc: 'Beautiful garden/estate settings for HIM in dapper attire — a fine linen or three-piece suit; rose gardens, vineyard terraces, manor lawns, courtyards.',
  },
  {
    key: 'cute_chic_f',
    gender: 'female',
    count: 50,
    label: 'Cute chic outfits (her)',
    desc: 'Elevated cute/chic everyday-glam for HER (not black-tie) — a stylish trendy outfit; a pretty cobblestone street, a charming café, a boutique district, an autumn park, a seaside promenade. Effortlessly cute and put-together.',
  },
  {
    key: 'dapper_m',
    gender: 'male',
    count: 50,
    label: 'Dapper looks (him)',
    desc: 'Stylish dapper everyday-sharp for HIM (not black-tie) — a smart tailored casual look; a cool city street at golden hour, a vintage car, a rooftop, a moody jazz bar, a classic barbershop district.',
  },
  {
    key: 'street_cool',
    gender: 'any',
    count: 25,
    label: 'Cool modern street style',
    desc: 'Effortlessly COOL modern street style — the person looking striking in standout fashion: a neon-lit crosswalk at night, a graffiti-art alley, a rooftop at golden hour, a chic café strip, or a sleek subway platform. Bold streetwear, a designer jacket, a statement outfit, sunglasses pushed up (never over the eyes). Confident and editorial.',
  },
  {
    key: 'stage_and_fame',
    gender: 'any',
    count: 25,
    label: 'Living the dream (fame)',
    desc: 'Living-the-dream FAME — the person as a star: on a red carpet under flashing bulbs, a magazine cover shoot, a stadium stage under spotlights with a crowd beyond, a glossy talk-show set, or a movie premiere. A glamorous gown or a sharp suit, a statement look. Dazzling and aspirational.',
  },
  {
    key: 'princess_f',
    gender: 'female',
    count: 25,
    label: 'Fairytale princess (her)',
    desc: 'A fairytale PRINCESS for HER — a flowing ballgown and a delicate tiara; a castle balcony at golden hour, a grand palace staircase, a rose-garden courtyard, a royal ballroom, or a carriage arrival. Graceful, storybook, radiant.',
  },
  {
    key: 'ballerina_f',
    gender: 'female',
    count: 25,
    label: 'Ballerina (her)',
    desc: 'A BALLERINA for HER — tutu and pointe-shoe elegance under a spotlight; a grand theatre stage, a sunlit rehearsal studio with barres and mirrors, a backstage of curtains and roses, or a snow-lit stage set. Graceful and luminous.',
  },
];

// ACTIVE pool = COOL / EPIC / ADVENTURE / FANTASY solo scenes (solo counterpart of the
// dual active buckets; NIGHTLY_FUN_SCENARIOS_PLAN.md). Gender-neutral (costume works for
// any gender). Dark until we enable single_scene_active_pct, so isolated for QA.
const ACTIVE_BUCKETS = [
  {
    key: 'swashbuckler',
    gender: 'any',
    count: 25,
    label: 'Swashbuckling pirate',
    desc: 'A swashbuckling PIRATE adventure — the person as a pirate aboard a tall-ship galleon at sea, on a treasure-island cove with an open chest of gold, or in a lantern-lit dockside tavern. Tricorn hat worn back (face clear), a long coat, a sash, a cutlass at the hip; ship rigging, tattered sails, a parrot or treasure in the background. Rugged and cinematic.',
  },
  {
    key: 'artifact_hunter',
    gender: 'any',
    count: 25,
    label: 'Adventure archaeologist',
    desc: 'An ADVENTURE-ARCHAEOLOGIST scene (Indiana-Jones energy) — the person exploring an ancient jungle temple, a torch-lit tomb of golden relics, a sun-baked desert dig site, or a rickety rope bridge over a canyon. A weathered explorer jacket, a fedora tilted back (face clear), a leather satchel, coiled rope. Dusty, golden-lit, thrilling.',
  },
  {
    key: 'fantasy_hero',
    mediumBan: PHOTO_ADJACENT_BAN,
    gender: 'any',
    count: 25,
    label: 'Epic fantasy hero',
    desc: 'An EPIC FANTASY / sword-and-sorcery scene — the person as a hero of a magical realm: a warrior at a great castle gate, a mage on a cliff above an enchanted glowing valley, an elven archer in a luminous forest, or an adventurer in a crystal cavern (any dragon or beast kept LARGE in the far background, never near the face). Fantasy armor, a flowing cloak, leather and rune-etched gear. Painterly and grand.',
  },
  {
    key: 'space_scifi',
    gender: 'any',
    count: 25,
    label: 'Space & sci-fi',
    desc: 'A SCI-FI / SPACE scene — the person as an astronaut or star explorer: aboard a space station with a glowing planet outside the window, on a ridge of an alien world under twin moons, on the bright bridge of a starship, or beside a sleek rocket on a launchpad. A spacesuit with the helmet off or held (face clear), a sleek flight suit. Awe-inspiring and futuristic.',
  },
  {
    key: 'cyberpunk',
    gender: 'any',
    count: 25,
    label: 'Neon cyberpunk',
    desc: 'A CYBERPUNK future scene — the person in a neon-drenched, rain-slick megacity: a glowing back-alley of holographic signs, a rooftop over an endless skyline of lights, or a buzzing night market of noodle stalls and drones. Sleek techwear, a neon-trimmed jacket, LED accents, a visor pushed up on the forehead (never over the eyes). Moody, electric, cinematic.',
  },
  {
    key: 'superhero',
    mediumBan: PHOTO_ADJACENT_BAN,
    gender: 'any',
    count: 25,
    label: 'Comic-book superhero',
    desc: 'A COMIC-BOOK SUPERHERO scene — the person as a caped hero: a dramatic rooftop stance over a city at dusk, a heroic landing on a cracked street, or a bold pose against an explosive comic-panel sky. A vivid hero suit with a chest emblem and cape, wrist gauntlets; a slim domino mask ONLY if the eyes and full face stay clearly visible (never a full cowl or helmet). Dynamic and heroic.',
  },
  {
    key: 'expedition',
    gender: 'any',
    count: 25,
    label: 'Explorer & expedition',
    desc: 'An EXPEDITION / EXPLORER scene — the person as an intrepid adventurer: a mountaineer near a snowy summit with ropes, an arctic explorer by a tent under the aurora, a safari guide in tall golden grass beside an open-top jeep, or a diver on a boat deck with a coral reef below. A rugged parka, safari khakis, a climbing harness, goggles pushed up on the forehead. Wild and cinematic.',
  },
  {
    key: 'champion',
    gender: 'any',
    count: 25,
    label: 'Sports champion',
    desc: 'A SPORTS-CHAMPION scene — the person in a triumphant competition moment: on a winners podium with a medal and falling confetti, a race-car driver beside a gleaming Formula car, at the colorful top of a climbing wall, a boxer in a ring corner with gloves up, or a tennis star on a sunlit center court. A team kit, a racing suit, athletic gear. Bold, victorious, energetic.',
  },
  {
    key: 'giant_critter',
    mediumBan: PHOTO_ADJACENT_BAN,
    gender: 'any',
    count: 25,
    label: 'Giant animal companion',
    desc: 'A whimsical GIANT-ANIMAL companion scene — the person in the foreground with one adorable OVERSIZED friendly creature filling the background behind them: a house-sized fluffy corgi, a gentle rainbow unicorn, a cuddly baby dragon, or a colossal soft house-cat. The person stays clearly in front (the giant animal is the delightful backdrop, never covering the face). Cozy cheerful casual clothes. Charming and funny.',
  },
  {
    key: 'mounts_and_riding',
    mediumBan: PHOTO_ADJACENT_BAN,
    gender: 'any',
    count: 25,
    label: 'Magical mounts & riding',
    desc: 'A MAGICAL-MOUNT riding scene — the person riding a wondrous steed across a sweeping vista: a giant fluffy corgi, a horse through an enchanted valley, a gentle unicorn, a great elk, or a feathered raptor. Reins or a lead rope in hand; rolling hills, misty peaks, or blossom fields behind. Riding leathers, a cloak, adventure clothes. Joyful and epic.',
  },
  {
    key: 'companion_creatures',
    mediumBan: PHOTO_ADJACENT_BAN,
    gender: 'any',
    count: 25,
    label: 'Fantasy companion creatures',
    desc: 'A FANTASY-COMPANION scene — the person with their own wondrous pet creature beside them: a small dragon perched on a forearm, a glowing fox familiar, a baby griffin, or a tiny phoenix. Cozy-adventurer clothes; a magical glade, a cliff overlook, or a rune-lit study. The creature stays small and beside or below them, never covering the face. Warm and wondrous.',
  },
  {
    key: 'epic_arsenal',
    mediumBan: PHOTO_ADJACENT_BAN,
    gender: 'any',
    count: 25,
    label: 'Epic weapons & arsenal',
    desc: 'An EPIC-ARSENAL hero scene — the person wielding a colossal glowing weapon: a massive rune-etched greatsword planted in the ground, twin plasma blades, an enormous warhammer, a glowing longbow, or a sci-fi cannon at rest. Fantasy or sci-fi armor; a battlefield ridge, a shattered temple, or a neon hangar behind. The weapon held at chest level or lower, never over the face. Bold and powerful.',
  },
  {
    key: 'tropical_adventure',
    gender: 'any',
    count: 25,
    label: 'Tropical adventure',
    desc: 'A TROPICAL-ADVENTURE scene — the person mid-adventure in a lush paradise: clinging to a leaning coconut palm, wading a turquoise lagoon toward a waterfall, paddling an outrigger canoe, or on a rope bridge over a jungle gorge. Bright island and explorer clothes; palms, waterfalls, and reefs behind. Sun-drenched and exhilarating.',
  },
  {
    key: 'underwater_wonders',
    mediumBan: PHOTO_ADJACENT_BAN,
    gender: 'any',
    count: 25,
    label: 'Undersea wonders',
    desc: 'An UNDERSEA-WONDER scene — the person as a merfolk or free-diver gliding through a sunlit reef, alongside a gentle whale, above a sunken temple of glowing coral, or in a light-streaked kelp forest. A flowing merfolk tail or a sleek dive suit (NO scuba mask over the face). Rays of light and fish behind. Serene and dazzling.',
  },
  {
    key: 'celestial_dream',
    mediumBan: PHOTO_ADJACENT_BAN,
    gender: 'any',
    count: 25,
    label: 'Celestial dream',
    desc: 'A CELESTIAL-DREAM scene — the person among the stars: perched on a glowing crescent moon, on a floating sky-island under the aurora, catching falling stars in a lantern, or on a cloud terrace among constellations. Dreamy flowing celestial clothes; galaxies, comets, and soft starlight around them. Awe-inspiring and gorgeous.',
  },
  {
    key: 'sports_glory',
    gender: 'any',
    count: 25,
    label: 'Sports glory (peak feat)',
    desc: 'A SPORTS-GLORY hero moment — the person at the peak of an epic athletic feat: cresting a giant surf wave, mid slam-dunk under stadium lights, breaking a marathon finish tape, hoisting a trophy in a roaring arena, or carving a powder run. A jersey and athletic gear; crowds, banners, and spray behind. Triumphant and electric.',
  },
  {
    key: 'cozy_magic',
    mediumBan: PHOTO_ADJACENT_BAN,
    gender: 'any',
    count: 25,
    label: 'Cozy magic',
    desc: "A COZY-MAGIC scene — the person as a gentle spellweaver: stirring a glowing cauldron in a candlelit apothecary, reading a floating storybook in an enchanted library, tending luminous plants in a witch's greenhouse, or brewing potions among drifting sparks. Soft wizard robes or a charmed cardigan; a warm magical glow and floating motes around them. Warm and enchanting.",
  },
  {
    key: 'mythic_legend',
    mediumBan: PHOTO_ADJACENT_BAN,
    gender: 'any',
    count: 25,
    label: 'Mythic legends',
    desc: 'A MYTHIC-LEGEND scene — the person as a figure of ancient myth: on marble Olympus among clouds and laurel, in a Norse hall of runes and firelight, on an Egyptian throne dais of gold, or before a temple of a jade dragon. Draped godly robes, laurels, golden regalia; columns and divine light behind. Epic and painterly.',
  },
  {
    key: 'winter_wonder',
    mediumBan: PHOTO_ADJACENT_BAN,
    gender: 'any',
    count: 25,
    label: 'Winter wonderland',
    desc: 'A WINTER-WONDER scene — the person in a magical frozen world: on a sleigh pulled by a great white bear, before a glittering ice palace, skating a frozen aurora lake, or in a glowing snow-globe village. A cozy fur-trimmed cloak and mittens; northern lights and snow crystals around them. Enchanting and luminous.',
  },
  {
    key: 'magical_girl_f',
    mediumBan: PHOTO_ADJACENT_BAN,
    gender: 'female',
    count: 25,
    label: 'Magical-girl heroine (her)',
    desc: 'A MAGICAL-GIRL heroine for HER — a sparkling transformation moment: twirling a glowing star wand on a rooftop under ribbons of light, in a pastel enchanted sky with floating hearts, striking a heroic sparkle-pose in a frilly magical outfit, or amid swirling petals and glitter. Ribbons, bows, a glowing accessory. Sparkly, cute, powerful.',
  },
  {
    key: 'extreme_sports_m',
    gender: 'male',
    count: 25,
    label: 'Extreme sports (him)',
    desc: 'EXTREME SPORTS for HIM — an adrenaline peak: launching a motocross jump over a dirt berm, dropping into a giant surf wave, mid-air on a downhill mountain bike, carving a snowboard spray, or leaping a parkour rooftop gap. Rugged sports gear, a helmet pushed up or off (face clear). Gritty and electric.',
  },
  {
    key: 'combat_sports_m',
    gender: 'male',
    count: 25,
    label: 'Combat sports (him)',
    desc: 'COMBAT SPORTS for HIM — a fighter\'s moment: gloves up in a boxing ring corner under the lights, in an MMA cage with a raised fist, a muay-thai clinch stance, or arms raised in victory in the ring. Boxing gloves, hand wraps, trunks, a title belt over the shoulder. Bold and triumphant.',
  },
  {
    key: 'warrior_soldier_m',
    mediumBan: PHOTO_ADJACENT_BAN,
    gender: 'male',
    count: 25,
    label: 'Warrior / soldier (him)',
    desc: 'A WARRIOR / SOLDIER for HIM — a heroic martial moment: a spartan on a cliff with shield and spear, a gladiator in a colosseum, a medieval knight before a castle, or a rugged soldier-hero on a ridge at dusk. Armor, a helmet held or pushed back (face clear), a weapon at rest. Epic and commanding.',
  },
  {
    key: 'hunting_m',
    gender: 'male',
    count: 25,
    label: 'Hunting (him)',
    desc: 'HUNTING for HIM — a rugged outdoors moment: in camo at a misty duck blind at dawn, drawing a compound bow on a forest ridge, glassing a mountain valley with binoculars lowered, or by a truck tailgate with gear at first light. Camo or blaze-orange outdoor wear. Rugged and authentic.',
  },
  {
    key: 'fishing_m',
    gender: 'male',
    count: 25,
    label: 'Fishing (him)',
    desc: 'FISHING for HIM — a proud catch moment: hoisting a big fish on a deep-sea charter deck, fly-casting mid-stream in a mountain river, on a bass boat at golden hour, or on a pier with a bent rod. Waders, a fishing vest, a ball cap. Rugged, sunny, satisfying.',
  },
];

// Production scale-up: `--per N` raises the ACTIVE-bucket target above the MVP
// default of 25 (append-safe — dedups against existing rows). Non-active buckets
// keep their own per-bucket `count`.
const ACTIVE_PER = (() => {
  const i = process.argv.indexOf('--per');
  return i >= 0 ? parseInt(process.argv[i + 1], 10) : null;
})();
if (ACTIVE_PER) ACTIVE_BUCKETS.forEach((b) => (b.count = ACTIVE_PER));

async function genBatch(pool, bucket, n, banList) {
  const ban = banList.length
    ? `\n\nDo NOT repeat or closely echo these already-used scenes: ${banList.slice(-40).join(' | ')}`
    : '';
  const subj =
    bucket.gender === 'female' ? 'a woman' : bucket.gender === 'male' ? 'a man' : 'one person';
  const isActive = pool === 'active';
  const dna =
    pool === 'elegant'
      ? `Each entry is a PRETTY, tasteful, DRESSED-UP solo photo of ${subj}. CATEGORY: ${bucket.desc}`
      : isActive
        ? `Each entry is a COOL / EXCITING / FANTASTICAL solo photo of ${subj} caught MID-ACTION doing something with a HANDHELD PROP — an adventure/fantasy/sci-fi/heroic scene, genuinely dynamic and full of character, yet READABLE and composed as a clear solo portrait where the person dominates. CATEGORY: ${bucket.desc}`
        : `Each entry is a RANDOM FUNNY / oddball solo photo of ${subj} — genuinely amusing but READABLE (the joke reads instantly). CATEGORY: ${bucket.desc}`;
  // ACTIVE pool: the pose FOLLOWS the scene text, so the scene MUST give the
  // person a dynamic beat + a handheld prop — escapes stiff stand-and-pose while
  // staying swap-safe (face big + toward camera, never covered by the prop).
  const sceneRule = isActive
    ? `- scene: 12-26 words — WHERE ${subj} is + a DYNAMIC action they are doing WITH A HANDHELD PROP (face still toward the viewer). Give an active beat + a prop in hand, e.g. raising a spyglass toward the horizon, hoisting a tankard, one hand on the ship's wheel, drawing a cutlass, unrolling a treasure map. Keep the hand/prop at chest level or lower. Do NOT describe gaze or which way they face.`
    : `- scene: 10-22 words — WHERE ${subj} is + the fun/pretty situation. Describe the SETTING and any props/animals/elements. Do NOT describe pose, gaze, or which way they face (framing is locked elsewhere).`;
  const activeRule = isActive
    ? `\n- ${subj} is MID-ACTION with a handheld prop, BUT the face stays LARGE and toward the camera and is NEVER covered by a prop (no spyglass up to the eye, no pipe in the mouth, no hand/prop over the face); the prop stays at chest level or lower.`
    : '';
  const msg = await client.messages.create({
    model: SONNET,
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: `Generate ${n} DISTINCT solo-photo scenarios for an AI dream-photo app. ${dna}

Output ONLY a JSON array of ${n} objects, each: {"scene": "...", "attire": "..."}
${sceneRule}
- attire: 6-14 words — what ${subj} is wearing${bucket.gender === 'any' ? ' (period-accurate for period scenes; otherwise "normal scene-appropriate everyday clothes")' : ', appropriate for ' + subj}.

HARD RULES (a render is rejected if violated — this is a FACE-SWAP solo PORTRAIT, so the person must dominate the frame with a big clear face):
- ${subj.toUpperCase ? subj : subj} is the ONLY prominent person and the clear FOREGROUND subject, read as a normal solo portrait (waist-up, big face). NO other prominent people.${activeRule}
- Any animals/creatures/background characters stay in the BACKGROUND or to the side — NEVER crowding or covering the face.
- Keep it SIMPLE: the fun is the recognizable SETTING/situation, not a busy action tableau. One clear idea per scene.
- Face fully visible — NO masks, helmets, full hoods, veils, heavy face paint, or hats over the eyes.
- No children/minors. Tasteful (no lingerie/nudity).
- Vary the setting, era, and elements across the ${n} — minimal overlap.${ban}

Output ONLY the JSON array, no markdown, no commentary.`,
      },
    ],
  });
  let text = msg.content[0].text
    .trim()
    .replace(/^```(json)?/i, '')
    .replace(/```$/, '')
    .trim();
  let parsed = [];
  try {
    parsed = JSON.parse(text);
  } catch {
    // Salvage the array; if Sonnet returned malformed JSON (e.g. an unescaped
    // quote), skip this batch entirely rather than crashing the whole run — the
    // while-loop just retries.
    try {
      const m = text.match(/\[[\s\S]*\]/);
      if (m) parsed = JSON.parse(m[0]);
    } catch {
      parsed = [];
    }
  }
  return Array.isArray(parsed) ? parsed.filter((o) => o && o.scene && o.attire) : [];
}

(async () => {
  const pools = POOL === 'both' ? ['goofy', 'elegant'] : [POOL];
  const everything = [];
  for (const pool of pools) {
    let buckets =
      pool === 'elegant' ? ELEGANT_BUCKETS : pool === 'active' ? ACTIVE_BUCKETS : GOOFY_BUCKETS;
    if (BUCKET_FILTER === 'sample') buckets = buckets.slice(0, 3).concat(buckets.slice(-2));
    else if (BUCKET_FILTER)
      buckets = buckets.filter((b) => BUCKET_FILTER.split(',').includes(b.key));

    console.log(`\n########## SINGLE ${pool.toUpperCase()} ##########`);
    const all = [];
    const seen = new Set();
    for (const bucket of buckets) {
      const target = DRY ? Math.min(bucket.count, 6) : (COUNT_OVERRIDE ?? bucket.count);
      // Cross-run append safety: dedup + ban against what's ALREADY seeded.
      const { data: existingRows } = await supabase
        .from('single_scenarios')
        .select('scene')
        .eq('pool', pool)
        .eq('category', bucket.key);
      const existingScenes = (existingRows ?? []).map((r) => r.scene);
      existingScenes.forEach((s) =>
        seen.add(
          s
            .toLowerCase()
            .replace(/[^a-z0-9 ]/g, '')
            .trim()
        )
      );
      if (existingScenes.length) console.log(`  (${existingScenes.length} existing — appending)`);
      console.log(`\n=== ${pool}/${bucket.key} [${bucket.gender}] (${bucket.label}) ===`);
      const got = [];
      let tries = 0;
      while (got.length < target && tries < 7) {
        tries++;
        const batch = await genBatch(pool, bucket, Math.min(target - got.length + 3, 20), [
          ...all.map((x) => x.scene),
          ...existingScenes,
        ]);
        for (const o of batch) {
          const key = o.scene
            .toLowerCase()
            .replace(/[^a-z0-9 ]/g, '')
            .trim();
          if (seen.has(key)) continue;
          seen.add(key);
          got.push({ scene: o.scene.trim(), attire: o.attire.trim() });
          if (got.length >= target) break;
        }
      }
      got.forEach((o) => {
        all.push({
          pool,
          gender: bucket.gender,
          category: bucket.key,
          scene: o.scene,
          attire: o.attire,
          pose_pool: bucket.posePool ?? null,
          medium_key: bucket.mediumKey ?? null,
          medium_ban: bucket.mediumBan ?? null,
        });
        console.log(`  [${bucket.gender}] ${o.scene}  [${o.attire}]`);
      });
    }
    everything.push(...all);
    if (!DRY) {
      for (let i = 0; i < all.length; i += 200) {
        const { error } = await supabase.from('single_scenarios').insert(all.slice(i, i + 200));
        if (error) console.error('  ❌ insert failed:', error.message);
      }
      console.log(`\n✅ inserted ${all.length} single ${pool} scenarios`);
    }
  }
  fs.writeFileSync('/tmp/single_scenarios.json', JSON.stringify(everything, null, 2));
  console.log(
    `\n💾 saved ${everything.length} total to /tmp/single_scenarios.json${DRY ? ' (dry)' : ''}`
  );
})();
