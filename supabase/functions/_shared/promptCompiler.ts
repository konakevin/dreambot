/**
 * Prompt Compiler — unified brief builder for all V2 dream generation paths.
 *
 * All V2 paths (self-insert, text directive, photo reimagine, style transfer)
 * feed structured input into this single compilePrompt() function. It outputs
 * a Sonnet brief that gets compressed into a 70-90 word Flux prompt.
 *
 * The brief has priority-labeled sections so Sonnet knows what to protect
 * under compression pressure: SCENE (sacred) → OBJECT → CHARACTER → CAMERA → STYLE → MOOD.
 */

import type { ResolvedCastMember } from './castResolver.ts';
import { buildDualBrief } from './dualBriefBuilder.ts';

// ── Public Types ──

export type CompositionMode =
  | 'balanced'
  | 'open_vista'
  | 'layered_depth'
  | 'negative_space'
  | 'low_angle_hero'
  | 'overhead'
  | 'intimate_close';

export interface CompilerInput {
  inputType: 'self_insert' | 'text_directive' | 'photo_reimagine' | 'style_transfer';

  medium: {
    key: string;
    directive: string;
    fluxFragment: string;
    characterRenderMode: 'natural' | 'embodied';
    faceSwaps: boolean;
  };

  vibe: {
    key: string;
    directive: string;
  };

  scene: {
    userPrompt?: string;
    sceneExpansion?: string;
    styleReference?: string;
    photoDescription?: string;
    objectDirective?: string;
    dreamWish?: string;
  };

  cast: ResolvedCastMember[];

  composition: {
    type: 'character' | 'pure_scene';
    faceSwapEligible: boolean;
    shotDirection: string;
    focalAnchor: string;
  };

  profile?: {
    avoid?: string[];
  };
}

export interface CompilerOutput {
  sonnetBrief: string;
  fallbackPrompt: string;
  maxTokens: number;
  postProcess: {
    appendFaceLock: boolean;
    appendPortraitTags: boolean;
    dualFaceSwap: boolean;
    /**
     * DLT replica mode — skip the forced "foreground midground background stacked
     * top to bottom" depth append, which would re-impose a wide multi-tier scene
     * on a close/macro/single-object format reference.
     */
    skipDepthTags?: boolean;
    /**
     * Prepend string applied at the very front of the Flux prompt by
     * postProcessPrompt. Currently populated only by the dual brief builder
     * for two-cast face-swap renders (composition path: candid/portrait/etc.)
     * — front-loaded so Flux's early-token bias picks it up.
     */
    dualPrepend?: string;
  };
  faceSwapSource: string | null;
  faceSwapSources: Array<{ role: string; sourceUrl: string }> | null;
}

// ── Focal Anchor Derivation ──

export function deriveFocalAnchor(
  cast: ResolvedCastMember[],
  scene: CompilerInput['scene']
): string {
  if (cast.length === 1) return 'the main character';
  if (cast.length > 1) return 'the interaction between the characters';
  if (scene.objectDirective) return 'the scene object';
  // When the user typed a prompt, PIN it as the literal focal subject so the
  // brief protects it under compression. Previously this returned a generic
  // string ("a single dominant visual subject...") which let Sonnet pick the
  // injected environment as the subject and drop the user's actual subject
  // (e.g. "a cat on a roof holding a piña colada" → a generic village, no cat).
  if (scene.userPrompt && scene.userPrompt.trim()) {
    return `EXACTLY what the user described — "${scene.userPrompt.trim()}" — rendered literally and prominently as the unmistakable main subject`;
  }
  return 'a single dominant visual subject that defines the scene';
}

// ── Medium Directive Summarizer ──
// Full 150-word directives overwhelm the brief. Extract first 3 sentences.

function summarizeMediumDirective(directive: string): string {
  const sentences = directive
    .split(/[.!]\s+/)
    .filter(Boolean)
    .slice(0, 3);
  return sentences.join('. ') + '.';
}

