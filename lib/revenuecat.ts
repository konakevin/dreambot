import Purchases, {
  LOG_LEVEL,
  type PurchasesPackage,
  type CustomerInfo,
} from 'react-native-purchases';
import { Platform, Linking } from 'react-native';

/** RevenueCat entitlement identifier for Pro subscription. Must match the
 *  entitlement name configured in the RevenueCat dashboard. */
export const PRO_ENTITLEMENT = 'pro';

/** RevenueCat entitlement identifier for DreamBot Basic. Separate from Pro so
 *  the app grants the right (lighter) perks. Must match the dashboard entitlement. */
export const BASIC_ENTITLEMENT = 'basic';

/** Offering identifier holding ALL subscription packages (Basic + Pro,
 *  monthly + yearly). Renamed from 'pro' → 'subscriptions' (2026-06-11) when
 *  Basic was added — one offering now feeds the whole Free/Basic/Pro paywall.
 *  Must match the offering identifier in the RevenueCat dashboard. */
export const SUBSCRIPTIONS_OFFERING = 'subscriptions';

const RC_IOS_KEY = 'appl_gDwFXEmOsQLWUTUndcldpmruekW';
const RC_ANDROID_KEY = 'YOUR_REVENUECAT_ANDROID_API_KEY';

let configured = false;

/**
 * Call once at app startup after the user is authenticated.
 * Pass the Supabase user ID so RevenueCat links purchases to your user.
 */
export async function configureRevenueCat(userId: string) {
  if (configured) return;

  const key = Platform.OS === 'ios' ? RC_IOS_KEY : RC_ANDROID_KEY;
  if (key.startsWith('YOUR_') || key.startsWith('test_')) {
    if (__DEV__) console.log('[RevenueCat] Skipping — using test key, products not ready yet');
    return;
  }

  Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  Purchases.configure({ apiKey: key, appUserID: userId });
  configured = true;
}

/**
 * Fetch available sparkle packs from RevenueCat.
 * Returns the packages from your "sparkles" offering.
 */
export async function getSparklePackages(): Promise<PurchasesPackage[]> {
  if (!configured) return [];
  const offerings = await Purchases.getOfferings();
  const sparkles = offerings.current ?? offerings.all['sparkle_packs'];
  if (!sparkles) return [];
  return sparkles.availablePackages;
}

/**
 * Purchase a sparkle pack. Returns true on success, false on user cancel.
 * Throws on real errors.
 */
export async function purchaseSparklePackage(pkg: PurchasesPackage): Promise<boolean> {
  try {
    await Purchases.purchasePackage(pkg);
    return true;
  } catch (err: unknown) {
    const rcErr = err as { userCancelled?: boolean };
    if (rcErr.userCancelled) return false;
    throw err;
  }
}

/**
 * Restore previous purchases (required by Apple).
 */
export async function restorePurchases() {
  return Purchases.restorePurchases();
}

/**
 * Fetch all subscription packages (Basic + Pro, monthly + yearly) from the
 * "subscriptions" offering configured in RevenueCat.
 */
export async function getProPackages(): Promise<PurchasesPackage[]> {
  if (!configured) return [];
  const offerings = await Purchases.getOfferings();
  const subs = offerings.all[SUBSCRIPTIONS_OFFERING];
  if (!subs) return [];
  return subs.availablePackages;
}

/**
 * Purchase a Pro subscription package.
 * Returns which entitlement the purchase activated ('pro' | 'basic'), or null
 * on user cancel. Throws on real errors (network, billing failure, etc.).
 *
 * IMPORTANT: a Basic purchase activates the 'basic' entitlement, NOT 'pro' —
 * so we check BOTH. (Checking only 'pro' made Basic purchases look cancelled,
 * which skipped the post-purchase entitlement refresh.)
 */
export async function purchaseProPackage(pkg: PurchasesPackage): Promise<'pro' | 'basic' | null> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    if (customerInfo.entitlements.active[PRO_ENTITLEMENT]) return 'pro';
    if (customerInfo.entitlements.active[BASIC_ENTITLEMENT]) return 'basic';
    return null;
  } catch (err: unknown) {
    const rcErr = err as { userCancelled?: boolean };
    if (rcErr.userCancelled) return null;
    throw err;
  }
}

/**
 * Read the user's current customer info from RevenueCat (cached on-device).
 * Use to check `info.entitlements.active.pro` for live Pro access state —
 * the source of truth between the DB column (set by webhook) and the device.
 */
export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  if (!configured) return null;
  return Purchases.getCustomerInfo();
}

/**
 * Open the native App Store subscription-management sheet. Apple owns the
 * auto-renew toggle — apps CANNOT flip it programmatically (no StoreKit API),
 * so re-enabling auto-renew on a cancelled-but-active sub, or cancelling, both
 * happen here. Used by the Plans "Turn on auto-renew" button + the Settings
 * "Manage subscription" row. No-op until RevenueCat is configured.
 */
export async function openManageSubscriptions(): Promise<void> {
  try {
    if (configured) {
      await Purchases.showManageSubscriptions();
      return;
    }
  } catch {
    // showManageSubscriptions can reject (no window scene, older SDK) — fall
    // through to the direct App Store deep link below.
  }
  // Fallback: the App Store subscriptions page. Works even if RevenueCat isn't
  // configured / the native sheet is unavailable.
  await Linking.openURL('https://apps.apple.com/account/subscriptions').catch(() => {});
}

export interface AutoRenewInfo {
  /** Which paid entitlement is active, or null if none. */
  tier: 'pro' | 'basic' | null;
  /** True = auto-renews; false = cancelled and winding down; null = no active
   *  paid sub (or RC not yet loaded). The "false while still active" case is the
   *  one the Plans/Settings UI must surface a re-enable path for. */
  willRenew: boolean | null;
  /** ISO date the active sub next renews (willRenew) or lapses (cancelled). */
  expiresAt: string | null;
}

/**
 * Live auto-renew state from RevenueCat's CustomerInfo. The client can't read
 * the DB's *_subscription_will_renew (economic, ungranted), so this is the
 * source of truth for the "subscribed but cancelled" UI.
 */
export async function getAutoRenewInfo(): Promise<AutoRenewInfo> {
  const info = await getCustomerInfo();
  const pro = info ? info.entitlements.active[PRO_ENTITLEMENT] : undefined;
  const basic = info ? info.entitlements.active[BASIC_ENTITLEMENT] : undefined;
  const active = pro ?? basic ?? null;
  return {
    tier: pro ? 'pro' : basic ? 'basic' : null,
    willRenew: active ? active.willRenew : null,
    expiresAt: active ? active.expirationDate : null,
  };
}

/**
 * Convenience: returns true if the user currently has the Pro entitlement.
 * Useful at app launch to reconcile with the DB column in case the webhook
 * hasn't fired yet (rare race window after a fresh purchase).
 */
export async function isProActive(): Promise<boolean> {
  const info = await getCustomerInfo();
  return !!info?.entitlements.active[PRO_ENTITLEMENT];
}
