/**
 * Quality gate — locks for the BROKEN-only contract (NIGHTLY_IMPRESS_PLAN §1).
 * The gate's scope is deliberately minimal (Kevin 2026-09-03: taste is
 * subjective; only blatant breakage counts). These tests make scope creep and
 * bias drift IMPOSSIBLE to reintroduce silently — any prompt change must also
 * re-run scripts/eval-quality-gate.ts and hold false positives at ZERO.
 */
import { buildGatePrompt, parseGateResponse } from '@engine/qualityGate';

describe('buildGatePrompt — scope + bias locks', () => {
  const p = buildGatePrompt();
  it('keeps the conservative unsure→NOT-broken bias', () => {
    expect(p).toMatch(/unsure, answer no/i);
  });
  it('whitelists intentional fantasy scale (giant corgis are content)', () => {
    expect(p).toMatch(/GIANT or oversized animals/i);
    expect(p).toMatch(/NOT broken/);
  });
  it('never asks for justification (Haiku/Sonnet refuse justified probes)', () => {
    expect(p).not.toMatch(/justif|explain|why|reason/i);
  });
  it('never smuggles taste vocabulary into scope', () => {
    // These words may only appear in the NORMAL/whitelist sentence, never as
    // defect criteria — cheap proxy: the defect sentence is the "Answer yes" one.
    const defectSentence = p.split('Answer BROKEN yes ONLY')[1].split('.')[0];
    const profileSentence = p.split('Answer PROFILE yes ONLY')[1].split('.')[0];
    for (const w of ['beautiful', 'quality', 'boring', 'background', 'composition', 'aesthetic']) {
      expect(defectSentence.toLowerCase()).not.toContain(w);
      expect(profileSentence.toLowerCase()).not.toContain(w);
    }
  });
  it('asks exactly two closed-set questions (BROKEN + PROFILE), nothing else', () => {
    expect(p).toContain('BROKEN: yes or no');
    expect(p).toContain('PROFILE: yes or no');
    expect(p).not.toMatch(/FACES:|FACESIZE|CREATURE/);
  });
  it('PROFILE carves out three-quarter views (conservative — Kevin: only strict side views)', () => {
    expect(p).toMatch(/three-quarter or frontal view with both eyes visible is NOT a profile/);
  });
});

describe('parseGateResponse', () => {
  it('parses yes → fail with broken flag', () => {
    const v = parseGateResponse('BROKEN: yes');
    expect(v).toEqual(expect.objectContaining({ pass: false, flags: ['broken'] }));
  });
  it('parses no → pass', () => {
    expect(parseGateResponse('BROKEN: no')?.pass).toBe(true);
  });
  it('tolerates case + surrounding chatter', () => {
    expect(parseGateResponse('Sure!\nbroken:  NO\nthanks')?.pass).toBe(true);
  });
  it('PROFILE yes → fail with profile flag; missing PROFILE line → treated as no', () => {
    expect(parseGateResponse('BROKEN: no\nPROFILE: yes')).toEqual(
      expect.objectContaining({ pass: false, flags: ['profile'] })
    );
    expect(parseGateResponse('BROKEN: yes\nPROFILE: yes')?.flags).toEqual(['broken', 'profile']);
    expect(parseGateResponse('BROKEN: no')?.pass).toBe(true);
    expect(parseGateResponse('BROKEN: no\nPROFILE: maybe')?.pass).toBe(true);
  });
  it('garbled / refusal / empty → null (fail-open)', () => {
    expect(parseGateResponse('I cannot analyze this image')).toBeNull();
    expect(parseGateResponse('')).toBeNull();
    expect(parseGateResponse('BROKEN: maybe')).toBeNull();
  });
});
