/**
 * Anthropic Sonnet — the sole LLM for all prompt-writing paths across V4,
 * nightly, and (future) restyle-photo rewrite steps. Haiku is reserved for
 * vision only (see vision.ts).
 *
 * Returns the brief (input) and rawResponse (pre-trim API output) so every
 * call site can log the full exchange to ai_generation_log for observability.
 * `text` is the trimmed, ≥10-char response used downstream.
 */

export interface SonnetResult {
  text: string;
  brief: string;
  rawResponse: string;
}

export async function callSonnet(
  brief: string,
  anthropicKey: string | undefined,
  maxTokens: number = 200
): Promise<SonnetResult> {
  if (!anthropicKey) throw new Error('No API key');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': anthropicKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: brief }],
    }),
  });
  if (!res.ok) throw new Error(`Sonnet ${res.status}`);
  const data = await res.json();
  const rawResponse = data.content?.[0]?.text ?? '';
  const text = rawResponse.trim();
  if (text.length < 10) throw new Error('Sonnet response too short');
  return { text, brief, rawResponse };
}
