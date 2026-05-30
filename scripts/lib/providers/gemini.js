/**
 * Google Gemini image generation provider — Node port of
 * `supabase/functions/_shared/providers/gemini.ts`. The Deno module is
 * the source of truth; if you change behavior, change BOTH.
 *
 * Model identifiers:
 *   google/gemini-3-image-preview → gemini-3-pro-image-preview  (Nano Banana Pro)
 *   google/gemini-2-image         → gemini-2.5-flash-image      (Nano Banana 2)
 *
 * Output: a data: URL (base64-PNG) — same shape as the OpenAI provider so
 * the bot engine's downstream upload step doesn't need to branch.
 */

const GEMINI_MODEL_MAP = {
  // Bare 'gemini-3-image-preview' 404s; the GA id is the pro variant.
  'google/gemini-3-image-preview': 'gemini-3-pro-image-preview',
  // Bare flash-exp preview id was retired; 2.5-flash-image is the GA id.
  'google/gemini-2-image': 'gemini-2.5-flash-image',
};

function isGeminiModel(modelId) {
  return typeof modelId === 'string' && modelId.startsWith('google/');
}

/**
 * Render with Gemini's image API.
 *
 * @param {string} modelId       e.g. 'google/gemini-2-image'
 * @param {string} prompt
 * @param {string} geminiKey     from process.env.GEMINI_API_KEY
 * @returns {Promise<{ url: string, predictionId: string }>}
 */
async function generateGeminiImage(modelId, prompt, geminiKey) {
  const geminiModel = GEMINI_MODEL_MAP[modelId];
  if (!geminiModel) throw new Error(`Unknown Gemini model: ${modelId}`);
  if (!geminiKey) throw new Error('GEMINI_API_KEY missing');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`;
  // Nano Banana Pro is resolution-priced; pin to 1K to keep cost basis.
  // BOTH variants honor `imageConfig.aspectRatio` — we ALWAYS request 9:16
  // (was previously Pro-only, which let Nano Banana 2 default to 1024x1024
  // square and crop on the portrait fullscreen viewer). `imageSize` is
  // Pro-only — Flash ignores it.
  const isNanoBananaPro = modelId === 'google/gemini-3-image-preview';

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ['IMAGE'],
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
  const candidate = data?.candidates?.[0];
  // Gemini returns 200 with a finishReason instead of a 4xx for safety
  // rejections. SAFETY = legacy, IMAGE_SAFETY = current,
  // PROHIBITED_CONTENT = stricter category seen on Nano Banana 2 (often
  // false-positives on innocuous chibibot creature prompts). All three
  // should trigger our upstream NSFW retry loop — withNsfwRetry matches
  // on the NSFW_CONTENT: prefix.
  const SAFETY_REASONS = new Set(['SAFETY', 'IMAGE_SAFETY', 'PROHIBITED_CONTENT']);
  if (SAFETY_REASONS.has(candidate?.finishReason)) {
    throw new Error(`NSFW_CONTENT: Gemini ${candidate.finishReason} on response.`);
  }

  const parts = candidate?.content?.parts ?? [];
  const imagePart = parts.find((p) => p?.inlineData?.data);
  const b64 = imagePart?.inlineData?.data;
  if (!b64) {
    throw new Error(`Gemini returned no image: ${JSON.stringify(data).slice(0, 200)}`);
  }

  return {
    url: `data:image/png;base64,${b64}`,
    predictionId: `gemini-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
  };
}

module.exports = { isGeminiModel, generateGeminiImage };
