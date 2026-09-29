/**
 * Anthropic Claude client — hardened against transient API pressure.
 *
 * Every production prompt-writing path (V4 generate-dream, nightly-dreams,
 * restyle-photo) goes through callSonnet here, which runs on anthropic.ts (the
 * one Edge client: job routing, model profiles, stamps). 529/429/5xx failures
 * retry with exponential backoff, then fall back to Haiku on exhaustion. A
 * top-level template-based fallback happens at the call site when the
 * entire Claude layer gives up — see fallbackReasons in generate-dream.
 *
 * Returns the brief (input) and rawResponse (pre-trim API output) so every
 * call site can log the full exchange to ai_generation_log for observability.
 * `text` is the trimmed, ≥10-char response used downstream.
 *
 * `modelUsed` and `retries` surface which layer served the request so the
 * calling function can log it to ai_generation_log.
 */

import { callClaude, RETRY_DELAYS_MS, type LlmContext, type LlmJob } from './anthropic.ts';

// Re-exported: the vision path and older imports read the shared retry ladder from here.
export { RETRY_DELAYS_MS, RETRYABLE_STATUSES } from './anthropic.ts';

export interface SonnetResult {
  text: string;
  brief: string;
  rawResponse: string;
  /** Which model actually served the successful response. */
  modelUsed: string;
  /** How many retry attempts before success (0 = first try). */
  retries: number;
  /** True if we fell back from the primary model to the secondary. */
  fellBackToSecondary: boolean;
  /** The API's stop_reason ('end_turn', 'max_tokens', ...). 'max_tokens' = the text was cut mid-phrase:
   *  a solo Create prompt ended "..., quiet lethal tension, no" (2026-09-26). Callers decide what to do. */
  stopReason?: string | null;
}

/** Which job this call is (routes the model, names the stamps) and the request's LLM context. */
export interface SonnetCall {
  job: LlmJob;
  llm?: LlmContext | null;
}

/**
 * Public API: call Claude (the job's model, Sonnet 4.6 by default) with full hardening.
 *
 * A thin wrapper over anthropic.ts callClaude that keeps this function's contract: 429/5xx retry on the
 * 1/3/10/30 s ladder, a reply under 10 characters fails the model, and the chain ends on Haiku. If every
 * model fails it throws, so the caller can run its own template fallback (generate-dream's fallbackReasons).
 */
export async function callSonnet(
  brief: string,
  anthropicKey: string | undefined,
  maxTokens: number = 200,
  call: SonnetCall
): Promise<SonnetResult> {
  if (!anthropicKey) throw new Error('No Anthropic API key');
  const r = await callClaude({
    job: call.job,
    llm: call.llm,
    key: anthropicKey,
    content: brief,
    maxTokens,
    retryDelaysMs: RETRY_DELAYS_MS,
    minChars: 10,
  });
  return {
    text: r.text,
    brief,
    rawResponse: r.raw,
    modelUsed: r.model,
    retries: r.retries,
    fellBackToSecondary: r.fellBackFrom !== null,
    stopReason: r.stopReason,
  };
}
