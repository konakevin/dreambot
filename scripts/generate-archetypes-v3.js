#!/usr/bin/env node
'use strict';

/**
 * generate-archetypes-v3.js — Generate themed packs of high-quality archetypes.
 * Appends to existing library, doesn't replace.
 *
 * Usage:
 *   node scripts/generate-archetypes-v3.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envFile = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    if (!process.env[trimmed.slice(0, eq).trim()])
      process.env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
}

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const VALID_MOODS = [
  'cozy',
  'epic',
  'dreamy',
  'moody',
  'playful',
  'serene',
  'intense',
  'nostalgic',
  'mysterious',
  'whimsical',
  'dramatic',
  'peaceful',
];
const VALID_INTERESTS = [
  'animals',
  'nature',
  'fantasy',
  'sci_fi',
  'architecture',
  'fashion',
  'food',
  'abstract',
  'dark',
  'cute',
  'ocean',
  'space',
  'whimsical',
  'gaming',
  'movies',
  'music',
  'geek',
  'sports',
  'travel',
  'pride',
];

async function callHaiku(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Haiku ${res.status}`);
  const data = await res.json();
  return data.content?.[0]?.text?.trim() ?? '';
}

function buildPrompt(themeDescription, count = 10) {
  return `You are designing dream scenarios for an AI dream image generator app. Audience: 18-40 year olds who love pop culture, aesthetics, nostalgia, adventure, beauty, and things that make them feel something.

THEME FOR THIS BATCH: ${themeDescription}

HERE ARE EXAMPLES OF GREAT DREAM SCENARIOS (match this quality):

{
  "key": "universal_impossible_landscape",
  "name": "The Impossible Landscape",
  "trigger_interests": ["nature", "abstract", "space", "fantasy"],
  "trigger_moods": ["epic", "dreamy", "serene", "mysterious"],
  "prompt_context": "Tonight you dream of places that can't exist but do. A waterfall flowing upward into a crack in the sky. A mountain range made of frozen waves, sunlight hitting the crests. A desert where the sand dunes are different colors — violet, gold, teal — and they shift like breathing. An ocean with no horizon, the water curving up at the edges until it becomes the sky. A forest growing upside-down from a glass ceiling, roots reaching toward a sun below. No people. Just impossible, breathtaking geography."
}

{
  "key": "dark_viking_saga",
  "name": "The Viking Saga",
  "trigger_interests": ["dark", "nature"],
  "trigger_moods": ["epic", "intense", "dramatic", "moody"],
  "prompt_context": "Tonight you dream of the old north. A longship cutting through fog, dragon prow emerging from mist, oars moving in perfect rhythm. A warrior standing on a cliff in a blizzard, fur cloak whipping, axe planted in the ground, watching for something on the horizon. A mead hall at night, fire roaring in the center pit, shadows of celebrating warriors on the walls. Runes carved into standing stones, glowing faintly in moonlight. Northern lights over a frozen fjord, the colors reflected in black water. Glory and ice and the end of the world."
}

{
  "key": "ocean_retro_beach_town",
  "name": "The Neon Pier at Midnight",
  "trigger_interests": ["ocean", "music"],
  "trigger_moods": ["nostalgic", "dreamy", "moody"],
  "prompt_context": "Tonight you dream of a 1980s beach town that exists outside of time. A pier stretches into the dark ocean, lined with neon signs reflecting off wet boardwalk—hot pink, electric blue, pale yellow. An arcade glows at the pier's end, vintage games visible through salt-stained windows. The ocean beyond is dark and calm, dotted with fishing boats whose warm lights mirror the stars. An old diner sits on stilts over the water, red vinyl booths visible through windows, a neon 'OPEN 24H' sign flickering."
}

Generate ${count} dream scenarios for this theme.

RULES:
- Each must be SPECIFIC and VIVID — not generic moods. Every prompt_context should have 5-8 concrete scene descriptions that an AI image generator would produce stunning results from.
- trigger_interests MUST only use values from: ${VALID_INTERESTS.join(', ')}. Pick 2-4 that fit.
- trigger_moods MUST only use values from: ${VALID_MOODS.join(', ')}. Pick 3-4 that fit.
- Keys should be descriptive: "vista_crystal_canyon" not "landscape_1"
- Names should be evocative: "The Crystal Canyon" not "Pretty Landscape"
- 18-40 year old audience — make it feel fresh, not like a nature documentary
- Output valid JSON array. No markdown. No backticks.`;
}

const THEME_PACKS = [
  // ═══ EPIC LANDSCAPES & VISTAS (the big gap) ═══
  {
    name: 'Alien Worlds',
    count: 15,
    prompt:
      "Alien planets and otherworldly landscapes. NOT sci-fi with spaceships — just the raw landscapes themselves. Crystal deserts, bioluminescent jungles, oceans of mercury, skies with three moons, forests of glass, mountains that float. Every scene should be a place you want to stand in and stare. Think Pandora, No Man's Sky, Roger Dean album covers. Pure visual spectacle, no humans needed.",
  },
  {
    name: 'Earth Vistas',
    count: 15,
    prompt:
      'The most breathtaking places on Earth, real and imagined — but seen through dream logic. Not photos, DREAMS of these places. The Grand Canyon at impossible scale. Bioluminescent beaches that go on forever. Northern lights so vivid they cast shadows. Rice terraces that spiral into clouds. Underwater caves that glow. Cherry blossom tunnels a mile long. The prettiest places in the world turned up to 11.',
  },
  {
    name: 'Surreal Color Worlds',
    count: 10,
    prompt:
      'Worlds where color itself is the subject. A forest where every tree is a different neon color. An ocean that shifts from turquoise to magenta to gold. A desert of pink sand under a green sky. Landscapes oversaturated beyond reality — like someone turned the saturation slider to max and it became beautiful instead of garish. Infrared photography aesthetics. Color as emotion, color as landscape, color as the whole point.',
  },
  {
    name: 'Microscopic Worlds',
    count: 10,
    prompt:
      'The universe at tiny scale — but rendered as vast landscapes. Inside a dewdrop that contains a galaxy. A snowflake crystal as big as a cathedral. The surface of a leaf that looks like an alien rainforest. Pollen grains like golden planets. The inside of a geode as a cave you could walk through. Everything tiny made enormous and breathtaking.',
  },
  {
    name: 'Weather as Spectacle',
    count: 10,
    prompt:
      "Weather so dramatic it becomes art. Supercell storms with structure visible. Lightning frozen in time branching across the entire sky. A tornado lit from inside by sunset. The eye of a hurricane from above. Fog so thick a city becomes ghosts. Rain that turns a landscape into pure reflection. Snow falling in a sunbeam. The raw power of weather rendered as the most beautiful thing you've ever seen.",
  },
  {
    name: 'Underwater Worlds',
    count: 10,
    prompt:
      'The ocean as an alien planet. Not cute fish and coral — the VAST, DEEP, STRANGE ocean. Cathedral-sized underwater caverns. Hydrothermal vents in total darkness lit only by bioluminescence. Kelp forests so tall they have their own weather. The abyssal plain stretching to infinity. Underwater volcanoes erupting in slow motion. Jellyfish swarms that look like galaxies. The ocean as the most beautiful and terrifying place on Earth.',
  },
  {
    name: 'Golden Hour Everything',
    count: 10,
    prompt:
      'The world during magic hour — the 20 minutes before sunset when everything turns to gold. Every possible landscape bathed in that specific amber-rose light. Cities, forests, oceans, deserts, mountains, villages, fields — all at golden hour. The light itself is the subject. Long shadows. Warm air. That feeling that time should stop because the light is too perfect.',
  },
  {
    name: 'Night Worlds',
    count: 10,
    prompt:
      'The world at night when most people are asleep. Not dark and scary — dark and BEAUTIFUL. Cities seen from above as circuits of light. A field under the Milky Way so bright the landscape is lit by starlight. Bioluminescent everything. Moonlit landscapes that look like another planet. The beauty of darkness when your eyes adjust and you realize night has its own color palette.',
  },

  // ═══ CROSS-POLLINATION ═══
  {
    name: 'Impossible Combinations',
    count: 10,
    prompt:
      'Dream scenarios that combine two things that should NEVER go together but create something magical. Medieval castle + neon arcade. Deep ocean + cozy library. Space station + cottage garden. Victorian ballroom + underwater. Volcano + ice cream shop. The weirder the combo, the better — as long as the result is visually stunning.',
  },
  {
    name: 'Nature Reclaims',
    count: 10,
    prompt:
      "Abandoned human places being slowly eaten by nature — and it's BEAUTIFUL. A shopping mall where every store is a different ecosystem. A subway station with a river running through it. A skyscraper where each floor is a different biome. A highway overtaken by wildflowers. A stadium where a forest has grown on the field. Nature winning, and it looks better than anything humans built.",
  },

  // ═══ EMOTIONAL MOMENTS ═══
  {
    name: 'Universal Feelings',
    count: 10,
    prompt:
      'Dream scenarios based on feelings everyone has had. The 3am thought that changes everything. Finding something you lost years ago. The last day of summer. A smell that teleports you to childhood. The moment right before you fall asleep. Waking up and not knowing where you are for 3 seconds. Feelings rendered as landscapes and scenes.',
  },
  {
    name: 'Liminal Spaces',
    count: 10,
    prompt:
      'Beautiful in-between places. An airport terminal at 4am, empty and golden. A hotel hallway that goes on forever. A parking garage at sunset, shadows impossibly long. An empty swimming pool with afternoon light. The space between two train cars. A laundromat at night. An elevator between floors. Places that are between other places, rendered as hauntingly beautiful.',
  },

  // ═══ TIME & DECADES ═══
  {
    name: 'Decade Aesthetics',
    count: 10,
    prompt:
      'What each decade FEELS like as a dream landscape. The 1920s as gold and jazz and smoke. The 1950s as chrome and pastels and diners. The 1970s as wood panels and warm orange. The 1980s as neon and VHS. The 1990s as grunge and malls. The 2000s as Y2K chrome. Not people in period clothes — the AESTHETIC of each era as an environment you could walk through.',
  },

  // ═══ POP CULTURE DEEP DIVES ═══
  {
    name: 'Anime Worlds',
    count: 10,
    prompt:
      "Worlds from anime that people would give anything to visit. The bathhouse from Spirited Away. The moving castle's interior. The Weathering With You sky ocean. Akira's Neo-Tokyo. The Cowboy Bebop ship lounge. The quiet countryside from My Neighbor Totoro. Evangelion's flooded Tokyo. Not character-focused — the WORLDS themselves as breathtaking landscapes.",
  },
  {
    name: 'Video Game Landscapes',
    count: 10,
    prompt:
      "The most beautiful locations from video games, rendered as if you could actually stand there. Hyrule's rolling hills. The Witcher's Skellige islands. Journey's golden desert. Elden Ring's Erdtree visible from everywhere. Shadow of the Colossus vast empty plains. Minecraft sunset. Hollow Knight's forgotten crossroads. The landscapes, not the gameplay.",
  },

  // ═══ SPECIFIC VIBES ═══
  {
    name: 'Music Made Visible',
    count: 10,
    prompt:
      'What different types of music LOOK like as landscapes and scenes. What jazz looks like — smoky blue rooms, curved shapes, improvised architecture. What classical music looks like — vast, structured, golden. What lo-fi beats look like — rainy windows, warm rooms, gentle. What metal looks like — volcanic, sharp, powerful. What a lullaby looks like. Sound as image.',
  },
  {
    name: 'Cozy to the Extreme',
    count: 10,
    prompt:
      "The coziest possible scenes, pushed to absurd levels. A blanket fort the size of a house. A library where every chair is the world's most comfortable. A kitchen that's been cooking all day and every surface has something delicious. Rain hitting a skylight above your bed. A treehouse with heating and fairy lights. A bath overlooking mountains. Cozy as an art form.",
  },
  {
    name: 'Food as Art',
    count: 10,
    prompt:
      'Food so beautiful it transcends eating. A sushi counter where each piece is a tiny sculpture. A French bakery window at dawn, pastries arranged like jewels. A night market where the steam from different stalls creates a fog of competing aromas made visible. A chocolate shop where everything is edible including the furniture. Food as the most beautiful thing humans create.',
  },

  // ═══ FOR THE GIRLS ═══
  {
    name: 'Fairy Tale Reimagined',
    count: 10,
    prompt:
      'Classic fairy tales reimagined as dream scenarios for adults. Not Disney — DREAMS. A glass slipper left on stairs that lead to another dimension. A tower where the hair is actually a river of light. A forest of spinning wheels where everything is asleep and beautiful. A ball where the clock strikes midnight and the whole palace dissolves into flowers. Romance and danger and impossible beauty.',
  },
  {
    name: 'Witchy Aesthetics',
    count: 10,
    prompt:
      'Modern witch vibes as dream scenarios. An apartment where every surface has crystals catching light. A midnight herb garden that glows. Tarot cards that show real futures. A moon so full it fills the whole window. A bath with flowers and candles where the water changes color. A greenhouse full of impossible plants. Witchy as an aesthetic, not scary — beautiful, powerful, feminine.',
  },

  // ═══ FOR THE GUYS ═══
  {
    name: 'Legendary Battles',
    count: 10,
    prompt:
      'The most epic battle scenes and last stands imaginable. Not gore — GLORY. A single warrior facing an army. A fleet of ships in a storm. Two titans clashing above a city. The last stand on a bridge. A dogfight above the clouds. A samurai duel in a bamboo forest. The peak moment of combat, frozen in time, rendered as art.',
  },
  {
    name: 'Machines & Speed',
    count: 10,
    prompt:
      'Vehicles and machines that feel alive and powerful. A muscle car on an empty desert highway at 2am. A spaceship cockpit during a jump to lightspeed. A train racing across a bridge over a canyon. A motorcycle leaning through a mountain pass at sunset. A submarine descending into the deep. The beauty of machines doing what they were built to do, at the limit of their capability.',
  },

  // ═══ BEAUTIFUL CONTRADICTIONS ═══
  {
    name: 'Beautiful Contradictions',
    count: 10,
    prompt:
      "Scenes that combine opposing forces into something stunning. A cozy room inside an active volcano. A garden growing on an iceberg. A library inside a tornado. A beach at the edge of space. A campfire on the ocean floor. Warmth inside cold, calm inside chaos, life inside death. The beauty of things that shouldn't coexist but do.",
  },
  {
    name: 'Non-Human Perspectives',
    count: 10,
    prompt:
      "What the world looks like from a non-human point of view. What a bee sees when it looks at a flower — ultraviolet patterns, infinite detail. What a whale hears — the entire ocean as a symphony. What a tree experiences over a thousand years compressed into one image. What a raindrop sees as it falls. The world is more beautiful than humans can perceive — show us what we're missing.",
  },
];

async function main() {
  const allNew = [];

  for (let i = 0; i < THEME_PACKS.length; i++) {
    const pack = THEME_PACKS[i];
    console.log(`\n[${i + 1}/${THEME_PACKS.length}] ${pack.name} (${pack.count} scenarios)...`);

    if (i > 0) await new Promise((r) => setTimeout(r, 2000));

    try {
      const raw = await callHaiku(buildPrompt(pack.prompt, pack.count));
      let cleaned = raw
        .replace(/^```json\s*/i, '')
        .replace(/```\s*$/, '')
        .trim();
      cleaned = cleaned.replace(/,\s*([\]}])/g, '$1');
      const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('No JSON array found');

      const scenarios = JSON.parse(jsonMatch[0]);
      for (const s of scenarios) {
        s.trigger_moods = (s.trigger_moods || [])
          .filter((m) => VALID_MOODS.includes(m))
          .slice(0, 4);
        s.trigger_interests = (s.trigger_interests || [])
          .filter((i) => VALID_INTERESTS.includes(i))
          .slice(0, 4);
        if (s.trigger_moods.length < 2) s.trigger_moods = ['dreamy', 'epic', 'serene'];
        if (s.trigger_interests.length < 1) s.trigger_interests = ['nature'];

        if (s.key && s.name && s.prompt_context && s.prompt_context.length > 50) {
          allNew.push(s);
          console.log(`  ✅ ${s.key} — ${s.name}`);
        }
      }
    } catch (e) {
      console.error(`  ❌ ${pack.name}: ${e.message}`);
    }
  }

  console.log(`\n📊 Generated ${allNew.length} new archetypes`);

  // Save to file
  const outPath = path.join(__dirname, 'archetypes-v3.json');
  fs.writeFileSync(outPath, JSON.stringify(allNew, null, 2));
  console.log(`Saved to ${outPath}`);

  // Seed to DB (append, don't replace)
  console.log('\nSeeding to DB (appending)...');
  let seeded = 0;
  for (let i = 0; i < allNew.length; i += 50) {
    const chunk = allNew.slice(i, i + 50).map((a) => ({
      key: a.key,
      name: a.name,
      description: (a.trigger_interests || []).join('+') + ' dream scenario',
      trigger_interests: a.trigger_interests || [],
      trigger_moods: a.trigger_moods || [],
      trigger_personality: [],
      trigger_eras: [],
      trigger_settings: [],
      min_matches: 2,
      prompt_context: a.prompt_context,
      flavor_keywords: a.flavor_keywords || [],
      is_active: true,
    }));
    const { error } = await supabase.from('dream_archetypes').upsert(chunk, { onConflict: 'key' });
    if (error) console.error(`  Insert error: ${error.message}`);
    else seeded += chunk.length;
  }
  console.log(`✅ Seeded ${seeded} archetypes`);

  // Re-match all users
  const { data: users } = await supabase
    .from('user_recipes')
    .select('user_id, recipe')
    .eq('onboarding_completed', true);
  const { data: dbArchs } = await supabase
    .from('dream_archetypes')
    .select('id, trigger_interests, trigger_moods')
    .eq('is_active', true);

  console.log(`\nMatching ${users.length} users against ${dbArchs.length} total archetypes...`);
  for (const user of users) {
    const userInterests = new Set(user.recipe.interests ?? []);
    const userMoods = new Set(user.recipe.selected_moods ?? []);
    const matches = dbArchs.filter(
      (a) =>
        a.trigger_interests.some((i) => userInterests.has(i)) &&
        a.trigger_moods.some((m) => userMoods.has(m))
    );
    await supabase.from('user_archetypes').delete().eq('user_id', user.user_id);
    if (matches.length > 0) {
      await supabase
        .from('user_archetypes')
        .insert(matches.map((m) => ({ user_id: user.user_id, archetype_id: m.id })));
      console.log(`  ${user.user_id}: ${matches.length} archetypes`);
    }
  }

  console.log('\n✅ Done!');
}

main().catch(console.error);
