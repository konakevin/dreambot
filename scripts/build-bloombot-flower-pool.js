/**
 * Phase 1 of the BloomBot Flower Engine refactor (BLOOMBOT_FLOWER_ENGINE_PLAN.md).
 *
 * Builds the tagged flower pool: REUSES the 131 existing roster species (tags
 * them) + EXPANDS to a large full-spectrum pool (target ~300, range 200-400),
 * balanced for the colors we're thin on (blue / purple / true-white / cool).
 *
 * Each flower: { name, colors[], biomes[], form, scale, register[] }.
 * Output: scripts/bots/bloombot/seeds/flowers.json
 *
 *   node scripts/build-bloombot-flower-pool.js
 */
const fs = require('fs');
const path = require('path');
const { SONNET } = require('./lib/models');

function readEnv() {
  try {
    const o = {};
    for (const line of fs.readFileSync('.env.local', 'utf8').split('\n')) {
      const i = line.indexOf('=');
      if (i > 0) o[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
    return o;
  } catch {
    return {};
  }
}
const ANTHROPIC = process.env.ANTHROPIC_API_KEY || readEnv().ANTHROPIC_API_KEY;
if (!ANTHROPIC) {
  console.error('ANTHROPIC_API_KEY missing');
  process.exit(1);
}

const COLORS =
  'pink red orange yellow white cream purple violet lavender blue indigo magenta coral peach burgundy bronze'.split(
    ' '
  );
const BIOMES =
  'african asian australian southAmerican northAmerican alpine centralAsian desert aquatic tropical cottage meadow woodland exotic'.split(
    ' '
  );
const FORMS = ['statement', 'spire', 'filler', 'cascading', 'groundcover', 'floating'];
const SCALES = ['large', 'medium', 'small'];
const REGISTERS = 'naturalistic cottage alpine tropical aquatic desert woodland exotic'.split(' ');

const SR = require('./bots/bloombot/species-roster.js');
const EXISTING = (() => {
  const s = new Set();
  for (const r of Object.values(SR.REGIONS)) r.species.forEach((x) => s.add(x));
  SR.TROPICAL.species.forEach((x) => s.add(x));
  return [...s];
})();

const SCHEMA = `Each flower is a JSON object:
{
  "name": "<common flower name, lowercase>",
  "colors": [<ALL natural color options this species really comes in, from: ${COLORS.join(', ')}>],
  "biomes": [<ALL that fit, from: ${BIOMES.join(', ')}>],
  "form": "<one of: ${FORMS.join(', ')}>",
  "scale": "<one of: ${SCALES.join(', ')}>",
  "register": [<from: ${REGISTERS.join(', ')}>]
}
RULES:
- "colors" = the species' REAL natural colors only (delphinium = blue/purple/white, NOT orange; marigold = orange/yellow, NOT blue). Be accurate.
- form: statement = big showy hero bloom (peony/protea/dahlia/lotus); spire = vertical spike (delphinium/foxglove/lupine/salvia); filler = small clustered (forget-me-not/alyssum/baby's breath); cascading = trailing/draping (wisteria/bougainvillea); groundcover = low mat; floating = aquatic surface (lotus/water lily).
- biomes: list every context it plausibly fits (cottage + meadow + a geographic region, etc.). "exotic" for orchids/rare blooms.
- NO green-only flowers (green is foliage, not a flower theme) — skip species whose only color is green.
Output ONLY a JSON array, no prose, no code fences.`;

async function callSonnet(prompt) {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), 10 * 60 * 1000);
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: SONNET,
        max_tokens: 8000,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: c.signal,
    });
    if (!res.ok) throw new Error(`Sonnet ${res.status}: ${(await res.text()).slice(0, 160)}`);
    return ((await res.json()).content?.[0]?.text || '').trim();
  } finally {
    clearTimeout(t);
  }
}

