#!/usr/bin/env node
/**
 * Per-ARCHETYPE holiday seed generator (HOLIDAY_DREAMS_PLAN.md §8) — the bot-path
 * quality discipline for holidays. Each archetype (vampire / witch / corn_maze / …)
 * is a TRACKED sub-pool (migration 440 `sub_theme`) with its OWN tuned medium +
 * bespoke costume/scene, so we seed MVP-25, QA that archetype in isolation, iterate,
 * and scale each independently. Renders still draw across the whole holiday.
 *
 *   node scripts/gen-holiday-archetypes.js --holiday halloween --archetype vampire --n 12 [--kind dual|single|scene|cast|all] [--dry]
 *   node scripts/gen-holiday-archetypes.js --holiday halloween --archetype all --n 12 --kind cast
 *   node scripts/gen-holiday-archetypes.js --holiday fall --pool golden_foliage --to-share --kind cast
 *   (taxonomies: scripts/lib/halloweenPools.js + fallPools.js — --pool/--to-share work for both)
 *
 * ALWAYS after: node scripts/scan-holiday-pools.js && node scripts/scan-dual-faceswap-proximity.js
 */
require('dotenv').config({ path: '.env.local' });
const Anthropic = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');
const { lintHolidayRow } = require('./lib/holidayPoolLint');
const TAXES = { halloween: require('./lib/halloweenPools'), fall: require('./lib/fallPools') };
const taxFor = (holiday) => TAXES[holiday] || null;

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
const N = arg('n', null) ? parseInt(arg('n', null), 10) : null; // null → --to-share (share − existing) or 12
const TO_SHARE = process.argv.includes('--to-share'); // top up each sub to ceil(70/subs) active rows

// Each archetype: costume/wardrobe hint (cast only) + setting hint, from the single source of truth
// per holiday (scripts/lib/halloweenPools.js / fallPools.js: pools × sub-categories, palette + signature
// objects per pool). Mediums are NOT pinned (Kevin 2026-09-04). Scenes stay pure-environment (linter §6).
const A = (castMedium, sceneMedium, costume, setting) => ({
  castMedium,
  sceneMedium,
  costume,
  setting,
});
const ARCHETYPES = Object.fromEntries(
  Object.entries(TAXES).map(([holiday, tax]) => [
    holiday,
    Object.fromEntries(
      Object.entries(tax.SUBS).map(([k, d]) => [k, A(null, null, d.costume, d.setting)])
    ),
  ])
);

function castPrompt(holiday, arch, def, n, dual) {
  const pair = dual
    ? `\n- This is a COUPLE: dress BOTH, gender-neutral OR explicitly paired ("she in…, he in…"). Keep them side by side with a CLEAR GAP between their heads — never cheek-to-cheek/embracing/leaning-in.`
    : '';
  const TAX = taxFor(holiday);
  const poolKey = TAX ? TAX.POOL_OF_SUB[arch] : null;
  const P = poolKey ? TAX.POOLS[poolKey] : null;
  const isFall = holiday === 'fall';
  const hero = holiday.toUpperCase();
  const punch = P
    ? `${hero} IS THE HERO of the frame (Kevin 2026-09-04/05). This pool is "${poolKey}" — PALETTE: ${P.palette}. Fill the setting with an ABUNDANCE of THIS pool's signature objects: ${P.objects}. Cinematic: ${
        isFall
          ? 'low golden light, mist, rain, firelight or drifting leaves where the pool calls for it'
          : 'a moon, fog, candlelight or string light where the pool calls for it'
      }.${
        P.lanterns
          ? ''
          : isFall
            ? ' NO pumpkins, NO jack-o-lanterns, NO gourds, NO costumes, NO spooky / haunted / Halloween anything — Halloween owns those (a row that mentions them is dropped). Fall = foliage, orchards, harvest, hearth, rain, flannel, cider.'
            : ' NO pumpkins, NO jack-o-lanterns, NO gourds anywhere in this pool — they belong to other pools (a row that mentions them is dropped).'
      } NEVER a plain place with a hint of ${hero.toLowerCase()}.`
    : 'MAGICAL SPOOKY-SEASON, not a stock photo — carved pumpkins, warm string lights, a harvest moon, golden-hour glow, dreamy festive wonder';
  return `Generate ${n} DISTINCT ${holiday.toUpperCase()} "${arch}" ${dual ? 'COUPLE' : 'SOLO'} scenarios for a dreamy nightly face-swap photo app. Every entry is this ONE archetype — vary the pose-free SETTING + details, not the archetype.

ARCHETYPE: ${arch}. ${isFall ? 'Wardrobe' : 'Costume'} inspiration: ${def.costume}. Setting family: ${def.setting}.

Output ONLY a JSON array of ${n} objects: {"scene":"...","attire":"..."}
- attire: 6-16 words, ${isFall ? 'REAL autumn wardrobe (cozy or chic everyday clothing: wool coats, knits, flannel, scarves, boots — NOT a costume)' : 'the costume'} as CLOTHING ONLY — NEVER a mask, hood-over-face, face paint, fangs, prosthetic, veil, or sunglasses (the swap needs a clear frontal face).${pair}
- scene: 14-26 words — HARD MAXIMUM 28 words (longer entries are discarded) — PURE ENVIRONMENT (WHERE they are + atmosphere), dense concrete nouns, no filler adjectives. NO people/pose/camera/face/eye/pronoun words — for carved pumpkins say "carved grins" or "glowing cutouts", never "faces"/"eyes" (the linter drops the row). Make every setting ${punch}. Pack the words with iconic detail.
- No children/minors. Tasteful. Vary across all ${n}.
Output ONLY the JSON array.`;
}

