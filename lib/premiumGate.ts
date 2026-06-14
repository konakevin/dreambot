/**
 * premiumGate — the single, consistent "you need sparkles / a subscription to do
 * this" gate, callable from anywhere (hook or plain callback) like showAlert.
 *
 * Every monetization dead-end in the app routes through ONE branded bottom-sheet
 * (components/PremiumGateSheet.tsx) so the copy, CTA, and destination are
 * consistent and always GUIDE the user to the right flow:
 *   - sparkles        → /sparkleStore   ("Get Sparkles")
 *   - hd_premium      → /subscribe      (free user wants HD; Basic + Pro unlock it)
 *   - hd_cap          → upgrade / inform (paid user hit their monthly HD cap)
 *   - nightly_premium → /subscribe      (free/lapsed user; nightly dreams are paid)
 *
 * "Premium" is the umbrella term for the paid tiers, because BOTH Basic and Pro
 * unlock the subscription perks (HD + nightly) — calling it "Pro" is inaccurate.
 *
 * The content map (gateContent) is a pure function so it's unit-tested directly.
 */

export type GateRoute = '/sparkleStore' | '/subscribe';

export type GateReason =
  | { kind: 'sparkles'; needed: number; balance: number }
  | { kind: 'hd_premium' }
  | { kind: 'hd_cap'; cap: number; resetsOn?: string; tier: 'basic' | 'pro' }
  | { kind: 'nightly_premium' };

export interface GateButton {
  label: string;
  /** Navigate here on press; absent → just dismiss. */
  route?: GateRoute;
  variant: 'primary' | 'secondary';
}

export interface GateContent {
  /** Ionicons name for the header glyph. */
  icon: string;
  title: string;
  body: string;
  /** Sparkle-balance context (sparkles reason only) — shows have-vs-need. */
  balance?: { have: number; need: number };
  /** Primary button first. */
  buttons: GateButton[];
}

const sparklesWord = (n: number) => (n === 1 ? 'sparkle' : 'sparkles');

/** Pure reason → presentation mapping. */
export function gateContent(reason: GateReason): GateContent {
  switch (reason.kind) {
    case 'sparkles':
      return {
        icon: 'sparkles',
        title: 'Not enough sparkles',
        body: `This dream costs ${reason.needed} ${sparklesWord(reason.needed)}. You have ${reason.balance}.`,
        balance: { have: reason.balance, need: reason.needed },
        buttons: [
          { label: 'Get Sparkles', route: '/sparkleStore', variant: 'primary' },
          { label: 'Maybe later', variant: 'secondary' },
        ],
      };
    case 'hd_premium':
      return {
        icon: 'arrow-down-circle',
        title: 'HD downloads are Premium',
        body: 'Save full-resolution, watermark-free images, included with Basic and Pro.',
        buttons: [
          { label: 'See Plans', route: '/subscribe', variant: 'primary' },
          { label: 'Not now', variant: 'secondary' },
        ],
      };
    case 'hd_cap':
      return {
        icon: 'image',
        title: 'Monthly HD limit reached',
        body:
          `You've used all ${reason.cap} of your HD downloads this month.` +
          (reason.resetsOn ? ` Resets ${reason.resetsOn}.` : ''),
        // Basic can upgrade to Pro for a higher cap; Pro is already maxed → just inform.
        buttons:
          reason.tier === 'basic'
            ? [
                { label: 'Upgrade to Pro', route: '/subscribe', variant: 'primary' },
                { label: 'Got it', variant: 'secondary' },
              ]
            : [{ label: 'Got it', variant: 'primary' }],
      };
    case 'nightly_premium':
      return {
        icon: 'moon',
        title: 'Nightly dreams are Premium',
        body: 'Get a personalized dream every morning, included with Basic and Pro.',
        buttons: [
          { label: 'See Plans', route: '/subscribe', variant: 'primary' },
          { label: 'Not now', variant: 'secondary' },
        ],
      };
  }
}

// ── Imperative global API (mirrors components/CustomAlert showAlert) ──────────
let _show: ((reason: GateReason) => void) | null = null;

/** Registered by <PremiumGateProvider> at app root. */
export function registerPremiumGate(fn: ((reason: GateReason) => void) | null): void {
  _show = fn;
}

/** Open the premium gate from anywhere. No-op until the provider mounts. */
export function showPremiumGate(reason: GateReason): void {
  if (_show) _show(reason);
}
