import { selectEligibleAnnouncement, type AnnouncementRow } from '@/lib/announcementEligibility';

// Shaped exactly like the real 'farmbot-launch' row (scripts/announce-farmbot.js)
// so this test directly answers: "will 1.2.0 users get the FarmBot announcement
// correctly, and only a single time?"
const FARMBOT_LAUNCH: AnnouncementRow = {
  id: 'farmbot-launch',
  title: 'Introducing FarmBot 🌾',
  body: 'Meet our newest addition to the neighborhood, FarmBot!',
  image_url: 'https://example.com/hero.jpg',
  cta_label: 'Meet FarmBot',
  cta_route: '/user/754ad892-3e52-41d9-9364-e41fe081812c',
  style: 'sheet',
  audience: 'all',
  min_build: null,
  min_app_version: '1.2.0',
};

const baseOpts = {
  seenIds: new Set<string>(),
  isPro: false,
  isAdmin: false,
  build: 0,
  appVersion: '1.2.0',
};

describe('selectEligibleAnnouncement — FarmBot launch scenarios', () => {
  it('a user on 1.2.0 who has not seen it gets the announcement', () => {
    const result = selectEligibleAnnouncement([FARMBOT_LAUNCH], baseOpts);
    expect(result?.id).toBe('farmbot-launch');
  });

  it('a user still on 1.1.0 does NOT get it (version gate holds)', () => {
    const result = selectEligibleAnnouncement([FARMBOT_LAUNCH], {
      ...baseOpts,
      appVersion: '1.1.0',
    });
    expect(result).toBeNull();
  });

  it('a user on 1.2.0 exactly at the floor gets it (>= not >)', () => {
    const result = selectEligibleAnnouncement([FARMBOT_LAUNCH], {
      ...baseOpts,
      appVersion: '1.2.0',
    });
    expect(result?.id).toBe('farmbot-launch');
  });

  it('a user on a later version (1.3.0) still gets it', () => {
    const result = selectEligibleAnnouncement([FARMBOT_LAUNCH], {
      ...baseOpts,
      appVersion: '1.3.0',
    });
    expect(result?.id).toBe('farmbot-launch');
  });

  it('SHOWS ONLY ONCE: a user who has already seen it never gets it again, even on 1.2.0', () => {
    const result = selectEligibleAnnouncement([FARMBOT_LAUNCH], {
      ...baseOpts,
      seenIds: new Set(['farmbot-launch']),
    });
    expect(result).toBeNull();
  });

  it('the supreme admin previewing can see it regardless of their own build version', () => {
    const result = selectEligibleAnnouncement([FARMBOT_LAUNCH], {
      ...baseOpts,
      isAdmin: true,
      appVersion: '1.1.0', // admin's own dev build, still pre-1.2.0
    });
    expect(result?.id).toBe('farmbot-launch');
  });

  it('the admin also stops seeing it once they too are marked seen', () => {
    const result = selectEligibleAnnouncement([FARMBOT_LAUNCH], {
      ...baseOpts,
      isAdmin: true,
      seenIds: new Set(['farmbot-launch']),
    });
    expect(result).toBeNull();
  });

  it('fails open when the running app version is unreadable (null)', () => {
    const result = selectEligibleAnnouncement([FARMBOT_LAUNCH], { ...baseOpts, appVersion: null });
    expect(result?.id).toBe('farmbot-launch');
  });

  it('a non-sheet (banner) row never surfaces as a takeover candidate', () => {
    const banner: AnnouncementRow = { ...FARMBOT_LAUNCH, style: 'banner' };
    const result = selectEligibleAnnouncement([banner], baseOpts);
    expect(result).toBeNull();
  });

  it('audience=pro excludes a non-pro user even on the right version', () => {
    const proOnly: AnnouncementRow = { ...FARMBOT_LAUNCH, audience: 'pro' };
    const result = selectEligibleAnnouncement([proOnly], { ...baseOpts, isPro: false });
    expect(result).toBeNull();
    const proResult = selectEligibleAnnouncement([proOnly], { ...baseOpts, isPro: true });
    expect(proResult?.id).toBe('farmbot-launch');
  });

  it('min_build (native build number) gates independently of min_app_version', () => {
    const buildGated: AnnouncementRow = {
      ...FARMBOT_LAUNCH,
      min_app_version: null,
      min_build: 100,
    };
    expect(selectEligibleAnnouncement([buildGated], { ...baseOpts, build: 50 })).toBeNull();
    expect(selectEligibleAnnouncement([buildGated], { ...baseOpts, build: 150 })?.id).toBe(
      'farmbot-launch'
    );
  });

  it('an unreadable build number (0) fails open on the min_build gate', () => {
    const buildGated: AnnouncementRow = {
      ...FARMBOT_LAUNCH,
      min_app_version: null,
      min_build: 100,
    };
    const result = selectEligibleAnnouncement([buildGated], { ...baseOpts, build: 0 });
    expect(result?.id).toBe('farmbot-launch');
  });

  it('the highest-priority ELIGIBLE row wins when multiple rows are candidates', () => {
    const older: AnnouncementRow = { ...FARMBOT_LAUNCH, id: 'older-announcement' };
    // Rows arrive pre-sorted by priority desc — FarmBot first, older second.
    const result = selectEligibleAnnouncement([FARMBOT_LAUNCH, older], baseOpts);
    expect(result?.id).toBe('farmbot-launch');
  });

  it('a higher-priority but gated row is skipped in favor of the next eligible one', () => {
    const gatedHigherPriority: AnnouncementRow = {
      ...FARMBOT_LAUNCH,
      id: 'future-feature',
      min_app_version: '9.9.9', // far future, always gated in this test
    };
    const older: AnnouncementRow = { ...FARMBOT_LAUNCH, id: 'older-announcement' };
    const result = selectEligibleAnnouncement([gatedHigherPriority, older], baseOpts);
    expect(result?.id).toBe('older-announcement');
  });
});
