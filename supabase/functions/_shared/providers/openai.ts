/**
 * OpenAI image generation provider.
 *
 * Model identifiers:
 *   - openai/gpt-image-1            → gpt-image-1 (5cr tier)
 *   - openai/gpt-image-2            → gpt-image-2 (3cr tier — newer, prompt-fidelity)
 *   - openai/gpt-image-2.5-flare    → gpt-image-2.5-flare (fast/everyday)
 *   - openai/gpt-image-2.5-sunburst → gpt-image-2.5-sunburst (most capable, edit precision)
 *
 * API: POST https://api.openai.com/v1/images/generations
 *   { model, prompt, n, size: '1024x1536', quality: 'low'|'medium'|'high'|'auto' }
 *   NO response_format — gpt-image-1/2 reject it and always return b64_json.
 *   Response: data[0].b64_json (base64) → we wrap as a data: URL for the
 *   storage-upload step (same as the Gemini provider).
 *
 * Pricing (rough, check OpenAI dashboard for current):
 *   gpt-image medium 1024x1536: ~$0.06
 *   gpt-image high 1024x1536: ~$0.19 (we use medium to hold the cost basis)
 *
 * NSFW: OpenAI has its own safety system. Failed safety surfaces as
 *   a 400 with `code: 'content_policy_violation'`. We re-throw with
 *   our NSFW_CONTENT: prefix so the upstream retry logic kicks in.
 *
 * ASPECT RATIO — differs by generation, and this is why gpt-image-2 got banned
 * from nightly.
 *
 * gpt-image-1/2 accept size only from a fixed enum (1024x1024 / 1024x1536 /
 * 1536x1024), so the closest portrait is 1024x1536 = 2:3 (0.667). That is WIDER
 * than the app's 9:16 (0.5625) cards, which is what "gpt-image-2 renders wide
 * images" meant when Kevin pulled it from the nightly rotation (2026-08-25,
 * NIGHTLY_BANNED_MODELS). Display handles it rather than the provider: the feed
 * uses contentFit='cover' (crops a little), full-screen uses 'contain' (bars).
 * A server-side centre-crop would butcher off-centre subjects.
 *
 * gpt-image-2.5 takes ARBITRARY WIDTHxHEIGHT (probed 2026-09-16: '9:16' is
 * rejected — it wants pixels — but 1152x2048 and even 2160x3840 return 200), so
 * the 2.5 models render TRUE 9:16 natively and the wide-aspect problem simply
 * does not apply to them. Hence the per-model default below; do NOT "simplify"
 * it back to one shared size.
 */

export interface OpenAIImageResult {
  url: string;
  predictionId: string;
}

const OPENAI_MODEL_MAP: Record<string, string> = {
  'openai/gpt-image-1': 'gpt-image-1',
  'openai/gpt-image-2': 'gpt-image-2',
  'openai/gpt-image-2.5-flare': 'gpt-image-2.5-flare',
  'openai/gpt-image-2.5-sunburst': 'gpt-image-2.5-sunburst',
};

/**
 * Per-model render defaults. gpt-image-1/2 are pinned to the enum's nearest
 * portrait; 2.5 renders true 9:16 because its API takes arbitrary pixel sizes.
 *
 * Quality is a real cost lever on 2.5 and was MEASURED, not guessed (2026-09-16,
 * $30/1M output tokens): medium 1152x2048 = 367 tokens = $0.011, high = 1413
 * tokens = $0.042. gpt-image-2 at our production 1024x1536/medium is 1372 tokens
 * = $0.041. So 2.5 at HIGH costs what gpt-image-2 costs today while rendering a
 * larger, correctly-shaped frame. Keep this in step with modelPricing.ts.
 */
const OPENAI_RENDER_DEFAULTS: Record<string, { size: string; quality: string }> = {
  'openai/gpt-image-2.5-flare': { size: '1152x2048', quality: 'high' },
  'openai/gpt-image-2.5-sunburst': { size: '1152x2048', quality: 'high' },
};
const OPENAI_LEGACY_DEFAULTS = { size: '1024x1536', quality: 'medium' };

export function isOpenAIModel(modelId: string): boolean {
  return modelId.startsWith('openai/');
}

export async function generateOpenAIImage(
  modelId: string,
  prompt: string,
  openaiKey: string,
  opts?: {
    /** WIDTHxHEIGHT, or 'auto'. gpt-image-1/2 only accept the 1024x1024 /
     *  1024x1536 / 1536x1024 enum; 2.5 accepts arbitrary sizes. */
    size?: string;
    /** 'xhigh' and 'max' exist on 2.5 only. */
    quality?: 'low' | 'medium' | 'high' | 'xhigh' | 'max' | 'auto';
  }
): Promise<OpenAIImageResult> {
  const openaiModel = OPENAI_MODEL_MAP[modelId];
  if (!openaiModel) {
    throw new Error(`Unknown OpenAI model: ${modelId}`);
  }
  if (!openaiKey) {
    throw new Error('OPENAI_API_KEY missing');
  }

  // DreamBot renders are portrait. See the aspect-ratio note above: 1/2 get the
  // enum's nearest portrait (1024x1536 = 2:3), 2.5 gets a true 9:16 (1152x2048).
  const defaults = OPENAI_RENDER_DEFAULTS[modelId] ?? OPENAI_LEGACY_DEFAULTS;
  const size = opts?.size ?? defaults.size;
  const quality = opts?.quality ?? defaults.quality;

  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: openaiModel,
      prompt,
      n: 1,
      size,
      quality,
      // gpt-image-1/2 do NOT accept response_format (a DALL-E-era param) and
      // ALWAYS return base64 (b64_json). Sending it 400s with
      // "Unknown parameter: 'response_format'". We parse b64 below.
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    // OpenAI safety-system rejection
    if (res.status === 400 && /content_policy_violation|safety_violation|rejected/i.test(text)) {
      throw new Error('NSFW_CONTENT: OpenAI safety filter rejected the prompt.');
    }
    throw new Error(`OpenAI submit failed (${res.status}): ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  // gpt-image-1/2 return base64 (b64_json), never a URL. Wrap it as a data URL
  // so the caller's storage-upload step fetches + persists it exactly like a
  // Replicate / Gemini result (the pipeline already handles data: URLs — see
  // providers/gemini.ts).
  const b64 = data.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error(`OpenAI returned no image: ${JSON.stringify(data).slice(0, 200)}`);
  }
  const dataUrl = `data:image/png;base64,${b64}`;
  return {
    url: dataUrl,
    predictionId: `openai-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
  };
}