// ── Word Budget ──

function getWordBudget(
  compositionType: string,
  faceSwap: boolean
): { character: number; environment: number; finishing: number } {
  if (compositionType === 'character') {
    return faceSwap
      ? { character: 20, environment: 45, finishing: 15 }
      : { character: 20, environment: 45, finishing: 15 };
  }
  // Pure scene: previously reserved 0 words for the subject and 60 for
  // environment, which let the injected atmosphere crowd out a specific subject
  // (the "cat on a roof → empty village" failure). Reserve real subject budget.
  return { character: 25, environment: 35, finishing: 15 };
}

// ── Section Builders ──

function buildSceneBlock(scene: CompilerInput['scene']): string {
  const parts: string[] = [];

  if (scene.userPrompt) {
    parts.push(
      `THE SUBJECT — render this LITERALLY and prominently; it is the entire point of the image, never omit it, never swap it for something else, never demote it to a background detail: ${scene.userPrompt}`
    );
  }
  if (scene.sceneExpansion) {
    parts.push(
      `SUPPORTING ATMOSPHERE (background mood + light only — apply LIGHTLY and ONLY where it frames the subject above; do NOT let it replace, relocate, or compete with the subject, and DISCARD any of it that conflicts with the subject or its stated setting): ${scene.sceneExpansion}`
    );
  }
  // NOTE: scene.styleReference (DLT) is NOT pushed here anymore. It used to be
  // demoted to "apply ONLY palette/lighting/technique/texture" — which dropped
  // the source's FORMAT / SCALE / FRAMING (the thing that actually makes a look
  // recognizable). It's now handled by the top-priority RENDER FORMAT section in
  // compilePrompt(), which reproduces the format and recasts the subject INTO it.
  if (scene.photoDescription) {
    parts.push(`PHOTO SUBJECT: ${scene.photoDescription}`);
  }
  if (scene.dreamWish) {
    parts.push(`DREAM WISH (make this the heart): "${scene.dreamWish}"`);
  }
  if (!scene.userPrompt && !scene.styleReference) {
    parts.push(
      'Invent a stunning subject and scene that showcases this medium beautifully. Pick something concrete — a character, creature, landscape, or architectural marvel.'
    );
  }

  return parts.join('\n\n');
}

