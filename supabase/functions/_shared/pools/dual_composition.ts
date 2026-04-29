/**
 * Dual character composition paths — cinematography presets for two-person renders.
 *
 * Each path controls HOW the scene is shot (camera, framing, lighting tone),
 * NOT what's in it (clothing, setting, props are Sonnet's domain).
 *
 * The `prepend` is injected at the start of the Flux prompt.
 * `{realisticFaceTag}` is replaced at runtime for stylized mediums.
 *
 * Structural safety (regex stripping, action pool, Sonnet brief) applies
 * to ALL paths equally — these only set compositional tone.
 */

export interface DualCompositionPath {
  name: string;
  prepend: string;
  briefHint: string;
}

export const DUAL_COMPOSITION_PATHS: DualCompositionPath[] = [
  {
    name: 'candid',
    prepend:
      'candid medium shot, {realisticFaceTag}two people side by side both angled toward viewer, three-quarter view, both faces visible, warm natural lighting,',
    briefHint: 'Candid feel — like a friend snapped this moment naturally. Relaxed body language.',
  },
  {
    name: 'portrait',
    prepend:
      'portrait shot facing forward, {realisticFaceTag}exactly two people side by side both facing the camera, not facing each other, three-quarter view, both faces fully visible and well-lit, not from behind, not silhouette,',
    briefHint: 'Classic portrait — both characters aware of the camera, natural but composed.',
  },
  {
    name: 'cinematic',
    prepend:
      'cinematic still, {realisticFaceTag}two people side by side both angled toward viewer, eye-level camera, atmospheric lighting, both faces visible in three-quarter view, not from behind, not facing each other, not back to back,',
    briefHint: 'Movie still — dramatic lighting, purposeful framing, like a film poster moment.',
  },
  {
    name: 'intimate',
    prepend:
      'warm close-up portrait, {realisticFaceTag}two people close together both angled toward viewer, soft diffused lighting, both faces visible in three-quarter view, not facing each other, not from behind, not silhouette,',
    briefHint: 'Intimate framing — tighter crop, warm tones, characters close together.',
  },
  {
    name: 'environmental',
    prepend:
      'environmental portrait, {realisticFaceTag}two people side by side filling the lower frame, eye-level camera, warm atmospheric lighting, both faces visible, not from behind,',
    briefHint:
      'Environmental portrait — characters grounded in a vivid setting, scene visible but subjects prominent.',
  },
  {
    name: 'editorial',
    prepend:
      'editorial portrait, {realisticFaceTag}two people posed naturally side by side, eye-level camera, golden hour lighting, both faces angled toward viewer, not from behind,',
    briefHint: 'Editorial/magazine quality — stylish, purposeful, effortlessly cool.',
  },
];

export function pickDualCompositionPath(): DualCompositionPath {
  return DUAL_COMPOSITION_PATHS[Math.floor(Math.random() * DUAL_COMPOSITION_PATHS.length)];
}
