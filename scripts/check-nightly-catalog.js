#!/usr/bin/env node
/**
 * check-nightly-catalog.js — COHERENCE CHECK for the nightly looks/vibes catalog.
 *
 * Every bug this file exists to catch is the same shape: ONE decision expressed in TWO places that can silently
 * disagree. Real instances (2026-09-13): a look approved per (model x surface) while `dream_mediums.nightly_enabled`
 * was false, so the approvals could never fire; a code ban list in `_shared/locationFilters.ts` naming places the DB
 * had re-approved months earlier, so 19 imagined-world locations were stripped from every user's pool for 3 months.
 *
 * Exits 1 when any check fails, so it can gate a go-live or run from a monitor. Read-only.
 *   node scripts/check-nightly-catalog.js
 */
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const env = Object.fromEntries(
  fs
    .readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
);
const s = createClient(env.EXPO_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const problems = [];
const note = [];

(async () => {
  const [{ data: looks }, { data: appr }, { data: vibes }, { data: cfg }] = await Promise.all([
    s
      .from('dream_mediums')
      .select(
        'key,nightly_enabled,is_active,nightly_family,flux_fragment,face_swap_flux_fragment,client_meta'
      )
      .eq('nightly_look', true),
    s.from('nightly_look_approvals').select('look_key,model,surface,approved'),
    s.from('dream_vibes').select('key,version_of,is_active,nightly_pool,flux_fragment'),
    s
      .from('engine_config')
      .select('nightly_looks_mode,nightly_looks_allowlist,nightly_enabled')
      .single(),
  ]);

  const byKey = new Map((looks || []).map((l) => [l.key, l]));
  const okApprovals = (appr || []).filter((a) => a.approved);

  // 1. approved but not in the catalog — the approval can never fire
  for (const a of okApprovals) {
    const row = byKey.get(a.look_key);
    // A look deliberately held back records WHY in client_meta.reserved_for (mig 500, Big Head → Create). That is
    // the intent living next to the switch, so it is a note; an unexplained disagreement is the bug.
    const reserved = row && row.client_meta && row.client_meta.reserved_for;
    if (!row) problems.push(`approval for a look with no catalog row: ${a.look_key}`);
    else if (row.nightly_enabled === false && reserved) {
      if (!note.some((n) => n.startsWith(a.look_key)))
        note.push(
          `${a.look_key} keeps its approvals but is reserved for ${row.client_meta.reserved_for} — intentionally out of nightly`
        );
    } else if (row.nightly_enabled === false)
      problems.push(
        `${a.look_key} is APPROVED (${a.model.split('/').pop()} / ${a.surface}) but nightly_enabled = false and no client_meta.reserved_for says why`
      );
    else if (row.is_active === false)
      problems.push(`${a.look_key} is APPROVED but is_active = false`);
  }

  // 2. in the catalog with no approvals at all — dead weight, never rolls
  for (const l of looks || []) {
    if (l.nightly_enabled === false) continue;
    if (!okApprovals.some((a) => a.look_key === l.key))
      note.push(`${l.key} is enabled but has no approved (model x surface) — it never rolls`);
  }

  // 3. a look that can roll but carries no fragment to render with
  for (const l of looks || []) {
    if (l.nightly_enabled === false) continue;
    if (!l.flux_fragment && !l.face_swap_flux_fragment)
      problems.push(`${l.key} is enabled but has no flux fragment`);
  }

  // 4. vibes: in the nightly pool but inactive, or carrying no fragment at all
  for (const v of vibes || []) {
    if (v.nightly_pool && v.is_active === false)
      problems.push(`vibe ${v.key} is in the nightly pool but is_active = false`);
  }

  // 5. the code-side location ban list must not name a live picker card (the 3-month bug)
  const filters = fs.readFileSync(
    path.join(__dirname, '..', 'supabase', 'functions', '_shared', 'locationFilters.ts'),
    'utf8'
  );
  const banned = [...filters.matchAll(/'([^']+)'/g)].map((m) => m[1].toLowerCase());
  const { data: cards } = await s.from('location_cards').select('name,is_approved,picker_category');
  for (const c of cards || []) {
    if (c.is_approved && c.picker_category && banned.includes(String(c.name).toLowerCase()))
      problems.push(
        `locationFilters.ts bans "${c.name}" while it is a LIVE picker card — the picker offers a place the engine refuses`
      );
  }

  console.log(
    `nightly looks: ${(looks || []).length} rows, ${(looks || []).filter((l) => l.nightly_enabled !== false).length} enabled, ${okApprovals.length} approved (look x model x surface)`
  );
  console.log(
    `nightly vibes: ${(vibes || []).filter((v) => v.nightly_pool).length} in the pool of ${(vibes || []).length} active`
  );
  console.log(
    `looks mode: ${cfg.nightly_looks_mode} · allowlist ${(cfg.nightly_looks_allowlist || []).length} user(s) · nightly_enabled ${cfg.nightly_enabled}`
  );
  if (note.length) {
    console.log('\nNOTES (not failures):');
    note.forEach((n) => console.log('  ·', n));
  }
  if (problems.length) {
    console.log('\nPROBLEMS:');
    problems.forEach((p) => console.log('  ✗', p));
    process.exit(1);
  }
  console.log('\n✓ catalog is coherent — every approval can fire, every enabled look can render.');
})();
