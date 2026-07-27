/**
 * Turns a stored Dream Off topic into the exact phrase a player sees.
 *
 * Scene packs store a full faceless subject ("the most cursed sandwich") — shown
 * as-is (first letter lifted). Cast packs store a BARE role ("a battle-worn
 * knight") and the game's cast_mode decides the framing:
 *   single → "You as a battle-worn knight"
 *   couple → "You and your +1 as a battle-worn knight"
 * so one number-flexible deck serves both. Mirrors migration 417/420's model.
 */

import type { PackCategory, CastMode } from '@/types/dreamOff';

function liftFirst(s: string): string {
  const t = s.trim();
  return t.length ? t[0].toUpperCase() + t.slice(1) : t;
}

export function wordTopic(topic: string, packCategory: PackCategory, castMode: CastMode): string {
  if (packCategory === 'cast') {
    const who = castMode === 'couple' ? 'You and your +1 as' : 'You as';
    return `${who} ${topic.trim()}`;
  }
  return liftFirst(topic);
}
