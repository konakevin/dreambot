#!/usr/bin/env node
'use strict';

/**
 * generate-archetypes-v2.js — Generate high-quality dream scenario archetypes.
 * Uses gold-standard examples to get Haiku to produce vivid, specific scenarios.
 *
 * Usage:
 *   node scripts/generate-archetypes-v2.js              # Generate + seed
 *   node scripts/generate-archetypes-v2.js --dry-run     # Generate + save to file only
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
if (!ANTHROPIC_KEY) { console.error('Missing ANTHROPIC_API_KEY'); process.exit(1); }

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const DRY_RUN = process.argv.includes('--dry-run');

const VALID_MOODS = new Set([
  'cozy', 'epic', 'dreamy', 'moody', 'playful', 'serene',
  'intense', 'nostalgic', 'mysterious', 'whimsical', 'dramatic', 'peaceful',
]);

const INTERESTS = [
  'animals', 'nature', 'fantasy', 'sci_fi', 'architecture', 'fashion',
  'food', 'abstract', 'dark', 'cute', 'ocean', 'space', 'whimsical',
  'gaming', 'movies', 'music', 'geek', 'sports', 'travel', 'pride',
];

const PROMPT_TEMPLATE = (interest) => `You are designing dream scenarios for an AI dream image generator app. The audience is 18-40 year olds — they love pop culture, aesthetics, nostalgia, adventure, beauty, humor, and things that make them feel something.

Each dream scenario is a specific TYPE of dream someone might have. Not a mood or a genre — a vivid, specific scenario that instantly conjures an image.

HERE ARE EXAMPLES OF GREAT DREAM SCENARIOS (match this quality):

{
  "key": "gaming_zelda_wanderer",
  "name": "The Zelda Wanderer",
  "trigger_interests": ["gaming"],
  "trigger_moods": ["dreamy", "nostalgic", "peaceful", "whimsical"],
  "prompt_context": "Tonight you dream in Hyrule. Rolling green hills with ancient ruins half-buried in wildflowers. A mysterious temple entrance overgrown with vines, light spilling from within. A fairy hovering over a still pond at dawn. Master sword stuck in a mossy pedestal in a sunbeam. Cooking a dubious meal over a campfire while rain falls. Shield-surfing down a snowy mountain at sunset. Paragliding over an endless world. The feeling of discovering something ancient and magical in an ordinary field."
}

{
  "key": "ocean_mermaid_siren",
  "name": "The Mermaid Siren",
  "trigger_interests": ["ocean", "cute", "fantasy"],
  "trigger_moods": ["dreamy", "whimsical", "playful", "mysterious"],
  "prompt_context": "Tonight you dream of mermaids who could wreck ships with a glance. A mermaid lounging on sun-warmed rocks, iridescent tail dripping, seashell top barely containing, wet hair cascading over bare shoulders, bedroom eyes watching a passing ship. Underwater palace where mermaids swim in formation, bodies lithe and glistening, bioluminescent scales tracing every curve. A siren singing on a moonlit reef, back arched, the ocean itself drawn to her. Pearl jewelry on bare skin. Coral thrones. Sea foam clinging to everything."
}

{
  "key": "universal_tiny_worlds",
  "name": "The Tiny World",
  "trigger_interests": ["nature", "cute", "whimsical", "fantasy", "food", "architecture"],
  "trigger_moods": ["whimsical", "cozy", "dreamy", "playful", "peaceful"],
  "prompt_context": "Tonight you dream of miniature civilizations. An entire village inside a hollow log, tiny windows glowing, smoke from acorn-cap chimneys. A terrarium that contains a functioning ecosystem with weather — it rains every Tuesday at 3pm. A snow globe you can zoom into infinitely, each level revealing smaller worlds inside. A teacup containing an ocean, complete with a tiny island and a lighthouse that works. A bookshelf where each book spine is a different building on a tiny street. The smaller you look, the more you find."
}

{
  "key": "dark_viking_saga",
  "name": "The Viking Saga",
  "trigger_interests": ["dark", "nature"],
  "trigger_moods": ["epic", "intense", "dramatic", "moody"],
  "prompt_context": "Tonight you dream of the old north. A longship cutting through fog, dragon prow emerging from mist, oars moving in perfect rhythm. A warrior standing on a cliff in a blizzard, fur cloak whipping, axe planted in the ground, watching for something on the horizon. A mead hall at night, fire roaring in the center pit, shadows of celebrating warriors on the walls. Runes carved into standing stones, glowing faintly in moonlight. Northern lights over a frozen fjord, the colors reflected in black water. Glory and ice and the end of the world."
}

Now generate 10 dream scenarios for the interest "${interest}".

RULES:
- Each must be a SPECIFIC dream scenario, not a generic mood. "The dream where the ocean floor is a city" not "peaceful ocean vibes."
- Include 5-8 vivid scene examples in prompt_context — specific enough that an AI image generator would produce stunning results from any single one.
- The scenarios should appeal to 18-40 year olds — reference things this generation knows (anime, gaming, social media aesthetics, travel goals, pop culture, nostalgia, TikTok vibes, cozy aesthetics, dark academia, cottagecore, etc).
- Mix it up across moods: some cozy, some epic, some dark, some funny, some sexy, some surreal. Don't make them all the same vibe.
- trigger_interests should always include "${interest}" plus 1-2 related interests from this list ONLY: animals, nature, fantasy, sci_fi, architecture, fashion, food, abstract, dark, cute, ocean, space, whimsical, gaming, movies, music, geek, sports, travel, pride.
- trigger_moods must ONLY use values from this list: cozy, epic, dreamy, moody, playful, serene, intense, nostalgic, mysterious, whimsical, dramatic, peaceful. Pick 3-4 that fit.
- Output a valid JSON array. No markdown. No backticks. No explanation.`;

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
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Haiku ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.content?.[0]?.text?.trim() ?? '';
}

function cleanMoods(moods) {
  return (moods || []).filter(m => VALID_MOODS.has(m)).slice(0, 4);
}

function cleanInterests(interests, primary) {
  const validInterests = new Set(INTERESTS);
  const cleaned = (interests || []).filter(i => validInterests.has(i));
  if (!cleaned.includes(primary)) cleaned.unshift(primary);
  return cleaned.slice(0, 3);
}

async function main() {
  const allArchetypes = [];

  for (let i = 0; i < INTERESTS.length; i++) {
    const interest = INTERESTS[i];
    console.log(`\n[${i + 1}/${INTERESTS.length}] Generating 10 scenarios for "${interest}"...`);

    // Rate limit
    if (i > 0) await new Promise(r => setTimeout(r, 2000));

    try {
      const raw = await callHaiku(PROMPT_TEMPLATE(interest));
      let cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
      cleaned = cleaned.replace(/,\s*([\]}])/g, '$1');
      const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('No JSON array found');

      const scenarios = JSON.parse(jsonMatch[0]);

      for (const s of scenarios) {
        // Clean and validate
        s.trigger_moods = cleanMoods(s.trigger_moods);
        s.trigger_interests = cleanInterests(s.trigger_interests, interest);

        if (s.trigger_moods.length < 2) {
          s.trigger_moods = ['dreamy', 'whimsical', 'playful'].slice(0, 3);
        }

        if (s.key && s.name && s.prompt_context && s.prompt_context.length > 50) {
          allArchetypes.push(s);
          console.log(`  ✅ ${s.key} — ${s.name}`);
        } else {
          console.log(`  ❌ Skipped invalid: ${s.key || 'no key'}`);
        }
      }
    } catch (e) {
      console.error(`  ❌ Failed for ${interest}: ${e.message}`);
    }
  }

  console.log(`\n📊 Generated ${allArchetypes.length} total archetypes`);

  // Save to file
  const outPath = path.join(__dirname, 'archetypes-v2.json');
  fs.writeFileSync(outPath, JSON.stringify(allArchetypes, null, 2));
  console.log(`Saved to ${outPath}`);

  if (DRY_RUN) {
    console.log('Dry run — not seeding to DB.');
    return;
  }

  // Clear old archetypes (keep hand-crafted ones? No — replace everything)
  console.log('\nClearing old archetypes...');
  await supabase.from('user_archetypes').delete().neq('user_id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('dream_archetypes').delete().neq('key', '__never__');

  // Also add back the hand-crafted specialty ones
  const handcraftedPath = path.join(__dirname, 'archetypes-handcrafted.json');
  let handcrafted = [];
  if (fs.existsSync(handcraftedPath)) {
    handcrafted = JSON.parse(fs.readFileSync(handcraftedPath, 'utf8'));
    console.log(`Loading ${handcrafted.length} hand-crafted archetypes...`);
  }

  const allToSeed = [...allArchetypes, ...handcrafted];

  console.log(`Seeding ${allToSeed.length} archetypes...`);
  for (let i = 0; i < allToSeed.length; i += 50) {
    const chunk = allToSeed.slice(i, i + 50).map(a => ({
      key: a.key,
      name: a.name,
      description: (a.trigger_interests || []).join('+') + ' dream scenario',
      trigger_interests: a.trigger_interests || [],
      trigger_moods: a.trigger_moods || [],
      trigger_personality: a.trigger_personality || [],
      trigger_eras: a.trigger_eras || [],
      trigger_settings: a.trigger_settings || [],
      min_matches: 2,
      prompt_context: a.prompt_context,
      flavor_keywords: a.flavor_keywords || [],
      is_active: true,
    }));
    const { error } = await supabase.from('dream_archetypes').upsert(chunk, { onConflict: 'key' });
    if (error) console.error(`  Insert error: ${error.message}`);
  }
  console.log(`✅ Seeded ${allToSeed.length} archetypes`);

  // Re-match all users
  const { data: users } = await supabase
    .from('user_recipes')
    .select('user_id, recipe')
    .eq('onboarding_completed', true);

  const { data: dbArchs } = await supabase
    .from('dream_archetypes')
    .select('id, trigger_interests, trigger_moods')
    .eq('is_active', true);

  console.log(`\nMatching ${users.length} users against ${dbArchs.length} archetypes...`);

  for (const user of users) {
    const recipe = user.recipe;
    const userInterests = new Set(recipe.interests ?? []);
    const userMoods = new Set(recipe.selected_moods ?? []);

    const matches = dbArchs.filter(a => {
      const hasInterest = a.trigger_interests.some(i => userInterests.has(i));
      const hasMood = a.trigger_moods.some(m => userMoods.has(m));
      return hasInterest && hasMood;
    });

    await supabase.from('user_archetypes').delete().eq('user_id', user.user_id);
    if (matches.length > 0) {
      await supabase.from('user_archetypes').insert(
        matches.map(m => ({ user_id: user.user_id, archetype_id: m.id }))
      );
      console.log(`  ${user.user_id}: ${matches.length} archetypes`);
    }
  }

  console.log('\n✅ Done!');
}

main().catch(console.error);
