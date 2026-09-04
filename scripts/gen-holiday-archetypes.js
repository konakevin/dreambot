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
      'a sleek fitted all-black heist outfit, a high-neck top, a slim utility belt, black gloves',
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
      'photography',
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
      'photography',
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
      'photography',
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
      'opulent gothic evening formalwear — a sharp velvet tailcoat with a jeweled brocade waistcoat and high cravat, or a sweeping jeweled ballgown, with long satin gloves',
      'a grand candlelit gothic ballroom, dripping crystal chandeliers, tall arched windows spilling moonlight, deep-red velvet drapes, a carved staircase, jack-o-lanterns glowing along the balustrade'
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
    // ── Kevin's 2026-09-04 brainstorm (movie-VIBE inspired, IP-free; Halloween is the HERO) ──
    witch_sisters_cottage: A(null, null, 'flowing velvet witch robes in emerald, plum and rust with corseted bodices, wide-brim pointed hats tilted back off the face, tarnished silver charms', 'a candlelit crooked cottage crammed with spell books, a bubbling green cauldron, a black cat on the mantel, three broomsticks by the door, dripping candles on every surface, dried herbs and a glowing spellbook, jack-o-lanterns in every window'),
    salem_town_night: A(null, null, 'cozy wool coats, plaid scarves, knit beanies, leather boots', 'a New England town square on All Hallows Eve, a white church steeple, cobblestones lined with hundreds of glowing jack-o-lanterns, hay bales, a roaring bonfire, candy stalls under string lights, fiery maples, a huge harvest moon'),
    black_cat_alley: A(null, null, 'a long black wool coat, a striped scarf, fingerless gloves', 'a lantern-lit cobblestone alley at night with dozens of black cats perched on ledges, steps and barrels, glowing green cat-eyes in every shadow, carved pumpkins on the stoops, fog curling low'),
    afterlife_waiting_room: A(null, null, 'a black-and-white striped suit with a black tie, or a black lace dress with a wide-brim hat tilted back', 'a surreal netherworld waiting room with mint-green walls, a black-and-white striped floor, take-a-number ticket dispensers, flickering fluorescent tubes, potted dead plants, striped drapes, a sandworm desert glimpsed through the window'),
    striped_suit_haunting: A(null, null, 'a black-and-white striped suit, or a black lace gothic dress with fishnet gloves', 'a dusty attic of a haunted house with a sprawling miniature model town on a table, black-and-white striped drapes, floating candlesticks, a striped desert glowing beyond the window, cobwebs and a levitating chair'),
    halloween_town_square: A(null, null, 'a pinstriped patchwork suit, or a rag-doll patchwork dress with mismatched stitching', 'a whimsical crooked gothic town square, a spiral hill curling under an enormous full moon, pumpkin-headed scarecrows, a fountain of glowing green water, crooked spires, singing jack-o-lanterns lining the walls, bats across the sky'),
    pumpkin_king_patch: A(null, null, 'a corduroy jacket, a knit scarf, a wool blanket over the shoulders', 'a vast night pumpkin patch under a giant amber moon, a single lantern on a plaid blanket, rows of pumpkins fading into mist, one colossal pumpkin looming at the far end, fireflies, a weathered fence'),
    suburban_halloween_chaos: A(null, null, 'a puffer vest over plaid flannel, a knit beanie, sneakers', 'a suburban cul-de-sac on Halloween night, toilet paper streaming from the trees, an egged mailbox, a bicycle with a basket of candy, inflatable ghosts, foam tombstones, glowing porch pumpkins on every house, porch lights blazing'),
    haunted_house_attraction: A(null, null, 'a denim jacket, a graphic tee, a canvas bag of candy', 'the entrance of a suburban haunted-house attraction at night, strobe lights flashing through fog, a ticket booth draped in cobwebs, animatronic ghouls in the doorway, a hearse parked on the lawn, orange and purple floodlights'),
    corn_maze_torchlight: A(null, null, 'flannel, a chunky knit scarf, a denim jacket, a slouchy beanie', 'a night corn maze lit by torches, towering dry cornstalks, scarecrows on posts, a hay-bale tower, lanterns marking the path, a rising harvest moon, mist between the rows'),
    friendly_ghost_manor: A(null, null, 'a cozy cardigan and jeans, or a soft plaid dress with a cardigan', 'a grand haunted manor foyer with playful translucent ghosts drifting up the staircase, floating candlesticks, a swaying chandelier, sheet-ghost shapes peeking from doorways, dusty gilt portraits, moonlight through tall windows'),
    macabre_family_mansion: A(null, null, 'a black pinstripe suit with a red boutonniere, or a floor-length black velvet gown with sheer sleeves', 'a gothic mansion foyer in black velvet and dark wood, a carnivorous plant in a brass pot, a grand staircase, candelabra dripping wax, a suit of armor, cobwebbed chandeliers, a raven on the banister'),
    graveyard_picnic: A(null, null, 'a black velvet blazer over a crisp shirt, or a black lace midi dress with a cardigan', 'a moonlit graveyard picnic with a checkered blanket spread between mossy tombstones, a candelabra on a crypt, a wicker basket and wine, ankle-high fog, a raven on a headstone, jack-o-lanterns on the graves'),
    witchy_victorian_house: A(null, null, 'a long flowing bohemian dress with a shawl, or a linen shirt with a wool vest', 'a Victorian witch house kitchen with herbs hanging from the beams, a spellbook open on the counter, midnight cocktails on a copper tray, a moonlit conservatory of belladonna and nightshade, candles in every window'),
    undead_wedding: A(null, null, 'a tattered ivory wedding gown with a crown of dead roses, and a faded black tailcoat with a wilted boutonniere', 'a blue-lit crypt chapel wedding with a skeletal band on the altar steps, black roses down the aisle, a thousand candles, cobwebbed pews, a moon through a broken rose window'),
    headless_hollow_bridge: A(null, null, 'a long wool riding coat, a waistcoat, tall boots', 'an autumn covered bridge in thick fog, a jack-o-lantern glowing on the railing, a distant headless rider silhouette on the far bank, twisted trees, a blood-orange moon, fallen leaves on the planks'),
    haunted_amusement_park: A(null, null, 'a turtleneck and corduroy, an ascot, a groovy seventies jacket', 'an abandoned carnival at night with a dead Ferris wheel, a funhouse of cracked mirrors, a sheet-ghost fleeing between booths, a flower-painted van parked by the gate, flashlight beams in fog, popcorn stands glowing'),
    skeleton_dance_hall: A(null, null, 'a vintage tuxedo with tails, or a flapper-style fringe dress', 'a grand dance hall full of dancing skeletons, a bone xylophone band on stage, jack-o-lantern stage lights, a mirrored ball, cobwebbed balconies, purple and orange spotlights'),
    pumpkin_spice_cafe: A(null, null, 'an oversized knit sweater, a scarf, a beanie', 'a cozy Halloween cafe with pumpkin displays on every shelf, spider-web latte art on the counter, black-cat cookies in the case, string lights, a wreath of autumn leaves, fogged windows, a glowing pumpkin in the doorway'),
    jack_o_lantern_overload: A(null, null, 'a cozy flannel, a puffer vest, a knit scarf', 'a suburban front yard buried under hundreds of glowing carved jack-o-lanterns, pumpkins stacked up the porch steps and along the roofline, on every windowsill and fence post, a pumpkin-filled wheelbarrow, orange glow everywhere'),
    candy_store_frenzy: A(null, null, 'a colorful cardigan over a striped tee, or a polka-dot dress', 'a Halloween candy shop with floor-to-ceiling jars of candy, a giant candy bowl on the counter, candy-corn garlands, glowing pumpkins in the window, string lights, a gumball machine'),
    werewolf_moon_forest: A(null, null, 'a torn plaid shirt with rolled sleeves, jeans, hiking boots', 'a moonlit pine forest under a silver full moon, howling wolf silhouettes on a distant ridge, fog on the forest floor, twisted branches, a lantern-lit trail'),
    monster_garage_band: A(null, null, 'a leather jacket with band patches, a striped tee, ripped jeans', 'a suburban garage band rehearsal with a mummy on drums, a swamp creature on bass, a witch on keys, amps stacked high, a jack-o-lantern drum kit, string lights, cobwebbed rafters'),
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
      ? 'DRAMATIC + UNMISTAKABLY HALLOWEEN, and HALLOWEEN IS THE HERO of the frame (Kevin 2026-09-04): ABUNDANCE — dozens or hundreds of glowing jack-o-lanterns, decorations on every surface, a huge moon, candlelight, fog, rich crimson/violet/emerald, cinematic wow; NEVER a plain place with a hint of Halloween'
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
  // Top-up loop (2026-09-04): lint-dropped rows are REPLACED (up to 3 Sonnet
  // rounds) so a pool lands at N clean rows instead of N-minus-drops; near-dupes
  // (normalized scene) across rounds are skipped.
  const rows = [];
  const seen = new Set();
  let dropped = 0;
  for (let round = 0; round < 3 && rows.length < N; round++) {
    const raw = (await sonnetRows(prompt)).filter((o) => o && o.scene);
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
      const key = String(o.scene).toLowerCase().replace(/[^a-z0-9 ]/g, '').trim().slice(0, 60);
      if (seen.has(key)) return;
      seen.add(key);
      if (rows.length < N) rows.push(row);
    });
    if (round > 0) console.log(`   ↻ top-up round ${round + 1}: ${rows.length}/${N} clean`);
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
        { pool: 'holiday', category: holiday }, // no medium pin (Kevin 2026-09-04)
        castPrompt(holiday, arch, def, N, true)
      );
    }
    if (kind === 'single' || kind === 'cast' || kind === 'all') {
      total += await seed(
        holiday,
        arch,
        def,
        'single_scenarios',
        { pool: 'holiday', category: holiday, gender: 'any' }, // no medium pin
        castPrompt(holiday, arch, def, N, false)
      );
    }
    if (kind === 'scene' || kind === 'all') {
      total += await seed(
        holiday,
        arch,
        def,
        'holiday_scenes',
        { holiday }, // no medium pin (Kevin 2026-09-04)
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
