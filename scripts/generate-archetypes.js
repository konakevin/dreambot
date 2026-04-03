#!/usr/bin/env node
'use strict';

/**
 * generate-archetypes.js — Uses Haiku to generate all interest × mood archetype
 * definitions, then seeds them into the database.
 *
 * Usage:
 *   node scripts/generate-archetypes.js              # Generate + seed all
 *   node scripts/generate-archetypes.js --dry-run     # Generate + print, don't seed
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

const INTERESTS = [
  'animals', 'nature', 'fantasy', 'sci_fi', 'architecture', 'fashion',
  'food', 'abstract', 'dark', 'cute', 'ocean', 'space', 'whimsical',
  'gaming', 'movies', 'music', 'geek', 'sports', 'travel', 'pride',
];

const MOODS = [
  'cozy', 'epic', 'dreamy', 'moody', 'playful', 'serene',
  'intense', 'nostalgic', 'mysterious', 'whimsical', 'dramatic', 'peaceful',
];

// Generate archetypes in batches to avoid rate limits
const BATCH_SIZE = 3;

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
      max_tokens: 800,
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

async function generateArchetype(interest, mood) {
  const key = `${mood}_${interest}`;
  const prompt = `You are designing a "dream personality" for an AI dream image generator app. This personality combines the interest "${interest}" with the mood "${mood}".

Give me a JSON object with these fields:
- "name": A creative 2-3 word character name for this personality (e.g. "The Neon Gamer", "The Cozy Baker"). Must start with "The".
- "description": One sentence describing this dream personality (max 15 words).
- "prompt_context": A rich creative brief (3-5 sentences) that tells an AI image prompt writer WHO they are tonight and WHAT KIND of scenes to dream. Include 4 specific scene examples that are vivid, surprising, and could only come from this exact interest+mood combination. The scenes should range from intimate to epic. Never mention generic scenes. Be specific — name objects, textures, lighting, emotions.
- "flavor_keywords": Array of 8 single words or short phrases that evoke this personality.

The interest "${interest}" means: the person loves content related to ${interest}.
The mood "${mood}" means: the dreams should feel ${mood}.

Output ONLY valid JSON, nothing else. No markdown, no backticks.`;

  const raw = await callHaiku(prompt);

  try {
    // Strip markdown code fences, trailing commas, and other common Haiku JSON issues
    let cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    cleaned = cleaned.replace(/,\s*([\]}])/g, '$1'); // trailing commas
    const parsed = JSON.parse(cleaned);
    return {
      key,
      name: parsed.name,
      description: parsed.description,
      prompt_context: parsed.prompt_context,
      flavor_keywords: parsed.flavor_keywords || [],
      trigger_interests: [interest],
      trigger_moods: [mood],
      trigger_personality: [],
      trigger_eras: [],
      trigger_settings: [],
      min_matches: 2,
    };
  } catch (e) {
    console.error(`  ❌ Failed to parse ${key}: ${e.message}`);
    console.error(`  Raw: ${raw.slice(0, 200)}`);
    return null;
  }
}

async function main() {
  const combos = [];
  for (const interest of INTERESTS) {
    for (const mood of MOODS) {
      combos.push({ interest, mood });
    }
  }

  console.log(`\n🎭 Generating ${combos.length} archetypes (${INTERESTS.length} interests × ${MOODS.length} moods)...\n`);

  const allArchetypes = [];

  for (let i = 0; i < combos.length; i += BATCH_SIZE) {
    const batch = combos.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(combos.length / BATCH_SIZE);
    console.log(`  Batch ${batchNum}/${totalBatches}: ${batch.map(c => `${c.mood}_${c.interest}`).join(', ')}`);

    const results = await Promise.all(
      batch.map(({ interest, mood }) => generateArchetype(interest, mood))
    );

    for (const r of results) {
      if (r) {
        allArchetypes.push(r);
        if (DRY_RUN) {
          console.log(`    ✅ ${r.key} — ${r.name}`);
        }
      }
    }

    // Small delay between batches to avoid rate limits
    if (i + BATCH_SIZE < combos.length) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  console.log(`\n  Generated ${allArchetypes.length}/${combos.length} archetypes`);

  if (DRY_RUN) {
    // Save to file for review
    const outPath = path.join(__dirname, 'archetypes-generated.json');
    fs.writeFileSync(outPath, JSON.stringify(allArchetypes, null, 2));
    console.log(`\n  Saved to ${outPath} for review.\n`);
    return;
  }

  // Clear old archetypes and seed new ones
  console.log('\n  Clearing old archetypes...');
  await supabase.from('user_archetypes').delete().neq('user_id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('dream_archetypes').delete().neq('key', '__never__');

  console.log('  Seeding new archetypes...');
  // Insert in chunks of 50
  for (let i = 0; i < allArchetypes.length; i += 50) {
    const chunk = allArchetypes.slice(i, i + 50).map(a => ({
      key: a.key,
      name: a.name,
      description: a.description,
      trigger_interests: a.trigger_interests,
      trigger_moods: a.trigger_moods,
      trigger_personality: a.trigger_personality,
      trigger_eras: a.trigger_eras,
      trigger_settings: a.trigger_settings,
      min_matches: a.min_matches,
      prompt_context: a.prompt_context,
      flavor_keywords: a.flavor_keywords,
      is_active: true,
    }));
    const { error } = await supabase.from('dream_archetypes').insert(chunk);
    if (error) {
      console.error(`  ❌ Insert error: ${error.message}`);
    }
  }
  console.log(`  ✅ Seeded ${allArchetypes.length} archetypes`);

  // Now match all users
  const { data: users } = await supabase
    .from('user_recipes')
    .select('user_id, recipe')
    .eq('onboarding_completed', true);

  const { data: dbArchetypes } = await supabase
    .from('dream_archetypes')
    .select('id, key, trigger_interests, trigger_moods')
    .eq('is_active', true);

  console.log(`\n👥 Matching ${users.length} users...\n`);

  for (const user of users) {
    const recipe = user.recipe;
    const userInterests = new Set(recipe.interests ?? []);
    const userMoods = new Set(recipe.selected_moods ?? []);

    // An archetype matches if the user has BOTH the interest AND the mood
    const matches = dbArchetypes.filter(a => {
      const hasInterest = a.trigger_interests.some(i => userInterests.has(i));
      const hasMood = a.trigger_moods.some(m => userMoods.has(m));
      return hasInterest && hasMood;
    });

    if (matches.length > 0) {
      const rows = matches.map(m => ({ user_id: user.user_id, archetype_id: m.id }));
      const { error } = await supabase.from('user_archetypes').insert(rows);
      if (error) {
        console.error(`  ❌ ${user.user_id}: ${error.message}`);
      } else {
        console.log(`  ${user.user_id}: ${matches.length} archetypes matched`);
      }
    } else {
      console.log(`  ${user.user_id}: no matches`);
    }
  }

  console.log('\n✅ Done!\n');
}

main().catch(console.error);
