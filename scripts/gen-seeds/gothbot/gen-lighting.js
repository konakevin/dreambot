#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/lighting.json',
  total: 200,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} LIGHTING descriptions for GothBot — the specific light-source + quality of light + how it interacts with the scene. Entries 12-22 words. Gothic chiaroscuro + twilight color + occult-source variety.

━━━ AESTHETIC NORTH STAR ━━━
Castlevania / Bloodborne / Van-Helsing / Crimson-Peak / Berserk / WoW-undead-warlock-art lighting. Dramatic chiaroscuro with TWILIGHT COLOR — the night is vibrant, not flat-gray. Moon-and-candle-and-stained-glass-and-occult-glow are all in play. Lighting SHAPES the scene's emotional tone.

━━━ HARD DISTRIBUTION (200 pool — enforce spread across sources) ━━━

MOONLIT (min 30) — the spine of gothic lighting:
- Full moon silver casting sharp shadows across courtyard
- Crescent sliver with pale-violet horizon glow
- Pale-violet full moon dominant in sky (Nightshade style — NOT blood-red)
- Eclipsed moon with corona halo and deep shadow
- Moon partially veiled by drifting cloud, soft silver diffuse
- Moonlight through bat-swarm silhouette
- Reflected moonlight on black lake surface
- Moon-through-violet-stained-glass casting violet moonbeams
(Note: blood-moon red lighting is HARD CAPPED at max 10 entries in the 200 pool — the default moon is silver-violet or pale-white)

TWILIGHT (min 20) — the magic hour:
- Violet-horizon dusk with first stars emerging
- Indigo-and-rose dusk with cathedral silhouette
- Crimson-ember dusk before night fall
- Dusk-violet cloud-break revealing first moon-rise
- Twilight-gold fading into deep-indigo
- Magic-hour dusk with long-reaching shadows across courtyard
- Pre-night twilight-lavender washing over gothic gardens

CANDLELIT (min 18):
- Single candle on skull casting single shadow-figure
- Candelabra cluster on dining-table with dust-motes
- Taper-procession line illuminating crypt corridor
- Ritual-candle perimeter around summoning-circle
- Chandelier swarm of candles throwing gold light
- Candle-in-lantern held by silhouette at distance
- Candle-flicker on wet cobblestones
- Skull-candle with flame from eye-socket
- Black-candles in silver holders casting blue-wax light

STAINED-GLASS FILTERED (min 15) — prefer violet / emerald / sapphire, not crimson-dominant:
- Rose-window projecting radial violet-and-emerald beams across flagstones
- Violet-pane casting single amethyst shaft over altar
- Emerald-pane filtering green-saturated light through cathedral
- Multi-hue cathedral window throwing violet-and-blue jewel-spectrum on stone floor
- Stained-glass fragments cast across a courtyard after shatter
- Backlit stained-glass-window with figure silhouetted
- Sapphire-pane casting deep-blue shaft through swirling incense
- Fel-green stained-glass dome casting poisonous light on flagstones
(Crimson stained-glass allowed only in max 2 entries — NEVER the default)

FIRE / EMBER (min 15):
- Torchlit hallway with fire-shadows flickering on walls
- Pyre-glow with cinders rising against black sky
- Hearth-glow from one side warming a face
- Ember-dust floating up from snuffed pyre
- Braziers lining a ritual path
- Bonfire with dancing shadow-silhouettes
- Forge-orange from smithy window
- Smoldering-ruin glow from collapsed chapel

OCCULT / MAGIC-LIGHT (min 20) — this is critical for the amped-up feel:
- Witch-fire green glow rising from cauldron
- Fel-green warlock-flame igniting at palm
- Violet spell-circle glowing on floor
- Soul-shard-white pulse at throat-pendant
- Necromantic pale-blue glow from raised-bone
- Void-purple rift tearing open dark air
- Death-knight runic-blue glow from blade
- Banshee-ethereal white-glow translucent figure
- Blood-sigil crimson-glow drawn mid-air
- Shadow-tendril rising with faint-violet edges

STORM / LIGHTNING (min 12):
- Lightning-flash turning sky stark-white
- Purple lightning afterglow behind silhouetted castle
- Stark-white bolt with thunder and rolling dark clouds
- Storm-cloud with faint lightning glowing from within
- Rain-slicked surface reflecting lightning briefly

DAWN / PRE-DAWN (min 10):
- Cold-blue pre-dawn with mist still thick
- First-light piercing fog over graveyard
- Pre-sunrise pale-grey-blue with dying lantern
- Dawn-crack amber peeking over ruined-cathedral

AURORA / MAGICAL-SKY (min 8):
- Dark-fantasy aurora streaking violet-and-green
- Banshee-wail aurora of pale white waves
- Demonic-corruption sky of fel-green streaks
- Necromantic aurora of pale-blue wisps

BIOLUMINESCENT / CURSED FLORA (min 8):
- Nightshade-bloom glow from beneath witch-garden
- Corpse-lily pale-glow illuminating graveyard
- Witch-orbs drifting lazily above moor
- Bioluminescent mushroom-cluster in forest floor
- Glowing-rune circle cut into flagstone floor

CHIAROSCURO-GENERAL (min 10):
- Deep-shadow foreground + single-key-light subject
- Rembrandt-style single-point illumination
- Shadow-pool surrounding single lit area
- Split-light face-silhouette with dramatic contrast
- Over-shoulder shadow with lit rim-light on subject

━━━ LIGHTING MANDATES ━━━
- Each entry specifies BOTH the source AND the quality/effect
- Nightshade palette first (violet / green / silver / blue / lavender) — red/crimson is RARE accent
- Single-source or dramatic-contrast lighting preferred
- Specific atmospheric interaction (how it hits stone / fabric / fog / water)
- HARD CAP — max 10 entries out of 200 may feature blood-moon-red or crimson-dominant lighting

━━━ RULES ━━━
- Every entry visibly distinct
- No duplicate source + setting combinations
- Gothic + twilight color + dramatic chiaroscuro

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
