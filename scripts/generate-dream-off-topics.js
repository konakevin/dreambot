#!/usr/bin/env node
/**
 * Generate the Dream Off topic deck (dream_off_topics).
 *
 * Design (DREAM_OFF_PLAN.md §6): 6 EVERGREEN packs always on, ~100 topics each.
 * A topic is a SHORT, funny, VISUAL prompt seed — players interpret it by
 * generating an AI dream image, then blind-vote the results. So topics must be
 * evocative, renderable, name-free, and SFW (a per-game Spicy tone is a separate
 * opt-in deck, deferred). Seasonal/holiday packs are a fast-follow.
 *
 * DEDUP-AS-YOU-GO (mirrors the bots' iterative-passback technique in
 * scripts/lib/seed-generator.js): topics are generated in small batches; every
 * batch is deduped against a GLOBAL seen-set (normalized) — which is preloaded
 * from what's already in dream_off_topics (all packs) AND grows across packs and
 * batches — and the running list is fed BACK to Sonnet as an avoid-list so it
 * diversifies instead of repeating. Cross-pack + re-run safe.
 *
 * Usage:
 *   node scripts/generate-dream-off-topics.js                 # ~100 per pack
 *   node scripts/generate-dream-off-topics.js --count 5       # trial: 5 per pack
 *   node scripts/generate-dream-off-topics.js --pack cursed   # one pack only
 *   node scripts/generate-dream-off-topics.js --dry-run       # print, don't insert
 */