function scenePrompt(holiday, arch, def, n) {
  const tone =
    holiday === 'halloween'
      ? 'gothic, spooky-beautiful, awe not gore'
      : 'cozy, nostalgic, breathtakingly pretty magical fall';
  return `Generate ${n} DISTINCT rich, standalone ${holiday.toUpperCase()} "${arch}" scenes (NO people) for a dreamy nightly wallpaper — ${tone}. Every entry is this archetype's world: ${def.setting}.

Output ONLY a JSON array of ${n} objects: {"scene":"..."}
- scene: 35-60 words, a rich immersive environment, defined light, layered depth, saturated color, its own time of day + weather. NO people as the subject (tiny distant silhouettes at most). NO text/words/watermarks, NO real brand or place names. Vary across all ${n}.
Output ONLY the JSON array.`;
}

async function sonnetRows(prompt) {
  const msg = await client.messages.create({
    model: SONNET,
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  });
  let text = msg.content[0].text
    .trim()
    .replace(/^```(json)?/i, '')
    .replace(/```$/, '')
    .trim();
  try {
    return JSON.parse(text);
  } catch {
    const m = text.match(/\[[\s\S]*\]/);
    return m ? JSON.parse(m[0]) : [];
  }
}

async function seed(holiday, arch, def, table, extra, promptFor, target) {
  if (target <= 0) {
    console.log(`  ${holiday}/${arch} → ${table}: at share, nothing to seed`);
    return 0;
  }
  // Ask for at most 25 per round (a 70-row JSON overflows the reply and parses to NOTHING —
  // 2026-09-05 ghost_hunting_crew seeded 0/70 three times). Rounds scale with the target.
  const PER_ROUND = 25;
  const maxRounds = Math.ceil(target / 15) + 2;
  // Top-up loop (2026-09-04): lint-dropped rows are REPLACED (up to 3 Sonnet
  // rounds) so a pool lands at N clean rows instead of N-minus-drops; near-dupes
  // (normalized scene) across rounds are skipped.
  const rows = [];
  const seen = new Set();
  let dropped = 0;
  for (let round = 0; round < maxRounds && rows.length < target; round++) {
    const ask = Math.min(PER_ROUND, target - rows.length + 3);
    const raw = (await sonnetRows(promptFor(ask))).filter((o) => o && o.scene);
    if (!raw.length) console.warn(`   ⚠ round ${round + 1}: Sonnet returned 0 parseable rows`);
    raw.forEach((o, i) => {
      const row = { sub_theme: arch, scene: o.scene, ...extra };
      if (o.attire) row.attire = o.attire;
      const { errors, warnings } = lintHolidayRow({ ...row, table });
      warnings.forEach((w) => console.warn(`   ⚠ ${holiday}/${arch}/${table}[${i}]: ${w}`));
      if (errors.length) {
        dropped++;
        console.warn(`   ✖ drop ${holiday}/${arch}[${i}]: ${errors[0]}`);
        return;
      }
      const key = String(o.scene)
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, '')
        .trim()
        .slice(0, 60);
      if (seen.has(key)) return;
      seen.add(key);
      if (rows.length < target) rows.push(row);
    });
    if (round > 0) console.log(`   ↻ top-up round ${round + 1}: ${rows.length}/${target} clean`);
  }
  console.log(`  ${holiday}/${arch} → ${table}: ${rows.length} clean, ${dropped} dropped`);
  if (rows.length && !DRY) {
    const { error } = await sb.from(table).insert(rows);
    if (error) console.error(`   ❌ insert: ${error.message}`);
  }
  return rows.length;
}

