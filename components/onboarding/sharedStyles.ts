import { StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';

/**
 * Shared styles for the onboarding pager. The footer was previously
 * `position: 'absolute'` floating over content — that caused half the
 * truncation bugs on iPhone SE because content scrolled behind it with
 * no reservation. As of 2026-06-05 the footer is flex / in-flow, and
 * each step container is a `flex: 1` column with the content area
 * taking the remaining space above the footer. See `OnboardingFooter`
 * for the safe-area bottom inset handling.
 */
export const onboardingStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  heroTitle: {
    fontSize: fontScale(26),
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: verticalScale(6),
  },
  heroSubtitle: {
    fontSize: fontScale(14),
    color: colors.textSecondary,
    lineHeight: fontScale(20),
  },

  selectedCount: {
    fontSize: fontScale(13),
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  selectedCountMet: { color: '#4ADE80' },

  footer: {
    padding: verticalScale(16),
    backgroundColor: colors.background,
    gap: verticalScale(10),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  footerButtons: { flexDirection: 'row', gap: verticalScale(12) },
  counterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(14),
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  backBtnText: { fontSize: fontScale(16), color: '#FFFFFF', fontWeight: '700' },
  continueBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(14),
    borderRadius: 14,
    backgroundColor: colors.accent,
    gap: 6,
  },
  continueBtnDisabled: { backgroundColor: colors.surface },
  continueBtnText: { fontSize: fontScale(16), fontWeight: '700', color: '#FFFFFF' },
  continueBtnTextDisabled: { color: colors.textSecondary },
});
