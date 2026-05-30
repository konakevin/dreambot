#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/shonen_action_battlefield.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} BATTLEFIELD SETTING entries for shonen-action. Active combat arena where hero is mid-strike. Anti-back-to-camera.

Each entry: 14-22 words. Battlefield + tactile foreground + midground depth + combat-engagement context.

VARIETY:
- 16% URBAN-RUIN (collapsing Tokyo skyscraper rooftop / cracked asphalt intersection / shattered overpass / blown-out subway tunnel)
- 14% TRADITIONAL-DOJO/SHRINE (dojo with shattered shoji-walls / shrine-courtyard with broken torii / temple-roof with smoke / engawa veranda mid-collapse)
- 12% SUPERNATURAL-DOMAIN (cursed-domain interior with floating runes / void-realm with crystal-shards / dreamscape with broken constellations / spirit-arena with mist)
- 10% ARENA/STADIUM (combat-arena with spectator-glow / colosseum with banners falling / mech-arena with HUD-rings / underground fight-club with crowd-shadow)
- 10% FOREST/MOUNTAIN (bamboo-grove with shredded stalks / cliff-edge with rain-sheets / volcano-rim with lava-spray / mountaintop with thunderhead)
- 8% INDUSTRIAL/MECH (cyberpunk alley with sparking pipes / mecha-hangar mid-explosion / factory rooftop with smoke / steam-vents-rushing platform)
- 6% SPACE/COSMIC (lunar-surface platform with cracked craters / asteroid-belt walkway / planet-aligned arena / void-bridge with stars)
- 6% UNDERWORLD/HELL (lava-pit arena with rising heat / hell-court with bone pillars / cursed-tomb with floating bones / shadow-realm with dark-pools)
- 6% ICE/SNOW (frozen-lake combat-platform with cracking ice / snowy-cliff with avalanche / glacier-cavern with ice-spikes / blizzard-plain with howling wind)
- 6% ROYAL-COURT (throne-room mid-attack with broken pillars / palace-courtyard with banners shredded / castle-rooftop with falling tiles)
- 6% TRAINING-GROUND (mountain training-spot with smashed boulders / waterfall meditation platform / training-yard with broken practice-dummies)

DO write:
- Collapsing Tokyo rooftop with shattered concrete in close foreground, fire-bursts at midground, skyline burning in deep distance — he stands ON rooftop mid-strike
- Dojo interior with shattered shoji-walls and tatami fragments foreground, opposing dojo-master silhouette midground, fire glow beyond — he counters from forward stance
- Cursed-domain interior with floating-rune-glyphs close, cursed-aura ground-circle midground, void-tendrils deep distance — he casts forward
- Lunar-surface platform with cracked craters foreground, Earth backdrop in deep distance, plasma-trails midground — he leaps forward mid-strike

DO NOT: "standing at edge looking out at burning city" / "approaching the boss in distance" / "gazing at opposing army" — back-to-camera traps. Photoreal cinematography terms.

Every battlefield affords hero ENGAGED IN-FRAME.

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
