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
import { rollDream } from '../_shared/dreamAlgorithm.ts';
import { assembleScene } from '../_shared/sceneEngine.ts';
// buildRenderEntity removed — full cast description now passes to Sonnet directly
import { getLocationCard, normalizeName } from '../_shared/essenceCards.ts';
import type { LocationCard } from '../_shared/essenceCards.ts';
import { callSonnet } from '../_shared/llm.ts';
import { applyVibeGenderModifier } from '../_shared/promptCompiler.ts';
import { sanitizePrompt } from '../_shared/sanitize.ts';
import { pickModel } from '../_shared/modelPicker.ts';
import { generateImage } from '../_shared/generateImage.ts';
import { faceSwap, dualFaceSwap } from '../_shared/faceSwap.ts';
import {
  aHashHex,
  hammingDistance,
  persistBufferToStorage,
  persistToStorage,
} from '../_shared/persistence.ts';
import { insertGenerationLog } from '../_shared/logging.ts';
import { pickDualAction } from '../_shared/pools/dual_actions.ts';
import { pickDualCompositionPath } from '../_shared/pools/dual_composition.ts';
import { pickSingleAction } from '../_shared/pools/single_actions.ts';
import { pickSceneCluster } from '../_shared/pools/scene_clusters.ts';
import {
  pickSceneAngle,
  pickMoodTwist,
  pickNarratorHint,
} from '../_shared/pools/universal_axes.ts';

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
  const force_dual_pool =
    (body.force_dual_pool as 'partner' | 'companion' | undefined) || undefined;
  const force_single_pool =
    (body.force_single_pool as 'portrait' | 'candid' | undefined) || undefined;

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
  let faceSwapSources: Array<{ role: string; sourceUrl: string }> | undefined;
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

    let nightlyMedium = await resolveMediumFromDb(
      'my_mediums',
      nightlyProfile.art_styles,
      recentMediums
    );
    // Test mode overrides: force specific medium/vibe
    if (force_medium) {
      nightlyMedium = await resolveMediumFromDb(force_medium);
    }
    let nightlyVibe = await resolveVibeFromDb('my_vibes', nightlyProfile.aesthetics, recentVibes);
    if (force_vibe) {
      nightlyVibe = await resolveVibeFromDb(force_vibe);
    }
    resolvedMediumKey = nightlyMedium.key;
    resolvedVibeKey = nightlyVibe.key;

    let baseMedium = nightlyMedium;

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
      nightlyMedium,
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
    let userThing =
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

    // ── Object-location compatibility filter ──────────────────────────
    // If the randomly-picked object's tags clash with the location's tags,
    // re-select from compatible pool items. 12% chaos gate preserves
    // unexpected combos. Fully fail-safe: errors keep the original pick.
    const COMPAT_CONFLICTS: Record<string, string[]> = {
      snow: ['tropical', 'desert', 'underwater'],
      water: ['desert', 'space'],
      ocean: ['desert', 'space', 'underground'],
      fire: ['underwater', 'snow'],
      plant: ['space', 'underwater'],
    };

    if (
      userThing &&
      locationCard &&
      locationCard.tags &&
      locationCard.tags.length > 0 &&
      Math.random() >= 0.12
    ) {
      try {
        const normalizedPool = thingsPool.map((t: string) => normalizeName(t));
        const { data: tagRows } = await supabase
          .from('object_cards')
          .select('name, tags')
          .in('name', normalizedPool)
          .eq('is_approved', true);

        if (tagRows && tagRows.length > 0) {
          const tagMap = new Map<string, string[]>();
          for (const row of tagRows) {
            tagMap.set(row.name, row.tags ?? []);
          }
          const locTags = new Set(locationCard.tags);

          const isCompat = (objName: string): boolean => {
            const oTags = tagMap.get(normalizeName(objName)) ?? [];
            for (const oTag of oTags) {
              const banned = COMPAT_CONFLICTS[oTag];
              if (!banned) continue;
              for (const b of banned) {
                if (locTags.has(b)) return false;
              }
            }
            return true;
          };

          if (!isCompat(userThing)) {
            const compatible = thingsPool.filter((t: string) => isCompat(t));
            if (compatible.length > 0) {
              const originalThing = userThing;
              userThing = compatible[Math.floor(Math.random() * compatible.length)];
              console.log(
                `[nightly-dreams] Compat filter: "${originalThing}" -> "${userThing}"`,
                `| loc: [${locationCard.tags.join(',')}]`,
                `| ${compatible.length}/${thingsPool.length} compatible`
              );
              logAxes.compatFilter = {
                original: originalThing,
                replacement: userThing,
                locationTags: locationCard.tags,
                compatibleCount: compatible.length,
                poolSize: thingsPool.length,
              };
            } else {
              console.log(
                `[nightly-dreams] Compat filter: no alternatives, keeping "${userThing}"`
              );
              logAxes.compatFilter = { original: userThing, replacement: null };
            }
          }
        }
      } catch (compatErr) {
        console.warn('[nightly-dreams] Compat filter error:', (compatErr as Error).message);
        fallbackReasons.push(`compat_filter_error:${(compatErr as Error).message}`);
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
    const isDualFaceSwap = faceSwapEligible && selectedCast.length === 2;

    // Override flux fragment for stylized mediums during face swap —
    // strip exaggerated-feature language that fights the face swap model
    const FACE_SWAP_FLUX_OVERRIDES: Record<string, { fluxFragment: string; directive?: string }> = {
      fairytale: {
        fluxFragment:
          'realistic human face with normal sized eyes and natural proportions, thin subtle eyebrows, NOT cartoon eyes, NOT anime eyes, NOT Disney princess eyes, hand-drawn 2D illustration set in a fairy tale world, painted watercolor backgrounds, flowing organic linework, golden hour lighting, painterly environments, rich warm color palette, strictly 2D not 3D CGI',
        directive:
          'Create images set in a hand-drawn 2D fairy tale world. Strictly 2D, never 3D CGI. Visual qualities: lush painted watercolor backgrounds, flowing organic linework, romantic golden hour lighting, painterly atmospheric environments, rich warm color palettes. Fairy tale imagery: castles, enchanted forests, magical transformations. CRITICAL FACE RULE — NON-NEGOTIABLE: ALL characters MUST have photorealistic adult human face proportions. Eyes MUST be normal human size — the same size you would see in a photograph. Do NOT enlarge eyes even slightly. Do NOT use cartoon, anime, or Disney character design for faces. Thin natural eyebrows only. The WORLD is fairy tale but the FACES are realistic. Apply this style to whatever subject and framing is provided.',
      },
      storybook: {
        fluxFragment:
          'picture book illustration, hand-painted with visible brush or pencil texture, warm golden color palette, cozy intimate feeling, watercolor gouache techniques, printed page quality, soft hand-drawn look, realistic human face with normal sized eyes and natural proportions, NOT cartoon eyes',
        directive:
          baseMedium.key === 'storybook'
            ? (baseMedium.directive ?? '').replace(
                'friendly simplified character design with expressive faces',
                'detailed character rendering with photorealistic human faces and natural proportions'
              )
            : undefined,
      },
      pencil: {
        fluxFragment:
          'colored pencil drawing, prismacolor art, visible pencil strokes, directional hatching, paper texture showing through, layered transparent color, hand-drawn quality, grainy tooth texture, confident linework, realistic human face with natural proportions',
      },
      anime: {
        fluxFragment:
          'realistic human face with normal sized eyes and natural proportions, eyes open and visible, thin subtle eyebrows, NOT anime eyes, NOT manga eyes, NOT chibi, NOT exaggerated facial expressions, cel-shaded illustrated scene, Japanese illustrated environments, vibrant color palette, clean linework, painted backgrounds, atmospheric lighting, strictly 2D not 3D CGI',
        directive:
          'Create images with cel-shaded illustrated environments inspired by Japanese illustration. Strictly 2D, never 3D CGI. Visual qualities: painted environments, vibrant color palettes, clean confident linework, atmospheric lighting, cel-shaded scenery. Imagery: cherry blossoms, neon-lit streets, traditional architecture, modern cityscapes, fantasy elements. CRITICAL FACE RULE — NON-NEGOTIABLE: ALL characters MUST have photorealistic adult human face proportions. Eyes MUST be normal human size and OPEN, never closed, never squinting in laughter, never exaggerated. Do NOT use anime, manga, or chibi character design for faces. Thin natural eyebrows only. Faces stay realistic regardless of emotion or scene. The ENVIRONMENT is illustrated but the FACES are realistic. Apply this aesthetic to whatever subject and framing is provided.',
      },
    };
    if (faceSwapEligible && baseMedium.key in FACE_SWAP_FLUX_OVERRIDES) {
      const override = FACE_SWAP_FLUX_OVERRIDES[baseMedium.key];
      baseMedium = {
        ...baseMedium,
        fluxFragment: override.fluxFragment,
        ...(override.directive ? { directive: override.directive } : {}),
      };
      console.log(`[nightly] face swap flux+directive override for ${baseMedium.key}`);
    }

    const isDualCharacter = composition === 'character' && selectedCast.length === 2;
    const isSingleCharacter = composition === 'character' && selectedCast.length === 1;
    const dualAction =
      isDualFaceSwap || isDualCharacter
        ? pickDualAction(
            selectedCast.find((c) => c.role === 'plus_one')?.relationship,
            force_dual_pool
          )
        : null;
    const singleActionObj = isSingleCharacter ? pickSingleAction(force_single_pool) : null;
    const singleAction = singleActionObj?.pose ?? null;
    const needsEpicBackdrop = singleActionObj?.needsEpicBackdrop ?? false;
    console.log(
      `[nightly-dreams] DUAL DEBUG: composition=${composition} isChar=${isCharacterDream} castPick=${castPick?.role} selectedCast=${selectedCast.length} faceSwap=${faceSwapEligible} isDual=${isDualFaceSwap} medium=${nightlyMedium.key} renderMode=${renderMode}${dualAction ? ` action="${dualAction}"` : ''}`
    );

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

    // ── Entropy axes — extra layers picked independently each render to
    //    break Sonnet's tendency to cluster on default imagery patterns.
    const sceneCluster = pickSceneCluster(userPlace);
    const sceneAngle = pickSceneAngle();
    const moodTwist = pickMoodTwist();
    const narratorHint = pickNarratorHint();
    console.log(
      `[nightly-dreams] entropy axes: cluster="${sceneCluster?.slice(0, 60) ?? 'none'}" angle="${sceneAngle.slice(0, 40)}" mood="${moodTwist.slice(0, 40)}" hint="${narratorHint.slice(0, 40)}"`
    );
    const entropyBlock = `
ENTROPY LAYERS — work these into the prompt naturally (do NOT name the layers):
${sceneCluster ? `- SCENE CLUSTER (specific spot within ${userPlace}): ${sceneCluster}` : ''}
- COMPOSITIONAL ANGLE: ${sceneAngle}
- ATMOSPHERIC BEAT: ${moodTwist}
- STORYTELLING HINT: ${narratorHint}
Layer these on top of the medium and vibe — each is an independent randomization so the same location renders differently each time.
`;

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
              if (resolvedCast.length === 1) {
                return renderMode === 'embodied'
                  ? `THE CHARACTER (already transformed into ${mediumStyle} style — place them in the scene as-is):\n${rc.promptDesc}`
                  : `THE MAIN CHARACTER (include these traits but STYLIZED — NOT photorealistic):\n${rc.promptDesc}`;
              }
              if (isDualFaceSwap) {
                const side = i === 0 ? 'left of frame' : 'right of frame';
                return `CHARACTER ${i + 1} (${side} — ${rc.role}):\n${rc.promptDesc}`;
              }
              return `CHARACTER ${i + 1} (${rc.role}):\n${rc.promptDesc}`;
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
        const faceLockPhrase = isDualFaceSwap
          ? 'two people, three-quarter view, person on left side, person on right side, clear gap between them'
          : 'three-quarter view, eyes and nose visible, no back view, no silhouette';
        const dualSepRule = isDualFaceSwap
          ? '\n- Character 1 in LEFT half, Character 2 in RIGHT half. Clear gap between them. No back-of-head views, no full profiles.'
          : '';
        const stylizedMediums = new Set(['storybook', 'pencil', 'fairytale', 'anime']);
        const needsRealisticFaces = stylizedMediums.has(baseMedium.key) && faceSwapEligible;
        const faceRealismRule = needsRealisticFaces
          ? '\nFACE REALISM — CRITICAL: faces must have realistic human proportions with detailed eyes, nose, mouth, and jawline. Do NOT simplify faces into cartoon, chibi, or dot-eye proportions. Do NOT draw thick or prominent eyebrows — keep eyebrows subtle, thin, and natural. Scene and clothing can be fully stylized but FACES must look like real people with natural brow lines.'
          : '';
        const faceDescRule = isDualFaceSwap
          ? 'Do NOT over-describe faces. Push detail into clothing, pose, and environment.'
          : 'Do NOT over-describe the face. Just "natural human face" is enough. Push detail into clothing, pose, and environment.';

        nightlyBrief = `You are a cinematic ${mediumStyle} artist. Write a Flux AI prompt (70-100 words, comma-separated).

STRUCTURE:
1. Start with: "${baseMedium.fluxFragment}"
2. SCENE/ENVIRONMENT (50% of words)
3. SUBJECT FRAMING (must be early in the prompt)
4. CHARACTER${isDualFaceSwap ? 'S' : ''} (20% of words)
5. CAMERA + MOOD (20% of words)
6. End with: no text, no words, no letters, no watermarks, ultra detailed

DREAM SCENE${includeLocation && userPlace ? ` (set in ${userPlace} — this is the location, honor it)` : ''} — use as inspiration, SELECT and SUBORDINATE:
${dreamSubject}

SELECT AND SUBORDINATE (critical):
- The DREAM SCENE contains many raw elements. Pick ONE dominant visual anchor. Pick 2-3 supporting details that harmonize with it. Discard anything that competes or clashes.
- A strong single image with harmonious supporting details beats a busy one with everything crammed in.
- If the scene lists icicles AND desert dunes AND cable cars — pick the ONE that fits the vibe and location, skip the others.

MANDATORY — include this EXACT phrase unchanged somewhere in the prompt:
"${faceLockPhrase}"

COMPOSITION RULES:${dualSepRule}
- ${isDualFaceSwap ? 'Medium shot — both characters waist-up, filling the frame. NOT a wide establishing shot. Characters must NOT be dwarfed by architecture or scenery.' : 'Character visible from waist up, filling at least 50% of frame height.'}
- ${isDualFaceSwap ? 'Three-quarter view on both faces — both angled slightly toward the VIEWER, like a candid movie still. Eyes and nose visible on both. NOT facing each other. NOT backs to camera. NEVER looking away from camera. NEVER gazing at scenery or horizon.' : 'Three-quarter view — eyes and nose visible but character is NOT looking at the camera.'}
- ${isDualFaceSwap ? 'Characters are STATIONARY — standing, sitting, leaning. NO walking, NO movement through the scene.' : ''}
- ${isDualFaceSwap ? 'Eye-level camera angle. NEVER extreme low angle looking up. Warm atmospheric lighting — NEVER harsh overhead or flat institutional light.' : ''}
- ${isDualFaceSwap ? 'Both characters should feel CONNECTED — sharing the same moment, reacting to the same world. Not doing separate isolated activities.' : ''}
- Characters grounded in the scene — environmental lighting, casting shadows. They exist IN this world.
- Describe BODY POSE and CLOTHING only. NEVER describe eye direction, gaze, or where they are looking.${faceRealismRule}
${dualAction ? `\nACTION IN SCENE (body language only):\n"${dualAction}"\nUse this for body pose. Do NOT describe eye direction.\n` : ''}${singleAction ? `\nACTION IN SCENE${needsEpicBackdrop ? ' (POSED PORTRAIT)' : ''}:\n"${singleAction}"\nUse this exact action. Adapt it to fit the medium and scene. Do NOT describe eye direction; the action describes what the body is doing.\n${needsEpicBackdrop ? '\nBACKDROP RULE — NON-NEGOTIABLE: This is a POSED PHOTO. The character is posing for the camera, so the SCENE/BACKDROP must be the reason this photo exists. Push the location HARD: pull the most striking elements from the scene DNA above (towering scale, dramatic sky, magical atmosphere, iconic landmark, sweeping vista, unusual color, theatrical light). Use AT LEAST 3 specific environmental details. Do NOT default to a generic backdrop — this scene is what makes the photo memorable.\n' : ''}` : ''}
CHARACTER${isDualFaceSwap ? 'S' : ''} IN THE SCENE:
${castDescBlock}
${faceDescRule}

${entropyBlock}
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
        // Non-face-swap brief: scene + character description must come through accurately
        const isDualCast = resolvedCast.length === 2;
        const castWordsTarget = isDualCast ? '40-50 words' : '25-35 words';
        const sceneWordsTarget = isDualCast ? '40-50 words' : '50-60 words';
        nightlyBrief = `You are a cinematic ${mediumStyle} artist. Write a Flux AI prompt (90-130 words, comma-separated).

CRITICAL STRUCTURE — follow this order EXACTLY:
1. Start with: "${baseMedium.fluxFragment}"
2. SCENE/ENVIRONMENT (${sceneWordsTarget})
3. CHARACTER${isDualCast ? 'S' : ''} placed naturally in the scene (${castWordsTarget} — this MUST be detailed)
4. CAMERA + MOOD (15-20 words)
5. End with: no text, no words, no letters, no watermarks, ultra detailed

DREAM SCENE${includeLocation && userPlace ? ` (set in ${userPlace} — this is the location, honor it)` : ''} — use as inspiration, SELECT and SUBORDINATE:
${dreamSubject}

SELECT AND SUBORDINATE (critical):
- The DREAM SCENE contains many raw elements. Pick ONE dominant visual anchor. Pick 2-3 supporting details that harmonize with it. Discard anything that competes or clashes.
- A strong single image with harmonious supporting details beats a busy one with everything crammed in.

CHARACTER${isDualCast ? 'S' : ''} IN THE SCENE:
${castDescBlock}
${castInstruction}
${dualAction ? `\nACTION IN SCENE (both characters):\n"${dualAction}"\nUse this for body pose.\n` : ''}${singleAction ? `\nACTION IN SCENE${needsEpicBackdrop ? ' (POSED PORTRAIT)' : ''}:\n"${singleAction}"\nUse this exact action verbatim. Adapt it to fit the medium aesthetic but keep the verbs.\n${needsEpicBackdrop ? '\nBACKDROP RULE — NON-NEGOTIABLE: This is a POSED PHOTO. The character is posing for the camera, so the SCENE/BACKDROP is the reason this photo exists. Push the location HARD: pull the most striking elements from the scene DNA (towering scale, dramatic sky, magical atmosphere, iconic landmark, sweeping vista, unusual color, theatrical light). Use AT LEAST 3 specific environmental details.\n' : ''}` : ''}${relationshipTone ? `\n${relationshipTone.block}\n` : ''}
CAST DESCRIPTION RULES — NON-NEGOTIABLE:
- PRESERVE every identifying physical trait from the description above: age, gender, hair color and length, eye color, beard/no beard, build, complexion. These traits are how the user recognizes themselves and their loved ones — do NOT compress them away.
${
  isDualCast
    ? `- BOTH characters must be clearly visible and clearly distinguishable. Describe ${resolvedCast[0].role} (${resolvedCast[0].promptDesc.split(',')[0].slice(0, 60)}) AND ${resolvedCast[1].role} (${resolvedCast[1].promptDesc.split(',')[0].slice(0, 60)}) with their full identifying traits.
- Two complete people in the frame, both faces visible, neither hidden, neither merged with the other.`
    : '- The character must be clearly visible with their identifying traits showing.'
}
- Do NOT generalize ("a man" / "a woman") — be SPECIFIC ("mid-30s man with sandy brown hair and full medium beard" / "mid-40s woman with shoulder-length wavy brown hair with highlights").

${entropyBlock}
MOOD: ${applyVibeGenderModifier(nightlyVibe.key, nightlyVibe.directive, castGender ?? null)}
${avoidList}

COMPOSITION: ${compositionMode === 'balanced' ? 'natural cinematic framing' : compositionMode.replace(/_/g, ' ')}

RULES:
- SCENE FIRST in the prompt. The environment must be rich, detailed, layered.
- Include "foreground midground background stacked top to bottom, layered depth" in the prompt.
- The character${isDualCast ? 's are' : ' is'} actively DOING something interesting in the world. Dynamic action, not standing still.
- Character${isDualCast ? 's' : ''} visible from front or three-quarter angle — never back-turned or rear-view.
- ${
          isDualCast
            ? 'BOTH characters MUST be present in the scene. Wide and far shots are welcome — be creative with framing — but two distinct people must be visible somewhere in the frame. NOT one person alone. NOT empty scenery. The cast description above is non-negotiable: both individuals must appear.'
            : 'The character MUST be present and visible in the scene. Wide and far shots are welcome.'
        }
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
${entropyBlock}
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
${entropyBlock}
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
      const sonnet = await callSonnet(nightlyBrief, ANTHROPIC_KEY, isDualFaceSwap ? 300 : 200);
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

    // Post-process: strip contemplative/directional/interaction language for dual face swap
    if (isDualFaceSwap) {
      finalPrompt = finalPrompt
        .replace(/looking (out )?(at|toward|into|across|over|up at) [^,]+/gi, '')
        .replace(/gazing (at|toward|into|across|over) [^,]+/gi, '')
        .replace(/overlooking [^,]+/gi, '')
        .replace(/staring (at|into|toward) [^,]+/gi, '')
        .replace(/watching [^,]+/gi, '')
        .replace(/from behind/gi, '')
        .replace(/rear view/gi, '')
        .replace(/back view/gi, '')
        .replace(/backs? to (the )?(camera|viewer)/gi, '')
        .replace(/sharing [^,]+ with /gi, '')
        .replace(/murmuring [^,]*/gi, '')
        .replace(/whispering [^,]*/gi, '')
        .replace(/turned toward (each other|the other|one another)/gi, '')
        .replace(/facing (each other|one another)/gi, '')
        .replace(/looking at (each other|one another)/gi, '')
        .replace(/leaning (in )?(toward|into|close to) (each other|the other|one another)/gi, '')
        .replace(/eye contact/gi, '')
        .replace(/locked eyes/gi, '')
        .replace(/eyes locked/gi, '')
        .replace(/standing opposite/gi, '')
        .replace(/face[- ]to[- ]face/gi, '')
        .replace(/about to kiss/gi, '')
        .replace(/leaning in for/gi, '')
        .replace(/noses (almost )?touching/gi, '')
        .replace(/,\s*,/g, ',')
        .replace(/,\s*$/g, '');
    }

    // Post-process: brute force face lock for face-swap-eligible dreams.
    if (faceSwapEligible) {
      const realisticFaceTag = '';
      if (isDualFaceSwap) {
        const dualPath = pickDualCompositionPath();
        const prepend = dualPath.prepend.replace('{realisticFaceTag}', realisticFaceTag);
        console.log(`[nightly] dual composition path: ${dualPath.name}`);
        finalPrompt = prepend + ' ' + finalPrompt;
      } else {
        finalPrompt += `, ${realisticFaceTag}face visible, eyes and nose visible, no back view, no silhouette`;
      }
    } else if (composition === 'character' && resolvedCast.length === 2) {
      // Non-face-swap dual cast: bake the SPECIFIC cast descriptions into
      // the prepend so Flux locks gender + identifying traits at the front
      // of the prompt. Without this Flux invents random pairs (two girls,
      // two boys, generic strangers).
      const shortDesc = (full: string): string => {
        // Pull the first ~16 words to get age + gender + 1-2 traits.
        const words = full.split(/\s+/).slice(0, 16).join(' ');
        return words.replace(/[.,;]+$/, '').replace(/^A\s+/i, 'a ');
      };
      const cast1 = shortDesc(resolvedCast[0].rawDescription || resolvedCast[0].promptDesc);
      const cast2 = shortDesc(resolvedCast[1].rawDescription || resolvedCast[1].promptDesc);
      finalPrompt = `${cast1} and ${cast2}, both visible in the scene, ` + finalPrompt;
    }

    // Face swap source assignment
    if (isDualFaceSwap) {
      const s = selectedCast[0] as DreamCastMember;
      const p = selectedCast[1] as DreamCastMember;
      if (
        s.thumb_url &&
        s.thumb_url.startsWith('http') &&
        p.thumb_url &&
        p.thumb_url.startsWith('http')
      ) {
        faceSwapSources = [
          { role: s.role, sourceUrl: s.thumb_url },
          { role: p.role, sourceUrl: p.thumb_url },
        ];
        console.log(`[nightly-dreams] Dual face swap: ${s.role}+${p.role} -> ${nightlyMedium.key}`);
      }
    } else if (
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
    // Capture for duplicate-bug observability
    const observability: Record<string, unknown> = {};
    const genResult = await generateImage(
      'flux-dev',
      finalPrompt,
      undefined,
      REPLICATE_TOKEN,
      pickedModel
    );
    let tempUrl = genResult.url;
    replicatePredictionId = genResult.predictionId;
    observability.replicateRawUrl = genResult.url;
    observability.replicatePredictionId = genResult.predictionId;
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

    // Face swap: dual (two people) or single — retry up to 3 times
    const FACE_SWAP_MAX_RETRIES = 3;
    if (faceSwapSources && faceSwapSources.length === 2 && tempUrl) {
      let swapSuccess = false;
      for (let attempt = 1; attempt <= FACE_SWAP_MAX_RETRIES; attempt++) {
        try {
          console.log(
            `[nightly-dreams] Dual face swap attempt ${attempt}/${FACE_SWAP_MAX_RETRIES}...`
          );
          tempUrl = await dualFaceSwap(
            faceSwapSources[0].sourceUrl,
            faceSwapSources[1].sourceUrl,
            tempUrl,
            REPLICATE_TOKEN,
            supabase,
            userId,
            t0 + 140_000
          );
          lap('dual-face-swap');
          console.log('[nightly-dreams] Dual face swap complete');
          logAxes.faceSwapResult = 'dual-success';
          logAxes.faceSwapAttempts = attempt;
          swapSuccess = true;
          break;
        } catch (err) {
          console.warn(
            `[nightly-dreams] Dual face swap attempt ${attempt}/${FACE_SWAP_MAX_RETRIES} failed:`,
            (err as Error).message
          );
          if (attempt === FACE_SWAP_MAX_RETRIES) {
            fallbackReasons.push(`dual_face_swap_failed_${attempt}x:${(err as Error).message}`);
            logAxes.faceSwapResult = 'dual-failed';
            logAxes.faceSwapError = (err as Error).message;
            logAxes.faceSwapAttempts = attempt;
          }
        }
      }
    } else if (faceSwapSource && tempUrl) {
      for (let attempt = 1; attempt <= FACE_SWAP_MAX_RETRIES; attempt++) {
        try {
          const sourceUrl = faceSwapSource;
          console.log(`[nightly-dreams] Face swap attempt ${attempt}/${FACE_SWAP_MAX_RETRIES}...`);
          tempUrl = await faceSwap(sourceUrl, tempUrl, REPLICATE_TOKEN);
          lap('face-swap-model');
          console.log('[nightly-dreams] Face swap complete');
          logAxes.faceSwapResult = 'success';
          logAxes.faceSwapAttempts = attempt;
          break;
        } catch (err) {
          console.warn(
            `[nightly-dreams] Face swap attempt ${attempt}/${FACE_SWAP_MAX_RETRIES} failed:`,
            (err as Error).message
          );
          if (attempt === FACE_SWAP_MAX_RETRIES) {
            fallbackReasons.push(`face_swap_failed_${attempt}x:${(err as Error).message}`);
            logAxes.faceSwapResult = 'failed';
            logAxes.faceSwapError = (err as Error).message;
            logAxes.faceSwapAttempts = attempt;
          }
        }
      }
    }

    let imageUrl = tempUrl;
    observability.preStoragetUrl = tempUrl;

    // ── Duplicate detect + retry (yan-ops face_swap canned-output bug) ──
    // The model occasionally returns a hardcoded scene with our face swapped
    // onto it instead of using our target_image. Bytes vary slightly (JPEG
    // re-encoding) so SHA-256 misses it; we use perceptual aHash + Hamming
    // distance to match by visual similarity.
    const DUP_RETRY_MAX = 2;
    const HAMMING_THRESHOLD = 6;
    let outBuf: ArrayBuffer | null = null;
    let outPhash: string | null = null;
    if (faceSwapSource || faceSwapSources) {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data: recent } = await supabase
        .from('uploads')
        .select('output_phash')
        .eq('user_id', userId)
        .gte('created_at', since)
        .not('output_phash', 'is', null)
        .order('created_at', { ascending: false })
        .limit(50);
      const recentPhashes = ((recent ?? []) as { output_phash: string }[])
        .map((r) => r.output_phash)
        .filter((h): h is string => !!h);
      for (let dupAttempt = 0; dupAttempt <= DUP_RETRY_MAX; dupAttempt++) {
        const fetchResp = await fetch(tempUrl);
        if (!fetchResp.ok) {
          console.warn(`[dup-detect] fetch failed, skipping: ${fetchResp.status}`);
          break;
        }
        outBuf = await fetchResp.arrayBuffer();
        try {
          outPhash = aHashHex(outBuf);
        } catch (e) {
          console.warn(`[dup-detect] aHash failed: ${(e as Error).message}`);
          break;
        }
        const collision = recentPhashes.find(
          (h) => hammingDistance(h, outPhash!) <= HAMMING_THRESHOLD
        );
        if (!collision) {
          if (dupAttempt > 0) console.log(`[dup-detect] cleared after ${dupAttempt} retry/retries`);
          break;
        }
        if (dupAttempt === DUP_RETRY_MAX) {
          console.warn(
            `[dup-detect] DUPLICATE PERSISTS after ${dupAttempt} retries — accepting | phash=${outPhash} dist=${hammingDistance(collision, outPhash)} pred=${replicatePredictionId}`
          );
          fallbackReasons.push(`dup_unresolved:${outPhash}`);
          break;
        }
        console.warn(
          `[dup-detect] HIT attempt=${dupAttempt + 1}/${DUP_RETRY_MAX + 1} phash=${outPhash} match=${collision} dist=${hammingDistance(collision, outPhash)} — retrying face swap`
        );
        if (dupAttempt > 0) await new Promise((r) => setTimeout(r, 350));
        try {
          if (faceSwapSources && faceSwapSources.length === 2) {
            tempUrl = await dualFaceSwap(
              faceSwapSources[0].sourceUrl,
              faceSwapSources[1].sourceUrl,
              genResult.url,
              REPLICATE_TOKEN,
              supabase,
              userId,
              t0 + 140_000
            );
          } else if (faceSwapSource) {
            tempUrl = await faceSwap(faceSwapSource, genResult.url, REPLICATE_TOKEN);
          }
        } catch (err) {
          console.warn(`[dup-detect] retry face swap failed:`, (err as Error).message);
          break;
        }
      }
      observability.outputPhash = outPhash;
      observability.preStoragetUrl = tempUrl;
    }

    // Persist to Storage + log in parallel
    timings.total = Date.now() - t0;
    const persistPromise = outBuf
      ? persistBufferToStorage(outBuf, userId, supabase)
      : persistToStorage(tempUrl, userId, supabase);
    const [persistedUrl] = await Promise.all([
      persistPromise,
      insertGenerationLog(supabase, {
        user_id: userId,
        recipe_snapshot: (vibe_profile as unknown as Record<string, unknown>) ?? {},
        rolled_axes: { ...logAxes, timings, observability },
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
          ...(outPhash ? { output_phash: outPhash } : {}),
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

  if (
    roles.has('self') &&
    roles.has('plus_one') &&
    (rel === 'partner' || rel === 'significant_other')
  ) {
    return {
      kind: 'romantic',
      block: `RELATIONSHIP TONE — apply throughout the scene:
The two characters are life partners — deeply close in every way. The scene can lean into ANY part of that relationship: the intimate side (holding hands, stealing glances, tender moments, slow dances, sunset walks, shared meals, warm looks, quiet conversations, reading side by side) OR the playful side (laughing together, adventuring, partners in crime, matching mischievous grins, goofy shared moments, road-trip energy, high-fives, doing something silly). Whatever the moment, the emotional truth is "we're each other's person." Absolutely never sexual — always sweet, warm, genuine. Only this bucket gets to use intimate language; every other relationship stays platonic.`,
    };
  }

  if (
    roles.has('self') &&
    roles.has('plus_one') &&
    (rel === 'family' || rel === 'parent' || rel === 'child' || rel === 'grandchild')
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
