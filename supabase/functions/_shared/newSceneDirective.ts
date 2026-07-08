/**
 * newSceneDirective — the reference-path brain for uploaded-photo New Scene
 * (NEW_SCENE_QUALITY_PLAN.md). Two jobs:
 *
 *   1. routeNewSceneSubject() — the fork. Given the classify-photo signals,
 *      decide solo-swap (exact face, the existing path) vs the reference path,
 *      and if reference, which SUBJECT KIND. Conservative: anything that isn't a
 *      clean single swappable human with no competing pet goes to reference,
 *      where a soft-but-safe likeness beats a wrong-face swap.
 *
 *   2. buildNewScenePrompt() — assemble the instruction-model prompt. Reference
 *      models (Seedream / Nano Banana / Kontext) are INSTRUCTION FOLLOWERS, not
 *      Flux-CLIP token models, so we compose PROSE: a per-kind subject-
 *      preservation clause + the user's scene + the medium's prose `directive`
 *      (NOT its fluxFragment) + the vibe's directive. The place-hallucination
 *      bench (2026-07-08) proved the per-kind clause is mandatory: a generic
 *      "the subject…" prompt invents a person on a photo of a place.
 *
 * Pure module (no top-level `?.` — Deno edge BOOT_ERROR rule). No I/O.
 */

export type NewSceneSubjectKind = 'people' | 'pet' | 'person_pet' | 'object' | 'scene';

export interface ClassifySignals {
  type: string; // person | group | animal | object | scenery | unclear
  num_people: number;
  num_animals: number;
  face: string; // clean | multi | none | unclear
}

export type NewSceneRoute =
  | { mode: 'solo_swap' } // exactly one clean swappable human, no pet — the existing exact-face path
  | { mode: 'reference'; kind: NewSceneSubjectKind };

/**
 * The fork. NOTE: the group-size CAP (num_people > new_scene_max_people) is a
 * pre-charge BLOCK handled by the caller (client attach-gate + an edge safety
 * check) BEFORE routing — this function assumes an in-cap photo.
 */
export function routeNewSceneSubject(sig: ClassifySignals): NewSceneRoute {
  const people = Math.max(0, sig.num_people || 0);
  const animals = Math.max(0, sig.num_animals || 0);

  // Solo swap only for a high-confidence single clean human with no competing
  // pet. Everything else → reference (safe default).
  if (people === 1 && animals === 0 && sig.face === 'clean') {
    return { mode: 'solo_swap' };
  }
  if (people >= 1 && animals >= 1) return { mode: 'reference', kind: 'person_pet' };
  if (people >= 1) return { mode: 'reference', kind: 'people' };
  if (animals >= 1) return { mode: 'reference', kind: 'pet' };
  if (sig.type === 'object') return { mode: 'reference', kind: 'object' };
  // scenery, unclear, or anything left → treat as a place/scene reimagining.
  return { mode: 'reference', kind: 'scene' };
}

/** Per-kind subject-preservation clause — the load-bearing instruction. */
function preservationClause(kind: NewSceneSubjectKind, subjectDescription: string): string {
  const desc = subjectDescription.trim();
  const withDesc = (base: string, tail: string) => (desc ? `${base} ${tail} ${desc}.` : `${base}`);
  switch (kind) {
    case 'people':
      return withDesc(
        'Recompose the people from this photo into the new scene. Keep EACH person’s exact face, age, hair, and build so they stay clearly recognizable, and arrange them naturally together.',
        'The people:'
      );
    case 'person_pet':
      return withDesc(
        'Recompose the person and their pet from this photo TOGETHER into the new scene. Keep the person’s exact face and the pet’s exact breed, size, and markings — both clearly recognizable and kept together.',
        'Subjects:'
      );
    case 'pet':
      return withDesc(
        'Recompose this animal from the photo into the new scene. Keep its exact breed, size, fur/coat color, and markings so it stays recognizable as the same animal.',
        'The animal:'
      );
    case 'object':
      return withDesc(
        'Place this exact object from the photo into the new scene. Keep its shape, color, materials, and defining details true to the original.',
        'The object:'
      );
    case 'scene':
      return withDesc(
        'Reimagine this place from the photo as the new scene. Keep the recognizable character and key features of the original location — do NOT invent a person as the subject.',
        'The place:'
      );
  }
}

/**
 * Assemble the full instruction prompt for a reference model.
 * @param scene       the user's typed scene (their `hint`), already sanitized.
 * @param mediumProse the medium's prose `directive` (NOT fluxFragment).
 * @param vibeProse   the vibe's prose `directive`.
 */
export function buildNewScenePrompt(opts: {
  kind: NewSceneSubjectKind;
  subjectDescription: string;
  scene: string;
  mediumProse: string;
  vibeProse: string;
}): string {
  const scene = opts.scene.trim();
  const sceneLine = scene
    ? `New scene: ${scene}.`
    : 'New scene: a fresh, appealing setting that suits the subject.';
  const style = [opts.mediumProse.trim(), opts.vibeProse.trim()].filter(Boolean).join(' ');
  return [
    preservationClause(opts.kind, opts.subjectDescription),
    sceneLine,
    style ? `Style: ${style}` : '',
    'Vertical 9:16 portrait composition, rich detail.',
  ]
    .filter(Boolean)
    .join('\n');
}
