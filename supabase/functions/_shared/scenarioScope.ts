/**
 * scenarioScope.ts — a shared nightly scenario (goofy / elegant / active) may only reach a dreamer who PICKED a
 * place it belongs to (Kevin 2026-09-30: "i want all dreams to be intentional from the users chosen locations").
 * Holidays are exempt and never pass through here. Migration 591 + SCENARIO_LOCATION_SCOPE.md.
 *
 * A row matches when one of its location_keys is a card the dreamer picked, or one of its location_categories is
 * the picker category of a card they picked. A row with no tags matches NOBODY. Unlike the relationship gate this
 * fails CLOSED: an empty result means no scenario, and the dream stays at the dreamer's own place.
 */

export interface ScopedScenario {
  locationKeys?: string[] | null;
  locationCategories?: string[] | null;
}

export interface PlaceScope {
  keys: ReadonlySet<string>;
  categories: ReadonlySet<string>;
}

/** A scene type needs this many matching rows to be rolled at all: fewer would repeat the same few scenes. */
export const MIN_SCOPED_POOL = 10;

export function placeScope(
  picks: readonly string[],
  categoryOf: ReadonlyMap<string, string | null>
): PlaceScope {
  const categories = new Set<string>();
  for (const p of picks) {
    const c = categoryOf.get(p);
    if (c) categories.add(c);
  }
  return { keys: new Set(picks), categories };
}

export function scopeScenarios<T extends ScopedScenario>(
  rows: readonly T[],
  scope: PlaceScope
): T[] {
  return rows.filter(
    (r) =>
      (r.locationKeys ?? []).some((k) => scope.keys.has(k)) ||
      (r.locationCategories ?? []).some((c) => scope.categories.has(c))
  );
}

/** A scene type's share once scoped: its configured pct if enough rows match, else 0 (the share goes to the place). */
export function scopedPct(pct: number, matchingRows: number): number {
  return matchingRows >= MIN_SCOPED_POOL ? pct : 0;
}

export type ScenarioKind = 'goofy' | 'elegant' | 'active';

export interface KindedScenario<T> {
  row: T;
  kind: ScenarioKind;
}

/**
 * The rows a SCENARIO CARD holds (mig 594): every row of any kind tagged with the card. A scenario card is a location
 * card whose content is its tagged scenarios rather than a place (Just for Fun, Sports & Arenas, Regency England, …);
 * when the place roll lands on one, a face-swap cast dream draws from these.
 */
export function cardScenarios<T extends ScopedScenario>(
  pools: Readonly<Record<ScenarioKind, readonly T[]>>,
  card: string
): KindedScenario<T>[] {
  const out: KindedScenario<T>[] = [];
  for (const kind of ['goofy', 'elegant', 'active'] as const) {
    for (const row of pools[kind])
      if ((row.locationKeys ?? []).includes(card)) out.push({ row, kind });
  }
  return out;
}
