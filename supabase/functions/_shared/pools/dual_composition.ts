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
      'candid medium shot, {realisticFaceTag}two people both angled toward viewer, both faces clearly visible, two distinct heads with a gap between them, warm natural lighting,',
    briefHint:
      'Candid feel — like a friend snapped this moment naturally. Relaxed, interactive body language.',
  },
  {
    name: 'portrait',
    prepend:
      'portrait shot, {realisticFaceTag}two people both turned toward the camera, both faces fully visible and well-lit, two distinct heads with a gap, not from behind, not silhouette,',
    briefHint: 'Classic portrait — both characters aware of the camera, natural but composed.',
  },
  {
    name: 'cinematic',
    prepend:
      'cinematic still, {realisticFaceTag}two people both angled toward viewer, eye-level camera, atmospheric lighting, both faces clearly visible, two distinct heads with a gap, not from behind,',
    briefHint: 'Movie still — dramatic lighting, purposeful framing, like a film poster moment.',
  },
  {
    name: 'environmental',
    prepend:
      'environmental portrait, {realisticFaceTag}two people filling the lower frame, eye-level camera, warm atmospheric lighting, both faces clearly visible, two distinct heads with a gap, not from behind,',
    briefHint:
      'Environmental portrait — characters grounded in a vivid setting, scene visible but subjects prominent.',
  },
  {
    name: 'editorial',
    prepend:
      'editorial portrait, {realisticFaceTag}two people posed naturally together, eye-level camera, golden hour lighting, both faces angled toward viewer, two distinct heads with a gap, not from behind,',
    briefHint: 'Editorial/magazine quality — stylish, purposeful, effortlessly cool.',
  },
];

export function pickDualCompositionPath(): DualCompositionPath {
  return DUAL_COMPOSITION_PATHS[Math.floor(Math.random() * DUAL_COMPOSITION_PATHS.length)];
}
