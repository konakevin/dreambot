/**
 * Single face-swap brief builder — isolated code path for one-cast face-swap
 * renders only.
 *
 * Used exclusively when `cast.length === 1 && composition.faceSwapEligible`.
 * Pure scene, dual face-swap, embodied dual, photo restyle — none of those hit
 * this code. Hands-off blast radius: only the "me on a face-swap eligible
 * medium" scenario.
 *
 * Why this exists (built 2026-05-30): the single-cast face-swap path was
 * falling through to the generic compiler, which picked from V2_CAMERA (a
 * pool that includes "tall environmental portrait, subject in lower third").
 * That framing put the character in ~5% of the frame so InsightFace's
 * detector couldn't find a face → all three face-swap models exhausted with
 * "no face found" errors. Dual face-swap renders worked because they had
 * `dualBriefBuilder.ts` mandating "medium shot, both characters waist-up,
 * filling the frame". This file is the single-cast equivalent.
 *
 * Mirrors the proven dual quality layers:
 *   - Composition prepend (single-cast camera presets — never wide vista)
 *   - Sonnet max_tokens 300 (vs the generic 200 — prevents cast-block truncation)
 *   - Face lock at front + appended (Flux early+late token bias)
 *   - Medium-shot, waist-up, frame-filling mandate
 *   - Dedicated CHARACTER section so physical traits survive compression
 *   - faceSwapFluxOverride applied for stylized mediums (fairytale/storybook/pencil/anime)
 */

import type { CompilerInput, CompilerOutput } from './promptCompiler.ts';
import { applyVibeGenderModifier } from './promptCompiler.ts';
import { applyFaceSwapOverride } from './faceSwapFluxOverrides.ts';

// ── Single-cast composition presets ────────────────────────────────────
// Mirrors `pools/dual_composition.ts` for the single case. Every preset
// MUST produce a medium-shot, waist-up framing with the character filling
// a meaningful portion of the frame — otherwise face-swap fails. NEVER
// add a "wide vista", "tall environmental portrait", or "subject in lower
// third" preset here; that's exactly what we're trying to prevent.

interface SingleCompositionPath {
  name: string;
  prepend: string;
  briefHint: string;
}

const SINGLE_COMPOSITION_PATHS: SingleCompositionPath[] = [
  {
    name: 'candid',
    prepend:
      'candid medium shot, person centered, three-quarter view facing camera, face fully visible, waist-up framing, character filling most of the frame, warm natural lighting,',
    briefHint: 'Candid feel — like a friend snapped this moment naturally. Relaxed body language.',
  },
  {
    name: 'portrait',
    prepend:
      'portrait shot, person centered facing the camera, three-quarter view, face fully visible and well-lit, waist-up framing, character dominating the frame, not from behind, not silhouette,',
    briefHint:
      'Classic portrait — character aware of the camera, natural but composed, fills the frame.',
  },
  {
    name: 'cinematic',
    prepend:
      'cinematic still, person in medium shot, three-quarter view facing camera, eye-level, atmospheric lighting, face fully visible, waist-up framing, character is the unmistakable subject filling the frame,',
    briefHint: 'Movie still — dramatic lighting, purposeful framing, like a film poster moment.',
  },
  {
    name: 'editorial',
    prepend:
      'editorial portrait, person posed naturally in medium shot, three-quarter view toward viewer, eye-level camera, golden hour lighting, face fully visible, waist-up framing,',
    briefHint: 'Editorial/magazine quality — stylish, purposeful, effortlessly cool.',
  },
  {
    name: 'environmental_medium',
    prepend:
      'environmental medium shot, person centered in the foreground, three-quarter view facing camera, waist-up framing, scene visible behind but character clearly the subject and filling most of the frame, atmospheric lighting,',
    briefHint:
      'Character grounded in a vivid setting, but the character is unmistakably the subject — scene supports, never dominates.',
  },
];

function pickSingleCompositionPath(): SingleCompositionPath {
  return SINGLE_COMPOSITION_PATHS[Math.floor(Math.random() * SINGLE_COMPOSITION_PATHS.length)];
}

