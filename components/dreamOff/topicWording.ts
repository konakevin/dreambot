/**
 * Turns a stored Dream Off topic into the phrase a player sees as their BASE SCENE.
 *
 * This is a starting point, not a finished prompt — everyone in the game shares it
 * and adds their own "spin" (see app/game/[id]/entry.tsx). So scene packs display
 * the raw subject as-is (just capitalized): "A cute taco playing in a mariachi
 * band" — NOT "Show me …", which read like a copy-paste command. Cast packs store
 * a BARE role ("a battle-worn knight") and the game's cast_mode frames who's in it:
 *   single → "You as a battle-worn knight"
 *   couple → "You and your +1 as a battle-worn knight"
 * so one number-flexible deck serves both. Mirrors migration 417/420's model.
 *
 * NOTE: DISPLAY-ONLY. The RENDER prompt is built server-side in dream-off-submit
 * (authoritative base + the player's spin); this never feeds a model.
 */

import type { PackCategory, CastMode } from '@/types/dreamOff';

function capitalizeFirst(s: string): string {
  return s.length > 0 ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export function wordTopic(topic: string, packCategory: PackCategory, castMode: CastMode): string {
  const t = topic.trim();
  if (packCategory === 'cast') {
    const who = castMode === 'couple' ? 'You and your +1 as' : 'You as';
    return `${who} ${t}`;
  }
  return capitalizeFirst(t);
}
