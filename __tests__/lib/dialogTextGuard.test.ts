/**
 * Dialog typography guard — every popup dialog takes its title / body / button
 * text from `constants/dialogText.ts` (audit 2026-09-19: three scales had
 * drifted apart, and CustomAlert matched none of them). This fails when a
 * dialog grows its own fontSize / fontWeight / lineHeight for one of those
 * roles again, or drops the shared import.
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '..', '..');

/** Dialog components + the text roles they render through the shared module. */
const DIALOG_FILES = [
  'components/CustomAlert.tsx',
  'components/ConfirmDialog.tsx',
  'app/dream/loading.tsx',
  'components/DreamFailureCard.tsx',
  'components/AvatarConfirm.tsx',
  'components/UsernameNudge.tsx',
  'components/ForceUpdateGate.tsx',
  'components/PremiumGateSheet.tsx',
  'components/DreamSmartSwapSheet.tsx',
  'components/AiConsentSheet.tsx',
  'components/AnnouncementSheet.tsx',
  'components/GiftSparklesSheet.tsx',
  'components/CreateIntroSheet.tsx',
  'components/MediumsIntroSheet.tsx',
  'components/SparkleIntroSheet.tsx',
  'components/GroupPhotoIntroSheet.tsx',
];

/** Local StyleSheet keys that mean "this is the dialog's title / body / button label". */
const ROLE_KEYS = [
  'title',
  'modalTitle',
  'message',
  'body',
  'modalBody',
  'subtitle',
  'eyebrow',
  'buttonText',
  'confirmText',
  'cancelText',
  'secondaryText',
  'laterText',
  'notNowText',
  'dismissText',
  'useText',
  'ctaText',
  'flatPrimaryText',
  'flatOkText',
  'btnPrimaryText',
  'btnSecondaryText',
  'modalBtnPrimaryText',
  'modalBtnSecondaryText',
];

const TYPOGRAPHY = /\b(fontSize|fontWeight|lineHeight|fontFamily|letterSpacing)\s*:/;

function localRoleEntries(src: string): { key: string; body: string }[] {
  const out: { key: string; body: string }[] = [];
  for (const key of ROLE_KEYS) {
    const re = new RegExp(`\\n  ${key}: \\{([^{}]*)\\},?\\n`, 'g');
    for (const m of src.matchAll(re)) out.push({ key, body: m[1] });
  }
  return out;
}

describe('dialog typography lives in constants/dialogText.ts', () => {
  it('the scan catches a dialog that grows its own typography back', () => {
    const drifted = `
const s = StyleSheet.create({
  card: { padding: 24 },
  title: {
    color: colors.textPrimary,
    fontSize: fontScale(18),
    fontWeight: '800',
  },
  body: { marginBottom: verticalScale(20) },
});
`;
    const offenders = localRoleEntries(drifted).filter((e) => TYPOGRAPHY.test(e.body));
    expect(offenders.map((e) => e.key)).toEqual(['title']);
  });

  it('the shared module defines every role with an explicit size', () => {
    const src = fs.readFileSync(path.join(ROOT, 'constants/dialogText.ts'), 'utf8');
    for (const role of ['eyebrow', 'title', 'body', 'button', 'buttonSecondary', 'caption']) {
      expect(src).toMatch(new RegExp(`\\n  ${role}: \\{[^}]*fontSize: fontScale\\(\\d+\\)`));
    }
  });

  it.each(DIALOG_FILES)(
    '%s imports dialogText and keeps no local typography for its roles',
    (rel) => {
      const src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
      expect(src).toContain("from '@/constants/dialogText'");
      const offenders = localRoleEntries(src).filter((e) => TYPOGRAPHY.test(e.body));
      expect(offenders.map((e) => `${e.key}: {${e.body.replace(/\s+/g, ' ').trim()}}`)).toEqual([]);
    }
  );
});
