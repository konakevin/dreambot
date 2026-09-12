/**
 * nightlyLooks.ts — the two-stage nightly LOOK roll (NIGHTLY_LOOKS_REFACTOR_PLAN.md §2, Kevin 2026-09-12:
 * "let the families roll and then a 2nd roll for the entry within the family").
 *
 * Pure: no I/O, no Date, injected rng. Locked by __tests__/lib/nightlyLooks.test.ts. Phase 2 wires it into the
 * render behind engine_config.nightly_looks_mode; until then nothing calls it in production.
 *
 * Inputs are the two tables as plain rows:
 *   - looks      = dream_mediums rows with nightly_look = true (key, label, family, fragments, directive, weight)
 *   - approvals  = nightly_look_approvals rows (look_key, model, surface, approved) — the graded matrix (mig 498)
 * Algorithm for (model, surface):
 *   1. candidates = active looks that have an APPROVED row for exactly this (model, surface)
 *   2. drop the user's recent look keys (last `recencyWindow`), per family — but never empty a family that had
 *      candidates (the filterRecent floor: repeats beat an empty pool)
 *   3. roll a FAMILY: equal shares (or `familyMix` weights) across families that still have candidates
 *   4. roll a LOOK inside it by `weight`
 * A forced look (QA `force_look`) short-circuits everything and is stamped `look_source:force`.
 * Returns null when nothing is approved for (model, surface) — the caller decides the fallback (legacy roll or
 * the surface's default look); the resolver never invents a look.
 */

export type LookSurface = 'couple' | 'solo';

export const LOOK_FAMILIES = [
  'photographic',
  'painted_realism',
  'covers_posters',
  'comic_print',
  'watercolor',
] as const;
export type LookFamily = (typeof LOOK_FAMILIES)[number];

export interface LookRow {
  key: string;
  label: string;
  family: LookFamily | string;
  /** Scene fragment (no face clause). */
  fragment: string;
  /** Cast fragment with the swap-safety clause; falls back to `fragment` when absent. */
  swapFragment: string | null;
  directive: string | null;
  weight: number;
  active: boolean;
  /** dream_mediums.client_meta.banned_vibes — vibe FAMILIES this look never rolls with (the 1.2.0 override library
   *  banned 'epic' on the adult-cartoon fragment; the contract passes these to the vibe roll). */
  bannedVibes?: readonly string[];
  /** dream_mediums.nightly_enabled — false = reserved (e.g. for a future Create medium) and never rolled by nightly,
   *  even when approved. Defaults to true when omitted. */
  nightlyEnabled?: boolean;
}

export interface LookApproval {
  lookKey: string;
  model: string;
  surface: LookSurface;
  approved: boolean;
}

export interface ResolveLookInput {
  surface: LookSurface;
  model: string;
  looks: readonly LookRow[];
  approvals: readonly LookApproval[];
  /** The user's most recent look keys, newest first (from ai_generation_log). */
  recentLookKeys?: readonly string[];
  /** How many recent keys to avoid (default 7 — today's medium rule). */
  recencyWindow?: number;
  /** Optional per-family shares, e.g. { photographic: 2 }. Missing families default to 1. */
  familyMix?: Readonly<Record<string, number>> | null;
  /** QA: pin this look key regardless of approvals. */
  forcedLook?: string | null;
  /** Chance (0-100) that the roll draws from the LEGACY family (the 1.2.0 mediums, mig 513) before the family-first
   *  roll; 0 / undefined = legacy is just another family. Falls to the other set when the chosen one has no approved
   *  look for this model + surface. */
  legacyPct?: number;
  rng: () => number;
}

/** dream_mediums.nightly_family of the 1.2.0 mediums folded into the catalog (mig 513). */
export const LEGACY_FAMILY = 'legacy';

export interface ResolvedLook {
  look: LookRow;
  family: string;
  /** The fragment to put in the prompt for this surface (cast = swap fragment). */
  fragment: string;
  source: 'roll' | 'force';
  stamps: string[];
}

