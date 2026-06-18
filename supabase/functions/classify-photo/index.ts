/**
 * Edge Function: classify-photo
 *
 * Single vision call that returns a short structured description of a photo's
 * primary subject + a type tag. The client calls this when the user taps
 * "Dream" on a photo upload — this is the first API cost we incur, triggered
 * by user intent.
 *
 * Downstream: client passes the classification to generate-dream, which
 * skips redundant vision and routes based on type:
 *   - person  → face-swap path (the person gets swapped onto the rendered scene)
 *   - group   → description path, client shows "face-swap only for single subjects" modal
 *   - animal  → description path (the creature literally appears in the scene)
 *   - object  → description path (the object literally appears in the scene)
 *   - scenery → description path (scene is built inspired by the place)
 *   - unclear → client shows "photo hard to read" modal with proceed/cancel
 *
 * POST /functions/v1/classify-photo
 * Authorization: Bearer <user JWT>
 * Body: { input_image: string }  // base64 data URL or public URL
 * Response: { subject_description: string, type: 'person' | 'group' | 'animal' | 'object' | 'scenery' | 'unclear' }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { describeWithVision } from '../_shared/vision.ts';

// NOTE: pipe-delimited, NOT JSON. The vision output is run through
// _shared/sanitizeUserText (in describeWithVision), which STRIPS { } [ ] < >
// braces/brackets — so a JSON contract silently breaks (the braces vanish and
// the parse always falls back to "unclear"). Pipes survive sanitization, so we
// use a single "TYPE|description" line, the same trick classifyDualGenders uses.
const CLASSIFY_PROMPT = `Classify the primary subject of this photo and describe it.

Reply with EXACTLY one line and nothing else — the TYPE, then a vertical bar |, then the description. No JSON, no braces, no markdown, no preamble:
TYPE|<visual description, 20-60 words>

TYPE is exactly one of:
- person  — one person is the clear dominant subject
- group   — multiple people visible, none clearly dominant (describe each briefly, up to 4)
- animal  — a single animal or pet
- object  — a single object or thing (car, gadget, item)
- scenery — landscape or place without people as the subject
- unclear — too blurry/small/abstract/collage/meme to read confidently

Description requirements — describe like a painter needs to render the subject from memory, with enough detail for a strong likeness. For PEOPLE and GROUPS be EXTREMELY specific about IDENTITY: face shape, eye color, exact hair color (e.g. sandy brown, chestnut) + length + texture + style, skin tone, build, approximate age, and distinguishing features (glasses, freckles, jewelry, tattoos). For facial hair be precise — clean-shaven, light stubble, heavy stubble, short beard, medium beard, or full long beard — do NOT exaggerate (stubble is NOT a beard). Be flattering: skip under-eye bags, dark circles, blemishes, wrinkles. Do NOT describe clothing, outfits, shirt patterns, logos, or accessories — these dreams place the person in a brand-new scene and the generator dresses them to match it; describing the uploaded outfit makes it bleed into the render. (Objects and scenery: describe fully — materials, colors, condition.)

Examples:
person|A woman in her early 30s with an oval face, warm hazel eyes, shoulder-length chestnut-brown wavy hair, fair lightly-freckled skin, slim build, and a warm genuine smile
group|Three people outdoors: a woman in her 20s with curly brown hair and green eyes, a man in his 30s with a short dark beard and olive skin, and a teenage girl with long straight blonde hair and blue eyes
animal|A fluffy golden retriever with floppy ears and a bright happy expression, sitting on green grass
object|A vintage cherry-red convertible sports car with chrome trim and leather seats, parked on cobblestones
scenery|A snowy alpine mountain peak at dusk with dramatic orange-pink clouds catching the light
unclear|unclear`;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUBJECT_TYPES = ['person', 'group', 'animal', 'object', 'scenery', 'unclear'] as const;
type SubjectType = (typeof SUBJECT_TYPES)[number];

function isSubjectType(s: string): s is SubjectType {
  return (SUBJECT_TYPES as readonly string[]).includes(s);
}

function parseResponse(raw: string): { description: string; type: SubjectType } {
  // Pipe-delimited contract "TYPE|description" (see CLASSIFY_PROMPT). Split on
  // the FIRST pipe only — the type is one token before it, the description is
  // everything after (and may itself contain stray punctuation). Robust to the
  // sanitizer that strips braces/newlines and collapses whitespace.
  const trimmed = raw.trim();
  const pipe = trimmed.indexOf('|');
  if (pipe < 0) {
    // No delimiter — best-effort: keep the prose, mark unreadable so the client
    // shows the "photo hard to read" confirm rather than trusting a guess.
    console.warn('[classify-photo] No delimiter in response:', trimmed.slice(0, 100));
    return { description: trimmed.slice(0, 400), type: 'unclear' };
  }
  const rawType = trimmed.slice(0, pipe).trim().toLowerCase();
  const type: SubjectType = isSubjectType(rawType) ? rawType : 'unclear';
  const description = trimmed.slice(pipe + 1).trim();
  // If the model emitted a type but no usable description, fall back to the
  // whole line so we never hand downstream an empty subject.
  return { description: description || trimmed.slice(0, 400), type };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  const ANTHROPIC_KEY = Deno.env.get('ANTHROPIC_API_KEY');
  const REPLICATE_TOKEN = Deno.env.get('REPLICATE_API_TOKEN') ?? '';
  if (!ANTHROPIC_KEY) {
    return new Response(
      JSON.stringify({ error: 'Server misconfigured: missing ANTHROPIC_API_KEY' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }

  // Auth — user must be signed in to spend this call
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const authHeader = req.headers.get('authorization') ?? '';
  const supabaseUser = createClient(
    supabaseUrl,
    Deno.env.get('SUPABASE_ANON_KEY') ?? serviceRoleKey,
    { global: { headers: { Authorization: authHeader } } }
  );
  const {
    data: { user },
    error: authError,
  } = await supabaseUser.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Rate limit (migration 228): 10 vision calls/min/user. Service-role
  // INSERT trips the BEFORE INSERT trigger on edge_function_invocations.
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
  const { error: rateLimitError } = await supabaseAdmin
    .from('edge_function_invocations')
    .insert({ user_id: user.id, function_name: 'classify-photo' });
  if (rateLimitError) {
    const isRateLimit =
      rateLimitError.message?.includes('rate_limited') ||
      (rateLimitError as { hint?: string }).hint === 'rate_limited';
    if (isRateLimit) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded — try again shortly' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    console.error('[classify-photo] rate-limit log INSERT failed:', rateLimitError.message);
    // Fail open: don't block legitimate users on logging failures.
  }

  let body: { input_image?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  const { input_image } = body;
  if (!input_image || typeof input_image !== 'string') {
    return new Response(
      JSON.stringify({ error: 'input_image (base64 data URL or public URL) required' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }

  try {
    const t0 = Date.now();
    const raw = await describeWithVision(input_image, CLASSIFY_PROMPT, REPLICATE_TOKEN, 200);
    const { description, type } = parseResponse(raw);
    console.log(
      `[classify-photo] ${Date.now() - t0}ms | type=${type} | desc="${description.slice(0, 80)}..."`
    );
    return new Response(
      JSON.stringify({
        subject_description: description,
        type,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (err) {
    console.error('[classify-photo] Vision failed:', (err as Error).message);
    return new Response(
      JSON.stringify({
        error: 'Classification failed',
        details: (err as Error).message,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
