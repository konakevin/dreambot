/**
 * describe-photo — Takes a photo URL, sends it to Claude Haiku vision,
 * returns a detailed text description + physical trait summary.
 * One-time cost at profile save time.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';
import { describeWithVision, VISION_PROMPTS } from '../_shared/vision.ts';
import { analyzeCastPhoto } from '../_shared/analyzeCastPhoto.ts';

const REPLICATE_TOKEN = Deno.env.get('REPLICATE_API_TOKEN')!;

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, content-type',
      },
    });
  }

  try {
    // Auth check
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
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
    }

    // Rate limit (migration 228): 10 vision calls/min/user. Service-role
    // INSERT trips the BEFORE INSERT trigger on edge_function_invocations.
    // The trigger raises P0001 with `hint: rate_limited` when over cap.
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
    const { error: rateLimitError } = await supabaseAdmin
      .from('edge_function_invocations')
      .insert({ user_id: user.id, function_name: 'describe-photo' });
    if (rateLimitError) {
      const isRateLimit =
        rateLimitError.message?.includes('rate_limited') ||
        (rateLimitError as { hint?: string }).hint === 'rate_limited';
      if (isRateLimit) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded — try again shortly' }), {
          status: 429,
        });
      }
      console.error('[describe-photo] rate-limit log INSERT failed:', rateLimitError.message);
      // Fail open: don't block legitimate users on logging failures.
    }

    const { image_url, role } = await req.json();
    if (!image_url || !role) {
      return new Response(JSON.stringify({ error: 'image_url and role required' }), {
        status: 400,
      });
    }

    const prompt = role === 'pet' ? VISION_PROMPTS.castPet : VISION_PROMPTS.castPerson;
    const rawDescription = await describeWithVision(image_url, prompt, REPLICATE_TOKEN, 400);

    // Split the AGE: and TRAITS: sections from the description. These labels USED
    // to sit on their own lines, but _shared/sanitizeUserText (run on the vision
    // output in describeWithVision) strips control chars — including newlines —
    // and collapses whitespace, so they now arrive inline (". AGE: 27 TRAITS: …").
    // Match the labels on a word boundary instead of anchoring on \n so the parse
    // is robust whether or not the newlines survive.
    let mainText = rawDescription;
    let physicalSummary = '';
    let age: number | null = null;
    const ageMatch = rawDescription.match(/\bAGE:\s*(\d{1,3})\b/i);
    if (ageMatch) {
      const n = parseInt(ageMatch[1], 10);
      if (Number.isFinite(n) && n >= 1 && n <= 120) age = n;
    }
    const traitsMatch = rawDescription.match(/\bTRAITS:\s*(.+)/i);
    if (traitsMatch) {
      physicalSummary = traitsMatch[1].trim();
    }
    // mainText = everything before the first AGE: / TRAITS: label
    const firstStructuredMatch = rawDescription.match(/\b(?:AGE|TRAITS):/i);
    if (firstStructuredMatch && firstStructuredMatch.index !== undefined) {
      mainText = rawDescription.slice(0, firstStructuredMatch.index).trim();
    }

    // Extract gender from the "Male:" / "Female:" prefix and strip it from the description
    let gender: 'male' | 'female' | null = null;
    let description = mainText;
    if (role !== 'pet') {
      const lower = mainText.toLowerCase();
      if (
        lower.startsWith('female:') ||
        lower.startsWith('female,') ||
        lower.startsWith('female ')
      ) {
        gender = 'female';
        description = mainText.replace(/^(?:female)[:\s,]+/i, '').trim();
      } else if (
        lower.startsWith('male:') ||
        lower.startsWith('male,') ||
        lower.startsWith('male ')
      ) {
        gender = 'male';
        description = mainText.replace(/^(?:male)[:\s,]+/i, '').trim();
      } else {
        // Fallback: regex on the full text
        gender = /woman|female|girl|she|her\b/i.test(mainText) ? 'female' : 'male';
      }
    }

    // ── Build bucket: thin / athletic / average (persons only) ──
    // The describer commits the build on the header line right after the gender.
    // Pull it from there (it sits at the front once the gender prefix is stripped),
    // remove it from the prose, and ensure physical_summary carries it. If parsing
    // finds no bucket anywhere, DEFAULT to "average" — never a heavy/unkind label.
    if (role !== 'pet') {
      let build: string | null = null;
      const headerBuild = description.match(/^(thin|athletic|average)\b[\s,.:;-]*/i);
      if (headerBuild) {
        build = headerBuild[1].toLowerCase();
        description = description.slice(headerBuild[0].length).trim();
      }
      if (!build) {
        const found = `${physicalSummary} ${description}`
          .toLowerCase()
          .match(/\b(thin|athletic|average)\b/);
        build = found ? found[1] : 'average';
      }
      if (!/\b(thin|athletic|average)\b/i.test(physicalSummary)) {
        physicalSummary = physicalSummary ? `${build} build, ${physicalSummary}` : `${build} build`;
      }
    }

    console.log(
      `[describe-photo] ${role} (${gender ?? 'pet'}, age=${age ?? '?'}):`,
      description.slice(0, 120)
    );
    if (physicalSummary) {
      console.log(`[describe-photo] traits: ${physicalSummary}`);
    }

    // Cast-photo swap-suitability (DREAM_CAST_HARDENING_PLAN.md Lever A). LOG-ONLY:
    // the same YuNet+ArcFace that gate the real swap judge the source photo, so we
    // calibrate thresholds against real uploads before flipping the client to block.
    // Pets aren't face-swapped this way — skip. Fail-open (null on Fly outage).
    let castQuality = null;
    if (role !== 'pet') {
      castQuality = await analyzeCastPhoto(image_url);
      if (castQuality) {
        console.log(
          `[describe-photo] cast_quality role=${role} suitable=${castQuality.suitable} reason=${castQuality.reason} faces=${castQuality.faceCount}/${castQuality.significantFaces} bbox=${castQuality.bboxFrac} embeddable=${castQuality.embeddable} frontal=${castQuality.frontalScore} gender=${castQuality.gender}`
        );
      }
    }

    return new Response(
      JSON.stringify({
        description,
        gender,
        age,
        physical_summary: physicalSummary || null,
        cast_quality: castQuality,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('[describe-photo] Error:', (err as Error).message);
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
  }
});
