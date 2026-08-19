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
const N = parseInt(arg('n', '12'), 10);

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
  halloween: {
    vampire: A(
      'gothic_painted',
      'illustration',
      'a floor-length opera cape with a high collar, crimson-and-black brocade, sharp Victorian formalwear',
      'a candlelit gothic ballroom or moonlit castle courtyard, dripping candelabra, a huge full moon, jack-o-lanterns'
    ),
    witch: A(
      'painted_gothic_fantasy',
      'illustration',
      'flowing purple-and-black witch robes with wide sleeves, a wide-brim pointed hat tilted back off the face, silver star jewelry',
      'an enchanted cottage with a glowing green cauldron, floating candles, a black cat, jack-o-lanterns'
    ),
    monster_hunter: A(
      'gothic_oil_garden',
      'canvas',
      'a long weathered leather coat, buckled waistcoat, a crossbow strap, tall travel boots',
      'a fog-drowned cobblestone village square at midnight, guttering lanterns, bats, a full moon'
    ),
    reaper: A(
      'vampire_portrait',
      'illustration',
      'an ornate flowing black robe with silver-embroidered hem, hood DOWN off the face, a tall scythe',
      'a windswept moonlit cliff cemetery, rolling mist, a lone dead tree, ravens, a blood-orange harvest moon'
    ),
    ghost_glam: A(
      'painted_gothic_fantasy',
      'canvas',
      'a tattered gossamer white-grey gown trailing into mist, pale ribbons, a dulled silver locket',
      'a moonlit fog-drenched graveyard, leaning headstones, a wrought-iron gate, drifting will-o-wisps'
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
    cat_burglar: A(
      'vampire_portrait',
      'illustration',
      'a sleek matte-black catsuit, a slim belt, a soft cat-ear headband, elbow-length gloves',
      'a moonlit city rooftop, a glowing skylight, bats wheeling past a huge low harvest moon, string-lit water towers'
    ),
    mad_scientist: A(
      'gothic_painted',
      'illustration',
      'a slightly-too-big white lab coat over a rumpled shirt and skinny tie, rubber gloves, brass goggles pushed up onto the forehead',
      'a retro laboratory crackling with Tesla coils, bubbling green-and-violet beakers, jars of glowing goo, a chalkboard'
    ),
    // ── additive scene-forward categories (2026-08-19, Kevin) ──────────────────
    trick_or_treating: A(
      'photography',
      'photography',
      'cozy hooded coats (hoods down), warm scarves, candy pails',
      'a decorated neighborhood street at dusk, glowing jack-o-lanterns on every porch, warm-lit windows, orange string lights, drifting leaves, a low harvest moon'
    ),
    halloween_party: A(
      'photography',
      'canvas',
      'festive party outfits with playful light costume accents, cozy layers',
      'a lively home Halloween party at night, orange-and-purple string lights, carved pumpkins, cobweb garlands, warm candlelit glow, a decorated mantel'
    ),
    decorated_neighborhood: A(
      'photography',
      'photography',
      'cozy autumn coats and scarves',
      'a cute suburban street draped in playful Halloween decor, inflatable ghosts, posed skeletons, glowing pumpkins, string lights, fiery trees at dusk'
    ),
    pumpkin_carving: A(
      'heirloom',
      'heirloom',
      'cozy sweaters and aprons',
      'a candlelit rustic porch strewn with carved pumpkins, scattered seeds, glowing lanterns, an autumn wreath, warm amber light, fiery foliage'
    ),
    fall_festival: A(
      'canvas',
      'canvas',
      'cozy flannel, scarves, beanies',
      'a festive fall harvest festival at dusk, a mountain of pumpkins, hay bales, warm string lights, game booths, a glowing ferris wheel, a harvest moon'
    ),
    haunted_hayride: A(
      'heirloom',
      'heirloom',
      'flannel, corduroy, a cozy blanket over the shoulders',
      'a lantern-lit wagon hayride through a misty farm at night, towering cornstalks, glowing jack-o-lanterns along the trail, a huge harvest moon'
    ),
    cozy_porch: A(
      'photography',
      'heirloom',
      'chunky knit sweaters, a plaid blanket',
      'a beautiful porch framed by fiery Halloween-colored trees and bushes, carved pumpkins on the steps, an autumn wreath, warm lantern light at golden hour'
    ),
    canyon_fall_hike: A(
      'photography',
      'canvas',
      'cozy hiking layers, flannel, a light pack',
      'a canyon trail ablaze with red, orange, and gold autumn trees, a winding leaf-strewn path, warm low sun, distant glowing ridges, a river below'
    ),
    movie_night: A(
      'heirloom',
      'heirloom',
      'cozy pajamas and oversized sweaters, a blanket',
      'a cozy living room decked for Halloween, glowing jack-o-lanterns, cobweb garlands, a candy bowl, warm firelight, a soft spooky glow, a black cat'
    ),
    enchanted_pumpkin_patch: A(
      'canvas',
      'canvas',
      'cozy fall coats and scarves',
      'a magical night pumpkin patch, hundreds of glowing carved jack-o-lanterns, drifting paper lanterns, fireflies, silver mist, a huge harvest moon'
    ),
    haunted_mansion: A(
      'gothic_painted',
      'illustration',
      'elegant gothic attire or cozy fall coats',
      'a towering haunted Victorian mansion under a full moon, jack-o-lanterns strewn across the overgrown yard, black cats, wheeling bats, a wrought-iron gate, drifting fog'
    ),
    jack_o_lantern_festival: A(
      'gothic_painted',
      'illustration',
      'cozy fall or light gothic attire',
      'a hillside sea of thousands of glowing carved jack-o-lanterns at night, lantern-lit winding paths, warm orange glow, drifting embers, a huge harvest moon'
    ),
    gothic_masquerade_ball: A(
      'painted_gothic_fantasy',
      'illustration',
      'opulent masquerade ballgown and tux, ornate feathered masks HELD in hand (never worn), long gloves',
      'a grand candlelit gothic ballroom, dripping crystal chandeliers, tall arched windows spilling moonlight, deep-red velvet drapes, a carved staircase'
    ),
    midnight_carriage: A(
      'gothic_oil_garden',
      'illustration',
      'elegant gothic formalwear, flowing cloaks',
      'a black horse-drawn carriage on a foggy cobblestone road, gothic wrought-iron lanterns, bare twisted trees, drifting mist, a huge full moon overhead'
    ),
    gothic_glam_editorial: A(
      'glamour',
      'illustration',
      'haute-couture gothic gowns and sharp suits, dramatic black-and-crimson, opulent jewels',
      'a hyper-stylized saturated gothic-glam editorial set, dramatic spotlights, black orchids and roses, deep jewel-toned drapes, opulent maximalist décor'
    ),
    gothic_greenhouse: A(
      'gothic_oil_garden',
      'canvas',
      'elegant gothic attire, velvet and lace',
      'an overgrown moonlit gothic conservatory, black roses, hanging lanterns, cracked glass panes, tangled ivy, jewel-toned light, a mossy stone fountain'
    ),
  },
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
  },
};

