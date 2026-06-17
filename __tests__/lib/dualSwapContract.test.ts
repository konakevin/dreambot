/**
 * dualSwapContract — the shared dual-swap pose/visibility/gender contract that
 * Create (buildDualBrief) + nightly (characterSlotPrompt + fallback) both import.
 * These lock the contract so the per-face-composite pose freedom + gender
 * guarantee can't drift between the two engines.
 */

import {
  DUAL_FACE_LOCK_PHRASE,
  dualPoseRules,
  dualPoseFluxTokens,
  classifyFaceContact,
} from '@engine/dualSwapContract';

// ── classifyFaceContact — only TRUE face contact is flagged ──────────────────

it('flags genuine face-contact verbs as contact (they IoU-fail the crop)', () => {
  for (const p of [
    'kiss me',
    'we are kissing',
    'nuzzling on the beach',
    'cheek to cheek',
    'making out',
  ]) {
    expect(classifyFaceContact(p).kind).toBe('contact');
  }
});

it('treats hug / piggyback / dance / carry / back-to-back as OK now (per-face composite handles them)', () => {
  for (const p of [
    'hugging by the fire',
    'a piggyback ride',
    'carrying her through the door',
    'slow dancing',
    'standing back to back',
    'arm around her shoulder',
  ]) {
    expect(classifyFaceContact(p).kind).toBe('ok');
  }
});

it('empty / no-verb prompts are OK', () => {
  expect(classifyFaceContact('').kind).toBe('ok');
  expect(classifyFaceContact(undefined).kind).toBe('ok');
  expect(classifyFaceContact('on a mountain at sunset').kind).toBe('ok');
});

// ── dualPoseRules — keeps the 3 real constraints, drops the legacy locks ─────

it('dualPoseRules keeps the real constraints and pose freedom', () => {
  const r = dualPoseRules({ leftRole: 'self', rightRole: 'plus_one', sameSex: false });
  expect(r).toMatch(/both faces clearly visible/i);
  expect(r).toMatch(/two distinct heads/i);
  expect(r).toMatch(/POSE IS FREE/);
  expect(r).toMatch(/piggyback/i);
  expect(r).toMatch(/face-bearing decorative objects/i); // detector safety kept
});

it('dualPoseRules omits the obsolete fixed-crop locks', () => {
  const r = dualPoseRules({ leftRole: 'self', rightRole: 'plus_one', sameSex: false });
  expect(r).not.toMatch(/same vertical height/i);
  expect(r).not.toMatch(/LEFT half/i);
  expect(r).not.toMatch(/STATIONARY/i);
  expect(r).not.toMatch(/side by side/i);
});

it('same-sex adds the soft side-lean tiebreaker; mixed-gender omits it', () => {
  const same = dualPoseRules({ leftRole: 'self', rightRole: 'brother', sameSex: true });
  expect(same).toMatch(/same gender/i);
  expect(same).toMatch(/toward the LEFT/);
  expect(same).toMatch(/brother/);

  const mixed = dualPoseRules({ leftRole: 'self', rightRole: 'plus_one', sameSex: false });
  expect(mixed).not.toMatch(/same gender/i);
});

it('softenContact turns a kiss into a near-touch (not a suppression), with the relationship gate', () => {
  const partner = dualPoseRules({
    sameSex: false,
    softenContact: { verb: 'kiss', relationship: 'partner' },
  });
  expect(partner).toMatch(/NEAR-touch/i);
  expect(partner).toMatch(/kept slightly apart/i);
  expect(partner).toMatch(/romantic intimacy/i);

  const platonic = dualPoseRules({
    sameSex: false,
    softenContact: { verb: 'kiss', relationship: 'sibling' },
  });
  expect(platonic).toMatch(/PLATONIC/i);
  expect(platonic).not.toMatch(/romantic intimacy/i);
});

// ── dualPoseFluxTokens — comma phrases for the slot pipeline ──────────────────

it('dualPoseFluxTokens are comma phrases with the real constraints, no legacy locks', () => {
  const t = dualPoseFluxTokens({ sameSex: false });
  expect(t).toMatch(/both faces clearly visible/i);
  expect(t).toMatch(/two distinct heads/i);
  expect(t).toMatch(/natural interaction/i);
  expect(t).not.toMatch(/same vertical height/i);
  expect(t).not.toMatch(/side by side/i);
  expect(t.split(',').length).toBeGreaterThan(3);
});

it('the mandatory face-lock phrase states both-visible + distinct-heads', () => {
  expect(DUAL_FACE_LOCK_PHRASE).toMatch(/both faces clearly visible/i);
  expect(DUAL_FACE_LOCK_PHRASE).toMatch(/distinct heads/i);
  expect(DUAL_FACE_LOCK_PHRASE).not.toMatch(/side by side/i);
});
