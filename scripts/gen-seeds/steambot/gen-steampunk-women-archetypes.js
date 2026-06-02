#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/steampunk_women_archetypes.json',
  total: 100,
  append: true,
  batch: 12,
  metaPrompt: (
    n
  ) => `You are writing ${n} STEAMPUNK FEMALE ARCHETYPE descriptions for SteamBot's sexy-steampunk-woman path. Each entry is a SHORT phrase (8-15 words) describing WHO this steampunk woman IS — her role, her competence, her edge. NOT what she looks like — WHO she is. These compose with separate makeup/wardrobe/hair/skin/eyes pools.

These women are CAPABLE, DANGEROUS-MAGNETIC, OBVIOUSLY STEAMPUNK — masters of their machines, weathered by the work, sharp-tongued and sharper-minded. NOT damsels, NOT decorations. She built it, fixed it, or she'll dismantle YOU.

━━━ ARCHETYPE SPREAD (enforce variety across ${n}) ━━━
- AVIATION / SKY (6-7) — corseted airship captain commanding a brass-clad sky-vessel, rogue dirigible pilot known across three skies, sky-pirate quartermaster with a gold-toothed grin, balloon-corps navigator who can read storm-fronts, lightning-collector who flies into thunderheads on purpose, gyrocopter courier who outflies bullets, ornithopter test-pilot who walks away from every crash
- ADVENTURE / EXPLORATION (6-7) — Victorian-adventuress just back from somewhere unmapped, expedition leader who lost a leg in the Andes and replaced it with brass, ruin-archaeologist who unearthed something she shouldn't have, glacier-expedition surveyor mapping ice-shelves, jungle-botanist with carnivorous specimens, polar-aurora-chaser, leviathan-hunter with harpoon-cannon
- COMBAT / MILITARY / SABOTEUR (4-5) — armored zeppelin commodore who burns rivals from contested skies, parachute-infantry commander dropping behind lines, aerostat saboteur infiltrating enemy ventilation shafts, gunship-navigator plotting trajectories through cannon fire, monster-hunter with steam-rifle, war-correspondent photographing trenches
- SCIENCE / ALCHEMY / INVENTOR-ADVENTURER (4-5) — mad-scientist inventor with too many goggles and not enough caution, alchemist who turned the family copper into something stranger, Tesla-coil priestess who speaks to electricity, chronoscientist measuring time-fractures, aether-theorist proving the luminiferous medium, galvanic-battery inventor — she carries a field-kit, NOT bolted to a workbench
- POWER / NOBILITY / INTRIGUE (3-4) — exiled industrialist heiress rebuilding her father's empire from scratch, brass-prosthetic countess who ate her uncle's company in a hostile takeover, smuggler-journalist running banned pamphlets through checkpoints, deposed railroad-heiress sabotaging her cousin's empire, newspaper-magnate exposing corruption

━━━ RULES ━━━
- Each entry is WHO she is, not WHAT she looks like
- Write like pitching a character to a steampunk-novel director
- CAPABLE and DANGEROUS — she earns her place. Power, competence, edge
- Steampunk-identity unmistakable — every archetype rooted in brass / gas / steam / clockwork / aviation / aether
- ABSOLUTELY NO factory workers / industrial laborers — NO mechanics-at-machines, NO machinists, NO smiths, NO operators (subway-bore / hydraulic-press / steam-hammer / piston-engine), NO calibrators, NO foremen, NO drivers (locomotive / rail-spike), NO refinery-floor workers. If she has technical skill, she's a SCIENTIST or INVENTOR-ADVENTURER who CARRIES her instruments INTO the field, never bolted to factory machinery.
- No named IP (no Lara Croft, no Bayonetta, no Howl by name)
- SAFETY: avoid "seductress", "femme fatale violence", "kills victims" — focus on her CAPABILITY and PRESENCE

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
