/**
 * Monumental-face spot detector (face-swap safety).
 *
 * THE BUG (root-caused 2026-09-01, RACE_FIDELITY_PLAN.md): a seeded iconic spot
 * that depicts a COLOSSAL human/deity FACE — a giant Buddha, the Sphinx, an
 * Easter Island moai, Christ the Redeemer, Mount Rushmore, a cliff-carved face —
 * makes Flux render a huge face in the scene. The face-swap detector (YuNet) then
 * picks the LARGEST/most-frontal face in the frame, which is the STATUE, and the
 * pipeline pastes the cast member's face onto the monument (a grotesque giant-head
 * render; the couple degrades to solo because only one dominant face is found).
 * Confirmed on China's "Longmen Grottoes ... giant Vairocana Buddha carved ...
 * face" spot — Flux is literally told to render a colossal carved face.
 *
 * THE FIX: these spots are great for SCENE-ONLY dreams (no face to protect) but
 * must be dropped from CAST face-swap anchor pools. This detector is the gate;
 * the nightly anchor selection filters cast pools through it (self-healing — it
 * also catches spots seeded in the future, so no one-time data migration goes
 * stale). Detection is text-only and conservative: it only ever RE-ROLLS the
 * anchor to a different spot in the same pool, so a rare false positive just picks
 * another good spot — never a hard failure.
 */

// A scale/monument adjective ("giant", "colossal", "great" …).
const SCALE_RE =
  /\b(giant|colossal|massive|monumental|towering|enormous|huge|gigantic|immense|grand|great)\b/i;

// DEITY / named-figure nouns that in an iconic-spot context are essentially
// ALWAYS a monumental statue with a prominent face — flagged with NO scale word
// needed (a "reclining Buddha" or "moai" is a giant face even without "giant").
// Word-boundaried so "Buddhist" (temple) does NOT match \bbuddha\b.
const DEITY_FACE_RE =
  /\b(buddha|buddhas|daibutsu|sphinx|moai|colossus|colossi|redeemer|guanyin|kannon|avalokitesvara|vairocana|amitabha|maitreya|bodhisattva)\b/i;

// GENERIC statue nouns that are only a face-swap risk at MONUMENTAL scale — a
// plaza "bronze statue" is usually small/distant and fine, but a "giant statue"
// or "colossal sculpture" hijacks the swap. Gated behind SCALE_RE. Deliberately
// NOT bare "head"/"face"/"figure" (false hits like "trailhead"/"cliff face") —
// explicit carvings are handled by CARVED_FACE_RE instead.
const SCALE_GATED_NOUN_RE =
  /\b(statue|statues|sculpture|sculptures|effigy|idol|deity|pharaoh|bust)\b/i;

// Explicit "carved/sculpted/rock-cut … face/visage/buddha/effigy" phrasing — a
// colossal carved face even without a scale word (e.g. "carved face emerging from
// the cliff", or the reverse "a face carved into the mountainside"). Both word
// orders, restricted to the same clause (no comma/period between) so we don't
// match unrelated sentence fragments.
const CARVE_VERB = '(?:carved|sculpted|hewn|rock[- ]?cut|cliff[- ]?carved|stone[- ]?cut|chiseled)';
const FACE_NOUN = '(?:face|visage|buddha|effigy|likeness|countenance)';
const CARVED_FACE_RE = new RegExp(
  `\\b${CARVE_VERB}\\b[^,.;]*\\b${FACE_NOUN}\\b|\\b${FACE_NOUN}\\b[^,.;]*\\b${CARVE_VERB}\\b`,
  'i'
);

// Specific named monuments that ARE a giant face, regardless of phrasing.
const NAMED_MONUMENT_RE =
  /\b(sphinx|moai|easter island|mount rushmore|christ the redeemer|leshan|longmen|yungang|ushiku daibutsu|ushiku|tian tan|kamakura daibutsu|great buddha|reclining buddha|spring temple buddha|statue of liberty|bamiyan|gomateshwara|bahubali|decebalus)\b/i;

/**
 * True when a spot's text denotes a monumental human/deity FACE that would
 * hijack the face swap. Used to keep such spots OUT of cast (face-swap) anchor
 * pools while leaving them eligible for scene-only renders.
 */
export function isMonumentalFaceSpot(spotText: string | null | undefined): boolean {
  if (!spotText) return false;
  const t = spotText;
  if (NAMED_MONUMENT_RE.test(t)) return true;
  if (CARVED_FACE_RE.test(t)) return true;
  if (DEITY_FACE_RE.test(t)) return true;
  if (SCALE_RE.test(t) && SCALE_GATED_NOUN_RE.test(t)) return true;
  return false;
}
