/**
 * Edge Function: generate-first-dream
 *
 * Single-shot, curated, banger-rate first-dream pipeline. Re-uses the
 * nightly assembleScene engine but replaces rollDream's randomness with
 * persona-locked composition + curated medium/vibe rankings.
 *
 * Spec: FIRST_DREAM_BANGER_SPEC.md
 *
 * Flow:
 *   1. Auth + load profile (vibe_profile, dream_seeds, dream_cast)
 *   2. One-shot guard (users.first_dream_completed_at)
 *   3. Derive persona + pick medium + pick vibe (firstDreamPicker)
 *   4. Describe undescribed cast photos via Llama Vision
 *   5. Lock composition + compositionMode + includeObject from persona config
 *   6. assembleScene() with always-on first chosen location
 *   7. Build Sonnet brief (one of 3 templates per persona)
 *   8. Sonnet → 70-100 word Flux prompt
 *   9. Flux render (NSFW retry inside generateImage)
 *   10. Face swap (single via faceSwap, dual via dispatchDualFaceSwap)
 *   11. Persist + mark first_dream_completed_at
 *
 * POST /functions/v1/generate-first-dream
 * Authorization: Bearer <user JWT>
 */

import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import type { VibeProfile, DreamCastMember } from '../_shared/vibeProfile.ts';
import { resolveMediumFromDb, resolveVibeFromDb } from '../_shared/dreamStyles.ts';
import { assembleScene } from '../_shared/sceneEngine.ts';
import { getLocationCard } from '../_shared/essenceCards.ts';
import { applyFaceSwapOverride } from '../_shared/faceSwapFluxOverrides.ts';
import { applyVibeGenderModifier } from '../_shared/promptCompiler.ts';
import { pickDualAction } from '../_shared/pools/dual_actions.ts';
import { pickSingleAction } from '../_shared/pools/single_actions.ts';
import {
  derivePersona,
  pickFirstDreamMedium,
  pickFirstDreamVibe,
  pickCompositionMode,
  rollIncludeObject,
  FirstDreamCastInput,
} from '../_shared/firstDreamPicker.ts';
import { PERSONA_COMPOSITION, FirstDreamPersona } from '../_shared/firstDream.ts';

interface RequestBody {
  /** Test mode — bypass one-shot guard */
  bypass_one_shot?: boolean;
  /** Test mode — force a specific persona regardless of cast (for QA loops) */
  force_persona?: FirstDreamPersona;
}

