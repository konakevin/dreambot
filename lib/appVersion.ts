/**
 * appVersion — pure semver-ish comparison for the DB-driven app-update gate
 * (migration 312). No native imports here so it's unit-tested directly; the
 * gate component reads the running version from expo-constants and feeds it in.
 *
 * FAIL-OPEN is the whole safety contract: a null / blank / malformed bound NEVER
 * gates. A dashboard typo (or a missing config row) must not be able to brick the
 * fleet, so anything we can't confidently parse returns "don't gate".
 */

/** Parse '1.2.3' → [1, 2, 3]. Returns null for anything not a dotted run of
 *  digits (e.g. '', 'abc', '1.2-beta', undefined) so callers can fail open. */
export function parseVersion(v: string | null | undefined): number[] | null {
  if (typeof v !== 'string') return null;
  const parts = v.trim().split('.');
  // Each segment must be a non-empty run of digits ('' rejects '', '1..2', '1.').
  if (parts.some((p) => p.length === 0 || !/^\d+$/.test(p))) return null;
  return parts.map((p) => Number(p));
}

/** -1 if a < b, 0 if equal, 1 if a > b. Missing trailing parts count as 0
 *  ('1.2' === '1.2.0'). Returns null if EITHER version is unparseable. */
export function compareVersions(
  a: string | null | undefined,
  b: string | null | undefined
): -1 | 0 | 1 | null {
  const pa = parseVersion(a);
  const pb = parseVersion(b);
  if (!pa || !pb) return null;
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const x = pa[i] ?? 0;
    const y = pb[i] ?? 0;
    if (x < y) return -1;
    if (x > y) return 1;
  }
  return 0;
}

/** HARD gate: is the running app BELOW the required minimum? Fails open (false)
 *  when current or min is missing/malformed. */
export function isUpdateRequired(
  current: string | null | undefined,
  min: string | null | undefined
): boolean {
  return compareVersions(current, min) === -1;
}

/** SOFT nudge: is a newer version available (current strictly below latest)?
 *  Fails open (false) when current or latest is missing/malformed. */
export function isUpdateAvailable(
  current: string | null | undefined,
  latest: string | null | undefined
): boolean {
  return compareVersions(current, latest) === -1;
}
