#!/usr/bin/env node
/**
 * YumBot scale SCENES — PRODUCTION 300 backfill (2026-06-07).
 *
 * One Sonnet call per sub-theme — only way to guarantee EQUAL SHARE per
 * sub-theme after cross-batch dedup. Each call uses append:true and a
 * target sized to add (per-sub-theme-target − existing-with-tag) entries.
 *
 * Idempotent — re-runs after partial completion just fill the remaining
 * gap per sub-theme.
 */
const fs = require('fs');
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const OUT_PATH = 'scripts/bots/yumbot/seeds/yumbot_scale_scenes.json';
const PER_SUBTHEME = 50;

const SUB_THEMES = [
  {
    tag: 'giant-real-world',
    blurb: `Colossal kawaii food TOWERING over a real-world city / landmark — skyscraper-sized donut over Manhattan / Statue-of-Liberty-sized macaron / Eiffel-Tower-sized éclair / Tokyo-Shibuya-crossing kaiju cupcake / Mt-Fuji-sized rice ball / Pyramid-cake at Giza / Big-Ben-tall croissant / Sydney-Opera-House cake / Christ-the-Redeemer cookie / Burj-Khalifa lollipop / Golden-Gate-bridge donut / Sphinx-cake / Acropolis-pastry / Taj-Mahal mochi / Petronas-Towers croissant / Hollywood-sign cookie. Vary the city and landmark widely — cover all the world's iconic skylines.`,
    example:
      '{ "tags": ["giant-real-world"], "description": "Colossal kawaii sprinkle donut the size of a skyscraper looming over Manhattan\'s Times Square at dusk, smiling glaze-eyes blinking down at tiny pedestrians, wide low-angle hero framing" }',
  },
  {
    tag: 'microscopic',
    blurb: `A single sprinkle / crumb / sugar-grain IS the world, ant-scale perspective with kawaii food the size of mountains relative to a tiny figure. Sprinkle-rocks / sugar-grain landscape / breadcrumb cliffs / pollen-dust valleys / single-droplet ocean / pepper-grain mesas / cinnamon-shake dunes / cocoa-powder savanna / salt-crystal glaciers / poppy-seed boulders / sesame-seed plains / chocolate-shaving forests / cake-crumb canyons / nutmeg-dust deserts.`,
    example:
      '{ "tags": ["microscopic"], "description": "Single kawaii rainbow sprinkle the size of a mountain seen from ant-perspective on a vast tabletop landscape of crystalline sugar-grain dunes, low hero-up framing emphasizing scale" }',
  },
  {
    tag: 'food-island',
    blurb: `An entire island MADE OF FOOD (cake mountains, frosting beaches, candy reefs, kawaii food-civilians as inhabitants). Vary tropical / arctic / volcanic / desert / archipelago / atoll / glacier / mangrove / fjord / coral-atoll / iceberg / lagoon variants. Tropical cake-island with marshmallow-palm trees / Arctic cake-island with sugar-glacier / Volcanic cake-island with lava-frosting eruption / Desert cookie-mesa island / Archipelago of mini-cupcake-islands / etc.`,
    example:
      '{ "tags": ["food-island"], "description": "Entire kawaii cake-island rising from frosting waves with sponge cliffs and gumdrop trees, a tiny kawaii cookie-civilian waving from the beach, sweeping epic wide composition" }',
  },
  {
    tag: 'chocolate-river',
    blurb: `Willy-Wonka-style chocolate stream with marshmallow boats / sugar-cane forest / lollipop trees / candy-cane bridges (kawaii food crew traveling along it). Vary river-rapids / glassy-calm / lazy-bend / waterfall / delta / underground-cave / mountain-source / oxbow / canyon-river / source-spring / estuary variants. Different chocolate-river crews: marshmallow paddleboats / sugar-cane rafts / lollipop canoes / candy-cane kayaks / wafer-board surfers / etc.`,
    example:
      '{ "tags": ["chocolate-river"], "description": "Kawaii marshmallow-boat with smiling pink face floating down a glossy chocolate river through a candy-cane forest, lollipop trees lining the banks, wide tracking composition" }',
  },
  {
    tag: 'underwater',
    blurb: `Kawaii pastries / cakes / desserts as undersea creatures — coral reefs of frosting, kelp of cotton-candy, mermaid-food, jellyfish-jellies. Vary shallow-tide-pool / coral-reef / deep-trench / kelp-forest / abyss / sea-cave / sunken-ship / mangrove-roots / shipwreck-coral / hydrothermal-vent / ice-shelf-undersea / arctic-undersea / coral-atoll / brain-coral-frosting / sea-fan-spun-sugar variants. Cupcake-jellyfish / pastry-octopus / cake-coral / cookie-clams / mochi-anemones / donut-rings as sea-rings / etc.`,
    example:
      '{ "tags": ["underwater"], "description": "Kawaii cupcake-jellyfish with smiling frosting-eyes drifting through a coral reef of frosting-arms and gumdrop-sea-urchins under shafts of soft underwater light, side-on framing" }',
  },
  {
    tag: 'food-in-space',
    blurb: `Kawaii food in deep space — planet-cakes orbiting a sun-cookie / asteroid-cookies / cosmic-donut / nebula-cotton-candy / rocket-ice-cream-cone. Vary nebula / asteroid-belt / lunar-surface / saturn-rings / black-hole / galaxy-spiral / pulsar-quasar / star-cluster / wormhole / planet-rise / eclipse / solar-flare / comet-tail / cosmic-collision / dark-matter / nova / supernova variants. Different cosmic kawaii foods: planet-macarons / nebula-cotton-candy clouds / black-hole donut / sun-cookie corona / saturn-ring cake-tiers / rocket-popsicle / etc.`,
    example:
      '{ "tags": ["food-in-space"], "description": "Kawaii planet-cookie with crater-blush orbiting a sun-cake in a candy-rainbow nebula, comet-cupcakes streaking past, wide epic cosmic composition" }',
  },
];

