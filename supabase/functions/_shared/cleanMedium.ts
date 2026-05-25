/**
 * DLT "cleaned medium" resolution.
 *
 * Bot mediums in `dream_mediums` are authored for the BOT scene engine — their
 * directive/flux_fragment often dictate a cast / scene / action, which would
 * override a user's OWN subject in "Dream Like This" (the "cat on a roof" →
 * toy-diorama bug). The `dlt_clean_mediums` table holds a STYLE-ONLY distilled
 * version per bot medium. During DLT we swap the medium's directive +
 * fluxFragment for the cleaned style so the user's subject survives.
 *
 * `dream_mediums` is NEVER mutated — the bot keeps rendering with it via its
 * bot-local mediumStyles. This is a read-side, DLT-only override.
 *
 * Fallback contract: if there is no cleaned row (or its fields are empty), the
 * medium is returned UNCHANGED — DLT falls back to the raw bot medium.
 */

export interface CleanMediumRow {
  medium_key: string;
  clean_flux_fragment: string | null;
  clean_directive: string | null;
}

/** Minimal shape we override — keeps this pure + trivially testable. */
export interface CleanableMedium {
  directive: string;
  fluxFragment: string;
}

/**
 * Pure: apply a cleaned-medium override to a resolved medium.
 * Returns the medium UNCHANGED when `cleanRow` is null/undefined or carries no
 * usable text (graceful fallback to the bot medium). Each field falls back
 * independently — a clean flux with an empty directive keeps the base directive.
 */
export function applyCleanMedium<M extends CleanableMedium>(
  medium: M,
  cleanRow: CleanMediumRow | null | undefined
): M {
  if (!medium || !cleanRow) return medium;
  const cleanFlux =
    typeof cleanRow.clean_flux_fragment === 'string' ? cleanRow.clean_flux_fragment.trim() : '';
  const cleanDirective =
    typeof cleanRow.clean_directive === 'string' ? cleanRow.clean_directive.trim() : '';
  if (!cleanFlux && !cleanDirective) return medium; // empty row → fallback
  return {
    ...medium,
    directive: cleanDirective || medium.directive,
    fluxFragment: cleanFlux || medium.fluxFragment,
  };
}

/**
 * Fetch the cleaned-medium row for a medium key. Fail-safe: returns null on any
 * error or missing row, so the caller falls back to the raw bot medium. The
 * Supabase client is injected so this stays decoupled + the pure logic above is
 * what gets unit-tested.
 */
export async function fetchCleanMedium(
  // deno-lint-ignore no-explicit-any
  sb: any,
  key: string | undefined | null
): Promise<CleanMediumRow | null> {
  if (!key) return null;
  try {
    const { data, error } = await sb
      .from('dlt_clean_mediums')
      .select('medium_key, clean_flux_fragment, clean_directive')
      .eq('medium_key', key)
      .maybeSingle();
    if (error) {
      console.warn('[cleanMedium] fetch failed, falling back to bot medium:', error.message);
      return null;
    }
    return (data as CleanMediumRow | null) ?? null;
  } catch (e) {
    console.warn('[cleanMedium] fetch threw, falling back to bot medium:', (e as Error).message);
    return null;
  }
}