function parseFlowers(text) {
  let body = text
    .replace(/```[a-z]*\n?/gi, '')
    .replace(/```/g, '')
    .trim();
  const start = body.indexOf('[');
  const end = body.lastIndexOf(']');
  if (start >= 0 && end > start) body = body.slice(start, end + 1);
  let arr;
  try {
    arr = JSON.parse(body);
  } catch {
    return [];
  }
  if (!Array.isArray(arr)) return [];
  return arr.filter(
    (f) =>
      f &&
      typeof f.name === 'string' &&
      Array.isArray(f.colors) &&
      f.colors.length &&
      Array.isArray(f.biomes) &&
      f.biomes.length &&
      FORMS.includes(f.form) &&
      SCALES.includes(f.scale)
  );
}

function norm(n) {
  return n
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z ]/g, '')
    .trim();
}

async function tagExisting(batch) {
  const prompt = `${SCHEMA}\n\nTAG each of these EXISTING flower species accurately (keep the name as given):\n${batch.map((n) => `- ${n}`).join('\n')}`;
  return parseFlowers(await callSonnet(prompt));
}

async function expand(n, quota) {
  const prompt = `${SCHEMA}\n\nGenerate ${n} MORE real, distinct, well-known garden/wild flower species (common names). ${quota} Vary forms (statement / spire / filler / cascading / groundcover) and scales. Do NOT repeat common ones like rose/tulip/daisy more than once. Output the ${n} tagged objects.`;
  return parseFlowers(await callSonnet(prompt));
}

(async () => {
  // 1. Tag existing in batches of ~33
  const exBatches = [];
  for (let i = 0; i < EXISTING.length; i += 33) exBatches.push(EXISTING.slice(i, i + 33));
  console.log(`Tagging ${EXISTING.length} existing species in ${exBatches.length} batches…`);
  const tagged = (await Promise.all(exBatches.map(tagExisting))).flat();
  console.log(`  tagged: ${tagged.length}`);

  // 2. Expand with color quotas (heavy on cool / thin colors)
  const quotas = [
    'BALANCE TOWARD COOL: at least half should be blue / indigo / violet / purple / true-white species.',
    'BALANCE TOWARD COOL: at least half should be blue / purple / lavender / white species.',
    'Emphasize WHITE / cream / ivory and soft PASTEL species (pinks, peaches, pale blues).',
    'Emphasize VIVID jewel-tones across the FULL spectrum, equal warm and cool.',
    'Emphasize PURPLE / magenta / violet / lavender species specifically.',
    'Emphasize cottage-garden + meadow wildflower species across all colors, equal warm and cool.',
  ];
  console.log(`Expanding in ${quotas.length} batches of ~35…`);
  const expanded = (await Promise.all(quotas.map((q) => expand(35, q)))).flat();
  console.log(`  expanded raw: ${expanded.length}`);

  // 3. Merge + dedup by normalized name
  const seen = new Map();
  for (const f of [...tagged, ...expanded]) {
    const k = norm(f.name);
    if (!k || seen.has(k)) continue;
    // clamp tag vocab
    f.colors = [...new Set(f.colors.map((c) => String(c).toLowerCase()))].filter((c) =>
      COLORS.includes(c)
    );
    f.biomes = [...new Set(f.biomes)].filter((b) => BIOMES.includes(b));
    f.register = Array.isArray(f.register)
      ? [...new Set(f.register)].filter((r) => REGISTERS.includes(r))
      : [];
    if (!f.colors.length || !f.biomes.length) continue;
    seen.set(k, f);
  }
  const pool = [...seen.values()];

  // 4. Write + stats
  const out = path.join(__dirname, 'bots', 'bloombot', 'seeds', 'flowers.json');
  fs.writeFileSync(out, JSON.stringify(pool, null, 2) + '\n');
  console.log(`\nWROTE ${pool.length} flowers → ${path.basename(out)}`);
  const dist = (key, vocab) => {
    const c = {};
    for (const v of vocab)
      c[v] = pool.filter((f) => (Array.isArray(f[key]) ? f[key] : [f[key]]).includes(v)).length;
    return Object.entries(c)
      .sort((a, b) => b[1] - a[1])
      .map(([k, n]) => `${k}:${n}`)
      .join('  ');
  };
  console.log('\nCOLOR coverage:', dist('colors', COLORS));
  console.log('\nFORM:', dist('form', FORMS));
  console.log('\nBIOME:', dist('biomes', BIOMES));
})();
