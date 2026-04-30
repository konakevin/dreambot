/**
 * Dual face-swap brief builder — isolated code path for two-cast face-swap
 * renders only.
 *
 * Used exclusively when `cast.length === 2 && composition.faceSwapEligible`.
 * Single cast, pure scene, embodied dual, photo restyle — none of those hit
 * this code. Hands-off blast radius: only the "me and my wife on a face-swap
 * eligible medium" scenario.
 *
 * Mirrors the proven nightly-dreams flat dual quality layers:
 *   - Composition prepend (candid/portrait/cinematic/intimate/environmental/editorial)
 *   - Dual action injection (relationship-aware body language)
 *   - Sonnet max_tokens 350 (prevents cast-block truncation)
 *   - Face lock at front of prompt + appended (Flux early+late token bias)
 *   - Strict left/right separation rule
 *   - Three-quarter toward camera, no profiles, no facing each other
 */

import type { CompilerInput, CompilerOutput } from './promptCompiler.ts';
import { pickDualCompositionPath } from './pools/dual_composition.ts';
import { pickDualAction } from './pools/dual_actions.ts';
import { applyVibeGenderModifier } from './promptCompiler.ts';
import { applyFaceSwapOverride } from './faceSwapFluxOverrides.ts';
import { classifyDualAction } from './dualActionDetector.ts';

