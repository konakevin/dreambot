/**
 * Google Gemini image generation provider (Nano Banana family).
 *
 * Model identifiers:
 *   - google/gemini-3-image-preview  → Nano Banana Pro (20cr tier — 4K + character consistency)
 *   - google/gemini-2-image          → Nano Banana 2 (5cr tier — 4K Gemini 3.1 Flash)
 *
 * API: POST https://generativelanguage.googleapis.com/v1beta/models/<model>:generateContent
 *   Body: { contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseModalities: ['IMAGE'] } }
 *
 * Response: inline base64 image in `candidates[0].content.parts[].inlineData.data`
 *
 * Pricing (rough, check Google AI Studio for current):
 *   gemini-3-image-preview: ~$0.03-0.05/image
 *   gemini-2-image: ~$0.02-0.03/image
 *
 * NSFW: Gemini's safety system returns finishReason='SAFETY' or similar.
 *   We re-throw with NSFW_CONTENT: prefix so upstream retry kicks in.
 */

export interface GeminiImageResult {
  url: string;
  predictionId: string;
}

const GEMINI_MODEL_MAP: Record<string, string> = {
  'google/gemini-3-image-preview': 'gemini-3-image-preview',
  'google/gemini-2-image': 'gemini-2.0-flash-exp-image-generation',
};

export function isGeminiModel(modelId: string): boolean {
  return modelId.startsWith('google/');
}

export async function generateGeminiImage(
  modelId: string,
  prompt: string,
  geminiKey: string
): Promise<GeminiImageResult> {
  const geminiModel = GEMINI_MODEL_MAP[modelId];
  if (!geminiModel) {
    throw new Error(`Unknown Gemini model: ${modelId}`);
  }
  if (!geminiKey) {
    throw new Error('GEMINI_API_KEY missing');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ['IMAGE'],
        // 9:16 portrait aspect ratio nudge — Gemini doesn't take an
        // aspect_ratio param directly, prompt-level hint is the move.
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

  // Check for safety block in the response (Gemini sometimes 200s with finishReason=SAFETY)
  const candidate = data.candidates?.[0];
  if (candidate?.finishReason === 'SAFETY' || candidate?.finishReason === 'IMAGE_SAFETY') {
    throw new Error('NSFW_CONTENT: Gemini safety filter blocked the response.');
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
