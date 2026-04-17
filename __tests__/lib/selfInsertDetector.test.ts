/**
 * Tests for selfInsertDetector — verifies self-insert detection and prompt cleaning.
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
  ];

  it.each(falsePositives)('does NOT detect self-insert: "%s"', (prompt) => {
    const result = detectSelfInsert(prompt);
    expect(result.isSelfInsert).toBe(false);
  });

  // ── CLEANED PROMPT — self-references stripped ───────────────────────

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

  it('returns fallback when cleaned prompt would be empty', () => {
    const result = detectSelfInsert('put me');
    expect(result.isSelfInsert).toBe(true);
    expect(result.cleanedPrompt.length).toBeGreaterThan(0);
  });
});
