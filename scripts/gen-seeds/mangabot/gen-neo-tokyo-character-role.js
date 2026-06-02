#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/neo_tokyo_character_role.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} CHARACTER-ROLE entries for a MangaBot neo-tokyo cyberpunk anime keyframe. Each entry describes the figure(s) in the frame BY ROLE only, never by name. Akira / Ghost-in-the-Shell / Edgerunners / Blade-Runner / Bubblegum Crisis cyberpunk archetypes. Almost always SOLO — neo-tokyo is loneliness amid density.

Each entry: 10-22 words. ROLE + outfit + cyber-signature (visible augmentation or distinguishing gear).

ROLE DISTRIBUTION across 50:
- 22% SOLO CYBERED PUNK (street-coded — leather/synth-jacket, dyed hair, visible cyber-augment)
- 15% LONE NETRUNNER / HACKER (hooded, cybered-eye, mobile terminal, signature jacket)
- 12% CORPORATE SUIT (sleek trench, cyber-shades, salaryman with implant ports)
- 10% YAKUZA ENFORCER (irezumi-tattoo visible, dark suit, cyber-pistol holster)
- 10% RONIN-DETECTIVE (trench-coat cyber-noir, cigarette, weathered face, cyber-eye)
- 8% SHRINE MAIDEN WITH CYBER-AUG (traditional miko-robe + cybernetic arm or eye)
- 6% STREET KID / SCAVENGER (oversized jacket, goggles, mobile drone-pet at heel)
- 6% REPLICANT-STYLE ANDROID (subtly synthetic, glitch-eyes, perfect motion)
- 5% CYBER-MEDIC / RIPPERDOC (medical apron, surgical-grade visor, cyber-tools)
- 4% MAGE-IN-CYBERPUNK (wandering occult figure, prayer-beads + cyber-implants — Mononoke-meets-cyberpunk)
- 2% PAIR — RARE (lover meeting in rain, partner-runners, two friends mid-conversation)

DO write:
- A solo cybered punk in a battered red synth-jacket with dyed-cyan hair and a visible chrome forearm-implant
- A lone hooded netrunner with a glowing cyber-eye and a mobile terminal slung across the chest, fingers dancing on virtual keys
- A corporate suit in a sleek black trench-coat with mirrored cyber-shades and a cable-port visible at the temple
- A yakuza enforcer in a tailored dark suit, irezumi-tattoo visible at the open collar, cyber-pistol holstered at the hip
- A ronin-detective in a long weather-stained trench-coat, cigarette glowing, cyber-eye casting faint light onto a stubbled jaw

DO NOT write:
- Named characters (Motoko / Kaneda / V / etc.)
- Modern dress without cyber-coding (must read cyberpunk-specific)
- Multiple-figure groups (>3) — keep to 1-2 for composition readability
- Sexualized / fetishy framing
- Specific facial features locking a particular look

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
