import { detectMention, applyMention } from '@/lib/mentionAutocomplete';

const caret = (text: string, at?: number) => ({ start: at ?? text.length, end: at ?? text.length });

describe('detectMention', () => {
  it('activates on a bare "@" at string start', () => {
    const m = detectMention('@', caret('@'));
    expect(m).toEqual({ active: true, query: '', start: 0 });
  });

  it('activates after a space with a partial handle', () => {
    const m = detectMention('hi @sun', caret('hi @sun'));
    expect(m.active).toBe(true);
    expect(m.query).toBe('sun');
    expect(m.start).toBe(3); // the '@'
  });

  it('activates after a newline', () => {
    const text = 'line1\n@bob';
    const m = detectMention(text, caret(text));
    expect(m.active).toBe(true);
    expect(m.query).toBe('bob');
  });

  it('does NOT activate mid-word (email-like a@b)', () => {
    const m = detectMention('mail a@b', caret('mail a@b'));
    expect(m.active).toBe(false);
  });

  it('does NOT activate once a space follows the handle (completed mention)', () => {
    const text = '@sunnysteph hello';
    const m = detectMention(text, caret(text));
    expect(m.active).toBe(false);
  });

  it('targets the token UNDER THE CARET, not the last "@" in the string', () => {
    // caret sits right after "@sun"; a later "@bob" exists further along
    const text = 'hi @sun and @bob';
    const m = detectMention(text, caret(text, 7)); // after "hi @sun"
    expect(m.active).toBe(true);
    expect(m.query).toBe('sun');
    expect(m.start).toBe(3);
  });

  it('is inactive when there is an active range selection (start !== end)', () => {
    const m = detectMention('hi @sun', { start: 3, end: 7 });
    expect(m.active).toBe(false);
  });

  it('stops at the 30-char username cap', () => {
    const long = '@' + 'a'.repeat(31);
    const m = detectMention(long, caret(long));
    // the leading portion exceeds the cap, so no valid token ends at the caret
    expect(m.active).toBe(false);
  });

  it('ignores an earlier completed mention and reads the fresh one under the caret', () => {
    const text = '@alice thanks @bo';
    const m = detectMention(text, caret(text));
    expect(m.active).toBe(true);
    expect(m.query).toBe('bo');
    expect(m.start).toBe(14);
  });
});

describe('applyMention', () => {
  it('splices "@username " in and returns the caret after it', () => {
    const text = 'hi @sun';
    const res = applyMention(text, caret(text), 'sunnysteph');
    expect(res.text).toBe('hi @sunnysteph ');
    expect(res.cursor).toBe(res.text.length);
  });

  it('completes a bare "@" to a full handle', () => {
    const res = applyMention('@', caret('@'), 'bob');
    expect(res.text).toBe('@bob ');
    expect(res.cursor).toBe(5);
  });

  it('replaces only the token under the caret, preserving trailing text', () => {
    const text = 'hi @sun there';
    const res = applyMention(text, caret(text, 7), 'sunnysteph'); // caret after "@sun"
    expect(res.text).toBe('hi @sunnysteph  there'); // "@sun"→"@sunnysteph ", then " there"
    expect(res.cursor).toBe('hi @sunnysteph '.length);
  });

  it('is a no-op when there is no active mention', () => {
    const text = 'no mention here';
    const res = applyMention(text, caret(text), 'bob');
    expect(res.text).toBe(text);
    expect(res.cursor).toBe(text.length);
  });
});
