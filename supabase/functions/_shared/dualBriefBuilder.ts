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
import { DUAL_FACE_LOCK_PHRASE, dualPoseRules, classifyFaceContact } from './dualSwapContract.ts';

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

  // ── Classify the user's prompt for TRUE face contact only ──
  // The per-face composite swap handles any layout (hug/piggyback/dance/carry) —
  // only literal face contact (kiss/nuzzle/cheek-to-cheek) IoU-fails the crop.
  // 'ok'      → renders the user's action as-is.
  // 'contact' → softened to a near-touch (heads kept slightly apart) by the shared
  //             contract, NOT suppressed into a side-by-side pose like the old path.
  const faceContact = classifyFaceContact(scene.userPrompt);

  // ── Action pool: relationship-aware dual action (FALLBACK body language) ──
  // Used only when the user didn't specify what the characters are doing.
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
  const genderFront =
    leftG && rightG
      ? `${leftG === 'male' ? 'MAN' : 'WOMAN'} on the LEFT, ${rightG === 'male' ? 'MAN' : 'WOMAN'} on the RIGHT, `
      : '';
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

  const faceLockPhrase = DUAL_FACE_LOCK_PHRASE;

  // ── Shared pose contract ──
  // The per-face composite swap places each cast member on their OWN detected face
  // for ANY layout, so the old fixed-crop L/R / same-height / stationary locks are
  // gone. dualPoseRules() (shared with nightly) encodes the only real constraints
  // (both faces visible, two distinct heads, no face-decor) + full pose freedom.
  // A TRUE face-contact verb (kiss/nuzzle) is SOFTENED to a near-touch (not
  // suppressed), gated by relationship so "hug my mom" stays platonic.
  const sameSexCast = !!(leftG && rightG && leftG === rightG);
  const poseRules = dualPoseRules({
    leftRole: cast[0].role,
    rightRole: cast[1].role,
    sameSex: sameSexCast,
    softenContact:
      faceContact.kind === 'contact'
        ? { verb: faceContact.verb, relationship: plusOneRelationship }
        : undefined,
  });

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
${poseRules}
- Medium shot — both characters roughly waist-up, prominent in the frame. NOT a wide establishing shot (characters must NOT be dwarfed by scenery), but NOT a tight close-up either — keep a clear band of background visible between their two heads.
- Eye-level camera angle. NEVER extreme low angle looking up. Warm atmospheric lighting — NEVER harsh overhead or flat institutional light.
- Characters grounded in the scene — environmental lighting, casting shadows. They exist IN this world.${faceRealismRule}
${dualAction ? `\nFALLBACK BODY LANGUAGE (use ONLY if user prompt doesn't specify what characters are doing — if they did, ignore this and use theirs):\n"${dualAction}"\n` : ''}${
    scene.userPrompt
      ? `
USER INTENT — EXPRESSION & POSE:
If the user prompt specifies a facial EXPRESSION (scared, angry, sad, surprised, joyful, smirking, sultry, etc.), translate it to physical face description (eyes / brows / mouth) early in the prompt. OVERRIDES default "warm / facing camera" cues. If different expressions per character, apply each to the correct LEFT/RIGHT character.

If the user prompt specifies an ACTION (walking, running, dancing, hiking, piggyback, sitting, etc.), render BOTH characters mid-action with documentary candid framing — body mechanics, weight transfer, tracking 3/4 angle, like a film still. They can move freely, interact, and sit at different heights. The ONLY dual constraint: both faces stay clearly visible (3/4 or front toward camera, never pure profile, never from behind) and the two heads stay distinct with a gap between them (never cheek-to-cheek).

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
