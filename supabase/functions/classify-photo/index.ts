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

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';
import { describeWithVision } from '../_shared/vision.ts';

// NOTE: pipe-delimited, NOT JSON. The vision output is run through
// _shared/sanitizeUserText (in describeWithVision), which STRIPS { } [ ] < >
// braces/brackets — so a JSON contract silently breaks (the braces vanish and
// the parse always falls back to "unclear"). Pipes survive sanitization, so we
// use a single "TYPE|description" line, the same trick classifyDualGenders uses.
const CLASSIFY_PROMPT = `Classify a photo's subjects and describe the main subject.

Reply with EXACTLY one line and nothing else. No JSON, no braces, no markdown, no preamble. Use this pipe-delimited format (DESC must be LAST):
TYPE|PEOPLE:<count>|ANIMALS:<count>|FACE:<value>|DESC:<description>

TYPE is exactly one of: person, group, animal, object, scenery, unclear
  (person = one dominant person; group = multiple people; animal = a pet/animal; object = a thing like a car or item; scenery = a place/landscape; unclear = too blurry/small/abstract/collage/meme to read)
PEOPLE = number of distinct human people visible. A close couple is 2, not 1. Count children.
ANIMALS = number of animals/pets visible.
FACE is exactly one of:
  clean   — EXACTLY ONE person, with ONE clear, well-separated, roughly front-facing human face
  multi   — two or more human faces
  none    — no human face at all (a pet, object, or place)
  unclear — a person is present but the face is turned away, tiny, blurry, or you cannot tell
DESC requirements — describe like a painter needs to render the subject from memory, with enough detail for a strong likeness. For PEOPLE and GROUPS be EXTREMELY specific about IDENTITY: face shape, eye color, exact hair color (e.g. sandy brown, chestnut) + length + texture + style, skin tone, build, approximate age, and distinguishing features (glasses, freckles, jewelry, tattoos). For facial hair be precise — clean-shaven, light stubble, heavy stubble, short beard, medium beard, or full long beard — do NOT exaggerate (stubble is NOT a beard). Be flattering: skip under-eye bags, dark circles, blemishes, wrinkles. Do NOT describe clothing, outfits, shirt patterns, logos, or accessories — these dreams place the subject in a brand-new scene and the generator dresses them to match it. (Objects and scenery: describe fully — materials, colors, condition. A place with a stray person in the corner is still scenery: describe the PLACE, ignore the incidental person.)

Examples:
person|PEOPLE:1|ANIMALS:0|FACE:clean|DESC:A woman in her early 30s with an oval face, warm hazel eyes, shoulder-length chestnut-brown wavy hair, fair lightly-freckled skin, slim build, and a warm genuine smile
group|PEOPLE:3|ANIMALS:0|FACE:multi|DESC:Three people outdoors: a woman in her 20s with curly brown hair and green eyes, a man in his 30s with a short dark beard and olive skin, and a teenage girl with long straight blonde hair and blue eyes
animal|PEOPLE:0|ANIMALS:1|FACE:none|DESC:A fluffy white curly-coated small dog with a black nose, dark round eyes, and floppy ears
person|PEOPLE:1|ANIMALS:1|FACE:clean|DESC:A young man in his 20s with short dark brown hair, brown eyes, and light stubble, holding a small white curly dog
object|PEOPLE:0|ANIMALS:0|FACE:none|DESC:A vintage cherry-red convertible sports car with chrome trim and leather seats
scenery|PEOPLE:0|ANIMALS:0|FACE:none|DESC:A snowy alpine mountain peak at dusk with dramatic orange-pink clouds catching the light
unclear|PEOPLE:0|ANIMALS:0|FACE:unclear|DESC:unclear`;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUBJECT_TYPES = ['person', 'group', 'animal', 'object', 'scenery', 'unclear'] as const;
type SubjectType = (typeof SUBJECT_TYPES)[number];

function isSubjectType(s: string): s is SubjectType {
  return (SUBJECT_TYPES as readonly string[]).includes(s);
}

type FaceSignal = 'clean' | 'multi' | 'none' | 'unclear';

interface Classification {
  description: string;
  type: SubjectType;
  num_people: number;
  num_animals: number;
  face: FaceSignal;
}

function parseResponse(raw: string): Classification {
  // Contract: TYPE|PEOPLE:n|ANIMALS:n|FACE:x|DESC:<description> (see
  // CLASSIFY_PROMPT). Pipe-delimited (NOT JSON) so the brace-stripping sanitizer
  // in describeWithVision can't corrupt it. DESC is last, so we take everything
  // after "DESC:" verbatim (survives stray pipes in prose). Gracefully falls
  // back to the legacy "TYPE|description" format so a stale model reply still works.
  const trimmed = raw.trim();
  const descMatch = trimmed.match(/DESC:/i);

  let header: string;
  let description: string;
  if (descMatch && descMatch.index !== undefined) {
    header = trimmed.slice(0, descMatch.index);
    description = trimmed.slice(descMatch.index + descMatch[0].length).trim();
  } else {
    // Legacy path: "TYPE|description" or no delimiter at all.
    const pipe = trimmed.indexOf('|');
    if (pipe < 0) {
      console.warn('[classify-photo] No delimiter in response:', trimmed.slice(0, 100));
      return {
        description: trimmed.slice(0, 400),
        type: 'unclear',
        num_people: 0,
        num_animals: 0,
        face: 'unclear',
      };
    }
    header = trimmed.slice(0, pipe + 1);
    description = trimmed.slice(pipe + 1).trim();
  }

  const tokens = header
    .split('|')
    .map((t) => t.trim())
    .filter(Boolean);
  const rawType = (tokens[0] ?? '').toLowerCase();
  const type: SubjectType = isSubjectType(rawType) ? rawType : 'unclear';

  const numFor = (key: string): number | null => {
    const t = tokens.find((x) => x.toUpperCase().startsWith(key + ':'));
    if (!t) return null;
    const n = parseInt(t.slice(t.indexOf(':') + 1).trim(), 10);
    return Number.isFinite(n) ? n : null;
  };
  const faceTok = tokens.find((x) => x.toUpperCase().startsWith('FACE:'));
  const rawFace = faceTok
    ? faceTok
        .slice(faceTok.indexOf(':') + 1)
        .trim()
        .toLowerCase()
    : '';
  const face: FaceSignal =
    rawFace === 'clean' || rawFace === 'multi' || rawFace === 'none' ? rawFace : 'unclear';

  // Backfill counts when the model used the legacy format (no PEOPLE/ANIMALS).
  let numPeople = numFor('PEOPLE');
  let numAnimals = numFor('ANIMALS');
  if (numPeople === null) numPeople = type === 'person' ? 1 : type === 'group' ? 2 : 0;
  if (numAnimals === null) numAnimals = type === 'animal' ? 1 : 0;

  return {
    description: description || trimmed.slice(0, 400),
    type,
    num_people: Math.max(0, numPeople),
    num_animals: Math.max(0, numAnimals),
    face,
  };
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
    const raw = await describeWithVision(input_image, CLASSIFY_PROMPT, REPLICATE_TOKEN, 220);
    const { description, type, num_people, num_animals, face } = parseResponse(raw);
    console.log(
      `[classify-photo] ${Date.now() - t0}ms | type=${type} people=${num_people} animals=${num_animals} face=${face} | desc="${description.slice(0, 70)}..."`
    );
    return new Response(
      JSON.stringify({
        // Legacy fields (kept so already-installed app builds keep working).
        subject_description: description,
        type,
        // New structured signals (New Scene router + attach-time support gate).
        num_people,
        num_animals,
        face,
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
