/**
 * Style distiller — extracts subject-free style fingerprints from a
 * raw Flux ai_prompt for the Dream Like This (DLT) feature.
 *
 * Why: DLT used to forward the entire source ai_prompt as a "style
 * reference" but Flux/Sonnet would leak subject tokens (vampire,
 * cathedral, blood moon) into the user's NEW subject. The single
 * negative instruction "Copy VISUAL STYLE, not subject" was too weak.
 *
 * This distiller pre-strips subjects so by the time Sonnet sees the
 * styleReference block, there are NO subject tokens to leak — only
 * palette, lighting, technique, mood, atmosphere, texture words.
 *
 * Called once at insert time by both generate-dream and nightly-dreams
 * (fire-and-forget so the user's render isn't blocked). The result is
 * stored on uploads.style_summary and read back by DLT requests.
 *
 * Failure mode: returns null. Caller stores NULL on the row. DLT then
 * falls back to the raw ai_prompt with the existing (weaker) filtering
 * — same as today's behavior. Zero regression scenario.
 */

const HAIKU_MODEL = 'claude-haiku-4-5-20251001';
const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504, 529]);
const RETRY_DELAYS_MS = [1000, 3000, 8000];

const SYSTEM_PROMPT = `You extract pure style descriptors from a Flux AI prompt.

OUTPUT: a comma-separated list of style descriptors. Max 25 words total.

KEEP: color words, palette, light direction/quality/temperature, camera/lens descriptors, medium-and-technique words ("oil paint", "heavy ink", "watercolor washes", "pixel art", "claymation"), atmosphere/mood words ("haunting", "luminous", "moody", "dreamy"), texture words, time-of-day if it's about LIGHT not subject ("golden hour", "blue hour"), abstract era/genre style descriptors ("baroque", "art deco", "noir") IF they describe the technique not the subject.

STRIP COMPLETELY: subjects (people, animals, creatures, objects, vehicles, weapons), body parts, named characters, named places, named IP/franchises (Castlevania, Blade Runner, Bloodborne, Studio Ghibli, etc — convert to generic mood words instead, e.g. "Castlevania" → "gothic horror mood"), specific buildings ("cathedral", "castle", "tower" — DROP unless it's purely architectural style language), clothing items, actions/poses, body language, named tech ("light saber", "iPhone"), specific numbers, named events, pets, dates, anything a camera would see as a "thing" rather than a "quality."

If the prompt is too thin to extract style (e.g., 10 words of pure subject with no style language), output exactly: NO_STYLE_SIGNAL

Do NOT add a preamble. Do NOT wrap in quotes. Output the comma-separated descriptors only.

Examples:

Input: "watercolor, gothic cathedral at midnight, vampire portrait three-quarter view, blood moon, candlelight, oil paint and heavy ink, Castlevania energy, no text, ultra detailed"
Output: watercolor, oil paint, heavy ink, candlelight palette, blood-moon reds, midnight blues, deep shadows, gothic horror mood, ultra detailed

Input: "pixel art, retro arcade machines, neon city street, cyberpunk vibes, 16-bit aesthetic, hot pink and electric blue palette, scanline effect"
Output: pixel art, 16-bit aesthetic, neon palette, hot pink, electric blue, scanline texture, cyberpunk mood, retro

Input: "watercolor portrait of a smiling woman in a meadow"
Output: watercolor, soft naturalistic palette, gentle illumination

Input: "a guy"
Output: NO_STYLE_SIGNAL`;

/**
 * Distill a Flux ai_prompt into a style-only fingerprint via Haiku.
 *
 * Returns the distilled string on success, or null on:
 *   - missing/empty input
 *   - missing API key
 *   - Anthropic returns NO_STYLE_SIGNAL (input too thin)
 *   - all retries exhausted (network, 5xx, etc.)
 *
 * Callers should store null in the DB and rely on DLT's existing
 * fallback (raw ai_prompt with weaker filtering) for those rows.
 */
export async function distillStyle(
  rawPrompt: string | null | undefined,
  anthropicKey: string | undefined
): Promise<string | null> {
  if (!rawPrompt || !rawPrompt.trim()) return null;
  if (!anthropicKey) return null;

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: HAIKU_MODEL,
          max_tokens: 80,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: rawPrompt }],
        }),
      });

      if (!res.ok) {
        if (RETRYABLE_STATUSES.has(res.status) && attempt < RETRY_DELAYS_MS.length) {
          await sleep(RETRY_DELAYS_MS[attempt]);
          continue;
        }
        console.warn(`[styleDistiller] non-retryable ${res.status}`);
        return null;
      }

      const data = await res.json();
      const text = (data?.content?.[0]?.text ?? '').trim();
      if (!text) return null;
      if (text === 'NO_STYLE_SIGNAL' || text.startsWith('NO_STYLE_SIGNAL')) {
        return null;
      }
      // Soft sanity: distilled output should be under ~250 chars.
      // Anything longer means Haiku is leaking subjects — clip and trust.
      return text.length > 280 ? text.slice(0, 280) : text;
    } catch (err) {
      if (attempt < RETRY_DELAYS_MS.length) {
        console.warn(`[styleDistiller] attempt ${attempt + 1} failed: ${(err as Error).message}`);
        await sleep(RETRY_DELAYS_MS[attempt]);
        continue;
      }
      console.warn(`[styleDistiller] retries exhausted: ${(err as Error).message}`);
      return null;
    }
  }
  return null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
