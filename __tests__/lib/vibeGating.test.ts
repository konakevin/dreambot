import { vibeAllowedInSegment } from '@/lib/vibeGating';

describe('vibeAllowedInSegment', () => {
  it('offers ungated vibes (no client_meta / no medium_segment) in BOTH segments', () => {
    expect(vibeAllowedInSegment(null, 'face')).toBe(true);
    expect(vibeAllowedInSegment(undefined, 'art')).toBe(true);
    expect(vibeAllowedInSegment({}, 'face')).toBe(true);
    expect(vibeAllowedInSegment({ restyle_fragment: 'x' }, 'art')).toBe(true);
  });

  it("treats medium_segment:'all' as everywhere", () => {
    expect(vibeAllowedInSegment({ medium_segment: 'all' }, 'face')).toBe(true);
    expect(vibeAllowedInSegment({ medium_segment: 'all' }, 'art')).toBe(true);
  });

  it('locks an art-only vibe (Kawaii) to Dream Art', () => {
    expect(vibeAllowedInSegment({ medium_segment: 'art' }, 'art')).toBe(true);
    expect(vibeAllowedInSegment({ medium_segment: 'art' }, 'face')).toBe(false);
  });

  it('locks a face-only vibe to Real Face', () => {
    expect(vibeAllowedInSegment({ medium_segment: 'face' }, 'face')).toBe(true);
    expect(vibeAllowedInSegment({ medium_segment: 'face' }, 'art')).toBe(false);
  });

  it('ignores a non-string medium_segment (fails open to everywhere)', () => {
    expect(vibeAllowedInSegment({ medium_segment: 123 }, 'face')).toBe(true);
    expect(vibeAllowedInSegment({ medium_segment: null }, 'art')).toBe(true);
  });
});
