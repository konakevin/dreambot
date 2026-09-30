#!/usr/bin/env -S deno run --allow-read --allow-net --allow-env
/**
 * check-location-health.ts — read-only health check of the LIVE location data behind the picker and the nightly engine
 * (Kevin 2026-09-30: "lock down the behavior and performance of the locations and the nightly engine").
 *
 * Unit tests cover the code; most of 2026-09-30's real bugs were in the DATA: 30 picker cards with no thumbnail, a spot
 * word ("slopes") that dressed a lavender card for skiing, generated bans that contradicted a card's spots, scenario tags
 * left pointing at retired cards, partial tiles the picker would silently round up. This checks the live rows against the
 * engine's own rules, imported from supabase/functions/_shared (never copied), and exits 1 on any ERROR.
 *
 *   deno run --allow-read --allow-net --allow-env scripts/check-location-health.ts
 *   deno run ... scripts/check-location-health.ts --verbose     # list every row behind each finding
 *
 * ERROR = broken for users or the engine. WARN = worth a look, often intended (a ski spot on an alpine card).
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { isValidBiomeConfig } from '../supabase/functions/_shared/biomeAxes.ts';
import { MIN_SCOPED_POOL } from '../supabase/functions/_shared/scenarioScope.ts';
import {
  parseOutfitMix,
  settingFromLocation,
  settingFromPlaceName,
} from '../supabase/functions/_shared/sceneSetting.ts';

const env = Object.fromEntries(
  Deno.readTextFileSync(new URL('../.env.local', import.meta.url))
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);
const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', env.SUPABASE_SERVICE_ROLE_KEY);
const VERBOSE = Deno.args.includes('--verbose');
/** The playbook's depth floor (LOCATION_SEED_PLAYBOOK.md): thin pools render samey dreams. */
const MIN_SPOTS = 15;
const MIN_CAST_SPOTS = 8;

type Row = Record<string, unknown>;
const isRow = (x: unknown): x is Row => typeof x === 'object' && x !== null && !Array.isArray(x);
interface Filter {
  eq?: Record<string, string | number | boolean>;
  neq?: Record<string, string | number | boolean>;
}
/** PostgREST caps a read at 1000 rows: page every full-table read. */
async function all(table: string, select: string, filter: Filter = {}): Promise<Row[]> {
  const out: Row[] = [];
  for (let from = 0; ; from += 1000) {
    let q = sb
      .from(table)
      .select(select)
      .range(from, from + 999);
    for (const [k, v] of Object.entries(filter.eq ?? {})) q = q.eq(k, v);
    for (const [k, v] of Object.entries(filter.neq ?? {})) q = q.neq(k, v);
    const { data, error } = await q;
    if (error) throw new Error(`${table}: ${error.message}`);
    const rows = ((data ?? []) as unknown[]).filter(isRow);
    out.push(...rows);
    if (rows.length < 1000) return out;
  }
}

const findings: { level: 'ERROR' | 'WARN'; check: string; detail: string; rows: string[] }[] = [];
function report(level: 'ERROR' | 'WARN', check: string, detail: string, rows: string[]) {
  if (rows.length) findings.push({ level, check, detail, rows });
}

const tiles = await all('picker_tiles', 'key, title, section, is_active, admin_only');
const cards = await all(
  'location_cards',
  'name, picker_tile, picker_category, content_kind, couples_ok, thumbnail_url, biome, biome_config, tags, outfit_mix, admin_only'
);
const spots = await all(
  'location_iconic_spots',
  'location_key, spot_text, is_active, character_eligible, pure_scene_eligible',
  {
    eq: { is_active: true },
  }
);
const liveScenarios = async (table: string) =>
  all(table, 'id, pool, location_keys, location_categories', {
    neq: { pool: 'holiday' },
    eq: { disabled: false },
  });
const dual = await liveScenarios('dual_scenarios');
const single = await liveScenarios('single_scenarios');
const recipes = await all('user_recipes', 'user_id, recipe');

const activeTiles = tiles.filter((t) => t.is_active);
const activeKeys = new Set(activeTiles.map((t) => String(t.key)));
const pickerCards = cards.filter((c) => c.picker_tile && c.picker_category);
const cardNames = new Set(cards.map((c) => String(c.name)));
const spotsBy = new Map<string, Row[]>();
for (const s of spots) {
  const k = String(s.location_key);
  const l = spotsBy.get(k);
  if (l) l.push(s);
  else spotsBy.set(k, [s]);
}

