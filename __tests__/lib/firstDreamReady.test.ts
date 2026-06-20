/**
 * Locks the client-side first-dream cast-readiness gate (lib/firstDreamReady.ts)
 * — the predicate the onboarding cutoff polls on before kicking the dream off —
 * AND its parity with the server tier-builder, so the two "is this member
 * face-swappable" definitions (different runtimes, can't share code) can't drift.
 */

import { isCastMemberUsable, isCastReadyForKickoff } from '@/lib/firstDreamReady';
import { buildFirstDreamTiers } from '@engine/firstDreamTiers';

describe('isCastMemberUsable', () => {
  it('usable: private storage_path or public http(s) thumb_url', () => {
    expect(isCastMemberUsable({ storage_path: 'u/cast-self.jpg' })).toBe(true);
    expect(isCastMemberUsable({ thumb_url: 'https://x/y.jpg' })).toBe(true);
    expect(isCastMemberUsable({ thumb_url: 'http://x/y.jpg' })).toBe(true);
  });
  it('NOT usable: no source, or a local file:// URI (mid-upload state)', () => {
    expect(isCastMemberUsable({})).toBe(false);
    expect(isCastMemberUsable({ thumb_url: 'file:///tmp/x.jpg' })).toBe(false);
    expect(isCastMemberUsable({ thumb_url: '' })).toBe(false);
  });
});

describe('isCastReadyForKickoff', () => {
  it('EMPTY / undefined cast is ready (scene-only is the intended result)', () => {
    expect(isCastReadyForKickoff([])).toBe(true);
    expect(isCastReadyForKickoff(undefined)).toBe(true);
  });
  it('ready only when EVERY added member is usable', () => {
    expect(isCastReadyForKickoff([{ storage_path: 'a' }, { storage_path: 'b' }])).toBe(true);
    // one member still mid-upload (no storage_path) → NOT ready → cutoff waits
    expect(isCastReadyForKickoff([{ storage_path: 'a' }, {}])).toBe(false);
    expect(isCastReadyForKickoff([{ thumb_url: 'file:///x.jpg' }])).toBe(false);
  });
});

describe('PARITY: client predicate === server tier-builder usability', () => {
  // For every member shape, the client "usable" verdict must match whether the
  // server actually builds a face-swap tier for a cast of that one member.
  const shapes: Array<Record<string, unknown>> = [
    { storage_path: 'u/x.jpg' },
    { thumb_url: 'https://x/y.jpg' },
    { thumb_url: 'http://x/y.jpg' },
    { thumb_url: 'file:///x.jpg' },
    { thumb_url: '' },
    {},
  ];
  it('a member is client-usable iff the server gives it a face-swap tier', () => {
    for (const shape of shapes) {
      const clientUsable = isCastMemberUsable(shape);
      const serverFaceSwap = buildFirstDreamTiers([{ role: 'self', ...shape }]).some(
        (t) => t.name !== 'scene'
      );
      expect({ shape, clientUsable }).toEqual({ shape, clientUsable: serverFaceSwap });
    }
  });
});
