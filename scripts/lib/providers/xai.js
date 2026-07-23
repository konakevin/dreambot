/**
 * xAI (Grok) image generation provider — bot-side, Node.
 *
 * Uses the NEWER `grok-imagine-image` model (not `grok-2-image`) — the old
 * grok-2-image always runs your prompt through a chat model that rewrites/
 * expands it (returns `revised_prompt`), which risks mangling DreamBot's tuned
 * face-swap + negation prompts. The imagine models don't document that revision
 * step and give real aspect-ratio/resolution control; whether they revise at
 * all is exactly what the AlphaBot QA pass exists to settle.
 *
 * The endpoint is OpenAI-compatible (POST https://api.x.ai/v1/images/generations),
 * so this mirrors providers/openai.js. Output: JPG base64 → a data: URL the
 * upload pipeline already handles.
 *
 * Model identifiers:
 *   xai/grok-imagine-image          → grok-imagine-image          (standard)
 *   xai/grok-imagine-image-quality  → grok-imagine-image-quality  (high fidelity)
 *
 * AlphaBot-only for now — NOT in ALL_ENABLED_AI_MODELS (the fleet default).
 */

const XAI_MODEL_MAP = {
  'xai/grok-imagine-image': 'grok-imagine-image',
  'xai/grok-imagine-image-quality': 'grok-imagine-image-quality',
};

function isXaiModel(modelId) {
  return typeof modelId === 'string' && modelId.startsWith('xai/');
}

/**
 * Render with xAI's image API.
 *
 * @param {string} modelId   e.g. 'xai/grok-imagine-image'
 * @param {string} prompt
 * @param {string} xaiKey     from process.env.XAI_API_KEY
 * @param {Object} [opts]
 * @param {string} [opts.aspectRatio]  e.g. '9:16' (bot default). Passed through.
 * @param {'1k'|'2k'} [opts.resolution]  default '1k' (cost basis).
 * @returns {Promise<{ url: string, predictionId: string }>}
 */
async function generateXaiImage(modelId, prompt, xaiKey, opts = {}) {
  const xaiModel = XAI_MODEL_MAP[modelId];
  if (!xaiModel) throw new Error(`Unknown xAI model: ${modelId}`);
  if (!xaiKey) throw new Error('XAI_API_KEY missing');

  const body = {
    model: xaiModel,
    prompt,
    n: 1,
    response_format: 'b64_json',
    aspect_ratio: opts.aspectRatio || '2:3',
    resolution: opts.resolution || '1k',
  };

  const res = await fetch('https://api.x.ai/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${xaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    // Map xAI moderation refusals to the shared NSFW convention so the bot
    // engine's stochastic-retry loop fires (same as OpenAI/Gemini).
    if (
      (res.status === 400 || res.status === 422) &&
      /content|policy|safety|moderat|reject|nsfw/i.test(text)
    ) {
      throw new Error('NSFW_CONTENT: xAI safety filter rejected the prompt.');
    }
    throw new Error(`xAI submit failed (${res.status}): ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  const b64 = data && data.data && data.data[0] && data.data[0].b64_json;
  if (!b64) {
    throw new Error(`xAI returned no image: ${JSON.stringify(data).slice(0, 200)}`);
  }
  return {
    url: `data:image/jpeg;base64,${b64}`,
    predictionId: `xai-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
  };
}

module.exports = { isXaiModel, generateXaiImage };
