-- Migration 137: Legacy medium normalization
--
-- Two goals:
-- 1. Rename existing kebab-case bot-only mediums to snake_case so the DB
--    naming convention is consistent (snake_case across the board).
-- 2. Add proper rows in dream_mediums for legacy keys that exist on
--    historical uploads but never had DB rows (bot-only retired mediums:
--    ToyBot figure family, GothBot painterly family, BloomBot painterly,
--    AncientBot, StarBot oils, OceanBot maritime oils). All marked
--    is_active=false + is_bot_only=true so they:
--      - DON'T appear in the user-facing medium picker (is_active gate)
--      - DO resolve in the engine (resolveMediumFromDb fetches both via
--        is_active=true OR is_bot_only=true)
--    This means DLT against legacy posts now resolves the source's
--    medium properly, picks the right character_render_mode (so face-swap
--    eligibility is correct), and produces a faithful recreation.
--
-- Companion script: scripts/remap-legacy-mediums.js handles the
-- uploads.dream_medium remapping for model-prefix variants and synonyms.

-- ─────────────────────────────────────────────────────────────────────
-- Part A: Rename kebab-case → snake_case for existing bot-only rows
-- ─────────────────────────────────────────────────────────────────────
-- These already exist with hyphens; rename to underscores so the DB
-- convention is consistent. The companion script's UPDATE handles
-- existing uploads.dream_medium values.

UPDATE public.dream_mediums SET key = 'gothic_realistic' WHERE key = 'gothic-realistic';
UPDATE public.dream_mediums SET key = 'gothic_whimsy'    WHERE key = 'gothic-whimsy';

-- ─────────────────────────────────────────────────────────────────────
-- Part B: Insert legacy bot-only mediums that never had DB rows
-- ─────────────────────────────────────────────────────────────────────
-- All inactive (hidden from picker) but bot_only=true so the engine
-- still resolves them. character_render_mode chosen to make face-swap
-- eligibility correct on DLT (embodied = no face-swap; natural = swap ok).

-- ── GothBot legacy family (drawing/painted style — natural; face-swap WILL fire on DLT) ──

INSERT INTO public.dream_mediums (key, label, directive, flux_fragment, character_render_mode, face_swaps, is_active, is_bot_only, is_public, sort_order) VALUES
('vampire_portrait',
 'Vampire Portrait',
 'Gothic vampire portrait painting in the classical Renaissance and Baroque tradition. Oil-on-canvas painted portraits with deep chiaroscuro lighting — pale gothic skin tones, blood-tinged crimson accents, candlelit shadows, intense direct gaze. Painterly brushwork with rich layered glazes. Ornate framing details where appropriate. Composition: classical portrait centered on the subject, three-quarter view, dramatic single-source illumination from one side leaving the other in deep shadow. Mood: aristocratic, ancient, beautifully menacing. Avoid horror-movie gore — this is high-art gothic romance, not slasher imagery.',
 'oil-painted gothic vampire portrait, chiaroscuro lighting, pale skin, crimson accents, painterly brushwork, classical Renaissance composition',
 'natural', true, false, true, true, 999),

('gothic_painted',
 'Gothic Painted',
 'Gothic painted illustration in the spirit of dark fairy-tale oil painting. Castlevania-meets-gothic-romance aesthetic: deep shadow palette, crimson and midnight accents, painterly brushwork on textured canvas. Atmospheric fog, candlelight, ornate baroque detail in costume and environment. Composition can include figures, architecture, or both. Mood: gothic romance and elegant horror — beautiful darkness, never campy. Subjects rendered with classical painted realism softened by atmospheric haze.',
 'gothic oil painting, Castlevania mood, painterly brushwork, dark crimson and midnight palette, atmospheric fog, baroque detail',
 'natural', true, false, true, true, 999),

('gothic_oil_garden',
 'Gothic Oil Garden',
 'Gothic painted garden scene in oil-painting tradition. Overgrown estate gardens at twilight or moonlight — wrought iron arches, black roses, pale lilies, deep purples and crimsons. Candlelit pathways winding through dense foliage. Victorian estate ambience with abandoned-aristocratic decay. Painted in classical oil-on-canvas style with rich brushwork, atmospheric depth, soft fog. Mood: eerie romance, secret garden meets Edgar Allan Poe.',
 'gothic oil painting, twilight estate garden, black roses, candlelit pathways, atmospheric fog, painterly brushwork, Victorian decay',
 'natural', true, false, true, true, 999),

('gothic_architecture',
 'Gothic Architecture',
 'Gothic architectural painting — towering cathedrals, castles, ruined abbeys, crypts. Dramatic vertical compositions emphasizing scale and verticality. Oil-painted stone textures, atmospheric fog, moonlight cutting through arches and buttresses. No characters in scene — pure architectural grandeur. Painterly classical style with epic scale. Mood: ancient, awe-inspiring, slightly menacing.',
 'gothic cathedral oil painting, towering vertical composition, moonlit stone, atmospheric fog, painterly brushwork, epic architectural grandeur',
 'natural', false, false, true, false, 999),

