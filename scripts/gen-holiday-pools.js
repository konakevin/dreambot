#!/usr/bin/env node
/**
 * Holiday Dreams seed generator (HOLIDAY_DREAMS_PLAN.md §8).
 * Sonnet-authors face-swap-safe holiday rows, LINTS each with holidayPoolLint (§6),
 * drops any violation, and inserts. Two seasons × three surfaces:
 *   - fall / halloween  CAST  → dual_scenarios + single_scenarios (pool='holiday')
 *   - fall / halloween  SCENE → holiday_scenes (no cast, rich standalone)
 *
 *   node scripts/gen-holiday-pools.js --pool <name> [--n 14] [--dry]
 *   pools: fall-dual fall-single halloween-dual halloween-single fall-scene halloween-scene | all
 *
 * After running, ALWAYS: node scripts/scan-holiday-pools.js && node scripts/scan-dual-faceswap-proximity.js
 */
require('dotenv').config({ path: '.env.local' });
const Anthropic = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');
const { lintHolidayRow } = require('./lib/holidayPoolLint');

const SONNET = 'claude-sonnet-4-5-20250929';
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const sb = createClient(
  'https://jimftynwrinwenonjrlj.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const arg = (n, d) => {
  const i = process.argv.indexOf('--' + n);
  return i >= 0 ? process.argv[i + 1] : d;
};
const DRY = process.argv.includes('--dry');
const N = parseInt(arg('n', '14'), 10);

// Gothic/painted face-swap mediums for Halloween cast (rotate for variety); cozy
// photoreal for Fall cast; painterly/photoreal scene-eligible for scene-only.
const HALLOWEEN_CAST_MEDIA = [
  'gothic_painted',
  'vampire_portrait',
  'painted_gothic_fantasy',
  'gothic_oil_garden',
  'film_noir',
  'old_west',
];
const FALL_CAST_MEDIUM = 'photography';
const FALL_SCENE_MEDIA = ['photography', 'canvas'];
const HALLOWEEN_SCENE_MEDIA = ['illustration', 'canvas', 'film_noir'];
const pickRot = (arr, i) => arr[i % arr.length];

// ── meta-prompts ──────────────────────────────────────────────────────────────
const CAST_RULES = `HARD RULES (a render is REJECTED if violated — this is a FACE-SWAP portrait, the person/couple must dominate with big clear faces):
- attire: 6-16 words, CLOTHING ONLY. NEVER a mask, hood pulled up over the face, face paint, fangs, prosthetic, veil, or sunglasses — nothing that covers or recolors the face (the face swap needs a clear frontal face). Hats/headbands/crowns/hoods-DOWN are fine.
- scene: 12-26 words, PURE ENVIRONMENT only (WHERE they are + atmosphere). NO people, NO pose words, NO camera/lens/framing words, NO face/eye words, NO pronouns. Do NOT say the scene "fills the background / is rich / layered / dominant".
- No children/minors. Tasteful (no lingerie/nudity/gore).`;

const DUAL_EXTRA = `- This is a COUPLE. Write attire that dresses BOTH and is gender-neutral OR explicitly paired ("she in a flowing gown, he in a matching frock coat") — never a single-gender garment alone.
- Keep them side by side with a CLEAR GAP between their heads — never cheek-to-cheek, embracing, leaning in, or facing each other.`;

