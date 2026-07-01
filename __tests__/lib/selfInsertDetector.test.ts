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
    'my hair flowing in the wind',
    'make me a wizard',
    'make me into a superhero',
    'make me look like a knight',
    // Relationship references (also self-insert, but for other roles)
    'my wife at a bbq',
    'my dog at the park',
    'show my friend at the beach',
    'my partner and I at the beach',
    'me and my dog hiking',
    // Standalone plus-one jargon (no "my" required — the app's own term)
    'me and +1 at the beach',
    'plus one on a rooftop in tokyo',
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
    // Generic "my [object]" possessives are NOT self-inserts (2026-07-01 —
    // the old catch-all cast the user for these, and even for a bare "My"
    // mid-typing, which made the Create screen's live face lamp look broken)
    'My',
    'My annoying car in the sun',
    'my car parked outside a diner',
    'my childhood home in autumn',
    // "mine" the noun is scenery, not the user
    'a diamond mine at dusk',
    'an abandoned mine shaft full of crystals',
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

    // Descriptor words between "my" and the noun (2026-07-01: "my sexy wife
    // in hawaii" detected NOTHING — the pattern required the noun immediately
    // after "my").
    it('"my sexy wife in hawaii" → plus_one only', () => {
      const result = detectSelfInsert('my sexy wife in hawaii');
      expect(result.referencedRoles.has('plus_one')).toBe(true);
      expect(result.referencedRoles.has('self')).toBe(false);
    });

    it('"my absolutely gorgeous girlfriend at sunset" → plus_one only', () => {
      const result = detectSelfInsert('my absolutely gorgeous girlfriend at sunset');
      expect(result.referencedRoles.has('plus_one')).toBe(true);
      expect(result.referencedRoles.has('self')).toBe(false);
    });

    it('"my fluffy dog on a surfboard" → pet only', () => {
      const result = detectSelfInsert('my fluffy dog on a surfboard');
      expect(result.referencedRoles.has('pet')).toBe(true);
      expect(result.referencedRoles.has('self')).toBe(false);
    });

    it('"my beautiful long hair flowing" → self (descriptored self-part)', () => {
      const result = detectSelfInsert('my beautiful long hair flowing');
      expect(result.referencedRoles.has('self')).toBe(true);
    });

    // ── "plus one" / "+1" — the app's OWN term for the second cast member.
    //    Regression: these used to fall through MY_SELF and cast SELF instead.
    it.each([
      'show my plus one in hawaii',
      'my plus-one at the beach',
      'my +1 in paris',
      'my plus 1 dancing',
      'my significant other at sunset',
    ])('"%s" → plus_one only, NOT self', (prompt) => {
      const result = detectSelfInsert(prompt);
      expect(result.referencedRoles.has('plus_one')).toBe(true);
      expect(result.referencedRoles.has('self')).toBe(false);
    });

    it('"my plus one and I in tokyo" → self + plus_one', () => {
      const result = detectSelfInsert('my plus one and I in tokyo');
      expect(result.referencedRoles.has('self')).toBe(true);
      expect(result.referencedRoles.has('plus_one')).toBe(true);
    });

    it('"me and +1 at the beach" → self + plus_one (standalone +1, no "my")', () => {
      const result = detectSelfInsert('me and +1 at the beach');
      expect(result.referencedRoles.has('self')).toBe(true);
      expect(result.referencedRoles.has('plus_one')).toBe(true);
    });

    it('"5+1 dragons" does NOT read the +1 as a plus-one', () => {
      const result = detectSelfInsert('5+1 dragons flying in formation');
      expect(result.referencedRoles.has('plus_one')).toBe(false);
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

  it('cleans a standalone "+1" to "a companion" (no raw token leaks to the model)', () => {
    const result = detectSelfInsert('me and +1 at the beach');
    expect(result.cleanedPrompt).toContain('a companion');
    expect(result.cleanedPrompt).not.toContain('+1');
  });

  it('keeps the descriptor when cleaning "my sexy wife" → "a sexy companion"', () => {
    const result = detectSelfInsert('my sexy wife in hawaii');
    expect(result.cleanedPrompt).toContain('a sexy companion');
    expect(result.cleanedPrompt).not.toMatch(/\bwife\b/i);
    expect(result.cleanedPrompt).toContain('hawaii');
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

  // ── ADMIN OVERRIDES (engine_config word lists / self-ref regex) ──────
  describe('live-config overrides', () => {
    it('custom relationshipWords detects a term not in the default list', () => {
      const result = detectSelfInsert('my study buddy at the library', {
        relationshipWords: 'study buddy|workmate',
      });
      expect(result.referencedRoles.has('plus_one')).toBe(true);
      expect(result.referencedRoles.has('self')).toBe(false);
    });

    it('custom selfRefRegex overrides the pronoun matcher', () => {
      const result = detectSelfInsert('yours truly on a mountain', {
        selfRefRegex: 'yours truly',
      });
      expect(result.referencedRoles.has('self')).toBe(true);
    });

    it('invalid selfRefRegex falls back to the built-in pronouns (no throw)', () => {
      const result = detectSelfInsert("I'm in a forest", { selfRefRegex: '(' });
      expect(result.referencedRoles.has('self')).toBe(true);
    });
  });
});
