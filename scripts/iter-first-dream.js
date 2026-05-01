#!/usr/bin/env node
/**
 * iter-first-dream — auto-QA loop runner for first_dream_cells.
 *
 * Renders N test dreams via generate-first-dream Edge Function with
 * test-mode overrides so a specific cell can be exercised. Caption-tags
 * outputs so they can be retrieved + graded later.
 *
 * Usage:
 *   node scripts/iter-first-dream.js --persona portrait --location urban --count 5
 *   node scripts/iter-first-dream.js --persona vista --location forest --count 5 --label R3
 *
 * Flags:
 *   --persona <p>       portrait | vista | couple
 *   --location <l>      urban | coastal | forest | mountain | desert |
 *                       interior | architectural | garden | aquatic | sky_cosmic
 *   --count N           number of renders (default 5)
 *   --label X           caption suffix for grouping (e.g., R3 = round 3)
 *   --user-id <uuid>    user to render as (default Kevin)
 */

const fs = require('fs');

const args = process.argv.slice(2);
function flag(name, def) {
  const i = args.indexOf('--' + name);
  if (i < 0) return def;
  return args[i + 1];
}

const persona = flag('persona');
const location = flag('location');
const count = parseInt(flag('count', '5'), 10);
const label = flag('label', `R${Math.floor(Date.now() / 60000) % 1000}`);
const userId = flag('user-id', 'eab700d8-f11a-4f47-a3a1-addda6fb67ec');

if (!persona || !location) {
  console.error('Usage: node scripts/iter-first-dream.js --persona <p> --location <l> [--count N] [--label X]');
  process.exit(1);
}

function readEnvFile() {
  try {
    const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}
const envFile = readEnvFile();
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || envFile.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL || envFile.SUPABASE_URL || 'https://jimftynwrinwenonjrlj.supabase.co';

const { createClient } = require('@supabase/supabase-js');
const sb = createClient(SUPABASE_URL, SERVICE_ROLE);

async function main() {
  console.log('━━━ iter-first-dream ━━━');
  console.log(`  persona: ${persona}`);
  console.log(`  location: ${location}`);
  console.log(`  count: ${count}`);
  console.log(`  label: ${label}`);
  console.log('');

  // Pull user's profile + cards from DB
  const { data: rec } = await sb.from('user_recipes').select('recipe').eq('user_id', userId).single();
  if (!rec?.recipe) {
    console.error('No vibe_profile for user', userId);
    process.exit(1);
  }
  const vibeProfile = rec.recipe;

  // Get a representative location for this class
  const { data: locCards } = await sb
    .from('location_cards')
    .select('name,location_class')
    .eq('location_class', location)
    .eq('is_approved', true)
    .limit(20);
  if (!locCards || locCards.length === 0) {
    console.error(`No location cards for class: ${location}`);
    process.exit(1);
  }
  const pickedLoc = locCards[0];
  const selectedLocations = [pickedLoc];

  // Pull a few representative objects (tracking what's available — first-dream
  // pipeline filters by cell.allowed_object_classes, so we just pass user's selections).
  const { data: objCards } = await sb
    .from('object_cards')
    .select('name,object_class')
    .eq('is_approved', true)
    .limit(10);
  const selectedObjects = objCards || [];

  // Reset users.first_dream_completed_at so we can re-run for tuning
  await sb.from('users').update({ first_dream_completed_at: null }).eq('id', userId);

  // Construct service-role JWT to call the Edge Function as the user.
  // We need the user's auth token, which we don't have from service role.
  // For QA testing we'll call directly with service-role key as bearer
  // (Edge Function does its own auth check — for QA we use bypass_one_shot).
  const url = `${SUPABASE_URL}/functions/v1/generate-first-dream`;

  for (let i = 1; i <= count; i++) {
    console.log(`━━━ #${i}/${count} | ${persona}/${location} | ${pickedLoc.name} ━━━`);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SERVICE_ROLE}`,
        },
        body: JSON.stringify({
          vibe_profile: vibeProfile,
          selected_locations: selectedLocations,
          selected_objects: selectedObjects,
          bypass_one_shot: true,
        }),
      });
      if (!res.ok) {
        const t = await res.text();
        console.error(`  ✗ ${res.status}: ${t.slice(0, 200)}`);
        continue;
      }
      const data = await res.json();
      console.log(`  ✅ persona=${data.archetype?.persona} location=${data.archetype?.location_class}`);
      console.log(`     medium=${data.resolved_medium} vibe=${data.resolved_vibe}`);
      console.log(`     swap=${data.face_swap_applied}/${data.face_swap_attempts} no_cast=${data.no_cast_variant}`);
      console.log(`     image: ${data.image_url}`);
      console.log(`     caption: ${data.bot_message}`);

      // Tag the upload with the round label so we can query later
      if (data.upload_id) {
        await sb
          .from('uploads')
          .update({ caption: `auto-qa: first-dream ${persona}/${location} ${label} #${i}` })
          .eq('id', data.upload_id);
      }
    } catch (err) {
      console.error(`  ✗ ${err.message}`);
    }
  }

  // Reset the guard one final time so user can re-onboard if needed
  await sb.from('users').update({ first_dream_completed_at: null }).eq('id', userId);
  console.log('\n━━━ Done. Reset first_dream_completed_at for re-runs. ━━━');
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
