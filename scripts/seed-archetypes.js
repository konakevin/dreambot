#!/usr/bin/env node
'use strict';

/**
 * seed-archetypes.js — Seed the dream_archetypes table and match all users.
 *
 * Usage:
 *   node scripts/seed-archetypes.js              # Seed archetypes + match all users
 *   node scripts/seed-archetypes.js --match-only  # Just re-match users (after adding archetypes)
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

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// ── THE ARCHETYPE LIBRARY ──────────────────────────────────────────────────

const ARCHETYPES = [
  {
    key: 'cozy_chef',
    name: 'The Cozy Chef',
    description: 'Warm kitchens, comfort food, the smell of baking, steamy windows on a rainy day.',
    trigger_interests: ['food'],
    trigger_moods: ['cozy', 'peaceful', 'nostalgic'],
    trigger_personality: ['cozy', 'gentle', 'peaceful'],
    trigger_eras: ['retro', 'victorian'],
    trigger_settings: ['cozy_indoors', 'village'],
    min_matches: 2,
    prompt_context: `Tonight you are the Cozy Chef — this person's inner homebody who finds magic in kitchens, bakeries, and meals shared with loved ones. Dream about the warmth of cooking, the textures of food, the rituals of preparing something delicious. A grandmother's kitchen at dawn with flour dust in the air. A tiny ramen shop where the broth has been simmering for 12 hours. A bakery window glowing amber on a cold night. The dreams should feel warm, intimate, and smell like something wonderful.`,
    flavor_keywords: [
      'kitchen',
      'cooking',
      'baking',
      'steam',
      'warmth',
      'comfort food',
      'spices',
      'recipe',
    ],
  },
  {
    key: 'ocean_dreamer',
    name: 'The Ocean Dreamer',
    description:
      'Endless horizons, deep water mysteries, the sound of waves, salt air, tide pools.',
    trigger_interests: ['ocean', 'nature'],
    trigger_moods: ['dreamy', 'serene', 'peaceful'],
    trigger_personality: ['dreamy', 'peaceful', 'gentle'],
    trigger_eras: ['prehistoric', 'ancient'],
    trigger_settings: ['beach_tropical', 'underwater'],
    min_matches: 2,
    prompt_context: `Tonight you are the Ocean Dreamer — this person's deep-water soul, drawn to horizons, tides, and the mysteries beneath the surface. Dream about the ocean in ways that feel personal and specific — not generic beach scenes. A tide pool at dawn with tiny creatures going about their lives. The hull of a sunken ship slowly becoming a coral garden. The moment a wave curls and the light comes through it like stained glass. Whale songs echoing through underwater canyons. These dreams are vast, quiet, and deeply beautiful.`,
    flavor_keywords: [
      'waves',
      'coral',
      'deep water',
      'tide',
      'salt',
      'current',
      'bioluminescent',
      'shore',
    ],
  },
  {
    key: 'vinyl_dreamer',
    name: 'The Vinyl Dreamer',
    description: 'Record shops, live gigs, instruments left on couches, music made visible.',
    trigger_interests: ['music'],
    trigger_moods: ['nostalgic', 'dreamy', 'cozy'],
    trigger_personality: ['nostalgic', 'dreamy', 'romantic'],
    trigger_eras: ['retro', 'art_deco', 'synthwave'],
    trigger_settings: ['cozy_indoors', 'city_streets'],
    min_matches: 2,
    prompt_context: `Tonight you are the Vinyl Dreamer — this person's musical soul who hears melodies in everything. Dream about music made visible and tangible. A jazz club where the saxophone notes curl into golden smoke rings. A record spinning in an empty apartment at 2am, the grooves projecting tiny scenes from the song. A guitar left on a bed with the afternoon light catching the strings. Piano keys that grow wildflowers when played. These dreams should feel like a favorite song looks.`,
    flavor_keywords: [
      'vinyl',
      'melody',
      'strings',
      'notes',
      'rhythm',
      'concert',
      'instrument',
      'headphones',
    ],
  },
  {
    key: 'neon_gamer',
    name: 'The Neon Gamer',
    description: 'Pixel worlds, boss battles, power-ups, neon arcades, respawn points.',
    trigger_interests: ['gaming', 'geek'],
    trigger_moods: ['epic', 'intense', 'playful'],
    trigger_personality: ['bold', 'futuristic', 'fierce'],
    trigger_eras: ['synthwave', 'far_future'],
    trigger_settings: ['city_streets', 'space'],
    min_matches: 2,
    prompt_context: `Tonight you are the Neon Gamer — this person's inner player who sees the world as levels, quests, and respawn points. Dream about gaming worlds that feel alive and tactile. An abandoned arcade where one cabinet still glows and the game inside has become self-aware. A Zelda-style dungeon made from someone's actual bedroom. A save point floating in a void between worlds. Power-up mushrooms growing in a real forest. These dreams should feel like stepping INSIDE a game — not watching a screen.`,
    flavor_keywords: [
      'pixel',
      'neon',
      'controller',
      'level',
      'quest',
      'arcade',
      'power-up',
      'respawn',
    ],
  },
  {
    key: 'cosmic_voyager',
    name: 'The Cosmic Voyager',
    description: 'Nebulae, space stations, alien landscapes, the silence between stars.',
    trigger_interests: ['space', 'sci_fi'],
    trigger_moods: ['epic', 'dramatic', 'mysterious'],
    trigger_personality: ['futuristic', 'adventurous', 'bold'],
    trigger_eras: ['far_future'],
    trigger_settings: ['space', 'otherworldly'],
    min_matches: 2,
    prompt_context: `Tonight you are the Cosmic Voyager — this person's interstellar soul who dreams of what's beyond the sky. Dream about space that feels personal, not generic sci-fi. The view from inside a nebula where the gas clouds look like watercolor. A space station greenhouse where tomatoes grow in zero gravity. The last radio signal from a probe passing Neptune, visualized as light. An astronaut's helmet reflecting an alien sunrise while their visor fogs from crying. These dreams should feel vast but intimate.`,
    flavor_keywords: [
      'nebula',
      'orbit',
      'starlight',
      'gravity',
      'cosmos',
      'probe',
      'constellation',
      'void',
    ],
  },
  {
    key: 'dark_mystic',
    name: 'The Dark Mystic',
    description: 'Gothic beauty, candlelit rituals, shadow gardens, elegant darkness.',
    trigger_interests: ['dark', 'abstract'],
    trigger_moods: ['mysterious', 'moody', 'intense'],
    trigger_personality: ['mysterious', 'edgy', 'raw'],
    trigger_eras: ['medieval', 'victorian', 'art_deco'],
    trigger_settings: ['underground', 'city_streets'],
    min_matches: 2,
    prompt_context: `Tonight you are the Dark Mystic — this person's shadow self who finds beauty in darkness, decay, and the unknown. Dream about elegant darkness — not horror, but mystery. A greenhouse at midnight where black roses bloom and release tiny glowing spores. A library with books that whisper when you walk past. A cathedral where the stained glass shows scenes that haven't happened yet. Rain on a gargoyle that looks like it's about to smile. These dreams should be beautiful and unsettling in equal measure.`,
    flavor_keywords: [
      'shadow',
      'candle',
      'gothic',
      'raven',
      'moonlit',
      'obsidian',
      'velvet',
      'ancient',
    ],
  },
  {
    key: 'kawaii_spirit',
    name: 'The Kawaii Spirit',
    description:
      'Pastel everything, tiny creatures, sparkles, heart-shaped clouds, maximum cuteness.',
    trigger_interests: ['cute', 'whimsical', 'animals'],
    trigger_moods: ['playful', 'whimsical', 'dreamy'],
    trigger_personality: ['playful', 'whimsical', 'gentle'],
    trigger_eras: ['modern', 'retro'],
    trigger_settings: ['cozy_indoors', 'village'],
    min_matches: 2,
    prompt_context: `Tonight you are the Kawaii Spirit — this person's inner child who sees the world in pastels and sparkles. Dream about maximum cuteness with genuine warmth. A hamster running a tiny bakery inside a teacup. A cloud that rains sprinkles onto a miniature village of mushroom houses. A cat cafe where the cats are the baristas and they're very serious about latte art. Baby dragons learning to sneeze fire and accidentally toasting marshmallows. These dreams should make you go "aww" out loud.`,
    flavor_keywords: [
      'tiny',
      'sparkle',
      'pastel',
      'fluffy',
      'kawaii',
      'miniature',
      'adorable',
      'plush',
    ],
  },
  {
    key: 'wild_explorer',
    name: 'The Wild Explorer',
    description: 'Mountain peaks, jungle trails, campfire stories, the thrill of the unknown.',
    trigger_interests: ['travel', 'nature', 'sports'],
    trigger_moods: ['epic', 'playful', 'dramatic'],
    trigger_personality: ['adventurous', 'wild', 'bold'],
    trigger_eras: ['prehistoric', 'modern'],
    trigger_settings: ['wild_outdoors', 'mountains', 'beach_tropical'],
    min_matches: 2,
    prompt_context: `Tonight you are the Wild Explorer — this person's adventurous heart that comes alive in wide open spaces. Dream about exploration, discovery, and the raw beauty of the natural world. A campfire on a cliff edge where the smoke shapes itself into a map of tomorrow's trail. The first footprint in fresh snow on a mountain nobody has named. A kayak entering a sea cave where the walls are covered in bioluminescent organisms. Standing at a waterfall so loud you can't hear yourself think. These dreams should feel like freedom.`,
    flavor_keywords: [
      'trail',
      'summit',
      'campfire',
      'wilderness',
      'horizon',
      'expedition',
      'dawn',
      'cliff',
    ],
  },
  {
    key: 'fantasy_enchanter',
    name: 'The Fantasy Enchanter',
    description: 'Magical forests, ancient spells, dragon lairs, enchanted kingdoms.',
    trigger_interests: ['fantasy', 'whimsical'],
    trigger_moods: ['dreamy', 'whimsical', 'epic'],
    trigger_personality: ['dreamy', 'romantic', 'whimsical'],
    trigger_eras: ['medieval', 'victorian', 'ancient'],
    trigger_settings: ['otherworldly', 'village'],
    min_matches: 2,
    prompt_context: `Tonight you are the Fantasy Enchanter — this person's magical self who believes in hidden worlds and ancient wonder. Dream about fantasy that feels lived-in and real, not generic. A potion shop where each bottle contains a different weather system. A dragon using its flame to carefully light the candles on a child's birthday cake. A knight who retired and now runs a flower shop, their armor used as a trellis for roses. A library where the maps are portals and the librarian knows which ones are safe. These dreams should feel magical but grounded.`,
    flavor_keywords: [
      'enchanted',
      'potion',
      'crystal',
      'spell',
      'dragon',
      'castle',
      'ancient',
      'magical',
    ],
  },
  {
    key: 'retro_romantic',
    name: 'The Retro Romantic',
    description:
      'Old photographs, handwritten letters, vintage shops, the beauty of things that age.',
    trigger_interests: ['movies', 'music', 'travel'],
    trigger_moods: ['nostalgic', 'dreamy', 'cozy'],
    trigger_personality: ['nostalgic', 'romantic', 'elegant'],
    trigger_eras: ['retro', 'victorian', 'art_deco'],
    trigger_settings: ['city_streets', 'cozy_indoors', 'village'],
    min_matches: 2,
    prompt_context: `Tonight you are the Retro Romantic — this person's old soul who finds poetry in faded things and bygone eras. Dream about nostalgia that's specific and bittersweet. A train station in the 1940s where someone left a love letter tucked into the timetable. A Polaroid developing in real time, the image slowly revealing a memory you forgot you had. A jukebox in an empty diner playing a song that hasn't been written yet. The last screening at a closing cinema, one silhouette in the audience. These dreams should ache in the sweetest way.`,
    flavor_keywords: [
      'vintage',
      'polaroid',
      'typewriter',
      'sepia',
      'film grain',
      'handwritten',
      'antique',
      'faded',
    ],
  },
  {
    key: 'urban_poet',
    name: 'The Urban Poet',
    description:
      'City lights, rooftop views, street art, rain on concrete, the rhythm of the city.',
    trigger_interests: ['music', 'abstract', 'architecture'],
    trigger_moods: ['moody', 'dramatic', 'intense'],
    trigger_personality: ['edgy', 'bold', 'raw'],
    trigger_eras: ['modern', 'art_deco', 'synthwave'],
    trigger_settings: ['city_streets'],
    min_matches: 2,
    prompt_context: `Tonight you are the Urban Poet — this person's street-smart soul who finds beauty in concrete, neon, and the chaos of city life. Dream about cities that feel alive and specific. A fire escape at 3am where someone's left a cup of coffee that's still steaming. A subway platform where the busker's music makes the tiles rearrange into murals. Rain turning a crosswalk into a mirror that reflects a different city. A rooftop garden that's secretly the most beautiful place in the entire skyline. These dreams should feel like the city's secrets.`,
    flavor_keywords: [
      'neon',
      'concrete',
      'graffiti',
      'rooftop',
      'subway',
      'rain-slicked',
      'streetlight',
      'skyline',
    ],
  },
  {
    key: 'creature_whisperer',
    name: 'The Creature Whisperer',
    description: 'Animal friendships, forest conversations, the secret lives of creatures.',
    trigger_interests: ['animals', 'nature', 'cute'],
    trigger_moods: ['peaceful', 'cozy', 'whimsical'],
    trigger_personality: ['gentle', 'peaceful', 'whimsical'],
    trigger_eras: ['prehistoric', 'medieval'],
    trigger_settings: ['wild_outdoors', 'village'],
    min_matches: 2,
    prompt_context: `Tonight you are the Creature Whisperer — this person's gentle heart that connects with animals and sees their hidden worlds. Dream about animals with rich inner lives. An owl's study in a hollow tree, tiny glasses perched on its beak, star charts pinned to the bark walls. A bear's hibernation dream shown as a bubble above its sleeping head — it's dreaming about summer berries. A migration of butterflies so thick they cast colored shadows over an entire valley. A fox teaching her kit to pounce, both of them terrible at it. These dreams should feel like eavesdropping on nature's private moments.`,
    flavor_keywords: [
      'den',
      'nest',
      'paw prints',
      'feathers',
      'burrow',
      'migration',
      'forest floor',
      'whiskers',
    ],
  },
  {
    key: 'adrenaline_ace',
    name: 'The Adrenaline Ace',
    description: 'Peak moments, victory poses, the roar of the crowd, pushing limits.',
    trigger_interests: ['sports', 'gaming'],
    trigger_moods: ['epic', 'intense', 'dramatic'],
    trigger_personality: ['fierce', 'bold', 'wild'],
    trigger_eras: ['modern', 'far_future'],
    trigger_settings: ['wild_outdoors', 'mountains', 'city_streets'],
    min_matches: 2,
    prompt_context: `Tonight you are the Adrenaline Ace — this person's competitive fire that lives for peak moments and impossible feats. Dream about the freeze-frame at the peak of action. A skateboarder mid-trick above a city made of circuit boards. A surfer inside a barrel wave that's actually a tunnel through time. The moment a climbing hand reaches the summit and the whole world opens up below. A basketball court on the moon, players floating in slow-motion arcs. These dreams should feel like the single best second of the whole game.`,
    flavor_keywords: [
      'velocity',
      'peak',
      'mid-air',
      'arena',
      'finish line',
      'explosion',
      'trophy',
      'thunder',
    ],
  },
  {
    key: 'pride_phoenix',
    name: 'The Pride Phoenix',
    description: 'Celebration, identity, community, color, being unapologetically yourself.',
    trigger_interests: ['pride'],
    trigger_moods: ['playful', 'epic', 'dramatic'],
    trigger_personality: ['bold', 'wild', 'fierce'],
    trigger_eras: ['modern'],
    trigger_settings: ['city_streets'],
    min_matches: 2,
    prompt_context: `Tonight you are the Pride Phoenix — this person's fiercest, most colorful, most unapologetic self. Dream about celebration, community, and the joy of being exactly who you are. A parade float that's actually a living dragon made of rainbow flowers. A dance floor where every step leaves a trail of color that tells your story. A mural painting itself on a wall, the colors choosing where they want to go. Fireworks that spell out something different to everyone who looks up. These dreams should feel like being seen and celebrated.`,
    flavor_keywords: [
      'rainbow',
      'glitter',
      'parade',
      'confetti',
      'pride',
      'color burst',
      'dance',
      'celebration',
    ],
  },
  {
    key: 'fashion_visionary',
    name: 'The Fashion Visionary',
    description: 'Fabrics, textures, runways in unexpected places, style as self-expression.',
    trigger_interests: ['fashion'],
    trigger_moods: ['dramatic', 'whimsical', 'intense'],
    trigger_personality: ['elegant', 'bold', 'fierce'],
    trigger_eras: ['art_deco', 'victorian', 'modern'],
    trigger_settings: ['city_streets', 'otherworldly'],
    min_matches: 2,
    prompt_context: `Tonight you are the Fashion Visionary — this person's eye for beauty in fabric, form, and self-expression. Dream about style made fantastical. A runway show on the surface of water where each step sends out ripples of color. A dress made entirely of folded love letters, each one legible. A vintage shop where the clothes remember their previous owners and act out their stories when tried on. A ball gown that's actually a garden — living flowers woven into silk, butterflies instead of sequins. These dreams should feel like wearing art.`,
    flavor_keywords: [
      'silk',
      'velvet',
      'runway',
      'couture',
      'vintage',
      'fabric',
      'pattern',
      'stitch',
    ],
  },
  {
    key: 'cinema_soul',
    name: 'The Cinema Soul',
    description: 'Movie moments, dramatic lighting, the feeling of being inside a story.',
    trigger_interests: ['movies', 'geek'],
    trigger_moods: ['dramatic', 'nostalgic', 'epic'],
    trigger_personality: ['romantic', 'dreamy', 'adventurous'],
    trigger_eras: ['retro', 'art_deco', 'synthwave'],
    trigger_settings: ['city_streets', 'cozy_indoors'],
    min_matches: 2,
    prompt_context: `Tonight you are the Cinema Soul — this person's inner director who sees the world in frames, cuts, and dramatic lighting. Dream about movie-like moments frozen at their most beautiful. The credits rolling over an empty theater while the projectionist dances alone in the beam. A film strip unraveling from a reel and becoming a bridge between two rooftops. A noir detective's office where the venetian blind shadows tell a different story than the one being lived. The exact moment in a time travel movie where both timelines overlap and you can see both. These dreams should feel like the best frame of the best movie ever made.`,
    flavor_keywords: [
      'cinema',
      'spotlight',
      'film reel',
      'director',
      'screenplay',
      'montage',
      'closeup',
      'credits',
    ],
  },
];

// ── MATCHING ALGORITHM ───────────────────────────────────────────────────────

function matchArchetypes(recipe) {
  const userTraits = new Set([
    ...(recipe.interests ?? []),
    ...(recipe.selected_moods ?? []),
    ...(recipe.personality_tags ?? []),
    ...(recipe.eras ?? []),
    ...(recipe.settings ?? []),
  ]);

  const matches = [];
  for (const arch of ARCHETYPES) {
    const triggers = [
      ...arch.trigger_interests,
      ...arch.trigger_moods,
      ...arch.trigger_personality,
      ...arch.trigger_eras,
      ...arch.trigger_settings,
    ];
    const hitCount = triggers.filter((t) => userTraits.has(t)).length;
    if (hitCount >= arch.min_matches) {
      matches.push({ key: arch.key, name: arch.name, hits: hitCount });
    }
  }

  return matches.sort((a, b) => b.hits - a.hits);
}

// ── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  const matchOnly = process.argv.includes('--match-only');

  if (!matchOnly) {
    console.log('\n🎭 Seeding dream archetypes...\n');

    // Upsert archetypes (so re-running is safe)
    for (const arch of ARCHETYPES) {
      const { error } = await supabase.from('dream_archetypes').upsert(
        {
          key: arch.key,
          name: arch.name,
          description: arch.description,
          trigger_interests: arch.trigger_interests,
          trigger_moods: arch.trigger_moods,
          trigger_personality: arch.trigger_personality,
          trigger_eras: arch.trigger_eras,
          trigger_settings: arch.trigger_settings,
          min_matches: arch.min_matches,
          prompt_context: arch.prompt_context,
          flavor_keywords: arch.flavor_keywords,
          is_active: true,
        },
        { onConflict: 'key' }
      );
      if (error) {
        console.error(`  ❌ ${arch.key}: ${error.message}`);
      } else {
        console.log(`  ✅ ${arch.key} — ${arch.name}`);
      }
    }
  }

  // Fetch all archetypes from DB (to get their UUIDs)
  const { data: dbArchetypes } = await supabase
    .from('dream_archetypes')
    .select('id, key')
    .eq('is_active', true);

  const archMap = {};
  for (const a of dbArchetypes) archMap[a.key] = a.id;

  // Fetch all users with recipes
  const { data: users } = await supabase
    .from('user_recipes')
    .select('user_id, recipe')
    .eq('onboarding_completed', true);

  console.log(`\n👥 Matching ${users.length} users to archetypes...\n`);

  for (const user of users) {
    const matches = matchArchetypes(user.recipe);

    // Clear existing matches
    await supabase.from('user_archetypes').delete().eq('user_id', user.user_id);

    // Insert new matches
    if (matches.length > 0) {
      const rows = matches
        .filter((m) => archMap[m.key])
        .map((m) => ({ user_id: user.user_id, archetype_id: archMap[m.key] }));

      if (rows.length > 0) {
        const { error } = await supabase.from('user_archetypes').insert(rows);
        if (error) {
          console.error(`  ❌ ${user.user_id}: ${error.message}`);
        } else {
          console.log(`  ${user.user_id}: ${matches.map((m) => `${m.key}(${m.hits})`).join(', ')}`);
        }
      }
    } else {
      console.log(`  ${user.user_id}: no matches (will use default engine)`);
    }
  }

  console.log('\n✅ Done!\n');
}

main().catch(console.error);
