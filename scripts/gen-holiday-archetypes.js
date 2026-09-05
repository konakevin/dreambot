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
 *
 * ALWAYS after: node scripts/scan-holiday-pools.js && node scripts/scan-dual-faceswap-proximity.js
 */
require('dotenv').config({ path: '.env.local' });
const Anthropic = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');
const { lintHolidayRow } = require('./lib/holidayPoolLint');
const TAX = require('./lib/halloweenPools');

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

// Each archetype: its tuned face-swap medium (cast) + scene-eligible medium (scene),
// a costume hint (cast only), and a setting hint. Halloween → vibrant painterly-gothic;
// Fall → warm painterly. Scenes must stay pure-environment (the linter enforces §6).
const A = (castMedium, sceneMedium, costume, setting) => ({
  castMedium,
  sceneMedium,
  costume,
  setting,
});
const ARCHETYPES = {
  // HALLOWEEN defs come from the single source of truth (scripts/lib/halloweenPools.js):
  // 14 pools × sub-categories, palette + signature objects per pool (Kevin 2026-09-05).
  halloween: Object.fromEntries(
    Object.entries(TAX.SUBS).map(([k, d]) => [k, A(null, null, d.costume, d.setting)])
  ),
  fall: {
    corn_maze: A(
      'canvas',
      'canvas',
      'cozy flannel, a chunky knit scarf, a denim jacket, a slouchy beanie',
      'a golden corn maze at dusk, towering dry cornstalks, warm string lights, a hay-bale archway, glowing jack-o-lanterns, a rising harvest moon'
    ),
    pumpkin_farm: A(
      'heirloom',
      'heirloom',
      'a plaid flannel, a quilted vest, a wide-brim felt hat, work gloves',
      'a rustic pumpkin farm at golden hour, a wooden wagon heaped with pumpkins, a faded red barn, hay bales, spent sunflowers, rolling orange hills'
    ),
    apple_orchard: A(
      'canvas',
      'canvas',
      'a soft knit sweater, a light autumn coat, a woven harvest basket',
      'a sun-warmed apple orchard, boughs heavy with red apples, wooden ladders, crates of fruit, dappled golden light, a rustic cider stand'
    ),
    maple_grove: A(
      'canvas',
      'canvas',
      'an oversized cozy cardigan, a soft scarf, an autumn-toned wool coat',
      'a breathtaking grove of fiery red, orange, and gold maple trees, a leaf-strewn trail, warm low sunbeams, a rustic split-rail fence, a covered bridge'
    ),
    cabin_porch: A(
      'heirloom',
      'heirloom',
      'a chunky wool sweater, a plaid blanket around the shoulders, wool socks',
      'a rustic cabin porch in the woods at dusk, a glowing lantern, a carved pumpkin, an autumn wreath, a forest of fiery foliage, soft woodsmoke'
    ),
    bonfire: A(
      'canvas',
      'canvas',
      'a warm denim jacket, a cozy oversized scarf, a knit beanie',
      'a crackling autumn bonfire in an open field at night, sparks rising toward the stars, hay bales, warm string lights, a harvest moon'
    ),
    trick_or_treat: A(
      'canvas',
      'canvas',
      'a cozy hooded coat (hood down), a warm scarf, mittens',
      'a classic tree-lined neighborhood street at twilight, jack-o-lanterns glowing on every porch, warm-lit windows, drifting leaves, a big low harvest moon'
    ),
    hayride: A(
      'heirloom',
      'heirloom',
      'a flannel shirt, a corduroy jacket, a cozy scarf',
      'a golden-hour hayride through a harvest farm, a wagon of pumpkins and hay, rolling amber fields, a weathered fence, a low warm sun'
    ),
    // moved from halloween 2026-09-05 (autumn, not Halloween):
    canyon_fall_hike: A(
      'photography',
      'canvas',
      'cozy hiking layers, flannel, a light pack',
      'a canyon trail ablaze with red, orange, and gold autumn trees, a winding leaf-strewn path, warm low sun, distant glowing ridges, a river below'
    ),
    autumn_fae: A(
      'painted_gothic_fantasy',
      'illustration',
      'a gown of deep-plum and black petals, gossamer dark wings, a thorn-and-berry crown resting back off the brow',
      'a moonlit haunted rose garden, black roses, a cracked fountain, glowing fireflies, jack-o-lanterns'
    ),
    harvest_royalty: A(
      'gothic_painted',
      'canvas',
      'a regal cloak-gown of amber, russet, and gold autumn-leaf brocade, a crown of gilded oak leaves, topaz jewels',
      'a candlelit harvest banquet hall, gourds and grapes, iron chandeliers of dripping candles, a roaring hearth'
    ),
  },
};

function castPrompt(holiday, arch, def, n, dual) {
  const pair = dual
    ? `\n- This is a COUPLE: dress BOTH, gender-neutral OR explicitly paired ("she in…, he in…"). Keep them side by side with a CLEAR GAP between their heads — never cheek-to-cheek/embracing/leaning-in.`
    : '';
  const poolKey = holiday === 'halloween' ? TAX.POOL_OF_SUB[arch] : null;
  const P = poolKey ? TAX.POOLS[poolKey] : null;
  const punch = P
    ? `HALLOWEEN IS THE HERO of the frame (Kevin 2026-09-04/05). This pool is "${poolKey}" — PALETTE: ${P.palette}. Fill the setting with an ABUNDANCE of THIS pool's signature objects: ${P.objects}. Cinematic: a moon, fog, candlelight or string light where the pool calls for it.${
        P.lanterns
          ? ''
          : ' NO pumpkins, NO jack-o-lanterns, NO gourds anywhere in this pool — they belong to other pools (a row that mentions them is dropped).'
      } NEVER a plain place with a hint of Halloween.`
    : 'MAGICAL SPOOKY-SEASON, not a stock photo — carved pumpkins, warm string lights, a harvest moon, golden-hour glow, dreamy festive wonder';
  return `Generate ${n} DISTINCT ${holiday.toUpperCase()} "${arch}" ${dual ? 'COUPLE' : 'SOLO'} scenarios for a dreamy nightly face-swap photo app. Every entry is this ONE archetype — vary the pose-free SETTING + details, not the archetype.

ARCHETYPE: ${arch}. Costume inspiration: ${def.costume}. Setting family: ${def.setting}.

Output ONLY a JSON array of ${n} objects: {"scene":"...","attire":"..."}
- attire: 6-16 words, the costume as CLOTHING ONLY — NEVER a mask, hood-over-face, face paint, fangs, prosthetic, veil, or sunglasses (the swap needs a clear frontal face).${pair}
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
  const poolArg = arg('pool', null); // a MAIN pool → all of its subs (halloween only)
  const kind = arg('kind', 'cast'); // dual | single | scene | cast(=dual+single) | all
  const set = ARCHETYPES[holiday];
  if (!set) throw new Error(`unknown holiday "${holiday}"`);
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
    const pk = TAX.POOL_OF_SUB[arch];
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