function buildCharacterBlock(
  cast: ResolvedCastMember[],
  medium: CompilerInput['medium'],
  composition: CompilerInput['composition']
): string {
  const mediumStyle = medium.key.replace(/_/g, ' ');
  const isEmbodied = medium.characterRenderMode === 'embodied';
  const parts: string[] = [];

  let genderLockHandled = false;

  if (cast.length === 1) {
    const c = cast[0];
    if (isEmbodied) {
      parts.push(
        `THE CHARACTER — transform this person into ${mediumStyle} style (use the medium's aesthetic, NOT photorealistic):`
      );
      parts.push(c.promptDesc);
    } else {
      parts.push('THE MAIN CHARACTER:');
      parts.push(c.promptDesc);
      if (c.physicalTraits) {
        parts.push(
          `CRITICAL — character MUST have: ${c.physicalTraits}. Do NOT change hair, facial hair, skin tone, or build.`
        );
      }
      if (composition.faceSwapEligible) {
        parts.push('Do NOT over-describe the face. Push detail into clothing, pose, environment.');
      }
    }
  } else if (cast.length === 2 && composition.faceSwapEligible) {
    parts.push(`CHARACTER 1 (left of frame — ${cast[0].role}): ${cast[0].promptDesc}`);
    if (cast[0].physicalTraits) {
      parts.push(
        `CRITICAL — CHARACTER 1 MUST have: ${cast[0].physicalTraits}. Do NOT change hair, facial hair, skin tone, or build.`
      );
    }
    parts.push(`CHARACTER 2 (right of frame — ${cast[1].role}): ${cast[1].promptDesc}`);
    if (cast[1].physicalTraits) {
      parts.push(
        `CRITICAL — CHARACTER 2 MUST have: ${cast[1].physicalTraits}. Do NOT change hair, facial hair, skin tone, or build.`
      );
    }
    parts.push(
      'POSITIONING:\n- Character 1 in LEFT half of frame, Character 2 in RIGHT half.\n- BOTH FACES MUST BE VISIBLE — three-quarter FRONT angle toward the viewer. Eyes and nose on BOTH characters clearly visible.\n- No turned-away faces. No back of heads. No full side profiles. No faces hidden in shadow.'
    );
    parts.push('Do NOT over-describe faces. Push detail into clothing, pose, environment.');
    const genderParts: string[] = [];
    for (const c of cast) {
      if (c.genderLock) {
        genderParts.push(`${c.role.toUpperCase()}: ${c.genderLock}`);
      }
    }
    if (genderParts.length > 0) {
      parts.push(`\nGENDER — NON-NEGOTIABLE:\n${genderParts.join('\n')}`);
    }
    genderLockHandled = true;
  } else {
    cast.forEach((c, i) => {
      parts.push(`CHARACTER ${i + 1} (${c.role}): ${c.promptDesc}`);
      if (c.physicalTraits) {
        parts.push(
          `CRITICAL — CHARACTER ${i + 1} MUST have: ${c.physicalTraits}. Do NOT change hair, facial hair, skin tone, or build.`
        );
      }
    });
    parts.push(`Render ALL ${cast.length} characters as ${mediumStyle} style. Show them TOGETHER.`);
  }

  // Gender lock (skipped when dual face swap handles it inline)
  if (!genderLockHandled) {
    const genderCast = cast.find((c) => c.genderLock);
    if (genderCast && genderCast.genderLock) {
      parts.push(`\nGENDER — NON-NEGOTIABLE: ${genderCast.genderLock}`);
    }
  }

  return parts.join('\n');
}

function buildCameraBlock(
  composition: CompilerInput['composition'],
  castCount: number,
  isReplica = false
): string {
  const parts: string[] = [];
  parts.push(composition.shotDirection);

  if (composition.faceSwapEligible) {
    if (castCount === 2) {
      parts.push(
        'BOTH FACES MUST BE VISIBLE — three-quarter FRONT angle toward the viewer, eyes and nose visible on both. No turned-away faces, no back of heads, no full side profiles. Medium-wide shot showing both figures within the environment.'
      );
    } else {
      parts.push(
        'Face at least three-quarter view toward camera — eyes, nose, and mouth all visible. No full profiles, no back views, no silhouettes, no faces in shadow.'
      );
    }
    parts.push(
      'Character faces must have realistic human proportions — normal sized eyes, natural face shape. Real photo faces will be composited on, so rendered faces must be proportionally compatible.'
    );
  }

  if (isReplica) {
    // DLT: the RENDER FORMAT section owns framing/scale/composition. Do NOT
    // force a wide environmental scene onto a close/macro/single-object format.
    parts.push(
      'Portrait 9:16 vertical. Framing, scale, and composition MUST match the RENDER FORMAT above — if the reference reads as a close/macro/product/portrait/single-object format, do NOT impose a wide environmental scene or top-to-bottom stacked depth.'
    );
  } else {
    parts.push(
      'Portrait 9:16 vertical — wide environmental framing, show the full scene. Subject in context, NOT a tight headshot. Depth stacked top to bottom.'
    );
  }
  return parts.join('\n');
}

// ── Gender-Aware Vibe Modifier ──

/**
 * Post-processes a vibe directive with gender-specific instructions.
 * No-op for all vibes except coquette. Safe to call unconditionally.
 */
