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
      "Pixel art recreates the aesthetic of 16-bit SNES-era games like Chrono Trigger and Secret of Mana, alongside modern interpretations like Celeste and Hyper Light Drifter. Use crisp, anti-aliasing-free pixels arranged in deliberate grids with visible individual squares. Employ limited color palettes (typically 16-64 colors) with strategic dithering patterns for gradients and shadows. Create clean, bold outlines using darker pixel borders around characters and objects. Apply flat base colors with minimal traditional shading, instead using color shifts and dithering for depth. Implement tile-based composition thinking, where elements align to implied grid systems. Use selective outlining - not every edge needs borders. Incorporate atmospheric perspective through color desaturation and reduced contrast for background elements. Lighting should be simplified into distinct zones rather than smooth gradients. Textures emerge from repeated pixel patterns rather than detailed rendering. Scale artwork to show individual pixels clearly, maintaining the chunky, blocky aesthetic that defines the medium's distinctive digital craftsmanship.",
    fluxFragment:
      'pixel art, 16-bit style, retro gaming aesthetic, limited color palette, dithering patterns, crisp pixels, no anti-aliasing, grid-based composition, flat shading, bold outlines',
  },
  {
    key: 'watercolor',
    label: 'Watercolor',
    directive:
      "Watercolor style emphasizes fluid transparency and organic bleeding effects characteristic of pigment on wet paper. Colors flow naturally with soft, irregular edges where wet paint meets wet surfaces, creating atmospheric gradations. Employ visible paper texture showing through transparent washes, with white areas preserved for highlights. Brushwork should appear spontaneous yet controlled, featuring confident single strokes for details like foliage or architectural elements. Color mixing occurs directly on the paper surface, producing subtle variations and unexpected hues. Compositions often feature loose, gestural linework in darker tones defining key forms while allowing colors to suggest volume and space. Light areas maintain paper luminosity through thin glazes rather than opaque highlights. Embrace happy accidents - drips, blooms, and backruns that create texture and visual interest. Tonal values range from barely-there whispers of color to rich, saturated darks where pigment pools. Overall aesthetic should feel fresh, immediate, and slightly unpredictable, capturing the medium's inherent spontaneity while maintaining clear focal points and readable forms.",
    fluxFragment:
      'watercolor painting, transparent washes, wet-on-wet technique, paper texture, fluid brushstrokes, organic color bleeding, soft edges, luminous highlights, spontaneous marks, traditional watercolor medium',
  },
  {
    key: 'oil_painting',
    label: 'Oil Painting',
    directive:
      'Oil painting style encompasses the rich, luminous tradition of classical masters like Rembrandt and Vermeer. Emphasize thick, visible brushstrokes with varying texture density—from smooth glazed surfaces to heavy impasto applications where paint builds dimensionally on canvas. Utilize dramatic chiaroscuro lighting with deep shadows contrasting brilliant highlights, creating sculptural form and atmospheric depth. Color should be rich and saturated, built through layered glazing techniques that create optical mixing and luminous depth. Palette knife work adds textural variety alongside brush techniques. Composition follows classical principles with careful attention to light direction and form modeling. Surfaces should show canvas texture bleeding through thinner paint areas, while thicker applications catch and reflect light. Brushwork varies from precise detail work to loose, expressive strokes that suggest rather than define. Edge quality ranges from sharp, defined contours to soft, atmospheric transitions. Overall aesthetic balances technical mastery with painterly expression, showing the hand of the artist through deliberate mark-making and layered paint application that creates both photographic realism and artistic interpretation.',
    fluxFragment:
      'oil painting, thick brushstrokes, impasto texture, canvas weave, chiaroscuro lighting, glazed layers, palette knife marks, visible paint application, classical composition, luminous colors, atmospheric depth',
  },
  {
    key: 'anime',
    label: 'Anime',
    directive:
      "Generate anime-style artwork that adapts to match the scene's emotional tone and narrative context. For intense action sequences, employ bold dynamic poses with exaggerated proportions and speed lines reminiscent of shonen manga. Dramatic or cyberpunk themes call for realistic proportions, detailed mechanical elements, and atmospheric lighting with film noir influences. Intimate character moments require softer linework, pastel palettes, and detailed facial expressions that convey subtle emotions. Romance scenes benefit from sparkly effects, flower motifs, and warm lighting. Dark fantasy demands gritty textures, harsh shadows, and gothic architectural elements. Fantasy/isekai worlds need vibrant colors, magical particle effects, and elaborate costume designs. Mecha scenarios require precise mechanical detail, industrial backgrounds, and dramatic perspective shots. Sports scenes emphasize fluid motion lines and competitive intensity. Comedy allows for chibi deformation and exaggerated reactions. Psychological themes use unsettling compositions, stark contrasts, and symbolic imagery. Always prioritize: large expressive eyes with detailed iris patterns, clean vector-like linework, flat cel-shading with minimal gradients, dynamic camera angles, meticulously detailed backgrounds that support the narrative, and compositions that convey emotion through visual storytelling.",
    fluxFragment:
      'Anime art style, cel shading, clean line art, expressive large eyes, dynamic pose, detailed background, vibrant colors, manga influence, Japanese animation, emotional composition',
  },
  {
    key: 'lego',
    label: 'LEGO',
    directive:
      "The LEGO art style recreates scenes using distinctive interlocking plastic bricks and minifigures arranged on baseplates. Visual elements include the characteristic circular studs on brick surfaces, creating a textured, geometric appearance. Colors are vibrant and saturated, matching LEGO's standardized palette of primary and secondary hues with slight plastic sheen. Lighting mimics professional product photography with even illumination, soft shadows, and minimal harsh contrasts. Minifigures feature cylindrical heads, C-shaped hands, and articulated limbs with printed facial expressions and clothing details. Architecture and objects maintain blocky, angular forms due to brick limitations, with clever techniques like studs-not-on-top (SNOT) building visible in advanced constructions. Baseplates provide green, gray, or blue foundations with visible stud patterns. Composition follows diorama principles with clear focal points and layered depth. Textures combine smooth plastic surfaces with the tactile quality of interlocking elements. Scale relationships maintain LEGO's minifigure-to-environment proportions, creating a distinctly miniaturized world that feels both playful and meticulously constructed.",
    fluxFragment:
      'LEGO brick construction, plastic minifigures, visible studs, baseplate diorama, snap-together blocks, vibrant colors, product photography lighting, geometric shapes, interlocking elements, miniature scale',
  },
  {
    key: 'claymation',
    label: 'Claymation',
    directive:
      'Claymation style features handcrafted clay figures with distinctive plasticine textures showing subtle fingerprint marks and tool impressions. Characters have exaggerated proportions with large eyes, rounded forms, and slightly imperfect surfaces that reveal the malleable medium. The aesthetic includes visible seams, slight asymmetries, and organic deformations that give life to the sculpted forms. Lighting is typically warm and diffused, creating soft shadows that emphasize the three-dimensional clay surfaces without harsh contrasts. Color palettes tend toward muted, earthy tones with occasional bright accent colors, reflecting the natural clay base. Backgrounds feature miniature handbuilt sets with forced perspective, tiny props, and scaled environments that appear slightly oversized relative to characters. Compositions often include close-up character shots showing clay texture details, with depth of field effects mimicking stop-motion camera work. The overall look should convey the charming imperfections and tactile quality of hand-animated clay, with surfaces that appear soft, pliable, and lovingly crafted by human hands.',
    fluxFragment:
      'claymation, stop-motion animation, plasticine clay texture, handcrafted figures, miniature sets, soft diffused lighting, muted earthy colors, fingerprint marks, sculpted surfaces, rounded forms',
  },
  {
    key: '3d_cartoon',
    label: '3D Cartoon',
    directive:
      'Create imagery in the polished 3D cartoon style characteristic of major animation studios like Pixar, DreamWorks, and Illumination. Emphasize exaggerated proportions with oversized heads, expressive large eyes, and stylized body shapes that prioritize appeal over realism. Characters should have smooth, rounded forms with soft edges and pleasant silhouettes. Use clean, geometric modeling without visible polygonal edges. Apply vibrant, saturated color palettes with clear color separation and minimal muddy tones. Lighting should be bright and even, with soft shadows that enhance form rather than create dramatic contrast. Surfaces should have subtle subsurface scattering for skin and organic materials, with crisp but not overly reflective textures. Hair and fur should appear soft and stylized rather than photorealistic. Environments should complement characters with simplified, appealing geometry and clear focal hierarchy. Composition should guide the eye naturally with balanced elements and pleasing negative space. Overall aesthetic should feel warm, inviting, and family-friendly while maintaining professional polish and technical excellence.',
    fluxFragment:
      '3D cartoon, Pixar style, stylized character design, exaggerated proportions, large expressive eyes, vibrant colors, soft lighting, smooth surfaces, family-friendly animation, professional 3D rendering',
  },
  {
    key: '3d_render',
    label: '3D Render',
    directive:
      'Create imagery with Pixar-quality 3D rendering that emphasizes photorealistic materials and advanced lighting techniques. Utilize subsurface scattering for organic surfaces like skin, leaves, and translucent objects to achieve natural light penetration. Implement ray tracing for accurate reflections, refractions, and global illumination that creates realistic environmental lighting. Apply sophisticated cloth simulation for fabric textures showing natural drape, wrinkles, and movement. Surfaces should display tactile qualities with appropriate specularity, roughness, and normal mapping. Character models feature rounded, appealing proportions with smooth topology and expressive facial rigging. Environments showcase rich atmospheric perspective with volumetric lighting effects. Color palettes lean toward saturated yet naturalistic tones with careful attention to color temperature variations. Composition follows cinematic principles with strategic depth of field, emphasizing focal subjects while maintaining environmental context. Avoid flat lighting; instead create dimensional illumination with rim lighting, ambient occlusion, and realistic shadow casting that grounds objects in space.',
    fluxFragment:
      '3D render, subsurface scattering, ray tracing, volumetric lighting, cloth simulation, photorealistic materials, global illumination, depth of field, ambient occlusion, Pixar quality',
  },
  // pencil_sketch removed — Flux can't render authentic pencil sketch style
  {
    key: 'cyberpunk',
    label: 'Cyberpunk',
    directive:
      'Cyberpunk style merges high-tech dystopian futures with gritty urban decay. Saturate scenes with vibrant neon lighting—electric blues, hot magentas, acid greens, and blazing oranges—casting harsh reflections on wet asphalt and chrome surfaces. Employ dramatic chiaroscuro lighting with deep shadows punctuated by artificial light sources. Incorporate vertical compositions emphasizing towering megastructures, holographic advertisements, and sprawling cityscapes shrouded in atmospheric haze or rain. Surface textures should contrast sleek metallic elements with weathered concrete, rusted metal, and grimy glass. Include cybernetic implants, neural interfaces, and technological augmentations seamlessly integrated with organic forms. Color palettes lean heavily into cool blues and teals offset by warm neon accents. Apply film grain and slight digital glitch effects. Architectural elements feature brutalist concrete mixed with sleek glass towers. Weather effects—particularly rain and fog—enhance the moody atmosphere while creating opportunities for dramatic light refraction through droplets and mist.',
    fluxFragment:
      'neon lighting, cyberpunk aesthetic, rain-soaked streets, holographic displays, cybernetic augmentation, dystopian cityscape, electric blue magenta lighting, chrome surfaces, atmospheric haze, digital glitch effects',
  },
  // stained_glass removed — inconsistent results
  {
    key: 'comic_book',
    label: 'Comic Book',
    directive:
      "Comic book art style emphasizes bold, confident black ink outlines with varying line weights to create depth and drama. Linework should be clean and graphic, with thicker contours defining major forms and thinner lines for interior details. Colors are vibrant and saturated, often using flat color fills with minimal gradients. Shading relies on cel-shading techniques with hard shadows and dramatic lighting contrasts. Incorporate Ben-Day dots and halftone patterns for texture and tonal variation, especially in backgrounds and shadow areas. Compositions feature dynamic angles, foreshortening, and exaggerated perspectives typical of superhero comics. Character anatomy is idealized with heroic proportions. Speech bubbles, sound effects, and panel borders may be integrated. Drawing inspiration from Marvel/DC house styles, Jim Lee's detailed cross-hatching, and Todd McFarlane's kinetic energy. Backgrounds can range from detailed cityscapes to simplified graphic elements. The overall aesthetic should capture the printed comic book feel with slight color registration effects and the visual punch of graphic novel illustration.",
    fluxFragment:
      'comic book art, bold ink outlines, cel shading, Ben-Day dots, halftone patterns, vibrant colors, dynamic perspective, graphic novel illustration, superhero comic style, flat color fills, dramatic lighting',
  },
  {
    key: 'embroidery',
    label: 'Embroidery',
    directive:
      'Generate images that replicate the distinctive visual qualities of hand embroidery on fabric. Focus on visible thread textures with slight dimensional quality where stitches create subtle raised surfaces. Colors should appear as embroidery floss would - slightly matte with soft sheen, often in traditional palettes of deep reds, blues, greens, and earth tones. Linework consists of individual stitches forming patterns - straight lines made of running stitches, filled areas using satin stitch with parallel thread lines, dotted textures from French knots, and geometric patterns from cross-stitch. The background should suggest linen or canvas fabric texture with visible weave. Lighting should be soft and even, avoiding harsh shadows but showing gentle dimension from raised stitches. Compositions often feature traditional motifs like florals, geometric borders, or folk art patterns. Include slight imperfections typical of handwork - minor variations in stitch tension and spacing. The overall aesthetic should feel crafted, intimate, and tactile with the warm, homemade quality characteristic of traditional needlework.',
    fluxFragment:
      'hand embroidery, visible thread texture, fabric background, cross-stitch, satin stitch, French knots, needlework, textile art, linen canvas, embroidery floss, traditional stitching, raised thread dimension, folk art patterns',
  },
  {
    key: 'disney',
    label: 'Storybook',
    directive:
      "Create artwork in the Disney Renaissance 2D animation style, emphasizing hand-drawn cel animation aesthetics from classics like The Lion King, The Little Mermaid, and Aladdin. Use Glen Keane-inspired character design with soft, flowing linework that varies in weight—bold outlines for main subjects, delicate details for facial features. Apply rich, saturated colors with subtle gradients and warm lighting that creates emotional depth. Employ traditional cel-shading techniques with minimal texture, focusing on clean color fills and strategic highlights. Composition should follow Disney's cinematic framing with dynamic poses that convey personality and emotion. Characters feature expressive, large eyes with detailed pupils and reflective highlights. Backgrounds use atmospheric perspective with softer, muted tones to support foreground elements. Incorporate Disney's signature volumetric lighting effects, particularly rim lighting and warm ambient glows. Hair and fabric should flow naturally with graceful curves. Maintain the polished, theatrical quality of Disney Renaissance films with careful attention to silhouette clarity and emotional storytelling through visual design.",
    fluxFragment:
      'Disney Renaissance style, hand-drawn cel animation, Glen Keane character design, soft flowing linework, variable line weights, rich saturated colors, cel-shading, warm cinematic lighting, expressive large eyes, volumetric lighting effects, atmospheric perspective, theatrical composition, flowing hair and fabric',
  },
  {
    key: 'sack_boy',
    label: 'Sack Boy',
    directive:
      'Create images in the distinctive Sack Boy aesthetic from LittleBigPlanet, emphasizing handcrafted miniature world construction. All elements should appear made from real craft materials: knitted wool textures for characters, corrugated cardboard for architecture, felt fabric for landscapes, and mixed media details like buttons, zippers, ribbon, and stitching. Lighting should be soft and warm, mimicking photography of physical dioramas with subtle depth-of-field blur. Colors are rich but slightly muted, as if filtered through fabric textures. Surfaces show realistic material properties—visible knit patterns, cardboard grain, felt fuzz, and imperfect handmade edges. Composition follows miniature photography principles with intimate framing and tabletop-scale perspective. Characters have simple geometric forms with visible seam lines and stuffing bulges. Environmental details include craft supplies as architectural elements: safety pins as structural beams, thread spools as columns, fabric patches as terrain. Maintain the charming imperfection of handmade crafts while ensuring everything looks photographically real rather than digitally rendered.',
    fluxFragment:
      'knitted fabric texture, handmade craft materials, cardboard architecture, felt landscape, button details, zipper trim, miniature diorama photography, soft warm lighting, shallow depth of field, visible stitching, wool yarn texture',
  },
  {
    key: 'plushie',
    label: 'Plushie',
    directive:
      "Create images in a plush stuffed animal aesthetic where everything looks like it was sewn from soft fabric. Characters and creatures are round, huggable plush toys with visible seam lines, embroidered features, and button or bead eyes. Surfaces show realistic fabric textures—velvet, fleece, corduroy, minky, cotton—with visible stitching holding pieces together. Stuffing gives forms a soft, slightly lumpy, squeezable quality. Colors are warm and inviting, like a well-loved toy collection. Lighting is soft and cozy, as if photographed in a child's bedroom or toy shop. Environmental elements are also plush—felt flowers, fabric trees, quilted skies, pillow mountains. Details include ribbon bows, sewn-on patches, embroidered smiles, and yarn hair. Everything maintains the handmade, imperfect charm of a lovingly crafted stuffed animal. Proportions are rounded and simplified, emphasizing cuteness and huggability over realism.",
    fluxFragment:
      'plush stuffed animal, soft fabric texture, visible stitching, button eyes, embroidered features, fleece and velvet materials, round huggable forms, cozy warm lighting, handmade toy aesthetic, sewn seam lines, stuffed and soft, felt details',
  },
  {
    key: 'funko_pop',
    label: 'Funko Pop',
    directive:
      'Create images in the distinctive Funko Pop vinyl collectible style featuring characters with dramatically oversized heads (roughly 2:1 head-to-body ratio) and compact, simplified bodies. Eyes are rendered as solid black dots positioned high on the face, with no visible mouth or minimal facial features. The aesthetic emphasizes clean, rounded geometric forms with smooth surfaces that mimic glossy vinyl plastic. Colors should be bold, saturated, and uniform with minimal gradients or shading. Lighting mimics product photography with soft, even illumination that creates subtle highlights on the curved surfaces, emphasizing the toy-like plastic sheen. Eliminate fine details, wrinkles, or texture complexity in favor of simplified shapes and solid color blocks. Character clothing and accessories should be reduced to essential elements with thick, simplified forms. The overall composition should center the figure prominently against neutral backgrounds, maintaining the collectible toy presentation. Surface reflections should be minimal but present to reinforce the vinyl material quality. Proportions must remain consistently stylized across all subjects.',
    fluxFragment:
      'funko pop style, vinyl collectible figure, oversized head, tiny body, dot eyes, no mouth, glossy plastic surface, simplified geometric forms, bold saturated colors, product photography lighting, toy aesthetic, rounded shapes, smooth surfaces',
  },
  {
    key: 'ghibli',
    label: 'Ghibli',
    directive:
      'Studio Ghibli style embodies hand-crafted warmth through soft, organic linework that flows naturally rather than appearing rigid or digital. Characters feature rounded, expressive faces with large, emotive eyes and gentle expressions. Backgrounds are meticulously detailed with watercolor-like textures, showing visible brushstrokes and color bleeding that creates atmospheric depth. Skies are particularly luminous, often featuring dramatic cloud formations in warm oranges, pinks, and soft blues. Nature appears alive and breathing—grass sways with personality, trees have character, and even buildings seem organic. Lighting is soft and golden, creating a nostalgic, dreamlike quality that suggests late afternoon or early morning. Colors are rich but muted, favoring earth tones, forest greens, and warm pastels. Compositions emphasize vast, sweeping landscapes that dwarf characters, creating a sense of wonder and scale. Architecture blends whimsical European influences with Japanese elements. Every element—from floating dust motes to rustling leaves—contributes to a world that feels magical yet grounded, fantastical yet believable, always radiating comfort and wonder.',
    fluxFragment:
      'Studio Ghibli style, hand-painted watercolor backgrounds, soft organic linework, warm golden lighting, atmospheric depth, whimsical architecture, living nature, muted earth tones, nostalgic dreamy quality',
  },
  {
    key: 'tim_burton',
    label: 'Gothic',
    directive:
      "Tim Burton's distinctive style blends gothic romanticism with whimsical darkness, creating a hauntingly beautiful aesthetic. Emphasize dramatically elongated, thin figures with exaggerated proportions—oversized heads, spindly limbs, and skeletal frames. Characters should have large, expressive eyes often sunken or shadowed, pale complexion, and wild, unkempt hair. Incorporate signature spiral motifs throughout compositions—in architecture, landscapes, trees, and decorative elements. Favor a monochromatic palette dominated by blacks, whites, and grays, with occasional pops of muted colors like deep purples, sickly greens, or blood reds. Include bold black and white stripes on clothing, architecture, or environmental elements. Lighting should be theatrical and dramatic, creating stark contrasts with deep shadows and ethereal glows. Linework should be fluid and organic, avoiding rigid geometric shapes. Textures should feel hand-crafted and slightly imperfect. Compositions should emphasize vertical elements, twisted forms, and asymmetrical balance. Architecture should feature crooked angles, impossibly tall structures, and Victorian gothic influences mixed with carnival-like elements.",
    fluxFragment:
      'Tim Burton style, gothic whimsy, elongated thin figures, spiral motifs, black white stripes, dramatic shadows, pale complexion, skeletal proportions, dark romanticism, theatrical lighting, monochromatic palette',
  },
  {
    key: 'pop_art',
    label: 'Pop Art',
    directive:
      "Pop Art transforms everyday subjects into bold, graphic statements using commercial art techniques. Employ flat, saturated colors—particularly bright primaries (red, blue, yellow) and electric secondaries (hot pink, lime green, orange). Use hard-edged, clean linework with minimal shading or dimensional modeling. Incorporate Ben-Day dots (mechanical printing dots) as texture and shading method, especially in skin tones and shadows. Apply high contrast lighting that flattens forms rather than creating depth. Composition should be direct and frontal, often using repetition, grid layouts, or serial imagery like Warhol's multiples. Embrace screen-printing aesthetics with registration marks, color separations, and mechanical printing artifacts. Reference comic book illustration techniques—thick black outlines, speech bubbles, and halftone patterns like Lichtenstein. Include mass-produced, consumer culture elements. Color palettes should appear artificial and hyper-saturated, rejecting naturalistic rendering. Typography, when present, should use bold, sans-serif fonts. Overall aesthetic must feel machine-made rather than hand-crafted, celebrating commercial reproduction methods while maintaining the energy and accessibility that defined Haring's public art approach.",
    fluxFragment:
      'pop art style, Ben-Day dots, halftone pattern, bold flat colors, high contrast, clean hard lines, screen printing aesthetic, comic book style, saturated primaries, mechanical reproduction, commercial art technique',
  },
  {
    key: 'minecraft',
    label: 'Minecraft',
    directive:
      "Create images in Minecraft's distinctive voxel-based aesthetic. Everything must be constructed from cubic blocks in a 3D grid system. Use pixelated, low-resolution textures with visible pixel boundaries and no anti-aliasing. Colors should be vibrant but limited to Minecraft's palette - earth tones, bright primaries, and desaturated natural hues. Lighting appears flat and ambient with subtle directional shadows that align to block edges. All objects, characters, animals, and landscapes must be built from recognizable cubic components - no smooth curves or organic shapes allowed. Textures should have a hand-painted, pixelated quality with visible repetition patterns typical of game sprites. Maintain the slightly isometric perspective common in Minecraft screenshots. Composition should emphasize the blocky, constructed nature of the world. Water appears as animated blue blocks, fire as flickering orange-yellow cubes. Characters have rectangular heads, bodies, and limbs. The overall aesthetic should feel like an in-game screenshot with crisp, digital clarity and the unmistakable chunky, geometric construction that defines Minecraft's visual identity.",
    fluxFragment:
      'minecraft style, voxel art, cubic blocks, pixelated textures, blocky 3D, low-poly geometric, 16-bit pixel art, game screenshot aesthetic, cubic construction, digital blocks',
  },
  {
    key: '8bit',
    label: 'Retro Gaming',
    directive:
      'This style emulates classic 8-bit console graphics from the NES era, characterized by severe technical limitations that create distinctive visual charm. Use extremely restricted color palettes of 4-16 colors maximum per sprite or tile, with colors chosen from the classic NES 54-color spectrum. All imagery must display prominent pixelation with large, chunky square pixels clearly visible - no smoothing or anti-aliasing whatsoever. Construct visuals using repetitive tile patterns for backgrounds and environments, mimicking hardware sprite limitations. Linework should be bold and simplified, using single-pixel-wide lines or thick 2-3 pixel borders. Shading relies on dithering patterns and flat color zones rather than gradients. Lighting effects are minimal and stylized through palette swaps or simple highlight pixels. Character designs feature simplified, iconic silhouettes with minimal detail but maximum readability at low resolution. Backgrounds use repeating geometric patterns and basic architectural shapes. Composition should feel structured and grid-based, reflecting the tile-based construction of classic games. Colors are saturated and high-contrast, with black outlines separating elements for clarity.',
    fluxFragment:
      '8-bit pixel art, NES graphics, chunky pixels, limited color palette, no anti-aliasing, dithered shading, tile patterns, retro gaming, pixelated sprites',
  },
  {
    key: 'paper_cutout',
    label: 'Paper Cutout',
    directive:
      'Create images with distinct layered paper construction aesthetics. Emphasize flat, geometric shapes cut from colored construction paper with visible scissor-cut edges that show slight roughness and imperfection. Build compositions through multiple paper layers at varying depths, creating pronounced cast shadows between each level. Use bold, saturated colors typical of craft paper - primary blues, reds, yellows alongside pastels and earth tones. Avoid gradients; maintain solid, uniform color fills within each paper element. Show subtle paper texture with slight fiber visibility and matte finish. Create depth through overlapping layers rather than perspective, with sharper shadows closer to background layers. Include craft table details like small paper scraps, slight curl at paper edges, and occasional visible adhesive marks. Lighting should be even and diffused, mimicking indoor craft lighting that enhances the layered shadow effect. Compositions should feel deliberately constructed and handmade, with slightly imperfect alignment that suggests human craftsmanship rather than machine precision.',
    fluxFragment:
      'paper cutout, layered paper diorama, construction paper, scissor cut edges, craft paper shadows, paper craft aesthetic, layered depth, flat geometric shapes, handmade paper art',
  },
  {
    key: 'retro_poster',
    label: 'Retro Poster',
    directive:
      'The Retro Poster style draws from 1950s-60s travel advertisements, vintage movie posters, and mid-century graphic design. Employ a deliberately limited color palette of 3-5 saturated hues, often featuring warm oranges, teals, creams, and deep reds. Typography should be bold, geometric, and integrated into the composition—think chunky sans-serifs and stylized script fonts. Linework is clean and confident with strong outlines defining shapes. Apply flat, solid color fills with minimal gradients, mimicking screen-printing techniques. Include subtle halftone textures and paper grain effects for authentic vintage feel. Composition should be balanced yet dynamic, using strong geometric divisions and negative space effectively. Lighting is simplified—avoid complex shadows, instead use solid color blocks to suggest dimension. Illustrations should be stylized rather than photorealistic, with simplified forms and bold silhouettes. Incorporate decorative elements like starbursts, ribbons, or geometric patterns that enhance without cluttering the design.',
    fluxFragment:
      'retro poster style, vintage travel poster, mid-century graphic design, limited color palette, bold typography, screen print texture, flat colors, geometric composition, halftone effects, stylized illustration, 1950s aesthetic',
  },
  {
    key: 'childrens_book',
    label: "Children's Book",
    directive:
      "Create illustrations in the classic children's book style characterized by warm, inviting visuals that balance whimsy with emotional depth. Employ soft, organic linework that varies in weight — thick, confident outlines for main subjects transitioning to delicate details. Use a palette of muted, earthy tones punctuated by selective bright accents that draw the eye to focal points. Incorporate visible texture through techniques like watercolor bleeds, colored pencil grain, collage elements, or gouache brushstrokes that maintain hand-crafted authenticity. Lighting should be gentle and diffused, creating cozy atmospheres with warm shadows rather than harsh contrast. Compose scenes with generous white space and asymmetrical balance, allowing breathing room around characters. Characters should have expressive, oversized features with simple geometric shapes forming bodies. Backgrounds blend realistic and fantastical elements, often simplified to support rather than compete with foreground action. Embrace imperfections like slightly wobbly lines or color bleeding beyond borders — these flaws enhance the human touch essential to storybook charm.",
    fluxFragment:
      "children's book illustration, soft watercolor, hand-painted texture, gentle lineart, storybook style, warm lighting, whimsical characters, muted earth tones, organic brushstrokes, cozy atmosphere",
  },
  {
    key: 'vaporwave',
    label: 'Vaporwave',
    directive:
      'Vaporwave embodies nostalgic 80s-90s digital aesthetics through saturated neon color palettes dominated by hot pink, electric cyan, and deep purple gradients. Compositions feature dreamy sunset/sunrise gradients with horizontal scan lines mimicking CRT displays. Key visual elements include glitched digital artifacts, pixelated textures, and chromatic aberration effects. Classical Greek marble statues and columns serve as ironic juxtapositions against futuristic elements. Palm trees silhouetted against geometric sun shapes create tropical retrofuturism. Typography uses bold, angular fonts with chrome or neon effects. Lighting is atmospheric with lens flares, soft glows, and volumetric beams. Textures combine smooth gradients with deliberately corrupted digital noise, VHS static, and low-resolution pixelation. Grid patterns, wireframe elements, and geometric shapes add structure. The overall composition balances dreamy softness with sharp digital edges, creating an artificial paradise aesthetic that feels both nostalgic and otherworldly. Colors should appear oversaturated as if viewed through vintage computer monitors.',
    fluxFragment:
      'vaporwave aesthetic, neon pink cyan purple gradients, CRT scan lines, glitch art, Greek marble statue, palm trees, geometric sunset, chrome text, VHS static, retrofuturism, 80s nostalgia',
  },
  {
    key: 'fantasy',
    label: 'Fantasy',
    directive:
      "Fantasy art embodies epic storytelling through dramatic visual elements. Compositions feature sweeping, cinematic perspectives with deep atmospheric perspective and layered depth. Lighting is theatrical and magical—golden hour warmth, ethereal glows, dramatic rim lighting, and supernatural illumination effects like glowing weapons or mystical auras. Color palettes blend rich earth tones (deep browns, forest greens, stone grays) with vibrant accent colors (glowing blues, fiery oranges, mystical purples). Textures are highly detailed and tactile: weathered leather, gleaming metal, rough stone, flowing fabric, and organic surfaces. Linework ranges from sharp, defined edges on architecture and weapons to soft, painterly brushstrokes for atmospherics and backgrounds. Compositions utilize dynamic diagonal lines, heroic low-angle perspectives, and elaborate environmental storytelling. Elements include ancient architecture, mystical creatures, ornate weapons and armor, flowing robes, and dramatic skies. The overall aesthetic balances photorealistic rendering with stylized, idealized proportions reminiscent of Frazetta's heroic figures and Mullins' atmospheric mastery.",
    fluxFragment:
      'fantasy art, epic fantasy, dramatic lighting, atmospheric perspective, magical glow effects, rich earth tones, detailed textures, heroic composition, cinematic framing, painterly brushstrokes, mystical atmosphere',
  },
  {
    key: 'ukiyo_e',
    label: 'Ukiyo-e',
    directive:
      "Ukiyo-e represents the pinnacle of Japanese woodblock printing from the Edo period, exemplified by masters like Hokusai and Hiroshige. This style features bold, confident black ink outlines that define all forms with calligraphic precision. Colors are applied in flat, unmodulated areas within these outlines—vibrant blues derived from Prussian blue pigments, rich reds, yellows, and greens with no gradual shading or Western-style modeling. Compositions emphasize strong diagonal lines, asymmetrical balance, and dramatic cropping that cuts figures at frame edges. The characteristic wood-grain texture should be visible throughout, creating subtle linear patterns in solid color areas. Lighting is conceptual rather than naturalistic—no cast shadows or directional light sources. Subjects range from landscapes with stylized clouds and waves (like Hokusai's Great Wave) to portraits of kabuki actors and courtesans. Perspective flattens space into decorative planes. Fine parallel lines indicate texture in hair, water, and fabric through careful hatching techniques. The overall aesthetic balances decorative pattern-making with narrative clarity, creating images that read as both realistic scenes and abstract designs.",
    fluxFragment:
      'Japanese woodblock print, ukiyo-e style, flat colors, bold black outlines, wood-grain texture, Edo period, stylized waves, diagonal composition, no shadows, decorative patterns',
  },
  {
    key: 'art_deco',
    label: 'Art Deco',
    directive:
      "Art Deco embodies the glamorous sophistication of the 1920s-30s Jazz Age, characterized by bold geometric patterns, streamlined forms, and luxurious materials. Emphasize sharp, angular lines with stepped pyramid motifs, sunburst patterns, and zigzag designs. Color palettes should feature rich metallics—especially gold, silver, and copper—contrasted against deep blacks, emerald greens, and dramatic jewel tones. Lighting should be dramatic and theatrical, with strong contrasts between light and shadow creating sculptural depth. Compositions follow symmetrical, vertical arrangements with emphasis on height and grandeur, mirroring iconic architecture like the Chrysler Building. Incorporate sleek, stylized figures reminiscent of Tamara de Lempicka's portraits and Erte's fashion illustrations. Surfaces should appear polished and reflective—marble, chrome, lacquer—with crisp edges and minimal texture variation. Typography and decorative elements feature bold, condensed letterforms and ornamental flourishes. The overall aesthetic celebrates machine-age precision while maintaining opulent elegance, capturing the era's optimism through streamlined luxury and geometric sophistication.",
    fluxFragment:
      'art deco, geometric patterns, gold metallic, black contrast, angular lines, sunburst motifs, stepped pyramids, streamlined forms, 1920s glamour, polished surfaces, dramatic lighting, symmetrical composition',
  },
  {
    key: 'steampunk',
    label: 'Steampunk',
    directive:
      'Steampunk visual style combines Victorian-era elegance with anachronistic steam-powered technology. Emphasize brass, copper, and bronze metalwork with intricate mechanical details—exposed gears, clockwork mechanisms, pressure gauges, and pneumatic tubes. Incorporate rich leather textures, mahogany wood, and aged patina on metal surfaces. Lighting should feature warm amber glows from gas lamps, furnace fires, and electrical Tesla coils, creating dramatic chiaroscuro effects with deep shadows and golden highlights. Color palette centers on sepia tones, burnt oranges, deep browns, and oxidized greens, with occasional bright copper accents. Compositions should showcase elaborate mechanical contraptions—airships with balloon envelopes and wooden hulls, difference engines with exposed computational wheels, steam-powered automata, and laboratory apparatus with glass tubes and electrical arcs. Include period-appropriate fashion: corsets, top hats, brass goggles, leather gloves, and military-inspired tailcoats with mechanical embellishments. Textures should appear weathered and industrial, with visible rivets, steam emissions, and mechanical wear patterns throughout the scene.',
    fluxFragment:
      'steampunk, brass gears, copper pipes, Victorian machinery, clockwork mechanisms, steam-powered, airships, Tesla coils, sepia tones, mechanical contraptions, brass goggles, leather textures, industrial patina, amber lighting, pneumatic tubes',
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
export const CURATED_MEDIUMS = DREAM_MEDIUMS.filter((m) => m.directive !== null);

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
  'plushie',
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
  'photorealistic',
  'surreal',
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
