#!/usr/bin/env node
/**
 * gen-card-concepts.js — draft a location card's concept lists (`sub_regions`, `must_include`) so the spot generators
 * and the pool cleanup's checks have a definition to hold a card to (LOCATION_SEED_PLAYBOOK.md: "never leave them
 * empty"; five name-only cards drifted almost wholesale, migs 632/634).
 *
 * Drafts from what the card IS (name, display name, picker tile, biome, imagined, its architecture examples), NEVER from
 * its spot pool: a drifted pool would bake its drift into the definition (1950s Americana's pool is full of national
 * parks). Writes <out>/concepts.json for review and, with --sql, a guarded migration (only cards whose lists are still
 * both empty). Nothing touches the database.
 *
 *   node scripts/gen-card-concepts.js --empty-only --out <dir> [--sql <file>]
 *   node scripts/gen-card-concepts.js --cards "1950s americana,cascais portugal" --out <dir>
 */
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { callClaude } = require('./lib/anthropic');

const sb = createClient(
  'https://jimftynwrinwenonjrlj.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const arg = (n, d) => {
  const i = process.argv.indexOf('--' + n);
  return i >= 0 ? process.argv[i + 1] : d;
};
const OUT = arg('out', '.');
const SQL = arg('sql', null);
const EMPTY_ONLY = process.argv.includes('--empty-only');
const CONC = Math.max(1, Math.min(4, Number(arg('concurrency', '3'))));
const CARDS = String(arg('cards', ''))
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const IMAGINED_BIOMES = new Set(['fantasy_imagined', 'scifi_cosmic', 'aquatic_underwater']);

const TILE_THEME = {
  europe: 'a real European destination',
  asia_pacific: 'a real Asia-Pacific destination',
  americas: 'a real destination in the Americas',
  middle_east_africa: 'a real destination in Africa or Arabia',
  tropical_escapes: 'a real tropical escape',
  beach_towns: 'a real beach town: the town itself, its beaches, piers, harbours and streets',
  nature: 'a real natural wonder',
  wild_west: 'the 1860s-1890s American frontier (Tombstone, Red Dead Redemption), never modern',
  ancient_worlds: 'a historical era or ancient world, as it was in its time',
  vintage_eras: 'a 20th-century or Victorian era, as it was in its time',
  romance: 'a romantic escape: lush, classy, pretty',
  high_life: 'jet-set luxury and glamour',
  fantasy: 'an imagined fantasy world',
  whimsical: 'an imagined whimsical, cute world',
  scifi: 'an imagined science-fiction world',
  heroes: 'an action and adventure genre setting',
  gothic: 'a gothic, haunted, atmospheric setting',
};

function parseObject(raw) {
  const s = raw.indexOf('{');
  const e = raw.lastIndexOf('}');
  if (s < 0 || e <= s) throw new Error('no JSON object in reply');
  return JSON.parse(raw.slice(s, e + 1));
}

async function draft(card) {
  const imagined =
    (card.biome_config && card.biome_config.imagined === true) || IMAGINED_BIOMES.has(card.biome);
  const label = card.display_name || card.name;
  const theme = TILE_THEME[card.picker_tile] || 'a dream location';
  const arch = Array.isArray(card.architecture) ? card.architecture.slice(0, 6) : [];
  const rule = card.biome_config && card.biome_config.SUBJECT_RULE;
  const system = `You define a location card for a dream app, so writers who later fill it with backdrop spots stay on its concept.
The card: "${label}" (key "${card.name}"), filed under: ${theme}. Biome: ${card.biome}.${imagined ? ' It is an imagined world.' : ' It is a real-world place or a real period.'}${rule ? `\nThe card's own rule (the authority on what it is): ${rule}` : ''}${arch.length ? `\nExamples of its look (older notes; where they disagree with the rule or the era, follow the rule): ${arch.join('; ')}` : ''}
Write:
- "sub_regions": 3-6 entries, each "Area (3-6 specific named places or features)" for a real place or period, or "Kind of place (examples)" for an imagined world. Cover what a person who picked "${label}" expects, spread across its best-known and most beautiful corners.
- "must_include": 3-5 short phrases naming the look every good spot should draw from, and as the LAST item exactly one "never ..." line naming the drift to avoid (e.g. "the town itself and its shore, never inland scenery or another city"). Only that last item says "never".
Rules:
- Every area and feature is somewhere a person would love to be dreamed into: beautiful, iconic or atmospheric. Never a road corridor, highway, parking area, visitor center, mall, lavatory, utility compound, signage, sponsor branding or office.
- Every named place really is part of this destination; a neighbouring town, island or country is not.
- A period or era card shows its world as it was then, never today's ruins, monuments, museums or visitor sites.
- The "never" line keeps out other destinations and other eras; it never shuts out the card's own exterior or approach (a castle card includes the castle seen from its own grounds).
Reply ONLY JSON: {"sub_regions": [...], "must_include": [...]}`;
  for (let a = 0; a < 3; a++) {
    try {
      const r = await callClaude({
        job: 'reseed',
        system,
        content: `Define "${label}".`,
        maxTokens: 1200,
        retryDelaysMs: [2000, 8000, 20000],
        timeoutMs: 120000,
      });
      const o = parseObject(r.raw);
      const subs = (o.sub_regions || []).map(String).filter(Boolean);
      const must = (o.must_include || []).map(String).filter(Boolean);
      if (subs.length >= 2 && must.length >= 2) return { name: card.name, label, subs, must };
    } catch (e) {
      if (a === 2) throw e;
    }
  }
  throw new Error('no usable draft');
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const { data: cards, error } = await sb
    .from('location_cards')
    .select(
      'name, display_name, picker_tile, biome, biome_config, architecture, sub_regions, must_include, content_kind'
    )
    .not('picker_tile', 'is', null)
    .eq('content_kind', 'place');
  if (error) throw new Error(error.message);
  const queue = cards.filter(
    (c) =>
      (!CARDS.length || CARDS.includes(c.name)) &&
      (!EMPTY_ONLY || (!(c.sub_regions || []).length && !(c.must_include || []).length))
  );
  console.log(`${queue.length} cards to define`);
  const results = [];
  let next = 0;
  async function worker() {
    while (next < queue.length) {
      const c = queue[next++];
      try {
        results.push(await draft(c));
        console.log(`  ${c.name}`);
      } catch (e) {
        console.warn(`  ${c.name}: FAILED ${e.message}`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  results.sort((a, b) => a.name.localeCompare(b.name));
  fs.writeFileSync(path.join(OUT, 'concepts.json'), JSON.stringify(results, null, 1));
  if (SQL) {
    const q = (v) => `'${String(v).replace(/'/g, "''")}'`;
    const arr = (xs) => `ARRAY[${xs.map(q).join(', ')}]::text[]`;
    const lines = results.map(
      (r) =>
        `UPDATE public.location_cards SET sub_regions = ${arr(r.subs)}, must_include = ${arr(r.must)}\n  WHERE name = ${q(r.name)} AND cardinality(coalesce(sub_regions, ARRAY[]::text[])) = 0 AND cardinality(coalesce(must_include, ARRAY[]::text[])) = 0;`
    );
    fs.writeFileSync(SQL, lines.join('\n') + '\n');
    console.log(`wrote ${SQL} (${lines.length} cards)`);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
