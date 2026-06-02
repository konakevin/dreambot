#!/usr/bin/env node
/**
 * SHARED final-boss pool for ToyBot.
 *
 * Pool of intimidating ENEMY-TOY descriptions that can be swapped into
 * any path's cast at render time to create epic toy-battle moments.
 * Medium-agnostic — each boss is a "toy" but the format/material is
 * left flexible so the receiving path's medium (Funko Pop / action
 * figure / claymation / etc.) can absorb it.
 *
 * Each entry: 24-40 words. Describes ONE final-boss enemy toy: form,
 * scale, menace, pose, signature visual. NO scenes — that comes from
 * the receiving path's scenario pool.
 */
const { generatePool } = require('../../lib/seedGenHelper');

const TOTAL = parseInt(process.env.TOTAL, 10) || 25;
const APPEND = process.env.APPEND === 'true';

generatePool({
  outPath: 'scripts/bots/toybot/seeds/final_bosses.json',
  total: TOTAL,
  batch: Math.min(TOTAL, 25),
  append: APPEND,
  metaPrompt: (
    n
  ) => `You are writing ${n} FINAL BOSS ENEMY TOY descriptions for ToyBot. These are THE ANTAGONIST in a toy-scale epic battle scene — Godzilla-style kaiju, demon-lord titans, giant mecha bosses, ancient evil entities, alien overlords, dragon final-bosses. The pool is SHARED across all toy paths — each entry will plug into a path's hero cast (Funko Pop / action figure / claymation / mech-toy / etc.) to compose a clash scene.

Each entry: 24-40 words. Comma-separated phrase clusters. NO sentences with periods.

━━━ FORMAT ━━━
"{BOSS-TYPE TOY}, {visual signature — material / paint / proportions}, {scale cue — towering 3-5x hero size, massive, looming}, {menace pose / action — mid-roar / mid-stomp / mid-cast / arms raised}, {iconic accessory — weapon / glowing core / crown / minion}"

━━━ EXAMPLES (vibe — generate FAR more variety) ━━━
- "Massive Godzilla-style kaiju toy, weathered emerald-scale paint with bone-white dorsal spikes, towering 5x hero size, mid-roar with jaws wide and clawed arms raised, atomic-blue glow rising from its throat"
- "Giant crimson mecha boss figure, articulated armor plates with battle-scorch weathering, towering 4x hero size, chest-mounted cannons charging mid-fire, jagged shoulder-spikes catching dramatic backlight"
- "Skeletal lich-king toy with bone crown and tattered purple-velvet cape, gripping a staff topped with a glowing cyan crystal core, towering 3x hero size, hollow eye-sockets blazing with ghost-fire"
- "Eight-tentacled kraken toy with rubbery slime-green tentacles and barnacle-encrusted suction cups, suction arms wrapping around a real toy boat, glistening wet vinyl, mid-grasp menace"
- "Ancient demon-lord figure carved like obsidian volcanic glass with crackling lava-veins through the body, towering 4x hero size, holding a flaming greatsword the size of a hero figure, curled horns scraping the sky"
- "Cybernetic alien overlord with chrome-spider legs and a glowing-purple eye-cluster head, towering 3x hero size, rear leg poised to strike, energy-cables hanging from beneath"
- "Massive abominable-snowman yeti toy with shaggy white-faux-fur and frost-rimed claws, towering 4x hero size, mouth open mid-roar with frozen-breath visible, twin glowing-blue eyes"
- "Hellish three-headed dragon toy in molten-bronze finish, each head breathing different flame color (red, blue, green), towering 5x hero size, wing-membrane translucent against dramatic backlight"
- "Possessed ancient stone golem awakened from rubble, each block grinding against neighbors with glowing-amber rune-cracks, towering 4x hero size, fist raised mid-smash"
- "Vinyl Funko-Pop kaiju in classic Godzilla silhouette, oversized cube head with menacing dot-eyes glowing red, scaled Funko-vinyl finish, towering 4x hero size relative to other Funko Pops"
- "Sentient toy-store mannequin gone evil — porcelain face cracked, painted-doll eyes hollow black, towering 3x hero size, articulated joints stiffened in lurching menace pose"
- "Massive zombie-king action figure in tattered armor with rotting paint-flesh detail, towering 4x hero size, undead minions chained to his belt, axe-arm raised mid-swing"
- "Giant mecha-spider boss with eight chrome legs, glowing red optic in central body, towering 4x hero size, web of laser-tripwires emanating from its abdomen"
- "Towering Frankenstein-style abomination toy stitched from mismatched action-figure parts (one head, three arms, four legs), bolt-collar and electrode wires sparking, towering 3x hero size"
- "Insidious clown-puppet boss with cracked porcelain face and chattering wind-up jaw, towering 3x hero size, balloon weapons floating around him, real strings dangling from real puppeteer-bar above"
- "Volcanic-rock golem boss with magma core glowing through stone-cracks, towering 4x hero size, massive stone fists with lava drip, mid-stomp shockwave radiating"
- "Cosmic horror with too-many-tentacles toy, deep-purple iridescent vinyl, towering 5x hero size, eyes-and-mouths sprouting along tentacles, slime-trail of glowing motes drifting behind"
- "Robot-overlord boss in chrome and obsidian armor plating, towering 4x hero size, claw-fingered hand crushing a real soda-can building, glowing-yellow visor slit reading 'TARGET LOCKED'"
- "Mummy-pharaoh toy with golden death-mask and trailing real-fabric bandages, towering 3x hero size, ankh-staff raised summoning sandstorm minions, ruby-red eye-glow"
- "Massive piranha-shark hybrid toy with rows of jagged teeth and slime-green vinyl scales, towering 4x hero size, fin-blades extended, real water-droplets streaming from gills"

━━━ HARD RULES ━━━
- Every entry is the BOSS ONLY — don't describe heroes or scenes. The scene comes from the path's scenario pool.
- Always include a SCALE CUE — "towering 3-5x hero size", "massive", "looming". This is what makes the battle epic.
- Always include a MENACE POSE / ACTION — mid-roar, mid-strike, mid-cast, arms raised, claw extended, etc. Not a static portrait.
- Material/medium language is FLEXIBLE — say "vinyl" or "action figure" or "weathered paint" so it can plug into any path's medium.
- Visual signature must be ICONIC — give it a memorable element (glowing core, weathered scales, crown, cape, multiple heads, etc.).
- VARIETY — span genres: kaiju / demon / mecha / undead / cosmic-horror / dragon / golem / overlord / aliens / mythological / abomination / cursed-toy / etc. Don't cluster on one genre.

━━━ DEDUP ━━━
No two bosses share the same archetype + signature combination.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
