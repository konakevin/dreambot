/**
 * Subscribe screen — the Free / Basic / Pro paywall.
 *
 * One offering ("subscriptions") feeds this screen with all four packages
 * (Basic + Pro × monthly + yearly). The user picks a billing period, then a
 * plan card; the purchase routes through purchaseProPackage() (any package).
 * The revenuecat-webhook authoritatively flips the entitlement + grants the
 * tier's sparkle bundle — this screen just kicks off StoreKit + refreshes state.
 *
 * Basic = nightly dreams + a light sparkle/HD allowance ($4.99/mo). Pro =
 * everything bigger ($9.99/mo). Replaces the old single-tier proStore screen.
 */

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import * as Haptics from 'expo-haptics';
import { type PurchasesPackage } from 'react-native-purchases';
import { ScreenLayout } from '@/components/ScreenLayout';
import { Toast } from '@/components/Toast';
import { colors } from '@/constants/theme';
import { PRO_PERKS, PRO_TIERS, type ProPlanTier } from '@/constants/proPlan';
import { BASIC_PERKS, BASIC_TIERS } from '@/constants/basicPlan';
import { useProPackages, usePurchasePro, useRestorePurchases } from '@/hooks/useSparkles';
import { useAuthStore } from '@/store/auth';
import { trackProStoreOpened, trackProSubscribeTapped } from '@/lib/analytics';
import { verticalScale, fontScale } from '@/lib/responsive';

type Period = 'month' | 'year';

// The DreamBot logo gradient (purple→pink→teal) — same as the 'DreamBot'
// wordmark on the login/splash screen (app/(auth)/index.tsx).
const BRAND_GRADIENT: [string, string, string] = ['#A78BFA', '#F9A8D4', '#5EEAD4'];

interface Plan {
  key: 'basic' | 'pro';
  name: string;
  tiers: ProPlanTier[];
  perks: readonly { icon: string; title: string; sub: string }[];
  highlight: boolean;
  badge?: string;
  /** Dreamy tier motif (moon for Basic's nightly dream, sparkles for Pro). */
  icon: keyof typeof Ionicons.glyphMap;
  /** The tier's signature purple — used for the tier NAME so it matches its CTA
   *  button (Basic lighter, Pro darker). */
  tierColor: string;
  /** CTA fill. The brand logo gradient is reserved for ONE premium moment
   *  (the Pro CTA, matching the title); Basic is a calm solid purple. */
  cta: { gradient: readonly [string, string, ...string[]] } | { solid: string };
  /** Subtle dark purple tint behind the Pro card (the "elevated" feel). */
  cardBg?: [string, string];
}

// ONE purple for the whole screen — the app's accent token. Everything
// interactive/accented (toggle, both CTAs, names, icons, checks, borders, badge)
// uses it, so the design stays calm + matches the rest of the app. The brand
// rainbow gradient is reserved for a SINGLE moment: the title.
const ACCENT = colors.accent;

const PLANS: Plan[] = [
  {
    key: 'basic',
    name: 'DreamBot Basic',
    tiers: BASIC_TIERS,
    perks: BASIC_PERKS,
    highlight: false,
    icon: 'moon',
    tierColor: colors.accent,
    cta: { solid: colors.accent },
  },
  {
    key: 'pro',
    name: 'DreamBot Pro',
    tiers: PRO_TIERS,
    perks: PRO_PERKS,
    highlight: true,
    badge: 'Best value',
    icon: 'sparkles',
    tierColor: colors.accentDark,
    // Pro = the darker "Following" purple (colors.accentDark); Basic = the
    // lighter "Follow" purple (colors.accent). Same hue, subtly differentiated,
    // reusing the app's existing follow-button shades.
    cta: { solid: colors.accentDark },
    cardBg: ['#211B36', '#15131F'],
  },
];

/** Match by the underlying StoreKit product id (the App Store Connect contract,
 *  guaranteed to match) rather than the RevenueCat package identifier, which is
 *  an arbitrary dashboard label that may differ from our constants. */
function findPackage(packages: PurchasesPackage[], productId: string) {
  return packages.find((p) => p.product.identifier === productId);
}

/** Days remaining in the trial, floored. Null if no trial / ended. */
function trialDaysLeft(proTrialEndsAt: string | null): number | null {
  if (!proTrialEndsAt) return null;
  const msLeft = new Date(proTrialEndsAt).getTime() - Date.now();
  if (msLeft <= 0) return null;
  return Math.max(0, Math.floor(msLeft / (24 * 60 * 60 * 1000)));
}

