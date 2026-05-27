/**
 * Phase 1 targeted expansion — grow flowers.json toward ~320 with emphasis on
 * SHAPE/FORM variety (cascading, floating, groundcover, spire) + varied
 * statement shapes. Full color spectrum per batch. Appends + dedups.
 *
 *   node scripts/expand-bloombot-flower-pool.js
 */
const fs = require('fs');
const path = require('path');
const { SONNET } = require('./lib/models');

function readEnv() {
  try {
    const o = {};
    for (const l of fs.readFileSync('.env.local', 'utf8').split('\n')) {
      const i = l.indexOf('=');
      if (i > 0) o[l.slice(0, i).trim()] = l.slice(i + 1).trim();
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

const OUT = path.join(__dirname, 'bots', 'bloombot', 'seeds', 'flowers.json');
const existing = JSON.parse(fs.readFileSync(OUT, 'utf8'));

const SCHEMA = `Each flower is a JSON object:
{ "name": "<common name, lowercase>", "colors": [<REAL natural colors from: ${COLORS.join(', ')}>], "biomes": [<from: ${BIOMES.join(', ')}>], "form": "<${FORMS.join('|')}>", "scale": "<${SCALES.join('|')}>", "register": [<from: ${REGISTERS.join(', ')}>] }
RULES: colors = the species' REAL natural colors only (accurate). Full COLOR SPECTRUM across this batch — include plenty of blue/purple/violet/white, not just warm. NO green-only flowers. Output ONLY a JSON array, no prose, no code fences.`;

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
    if (!res.ok) throw new Error(`Sonnet ${res.status}`);
    return ((await res.json()).content?.[0]?.text || '').trim();
  } finally {
    clearTimeout(t);
  }
}
function parse(text) {
  let b = text
    .replace(/```[a-z]*\n?/gi, '')
    .replace(/```/g, '')
    .trim();
  const s = b.indexOf('['),
    e = b.lastIndexOf(']');
  if (s >= 0 && e > s) b = b.slice(s, e + 1);
  let a;
  try {
    a = JSON.parse(b);
  } catch {
    return [];
  }
  return Array.isArray(a)
    ? a.filter(
        (f) =>
          f &&
          typeof f.name === 'string' &&
          Array.isArray(f.colors) &&
          f.colors.length &&
          Array.isArray(f.biomes) &&
          f.biomes.length &&
          FORMS.includes(f.form) &&
          SCALES.includes(f.scale)
      )
    : [];
}
const norm = (n) =>
  n
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z ]/g, '')
    .trim();

const BATCHES = [
  `Generate 28 real flowers with a CASCADING / trailing / draping / climbing-vine form (e.g. wisteria, bougainvillea, trailing fuchsia, love-lies-bleeding amaranth, laburnum golden-chain, clematis, trumpet vine, cascading petunia/surfinia, black-eyed susan vine, trailing lobelia, climbing rose, jasmine vine, mandevilla, sweet pea on a trellis). form MUST be "cascading".`,
  `Generate 28 real flowers with a VERTICAL SPIRE / flower-spike form (e.g. delphinium, lupine, foxglove, hollyhock, salvia, liatris, snapdragon, red-hot poker, foxtail lily, veronica, gladiolus, agastache, lavender, grape hyacinth, bugbane, lobelia cardinalis, blazing star, larkspur). form MUST be "spire". Full spectrum incl. lots of blue/purple.`,
  `Generate 22 real flowers with a low GROUNDCOVER / carpeting / mat form (e.g. creeping phlox, sweet alyssum, aubrieta, candytuft, ice plant, moss phlox, creeping thyme bloom, sea thrift, snow-in-summer, rock cress, bugleweed, dianthus mat). form MUST be "groundcover".`,
  `Generate 18 real FLOATING aquatic-surface flowers (e.g. tropical blue/purple water lily, hardy water lily color variants, lotus color variants, water poppy, floating heart, water hawthorn, water snowflake, fringed water lily). form MUST be "floating", biomes MUST include "aquatic".`,
  `Generate 28 big STATEMENT hero blooms in VARIED SHAPES — globes (allium, hydrangea, snowball), pompoms (pompom dahlia, billy buttons), ruffled (peony, ranunculus, carnation, begonia), trumpets (lily, hibiscus, datura, amaryllis), daisies (gerbera, echinacea, sunflower), cups (tulip, poppy, anemone, crocus), stars (clematis, passionflower, magnolia), bells (campanula, fritillaria). form MUST be "statement". Full color spectrum.`,
];

(async () => {
  console.log(`Existing: ${existing.length}. Running ${BATCHES.length} form-targeted batches…`);
  const results = (
    await Promise.all(
      BATCHES.map((b) =>
        callSonnet(`${SCHEMA}\n\n${b} Output the tagged objects.`)
          .then(parse)
          .catch(() => [])
      )
    )
  ).flat();
  console.log(`  raw new: ${results.length}`);

  const seen = new Map();
  for (const f of existing) seen.set(norm(f.name), f);
  let added = 0;
  for (const f of results) {
    const k = norm(f.name);
    if (!k || seen.has(k)) continue;
    f.colors = [...new Set(f.colors.map((c) => String(c).toLowerCase()))].filter((c) =>
      COLORS.includes(c)
    );
    f.biomes = [...new Set(f.biomes)].filter((b) => BIOMES.includes(b));
    f.register = Array.isArray(f.register)
      ? [...new Set(f.register)].filter((r) => REGISTERS.includes(r))
      : [];
    if (!f.colors.length || !f.biomes.length) continue;
    seen.set(k, f);
    added++;
  }
  const pool = [...seen.values()];
  fs.writeFileSync(OUT, JSON.stringify(pool, null, 2) + '\n');
  console.log(`Added ${added} → total ${pool.length}`);
  const dist = (key, vocab) =>
    vocab
      .map(
        (v) =>
          `${v}:${pool.filter((f) => (Array.isArray(f[key]) ? f[key] : [f[key]]).includes(v)).length}`
      )
      .join('  ');
  console.log('\nFORM:', dist('form', FORMS));
  console.log('\nCOLOR:', dist('colors', COLORS));
})();
