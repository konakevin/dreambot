#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/shonen_action_action.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} SHONEN ACTION entries — peak-combat moments captured at loaded instant. FORWARD-FACING ONLY.

⚠️ Multi-effect mandate: each entry stacks PRIMARY ACTION + body-orientation + power-release cue.

Each entry: 16-26 words. Action + body torque + power-release cue + facial register.

VARIETY:
- 22% MID-STRIKE TOWARD VIEWER (mid-strike with katana arcing toward camera / mid-punch with chi-fist blasting forward / mid-cut with crossing-slash mid-arc)
- 18% MID-CAST POWER-BLAST (mid-cast palms-forward with massive energy-blast erupting / mid-finger-snap with explosion radiating / mid-hand-seal with rune-circle materializing)
- 16% MID-LEAP FORWARD (mid-leap toward viewer with weapon raised overhead / mid-vault from ground forward / mid-aerial mid-strike captured at apex)
- 12% MID-COUNTER (mid-block forward with weapon braced / mid-parry with sparks flying toward viewer / mid-deflect with afterimage trailing)
- 10% MID-DASH (mid-dash toward camera blurred-edge / mid-charge full-tilt forward / mid-rush with weapon trailing motion-blur)
- 8% PROFILE PEAK-ACTION (full side-profile mid-strike with weapon-arc / profile mid-leap with cape billowing / profile mid-charge with power-trail)
- 6% MID-SPIN (mid-spin with weapon-arc encircling / mid-pirouette mid-strike / mid-twirl with power-orbit)
- 4% MID-POWER-UP (mid-power-up with aura blazing around / mid-charge with hands cupped at chest gathering / mid-scream-of-power forward)
- 4% MID-SUMMON (mid-summon with familiar erupting from rune-circle in front / mid-call-of-spirit forward / mid-shikigami-release)

DO write:
- Mid-strike with crimson katana arcing toward viewer, body torqued three-quarter forward, fierce-determined face mid-shout, blood-mist trail
- Mid-cast palms-forward with massive cyan energy-blast erupting from joined hands at viewer, eyes burning with rune-glow, hair lifted by power-wave
- Mid-leap forward toward camera at apex, weapon raised overhead trailing afterimage, cape billowing behind, face mid-roar
- Mid-counter braced forward with weapon-locked toward viewer, sparks erupting from clashing edges, jaw set determined
- Mid-dash toward camera with motion-blur edges, weapon trailing power-streak, hair and coat snapping back

DO NOT: "walking toward enemy in distance" / "approaching the boss" / "looking out over battlefield" — back-to-camera traps. Shirtless / oiled / sweat-gleaming / chest-revealing. Visible enemy with blood. Multiple actions per entry.

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
