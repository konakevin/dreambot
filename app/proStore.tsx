/**
 * Get Pro screen — sells the Pro subscription (monthly + yearly).
 *
 * Mirrors the sparkleStore.tsx pattern. Reads the available Pro packages
 * from RevenueCat, displays the perks list from constants/proPlan.ts, and
 * routes the purchase through purchaseProPackage(). The webhook is what
 * authoritatively flips users.pro_subscription + grants the bundled
 * sparkles — this screen just kicks off the StoreKit flow and refreshes
 * client state on success.
 */

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
import { LinearGradient } from 'expo-linear-gradient';
import { type PurchasesPackage } from 'react-native-purchases';
import { ScreenLayout } from '@/components/ScreenLayout';
import { Toast } from '@/components/Toast';
import { colors } from '@/constants/theme';
import { PRO_PERKS, PRO_TIERS } from '@/constants/proPlan';
import { useProPackages, usePurchasePro, useRestorePurchases } from '@/hooks/useSparkles';
import { useAuthStore } from '@/store/auth';

function findPackage(packages: PurchasesPackage[], packageId: string) {
  return packages.find((p) => p.identifier === packageId);
}

/** Days remaining in the trial, floored (4.7 days → "4 days"). Returns
 *  null if no trial set OR trial ended. Caller decides what to render. */
function trialDaysLeft(proTrialEndsAt: string | null): number | null {
  if (!proTrialEndsAt) return null;
  const msLeft = new Date(proTrialEndsAt).getTime() - Date.now();
  if (msLeft <= 0) return null;
  return Math.max(0, Math.floor(msLeft / (24 * 60 * 60 * 1000)));
}