const POOLS = {
  'fall-dual': {
    table: 'dual_scenarios',
    key: { pool: 'holiday', category: 'fall' },
    medium: (i) => ({ medium_key: FALL_CAST_MEDIUM }),
    prompt: (
      n
    ) => `Generate ${n} DISTINCT cozy-AUTUMN couple scenarios for a dreamy nightly-photo app — "you two, on the most perfect fall afternoon." Real cozy fall clothes (NO costume). Warm, nostalgic, pretty: corn mazes, leaf piles, pumpkin farms, apple orchards, fiery maple groves, cabin porches, bonfires, trick-or-treat streets.

Output ONLY a JSON array of ${n} objects: {"scene":"...","attire":"..."}
- attire: cozy autumn clothing for BOTH (sweaters, flannels, scarves, beanies, corduroy) — gender-neutral or paired.
${CAST_RULES}
${DUAL_EXTRA}
Vary the setting across all ${n}. Output ONLY the JSON array.`,
  },
  'fall-single': {
    table: 'single_scenarios',
    key: { pool: 'holiday', category: 'fall' },
    medium: (i) => ({ medium_key: FALL_CAST_MEDIUM, gender: 'any' }),
    prompt: (
      n
    ) => `Generate ${n} DISTINCT cozy-AUTUMN solo scenarios for a dreamy nightly-photo app — "you, on the most perfect fall afternoon." Real cozy fall clothes (NO costume). Warm, nostalgic, pretty: corn mazes, leaf piles, pumpkin farms, apple orchards, fiery maple groves, cabin porches, bonfires.

Output ONLY a JSON array of ${n} objects: {"scene":"...","attire":"..."}
- attire: cozy autumn clothing (sweater, flannel, scarf, beanie, corduroy coat).
${CAST_RULES}
Vary the setting across all ${n}. Output ONLY the JSON array.`,
  },
  'halloween-dual': {
    table: 'dual_scenarios',
    key: { pool: 'holiday', category: 'halloween' },
    medium: (i) => ({ medium_key: pickRot(HALLOWEEN_CAST_MEDIA, i) }),
    prompt: (
      n
    ) => `Generate ${n} DISTINCT HALLOWEEN costumed-COUPLE scenarios for a dreamy nightly-photo app — gothic, spooky-glam, and fun. Lean GOTHIC (GothBot-adjacent): old castles and castle ruins, candlelit gothic manors, moonlit crypts and cathedrals, fog-drowned villages, haunted rose gardens, gothic landscapes, graveyards. Costume archetypes: vampire aristocrats, glamour witches, ghost-glam, Van Helsing monster-hunters, elegant grim reapers, autumn-fae, harvest royalty. Costume = CLOTHING ONLY.

Output ONLY a JSON array of ${n} objects: {"scene":"...","attire":"..."}
- attire: the costume as clothing for BOTH (cape + high collar, frock coat, flowing witch robes, leather monster-hunter coat) — gender-neutral or paired. NEVER a mask/fangs/face-paint/hood-over-face.
${CAST_RULES}
${DUAL_EXTRA}
Vary the costume + gothic setting across all ${n}. Output ONLY the JSON array.`,
  },
  'halloween-single': {
    table: 'single_scenarios',
    key: { pool: 'holiday', category: 'halloween' },
    medium: (i) => ({ medium_key: pickRot(HALLOWEEN_CAST_MEDIA, i), gender: 'any' }),
    prompt: (
      n
    ) => `Generate ${n} DISTINCT HALLOWEEN costumed-SOLO scenarios for a dreamy nightly-photo app — gothic, spooky-glam, and fun. Lean GOTHIC: old castles and castle ruins, candlelit gothic manors, moonlit crypts and cathedrals, fog-drowned villages, haunted rose gardens, gothic landscapes, graveyards. Archetypes: vampire aristocrat, glamour witch, ghost-glam, Van Helsing monster-hunter, elegant grim reaper (hood DOWN), autumn-fae, harvest royalty, retro mad scientist, cat-burglar.

Output ONLY a JSON array of ${n} objects: {"scene":"...","attire":"..."}
- attire: the costume as clothing (cape + high collar, flowing witch robes, leather coat, ornate robe with hood DOWN). NEVER a mask/fangs/face-paint/hood-over-face.
${CAST_RULES}
Vary the costume + gothic setting across all ${n}. Output ONLY the JSON array.`,
  },
  'fall-scene': {
    table: 'holiday_scenes',
    key: { holiday: 'fall' },
    medium: (i) => ({ medium_key: pickRot(FALL_SCENE_MEDIA, i) }),
    prompt: (
      n
    ) => `Generate ${n} DISTINCT rich, standalone AUTUMN scenes (NO people) for a dreamy nightly wallpaper — cozy, nostalgic, breathtakingly pretty fall. Corn mazes at dusk, golden pumpkin farms, fiery maple forests, misty apple orchards, cabin porches with jack-o-lanterns, small-town Main Streets in fall, bonfire fields, leaf-strewn park paths, harvest moons over valleys.

Output ONLY a JSON array of ${n} objects: {"scene":"..."}
- scene: 35-60 words, a rich immersive environment with defined light, layered depth, saturated autumn color. Its own time of day + weather. NO people as the subject (tiny distant silhouettes at most). NO text/words/watermarks, NO real brand or place names.
Vary the setting across all ${n}. Output ONLY the JSON array.`,
  },
  'halloween-scene': {
    table: 'holiday_scenes',
    key: { holiday: 'halloween' },
    medium: (i) => ({ medium_key: pickRot(HALLOWEEN_SCENE_MEDIA, i) }),
    prompt: (
      n
    ) => `Generate ${n} DISTINCT rich, standalone HALLOWEEN scenes (NO people) for a dreamy nightly wallpaper — gothic, spooky-beautiful, awe not gore. Lean GOTHIC: old castles and cliff-top castle ruins, gothic landscapes and misty moorlands, haunted Victorian manors under a full moon, moonlit fog graveyards, candlelit witch cottages, gothic cathedrals and crypts, jack-o-lantern festivals, spooky lantern-lit forests, abandoned carnivals under a blood moon, haunted lighthouses in a storm.

Output ONLY a JSON array of ${n} objects: {"scene":"..."}
- scene: 35-60 words, a rich immersive environment with defined light, deep atmosphere, moody saturated color. Awe/eerie-beauty, NEVER gore. NO people as the subject (tiny distant silhouettes at most). NO text/words/watermarks, NO real brand or place names.
Vary the setting across all ${n}. Output ONLY the JSON array.`,
  },
};

