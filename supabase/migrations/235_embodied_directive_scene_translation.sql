-- Strengthen LEGO + pixels directives with explicit scene-translation
-- guidance. The nightly pure_scene path was producing hybrid renders
-- (LEGO opener + photoreal landscape language → Flux interpreted the
-- photoreal nouns literally and softened the medium). Handcrafted didn't
-- have this problem because its directive already taught cork/sponge/felt/
-- pipe-cleaner translations for natural elements. LEGO + pixels needed
-- the same scene-translation paragraph appended.
--
-- The character framing in each directive is preserved (create-screen
-- character renders still work) — the new content is appended as an
-- additional SCENE TRANSLATION paragraph that fires for landscape /
-- scene-only renders.

UPDATE dream_mediums
SET directive = directive || E'\n\nSCENE TRANSLATION (for landscape / scene-only renders with no characters): Every natural element is rebuilt brick-by-brick. Mountains and cliffs = stepped, blocky basalt-color brick formations with visible plate edges and clearly stepped silhouettes. Water = translucent blue LEGO tile / plate panels (clear blue for shallow, deep blue for ocean, lighter cyan or transparent plates for waves). Sand / beach = tan or yellow flat tile sections. Foliage = green plate pieces stacked on brown cylindrical trunks for palms, green sloped pieces or flower elements for shrubs. Sky = solid color background or a smooth brick backdrop with optional white cloud-brick puffs. Sun and lighting = warm or cool amber tinting on glossy plastic surfaces; shadows cast crisply onto the build''s plate surfaces. Weather = built from translucent or printed brick elements (translucent blue raindrop tiles, white cloud bricks, light rays as transparent yellow plates). NO photoreal atmosphere, NO realistic terrain shading, NO smooth photoreal gradients — every element is a discrete LEGO piece with visible studs / seams / sheen.'
WHERE key = 'lego';

UPDATE dream_mediums
SET directive = directive || E'\n\nSCENE TRANSLATION (for landscape / scene-only renders with no characters): Every natural element is rebuilt in pixel tiles. Mountains and cliffs = clustered pixel blocks with stepped silhouettes and limited dithered shading. Water = animated wave-tile pixel patterns, dithered between two or three blues with hard pixel edges. Sand / beach = tan pixel tile clusters with dithered edges. Foliage = pixel sprite trees (chunky green pixel canopy on brown pixel trunk, single-tile leaves for shrubs). Sky = horizontal pixel band gradients in the era''s palette (8-bit limited 2-4 colors, 16-bit smoother dithered gradients, modern indie palette-rich). Sun and lighting = pixel highlights with hard edges, dithered shadow zones, era-appropriate color count. Weather = pixel rain streaks, cloud sprite clusters, dithered fog tiles, hard-edged lightning sprites. NO smooth gradients beyond the era''s dithering technique, NO photoreal atmospheric blending — every element is grid-aligned pixel work with hard edges and intentional palette discipline.'
WHERE key = 'pixels';
