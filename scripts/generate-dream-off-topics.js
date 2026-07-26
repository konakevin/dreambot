#!/usr/bin/env node
/**
 * Generate the Dream Off topic deck (dream_off_topics) — category-aware + QA'd.
 *
 * A THEME (pack) ships in up to two CATEGORIES, seeded separately with a
 * fundamentally different composition (migration 417):
 *   • scene — a faceless subject (object / place / creature / moment); the scene
 *     IS the star, no person appears.
 *   • cast  — the player(s) ARE the subject (face-swapped in), stored as a BARE
 *     number-flexible scenario so the game's single/couple setting prefixes it
 *     ("you as ___" / "you and your +1 as ___") at deal time. NEVER a group.
 *
 * Humor bar = Jackbox / Cards Against Humanity: raunchy, gross, savage, adult
 * SUBJECTS welcome — but always RENDERABLE (no explicit sex, no graphic gore) and
 * IP-safe (genres/archetypes only, never named characters/titles/real people).
 *
 * Quality loop (Sonnet for both): generate in batches → dedup-as-you-go against a
 * GLOBAL seen-set → QA-scan each batch (cut weak/off-tone/group/IP/dupe) → backfill
 * until each pack lands a clean `--count` (default 100). Seeds ALL packs.
 *
 * Usage:
 *   node scripts/generate-dream-off-topics.js                       # every pack, 100 each
 *   node scripts/generate-dream-off-topics.js --pack glam           # one theme (both categories)
 *   node scripts/generate-dream-off-topics.js --pack glam --category cast
 *   node scripts/generate-dream-off-topics.js --count 6 --dry-run   # preview, no insert
 *   node scripts/generate-dream-off-topics.js --no-qa               # skip the QA gate (faster)
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
const argVal = (flag, def) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : def;
};
const COUNT_OVERRIDE = args.includes('--count') ? parseInt(argVal('--count'), 10) : null;
const ONLY_PACK = argVal('--pack', null); // a base theme key
const ONLY_HOLIDAY = argVal('--holiday', null); // a holiday key
const ONLY_CATEGORY = argVal('--category', null); // 'scene' | 'cast'
const BASE_ONLY = args.includes('--base'); // base themes only
const HOLIDAYS_ONLY = args.includes('--holidays'); // holiday packs only
const DRY_RUN = args.includes('--dry-run');
const NO_QA = args.includes('--no-qa');

const BATCH = 22;
const MAX_ROUNDS = 16;

// Shared rules stitched into every prompt (category-specific bits added below).
const HUMOR = `Humor bar = a party game (Jackbox / Cards Against Humanity energy) BUT delivered with DreamBot's own whimsy and charm — clever, delightful, a little magical, never just crude for its own sake. Every idea must be 5-STAR: memorable, surprising, the kind that makes people grin or groan-laugh out loud. Raunchy, gross, savage, awkward, and adult SUBJECTS are welcome where they genuinely land — but wit and charm come first.`;
const RENDER = `Keep it RENDERABLE by an AI image model: NO explicit sexual acts and NO graphic gore/graphic violence (models refuse those). Suggestive / gross / adult SITUATIONS are fine; explicit is not.`;
const IP = `IP-safe: NEVER a named real person, celebrity, trademarked character, franchise, movie/show/game title, or brand — use the GENRE / STYLE / ARCHETYPE only (e.g. "a film-noir detective", not a named one).`;
const OPEN = `Keep any CHARACTER vague and open — describe them by their ROLE or FUNCTION only ("an old librarian", "a frazzled chef", "a doomed treasure hunter") and NEVER pin their gender, age, or human-ness ("an old man", "a woman", "a little girl", "a human ___"). Leave whether they're a mouse, a human, a deer, an undersea fish entirely open — inspire the creative leap, don't stamp out the details. (Naming a specific animal is fine ONLY when the creature itself IS the subject, e.g. a cute-creatures pack.)`;

// ── The theme grid. Each theme has a scene and/or cast composition. ────────────
const THEMES = [
  {
    key: 'cute',
    label: 'Cute',
    scene: {
      voice:
        'Impossibly adorable creatures, tiny things, cozy wholesome moments — often the cutest possible subject dropped somewhere unexpected. Makes people go "awww".',
      examples: [
        'a kennel of confused baby animals on a submarine',
        'the world’s tiniest kitten running a lemonade stand',
        'a duckling leading a parade of even smaller ducklings',
        'a hedgehog who has fallen asleep in a teacup',
      ],
    },
    cast: {
      voice:
        'Transformed into something impossibly adorable — kawaii, plushie, chibi, storybook-cute. A soft, huggable, cartoon version of the player(s).',
      examples: [
        'a kawaii plushie version of themselves',
        'the roundest chibi character at a snack party',
        'a soft storybook creature on a cozy adventure',
        'an adorable mascot who is trying their absolute best',
      ],
    },
  },
  {
    key: 'cursed',
    label: 'Cursed',
    scene: {
      voice:
        'Gross, wrong, haunted, forbidden objects and places. The ick and the wrongness — "why does this exist and who approved it".',
      examples: [
        'a porta-potty that has gained sentience',
        'a urinal-cake display at a fancy art gallery',
        'a birthday cake that is deeply, sincerely sorry',
        'a vending machine that only dispenses regret',
      ],
    },
    cast: {
      voice:
        'The player(s) as a cursed, gross, or deeply wrong figure — the thing you do not want to meet in a basement.',
      examples: [
        'the thing that lives behind the water heater',
        'a swamp gremlin caught mid-garbage-snack',
        'a cursed antique portrait whose eyes follow you',
        'a bog witch who has fully given up on hygiene',
      ],
    },
  },
  {
    key: 'chaotic',
    label: 'Chaotic',
    scene: {
      voice:
        'Absurd chaos — everything going wrong at once, drunk-party mayhem, things on fire that should not be. A single messy MOMENT, not a crowd of faces.',
      examples: [
        'the exact moment a food truck explodes',
        'a wedding cake mid-collapse',
        'the aftermath of a party nobody can remember',
        'a kitchen that is somehow entirely on fire and also flooding',
      ],
    },
    cast: {
      voice:
        'The player(s) at the dead center of a disaster they very clearly caused. Panic, mess, guilt, comedic mayhem.',
      examples: [
        'the clear cause of this entire disaster',
        'the last person standing in a total catastrophe',
        'patient zero of a very avoidable mess',
        'the prime suspect in one specific kitchen fire',
      ],
    },
  },
  {
    key: 'epic',
    label: 'Epic / Fantasy',
    scene: {
      voice:
        'Grand fantasy worlds, epic vistas, mythic places — swords, dragons, ruins, magic. No people needed; the world is the star.',
      examples: [
        'a dragon’s hoard hidden in an abandoned shopping mall',
        'an epic castle mid-siege at stormy dawn',
        'a glowing rune-covered gate deep in a canyon',
        'a battlefield the morning after, mist and banners',
      ],
    },
    cast: {
      voice:
        'The player(s) as an epic fantasy hero or villain — knight, wizard, warrior, monarch, rogue. Number-flexible.',
      examples: [
        'a battle-worn knight on a clearly doomed quest',
        'a wizard mid-spell that is going badly wrong',
        'a warlord surveying a battlefield they may have lost',
        'a rogue sneaking out of a vault, arms full of loot',
      ],
    },
  },
  {
    key: 'glam',
    label: 'Glam',
    scene: {
      voice:
        'High-fashion, luxe, iconic glamour — red carpet, couture, magazine shoots, awards stages. Dazzling and tasteful.',
      examples: [
        'the most extravagant red carpet ever rolled out',
        'a glossy high-fashion magazine cover shoot',
        'a diamond-drenched awards-show stage',
        'a couture gown so dramatic it needs its own zip code',
      ],
    },
    cast: {
      voice:
        'The player(s) as untouchable stars — red carpet, magazine cover, old-Hollywood glamour, black-tie icon. Flattering and iconic.',
      examples: [
        'an untouchable movie star owning the red carpet',
        'a glamorous magazine cover icon',
        'old-Hollywood royalty at a black-tie gala',
        'a fashion legend mid-photoshoot, wind machine blazing',
      ],
    },
  },
  {
    key: 'hot_summer',
    label: 'Hot Summer',
    scene: {
      voice:
        'Sexy-by-SETTING summer heat — pool parties, tropical beaches, neon nightlife, foam parties, glossy photoshoots. Alluring, fun, a little wild and crazy, never explicit.',
      examples: [
        'a rooftop infinity-pool party at golden hour',
        'a neon beach club going off at midnight',
        'a wild tropical foam party in full swing',
        'a yacht deck dripping with champagne and string lights',
      ],
    },
    cast: {
      voice:
        'The player(s) living their hottest, most confident summer — pool, beach, yacht, festival, beach-runway. Flattering, sultry, fun, a bit crazy — tasteful, never explicit.',
      examples: [
        'the undisputed king or queen of the pool party',
        'the effortlessly cool icon on a yacht deck',
        'a beach-runway legend in wild swim couture',
        'the undisputed main character of a tropical festival',
      ],
    },
  },
  {
    key: 'anime',
    label: 'Anime',
    scene: {
      voice:
        'Anime / manga AESTHETIC scenes (style only, no named anything) — neon cities, cherry blossoms, mecha, ramen shops, dramatic skies.',
      examples: [
        'a neon ramen shop at 2am, dramatic anime style',
        'a giant mecha standing guard over a cherry-blossom city',
        'a rooftop at sunset with sweeping anime lighting',
        'a rain-soaked neon alley, steam and glow',
      ],
    },
    cast: {
      voice:
        'The player(s) as an anime ARCHETYPE (style only) — shonen hero, magical girl, mecha pilot, chibi. Big anime energy.',
      examples: [
        'a shonen hero mid power-up scream',
        'a magical girl mid-transformation, full sparkle',
        'a mecha pilot climbing into the cockpit',
        'a chibi anime version of themselves being dramatic',
      ],
    },
  },
  {
    key: 'movies',
    label: 'Movies',
    scene: {
      voice:
        'Movie-GENRE scenes (tropes only, no titles) — film noir, horror, western, disaster, heist, sci-fi thriller.',
      examples: [
        'a rain-soaked film-noir alley under a flickering sign',
        'the basement in every single horror movie',
        'a spaghetti-western standoff at high noon',
        'a disaster movie’s "the city is doomed" wide shot',
      ],
    },
    cast: {
      voice:
        'The player(s) as a movie ARCHETYPE (trope only) — noir detective, slasher final girl, action hero, western outlaw, heist crew.',
      examples: [
        'a hard-boiled noir detective in the rain',
        'the final girl outrunning a slasher',
        'an action hero walking away from an explosion',
        'a western outlaw squinting at high noon',
      ],
    },
  },
  {
    key: 'video_games',
    label: 'Video Games',
    scene: {
      voice:
        'Video-game GENRE / aesthetic scenes (no named games) — pixel dungeons, cozy farm sims, fighting stages, retro arcades, open-world vistas.',
      examples: [
        'a pixel-art dungeon absolutely stuffed with loot',
        'a cozy farming-sim village at harvest time',
        'a neon retro arcade at closing time',
        'a fighting-game stage with a roaring crowd',
      ],
    },
    cast: {
      voice:
        'The player(s) as a game ARCHETYPE (no named games) — 8-bit hero, RPG adventurer, fighting-game fighter, racer, survival looter.',
      examples: [
        'an 8-bit platformer hero mid-jump',
        'an RPG adventurer at a glowing save point',
        'a fighter posing on the character-select screen',
        'a survival-game looter overloaded with random junk',
      ],
    },
  },
  {
    key: 'scifi',
    label: 'Sci-fi',
    scene: {
      voice:
        'Sci-fi worlds and moments — neon megacities, deep space, alien planets, retro-futurism, cyberpunk rain.',
      examples: [
        'a lonely diner at the edge of a black hole',
        'a neon megacity in endless rain',
        'an abandoned space station drifting past a ringed planet',
        'a retro-futuristic living room from the "world of tomorrow"',
      ],
    },
    cast: {
      voice:
        'The player(s) as sci-fi figures — astronaut, space pirate, cyberpunk merc, alien diplomat, doomed explorer.',
      examples: [
        'a doomed deep-space explorer, oxygen blinking red',
        'a space pirate mid-standoff on a docking bay',
        'a cyberpunk merc lit by neon in the rain',
        'an astronaut who has clearly touched something they should not have',
      ],
    },
  },
  {
    key: 'era',
    label: 'Era',
    scene: {
      voice:
        'A specific era rendered vividly (any decade or period) — 80s mall, Victorian fog, 70s disco, roaring 20s, medieval market.',
      examples: [
        'a 1980s mall food court at its absolute peak',
        'a Victorian street lost in thick fog',
        'a 1970s roller disco in full swing',
        'a roaring-1920s speakeasy behind a bookshelf',
      ],
    },
    cast: {
      voice:
        'The player(s) dropped into an era — 80s action hero, Victorian ghost, 70s disco royalty, 20s flapper, medieval peasant.',
      examples: [
        'an 80s straight-to-VHS action hero',
        'a Victorian ghost haunting a drafty manor',
        '70s disco royalty owning the dancefloor',
        'a medieval peasant deeply unimpressed with everything',
      ],
    },
  },
  {
    key: 'cozy',
    label: 'Cozy',
    scene: {
      voice:
        'The coziest, comfiest vibes imaginable — rainy days, a little cabin in the woods, a crackling fire by a whimsical bookshelf, a candlelit cottage kitchen, a snowed-in village. Warm, soft, inviting, quietly magical (cottagecore / rainy-day / curl-up-forever energy).',
      examples: [
        'a tiny cabin glowing warm in the middle of a snowstorm',
        'a rainy-day window seat buried in blankets and books',
        'a candlelit cottage kitchen full of bubbling pots',
        'a whimsical library where the fireplace never goes out',
      ],
    },
    cast: {
      voice:
        'The player(s) living the coziest storybook life — a cottage witch, a cabin hermit, a warm little baker. Soft, snug, whimsical, utterly content.',
      examples: [
        'a cozy cottage witch brewing a pot of tea',
        'a cabin hermit who has fully committed to blanket life',
        'a storybook baker in a warm, flour-dusted kitchen',
        'the whimsical keeper of a tiny enchanted library',
      ],
    },
  },
  {
    key: 'roast',
    label: 'Roast',
    // Cast-only — you cannot roast a faceless scene.
    cast: {
      voice:
        'The player(s) roasted — a savage, funny disaster. Brutal is good (it is about "us", so it is allowed to sting). Number-flexible; NEVER a group.',
      examples: [
        'a cautionary tale they warn kids about',
        'the villain in everyone else’s story',
        'a reality-TV disaster nobody can look away from',
        'the "before" photo in every infomercial',
      ],
    },
  },
  {
    key: 'worlds',
    label: 'Worlds',
    // Scene-only — a place is not a person.
    scene: {
      voice:
        'Purely imaginary, impossible, wondrous places — the scene is the whole star. Dreamlike, surreal, beautiful or bizarre. No people.',
      examples: [
        'a village where every building is a giant mushroom',
        'an airport floating on top of a thundercloud',
        'a library that grows wild like a forest',
        'a city where the streets are rivers of light',
      ],
    },
  },
];

const THEME_BY_KEY = Object.fromEntries(THEMES.map((t) => [t.key, t]));
// A holiday "standard tone" borrows a base theme's voice/examples (scene + cast)
// and wears the holiday's soul as an overlay.
const TONE_TO_THEME = {
  cute: 'cute',
  cozy: 'cozy',
  funny: 'chaotic',
  glam: 'glam',
  scary: 'cursed',
  spicy: 'hot_summer',
};
const TONE_LABEL = {
  cute: 'Cute',
  cozy: 'Cozy',
  funny: 'Funny',
  glam: 'Glam',
  scary: 'Scary',
  spicy: 'Spicy',
};

// ── Seasonal holiday packs. Each carries an authored nostalgic SOUL (injected into
// every prompt) + standard tones (borrow a base theme) + bespoke tones (their own
// authored voice). Christmas + Halloween seed to 100; the rest to 50. ────────────
const HOLIDAYS = [
  {
    key: 'halloween',
    label: 'Halloween',
    emoji: '🎃',
    count: 100,
    seasonStart: '2026-09-15',
    seasonEnd: '2026-10-31',
    soul: `Peak Halloween nostalgia: crisp autumn air, turning leaves and crunchy leaf piles, pumpkin patches at dusk, carved jack-o-lanterns flickering on porches, streets strung with orange lights, cobwebs and cardboard tombstones, foggy graveyards, haunted houses, wild costumes, and the electric thrill of trick-or-treat with a pillowcase getting heavy with candy. Spooky-fun and cozy-autumn at once.`,
    tones: ['cute', 'cozy', 'funny', 'glam', 'scary', 'spicy'],
    bespoke: [
      {
        key: 'trick_or_treat',
        label: 'Trick-or-Treat',
        scene: {
          voice:
            'The specific childhood magic of trick-or-treat night — porch lights on, leaf-strewn sidewalks under a single streetlight, the one house that goes absurdly all-out, a pillowcase heavy with candy, costumed silhouettes. Warm nostalgia with a spooky edge.',
          examples: [
            'the one house on the street that goes absurdly all-out',
            'a porch overflowing with flickering jack-o-lanterns',
            'a pillowcase collapsing under the weight of too much candy',
            'a leaf-strewn sidewalk glowing under a single streetlight',
          ],
        },
        cast: {
          voice:
            'Living trick-or-treat night to the fullest — the ultimate costume, the candy haul of legend, the strategist of the perfect route.',
          examples: [
            'a trick-or-treater with a strategically unbeatable candy route',
            'the proud owner of the best homemade costume on the block',
            'a candy connoisseur deep into an epic haul',
            'the self-appointed scout of the full-size-candy-bar house',
          ],
        },
      },
    ],
  },
  {
    key: 'christmas',
    label: 'Christmas',
    emoji: '🎄',
    count: 100,
    seasonStart: '2026-12-01',
    seasonEnd: '2026-12-26',
    soul: `Deep Christmas nostalgia: sledding down a snowy hill, the tree glowing in a dark quiet room late at night, stockings by the fire, the smell of a real pine tree, twinkling lights on snowy streets, cocoa and cookies, waiting up for Santa, that specific cozy magical hush of Christmas Eve. Wonder, warmth, and a little chaos.`,
    tones: ['cute', 'cozy', 'funny', 'glam', 'spicy'],
    bespoke: [
      {
        key: 'north_pole',
        label: 'North Pole',
        scene: {
          voice:
            "Santa's North Pole world in full magic — the toy workshop in overdrive, elves on the assembly line, reindeer stables, the sleigh being loaded, candy-cane infrastructure, snow-globe wonder.",
          examples: [
            "santa's toy workshop working triple overtime",
            'a reindeer stable the night before the big flight',
            'an elf assembly line with minor quality-control issues',
            'the sleigh being loaded well past any reasonable weight limit',
          ],
        },
        cast: {
          voice:
            'A North Pole VIP — Santa, a head elf, a reindeer wrangler, the auditor of the naughty-and-nice list.',
          examples: [
            'a wildly overworked head elf',
            'santa on the single most stressful night of the year',
            'the reindeer everyone secretly thinks runs the whole operation',
            'the auditor of the naughty-and-nice list taking it far too seriously',
          ],
        },
      },
    ],
  },
  {
    key: 'new_years',
    label: "New Year's",
    emoji: '🎉',
    count: 50,
    seasonStart: '2026-12-27',
    seasonEnd: '2027-01-02',
    soul: `New Year's Eve energy: the glittering countdown, confetti raining at midnight, champagne towers and clinking glasses, fireworks bursting over the skyline, the collective roar at zero, sequins and party hats, and the bittersweet magic of one year ending and another starting (plus resolutions already doomed).`,
    tones: ['cute', 'cozy', 'funny', 'glam', 'spicy'],
    bespoke: [],
  },
  {
    key: 'st_patricks',
    label: "St. Patrick's Day",
    emoji: '☘️',
    count: 50,
    seasonStart: '2027-03-10',
    seasonEnd: '2027-03-17',
    soul: `St. Patrick's Day: cozy-loud pubs and overflowing pints, shamrocks and four-leaf clovers, mischievous leprechauns, rainbows arcing to a pot of gold, everything dyed impossibly green, parades and lucky charms, and a general air of merry, slightly-chaotic good luck.`,
    tones: ['cute', 'funny', 'spicy'],
    bespoke: [],
  },
  {
    key: 'easter',
    label: 'Easter',
    emoji: '🐰',
    count: 50,
    seasonStart: '2027-03-20',
    seasonEnd: '2027-04-05',
    soul: `Easter in full spring bloom: fuzzy chicks and floppy-eared bunnies, pastel everything, egg hunts across dewy grass, baskets of foil-wrapped chocolate, blossoming meadows and gentle morning light, bonnets and Sunday best, the soft pastel magic of spring returning.`,
    tones: ['cute', 'cozy', 'funny'],
    bespoke: [],
  },
  {
    key: 'july_4th',
    label: '4th of July',
    emoji: '🎆',
    count: 50,
    seasonStart: '2027-06-28',
    seasonEnd: '2027-07-04',
    soul: `The 4th of July: fireworks blooming over a lake at dusk, backyard BBQ smoke and sizzling grills, red-white-and-blue everything, sparklers trailing in the dark, small-town parades, watermelon and lawn chairs, and the loud, proud, peak-summer heart of Americana.`,
    tones: ['cute', 'funny', 'spicy'],
    bespoke: [
      {
        key: 'epic',
        label: 'Epic',
        scene: {
          voice:
            'The most gloriously over-the-top, self-aware "AMERICA, F**K YEAH" spectacle imaginable — bald eagles, walls of fireworks, absurd patriotic grandeur, freedom cranked to eleven. Epic AND hilarious.',
          examples: [
            'a bald eagle screaming as a wall of fireworks erupts behind it',
            'the single most excessive fireworks finale in human history',
            'a flag-draped monster truck mid-jump over the grand canyon',
            'a bbq grill roughly the size of an aircraft carrier',
          ],
        },
        cast: {
          voice:
            'The most absurdly epic patriot alive — freedom incarnate, saluting the sky, riding eagles into glory. Over-the-top and funny.',
          examples: [
            'a hyper-patriotic action hero saluting a sky full of fireworks',
            'a freedom-loving legend riding a bald eagle into battle',
            'the self-appointed five-star general of the neighborhood fireworks show',
            'a star-spangled champion flexing directly at the sun',
          ],
        },
      },
    ],
  },
  {
    key: 'valentines',
    label: "Valentine's Day",
    emoji: '💘',
    count: 50,
    seasonStart: '2027-02-07',
    seasonEnd: '2027-02-14',
    soul: `Valentine's Day: roses and heart-shaped everything, candlelit dinners, boxes of chocolate, handwritten cards, cupid and his arrows, teddy bears, blushing romance and grand gestures — and all the ways love goes hilariously sideways.`,
    tones: ['cute', 'cozy', 'funny', 'glam', 'spicy'],
    bespoke: [
      {
        key: 'disaster_date',
        label: 'Disaster Date',
        scene: {
          voice:
            'Romance gone gloriously, comically wrong — a candlelit dinner on fire, a bouquet that has given up, a heart-shaped everything collapsing, the aftermath of a grand gesture that backfired spectacularly.',
          examples: [
            'a candlelit dinner that is now just, technically, on fire',
            'a bouquet of roses that has completely given up',
            'a heart-shaped cake mid-structural-failure',
            'the aftermath of a proposal that did not go as planned',
          ],
        },
        cast: {
          voice:
            'Starring in a romance falling apart in real time — the worst date ever, a grand gesture backfiring, love nobody asked for. Number-flexible.',
          examples: [
            'a hopeless romantic whose grand gesture just backfired',
            'the survivor of the worst blind date in history',
            'a cupid with catastrophically bad aim',
            'someone whose romantic plans have spectacularly imploded',
          ],
        },
      },
    ],
  },
];

function normKey(t) {
  return t
    .toLowerCase()
    .replace(/^(a|an|the|you as|you and your \+1 as)\s+/, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseTopics(text) {
  return text
    .split('\n')
    .map((l) => l.replace(/^[\s\-\d.)*]+/, '').trim())
    .map((l) =>
      l
        .replace(/["“”]/g, '')
        .replace(/[.\s]+$/, '')
        .trim()
    )
    .filter((l) => l.length >= 3 && l.length <= 90 && l.split(' ').length <= 15);
}

async function withRetry(fn, maxRetries = 4) {
  const delays = [2000, 5000, 12000, 30000];
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const retryable = err.status === 429 || err.status === 529 || err.status >= 500;
      if (!retryable || attempt === maxRetries) throw err;
      const d = delays[Math.min(attempt, delays.length - 1)];
      console.log(`   ⏳ ${err.status} overloaded, retry in ${d / 1000}s`);
      await new Promise((r) => setTimeout(r, d));
    }
  }
}

function categoryRules(category) {
  if (category === 'scene') {
    return `This is a SCENE pack: each topic is a FULL faceless scene/subject — the scene, object, creature, or moment IS the subject. NO people cast in ("you"/"your +1" must NOT appear). Paint one clear, renderable image.`;
  }
  return `This is a CAST pack: each topic is a BARE ROLE / CHARACTER as a NOUN PHRASE that MUST read cleanly as BOTH "you as ___" (single) AND "you and your +1 as ___" (a couple). GOOD: "a battle-worn knight", "the villain in every story", "reality-TV royalty". BAD (do NOT do these):
- a bare action ("dragged from the ocean"), an -ing phrase ("owning the pool party"), or a bare adjective ("absolutely feral") — they break after "you as".
- anything SINGULAR-LOCKED that contradicts a couple: "the lone/only/last/sole ___", "a solo ___", "___ by yourself". It must make sense for TWO people too.
The player(s) are the visible face-swapped subject: exactly ONE person or a couple — NEVER a crowd or group of 3+.`;
}

async function genBatch(spec, n, avoidList) {
  const avoid =
    avoidList.length > 0
      ? `\n\nAlready used — DO NOT repeat these or anything close in concept:\n${avoidList
          .slice(-70)
          .map((a) => `- ${a}`)
          .join('\n')}`
      : '';
  const holiday = spec.soul
    ? `\n\nHOLIDAY — this is a ${spec.label} pack. Every topic MUST be an unmistakable ${spec.label} take, dripping with nostalgia. ${spec.soul} Tap genuine, specific, evocative detail; NO generic clichés or random mashups — make people FEEL the holiday.`
    : '';
  const prompt = `You are writing topics for "Dream Off", a party game where friends each generate an AI dream image interpreting the same funny topic, then blind-vote the results.

Generate ${n} FRESH, distinct topics for the "${spec.label}" pack.

${categoryRules(spec.category)}

Pack voice: ${spec.voice}${holiday}

Good examples (match the register + length, DO NOT reuse them):
${spec.examples.map((e) => `- ${e}`).join('\n')}

Rules:
- Each topic is a SHORT phrase (~3-12 words), lowercase, no ending punctuation.
- VISUAL + renderable — it must paint one clear image.
- ${HUMOR}
- ${RENDER}
- ${IP} No real player names either.${spec.category === 'scene' ? `\n- ${OPEN}` : ''}
- Vary the ideas WIDELY (no two alike).${avoid}

Return ONLY the ${n} topics, one per line, no numbering, no commentary.`;
  const msg = await withRetry(() =>
    client.messages.create({
      model: SONNET,
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })
  );
  return parseTopics(msg.content.map((c) => (c.type === 'text' ? c.text : '')).join(''));
}

// Sonnet QA gate: returns a Set of the exact topic strings that should be CUT.
async function qaScan(spec, topics) {
  if (topics.length === 0) return new Set();
  const category = spec.category;
  const groupRule =
    category === 'cast'
      ? ' or implies a GROUP of 3+ people (cast topics must be one person or a couple only)'
      : ' or accidentally casts a specific person ("you") into a scene pack';
  const castCheck =
    category === 'cast'
      ? `\n- (CAST — critical) does NOT transform cleanly into BOTH a single AND a couple prompt: read each as "you as [X]" AND as "you and your +1 as [X]". Flag it if EITHER reading is grammatically broken (it's a bare action / -ing phrase / adjective, not a role noun phrase) OR it is SINGULAR-LOCKED and contradicts a couple ("the lone/only/last/sole ___", "a solo ___", "by yourself")`
      : '';
  const openCheck =
    category === 'scene'
      ? `\n- (SCENE) PINS a character's gender / age / human-ness instead of using an OPEN role ("an old man", "a woman", "a little girl", "a human ___") — a character must be described by ROLE only so the form stays open (naming a specific animal is OK only when the creature itself is the whole subject)`
      : '';
  const holidayCheck = spec.soul
    ? `\n- is NOT an unmistakable ${spec.label} topic, OR leans on a generic holiday cliché instead of specific, nostalgic, evocative detail`
    : '';
  const holidayCtx = spec.soul
    ? `\nThis is a HOLIDAY pack — every topic must be a clear, nostalgic ${spec.label} take. ${spec.soul}`
    : '';
  const prompt = `You are the strict QA gate for "Dream Off" party-game topics.
Pack: "${spec.label}" (${category}). ${categoryRules(category)}${holidayCtx}

Hold a HIGH bar — we only keep 5-STAR ideas: clever, surprising, genuinely funny, with wit and a bit of DreamBot whimsy/charm. Flag a topic as BAD if it is ANY of:
- NOT 5-star: merely okay, weak, generic, forgettable, or not actually funny/clever
- crude or gross WITHOUT wit (party-game edge is great, but it must be clever + charming, not shock for its own sake), or off-tone for this pack
- NOT renderable by an AI image model: explicit sexual content, graphic gore${groupRule}
- names a real person/celebrity, a trademarked character, or a movie/show/game/brand title
- a near-duplicate CONCEPT of another topic in the list${holidayCheck}${openCheck}${castCheck}

Topics:
${topics.map((t, i) => `${i + 1}. ${t}`).join('\n')}

Return ONLY the exact text of the BAD topics, one per line (return nothing if all are good).`;
  const msg = await withRetry(() =>
    client.messages.create({
      model: SONNET,
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    })
  );
  const flagged = parseTopics(msg.content.map((c) => (c.type === 'text' ? c.text : '')).join(''));
  const flaggedKeys = new Set(flagged.map(normKey));
  return new Set(topics.filter((t) => flaggedKeys.has(normKey(t))));
}

// Generate a clean `target` for one (theme, category): dedup-as-you-go + per-batch
// QA, backfilling until the pack is full of QA-passed uniques.
async function genPackCategory(spec, seen) {
  const target = spec.count;
  const kept = [];
  const avoid = [];
  let rounds = 0;
  let cutTotal = 0;
  while (kept.length < target && rounds < MAX_ROUNDS) {
    rounds++;
    const need = Math.min(BATCH, target - kept.length + 6);
    const batch = await genBatch(spec, need, avoid);
    const uniques = [];
    for (const t of batch) {
      const k = normKey(t);
      if (k.length < 3 || seen.has(k)) continue;
      seen.add(k);
      avoid.push(t);
      uniques.push(t);
    }
    let good = uniques;
    if (!NO_QA && uniques.length) {
      const bad = await qaScan(spec, uniques);
      cutTotal += bad.size;
      good = uniques.filter((t) => !bad.has(t));
    }
    kept.push(...good);
    process.stdout.write(
      `   round ${rounds}: +${good.length}${NO_QA ? '' : ` (QA cut ${uniques.length - good.length})`} → ${kept.length}/${target}\n`
    );
    if (uniques.length === 0 && rounds >= 3) break;
  }
  return { topics: kept.slice(0, target), cut: cutTotal };
}

// Build the full list of pack specs (base themes + holiday tone-combos), honoring
// the CLI filters. Counts default to base=100 / per-holiday (50 or 100); --count
// overrides everything.
function buildSpecs() {
  const specs = [];
  if (!HOLIDAYS_ONLY && !ONLY_HOLIDAY) {
    for (const theme of THEMES) {
      for (const category of ['scene', 'cast']) {
        if (!theme[category]) continue;
        if (ONLY_PACK && theme.key !== ONLY_PACK) continue;
        if (ONLY_CATEGORY && category !== ONLY_CATEGORY) continue;
        specs.push({
          packKey: theme.key,
          label: theme.label,
          category,
          voice: theme[category].voice,
          examples: theme[category].examples,
          soul: null,
          count: 100,
        });
      }
    }
  }
  if (!BASE_ONLY && !ONLY_PACK) {
    for (const hol of HOLIDAYS) {
      if (ONLY_HOLIDAY && hol.key !== ONLY_HOLIDAY) continue;
      const combos = [
        ...hol.tones.map((tone) => ({
          comp: THEME_BY_KEY[TONE_TO_THEME[tone]],
          key: tone,
          label: TONE_LABEL[tone],
        })),
        ...(hol.bespoke || []).map((b) => ({ comp: b, key: b.key, label: b.label })),
      ];
      for (const c of combos) {
        for (const category of ['scene', 'cast']) {
          if (!c.comp[category]) continue;
          if (ONLY_CATEGORY && category !== ONLY_CATEGORY) continue;
          specs.push({
            packKey: `${hol.key}_${c.key}`,
            label: `${hol.emoji} ${hol.label} · ${c.label}`,
            category,
            voice: c.comp[category].voice,
            examples: c.comp[category].examples,
            soul: hol.soul,
            count: hol.count,
            seasonStart: hol.seasonStart,
            seasonEnd: hol.seasonEnd,
          });
        }
      }
    }
  }
  if (COUNT_OVERRIDE != null) for (const s of specs) s.count = COUNT_OVERRIDE;
  return specs;
}

async function main() {
  const specs = buildSpecs();
  if (specs.length === 0) {
    console.error('No matching packs.');
    process.exit(1);
  }

  // Global dedup set — preloaded from existing rows so re-runs top up + never
  // collide cross-pack/cross-category.
  const seen = new Set();
  if (!DRY_RUN) {
    // Paginate — PostgREST silently caps a single read at 1000 rows, which would
    // leave most of an existing deck out of the cross-dedup set.
    for (let from = 0; ; from += 1000) {
      const { data } = await supabase
        .from('dream_off_topics')
        .select('topic_text')
        .range(from, from + 999);
      for (const r of data ?? []) seen.add(normKey(r.topic_text));
      if (!data || data.length < 1000) break;
    }
    console.log(`Preloaded ${seen.size} existing topics into the dedup set.`);
  }
  console.log(`${specs.length} pack(s) to seed.\n`);

  let grand = 0;
  for (const spec of specs) {
    console.log(`▶ ${spec.label} / ${spec.category} — target ${spec.count}`);
    const { topics, cut } = await genPackCategory(spec, seen);
    console.log(`   → ${topics.length} clean (QA cut ${cut} total)`);

    if (DRY_RUN) {
      topics.slice(0, 12).forEach((t) => console.log(`   · ${t}`));
      if (topics.length > 12) console.log(`   … (+${topics.length - 12} more)`);
      grand += topics.length;
      continue;
    }
    if (topics.length === 0) continue;
    const rows = topics.map((t) => ({
      pack: spec.packKey,
      category: spec.category,
      topic_text: t,
      tone: 'sfw',
      is_active: true,
      ...(spec.seasonStart ? { season_start: spec.seasonStart, season_end: spec.seasonEnd } : {}),
    }));
    const { error } = await supabase.from('dream_off_topics').insert(rows);
    if (error) {
      console.error(`   ✖ insert failed: ${error.message}`);
      process.exit(1);
    }
    console.log(`   ✓ inserted ${rows.length}`);
    grand += rows.length;
  }

  console.log(
    `\n${DRY_RUN ? 'Would generate' : 'Inserted'} ${grand} topics across ${specs.length} pack(s).`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
