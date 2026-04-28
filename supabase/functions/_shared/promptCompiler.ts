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
  return { character: 0, environment: 60, finishing: 15 };
}

// ── Section Builders ──

function buildSceneBlock(scene: CompilerInput['scene']): string {
  const parts: string[] = [];

  if (scene.userPrompt) {
    parts.push(scene.userPrompt);
  }
  if (scene.sceneExpansion) {
    parts.push(scene.sceneExpansion);
  }
  if (scene.styleReference) {
    parts.push(
      `REFERENCE STYLE (match this aesthetic — palette, lighting, composition, texture — but apply to NEW subject):\n"${scene.styleReference.slice(0, 400)}"\nCopy VISUAL STYLE, not subject.`
    );
  }
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
      "Position each character so their face is on their respective side — left character's face in the left half, right character's face in the right half. They can interact naturally (close together, touching) as long as each face stays on its side."
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

function buildCameraBlock(composition: CompilerInput['composition'], castCount: number): string {
  const parts: string[] = [];
  parts.push(composition.shotDirection);

  if (composition.faceSwapEligible) {
    if (castCount === 2) {
      parts.push(
        'BOTH faces must be three-quarter view toward camera — eyes, noses, and mouths all visible. No profiles, no back views, no silhouettes. Both faces sharp and well-lit. Medium-wide shot showing both figures with environment.'
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

  parts.push(
    'Portrait 9:16 vertical — wide environmental framing, show the full scene. Subject in context, NOT a tight headshot. Depth stacked top to bottom.'
  );
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

  const budget = getWordBudget(composition.type, composition.faceSwapEligible);
  const sceneBlock = buildSceneBlock(scene);
  const characterBlock = hasCast ? buildCharacterBlock(cast, medium, composition) : '';
  const cameraBlock = buildCameraBlock(composition, cast.length);
  const mediumSummary = summarizeMediumDirective(medium.directive);

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

═══ SCENE (SACRED — must appear) ═══
${sceneBlock}

═══ FOCAL ANCHOR (MANDATORY) ═══
There must be exactly ONE dominant visual subject: ${composition.focalAnchor}
- This is the first thing the eye sees.
- Everything else supports or frames it.
- Do NOT introduce competing subjects of equal importance.
- If multiple interesting elements exist, subordinate all but one to background role.

${scene.objectDirective ? `═══ SCENE OBJECT (MUST APPEAR) ═══\n${scene.objectDirective}\n\n` : ''}${characterBlock ? `═══ CHARACTER ═══\n${characterBlock}\n\n` : ''}═══ CAMERA ═══
${cameraBlock}

═══ STYLE${medium.characterRenderMode === 'embodied' ? ' (TRANSFORM EVERYTHING — the scene, environment, and characters ALL become this style. A forest becomes a stylized forest. A city becomes a stylized city. Nothing stays photorealistic.)' : ''} ═══
${mediumSummary}

═══ MOOD ═══
${vibeDirective}

═══ YOUR CREATIVE ADDITIONS ═══
Add vivid concrete details the user didn't mention. Things a camera can see — textures, light sources, atmospheric elements, foreground/background depth.

${profile && profile.avoid && profile.avoid.length > 0 ? `═══ NEVER INCLUDE ═══\n${profile.avoid.join(', ')}\n\n` : ''}RULES:
- Every word must be something a camera can see. No feelings, no metaphors.
- Depth: foreground, midground, background stacked top to bottom.
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
    },
    faceSwapSource,
    faceSwapSources,
  };
}

// ── Post-Processing (applied after Sonnet returns) ──

export function postProcessPrompt(prompt: string, rules: CompilerOutput['postProcess']): string {
  let result = prompt;

  if (rules.appendFaceLock) {
    if (rules.dualFaceSwap) {
      result +=
        ', two people facing camera, both faces three-quarter front angle, both faces visible and sharp, no back views, no silhouettes';
    } else {
      result +=
        ', front-facing subject facing the camera, three-quarter front angle, eyes visible, no back view, no silhouette';
    }
  }

  if (rules.appendPortraitTags) {
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
