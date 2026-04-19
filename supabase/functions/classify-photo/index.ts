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

const CLASSIFY_PROMPT = `Analyze this photo and describe its primary subject in one clear sentence (10-30 words), then append a type tag.

If you can CONFIDENTLY identify a single DOMINANT subject, describe it with visual specifics a painter would need (physical features, colors, distinguishing marks, pose, expression):
- a specific person → describe them in flattering detail
- a specific animal → describe the creature
- a specific object → describe what it is and its key visual features
- a specific place/scene → describe the setting and mood

If the photo has MULTIPLE competing subjects where none dominates (e.g. a group with no clear primary face), is too blurry/small/obscured to read, is a collage/meme/screenshot/abstract, or you cannot CONFIDENTLY name ONE dominant subject — respond with "UNCLEAR" as the description.

End with EXACTLY ONE of these type tags: [PERSON] | [ANIMAL] | [OBJECT] | [SCENERY] | [UNCLEAR]

Examples:
"A woman in her 30s with shoulder-length chestnut brown wavy hair, warm genuine smile, wearing a gray knit sweater [PERSON]"
"A fluffy golden retriever with floppy ears and a bright happy expression, sitting on green grass [ANIMAL]"
"A vintage cherry-red convertible sports car with chrome trim and leather seats, parked on cobblestones [OBJECT]"
"A snowy alpine mountain peak at dusk with dramatic orange-pink clouds catching the light [SCENERY]"
"UNCLEAR [UNCLEAR]"

Output only the description + tag, no other text.`;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type SubjectType = 'person' | 'animal' | 'object' | 'scenery' | 'unclear';

function parseResponse(raw: string): { description: string; type: SubjectType } {
  // Expected format: "<description> [TYPE]"
  const trimmed = raw.trim();
  const match = trimmed.match(/^(.+?)\s*\[(PERSON|ANIMAL|OBJECT|SCENERY|UNCLEAR)\]\s*$/is);
  if (match) {
    const description = match[1].trim();
    const type = match[2].toLowerCase() as SubjectType;
    return { description, type };
  }
  // Fallback: couldn't parse tag — treat as unclear
  console.warn('[classify-photo] Could not parse type tag from:', trimmed.slice(0, 100));
  return { description: trimmed.slice(0, 200), type: 'unclear' };
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
