/**
 * Deserialize a dynamically-typed Supabase result to its known runtime shape.
 *
 * Supabase can't statically infer the row type for a runtime-string `.select()`
 * (e.g. a `const COLUMNS = '...'`) or an `.rpc()` with a custom return, so the
 * result arrives loosely typed and must be narrowed to the shape we know it has.
 * This is the ONE legitimate deserialization boundary for those queries — use it
 * instead of an ad-hoc `as unknown as T` at the call site (the banned double-cast):
 * the single `unknown → T` cast lives here, documented, and every call site states
 * its expected type explicitly via the generic.
 *
 *   const row = asDbResult<EntitlementRow | null>(data);
 */
export function asDbResult<T>(data: unknown): T {
  return data as T;
}
