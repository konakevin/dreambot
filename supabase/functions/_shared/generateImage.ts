/**
 * Multi-provider image generation. Dispatches by model-name prefix:
 *   • openai/*        → OpenAI Images API (GPT Image 1/2)
 *   • google/*        → Google Gemini API (Nano Banana Pro / 2)
 *   • (everything else) → Replicate (Flux family, SDXL, Kontext, etc.)
 *
 * NSFW handling: each provider throws errors starting with `NSFW_CONTENT:` so
 * the top-level retry loop fires regardless of provider. `generateImage`
 * retries up to 2x on NSFW flags with a fresh provider call.
 *
 * Used by all four pipelines (V4 generate-dream, nightly, restyle-photo,
 * first-dream queue worker).
 */

import { pickModel } from './modelPicker.ts';
import { generateOpenAIImage, isOpenAIModel } from './providers/openai.ts';
import { generateGeminiImage, isGeminiModel } from './providers/gemini.ts';

export interface GenerateImageResult {
  url: string;
  predictionId: string;
  /** Number of NSFW retries that occurred before success. 0 = passed on first try. */
  nsfwRetries?: number;
  /** Which provider/model produced this render — for observability + sparkle pricing. */
  provider?: 'replicate' | 'openai' | 'gemini';
  model?: string;
}

export interface GenerateImageCredentials {
  replicateToken: string;
  openaiKey?: string;
  geminiKey?: string;
}

const SDXL_VERSION = '7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc';

// Render-model fallback for a deprecation 404. Version-pinned models (SDXL —
// stability-ai/sdxl has no name endpoint, so it MUST be called by version hash)
// 404 forever once Replicate retires that version. Rather than hard-fail every
// roll, fall back ONCE to this stable, name-based model so a deprecation
// degrades to a different render instead of a dead dream.
const FALLBACK_RENDER_MODEL = 'black-forest-labs/flux-1.1-pro-ultra';
const NSFW_MAX_RETRIES = 2;

/**
 * Backwards-compatible signature: callers can pass either a plain replicate
 * token (existing call sites) or a credentials object with all three keys.
 */
function asCredentials(arg: string | GenerateImageCredentials): GenerateImageCredentials {
  if (typeof arg === 'string') {
    return { replicateToken: arg };
  }
  return arg;
}

export async function generateImage(
  mode: string,
  prompt: string,
  inputImage: string | undefined,
  credentials: string | GenerateImageCredentials,
  modelOverride?: string,
  outputFormat: 'png' | 'jpg' = 'png'
): Promise<GenerateImageResult> {
  const creds = asCredentials(credentials);
  let lastErr: Error | null = null;
  for (let attempt = 0; attempt <= NSFW_MAX_RETRIES; attempt++) {
    try {
      const result = await generateImageOnce(
        mode,
        prompt,
        inputImage,
        creds,
        modelOverride,
        outputFormat
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
  creds: GenerateImageCredentials,
  modelOverride?: string,
  outputFormat: 'png' | 'jpg' = 'png'
): Promise<GenerateImageResult> {
  const picked = await pickModel(mode, prompt);
  const model = modelOverride || picked.model;
  const inputOverrides = modelOverride ? {} : picked.inputOverrides;

  // ── Provider dispatch by model-name prefix ────────────────────────────
  if (isOpenAIModel(model)) {
    const r = await generateOpenAIImage(model, prompt, creds.openaiKey ?? '');
    return { url: r.url, predictionId: r.predictionId, provider: 'openai', model };
  }
  if (isGeminiModel(model)) {
    const r = await generateGeminiImage(model, prompt, creds.geminiKey ?? '');
    return { url: r.url, predictionId: r.predictionId, provider: 'gemini', model };
  }

  // ── Default: Replicate ────────────────────────────────────────────────
  const replicateToken = creds.replicateToken;
  if (!replicateToken) {
    throw new Error('REPLICATE_API_TOKEN missing');
  }
  const isSDXL = model === 'sdxl';

  const input: Record<string, unknown> = {
    prompt,
    ...(!isSDXL
      ? {
          aspect_ratio: '9:16',
          num_outputs: 1,
          // Default to PNG output (lossless, no grain). Caller passes
          // outputFormat='jpg' when the result feeds the dual-face-swap
          // pipeline — see 2026-05-09 incident note where WebP decode
          // blew through Supabase's 150 MB / 2 s per-invocation budget
          // (HTTP 546 WORKER_RESOURCE_LIMIT). PNG decode is lighter than
          // WebP but still heavier than JPEG, so we keep JPEG for the
          // dual-face-swap path explicitly to preserve that fix.
          output_format: outputFormat,
          output_quality: 100,
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
    input.output_quality = 95;
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
    return generateImageOnce(mode, prompt, inputImage, creds, modelOverride);
  }

  if (!res.ok) {
    const text = await res.text();
    // 404 = the model version/name no longer exists on Replicate — typically a
    // version-pinned model (e.g. SDXL) whose pinned version was deprecated.
    // Fall back ONCE to a stable name-based model so a deprecation degrades to a
    // different render rather than failing every dream. Guard recursion: don't
    // fall back if we're ALREADY on the fallback model.
    if (res.status === 404 && model !== FALLBACK_RENDER_MODEL) {
      console.warn(
        `[generateImage] ${model} submit 404'd (deprecated version/model?) — falling back to ${FALLBACK_RENDER_MODEL}: ${text.slice(0, 120)}`
      );
      return generateImageOnce(
        mode,
        prompt,
        inputImage,
        creds,
        FALLBACK_RENDER_MODEL,
        outputFormat
      );
    }
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
      if (outUrl) return { url: outUrl, predictionId: data.id, provider: 'replicate', model };
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
