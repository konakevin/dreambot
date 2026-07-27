/**
 * Turns a stored Dream Off topic into the exact playful phrase a player sees.
 *
 * Scene packs store a faceless subject ("a cute taco playing in a mariachi band")
 * and get a playful directive frame → "Show me a cute taco playing in a mariachi
 * band". Cast packs store a BARE role ("a battle-worn knight") and the game's
 * cast_mode decides the framing:
 *   single → "You as a battle-worn knight"
 *   couple → "You and your +1 as a battle-worn knight"
 * so one number-flexible deck serves both. Mirrors migration 417/420's model.
 *
 * NOTE: DISPLAY-ONLY. The scene RENDER prompt uses the raw topic (no "Show me"
 * lead-in); only cast renders use the worded "You as…" framing.
 */

import type { PackCategory, CastMode } from '@/types/dreamOff';

export function wordTopic(topic: string, packCategory: PackCategory, castMode: CastMode): string {
  const t = topic.trim();
  if (packCategory === 'cast') {
    const who = castMode === 'couple' ? 'You and your +1 as' : 'You as';
    return `${who} ${t}`;
  }
  return `Show me ${t}`;
}
