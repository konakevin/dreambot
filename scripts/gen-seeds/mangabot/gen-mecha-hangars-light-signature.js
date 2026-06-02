#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/mecha_hangars_light_signature.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} LIGHT-SIGNATURE entries for a MangaBot mecha-hangar keyframe. Each entry names a dramatic LIGHTING STYLE that sculpts the giant mech with chiaroscuro. Industrial-scale lighting — sodium-vapor, arc-weld, emergency-strobe, sunset god-rays, cockpit-glow, etc.

Each entry: 12-20 words. ONE specific lighting style. Always DRAMATIC, sculpting the mech's mass + shadow.

LIGHT-SIGNATURE VARIETY (industrial-mecha-hangar palette):
- INDUSTRIAL SODIUM-VAPOR YELLOW overhead (harsh ground shadows, warm-amber on the mech-helmet)
- BLUE ARC-WELD LIGHT pulsing across torso from upper-left (intermittent rim-light)
- RED EMERGENCY-STROBE rotating (alternating shadow-light bars cycling across the deck)
- OVERHEAD SPOTLIGHT cone isolating mech against dim hangar BG (theatrical key-light)
- SUNSET GOD-RAYS through hangar-roof slats (cutting golden bars across the mech-chest)
- COCKPIT-GLOW internal blue-cyan (leaking through canopy seal, lighting the pilot's face from below)
- BATTLEFIELD ORANGE FIRELIGHT from BG explosion (rim-light catching mech-edge)
- ARCTIC COLD-BLUE FLUORESCENT (sterile overhead, cold-shadow under joints)
- PURPLE-MAGENTA NEON-RIM along the panel seams (cyberpunk under-hangar lighting)
- DEEP DRY-DOCK STAR-LIGHT (sole illumination is starlight + distant earth-glow from below)
- KLAXON-RED PULSE light flashing intermittent (alert-state lighting, harsh shadows shift)
- THRUSTER-TEST UNDER-GLOW (engine-orange backlight illuminating mech from below)
- PARADE-FLOODLIGHT WHITE (ceremonial uniform-key flood, even illumination, no shadow)
- SCRAP-YARD DAWN GOLDEN-HOUR (warm low-angle sun cutting across the mech-shoulder)
- ARCTIC-AURORA GREEN OVERHEAD (eerie cool-green sky-glow visible through bay)
- TUNNEL DEPTH-LIGHTING with strip-LEDs (parallel light-bars receding into the hangar-depth)
- LAUNCH-RING COUNTDOWN STROBE (alternating red + amber overhead, building tension)
- SHRINE-CINNABAR LANTERN GLOW (warm red-gold pooling near the deck, soft top-shadow)
- MOON-THROUGH-BAY-DOORS SILVER-COOL (overhead cool moonlight + interior amber spots)
- BLAST-FURNACE ADJACENT ORANGE-RED (forge-glow leaking from next bay)
- BLUE COMPUTER-DIAGNOSTIC LIGHT (laser-grids and screen-glow lighting the mech-chest)
- CHIAROSCURO HARD-EDGED SIDE-LIGHT (single source from one wall, deep shadow opposite)
- COMBAT-DAMAGE EMBER GLOW (small flame burning at chest, lighting underside of helmet)
- TORCH-WELD CONCENTRATED HOT-WHITE (single intense point-light on the shoulder)
- AMBIENT MAINTENANCE-BAY OVERHEAD FLUORESCENT (even cool-white, work-light register)

DO write:
- Industrial sodium-vapor yellow overhead with harsh ground shadows, warm-amber pooling on the mech-helmet
- Blue arc-weld light pulsing across the torso from upper-left, intermittent rim-light cycling
- Red emergency-strobe rotating, alternating shadow-light bars cycling across the hangar deck
- Overhead spotlight cone isolating the mech against a dim hangar BG, theatrical key-light
- Sunset god-rays through hangar-roof slats cutting golden bars across the mech-chest
- Cockpit-glow internal blue-cyan leaking through the canopy seal, lighting the pilot face from below
- Battlefield orange firelight from a BG explosion catching the mech-edge in rim-light

DO NOT write:
- Setting walls (lives in hangar_setting)
- Atmospheric vapor (lives in steam_or_spark)
- "no fog" / "no haze" (negative leak)
- Photoreal exposure terms (f-stops, ISO)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
