/**
 * coupleComposerX.ts — the EXPERIMENTAL couple prompt composer (FLUX COUPLE LAB, Kevin 2026-09-18).
 *
 * Reached only when the couple engine is 'experimental' (engine_config.nightly_couple_engine, or the QA flag
 * force_couple_engine). Production keeps assembleCharacterPrompt untouched. Every variant is a pure function of the
 * same slots + input the production composer sees, so a round changes ONE thing: the sentence shape.
 *
 * Variants (project_flux_couple_lab):
 *  - narrative       left-to-right prose: environment, then the left person, then the right person, then the beat
 *  - narrative_asym  narrative + a contrasting palette cue per side (attribute-bleed guard)
 *  - narrative_faces narrative with the two-faces-to-camera line FIRST (position control)
 *  - json            FLUX.2 structured prompt (scene / camera / subjects[] / style) as a JSON string
 */
import { resolveIdentity } from './characterSlotPrompt.ts';
import type { CharacterSlotPipelineInput, DualSlots } from './characterSlotPrompt.ts';

export type CoupleVariant =
  | 'narrative'
  | 'narrative_asym'
  | 'narrative_faces'
  | 'narrative_fg'
  | 'narrative_fg_beat'
  | 'json';
export const COUPLE_VARIANTS: readonly CoupleVariant[] = [
  'narrative',
  'narrative_asym',
  'narrative_faces',
  'narrative_fg',
  'narrative_fg_beat',
  'json',
];

export function isCoupleVariant(x: unknown): x is CoupleVariant {
  return typeof x === 'string' && (COUPLE_VARIANTS as readonly string[]).includes(x);
}

function describe(member: CharacterSlotPipelineInput['cast'][number]): {
  desc: string;
  gender: 'man' | 'woman' | 'person';
} {
  const r = resolveIdentity(member);
  const parts = [
    `a ${r.ethnicity ? `${r.ethnicity} ` : ''}${r.gender}`,
    r.age,
    r.build,
    r.skin,
    r.identity,
  ].filter((p): p is string => !!p && p.trim().length > 0);
  return { desc: parts.join(', '), gender: r.gender };
}

const clean = (s: string | null | undefined): string =>
  (s || '')
    .replace(/\s+/g, ' ')
    .replace(/\.\s*$/, '')
    .trim();

