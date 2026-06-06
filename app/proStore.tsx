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
import { PRO_PERKS, PRO_TIERS } from '@/constants/proPlan';
import { useProPackages, usePurchasePro, useRestorePurchases } from '@/hooks/useSparkles';
import { useAuthStore } from '@/store/auth';
import { trackProStoreOpened, trackProSubscribeTapped } from '@/lib/analytics';
import { verticalScale, fontScale } from '@/lib/responsive';

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

/** Plan-specific marketing copy shown under the selected tier card. */
const TIER_DETAIL_COPY: Record<string, string> = {
  monthly: 'Billed monthly. Cancel anytime in App Store settings.',
  yearly: 'Best value — save 33% vs monthly. Billed once a year.',
};

export default function ProStoreScreen() {
  const isPro = useAuthStore((s) => s.isPro);
  const isPaidPro = useAuthStore((s) => s.isPaidPro);
  const proTrialEndsAt = useAuthStore((s) => s.proTrialEndsAt);
  const { data: packages = [], isLoading } = useProPackages();
  const { mutate: purchase, isPending: purchasing } = usePurchasePro();
  const { mutate: restore, isPending: restoring } = useRestorePurchases();

  // Default selection = yearly (better deal, recommended). Tap to switch.
  const [selectedTierId, setSelectedTierId] = useState<string>(
    PRO_TIERS.find((t) => t.period === 'year')?.productId ?? PRO_TIERS[0].productId
  );

  // Trial status: user has Pro perks via trial but hasn't paid yet.
  // Show countdown banner so they know they need to subscribe.
  const isOnTrial = isPro && !isPaidPro;
  const daysLeft = isOnTrial ? trialDaysLeft(proTrialEndsAt) : null;
  const trialExpired = !isPro && !isPaidPro && proTrialEndsAt !== null;

  // Resolve the currently-selected tier + its package for the primary CTA.
  const selectedTier = PRO_TIERS.find((t) => t.productId === selectedTierId) ?? PRO_TIERS[0];
  const selectedPkg = findPackage(packages, selectedTier.packageId);
  const selectedPrice = selectedPkg?.product.priceString ?? selectedTier.displayPrice;

  useEffect(() => {
    trackProStoreOpened();
  }, []);

  function handlePurchase(pkg: PurchasesPackage) {
    trackProSubscribeTapped({ period: selectedTier.period });
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
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          {/* Hero — title + state-aware subtitle. Diamond icon removed for
              real-estate; the header bar already says "Get Pro". */}
          <View style={s.hero}>
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
          </View>

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
          ) : (
            <>
              <View style={s.tierStack}>
                {PRO_TIERS.map((tier) => {
                  const pkg = findPackage(packages, tier.packageId);
                  // Fall back to displayPrice when StoreKit hasn't loaded the
                  // real localized price.
                  const price = pkg?.product.priceString ?? tier.displayPrice;
                  const isSelected = tier.productId === selectedTierId;
                  return (
                    <TouchableOpacity
                      key={tier.productId}
                      style={[s.tierCard, isSelected && s.tierCardSelected]}
                      activeOpacity={0.85}
                      disabled={isPaidPro}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setSelectedTierId(tier.productId);
                      }}
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
                      <View style={[s.tierRadio, isSelected && s.tierRadioSelected]}>
                        {isSelected && <View style={s.tierRadioInner} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}

          <Text style={s.fineprint}>
            Auto-renews until cancelled. Manage or cancel anytime in your App Store account
            settings. Restoring will re-link a previous purchase to this account.
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

        {/* Pinned footer — plan-specific helper copy + primary CTA, always
            visible above the fold regardless of scroll position. */}
        {!isLoading && (
          <View style={s.stickyFooter}>
            <Text style={s.tierDetail}>
              {TIER_DETAIL_COPY[selectedTier.period === 'year' ? 'yearly' : 'monthly']}
            </Text>
            <TouchableOpacity
              style={[
                s.primaryCta,
                (!selectedPkg || purchasing || isPaidPro) && s.primaryCtaDisabled,
              ]}
              activeOpacity={0.85}
              disabled={!selectedPkg || purchasing || isPaidPro}
              onPress={() => selectedPkg && handlePurchase(selectedPkg)}
            >
              {purchasing ? (
                <View style={s.ctaConnecting}>
                  <ActivityIndicator color="#FFFFFF" />
                  <Text style={s.primaryCtaText}>Connecting to App Store…</Text>
                </View>
              ) : (
                <Text style={s.primaryCtaText}>
                  {isPaidPro
                    ? "You're Pro"
                    : `Subscribe — ${selectedPrice} / ${selectedTier.period}`}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScreenLayout>
  );
}

const s = StyleSheet.create({
  // Bottom padding sized for the sticky footer height (helper line +
  // CTA + paddings ≈ 130-150px) plus a buffer so the Restore link can
  // still be scrolled into view above the footer.
  scroll: { paddingHorizontal: 16, paddingBottom: verticalScale(180) },

  // Pinned footer — plan-specific copy + primary CTA, always visible.
  // paddingBottom 32 clears the home indicator (~34pt) on phones with
  // a notch/Dynamic Island so the CTA's bottom corners don't get
  // truncated by the gesture area.
  stickyFooter: {
    paddingHorizontal: 16,
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(32),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },

  // Hero — compact text-only header (no icon, no gradient — header bar
  // already says "Get Pro"; this just lays out the brand + state hint).
  hero: {
    alignItems: 'center',
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(14),
  },
  heroTitle: {
    color: colors.textPrimary,
    fontSize: fontScale(24),
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  heroSub: {
    color: colors.textSecondary,
    fontSize: fontScale(13),
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 16,
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
    paddingVertical: verticalScale(12),
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
    fontSize: fontScale(14),
    fontWeight: '800',
  },
  trialBannerSub: {
    color: colors.textSecondary,
    fontSize: fontScale(12),
    lineHeight: fontScale(16),
    marginTop: 2,
  },

  // Perks
  perks: {
    gap: verticalScale(14),
    paddingVertical: verticalScale(12),
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
    fontSize: fontScale(15),
    fontWeight: '700',
  },
  perkSub: {
    color: colors.textSecondary,
    fontSize: fontScale(13),
    lineHeight: fontScale(18),
    marginTop: 2,
  },

  // Section
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: fontScale(16),
    fontWeight: '800',
    textAlign: 'center',
    marginTop: verticalScale(16),
    marginBottom: verticalScale(12),
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
    paddingVertical: verticalScale(16),
    paddingHorizontal: 18,
  },
  tierCardSelected: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(139,123,238,0.08)',
  },
  // Radio indicator (right side of each tier card)
  tierRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierRadioSelected: {
    borderColor: colors.accent,
  },
  tierRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
  },
  // Plan-specific helper line under the tier stack
  tierDetail: {
    color: colors.textSecondary,
    fontSize: fontScale(13),
    lineHeight: fontScale(18),
    textAlign: 'center',
    marginTop: verticalScale(14),
    marginBottom: verticalScale(16),
    paddingHorizontal: 12,
  },
  // Primary CTA button
  primaryCta: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  primaryCtaDisabled: {
    opacity: 0.5,
  },
  primaryCtaText: {
    color: '#FFFFFF',
    fontSize: fontScale(16),
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  ctaConnecting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    fontSize: fontScale(13),
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  tierPrice: {
    color: colors.textPrimary,
    fontSize: fontScale(22),
    fontWeight: '900',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  tierPeriod: {
    color: colors.textSecondary,
    fontSize: fontScale(14),
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
    fontSize: fontScale(11),
    lineHeight: fontScale(16),
    textAlign: 'center',
    marginTop: verticalScale(18),
    paddingHorizontal: 12,
  },

  // Empty
  emptyWrap: { alignItems: 'center', gap: 8, paddingVertical: verticalScale(32) },
  emptyText: { color: colors.textPrimary, fontSize: fontScale(15), fontWeight: '700' },
  emptySub: { color: colors.textSecondary, fontSize: fontScale(13), textAlign: 'center' },

  // Restore
  restoreButton: { alignItems: 'center', paddingVertical: verticalScale(20) },
  restoreText: { color: colors.textSecondary, fontSize: fontScale(14), fontWeight: '600' },
});