export function buildDualBrief(input: CompilerInput): CompilerOutput {
  const { medium: rawMedium, vibe, scene, cast, composition, profile } = input;

  if (cast.length !== 2 || !composition.faceSwapEligible) {
    throw new Error('buildDualBrief called with non-dual or non-face-swap input');
  }

  // Apply face-swap-specific flux fragment + directive override for stylized
  // mediums (fairytale/storybook/pencil/anime). Front-loads "realistic human
  // face" language so cdingram's swap doesn't fight cartoon-eye proportions.
  const medium = applyFaceSwapOverride(rawMedium);
  const mediumStyle = medium.key.replace(/_/g, ' ');
  const vibeDirective = applyVibeGenderModifier(vibe.key, vibe.directive, null);

  // ── Classify the user's prompt for L/R-incompatible actions ──
  // 'ok'       → no breaking verb → pool runs as normal, user's action (if any) blends via SACRED block
  // 'breaking' → user wrote a face-contact / center-stacked verb (kissing, piggyback, hugging) →
  //              face swap pipeline crops the frame in half and CANNOT render center contact;
  //              we translate the verb's emotional vibe into a side-by-side composition.
  const userActionClass = classifyDualAction(scene.userPrompt);

  // ── Action pool: relationship-aware dual action ──
  // The pool is what enforces L/R-compatible body geometry (side by side, clear gap).
  // It runs in BOTH cases — 'ok' uses it as the primary action, 'breaking' uses it
  // alongside the reframe block to give Sonnet a concrete L/R pose to anchor on.
  const plusOneRelationship = cast.find((c) => c.role === 'plus_one')
    ? (cast.find((c) => c.role === 'plus_one') as unknown as { relationship?: string }).relationship
    : undefined;
  const dualAction = pickDualAction(plusOneRelationship, undefined);

  // ── Composition path: pick once, prepend at end via postProcess ──
  const dualPath = pickDualCompositionPath();
  const realisticFaceTag = '';
  const dualPrepend = dualPath.prepend.replace('{realisticFaceTag}', realisticFaceTag);

  // ── Cast description block ──
  const cast1 = cast[0];
  const cast2 = cast[1];
  const castDescBlock = `CHARACTER 1 (LEFT side of frame — ${cast1.role}):
${cast1.promptDesc}
${cast1.genderLock ? `GENDER LOCK: ${cast1.genderLock}` : ''}
${cast1.physicalTraits ? `PHYSICAL TRAITS: ${cast1.physicalTraits}` : ''}

CHARACTER 2 (RIGHT side of frame — ${cast2.role}):
${cast2.promptDesc}
${cast2.genderLock ? `GENDER LOCK: ${cast2.genderLock}` : ''}
${cast2.physicalTraits ? `PHYSICAL TRAITS: ${cast2.physicalTraits}` : ''}`;

  const userPrompt = scene.userPrompt
    ? `\n═══ USER PROMPT — SACRED, OVERRIDES EVERYTHING BELOW ═══
"${scene.userPrompt}"
This is what the user asked for. Their LOCATION wins. Their ACTION wins. Their NAMED PEOPLE/PLACES/THINGS win. Build the prompt around these specifics. Do not invent a different scene or contradict them.
`
    : '';
  const sceneExpansion = scene.sceneExpansion ? `\nSCENE DETAILS:\n${scene.sceneExpansion}\n` : '';

  // Realism reinforcement is now in the flux_fragment override itself
  // (faceSwapFluxOverrides.ts) for fairytale/storybook/pencil/anime —
  // applied via applyFaceSwapOverride() above. No separate brief-level
  // rule needed; double-application bloated the brief and pushed timing.
  const faceRealismRule = '';

  const faceLockPhrase =
    'two people, three-quarter view, person on left side, person on right side, clear gap between them';

  // ── Swap-breaking action reframe ──
  // The face swap pipeline crops the frame in half (left 55% / right 55%) and runs
  // swap on each half independently. Center-stacked or touching characters cannot
  // be rendered — there's no clean half for either face.
  //
  // When the user writes a contact verb, translate the EMOTIONAL VIBE of the verb
  // into a strict side-by-side composition. The verb's intent (intimacy, romance,
  // playfulness, support) is preserved through body language, NOT through literal
  // contact or center positioning.
  const swapBreakingReframe =
    userActionClass.kind === 'breaking'
      ? `\n⚠ ACTION REFRAME — the user wrote "${userActionClass.verb}", which implies face contact or center-stacked composition.
The face swap pipeline crops the frame in half and runs swap on each side independently.
Center contact, overlap, piggyback, and full-frontal hugging are physically impossible to render correctly.

TRANSLATE the emotional vibe of "${userActionClass.verb}" into a STRICT SIDE-BY-SIDE composition:
- Character 1 stays in the LEFT half. Character 2 stays in the RIGHT half. Clear gap at the center. NON-NEGOTIABLE.
- Both faces three-quarter view toward CAMERA. NEVER turning toward each other, NEVER in profile, NEVER overlapping.
- Express the verb's intent through SIDE-BY-SIDE body language only:
   • side hug (arms around each other's shoulders FROM THE SIDE, both facing camera)
   • shoulder-to-shoulder leaning, romantic glance held across the gap toward camera
   • one resting a hand on the other's arm/shoulder, both still facing forward
   • playful side-by-side pose with intimate energy in posture and expression
- DO NOT render: kissing, lip contact, full embrace, piggyback, anyone carrying anyone, foreheads touching, faces touching, characters facing each other, or any pose where one body covers part of the other.\n`
      : '';

  const sonnetBrief = `You are a cinematic ${mediumStyle} artist. Write a Flux AI prompt (70-100 words, comma-separated).

STRUCTURE:
1. Start with: "${medium.fluxFragment}"
2. SCENE/ENVIRONMENT (50% of words) — built from the user prompt + scene details
3. SUBJECT FRAMING (must be early in the prompt)
4. CHARACTERS (20% of words)
5. CAMERA + MOOD (20% of words)
6. End with: no text, no words, no letters, no watermarks, ultra detailed
${userPrompt}${sceneExpansion}
MANDATORY — include this EXACT phrase unchanged somewhere in the prompt:
"${faceLockPhrase}"

COMPOSITION RULES:
- Character 1 in LEFT half, Character 2 in RIGHT half. Clear gap between them. No back-of-head views, no full profiles.
- Medium shot — both characters waist-up, filling the frame. NOT a wide establishing shot. Characters must NOT be dwarfed by architecture or scenery.
- Three-quarter view on both faces — both angled slightly toward the VIEWER, like a candid movie still. Eyes and nose visible on both. NOT facing each other. NOT backs to camera. NEVER looking away from camera.
- Characters are STATIONARY — standing, sitting, leaning. NO walking, NO movement through the scene.
- Eye-level camera angle. NEVER extreme low angle looking up. Warm atmospheric lighting — NEVER harsh overhead or flat institutional light.
- Both characters should feel CONNECTED — sharing the same moment, reacting to the same world. Not doing separate isolated activities.
- Characters grounded in the scene — environmental lighting, casting shadows. They exist IN this world.
- Describe BODY POSE and CLOTHING only. NEVER describe eye direction, gaze, or where they are looking.
- DO NOT include any face-bearing decorative objects in the same frame as the two characters: NO statues, busts, mannequins, dolls, masks, helmets with visible faceplates, totems, idols, gargoyles, carved figures, painted portraits, sculpted heads, or cartoon/character imagery on signs/billboards. These compete with the character faces during the face swap step and cause swap failures. If the scene calls for them, describe equivalent decoration that has no face (urns, banners, abstract carvings, geometric patterns, plants, lanterns, etc.).${faceRealismRule}
${swapBreakingReframe}${dualAction ? `\nFALLBACK BODY LANGUAGE (use ONLY if user prompt doesn't specify what characters are doing — if they did, ignore this and use theirs):\n"${dualAction}"\n` : ''}
CHARACTERS IN THE SCENE:
${castDescBlock}

Do NOT over-describe faces. Push detail into clothing, pose, and environment.

MOOD: ${vibeDirective}
${profile?.avoid?.length ? `\nNEVER INCLUDE: ${profile.avoid.join(', ')}\n` : ''}
RULES:
- SCENE FIRST, then the mandatory face phrase, then character details.
- Include "foreground midground background stacked top to bottom, layered depth" in the prompt.
- Every word must be something a camera can see. No feelings, no metaphors.
Output ONLY the prompt.`;

  // Fallback — used if Sonnet fails entirely
  const fallbackParts = [
    medium.fluxFragment,
    scene.userPrompt || 'a surreal dreamscape',
    faceLockPhrase,
    `${cast1.promptDesc.split(',')[0]} and ${cast2.promptDesc.split(',')[0]}`,
    vibe.directive ? vibe.directive.split('.')[0] : '',
    'no text, no words, no letters, no watermarks, hyper detailed',
  ].filter(Boolean);
  const fallback = fallbackParts.join(', ');

  // Face swap sources — verified at entry, both have valid http URLs
  const faceSwapSources =
    cast1.sourcePhotoUrl?.startsWith('http') && cast2.sourcePhotoUrl?.startsWith('http')
      ? [
          { role: cast1.role, sourceUrl: cast1.sourcePhotoUrl },
          { role: cast2.role, sourceUrl: cast2.sourcePhotoUrl },
        ]
      : null;

  return {
    sonnetBrief,
    fallbackPrompt: fallback,
    maxTokens: 350,
    postProcess: {
      appendFaceLock: true,
      appendPortraitTags: true,
      dualFaceSwap: true,
      dualPrepend,
    },
    faceSwapSource: null,
    faceSwapSources,
  };
}