export function applyVibeGenderModifier(
  vibeKey: string,
  directive: string,
  castGender: 'male' | 'female' | null
): string {
  if (vibeKey !== 'coquette') return directive;

  if (castGender === 'male') {
    return (
      directive +
      '\n\nGENDER NOTE: Subject is MALE — keep him masculine but make him BEAUTIFUL. Flawless skin with warm golden glow, perfectly tousled hair catching the light, sharp jawline softened by dreamy lighting. Styling feels expensive and effortless — soft luxurious fabrics, delicate accessories, pretty-boy energy. No dress, no makeup, no feminization. The scene around him is equally coquette: soft pink and champagne color grading, warm golden-hour light, rose-tinted atmosphere, dreamy bokeh, everything looks expensive and romantic.'
    );
  }

  // Female or no cast — full coquette, no restraint
  return (
    directive +
    "\n\nGENDER NOTE: Make HER the coquette centerpiece. Dewy glowing skin, flowing glossy hair with soft ribbons and bows, delicate feminine accessories catching the light, soft luxurious fabrics in blush and cream, lips soft and perfect, eyes sparkling. She looks like every girl's dream Pinterest board come to life. The scene matches her energy: drenched in soft pink and champagne tones, warm honey light, dreamy romantic glow, iridescent shimmer. Pretty dial to 11."
  );
}

// ── Main Export ──

