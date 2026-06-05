/**
 * OpenAI image generation provider — Node port of
 * `supabase/functions/_shared/providers/openai.ts`. The Deno module is
 * the source of truth; if you change behavior, change BOTH.
 *
 * Why a port? The bot system (scripts/run-bot.js, iter-bot.js) doesn't
 * import from supabase/functions/_shared/ — that's a Deno tree. Bots run
 * in Node. Without this mirror, the bot engine could only render Flux
 * via Replicate; gpt-image-2 had to go through Replicate's wrapper,
 * adding 20s+ of queueing on top of an already-slow model.
 *
 * Model identifiers:
 *   openai/gpt-image-1 → gpt-image-1
 *   openai/gpt-image-2 → gpt-image-2
 *
 * Output: a data: URL (base64-PNG) — the upload pipeline already handles
 * data URLs (see imageCodec.uploadFromUrl).
 *
 * ASPECT-RATIO NOTE (2026-06-04). The OpenAI API only accepts size from a
 * fixed enum (1024x1024 / 1024x1536 / 1536x1024) — there is no 9:16
 * generation option. We pick 1024x1536 (2:3 = 0.667) as the nearest
 * portrait. In DreamCard feed view (contentFit='cover') this crops a
 * little horizontally and looks fine. In BotImageViewer full-screen
 * view (contentFit='contain') the source's wider-than-9:16 ratio shows
 * top/bottom bars. A server-side center-crop would butcher off-center
 * subjects (e.g. a turtle near the frame edge) — display-side handling
 * is the right place to address the bars, not the provider.
 */

const OPENAI_MODEL_MAP = {
  'openai/gpt-image-1': 'gpt-image-1',
  'openai/gpt-image-2': 'gpt-image-2',
};

function isOpenAIModel(modelId) {
  return typeof modelId === 'string' && modelId.startsWith('openai/');
}

/**
 * Render with OpenAI's image API.
 *
 * @param {string} modelId      e.g. 'openai/gpt-image-2'
 * @param {string} prompt
 * @param {string} openaiKey    from process.env.OPENAI_API_KEY
 * @param {Object} [opts]
 * @param {'1024x1024'|'1024x1536'|'1536x1024'|'auto'} [opts.size]  default '1024x1536' (portrait)
 * @param {'low'|'medium'|'high'|'auto'}              [opts.quality] default 'medium'
 * @returns {Promise<{ url: string, predictionId: string }>}
 */
async function generateOpenAIImage(modelId, prompt, openaiKey, opts = {}) {
  const openaiModel = OPENAI_MODEL_MAP[modelId];
  if (!openaiModel) throw new Error(`Unknown OpenAI model: ${modelId}`);
  if (!openaiKey) throw new Error('OPENAI_API_KEY missing');

  // Portrait at 1024x1536. 'medium' quality holds the cost basis (~$0.06).
  const size = opts.size || '1024x1536';
  const quality = opts.quality || 'medium';

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
      // gpt-image-1/2 do NOT accept response_format and ALWAYS return b64.
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    if (res.status === 400 && /content_policy_violation|safety_violation|rejected/i.test(text)) {
      throw new Error('NSFW_CONTENT: OpenAI safety filter rejected the prompt.');
    }
    throw new Error(`OpenAI submit failed (${res.status}): ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error(`OpenAI returned no image: ${JSON.stringify(data).slice(0, 200)}`);
  }
  return {
    url: `data:image/png;base64,${b64}`,
    predictionId: `openai-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
  };
}

module.exports = { isOpenAIModel, generateOpenAIImage };