-- ── ToyBot legacy figure family (embodied — face-swap correctly skipped on DLT) ──

('gi_joe_figures',
 'GI Joe Figures',
 'Action figure aesthetic in the classic 80s/90s GI Joe tradition. 3.75-inch posable plastic action figures with painted military detail, articulated joints clearly visible, battle-worn paint texture, modeled gear and weapons in plastic. Athletic broad-shouldered proportions, classic action-hero design language. Photographed in dramatic dioramic settings or studio toy-photography lighting. Plastic surface texture, slight wear, painted facial features.',
 'classic GI Joe action figure aesthetic, posable plastic toy, painted military detail, articulated joints visible, battle-worn texture, toy photography',
 'embodied', false, false, true, true, 999),

('shortcake_figures',
 'Shortcake Figures',
 'Strawberry Shortcake style figure aesthetic — small plastic dolls (3-5 inches) with oversized heads, simple stylized features, soft plastic in candy-bright pastel colors. Glittery accents, scented-toy aesthetic, pastel rainbow palette (strawberry pink, lemon yellow, mint, lavender). Photographed with bright cheerful lighting, soft focus. Mood: nostalgic 80s toy-shelf charm.',
 'Strawberry Shortcake figure style, small plastic doll, oversized head, pastel rainbow palette, glittery accents, candy-bright',
 'embodied', false, false, true, true, 999),

('action_hero_figures',
 'Action Hero Figures',
 'Muscle-bound 90s action figure aesthetic — exaggerated heroic proportions, painted plastic with hyper-detailed musculature, vibrant primary-color paint applications. Articulated joints visible, posed dynamically. Dramatic toy-photography lighting on glossy plastic surfaces. Mood: heroic toy-shelf bombast, Saturday-morning cartoon energy made physical.',
 '90s action hero figure, muscular plastic toy, vibrant primary colors, articulated joints, dynamic pose, glossy plastic, dramatic toy photography',
 'embodied', false, false, true, true, 999),

('army_men',
 'Army Men',
 'Classic plastic toy soldier aesthetic — mono-color (army green or olive drab), no painted details, simple molded plastic forms. Frozen in classic action poses (rifle aimed, grenade-throwing, prone). Slight surface wear from play, bare plastic texture. Photographed in dioramic backyard/sandbox settings or studio with natural daylight. Mid-century American toy aesthetic — pure nostalgia, simple geometry.',
 'classic plastic toy soldier, mono-color army green, simple molded plastic, frozen action poses, mid-century toy aesthetic',
 'embodied', false, false, true, true, 999),

('burton_puppet',
 'Burton Puppet',
 'Stop-motion puppet aesthetic in the Tim Burton / Henry Selick tradition. Exaggerated spindly proportions, sunken stitched eyes, jointed armature occasionally visible at limb joints, fabric/clay/silicone material surface. Expressive sculpted faces with theatrical exaggeration. Gothic whimsy, dark fairy-tale energy. Photographed with deep shadows and atmospheric haze, moody single-source lighting.',
 'Tim Burton stop-motion puppet, spindly proportions, stitched eyes, fabric and clay surface, gothic whimsy, atmospheric haze',
 'embodied', false, false, true, true, 999),

('tabletop_minis',
 'Tabletop Miniatures',
 'Hand-painted tabletop miniature aesthetic at 28-32mm scale. Fine detail brushwork on resin/plastic figures, individually painted features, dramatic single-light source revealing painted highlights. Ornate sculpted bases. Dungeons-and-Dragons / Warhammer style — fantasy or sci-fi figures with intense painted detail despite small scale. Mood: precious, hand-crafted, hobbyist devotion.',
 'painted tabletop miniature, 28mm scale, fine brush detail, dramatic lighting, ornate base, Warhammer / D&D style',
 'embodied', false, false, true, true, 999),

('barbie_figures',
 'Barbie Figures',
 'Fashion doll aesthetic — smooth molded plastic, glossy painted features, articulated body, fashion-forward outfits. Stylized proportions (long legs, narrow waist, oversized head), pristine doll perfection. Photographed studio-style with bright clean lighting on glossy plastic surfaces. Vibrant fashion palette, perfect hair, perfect makeup. Mood: aspirational toy-aisle glamour.',
 'Barbie fashion doll, glossy plastic, articulated body, stylized proportions, vibrant fashion outfit, pristine studio toy photography',
 'embodied', false, false, true, true, 999),

('calico_figures',
 'Calico Figures',
 'Calico Critters / Sylvanian Families aesthetic — flocked plastic woodland creatures with soft-textured velvety surface. Oversized heads with simple painted features (small dot eyes, tiny nose, gentle expression). Charming wholesome storybook quality, soft pastel palette. Often dressed in tiny vintage clothing. Photographed in cozy miniature dioramas, warm soft lighting. Mood: cottagecore tenderness made tactile.',
 'Calico Critters flocked figure, velvety surface, oversized head with painted features, miniature vintage clothing, soft pastel palette, cottagecore',
 'embodied', false, false, true, true, 999),

