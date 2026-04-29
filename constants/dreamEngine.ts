/**
 * Dream Engine — app-side utilities.
 *
 * Medium and vibe data lives in the dream_mediums and dream_vibes DB tables,
 * fetched via hooks/useDreamStyles.ts. This file only contains the subject
 * invention prompt builder used by the Create screen.
 */

/** Interface for a medium row (from DB via useDreamMediums hook) */
export interface DreamMedium {
  key: string;
  label: string;
  directive: string;
  flux_fragment: string;
  is_character_only: boolean;
  face_swaps: boolean;
}

/** Interface for a vibe row (from DB via useDreamVibes hook) */
export interface DreamVibe {
  key: string;
  label: string;
  directive: string;
}

/**
 * Subject invention prompt for when the user provides no input.
 * Uses their profile interests/aesthetics for flavor.
 */
export function buildSubjectInventionPrompt(
  interests: string[],
  aesthetics: string[],
  spiritCompanion?: string | null
): string {
  const flavorParts: string[] = [];
  if (interests.length > 0) flavorParts.push(`Interests: ${interests.join(', ')}`);
  if (aesthetics.length > 0) flavorParts.push(`Aesthetics: ${aesthetics.join(', ')}`);
  if (spiritCompanion) flavorParts.push(`Spirit companion: ${spiritCompanion}`);
  const flavor =
    flavorParts.length > 0
      ? `\n\nDraw inspiration from this taste profile:\n${flavorParts.join('\n')}`
      : '';

  return `You are DreamBot. The user wants to be surprised with something beautiful to look at. Invent a compelling, visually rich subject for a dream image.

DO NOT be generic. No "a sunset over the ocean" or "a beautiful landscape." Instead, be SPECIFIC and unexpected:
- "A fox wearing a tiny astronaut helmet, floating through a field of bioluminescent jellyfish"
- "An ancient library where the books are growing like trees, their pages rustling with golden light"
- "A street food cart in a rainy cyberpunk alley, steam rising into holographic advertisements"
${flavor}
Output ONLY the subject description, 10-20 words. Nothing else.`;
}
