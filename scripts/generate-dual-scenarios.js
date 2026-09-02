#!/usr/bin/env node
/**
 * Generate the dual-character SPECIAL scene pools (goofy + elegant) for nightly
 * couple dreams. Batched by sub-theme bucket for even coverage; dedup via a
 * running ban-list. Each entry = { scene, attire }.
 *
 *   GOOFY   = random FUNNY scenes — any era (cavemen, pirates, knights…) OR absurd
 *             modern situations. The humor is the scene/situation/period.
 *   ELEGANT = PRETTY, romantic, DRESSED-UP couple scenes across all eras
 *             (Victorian, Gatsby, Renaissance, modern) in beautiful settings.
 *
 * HARD RULES baked into every prompt (swap safety): both FACES fully visible —
 * NO masks/helmets/full hoods/veils/heavy face-paint/hats-over-eyes; readable, not
 * incoherent; couple together side-by-side; NO pose/embrace/kiss language (framing
 * is locked downstream); no minors.
 *
 * Usage:
 *   node scripts/generate-dual-scenarios.js --pool both --dry-run --per 6 --buckets sample
 *   node scripts/generate-dual-scenarios.js --pool goofy --per 63           # ~500, insert
 *   node scripts/generate-dual-scenarios.js --pool elegant --per 50         # ~500, insert
 */
const { SONNET } = require('./lib/models');
require('dotenv').config({ path: '.env.local' });
const Anthropic = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');

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
const PER = parseInt(arg('--per', '6'), 10); // entries per bucket
const DRY = args.includes('--dry-run');
const BUCKET_FILTER = arg('--buckets', null); // 'sample' or csv of keys

// Operation Sweet Dreams: fantastical scenes ban EVERY photo-real-adjacent
// medium (photoreal dragons/magic/creatures read as creepy CGI, and noir/
// vintage/heirloom/overlay/glamour render semi-real styles badly). Stored as a
// CSV in medium_ban; nightly-dreams parses it and re-rolls out of the whole
// list into the painterly/illustrated face-swap mediums.
const PHOTO_ADJACENT_BAN =
  'photography,film_noir,vintage_film,double_exposure,heirloom,glamour';

