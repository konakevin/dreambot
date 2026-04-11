/**
 * Dream Engine — utility functions for building dream subjects.
 *
 * Medium and vibe data now lives in the dream_mediums and dream_vibes
 * DB tables and is fetched via dreamStyles.ts. This file only contains
 * the scene/subject builder utilities.
 */

import { DREAM_SCENE_TEMPLATES } from './dreamTemplates.ts';

/**
 * Build a concrete dream scene from the user's dream seeds by filling
 * a random template with character/place/thing tokens.
 */
export function buildDreamScene(dreamSeeds: {
  characters: string[];
  places: string[];
  things: string[];
}): string {
  const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  const template = pick(DREAM_SCENE_TEMPLATES);

  // Fill template slots with random seeds, or generic fallbacks
  const character =
    dreamSeeds.characters.length > 0 ? pick(dreamSeeds.characters) : 'a wandering figure';
  const place = dreamSeeds.places.length > 0 ? pick(dreamSeeds.places) : 'a forgotten city';
  const thing = dreamSeeds.things.length > 0 ? pick(dreamSeeds.things) : 'glowing fragments';

  return template
    .replace(/\$\{character\}/g, character)
    .replace(/\$\{place\}/g, place)
    .replace(/\$\{thing\}/g, thing);
}

/**
 * Fallback: AI-powered subject invention for when templates aren't enough.
 * Uses Haiku to riff on seeds — called by the V2 text path.
 */
export function buildSubjectInventionPrompt(
  dreamSeeds: { characters: string[]; places: string[]; things: string[] },
  aesthetics: string[]
): string {
  const allSeeds = [...dreamSeeds.characters, ...dreamSeeds.places, ...dreamSeeds.things];
  const shuffled = [...allSeeds].sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, Math.min(allSeeds.length, 2));

  const seedHint = picked.length > 0 ? `Raw ingredients (use loosely): ${picked.join(', ')}` : '';

  const aestheticHint = aesthetics.length > 0 ? `Aesthetic: ${aesthetics.join(', ')}` : '';

  return `Dream up a scene. Be surreal, impossible, beautiful, unsettling. Surprise me.

${seedHint}
${aestheticHint}

15-30 words. What do we SEE? Output ONLY the scene description.`;
}
