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

interface Plan {
  key: 'basic' | 'pro';
  name: string;
  blurb: string;
  tiers: ProPlanTier[];
  perks: readonly { icon: string; title: string; sub: string }[];
  highlight: boolean;
  badge?: string;
}

const PLANS: Plan[] = [
  {
    key: 'basic',
    name: 'DreamBot Basic',
    blurb: 'Your nightly dreams, on.',
    tiers: BASIC_TIERS,
    perks: BASIC_PERKS,
    highlight: false,
  },
  {
    key: 'pro',
    name: 'DreamBot Pro',
    blurb: 'Everything, supercharged.',
    tiers: PRO_TIERS,
    perks: PRO_PERKS,
    highlight: true,
    badge: 'Best value',
  },
];

function findPackage(packages: PurchasesPackage[], packageId: string) {
  return packages.find((p) => p.identifier === packageId);
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
  const { mutate: purchase, isPending: purchasing } = usePurchasePro();
  const { mutate: restore, isPending: restoring } = useRestorePurchases();

  // Default to yearly (better deal). Tap the toggle to switch.
  const [period, setPeriod] = useState<Period>('year');

  const isOnTrial = isPro && !isPaidPro;
  const daysLeft = isOnTrial ? trialDaysLeft(proTrialEndsAt) : null;
  const trialExpired = !isPro && !isBasic && !isPaidPro && proTrialEndsAt !== null;

  useEffect(() => {
    trackProStoreOpened();
  }, []);

  function handleSubscribe(plan: Plan) {
    const tier = plan.tiers.find((t) => t.period === period) ?? plan.tiers[0];
    const pkg = findPackage(packages, tier.packageId);
    if (!pkg) {
      Toast.show('Plan unavailable — try again in a moment', 'close-circle');
      return;
    }
    trackProSubscribeTapped({ period: tier.period });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    purchase(pkg, {
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Toast.show(`You're on ${plan.name.replace('DreamBot ', '')}!`, 'sparkles');
      },
      onError: (err) => {
        if (err.message === 'cancelled') return;
        Toast.show('Purchase failed — try again', 'close-circle');
      },
    });
  }

  /** Is the user already paying for this plan (so we show "Current plan")? */
  function isCurrentPlan(plan: Plan): boolean {
    if (plan.key === 'pro') return isPaidPro;
    if (plan.key === 'basic') return isBasic;
    return false;
  }

  return (
    <ScreenLayout header="back" title="Plans">
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          {/* Hero */}
          <View style={s.hero}>
            <Text style={s.heroTitle}>Choose your plan</Text>
            <Text style={s.heroSub}>
              {isPaidPro
                ? "You're on Pro. Thanks for supporting DreamBot."
                : isBasic
                  ? "You're on Basic. Upgrade to Pro for more."
                  : isOnTrial
                    ? "You're on the free trial — pick a plan to keep your dreams."
                    : trialExpired
                      ? 'Your trial ended. Subscribe to keep your nightly dreams.'
                      : 'Keep your nightly dreams coming.'}
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
                  <View style={s.toggleSaveBadge}>
                    <Text style={s.toggleSaveText}>Save 33%</Text>
                  </View>
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
                const pkg = findPackage(packages, tier.packageId);
                const price = pkg?.product.priceString ?? tier.displayPrice;
                const current = isCurrentPlan(plan);
                return (
                  <View
                    key={plan.key}
                    style={[s.card, plan.highlight && s.cardHighlight, current && s.cardCurrent]}
                  >
                    {plan.badge && !current && (
                      <View style={s.cardBadge}>
                        <Text style={s.cardBadgeText}>{plan.badge}</Text>
                      </View>
                    )}
                    <View style={s.cardHead}>
                      <Text style={s.cardName}>{plan.name.replace('DreamBot ', '')}</Text>
                      <Text style={s.cardBlurb}>{plan.blurb}</Text>
                    </View>

                    <View style={s.priceRow}>
                      <Text style={s.priceAmount}>{price}</Text>
                      <Text style={s.pricePeriod}>/{period}</Text>
                    </View>

                    <View style={s.cardPerks}>
                      {plan.perks.map((perk) => (
                        <View key={perk.title} style={s.cardPerkRow}>
                          <Ionicons name="checkmark-circle" size={16} color={colors.accent} />
                          <Text style={s.cardPerkText}>{perk.title}</Text>
                        </View>
                      ))}
                    </View>

                    <TouchableOpacity
                      style={[
                        s.cta,
                        plan.highlight ? s.ctaPrimary : s.ctaSecondary,
                        current && s.ctaDisabled,
                      ]}
                      onPress={() => handleSubscribe(plan)}
                      disabled={current || purchasing}
                      activeOpacity={0.85}
                    >
                      {purchasing ? (
                        <ActivityIndicator color={plan.highlight ? '#000' : colors.textPrimary} />
                      ) : (
                        <Text
                          style={[
                            s.ctaText,
                            plan.highlight ? s.ctaTextPrimary : s.ctaTextSecondary,
                          ]}
                        >
                          {current
                            ? 'Current plan'
                            : plan.key === 'pro' && isBasic
                              ? 'Upgrade to Pro'
                              : `Get ${plan.name.replace('DreamBot ', '')}`}
                        </Text>
                      )}
                    </TouchableOpacity>
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
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(10),
    borderRadius: verticalScale(9),
    gap: verticalScale(6),
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
    backgroundColor: '#00000022',
    borderRadius: verticalScale(6),
    paddingHorizontal: verticalScale(6),
    paddingVertical: verticalScale(2),
  },
  toggleSaveText: {
    fontSize: fontScale(10),
    fontWeight: '800',
    color: '#000',
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
  cardHighlight: {
    borderColor: colors.accent,
    borderWidth: 2,
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
  },
  cardBadgeText: {
    fontSize: fontScale(11),
    fontWeight: '800',
    color: '#000',
  },
  cardHead: {
    marginBottom: verticalScale(10),
  },
  cardName: {
    fontSize: fontScale(20),
    fontWeight: '800',
    color: colors.textPrimary,
  },
  cardBlurb: {
    fontSize: fontScale(13),
    color: colors.textMuted,
    marginTop: verticalScale(2),
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
  },
  ctaPrimary: {
    backgroundColor: colors.accent,
  },
  ctaSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  ctaDisabled: {
    backgroundColor: colors.border,
    borderColor: colors.border,
  },
  ctaText: {
    fontSize: fontScale(15),
    fontWeight: '800',
  },
  ctaTextPrimary: {
    color: '#000',
  },
  ctaTextSecondary: {
    color: colors.accent,
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
