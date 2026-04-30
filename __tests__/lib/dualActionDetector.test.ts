/**
 * Tests for dualActionDetector — verifies classification of user prompts as
 * 'ok' (compatible with L/R face swap) vs 'breaking' (face contact /
 * center-stacked, must be reframed by dualBriefBuilder).
 */

import { classifyDualAction } from '@engine/dualActionDetector';

describe('classifyDualAction', () => {
  describe('breaking actions (face contact / center-stacked, must reframe)', () => {
    const breakingPrompts = [
      // face contact
      'me kissing my wife',
      'me and my wife kissing on the beach',
      'kissing in the rain',
      'making out at prom',
      'cheek to cheek dancing',
      'forehead to forehead in love',
      'nuzzling each other',
      'nose to nose romance',
      // full-body embrace
      'hugging my wife at sunset',
      'me hugging my husband',
      'embracing under the stars',
      'cuddling on the couch',
      'snuggling by the fire',
      'wrapped around each other',
      "in each other's arms",
      'spooning at night',
      // carry / piggyback
      'me giving my wife a piggyback',
      'piggyback ride through the forest',
      'me carrying my wife across the threshold',
      // close-coupled dance positions
      'slow dancing at our wedding',
      'waltzing in the ballroom',
      'tangoing at a Buenos Aires milonga',
      // back to back (forces both into profile)
      'standing back to back like superheroes',
    ];
    test.each(breakingPrompts)('classifies "%s" as breaking', (prompt) => {
      const result = classifyDualAction(prompt);
      expect(result.kind).toBe('breaking');
    });
  });

  describe('ok actions (L/R-compatible, pool handles positioning)', () => {
    const okPrompts = [
      // no action verb at all
      'me and my wife on a tropical beach',
      'put us in a magical forest',
      'me with my husband at a haunted castle',
      'in space with my wife',
      // safe action verbs (pool still runs to enforce side-by-side geometry)
      'me and my wife dancing at a wedding',
      'walking on the beach with my wife',
      'sitting at a cafe',
      'laughing together at a comedy show',
      'me and my wife eating sushi',
      'holding hands in the park',
      'riding horses through a meadow',
      'me and my wife sword fighting on a pirate ship',
      'toasting champagne at sunset',
      'high-fiving at the finish line',
      // empty / nullish
      '',
      undefined,
      null,
    ];
    test.each(okPrompts as (string | undefined | null)[])('classifies "%s" as ok', (prompt) => {
      const result = classifyDualAction(prompt);
      expect(result.kind).toBe('ok');
    });
  });

  describe('returns the matched verb so the brief can quote it back', () => {
    it('returns the kiss-family verb', () => {
      const result = classifyDualAction('me kissing my wife');
      expect(result.kind).toBe('breaking');
      if (result.kind === 'breaking') {
        expect(result.verb).toMatch(/kiss/i);
      }
    });
    it('returns the piggyback verb', () => {
      const result = classifyDualAction('me giving my wife a piggyback');
      expect(result.kind).toBe('breaking');
      if (result.kind === 'breaking') {
        expect(result.verb).toMatch(/piggy/i);
      }
    });
  });
});
