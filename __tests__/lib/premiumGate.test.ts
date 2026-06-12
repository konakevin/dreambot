/**
 * Behavioral tests for the unified premium gate (lib/premiumGate.ts) — the single
 * source of truth for every "you need sparkles / a subscription" moment. Locks the
 * copy, CTA labels, and navigation destinations so every monetization dead-end
 * GUIDES the user to the right flow.
 */

import {
  gateContent,
  showPremiumGate,
  registerPremiumGate,
  type GateReason,
} from '@/lib/premiumGate';

describe('gateContent — sparkles', () => {
  it('routes the primary CTA to the sparkle store with the cost + balance', () => {
    const c = gateContent({ kind: 'sparkles', needed: 3, balance: 1 });
    expect(c.title).toBe('Not enough sparkles');
    expect(c.body).toContain('3 sparkles');
    expect(c.body).toContain('you have 1');
    expect(c.balance).toEqual({ have: 1, need: 3 });
    expect(c.buttons[0]).toEqual({
      label: 'Get Sparkles',
      route: '/sparkleStore',
      variant: 'primary',
    });
    // secondary just dismisses (no route)
    expect(c.buttons[1].route).toBeUndefined();
  });

  it('pluralizes correctly for a 1-sparkle cost', () => {
    const c = gateContent({ kind: 'sparkles', needed: 1, balance: 0 });
    expect(c.body).toContain('1 sparkle —');
    expect(c.body).not.toContain('1 sparkles');
  });
});

describe('gateContent — subscription gates route to /subscribe and say "Premium" (not "Pro")', () => {
  it('hd_premium', () => {
    const c = gateContent({ kind: 'hd_premium' });
    expect(c.title).toBe('HD downloads are Premium');
    expect(c.body).toContain('Basic and Pro');
    expect(c.buttons[0]).toEqual({ label: 'See Plans', route: '/subscribe', variant: 'primary' });
  });

  it('nightly_premium', () => {
    const c = gateContent({ kind: 'nightly_premium' });
    expect(c.title).toBe('Nightly dreams are Premium');
    expect(c.buttons[0]).toEqual({ label: 'See Plans', route: '/subscribe', variant: 'primary' });
  });

  it('never calls a subscription perk "Pro-only" (both tiers unlock it)', () => {
    for (const r of [{ kind: 'hd_premium' }, { kind: 'nightly_premium' }] as GateReason[]) {
      expect(gateContent(r).title).not.toMatch(/Pro\b/);
    }
  });
});

describe('gateContent — hd_cap (a paying user hit their monthly cap)', () => {
  it('Basic offers an upgrade to Pro for a higher cap', () => {
    const c = gateContent({ kind: 'hd_cap', cap: 20, resetsOn: 'July 1', tier: 'basic' });
    expect(c.title).toBe('Monthly HD limit reached');
    expect(c.body).toContain('all 20');
    expect(c.body).toContain('Resets July 1.');
    expect(c.buttons[0]).toEqual({
      label: 'Upgrade to Pro',
      route: '/subscribe',
      variant: 'primary',
    });
    expect(c.buttons[1].label).toBe('Got it');
  });

  it('Pro is already maxed → just informs, no upsell', () => {
    const c = gateContent({ kind: 'hd_cap', cap: 100, resetsOn: 'July 1', tier: 'pro' });
    expect(c.buttons).toHaveLength(1);
    expect(c.buttons[0]).toEqual({ label: 'Got it', variant: 'primary' });
    expect(c.buttons[0].route).toBeUndefined();
  });

  it('omits the reset clause when no date is known', () => {
    const c = gateContent({ kind: 'hd_cap', cap: 100, tier: 'pro' });
    expect(c.body).not.toContain('Resets');
  });
});

describe('imperative showPremiumGate', () => {
  afterEach(() => registerPremiumGate(null));

  it('forwards the reason to the registered handler', () => {
    const calls: GateReason[] = [];
    registerPremiumGate((r) => calls.push(r));
    showPremiumGate({ kind: 'hd_premium' });
    expect(calls).toEqual([{ kind: 'hd_premium' }]);
  });

  it('is a no-op (no throw) before a provider registers', () => {
    registerPremiumGate(null);
    expect(() => showPremiumGate({ kind: 'nightly_premium' })).not.toThrow();
  });
});
