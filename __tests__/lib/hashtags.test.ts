import { splitCaption, isHashtagToken, isMentionToken, normalizeTag } from '../../lib/hashtags';

describe('splitCaption', () => {
  it('captures hashtags as their own parts', () => {
    const parts = splitCaption('flying over the reef #ocean #DreamBot');
    expect(parts).toContain('#ocean');
    expect(parts).toContain('#DreamBot');
    expect(parts.filter(isHashtagToken)).toEqual(['#ocean', '#DreamBot']);
  });

  it('captures mentions as their own parts', () => {
    const parts = splitCaption('with @kev.dreams last night');
    expect(parts.filter(isMentionToken)).toEqual(['@kev.dreams']);
  });

  it('handles a caption with no tokens (single plain part)', () => {
    expect(splitCaption('just a normal caption')).toEqual(['just a normal caption']);
  });

  it('rejoins to the original text (no characters lost)', () => {
    const text = 'a #tag then @user and #another_one done';
    expect(splitCaption(text).join('')).toBe(text);
  });

  it('does not treat a lone # or 1-char tag as a hashtag', () => {
    expect(splitCaption('rated # 1 and #a').some(isHashtagToken)).toBe(false);
  });

  it('caps a hashtag at 30 chars (mirrors the server extractor)', () => {
    const long = '#' + 'x'.repeat(40);
    const tokens = splitCaption(long).filter(isHashtagToken);
    expect(tokens).toEqual(['#' + 'x'.repeat(30)]);
  });

  it('is not stateful across calls (global regex lastIndex)', () => {
    // A /g regex used with .test/.exec is stateful; split is not — guard
    // that two identical calls return identical results.
    const text = '#one two #three';
    expect(splitCaption(text)).toEqual(splitCaption(text));
  });
});

describe('normalizeTag', () => {
  it('strips the leading # and lowercases', () => {
    expect(normalizeTag('#DreamBot')).toBe('dreambot');
    expect(normalizeTag('OCEAN')).toBe('ocean');
    expect(normalizeTag('#already_clean')).toBe('already_clean');
  });
});