export default function ProStoreScreen() {
  const isPro = useAuthStore((s) => s.isPro);
  const isPaidPro = useAuthStore((s) => s.isPaidPro);
  const proTrialEndsAt = useAuthStore((s) => s.proTrialEndsAt);
  const { data: packages = [], isLoading } = useProPackages();
  const { mutate: purchase, isPending: purchasing } = usePurchasePro();
  const { mutate: restore, isPending: restoring } = useRestorePurchases();

  // Trial status: user has Pro perks via trial but hasn't paid yet.
  // Show countdown banner so they know they need to subscribe.
  const isOnTrial = isPro && !isPaidPro;
  const daysLeft = isOnTrial ? trialDaysLeft(proTrialEndsAt) : null;
  const trialExpired = !isPro && !isPaidPro && proTrialEndsAt !== null;

  function handlePurchase(pkg: PurchasesPackage) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    purchase(pkg, {
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Toast.show("You're Pro!", 'sparkles');
      },
      onError: (err) => {
        if (err.message === 'cancelled') return;
        Toast.show('Purchase failed — try again', 'close-circle');
      },
    });
  }

  return (
    <ScreenLayout header="back" title="Get Pro">
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient
          colors={['rgba(139,123,238,0.18)', 'rgba(139,123,238,0.04)', 'transparent']}
          style={s.hero}
        >
          <View style={s.heroGlow}>
            <Ionicons name="diamond" size={36} color={colors.accent} />
          </View>
          <Text style={s.heroTitle}>DreamBot Pro</Text>
          <Text style={s.heroSub}>
            {isPaidPro
              ? "You're already Pro. Thanks for supporting DreamBot."
              : isOnTrial
                ? "You're on the free trial. Lock it in below."
                : trialExpired
                  ? 'Your trial ended. Subscribe to keep Pro.'
                  : 'Unlock the full app.'}
          </Text>
        </LinearGradient>

        {/* Trial countdown banner — only shows during active trial */}
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
                Subscribe now to keep Pro features and avoid losing access.
              </Text>
            </View>
          </View>
        )}

        {/* Perks */}
        <View style={s.perks}>
          {PRO_PERKS.map((perk) => (
            <View key={perk.title} style={s.perkRow}>
              <View style={s.perkIcon}>
                <Ionicons
                  name={perk.icon as keyof typeof Ionicons.glyphMap}
                  size={20}
                  color={colors.accent}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.perkTitle}>{perk.title}</Text>
                <Text style={s.perkSub}>{perk.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Plan tiles */}
        <Text style={s.sectionTitle}>Choose your plan</Text>

        {isLoading ? (
          <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 24 }} />
        ) : packages.length === 0 ? (
          <View style={s.emptyWrap}>
            <Ionicons name="bag-outline" size={44} color={colors.textSecondary} />
            <Text style={s.emptyText}>Pro not available yet</Text>
            <Text style={s.emptySub}>Subscriptions will appear once the store is configured.</Text>
          </View>
        ) : (
          <View style={s.tierStack}>
            {PRO_TIERS.map((tier) => {
              const pkg = findPackage(packages, tier.packageId);
              const price = pkg?.product.priceString ?? tier.displayPrice;
              const isYearly = tier.period === 'year';
              return (
                <TouchableOpacity
                  key={tier.productId}
                  style={[s.tierCard, isYearly && s.tierCardFeatured]}
                  activeOpacity={0.85}
                  disabled={!pkg || purchasing || isPaidPro}
                  onPress={() => pkg && handlePurchase(pkg)}
                >
                  {tier.savingsBadge && (
                    <View style={s.savingsBadge}>
                      <Text style={s.savingsBadgeText}>{tier.savingsBadge}</Text>
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={s.tierLabel}>{tier.label}</Text>
                    <Text style={s.tierPrice}>
                      {price}
                      <Text style={s.tierPeriod}> / {tier.period}</Text>
                    </Text>
                  </View>
                  <View style={s.tierCta}>
                    {purchasing ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <Text style={s.fineprint}>
          Auto-renews until cancelled. Manage or cancel anytime in your App Store account settings.
          Restoring will re-link a previous purchase to this account.
        </Text>

        <TouchableOpacity
          style={s.restoreButton}
          onPress={() =>
            restore(undefined, {
              onSuccess: () => Toast.show('Purchases restored', 'checkmark-circle'),
              onError: () => Toast.show('Restore failed', 'close-circle'),
            })
          }
          activeOpacity={0.7}
          disabled={restoring}
        >
          <Text style={s.restoreText}>{restoring ? 'Restoring…' : 'Restore Purchases'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenLayout>
  );
}

const s = StyleSheet.create({
  scroll: { paddingHorizontal: 16, paddingBottom: 60 },

  // Hero
  hero: {
    alignItems: 'center',
    paddingVertical: 24,
    marginHorizontal: -16,
    marginBottom: 8,
  },
  heroGlow: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(139,123,238,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  heroTitle: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  heroSub: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },

  // Trial banner
  trialBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(139,123,238,0.10)',
    borderColor: 'rgba(139,123,238,0.35)',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 4,
    marginBottom: 8,
  },
  trialBannerIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(139,123,238,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  trialBannerTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  trialBannerSub: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },

  // Perks
  perks: {
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  perkRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  perkIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(139,123,238,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  perkTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  perkSub: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },

  // Section
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 12,
  },

  // Tier cards
  tierStack: { gap: 12 },
  tierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  tierCardFeatured: {
    borderColor: colors.accent,
  },
  savingsBadge: {
    position: 'absolute',
    top: -10,
    right: 14,
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  savingsBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tierLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  tierPrice: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  tierPeriod: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
  },
  tierCta: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Fine print
  fineprint: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 18,
    paddingHorizontal: 12,
  },

  // Empty
  emptyWrap: { alignItems: 'center', gap: 8, paddingVertical: 32 },
  emptyText: { color: colors.textPrimary, fontSize: 15, fontWeight: '700' },
  emptySub: { color: colors.textSecondary, fontSize: 13, textAlign: 'center' },

  // Restore
  restoreButton: { alignItems: 'center', paddingVertical: 20 },
  restoreText: { color: colors.textSecondary, fontSize: 14, fontWeight: '600' },
});
