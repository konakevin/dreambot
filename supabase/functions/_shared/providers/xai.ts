/**
 * xAI (Grok) image generation provider.
 *
 * Model identifiers:
 *   - xai/grok-imagine-image          → grok-imagine-image          (standard)
 *   - xai/grok-imagine-image-quality  → grok-imagine-image-quality  (high fidelity)
 *
 * We use the NEWER "imagine" model, NOT grok-2-image: grok-2-image always runs
 * the prompt through a chat model that rewrites/expands it (returns
 * revised_prompt), which risks mangling DreamBot's tuned face-swap + negation
 * prompts. The imagine models don't document that revision step and expose real
 * aspect-ratio/resolution control.
 *
 * API: POST https://api.x.ai/v1/images/generations (OpenAI-compatible)
 *   { model, prompt, n, response_format: 'b64_json', aspect_ratio, resolution }
 *   Response: data[0].b64_json (base64 JPG) → wrapped as a data: URL for the
 *   storage-upload step (same as the OpenAI/Gemini providers).
 *
 * TEXT-TO-IMAGE ONLY — no input-image / img2img. Callers gate Grok out of
 * restyle / Kontext (flux-kontext + input_image) modes before dispatching here.
 *
 * Pricing (rough): grok-imagine-image 1k ~$0.02; quality tier ~$0.07.
 *
 * NSFW: xAI moderates harder than Flux. A rejected prompt surfaces as a 4xx
 *   with a content/policy message; we re-throw with the NSFW_CONTENT: prefix so
 *   the upstream retry logic kicks in.
 *
 * ASPECT RATIO: xAI accepts an `aspect_ratio` string. We default '2:3' (the
 *   nearest portrait to the feed's 9:16), same display handling as OpenAI's
 *   1024x1536 (feed cover-crops; full-screen may show bars).
 */

export interface XaiImageResult {
  url: string;
  predictionId: string;
}

const XAI_MODEL_MAP: Record<string, string> = {
  'xai/grok-imagine-image': 'grok-imagine-image',
  'xai/grok-imagine-image-quality': 'grok-imagine-image-quality',
};

export function isXaiModel(modelId: string): boolean {
  return modelId.startsWith('xai/');
}

export async function generateXaiImage(
  modelId: string,
  prompt: string,
  xaiKey: string,
  opts?: {
    aspectRatio?: string;
    resolution?: '1k' | '2k';
  }
): Promise<XaiImageResult> {
  const xaiModel = XAI_MODEL_MAP[modelId];
  if (!xaiModel) {
    throw new Error(`Unknown xAI model: ${modelId}`);
  }
  if (!xaiKey) {
    throw new Error('XAI_API_KEY missing');
  }

  const aspectRatio = opts?.aspectRatio ?? '2:3';
  const resolution = opts?.resolution ?? '1k';

  const res = await fetch('https://api.x.ai/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${xaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: xaiModel,
      prompt,
      n: 1,
      response_format: 'b64_json',
      aspect_ratio: aspectRatio,
      resolution,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    // Map xAI moderation refusals to the shared NSFW convention so the retry
    // loop fires (same pattern as OpenAI/Gemini).
    if (
      (res.status === 400 || res.status === 422) &&
      /content|policy|safety|moderat|reject|nsfw/i.test(text)
    ) {
      throw new Error('NSFW_CONTENT: xAI safety filter rejected the prompt.');
    }
    throw new Error(`xAI submit failed (${res.status}): ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  // grok-imagine-image returns base64 (b64_json). Wrap as a data URL so the
  // caller's storage-upload step fetches + persists it like any other result.
  const b64 = data.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error(`xAI returned no image: ${JSON.stringify(data).slice(0, 200)}`);
  }
  const dataUrl = `data:image/jpeg;base64,${b64}`;
  return {
    url: dataUrl,
    predictionId: `xai-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
  };
}
