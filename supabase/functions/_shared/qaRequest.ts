/**
 * qaRequest.ts — is this render OURS (a test) or a REAL user's dream?
 *
 * WHY IT MATTERS. Measured over the log's 30-day retention on 2026-09-16: 5,072 renders
 * costing $212.77, of which $174.21 — 82% of the bill — was our own testing. Real user
 * traffic is ~$38/month. Both numbers are fine; the problem was that they were
 * indistinguishable, so every "what are renders costing us" answer came back dominated by
 * whatever matrix had been run that week.
 *
 * The workaround until now was "exclude Kevin's user_id", which is wrong in both
 * directions: it drops his genuine personal dreams AND misses any QA run on another
 * account.
 *
 * HOW IT DECIDES. A render is QA when its request carried any `force_*` or `qa_*` flag.
 * Those are worker-token gated and a real client never sets them, so the signal is
 * already there — nothing new has to be passed in and no caller has to remember to
 * declare itself. A FUTURE force_* flag is therefore counted automatically.
 *
 * The exceptions are the flags PRODUCTION also sets, listed below. Getting this list
 * wrong in the permissive direction silently mislabels real dreams as tests and makes the
 * spend split lie — which is worse than having no split at all, because it looks
 * authoritative.
 */

/**
 * `force_*` / `qa_*` keys that PRODUCTION legitimately sets, so they must NOT mark a
 * render as QA. Sourced from the nightlyQaFlags.ts header: "All force_* flags are QA-only
 * (worker-token gated); first_dream, strict_face_swap, persist, queue_job_id and
 * force_place are also set by the production first-dream / queue paths."
 *
 * Only `force_place` matches the force_/qa_ prefix — the rest are listed for the reader,
 * since someone checking this will want to know the full set that production sends.
 */
export const PRODUCTION_FORCE_FLAGS: readonly string[] = [
  'force_place', // the first-dream path pins the location the user just picked
];

/** Non-prefixed keys production sets; here for documentation, not for matching. */
export const PRODUCTION_NON_QA_KEYS: readonly string[] = [
  'first_dream',
  'redream', // "Redream in a new setting" pins (mig 531): merged into the pin inputs AFTER isQaRequest runs on the raw body
  'strict_face_swap',
  'persist',
  'queue_job_id',
];

/**
 * True when this request body indicates a QA / evaluation render.
 *
 * Takes the RAW body rather than the parsed flags so it sees which keys were actually
 * SENT. A parsed flag set cannot distinguish "absent" from "present and false", and a
 * caller passing `force_model: undefined` explicitly is not running a test.
 */
export function isQaRequest(body: unknown): boolean {
  if (!body || typeof body !== 'object') return false;
  for (const [key, value] of Object.entries(body as Record<string, unknown>)) {
    if (!/^(force_|qa_)/.test(key)) continue;
    if (PRODUCTION_FORCE_FLAGS.includes(key)) continue;
    // A key present but explicitly null/undefined/false was not really asked for.
    // `force_cast_role: null` is the exception — an explicit null MEANS "scene only",
    // so it is a deliberate QA instruction rather than an absent flag.
    if (key === 'force_cast_role') return true;
    if (value === undefined || value === null || value === false) continue;
    return true;
  }
  return false;
}
