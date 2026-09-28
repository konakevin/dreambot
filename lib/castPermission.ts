/**
 * "Do you have their permission?" before a photo of SOMEONE ELSE (a Dream Cast +1) is added.
 *
 * DreamBot face-swaps cast members into AI images, and the Terms require consent from anyone
 * whose photo you add. This asks once per +1 photo (new member or replacement photo), right
 * before the photo picker opens, and returns the moment of the confirmation so the caller can
 * store it on the cast member (`consent_confirmed_at`, persisted in user_recipes.recipe) as
 * evidence. Your own photo and pets need no confirm.
 */
import { showAlert } from '@/components/CustomAlert';
import type { DreamCastMember } from '@/types/vibeProfile';

export const CAST_PERMISSION_TITLE = 'Do you have their permission?';
export const CAST_PERMISSION_BODY =
  "Only add photos of people who've agreed to be in your dreams. DreamBot puts their face into AI images.";
export const CAST_PERMISSION_CONFIRM = 'Yes, I have permission';

/** Only people other than you need the confirm. */
export function castRoleNeedsPermission(role: DreamCastMember['role']): boolean {
  return role === 'plus_one';
}

/**
 * Show the confirm. Resolves the ISO time of the confirmation, or null when cancelled.
 * Not dismissible by tapping outside: the upload flow is waiting on an answer, and both
 * buttons are explicit.
 */
export function confirmCastPermission(now: () => Date = () => new Date()): Promise<string | null> {
  return new Promise((resolve) => {
    showAlert(
      CAST_PERMISSION_TITLE,
      CAST_PERMISSION_BODY,
      [
        { text: 'Cancel', style: 'cancel', onPress: () => resolve(null) },
        { text: CAST_PERMISSION_CONFIRM, onPress: () => resolve(now().toISOString()) },
      ],
      { dismissible: false }
    );
  });
}
