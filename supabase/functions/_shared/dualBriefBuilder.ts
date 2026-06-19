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
import { buildDualGenderFront } from './dualSideOrder.ts';

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
  // Relationship now correctly preserved through resolveCastForPrompt (2026-05-31).
  // Previously dropped — this read was always undefined, the partner pool gate
  // never fired for the create path, and dual renders always used the companion
  // pool (which the gate fix below NOW correctly distinguishes from partner).
  const plusOneRelationship = cast.find((c) => c.role === 'plus_one')?.relationship;
  const dualAction = pickDualAction(plusOneRelationship, undefined);

  // ── Composition path: pick once, prepend at end via postProcess ──
  const dualPath = pickDualCompositionPath();
  const realisticFaceTag = '';

  // ── Gender front-load (2026-06-09 incident fix) ──
  // Deterministically front-load each side's gender from the STORED cast
  // genderLocks (cast[0]=LEFT, cast[1]=RIGHT). CLIP attends most to the first
  // tokens, but we were relying on Sonnet to place "man/woman" well — and when
  // it buried the gender mid-prompt, flux-1.1-pro rendered TWO same-gender
  // bodies. The downstream gender routing can only correct an L/R FLIP, not a
  // same-gender render, so the female source landed on a male (bearded) body
  // ("wife's face on a bearded man"). Getting the render right here is the only
  // place that can prevent it. Skip only when a gender is genuinely unknown.
  const parseGender = (lock?: string | null): 'male' | 'female' | null =>
    !lock
      ? null
      : lock.startsWith('FEMALE character')
        ? 'female'
        : lock.startsWith('MALE character')
          ? 'male'
          : null;
  const leftG = parseGender(cast[0].genderLock);
  const rightG = parseGender(cast[1].genderLock);
  // cast[0] is whatever the side-flip placed on the LEFT, so this front-load
  // always matches the rendered side. (buildDualGenderFront is unit-tested.)
  const genderFront = buildDualGenderFront(leftG, rightG);
  const dualPrepend =
    genderFront + dualPath.prepend.replace('{realisticFaceTag}', realisticFaceTag);

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

  // Style reference (DLT) — distilled, subject-stripped style descriptors
  // from the source post. Plan C: these come pre-cleaned by styleDistiller
  // (palette, lighting, technique, mood — no subjects). Apply ONLY these
  // descriptors; the SUBJECT comes from the user prompt above.
  const styleReference = scene.styleReference
    ? `\nREFERENCE STYLE (apply ONLY these style descriptors — do NOT introduce any subjects, characters, places, or named entities from the reference):
"${scene.styleReference.slice(0, 400)}"
`
    : '';

  // Realism reinforcement is now in the flux_fragment override itself
  // (faceSwapFluxOverrides.ts) for fairytale/storybook/pencil/anime —
  // applied via applyFaceSwapOverride() above. No separate brief-level
  // rule needed; double-application bloated the brief and pushed timing.
  const faceRealismRule = '';

  const faceLockPhrase =
    'two people, three-quarter view, person on left side, person on right side, a clear band of background visible between their two separated heads';

  // ── Swap-breaking action reframe ──
  // The face swap pipeline crops the frame in half (left 55% / right 55%) and runs
  // swap on each half independently. Center-stacked or touching characters cannot
  // be rendered — there's no clean half for either face.
  //
  // When the user writes a contact verb, translate the EMOTIONAL VIBE of the verb
  // into a strict side-by-side composition. The verb's intent is preserved through
  // body language, NOT through literal contact or center positioning.
  //
  // RELATIONSHIP GATE: the translation language is split. Partners get
  // romantic-coded body language ("romantic glance", "intimate energy"). Everyone
  // else (friend / parent / sibling / coworker / etc.) gets PLATONIC translation
  // — casual side-by-side with friendly warmth, no romantic body language, no
  // intimate gaze. Without this gate a user typing "hugging my mom" would still
  // land a romantic-coded side-hug pose because the reframe template's bullets
  // were universally romantic. Mirrors the gate in pickDualAction() above.
  const isPartner =
    plusOneRelationship === 'partner' || plusOneRelationship === 'significant_other';
  const reframeBullets = isPartner
    ? `   • side hug (arms around each other's shoulders FROM THE SIDE, both facing camera)
   • standing close shoulder-to-shoulder but UPRIGHT with heads apart, romantic glance held across the gap toward camera
   • one resting a hand on the other's arm/shoulder, both still facing forward
   • playful side-by-side pose with intimate energy in posture and expression`
    : `   • standing close side-by-side, both facing camera with relaxed friendly body language
   • standing close shoulder-to-shoulder but UPRIGHT with heads apart, both looking toward camera with warm friendly energy (NOT romantic)
   • one with a brief casual hand on the other's shoulder (platonic only — quick contact, not an embrace)
   • side-by-side pose with PLATONIC warmth — friendly grins toward camera, no romantic gaze, no lingering contact`;
  const relationshipNote = isPartner
    ? ''
    : `\n*** RELATIONSHIP GATE — the plus-one relationship is "${plusOneRelationship ?? 'unspecified'}", which is NOT partner / significant_other. NO romantic body language allowed. NO holding hands, NO passionate gaze, NO intimate embrace, NO holding each other, NO leaning heads together. Even though the user typed "${userActionClass.kind === 'breaking' ? userActionClass.verb : ''}", translate it ONLY into platonic friendly side-by-side body language. ***\n`;
  const swapBreakingReframe =
    userActionClass.kind === 'breaking'
      ? `\n⚠ ACTION REFRAME — the user wrote "${userActionClass.verb}", which implies face contact or center-stacked composition.
The face swap pipeline crops the frame in half and runs swap on each side independently.
Center contact, overlap, piggyback, and full-frontal hugging are physically impossible to render correctly.
${relationshipNote}
TRANSLATE the emotional vibe of "${userActionClass.verb}" into a STRICT SIDE-BY-SIDE composition:
- Character 1 stays in the LEFT half. Character 2 stays in the RIGHT half. Clear gap at the center. NON-NEGOTIABLE.
- Both faces three-quarter view toward CAMERA. NEVER turning toward each other, NEVER in profile, NEVER overlapping.
- Express the verb's intent through SIDE-BY-SIDE body language only:
${reframeBullets}
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
${userPrompt}${sceneExpansion}${styleReference}
MANDATORY — include this EXACT phrase unchanged somewhere in the prompt:
"${faceLockPhrase}"

COMPOSITION RULES:
- Character 1 in LEFT half, Character 2 in RIGHT half. Clear gap between them. No back-of-head views, no full profiles.
- Medium shot — both characters waist-up. NOT a wide establishing shot (characters must NOT be dwarfed by scenery), but also NOT a tight close-up: do NOT render the faces large or filling the frame. A clear band of background must stay visible BETWEEN THEIR TWO HEADS — both heads upright and fully separated, never touching, overlapping, or cheek-to-cheek. The face swap crops the frame at the vertical midline; if the two heads meet there it cannot work. If the medium has soft or bleeding edges (watercolor, ink, pastel), widen that head gap so the two faces never blur together.
- Three-quarter view on both faces — both angled slightly toward the VIEWER, like a candid movie still. Eyes and nose visible on both. NOT facing each other. NOT backs to camera. NEVER looking away from camera.
- Characters default to STATIONARY (standing or sitting, both upright with heads apart) UNLESS the user prompt specifies an action verb — see ACTION/POSE RULE below for the override.
- Eye-level camera angle. NEVER extreme low angle looking up. Warm atmospheric lighting — NEVER harsh overhead or flat institutional light.
- Both characters should feel CONNECTED — sharing the same moment, reacting to the same world. Not doing separate isolated activities.
- Characters grounded in the scene — environmental lighting, casting shadows. They exist IN this world.
- Describe BODY POSE and CLOTHING only. NEVER describe eye direction, gaze, or where they are looking.
- DO NOT include any face-bearing decorative objects in the same frame as the two characters: NO statues, busts, mannequins, dolls, masks, helmets with visible faceplates, totems, idols, gargoyles, carved figures, painted portraits, sculpted heads, or cartoon/character imagery on signs/billboards. These compete with the character faces during the face swap step and cause swap failures. If the scene calls for them, describe equivalent decoration that has no face (urns, banners, abstract carvings, geometric patterns, plants, lanterns, etc.).${faceRealismRule}
${swapBreakingReframe}${dualAction ? `\nFALLBACK BODY LANGUAGE (use ONLY if user prompt doesn't specify what characters are doing — if they did, ignore this and use theirs):\n"${dualAction}"\n` : ''}${
    scene.userPrompt
      ? `
USER INTENT — EXPRESSION & POSE:
If the user prompt specifies a facial EXPRESSION (scared, angry, sad, surprised, joyful, smirking, sultry, etc.), translate it to physical face description (eyes / brows / mouth) early in the prompt. OVERRIDES default "warm / facing camera" cues. If different expressions per character, apply each to the correct LEFT/RIGHT character.

If the user prompt specifies an ACTION (walking, running, dancing, hiking, kissing, sitting, etc.), render BOTH characters mid-action with documentary candid framing — body mechanics, weight transfer, tracking 3/4 angle, like a film still. OVERRIDES the default "stationary, three-quarter view facing camera" cue. NON-NEGOTIABLE dual constraint: both still in their L/R halves, both faces still partially visible (3/4 toward camera, never pure profile, never from behind), both in synchronized parallel motion (NOT one ahead of the other).

If the user prompt specifies a HAND GESTURE (shaka, peace sign, thumbs up, middle finger / the bird, rock on, ok sign, fist, point, wave, salute, etc.), spell out FINGER GEOMETRY explicitly — Flux defaults "shaka" to a wave unless you describe which fingers are extended and which are curled. Example: shaka = "thumb and pinky extended outward, three middle fingers curled into palm." Middle finger is allowed. If different gestures per character, apply each to the correct LEFT/RIGHT character.
`
      : ''
  }
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
          { role: cast1.role, sourceUrl: cast1.sourcePhotoUrl, genderLock: cast1.genderLock },
          { role: cast2.role, sourceUrl: cast2.sourcePhotoUrl, genderLock: cast2.genderLock },
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
