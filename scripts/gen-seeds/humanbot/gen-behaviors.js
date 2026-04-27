#!/usr/bin/env node
/**
 * Generate HumanBot behavior pool — 400 peculiar human behaviors for Sonnet to roast.
 *
 * Usage:
 *   node scripts/gen-seeds/humanbot/gen-behaviors.js
 *   node scripts/gen-seeds/humanbot/gen-behaviors.js --dry-run   # print, don't save
 */

const fs = require('fs');
const path = require('path');

function readEnvFile() {
  try {
    const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch { return {}; }
}
const envFile = readEnvFile();
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || envFile.ANTHROPIC_API_KEY;
if (!ANTHROPIC_KEY) { console.error('Missing ANTHROPIC_API_KEY'); process.exit(1); }

const DRY_RUN = process.argv.includes('--dry-run');

const CATEGORIES = [
  {
    name: 'social_lies',
    label: 'Social Lies & Politeness Theater',
    desc: 'Things humans say to each other that both parties know are false — "we should hang out," "I\'m on my way," "no worries," "I\'m fine." The entire social contract is built on agreed-upon lies.',
    count: 50,
  },
  {
    name: 'self_deception',
    label: 'Self-Deception & Denial',
    desc: 'Things humans tell THEMSELVES that are obviously not true — "I\'ll start Monday," "just one more," "I don\'t care what people think," "I\'m a morning person." The lies we sell ourselves.',
    count: 50,
  },
  {
    name: 'pointless_rituals',
    label: 'Pointless Rituals & Superstition',
    desc: 'Things humans do that accomplish absolutely nothing — pressing elevator buttons harder, blowing on dice, knocking on wood, jiggling the door handle after locking it, checking behind the shower curtain.',
    count: 50,
  },
  {
    name: 'technology',
    label: 'Technology & Phone Behavior',
    desc: 'Absurd things humans do with their devices — checking the time then immediately forgetting it, typing a long message then deleting it, restarting the router as first and only IT skill, screenshot hoarding.',
    count: 50,
  },
  {
    name: 'food_and_kitchen',
    label: 'Food, Cooking & Kitchen Behavior',
    desc: 'Weird things humans do around food — opening the fridge hoping for new items, buying vegetables that rot, owning spices they never use, eating over the sink like a secret agent, ordering water and never touching it.',
    count: 50,
  },
  {
    name: 'relationships',
    label: 'Relationships, Dating & Social Dynamics',
    desc: 'Absurd relationship and friendship behaviors — stalking exes online, composing the perfect "casual" text for 45 minutes, saying "you pick" then vetoing every suggestion, the farewell that takes 30 minutes.',
    count: 50,
  },
  {
    name: 'work_and_money',
    label: 'Work Culture & Money Logic',
    desc: 'Office absurdity and spending contradictions — meetings that could be emails, buying things on sale you\'d never buy at full price, working overtime to afford the vacation you\'re too busy to take.',
    count: 50,
  },
  {
    name: 'daily_life',
    label: 'Daily Routines, Health & Domestic Life',
    desc: 'Everyday absurdity — setting 5 alarms, buying gym memberships as motivation, cleaning before the cleaner, the chair that\'s not for sitting, googling symptoms at 2am, taking vitamins to offset bad choices.',
    count: 50,
  },
];

const SYSTEM = `You are a comedy writer generating SETUPS for a deadpan robot who roasts human behavior. Your job is to identify SPECIFIC, UNIVERSAL human behaviors that are funny because they're TRUE.

Each behavior should be:
- A specific thing most humans actually do (not niche or obscure)
- Stated in 5-15 words, starting with a verb or gerund
- Funny because it exposes absurdity, self-deception, or pointlessness
- Universal enough that 60%+ of people would go "I do that"
- NOT a joke itself — it's the SETUP. The robot writes the punchline later.

Good behaviors (specific, universal, roastable):
- "saying 'I should go to bed' and then not going to bed for two hours"
- "buying a planner to organize your life and never opening it again"
- "checking the fridge, closing it, lowering your standards, checking again"
- "replying 'lol' to a message that did not make you laugh"
- "googling something, clicking the first result, then googling it again to make sure"

Bad behaviors (too vague, too niche, or not actually funny):
- "being wasteful" (too vague — name the specific waste)
- "organizing stamp collections" (too niche — not universal)
- "breathing oxygen" (not a choice, not roastable)
- "using social media" (too broad — name the specific behavior)

Output a JSON array of strings. No numbering, no markdown, no explanation. Just the array.`;

async function generateBatch(category, existingBehaviors) {
  const dedupBlock = existingBehaviors.length > 0
    ? `\n\nALREADY GENERATED (do NOT repeat or rephrase these):\n${existingBehaviors.slice(-100).map(b => `- ${b}`).join('\n')}`
    : '';

  const userMsg = `Generate exactly ${category.count} peculiar human behaviors in the category: **${category.label}**

${category.desc}

Every entry must be a DIFFERENT specific behavior. No duplicates, no rephrasing the same idea.${dedupBlock}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      system: SYSTEM,
      messages: [{ role: 'user', content: userMsg }],
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Sonnet ${res.status}: ${txt.slice(0, 300)}`);
  }

  const data = await res.json();
  const text = data.content?.[0]?.text?.trim() ?? '';
  const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();

  let arr;
  try {
    arr = JSON.parse(cleaned);
  } catch {
    throw new Error(`Failed to parse batch JSON: ${cleaned.slice(0, 200)}`);
  }

  if (!Array.isArray(arr)) throw new Error('Expected array');
  return arr.filter(x => typeof x === 'string' && x.length > 10);
}

function dedupKey(behavior) {
  return behavior
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\b(the|a|an|and|or|but|in|on|at|to|for|of|is|it|you|your|they|their|them|then|that|this|with|from|just|when|after|before)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .sort()
    .join(' ');
}

function dedup(behaviors) {
  const seen = new Set();
  const result = [];
  for (const b of behaviors) {
    const key = dedupKey(b);
    if (key.length < 5) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(b);
  }
  return result;
}

(async () => {
  console.log('🤖 Generating HumanBot behavior pool (8 categories × 50)\n');

  const allBehaviors = [];
  const byCat = {};

  for (const cat of CATEGORIES) {
    process.stdout.write(`  ${cat.label} (${cat.count})...`);
    try {
      const batch = await generateBatch(cat, allBehaviors);
      const dedupd = dedup([...allBehaviors, ...batch]).slice(allBehaviors.length);
      byCat[cat.name] = dedupd;
      allBehaviors.push(...dedupd);
      console.log(` ${dedupd.length} unique`);
    } catch (err) {
      console.log(` FAILED: ${err.message}`);
    }
  }

  const finalPool = dedup(allBehaviors);
  console.log(`\n✅ Total: ${finalPool.length} unique behaviors (target: 400)`);

  if (DRY_RUN) {
    for (const cat of CATEGORIES) {
      console.log(`\n--- ${cat.label} (${(byCat[cat.name] || []).length}) ---`);
      (byCat[cat.name] || []).forEach((b, i) => console.log(`  ${i + 1}. ${b}`));
    }
    return;
  }

  const outPath = path.join(__dirname, 'behaviors.json');
  fs.writeFileSync(outPath, JSON.stringify(finalPool, null, 2));
  console.log(`💾 Saved to ${outPath}`);
})();
