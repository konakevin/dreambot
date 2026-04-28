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
  thumb_url: string;
  description: string;
  /** Explicit gender set at describe-photo time — preferred over regex inference */
  gender?: 'male' | 'female';
  /** Concise physical traits summary from Haiku vision — saved at describe-photo time */
  physical_summary?: string;
  relationship?: string;
}

export interface ResolvedCastMember {
  role: string;
  promptDesc: string;
  genderLock: string | null;
  sourcePhotoUrl: string;
  physicalTraits: string;
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

      // Determine gender: explicit field > regex fallback
      let gender: 'male' | 'female';
      if (member.gender) {
        gender = member.gender;
      } else {
        const isFemale = /woman|female|girl|she\b|her\b/i.test(rawDesc);
        gender = isFemale ? 'female' : 'male';
      }

      // Full description passes to Sonnet for ALL modes (natural + embodied).
      // Sonnet + the medium's directive handle style transformation.
      // No more trait extraction — Sonnet is better at translating
      // "full beard, athletic build" into "sculpted clay beard, stocky clay proportions."
      const promptDesc = cleanDesc;

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
        physicalTraits: member.physical_summary || '',
      };
    });
}
