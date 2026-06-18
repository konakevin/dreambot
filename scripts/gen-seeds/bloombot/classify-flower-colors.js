#!/usr/bin/env node
/**
 * BloomBot flower COLOR-PRIOR matrix (2026-06-17).
 *
 * Adds two fields to every species in seeds/flowers.json:
 *   • primary    — the SINGLE color an AI image model (Flux) actually renders
 *                  this flower as by default (its visual prior), from the bloom
 *                  color vocabulary. NOT the botanical range, the RENDER prior.
 *   • versatile  — true if Flux reliably renders this species in ANY requested
 *                  color (rose / tulip / dahlia / ranunculus / zinnia / carnation
 *                  / chrysanthemum / gerbera…); false if it's COLOR-LOCKED to its
 *                  primary's family (sunflower→yellow, wisteria→purple,
 *                  bougainvillea→magenta, forget-me-not→blue, lavender→purple).
 *
 * The flowerEngine uses these so a theme only casts species it can render in the
 * theme's colors — coherent designed palettes instead of pink/purple drift.
 *
 * Run: node scripts/gen-seeds/bloombot/classify-flower-colors.js
 */
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const out = {};
  try {
    const raw = fs.readFileSync(path.resolve('.env.local'), 'utf8');
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch {
    /* ignore */
  }
  return out;
}

const VOCAB = [
  'pink',
  'red',
  'orange',
  'yellow',
  'white',
  'cream',
  'purple',
  'violet',
  'lavender',
  'blue',
  'indigo',
  'magenta',
  'coral',
  'peach',
  'burgundy',
  'bronze',
];

async function callSonnet(names, key) {
  const prompt = `You are a botanical + AI-image-model expert. For each flower below, give the color an AI IMAGE MODEL (Flux) most reliably renders it as BY DEFAULT — its strongest visual prior, the color a person pictures when they hear the name. Use the RENDER prior, not the full botanical range.

Also flag whether the flower is COLOR-VERSATILE: true if it reliably renders in ANY requested color (e.g. rose, tulip, dahlia, ranunculus, zinnia, carnation, chrysanthemum, gerbera daisy, anemone, gladiolus) — these are the florist "comes in every color" flowers. false if it is COLOR-LOCKED to one hue family (e.g. sunflower→yellow, wisteria→purple, bougainvillea→magenta, forget-me-not→blue, lavender→purple, bird-of-paradise→orange, bluebell→blue, marigold→orange).

primary MUST be one of: ${VOCAB.join(', ')}.

Flowers:
${names.map((n, i) => `${i + 1}. ${n}`).join('\n')}

Return ONLY a JSON array, one object per flower in order: [{"name":"<exact name>","primary":"<color>","versatile":true|false}, ...]. No preamble.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  let text = data.content[0].text.trim();
  const s = text.indexOf('[');
  const e = text.lastIndexOf(']');
  return JSON.parse(text.slice(s, e + 1));
}

(async () => {
  const key = process.env.ANTHROPIC_API_KEY || loadEnv().ANTHROPIC_API_KEY;
  if (!key) throw new Error('ANTHROPIC_API_KEY missing');
  const fp = path.resolve('scripts/bots/bloombot/seeds/flowers.json');
  const flowers = JSON.parse(fs.readFileSync(fp, 'utf8'));
  console.log(`Classifying ${flowers.length} species…`);

  const byName = {};
  const BATCH = 40;
  for (let i = 0; i < flowers.length; i += BATCH) {
    const slice = flowers.slice(i, i + BATCH);
    const names = slice.map((f) => f.name);
    let rows;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        rows = await callSonnet(names, key);
        break;
      } catch (e) {
        console.warn(`  batch ${i / BATCH + 1} attempt ${attempt} failed: ${e.message}`);
        if (attempt === 3) throw e;
      }
    }
    for (const r of rows) {
      const prim = VOCAB.includes(r.primary) ? r.primary : 'pink';
      byName[r.name.toLowerCase()] = { primary: prim, versatile: !!r.versatile };
    }
    console.log(`  ${Math.min(i + BATCH, flowers.length)}/${flowers.length}`);
  }

  let matched = 0;
  for (const f of flowers) {
    const c = byName[f.name.toLowerCase()];
    if (c) {
      f.primary = c.primary;
      f.versatile = c.versatile;
      matched++;
    } else {
      // Fallback: first botanical color as primary, non-versatile.
      f.primary = f.colors[0];
      f.versatile = false;
    }
  }
  fs.writeFileSync(fp, JSON.stringify(flowers, null, 2) + '\n');
  console.log(`✅ Wrote ${flowers.length} (${matched} classified, ${flowers.length - matched} fallback) → ${fp}`);
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
