#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/beach_episode_action.json',
  total: 25, batch: 25, append: true,
  metaPrompt: (n) => `Write ${n} BEACH-EPISODE ACTION entries — bright joyful summer-vacation mid-moments. FORWARD-FACING ONLY.

⚠️ Never "looking out at horizon" / "walking away toward water" / "back to camera at shoreline" / "facing distant sea" — back-to-camera traps.
⚠️ ANTI-CHEESECAKE: no oiled-sunbathing-poses / no "stretching seductively" / no "lying-back on towel posing" — only bright kinetic vacation activities.

Each 12-20 words. Action + body orientation + face register.

VARIETY:
- 12% SURFING/SWIMMING (mid-surf carving wave with face visible / mid-paddle on board grinning / mid-front-crawl with head up sideways)
- 10% BOOGIE-BOARDING (mid-ride boogie-board face up at viewer with spray / mid-launch into wave / mid-laugh after wipeout)
- 8% SHAVED-ICE-CART (mid-scoop shaved-ice into cup eyes up at viewer / mid-pour syrup with focused grin / mid-hand-cone-over)
- 8% SANDCASTLE (mid-pat sand-castle wall with serious focus / mid-pour bucket into mold / mid-add seashell-detail with grin)
- 8% WADING-MID-LAUGH (mid-wade waist-deep mid-laugh with hands splash / mid-jump-wave with arms out / mid-splash-friend laughing)
- 8% VOLLEYBALL (mid-spike volleyball with arm extended facing camera / mid-receive bump with focus / mid-celebrate point arms up)
- 6% CHASING-CRAB (mid-chase tiny crab with arms reaching down grinning / mid-poke crab with stick / mid-jump-back-laugh)
- 6% COCONUT-POUR (mid-tip coconut into mouth with straw / mid-receive coconut with both hands / mid-cheers two coconuts)
- 6% PADDLING-KAYAK (mid-paddle-stroke in kayak facing camera / mid-laugh-from-kayak / mid-point-at-thing from boat)
- 6% HAND-SPARKLER (mid-light sparkler with bright spark / mid-wave-sparkler in figure-eight / mid-show-sparkler to friend)
- 6% YAKISOBA-EAT (mid-unwrap yakisoba pack / mid-bite skewer-stick face glowing / mid-share-bite with friend)
- 4% WHISTLE-BLOW (mid-blow lifeguard whistle with hand-pointing / mid-cheer-team with raised arm)
- 4% PHOTO-TAKING (mid-snap disposable-camera at off-frame friend / mid-pose-with-camera for selfie)
- 4% TIDE-POOL-PEER (mid-point-into tide-pool with grin / mid-cup-water-with-fish-from-pool / mid-show-shell-to-camera)
- 4% UKULELE/HARMONICA (mid-strum-ukulele on towel with smile / mid-blow-harmonica eyes-closed joy)

DO write:
- Mid-surf carving wave-face with face visible turned to viewer, board-edge biting water, spray rising
- Mid-scoop shaved-ice into paper cup with eyes up at customer-off-frame, spoon mid-arc, syrup-bottle near
- Mid-pat sand-castle wall with serious focus, both hands on tower, grin starting
- Mid-wade waist-deep with hands splashing water toward camera, mouth open mid-laugh
- Mid-spike volleyball with arm extended toward viewer, body airborne, sand kicking up
- Mid-chase tiny crab with arms reaching down grinning, foot mid-skip on wet sand
- Mid-tip green coconut into mouth with paper-straw, eyes closed satisfied
- Mid-paddle-stroke kayak with paddle catching water, face forward at camera bright grin
- Mid-light hand-sparkler facing camera with bright gold-spark, other hand shielding flame
- Mid-bite yakisoba-skewer with cheek-full, eyes squinted joy
- Mid-blow lifeguard whistle with arm extended pointing off-frame, focused alert
- Mid-snap disposable-camera at off-frame friend, camera at eye, free hand mid-wave
- Mid-point-into tide-pool with cupped hand showing tiny crab, grin huge facing camera

DO NOT: walking-away / facing-away-to-admire / looking-out-at-sea / standing-at-shoreline — back-to-camera traps. Cheesecake-suggestive / "lying-back stretching" / "arching-back" / "lifting-shirt" / "wading in lingerie" / oiled-sunbathing. Multiple per entry.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
