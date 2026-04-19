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
 *   - animal  → description path (the creature literally appears in the scene)
 *   - object  → description path (the object literally appears in the scene)
 *   - scenery → description path (scene is built inspired by the place)
 *   - unclear → client shows "photo hard to read" modal with proceed/cancel
 *
 * POST /functions/v1/classify-photo
 * Authorization: Bearer <user JWT>
 * Body: { input_image: string }  // base64 data URL or public URL
 * Response: { subject_description: string, type: 'person' | 'animal' | 'object' | 'scenery' | 'unclear' }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { describeWithVision } from '../_shared/vision.ts';

const CLASSIFY_PROMPT = `Classify the primary subject of this photo and describe it.

Return ONLY a JSON object matching this exact shape (no markdown, no code fences, no preamble):
{"type":"<TYPE>","description":"<visual description, 15-50 words>"}

TYPE values:
- "person"  — one person is the clear dominant subject
- "group"   — multiple people visible, none clearly dominant (describe each briefly, up to 4)
- "animal"  — a single animal or pet
- "object"  — a single object or thing (car, gadget, item)
- "scenery" — landscape or place without people as the subject
- "unclear" — too blurry/small/abstract/collage/meme to read confidently

Description requirements — describe like a painter needs to render it (physical features, colors, pose, expression, distinguishing marks). Be specific and flattering.

Examples:
{"type":"person","description":"A woman in her 30s with shoulder-length chestnut brown wavy hair, warm genuine smile, wearing a gray knit sweater"}
{"type":"group","description":"Three people outdoors: a woman with curly brown hair in a red dress, a man with a beard in a blue button-down, and a teenage girl with long blonde hair in a denim jacket"}
{"type":"animal","description":"A fluffy golden retriever with floppy ears and a bright happy expression, sitting on green grass"}
{"type":"object","description":"A vintage cherry-red convertible sports car with chrome trim and leather seats, parked on cobblestones"}
{"type":"scenery","description":"A snowy alpine mountain peak at dusk with dramatic orange-pink clouds catching the light"}
{"type":"unclear","description":"unclear"}`;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type SubjectType = 'person' | 'group' | 'animal' | 'object' | 'scenery' | 'unclear';

const VALID_TYPES = new Set<SubjectType>([
  'person',
  'group',
  'animal',
  'object',
  'scenery',
  'unclear',
]);

function parseResponse(raw: string): { description: string; type: SubjectType } {
  // Strip markdown fences if Haiku added any (```json ... ```).
  const stripped = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  // Extract the JSON object — look for the first `{` and its matching `}`.
  const firstBrace = stripped.indexOf('{');
  if (firstBrace < 0) {
    console.warn('[classify-photo] No JSON in response:', stripped.slice(0, 100));
    return { description: stripped.slice(0, 200), type: 'unclear' };
  }
  const jsonText = stripped.slice(firstBrace);
  try {
    // Attempt to parse. Haiku may output extra text after the JSON; use the
    // last valid object we can parse by trimming back to the last `}`.
    const lastBrace = jsonText.lastIndexOf('}');
    const candidate = lastBrace > 0 ? jsonText.slice(0, lastBrace + 1) : jsonText;
    const parsed = JSON.parse(candidate);
    const type: SubjectType = VALID_TYPES.has(parsed.type) ? parsed.type : 'unclear';
    const description = typeof parsed.description === 'string' ? parsed.description.trim() : '';
    return { description, type };
  } catch (err) {
    console.warn(
      '[classify-photo] JSON parse failed:',
      (err as Error).message,
      '| raw:',
      stripped.slice(0, 150)
    );
    return { description: stripped.slice(0, 200), type: 'unclear' };
  }
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