const ELEGANT_BUCKETS = [
  {
    key: 'victorian',
    label: 'Victorian era',
    desc: 'Victorian formal — gowns with bustles, tailcoats, top hats held (not worn over the face); gas-lit cobblestone streets, conservatories, parlors, manicured estate gardens.',
  },
  {
    key: 'gatsby_1920s',
    label: '1920s Art Deco / Gatsby',
    desc: 'Roaring-20s glamour — beaded flapper gowns, sharp tuxedos; Art Deco ballrooms, jazz lounges, grand staircases, rooftop speakeasies.',
  },
  {
    key: 'renaissance_baroque',
    label: 'Renaissance / Baroque court',
    desc: 'Opulent Renaissance/Baroque court finery — rich brocade and velvet; palace halls, frescoed galleries, ornate courtyards, candlelit banquet rooms.',
  },
  {
    key: 'regency',
    label: 'Regency',
    desc: 'Regency elegance (Bridgerton-style) — empire-waist gowns and tailored coats; pastel ballrooms, garden follies, grand drawing rooms.',
  },
  {
    key: 'old_hollywood',
    label: 'Old Hollywood / 1950s glam',
    desc: 'Old-Hollywood glamour — satin gowns, classic black-tie; red-carpet staircases, vintage theaters, chic supper clubs, convertible at a premiere.',
  },
  {
    key: 'modern_blacktie',
    label: 'Modern black-tie',
    desc: 'Modern formal — sleek gown and tailored suit/tux; galas, fine restaurants, rooftop bars at night, art-gallery openings, hotel terraces.',
  },
  {
    key: 'romantic_gardens',
    label: 'Romantic gardens & flowers',
    desc: 'Beautiful garden settings, any tasteful era — blooming rose gardens, lavender and wildflower fields, courtyards, flower-draped gazebos, greenhouse conservatories. Elegant attire.',
  },
  {
    key: 'evening_city',
    label: 'Pretty city at night',
    desc: 'Lovely evening cityscapes, any era — a pretty lamplit street at night, café terraces, stone bridges over a river, plazas with fountains. Dressed up.',
  },
  {
    key: 'street_cool',
    label: 'Cool modern street style',
    desc: 'Effortlessly COOL modern street style — the couple looking striking in standout fashion: a neon-lit city crosswalk at night, a graffiti-art alley, a rooftop at golden hour, a chic café strip, or a sleek subway platform. Bold streetwear, designer jackets, statement outfits, sunglasses pushed up (never over the eyes). Confident and editorial.',
  },
  {
    key: 'stage_and_fame',
    label: 'Living the dream (fame)',
    desc: 'Living-the-dream FAME — the couple as stars: on a red carpet under flashing bulbs, a magazine cover shoot, a stadium stage under spotlights with a crowd beyond, a glossy talk-show set, or a movie premiere. Glamorous designer gowns, sharp suits, statement looks. Dazzling and aspirational.',
  },
  {
    key: 'rich_famous',
    label: 'Lifestyles of the rich & famous',
    // Modern real luxury needs a clean photoreal/editorial register — ban the
    // painterly/vintage/fantasy mediums that drift a supercar into a whimsical
    // waterfall or a 1940s B&W town (2026-08-26 QA). Leaves the clean-modern
    // renderers: comics, photography, illustration (verified to hold luxury).
    mediumBan: "glamour,double_exposure,canvas,watercolor,pencil,film_noir,vintage_film,heirloom",
    desc: 'Lifestyles of the RICH AND FAMOUS — sleek, MODERN, aspirational luxury, always COOL and never gaudy or old-money-stuffy: leaning against or perched on the hood of an exotic supercar (a Ferrari, Lamborghini, McLaren, Porsche 911, Rolls-Royce, Bentley, Aston Martin, or matte-black G-Wagon — real iconic cars, badges welcome); the sundeck or bow of a gleaming white superyacht at golden hour; an infinity-pool clifftop villa over an Amalfi / Mykonos / Malibu sea; the airstair of a private jet on the tarmac; a floor-to-ceiling-glass penthouse suite above a glittering city skyline; a chic ultra-modern beach house. Effortlessly expensive designer attire — tailored linen and silk, a crisp resort look or a sleek dress, statement sunglasses pushed up on the head (never over the eyes), fine watches and jewelry. The couple relaxed, confident, living the dream — waist-up, side by side, faces to camera.',
  },
];

