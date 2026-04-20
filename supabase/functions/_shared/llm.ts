/**
 * Anthropic Claude client — hardened against transient API pressure.
 *
 * Every production prompt-writing path (V4 generate-dream, nightly-dreams,
 * restyle-photo) goes through callSonnet here. 529/429/5xx failures retry
 * with exponential backoff, then fall back to Haiku on exhaustion. A
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
}

const PRIMARY_MODEL = 'claude-sonnet-4-20250514';
const SECONDARY_MODEL = 'claude-haiku-4-5-20251001';
const RETRY_DELAYS_MS = [1000, 3000, 10000, 30000]; // up to 4 retries
const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504, 529]);

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * One shot at a given model with retry-on-transient.
 * Returns { text, rawResponse, retries } on success; throws on terminal
 * failure (non-retryable status, or retries exhausted).
 */
async function callModelWithRetry(
  model: string,
  brief: string,
  anthropicKey: string,
  maxTokens: number
): Promise<{ text: string; rawResponse: string; retries: number }> {
  let lastErr = '';
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: brief }],
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const rawResponse = data.content?.[0]?.text ?? '';
      const text = rawResponse.trim();
      if (text.length < 10) throw new Error(`${model} response too short`);
      return { text, rawResponse, retries: attempt };
    }
    lastErr = `${res.status}: ${(await res.text()).slice(0, 200)}`;
    // If this status isn't retryable, fail immediately — no point burning retries
    if (!RETRYABLE_STATUSES.has(res.status)) {
      throw new Error(`${model} ${lastErr}`);
    }
    // Retryable — back off and try again (unless we've used all attempts)
    if (attempt < RETRY_DELAYS_MS.length) {
      console.warn(
        `[llm] ${model} ${res.status} on attempt ${attempt + 1}/${RETRY_DELAYS_MS.length + 1}, retrying in ${
          RETRY_DELAYS_MS[attempt] / 1000
        }s`
      );
      await sleep(RETRY_DELAYS_MS[attempt]);
    }
  }
  throw new Error(`${model} retries exhausted — ${lastErr}`);
}

/**
 * Public API: call Claude (Sonnet by default) with full hardening.
 *
 * Tries the primary model with retry. On exhaustion, falls back to Haiku
 * with retry. If both exhaust, throws so the caller can run its own
 * template-based fallback (see generate-dream's fallbackReasons flow).
 */
export async function callSonnet(
  brief: string,
  anthropicKey: string | undefined,
  maxTokens: number = 200
): Promise<SonnetResult> {
  if (!anthropicKey) throw new Error('No Anthropic API key');

  // Try primary (Sonnet)
  try {
    const r = await callModelWithRetry(PRIMARY_MODEL, brief, anthropicKey, maxTokens);
    return {
      text: r.text,
      brief,
      rawResponse: r.rawResponse,
      modelUsed: PRIMARY_MODEL,
      retries: r.retries,
      fellBackToSecondary: false,
    };
  } catch (primaryErr) {
    console.warn(
      `[llm] primary model failed after retries: ${(primaryErr as Error).message} — falling back to ${SECONDARY_MODEL}`
    );
  }

  // Fallback: Haiku
  const r = await callModelWithRetry(SECONDARY_MODEL, brief, anthropicKey, maxTokens);
  return {
    text: r.text,
    brief,
    rawResponse: r.rawResponse,
    modelUsed: SECONDARY_MODEL,
    retries: r.retries,
    fellBackToSecondary: true,
  };
}