Deno.serve(async (req) => {
  const REPLICATE_TOKEN = Deno.env.get('REPLICATE_API_TOKEN');
  const ANTHROPIC_KEY = Deno.env.get('ANTHROPIC_API_KEY');

  if (!REPLICATE_TOKEN) {
    return new Response(JSON.stringify({ error: 'Missing REPLICATE_API_TOKEN' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── Auth ───────────────────────────────────────────────────────────────
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabaseUser: SupabaseClient = createClient(
    supabaseUrl,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  );
  const {
    data: { user },
  } = await supabaseUser.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const userId = user.id;
  const supabase: SupabaseClient = createClient(supabaseUrl, serviceRoleKey);

  // ── Body ───────────────────────────────────────────────────────────────
  let body: RequestBody = {};
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    body = {};
  }

  // ── One-shot guard ─────────────────────────────────────────────────────
  if (!body.bypass_one_shot) {
    const { data: userRow } = await supabase
      .from('users')
      .select('first_dream_completed_at')
      .eq('id', userId)
      .single();
    if (userRow?.first_dream_completed_at) {
      return new Response(
        JSON.stringify({
          error: 'first_dream_already_completed',
          completed_at: userRow.first_dream_completed_at,
        }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // ── Load profile ───────────────────────────────────────────────────────
  const { data: recipeRow } = await supabase
    .from('user_recipes')
    .select('recipe')
    .eq('user_id', userId)
    .single();
  const profile = recipeRow?.recipe as VibeProfile | null;
  if (!profile) {
    return new Response(JSON.stringify({ error: 'no_vibe_profile' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── Persona derivation + ranked picks ──────────────────────────────────
  const cast = profile.dream_cast ?? [];
  const castInput: FirstDreamCastInput[] = cast.map((c) => ({
    role: c.role,
    hasPhoto: !!(c.thumb_url && c.thumb_url.startsWith('http')),
    gender: c.gender,
  }));
  const persona: FirstDreamPersona = body.force_persona ?? derivePersona(castInput);
  const userMediums = profile.art_styles ?? [];
  const userVibes = profile.aesthetics ?? [];

  const mediumPick = pickFirstDreamMedium(userMediums, persona);
  const vibePick = pickFirstDreamVibe(userVibes, persona);
  console.log(
    `[first-dream] persona=${persona} medium=${mediumPick.value}(${mediumPick.reason}) vibe=${vibePick.value}(${vibePick.reason})`
  );

  // Resolve to DB rows for full medium/vibe metadata
  const medium = await resolveMediumFromDb(mediumPick.value);
  if (!medium) {
    return new Response(
      JSON.stringify({ error: 'medium_not_found', attempted: mediumPick.value }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
  const vibe = await resolveVibeFromDb(vibePick.value);
  if (!vibe) {
    return new Response(JSON.stringify({ error: 'vibe_not_found', attempted: vibePick.value }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── Describe undescribed cast photos ───────────────────────────────────
  if (persona !== 'no_cast') {
    for (const member of cast) {
      if (
        !member.description &&
        member.thumb_url &&
        member.thumb_url.startsWith('http') &&
        REPLICATE_TOKEN
      ) {
        try {
          const descPrompt =
            member.role === 'pet'
              ? 'Describe this animal: species, breed, coat color/pattern, fur texture, eye color, ear shape, size, build, age, distinguishing features. 2-3 sentences.'
              : 'Describe this person for an AI artist creating a stylized character. Include: exact age estimate, face shape, eye color, hair (exact color, length, texture, style), facial hair if any, skin tone, build, clothing colors/style, distinguishing features (glasses, freckles, jewelry, tattoos). 3 sentences max. Be EXTREMELY specific.';
          const createRes = await fetch(
            'https://api.replicate.com/v1/models/meta/llama-3.2-90b-vision/predictions',
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${REPLICATE_TOKEN}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                input: { image: member.thumb_url, prompt: descPrompt, max_tokens: 300 },
              }),
            }
          );
          if (!createRes.ok) throw new Error(`Replicate ${createRes.status}`);
          const pred = await createRes.json();
          for (let i = 0; i < 30; i++) {
            await new Promise((r) => setTimeout(r, 2000));
            const poll = await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, {
              headers: { Authorization: `Bearer ${REPLICATE_TOKEN}` },
            });
            const pData = await poll.json();
            if (pData.status === 'succeeded') {
              member.description = (
                Array.isArray(pData.output) ? pData.output.join('') : (pData.output ?? '')
              ).trim();
              break;
            }
            if (pData.status === 'failed') throw new Error(pData.error);
          }
        } catch (err) {
          console.warn(
            `[first-dream] cast describe failed for ${member.role}:`,
            (err as Error).message
          );
        }
      }
    }
  }

  // ── Persona-locked composition knobs ───────────────────────────────────
  const personaConfig = PERSONA_COMPOSITION[persona];
  const compositionMode = pickCompositionMode(persona);
  const includeObject = rollIncludeObject(persona);
  const composition = personaConfig.composition;

  // Cast selection (deterministic per persona)
  let selectedCast: DreamCastMember[] = [];
  if (persona === 'duo') {
    const self = cast.find((c) => c.role === 'self');
    const plusOne = cast.find((c) => c.role === 'plus_one');
    if (self) selectedCast.push(self);
    if (plusOne) selectedCast.push(plusOne);
  } else if (persona === 'solo_male' || persona === 'solo_female') {
    const self = cast.find((c) => c.role === 'self' && c.thumb_url);
    const plusOne = cast.find((c) => c.role === 'plus_one' && c.thumb_url);
    if (self) selectedCast = [self];
    else if (plusOne) selectedCast = [plusOne];
  }

  const isCharacterDream = composition === 'character' && selectedCast.length > 0;
  const renderMode: 'natural' | 'embodied' | 'none' =
    composition === 'pure_scene' ? 'none' : medium.characterRenderMode;
  const faceSwapEligible = isCharacterDream && medium.faceSwaps && renderMode === 'natural';
  const isDualFaceSwap = faceSwapEligible && selectedCast.length === 2;

  // Apply face-swap medium overrides for stylized mediums (anime, fairytale, etc.)
  let baseMedium = medium;
  if (faceSwapEligible) {
    baseMedium = applyFaceSwapOverride(baseMedium);
  }

  // ── Always include user's first chosen location ────────────────────────
  const seeds = profile.dream_seeds ?? { characters: [], places: [], things: [] };
  const userPlace = seeds.places && seeds.places.length > 0 ? seeds.places[0] : undefined;

  // Object: persona-configured percentage
  let userThing: string | undefined;
  if (includeObject) {
    const thingsPool = [...(seeds.things ?? []), ...(seeds.characters ?? [])];
    if (thingsPool.length > 0) {
      userThing = thingsPool[Math.floor(Math.random() * thingsPool.length)];
    }
  }

  // ── Location card (cinematic phrases, fusion settings, tags) ───────────
  const locationCard =
    userPlace && ANTHROPIC_KEY
      ? await getLocationCard(userPlace, ANTHROPIC_KEY).catch((err) => {
          console.warn('[first-dream] locationCard failed:', (err as Error).message);
          return null;
        })
      : null;

  // ── Cast gender (drives assembleScene + brief modifiers) ──────────────
  let castGender: 'male' | 'female' | undefined;
  if (selectedCast.length > 0 && selectedCast[0].role !== 'pet') {
    castGender = persona === 'solo_female' ? 'female' : 'male';
  }

  // ── Action injection per template ──────────────────────────────────────
  // pickDualAction takes 'partner' | 'companion' only — map our extra
  // 'friends' and 'random' values to 'companion' (closest match for friends).
  const dualPool: 'partner' | 'companion' | undefined =
    personaConfig.actionPool?.kind === 'dual'
      ? personaConfig.actionPool.subPool === 'partner'
        ? 'partner'
        : 'companion'
      : undefined;
  const dualAction =
    isDualFaceSwap || (composition === 'character' && selectedCast.length === 2)
      ? pickDualAction(undefined, dualPool)
      : null;
  const singleActionObj =
    composition === 'character' && selectedCast.length === 1 ? pickSingleAction(undefined) : null;
  const singleAction = singleActionObj?.pose ?? null;
  const needsEpicBackdrop =
    personaConfig.actionPool?.kind === 'single' ? personaConfig.actionPool.epicBackdropBias : false;

  // ── Assemble the scene DNA ─────────────────────────────────────────────
  const moods = profile.moods ?? {
    peaceful_chaotic: 0.5,
    cute_terrifying: 0.3,
    minimal_maximal: 0.5,
    realistic_surreal: 0.5,
  };
  const dreamSubject = assembleScene({
    renderMode,
    faceSwapEligible,
    compositionMode,
    includeLocation: !!userPlace,
    includeObject: !!userThing,
    userPlace,
    userThing,
    locationCard: locationCard ?? undefined,
    castGender,
    moodAxis: moods,
  });

  // ── Build Sonnet brief (one of 3 templates) ────────────────────────────
  const mediumStyle = medium.key.replace(/_/g, ' ');
  const avoidList =
    profile.avoid && profile.avoid.length > 0 ? `\nNEVER INCLUDE: ${profile.avoid.join(', ')}` : '';

  let nightlyBrief: string;

  if (composition === 'character') {
    const castDescBlock = selectedCast
      .map((rc, i) => {
        const desc = rc.description ?? 'a person';
        if (selectedCast.length === 1) {
          return `THE MAIN CHARACTER (preserve every identifying trait — STYLIZED to match the medium):\n${desc}`;
        }
        const side = i === 0 ? 'left of frame' : 'right of frame';
        return `CHARACTER ${i + 1} (${side} — ${rc.role}):\n${desc}`;
      })
      .join('\n\n');

    if (isDualFaceSwap) {
      nightlyBrief = `You are a cinematic ${mediumStyle} artist. Write a Flux AI prompt (70-100 words, comma-separated).

THIS IS A FIRST DREAM — the user's very first generated image. Goal: JAW-DROPPING wonder + warmth.

STRUCTURE:
1. Start with: "${baseMedium.fluxFragment}"
2. SCENE/ENVIRONMENT (50%)
3. SUBJECT FRAMING (early)
4. CHARACTERS (20%)
5. CAMERA + MOOD (20%)
6. End with: no text, no words, no letters, no watermarks, ultra detailed

DREAM SCENE${userPlace ? ` (set in ${userPlace} — honor this location)` : ''} — pick ONE dominant anchor + 2-3 supporting details, discard the rest:
${dreamSubject}

MANDATORY — include this EXACT phrase unchanged:
"two people, three-quarter view, person on left side, person on right side, clear gap between them"

COMPOSITION RULES:
- Character 1 in LEFT half, Character 2 in RIGHT half. Clear gap. No back-of-head, no full profiles.
- Medium shot — both characters waist-up, filling the frame. NOT a wide establishing shot.
- Three-quarter view on both, both angled slightly toward the VIEWER, eyes and nose visible.
- Characters STATIONARY — standing, sitting, leaning. No walking, no movement through the scene.
- FRIENDS TONE: they share this wonder moment together. Companionship, candid joy, "look at this together" energy. NEVER romantic or intimate gesture.
- Eye-level camera. Warm atmospheric lighting — never harsh overhead.

ACTION (body language only):
"${dualAction ?? 'standing together side-by-side, taking in the scene, friends'}"

CHARACTERS IN THE SCENE:
${castDescBlock}
Do NOT over-describe faces. Push detail into clothing, pose, environment.

MOOD: ${applyVibeGenderModifier(vibe.key, vibe.directive, castGender ?? null)}
${avoidList}

COMPOSITION: ${compositionMode.replace(/_/g, ' ')}

RULES:
- SCENE FIRST, then the mandatory face phrase, then character details.
- Include "foreground midground background stacked top to bottom, layered depth" in the prompt.
- Every word must be something a camera can see. No feelings, no metaphors.
- This is a FIRST IMPRESSION — push for awe-inspiring beauty.
Output ONLY the prompt.`;
    } else if (faceSwapEligible) {
      nightlyBrief = `You are a cinematic ${mediumStyle} artist. Write a Flux AI prompt (70-100 words, comma-separated).

THIS IS A FIRST DREAM — the user's very first generated image. Goal: JAW-DROPPING wonder.

STRUCTURE:
1. Start with: "${baseMedium.fluxFragment}"
2. SCENE/ENVIRONMENT (50%)
3. SUBJECT FRAMING (early)
4. CHARACTER (20%)
5. CAMERA + MOOD (20%)
6. End with: no text, no words, no letters, no watermarks, ultra detailed

DREAM SCENE${userPlace ? ` (set in ${userPlace} — honor this location)` : ''} — pick ONE dominant anchor + 2-3 harmonizing details:
${dreamSubject}

MANDATORY — include this EXACT phrase unchanged:
"three-quarter view, eyes and nose visible, no back view, no silhouette"

COMPOSITION RULES:
- Character visible from waist up, filling at least 50% of frame height.
- Three-quarter view — eyes and nose visible.
- Describe BODY POSE and CLOTHING only. NEVER describe eye direction, gaze, or where they are looking.
- Character grounded in the scene — environmental lighting, casting shadows.

ACTION IN SCENE${needsEpicBackdrop ? ' (POSED PORTRAIT)' : ''}:
"${singleAction ?? 'standing in the scene, taking it in'}"
${needsEpicBackdrop ? '\nBACKDROP RULE — NON-NEGOTIABLE: This is a POSED PHOTO. The scene/backdrop is the reason this photo exists. Push the location HARD: pull the most striking elements (towering scale, dramatic sky, magical atmosphere, iconic landmark, sweeping vista, unusual color, theatrical light). Use AT LEAST 3 specific environmental details.\n' : ''}
CHARACTER IN THE SCENE:
${castDescBlock}
Do NOT over-describe the face. Just "natural human face" is enough. Push detail into clothing, pose, environment.

MOOD: ${applyVibeGenderModifier(vibe.key, vibe.directive, castGender ?? null)}
${avoidList}

COMPOSITION: ${compositionMode.replace(/_/g, ' ')}

RULES:
- SCENE FIRST, then the mandatory face phrase, then character details.
- Include "foreground midground background stacked top to bottom, layered depth" in the prompt.
- Every word must be something a camera can see. No feelings, no metaphors.
- This is a FIRST IMPRESSION — push for awe-inspiring beauty.
Output ONLY the prompt.`;
    } else {
      // Embodied medium (LEGO/claymation/etc.)
      nightlyBrief = `You are a cinematic ${mediumStyle} artist. Write a Flux AI prompt (90-130 words, comma-separated).

THIS IS A FIRST DREAM — push for jaw-dropping wonder.

STRUCTURE:
1. Start with: "${baseMedium.fluxFragment}"
2. SCENE/ENVIRONMENT (50-60 words)
3. CHARACTER placed naturally in the scene (25-35 words)
4. CAMERA + MOOD (15-20 words)
5. End with: no text, no words, no letters, no watermarks, ultra detailed

DREAM SCENE${userPlace ? ` (set in ${userPlace})` : ''} — pick ONE dominant anchor:
${dreamSubject}

CHARACTER IN THE SCENE:
${castDescBlock}
Render them as a ${mediumStyle} CHARACTER — stylized, illustrated. NOT a real photograph.

ACTION: "${singleAction ?? 'in the scene, fully present'}"

MOOD: ${applyVibeGenderModifier(vibe.key, vibe.directive, castGender ?? null)}
${avoidList}

COMPOSITION: ${compositionMode.replace(/_/g, ' ')}

RULES:
- SCENE FIRST. Environment must be rich, detailed, layered.
- Include "foreground midground background stacked top to bottom, layered depth" in the prompt.
- The character is actively DOING something interesting. Dynamic, not standing still.
- Front or three-quarter angle — never back-turned.
- Every word must be something a camera can see.
Output ONLY the prompt.`;
    }
  } else {
    // Pure scene
    nightlyBrief = `You are a cinematographer composing a single breathtaking frame. Write a Flux AI prompt (60-90 words, comma-separated).

THIS IS A FIRST DREAM — the user's first impression. Push for jaw-dropping wonder.

MEDIUM: ${baseMedium.fluxFragment}

DREAM SCENE${userPlace ? ` (set in ${userPlace} — honor this location)` : ''} — pick ONE dominant anchor + 2-3 harmonizing details:
${dreamSubject}

COMPOSITION: ${compositionMode.replace(/_/g, ' ')}

MOOD: ${applyVibeGenderModifier(vibe.key, vibe.directive, null)}
${avoidList}

Write the prompt:
1. Start with the art medium
2. Describe the EXACT scene — every striking detail preserved
3. NO PEOPLE. NO CHARACTERS. NO FIGURES. Pure environment.
4. Name specific materials, textures, light sources (NOUNS not adjectives)
5. End with: no text, no words, no letters, no watermarks, ultra detailed, masterwork composition
Output ONLY the prompt.`;
  }

  // ── Enqueue the heavy work for the worker ─────────────────────────────
  // We've built the brief synchronously (cheap — no API calls except the
  // optional one-time location card lookup). The worker handles Sonnet,
  // Flux, face swap, and persist — at its own pace, without the user's
  // 150 MB / 2 s budget. Returning <500 ms after enqueue.
  const queuePayload = {
    persona,
    medium_key: medium.key,
    vibe_key: vibe.key,
    composition,
    composition_mode: compositionMode,
    sonnet_brief: nightlyBrief,
    is_dual_face_swap: isDualFaceSwap,
    face_swap_eligible: faceSwapEligible,
    user_place: userPlace ?? null,
    user_thing: userThing ?? null,
    cast: selectedCast.map((c) => ({
      role: c.role,
      thumb_url: c.thumb_url,
      description: c.description ?? '',
      gender: c.gender,
    })),
    medium_pick_reason: mediumPick.reason,
    vibe_pick_reason: vibePick.reason,
    recipe_snapshot: { vibe_profile: profile },
  };

  const { data: queueRow, error: queueErr } = await supabase
    .from('dream_queue')
    .insert({
      user_id: userId,
      source: 'first_dream',
      payload: queuePayload,
    })
    .select('id, status, created_at')
    .single();

  if (queueErr || !queueRow) {
    return new Response(
      JSON.stringify({ error: 'enqueue_failed', detail: queueErr?.message ?? 'no row returned' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({
      dream_id: queueRow.id,
      status: queueRow.status,
      created_at: queueRow.created_at,
      persona,
      medium: medium.key,
      vibe: vibe.key,
      composition,
      composition_mode: compositionMode,
    }),
    { status: 202, headers: { 'Content-Type': 'application/json' } }
  );
});
