/**
 * Edge Function: moderate-content
 *
 * Server-side content moderation via SightEngine.
 * Keeps API credentials off the client.
 *
 * POST /functions/v1/moderate-content
 * Authorization: Bearer <user JWT>
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface RequestBody {
  type: 'image' | 'text' | 'upload';
  image_url?: string;
  text?: string;
  /** For "upload" type — combined media + text check */
  media_url?: string;
  caption?: string;
}

interface ModerationResult {
  passed: boolean;
  reason: string | null;
}

// ── Thresholds ──────────────────────────────────────────────────────────────

// Sensual/sexy content ALLOWED (lingerie, seethrough, suggestive poses).
// Block: explicit nudity (full frontal, genitalia), sexual acts, gore, death.
const IMAGE_THRESHOLDS: Record<string, number> = {
  'nudity.sexual_activity': 0.3, // actual sex acts — block
  // sexual_display and erotica intentionally excluded — allows lingerie, seethrough, nipples
  // suggestive/very_suggestive intentionally excluded — allows sexy poses
  'gore.prob': 0.3, // gore/death — block
  'self-harm.prob': 0.3, // self-harm — block
  // weapons are allowed — fantasy swords, sci-fi guns are common in dreams
};

// Block threats, hate speech, and explicit sexual content.
// Suggestive/romantic text is fine, but explicit descriptions get blocked
// because image models reject them anyway.
const TEXT_THRESHOLDS: Record<string, number> = {
  discriminatory: 0.5, // hate speech — block
  violent: 0.5, // threats/violence — block
  sexual: 0.7, // explicit sexual — block (suggestive under 0.7 is fine)
};

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const API_USER = Deno.env.get('SIGHTENGINE_API_USER');
  const API_SECRET = Deno.env.get('SIGHTENGINE_API_SECRET');

  if (!API_USER || !API_SECRET) {
    return jsonResponse({ error: 'Server misconfigured: missing SIGHTENGINE credentials' }, 500);
  }

  // Authenticate user
  const authHeader = req.headers.get('authorization') ?? '';
  const supabaseUser = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY') ?? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  );
  const {
    data: { user },
    error: authError,
  } = await supabaseUser.auth.getUser();
  if (authError || !user) {
    return jsonResponse({ error: 'Not authenticated' }, 401);
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const { type } = body;

  try {
    let result: ModerationResult;

    switch (type) {
      case 'image':
        if (!body.image_url) return jsonResponse({ error: 'image_url required' }, 400);
        result = await checkImage(body.image_url, API_USER, API_SECRET);
        break;

      case 'text':
        if (!body.text) return jsonResponse({ error: 'text required' }, 400);
        result = await checkText(body.text, API_USER, API_SECRET);
        break;

      case 'upload': {
        if (!body.media_url) {
          return jsonResponse({ error: 'media_url required for upload type' }, 400);
        }

        const [mediaResult, textResult] = await Promise.all([
          checkImage(body.media_url, API_USER, API_SECRET),
          body.caption
            ? checkText(body.caption, API_USER, API_SECRET)
            : Promise.resolve({ passed: true, reason: null }),
        ]);

        if (!mediaResult.passed) {
          result = mediaResult;
          break;
        }
        if (!textResult.passed) {
          result = textResult;
          break;
        }
        result = { passed: true, reason: null };
        break;
      }

      default:
        return jsonResponse({ error: 'Invalid type. Must be image, text, or upload' }, 400);
    }

    return jsonResponse(result, 200);
  } catch (err) {
    console.error(`[moderate-content] Error:`, (err as Error).message);
    return jsonResponse(
      { passed: false, reason: 'Unable to verify content. Please try again.' },
      200
    );
  }
});

// ── SightEngine API calls ───────────────────────────────────────────────────

function getNestedValue(obj: Record<string, unknown>, path: string): number {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') return 0;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'number' ? current : 0;
}

async function checkImage(
  imageUrl: string,
  apiUser: string,
  apiSecret: string
): Promise<ModerationResult> {
  const params = new URLSearchParams({
    url: imageUrl,
    models: 'nudity-2.1,gore-2.0,weapon,self-harm',
    api_user: apiUser,
    api_secret: apiSecret,
  });

  const res = await fetch(`https://api.sightengine.com/1.0/check.json?${params}`);
  if (!res.ok) {
    console.warn(`[moderate-content] Image API error: ${res.status}`);
    return { passed: false, reason: 'Unable to verify content. Please try again.' };
  }

  const data = await res.json();
  if (data.status !== 'success') {
    return { passed: false, reason: 'Unable to verify content. Please try again.' };
  }

  for (const [path, threshold] of Object.entries(IMAGE_THRESHOLDS)) {
    const score = getNestedValue(data as Record<string, unknown>, path);
    if (score > threshold) {
      const category = path.split('.')[0];
      return { passed: false, reason: `Content flagged: ${category}` };
    }
  }

  return { passed: true, reason: null };
}

async function checkText(
  text: string,
  apiUser: string,
  apiSecret: string
): Promise<ModerationResult> {
  if (!text || text.trim().length === 0) return { passed: true, reason: null };

  const params = new URLSearchParams({
    text,
    lang: 'en',
    mode: 'ml',
    models: 'general',
    api_user: apiUser,
    api_secret: apiSecret,
  });

  const res = await fetch(`https://api.sightengine.com/1.0/text/check.json?${params}`);
  if (!res.ok) {
    return { passed: false, reason: 'Unable to verify content. Please try again.' };
  }

  const data = await res.json();
  if (data.status !== 'success') {
    return { passed: false, reason: 'Unable to verify content. Please try again.' };
  }

  const classes = data.moderation_classes ?? {};
  for (const [category, threshold] of Object.entries(TEXT_THRESHOLDS)) {
    const score = typeof classes[category] === 'number' ? classes[category] : 0;
    if (score > threshold) {
      return { passed: false, reason: 'Caption contains inappropriate language' };
    }
  }

  return { passed: true, reason: null };
}

// ── Utilities ───────────────────────────────────────────────────────────────

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
