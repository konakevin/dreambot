/**
 * Edge Function: generate-dream
 *
 * Server-side dream generation. Receives a recipe (or raw prompt),
 * builds the prompt via the recipe engine, optionally enhances via Haiku,
 * generates an image via Replicate Flux, persists to Storage, and returns
 * the permanent URL.
 *
 * POST /functions/v1/generate-dream
 * Authorization: Bearer <user JWT>
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { buildPromptInput, buildRawPrompt, buildHaikuPrompt } from '../_shared/recipeEngine.ts';
import type { Recipe } from '../_shared/recipe.ts';

const MAX_DAILY_GENERATIONS = 50;

interface RequestBody {
  /** Which Flux model to use */
  mode: 'flux-dev' | 'flux-kontext';
  /** User's taste recipe — server builds the prompt from this */
  recipe?: Recipe;
  /** Pre-built prompt — used for twins (re-rolling existing prompt) */
  prompt?: string;
  /** Optional user hint to weave into the dream */
  hint?: string;
  /** Base64 data URL for flux-kontext (photo-to-image) */
  input_image?: string;
  /** Custom Haiku brief — used for photo reimagining (upload.tsx dream()) */
  haiku_brief?: string;
  /** Fallback prompt if Haiku fails — paired with haiku_brief */
  haiku_fallback?: string;
  /** Epigenetic context for fusion dreams */
  epigenetic_context?: string;
  /** Whether to persist the image to Storage (default: true) */
  persist?: boolean;
  /** Skip Haiku enhancement — use raw prompt from recipe engine (faster) */
  skip_enhance?: boolean;
}

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
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const REPLICATE_TOKEN = Deno.env.get('REPLICATE_API_TOKEN');
  const ANTHROPIC_KEY = Deno.env.get('ANTHROPIC_API_KEY');

  if (!REPLICATE_TOKEN) {
    return new Response(
      JSON.stringify({ error: 'Server misconfigured: missing REPLICATE_API_TOKEN' }),
      { status: 500 }
    );
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  // Create a user-scoped client from the request's Authorization header.
  // The Supabase gateway already validates the JWT before invoking the function,
  // so we can trust the token and use it to identify the user.
  const authHeader = req.headers.get('authorization') ?? '';
  const supabaseUser = createClient(
    supabaseUrl,
    Deno.env.get('SUPABASE_ANON_KEY') ?? serviceRoleKey,
    {
      global: { headers: { Authorization: authHeader } },
    }
  );
  const {
    data: { user },
    error: authError,
  } = await supabaseUser.auth.getUser();
  if (authError || !user) {
    console.error(
      '[generate-dream] Auth failed:',
      authError?.message,
      'header:',
      authHeader.slice(0, 30)
    );
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }
  const userId = user.id;

  // Service role client for database operations (bypasses RLS)
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Parse request body
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }

  const {
    mode,
    recipe,
    prompt: rawPrompt,
    hint,
    input_image,
    haiku_brief,
    haiku_fallback,
    epigenetic_context,
    persist = false,
    skip_enhance = false,
  } = body;

  if (!mode || !['flux-dev', 'flux-kontext'].includes(mode)) {
    return new Response(
      JSON.stringify({ error: 'Invalid mode. Must be "flux-dev" or "flux-kontext"' }),
      { status: 400 }
    );
  }

  if (mode === 'flux-kontext' && !input_image) {
    return new Response(JSON.stringify({ error: 'flux-kontext mode requires input_image' }), {
      status: 400,
    });
  }

  if (!recipe && !rawPrompt && !haiku_brief) {
    return new Response(JSON.stringify({ error: 'Must provide recipe, prompt, or haiku_brief' }), {
      status: 400,
    });
  }

  // ── Timing ─────────────────────────────────────────────────────────────────
  const t0 = Date.now();
  const lap = (label: string) => {
    const elapsed = Date.now() - t0;
    console.log(`[generate-dream] ⏱ ${label}: ${elapsed}ms`);
  };

  // ── Rate limit check ──────────────────────────────────────────────────────
  const today = new Date().toISOString().slice(0, 10);
  const { data: budgetRow } = await supabase
    .from('ai_generation_budget')
    .select('images_generated')
    .eq('user_id', userId)
    .eq('date', today)
    .single();
  lap('rate-limit-check');

  const todayCount = budgetRow?.images_generated ?? 0;
  if (todayCount >= MAX_DAILY_GENERATIONS) {
    return new Response(
      JSON.stringify({
        error: 'Daily generation limit reached. Try again tomorrow!',
        retry_after: secondsUntilMidnightUTC(),
      }),
      { status: 429 }
    );
  }

  // ── Build prompt ──────────────────────────────────────────────────────────
  let finalPrompt: string;

  if (rawPrompt) {
    finalPrompt = rawPrompt;
    lap('prompt-raw');
  } else if (haiku_brief) {
    finalPrompt = await enhanceViaHaiku(haiku_brief, haiku_fallback ?? haiku_brief, ANTHROPIC_KEY);
    lap('prompt-haiku-brief');
  } else if (recipe) {
    const input = buildPromptInput(recipe);
    const fallback = buildRawPrompt(input);

    if (skip_enhance) {
      finalPrompt = fallback;
      lap('prompt-raw-skip');
    } else {
      let haikuBrief = buildHaikuPrompt(input);

      if (hint) {
        haikuBrief += `\n\nIMPORTANT: The user requested "${hint}". Make this the heart of the dream — use their taste profile to style it, but this wish is the subject.`;
      }

      if (epigenetic_context) {
        haikuBrief += `\n\n${epigenetic_context}`;
      }

      finalPrompt = await enhanceViaHaiku(haikuBrief, fallback, ANTHROPIC_KEY);
      lap('prompt-haiku-recipe');
    }
  } else {
    return new Response(JSON.stringify({ error: 'No prompt source provided' }), { status: 400 });
  }

  console.log(
    `[generate-dream] User ${userId}, mode=${mode}, skip_enhance=${skip_enhance}, persist=${persist}, prompt=${finalPrompt.slice(0, 80)}...`
  );

  // ── Generate image via Replicate ──────────────────────────────────────────
  try {
    const tempUrl = await generateImage(mode, finalPrompt, input_image, REPLICATE_TOKEN);
    lap('replicate-done');

    let imageUrl = tempUrl;

    // Only persist to Storage and log when explicitly requested (i.e., user taps Post)
    if (persist) {
      imageUrl = await persistToStorage(tempUrl, userId, supabase);
      lap('persist-done');

      try {
        await supabase.from('ai_generation_log').insert({
          user_id: userId,
          enhanced_prompt: finalPrompt,
          model_used: mode === 'flux-kontext' ? 'flux-kontext-pro' : 'flux-dev',
          cost_cents: 3,
          status: 'completed',
        });
      } catch {
        /* non-critical */
      }

      try {
        await supabase.from('ai_generation_budget').upsert(
          {
            user_id: userId,
            date: today,
            images_generated: todayCount + 1,
            total_cost_cents: (todayCount + 1) * 3,
          },
          { onConflict: 'user_id,date' }
        );
      } catch {
        /* non-critical */
      }
    }

    lap('total');
    console.log(`[generate-dream] ✅ Done in ${Date.now() - t0}ms for user ${userId}`);

    return new Response(
      JSON.stringify({
        image_url: imageUrl,
        prompt_used: finalPrompt,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error(`[generate-dream] Error for user ${userId}:`, (err as Error).message);
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
  }
});

// ── Helpers ──────────────────────────────────────────────────────────────────

async function enhanceViaHaiku(
  brief: string,
  fallback: string,
  anthropicKey: string | undefined
): Promise<string> {
  if (!anthropicKey) return fallback;
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 150,
        messages: [{ role: 'user', content: brief }],
      }),
    });
    if (!res.ok) throw new Error(`Haiku ${res.status}`);
    const data = await res.json();
    const text = data.content?.[0]?.text?.trim() ?? '';
    return text.length >= 10 ? text : fallback;
  } catch (err) {
    console.warn('[generate-dream] Haiku fallback:', (err as Error).message);
    return fallback;
  }
}

