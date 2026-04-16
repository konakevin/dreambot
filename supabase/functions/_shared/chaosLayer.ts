/**
 * Chaos Layer — controlled visual perturbations for surprise and novelty.
 *
 * Sits between scene expansion and prompt compilation. Injects occasional
 * "perception distortion" phrases that create surreal, unexpected visual elements.
 *
 * Design principles:
 * - Localized: only 1-2 injections per dream
 * - Bounded: single dominant mode, optional second at high intensity only
 * - Aesthetic-safe: only visually plausible weirdness
 * - Context-aware: dampened for minimalist prompts, embodied mediums, face-swap scenes
 * - Perception only: chaos never touches "world truth" (weather, primary lighting, materials)
 *
 * The expander owns world truth. Chaos owns how that world is PERCEIVED.
 */

// ── Chaos Pools (perception distortion only — NOT world truth) ──

const GEOMETRY_CHAOS: string[] = [
  'architectural geometry subtly impossible when examined closely',
  'stairs lead in directions that contradict spatial logic',
  'doorways and windows slightly wrong proportions for the walls',
  'parallel lines converge at inconsistent vanishing points',
  "structural supports connect at angles that shouldn't bear weight",
  'floor plane tilts imperceptibly between foreground and background',
];

const REFLECTION_CHAOS: string[] = [
  'reflections show a slightly different moment in time',
  "water surface reflects a version of the sky that doesn't match above",
  'mirror surfaces reflect objects not present in the scene',
  'puddle reflections are sharper and more detailed than the real scene',
  'glass reflections offset by a few degrees from reality',
  'reflective surfaces show the scene from a different camera angle',
];

const SCALE_CHAOS: string[] = [
  'subject appears slightly too large for surrounding architecture',
  'distant objects feel closer than depth cues suggest',
  'foreground elements are subtly oversized relative to perspective',
  'scale relationships between objects follow dream logic not physics',
  'background landmark impossibly large yet feels natural',
  'proportions shift gradually across the depth of the scene',
];

const FRAMING_CHAOS: string[] = [
  'foreground framing elements feel slightly too close to the lens',
  'depth of field splits unnaturally between two focal planes',
  'symmetry is almost perfect but deliberately broken in one detail',
  'composition weight shifts subtly off the expected center of gravity',
  'negative space appears in an unexpected region of the frame',
  'tilt barely perceptible creating subliminal unease',
];

const SECONDARY_LIGHT_CHAOS: string[] = [
  'secondary light source from impossible angle with no visible origin',
  'color temperature shifts from warm to cool across depth layers',
  'shadow direction diverges subtly between foreground and background',
  'rim light appears on the wrong edge relative to key light position',
  'ambient light intensity differs between left and right of frame',
  'light wraps around subject edges as if attracted to them',
];

const SUBJECT_CHAOS: string[] = [
  'faint echo of subject appears offset in background like afterimage',
  'subject silhouette subtly misaligned with cast shadow',
  'edges of subject blend imperceptibly into environment at extremities',
  'character proportions exaggerated just beyond natural',
  'subject casts shadow that belongs to a slightly different pose',
  'subject presence feels heavier than physical space should allow',
];

// ── Chaos Channel Definition ──

interface ChaosChannel {
  key: string;
  weight: number;
  pool: string[];
}

function getChaosChannels(faceSwapEligible: boolean): ChaosChannel[] {
  const channels: ChaosChannel[] = [
    { key: 'geometry', weight: 30, pool: GEOMETRY_CHAOS },
    { key: 'reflection', weight: 25, pool: REFLECTION_CHAOS },
    { key: 'scale', weight: 25, pool: SCALE_CHAOS },
    { key: 'framing', weight: 20, pool: FRAMING_CHAOS },
    { key: 'secondary_light', weight: 25, pool: SECONDARY_LIGHT_CHAOS },
  ];

  // Subject chaos disabled for face swap (never distort the face-swap subject)
  if (!faceSwapEligible) {
    channels.push({ key: 'subject', weight: 20, pool: SUBJECT_CHAOS });
  }

  return channels;
}

// ── Seeded Random ──

function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickFromPool(pool: string[], rand: () => number): string {
  return pool[Math.floor(rand() * pool.length)];
}

function pickWeightedChannel(channels: ChaosChannel[], rand: () => number): ChaosChannel {
  const total = channels.reduce((s, c) => s + c.weight, 0);
  let roll = rand() * total;
  for (const ch of channels) {
    roll -= ch.weight;
    if (roll <= 0) return ch;
  }
  return channels[channels.length - 1];
}

// ── Public Interface ──

export interface ChaosProfile {
  intensity: number;
  injections: string[];
}

export function rollChaos(
  seed: number,
  context: {
    userPrompt: string;
    mediumRenderMode: string;
    faceSwapEligible: boolean;
  }
): ChaosProfile {
  // Chaos seed uses Date.now() intentionally — we WANT chaos to vary across
  // identical prompts. The expander should be stable; chaos should not.
  const rand = mulberry32(seed + Date.now());

  let intensity = rand();

  // Dampen for specific contexts
  if (/minimalist|clean|simple|minimal/i.test(context.userPrompt)) intensity *= 0.3;
  if (context.mediumRenderMode === 'embodied') intensity *= 0.6;

  // No chaos below threshold
  if (intensity < 0.3) return { intensity, injections: [] };

  const channels = getChaosChannels(context.faceSwapEligible);

  // Pick ONE dominant mode (single dominant constraint)
  const primary = pickWeightedChannel(channels, rand);
  const injections: string[] = [pickFromPool(primary.pool, rand)];

  // Optional second ONLY at high intensity + must be different channel
  if (intensity > 0.75 && rand() < 0.4) {
    const remaining = channels.filter((c) => c.key !== primary.key);
    if (remaining.length > 0) {
      const secondary = pickWeightedChannel(remaining, rand);
      injections.push(pickFromPool(secondary.pool, rand));
    }
  }

  return { intensity, injections };
}

export function applyChaos(expansion: string, chaos: ChaosProfile): string {
  if (chaos.injections.length === 0) return expansion;
  return expansion + ', ' + chaos.injections.join(', ');
}