function countByTag(pool) {
  const counts = {};
  for (const e of pool) for (const t of (e.tags || [])) counts[t] = (counts[t] || 0) + 1;
  return counts;
}

async function main() {
  for (const { tag, blurb, example } of SUB_THEMES) {
    const existingPool = JSON.parse(fs.readFileSync(OUT_PATH, 'utf8'));
    const counts = countByTag(existingPool);
    const existingForTag = counts[tag] || 0;
    const needed = PER_SUBTHEME - existingForTag;

    console.log(
      `\n━━━━━ Sub-theme: ${tag} — existing ${existingForTag}/${PER_SUBTHEME}, need ${Math.max(0, needed)} more ━━━━━`
    );

    if (needed <= 0) {
      console.log(`  ✓ Already at target, skipping`);
      continue;
    }

    // Target tells generatePool to grow the overall pool by `needed` entries
    // (because append:true preserves existing, and Sonnet only outputs this
    // sub-theme's entries, so adds will all be tagged ${tag}).
    const target = existingPool.length + needed;

    await generatePool({
      outPath: OUT_PATH,
      append: true,
      total: target,
      batch: Math.min(needed, 50),
      metaPrompt: (
        n
      ) => `You are writing ${n} KAWAII-FOOD SCALE-TWIST SCENES for YumBot's "${tag}" sub-theme. EVERY entry in this call MUST be tagged ["${tag}"] — do not mix sub-themes.

━━━ THE SUB-THEME — ${tag} ━━━

${blurb}

━━━ THE BAR — every entry must produce ━━━

- One specific kawaii food subject with kawaii face features (smiling eyes / dot-blush / mouth implied on the food itself).
- The scale / setting twist reads instantly — anchor a load-bearing element from the sub-theme blurb above.
- A light composition hint (low hero-up / wide epic / overhead aerial / ant-ground-up / side-tracking / etc.).
- Self-contained — readable as a scene without relying on other axes (camera / lighting / palette etc. come from separate pools).
- DIVERSE within the sub-theme — do NOT repeat the same kawaii-subject + setting combo. Use the blurb's variant hints to spread the ${n} entries widely.

━━━ ENTRY SHAPE — STRUCTURED OBJECT (NON-NEGOTIABLE) ━━━

Each entry is a JSON object with exactly TWO fields:
{
  "tags": ["${tag}"],
  "description": "<the scene, 25-40 words>"
}

━━━ EXAMPLE ━━━

${example}

━━━ HARD MANDATES ━━━

- EVERY entry tagged ["${tag}"]. NO other tags. NO untagged entries.
- EVERY entry has the kawaii subject WITH kawaii face features.
- The scale / setting twist reads instantly — anchor a sub-theme element.
- Each "description" is 25-40 words.

━━━ HARD BANS ━━━

- NO photo-realistic register ("photograph" / "DSLR" / "f/2.8").
- NO mood/lighting/palette words inside the description.
- NO sub-theme blending — pure "${tag}" only.
- NO human-character cast.
- NO repeating exact subject+setting combos from prior entries — pull from the blurb variants and stretch the semantic range.

━━━ OUTPUT ━━━

A JSON array of structured objects. No preamble. No numbering. Plain JSON array only.`,
    });

    const post = JSON.parse(fs.readFileSync(OUT_PATH, 'utf8'));
    const postCounts = countByTag(post);
    console.log(`  ✅ sub-theme "${tag}" now at ${postCounts[tag] || 0}/${PER_SUBTHEME}`);
  }

  // Final tally
  const data = JSON.parse(fs.readFileSync(OUT_PATH, 'utf8'));
  const counts = countByTag(data);
  console.log('\n━━━ FINAL TALLY ━━━');
  console.log('total:', data.length);
  console.log('distribution:', JSON.stringify(counts, null, 2));
  const minCount = Math.min(...Object.values(counts));
  const maxCount = Math.max(...Object.values(counts));
  console.log(
    `min/max sub-theme: ${minCount}/${maxCount} — ${minCount >= PER_SUBTHEME ? 'OK ✅' : 'SHORT ❌'}`
  );
}

main().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