const GOOFY_BUCKETS = [
  {
    key: 'time_travel',
    label: 'Time-travel comedy',
    desc: 'Funny PERIOD scenes — show the couple as cavemen in furs, swashbuckling pirates, medieval knights/peasants, Roman gladiators, vikings, wild-west cowboys, 70s disco-goers, ancient Egyptians. The period costume is the joke. Faces must stay fully visible (no helmets/masks/face-paint).',
  },
  {
    key: 'absurd_everyday',
    label: 'Absurd everyday',
    desc: 'Goofy absurd modern situations in NORMAL clothes — stuck waist-deep in a giant ball pit, tangled in holiday lights, buried in autumn leaves, caught in a confetti explosion, in a runaway shopping cart, in an overflowing bubble bath of foam.',
  },
  {
    key: 'giant_scale',
    mediumBan: PHOTO_ADJACENT_BAN, // photo-real-adjacent mediums read creepy for fantastical content
    label: 'Giant / oversized props',
    desc: 'Comically OVERSIZED props, normal clothes — perched on a giant rubber duck, beside a donut taller than them, on a giant slice of pizza, holding a colossal ice-cream cone, on an enormous beanbag.',
  },
  {
    key: 'animal_mayhem',
    label: 'Animal mayhem',
    desc: 'Funny animal situations, normal clothes — swarmed by a pile of puppies/kittens, photobombed by a llama or alpaca, surrounded by a flock of flamingos or penguins, a goat standing between them, a parrot on a shoulder.',
  },
  {
    key: 'fantastical_silly',
    mediumBan: PHOTO_ADJACENT_BAN, // photo-real-adjacent mediums read creepy for fantastical content
    label: 'Fantastical & silly',
    desc: 'Light-hearted fantasy/sci-fi comedy, readable — taking a selfie with a friendly cartoonish alien, a tiny dragon perched nearby, a goofy robot butler serving them, a friendly yeti leaning in, riding a slow cartoon dinosaur.',
  },
  {
    key: 'party_carnival',
    label: 'Party & carnival chaos',
    desc: 'Fun party/carnival/food chaos, normal clothes — mid conga line, a cannon of confetti going off, an over-the-top birthday cake explosion, a retro arcade, bumper cars, a bouncy castle, mountains of balloons.',
  },
  {
    key: 'fun_activities',
    label: 'Fun activities & adventures',
    desc: 'The couple doing a fun/silly ACTIVITY together in normal (activity-appropriate) clothes — bungee jumping, cruising in a candy-colored lowrider convertible, jamming together in a garage rock band with instruments, on a wild rollercoaster mid-drop, go-karting, at a carnival midway with prizes, riding a mechanical bull, on a tandem skydive, in a paddle boat shaped like a swan.',
  },
  {
    key: 'glamour_shot_retro',
    posePool: 'glamour', // migration 353: renders draw from the curated glamour pose pool
    mediumKey: 'photography', // migration 354: photo-genre parody — force the photo medium
    label: 'Retro glamour-shot studio',
    desc: 'A cheesy 1980s/90s mall GLAMOUR SHOTS photo studio, played completely straight — soft-focus dreamy glow, an airbrushed studio backdrop (laser grid, misty pastel clouds, marbled gray, glittery starburst), wind-machine hair, dramatic studio spotlights, maybe a white column or fake fur prop to lean territory near. The earnest cheese IS the joke. Attire carries it: acid-wash denim jackets off the shoulder, chunky pearls, sequined tops, teased/feathered hair, white suits with shoulder pads.',
  },
  {
    key: 'decade_eras',
    label: 'Decade eras fashion',
    desc: "A stylized 20th-century DECADE portrait with the era's wild fashion played straight — 1940s swing-dance hall in victory rolls and high-waist trousers, 1950s pastel diner with milkshakes in poodle skirt and letterman jacket, 1960s mod go-go set in geometric shift dress and slim suit, 1970s roller-disco rink in flared jumpsuits under a disco ball, 1980s neon aerobics studio in leotards leg-warmers and headbands, 1990s mall photo booth in windbreakers and frosted denim, Y2K house party in metallic fashion and tiny sunglasses. The over-the-top era-accurate fashion is the fun; era-accurate setting details around them.",
  },
  {
    key: 'surreal_absurd',
    label: 'Surreal absurd (deadpan impossible)',
    desc: "A DEADPAN IMPOSSIBLE scene treated like a totally normal couple photo, normal clothes — sitting in a giant bowl of breakfast cereal with a huge spoon, lounging on an inflatable flamingo pool float on the gray surface of the moon with Earth in the sky, having a fancy candlelit dinner at a tiny table on top of a highway billboard, in an office cubicle set up underwater with fish swimming past, toasting marshmallows over a tiny campfire in a fancy hotel lobby, waiting at a bus stop bench in the middle of a desert with a single traffic light. Every noun CONCRETE (a specific object, never a vague 'creature/figure'); one impossible idea per scene, played straight.",
  },
  {
    key: 'out_and_about',
    label: 'Out and about (classic fun outings)',
    desc: 'A wholesome classic FUN OUTING, normal everyday clothes — at the amusement park with a ferris wheel behind them, sharing cotton candy at the county fair midway, on a picnic blanket with a wicker basket in a sunny park, a beach day with striped umbrellas and sandcastles, at the aquarium in front of a glowing floor-to-ceiling fish tank, at a pumpkin patch with wheelbarrows of pumpkins, apple picking in an orchard with baskets, at the zoo by the giraffe enclosure, a museum trip beside dinosaur skeletons, at a farmers market with armfuls of flowers and produce, mini golf by the windmill hole, a drive-in movie leaning on a classic car. Joyful, sunny, postcard-fun.',
  },
  {
    key: 'adorable_swarm',
    label: 'Adorable baby-animal swarm',
    desc: 'Joyfully mobbed by ADORABLE baby animals, normal clothes — knee-deep in a tumble of golden puppies, under a pile of fluffy ducklings and chicks, in a sunny meadow surrounded by piglets, kittens spilling out of a basket, or bunnies hopping all around them. The overwhelming cuteness is the whole point. The animals stay low, around and below the couple, and NEVER come up over their faces.',
  },
];