function castPrompt(holiday, arch, def, n, dual) {
  const pair = dual
    ? `\n- This is a COUPLE: dress BOTH, gender-neutral OR explicitly paired ("she in…, he in…"). Keep them side by side with a CLEAR GAP between their heads — never cheek-to-cheek/embracing/leaning-in.`
    : '';
  const punch =
    holiday === 'halloween'
      ? 'DRAMATIC + UNMISTAKABLY HALLOWEEN — glowing jack-o-lanterns, a huge moon, candlelight, fog, rich crimson/violet/emerald, cinematic wow'
      : 'MAGICAL SPOOKY-SEASON, not a stock photo — carved pumpkins, warm string lights, a harvest moon, golden-hour glow, dreamy festive wonder';
  return `Generate ${n} DISTINCT ${holiday.toUpperCase()} "${arch}" ${dual ? 'COUPLE' : 'SOLO'} scenarios for a dreamy nightly face-swap photo app. Every entry is this ONE archetype — vary the pose-free SETTING + details, not the archetype.

ARCHETYPE: ${arch}. Costume inspiration: ${def.costume}. Setting family: ${def.setting}.

Output ONLY a JSON array of ${n} objects: {"scene":"...","attire":"..."}
- attire: 6-16 words, the costume as CLOTHING ONLY — NEVER a mask, hood-over-face, face paint, fangs, prosthetic, veil, or sunglasses (the swap needs a clear frontal face).${pair}
- scene: 12-26 words, PURE ENVIRONMENT (WHERE they are + atmosphere). NO people/pose/camera/face/eye/pronoun words. Make every setting ${punch}. Pack the words with iconic detail.
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
    max_tokens: 3000,
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

async function seed(holiday, arch, def, table, extra, prompt) {
  const raw = (await sonnetRows(prompt)).filter((o) => o && o.scene);
  const rows = [];
  let dropped = 0;
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
    rows.push(row);
  });
  console.log(`  ${holiday}/${arch} → ${table}: ${rows.length} clean, ${dropped} dropped`);
  if (rows.length && !DRY) {
    const { error } = await sb.from(table).insert(rows);
    if (error) console.error(`   ❌ insert: ${error.message}`);
  }
  return rows.length;
}

(async () => {
  const holiday = arg('holiday', 'halloween');
  const archArg = arg('archetype', 'all');
  const kind = arg('kind', 'cast'); // dual | single | scene | cast(=dual+single) | all
  const set = ARCHETYPES[holiday];
  if (!set) throw new Error(`unknown holiday "${holiday}"`);
  const arches = archArg === 'all' ? Object.keys(set) : archArg.split(',').map((s) => s.trim());
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
        { pool: 'holiday', category: holiday, medium_key: def.castMedium },
        castPrompt(holiday, arch, def, N, true)
      );
    }
    if (kind === 'single' || kind === 'cast' || kind === 'all') {
      total += await seed(
        holiday,
        arch,
        def,
        'single_scenarios',
        { pool: 'holiday', category: holiday, gender: 'any', medium_key: def.castMedium },
        castPrompt(holiday, arch, def, N, false)
      );
    }
    if (kind === 'scene' || kind === 'all') {
      total += await seed(
        holiday,
        arch,
        def,
        'holiday_scenes',
        { holiday, medium_key: def.sceneMedium },
        scenePrompt(holiday, arch, def, N)
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
