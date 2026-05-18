#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/castle_scale_prover.json',
  total: 200,
  append: true,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} TINY-SCALE-PROVER entries for DragonBot's castle path. Each entry is a SHORT DENSE phrase (15-30 words) describing ONE tiny element in the frame that PROVES the immense scale of the castle behind it.

⚠️ THE BAR: every entry produces a scene where the castle in the background reads as MASSIVE because of the tiny scale-prover in the foreground. The scale-prover is SMALL (5-15% of frame max) — its job is to make the castle look enormous by comparison. Think Lord-of-the-Rings establishing shot: tiny rider on a horse on the hilltop, vast castle filling the horizon.

🚫 NO PROPER NOUNS / NO BRANDED CHARACTERS / NO POSITIONING TOWARD the castle (no "facing the castle", "approaching the castle" — that comes from the template).

✓ ALWAYS describe the scale-prover IN ITS OWN RIGHT — what it is, what it's doing, where it is. The TEMPLATE will place it relative to the castle.

━━━ SCALE-PROVER CATEGORIES (distribute ${n} across):

LONE RIDER / TINY FIGURE ON HORSEBACK (~4):
- a single tiny silhouetted rider on horseback on a distant ridge, cloak fluttering in the wind, dawn light backlighting them
- a lone armored knight on horseback in the middle distance, banner-pole raised, painted-gold sunset behind
- a small caravan of three horsemen winding along an ancient mountain road in the deep midground, dust trail visible
- a hooded pilgrim leading a horse on foot along a winding road, the horse-and-rider tiny against the vast backdrop

DRAGON OR FLYING CREATURE AT DISTANCE (~3):
- a distant silhouetted dragon arcing through the sky high above, wings outstretched, sun-glinting along its spine
- a small swarm of wyverns wheeling far overhead, dark V-shapes against a painted-gold sky
- a single great eagle soaring at midground height, wings spread wide, golden-hour light backlighting feathers

SHIPS / BOATS IN HARBORS OR SEAS (~3):
- a tall-masted galleon at the foot of a sea-cliff, sails set, leaving a wake across a calm bay
- a small fishing boat with a single tattered sail crossing a moonlit lake, mist drifting on the water
- a fleet of three distant longships approaching a coastal castle from across a stormy sea

TINY VILLAGE / SETTLEMENT AT THE BASE (~3):
- a tiny medieval village clustered around the base of the cliff, smoke rising from a dozen chimneys, mill-wheel visible at the river
- a small cluster of stone cottages and wheat-fields tucked into a valley below, ant-sized in scale
- a tiny harbor town huddled at the foot of a coastal castle, lantern-lights twinkling, fishing boats moored

ANIMAL HERDS / WILDLIFE AT SCALE (~3):
- a small herd of elk drinking from a stream in the foreground, ant-sized against the vast background
- a single white stag standing on a hilltop in the deep midground, antlers proud against the painted-gold sunset
- a flock of distant ravens wheeling over the castle approach, dark specks against the dramatic sky

BATTLE / ARMY AT MASSIVE DISTANCE (~3):
- a tiny advancing army column on the distant road approach, banners catching the wind, dust-cloud rising behind them
- a small encampment of distant siege-tents pitched on the plain below the castle, campfire-smoke pluming
- two distant armies converging on the field far below, looking like ant-colonies in motion

NATURAL FEATURES / ATMOSPHERIC ANCHORS (~3):
- a single weathered oak tree on a foreground hill, gnarled branches silhouetted against the painted sky
- a tiny waterfall cascading from the castle's outer wall into a chasm below, mist plume rising
- a single moss-covered standing-stone in the foreground meadow, ancient runes visible on its weathered face

ANCIENT RUINS / FOREGROUND ARTIFACTS (~3):
- a crumbling stone archway in the foreground meadow, ivy-vines cascading over weathered stones, framing the castle behind
- a single fallen statue of an ancient hero half-buried in moss in the foreground, ruined columns scattered around
- weathered stone steps cut into a foreground hillside, ascending toward a vanishing point, scale-implied

EACH entry MUST be:
- 15-30 words
- ONE specific tiny element (5-15% of frame max)
- ZERO castle mention (template places it relative to castle)
- Scale-prover language (tiny / silhouetted / distant / ant-sized / in the foreground)
- Atmospheric (golden hour / dawn / dusk / silhouetted)

Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
});
