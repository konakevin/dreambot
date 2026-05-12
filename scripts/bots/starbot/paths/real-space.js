/**
 * StarBot real-space path — PHOTOREAL astrophotography.
 * NASA / Hubble / JWST / Chandra / EHT multi-wavelength composite style.
 * Real astronomical subjects — named OK.
 *
 * Canonical-LITE architecture (intentionally narrative-only universal axes,
 * because real_space_subjects pool entries already bake instrument + framing
 * + tiny mechanical scale-prover into each seed — visual axes would conflict):
 *   Universal axes (3): story_beats / composition_frame / emotional_dna
 *     (narrative-only — they shape the angle/framing/mood without adding
 *     visual elements that would duplicate the rich subject seed)
 *   Path-level (1): real_space_subjects (primary subject, fat seed)
 *   Conditional drama layer (35% gate): cosmic_event — supernova / GRB /
 *     collision / quasar flare. Reinforces what's in the subject when it
 *     fires; adds active drama when the subject is more static.
 *
 * SKIPPED axes (intentional): scale_provers (already in seed), surprise_element
 *   (already in seed), weather_particulate (vacuum, mostly irrelevant for
 *   astrophotography), alien_sky_layer (we ARE the sky).
 */

const pools = require('../pools');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  // ── Path-level (primary subject, fat seed) ──
  const subject = picker.pickWithRecency(pools.REAL_SPACE_SUBJECTS, 'real_space_subject');

  // ── Universal narrative-only axes ──
  const storyBeat = picker.pickWithRecency(pools.STORY_BEATS, 'story_beat');
  const compositionFrame = picker.pickWithRecency(pools.COMPOSITION_FRAME, 'composition_frame');
  const emotionalDna = picker.pickWithRecency(pools.EMOTIONAL_DNA, 'emotional_dna');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  // ── Conditional COSMIC_EVENT drama layer (35% gate — slightly lower than
  // cosmic-vista because the subject often already implies its own drama) ──
  const isCosmicEvent = Math.random() < 0.35;
  const cosmicEvent = isCosmicEvent ? picker.pickWithRecency(pools.COSMIC_EVENT, 'cosmic_event') : null;
  const eventSection = isCosmicEvent ? `
━━━ COSMIC EVENT — render this drama visibly ACTIVE in the scene ━━━
${cosmicEvent}

The event is happening RIGHT NOW in the frame — caught mid-detonation, mid-collision, mid-eruption. If the subject above already shows a similar phenomenon, AMPLIFY it (more violent, more luminous, more visible). If the subject is more static (a planet / moon / asteroid field), the event happens behind/beyond it.

` : '';

  return `You are an astrophotographer writing a REAL SPACE scene for StarBot — photoreal NASA / Hubble / JWST / Chandra / EHT multi-wavelength composite astrophotography. REAL astronomical subjects, not fictional sci-fi. The universe is already jaw-dropping — render it faithfully, then PUNCH the color and saturation. Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — PHOTOREAL ASTRO, CRANKED TO 11 ━━━
- Punched-up multi-wavelength composite colors — saturated, vibrant, GLOWING
- Subject is real (real planets, real galaxies, real instruments, real nebulae)
- Tiny mechanical scale-prover (drone / craft / probe / station) silhouette in frame as named in the subject seed — keep it small but visible
- FORBIDDEN: fictional characters, fictional ships beyond a scale-prover silhouette, fantasy elements, painterly oil-canvas style (that's cosmic-vista's domain — this is PHOTOREAL)

━━━ THE ASTRONOMICAL SUBJECT (primary scene seed — render every detail) ━━━
${subject}
${eventSection}
━━━ NARRATIVE BEAT (interpret at cosmic / observational scale) ━━━
${storyBeat}

Interpret this beat astronomically — the drama is between cosmic forces caught by an instrument. A "DEPARTURE" beat means light leaving the subject toward the camera. An "ARRIVAL" means the instrument just caught the moment. A "CONFRONTATION" means the subject is at the limit of what light can show us. Don't add figures.

━━━ COMPOSITION FRAME ━━━
${compositionFrame}

━━━ LIGHTING / WAVELENGTH TREATMENT ━━━
${lighting}

━━━ EMOTIONAL DNA ━━━
${emotionalDna}

━━━ MAKE IT OVERWHELMING ━━━
The real universe is more awe-inspiring than any fiction. Crank EVERYTHING — luminous gas clouds GLOWING from within, stars so bright they bloom and flare, color so vivid it looks electric. This is space photography as a religious experience. The kind of image that makes you feel insignificant and ecstatic at the same time. FILL THE FRAME with light and color and scale.

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write 100-130 words ━━━
Open with the SUBJECT and its named instrument/wavelength. Layer in: spectral / color details (saturated multi-wavelength composite), composition framing, atmospheric/instrumental glow effects, scale-prover positioning. ONE haunting detail (impossible color, time-dilated light, gravitational lensing arc, X-ray jet at relativistic speed). Photoreal astrophotography finish, cranked saturation, glowing depth.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**. Just the scene content.`;
};