async function generateImage(
  mode: string,
  prompt: string,
  inputImage: string | undefined,
  replicateToken: string
): Promise<string> {
  const model =
    mode === 'flux-kontext' ? 'black-forest-labs/flux-kontext-pro' : 'black-forest-labs/flux-dev';

  const input: Record<string, unknown> = {
    prompt,
    aspect_ratio: '9:16',
    num_outputs: 1,
    output_format: 'jpg',
  };

  if (mode === 'flux-kontext' && inputImage) {
    input.input_image = inputImage;
    input.output_quality = 90;
  }

  const res = await fetch(`https://api.replicate.com/v1/models/${model}/predictions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${replicateToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input }),
  });

  if (res.status === 429) {
    const body = await res.json();
    const retryAfter = body.retry_after ?? 6;
    await new Promise((r) => setTimeout(r, retryAfter * 1000));
    return generateImage(mode, prompt, inputImage, replicateToken);
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
      const url = typeof pollData.output === 'string' ? pollData.output : pollData.output?.[0];
      if (url) return url;
    }
    if (pollData.status === 'failed' || pollData.status === 'canceled') {
      throw new Error(`Generation ${pollData.status}: ${pollData.error ?? 'unknown'}`);
    }
  }
  throw new Error('Generation timed out');
}

async function persistToStorage(
  tempUrl: string,
  userId: string,
  supabase: ReturnType<typeof createClient>
): Promise<string> {
  const resp = await fetch(tempUrl);
  if (!resp.ok) throw new Error(`Failed to download image: ${resp.status}`);
  const buf = await resp.arrayBuffer();

  const fileName = `${userId}/${Date.now()}.jpg`;
  const { error } = await supabase.storage
    .from('uploads')
    .upload(fileName, buf, { contentType: 'image/jpeg' });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const { data } = supabase.storage.from('uploads').getPublicUrl(fileName);
  return data.publicUrl;
}

function secondsUntilMidnightUTC(): number {
  const now = new Date();
  const midnight = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
  );
  return Math.ceil((midnight.getTime() - now.getTime()) / 1000);
}