('action_figure',
 'Action Figure',
 'Generic posable plastic action figure aesthetic — articulated joints visible, painted plastic detail, 6-8 inch scale. Dynamic posed scenes, 90s/2000s action figure aesthetic. Glossy plastic surfaces, vibrant paint applications, modeled accessories. Photographed with theatrical toy-photography lighting.',
 'plastic action figure, articulated joints, painted detail, glossy plastic, dynamic pose, toy photography',
 'embodied', false, false, true, true, 999),

('stitched',
 'Stitched',
 'Embroidered fabric character aesthetic — raised thread embroidery on linen or cotton backdrop, visible stitching detail in characters and surroundings, soft cloth texture. Handcrafted folk-art feel with slightly imperfect handmade quality. Warm thread colors with traditional palette (cream, sage, rust, navy). Composition mimics traditional embroidery samplers — bordered, decorative, slightly flat perspective.',
 'embroidered fabric, raised thread stitching, linen backdrop, folk-art aesthetic, warm thread palette, sampler composition',
 'embodied', false, false, true, true, 999),

-- ── Bot painterly mediums (scene-painterly, large painterly compositions) ──

('ancient_epic',
 'Ancient Epic',
 'Epic painted ancient civilization scene in the tradition of Bonestell, Hubert Rogers, and classical history painting. Monumental ruins, towering temples, lost civilizations, oil-on-canvas painterly grandeur. Dramatic atmospheric lighting (golden hour, twilight, lightning storm). Often no people in scene — pure archaeological vista, majesty of scale. Rich saturated oils, painterly brushwork, deep atmospheric perspective.',
 'epic ancient civilization oil painting, monumental ruins, painterly brushwork, dramatic atmospheric light, classical history painting',
 'natural', false, false, true, false, 999),

('star_oil_cosmos',
 'Star Oil Cosmos',
 'Cosmic oil painting in classical sci-fi space-art tradition. Nebulae, alien worlds, distant galaxies painted in rich saturated oils. Bonestell / Hubert Rogers / Chesley Bonestell aesthetic — dramatic celestial lighting, painterly brushwork on cosmic vistas, sense of scale and awe. Deep saturated palette (cosmic blues, alien purples, stellar golds and crimsons).',
 'cosmic oil painting, nebula and alien world, classical space-art aesthetic, painterly brushwork, dramatic celestial lighting, saturated palette',
 'natural', false, false, true, false, 999),

('maritime_oil_classic',
 'Maritime Oil — Classic',
 'Classical maritime oil painting in the Turner / Winslow Homer tradition. Sailing ships at sea, stormy skies, dramatic waves, atmospheric depth. Oil-on-canvas brushwork with palette knife texture for spray and foam. Traditional naval painting composition — horizon line, dramatic sky-to-water ratio, ship as focal element.',
 'classical maritime oil painting, sailing ship at sea, Turner-style brushwork, dramatic stormy sky, atmospheric depth',
 'natural', false, false, true, false, 999),

('maritime_oil_legend',
 'Maritime Oil — Legend',
 'Mythological maritime oil painting featuring legendary sea creatures — krakens, mermaids, sea serpents, leviathans. Classical baroque painted style with dark dramatic seascapes, painterly oil-on-canvas, mythological narrative composition. Subjects emerge from water or fill the sea. Atmospheric haze, dramatic single-source lighting, deep saturated palette.',
 'mythological maritime oil painting, kraken / mermaid / sea creature, baroque painted style, dramatic seascape, atmospheric haze',
 'natural', false, false, true, false, 999),

('maritime_oil_romantic',
 'Maritime Oil — Romantic',
 'Romantic-era maritime oil painting — dreamy seascapes at golden hour, soft painterly brushwork, warm golden light on water and sails. Romanticism-period aesthetic emphasizing emotion and atmosphere over precise detail. Sunset palette, gentle waves, sometimes a small figure or boat for scale.',
 'romantic-era maritime oil painting, golden hour seascape, soft painterly brushwork, warm light, atmospheric',
 'natural', false, false, true, false, 999),

('bloom_conservatory',
 'Bloom Conservatory',
 'Botanical conservatory painting — Victorian greenhouse interior filled with lush tropical and exotic flowers. Oil-on-canvas painterly style, dappled glass-filtered light, rich detail in flora. Atmospheric depth showing rows of plants receding into mist. No characters — pure botanical wonder. Saturated greens, vibrant blooms, warm filtered light.',
 'Victorian conservatory oil painting, lush tropical flowers, dappled glass light, painterly brushwork, botanical detail',
 'natural', false, false, true, false, 999),

('bloom_steampunk_flora',
 'Bloom Steampunk Flora',
 'Steampunk botanical aesthetic — mechanical brass-and-flora hybrid, flowers integrated with clockwork and copper machinery. Oil painting style, warm sepia + saturated bloom palette, Victorian industrial elegance. Brass gears entwined with vines, copper filigree blooming with flowers, mechanical greenhouses.',
 'steampunk botanical, brass-and-flora hybrid, copper clockwork with vines, oil painting, sepia and bloom palette, Victorian industrial',
 'natural', false, false, true, false, 999);
