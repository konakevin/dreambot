/**
 * Backfill dream_medium and dream_vibe on old posts.
 * Sends each post's ai_prompt to Haiku to classify which medium and vibe
 * it most closely matches from our curated lists.
 *
 * Usage: node scripts/backfill-medium-vibe.js
 * Reads keys from .env.local
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const sb = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

const MEDIUMS = [
  'anime',
  'canvas',
  'claymation',
  'comics',
  'coquette',
  'animation',
  'fairytale',
  'gothic',
  'handcrafted',
  'lego',
  'neon',
  'pencil',
  'photography',
  'pixels',
  'shimmer',
  'storybook',
  'twilight',
  'vaporwave',
  'vinyl',
  'watercolor',
];

const VIBES = [
  'cinematic',
  'dreamy',
  'dark',
  'chaos',
  'cozy',
  'minimal',
  'epic',
  'nostalgic',
  'psychedelic',
  'peaceful',
  'whimsical',
];

async function classify(prompt) {
  const brief = `Given this AI image generation prompt, identify the closest matching medium and vibe.

PROMPT: "${prompt.slice(0, 500)}"

MEDIUMS: ${MEDIUMS.join(', ')}
VIBES: ${VIBES.join(', ')}

Reply with ONLY a JSON object: {"medium":"<key>","vibe":"<key>"}
Pick the BEST match. If unsure, pick the closest one — do not say "none".`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 50,
      messages: [
        { role: 'user', content: brief },
        { role: 'assistant', content: '{' },
      ],
    }),
  });

  if (!res.ok) throw new Error(`Haiku ${res.status}`);
  const data = await res.json();
  const raw = '{' + (data.content?.[0]?.text?.trim() ?? '');
  try {
    const parsed = JSON.parse(raw);
    return {
      medium: MEDIUMS.includes(parsed.medium) ? parsed.medium : 'watercolor',
      vibe: VIBES.includes(parsed.vibe) ? parsed.vibe : 'dreamy',
    };
  } catch {
    console.warn('  Parse failed:', raw.slice(0, 100));
    return { medium: 'watercolor', vibe: 'dreamy' };
  }
}

async function main() {
  const { data: posts } = await sb
    .from('uploads')
    .select('id, ai_prompt')
    .is('dream_medium', null)
    .not('ai_prompt', 'is', null)
    .order('created_at', { ascending: false });

  console.log(`Backfilling ${posts.length} posts...\n`);

  let done = 0;
  for (const post of posts) {
    try {
      const { medium, vibe } = await classify(post.ai_prompt);
      await sb.from('uploads').update({ dream_medium: medium, dream_vibe: vibe }).eq('id', post.id);
      done++;
      console.log(`${done}/${posts.length} ${post.id.slice(0, 8)} → ${medium} + ${vibe}`);
    } catch (err) {
      console.error(`FAILED ${post.id.slice(0, 8)}:`, err.message);
    }

    // Rate limit: ~2 calls/sec to stay under Haiku limits
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`\nDone. Backfilled ${done}/${posts.length} posts.`);
}

main().catch(console.error);