// ── Tiles ───────────────────────────────────────────────────────────────────────────────────────────────────────────
report(
  'ERROR',
  'tile-without-group',
  'active tile with no section (it falls to a Real World / Dream Worlds header)',
  activeTiles.filter((t) => !t.section).map((t) => String(t.key))
);
report(
  'ERROR',
  'empty-tile',
  'active tile with no cards (the picker hides it)',
  activeTiles
    .filter((t) => !pickerCards.some((c) => c.picker_tile === t.key))
    .map((t) => String(t.key))
);
report(
  'ERROR',
  'card-in-dead-tile',
  'picker card whose tile is missing or inactive (unreachable in the new picker)',
  pickerCards
    .filter((c) => !activeKeys.has(String(c.picker_tile)))
    .map((c) => `${c.name} → ${c.picker_tile}`)
);

// ── Place cards ─────────────────────────────────────────────────────────────────────────────────────────────────────
const places = pickerCards.filter((c) => c.content_kind === 'place');
report(
  'ERROR',
  'no-thumbnail',
  'picker card with no thumbnail (a blank square if it ever leads its tile)',
  pickerCards.filter((c) => !c.thumbnail_url).map((c) => String(c.name))
);
report(
  'ERROR',
  'thin-spots',
  `place card under the ${MIN_SPOTS}-spot floor`,
  places
    .filter((c) => (spotsBy.get(String(c.name)) ?? []).length < MIN_SPOTS)
    .map((c) => `${c.name} (${(spotsBy.get(String(c.name)) ?? []).length})`)
);
report(
  'ERROR',
  'thin-cast-spots',
  `place card with under ${MIN_CAST_SPOTS} spots usable in a dream with a face`,
  places
    .filter(
      (c) =>
        (spotsBy.get(String(c.name)) ?? []).filter((s) => s.character_eligible).length <
        MIN_CAST_SPOTS
    )
    .map(
      (c) =>
        `${c.name} (${(spotsBy.get(String(c.name)) ?? []).filter((s) => s.character_eligible).length})`
    )
);
report(
  'ERROR',
  'invalid-biome-config',
  'biome_config fails isValidBiomeConfig (the engine silently ignores it)',
  places.filter((c) => !isValidBiomeConfig(c.biome_config)).map((c) => String(c.name))
);
report(
  'ERROR',
  'no-wardrobe',
  'biome_config with no WARDROBE (outfits fall to the AI default)',
  places
    .filter((c) => {
      const w = (c.biome_config as { WARDROBE?: unknown } | null)?.WARDROBE;
      return !Array.isArray(w) || w.length === 0;
    })
    .map((c) => String(c.name))
);
report(
  'ERROR',
  'outfit-mix-unreadable',
  'outfit_mix with keys or weights the engine drops (a typo is silent at runtime)',
  pickerCards
    .filter(
      (c) =>
        c.outfit_mix != null &&
        JSON.stringify(parseOutfitMix(c.outfit_mix)) !== JSON.stringify(c.outfit_mix)
    )
    .map((c) => `${c.name}: ${JSON.stringify(c.outfit_mix)}`)
);

// Outfit fit: the dress code a render at this card starts from, and the spot words that override it.
// Mirrors nightly-dreams: the flag, or one of the three always-imagined biomes.
const IMAGINED_BIOMES = new Set(['fantasy_imagined', 'scifi_cosmic', 'aquatic_underwater']);
const imagined = (c: Row) =>
  (c.biome_config as { imagined?: unknown } | null)?.imagined === true ||
  IMAGINED_BIOMES.has(String(c.biome));
report(
  'WARN',
  'outfit-unknown',
  'place card whose biome and tags give no outfit setting (dresses in the generic city looks)',
  places
    .filter(
      (c) =>
        !c.outfit_mix &&
        settingFromLocation({
          biome: c.biome as string,
          tags: c.tags as string[],
          imagined: imagined(c),
        }) === 'unknown'
    )
    .map((c) => `${c.name} (biome ${c.biome})`)
);
const snowTraps: string[] = [];
for (const c of places) {
  const mix = parseOutfitMix(c.outfit_mix);
  const base = settingFromLocation({
    biome: c.biome as string,
    tags: c.tags as string[],
    imagined: imagined(c),
  });
  if (base === 'snow' || (mix && (mix.snow ?? 0) > 0) || c.biome === 'luxury') continue;
  for (const s of spotsBy.get(String(c.name)) ?? []) {
    if (
      s.character_eligible &&
      settingFromPlaceName(String(c.name), String(s.spot_text)) === 'snow'
    ) {
      snowTraps.push(`${c.name}: ${s.spot_text}`);
    }
  }
}
report(
  'WARN',
  'snow-word-trap',
  'cast spot whose words force snow gear on a non-snow card (the "slopes" class; a real ski spot is fine)',
  snowTraps
);

