/**
 * Home and the browse surfaces (Bots + Explore) have SEPARATE seeds, so a Bots
 * or Explore refresh can never reshuffle the Home feed underneath the user
 * (Kevin 2026-09-26, the "feed pops to a different post" bug).
 */
import { useFeedStore } from '@/store/feed';

describe('feed store seeds', () => {
  beforeEach(() => {
    useFeedStore.setState({ feedSeed: 0.1, browseSeed: 0.2, feedReshuffleEpoch: 0 });
  });

  it('a Bots / Explore re-tap rotates only the browse seed', () => {
    useFeedStore.getState().regenerateBrowseSeed();
    expect(useFeedStore.getState().feedSeed).toBe(0.1);
    expect(useFeedStore.getState().browseSeed).not.toBe(0.2);
  });

  it('a Bots / Explore pull-to-refresh sets only the browse seed', () => {
    useFeedStore.getState().setBrowseSeed(0.7);
    expect(useFeedStore.getState().feedSeed).toBe(0.1);
    expect(useFeedStore.getState().browseSeed).toBe(0.7);
  });

  it('a Home refresh sets only the Home seed', () => {
    useFeedStore.getState().setFeedSeed(0.5);
    expect(useFeedStore.getState().feedSeed).toBe(0.5);
    expect(useFeedStore.getState().browseSeed).toBe(0.2);
    useFeedStore.getState().reshuffleFeed(0.6);
    expect(useFeedStore.getState().feedSeed).toBe(0.6);
    expect(useFeedStore.getState().browseSeed).toBe(0.2);
  });

  it('a full app refresh (Settings / onboarding) rotates both', () => {
    useFeedStore.getState().regenerateSeed();
    expect(useFeedStore.getState().feedSeed).not.toBe(0.1);
    expect(useFeedStore.getState().browseSeed).not.toBe(0.2);
  });
});
