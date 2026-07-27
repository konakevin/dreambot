/**
 * Locks the player-facing topic wording (the playful frame Kevin asked for) +
 * the podium superlative/medal maps. If the framing or ranking ever changes, a
 * test breaks here rather than silently shipping "The most cursed sandwich".
 */

import { wordTopic } from '@/components/dreamOff/topicWording';
import { SUPERLATIVE_TO_MEDAL, SUPERLATIVE_LABEL } from '@/types/dreamOff';

describe('wordTopic', () => {
  it('scene topics show the raw base scene, just capitalized (no "Show me" command)', () => {
    expect(wordTopic('a cute taco playing in a mariachi band', 'scene', null)).toBe(
      'A cute taco playing in a mariachi band'
    );
  });
  it('cast single → "You as ___"', () => {
    expect(wordTopic('a battle-worn knight', 'cast', 'single')).toBe('You as a battle-worn knight');
  });
  it('cast couple → "You and your +1 as ___"', () => {
    expect(wordTopic('reality-TV royalty', 'cast', 'couple')).toBe(
      'You and your +1 as reality-TV royalty'
    );
  });
  it('a cast topic with no mode falls back to "You as ___"', () => {
    expect(wordTopic('the villain in every story', 'cast', null)).toBe(
      'You as the villain in every story'
    );
  });
  it('trims surrounding whitespace', () => {
    expect(wordTopic('  a haunted bouncy castle  ', 'scene', null)).toBe('A haunted bouncy castle');
  });
});

describe('superlative maps', () => {
  it('ranks winner/runner_up/dark_horse → gold/silver/bronze', () => {
    expect(SUPERLATIVE_TO_MEDAL.winner).toBe(1);
    expect(SUPERLATIVE_TO_MEDAL.runner_up).toBe(2);
    expect(SUPERLATIVE_TO_MEDAL.dark_horse).toBe(3);
  });
  it('labels each superlative', () => {
    expect(SUPERLATIVE_LABEL.winner).toBe('Winner');
    expect(SUPERLATIVE_LABEL.runner_up).toBe('Runner-up');
    expect(SUPERLATIVE_LABEL.dark_horse).toBe('Dark Horse');
  });
});
