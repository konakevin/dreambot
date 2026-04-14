/**
 * Generate ~6200 dream scene templates using Sonnet and insert into nightly_seeds table.
 * 31 categories × 200 templates each.
 * One-time cost — run once, never again.
 *
 * Usage:
 *   node scripts/generate-dream-templates.js
 *
 * Reads ANTHROPIC_API_KEY and SUPABASE_SERVICE_ROLE_KEY from .env.local
 */

require('dotenv').config({ path: '.env.local' });
const Anthropic = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(
  'https://jimftynwrinwenonjrlj.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const CATEGORIES = [
  {
    key: 'cosmic',
    name: 'Cosmic/Astronomical',
    description:
      'Standing on stars, planets as neighbors, walking between galaxies, the edge of the universe is a wall, moons with faces, solar systems in jars, nebulae you can touch',
  },
  {
    key: 'microscopic',
    name: 'Microscopic/Tiny',
    description:
      'Worlds inside dewdrops, cities on coins, civilizations between floor tiles, landscapes on a fingertip, entire ecosystems in a teacup, atoms as planets',
  },
  {
    key: 'impossible_architecture',
    name: 'Impossible Architecture',
    description:
      'Buildings that defy physics, infinite rooms, staircases to nowhere, doors that open into the sky, hallways that loop, rooms bigger inside than outside, upside-down cathedrals',
  },
  {
    key: 'giant_objects',
    name: 'Giant Objects',
    description:
      'Everyday things at mountain scale, living among enormous mundane objects, a fork the size of a skyscraper, buttons as big as lakes, a shoe as a house',
  },
  {
    key: 'peaceful_absurdity',
    name: 'Peaceful Absurdity',
    description:
      'Calm scenes that make no sense, serene impossibility, a picnic on a cloud, fish swimming through air casually, a garden growing upside down and nobody minds',
  },
  {
    key: 'beautiful_melancholy',
    name: 'Beautiful Melancholy',
    description:
      'Gorgeous sadness, empty places that feel full of memory, the last light of something, bittersweet beauty, loneliness that is somehow comforting',
  },
  {
    key: 'cosmic_horror',
    name: 'Cosmic Horror (lite)',
    description:
      'Vast unknowable things at the edge of vision, unsettling scale, awe mixed with dread, something watching from behind the stars, geometry that hurts to look at — but beautiful, not gory',
  },
  {
    key: 'joyful_chaos',
    name: 'Joyful Chaos',
    description:
      'Explosive color, celebration, everything going wonderfully wrong, confetti physics, parades of impossible creatures, joy that breaks reality',
  },
  {
    key: 'eerie_stillness',
    name: 'Eerie Stillness',
    description:
      'Frozen moments, abandoned but alive, quiet wrongness, something just happened or is about to happen, the silence is loud, everything is watching',
  },
  {
    key: 'broken_gravity',
    name: 'Broken Gravity',
    description:
      'Falling sideways, floating worlds, upside-down landscapes, rain that falls upward, rivers that flow into the sky, people walking on walls casually',
  },
  {
    key: 'wrong_materials',
    name: 'Wrong Materials',
    description:
      'Oceans of glass, clouds of fabric, stone that is soft, fire that is cold, wood that flows like water, metal that breathes, ice that burns, silk mountains',
  },
  {
    key: 'time_distortion',
    name: 'Time Distortion',
    description:
      'Frozen mid-action, multiple seasons at once, decay and growth happening simultaneously, clocks melting, yesterday and tomorrow coexisting, aging in reverse',
  },
  {
    key: 'merged_worlds',
    name: 'Merged Worlds',
    description:
      'Half underwater half desert, two realities overlapping, seams between dimensions visible, one world bleeding into another, the border between dream and waking',
  },
  {
    key: 'living_objects',
    name: 'Living Objects',
    description:
      'Furniture with feelings, buildings breathing, mountains walking slowly, books that read themselves, chairs that are tired, roads that choose where to go',
  },
  {
    key: 'impossible_weather',
    name: 'Impossible Weather',
    description:
      'Raining objects, snow made of light, storms of color, fog made of music, hail made of tiny gems, wind you can see as ribbons, thunder that paints the sky',
  },
  {
    key: 'overgrown',
    name: 'Overgrown/Reclaimed',
    description:
      'Nature eating civilization, forests growing through skyscrapers, coral on highways, moss on satellites, vines reclaiming a mall, trees through a piano',
  },
  {
    key: 'bioluminescence',
    name: 'Bioluminescence & Light',
    description:
      'Everything glows from inside, light has weight and texture, darkness is a tangible substance, neon organisms, phosphorescent oceans, light dripping like honey',
  },
  {
    key: 'dreams_within_dreams',
    name: 'Dreams Within Dreams',
    description:
      'Recursive worlds, scenes containing smaller versions of themselves, a painting of the room you are in, a TV showing what is behind you, infinite regression, mise en abyme',
  },
  {
    key: 'memory_distortion',
    name: 'Memory Distortion',
    description:
      'Familiar places remembered wrong, childhood rooms at adult scale, your school but the halls go on forever, home but the colors are wrong, nostalgia warped',
  },
  {
    key: 'abandoned_running',
    name: 'Abandoned & Running',
    description:
      'Empty places still operating, food still warm, music still playing, lights on but nobody home, a party that everyone just left, machines running with no purpose',
  },
  {
    key: 'transformation',
    name: 'Transformation Mid-Process',
    description:
      'Things becoming other things, caught between states, a bird halfway to being a cloud, a building melting into a tree, ice becoming fire, caterpillar-to-butterfly frozen halfway',
  },
  {
    key: 'reflections',
    name: 'Reflections & Doubles',
    description:
      'Mirror worlds that do not match, reflections with their own lives, shadows that disagree, everything exists twice but slightly different, puddles showing other skies',
  },
  {
    key: 'machines',
    name: 'Machines & Mechanisms',
    description:
      'Clockwork landscapes, gears made of bone, engines powered by emotions, mechanical organisms, factories that grow organically, perpetual motion sculptures',
  },
  {
    key: 'music_sound',
    name: 'Music & Sound',
    description:
      'Visible sound waves shaping landscapes, silence as a physical wall, instruments that play themselves, musical notes as architecture, bass drops creating craters',
  },
  {
    key: 'underwater',
    name: 'Underwater & Deep',
    description:
      'Sunken civilizations still lit up and functioning, pressure that warps reality, abyssal creatures made of light, the bottom of everything, deep trenches as doorways',
  },
  {
    key: 'doors_portals',
    name: 'Doors & Portals',
    description:
      'Doors to nowhere, windows between worlds, hallways that change behind you, thresholds between states of being, keyholes showing other dimensions, a door in the middle of a field',
  },
  {
    key: 'collections',
    name: 'Collections & Multitudes',
    description:
      'Thousands of the same thing stretching to the horizon, vast crowds of objects, walls of faces, infinite shelves, everything ever lost collected in one room, a field of clocks',
  },
  {
    key: 'decay_beauty',
    name: 'Decay & Beauty',
    description:
      'Rust that is gorgeous, rot that glows, crumbling things more beautiful broken, entropy as art, peeling paint revealing galaxies, beautiful destruction',
  },
  {
    key: 'childhood',
    name: 'Childhood & Scale Shift',
    description:
      "Adult world from a child's height, toys that are real size, bedrooms the size of countries, monsters under the bed that are actually kind, blanket forts as castles",
  },
  {
    key: 'transparency',
    name: 'Transparency & Layers',
    description:
      'See-through everything, X-ray worlds, layered realities stacked like glass, the inside of the outside visible simultaneously, translucent mountains, transparent oceans showing the core of the earth',
  },
  {
    key: 'cinematic',
    name: 'Cinematic Moments',
    description:
      "A frame from a film that doesn't exist, dramatic camera angles, lens flares, the moment right before something epic happens, mid-chase freeze frame, noir shadows in wrong settings, western standoffs on the moon, the establishing shot of an impossible city",
  },
];

