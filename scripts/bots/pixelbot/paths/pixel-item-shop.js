/**
 * PixelBot pixel-item-shop (Stage K1, SHADOW) — 16-bit cozy RPG shop/tavern interior.
 * Moonlighter/Recettear item-shops, taverns/inns, blacksmith forges, magic libraries;
 * shopkeeper sprite + adventurer customer. shelf_density = money-shot (countable
 * pictorial wares). Camera: interior side-view or 3/4-iso, never first-person.
 * 40%-gated cozy_phenomenon. NO text/signage/price-tags, NO IP names.
 */

module.exports = {
  archetype: 'PIXELBOT_PIXEL_ITEM_SHOP',
  pools: {
    shop_locale: 'PIXELBOT_PIXEL_ITEM_SHOP_SHOP_LOCALE',
    shelf_density: 'PIXELBOT_PIXEL_ITEM_SHOP_SHELF_DENSITY',
    keeper_customer_life: 'PIXELBOT_PIXEL_ITEM_SHOP_KEEPER_CUSTOMER_LIFE',
    cozy_phenomenon: 'PIXELBOT_PIXEL_ITEM_SHOP_COZY_PHENOMENON',
  },
};
