#!/usr/bin/env node
/**
 * Generate MuseBot topic pool — 400 profound thought territories.
 *
 * Usage:
 *   node scripts/gen-seeds/musebot/gen-topics.js
 *   node scripts/gen-seeds/musebot/gen-topics.js --dry-run
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
    name: 'courage_fear',
    label: 'Courage, Fear & Starting',
    desc: 'The terror and beauty of beginning things — starting before you\'re ready, doing scared, the first step being the hardest, fear as a compass, the cost of waiting for permission, the gap between wanting and doing.',
    count: 50,
  },
  {
    name: 'love_connection',
    label: 'Love, Friendship & Connection',
    desc: 'The quiet mechanics of love — how people show care in invisible ways, the weight of being truly known, friendships that survive silence, love as action not feeling, the bravery of vulnerability, the people who stay.',
    count: 50,
  },
  {
    name: 'time_presence',
    label: 'Time, Presence & Mortality',
    desc: 'How time actually works when you pay attention — the speed of years vs the length of days, being present, the things you\'ll miss when they\'re gone, growing older, legacy, what matters at the end, the gift of ordinary days.',
    count: 50,
  },
  {
    name: 'growth_change',
    label: 'Growth, Change & Becoming',
    desc: 'The messy process of becoming yourself — outgrowing old versions, the pain of growth, shedding what doesn\'t fit, becoming the person you needed, change as proof of life, the beauty of unfinished work.',
    count: 50,
  },
  {
    name: 'resilience_healing',
    label: 'Resilience, Healing & Strength',
    desc: 'Surviving hard things and finding your way back — scars as evidence of survival, healing not being linear, the strength in asking for help, the weight you\'ve carried, rest as resistance, rebuilding after breaking.',
    count: 50,
  },
  {
    name: 'purpose_meaning',
    label: 'Purpose, Meaning & Ambition',
    desc: 'What makes a life feel like it counts — finding your thing, the trap of comparison, creating vs consuming, legacy, doing work that matters, the difference between busy and meaningful, the courage to choose differently.',
    count: 50,
  },
  {
    name: 'perspective_wonder',
    label: 'Perspective, Wonder & Awareness',
    desc: 'Seeing the world with fresh eyes — the miracle of ordinary things, perspective shifts, gratitude without cliche, the strangeness of being alive, small beautiful truths hiding in plain sight, what you stop noticing.',
    count: 50,
  },
  {
    name: 'identity_truth',
    label: 'Identity, Authenticity & Truth',
    desc: 'Being real in a world that rewards performance — the exhaustion of pretending, the freedom of honesty, knowing yourself vs performing yourself, the gap between who you are and who you show, the courage of being seen.',
    count: 50,
  },
];

const SYSTEM = `You are generating TOPIC SEEDS for an AI that writes original profound thoughts — the kind of statement that makes someone pause, screenshot, and send to a friend.

Each topic is a TERRITORY for the AI to explore — not a quote itself, but a setup that points toward a profound truth. Think of it as: "write something profound about..."

Each topic should be:
- A specific enough territory that it points toward a REAL insight (not just "love" — "the way you know someone loves you by what they remember about you")
- Universal — something 80%+ of people would connect with
- NOT a quote or finished thought — it's a seed, a direction
- 8-20 words, a phrase or sentence fragment

Good topics:
- "the moment you realize your parents were just figuring it out too"
- "how the things you do when nobody's watching define you more than anything public"
- "the difference between being alone and being lonely"
- "why the hardest conversations are usually the most important ones"
- "the strange comfort of rain when you have nowhere to be"
- "how starting over is actually proof you haven't given up"

Bad topics:
- "love" (too vague)
- "be yourself" (cliche, not a territory)
- "the meaning of life" (too broad)
- "manifest your dreams" (woo)

Output a JSON array of strings. No numbering, no markdown, just the array.`;

async function generateBatch(category, existingTopics) {
  const dedupBlock = existingTopics.length > 0
    ? `\n\nALREADY GENERATED (do NOT repeat or rephrase):\n${existingTopics.slice(-100).map(b => `- ${b}`).join('\n')}`
    : '';

  const userMsg = `Generate exactly ${category.count} profound-thought topic seeds in the category: **${category.label}**

${category.desc}

Every entry must point toward a DIFFERENT insight. No duplicates, no rephrasing.${dedupBlock}`;

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

function dedupKey(topic) {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\b(the|a|an|and|or|but|in|on|at|to|for|of|is|it|you|your|they|their|them|then|that|this|with|from|just|when|after|before|how|why|what)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .sort()
    .join(' ');
}

function dedup(topics) {
  const seen = new Set();
  const result = [];
  for (const t of topics) {
    const key = dedupKey(t);
    if (key.length < 5) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(t);
  }
  return result;
}

(async () => {
  console.log('🌸 Generating MuseBot topic pool (8 categories × 50)\n');

  const allTopics = [];
  const byCat = {};

  for (const cat of CATEGORIES) {
    process.stdout.write(`  ${cat.label} (${cat.count})...`);
    try {
      const batch = await generateBatch(cat, allTopics);
      const dedupd = dedup([...allTopics, ...batch]).slice(allTopics.length);
      byCat[cat.name] = dedupd;
      allTopics.push(...dedupd);
      console.log(` ${dedupd.length} unique`);
    } catch (err) {
      console.log(` FAILED: ${err.message}`);
    }
  }

  const finalPool = dedup(allTopics);
  console.log(`\n✅ Total: ${finalPool.length} unique topics (target: 400)`);

  if (DRY_RUN) {
    for (const cat of CATEGORIES) {
      console.log(`\n--- ${cat.label} (${(byCat[cat.name] || []).length}) ---`);
      (byCat[cat.name] || []).forEach((t, i) => console.log(`  ${i + 1}. ${t}`));
    }
    return;
  }

  const outPath = path.join(__dirname, 'topics.json');
  fs.writeFileSync(outPath, JSON.stringify(finalPool, null, 2));
  console.log(`💾 Saved to ${outPath}`);
})();
