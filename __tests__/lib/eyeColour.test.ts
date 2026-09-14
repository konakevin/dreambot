/**
 * EYE COLOUR IN THE POSITION-1 LOCK (2026-09-14).
 *
 * Eye colour was dropped from the prompt alongside face shape, on the reasoning that it "gets face-swapped away
 * anyway". Half of that is wrong: the swap refines the FACE but does not repaint the iris, so with nothing in the
 * prompt Flux picks — and its default for a dark-haired woman is brown. Kevin's wife is hazel-green and rendered
 * brown most nights; 8 of 8 recent dual prompts carried no eye colour at all.
 *
 * Same shape as the skin-tone fix: a trait the swap does not restore has to be stated. It goes ONLY in the
 * position-1 lock, beside the hair and senior echoes, never in the descriptive block — that block is where the
 * "Disney-princess / stock-photo" pull the original note worried about actually comes from.
 */
import { extractEyeColor } from '@engine/characterSlotPrompt';

describe('extractEyeColor', () => {
  it('reads the real cast summaries', () => {
    expect(
      extractEyeColor(
        'dark brown hair with caramel highlights, loose wavy cut, warm golden tan skin, early-to-mid 40s, average build, hazel-green eyes.'
      )
    ).toBe('hazel-green');
    expect(
      extractEyeColor(
        'brown hair swept back, short trimmed chestnut beard, warm medium skin, early-to-mid 40s, average build, brown eyes.'
      )
    ).toBe('brown');
    expect(
      extractEyeColor(
        'white hair swept back from forehead, clean-shaven, fair skin, mid-70s, blue eyes.'
      )
    ).toBe('blue');
  });

  it('handles compound colours without mangling them', () => {
    for (const [s, want] of [
      ['warm hazel-brown eyes', 'hazel-brown'],
      ['striking blue-green eyes', 'blue-green'],
      ['pale blue grey eyes', 'blue-grey'],
      ['deep amber eyes', 'amber'],
    ] as const) {
      expect(extractEyeColor(`average build, ${s}`)).toBe(want);
    }
  });

  it('only reads the clause that mentions eyes — hair colour must not leak in', () => {
    // "brown hair ... green eyes" must resolve GREEN, not brown.
    expect(extractEyeColor('dark brown hair, fair skin, green eyes')).toBe('green');
    expect(extractEyeColor('auburn hair, average build, blue eyes')).toBe('blue');
  });

  it('never invents a colour when the summary is silent', () => {
    expect(extractEyeColor('brown hair, fair skin, average build')).toBeNull();
    expect(extractEyeColor('tired eyes')).toBeNull();
    expect(extractEyeColor('')).toBeNull();
    expect(extractEyeColor(null)).toBeNull();
    expect(extractEyeColor(undefined)).toBeNull();
  });
});
