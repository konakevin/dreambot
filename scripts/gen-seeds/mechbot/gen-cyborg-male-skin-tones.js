#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/cyborg_male_skin_tones.json',
  total: 200,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} SKIN TONE entries for a MALE cyborg path. Each entry is a DENSE phrase (15-25 words) describing the EXACT visual appearance of a cyborg's organic skin — color, undertones, texture, finish, and a subtle sci-fi accent.

━━━ THE BALANCE — neither feminine nor macho ━━━

CRITICAL — these skin tones describe ANY MALE cyborg, of any build. The cyborg's strength comes from his MACHINERY, not from a hyper-muscular body. So skin tones should be:

NEITHER hyper-feminine — ABSOLUTELY NO "delicate", NO "porcelain", NO "graceful", NO "soft features", NO "pretty", NO "beautiful", NO "gorgeous", NO "petal-soft", NO "blush", NO "rose", NO "pink", NO "lavender", NO "peach", NO "coral", NO "fuchsia", NO "magenta", NO "décolletage", NO "ringlets", NO "tresses".

NOR hyper-macho — ABSOLUTELY NO "battle-hardened", NO "warrior-built", NO "rugged-jawed", NO "ironclad", NO "muscular thick", NO "slabs of muscle", NO "broad-shouldered slabs", NO "bodybuilder", NO "warrior strong", NO "hyper-masculine", NO "alpha", NO "macho". Cyborgs are not bodybuilders — strength comes from their machinery, not their muscle mass.

Use NEUTRAL human skin descriptors that work for any adult male body type — slim, average, lean, wiry, sturdy, soft-build, regular human variation. The skin is just SKIN. The sci-fi accent on each entry is what makes it cyborg-coded, not the body language implied by the words.

━━━ SCI-FI ACCENT (every entry must include one) ━━━

Every entry pairs the natural skin tone with a SUBTLE sci-fi twist:
- chrome shimmer at edges / fine alloy filaments at temple / circuit-vein tracery
- subdermal LED glow / faint glowing patches / cybernetic seam at jaw
- alloy reinforcement at brow / chrome ports at neck / fiber-optic lines at temple
- scarring from augmentation surgery / tiny chrome panel insets / nano-tech weathering

━━━ ETHNIC RANGE TARGETS (enforce variety across ${n}) ━━━

Anchor each entry in a real-world ethnicity OR a sci-fi alien skin tone. Coverage targets across 200:
- ~30 deep dark-skinned variations (West African, East African, Sudanese, Caribbean, Aboriginal Australian, Melanesian, etc.)
- ~30 medium brown / olive (South Asian, Middle Eastern, Mediterranean, Latin American, North African, Polynesian, etc.)
- ~25 East Asian / Southeast Asian (Han, Japanese, Korean, Vietnamese, Thai, Filipino, Mongolian, Tibetan, etc.)
- ~25 Indigenous American (Navajo, Inca, Maya, Iroquois, Inuit, etc.)
- ~25 Pale European (Northern, Slavic, Celtic, Nordic, Mediterranean fair)
- ~30 alien / sci-fi colored skin (deep blue, crimson, jade green, copper, bronze, obsidian-black, ash-grey, opaline, gold-tinted, void-purple)
- ~35 sci-fi-modded variations (compression-faded from gravity work, radiation-pale from spacer life, augmentation-scarred, ash-toned, etc.)

━━━ TEMPLATE / STYLE ━━━

Each entry: [ethnic / color anchor] + [skin texture or finish] + [sci-fi accent].

Examples (variety reference, do not copy):
- "Deep umber skin with warm sienna undertones, even-toned finish, faint subdermal LED tracery at temple"
- "Olive skin with dusky undertones, smooth complexion, fine chrome filaments visible along the jaw"
- "Bronze skin with metallic copper undertones, satin finish, vertical augmentation scar across cheek"
- "Pale skin with cool grey undertones, faintly freckled, alloy port at the side of the neck"
- "Deep ebony skin with jet undertones, matte finish, glowing amber circuitry at temple pulse-points"
- "Sun-tanned wheat skin, lived-in texture, faint silver subdermal tracery at the brow"

━━━ RULES ━━━
- 15-25 words each
- Specific real-world ethnicity OR specific alien sci-fi tone
- Always include a sci-fi accent (cybernetic detail / circuit-glow / chrome filament / alloy port / fiber-optic / scar pattern / sub-dermal tracery)
- Variety across ${n} entries — no two skin tones should be near-duplicates
- NEUTRAL adult-male language — neither feminine nor macho
- Strength is the MACHINERY's job; skin is just skin

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
