/**
 * VenusBot cyborg-fashion path — avant-garde editorial fashion spread.
 * McQueen / Galliano / Schiaparelli / Nick Knight energy. Extreme makeup,
 * extreme couture, extreme pose. Same cyborg character, dressed up.
 */

const fs = require('fs');
const path = require('path');
const pools = require('../pools');
const blocks = require('../shared-blocks');

const MAKEUPS = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'seeds', 'makeups.json'), 'utf8')
);
const CYBORG_FASHION_MOMENTS = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'seeds', 'cyborg_fashion_moments.json'), 'utf8')
);

function characterDNABlock(dna) {
  return `━━━ HER BODY (shared character DNA) ━━━

- Body type / silhouette (MUST land — don't default to runway-thin): **${dna.bodyType}**
- Skin tone tint on organic skin (pores visible): **${dna.skin}**
- Hair: **${dna.hair}**
- Eyes: **${dna.eyes}**
- Internal workings visible through translucent panel: **${dna.internal}**
- Surreal wildcard: **${dna.wildcard}**
- SCENE-WIDE COLOR PALETTE (overrides the default cinematic teal/orange — the WHOLE image should be graded in this palette): **${dna.scenePalette}**
- Secondary lighting palette (supports scene palette above): ${dna.colorPalette}
- DOMINANT GLOW COLOR (every glowing cyborg element — eyes, internal core, circuits — renders in this color): **${dna.glowColor}**`;
}

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const moment = picker.pick(CYBORG_FASHION_MOMENTS);
  const makeup = picker.pickWithRecency(MAKEUPS, 'makeup');

  return `You are a fashion-editorial cinematographer writing CYBORG FASHION scenes for VenusBot — avant-garde editorial spreads featuring the cold-bitch cyborg assassin all glammed up.

TASK: write ONE vivid scene description (60-90 words, comma-separated phrases) of her in the editorial scene below. The output will be wrapped with style prefix and suffix — you produce ONLY the middle scene section.

━━━ WHO SHE IS (same character, now in an editorial spread) ━━━

${sharedDNA.characterBase}

Same character. Still cold, still mean, still mysterious, still the cyborg killer. She is now the subject of an extreme fashion shoot — McQueen Plato's Atlantis, Galliano-Dior couture, Schiaparelli surrealism, Pat McGrath extreme makeup, Nick Knight editorial photography. Nothing is off limits in terms of bizarre or crazy looks. Her cyborg body and machine-nature remain fully visible — she is dressed UP, not disguised.

${blocks.REQUIRED_ELEMENTS_BLOCK}

${blocks.SKIN_MATERIAL_NUANCE_BLOCK}

${characterDNABlock(sharedDNA)}

━━━ THE EDITORIAL SCENE ━━━

${moment}

━━━ EXTREME EDITORIAL MAKEUP (must appear — override any makeup hints in the scene above) ━━━

${makeup}

${blocks.SOLO_COMPOSITION_BLOCK}

${blocks.HOT_AS_HELL_BLOCK}

━━━ MOOD ━━━

${vibeDirective.slice(0, 200)}

${blocks.SURREAL_EFFECTS_BLOCK}

Output ONLY the 60-90 word scene, comma-separated, no preamble, no quotes.`;
};