// ACTIVE pool = COOL / EPIC / ADVENTURE / FANTASY scenes (NIGHTLY_FUN_SCENARIOS_PLAN.md).
// Currently dark (dual_scene_active_pct=0) so seeding here is isolated + zero live impact
// until we enable it. Every desc is authored so COSTUME + SETTING carry the fantasy while
// the couple stays waist-up with big clear faces (swap-safe). Fantastical buckets ban
// photography (photoreal dragons/aliens/giant animals read as creepy CGI, not whimsical).
const ACTIVE_BUCKETS = [
  {
    key: 'sky_romance',
    label: 'Dreamy skies',
    desc: 'A DREAMY AIRBORNE moment — the couple in a hot-air balloon wicker basket drifting over lush green valleys at sunrise, side by side at the crest of a giant ferris wheel at dusk, arriving on a seaplane dock over turquoise water, or bundled in a tandem paraglide harness moments after landing on a golden-hour ridge (canopy draped behind). Stylish relaxed travel wear, wind in the hair, faces clear and bright with wonder; the vast beautiful landscape spread out around them. Breathtaking, romantic, lush.',
  },
  {
    key: 'wild_rides',
    label: 'Wild rides',
    desc: 'A THRILLING RIDE mid-motion — the couple on horseback galloping side by side through shallow surf, mushing a husky sled team across sparkling snow, riding a camel caravan over golden dunes at sunset, cruising a vintage vespa (one driving, one in a sidecar) down a Mediterranean coastal road, or in a cherry-red retro convertible on a neon evening strip. Motion in manes, spray, scarves and hair; both faces forward and clear, joy and adrenaline. Cinematic, fun, alive.',
  },
  {
    key: 'water_bliss',
    label: 'Water bliss',
    desc: 'A LUSH WATER paradise — the couple waist-deep in a turquoise waterfall plunge pool with mist and hanging vines, snorkel masks pushed UP on foreheads (faces fully clear) beside a surfacing sea turtle, paddling a lantern-lit wooden canoe on a glassy twilight lake, or soaking in a steaming natural hot spring while snow falls softly around them. Water drops sparkling, skin glowing, tropical or alpine splendor all around. Serene, gorgeous, dreamlike.',
  },
  {
    key: 'glow_nights',
    label: 'Glowing nights',
    desc: 'A MAGICAL NIGHT of lights — the couple releasing a glowing paper lantern into a sky already full of them over a river, watching fireworks burst above a city rooftop terrace, walking a shoreline that glows electric-blue with bioluminescence, or laughing between the lit rides of a night carnival midway with cotton candy. Warm light on both faces (never silhouetted), sparkling bokeh, wonder and celebration. Enchanting, vivid, unforgettable.',
  },
  {
    key: 'swashbuckler',
    label: 'Swashbuckling pirates',
    desc: 'A swashbuckling PIRATE adventure — the couple as pirates aboard a tall-ship galleon at sea, on a treasure-island cove with an open chest of gold, or in a lantern-lit dockside tavern. Tricorn hats worn back (faces clear), long coats, sashes, a cutlass at the hip; ship rigging, tattered sails, a parrot or treasure in the background. Rugged and cinematic.',
  },
  {
    key: 'artifact_hunter',
    label: 'Adventure archaeologists',
    desc: 'An ADVENTURE-ARCHAEOLOGIST scene (Indiana-Jones energy) — the couple exploring an ancient jungle temple, a torch-lit tomb of golden relics, a sun-baked desert dig site, or a rickety rope bridge over a canyon. Weathered explorer jackets, a fedora tilted back (face clear), leather satchels, coiled rope. Dusty, golden-lit, thrilling.',
  },
  {
    key: 'fantasy_hero',
    mediumBan: PHOTO_ADJACENT_BAN,
    label: 'Epic fantasy heroes',
    desc: 'An EPIC FANTASY / sword-and-sorcery scene — the couple as heroes of a magical realm: warriors at a great castle gate, a ranger and a mage on a cliff above an enchanted glowing valley, elven archers in a luminous forest, or adventurers in a crystal cavern (any dragon or beast kept LARGE in the far background, never near their faces). Fantasy armor, flowing cloaks, leather and rune-etched gear. Painterly and grand.',
  },
  {
    key: 'space_scifi',
    label: 'Space & sci-fi',
    desc: 'A SCI-FI / SPACE scene — the couple as astronauts or star explorers: aboard a space station with a glowing planet outside the window, on a ridge of an alien world under twin moons, on the bright bridge of a starship, or beside a sleek rocket on a launchpad. Spacesuits with helmets off or held (faces clear), sleek flight suits. Awe-inspiring and futuristic.',
  },
  {
    key: 'cyberpunk',
    label: 'Neon cyberpunk',
    desc: 'A CYBERPUNK future scene — the couple in a neon-drenched, rain-slick megacity: a glowing back-alley of holographic signs, a rooftop over an endless skyline of lights, or a buzzing night market of noodle stalls and drones. Sleek techwear, neon-trimmed jackets, LED accents, a visor pushed up on the forehead (never over the eyes). Moody, electric, cinematic.',
  },
  {
    key: 'superhero',
    mediumBan: PHOTO_ADJACENT_BAN,
    label: 'Comic-book superheroes',
    desc: 'A COMIC-BOOK SUPERHERO scene — the couple as caped heroes: a dramatic rooftop stance over a city at dusk, a heroic two-person landing on a cracked street, or a bold duo pose against an explosive comic-panel sky. Vivid hero suits with chest emblems and capes, wrist gauntlets; a slim domino mask ONLY if the eyes and full face stay clearly visible (never a full cowl or helmet). Dynamic and heroic.',
  },
  {
    key: 'expedition',
    label: 'Explorers & expeditions',
    desc: 'An EXPEDITION / EXPLORER scene — the couple as intrepid adventurers: mountaineers near a snowy summit with ropes, arctic explorers by a tent under the aurora, a safari pair in tall golden grass beside an open-top jeep, or divers on a boat deck with a coral reef below. Rugged parkas, safari khakis, climbing harnesses, goggles pushed up on the forehead. Wild and cinematic.',
  },
  {
    key: 'champion',
    label: 'Sports champions',
    desc: 'A SPORTS-CHAMPION scene — the couple in a triumphant competition moment: side by side on a winners podium with medals and falling confetti, race-car drivers beside a gleaming Formula car, at the colorful top of a climbing wall, in a boxing-ring corner with gloves up, or tennis stars on a sunlit center court. Team kits, racing suits, athletic gear. Bold, victorious, energetic.',
  },
  {
    key: 'giant_critter',
    mediumBan: PHOTO_ADJACENT_BAN,
    label: 'Giant animal companions',
    desc: 'A whimsical GIANT-ANIMAL companion scene — the couple in the foreground with one adorable OVERSIZED friendly creature filling the background behind them: a house-sized fluffy corgi, a gentle rainbow unicorn, a cuddly baby dragon, or a colossal soft house-cat. The couple stay clearly in front (the giant animal is the delightful backdrop, never covering their faces). Cozy cheerful casual clothes. Charming and funny.',
  },
  {
    key: 'mounts_and_riding',
    mediumBan: PHOTO_ADJACENT_BAN,
    label: 'Magical mounts & riding',
    desc: 'A MAGICAL-MOUNT riding scene — the couple SEATED ASTRIDE, riding side by side ON the backs of wondrous steeds (each mounted on their own animal, NOT standing beside them) across a sweeping vista: a giant fluffy corgi, horses through an enchanted valley, a gentle unicorn, a great elk, or a feathered raptor. Reins in hand; rolling hills, misty peaks, or blossom fields behind. Riding leathers, cloaks, adventure clothes. The mounts stay calm and side by side so both faces stay large and clear. Joyful and epic.',
  },
  {
    key: 'companion_creatures',
    mediumBan: PHOTO_ADJACENT_BAN,
    label: 'Fantasy companion creatures',
    desc: 'A FANTASY-COMPANION scene — the couple with their own wondrous pet creature beside them: a small dragon perched on a forearm, a glowing fox familiar, a baby griffin, or a tiny phoenix. Cozy-adventurer clothes; a magical glade, a cliff overlook, or a rune-lit study. The creature stays small and beside or below them, never covering a face; both people foreground with big clear faces. Warm and wondrous.',
  },
  {
    key: 'epic_arsenal',
    mediumBan: PHOTO_ADJACENT_BAN,
    label: 'Epic weapons & arsenal',
    desc: 'An EPIC-ARSENAL hero scene — the couple wielding a colossal glowing weapon between or beside them: a massive rune-etched greatsword planted in the ground, twin plasma blades, an enormous warhammer, a glowing longbow, or a sci-fi cannon at rest. Fantasy or sci-fi armor; a battlefield ridge, a shattered temple, or a neon hangar behind. Weapons held at chest level or lower, never over a face. Bold and powerful.',
  },
  {
    key: 'tropical_adventure',
    label: 'Tropical adventure',
    desc: 'A TROPICAL-ADVENTURE scene — the couple mid-adventure in a lush paradise: clinging to a leaning coconut palm, wading a turquoise lagoon toward a waterfall, paddling an outrigger canoe, or on a rope bridge over a jungle gorge. Bright island and explorer clothes; palms, waterfalls, and reefs behind. Sun-drenched and exhilarating.',
  },
  {
    key: 'underwater_wonders',
    mediumBan: PHOTO_ADJACENT_BAN,
    label: 'Undersea wonders',
    desc: 'An UNDERSEA-WONDER scene — the couple as merfolk or free-divers gliding through a sunlit reef, alongside a gentle whale, above a sunken temple of glowing coral, or in a light-streaked kelp forest. Flowing merfolk tails or sleek dive suits (NO scuba masks over the face). Rays of light and fish behind; big clear faces toward the viewer. Serene and dazzling.',
  },
  {
    key: 'celestial_dream',
    mediumBan: PHOTO_ADJACENT_BAN,
    label: 'Celestial dream',
    desc: 'A CELESTIAL-DREAM scene — the couple among the stars: perched on a glowing crescent moon, on a floating sky-island under the aurora, catching falling stars in a lantern, or on a cloud terrace among constellations. Dreamy flowing celestial clothes; galaxies, comets, and soft starlight around them. Awe-inspiring and gorgeous.',
  },
  {
    key: 'sports_glory',
    label: 'Sports glory (peak feat)',
    desc: 'A SPORTS-GLORY hero moment — the couple at the peak of an epic athletic feat: cresting a giant surf wave, mid slam-dunk under stadium lights, breaking a marathon finish tape, hoisting a trophy in a roaring arena, or carving a powder run. Jerseys and athletic gear; crowds, banners, and spray behind. Triumphant and electric.',
  },
  {
    key: 'cozy_magic',
    mediumBan: PHOTO_ADJACENT_BAN,
    label: 'Cozy magic',
    desc: "A COZY-MAGIC scene — the couple as gentle spellweavers: stirring a glowing cauldron in a candlelit apothecary, reading a floating storybook in an enchanted library, tending luminous plants in a witch's greenhouse, or brewing potions among drifting sparks. Soft wizard robes or charmed cardigans; a warm magical glow, floating motes, and spellbooks around them. Warm, whimsical, enchanting.",
  },
  {
    key: 'mythic_legend',
    mediumBan: PHOTO_ADJACENT_BAN,
    label: 'Mythic legends',
    desc: 'A MYTHIC-LEGEND scene — the couple as figures of ancient myth: on marble Olympus among clouds and laurel, in a Norse hall of runes and firelight, on an Egyptian throne dais of gold, or before a temple of a jade dragon. Draped godly robes, laurels, golden regalia; columns, braziers, and divine light behind. Epic and painterly.',
  },
  {
    key: 'winter_wonder',
    mediumBan: PHOTO_ADJACENT_BAN,
    label: 'Winter wonderland',
    desc: 'A WINTER-WONDER scene — the couple in a magical frozen world: riding a sleigh pulled by a great white bear, before a glittering ice palace, skating a frozen aurora lake, or in a glowing snow-globe village. Cozy fur-trimmed cloaks and mittens; northern lights, snow crystals, and lantern light around them. Enchanting and luminous.',
  },
  {
    key: 'extreme_sports',
    mediumBan: PHOTO_ADJACENT_BAN,
    label: 'Extreme sports',
    desc: 'EXTREME SPORTS for the couple — a heart-pounding adrenaline moment together: side by side dropping into a surf wave, carving powder on snowboards a lane apart, on a tandem skydive, scaling a climbing wall with a clear gap between them, or launching motocross jumps together. Dynamic sports gear; any helmet or goggles pushed UP off the face. Gritty and exhilarating.',
  },
];