// ── Scenario cards + tags ───────────────────────────────────────────────────────────────────────────────────────────
const tagged = (rows: Row[], card: string) =>
  rows.filter((r) => ((r.location_keys as string[] | null) ?? []).includes(card)).length;
report(
  'ERROR',
  'thin-scenario-card',
  `scenario card with under ${MIN_SCOPED_POOL} live scenes for a surface it serves (the engine re-rolls away)`,
  pickerCards
    .filter((c) => c.content_kind === 'scenarios')
    .flatMap((c) => {
      const n = String(c.name);
      const out: string[] = [];
      if (tagged(single, n) < MIN_SCOPED_POOL) out.push(`${n} solo (${tagged(single, n)})`);
      if (c.couples_ok !== false && tagged(dual, n) < MIN_SCOPED_POOL)
        out.push(`${n} couple (${tagged(dual, n)})`);
      return out;
    })
);
const orphanTags = new Map<string, number>();
for (const r of [...dual, ...single])
  for (const k of (r.location_keys as string[] | null) ?? [])
    if (!cardNames.has(k)) orphanTags.set(k, (orphanTags.get(k) ?? 0) + 1);
report(
  'ERROR',
  'orphan-scenario-tag',
  'scenario rows tagged with a card that no longer exists (retired or renamed)',
  [...orphanTags.entries()].map(([k, n]) => `${k} (${n} rows)`)
);
const untagged = [...dual, ...single].filter(
  (r) =>
    !((r.location_keys as string[] | null) ?? []).length &&
    !((r.location_categories as string[] | null) ?? []).length
);
report(
  'WARN',
  'unreachable-scenario',
  'live scenario rows with no card or category tag (no one can draw them with the scope on)',
  untagged.length ? [`${untagged.length} rows`] : []
);

// ── Users' picks ────────────────────────────────────────────────────────────────────────────────────────────────────
const tileCards = new Map<string, string[]>();
for (const c of pickerCards)
  if (activeKeys.has(String(c.picker_tile))) {
    const l = tileCards.get(String(c.picker_tile));
    if (l) l.push(String(c.name));
    else tileCards.set(String(c.picker_tile), [String(c.name)]);
  }
const pickerNames = new Set(pickerCards.map((c) => String(c.name)));
const partial: string[] = [];
const deadPicks: string[] = [];
for (const r of recipes) {
  const places = ((r.recipe as { dream_seeds?: { places?: unknown } } | null)?.dream_seeds
    ?.places ?? []) as unknown[];
  const set = new Set(places.filter((p): p is string => typeof p === 'string'));
  for (const [tile, names] of tileCards) {
    const n = names.filter((x) => set.has(x)).length;
    if (n > 0 && n < names.length)
      partial.push(`${String(r.user_id).slice(0, 8)} ${tile} (${n}/${names.length})`);
  }
  for (const p of set)
    if (!pickerNames.has(p) && cardNames.has(p) === false)
      deadPicks.push(`${String(r.user_id).slice(0, 8)} ${p}`);
}
report(
  'WARN',
  'partial-tile',
  "user holds part of a tile (the picker rounds it up the first time they open it; mig 612's rule)",
  partial
);
report(
  'WARN',
  'pick-of-missing-card',
  "user's saved place names a card that no longer exists",
  deadPicks
);

// ── Output ──────────────────────────────────────────────────────────────────────────────────────────────────────────
console.log(
  `Checked ${activeTiles.length} tiles, ${pickerCards.length} picker cards (${places.length} places), ${spots.length} active spots, ` +
    `${dual.length + single.length} live scenarios, ${recipes.length} users' picks.`
);
for (const f of findings) {
  console.log(`\n${f.level} ${f.check}: ${f.detail} — ${f.rows.length}`);
  for (const r of VERBOSE ? f.rows : f.rows.slice(0, 8)) console.log(`   ${r}`);
  if (!VERBOSE && f.rows.length > 8) console.log(`   … ${f.rows.length - 8} more (--verbose)`);
}
const errors = findings.filter((f) => f.level === 'ERROR').length;
console.log(
  `\n${errors ? `${errors} ERROR check(s) failed` : 'No errors'}; ${findings.filter((f) => f.level === 'WARN').length} warning check(s).`
);
if (errors) Deno.exit(1);
