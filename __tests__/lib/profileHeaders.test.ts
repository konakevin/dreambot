import {
  HEADER_ASPECT,
  clampFocal,
  easedScrim,
  focalAfterDrag,
  headerContentPosition,
  headerHeight,
  headerPickerHref,
  sourceKey,
  sourceLabel,
  sourceRpcArgs,
} from '@/lib/profileHeaders';

describe('headerHeight', () => {
  it('is 336pt at the iPhone-14 base width', () => {
    expect(headerHeight(390, 844)).toBe(336);
  });
  it('caps on wide screens so the header never takes over an iPad', () => {
    const h = headerHeight(1024, 1366);
    expect(h).toBeLessThan(1024 * HEADER_ASPECT);
    expect(h).toBe(Math.round(1366 * 0.46));
  });
});

describe('clampFocal', () => {
  it('clamps to 0..100 and defaults non-numbers to the middle', () => {
    expect(clampFocal(-5)).toBe(0);
    expect(clampFocal(140)).toBe(100);
    expect(clampFocal(Number.NaN)).toBe(50);
  });
});

describe('focalAfterDrag', () => {
  // A 768x1344 dream in a 390x336 frame: covers at scale 390/768, so it renders
  // 682.5pt tall and 346.5pt of it is hidden.
  const frame = [390, 336] as const;
  const img = [768, 1344] as const;

  it('does not move without a drag', () => {
    expect(focalAfterDrag(50, 0, ...frame, ...img)).toBe(50);
  });
  it('dragging down reveals the top (focal toward 0)', () => {
    expect(focalAfterDrag(50, 100, ...frame, ...img)).toBeCloseTo(50 - (100 / 346.5) * 100, 5);
  });
  it('dragging up reveals the bottom (focal toward 100)', () => {
    expect(focalAfterDrag(50, -100, ...frame, ...img)).toBeGreaterThan(50);
  });
  it('clamps at the ends', () => {
    expect(focalAfterDrag(50, 10_000, ...frame, ...img)).toBe(0);
    expect(focalAfterDrag(50, -10_000, ...frame, ...img)).toBe(100);
  });
  it('ignores the drag when the image has nothing hidden vertically', () => {
    expect(focalAfterDrag(40, 120, 390, 336, 1600, 900)).toBe(40);
  });
  it('ignores the drag before the image size is known', () => {
    expect(focalAfterDrag(40, 120, 390, 336, 0, 0)).toBe(40);
  });
});

describe('headerContentPosition', () => {
  it('maps a focal point to expo-image contentPosition', () => {
    expect(headerContentPosition(33.4)).toEqual({ top: '33%', left: '50%' });
    expect(headerContentPosition(150)).toEqual({ top: '100%', left: '50%' });
  });
});

describe('easedScrim', () => {
  it('runs from clear to the max alpha, never getting lighter', () => {
    const { colors, locations } = easedScrim(14, 1);
    expect(colors).toHaveLength(15);
    expect(locations[0]).toBe(0);
    expect(locations[locations.length - 1]).toBe(1);
    const alphas = colors.map((c) => Number(c.slice(c.lastIndexOf(',') + 1, -1)));
    expect(alphas[0]).toBe(0);
    expect(alphas[alphas.length - 1]).toBe(1);
    for (let i = 1; i < alphas.length; i++) expect(alphas[i]).toBeGreaterThanOrEqual(alphas[i - 1]);
  });
});

describe('sources', () => {
  it('builds labels, keys and RPC args', () => {
    expect(sourceLabel({ kind: 'me' })).toBe('Random from your dreams');
    expect(sourceLabel({ kind: 'bots' })).toBe('Random from all bots');
    expect(sourceLabel({ kind: 'bot', botId: 'x' }, 'StarBot')).toBe('Random from StarBot');
    expect(sourceKey({ kind: 'bot', botId: 'x' })).toBe('bot:x');
    expect(sourceRpcArgs({ kind: 'bot', botId: 'x' })).toEqual({ p_source: 'bot', p_bot_id: 'x' });
    expect(sourceRpcArgs({ kind: 'me' })).toEqual({ p_source: 'me' });
  });
});

describe('headerPickerHref', () => {
  it('opens own dreams on "You" and bot posts on that bot, URL-encoded', () => {
    expect(headerPickerHref({ uploadId: 'u1', imageUrl: 'https://x/a b.jpg?v=1', own: true })).toBe(
      '/headerPicker?uploadId=u1&imageUrl=https%3A%2F%2Fx%2Fa%20b.jpg%3Fv%3D1&own=1'
    );
    expect(
      headerPickerHref({
        uploadId: 'u2',
        imageUrl: 'i',
        own: false,
        ownerId: 'b1',
        ownerUsername: 'StarBot',
      })
    ).toBe('/headerPicker?uploadId=u2&imageUrl=i&ownerId=b1&ownerUsername=StarBot');
  });
});
