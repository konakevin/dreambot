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
 *   - Both characters STATIONARY — no walking, stepping, navigating, arriving
 *   - Both characters roughly SIDE BY SIDE — not one behind the other
 */

export const DUAL_ACTIONS_COMPANION: string[] = [
  // ── Standing separated, static poses ──
  'one leaning on a railing, the other standing a few feet away with arms crossed',
  'one crouching to examine something on the ground, the other standing nearby with one hand on their hip',
  'one sitting on a ledge or step, the other standing beside them with arms crossed',
  'one adjusting their gear or bag, the other standing with hands in pockets',
  'one photographing something with a camera held at chest level, the other standing beside them pointing at something off to the side',
  'both standing still, one with hands at their sides, the other with one hand resting on their hip',
  'one standing at the edge of a drop or overlook, the other a few steps back on safer ground',
  'both looking up at something towering above them from slightly different angles',
  'one kneeling to tie a boot or adjust something, the other standing beside them with hands on hips',
  'one reaching up toward a high object, the other standing nearby with arms folded',
  'one checking a device or instrument, the other standing beside them looking at the same thing',
  'both standing in a wide open space, one with hands on hips, the other shielding their eyes',
  'one examining a detail on a wall with one hand raised, the other standing nearby with arms crossed',
  'both resting against opposite sides of a pillar or structure',
  'one waving or signaling toward something unseen, the other standing with their arms at their sides',
  'one sketching or writing in a notebook, the other standing beside them with a cup in hand',
  'one reaching into a bag or container, the other standing by with hands ready to help',
  'one stretching or rolling their shoulders, the other standing still with arms crossed',
  'one standing with head slightly tilted listening to something, the other standing still beside them',
  'both seated on separate surfaces at slightly different heights, one with legs stretched out, the other with arms on their knees',
  'one leaning against a wall with arms folded, the other standing a few feet away adjusting their jacket',
  'both standing at a balcony railing, one with elbows on the rail, the other standing upright with hands in pockets',
  'one adjusting their hat or sunglasses, the other standing nearby drinking from a cup',
  'one with a hand resting on a post or column, the other standing a few steps away checking a device',
  'both seated on a bench, one with legs crossed, the other leaning forward with elbows on knees',
  'one standing with a bag slung over one shoulder, the other beside them stretching one arm overhead',
  'both standing in waist-deep grass or flowers, one brushing a hand through the plants, the other standing still',
  'one perched on a rock or boulder, the other standing beside it with one hand resting on the stone',
  'one holding a lantern or light source at their side, the other standing nearby with hands in jacket pockets',
  'both standing at a market stall or counter, one examining an object, the other resting an elbow on the surface',
  'one with their hands behind their head stretching, the other standing with arms crossed',
  'both standing under a large tree, one leaning against the trunk, the other standing free with a hand on their chin',
  'both standing at the edge of water, one with hands in pockets, the other bending slightly to look at the surface',
  'one holding something up for the other to see, both standing a couple feet apart',
  'both leaning on opposite ends of the same fence or railing',
  'one standing with their weight on one leg, the other nearby with feet planted and arms crossed',
  'one holding a map or device at chest height, the other standing beside them pointing at something on it',
  'both standing under an archway, one with their back against the pillar, the other with a hand resting on the stone',
  'one sitting on a low wall, the other standing beside them with one foot up on the wall',
  'one shielding their eyes from light, the other standing beside them with arms at their sides',
  'one reading a sign or inscription, the other standing beside them looking at the same sign',
  'one holding something up to inspect it in the light, the other standing nearby with a hand on their chin',
  'both standing at a window, one with their hands on the sill, the other standing beside them arms crossed',
  'one crouching beside an animal or plant, the other standing a few feet away with hands in pockets',
  'both standing on a rooftop or elevated platform, one near the edge, the other a few feet back',
  'one pointing something out low and to the side, the other standing beside them looking where they point',
  'one standing with one hand in their pocket and the other gesturing, the second person standing with both hands in pockets',
  'both standing at the base of a large structure, one looking up with hand shading eyes, the other with arms crossed',
  'one rolling up their sleeves, the other standing beside them with thumbs hooked in their belt',
  'both standing under an awning or shelter, one leaning on a support beam, the other standing free',
];

export const DUAL_ACTIONS_PARTNER: string[] = [
  'sitting side by side, comfortable silence, one with chin in hand, the other with arms resting on their knees',
  'both holding the same railing or ledge, hands close but not touching',
  'both standing at an overlook, one with elbows on the railing, the other standing close with arms crossed',
  'one with chin resting on their own hand, the other standing beside them',
  'standing near each other at a scenic overlook, one leaning on the railing, the other standing with arms crossed',
  'both laughing at something, caught mid-reaction, standing a couple feet apart',
  'one tucking hair behind their own ear, the other standing beside them',
  'sitting together on a blanket or bench, knees almost touching',
  'one holding an umbrella or shade, the other standing beside them in the shade',
  'both standing close together, one with arms crossed, the other with hands clasped behind their back',
  'one absentmindedly fixing their sleeve, the other standing close',
  'both leaning forward on a railing, elbows on the rail, standing close',
  'sharing a quiet moment, both looking outward, standing close with no words needed',
  'one resting a hand on a railing, the other standing close with their arms loosely crossed',
  'both standing under a tree, one leaning against the trunk, the other standing close with their shoulder almost touching',
  'both standing still, shoulders close, one with hands in pockets, the other with arms loosely at their sides',
  'both sitting on steps, at slightly different heights, shoulders close',
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
