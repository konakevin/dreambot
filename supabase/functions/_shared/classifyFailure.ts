/**
 * classifyFailure — map a render error message to a refund class.
 *
 * SINGLE SOURCE OF TRUTH (extracted 2026-07-09 from divergent copies in
 * generate-dream + restyle-photo). The class lands in
 * `sparkle_transactions.reason` as `refund:hard_fail:<class>` and in
 * `ai_generation_log.fallback_reasons` as `hard_fail:<class>`, so it drives
 * both the money audit and the reliability triage. `source_missing` and
 * `nsfw` are treated as TERMINAL by the queue (immediate dead-letter +
 * refund); every other class is retryable.
 *
 * Added provider classes 2026-07-09 (the dreamer2927 failures all landed in
 * 'unknown'): a capped provider account (provider_billing) vs a transient
 * capacity outage (provider_unavailable) vs a generic provider error
 * (provider_gen) are very different pages to get.
 *
 * Pure module — no top-level `?.` (Deno edge BOOT_ERROR rule), no I/O.
 */

export function classifyFailure(errMsg: string): string {
  const m = errMsg.toLowerCase();
  if (m.startsWith('nsfw_content') || m.includes('nsfw') || m.includes('safety')) return 'nsfw';
  if (m.includes('flux') && (m.includes('failed') || m.includes('timed out'))) return 'flux_gen';
  if (m.includes('replicate') && (m.includes('failed') || m.includes('5'))) return 'flux_gen';
  if (m.includes('persiststorage') || m.includes('storage upload')) return 'storage_upload';
  if (m.includes('upload') && m.includes('failed')) return 'storage_upload';
  if (m.includes('uploads insert') || m.includes('db insert')) return 'db_insert';
  // A missing/unreachable cast source photo is PERMANENT — the file is gone
  // (e.g. the user re-uploaded their cast photo after this dream was queued,
  // deleting the old one). Terminal: immediate dead-letter + refund instead of
  // burning 5 retries over ~2h. Checked before the generic face_swap class
  // since the message carries a `face_swap:` prefix.
  if (
    m.includes('source unreachable') ||
    m.includes('source fetch failed') ||
    m.includes('source not an image') ||
    m.includes('invalid source url') ||
    m.includes('object not found')
  ) {
    return 'source_missing';
  }
  if (m.includes('face swap') || m.includes('face_swap')) return 'face_swap';
  if (m.includes('rate limit') || m.includes('rate-limit')) return 'rate_limit';
  if (m.includes('timed out') || m.includes('deadline')) return 'timeout';
  if (m.includes('billing') || m.includes('quota') || m.includes('insufficient credit')) {
    return 'provider_billing';
  }
  if (
    m.includes('(503)') ||
    m.includes('unavailable') ||
    m.includes('high demand') ||
    m.includes('overloaded') ||
    m.includes('(429)')
  ) {
    return 'provider_unavailable';
  }
  if (
    (m.includes('gemini') || m.includes('openai') || m.includes('seedream')) &&
    (m.includes('failed') || m.includes('error'))
  ) {
    return 'provider_gen';
  }
  return 'unknown';
}
