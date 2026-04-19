/**
 * Replicate image generation — submit prediction + poll until result.
 * NSFW error surfaces with a distinct `NSFW_CONTENT:` prefix so callers can
 * branch on it. Used by all three pipelines (V4, nightly, restyle-photo).
 *
 * Ship 2.5: the top-level `generateImage` now retries up to 2x on NSFW flags
 * with a fresh Replicate call (same prompt, new stochastic seed). Flux's
 * safety filter is non-deterministic enough that a legitimate prompt flagged
 * once usually passes on the second try. `nsfwRetries` is surfaced in the
 * result for observability.
 */

import { pickModel } from './modelPicker.ts';

export interface GenerateImageResult {
  url: string;
  predictionId: string;
  /** Number of NSFW retries that occurred before success. 0 = passed on first try. */
  nsfwRetries?: number;
}

const SDXL_VERSION = '7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc';
const NSFW_MAX_RETRIES = 2;

export async function generateImage(
  mode: string,
  prompt: string,
  inputImage: string | undefined,
  replicateToken: string,
  modelOverride?: string
): Promise<GenerateImageResult> {
  let lastErr: Error | null = null;
  for (let attempt = 0; attempt <= NSFW_MAX_RETRIES; attempt++) {
    try {
      const result = await generateImageOnce(
        mode,
        prompt,
        inputImage,
        replicateToken,
        modelOverride
      );
      return { ...result, nsfwRetries: attempt };
    } catch (err) {
      const msg = (err as Error).message || '';
      if (msg.startsWith('NSFW_CONTENT') && attempt < NSFW_MAX_RETRIES) {
        console.warn(
          `[generateImage] NSFW flag on attempt ${attempt + 1}/${NSFW_MAX_RETRIES + 1}, retrying...`
        );
        lastErr = err as Error;
        continue;
      }
      throw err;
    }
  }
  throw lastErr ?? new Error('NSFW_CONTENT: exhausted retries');
}

async function generateImageOnce(
  mode: string,
  prompt: string,
  inputImage: string | undefined,
  replicateToken: string,
  modelOverride?: string
): Promise<GenerateImageResult> {
  const picked = await pickModel(mode, prompt);
  const model = modelOverride || picked.model;
  const inputOverrides = modelOverride ? {} : picked.inputOverrides;
  const isSDXL = model === 'sdxl';

  const input: Record<string, unknown> = {
    prompt,
    ...(!isSDXL
      ? {
          aspect_ratio: '9:16',
          num_outputs: 1,
          output_format: 'jpg',
        }
      : {
          width: 768,
          height: 1344,
          num_outputs: 1,
        }),
    ...inputOverrides,
  };

  if (mode === 'flux-kontext' && inputImage) {
    input.input_image = inputImage;
    input.output_quality = 90;
    input.safety_tolerance = 2;
    input.prompt_upsampling = true;
  }

  // SDXL uses version-based API; Flux uses model-based API
  const url = isSDXL
    ? 'https://api.replicate.com/v1/predictions'
    : `https://api.replicate.com/v1/models/${model}/predictions`;
  const body = isSDXL ? { version: SDXL_VERSION, input } : { input };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${replicateToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (res.status === 429) {
    const json = await res.json();
    const retryAfter = json.retry_after ?? 6;
    await new Promise((r) => setTimeout(r, retryAfter * 1000));
    return generateImageOnce(mode, prompt, inputImage, replicateToken, modelOverride);
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Replicate submit failed (${res.status}): ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  if (!data.id) throw new Error('No prediction ID');

  // Poll for result
  const maxPolls = mode === 'flux-kontext' ? 30 : 60;
  const intervalMs = mode === 'flux-kontext' ? 2000 : 1500;

  for (let i = 0; i < maxPolls; i++) {
    await new Promise((r) => setTimeout(r, intervalMs));
    const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${data.id}`, {
      headers: { Authorization: `Bearer ${replicateToken}` },
    });
    const pollData = await pollRes.json();
    if (pollData.status === 'succeeded') {
      const outUrl = typeof pollData.output === 'string' ? pollData.output : pollData.output?.[0];
      if (outUrl) return { url: outUrl, predictionId: data.id };
    }
    if (pollData.status === 'failed' || pollData.status === 'canceled') {
      const errMsg = pollData.error ?? 'unknown';
      const isNsfw =
        /nsfw|safety|content.?filter|inappropriate|violat/i.test(errMsg) ||
        /nsfw|safety/i.test(JSON.stringify(pollData.logs ?? ''));
      if (isNsfw) {
        throw new Error('NSFW_CONTENT: The generated image was flagged by our safety filters.');
      }
      throw new Error(`Generation ${pollData.status}: ${errMsg}`);
    }
  }
  throw new Error('Generation timed out');
}
