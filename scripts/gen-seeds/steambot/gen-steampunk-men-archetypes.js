#!/usr/bin/env node
/**
 * SteamBot steampunk-man ARCHETYPES (personas) — scale to ~80 (2026-06-27).
 *
 * REPLACES the original recipe, which bundled COSTUME into every persona
 * ("Steam-rifleman in worn leather coat", "Gentleman explorer in dust-flecked
 * khaki, pith helmet") and locked silhouettes by overriding the outfit slot.
 * The approved MVP-25 reseed stripped all clothing — persona = ROLE + DEMEANOR
 * only. This scales it back up while keeping it strictly costume-free.
 *
 * HARD RULE: persona carries a role-noun + a personality/bearing note ONLY.
 * NEVER name clothing, props, weapons, or accessories — those come from the
 * outfit/accessory slots. Scan clean of clothing/prop words after running.
 */
const { generatePool } = require('../../lib/seedGenHelper');

const OUT = 'scripts/bots/steambot/seeds/steampunk_men_archetypes.json';

(async () => {
  await generatePool({
    outPath: OUT,
    total: 80,
    batch: 28,
    maxTokens: 12000,
    append: true,
    metaPrompt: (n) =>
      `You are writing ${n} steampunk MALE personas for SteamBot's steampunk-man path. Each persona = a ROLE/PROFESSION + a short DEMEANOR / BEARING note. ONE handsome Victorian-industrial gentleman per entry.

━━━ ABSOLUTE RULES ━━━
- ROLE + DEMEANOR ONLY. NEVER name clothing, garments, fabrics, hats, props, tools, weapons, or accessories (no coat, jacket, waistcoat, hat, pith helmet, cravat, goggles, rifle, revolver, pistol, sword, cane, pocket-watch, monocle, sextant, satchel, holster, badge, etc.). Clothing and props are handled by SEPARATE systems — naming them here breaks the variety.
- NO nationality / ethnicity / region words.
- Keep them HANDSOME and dignified; vary the bearing (commanding, roguish, scholarly, brooding, charming, intense, calm, eccentric-brilliant, world-weary-but-distinguished). Mixed ages welcome (young prime to distinguished older), all good-looking.
- Format: a short noun-phrase, about 10-18 words, lowercase lead is fine. Just the persona — it gets slotted into "Persona: ___".

━━━ EXAMPLES (mirror exactly — note ZERO clothing/props) ━━━
"a gentleman explorer with an air of rugged, far-traveled determination"
"a brilliant clockwork inventor with a sharp, restless, curious intensity"
"a sky-clipper navigator with calm, seasoned, unflappable authority"
"a dashing privateer captain with an easy, roguish, devil-may-care confidence"
"a distinguished professor of aether-sciences, thoughtful, precise, and quietly commanding"
"a brooding railway magnate with a cool, calculating, self-made hardness"
"a charming stage illusionist with a knowing, mischievous theatrical flair"
"a steely frontier marshal with an unhurried, unbreakable composure"
"a celebrated aeronaut-adventurer with a sunlit, fearless charisma"
"a meticulous master horologist, soft-spoken, exacting, lost in his own brilliance"

━━━ VARIETY MANDATE ━━━
Rotate widely across roles: inventor, navigator, explorer, captain, professor, detective, diplomat, engineer, duelist, financier, surgeon, cartographer, admiral, illusionist, photographer, horologist, test-pilot, naturalist, journalist, harbor-master, architect, gambler, ambassador, researcher, cavalry officer, composer, archaeologist, alchemist, telegraph-operator, locomotive-engineer, big-game hunter, vintner, fencing-master, astronomer, etc. Vary the demeanor every entry.

Return ONLY a JSON array of ${n} strings. No commentary.`,
  });
})();
