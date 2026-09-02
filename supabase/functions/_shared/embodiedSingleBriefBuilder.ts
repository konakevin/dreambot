/**
 * Embodied single-cast brief builder — the "dream art" counterpart of
 * singleBriefBuilder.ts, for one-cast renders on EMBODIED mediums (fairytale,
 * animation, claymation, lego, pixels…) where the person is DRAWN in the
 * medium's style instead of face-swapped.
 *
 * Why this exists (2026-09-02, prompt-fidelity investigation): a user asked to
 * be drawn "snuggling my bichon and shih tzu on the couch watching tv".
 * Face-swap mediums honored it; dream-art mediums dropped the dogs (fairytale
 * even invented a "prince charming"). Root cause: single face-swap renders go
 * through buildSingleBrief — whose FIRST section declares the user prompt
 * SACRED and budgets 40% of the words to the scene built from it — while
 * embodied singles fell through to the older generic compiler, which leads
 * with "transform this person into X style" + a one-dominant-subject rule that
 * treats the user's named companions as droppable competition. A controlled
 * test (book / bird / cat) confirmed it: face-swap kept all three, the generic
 * embodied path dropped bird and cat.
 *
 * This builder ports the proven sacred-user-prompt structure to embodied
 * renders, adapted for drawn characters:
 *   - KEEPS: sacred user prompt (every named animal/object MUST appear),
 *     40% scene budget, character-prominent framing, action/expression/
 *     hairstyle intent rules, mood + avoid handling.
 *   - DROPS (swap-only): applyFaceSwapOverride, the exactly-one-face rule
 *     phrased for detector safety, the no-face-bearing-objects ban, the
 *     "don't over-describe the face" instruction (embodied likeness comes
 *     FROM the description), faceSwapSource.
 *   - ADDS: transform-everything style rule (scene + character + companions
 *     all in the medium's aesthetic), a no-invented-people rule (kills the
 *     prince), and an in-the-scene rule so "watching tv" renders the person
 *     in the room — never displayed ON the screen.
 *
 * One rule everywhere: the user's words win. (Same contract as face-swap.)
 */

import type { CompilerInput, CompilerOutput } from './promptCompiler.ts';
import { applyVibeGenderModifier } from './promptCompiler.ts';

