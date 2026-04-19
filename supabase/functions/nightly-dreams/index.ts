/**
 * Edge Function: nightly-dreams
 *
 * Per-user nightly dream generation. Batch orchestration stays in
 * scripts/nightly-dreams.js — this function handles the full Scene DNA
 * pipeline for a single authenticated user:
 *
 *   medium/vibe resolution → cast description → dream roll →
 *   scene assembly → Sonnet brief → image generation → face swap →
 *   persist → upload row → budget upsert → generation log
 *
 * POST /functions/v1/nightly-dreams
 * Authorization: Bearer <user JWT>
 */

import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import type { VibeProfile, DreamCastMember } from '../_shared/vibeProfile.ts';
import { resolveMediumFromDb, resolveVibeFromDb } from '../_shared/dreamStyles.ts';
import { rollDream, NIGHTLY_SKIP_MEDIUMS } from '../_shared/dreamAlgorithm.ts';
import { assembleScene } from '../_shared/sceneEngine.ts';
// buildRenderEntity removed — full cast description now passes to Sonnet directly
import { getLocationCard } from '../_shared/essenceCards.ts';
import type { LocationCard } from '../_shared/essenceCards.ts';
import { callSonnet } from '../_shared/llm.ts';
import { applyVibeGenderModifier } from '../_shared/promptCompiler.ts';
import { sanitizePrompt } from '../_shared/sanitize.ts';
import { pickModel } from '../_shared/modelPicker.ts';
import { generateImage } from '../_shared/generateImage.ts';
import { faceSwap } from '../_shared/faceSwap.ts';
import { persistToStorage } from '../_shared/persistence.ts';
import { insertGenerationLog } from '../_shared/logging.ts';

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

  // User-scoped client for auth only
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

  // Service role client for DB operations (bypasses RLS)
  const supabase: SupabaseClient = createClient(supabaseUrl, serviceRoleKey);

  // ── Parse request body ─────────────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const vibe_profile = body.vibe_profile as VibeProfile | undefined;
  const dream_wish = (body.dream_wish as string) || undefined;
  const force_cast_role = (body.force_cast_role as string | null) || undefined;
  const force_medium = (body.force_medium as string) || undefined;
  const force_vibe = (body.force_vibe as string) || undefined;
  const force_nightly_path = (body.force_nightly_path as string) || undefined;
  const force_model = (body.force_model as string) || undefined;

  if (!vibe_profile) {
    return new Response(JSON.stringify({ error: 'vibe_profile is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── Timing ─────────────────────────────────────────────────────────────
  const t0 = Date.now();
  const timings: Record<string, number> = {};
  let lastLap = t0;
  const lap = (label: string) => {
    const now = Date.now();
    const stepMs = now - lastLap;
    const totalMs = now - t0;
    timings[label] = stepMs;
    console.log(`[nightly-dreams] ${label}: ${stepMs}ms (total: ${totalMs}ms)`);
    lastLap = now;
  };

  // ── Observability state ────────────────────────────────────────────────
  let sonnetBrief: string | null = null;
  let sonnetRawResponse: string | null = null;
  let visionDescription: string | null = null;
  let replicatePredictionId: string | null = null;
  const fallbackReasons: string[] = [];
  let logAxes: Record<string, unknown> = {};
  let resolvedMediumKey: string | undefined;
  let resolvedVibeKey: string | undefined;
  let faceSwapSource: string | undefined;
  let finalPrompt: string;

  // Budget tracking
  const today = new Date().toISOString().slice(0, 10);
  const { data: budgetRow } = await supabase
    .from('ai_generation_budget')
    .select('images_generated')
    .eq('user_id', userId)
    .eq('date', today)
    .single();
  const todayCount = budgetRow && budgetRow.images_generated ? budgetRow.images_generated : 0;

  try {
    // ══════════════════════════════════════════════════════════════════
    // ══ NIGHTLY DREAMBOT PATH — fully isolated, no shared templates ══
    // ══════════════════════════════════════════════════════════════════
    const nightlyProfile = vibe_profile as VibeProfile;

    // Recency: exclude the last 7 nightly mediums + vibes + locations from
    // the pool so the user doesn't see the same choices repeat in a row.
    // Falls back to the full pool if filtering would starve it (small
    // profiles). Locations are parsed from the enhanced_prompt since there's
    // no dedicated rolled_axes.location field.
    const { data: recentLogs } = await supabase
      .from('ai_generation_log')
      .select('rolled_axes, enhanced_prompt')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(7);
    const recentMediums = (recentLogs ?? [])
      .map((l) => (l.rolled_axes as Record<string, unknown>)?.medium)
      .filter((m): m is string => typeof m === 'string' && m.length > 0);
    const recentVibes = (recentLogs ?? [])
      .map((l) => (l.rolled_axes as Record<string, unknown>)?.vibe)
      .filter((v): v is string => typeof v === 'string' && v.length > 0);
    const profilePlaces = nightlyProfile.dream_seeds?.places ?? [];
    const profileThings = [
      ...(nightlyProfile.dream_seeds?.things ?? []),
      ...(nightlyProfile.dream_seeds?.characters ?? []),
    ];
    const recentPlaces = (recentLogs ?? [])
      .map((l) => {
        const prompt = (l.enhanced_prompt || '').toLowerCase();
        return profilePlaces.find((p) => prompt.includes(p.toLowerCase()));
      })
      .filter((p): p is string => !!p);
    const recentThings = (recentLogs ?? [])
      .map((l) => {
        const prompt = (l.enhanced_prompt || '').toLowerCase();
        return profileThings.find((t) => prompt.includes(t.toLowerCase()));
      })
      .filter((t): t is string => !!t);
    console.log(
      '[nightly-dreams] recent mediums:',
      recentMediums.slice(0, 5).join(', '),
      '| recent vibes:',
      recentVibes.slice(0, 5).join(', '),
      '| recent places:',
      recentPlaces.slice(0, 5).join(', '),
      '| recent things:',
      recentThings.slice(0, 5).join(', ')
    );

    // Watercolor removed from nightly — Kontext restyle consistently fails to transform
    let nightlyMedium = await resolveMediumFromDb(
      'my_mediums',
      nightlyProfile.art_styles,
      recentMediums
    );
    if (nightlyMedium.key === 'watercolor') {
      nightlyMedium = await resolveMediumFromDb(
        'my_mediums',
        nightlyProfile.art_styles,
        recentMediums
      );
      if (NIGHTLY_SKIP_MEDIUMS.has(nightlyMedium.key)) {
        nightlyMedium = await resolveMediumFromDb(
          'my_mediums',
          nightlyProfile.art_styles,
          recentMediums
        );
        if (NIGHTLY_SKIP_MEDIUMS.has(nightlyMedium.key)) {
          nightlyMedium = await resolveMediumFromDb('anime');
        }
      }
    }
    // Test mode overrides: force specific medium/vibe
    if (force_medium) {
      nightlyMedium = await resolveMediumFromDb(force_medium);
    }
    let nightlyVibe = await resolveVibeFromDb(
      'my_vibes',
      nightlyProfile.aesthetics,
      recentVibes
    );
    if (force_vibe) {
      nightlyVibe = await resolveVibeFromDb(force_vibe);
    }
    resolvedMediumKey = nightlyMedium.key;
    resolvedVibeKey = nightlyVibe.key;

    const baseMedium = nightlyMedium;

    console.log(
      '[nightly-dreams] NIGHTLY DREAMBOT | medium:',
      nightlyMedium.key,
      '| vibe:',
      nightlyVibe.key,
      '| force_cast_role:',
      force_cast_role,
      '| typeof:',
      typeof force_cast_role
    );

    // Step 1: Pick a mood-weighted scene template from 6,200+ Sonnet-generated DB templates
    const seeds = nightlyProfile.dream_seeds ?? { characters: [], places: [], things: [] };
    const moods = nightlyProfile.moods ?? {
      peaceful_chaotic: 0.5,
      cute_terrifying: 0.3,
      minimal_maximal: 0.5,
      realistic_surreal: 0.5,
    };
    let dreamSubject: string;

    // Check if we'll inject a cast member — decided before template selection
    // Describe any undescribed cast members server-side via Llama Vision (Replicate)
    const castMembers = nightlyProfile.dream_cast ?? [];
    const REPLICATE_KEY = Deno.env.get('REPLICATE_API_TOKEN');
    for (const member of castMembers) {
      if (
        !member.description &&
        member.thumb_url &&
        member.thumb_url.startsWith('http') &&
        REPLICATE_KEY
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
                Authorization: `Bearer ${REPLICATE_KEY}`,
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
              headers: { Authorization: `Bearer ${REPLICATE_KEY}` },
            });
            const pData = await poll.json();
            if (pData.status === 'succeeded') {
              member.description = (
                Array.isArray(pData.output) ? pData.output.join('') : (pData.output ?? '')
              ).trim();
              console.log(
                `[nightly-dreams] Described cast ${member.role}:`,
                member.description.slice(0, 60)
              );
              // Capture for observability
              if (!visionDescription) {
                visionDescription = member.description;
              }
              break;
            }
            if (pData.status === 'failed') throw new Error(pData.error);
          }
        } catch (descErr) {
          console.warn(
            `[nightly-dreams] Failed to describe cast ${member.role}:`,
            (descErr as Error).message
          );
          fallbackReasons.push(`cast_describe_failed:${member.role}:${(descErr as Error).message}`);
        }
      }
    }
    const describedCastMembers = castMembers.filter(
      (m: DreamCastMember) => m.description && m.thumb_url && m.thumb_url.startsWith('http')
    );

    // Roll the dream algorithm (path selection + cast + personal elements)
    const dreamRoll = rollDream(
      describedCastMembers,
      nightlyMedium.key,
      nightlyMedium.faceSwaps,
      force_cast_role,
      force_nightly_path
    );
    const {
      nightlyPath,
      composition,
      compositionMode,
      castMembers: selectedCast,
      includeLocation,
      includeObject,
    } = dreamRoll;
    const castPick = selectedCast.length > 0 ? (selectedCast[0] as DreamCastMember) : null;
    console.log(
      '[nightly-dreams] Dream roll:',
      nightlyPath,
      composition,
      compositionMode,
      '| cast:',
      selectedCast.map((m) => m.role),
      '| location:',
      includeLocation,
      '| object:',
      includeObject
    );

    // Assemble scene from modular pools (Scene DNA engine)
    // Apply recency filter to location picks — forces rotation through
    // user's places instead of clustering on one. With 2 places + filter,
    // locations alternate; with many places, they rotate naturally.
    let placePool = seeds.places;
    if (placePool.length > 0 && recentPlaces.length > 0) {
      const excludeSet = new Set(recentPlaces);
      const filtered = placePool.filter((p: string) => !excludeSet.has(p));
      // Keep filtered pool only if it has something; otherwise full list
      if (filtered.length >= 1) placePool = filtered;
    }
    const userPlace =
      includeLocation && placePool.length > 0
        ? placePool[Math.floor(Math.random() * placePool.length)]
        : undefined;
    // Same recency treatment on objects — rotates through user's things so
    // all of them get a turn, not just the lucky first-pick ones.
    let thingsPool = [...seeds.things, ...seeds.characters];
    if (thingsPool.length > 0 && recentThings.length > 0) {
      const excludeSet = new Set(recentThings);
      const filtered = thingsPool.filter((t: string) => !excludeSet.has(t));
      if (filtered.length >= 1) thingsPool = filtered;
    }
    const userThing =
      includeObject && thingsPool.length > 0
        ? thingsPool[Math.floor(Math.random() * thingsPool.length)]
        : undefined;

    // Fetch location essence card (lazy-generates on first encounter)
    let locationCard: LocationCard | null = null;
    if (userPlace && ANTHROPIC_KEY) {
      try {
        locationCard = await getLocationCard(userPlace, ANTHROPIC_KEY);
      } catch (err) {
        console.warn('[nightly-dreams] Location card failed:', (err as Error).message);
        fallbackReasons.push(`location_card_failed:${(err as Error).message}`);
      }
    }
    console.log(
      '[nightly-dreams] Essence cards | place:',
      userPlace ?? 'none',
      '| locationCard:',
      locationCard ? locationCard.cinematic_phrases.length + ' phrases' : 'null',
      '| thing:',
      userThing ?? 'none'
    );
    lap('essence-cards');

    // Detect gender from cast description for gender reinforcement
    let castGender: 'male' | 'female' | undefined;
    if (castPick && castPick.role !== 'pet') {
      const desc = ((castPick as DreamCastMember).description ?? '').toLowerCase();
      if (desc.includes('woman') || desc.includes('female') || desc.includes('girl')) {
        castGender = 'female';
      } else {
        castGender = 'male';
      }
    }

    // Determine render mode and face swap eligibility
    const isCharacterDream =
      composition === 'character' && castPick != null && castPick.role !== 'pet';
    const renderMode: 'natural' | 'embodied' | 'none' =
      composition === 'pure_scene' ? 'none' : nightlyMedium.characterRenderMode;
    const faceSwapEligible =
      isCharacterDream && nightlyMedium.faceSwaps && renderMode === 'natural';

    // ── Resolve character descriptions: single source of truth per render mode ──
    // Natural -> raw cast description (face swap handles identity)
    // Embodied -> pre-transformed medium-native description (LEGO minifig, clay figure, etc.)
    // ALL downstream prompt construction uses resolvedCast.promptDesc exclusively.
    function resolveCharacterDesc(member: DreamCastMember): string {
      return member.description ?? (member.role === 'pet' ? 'a small creature' : 'a figure');
    }

    const resolvedCast = selectedCast.map((m) => ({
      role: m.role,
      rawDescription: (m as DreamCastMember).description ?? '',
      promptDesc: resolveCharacterDesc(m as DreamCastMember),
    }));

    if (resolvedCast.length > 0) {
      console.log(
        '[nightly-dreams] Resolved cast (' + renderMode + '):',
        resolvedCast.map((c) => c.role + ':' + c.promptDesc.slice(0, 60)).join(' | ')
      );
    }

    // ── Relationship tone for multi-cast scenes ─────────────────────────
    // When 2+ cast are in a scene, the TONE of their interaction should
    // match their real-life relationship. self+plus_one(significant_other)
    // = romantic; self+plus_one(friend/sibling) = playful; self+parent/
    // child/grandchild = family; self+pet = human-animal bond.
    const relationshipTone = buildRelationshipTone(selectedCast);
    if (relationshipTone) {
      console.log('[nightly-dreams] relationship tone:', relationshipTone.kind);
    }

    dreamSubject = assembleScene({
      renderMode,
      faceSwapEligible,
      compositionMode,
      includeLocation,
      includeObject,
      userPlace,
      userThing,
      locationCard: locationCard ?? undefined,
      castGender,
      moodAxis: moods,
    });

    if (dream_wish) {
      dreamSubject += `. DREAM WISH (make this the heart): "${dream_wish}"`;
    }

    console.log('[nightly-dreams] Scene DNA:', dreamSubject.slice(0, 200));
    lap('nightly-subject');

    // Step 2: Shared context for both cast and non-cast paths
    const SHOT_DIRECTIONS = [
      'extreme low angle looking up, dramatic forced perspective, towering scale',
      'tilt-shift miniature effect, shallow depth of field, stacked depth layers',
      'silhouette against towering backlit sky, rim lighting, dramatic contrast',
      'macro lens extreme close-up, impossibly detailed textures, creamy bokeh background',
      'looking down from height into scene below, depth receding downward',
      'through rain-covered glass, soft distortion, reflections overlapping the scene',
      'dutch angle, dramatic tension, off-kilter framing',
      'tall environmental shot, subject small at base, towering environment stacked above',
      'looking upward through canopy or architecture, light filtering down from above',
      'symmetrical dead-center composition, Wes Anderson framing, obsessive balance',
      'long exposure motion blur, streaks of light, frozen and flowing simultaneously',
      'reflection in puddle or glass, scene doubled top and bottom',
      'extreme depth, foreground sharp, background stretching to infinity',
      'candid snapshot feeling, slightly off-center, caught mid-moment, deep perspective',
      'cascading depth, layers receding top to bottom through the frame',
    ];
    const shotDirection = SHOT_DIRECTIONS[Math.floor(Math.random() * SHOT_DIRECTIONS.length)];

    // Location is now the scene identity (baked into dreamSubject via assembleScene).
    // Objects flow through assembleScene() naturally — no enforcement in the brief.
    const avoidList =
      nightlyProfile.avoid && nightlyProfile.avoid.length > 0
        ? `\nNEVER INCLUDE: ${nightlyProfile.avoid.join(', ')}`
        : '';

    // ── DREAM COMPOSITION PATHS ──
    const mediumStyle = nightlyMedium.key.replace(/_/g, ' ');

    const castDescBlock =
      resolvedCast.length > 0
        ? resolvedCast
            .map((rc, i) => {
              return resolvedCast.length === 1
                ? renderMode === 'embodied'
                  ? `THE CHARACTER (already transformed into ${mediumStyle} style — place them in the scene as-is):\n${rc.promptDesc}`
                  : `THE MAIN CHARACTER (include these traits but STYLIZED — NOT photorealistic):\n${rc.promptDesc}`
                : `CHARACTER ${i + 1} (${rc.role}):\n${rc.promptDesc}`;
            })
            .join('\n\n')
        : '';
    const castInstruction =
      selectedCast.length > 1
        ? `Render ALL ${selectedCast.length} characters as ${mediumStyle} CHARACTERS — stylized, artistic. Show them TOGETHER interacting in the scene.`
        : selectedCast.length === 1
          ? `Render them as a ${mediumStyle} CHARACTER — stylized, illustrated, artistic. NOT a real photograph.`
          : '';

    const shortCastDesc = resolvedCast.length > 0 ? resolvedCast[0].promptDesc.split(',')[0] : null;

    let nightlyBrief: string;

    if (composition === 'character') {
      if (faceSwapEligible) {
        // Face-swap brief: scene first, then HARD face lock, then character
        nightlyBrief = `You are a cinematic ${mediumStyle} artist. Write a Flux AI prompt (70-100 words, comma-separated).

STRUCTURE:
1. Start with: "${baseMedium.fluxFragment}"
2. SCENE/ENVIRONMENT (50% of words)
3. SUBJECT FRAMING (must be early in the prompt)
4. CHARACTER (20% of words)
5. CAMERA + MOOD (20% of words)
6. End with: no text, no words, no letters, no watermarks, ultra detailed

DREAM SCENE${includeLocation && userPlace ? ` (set in ${userPlace} — this is the location, honor it)` : ''} — use as inspiration, SELECT and SUBORDINATE:
${dreamSubject}

SELECT AND SUBORDINATE (critical):
- The DREAM SCENE contains many raw elements. Pick ONE dominant visual anchor. Pick 2-3 supporting details that harmonize with it. Discard anything that competes or clashes.
- A strong single image with harmonious supporting details beats a busy one with everything crammed in.
- If the scene lists icicles AND desert dunes AND cable cars — pick the ONE that fits the vibe and location, skip the others.

MANDATORY — include this EXACT phrase unchanged somewhere in the prompt:
"front-facing subject facing the camera, three-quarter front angle, eyes visible, no back view, no rear angle"

COMPOSITION RULES (must obey):
- Subject facing camera. No back view. No rear angle. No over-the-shoulder. No silhouette.
- No crouching, no kneeling, no looking down, no looking away from camera.
- The character is visible and facing the viewer in the scene.

CHARACTER IN THE SCENE:
${castDescBlock}
Do NOT over-describe the face. Just "natural human face" is enough. Push detail into clothing, pose, and environment.

MOOD: ${applyVibeGenderModifier(nightlyVibe.key, nightlyVibe.directive, castGender ?? null)}
${avoidList}

COMPOSITION: ${compositionMode === 'balanced' ? 'natural cinematic framing' : compositionMode.replace(/_/g, ' ')}
${compositionMode !== 'balanced' ? '- Obey this composition style in camera framing and scene layout' : ''}

RULES:
- SCENE FIRST, then the mandatory face phrase, then character details.
- Include "foreground midground background stacked top to bottom, layered depth" in the prompt. Compose with depth — stack layers top to bottom, not left to right.
- Every word must be something a camera can see. No feelings, no metaphors.
Output ONLY the prompt.`;
      } else {
        // Non-face-swap brief: standard scene-first approach
        nightlyBrief = `You are a cinematic ${mediumStyle} artist. Write a Flux AI prompt (70-100 words, comma-separated).

CRITICAL STRUCTURE — follow this order EXACTLY:
1. Start with: "${baseMedium.fluxFragment}"
2. SCENE/ENVIRONMENT (spend 60% of words here — this is the star)
3. CHARACTER placed naturally in the scene (spend 20% of words)
4. CAMERA + MOOD (spend 20% of words)
5. End with: no text, no words, no letters, no watermarks, ultra detailed

DREAM SCENE${includeLocation && userPlace ? ` (set in ${userPlace} — this is the location, honor it)` : ''} — use as inspiration, SELECT and SUBORDINATE:
${dreamSubject}

SELECT AND SUBORDINATE (critical):
- The DREAM SCENE contains many raw elements. Pick ONE dominant visual anchor. Pick 2-3 supporting details that harmonize with it. Discard anything that competes or clashes.
- A strong single image with harmonious supporting details beats a busy one with everything crammed in.
- If the scene lists icicles AND desert dunes AND cable cars — pick the ONE that fits the vibe and location, skip the others.

CHARACTER IN THE SCENE:
${castDescBlock}
${castInstruction}
${relationshipTone ? `\n${relationshipTone.block}\n` : ''}
MOOD: ${applyVibeGenderModifier(nightlyVibe.key, nightlyVibe.directive, castGender ?? null)}
${avoidList}

COMPOSITION: ${compositionMode === 'balanced' ? 'natural cinematic framing' : compositionMode.replace(/_/g, ' ')}

RULES:
- SCENE FIRST in the prompt. The environment must be rich, detailed, layered.
- Include "foreground midground background stacked top to bottom, layered depth" in the prompt. Compose with depth — stack layers top to bottom, not left to right.
- The character is actively DOING something interesting in the world — fighting, climbing, leaping, exploring, casting, riding. Dynamic action, not standing still.
- Character visible from front or side angle — never a back-turned or rear-view shot.
- Every word must be something a camera can see. No feelings, no metaphors.
Output ONLY the prompt.`;
      }
      logAxes = {
        medium: nightlyMedium.key,
        vibe: nightlyVibe.key,
        engine: 'nightly-cast-character',
        nightlyPath,
        castRoles: selectedCast.map((m) => m.role),
      };
    } else if (composition === 'epic_tiny') {
      const tinyDesc =
        resolvedCast.length > 1
          ? `tiny ${mediumStyle}-style figures: ${resolvedCast.map((rc) => rc.promptDesc.split(',')[0]).join(' and ')}`
          : `a tiny ${mediumStyle}-style ${shortCastDesc}`;
      nightlyBrief = `You are a cinematographer composing an EPIC, VAST scene. Write a Flux AI prompt (60-90 words, comma-separated).

MEDIUM: ${baseMedium.fluxFragment}

STYLE GUIDE (follow this closely):
${nightlyMedium.directive}

DREAM SCENE${includeLocation && userPlace ? ` (set in ${userPlace} — this is the location, honor it)` : ''} — use as inspiration, SELECT and SUBORDINATE:
${dreamSubject}

SELECT AND SUBORDINATE (critical):
- The DREAM SCENE contains many raw elements. Pick ONE dominant environmental anchor. Pick 2-3 supporting details that harmonize with it. Discard anything that competes or clashes.
- A strong single landscape with harmonious supporting details beats a busy one with everything crammed in.
- If the scene lists icicles AND desert dunes AND cable cars — pick the ONE that fits the vibe and location, skip the others.

Somewhere in this vast scene, barely visible: ${tinyDesc}. They occupy less than 5% of the image. The scene is EVERYTHING.
${relationshipTone && selectedCast.length >= 2 ? `\n${relationshipTone.block}\n` : ''}
CAMERA: ${shotDirection}
MOOD: ${applyVibeGenderModifier(nightlyVibe.key, nightlyVibe.directive, castGender ?? null)}
${avoidList}

Write the prompt:
1. Start with the art medium
2. Spend 90% of words on the ENVIRONMENT — architecture, physics, materials, light, weather
3. Mention the tiny ${selectedCast.length > 1 ? 'figures' : 'character'} in ONE short phrase at the very end
4. End with: no text, no words, no letters, no watermarks, hyper detailed
Output ONLY the prompt.`;
      logAxes = {
        medium: nightlyMedium.key,
        vibe: nightlyVibe.key,
        engine: 'nightly-cast-epic',
        nightlyPath,
        castRoles: selectedCast.map((m) => m.role),
      };
    } else {
      // ── Pure scene — no character, just breathtaking art ──
      nightlyBrief = `You are a cinematographer composing a single breathtaking frame. Write a Flux AI prompt (60-90 words, comma-separated).

MEDIUM: ${baseMedium.fluxFragment}

DREAM SCENE${includeLocation && userPlace ? ` (set in ${userPlace} — this is the location, honor it)` : ''} — use as inspiration, SELECT and SUBORDINATE:
${dreamSubject}

SELECT AND SUBORDINATE (critical):
- The DREAM SCENE contains many raw elements. Pick ONE dominant visual anchor. Pick 2-3 supporting details that harmonize with it. Discard anything that competes or clashes.
- A strong single image with harmonious supporting details beats a busy one with everything crammed in.
- If the scene lists icicles AND desert dunes AND cable cars — pick the ONE that fits the vibe and location, skip the others.

CAMERA/COMPOSITION: ${shotDirection}
MOOD: ${applyVibeGenderModifier(nightlyVibe.key, nightlyVibe.directive, castGender ?? null)}
${avoidList}

Write the prompt:
1. Start with the art medium
2. Describe the EXACT scene — every surreal detail preserved
3. NO PEOPLE. NO CHARACTERS. NO FIGURES. Pure environment.
4. Name specific materials, textures, light sources (NOUNS not adjectives)
5. End with: no text, no words, no letters, no watermarks, hyper detailed, masterwork composition
Output ONLY the prompt.`;
      logAxes = {
        medium: nightlyMedium.key,
        vibe: nightlyVibe.key,
        engine: 'nightly-pure-scene',
      };
    }

    try {
      const sonnet = await callSonnet(nightlyBrief, ANTHROPIC_KEY, 200);
      sonnetBrief = sonnet.brief;
      sonnetRawResponse = sonnet.rawResponse;
      if (sonnet.text.length < 20) throw new Error('too short');
      finalPrompt = sonnet.text;
    } catch (err) {
      fallbackReasons.push(`nightly_sonnet_failed:${(err as Error).message}`);
      finalPrompt = `${baseMedium.fluxFragment}, ${dreamSubject}, ${nightlyVibe.directive && nightlyVibe.directive.length > 0 ? nightlyVibe.directive.split('.')[0] : 'dramatic atmosphere'}, no text, hyper detailed`;
    }

    // Post-process: ensure location name appears in final prompt (Sonnet sometimes drifts)
    if (
      includeLocation &&
      userPlace &&
      !finalPrompt.toLowerCase().includes(userPlace.toLowerCase())
    ) {
      finalPrompt = `set in ${userPlace}, ` + finalPrompt;
    }

    // Post-process: brute force face lock for face-swap-eligible dreams.
    if (faceSwapEligible) {
      finalPrompt +=
        ', front-facing subject facing the camera, three-quarter front angle, head turned toward camera, eyes visible, no back view, no rear angle, no silhouette';
    }

    // Face swap — only fires for natural render mode with face-swap-eligible medium.
    if (
      faceSwapEligible &&
      castPick &&
      castPick.thumb_url &&
      castPick.thumb_url.startsWith('http') &&
      selectedCast.length === 1
    ) {
      faceSwapSource = castPick.thumb_url;
      console.log(`[nightly-dreams] Nightly face swap: ${castPick.role} -> ${nightlyMedium.key}`);
    }

    console.log(
      `[nightly-dreams] Nightly ${nightlyPath}/${composition}:`,
      finalPrompt.slice(0, 200)
    );
    lap('nightly-done');
  } catch (nightlyErr) {
    console.error(
      '[nightly-dreams] NIGHTLY PATH CRASHED:',
      (nightlyErr as Error).message,
      (nightlyErr as Error).stack
    );
    return new Response(
      JSON.stringify({ error: `Nightly path error: ${(nightlyErr as Error).message}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ── Post-pipeline: sanitize, generate, face swap, persist ──────────────
  finalPrompt = sanitizePrompt(finalPrompt);

  const autoPicked = await pickModel('flux-dev', finalPrompt, resolvedMediumKey, resolvedVibeKey);
  const pickedModel = force_model || autoPicked.model;
  logAxes.model = pickedModel;
  console.log(
    `[nightly-dreams] User ${userId}, model=${pickedModel}${force_model ? ' (force_model override)' : ''}, prompt=${finalPrompt.slice(0, 80)}...`
  );

  try {
    console.log(`[nightly-dreams] Starting image generation (model: ${pickedModel})...`);
    const genResult = await generateImage(
      'flux-dev',
      finalPrompt,
      undefined,
      REPLICATE_TOKEN,
      pickedModel
    );
    let tempUrl = genResult.url;
    replicatePredictionId = genResult.predictionId;
    if (genResult.nsfwRetries && genResult.nsfwRetries > 0) {
      logAxes.nsfwRetries = genResult.nsfwRetries;
      console.log(
        `[nightly-dreams] Generation passed after ${genResult.nsfwRetries} NSFW retry/retries`
      );
    }
    lap('image-gen');
    console.log(
      `[nightly-dreams] Image generation complete (prediction: ${genResult.predictionId})`
    );

    // Face swap: paste original face onto generated image
    if (faceSwapSource && tempUrl) {
      try {
        const sourceUrl = faceSwapSource;
        console.log('[nightly-dreams] Starting face swap...');
        tempUrl = await faceSwap(sourceUrl, tempUrl, REPLICATE_TOKEN);
        lap('face-swap-model');
        console.log('[nightly-dreams] Face swap complete');
        logAxes.faceSwapResult = 'success';
      } catch (err) {
        console.warn(
          '[nightly-dreams] Face swap failed, using unswapped image:',
          (err as Error).message
        );
        fallbackReasons.push(`face_swap_failed:${(err as Error).message}`);
        logAxes.faceSwapResult = 'failed';
        logAxes.faceSwapError = (err as Error).message;
      }
    }

    let imageUrl = tempUrl;

    // Persist to Storage + log in parallel
    timings.total = Date.now() - t0;
    const [persistedUrl] = await Promise.all([
      persistToStorage(tempUrl, userId, supabase),
      insertGenerationLog(supabase, {
        user_id: userId,
        recipe_snapshot: (vibe_profile as unknown as Record<string, unknown>) ?? {},
        rolled_axes: { ...logAxes, timings },
        enhanced_prompt: finalPrompt,
        model_used: pickedModel,
        cost_cents: 3,
        status: 'completed',
        sonnet_brief: sonnetBrief,
        sonnet_raw_response: sonnetRawResponse,
        vision_description: visionDescription,
        fallback_reasons: fallbackReasons,
        replicate_prediction_id: replicatePredictionId,
      }),
    ]);
    imageUrl = persistedUrl;
    lap('persist-done');

    // Draft upload + budget upsert in parallel
    let uploadId: string | undefined;
    const caption = finalPrompt.length > 200 ? finalPrompt.slice(0, 197) + '...' : finalPrompt;
    const [uploadResult] = await Promise.all([
      supabase
        .from('uploads')
        .insert({
          user_id: userId,
          image_url: imageUrl,
          caption,
          ai_prompt: finalPrompt,
          dream_medium: resolvedMediumKey ?? null,
          dream_vibe: resolvedVibeKey ?? null,
          is_ai_generated: true,
          is_public: false,
          width: 768,
          height: 1664,
        })
        .select('id')
        .single(),
      supabase
        .from('ai_generation_budget')
        .upsert(
          {
            user_id: userId,
            date: today,
            images_generated: todayCount + 1,
            total_cost_cents: (todayCount + 1) * 3,
          },
          { onConflict: 'user_id,date' }
        )
        .then(
          () => {},
          () => {}
        ),
    ]);
    uploadId = uploadResult.data && uploadResult.data.id ? uploadResult.data.id : undefined;
    if (uploadResult.error) {
      console.error('[nightly-dreams] Failed to create draft upload:', uploadResult.error.message);
    }

    lap('total');
    console.log(`[nightly-dreams] Done in ${Date.now() - t0}ms for user ${userId}`);

    return new Response(
      JSON.stringify({
        image_url: imageUrl,
        upload_id: uploadId ?? null,
        prompt_used: finalPrompt,
        resolved_medium: resolvedMediumKey ?? null,
        resolved_vibe: resolvedVibeKey ?? null,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    const errMsg = (err as Error).message;
    console.error(`[nightly-dreams] Error for user ${userId}:`, errMsg);

    return new Response(JSON.stringify({ error: errMsg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// ─── Relationship tone ──────────────────────────────────────────────────
// Determines the interaction tone between 2+ cast members in the same scene.
// Solo scenes return null (no tone directive needed).
type RelationshipTone = {
  kind: 'romantic' | 'family' | 'petBond' | 'playful';
  block: string;
};

function buildRelationshipTone(
  selectedCast: { role: string; relationship?: string }[]
): RelationshipTone | null {
  if (selectedCast.length < 2) return null;
  const roles = new Set(selectedCast.map((c) => c.role));
  const plusOne = selectedCast.find((c) => c.role === 'plus_one');
  const rel = plusOne?.relationship;

  if (roles.has('self') && roles.has('plus_one') && rel === 'significant_other') {
    return {
      kind: 'romantic',
      block: `RELATIONSHIP TONE — apply throughout the scene:
The two characters are life partners — deeply close in every way. The scene can lean into ANY part of that relationship: the intimate side (holding hands, stealing glances, tender moments, slow dances, sunset walks, shared meals, warm looks, quiet conversations, reading side by side) OR the playful side (laughing together, adventuring, partners in crime, matching mischievous grins, goofy shared moments, road-trip energy, high-fives, doing something silly). Whatever the moment, the emotional truth is "we're each other's person." Absolutely never sexual — always sweet, warm, genuine. Only this bucket gets to use intimate language; every other relationship stays platonic.`,
    };
  }

  if (
    roles.has('self') &&
    roles.has('plus_one') &&
    (rel === 'parent' || rel === 'child' || rel === 'grandchild')
  ) {
    return {
      kind: 'family',
      block: `RELATIONSHIP TONE — apply throughout the scene:
The two characters share a warm familial bond — intergenerational closeness, care and protection, shared moments of teaching or wonder. Walking side by side, a hand on a shoulder, shared laughter, quiet comfort. Not romantic. Just the genuine affection that comes from family.`,
    };
  }

  if (roles.has('self') && roles.has('pet') && !roles.has('plus_one')) {
    return {
      kind: 'petBond',
      block: `RELATIONSHIP TONE — apply throughout the scene:
The person and their animal companion share a close bond — walking together, playing, reading with the animal nearby, sharing a quiet moment or a shared adventure. Warm human-animal connection. The animal behaves like a real animal, not anthropomorphic.`,
    };
  }

  // Default: friends, siblings, unknown relationship, or 3+ mixed cast
  return {
    kind: 'playful',
    block: `RELATIONSHIP TONE — apply throughout the scene:
The characters are close companions sharing an experience — laughing, discovering, adventuring together, high-fiving, pointing out something cool, mid-motion through a shared moment. Camaraderie and genuine warmth. NOT romantic — no hand-holding, no intimate gestures, no lovey energy. Think "friends sharing a great moment."`,
  };
}
