/**
 * Cast Resolver — single gateway between raw cast data and the prompt compiler.
 *
 * No raw `.description` text ever leaks past this module.
 * Natural mediums: full prose description (face swap handles identity).
 * Embodied mediums: buildRenderEntity() transforms to medium-native terms.
 * Gender lock: NON-NEGOTIABLE phrase baked into every resolved cast member.
 */

export interface DreamCastMember {
  role: string;
  /** Legacy public URL (un-migrated). New uploads use `storage_path`; both are
   *  hydrated to a fetchable `thumb_url` before this resolver runs. */
  thumb_url?: string;
  /** Object path in the PRIVATE `cast-photos` bucket (migration 292). */
  storage_path?: string;
  description: string;
  /** Explicit gender set at describe-photo time — preferred over regex inference */
  gender?: 'male' | 'female';
  /** Concise physical traits summary from Haiku vision — saved at describe-photo time */
  physical_summary?: string;
  relationship?: string;
}

import { resolveCastGender, genderLockSentence, type CastGender } from './genderLock.ts';
import { sanitizeUserText } from './sanitizeUserText.ts';

export interface ResolvedCastMember {
  role: string;
  promptDesc: string;
  genderLock: string | null;
  /** Resolved gender (explicit field > prose). null for pets / unknown. */
  gender: CastGender | null;
  sourcePhotoUrl: string;
  physicalTraits: string;
  /** Relationship of plus_one to self (partner / friend / parent / sibling / etc.).
   * Gates romantic body language in dual brief — pickDualAction + dualBriefBuilder
   * read this. Previously dropped during resolution, so generate-dream's dual gate
   * received undefined for the entire lifetime of the create path and always took
   * the platonic branch. (Bug found 2026-05-31, fixed by preserving the field.) */
  relationship?: string;
}

export function resolveCastForPrompt(
  members: DreamCastMember[],
  medium: { characterRenderMode: string; key: string }
): ResolvedCastMember[] {
  // Log non-pet members dropped due to missing description (quality signal)
  for (const m of members) {
    if (!m.description && m.role !== 'pet') {
      console.warn(
        `[castResolver] Dropped ${m.role} — empty description (thumb_url: ${m.thumb_url ? 'yes' : 'no'})`
      );
    }
  }

  return members
    .filter((m) => m.description && m.thumb_url)
    .map((member) => {
      const rawDesc = member.description ?? '';
      // Clean markdown formatting + run the full user-text sanitizer. A tampered
      // client can POST an arbitrary cast `description` straight to generate-dream
      // (bypassing describe-photo), and it lands in the Sonnet CHARACTER block —
      // so neutralize prompt-injection / control / zero-width here too. 'vision'
      // cap (generous) so a legit detailed description isn't truncated.
      const cleanDesc = sanitizeUserText(
        rawDesc.replace(/^#.*\n/gm, '').replace(/\*\*/g, ''),
        'vision'
      );

      // Gender — single source of truth (explicit field > prose). Non-pet
      // members with no signal default to male (preserves prior behavior).
      const gender: CastGender | null =
        member.role === 'pet' ? null : (resolveCastGender(member) ?? 'male');

      // Full description passes to Sonnet for ALL modes (natural + embodied).
      // Sonnet + the medium's directive handle style transformation.
      // No more trait extraction — Sonnet is better at translating
      // "full beard, athletic build" into "sculpted clay beard, stocky clay proportions."
      const promptDesc = cleanDesc;

      // Gender lock (not for pets). Positive-led phrasing (see genderLock.ts).
      const genderLock: string | null = gender ? genderLockSentence(gender) : null;

      return {
        role: member.role,
        promptDesc,
        genderLock,
        gender,
        // The `.filter(m => m.thumb_url)` above guarantees this is set at
        // runtime (cast sources are hydrated to a fetchable thumb_url before
        // this resolver runs); the `?? ''` only satisfies the optional type.
        sourcePhotoUrl: member.thumb_url ?? '',
        physicalTraits: sanitizeUserText(member.physical_summary || '', 'vision'),
        relationship: member.relationship,
      };
    });
}