async function generateBatch(category, batchNum) {
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    messages: [
      {
        role: 'user',
        content: `Generate 100 surreal dream scene templates for category: "${category.name}"

Theme: ${category.description}

Each template has optional slots: \${character}, \${place}, \${thing}. Not all need to be used. Many templates should work WITHOUT any slots — pure surreal scenes.

Rules:
- Every template must fit the "${category.name}" theme
- IMPOSSIBLY creative — these should make people go "holy shit"
- 15-30 words each
- Vary within the theme — don't repeat the same structure
- Be CONCRETE and VISUAL — describe what we SEE
- Mix scales: some epic, some intimate, some vast, some tiny
- Use \${character}, \${place}, \${thing} as JS template literal placeholders where they fit naturally
- Batch ${batchNum} of 2 — make these DIFFERENT from what batch ${batchNum === 1 ? 2 : 1} would have

Output ONLY a JSON array of 100 strings. No commentary.`,
      },
    ],
  });
  return msg.content[0].text;
}

function parseJson(text) {
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error('No JSON array found');
  return JSON.parse(match[0]);
}

async function insertBatch(category, templates) {
  const rows = templates.map((t) => ({
    category: category.key,
    template: t,
  }));

  // Insert in chunks of 100
  for (let i = 0; i < rows.length; i += 100) {
    const chunk = rows.slice(i, i + 100);
    const { error } = await supabase.from('nightly_seeds').insert(chunk);
    if (error) {
      console.error(`  DB insert error:`, error.message);
    }
  }
}

const SKIP = (process.env.SKIP_CATEGORIES || '').split(',').filter(Boolean);

(async () => {
  let totalInserted = 0;

  for (let i = 0; i < CATEGORIES.length; i++) {
    if (SKIP.includes(CATEGORIES[i].key)) {
      console.log(`[${i + 1}/${CATEGORIES.length}] SKIPPING ${CATEGORIES[i].name} (already done)`);
      continue;
    }
    const cat = CATEGORIES[i];
    console.log(`\n[${i + 1}/${CATEGORIES.length}] ${cat.name} (${cat.key})...`);

    let templates = [];
    try {
      // Batch 1
      const raw1 = await generateBatch(cat, 1);
      const batch1 = parseJson(raw1);
      console.log(`  Batch 1: ${batch1.length} templates`);
      templates.push(...batch1);

      // Batch 2
      const raw2 = await generateBatch(cat, 2);
      const batch2 = parseJson(raw2);
      console.log(`  Batch 2: ${batch2.length} templates`);
      templates.push(...batch2);
    } catch (err) {
      console.error(`  ERROR generating ${cat.name}:`, err.message);
      // Try once more with just one batch
      try {
        const raw = await generateBatch(cat, 1);
        templates = parseJson(raw);
        console.log(`  Recovered ${templates.length} templates`);
      } catch {
        console.error(`  SKIPPED ${cat.name}`);
        continue;
      }
    }

    // Dedup within category
    const unique = [...new Set(templates)];
    console.log(`  Unique: ${unique.length}`);

    // Insert into DB
    await insertBatch(cat, unique);
    totalInserted += unique.length;
    console.log(`  Inserted. Running total: ${totalInserted}`);
  }

  console.log(`\n\nDONE. Total templates inserted: ${totalInserted}`);
})();
