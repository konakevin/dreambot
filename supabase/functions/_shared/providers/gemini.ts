/**
 * Google Gemini image generation provider (Nano Banana family).
 *
 * Model identifiers:
 *   - google/gemini-3-image-preview  → Nano Banana Pro (resolution-priced)
 *   - google/gemini-2-image          → Nano Banana 2 (Gemini 2.5 Flash)
 *
 * API: POST https://generativelanguage.googleapis.com/v1beta/models/<model>:generateContent
 *   Body: { contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio, ... } } }
 *
 * Response: inline base64 image in `candidates[0].content.parts[].inlineData.data`
 *
 * Pricing (verified 2026-06-08 against ai.google.dev + provider trackers):
 *   gemini-3-pro-image (Nano Banana Pro): ~$0.134/img at 1K AND 2K (same
 *     price), ~$0.24 at 4K — synchronous API (batch is ~half but we don't
 *     use it). This is the 5-SPARKLE tier in modelPricing.ts ($0.134 = 13¢).
 *   gemini-2.5-flash-image (Nano Banana): ~$0.039 (1024×1024 baseline), 1✦.
 *
 * We pin Nano Banana Pro to 1K. 1K and 2K bill the same (~$0.134), so the
 * pin doesn't save vs 2K — it guards against a 4K default ($0.24) blowing
 * the cost basis. At 5 sparkles the $0.134 cost is well-covered (~$0.027/
 * sparkle, the most cost-efficient tier we sell).
 *
 * NSFW: Gemini's safety system returns finishReason='SAFETY' or similar.
 *   We re-throw with NSFW_CONTENT: prefix so upstream retry kicks in.
 */

export interface GeminiImageResult {
  url: string;
  predictionId: string;
}

const GEMINI_MODEL_MAP: Record<string, string> = {
  // Nano Banana Pro. Correct GA id is 'gemini-3-pro-image-preview' (verified
  // against ai.google.dev 2026-05-25) — the bare 'gemini-3-image-preview' 404s.
  'google/gemini-3-image-preview': 'gemini-3-pro-image-preview',
  // 2026-05-25: was 'gemini-2.0-flash-exp-image-generation' — that preview id
  // is retired (404 "not found for v1beta / generateContent"). Nano Banana 2 is
  // the GA Gemini 2.5 Flash Image model (matches the pricing note above).
  'google/gemini-2-image': 'gemini-2.5-flash-image',
};

export function isGeminiModel(modelId: string): boolean {
  return modelId.startsWith('google/');
}

// Safe byte→base64 (chunked so a multi-MB image can't blow the call stack via
// String.fromCharCode(...spread)).
function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

// Turn a restyle source (data: URI, http(s) URL, or bare base64) into a Gemini
// inlineData part so Nano Banana can EDIT the photo (restyle) rather than
// generate from scratch.
async function toInlineData(inputImage: string): Promise<{ mimeType: string; data: string }> {
  if (inputImage.startsWith('data:')) {
    const comma = inputImage.indexOf(',');
    const header = inputImage.slice(5, comma); // e.g. "image/jpeg;base64"
    const mimeType = header.split(';')[0] || 'image/jpeg';
    return { mimeType, data: inputImage.slice(comma + 1) };
  }
  if (inputImage.startsWith('http')) {
    const res = await fetch(inputImage);
    if (!res.ok) throw new Error(`Gemini edit: source fetch failed (${res.status})`);
    const ct = res.headers.get('content-type') || 'image/jpeg';
    const bytes = new Uint8Array(await res.arrayBuffer());
    return { mimeType: ct.split(';')[0], data: bytesToBase64(bytes) };
  }
  // Assume raw base64 (no data: prefix).
  return { mimeType: 'image/jpeg', data: inputImage };
}

export async function generateGeminiImage(
  modelId: string,
  prompt: string,
  geminiKey: string,
  inputImage?: string
): Promise<GeminiImageResult> {
  const geminiModel = GEMINI_MODEL_MAP[modelId];
  if (!geminiModel) {
    throw new Error(`Unknown Gemini model: ${modelId}`);
  }
  if (!geminiKey) {
    throw new Error('GEMINI_API_KEY missing');
  }

  // Restyle (edit) mode: include the source photo as an inlineData part alongside
  // the prompt. Without it, Gemini generates from scratch (ignores the photo).
  const requestParts: Array<Record<string, unknown>> = [{ text: prompt }];
  if (inputImage) {
    const inline = await toInlineData(inputImage);
    requestParts.push({ inlineData: inline });
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`;

  // Nano Banana Pro is resolution-priced: ~$0.134/img at 1K and 2K (same),
  // ~$0.24 at 4K (synchronous API). We pin to 1K so a 4K default can't push
  // the cost to $0.24 — at the 5-sparkle tier $0.134 has healthy margin.
  const isNanoBananaPro = modelId === 'google/gemini-3-image-preview';

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: requestParts }],
      generationConfig: {
        responseModalities: ['IMAGE'],
        // imageConfig.aspectRatio is honored on BOTH gemini-3-pro-image-preview
        // AND gemini-2.5-flash-image — the old comment claiming Flash ignored
        // it was wrong, and Nano Banana 2 renders at default 1024x1024 square
        // without it (cropping on the portrait fullscreen viewer). `imageSize`
        // is Pro-only — Flash ignores it. NOTE: the size field is `imageSize`
        // ('1K'/'2K'/'4K') — NOT `resolution`, which 400s with "Unknown name
        // 'resolution' at ...image_config". 2026-05-25 / aspect-fix 2026-05-30.
        imageConfig: {
          aspectRatio: '9:16',
          ...(isNanoBananaPro && { imageSize: '1K' }),
        },
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    if (res.status === 400 && /SAFETY|HARM|blocked/i.test(text)) {
      throw new Error('NSFW_CONTENT: Gemini safety filter rejected the prompt.');
    }
    throw new Error(`Gemini submit failed (${res.status}): ${text.slice(0, 300)}`);
  }

  const data = await res.json();

  // Check for safety block in the response (Gemini sometimes 200s with
  // finishReason set instead of a 4xx). SAFETY = legacy, IMAGE_SAFETY =
  // current, PROHIBITED_CONTENT = stricter category seen on Nano Banana 2
  // (often false-positives on innocuous prompts). All three should map to
  // our NSFW_CONTENT: prefix so the upstream retry loop kicks in.
  const candidate = data.candidates?.[0];
  const SAFETY_REASONS = new Set(['SAFETY', 'IMAGE_SAFETY', 'PROHIBITED_CONTENT']);
  if (candidate?.finishReason && SAFETY_REASONS.has(candidate.finishReason)) {
    throw new Error(`NSFW_CONTENT: Gemini ${candidate.finishReason} on response.`);
  }

  const parts = candidate?.content?.parts ?? [];
  const imagePart = parts.find((p: { inlineData?: { data?: string } }) => p.inlineData?.data);
  const b64 = imagePart?.inlineData?.data;
  if (!b64) {
    throw new Error(`Gemini returned no image: ${JSON.stringify(data).slice(0, 200)}`);
  }

  // Gemini returns base64 inline — we wrap as data URL so the caller's
  // storage-upload step can fetch + persist it just like a Replicate URL.
  const dataUrl = `data:image/png;base64,${b64}`;

  return {
    url: dataUrl,
    predictionId: `gemini-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
  };
}
