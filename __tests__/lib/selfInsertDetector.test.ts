/**
 * Tests for selfInsertDetector — verifies self-insert detection, role detection, and prompt cleaning.
 */

import { detectSelfInsert } from '@engine/selfInsertDetector';

describe('detectSelfInsert', () => {
  // ── TRUE POSITIVES — should trigger self-insert ─────────────────────

  const truePositives = [
    'put me in the rain',
    'me as a wizard',
    "I'm standing in a forest",
    'myself in space',
    'show me in a castle',
    'selfie at the beach',
    'me sitting on a throne',
    'place me on a mountain',
    'me walking through a city',
    'portrait of me in armor',
    "I'm at the beach",
    "i'm at the beach",
    'I want to fly over the ocean',
    'I look like a warrior',
    "I'd love to be in space",
    "I've always dreamed of castles",
    'my face in a painting',
    'make me a wizard',
    'make me into a superhero',
    'make me look like a knight',
    // Relationship references (also self-insert, but for other roles)
    'my wife at a bbq',
    'my dog at the park',
    'show my friend at the beach',
    'my partner and I at the beach',
    'me and my dog hiking',
  ];

  it.each(truePositives)('detects self-insert: "%s"', (prompt) => {
    const result = detectSelfInsert(prompt);
    expect(result.isSelfInsert).toBe(true);
  });

  // ── FALSE POSITIVES — should NOT trigger self-insert ────────────────

  const falsePositives = [
    'show me a castle',
    'give me a dragon',
    'let me see the ocean',
    'tell me about forests',
    'send me a postcard',
    'a partner dancing in moonlight',
    'dog running through a park',
    'the husband and wife portrait',
  ];

  it.each(falsePositives)('does NOT detect self-insert: "%s"', (prompt) => {
    const result = detectSelfInsert(prompt);
    expect(result.isSelfInsert).toBe(false);
  });

  // ── ROLE DETECTION — which cast members are referenced ──────────────

  describe('referencedRoles', () => {
    it('self-only for plain self-pronouns', () => {
      const result = detectSelfInsert("I'm at the beach");
      expect(result.referencedRoles.has('self')).toBe(true);
      expect(result.referencedRoles.has('plus_one')).toBe(false);
      expect(result.referencedRoles.has('pet')).toBe(false);
    });

    it('"my face" → self (face is not a relationship word)', () => {
      const result = detectSelfInsert('my face in a painting');
      expect(result.referencedRoles.has('self')).toBe(true);
      expect(result.referencedRoles.has('plus_one')).toBe(false);
    });

    it('"my wife at a bbq" → plus_one only, NOT self', () => {
      const result = detectSelfInsert('my wife at a bbq');
      expect(result.referencedRoles.has('plus_one')).toBe(true);
      expect(result.referencedRoles.has('self')).toBe(false);
    });

    it('"my dog at the park" → pet only, NOT self', () => {
      const result = detectSelfInsert('my dog at the park');
      expect(result.referencedRoles.has('pet')).toBe(true);
      expect(result.referencedRoles.has('self')).toBe(false);
    });

    it('"show my friend at the beach" → plus_one only', () => {
      const result = detectSelfInsert('show my friend at the beach');
      expect(result.referencedRoles.has('plus_one')).toBe(true);
      expect(result.referencedRoles.has('self')).toBe(false);
    });

    it('"my wife and I at the beach" → self + plus_one', () => {
      const result = detectSelfInsert('my wife and I at the beach');
      expect(result.referencedRoles.has('self')).toBe(true);
      expect(result.referencedRoles.has('plus_one')).toBe(true);
    });

    it('"me and my dog hiking" → self + pet', () => {
      const result = detectSelfInsert('me and my dog hiking');
      expect(result.referencedRoles.has('self')).toBe(true);
      expect(result.referencedRoles.has('pet')).toBe(true);
    });

    it('"my boyfriend and my cat at sunset" → plus_one + pet, NOT self', () => {
      const result = detectSelfInsert('my boyfriend and my cat at sunset');
      expect(result.referencedRoles.has('plus_one')).toBe(true);
      expect(result.referencedRoles.has('pet')).toBe(true);
      expect(result.referencedRoles.has('self')).toBe(false);
    });

    it('"my wife and I and my dog" → all three', () => {
      const result = detectSelfInsert('my wife and I and my dog');
      expect(result.referencedRoles.has('self')).toBe(true);
      expect(result.referencedRoles.has('plus_one')).toBe(true);
      expect(result.referencedRoles.has('pet')).toBe(true);
    });

    it('empty roles for non-self-insert', () => {
      const result = detectSelfInsert('show me a castle');
      expect(result.referencedRoles.size).toBe(0);
    });

    it('empty roles for bare relationship words without "my"', () => {
      const result = detectSelfInsert('a partner dancing in moonlight');
      expect(result.referencedRoles.size).toBe(0);
    });

    it('"my mom at the garden" → plus_one only', () => {
      const result = detectSelfInsert('my mom at the garden');
      expect(result.referencedRoles.has('plus_one')).toBe(true);
      expect(result.referencedRoles.has('self')).toBe(false);
    });

    it('"my husband as a knight" → plus_one only', () => {
      const result = detectSelfInsert('my husband as a knight');
      expect(result.referencedRoles.has('plus_one')).toBe(true);
      expect(result.referencedRoles.has('self')).toBe(false);
    });
  });

  // ── CLEANED PROMPT ──────────────────────────────────────────────────

  it('strips "put me" from cleaned prompt', () => {
    const result = detectSelfInsert('put me in the rain');
    expect(result.isSelfInsert).toBe(true);
    expect(result.cleanedPrompt).not.toMatch(/\bme\b/i);
    expect(result.cleanedPrompt).toContain('in the rain');
  });

  it('replaces "I\'m" with "a person is"', () => {
    const result = detectSelfInsert("I'm standing in a forest");
    expect(result.isSelfInsert).toBe(true);
    expect(result.cleanedPrompt).toContain('a person is');
    expect(result.cleanedPrompt).not.toMatch(/\bI'm\b/i);
  });

  it('replaces "myself" with "a person"', () => {
    const result = detectSelfInsert('myself in space');
    expect(result.isSelfInsert).toBe(true);
    expect(result.cleanedPrompt).toContain('a person');
    expect(result.cleanedPrompt).not.toMatch(/\bmyself\b/i);
  });

  it('replaces "selfie" with "portrait"', () => {
    const result = detectSelfInsert('selfie at the beach');
    expect(result.isSelfInsert).toBe(true);
    expect(result.cleanedPrompt).toContain('portrait');
    expect(result.cleanedPrompt).not.toMatch(/\bselfie\b/i);
  });

  it('returns original prompt unchanged for false positives', () => {
    const result = detectSelfInsert('show me a castle');
    expect(result.cleanedPrompt).toBe('show me a castle');
  });

  it('cleans "my partner" to "a companion"', () => {
    const result = detectSelfInsert('my partner and I at the beach');
    expect(result.cleanedPrompt).toContain('a companion');
    expect(result.cleanedPrompt).not.toMatch(/\bpartner\b/i);
  });

  it('cleans "my dog" to "a pet"', () => {
    const result = detectSelfInsert('my dog at the park');
    expect(result.cleanedPrompt).toContain('a pet');
    expect(result.cleanedPrompt).not.toMatch(/\bdog\b/i);
  });

  it('cleans "my face" with generic possessive', () => {
    const result = detectSelfInsert('my face in a painting');
    expect(result.cleanedPrompt).not.toMatch(/\bmy\b/i);
    expect(result.cleanedPrompt).toContain('painting');
  });

  it('cleans "I want" to "a person"', () => {
    const result = detectSelfInsert('I want to fly');
    expect(result.cleanedPrompt).not.toMatch(/\bI\b/);
    expect(result.cleanedPrompt).toContain('fly');
  });

  it('returns fallback when cleaned prompt would be empty', () => {
    const result = detectSelfInsert('put me');
    expect(result.isSelfInsert).toBe(true);
    expect(result.cleanedPrompt.length).toBeGreaterThan(0);
  });

  it('does not match "I" inside words like "AI"', () => {
    const result = detectSelfInsert('AI art of a dragon');
    expect(result.isSelfInsert).toBe(false);
  });
});