export function compilePrompt(input: CompilerInput): CompilerOutput {
  const { medium, vibe, scene, cast, composition, profile } = input;

  // ── ISOLATED DUAL FACE-SWAP PATH ──
  // When exactly 2 cast members are present and the medium is face-swap
  // eligible, delegate entirely to buildDualBrief. All other scenarios
  // (single cast, pure scene, embodied dual, photo restyle) fall through
  // to the existing compiler logic below — byte-identical to before.
  if (cast.length === 2 && composition.faceSwapEligible) {
    return buildDualBrief(input);
  }

  const mediumStyle = medium.key.replace(/_/g, ' ');
  const hasCast = cast.length > 0 && composition.type !== 'pure_scene';

  // Extract cast gender for vibe modifiers (coquette gender routing)
  const castGender: 'male' | 'female' | null =
    cast.length > 0 && cast[0].genderLock
      ? cast[0].genderLock.toUpperCase().includes('MALE') &&
        !cast[0].genderLock.toUpperCase().startsWith('FEMALE')
        ? 'male'
        : 'female'
      : null;
  const vibeDirective = applyVibeGenderModifier(vibe.key, vibe.directive, castGender);

  // DLT "style replica" mode — styleReference is only ever set on a Dream Like
  // This render (the source post's distilled style_summary). In this mode the
  // source render's FORMAT is the identity and must dominate composition.
  const isReplica = !!scene.styleReference;

  const budget = getWordBudget(composition.type, composition.faceSwapEligible);
  const sceneBlock = buildSceneBlock(scene);
  const characterBlock = hasCast ? buildCharacterBlock(cast, medium, composition) : '';
  const cameraBlock = buildCameraBlock(composition, cast.length, isReplica);
  const mediumSummary = summarizeMediumDirective(medium.directive);

  // Top-priority FORMAT section for DLT. Reproduces the source render's format /
  // medium / scale / framing and recasts the user's subject INTO it — instead of
  // the old behavior that demoted the reference to surface texture on a fresh
  // wide scene (which lost miniatures / LEGO / claymation / pixel formats).
  const renderFormatBlock = isReplica
    ? `═══ RENDER FORMAT (HIGHEST PRIORITY — defines what KIND of image this is) ═══
This dream must look like it came out of the SAME render as a reference the user loved. Reproduce its FORMAT, MEDIUM, SCALE, FRAMING, lighting, palette, and texture EXACTLY:
"${scene.styleReference!.slice(0, 400)}"
Recast the user's subject INTO this exact format and scale. If the reference reads as a macro photo of a small physical object, a product / figurine shot, a painting, a sculpture, a pixel sprite, a claymation still, a diorama, etc. — the OUTPUT must read as THAT kind of image, NOT as a realistic wide cinematic scene. This format OVERRIDES any "wide environmental framing / full scene / stacked depth" instruction below wherever they conflict. Use ONLY the look — do NOT borrow subjects, characters, places, body parts, or named objects from the reference.

`
    : '';

  // Engine-specific output format instructions
  // Anime uses danbooru tag format — Flux handles tags well via T5 encoder
  const useTagFormat = medium.key === 'anime';
  const formatHeader = useTagFormat
    ? `You are an anime character designer. Write danbooru-style tags for an anime image.

OUTPUT FORMAT: comma-separated danbooru tags, NOT natural language sentences.
Include a framing tag (randomly pick ONE: full_body, upper_body, cowboy_shot, or wide_shot).
Start with: ${medium.fluxFragment}
End with: masterpiece, best quality, detailed background, no text, no watermark, single image, no collage, no split screen
Do NOT write sentences or descriptions. ONLY tags.`
    : `You are a cinematic ${mediumStyle} artist. Write a Flux AI prompt (70-90 words, comma-separated).

WORD BUDGET:
- Character/subject: ~${budget.character} words
- Environment/scene: ~${budget.environment} words
- Camera + mood + finishing: ~${budget.finishing} words

OUTPUT STRUCTURE:
1. Start with: "${medium.fluxFragment}"
2. Environment/scene
3. Subject/character
4. Camera + mood
5. Your invented details
6. End with: no text, no words, no letters, no watermarks, ultra detailed`;

  const brief = `${formatHeader}

${renderFormatBlock}═══ SCENE (SACRED — must appear) ═══
${sceneBlock}

═══ FOCAL ANCHOR (MANDATORY) ═══
There must be exactly ONE dominant visual subject: ${composition.focalAnchor}
- This is the first thing the eye sees.
- Everything else supports or frames it.
- Do NOT introduce competing subjects of equal importance.
- If multiple interesting elements exist, subordinate all but one to background role.

${scene.objectDirective ? `═══ SCENE OBJECT (MUST APPEAR) ═══\n${scene.objectDirective}\n\n` : ''}${characterBlock ? `═══ CHARACTER ═══\n${characterBlock}\n\n` : ''}${hasCast && scene.userPrompt ? `═══ USER INTENT — EXPRESSION & POSE ═══\nIf the user prompt specifies a facial EXPRESSION (scared, angry, sad, surprised, joyful, smirking, sultry, etc.), translate it to physical face description (eyes / brows / mouth) early in the prompt. This OVERRIDES the default "warm / facing camera" cues.\n\nIf the user prompt specifies an ACTION (walking, running, dancing, hiking, jumping, sitting, reading, fighting, etc.), render the character MID-ACTION with documentary candid framing — NOT a posed studio shot. Body mechanics, weight transfer, motion blur where appropriate, captured from a tracking 3/4 angle. This OVERRIDES the default "standing, medium shot facing camera" framing. Face must remain partially visible (3/4 toward camera, eyes visible) — no full back views.\n\nIf the user prompt specifies a HAND GESTURE (shaka, peace sign, thumbs up, middle finger / flipping off / the bird, rock on, ok sign, fist, point, wave, salute, prayer hands, fingers crossed, etc.), spell out the FINGER GEOMETRY explicitly in the prompt — Flux defaults "shaka" to a wave unless you describe which fingers are extended and which are curled. Example: shaka = "thumb and pinky extended outward, three middle fingers curled into palm." Middle finger / the bird is allowed. OVERRIDES default "hands at sides" framing.\n\nIf the user specified none of expression/action/hand-gesture, default to a natural pose appropriate to the scene's mood.\n\n` : ''}═══ CAMERA ═══
${cameraBlock}

═══ STYLE${medium.characterRenderMode === 'embodied' ? ' (TRANSFORM EVERYTHING — the scene, environment, and characters ALL become this style. A forest becomes a stylized forest. A city becomes a stylized city. Nothing stays photorealistic.)' : ''} ═══
${mediumSummary}

═══ MOOD ═══
${vibeDirective}

═══ YOUR CREATIVE ADDITIONS ═══
Add vivid concrete details the user didn't mention. Things a camera can see — textures, light sources, atmospheric elements, foreground/background depth.

${profile && profile.avoid && profile.avoid.length > 0 ? `═══ NEVER INCLUDE ═══\n${profile.avoid.join(', ')}\n\n` : ''}RULES:
- Every word must be something a camera can see. No feelings, no metaphors.
- ${
    isReplica
      ? 'Composition and depth must match the RENDER FORMAT above — do NOT impose a wide multi-tier scene on a close / macro / single-object reference.'
      : 'Depth: foreground, midground, background stacked top to bottom.'
  }
Output ONLY the prompt.`;

  // Fallback
  const fallbackParts = [medium.fluxFragment];
  if (scene.userPrompt) fallbackParts.push(scene.userPrompt);
  else fallbackParts.push('a surreal dreamscape');
  if (vibe.directive) fallbackParts.push(vibe.directive.split('.')[0]);
  fallbackParts.push('no text, no words, no letters, no watermarks, hyper detailed');
  const fallback = fallbackParts.join(', ');

  // Face swap source (single)
  let faceSwapSource: string | null = null;
  if (
    composition.faceSwapEligible &&
    cast.length === 1 &&
    cast[0].sourcePhotoUrl &&
    cast[0].sourcePhotoUrl.startsWith('http')
  ) {
    faceSwapSource = cast[0].sourcePhotoUrl;
  }

  // Face swap sources (dual — two cast members)
  let faceSwapSources: Array<{ role: string; sourceUrl: string }> | null = null;
  if (
    composition.faceSwapEligible &&
    cast.length === 2 &&
    cast[0].sourcePhotoUrl &&
    cast[0].sourcePhotoUrl.startsWith('http') &&
    cast[1].sourcePhotoUrl &&
    cast[1].sourcePhotoUrl.startsWith('http')
  ) {
    faceSwapSources = [
      { role: cast[0].role, sourceUrl: cast[0].sourcePhotoUrl },
      { role: cast[1].role, sourceUrl: cast[1].sourcePhotoUrl },
    ];
  }

  const isDualFaceSwap = faceSwapSources !== null && faceSwapSources.length === 2;

  return {
    sonnetBrief: brief,
    fallbackPrompt: fallback,
    maxTokens: 200,
    postProcess: {
      appendFaceLock: composition.faceSwapEligible,
      appendPortraitTags: true,
      dualFaceSwap: isDualFaceSwap,
      skipDepthTags: isReplica,
    },
    faceSwapSource,
    faceSwapSources,
  };
}

// ── Post-Processing (applied after Sonnet returns) ──

export function postProcessPrompt(prompt: string, rules: CompilerOutput['postProcess']): string {
  let result = prompt;

  // Dual face-swap renders prepend a composition string (candid/portrait/etc.)
  // at the front of the prompt — Flux's early-token weighting locks in the
  // framing/lighting style ahead of the long scene description.
  if (rules.dualPrepend) {
    result = `${rules.dualPrepend} ${result}`;
  }

  if (rules.appendFaceLock) {
    if (rules.dualFaceSwap) {
      result +=
        ', two people in scene, both faces turned toward viewer with eyes and nose visible, person on left side, person on right side';
    } else {
      result +=
        ', front-facing subject facing the camera, three-quarter front angle, eyes visible, no back view, no silhouette';
    }
  }

  if (rules.appendPortraitTags && !rules.skipDepthTags) {
    if (!result.includes('foreground midground background')) {
      result += ', foreground midground background stacked top to bottom, layered depth';
    }
  }

  return result;
}

// ── Prompt Sanitization ──

export function sanitizeUserPrompt(raw: string): string {
  return raw
    .replace(/[\r\n]+/g, ' ')
    .replace(/[{}[\]<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 240);
}
