const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.PIXEL_HORROR_SCENES, 'pixel_horror_scene');
  const lighting = picker.pickWithRecency(pools.PIXEL_HORROR_LIGHTING, 'pixel_horror_lighting');
  const atmosphere = picker.pickWithRecency(pools.PIXEL_HORROR_ATMOSPHERE, 'pixel_horror_atmosphere');

  return `You are writing a 16-bit RETRO PIXEL ART GOTHIC-ACTION GAMEPLAY SCREENSHOT for PixelBot. The frame must read INSTANTLY as a level from a Castlevania / Ghosts 'n Goblins / Black Tiger / Demon's Crest / Splatterhouse-style classic-arcade-era gothic-fantasy action game. NOT modern psychological horror. NOT creeping dread. CLASSIC monster-slaying side-scroller / action vibe.

${blocks.PIXEL_ART_ONLY_BLOCK}

${blocks.NO_IP_REFERENCES_BLOCK}

${blocks.NO_UI_BLOCK}

━━━ THE NORTH STAR ━━━

The viewer should think: "this is a screenshot from an 8-bit / 16-bit gothic-fantasy action game I'd play right now." Stone hallways with candelabras, graveyard arenas with rising skeletons, dragon-caves with treasure piles, vampire castles with stained-glass windows, knight protagonist mid-strike, demons surging from cracked tombs.

Lineage: Castlevania (NES/SNES) + Ghosts 'n Goblins + Ghouls 'n Ghosts + Black Tiger (Capcom) + Demon's Crest + Magical Quest + Splatterhouse + Rondo of Blood + Bloodstained pixel-tribute + Maximo pixel.

━━━ ABSOLUTE CAMERA + COMPOSITION LOCK (NON-NEGOTIABLE) ━━━

Pick ONE per render:
- **HORIZONTAL SIDE-VIEW** (Castlevania / Ghouls 'n Ghosts side-scroller) — character sliced flat across the world, foreground platform, parallax depth behind
- **3/4 ISOMETRIC** (Black Tiger interior chambers / Demon's Crest aerial views) — angled-down on the floor with knight-sprite mid-action
- **TOP-DOWN action-arena** (top-down dungeon-action chambers) — looking down at a tile-floor with knight + enemies

NEVER first-person, NEVER static-vista painting, NEVER concept-art portraits.

━━━ MANDATORY ELEMENTS (every render must include all 4) ━━━

1. **GOTHIC SETTING** — vampire castle hallway, graveyard at midnight, dragon-cave treasure-room, cathedral with toppled pews, crypt-corridor with sarcophagi, demon-realm lava-pit, swamp-witch hut, cursed forest with twisted trees, ruined fortress ramparts, undead arena with bone-piles
2. **CLASSIC FANTASY-ENEMIES on the scene** — skeletons rising from graves, demon-imp with pitchfork, vampire silhouette, gargoyle on a parapet, zombie shambling, ghost float, dragon coiled, lich casting, undead knight, werewolf prowling, harpy in flight, ogre with club
3. **HERO KNIGHT-SPRITE small on the foreground** — armored knight / cloaked vampire-hunter / barbarian / mage with staff — tiny scale, mid-action (sword raised / leaping / casting / drawing crossbow)
4. **GOTHIC-FLAVOR ATMOSPHERIC PROPS** — flickering torches / candelabras / stained-glass windows / hanging chandeliers / iron portcullises / spiked railings / cursed roses / dragon-skull arches / dripping wax / lit braziers / cursed runes / crucifixes / cobwebbed pillars

━━━ THE GOTHIC-ACTION SCENE ━━━
${scene}

━━━ PIXEL LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ 16-BIT RETRO REINFORCEMENT ━━━

Visible chunky pixel grid on every surface. Knight + enemies are sprite-art forms. Stone-tile floors clearly tiled. Dithered shading for stone-volume. NEVER smooth gradients, NEVER painterly hybrid. Saturated gothic palette — deep purples, blood reds, candle-orange highlights, deep blue-black shadows.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION CHECKLIST ━━━
- Camera: side-view OR 3/4 iso OR top-down (NEVER first-person / vista / portrait)
- Gothic setting (castle / graveyard / cathedral / crypt / dragon-cave / etc.)
- Classic fantasy enemy in the scene mid-action
- Hero knight-sprite small on the floor mid-action
- Gothic flavor props (torches / candelabras / stained-glass / etc.)
- Animated particles (drifting bats / falling cobwebs / dripping wax / sparks / lightning-flash)
- Chunky 16-bit pixel grid throughout

The viewer should think: "this is a screenshot from a Castlevania / Ghosts 'n Goblins-style game I'd play right now."

Output ONLY the raw 70-95 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**.`;
};
