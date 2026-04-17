/**
 * Cast Resolver — single gateway between raw cast data and the prompt compiler.
 *
 * No raw `.description` text ever leaks past this module.
 * Natural mediums: full prose description (face swap handles identity).
 * Embodied mediums: buildRenderEntity() transforms to medium-native terms.
 * Gender lock: NON-NEGOTIABLE phrase baked into every resolved cast member.
 */

import { buildRenderEntity } from './renderEntity.ts';

export interface DreamCastMember {
  role: string;
  thumb_url: string;
  description: string;
  /** Explicit gender set at describe-photo time — preferred over regex inference */
  gender?: 'male' | 'female';
  structured_traits?: Record<string, unknown>;
  relationship?: string;
}

export interface ResolvedCastMember {
  role: string;
  promptDesc: string;
  genderLock: string | null;
  sourcePhotoUrl: string;
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
      // Clean markdown formatting
      const cleanDesc = rawDesc
        .replace(/^#.*\n/gm, '')
        .replace(/\*\*/g, '')
        .trim();

      // Determine gender: explicit field > structured_traits > regex fallback
      let gender: 'male' | 'female';
      if (member.gender) {
        gender = member.gender;
      } else {
        const traits = member.structured_traits as Record<string, string> | undefined;
        const isFemale =
          traits && traits.gender
            ? traits.gender === 'female'
            : /woman|female|girl|she\b|her\b/i.test(rawDesc);
        gender = isFemale ? 'female' : 'male';
      }

      // Build medium-native description
      let promptDesc: string;
      if (medium.characterRenderMode === 'embodied' && member.role !== 'pet') {
        // Embodied: full description → trait extraction → template fill
        // NEVER truncate — trait extraction needs hair, beard, build sections
        const entity = buildRenderEntity(cleanDesc, medium.characterRenderMode, medium.key);
        promptDesc = entity.description;
      } else if (member.role === 'pet') {
        // Pets pass through raw in all modes
        promptDesc = cleanDesc;
      } else {
        // Natural: full prose, NEVER truncated
        // Face swap handles facial identity, Sonnet needs body/hair/build cues
        promptDesc = cleanDesc;
      }

      // Gender lock (not for pets)
      let genderLock: string | null = null;
      if (member.role !== 'pet') {
        genderLock =
          gender === 'male'
            ? 'MALE character. Masculine features, build, clothing. Do NOT feminize. Facial hair MUST be visible if described.'
            : 'FEMALE character. Feminine features. Do NOT masculinize or add facial hair.';
      }

      return {
        role: member.role,
        promptDesc,
        genderLock,
        sourcePhotoUrl: member.thumb_url,
      };
    });
}
