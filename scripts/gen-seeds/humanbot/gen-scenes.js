#!/usr/bin/env node
/**
 * Generate HumanBot scene pool — 400 locations from literally anywhere on Earth.
 * Nature, urban, indoor, weird, mundane, iconic, forgotten.
 *
 * Usage:
 *   node scripts/gen-seeds/humanbot/gen-scenes.js
 *   node scripts/gen-seeds/humanbot/gen-scenes.js --dry-run
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
    name: 'nature_epic',
    label: 'Epic Natural Landscapes',
    desc: 'Grand painterly nature — mountains, glaciers, canyons, volcanoes, waterfalls, deserts, aurora, ocean cliffs, rainforests. Specific real locations (Dolomites, Wadi Rum, Ha Long Bay). Dramatic golden/blue-hour lighting. Every scene should look stunning as a watercolor illustration.',
    count: 50,
  },
  {
    name: 'nature_quiet',
    label: 'Quiet & Intimate Nature',
    desc: 'Gentle storybook nature — misty meadows, creeks, tide pools, moss-covered logs, single trees in fields, rain on a pond, fog in a valley, snow on a stone wall, wildflower patches, dew on a spiderweb. Small, peaceful, illustrated-book feel.',
    count: 50,
  },
  {
    name: 'oceans_coasts',
    label: 'Oceans, Coasts & Water',
    desc: 'Painterly water scenes from around the world — Greek island coves, Norwegian fjords, coral reefs, rocky lighthouses, tropical lagoons, misty harbors, fishing villages, sea caves, tidal pools, dramatic cliff edges over crashing waves. Beautiful in watercolor.',
    count: 50,
  },
  {
    name: 'atmospheric_urban',
    label: 'Atmospheric & Picturesque Cities',
    desc: 'Only cities that look BEAUTIFUL painted — rain-slicked cobblestone streets, Venice canals at dusk, Kyoto lantern-lit alleys, Havana pastel facades, Santorini blue domes, Edinburgh old town in fog, Marrakech riads, Parisian cafe corners. Must feel like a travel watercolor, not a photo. NO fluorescent lights, no concrete, no modern office buildings.',
    count: 50,
  },
  {
    name: 'cultural_historic',
    label: 'Historic & Cultural Landmarks',
    desc: 'Places with beauty and weight — ancient ruins overgrown with vines, candlelit cathedral interiors, Japanese temple gardens, old library reading rooms, Moroccan tile courtyards, stone bridges over rivers, monastery cloisters, Roman amphitheaters at golden hour, lighthouse cliffs. Timeless, painterly.',
    count: 50,
  },
  {
    name: 'seasons_weather',
    label: 'Seasons & Weather Moments',
    desc: 'Atmospheric weather and seasonal scenes — cherry blossom storm, autumn leaves swirling on a path, first snow on a village, thunderstorm over wheat fields, fog rolling through a valley, rainbow over a waterfall, frost on a window, summer rain on a garden, winter sunset on a frozen lake. Storybook weather.',
    count: 50,
  },
  {
    name: 'whimsical_charming',
    label: 'Whimsical & Charming Spots',
    desc: 'Places that feel like illustrations already — covered bridges, winding garden paths, old bookshop windows, flower markets, stone cottages with smoke rising, windmills in tulip fields, vineyard hillsides, mountain chalets, rowboats on still lakes, lantern-lit pathways, fairy-tale villages. Retro, warm, storybook.',
    count: 50,
  },
  {
    name: 'golden_hour_travel',
    label: 'Golden Hour Travel Scenes',
    desc: 'Beautiful real-world places at their most painterly moment — Bagan temples at sunrise, Cinque Terre at sunset, Scottish highlands at golden hour, Sahara dunes at dawn, Angkor Wat reflected in water, Swiss Alps with wildflowers, Greek fishing boats at dusk, Machu Picchu in morning mist. Travel poster energy meets watercolor illustration.',
    count: 50,
  },
];

const SYSTEM = `You are generating BACKDROP LOCATIONS for a retro watercolor illustration of a tin toy robot. The aesthetic is CLASSIC STORYBOOK — every scene must look beautiful, painterly, and illustrated. Think children's book art, vintage travel posters, and hand-painted postcards.

Each location: 10-20 words, specific place with atmosphere and lighting.

MUST feel like:
- A watercolor painting you'd frame on a wall
- A page from a beautiful illustrated travel book
- Warm, atmospheric, with natural or golden light

NEVER include:
- Fluorescent-lit interiors (offices, grocery stores, DMVs, waiting rooms)
- Modern concrete/glass buildings
- Ugly mundane spaces (parking garages, strip malls, cubicles)
- Anything that fights the watercolor medium

Good:
- "a Kyoto lantern-lit alley at dusk, paper lanterns glowing warm, wet stone path"
- "a Norwegian fjord at dawn, mirror-still black water, pink light on granite walls"
- "a crumbling Roman amphitheater overgrown with wildflowers, golden afternoon light"
- "a stone bridge over a misty river in the Scottish highlands, heather and fog"
- "a Havana street with pastel colonial facades, vintage car, golden afternoon shadows"

Output a JSON array of strings. No numbering, no markdown, just the array.`;

async function generateBatch(category, existingScenes) {
  const dedupBlock = existingScenes.length > 0
    ? `\n\nALREADY GENERATED (do NOT repeat or rephrase):\n${existingScenes.slice(-80).map(b => `- ${b}`).join('\n')}`
    : '';

  const userMsg = `Generate exactly ${category.count} backdrop locations in the category: **${category.label}**

${category.desc}

Every entry must be a DIFFERENT specific location. Spread across continents and vibes. No duplicates.${dedupBlock}`;

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

function dedupKey(scene) {
  return scene
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\b(the|a|an|and|or|but|in|on|at|to|for|of|is|it|with|from)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .sort()
    .join(' ');
}

function dedup(scenes) {
  const seen = new Set();
  const result = [];
  for (const s of scenes) {
    const key = dedupKey(s);
    if (key.length < 5) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(s);
  }
  return result;
}

(async () => {
  console.log('🌍 Generating HumanBot scene pool (8 categories × 50)\n');

  const allScenes = [];
  const byCat = {};

  for (const cat of CATEGORIES) {
    process.stdout.write(`  ${cat.label} (${cat.count})...`);
    try {
      const batch = await generateBatch(cat, allScenes);
      const dedupd = dedup([...allScenes, ...batch]).slice(allScenes.length);
      byCat[cat.name] = dedupd;
      allScenes.push(...dedupd);
      console.log(` ${dedupd.length} unique`);
    } catch (err) {
      console.log(` FAILED: ${err.message}`);
    }
  }

  const finalPool = dedup(allScenes);
  console.log(`\n✅ Total: ${finalPool.length} unique scenes (target: 400)`);

  if (DRY_RUN) {
    for (const cat of CATEGORIES) {
      console.log(`\n--- ${cat.label} (${(byCat[cat.name] || []).length}) ---`);
      (byCat[cat.name] || []).forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
    }
    return;
  }

  const outPath = path.join(__dirname, 'scenes.json');
  fs.writeFileSync(outPath, JSON.stringify(finalPool, null, 2));
  console.log(`💾 Saved to ${outPath}`);
})();
