/**
 * OpenAI image generation provider.
 *
 * Model identifiers:
 *   - openai/gpt-image-1  → OpenAI's gpt-image-1 (5cr tier)
 *   - openai/gpt-image-2  → OpenAI's gpt-image-2 (3cr tier — newer, prompt-fidelity)
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
 * ASPECT-RATIO NOTE (2026-06-04). The OpenAI API only accepts size from a
 * fixed enum (1024x1024 / 1024x1536 / 1536x1024) — there is no 9:16
 * generation option. We pick 1024x1536 (2:3 = 0.667) as the nearest
 * portrait. DreamCard feed view uses contentFit='cover' so the source
 * crops a little horizontally and fills the card; BotImageViewer
 * full-screen uses contentFit='contain' so non-9:16 sources show
 * top/bottom bars (preserves the full render). A server-side
 * center-crop would butcher off-center subjects — display-side
 * handling is the right place to address bars, not the provider.
 */

export interface OpenAIImageResult {
  url: string;
  predictionId: string;
}

const OPENAI_MODEL_MAP: Record<string, string> = {
  'openai/gpt-image-1': 'gpt-image-1',
  'openai/gpt-image-2': 'gpt-image-2',
};

export function isOpenAIModel(modelId: string): boolean {
  return modelId.startsWith('openai/');
}

export async function generateOpenAIImage(
  modelId: string,
  prompt: string,
  openaiKey: string,
  opts?: {
    size?: '1024x1024' | '1024x1536' | '1536x1024' | 'auto';
    quality?: 'low' | 'medium' | 'high' | 'auto';
  }
): Promise<OpenAIImageResult> {
  const openaiModel = OPENAI_MODEL_MAP[modelId];
  if (!openaiModel) {
    throw new Error(`Unknown OpenAI model: ${modelId}`);
  }
  if (!openaiKey) {
    throw new Error('OPENAI_API_KEY missing');
  }

  // DreamBot renders are portrait → gpt-image portrait is 1024x1536 (NOT the
  // DALL-E-3 1024x1792, which gpt-image rejects). 'medium' quality keeps the
  // cost basis (~$0.06) in line with modelPricing.
  const size = opts?.size ?? '1024x1536';
  const quality = opts?.quality ?? 'medium';

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