(async () => {
  const holiday = arg('holiday', 'halloween');
  const archArg = arg('archetype', null);
  const poolArg = arg('pool', null); // a MAIN pool → all of its subs (either holiday)
  const kind = arg('kind', 'cast'); // dual | single | scene | cast(=dual+single) | all
  const set = ARCHETYPES[holiday];
  if (!set) throw new Error(`unknown holiday "${holiday}"`);
  const TAX = taxFor(holiday);
  let arches;
  if (poolArg) {
    const pools =
      poolArg === 'all' ? Object.keys(TAX.POOLS) : poolArg.split(',').map((x) => x.trim());
    arches = pools.flatMap((pk) => {
      if (!TAX.POOLS[pk]) throw new Error(`unknown pool "${pk}"`);
      return TAX.POOLS[pk].subs;
    });
  } else if (!archArg || archArg === 'all') arches = Object.keys(set);
  else arches = archArg.split(',').map((x) => x.trim());
  // Per-table target: explicit --n, else (--to-share) share − existing active rows, else 12.
  const targetFor = async (table, arch) => {
    if (N !== null) return N;
    if (!TO_SHARE) return 12;
    const pk = TAX ? TAX.POOL_OF_SUB[arch] : null;
    const share = pk ? TAX.shareFor(pk) : 12;
    const { count } = await sb
      .from(table)
      .select('id', { count: 'exact', head: true })
      .eq('pool', 'holiday')
      .eq('sub_theme', arch)
      .eq('disabled', false);
    return Math.max(0, share - (count ?? 0));
  };
  let total = 0;
  for (const arch of arches) {
    const def = set[arch];
    if (!def) {
      console.warn(`  (skip unknown archetype "${arch}")`);
      continue;
    }
    if (kind === 'dual' || kind === 'cast' || kind === 'all') {
      total += await seed(
        holiday,
        arch,
        def,
        'dual_scenarios',
        { pool: 'holiday', category: holiday }, // no medium pin (Kevin 2026-09-04)
        (n) => castPrompt(holiday, arch, def, n, true),
        await targetFor('dual_scenarios', arch)
      );
    }
    if (kind === 'single' || kind === 'cast' || kind === 'all') {
      total += await seed(
        holiday,
        arch,
        def,
        'single_scenarios',
        { pool: 'holiday', category: holiday, gender: 'any' }, // no medium pin
        (n) => castPrompt(holiday, arch, def, n, false),
        await targetFor('single_scenarios', arch)
      );
    }
    if (kind === 'scene' || kind === 'all') {
      total += await seed(
        holiday,
        arch,
        def,
        'holiday_scenes',
        { holiday }, // no medium pin (Kevin 2026-09-04)
        (n) => scenePrompt(holiday, arch, def, n),
        N ?? 12
      );
    }
  }
  console.log(
    `\n━━━ ${total} rows ${DRY ? 'generated (dry)' : 'inserted'} for ${holiday} [${arches.join(', ')}] ━━━`
  );
  if (!DRY)
    console.log(
      'NEXT: node scripts/scan-holiday-pools.js && node scripts/scan-dual-faceswap-proximity.js'
    );
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
