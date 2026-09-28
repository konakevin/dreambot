import {
  parseVersion,
  compareVersions,
  isUpdateRequired,
  isUpdateAvailable,
} from '@/lib/appVersion';

describe('parseVersion', () => {
  it('parses dotted digit runs', () => {
    expect(parseVersion('1.2.3')).toEqual([1, 2, 3]);
    expect(parseVersion('10.0')).toEqual([10, 0]);
    expect(parseVersion('2')).toEqual([2]);
    expect(parseVersion(' 1.0.0 ')).toEqual([1, 0, 0]);
  });
  it('returns null for non-numeric / malformed / missing', () => {
    expect(parseVersion('')).toBeNull();
    expect(parseVersion('abc')).toBeNull();
    expect(parseVersion('1.2-beta')).toBeNull();
    expect(parseVersion('1..2')).toBeNull();
    expect(parseVersion('v1.0.0')).toBeNull();
    expect(parseVersion(null)).toBeNull();
    expect(parseVersion(undefined)).toBeNull();
  });
});

describe('compareVersions', () => {
  it('orders versions', () => {
    expect(compareVersions('1.0.0', '1.0.1')).toBe(-1);
    expect(compareVersions('1.2.0', '1.1.9')).toBe(1);
    expect(compareVersions('2.0.0', '1.9.9')).toBe(1);
    expect(compareVersions('1.0.0', '1.0.0')).toBe(0);
  });

  it('compares each part as a number, not as text (1.10.0 is newer than 1.9.0)', () => {
    // 1.10.0 (2026-09-27) is the first two-digit minor. As text '1.10.0' < '1.9.0', which
    // would hard-wall 1.10.0 users behind a 1.9.0 floor and never nudge 1.9.0 users.
    expect(compareVersions('1.10.0', '1.9.0')).toBe(1);
    expect(compareVersions('1.9.0', '1.10.0')).toBe(-1);
    expect(isUpdateRequired('1.10.0', '1.9.0')).toBe(false);
    expect(isUpdateAvailable('1.9.0', '1.10.0')).toBe(true);
  });
  it('treats missing trailing parts as zero', () => {
    expect(compareVersions('1.2', '1.2.0')).toBe(0);
    expect(compareVersions('1.2.1', '1.2')).toBe(1);
    expect(compareVersions('1.2', '1.2.1')).toBe(-1);
  });
  it('returns null if either side is unparseable', () => {
    expect(compareVersions('1.0.0', 'oops')).toBeNull();
    expect(compareVersions(null, '1.0.0')).toBeNull();
    expect(compareVersions('1.0.0', null)).toBeNull();
  });
});

describe('isUpdateRequired (hard gate, fail-open)', () => {
  it('gates only when strictly below the minimum', () => {
    expect(isUpdateRequired('1.0.0', '1.2.0')).toBe(true);
    expect(isUpdateRequired('1.2.0', '1.2.0')).toBe(false);
    expect(isUpdateRequired('1.3.0', '1.2.0')).toBe(false);
  });
  it('never gates on missing/blank/malformed config (fail open)', () => {
    expect(isUpdateRequired('1.0.0', null)).toBe(false);
    expect(isUpdateRequired('1.0.0', undefined)).toBe(false);
    expect(isUpdateRequired('1.0.0', '')).toBe(false);
    expect(isUpdateRequired('1.0.0', 'garbage')).toBe(false);
    expect(isUpdateRequired(null, '1.2.0')).toBe(false);
  });
});

describe('isUpdateAvailable (soft nudge, fail-open)', () => {
  it('nudges only when strictly below latest', () => {
    expect(isUpdateAvailable('1.0.0', '1.1.0')).toBe(true);
    expect(isUpdateAvailable('1.1.0', '1.1.0')).toBe(false);
    expect(isUpdateAvailable('1.2.0', '1.1.0')).toBe(false);
  });
  it('never nudges on missing/malformed config', () => {
    expect(isUpdateAvailable('1.0.0', null)).toBe(false);
    expect(isUpdateAvailable('1.0.0', '')).toBe(false);
    expect(isUpdateAvailable(null, '1.1.0')).toBe(false);
  });
});
