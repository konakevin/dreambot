/**
 * Dream Engine Categories — the curated medium and vibe definitions that power DreamBot.
 *
 * Each medium directive tells Haiku how a master of that craft thinks.
 * Each vibe directive shapes the mood, lighting, composition, and emotion.
 * Combined, they produce stunning results regardless of user input.
 *
 * "My Mediums" / "My Vibes" = personalized from user's profile
 * "Surprise Me" = random pick from the full curated pool
 */

// ── Types ───────────────────────────────────────────────────────────────

export interface DreamMedium {
  key: string;
  label: string;
  /** Creative brief for Haiku's concept generator. null = derived at runtime */
  directive: string | null;
  /** Technical prefix for the final Flux prompt. null = derived at runtime */
  fluxFragment: string | null;
  /** If present, this medium is an aggregate — engine randomly picks one of these sub-medium keys */
  includes_mediums?: string[];
}

export interface DreamVibe {
  key: string;
  label: string;
  /** Creative brief for Haiku's concept generator. null = derived at runtime */
  directive: string | null;
}

// ── Mediums ─────────────────────────────────────────────────────────────

export const DREAM_MEDIUMS: DreamMedium[] = [
  {
    key: 'surprise_me',
    label: 'Surprise Me',
    directive: null,
    fluxFragment: null,
  },
  {
    key: 'pixel_art',
    label: 'Pixel Art',
    directive:
      'You are designing a scene as a pixel art master. Think SNES-era craftsmanship — every single pixel is intentional. Use a limited, harmonious color palette (16-32 colors max). Dithering for gradients. Visible pixel grid but with sophisticated color choices that create depth and atmosphere. The constraint of the medium IS the beauty — find elegance in the limitation. Think Superbrothers, Hyper Light Drifter, or Celeste. Environments should have layered parallax depth. Characters should have iconic silhouettes readable at low resolution. Lighting is achieved through palette shifts, not gradients.',
    fluxFragment:
      '16-bit pixel art, carefully placed pixels, limited harmonious color palette, dithered gradients, retro game aesthetic, crisp pixel edges',
  },
  {
    key: 'watercolor',
    label: 'Watercolor',
    directive:
      "You are a master watercolorist working wet-on-wet on cold-pressed Arches paper. Your genius is knowing when to STOP — watercolor's beauty is in what you leave unpainted. The white of the paper is your brightest light. Build transparent layers: light washes first, then richer pigment in the shadows. Let colors bloom and bleed into each other at the edges — controlled accidents are your signature. Granulating pigments (cerulean, raw umber, burnt sienna) create natural texture. Lost-and-found edges: some boundaries sharp and defined, others dissolving into nothing. The painting should look effortless, like it happened in one confident sitting.",
    fluxFragment:
      'Watercolor painting on textured paper, transparent layered washes, wet-on-wet blooms, soft bleeding edges, white paper glowing through, visible confident brushstrokes, granulating pigments',
  },
  {
    key: 'oil_painting',
    label: 'Oil Painting',
    directive:
      "You are painting in the tradition of the great oil painters — think the emotional weight of Rembrandt's light, the color boldness of Sorolla, the textural bravery of Freud. Thick impasto in the lights, thinner transparent darks. The paint itself is a character — visible palette knife marks, loaded brushstrokes that catch light on their ridges. Color mixing happens on the canvas, not just the palette — adjacent strokes of different hues vibrate against each other. Rich, warm undertones even in cool passages. The painting should feel like it has physical weight and took weeks of layered sessions.",
    fluxFragment:
      'Oil painting on canvas, thick impasto brushstrokes, visible palette knife texture, rich layered glazes, Rembrandt-inspired chiaroscuro lighting, warm undertones, painterly color mixing',
  },
  {
    key: 'anime',
    label: 'Anime',
    directive: null,
    fluxFragment: null,
    includes_mediums: ['cute_anime', 'dark_anime'],
  },
  {
    key: 'lego',
    label: 'LEGO',
    directive:
      "Everything in this scene is built entirely from LEGO bricks. Every surface, every object, every element of nature — all LEGO. Water is translucent blue bricks. Fire is orange and yellow pieces. Trees are green leaf elements on brown trunk pieces. The ground has visible studs. Characters are minifigures with painted expressions and snap-on accessories. The genius is in the creative problem-solving — how do you represent clouds, water, smoke, light with rigid plastic bricks? That constraint creates charm. Lighting should be realistic as if this is a photograph of an actual LEGO diorama on someone's table.",
    fluxFragment:
      'LEGO brick diorama, everything constructed from LEGO pieces, plastic studs visible on every surface, minifigure characters, photographed like a real LEGO set, soft realistic lighting',
  },
  {
    key: 'claymation',
    label: 'Claymation',
    directive:
      'This is a scene from a premium stop-motion animation studio — think Laika (Coraline, Kubo) or Aardman (Wallace & Gromit). Characters and objects are sculpted from smooth, matte clay with subtle fingerprint textures that remind you a human hand shaped them. Eyes are glass beads or painted spheres. Fabric textures are knitted or felted at miniature scale. Sets are handcrafted — painted plywood backdrops, miniature furniture with visible construction. Lighting is theatrical, with warm practicals and cool ambient fill. Everything has that slightly imperfect, handmade quality that makes stop-motion feel alive.',
    fluxFragment:
      'Claymation stop-motion animation, smooth sculpted clay characters, visible fingerprint textures, glass bead eyes, handcrafted miniature sets, theatrical warm lighting, Laika Studios quality',
  },
  {
    key: '3d_cartoon',
    label: '3D Cartoon',
    directive:
      'You are a Pixar/DreamWorks-level character designer and environment artist. Everything has that premium animated film quality — soft, rounded shapes with appealing exaggerated proportions. Characters have oversized expressive eyes with complex reflections, subsurface scattering on skin making them glow with life. Environments are lush, colorful, and art-directed with volumetric lighting, god rays, and warm bounce light. Every frame should look like a poster for a $200M animated feature. NOT photorealistic — this is stylized cartoon 3D.',
    fluxFragment:
      'Pixar-quality 3D animated cartoon render, soft rounded appealing shapes, oversized expressive eyes, subsurface scattering, volumetric lighting, vibrant art-directed color palette, cinematic depth of field, animated film quality',
  },
  {
    key: '3d_render',
    label: '3D Render',
    directive:
      'You are a AAA game cinematic artist working in Unreal Engine 5. Photorealistic 3D rendering with physically based materials — real metal reflections, accurate glass refraction, skin pores and peach fuzz visible. Environments have ray-traced global illumination, volumetric fog, and cinematic depth of field. Textures are hyper-detailed — weathered concrete, wet asphalt, brushed steel, worn leather. Lighting is motivated and cinematic — dramatic rim lights, atmospheric haze, practical light sources. Everything looks like a movie-quality CGI render, NOT cartoon.',
    fluxFragment:
      'Photorealistic 3D render, Unreal Engine 5 quality, ray-traced global illumination, physically based materials, hyper-detailed textures, cinematic lighting, volumetric fog, movie-quality CGI',
  },
  // pencil_sketch removed — Flux can't render authentic pencil sketch style
  {
    key: 'cyberpunk',
    label: 'Cyberpunk',
    directive:
      'This is a dystopian megacity — towering megastructures disappearing into smog, holographic advertisements the size of buildings, chrome and steel everywhere. Rain-soaked streets reflect neon from a thousand signs. Flying vehicles weave between skyscrapers. The scale is MASSIVE — humans are tiny against the architecture. Colors are electric cyan, hot pink, amber against deep black and steel grey. Blade Runner meets Ghost in the Shell. Every surface is reflective, wet, or glowing.',
    fluxFragment:
      'Cyberpunk cityscape, towering megastructures, holographic advertisements, rain-soaked chrome surfaces, neon-drenched fog, flying vehicles, massive scale dystopian architecture, Blade Runner aesthetic',
  },
  // stained_glass removed — inconsistent results
  {
    key: 'comic_book',
    label: 'Comic Book',
    directive:
      'MANDATORY: This must look like an actual printed comic book page, NOT digital art. Bold BLACK INK outlines with varying weight — thick for silhouettes, thin for details. Colors are FLAT and saturated — no gradients, no soft shading. Ben-Day halftone DOT patterns MUST be visible in mid-tones and shadows. Dynamic composition with dramatic angles. Motion lines and speed streaks. The image should look like it was printed on paper with CMYK ink separation visible. Think classic Marvel/DC splash page quality.',
    fluxFragment:
      'Comic book splash page, bold black ink outlines, flat saturated CMYK colors, visible Ben-Day halftone dot patterns, dynamic dramatic angles, printed on paper quality, NOT digital art, classic Marvel DC comic aesthetic',
  },
  {
    key: 'embroidery',
    label: 'Embroidery',
    directive:
      'Every element in this scene is rendered as if stitched by hand on fabric. Cross-stitch for flat areas with visible grid texture. Satin stitch for smooth surfaces and lettering. French knots for dots and texture points. Long-and-short stitch for gradients and shading. The fabric background (natural linen or cotton) is visible between stitched elements. Thread colors are rich and saturated — DMC embroidery floss palette. The hoop or frame edge might be partially visible. Light catches the raised thread creating subtle dimensionality. The patience and craft of handwork should radiate from every element.',
    fluxFragment:
      'Hand embroidery on linen fabric, cross-stitch and satin stitch techniques, visible thread texture, rich DMC floss colors, fabric background showing through, raised dimensional stitching',
  },
  {
    key: 'disney',
    label: 'Storybook',
    directive:
      'You are a classic Disney 2D animation artist from the Renaissance era — think The Lion King, The Little Mermaid, Aladdin. Characters have expressive, emotive faces with large eyes that convey personality. Clean, confident ink outlines with smooth, flowing lines. Rich cel-painted color with luminous highlights and soft shadows. Backgrounds are lush painted environments — every frame is a work of art. Hair and fabric flow with exaggerated, graceful movement. Characters feel alive with warmth, appeal, and personality. The magic of hand-drawn animation radiates from every stroke.',
    fluxFragment:
      'Classic Disney 2D animation, hand-drawn cel animation, clean flowing ink outlines, rich painted colors, expressive character design, luminous highlights, Renaissance Disney quality',
  },
  {
    key: 'sack_boy',
    label: 'Sack Boy',
    directive:
      'Everything in this scene is crafted from real-world materials at miniature scale — the LittleBigPlanet aesthetic. Characters are knitted fabric dolls with visible stitching, button eyes, and zipper mouths. Their bodies are soft stuffed forms with yarn hair and felt accessories. The environment is built from cardboard, corrugated paper, fabric swatches, sponge, cork, and stickers. Platforms are wooden rulers and tape rolls. Backgrounds are painted cardboard with visible brush marks. Everything has that handmade, tactile, craft-table quality — you can almost feel the textures. Lighting is warm and soft like a desk lamp illuminating a craft project.',
    fluxFragment:
      'LittleBigPlanet Sack Boy style, knitted fabric characters, button eyes, zipper details, cardboard and craft material world, visible stitching, handmade tactile quality, warm desk lamp lighting',
  },
  {
    key: 'funko_pop',
    label: 'Funko Pop',
    directive:
      'Everything is rendered as a Funko Pop vinyl collectible figure. Characters have massively oversized heads (3x body proportion) with tiny bodies, small dot eyes, no mouth (or tiny line mouth), and simplified features. The surface is glossy vinyl plastic with a subtle sheen. Hair is a solid sculpted plastic piece. Clothing details are painted on, not textured. The figure stands on a small circular black base. The aesthetic is cute, collectible, and stylized — maximum personality through minimal features. Think of it as a photograph of the actual vinyl figure on a shelf.',
    fluxFragment:
      'Funko Pop vinyl figure style, oversized head, tiny body, glossy plastic surface, dot eyes, no mouth, painted clothing details, collectible figure on display base, product photography',
  },
  {
    key: 'ghibli',
    label: 'Ghibli',
    directive:
      "You are a Studio Ghibli artist — think Spirited Away, My Neighbor Totoro, Howl's Moving Castle. The style is softer and more painterly than standard anime. Characters have natural, rounded proportions — not exaggerated anime features. Eyes are expressive but realistic in size. Skin tones are warm with soft watercolor-like shading. Backgrounds are breathtakingly detailed painted landscapes with incredible atmospheric perspective — clouds that feel alive, grass that sways, water that sparkles. There is a sense of quiet wonder and lived-in warmth in every scene. Nature is almost a character itself. The palette is rich but never harsh — earthy greens, sky blues, warm golds.",
    fluxFragment:
      'Studio Ghibli animation style, soft painterly rendering, warm natural color palette, detailed painted backgrounds, atmospheric clouds, gentle character design, Miyazaki quality, hand-painted cel animation',
  },
  {
    key: 'tim_burton',
    label: 'Gothic',
    directive:
      'Tim Burton gothic style. Characters have impossibly thin spindly limbs, elongated neck, oversized heads with sunken dark-ringed eyes. Spiral motifs in hair, architecture, and landscapes. Stark palette: black, white, grey with pops of deep purple or blood red. Crooked angular architecture — buildings lean, trees twist, fences curl. Dark whimsical aesthetic, NOT horror.',
    fluxFragment:
      'Tim Burton gothic illustration, spindly elongated limbs, spiral motifs, black and white with purple accents, crooked angular architecture, sunken dark-ringed eyes, dark whimsical aesthetic',
  },
  {
    key: 'pop_art',
    label: 'Pop Art',
    directive:
      'You are creating in the style of Andy Warhol and Roy Lichtenstein. Bold, flat areas of highly saturated primary and secondary colors — red, blue, yellow, green, orange, purple at maximum intensity. Ben-Day dots (halftone pattern) fill shadows and mid-tones. Thick black outlines define every shape with graphic clarity. The aesthetic is commercial, graphic, and unapologetically bold — advertising meets fine art. No subtlety, no gradients — flat color and graphic power.',
    fluxFragment:
      'Pop art style, Andy Warhol screen print, bold flat primary colors at maximum saturation, Ben-Day halftone dots, thick black outlines, graphic commercial aesthetic',
  },
  {
    key: 'minecraft',
    label: 'Minecraft',
    directive:
      'Everything in this scene is built from cubic voxel blocks — the Minecraft aesthetic. Characters are blocky with square heads, rectangular bodies, and pixelated skin textures mapped onto flat cube faces. Every surface is a grid of textured blocks — dirt, stone, wood planks, grass with flowers. Trees are columns of wood blocks topped with leaf blocks. Water is translucent blue blocks. The sky has square clouds. Lighting creates blocky shadows. The charm is in the constraint — representing complex scenes with nothing but cubes. It should look like a screenshot from inside the game, or a photograph of a LEGO-like diorama made of cubes.',
    fluxFragment:
      'Minecraft voxel style, everything built from cubic blocks, pixelated block textures, square character heads, blocky terrain, grass and dirt blocks, game screenshot aesthetic',
  },
  {
    key: '8bit',
    label: 'Retro Gaming',
    directive:
      'You are creating a retro video game scene — the nostalgic look of classic gaming from the 80s and 90s. Pixel art environments with rich color palettes, detailed sprite work, parallax scrolling backgrounds. Think the most beautiful moments from SNES, Genesis, and arcade games — Chrono Trigger, Streets of Rage, Metal Slug, Castlevania. Lush pixel landscapes, dramatic pixel skies, glowing effects. The charm of pixel art at its BEST — not its most primitive. Vibrant, colorful, detailed pixel worlds that make you want to explore them.',
    fluxFragment:
      'Retro video game pixel art, vibrant colorful pixel environments, detailed sprite work, SNES era quality, parallax scrolling backgrounds, classic gaming aesthetic, nostalgic pixel landscapes',
  },
  {
    key: 'paper_cutout',
    label: 'Paper Cutout',
    directive:
      "You are creating construction paper cutout animation — think South Park, Monty Python, or early Blue's Clues. Characters are flat 2D shapes cut from colored construction paper with visible rough-cut edges and slight paper texture. Arms and legs are separate paper pieces attached at joints. Eyes are simple cut-out circles glued on. Backgrounds are layered construction paper — mountains are torn paper triangles, clouds are cotton balls or white paper ovals, trees are green paper circles on brown paper sticks. Everything is intentionally crude, flat, and charming. The camera looks straight-on at a flat paper world. Shadows are cut from darker paper placed behind characters.",
    fluxFragment:
      'Construction paper cutout animation, flat 2D paper characters with rough-cut edges, visible paper texture, simple glued-on circle eyes, layered paper backgrounds, crude charming aesthetic, straight-on camera angle',
  },
  {
    key: 'retro_poster',
    label: 'Retro Poster',
    directive:
      'You are designing a vintage travel poster from the 1930s-1950s. Bold flat color blocks with no gradients — screen-printed aesthetic. Strong geometric shapes and simplified forms. Limited palette of 4-6 rich colors: deep teal, burnt orange, cream, burgundy, navy. Dramatic diagonal compositions with Art Deco influence. Subjects are stylized and iconic — silhouettes, simplified architecture, sweeping landscapes. No photorealism — this is graphic design as art. Think WPA national park posters, TWA airline ads, Swiss tourism prints.',
    fluxFragment:
      'Vintage retro travel poster, bold flat color blocks, screen-printed aesthetic, Art Deco influence, simplified geometric forms, limited palette, 1940s illustration style, dramatic diagonal composition',
  },
  {
    key: 'childrens_book',
    label: "Children's Book",
    directive:
      "You are illustrating a page from a beloved children's picture book. Soft, warm watercolor-like washes with visible paper texture. Rounded, friendly character designs with exaggerated proportions — big heads, small bodies, expressive faces. Colors are warm and inviting — soft pastels mixed with rich accent colors. Environments feel cozy and magical. Gentle linework, hand-drawn quality. Think Beatrix Potter meets Studio Ghibli — whimsical, detailed, and full of tiny discoverable details that reward close looking. Every scene tells a story.",
    fluxFragment:
      "Children's picture book illustration, soft watercolor washes on textured paper, rounded friendly character designs, warm inviting palette, gentle hand-drawn linework, cozy magical atmosphere, storybook quality",
  },
  {
    key: 'vaporwave',
    label: 'Vaporwave',
    directive:
      'You are creating vaporwave aesthetic art — the visual language of internet nostalgia and retro-futurism. Greek/Roman marble busts and statues in unexpected contexts. Glitch effects — horizontal scan lines, RGB color separation, pixel sorting. Color palette is MANDATORY: hot pink, cyan, purple, and teal against black or deep purple backgrounds. Palm trees, sunsets, grid floors stretching to infinity. VHS tracking artifacts. Windows 95 UI elements. The aesthetic is simultaneously beautiful and ironic — corporate muzak made visual. Maximum saturation, maximum atmosphere.',
    fluxFragment:
      'Vaporwave aesthetic, hot pink and cyan and purple palette, glitch effects, marble busts, palm trees, retro grid floor, VHS artifacts, 80s nostalgia, digital sunset, RGB color separation, maximum saturation',
  },
  {
    key: 'fantasy',
    label: 'Fantasy',
    directive:
      'You are creating epic fantasy digital concept art — clean, vivid, and hyper-detailed like a AAA video game loading screen or movie poster. NOT an oil painting — this is polished digital art with smooth rendering, crisp edges, and vibrant saturated colors. The world can be bright and magical OR dark and ominous. Enchanted forests, cursed oceans, soaring castles, underground kingdoms, frozen wastelands, volcanic forges, floating islands, crystal caves. Dramatic lighting — god rays, bioluminescence, firelight, moonlight. Scale is VAST and overwhelming. Be CREATIVE — surprise me with the setting.',
    fluxFragment:
      'Epic fantasy digital concept art, hyper-detailed, vivid saturated colors, dramatic volumetric lighting, vast magical scale, crisp polished rendering, AAA game art quality',
  },
  {
    key: 'ukiyo_e',
    label: 'Ukiyo-e',
    directive:
      'You are creating in the style of traditional Japanese woodblock prints — ukiyo-e masters like Hokusai and Hiroshige. Bold black outlines with flat color fills — no gradients or shading within shapes. Colors are specific: indigo blue, vermillion red, forest green, ochre yellow, ivory white. Waves curl in the iconic Hokusai style. Mountains appear as layered silhouettes. Clouds are stylized swirling patterns. Cherry blossoms and pine branches frame compositions. Everything has the characteristic flat perspective and decorative patterning of Edo-period prints.',
    fluxFragment:
      'Japanese ukiyo-e woodblock print, bold black outlines, flat color fills, Hokusai wave style, indigo and vermillion palette, stylized clouds, traditional Edo period aesthetic, decorative composition',
  },
  {
    key: 'art_deco',
    label: 'Art Deco',
    directive:
      'You are designing in the Art Deco style of the 1920s-1930s — the age of Gatsby, golden age Hollywood, and the Chrysler Building. Geometric precision: symmetrical compositions, sunburst radiating patterns, chevrons, zigzags, stepped forms. The palette is luxurious: gold, black, cream, emerald green, deep navy. Materials are rich — polished brass, marble, lacquer, chrome. Typography is geometric and elegant. Architecture features strong vertical lines, tiered setbacks, and ornate geometric ornamentation. Everything exudes glamour, wealth, and machine-age optimism.',
    fluxFragment:
      'Art Deco style, geometric patterns, sunburst motifs, gold and black and emerald palette, polished brass and marble, 1920s glamour, Chrysler Building aesthetic, luxurious symmetrical composition',
  },
  {
    key: 'steampunk',
    label: 'Steampunk',
    directive:
      'You are creating a STYLIZED CARTOON steampunk world — NOT photorealistic. Think animated film or illustrated storybook set in a Victorian steam-powered universe. Characters are stylized with exaggerated proportions — big expressive eyes, rounded features, charming cartoon anatomy. Brass gears, copper pipes, riveted iron, glass pressure gauges everywhere but rendered in a warm illustrated style. Airships in painterly skies. Goggles, top hats, leather aviator gear — all with cartoon charm. Palette: warm brass gold, copper, leather brown, jade green accents. Everything has hand-painted, illustrated quality — NEVER photorealistic.',
    fluxFragment:
      'Illustrative steampunk art, stylized cartoon render, warm painterly lighting, brass gears and copper pipes, Victorian machinery, ornate clockwork, illustrated storybook quality, NOT photorealistic',
  },
  {
    key: 'cute_anime',
    label: 'Cute Anime',
    directive:
      'You are drawing in kawaii/chibi anime style — maximum cuteness. Characters have oversized heads (3:1 head-to-body ratio), enormous sparkly eyes with multiple highlight reflections, tiny button noses, and small simple mouths. Bodies are short and rounded — stubby limbs, no sharp angles. Colors are soft pastels: baby pink, lavender, mint, powder blue, peach, with white highlights everywhere. Backgrounds are magical — floating hearts, stars, sparkles, rainbow gradients, cloud floors. Everything is round, soft, and adorable. Think Sanrio meets chibi anime — weaponized cuteness.',
    fluxFragment:
      'Kawaii chibi anime style, oversized heads, enormous sparkly eyes, pastel pink lavender mint palette, soft rounded forms, floating hearts and stars, sparkle effects, maximum cuteness, Sanrio aesthetic',
  },
  {
    key: 'dark_anime',
    label: 'Dark Anime',
    directive:
      'You are creating seinen/dark anime art — the visual world of Ghost in the Shell, Akira, Attack on Titan, Cowboy Bebop. Characters have realistic proportions, sharp angular features, intense narrow eyes with single hard light reflections. Detailed mechanical and architectural designs. Color palette is muted and moody — deep indigo, gunmetal grey, dried blood red, sickly amber. Heavy atmospheric effects — rain, smoke, dust, lens flare. Backgrounds are hyper-detailed cityscapes or desolate wastelands. Lighting is dramatic and cinematic — harsh rim lights, deep shadows. Nothing cute — everything is serious, intense, and beautiful.',
    fluxFragment:
      'Dark seinen anime, sharp angular character design, intense narrow eyes, muted moody palette, hyper-detailed backgrounds, dramatic cinematic lighting, Ghost in the Shell Akira aesthetic, atmospheric rain and smoke',
  },
];