export function buildEmbodiedSingleBrief(input: CompilerInput): CompilerOutput {
  const { medium, vibe, scene, cast, profile } = input;

  if (cast.length !== 1 || medium.characterRenderMode !== 'embodied') {
    throw new Error('buildEmbodiedSingleBrief called with non-single or non-embodied input');
  }

  const mediumStyle = medium.key.replace(/_/g, ' ');
  const c = cast[0];
  const castGender: 'male' | 'female' | null =
    c.genderLock?.toUpperCase().includes('MALE') && !c.genderLock.toUpperCase().startsWith('FEMALE')
      ? 'male'
      : c.genderLock
        ? 'female'
        : null;
  const vibeDirective = applyVibeGenderModifier(vibe.key, vibe.directive, castGender);

  // Dedicated CHARACTER section so the likeness traits + gender lock survive
  // Sonnet's compression budget (same shape as single/dual builders). For
  // embodied there is NO swap to rescue the face — this block IS the likeness.
  const castDescBlock = `CHARACTER (${c.role}):
${c.promptDesc}
${c.genderLock ? `GENDER LOCK: ${c.genderLock}` : ''}
${c.physicalTraits ? `PHYSICAL TRAITS: ${c.physicalTraits}` : ''}`;

  const userPrompt = scene.userPrompt
    ? `\n═══ USER PROMPT — SACRED, OVERRIDES EVERYTHING BELOW ═══
"${scene.userPrompt}"
This is what the user asked for. Their LOCATION wins. Their ACTION wins. Their APPEARANCE and HAIRSTYLE requests win. Their NAMED animals, pets, people, and objects win — EVERY ONE of them MUST appear in the image, in the same art style, clearly visible right beside or with the character. A named pet is a living animal IN the scene with them (never a picture, toy, or pattern of it). Never drop, shrink, replace, or demote any named element. Do not invent a different scene or contradict them.
`
    : '';
  const sceneExpansion = scene.sceneExpansion ? `\nSCENE DETAILS:\n${scene.sceneExpansion}\n` : '';

  const styleReference = scene.styleReference
    ? `\nREFERENCE STYLE (apply ONLY these style descriptors — do NOT introduce any subjects, characters, places, or named entities from the reference):
"${scene.styleReference.slice(0, 400)}"
`
    : '';

  const sonnetBrief = `You are a ${mediumStyle} artist. Write a Flux AI prompt (70-100 words, comma-separated).

STRUCTURE:
1. Start with: "${medium.fluxFragment}"
2. THE USER'S SCENE (40% of words) — the place, the action, and EVERY person, animal, pet, and object the user named
3. CHARACTER (~30% of words) — the person's likeness rendered in this art style
4. MOOD + finishing (~20% of words)
5. End with: no text, no words, no letters, no watermarks, ultra detailed
${userPrompt}${sceneExpansion}${styleReference}
COMPOSITION RULES (NON-NEGOTIABLE):
- The character is the clear main subject — face visible and turned toward the viewer, medium or three-quarter framing, never a tiny figure lost in a wide scene.
- Everything the user named appears WITH the character in one shot — pets snuggled beside or on them, objects in their hands or within reach — nothing named is ever left out.
- Do NOT add any person the user did not mention — no companion, partner, prince, friend, waiter, or background figure. Named ANIMALS are required; extra HUMANS are forbidden.
- The person is physically IN the scene doing the action. NEVER render them as an image ON a screen, television, poster, painting, or reflection — a TV in the scene shows ordinary glowing content, not the character.
- TRANSFORM EVERYTHING into ${mediumStyle} style — the environment, the character, and every named animal and object all share the same art style, cohesive and fully stylized. Nothing photorealistic.
- MATERIALIZE the medium on every noun: weave the medium's signature material/technique words directly into the character and each named element (a sculpted clay dog, a LEGO-brick couch, a knitted felt bird, a hand-drawn cel-shaded cat, a pixel-art guitar) so every single thing reads unmistakably in-medium at a glance.
${
  scene.userPrompt
    ? `
USER INTENT — EXPRESSION & POSE:
If the user prompt specifies a facial EXPRESSION (scared, joyful, smirking, etc.), translate it to physical face description (eyes / brows / mouth) early in the prompt.

If the user prompt specifies an ACTION (snuggling, reading, dancing, hiking, sitting, etc.), render the character mid-action naturally — body engaged with the action and with every named companion/object. Face still visible (3/4 toward viewer, never from behind), character still prominent.

If the user prompt specifies a HAIRSTYLE or HAIR detail (bangs, ponytail, braids, bun, a hair color, etc.), that request OVERRIDES the CHARACTER description's hair on any conflict — write the requested hair explicitly and early, and do not also state the conflicting default hair.
`
    : ''
}
CHARACTER IN THE SCENE:
${castDescBlock}

Keep the character's defining traits (hair color and length, facial hair, age, build) clearly recognizable in the stylized rendering — a viewer should see it's the same person.

MOOD: ${vibeDirective}
${profile?.avoid?.length ? `\nNEVER INCLUDE: ${profile.avoid.join(', ')}\n` : ''}
RULES:
- The user's scene and named elements come right after the style fragment, before deep character detail.
- Include "foreground midground background stacked top to bottom, layered depth" in the prompt.
- Every word must be something a camera can see. No feelings, no metaphors.
Output ONLY the prompt.`;

  // Fallback — user prompt rides directly beside the fragment so even the
  // safety net honors the request.
  const fallbackParts = [
    medium.fluxFragment,
    scene.userPrompt || 'a stunning scene that showcases this medium',
    c.promptDesc.split(',')[0],
    'the character together with everything they asked for, all clearly visible',
    vibe.directive ? vibe.directive.split('.')[0] : '',
    'no text, no words, no letters, no watermarks, ultra detailed',
  ].filter(Boolean);
  const fallback = fallbackParts.join(', ');

  return {
    sonnetBrief,
    fallbackPrompt: fallback,
    // 300 — matches singleBriefBuilder: room for the sacred block + character
    // likeness to survive without truncation (generic 200 was too tight).
    maxTokens: 300,
    postProcess: {
      appendFaceLock: false, // no swap pipeline downstream
      appendPortraitTags: true,
      dualFaceSwap: false,
    },
    faceSwapSource: null,
    faceSwapSources: null,
  };
}
