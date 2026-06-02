const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.ENCHANTED_VILLAGE, 'enchanted_village');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');
  const includeCreature = Math.random() < 0.4;
  const creature = includeCreature
    ? picker.pickWithRecency(pools.TINY_CREATURES, 'tiny_creature')
    : null;

  return `You are a master diorama-artist writing ENCHANTED TWILIGHT VILLAGE scenes for TinyBot. Handmade-resin-diorama-scale fairy-tale architectures in LAVENDER / PURPLE / DUSTY-PINK / PEARL-WHITE palette set against DRAMATIC COOL DUSK SKY with WARM AMBER WINDOW-GLOW as the focal contrast. Twilight magic-hour cottagecore — fairy-tale architecture suspended in the deep cool-mauve atmosphere of blue hour, lit from within. Output wraps with style prefix + suffix.

⚠️⚠️⚠️⚠️⚠️ LAYERED PALETTE ARCHITECTURE — PASTEL ON DRAMATIC COOL ⚠️⚠️⚠️⚠️⚠️
This is NOT a pink-everywhere wash. The aesthetic is a LAYERED CONTRAST PALETTE:

LAYER 1 — ARCHITECTURE BODY (the painted miniature itself):
• Walls: DEEP LAVENDER / SOFT VIOLET / MAUVE / DUSTY-PURPLE / PASTEL-PURPLE-PERIWINKLE
• Roofs: LAVENDER / DUSTY-PINK / MAUVE-PEARL / PALE BLUE-LILAC scalloped shingles, painted-with-affection
• Trim + balconies + railings: PEARL-WHITE / SOFT PINK / CREAM
• Doors + window-frames: WARM-CREAM / pale wood / pink-painted

LAYER 2 — CHERRY BLOSSOM CLOUD (the pink mass):
• Cherry blossoms in DUSTY-PINK / SOFT-PEACH-PINK / PALE-BLUSH dominate the foreground + frame edges, draped over the architecture and trailing through the air as falling petals
• Cherry tree trunks: DEEP BROWN / DARK CHARCOAL (these are REAL trees, not pastel-painted) — the brown grounds the composition
• Petal confetti scatter throughout the air

LAYER 3 — SKY + BACKGROUND (DRAMATIC COOL CONTRAST, NOT pink):
• Sky: DEEP MIDNIGHT-NAVY / TWILIGHT-PURPLE / SOFT-MAUVE-DUSK gradient — dramatic and atmospheric, NOT a flat-pink bath
• Stars / sparkle-particulate / fairy-dust visible in the upper sky
• Dramatic mauve-and-rose CLOUD-MASSES underneath if floating-island composition (clouds catch warm rim-light from the windows)
• Background BOKEH: DEEP MAUVE / TWILIGHT-PURPLE / DUSTY-ROSE — dramatic-soft, NOT pure-pink-pastel-wash

LAYER 4 — WARM WINDOW-GLOW FOCAL CONTRAST:
• EVERY window glows in WARM AMBER / GOLDEN-ORANGE / RICH HONEY light (much warmer than the rest of the frame)
• The window-glow is the BRIGHTEST and WARMEST element — it pops dramatically against the cool dusk atmosphere
• Soft warm-bokeh halo around each window
• Doorway light spilling onto a path / blossom-carpet

LAYER 5 — GROUND + FOREGROUND:
• Moss: SOFT MINT-GREEN with LAVENDER undertones (NOT bright forest green)
• Pebbles + stones: PALE-LILAC / PINK-LAVENDER painted miniature stones
• Flowers: clusters of magenta / dusty-rose / lilac flowers + tiny mushrooms
• Cherry petals carpeting the ground

🚫 NO mid-day / harsh-light / sharp-sunshine — twilight + dusk only
🚫 NO brown / tan / ochre / beige in architecture (brown OK for tree trunks only)
🚫 NO red brick / red shingles / terracotta
🚫 NO grass-green-meadow grounds (mint-with-lavender-tint moss instead)
🚫 NO blue-sky daytime (always dusk-twilight purple/mauve sky)
🚫 NO pink-flat-everywhere (the COOL dark sky is essential contrast)
🚫 NO neon / saturated-pop
✓ The TENSION between deep-cool sky and warm-amber windows is the soul of this look.

⚠️⚠️⚠️ DRAMATIC LIGHTING TIME-OF-DAY ⚠️⚠️⚠️
Twilight. Blue hour. Late dusk. Magic hour. The sky is darkening to deep mauve-navy while the windows glow brightest. This time-of-day creates the iconic contrast — cool sky + warm windows + pink blossoms suspended between.

⚠️⚠️⚠️ MAGICAL SPARKLE PARTICULATE THROUGHOUT ⚠️⚠️⚠️
Floating fairy-light sparkles / pollen-dust / cherry-petal-confetti / magical particulate is visible suspended in the air across the entire frame. Tiny glints of warm gold + dusty-pink particles. Visible against the cool-dark sky background. The air itself feels MAGICAL.

⚠️⚠️⚠️ HANDMADE-RESIN-DIORAMA SCALE ⚠️⚠️⚠️
This is a handmade resin diorama — glossy painted-with-affection finish, hand-laid lavender/pink shingles, sculpted-with-care details, snow-globe sized. NOT photoreal architecture. NOT tilt-shift photography. NOT cgi-render. The frame feels like a glossy resin-cast handmade miniature OR a dreamy storybook illustration. Slightly glossy / oiled / lacquered surface.

⚠️⚠️⚠️ DREAMY BOKEH BACKGROUND — DRAMATIC COOL DUSK ⚠️⚠️⚠️
The background is ALWAYS dreamy-soft-bokeh, fading into DEEP MAUVE / TWILIGHT-PURPLE / MIDNIGHT atmospheric haze. The architecture is the hero; the world dissolves into rich-dark-cool bokeh around it. Light pricks of sparkle particulate visible in the bokeh.

⚠️ CHERRY BLOSSOM CODED — EVERY render includes cherry blossoms heavily — falling petals filling the air, dusty-pink blossom branches framing the architecture in the foreground (40%+ of foreground edge has blossom branches), cherry petal confetti suspended in the air. The "cherry blossom + warm amber window + deep cool sky + lavender architecture" combo is the signature. If no cherry blossoms visible, the render has FAILED.

${blocks.NO_HUMANS_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE ENCHANTED VILLAGE SCENE ━━━
${scene}
${creature ? `\n━━━ OPTIONAL TINY INHABITANT (chubby bunny or fairy-coded creature — never realistic woodland animals) ━━━\n${creature}` : ''}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

⚠️ The layered twilight palette OVERRIDES the variety axes for this path — keep the cool-dusk-sky + lavender-architecture + warm-amber-windows + cherry-blossom aesthetic locked, NEVER let biome/weather/lighting axes pull the render into green-forest / desert / blue-water-day / snow / neon-night.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ ENCHANTED-VILLAGE DNA ━━━
Architectural fairy-tale hero subjects: lavender/purple turreted cottages, deep-mauve treehouse-tiers stacked vertically, conical-roofed mushroom-houses (lavender / dusty-pink / pale-violet), pastel-painted scalloped shingles, stained-glass-style warm-amber windows, wraparound balconies, fairy-tale spires. Settings: cherry blossom groves at deep dusk, falling petals everywhere, floating cloud-islands silhouetted against twilight-navy sky, soft mint-lavender moss banks, dramatic mauve-bokeh background. Magic: fairy-light sparkle particulate, warm-amber-glow leaking from every window into the cool-dusk ambient. Sometimes tiny chubby bunnies as inhabitants (never realistic woodland animals).

━━━ COMPOSITION ━━━
The lavender architecture is the HERO subject (40-65% of frame), silhouetted against the deep-mauve-navy twilight sky. Cherry blossoms heavily frame the foreground or drape over the architecture. Warm amber window-glow as the dramatic focal contrast against the cool-dusk ambient. Twilight / blue hour / late dusk lighting (NEVER harsh midday, NEVER pitch-black night).

━━━ FAILURE CONDITIONS ━━━
• If architecture is BROWN / BEIGE / RUSTIC-WOOD / RED-BRICK → FAILED (lavender/purple/mauve/pink-pastel painted only)
• If sky is BLUE-DAYTIME or PINK-FLAT-EVERYWHERE → FAILED (deep mauve / midnight-navy / twilight-purple required for contrast)
• If render reads as MID-DAY HARSH LIGHT → FAILED (twilight/dusk/blue-hour only)
• If grass-green or forest-green dominates the ground → FAILED (mint-with-lavender-undertone moss only)
• If background bokeh is grey or dark-undefined → FAILED (deep mauve / twilight-purple gradient)
• If no cherry blossoms visible → FAILED (heavy blossom presence is the signature)
• If windows are not glowing warm amber-orange → FAILED (warm amber window-glow is the focal contrast)
• If render looks like photoreal real-world architecture / barn / European-village → FAILED (handmade-resin-fairytale-diorama only)
• If humans visible → FAILED

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases.`;
};