async function genOne(name) {
  const cfg = POOLS[name];
  if (!cfg) throw new Error(`unknown pool "${name}"`);
  const msg = await client.messages.create({
    model: SONNET,
    max_tokens: 3000,
    messages: [{ role: 'user', content: cfg.prompt(N) }],
  });
  let text = msg.content[0].text
    .trim()
    .replace(/^```(json)?/i, '')
    .replace(/```$/, '')
    .trim();
  let parsed = [];
  try {
    parsed = JSON.parse(text);
  } catch {
    const m = text.match(/\[[\s\S]*\]/);
    parsed = m ? JSON.parse(m[0]) : [];
  }
  parsed = Array.isArray(parsed) ? parsed.filter((o) => o && o.scene) : [];

  const rows = [];
  let dropped = 0;
  parsed.forEach((o, i) => {
    const row = { ...cfg.key, scene: o.scene, ...cfg.medium(i) };
    if (o.attire) row.attire = o.attire;
    const { errors, warnings } = lintHolidayRow({ ...row, table: cfg.table });
    warnings.forEach((w) => console.warn(`   ⚠ ${name}[${i}]: ${w}`));
    if (errors.length) {
      dropped++;
      console.warn(`   ✖ drop ${name}[${i}]: ${errors[0]} — "${String(o.scene).slice(0, 50)}…"`);
      return;
    }
    rows.push(row);
  });

  console.log(`\n${name}: ${rows.length} clean, ${dropped} dropped (of ${parsed.length}).`);
  if (rows.length && !DRY) {
    const { error } = await sb.from(cfg.table).insert(rows);
    if (error) console.error(`   ❌ insert failed: ${error.message}`);
    else console.log(`   ✅ inserted ${rows.length} into ${cfg.table}`);
  }
  return rows.length;
}

(async () => {
  if (!process.env.ANTHROPIC_API_KEY || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing ANTHROPIC_API_KEY or SUPABASE_SERVICE_ROLE_KEY (.env.local)');
    process.exit(2);
  }
  const which = arg('pool', 'all');
  const names = which === 'all' ? Object.keys(POOLS) : [which];
  let total = 0;
  for (const name of names) total += await genOne(name);
  console.log(`\n━━━ done: ${total} holiday rows ${DRY ? 'generated (dry)' : 'inserted'} ━━━`);
  if (!DRY)
    console.log(
      'NEXT: node scripts/scan-holiday-pools.js  &&  node scripts/scan-dual-faceswap-proximity.js'
    );
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
