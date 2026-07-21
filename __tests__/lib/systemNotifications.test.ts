import { isDreamBotSystemNotification } from '@/lib/systemNotifications';

describe('isDreamBotSystemNotification — the "from DreamBot" concept', () => {
  it('trial/subscription expiry reminders are system (any subtype)', () => {
    expect(isDreamBotSystemNotification('trial_reminder', '3day')).toBe(true);
    expect(isDreamBotSystemNotification('trial_reminder', 'ended')).toBe(true);
    expect(isDreamBotSystemNotification('pro_reminder', 'paid_last_night')).toBe(true);
    expect(isDreamBotSystemNotification('basic_reminder', 'basic_3day')).toBe(true);
    expect(isDreamBotSystemNotification('trial_reminder', null)).toBe(true);
  });

  it('NIGHTLY dreams are system, Create-screen dreams are NOT', () => {
    // Nightly auto-dream (subtype null or nightly) → from DreamBot.
    expect(isDreamBotSystemNotification('dream_generated', null)).toBe(true);
    expect(isDreamBotSystemNotification('dream_generated', 'nightly')).toBe(true);
    // Create-screen dream → the user made it, keep their avatar.
    expect(isDreamBotSystemNotification('dream_generated', 'manual')).toBe(false);
  });

  it('social notifications from other humans are NOT system', () => {
    expect(isDreamBotSystemNotification('post_like', null)).toBe(false);
    expect(isDreamBotSystemNotification('post_comment', null)).toBe(false);
    expect(isDreamBotSystemNotification('follow_request', null)).toBe(false);
    expect(isDreamBotSystemNotification('sparkle_gift', 'received')).toBe(false);
    expect(isDreamBotSystemNotification('post_share', null)).toBe(false);
  });
});
