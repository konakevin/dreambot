/**
 * Chaos Layer — bot-engine port of supabase/functions/_shared/chaosLayer.ts.
 *
 * Injects 1-2 "perception distortion" phrases into a Sonnet brief so Sonnet
 * weaves them into the final scene description. Adds dream-logic shimmer
 * to scenery renders without breaking world truth.
 *
 * Design principles (from V4):
 * - Localized: only 1-2 injections per render
 * - Bounded: single dominant mode, optional second only at high intensity
 * - Aesthetic-safe: only visually plausible weirdness
 * - Perception only: chaos never touches world truth (weather, primary lighting, materials)
 *
 * Usage from a bot:
 *
 *   chaos: {
 *     enabled: true,
 *     skipPaths: ['vampire-girls-2', 'goth-closeup'],  // face-dominant paths
 *     intensityBias: 0.0,  // optional -0.3 to +0.3 to dial overall strength
 *   }
 */

const GEOMETRY_CHAOS = [
  'architectural geometry subtly impossible when examined closely',
  'stairs lead in directions that contradict spatial logic',
  'doorways and windows slightly wrong proportions for the walls',
  'parallel lines converge at inconsistent vanishing points',
  "structural supports connect at angles that shouldn't bear weight",
  'floor plane tilts imperceptibly between foreground and background',
];

const REFLECTION_CHAOS = [
  'reflections show a slightly different moment in time',
  "water surface reflects a version of the sky that doesn't match above",
  'mirror surfaces reflect objects not present in the scene',
  'puddle reflections are sharper and more detailed than the real scene',
  'glass reflections offset by a few degrees from reality',
  'reflective surfaces show the scene from a different camera angle',
];

const SCALE_CHAOS = [
  'subject appears slightly too large for surrounding architecture',
  'distant objects feel closer than depth cues suggest',
  'foreground elements are subtly oversized relative to perspective',
  'scale relationships between objects follow dream logic not physics',
  'background landmark impossibly large yet feels natural',
  'proportions shift gradually across the depth of the scene',
];

const FRAMING_CHAOS = [
  'foreground framing elements feel slightly too close to the lens',
  'depth of field splits unnaturally between two focal planes',
  'symmetry is almost perfect but deliberately broken in one detail',
  'composition weight shifts subtly off the expected center of gravity',
  'negative space appears in an unexpected region of the frame',
  'tilt barely perceptible creating subliminal unease',
];

const SECONDARY_LIGHT_CHAOS = [
  'secondary light source from impossible angle with no visible origin',
  'color temperature shifts from warm to cool across depth layers',
  'shadow direction diverges subtly between foreground and background',
  'rim light appears on the wrong edge relative to key light position',
  'ambient light intensity differs between left and right of frame',
  'light wraps around subject edges as if attracted to them',
];

const SUBJECT_CHAOS = [
  'faint echo of subject appears offset in background like afterimage',
  'subject silhouette subtly misaligned with cast shadow',
  'edges of subject blend imperceptibly into environment at extremities',
  'character proportions exaggerated just beyond natural',
  'subject casts shadow that belongs to a slightly different pose',
  'subject presence feels heavier than physical space should allow',
];

function getChaosChannels(allowSubjectChaos) {
  const channels = [
    { key: 'geometry', weight: 30, pool: GEOMETRY_CHAOS },
    { key: 'reflection', weight: 25, pool: REFLECTION_CHAOS },
    { key: 'scale', weight: 25, pool: SCALE_CHAOS },
    { key: 'framing', weight: 20, pool: FRAMING_CHAOS },
    { key: 'secondary_light', weight: 25, pool: SECONDARY_LIGHT_CHAOS },
  ];
  if (allowSubjectChaos) {
    channels.push({ key: 'subject', weight: 20, pool: SUBJECT_CHAOS });
  }
  return channels;
}

function pickFromPool(pool) {
  return pool[Math.floor(Math.random() * pool.length)];
}

function pickWeightedChannel(channels) {
  const total = channels.reduce((s, c) => s + c.weight, 0);
  let roll = Math.random() * total;
  for (const ch of channels) {
    roll -= ch.weight;
    if (roll <= 0) return ch;
  }
  return channels[channels.length - 1];
}

/**
 * Roll a chaos profile for a render.
 *
 * @param {Object} opts
 * @param {string} opts.path        — the path being rendered (used for skipPaths check)
 * @param {Object} opts.botChaos    — bot.chaos config object, or undefined
 * @param {boolean} opts.allowSubjectChaos — true on scenery (no figure), false on character renders
 * @returns {{ intensity: number, injections: string[], channelKey: string|null }}
 */
function rollChaos({ path, botChaos, allowSubjectChaos }) {
  if (!botChaos || !botChaos.enabled) {
    return { intensity: 0, injections: [], channelKey: null };
  }
  if (botChaos.skipPaths && botChaos.skipPaths.includes(path)) {
    return { intensity: 0, injections: [], channelKey: null };
  }

  // Per-path bias override (bot.chaos.intensityBiasByPath[path]) wins over the
  // bot-wide intensityBias — lets one path crank chaos without affecting others.
  const perPathBias =
    botChaos.intensityBiasByPath && typeof botChaos.intensityBiasByPath[path] === 'number'
      ? botChaos.intensityBiasByPath[path]
      : null;
  const bias =
    perPathBias !== null
      ? perPathBias
      : typeof botChaos.intensityBias === 'number'
        ? botChaos.intensityBias
        : 0;
  let intensity = Math.max(0, Math.min(1, Math.random() + bias));

  // No chaos below threshold (matches V4 behavior — ~30% of renders are chaos-free)
  if (intensity < 0.3) return { intensity, injections: [], channelKey: null };

  const channels = getChaosChannels(allowSubjectChaos);
  const primary = pickWeightedChannel(channels);
  const injections = [pickFromPool(primary.pool)];

  // Optional second injection only at high intensity + different channel
  if (intensity > 0.75 && Math.random() < 0.4) {
    const remaining = channels.filter((c) => c.key !== primary.key);
    if (remaining.length > 0) {
      const secondary = pickWeightedChannel(remaining);
      injections.push(pickFromPool(secondary.pool));
    }
  }

  return { intensity, injections, channelKey: primary.key };
}

/**
 * Build a chaos block to append to a Sonnet brief. Sonnet will weave the
 * phrases into its scene description naturally (rather than the words landing
 * verbatim in the final Flux prompt).
 *
 * Returns empty string if no injections were rolled.
 */
function buildChaosBriefBlock(chaosProfile) {
  if (!chaosProfile.injections.length) return '';
  const lines = chaosProfile.injections.map((p) => `   • ${p}`).join('\n');
  return `

━━━ DREAM-LOGIC PERCEPTION DISTORTION ━━━
Weave the following subtle perception distortion into the scene. ONE
specific detail in the description should reflect this — not stated
plainly but expressed visually. Do NOT call it out, do NOT explain it,
do NOT use the words "subtly" or "imperceptibly" in your output. The
viewer should feel it before they see it:
${lines}`;
}

module.exports = {
  rollChaos,
  buildChaosBriefBlock,
};