// ── Vibes ───────────────────────────────────────────────────────────────

export const DREAM_VIBES: DreamVibe[] = [
  {
    key: 'surprise_me',
    label: 'Surprise Me',
    directive: null,
  },
  {
    key: 'cinematic',
    label: 'Cinematic',
    directive:
      'This is a frame from an Oscar-winning film. Compose it in 2.39:1 widescreen — use the horizontal space to create tension between subject and environment. Lighting is motivated by a visible or implied source: a window, a streetlight, a fire. Three-point lighting with the key at 45 degrees creating sculpted shadows on faces. Color grade is teal-and-orange or a deliberate complementary palette. Depth is created with atmospheric haze between foreground and background. Every element in frame serves the story. The viewer should feel like something just happened or is about to happen — frozen narrative tension.',
  },
  {
    key: 'dreamy',
    label: 'Dreamy',
    directive:
      "Everything floats in a soft, ethereal haze. Light doesn't come from one direction — it seems to emanate from within the scene itself, creating a gentle omnidirectional glow. Colors are pastels shifted toward lavender, blush pink, powder blue, and soft gold. Edges dissolve into each other — nothing has a hard boundary. There's a sense of weightlessness: objects might float slightly, fabric drifts without wind, hair defies gravity. The atmosphere is thick with soft particles — pollen, dust motes, tiny lights. The scene should feel like the moment between sleeping and waking when reality is beautifully uncertain.",
  },
  {
    key: 'dark',
    label: 'Dark',
    directive:
      "Embrace the shadows. The majority of the frame is in deep shadow — rich, velvety blacks and near-blacks. Light is rare and precious: a single candle, a crack under a door, moonlight through clouds. Where light exists, it creates dramatic contrast — bright highlights against crushing darks. Color palette is severely restricted: deep teal, dried blood red, cold steel blue, desaturated amber. The mood is contemplative and weighty, not necessarily scary — think Caravaggio's dramatic chiaroscuro or Gregory Crewdson's suburban noir. Negative space is powerful. What you can't see matters as much as what you can.",
  },
  {
    key: 'chaos',
    label: 'Chaos',
    directive:
      "Rules don't exist here. Multiple conflicting light sources in impossible colors. Perspective bends — parallel lines converge wrong, scale shifts within the frame. Colors CLASH deliberately: electric complementaries at maximum saturation. Textures collide — organic next to geometric, smooth against rough. Composition breaks the frame — elements extend beyond the edges, overlap uncomfortably, create visual tension. There's too much to look at and that's the point. The scene should feel like it's vibrating with unstable energy, like reality is glitching. Beautiful in its overwhelming excess.",
  },
  {
    key: 'cozy',
    label: 'Cozy',
    directive:
      'Everything is warm and close. The scene is an intimate space — small rooms, nooks, corners, sheltered spots. Lighting is soft and warm: candlelight, string lights, fireplace glow, golden afternoon sun through curtains. The color palette centers on warm neutrals: cream, honey, cinnamon, soft rust, forest green. Textures you want to touch: chunky knit blankets, worn wood, ceramic mugs, soft fur, old book pages. The composition is close and enveloping — the viewer is IN the cozy space, not observing from outside. Depth of field is shallow, making the immediate surroundings feel like a warm embrace. Steam rising from something hot.',
  },
  {
    key: 'minimal',
    label: 'Minimal',
    directive:
      'Less is everything. One subject, vast negative space. The background is a single tone or a subtle gradient — it exists only to make the subject sing. Composition is mathematical: perfect center, extreme rule-of-thirds, or radical asymmetry. Color palette is two to three colors maximum, and one dominates 80% of the frame. Every element that could be removed HAS been removed. What remains must be perfect in form and placement. Lighting is clean and simple — one source, soft or hard, creating a clear statement. The image should feel like a held breath — quiet, deliberate, and impossible to simplify further.',
  },
  {
    key: 'epic',
    label: 'Epic',
    directive:
      "SCALE. The subject exists within something impossibly vast — towering mountains, endless skies, cathedral-sized interiors, cosmic expanses. Camera angle is extreme: dramatic low angle looking up, or a high wide shot that reveals the world's enormity. Atmospheric perspective creates depth — foreground sharp and saturated, background fading through layers of haze. Light is dramatic and directional: god rays breaking through clouds, golden hour painting everything warm, or cold blue moonlight illuminating a vast landscape. The color palette is rich and full-range. The viewer should feel small and awed, like standing at the edge of the Grand Canyon.",
  },
  {
    key: 'nostalgic',
    label: 'Nostalgic',
    directive:
      'This is a memory being remembered fondly. Everything is shifted toward warm golden tones — late afternoon in eternal summer. Shadows are soft and lifted, never threatening. Focus is slightly soft, like looking through old glass or tears of joy. Details from a specific era peek through: vintage objects, period clothing, retro signage, old cars. Light has that magic-hour quality where everything glows from within. The composition feels personal and intimate, like a photograph taken by someone who was there and loved the moment. Lens flare and light bloom add to the romanticized warmth. Time has made everything more beautiful than it probably was.',
  },
  {
    key: 'psychedelic',
    label: 'Psychedelic',
    directive:
      "Reality is melting, breathing, and pulsing with impossible color. Every surface has organic flowing patterns — fractals, mandalas, paisley, flowing liquid forms. Colors are at MAXIMUM saturation and in combinations that vibrate: magenta against lime green, electric blue against hot orange. Forms morph into each other — a face becomes a landscape becomes an animal becomes a galaxy. Symmetry appears and breaks. The sky might be a swirling vortex of color. Edges ripple and breathe. Multiple patterns overlay at different scales. The image should feel like it's moving even though it's still — an optical experience that rewards long staring.",
  },
  {
    key: 'peaceful',
    label: 'Peaceful',
    directive:
      "Absolute stillness. The scene is in a state of perfect calm — still water reflecting sky, windless fields, quiet dawn light. Colors are soft and harmonious: sage green, powder blue, warm grey, soft white, pale gold. Nothing in the scene demands urgent attention — the eye wanders gently across the composition. Horizontal lines dominate: horizons, still waterlines, lying figures. Light is soft and even — overcast sky, pre-dawn blue, or the last glow of twilight. Sound would be absent if this had audio. The composition is balanced and stable. The viewer's breathing should slow down looking at this image.",
  },
  {
    key: 'whimsical',
    label: 'Whimsical',
    directive:
      "Physics are optional and reality is playful. Objects are slightly the wrong size — oversized mushrooms, tiny doors, floating islands. Colors are candy-bright but in sophisticated combinations: mint green with coral, periwinkle with marigold. Architecture curves and spirals instead of standing straight. Characters have exaggerated proportions — big heads, tiny feet, enormous eyes. Plants and nature are fantastical — trees with spiral trunks, flowers that glow, grass in impossible colors. The scene should feel like a children's book illustration made by a fine artist — playful but beautifully crafted. Light comes from unexpected places. Gravity is more of a suggestion than a rule.",
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────

/** Get only the curated mediums (excludes My Mediums and Surprise Me) */
export const CURATED_MEDIUMS = DREAM_MEDIUMS.filter(
  (m) => m.directive !== null || (m.includes_mediums && m.includes_mediums.length > 0)
);

/** Get only the curated vibes (excludes My Vibes and Surprise Me) */
export const CURATED_VIBES = DREAM_VIBES.filter((v) => v.directive !== null);

/** Const key arrays — single source of truth for ArtStyle and Aesthetic union types */
export const MEDIUM_KEYS = [
  'pixel_art',
  'watercolor',
  'oil_painting',
  'anime',
  'lego',
  'claymation',
  '3d_cartoon',
  '3d_render',
  'cyberpunk',
  'comic_book',
  'embroidery',
  'disney',
  'sack_boy',
  'funko_pop',
  'ghibli',
  'tim_burton',
  'pop_art',
  'minecraft',
  '8bit',
  'paper_cutout',
  'retro_poster',
  'childrens_book',
  'vaporwave',
  'fantasy',
  'ukiyo_e',
  'art_deco',
  'steampunk',
  'cute_anime',
  'dark_anime',
] as const;

export const VIBE_KEYS = [
  'cinematic',
  'dreamy',
  'dark',
  'chaos',
  'cozy',
  'minimal',
  'epic',
  'nostalgic',
  'psychedelic',
  'peaceful',
  'whimsical',
] as const;

/** Pick a random curated medium */
export function randomMedium(): DreamMedium {
  return CURATED_MEDIUMS[Math.floor(Math.random() * CURATED_MEDIUMS.length)];
}

/** Pick a random curated vibe */
export function randomVibe(): DreamVibe {
  return CURATED_VIBES[Math.floor(Math.random() * CURATED_VIBES.length)];
}

/**
 * Subject invention prompt for when the user provides no input.
 * Uses their profile interests/aesthetics for flavor.
 */
export function buildSubjectInventionPrompt(
  interests: string[],
  aesthetics: string[],
  spiritCompanion?: string | null
): string {
  const flavorParts: string[] = [];
  if (interests.length > 0) flavorParts.push(`Interests: ${interests.join(', ')}`);
  if (aesthetics.length > 0) flavorParts.push(`Aesthetics: ${aesthetics.join(', ')}`);
  if (spiritCompanion) flavorParts.push(`Spirit companion: ${spiritCompanion}`);
  const flavor =
    flavorParts.length > 0
      ? `\n\nDraw inspiration from this taste profile:\n${flavorParts.join('\n')}`
      : '';

  return `You are DreamBot. The user wants to be surprised with something beautiful to look at. Invent a compelling, visually rich subject for a dream image.

DO NOT be generic. No "a sunset over the ocean" or "a beautiful landscape." Instead, be SPECIFIC and unexpected:
- "A fox wearing a tiny astronaut helmet, floating through a field of bioluminescent jellyfish"
- "An ancient library where the books are growing like trees, their pages rustling with golden light"
- "A street food cart in a rainy cyberpunk alley, steam rising into holographic advertisements"
${flavor}
Output ONLY the subject description, 10-20 words. Nothing else.`;
}
