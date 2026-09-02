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

  // ── COUPLE CONSTRUCTION — "me and my/the wife" hardened against a garbled
  //    "and" (an / nd / 'n / n / & / +). Root cause 2026-07-10: "show me an my
  //    wife at the beach" hit the imperative filter ("an" is an article, like
  //    "show me an apple"), silently DROPPED self, and rendered a SOLO of the
  //    partner — then that couple-coded solo render broke the single face swap.
  //    These lock the fix: a garbled connector must never write the user out of
  //    their own couple dream (either word order), while the genuine imperative
  //    "show me a photo of my wife" must STAY a solo of the partner.
  describe('couple construction (garbled-"and" hardening)', () => {
    const rolesOf = (p: string) => [...detectSelfInsert(p).referencedRoles].sort();

    // Every connector variant, both word orders → the user + their partner.
    const couples = [
      'me and my wife at the beach', // canonical (still works)
      'show me and my wife at the beach',
      'show me an my wife at the beach', // the exact reported bug
      'me an my wife at the beach',
      'me an the wife at the beach',
      'me and the wife',
      "me 'n the wife at the beach",
      'me ’n the wife', // curly apostrophe
      'me n the wife at sunset',
      'me & my wife',
      'me + my wife',
      'me nd my wife',
      'me an my husband',
      'me and our daughter',
      'me n my girlfriend downtown',
      'me & the boyfriend on a rooftop',
      'me an my beautiful wife', // one descriptor
      'me and the absolutely lovely wife', // two descriptors
      'a photo of me an my wife on a boat', // embedded
      'come fly with me and my wife',
      'ME AN MY WIFE AT THE BEACH', // case-insensitive
      'me at the beach with my wife', // distributed (via existing rules)
      // reverse order
      'the wife and me at the beach',
      'my wife an me at the beach',
      'my husband & me',
      'our daughter n me at the park',
    ];
    it.each(couples)('casts BOTH the user and partner: "%s"', (p) => {
      expect(rolesOf(p)).toEqual(['plus_one', 'self']);
    });

    // The whole point: the typo must resolve to the SAME two-person cast as the
    // correctly-spelled version — never a solo.
    it('a garbled connector yields the identical cast to "and"', () => {
      const canonical = rolesOf('me and my wife at the beach');
      for (const p of [
        'me an my wife at the beach',
        'me nd my wife at the beach',
        "me 'n my wife at the beach",
        'me & my wife at the beach',
      ]) {
        expect(rolesOf(p)).toEqual(canonical);
      }
    });

    // Couple + pet → all three roles.
    it.each(['me and my wife and my dog at the park', 'me an the wife with my cat'])(
      'couple + pet → self + plus_one + pet: "%s"',
      (p) => {
        expect(rolesOf(p)).toEqual(['pet', 'plus_one', 'self']);
      }
    );

    // ── FALSE POSITIVES — the connector guard must NOT over-fire ──
    // "show me a photo of my wife" is an imperative ABOUT the partner → a solo
    // of the wife (plus_one), NOT the user. "a" is not a connector, so the
    // couple rule stays silent and the render remains a solo of the partner.
    it('"show me a photo of my wife" stays plus_one only (imperative, not couple)', () => {
      expect(rolesOf('show me a photo of my wife')).toEqual(['plus_one']);
    });

    it.each([
      'show me an apple', // an + noun, not a relationship
      'show me an hour with the dragons',
      'give me a break',
      'the wife at the beach', // standalone "the wife" is intentionally NOT cast
    ])('does NOT invent a partner: "%s"', (p) => {
      expect(rolesOf(p)).not.toContain('plus_one');
    });

    // Words that merely CONTAIN "me" must not trigger the couple rule.
    it('"men and my wife dancing" → plus_one only (no false self from "men")', () => {
      expect(rolesOf('men and my wife dancing')).toEqual(['plus_one']);
    });
    it('"someone and my wife" → plus_one only (no false self)', () => {
      expect(rolesOf('someone and my wife')).toEqual(['plus_one']);
    });

    // A PET in the couple slot is a pet, never a partner.
    it('"me and my dog" → self + pet, never plus_one', () => {
      expect(rolesOf('me and my dog')).toEqual(['pet', 'self']);
    });
    it('"my dog and me hiking" → self + pet, never plus_one', () => {
      expect(rolesOf('my dog and me hiking')).toEqual(['pet', 'self']);
    });

    // Config-driven relationship words flow into the couple rule too.
    it('honors custom relationshipWords in the couple rule', () => {
      const roles = [
        ...detectSelfInsert('me an my sidekick on a quest', {
          relationshipWords: 'sidekick|henchman',
        }).referencedRoles,
      ].sort();
      expect(roles).toEqual(['plus_one', 'self']);
    });

    // A non-relationship noun after the connector must not fabricate a partner.
    it('"me and a castle" → self only (no partner)', () => {
      expect(rolesOf('me and a castle')).toEqual(['self']);
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

  // 2026-09-02 prompt-fidelity fix: the species word is KEPT, never erased to a
  // generic "pet". A user with NO pet cast member used to lose the species
  // entirely ("cuddling my fluffy cat" → "a fluffy pet" → no cat rendered on any
  // dream-art medium). Only the possessive is neutralized.
  it('cleans "my dog" to "a dog" (species preserved, possessive removed)', () => {
    const result = detectSelfInsert('my dog at the park');
    expect(result.cleanedPrompt).toContain('a dog');
    expect(result.cleanedPrompt).not.toMatch(/\bmy\b/i);
  });

  it('keeps the descriptor AND species: "my fluffy cat" → "a fluffy cat"', () => {
    const result = detectSelfInsert('me on the couch cuddling my fluffy cat');
    expect(result.cleanedPrompt).toContain('a fluffy cat');
    expect(result.cleanedPrompt).not.toMatch(/\bpet\b/i);
    expect(result.cleanedPrompt).not.toMatch(/\bmy\b/i);
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
