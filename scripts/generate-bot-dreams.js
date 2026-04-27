#!/usr/bin/env node
/**
 * Generate dreams for bot accounts.
 * Each bot has seed prompts stored in bot_seeds (category: {username}_*).
 * Picks unused seeds first (no repeats until all are used), then auto-regenerates
 * a fresh batch when the pool is exhausted.
 *
 * Usage:
 *   node scripts/generate-bot-dreams.js                  # 1 dream per bot
 *   node scripts/generate-bot-dreams.js --count 3        # 3 dreams per bot
 *   node scripts/generate-bot-dreams.js --bot solaris     # only one bot
 */

const { createClient } = require('@supabase/supabase-js');
const { BOT_SEEDS, generateSeedsForBot } = require('./lib/seed-generator');

function readEnvFile() {
  try {
    const lines = require('fs').readFileSync('.env.local', 'utf8').split('\n');
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
function getKey(name) {
  return process.env[name] || envFile[name];
}

const SUPABASE_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const sb = createClient(SUPABASE_URL, getKey('SUPABASE_SERVICE_ROLE_KEY'));
const sbAuth = createClient(SUPABASE_URL, getKey('SUPABASE_SERVICE_ROLE_KEY'));

const BOT_PASSWORD_PREFIX = getKey('BOT_PASSWORD_PREFIX');
if (!BOT_PASSWORD_PREFIX) {
  console.error('ERROR: BOT_PASSWORD_PREFIX missing from .env.local');
  process.exit(1);
}

const args = process.argv.slice(2);
const countIdx = args.indexOf('--count');
const botIdx = args.indexOf('--bot');
const COUNT = countIdx >= 0 ? parseInt(args[countIdx + 1], 10) : 1;
const ONLY_BOT = botIdx >= 0 ? args[botIdx + 1] : null;

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const BOTS = {
  // Migrated to new engine — see scripts/bots/<name>/ + .github/workflows/<name>.yml:
  //   bloombot, glowbot, earthbot, cuddlebot, coquettebot, mangabot, dragonbot, gothbot, starbot,
  //   steambot, tinybot, toybot, beachbot, pixelbot, oceanbot, dinobot, titanbot
  // All 20 active bots live in scripts/bots/<botname>/
};

/**
 * Load unused seeds for a bot. Returns array of { id, template }.
 */
async function loadUnusedSeeds(prefix) {
  const { data } = await sb
    .from('bot_seeds')
    .select('id, template')
    .like('category', `${prefix}%`)
    .eq('disabled', false)
    .is('used_at', null)
    .limit(500);
  return data ?? [];
}

/**
 * Regenerate seeds for a bot when pool is exhausted.
 * Disables old seeds, generates fresh batch, returns new unused pool.
 */
async function regenSeeds(username, prefix) {
  const anthropicApiKey = getKey('ANTHROPIC_API_KEY');
  if (!anthropicApiKey) {
    console.log(`   ⚠️ No ANTHROPIC_API_KEY, can't regenerate seeds for ${username}`);
    return null;
  }

  const config = BOT_SEEDS[username];
  if (!config) {
    // No seed config — recycle existing seeds by clearing used_at
    console.log(`   ♻️ No seed config for ${username}, recycling existing seeds`);
    await sb
      .from('bot_seeds')
      .update({ used_at: null })
      .like('category', `${prefix}%`)
      .eq('disabled', false);
    return await loadUnusedSeeds(prefix);
  }

  // Get next generation number
  const { data: maxGenRows } = await sb
    .from('bot_seeds')
    .select('generation')
    .like('category', prefix + '%')
    .order('generation', { ascending: false })
    .limit(1);
  const nextGen = ((maxGenRows && maxGenRows[0] && maxGenRows[0].generation) || 0) + 1;

  console.log(`   🔄 Generating new seeds for ${username} (gen ${nextGen})...`);

  // Old seeds stay in the table with used_at set — NOT disabled.
  // To recycle old seeds manually: UPDATE bot_seeds SET used_at = NULL WHERE category LIKE 'botname_%'

  try {
    const { rows } = await generateSeedsForBot(username, { anthropicApiKey });
    const tagged = rows.map(r => ({ ...r, disabled: false, generation: nextGen }));
    const { error } = await sb.from('bot_seeds').insert(tagged);
    if (error) throw new Error(error.message);
    console.log(`   ✅ ${tagged.length} new seeds generated (gen ${nextGen})`);
    return await loadUnusedSeeds(prefix);
  } catch (err) {
    // Regen failed — recycle old seeds by clearing used_at
    console.error(`   ❌ Seed regen failed: ${err.message}`);
    console.log(`   ♻️ Recycling old seeds (clearing used_at)`);
    await sb
      .from('bot_seeds')
      .update({ used_at: null })
      .like('category', prefix + '%');
    return await loadUnusedSeeds(prefix);
  }
}

(async () => {
  // Fetch all active vibes
  const { data: allVibes } = await sb.rpc('get_dream_vibes');
  const vibeKeys = (allVibes ?? []).map((v) => v.key);
  console.log(`🎭 ${vibeKeys.length} vibes loaded`);

  const botUsernames = Object.keys(BOTS).filter((b) => !ONLY_BOT || b === ONLY_BOT);
  // Fetch ALL users and match case-insensitively — DB stores PascalCase
  // display names but BOTS keys are lowercase
  const { data: allUsers } = await sb.from('users').select('id, username');
  const botUsers = (allUsers ?? []).filter((u) =>
    botUsernames.some((b) => u.username && u.username.toLowerCase() === b.toLowerCase())
  );

  if (!botUsers?.length) {
    console.error('❌ No bot users found.');
    process.exit(1);
  }

  const userMap = {};
  botUsers.forEach((u) => (userMap[u.username.toLowerCase()] = u.id));

  let totalGenerated = 0;

  for (const username of botUsernames) {
    const userId = userMap[username];
    if (!userId) continue;
    const bot = BOTS[username];

    // Sign in as bot
    const botEmail = `bot-${username.replace('.', '-')}@dreambot.app`;
    const botPassword = BOT_PASSWORD_PREFIX + username;
    const { data: authData, error: authErr } = await sbAuth.auth.signInWithPassword({
      email: botEmail,
      password: botPassword,
    });
    if (authErr || !authData.session) {
      console.error(`❌ Can't sign in as ${username}:`, authErr?.message);
      continue;
    }
    const botJwt = authData.session.access_token;

    // Build vibe pool
    let botVibeKeys = bot.excludeVibes
      ? vibeKeys.filter((v) => !bot.excludeVibes.includes(v))
      : [...vibeKeys];
    if (bot.extraVibes) botVibeKeys.push(...bot.extraVibes);
    console.log(`🔑 ${username} (${botVibeKeys.length} vibes)`);

    // Load unused seed prompts
    const prefix = `${username.replace('.', '')}_`;
    let seedPool = await loadUnusedSeeds(prefix);
    console.log(`   📦 ${seedPool.length} unused seeds`);

    // If pool is empty, regenerate
    if (seedPool.length === 0) {
      const refreshed = await regenSeeds(username, prefix);
      if (refreshed) seedPool = refreshed;
      console.log(`   📦 ${seedPool.length} seeds after regen`);
    }

    for (let i = 0; i < COUNT; i++) {
      try {
        const mediumKey = pick(bot.mediums);
        const pinned = bot.pinVibes && bot.pinVibes[mediumKey];
        const vibeKey = pinned
          ? (Array.isArray(pinned) ? pick(pinned) : pinned)
          : pick(botVibeKeys);

        // Pick a random unused seed
        let seed;
        if (seedPool.length > 0) {
          const idx = Math.floor(Math.random() * seedPool.length);
          seed = seedPool[idx];
          seedPool.splice(idx, 1); // remove from local pool so we don't pick it again this run
        }
        let hint = seed ? seed.template : 'an epic breathtaking scene';
        if (bot.banPhrases && bot.banPhrases.length > 0) {
          hint += '. Never include: ' + bot.banPhrases.join(', ');
        }

        console.log(`\n🎨 ${username} [${i + 1}/${COUNT}] | ${mediumKey} + ${vibeKey}`);
        console.log(`   📝 ${hint.slice(0, 80)}`);

        const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-dream`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${botJwt}`,
          },
          body: JSON.stringify({
            mode: 'flux-dev',
            medium_key: mediumKey,
            vibe_key: vibeKey,
            hint,
          }),
        });

        if (!res.ok) {
          const err = await res.text();
          throw new Error(`Edge Function ${res.status}: ${err.slice(0, 200)}`);
        }

        const result = await res.json();
        if (result.upload_id) {
          // Mark seed as used
          if (seed) {
            await sb
              .from('bot_seeds')
              .update({ used_at: new Date().toISOString() })
              .eq('id', seed.id);
          }
          await sb
            .from('uploads')
            .update({
              is_active: true,
              is_posted: true,
              is_public: true,
              posted_at: new Date().toISOString(),
            })
            .eq('id', result.upload_id);
          console.log(`   ✅ Posted! (${++totalGenerated} total) [${seedPool.length} seeds remaining]`);
        }

        await new Promise((r) => setTimeout(r, 2000));
      } catch (err) {
        console.error(`   ❌ ${username} failed:`, err.message);
      }
    }
  }

  console.log(`\n🎉 Done! ${totalGenerated} dreams posted.`);
})();