export function buildSingleBrief(input: CompilerInput): CompilerOutput {
  const { medium: rawMedium, vibe, scene, cast, composition, profile } = input;

  if (cast.length !== 1 || !composition.faceSwapEligible) {
    throw new Error('buildSingleBrief called with non-single or non-face-swap input');
  }

  // Apply face-swap-specific flux fragment + directive override for stylized
  // mediums (fairytale/storybook/pencil/anime). Front-loads "realistic human
  // face" language so the face-swap pipeline doesn't fight stylized-character
  // eye proportions. Mirrors dualBriefBuilder.
  const medium = applyFaceSwapOverride(rawMedium);
  const mediumStyle = medium.key.replace(/_/g, ' ');

  const c = cast[0];
  const castGender: 'male' | 'female' | null =
    c.genderLock?.toUpperCase().includes('MALE') && !c.genderLock.toUpperCase().startsWith('FEMALE')
      ? 'male'
      : c.genderLock
        ? 'female'
        : null;
  const vibeDirective = applyVibeGenderModifier(vibe.key, vibe.directive, castGender);

  // ── Composition path: pick once, prepend at end via postProcess ──
  const singlePath = pickSingleCompositionPath();
  const singlePrepend = singlePath.prepend;

  // ── Cast description block — dedicated CHARACTER section so the physical
  // ── traits + gender lock survive Sonnet's compression budget. Matches the
  // ── shape dualBriefBuilder.ts uses (`CHARACTER 1 / CHARACTER 2`).
  const castDescBlock = `CHARACTER (${c.role}):
${c.promptDesc}
${c.genderLock ? `GENDER LOCK: ${c.genderLock}` : ''}
${c.physicalTraits ? `PHYSICAL TRAITS: ${c.physicalTraits}` : ''}`;

  const userPrompt = scene.userPrompt
    ? `\n═══ USER PROMPT — SACRED, OVERRIDES EVERYTHING BELOW ═══
"${scene.userPrompt}"
This is what the user asked for. Their LOCATION wins. Their ACTION wins. Their NAMED PEOPLE/PLACES/THINGS win. Build the prompt around these specifics. Do not invent a different scene or contradict them.
`
    : '';
  const sceneExpansion = scene.sceneExpansion ? `\nSCENE DETAILS:\n${scene.sceneExpansion}\n` : '';

  const styleReference = scene.styleReference
    ? `\nREFERENCE STYLE (apply ONLY these style descriptors — do NOT introduce any subjects, characters, places, or named entities from the reference):
"${scene.styleReference.slice(0, 400)}"
`
    : '';

  // Mandatory face-lock phrase — identical pattern to dual but for one
  // character. Forces Sonnet to keep frame-filling framing in the final
  // prompt even after its own rewrites.
  const faceLockPhrase =
    'single person, three-quarter view, face centered in frame, eyes nose mouth visible';

  const sonnetBrief = `You are a cinematic ${mediumStyle} artist. Write a Flux AI prompt (70-100 words, comma-separated).

STRUCTURE:
1. Start with: "${medium.fluxFragment}"
2. SCENE/ENVIRONMENT (40% of words) — built from the user prompt + scene details
3. SUBJECT FRAMING (must be early in the prompt)
4. CHARACTER (30% of words) — physical traits and clothing
5. CAMERA + MOOD (20% of words)
6. End with: no text, no words, no letters, no watermarks, ultra detailed
${userPrompt}${sceneExpansion}${styleReference}
MANDATORY — include this EXACT phrase unchanged somewhere in the prompt:
"${faceLockPhrase}"

COMPOSITION RULES (NON-NEGOTIABLE — face-swap pipeline depends on these):
- Medium shot — character waist-up, FILLING the frame. NOT a wide establishing shot. NOT a tall environmental portrait. NEVER subject in lower third. Character must NOT be dwarfed by architecture or scenery.
- Three-quarter view of the face — angled slightly toward the VIEWER, like a candid movie still. Eyes, nose, and mouth all clearly visible. NOT a full profile, NOT back to camera, NEVER looking away from camera.
- Character is the UNMISTAKABLE SUBJECT — scene supports them, scene does NOT dominate them.
- Character defaults to STATIONARY (standing, sitting, leaning) UNLESS the user prompt specifies an action verb — see ACTION/POSE RULE below for the override.
- Eye-level camera angle. NEVER extreme low angle looking up at scenery. Warm atmospheric lighting — NEVER harsh overhead or flat institutional light.
- Character grounded in the scene — environmental lighting, casting shadows. They exist IN this world.
- Describe BODY POSE and CLOTHING only. NEVER describe eye direction, gaze, or where they are looking.
- DO NOT include any face-bearing decorative objects in the same frame as the character: NO statues, busts, mannequins, dolls, masks, helmets with visible faceplates, totems, idols, gargoyles, carved figures, painted portraits, sculpted heads, or cartoon/character imagery on signs/billboards. These compete with the character's face during the face swap step and cause swap failures. If the scene calls for them, describe equivalent decoration that has no face (urns, banners, abstract carvings, geometric patterns, plants, lanterns, etc.).
${
  scene.userPrompt
    ? `
USER INTENT — EXPRESSION & POSE:
If the user prompt specifies a facial EXPRESSION (scared, angry, sad, surprised, joyful, smirking, sultry, etc.), translate it to physical face description (eyes / brows / mouth) early in the prompt. OVERRIDES default "warm / facing camera" cues.

If the user prompt specifies an ACTION (walking, running, dancing, hiking, sitting, etc.), render the character mid-action with documentary candid framing — body mechanics, weight transfer, tracking 3/4 angle, like a film still. OVERRIDES the default "stationary, three-quarter view facing camera" cue. NON-NEGOTIABLE: face still partially visible (3/4 toward camera, never pure profile, never from behind), character still fills the frame (NOT a tiny figure in a wide scene).

If the user prompt specifies a HAND GESTURE (shaka, peace sign, thumbs up, middle finger / the bird, rock on, ok sign, fist, point, wave, salute, etc.), spell out FINGER GEOMETRY explicitly — Flux defaults "shaka" to a wave unless you describe which fingers are extended and which are curled. Example: shaka = "thumb and pinky extended outward, three middle fingers curled into palm." Middle finger is allowed.
`
    : ''
}
CHARACTER IN THE SCENE:
${castDescBlock}

Do NOT over-describe the face. Push detail into clothing, pose, and environment.

MOOD: ${vibeDirective}
${profile?.avoid?.length ? `\nNEVER INCLUDE: ${profile.avoid.join(', ')}\n` : ''}
RULES:
- Medium-shot framing FIRST, then the mandatory face phrase, then character details.
- Include "foreground midground background stacked top to bottom, layered depth" in the prompt.
- Every word must be something a camera can see. No feelings, no metaphors.
Output ONLY the prompt.`;

  // Fallback — used if Sonnet fails entirely. Keep close to the face-lock
  // shape so even the safety net renders something face-swappable.
  const fallbackParts = [
    medium.fluxFragment,
    scene.userPrompt || 'a surreal dreamscape',
    faceLockPhrase,
    c.promptDesc.split(',')[0],
    vibe.directive ? vibe.directive.split('.')[0] : '',
    'medium shot, waist-up, character fills the frame',
    'no text, no words, no letters, no watermarks, hyper detailed',
  ].filter(Boolean);
  const fallback = fallbackParts.join(', ');

  // Face swap source — verified at entry, has a valid http URL
  const faceSwapSource =
    c.sourcePhotoUrl && c.sourcePhotoUrl.startsWith('http') ? c.sourcePhotoUrl : null;

  return {
    sonnetBrief,
    fallbackPrompt: fallback,
    // 300 — between dual's 350 and generic 200. Single cast doesn't need
    // the two-character description budget but DOES need room for the
    // CHARACTER block + face-detectability rules to survive.
    maxTokens: 300,
    postProcess: {
      appendFaceLock: true,
      appendPortraitTags: true,
      dualFaceSwap: false,
      // Reuse the dualPrepend mechanism — it's just "string prepended to
      // Flux prompt by postProcessPrompt"; not dual-specific. Carries our
      // single-cast composition preset to Flux's early-token window.
      dualPrepend: singlePrepend,
    },
    faceSwapSource,
    faceSwapSources: null,
  };
}