async function genBatch(pool, bucket, n, banList) {
  const ban = banList.length
    ? `\n\nDo NOT repeat or closely echo these already-used scenes: ${banList.slice(-40).join(' | ')}`
    : '';
  const isActive = pool === 'active';
  const dna =
    pool === 'elegant'
      ? `Each entry is a PRETTY, romantic, tasteful DRESSED-UP couple photo. CATEGORY: ${bucket.desc}`
      : isActive
        ? `Each entry is a COOL / EXCITING / FANTASTICAL couple photo where BOTH people are in a genuinely dynamic, characterful moment — an adventure/fantasy/sci-fi/heroic scene, READABLE and composed as a clear couple portrait where the two people dominate. CATEGORY: ${bucket.desc}`
        : `Each entry is a RANDOM FUNNY / oddball couple photo — genuinely amusing, with a sense of humor, but READABLE (a viewer instantly gets the joke; never so random it's incoherent). CATEGORY: ${bucket.desc}`;
  // ACTIVE pool: the pose FOLLOWS the scene text (the engine renders "caught
  // mid-action exactly as the scene describes"), so the scene MUST give each
  // person a dynamic beat + a handheld prop — that's how we escape stiff
  // stand-and-pose while staying swap-safe (face stays big + toward camera).
  const sceneRule = isActive
    ? `- scene: 12-26 words — WHERE they are + a DYNAMIC action or striking pose for EACH person (both faces toward the viewer). You have FULL FREEDOM with objects: include and embellish with held props whenever the scene naturally calls for them, OR use prop-free dynamic poses/gestures (a bold stance, a fist raised, weight shifted mid-motion) when those read stronger — let the SCENE decide what belongs. The ONLY thing to avoid is forcing a RANDOM object into every hand. Keep any hands/props at chest level or lower. Do NOT describe kissing, embracing, or facing each other.`
    : `- scene: 10-22 words — WHERE they are + the fun/pretty situation. Describe the SETTING and any props/animals/elements. Do NOT describe poses, embracing, kissing, holding, or which way they face (framing is locked elsewhere).`;
  const activeRule = isActive
    ? `\n- Both people are in a dynamic moment, BUT each face stays LARGE and toward the camera and is NEVER covered (no hand or prop over the face); any props stay at chest level or lower.`
    : '';
  const msg = await client.messages.create({
    model: SONNET,
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: `Generate ${n} DISTINCT couple-photo scenarios for an AI dream-photo app. ${dna}

Output ONLY a JSON array of ${n} objects, each: {"scene": "...", "attire": "..."}
${sceneRule}
- attire: 6-14 words — what BOTH are wearing. For period scenes, period-accurate clothing. For normal-clothes scenes, write "normal scene-appropriate everyday clothes".

HARD RULES (a render is rejected if violated — this is a FACE-SWAP couple PORTRAIT, so the two people must dominate the frame with big clear faces):
- The COUPLE are the ONLY two prominent people and the clear FOREGROUND subjects, read as a normal couple photo (think waist-up, both faces large). NO other prominent people in the shot.${activeRule}
- Any animals, creatures, or background characters stay in the BACKGROUND or off to the side — they must NEVER come between the two people or crowd/cover their faces.
- ${isActive ? `LEAD the scene with a dynamic physical MID-ACTION verb — both people actively DOING something side by side (gripping, launching, paddling, hoisting, cheering arms-up). NEVER standing, sitting, leaning, watching, gazing, or admiring — anywhere in the sentence. Keep the action HELD and grounded (no mid-air leaps or free-fall — a launch-grip at the edge, never an airborne wide shot that shrinks the couple). One clear action per scene, a clear gap between their two heads.` : `Keep it SIMPLE enough to read as a couple photo: the fun is the recognizable SETTING/situation, not a busy action tableau that shrinks the couple. One clear fun idea per scene.`}
- Both FACES fully visible — NO masks, helmets, full hoods, veils, heavy face paint, or hats pulled over the eyes. Hats/headwear are fine ONLY if the face is clearly visible.
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
    // Skip a malformed batch (e.g. unescaped quote) instead of crashing the run.
    try {
      const m = text.match(/\[[\s\S]*\]/);
      if (m) parsed = JSON.parse(m[0]);
    } catch {
      parsed = [];
    }
  }
  return Array.isArray(parsed) ? parsed.filter((o) => o && o.scene && o.attire) : [];
}

const fs = require('fs');
(async () => {
  const pools = POOL === 'both' ? ['goofy', 'elegant'] : [POOL];
  const everything = [];
  for (const pool of pools) {
    let buckets =
      pool === 'elegant' ? ELEGANT_BUCKETS : pool === 'active' ? ACTIVE_BUCKETS : GOOFY_BUCKETS;
    if (BUCKET_FILTER === 'sample') buckets = buckets.slice(0, 3);
    else if (BUCKET_FILTER)
      buckets = buckets.filter((b) => BUCKET_FILTER.split(',').includes(b.key));

    console.log(
      `\n########## POOL: ${pool.toUpperCase()} (${buckets.length} buckets × ~${PER}) ##########`
    );
    const all = [];
    const seen = new Set();
    for (const bucket of buckets) {
      console.log(`\n=== ${pool}/${bucket.key} (${bucket.label}) ===`);
      // Cross-run append safety: dedup + ban against what's ALREADY seeded
      // for this bucket, not just this run.
      const { data: existingRows } = await supabase
        .from('dual_scenarios')
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
      const got = [];
      let tries = 0;
      while (got.length < PER && tries < 6) {
        tries++;
        const batch = await genBatch(pool, bucket, Math.min(PER - got.length + 3, 20), [
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
          if (got.length >= PER) break;
        }
      }
      got.forEach((o) => {
        all.push({
          pool,
          category: bucket.key,
          scene: o.scene,
          attire: o.attire,
          pose_pool: bucket.posePool ?? null,
          medium_key: bucket.mediumKey ?? null,
          medium_ban: bucket.mediumBan ?? null,
        });
        console.log(`  • ${o.scene}  [${o.attire}]`);
      });
    }
    everything.push(...all);
    if (!DRY) {
      for (let i = 0; i < all.length; i += 200) {
        const { error } = await supabase.from('dual_scenarios').insert(all.slice(i, i + 200));
        if (error) console.error('  ❌ insert failed:', error.message);
      }
      console.log(`\n✅ inserted ${all.length} ${pool} scenarios`);
    }
  }
  // Always save a JSON backup so a generation run is never wasted (insert later).
  fs.writeFileSync('/tmp/dual_scenarios.json', JSON.stringify(everything, null, 2));
  console.log(
    `\n💾 saved ${everything.length} total to /tmp/dual_scenarios.json${DRY ? ' (dry — not inserted)' : ''}`
  );
})();