const { SONNET } = require('./lib/models');
require('dotenv').config({ path: '.env.local' });
const Anthropic = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(
  'https://jimftynwrinwenonjrlj.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const args = process.argv.slice(2);
const countIdx = args.indexOf('--count');
const COUNT = countIdx >= 0 ? parseInt(args[countIdx + 1], 10) : 100;
const packIdx = args.indexOf('--pack');
const ONLY_PACK = packIdx >= 0 ? args[packIdx + 1] : null;
const DRY_RUN = args.includes('--dry-run');

const BATCH = 22; // topics requested per Sonnet call
const MAX_ROUNDS = 12; // safety cap per pack (batches that add nothing → bail)

// The 6 evergreen packs. `voice` steers the Sonnet call; `examples` anchor the
// register (short, visual, funny, renderable) without being copied verbatim.
const PACKS = [
  {
    key: 'cursed',
    label: 'Cursed 😈',
    voice:
      'Unhinged, forbidden, slightly-wrong, haunted, "why does this exist" energy. Delightfully cursed, never gross or mean. The funny is in the wrongness.',
    examples: [
      'the most cursed sandwich ever assembled',
      'a gas station at 3am that should not exist',
      'a haunted bouncy castle',
      'the worst possible emotional support animal',
      'a vending machine that dispenses regret',
    ],
  },
  {
    key: 'wholesome',
    label: 'Wholesome 🥹',
    voice:
      'Sweet, cozy, heartwarming, a little magical. The kind of image that makes you go "awww". Warmth and charm, not saccharine.',
    examples: [
      'a golden retriever having the best day of its life',
      'the coziest cabin in the middle of a snowstorm',
      'two robots slowly falling in love',
      'a tiny dragon who just wants a hug',
      'grandmas kitchen on a slow Sunday morning',
    ],
  },
  {
    key: 'chaotic',
    label: 'Chaotic 🌀',
    voice:
      'Maximum absurd chaos, comedic energy, everything happening at once. Big, loud, ridiculous, kinetic scenes.',
    examples: [
      'a birthday party that has completely spiraled out of control',
      'rush hour, but everyone is a raccoon',
      'the exact moment the office printer finally snaps',
      'a wizard duel that got way out of hand at a grocery store',
      'what the group chat looks like at 2am',
    ],
  },
  {
    key: 'roast',
    label: 'Us / Roast 🔥',
    voice:
      'The friend group / "us" as something funny — playful self-roast energy. STRICTLY NAME-FREE generic templates (never a person\'s name, gender, or real detail) so any group can play. Uses "our group", "us", "this friend group", "the squad".',
    examples: [
      'our group chat as an early-2000s boy band album cover',
      'the vibe of this friend group as a cursed oil painting',
      'us as the poster for a chaotic reality TV show',
      'the squad reimagined as medieval peasants',
      'our friend group as a box of mismatched cereal mascots',
    ],
  },
  {
    key: 'character',
    label: 'Character 🎭',
    voice:
      'Become / embody a character or archetype ("you as ___", "everyone as ___"). Fun transformations across genres and eras. Keep it an archetype, never a named real celebrity or trademarked character.',
    examples: [
      'you as a battle-worn medieval knight',
      'you as a 1980s straight-to-VHS action hero',
      'everyone reimagined as cute animated movie characters',
      'you as a very serious Renaissance oil portrait',
      'you as a cryptid finally caught on a trail cam',
    ],
  },
  {
    key: 'worlds',
    label: 'Worlds 🌍',
    voice:
      'Fantastical settings and impossible places — the scene itself is the star. Wondrous, imaginative, richly renderable worlds.',
    examples: [
      'a city built entirely out of candy',
      'the last diner at the very edge of the universe',
      'an enormous library hidden underwater',
      'a floating night market drifting through the clouds',
      'a train station where every platform leads to a different season',
    ],
  },
];

// Normalized dedup key: lowercase, drop a leading article, strip punctuation,
// collapse whitespace. Catches "A haunted bouncy castle" vs "haunted bouncy castle."
function normKey(t) {
  return t
    .toLowerCase()
    .replace(/^(a|an|the)\s+/, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseTopics(text) {
  return text
    .split('\n')
    .map((l) => l.replace(/^[\s\-\d.)*]+/, '').trim())
    .map((l) =>
      l
        .replace(/["“”]/g, '')
        .replace(/[.\s]+$/, '')
        .trim()
    )
    .filter((l) => l.length >= 3 && l.length <= 90 && l.split(' ').length <= 14);
}

async function withRetry(fn, maxRetries = 4) {
  const delays = [2000, 5000, 12000, 30000];
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const retryable = err.status === 429 || err.status === 529 || err.status >= 500;
      if (!retryable || attempt === maxRetries) throw err;
      const d = delays[Math.min(attempt, delays.length - 1)];
      console.log(
        `   ⏳ ${err.status} overloaded, retry in ${d / 1000}s (${attempt + 1}/${maxRetries})`
      );
      await new Promise((r) => setTimeout(r, d));
    }
  }
}

// One batch, with the recent avoid-list fed back so Sonnet diversifies.
async function genBatch(pack, n, avoidList) {
  const avoid =
    avoidList.length > 0
      ? `\n\nAlready used — DO NOT repeat these or anything close in concept:\n${avoidList
          .slice(-70)
          .map((a) => `- ${a}`)
          .join('\n')}`
      : '';
  const prompt = `You are writing topics for "Dream Off", a party game where friends each generate an AI dream image interpreting the same funny topic, then blind-vote the results.

Generate ${n} FRESH, distinct topics for the "${pack.label}" pack.

Pack voice: ${pack.voice}

Good examples (match this register + length, DO NOT reuse them):
${pack.examples.map((e) => `- ${e}`).join('\n')}

Hard rules:
- Each topic is a SHORT phrase (roughly 3-11 words), lowercase, no ending punctuation.
- VISUAL + renderable — it must paint a clear image a person can generate.
- Funny, surprising, or evocative. Vary the ideas WIDELY (no two alike).
- SFW. No real people's names, no trademarked characters, no gore, nothing mean.
- ${pack.key === 'roast' ? 'NAME-FREE templates only — "our group / us / the squad", never a specific person or gender.' : 'No player names.'}${avoid}

Return ONLY the ${n} topics, one per line, no numbering, no commentary.`;
  const msg = await withRetry(() =>
    client.messages.create({
      model: SONNET,
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })
  );
  const text = msg.content.map((c) => (c.type === 'text' ? c.text : '')).join('');
  return parseTopics(text);
}

// Accumulate unique topics for a pack until `target`, deduping against the shared
// global seen-set (cross-pack + existing DB) as we go.
async function genPack(pack, target, seen) {
  const fresh = []; // {topic} added this run
  const avoid = []; // recent topic strings fed back to Sonnet
  let rounds = 0;
  while (fresh.length < target && rounds < MAX_ROUNDS) {
    rounds++;
    const need = Math.min(BATCH, target - fresh.length + 4);
    const batch = await genBatch(pack, need, avoid);
    let added = 0;
    for (const t of batch) {
      const k = normKey(t);
      if (k.length < 3 || seen.has(k)) continue;
      seen.add(k);
      fresh.push(t);
      avoid.push(t);
      added++;
      if (fresh.length >= target) break;
    }
    process.stdout.write(`   round ${rounds}: +${added} (${fresh.length}/${target})\n`);
    if (added === 0 && rounds >= 3) break; // diminishing returns → stop
  }
  return fresh;
}

async function main() {
  const packs = ONLY_PACK ? PACKS.filter((p) => p.key === ONLY_PACK) : PACKS;
  if (packs.length === 0) {
    console.error(`Unknown pack "${ONLY_PACK}". Valid: ${PACKS.map((p) => p.key).join(', ')}`);
    process.exit(1);
  }

  // Preload the global seen-set from EVERY existing topic (all packs) so re-runs
  // top up cleanly and never collide cross-pack.
  const seen = new Set();
  if (!DRY_RUN) {
    const { data: existing } = await supabase.from('dream_off_topics').select('topic_text');
    for (const r of existing ?? []) seen.add(normKey(r.topic_text));
    console.log(`Preloaded ${seen.size} existing topics into the dedup set.`);
  }

  let grandTotal = 0;
  for (const pack of packs) {
    console.log(`\n▶ ${pack.label} — target ${COUNT}`);
    const topics = await genPack(pack, COUNT, seen);
    console.log(`   → ${topics.length} unique`);

    if (DRY_RUN) {
      topics.slice(0, 20).forEach((t) => console.log(`   · ${t}`));
      if (topics.length > 20) console.log(`   … (+${topics.length - 20} more)`);
      grandTotal += topics.length;
      continue;
    }
    if (topics.length === 0) continue;
    const rows = topics.map((t) => ({
      pack: pack.key,
      topic_text: t,
      tone: 'sfw',
      is_active: true,
    }));
    const { error } = await supabase.from('dream_off_topics').insert(rows);
    if (error) {
      console.error(`   ✖ insert failed: ${error.message}`);
      process.exit(1);
    }
    console.log(`   ✓ inserted ${rows.length}`);
    grandTotal += rows.length;
  }

  console.log(
    `\n${DRY_RUN ? 'Would generate' : 'Inserted'} ${grandTotal} topics across ${packs.length} pack(s).`
  );
  if (!DRY_RUN) {
    for (const p of PACKS) {
      const { count } = await supabase
        .from('dream_off_topics')
        .select('*', { count: 'exact', head: true })
        .eq('pack', p.key);
      console.log(`  ${p.key.padEnd(10)} ${count ?? 0}`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
