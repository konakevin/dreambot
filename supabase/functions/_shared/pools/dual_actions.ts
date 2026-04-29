/**
 * Dual character action pools — relationship-aware pose seeds for two-person renders.
 *
 * COMPANION: universal pool for any two people sharing a scene.
 * PARTNER: additional pool for romantic partners only — comfortable intimacy, not cheesy.
 *
 * Every entry must:
 *   - Describe what BOTH characters are doing (left person + right person)
 *   - Keep heads on separate sides (no leaning into each other)
 *   - Describe BODY POSE only — face direction is overridden by the brief
 *   - Feel natural and integrated into the environment
 */

export const DUAL_ACTIONS_COMPANION: string[] = [
  'one crouching to examine something on the ground, the other standing nearby scanning the distance',
  'both walking side by side, one gesturing ahead while the other looks where they are pointing',
  'one leaning on a railing looking out, the other standing back taking in the wider view',
  'one stepping forward to touch a surface or object, the other pausing mid-stride behind them',
  'both stopped mid-walk, each looking at different things that caught their attention',
  'one reading a sign or inscription, the other looking past it at something further away',
  'one shielding their eyes from light and looking up, the other looking out at ground level',
  'one adjusting their gear or bag, the other standing with hands in pockets taking in the surroundings',
  'both walking at slightly different paces, the one ahead glancing back over their shoulder',
  'one sitting on a ledge or step, the other standing beside them with arms crossed looking outward',
  'one photographing something with a camera, the other watching the thing being photographed',
  'both standing still, caught in a moment of quiet awe at something in front of them',
  'one stepping carefully over uneven ground, the other already past the obstacle looking ahead',
  'one holding something up to inspect it in the light, the other watching curiously from a step behind',
  'both mid-stride through the scene, bodies angled slightly toward each other but looking forward',
  'one standing at the edge of a drop or overlook, the other a few steps back on safer ground',
  'one pushing through a doorway or passage, the other waiting their turn behind them',
  'both looking up at something towering above them from slightly different angles',
  'one kneeling to tie a boot or adjust something, the other standing guard and looking around',
  'one reaching up toward a high object, the other watching from below with head tilted',
  'both carrying equipment or supplies, mid-journey through the scene',
  'one checking a device or instrument, the other looking out at what it might be measuring',
  'one tracing a finger along a wall or surface, the other peering ahead into the next space',
  'both paused at a fork or junction, each looking down a different path',
  'one climbing a slight elevation, the other waiting at the base looking up at them',
  'one bracing against wind or weather, the other turned slightly away from the same gust',
  'both emerging from shadow into light, one slightly ahead of the other',
  'one stopped to catch their breath with hands on knees, the other already looking at what is ahead',
  'one pointing something out low and to the side, the other following their gesture and looking',
  'both standing in a wide open space, each oriented toward different points of interest',
  'one opening or pushing something aside, the other peering around them to see what is revealed',
  'one drinking from a canteen or cup, the other gazing into the middle distance',
  'both walking with purpose through the environment, determined stride',
  'one picking something up off the ground, the other looking back the way they came',
  'one mid-step onto a new surface or platform, the other still on the previous level',
  'one examining a detail on a wall with one hand raised, the other standing nearby with arms crossed',
  'both resting against opposite sides of a pillar or structure, looking in different directions',
  'one waving or signaling toward something unseen, the other following the signal with their eyes',
  'both standing at a threshold, hesitating before stepping through',
  'one sketching or writing something, the other peering over at the scene being depicted',
  'one reaching into a space or container, the other standing by with hands ready to help',
  'both framed by a bright opening, one slightly ahead of the other',
  'one testing the ground ahead with a careful step, the other watching their footing',
  'one stretching or rolling their shoulders, the other looking at something interesting nearby',
  'both navigating a narrow path, one slightly ahead, both aware of their surroundings',
  'one has stopped to listen to something, head slightly tilted, the other still looking around visually',
  'both seated on separate surfaces at slightly different heights, each absorbed in the view',
  'one steadying themselves against a wall, the other walking freely through the same space',
  'one glancing down at their own reflection in water or glass, the other looking beyond it',
  'both arriving at a destination, one already taking it in, the other just catching up',
];

export const DUAL_ACTIONS_PARTNER: string[] = [
  'walking close together, shoulders almost touching, both looking at the path ahead',
  'sitting side by side, comfortable silence, each looking at slightly different parts of the view',
  "one has their arm loosely around the other's waist as they both look out at the scene",
  'standing close, one murmuring something, the other smiling slightly without turning',
  'both holding the same railing or ledge, hands close but not touching, looking outward',
  "one adjusting the other's collar or hat absentmindedly while looking past them at something",
  'both stopped mid-walk, standing close, each noticing something different in the scene',
  'sharing a drink or food, one handing it to the other without looking, both watching the view',
  'one with chin resting on their own hand, watching the other explore something nearby',
  "walking in step, one slightly behind with a hand on the small of the other's back",
  'standing near each other at a scenic overlook, one leaning on the railing, the other standing with arms crossed',
  'one reaching a hand back for the other while navigating tricky footing, looking ahead',
  'both laughing at something neither is looking directly at, caught mid-reaction',
  'one tucking hair behind their own ear while the other watches the scenery',
  'standing at a window or opening, one behind the other, both absorbed in what is outside',
  'sitting together on a blanket or bench, knees almost touching, both looking forward',
  'one holding an umbrella or shade, the other leaning slightly into the shade while looking elsewhere',
  'both squinting at the same distant thing, the comfortable synchronicity of a long partnership',
  'one absentmindedly fixing their sleeve while the other stands close, looking at the same horizon',
  'walking slowly through the scene, unhurried, the pace of two people who are not in a rush',
  'both leaning forward on a railing, elbows on the rail, standing close, looking at the same thing from slightly different angles',
  'one gesturing to explain something about the scene, the other listening with their body angled toward the speaker but eyes on the scene',
  'sharing a quiet moment, no words needed, just proximity and the same view',
  'one pointing something out in the distance, the other stepping closer to see it from the same angle',
  'both arriving somewhere for the first time, one scanning left, the other scanning right, standing close',
];

/**
 * Pick a dual action seed based on the plus_one's relationship.
 * Partner/significant_other: 30% romantic pool, 70% companion pool.
 * Everyone else: companion pool only.
 */
export function pickDualAction(relationship: string | undefined): string {
  const isPartner = relationship === 'partner' || relationship === 'significant_other';

  if (isPartner && Math.random() < 0.3) {
    return DUAL_ACTIONS_PARTNER[Math.floor(Math.random() * DUAL_ACTIONS_PARTNER.length)];
  }
  return DUAL_ACTIONS_COMPANION[Math.floor(Math.random() * DUAL_ACTIONS_COMPANION.length)];
}
