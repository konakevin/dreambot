/**
 * Edge Function: extract-style
 *
 * Takes an AI dream prompt and asks Haiku to extract just the visual style —
 * medium, palette, lighting, texture. Used by Dream Like This to accurately
 * apply a reference style to a user's photo.
 *
 * POST /functions/v1/extract-style
 * Body: { prompt: string }
 * Returns: { style: string }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';
import { callClaude } from '../_shared/anthropic.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  // ── Auth: verify JWT ──────────────────────────────────────────────
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
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }

  // Rate limit (migration 228): this is an authenticated paid-Haiku endpoint —
  // cap it like classify/describe-photo so an authed user can't loop it.
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
  const { error: rlErr } = await supabaseAdmin
    .from('edge_function_invocations')
    .insert({ user_id: user.id, function_name: 'extract-style' });
  if (rlErr) {
    const isRl =
      rlErr.message?.includes('rate_limited') ||
      (rlErr as { hint?: string }).hint === 'rate_limited';
    if (isRl) {
      return new Response(JSON.stringify({ error: 'rate_limited' }), { status: 429 });
    }
    console.error('[extract-style] rate-limit log INSERT failed:', rlErr.message);
  }

  const ANTHROPIC_KEY = Deno.env.get('ANTHROPIC_API_KEY');
  if (!ANTHROPIC_KEY) {
    return new Response(JSON.stringify({ error: 'Missing ANTHROPIC_API_KEY' }), { status: 500 });
  }

  let body: { prompt: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  if (!body.prompt) {
    return new Response(JSON.stringify({ error: 'prompt is required' }), { status: 400 });
  }

  try {
    // style_extract (Haiku). An Anthropic error used to return 200 with an empty style and log nothing: the old
    // code never checked the status. The response is unchanged (an empty style); the error is now logged.
    let style = '';
    try {
      const r = await callClaude({
        job: 'style_extract',
        key: ANTHROPIC_KEY,
        maxTokens: 100,
        content: `Extract ONLY the visual art style from this AI image prompt. Include: the rendering medium/technique, color palette description, lighting quality, and texture. Do NOT include any subject matter, characters, objects, scenes, or environments — ONLY how the image looks and feels visually.

Return a single comma-separated phrase, 15-30 words max. Examples:
- "watercolor on textured paper, soft muted pastels, diffused warm lighting, visible brushstrokes"
- "pixel art, NES color palette, chunky pixels, retro CRT glow"
- "oil painting, thick impasto brushstrokes, dramatic chiaroscuro lighting, rich warm tones"

Prompt: "${body.prompt.slice(0, 400)}"`,
      });
      style = r.text;
    } catch (e) {
      console.error('[extract-style] Anthropic call failed:', (e as Error).message);
    }
    console.log('[extract-style] Input:', body.prompt.slice(0, 80));
    console.log('[extract-style] Extracted:', style);

    return new Response(JSON.stringify({ style }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[extract-style] Error:', (err as Error).message);
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
  }
});