export default function SubscribeScreen() {
  const isPro = useAuthStore((s) => s.isPro);
  const isPaidPro = useAuthStore((s) => s.isPaidPro);
  const isBasic = useAuthStore((s) => s.isBasic);
  const proTrialEndsAt = useAuthStore((s) => s.proTrialEndsAt);
  const { data: packages = [], isLoading } = useProPackages();
  const { mutate: purchase } = usePurchasePro();
  const { mutate: restore, isPending: restoring } = useRestorePurchases();

  // Default to yearly (better deal). Tap the toggle to switch.
  const [period, setPeriod] = useState<Period>('year');
  // Which plan's purchase is in flight — so ONLY that card's CTA spins (not both).
  const [purchasingPlan, setPurchasingPlan] = useState<'basic' | 'pro' | null>(null);

  const isOnTrial = isPro && !isPaidPro;
  const daysLeft = isOnTrial ? trialDaysLeft(proTrialEndsAt) : null;

  useEffect(() => {
    trackProStoreOpened();
  }, []);

  function handleSubscribe(plan: Plan) {
    const tier = plan.tiers.find((t) => t.period === period) ?? plan.tiers[0];
    const pkg = findPackage(packages, tier.productId);
    if (!pkg) {
      Toast.show('Plan unavailable. Try again in a moment.', 'close-circle');
      return;
    }
    trackProSubscribeTapped({ period: tier.period });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPurchasingPlan(plan.key);
    purchase(pkg, {
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Toast.show(`You're on ${plan.name.replace('DreamBot ', '')}!`, 'sparkles');
      },
      onError: (err) => {
        if (err.message === 'cancelled') return;
        Toast.show('Purchase failed. Try again.', 'close-circle');
      },
      onSettled: () => setPurchasingPlan(null),
    });
  }

  /** Is the user already paying for this plan (so we show "Current plan")? */
  function isCurrentPlan(plan: Plan): boolean {
    if (plan.key === 'pro') return isPaidPro;
    if (plan.key === 'basic') return isBasic;
    return false;
  }

  /** CTA inner content — spinner while this plan is purchasing, else the label. */
  function ctaContent(plan: Plan) {
    if (purchasingPlan === plan.key) return <ActivityIndicator color="#fff" />;
    const label =
      plan.key === 'pro' && isBasic
        ? 'Upgrade to Pro'
        : `Get ${plan.name.replace('DreamBot ', '')}`;
    return <Text style={[s.ctaText, s.ctaTextLit]}>{label}</Text>;
  }

  return (
    <ScreenLayout header="back" title="Plans">
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          {/* Hero — gradient wordmark title (same MaskedView treatment as the
              'DreamBot' logo on the login/splash screen) */}
          <View style={s.hero}>
            <MaskedView maskElement={<Text style={s.heroTitle}>Choose your plan</Text>}>
              <LinearGradient colors={BRAND_GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Text style={[s.heroTitle, { opacity: 0 }]}>Choose your plan</Text>
              </LinearGradient>
            </MaskedView>
            <Text style={s.heroSub}>
              {isOnTrial
                ? 'Enjoying the free trial? Keep it all going.'
                : 'Get the full DreamBot magic.'}
            </Text>
          </View>

          {/* Trial countdown banner */}
          {isOnTrial && daysLeft !== null && (
            <View style={s.trialBanner}>
              <View style={s.trialBannerIcon}>
                <Ionicons name="time-outline" size={18} color={colors.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.trialBannerTitle}>
                  {daysLeft === 0
                    ? 'Last day of your free trial'
                    : daysLeft === 1
                      ? '1 day left in your free trial'
                      : `${daysLeft} days left in your free trial`}
                </Text>
                <Text style={s.trialBannerSub}>
                  Subscribe now to keep your nightly dreams going.
                </Text>
              </View>
            </View>
          )}

          {/* Billing-period toggle */}
          <View style={s.toggle}>
            {(['month', 'year'] as Period[]).map((p) => (
              <TouchableOpacity
                key={p}
                style={[s.toggleBtn, period === p && s.toggleBtnActive]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setPeriod(p);
                }}
                activeOpacity={0.85}
              >
                <Text style={[s.toggleText, period === p && s.toggleTextActive]}>
                  {p === 'month' ? 'Monthly' : 'Yearly'}
                </Text>
                {p === 'year' && (
                  <LinearGradient
                    colors={['#FFE08A', '#F2A93B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={s.toggleSaveBadge}
                  >
                    <Text style={s.toggleSaveText}>Save 33%</Text>
                  </LinearGradient>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={colors.accent}
              style={{ marginTop: verticalScale(32) }}
            />
          ) : (
            <View style={s.cards}>
              {PLANS.map((plan) => {
                const tier = plan.tiers.find((t) => t.period === period) ?? plan.tiers[0];
                const pkg = findPackage(packages, tier.productId);
                const price = pkg?.product.priceString ?? tier.displayPrice;
                const current = isCurrentPlan(plan);
                return (
                  <View
                    key={plan.key}
                    style={[s.card, { borderColor: ACCENT + '33' }, current && s.cardCurrent]}
                  >
                    {/* Pro only: a subtle dark-purple tint = quietly "elevated" */}
                    {plan.cardBg && (
                      <LinearGradient
                        colors={plan.cardBg}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={s.cardBgFill}
                      />
                    )}
                    {plan.badge && !current && (
                      <View style={[s.cardBadge, { backgroundColor: ACCENT }]}>
                        <Text style={s.cardBadgeText}>{plan.badge}</Text>
                      </View>
                    )}
                    <View style={s.cardHead}>
                      <View style={s.cardNameRow}>
                        <View style={[s.cardIcon, { backgroundColor: plan.tierColor + '22' }]}>
                          <Ionicons name={plan.icon} size={fontScale(16)} color={plan.tierColor} />
                        </View>
                        <Text style={[s.cardName, { color: plan.tierColor }]}>
                          {plan.name.replace('DreamBot ', '')}
                        </Text>
                      </View>
                    </View>

                    <View style={s.priceRow}>
                      <Text style={s.priceAmount}>{price}</Text>
                      <Text style={s.pricePeriod}>/{period}</Text>
                    </View>

                    <View style={s.cardPerks}>
                      {plan.perks.map((perk) => (
                        <View key={perk.title} style={s.cardPerkRow}>
                          <Ionicons name="checkmark-circle" size={16} color={ACCENT} />
                          <Text style={s.cardPerkText}>{perk.title}</Text>
                        </View>
                      ))}
                    </View>

                    {current ? (
                      <View style={[s.cta, s.ctaDisabled]}>
                        <Text style={[s.ctaText, { color: colors.textMuted }]}>Current plan</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => handleSubscribe(plan)}
                        disabled={purchasingPlan !== null}
                        activeOpacity={0.85}
                      >
                        {'gradient' in plan.cta ? (
                          <LinearGradient
                            colors={plan.cta.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[
                              s.cta,
                              purchasingPlan !== null && purchasingPlan !== plan.key && s.ctaDim,
                            ]}
                          >
                            {ctaContent(plan)}
                          </LinearGradient>
                        ) : (
                          <View
                            style={[
                              s.cta,
                              { backgroundColor: plan.cta.solid },
                              purchasingPlan !== null && purchasingPlan !== plan.key && s.ctaDim,
                            ]}
                          >
                            {ctaContent(plan)}
                          </View>
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          )}

          {/* Restore + legal */}
          <TouchableOpacity
            style={s.restore}
            onPress={() => restore()}
            disabled={restoring}
            activeOpacity={0.7}
          >
            <Text style={s.restoreText}>{restoring ? 'Restoring…' : 'Restore purchases'}</Text>
          </TouchableOpacity>

          <Text style={s.legal}>
            Subscriptions renew automatically until cancelled. Manage or cancel anytime in your App
            Store settings. Upgrade or downgrade between Basic and Pro at any time.
          </Text>
        </ScrollView>
      </View>
    </ScreenLayout>
  );
}

const s = StyleSheet.create({
  scroll: {
    paddingHorizontal: verticalScale(20),
    paddingBottom: verticalScale(40),
  },
  hero: {
    alignItems: 'center',
    marginTop: verticalScale(8),
    marginBottom: verticalScale(20),
  },
  heroTitle: {
    fontSize: fontScale(26),
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  heroSub: {
    fontSize: fontScale(14),
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: verticalScale(6),
    paddingHorizontal: verticalScale(12),
    lineHeight: fontScale(20),
  },
  trialBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: verticalScale(14),
    padding: verticalScale(14),
    marginBottom: verticalScale(18),
    borderWidth: 1,
    borderColor: colors.accent + '40',
  },
  trialBannerIcon: {
    width: verticalScale(34),
    height: verticalScale(34),
    borderRadius: verticalScale(17),
    backgroundColor: colors.accent + '22',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: verticalScale(12),
  },
  trialBannerTitle: {
    fontSize: fontScale(14),
    fontWeight: '700',
    color: colors.textPrimary,
  },
  trialBannerSub: {
    fontSize: fontScale(12),
    color: colors.textMuted,
    marginTop: verticalScale(2),
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: verticalScale(12),
    padding: verticalScale(4),
    marginBottom: verticalScale(20),
    gap: verticalScale(4),
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(10),
    borderRadius: verticalScale(9),
    gap: verticalScale(6),
    // Subtle fill so the INACTIVE segment reads as a real button (and the
    // "Save 33%" badge sits inside it instead of floating in empty space).
    backgroundColor: colors.card,
  },
  toggleBtnActive: {
    backgroundColor: colors.accent,
  },
  toggleText: {
    fontSize: fontScale(14),
    fontWeight: '700',
    color: colors.textMuted,
  },
  toggleTextActive: {
    color: '#000',
  },
  toggleSaveBadge: {
    // Little golden sticker — a gold gradient pill with a darker gold rim,
    // reads on both the active (purple) and inactive (dark) toggle states.
    borderRadius: verticalScale(7),
    paddingHorizontal: verticalScale(7),
    paddingVertical: verticalScale(3),
    borderWidth: 1,
    borderColor: '#C98A1E',
  },
  toggleSaveText: {
    fontSize: fontScale(10),
    fontWeight: '800',
    color: '#5A3A00',
  },
  cards: {
    gap: verticalScale(16),
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: verticalScale(18),
    padding: verticalScale(18),
    borderWidth: 1,
    borderColor: colors.border,
  },
  // Subtle dark gradient tint behind the Pro card — rounded to match the card
  // (its own borderRadius instead of overflow:hidden, so the badge isn't clipped).
  cardBgFill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: verticalScale(18),
  },
  cardCurrent: {
    opacity: 0.75,
  },
  cardBadge: {
    position: 'absolute',
    top: verticalScale(-10),
    right: verticalScale(16),
    backgroundColor: colors.accent,
    borderRadius: verticalScale(8),
    paddingHorizontal: verticalScale(10),
    paddingVertical: verticalScale(3),
    zIndex: 2,
  },
  cardBadgeText: {
    fontSize: fontScale(11),
    fontWeight: '800',
    color: '#1A1A24',
  },
  cardHead: {
    marginBottom: verticalScale(10),
  },
  cardNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: verticalScale(8),
  },
  cardIcon: {
    width: verticalScale(28),
    height: verticalScale(28),
    borderRadius: verticalScale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardName: {
    fontSize: fontScale(20),
    fontWeight: '800',
    color: colors.textPrimary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: verticalScale(14),
  },
  priceAmount: {
    fontSize: fontScale(28),
    fontWeight: '900',
    color: colors.textPrimary,
  },
  pricePeriod: {
    fontSize: fontScale(14),
    color: colors.textMuted,
    marginLeft: verticalScale(2),
  },
  cardPerks: {
    gap: verticalScale(8),
    marginBottom: verticalScale(18),
  },
  cardPerkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: verticalScale(8),
  },
  cardPerkText: {
    flex: 1,
    fontSize: fontScale(13),
    color: colors.textPrimary,
  },
  cta: {
    borderRadius: verticalScale(12),
    paddingVertical: verticalScale(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Dim a card's CTA while the OTHER card's purchase is in flight.
  ctaDim: {
    opacity: 0.4,
  },
  ctaDisabled: {
    backgroundColor: colors.border,
  },
  ctaText: {
    fontSize: fontScale(15),
    fontWeight: '800',
  },
  ctaTextLit: {
    color: '#FFFFFF',
  },
  restore: {
    alignItems: 'center',
    marginTop: verticalScale(22),
    padding: verticalScale(8),
  },
  restoreText: {
    fontSize: fontScale(14),
    color: colors.textMuted,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  legal: {
    fontSize: fontScale(11),
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: verticalScale(14),
    lineHeight: fontScale(16),
    paddingHorizontal: verticalScale(8),
  },
});