export function composeExperimentalCouple(args: {
  slots: DualSlots;
  input: CharacterSlotPipelineInput;
  variant: CoupleVariant;
}): string {
  const { slots, input, variant } = args;
  const place = clean(input.setAtOverride || input.iconicAnchor || input.userPlace);
  const medium = clean(input.mediumFluxFragment);
  const scene = clean(slots.scene_description);
  const beat = clean(slots.action);
  const mood = clean(slots.mood);
  const props = clean(slots.props);
  const vibe = clean(input.vibeFragment);
  const left = describe(input.cast[0]);
  const right = describe(input.cast[1] ?? input.cast[0]);
  const her = left.gender === 'woman' ? 'her' : left.gender === 'man' ? 'his' : 'their';
  const leftWardrobe = clean(slots.left_wardrobe);
  const rightWardrobe = clean(slots.right_wardrobe);
  const leftWear =
    variant === 'narrative_asym' ? `warm reds, golds and cream: ${leftWardrobe}` : leftWardrobe;
  const rightWear =
    variant === 'narrative_asym'
      ? `cool blues, charcoal and silver: ${rightWardrobe}`
      : rightWardrobe;
  const tail = 'No text, no words, no letters, no watermarks.';

  if (variant === 'json') {
    return JSON.stringify({
      scene: `${place ? `${place}. ` : ''}${scene}${scene ? '. ' : ''}${medium}`,
      camera:
        'three-quarter length two-shot from about four metres, both figures shown from the knees up, side by side with a clear gap between their heads, the setting sweeping around and above them',
      subjects: [
        {
          description: `${left.desc}, wearing ${leftWear}`,
          position: 'left side of the frame',
          action: 'face turned toward the camera, clearly visible',
        },
        {
          description: `${right.desc}, wearing ${rightWear}`,
          position: 'right side of the frame, a clear gap between their heads',
          action: 'face turned toward the camera, clearly visible',
        },
      ],
      ...(beat ? { action: beat } : {}),
      style: `lifelike adult faces with realistic human facial proportions, both faces unobstructed${mood ? `; ${mood}` : ''}${vibe ? `; ${vibe}` : ''}`,
      ...(props ? { props } : {}),
    });
  }

  // narrative_fg (the "no people" failures): the couple is named IN THE FOREGROUND before the scene, with no face
  // words up front (R2 showed face words first pull the camera in); the scene follows "behind and around them".
  // narrative_fg_beat (LAB R11 #17, "rides twin red foxes" rendered as a walk): an ACTIVE-scenario seed arrives as the
  // place text and reads "Couple rides twin red foxes through an autumn forest" — under narrative_fg that landed after
  // "Behind and around them", which is nonsense. Scenario-shaped place text becomes the couple's own sentence right
  // after their names, and only the scene description stays behind them.
  if (variant === 'narrative_fg_beat') {
    const scenarioLike =
      /^(a couple|couple|two people|two|they|the couple|the two|person|the pair)\b/i.test(place);
    // Verbatim: the scenario text is a caption-like sentence ("Couple balancing on wooden boards…", "Two travelers
    // stride…"); rewriting the subject to "They" mangled half of them in R12. Flux reads the caption fine.
    const beatSentence = scenarioLike ? place : '';
    const beatText = [beatSentence, beat]
      .filter(Boolean)
      .map((b) => `${b.charAt(0).toUpperCase()}${b.slice(1)}.`)
      .join(' ');
    const behind = scenarioLike ? scene : `${place ? `${place}` : ''}${scene ? `: ${scene}` : ''}`;
    const fgS = `${medium ? `${medium}. ` : ''}A three-quarter length two-shot. In the foreground, on the left, ${left.desc}, wearing ${leftWardrobe}; to ${her} right, with a clear gap between their heads, ${right.desc}, wearing ${rightWardrobe}. ${beatText ? `${beatText} ` : ''}Behind and around them${behind ? `, ${behind}` : ''}. Both are shown from the knees up, side by side, their faces turned toward the camera, clearly visible and unobstructed, lifelike adult faces with realistic proportions.`;
    const extrasB = [props, mood, vibe]
      .filter(Boolean)
      .map((z) => `${z.charAt(0).toUpperCase()}${z.slice(1)}.`)
      .join(' ');
    return `${fgS} ${extrasB} ${tail}`.replace(/\s+/g, ' ').trim();
  }
  if (variant === 'narrative_fg') {
    const fgS = `${medium ? `${medium}. ` : ''}A three-quarter length two-shot. In the foreground, on the left, ${left.desc}, wearing ${leftWardrobe}; to ${her} right, with a clear gap between their heads, ${right.desc}, wearing ${rightWardrobe}. ${beat ? `${beat.charAt(0).toUpperCase()}${beat.slice(1)}. ` : ''}Behind and around them${place ? `, ${place}` : ''}${scene ? `: ${scene}` : ''}. Both are shown from the knees up, side by side, their faces turned toward the camera, clearly visible and unobstructed, lifelike adult faces with realistic proportions.`;
    const extrasFg = [props, mood, vibe]
      .filter(Boolean)
      .map((x) => `${x.charAt(0).toUpperCase()}${x.slice(1)}.`)
      .join(' ');
    return `${fgS} ${extrasFg} ${tail}`.replace(/\s+/g, ' ').trim();
  }
  const facesLine =
    'Both are shown from the knees up, side by side, their faces turned toward the camera, clearly visible and unobstructed, lifelike adult faces with realistic proportions.';
  const opening = variant === 'narrative_faces' ? `${facesLine} ` : '';
  const env = `${medium ? `${medium}. ` : ''}A three-quarter length two-shot of a couple${place ? ` at ${place}` : ''}${scene ? `: ${scene}` : ''}.`;
  const leftS = `On the left, ${left.desc}, wearing ${leftWear}.`;
  const rightS = `To ${her} right, with a clear gap between their heads, ${right.desc}, wearing ${rightWear}.`;
  const beatS = beat ? `${beat.charAt(0).toUpperCase()}${beat.slice(1)}.` : '';
  const closing = variant === 'narrative_faces' ? '' : ` ${facesLine}`;
  const extras = [props, mood, vibe]
    .filter(Boolean)
    .map((s) => `${s.charAt(0).toUpperCase()}${s.slice(1)}.`)
    .join(' ');
  return `${opening}${env} ${leftS} ${rightS} ${beatS}${closing} ${extras} ${tail}`
    .replace(/\s+/g, ' ')
    .trim();
}