function weightedPick<T>(items: readonly T[], weightOf: (t: T) => number, rng: () => number): T {
  const weights = items.map((i) => Math.max(0, weightOf(i)));
  const total = weights.reduce((a, b) => a + b, 0);
  if (total <= 0) return items[Math.floor(rng() * items.length)];
  let r = rng() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r < 0) return items[i];
  }
  return items[items.length - 1];
}

export function approvedLooks(
  input: Pick<ResolveLookInput, 'surface' | 'model' | 'looks' | 'approvals'>
): LookRow[] {
  const ok = new Set(
    input.approvals
      .filter((a) => a.approved && a.model === input.model && a.surface === input.surface)
      .map((a) => a.lookKey)
  );
  return input.looks.filter((l) => l.active && l.nightlyEnabled !== false && ok.has(l.key));
}

export function resolveLook(input: ResolveLookInput): ResolvedLook | null {
  const stamps: string[] = [];
  const fragmentFor = (l: LookRow): string =>
    input.surface === 'couple' || input.surface === 'solo'
      ? l.swapFragment && l.swapFragment.trim().length > 0
        ? l.swapFragment
        : l.fragment
      : l.fragment;

  if (input.forcedLook) {
    const forced = input.looks.find((l) => l.key === input.forcedLook);
    if (forced) {
      stamps.push(`look:${forced.key}`, `look_family:${forced.family}`, 'look_source:force');
      return {
        look: forced,
        family: forced.family,
        fragment: fragmentFor(forced),
        source: 'force',
        stamps,
      };
    }
    stamps.push(`look_pin_unknown:${input.forcedLook}`);
  }

  const candidates = approvedLooks(input);
  if (candidates.length === 0) {
    stamps.push(`look_pool_empty:${input.model.split('/').pop()}:${input.surface}`);
    return null;
  }

  // Group by family, then apply recency per family with the never-empty floor.
  // Legacy vs new (Kevin 2026-09-12: "a legacy family type rolled at some percentage — a good mix of old and new").
  const legacyPct = input.legacyPct ?? 0;
  const legacySet = candidates.filter((l) => l.family === LEGACY_FAMILY);
  const newSet = candidates.filter((l) => l.family !== LEGACY_FAMILY);
  let chosen = candidates;
  if (legacyPct > 0) {
    if (legacySet.length > 0 && newSet.length > 0) {
      const useLegacy = input.rng() * 100 < legacyPct;
      chosen = useLegacy ? legacySet : newSet;
      stamps.push(`look_set:${useLegacy ? 'legacy' : 'new'}`);
    } else {
      stamps.push(`look_set:${legacySet.length > 0 ? 'legacy' : 'new'}:only`);
    }
  }

  const window = input.recencyWindow ?? 7;
  const recent = new Set((input.recentLookKeys ?? []).slice(0, window));
  const byFamily = new Map<string, LookRow[]>();
  for (const l of chosen) {
    const arr = byFamily.get(l.family) ?? [];
    arr.push(l);
    byFamily.set(l.family, arr);
  }
  const pools: { family: string; looks: LookRow[] }[] = [];
  for (const [family, looks] of byFamily) {
    const fresh = looks.filter((l) => !recent.has(l.key));
    pools.push({ family, looks: fresh.length > 0 ? fresh : looks });
  }
  pools.sort((a, b) => a.family.localeCompare(b.family)); // deterministic order for a seeded rng

  const mix = input.familyMix ?? null;
  const pool = weightedPick(pools, (p) => (mix && p.family in mix ? mix[p.family] : 1), input.rng);
  const look = weightedPick(pool.looks, (l) => l.weight, input.rng);
  stamps.push(
    `look:${look.key}`,
    `look_family:${pool.family}`,
    `look_pool:${chosen.length}/${pools.length}`,
    'look_source:roll'
  );
  return { look, family: pool.family, fragment: fragmentFor(look), source: 'roll', stamps };
}
