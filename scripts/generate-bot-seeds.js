#!/usr/bin/env node
/**
 * Generate seed prompts for bot accounts.
 * Uses the iterative dedup passback technique to produce unique seeds.
 * Disables old seeds (preserves them) and tags new ones with a generation number.
 *
 * Usage:
 *   node scripts/generate-bot-seeds.js --bot solaris
 *   node scripts/generate-bot-seeds.js --bot yuuki
 *   node scripts/generate-bot-seeds.js --bot solaris --count 20  (per strategy, default 15)
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { BOT_SEEDS, generateSeedsForBot } = require('./lib/seed-generator');

const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY);

const args = process.argv.slice(2);
const botIdx = args.indexOf('--bot');
const countIdx = args.indexOf('--count');
const BOT = botIdx >= 0 ? args[botIdx + 1] : null;
const PER_STRATEGY = countIdx >= 0 ? parseInt(args[countIdx + 1], 10) : 15;

if (!BOT) {
  console.error('Usage: node scripts/generate-bot-seeds.js --bot <username>');
  process.exit(1);
}

if (!BOT_SEEDS[BOT]) {
  console.error('No seed config for bot: ' + BOT);
  console.error('Available:', Object.keys(BOT_SEEDS).join(', '));
  process.exit(1);
}

(async () => {
  const prefix = BOT.replace('.', '') + '_';

  // Get current max generation for this bot
  const { data: maxGenRows } = await sb
    .from('bot_seeds')
    .select('generation')
    .like('category', prefix + '%')
    .order('generation', { ascending: false })
    .limit(1);
  const currentGen = maxGenRows && maxGenRows.length > 0 ? maxGenRows[0].generation : 0;
  const nextGen = currentGen + 1;

  // Disable old seeds (don't delete)
  const { count: disabledCount } = await sb
    .from('bot_seeds')
    .update({ disabled: true })
    .like('category', prefix + '%')
    .eq('disabled', false);
  console.log(`Disabled ${disabledCount ?? 0} existing ${prefix}* seeds (gen ${currentGen})`);
  console.log(`Generating new seeds as gen ${nextGen}\n`);

  // Generate new seeds
  const { rows } = await generateSeedsForBot(BOT, {
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    perStrategy: PER_STRATEGY,
  });

  // Insert with generation tag
  const tagged = rows.map(r => ({ ...r, disabled: false, generation: nextGen }));
  const { error } = await sb.from('bot_seeds').insert(tagged);
  console.log(error ? '❌ ' + error.message : `✅ ${tagged.length} seeds saved for ${BOT} (gen ${nextGen})`);
})();
