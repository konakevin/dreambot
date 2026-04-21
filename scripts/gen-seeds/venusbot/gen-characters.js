#!/usr/bin/env node
/**
 * Generate 50 distinct CHARACTER BASE paragraphs for VenusBot — the identity
 * lock rolled per render. Each is a different flavor of the same cyborg-assassin
 * species. Batched via seedGenHelper for intra-pool dedup.
 *
 * Output: scripts/bots/venusbot/seeds/characters.json
 */

const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/venusbot/seeds/characters.json',
  total: 50,
  batch: 5,
  maxTokens: 6000,
  metaPrompt: (n) => `You are writing ${n} CHARACTER BASE paragraphs for a cyborg-female AI render bot called VenusBot. Each paragraph is an IDENTITY LOCK rolled at render time — Flux receives it and renders a CLEARLY MECHANICAL cyborg, not a woman with chrome accents.

━━━ THE CORE CONCEPT (same for all) ━━━

Kevin's frame: "If a sexy machine and a sexy sultry woman had a baby, and then made that baby a mysterious killer — that's what she looks like." She is an exquisite, exotic cyborg-assassin being. Part human or alien, machine to the core. Never poses — eyes the viewer down with cold intent. Sexy as fuck, dangerous as hell.

━━━ WHY VARIANTS ━━━

All paragraphs describe the SAME SPECIES but each is a different FLAVOR / ARCHETYPE / VIBE. Flux clusters if given one identity. Rotating character bases forces variety per render — each has a DIFFERENT body architecture.

━━━ REQUIREMENTS FOR EACH PARAGRAPH ━━━

1. Length: 100-150 words
2. All have same core energy: exquisite, exotic, dangerous, never-poses, eyes-you-down, sexy-as-fuck-dangerous-as-hell
3. Each forces 4-6 SPECIFIC MECHANICAL BODY PARTS — use Flux-friendly visual language like "chrome ball-socket shoulder joints with visible hydraulics," "articulated servo fingers with no flesh," "translucent smoke-grey acrylic torso panel revealing gear clusters + pulsing core," "segmented chrome neck with visible actuators," "transparent skull section revealing circuit mesh," "chrome jawline with segmented articulation"
4. Each has a distinct ARCHETYPE / VIBE — Predator, Gothic Priestess, Street Samurai, Cosmic Oracle, Ice Interrogator, Biomech Dancer, Shadow Broker, Plasma Saint, Carbon Monk, Void Widow, Neon Hunter, Chrome Duchess, Glass Diplomat, Ruined Icon, Quiet Reaper, Mirror Ghost, Fracture Queen, Circuit Courtesan, Gold Vulture, Ash Siren, War Mother, Frost Witch, Obsidian Ambassador, Mercury Dancer, Onyx Handler, Quartz Veil, Rust Angel, Venom Bride, Solar Champion, Umbra Knight — or invent your own archetypes
5. Organic part is locked to face (maybe throat/décolletage). Rest is MACHINE — majority of visible body
6. Face features vary — human in some, exotic alien (iridescent scales, pointed ears, triple irises, elongated cranium) in others
7. NO nudity language — chest is translucent acrylic (showing internals) or chrome plating
8. NO specific skin tone or glow color (those are separate axes rolled at render time)
9. NO specific setting (the path's job)

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
