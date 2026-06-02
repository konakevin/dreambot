#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/cuddly_aquatic_interactions.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} CUDDLY-PAIR INTERACTION descriptions for ChibiBot cuddly-aquatic — the heart-melting CUDDLE MOMENT between two adorable aquatic baby creatures together. The INTERACTION is what the PAIR is doing together right now. Every entry must produce "OMG THEY ARE TOO CUTE TOGETHER" instantly.

Each entry: 15-25 words. ONE specific pair interaction. Active interactive verb + posture/expression detail. NO setting language (separate axis). NO creature descriptions (separate axes).

━━━ WHAT MAKES A GREAT ENTRY ━━━

- Active interactive verb-led — what the PAIR is DOING together (cuddling / nuzzling / holding paws-flippers / sharing / peeking / chasing / nose-bumping / leaning-together / mirroring)
- Body posture + expression detail (eyes squeezed shut / cheeks touching / one's head resting on the other's belly / paws interlocked / curled around each other)
- Implies emotional connection (best-friends / pair-bond / sibling-love / sharing-a-moment / impossible-trust)
- 70% reads as a candid "found-them-like-this" still moment, 30% reads as a delightful peak-cute caught-moment

━━━ CATEGORY DISTRIBUTION ━━━

- 25% physical-contact-cuddle (cheeks pressed together with eyes closed / paws interlocked floating belly-up / one curled around the other's back / wrapped in a shared kelp-blanket / heads stacked nose-to-nose)
- 20% shared-activity (chasing the same soap bubble together / blowing alternating bubbles like a duet / pointing at the same starfish / both squeezing eyes at the same sun-shaft / paddling in matching rhythm)
- 15% one-supports-the-other (older sibling-creature holding the younger's flipper / one balancing the other on its back / one offering a tiny shell-cup to the other / one giving the other a kelp-flower)
- 15% mirror-pose (both peeking from a coral cave with matching surprised eyes / both with bubble crowns floating up / both with starfish on noses / mirrored cheek-blush)
- 10% playful-mischief (one playfully dunking the other / both wrestling in slow-motion bubbles / one tickling the other with a sea-feather / both giggling at a popping bubble)
- 10% sleeping-or-resting-together (curled belly-to-belly asleep on a kelp bed / one snoring softly with the other resting against its side / both floating together with closed eyes / nestled in shared anemone-bed)
- 5% sharing-food-or-treasure (sharing a single sea-grape with two bites / both holding the same tiny shell-coin / both nibbling opposite ends of a strand of sea-grass)

━━━ DEDUP DIMENSIONS ━━━

Dedup by: verb + posture + emotional beat. "cheek-to-cheek with closed eyes" and "pressed cheeks asleep" are duplicates. "cheek-to-cheek" and "paws interlocked floating" are distinct.

━━━ HARD BANS ━━━

- NO setting language (no "in the coral reef" / "at the tide pool")
- NO time/weather
- NO predator-prey / chasing-for-food / fighting / aggressive
- NO single-creature focus (this is a PAIR axis — the interaction must involve both)
- NO creature-species names (creatures are picked separately — describe the action, let the picked creatures fill in the bodies)

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
