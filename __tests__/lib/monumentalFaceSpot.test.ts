/**
 * Monumental-face spot detector — face-swap safety gate.
 *
 * The bug: a seeded iconic spot depicting a colossal human/deity FACE (giant
 * Buddha, Sphinx, moai, Christ the Redeemer, cliff-carved face) makes Flux render
 * a huge face; the face-swap detector grabs the STATUE and pastes the cast onto
 * the monument. These must be dropped from CAST anchor pools (kept for scenes).
 * This locks: real landmines flagged, ordinary places NOT flagged.
 */

import { isMonumentalFaceSpot } from '@engine/monumentalFaceSpot';

describe('isMonumentalFaceSpot — flags monumental-face landmines', () => {
  const LANDMINES = [
    // the exact confirmed failures
    'Longmen Grottoes Luoyang giant Vairocana Buddha carved into limestone cliff face',
    'Longmen Grottoes giant Vairocana Buddha carved face emerging from limestone cliff above Yi River',
    // other giant Buddhas
    'Leshan Giant Buddha overlooking the river confluence',
    'the Great Buddha of Kamakura seated in the open air',
    'Ushiku Daibutsu towering bronze figure',
    'Spring Temple Buddha rising above the valley',
    'reclining Buddha gilded in the temple hall',
    // named monuments that are a giant face
    'the Great Sphinx of Giza at dawn',
    'Easter Island moai lined along the coast',
    'moai statues under a stormy sky',
    'Christ the Redeemer arms open above Rio',
    'Mount Rushmore presidential faces at golden hour',
    'the Statue of Liberty against the harbor',
    // generic colossal-statue + carved-face phrasing
    'a colossal stone deity statue guarding the ruins',
    'towering sculpture of a pharaoh at the temple gate',
    'a face carved into the mountainside above the pass',
    'sculpted visage hewn from the granite cliff',
  ];
  it.each(LANDMINES)('flags: %s', (t) => {
    expect(isMonumentalFaceSpot(t)).toBe(true);
  });
});

describe('isMonumentalFaceSpot — does NOT over-flag ordinary spots', () => {
  const SAFE = [
    'the Great Wall of China snaking over the ridges',
    'the Great Barrier Reef seen from the water',
    'Shanghai Bund skyline at blue hour',
    'a misty tea terrace on the mountainside',
    'the trailhead at the base of the canyon',
    'sunset over the sandstone cliff face', // "cliff face" but no carving verb / statue noun
    'a bustling night market alley',
    'the Eiffel Tower over the rooftops',
    'a Buddhist temple garden with koi ponds', // temple, but no monumental face
    'a small bronze fountain in the plaza',
    'the Grand Canyon rim at first light', // "grand" scale word, no statue noun
    'a grand ballroom with crystal chandeliers',
    'terraced rice paddies under morning fog',
  ];
  it.each(SAFE)('does not flag: %s', (t) => {
    expect(isMonumentalFaceSpot(t)).toBe(false);
  });

  it('null / empty is safe', () => {
    expect(isMonumentalFaceSpot(null)).toBe(false);
    expect(isMonumentalFaceSpot(undefined)).toBe(false);
    expect(isMonumentalFaceSpot('')).toBe(false);
  });
});
