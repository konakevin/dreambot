/**
 * OpenAI image generation provider.
 *
 * Model identifiers:
 *   - openai/gpt-image-1  → OpenAI's gpt-image-1 (5cr tier)
 *   - openai/gpt-image-2  → OpenAI's gpt-image-2 (3cr tier — newer, prompt-fidelity)
 *
 * API: POST https://api.openai.com/v1/images/generations
 *   { model, prompt, n, size, quality, response_format: 'url' }
 *
 * Pricing (rough, check OpenAI dashboard for current):
 *   gpt-image-1 standard 1024x1024: ~$0.040
 *   gpt-image-1 hd 1024x1024: ~$0.080
 *   gpt-image-2 standard: ~$0.040 (announced cheaper)
 *
 * NSFW: OpenAI has its own safety system. Failed safety surfaces as
 *   a 400 with `code: 'content_policy_violation'`. We re-throw with
 *   our NSFW_CONTENT: prefix so the upstream retry logic kicks in.
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
  opts?: { size?: '1024x1024' | '1024x1792' | '1792x1024'; quality?: 'standard' | 'hd' }
): Promise<OpenAIImageResult> {
  const openaiModel = OPENAI_MODEL_MAP[modelId];
  if (!openaiModel) {
    throw new Error(`Unknown OpenAI model: ${modelId}`);
  }
  if (!openaiKey) {
    throw new Error('OPENAI_API_KEY missing');
  }

  // DreamBot renders are portrait 9:16 → use 1024x1792 (portrait)
  const size = opts?.size ?? '1024x1792';
  const quality = opts?.quality ?? 'standard';

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
      response_format: 'url',
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
  const url = data.data?.[0]?.url;
  if (!url) {
    throw new Error(`OpenAI returned no URL: ${JSON.stringify(data).slice(0, 200)}`);
  }

  // OpenAI URLs expire after ~60 minutes — caller must persist the image
  // to Supabase Storage immediately (which our pipeline already does).
  return {
    url,
    predictionId: `openai-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
  };
}
